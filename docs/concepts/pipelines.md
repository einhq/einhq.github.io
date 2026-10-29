# Changes and pipelines

This page follows a change through EiN, from the moment a node is saved to the finished work it
sets off: the events every change announces, the facts a module derives from them, the pipelines
that act on those facts, and the audit trail that leads back from each result to the change that
caused it. It is for administrators who want to understand what the **Dashboard** shows, and for
anyone writing a module or a pipeline of their own.

## Every change is announced

When EiN saves a change to the tree, it announces it as an event. Six kinds exist:

| Event            | What happened                                                    | The event names |
| ---------------- | ---------------------------------------------------------------- | --------------- |
| `created`        | A node was made                                                  | the node        |
| `updated`        | A node's attributes, bytes or permissions changed                | the node        |
| `deleted`        | A node's last name went, and the node with it                    | the node        |
| `moved`          | A node was moved or renamed                                      | the node        |
| `child-attached` | Something was put into a folder, by making, linking or moving it | the folder      |
| `child-detached` | Something left a folder, by removing, unlinking or moving it     | the folder      |

Each event goes out under a key made of the node's type and the event,
`system.vfs.<nodeType>.<eventType>`: a photo's new size is `system.vfs.file.updated`, a photo added
to an album `system.vfs.album.child-attached`. Whoever listens binds only the keys it cares about,
so a listener for files never hears about the thousands of small writes a busy system makes
elsewhere. The event is sent only after the change is saved: nothing reacts to a change that did
not happen.

The same write also leaves a record in the audit trail, in the same transaction, so a record
exists exactly when the change does. [Trace a result back to its cause](#trace-a-result-back-to-its-cause)
shows how to read it.

## Modules turn changes into facts

A raw event says that a node changed. Most work needs to know something more specific: that a new
photo has arrived and has not been read yet, or that its metadata is now there. Modules state this
as **facts**, named like `media.file.discovered` or `media.metadata.extracted`, each about one node,
its subject.

The Archive module runs one service for this, `archive-bridge`. It listens for the raw events its
rules need, reads the node as it is now, and writes the facts that follow to `/dev/events`. Because
the bridge reads the node rather than trusting the event, a fact always describes the tree as it
is, whatever order the events arrive in. And because pipeline steps only write to the tree and the
bridge derives the facts from what they wrote, the facts cannot disagree with what is stored.

Some of the facts the Archive announces:

| Fact                          | Announced when                                                        |
| ----------------------------- | --------------------------------------------------------------------- |
| `media.file.discovered`       | A photo, video or recording has its bytes and no metadata yet         |
| `media.file.content-changed`  | The bytes of a file already read have changed                         |
| `media.metadata.extracted`    | A file's metadata has been read                                       |
| `media.face.detected`         | A face has been found on a picture (one fact per face)                |
| `media.faces.completed`       | Face detection is done for a picture, also when it found none         |
| `media.transcript.generated`  | A video or recording has its transcript                               |
| `media.position.available`    | A file has a GPS position                                             |
| `media.album.members-changed` | An album's photos changed                                             |
| `location.changed`            | A location was made, its shape drawn, or a photo linked to it by hand |
| `staging.category.changed`    | The files in a staging category changed                               |

A fact is a line of JSON. Announcing one is writing that line to `/dev/events`; there is no
separate command for it:

```bash
# in EiN's terminal, as an administrator
echo '{"id":"e1","type":"media.file.discovered","subject":"/archive/albums/wrenfield-summer-1987/IMG_0042.jpg","time":1790000000000,"data":{"mimetype":"image/jpeg"}}' > /dev/events
```

`subject` is the node the fact is about, and `data` carries whatever a pipeline needs to decide
whether it applies, such as the file's type. Core announces no facts of its own; without a module
the only events are the raw ones.

## A pipeline says what to do with a change

A **pipeline** is a YAML definition with three parts: the trigger it waits for, the steps it then
runs on the subject, each step a shell command, and options for how it is scheduled. This is the
Archive's `media-fingerprint`, which computes the fingerprints that duplicate detection compares:

```yaml
name: media-fingerprint
description: Compute the fingerprints duplicate detection and photo stacks compare

trigger:
  on: media.metadata.extracted
  skipIfAttr: undecodable

steps:
  fingerprint:
    command: compute-fingerprint $NODE_PATH
    description: SSCD for image / video keyframes, chromaprint for audio
    pool: media
    kind: fingerprint
    priority: 30
    requires:
      cpu: 1

options:
  maxAttempts: 3
  priority: 10
```

It reads: when a file's metadata has been read, and the file is not marked as one nothing can
decode, run `compute-fingerprint` on it, in the `media` pool, as a job of kind `fingerprint` that
needs one CPU slot.

A module ships its pipelines in its `pipelines/` folder, and `mod setup` registers each one when
the module is set up, at every start of EiN. A registered pipeline is a link in
`/var/pipelines/definitions/<name>` to its YAML file. The engine reloads the definitions whenever
anything there changes, so a new or changed pipeline takes effect without a restart. Core ships no
pipelines. [Modules](../admin/modules.md) covers installing and removing the modules that bring
them.

```bash
# in EiN's terminal: the pipelines this EiN has
pipeline list
```

### The trigger

A trigger takes one of two forms, never both:

| Form         | Keys                                 | Starts on                                                   |
| ------------ | ------------------------------------ | ----------------------------------------------------------- |
| A fact       | `on: <fact>` or a list of facts      | a fact on `/dev/events`; the preferred form                 |
| A raw change | `event: <event>`, `nodeType: <type>` | a raw event, such as `event: updated` with `nodeType: file` |

A definition with several ways to start writes `triggers:` with a list instead of `trigger:`. Each
alternative has its own guards, and the first that matches starts the pipeline.

The guards decide whether a matching event starts anything. The engine tests them cheapest first,
so most events are turned away without starting a process:

| Key            | Starts the pipeline only when                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| `match`        | every named field matches its glob, or one of a list of globs: `mimetype: 'image/*'`                        |
| `unless`       | not every named field matches: `nodePath: '/var/**'` leaves a whole subtree alone                           |
| `allowDerived` | `true` lets a derived file, such as a thumbnail or a face crop, start it; without it derived files never do |
| `skipIfExists` | the path does not exist: `$NODE_PATH/metadata/exif`                                                         |
| `skipIfAttr`   | the subject does not already have this attribute set: `skipIfAttr: textIndexedAt`                           |
| `filter`       | this shell script exits 0                                                                                   |
| `skipIf`       | this shell script does not exit 0                                                                           |

In `match` and `unless`, a field names a value the event carries: `mimetype`, `nodePath`, or any
key of a fact's `data`. In a path field, `*` matches within one name and `**` crosses `/`, so
`/home/*/staging/**` is everything in each person's staging folder. A trigger may also set
`priority` and `vars` for the runs it starts.

### The steps

Each step is a command with a name. Steps without `dependsOn` start together; a step with
`dependsOn: [other]` waits for those steps to complete. A step's `condition` is a shell test that
decides, when the step's turn comes, whether it runs or is skipped.

| Key           | What it does                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------- |
| `command`     | The command to run. Required                                                                  |
| `description` | What the step does, shown on the pipeline's page                                              |
| `dependsOn`   | The steps that must complete first                                                            |
| `condition`   | A shell test; the step is skipped when it fails                                               |
| `pool`        | Hand the step to a pool of workers, such as `media`, instead of running it in the engine      |
| `kind`        | The kind of job in the pool, which decides which worker takes it. Defaults to the step's name |
| `requires`    | What the job needs of a worker's capacity: `cpu: 1`, `models: 1`                              |
| `priority`    | The job's priority in the pool, higher first. Overrides the pipeline's                        |
| `exclusive`   | A name; at most one job with it runs in the whole pool at a time                              |

A command and its tests see the subject's path as `$NODE_PATH`. A run started by a fact also has
`$EVENT_TYPE`, `$EVENT_ID`, `$EVENT_SOURCE`, the whole `data` as JSON in `$EVENT_DATA`, and each
key of `data` as `$EVENT_<NAME>` in capitals, with `_` between words: `data.mimetype` is
`$EVENT_MIMETYPE` and `data.filePath` is `$EVENT_FILE_PATH`. The guards of a raw-event trigger also
see `$MIMETYPE`, `$NODE_TYPE` and `$EVENT_TYPE`; the steps of a run it starts get `$NODE_PATH`
alone. The name is `$NODE_PATH` and not `$PATH`, which the shell needs for finding commands.

In a `command`, write `$NODE_PATH` bare: EiN substitutes the path already quoted, so a name with
spaces is safe. In `filter`, `skipIf` and `condition` the path is an ordinary shell variable, so
quote it yourself: `info "$NODE_PATH/exif"`.

### The options

| Option        | What it does                                                                                        | Default |
| ------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `maxAttempts` | How many times a step is run before the run fails                                                   | `3`     |
| `priority`    | The pipeline's place in line, higher first, among steps waiting to run                              | `0`     |
| `coalesce`    | What a trigger for a subject whose run is still going does: `drop` it, or `rerun` once the run ends | `drop`  |
| `debounceMs`  | How long a trigger waits before it becomes a run, so a burst of changes to one subject is one run   | none    |
| `entryPoint`  | Marks the pipeline every other one waits on, so the **Dashboard** can say how far an import has got | none    |

A definition can also declare `vars:` with a default for each, which its commands use like
`$NODE_PATH`. `pipeline start <name> <path> --var NAME=VALUE` changes one for a single run, and the
values a run started with are kept on it.

## From a change to a run

Between a fact and the work it starts, EiN keeps everything it has not done yet as nodes, so
nothing is lost when it restarts:

1. **The queue.** The pipeline engine reads the facts, and the raw events its definitions ask for,
   from a durable queue, `/var/queues/pipeline-engine`. A change that arrives while the engine is
   stopped waits there.
2. **The trigger pool.** For each pipeline whose trigger and guards match, the engine adds a job to
   `/var/pools/triggers`, keyed by the pipeline and the subject. A subject announced ten times
   while it waits is still one job, and one run.
3. **The run.** The engine claims those jobs and turns each into an **instance**, a run of the
   pipeline on that subject, at `/var/pipelines/instances/<pipeline>/<id>`. The id is the
   subject's node id, so a node has at most one instance of each pipeline: a later run replaces the
   earlier one. The engine takes turns between pipelines, so a long queue of one kind of work
   does not hold back the others.
4. **The steps.** The engine starts each step whose dependencies are met. A step without `pool`
   runs inside the engine, at most [`CFG_PIPELINE_MAX_CONCURRENT`](../reference/settings.md#cfg_pipeline_max_concurrent)
   at a time. A step with `pool` becomes a job in that pool, such as `/var/pools/media`, and a
   worker that has room for it runs it.

Pipeline steps change the tree, and those changes are events too. A step that writes to its own
subject would start its own pipeline again; the engine recognises this and drops a trigger for a
subject whose run of that pipeline is still going, or ended less than five seconds ago. A change
after that starts a fresh run. A pipeline whose subject collects many changes, such as an album
whose photos keep arriving, sets `coalesce: rerun` instead: every trigger during a run then adds up
to one more run when it ends.

A file a step makes from another file, such as a thumbnail, a face crop or a video rendition,
records where it came from. Such a derived file starts no pipeline unless the trigger says
`allowDerived: true`, so a face crop is never searched for faces of its own.

If the subject is deleted while its run is going, the run is cancelled: its remaining steps are
skipped and their pool jobs dropped.

### What a run's state means

| Instance    | Meaning                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| `queued`    | Unfinished, with nothing executing: its steps wait in a pool or on other steps |
| `running`   | At least one of its steps is executing right now                               |
| `completed` | Every step completed or was skipped                                            |
| `failed`    | A step ran out of attempts, or failed on its input                             |
| `cancelled` | Stopped by an administrator, or because its subject was deleted                |

| Step        | Meaning                                           |
| ----------- | ------------------------------------------------- |
| `pending`   | Waiting for the steps it depends on               |
| `queued`    | Ready, waiting for a place in the engine          |
| `waiting`   | Handed to a pool, waiting for a worker to take it |
| `running`   | Executing now                                     |
| `completed` | Finished with exit status 0                       |
| `failed`    | Out of attempts, or failed on its input           |
| `skipped`   | Its `condition` said no, or its run was cancelled |

After a large upload most instances read `queued`: the pools work through them a few at a time.

## Pools and workers

The steps that take real time, reading metadata, making thumbnails, finding faces, transcribing,
go to a pool rather than running in the engine. A pool is a node holding jobs, each with a kind, a
priority and what it requires. Workers, each a service, offer the pool their free capacity and take
the best job that fits: the highest priority first, the oldest among equals.

The Archive runs two workers on `/var/pools/media`:

| Service  | What it runs                                                                                                   | Paced by                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `cpu`    | Work on the processor: reading metadata, thumbnails, renditions, fingerprints, zips, matching faces            | **CPU budget for media work**, [`CFG_CPU_SLOTS`](../reference/settings.md#cfg_cpu_slots)    |
| `models` | Requests to the media service's models: faces, picture and text vectors, text in pictures, transcripts, voices | **Model requests in flight**, [`CFG_MODEL_SLOTS`](../reference/settings.md#cfg_model_slots) |

A third worker, `models-second`, takes the same model work as `models` in the reverse order. It is
off until **Second models worker's slots**, `CFG_MODEL_SECOND_SLOTS`, is above 0.

Most of these steps are calls into the [media service](../ems/index.md), which does
the heavy work; EiN decides what to ask for and stores the answers. A worker holds a lease on each
job it runs; if the worker stops, the lease runs out and the job goes back to the pool for another.
[Processing and pipelines](../admin/processing.md) explains how to size the workers.

## One upload, start to finish

With the Archive installed, an upload sets off this chain. Each arrow is a fact, and each fact
starts its own pipelines:

1. You upload `IMG_0042.jpg` to an album. When its last byte is written, EiN records its size,
   checksum and type, an `updated` event.
2. `archive-bridge` sees a photo with bytes and no metadata and announces `media.file.discovered`.
3. `media-ingest` runs `exif-extract`, which reads the camera, the time and the place and writes
   them under the photo as `metadata/exif`.
4. That write becomes `media.metadata.extracted`, which starts `media-stills` (the display sizes)
   and `media-fingerprint`; for a picture also `media-faces`, `media-embed-picture` (search by what
   is in the picture) and `media-ocr` (text in the picture); for a video `media-video-faces`,
   `media-embed-picture`, `media-transcode` and `media-transcribe`; for a recording
   `media-transcode` and `media-transcribe`; and `media-device` when the metadata names the device
   that made the file. They run side by side.
5. `media-faces` writes each face it finds under the photo, which becomes `media.face.detected`
   and starts `media-face-assign`, matching the face to a person.
6. A GPS position becomes `media.position.available`, which starts `media-geocode` for the
   address, and `location.point.changed`, which links the photo to the location that contains it.

![From upload to findable: a file arrives and its date, place and camera are read first, by media-ingest; then thumbnails, video and sound to play, faces and people, picture vectors, text in the picture, transcripts and voices, fingerprints and the address are worked out side by side, each showing up in its own place: the grids and viewer, People, Search, duplicates and stacks, or Locations](../diagrams/pipeline.svg "No stage waits for the one before it to finish; each waits for the fact it needs.")

Nothing in the chain waits for "the previous step". Each stage waits for a fact, so each can be run
again, put first or given its own workers without touching the others. [Getting your photos in](../archive/importing.md)
describes what you see in the interface while this happens.

The Archive's pipelines and what starts them:

| Pipeline               | Starts on                                                | What it does                                                            |
| ---------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| `media-ingest`         | `media.file.discovered`                                  | Reads a file's metadata; every other media pipeline waits on it         |
| `media-reindex`        | `media.file.content-changed`                             | Reads the metadata again when a file's bytes changed                    |
| `media-stills`         | `media.metadata.extracted`                               | A photo's sizes, a video's poster frames, a recording's waveform        |
| `media-transcode`      | `media.metadata.extracted`, `media.file.turned`          | Video and audio the browser can play, a video's storyboard and chapters |
| `media-fingerprint`    | `media.metadata.extracted`                               | The fingerprints duplicate detection and photo stacks compare           |
| `media-faces`          | `media.metadata.extracted`, for a picture                | Finds the faces in a picture and crops each one                         |
| `media-video-faces`    | `media.metadata.extracted`, for a video                  | Finds the faces a video shows, and when                                 |
| `media-face-assign`    | `media.face.detected`                                    | Attaches a found face to a person                                       |
| `media-face-transfer`  | `media.faces.completed`                                  | Moves older hand-made face tags onto found faces                        |
| `media-embed-picture`  | `media.metadata.extracted`, `media.picture.stale`        | A picture vector, for search by what is in the picture                  |
| `media-embed-text`     | `media.text-embedding.stale`                             | Text vectors for a file's stored texts                                  |
| `media-ocr`            | `media.metadata.extracted` for a picture, and others     | Reads the text written in a picture                                     |
| `media-transcribe`     | `media.metadata.extracted`, `media.transcript.stale`     | Transcribes a video or recording                                        |
| `media-voiceprint`     | `media.transcript.generated`, `media.speakers.missing`   | Finds who speaks when, with a voiceprint per voice                      |
| `media-speaker-faces`  | `media.faces.completed`, for a video with voices         | Ties a video's voices to the faces seen speaking them                   |
| `media-speaker-assign` | `media.speakers.detected`, `media.speakers.face-changed` | Decides which person each voice is                                      |
| `media-device`         | `media.metadata.extracted`, with a device in it          | Links a file to the device that made it                                 |
| `media-geocode`        | `media.position.available`                               | The address of a file's GPS position                                    |
| `location-link-point`  | `location.point.changed`                                 | Links a photo to the location containing its position                   |
| `location-upkeep`      | `location.changed`                                       | Redraws a location and links the photos inside it again                 |
| `media-album`          | `media.album.members-changed`                            | An album's stacks, time span, cover and matching profile                |
| `media-duplicates`     | `media.duplicates.stale`                                 | Decides a staged file's duplicate findings again                        |
| `document-index`       | a file `updated` or `moved`, `media.text.missing`        | Extracts the text of PDFs, text and word-processor files for search     |
| `staging-unzip`        | a file `updated` in a staging category                   | Expands a zip beside itself and removes it                              |
| `staging-sidecars`     | `staging.sidecars.arrived`                               | Pairs sidecar files with their files                                    |
| `staging-organize`     | `staging.category.changed`                               | Suggests groups for a staging category again                            |
| `staging-retime`       | `staging.retime.requested`                               | Dates staged files by their category's time rules                       |
| `track-stage`          | a file `updated` in staging                              | Turns a GPX file into its device's route                                |

[Staging and importing for administrators](../archive/staging-admin.md) explains the staging pipelines in
detail.

## When a step fails

A step fails when its command exits with a status other than 0. What happens next depends on the
status:

| Exit status | Means                                                                                                            | What EiN does                                                                                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `75`        | A service the step needs cannot do it now: the media service is busy, loading a model, restarting or unreachable | The step goes back to wait without spending an attempt. In a pool its kind of job rests 30 seconds, doubling up to 10 minutes, until one succeeds; a step the engine runs itself waits five minutes |
| `65`        | The input is the problem, such as bytes no decoder can open                                                      | The step fails at once, whatever attempts are left, and is never run again by itself                                                                                                                |
| any other   | The step itself failed                                                                                           | One attempt is spent; the step runs again until `maxAttempts` is used up, and then the instance fails                                                                                               |

So a media service that is down for an hour fails nothing: its work waits and starts again when it
answers.

A failed instance is not the end either. Once an hour, or as often as
[`CFG_PIPELINE_PRUNE_INTERVAL`](../reference/settings.md#cfg_pipeline_prune_interval) says, the `pipeline-pruner` service runs
`pipeline heal --apply`, which runs each failed instance again an hour after it failed, then after
six hours, then after a day. One that still fails is marked as needing a person and left alone; one
that failed on its input is never run again. The same service removes finished instances, keeping
the newest 2000 of each pipeline, and leaves failed ones for you to look at.

No step is stopped for taking long: a long step is working, and stopping it would throw the work
away. A running step that has written nothing for 30 minutes
([`CFG_PIPELINE_STEP_QUIET_MS`](../reference/settings.md#cfg_pipeline_step_quiet_ms)) is listed as
quiet, and you decide whether it is stuck.

Some gaps no change announces: a file whose pipeline never ran, work an outage lost, vectors from
a model the media service no longer runs. The Archive's `media-heal` service looks for these when
nothing else is waiting, and announces each as a fact for the pipeline that fills it.

## Watch and steer the work

The **Dashboard** in an administrator's sidebar shows the state of all this in one word at the top:
**Healthy**, **Catching up**, **Stuck** or **Needs a person**. Its **Work** tab lists every pipeline
with how many of its instances are queued, running, failed, completed and cancelled, how much work
arrives and finishes per hour, and what is executing now. [Health and the dashboard](../admin/monitoring.md)
explains the words and the figures.

Choose a pipeline in the list to open its page. It shows the pipeline's trigger, its steps and its
priority, and its instances, with tabs **All**, **Running**, **Completed**, **Failed** and
**Cancelled**. An administrator can select instances and choose **Rerun**, **Cancel** or
**Remove**, or remove finished ones with **Prune**. Choose an instance to see each step, its status,
how long it took and, for a failed step, its error; **Retry** runs a failed or skipped step again.

The same is in the terminal. The commands that only read can be run by anyone; those that change something are for
administrators:

```bash
# in EiN's terminal
pipeline overview                          # counts, queues and what is running
pipeline instances -s failed media-faces   # failed runs of one pipeline, newest first
pipeline status media-faces/<id>           # one run: its subject, its steps and their state
```

```bash
# in EiN's terminal, as an administrator
pipeline start media-faces /archive/albums/wrenfield-summer-1987/IMG_0042.jpg
pipeline rerun media-faces/<id>            # a fresh run from the current definition
pipeline restart media-faces/<id>          # run only the failed steps again
pipeline cancel media-faces/<id>
```

An instance id is the subject's node id; `pipeline instances` lists them. Write it as
`<pipeline>/<id>` to say which pipeline's run you mean. `pipeline start` starts a run directly,
without the trigger's guards, so it works on a file the guards would turn away. A run started that
way has no fact behind it, so a step that reads `$EVENT_*` gets nothing; `pipeline start` warns
when a step of the pipeline needs one.

[Processing and pipelines](../admin/processing.md) is the administrator's guide to all of this,
and [Commands](../reference/commands-core.md#pipeline) lists every `pipeline` and `pool` command
with its options.

## Add a pipeline of your own

A pipeline of your own is a YAML file anywhere in the tree, registered with `pipeline define`. This
one marks every photo that arrives in the Wrenfield albums as not yet reviewed:

```yaml
name: mark-unreviewed
description: Mark each new photo in the Wrenfield albums as not reviewed

trigger:
  on: media.metadata.extracted
  match:
    nodePath: '/archive/albums/wrenfield-*/**'
    mimetype: 'image/*'
  skipIfAttr: reviewed

steps:
  mark:
    command: attrs -s reviewed=no $NODE_PATH
```

1. Save it, for example as `/home/helen/pipelines/mark-unreviewed.yaml`, with the
   [editor](../shell/editor.md) or over [SFTP](../shell/ssh-sftp.md).
2. Register it as an administrator:

   ```bash
   # in EiN's terminal, as an administrator
   pipeline define /home/helen/pipelines/mark-unreviewed.yaml
   ```

   ```text
   Defined pipeline 'mark-unreviewed'
   ```

   A definition EiN cannot read gives `pipeline-define:` and the reason, such as
   `invalid pipeline: missing steps` or `step 'mark' depends on unknown step 'read'`.
3. Upload a photo to one of the albums. The pipeline appears on the **Work** tab of the
   **Dashboard** once it has run.

Running `pipeline define` again with the same name replaces the definition; new runs use it, and
`pipeline rerun` brings an existing run up to it. `pipeline undefine mark-unreviewed` removes it and
cancels its running instances. A step can run any command on the path, a module's included; keep
steps safe to run twice, since a step that is interrupted runs again. [Writing a module](../develop/modules.md)
shows how to ship pipelines with a module.

## Trace a result back to its cause

Every write a run makes is recorded in the audit trail with the run it came from and the write that
started it. So from any thumbnail, face or transcript you can find the change that caused it, and
from a change everything it set off. Reading the trail is for administrators:

```bash
# in EiN's terminal, as an administrator: what changed under a photo, with details
audit -v /archive/albums/wrenfield-summer-1987/IMG_0042.jpg
```

With `-v`, each record shows its id, the session or pipeline run it came from (`sid
pipeline:media-faces/<id>`), its `cause`, and each value it changed as `from → to`. Pass a record's
id to `audit --cause=<id>` to list every write its pipelines made. Writes under `/var`, where
instances, queues and pools live, are not recorded, nor are session and terminal writes.

What a run makes belongs to whoever made the subject, so a thumbnail of Helen Okafor's photo is
hers. The [audit command](../reference/commands-core.md#audit) lists every filter.

## What pipelines do not do

- Core brings no pipelines. Without a module, EiN keeps what you give it and works nothing out.
- A change made while a module's pipeline is not defined is not caught up when it is defined:
  pipelines act on changes as they happen. The Archive's `media-heal` finds most such gaps for
  media; for anything else, start the runs with `pipeline start`.
- A step is not stopped for running long, and there is no time limit to set.

## Related pages

- [How EiN works](../start/how-ein-works.md): the short version of this page
- [Nodes and node types](nodes.md) and [The tree](tree.md): what a change changes
- [Processing and pipelines](../admin/processing.md): the administrator's side of the engine and its workers
- [Health and the dashboard](../admin/monitoring.md): the four words and the **Work** tab
- [The media service](../ems/index.md): where most steps do their work
- [Writing a module](../develop/modules.md): shipping pipelines with a module
