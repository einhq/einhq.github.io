# The graphics card

This page is for whoever runs EiN on their own machine and wants it to use an NVIDIA graphics card: what the card speeds up, what the machine needs before EiN can reach it, how EiN is given the card, how to check that it uses it, and how the media service and the language model share one card. Nothing in EiN needs a card; without one everything runs on the processor, more slowly.

## What the card is used for

Two of EiN's optional services use the card. EiN itself and its database never do.

| Service                                        | What runs on the card                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| The media service (`ems`, the `--ems` option)  | The models for faces, voices, transcripts, text in pictures and handwriting, picture and text vectors; AV1 video encoding |
| The language model (`llm`, the `--llm` option) | As many of the model's layers as fit in the part of the card left to it                                                   |

A card changes how fast the work is done, not what comes out of it, with one exception. Each model family is placed when the media service loads it: on the card when there is room, otherwise on the processor with the same weights. Transcripts are the exception: on a machine with a card, whisper always runs on the card and a transcription waits for room there rather than move to the processor; on a machine without one it runs on the processor, at about twice the length of the recording. The two give slightly different words, so a transcript never depends on what else happened to be on the card. The handwriting readers also wait for room on the card rather than move, since on the processor they are about ten times slower.

| Card  | Transcripts                              | Everything else                                  | Language model     |
| ----- | ---------------------------------------- | ------------------------------------------------ | ------------------ |
| 16 GB | on the card                              | on the card                                      | on the card        |
| 12 GB | on the card                              | on the card when there is room, or the processor | partly on the card |
| 8 GB  | on the card                              | on the card when there is room, or the processor | on the processor   |
| none  | on the processor, about 2x the recording | on the processor                                 | on the processor   |

A smaller card only makes the work slower: every output is made on any card or none. Video renditions are AV1. The media service encodes them on the card when the card and its build offer the `av1_nvenc` encoder, and on the processor otherwise; on a card without an AV1 encoder the attempt on the card fails and the processor encodes the video instead. `EMS_VIDEO_ENCODER=libsvtav1` in `~/ein/.env` keeps video encoding on the processor.

Search uses the card too, when the media service has no indexing work: after 10 minutes without any, it unloads its indexing models and moves the search models onto the card, as far as they fit, and gives the card back to indexing as soon as work arrives. The **Media service** tab on the dashboard shows which of the two has it, under [Check that EiN uses the card](#check-that-ein-uses-the-card).

## What card you need

- **NVIDIA only.** EiN uses no other make of card.
- **Driver 610 or newer.** The media service's ffmpeg needs it to encode video on the card.
- **16 GB of card memory is recommended**: room for the media models and the language model side by side. Cards of 8 and 12 GB work, as the table above shows. A transcription needs about 4 GB of the card free.
- **One card.** When the machine has several, EiN hands all of them to both services; it is built and tried with one.

The installer checks the card when you install with `--ems` or `--llm`. It reports the card with the most memory, and every graphics line is at most `low`, never `missing`: without a usable card the install goes on and the services run on the processor.

```text
graphics         ok       NVIDIA GeForce RTX 4070, 12282 MB, driver 610.31
card memory      low      12282 MB: works; 16 GB is recommended, room for the media models and the assistant side by side
container GPU    ok       nvidia-container-toolkit 1.18.1, CDI spec in /var/run/cdi
```

To run only the checks, without installing anything:

```bash
# on the machine that will run EiN
curl -fsSL https://einhq.eu/install.sh | EIN_CHECK=1 bash -s -- --ems --llm
```

## Prepare the machine

The containers reach the card through CDI, the Container Device Interface: a file that describes the card's devices and libraries, which the container engine reads when a container asks for `nvidia.com/gpu=all`. These steps need root, once per machine and again after reinstalling its operating system.

1. Install NVIDIA's driver, 610 or newer, from your distribution or from NVIDIA. Check it:

   ```bash
   # on the machine EiN runs on
   nvidia-smi
   ```

   It lists the card, its memory and the driver version. When it says it cannot reach the driver, fix that first: nothing below works without it.

2. Install `nvidia-container-toolkit` 1.18 or newer, from NVIDIA's package repository. 1.18 is the first that ships `nvidia-cdi-refresh.service`, which writes the CDI file `/var/run/cdi/nvidia.yaml` from the devices the machine actually has, at every boot and whenever the driver or the toolkit changes. Check the version:

   ```bash
   # on the machine EiN runs on
   nvidia-ctk --version
   ```

3. Turn the refresh on, and check that it wrote the file:

   ```bash
   # on the machine EiN runs on
   sudo systemctl enable --now nvidia-cdi-refresh.service
   ls -l /var/run/cdi/nvidia.yaml
   ```

4. Remove any CDI file made by hand. Do not run `nvidia-ctk cdi generate --output=/etc/cdi/…` yourself: such a file names the card numbers of the moment it was made, and podman falls back to it after a reboot has renumbered them. The installer warns about it with `with a hand-made spec in /etc/cdi`.

5. Check your container engine:

   | Engine | What it needs                                                                                                                               |
   | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
   | podman | podman 5 reads the CDI file as it is. Versions before 5, such as 4.9.3 in Ubuntu 24.04 and Linux Mint 22, need the fix in the next section. |
   | Docker | Docker Engine 28.2 or newer, where CDI is on by default.                                                                                    |

   The installer checks both, and reports a podman before 5 that would reject the file, or a Docker before 28.2, as `low` on its `container GPU` line.

6. Check that a container sees the card:

   ```bash
   # on the machine EiN runs on, as the user EiN runs as
   podman run --rm --device nvidia.com/gpu=all docker.io/library/debian:trixie-slim nvidia-smi -L
   ```

   With Docker, write `docker run --rm --device nvidia.com/gpu=all` instead. It prints one line per card. When it fails with `unresolvable CDI devices nvidia.com/gpu=all`, the engine cannot read the CDI file: see the next section.

### Fix the CDI file for podman before 5

podman before 5, such as 4.9.3, rejects the CDI file as `nvidia-ctk` 1.17 and newer writes it, with `unknown field "additionalGids"`, and a container asking for `nvidia.com/gpu=all` then finds no card. The media service's repository has a script that makes every regeneration of the file readable to it, once per machine:

1. Make sure the machine has Python's YAML library, which the fix uses. On Ubuntu and Mint:

   ```bash
   # on the machine EiN runs on
   sudo apt install python3-yaml
   ```

2. Run the installer for the fix. After an install with `--ems`, the media service's sources are in `~/ein/src/ems`:

   ```bash
   # on the machine EiN runs on
   sudo bash ~/ein/src/ems/deploy/install-cdi-refresh.sh
   ```

   Without the media service, fetch its repository first with `git clone https://github.com/einhq/ems.git` and run `deploy/install-cdi-refresh.sh` from there.

The script copies the fix to `/usr/local/sbin/ems-fix-cdi`, adds it to `nvidia-cdi-refresh.service` as a step that runs after every regeneration, removes `/etc/cdi/nvidia.yaml` if there is one, and regenerates the file at once. It ends with the service's status and a count of the `cdiVersion`, `additionalGids` and `/dev/dri/card` lines in `/var/run/cdi/nvidia.yaml`: after the fix, `cdiVersion: 0.6.0` and no `additionalGids`. It keeps working across reboots and toolkit upgrades, and running it again does no harm. Then try the check in step 6 again.

## Give the card to EiN

The first `setup.sh`, the one the installer runs, looks for a card. When `nvidia-smi` works and a CDI file exists in `/var/run/cdi` or `/etc/cdi`, it writes `EIN_GPU=1` into `~/ein/.env`; otherwise `EIN_GPU=0`. From then on, every run of `setup.sh` gives the card to the media service and the language model, whichever of them you installed, by writing it into `~/ein/compose.override.yaml`. Under podman, with both installed, the file reads:

```yaml
# Written by setup.sh from the options in .env and the container engine; edit those and run
# setup.sh again.
services:
  db:
    restart: always
  ein:
    environment:
      CFG_LLM_CARD: card
    restart: always
  ems:
    extends: { file: compose.ems.yaml, service: ems }
    devices: [nvidia.com/gpu=all]
    restart: always
  llm:
    extends: { file: compose.llm.yaml, service: llm }
    devices: [nvidia.com/gpu=all]
    restart: always
```

Under Docker the `restart: always` lines are left out.

`CFG_LLM_CARD` tells EiN where its own language model runs, `card` or `cpu`, so the chat and the health checks can say so ([setting](../reference/settings.md#cfg_llm_card)).

`setup.sh` looks for the card only when it first writes `.env`. When you add a card, or prepare the machine, after EiN is installed, turn it on yourself:

1. Open `~/ein/.env` and set:

   ```ini
   # in ~/ein/.env
   EIN_GPU=1
   ```

2. Run `setup.sh`, which writes `compose.override.yaml` again and starts the services with the card:

   ```bash
   # on the machine EiN runs on
   ~/ein/setup.sh
   ```

   It also fetches the newest sources and rebuilds, as on any update ([Updating](updating.md)).

`EIN_GPU=0` and `~/ein/setup.sh` take the card away again. Do not edit `compose.override.yaml` by hand: `setup.sh` writes it again from `.env` every time it runs.

## Check that EiN uses the card

Open **Dashboard** under **System** in the sidebar. The **Overview** tab has a **GPU** tile, with the card's use and temperature, and a **VRAM** tile, with the memory in use on it, each with the last six hours. Both are missing when the media service sees no card: no tile means no card, not an idle one.

![The System dashboard's Overview tab: tiles for CPU, memory, GPU and VRAM, above the Work card](../../assets/shots/dashboard.webp "The GPU and VRAM tiles appear only when the media service sees a card")

The **Media service** tab shows more:

- **Media service**, at the top, names the **card** and its **driver**.
- **Graphics card mode** says who has the card now: **busy** while indexing has it and search runs on the processor, **quiet** when there is no indexing work and search runs on the card as far as it fits, **switching** while it is handed over. With no card to share, or with `EMS_CARD_QUIET_AFTER=0`, the mode is off and the tab leaves this out.
- **Graphics card memory** splits the card's memory by process: the media service's batch, query and card workers, its other processes such as transcodes, and **outside EMS**, which is the language model when it shares the card.
- The list of models gives each copy its place, **GPU** or **CPU**, and whether it is loaded.

The same is in EiN's terminal. [`ems-status`](../reference/commands-ems.md#ems-status) shows every model and the device it is on, `ems-status --checks` the checks health reads, and [`ems-gpu`](../reference/commands-ems.md#ems-gpu) the card's use and memory now:

```bash
# in EiN's terminal
ems-status --checks
ems-gpu
llm-status
```

`llm-status` says whose the language model is and where it runs, such as `http://llm:8190: ours, on the card` ([reference](../reference/commands-assistant.md#llm-status)). It repeats what `CFG_LLM_CARD` says; how many layers the model really holds on the card is in its log (`podman compose logs llm`).

To prove that every model really computes on the card, run the media service's self-test inside its container. It loads each model in turn and prints the device it bound to, ending with `all GPU checks passed` or a list of failures. It needs most of the card, so run it while the archive is not busy:

```bash
# on the machine EiN runs on, in ~/ein
podman compose exec ems python3 scripts/gpu_selftest.py
```

`--only` with part of a check's name runs only the checks that match.

## Share one card with the language model

With both `--ems` and `--llm` on one card, the two services split it by one number, set on both sides in `~/ein/.env`:

| Variable              | Read by            | Default | What it sets                                                                                                                                                                                 |
| --------------------- | ------------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EMS_CARD_SHARE_MB`   | the media service  | `0`     | The most of the card, in MB, the media service's processes hold. A model that would take it past this runs on the processor, even while the rest of the card is free. `0` is the whole card. |
| `LLM_CARD_RESERVE_MB` | the language model | `8800`  | How much of the card the language model leaves free when it starts. It takes as many layers as fit in the rest, and runs the others on the processor.                                        |

Set the language model's reserve 400 MB above the media service's share: the language model counts the card as `nvidia-smi` does, and some 400 MB of that are never usable by the media service. The media service then never loads into the language model's part. The language model fits its layers when it starts, into what is free then less its reserve, so it gets all of them when it starts beside a media service that holds little, as when both start together; started again while the media service holds models, it gets fewer until its next start. `setup.sh` sets neither, so the media service may use the whole card while the language model leaves it 8800 MB; set both when the two share a card.

On a 16 GB card, the pair EiN's own test machine runs with leaves the media service 9.7 GB, more than the 7.3 GB its busiest work has needed, and the language model the 6.2 GB that hold all of its layers:

```ini
# in ~/ein/.env
EMS_CARD_SHARE_MB=9700
LLM_CARD_RESERVE_MB=10100
```

Apply it:

```bash
# on the machine EiN runs on, in ~/ein
podman compose up -d
```

On a smaller card the language model gets fewer layers and answers more slowly; on an 8 GB card it runs on the processor. A language model at a hosted provider has no part of the card, so leave `EMS_CARD_SHARE_MB` at `0` and the media service uses all of it. [The language model](language-model.md) covers the model itself and the hosted alternative, and [Performance and sizing](performance.md) how memory and processor are shared.

## Be told when the card goes missing

After a reboot or a driver upgrade, a card can be lost to the containers: the media service then still runs, on the processor, and the work only gets slower. To have this show as a failure instead, tell the media service that the machine has a card:

```ini
# in ~/ein/.env
EMS_EXPECT_GPU=1
```

Apply it with `podman compose up -d`. While the media service sees no card, the dashboard's health badge reads **Needs a person**, and `health` and `ems-status --checks` list:

```text
fail  ems gpu  this host is meant to have a card, and none is visible
```

The same check fails, with the error, when the card's CUDA context is lost while the media service runs. [Health and the dashboard](monitoring.md) explains the badge and the checks.

## Run without a card

Without a card, or with `EIN_GPU=0`, the media service and the language model run on the processor. Nothing else changes: every output is made, the same models are used, and transcripts are made on the processor at about twice the length of the recording. The media service then needs the processor and memory the installer asks for with `--ems`: 4 cores, 6 or more recommended, and 16 GB of memory, 32 GB recommended ([Install EiN](../start/install.md#what-you-need)).

## When something goes differently

The commands are written for podman. With Docker, write `docker compose` where they say `podman compose`.

| What you see                                                                                                                                        | What to do                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The installer says `no NVIDIA card: everything runs on the processor, more slowly`                                                                  | The machine has no NVIDIA card, or the system does not list one. EiN works without it.                                                                                                                                              |
| The installer says `an NVIDIA card is present but nvidia-smi cannot reach its driver`                                                               | The driver is missing or not loaded. Run `nvidia-smi` to see why; a reboot after installing the driver is often needed.                                                                                                             |
| The installer says `610 or newer is needed to encode video on the card`                                                                             | Install a newer driver. Until then the models still use the card where they can; video is encoded on the processor.                                                                                                                 |
| The installer says `install nvidia-container-toolkit 1.18 or newer`, or `1.18 or newer is needed`                                                   | Install or upgrade the toolkit ([Prepare the machine](#prepare-the-machine), step 2).                                                                                                                                               |
| The installer says `but no CDI spec: sudo systemctl enable --now nvidia-cdi-refresh.service`                                                        | Run that command, then check that `/var/run/cdi/nvidia.yaml` exists.                                                                                                                                                                |
| The installer says `podman 4.9.3 rejects the CDI spec nvidia-container-toolkit 1.18.1 writes (cdiVersion 0.7.0), so the containers find no card: …` | Apply the [fix](#fix-the-cdi-file-for-podman-before-5) with the command the line ends with, or upgrade podman to 5 or newer.                                                                                                        |
| The installer says `Docker 27.5.1 passes the card through its CDI spec from 28.2 on: update Docker`                                                 | Upgrade Docker Engine to 28.2 or newer.                                                                                                                                                                                             |
| Starting fails with `unresolvable CDI devices nvidia.com/gpu=all`                                                                                   | The engine cannot read the CDI file. On podman before 5, apply the [fix](#fix-the-cdi-file-for-podman-before-5); otherwise check that `/var/run/cdi/nvidia.yaml` exists. With Docker, check that it is Engine 28.2 or newer.        |
| The card is there but the dashboard has no **GPU** tile                                                                                             | `EIN_GPU` in `~/ein/.env` is `0`, most likely because the card or the toolkit came after the install. [Give the card to EiN](#give-the-card-to-ein).                                                                                |
| After a reboot the media service does not start, or starts without the card                                                                         | A container keeps the device paths it was made with, and a reboot can renumber them. Make the containers again from the current CDI file: `podman compose up -d --force-recreate`.                                                  |
| Models show **CPU** on the **Media service** tab while the card has room                                                                            | The card may be full at that moment, or held by the language model. Look at **Graphics card memory**, and set the [share](#share-one-card-with-the-language-model) when the two use one card.                                       |
| The chat answers slowly on a machine with a card                                                                                                    | The language model got only some of its layers, or none. Its log, `podman compose logs llm`, says how many went to the card. Raise the part of the card it gets by lowering `LLM_CARD_RESERVE_MB` and `EMS_CARD_SHARE_MB` together. |
| A transcription waits for a long time                                                                                                               | On a machine with a card, whisper waits for about 4 GB of the card to be free rather than move to the processor. It goes on once other models are unloaded.                                                                         |

[Troubleshooting](troubleshooting.md) has more, and [The media service](media-service.md) covers the media service beyond its card.
