# Processing and pipelines

This page is for the administrator. It covers core's pipeline engine: how pipelines, steps, pools
and workers run, how to watch them on the **Dashboard** and in the terminal, what to do when work
fails or stops moving, how to run work again on purpose, and the settings the engine has.

Core brings the engine and no pipelines of its own, so an EiN without modules runs none, and the
**Work** tab of the **Dashboard** stays empty. Pipelines come with modules: of the published ones,
the Archive brings them all, with the workers that run them. [Processing pictures](../archive/processing.md)
covers the Archive's pipelines, workers and settings. The examples on this page name the
Archive's pipelines, such as `media-faces`, which exist only with the Archive installed.

## How work is run

A pipeline waits for one kind of change and then runs its steps, each a command, on the node that
changed. [Changes and pipelines](../concepts/pipelines.md) explains the idea; this page is about
running it.

Work is done in three places:

- **The pipeline engine** (the `pipeline-engine` service) matches changes to pipelines, creates an
  **instance** for each pipeline and node, and runs the short steps itself.
- **Pool workers** run the long steps. A step that names a pool and a kind of job goes as a job into
  that pool, under `/var/pools/`, and a worker takes it when it has room. A worker is a service that
  runs `pipeline-worker`, which takes the kinds it names from one pool, as many at once as its
  capacity allows. Core runs no workers of its own; a module that brings pipelines brings their
  workers.
- **Background services** of the modules turn changes into the events their pipelines wait for,
  and may announce work again on their own.

Every pipeline runs at most once per node at a time: a file announced ten times while it waits is
worked on once. Waiting work is kept in nodes, so nothing is lost when EiN restarts.
`pipeline-list` prints every pipeline that is defined, with its trigger.

## Watch the work on the Dashboard

1. Sign in as an administrator and choose **Dashboard** in the sidebar, under **System**.
2. Read the badge above the title **System dashboard**: **Healthy**, **Catching up**, **Stuck** or
   **Needs a person**. [Health and the dashboard](monitoring.md) explains each word and the
   **Overview** tab.
3. Choose the **Work** tab.

![The Work tab of the System dashboard, marked Catching up: a table with a row per pipeline, from document-index to media-ocr, each with a green workload bar and its Waiting, Queued, Running, Failed, Completed and Cancelled counts and its In, Out and ETA](../../assets/shots/system-work.webp "One row per pipeline says how much is left, how fast it goes, and when it will be done; the pipelines here are the Archive's.")

The table has a row for every defined pipeline, also one that has never run, and a total row
**All pipelines** at the foot. The bar draws the same counts as the columns.

| Column        | What it counts                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| **Waiting**   | Nodes the pipeline has matched but not yet started on: no instance yet                               |
| **Queued**    | Instances that are started and waiting for a worker or for an earlier step                           |
| **Running**   | Instances with a step running this moment                                                            |
| **Failed**    | Instances that failed                                                                                |
| **Completed** | Instances that finished. Older ones are pruned, so this is not a count of every file ever processed. |
| **Cancelled** | Instances stopped on purpose                                                                         |
| **In**        | Jobs that arrived per hour, over the last hour                                                       |
| **Out**       | Instances completed in the last hour, the rate the ETA divides by                                    |
| **ETA**       | When what is waiting will be done at that rate; **no rate** when nothing completed recently          |

Hover over the lightning sign beside a pipeline's name to see what starts it. Choose a row to open
the pipeline's page.

Below the table, **Kinds of work** lists what the pools hold, a row per kind of job: **Left**,
**Running**, **In**, **Out**, **ETA** and **Oldest waiting**. This is where the slow steps are. A
kind may carry a badge:

- **waiting for EMS**: a step of this kind could not run yet, because a service it needs was busy,
  loading a model, restarting or unreachable; for the Archive's steps that service is the media
  service. The jobs are not failed. The kind rests for 30 seconds, then twice as long each time it
  is refused again, up to 10 minutes; hover over the badge for the next try.
- **no worker**: no running worker takes this kind, so the jobs will never run.

**Ongoing** lists the instances with a step running, with the target file and how long it has run.
A step that has written nothing for 30 minutes is listed above it as quiet, with "Still running;
nothing stops a step for taking long." No step is stopped for taking long; a quiet step is for you
to look at, not a fault in itself.

Two warnings can appear above the tabs or the table:

- **Work that nothing will run** names each kind that has jobs and no worker, and the pipelines
  that queue it. See [Work that nothing will run](#work-that-nothing-will-run).
- **N dropped**, above the table, counts events that failed every delivery attempt. See
  [Dropped events](#dropped-events).

## Watch the work in the terminal

Everything on the **Work** tab comes from ordinary commands, which you can run in
[the terminal](../shell/terminal.md) or over SSH:

```bash
# in EiN's terminal
health                          # the verdict in one line, and each check that decides it
pipeline-overview               # instances by pipeline, unfinished steps, queues, completions in the last hour
pool-stat                       # each pool and kind: what is left, how fast, workers and what they take
pipeline-instances -s failed    # the failed instances, newest first
top                             # all of it live, with CPU, memory and services; q quits
```

`pipeline-instances` lists 100 at a time and prints `(more: --after …)` when there are more; pass
that to `--after` for the next page. Give it pipeline names to narrow it:
`pipeline-instances -s failed media-faces media-ocr`.

## Look at one pipeline and its instances

A pipeline's page, opened from the **Work** table, shows its description, its **Trigger**, its
**Steps** and its **Priority**, and below them its **Instances**: **Status**, **Target**,
**Started** and **Duration**. The tabs **All**, **Running**, **Completed**, **Failed** and
**Cancelled** narrow the list, and **Load more** fetches the next page.

Choose an instance to open it. Its page shows the status, the target node and the steps:
**Step**, **Status**, **Depends on**, **Command** and **Duration**. A step's status is one of these:

| Status      | What it means                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `pending`   | Waits for the steps it depends on                                                                    |
| `queued`    | Waits for a free place in the engine                                                                 |
| `waiting`   | Waits in a pool for a worker; the pool and kind are shown beside it, and "retrying" if it ran before |
| `running`   | Runs now; "last output … ago" says when it last wrote anything                                       |
| `completed` | Finished                                                                                             |
| `failed`    | Failed on its last attempt                                                                           |
| `skipped`   | Not run: its condition said no, or the instance was cancelled                                        |

Choose a step to see its **Exit code**, its **Attempts**, its pool and its condition, and for a
failed step the **Error** it wrote. In the terminal, `pipeline-status` prints the same:

```bash
# in EiN's terminal
pipeline-status media-faces/<id>
```

An instance is named after the node it works on, so one file has the same id in every pipeline
that ran on it. Give the id as `<pipeline>/<id>`, as `pipeline-instances` and the pages show it; a
bare id that more than one pipeline uses is refused with the pipelines it could mean.

## When work fails

A failed step is tried again up to its limit of attempts, three unless the pipeline says
otherwise, before the instance fails. Two kinds of failure are treated differently:

- **A service the step needs could not do it yet.** The step goes back to wait with its attempt
  given back, and its kind rests, as **waiting for EMS** shows. Nothing fails however long the
  service is away. The Archive's steps fail this way while the media service is busy or away.
- **The file itself cannot be processed**, such as bytes no decoder can open. The step fails at
  once, whatever attempts are left, and the file is not tried again. `health` counts these under
  `input` and treats them as settled.

A step tells the two apart by its exit code; [Changes and pipelines](../concepts/pipelines.md#when-a-step-fails)
lists them.

### Failed work is run again on its own

The `pipeline-pruner` service runs `pipeline-heal --apply` every hour (`CFG_PIPELINE_PRUNE_INTERVAL`,
3600 seconds). It runs each failed instance again 1 hour after it failed, then 6 hours after the
next failure, then 24 hours after that. An instance that fails all three times is marked as needing
a person and left alone, and `health` then reads **Needs a person**. Instances that failed on their
input, and instances of pipelines no longer defined, are never run again.

`pipeline-heal` without `--apply` only says what it would do:

```bash
# in EiN's terminal
pipeline-heal
```

```text
would rerun 3, would mark 0 for a person; 12 waiting, 1 failed on their input
```

When you know the cause has passed, for example after the media service was fixed, run them all
now. `--now` skips the waits, and the run does not count as one of the three:

```bash
# in EiN's terminal
pipeline-heal --apply --now
```

[Your sidebar and top bar](../guide/customizing.md) shows how to give administrators a button that
runs `pipeline-heal --apply`.

### Work that needs a person

1. List the failed instances: `pipeline-instances -s failed`, or the **Failed** tab of the
   pipeline's page.
2. Open one and choose the failed step to read its **Error**.
3. Fix the cause: start the service the step needs, free disk space, or replace the file.
4. Run the instance again with **Rerun** on its page, or with `pipeline-rerun`:

   ```bash
   # in EiN's terminal
   pipeline-rerun media-faces/<id>
   ```

To act on many at once, tick them on the pipeline's page and choose **Rerun**.

| To                                                       | On the pages          | In the terminal                                |
| -------------------------------------------------------- | --------------------- | ---------------------------------------------- |
| Run an instance afresh from the pipeline's current steps | **Rerun**             | `pipeline-rerun <pipeline>/<id> …`             |
| Run only the failed steps again                          | none                  | `pipeline-restart <pipeline>/<id>`             |
| Run one failed or skipped step again                     | **Retry** on the step | `pipeline-step-restart <pipeline>/<id> <step>` |
| Stop a running instance                                  | **Cancel**            | `pipeline-cancel <pipeline>/<id>`              |
| Delete instances, cancelling running ones first          | **Remove**            | `pipeline-remove <pipeline>/<id> …`            |

Only an administrator sees these buttons, and only an administrator can run these commands.

### Work that nothing will run

A kind with jobs and no worker never moves. **Work that nothing will run** on the **Dashboard**
and `health` (as a failed check `kind <name>`) both say so. The usual cause is that the worker
service is stopped:

1. Open the **Services** tab of the **Dashboard**, or run `service-list`, and look at the workers;
   with the Archive installed, they are `cpu` and `models`.
2. Start the one that is stopped, or read its log if it keeps stopping.
   [Services and logs](services-logs.md) shows how.

When no defined pipeline queues the kind any more, the jobs are left over from a pipeline that was
removed. The warning then gives the command that cancels them, with the pool's path, such as the
Archive's `/var/pools/media`:

```bash
# in EiN's terminal
pool-cancel /var/pools/media --kind <kind>
```

### Dropped events

An event that fails ten delivery attempts, for example because its node no longer exists, is set
aside rather than tried forever. The **Work** table then shows **N dropped**, and `health` fails
its `queue …` check until you deal with them. The engine's own queue is
`/var/queues/pipeline-engine`; a module that turns changes into events has a queue of its own, such
as the Archive's `/var/queues/archive-bridge`:

```bash
# in EiN's terminal
queue-dead /var/queues/pipeline-engine           # list what was set aside
queue-dead --retry /var/queues/pipeline-engine   # put them back in line
queue-dead --drop /var/queues/pipeline-engine    # delete them
```

`--id` limits `--retry` or `--drop` to one entry.

### Steps waiting for a service

When **waiting for EMS** stays on a kind, the service its steps need is the place to look; for the
Archive's steps it is the media service, and [The media service](../ems/index.md) shows how to
check it. Once it answers again, the kind tries on its own at its next try. To try at once:

```bash
# in EiN's terminal
pool-wake               # every resting kind
pool-wake transcribe    # one kind
```

## Run work again on purpose

`pipeline-start` runs one pipeline on one node:

```bash
# in EiN's terminal
pipeline-start media-faces /archive/albums/christmas-2019/IMG_2041.jpg
pipeline-start --var FORCE=-f media-transcode /archive/albums/christmas-2019/MVI_0412.mp4
```

It starts the run at once, in the normal lane, and skips the checks a trigger makes. `--var` sets a
variable the pipeline declares; the second line makes the Archive's `media-transcode` redo a video
that already has its renditions. A pipeline that reads its starting event has nothing to read when
started by hand, and `pipeline-start` warns about it.

A module may bring commands of its own for redoing its work over many files; the Archive's are
`regenerate` and `media-scan`, described in [Processing pictures](../archive/processing.md#run-work-again-on-purpose).

## The bulk lane

An event can put the work it starts in the bulk lane, below all other work, so that what people do
in the meantime is processed first. Bulk work is put behind, never stopped: it runs whenever
nothing else that could run is waiting. With the Archive installed, the work on a large import
runs there; [Processing pictures](../archive/processing.md#large-imports-and-the-bulk-lane) says
which.

`pipeline-rerun` and `pipeline-start` always run in the normal lane; `pipeline-heal` keeps the
lane an instance had.

## The engine's settings

These settings are in the **Processing** category of **Settings → System**, or set with
`config set`. Saving one restarts the service that reads it, when it is read by a service, and work
in progress is picked up again; `CFG_PIPELINE_STEP_QUIET_MS` restarts nothing and counts from the
next look. [Configuration](configuration.md) explains how.

| Setting                                                                               | Default   | What it decides                                                     |
| ------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------- |
| [`CFG_PIPELINE_MAX_CONCURRENT`](../reference/settings.md#cfg_pipeline_max_concurrent) | `4`       | Steps the engine itself runs at once                                |
| [`CFG_PIPELINE_STEP_QUIET_MS`](../reference/settings.md#cfg_pipeline_step_quiet_ms)   | `1800000` | How long a running step may be silent before it is listed as quiet  |
| [`CFG_PIPELINE_PRUNE_INTERVAL`](../reference/settings.md#cfg_pipeline_prune_interval) | `3600`    | Seconds between the pruner's rounds, which also run `pipeline-heal` |

The engine has more settings, for how many triggers and instances it holds; their defaults suit a
machine of any size, and [Settings](../reference/settings.md#processing) lists them all. The
**Processing** category also holds the settings modules bring, such as how much work the Archive's
workers run at once; [Processing pictures](../archive/processing.md#how-much-runs-at-once) covers
those. [Performance and sizing](performance.md) says what to set on a small or a large machine.

## Old instances are pruned

Instances are nodes under `/var/pipelines/instances/<pipeline>/`. Every hour the `pipeline-pruner`
service deletes pool jobs that finished more than 24 hours ago, runs `pipeline-heal --apply`, and
then keeps the 2000 most recently completed instances of each pipeline and deletes the rest. It
leaves failed and running instances alone. A pipeline that is no longer defined, because its module
was removed or it was renamed, loses all its instances once its definition has been gone for 10
minutes.

To delete by hand, use **Prune** on a pipeline's page, which removes its finished instances, or
only those of the tab you are on, or `pipeline-prune`:

```bash
# in EiN's terminal
pipeline-prune -s failed media-faces       # the failed instances of one pipeline
pipeline-prune --older-than 30d            # completed more than 30 days ago, every pipeline
```

## Pipelines come with modules

A module's pipelines are defined when it is set up and removed when it is removed;
[Modules](modules.md) covers both. Removing a pipeline cancels its running instances. To write a
pipeline of your own, see [Writing a module](../develop/modules.md).

## Related pages

- [Changes and pipelines](../concepts/pipelines.md): how a change becomes finished work.
- [Processing pictures](../archive/processing.md): the Archive's pipelines, workers and settings.
- [Health and the dashboard](monitoring.md): the four words and the **Overview** tab.
- [Performance and sizing](performance.md): what to set on your machine.
- [Services and logs](services-logs.md): starting, stopping and reading the workers.
- [Troubleshooting](troubleshooting.md): when work does not get done.
- [Core commands](../reference/commands-core.md#pipeline): every `pipeline-` and `pool-` command.
