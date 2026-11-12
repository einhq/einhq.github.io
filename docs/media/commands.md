<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Media commands

The commands the media module adds. They are there once the module is installed. 21 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[compute-fingerprint](#compute-fingerprint) · [detect-chapters](#detect-chapters) · [embed-picture](#embed-picture) · [exif-extract](#exif-extract) · [file-restore](#file-restore) · [file-set-text](#file-set-text) · [file-set-text-language](#file-set-text-language) · [file-set-transcript](#file-set-transcript) · [fingerprints-scan](#fingerprints-scan) · [generate-derivatives](#generate-derivatives) · [index-document](#index-document) · [media-bridge](#media-bridge) · [media-pool-kinds](#media-pool-kinds) · [media-reembed](#media-reembed) · [pictures-scan](#pictures-scan) · [promote-exif-attrs](#promote-exif-attrs) · [read-text](#read-text) · [regenerate](#regenerate) · [renditions-scan](#renditions-scan) · [text-scan](#text-scan) · [transcribe-file](#transcribe-file)

## C

### `compute-fingerprint`

Compute the fingerprints that find copies of a media file: SSCD for pictures and video keyframes, chromaprint for sound.

<small>changes things</small>

```text
compute-fingerprint [-v] [-f] <input>
```

| Argument  | What it is              |
| --------- | ----------------------- |
| `<input>` | VFS path to media file. |

| Option | What it does                                   |
| ------ | ---------------------------------------------- |
| `-v`   | Verbose output.                                |
| `-f`   | Force recompute even if already fingerprinted. |

```bash
compute-fingerprint /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the fingerprints are written under the file, and `fingerprintedAt` on it.

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

## F

### `file-restore`

Restore a photo into a new version beside it: faded colours back, dust and scratches filled, grain lessened.

<small>changes things</small>

```text
file-restore [--unfade] [--dust] [--dark] [--fill=<string>] [--mask=<path>] [--grain=<string>] [-v] <file>
```

| Argument | What it is                                                                  |
| -------- | --------------------------------------------------------------------------- |
| `<file>` | The picture to restore (JPEG, PNG, TIFF, WebP or BMP); it is never written. |

| Option             | What it does                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--unfade`         | Give a faded colour print its colours back: each channel stretched, the neutral tones made grey.                                                                     |
| `--dust`           | Find dust, scratches and cracks and fill them from what surrounds them.                                                                                              |
| `--dark`           | With --dust, look for damage darker than the picture too.                                                                                                            |
| `--fill=<string>`  | With --dust or --mask, how the damage is filled: ns (the default) or telea for dust and thin scratches, lama for creases and tears.                                  |
| `--mask=<path>`    | Fill what this mask marks instead of finding the damage: a one-channel PNG the size of the picture as stored, nonzero where marked. It is copied beside the version. |
| `--grain=<string>` | Lessen grain and noise, at this strength (above 0, at most 1; 0.5 keeps about half the grain)                                                                        |
| `-v`               | Say each step as it runs.                                                                                                                                            |

```bash
file-restore /archive/scans/1974/print-07.jpg --unfade --dust
file-restore /archive/scans/1952/portrait.tif --dust --dark --fill lama --grain 0.5
file-restore /archive/scans/1974/print-07.jpg --unfade --mask /archive/scans/1974/print-07-mask.png
```

With `JSON_OUTPUT=1`: The version written, with the steps that made it and, with --dust or --mask, its mask and marks.

### `file-set-text`

Write the text in a picture by hand, in place of what was read from it.

<small>changes things</small>

```text
file-set-text [--text=<string>] <file>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<file>` | VFS path to a picture. |

| Option            | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `--text=<string>` | the text; empty removes it, - reads it from stdin. |

```bash
file-set-text /archive/albums/Exempelalbum_2019/files/brev.jpg --text 'Kära Anna'
```

With `JSON_OUTPUT=1`: nothing; the text is written and the picture is not read again.

### `file-set-text-language`

Set the language the text in a picture is written in (or auto), and read the picture again in it.

<small>changes things</small>

```text
file-set-text-language <file> <language>
```

| Argument     | What it is                                                        |
| ------------ | ----------------------------------------------------------------- |
| `<file>`     | VFS path to a picture.                                            |
| `<language>` | ISO 639-1 code (sv, en, de, …), or auto to tell it from the text. |

```bash
file-set-text-language /archive/albums/Exempelalbum_2019/files/brev.jpg en
file-set-text-language /archive/albums/Exempelalbum_2019/files/brev.jpg auto
```

With `JSON_OUTPUT=1`: nothing; the language is set and the picture read again on the media pool.

### `file-set-transcript`

Write what is said in a video or a recording by hand, in place of the transcript, from WebVTT on stdin.

<small>changes things</small>

```text
file-set-transcript <file>
```

| Argument | What it is                          |
| -------- | ----------------------------------- |
| `<file>` | VFS path to a video or a recording. |

```bash
cat /home/admin/rattad.vtt | file-set-transcript /archive/albums/Exempelalbum_2019/files/MVI_0042.MOV
```

With `JSON_OUTPUT=1`: nothing; the transcript is written, searchable, and not transcribed again.

### `fingerprints-scan`

Announce every picture, video and recording that was never fingerprinted to the end: it has no fingerprintedAt.

<small>changes things</small>

```text
fingerprints-scan [--limit=<number>] [--if-idle] [-n] [-v] [<path>]
```

| Argument   | What it is                      |
| ---------- | ------------------------------- |
| `[<path>]` | The tree to look in (default /) |

| Option             | What it does                                                   |
| ------------------ | -------------------------------------------------------------- |
| `--limit=<number>` | Facts one run announces at most (default 1000; 0 for no cap)   |
| `--if-idle`        | Announce nothing while media-fingerprint has work waiting.     |
| `-n`               | Dry run — count what would be announced without announcing it. |
| `-v`               | Name each file announced.                                      |

```bash
fingerprints-scan -n
fingerprints-scan /archive/albums/christmas-2019
fingerprints-scan --if-idle --limit 0
```

With `JSON_OUTPUT=1`: how many files it looked at and how many it announced as media.fingerprints.stale.

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

## I

### `index-document`

Extract text content and generate embedding for a document file.

<small>changes things</small>

```text
index-document [-v] [-f] <input>
```

| Argument  | What it is                 |
| --------- | -------------------------- |
| `<input>` | VFS path to document file. |

| Option | What it does                           |
| ------ | -------------------------------------- |
| `-v`   | Verbose output.                        |
| `-f`   | Force reindex even if already indexed. |

## M

### `media-bridge`

Derive the facts of a media file itself from VFS mutations: arrived, changed, turned, removed, read, its renditions made, its text and transcript, and the unread files a moved directory carried (long-running)

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
media-pool-kinds [--reverse] [--instance=<string>] [--expect=<string>] <worker>
```

| Argument   | What it is                                                          |
| ---------- | ------------------------------------------------------------------- |
| `<worker>` | cpu (the media-worker service) or models (models and models-second) |

| Option                | What it does                                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--reverse`           | The kinds in the reverse order, as the second models worker takes them.                                                                       |
| `--instance=<string>` | The kinds for a worker of this EMS instance: those it serves every op of and stamps as the primary does (main, the primary, takes every kind) |
| `--expect=<string>`   | Print nothing, and exit 1 unless the flags would be these.                                                                                    |

```bash
media-pool-kinds cpu
media-pool-kinds models --reverse
media-pool-kinds models --instance laptop
JSON_OUTPUT=1 media-pool-kinds models
```

With `JSON_OUTPUT=1`: the flags (--kind for each kind, --reserve-kind for each reserved one); in JSON the kinds in order and the reserved ones.

### `media-reembed`

Embed the extracted texts, transcripts and hand-written descriptions already stored into the current text space, from the stored text alone.

<small>changes things</small>

```text
media-reembed [-l <number>] [-f] [-v] [<path>...]
```

| Argument      | What it is                                                          |
| ------------- | ------------------------------------------------------------------- |
| `[<path>...]` | files to embed the texts of (default: every text the archive holds) |

| Option        | What it does                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `-l <number>` | stop after this many texts or transcripts (default: all); a run resumes where the last stopped. |
| `-f`          | embed again even what the current embedder already made.                                        |
| `-v`          | name each transcript as it is done.                                                             |

```bash
media-reembed
media-reembed -l 5000
media-reembed /archive/albums/Exempelalbum_2019/files/IMG_0001.jpg
```

With `JSON_OUTPUT=1`: how many texts, transcripts and descriptions were embedded, skipped and failed; `pass complete` once nothing is left.

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

### `read-text`

Read the text written in a picture and keep it for search.

<small>changes things</small>

```text
read-text [-v] [-f] <input>
```

| Argument  | What it is             |
| --------- | ---------------------- |
| `<input>` | VFS path to a picture. |

| Option | What it does                     |
| ------ | -------------------------------- |
| `-v`   | Verbose output.                  |
| `-f`   | Read again even if already read. |

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

## T

### `text-scan`

Announce every file whose text, transcript or text vectors are missing or not what EMS makes now, found by their markers.

<small>changes things</small>

```text
text-scan [--limit=<number>] [--if-idle] [-n] [-v] [<path>]
```

| Argument   | What it is                      |
| ---------- | ------------------------------- |
| `[<path>]` | The tree to look in (default /) |

| Option             | What it does                                                   |
| ------------------ | -------------------------------------------------------------- |
| `--limit=<number>` | Facts one run announces at most (default 1000; 0 for no cap)   |
| `--if-idle`        | Hold back each fact whose pipeline has work waiting.           |
| `-n`               | Dry run — count what would be announced without announcing it. |
| `-v`               | Name each file announced.                                      |

```bash
text-scan -n
text-scan /archive/albums/christmas-2019
text-scan --if-idle --limit 0
```

With `JSON_OUTPUT=1`: how many files it looked at and how many it announced, by fact, and the facts it held back or could not check.

### `transcribe-file`

Transcribe audio or video into a timed WebVTT node with chunk embeddings.

<small>changes things</small>

```text
transcribe-file [-v] [-f] <input>
```

| Argument  | What it is                          |
| --------- | ----------------------------------- |
| `<input>` | VFS path to an audio or video file. |

| Option | What it does                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------ |
| `-v`   | Verbose output.                                                                                        |
| `-f`   | Transcribe again even a transcript made with the settings EMS runs now, unless it was written by hand. |

```bash
transcribe-file /archive/albums/Exempelalbum_2019/files/MVI_0042.MOV
```

With `JSON_OUTPUT=1`: the transcript written, or the one kept; a timed WebVTT transcript with chunk embeddings is written under the file.
