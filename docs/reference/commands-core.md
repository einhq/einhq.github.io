<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Core commands

The commands every EiN has, whatever modules it runs. 206 of them, by name. Every command also says this with `--help`; [Commands](commands.md) explains how to read an entry.

[abspath](#abspath) · [acl](#acl) · [admin](#admin) · [attrs](#attrs) · [audit](#audit) · [awk](#awk) · [basename](#basename) · [cat](#cat) · [chmod](#chmod) · [chown](#chown) · [clear](#clear) · [comment](#comment) · [completion](#completion) · [completion-arg](#completion-arg) · [completion-commands](#completion-commands) · [completion-entity](#completion-entity) · [completion-group](#completion-group) · [completion-path](#completion-path) · [completion-subcommand](#completion-subcommand) · [completion-user](#completion-user) · [config](#config) · [config-get](#config-get) · [config-list](#config-list) · [config-publish](#config-publish) · [config-set](#config-set) · [config-unset](#config-unset) · [cp](#cp) · [cut](#cut) · [date](#date) · [detach](#detach) · [df](#df) · [dirname](#dirname) · [dmesg](#dmesg) · [docs](#docs) · [docs-commands](#docs-commands) · [docs-env](#docs-env) · [docs-find](#docs-find) · [docs-node-types](#docs-node-types) · [du](#du) · [edit](#edit) · [env](#env) · [events](#events) · [facets](#facets) · [file-stat](#file-stat) · [file-sync](#file-sync) · [find](#find) · [find-containing](#find-containing) · [find-nearby](#find-nearby) · [find-similar](#find-similar) · [fold](#fold) · [gauges](#gauges) · [grep](#grep) · [group](#group) · [group-add-member](#group-add-member) · [group-create](#group-create) · [group-delete](#group-delete) · [group-exists](#group-exists) · [group-info](#group-info) · [group-is-member](#group-is-member) · [group-list](#group-list) · [group-members](#group-members) · [group-remove-member](#group-remove-member) · [group-resolve](#group-resolve) · [group-update](#group-update) · [head](#head) · [health](#health) · [host-metrics](#host-metrics) · [http-server](#http-server) · [info](#info) · [jq](#jq) · [label](#label) · [labels](#labels) · [ln](#ln) · [log-append](#log-append) · [login](#login) · [logout](#logout) · [ls](#ls) · [members](#members) · [metrics-sampler](#metrics-sampler) · [mime](#mime) · [mkbuf](#mkbuf) · [mkdir](#mkdir) · [mkfile](#mkfile) · [mklog](#mklog) · [mknode](#mknode) · [mkpool](#mkpool) · [mkqueue](#mkqueue) · [mkrouter](#mkrouter) · [mod](#mod) · [mod-cache](#mod-cache) · [mod-info](#mod-info) · [mod-install](#mod-install) · [mod-list](#mod-list) · [mod-remove](#mod-remove) · [mod-search](#mod-search) · [mod-setup](#mod-setup) · [mount](#mount) · [mv](#mv) · [news](#news) · [nohup](#nohup) · [onthisday](#onthisday) · [parse-search](#parse-search) · [pipeline](#pipeline) · [pipeline-cancel](#pipeline-cancel) · [pipeline-define](#pipeline-define) · [pipeline-engine](#pipeline-engine) · [pipeline-heal](#pipeline-heal) · [pipeline-instances](#pipeline-instances) · [pipeline-list](#pipeline-list) · [pipeline-overview](#pipeline-overview) · [pipeline-prune](#pipeline-prune) · [pipeline-remove](#pipeline-remove) · [pipeline-repair](#pipeline-repair) · [pipeline-rerun](#pipeline-rerun) · [pipeline-restart](#pipeline-restart) · [pipeline-start](#pipeline-start) · [pipeline-status](#pipeline-status) · [pipeline-step-restart](#pipeline-step-restart) · [pipeline-undefine](#pipeline-undefine) · [pipeline-worker](#pipeline-worker) · [pool](#pool) · [pool-add](#pool-add) · [pool-cancel](#pool-cancel) · [pool-claim](#pool-claim) · [pool-list](#pool-list) · [pool-purge](#pool-purge) · [pool-retry](#pool-retry) · [pool-stat](#pool-stat) · [pool-wake](#pool-wake) · [position-get](#position-get) · [position-set](#position-set) · [props](#props) · [ps](#ps) · [queue-dead](#queue-dead) · [queue-peek](#queue-peek) · [reach-check](#reach-check) · [relate](#relate) · [relations-guard](#relations-guard) · [resolve-id](#resolve-id) · [rev](#rev) · [rm](#rm) · [rmdir](#rmdir) · [scp](#scp) · [search](#search) · [sed](#sed) · [seq](#seq) · [service](#service) · [service-add](#service-add) · [service-disable](#service-disable) · [service-enable](#service-enable) · [service-list](#service-list) · [service-remove](#service-remove) · [service-restart](#service-restart) · [service-start](#service-start) · [service-start-all](#service-start-all) · [service-status](#service-status) · [service-stop](#service-stop) · [service-stop-all](#service-stop-all) · [session-reap](#session-reap) · [share](#share) · [share-info](#share-info) · [share-link](#share-link) · [share-set](#share-set) · [sleep](#sleep) · [sort](#sort) · [ssh](#ssh) · [ssh-copy-id](#ssh-copy-id) · [ssh-keygen](#ssh-keygen) · [ssh-server](#ssh-server) · [star](#star) · [stat](#stat) · [stats-overview](#stats-overview) · [system-info](#system-info) · [tail](#tail) · [top](#top) · [tr](#tr) · [trash](#trash) · [truncate](#truncate) · [ui-build](#ui-build) · [ui-icons](#ui-icons) · [ui-nav](#ui-nav) · [uniq](#uniq) · [unmount](#unmount) · [unrelate](#unrelate) · [unzip](#unzip) · [user](#user) · [user-create](#user-create) · [user-delete](#user-delete) · [user-disable](#user-disable) · [user-elevate](#user-elevate) · [user-enable](#user-enable) · [user-exists](#user-exists) · [user-groups](#user-groups) · [user-id](#user-id) · [user-info](#user-info) · [user-list](#user-list) · [user-passwd](#user-passwd) · [user-resolve](#user-resolve) · [user-set-primary-group](#user-set-primary-group) · [user-update](#user-update) · [user-whoami](#user-whoami) · [uuid](#uuid) · [wc](#wc) · [who](#who) · [www](#www) · [xargs](#xargs)

## A

### `abspath`

Ensure path is abspath.

<small>reads only</small>

```text
abspath <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | the path to make absolute. |

### `acl`

Display or modify a node access control list.

<small>reads only</small>

```text
acl [-m <string>] [-x <string>] [-b] [-r] [-L] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-m <string>` | add or modify an entry (u:<user>:<perms> or g:<group>:<perms>) |
| `-x <string>` | remove an entry (u:<user> or g:<group>) |
| `-b` | remove the user and group entries (share links stay: share-link removes them) |
| `-r` | apply to the whole subtree, skipping nodes that hold their own access. |
| `-L` | do not follow symbolic links. |

### `admin`

Become the administrator in this terminal, for a member of the sudo group (user-elevate)

<small>changes things</small>

```text
admin
```

```bash
admin
admin --off
```

With `JSON_OUTPUT=1`: nothing; this terminal acts as the administrator until admin --off or signing out.

### `attrs`

Display or set node attributes.

<small>reads only</small>

```text
attrs [-L] [-s <string>] [-d <string>] [-J <string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |
| `-s <string>` | set attribute as string. |
| `-d <string>` | unset attribute. |
| `-J <string>` | set attribute as JSON. |

```bash
attrs /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
attrs -s 'description=Ett exempel' /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: every attribute on the node, or nothing when setting one.

### `audit`

Show who created, changed, moved, linked or removed which node, and when (administrators only)

<small>administrators only · reads only</small>

```text
audit [--user=<string>] [--id=<string>] [--record=<string>] [--cause=<string>] [--op=<string>] [--since=<string>] [--until=<string>] [--type=<string>] [--after=<string>] [-n <string>] [-v] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | only writes to this path or below it (moves match on either side) |

| Option | What it does |
| --- | --- |
| `--user=<string>` | only writes by this user (name or uid) |
| `--id=<string>` | only writes to this node id. |
| `--record=<string>` | only the record with this id. |
| `--cause=<string>` | only writes set off by the write with this record id: what its pipeline runs wrote. |
| `--op=<string>` | only this operation: create, update, move, link, unlink, delete. |
| `--since=<string>` | from this time on (ISO date/time or epoch ms) |
| `--until=<string>` | before this time (ISO date/time or epoch ms) |
| `--type=<string>` | only writes to nodes of this type (repeatable) |
| `--after=<string>` | only the records after this record id, oldest first: pass the last id read to follow the trail. |
| `-n <string>` | at most this many records, the latest, or with --after the first (default: 100) |
| `-v` | show each record's id, session or pipeline run, cause, and the values it changed. |

### `awk`

Pattern scanning and text processing language (fields, patterns, arrays, printf)

<small>reads only</small>

```text
awk [-F <string>] [-v <string>] [-f <string>] <PROGRAM> <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<PROGRAM>` | awk program, e.g. '{ print $1 }' or 'BEGIN { FS=":" } $3 > 10 { n++ } END { print n }'; omit when using -f. |
| `<FILE>...` | files to process, or var=value assignments (reads stdin if no files) |

| Option | What it does |
| --- | --- |
| `-F <string>` | field separator (a character, "t" for tab, or a regex) |
| `-v <string>` | assign var=value before the program starts (repeatable) |
| `-f <string>` | read the program from this file (repeatable) |

## B

### `basename`

Strip directory and suffix from filenames.

<small>reads only</small>

```text
basename [-s <string>] [-a] [-z] <NAME> <SUFFIX>
```

| Argument | What it is |
| --- | --- |
| `<NAME>` | the path to extract basename from. |
| `<SUFFIX>` | optional suffix to remove. |

| Option | What it does |
| --- | --- |
| `-s <string>` | remove a trailing SUFFIX. |
| `-a` | support multiple arguments. |
| `-z` | end each output line with NUL, not newline. |

## C

### `cat`

Print nodes' contents, one after the other: a text file, a log (one JSON entry a line), a position or an embedding (JSON)

<small>reads only</small>

```text
cat [-s] [-l] [-t] [--timestamps] <path>...
```

| Argument | What it is |
| --- | --- |
| `<path>...` | nodes to output, one after the other; without one, or for -, stdin is copied. |

| Option | What it does |
| --- | --- |
| `-s` | small media preview (mediaLines / 2) |
| `-l` | large media preview (mediaLines * 2) |
| `-t` | log: each entry's time (ISO 8601, UTC) first, a tab, then the entry. |
| `--timestamps` | log: each entry's time (ISO 8601, UTC) first, a tab, then the entry. |

```bash
cat /archive/albums/Exempelalbum_2019/files/notes.txt
cat -t /archive/people/Anna_Exempel/measurements/weight
```

With `JSON_OUTPUT=1`: the node's contents; with -t on a log, lines like 2016-09-04T16:13:27.739Z<TAB>{"value":83.4}.

### `chmod`

Change file mode bits.

<small>changes things</small>

```text
chmod [-L] [-r] <mode> <path>
```

| Argument | What it is |
| --- | --- |
| `<mode>` | mode to set. |
| `<path>` | node(s) to change. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |
| `-r` | apply to the whole subtree, skipping nodes that hold their own access. |

### `chown`

Change file owner and group.

<small>changes things</small>

```text
chown [-L] [-r] <usergroup> <path>
```

| Argument | What it is |
| --- | --- |
| `<usergroup>` | user or group to set. |
| `<path>` | node(s) to change. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |
| `-r` | apply to the whole subtree, skipping nodes that hold their own access. |

### `clear`

Clear the terminal screen.

<small>reads only</small>

```text
clear
```

### `comment`

Manage comments on a node (list, add, remove)

<small>reads only</small>

```text
comment [--body=<string>] [--body-base64=<string>] <subcommand> <path> <slug>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | list \| add \| remove. |
| `<path>` | node the comment belongs to. |
| `<slug>` | comment slug (remove) |

| Option | What it does |
| --- | --- |
| `--body=<string>` | comment body (add) |
| `--body-base64=<string>` | base64-encoded comment body (add) |

### `completion`

Spec-driven completion helpers.

```text
completion <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `completion-arg`

Autocomplete a command argument.

<small>reads only</small>

```text
completion-arg [--word=<string>]
```

| Option | What it does |
| --- | --- |
| `--word=<string>` | Word to autocomplete. |

### `completion-commands`

Autocomplete a command name, without the subcommands of groups.

<small>reads only</small>

```text
completion-commands [--word=<string>]
```

| Option | What it does |
| --- | --- |
| `--word=<string>` | Word to autocomplete. |

### `completion-entity`

Complete a person, location, album, device or track by name.

<small>reads only</small>

```text
completion-entity [--kind=<string>] [--limit=<string>] <query>
```

| Argument | What it is |
| --- | --- |
| `<query>` | the partial name typed so far. |

| Option | What it does |
| --- | --- |
| `--kind=<string>` | restrict to these kinds, comma-separated: whichever the installed modules declare (person, location, album, device, track) |
| `--limit=<string>` | maximum suggestions (default 8) |

### `completion-group`

Autocomplete a group.

<small>reads only</small>

```text
completion-group [--word=<string>]
```

| Option | What it does |
| --- | --- |
| `--word=<string>` | Word to autocomplete. |

### `completion-path`

Autocomplete a path.

<small>reads only</small>

```text
completion-path [--word=<string>]
```

| Option | What it does |
| --- | --- |
| `--word=<string>` | Word to autocomplete. |

### `completion-subcommand`

Autocomplete a command.

<small>reads only</small>

```text
completion-subcommand [--word=<string>] <command>
```

| Argument | What it is |
| --- | --- |
| `<command>` | Command to which the subcommand belongs. |

| Option | What it does |
| --- | --- |
| `--word=<string>` | Word to autocomplete. |

### `completion-user`

Autocomplete a user.

<small>reads only</small>

```text
completion-user [--word=<string>]
```

| Option | What it does |
| --- | --- |
| `--word=<string>` | Word to autocomplete. |

### `config`

Read and change system and personal settings.

<small>visitors too</small>

```text
config <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `config-get`

Print the effective value of one setting; for a key, only whether it is set.

<small>reads only</small>

```text
config-get <key>
```

| Argument | What it is |
| --- | --- |
| `<key>` | setting name. |

### `config-list`

List settings with their effective values.

<small>visitors too · reads only</small>

```text
config-list [--scope=<string>]
```

| Option | What it does |
| --- | --- |
| `--scope=<string>` | limit to 'system' or 'user' settings. |

### `config-publish`

Copy settings from this process's environment into /etc/environment.

<small>changes things</small>

```text
config-publish
```

### `config-set`

Change a setting and restart whatever reads it.

<small>changes things</small>

```text
config-set <key> <value>
```

| Argument | What it is |
| --- | --- |
| `<key>` | setting name. |
| `<value>` | new value. |

### `config-unset`

Reset a setting to its default.

<small>changes things</small>

```text
config-unset <key>
```

| Argument | What it is |
| --- | --- |
| `<key>` | setting name. |

### `cp`

Copy files and directories.

<small>changes things</small>

```text
cp [-r] [-f] <source> <dest>
```

| Argument | What it is |
| --- | --- |
| `<source>` | source file(s) or directories to copy. |
| `<dest>` | destination path. |

| Option | What it does |
| --- | --- |
| `-r` | copy directories recursively. |
| `-f` | overwrite existing destination files. |

```bash
cp /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg /archive/albums/Exempelalbum_2019/files/IMG_0007_copy.jpg
cp -r /archive/albums/Exempelalbum_A /archive/albums/Exempelalbum_B
```

With `JSON_OUTPUT=1`: nothing.

### `cut`

Remove sections from each line of files.

<small>reads only</small>

```text
cut [-d <string>] [-f <string>] [-c <string>] [-s] <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<FILE>...` | files to cut, one after the other (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-d <string>` | use DELIM instead of TAB for field delimiter. |
| `-f <string>` | select only these fields (e.g., -f1, -f1-3, -f1,3) |
| `-c <string>` | select only these characters (e.g., -c1-5) |
| `-s` | do not print lines not containing delimiters. |

## D

### `date`

Print or set the system date and time.

<small>reads only</small>

```text
date [-d <string>] [-u] [-I <string>] [-R] <+FORMAT>
```

| Argument | What it is |
| --- | --- |
| `<+FORMAT>` | output format (strftime-style) |

| Option | What it does |
| --- | --- |
| `-d <string>` | display time described by STRING, not now. |
| `-u` | print or set UTC time. |
| `-I <string>` | output in ISO 8601 format (date, hours, minutes, seconds, ns) |
| `-R` | output in RFC 5322 format. |

### `detach`

detach a job so it keeps running after the shell closes.

<small>changes things</small>

```text
detach [--list] <job>
```

| Argument | What it is |
| --- | --- |
| `<job>` | job spec (%n), job number, or pid; defaults to the most recent job. |

| Option | What it does |
| --- | --- |
| `--list` | list detached jobs system-wide instead, from their records under /var/logs/jobs. |

### `df`

Free space per storage tier, its growth per day and when it fills, and the database size.

<small>reads only</small>

```text
df
```

### `dirname`

Strip last component from file name.

<small>reads only</small>

```text
dirname [-z] <NAME>
```

| Argument | What it is |
| --- | --- |
| `<NAME>` | the path to extract directory from. |

| Option | What it does |
| --- | --- |
| `-z` | end each output line with NUL, not newline. |

### `dmesg`

Print system log.

<small>reads only</small>

```text
dmesg [-n <string>] [--level=<string>] [<path>]
```

| Argument | What it is |
| --- | --- |
| `[<path>]` | log node path (default: /logs/system) |

| Option | What it does |
| --- | --- |
| `-n <string>` | show last N lines. |
| `--level=<string>` | only lines at this level or above: debug, info, warn, error. |

### `docs`

Describe what this installation is made of: its commands, node types and environment variables.

```text
docs <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `docs-commands`

List every command on your PATH with its full spec and the module it comes from.

<small>reads only</small>

```text
docs-commands
```

```bash
docs commands
```

With `JSON_OUTPUT=1`: One entry per command: name, module (core or the module whose bin it is) and its whole spec.

### `docs-env`

List the environment variables EiN and its modules read, with their values in this shell.

<small>reads only</small>

```text
docs-env
```

```bash
docs env
docs env | grep PATH
```

With `JSON_OUTPUT=1`: One entry per variable: key, kind, description, default, owner module, and its value in this shell where it has one.

### `docs-find`

Commands by what they do, best first: by the command CFG_COMMAND_FINDER names, else by their words.

<small>reads only</small>

```text
docs-find [--limit=<number>] <words>...
```

| Argument | What it is |
| --- | --- |
| `<words>...` | What the command should do. |

| Option | What it does |
| --- | --- |
| `--limit=<number>` | How many commands. |

### `docs-node-types`

List every node type, described or in use, with what it is for and how many exist.

<small>reads only</small>

```text
docs-node-types
```

```bash
docs node-types
```

With `JSON_OUTPUT=1`: One entry per type: type, count, and label, description, category and owner module where it is described.

### `du`

Estimate file usage in node structures.

<small>reads only</small>

```text
du [-c] [-h] [-s] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | one or more structures to measure (default: .) |

| Option | What it does |
| --- | --- |
| `-c` | print a grand total. |
| `-h` | print sizes in units of 1024 (e.g. 1.5 KB) |
| `-s` | print only a total for each argument. |

```bash
du -sh /archive/albums/Exempelalbum_2019
```

With `JSON_OUTPUT=1`: the size of each path, and a total with -c.

## E

### `edit`

Edit a text file, with syntax highlighting and checks for JSON, YAML, bash and Markdown.

<small>changes things</small>

```text
edit <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to file to edit. |

### `env`

Print environment variables.

<small>reads only</small>

```text
env
```

### `events`

What falls on the days around a date, from every events-* command on PATH.

<small>reads only</small>

```text
events [--today=<string>] [--days-ahead=<number>] [--days-past=<number>] [--limit=<number>]
```

| Option | What it does |
| --- | --- |
| `--today=<string>` | the date to look around, YYYY-MM-DD (default today, UTC) |
| `--days-ahead=<number>` | how far forward to look (default 30) |
| `--days-past=<number>` | how far back to look (default 7) |
| `--limit=<number>` | entries returned across all providers; milestones, then the nearest, survive the cut (default 16) |

```bash
events
events --days-ahead 0 --days-past 0
events --today 2026-12-24 --days-ahead 7
```

With `JSON_OUTPUT=1`: the entries of every events-* provider in the window, in date order: the day, what, whether it is a milestone, the node it is about, which provider, and the route that draws it.

## F

### `facets`

Bucket counts (per year, per kind) for sizing search filters.

<small>reads only</small>

```text
facets [--kind=<string>] [--from=<string>] [--to=<string>]
```

| Option | What it does |
| --- | --- |
| `--kind=<string>` | restrict to content kinds: photo, video, audio, document, or node types. |
| `--from=<string>` | only count media taken at/after this date. |
| `--to=<string>` | only count media taken before this date, exclusive. |

```bash
facets --kind photo --from 2015 --to 2020
```

With `JSON_OUTPUT=1`: per-year and per-kind counts for the filters given.

### `file-stat`

Stat for on disk file.

<small>reads only</small>

```text
file-stat [-f] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-f` | return full information, including mimetype, sha256, much slower. |

```bash
file-stat /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: the file's size, mode and times as they are on disk.

### `file-sync`

Sync for on disk file.

<small>changes things</small>

```text
file-sync <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

```bash
file-sync /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the node's size and checksum are brought in line with the bytes on disk.

### `find`

Search for nodes under a path, as GNU find does: starting points, then an expression of tests (-name -iname -path -ipath GLOB, -regex -iregex RE on the whole path, -type f\|d\|l\|<node type>, -empty, -size [+-]N[cwbkMG], -user -group NAME, -uid -gid N, -newer PATH, -mmin and -mtime [+-]N), operators (! -not -a -o and parentheses), options (-maxdepth -mindepth N, -depth) and actions (-print -print0 -printf FORMAT -prune -quit -delete, -exec CMD {} ';' and -exec CMD {} +); -printf knows %p %f %h %P %d %s %y %m %u %g %U %G %t %c and %Tk %Ck %Bk for k in @YymdHMSFTDab+; the flags below are the same tests.

<small>reads only</small>

```text
find [--name=<string>] [--iname=<string>] [--type=<string>] [--maxdepth=<string>] [--mindepth=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | starting point, printed itself at depth 0; several may be given (default: .) |

| Option | What it does |
| --- | --- |
| `--name=<string>` | match the name by glob pattern (-name) |
| `--iname=<string>` | match the name by glob pattern, ignoring case (-iname) |
| `--type=<string>` | node type: f, d, l or one such as person; several comma-separated (-type) |
| `--maxdepth=<string>` | descend at most this many levels: 0 is the starting point alone (-maxdepth) |
| `--mindepth=<string>` | match nothing shallower than this level: 1 leaves out the starting point (-mindepth) |

```bash
find /archive/albums/Exempelalbum_2019 -name '*.jpg' -type f
find /archive/people -mindepth 1 -maxdepth 2 -type person
find /home/anna/staging -name '.tmp*' -prune -o -type f -mmin -60 -print
find /home/anna/staging -type f -size +10M -printf '%s %p\n'
find /home/anna/staging -name '*.tmp' -exec rm {} +
```

With `JSON_OUTPUT=1`: every path -print selects; in JSON each with its type, name and number of children. With -printf, -print0 or -exec the output is text.

### `find-containing`

Find positions whose shape contains a point.

<small>reads only</small>

```text
find-containing [--lat=<string>] [--lng=<string>] [--limit=<string>] <lat> <lng>
```

| Argument | What it is |
| --- | --- |
| `<lat>` | latitude of the point. |
| `<lng>` | longitude of the point. |

| Option | What it does |
| --- | --- |
| `--lat=<string>` | latitude, as --lat=<n> — required form for a negative coordinate. |
| `--lng=<string>` | longitude, as --lng=<n> — required form for a negative coordinate. |
| `--limit=<string>` | max results (default: 10) |

### `find-nearby`

Find positions near a position node, by distance.

<small>reads only</small>

```text
find-nearby [--radius=<string>] [--limit=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path of a position node. |

| Option | What it does |
| --- | --- |
| `--radius=<string>` | search radius in meters (default: 10000) |
| `--limit=<string>` | max results (default: 10) |

### `find-similar`

Find similar nodes by embedding.

<small>reads only</small>

```text
find-similar [--limit=<number>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path of embedding node. |

| Option | What it does |
| --- | --- |
| `--limit=<number>` | at most this many matches. |

With `JSON_OUTPUT=1`: the nearest embeddings with their similarity and paths, as JSON (SimilarAnswer).

### `fold`

Wrap each input line to fit a width (fold -w1: one character per line)

<small>reads only</small>

```text
fold [-w <number>] [-s] [-b] <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<FILE>...` | files to fold (reads from stdin if omitted) |

| Option | What it does |
| --- | --- |
| `-w <number>` | width in columns (default 80) |
| `-s` | break at the last blank that fits. |
| `-b` | count characters, not columns (tabs count one) |

## G

### `gauges`

List the gauges running services draw beside the host's (a card's memory, say)

<small>reads only</small>

```text
gauges
```

### `grep`

Search for patterns in input.

<small>reads only</small>

```text
grep [-i] [-v] [-c] [-n] [-o] [-E] [-F] [-q] <PATTERN> <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<PATTERN>` | the pattern to search for. |
| `<FILE>...` | files to search (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-i` | ignore case distinctions. |
| `-v` | select non-matching lines. |
| `-c` | print only a count of matching lines. |
| `-n` | prefix each line with line number. |
| `-o` | show only the matching part of lines. |
| `-E` | interpret pattern as extended regexp. |
| `-F` | interpret pattern as fixed string. |
| `-q` | quiet mode, exit with 0 on match, 1 otherwise. |

```bash
grep -n exempelord /archive/albums/Exempelalbum_2019/files/notes.txt
```

With `JSON_OUTPUT=1`: the matching lines.

### `group`

Manage groups.

```text
group <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `group-add-member`

Add a user to a group.

<small>administrators only · changes things</small>

```text
group-add-member <group> <user>
```

| Argument | What it is |
| --- | --- |
| `<group>` | group to add the user to. |
| `<user>` | user to add to the group. |

### `group-create`

Create a new group.

<small>administrators only · changes things</small>

```text
group-create [--gid=<string>] [--title=<string>] [--description=<string>] <groupname>
```

| Argument | What it is |
| --- | --- |
| `<groupname>` | name of the group to create: letters, digits and . _ - @, starting with a letter or _. |

| Option | What it does |
| --- | --- |
| `--gid=<string>` | numeric group ID. |
| `--title=<string>` | display title for the group. |
| `--description=<string>` | description of the group. |

### `group-delete`

Delete a group: what it owned goes to another group, and ACL entries naming it are dropped.

<small>administrators only · changes things</small>

```text
group-delete [--to=<group>] [--force] <groupname>
```

| Argument | What it is |
| --- | --- |
| `<groupname>` | name of the group to delete. |

| Option | What it does |
| --- | --- |
| `--to=<group>` | group that takes over the nodes it owned (default admin) |
| `--force` | delete it even if it is a primary group; those users go back to their own group. |

### `group-exists`

Check if a group exists.

<small>reads only</small>

```text
group-exists <groupname>
```

| Argument | What it is |
| --- | --- |
| `<groupname>` | group name to check. |

### `group-info`

Display group information.

<small>reads only</small>

```text
group-info <groupname>
```

| Argument | What it is |
| --- | --- |
| `<groupname>` | group name to look up. |

### `group-is-member`

Check if a user is a member of a group.

<small>reads only</small>

```text
group-is-member <group> <user>
```

| Argument | What it is |
| --- | --- |
| `<group>` | group to check if the user is member of. |
| `<user>` | user to check. |

### `group-list`

List the groups; as JSON with each one's description and built-in role.

<small>reads only</small>

```text
group-list [--members]
```

| Option | What it does |
| --- | --- |
| `--members` | also list the usernames linked into each group, where the caller may see them (a primary group's users are not linked) |

### `group-members`

List members of a group.

<small>administrators only · reads only</small>

```text
group-members [--limit=<string>] <group>
```

| Argument | What it is |
| --- | --- |
| `<group>` | group to list members of. |

| Option | What it does |
| --- | --- |
| `--limit=<string>` | maximum members to return (1-50) |

### `group-remove-member`

Remove a user from a group.

<small>administrators only · changes things</small>

```text
group-remove-member <group> <user>
```

| Argument | What it is |
| --- | --- |
| `<group>` | group to remove the user from. |
| `<user>` | user to remove from the group. |

### `group-resolve`

Resolve group name to GID or vice versa.

<small>reads only</small>

```text
group-resolve <gid_or_groupname>
```

| Argument | What it is |
| --- | --- |
| `<gid_or_groupname>` | gid (numeric) or group name to resolve. |

### `group-update`

Update a group's title or description; its gid is fixed when it is created.

<small>administrators only · changes things</small>

```text
group-update [--title=<string>] [--description=<string>] <groupname>
```

| Argument | What it is |
| --- | --- |
| `<groupname>` | name of the group to update. |

| Option | What it does |
| --- | --- |
| `--title=<string>` | set display title. |
| `--description=<string>` | set description. |

## H

### `head`

Output the first part of files, logs, or stdin; on a queue, the next entries without consuming them.

<small>reads only</small>

```text
head [-n <string>] [-c <string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | file, log or queue node to read (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-n <string>` | print the first NUM lines instead of the first 10 (-NUM works too) |
| `-c <string>` | print the first NUM bytes. |

```bash
head -n 20 /archive/albums/Exempelalbum_2019/files/notes.txt
```

With `JSON_OUTPUT=1`: the first lines of the file.

### `health`

Say whether the system is healthy, catching up, stuck or needs a person, and the checks that decide it.

<small>reads only</small>

```text
health
```

### `host-metrics`

CPU and memory use and event-loop lag now, with their recent history from metrics-sampler.

<small>reads only</small>

```text
host-metrics [--window=<string>]
```

| Option | What it does |
| --- | --- |
| `--window=<string>` | Minutes of history (default: 360) |

### `http-server`

Start an HTTP server.

<small>administrators only · changes things</small>

```text
http-server [--port=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to serve as root, "default" in root will be used as the default host. |

| Option | What it does |
| --- | --- |
| `--port=<string>` | port to use. |

## I

### `info`

Display node ID and type.

<small>reads only</small>

```text
info [-L] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |

## J

### `jq`

Lightweight JSON processor.

<small>reads only</small>

```text
jq [-r] [-e] [-c] [-C] [-M] [-S] <filter> <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<filter>` | jq filter expression (e.g., .field, .field.nested, .[] \| .name, startswith("x")); . if omitted. |
| `<FILE>...` | files of JSON texts (one, or JSON Lines), each text filtered in turn (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-r` | output raw strings, not JSON texts. |
| `-e` | exit with status 1 if output is null or false. |
| `-c` | compact instead of pretty-printed output. |
| `-C` | colorize JSON output even when not on a terminal. |
| `-M` | do not colorize JSON output. |
| `-S` | Output the fields of each object with the keys in sorted order. |

## L

### `label`

Manage labels/tags (add, remove, list, prune)

<small>reads only</small>

```text
label <subcommand> <path> <label>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | add \| remove \| list \| prune. |
| `<path>` | node path. |
| `<label>` | label name(s) |

```bash
label add /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg exempeletikett
label list /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: for `list`, the labels on the node; for `add` and `remove`, nothing.

### `labels`

List labels (all, or of a node); search --tag <label> finds what carries one.

<small>reads only</small>

```text
labels <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | node path (optional) |

```bash
labels
labels /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: without a path, every label in use with how many nodes carry it ({ label, count }); with one, the labels on that node.

### `ln`

Create links between files.

<small>changes things</small>

```text
ln [-s] [-f] <target> <link_name>
```

| Argument | What it is |
| --- | --- |
| `<target>` | target of the link. |
| `<link_name>` | name of the link to create. |

| Option | What it does |
| --- | --- |
| `-s` | make symbolic links instead of hard links. |
| `-f` | remove existing destination files. |

```bash
ln -s /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg /home/anna/favourite.jpg
```

With `JSON_OUTPUT=1`: nothing.

### `log-append`

Append a JSON entry to a log, optionally at an explicit (backdated) timestamp.

<small>changes things</small>

```text
log-append [--data=<string>] [--at=<string>] <log> <data>
```

| Argument | What it is |
| --- | --- |
| `<log>` | VFS path to the log node. |
| `<data>` | JSON entry (alternative to --data) |

| Option | What it does |
| --- | --- |
| `--data=<string>` | JSON payload for the entry. |
| `--at=<string>` | ISO timestamp to backdate the entry to. |

### `login`

Authenticate as a user.

<small>visitors too · changes things</small>

```text
login [--session] <username> <password>
```

| Argument | What it is |
| --- | --- |
| `<username>` | user to login: a username, or the e-mail address of an account. |
| `<password>` | password (optional, prompts if not provided) |

| Option | What it does |
| --- | --- |
| `--session` | login session not just shell. |

### `logout`

Log out of the current session.

<small>visitors too · changes things</small>

```text
logout [--session]
```

| Option | What it does |
| --- | --- |
| `--session` | logout session not just shell. |

### `ls`

List directory contents.

<small>reads only</small>

```text
ls [-l] [-a] [-A] [-r] [-L] [-C] [-1] [-h] [--limit=<string>] [--after=<string>] <path>...
```

| Argument | What it is |
| --- | --- |
| `<path>...` | paths to list, each under its own header when there are several. |

| Option | What it does |
| --- | --- |
| `-l` | use a long listing format. |
| `-a` | do not ignore entries starting with . |
| `-A` | do not ignore entries starting with . except for . and .. |
| `-r` | reverse order while sorting. |
| `-L` | do not follow symbolic links. |
| `-C` | include each entry's own child names (extra lookup, JSON output only) |
| `-1` | list one entry per line, also on a terminal. |
| `-h` | with -l, print file sizes in units of 1024 (e.g. 1.5 KB) |
| `--limit=<string>` | list one page of this many entries, in the store's name order. |
| `--after=<string>` | with --limit, the page after this name: the last one of the page before. |

```bash
ls -l /archive/albums/Exempelalbum_2019/files
ls /archive/people
ls -l --limit 200 --after IMG_0412.jpg /home/anna/staging/files/inbox
```

With `JSON_OUTPUT=1`: the directory's entries; for several paths, an object of each path's entries.

## M

### `members`

Who is in a container: an album's members by its rules, or a directory's media.

<small>reads only</small>

```text
members <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | The container. |

```bash
members /archive/albums/Exempelalbum_2019
members /archive/tags/segling
```

With `JSON_OUTPUT=1`: every member's path, node id and, for a member held by a link, the link; with a type's own command (members-<type>), also which member stands for a folded group.

### `metrics-sampler`

Sample host, storage and workload metrics into /logs/metrics (long-running)

<small>administrators only · changes things</small>

```text
metrics-sampler [--interval=<string>]
```

| Option | What it does |
| --- | --- |
| `--interval=<string>` | Seconds between ticks (default: shortest series cadence) |

### `mime`

Show stored, extension-based and content-sniffed mimetype of a node.

<small>reads only</small>

```text
mime <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

### `mkbuf`

Create a buffer node.

<small>changes things</small>

```text
mkbuf
```

```bash
mkbuf /tmp/exempelbuffert
```

With `JSON_OUTPUT=1`: nothing; the buffer node is created.

### `mkdir`

Create a directory node (-p to create parents)

<small>changes things</small>

```text
mkdir
```

```bash
mkdir -p /archive/albums/Nytt_Exempelalbum/files
```

With `JSON_OUTPUT=1`: nothing; the directory is created.

### `mkfile`

Create an empty text file node (what touch does elsewhere)

<small>changes things</small>

```text
mkfile <target>
```

| Argument | What it is |
| --- | --- |
| `<target>` | VFS path for the new file. |

```bash
mkfile /home/exempel/anteckning.txt
```

With `JSON_OUTPUT=1`: nothing; an empty text file node is created.

### `mklog`

Create a log node.

<small>changes things</small>

```text
mklog [--routing-keys=<string>] [--retention=<string>] <target>
```

| Argument | What it is |
| --- | --- |
| `<target>` | VFS path for the log node. |

| Option | What it does |
| --- | --- |
| `--routing-keys=<string>`, `-k` | Comma-separated routing keys to bind to. |
| `--retention=<string>`, `-r` | Retention policy (default: forever, e.g. 7 day, 100 entries) |

### `mknode`

Create new or ensure node.

<small>changes things</small>

```text
mknode [-p] [-t <string>] [--under=<string>] [--tier=<string>] [--as=<string>] [--an=<number>] [--aj=<string>] [--al=<string>] [-m <string>] [-o <string>] [-g <string>] <path>...
```

| Argument | What it is |
| --- | --- |
| `<path>...` | node path to create; repeatable. |

| Option | What it does |
| --- | --- |
| `-p` | if the path already exists, do nothing. |
| `-t <string>` | type of node to make, required. |
| `--under=<string>` | existing node the path must sit under; bounds what -p may create. |
| `--tier=<string>` | storage tier for a file's bytes: disk, volatile or db; fixed once created. |
| `--as=<string>` | set attribute as string. |
| `--an=<number>` | set attribute as number. |
| `--aj=<string>` | set attribute as JSON. |
| `--al=<string>` | set attribute as comma-separated list. |
| `-m <string>` | mode to set. |
| `-o <string>` | owner as uid or user name. |
| `-g <string>` | group as gid or group name. |

### `mkpool`

Create a pool node.

<small>changes things</small>

```text
mkpool [--aging-seconds=<string>] [--aging-boost=<string>] [--aging-max=<string>] [--lease-ms=<string>] [--max-attempts=<string>] <target>
```

| Argument | What it is |
| --- | --- |
| `<target>` | VFS path for the pool node. |

| Option | What it does |
| --- | --- |
| `--aging-seconds=<string>`, `-a` | Queue age per aging step (0 disables aging) |
| `--aging-boost=<string>`, `-b` | Effective-priority points per aging step. |
| `--aging-max=<string>`, `-m` | Total aging cap; keep below the gap between priority lanes. |
| `--lease-ms=<string>`, `-l` | Default lease duration in ms. |
| `--max-attempts=<string>`, `-n` | Default attempts before a job fails. |

### `mkqueue`

Create a queue node.

<small>changes things</small>

```text
mkqueue [--routing-keys=<string>] <target>
```

| Argument | What it is |
| --- | --- |
| `<target>` | VFS path for the queue node. |

| Option | What it does |
| --- | --- |
| `--routing-keys=<string>`, `-k` | Comma-separated routing keys to bind to. |

### `mkrouter`

Create a router node.

<small>changes things</small>

```text
mkrouter [--routing-key=<string>] <target>
```

| Argument | What it is |
| --- | --- |
| `<target>` | VFS path for the router node. |

| Option | What it does |
| --- | --- |
| `--routing-key=<string>`, `-k` | Routing key for fan-out broadcasting (required) |

### `mod`

Module management.

```text
mod <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `mod-cache`

Pre-fetch a module's TypeScript command dependencies.

<small>administrators only · changes things</small>

```text
mod-cache <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Module name (directory name under /modules) |

### `mod-info`

Show module information.

<small>reads only</small>

```text
mod-info <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Module name. |

### `mod-install`

Install modules from their repositories, or update them, with the dependencies they lack, and set them up.

<small>administrators only · changes things</small>

```text
mod-install [--force] [--missing] [--no-setup] <module>...
```

| Argument | What it is |
| --- | --- |
| `<module>...` | A published module by name (archive), or its repository (https://github.com/einhq/module-archive), either with @branch, @tag or @commit. |

| Option | What it does |
| --- | --- |
| `--force` | Fetch again what is installed at the same commit, and update even when an installed module does not accept the new version. |
| `--missing` | Install only modules not installed at all, leaving an installed one as it is without asking its forge. |
| `--no-setup` | Put the modules in place without setting them up or starting their services, as boot does before its own mod setup --all. |

### `mod-list`

List installed modules.

<small>reads only</small>

```text
mod-list [--long]
```

| Option | What it does |
| --- | --- |
| `--long` | Show detailed information. |

### `mod-remove`

Uninstall a module.

<small>administrators only · changes things</small>

```text
mod-remove [--force] <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Module name. |

| Option | What it does |
| --- | --- |
| `--force` | Skip confirmation prompt. |

### `mod-search`

The published modules: each module-* repository of the module sources (CFG_MODULE_SOURCES), with its version and whether it is installed.

<small>reads only</small>

```text
mod-search <words>...
```

| Argument | What it is |
| --- | --- |
| `<words>...` | Words the name or description must hold. |

### `mod-setup`

Set up a module already in the modules directory.

<small>administrators only · changes things</small>

```text
mod-setup <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Module name (directory name under /modules), or --all for every module in dependency order. |

### `mount`

Mount a filesystem.

<small>changes things</small>

```text
mount [--save] [-a] <path> <type> <options>
```

| Argument | What it is |
| --- | --- |
| `<path>` | mount point. |
| `<type>` | type: memory, pg, filesystem, command, sftp. |
| `<options>` | k=v,... — any: readonly, noaudit (paths, separated by `:`, whose writes the audit trail skips); sftp: host, port, user, path, key (identity file), hostkey (SHA256:… to pin), uid, gid. |

| Option | What it does |
| --- | --- |
| `--save` | also record the mount in /etc/fstab, so boot mounts it again. |
| `-a` | mount every /etc/fstab entry not mounted yet. |

```bash
mount
mount --save /mnt/nas sftp "host=nas.local,user=anna,path=/srv/photos"
mount /mnt/backup sftp "host=backup.example.com,port=2222,key=/home/admin/.ssh/backup,readonly"
mount -a
```

### `mv`

Move or rename files and directories, re-pointing the softlinks at each moved path or anywhere under it (and a relation link’s peerLink with them)

<small>changes things</small>

```text
mv [--no-clobber] [--no-relink] <source> <dest>
```

| Argument | What it is |
| --- | --- |
| `<source>` | the files or directories to move; several go into DEST, which must exist. |
| `<dest>` | destination: an existing node to move into, or the new path of a single source. |

| Option | What it does |
| --- | --- |
| `--no-clobber` | Do not overwrite an existing file - fails if destination already exists (-n) |
| `--no-relink` | Leave the softlinks that point at or under each moved source on its old path. |

```bash
mv /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg /archive/albums/Exempelalbum_2019/files/nytt_namn.jpg
mv /home/anna/staging/files/inbox/upload-2026-10-16 /home/anna/staging/files/scans/
```

With `JSON_OUTPUT=1`: in JSON mode, MvAnswer: how many sources moved, how many softlinks were re-pointed, and each source that did not move with why. Exits non-zero only when no source moved.

## N

### `news`

What has been added lately, newest first, from every news-* command on PATH.

<small>reads only</small>

```text
news [--limit=<number>]
```

| Option | What it does |
| --- | --- |
| `--limit=<number>` | entries returned, across all providers (default 8) |

```bash
news
news --limit 20
```

With `JSON_OUTPUT=1`: the newest entries of every news-* provider together: when, what, who did it, the node it is about, which provider, and the route that draws it.

### `nohup`

run a command detached, immune to shell hang-up, logging to /var/logs/jobs.

<small>changes things</small>

```text
nohup <command>
```

| Argument | What it is |
| --- | --- |
| `<command>` | the command (and args) to run detached. |

## O

### `onthisday`

What the archive has from a calendar day (MM-DD, default today) in earlier years, from every onthisday-* command on PATH.

<small>reads only</small>

```text
onthisday [--limit=<number>] <day>
```

| Argument | What it is |
| --- | --- |
| `<day>` | day as MM-DD (default today, UTC) |

| Option | What it does |
| --- | --- |
| `--limit=<number>` | entries returned across all providers (default 8) |

```bash
onthisday
onthisday 06-21 --limit 20
```

With `JSON_OUTPUT=1`: the entries of every onthisday-* provider, newest year first: the year, what, the node it is about, which provider, and the route that draws it.

## P

### `parse-search`

A search's words read as filters — subjects, an area, years, kinds — by the command CFG_SEARCH_PARSER names, or as words when it names none.

<small>reads only</small>

```text
parse-search [--rules] <words>...
```

| Argument | What it is |
| --- | --- |
| `<words>...` | What was typed into the search box. |

| Option | What it does |
| --- | --- |
| `--rules` | The parser's fast pass only, without its model. |

### `pipeline`

Manage pipelines.

```text
pipeline <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `pipeline-cancel`

Cancel a running pipeline.

<small>administrators only · changes things</small>

```text
pipeline-cancel <id>
```

| Argument | What it is |
| --- | --- |
| `<id>` | Instance ID. |

### `pipeline-define`

Register a pipeline definition from a YAML file.

<small>administrators only · changes things</small>

```text
pipeline-define <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Path to pipeline YAML file. |

### `pipeline-engine`

Run the pipeline engine (long-running)

<small>administrators only · changes things</small>

```text
pipeline-engine
```

### `pipeline-heal`

Rerun failed instances after a growing wait, and mark those that keep failing for a person.

<small>administrators only · reads only</small>

```text
pipeline-heal [--apply] [--now] [--limit=<number>]
```

| Option | What it does |
| --- | --- |
| `--apply` | Rerun and mark (default is a dry run) |
| `--now` | Skip the waits: the cause is known to have passed. |
| `--limit=<number>` | Failed instances to look at, oldest first (default 500) |

### `pipeline-instances`

List pipeline instances — running, failed or completed — newest first.

<small>reads only</small>

```text
pipeline-instances [-s <string>] [--limit=<string>] [--after=<string>] <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Pipeline name (optional, repeatable) |

| Option | What it does |
| --- | --- |
| `-s <string>` | Filter by status. |
| `--limit=<string>` | Page size (default 100) |
| `--after=<string>` | Keyset cursor from a previous page (<startedAt>:<id>) |

### `pipeline-list`

List pipeline definitions.

<small>reads only</small>

```text
pipeline-list
```

### `pipeline-overview`

Pipeline workload summary: instance counts (running, failed, completed), queue depths, active instances, completion rate.

<small>reads only</small>

```text
pipeline-overview
```

### `pipeline-prune`

Remove terminal pipeline instances (completed/failed/cancelled)

<small>administrators only · changes things</small>

```text
pipeline-prune [-s <string>] [--all] [--keep=<string>] [--max=<string>] [--older-than=<string>] [--budget=<string>] <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Pipeline name (optional; all if omitted) |

| Option | What it does |
| --- | --- |
| `-s <string>` | Only remove instances with this status. |
| `--all` | Remove all instances, including running (cancels first) |
| `--keep=<string>` | Retention cap: keep this many newest per pipeline, remove the rest. |
| `--max=<string>` | Stop after removing this many per pipeline (with --keep or --older-than) |
| `--older-than=<string>` | Retention by age: remove those completed longer ago than this, e.g. 30d. |
| `--budget=<string>` | Stop starting new pages after this long, e.g. 15m (with --keep or --older-than) |

### `pipeline-remove`

Remove pipeline instances (cancels running ones first)

<small>administrators only · changes things</small>

```text
pipeline-remove [-f] <id>
```

| Argument | What it is |
| --- | --- |
| `<id>` | Instance ID(s) |

| Option | What it does |
| --- | --- |
| `-f` | Ignore instances that are not found. |

### `pipeline-repair`

Return instances marked terminal while still holding unfinished steps to running.

<small>administrators only · reads only</small>

```text
pipeline-repair [--apply]
```

| Option | What it does |
| --- | --- |
| `--apply` | Perform the repair (default is a dry run) |

### `pipeline-rerun`

Rerun pipeline(s) from the current definition, replacing the old instance.

<small>administrators only · changes things</small>

```text
pipeline-rerun <id>
```

| Argument | What it is |
| --- | --- |
| `<id>` | Instance ID(s) |

### `pipeline-restart`

Restart a failed pipeline (re-queue failed steps)

<small>administrators only · changes things</small>

```text
pipeline-restart <id>
```

| Argument | What it is |
| --- | --- |
| `<id>` | Instance ID. |

### `pipeline-start`

Manually start a pipeline.

<small>administrators only · changes things</small>

```text
pipeline-start [--var=<string>] <name> <path>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Pipeline name. |
| `<path>` | Target path to process. |

| Option | What it does |
| --- | --- |
| `--var=<string>` | Override a declared variable for this run: NAME=VALUE (repeatable) |

### `pipeline-status`

Show pipeline instance status.

<small>reads only</small>

```text
pipeline-status <id>
```

| Argument | What it is |
| --- | --- |
| `<id>` | Instance ID. |

### `pipeline-step-restart`

Restart a single pipeline step.

<small>administrators only · changes things</small>

```text
pipeline-step-restart <id> <step>
```

| Argument | What it is |
| --- | --- |
| `<id>` | Instance ID. |
| `<step>` | Step name. |

### `pipeline-undefine`

Remove a pipeline definition, and cancel its running instances.

<small>administrators only · changes things</small>

```text
pipeline-undefine <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Pipeline name to undefine. |

### `pipeline-worker`

Run a pool worker (long-running)

<small>administrators only · changes things</small>

```text
pipeline-worker [--pool=<path>] [--capacity=<string>] [--kind=<string>] [--reserve-kind=<string>] [--reserve-capacity=<string>] [--kind-quantum=<number>] [--lease=<number>] [--concurrency=<number>]
```

| Option | What it does |
| --- | --- |
| `--pool=<path>` | Pool node path to claim from. |
| `--capacity=<string>` | Capacity offered to the pool, key=number (repeatable) |
| `--kind=<string>` | Only claim these job kinds (repeatable) |
| `--reserve-kind=<string>` | Prefer these kinds within reserved capacity (repeatable) |
| `--reserve-capacity=<string>` | Soft capacity reservation, key=number (repeatable) |
| `--kind-quantum=<number>` | Batch by kind: drain one kind for this many ms before rotating (default 0, off) |
| `--lease=<number>` | Lease duration in ms (default 60000) |
| `--concurrency=<number>` | Upper bound on concurrent jobs (default 1) |

### `pool`

Manage work pools.

```text
pool <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `pool-add`

Add a job to a pool.

<small>administrators only · changes things</small>

```text
pool-add [--kind=<string>] [--priority=<string>] [--requires=<string>] [--params=<string>] [--key=<string>] [--exclusive=<string>] [--attempts=<string>] [--delay=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Pool node path. |

| Option | What it does |
| --- | --- |
| `--kind=<string>` | Capability class the job needs (required) |
| `--priority=<string>` | Higher runs first (default 0) |
| `--requires=<string>` | Resource vector, key=number (repeatable or comma-separated) |
| `--params=<string>` | JSON payload handed to the worker. |
| `--key=<string>` | Dedup key; re-adding a live one updates it instead of duplicating. |
| `--exclusive=<string>` | Mutex class; one claimed job per class at a time. |
| `--attempts=<string>` | Attempts before the job fails. |
| `--delay=<string>` | Hold the job back this long (e.g. 30s, 5m) |

### `pool-cancel`

Cancel pending or claimed jobs.

<small>administrators only · changes things</small>

```text
pool-cancel [--job=<string>] [--key=<string>] [--prefix=<string>] [--kind=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Pool node path. |

| Option | What it does |
| --- | --- |
| `--job=<string>` | Cancel one job by id. |
| `--key=<string>` | Cancel the job with this dedup key. |
| `--prefix=<string>` | Cancel every job whose dedup key starts with this. |
| `--kind=<string>` | Cancel every job of this kind. |

### `pool-claim`

Claim the best matching job from a pool under a lease.

<small>administrators only · changes things</small>

```text
pool-claim [--owner=<string>] [--offer=<string>] [--kind=<string>] [--lease=<string>] [--wait] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Pool node path. |

| Option | What it does |
| --- | --- |
| `--owner=<string>` | Lease owner (default derives from the session) |
| `--offer=<string>` | Available capacity, key=number (repeatable or comma-separated) |
| `--kind=<string>` | Only consider these kinds (repeatable) |
| `--lease=<string>` | Lease duration (default 30s) |
| `--wait` | Block until a job is claimable. |

### `pool-list`

List jobs in a pool.

<small>reads only</small>

```text
pool-list [--state=<string>] [--kind=<string>] [--limit=<string>] [--after=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Pool node path. |

| Option | What it does |
| --- | --- |
| `--state=<string>` | Filter by state (comma-separated) |
| `--kind=<string>` | Filter by kind. |
| `--limit=<string>` | Page size (default 100) |
| `--after=<string>` | Keyset cursor from a previous page (job id) |

### `pool-purge`

Delete finished jobs so a pool does not grow without bound.

<small>administrators only · changes things</small>

```text
pool-purge [--state=<string>] [--older-than=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Pool node path. |

| Option | What it does |
| --- | --- |
| `--state=<string>` | States to drop (default done,failed,cancelled) |
| `--older-than=<string>` | Only drop jobs finished longer ago than this (e.g. 7d) |

### `pool-retry`

Return failed or cancelled jobs to the pool with a clean attempt count.

<small>administrators only · changes things</small>

```text
pool-retry [--job=<string>] [--key=<string>] [--prefix=<string>] [--kind=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Pool node path. |

| Option | What it does |
| --- | --- |
| `--job=<string>` | Retry one job by id. |
| `--key=<string>` | Retry the job with this dedup key. |
| `--prefix=<string>` | Retry every job whose dedup key starts with this. |
| `--kind=<string>` | Retry every job of this kind. |

### `pool-stat`

Show a pool backlog, job counts, policy and throughput per job kind; every pool without a path.

<small>reads only</small>

```text
pool-stat [<path>]
```

| Argument | What it is |
| --- | --- |
| `[<path>]` | Pool node path (default: every pool) |

### `pool-wake`

Try resting job kinds again now, every resting kind without a name.

<small>administrators only · changes things</small>

```text
pool-wake [<kind>...]
```

| Argument | What it is |
| --- | --- |
| `[<kind>...]` | Job kind to wake (repeatable) |

### `position-get`

Where nodes are: each path's name, type and the shape of its position (a location's, a picture's GPS)

<small>reads only</small>

```text
position-get <path>...
```

| Argument | What it is |
| --- | --- |
| `<path>...` | the nodes, or position nodes themselves. |

```bash
position-get /archive/locations/Exempelviken /archive/albums/Sommar/files/IMG_0001.jpg
```

With `JSON_OUTPUT=1`: nodes: one per path, in order — path, name, type and position (lat, lng, and radius or polygon) when it has one; error for a path that cannot be read.

### `position-set`

Set the shape of a position node (point, circle or polygon), making the node when it is missing.

<small>changes things</small>

```text
position-set [--lat=<string>] [--lng=<string>] [--radius=<string>] [--polygon=<string>] [--clear] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path of the position node, such as <location>/position. |

| Option | What it does |
| --- | --- |
| `--lat=<string>` | latitude of the center point. |
| `--lng=<string>` | longitude of the center point. |
| `--radius=<string>` | circle radius in meters. |
| `--polygon=<string>` | polygon ring as JSON: [{"lat":..,"lng":..},...]. |
| `--clear` | clear the stored shape. |

### `props`

Display node properties.

<small>reads only</small>

```text
props [-L] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |

### `ps`

List the commands running now: pid, user, shell, how long, and the command line. Admin sees everyone's, anyone else their own.

<small>reads only</small>

```text
ps [--user=<user>]
```

| Option | What it does |
| --- | --- |
| `--user=<user>` | Only this user's commands (-u) |

```bash
ps
ps --user anna
```

With `JSON_OUTPUT=1`: One row per running command, oldest first.

## Q

### `queue-dead`

List the entries a queue set aside after their delivery attempts, or retry or drop them.

<small>reads only</small>

```text
queue-dead [--retry] [--drop] [--id=<string>] [-n <string>] [--limit=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Queue node path. |

| Option | What it does |
| --- | --- |
| `--retry` | put them back in line with no attempts spent. |
| `--drop` | delete them. |
| `--id=<string>` | only this entry, with --retry or --drop (repeatable) |
| `-n <string>` | how many entries to list (default 10) |
| `--limit=<string>` | how many entries to list (default 10) |

```bash
queue-dead /var/queues/archive-bridge
queue-dead --retry /var/queues/archive-bridge
queue-dead --drop --id 42 /var/queues/archive-bridge
```

With `JSON_OUTPUT=1`: the dead-lettered entries: id, attempts, created, dead, routing key and data; in JSON mode { items }. With --retry or --drop, how many were settled; in JSON mode { ok, settled }.

### `queue-peek`

List the next entries of a queue without consuming them.

<small>reads only</small>

```text
queue-peek [-n <string>] [--limit=<string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | Queue node path. |

| Option | What it does |
| --- | --- |
| `-n <string>` | how many entries, from the front (default 10) |
| `--limit=<string>` | how many entries, from the front (default 10) |

```bash
queue-peek -n 20 /pipelines/queues/example
```

With `JSON_OUTPUT=1`: the next entries in delivery order: id, state (ready or in-flight), attempts, created, routing key and data; in JSON mode { items }.

## R

### `reach-check`

Check stored reach against a walk of each path, for a sample of nodes and every account.

<small>reads only</small>

```text
reach-check [--sample=<string>]
```

| Option | What it does |
| --- | --- |
| `--sample=<string>` | how many nodes to judge (default 2000) |

### `relate`

Create a bidirectional relation between two nodes.

<small>changes things</small>

```text
relate [--reverse=<string>] <a> <b> <label>
```

| Argument | What it is |
| --- | --- |
| `<a>` | first node. |
| `<b>` | second node. |
| `<label>` | relation label (both sides unless --reverse) |

| Option | What it does |
| --- | --- |
| `--reverse=<string>` | label for the b -> a side (default: same as label) |

### `relations-guard`

Remove reciprocal relation links when one side is deleted (long-running)

<small>administrators only · changes things</small>

```text
relations-guard
```

### `resolve-id`

Resolve node ID to path.

<small>reads only</small>

```text
resolve-id <id>
```

| Argument | What it is |
| --- | --- |
| `<id>` | id of node. |

### `rev`

Reverse lines character-wise.

<small>reads only</small>

```text
rev <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<FILE>...` | files to reverse, one after the other (stdin if omitted, or for -) |

### `rm`

Remove (delete) files or directories.

<small>changes things</small>

```text
rm [-r] [-f] [-d] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | node(s) to remove. |

| Option | What it does |
| --- | --- |
| `-r` | remove nodes and their contents recursively. |
| `-f` | ignore nonexistent nodes and arguments. |
| `-d` | remove empty directories (what rm without -r already does) |

```bash
rm /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
rm -r /archive/albums/Tomt_Exempelalbum
```

With `JSON_OUTPUT=1`: nothing.

### `rmdir`

Remove empty directories.

<small>changes things</small>

```text
rmdir [-p] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | empty directory node(s) to remove. |

| Option | What it does |
| --- | --- |
| `-p` | also remove each parent the path names, as each becomes empty. |

```bash
rmdir /home/exempel/tomt
rmdir -p /home/exempel/utkast/2019/juni
```

With `JSON_OUTPUT=1`: nothing.

## S

### `scp`

Copy files between EiN and another machine over SSH (members of group ssh)

<small>changes things</small>

```text
scp [-r] [-p] [-q] [-B] [-P <number>] [-i <path>] [-F <path>] [-o <string>] <source>... <target>
```

| Argument | What it is |
| --- | --- |
| `<source>...` | files to copy: EiN paths, or [user@]host:path. |
| `<target>` | where to: an EiN path, or [user@]host:path. |

| Option | What it does |
| --- | --- |
| `-r` | copy directories recursively. |
| `-p` | keep modes and modification times. |
| `-q` | no progress meter. |
| `-B` | batch mode: never ask for passwords or passphrases. |
| `-P <number>` | port (default 22) |
| `-i <path>` | identity file. |
| `-F <path>` | config file (default ~/.ssh/config; none: no file) |
| `-o <string>` | ssh option, e.g. StrictHostKeyChecking=accept-new. |

```bash
scp anna@nas.local:photos/sailboat.jpg "/archive/albums/Summer 2020/"
scp "anna@nas.local:photos/*.jpg" "/archive/albums/Summer 2020/"
scp -r "/archive/albums/Summer 2020" anna@nas.local:backup/
```

With `JSON_OUTPUT=1`: nothing; 1 when any file failed.

### `search`

Faceted search over content: text, time, region, kind, tags, subjects (people, locations, devices) and containers.

<small>reads only</small>

```text
search [-l <number>] [--limit=<number>] [--kind=<string>] [--tag=<string>] [--from=<string>] [--to=<string>] [--after=<string>] [--before=<string>] [--creator=<string>] [--subject=<string>] [--subject-name=<string>] [--under=<path>] [--include-stacked] [--within=<path>] [--undated] [--missing=<string>] [--like=<path>] [--bbox=<string>] [--circle=<string>] [--polygon=<string>] [--sort=<string>] [--at=<string>] [--facets] [--group-by=<string>] [--layout] [--cursor=<string>] [--above=<string>] [--max-scan=<number>] [--fields=<string>] <query>
```

| Argument | What it is |
| --- | --- |
| `<query>` | search query text (optional) |

| Option | What it does |
| --- | --- |
| `-l <number>` | page size (default 60, max 200) |
| `--limit=<number>` | page size (default 60, max 200) |
| `--kind=<string>` | content kind, comma-separated: photo, video, audio, document, or a node type (album, person, location, …) |
| `--tag=<string>` | filter by label (repeatable, intersected) |
| `--from=<string>` | taken at/after this date (2020, 2020-05, 2020-05-01) |
| `--to=<string>` | taken before this date, exclusive (--to 2000 includes all of 2000) |
| `--after=<string>` | alias for --from. |
| `--before=<string>` | alias for --to. |
| `--creator=<string>` | media created (uploaded or imported) by a user, by name or uid. |
| `--subject=<string>` | media a subject has, as <kind>:<slug or path> (person:anna-exempel, location:…, device:…) or a path; any kind a subject-<kind> command answers for (repeatable, intersected). For a town or country use --bbox from location-region. |
| `--subject-name=<string>` | media of any subject of a kind whose name matches, as <kind>:<words> (person:anna); repeatable groups intersect. |
| `--under=<path>` | media held by one album or directory (its own level; softlink members followed) |
| `--include-stacked` | with --under, include hidden stack members (internal aggregate mode) |
| `--within=<path>` | media anywhere in the tree under this directory, at any depth; by time, with the undated after the dated when there is no date window. Inside an unlisted tree (staging) it lists what the library's searches leave out. |
| `--undated` | only media with no capture time, in the order it arrived. |
| `--missing=<string>` | only what lacks this attr, dotted for a nested one (duplicate.deferred); repeatable, each must be missing. |
| `--like=<path>` | rank by how much each picture looks like this photo or video (more like this), or like a label's tag directory (/archive/tags/<label>, by its model), instead of by words; the other filters still narrow it. |
| `--bbox=<string>` | region as north,south,east,west. |
| `--circle=<string>` | region as lat,lng,radiusMeters. |
| `--polygon=<string>` | region as "lat,lng;lat,lng;lat,lng". |
| `--sort=<string>` | score \| time \| -time \| name (default: score with a query, name for timeless kinds, -time otherwise) |
| `--at=<string>` | start the page at this date (2020, 2020-05, 2020-05-01); needs a time sort. |
| `--facets` | answer with per-year, per-month, per-kind and per-label counts instead of results. |
| `--group-by=<string>` | answer with the groups holding the matches, counted and dated, instead of results: the nearest ancestors of these node types (album), or the subjects of these kinds the matches have (person: who is in them, and how many of them show someone nobody has named) |
| `--layout` | answer with one compact complete layout index for a container or a subject (JSON only) |
| `--cursor=<string>` | resume token from a previous page (a position, for --subject/--under) |
| `--above=<string>` | the page ending just above this resume token — walking up a time-ordered browse. |
| `--max-scan=<number>` | candidates to examine before giving up (default 5000); store-counted and materialized facets are exact regardless. |
| `--fields=<string>` | extra fields to include: description, channels (a text hit's rank in each channel that found it), derivatives (with --layout: whether each file has renditions yet) |

```bash
search segelbåt --kind photo
search --subject person:anna-exempel --subject person:bo-exempel --kind photo --sort -time
search --subject-name 'person:anna' --kind video
search --bbox=$(location-region Exempelstad --bbox-only) --from 2007 --to 2007
search --subject person:anna-exempel --group-by album
search --under /archive/albums/Exempelalbum --group-by person
search --like /archive/albums/Exempelalbum/files/IMG_0001.jpg --subject person:anna-exempel
search --within /home/anna/staging/files --sort time
search --within /home/anna/staging/files --undated --facets
search --within /home/anna/staging/files --missing duplicate.deferred
```

With `JSON_OUTPUT=1`: a page of matching media, each with its path, name and date; with --group-by the albums (or other containers) holding the matches, or the people in them, instead, counted and dated; with --facets per-year, per-kind and per-label counts.

### `sed`

Stream editor for filtering and transforming text.

<small>reads only</small>

```text
sed [-n] [-e <string>] [-E] [-r] <SCRIPT> <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<SCRIPT>` | sed script (e.g. s/foo/bar/g); omit when using -e. |
| `<FILE>...` | files to process (reads from stdin if omitted) |

| Option | What it does |
| --- | --- |
| `-n` | suppress automatic printing of pattern space. |
| `-e <string>` | add the script to the commands to be executed (repeatable) |
| `-E` | use extended regular expressions (patterns are JS regex) |
| `-r` | alias for -E. |

### `seq`

Print a sequence of numbers.

<small>reads only</small>

```text
seq [-s <string>] [-w] <LAST> <FIRST LAST> <FIRST INCREMENT LAST>
```

| Argument | What it is |
| --- | --- |
| `<LAST>` | print numbers from 1 to LAST. |
| `<FIRST LAST>` | print numbers from FIRST to LAST. |
| `<FIRST INCREMENT LAST>` | print numbers from FIRST to LAST with INCREMENT. |

| Option | What it does |
| --- | --- |
| `-s <string>` | use STRING to separate numbers (default: newline) |
| `-w` | equalize width by padding with leading zeroes. |

### `service`

Manage system services.

```text
service <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `service-add`

Add a service by linking to a service script directory.

<small>administrators only · changes things</small>

```text
service-add <name> <path>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |
| `<path>` | Path to service script directory (must contain start.sh) |

### `service-disable`

Disable a service.

<small>administrators only · changes things</small>

```text
service-disable <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-enable`

Enable a service.

<small>administrators only · changes things</small>

```text
service-enable <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-list`

List services, with how often each has restarted.

<small>reads only</small>

```text
service-list [--detail]
```

| Option | What it does |
| --- | --- |
| `--detail` | Also ask each running service for its own status line (its declared statusCommand) |

### `service-remove`

Remove a service.

<small>administrators only · changes things</small>

```text
service-remove <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-restart`

Restart a service.

<small>administrators only · changes things</small>

```text
service-restart <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-start`

Start a service.

<small>administrators only · changes things</small>

```text
service-start <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-start-all`

Start all enabled services.

<small>administrators only · changes things</small>

```text
service-start-all
```

### `service-status`

Show service status.

<small>reads only</small>

```text
service-status <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-stop`

Stop a service.

<small>administrators only · changes things</small>

```text
service-stop <name>
```

| Argument | What it is |
| --- | --- |
| `<name>` | Service name. |

### `service-stop-all`

Stop all running services.

<small>administrators only · changes things</small>

```text
service-stop-all
```

### `session-reap`

Remove session and tty nodes left behind by dead shells.

<small>administrators only · changes things</small>

```text
session-reap [--path=<string>] [--max=<string>] [--stale=<string>] [--dry-run]
```

| Option | What it does |
| --- | --- |
| `--path=<string>` | Sessions directory (default $SESSIONS_PATH) |
| `--max=<string>` | Stop after removing this many nodes (default 1000) |
| `--stale=<string>` | Age at which an unstamped session is collectable (default 24h) |
| `--dry-run` | Report what would be removed without removing it. |

### `share`

Show and set who has access to a node.

```text
share <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `share-info`

Show who has access to a node, and through what.

<small>reads only</small>

```text
share-info [-L] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |

### `share-link`

Make, list, change and turn off links that open a node without signing in.

<small>visitors too · reads only</small>

```text
share-link [--expires=<string>] [--never] [--session] <subcommand> <target>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | create \| list \| set \| remove \| open \| reap. |
| `<target>` | create and list: the node; set and remove: the link id; open: the token. |

| Option | What it does |
| --- | --- |
| `--expires=<string>` | create and set: when the link stops working, a date or epoch ms (default: 30 days) |
| `--never` | create and set: the link does not expire. |
| `--session` | open: act as the link in the whole session, not just this shell. |

```bash
share-link create /archive/albums/Exempelalbum
share-link list /archive/albums/Exempelalbum
share-link remove 0123456789abcdef
```

With `JSON_OUTPUT=1`: create: the link and how many nodes it reached (ShareLinkCreated); list: ShareLink[]; set: ShareLink; open: what it opens (ShareLinkOpened).

### `share-set`

Set who has access to nodes and everything below them.

<small>changes things</small>

```text
share-set [--mode=<string>] [--owner=<string>] [--group=<string>] [--default-owner] [--reference=<path>] [-m <string>] [-x <string>] [-b] [--drop-links] [--pin] [--unpin] [--no-recursive] [--strict] [-L] <path>...
```

| Argument | What it is |
| --- | --- |
| `<path>...` | paths to nodes. |

| Option | What it does |
| --- | --- |
| `--mode=<string>` | mode to set, octal or symbolic (e.g. 0750 or g+rx) |
| `--owner=<string>` | user to own the node, by name or uid (administrator only) |
| `--group=<string>` | group for the node, by name or gid (one the caller is in, unless administrator) |
| `--default-owner` | give the node the configured default owner and group (CFG_DEFAULT_SHARE_OWNER, CFG_DEFAULT_SHARE_GROUP) |
| `--reference=<path>` | share the node as this one is: its group, mode and acl (the owner stays) |
| `-m <string>` | add or modify an entry (u:<user>:<perms> or g:<group>:<perms>) |
| `-x <string>` | remove an entry (u:<user> or g:<group>) |
| `-b` | remove the user and group entries before applying -m (share links stay) |
| `--drop-links` | remove the share links' entries too, so no link opens the nodes. |
| `--pin` | hold this node against access changes made further up. |
| `--unpin` | let access changes from further up reach this node again. |
| `--no-recursive` | change only this node, not what is below it. |
| `--strict` | exit non-zero when any node below could not be changed. |
| `-L` | do not follow symbolic links. |

### `sleep`

Delay for a specified amount of time.

<small>reads only</small>

```text
sleep <seconds>
```

| Argument | What it is |
| --- | --- |
| `<seconds>` | number of seconds to sleep. |

### `sort`

Sort lines of text.

<small>reads only</small>

```text
sort [-r] [-n] [-u] [-k <string>] [-t <string>] <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<FILE>...` | files whose lines are sorted together (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-r` | reverse the result of comparisons. |
| `-n` | compare according to string numerical value. |
| `-u` | output only unique lines. |
| `-k <string>` | sort by a key field (e.g., -k2) |
| `-t <string>` | use SEP as field separator. |

### `ssh`

Log in to another machine or run a command there (members of group ssh)

<small>changes things</small>

```text
ssh [-p <number>] [-l <string>] [-i <path>] [-F <path>] [-o <string>] [-t] [-T] [-q] <destination> <command>...
```

| Argument | What it is |
| --- | --- |
| `<destination>` | [user@]host, or a Host from ~/.ssh/config. |
| `<command>...` | command to run there instead of a shell. |

| Option | What it does |
| --- | --- |
| `-p <number>` | port (default 22) |
| `-l <string>` | remote user (default: your EiN user) |
| `-i <path>` | identity file (default: ~/.ssh/id_ed25519, id_ecdsa, id_rsa) |
| `-F <path>` | config file (default ~/.ssh/config; none: no file) |
| `-o <string>` | HostName, Port, User, IdentityFile, StrictHostKeyChecking, BatchMode, ConnectTimeout, ServerAliveInterval, PasswordAuthentication; the same keywords are read from ~/.ssh/config. |
| `-t` | allocate a terminal for a command (-tt: even without one here) |
| `-T` | never allocate a terminal. |
| `-q` | quiet. |

```bash
ssh anna@nas.local
ssh -p 2222 backup.example.com
ssh nas.local 'df -h'
ssh -o StrictHostKeyChecking=accept-new anna@nas.local uptime
```

With `JSON_OUTPUT=1`: the remote exit status; 255 when the connection fails.

### `ssh-copy-id`

Install your public key in another machine's authorized_keys (members of group ssh)

<small>changes things</small>

```text
ssh-copy-id [-i <path>] [-p <number>] [-o <string>] [-f] [-n] <destination>
```

| Argument | What it is |
| --- | --- |
| `<destination>` | [user@]host. |

| Option | What it does |
| --- | --- |
| `-i <path>` | public key file (default: first of ~/.ssh/id_ed25519.pub, id_ecdsa.pub, id_rsa.pub) |
| `-p <number>` | port (default 22) |
| `-o <string>` | ssh option, e.g. StrictHostKeyChecking=accept-new. |
| `-f` | add the key even if it is already there. |
| `-n` | only show what would be added. |

```bash
ssh-copy-id anna@nas.local
ssh-copy-id -i ~/.ssh/id_rsa.pub -p 2222 anna@backup.example.com
```

With `JSON_OUTPUT=1`: nothing; JSON mode: { ok, added }.

### `ssh-keygen`

Make an SSH key pair in ~/.ssh, show a fingerprint (-l) or forget a host key (-R)

<small>changes things</small>

```text
ssh-keygen [-t <string>] [-b <number>] [-f <path>] [-C <string>] [-N <string>] [-q] [-l] [-y] [-R <string>]
```

| Option | What it does |
| --- | --- |
| `-t <string>` | key type: ed25519 (default), ecdsa, rsa. |
| `-b <number>` | bits: RSA 3072 (default) or more, ECDSA 256/384/521. |
| `-f <path>` | key file (default ~/.ssh/id_<type>) |
| `-C <string>` | comment (default <user>@ein) |
| `-N <string>` | passphrase; asked for when omitted at a terminal. |
| `-q` | quiet. |
| `-l` | show the key file's fingerprint instead. |
| `-y` | print the public key of a private key file. |
| `-R <string>` | remove a host ([host]:port off port 22) from known_hosts. |

```bash
ssh-keygen
ssh-keygen -t rsa -b 4096 -C "backup key"
ssh-keygen -l -f ~/.ssh/id_ed25519.pub
ssh-keygen -R nas.local
```

With `JSON_OUTPUT=1`: nothing; with -l the key size, fingerprint, comment and type.

### `ssh-server`

Start an SSH server.

<small>administrators only · changes things</small>

```text
ssh-server [--port=<string>]
```

| Option | What it does |
| --- | --- |
| `--port=<string>` | port to use. |

### `star`

Bookmark nodes as softlinks in $HOME/stars (star <path>..., star -d <path>..., star [list])

<small>reads only</small>

```text
star [-d] <path>...
```

| Argument | What it is |
| --- | --- |
| `<path>...` | nodes to star/unstar, or "list". |

| Option | What it does |
| --- | --- |
| `-d` | remove the star. |

### `stat`

Display file or node status.

<small>reads only</small>

```text
stat [-L] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to node. |

| Option | What it does |
| --- | --- |
| `-L` | do not follow symbolic links. |

```bash
stat /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: the node's type, size, mode, owner and times.

### `stats-overview`

Per-type archive growth: nodes and bytes added by year and month.

<small>reads only</small>

```text
stats-overview
```

### `system-info`

Which instance this is: host name, uptime, core's version and commit, the module API, each module's commit, and the PostgreSQL and Deno versions.

<small>reads only</small>

```text
system-info
```

## T

### `tail`

Output the last part of files, logs, or stdin (with -f to follow)

<small>reads only</small>

```text
tail [-n <string>] [-c <string>] [-f] [<path>]
```

| Argument | What it is |
| --- | --- |
| `[<path>]` | log/file/blob node to read (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-n <string>` | output the last NUM lines, or use +NUM for starting at line NUM (-NUM works too) |
| `-c <string>` | output the last NUM bytes, or use +NUM for starting at byte NUM. |
| `-f` | follow: keep the output live as the log/file grows. |

### `top`

Watch the system live: CPU graph, memory and event-loop lag, disks, pipeline work, running commands, sessions, services and recent problems. Keys: q quits, arrows scroll, s sorts, + and - change the interval, p pauses.

<small>reads only</small>

```text
top [-d <number>] [-n <number>]
```

| Option | What it does |
| --- | --- |
| `-d <number>` | Seconds between updates (default 2) |
| `-n <number>` | Write this many frames one after another and stop, as without a terminal. |

```bash
top
top -d 5
```

### `tr`

Translate or delete characters.

<small>reads only</small>

```text
tr [-d] [-s] [-c] <SET1> <SET2>
```

| Argument | What it is |
| --- | --- |
| `<SET1>` | set of characters to translate from. |
| `<SET2>` | set of characters to translate to. |

| Option | What it does |
| --- | --- |
| `-d` | delete characters in SET1. |
| `-s` | squeeze repeated characters in last operand. |
| `-c` | use complement of SET1. |

### `trash`

Move nodes into the reader's trash, alone or as one batch, list it, restore entries, or empty it.

<small>changes things</small>

```text
trash [--batch=<string>] [--label=<string>] [--limit=<number>] [--older-than=<number>] [--all] <subcommand> <items>...
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | put \| list \| restore \| empty. |
| `<items>...` | put: paths to trash, at most 2000; restore and empty: entry ids, batch ids, or <batch>/<entry> for one entry of a batch. |

| Option | What it does |
| --- | --- |
| `--batch=<string>` | put: into one batch, the one with this id or, with no id, a new one (at most 2000 entries) |
| `--label=<string>` | put: what the batch is called in the trash. |
| `--limit=<number>` | restore: at most this many entries of each batch named. |
| `--older-than=<number>` | empty: only entries trashed more than this many days ago. |
| `--all` | empty: every user's trash (administrators) |

```bash
trash put /archive/albums/Exempelalbum/files/IMG_0001.jpg
trash put --batch --label 'Copies of a sailboat' /archive/albums/Exempelalbum/files/IMG_0002.jpg /archive/albums/Exempelalbum/files/IMG_0003.jpg
trash list
trash restore 01J9Z8Q4R7XKD3V5B2N6M0PA1C --limit 500
trash empty --older-than 30
```

With `JSON_OUTPUT=1`: put: the entries made and their batch (TrashPutResult); list: TrashEntry[], a batch as one row; restore: where each went, and what is left of the batches named (TrashRestoreResult); empty: how many were removed.

### `truncate`

Truncate an associated resource of a node if it has one.

<small>changes things</small>

```text
truncate [-s <string>] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | path to truncate. |

| Option | What it does |
| --- | --- |
| `-s <string>` | size to truncate to (default: 0) |

## U

### `ui-build`

Bundle modules' pages into /var/cache/ui for the web UI to load, unless unchanged since the last build.

<small>changes things</small>

```text
ui-build [--all] <module>...
```

| Argument | What it is |
| --- | --- |
| `<module>...` | Module to build; repeatable. |

| Option | What it does |
| --- | --- |
| `--all` | Every installed module with pages, and forget the bundles of those gone. |

### `ui-icons`

Tabler icons by name, as SVG markup, for the web UI.

<small>reads only</small>

```text
ui-icons <name>...
```

| Argument | What it is |
| --- | --- |
| `<name>...` | Icon name: map-pin, heart-filled. |

### `ui-nav`

The web UI's sidebar, top bar and panels for the caller, from every module's entries and the administrator's and the user's changes.

<small>reads only</small>

```text
ui-nav
```

### `uniq`

Report or omit repeated lines.

<small>reads only</small>

```text
uniq [-c] [-d] [-u] [-i] [<INPUT>]
```

| Argument | What it is |
| --- | --- |
| `[<INPUT>]` | file to read (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-c` | prefix lines by the number of occurrences. |
| `-d` | only print duplicate lines. |
| `-u` | only print unique lines. |
| `-i` | ignore differences in case when comparing. |

### `unmount`

Unmount a filesystem.

<small>administrators only · changes things</small>

```text
unmount [--save] <path>
```

| Argument | What it is |
| --- | --- |
| `<path>` | mount point. |

| Option | What it does |
| --- | --- |
| `--save` | also remove the mount from /etc/fstab. |

### `unrelate`

Remove a bidirectional relation (both sides)

<small>changes things</small>

```text
unrelate <a> <b> <label>
```

| Argument | What it is |
| --- | --- |
| `<a>` | relation link path, or first node. |
| `<b>` | second node (with label) |
| `<label>` | relation label. |

### `unzip`

Expand a zip archive into a directory, streaming each entry. Refuses an archive with an entry that would land outside the directory, or whose files would not leave a tenth of their size free. A file already there at its entry’s size is left as it is, so a run that stopped can be run again.

<small>changes things</small>

```text
unzip [-d <path>] [-n] [-o] <archive>
```

| Argument | What it is |
| --- | --- |
| `<archive>` | the zip to expand. |

| Option | What it does |
| --- | --- |
| `-d <path>` | the directory to expand into, made if missing (default: the current one) |
| `-n` | never write over an existing file (the default) |
| `-o` | write over an existing file. |

```bash
unzip -d /home/anna/staging/files/inbox /home/anna/staging/files/inbox/takeout-001.zip
```

With `JSON_OUTPUT=1`: in JSON mode, UnzipAnswer: the files, directories and bytes written, the files left as they were, and each entry not expanded with why. Exits non-zero when any entry was not expanded.

### `user`

Manage users.

```text
user <subcommand>
```

| Argument | What it is |
| --- | --- |
| `<subcommand>` | Subcommand to run. |

### `user-create`

Create a user account and its home with its own group (an existing group of its name when that group's gid is free as a uid) and link it into its own and its other groups.

<small>administrators only · changes things</small>

```text
user-create [--uid=<string>] [--title=<string>] [--email=<string>] [--description=<string>] [--groups=<string>] <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | name of the user to create: lower-case letters, digits and . _ -, starting with a letter or _. |

| Option | What it does |
| --- | --- |
| `--uid=<string>` | numeric user ID. |
| `--title=<string>` | display title for the user. |
| `--email=<string>` | e-mail address, which signs in like the username; no other account may have it. |
| `--description=<string>` | description of the user. |
| `--groups=<string>` | comma-separated groups to add it to besides its own; empty for none (default CFG_DEFAULT_USER_GROUPS) |

### `user-delete`

Delete a user account, its home, its own group, and its open sessions; what it owned goes to another user.

<small>administrators only · changes things</small>

```text
user-delete [--to=<user>] [--force] <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to delete. |

| Option | What it does |
| --- | --- |
| `--to=<user>` | user that takes over the nodes it owned (default admin) |
| `--force` | force deletion even if errors occur. |

### `user-disable`

Disable a user account and end its open sessions.

<small>administrators only · changes things</small>

```text
user-disable <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to disable. |

### `user-elevate`

Make this sign-in an administrator's, for a member of the sudo group, after entering the password again.

<small>changes things</small>

```text
user-elevate [--password=<string>] [--session] [--off]
```

| Option | What it does |
| --- | --- |
| `--password=<string>` | your own password (prompts if not given); --password=<value> for one starting with a dash. |
| `--session` | the session's sign-in, every page and terminal of it, not just this shell's. |
| `--off` | make the sign-in no longer an administrator's. |

### `user-enable`

Enable a disabled user account.

<small>administrators only · changes things</small>

```text
user-enable <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to enable. |

### `user-exists`

Check if a user account exists.

<small>reads only</small>

```text
user-exists <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to check. |

### `user-groups`

List groups a user belongs to.

<small>reads only</small>

```text
user-groups <user>
```

| Argument | What it is |
| --- | --- |
| `<user>` | user to list groups for. |

### `user-id`

Print user and group IDs.

<small>reads only</small>

```text
user-id [--uid=<string>]
```

| Option | What it does |
| --- | --- |
| `--uid=<string>` | show identity for specified uid. |

### `user-info`

Display user account information.

<small>reads only</small>

```text
user-info <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to look up. |

### `user-list`

List the user accounts; as JSON with each one's primary group, e-mail address, description, person and built-in role, and for an administrator whether a password is set.

<small>reads only</small>

```text
user-list [--inactive] [--active]
```

| Option | What it does |
| --- | --- |
| `--inactive` | show only inactive users. |
| `--active` | show only active users. |

### `user-passwd`

Change user password.

<small>changes things</small>

```text
user-passwd [--username=<user>] [--old-password=<string>] [--new-password=<string>] <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to change password for. |

| Option | What it does |
| --- | --- |
| `--username=<user>` | username (alternative to positional) |
| `--old-password=<string>` | current password (required for non-admin) |
| `--new-password=<string>` | new password to set. |

### `user-resolve`

Resolve username to UID or vice versa.

<small>reads only</small>

```text
user-resolve <uid_or_username>
```

| Argument | What it is |
| --- | --- |
| `<uid_or_username>` | uid (numeric) or username to resolve. |

### `user-set-primary-group`

Set a user's primary group.

<small>administrators only · changes things</small>

```text
user-set-primary-group <user> <group>
```

| Argument | What it is |
| --- | --- |
| `<user>` | user to change primary group for. |
| `<group>` | new primary group. |

### `user-update`

Update an account's display name, description and (an administrator only) e-mail address; anyone may update their own name and description.

<small>changes things</small>

```text
user-update [--name=<string>] [--email=<string>] [--description=<string>] <username>
```

| Argument | What it is |
| --- | --- |
| `<username>` | username to update. |

| Option | What it does |
| --- | --- |
| `--name=<string>` | set display name. |
| `--email=<string>` | set the e-mail address, which signs in like the username; empty to remove it. |
| `--description=<string>` | set description. |

### `user-whoami`

Print the current username.

<small>visitors too · reads only</small>

```text
user-whoami
```

### `uuid`

Generate a random UUID.

<small>reads only</small>

```text
uuid
```

## W

### `wc`

Print newline, word, and byte counts of files or stdin.

<small>reads only</small>

```text
wc [-c] [-m] [-l] [-w] <FILE>...
```

| Argument | What it is |
| --- | --- |
| `<FILE>...` | files to count, each on a line of its own and then a total (stdin if omitted, or for -) |

| Option | What it does |
| --- | --- |
| `-c` | print the byte counts. |
| `-m` | print the character counts. |
| `-l` | print the newline counts. |
| `-w` | print the word counts. |

```bash
wc -l /archive/albums/Exempelalbum_2019/files/notes.txt
```

With `JSON_OUTPUT=1`: the counts asked for, then the file name; a total line when there are several files.

### `who`

List who is signed in: each SSH login, terminal and web UI connection, the address it connects from, its idle time and what it runs. Admin sees everyone's, anyone else their own.

<small>reads only</small>

```text
who
```

```bash
who
```

With `JSON_OUTPUT=1`: One row per open session, oldest first.

### `www`

Manage active web UI.

<small>reads only</small>

```text
www <command> [<name>]
```

| Argument | What it is |
| --- | --- |
| `<command>` | Command: list, active, set, reset. |
| `[<name>]` | UI name to set as default. |

## X

### `xargs`

Run a command with the items read from stdin as its arguments, as GNU xargs does: as many per run as fit, or -n per run, or one input line per run with -L, or once per line with -I replacing a string in the command. Items are separated by blanks and newlines, with quotes and backslashes as GNU has them; -0 and -d split on one character instead. The command reads an empty stdin; with no command it is echo. Exits 123 when a run failed, 124 when one exited 255, 125 when one was killed, 126 or 127 when one could not run.

<small>reads only</small>

```text
xargs [--null] [-0] [--delimiter=<string>] [-d <string>] [--max-args=<string>] [-n <string>] [--max-lines=<string>] [-L <string>] [--max-chars=<string>] [-s <string>] [--replace=<string>] [-I <string>] [--eof=<string>] [-E <string>] [--no-run-if-empty] [-r] [--verbose] [-t] [--arg-file=<path>] [-a <path>] <command>...
```

| Argument | What it is |
| --- | --- |
| `<command>...` | the command to run and its first arguments; the items follow them (default: echo) |

| Option | What it does |
| --- | --- |
| `--null` | items end with a NUL character, as find -print0 writes them; quotes are not special. |
| `-0` | items end with a NUL character, as find -print0 writes them; quotes are not special. |
| `--delimiter=<string>` | items end with this character, such as , or \n; quotes are not special. |
| `-d <string>` | items end with this character, such as , or \n; quotes are not special. |
| `--max-args=<string>` | at most this many items per run. |
| `-n <string>` | at most this many items per run. |
| `--max-lines=<string>` | at most this many input lines per run. |
| `-L <string>` | at most this many input lines per run. |
| `--max-chars=<string>` | at most this many characters per command line (default 131072) |
| `-s <string>` | at most this many characters per command line (default 131072) |
| `--replace=<string>` | run once per input line, with this string in the command replaced by the line, as -I {}. |
| `-I <string>` | run once per input line, with this string in the command replaced by the line, as -I {}. |
| `--eof=<string>` | an item equal to this ends the input. |
| `-E <string>` | an item equal to this ends the input. |
| `--no-run-if-empty` | run nothing when stdin is empty. |
| `-r` | run nothing when stdin is empty. |
| `--verbose` | write each command line to stderr before running it. |
| `-t` | write each command line to stderr before running it. |
| `--arg-file=<path>` | read the items from this file; the command then reads stdin. |
| `-a <path>` | read the items from this file; the command then reads stdin. |

```bash
find /home/anna/staging -name '*.tmp' -print0 | xargs -0 rm
ls /archive/people | xargs -I {} info /archive/people/{}
```

With `JSON_OUTPUT=1`: what the commands it runs write; xargs itself writes text only.
