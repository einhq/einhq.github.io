# Commands by task

This page is for power users and administrators who know what they want to do and need the command for it. Each table row gives a task, a command line that does it, and a link to that command's full entry in the [reference](../reference/commands.md).

## How to read the tables

- Every command runs as you, with your permissions, in [the terminal](terminal.md) or over [SSH](ssh-sftp.md). The examples use the demo archive's invented Wrenfield family: the album `/archive/albums/christmas-2019`, the person `/archive/people/Peggy_Wrenfield`, the account `helen`.
- _administrators only_ marks a command that anyone else is refused before it starts, with `<name>: permission denied: only an administrator may run it`. A member of the `sudo` group can type `admin` to act as the administrator in that terminal. [Accounts and groups](../admin/accounts.md) explains who that is.
- The archive, assistant and media service commands come with their [modules](../admin/modules.md). Without the module, the shell answers `error: command '<name>' not found`. `mod list` shows what is installed.
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

`search` looks through what EiN knows about your content: the words, what the pictures show, the people in them, dates and places. `find` walks the tree by name and type, as GNU find does. [Search and the finder](../guide/search.md) covers searching in the web interface.

| Task                                   | Command                                                                 | Reference                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Search everything by words             | `search sailboat`                                                       | [search](../reference/commands-core.md#search)                                                            |
| Only photos, or videos                 | `search sailboat --kind photo`, `--kind video,audio`                    | [search](../reference/commands-core.md#search)                                                            |
| Find albums, people or places by name  | `search christmas --kind album`, `search peggy --kind person`           | [search](../reference/commands-core.md#search)                                                            |
| Pictures of a person                   | `search --subject person:Peggy_Wrenfield --kind photo`                  | [search](../reference/commands-core.md#search)                                                            |
| Pictures of two people together        | `search --subject person:Peggy_Wrenfield --subject person:Helen_Okafor` | [search](../reference/commands-core.md#search)                                                            |
| Pictures taken in a period             | `search --from 1968 --to 1970 --kind photo`                             | [search](../reference/commands-core.md#search)                                                            |
| Pictures from a town or an area        | `search --bbox=$(location-region Truro --bbox-only)`                    | [search](../reference/commands-core.md#search), [location-region](../archive/commands.md#location-region) |
| Pictures with a label                  | `search --tag sailing`, or `members /archive/tags/sailing`              | [search](../reference/commands-core.md#search), [members](../reference/commands-core.md#members)          |
| Pictures that look like one picture    | `search --like /archive/albums/christmas-2019/20191224_141841.jpg`      | [search](../reference/commands-core.md#search)                                                            |
| Search inside one album                | `search --under /archive/albums/christmas-2019 tree`                    | [search](../reference/commands-core.md#search)                                                            |
| Search everything below a folder       | `search --within ~/staging/files --undated`                             | [search](../reference/commands-core.md#search)                                                            |
| Which albums hold the matches          | `search --subject person:Peggy_Wrenfield --group-by album`              | [search](../reference/commands-core.md#search)                                                            |
| Count matches per year, month and kind | `search --subject person:Peggy_Wrenfield --facets`                      | [search](../reference/commands-core.md#search)                                                            |
| Find nodes by name                     | `find /archive/albums -iname '*.heic' -type f`                          | [find](../reference/commands-core.md#find)                                                                |
| Find nodes by type                     | `find /archive/people -mindepth 1 -maxdepth 1 -type person`             | [find](../reference/commands-core.md#find)                                                                |
| Find large files                       | `find ~/staging -type f -size +10M -printf '%s %p\n'`                   | [find](../reference/commands-core.md#find)                                                                |
| Find what changed in the last hour     | `find ~/staging -type f -mmin -60`                                      | [find](../reference/commands-core.md#find)                                                                |
| Find lines in text files               | `grep -n -i cottage ~/notes.md`                                         | [grep](../reference/commands-core.md#grep)                                                                |
| Find a command by what it does         | `docs find restart a service`                                           | [docs-find](../reference/commands-core.md#docs-find)                                                      |

The node types `find -type` takes are listed in [Node types](../reference/node-types.md).

## The archive

These commands come with the archive module. EiN runs most of the analysis by itself after an upload; the commands here are for looking things up, changing them by hand, and doing one thing again. [Albums](../archive/albums.md), [People and faces](../archive/people.md) and the other guide pages show the same tasks in the web interface.

### Albums

| Task                                              | Command                                                                                      | Reference                                             |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| List the albums                                   | `album list /archive/albums`                                                                 | [album](../archive/commands.md#album)                 |
| An album's name, description, cover and size      | `album info /archive/albums/christmas-2019`                                                  | [album](../archive/commands.md#album)                 |
| Make an album                                     | `album create /archive/albums/malpas-summer --name 'Summer at Malpas'`                       | [album](../archive/commands.md#album)                 |
| Make a private album                              | `album create /archive/albums/malpas-summer --name 'Summer at Malpas' --share private`       | [album](../archive/commands.md#album)                 |
| Put pictures in an album                          | `album add /archive/albums/malpas-summer <file>...`                                          | [album](../archive/commands.md#album)                 |
| Rename an album, describe it                      | `album set /archive/albums/christmas-2019 name 'Christmas 2019'`, `... description '<text>'` | [album](../archive/commands.md#album)                 |
| Choose an album's cover                           | `album set /archive/albums/christmas-2019 cover <file>`                                      | [album](../archive/commands.md#album)                 |
| Widen an album's span by hand                     | `album set /archive/albums/christmas-2019 spanStart 2019-12-20`                              | [album](../archive/commands.md#album)                 |
| Link albums as a series                           | `album set /archive/albums/christmas-2019 next /archive/albums/lockdown-2020`                | [album](../archive/commands.md#album)                 |
| List an album's pictures                          | `members-album /archive/albums/christmas-2019`                                               | [members-album](../archive/commands.md#members-album) |
| Who and what an album's pictures show             | `subjects-in /archive/albums/christmas-2019`                                                 | [subjects-in](../archive/commands.md#subjects-in)     |
| One album at random                               | `album-random`                                                                               | [album-random](../archive/commands.md#album-random)   |
| Give albums without a cover one of their pictures | `album-cover --all`                                                                          | [album-cover](../archive/commands.md#album-cover)     |
| Write an album's span again                       | `album-span /archive/albums/christmas-2019`, `album-span --all --stale`                      | [album-span](../archive/commands.md#album-span)       |
| Find stacks of similar photos taken in a row      | `album-stack refresh /archive/albums/christmas-2019 --dry-run --verbose`                     | [album-stack](../archive/commands.md#album-stack)     |

### Pictures, videos and recordings

| Task                                          | Command                                                            | Reference                                                               |
| --------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Everything about one file                     | `media-details /archive/albums/christmas-2019/20191224_141841.jpg` | [media-details](../archive/commands.md#media-details)                   |
| Its metadata as exiftool reads it             | `exiftool <file>`                                                  | [exiftool](../archive/commands.md#exiftool)                             |
| Set when it was taken, as vaguely as you know | `file-set-time <file> 1968-07 --note 'Postmark on the back'`       | [file-set-time](../archive/commands.md#file-set-time)                   |
| Undo a date set by hand                       | `file-set-time --clear <file>`                                     | [file-set-time](../archive/commands.md#file-set-time)                   |
| Set where it was taken                        | `file-set-position <file> --lat=50.2632 --lng=-5.0510`             | [file-set-position](../archive/commands.md#file-set-position)           |
| Rotate or mirror it for good                  | `file-set-orientation --rotate cw <file>`                          | [file-set-orientation](../archive/commands.md#file-set-orientation)     |
| Write its description                         | `file-set-description --text 'Christmas morning' <file>`           | [file-set-description](../archive/commands.md#file-set-description)     |
| Correct the text read from it                 | `file-set-text <file> --text 'Dear Peggy'`                         | [file-set-text](../archive/commands.md#file-set-text)                   |
| Read its text again in another language       | `file-set-text-language <file> en`                                 | [file-set-text-language](../archive/commands.md#file-set-text-language) |
| Say who took it                               | `file-set-photographer <file> /archive/people/Helen_Okafor`        | [file-set-photographer](../archive/commands.md#file-set-photographer)   |
| The latest pictures taken                     | `latest 20`                                                        | [latest](../archive/commands.md#latest)                                 |

A value that starts with a minus goes after an equals sign, as in `--lng=-5.0510`; on its own it would be read as another option. Only `file-set-time` can give a picture a vague date such as `1968` or `1968-07`; the web interface's dialog sets full dates. [Dates and places of pictures](../archive/dates-places.md) explains which date a picture gets.

To have EiN look at one file again, run the step with `-f`:

| Task                                            | Command                               | Reference                                                 |
| ----------------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| Read the text in a picture again                | `read-text -f <file>`                 | [read-text](../archive/commands.md#read-text)             |
| Find the faces again (boxes drawn by hand stay) | `detect-faces -f <file>`              | [detect-faces](../archive/commands.md#detect-faces)       |
| Transcribe a recording or video again           | `transcribe-file -f <file>`           | [transcribe-file](../archive/commands.md#transcribe-file) |
| Make thumbnails and renditions again            | `regenerate --force <file or folder>` | [regenerate](../archive/commands.md#regenerate)           |

All four ask the [media service](../ems/index.md), so they need it running. For many files at once, an administrator starts the pipelines instead: see [Processing and pipelines](../admin/processing.md).

### People

| Task                                     | Command                                                                                | Reference                                                       |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| List the named people                    | `person-list --sort count`                                                             | [person-list](../archive/commands.md#person-list)               |
| A person's details, relations and events | `person-info /archive/people/Peggy_Wrenfield`                                          | [person-info](../archive/commands.md#person-info)               |
| Add a person                             | `person-create /archive/people/Ada_Wrenfield --name 'Ada Wrenfield' --born 2026-03-02` | [person-create](../archive/commands.md#person-create)           |
| Change names, dates and details          | `person-update /archive/people/Peggy_Wrenfield --born 1934-08-22`                      | [person-update](../archive/commands.md#person-update)           |
| People found in pictures but not named   | `person-unknown --limit 20`                                                            | [person-unknown](../archive/commands.md#person-unknown)         |
| Name one of them                         | `person-name --name 'Mabel Cole' /archive/people/unknown/<id>`                         | [person-name](../archive/commands.md#person-name)               |
| Merge two people who are one             | `person-merge /archive/people/unknown/<id> /archive/people/Ruby_Wrenfield`             | [person-merge](../archive/commands.md#person-merge)             |
| Every face of a person                   | `person-faces --sort date /archive/people/Peggy_Wrenfield`                             | [person-faces](../archive/commands.md#person-faces)             |
| Take a wrong face off a person           | `person-detach --rematch <file>/regions/face-1`                                        | [person-detach](../archive/commands.md#person-detach)           |
| Add a parent                             | `person-set-parent <child> <parent>`, `--kind adoptive`                                | [person-set-parent](../archive/commands.md#person-set-parent)   |
| Add a partner                            | `person-set-partner --kind married --from 1956-06-02 <a> <b>`                          | [person-set-partner](../archive/commands.md#person-set-partner) |
| Remove a relation between two people     | `person-remove <a> <b>`                                                                | [person-remove](../archive/commands.md#person-remove)           |
| Add an event to a person                 | `person-add-event --type death --date 2021-01-17 /archive/people/Peggy_Wrenfield`      | [person-add-event](../archive/commands.md#person-add-event)     |
| Record where someone lived               | `person-set-home --from 1956 --to 1999 <person> /archive/locations/Highbury`           | [person-set-home](../archive/commands.md#person-set-home)       |
| How two people are related               | `person-how-related /archive/people/Ruby_Wrenfield /archive/people/Peggy_Wrenfield`    | [person-how-related](../archive/commands.md#person-how-related) |
| Who a kin word reaches                   | `person-relatives Peggy_Wrenfield --relation daughter`                                 | [person-relatives](../archive/commands.md#person-relatives)     |
| Ancestors and descendants                | `person-family-tree --up 2 --down 2 /archive/people/Helen_Okafor`                      | [person-family-tree](../archive/commands.md#person-family-tree) |
| A person's life in order                 | `person-timeline /archive/people/Peggy_Wrenfield`                                      | [person-timeline](../archive/commands.md#person-timeline)       |

The family relations, events and homes are explained in [Family tree, events and homes](../archive/family.md).

### Locations, devices and tracks

| Task                                        | Command                                                                                         | Reference                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| List the locations                          | `location-list`                                                                                 | [location-list](../archive/commands.md#location-list)         |
| Change a location's name or description     | `location-update /archive/locations/Highbury --description '<text>'`                            | [location-update](../archive/commands.md#location-update)     |
| What happened at a location                 | `location-timeline /archive/locations/Highbury`                                                 | [location-timeline](../archive/commands.md#location-timeline) |
| List the devices                            | `device-list`                                                                                   | [device-list](../archive/commands.md#device-list)             |
| A device's details and owners               | `device-info /archive/devices/peggy-lumix`                                                      | [device-info](../archive/commands.md#device-info)             |
| Devices seen in pictures but not registered | `device-scan`                                                                                   | [device-scan](../archive/commands.md#device-scan)             |
| Register a device                           | `device-create /archive/devices/ada-camera --name "Ada's camera" --make <make> --model <model>` | [device-create](../archive/commands.md#device-create)         |
| Say who owned a device, and when            | `device-set-owner --from 2019 /archive/devices/ruby-iphone /archive/people/Ruby_Wrenfield`      | [device-set-owner](../archive/commands.md#device-set-owner)   |
| A device's history                          | `device-timeline /archive/devices/ruby-iphone`                                                  | [device-timeline](../archive/commands.md#device-timeline)     |
| Devices with a GPS track                    | `track-list`                                                                                    | [track-list](../archive/commands.md#track-list)               |
| Add a GPX file to a device's track          | `track-import /archive/devices/ruby-iphone <file>.gpx`                                          | [track-import](../archive/commands.md#track-import)           |

### Feeds: timeline, news, events and on this day

| Task                                                 | Command                                                     | Reference                                            |
| ---------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Everything that happened, newest first               | `timeline`                                                  | [timeline](../archive/commands.md#timeline)          |
| One year, or one person's entries                    | `timeline --year 1968`, `timeline --person Peggy_Wrenfield` | [timeline](../archive/commands.md#timeline)          |
| What people added lately                             | `news`, `news --limit 20`                                   | [news](../reference/commands-core.md#news)           |
| Birthdays, memorials and anniversaries around a date | `events`, `events --today 2026-12-24 --days-ahead 7`        | [events](../reference/commands-core.md#events)       |
| What the archive has from this day in earlier years  | `onthisday`, `onthisday 12-24`                              | [onthisday](../reference/commands-core.md#onthisday) |
| Pictures taken on a day in past years                | `dayinhistory 12-24 --years 20`                             | [dayinhistory](../archive/commands.md#dayinhistory)  |

`news`, `events` and `onthisday` are core commands that gather what every installed module tells; without the archive they have little to say. [Home, memories and statistics](../guide/home.md) shows the same feeds on the Home page.

### Duplicates and staging

| Task                                                 | Command                                                           | Reference                                                   |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| Exact copies in an album or below a folder           | `duplicates /archive/albums/christmas-2019`                       | [duplicates](../archive/commands.md#duplicates)             |
| Look-alikes: resized, cropped or rescanned copies    | `duplicates --fuzzy /archive/albums`                              | [duplicates](../archive/commands.md#duplicates)             |
| Keep one copy and trash the others                   | `merge-duplicates --dry-run <keep> <drop>...`                     | [merge-duplicates](../archive/commands.md#merge-duplicates) |
| The state of your staging area                       | `staging status`                                                  | [staging](../archive/commands.md#staging)                   |
| Pair Google Photos and XMP sidecars with their files | `media-sidecars --dry-run ~/staging/files/google-photos/<folder>` | [media-sidecars](../archive/commands.md#media-sidecars)     |

The `staging` command has many subcommands for sorting, filing and undoing; [Sorting in staging](../archive/staging.md) and [Staging and importing for administrators](../archive/staging-admin.md) cover them. [Duplicates](../archive/duplicates.md) explains how copies are found.

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
| The media service's state                                      | `ems-status`                               | [ems-status](../ems/commands.md#ems-status)                    |
| Whose the language model is, and whether it answers            | `llm-status --checks`                      | [llm-status](../assistant/commands.md#llm-status)              |

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

## The assistant

These commands come with the assistant module. [Chatting with the assistant](../assistant/chat.md) covers the chat in the web interface, and [The language model](../assistant/language-model.md) the model behind it.

| Task                                               | Command                                               | Reference                                                         |
| -------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| Ask the assistant a question                       | `assistant-ask 'Which albums is Peggy Wrenfield in?'` | [assistant-ask](../assistant/commands.md#assistant-ask)           |
| The same, thinking before each step                | `assistant-ask --think '<question>'`                  | [assistant-ask](../assistant/commands.md#assistant-ask)           |
| Your saved chats                                   | `assistant-chat list`, `assistant-chat read <id>`     | [assistant-chat](../assistant/commands.md#assistant-chat)         |
| Delete a chat                                      | `assistant-chat delete <id>`                          | [assistant-chat](../assistant/commands.md#assistant-chat)         |
| Find a command by meaning                          | `assistant-commands find 'list running services'`     | [assistant-commands](../assistant/commands.md#assistant-commands) |
| Whether a command line changes anything            | `assistant-commands judge 'service restart cpu'`      | [assistant-commands](../assistant/commands.md#assistant-commands) |
| Ask the language model one thing, without tools    | `llm-chat 'The colour of the sky?'`                   | [llm-chat](../assistant/commands.md#llm-chat)                     |
| Score the assistant against the modules' questions | `agent-eval --limit 5 --verbose`                      | [agent-eval](../assistant/commands.md#agent-eval)                 |

Asked from the terminal, `assistant-ask` runs nothing that changes things: a change comes back as a proposal, and without `--chat` nothing is saved.

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
| `mount: permission denied, only admin is allowed to mount`       | Mounting is for administrators                                                               | Ask an administrator                                                         |

For anything else, [Troubleshooting](../admin/troubleshooting.md) goes through problems by area, and the [reference](../reference/commands.md) has every command with all its options.
