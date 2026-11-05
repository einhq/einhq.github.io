<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Media commands

The commands the media module adds. They are there once the module is installed. 5 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[detect-chapters](#detect-chapters) · [generate-derivatives](#generate-derivatives) · [media-pool-kinds](#media-pool-kinds) · [regenerate](#regenerate) · [renditions-scan](#renditions-scan)

## D

### `detect-chapters`

Find a video's cuts and write them as its chapters (metadata/chapters)

<small>changes things</small>

```text
detect-chapters [-v] [-f] <input>
```

| Argument  | What it is                |
| --------- | ------------------------- |
| `<input>` | VFS path to a video file. |

| Option | What it does                               |
| ------ | ------------------------------------------ |
| `-v`   | Verbose output.                            |
| `-f`   | Look again even if the chapters are found. |

```bash
detect-chapters /archive/albums/Exempelalbum_1978/files/sommarfilm.avi
```

With `JSON_OUTPUT=1`: nothing; the chapters are written as WebVTT under the file, with the cuts on the node.

## G

### `generate-derivatives`

Generate web derivatives (still pictures, transcoded renditions) for a media file.

<small>changes things</small>

```text
generate-derivatives [-v] [-f] [--only=<string>] [--size=<string>] [--prune] <input>
```

| Argument  | What it is              |
| --------- | ----------------------- |
| `<input>` | VFS path to media file. |

| Option            | What it does                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `-v`              | Verbose output.                                                                            |
| `-f`              | Force regenerate even if derivatives exist.                                                |
| `--only=<string>` | Generate one class only: still \| transcode \| preview \| storyboard.                      |
| `--size=<string>` | Generate only these roles (comma-separated): roles of /etc/renditions.yaml, or storyboard. |
| `--prune`         | Delete renditions under thumbnails/ that are no longer targets.                            |

```bash
generate-derivatives /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
generate-derivatives --only still /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the thumbnail, display and transcode renditions are written, and the file is marked (renditionsFor, renditionsAt) once it has every one the table owes it.

## M

### `media-pool-kinds`

The kinds of work a worker of the media pool takes, from the modules' drop-ins, as pipeline-worker's flags.

<small>reads only</small>

```text
media-pool-kinds [--reverse] <worker>
```

| Argument   | What it is                                                          |
| ---------- | ------------------------------------------------------------------- |
| `<worker>` | cpu (the media-worker service) or models (models and models-second) |

| Option      | What it does                                                            |
| ----------- | ----------------------------------------------------------------------- |
| `--reverse` | The kinds in the reverse order, as the second models worker takes them. |

```bash
media-pool-kinds cpu
media-pool-kinds models --reverse
JSON_OUTPUT=1 media-pool-kinds models
```

With `JSON_OUTPUT=1`: the flags (--kind for each kind, --reserve-kind for each reserved one); in JSON the kinds in order and the reserved ones.

## R

### `regenerate`

Regenerate web derivatives for media files under a path.

<small>changes things</small>

```text
regenerate [--force] [--prune] [--size=<string>] [--mime=<string>] [--verbose] <target>
```

| Argument   | What it is                     |
| ---------- | ------------------------------ |
| `<target>` | VFS path to file or directory. |

| Option                  | What it does                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `--force`, `-f`         | Force regenerate even if derivatives exist.                                                                  |
| `--prune`               | Delete renditions that are no longer part of the target set.                                                 |
| `--size=<string>`, `-s` | Generate only these roles, comma-separated: roles of /etc/renditions.yaml, or storyboard (e.g. small,medium) |
| `--mime=<string>`       | Only files whose mimetype matches this glob (e.g. 'video/*')                                                 |
| `--verbose`, `-v`       | Verbose output.                                                                                              |

```bash
regenerate /archive/albums/Exempelalbum_2019
regenerate --force --size thumb /archive/albums
```

With `JSON_OUTPUT=1`: how many files had their derivatives regenerated.

### `renditions-scan`

Announce every file whose renditions are not those the rendition table names now: its marker is missing or names another table, or a rendition was refused under a CPU budget EMS no longer runs.

<small>changes things</small>

```text
renditions-scan [--limit=<number>] [--if-idle] [-n] [-v] [<path>]
```

| Argument   | What it is                      |
| ---------- | ------------------------------- |
| `[<path>]` | The tree to look in (default /) |

| Option             | What it does                                                      |
| ------------------ | ----------------------------------------------------------------- |
| `--limit=<number>` | Facts one run announces at most (default 1000; 0 for no cap)      |
| `--if-idle`        | Announce nothing while the rendition pipelines have work waiting. |
| `-n`               | Dry run — count what would be announced without announcing it.    |
| `-v`               | Name each file announced.                                         |

```bash
renditions-scan -n
renditions-scan /archive/recipes
renditions-scan --if-idle --limit 0
```

With `JSON_OUTPUT=1`: how many files it looked at and how many it announced as media.renditions.stale.
