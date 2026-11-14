# Media

The Media module reads every picture, video and recording as it arrives, and makes the thumbnails,
display sizes and playable copies of each in a folder that wants them, the picture vectors that
search finds a picture by what it shows, the text in pictures and documents, and what is said in
videos and recordings, and keeps the renditions and picture vectors current. It also runs the media
work the other modules hand it, so that a large import never starts it all at once: with the
[Archive](../archive/index.md), dating and placing each file, and finding and matching faces and
voices. It holds the workers of the pool that
work waits in, and their settings. The Archive and Recipes need it, so it comes with either.

## Install it

Installing the Archive or Recipes installs it too. On its own:

```bash
# in EiN's terminal, as the administrator
mod install media
```

[Modules](../admin/modules.md) covers installing and removing modules.

## Reading a file

When a picture, video or recording has its last byte written, the `media-bridge` service announces
it, and `media-ingest` reads it with `exif-extract`, through the [media service](../ems/index.md).
What it reads goes on the file: its type, its size and shape, how it is turned, and a video's or
recording's length and codec. Everything the file's metadata says is kept under it, as
`metadata/exif`: the camera that made it, the clocks it recorded, and its GPS fix. What these
mean, such as when the picture was taken and where, the other modules work out: the Archive's way
is in [Dates and places](../archive/dates-places.md). The renditions and every other module's work
on the file wait for the reading. When a file's bytes change, `media-reindex` reads it again.

Nothing under `/tmp`, `/etc`, `/var`, `/usr` or `/dev` is read, nor anything in a trash, nor a
rendition. A video or recording whose container cannot be read is marked `undecodable`, and
nothing is made of it.

A module can hold a file before it is read. A held file is left unread, and nothing starts for it,
for as long as it has the same bytes in the same folder. The Archive holds a file that arrives in a
staging area as an exact copy of one its owner already has
([An exact copy shows its original](../archive/duplicates.md#an-exact-copy-shows-its-original)).

| You want to                                              | Run                                                               |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| Read a file again, also one held or marked `undecodable` | `exif-extract -f /archive/albums/christmas-2019/IMG_0042.jpg`     |
| See everything its metadata says                         | `attrs /archive/albums/christmas-2019/IMG_0042.jpg/metadata/exif` |

## The renditions it makes

The thumbnails, display sizes, video and sound copies are listed in `/etc/renditions.yaml`, each
under the role it plays: `thumb`, the square thumbnail, and `grid`, `small`, `medium` and `large`,
which keep the picture's shape; a video's `preview`, the silent clip a tile plays, and its
`playback`; a recording's `playback`; and the `storyboard`, a video's frames on one sheet. A picture
role's `kinds` says what it is made of: `photo`, `video`, `audio` (the waveform) and `document` (a
document's first page). A file from before documents got pictures has no `document` in its kinds,
and documents get no picture until it is added. The
pages ask for a role, so changing a size there changes what they show. `renditions` in the
terminal says what the file holds now, and names any entry it leaves out as wrong.

Two pipelines make them, once a file's metadata is read: `media-stills` the pictures (a photo's
sizes, a video's poster frames and then its hover clip, a recording's waveform, and as soon as a
document is written its first page, with the PDF of a Word, OpenDocument or RTF file, `view.pdf`,
which the viewer shows), and
`media-transcode` the video and sound a browser can play, with a video's storyboard and its
chapters, the cuts its player marks. A folder whose `processing` setting leaves out `renditions`
gets none ([Which processing a folder wants](../concepts/pipelines.md#which-processing-a-folder-wants)).

The Media module installed the file, and a newer version of it never overwrites it, so a change you
make stays. Each rendition is named after its size (`800x800.avif`), so a size changed is a new file
for every picture. Pages pick up the change when they are opened again.

## Renditions kept current

Once a file has every rendition `/etc/renditions.yaml` names for it, it is marked with the table
they were made by (`renditionsFor` and `renditionsAt` in its attributes). Every hour the
`renditions-heal` service runs `renditions-scan`, which asks for the files whose mark is missing or
names another table, in every folder that wants renditions, and announces them to `media-stills`
and `media-transcode`, which make what is missing. A size changed in the table is made for every
file of the kinds it touched, which on a large archive takes hours or days. A rendition the media
service refused for its processor budget counts as made, until that budget changes. While
rendition work waits, the scan announces nothing, so it never repeats what is already on its way.

| You want to                                                                | Run                                                 |
| -------------------------------------------------------------------------- | --------------------------------------------------- |
| See which files lack renditions the table names, without changing anything | `renditions-scan -n -v`                             |
| Announce them now, rather than at the next hour                            | `renditions-scan`                                   |
| Make the renditions again under a folder, without the pipelines            | `regenerate --force /archive/albums/christmas-2019` |
| Remove the renditions no role names any more                               | `regenerate --prune /archive`                       |

[Media commands](commands.md) lists their options.

## Picture vectors

A photo, and each keyframe of a video, gets a picture vector: what the media service's picture model
sees in it, which [search](../archive/search.md) compares with the words you type, so a picture is
found by what it shows without a caption. `media-embed-picture` makes them once a file is read, in a
folder that wants `picture-vectors`
([Which processing a folder wants](../concepts/pipelines.md#which-processing-a-folder-wants)), and
marks the file with the model that made them.

Every hour the `pictures-heal` service runs `pictures-scan`, which asks for the photos and videos
whose mark is missing or names another model than the media service runs now, in every folder that
wants them, and announces them to `media-embed-picture`. Vectors the model in use made are kept and
the file marked; another model's are made again, so when the media service changes its picture
model the whole archive is embedded again, behind all other work. While picture work waits, the
scan announces nothing.

| You want to                                                   | Run                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------- |
| See which files lack picture vectors from the model in use    | `pictures-scan -n -v`                                          |
| Announce them now, rather than at the next hour               | `pictures-scan`                                                |
| Make a file's picture vectors again, whatever model made them | `embed-picture -f /archive/albums/christmas-2019/IMG_0042.jpg` |

## Fingerprints

A picture, each keyframe of a video, and a recording get a fingerprint: a description made to find
copies whatever their bytes, a picture saved smaller or in another format, mildly cropped or
turned, a video or recording encoded again. The [Archive](../archive/duplicates.md) compares them
to find duplicates, look-alikes and the photos of a burst. `media-fingerprint` makes them once a
file is read, in a folder that wants `fingerprints`
([Which processing a folder wants](../concepts/pipelines.md#which-processing-a-folder-wants)), and
marks the file once they are all there. A recording shorter than about two and a half seconds has
too little sound for one, and is marked all the same.

Every hour the `fingerprints-heal` service runs `fingerprints-scan`, which asks for the pictures,
videos and recordings without the mark, in every folder that wants them, and announces them to
`media-fingerprint`: a file whose fingerprints are all there is only marked, the others get theirs.
While fingerprint work waits, the scan announces nothing.

| You want to                                         | Run                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------- |
| See which files were never fingerprinted to the end | `fingerprints-scan -n -v`                                            |
| Announce them now, rather than at the next hour     | `fingerprints-scan`                                                  |
| Fingerprint a file again                            | `compute-fingerprint -f /archive/albums/christmas-2019/IMG_0042.jpg` |

## Text and transcripts

In a folder that wants `text`, the text written in a picture is read once the picture is
(`media-ocr`, `read-text`), and a PDF, plain text, Word or OpenDocument text file's text once its
last byte is written (`document-index`, `index-document`); nothing is read while it is in a staging
area. In a folder that wants `transcripts`, what is said in a video or recording is written as its
transcript (`media-transcribe`, `transcribe-file`). Each text gets a vector, which search finds it by.
A person corrects them in the [viewer](../archive/viewer.md), with `file-set-text`,
`file-set-text-language` and `file-set-transcript` underneath; the voices in a transcript, and who
speaks, are the Archive's.

## Text and transcripts kept current

A file is marked with what made its transcript and its text vectors (`transcriptWith` and
`textVectorsBy` in its attributes), as it is with the engine that read its text (`ocrBy`). Every
hour the `text-heal` service runs `text-scan`, which asks, in every folder that wants them, for:

- a video or recording whose transcript is missing or was made with other speech settings than the
  media service runs now, announced to `media-transcribe`. A transcript made with the settings in
  use is kept and the file marked; one made with others is made again, so a change of the media
  service's speech settings transcribes the whole archive again, behind all other work. One a person
  wrote, and one of a file with no sound, is kept whatever the settings.
- a picture whose text another engine read, announced to `media-ocr`, unless a person wrote it.
- a picture or document whose text was never read, announced to `media-ocr` or `document-index`.
  A folder moved in whole has its files' text read the same way, as soon as it arrives.
- a file whose texts lack vectors from the text model the media service runs now, announced to
  `media-embed-text`. A description changed by hand is embedded again as soon as it is saved.

Each kind of gap waits while its work waits, so the scan never repeats what is already on its way,
and a check that needs the media service is left out while it does not answer. Nothing in a
staging area is asked about its text: it is read when the file is filed. **Keep transcripts current**
([`CFG_MEDIA_TRANSCRIPTS_CURRENT`](../reference/settings.md#cfg_media_transcripts_current)) set to
`off` leaves the transcripts there are alone, when a change of speech settings should not mean
hours of background work: only a file with no mark is asked about, and what it has is kept.

| You want to                                                    | Run                                                              |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| See which files have text, transcripts or vectors to catch up  | `text-scan -n -v`                                                |
| Announce them now, rather than at the next hour                | `text-scan`                                                      |
| Read the text in a picture again                               | `read-text -f /archive/albums/christmas-2019/IMG_0042.jpg`       |
| Read a document's text again                                   | `index-document -f /home/helen/letters/1962.pdf`                 |
| Transcribe a video or recording again, whatever made its words | `transcribe-file -f /archive/albums/christmas-2019/MVI_0412.mp4` |
| Embed every stored text and transcript again, as they are      | `media-reembed`                                                  |

## Restoring and reading damage

The Media module makes a picture's restored copies, through the [media service](../ems/index.md):
`file-restore` restores one while someone waits, and `file-restore --queue` many in the background,
each picture's request kept on it until `media-restore` has made its copy, as the `restore` kind of
the `models` worker. `find-damage` reads how faded, dusty, scratched, blurred and shaken a picture
is and keeps it on the file, where `search --has damage=faded` finds it; the Archive runs it on its scans
([Find the scans worth restoring](../archive/viewer.md#find-the-scans-worth-restoring)).

## The workers

Each module puts the work a crawl must not start all at once as jobs into the pool
`/var/pools/media`, and names the kinds of its jobs for the workers here:

- `media-worker` runs the work that is not a model request, on one budget of the processor's slots.
- `models` keeps the model requests in flight against the [media service](../ems/index.md), and
  rotates between their kinds, so that faces do not starve the rest.
- `models-second`, off unless `CFG_MODEL_SECOND_SLOTS` is above 0, takes the same kinds in the
  reverse order, so the media service runs a second family of models beside the first.

With [more than one media service](../ems/instances.md), `models` and `media-worker` run a worker
for each other instance beside their own, named `models@laptop` and `media-worker@laptop`, with the
kinds that instance serves; `media-pool-kinds models --instance laptop` says which.

`media-pool-kinds cpu` and `media-pool-kinds models` say which kinds each takes now. When a worker is
stopped and no other takes its kinds, they show **no worker** on the **Status**, and the work waits
until it starts again; [Work that nothing will run](../admin/processing.md#work-that-nothing-will-run)
says what to do.

## How much runs at once

These settings are in the **Processing** category of **Settings → System**, or set with
`config set`, and come with the Media module. Saving one restarts the worker that reads it, and work
in progress is picked up again. [Configuration](../admin/configuration.md) explains how.

| Setting                                                                           | Default   | What it decides                                                                                                                                              |
| --------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`CFG_CPU_SLOTS`](../reference/settings.md#cfg_cpu_slots)                         | `2`       | How much work the `media-worker` worker runs at once. A transcode takes two slots, other kinds one.                                                          |
| [`CFG_CPU_NON_ENTRY_SLOTS`](../reference/settings.md#cfg_cpu_non_entry_slots)     | `1`       | Slots kept first for work after ingest, so a long import does not hold back thumbnails and faces. Ingest borrows them when nothing else waits.               |
| [`CFG_CPU_WORKERS`](../reference/settings.md#cfg_cpu_workers)                     | `4`       | The most CPU jobs in flight; the slots are the real limit                                                                                                    |
| [`CFG_MODEL_SLOTS`](../reference/settings.md#cfg_model_slots)                     | `2`       | Requests the `models` worker keeps in flight against the media service. Size it to what the media service runs at once.                                      |
| [`CFG_MODEL_SECOND_SLOTS`](../reference/settings.md#cfg_model_second_slots)       | `0`       | Requests the `models-second` worker keeps in flight; `0` leaves it off. Size both workers' slots together against the media service.                         |
| [`CFG_MODEL_KIND_QUANTUM_MS`](../reference/settings.md#cfg_model_kind_quantum_ms) | `3600000` | How long the `models` worker stays on one kind before turning to the next, so faces do not starve the rest; `models-second` takes a change at its next start |

> [!TIP]
> More `CFG_MODEL_SLOTS` than the media service runs at once only moves the wait into its queue,
> and past its depth into **waiting for EMS**. With `models-second` on, the media service holds two
> families of models at once, and both must fit on its graphics card, or one runs on the processor.

### The bulk lane

A folder can put the work on the files under it behind all other work. When its `lane` attribute
is `bulk`, everything that starts for a file under it, from its reading and its renditions to the
other modules' work, waits until nothing else does, so what anyone uploads meanwhile is ready
first. The nearest folder above a file that sets `lane` decides. The Archive's staging categories
set it from their lane
([Plan a large import](../archive/staging-admin.md#plan-a-large-import)); on any
other folder, as its owner or the administrator:

```bash
# in EiN's terminal
attrs -s lane=bulk /archive/imports/old-drive
```

It applies to work announced from then on, within a minute; work already waiting keeps its place.

[Performance and sizing](../admin/performance.md) says what to set on a small or a large machine,
and [Change how it works](../ems/index.md#change-how-it-works), on the media service's page, how many
model requests the media service admits at once, `EMS_LIMIT_MODELS`.

## For a module's author: naming your kinds

A module names the kinds of work its pipeline steps put in the pool in drop-ins: `etc/media-worker.d/kinds`
for the steps that take `cpu`, and `etc/media-models.d/kinds` for those that take `models`. `mod setup`
links them as `/etc/media-worker.d/<module>/kinds` and `/etc/media-models.d/<module>/kinds`. A kind a
line, in the order offered; `reserve` after a CPU kind puts it in the share kept for the work after
ingest; `#` starts a comment:

```text
# what a file's metadata means, kept for the work after ingest
interpret reserve
```

A kind no worker takes never runs, so name every kind a step of yours declares. The workers read the
drop-ins as they start, and `mod install` restarts them when it puts in place a module whose kinds
are new or changed ([`dropIns`](../develop/manifest.md#dropins)). After you change your kinds by
hand, restart them with `service restart media-worker` and `service restart models`.

## For a module's author: holding a file

A module that must have its say before a file is read puts a command in `etc/media-read.d/hold`,
which `mod setup` links as `/etc/media-read.d/<module>/hold`. Its first line that is not a comment
runs before each reading as `<command> <file>`, with `-f` before the file when the reading is
forced. To hold the file, the command sets `hold` on it:

```json
{ "by": "archive", "reason": "an exact copy of …", "sha256": "<the file's sha256>", "within": "<a folder>" }
```

The hold lasts while the file has those bytes and lies under that folder. New bytes, or a move out
of the folder, end it without anyone taking it off, and a forced reading reads the file anyway.
