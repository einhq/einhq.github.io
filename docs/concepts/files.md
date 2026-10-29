# Files and storage

This page explains how EiN keeps the content of files: what a file node records about its bytes,
where the bytes are kept on the machine, and what copying, moving and deleting do to them. It is for
anyone who wants to know where their photos are, and for the administrator who looks after the disk.

Files and their storage are core's. The examples use a photo in an album,
`/archive/albums/christmas-2019`, a path that exists with the [Archive](../archive/index.md)
installed, and what the Archive makes from a file is marked as such.

## A file is a node with bytes

A photo, a video, a recording, a scanned letter and a text you write in the editor are all nodes of
type `file`. Like every node, a file has a name in its folder, an owner, a group, permissions and an
id. What sets it apart is that it holds bytes, and its attributes describe them:

| Attribute     | What it is                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | The file's name.                                                                                                                                               |
| `mimetype`    | What kind of file it is, such as `image/jpeg` or `video/mp4`. [Supported files](../archive/file-types.md#how-ein-tells-what-a-file-is) explains how EiN tells. |
| `size`        | The size of the content in bytes.                                                                                                                              |
| `sha256`      | The SHA-256 checksum of the content.                                                                                                                           |
| `writtenAt`   | When the content last changed.                                                                                                                                 |
| `description` | A description, when someone wrote one.                                                                                                                         |
| `sourceId`    | On a file EiN made from another one, such as a thumbnail, the id of the file it was made from.                                                                 |
| `frozen`      | When `true`, the content cannot be written.                                                                                                                    |

A media file carries more once the Archive has read it, such as the time it was taken and its
orientation; [Nodes and node types](nodes.md) describes a node part by part.

The bytes are kept apart from the node and are found by the node's id, not by its name or path.
Renaming a file or moving it to another folder changes the tree and leaves the bytes where they are,
however large the file is.

To see a file's attributes, ask for the node in JSON and pick them out:

```bash
# in EiN's terminal
JSON_OUTPUT=1 stat /archive/albums/christmas-2019/20191225_155434.jpg | jq '.attrs | {name, mimetype, size, sha256, writtenAt}'
```

```json
{
  "name": "20191225_155434.jpg",
  "mimetype": "image/jpeg",
  "size": 4182311,
  "sha256": "9f2c41d07a6e3b58c1d4e2f09a7b36c5d18e4f20b9a63c7d5e1f08a2b4c69d3e",
  "writtenAt": "2025-12-27T18:04:11.402Z"
}
```

## What a file keeps beneath it

Any node can have children, and a file uses this to keep what EiN works out about it. With the
Archive, a photo holds:

| Child         | What it is                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------- |
| `metadata/`   | What was read from the file, such as its EXIF in `metadata/exif` and the text read from it   |
| `thumbnails/` | The sizes the web interface shows, and for a video or recording the versions a browser plays |
| `regions/`    | The faces found on it and the boxes people drew                                              |
| `position`    | Where it was taken, when that is known                                                       |
| `comments/`   | The comments people wrote on it                                                              |

These are nodes like any other, and many of them are files with bytes of their own. The original's
bytes are never changed: when you turn a picture or correct its date, EiN changes what it keeps
beside the file, not the file. Deleting the file deletes everything beneath it.

Over SFTP these children are in a hidden folder named after the file with `_` added, as
[SSH and SFTP](../shell/ssh-sftp.md#what-the-tree-looks-like-over-sftp) describes.

## Where the bytes are kept

EiN keeps the bytes of files in three places, called tiers. Each file's bytes are on exactly one:

| Tier       | What goes there                                                                                                                                                                                                                                                                                                  | Where it is in a standard install                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `disk`     | Your originals: every file you upload or write, unless it belongs to another tier                                                                                                                                                                                                                                | `files` in the data folder                          |
| `volatile` | What EiN makes from another file and can make again: with the Archive, thumbnails, playable videos and recordings, face crops                                                                                                                                                                                    | `files-volatile` in the data folder                 |
| `db`       | Small content that belongs with the database: the settings file, comments, SSH keys and `known_hosts`, the host keys of EiN's SSH server, password hashes, `/etc/fstab`, and with the Archive the events in a person's story, the text read from pictures and documents, and staging's record of what you sorted | Large objects in PostgreSQL, in the volume `ein_db` |

EiN decides the tier when the file is made:

- A file that names the file it was made from in `sourceId` goes on `volatile`, unless it is frozen.
- Everything else goes on `disk`.
- Content that belongs with the database is put on `db` by the command that writes it.

The tier is fixed once the file exists, because the bytes stay where they were first written.
Trying to change it fails with `storage tier is set once at creation and cannot be changed`. To make
a file on a tier of your choosing, give it when you make the file:

```bash
# in EiN's terminal
mknode -t file /home/anna/notes/recipes.txt --as mimetype=text/plain --tier db
```

`--tier` takes `disk`, `volatile` or `db`; see [mknode](../reference/commands-core.md#mknode).

Because the volatile tier holds only what EiN can make again, it can sit on a faster or cheaper disk
than your originals. The deployment sets the two places with `FILE_ROOT_PATH` and
`VOLATILE_FILE_ROOT_PATH`; when the second is not set, both tiers share the first.
[Environment variables](../reference/environment.md) lists both.

## On the machine's disk

In a standard install, the data folder is `~/ein/data` unless you chose another place at the
install. EiN sees its folders at fixed paths inside its container:

| Folder in the data folder | Path inside EiN   | What it holds                                                                                                           |
| ------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `files`                   | `/files`          | the `disk` tier: your originals                                                                                         |
| `files-volatile`          | `/files-volatile` | the `volatile` tier: thumbnails and other renditions                                                                    |
| `files-tmp`               | `/files-tmp`      | scratch space, such as copies of `db`-tier content handed to the media service                                          |
| `old`                     | `/old`            | files kept from an older installation, which the media service reads but never writes; empty unless you put files there |

The media service, which the Archive needs, mounts the same folders at the same paths, so a path EiN hands it is the file it
opens, and the files on the `disk` and `volatile` tiers are never copied between them. It may read your originals but never write them.
[Installing in detail](../admin/install.md#the-data-folder) has the whole layout, and
[The media service](../ems/index.md) how the two share it.

Inside `files` and `files-volatile`, each file's bytes are stored under its node id, in a folder named
after the id's last two characters:

```text
files/
├── 1C/
│   └── 01JFX7Q2M8K4T6V9B3N5R0WD1C
├── 7H/
│   ├── 01JFX7Q3A2P9S4D8F6G1J5K07H
│   └── 01JG2B8E5C7X1Z3V6N9M4Q2R7H
…
```

There are no file names, albums or folders here; they are in the database. To find where one file's
bytes are, ask `file-stat` for its path:

```bash
# in EiN's terminal
JSON_OUTPUT=1 file-stat /archive/albums/christmas-2019/20191225_155434.jpg | jq -r .path
```

```text
/files/1C/01JFX7Q2M8K4T6V9B3N5R0WD1C
```

The path is the one inside EiN's container; on the machine it is the same file under the data
folder, here `~/ein/data/files/1C/01JFX7Q2M8K4T6V9B3N5R0WD1C`. A file on the `db` tier has no path.

> [!WARNING]
> Leave the folders in the data folder to EiN. A file changed there by hand no longer matches the
> size and checksum its node records, and a file deleted there leaves a node whose content is
> gone. Copy files in through the web interface, SFTP or the terminal instead.

The data folder and the database belong together: the folders hold bytes named by ids, and only
the database knows which id is which photo, in which album, owned by whom. Neither is any use
without the other. [Your data](../admin/data.md) says what to back up and how to move EiN to another
machine.

## Size, checksum and when the content changed

EiN keeps a file's `size`, `sha256` and `writtenAt` up to date as the bytes are written, whichever
way they come in: an upload, SFTP, the editor or a shell redirect such as `>`. You never run anything
to bring them up to date.

| Attribute   | What depends on it                                                                                                                                                                                                                        |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`      | Listings, `du`, and a download's length                                                                                                                                                                                                   |
| `sha256`    | With the Archive, finding exact copies of a file ([Duplicates](../archive/duplicates.md)), noticing that a file arriving in staging is already in the archive, and telling the Archive that a file's content changed so it reads it again |
| `writtenAt` | The modification time SFTP reports, so a backup tool or `rsync` sees a photo as unchanged while EiN is still working out its faces and description                                                                                        |

`writtenAt` is when the bytes last changed. A node also has a modification time of its own, which
moves whenever any attribute changes; that is why SFTP reports `writtenAt` instead. A client that
sets the time, such as `put -p` in `sftp` or `rsync -t`, sets `writtenAt`.

While content is being written somewhere other than from the start in order, the checksum is
cleared, and EiN reads the finished file back once to measure it. A file whose writing stopped
part-way has no checksum rather than a wrong one.

Three commands look at the bytes themselves rather than at what the node records:

| Command            | What it does                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `file-stat <path>` | The size, times, permissions and path of the bytes as they are stored. `-f` also measures the checksum and the type, which reads the whole file. |
| `file-sync <path>` | Measures the size, checksum and type of the bytes and writes them onto the node. For a file whose bytes changed without EiN seeing it.           |
| `mime <path>`      | The type the node records, the type its name suggests and the type its first bytes say.                                                          |

See [file-stat](../reference/commands-core.md#file-stat), [file-sync](../reference/commands-core.md#file-sync)
and [mime](../reference/commands-core.md#mime).

## How bytes come in and go out

Every way in writes through the same place, so each one records size, checksum and time, and checks
your permissions the same way.

| Way                               | What happens to the bytes                                                                                                                                                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| An upload in the web interface    | Stored as a new file. An upload never replaces a file: when the name is taken, it is stored as `IMG_0001 (2).jpg`, then `IMG_0001 (3).jpg`, and so on. With the Archive, [Getting your photos in](../archive/importing.md) has the ways to upload. |
| Saving in the editor              | Replaces the content of the file you opened. See [The editor](../shell/editor.md).                                                                                                                                                                 |
| SFTP, `scp` and sshfs             | Written as on any SFTP server. See [SSH and SFTP](../shell/ssh-sftp.md).                                                                                                                                                                           |
| A shell redirect, `cp`, `unzip`   | Written by the command, in EiN's terminal or over SSH. `unzip` refuses an archive whose files would not leave a tenth of their size free.                                                                                                          |
| **Download** in the web interface | The original's bytes, exactly as they were uploaded.                                                                                                                                                                                               |
| Downloading several files at once | One zip of at most 5000 files, made while it downloads. The files are stored in it, not compressed, since photos and videos are compressed already.                                                                                                |

## Copying, moving, linking and deleting

What happens to the bytes depends on the command:

| What you do                                                                              | What happens to the bytes                                                                                   |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Rename or move a file, `mv`                                                              | Nothing. The node keeps its id, and its bytes stay where they are.                                          |
| Move a file into or out of a mount (see below)                                           | The file is copied to the other side and then removed, so it gets a new id and its bytes are written again. |
| Copy a file, `cp`                                                                        | A new node with a copy of the bytes. The copy takes as much space again, and has the same checksum.         |
| Make a hard link, `ln`                                                                   | The same node under a second name. There is one copy of the bytes.                                          |
| Make a softlink, `ln -s`, or, with the Archive, add a picture to an album from elsewhere | A link that points at the file by its path. It has no bytes of its own.                                     |
| Put a file in the trash                                                                  | The file moves into your trash with its bytes, and comes back whole when you restore it.                    |
| Delete a file, `rm`, or empty the trash                                                  | The node goes, with everything beneath it. Its bytes are removed once the last name the node has is gone.   |

What is in your trash keeps its room on the disk. It is removed for good once it has been there
longer than **Days in the trash**,
[`CFG_TRASH_RETENTION_DAYS`](../reference/settings.md#cfg_trash_retention_days), 30 days unless the
administrator changes it. `rm`, a file removed over SFTP and **Empty trash** do not wait; what they
delete is gone at once. [Links](links.md#deleting-the-trash-and-links) explains what deleting does to
the links to a file, and [Your profile, favourites and trash](../guide/profile.md#the-trash) shows the
trash in the web interface.

## Mounts: parts of the tree kept elsewhere

Most of the tree is stored in PostgreSQL, with its files' bytes on the tiers above. A few parts of
it are kept elsewhere, each mounted at a path the way a disk is mounted on Linux. `mount` with no
arguments lists them, with `rw` or `r` for whether they can be written:

```bash
# in EiN's terminal
mount
```

The mounts every EiN makes at its start:

| Path               | Kind         | What it is                                                                      |
| ------------------ | ------------ | ------------------------------------------------------------------------------- |
| `/`                | `pg`         | The tree itself, in PostgreSQL, with the three tiers                            |
| `/usr/bin`         | `command`    | EiN's built-in commands, one node each                                          |
| `/usr/lib`         | `filesystem` | Core's own files, read-only                                                     |
| `/etc/files`       | `filesystem` | The scripts EiN runs at its start, read-only                                    |
| `/tmp`             | `memory`     | Scratch space, held in memory. It is empty again after every restart.           |
| `/tmp/dev-modules` | `filesystem` | Modules that come with the deployment itself, read-only                         |
| `/var/lib/modules` | `filesystem` | The modules installed with `mod install`, in the data folder's `modules` folder |
| `/usr/docs/guide`  | `filesystem` | This guide, as EiN was built with it, read-only                                 |

A `filesystem` mount shows a folder of the machine, and an `sftp` mount shows a folder of another
machine. Both are mirrors: their files are the other side's files, and nothing is stored about them
in EiN. A file in a mirror cannot have children, so EiN makes no thumbnails, reads no dates and
finds no faces in them, and changes in an `sftp` mount start no pipelines at all. With the Archive, to
bring files from a mount into the archive, copy them into staging.

Only the administrator mounts and unmounts. [Reaching other machines](../shell/remote.md#mount-a-folder-of-another-machine)
shows how to mount a folder of another machine and keep the mount across restarts, and
[The tree](tree.md) describes every standard path.

## See how much space is used

`df` shows how full the disk under each tier is, how fast it is filling and when it will be full,
and the size of the database:

```bash
# in EiN's terminal
df
```

```text
tier    disk       12% used  801 GB free  full in ~912d
tier    volatile   12% used  801 GB free  full in ~912d
tier    tmp        12% used  801 GB free  full in ~912d
database  3.4 GB
```

`tmp` is the scratch folder, measured because a full one stops EiN too. In a standard install the
three folders are on one disk, so they show the same figures, and `full in` appears once EiN has measured the disk long enough to see it fill. The **Storage** card on the **Dashboard** shows the same;
see [Health and the dashboard](../admin/monitoring.md).

`du` adds up the sizes of the files under a path, including what each file keeps beneath it, such
as its thumbnails. It counts a file reached by two names once and does not follow softlinks, so a
picture added to an album from elsewhere is counted where it lives. It counts only what you may
read.

```bash
# in EiN's terminal
du -sh /archive/albums/christmas-2019
```

```text
1.8 GB	/archive/albums/christmas-2019
```

[Your data](../admin/data.md#see-what-takes-room) shows how to measure the data folder from the
machine itself, and [Delete things and free space](../admin/data.md#delete-things-and-free-space)
how to make room.

## When something goes differently

| What you see                                                                              | Why                                                                               | What to do                                                                                                                                        |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| With the Archive, a picture's thumbnail is missing although the picture was read long ago | Its rendition was never finished, or its bytes on the `volatile` tier are gone.   | Run `regenerate --force` on the picture or its album. See [regenerate](../archive/commands.md#regenerate).                                        |
| A file's size or checksum is wrong after it was changed outside EiN                       | The bytes changed without passing through EiN, so the node was not told.          | Run `file-sync` on the file.                                                                                                                      |
| `File is frozen and cannot be modified`                                                   | The file is marked `frozen`, so its content cannot be written.                    | Leave its content as it is. Someone who may change the file can lift the mark with `attrs -d frozen <file>`; a copy made with `cp` is frozen too. |
| `storage tier is set once at creation and cannot be changed`                              | A command tried to move a file to another tier.                                   | Copy the content into a new file made with `--tier`, then remove the old one.                                                                     |
| `a filesystem is mounted at /mnt/nas` when removing or moving a folder                    | A mount stands on that folder or below it.                                        | Unmount it first with `unmount`, or `unmount --save` to keep it from coming back at the next start.                                               |
| `mount: permission denied, only admin is allowed to mount`                                | Only the administrator mounts.                                                    | Ask the administrator.                                                                                                                            |
| `df` says `no disk sample yet — is metrics-sampler running?`                              | The service that measures the disk has not taken a sample yet, or is not running. | It takes its first sample as it starts, so wait a minute. If it stays, see [Services and logs](../admin/services-logs.md).                        |
| `unzip` says `not enough space`                                                           | The files in the zip would not leave a tenth of their size free.                  | Free space on the disk, or expand the zip on a machine with room and copy the files in.                                                           |

[Troubleshooting](../admin/troubleshooting.md) covers a disk that has filled up and other problems
of the whole installation.

## Related pages

- [Nodes and node types](nodes.md): what a node is, part by part.
- [Links](links.md): hard links, softlinks, and what deleting and the trash do.
- [Supported files](../archive/file-types.md): which files EiN works with and what it makes from them.
- [Installing in detail](../admin/install.md#the-data-folder): the data folder and the database volume.
- [Your data: backup, moving and removing](../admin/data.md): what to back up, and why the files and the database go together.
- [Reaching other machines](../shell/remote.md): mounting a folder of another machine.
- [Environment variables](../reference/environment.md): `FILE_ROOT_PATH`, `VOLATILE_FILE_ROOT_PATH` and `FILE_TMP_PATH`.
