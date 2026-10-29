<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Importer commands

The commands the importer module adds. They are there once the module is installed. 13 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[import-albums](#import-albums) · [import-check](#import-check) · [import-comments](#import-comments) · [import-covers](#import-covers) · [import-devices](#import-devices) · [import-files](#import-files) · [import-homes](#import-homes) · [import-measurements](#import-measurements) · [import-people](#import-people) · [import-relations](#import-relations) · [import-stories](#import-stories) · [import-tags](#import-tags) · [import-users-groups](#import-users-groups)

## I

### `import-albums`

Create /albums nodes from the legacy extractor output.

<small>changes things</small>

```text
import-albums [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `--data=<string>` | directory holding albums.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                      |
| `--verbose`       | log each node.                                                     |

### `import-check`

Check the extracted legacy data before an import, and with --vfs what landed after one.

<small>reads only</small>

```text
import-check [--data=<string>] [--vfs]
```

| Option            | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `--data=<string>` | directory holding the extracted JSON (default /modules-dev/importer/data) |
| `--vfs`           | also report each part of the import that did not land in full.            |

### `import-comments`

Create markdown comments from the legacy comment nodes.

<small>changes things</small>

```text
import-comments [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `--data=<string>` | directory holding comments.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                        |
| `--verbose`       | log each comment.                                                    |

### `import-covers`

Recreate legacy profilePicture links as coverPhoto softlinks.

<small>changes things</small>

```text
import-covers [--data=<string>] [--dry-run] [--replace] [--verbose]
```

| Option            | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `--data=<string>` | directory holding covers.json (default /modules-dev/importer/data)  |
| `--dry-run`       | report what would be created without writing.                       |
| `--replace`       | replace existing covers with the legacy export (for a fresh import) |
| `--verbose`       | log each cover.                                                     |

### `import-devices`

Create /devices nodes (+ configuration log + dated owners) from the legacy extractor output.

<small>changes things</small>

```text
import-devices [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `--data=<string>` | directory holding devices.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                       |
| `--verbose`       | log each node.                                                      |

### `import-files`

Create frozen file nodes (symlinked to old bytes) with overrides, faces, links and versions; user files go to /home/<username>/staging/files/inbox/legacy-import.

<small>changes things</small>

```text
import-files [--data=<string>] [--old-files=<string>] [--file-root=<string>] [--limit=<string>] [--crops] [--concurrency=<string>] [--dry-run] [--verbose]
```

| Option                   | What it does                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `--data=<string>`        | directory holding files.json (default /modules-dev/importer/data)                           |
| `--old-files=<string>`   | mount path of the old files (default /old/files)                                            |
| `--file-root=<string>`   | FILE_ROOT_PATH for on-disk symlinks (default $EXTERNAL_FILE_ROOT_PATH)                      |
| `--limit=<string>`       | max files to import this run (batching)                                                     |
| `--crops`                | generate face crop images (needs bytes + ImageMagick; container run)                        |
| `--concurrency=<string>` | files to import in parallel (default 1; the work is NFS/DB wait-bound, so 4 is a large win) |
| `--dry-run`              | report what would be created without writing.                                               |
| `--verbose`              | log each node.                                                                              |

### `import-homes`

Wire person↔location residence relations from the legacy extractor output.

<small>changes things</small>

```text
import-homes [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `--data=<string>` | directory holding homes.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be linked without writing.                      |
| `--verbose`       | log each edge.                                                    |

### `import-measurements`

Create measurement logs (unit attr + backdated value points) from the legacy series.

<small>changes things</small>

```text
import-measurements [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                             |
| ----------------- | ------------------------------------------------------------------------ |
| `--data=<string>` | directory holding measurements.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                            |
| `--verbose`       | log each series.                                                         |

### `import-people`

Create /locations and /people nodes from the legacy extractor output.

<small>changes things</small>

```text
import-people [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                                      |
| ----------------- | --------------------------------------------------------------------------------- |
| `--data=<string>` | directory holding locations.json/people.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                                     |
| `--verbose`       | log each node.                                                                    |

### `import-relations`

Wire up parents/children/partners from the legacy extractor output.

<small>changes things</small>

```text
import-relations [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                          |
| ----------------- | --------------------------------------------------------------------- |
| `--data=<string>` | directory holding relations.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be linked without writing.                          |
| `--verbose`       | log each edge.                                                        |

### `import-stories`

Create blob events from the legacy text/story nodes.

<small>changes things</small>

```text
import-stories [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `--data=<string>` | directory holding stories.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                       |
| `--verbose`       | log each event.                                                     |

### `import-tags`

Port legacy /labels into the new tag system (label add per resolvable target)

<small>changes things</small>

```text
import-tags [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `--data=<string>` | directory holding tags.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be applied without writing.                    |
| `--verbose`       | log each label application.                                      |

### `import-users-groups`

Create /groups and /users nodes from the legacy extractor output, each account with a new uid and a group of its own, each group with a new gid.

<small>changes things</small>

```text
import-users-groups [--data=<string>] [--dry-run] [--verbose]
```

| Option            | What it does                                                                  |
| ----------------- | ----------------------------------------------------------------------------- |
| `--data=<string>` | directory holding groups.json/users.json (default /modules-dev/importer/data) |
| `--dry-run`       | report what would be created without writing.                                 |
| `--verbose`       | log each node.                                                                |
