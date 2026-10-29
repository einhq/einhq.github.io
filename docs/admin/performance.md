# Performance and sizing

This page is for the administrator who runs EiN on their own machine: what each part of EiN uses of the processor, memory and disk, how big a machine to give it, how to set the containers' memory limits, and which settings decide how much processing runs at once. The graphics card has a page of its own, [The graphics card](../ems/gpu.md).

## What uses the machine

EiN runs as up to four containers. Each has its own appetite, and three of them have a memory limit that compose sets from `~/ein/.env`.

| Container | What uses the machine                                                                                                                      | Memory limit                | Processor   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | ----------- |
| `ein`     | The web interface, every shell and SSH session, the pipelines that decide what to do with each file, and the modules                       | `EIN_MEMORY`, default `6g`  | not limited |
| `db`      | PostgreSQL: every node, link, setting and the search index                                                                                 | none; 1 GB of shared memory | not limited |
| `ems`     | The media service, with `--ems`: thumbnails, video encoding, fingerprints, and the models for faces, voices, transcripts, text and vectors | `EMS_MEMORY`, default `16g` | not limited |
| `llm`     | The assistant's language model, with `--llm`: about 5.6 GB of model, on the card or in memory                                              | `LLM_MEMORY`, default `10g` | not limited |

Nothing limits how many cores a container uses. The heavy work is in the media service: most pipeline steps are calls into it, and EiN mostly decides what to ask for and stores the answers. A machine running EiN Core alone, without the media service, does little beyond serving the interface and the shell.

## Choose a machine

The installer checks the machine against the first two rows of these figures before it installs anything ([What the checks measure](install.md#what-the-checks-measure)); the language model's row is advice it does not check:

| What you install                          | Processor                      | Memory                                             | Free disk                     |
| ----------------------------------------- | ------------------------------ | -------------------------------------------------- | ----------------------------- |
| EiN Core                                  | 2 cores                        | 4 GB                                               | 10 GB, plus your files        |
| With the media service (`--ems`)          | 4 cores; 6 or more recommended | 16 GB; 32 GB recommended                           | about 100 GB, plus your files |
| With the language model as well (`--llm`) | as above                       | about 5.6 GB more, unless the model is on the card | as above                      |

Cores are physical cores, not threads. The default limits of the three containers add up to 32 GB (6 + 16 + 10). On 16 GB the installer calls the memory enough with the language model left out or hosted, so leave it out or use a hosted one, as [The language model](../assistant/language-model.md) describes.

What the figures mean in practice:

- **More cores** let more media work run side by side, once you raise the settings in [Let more work run at once](#let-more-work-run-at-once). The defaults are set for a small machine and use few cores.
- **More memory** matters for the media service, which holds several models at once, and for long videos, which are decoded on the processor without a card.
- **A graphics card** changes how fast the models run, not what they find. On a card a recording's transcript takes about a minute; without one it takes about twice the length of the recording. [The graphics card](../ems/gpu.md) has the details.
- **Disk** holds your originals once, plus the thumbnails and other renditions EiN makes of each, plus the images and the database in the container engine's storage. [Watch disk space](#watch-disk-space) shows how to see how fast it grows.

## Set the memory limits

A memory limit is a ceiling, not a reservation: a container uses what it needs up to its limit, and the rest of the machine's memory stays free for the others. Change a limit in `~/ein/.env`:

1. Open `~/ein/.env` in an editor and add or change the line for the container:

   ```ini
   # in ~/ein/.env
   EIN_MEMORY=8g
   EMS_MEMORY=20g
   LLM_MEMORY=12g
   ```

   The value is a number with a unit, `g` for gigabytes or `m` for megabytes. Leave out a line to keep its default.

2. Make the containers again with the new limits:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose up -d
   ```

   compose makes again the containers whose settings changed. EiN is down while it restarts. With Docker, write `docker compose`.

   Under podman-compose, a container that `podman compose up -d` makes again has no swap limit, so it may swap as much again as its memory limit; `./setup.sh` makes the containers again with the swap limit.

3. Check the new limit. In EiN's terminal, `top` shows EiN's memory against its limit in its **Memory** panel, for example `367 MB of 6.0 GB`.

![EiN's top in the terminal: a CPU graph for the machine's 6 cores, a Memory panel with RAM at 367 MB of 6.0 GB and the heap, a Disk panel with the free space and when it fills, the Work panel saying nothing is waiting, and lists of sessions, processes and services](../../assets/shots/terminal-top.webp "top shows EiN's memory against its container's limit, so you see how close it comes.")

How to choose the limits:

- **Keep the limits together below the machine's memory**, with a few GB to spare for the database, which has no limit, and for the system itself. A container that grows is then stopped at its own limit, and the kernel does not have to pick a process to stop somewhere else on the machine.
- **`EIN_MEMORY`**: EiN itself, its shells and its pipelines. Raise it from the default of 6 GB if `top` shows EiN close to its limit during an import.
- **`EMS_MEMORY`**: the media service holds the models it is using and decodes videos. A video decoded on the processor is planned within a budget of 4000 MB (`EMS_CPU_ENCODE_MAX_MB`) and split into parts when it would need more, so keep the limit well above that. Its main model process restarts itself when it passes 60% of the limit, so the rest is left for the decoding and the tools.
- **`LLM_MEMORY`**: the model and its working memory. The default fits the default model; [The language model](../assistant/language-model.md) explains which other models the container can run.

### When a container reaches its limit

When a container needs more than its limit, the kernel stops one of its processes. Each container restarts by itself if its main process stops, and the work it had in hand is picked up again: a pipeline step that was interrupted runs again, as long as it has attempts left. To see whether that happened, read the kernel's log on the machine:

```bash
# on the machine EiN runs on
sudo dmesg | grep -i 'out of memory'
```

A line that names `Memory cgroup out of memory` is a container that reached its limit. Raise that container's limit, or lower the work that runs at once ([Let more work run at once](#let-more-work-run-at-once) describes the settings, which work in both directions).

The media service's model processes log a warning of their own when the models alone do not fit under their ceiling, ending in "Raise CFG_MODEL_MAX_RSS if this is the real footprint." For the media service, set it as `EMS_MODEL_MAX_RSS` in `~/ein/.env`, such as `EMS_MODEL_MAX_RSS=12g`, or raise `EMS_MEMORY`, which raises the ceiling with it.

## How processing is paced

New files go through pipelines, and the pipelines' heavy steps go to two workers inside EiN, which decide how much runs at once. Both are services of the Archive module, and both are paced by settings in **Settings → System**, category **Processing**.

| Worker   | Runs                                                                                                                                                                  | Paced by                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `cpu`    | Unpacking zips, reading metadata, thumbnails and posters, fingerprints, duplicates, matching faces to people, staging's dating and grouping, video and audio encoding | **CPU budget for media work** (`CFG_CPU_SLOTS`, default `2`)  |
| `models` | Faces, picture vectors, text in pictures, text vectors, transcripts, voices and shots: each a request to the media service's models                                   | **Model requests in flight** (`CFG_MODEL_SLOTS`, default `2`) |

The CPU budget is shared by cost: most jobs take 1 of it, and a video's encoding takes 2. With the default budget of 2, an encoding runs alone, while two smaller jobs can run together. Matching faces to people has a higher priority than encoding, so a queue of videos does not hold up people appearing in the interface.

The `models` worker takes turns between its kinds of work. It stays on one kind for up to **Model backlog rotation (ms)** (`CFG_MODEL_KIND_QUANTUM_MS`, an hour) while others are waiting, so that faces, which keep coming during an import, do not hold back the transcripts.

The media service has its own limits on how much it runs at once, set in `~/ein/.env`:

| Variable                  | Default | What it bounds                                                                                                                     |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `EMS_LIMIT_MODELS`        | `8`     | Model requests running at once                                                                                                     |
| `EMS_LIMIT_TOOLS`         | `4`     | Tool work at once: reading metadata, thumbnails, fingerprints                                                                      |
| `EMS_LIMIT_ENCODES`       | `2`     | Whole-file work at once: video encoding, storyboards, finding shots                                                                |
| `EMS_QUEUE_DEPTH`         | `64`    | Requests that may wait for a place; past it the media service answers that it is busy, and EiN tries again later                   |
| `EMS_INTERACTIVE_RESERVE` | `1`     | Extra places for models and tools, kept for a person waiting, such as a search, so that processing never makes them wait behind it |

EiN's settings decide how much it asks for; the media service's decide how much it does. Asking for more than the media service runs at once only moves the wait into its queue.

## Let more work run at once

On a machine with more cores than the minimum, raise the CPU budget so that more thumbnails, fingerprints and encodings run side by side:

1. Sign in as an administrator and choose **Settings** in the sidebar, under **System**.
2. Choose the category **Processing**.
3. Set **CPU budget for media work** to the number of jobs you want at once, for example `4` on a machine with 6 cores, and choose **Save change**. The line under it says "Restarted cpu."
4. If you set the budget above 4, raise **CPU worker slots** (`CFG_CPU_WORKERS`) to the same number. It caps how many jobs can be in flight whatever the budget.
5. Watch the result on the **Dashboard**, on its **Work** tab, as described in [Watch it keep up](#watch-it-keep-up).

Most of these jobs are work for the media service, so with a budget above 4, raise `EMS_LIMIT_TOOLS` in `~/ein/.env` to match and run `podman compose up -d`.

> [!WARNING]
> Keep **CPU budget for media work** at 2 or more. A video's encoding takes 2 of the budget, and with 1 no video is ever encoded.

With a graphics card that has room to spare, or many cores for the models, raise **Model requests in flight** the same way; it restarts the `models` service. Keep it at or below `EMS_LIMIT_MODELS`. More requests at once do not always finish sooner: the media service runs the requests for one model one after another, so the gain comes from different kinds of work overlapping.

From the terminal, the same changes are:

```bash
# in EiN's terminal, as an administrator
config set CFG_CPU_SLOTS 4
config set CFG_MODEL_SLOTS 4
config unset CFG_CPU_SLOTS      # back to the default
```

The other settings in **Processing** tune the pipeline engine itself: how many steps, queue entries and triggers it handles at once, and how often it cleans up. Their defaults suit any machine EiN runs on, and [Processing and pipelines](processing.md) explains what they do. Every one is listed on [Settings](../reference/settings.md#processing).

## Keep the interface quick during heavy work

While the media service works through an import, people still search and browse. Several things keep their requests ahead of the processing without any setting:

- The media service answers searches from a model process of its own, on the processor, while the processing runs in another at a lower priority (`EMS_WORKER_NICE`, default `10`). When the card has been free of processing for 10 minutes (`EMS_CARD_QUIET_AFTER`, `600` seconds), searches move to the card.
- A search uses at most a few cores (`EMS_QUERY_WORKER_THREADS`, the machine's cores less two, at most 4), so it does not wait on threads the processing holds.
- `EMS_INTERACTIVE_RESERVE` keeps a place free for a person waiting.

If the interface still feels slow on a small machine during an import, lower **CPU budget for media work** back towards 2 and **Model requests in flight** towards 1 until the import is done. The work waits in its queue and costs nothing there.

## Watch disk space

Your originals take the space they take. On top of them EiN keeps, in the data folder's `files-volatile`, the thumbnails, posters, storyboards and the AV1 versions of videos it makes for the browser, which it can make again if they are lost. In EiN's terminal, `df` shows each storage tier's free space, how fast it grows a day, and when it will be full at that rate, with the size of the database:

```bash
# in EiN's terminal
df
```

The same figures are on the **Dashboard**, and `top`'s **Disk** panel shows them live. [Files and storage](../concepts/files.md) explains the tiers.

The container engine keeps the images, the build's scratch files and the database in its own storage, usually `~/.local/share/containers` for rootless podman and `/var/lib/docker` for Docker, which may be another disk than your data folder. Each update builds new images, and `setup.sh` removes the ones they replaced once the new EiN answers; a build's intermediate stages and other images without a name stay. To see what the images take, and to remove the unnamed ones no container uses:

```bash
# on the machine EiN runs on
podman system df
podman image prune
```

With Docker, write `docker` for `podman`. `podman image prune` removes only images without a name that no container uses; the database is a volume and is never touched by it. Never add `--volumes` to a prune: `ein_db` is your database.

## Watch it keep up

Whether the machine is big enough shows in whether it keeps up with the work:

| Where                            | What it tells you                                                                                                                                                                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The **Dashboard**'s badge        | **Healthy**: nothing is waiting. **Catching up**: work is waiting and some of it, or a pipeline instance, finished in the last hour. **Stuck**: work is waiting and none finished in the last hour. **Needs a person**: a check failed |
| The **Dashboard**'s **Work** tab | Each kind of work, what is left of it, how fast it goes, and when it will be done                                                                                                                                                      |
| `top`                            | The processor, EiN's memory and the event loop's lag, the disks, and the work, live                                                                                                                                                    |
| `host-metrics`                   | EiN's processor and memory use now and over the last 6 hours (`--window` in minutes)                                                                                                                                                   |
| `pool-stat`                      | The backlog, rates and policy of each kind of work in the queues                                                                                                                                                                       |
| `gauges`                         | What the running services report beside the machine's figures, such as the card's memory                                                                                                                                               |
| `ems-status`                     | The media service's models, what it is running, its queues and the memory of its model processes                                                                                                                                       |

**Catching up** after an import is normal; the time it takes depends on the machine and on how much there is. A machine that is too small shows as a **Work** tab whose time to completion keeps growing while new files come in, or as containers stopped at their memory limits. [Health and the dashboard](monitoring.md) explains the badge, the checks and the tabs.

## When something goes differently

**The Dashboard reads Stuck.** Nothing has finished in the last hour. Read the checks under the badge on the **Overview** tab: they name the kind of work that is not moving and why, often the media service not answering. [Troubleshooting](troubleshooting.md) goes through the causes.

**Videos never get their browser version.** Check that **CPU budget for media work** is 2 or more, and on the **Work** tab whether `transcode` is waiting. Without a graphics card, a long video takes many minutes to encode.

**A container restarts on its own.** Look for `Memory cgroup out of memory` in the kernel log as in [When a container reaches its limit](#when-a-container-reaches-its-limit), and raise that container's limit.

**The whole machine slows down or stops responding during an import.** The containers together are using more memory than the machine has. Lower the limits so that they fit the machine, or leave out the language model, and lower the processing settings while the import runs.

**Searches are slow while an import runs.** Lower **Model requests in flight** and **CPU budget for media work** for the duration of the import, as in [Keep the interface quick during heavy work](#keep-the-interface-quick-during-heavy-work).

**The disk fills up.** Run `df` in EiN's terminal to see which tier grows, and `podman system df` on the machine to see what the container engine's storage takes. EiN has no command that moves the data folder; [Your data: backup, moving and removing](data.md) explains how.

## Related pages

- [The graphics card](../ems/gpu.md): what the card speeds up and how the media service and the language model share it.
- [Installing in detail](install.md): the containers, `.env` and the installer's checks.
- [Configuration](configuration.md): where settings live and what a change restarts.
- [Processing and pipelines](processing.md): what the pipelines do with each file, and the engine's settings.
- [The media service](../ems/index.md) and [The language model](../assistant/language-model.md): the two optional services.
- [Health and the dashboard](monitoring.md): the badge, the checks and the Work tab.
- [Settings](../reference/settings.md#processing): every **Processing** setting with its default.
