<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Archive commands

The commands the archive module adds. They are there once the module is installed. 131 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[album](#album) · [album-cover](#album-cover) · [album-profile](#album-profile) · [album-random](#album-random) · [album-span](#album-span) · [album-stack](#album-stack) · [archive-bridge](#archive-bridge) · [archive-parse](#archive-parse) · [assign-faces](#assign-faces) · [assign-speakers](#assign-speakers) · [auto-album-assign](#auto-album-assign) · [auto-album-cluster](#auto-album-cluster) · [cluster-faces](#cluster-faces) · [cluster-voices](#cluster-voices) · [compute-fingerprint](#compute-fingerprint) · [dayinhistory](#dayinhistory) · [detect-chapters](#detect-chapters) · [detect-faces](#detect-faces) · [device](#device) · [device-cover](#device-cover) · [device-create](#device-create) · [device-info](#device-info) · [device-link](#device-link) · [device-list](#device-list) · [device-match](#device-match) · [device-relink](#device-relink) · [device-remove-owner](#device-remove-owner) · [device-scan](#device-scan) · [device-set-owner](#device-set-owner) · [device-timeline](#device-timeline) · [device-update](#device-update) · [duplicates](#duplicates) · [embed-picture](#embed-picture) · [events-anniversaries](#events-anniversaries) · [exif-extract](#exif-extract) · [exiftool](#exiftool) · [face-add](#face-add) · [face-audit](#face-audit) · [face-confirm](#face-confirm) · [face-remove](#face-remove) · [face-reset](#face-reset) · [face-set-box](#face-set-box) · [file-set-description](#file-set-description) · [file-set-orientation](#file-set-orientation) · [file-set-photographer](#file-set-photographer) · [file-set-position](#file-set-position) · [file-set-text](#file-set-text) · [file-set-text-language](#file-set-text-language) · [file-set-time](#file-set-time) · [find-within](#find-within) · [generate-derivatives](#generate-derivatives) · [geocode-files](#geocode-files) · [geocode-location](#geocode-location) · [geocode-position](#geocode-position) · [hello](#hello) · [index-document](#index-document) · [label-model](#label-model) · [latest](#latest) · [location-link-media](#location-link-media) · [location-list](#location-list) · [location-locate](#location-locate) · [location-region](#location-region) · [location-timeline](#location-timeline) · [location-update](#location-update) · [media-details](#media-details) · [media-reembed](#media-reembed) · [media-resolve-time](#media-resolve-time) · [media-scan](#media-scan) · [media-sidecars](#media-sidecars) · [members-album](#members-album) · [merge-duplicates](#merge-duplicates) · [news-albums](#news-albums) · [onthisday-media](#onthisday-media) · [parse-eval](#parse-eval) · [person](#person) · [person-add-event](#person-add-event) · [person-check](#person-check) · [person-children](#person-children) · [person-cover](#person-cover) · [person-create](#person-create) · [person-detach](#person-detach) · [person-discard](#person-discard) · [person-faces](#person-faces) · [person-family-tree](#person-family-tree) · [person-fixup](#person-fixup) · [person-graph](#person-graph) · [person-how-related](#person-how-related) · [person-info](#person-info) · [person-list](#person-list) · [person-merge](#person-merge) · [person-name](#person-name) · [person-relatives](#person-relatives) · [person-remove](#person-remove) · [person-remove-home](#person-remove-home) · [person-set-home](#person-set-home) · [person-set-parent](#person-set-parent) · [person-set-partner](#person-set-partner) · [person-stats](#person-stats) · [person-timeline](#person-timeline) · [person-unknown](#person-unknown) · [person-update](#person-update) · [person-voices](#person-voices) · [promote-exif-attrs](#promote-exif-attrs) · [raw](#raw) · [read-text](#read-text) · [regenerate](#regenerate) · [regenerate-face-crops](#regenerate-face-crops) · [search-album](#search-album) · [search-device](#search-device) · [search-document](#search-document) · [search-location](#search-location) · [search-media](#search-media) · [search-people](#search-people) · [search-track](#search-track) · [staging](#staging) · [subcluster-faces](#subcluster-faces) · [subject-device](#subject-device) · [subject-location](#subject-location) · [subject-person](#subject-person) · [subjects-in](#subjects-in) · [tag-transfer](#tag-transfer) · [timeline](#timeline) · [timeline-facets](#timeline-facets) · [track-append](#track-append) · [track-create](#track-create) · [track-import](#track-import) · [track-list](#track-list) · [track-read](#track-read) · [track-stage](#track-stage) · [transcribe-file](#transcribe-file) · [voiceprint-file](#voiceprint-file)

## A

### `album`

Manage albums (create, info, list, set, add files)

<small>reads only</small>

```text
album [--name=<string>] [--share=<string>] [--create] [--description=<string>] [--cover=<string>] [--limit=<string>] [--cursor=<string>] <subcommand> <path> <files>...
```

| Argument       | What it is                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| `<subcommand>` | create \| info \| list \| set \| add.                                                                          |
| `<path>`       | album path.                                                                                                    |
| `<files>...`   | add: the files to put in the album: linked, or moved there out of staging; info: more albums, up to 50 in all. |

| Option                   | What it does                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `--name=<string>`        | create, add --create: the album display name (defaults to the slug)                                     |
| `--share=<string>`       | create, add --create: who sees it (default, private, shared, everyone; default: as your new albums are) |
| `--create`               | add: make the album first when it is not there.                                                         |
| `--description=<string>` | album description (create)                                                                              |
| `--cover=<string>`       | cover media path (create)                                                                               |
| `--limit=<string>`       | albums per list page (max 1000)                                                                         |
| `--cursor=<string>`      | list: the last name of the page before (pages are in the store's name order)                            |

```bash
album info /archive/albums/Exempelalbum_2019
album info /archive/albums/Exempelalbum_2019 /archive/albums/Sommar_2020
album create /archive/albums/Nytt_Exempelalbum --name 'Nytt exempelalbum'
album set /archive/albums/Exempelalbum_2019 spanStart 2019-05-30
album set /archive/albums/Exempelalbum_2019 next /archive/albums/Exempelalbum_2020
album create /archive/albums/Stugan --name 'Stugan' --share private
album add /archive/albums/Sommar_2020 /home/anna/staging/files/inbox/upload-2026-10-01/IMG_0001.jpg --create --name 'Sommar 2020'
```

With `JSON_OUTPUT=1`: for `info`, each album's list row with its id, cover, neighbours in a series and child count, a suggested album's parts and candidate albums, and the paths that name none (AlbumInfoAnswer); for `list`, the albums under a root, a suggested album's with what staging decides it by and its best match (AlbumListResult); for `add`, the files linked and moved and where each now files, whether it made the album, and the staging journal entries that undo the moves (AlbumAddResult); for `create` and `set`, nothing.

### `album-cover`

Give an album without a cover a random one of its own pictures (coverPhoto softlink)

<small>changes things</small>

```text
album-cover [--all] [--stale] [--limit=<number>] [--verbose] <album>
```

| Argument  | What it is              |
| --------- | ----------------------- |
| `<album>` | album path (repeatable) |

| Option             | What it does                                                                            |
| ------------------ | --------------------------------------------------------------------------------------- |
| `--all`            | every album in the tree but the staging suggestions.                                    |
| `--stale`          | only albums that have no cover yet (the default; accepted for symmetry with album-span) |
| `--limit=<number>` | stop after this many albums.                                                            |
| `--verbose`        | print each album as it is written.                                                      |

```bash
album-cover /archive/albums/Exempelalbum_2019
album-cover --all --stale --limit 50
```

With `JSON_OUTPUT=1`: nothing; a coverPhoto softlink is written for each album that had none.

### `album-profile`

Build the profile staging matches suggested groups against, beside each library album as its .profile: its members' times, days, places and people, and the pictures that stand for it.

<small>changes things</small>

```text
album-profile [--all] [--stale] [--force] <album>...
```

| Argument     | What it is                                               |
| ------------ | -------------------------------------------------------- |
| `<album>...` | library albums to profile; anything else is passed over. |

| Option    | What it does                                                            |
| --------- | ----------------------------------------------------------------------- |
| `--all`   | every library album, a page at a time.                                  |
| `--stale` | with --all: only albums with no profile, or one not checked for a week. |
| `--force` | build again even when the members are as they were.                     |

```bash
album-profile /archive/albums/Exempelalbum_2019
album-profile --all
album-profile --all --stale
```

With `JSON_OUTPUT=1`: how many albums were looked at, how many profiles were written, already current and passed over, how long it took, and the albums that failed (AlbumProfileResult).

### `album-random`

The path of one album somebody made, at random.

<small>reads only</small>

```text
album-random
```

### `album-span`

Write an album's time span (timeStart/timeEnd/mediaCount) onto the album node: its media's, widened to the days set by hand (spanStart/spanEnd)

<small>changes things</small>

```text
album-span [--all] [--stale] [--limit=<number>] [--verbose] [--dry-run] <album>
```

| Argument  | What it is              |
| --------- | ----------------------- |
| `<album>` | album path (repeatable) |

| Option             | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `--all`            | every album in the tree but the staging suggestions.      |
| `--stale`          | only albums that have no span yet.                        |
| `--limit=<number>` | stop after this many albums.                              |
| `--verbose`        | print each album as it is written.                        |
| `--dry-run`        | answer each album's span and its media's without writing. |

```bash
album-span /archive/albums/Exempelalbum_2019
album-span --all --stale
album-span --dry-run /archive/albums/Exempelalbum_2019
```

With `JSON_OUTPUT=1`: how many albums were scanned and updated, and each written album (each scanned one with --dry-run): its span, media count, first and last capture, and the hand-set ends still in force.

### `album-stack`

Reconcile album-local stacks of consecutive, perceptually similar photos.

<small>changes things</small>

```text
album-stack [--all] [--dry-run] [--threshold=<number>] [--max-gap-seconds=<number>] [--limit=<number>] [--verbose] <action> <album> <file>
```

| Argument   | What it is                                                           |
| ---------- | -------------------------------------------------------------------- |
| `<action>` | refresh, front, separate, allow, stack or unstack.                   |
| `<album>`  | album path.                                                          |
| `<file>`   | member path for front/separate/allow/unstack; two or more for stack. |

| Option                       | What it does                                                        |
| ---------------------------- | ------------------------------------------------------------------- |
| `--all`                      | refresh every album but the staging suggestions.                    |
| `--dry-run`                  | report without writing manifests or links.                          |
| `--threshold=<number>`       | minimum cosine of adjacent photos' SSCD fingerprints (default 0.75) |
| `--max-gap-seconds=<number>` | maximum adjacent capture-time gap (default 10)                      |
| `--limit=<number>`           | stop after this many albums.                                        |
| `--verbose`                  | print one line per album.                                           |

```bash
album-stack refresh /archive/albums/Exempelalbum_2019 --dry-run -v
album-stack front /archive/albums/Exempelalbum_2019 /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: refresh: how many albums were scanned and changed, stacks and stacked photos, and per album its manifest; the others: the album and member acted on.

### `archive-bridge`

Derive media and location domain events from VFS mutations (long-running)

<small>changes things</small>

```text
archive-bridge
```

```bash
archive-bridge
```

With `JSON_OUTPUT=1`: nothing; it runs until stopped, turning VFS mutations into media and location events.

### `archive-parse`

Turn a written search into search filters (kinds, years, people and locations as subjects, an area, what the pictures show)

<small>reads only</small>

```text
archive-parse [--rules] <query>
```

| Argument  | What it is                                        |
| --------- | ------------------------------------------------- |
| `<query>` | the search as written, a sentence or a few words. |

| Option    | What it does                                                                |
| --------- | --------------------------------------------------------------------------- |
| `--rules` | only the deterministic pass: years and kinds, no model and no name lookups. |

```bash
archive-parse 'Anna Andersson Göteborg 2019'
archive-parse --rules 'filmer från 2010'
```

With `JSON_OUTPUT=1`: text, kinds, from, to, people (with slug when one person), locations (a location node or an area), region, unresolved, source (llm or rules) and a one-line explain.

### `assign-faces`

Match an image's detected faces to existing people, creating unnamed people for the rest.

<small>changes things</small>

```text
assign-faces [--vote-threshold=<string>] [--attach-threshold=<string>] [--margin=<string>] [-k <string>] [--min-create-confidence=<string>] [--min-create-size=<string>] [--no-create] [--reassign] [--allow-duplicate-person] [--dry-run] [--verbose] <file>
```

| Argument | What it is                  |
| -------- | --------------------------- |
| `<file>` | VFS path to the image file. |

| Option                             | What it does                                                 |
| ---------------------------------- | ------------------------------------------------------------ |
| `--vote-threshold=<string>`        | min cosine similarity for a neighbour vote (default 0.5)     |
| `--attach-threshold=<string>`      | min winning vote weight to attach to a person (default 0.55) |
| `--margin=<string>`                | winner must beat runner-up by this factor (default 1.2)      |
| `-k <string>`                      | neighbours to consider per face (default 24)                 |
| `--min-create-confidence=<string>` | min detection confidence to seed a new person (default 0.7)  |
| `--min-create-size=<string>`       | min face box side in px to seed a new person (default 48)    |
| `--no-create`                      | attach only; never create an unnamed person.                 |
| `--reassign`                       | also re-decide faces a previous automatic run assigned.      |
| `--allow-duplicate-person`         | permit one person on two faces of the same image.            |
| `--dry-run`                        | report without writing.                                      |
| `--verbose`                        | print each face.                                             |

```bash
assign-faces /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
assign-faces --dry-run --no-create /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: each detected face with the person it was matched to, the score, and whether a new unnamed person was created.

### `assign-speakers`

Match a recording's voices to existing people, creating unnamed people for the rest.

<small>changes things</small>

```text
assign-speakers [--vote-threshold=<string>] [--attach-threshold=<string>] [--person-threshold=<string>] [--asd-person-threshold=<string>] [--margin=<string>] [-k <string>] [--min-create-seconds=<string>] [--asd-vote-weight=<string>] [--asd-min-score=<string>] [--no-create] [--reassign] [--dry-run] [--verbose] <file>
```

| Argument | What it is                           |
| -------- | ------------------------------------ |
| `<file>` | VFS path to the audio or video file. |

| Option                            | What it does                                                            |
| --------------------------------- | ----------------------------------------------------------------------- |
| `--vote-threshold=<string>`       | min cosine similarity for a neighbour vote (default 0.5)                |
| `--attach-threshold=<string>`     | min winning vote weight to attach to a person (default 0.55)            |
| `--person-threshold=<string>`     | min cosine similarity to the mean of the winner's voices (default 0.7)  |
| `--asd-person-threshold=<string>` | the same, for the person a confident lip-sync match names (default 0.5) |
| `--margin=<string>`               | winner must beat runner-up by this factor (default 1.2)                 |
| `-k <string>`                     | neighbours to consider per voice (default 24)                           |
| `--min-create-seconds=<string>`   | min seconds a voice spoke in all to seed a new person (default 10)      |
| `--asd-vote-weight=<string>`      | weight of a lip-sync match, as a similarity (default 0.9)               |
| `--asd-min-score=<string>`        | ignore a lip-sync match weaker than this (default 0.6)                  |
| `--no-create`                     | attach only; never create an unnamed person.                            |
| `--reassign`                      | also re-decide voices a previous automatic run assigned.                |
| `--dry-run`                       | report without writing.                                                 |
| `--verbose`                       | print each voice.                                                       |

```bash
assign-speakers /archive/albums/Exempelalbum_2019/files/MVI_0042.MOV
assign-speakers --dry-run /archive/albums/Exempelalbum_2019/files/MVI_0042.MOV
```

With `JSON_OUTPUT=1`: each voice with the person it was matched to and the score.

### `auto-album-assign`

Weigh media against the library albums they may belong in, as staging weighs its suggested groups, and write nothing.

<small>reads only</small>

```text
auto-album-assign [--per=<string>] [--root=<path>] [--top=<string>] [--holdout] [--evidence] <path>...
```

| Argument    | What it is                                               |
| ----------- | -------------------------------------------------------- |
| `<path>...` | files, albums, suggested groups or directories to match. |

| Option           | What it does                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `--per=<string>` | what one subject is: each path (group, the default), each media file (file), or all of it (set) |
| `--root=<path>`  | only albums under this directory (default /archive/albums)                                      |
| `--top=<string>` | candidates per subject (default 3)                                                              |
| `--holdout`      | weigh the albums holding the subjects' media as if those media were not in them.                |
| `--evidence`     | each candidate's evidence, beside its reasons.                                                  |

```bash
auto-album-assign /home/anna/staging/albums/inbox/2019-06-14 --evidence
auto-album-assign /home/anna/staging/files/inbox/upload-2026-10-01/IMG_0001.jpg /home/anna/staging/files/inbox/upload-2026-10-01/IMG_0002.jpg --per set --top 5
auto-album-assign /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg --per file --holdout
```

With `JSON_OUTPUT=1`: each subject's media, how many are dated, its candidate albums best first with how likely and why, how likely a new album is, the margin and how sure (AlbumMatchReport).

### `auto-album-cluster`

Show how the staging organizer would group the media at and under some paths (directories, albums or files) into suggested albums, writing nothing.

<small>reads only</small>

```text
auto-album-cluster [--user=<string>] [--strategy=<string>] [--significance=<string>] [--home=<string>] [--members] <path>...
```

| Argument    | What it is                                                        |
| ----------- | ----------------------------------------------------------------- |
| `<path>...` | directories (everything within), albums (their members) or files. |

| Option                    | What it does                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--user=<string>`         | whose home and household count (default the staging area's owner, else you)                                 |
| `--strategy=<string>`     | how to group (events, folders, none; default the category's, else events)                                   |
| `--significance=<string>` | how readily a day is a group of its own (fewer, normal, more; default the category's, else normal)          |
| `--home=<string>`         | home for every year, as lat,lng or a location path (default the residence each year, else the densest cell) |
| `--members`               | list each group's member paths.                                                                             |

```bash
auto-album-cluster /home/anna/staging/files/inbox
auto-album-cluster /archive/albums/2019-lake --members --significance more
```

With `JSON_OUTPUT=1`: AutoAlbumClusterReport: the media read, the home each year, and the groups proposed, by kind.

## C

### `cluster-faces`

Recognize untagged faces as existing people (label propagation) + optionally create unnamed people for leftover clusters.

<small>changes things</small>

```text
cluster-faces [--threshold=<string>] [--margin=<string>] [--min-votes=<string>] [-k <string>] [--min-cluster=<string>] [--cluster-threshold=<string>] [--max-cluster=<string>] [--max-people=<string>] [--create-people] [--mutual] [--no-mutual] [--dry-run] [--verbose]
```

| Option                         | What it does                                                       |
| ------------------------------ | ------------------------------------------------------------------ |
| `--threshold=<string>`         | min cosine similarity for a neighbour vote (default 0.5)           |
| `--margin=<string>`            | winning person must beat runner-up by this factor (default 1.2)    |
| `--min-votes=<string>`         | min winning vote weight to assign (default 0.5)                    |
| `-k <string>`                  | nearest neighbours per face (default 8)                            |
| `--min-cluster=<string>`       | min faces in a new-person cluster (default 3)                      |
| `--cluster-threshold=<string>` | stricter min similarity to group two untagged faces (default 0.6)  |
| `--max-cluster=<string>`       | skip clusters larger than this as likely chained (default 60)      |
| `--max-people=<string>`        | max unnamed people to create per run (default 500)                 |
| `--create-people`              | create an unnamed person per leftover cluster (off by default)     |
| `--mutual`                     | keep only mutual nearest-neighbour edges (on with --create-people) |
| `--no-mutual`                  | disable the mutual-neighbour filter.                               |
| `--dry-run`                    | report recognitions without writing personId.                      |
| `--verbose`                    | print each recognition.                                            |

```bash
cluster-faces --create-people --min-cluster 4
```

With `JSON_OUTPUT=1`: how many faces were recognised as existing people and how many clusters became new unnamed people.

### `cluster-voices`

Recognize untagged speech turns as existing people (label propagation) + optionally create unnamed people for leftover clusters.

<small>changes things</small>

```text
cluster-voices [--threshold=<string>] [--margin=<string>] [--min-votes=<string>] [-k <string>] [--min-cluster=<string>] [--cluster-threshold=<string>] [--max-cluster=<string>] [--max-people=<string>] [--create-people] [--mutual] [--no-mutual] [--dry-run] [--verbose]
```

| Option                         | What it does                                                       |
| ------------------------------ | ------------------------------------------------------------------ |
| `--threshold=<string>`         | min cosine similarity for a neighbour vote (default 0.5)           |
| `--margin=<string>`            | winning person must beat runner-up by this factor (default 1.2)    |
| `--min-votes=<string>`         | min winning vote weight to assign (default 0.5)                    |
| `-k <string>`                  | nearest neighbours per turn (default 8)                            |
| `--min-cluster=<string>`       | min turns in a new-speaker cluster (default 3)                     |
| `--cluster-threshold=<string>` | stricter min similarity to group two untagged turns (default 0.6)  |
| `--max-cluster=<string>`       | skip clusters larger than this as likely chained (default 60)      |
| `--max-people=<string>`        | max unnamed people to create per run (default 500)                 |
| `--create-people`              | create an unnamed person per leftover cluster (off by default)     |
| `--mutual`                     | keep only mutual nearest-neighbour edges (on with --create-people) |
| `--no-mutual`                  | disable the mutual-neighbour filter.                               |
| `--dry-run`                    | report recognitions without writing personId.                      |
| `--verbose`                    | print each recognition.                                            |

```bash
cluster-voices --create-people --min-cluster 4
```

With `JSON_OUTPUT=1`: how many speech turns were recognised and how many clusters became new unnamed people.

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

With `JSON_OUTPUT=1`: nothing; the fingerprints are written under the file, and `fingerprintedAt` on it, and the duplicate findings they change are decided.

## D

### `dayinhistory`

List media taken on a given day (MM-DD, default today) in past years.

<small>reads only</small>

```text
dayinhistory [--years=<number>] [--per-year=<number>] <day>
```

| Argument | What it is                   |
| -------- | ---------------------------- |
| `<day>`  | day as MM-DD (default today) |

| Option                | What it does                                          |
| --------------------- | ----------------------------------------------------- |
| `--years=<number>`    | years with media to collect, newest first (default 8) |
| `--per-year=<number>` | media kept per year, earliest first (default 4)       |

```bash
dayinhistory
dayinhistory 06-21 --years 20 --per-year 1
```

With `JSON_OUTPUT=1`: monthDay, and the years that have media taken on that day, newest first, each with its first media.

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

### `detect-faces`

Detect faces in an image or a video and keep the usable ones as face regions.

<small>changes things</small>

```text
detect-faces [-c <string>] [-f] [-v] <input>
```

| Argument  | What it is                          |
| --------- | ----------------------------------- |
| `<input>` | VFS path to an image or video file. |

| Option        | What it does                                                            |
| ------------- | ----------------------------------------------------------------------- |
| `-c <string>` | Minimum confidence (default: CFG_FACE_MIN_CONFIDENCE, 0.7)              |
| `-f`          | Re-detect: drop previous face-* regions first (manual-* boxes are kept) |
| `-v`          | Verbose output.                                                         |

```bash
detect-faces /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
detect-faces /archive/albums/Exempelalbum_2019/files/MVI_0012.MP4
```

With `JSON_OUTPUT=1`: each face found, with its box and the crop written under the file; on a video, one per person told apart, with when it is on screen.

### `device`

Camera and recording device management.

```text
device <subcommand>
```

| Argument       | What it is                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `<subcommand>` | Subcommand: create, info, update, list, match, scan, relink, set-owner, remove-owner, correct-time. |

### `device-cover`

Give a device without a cover of its own its newest picture, or its newest video with thumbnails (coverPhoto softlink)

<small>changes things</small>

```text
device-cover [--all] [--media] [--verbose] <device>
```

| Argument   | What it is                                             |
| ---------- | ------------------------------------------------------ |
| `<device>` | device path, or with --media a media file (repeatable) |

| Option      | What it does                                                   |
| ----------- | -------------------------------------------------------------- |
| `--all`     | every device.                                                  |
| `--media`   | the paths are media files: cover the device each is linked to. |
| `--verbose` | print each device as its cover is written.                     |

```bash
device-cover /archive/devices/Canon_EOS_5D
device-cover --all
device-cover --media /archive/albums/Exempelalbum_2019/files/clip.mp4
```

With `JSON_OUTPUT=1`: nothing; a coverPhoto softlink to its newest picture (or video) is written for each device without a cover somebody chose.

### `device-create`

Create a device node.

<small>changes things</small>

```text
device-create [--name=<string>] [--make=<string>] [--model=<string>] [--serial=<string>] [--timezone=<string>] [--digitizer] [--quicktime-utc] [--description=<string>] <target>
```

| Argument   | What it is                                                      |
| ---------- | --------------------------------------------------------------- |
| `<target>` | VFS path for the device node (default: /archive/devices/<name>) |

| Option                   | What it does                                                            |
| ------------------------ | ----------------------------------------------------------------------- |
| `--name=<string>`        | display name (required)                                                 |
| `--make=<string>`        | manufacturer, as exif writes it.                                        |
| `--model=<string>`       | model, as exif writes it.                                               |
| `--serial=<string>`      | serial number (the strong match key)                                    |
| `--timezone=<string>`    | IANA timezone, e.g. Europe/Stockholm.                                   |
| `--digitizer`            | scanner whose device dates are digitisation times, not capture times.   |
| `--quicktime-utc`        | keeps its videos' QuickTime CreateDate in UTC (phones), not local time. |
| `--description=<string>` | free-text note.                                                         |

### `device-info`

Show device details and owners.

<small>reads only</small>

```text
device-info <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to device node. |

### `device-link`

Link a file to its capture device using extracted exif, or to a device named by hand.

<small>changes things</small>

```text
device-link [--device=<path>] [-v] <input>
```

| Argument  | What it is                                                               |
| --------- | ------------------------------------------------------------------------ |
| `<input>` | VFS path to media file; with --device, files or directories (repeatable) |

| Option            | What it does                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `--device=<path>` | link to this device instead of matching the exif (directories link the files directly in them) |
| `-v`              | Verbose output.                                                                                |

### `device-list`

List all devices.

<small>reads only</small>

```text
device-list <root>
```

| Argument | What it is                                   |
| -------- | -------------------------------------------- |
| `<root>` | Device directory (default: /archive/devices) |

### `device-match`

Match a device by serial number or make/model.

<small>reads only</small>

```text
device-match [--serial=<string>] [--make=<string>] [--model=<string>] [--root=<string>]
```

| Option              | What it does                                 |
| ------------------- | -------------------------------------------- |
| `--serial=<string>` | Device serial number.                        |
| `--make=<string>`   | Camera manufacturer.                         |
| `--model=<string>`  | Camera model.                                |
| `--root=<string>`   | Device directory (default: /archive/devices) |

### `device-relink`

Link existing media to a registered device by its fingerprint.

<small>changes things</small>

```text
device-relink [--all] [--force] [--dry-run] [--reapply] <device>
```

| Argument   | What it is                                |
| ---------- | ----------------------------------------- |
| `<device>` | VFS path to device node (omit with --all) |

| Option      | What it does                                                                        |
| ----------- | ----------------------------------------------------------------------------------- |
| `--all`     | sweep every registered device that has a fingerprint.                               |
| `--force`   | relink files already claimed by another device.                                     |
| `--dry-run` | report what would change without writing.                                           |
| `--reapply` | link nothing; only re-date the files already linked (after a clock setting changed) |

### `device-remove-owner`

Unlink a person from a device (removes both halves)

<small>changes things</small>

```text
device-remove-owner <device> <person>
```

| Argument   | What it is                                       |
| ---------- | ------------------------------------------------ |
| `<device>` | VFS path to device node.                         |
| `<person>` | VFS path to person node, or the owner link name. |

### `device-scan`

Propose devices seen in media but not registered.

<small>reads only</small>

```text
device-scan [--limit=<string>]
```

| Option             | What it does                          |
| ------------------ | ------------------------------------- |
| `--limit=<string>` | max proposals to report (default 100) |

### `device-set-owner`

Link a person as owner of a device (dated relation pair)

<small>changes things</small>

```text
device-set-owner [--from=<string>] [--to=<string>] [--update] <device> <person>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<device>` | VFS path to device node. |
| `<person>` | VFS path to person node. |

| Option            | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `--from=<string>` | ownership start date (YYYY[-MM[-DD]])                               |
| `--to=<string>`   | ownership end date (YYYY[-MM[-DD]])                                 |
| `--update`        | rewrite the dates of an existing owner; an omitted date is cleared. |

### `device-timeline`

One device's history as a chronological feed: owners getting and giving it up, its events and the albums with photos it took.

<small>reads only</small>

```text
device-timeline [--no-albums] <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to device node. |

| Option        | What it does                                 |
| ------------- | -------------------------------------------- |
| `--no-albums` | skip the albums, which are most of the cost. |

```bash
device-timeline /archive/devices/canon-eos
```

With `JSON_OUTPUT=1`: the device's history in order: owners getting and giving it up, its events and the albums with photos it took.

### `device-update`

Change a device's settings.

<small>changes things</small>

```text
device-update [--name=<string>] [--make=<string>] [--model=<string>] [--serial=<string>] [--timezone=<string>] [--digitizer] [--quicktime-utc] [--description=<string>] [--clear=<string>] <device>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<device>` | VFS path to device node. |

| Option                   | What it does                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| `--name=<string>`        | display name.                                                          |
| `--make=<string>`        | manufacturer, as exif writes it.                                       |
| `--model=<string>`       | model, as exif writes it.                                              |
| `--serial=<string>`      | serial number (the strong match key)                                   |
| `--timezone=<string>`    | IANA timezone, e.g. Europe/Stockholm.                                  |
| `--digitizer`            | mark as a scanner and suppress its device dates on linked media.       |
| `--quicktime-utc`        | read its videos' QuickTime CreateDate as UTC (phones), not local time. |
| `--description=<string>` | free-text note.                                                        |
| `--clear=<string>`       | remove a field (repeatable)                                            |

### `duplicates`

Find duplicate files by checksum (exact) or by fingerprint, copies with other bytes (--fuzzy); record the staged exact copies of files (--record), or look checksums up before an upload (--checksum)

<small>reads only</small>

```text
duplicates [--fuzzy] [-t <string>] [-n <string>] [--min-count=<string>] [--min-size=<string>] [--against=<string>] [--record] [--checksum] <path>...
```

| Argument    | What it is                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| `<path>...` | file, subtree, or omit for the whole library; --record takes files and directories, --checksum checksums. |

| Option                 | What it does                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--fuzzy`              | match fingerprints (resized, cropped, edited or rescanned copies) instead of checksums.                                                            |
| `-t <string>`          | fuzzy similarity threshold (default 0.75 image / 0.80 video / 0.70 audio)                                                                          |
| `-n <string>`          | fuzzy: max results for a single file (default 20)                                                                                                  |
| `--min-count=<string>` | exact: minimum copies to report a group (default 2)                                                                                                |
| `--min-size=<string>`  | exact: ignore files smaller than this many bytes.                                                                                                  |
| `--against=<string>`   | exact: require copies in both the scoped subtree and this second root.                                                                             |
| `--record`             | decide again the duplicate findings of these staged files, of the staged copies of these library files, and of the files within these directories. |
| `--checksum`           | the media originals you can read in the library or your own staging inbox that carry these checksums (at most 1000)                                |

```bash
duplicates /archive/albums/Exempelalbum_2019
duplicates /home/anna/staging/files --against /archive/albums
duplicates --fuzzy --min-count 2 /archive/albums
duplicates --record /home/anna/staging/files/inbox/upload-2026-10-01/IMG_0001.jpg
duplicates --checksum 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

With `JSON_OUTPUT=1`: groups of files that share a checksum, or with --fuzzy a fingerprint; --record: DuplicatesRecorded; --checksum: ChecksumMatches.

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

| Option | What it does                          |
| ------ | ------------------------------------- |
| `-v`   | Verbose output.                       |
| `-f`   | Embed again even if already embedded. |

```bash
embed-picture /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the picture vectors are written under the file's metadata/picture.

### `events-anniversaries`

Birthdays, memorials and wedding anniversaries around a date, as events entries (core events gathers them)

<small>reads only</small>

```text
events-anniversaries [--days-ahead=<number>] [--days-past=<number>] [--limit=<number>] [--today=<string>] [--people=<path>]
```

| Option                  | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `--days-ahead=<number>` | how far forward to look (default 30)                            |
| `--days-past=<number>`  | how far back to look (default 7)                                |
| `--limit=<number>`      | anniversaries returned; milestones survive the cut (default 16) |
| `--today=<string>`      | the date to look around, YYYY-MM-DD (default today, UTC)        |
| `--people=<path>`       | people root to read (default /archive/people)                   |

```bash
events-anniversaries
events-anniversaries --days-ahead 0 --days-past 0
events-anniversaries --today 2026-12-24 --days-ahead 7
```

With `JSON_OUTPUT=1`: each birthday, milestone memorial and wedding anniversary in the window as an events entry, in date order: the day, the sentence, whether it is a milestone, the person, and the route that draws it.

### `exif-extract`

Extract EXIF metadata from file and create exif/position nodes; the file's paired sidecar (<file>/sidecar) dates and places it too, a staged file is dated by its category's time rules, and its exact copies among its inbox's files are recorded with it. A staged exact copy of a file its owner can read is recorded and not indexed (duplicate.deferred) unless forced.

<small>changes things</small>

```text
exif-extract [-f] [-v] <input>
```

| Argument  | What it is        |
| --------- | ----------------- |
| `<input>` | VFS path to file. |

| Option | What it does                                                                      |
| ------ | --------------------------------------------------------------------------------- |
| `-f`   | Re-extract even when metadata/exif already exists, and index a staged exact copy. |
| `-v`   | Verbose output.                                                                   |

```bash
exif-extract /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; exif and position nodes are written under the file, and its duplicate finding on a staged file; for a deferred copy only that finding.

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

## F

### `face-add`

Add a human-drawn face box to an image as a new unidentified person.

<small>changes things</small>

```text
face-add [--box=<string>] [--no-crop] <input>
```

| Argument  | What it is                 |
| --------- | -------------------------- |
| `<input>` | VFS path to an image file. |

| Option           | What it does                               |
| ---------------- | ------------------------------------------ |
| `--box=<string>` | display-frame fractions: x,y,width,height. |
| `--no-crop`      | create the crop node without rendering it. |

```bash
face-add --box 0.1,0.2,0.3,0.4 /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: the new face and the unidentified person created for it.

### `face-audit`

Mark transferred faces whose nearest human-named face in another photo is somebody else.

<small>changes things</small>

```text
face-audit [--dry-run] [--verbose]
```

| Option      | What it does                                 |
| ----------- | -------------------------------------------- |
| `--dry-run` | report without marking or clearing anything. |
| `--verbose` | list every doubtful face.                    |

```bash
face-audit --dry-run
face-audit --verbose
```

With `JSON_OUTPUT=1`: how many transferred faces look like somebody else, per person; marks them for review in the Faces tab.

### `face-confirm`

Confirm that regions show the person they are assigned to.

<small>changes things</small>

```text
face-confirm [--dry-run] <region>...
```

| Argument      | What it is                            |
| ------------- | ------------------------------------- |
| `<region>...` | region paths, <image>/regions/<name>. |

| Option      | What it does                             |
| ----------- | ---------------------------------------- |
| `--dry-run` | check the regions without changing them. |

```bash
face-confirm /archive/photos/2001/IMG_0001.jpg/regions/face-0
```

With `JSON_OUTPUT=1`: the regions confirmed.

### `face-remove`

Remove a face and its person when it was the person's only unidentified face.

<small>changes things</small>

```text
face-remove <face>
```

| Argument | What it is            |
| -------- | --------------------- |
| `<face>` | VFS path to a region. |

```bash
face-remove /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg/regions/face-1
```

With `JSON_OUTPUT=1`: nothing; the face is removed.

### `face-reset`

Undo automatic face→person assignments by provenance, leaving manual ones intact.

<small>changes things</small>

```text
face-reset [--source=<string>] [--delete-unnamed] [--dry-run] [--verbose]
```

| Option              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `--source=<string>` | auto \| cluster \| transfer \| all (required) |
| `--delete-unnamed`  | also delete every unnamed person.             |
| `--dry-run`         | report without changing anything.             |
| `--verbose`         | print each face.                              |

```bash
face-reset --source cluster-faces --dry-run
```

With `JSON_OUTPUT=1`: how many automatic assignments would be undone, by provenance.

### `face-set-box`

Change a region's box and regenerate its preview crop; a moved face stops voting in recognition.

<small>changes things</small>

```text
face-set-box [--box=<string>] [--no-crop] <face>
```

| Argument | What it is            |
| -------- | --------------------- |
| `<face>` | VFS path to a region. |

| Option           | What it does                               |
| ---------------- | ------------------------------------------ |
| `--box=<string>` | display-frame fractions: x,y,width,height. |
| `--no-crop`      | leave the crop bytes for regeneration.     |

```bash
face-set-box --box 0.1,0.2,0.3,0.4 /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg/regions/face-1
```

With `JSON_OUTPUT=1`: nothing; the box is changed and its crop regenerated.

### `file-set-description`

Set a file's hand-written description.

<small>changes things</small>

```text
file-set-description [--text=<string>] [--text-base64=<string>] <file>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<file>` | VFS path to file node. |

| Option                   | What it does                                          |
| ------------------------ | ----------------------------------------------------- |
| `--text=<string>`        | the description; empty clears it.                     |
| `--text-base64=<string>` | the description, base64-encoded (for multi-line text) |

```bash
file-set-description --text 'Ett exempel' /archive/albums/Exempelalbum_2019/files/IMG_0042.jpg
```

With `JSON_OUTPUT=1`: nothing; the description is written.

### `file-set-orientation`

Rotate or mirror a file for good: writes angle/angleManual/mirror, remaps face boxes and regenerates renditions (a video re-encodes on the media pool)

<small>changes things</small>

```text
file-set-orientation [--rotate=<string>] [--angle=<string>] [--mirror] [--toggle-mirror] [--no-regenerate] [-v] <file>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<file>` | VFS path to file node. |

| Option              | What it does                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `--rotate=<string>` | relative turn: cw \| ccw \| 180.                                                                |
| `--angle=<string>`  | absolute angle: 0 \| 90 \| 180 \| 270.                                                          |
| `--mirror`          | set the horizontal flip (--no-mirror clears it)                                                 |
| `--toggle-mirror`   | flip the horizontal flip.                                                                       |
| `--no-regenerate`   | leave the still renditions and face crops stale (a video is still re-encoded on the media pool) |
| `-v`                | verbose output.                                                                                 |

```bash
file-set-orientation --rotate 90 /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the file is rotated for good and its renditions regenerated.

### `file-set-photographer`

Link the person who took a file (photographer softlink)

<small>changes things</small>

```text
file-set-photographer <file> <person>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<file>`   | VFS path to file node.   |
| `<person>` | VFS path to person node. |

```bash
file-set-photographer /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: nothing; the photographer link is written.

### `file-set-position`

Set a manual location override (positionManual + child position node) on a file, or clear its location.

<small>changes things</small>

```text
file-set-position [--lat=<string>] [--lng=<string>] [--clear] <file>... <lat> <lng>
```

| Argument    | What it is                                         |
| ----------- | -------------------------------------------------- |
| `<file>...` | VFS paths to file nodes (several with --lat/--lng) |
| `<lat>`     | latitude (positional; use --lat= if negative)      |
| `<lng>`     | longitude (positional; use --lng= if negative)     |

| Option           | What it does                                                         |
| ---------------- | -------------------------------------------------------------------- |
| `--lat=<string>` | latitude, as --lat=<n> — required form for a negative coordinate.    |
| `--lng=<string>` | longitude, as --lng=<n> — required form for a negative coordinate.   |
| `--clear`        | take away the position and the location link instead of setting one. |

```bash
file-set-position /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg 59.0000 18.0000
```

With `JSON_OUTPUT=1`: nothing; a manual location is written onto the file, or its location is taken away.

### `file-set-text`

Write the text in a picture by hand, in place of what was read from it.

<small>changes things</small>

```text
file-set-text [--text=<string>] [--text-base64=<string>] <file>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<file>` | VFS path to a picture. |

| Option                   | What it does                                   |
| ------------------------ | ---------------------------------------------- |
| `--text=<string>`        | the text; empty removes it.                    |
| `--text-base64=<string>` | the text, base64-encoded (for multi-line text) |

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

### `file-set-time`

Set, annotate or clear a hand-typed capture time (whenManual) on one or more files.

<small>changes things</small>

```text
file-set-time [--note=<string>] [--clear] <file> <when>
```

| Argument | What it is                                                                |
| -------- | ------------------------------------------------------------------------- |
| `<file>` | VFS path to file node.                                                    |
| `<when>` | Capture time, YYYY[-MM[-DD[THH:MM[:SS]]]] (repeatable as file/time pairs) |

| Option            | What it does                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| `--note=<string>` | Why this time is what it is — shown beside the date.                      |
| `--clear`         | Remove the manual time and note, letting the exif-derived date win again. |

```bash
file-set-time /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg 2019-06-01T12:00
file-set-time --clear /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: FileSetTimeAnswer: each file with the capture time it now resolves to and its source.

### `find-within`

Find positions inside a geographic bounding box: media points and locations.

<small>reads only</small>

```text
find-within [--north=<string>] [--south=<string>] [--east=<string>] [--west=<string>] [--limit=<string>] [--cursor=<string>] [--from=<string>] [--to=<string>] [--cell=<string>] [--include-hits] [--covers] [--facets] [--dir=<string>] [--person=<string>] [--location=<string>] [--tag=<string>] [-q <string>] [--under=<path>]
```

| Option                | What it does                                                                 |
| --------------------- | ---------------------------------------------------------------------------- |
| `--north=<string>`    | north edge latitude.                                                         |
| `--south=<string>`    | south edge latitude.                                                         |
| `--east=<string>`     | east edge longitude.                                                         |
| `--west=<string>`     | west edge longitude.                                                         |
| `--limit=<string>`    | page size (default: 100; with --cell, max points scanned, default 200000)    |
| `--cursor=<string>`   | resume after this row, from a previous answer's cursor.                      |
| `--from=<string>`     | taken at/after this date (2020, 2020-05, 2020-05-01)                         |
| `--to=<string>`       | taken before this date, exclusive (--to 2000 includes all of 2000)           |
| `--cell=<string>`     | cluster media into a grid of this many degrees and report counts.            |
| `--include-hits`      | with --cell, include members when the filtered answer has at most 500 media. |
| `--covers`            | with --cell, give each cell of several pictures one of them as its cover.    |
| `--facets`            | answer with per-day, per-month and per-year counts instead of contents.      |
| `--dir=<string>`      | which way to page from the cursor: desc, asc (default desc, back in time)    |
| `--person=<string>`   | only media this person is tagged in (slug or path)                           |
| `--location=<string>` | only media linked to this location (slug or path)                            |
| `--tag=<string>`      | only media carrying this label.                                              |
| `-q <string>`         | only media matching this text, searched inside the box.                      |
| `--under=<path>`      | only media in this album or folder, as `members` lists it.                   |

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

| Option            | What it does                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `-v`              | Verbose output.                                                                                                                               |
| `-f`              | Force regenerate even if derivatives exist.                                                                                                   |
| `--only=<string>` | Generate one class only: still \| transcode \| storyboard.                                                                                    |
| `--size=<string>` | Generate only these sizes (comma-separated): thumb \| grid \| small \| medium \| large \| face \| preview \| 1080p \| storyboard \| standard. |
| `--prune`         | Delete renditions under thumbnails/ that are no longer targets.                                                                               |

```bash
generate-derivatives /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
generate-derivatives --only still /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: nothing; the thumbnail, display and transcode renditions are written.

### `geocode-files`

Batch reverse geocode the position nodes of the files under a directory.

<small>changes things</small>

```text
geocode-files [-r] [-f] [-v] <path>
```

| Argument | What it is          |
| -------- | ------------------- |
| `<path>` | VFS directory path. |

| Option | What it does                     |
| ------ | -------------------------------- |
| `-r`   | Recurse into subdirectories.     |
| `-f`   | Force re-geocode even if cached. |
| `-v`   | Verbose output.                  |

```bash
geocode-files -r /archive/albums/Exempelalbum_2019
```

With `JSON_OUTPUT=1`: how many position nodes were geocoded.

### `geocode-location`

Resolve a location's written address to coordinates (Nominatim forward geocoding)

<small>changes things</small>

```text
geocode-location [--force] [--dry-run] [--radius=<string>] [--countrycodes=<string>] [--query=<string>] [--verbose] [--accept=<number>] [--drawn] <path>
```

| Argument | What it is                                              |
| -------- | ------------------------------------------------------- |
| `<path>` | VFS path to a location (e.g. /archive/locations/<slug>) |

| Option                    | What it does                                                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `--force`                 | Re-geocode even if already placed or attempted.                                                                                  |
| `--dry-run`               | Report the query without calling the geocoder.                                                                                   |
| `--radius=<string>`       | Radius in meters for the resulting circle (default 50)                                                                           |
| `--countrycodes=<string>` | Restrict to these ISO country codes (default: se; empty to disable)                                                              |
| `--query=<string>`        | Override the address text to look up.                                                                                            |
| `--verbose`               | Print skipped locations too.                                                                                                     |
| `--accept=<number>`       | Take the geocoder's suggestion with this index (from the location's geocodeCandidates) instead of looking up; --radius sizes it. |
| `--drawn`                 | Record that the location's shape was drawn by hand, answering any pending review.                                                |

```bash
geocode-location /archive/locations/Exempelstad
geocode-location /archive/locations/Exempelstad --accept 0 --radius 150
```

With `JSON_OUTPUT=1`: the coordinates the location's address resolved to.

### `geocode-position`

Reverse geocode a file's position node using Nominatim (OSM)

<small>changes things</small>

```text
geocode-position [-f] [-v] <path>
```

| Argument | What it is                                    |
| -------- | --------------------------------------------- |
| `<path>` | VFS path to a position node, <file>/position. |

| Option | What it does                     |
| ------ | -------------------------------- |
| `-f`   | Force re-geocode even if cached. |
| `-v`   | Verbose output.                  |

```bash
geocode-position /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg/position
```

With `JSON_OUTPUT=1`: the address the coordinates resolved to.

## H

### `hello`

Say hello (example TypeScript module command)

<small>reads only</small>

```text
hello <name>
```

| Argument | What it is     |
| -------- | -------------- |
| `<name>` | name to greet. |

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

## L

### `label-model`

Learn labels from their pictures, so search --like /archive/tags/<label> can suggest where else they belong.

<small>reads only</small>

```text
label-model [--all] [-v] [--if-stale] <subcommand> <label> <paths>...
```

| Argument       | What it is                                                |
| -------------- | --------------------------------------------------------- |
| `<subcommand>` | train \| show \| list \| reject \| unreject.              |
| `<label>`      | the label (train takes several)                           |
| `<paths>...`   | reject, unreject: files or albums that are not the label. |

| Option       | What it does                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `--all`      | train: every label in use, and every word of the vocabulary in the archive's language.                                     |
| `-v`         | train: report how long each phase took.                                                                                    |
| `--if-stale` | train: only labels whose members or rejections changed since they were trained, or that were trained more than a week ago. |

```bash
label-model train exempeletikett
label-model train --all --if-stale
label-model reject exempeletikett /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
search --like /archive/tags/exempeletikett --kind photo,video
```

With `JSON_OUTPUT=1`: for `train`, each label's LabelTrainResult; for `show`, the LabelModelSummary; for `list`, every kept model's LabelModelSummary; for `reject` and `unreject`, how many the label has rejected.

### `latest`

List the most recently captured media, newest first.

<small>reads only</small>

```text
latest <count>
```

| Argument  | What it is                              |
| --------- | --------------------------------------- |
| `<count>` | number of results (default 10, max 500) |

```bash
latest
latest 20
```

With `JSON_OUTPUT=1`: the most recently captured media, newest first, with capture time and dimensions.

### `location-link-media`

Link geotagged media files to the location whose shape contains them (<file>/location softlink)

<small>changes things</small>

```text
location-link-media [--location=<path>] [--point=<path>] [--root=<string>] [--dry-run] [--force] [--verbose]
```

| Option              | What it does                                                                |
| ------------------- | --------------------------------------------------------------------------- |
| `--location=<path>` | only the files inside this location's shape, and those it no longer covers. |
| `--point=<path>`    | only the file owning this <file>/position node.                             |
| `--root=<string>`   | media root to scan (default: /archive/albums)                               |
| `--dry-run`         | report without creating or removing links.                                  |
| `--force`           | replace links made by hand or by the import too.                            |
| `--verbose`         | print each link.                                                            |

```bash
location-link-media
location-link-media --location /archive/locations/Exempelparken
```

With `JSON_OUTPUT=1`: how many files were linked, unlinked, skipped and left outside every location.

### `location-list`

List locations with their saved coordinates.

<small>reads only</small>

```text
location-list [--without-coordinates] <root>
```

| Argument | What it is                                       |
| -------- | ------------------------------------------------ |
| `<root>` | Location directory (default: /archive/locations) |

| Option                  | What it does                     |
| ----------------------- | -------------------------------- |
| `--without-coordinates` | skip the position-registry scan. |

### `location-locate`

Give a location coordinates from its linked media, falling back to geocoding its address.

<small>changes things</small>

```text
location-locate [--all] [--root=<string>] [--limit=<string>] [--min-points=<string>] [--max-spread=<string>] [--radius=<string>] [--no-geocode] [--force] [--refresh] [--dry-run] [--verbose] <path>
```

| Argument | What it is                                                                |
| -------- | ------------------------------------------------------------------------- |
| `<path>` | VFS path to a location (e.g. /archive/locations/<slug>); omit with --all. |

| Option                  | What it does                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `--all`                 | Process every location under --root.                                                             |
| `--root=<string>`       | Locations root (default: /archive/locations)                                                     |
| `--limit=<string>`      | Stop after this many locations.                                                                  |
| `--min-points=<string>` | Fewest geotagged files a centroid may rest on (default 2)                                        |
| `--max-spread=<string>` | Reject a centroid whose media spread wider than this, in meters (default 25000)                  |
| `--radius=<string>`     | Fixed radius in meters, instead of one derived from the media spread.                            |
| `--no-geocode`          | Centroid only — never fall back to the address geocoder.                                         |
| `--force`               | Re-locate locations that already have a shape.                                                   |
| `--refresh`             | Re-derive a placed location too, writing only what moved; never touches coordinates set by hand. |
| `--dry-run`             | Report what would be applied without writing anything.                                           |
| `--verbose`             | Print each location.                                                                             |

### `location-region`

Turn a location name (a city, a country, an area) into the region search --bbox filters on.

<small>reads only</small>

```text
location-region [--countrycodes=<string>] [--bbox-only] <name>...
```

| Argument    | What it is                                          |
| ----------- | --------------------------------------------------- |
| `<name>...` | the location as the user named it, in any language. |

| Option                    | What it does                                                          |
| ------------------------- | --------------------------------------------------------------------- |
| `--countrycodes=<string>` | limit the match to these countries, comma-separated ISO codes (se,no) |
| `--bbox-only`             | print only the box, for search --bbox=$(…)                            |

```bash
location-region Exempelstad
search --bbox=$(location-region Exempelstad --bbox-only) --group-by album
```

With `JSON_OUTPUT=1`: the location's full name and its bounding box as north,south,east,west — the form search --bbox= takes.

### `location-timeline`

What happened at one location as a chronological feed: residents moving in and out, its events and the albums with photos from it.

<small>reads only</small>

```text
location-timeline [--no-albums] <target>
```

| Argument   | What it is                 |
| ---------- | -------------------------- |
| `<target>` | VFS path to location node. |

| Option        | What it does                                 |
| ------------- | -------------------------------------------- |
| `--no-albums` | skip the albums, which are most of the cost. |

```bash
location-timeline /archive/locations/ekbacksvagen
```

With `JSON_OUTPUT=1`: the location's history in order: moves in and out, its events and the albums with photos taken there.

### `location-update`

Change a location's name, address, description, city or country.

<small>changes things</small>

```text
location-update [--name=<string>] [--address=<string>] [--description=<string>] [--city=<string>] [--country=<string>] [--clear=<string>] <target>
```

| Argument   | What it is                 |
| ---------- | -------------------------- |
| `<target>` | VFS path to location node. |

| Option                   | What it does                                                        |
| ------------------------ | ------------------------------------------------------------------- |
| `--name=<string>`        | what the location is called.                                        |
| `--address=<string>`     | the written address; a change is geocoded again by location-upkeep. |
| `--description=<string>` | free text about the location.                                       |
| `--city=<string>`        | city.                                                               |
| `--country=<string>`     | country.                                                            |
| `--clear=<string>`       | remove a field (repeatable): address, description, city or country. |

```bash
location-update /archive/locations/ekbacksvagen --address 'Ekbacksvägen 4, 123 45 Exempelby'
location-update /archive/locations/ekbacksvagen --clear description
```

With `JSON_OUTPUT=1`: which fields changed.

## M

### `media-details`

Read description, time, location, location, device with owners, albums, tagged people (with age) and comments for a media file.

<small>reads only</small>

```text
media-details [--album=<path>] [--fields=<string>] <file>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<file>` | VFS path to file node. |

| Option              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `--album=<path>`    | album context for stack membership and exclusion details. |
| `--fields=<string>` | extra fields to include: raw (the full exiftool dump)     |

```bash
media-details /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg
```

With `JSON_OUTPUT=1`: the file's description, when and where it was taken, its albums, and the people in it with their ages.

### `media-reembed`

Embed the extracted texts, transcripts and hand-written descriptions already stored into the current text space, from the stored text alone.

<small>changes things</small>

```text
media-reembed [-l <number>] [-f] [-v] <path>...
```

| Argument    | What it is                                                          |
| ----------- | ------------------------------------------------------------------- |
| `<path>...` | files to embed the texts of (default: every text the archive holds) |

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

### `media-resolve-time`

Re-resolve media originals' capture times from their stored exif and manual sources.

<small>changes things</small>

```text
media-resolve-time [--dry-run] [--under=<path>] [--device=<path>] [-v]
```

| Option            | What it does                                                                |
| ----------------- | --------------------------------------------------------------------------- |
| `--dry-run`       | report what would change, write nothing.                                    |
| `--under=<path>`  | only the files in the tree under this directory or album, or this one file. |
| `--device=<path>` | only files linked to this device (its devicePath)                           |
| `-v`              | print every file that changes.                                              |

```bash
media-resolve-time --dry-run
media-resolve-time --under /archive/albums/Exempelalbum_2019
media-resolve-time --device /archive/devices/Exempelkamera --dry-run
```

With `JSON_OUTPUT=1`: how many files had their capture time re-resolved, and from which source.

### `media-scan`

Emit media events for files the bridge never saw (backfill / gap recovery)

<small>changes things</small>

```text
media-scan [--limit=<number>] [--max-active=<number>] [--depth=<number>] [--scan-limit=<number>] [--restart] [--no-gaps] [--only=<string>] [-n] [-v] <root>
```

| Argument | What it is                                |
| -------- | ----------------------------------------- |
| `<root>` | Subtree to scan (default /archive/albums) |

| Option                  | What it does                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--limit=<number>`      | Maximum events to emit per run (default 1000)                                                                                                 |
| `--max-active=<number>` | Cap running media-ingest instances plus queued triggers (default 500)                                                                         |
| `--depth=<number>`      | Maximum directory depth (default 12)                                                                                                          |
| `--scan-limit=<number>` | Maximum files examined per run; 0 walks the whole subtree (default 20000)                                                                     |
| `--restart`             | Ignore the stored resume point and start the pass at the top.                                                                                 |
| `--no-gaps`             | Only discover unindexed files; skip half-indexed ones.                                                                                        |
| `--only=<string>`       | Emit only these fact types, comma-separated (e.g. media.picture.stale); the cursor still moves, so follow with a --restart pass for the rest. |
| `-n`                    | Dry run — report what would be emitted.                                                                                                       |
| `-v`                    | Verbose output.                                                                                                                               |

```bash
media-scan /archive/albums/Exempelalbum_2019
media-scan --limit 500 /archive/albums
media-scan --only media.picture.stale --scan-limit 0 /archive/albums
```

With `JSON_OUTPUT=1`: how many files were announced to the media pipeline.

### `media-sidecars`

Pair the Google Photos Takeout JSON and XMP sidecars in a folder with their files, as <file>/sidecar, and carry over their dates, places, captions and favourites.

<small>changes things</small>

```text
media-sidecars [--dry-run] <folder>
```

| Argument   | What it is                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------- |
| `<folder>` | the folder whose sidecars are paired, at any depth; the working directory when none is given. |

| Option      | What it does                                                   |
| ----------- | -------------------------------------------------------------- |
| `--dry-run` | count what would be paired and carried over, changing nothing. |

```bash
media-sidecars /home/anna/staging/files/google-photos/upload-2026-10-18
media-sidecars '/home/anna/staging/files/google-photos/Takeout/Google Photos/Sommar i Exempelstad' --dry-run
```

With `JSON_OUTPUT=1`: MediaSidecarsAnswer: the sidecars found, paired, shared and unmatched, and what the files were given.

### `members-album`

List an album's media by the album's own rules: an imported album's files/ folder, links followed, the cover left out, stacks of similar photos folded.

<small>reads only</small>

```text
members-album [--include-stacked] <album>
```

| Argument  | What it is  |
| --------- | ----------- |
| `<album>` | album path. |

| Option              | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `--include-stacked` | text output: also list the photos folded under a stack. |

```bash
members-album /archive/albums/Exempelalbum_2019
members-album /archive/albums/Exempelalbum_2019 --include-stacked
```

With `JSON_OUTPUT=1`: every member, stacked ones included: its path, node id, the link it is a member through, and for a stacked photo the front that stands for it and the stack size.

### `merge-duplicates`

Keep one file of a set of duplicates, fill it in from the others, and move them to the trash as one batch.

<small>changes things</small>

```text
merge-duplicates [--batch=<string>] [--label=<string>] [--dry-run] <keep> <drop>...
```

| Argument    | What it is                             |
| ----------- | -------------------------------------- |
| `<keep>`    | the file kept.                         |
| `<drop>...` | the duplicates dropped into the trash. |

| Option             | What it does                                                                   |
| ------------------ | ------------------------------------------------------------------------------ |
| `--batch=<string>` | trash into this batch (an id from trash put --batch), or with no id a new one. |
| `--label=<string>` | what the batch is called in the trash.                                         |
| `--dry-run`        | say what would be filled in and trashed, changing nothing.                     |

```bash
merge-duplicates /archive/albums/Exempelalbum/files/IMG_0001.jpg /home/anna/staging/files/inbox/IMG_0001.jpg
merge-duplicates --label 'Copies of a sailboat' /archive/albums/Exempelalbum/files/IMG_0002.jpg /home/anna/staging/files/inbox/IMG_0002.jpg --dry-run
```

With `JSON_OUTPUT=1`: MergeDuplicatesResult: the fields filled in, how many were trashed, and the batch that trash restore takes back.

## N

### `news-albums`

Recently created albums, newest first, with who made them, as news entries (core news gathers them)

<small>reads only</small>

```text
news-albums [--limit=<number>] [--preview=<number>] [--albums=<path>]
```

| Option               | What it does                                 |
| -------------------- | -------------------------------------------- |
| `--limit=<number>`   | albums returned (default 8)                  |
| `--preview=<number>` | pictures kept per album (default 5)          |
| `--albums=<path>`    | album root to read (default /archive/albums) |

```bash
news-albums
news-albums --limit 20 --preview 0
```

With `JSON_OUTPUT=1`: the newest albums by creation time as news entries: when, who made it, a title, the album, and the route that draws it with the member count and a few pictures.

## O

### `onthisday-media`

The years with pictures taken on a day (MM-DD, default today), as onthisday entries (core onthisday gathers them)

<small>reads only</small>

```text
onthisday-media [--limit=<number>] <day>
```

| Argument | What it is                        |
| -------- | --------------------------------- |
| `<day>`  | day as MM-DD (default today, UTC) |

| Option             | What it does                             |
| ------------------ | ---------------------------------------- |
| `--limit=<number>` | years returned, newest first (default 8) |

```bash
onthisday-media
onthisday-media 06-21 --limit 20
```

With `JSON_OUTPUT=1`: one onthisday entry per year with pictures taken on that day, newest year first: the year, a title, the year's first picture, and the route that draws it as a ring.

## P

### `parse-eval`

Score the search parse (archive-parse) against the filters each question means.

<small>reads only</small>

```text
parse-eval [--questions=<path>] [--limit=<number>]
```

| Option               | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `--questions=<path>` | a JSON array of {text, people, locations, from, to}. |
| `--limit=<number>`   | stop after this many questions.                      |

```bash
parse-eval --questions /tmp/parse-questions.json
```

With `JSON_OUTPUT=1`: per question: people, locations and years right of those asked for, names made up, and the time; totals and p50/p90.

### `person`

People and family tree management.

```text
person <subcommand>
```

| Argument       | What it is                                                                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<subcommand>` | Subcommand: list, create, name, merge, detach, discard, unknown, faces, set-parent, set-partner, remove, add-event, info, children, family-tree, graph, timeline, how-related, check, fixup. |

```bash
person info /archive/people/Anna_Exempel
person create /archive/people/Cecilia_Exempel --name 'Cecilia Exempel'
```

With `JSON_OUTPUT=1`: whatever the subcommand answers with; 'person' alone lists the subcommands.

### `person-add-event`

Add an event (blob) to a person, album, location or device.

<small>changes things</small>

```text
person-add-event [--type=<string>] [--date=<string>] [--body=<string>] [--lat=<string>] [--lng=<string>] [--writer=<path>] <target> <name>
```

| Argument   | What it is                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------ |
| `<target>` | VFS path to the person, album, location or device.                                         |
| `<name>`   | optional event name (e.g. birth, wedding); without one, it is made from the type and date. |

| Option            | What it does                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `--type=<string>` | event type: birth, death, marriage, engagement, generic; a dated birth/death also sets born/died.  |
| `--date=<string>` | event date (YYYY[-MM[-DD]])                                                                        |
| `--body=<string>` | event body text (markdown)                                                                         |
| `--lat=<string>`  | latitude for the event position node.                                                              |
| `--lng=<string>`  | longitude for the event position node.                                                             |
| `--writer=<path>` | the person who wrote the text, linked as the event's `writer`; without it, whoever adds the event. |

```bash
person-add-event --date 1998-06 --body 'Flyttade till Lund' /archive/people/Anna_Exempel
person-add-event --type marriage --date 1972-05-20 /archive/people/Anna_Exempel wedding
person-add-event --date 2019-07-14 --body 'A day on the water' --writer /archive/people/Anna_Exempel /archive/albums/Exempelalbum_2019
```

With `JSON_OUTPUT=1`: the event path; the event is written, and for a dated birth/death the born/died attr.

### `person-check`

Check family-tree integrity (dangling links, reciprocity, cycles, dates, birth/death events not on born/died)

<small>reads only</small>

```text
person-check [--json=<string>] <root>
```

| Argument | What it is                    |
| -------- | ----------------------------- |
| `<root>` | people root (default /people) |

| Option            | What it does |
| ----------------- | ------------ |
| `--json=<string>` | JSON output. |

```bash
person-check /archive/people
```

With `JSON_OUTPUT=1`: every dangling link, missing reciprocal, cycle, impossible date and birth/death event not mirrored onto born/died it found.

### `person-children`

List a person's children (children/ dir)

<small>reads only</small>

```text
person-children <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to person node. |

```bash
person-children /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: each child's name and slug.

### `person-cover`

Give a named person without a cover the crop of one of their own faces (coverPhoto softlink)

<small>changes things</small>

```text
person-cover [--all] [--file=<path>] [--repick] [--limit=<number>] [--verbose] <person>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<person>` | person path (repeatable) |

| Option             | What it does                                                                        |
| ------------------ | ----------------------------------------------------------------------------------- |
| `--all`            | every named person.                                                                 |
| `--file=<path>`    | the people whose faces are in this image.                                           |
| `--repick`         | choose again over a cover this command picked earlier; never over one somebody set. |
| `--limit=<number>` | stop after this many people.                                                        |
| `--verbose`        | print each person as it is written.                                                 |

```bash
person-cover /archive/people/Anna_Exempel
person-cover --file /archive/media/2019/IMG_0001.jpg
person-cover --all --limit 50
person-cover --all --repick
```

With `JSON_OUTPUT=1`: nothing; a coverPhoto softlink to a face crop is written for each named person that had no usable cover.

### `person-create`

Create a person node.

<small>changes things</small>

```text
person-create [--name=<string>] [--fullname=<string>] [--gender=<string>] [--born=<string>] [--died=<string>] [--allergies=<string>] <target>
```

| Argument   | What it is                    |
| ---------- | ----------------------------- |
| `<target>` | VFS path for the person node. |

| Option                       | What it does                          |
| ---------------------------- | ------------------------------------- |
| `--name=<string>`, `-n`      | Display name.                         |
| `--fullname=<string>`, `-f`  | Full name.                            |
| `--gender=<string>`, `-g`    | Gender: male, female, other, unknown. |
| `--born=<string>`, `-b`      | Birth date (YYYY[-MM[-DD]])           |
| `--died=<string>`, `-d`      | Death date (YYYY[-MM[-DD]])           |
| `--allergies=<string>`, `-a` | Allergy notes.                        |

```bash
person-create /archive/people/Disa_Exempel --name 'Disa Exempel' --born 2019-01-01
```

With `JSON_OUTPUT=1`: nothing; the person node is created.

### `person-detach`

Take faces off a person: to a new unnamed person, to an existing one, or off identity entirely.

<small>changes things</small>

```text
person-detach [--to=<string>] [--to-new-person] [--rematch] [--dry-run] [--verbose] <facePath...>
```

| Argument        | What it is                                            |
| --------------- | ----------------------------------------------------- |
| `<facePath...>` | regions or voices, e.g. /albums/x.jpg/regions/face-0. |

| Option            | What it does                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `--to=<string>`   | move the faces to this person (path or bare unknown id)                                   |
| `--to-new-person` | mint one unnamed person and move the faces there.                                         |
| `--rematch`       | not this person: let recognition place each face again, never back on the person it left. |
| `--dry-run`       | report what would move without changing anything.                                         |
| `--verbose`       | print each face.                                                                          |

```bash
person-detach --rematch /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg/regions/face-1
person-detach --to-new-person /archive/albums/Exempelalbum_2019/files/IMG_0007.jpg/regions/face-1
```

With `JSON_OUTPUT=1`: which faces moved, and to whom, and the unnamed people left empty and removed.

### `person-discard`

Say unidentified people are not a person at all: unassign and lock everything they hold, and remove them.

<small>changes things</small>

```text
person-discard [--dry-run] <person...>
```

| Argument      | What it is                                  |
| ------------- | ------------------------------------------- |
| `<person...>` | unnamed people, by path or bare unknown id. |

| Option      | What it does                                    |
| ----------- | ----------------------------------------------- |
| `--dry-run` | report what would go without changing anything. |

```bash
person-discard /archive/people/unknown/01J0EXAMPLE
person-discard --dry-run 01J0EXAMPLE 01J0EXAMPLF
```

With `JSON_OUTPUT=1`: the people removed, with how many regions and voices each let go, and the ones refused.

### `person-faces`

Every face and tag assigned to a person, with the photo each came from.

<small>reads only</small>

```text
person-faces [--limit=<string>] [--offset=<string>] [--sort=<string>] [--doubtful] <person>
```

| Argument   | What it is                                       |
| ---------- | ------------------------------------------------ |
| `<person>` | person path, or a bare id under /people/unknown. |

| Option              | What it does                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `--limit=<string>`  | max faces to return (default: all as text, 500 as JSON)                                  |
| `--offset=<string>` | skip this many (default 0)                                                               |
| `--sort=<string>`   | 'confidence' (default), 'file', chronological 'date', or 'doubt' (clearest doubts first) |
| `--doubtful`        | only the faces face-audit found looking like somebody else.                              |

```bash
person-faces /archive/people/Anna_Exempel
person-faces --limit 20 --sort date /archive/people/Anna_Exempel
person-faces --doubtful --sort doubt /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: the faces assigned to the person, with the photo each came from; JSON pages, and nextOffset starts the next page.

### `person-family-tree`

Display ancestors and descendants of a person.

<small>reads only</small>

```text
person-family-tree [--up=<number>] [--down=<number>] <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to person node. |

| Option            | What it does                       |
| ----------------- | ---------------------------------- |
| `--up=<number>`   | ancestor generations (default 3)   |
| `--down=<number>` | descendant generations (default 2) |

```bash
person-family-tree --up 2 --down 2 /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: the person's ancestors and descendants to the given depth.

### `person-fixup`

Repair family-tree links (recreate missing reciprocals, rewrite stale reciprocal paths, drop dangling)

<small>changes things</small>

```text
person-fixup [--dry-run=<string>] [--delete-orphans] <root>
```

| Argument | What it is                    |
| -------- | ----------------------------- |
| `<root>` | people root (default /people) |

| Option               | What it does                              |
| -------------------- | ----------------------------------------- |
| `--dry-run=<string>` | report without changing.                  |
| `--delete-orphans`   | delete unnamed people left with no faces. |

```bash
person-fixup --dry-run /archive/people
```

With `JSON_OUTPUT=1`: which family links would be recreated, rewritten or dropped; exits 1 when a person could not be repaired.

### `person-graph`

Family graph around a person as nodes and edges, for drawing a tree.

<small>reads only</small>

```text
person-graph [--up=<number>] [--down=<number>] [--only=<path>] [--to=<path>] <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to person node. |

| Option            | What it does                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `--up=<number>`   | ancestor generations (default 2, max 8)                                                      |
| `--down=<number>` | descendant generations (default 2, max 8)                                                    |
| `--only=<path>`   | draw only the person and these people, no walk (repeatable)                                  |
| `--to=<path>`     | draw the line of relations from the person to this one: how the two are related (repeatable) |

```bash
person-graph --up 2 --down 2 /archive/people/Anna_Exempel
person-graph /archive/people/Anna_Exempel --only /archive/people/Bo_Exempel --only /archive/people/Cecilia_Exempel
person-graph /archive/people/Anna_Exempel --to /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: the family graph around the person as nodes and edges, for drawing.

### `person-how-related`

Compute the kinship term between two persons (English/Swedish)

<small>reads only</small>

```text
person-how-related [--lang=<string>] [--json] <a> <b>
```

| Argument | What it is     |
| -------- | -------------- |
| `<a>`    | first person.  |
| `<b>`    | second person. |

| Option            | What it does                         |
| ----------------- | ------------------------------------ |
| `--lang=<string>` | en\|sv (default $CFG_LANGUAGE or en) |
| `--json`          | JSON output.                         |

```bash
person-how-related /archive/people/Anna_Exempel /archive/people/Bo_Exempel
person-how-related --lang sv /archive/people/Anna_Exempel /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: the kinship term in English and Swedish, as a sentence to repeat as it comes.

### `person-info`

Show person details, relationships, and events.

<small>reads only</small>

```text
person-info <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to person node. |

```bash
person-info /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: the person's name, birth and death dates, their parents, partners and children, and their events.

### `person-list`

List the named people, with how many faces and voice turns each has.

<small>reads only</small>

```text
person-list [--sort=<string>] [--limit=<number>] [--min=<number>]
```

| Option             | What it does                                                          |
| ------------------ | --------------------------------------------------------------------- |
| `--sort=<string>`  | name (default; placeholder names last) or count (most pictured first) |
| `--limit=<number>` | at most this many people.                                             |
| `--min=<number>`   | only people with at least this many faces and voice turns.            |

With `JSON_OUTPUT=1`: the named people with their face and voice counts, as JSON (PersonListEntry[]).

### `person-merge`

Merge people into another (faces, events, relations and links to them move; the sources are removed)

<small>changes things</small>

```text
person-merge [--dry-run] [--force] [--verbose] <src...> <dst>
```

| Argument   | What it is            |
| ---------- | --------------------- |
| `<src...>` | people to merge away. |
| `<dst>`    | person to keep.       |

| Option      | What it does                                          |
| ----------- | ----------------------------------------------------- |
| `--dry-run` | report what would move without changing anything.     |
| `--force`   | merge even if a source has children this cannot move. |
| `--verbose` | print detail.                                         |

```bash
person-merge /archive/people/unnamed-1 /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: what moved; with --dry-run, what would move.

### `person-name`

Name an unidentified person and move them into /people.

<small>changes things</small>

```text
person-name [--name=<string>] [--slug=<string>] [--fullname=<string>] [--birthname=<string>] [--gender=<string>] [--born=<string>] [--died=<string>] <person>
```

| Argument   | What it is                              |
| ---------- | --------------------------------------- |
| `<person>` | path (or bare id) of an unnamed person. |

| Option                 | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `--name=<string>`      | display name (required)                       |
| `--slug=<string>`      | path segment (default: derived from the name) |
| `--fullname=<string>`  | full name.                                    |
| `--birthname=<string>` | name at birth.                                |
| `--gender=<string>`    | male, female, other, unknown.                 |
| `--born=<string>`      | birth date (YYYY[-MM[-DD]])                   |
| `--died=<string>`      | death date (YYYY[-MM[-DD]])                   |

```bash
person-name --name 'Anna Exempel' --born 1970-01-01 /archive/people/unnamed-1
```

With `JSON_OUTPUT=1`: the named person and their new path under /archive/people.

### `person-relatives`

Who a kin phrase reaches from a person through the family tree: 'moster', 'mammas syster', 'barn', 'my father's brother'.

<small>reads only</small>

```text
person-relatives [--relation=<string>] [--age=<number>] <person>
```

| Argument   | What it is                                                             |
| ---------- | ---------------------------------------------------------------------- |
| `<person>` | the person to start from: a VFS path, or a slug under the people root. |

| Option                | What it does                                                                    |
| --------------------- | ------------------------------------------------------------------------------- |
| `--relation=<string>` | kin word or chain in Swedish or English, as the user said it.                   |
| `--age=<number>`      | also give the capture-date span in which each relative was this many years old. |

```bash
person-relatives /archive/people/Anna_Exempel --relation moster
person-relatives Anna_Exempel --relation 'mammas syster'
person-relatives Anna_Exempel --relation dotter --age 6
```

With `JSON_OUTPUT=1`: each relative the phrase reaches, with their path, name, birth and death dates and what they are to the person in Swedish and English; with --age, the capture-date span to search in.

### `person-remove`

Remove a relationship between two persons (both sides)

<small>changes things</small>

```text
person-remove <a> <b>
```

| Argument | What it is     |
| -------- | -------------- |
| `<a>`    | first person.  |
| `<b>`    | second person. |

```bash
person-remove /archive/people/Anna_Exempel /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: nothing; the relation is removed from both sides.

### `person-remove-home`

Remove a person↔location residence relation (both halves)

<small>changes things</small>

```text
person-remove-home <person> <location>
```

| Argument     | What it is               |
| ------------ | ------------------------ |
| `<person>`   | VFS path to person node. |
| `<location>` | VFS path to a location.  |

```bash
person-remove-home /archive/people/Anna_Exempel /archive/locations/Exempelstad
```

With `JSON_OUTPUT=1`: nothing; the residence relation is removed from both sides.

### `person-set-home`

Record where a person lived, and when (dated relation pair)

<small>changes things</small>

```text
person-set-home [--from=<string>] [--to=<string>] [--update] <person> <location>
```

| Argument     | What it is               |
| ------------ | ------------------------ |
| `<person>`   | VFS path to person node. |
| `<location>` | VFS path to a location.  |

| Option            | What it does                                                                           |
| ----------------- | -------------------------------------------------------------------------------------- |
| `--from=<string>` | moved in (YYYY[-MM[-DD]])                                                              |
| `--to=<string>`   | moved out (YYYY[-MM[-DD]])                                                             |
| `--update`        | rewrite the span of a residence that already exists; the flags given are the new span. |

```bash
person-set-home --from 2001-01 /archive/people/Anna_Exempel /archive/locations/Exempelstad
```

With `JSON_OUTPUT=1`: nothing; the residence relation is written on both sides.

### `person-set-parent`

Add a parent relationship (parents/ ↔ children/)

<small>changes things</small>

```text
person-set-parent [--kind=<string>] <child> <parent>
```

| Argument   | What it is                     |
| ---------- | ------------------------------ |
| `<child>`  | VFS path of the child person.  |
| `<parent>` | VFS path of the parent person. |

| Option            | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `--kind=<string>` | blood (default) \| adoptive \| step \| foster. |

```bash
person-set-parent /archive/people/Cecilia_Exempel /archive/people/Anna_Exempel
person-set-parent --kind adoptive /archive/people/Disa_Exempel /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: nothing; the link is written.

### `person-set-partner`

Add or update a partner relationship (partners/, both directions)

<small>changes things</small>

```text
person-set-partner [--kind=<string>] [--from=<string>] [--to=<string>] <a> <b>
```

| Argument | What it is                 |
| -------- | -------------------------- |
| `<a>`    | VFS path of first person.  |
| `<b>`    | VFS path of second person. |

| Option            | What it does                  |
| ----------------- | ----------------------------- |
| `--kind=<string>` | partner (default) \| married. |
| `--from=<string>` | partnership start date.       |
| `--to=<string>`   | partnership end date.         |

```bash
person-set-partner --kind married --from 2001-01-01 /archive/people/Anna_Exempel /archive/people/Bo_Exempel
```

With `JSON_OUTPUT=1`: nothing; the link is written in both directions.

### `person-stats`

Count births, engagements, marriages and deaths by calendar month across all years.

<small>reads only</small>

```text
person-stats
```

```bash
person-stats
```

With `JSON_OUTPUT=1`: months (twelve rows of counts per kind), totals, and withoutMonth for dates known only to the year.

### `person-timeline`

One person's life as a chronological feed: events, homes, partnerships, children and albums.

<small>reads only</small>

```text
person-timeline [--no-albums] <target>
```

| Argument   | What it is               |
| ---------- | ------------------------ |
| `<target>` | VFS path to person node. |

| Option        | What it does                                                                        |
| ------------- | ----------------------------------------------------------------------------------- |
| `--no-albums` | skip the albums, which are most of the cost — the life itself in a few round trips. |

```bash
person-timeline /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: the person's life in order: events, homes, partnerships, children and the albums they appear in.

### `person-unknown`

List auto-created people nobody has named yet, with face counts and crops.

<small>reads only</small>

```text
person-unknown [--limit=<string>] [--offset=<string>] [--faces=<string>] [--sort=<string>] [--min-faces=<string>] [--person=<string>]
```

| Option                 | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `--limit=<string>`     | max people to return (default 200)                                 |
| `--offset=<string>`    | skip this many (default 0)                                         |
| `--faces=<string>`     | crops per person (default 4)                                       |
| `--sort=<string>`      | 'faces' (default) or 'created'.                                    |
| `--min-faces=<string>` | only people with at least this many faces and recordings together. |
| `--person=<string>`    | return one person by node id or path.                              |

```bash
person-unknown --limit 20 --sort faces
person-unknown --sort created --min-faces 5
```

With `JSON_OUTPUT=1`: auto-created people nobody has named, with their face counts and crops; JSON pages, and nextOffset starts the next page.

### `person-update`

Change a person's profile: names, birth and death dates, gender, allergies, description, contact details. An empty value clears the field.

<small>changes things</small>

```text
person-update [--name=<string>] [--fullname=<string>] [--birthname=<string>] [--born=<string>] [--died=<string>] [--gender=<string>] [--allergies=<string>] [--description=<string>] [--contact=<string>] <person>
```

| Argument   | What it is  |
| ---------- | ----------- |
| `<person>` | the person. |

| Option                   | What it does                                          |
| ------------------------ | ----------------------------------------------------- |
| `--name=<string>`        | the name shown everywhere (cannot be empty)           |
| `--fullname=<string>`    | full name.                                            |
| `--birthname=<string>`   | name at birth.                                        |
| `--born=<string>`        | birth date, YYYY[-MM[-DD]].                           |
| `--died=<string>`        | death date, YYYY[-MM[-DD]].                           |
| `--gender=<string>`      | male, female, other or unknown.                       |
| `--allergies=<string>`   | allergy notes.                                        |
| `--description=<string>` | a few words about the person.                         |
| `--contact=<string>`     | contact details as a JSON list of { "type", "data" }. |

```bash
person-update /archive/people/Anna_Andersson --born=1970-01-01 --died=''
person-update /archive/people/Anna_Andersson --contact '[{"type":"email","data":"anna@example.com"}]'
```

With `JSON_OUTPUT=1`: nothing; the fields given are written, empty ones cleared.

### `person-voices`

Every recording a person is heard in, with how long they speak and a moment to hear them.

<small>reads only</small>

```text
person-voices [--limit=<string>] [--offset=<string>] [--sort=<string>] <person>
```

| Argument   | What it is                                       |
| ---------- | ------------------------------------------------ |
| `<person>` | person path, or a bare id under /people/unknown. |

| Option              | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `--limit=<string>`  | max voices to return (default: all)                                       |
| `--offset=<string>` | skip this many (default 0)                                                |
| `--sort=<string>`   | 'duration' (most spoken first, default), 'file', or chronological 'date'. |

```bash
person-voices /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: every recording voice assigned to the person, with its talk time and the moment to play.

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

### `raw`

Detect RAW image files and report (or --sort) the non-RAW file(s) they are related to.

<small>reads only</small>

```text
raw [--sort] [-n <string>] [--unmatched] [-v] <path>
```

| Argument | What it is                                    |
| -------- | --------------------------------------------- |
| `<path>` | file, subtree, or omit for the whole library. |

| Option        | What it does                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `--sort`      | move each RAW under its partner’s versions/ dir (frozen version); RAW with no partner is left as is. |
| `-n <string>` | max partner candidates per file (default 5)                                                          |
| `--unmatched` | scan: list only RAW files with no partner found.                                                     |
| `-v`          | verbose output.                                                                                      |

```bash
raw /archive/albums/Exempelalbum_2019/files/DSC_0001.NEF
```

With `JSON_OUTPUT=1`: the non-RAW files the RAW is related to.

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

| Option                  | What it does                                                          |
| ----------------------- | --------------------------------------------------------------------- |
| `--force`, `-f`         | Force regenerate even if derivatives exist.                           |
| `--prune`               | Delete renditions that are no longer part of the target set.          |
| `--size=<string>`, `-s` | Generate only these size classes, comma-separated (e.g. small,medium) |
| `--mime=<string>`       | Only files whose mimetype matches this glob (e.g. 'video/*')          |
| `--verbose`, `-v`       | Verbose output.                                                       |

```bash
regenerate /archive/albums/Exempelalbum_2019
regenerate --force --size thumbnail /archive/albums
```

With `JSON_OUTPUT=1`: how many files had their derivatives regenerated.

### `regenerate-face-crops`

Re-encode a bounded, resumable batch of existing face crops without re-detecting faces.

<small>changes things</small>

```text
regenerate-face-crops [--limit=<string>] [--after=<string>] [--file=<path>] [--dry-run] [--verbose]
```

| Option             | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `--limit=<string>` | maximum face nodes to scan (default 100)        |
| `--after=<string>` | resume after the node id returned as nextAfter. |
| `--file=<path>`    | restrict the batch to one source image.         |
| `--dry-run`        | report existing crops without rewriting them.   |
| `--verbose`        | print each crop considered.                     |

```bash
regenerate-face-crops --limit 200
```

With `JSON_OUTPUT=1`: how many face crops were re-encoded, and where to resume.

## S

### `search-album`

Search albums by name, description and what their pictures show.

<small>reads only</small>

```text
search-album [--kinds] [-l <number>] [--root=<string>] [--like=<path>] [--not-within=<path>] <query>
```

| Argument  | What it is         |
| --------- | ------------------ |
| `<query>` | Search query text. |

| Option                | What it does                                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--kinds`             | print the content kinds this provider can return, and exit.                                                                             |
| `-l <number>`         | Max results per channel (default 10)                                                                                                    |
| `--root=<string>`     | Albums root (default: /archive/albums)                                                                                                  |
| `--like=<path>`       | albums whose pictures look like the label of this tag directory, by its model (label-model)                                             |
| `--not-within=<path>` | leave the pictures under this directory out of what albums are scored by; may be given more than once (how `search` leaves out staging) |

```bash
search-album 'kalas' -l 10
search-album --like /archive/tags/exempeletikett -l 10
```

With `JSON_OUTPUT=1`: matching albums, one row per channel that found it (name, description, members), best first within each channel.

### `search-device`

Search devices by name, make, model or serial number.

<small>reads only</small>

```text
search-device [--kinds] [-l <number>] [--root=<string>] <query>
```

| Argument  | What it is         |
| --------- | ------------------ |
| `<query>` | Search query text. |

| Option            | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `--kinds`         | print the content kinds this provider can return, and exit. |
| `-l <number>`     | Max results per channel (default 10)                        |
| `--root=<string>` | Devices root (default: /archive/devices)                    |

```bash
search-device 'exempelkamera' -l 10
```

With `JSON_OUTPUT=1`: matching devices, one row per channel that found it (name, description), best first within each.

### `search-document`

Search documents (PDF, Word, text) by what their text is about, using semantic similarity.

<small>reads only</small>

```text
search-document [--kinds] [--within=<path>] [--not-within=<path>] [-l <number>] <query>
```

| Argument  | What it is                          |
| --------- | ----------------------------------- |
| `<query>` | what the documents should be about. |

| Option                | What it does                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `--kinds`             | print the content kinds this provider can return, and exit.                                                 |
| `--within=<path>`     | rank only among the documents in this JSON array of file ids (what `search` writes)                         |
| `--not-within=<path>` | leave out the documents under this directory; may be given more than once (how `search` leaves out staging) |
| `-l <number>`         | Max results (default 10)                                                                                    |

```bash
search-document 'ett protokoll från styrelsemötet' -l 10
```

With `JSON_OUTPUT=1`: matching documents, best first, each with its path and score.

### `search-location`

Search locations by name.

<small>reads only</small>

```text
search-location [--kinds] [-l <number>] [--root=<string>] <query>
```

| Argument  | What it is         |
| --------- | ------------------ |
| `<query>` | Search query text. |

| Option            | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `--kinds`         | print the content kinds this provider can return, and exit. |
| `-l <number>`     | Max results (default 10)                                    |
| `--root=<string>` | Locations root directory (default: /locations)              |

```bash
search-location 'Exempelstad' -l 10
```

With `JSON_OUTPUT=1`: matching locations, best first.

### `search-media`

Search media files by what they show, the text in them, what is said in them, their written descriptions and their names, or by likeness to a picture or a label.

<small>reads only</small>

```text
search-media [--kinds] [-l <number>] [--within=<path>] [--not-within=<path>] [--like=<path>] <query>
```

| Argument  | What it is                                       |
| --------- | ------------------------------------------------ |
| `<query>` | Search query text or keywords (none with --like) |

| Option                | What it does                                                                                                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--kinds`             | print the content kinds this provider can return, and exit.                                                                                                                                                                                                      |
| `-l <number>`         | Max results per channel (default 10)                                                                                                                                                                                                                             |
| `--within=<path>`     | rank only these files: a JSON array of file ids (how `search` narrows text to a person, location or album)                                                                                                                                                       |
| `--not-within=<path>` | leave out what lies under this directory; may be given more than once (how `search` leaves out the unlisted trees, such as staging)                                                                                                                              |
| `--like=<path>`       | answer the picture channel only, by likeness to this photo or video: its stored picture vectors, or for a file without them (one put in /tmp) the embedder asked now; or to a label's tag directory, by its model (label-model), without what carries the label. |

```bash
search-media 'segelbåt' -l 10
search-media --like /archive/albums/Exempelalbum/files/IMG_0001.jpg -l 10
search-media --like /archive/tags/exempeletikett -l 10
```

With `JSON_OUTPUT=1`: matching media, one row per channel that found it, best first within each channel, with its path, channel and score on that channel's scale.

### `search-people`

Search people by partial name; every query word must match the same person.

<small>reads only</small>

```text
search-people [--kinds] [-l <number>] [--root=<string>] <query>
```

| Argument  | What it is         |
| --------- | ------------------ |
| `<query>` | Search query text. |

| Option            | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `--kinds`         | print the content kinds this provider can return, and exit. |
| `-l <number>`     | Max results (default 10)                                    |
| `--root=<string>` | People root directory (default: /people)                    |

```bash
search-people 'Anna Exempel'
search-people -l 5 Anna
```

With `JSON_OUTPUT=1`: matching people, best first, each with a name, a slug and a score.

### `search-track`

Search tracks by the name of the device that recorded them, or their description.

<small>reads only</small>

```text
search-track [--kinds] [-l <number>] [--root=<string>] <query>
```

| Argument  | What it is         |
| --------- | ------------------ |
| `<query>` | Search query text. |

| Option            | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| `--kinds`         | print the content kinds this provider can return, and exit. |
| `-l <number>`     | Max results per channel (default 10)                        |
| `--root=<string>` | Devices root (default: /archive/devices)                    |

```bash
search-track 'exempeltur' -l 10
```

With `JSON_OUTPUT=1`: matching tracks, one row per channel that found it (name, description), best first within each.

### `staging`

Manage a user's private staging area: its categories and which one a newly arrived folder looks like it belongs in, their suggested groups and the organizer that makes them, the edits that change them, and the decisions that file them into the library or discard them, each journaled and undoable.

<small>reads only</small>

```text
staging [--user=<string>] [--all] [--stale] [--since=<string>] [--full] [--queue] [--if-pending] [--at=<path>] [--new] [--to=<string>] [--name=<string>] [--into=<path>] [--share=<string>] [--except=<path>] [--expect=<string>] [--confidence=<string>] [--action=<string>] [--limit=<string>] [--cursor=<string>] [--refresh] [--force] [--repair] [--counts] [--where=<string>] [--keep=<string>] [--apply] [--off] [--exact] [--near] [--loose-batch=<string>] [--layout-only] [--dry-run] [--create] [--remove] [--kind=<string>] [--label=<string>] [--destination=<path>] [--no-destination] [--strategy=<string>] [--significance=<string>] [--digitized=<string>] [--filename-dates=<string>] [--lane=<string>] [--sidecars=<string>] <subcommand> <path>...
```

| Argument       | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<subcommand>` | One of `init`, `status`, `check`, `detect`, `category`, `retime`, `organize`, `promote`, `discard`, `accept`, `later`, `undo`, `journal`, `move`, `split`, `regroup`, `merge`, `delete`, `rename`, `pin`, `reject`, `match`, `dedupe`, `duplicates`, `separate`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `<path>...`    | a category's name, or suggested groups by path or slug in the default category of --user, as required; detect takes at most 20 folders, of staging or not (by default the folders newly arrived in the default category); organize takes the categories to organize (every one by default); retime takes a category, or a folder or file of one (every category by default); discard also takes staged files and folders; accept takes at most 20 groups (50 with --dry-run), later 100; undo takes at most 20 journal entries; move takes what to move, then the folder; regroup takes the group, then the staged files to move into it (at most 2000), or with --new the files alone; merge takes the group to keep, then the groups to fold into it; rename takes the new name after it; reject takes the group, then the library album it does not go into; match takes groups (every group of the user's by default); duplicates takes a category, a folder of staged files (all of them by default), a suggested group, or staged files (at most 200) for the sets they belong to; dedupe takes the sets to resolve (exact:<id> or near:<id>), with a category, a folder in one or a suggested group to drop their files from (the default category by default); separate takes a staged file, then the files it is no duplicate of. |

| Option                      | What it does                                                                                                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--user=<string>`           | act on this user (defaults to the current user)                                                                                                                                                                         |
| `--all`                     | init, organize, match, duplicates --repair: act on every user (administrator only)                                                                                                                                      |
| `--stale`                   | match: only the groups due a match: none for their members as they are, by another model, or older than a candidate profile.                                                                                            |
| `--since=<string>`          | match: only the groups around the days of the library albums whose profile changed after this time.                                                                                                                     |
| `--full`                    | organize: plan the whole category again, not only what changed since the last run.                                                                                                                                      |
| `--queue`                   | organize: ask for a run rather than run one; the organizer's pipeline runs it within minutes. A user may ask for their own categories.                                                                                  |
| `--if-pending`              | organize --queue: only for a category something waits for: changes since its last run, edits, a first run, or a week since its last full build (administrator only)                                                     |
| `--at=<path>`               | split: the first file of the new group.                                                                                                                                                                                 |
| `--new`                     | regroup: the files make a new group of their own.                                                                                                                                                                       |
| `--to=<string>`             | promote: the directory a new album is made in (default /archive/albums)                                                                                                                                                 |
| `--name=<string>`           | promote: the new album's title, its path made from it (default the first group's name); split, regroup --new: the new group's name; merge: the kept group's new name.                                                   |
| `--into=<path>`             | promote: file into this library album instead of a new one.                                                                                                                                                             |
| `--share=<string>`          | promote: 'private' makes the new album yours alone; 'default' shares it as your new albums are.                                                                                                                         |
| `--except=<path>`           | promote, discard: leave this member in its group, which is then pinned (repeatable)                                                                                                                                     |
| `--expect=<string>`         | promote, discard, accept, split, regroup, merge, delete: the member key each group must still have, in group order (repeatable)                                                                                         |
| `--confidence=<string>`     | accept: the least sure proposal to apply (high, medium; default medium)                                                                                                                                                 |
| `--action=<string>`         | journal: only decisions of this kind (promote, file, discard, dedupe, edit, reject)                                                                                                                                     |
| `--limit=<string>`          | journal: entries per page (default 50, at most 200); duplicates: sets per page (default 50, at most 200); duplicates --refresh: files announced per call (default 5000); dedupe --apply: copies dropped per call.       |
| `--cursor=<string>`         | journal, duplicates, duplicates --refresh, dedupe --apply: go on after this one's cursor.                                                                                                                               |
| `--refresh`                 | duplicates: announce each staged media file whose duplicate finding is missing, from another inbox or for other bytes, for media-duplicates to record; takes a folder of the user's staging files (default all of them) |
| `--force`                   | duplicates --refresh: announce every staged media file.                                                                                                                                                                 |
| `--repair`                  | duplicates: check each duplicate finding against where its file is now, and fix it (with --all, every user's)                                                                                                           |
| `--counts`                  | duplicates: how many staged copies the scope holds, by where their originals lie.                                                                                                                                       |
| `--where=<string>`          | duplicates, dedupe --apply: only copies or look-alikes of library photos (library), or of files within the inbox (inbox); both, in that order, by default.                                                              |
| `--keep=<string>`           | dedupe: keep this staged file (its id) of the one set named, instead of the one the rules keep.                                                                                                                         |
| `--apply`                   | dedupe: resolve every set of the scope that resolves unasked, at most 500 sets and --limit copies (default and most 2000) a call.                                                                                       |
| `--off`                     | pin: unpin, so the organizer manages the group again; later: bring back into its lane; separate: no longer keep the files apart.                                                                                        |
| `--exact`                   | duplicates, dedupe --apply: only byte copies.                                                                                                                                                                           |
| `--near`                    | duplicates, dedupe --apply: only look-alikes: the same picture in other bytes.                                                                                                                                          |
| `--loose-batch=<string>`    | init: the default category's folder that loose entries of files/ move into (default unsorted)                                                                                                                           |
| `--layout-only`             | init: make the directories and categories only; move nothing.                                                                                                                                                           |
| `--dry-run`                 | init, organize, promote, discard, accept, dedupe, duplicates, retime --refresh: say what would be done, and do none of it.                                                                                              |
| `--create`                  | category: make it, with its directory of groups.                                                                                                                                                                        |
| `--remove`                  | category: remove it, which only an empty one other than the default can be.                                                                                                                                             |
| `--kind=<string>`           | category: what it holds, which resets its other settings to the kind's (inbox, google-photos, scans, phone, camera, messaging, screenshots, generic)                                                                    |
| `--label=<string>`          | category: what a page calls it.                                                                                                                                                                                         |
| `--destination=<path>`      | category: the library album its files are filed into by default.                                                                                                                                                        |
| `--no-destination`          | category: no default album.                                                                                                                                                                                             |
| `--strategy=<string>`       | category: how its files are grouped (events, folders, none): by time and place, by folder and file-name run, or into monthly lanes.                                                                                     |
| `--significance=<string>`   | category: how readily a day becomes a group of its own rather than part of an Everyday lane (fewer, normal, more)                                                                                                       |
| `--digitized=<string>`      | category: on, its files are digitized copies (scans), and no clock recorded while digitizing them (device, GPS, file name) dates them; off, they do. Its files are dated again.                                         |
| `--filename-dates=<string>` | category: on, a date its files' names spell (IMG_20190601_123456.jpg) dates them when nothing better does; off, names are not dates. Its files are dated again.                                                         |
| `--lane=<string>`           | category: the lane the work on its files runs in (normal, bulk); bulk runs below all other work, for an import of thousands, and applies to work announced from then on.                                                |
| `--sidecars=<string>`       | category: whether the Google Photos Takeout JSON and XMP sidecars arriving there are paired with their files (pair, ignore), from then on.                                                                              |

```bash
staging init --all --loose-batch legacy-import --dry-run
staging status --user anna
staging check
staging detect
staging detect /home/anna/staging/files/inbox/upload-2026-10-18/Takeout
staging category scans --create --kind scans --label "Box 3"
staging category scans --destination /archive/albums/family-prints
staging category inbox --significance more
staging category box-3 --digitized on
staging category takeout --lane bulk
staging category whatsapp --sidecars ignore
staging retime /home/anna/staging/files/inbox --dry-run
staging retime scans --user anna
staging organize --all
staging organize inbox --user anna --full --dry-run
staging organize inbox --queue
staging organize --all --queue --if-pending
staging split 2019-06-14 --at /home/anna/staging/files/inbox/upload-2019-06-20/IMG_0412.jpg
staging regroup 2019-06-14 /home/anna/staging/files/inbox/upload-2019-06-20/IMG_0415.jpg
staging regroup --new --name 'Lake swim' /home/anna/staging/files/inbox/upload-2019-06-20/IMG_0420.jpg /home/anna/staging/files/inbox/upload-2019-06-20/IMG_0421.jpg
staging merge 2019-06-14 2019-06-15
staging delete 2019-07-02
staging rename 2019-06-14 'Lake weekend'
staging reject 2019-06-14 /archive/albums/summer-2019
staging match 2019-06-14 2019-06-15
staging match --all
staging match --all --stale
staging match --since 2026-10-18T10:00:00Z
staging promote 2019-06-14 --name 'Lake weekend' --expect 0f3a9c2b4d5e6f70
staging promote 2019-06-16 --into /archive/albums/lake-trip-2019
staging promote 2019-06-20 --name 'Cottage notes' --share private
staging discard 2019-06-21
staging discard /home/anna/staging/files/inbox/upload-2026-10-01/blurry
staging accept 2019-06-14 2019-06-16 --dry-run
staging later 2019-07-02
staging journal inbox --limit 50
staging undo 01JA2B3C4D5E6F7G8H9J0K1M2N
staging move /home/anna/staging/files/inbox/box-3 /home/anna/staging/files/scans
staging duplicates inbox --where library --limit 30
staging duplicates --counts
staging dedupe inbox exact:01JA2B3C4D5E6F7G8H9J0K1M2N
staging dedupe inbox --apply --where library
staging duplicates --refresh --user anna --dry-run
staging duplicates --repair --all
staging duplicates inbox --near --where library
staging duplicates /home/anna/staging/albums/inbox/2019-06-14
staging duplicates /home/anna/staging/files/inbox/upload/IMG_0001.jpg /home/anna/staging/files/inbox/upload/IMG_0002.jpg
staging dedupe inbox near:01JA2B3C4D5E6F7G8H9J0K1M2N --keep 01JA2B3C4D5E6F7G8H9J0K1M2P
staging dedupe inbox --apply --near --where library
staging separate /home/anna/staging/files/inbox/IMG_0001.jpg /home/anna/staging/files/inbox/IMG_0002.jpg
```

With `JSON_OUTPUT=1`: promote: StagingPromoteResult; discard: StagingDiscardResult; accept: StagingAcceptResult; later: StagingLaterResult; undo: StagingUndoResult; journal: StagingJournalPage; move: StagingMoveResult; split, regroup, merge, delete, rename, pin, reject: StagingEditResult; match: StagingMatchResult; organize: StagingOrganizeReport, with --queue StagingQueueReport; init: StagingInitAnswer; retime: StagingRetimeAnswer; status: StagingStatus; check: StagingCheckAnswer; detect: StagingDetectAnswer; category: StagingCategoryAnswer; duplicates: DuplicatePage; duplicates --counts: DuplicateCounts; dedupe: DuplicateResolveResult; separate: DuplicateSeparateResult; duplicates --refresh: DuplicateRefreshResult; duplicates --repair: DuplicateRepairResult.

### `subcluster-faces`

Re-cluster one person's faces with average linkage, to find two people fused into one.

<small>reads only</small>

```text
subcluster-faces [--threshold=<string>] [-k <string>] [--verbose] <person>
```

| Argument   | What it is                                       |
| ---------- | ------------------------------------------------ |
| `<person>` | person path, or a bare id under /people/unknown. |

| Option                 | What it does                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `--threshold=<string>` | min average similarity to keep faces together (default: the largest gap in the dendrogram) |
| `-k <string>`          | cut into exactly this many groups instead of by threshold.                                 |
| `--verbose`            | list the photos in each group.                                                             |

```bash
subcluster-faces /archive/people/Anna_Exempel
```

With `JSON_OUTPUT=1`: the sub-clusters the person's faces fall into, which is how two people fused into one show up.

### `subject-device`

What `search --subject device:<ref>` asks: the media a device produced, as the attr equality the store answers.

<small>reads only</small>

```text
subject-device [--of=<path>] <ref>...
```

| Argument   | What it is                       |
| ---------- | -------------------------------- |
| `<ref>...` | device slug or path (repeatable) |

| Option        | What it does                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `--of=<path>` | a JSON array of media ids: answer with the device that took each, for `search --group-by device`. |

```bash
JSON_OUTPUT=1 subject-device Exempelkamera_X100
JSON_OUTPUT=1 subject-device --of /tmp/ids.json
```

With `JSON_OUTPUT=1`: per ref, the path of the device and its media as an attr match, or why the ref names no device; with --of, the devices that took them once each and per media id the ones it has.

### `subject-location`

What `search --subject location:<ref>` asks: the media linked to a location node.

<small>reads only</small>

```text
subject-location [--of=<path>] <ref>...
```

| Argument   | What it is                         |
| ---------- | ---------------------------------- |
| `<ref>...` | location slug or path (repeatable) |

| Option        | What it does                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `--of=<path>` | a JSON array of media ids: answer with the location each is linked to, for `search --group-by location`. |

```bash
JSON_OUTPUT=1 subject-location exempelstad-torget
JSON_OUTPUT=1 subject-location --of /tmp/ids.json
```

With `JSON_OUTPUT=1`: per ref, the path of the location and its media as node ids, truncated past 20000, or why the ref names no location; with --of, their locations once each and per media id the ones it has.

### `subject-person`

What `search --subject person:<ref>` asks: the media a person is in: tagged with a box (a face or a drawn region) or without one.

<small>reads only</small>

```text
subject-person [--of=<path>] <ref>...
```

| Argument   | What it is                       |
| ---------- | -------------------------------- |
| `<ref>...` | person slug or path (repeatable) |

| Option        | What it does                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `--of=<path>` | a JSON array of media ids: answer with the people in each, named or not, for `search --group-by person`. |

```bash
JSON_OUTPUT=1 subject-person anna-exempel
JSON_OUTPUT=1 subject-person --of /tmp/ids.json
```

With `JSON_OUTPUT=1`: per ref, the path of the person and its media as node ids, truncated past 20000, or why the ref names no person; with --of, the people in them once each and per media id the ones it has.

### `subjects-in`

Who and what the media in an album or folder have: the people in them, their locations, the devices that took them and the photographers, counted.

<small>reads only</small>

```text
subjects-in <path>
```

| Argument | What it is           |
| -------- | -------------------- |
| `<path>` | the album or folder. |

```bash
subjects-in /archive/albums/Exempelalbum_2019
JSON_OUTPUT=1 subjects-in /archive/albums/Exempelalbum_2019
```

With `JSON_OUTPUT=1`: how many media the container shows and how many carry a position; its people, locations, devices and photographers, each with its path, name and how many of the media have it, the most first.

## T

### `tag-transfer`

Move legacy manual face tags onto the auto-detected face inside their box (recognition anchors)

<small>changes things</small>

```text
tag-transfer [--margin=<string>] [--min-scale=<string>] [--file=<path>] [--limit=<string>] [--no-crop] [--dry-run] [--verbose]
```

| Option                 | What it does                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--margin=<string>`    | how far a detection may stick out of the manual box and still count as inside, as a fraction of the box (default 0) |
| `--min-scale=<string>` | narrowest a detection may be, as a fraction of the box's width (default 0.15)                                       |
| `--file=<path>`        | restrict to one image.                                                                                              |
| `--limit=<string>`     | max transfers this run.                                                                                             |
| `--no-crop`            | skip generating crops for the tags left behind.                                                                     |
| `--dry-run`            | report without writing.                                                                                             |
| `--verbose`            | print each transfer.                                                                                                |

```bash
tag-transfer --dry-run
```

With `JSON_OUTPUT=1`: which legacy manual tags would move onto a detected face.

### `timeline`

Chronological feed of albums, life events, birthdays and tracks, newest first.

<small>reads only</small>

```text
timeline [--limit=<number>] [--kind=<string>] [--at=<string>] [--year=<string>] [--cursor=<string>] [--dir=<string>] [--birthdays=<string>] [--anniversaries=<string>] [-q <string>] [--person=<string>] [--location=<string>] [--tag=<string>] [--no-cover] [--today=<string>]
```

| Option                     | What it does                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `--limit=<number>`         | entries per page (default 40, max 200)                                                               |
| `--kind=<string>`          | restrict to these kinds: album, auto-album, anniversary, birth, death, birthday, event, move, track. |
| `--at=<string>`            | start the feed at this date instead of now (YYYY[-MM[-DD]], the whole period included)               |
| `--year=<string>`          | only this year (YYYY): albums holding media taken in it, tracks and everything else dated in it.     |
| `--cursor=<string>`        | resume token from a previous page.                                                                   |
| `--dir=<string>`           | which way to page from the cursor: desc, asc (default desc, back in time)                            |
| `--birthdays=<string>`     | which recurring birthdays to show: all, milestone, none (default milestone)                          |
| `--anniversaries=<string>` | which wedding anniversaries to show: all, milestone, none (default milestone)                        |
| `-q <string>`              | only entries whose title or description contains this text.                                          |
| `--person=<string>`        | only entries about, or holding media of, this person (slug or path)                                  |
| `--location=<string>`      | only entries at, or holding media from, this location (slug or path)                                 |
| `--tag=<string>`           | only albums holding media with this label.                                                           |
| `--no-cover`               | skip cover lookups.                                                                                  |
| `--today=<string>`         | override the current date (testing)                                                                  |

### `timeline-facets`

Per-day, per-month and per-year counts for the timeline scrubber.

<small>reads only</small>

```text
timeline-facets [--kind=<string>] [--birthdays=<string>] [--anniversaries=<string>] [--today=<string>] [-q <string>] [--person=<string>] [--location=<string>] [--tag=<string>]
```

| Option                     | What it does                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `--kind=<string>`          | restrict to these kinds: album, auto-album, anniversary, birth, death, birthday, event, move, track. |
| `--birthdays=<string>`     | which recurring birthdays to count: all, milestone, none (default milestone)                         |
| `--anniversaries=<string>` | which wedding anniversaries to count: all, milestone, none (default milestone)                       |
| `--today=<string>`         | override the current date (testing)                                                                  |
| `-q <string>`              | size the rail for a text-filtered feed.                                                              |
| `--person=<string>`        | size the rail for one person (slug or path)                                                          |
| `--location=<string>`      | size the rail for one location (slug or path)                                                        |
| `--tag=<string>`           | size the rail for one label.                                                                         |

### `track-append`

Append coordinate points to a device's track.

<small>changes things</small>

```text
track-append [--lat=<string>] [--lng=<string>] [--ts=<string>] [--alt=<string>] [--speed=<string>] [--course=<string>] [--json=<string>] <device> <lat> <lng>
```

| Argument   | What it is                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| `<device>` | the device (slug or path) whose track takes the points, or a track's path. |
| `<lat>`    | latitude (positional; use --lat= if negative)                              |
| `<lng>`    | longitude (positional; use --lng= if negative)                             |

| Option              | What it does                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `--lat=<string>`    | latitude, as --lat=<n> — required form for a negative coordinate.  |
| `--lng=<string>`    | longitude, as --lng=<n> — required form for a negative coordinate. |
| `--ts=<string>`     | ISO timestamp of the fix (default: now)                            |
| `--alt=<string>`    | altitude in meters.                                                |
| `--speed=<string>`  | speed in m/s.                                                      |
| `--course=<string>` | course over ground in degrees.                                     |
| `--json=<string>`   | JSON point or array of points (batch mode)                         |

### `track-create`

Give a device a track for the coordinate points it recorded (the device's child track)

<small>changes things</small>

```text
track-create [--description=<string>] [--routing-key=<string>] <device>
```

| Argument   | What it is                                                |
| ---------- | --------------------------------------------------------- |
| `<device>` | the device: its slug under the devices root, or its path. |

| Option                   | What it does                                 |
| ------------------------ | -------------------------------------------- |
| `--description=<string>` | track description.                           |
| `--routing-key=<string>` | relay routing key to append live fixes from. |

```bash
track-create garmin-etrex --description "Hiking GPS"
```

With `JSON_OUTPUT=1`: the track's path.

### `track-import`

Import GPX track points into a device's track.

<small>changes things</small>

```text
track-import <device> <gpx>
```

| Argument   | What it is                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------- |
| `<device>` | the device (slug or path) whose track takes the points (made if missing), or a track's path. |
| `<gpx>`    | VFS path to uploaded GPX file.                                                               |

### `track-list`

List the devices that have a track, with its point count, span and extent.

<small>reads only</small>

```text
track-list <root>
```

| Argument | What it is                                   |
| -------- | -------------------------------------------- |
| `<root>` | Device directory (default: /archive/devices) |

With `JSON_OUTPUT=1`: one row per device with a track.

### `track-read`

Read a device's track as drawable segments ({segments, points, truncated})

<small>reads only</small>

```text
track-read [--from=<string>] [--to=<string>] [--bbox=<string>] [--margin=<string>] [--tolerance=<string>] [--limit=<string>] <device>
```

| Argument   | What it is                                                        |
| ---------- | ----------------------------------------------------------------- |
| `<device>` | the device (slug or path) whose track to read, or a track's path. |

| Option                 | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `--from=<string>`      | only fixes at or after this ISO timestamp.                         |
| `--to=<string>`        | only fixes before this ISO timestamp.                              |
| `--bbox=<string>`      | only points near north,south,east,west.                            |
| `--margin=<string>`    | how far outside --bbox to read, as a fraction of it (default 0.25) |
| `--tolerance=<string>` | simplification tolerance in degrees (level of detail)              |
| `--limit=<string>`     | max points to return.                                              |

### `track-stage`

Import a staged GPX file into the track of the device it names, and remove the file; mark it pending when no single device matches, and keep it in its staging area's routes/.

<small>changes things</small>

```text
track-stage [--device=<path>] <gpx>
```

| Argument | What it is                |
| -------- | ------------------------- |
| `<gpx>`  | VFS path to the GPX file. |

| Option            | What it does                                                         |
| ----------------- | -------------------------------------------------------------------- |
| `--device=<path>` | the device (slug or path) it came from, instead of the one it names. |

```bash
track-stage /home/anna/staging/files/inbox/upload-2026-10-16/hike.gpx
track-stage /home/anna/staging/routes/hike.gpx --device garmin-etrex
```

With `JSON_OUTPUT=1`: imported, with the track and the number of new fixes; or pending, with why.

### `transcribe-file`

Transcribe audio or video into a timed WebVTT node with chunk embeddings.

<small>changes things</small>

```text
transcribe-file [-v] [-f] <input>
```

| Argument  | What it is                          |
| --------- | ----------------------------------- |
| `<input>` | VFS path to an audio or video file. |

| Option | What it does                                        |
| ------ | --------------------------------------------------- |
| `-v`   | Verbose output.                                     |
| `-f`   | Force re-transcription even if a transcript exists. |

```bash
transcribe-file /archive/albums/Exempelalbum_2019/files/MVI_0042.MOV
```

With `JSON_OUTPUT=1`: nothing; a timed WebVTT transcript with chunk embeddings is written under the file.

## V

### `voiceprint-file`

Find the voices of an audio or video recording: who speaks when, with one voiceprint per voice.

<small>changes things</small>

```text
voiceprint-file [-v] [-f] [--no-video] <input>
```

| Argument  | What it is                          |
| --------- | ----------------------------------- |
| `<input>` | VFS path to an audio or video file. |

| Option       | What it does                                   |
| ------------ | ---------------------------------------------- |
| `-v`         | Verbose output.                                |
| `-f`         | Force re-voiceprinting even if speakers exist. |
| `--no-video` | Skip the faces seen speaking; voices only.     |

```bash
voiceprint-file /archive/albums/Exempelalbum_2019/files/MVI_0042.MOV
```

With `JSON_OUTPUT=1`: nothing; one speaker node per voice is written under the file.
