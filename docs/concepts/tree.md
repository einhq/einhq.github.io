# The tree

Everything EiN holds has a path in one tree, from `/` down. This page walks through the standard
paths: what lies where, who owns each part, which parts modules add, and which parts are stored
somewhere else. Read it when you browse in the terminal, over SFTP or on the **Nodes** page and want
to know what you are looking at.

The examples use folders such as `/archive/albums` and `/archive/people`, which exist with the
[Archive](../archive/index.md) installed; an EiN without modules has the rest of the tree as
described.

## The top of the tree

A fresh installation has seven folders at the top:

```bash
# in EiN's terminal
ls /
```

```text
archive  dev  etc  home  tmp  usr  var
```

Each holds one kind of thing, and the kind is the reason a path sits where it does:

| Folder     | What it holds                                                                                             | Who writes there                                          |
| ---------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `/archive` | What EiN is for: labels, and with the Archive albums, people, locations and devices                       | Everyone with an account, as each folder's sharing allows |
| `/home`    | One folder per account: its settings, shell history, favourites, trash and, with the Archive, its staging | Each account in its own folder                            |
| `/etc`     | Accounts and groups, the system's settings, the services EiN runs and the navigation of the web interface | The administrator, and commands such as `config set`      |
| `/var`     | What the system writes as it runs: logs, sessions, share links, queues, pools and pipeline runs           | EiN itself                                                |
| `/usr`     | Code and read-only files: the commands, the modules and the built-in guide                                | Nobody by hand; an update or `mod install` replaces it    |
| `/dev`     | The channels facts about changes are announced on, and `/dev/null`                                        | EiN itself                                                |
| `/tmp`     | Scratch space that does not outlast a restart                                                             | Everyone                                                  |

![The tree from /: /archive with the Archive module's albums, people, locations and devices and core's tags, and in albums the album Summer 2020 holding beach.jpg; /home with helen's folder holding stars, .trash, the Archive's staging and the assistant's .chats; /etc with users, groups, config, services and ui; /var with logs, sessions, links, queues and pipelines; /usr with bin, lib, modules and docs; /dev with events, pipeline-events and null; and /tmp, scratch space in memory](../diagrams/tree.svg "Each folder at the top holds one kind of thing, and modules add their folders beside core's.")

The administrator owns `/` and the system folders, most of them with the mode `0755`: every account
may read and pass through them, and only the administrator changes them. Your own data lives in `/archive` and
in your home. [Permissions in depth](../admin/permissions.md#the-other-bits-are-the-systems) lists
the owner and mode of each standard folder.

## /archive: the content

`/archive` holds what someone would be upset to lose. Core makes `/archive` and the label tree;
every other folder in it comes from a module. Each module names the folders its content lives in,
and setting the module up creates the ones that are missing. Removing a module never removes them,
since they hold the content.

| Path                      | What is there                                                                                         | From    |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| `/archive/albums`         | Albums, and the photos, videos, recordings and documents in them                                      | Archive |
| `/archive/people`         | People, each with folders such as children, partners, homes, events and devices                       | Archive |
| `/archive/people/unknown` | People face recognition found but nobody has named yet; naming one moves it up into `/archive/people` | Archive |
| `/archive/locations`      | Locations, each with its outline on the map as a child `position` node                                | Archive |
| `/archive/devices`        | Cameras, phones and GPS trackers, each with the route it recorded as a child `track` node             | Archive |
| `/archive/tags`           | Labels: one folder per label, holding a link to everything that carries it                            | Core    |

So an instance without the Archive has `/archive/tags` and nothing else under `/archive`. A folder
that already exists is left as it is, whoever owns it.

`/archive` itself has the mode `0771`: everyone may pass through, but only the `users` group, which
every account belongs to, may list it. The folders a module makes are `0775`, owned by `admin` with
the group `users`, so everyone with an account may add content there. What each album, person or
location then shows to whom is its own sharing; see [Sharing](../guide/sharing.md).

With the Archive, a photo is a node with children of its own: what EiN works out about it, such as its EXIF, its
thumbnails and the faces found on it, is kept beneath the photo and goes with it when it is moved
or deleted. [Nodes and node types](nodes.md) describes what a node holds.

## /home: your own folder

Every account has a home, `/home/<username>`, made with the account. Helen Okafor's account `helen`
has `/home/helen`. In the terminal `~` stands for it, and `cd` alone goes there. You land in it when
you log in over SSH or SFTP.

Your home is yours, in your own group, with the mode `0751`: others may pass through to something
inside it you have shared, and can list nothing. What is made in it takes that from it, so nothing
there is shared with others until you share it.

| Path in your home | What it is                                                                                                                     | From      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `.config`         | Your preferences, as `CFG_USER_…` settings; see [Your profile](../guide/profile.md#your-preferences-in-the-terminal)           | Core      |
| `.bashrc`         | Your own shell settings, read by every shell you open; see [The shell language](../shell/bash.md#keep-your-settings-in-bashrc) | Core      |
| `.bash_history`   | The commands you have typed                                                                                                    | Core      |
| `stars/`          | Your favourites, as links to what you hearted                                                                                  | Core      |
| `.trash/`         | Your trash: each entry holds the node you moved there until you restore it or it is emptied                                    | Core      |
| `.ui/nav.json`    | Your changes to the sidebar and top bar; see [Your sidebar and top bar](../guide/customizing.md)                               | Core      |
| `.ssh/`           | Your SSH keys: `authorized_keys` for signing in, and the keys and `known_hosts` the `ssh` command uses                         | Core      |
| `.chats/`         | Your conversations with the assistant, private to you                                                                          | Assistant |
| `staging/`        | Uploads waiting for you to sort them; see [Sorting in staging](../archive/staging.md)                                          | Archive   |

Most of these appear only once something needs them. Names starting
with a dot are left out by `ls`; `ls -A`, or its alias `la`, shows them.

With the Archive, your staging folder has the mode `0700`, and its files stay out of everyone else's view, search
included. It has four folders of its own:

| Path in `staging/`   | What it holds                                                |
| -------------------- | ------------------------------------------------------------ |
| `files/<category>/`  | The files to sort, by category; uploads go to `files/inbox/` |
| `albums/<category>/` | The groups staging suggests for each category                |
| `journal/`           | What you decided in staging                                  |
| `routes/`            | GPX files waiting for the device that recorded them          |

Neither your trash nor, with the Archive, your staging is part of the library: search, and the
Archive's Media and Year pages, map and **On this day**, leave out everything in them.

## /etc: accounts and settings

`/etc` holds what a person declares: the accounts, the settings and what runs. The administrator
owns it.

| Path                          | What it is                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `/etc/users/<name>`           | An account, as a `user` node holding its password and the link to the person it is          |
| `/etc/groups/<group>`         | A group; its members are links in `users/` beneath it                                       |
| `/etc/config`                 | The system's settings, as `CFG_…` lines, written by **Settings** and `config set`           |
| `/etc/keys`                   | The secret settings, such as API keys, readable by the administrator alone                  |
| `/etc/config.d/<module>`      | A module's own settings file, linked in from the module                                     |
| `/etc/environment`            | The settings the deployment started EiN with, written again at every start                  |
| `/etc/bashrc`                 | Read by every shell: aliases, the history size, and the lines that read the settings files  |
| `/etc/layout`                 | The folder variables, such as `LOGS_PATH`, written at every start and read by `/etc/bashrc` |
| `/etc/services`               | The services EiN can run (`available/`) and those it starts (`enabled/`)                    |
| `/etc/ui/nav.d/<module>.json` | Each module's sidebar and top-bar entries                                                   |
| `/etc/ui/nav.json`            | The administrator's changes to the navigation, laid over every module's                     |
| `/etc/ui/groups`              | A group's changes to the navigation, `<group>/nav.json`, for its members                    |
| `/etc/fstab`                  | Mounts recorded with `mount --save`, mounted again at every start                           |
| `/etc/ssh_host_key`           | The SSH server's host key                                                                   |
| `/etc/init`, `/etc/files`     | The scripts EiN runs as it starts                                                           |

With the assistant installed, `/etc/assistant-prompt.md` holds the instructions the assistant is
given, and `/etc/assistant.d/<module>` what each module tells it. [Configuration](../admin/configuration.md)
explains how the settings files combine, and [Accounts and groups](../admin/accounts.md) the
accounts.

## /var: what the system writes

`/var` is the machine's own state, written by EiN as it runs. Every folder in it is made at start,
so `ls /var` reads the same on a fresh instance as on one that has run for a year.

| Path                         | What it is                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `/var/logs/system`           | The system log                                                                     |
| `/var/logs/metrics`          | Measurements of the machine and of EiN over time, for the Dashboard                |
| `/var/logs/services/<name>`  | Each service's output                                                              |
| `/var/logs/jobs/<pid>`       | The output of a job started with `nohup`                                           |
| `/var/sessions`              | The open sessions: one node per session, from a browser or over SSH                |
| `/var/links`                 | Share links: one node per link that opens something without an account             |
| `/var/queues`                | Queues of events waiting to be handled, the pipeline engine's in `pipeline-engine` |
| `/var/pools`                 | Pools of jobs waiting for a worker, such as the Archive's for the media service    |
| `/var/pipelines/definitions` | The pipelines the modules define                                                   |
| `/var/pipelines/instances`   | The pipeline runs, finished and in progress                                        |
| `/var/www`                   | The sites the web server serves, as links to the web interface                     |
| `/var/lib/modules`           | The modules `mod install` installed, one folder each                               |

Changes under `/var` are left out of the audit trail. [Changes and pipelines](pipelines.md) follows
work through the queues and pools, and [Services and logs](../admin/services-logs.md) shows how to read
the logs.

## /usr: commands, modules and the guide

`/usr` holds code and files nobody edits. An update of EiN replaces what core brings, and `mod install`
what a module brings.

| Path                  | What it is                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `/usr/bin`            | Core's commands, one `command` node each: `/usr/bin/ls` is the `ls` command              |
| `/usr/lib`            | Core's other files: its bash commands in `core/bin`, its services, and the web interface |
| `/usr/modules/<name>` | Each installed module, a link to its folder in `/var/lib/modules`                        |
| `/usr/docs/guide`     | This guide, bundled with EiN, which **Documentation** in the sidebar shows               |

Your `PATH` holds `/usr/bin`, `/usr/lib/core/bin` and each module's `bin` folder, so a module's commands
run by name as soon as it is set up. [Modules](../admin/modules.md#where-modules-are-kept) explains where
installed modules are kept.

## /dev and /tmp

`/dev/events` and `/dev/pipeline-events` are `router` nodes: modules announce the facts they
derive from changes to the tree on `/dev/events`, and the pipeline engine announces its own progress
on `/dev/pipeline-events`; see [Changes and pipelines](pipelines.md). `/dev/null` works as on Linux: reading it gives nothing, and what is written
to it is thrown away.

`/tmp` is open to everyone, with the mode `0777`, and is kept in memory: what you put there is gone
when EiN restarts. A file directly in `/tmp` that has not changed for a day is removed before that;
**Hours in /tmp**, `CFG_TMP_RETENTION_HOURS`, sets how long. Use it for files you need only for a
moment.

## Find a folder by its variable

Every shell has a variable for each standard folder, so a script does not have to spell the path
out. On an EiN with the Archive installed:

```bash
# in EiN's terminal
cd $LOGS_PATH
ls $ARCHIVE_PATH
echo $HOME
```

```text
albums  devices  locations  people  tags
/home/helen
```

| Variable           | Path               |
| ------------------ | ------------------ |
| `ARCHIVE_PATH`     | `/archive`         |
| `TAGS_PATH`        | `/archive/tags`    |
| `HOMES_PATH`       | `/home`            |
| `HOME`             | your own home      |
| `ETC_PATH`         | `/etc`             |
| `USERS_PATH`       | `/etc/users`       |
| `GROUPS_PATH`      | `/etc/groups`      |
| `SERVICES_PATH`    | `/etc/services`    |
| `VAR_PATH`         | `/var`             |
| `LOGS_PATH`        | `/var/logs`        |
| `SESSIONS_PATH`    | `/var/sessions`    |
| `LINKS_PATH`       | `/var/links`       |
| `QUEUES_PATH`      | `/var/queues`      |
| `POOLS_PATH`       | `/var/pools`       |
| `PIPELINES_PATH`   | `/var/pipelines`   |
| `WWW_PATH`         | `/var/www`         |
| `MOD_INSTALL_PATH` | `/var/lib/modules` |
| `USR_PATH`         | `/usr`             |
| `BIN_PATH`         | `/usr/bin`         |
| `LIB_PATH`         | `/usr/lib`         |
| `MOD_PATH`         | `/usr/modules`     |
| `DOCS_PATH`        | `/usr/docs`        |
| `TEMP_PATH`        | `/tmp`             |

[Environment variables](../reference/environment.md#folders-in-the-tree) lists them all with the rest of
the shell's environment.

## Parts of the tree that live elsewhere

Most of the tree is kept in PostgreSQL, but a folder can be a **mount**: its contents come from
somewhere else, and its path looks like any other. `mount` without arguments lists them:

```bash
# in EiN's terminal
mount
```

```text
/                pg         rw 3 Oct 2026 09:14:02
/etc/files       filesystem r  3 Oct 2026 09:14:02
/tmp             memory     rw 3 Oct 2026 09:14:02
/tmp/dev-modules filesystem r  3 Oct 2026 09:14:02
/usr/bin         command    r  3 Oct 2026 09:14:02
/usr/docs/guide  filesystem r  3 Oct 2026 09:14:04
/usr/lib         filesystem r  3 Oct 2026 09:14:02
/var/lib/modules filesystem rw 3 Oct 2026 09:14:02
```

| Type         | Where its contents are                                                              |
| ------------ | ----------------------------------------------------------------------------------- |
| `pg`         | The database: the root, and everything not mounted elsewhere                        |
| `filesystem` | A folder on the machine's disk, such as the built-in guide or the installed modules |
| `command`    | EiN's own commands, as nodes                                                        |
| `memory`     | EiN's memory, gone at a restart                                                     |
| `sftp`       | A folder on another machine, reached over SFTP                                      |

`r` marks a mount nobody can write to, whatever the modes say. Only the administrator mounts and
unmounts. [Reaching other machines](../shell/remote.md#mount-a-folder-of-another-machine) shows how to
mount a folder of another machine, and [Files and storage](files.md) where the bytes of the files in
the database's part of the tree are kept.

## Browse the tree

The tree looks the same through every interface, and each shows you only what you may read.

**In the terminal**, `cd` moves around, `ls` lists a folder, `ls -l` adds each node's type, mode,
owner, group, size and time, and `find` searches under a path:

```bash
# in EiN's terminal
cd /archive/people
ls -l
find /archive/people -maxdepth 1 -type person | wc -l
du -chs /archive/albums/christmas-2019
```

[The terminal](../shell/terminal.md) has more commands for getting around, and [The shell language](../shell/bash.md)
how paths with spaces and wildcards work.

**On the Nodes page**, a file manager over the whole tree. Administrators find it as **Nodes** under
**System** in the sidebar; its address is `/system/nodes`, and `/system/nodes?path=/archive/albums`
opens it at a given folder.

![The Nodes page open on /archive/people/Peggy_Wrenfield: her children, devices, events, homes and partners folders and a link to her cover picture, with her type, mode, owner, group and id in the panel beside](../../assets/shots/nodes.webp "The Nodes page shows the tree as it is, with each node's type, mode, owner and group.")

1. Click a segment of the path above the list to go up to it, or click beside the segments to type a
   path and press <kbd>Enter</kbd>. **Up** and **Home** beside it go to the folder above and to your home.
2. Double-click a folder, or press <kbd>Enter</kbd>, to go into it.
3. Right-click a node for **Open**, **Cut**, **Copy**, **Paste**, **Rename**, **Delete**,
   **New directory**, **Properties** and **Open terminal here**.
4. **Tools** at the top right opens a pane with the selected node's **Preview**, **Attributes** and
   **Sharing**; **Split** opens a second list beside the first.

**Properties** (<kbd>Alt</kbd>+<kbd>Enter</kbd>) shows and changes a node's owner, group and mode;
[Permissions in depth](../admin/permissions.md#see-a-nodes-permissions) describes it.

**Over SFTP**, the tree is a set of folders and files you can open in a file manager or with `sftp`
and `scp`, as [SSH and SFTP](../shell/ssh-sftp.md) describes.

## What you see is yours to see

A folder lists only what you may read. Something private to someone else is not listed to you at
all, so two people can see the same folder differently, and a folder can look empty to you and not be.
An administrator sees everything. [Permissions in depth](../admin/permissions.md) has the rules, and
[Links](links.md) explains the links that put one node in several folders, such as a label's or a
favourite's.

## If something goes differently

**`ls /archive` shows only `tags`.** The Archive module is not installed. An administrator installs it on
**Settings → Modules**; see [Modules](../admin/modules.md).

**A file I put in `/tmp` is gone.** `/tmp` is kept in memory and emptied when EiN restarts, and a
file left directly in it is removed after a day. Keep what you need in your home or, with the Archive, in an album.

**`mount: permission denied, only admin is allowed to mount`.** Mounting is for the administrator.

**A folder holds more than I see, or will not be deleted.** Something in it is hidden from you. Ask its
owner or an administrator; [Sharing](../guide/sharing.md) explains why.

**I cannot find something I deleted.** If you moved it to the trash, it is under **Trash** in your
account menu and in `~/.trash`, and no list or search shows it until you restore it; see
[Your profile, favourites and trash](../guide/profile.md#the-trash). What `rm` deleted is gone.

## Related pages

- [Nodes and node types](nodes.md): what a node is and holds.
- [Links](links.md): softlinks and hard links, which put one node in several places.
- [Files and storage](files.md): where the bytes of files are kept on disk.
- [Changes and pipelines](pipelines.md): what happens when something in the tree changes.
- [Permissions in depth](../admin/permissions.md): owners, groups, modes and access lists.
- [Node types](../reference/node-types.md): every type of node.
- [Environment variables](../reference/environment.md): every variable, the folder variables among them.
