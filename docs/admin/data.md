# Your data: backup, moving and removing

This page is for whoever runs EiN on its machine: what makes up an installation's data and where each part is, how to back it up and restore it, how to move EiN to another disk or machine, how to get your files out in a form you can read without EiN, and how to delete things, free space and remove EiN altogether.

EiN has no backup or export command of its own. Everything below uses the container engine, PostgreSQL's own tools and ordinary copying, run on the machine EiN runs on.

The commands are written for podman, run in `~/ein`. With Docker, write `docker` for `podman` and `docker compose` for `podman compose`, and see [Under Docker](#under-docker) for the one difference that matters.

## What makes up your data

An installation keeps its data in three places: the database, the data folder and `~/ein/.env`.

| Part                            | Where                                                                                   | What it holds                                                                                                                                                               | Back it up?                                                                                                                |
| ------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| The database                    | the volume `ein_db` in the container engine's storage, or the folder `EIN_DB_DIR` names | every node of the tree: names, folders, links, permissions, accounts and settings, the albums, people and faces of the Archive, and small content such as comments and keys | Yes, as a dump                                                                                                             |
| `files`                         | the data folder, `~/ein/data` unless `EIN_DATA` names another                           | your originals                                                                                                                                                              | Yes                                                                                                                        |
| `old`                           | the data folder                                                                         | the files of an older installation that the [Importer](../importer/index.md) reads; empty unless you put files there                                                        | When it holds anything                                                                                                     |
| `modules`                       | the data folder                                                                         | the installed modules                                                                                                                                                       | Yes; it is small, and a module installed from **Settings → Modules** is installed again only by hand                       |
| `files-volatile`                | the data folder                                                                         | with the Archive, the thumbnails, video renditions, face crops and the other renditions it makes from the originals                                                         | Optional: EiN can make them again, but over a large archive that takes days and needs the [media service](../ems/index.md) |
| `files-tmp`                     | the data folder                                                                         | scratch space while files are written                                                                                                                                       | No                                                                                                                         |
| `llm`                           | the data folder                                                                         | with `--llm`, the language model, downloaded at its first start                                                                                                             | No; it is downloaded again                                                                                                 |
| `~/ein/.env`                    | `~/ein`                                                                                 | your options, the lines you added, and the passwords made at the install                                                                                                    | Yes                                                                                                                        |
| `src/`, `compose.override.yaml` | `~/ein`                                                                                 | the sources and the options as services                                                                                                                                     | No; `setup.sh` makes them again                                                                                            |

[Installing in detail](install.md#the-data-folder) shows how the folders are mounted into the containers.

### Why the database and the files belong together

The `files` folder does not hold your files by name. Each file is stored under the id of its node, in a folder named after the last two characters of the id, such as `files/7K/01JA3W6Q0V3XG0M2ZK8Q5T7R7K`. What a file is called, who may see it and, with the Archive, which album it is in and whose face is in it are all in the database.

Neither half is any use without the other, and they must come from the same moment. When something is deleted for good, EiN removes its bytes from the data folder, so a database restored from an older backup than the files points at files that are gone; files newer than the database are simply not in the tree. Take both while EiN is stopped, and restore both together.

The database password in `.env`, `POSTGRES_PASSWORD`, is kept nowhere else. The restore below does not need it, as it loads the dump into a fresh database, but containers made again from the existing `ein_db` volume cannot reach the database without it. Keep a copy of `.env` with every backup.

## Back up EiN

Do this before every [update](updating.md) and on a schedule of your own. The example writes the backup to `/mnt/backup/ein`, a disk other than the one EiN runs on.

1. Stop EiN, but not its database, so nothing changes while you copy:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose stop ein
   ```

   The web interface, SSH and SFTP are down until step 5.

2. Find the database's container and dump the database, with the TimescaleDB version it was made with:

   ```bash
   # on the machine EiN runs on, in ~/ein
   mkdir -p /mnt/backup/ein
   db=$(podman ps -q --filter label=com.docker.compose.project=ein --filter label=com.docker.compose.service=db)
   podman exec "$db" psql -U ein -d ein -tAc "SELECT extversion FROM pg_extension WHERE extname = 'timescaledb'" > /mnt/backup/ein/timescaledb-version
   podman exec "$db" pg_dump -U ein -d ein -Fc > /mnt/backup/ein/ein-db.dump
   ```

   The dump is PostgreSQL's custom format and includes the small content EiN keeps in the database. It is much smaller than the files; `df` in EiN's terminal shows the database's size.

3. Copy `.env`:

   ```bash
   # on the machine EiN runs on, in ~/ein
   cp .env /mnt/backup/ein/env
   ```

4. Copy the data folder, leaving out what is not worth keeping:

   ```bash
   # on the machine EiN runs on, in ~/ein
   rsync -a --delete --exclude /files-tmp --exclude /llm ~/ein/data/ /mnt/backup/ein/data/
   ```

   Add `--exclude /files-volatile` to leave out the renditions as well; see [Make the renditions again](#make-the-renditions-again) for what that costs at a restore. If you chose another data folder at the install, give its path instead of `~/ein/data/`.

5. Start EiN again:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose start ein
   ```

`rsync --delete` makes the copy the same as the data folder, so something deleted by mistake is gone from the copy at the next run. To keep older backups, write each run to a folder of its own, such as `/mnt/backup/ein/2026-10-25`, or use a backup tool that keeps versions, such as restic or Borg, on the dump, `.env` and the data folder.

> [!WARNING]
> Never start a dump just before an update or a restart. EiN changes its database tables when it starts, and a dump in progress holds them, so EiN waits for the dump and the update looks as if EiN does not come up. Take the dump while EiN is stopped, as above, or while it is already running.

### Under Docker

Docker runs the containers as root, so the files in the data folder belong to root on the machine. Run the `rsync` of step 4, and of a restore, with `sudo`. Under rootless podman they belong to your own user, and no `sudo` is needed.

## Restore a backup

A restore loads the dump into an empty database and puts the files back beside it. On the machine the backup came from, start at step 3. On a new machine, or after reinstalling, start at step 1.

1. Install EiN with the same options as before, such as `--ems --module archive`, as [Install EiN](../start/install.md) describes. The installer starts an empty EiN and prints a new admin password; that password stops mattering after the restore, when the accounts from your backup apply. Delete its `INITIAL_ADMIN_PASSWORD` line from the new `.env` then, or `setup.sh` keeps showing a password that no longer signs in.

2. Compare the new `~/ein/.env` with the copy in your backup, and copy over the lines you added yourself, such as `CFG_` settings, ports or memory limits. Keep the new `POSTGRES_PASSWORD` and `EMS_KEY`: the new database was made with them. Check `EIN_GPU` too, which says whether this machine has a graphics card for EiN; see [The graphics card](../ems/gpu.md).

3. Stop EiN and find the database's container:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose stop ein
   db=$(podman ps -q --filter label=com.docker.compose.project=ein --filter label=com.docker.compose.service=db)
   ```

4. Replace the database with the dump:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman exec "$db" dropdb -U ein --force ein
   podman exec "$db" createdb -U ein ein
   podman exec "$db" psql -U ein -d ein -c "CREATE EXTENSION timescaledb VERSION '$(cat /mnt/backup/ein/timescaledb-version)'"
   podman exec "$db" psql -U ein -d ein -c "SELECT timescaledb_pre_restore()"
   podman exec -i "$db" pg_restore -U ein -d ein < /mnt/backup/ein/ein-db.dump
   podman exec "$db" psql -U ein -d ein -c "SELECT timescaledb_post_restore()"
   ```

   `dropdb` deletes the database EiN was running on; `--force` first ends the connections still open to it, such as the health check that connects every few seconds. TimescaleDB asks for the same version the dump was made with, and for `timescaledb_pre_restore()` and `timescaledb_post_restore()` around the restore. EiN brings TimescaleDB and the other extensions up to the newest version the image has when it next starts.

5. Put the files back, so that the data folder holds exactly what the backup holds:

   ```bash
   # on the machine EiN runs on, in ~/ein
   rsync -a --delete --exclude /files-tmp --exclude /llm /mnt/backup/ein/data/ ~/ein/data/
   ```

   This also removes the few files the empty EiN of step 1 wrote, which the restored database knows nothing of.

6. Start EiN with the restored data and any lines you changed in `.env`:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose up -d
   ```

7. Sign in with an account from your backup, and choose **Dashboard** under **System** in the sidebar: the **Storage** card shows the data folder and the database's size, and the badge above the title turns to **Healthy** once the work after the start is done. [Health and the dashboard](monitoring.md) explains what you see.

With the Archive, if you left out `files-volatile`, make the renditions again now, as the next section says. Until then, pictures and videos have no thumbnails or previews.

### Make the renditions again

With the Archive installed, the [`regenerate`](../archive/commands.md#regenerate) command makes the renditions of every picture, video and recording under a folder, face crops included. After a restore without `files-volatile`, the database still records the renditions, so add `--force` to make them although they seem to exist:

```bash
# in EiN's terminal, as the administrator
nohup regenerate --force /archive
```

[`nohup`](../reference/commands-core.md#nohup) lets it run on when you close the terminal and logs it under `/var/logs/jobs`. It needs the media service, and over a large archive it takes as long as the first processing did. `regenerate --force '/archive/albums/Summer 1987'` does one album first, so you can check the result.

## Move EiN to another machine

Moving is a backup on the old machine and a restore on the new one:

1. On the old machine, [back up EiN](#back-up-ein) to a disk you can take along, or to a folder you then copy to the new machine with `rsync -a` over SSH.
2. On the new machine, follow [Restore a backup](#restore-a-backup) from step 1, giving the paths where the backup is.
3. Point the family's bookmarks, phones and SFTP clients at the new machine's address. EiN's SSH host key, `/etc/ssh_host_key` in the tree, moves with the database, so SSH and SFTP clients see the same key as before.

The old machine keeps running until you stop it. Stop it after the move, with `podman compose down` in `~/ein`, so no one goes on adding pictures there.

If `CREATE EXTENSION` in step 4 says that TimescaleDB has no installation script for the version, the new machine's database image no longer carries the version the old one used. Update the old EiN first, so both run the same image, as [Updating](updating.md) describes, and take the backup again.

## Move the data folder to another disk

The data folder can be moved on the same machine, such as to a larger disk mounted at `/srv/ein-data`:

1. Stop EiN and remove its containers:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose down
   ```

   `down` keeps the database volume and the data folder; it removes the containers, which the last step makes again.

2. Copy the data folder to the new place, keeping its owners and times:

   ```bash
   # on the machine EiN runs on
   rsync -a ~/ein/data/ /srv/ein-data/
   ```

3. Change the line `EIN_DATA` in `~/ein/.env` to the new path:

   ```ini
   # ~/ein/.env
   EIN_DATA=/srv/ein-data
   ```

4. Make the containers again with the new folder:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose up -d
   ```

Check that your files, and with the Archive their pictures and thumbnails, show before you delete the old folder. EiN stores no path of the machine in its database, only paths inside its containers, so nothing else needs changing.

The database is not in the data folder and does not move with it. It lives in the container engine's storage, under `~/.local/share/containers/storage` for rootless podman and `/var/lib/docker` for Docker, unless `EIN_DB_DIR` in `.env` names a folder for it. To put it on another disk, run `./setup.sh --db-dir /srv/ein-db` with an empty folder: while the database is still in the volume, `setup.sh` stops and prints the commands that copy it there first.

## Get your files out without EiN

The data folder holds your files under ids, not names, so copying it gives you nothing you can browse. To get files out with their names and folders, take them out through EiN:

- **In the web interface**, with the [Archive](../archive/index.md) installed, select pictures in an album or the grid and choose **Download** in the selection bar. One file downloads as itself, several as one zip named after the album, of up to 5000 files. See [Albums](../archive/albums.md#the-selection-bar).
- **Over SFTP**, copy whole albums or the whole archive with `scp -r`, `sftp` or a graphical client, or mount EiN with `sshfs` and copy with `rsync` or a file manager. [SSH and SFTP](../shell/ssh-sftp.md#copy-files-with-sftp) shows how.
- **From EiN's terminal**, [`scp -r`](../reference/commands-core.md#scp) copies a folder to another machine, such as a NAS, if you are in the group `ssh`. [Reaching other machines](../shell/remote.md) covers keys and addresses.

This copies one of the Archive's albums:

```bash
# on your own computer
scp -P 2222 -r "helen@ein.local:/archive/albums/Summer 1987" ~/Pictures/
```

Such a copy holds the original files, as they were added. What EiN worked out or was told about them, such as the Archive's faces, people, places, descriptions and album membership, stays in EiN: an album's pictures are links to the files, and what belongs to a photo is in a hidden folder beside it, which a recursive copy leaves out. [What the tree looks like over SFTP](../shell/ssh-sftp.md#what-the-tree-looks-like-over-sftp) explains both. A copy like this is a way to take your pictures elsewhere, not a backup of EiN.

## See what takes room

In EiN's terminal, [`df`](../reference/commands-core.md#df) shows each part of the data folder, how full its disk is, how fast it grows and when it fills, and the database's size; the **Storage** card on the dashboard shows the same.

```bash
# in EiN's terminal
df
```

```text
tier    disk       41% used  1.1 TB free  full in ~212d
tier    volatile   41% used  1.1 TB free  full in ~212d
tier    tmp        41% used  1.1 TB free  full in ~212d
database  6.2 GB
```

`disk` is `files`, `volatile` is `files-volatile` and `tmp` is `files-tmp`. When they are folders on one disk, as in a default install, they show the same free space. [`du`](../reference/commands-core.md#du) measures part of the tree, such as `du -sh /archive`.

On the machine itself, `du -sh ~/ein/data/*` shows each folder of the data folder, and `podman system df` what the images and the database volume take in the container engine's storage. Each update builds new images and removes the ones they replaced; `podman image prune` removes other images without a name that nothing uses any more.

## Delete things and free space

What you delete in the web interface goes to the deleter's trash first and keeps its room on the disk until it leaves the trash: after 30 days, or the number of days set in [`CFG_TRASH_RETENTION_DAYS`](../reference/settings.md#cfg_trash_retention_days) (**Days in the trash**, under **Settings → System**). Only then does EiN remove the files from the data folder. [Your profile, favourites and trash](../guide/profile.md#the-trash) explains the trash, and which ways of deleting skip it.

To free the room at once, an administrator can empty every account's trash:

```bash
# in EiN's terminal, as the administrator
trash empty --all
```

Add `--older-than 7` to empty only what was deleted more than seven days ago. Either way it cannot be undone.

| To remove                                                                  | Do this                                                                                                                                                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Files and folders, and the Archive's pictures, albums, people and the like | Delete them in the web interface, then empty the trash; see [Your profile, favourites and trash](../guide/profile.md#the-trash).                                                                       |
| An account                                                                 | **Delete account…** removes its home folder at once, without the trash, and passes everything it owned elsewhere to another account; see [Accounts and groups](accounts.md#delete-an-account).         |
| A module                                                                   | **Remove** in **Settings → Modules**; see [Modules](modules.md#remove-a-module).                                                                                                                       |
| The media service or the language model                                    | `~/ein/setup.sh --no-ems` or `--no-llm` stops it and keeps its data. Then `podman image rm localhost/ein-ems` frees the media service's image of about 30 GB, and removing `~/ein/data/llm` the model. |

Deleting an account does not delete what it owned, such as pictures in the Archive: it passes to the account you choose. To remove them, delete them before or after.

## Remove EiN

There is no uninstall script. Removing EiN and everything in it takes these steps; back up first if there is anything you want to keep.

1. Stop EiN and remove its containers and its database:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose down
   podman volume rm ein_db
   ```

   `podman volume rm ein_db` deletes the database for good: every name, album, person, account and setting. If `EIN_DB_DIR` in `.env` names a folder, the database is there instead: remove that folder with `podman unshare rm -rf` and its path (under Docker, `sudo rm -rf`).

2. Remove the images:

   ```bash
   # on the machine EiN runs on
   podman image rm localhost/ein localhost/ein-core localhost/ein-db
   podman image rm localhost/ein-ems    # if you installed the media service
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
   rm -rf ~/ein
   ```

   If you chose another data folder at the install, remove it as well; `EIN_DATA` in `.env` names it, so read that line before you remove `~/ein`. Under Docker the files belong to root, so use `sudo rm -rf`.

> [!WARNING]
> `podman compose down -v` removes the database volume in the same step as the containers. Use it only when you mean to delete the database.

## When something goes differently

| What you see                                                            | What to do                                                                                                                                                |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `db=$(…)` is empty, and `podman exec` says it needs a container         | The database is not running. Start it with `podman compose up -d db`, and check `podman compose ps`. Under Docker, use `docker ps` in the `db=$(…)` line. |
| `CREATE EXTENSION` says there is no installation script for the version | The database image does not carry the TimescaleDB version the dump was made with; see [Move EiN to another machine](#move-ein-to-another-machine).        |
| With the Archive, after a restore, pictures show without thumbnails     | The renditions were not restored. [Make the renditions again](#make-the-renditions-again).                                                                |
| After a restore, some pictures open as a broken image                   | Their files are missing from the data folder: the files and the database came from different moments. Restore both from the same backup.                  |
| A module is missing after a restore                                     | It was installed from **Settings → Modules** and its folder was not restored. Install it again there; see [Modules](modules.md).                          |
| `rsync` says permission denied                                          | Under Docker the data folder belongs to root; run it with `sudo`.                                                                                         |
| The update after a backup reports that EiN did not come up              | A dump was still running when EiN started. Wait for it to finish, then `podman compose restart ein`.                                                      |

[Troubleshooting](troubleshooting.md) covers problems that are not about the data.

## Related pages

- [Installing in detail](install.md): the files in `~/ein`, the data folder and `.env`.
- [Updating](updating.md): what an update changes and keeps; back up before it.
- [Files and storage](../concepts/files.md): how EiN stores file content, and its tiers.
- [Health and the dashboard](monitoring.md): the **Storage** card and when a disk fills.
- [Your profile, favourites and trash](../guide/profile.md): the trash, from the user's side.
- [SSH and SFTP](../shell/ssh-sftp.md): copying files in and out.
