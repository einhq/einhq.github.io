# Media

The Media module makes the thumbnails, display sizes and playable copies of every picture, video
and recording in a folder that wants them, and keeps them current. It also runs the media work the
other modules hand it, so that a large import never starts it all at once: with the
[Archive](../archive/index.md), reading each picture's metadata, finding and matching faces,
picture vectors, text in pictures and transcripts. It holds the workers of the pool that work
waits in, and their settings. The Archive needs it, so it comes with the Archive.

## Install it

Installing the Archive installs it too. On its own:

```bash
# in EiN's terminal, as the administrator
mod install media
```

[Modules](../admin/modules.md) covers installing and removing modules.

## The renditions it makes

The thumbnails, display sizes, video and sound copies are listed in `/etc/renditions.yaml`, each
under the role it plays: `thumb`, the square thumbnail, and `grid`, `small`, `medium` and `large`,
which keep the picture's shape; a video's `preview`, the silent clip a tile plays, and its
`playback`; a recording's `playback`; and the `storyboard`, a video's frames on one sheet. The
pages ask for a role, so changing a size there changes what they show. `renditions` in the
terminal says what the file holds now, and names any entry it leaves out as wrong.

Two pipelines make them, once a file's metadata is read: `media-stills` the pictures (a photo's
sizes, a video's poster frames and then its hover clip, a recording's waveform), and
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

## The workers

Each module puts the work a crawl must not start all at once as jobs into the pool
`/var/pools/media`, and names the kinds of its jobs for the workers here:

- `media-worker` runs the work that is not a model request, on one budget of the processor's slots.
- `models` keeps the model requests in flight against the [media service](../ems/index.md), and
  rotates between their kinds, so that faces do not starve the rest.
- `models-second`, off unless `CFG_MODEL_SECOND_SLOTS` is above 0, takes the same kinds in the
  reverse order, so the media service runs a second family of models beside the first.

`media-pool-kinds cpu` and `media-pool-kinds models` say which kinds each takes now. When a worker is
stopped and no other takes its kinds, they show **no worker** on the **Dashboard**, and the work waits
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
# the steps a crawl runs after ingest, reserved
ingest
stills reserve
```

A kind no worker takes never runs, so name every kind a step of yours declares. The workers read the
drop-ins as they start: after you change your kinds, restart them with `service restart media-worker`
and `service restart models`.
