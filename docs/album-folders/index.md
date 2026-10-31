# Album folders

The Album folders module keeps every album of the [Archive](../archive/index.md) as a folder of
real files on the machine EiN runs on. Point a file manager, a shared folder or another photo
program at it and you browse the albums and their pictures without EiN. The folders follow the
albums: an album made, renamed or deleted in EiN, or a picture added or removed, shows there within
seconds.

The folders only ever show what EiN has. Nothing done to them reaches EiN, and they cannot be
changed by hand. To add, sort or remove pictures, use EiN as before.

## Install it

The module needs the Archive. Install it from **Settings → Modules**, or in EiN's terminal:

```bash
# in EiN's terminal, as the administrator
mod install album-folders
```

Its service, `album-folders`, starts at once and makes the folders. [Modules](../admin/modules.md) covers installing and removing modules.

## Where the folders are

The folders are in `files/albums` in the data folder: `~/ein/data/files/albums`, unless you chose
another data folder at the install ([What makes up your data](../admin/data.md#what-makes-up-your-data)).
Inside, the albums are laid out as they are under `/archive/albums` in EiN, folders of albums
included:

```text
~/ein/data/files/albums/
├── Summer 1987/
│   ├── IMG_0412.jpg
│   └── IMG_0413.jpg
└── Wrenfield farm/
    ├── Harvest 1992/
    │   └── DSC_1034.NEF
    └── The new barn/
        └── barn.mp4
```

- A folder is named like the album in the tree, which is the name in its address. Changing an
  album's title on its page does not rename the folder; moving the album to another path, with
  [`mv`](../reference/commands-core.md#mv) in the terminal, does.
- Each picture, video and recording of the album is a file under the name it has in the album, a
  picture added from elsewhere included. An album holding its pictures in a `files` folder shows
  them directly in the album's folder.
- Similar photos stacked into one show as all the photos.
- An album with nothing in it is an empty folder.

Each file is the original itself, not a copy: a second name for the same file in `files`, called a
hard link. The folders take no room of their own, and the files keep their dates and contents as
they were added.

## What is left out

- **Files whose bytes are not on the `disk` tier.** A hard link can only be made to a file on the
  same disk, so a folder holds only what EiN keeps with your originals, in `files`. Renditions on
  the `volatile` tier and content kept in the database, the `db` tier, never show up there, nor does
  a picture made on either of them with `mknode --tier`. `album-folders status` counts what it left
  out. [Where the bytes are kept](../concepts/files.md#where-the-bytes-are-kept) explains the tiers.
- **What EiN knows about the pictures**: faces, people, places, descriptions and comments stay in
  EiN, as do thumbnails and video renditions. The folders hold the originals.
- **Suggested albums** in staging, until they are filed as albums.

## Share them read-only

The folders cannot be changed: nothing can be added, renamed or removed in them.

> [!WARNING]
> The files in the folders are EiN's own originals, not copies. Whoever may write to a file there
> writes to the original: a photo program that saves an edit into a picture changes it in EiN, and
> EiN does not know. Give everyone and every program the folders read-only.

Under podman, which the installer uses unless told otherwise, the files belong to your own user,
who can write to them. Two ways to give the folders read-only:

- **A shared folder** in Samba, with `read only = yes`:

  ```ini
  [albums]
  path = /home/helen/ein/data/files/albums
  read only = yes
  ```

- **A read-only view** of the folders elsewhere on the machine, for a program of your own:

  ```bash
  # on the machine EiN runs on
  sudo mkdir -p /srv/albums
  sudo mount --bind ~/ein/data/files/albums /srv/albums
  sudo mount -o remount,bind,ro /srv/albums
  ```

Under Docker the files belong to root, and other users can read but not change them.

Who can see an album in EiN does not carry over: everyone who can read the folders sees every album.

## How they keep up

The service follows each change to the albums and brings the folders it touches up to date a
couple of seconds after the changes stop. Every hour it also compares every folder with its album,
which catches anything a change notice missed, such as one made while the service was stopped.
After EiN starts, it compares everything first.

A picture deleted from EiN leaves every folder it was in, and only then is its space freed: while a
folder still holds a file, the file keeps its room on the disk.

## Settings

Both are in **Settings**, under **Album folders**, and restart the service when changed.
[Configuration](../admin/configuration.md) explains settings.

| Setting                      | Default        | What it does                                                                                                    |
| ---------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `CFG_ALBUM_FOLDERS_PATH`     | empty          | Where the folders are, as EiN sees it. Empty means `/files/albums`, which is `files/albums` in the data folder. |
| `CFG_ALBUM_FOLDERS_INTERVAL` | `3600` seconds | How often every folder is compared with its album, beside following each change. At least 60.                   |

A hard link cannot cross from one disk or mount to another, so another location must be inside
`/files`, EiN's view of the `files` folder.

## In the terminal

`album-folders status` says where the folders are and what the last full comparison found:

```bash
# in EiN's terminal
album-folders status
```

```text
/files/albums: ready
last full pass 2026-10-30T21:00:00.000Z, 112 albums: 0 linked, 0 removed, 8410 in place
```

`album-folders sync` compares them now, every album or the albums under one path, and `--dry-run`
only counts what it would change:

```bash
# in EiN's terminal, as the administrator
album-folders sync "/archive/albums/Summer 1987" --dry-run
```

[Album folders commands](commands.md) has every option.

## Backups

The [backup](../admin/data.md#back-up-ein) copies the data folder with `rsync -a`, which copies a
hard link as a file of its own and so stores every picture in an album twice. Leave the folders out
with `--exclude /files/albums`: EiN makes them again from the albums after a restore.

## If something looks different

| What you see                                                                   | Why, and what to do                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `holds files but no .ein-album-folders; not taken as the album folders`        | The location already holds files the module did not make. It only takes an empty folder or one it made, since it removes every file there that no album wants. Choose an empty folder.                                                           |
| `not on the same mount as the stored files`                                    | `CFG_ALBUM_FOLDERS_PATH` is outside `/files`. Choose a folder inside it.                                                                                                                                                                         |
| `… of … files belong to no album; not removing them (--force does)` in the log | A full comparison would have emptied more than half the folders, which is what an archive not yet in place looks like. If the albums really are gone, run `album-folders sync --force`.                                                          |
| An album's folder is empty                                                     | The album has no pictures, or none whose bytes are on the `disk` tier ([What is left out](#what-is-left-out)).                                                                                                                                   |
| A picture is missing in a folder after a change                                | Wait a few seconds, or run `album-folders sync` with the album's path. What the service did is in `/var/logs/services/album-folders/stdout.log`, its errors in `stderr.log` ([Services and logs](../admin/services-logs.md#where-the-logs-are)). |

## Related pages

- [Albums](../archive/albums.md)
- [Your data: backup, moving and removing](../admin/data.md)
- [SSH and SFTP](../shell/ssh-sftp.md), the other way to browse EiN from outside
- [Modules](../admin/modules.md)
