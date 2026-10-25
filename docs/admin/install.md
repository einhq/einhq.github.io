# Installing in detail

This page is for whoever installs and runs EiN on a machine: every option and variable the installer takes, what its checks measure, podman and Docker, what runs where once EiN is up, and how to run it day to day. [Install EiN](../start/install.md) is the short path; read it first if you have not installed EiN yet.

## Two scripts do the install

The install is two scripts, run one after the other:

| Script       | Where it is                                                                                                                                              | What it does                                                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `install.sh` | [einhq.eu/install.sh](https://einhq.eu/install.sh), from the [einhq.github.io](https://github.com/einhq/einhq.github.io/blob/main/install.sh) repository | Checks the machine. When nothing is missing, clones [ein/deploy](https://github.com/einhq/deploy) into `~/ein`, or updates it there with `git pull --ff-only`, and runs `~/ein/setup.sh` with your options. |
| `setup.sh`   | `~/ein/setup.sh`, from ein/deploy                                                                                                                        | Writes `~/ein/.env` the first time, fetches the sources into `~/ein/src`, builds the images, starts them with compose and waits for EiN to answer. Run again, it updates.                                   |

Both run as your own user and need no root. Every option you give the installer after `bash -s --` is passed on to `setup.sh` unchanged; the installer reads only `--ems` and `--llm` itself, to choose which checks to run.

```bash
# on the machine that will run EiN, as your own user
curl -fsSL https://einhq.eu/install.sh | bash -s -- --ems --module archive
```

The installer's code runs from a function called on its last line, so a download cut short runs nothing.

## The options

These are `setup.sh`'s options, and so the installer's too. `~/ein/setup.sh --help` lists them.

| Option            | What it does                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--ems`           | Adds the media service: every media tool and model, in an image of about 30 GB. Sets `EIN_EMS=1` in `.env`.                                                                                                       |
| `--no-ems`        | Takes the media service out again: its container stops and is removed. Sets `EIN_EMS=0`. Its data stays.                                                                                                          |
| `--llm`           | Adds the assistant's language model, Qwen3.5-4B in llama.cpp. Sets `EIN_LLM=1`.                                                                                                                                   |
| `--no-llm`        | Takes the language model out again. Sets `EIN_LLM=0`. The downloaded model stays in the data folder.                                                                                                              |
| `--module <name>` | Adds a module's name to `EIN_MODULES` in `.env`. EiN installs it at its start, with the modules it needs. Give it once for each module. A name is lower case letters, digits and hyphens, starting with a letter. |
| `-h`, `--help`    | Prints the help and stops.                                                                                                                                                                                        |

An option is kept in `.env` once given, so a run without it keeps it: `~/ein/setup.sh` alone runs with the options you chose before. Anything else stops `setup.sh` with `setup.sh: unknown option <option> (--help lists them)`.

`--module` only adds names; there is no option that takes one out. To stop EiN installing a module at its start, remove its name from `EIN_MODULES` in `~/ein/.env`. [Modules](modules.md) explains installing, updating and removing modules, which EiN does itself, not `setup.sh`.

## The variables

Variables go in front of the command they are for. For the installer that is in front of `bash`, not in front of `curl`, which only downloads it:

```bash
# on the machine that will run EiN
curl -fsSL https://einhq.eu/install.sh | EIN_DATA=/srv/ein-data EIN_ENGINE=docker bash -s -- --ems
```

| Variable     | Read by              | Default                            | What it does                                                                                                                                                                              |
| ------------ | -------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EIN_HOME`   | `install.sh`         | `~/ein`                            | The folder EiN is installed in. Later, run `setup.sh` from there.                                                                                                                         |
| `EIN_DATA`   | both, the first time | `~/ein/data`                       | The folder for your files: originals, renditions, scratch space, the language model and the installed modules. Read only when `.env` is written; later runs keep the folder `.env` names. |
| `EIN_CHECK`  | `install.sh`         | unset                              | `1` runs the checks for the options given and stops, installing nothing.                                                                                                                  |
| `EIN_ENGINE` | `setup.sh`           | podman when installed, else Docker | `docker` uses Docker even when podman is installed. Not remembered: give it on every run.                                                                                                 |
| `EIN_GIT`    | both                 | `https://github.com/einhq`         | Where `deploy`, `core`, `db`, `ems` and `llm` are cloned from. Written into `.env` the first time, and read from there after.                                                             |

`EIN_DATA` is made into an absolute path when `.env` is written, so a relative folder is taken from where `setup.sh` runs, which is `~/ein`.

`EIN_GIT` names an organisation, not a repository: it must hold `deploy.git`, `core.git`, `db.git`, and `ems.git` and `llm.git` when you use those options. The modules do not come from there. EiN looks for them in the places the setting [`CFG_MODULE_SOURCES`](../reference/settings.md#cfg_module_sources) names, `https://github.com/einhq` unless you change it.

## What the checks measure

The installer checks the machine before it touches anything. Each check prints one line: `ok`, `low` (the install goes on) or `missing` (nothing is installed). The thresholds depend on whether `--ems` is among the options, or `EIN_EMS=1` is already in `~/ein/.env` from an earlier install; the same goes for `--llm`.

| Check                    | `ok`                                                                                | `low`                                                                    | `missing`                                     |
| ------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------- |
| `system`                 | Linux on x86-64                                                                     |                                                                          | anything else; the installer stops at once    |
| `podman`                 | podman installed and rootless                                                       | podman run as root, or `podman info` fails                               | neither podman nor Docker installed           |
| `docker`                 | Docker installed, when podman is not                                                |                                                                          |                                               |
| `compose`                | `podman compose version` or `docker compose version` runs                           |                                                                          | it does not                                   |
| `git`, `curl`, `openssl` | installed                                                                           |                                                                          | not installed                                 |
| `processor`              | 2 physical cores; with `--ems`, 6                                                   | with `--ems`, 4 or 5                                                     | fewer than 2; with `--ems`, fewer than 4      |
| `memory`                 | 4 GB; with `--ems`, 30 GB                                                           | with `--ems`, 15 to 29 GB                                                | less than 4 GB; with `--ems`, less than 15 GB |
| `disk`                   | 10 GB free; with `--ems`, 100 GB                                                    |                                                                          | less                                          |
| `graphics`               | an NVIDIA card with driver 610 or newer                                             | no NVIDIA card, `nvidia-smi` cannot reach the driver, or an older driver |                                               |
| `card memory`            | 15000 MB or more; the line is left out then                                         | less                                                                     |                                               |
| `container GPU`          | nvidia-container-toolkit 1.18 or newer, with its spec in `/var/run/cdi/nvidia.yaml` | no toolkit, an older one, no spec, or a spec made by hand in `/etc/cdi`  |                                               |

The last three appear only with `--ems` or `--llm`, and none of them can stop the install: without a usable card the media service and the model run on the processor. With several cards, the line names the one with the most memory. [The graphics card](gpu.md) explains what each `low` line asks of you.

A few details of how the checks count:

- **Cores** are physical cores, counted with `lscpu` across every socket, not threads. When `lscpu` gives nothing, the thread count stands in.
- **Memory** is the machine's total, rounded to whole GB. That is why the full threshold is 30 GB: a machine sold with 32 GB reports a little less.
- **Disk** is measured where your files go, `EIN_DATA`. When that folder does not exist yet, the check measures the nearest folder above it that does, and says so: `(not made yet; measured on /home/anna)`.
- **The container engine** is checked podman first. With both installed, the report shows podman's lines even when you set `EIN_ENGINE=docker`, which only `setup.sh` reads.

The images, the build's scratch files and the database live in the container engine's own storage, not in `EIN_DATA`. For rootless podman that is usually `~/.local/share/containers`, for Docker `/var/lib/docker`. When that is another disk than your data folder, it needs room too: the disk check does not measure it.

To run only the checks:

```bash
# on the machine that will run EiN
curl -fsSL https://einhq.eu/install.sh | EIN_CHECK=1 bash -s -- --ems --llm
```

## Install without the installer

You can do what the installer does yourself, for example to read `setup.sh` before it runs or to put EiN in another folder. This skips the machine checks.

1. Clone ein/deploy into the folder EiN should live in:

   ```bash
   # on the machine that will run EiN, as your own user
   git clone https://github.com/einhq/deploy.git ~/ein
   ```

2. Run `setup.sh` from it with your options, and any variables in front:

   ```bash
   # on the machine that will run EiN, as your own user
   EIN_DATA=/srv/ein-data ~/ein/setup.sh --ems --llm --module archive --module assistant
   ```

`setup.sh` changes to its own folder first, so you can run it from anywhere. Later, update the folder with `git -C ~/ein pull --ff-only`, or run the installer with `EIN_HOME` set to the folder: it finds the clone there and updates it.

## Podman or Docker

EiN runs under either. `setup.sh` takes podman when the `podman` command exists, Docker when only `docker` does, and Docker when `EIN_ENGINE=docker` is set. It then needs `podman compose` or `docker compose` to run, or stops with `setup.sh: 'podman compose' does not run: install podman-compose (or docker-compose) for podman, or the compose plugin for Docker`.

The compose files are plain Compose Spec, so both read them alike. What differs:

|                                        | Rootless podman                                                                                                | Docker                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Who runs the containers                | your user                                                                                                      | the Docker daemon; your user needs access to it, usually by being in the `docker` group, which nothing checks |
| Who owns what EiN writes in `EIN_DATA` | your user                                                                                                      | root, unless Docker itself runs rootless                                                                      |
| Where images and the database are      | `~/.local/share/containers`, usually                                                                           | `/var/lib/docker`, usually                                                                                    |
| The graphics card                      | through the CDI spec, in every version; podman 4.9.3 needs a fix first, see [The graphics card](gpu.md)        | through the CDI spec, from Docker Engine 28.2                                                                 |
| After the machine restarts             | nothing starts EiN; see [Start EiN when the machine boots](#start-ein-when-the-machine-boots)                  | Docker starts the containers again with its daemon, unless you stopped them                                   |
| The build's scratch files              | `setup.sh` puts them in a `tmp` folder in podman's storage, as `/tmp` is often too small for the media service | in Docker's own storage                                                                                       |

All data folders are mounted with `z`, which labels them for sharing between containers under SELinux and is ignored where SELinux is not on.

### Keep to one engine

Each engine has its own images, containers and volumes, and so its own database. Install with one and keep to it.

The engine is not remembered between runs. On a machine with both installed, an EiN installed with `EIN_ENGINE=docker` and then updated with a plain `~/ein/setup.sh` is built again under podman, with podman's own empty database volume. While Docker's containers run, podman's cannot take ports 8080 and 2222 and fail to start; with Docker's stopped, an empty EiN starts with a new admin password, on your data folder.

If that has happened, remove podman's containers and run `setup.sh` again with the engine you installed with:

```bash
# on the machine EiN runs on, in ~/ein
podman compose down
EIN_ENGINE=docker ./setup.sh
```

`podman compose down` keeps podman's volumes. The empty database volume it made is `ein_db` in podman's storage; remove it with `podman volume rm ein_db` once you are sure your EiN runs under Docker, as removing it under the engine your EiN actually uses deletes its database.

## What runs where

compose runs EiN as the project `ein`, from the files in `~/ein`. Each service is a container of its own, and only `ein` is reached from other machines.

![One machine running four containers on a private network: ein with the web interface, shell, SSH and SFTP, pipelines and modules; db, PostgreSQL; and the optional ems, the media service, and llm, the language model, sharing a graphics card. Only ein's ports 8080 and 2222 reach the outside, and the data folder below holds the files](../diagrams/system.svg "Only EiN is reached from outside; the database, the media service and the language model answer EiN alone.")

| Service | Image                                                                      | Reached at                                              | Memory limit        | When         |
| ------- | -------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------- | ------------ |
| `ein`   | `localhost/ein`, built on `localhost/ein-core` from the core sources       | ports 8080 (web) and 2222 (SSH and SFTP) on the machine | `EIN_MEMORY`, `6g`  | always       |
| `db`    | `localhost/ein-db`, PostgreSQL with TimescaleDB, built from the db sources | `db:5432`, on the compose network only                  | none                | always       |
| `ems`   | `localhost/ein-ems`, built from the ems sources                            | `ems:8181`, on the compose network only                 | `EMS_MEMORY`, `16g` | with `--ems` |
| `llm`   | llama.cpp's server, downloaded ready-made from `ghcr.io`                   | `llm:8190`, on the compose network only                 | `LLM_MEMORY`, `10g` | with `--llm` |

Every service restarts by itself if it stops on its own (`restart: unless-stopped`). EiN starts once the database answers a query, and waits up to 60 seconds to stop cleanly, as does the media service. [How EiN works](../start/how-ein-works.md#what-runs-beside-ein) says what each part is for; [The media service](media-service.md) and [The language model](language-model.md) cover the two optional ones.

### The files in `~/ein`

| Path                    | What it is                                                                       | From               |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------ |
| `setup.sh`              | the install and update script                                                    | ein/deploy         |
| `compose.yaml`          | EiN and its database: what every install runs                                    | ein/deploy         |
| `compose.ems.yaml`      | the media service                                                                | ein/deploy         |
| `compose.llm.yaml`      | the language model                                                               | ein/deploy         |
| `ein.Containerfile`     | EiN's image: core's own image with the web interface built in                    | ein/deploy         |
| `.env`                  | your options, settings and the passwords made at the install                     | made by `setup.sh` |
| `compose.override.yaml` | the options in `.env` as services                                                | made by `setup.sh` |
| `src/`                  | the sources that are built: `core`, `db`, and `ems` and `llm` with their options | made by `setup.sh` |
| `data/`                 | the data folder, when `EIN_DATA` was left at its default                         | made by `setup.sh` |

Leave the files from ein/deploy as they are: an update runs `git pull --ff-only` on the folder and stops when a file you changed is in its way. What you want to change goes in `.env`, which git ignores.

### The data folder

`setup.sh` makes these folders in `EIN_DATA` on every run. Both EiN and the media service mount the first four at the same paths, so a path EiN hands the media service is the path it opens.

| Folder           | Mounted at                                | What it holds                                                                       |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| `files`          | `/files`; read-only for the media service | your originals                                                                      |
| `old`            | `/old`; read-only for the media service   | older originals                                                                     |
| `files-volatile` | `/files-volatile`                         | thumbnails and other renditions, which EiN can make again                           |
| `files-tmp`      | `/files-tmp`                              | scratch space                                                                       |
| `llm`            | `/models` in the language model           | the model, downloaded at its first start                                            |
| `modules`        | `/modules-installed` in EiN               | the installed modules, so they stay when EiN is updated or its container made again |

The database is not in the data folder. It is the volume `ein_db` in the container engine's storage, which compose made, so that the database's own user owns it; a folder mounted from your home would not be under rootless podman. [Your data](data.md) explains what to back up and why the database and the data folder belong together.

### `.env`

`setup.sh` writes `~/ein/.env` the first time it runs, readable by your user only. It is three things at once: compose reads it for the values in the compose files, EiN and the media service get every line of it as their environment, and `setup.sh` keeps your options in it. A fresh one looks like this:

```ini
# ~/ein/.env, as setup.sh writes it (the comments it writes are shortened here)
EIN_EMS=0
EIN_LLM=0
EIN_GPU=1
EIN_MODULES=""
EIN_DATA=/home/anna/ein/data
POSTGRES_PASSWORD=5c0d2e7a91f84b36a0e9c4d17b2f6385e1a9c07d4b2e8f13
EMS_KEY=a83f19c26d0e47b5928c1f6e3d7a04b9c5e2f18d6a3b7c90
TZ=Europe/Stockholm
EIN_BIND=0.0.0.0
EIN_HTTP_PORT=8080
EIN_SSH_PORT=2222
# CFG_LLM_URL=https://api.openai.com
# CFG_LLM_KEY=
# CFG_LLM_PROVIDER=OpenAI
# CFG_LLM_MODEL=
EIN_GIT=https://github.com/einhq
```

The options you gave come next: `setup.sh` sets `EIN_EMS`, `EIN_LLM` and `EIN_MODULES` after writing the file.

| Line                            | What it is                                                                                                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EIN_EMS`, `EIN_LLM`            | `1` when the media service or the language model is installed; `--ems`, `--no-ems`, `--llm` and `--no-llm` set them                                                                                       |
| `EIN_GPU`                       | `1` when the first run found an NVIDIA card that `nvidia-smi` reaches, with a CDI spec in `/var/run/cdi/nvidia.yaml` or `/etc/cdi`. Set only then; see [The graphics card](gpu.md) for a card added later |
| `EIN_MODULES`                   | the modules EiN installs at its start when they are missing, separated by spaces                                                                                                                          |
| `EIN_DATA`                      | the data folder                                                                                                                                                                                           |
| `POSTGRES_PASSWORD`             | the database's password, random, made here                                                                                                                                                                |
| `EMS_KEY`                       | the key EiN and the media service share, random, made here                                                                                                                                                |
| `TZ`                            | the machine's time zone, from `timedatectl`, `/etc/timezone` or `UTC`                                                                                                                                     |
| `EIN_BIND`                      | the address the ports listen on: `0.0.0.0` for every address of the machine, `127.0.0.1` for the machine alone                                                                                            |
| `EIN_HTTP_PORT`, `EIN_SSH_PORT` | the ports on the machine for the web interface and for SSH and SFTP                                                                                                                                       |
| `CFG_LLM_…`                     | a hosted language model instead of `--llm`; see [The language model](language-model.md)                                                                                                                   |
| `EIN_GIT`                       | where the sources are cloned from                                                                                                                                                                         |

The two passwords are kept nowhere else. Without them the database cannot be reached, so copy `.env` with every backup. [Configuration files](../reference/config-files.md) has every file EiN reads.


### `compose.override.yaml`

Every `compose` command reads `compose.override.yaml` beside `compose.yaml` by itself, so a plain `podman compose up -d` starts the same services `setup.sh` does. `setup.sh` writes it from `.env` on every run; do not edit it, as the next run writes over it. With the media service, the model and a card it reads:

```yaml
# ~/ein/compose.override.yaml
# Written by setup.sh from the options in .env; edit those and run setup.sh again.
services:
  ems:
    extends: { file: compose.ems.yaml, service: ems }
    devices: [nvidia.com/gpu=all]
  llm:
    extends: { file: compose.llm.yaml, service: llm }
    devices: [nvidia.com/gpu=all]
  ein:
    environment:
      CFG_LLM_CARD: card
```

[`CFG_LLM_CARD`](../reference/settings.md#cfg_llm_card) tells EiN whether the model runs on the card (`card`) or the processor (`cpu`).

## Change the installation afterwards

| To change                                                    | Do this                                                                                                                                                               |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add or remove the media service or the language model        | `~/ein/setup.sh --ems`, `--no-ems`, `--llm` or `--no-llm`. This is also an update: see [Updating](updating.md).                                                       |
| Add a module EiN installs at its start                       | `~/ein/setup.sh --module <name>`, or install it at once in **Settings → Modules**; see [Modules](modules.md).                                                         |
| A setting of EiN (`CFG_…`) or of the media service (`EMS_…`) | Add the line to `~/ein/.env`, then run `podman compose up -d` in `~/ein`. Most settings can instead be changed while EiN runs; see [Configuration](configuration.md). |
| The ports, or keep EiN to the machine                        | Change `EIN_HTTP_PORT`, `EIN_SSH_PORT` or `EIN_BIND` in `.env`, then `podman compose up -d`; see [Ports, HTTPS and remote access](network.md).                        |
| A container's memory limit                                   | Add `EIN_MEMORY=8g`, `EMS_MEMORY=20g` or `LLM_MEMORY=12g` to `.env`, then `podman compose up -d`; see [Performance and sizing](performance.md).                       |
| The language model's model or image                          | `LLM_GGUF_REPO`, `LLM_GGUF_FILE`, `LLM_IMAGE` and `LLM_CARD_RESERVE_MB` in `.env`; see [The language model](language-model.md).                                       |
| The data folder                                              | `EIN_DATA` in `.env` names it, but changing the line does not move your files; see [Your data](data.md).                                                              |

When a change does not take, `podman compose up -d --force-recreate` makes every container again. With Docker, write `docker compose` for `podman compose`.

Some of EiN's environment is set by `compose.yaml` and wins over a line in `.env`: `POSTGRES_URL`, `CFG_HTTP_PORT` and `CFG_SSH_PORT` (always 8080 and 2222 inside the container), `CFG_EMS_URL`, `CFG_EMS_KEY` (from `EMS_KEY`), and the folder paths. For the media service, `EMS_PORT`, `EMS_KEY` and `EMS_ROOTS` are set the same way.

## Run EiN day to day

Run compose from `~/ein`, where it finds the project and its `.env`:

```bash
# on the machine EiN runs on, in ~/ein
podman compose ps                # what runs, and whether db and ems are healthy
podman compose logs -f ein       # follow EiN's log; ems, llm or db for the others
podman compose restart ein       # restart EiN alone
podman compose stop              # stop everything, keeping the containers
podman compose start             # start them again
podman compose down              # stop everything and remove the containers
podman compose up -d             # make the containers and start them
```

With Docker, write `docker compose` instead. `down` keeps the database and the data folder; the containers are made again by the next `up -d`. It does remove the log, and with it the admin password a new EiN printed there.

> [!WARNING]
> `podman compose down -v` also deletes the volumes, and the volume `ein_db` is your database: every name, album, person, setting and account. Never add `-v` unless you mean to start from nothing.

EiN is down while it restarts, and a restart takes longer when there is a module to install. [Services and logs](services-logs.md) covers EiN's own logs and services, the ones inside the container, and [Health and the dashboard](monitoring.md) what to watch.

### Start EiN when the machine boots

Under Docker the containers come back with the Docker daemon, which starts with the machine on most systems, as long as you did not stop them yourself.

Under rootless podman, nothing in the install starts EiN when the machine boots. podman's own `podman-restart.service` starts only containers whose restart policy is `always`, and EiN's are `unless-stopped`. One way is a systemd service of your user's that runs compose:

1. Write the service:

   ```ini
   # ~/.config/systemd/user/ein.service
   [Unit]
   Description=EiN

   [Service]
   Type=oneshot
   RemainAfterExit=yes
   WorkingDirectory=%h/ein
   ExecStart=/usr/bin/podman compose up -d
   ExecStop=/usr/bin/podman compose stop

   [Install]
   WantedBy=default.target
   ```

2. Turn it on, and let your user's services run without you being signed in:

   ```bash
   # on the machine EiN runs on, as your own user
   systemctl --user daemon-reload
   systemctl --user enable --now ein.service
   sudo loginctl enable-linger "$USER"
   ```

After the next restart of the machine, `podman compose ps` in `~/ein` shows the containers up.

## Update and remove

Running the installer or `~/ein/setup.sh` again is the update: the newest sources of everything installed, built and started again, with `--force-recreate` so every container is made from the new images, and `--remove-orphans` so a service you left out stops. [Updating](updating.md) explains what it touches and what it keeps.

There is no uninstall script. [Your data](data.md) says how to move EiN to another machine and how to remove it with its data.

## When something goes differently

The commands are written for podman; with Docker, write `docker compose`. [Install EiN](../start/install.md#when-something-goes-differently) covers the messages of a first install, and [Troubleshooting](troubleshooting.md) everything after.

| What you see                                                                                    | What to do                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fatal: destination path '/home/anna/ein' already exists and is not an empty directory.`        | `~/ein` exists but is not a clone of ein/deploy. Move it away, or install elsewhere with `EIN_HOME`.                                                                               |
| `git pull` stops with a message about local changes, and nothing is installed                   | A file from ein/deploy in `~/ein` was changed. See what with `git -C ~/ein status`, put back the original with `git -C ~/ein checkout -- <file>`, and move the change into `.env`. |
| `setup.sh: neither podman nor Docker is installed`                                              | Install one, with its compose.                                                                                                                                                     |
| `setup.sh: --module takes a module's name, such as archive: <name>`                             | A module is given by its name, such as `archive`, in lower case. A repository address goes to `mod install` in EiN's terminal instead.                                             |
| `setup.sh: --module needs a name, such as archive`                                              | `--module` was the last word of the command. Give the name after it.                                                                                                               |
| The build stops with no space left on the device                                                | The container engine's storage is full, not necessarily your data folder. `podman system df` shows what takes the room there.                                                      |
| `podman compose up` says a port is already in use                                               | Something else listens on 8080 or 2222, perhaps an EiN under the other engine (see [Keep to one engine](#keep-to-one-engine)). Stop it, or choose other ports in `.env`.           |
| `setup.sh: EiN did not answer at http://127.0.0.1:8080/ in 10 minutes: podman compose logs ein` | Read the log it names. `podman compose ps` shows whether `db` became healthy; EiN does not start before it.                                                                        |
| EiN is up, but a new `CFG_` line in `.env` has no effect                                        | Run `podman compose up -d --force-recreate` to make EiN's container again with it, and check that `compose.yaml` does not set the same variable itself (see [Change the installation afterwards](#change-the-installation-afterwards)).                                             |
| After an update, a module is still the old version                                              | `setup.sh` does not update modules. Use **Update** in **Settings → Modules**; see [Modules](modules.md).                                                                           |

## Related pages

- [Install EiN](../start/install.md): the short path, and what to do first after it.
- [The graphics card](gpu.md): the NVIDIA driver, the container toolkit and the CDI spec.
- [Ports, HTTPS and remote access](network.md): reaching EiN from outside, behind a proxy.
- [Configuration](configuration.md) and [Environment variables](../reference/environment.md): every setting and where it is set.
- [Updating](updating.md) and [Your data](data.md): keeping EiN current, backing it up, moving and removing it.
- [Services and logs](services-logs.md) and [Troubleshooting](troubleshooting.md): when something is wrong.
