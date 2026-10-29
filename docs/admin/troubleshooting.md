# Troubleshooting

This page is for whoever runs EiN, when something does not work after the install: EiN does not start or answer, nobody can sign in, work stops getting done, pictures get no thumbnails, or the assistant stays silent. Each section says what you see, how to find the cause and what to do, and links the page that covers the topic in full. For problems during the first install, see [Install EiN](../start/install.md#when-something-goes-differently).

The commands on the machine are written for podman and run in `~/ein`, where the installer put EiN. With Docker, write `docker compose` where they say `podman compose`.

## Where to look first

Three places tell you most of what is wrong. Look at them in this order.

1. **The containers.** On the machine EiN runs on, see whether every container is up and whether the database and the media service are healthy:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose ps
   podman compose logs --tail 100 ein     # the end of EiN's log; db, ems or llm for the others
   ```

   A container that shows `Up` for only a few seconds, again and again, stops and is started again by its restart policy. Its log says why.

2. **The dashboard.** When the web interface opens, sign in as an administrator and choose **Dashboard** under **System** in the sidebar. The badge above **System dashboard** gives the verdict: **Healthy**, **Catching up**, **Stuck** or **Needs a person**. Below it, the **Overview** tab lists each check that is not fine, with its reason. The **Services** tab shows each of EiN's own services, and the **Log** tab its **Recent problems** and the live log. [Health and the dashboard](monitoring.md) explains every tile.

   ![The System dashboard with a green Healthy badge above its title, the tabs Overview, Work, Media service, Services and Log, and tiles for CPU, memory, GPU and VRAM above a chart of completed work](../../assets/shots/dashboard.webp "The badge in the header is the verdict of the health checks; anything other than Healthy is listed on the Overview tab with its reason.")

3. **`health` in EiN's terminal.** The same verdict and every check, fine or not, in text:

   ```bash
   # in EiN's terminal, as an administrator
   health
   ```

   ```text
   needs a person: 1 check failed
   fail  failed work  2 instances failed again after three more runs and need a person (pipeline-instances --status failed)
   warn  ems          http://ems:8181 is not answering; work that needs it waits
   ```

   The first line is the verdict; each line after it is a check, failures first. A check names the command that shows more.

| Verdict          | What it means                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| `healthy`        | Nothing is waiting and no check failed.                                                                             |
| `catching up`    | Work is waiting and getting done. The line says how many jobs wait and, when it can, when the slowest kind is done. |
| `stuck`          | Work is waiting and none was done in the last hour. See [Work does not get done](#work-does-not-get-done).          |
| `needs a person` | At least one check failed. Its line says what failed and which command to run.                                      |

Inside EiN, the system log is `/var/logs/system`, which `dmesg` prints; it starts empty at each start of EiN. Each service writes its own log to `/var/logs/services/<name>/stdout.log` and `stderr.log`, which start empty each time the service starts:

```bash
# in EiN's terminal, as an administrator
dmesg -n 50 --level=warn                       # the last 50 warnings and errors
tail /var/logs/services/ems-link/stdout.log    # one service's log
```

[Services and logs](services-logs.md) covers both kinds of log and the services that write them.

## EiN does not start or does not answer

EiN answers on port 8080 only once its database is up and its start is through: it installs the modules `EIN_MODULES` names that are missing, sets every module up, and only then starts its services, the web interface and SSH among them. While it does, the browser cannot connect. A start that installs modules over a slow connection takes minutes.

| What you see                                                                                    | What to do                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `podman compose ps` shows `ein` as `Created` or not at all, and `db` as starting or unhealthy   | EiN waits for the database to answer a query. Read `podman compose logs db`. A first start of the database restarts it once, which takes a little while.                                                                                                                                                     |
| EiN's log stops after `Connecting to database...`, and the container starts over                | EiN could not reach the database; it waits up to 60 seconds for a connection. Check that `db` is up and healthy, and read its log.                                                                                                                                                                           |
| `password authentication failed for user "ein"` in EiN's log                                    | `POSTGRES_PASSWORD` in `~/ein/.env` is not the password the database was made with, usually because `.env` was deleted and `setup.sh` wrote a new one. Put back the `.env` from your backup; the database keeps the password it was made with. [Your data](data.md) says why `.env` belongs in every backup. |
| The log shows the modules being installed, and nothing answers yet                              | EiN is downloading modules. Wait, and follow it with `podman compose logs -f ein`.                                                                                                                                                                                                                           |
| `some of INSTALL_MODULES could not be installed; continuing boot` in the log                    | EiN could not download a module, often for want of a connection to GitHub. EiN starts without it; install it from **Settings → Modules** once EiN is up.                                                                                                                                                     |
| `module setup completed with failures; continuing boot` in the log                              | A module's setup failed and the others carried on. See [When a module does not work](modules.md#when-a-module-does-not-work).                                                                                                                                                                                |
| `setup.sh: EiN did not answer at http://127.0.0.1:8080/ in 10 minutes: podman compose logs ein` | Read the log it names, then go through the lines above. When `EIN_BIND` is an address other than `0.0.0.0` or `127.0.0.1`, EiN is running and `setup.sh` only looked in the wrong place: see [Ports, HTTPS and remote access](network.md).                                                                   |
| A port is already in use when the containers start                                              | Another program, or an EiN under the other container engine, has port 8080 or 2222. See [Keep to one engine](install.md#keep-to-one-engine), or choose other ports in `.env`.                                                                                                                                |
| After an update, an empty EiN where your admin password does not work                           | The update ran under the other container engine, with an empty database of its own. See [Keep to one engine](install.md#keep-to-one-engine).                                                                                                                                                                 |
| EiN is not running after the machine restarted                                                  | Under podman, `podman-restart.service` starts it at boot, and under rootless podman only for a user who lingers. Start it with `podman compose up -d`, and see [Start EiN when the machine boots](install.md#start-ein-when-the-machine-boots).                                                              |
| EiN answers on the machine itself, but not from another computer                                | Open ports 8080 and 2222 in the machine's firewall, and try the machine's IP address instead of a name ending in `.local`. See [Open the ports in the firewall](network.md#open-the-ports-in-the-firewall).                                                                                                  |
| The web interface or SSH stopped answering after a change to **HTTP port** or **SSH port**      | Reset the setting through whichever still answers, with `config unset CFG_HTTP_PORT` or `config unset CFG_SSH_PORT`, then `podman compose restart ein`. Ports are changed in `.env`; see [Ports, HTTPS and remote access](network.md).                                                                       |
| `unresolvable CDI devices nvidia.com/gpu=all` when the containers start                         | The container engine cannot hand the graphics card over. See [The graphics card](../ems/gpu.md).                                                                                                                                                                                                             |

A container that keeps starting over without a clear message in its log may be running out of memory: each has a limit, 6 GB for EiN unless `EIN_MEMORY` in `.env` sets another. The machine's kernel log records a container stopped for that reason (`journalctl -k | grep -i oom` on most systems). [Performance and sizing](performance.md) says how to raise the limits.

## You cannot sign in

| What you see                                                     | What to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup.sh` showed no admin password at the end                   | `setup.sh` shows `INITIAL_ADMIN_PASSWORD` from `~/ein/.env`, and the line is gone: you deleted it, or `.env` was written before `setup.sh` kept the password there. Then a new EiN made a random one and wrote it to its log once, as `Admin password set to:`; find it with `podman compose logs ein \| grep 'Admin password set to'`. The log is gone once the containers have been made again, by an update or by `podman compose down`, and an EiN whose database was there before keeps the password it had.            |
| The `admin` password is lost                                     | Once changed, nothing keeps it; the `INITIAL_ADMIN_PASSWORD` line in `.env` holds only the first one, which works only until it is changed. A member of the group `sudo` signs in, chooses **Administer…** in the account menu, and sets a new one on the **Users** tab of **Settings**, under **Password**, or types `admin` and then `user-passwd admin` in the terminal. EiN has no way to reset it from the machine, so [let a second person administer](accounts.md#let-a-second-person-administer) before you need it. |
| Someone's sign-in fails with the right password                  | Their account may be disabled, or have no password yet (**Needs a password**). See [Accounts and groups](accounts.md).                                                                                                                                                                                                                                                                                                                                                                                                       |
| "too many failed sign-ins; try again in" and a number of seconds | Wait that long. When it happens to everyone behind your HTTPS proxy at once, EiN sees all of them as one address: see [How EiN slows down password guessing](network.md#how-ein-slows-down-password-guessing).                                                                                                                                                                                                                                                                                                               |
| Signing in works, but the next page asks you to sign in again    | The browser uses `http://` while the proxy says `https`, so the browser does not send the cookie back. Open the `https://` address. See [Ports, HTTPS and remote access](network.md).                                                                                                                                                                                                                                                                                                                                        |
| SSH warns that the host key has changed                          | The key is kept in EiN's database and stays across updates; it changes only when EiN was installed afresh. Remove the old key from your `~/.ssh/known_hosts` once you know that is what happened. See [SSH and SFTP](../shell/ssh-sftp.md).                                                                                                                                                                                                                                                                                  |

## The web interface misbehaves

| What you see                                                            | What to do                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The page frame loads but stays empty, and the terminal does not connect | The interface talks to EiN over a WebSocket, which something in between does not pass, usually an HTTPS proxy. See [What EiN needs from the proxy](network.md#what-ein-needs-from-the-proxy).                                                   |
| The dashboard shows an **offline** badge                                | The page lost its connection to EiN and is reconnecting; the figures are from the last update. It reconnects by itself once EiN answers. When it does not, see [EiN does not start or does not answer](#ein-does-not-start-or-does-not-answer). |
| **Dashboard** and **Nodes** are missing from the sidebar                | They are for administrators. A member of `sudo` chooses **Administer…** in the account menu first.                                                                                                                                              |
| A module's pages do not appear after it was installed                   | Reload the page. When they still do not appear, look for `mod: ui-build failed:` in the output of the install, and see [Modules](modules.md).                                                                                                   |
| Large uploads fail behind a proxy, often with 413                       | The proxy limits the size of a request. See [Ports, HTTPS and remote access](network.md).                                                                                                                                                       |

## Work does not get done

Everything EiN does after a file arrives, from thumbnails to faces to transcriptions, is pipeline work, done in the background. [Processing and pipelines](processing.md) explains how it is run; this section is about finding why it stopped.

Start with `health`, or the **Overview** and **Work** tabs of the dashboard. Each check that is not fine points at one of the cases below.

### Failed work

A failed run is run again by itself, after 1 hour, 6 hours and 24 hours. The `pipeline-pruner` service does this, so nothing needs doing while `health` says:

```text
warn  failed work  3 failed instances, run again on their own after 1 h, 6 h and 24 h
```

When a run has failed again after those three, it is left for a person, and the check fails:

```text
fail  failed work  2 instances failed again after three more runs and need a person (pipeline-instances --status failed)
```

1. List the failed instances, and look at one:

   ```bash
   # in EiN's terminal, as an administrator
   pipeline-instances --status failed
   pipeline-status <id>
   ```

   `pipeline-status` shows each step of the instance and the error of the one that failed.

2. Fix the cause the error names: a media service that was down, a full disk, a module that needed an update.

3. Run the work again. One instance at a time, from the pipeline's current definition:

   ```bash
   # in EiN's terminal, as an administrator
   pipeline-rerun <id>
   ```

   Or every failed instance the automatic reruns would still take, at once rather than after its wait:

   ```bash
   # in EiN's terminal, as an administrator
   pipeline-heal --now          # shows what it would do
   pipeline-heal --now --apply  # does it
   ```

A step that failed on its input, such as a file no program can open, is not run again, since every run would meet the same bytes. `health` counts those as `input`, and they need nothing from you.

When the media service is updated, the `ems-link` service runs the failed instances again at once (`pipeline heal --now --apply`), all but those that failed on their input or were left for a person, since a new build is the likeliest fix.

### Waiting work that does not drain

| What `health` says                                                                              | What it means and what to do                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stuck: … jobs waiting, none done in the last hour`                                             | Work waits and nothing takes it. The checks below the verdict say which kind; look there.                                                                                                                                                   |
| `… waiting for EMS, which could not run it yet; next try in …`                                  | The media service is busy or could not load what the work needs. EiN tries again at the time it names. When it keeps saying so, see [Thumbnails, faces and text are missing](#thumbnails-faces-and-text-are-missing).                       |
| `… waiting, and no worker offers this kind`                                                     | No running service takes this kind of work. The dashboard shows it in red as **Work that nothing will run**, with the pipelines that queue it. Usually a module's service has stopped: see [A service has stopped](#a-service-has-stopped). |
| **Work that nothing will run** says no defined pipeline queues this kind any more               | The jobs are left over from a pipeline that was removed. Cancel them with the `pool cancel` command the message shows.                                                                                                                      |
| `… waiting, the oldest for …, none done in the last hour`                                       | A kind of work has stopped draining. Check the service that does it, and the media service when the work needs it.                                                                                                                          |
| `… running steps silent for … or more: …`                                                       | Steps that started but have said nothing for a long time. A long video can take that long. When one is truly stuck, stop its instance with `pipeline-cancel <pipeline>/<id>` and run it afresh with `pipeline-rerun <pipeline>/<id>`.       |
| `… entries dropped after their delivery attempts (queue-dead /var/queues/…: --retry or --drop)` | Events a queue gave up delivering. Look at them with `queue-dead <path>`, then put them back with `queue-dead --retry <path>` once the cause is fixed, or remove them with `queue-dead --drop <path>`.                                      |

`pipeline-overview` and `pool-stat` show the counts behind these checks, and `top` shows them live. `pipeline-repair` finds instances marked finished while steps of theirs still wait, and with `--apply` sets them running again; run it without `--apply` first to see what it would change.

## Thumbnails, faces and text are missing

Thumbnails, video renditions, faces, picture vectors, transcriptions and the text of documents all come from the media service, a container of its own. When it is missing or not answering, the work waits for it and nothing fails.

1. See whether EiN reaches it:

   ```bash
   # in EiN's terminal
   ems-status
   ```

   `ems-status` shows its version, every model and its state, what it is running and what it is degraded in. On the dashboard, the **Media service** tab shows the same.

2. When `health` says `http://ems:8181 is not answering; work that needs it waits`:

   - **It was never installed.** The Archive needs it. Add it with `~/ein/setup.sh --ems`; its image is about 30 GB.
   - **It is starting.** Its health check gives it two minutes to start. `podman compose ps` shows its state.
   - **It stopped.** Read `podman compose logs ems`, and start it again with `podman compose up -d`.

3. Once it answers, the waiting work goes on by itself. Files that never got their renditions can be given them again:

   ```bash
   # in EiN's terminal
   regenerate /archive/albums/cornwall-1968            # what is missing
   regenerate --force /archive/albums/cornwall-1968    # everything again
   ```

Lines beginning `ems-link: down` and `ems-link: up` in the `ems-link` service's log say when the media service went away and came back. A `fail` check named `ems gpu` means the card the media service is meant to have is gone; see [The graphics card](../ems/gpu.md). [The media service](../ems/index.md) covers the rest.

## The assistant does not answer

The chat shows one of three cards when a question gets no answer:

| Card                      | What it means                                                                                                                                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Assistant unavailable** | "The assistant is not available right now." The language model could not be reached within [`CFG_LLM_WAIT`](../reference/settings.md#cfg_llm_wait), 180 seconds unless changed, or the assistant is not set up. |
| **No answer**             | "The assistant could not answer this question." The model ran but gave up on this question. Ask it in other words.                                                                                              |
| **Answer too long**       | "The answer was too long to finish. Ask for less, such as the last 20 rows."                                                                                                                                    |

For **Assistant unavailable**, ask EiN whether it reaches the model:

```bash
# in EiN's terminal
llm-status --checks
```

| What it says                                               | What to do                                                                                                                                                                                                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `… is not answering; the chat cannot answer until it does` | With `--llm`, read `podman compose logs llm`: at its first start it downloads its model, several GB, and answers only after that. Without `--llm` and without a hosted model, there is no model: add one with `~/ein/setup.sh --llm`. |
| `… does not offer …; the chat's questions to it fail`      | The hosted provider has no model by the name in `CFG_LLM_MODEL`. Set a name it offers.                                                                                                                                                |

[The language model](../assistant/language-model.md) covers running the model yourself or using a hosted one.

## A service has stopped

EiN runs its own services inside its container: the web interface, SSH, the pipeline engine, and each module's. A service that stops on its own is started again, but after three restarts within a minute EiN leaves it `failed`.

1. See which services run:

   ```bash
   # in EiN's terminal
   service-list --detail
   ```

2. Read the failed one's log, `/var/logs/services/<name>/stderr.log` and `stdout.log`, to see why it stopped.

3. Start it again, on the dashboard's **Services** tab with its **Start** button, or in the terminal:

   ```bash
   # in EiN's terminal, as an administrator
   service-start archive-bridge
   ```

A service shown as `disabled` has no buttons on the dashboard; enable it first with `service-enable <name>`. Restarting EiN, `podman compose restart ein`, starts every enabled service again. [Services and logs](services-logs.md) lists the services and what each does.

## The disk fills up

Two places fill up, and they may be on different disks:

| Where                                                         | How to see it                                                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| The data folder, `EIN_DATA`: originals, renditions, the model | `df` in EiN's terminal: free space per storage tier, its growth per day, when it fills, and the size of the database |
| The container engine's storage: images, the database volume   | `podman system df` on the machine                                                                                    |

To make room:

- Trashed files are removed for good after [`CFG_TRASH_RETENTION_DAYS`](../reference/settings.md#cfg_trash_retention_days), 30 days unless changed. An administrator can empty it sooner, `trash empty --all --older-than 7` for what everyone trashed over a week ago.
- `setup.sh` removes the images an update replaced once the new EiN answers. Other images without a name, such as a build's intermediate stages, stay in the container engine's storage; `podman image prune` removes them.

[Performance and sizing](performance.md) says how much room EiN needs.

## A change made something worse

| What changed                               | What to do                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A setting on **Settings → System**         | Choose **Restore inherited value** under it, or run `config unset <KEY>` in the terminal. See [Configuration](configuration.md#when-a-change-does-not-take-effect). |
| A line in `~/ein/.env`                     | Undo it and run `podman compose up -d`.                                                                                                                             |
| An update                                  | See [Updating](updating.md).                                                                                                                                        |
| A module was installed, updated or removed | See [When a module does not work](modules.md#when-a-module-does-not-work).                                                                                          |

## Gather what to report

When you ask someone for help, these say what you run and what it is doing:

```bash
# in EiN's terminal, as an administrator
system-info              # host, uptime, core's version and commit, each module's commit, PostgreSQL and Deno
health                   # the verdict and every check
dmesg --level=warn       # warnings and errors since EiN started
```

```bash
# on the machine EiN runs on, in ~/ein
podman compose ps
podman compose logs --tail 200 ein
```

Read the logs before you send them on: they name your accounts, paths and addresses.

## Related pages

- [Health and the dashboard](monitoring.md): every check, tile and gauge.
- [Services and logs](services-logs.md): EiN's services and where each writes.
- [Processing and pipelines](processing.md): how work is queued and run.
- [The media service](../ems/index.md) and [The language model](../assistant/language-model.md): the two optional containers.
- [Installing in detail](install.md): `~/ein`, `.env` and running compose.
- [Ports, HTTPS and remote access](network.md): reaching EiN, proxies and sign-in limits.
- [Modules](modules.md): installing, updating and fixing modules.
- [Commands](../reference/commands.md): every command on this page in full.
