# Processing pictures

This page is for the administrator of an EiN with the [Archive](index.md) installed. It covers the
work the Archive does on every photo, video, recording and document that arrives: its pipelines,
the workers that run them, the settings that decide how much runs at once, and the commands that
run the work again.

The pipelines run in core's engine. [Processing and pipelines](../admin/processing.md) covers the
engine itself: watching the work on the **Dashboard** and in the terminal, failed work and how it
is run again, the bulk lane, and the engine's own settings.

## What runs after an upload

When a file arrives, the Archive's `archive-bridge` service turns the change into an event that a
new file is there, `media.file.discovered`. That starts `media-ingest`, which reads the file's
metadata; every other media pipeline waits on it, and starts once the metadata is read.
[Changes and pipelines](../concepts/pipelines.md#one-upload-start-to-finish) follows one upload from
start to finish.

The Archive runs these services for its processing:

| Service          | What it does                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `archive-bridge` | Turns changes into the events the media pipelines wait for                                                                                |
| `cpu`            | The worker for work done on this machine, such as reading metadata, making thumbnails and transcoding video                               |
| `models`         | The worker for work done by a model in the [media service](../ems/index.md), such as finding faces or transcribing speech                 |
| `models-second`  | A second model worker beside `models`, when `CFG_MODEL_SECOND_SLOTS` is above `0`; at the default `0` it runs idle and takes no work      |
| `media-heal`     | Finds files that are missing something and announces them again (see [Close gaps the pipelines missed](#close-gaps-the-pipelines-missed)) |

Its other services, which keep albums, person covers, label suggestions and staging up to date,
are listed in [Services and logs](../admin/services-logs.md). Most of the model work and much of
the media work are calls into the media service: without it, those steps wait, and their kinds
show **waiting for EMS** on the **Dashboard**.

## The Archive's pipelines

| Pipeline               | What it does                                                                              | Kind of work                   |
| ---------------------- | ----------------------------------------------------------------------------------------- | ------------------------------ |
| `media-ingest`         | Reads a photo's, video's or recording's metadata. Every other media pipeline waits on it. | `ingest`                       |
| `media-reindex`        | Reads the metadata again for a file whose bytes changed                                   | `ingest`                       |
| `media-stills`         | A photo's display sizes and face crops, a video's poster frames, a recording's waveform   | `stills`                       |
| `media-transcode`      | Video and audio the browser can play, a video's hover clip, storyboard and chapters       | `transcode`, `stills`, `shots` |
| `media-fingerprint`    | The fingerprints that find duplicates and photo stacks                                    | `fingerprint`                  |
| `media-faces`          | Finds the faces in a photo and crops each one                                             | `faces`                        |
| `media-video-faces`    | Finds the faces in a video and when each is on screen                                     | `faces`                        |
| `media-face-assign`    | Matches a found face to a person                                                          | `face-assign`                  |
| `media-embed-picture`  | A picture vector, for searching by what is in the picture                                 | `embed-picture`                |
| `media-ocr`            | Reads the text written in a picture                                                       | `ocr`                          |
| `media-embed-text`     | Text vectors of a file's stored texts                                                     | `embed-text`                   |
| `media-transcribe`     | A transcript of what is said in a video or recording                                      | `transcribe`                   |
| `media-voiceprint`     | Who speaks when in a recording, with a voiceprint per voice                               | `diarize`                      |
| `media-speaker-assign` | Decides which person each voice is                                                        | `speaker-assign`               |
| `media-speaker-faces`  | Ties a video's voices to the faces seen speaking them, once its faces are found           | `diarize`, `speaker-assign`    |
| `media-device`         | Links a file to the camera or phone that took it                                          | run by the engine              |
| `media-geocode`        | Looks up the address of a file's GPS position                                             | run by the engine              |
| `media-album`          | An album's stacks, time span, missing cover and profile, when its members change          | run by the engine              |
| `media-duplicates`     | Decides again the duplicate findings of a staged file                                     | `dedupe`                       |
| `location-link-point`  | Links a photo to the location that contains its GPS point                                 | run by the engine              |
| `location-upkeep`      | Redraws a location and relinks the photos inside it when it or its photos change          | run by the engine              |
| `document-index`       | Extracts the text of a document and makes it searchable                                   | run by the engine              |
| `staging-unzip`        | Expands a zip that lands in a staging category, then removes the zip                      | `unzip`                        |
| `staging-sidecars`     | Pairs Takeout and XMP sidecars with their files                                           | `sidecars`                     |
| `staging-organize`     | Plans a staging category's suggested groups again                                         | `organize`                     |
| `staging-retime`       | Dates staged files again by the rules of the category they were moved into                | `retime`                       |
| `track-stage`          | Makes a GPX file dropped in staging into its device's route                               | run by the engine              |

## The workers

Every kind of work above that is not run by the engine goes as a job into the pool
`/var/pools/media`, where the Archive's workers take it:

- `cpu` takes `unzip`, `ingest`, `stills`, `face-assign`, `speaker-assign`,
  `fingerprint`, `dedupe`, `retime`, `organize`, `sidecars` and `transcode`.
- `models` takes `faces`, `embed-picture`, `ocr`, `embed-text`, `transcribe`, `diarize` and
  `shots`, and `models-second` the same kinds in the reverse order.

When a worker is stopped and no other takes its kinds, they show **no worker** on the **Dashboard**,
and the work waits until it starts again; [Work that nothing will run](../admin/processing.md#work-that-nothing-will-run)
says what to do.

## How much runs at once

These settings are in the **Processing** category of **Settings → System**, or set with
`config set`, and come with the Archive. Saving one restarts the worker that reads it, and work in
progress is picked up again. [Configuration](../admin/configuration.md) explains how.

| Setting                                                                           | Default   | What it decides                                                                                                                                              |
| --------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`CFG_CPU_SLOTS`](../reference/settings.md#cfg_cpu_slots)                         | `2`       | How much CPU work the `cpu` worker runs at once. A transcode takes two slots, other kinds one.                                                               |
| [`CFG_CPU_NON_ENTRY_SLOTS`](../reference/settings.md#cfg_cpu_non_entry_slots)     | `1`       | Slots kept first for work after ingest, so a long import does not hold back thumbnails and faces. Ingest borrows them when nothing else waits.               |
| [`CFG_CPU_WORKERS`](../reference/settings.md#cfg_cpu_workers)                     | `4`       | The most CPU jobs in flight; the slots are the real limit                                                                                                    |
| [`CFG_MODEL_SLOTS`](../reference/settings.md#cfg_model_slots)                     | `2`       | Requests the `models` worker keeps in flight against the media service. Size it to what the media service runs at once.                                      |
| `CFG_MODEL_SECOND_SLOTS`                                                          | `0`       | Requests the `models-second` worker keeps in flight; `0` leaves it off. Size both workers' slots together against the media service.                         |
| [`CFG_MODEL_KIND_QUANTUM_MS`](../reference/settings.md#cfg_model_kind_quantum_ms) | `3600000` | How long the `models` worker stays on one kind before turning to the next, so faces do not starve the rest; `models-second` takes a change at its next start |

> [!TIP]
> More `CFG_MODEL_SLOTS` than the media service runs at once only moves the wait into its queue,
> and past its depth into **waiting for EMS**. With `models-second` on, the media service holds two
> families of models at once, and both must fit on its graphics card, or one runs on the processor.

[Performance and sizing](../admin/performance.md) says what to set on a small or a large machine,
and [Change how it works](../ems/index.md#change-how-it-works), on the media service's page, how many
model requests the media service admits at once, `EMS_LIMIT_MODELS`.

## Run work again on purpose

| You want to                                                     | Run                                                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Run one pipeline on one file                                    | `pipeline-start media-faces /archive/albums/christmas-2019/IMG_2041.jpg`                    |
| Transcode a video again although it has renditions              | `pipeline-start --var FORCE=-f media-transcode /archive/albums/christmas-2019/MVI_0412.mp4` |
| Make the renditions again under a folder, without the pipelines | `regenerate --force /archive/albums/christmas-2019`                                         |
| Announce files the Archive never saw, or that are missing work  | `media-scan /archive/albums`                                                                |
| Embed the stored texts and transcripts again, as they are       | `media-reembed`                                                                             |
| Encode the face crops again without finding the faces again     | `regenerate-face-crops --limit 200`                                                         |

`media-transcode`, `media-transcribe`, `media-embed-picture` and `media-ocr` declare `FORCE`, which
`-f` makes them redo work already done. [`pipeline-start`](../admin/processing.md#run-work-again-on-purpose)
is core's; the other commands are the Archive's, and [Archive commands](commands.md) lists their
options.

### Close gaps the pipelines missed

`media-scan` walks a folder and announces each file that was never taken in, or that lacks
something a pipeline should have given it: a fingerprint, display sizes, faces, renditions, or a
transcript made with other settings than the media service runs now. Each pipeline then skips
what is already done.

The `media-heal` service runs it for you, but only when nothing is waiting in the pools, so a scan
never repeats what is already on its way. It looks every `CFG_MEDIA_HEAL_INTERVAL` seconds (900),
and after a pass through the whole archive it rests for `CFG_MEDIA_HEAL_REST` seconds (21600, six
hours).

Run it by hand after installing the Archive on files that were already there, or to look at one
folder:

```bash
# in EiN's terminal
media-scan -n /archive/albums/christmas-2019    # only report what it would announce
media-scan /archive/albums/christmas-2019
```

A run examines up to 20000 files (`--scan-limit`) and announces up to 1000 (`--limit`), and
remembers where it stopped, so the next run goes on from there; `--restart` starts from the top. It
announces fewer as running `media-ingest` instances and waiting triggers add up, and nothing once they reach 500
(`--max-active`).

`CFG_MEDIA_TRANSCRIPTS_CURRENT` set to `off` stops transcripts from being made again when the
media service's speech settings change. On a large archive such a change otherwise means hours of
background work.

## Large imports and the bulk lane

Work on a staging category of the **Google Photos export** or **Scans** kind runs in core's
[bulk lane](../admin/processing.md#the-bulk-lane), below all other work, so what people upload in
the meantime is processed first. Any category can be put in that lane with
`staging category <name> --lane bulk`, which applies to work announced from then on.
[Staging for administrators](staging-admin.md) covers categories.

## Related pages

- [Processing and pipelines](../admin/processing.md): the engine, failed work, and watching it all.
- [The media service](../ems/index.md): where the model work and much of the media work runs.
- [Supported files](file-types.md): what the Archive reads and makes of each kind of file.
- [Staging for administrators](staging-admin.md): categories and their lanes.
- [Troubleshooting](../admin/troubleshooting.md): when photos do not get thumbnails, faces or dates.
- [Archive commands](commands.md): every command the Archive adds.
