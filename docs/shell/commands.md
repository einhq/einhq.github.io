# Commands by task

This page is for power users and administrators who know what they want to do and need the command for it. Each table row gives a task, a command line that does it, and a link to that command's full entry in the [reference](../reference/commands.md).

## How to read the tables

- Every command runs as you, with your permissions, in [the terminal](terminal.md) or over [SSH](ssh-sftp.md). The examples use the demo archive's invented Wrenfield family: the album `/archive/albums/christmas-2019`, the person `/archive/people/peggy-wrenfield`, the account `helen`. Albums and people come with the [Archive](../archive/index.md), so those paths are there once it is installed.
- _administrators only_ marks a command that anyone else is refused before it starts, with `<name>: permission denied: only an administrator may run it`. A member of the `sudo` group can type `admin` to act as the administrator in that terminal. [Accounts and groups](../admin/accounts.md) explains who that is.
- This page has core's commands. The modules' commands come with their [modules](../admin/modules.md), and their tasks are on [Archive commands by task](../archive/tasks.md) and [Assistant commands by task](../assistant/tasks.md); the [media service](../ems/index.md)'s are on its page. Without the module, the shell answers `error: command '<name>' not found`. `mod list` shows what is installed.
- A command of a family can be typed as two words: `mod install` is `mod-install`, and `pipeline status` is `pipeline-status`. The families are `config`, `docs`, `group`, `mod`, `pipeline`, `pool`, `service`, `share` and `user`, and with the archive also `person` and `device`. `<family> --help`, such as `mod --help`, lists its subcommands; typing `mod` alone answers `mod: missing subcommand`.
- `<command> --help` prints a command's arguments, options and examples without running it. `JSON_OUTPUT=1` in front of a command makes it answer in JSON; [The shell language](bash.md) covers that and the rest of the syntax.
- `cd`, `pwd`, `jobs`, `kill` and the other bash builtins have no reference entry. They are described in [The shell language](bash.md).

## Files and nodes

The tree works like a file system: paths start at `/`, `..` is the parent, and `cd` moves you around. Any node can have children, so `cd` into a photo works and `ls` shows what EiN learnt about it, such as `exif`, `position`, `thumbnails` and `regions`. [The tree](../concepts/tree.md) says what lives where.

| Task                                                  | Command                                                                   | Reference                                                                                                                            |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| See where you are, move around                        | `pwd`, `cd /archive/albums`, `cd -`                                       | [bash builtins](bash.md)                                                                                                             |
| List a folder, with details                           | `ls -l /archive/albums` (`ll` for `ls -al`)                               | [ls](../reference/commands-core.md#ls)                                                                                               |
| List one page of a large folder                       | `ls -l --limit 200 --after 20191224_141841.jpg .`                         | [ls](../reference/commands-core.md#ls)                                                                                               |
| Show a text file or a log                             | `cat notes.txt`, `cat -t /var/logs/system` (each entry's time first)      | [cat](../reference/commands-core.md#cat)                                                                                             |
| Look at a picture in the web terminal                 | `cat /archive/albums/christmas-2019/20191224_141841.jpg`                  | [cat](../reference/commands-core.md#cat)                                                                                             |
| The first or last lines of a file                     | `head -n 20 notes.txt`, `tail -n 50 notes.txt`                            | [head](../reference/commands-core.md#head), [tail](../reference/commands-core.md#tail)                                               |
| Edit a text file, or start one                        | `edit ~/notes.md`                                                         | [edit](../reference/commands-core.md#edit)                                                                                           |
| Make an empty text file (what `touch` does elsewhere) | `mkfile ~/todo.txt`                                                       | [mkfile](../reference/commands-core.md#mkfile)                                                                                       |
| Make a folder, with its parents                       | `mkdir -p ~/drafts/2026`                                                  | [mkdir](../reference/commands-core.md#mkdir)                                                                                         |
| Copy a file or a folder                               | `cp notes.txt notes-old.txt`, `cp -r ~/drafts ~/drafts-copy`              | [cp](../reference/commands-core.md#cp)                                                                                               |
| Move or rename                                        | `mv ~/drafts/letter.txt ~/letters/`                                       | [mv](../reference/commands-core.md#mv)                                                                                               |
| Move something to your trash                          | `trash put ~/drafts/old.txt`                                              | [trash](../reference/commands-core.md#trash)                                                                                         |
| See your trash, restore from it                       | `trash list`, `trash restore <id>`                                        | [trash](../reference/commands-core.md#trash)                                                                                         |
| Delete for good                                       | `rm ~/todo.txt`, `rm -r ~/drafts-copy`                                    | [rm](../reference/commands-core.md#rm)                                                                                               |
| Remove empty folders                                  | `rmdir ~/drafts/2026`                                                     | [rmdir](../reference/commands-core.md#rmdir)                                                                                         |
| Make a softlink to a node                             | `ln -s /archive/albums/christmas-2019 ~/christmas`                        | [ln](../reference/commands-core.md#ln)                                                                                               |
| A node's type, owner and times                        | `stat <path>`, `info <path>`, `props <path>`                              | [stat](../reference/commands-core.md#stat), [info](../reference/commands-core.md#info), [props](../reference/commands-core.md#props) |
| A node's attributes                                   | `attrs /archive/albums/christmas-2019`                                    | [attrs](../reference/commands-core.md#attrs)                                                                                         |
| The path of a node id                                 | `resolve-id <id>`                                                         | [resolve-id](../reference/commands-core.md#resolve-id)                                                                               |
| A file's type: stored, by name and by content         | `mime <file>`                                                             | [mime](../reference/commands-core.md#mime)                                                                                           |
| A file's bytes on disk, with its sha256               | `file-stat -f <file>`                                                     | [file-stat](../reference/commands-core.md#file-stat)                                                                                 |
| How much a folder holds                               | `du -sh /archive/albums/christmas-2019`, `du -chs *`                      | [du](../reference/commands-core.md#du)                                                                                               |
| Unpack a zip file                                     | `unzip -d ~/unpacked ~/takeout-001.zip`                                   | [unzip](../reference/commands-core.md#unzip)                                                                                         |
| Bookmark a node, list bookmarks                       | `star <path>`, `star -d <path>`, `star list`                              | [star](../reference/commands-core.md#star)                                                                                           |
| Label something, see labels                           | `label add <path> sailing`, `label remove <path> sailing`, `labels`       | [label](../reference/commands-core.md#label), [labels](../reference/commands-core.md#labels)                                         |
| Comment on a node                                     | `comment add <path> --body 'Taken at the cottage'`, `comment list <path>` | [comment](../reference/commands-core.md#comment)                                                                                     |

> [!WARNING]
> `rm` deletes for good: it does not use the trash. Without `-r` it refuses any node that has children, with `rm: cannot remove '<path>': Node not empty`, and a processed photo has children (its metadata, thumbnails and faces). Use `trash put` for anything you may want back. [Links](../concepts/links.md) explains what deleting and moving do to links.

## Search and find

`search` looks through what EiN knows about your content. It asks each installed module's search, so what it finds comes from the modules: with no module it finds nothing, and with the Archive the words, what the pictures show, the people in them, dates and places; [Archive commands by task](../archive/tasks.md#search-your-pictures) has those searches. `find` walks the tree by name and type, as GNU find does. [Search and the finder](../guide/search.md) covers searching in the web interface.

| Task                               | Command                                                     | Reference                                            |
| ---------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Search everything by words         | `search sailboat`                                           | [search](../reference/commands-core.md#search)       |
| Search everything below a folder   | `search --within ~/staging/files --undated`                 | [search](../reference/commands-core.md#search)       |
| Find nodes by name                 | `find /archive/albums -iname '*.heic' -type f`              | [find](../reference/commands-core.md#find)           |
| Find nodes by type                 | `find /archive/people -mindepth 1 -maxdepth 1 -type person` | [find](../reference/commands-core.md#find)           |
| Find large files                   | `find ~/staging -type f -size +10M -printf '%s %p\n'`       | [find](../reference/commands-core.md#find)           |
| Find what changed in the last hour | `find ~/staging -type f -mmin -60`                          | [find](../reference/commands-core.md#find)           |
| Find lines in text files           | `grep -n -i cottage ~/notes.md`                             | [grep](../reference/commands-core.md#grep)           |
| Find a command by what it does     | `docs find restart a service`                               | [docs-find](../reference/commands-core.md#docs-find) |

The node types `find -type` takes are listed in [Node types](../reference/node-types.md).

## Accounts, groups and sharing

[Accounts and groups](../admin/accounts.md) explains the built-in accounts and groups, and [Permissions in depth](../admin/permissions.md) the permission model these commands change.

### Accounts

| Task                                                    | Command                                                                     | Reference                                                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Who you are                                             | `whoami`, `id`                                                              | [user-whoami](../reference/commands-core.md#user-whoami), [user-id](../reference/commands-core.md#user-id)           |
| List the accounts                                       | `user-list`, `user-list --inactive`                                         | [user-list](../reference/commands-core.md#user-list)                                                                 |
| One account's details                                   | `user-info helen`                                                           | [user-info](../reference/commands-core.md#user-info)                                                                 |
| The groups an account is in                             | `user-groups helen`                                                         | [user-groups](../reference/commands-core.md#user-groups)                                                             |
| Change your own password                                | `user-passwd helen --old-password=<current>` (asks for the new one)         | [user-passwd](../reference/commands-core.md#user-passwd)                                                             |
| Change your display name or description                 | `user-update helen --name 'Helen Okafor'`                                   | [user-update](../reference/commands-core.md#user-update)                                                             |
| Create an account, _administrators only_                | `user-create anna --title 'Anna Andersson' --email anna@example.com`        | [user-create](../reference/commands-core.md#user-create)                                                             |
| Set someone's password                                  | `user-passwd anna` (asks `Password:`; others than your own: administrators) | [user-passwd](../reference/commands-core.md#user-passwd)                                                             |
| Stop or allow someone signing in, _administrators only_ | `user-disable anna`, `user-enable anna`                                     | [user-disable](../reference/commands-core.md#user-disable), [user-enable](../reference/commands-core.md#user-enable) |
| Delete an account, _administrators only_                | `user-delete anna --to helen`                                               | [user-delete](../reference/commands-core.md#user-delete)                                                             |
| Change someone's primary group, _administrators only_   | `user-set-primary-group anna family`                                        | [user-set-primary-group](../reference/commands-core.md#user-set-primary-group)                                       |
| Act as the administrator, as a member of `sudo`         | `admin` (this terminal), `user-elevate --session`, `admin --off`            | [admin](../reference/commands-core.md#admin), [user-elevate](../reference/commands-core.md#user-elevate)             |

A new account has no password and cannot sign in until one is set. `whoami` and `id` are aliases for `user whoami` and `user id`, set in `/etc/bashrc`.

### Groups

| Task                                               | Command                                        | Reference                                                                |
| -------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| List the groups and their members                  | `group-list --members`                         | [group-list](../reference/commands-core.md#group-list)                   |
| One group's details                                | `group-info family`                            | [group-info](../reference/commands-core.md#group-info)                   |
| Create a group, _administrators only_              | `group-create family --title 'Family'`         | [group-create](../reference/commands-core.md#group-create)               |
| Add someone to a group, _administrators only_      | `group-add-member family anna`                 | [group-add-member](../reference/commands-core.md#group-add-member)       |
| Take someone out of a group, _administrators only_ | `group-remove-member family anna`              | [group-remove-member](../reference/commands-core.md#group-remove-member) |
| List a group's members, _administrators only_      | `group-members family`                         | [group-members](../reference/commands-core.md#group-members)             |
| Rename a group's title, _administrators only_      | `group-update family --title 'The Wrenfields'` | [group-update](../reference/commands-core.md#group-update)               |
| Delete a group, _administrators only_              | `group-delete family --to users`               | [group-delete](../reference/commands-core.md#group-delete)               |

A change of groups applies the next time that person signs in. To let someone use `ssh` and `scp` from EiN, add them to the group `ssh`: see [Reaching other machines](remote.md).

### Permissions and sharing

| Task                                               | Command                                                    | Reference                                              |
| -------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Who has access to a node, and through what         | `share-info /archive/albums/christmas-2019`                | [share-info](../reference/commands-core.md#share-info) |
| Give a group access to an album and what is in it  | `share-set -m g:family:rx /archive/albums/christmas-2019`  | [share-set](../reference/commands-core.md#share-set)   |
| Set the mode of a node and everything below        | `share-set --mode 0750 /archive/albums/malpas-summer`      | [share-set](../reference/commands-core.md#share-set)   |
| Keep a node's own access when its folder changes   | `share-set --pin <path>`                                   | [share-set](../reference/commands-core.md#share-set)   |
| Make a link that opens an album without signing in | `share-link create /archive/albums/christmas-2019`         | [share-link](../reference/commands-core.md#share-link) |
| A link that does not expire                        | `share-link create --never /archive/albums/christmas-2019` | [share-link](../reference/commands-core.md#share-link) |
| List your links, turn one off                      | `share-link list`, `share-link remove <id>`                | [share-link](../reference/commands-core.md#share-link) |
| Change mode bits                                   | `chmod 750 <path>`, `chmod -r g+rx <path>`                 | [chmod](../reference/commands-core.md#chmod)           |
| Change owner or group                              | `chown helen:family <path>`, `chown :family <path>`        | [chown](../reference/commands-core.md#chown)           |
| Show a node's access list                          | `acl <path>`                                               | [acl](../reference/commands-core.md#acl)               |
| Add or remove an access list entry                 | `acl -m u:anna:rx <path>`, `acl -x u:anna <path>`          | [acl](../reference/commands-core.md#acl)               |

The recursive flag of `chmod`, `chown` and `acl` is a lower-case `-r`. A share link made with `share-link create` lasts 30 days unless you give `--expires` or `--never`. [Sharing](../guide/sharing.md) shows the Share dialog that does the same in the web interface.

## Settings and modules

[Configuration](../admin/configuration.md) explains where a setting's value comes from, and [Modules](../admin/modules.md) what installing a module does.

| Task                                                      | Command                                   | Reference                                                  |
| --------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| Every setting, with where its value comes from            | `config list`                             | [config-list](../reference/commands-core.md#config-list)   |
| Only your own settings                                    | `config list --scope user`                | [config-list](../reference/commands-core.md#config-list)   |
| One setting's value                                       | `config get CFG_TRASH_RETENTION_DAYS`     | [config-get](../reference/commands-core.md#config-get)     |
| Change one of your own settings                           | `config set CFG_USER_SLIDESHOW_SECONDS 5` | [config-set](../reference/commands-core.md#config-set)     |
| Change a system setting (administrators)                  | `config set CFG_TRASH_RETENTION_DAYS 60`  | [config-set](../reference/commands-core.md#config-set)     |
| Put a setting back to its default                         | `config unset CFG_TRASH_RETENTION_DAYS`   | [config-unset](../reference/commands-core.md#config-unset) |
| The installed modules                                     | `mod list`, `mod list --long`             | [mod-list](../reference/commands-core.md#mod-list)         |
| One module's details                                      | `mod info archive`                        | [mod-info](../reference/commands-core.md#mod-info)         |
| The published modules                                     | `mod search`                              | [mod-search](../reference/commands-core.md#mod-search)     |
| Install or update a module, _administrators only_         | `mod install assistant`                   | [mod-install](../reference/commands-core.md#mod-install)   |
| Remove a module, _administrators only_                    | `mod remove assistant`                    | [mod-remove](../reference/commands-core.md#mod-remove)     |
| Set up every module again, _administrators only_          | `mod setup --all`                         | [mod-setup](../reference/commands-core.md#mod-setup)       |
| Your sidebar and top bar, and what is wrong with an entry | `ui-nav`                                  | [ui-nav](../reference/commands-core.md#ui-nav)             |

`config set` restarts the services a setting names as reading it, if it names any, and says which. Every setting and its default is in [Settings](../reference/settings.md), for example [`CFG_TRASH_RETENTION_DAYS`](../reference/settings.md#cfg_trash_retention_days).

## The system

[Health and the dashboard](../admin/monitoring.md), [Processing and pipelines](../admin/processing.md) and [Services and logs](../admin/services-logs.md) explain what these commands report and what to do about it.

### Health and activity

| Task                                                           | Command                                    | Reference                                                      |
| -------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Is everything fine and keeping up                              | `health`                                   | [health](../reference/commands-core.md#health)                 |
| Watch the system live                                          | `top`, `top -d 5` (`q` quits)              | [top](../reference/commands-core.md#top)                       |
| Commands running, yours or everyone's (administrator)          | `ps`, `ps --user anna`                     | [ps](../reference/commands-core.md#ps)                         |
| Who is signed in, from where, doing what                       | `who`                                      | [who](../reference/commands-core.md#who)                       |
| Free space per storage tier, and when it fills                 | `df`                                       | [df](../reference/commands-core.md#df)                         |
| CPU, memory and lag over the last hours                        | `host-metrics`, `host-metrics --window 60` | [host-metrics](../reference/commands-core.md#host-metrics)     |
| Meters the services add, such as the graphics card's memory    | `gauges`                                   | [gauges](../reference/commands-core.md#gauges)                 |
| Versions of EiN, PostgreSQL and Deno, and each module's commit | `system-info`                              | [system-info](../reference/commands-core.md#system-info)       |
| How the archive grew, by type, year and month                  | `stats-overview`                           | [stats-overview](../reference/commands-core.md#stats-overview) |

`ps` and `who` show your own; an administrator sees everyone's.

### Jobs and processes

| Task                                                            | Command                              | Reference                                      |
| --------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| Run a command in the background                                 | `<command> &`                        | [bash builtins](bash.md)                       |
| Your shell's background jobs                                    | `jobs`                               | [bash builtins](bash.md)                       |
| Stop a command                                                  | `kill <pid>`, with the pid from `ps` | [bash builtins](bash.md)                       |
| Start a command that keeps running after you close the terminal | `nohup album-span --all --stale`     | [nohup](../reference/commands-core.md#nohup)   |
| Keep a running job going after you leave                        | `detach %1`                          | [detach](../reference/commands-core.md#detach) |
| List the detached jobs and how they ended                       | `detach --list`                      | [detach](../reference/commands-core.md#detach) |

A detached job writes its output to `/var/logs/jobs/<pid>/stdout.log` and `stderr.log`. In EiN a pid is a name, such as `sleep-` followed by a unique id, not a number. <kbd>Ctrl</kbd>+<kbd>Z</kbd> does not suspend a command; start it with `&` instead.

### Work, pipelines and services

| Task                                                                | Command                                                          | Reference                                                                                                                                                                                  |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| How much work is waiting, per kind, and how fast it goes            | `pool stat`                                                      | [pool-stat](../reference/commands-core.md#pool-stat)                                                                                                                                       |
| The jobs of a pool that failed                                      | `pool list /var/pools/media --state failed`                      | [pool-list](../reference/commands-core.md#pool-list)                                                                                                                                       |
| Try resting kinds of work again, _administrators only_              | `pool wake`                                                      | [pool-wake](../reference/commands-core.md#pool-wake)                                                                                                                                       |
| Return failed jobs of a kind to the pool, _administrators only_     | `pool retry /var/pools/media --kind faces`                       | [pool-retry](../reference/commands-core.md#pool-retry)                                                                                                                                     |
| Pipelines at a glance                                               | `pipeline overview`                                              | [pipeline-overview](../reference/commands-core.md#pipeline-overview)                                                                                                                       |
| The pipeline definitions                                            | `pipeline list`                                                  | [pipeline-list](../reference/commands-core.md#pipeline-list)                                                                                                                               |
| Failed pipeline runs, newest first                                  | `pipeline instances -s failed`                                   | [pipeline-instances](../reference/commands-core.md#pipeline-instances)                                                                                                                     |
| One run's steps and what each did                                   | `pipeline status <id>`                                           | [pipeline-status](../reference/commands-core.md#pipeline-status)                                                                                                                           |
| Run a failed run's failed steps again, _administrators only_        | `pipeline restart <id>`                                          | [pipeline-restart](../reference/commands-core.md#pipeline-restart)                                                                                                                         |
| Run a run again from the current definition, _administrators only_  | `pipeline rerun <id>`                                            | [pipeline-rerun](../reference/commands-core.md#pipeline-rerun)                                                                                                                             |
| Rerun failed work that waited long enough, _administrators only_    | `pipeline heal` (says what it would do), `pipeline heal --apply` | [pipeline-heal](../reference/commands-core.md#pipeline-heal)                                                                                                                               |
| Process one file with a pipeline, forcing it, _administrators only_ | `pipeline start media-transcribe <file> --var FORCE=-f`          | [pipeline-start](../reference/commands-core.md#pipeline-start)                                                                                                                             |
| The next entries of a queue, without taking them                    | `queue-peek /var/queues/archive-bridge`                          | [queue-peek](../reference/commands-core.md#queue-peek)                                                                                                                                     |
| Entries a queue set aside after failing                             | `queue-dead /var/queues/archive-bridge`                          | [queue-dead](../reference/commands-core.md#queue-dead)                                                                                                                                     |
| The services and how often each restarted                           | `service list`, `service list --detail`                          | [service-list](../reference/commands-core.md#service-list)                                                                                                                                 |
| One service's state and where its log is                            | `service status cpu`                                             | [service-status](../reference/commands-core.md#service-status)                                                                                                                             |
| Restart, stop or start a service, _administrators only_             | `service restart cpu`, `service stop cpu`, `service start cpu`   | [service-restart](../reference/commands-core.md#service-restart), [service-stop](../reference/commands-core.md#service-stop), [service-start](../reference/commands-core.md#service-start) |

> [!WARNING]
> `cat` on a queue takes the entries it prints out of the queue. Use `queue-peek` to look.

### Logs and the audit trail

There is no `logs` command. The system log and each service's output are log nodes, read with `dmesg`, `tail` and `cat`.

| Task                                                      | Command                                                                 | Reference                                    |
| --------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| The system log                                            | `dmesg -n 50`                                                           | [dmesg](../reference/commands-core.md#dmesg) |
| The last ten problems                                     | `dmesg --level warn -n 10`                                              | [dmesg](../reference/commands-core.md#dmesg) |
| Follow the system log as it grows                         | `tail -f /var/logs/system`                                              | [tail](../reference/commands-core.md#tail)   |
| A service's own output                                    | `tail -f /var/logs/services/cpu/stdout.log`, and `stderr.log` beside it | [tail](../reference/commands-core.md#tail)   |
| Who changed, moved or removed what, _administrators only_ | `audit --user anna --since 2026-10-01 /archive/albums`                  | [audit](../reference/commands-core.md#audit) |

The system log starts empty at every start of EiN, and a service's two log files start empty at every start of that service.

## Other machines

`ssh`, `scp` and `ssh-copy-id` are for administrators and members of the group `ssh`. [Reaching other machines](remote.md) covers them, with the host key prompts and `~/.ssh/config`.

| Task                                                | Command                                                                  | Reference                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| Make a key pair in `~/.ssh`                         | `ssh-keygen`                                                             | [ssh-keygen](../reference/commands-core.md#ssh-keygen)   |
| Put your public key on another machine              | `ssh-copy-id anna@nas.local`                                             | [ssh-copy-id](../reference/commands-core.md#ssh-copy-id) |
| Log in to another machine, or run one command there | `ssh anna@nas.local`, `ssh nas.local 'df -h'`                            | [ssh](../reference/commands-core.md#ssh)                 |
| Copy files in from another machine                  | `scp -r anna@nas.local:photos/1968 /home/anna/staging/files/inbox/`      | [scp](../reference/commands-core.md#scp)                 |
| List what is mounted                                | `mount`                                                                  | [mount](../reference/commands-core.md#mount)             |
| Mount a folder of another machine (administrators)  | `mount --save /mnt/nas sftp "host=nas.local,user=anna,path=/srv/photos"` | [mount](../reference/commands-core.md#mount)             |

Connecting to EiN from your own computer is described in [SSH and SFTP](ssh-sftp.md).

## Text and data tools

These work on text files, logs and the output of other commands, as their GNU namesakes do. Run `<command> --help` for the options each has.

| Task                                 | Command                                                     | Reference                                                                                                                                              |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pick fields from JSON                | `JSON_OUTPUT=1 ls -l /archive/albums \| jq -r '.[].name'`   | [jq](../reference/commands-core.md#jq)                                                                                                                 |
| Find lines matching a pattern        | `grep -i -c christmas ~/notes.md`                           | [grep](../reference/commands-core.md#grep)                                                                                                             |
| Replace text in a stream             | `sed 's/Wrenfeld/Wrenfield/g' ~/notes.md`                   | [sed](../reference/commands-core.md#sed)                                                                                                               |
| Work with columns                    | `awk -F'\t' '{ print $1 }'`, `cut -f1`                      | [awk](../reference/commands-core.md#awk), [cut](../reference/commands-core.md#cut)                                                                     |
| Sort, count and remove repeats       | `sort`, `uniq -c`, `wc -l`                                  | [sort](../reference/commands-core.md#sort), [uniq](../reference/commands-core.md#uniq), [wc](../reference/commands-core.md#wc)                         |
| Run a command for each line of input | `ls /archive/people \| xargs -I {} info /archive/people/{}` | [xargs](../reference/commands-core.md#xargs)                                                                                                           |
| Change or delete characters          | `tr 'a-z' 'A-Z'`                                            | [tr](../reference/commands-core.md#tr)                                                                                                                 |
| Dates, numbers, waiting              | `date -I`, `seq 1 10`, `sleep 5`                            | [date](../reference/commands-core.md#date), [seq](../reference/commands-core.md#seq), [sleep](../reference/commands-core.md#sleep)                     |
| Parts of a path                      | `basename <path>`, `dirname <path>`, `abspath <path>`       | [basename](../reference/commands-core.md#basename), [dirname](../reference/commands-core.md#dirname), [abspath](../reference/commands-core.md#abspath) |
| The environment of your shell        | `env`, `docs env`                                           | [env](../reference/commands-core.md#env), [docs-env](../reference/commands-core.md#docs-env)                                                           |

## Unix commands EiN does not have

EiN's commands are its own, so some familiar names are missing. Use these instead.

| You may type                                  | Use instead                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `touch`                                       | `mkfile`                                                                                     |
| `vi`, `nano`                                  | `edit`                                                                                       |
| `less`, `more`, `man`                         | the terminal's scrollback, `<command> --help`, and the [reference](../reference/commands.md) |
| `realpath`                                    | `abspath`                                                                                    |
| `which`                                       | `type <name>` or `command -v <name>`                                                         |
| `passwd`, `useradd`, `usermod`                | `user-passwd`, `user-create`, `user-update`; for groups, `group-add-member`                  |
| `chgrp`                                       | `chown :<group> <path>`                                                                      |
| `sudo`, `su`                                  | `admin` or `user-elevate`, for members of `sudo`                                             |
| `getfacl`, `setfacl`                          | `acl`                                                                                        |
| `tar`, `rsync`, `curl`, `wget`, `diff`, `tee` | none in EiN; `unzip` unpacks zip files, and `scp` copies over SSH                            |

There is also no `sh` or `bash` command: a script is run by its path, or with `source`. [The shell language](bash.md) explains scripts.

## When a command is refused or missing

| What you see                                                     | Why                                                                                          | What to do                                                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `error: command '<name>' not found`                              | No command of that name is on your `PATH`: a typing error, or a module that is not installed | Check the name with `docs find <words>`; see `mod list`                      |
| `<name>: permission denied: only an administrator may run it`    | The command is for administrators                                                            | Ask an administrator, or type `admin` if you are in the `sudo` group         |
| `<name>: permission denied, you must be a member of group 'ssh'` | `ssh`, `scp` and `ssh-copy-id` need the `ssh` group                                          | An administrator adds you with `group-add-member ssh <you>`; sign in again   |
| `<name>: sign in first`                                          | You are not signed in, and visitors may not browse                                           | `login <username>`                                                           |
| `rm: cannot remove '<path>': Node not empty`                     | The node has children                                                                        | `rm -r <path>` deletes it with them; `trash put <path>` keeps it recoverable |
| `edit: not a terminal`                                           | `edit` needs a terminal, which `ssh host 'command'` does not give                            | Log in with `ssh` first, or use the terminal panel                           |
| `<name>: no terminal to answer on; add --force`                  | The command would ask a question, and `ssh host 'command'` or a script has no one to answer  | Give the answer as the option it names, or run it in the terminal panel      |
| `mount: permission denied, only admin is allowed to mount`       | Mounting is for administrators                                                               | Ask an administrator                                                         |

For anything else, [Troubleshooting](../admin/troubleshooting.md) goes through problems by area, and the [reference](../reference/commands.md) has every command with all its options.
