<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Media commands

The commands the media module adds. They are there once the module is installed. 11 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[detect-chapters](#detect-chapters) · [embed-picture](#embed-picture) · [exif-extract](#exif-extract) · [exiftool](#exiftool) · [generate-derivatives](#generate-derivatives) · [media-bridge](#media-bridge) · [media-pool-kinds](#media-pool-kinds) · [pictures-scan](#pictures-scan) · [promote-exif-attrs](#promote-exif-attrs) · [regenerate](#regenerate) · [renditions-scan](#renditions-scan)

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

## E

### `embed-picture`

Embed a photo or a video's keyframes for search by what is in the picture.

<small>changes things</small>

```text
embed-picture [-v] [-f] <input>
```

| Argument  | What it is                         |
| --------- | ---------------------------------- |
| `<input>` | VFS path to a photo or video file. |

| Option | What it does                                                 |
| ------ | ------------------------------------------------------------ |
| `-v`   | Verbose output.                                              |
| `-f`   | Embed again even if the model EMS runs now made the vectors. |

```bash
embed-picture /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: the vectors written under the file's metadata/picture and the model that made them; nothing when the file's vectors are kept.

### `exif-extract`

Read a media file's metadata: the probe's dump and what it says of the file under metadata/exif, and its mimetype, dimensions, angle, duration, codec and whether it can be decoded on the file. Each module's hold command runs first, and a file it holds is not read unless forced.

<small>changes things</small>

```text
exif-extract [-f] [-v] <input>
```

| Argument  | What it is        |
| --------- | ----------------- |
| `<input>` | VFS path to file. |

| Option | What it does                                                                  |
| ------ | ----------------------------------------------------------------------------- |
| `-f`   | Read again even when metadata/exif already exists, and a file a module holds. |
| `-v`   | Verbose output.                                                               |

```bash
exif-extract /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the exif node is written under the file and its facts on it, or nothing for a file a module holds.

### `exiftool`

Extract metadata from a file, as exiftool reads it (through the media service)

<small>reads only</small>

```text
exiftool [-n] <filename>
```

| Argument     | What it is        |
| ------------ | ----------------- |
| `<filename>` | VFS path to file. |

| Option | What it does                                                     |
| ------ | ---------------------------------------------------------------- |
| `-n`   | Numeric values (always the case now; accepted for compatibility) |

```bash
exiftool /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: the file's metadata exactly as exiftool reads it.

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

### `media-bridge`

Derive the facts of a media file itself from VFS mutations: arrived, changed, turned, removed, read, its renditions made (long-running)

<small>changes things</small>

```text
media-bridge
```

```bash
media-bridge
```

With `JSON_OUTPUT=1`: nothing; it runs until stopped, turning VFS mutations into the facts of media files.

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

## P

### `pictures-scan`

Announce every photo and video whose picture vectors are not the model EMS embeds with now: its marker is missing or names another model.

<small>changes things</small>

```text
pictures-scan [--limit=<number>] [--if-idle] [-n] [-v] [<path>]
```

| Argument   | What it is                      |
| ---------- | ------------------------------- |
| `[<path>]` | The tree to look in (default /) |

| Option             | What it does                                                   |
| ------------------ | -------------------------------------------------------------- |
| `--limit=<number>` | Facts one run announces at most (default 1000; 0 for no cap)   |
| `--if-idle`        | Announce nothing while media-embed-picture has work waiting.   |
| `-n`               | Dry run — count what would be announced without announcing it. |
| `-v`               | Name each file announced.                                      |

```bash
pictures-scan -n
pictures-scan /archive/albums/christmas-2019
pictures-scan --if-idle --limit 0
```

With `JSON_OUTPUT=1`: how many files it looked at and how many it announced as media.picture.stale, and the model EMS embeds with.

### `promote-exif-attrs`

Copy width/height/duration from a file's exif node onto the file node.

<small>changes things</small>

```text
promote-exif-attrs [-v] [-n] [--angle] [--codec] <path>
```

| Argument | What it is                                       |
| -------- | ------------------------------------------------ |
| `<path>` | VFS path to a media file or a directory to walk. |

| Option    | What it does                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------- |
| `-v`      | Verbose output.                                                                                |
| `-n`      | Dry run — report what would be set, write nothing.                                             |
| `--angle` | Also promote a video's container rotation to `angle` (never a still's, never over angleManual) |
| `--codec` | Also promote a video's picture codec to `codec` (the hint EMS skips its VRAM stage on)         |

```bash
promote-exif-attrs /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; width, height and duration are copied from the exif node onto the file.

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
