# Configuration files

Every file that configures EiN, where it lives, what writes it and what reads it: the installation's files on the machine EiN runs on, and the files in EiN's own tree. This page is for administrators, and for anyone who wants to know which file a setting or a habit of the shell comes from.

There are two places to look:

- **On the machine EiN runs on**, in the folder EiN was installed in (`~/ein` with the installer): `.env`, the compose files and `setup.sh`. They decide what runs and with which environment, and change only when you edit them or run `setup.sh`.
- **In EiN's tree**, under `/etc` and in each home: ordinary files kept in the database, which you read with `cat` and change with `edit` in EiN's terminal. They survive a restart and an update like the rest of the tree.

How the settings in these files combine, and how to change a setting without touching a file, is on [Configuration](../admin/configuration.md). Every setting is listed on [Settings](settings.md), and every other variable on [Environment variables](environment.md).

## The installation folder

The installer fetches the deployment into `~/ein` and runs `setup.sh` there. After the first run the folder holds:

| Path                    | Made by                   | What it is                                                                                                        |
| ----------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `.env`                  | `setup.sh`, the first run | The settings and passwords of this installation, and the environment of EiN and the media service. Yours to edit. |
| `compose.yaml`          | the deployment            | EiN and its database, the base of every installation.                                                             |
| `compose.ems.yaml`      | the deployment            | The media service, added with `--ems`.                                                                            |
| `compose.llm.yaml`      | the deployment            | The assistant's language model, added with `--llm`.                                                               |
| `compose.override.yaml` | `setup.sh`, every run     | The options chosen in `.env`, as compose services. Written again on every run; do not edit it.                    |
| `ein.Containerfile`     | the deployment            | EiN's image: core's image with the web interface built in.                                                        |
| `setup.sh`              | the deployment            | Fetches the sources, writes `.env` and `compose.override.yaml`, builds the images and starts them.                |
| `src/`                  | `setup.sh`                | The sources it builds: `core`, `db`, and `ems` and `llm` when those options are on.                               |
| `data/`                 | `setup.sh`                | Your files, unless `EIN_DATA` named another folder at the install. See [The data folder](#the-data-folder).       |

The files from the deployment are replaced when `setup.sh` updates the sources, so changes belong in `.env`, not in `compose.yaml`. `setup.sh --help` lists its options, and [Installing in detail](../admin/install.md) explains each.

The database is not in the folder: it is the container engine's volume `ein_db`. [Your data: backup, moving and removing](../admin/data.md) says how to keep it.

### .env

`.env` is read in two ways. Compose reads it to fill in `compose.yaml`, and EiN's and the media service's containers get every line of it as their environment. `setup.sh` writes it once, with mode `0600`, and from then on changes only the lines its options set: `EIN_EMS`, `EIN_LLM` and `EIN_MODULES`.

The file the installer writes looks like this, with your own values:

```ini
# ~/ein/.env, on the machine EiN runs on
EIN_EMS=0
EIN_LLM=0
EIN_GPU=0

EIN_MODULES=""

EIN_DATA=/home/helen/ein/data
POSTGRES_PASSWORD=…
EMS_KEY=…
TZ=Europe/London

EIN_BIND=0.0.0.0
EIN_HTTP_PORT=8080
EIN_SSH_PORT=2222

# CFG_LLM_URL=https://api.openai.com
# CFG_LLM_KEY=
# CFG_LLM_PROVIDER=OpenAI
# CFG_LLM_MODEL=

EIN_GIT=https://github.com/einhq
```

| Line                | What it does                                                                                                                           | Explained on                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `EIN_EMS`           | `1` runs the media service. `--ems` and `--no-ems` set it.                                                                             | [The media service](../admin/media-service.md)                |
| `EIN_LLM`           | `1` runs the language model. `--llm` and `--no-llm` set it.                                                                            | [The language model](../admin/language-model.md)              |
| `EIN_GPU`           | `1` gives the graphics card to the media service and the language model. The first run sets it when it finds a card with its CDI file. | [The graphics card](../admin/gpu.md)                          |
| `EIN_MODULES`       | The modules EiN installs at its start when they are missing, separated by spaces. `--module` adds a name.                              | [Modules](../admin/modules.md)                                |
| `EIN_DATA`          | The data folder, as an absolute path.                                                                                                  | [Installing in detail](../admin/install.md)                   |
| `POSTGRES_PASSWORD` | The database's password, made at the install.                                                                                          |                                                               |
| `EMS_KEY`           | The media service's key, made at the install. Both EiN and the media service get it.                                                   | [The media service](../admin/media-service.md)                |
| `TZ`                | The time zone, taken from the machine at the install.                                                                                  | [Environment variables](environment.md#set-by-the-deployment) |
| `EIN_BIND`          | The address the ports are published on. `127.0.0.1` keeps them to the machine.                                                         | [Ports, HTTPS and remote access](../admin/network.md)         |
| `EIN_HTTP_PORT`     | The machine's port for the web interface.                                                                                              | [Ports, HTTPS and remote access](../admin/network.md)         |
| `EIN_SSH_PORT`      | The machine's port for SSH and SFTP.                                                                                                   | [Ports, HTTPS and remote access](../admin/network.md)         |
| `CFG_LLM_…`         | A hosted language model in place of `--llm`, commented out until you use it.                                                           | [The language model](../admin/language-model.md)              |
| `EIN_GIT`           | Where the sources are cloned from.                                                                                                     | [Installing in detail](../admin/install.md)                   |

Lines you can add:

| Line                                                                 | Read by           | What it does                                                                       |
| -------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `CFG_…`                                                              | EiN               | Gives a setting its value, shown as **From deployment**. See the exceptions below. |
| `EMS_…`                                                              | the media service | Configures the media service.                                                      |
| `EIN_MEMORY`, `EMS_MEMORY`, `LLM_MEMORY`                             | compose           | The most memory each container may use: `6g`, `16g` and `10g` unless set.          |
| `LLM_GGUF_REPO`, `LLM_GGUF_FILE`, `LLM_IMAGE`, `LLM_CARD_RESERVE_MB` | compose           | The language model's file, image and share of the card.                            |

Four settings are fixed by `compose.yaml`, which wins over `.env`: `CFG_HTTP_PORT` (`8080`), `CFG_SSH_PORT` (`2222`), `CFG_EMS_URL` (`http://ems:8181`) and `CFG_EMS_KEY` (the value of `EMS_KEY`). A line for them in `.env` changes nothing. `CFG_LLM_URL` is read from `.env` and is `http://llm:8190` when the line is missing. With `--llm`, `compose.override.yaml` also sets `CFG_LLM_CARD` to `card` or `cpu` after `EIN_GPU`.

To apply a change to `.env`:

```bash
# on the machine EiN runs on, in ~/ein
podman compose up -d    # or: docker compose up -d
```

Running `./setup.sh` applies it too, but also fetches and builds the newest sources; [Updating](../admin/updating.md) explains it. Change `EIN_EMS`, `EIN_LLM` or `EIN_GPU` with `setup.sh`, since only it writes them into `compose.override.yaml`.

> [!WARNING]
> `.env` holds the database password and the media service's key, and no other file keeps them. Keep a copy of it with your backups.

### compose.override.yaml

`setup.sh` writes this file from `.env` on every run, and every compose reads it beside `compose.yaml` on its own, so `podman compose up -d` starts the same services as `setup.sh` does. With the media service, the language model and a card it reads:

```yaml
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

A change made by hand is gone at the next run of `setup.sh`.

### The data folder

`EIN_DATA` is the folder for what is yours outside the database. `setup.sh` makes its subfolders, and the containers mount them:

| Folder           | Mounted in EiN at                          | What it holds                                                               |
| ---------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| `files`          | `/files`                                   | The originals.                                                              |
| `old`            | `/old`                                     | Older originals.                                                            |
| `files-volatile` | `/files-volatile`                          | Renditions EiN can make again: thumbnails, crops, transcodes.               |
| `files-tmp`      | `/files-tmp`                               | Scratch space while content is written.                                     |
| `modules`        | `/modules-installed`                       | The modules EiN installed, which it sees in its tree at `/var/lib/modules`. |
| `llm`            | not in EiN; the language model's `/models` | The downloaded model.                                                       |

The media service mounts the same four file folders at the same paths, the originals read-only. [Files and storage](../concepts/files.md) explains how the tree's files map to these folders.

## Files in EiN's tree

These files are nodes in the tree, so they live in the database and survive a restart, an update and a new container. Read them in EiN's terminal with `cat`, and change them with [`edit`](../shell/editor.md) or the code editor on the **Nodes** page, as far as your rights allow.

| Path                          | Written by                                      | Read by                               | Mode   |
| ----------------------------- | ----------------------------------------------- | ------------------------------------- | ------ |
| `/etc/bashrc`                 | core at the first start, then the administrator | every shell, when it opens            | `0644` |
| `/etc/layout`                 | boot, at every start                            | `/etc/bashrc`                         |        |
| `/etc/environment`            | boot, at every start                            | `/etc/bashrc`                         | `0644` |
| `/etc/config.d/<module>`      | `mod setup`, as a link to the module's file     | `/etc/bashrc`                         |        |
| `/etc/config`                 | **Settings → System**, `config set`             | `/etc/bashrc`                         | `0644` |
| `/etc/keys`                   | **Settings → System**, `config set`, for keys   | EiN itself, never a shell             | `0600` |
| `~/.config`                   | **Profile → Preferences**, `config set`         | `/etc/bashrc`                         | `0600` |
| `~/.bashrc`                   | you                                             | your terminal and SSH logins          |        |
| `~/.bash_history`             | your shell                                      | your shell                            |        |
| `/etc/ui/nav.d/<module>.json` | `mod setup`, as a link to the module's file     | the sidebar and top bar               |        |
| `/etc/ui/nav.json`            | the administrator                               | the sidebar and top bar               |        |
| `~/.ui/nav.json`              | you                                             | your sidebar and top bar              |        |
| `/etc/fstab`                  | `mount --save`, `unmount --save`                | boot, with `mount -a`                 | `0600` |
| `/etc/ssh_host_key`, `.pub`   | the SSH server, at the first start              | the SSH server                        | `0700` |
| `~/.ssh/…`                    | you, `ssh-keygen`, `ssh`                        | the SSH server, `ssh`, `scp`, `mount` | `0700` |
| `/etc/users/`, `/etc/groups/` | the account and group commands                  | every sign-in and access check        |        |
| `/etc/services/`              | `service add`, `service enable`, `mod setup`    | `service start-all` at boot           |        |
| `/etc/assistant-prompt.md`    | `mod setup`, once; then the administrator       | the assistant                         |        |
| `/etc/assistant.d/<module>/`  | `mod setup`, as a link to the module's folder   | the assistant                         |        |
| `/etc/files/`, `/etc/init/`   | boot                                            | boot                                  |        |

A blank mode is the default the folder gives a new file. `~` is your home, `/home/<your username>`.

### The settings files

Five files hold the values of settings, each an ordinary shell file of `export` lines:

```bash
# /etc/config
export CFG_TRASH_RETENTION_DAYS='14'
export CFG_MODULE_SOURCES='https://github.com/einhq https://forge.example:3000/family'
```

| File                     | Holds                                                                                                                                                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/etc/environment`       | The `CFG_…` variables EiN's container was started with, written whole at every start. A value the deployment stops passing is gone from it. A key is never written here.                                                                                                |
| `/etc/config.d/<module>` | A module's own choice of values: a link to the module's `etc/config`, made by `mod setup` and removed with the module. The Archive's names `CFG_SEARCH_PARSER`, the assistant's `CFG_LANGUAGE_MODEL` and `CFG_COMMAND_FINDER`, the media service's `CFG_TEXT_EMBEDDER`. |
| `/etc/config`            | The administrator's values for system settings. Made by the first `config set`; until then it does not exist.                                                                                                                                                           |
| `~/.config`              | One person's values for personal settings, the `CFG_USER_…` ones and `HISTSIZE`. Made by the first `config set` of that person.                                                                                                                                         |
| `/etc/keys`              | The keys to other services saved on the Settings page or with `config set`: `CFG_EMS_KEY`, `CFG_LLM_KEY`, `CFG_MODULE_SOURCES_KEY`. Owned by `admin`, and sourced by no shell. A key from `.env` is never written to any file.                                          |

`/etc/bashrc` sources the first four in that order, so the last one wins: a person's own value, then the administrator's, then a module's, then the deployment's. [How the layers combine](../admin/configuration.md#how-the-layers-combine) shows the whole order with the badges of the Settings page.

`config set` rewrites a line in place and keeps the rest of the file as it was. When you edit `/etc/config` or `~/.config` by hand, nothing checks your values and nothing is restarted; [Edit the settings file by hand](../admin/configuration.md#edit-the-settings-file-by-hand) says what that means.

### /etc/bashrc and /etc/layout

`/etc/bashrc` is sourced by every shell EiN opens: a terminal tab, an SSH login, a command sent over SSH, a service, a pipeline step. It is copied from core's own file at the first start, and from then on it is the administrator's: an update does not replace it. With the Archive installed it reads, in this order:

```bash
#!bash

alias la='ls -A'
alias ll='ls -al'
alias whoami='user whoami'
alias id='user id'

export HISTSIZE=1000

# Configuration layers: the deployment's first, then the modules', the system's, and personal last,
# so a personal setting wins. 10_config.sh adds these to an existing /etc/bashrc, which boot
# never replaces.
case ":$PATH:" in *:/usr/modules/archive/bin:*) ;; *) export PATH="$PATH:/usr/modules/archive/bin";; esac
[ -r /etc/layout ] && source /etc/layout
[ -r /etc/environment ] && source /etc/environment
for f in /etc/config.d/*; do [ -r "$f" ] && source "$f"; done
[ -r /etc/config ] && source /etc/config
[ -n "$HOME" ] && [ -r "$HOME/.config" ] && source "$HOME/.config"
```

Each other module with a `bin/` folder, such as the media service, has a `PATH` line of its own beside the Archive's.

Boot and `mod setup` keep some lines in it, whatever else you change:

- `mod setup` adds a `PATH` line for each module that has a `bin/` folder, once.
- Boot adds the line that sources `/etc/layout`, once.
- At every start, boot moves the four lines that source the settings files to the end, so they come after anything you add.

`/etc/layout` exports where each folder of the tree is, such as `ETC_PATH` and `LOGS_PATH`, and where the data folders are on the machine (`EIN_FILE_ROOT_PATH`, `EIN_VOLATILE_FILE_ROOT_PATH`, `EIN_FILE_TMP_PATH`). Boot writes it whole at every start; leave it alone. [Folders in the tree](environment.md#folders-in-the-tree) lists the variables.

A change to `/etc/bashrc` reaches shells opened after it. In a tab that is already open, run `source /etc/bashrc`. Put aliases and settings of your own in `~/.bashrc` instead, which is yours alone.

### Your shell files

| File              | What it is                                                                                                                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `~/.bashrc`       | Your own aliases, functions and variables, read after `/etc/bashrc` by a terminal tab and an SSH login, not by a command sent with `ssh host 'command'`. A line that fails does not stop the shell from opening. |
| `~/.bash_history` | Your command history, the file `HISTFILE` names. `HISTSIZE` sets how many commands are kept.                                                                                                                     |
| `~/.config`       | Your personal settings; see [The settings files](#the-settings-files).                                                                                                                                           |

EiN reads no `~/.bash_profile` or `~/.profile`. [Keep your settings in ~/.bashrc](../shell/bash.md#keep-your-settings-in-bashrc) shows what to put in it.

### The navigation files

The sidebar and the top bar are put together from three layers of JSON, each changing only what it names:

| File                          | Who writes it                                                            | Who it is for |
| ----------------------------- | ------------------------------------------------------------------------ | ------------- |
| `/etc/ui/nav.d/<module>.json` | each module, linked by `mod setup`; EiN's own is `/etc/ui/nav.d/ui.json` | everyone      |
| `/etc/ui/nav.json`            | an administrator                                                         | everyone      |
| `~/.ui/nav.json`              | you                                                                      | you only      |

The files in `/etc/ui/nav.d` are links to the modules' files, and an update replaces them; put changes in `/etc/ui/nav.json` or `~/.ui/nav.json`, which exist only once someone writes them. [Your sidebar and top bar](../guide/customizing.md) describes the format and its fields.

### /etc/fstab

`/etc/fstab` lists the mounts EiN makes again at every start, one per line: the mount point, the type and the options, separated by spaces. A field with a space in it is in double quotes, and a line starting with `#` is a comment.

```text
/mnt/nas sftp host=nas.local,user=anna,path=/srv/photos,key=/home/admin/.ssh/nas
```

`mount --save` adds or replaces the line for its mount point, and `unmount --save` removes it, keeping every other line and comment. The file is made with mode `0600`, since it names other machines and their users. When it is missing, boot mounts nothing. [Mount a folder of another machine](../shell/remote.md#mount-a-folder-of-another-machine) explains the options.

### The SSH files

| File                                         | What it is                                                                                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `/etc/ssh_host_key`, `/etc/ssh_host_key.pub` | The SSH server's host key, an ed25519 pair made at the first start. Kept in the tree, so it stays the same across updates and new containers. |
| `~/.ssh/authorized_keys`                     | The public keys that may sign in as you over SSH and SFTP, one a line. [SSH and SFTP](../shell/ssh-sftp.md) explains the modes it needs.      |
| `~/.ssh/id_ed25519`, `id_ecdsa`, `id_rsa`    | Your own keys, for `ssh`, `scp` and `ssh-copy-id` to other machines, made with `ssh-keygen`.                                                  |
| `~/.ssh/config`                              | Settings per machine for `ssh` and `scp`, in OpenSSH's format.                                                                                |
| `~/.ssh/known_hosts`                         | The host keys of the machines you have accepted. Lines written by OpenSSH work as they are.                                                   |

`~/.ssh` is made with mode `0700` the first time a command needs it. [Reaching other machines](../shell/remote.md) covers the client files.

### Accounts, groups and services

These are kept by commands, not edited as text:

- `/etc/users/<name>` is an account, with its password in `.password` and a link to the person it is. `/etc/groups/<group>` is a group, with links to its members in `users`. [Accounts and groups](../admin/accounts.md) and the `user` and `group` commands change them; [Permissions in depth](../admin/permissions.md) gives their modes.
- `/etc/services/available/<name>` is a link to a service's folder, which holds its `start.sh`, and `/etc/services/enabled/<name>` marks it to start at boot. A module's service that is a single script gets a folder of its own in `/etc/service-scripts/<name>`. Each service writes its output to `/var/logs/services/<name>/stdout.log` and `stderr.log`. [Services and logs](../admin/services-logs.md) explains the `service` commands.

### The assistant's files

With the assistant module installed:

| File                                   | What it is                                                                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/etc/assistant-prompt.md`             | The instructions the language model is given at the start of every chat. Copied from the assistant module once and never replaced, so you can edit it. |
| `/etc/assistant.d/<module>/prompt.md`  | What a module tells the model about its part.                                                                                                          |
| `/etc/assistant.d/<module>/tools`      | The commands the module offers the model as tools, one a line; `#` starts a comment.                                                                   |
| `/etc/assistant.d/<module>/examples`   | Questions the chat suggests asking, one a line.                                                                                                        |
| `/etc/assistant.d/<module>/cards.json` | The cards an answer may carry under it, drawn from the module's own pages.                                                                             |
| `/etc/assistant.d/<module>/eval.json`  | The questions `agent-eval` asks to test the assistant.                                                                                                 |

Each `/etc/assistant.d/<module>` is a link to the module's `etc/assistant.d`, so an update of the module replaces it; only `/etc/assistant-prompt.md` is yours to change. Because an update does not replace that file either, a new version of the assistant's own instructions does not reach an installation where it already exists. [Teaching the assistant](../develop/assistant.md) describes these files for module authors.

### Boot files

`/etc/files` is the folder of boot scripts that ships with EiN, mounted read-only, and `/etc/init` holds a link to each script boot runs, in name order. They are EiN's own; to change what happens at start-up, use the settings, `/etc/fstab` or a service instead.

## What a module adds to /etc

When a module is set up, at every start and after `mod install`, `mod setup` puts the module's files in place:

| From the module       | In the tree                          | How                                                 |
| --------------------- | ------------------------------------ | --------------------------------------------------- |
| `etc/config`          | `/etc/config.d/<module>`             | Linked, and removed with the module.                |
| `etc/<name>.d`        | `/etc/<name>.d/<module>`             | Linked, and removed with the module.                |
| `ui/nav.json`         | `/etc/ui/nav.d/<module>.json`        | Linked, and removed with the module.                |
| any other `etc/` file | `/etc/<file>`                        | Copied once. A file already there is left as it is. |
| `bin/`                | a `PATH` line in `/etc/bashrc`       | Added once.                                         |
| `services/`           | `/etc/services/available`, `enabled` | Registered and enabled.                             |

The linked files always show the module's current version. A copied file is yours after the first setup, which is why `mod setup` prints `etc/<file> already exists, skipping` for it later. [The module manifest](../develop/manifest.md) and [Writing a module](../develop/modules.md) describe a module's folders.

## Back up and restore

The files in EiN's tree are in the database, so a backup of the database keeps them all: `/etc/config`, `/etc/fstab`, the host key, everyone's `~/.ssh` and `~/.bashrc`. On the machine, keep `.env` and the data folder besides. [Your data: backup, moving and removing](../admin/data.md) says how. EiN has no command that exports its configuration files on their own; copy one with `cat` or over SFTP when you want it apart.

## When a file does not do what you expect

| What you see                                                                          | Why, and what to do                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A `CFG_…` line in `.env` has no effect                                                | The setting is set on the Settings page or chosen by a module, both of which win; it is one of the four `compose.yaml` fixes; or the container was not made again with `podman compose up -d`.        |
| A change to `compose.override.yaml` is gone                                           | `setup.sh` writes it on every run. Change the options in `.env`, or with `setup.sh`, instead.                                                                                                         |
| A change to `/etc/config`, `~/.config` or `/etc/bashrc` does not show in the terminal | The tab was open before the change. Open a new tab, or run `source /etc/bashrc`.                                                                                                                      |
| A service still uses the old value after a hand edit                                  | A hand edit restarts nothing. Restart the service from [Services and logs](../admin/services-logs.md), or save the setting on the Settings page, which does.                                          |
| `could not write …` when you save                                                     | You may read the file but not change it. `/etc` is the administrator's; a member of the `sudo` group becomes the administrator with `admin`, as [Accounts and groups](../admin/accounts.md) explains. |
| A line you added to `/etc/environment` or `/etc/layout` is gone                       | Boot writes both files whole at every start. Put the value in `/etc/config`, or the `CFG_…` line in `.env`.                                                                                           |
| A saved mount is not there after a start                                              | Run `cat /etc/fstab` to check its line and `mount -a` to try again. An SFTP mount whose host key is neither in `known_hosts` nor pinned with `hostkey=` is not connected at start-up.                 |

## Related pages

- [Configuration](../admin/configuration.md): the Settings page, `config set` and how the layers combine.
- [Settings](settings.md) and [Environment variables](environment.md): every setting and variable.
- [Installing in detail](../admin/install.md): `setup.sh`, its options and variables.
- [The editor](../shell/editor.md): `edit`, for the files in the tree.
- [Your sidebar and top bar](../guide/customizing.md): the navigation files.
- [Reaching other machines](../shell/remote.md) and [SSH and SFTP](../shell/ssh-sftp.md): the SSH files and `/etc/fstab`.
