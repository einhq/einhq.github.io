# Staging and importing for administrators

This page is for the administrator who looks after the staging areas where everyone's uploads wait:
how they are laid out, the background work that reads and groups what arrives, how to plan an
import of tens of thousands of files, the finer settings of a category, and the `staging` command
for checking and repairing a person's staging area. How family members upload and sort is on
[Getting your photos in](importing.md) and [Sorting in staging](staging.md).

## What a staging area is

Every account has its own staging area in its home, `/home/<username>/staging`. Files wait there,
seen only by their owner, until the owner files them into an album or discards them. The Archive
module provides staging; without the `archive` module there is none (see [Modules](../admin/modules.md)).

```text
/home/helen/staging/
  files/<category>/…        the staged files, in any folders below a category
  albums/<category>/<slug>  the suggested albums (groups) for that category's files
  journal/<id>              one entry per decision, with the plan that undoes it
  routes/                   GPX files waiting for the device that recorded them
```

| Part                 | What it is                                                                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `files/inbox`        | The default category. It is always there and cannot be removed; uploads from the Media page go here.                                                                                   |
| `files/<category>`   | Any other category, one folder each. Its name is its key and never changes. Its settings are kept on the folder.                                                                       |
| `albums/<category>/` | The groups the organizer suggests, as albums whose members are links to the staged files. It also holds the organizer's checkpoint, `.organizer`.                                      |
| `journal/`           | Every decision: filing, discarding, removing copies, changing the groups and "not this album". Entries are never deleted; each is undone from the **Done** tab or with `staging undo`. |
| `routes/`            | GPX tracks that name no device EiN knows, until their owner says which device recorded them.                                                                                           |

Every directory of a staging area is mode `0700` and owned by the account, and `staging/` is marked
unlisted. Nobody else can open it, find it in a search or see it on the map, and the library's own
views (the Media page, the map, On this day, search) leave it out even for its owner until the
files are filed. The administrator passes every permission check, other people's staging
included, as root does; [Permissions in depth](../admin/permissions.md#a-folder-governs-what-is-under-it)
explains why the `0700` folder is enough. The background work runs with administrative access, so
it reads and processes staged files like any others.

EiN sets no limit on how much one person's staging area holds. Staged files take room on the same
disk as the library; `df` in the terminal shows the free space.

## When a staging area is set up

A new account has no staging area until one of these sets it up:

- the person opens **Staging** in the web interface, or drops files on a page that uploads into
  staging;
- the `staging-organizer` service, which sets up every account's staging area once an hour;
- you, with `staging init`.

Someone who wants to copy files in over SFTP before opening **Staging** finds no
`/home/<username>/staging` yet. Have them open **Staging** once, or set it up for them:

```bash
# in EiN's terminal, as the administrator
staging init --user ruby
```

```text
ruby: 7 created, 0 repaired, 0 adopted, 0 moved, 0 groups, 0 routes, 0 relinked
```

`staging init` makes the directories with their modes and owner, marks `staging/` unlisted and
makes the Inbox. It also puts right what is out of place, moving each thing with every link to it
following, so albums and suggestions keep pointing at it:

| Found                            | What `staging init` does                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| A folder directly under `files/` | Adopts it as a category of the `generic` kind (**Other** in the web interface), named after it. |
| A file directly in `files/`      | Moves it into `files/inbox/unsorted/`, or the folder `--loose-batch` names.                     |
| A group directly in `albums/`    | Moves it into `albums/inbox/`.                                                                  |
| A GPX file waiting for a device  | Moves it into `routes/`.                                                                        |

A name already taken where something moves gets `-2`, `-3`. Run again, it finds nothing to do.

| Option                 | What it does                                                                                                                                                   |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--user <name>`        | Sets up that person's staging area. Without it, your own.                                                                                                      |
| `--all`                | Every account's.                                                                                                                                               |
| `--loose-batch <name>` | The Inbox folder that loose files of `files/` move into, instead of `unsorted`.                                                                                |
| `--idle-minutes <n>`   | Leaves a loose file of `files/` where it is when it changed within the last `n` minutes, so a copy still being written is not moved. The service passes `360`. |
| `--layout-only`        | Makes the directories and categories and moves nothing. The **Staging** page runs this.                                                                        |
| `--dry-run`            | Says what it would do and does none of it.                                                                                                                     |

## The work behind staging

Nothing in staging needs you to start it. Each step below is a pipeline that starts on its own
when files arrive or change, or a service that runs on a timer. All of them run in EiN's pipeline
engine, which [Processing and pipelines](../admin/processing.md) covers.

| Pipeline or service               | Starts when                                                                                                       | What it does                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `staging-unzip`                   | A zip anywhere in a category has finished uploading                                                               | Expands it into the folder it lies in (`unzip -n`), then removes it. One zip at a time.                                                                                                                                                                                                                         |
| `staging-sidecars`                | A Google Takeout JSON or an XMP file lands in a category that pairs sidecars, about 30 seconds after the last one | Pairs each sidecar with its photo or video (`media-sidecars`), which gives the picture its date, place and caption. One run at a time.                                                                                                                                                                          |
| `media-ingest` and the media work | A file lands                                                                                                      | Reads its date, place and camera, and checks whether it is an exact copy; then the thumbnails, faces, fingerprints and the rest, through the [media service](../ems/index.md).                                                                                                                                  |
| `staging-retime`                  | Files move into a category with other time rules, about 10 seconds after the last one                             | Dates them again by the rules of the category they are in now (`staging retime`).                                                                                                                                                                                                                               |
| `staging-organize`                | A category's files arrive, leave, move or are read, or someone asks for a run; held two minutes                   | Plans the category's groups again where its files changed, and writes what differs (`staging organize`).                                                                                                                                                                                                        |
| `track-stage`                     | A `.gpx` file lands anywhere in staging                                                                           | Adds its points to the track of the device it names and removes the file; one that names no known device waits for its owner.                                                                                                                                                                                   |
| `staging-organizer` (service)     | Every 15 minutes                                                                                                  | Asks for an organizer run of each category that something waits for, and matches the groups due a match against the library's albums.                                                                                                                                                                           |
| `staging-organizer` (service)     | Every hour                                                                                                        | Sets up every account's staging area and moves a file copied loose into `files/`, once nothing has changed on it for six hours, into `files/inbox/unsorted/` (`staging init --all --idle-minutes 360`); and checks every duplicate finding against where its file is now (`staging duplicates --repair --all`). |

The organizer reads what changed since its last run and plans only that again. A run while
another is going folds into one more run, so a large upload does not queue thousands of them. A
category gets a full build on its first run, when its grouping settings change, and once a week.

Text in pictures and documents is the one piece of work that waits: it is read when a file is
filed, not while it is staged.

To see the work, look at the **Dashboard** ([Health and the dashboard](../admin/monitoring.md)), or in the
terminal:

```bash
# in EiN's terminal
health
pipeline-instances -s failed staging-unzip
service-status staging-organizer
```

## Look at a person's staging area

`staging status` reads a staging area without changing it: per category, its media, its other
files (anything that is not a picture, video or recording), those still being read and those
without a date.

```bash
# in EiN's terminal, as the administrator
staging status --user helen
```

```text
inbox: 1204 media, 37 other, 212 indexing, 18 undated
google-photos: 48210 media, 1391 other, 30544 indexing, 66 undated
1 route(s) waiting for a device
```

A staging area that was never set up answers `helen: not initialized; run staging init`. With
`JSON_OUTPUT=1` the answer also holds the bytes, each category's organizer summary, the exact
copies by where their originals are, and how many files were filed and discarded.

Other commands that only read:

| Command                                      | What it shows                                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `staging category <name> --user <name>`      | One category: what it is called, its kind, its default album, whether it is in the bulk lane, its media. |
| `staging journal [<category>] --user <name>` | The decisions, newest first, 50 a page, with the totals filed and discarded.                             |
| `staging detect --user <name>`               | What the newest folders in the Inbox look like: a Google export, scans, a phone and so on.               |
| `staging duplicates --counts --user <name>`  | How many copies and look-alikes the staging area holds, by where the originals are.                      |
| `staging check --user <name>`                | What breaks the layout's rules (see [Put a staging area right](#put-a-staging-area-right)).              |

## Plan a large import

A browser upload suits a few thousand files. For a whole Google Takeout, a scanned collection or
years of a phone's pictures, copy the files in over SFTP and let EiN work through them.

1. **Check the disk.** Run `df`. The files need their own size, and a zip needs room for what it
   holds and a tenth more while it is expanded. A zip that does not fit is left as it is.
2. **Make a category for the source**, of the kind closest to it. On the **Staging** page this is
   the **New category** card; in the terminal, as the person or for them:

   ```bash
   # in EiN's terminal
   staging category google-photos --create --kind google-photos --user helen
   ```

   The **Google Photos export** and **Scans** kinds put their files in the bulk lane: their reading,
   thumbnails, faces and the rest wait behind all other work, so what anyone uploads to an Inbox
   meanwhile is ready first, and the import goes on whenever nothing else waits.
3. **Copy the files into the category's folder**, never into `files/` itself. Keep a folder above
   the event folders: a folder's name becomes a suggested album only when it lies two or more
   levels below the category.

   ```bash
   # on your own computer
   scp -P 2222 takeout-001.zip takeout-002.zip helen@ein.local:/home/helen/staging/files/google-photos/
   ```

   Zips can go in as they are: each is expanded where it lands, and the parts of one Takeout fill
   one tree. [Getting your photos in](importing.md#copy-files-in-over-sftp) has the
   details the person copying needs, and [SSH and SFTP](../shell/ssh-sftp.md) the connection.
4. **Let it run.** `staging status --user helen` shows how many files are still being read. The
   **Dashboard** reads **Catching up** while work waits and gets done. A file that is an exact copy
   of one its owner can already open is recorded as a copy and processed no further, so a second
   copy of an export costs little.
5. **Sort.** The groups appear on the category's **Sort** tab as the files are read; its owner
   files them as [Sorting in staging](staging.md) describes.

> [!TIP]
> One category per source keeps an export's files together and lets its kind decide how they are
> dated and grouped. A source already copied into the Inbox can be moved into a category of its
> own afterwards, with **Move to category…** on the **Files** tab or `staging move`; the files are
> dated again by the new category's rules.

How fast the work goes depends on the machine and the graphics card; see
[Performance and sizing](../admin/performance.md).

## Change the finer settings of a category

The web interface changes a category's name, kind and default album. The rest of its settings are
changed with `staging category`. A person may change their own categories; an administrator may
change anyone's with `--user`.

| Option                     | Values                                                                                      | What it decides                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--kind <kind>`            | `inbox`, `google-photos`, `scans`, `phone`, `camera`, `messaging`, `screenshots`, `generic` | What it holds; only the Inbox is of the `inbox` kind. A new kind resets every other setting, the label too, to that kind's, but for the default album and what the same command sets. |
| `--label <text>`           |                                                                                             | The name the pages show.                                                                                                                                                              |
| `--destination <album>`    | an album's path                                                                             | The library album its files are filed into by default. `--no-destination` clears it.                                                                                                  |
| `--strategy <strategy>`    | `events`, `folders`, `none`                                                                 | How its files are grouped: by time and place, by folder and runs of file names, or into monthly lanes only.                                                                           |
| `--significance <level>`   | `fewer`, `normal`, `more`                                                                   | How readily a day becomes a group of its own rather than part of an **Everyday** lane.                                                                                                |
| `--digitized on\|off`      | `on`, `off`                                                                                 | On: the files are scans, and no clock recorded while digitizing them (the scanner, a GPS fix, the file name) dates them.                                                              |
| `--filename-dates on\|off` | `on`, `off`                                                                                 | On: a date the file name spells, such as `IMG_20190601_123456.jpg`, dates a file when nothing better does.                                                                            |
| `--lane <lane>`            | `normal`, `bulk`                                                                            | `bulk` runs the work on its files below all other work. It applies to work announced from then on, within a minute; work already queued keeps its place.                              |
| `--sidecars <mode>`        | `pair`, `ignore`                                                                            | Whether Google Takeout JSON and XMP files arriving from then on are paired with their files.                                                                                          |
| `--create`                 |                                                                                             | Makes the category. Its name is lowercase letters, digits and dashes.                                                                                                                 |
| `--remove`                 |                                                                                             | Removes it. Only an empty category other than the Inbox can be removed.                                                                                                               |

What each kind starts with:

| Kind            | Grouping  | `digitized` | `filename-dates` | Lane     | Sidecars |
| --------------- | --------- | ----------- | ---------------- | -------- | -------- |
| `inbox`         | `events`  | off         | on               | `normal` | `pair`   |
| `google-photos` | `events`  | off         | off              | `bulk`   | `pair`   |
| `scans`         | `folders` | on          | off              | `bulk`   | `pair`   |
| `phone`         | `events`  | off         | on               | `normal` | `pair`   |
| `camera`        | `events`  | off         | off              | `normal` | `pair`   |
| `messaging`     | `none`    | off         | on               | `normal` | `ignore` |
| `screenshots`   | `none`    | off         | on               | `normal` | `ignore` |
| `generic`       | `events`  | off         | off              | `normal` | `pair`   |

A change of `--digitized` or `--filename-dates` dates the category's files again before the command
answers. A change of `--strategy` or `--significance` asks for an organizer run, which regroups the
files within minutes.

```bash
# in EiN's terminal
staging category inbox --significance more --user helen
staging category old-phone --lane bulk --user helen
```

```text
inbox: Inbox (inbox); 1204 media, changed group
old-phone: Old phone (phone), bulk lane; 8730 media, changed lane
```

[Dates and places of pictures](dates-places.md) explains what the time rules mean for the
person sorting.

## Put a staging area right

`staging check` lists what breaks the layout's rules and changes nothing. It checks up to 20,000
of the groups' links.

```bash
# in EiN's terminal, as the administrator
staging check --user helen
```

```text
0 problem(s); 3120 link(s) checked
```

Each problem is a line `<code>: <path>: <detail>`:

| Code             | What it means                                                            |
| ---------------- | ------------------------------------------------------------------------ |
| `missing`        | A directory of the layout is not there.                                  |
| `not-directory`  | Something other than a directory stands where one should be.             |
| `mode`, `owner`  | A directory has another mode than `0700`, or another owner.              |
| `not-unlisted`   | `staging/` is not marked unlisted, so the library's views would show it. |
| `loose-entry`    | Something lies directly in `files/` or `albums/`.                        |
| `no-inbox`       | The Inbox category is missing.                                           |
| `orphan-albums`  | A folder of groups has no category.                                      |
| `cross-category` | A group links to a file outside its own category.                        |
| `dangling-link`  | A group links to nothing.                                                |
| `waiting-route`  | A GPX file waits for its device outside `routes/`.                       |

`staging init --user <name>` puts right all but the two kinds of link. A group's broken links are
put right by the next full organizer run, which you can start at once:

```bash
# in EiN's terminal, as the administrator
staging organize inbox --user helen --full
```

Other repairs, each for one person with `--user` or, where marked, everyone with `--all`:

| Command                                   | When to use it                                                                                                                                                                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `staging organize [<category>…] --full`   | The groups look wrong or stale. Plans the whole category again instead of what changed. `--dry-run` says what it would do. `--all` for everyone.                                                                                 |
| `staging organize [<category>…] --queue`  | Asks the pipeline for a run instead of running one here; this is the **Group now** button.                                                                                                                                       |
| `staging retime [<category or folder>]`   | Dates look wrong after files were moved or settings changed. Dates the files again by their category's rules. `--dry-run` counts and writes nothing.                                                                             |
| `staging duplicates --repair`             | Copies are marked against the wrong original after files were moved outside staging. The service does this every hour. `--all` for everyone.                                                                                     |
| `staging duplicates --refresh [<folder>]` | Files have no duplicate finding. Has each one checked again, 5,000 a call; `--force` checks every file, `--dry-run` counts them.                                                                                                 |
| `media-sidecars <folder>`                 | Sidecars were not paired, for example in a category set to `ignore` that you have since set to `pair`. A second run finds nothing to do.                                                                                         |
| `media-scan /home/<name>/staging/files`   | Files stay unread after a crash, with the media service answering and nothing waiting. Announces the files that miss work. Run it only when the engine is idle: while work waits, it announces again what is already on its way. |

## Act for another person

`--user <name>` makes any `staging` subcommand act on that person's staging area, which only an
administrator may; a member of the `sudo` group must first elevate with **Administer…** in the
account menu, or `admin` in the terminal ([Permissions in depth](../admin/permissions.md#administrators)).
`--all` works only for `init`, `organize`, `match` and `duplicates --repair`; any other subcommand
answers, for example, `staging status: --all is only for init, organize, match and duplicates
--repair; name one user with --user`.

A decision you make in someone's staging area, such as `staging discard` or `staging promote`, goes
into their journal and shows on their **Done** tab, where they can undo it, and so can you:

```bash
# in EiN's terminal, as the administrator
staging journal inbox --user helen --limit 10
staging undo 01JA2B3C4D5E6F7G8H9J0K1M2N --user helen
```

Removing copies is the owner's alone: the copies go to the trash of whoever runs it, so `staging
dedupe` for someone else answers `staging dedupe: staging dedupe moves copies to your own trash: run it as helen`.

[Archive commands](commands.md#staging) lists every subcommand and option.

## When something goes differently

**A person's `/home/<name>/staging` does not exist.** Their staging area is not set up yet. Run
`staging init --user <name>`, or have them open **Staging** once.

**A zip is still a zip.** Look at the failed `staging-unzip` runs with
`pipeline-instances -s failed staging-unzip` and `pipeline-status <id>`. The step's error says why:
`not enough space: …` when the disk lacks room for what it holds and a tenth more, `refusing entry
'…': it would land outside …` for an unsafe archive, or `a file of another size is there` when a
file of that name is in the folder already. Free space or move the clashing file, then expand it
by hand: `unzip -d <folder> <zip>` goes on where the last run stopped, and `-o` writes over the
files there.

**Files stay "being prepared" for hours.** A large import takes hours, and a bulk-lane category
waits behind all other work. If `staging status` shows the `indexing` count not going down at all,
see whether the media service answers ([The media service](../ems/index.md)) and whether the
**Dashboard** says **Stuck**.

**The Sort tab stays at "No groups yet" though the files are read.** Ask for a run with
`staging organize <category> --user <name> --queue`; it answers `helen/inbox: run asked for at …`.
If no groups come, run it here without `--queue` to see its answer or its error, and look at
`service-status staging-organizer`.

**Scans have dates they should not have, or phone pictures lack them.** The category has the wrong
time rules for its files. Change them with `--digitized` or `--filename-dates`, which dates the
files again at once.

**An export's sidecars were not paired.** The category is of the **Messaging** or **Screenshots**
kind, or set to `--sidecars ignore`. Set `--sidecars pair` and run `media-sidecars` on the folder.

**A person left with files in staging.** Deleting an account deletes its home, staging included;
see [Accounts and groups](../admin/accounts.md#delete-an-account). File or move what should be kept first.

## Related pages

- [Getting your photos in](importing.md): every way in, for the people uploading.
- [Sorting in staging](staging.md): categories, groups and filing.
- [Duplicates](duplicates.md): exact copies and look-alikes.
- [Processing and pipelines](../admin/processing.md): the engine the staging work runs in.
- [The media service](../ems/index.md): the service that reads and processes the files.
- [Permissions in depth](../admin/permissions.md): why staging stays private.
- [Archive commands](commands.md#staging): the `staging` command in full.
