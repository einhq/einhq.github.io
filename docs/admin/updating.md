# Updating

This page is for the person who runs EiN on their own machine. It covers how to bring EiN and its
services up to date, what an update touches and what it keeps, how to see which version runs, and
what to do when an update goes differently.

## How updates work

EiN has no releases and no version numbers to choose between. An update builds the newest commit of
each repository from source, on your machine, and starts it in place of what ran before. Which
repositories it fetches depends on what is installed:

| Repository | What it is                                       | Fetched when            |
| ---------- | ------------------------------------------------ | ----------------------- |
| deploy     | `~/ein` itself: `setup.sh` and the compose files | by the installer only   |
| core       | EiN: the tree, the shell, the web interface      | always                  |
| db         | PostgreSQL with TimescaleDB                      | always                  |
| ems        | the media service                                | with the media service  |
| llm        | the language model's chat template               | with the language model |

The language model's server is not built: it is llama.cpp's ready-made image, named by a fixed
digest in `compose.llm.yaml`. It changes only when that file does, which is when the deploy
repository is updated.

Modules are not part of this. They live in the data folder and are updated separately, on
**Settings → Modules**; see [Update a module](modules.md#update-a-module).

## Before you update

1. Back up. An update cannot be undone: there is no command to go back to the previous version,
   and the database is changed in place when the new EiN starts. [Your data](data.md) says what to
   copy and why the database and the data folder go together.
2. Make sure the admin password is one you know. A new EiN prints its first admin password to its
   log once, and an update makes the containers again, which removes that log.
3. Check that the container engine has room. An update builds new images before the old ones are
   removed, and the media service's image is large. `podman system df` shows the space images take.

## Update EiN

Run the installer again, as your own user, on the machine EiN runs on:

```bash
# on the machine EiN runs on, as your own user
curl -fsSL https://einhq.eu/install.sh | bash
```

You need no options: those you chose before are kept in `~/ein/.env`. If EiN lives somewhere other
than `~/ein`, set `EIN_HOME` to that folder in front of `bash`, as at the install.

What you will see:

1. The installer checks the machine against the system requirements again, with the media service
   and the language model counted when `.env` has them. When a check fails it stops here and
   changes nothing; [Installing in detail](install.md#what-the-checks-measure) explains each
   check.
2. `Updating /home/anna/ein`: it runs `git pull --ff-only` on the folder, which brings the newest
   `setup.sh` and compose files.
3. It runs `~/ein/setup.sh`, which prints its steps:

   ```text
   == Fetching the sources
     core 3f2a9c1 2026-10-24
     db 8b41e07 2026-09-30
     ems a90c2d4 2026-10-22

   == Building the images

   == Starting EiN

   EiN is up at http://ein:8080/
   ```

   Each source line is the repository, the commit it is now at and that commit's date. Between the
   steps the container engine prints its own build and start output.

The build happens while the old EiN keeps running. EiN is down from the moment its container is made
again until the new one answers, which is usually a minute or two, and longer when modules have to
be set up or their pages built again. `setup.sh` waits up to 10 minutes for EiN to answer on its
port.

### Update with `setup.sh` alone

`~/ein/setup.sh` without the installer fetches, builds and restarts in the same way, but it does not
update `~/ein` itself and skips the machine checks. To do the whole update by hand:

```bash
# on the machine EiN runs on, as your own user
git -C ~/ein pull --ff-only
~/ein/setup.sh
```

Without the first line, `setup.sh` and the compose files stay as they were, and with them the
language model's image.

Every run of `setup.sh` is an update, also one that only adds or removes an option, such as
`./setup.sh --ems`. To apply a changed line of `.env` without updating, run `podman compose up -d`
in `~/ein` instead; [Configuration](configuration.md#set-a-value-in-the-deployment) explains it.

> [!WARNING]
> On a machine with both podman and Docker, `setup.sh` takes podman unless `EIN_ENGINE=docker` is
> set, and the engine is not remembered. If you installed with Docker, update with
> `EIN_ENGINE=docker` every time, or the update builds a second, empty EiN under podman. See
> [Keep to one engine](install.md#keep-to-one-engine).

## What an update changes and what it keeps

| Changes                                                                   | Stays as it is                                                                   |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| The files from the deploy repository in `~/ein` (installer only)          | `.env`: your options, settings and passwords                                     |
| The sources in `~/ein/src`, each moved to its newest commit               | The database, the `ein_db` volume                                                |
| The images, built again; the engine reuses the layers that did not change | The data folder: your originals, renditions and the model file                   |
| Every container, made again from the new images                           | The installed modules, in the data folder's `modules` folder                     |
| `compose.override.yaml`, written again from `.env`                        | Settings changed in the web interface or the terminal, which are in the database |
| The container logs, which go with the old containers                      | The SSH host key, kept in the tree                                               |

`setup.sh` starts the containers with `--force-recreate`, so each is made from the new image even
where compose sees no change, and with `--remove-orphans`, so a service whose option you turned off
stops.

### What happens when the new EiN starts

EiN does the rest of an update itself, at its start:

- It brings its database tables up to date. There is no separate migration step to run.
- It installs a module that `EIN_MODULES` names and that is missing. It does not update modules that
  are installed already.
- It sets up every module again, in dependency order, and builds a module's pages again when what
  they are built from has changed.

A module written for another version of the module API than the new EiN provides does not set up,
and its pages and commands are missing until it is updated. [When a module does not work](modules.md#when-a-module-does-not-work) lists the messages.

## See which version runs

In the web interface, open the profile menu at the top right and choose **About EiN**. The **Core**
tile shows core's version, and below it the commit EiN was built from and that commit's date; hold
the pointer over it for the full time. The **Module API** tile shows the version modules build on,
and **Services** shows the media service's version and commit when it is installed.

In the terminal, `system-info` prints the same, with each module's commit:

```bash
# in EiN's terminal
system-info
```

```text
host      4e1d7c9b2a60
uptime    4m
core      0.1.0 (3f2a9c1, 2026-10-24)
api       0.2.1
modules   archive 5d81b2e04, assistant 1c9e7a352, ems 77f0ad913, importer e2b4c6801
postgres  18.1
deno      2.9.6
```

Core's version stays `0.1.0` from one update to the next; the commit is what tells two builds apart.
A short `uptime` confirms that EiN restarted. `host` is the name of EiN's container, which compose makes up, not the machine's name. The [reference](../reference/commands-core.md#system-info)
has the command.

## Check that all is well after an update

1. In `~/ein`, `podman compose ps` shows every container up, and `db` and `ems` healthy.
2. In EiN's terminal, `health` says whether the system is healthy or catching up;
   [Health and the dashboard](monitoring.md) explains its checks.
3. Open **Settings → Modules** and look for a module with a badge instead of its version, and for
   **Update available** under **Published modules**. Update the modules there; see
   [Modules](modules.md#update-a-module).

## Free the space old images take

Building new images leaves the old ones behind, without a name. Once the new EiN runs, remove them:

```bash
# on the machine EiN runs on
podman image prune
```

With Docker, `docker image prune`. It removes only images no container uses and that have no name,
so your running EiN, the database and the data folder are not touched.

## When an update goes differently

The commands are written for podman; with Docker, write `docker compose` for `podman compose`.

| What you see                                                                                            | What to do                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The installer reports a check as missing and stops                                                      | Nothing was changed. Fix what it names, or update with `setup.sh` alone, which does not check.                                                                                                                             |
| `git pull` stops with a message about local changes                                                     | A file from the deploy repository in `~/ein` was changed. `git -C ~/ein status` shows which; put back the original with `git -C ~/ein checkout -- <file>` and move your change into `.env`.                                |
| `fatal: Not possible to fast-forward, aborting.`, or a message about local changes, after a source line | A repository under `~/ein/src` was changed or moved to another commit by hand. `git -C ~/ein/src/<name> status` shows what; `git -C ~/ein/src/<name> checkout -- .` and `git -C ~/ein/src/<name> switch main` put it back. |
| The build stops with no space left on the device                                                        | The container engine's storage is full. Free the space old images take (above), or see `podman system df`.                                                                                                                 |
| `setup.sh: EiN did not answer at http://127.0.0.1:8080/ in 10 minutes: podman compose logs ein`         | Read the log it names. `podman compose ps` shows whether `db` became healthy; EiN does not start before it. [Troubleshooting](troubleshooting.md) covers what the log may say.                                             |
| EiN starts with a new admin password and none of your albums                                            | It runs on an empty database: most likely the update ran under the other container engine. See [Keep to one engine](install.md#keep-to-one-engine).                                                                        |
| A module is still the old version                                                                       | `setup.sh` does not update modules. Use **Update** on **Settings → Modules**.                                                                                                                                              |
| A module's pages or commands are gone, and **Settings → Modules** shows a badge on it                   | It does not fit the new EiN. Update it; [When a module does not work](modules.md#when-a-module-does-not-work) explains each message.                                                                                       |
| The media service's tile in **About EiN** says **Not answering**                                        | The media service is still starting or failed to. `podman compose logs ems`; [The media service](media-service.md) helps further.                                                                                          |

If an update leaves EiN in a state you cannot fix, the way back is the backup you made before it:
restore it as [Your data](data.md) describes.

## Related pages

- [Installing in detail](install.md): the installer, `setup.sh`, the files in `~/ein` and running
  compose day to day.
- [Modules](modules.md): updating, pinning and removing modules.
- [Your data](data.md): what to back up before an update, and how to restore it.
- [Services and logs](services-logs.md) and [Troubleshooting](troubleshooting.md): when something is
  wrong after an update.
