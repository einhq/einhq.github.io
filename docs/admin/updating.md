# Updating

This page is for the person who runs EiN on their own machine. It covers how to bring EiN and its
services up to date, what an update touches and what it keeps, how to see which version runs, and
what to do when an update goes differently.

## How updates work

Core, its database, the deploy repository with the supervisor, and the language model have versions,
as modules do. Each morning what changed in them is released (a fix as the next patch, a new feature
or a breaking change as the next minor while they are below 1.0.0), and GitHub builds their images
from it. The images carry the version as a tag beside `:main`: `ghcr.io/einhq/core:0.1.0`, and
`ghcr.io/einhq/core:0.1` for the newest of the 0.1 versions. An update downloads `:main`, the newest
release, and starts it in place of what ran before, so there is no version to choose between, and a
change made today reaches an update tomorrow. The media service is run each night over a set of real
photos, videos, recordings and documents, to see that it answers as it did before (the internal
regression suite); while it changes several times a day, its changes reach GitHub whether or not
that run has passed. The engine downloads only the layers of an image that changed, so an update of
the media service is usually far smaller than its 30 GB. What it updates depends on what is
installed:

| Repository | What it is                                            | Updated when            | As                                        |
| ---------- | ----------------------------------------------------- | ----------------------- | ----------------------------------------- |
| deploy     | `~/ein` itself: `setup.sh` and the compose files      | always, first           | `git pull` of `~/ein`                     |
| core       | EiN: the tree, the shell, the Web UI                  | always                  | the image `ghcr.io/einhq/core:main`       |
| db         | PostgreSQL with TimescaleDB, pgvector and PostGIS     | always                  | the image `ghcr.io/einhq/db:main`         |
| ems        | the media service, which the Archive needs            | with the media service  | the image `ghcr.io/einhq/ems:<line>`      |
| devices    | the Devices module's sidecar                          | with the sidecar        | the image `ghcr.io/einhq/devices:<line>`  |
| llm        | the language model's chat template, for the Assistant | with the language model | its source, fetched into `~/ein/src`      |
| deploy     | the [supervisor](supervisor.md)                       | with the supervisor     | the image `ghcr.io/einhq/supervisor:main` |

GitHub builds the database's image again every week too, so an update also brings PostgreSQL's and
its extensions' minor releases. Installed from another organisation with `--source`, an update
fetches the sources of core, db and ems into `~/ein/src` instead and builds the images on your
machine, the media service's in about an hour ([Where the sources come from](install.md#where-the-sources-come-from)).

The language model's server is not built: it is llama.cpp's ready-made image, named by a fixed
digest in `compose.llm.yaml`. It changes only when that file does, which is when the deploy
repository is updated.

With the [supervisor](supervisor.md), which an installation from GitHub has, you need not run
anything: it updates every service each night at 04:00 (`EIN_UPDATE_AT` in `~/ein/.env`), and
**Update** and **Update all** on **Settings → Modules** update them at once. Its update leaves a
service that runs its newest image as it is, and puts one whose new image does not come up back on
the one it ran. The rest of this page holds for it too: each of its updates is a run of `setup.sh`.

Modules are not part of this. They live in the data folder and are updated separately, on
**Settings → Modules**; see [Update a module](modules.md#update-a-module). Only a module the new
EiN cannot run is replaced, at its start ([below](#what-happens-when-the-new-ein-starts)).

### The media service and the sidecar follow their modules

The media service and the Devices module's sidecar each have a version of what they offer EiN,
and the modules that talk to them, `ems` and `devices`, say in their manifest which versions
they speak, as in `"services": { "ems": "^0.4.4" }`. An update downloads each at the line its
module asks for: `ghcr.io/einhq/ems:0.4` is the newest media service of the 0.4 versions, which
the `ems` module asking for `^0.4.4` speaks. `.env` keeps the line it runs as `EIN_EMS_TAG` and
`EIN_DEVICES_TAG`; before any module asks, it is `main`.

So after you update a module on **Settings → Modules** to a release that needs a newer media
service, the **Status** page says so, as `ems api`: `EMS speaks API 0.4.4, older than the ^0.5.0
this module needs: update the media service`. Run `~/ein/setup.sh --only ems` (or `--only
devices` for `devices sidecar`), and it downloads the line the module asks for and restarts
the service alone. With the [supervisor](supervisor.md) there is nothing to run: it does the same
within a minute of the module's update. A line not published yet, as for a few hours after a module's release, leaves
the service as it is, and says `The modules here ask for ems 0.5, which is not published yet: it
stays at 0.4`. Installed from another source, the service is built from its newest source, and
`setup.sh` only says when that is not the line the modules ask for.

## Before you update

1. Back up. An update cannot be undone: there is no command to go back to the previous version,
   and the database is changed in place when the new EiN starts. [Your data](data.md) says what to
   copy and why the database and the data folder go together.
2. Make sure the admin password is one you know. A first one `setup.sh` made is
   `INITIAL_ADMIN_PASSWORD` in `~/ein/.env` until you delete that line; one you chose at the
   install is not kept there. An older `.env` has no such line, and the random password a new EiN
   printed to its log goes when an update makes the containers again.
3. Check that the container engine has room. An update downloads the new images while the old ones
   are still there, and removes the old ones only once EiN is up again; the media service's image
   is about 30 GB. `podman system df` shows the space images take.

## Update EiN

Run the installer again, as your own user, on the machine EiN runs on:

```bash
# on the machine EiN runs on, as your own user
curl -fsSL https://einhq.eu/install.sh | bash
```

It asks nothing, and you need no options: those you chose before are kept in `~/ein/.env`. If EiN
lives somewhere other than `~/ein`, name that folder with `--home`, as in
`curl -fsSL https://einhq.eu/install.sh | bash -s -- --home /srv/ein`.

What you will see:

1. The installer checks the machine against the system requirements again, with the media service
   and the language model counted when `.env` has them. When a check fails it stops here and
   changes nothing; [Installing in detail](install.md#what-the-checks-measure) explains each
   check.
2. `Updating /home/anna/ein from https://github.com/einhq/deploy`: it runs `git pull --ff-only` on
   the folder, which brings the newest `setup.sh` and compose files.
3. It runs `~/ein/setup.sh`, which prints its steps:

   ```text
   == Getting the images

   == Starting EiN
   Waiting for EiN to answer at http://127.0.0.1:8080/; its first start takes a minute or more

   EiN is up at http://ein:8080/
   Removed the images this update replaced, which freed 31GB
   EiN starts again when the machine does.
   The modules installed:
     archive 0.4.0 (v0.4.0)
     ems 0.1.2 (v0.1.2)
     archive 0.3.1 is installed and needs core API ^0.7.0, and this core provides 0.8.0
   ```

   The list at the end is each module installed, with its version and the release it was
   installed at, followed by what EiN's start logged about a module it could not install or run,
   here the Archive it moved to a release it runs.

   With the language model, or from another source, `== Fetching the sources` comes first, with a
   line for each repository fetched: its name, the commit it is now at and that commit's date. Between the steps the
   container engine prints its own download, build and start output, and while it waits,
   `setup.sh` shows EiN's newest log line every 10 seconds.

The download happens while the old EiN keeps running. A build from another source that fails is
tried once more, since a download it needs, such as the documentation from GitHub, fails now and
then; when it fails again, `setup.sh` stops there and EiN goes on running as it was. EiN is down from the moment its container is made
again until the new one answers, which is usually a minute or two, and longer when modules have to
be set up or their pages built again. `setup.sh` waits up to 10 minutes for EiN to answer on its
port.

### Update with `setup.sh` alone

`~/ein/setup.sh` without the installer downloads and restarts in the same way, and skips the
machine checks. It brings `~/ein` itself up to date first, with `git pull --ff-only`, and when that
brought a new commit, it says `Updated /home/anna/ein to …; running its setup.sh` and goes on with the
new one:

```bash
# on the machine EiN runs on, as your own user
~/ein/setup.sh
```

`./setup.sh --only core` updates one service, `core`, `ems`, `db`, `llm`, `devices` or
`supervisor`, and restarts only that one, leaving the others running; `--only core,db` updates
several, one after another. A service whose new image does not come up, EiN that does not answer
within 10 minutes or a service that stops, is put back on the image it ran before, and `setup.sh`
stops with `setup.sh: core did not come up on its new image, and runs on the one it ran before`
under the service's last log lines.

Every run of `setup.sh` is an update, also one that only adds or removes an option, such as
`./setup.sh --ems`. To apply a changed line of `.env` without updating, run `podman compose up -d`
in `~/ein` instead; [Configuration](configuration.md#set-a-value-in-the-deployment) explains it.

One `setup.sh` runs in `~/ein` at a time. A run goes on when the SSH connection that started it
drops, so one started again meanwhile says
`Another setup.sh is running in /home/anna/ein; waiting for it to end` and begins once the first
has ended.

> [!NOTE]
> `setup.sh` keeps to the container engine EiN was installed under, which `.env` names in
> `EIN_ENGINE`. Run with `--engine` naming the other one, it stops instead of building a second,
> empty EiN. See
> [Keep to one engine](install.md#keep-to-one-engine).

## What an update changes and what it keeps

| Changes                                                                                                        | Stays as it is                                                                               |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| The files from the deploy repository in `~/ein`                                                                | `.env`: your options, settings and passwords                                                 |
| The sources in `~/ein/src`, each moved to its newest commit                                                    | The database, in the folder `EIN_DB_DIR` names                                               |
| The images, downloaded or built again, and the ones they replaced removed; the layers that did not change stay | The data folder: your originals, renditions and the model file                               |
| Every container, made again from the new images                                                                | The installed modules, in the data folder's `modules` folder, but one the new EiN cannot run |
| `compose.override.yaml`, written again from `.env`                                                             | Settings changed in the Web UI or the terminal, which are in the database                    |
| The container logs, which go with the old containers                                                           | The SSH host key, kept in the tree                                                           |

`setup.sh` makes every container again from the new image even where compose sees no change, with
`--force-recreate` (under podman-compose, it takes them all down and starts them one by one), and
with `--remove-orphans`, so a service whose option you turned off stops.

### What happens when the new EiN starts

EiN does the rest of an update itself, at its start:

- It brings its database tables up to date. There is no separate migration step to run.
- It installs a module that `EIN_MODULES` names and that is missing. It does not update modules that
  are installed already and that it can run.
- It replaces a module installed at a release written for a module API it does not provide, as
  after an update that changed that API, with the newest release of the module's repository that it
  can run, and the modules that one needs the same way. That release can be older than the newest
  published, when the module has moved on to a newer EiN.
- It sets up every module again, in dependency order, and builds a module's pages again when what
  they are built from has changed.

A module with no release the new EiN can run stays as it was and does not set up, and its pages and
commands are missing until a release that fits is published and installed. `setup.sh` ends with the
lines EiN logged about it; [When a module does not work](modules.md#when-a-module-does-not-work)
lists the messages.

## See which version runs

In the Web UI, open the profile menu at the top right and choose **About EiN**. The **Core**
tile shows core's version, and below it the commit EiN was built from and that commit's date; hold
the pointer over it for the full time. The **Module API** tile shows the version modules build on,
and **Services** shows what installed modules add, such as the media service's version and commit with the `ems` module and the media service installed.

In the terminal, `system-info` prints the same, with each module's commit, here on an EiN with every module installed:

```bash
# in EiN's terminal
system-info
```

```text
host      4e1d7c9b2a60
uptime    4m
core      0.1.0 (3f2a9c1, 2026-10-24)
api       0.7.0
modules   archive 5d81b2e04, assistant 1c9e7a352, ems 77f0ad913
postgres  18.1
deno      2.9.6
```

Core's version stays `0.1.0` from one update to the next; the commit is what tells two builds apart.
A short `uptime` confirms that EiN restarted. `host` is the name of EiN's container, which compose makes up, not the machine's name. The [reference](../reference/commands-core.md#system-info)
has the command.

## Check that all is well after an update

1. In `~/ein`, `podman compose ps` shows every container up, and `db`, and `ems` when it is installed, healthy.
2. In EiN's terminal, `health` says whether the system is healthy or catching up;
   [Health and status](monitoring.md) explains its checks.
3. Open **Settings → Modules** and look for a module with a badge instead of its version, then
   choose **Install** beside the filter and look under **Updates**. Update the modules there; see
   [Modules](modules.md#update-a-module).

## Free the space old images take

`setup.sh` removes the images an update replaced, EiN's, the database's and the media service's,
once the new EiN answers, and says so: `Removed the images this update replaced, which freed 31GB`.
It keeps one that a container still uses, and an update whose EiN did not come up keeps them all.
`--only` does the same for the one service it updates.

A build from another source can leave other images without a name behind, such as its intermediate stages. Remove
those with:

```bash
# on the machine EiN runs on
podman image prune
```

With Docker, `docker image prune`. It removes only images no container uses and that have no name,
so your running EiN, the database and the data folder are not touched.

## When an update goes differently

The commands are written for podman; with Docker, write `docker compose` for `podman compose`.

| What you see                                                                                                    | What to do                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The installer reports a check as missing and stops                                                              | Nothing was changed. Fix what it names, or update with `setup.sh` alone, which does not check.                                                                                                                             |
| `git pull` stops with a message about local changes, or `setup.sh` says `~/ein` could not be brought up to date | A file from the deploy repository in `~/ein` was changed. `git -C ~/ein status` shows which; put back the original with `git -C ~/ein checkout -- <file>` and move your change into `.env`.                                |
| `fatal: Not possible to fast-forward, aborting.`, or a message about local changes, after a source line         | A repository under `~/ein/src` was changed or moved to another commit by hand. `git -C ~/ein/src/<name> status` shows what; `git -C ~/ein/src/<name> checkout -- .` and `git -C ~/ein/src/<name> switch main` put it back. |
| The download or the build stops with no space left on the device                                                | The container engine's storage is full. Free the space old images take (above), or see `podman system df`.                                                                                                                 |
| `setup.sh: the images did not build, so EiN runs on as it was; the build's output is above`                     | Nothing was changed. When the build's output shows a download that failed, run `setup.sh` again later; otherwise the output names what stopped the build.                                                                  |
| `setup.sh: EiN did not answer at http://127.0.0.1:8080/ in 10 minutes: podman compose logs core`                | Read the log it names. `podman compose ps` shows whether `db` became healthy; EiN does not start before it. [Troubleshooting](troubleshooting.md) covers what the log may say.                                             |
| EiN does not take your admin password and has none of your content                                              | It runs on an empty database, such as one under the other container engine. See [Keep to one engine](install.md#keep-to-one-engine).                                                                                       |
| `setup.sh: core did not come up on its new image, and runs on the one it ran before`                            | EiN runs as it did before the update. The log lines above the message say why the new image did not start; [Troubleshooting](troubleshooting.md) covers what they may say. A later update tries the newest image again.    |
| A module is still the old version                                                                               | `setup.sh` does not update modules, and EiN's start replaces only one it cannot run. Use **Update** on **Settings → Modules**.                                                                                             |
| A module's pages or commands are gone, and **Settings → Modules** shows a badge on it                           | It does not fit the new EiN, and EiN found no release of it that does. The lines at the end of `setup.sh`'s output say why; [When a module does not work](modules.md#when-a-module-does-not-work) explains each message.   |
| With the `ems` module, the media service's tile in **About EiN** says **Not answering**                         | The media service is still starting or failed to. `podman compose logs ems`; [The media service](../ems/index.md) helps further.                                                                                           |

If an update leaves EiN in a state you cannot fix, the way back is the backup you made before it:
restore it as [Your data](data.md) describes.

## Related pages

- [Installing in detail](install.md): the installer, `setup.sh`, the files in `~/ein` and running
  compose day to day.
- [Modules](modules.md): updating, pinning and removing modules.
- [The supervisor](supervisor.md): the services installed and updated from EiN.
- [Your data](data.md): what to back up before an update, and how to restore it.
- [Services and logs](services-logs.md) and [Troubleshooting](troubleshooting.md): when something is
  wrong after an update.
