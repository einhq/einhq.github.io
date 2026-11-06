# Processing pictures

This page is for the administrator of an EiN with the [Archive](index.md) installed. It covers the
work the Archive does on every photo, video, recording and document that arrives: its pipelines,
the workers that run them and the commands that run the work again. How much runs at once is set on
the [Media](../media/index.md) module's page.

The pipelines run in core's engine. [Processing and pipelines](../admin/processing.md) covers the
engine itself: watching the work on the **Dashboard** and in the terminal, failed work and how it
is run again, the bulk lane, and the engine's own settings.

## What runs after an upload

When a file arrives, the [Media](../media/index.md) module reads its metadata first
([Reading a file](../media/index.md#reading-a-file)). Then the Archive's `media-interpret` works out
from it when the file was taken and where, side by side with the thumbnails, picture vectors, text
and transcripts; faces, fingerprints and the device that made the file wait for the date and place.
[Changes and pipelines](../concepts/pipelines.md#one-upload-start-to-finish) follows one upload from
start to finish.

The Archive runs these services for its processing:

| Service          | What it does                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `archive-bridge` | Turns changes into the events the Archive's pipelines wait for                                                                       |
| `media-heal`     | Starts a pass of the `media-heal` pipeline when one is due (see [Close gaps the pipelines missed](#close-gaps-the-pipelines-missed)) |

The steps themselves are run by the [Media](../media/index.md) module's workers, which take the
kinds of work the Archive names for them: `media-worker` the rest, such as dating and placing
files, matching faces, fingerprints and staging; `models` the work
done by a model in the [media service](../ems/index.md), such as finding faces or transcribing
speech, and `models-second` the same beside it when it is on. [The workers](#the-workers) lists the
kinds.

Its other services, which keep albums, person covers, label suggestions and staging up to date,
are listed in [Services and logs](../admin/services-logs.md). Most of the model work and much of
the media work are calls into the media service: without it, those steps wait, and their kinds
show **waiting for EMS** on the **Dashboard**.

## The Archive's pipelines

| Pipeline               | What it does                                                                                                        | Kind of work                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `media-interpret`      | When a photo, video or recording was taken and where, from its metadata, a sidecar and its name                     | `interpret`                 |
| `media-fingerprint`    | The fingerprints that find duplicates and photo stacks                                                              | `fingerprint`               |
| `media-faces`          | Finds the faces in a photo and crops each one                                                                       | `faces`                     |
| `media-video-faces`    | Finds the faces in a video and when each is on screen                                                               | `faces`                     |
| `media-face-assign`    | Matches a found face to a person                                                                                    | `face-assign`               |
| `media-voiceprint`     | Who speaks when in a recording, with a voiceprint per voice                                                         | `diarize`                   |
| `media-speaker-assign` | Decides which person each voice is                                                                                  | `speaker-assign`            |
| `media-speaker-faces`  | Ties a video's voices to the faces seen speaking them, once its faces are found                                     | `diarize`, `speaker-assign` |
| `media-device`         | Links a file to the camera or phone that took it                                                                    | run by the engine           |
| `media-device-cover`   | Offers a video's poster frame to the camera that took it, once its renditions are made                              | run by the engine           |
| `media-geocode`        | Looks up the address of a file's GPS position                                                                       | run by the engine           |
| `media-album`          | An album's stacks, time span, missing cover and profile, when its members change                                    | run by the engine           |
| `media-duplicates`     | Decides again the duplicate findings of a staged file                                                               | `dedupe`                    |
| `location-link-point`  | Links a photo to the location that contains its GPS point                                                           | run by the engine           |
| `location-upkeep`      | Redraws a location and relinks the photos inside it when it or its photos change                                    | run by the engine           |
| `document-index`       | Extracts the text of a document and makes it searchable                                                             | run by the engine           |
| `staging-unzip`        | Expands a zip that lands in a staging category, then removes the zip                                                | `unzip`                     |
| `staging-sidecars`     | Pairs Takeout and XMP sidecars with their files                                                                     | `sidecars`                  |
| `staging-organize`     | Plans a staging category's suggested groups again                                                                   | `organize`                  |
| `staging-retime`       | Dates staged files again by the rules of the category they were moved into                                          | `retime`                    |
| `track-stage`          | Makes a GPX file dropped in staging into its device's route                                                         | run by the engine           |
| `track-trips`          | Finds a device's trips again after points arrive, and names the places it stayed                                    | run by the engine           |
| `gedcom-stage`         | Moves a GEDCOM file dropped in staging to `genealogy/`, to be looked over and imported                              | run by the engine           |
| `media-heal`           | Goes through the albums or a staging area and announces the files missing work the other pipelines should have done | run by the engine           |

## Which processing a folder gets

Each media pipeline belongs to a family of work, which it names with `wants`, so a folder can ask
for only some of it ([Which processing a folder wants](../concepts/pipelines.md#which-processing-a-folder-wants)):

| Family            | What it covers                                                                                                                           | Pipelines                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `renditions`      | A picture's sizes, a video's poster frames, hover clip, playable copy, storyboard and chapters, a recording's playable copy and waveform | the Media module's `media-stills` and `media-transcode`                                              |
| `picture-vectors` | Searching by what is in a picture                                                                                                        | the Media module's `media-embed-picture`                                                             |
| `text`            | The text written in a picture, and a document's text                                                                                     | the Media module's `media-ocr`, `document-index` and `media-embed-text`                              |
| `transcripts`     | What is said in a video or recording                                                                                                     | the Media module's `media-transcribe` and `media-embed-text`                                         |
| `archive`         | The date and the place, faces and voices and who they are, fingerprints and duplicates, the camera                                       | `media-interpret`, and the face, voice, fingerprint, device, geocoding and duplicate pipelines above |

The Media module's `media-ingest` and `media-reindex` name no family, since every family needs what
they read, and nor do the pipelines that work on the Archive's own folders: albums, staging, tracks
and places. A folder with `processing` set to `["renditions"]` gets its pictures read and their
sizes made, and no dates worked out, no faces, text, picture vectors or fingerprints. A staging
area wants every family but `text`: its files get everything else while they wait, and their text
is read once they are filed into a folder that wants it.

## The renditions

The thumbnails, display sizes and playable copies of the Archive's pictures, videos and recordings,
and the pipelines that make them, `media-stills` and `media-transcode`, are the Media module's:
[The renditions it makes](../media/index.md#the-renditions-it-makes). The Archive's own are a
picture's face crops, which `detect-faces` cuts, `file-set-orientation` cuts again when a picture is
turned, and `regenerate-face-crops --missing` cuts where a crash left one empty.

## The workers

Every kind of work above that is not run by the engine goes as a job into the pool
`/var/pools/media`, where the [Media](../media/index.md) module's workers take it: the Archive names
its kinds for them. `media-worker` takes the Archive's `unzip`, `interpret`, `face-assign`,
`speaker-assign`, `fingerprint`, `dedupe`, `retime`, `organize` and `sidecars`, beside the Media
module's own `ingest`, `stills` and `transcode`; `models` takes the Archive's `faces` and
`diarize`, beside the Media module's `shots`, `embed-picture`, `ocr`, `embed-text` and `transcribe`,
and `models-second` the same kinds in the reverse order. How much of it runs at once is set there,
in [How much runs at once](../media/index.md#how-much-runs-at-once).

## Run work again on purpose

| You want to                                                    | Run                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Run one pipeline on one file                                   | `pipeline-start media-faces /archive/albums/christmas-2019/IMG_2041.jpg`                    |
| Transcode a video again although it has renditions             | `pipeline-start --var FORCE=-f media-transcode /archive/albums/christmas-2019/MVI_0412.mp4` |
| Announce files the Archive never saw, or that are missing work | `media-scan /archive/albums`                                                                |
| Embed the stored texts and transcripts again, as they are      | `media-reembed`                                                                             |
| Encode the face crops again without finding the faces again    | `regenerate-face-crops --limit 200`                                                         |
| Cut the face crops a crash left empty, or never cut            | `regenerate-face-crops --missing --limit 200`                                               |

`media-transcode`, `media-transcribe`, `media-embed-picture` and `media-ocr` declare `FORCE`, which
`-f` makes them redo work already done. [`pipeline-start`](../admin/processing.md#run-work-again-on-purpose)
is core's, `media-reembed` the [Media](../media/commands.md#media-reembed) module's, and the others
the Archive's, which [Archive commands](commands.md) lists with their options.

### Close gaps the pipelines missed

`media-scan` walks a folder and announces each file that was never taken in, or that lacks
something a pipeline should have given it: its date and place, faces or voices. Each
pipeline then skips what is already done.

What describes a file is the Media module's to keep current, in every folder:
[renditions](../media/index.md#renditions-kept-current), [picture vectors](../media/index.md#picture-vectors),
and [text, transcripts and their vectors](../media/index.md#text-and-transcripts-kept-current).

The `media-heal` pipeline runs `media-scan` for you over `/archive/albums` and over each user's
staged files, `/home/<user>/staging/files`, whose faces staging uses to suggest groups. Each pass is one instance, which
shows under **Ongoing** on the **Dashboard** with how far through its folder it has come; it is
housekeeping, not work waiting, so `health` does not count it. A pass holds back a gap whose
pipeline already has work waiting, so it never repeats what is already on its way, and announces
the rest: a long queue of one kind of work, such as faces, does not keep voices or fingerprints
from being found. It announces every gap as it finds it, so the work it starts shows on the
dashboard and in `health` until it is done. It remembers where it is every thousand files, so a
restart of EiN does not send it back to the beginning. When a pass ends, the **Output** of its step
says how many files it went through, how many gaps it announced and which kinds it held back. A
pass that fails is a failed instance, run again like any other [failed work](../admin/processing.md).

The `media-heal` service says when a pass is due. It looks every `CFG_MEDIA_HEAL_INTERVAL` seconds
(900) and, unless a pass is running, starts one over the first folder, the albums before the staging
areas, whose pass is due: one runs at a time. A folder's pass is not due when its last one failed, or
when every kind of gap it would look for has work waiting. The kinds a folder's last pass held back
get a pass of their own once their pipelines have nothing waiting. After a pass that finds nothing
and holds nothing back, that folder rests for `CFG_MEDIA_HEAL_REST` seconds (21600, six hours). `media-heal -n` says whether a pass is due now,
and `media-heal --rest 0` starts one without waiting out the rest.

Faces are compared with the models the media service runs now, so a scan needs the service to
answer. While it does not, a pass ends
without going through the archive, and the service starts it again at its next look, rather than
going on without those checks. Run by hand, `media-scan`
goes on and names the kinds of gap it could not check; scan for those again with `--only` and
`--restart` once the service is back.

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
