# Your data: backup, moving and removing

This page is for whoever runs EiN on its machine: what makes up an installation's data and where each part is, how to back it up and restore it, how to move EiN to another disk or machine, how to get your files out in a form you can read without EiN, and how to delete things, free space and remove EiN altogether.

`setup.sh`, in `~/ein`, backs EiN up and puts a backup back. Everything else below uses the container engine and ordinary copying, run on the machine EiN runs on.

The commands are written for podman, run in `~/ein`. With Docker, write `docker` for `podman` and `docker compose` for `podman compose`, and see [Under Docker](#under-docker) for the one difference that matters.

## What makes up your data

An installation keeps its data in two places: the data folder, which holds the database too, and `~/ein/.env`.

| Part                            | Where                                                         | What it holds                                                                                                                                                               | In a backup?                                                                                                       |
| ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `db`, the database              | the data folder, or the folder `EIN_DB_DIR` names             | every node of the tree: names, folders, links, permissions, accounts and settings, the albums, people and faces of the Archive, and small content such as comments and keys | Yes, as a dump                                                                                                     |
| `files`                         | the data folder, `~/ein/data` unless `EIN_DATA` names another | your originals                                                                                                                                                              | Yes, without the [Album folders](../album-folders/index.md) in `files/albums`, which EiN makes again               |
| `old`                           | the data folder                                               | files kept from an older installation, which `files` links to; empty unless you put files there                                                                             | Yes                                                                                                                |
| `modules`                       | the data folder                                               | the installed modules                                                                                                                                                       | Yes; the folder is EiN's list of what is installed                                                                 |
| `files-volatile`                | the data folder                                               | with the Archive, the thumbnails, video renditions, face crops and the other renditions it makes from the originals                                                         | Yes: EiN does not notice by itself that they are gone, and making them again takes as long as the first processing |
| `mqtt`                          | the data folder                                               | with `--devices`, the MQTT broker's accounts, hashed, and what the devices announced                                                                                        | No; `setup.sh` writes the accounts again from `.env`, and the devices announce themselves again when they connect  |
| `llm`                           | the data folder                                               | with `--llm`, the language model, downloaded at its first start                                                                                                             | No; it is downloaded again                                                                                         |
| `~/ein/.env`, `ems.keys`        | `~/ein`                                                       | your options, the lines you added, and the passwords made at the install; the keys of the media service's other callers                                                     | Yes                                                                                                                |
| `src/`, `compose.override.yaml` | `~/ein`                                                       | the sources and the options as services                                                                                                                                     | No; `setup.sh` makes them again                                                                                    |

[Installing in detail](install.md#the-data-folder) shows how the folders are mounted into the containers.

### Why the database and the files belong together

The `files` folder does not hold your files by name. Each file is stored under the id of its node, in a folder named after the last two characters of the id, such as `files/7K/01JA3W6Q0V3XG0M2ZK8Q5T7R7K`. What a file is called, who may see it and, with the Archive, which album it is in and whose face is in it are all in the database.

Neither half is any use without the other, and they must come from the same moment. When something is deleted for good, EiN removes its bytes from the data folder, so a database restored from an older backup than the files points at files that are gone; files newer than the database are simply not in the tree. A backup takes both of one moment, and a restore puts both back together.

The database password in `.env`, `POSTGRES_PASSWORD`, is kept nowhere else, and neither are the keys of the media service and the language model. A backup holds `.env`.

## Back up EiN

Do this before every [update](updating.md), and each night on a [timer](#back-up-on-a-timer). The example writes the backup to `/mnt/backup/ein`, a disk other than the one EiN runs on:

```bash
# on the machine EiN runs on
~/ein/setup.sh --backup /mnt/backup/ein --keep 14
```

```text
== Copying the files, while EiN runs

== EiN is paused while what changed is copied and the database's dump begins
EiN goes on after 2 seconds; the dump goes on beside it
Backed up to /mnt/backup/ein/2026-11-26-030000, with a dump of 6.1GB
Removed the backup 2026-11-12-030000
```

Each backup is a folder of its own, named by the time it began, and `latest` beside them points at the newest. `--keep 14` removes all but the newest 14; without it, every backup is kept. A folder given without a `/` in front is taken from `~/ein`. The backup needs `rsync` on the machine.

A backup copies the files while EiN runs, which takes as long as the files are large the first time. Then EiN is paused while what changed meanwhile is copied and the database's dump begins, so that the files and the database are of the same moment; the Web UI, SSH and SFTP wait for it, and go on where they were. The pause is as long as `rsync` takes to look through the files and renditions once more: a few seconds for a family's archive, and minutes for a million files on a spinning disk that is busy, which is why the backup belongs in the night. `old`, which EiN only reads, is not looked through again. The dump is written while EiN runs on. Where the container engine cannot pause a container, EiN is stopped until the dump is done instead, and `setup.sh` says so.

A file that the backup before holds unchanged is not copied again: both backups name the same bytes on the backup disk (a hard link). Each backup takes the room of what changed since the one before, while each is a whole backup by itself, which you can delete or copy without the others. `du -sh /mnt/backup/ein/*` counts the shared files once, for the first backup that has them.

A backup holds:

| In the backup's folder                      | What it is                                                                                                      |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ein.dump`                                  | the database, in PostgreSQL's custom format, with the small content EiN keeps in it, such as comments and keys  |
| `env`, `ems.keys`                           | `.env`, and `ems.keys` when there is one                                                                        |
| `about`                                     | when it was taken and from where, the releases of EiN and its database, and the TimescaleDB version of the dump |
| `files`, `files-volatile`, `old`, `modules` | the data folder's folders, as [What makes up your data](#what-makes-up-your-data) says                          |

The folder is readable by you alone, as `.env` is: it holds the passwords. A backup that went wrong or was cut short leaves `.<time>.partial`, which is no backup, and which the next one removes.

### Back up on a timer

A systemd timer runs the backup each night. Make these two files, with the path of your backup disk:

```ini
# ~/.config/systemd/user/ein-backup.service
[Unit]
Description=Back up EiN

[Service]
Type=oneshot
ExecStart=%h/ein/setup.sh --backup /mnt/backup/ein --keep 14
```

```ini
# ~/.config/systemd/user/ein-backup.timer
[Unit]
Description=Back up EiN each night

[Timer]
OnCalendar=*-*-* 03:00
Persistent=true

[Install]
WantedBy=timers.target
```

Then turn it on:

```bash
# on the machine EiN runs on, as your own user
systemctl --user daemon-reload
systemctl --user enable --now ein-backup.timer
systemctl --user start ein-backup.service   # one backup now, to see that it works
journalctl --user -u ein-backup             # what each backup said
```

A user's timer runs while the user is not logged in only when the user lingers, which `setup.sh` turns on under podman (`loginctl show-user $USER -p Linger`). 03:00 is before the [supervisor](supervisor.md)'s nightly updates at 04:00; a backup and an update never run at once, as one waits for the other. When root ran `setup.sh`, put the two files in `/etc/systemd/system`, with the full path of `setup.sh` for `%h/ein`, and leave out `--user`.

### Copy the backups off the machine

A backup disk in the same machine is lost with it in a fire or a theft. Copy the backups to another place too, such as a NAS or a storage service, and encrypted when it is not yours. A tool made for it, such as [restic](https://restic.net), encrypts what it sends, sends only what changed, and keeps older copies:

```bash
# on the machine EiN runs on: once, to make the encrypted repository on the NAS
restic -r sftp:helen@nas.local:/backups/ein init
# each time, after the backup
restic -r sftp:helen@nas.local:/backups/ein backup /mnt/backup/ein
```

`init` asks for the repository's password, without which nothing in it can be read: keep it somewhere other than the machine. For a timer, put it in a file only you can read, give that file in `RESTIC_PASSWORD_FILE`, and run `restic` as a second `ExecStart=` line of the service above. `restic restore latest --target /mnt/restore` brings the backups back to a disk, from which `--restore` puts one back.

### Under Docker

EiN runs as the user who ran `setup.sh`, so the files in the data folder are yours and a backup needs no `sudo`, as under rootless podman. When root ran `setup.sh`, the files belong to the user 65532 of EiN's images: run `setup.sh --backup` and `--restore` as root too, which keeps their owner.

## Restore a backup

A restore puts a backup's database, files and `.env` back, and starts EiN on them. On the machine the backup came from, it replaces what EiN holds now:

```bash
# on the machine EiN runs on
~/ein/setup.sh --restore /mnt/backup/ein                     # the newest backup there
~/ein/setup.sh --restore /mnt/backup/ein/2026-11-20-030000   # or this one
```

On a new machine, or after reinstalling the system, the installer installs EiN from the backup. Install podman or Docker as for [an install](../start/install.md), make the backup reachable on the machine, and run:

```bash
# on the new machine, as your own user
curl -fsSL https://einhq.eu/install.sh | bash -s -- --restore /mnt/backup/ein
```

It asks only where EiN goes, checks the machine for the options and the modules of the backup, and installs EiN with them. `--data` and `--db-dir` place the data folder and the database elsewhere, as at an install. The new machine keeps its own name, graphics card and container engine.

Either way, `setup.sh`:

1. stops EiN, when it runs here, and puts back `.env` with this machine's own settings in it, the data folder and the database's folder of the installation here, or the ones given;
2. copies the backup's files into the data folder, so that it holds exactly what the backup holds; [Album folders](../album-folders/index.md) are made again when EiN starts;
3. starts the database alone, replaces EiN's database with the dump, and gives it the password of `.env`;
4. starts EiN and the other services on it, as an update does.

The accounts and their passwords are the backup's. The database runs the release the backup was made on, `EIN_DB_VERSION` in its `env`, since a dump loads only into the TimescaleDB version it was made with; the next update brings it up to the newest. An installation that [builds its images](install.md#where-the-sources-come-from) from your own source builds the database from its newest source instead, which loads a backup made on the same version only. A restore that stops halfway, such as when a download fails, goes on with `~/ein/setup.sh`.

Then sign in with an account from your backup, and choose **Status** under **System** in the sidebar: the **Storage** card shows the data folder and the database's size, and the badge above the title turns to **Healthy** once the work after the start is done. [Health and status](monitoring.md) explains what you see.

### Make the renditions again

A backup made otherwise than above may have left out `files-volatile`. With the Media module installed, the [`regenerate`](../media/commands.md#regenerate) command makes the renditions of every picture, video and recording under a folder, and with the Archive, [`regenerate-face-crops`](../archive/commands.md#regenerate-face-crops) the face crops. The database still records the renditions, so add `--force` to make them although they seem to exist:

```bash
# in EiN's terminal, as the administrator
nohup regenerate --force /archive
```

The face crops go a page at a time: `regenerate-face-crops --limit 1000` prints where the next page starts, and `--after` with that id goes on from there, until it says nothing is left.

[`nohup`](../reference/commands-core.md#nohup) lets it run on when you close the terminal and logs it under `/var/logs/jobs`. It needs the media service, and over a large archive it takes as long as the first processing did. `regenerate --force '/archive/albums/Summer 1987'` does one album first, so you can check the result.

## Move EiN to another machine

Moving is a backup on the old machine and a restore on the new one:

1. On the old machine, stop EiN, with `podman compose stop core` in `~/ein`, so no one adds pictures there that the backup would not have, and [back up EiN](#back-up-ein) to a disk you can take along, or to a folder you then copy to the new machine with `rsync -aH` over SSH (`-H` keeps the backups' shared files shared).
2. On the new machine, [restore it](#restore-a-backup) with the installer.
3. Point the family's bookmarks, phones and SFTP clients at the new machine's address. EiN's SSH host key, `/etc/ssh_host_key` in the tree, moves with the database, so SSH and SFTP clients see the same key as before.

Remove the old installation once the new one shows your files, as [Remove EiN](#remove-ein) describes.

## Move the data folder to another disk

The data folder can be moved on the same machine, such as to a larger disk mounted at `/srv/ein-data`:

1. Stop EiN and remove its containers:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose down
   ```

   `down` keeps the database and the data folder; it removes the containers, which the last step makes again.

2. Copy the data folder to the new place, keeping its owners and times:

   ```bash
   # on the machine EiN runs on
   podman unshare rsync -a ~/ein/data/ /srv/ein-data/
   ```

   `podman unshare` lets the copy read the database's folder, which belongs to one of your subordinate ids. Under Docker, use `sudo rsync -a`.

3. Change the lines `EIN_DATA` and `EIN_DB_DIR` in `~/ein/.env` to the new path:

   ```ini
   # ~/ein/.env
   EIN_DATA=/srv/ein-data
   EIN_DB_DIR=/srv/ein-data/db
   ```

   Leave `EIN_DB_DIR` as it is if it names a folder outside the data folder, or is empty.

4. Make the containers again with the new folder:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose up -d
   ```

Check that your files, and with the Archive their pictures and thumbnails, show before you delete the old folder. EiN stores no path of the machine in its database, only paths inside its containers, so nothing else needs changing.

To put the database on a disk of its own, such as an SSD, stop it, copy its folder as in step 2 to an empty folder, and run `./setup.sh --db-dir /srv/ein-db`. An installation whose `EIN_DB_DIR` is empty keeps the database in the volume `ein_db`, in the container engine's storage: `./setup.sh --db-dir ~/ein/data/db` moves it into the data folder, and while the database is still in the volume, `setup.sh` stops and prints the commands that copy it there first.

## Get your files out without EiN

The data folder holds your files under ids, not names, so copying it gives you nothing you can browse. To get files out with their names and folders, take them out through EiN:

- **In the Web UI**, with the [Archive](../archive/index.md) installed, select pictures in an album or the grid and choose **Download** in the selection bar. One file downloads as itself, several as one zip named after the album, of up to 5000 files. See [Albums](../archive/albums.md#the-selection-bar).
- **Over SFTP**, copy whole albums or the whole archive with `scp -r`, `sftp` or a graphical client, or mount EiN with `sshfs` and copy with `rsync` or a file manager. [SSH and SFTP](../shell/ssh-sftp.md#copy-files-with-sftp) shows how.
- **As folders on the machine EiN runs on**, with the [Album folders](../album-folders/index.md) module: every album of the Archive is a folder of its pictures in `files/albums` in the data folder, for a file manager or a shared folder, kept up to date as the albums change.
- **From EiN's terminal**, [`scp -r`](../reference/commands-core.md#scp) copies a folder to another machine, such as a NAS, if you are in the group `ssh`. [Reaching other machines](../shell/remote.md) covers keys and addresses.

This copies one of the Archive's albums:

```bash
# on your own computer
scp -P 2222 -r "helen@ein.local:/archive/albums/Summer 1987" ~/Pictures/
```

Such a copy holds the original files, as they were added. What EiN worked out or was told about them, such as the Archive's faces, people, places, descriptions and album membership, stays in EiN: an album's pictures are links to the files, and what belongs to a photo is in a hidden folder beside it, which a recursive copy leaves out. [What the tree looks like over SFTP](../shell/ssh-sftp.md#what-the-tree-looks-like-over-sftp) explains both. A copy like this is a way to take your pictures elsewhere, not a backup of EiN.

## See what takes room

In EiN's terminal, [`df`](../reference/commands-core.md#df) shows each part of the data folder, how full its disk is, how fast it grows and when it fills, and the database's size and its largest tables; the storage cards on the Status page's **Overview** show the same.

```bash
# in EiN's terminal
df
```

```text
tier    disk       41% used  1.1 TB free  full in ~212d
tier    volatile   41% used  1.1 TB free  full in ~212d
database  6.2 GB
  root_nodes_attr                      2.1 GB
  root_nodes_audit                     1.6 GB
  root_nodes_lnk                       812 MB
  root_nodes                           540 MB
  root_pools_job                       230 MB
```

`disk` is `files` and `volatile` is `files-volatile`. When they are folders on one disk, as in a default install, they show the same free space. [`du`](../reference/commands-core.md#du) measures part of the tree, such as `du -sh /archive`.

On the machine itself, `du -sh ~/ein/data/*` shows each folder of the data folder, and `podman system df` what the images and the database volume take in the container engine's storage. Each update downloads new images and removes the ones they replaced; `podman image prune` removes other images without a name that nothing uses any more.

## Delete things and free space

What you delete in the Web UI goes to the deleter's trash first and keeps its room on the disk until it leaves the trash: after 30 days, or the number of days set in [`CFG_TRASH_RETENTION_DAYS`](../reference/settings.md#cfg_trash_retention_days) (**Days in the trash**, under **Settings → System**). Only then does EiN remove the files from the data folder. [Your profile, favourites and trash](../guide/profile.md#the-trash) explains the trash, and which ways of deleting skip it.

To free the room at once, an administrator can empty every account's trash:

```bash
# in EiN's terminal, as the administrator
trash empty --all
```

Add `--older-than 7` to empty only what was deleted more than seven days ago. Either way it cannot be undone.

| To remove                                                                  | Do this                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Files and folders, and the Archive's pictures, albums, people and the like | Delete them in the Web UI, then empty the trash; see [Your profile, favourites and trash](../guide/profile.md#the-trash).                                                                                                                                                                                                       |
| An account                                                                 | **Delete account…** removes its home folder at once, without the trash, and passes everything it owned elsewhere to another account; see [Accounts and groups](accounts.md#delete-an-account).                                                                                                                                  |
| A module                                                                   | **Remove** in **Settings → Modules**; see [Modules](modules.md#remove-a-module).                                                                                                                                                                                                                                                |
| The media service or the language model                                    | `~/ein/setup.sh --no-ems` or `--no-llm` stops it and keeps its data. Then `podman image rm ghcr.io/einhq/ems:0.4.9`, the release `EIN_EMS_VERSION` names in `~/ein/.env`, frees the media service's image of about 30 GB (`localhost/ein-ems` when it was built from your own source), and removing `~/ein/data/llm` the model. |

Deleting an account does not delete what it owned, such as pictures in the Archive: it passes to the account you choose. To remove them, delete them before or after.

## Remove EiN

There is no uninstall script. Removing EiN and everything in it takes these steps; back up first if there is anything you want to keep.

1. Stop EiN and remove its containers and its database:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose down
   ```

   The database stays in `db` in the data folder until step 4. If `EIN_DB_DIR` in `.env` names a folder outside it, remove that folder with `podman unshare rm -rf` and its path (under Docker, `sudo rm -rf`); if it is empty, the database is the volume `ein_db`: `podman volume rm ein_db`. Either deletes the database for good: every name, album, person, account and setting.

2. Remove the images:

   ```bash
   # on the machine EiN runs on
   podman image rm ghcr.io/einhq/core:0.1.2 ghcr.io/einhq/db:0.1.0   # the releases EIN_CORE_VERSION and EIN_DB_VERSION in .env name
   podman image rm ghcr.io/einhq/ems:0.4.9                           # if you installed the media service: EIN_EMS_VERSION in .env
   podman image rm localhost/ein-core localhost/ein-db localhost/ein-ems   # if they were built from your own source
   podman image prune
   ```

   The language model's image is llama.cpp's, from `ghcr.io/ggml-org/llama.cpp`; `podman images` lists it if you want it gone too.

3. Under podman, `setup.sh` turned on `podman-restart.service` and lingering for your user, so that EiN starts at boot (see [Installing in detail](install.md#start-ein-when-the-machine-boots)). With EiN's containers gone they start nothing of EiN's; if no other container of yours needs them, turn them off:

   ```bash
   # on the machine EiN runs on, as your own user
   systemctl --user disable podman-restart.service
   loginctl disable-linger
   ```

4. Remove the installation and the data folder, which holds your originals:

   ```bash
   # on the machine EiN runs on
   podman unshare rm -rf ~/ein
   ```

   `podman unshare` lets it remove the database's folder, which belongs to one of your subordinate ids. If you chose another data folder at the install, remove it as well; `EIN_DATA` in `.env` names it, so read that line before you remove `~/ein`. Under Docker the files belong to root, so use `sudo rm -rf`.

> [!WARNING]
> With an empty `EIN_DB_DIR`, `podman compose down -v` removes the database volume in the same step as the containers. Use it only when you mean to delete the database.

## When something goes differently

| What you see                                                                                   | What to do                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setup.sh: the database is not running, and a backup dumps it`                                 | Start EiN, `podman compose up -d` in `~/ein`, and back up again.                                                                                                                                                                                                                |
| `setup.sh: --backup copies the files with rsync, which is not installed here`                  | Install `rsync` with the system's package manager, such as `sudo apt install rsync`.                                                                                                                                                                                            |
| `rsync` says permission denied                                                                 | Root ran `setup.sh`, so the data folder belongs to the user 65532: back up and restore as root ([Under Docker](#under-docker)).                                                                                                                                                 |
| `setup.sh: the database's dump failed`                                                         | The output above it says why. A dump that waited a minute for a table EiN held stops; back up again. Nothing of the backup is kept but `.<time>.partial`, which the next one removes.                                                                                           |
| `setup.sh: the backup's database is of TimescaleDB …, which this database image does not have` | The restore runs another release of the database than the one the backup was made with, as when it was built from your own source. Install the database's release that `EIN_DB_VERSION` in the backup's `env` names, or make the backup again on an EiN with the same database. |
| `setup.sh: the backup's database did not load`                                                 | `pg_restore`'s output above it says why. Run `~/ein/setup.sh` again once it is fixed: it loads the dump again from the start.                                                                                                                                                   |
| `setup.sh: the database of an earlier install is here` at a restore on a new machine           | A database is in the data folder or the volume `ein_db` already, without its `.env`. Remove it as the message says, or restore into another data folder with `--data`.                                                                                                          |
| With the Archive, after a restore, pictures show without thumbnails                            | The backup holds no renditions, as one made by hand may not. [Make the renditions again](#make-the-renditions-again).                                                                                                                                                           |
| After a restore, some pictures open as a broken image                                          | Their files are missing from the data folder: the files and the database came from different moments. Restore both from the same backup.                                                                                                                                        |

[Troubleshooting](troubleshooting.md) covers problems that are not about the data.

## Related pages

- [Installing in detail](install.md): the files in `~/ein`, the data folder and `.env`.
- [Updating](updating.md): what an update changes and keeps; back up before it.
- [Files and storage](../concepts/files.md): how EiN stores file content, and its tiers.
- [Health and status](monitoring.md): the **Storage** card and when a disk fills.
- [Your profile, favourites and trash](../guide/profile.md): the trash, from the user's side.
- [SSH and SFTP](../shell/ssh-sftp.md): copying files in and out.
