<!-- Written by tools/reference.ts from `docs env` on a running EiN: make reference, never by hand. -->

# Environment variables

The variables EiN reads or sets, apart from its settings (`CFG_…`), which are on [Settings](settings.md). In the shell, `docs env` lists them with their values there.

## Set by the deployment

Read once, from EiN's own environment, when it starts: `.env` in an installation made with the installer. No shell has them, and none is shown back, since `POSTGRES_URL` carries the database's password.

| Variable | Default | What it is |
| --- | --- | --- |
| `POSTGRES_URL` | `postgres://ein:ein@127.0.0.1:5432/ein` | The PostgreSQL database holding the whole tree. |
| `POSTGRES_POOL_MAX` | `20` | Database connections the process may hold at once. Parallel work queues on this long before PostgreSQL itself is the limit. |
| `POSTGRES_POOL_RESERVED` | `4` | Of those, connections background work may never take, so an interactive command never waits behind a crawl. 0 is first come, first served. |
| `POSTGRES_LISTEN_POOL_MAX` | `4` | Connections kept apart for change notifications, which hold theirs for good. |
| `FILE_ROOT_PATH` | `./files` | Host directory where file content is stored. |
| `VOLATILE_FILE_ROOT_PATH` | `FILE_ROOT_PATH` | Host directory for content that can be made again — thumbnails, crops, transcodes — so it can live on a faster or cheaper disk. |
| `FILE_TMP_PATH` | `/tmp` | Host directory for temporary files while content is written. |
| `DOCS_PATH` | `./guide` | Host directory mounted as the guide at /usr/docs/guide: the documentation at einhq.eu, as the image bundles it or a checkout of the site. Without one the Docs page links to einhq.eu. In a shell the same name is the tree path /usr/docs. |
| `DEV_MODULES_PATH` | `./modules` | The deployment's modules: a folder of module checkouts mounted read-only at /tmp/dev-modules and linked into /usr/modules. A name here wins over an installed module of the same name. In a shell the same name is that tree path. |
| `MODULE_INSTALL_PATH` | `./modules-installed` | Host directory `mod install` puts modules in, mounted read-write at /var/lib/modules. A folder of the host mounted into the container keeps the installed modules when the container is replaced. |
| `INSTALL_MODULES` |  | Modules boot installs with `mod install` when they are not installed: names or repository addresses, separated by spaces. One installed already is left as it is; `mod install` and the settings page update it. |
| `INITIAL_ADMIN_PASSWORD` |  | The admin account's first password, set at the first start of a new instance. Without it that start sets a random one and prints it to the log once. Changing it later does nothing; the account's password is changed in Settings or with `user-passwd`. |
| `INITIAL_ADMIN_PASSWORD` |  | The admin account's first password, set at the first start of a new instance; without it that start sets a random one and prints it to the log once. Changing it later does nothing: the account's password is changed in Settings or with `user-passwd`. |
| `TZ` | `the host's zone` | Time zone for log lines, "today", and which year a date late on New Year's Eve belongs to. |
| `LOG_LEVEL` | `INFO` | How much the process logs: DEBUG, INFO, WARN or ERROR. |
| `LOG_MODULES` |  | Per-component log levels over LOG_LEVEL, such as ssh-server:DEBUG,pipeline:WARN. |
| `EXTERNAL_COMMANDS_CONFIG` | `external-commands.json` | File listing the host programs shell commands may run. |
| `COMMAND_LOOKUP_TTL_MS` | `5000` | How long a command name found on PATH is remembered before it is looked up again. |
| `DEBUG_LOCKS` |  | Set to 1 to record who holds each lock and warn about one held for more than five seconds. |

## Folders in the tree

Where the tree keeps each kind of thing, exported for every shell, so `cd $LOGS_PATH` works wherever the folder lives.

| Variable | Default | What it is |
| --- | --- | --- |
| `ARCHIVE_PATH` |  | The archive: everything people put in and look at. |
| `TAGS_PATH` |  | Labels, one directory per label holding links to what carries it. |
| `HOMES_PATH` |  | One home directory per user, owned by the user. |
| `ETC_PATH` |  | System configuration: settings, groups, services, boot scripts. |
| `USERS_PATH` |  | The accounts: one user node per account, the administrator's. |
| `GROUPS_PATH` |  | Groups. |
| `SERVICES_PATH` |  | Service definitions. |
| `INIT_FILES_PATH` |  | Files installed into the tree at boot. |
| `INIT_PATH` |  | Boot scripts. |
| `VAR_PATH` |  | What the system writes as it runs. |
| `LOGS_PATH` |  | Logs and metrics. |
| `SESSIONS_PATH` |  | Open sessions. |
| `LINKS_PATH` |  | Share links: one node per link that opens an album without signing in. |
| `QUEUES_PATH` |  | Queues. |
| `PIPELINE_QUEUE_PATH` |  | The queue the pipeline engine works from. |
| `POOLS_PATH` |  | Job pools. |
| `PIPELINES_PATH` |  | Pipeline definitions and running instances. |
| `WWW_PATH` |  | Web pages served over HTTP. |
| `MOD_INSTALL_PATH` |  | The modules `mod install` installed, each linked into /usr/modules. |
| `USR_PATH` |  | Code and read-only payload. |
| `BIN_PATH` |  | Built-in commands. |
| `LIB_PATH` |  | Core's other files: its shell commands, its services and the web interface. |
| `MOD_PATH` |  | Installed modules. |
| `DOCS_PATH` |  | This documentation. |
| `TEMP_PATH` |  | Temporary nodes. |
| `DEV_MODULES_PATH` |  | The deployment's modules, mounted read-only. |
| `VAR_DIRS` |  | The directories under /var, as names separated by spaces, for boot scripts to loop over. |

## Set by the system

What EiN exports for every shell at its start besides the folders: the built-in accounts, the host folders its storage is on, and the ports the deployment gave it.

| Variable | Default | What it is |
| --- | --- | --- |
| `INSTANCE_MODE` |  | What this process was started as: primary, or test. |
| `ADMIN_USERNAME` |  | The built-in administrator account. |
| `ADMIN_GROUPNAME` |  | Its group. |
| `ADMIN_UID` |  | Its user id. |
| `ADMIN_GID` |  | Its group's id. |
| `GUEST_USERNAME` |  | The account a visitor who has not signed in acts as. |
| `GUEST_GROUPNAME` |  | Its group. |
| `GUEST_UID` |  | Its user id. |
| `GUEST_GID` |  | Its group's id. |
| `USERS_GROUPNAME` |  | The group every account belongs to: what "everyone" means when sharing. |
| `USERS_GID` |  | Its id. |
| `CFG_HTTP_PORT` | `8080` | The port the web interface listens on, as the deployment set it, which the http-server service reads at its start. In the installer's container it is always 8080: the machine publishes EIN_HTTP_PORT from .env onto it. It is not a setting, since only the deployment knows which port reaches it. |
| `CFG_SSH_PORT` | `2222` | The port the SSH and SFTP server listens on, as the deployment set it, which the ssh-server service reads at its start. In the installer's container it is always 2222: the machine publishes EIN_SSH_PORT from .env onto it. |
| `EIN_PATH_EXPORTS` |  | The layout variables as export lines, written into /etc/layout at boot. |
| `EIN_FILE_ROOT_PATH` |  | Where file content is stored on the host, as FILE_ROOT_PATH gave it: what the dashboard reports disk use for. |
| `EIN_VOLATILE_FILE_ROOT_PATH` |  | The same for content that can be made again. |
| `EIN_FILE_TMP_PATH` |  | The same for temporary files. |
| `EXTERNAL_FILE_ROOT_PATH` |  | FILE_ROOT_PATH as boot received it, for the init scripts. |
| `EXTERNAL_VOLATILE_FILE_ROOT_PATH` |  | VOLATILE_FILE_ROOT_PATH as boot received it. |
| `EXTERNAL_FILE_TMP_PATH` |  | FILE_TMP_PATH as boot received it. |
| `EXTERNAL_DOCS_PATH` |  | DOCS_PATH as boot received it: what is mounted at /usr/docs/guide. |
| `EXTERNAL_DEV_MODULES_PATH` |  | DEV_MODULES_PATH as boot received it. |
| `EXTERNAL_MODULE_INSTALL_PATH` |  | MODULE_INSTALL_PATH as boot received it. |

## Set for each shell

Set by the server that opened the shell: the web interface, the terminal panel or SSH.

| Variable | Default | What it is |
| --- | --- | --- |
| `USER` |  | Your user name. |
| `HOME` |  | Your home directory, holding your settings (.config) and shell history. |
| `PATH` |  | Where commands are looked up, first directory first: core's commands, then each installed module's bin directory. |
| `TMPDIR` |  | Where commands put temporary nodes. |
| `PWD` |  | The directory you are in. |
| `OLDPWD` |  | The directory you were in before, where `cd -` goes. |
| `UID` |  | Your user id. |
| `GID` |  | Your primary group's id. |
| `SID` |  | The session this shell belongs to. |
| `PID` |  | The running command's own id, its name and a unique suffix. |
| `TTY_NAME` |  | The terminal this shell is attached to, when it has one. |
| `TERM` |  | The terminal type an interactive shell reports to programs. |
| `HOSTNAME` |  | The host name shown in the prompt. |
| `COOKIE_NAME` |  | The browser cookie that carries a web session. |

## Options you set

Nobody sets these for you. Export one in a shell, or put it in front of a command, to change how commands behave there: `JSON_OUTPUT=1 ls`.

| Variable | Default | What it is |
| --- | --- | --- |
| `JSON_OUTPUT` |  | Set to 1 and commands answer in JSON instead of text. The web interface runs every command this way. |
| `MEDIA_LINES` | `20` | How many text lines tall `cat` draws a picture in a terminal. |
| `SEARCH_TRACE` |  | Set to 1 and `search` reports how long each of its sources took. |
| `CFG_PASSWORD_HASH_LOGN` | `16` | The scrypt work factor for new password hashes, as a power of two. Lowered by the test tier, where the passwords protect nothing; leave it unset anywhere else. |
| `NOMINATIM_SEARCH_URL` | `https://nominatim.openstreetmap.org/search` | Where geocoding asks Nominatim for an address, as geocode-location and location-region do. Point it at your own server to avoid the public one's rate limit. From the archive module. |

## Set for a pipeline step

Set for each step of a pipeline by the change that started it.

| Variable | Default | What it is |
| --- | --- | --- |
| `NODE_PATH` |  | The node the event is about. |
| `EVENT_TYPE` |  | What happened, as a dotted name such as media.metadata.extracted. |
| `EVENT_ID` |  | The event's id. |
| `EVENT_SOURCE` |  | What raised the event, such as archive-bridge. |
| `EVENT_DATA` |  | The event's details as JSON. Each field is also its own variable: mimetype becomes EVENT_MIMETYPE, deviceSerial EVENT_DEVICE_SERIAL. |
