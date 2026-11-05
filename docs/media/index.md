# Media

The Media module runs the media work the other modules hand it, so that a large import never starts
it all at once: with the [Archive](../archive/index.md), reading each picture's metadata, its
thumbnails and video copies, finding and matching faces, picture vectors, text in pictures and
transcripts. It holds the workers of the pool that work waits in, and their settings. The Archive
needs it, so it comes with the Archive.

## Install it

Installing the Archive installs it too. On its own:

```bash
# in EiN's terminal, as the administrator
mod install media
```

[Modules](../admin/modules.md) covers installing and removing modules.

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
