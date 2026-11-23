# The supervisor

This page is for the person who runs EiN on their own machine. It covers the supervisor: the small
container beside EiN that installs the media service, the language model and the Devices
module's sidecar when you ask for them in EiN, and keeps every service up to date, so that after the
install you need no shell on the machine for either.

## What it is

The services beside EiN — the media service, the language model, the sidecar, and EiN and its
database themselves — are containers, which only the container engine can start, stop and update.
The supervisor is the one container that may talk to the engine. EiN never can: the engine's socket
is root on the machine under Docker, and the whole account under rootless podman, while EiN faces
the network and runs the code of the modules you install. So EiN asks the supervisor, and the
supervisor does only what it knows:

- **install** the media service (`ems`), the language model (`llm`) or the sidecar (`devices`);
- **update** any of `core`, `db`, `ems`, `llm`, `devices` and itself (`supervisor`);
- **report** each one's state, the image it runs and the version of what it offers EiN.

It never takes an image name, a mount or a capability from EiN: what each service is and what it is
given is defined in `~/ein`, as for an install with `setup.sh`. EiN reaches it on the compose
network with a key of its own, `SUPERVISOR_KEY` in `~/ein/.env`, which `setup.sh` makes.

Each install or update the supervisor runs is `~/ein/setup.sh` with the options you would have given
it, in a container of the supervisor's own image, beside the supervisor: a **job**. A job goes on
while EiN and the supervisor itself are made again, and its output is kept in
`supervisor/job.log` in the data folder.

## Where it runs

The supervisor comes with an installation from GitHub, whose images it downloads from
`ghcr.io/einhq`; it builds nothing. A new install has it, and an install from before it gets it
with `--supervisor`:

```bash
# on the machine EiN runs on, as your own user
~/ein/setup.sh --supervisor
```

`--no-supervisor` leaves it out again, and `.env` keeps the choice as `EIN_SUPERVISOR`. Without it,
nothing changes from an install without one: `setup.sh` installs and updates the services, and
**Settings → Modules** says what a module needs instead of offering to install it.

There is no supervisor in an installation from another source (`--source`), whose images are built
on the machine from the sources ([Where the sources come from](install.md#where-the-sources-come-from)),
nor in a development checkout run with `deno task dev`.

With the supervisor, every run of `setup.sh` runs in the supervisor's image too, whoever starts
it: the installer, you on the machine, or the supervisor. The compose that runs the services is then
the one in that image, so the machine needs the container engine alone. Under podman, `setup.sh`
turns on podman's socket for it (`systemctl --user enable --now podman.socket`) whenever the socket
does not answer, as when a stopped service left its file behind.

## The services on Settings → Modules

On **Settings → Modules**, the button with the server beside **Install** opens **Services beside
EiN**, for the administrator. It lists each service with its state, the release it runs and when
that image was built, and which installed modules ask for it and which versions they take.
**Install** installs a service that is not installed. As for a module, a service with a newer
release has **Update to** that version beside it, `Update to 0.4.9`, and **Update all** at the top
updates every one that has; a service that runs its newest release has no button, and the foot of
the list says when the releases were last checked.

A module's panel shows the services it talks to under **Services beside EiN** on its **Overview**,
each with the versions it takes and whether it is installed, with **Install** beside one that is
not. When an installed module talks to a service that is not installed, the top of the tab says so,
as **The media service is not installed**, with **Install** beside it: install the Archive, and the
media service it needs is one choice away.

Installing a service asks first, saying what it downloads and what it is given beyond an ordinary
container, such as:

| Service             | It is given                                                                                                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| the media service   | the graphics card, when the machine has one; `/dev/fuse` and the `SYS_ADMIN` capability without an AppArmor profile, to mount the files of each request from EiN, and no other capability but those it needs to start as root and run on as a user of its own; up to 16 GB of memory |
| the language model  | the graphics card, when the machine has one; up to 10 GB of memory                                                                                                                                                                                                                   |
| the devices sidecar | the machine's own network, which it listens on for devices, and the ports 1883 and 1984 for the devices' MQTT broker and the cameras' streams                                                                                                                                        |

While a job runs, the top of the tab says what it does, who asked and its last line; when it ends,
whether it did, with its last lines when it failed. Installing a service makes every container
again, as `setup.sh --ems` does, so EiN is away for a minute or two, and the page comes back with
it. An update of EiN does the same; an update of another service leaves EiN running.

## Updates

The supervisor updates the services by itself in two ways:

Once an hour it reads which releases GitHub has of each service, and a service with a newer
release than the one it runs has an update: the newest release of the line its modules ask for for
the media service and the sidecar, the newest of all for EiN and the database, and deploy's newest
release for the supervisor. The language model has one when `compose.llm.yaml` names another image
than it runs, as after an update of deploy. It updates them by itself in two ways:

- **With their modules.** When an installed module asks for another line of the media service or
  the sidecar than the one that runs, as after you update the `ems` module to a release that needs
  a newer media service, the supervisor installs the newest release of that line within a minute
  and makes the service again ([The media service and the sidecar follow their modules](updating.md#the-media-service-and-the-sidecar-follow-their-modules)).
  A line not published yet waits until it is; a release that did not come up is tried again a day
  later.
- **Each night**, at `EIN_UPDATE_AT` in `~/ein/.env`, 04:00 by default in the machine's time zone,
  it updates every service that has an update. `off` turns this off; the services are then updated
  when you ask.

An update leaves a service that already runs its newest release as it is. A service whose new
release does not come up — EiN does not answer within 10 minutes, the database, the media service
or the language model does not report itself healthy, or another service stops or restarts again
and again — is put back on the release it ran before, and the job fails with the service's last
log lines and `setup.sh: core did not come up on its new image, and runs on the one it ran before`.
The next night's update tries the newest release again.

Modules are not part of this: they are updated on **Settings → Modules**, as [Modules](modules.md#update-a-module)
describes.

## From EiN's terminal

The same, as the administrator:

```bash
# in EiN's terminal, as the administrator
supervisor status            # each service, the newer release it has, and the job that runs or ran last
supervisor install ems       # install the media service; llm and devices the same way
supervisor update            # update every service that has a newer release now
supervisor update core db    # update these
```

```text
db          running, healthy · ghcr.io/einhq/db:0.1.0
core        running · ghcr.io/einhq/core:0.1.1 · update to 0.1.2
ems         not installed · asked for by ems ^0.4.4
devices     running · ghcr.io/einhq/devices:0.1.1 · asked for by devices ^0.1.0
llm         not installed
supervisor  running · ghcr.io/einhq/supervisor:0.1.2
Every service with an update is updated each night at 04:00.
Last: setup.sh --only core, asked by the supervisor: the nightly update at 2026-11-16T04:00:12+0100: done
```

In an installation without a supervisor, `supervisor status` says so. The
[reference](../reference/commands-core.md) has the commands.

## When something goes differently

| What you see                                                                  | What to do                                                                                                                                                |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `The supervisor's image, ghcr.io/einhq/supervisor:0.1.2, could not be pulled` | `setup.sh` goes on without it and sets `EIN_SUPERVISOR=0`. Check the machine reaches `ghcr.io`, and run `~/ein/setup.sh --supervisor` again.              |
| `The supervisor needs podman's socket, which does not answer at …`            | Turn it on with `systemctl --user enable --now podman.socket`, then `~/ein/setup.sh --supervisor`.                                                        |
| **The supervisor does not answer** on **Services beside EiN**                 | On the machine, `podman compose ps supervisor` and `podman compose logs supervisor` in `~/ein`. `~/ein/setup.sh --only supervisor` makes it again.        |
| `an install or update is running`                                             | One job runs at a time, and a `setup.sh` run on the machine counts as one. Wait for it to end.                                                            |
| A job failed                                                                  | Its last lines are on the tab; the whole output is `supervisor/job.log` in the data folder. A failed update has put the service back on the image it ran. |

With Docker, write `docker compose` for `podman compose`.

## Related pages

- [Installing in detail](install.md): the options of `setup.sh`, among them `--supervisor` and `--no-supervisor`.
- [Updating](updating.md): what an update downloads, changes and keeps.
- [Modules](modules.md): installing and updating modules, and the services they need.
