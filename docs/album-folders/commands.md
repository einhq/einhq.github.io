<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Album folders commands

The commands the album folders module adds. They are there once the module is installed. 1 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[album-folders](#album-folders)

## A

### `album-folders`

Keep the albums as folders of real files on disk, for browsing outside EiN (status, sync, watch)

<small>reads only</small>

```text
album-folders [--dry-run] [--force] <subcommand> [<album>]
```

| Argument       | What it is                                                         |
| -------------- | ------------------------------------------------------------------ |
| `<subcommand>` | status \| sync \| watch.                                           |
| `[<album>]`    | sync: one album, or a directory of albums, instead of all of them. |

| Option      | What it does                                                          |
| ----------- | --------------------------------------------------------------------- |
| `--dry-run` | sync: count what would be linked and removed, changing nothing.       |
| `--force`   | sync: go ahead even when more than half the files belong to no album. |

```bash
album-folders status
album-folders sync
album-folders sync /archive/albums/Exempelalbum_2019 --dry-run
```

With `JSON_OUTPUT=1`: for `status`, the folder and what the last full pass found (AlbumFoldersStatus); for `sync`, what was linked, removed, kept and skipped (AlbumFoldersSync); `watch` runs until stopped.
