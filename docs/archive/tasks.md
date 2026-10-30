# Archive commands by task

This page is for power users and administrators who use the Archive from the terminal. Each table row gives a task, a command line that does it, and a link to that command's full entry. The commands come with the Archive and are there once it is installed; [The Archive](index.md) says what it adds, and [Commands by task](../shell/commands.md) has core's commands and how to read the tables.

EiN runs most of the analysis by itself after an upload; the commands here are for looking things up, changing them by hand, and doing one thing again. [Albums](albums.md), [People and faces](people.md) and the other guide pages show the same tasks in the web interface.

## Search your pictures

`search` is core's command, and what it finds in pictures, people, places and labels comes from the Archive. [Searching your pictures](search.md) covers the same in the web interface.

| Task                                   | Command                                                                 | Reference                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Only photos, or videos                 | `search sailboat --kind photo`, `--kind video,audio`                    | [search](../reference/commands-core.md#search)                                                   |
| Find albums, people or places by name  | `search christmas --kind album`, `search peggy --kind person`           | [search](../reference/commands-core.md#search)                                                   |
| Pictures of a person                   | `search --subject person:Peggy_Wrenfield --kind photo`                  | [search](../reference/commands-core.md#search)                                                   |
| Pictures of two people together        | `search --subject person:Peggy_Wrenfield --subject person:Helen_Okafor` | [search](../reference/commands-core.md#search)                                                   |
| Pictures taken in a period             | `search --from 1968 --to 1970 --kind photo`                             | [search](../reference/commands-core.md#search)                                                   |
| Pictures from a town or an area        | `search --bbox=$(location-region Truro --bbox-only)`                    | [search](../reference/commands-core.md#search), [location-region](commands.md#location-region)   |
| Pictures with a label                  | `search --tag sailing`, or `members /archive/tags/sailing`              | [search](../reference/commands-core.md#search), [members](../reference/commands-core.md#members) |
| Pictures that look like one picture    | `search --like /archive/albums/christmas-2019/20191224_141841.jpg`      | [search](../reference/commands-core.md#search)                                                   |
| Search inside one album                | `search --under /archive/albums/christmas-2019 tree`                    | [search](../reference/commands-core.md#search)                                                   |
| Which albums hold the matches          | `search --subject person:Peggy_Wrenfield --group-by album`              | [search](../reference/commands-core.md#search)                                                   |
| Count matches per year, month and kind | `search --subject person:Peggy_Wrenfield --facets`                      | [search](../reference/commands-core.md#search)                                                   |

## Albums

| Task                                              | Command                                                                                      | Reference                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------ |
| List the albums                                   | `album list /archive/albums`                                                                 | [album](commands.md#album)                 |
| An album's name, description, cover and size      | `album info /archive/albums/christmas-2019`                                                  | [album](commands.md#album)                 |
| Make an album                                     | `album create /archive/albums/malpas-summer --name 'Summer at Malpas'`                       | [album](commands.md#album)                 |
| Make a private album                              | `album create /archive/albums/malpas-summer --name 'Summer at Malpas' --share private`       | [album](commands.md#album)                 |
| Put pictures in an album                          | `album add /archive/albums/malpas-summer <file>...`                                          | [album](commands.md#album)                 |
| Rename an album, describe it                      | `album set /archive/albums/christmas-2019 name 'Christmas 2019'`, `... description '<text>'` | [album](commands.md#album)                 |
| Choose an album's cover                           | `album set /archive/albums/christmas-2019 cover <file>`                                      | [album](commands.md#album)                 |
| Widen an album's span by hand                     | `album set /archive/albums/christmas-2019 spanStart 2019-12-20`                              | [album](commands.md#album)                 |
| Link albums as a series                           | `album set /archive/albums/christmas-2019 next /archive/albums/lockdown-2020`                | [album](commands.md#album)                 |
| List an album's pictures                          | `members-album /archive/albums/christmas-2019`                                               | [members-album](commands.md#members-album) |
| Who and what an album's pictures show             | `subjects-in /archive/albums/christmas-2019`                                                 | [subjects-in](commands.md#subjects-in)     |
| One album at random                               | `album-random`                                                                               | [album-random](commands.md#album-random)   |
| Give albums without a cover one of their pictures | `album-cover --all`                                                                          | [album-cover](commands.md#album-cover)     |
| Write an album's span again                       | `album-span /archive/albums/christmas-2019`, `album-span --all --stale`                      | [album-span](commands.md#album-span)       |
| Find stacks of similar photos taken in a row      | `album-stack refresh /archive/albums/christmas-2019 --dry-run --verbose`                     | [album-stack](commands.md#album-stack)     |

## Pictures, videos and recordings

| Task                                          | Command                                                            | Reference                                                    |
| --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Everything about one file                     | `media-details /archive/albums/christmas-2019/20191224_141841.jpg` | [media-details](commands.md#media-details)                   |
| Its metadata as exiftool reads it             | `exiftool <file>`                                                  | [exiftool](commands.md#exiftool)                             |
| Set when it was taken, as vaguely as you know | `file-set-time <file> 1968-07 --note 'Postmark on the back'`       | [file-set-time](commands.md#file-set-time)                   |
| Undo a date set by hand                       | `file-set-time --clear <file>`                                     | [file-set-time](commands.md#file-set-time)                   |
| Set where it was taken                        | `file-set-position <file> --lat=50.2632 --lng=-5.0510`             | [file-set-position](commands.md#file-set-position)           |
| Rotate or mirror it for good                  | `file-set-orientation --rotate cw <file>`                          | [file-set-orientation](commands.md#file-set-orientation)     |
| Write its description                         | `file-set-description --text 'Christmas morning' <file>`           | [file-set-description](commands.md#file-set-description)     |
| Correct the text read from it                 | `file-set-text <file> --text 'Dear Peggy'`                         | [file-set-text](commands.md#file-set-text)                   |
| Read its text again in another language       | `file-set-text-language <file> en`                                 | [file-set-text-language](commands.md#file-set-text-language) |
| Correct what is said in a video or recording  | `cat corrected.vtt \| file-set-transcript <file>`                  | [file-set-transcript](commands.md#file-set-transcript)       |
| Say who took it                               | `file-set-photographer <file> /archive/people/Helen_Okafor`        | [file-set-photographer](commands.md#file-set-photographer)   |
| The latest pictures taken                     | `latest 20`                                                        | [latest](commands.md#latest)                                 |

A value that starts with a minus goes after an equals sign, as in `--lng=-5.0510`; on its own it would be read as another option. Only `file-set-time` can give a picture a vague date such as `1968` or `1968-07`; the web interface's dialog sets full dates. [Dates and places of pictures](dates-places.md) explains which date a picture gets.

To have EiN look at one file again, run the step with `-f`:

| Task                                            | Command                               | Reference                                      |
| ----------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| Read the text in a picture again                | `read-text -f <file>`                 | [read-text](commands.md#read-text)             |
| Find the faces again (boxes drawn by hand stay) | `detect-faces -f <file>`              | [detect-faces](commands.md#detect-faces)       |
| Transcribe a recording or video again           | `transcribe-file -f <file>`           | [transcribe-file](commands.md#transcribe-file) |
| Make thumbnails and renditions again            | `regenerate --force <file or folder>` | [regenerate](commands.md#regenerate)           |

All four ask the [media service](../ems/index.md), so they need it running. For many files at once, an administrator starts the pipelines instead: see [Processing and pipelines](../admin/processing.md).

## People

| Task                                     | Command                                                                                | Reference                                            |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| List the named people                    | `person-list --sort count`                                                             | [person-list](commands.md#person-list)               |
| A person's details, relations and events | `person-info /archive/people/Peggy_Wrenfield`                                          | [person-info](commands.md#person-info)               |
| Add a person                             | `person-create /archive/people/Ada_Wrenfield --name 'Ada Wrenfield' --born 2026-03-02` | [person-create](commands.md#person-create)           |
| Change names, dates and details          | `person-update /archive/people/Peggy_Wrenfield --born 1934-08-22`                      | [person-update](commands.md#person-update)           |
| People found in pictures but not named   | `person-unknown --limit 20`                                                            | [person-unknown](commands.md#person-unknown)         |
| Name one of them                         | `person-name --name 'Mabel Cole' /archive/people/unknown/<id>`                         | [person-name](commands.md#person-name)               |
| Merge two people who are one             | `person-merge /archive/people/unknown/<id> /archive/people/Ruby_Wrenfield`             | [person-merge](commands.md#person-merge)             |
| Every face of a person                   | `person-faces --sort date /archive/people/Peggy_Wrenfield`                             | [person-faces](commands.md#person-faces)             |
| Take a wrong face off a person           | `person-detach --rematch <file>/regions/face-1`                                        | [person-detach](commands.md#person-detach)           |
| Add a parent                             | `person-set-parent <child> <parent>`, `--kind adoptive`                                | [person-set-parent](commands.md#person-set-parent)   |
| Add a partner                            | `person-set-partner --kind married --from 1956-06-02 <a> <b>`                          | [person-set-partner](commands.md#person-set-partner) |
| Remove a relation between two people     | `person-remove <a> <b>`                                                                | [person-remove](commands.md#person-remove)           |
| Add an event to a person                 | `person-add-event --type death --date 2021-01-17 /archive/people/Peggy_Wrenfield`      | [person-add-event](commands.md#person-add-event)     |
| Record where someone lived               | `person-set-home --from 1956 --to 1999 <person> /archive/locations/Highbury`           | [person-set-home](commands.md#person-set-home)       |
| How two people are related               | `person-how-related /archive/people/Ruby_Wrenfield /archive/people/Peggy_Wrenfield`    | [person-how-related](commands.md#person-how-related) |
| Who a kin word reaches                   | `person-relatives Peggy_Wrenfield --relation daughter`                                 | [person-relatives](commands.md#person-relatives)     |
| Ancestors and descendants                | `person-family-tree --up 2 --down 2 /archive/people/Helen_Okafor`                      | [person-family-tree](commands.md#person-family-tree) |
| A person's life in order                 | `person-timeline /archive/people/Peggy_Wrenfield`                                      | [person-timeline](commands.md#person-timeline)       |

The family relations, events and homes are explained in [Family tree, events and homes](family.md).

## Locations, devices and tracks

| Task                                        | Command                                                                                         | Reference                                          |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| List the locations                          | `location-list`                                                                                 | [location-list](commands.md#location-list)         |
| Change a location's name or description     | `location-update /archive/locations/Highbury --description '<text>'`                            | [location-update](commands.md#location-update)     |
| What happened at a location                 | `location-timeline /archive/locations/Highbury`                                                 | [location-timeline](commands.md#location-timeline) |
| List the devices                            | `device-list`                                                                                   | [device-list](commands.md#device-list)             |
| A device's details and owners               | `device-info /archive/devices/peggy-lumix`                                                      | [device-info](commands.md#device-info)             |
| Devices seen in pictures but not registered | `device-scan`                                                                                   | [device-scan](commands.md#device-scan)             |
| Register a device                           | `device-create /archive/devices/ada-camera --name "Ada's camera" --make <make> --model <model>` | [device-create](commands.md#device-create)         |
| Say who owned a device, and when            | `device-set-owner --from 2019 /archive/devices/ruby-iphone /archive/people/Ruby_Wrenfield`      | [device-set-owner](commands.md#device-set-owner)   |
| A device's history                          | `device-timeline /archive/devices/ruby-iphone`                                                  | [device-timeline](commands.md#device-timeline)     |
| Devices with a GPS track                    | `track-list`                                                                                    | [track-list](commands.md#track-list)               |
| Add a GPX file to a device's track          | `track-import /archive/devices/ruby-iphone <file>.gpx`                                          | [track-import](commands.md#track-import)           |

## Feeds: timeline, news, events and on this day

| Task                                                 | Command                                                     | Reference                                            |
| ---------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Everything that happened, newest first               | `timeline`                                                  | [timeline](commands.md#timeline)                     |
| One year, or one person's entries                    | `timeline --year 1968`, `timeline --person Peggy_Wrenfield` | [timeline](commands.md#timeline)                     |
| What people added lately                             | `news`, `news --limit 20`                                   | [news](../reference/commands-core.md#news)           |
| Birthdays, memorials and anniversaries around a date | `events`, `events --today 2026-12-24 --days-ahead 7`        | [events](../reference/commands-core.md#events)       |
| What the archive has from this day in earlier years  | `onthisday`, `onthisday 12-24`                              | [onthisday](../reference/commands-core.md#onthisday) |
| Pictures taken on a day in past years                | `dayinhistory 12-24 --years 20`                             | [dayinhistory](commands.md#dayinhistory)             |

`news`, `events` and `onthisday` are core commands that gather what every installed module tells; without the archive they have little to say. [Memories, news and events on Home](home.md) shows the same feeds on the Home page.

## Duplicates and staging

| Task                                                 | Command                                                           | Reference                                        |
| ---------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------ |
| Exact copies in an album or below a folder           | `duplicates /archive/albums/christmas-2019`                       | [duplicates](commands.md#duplicates)             |
| Look-alikes: resized, cropped or rescanned copies    | `duplicates --fuzzy /archive/albums`                              | [duplicates](commands.md#duplicates)             |
| Keep one copy and trash the others                   | `merge-duplicates --dry-run <keep> <drop>...`                     | [merge-duplicates](commands.md#merge-duplicates) |
| The state of your staging area                       | `staging status`                                                  | [staging](commands.md#staging)                   |
| Pair Google Photos and XMP sidecars with their files | `media-sidecars --dry-run ~/staging/files/google-photos/<folder>` | [media-sidecars](commands.md#media-sidecars)     |

The `staging` command has many subcommands for sorting, filing and undoing; [Sorting in staging](staging.md) and [Staging and importing for administrators](staging-admin.md) cover them. [Duplicates](duplicates.md) explains how copies are found.
