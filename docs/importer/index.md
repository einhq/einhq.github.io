# The Importer

This page is for the administrator who moves one particular older archive into EiN with the
`importer` module: what the module is, what it needs, how it is installed, and its commands. Its
commands are there once it is installed.

## What it is

The `importer` module moves one particular older archive, kept as MongoDB dumps, into EiN: its
users and groups, people and their relations, places and homes, devices, albums and files, covers,
stories, comments, labels and measurements. It is not published, and it is not a general
importer: it reads that one archive's records and nothing else. Photos and videos from anywhere
else, such as a phone, a Google Photos export or a box of scans, come in through the Archive's
staging; see [Getting your photos in](../archive/importing.md).

What it brings over lands where the Archive keeps it: albums, people and places in the shared
tree, and the files of a person's own area of the old archive in their staging Inbox, in
`files/inbox/legacy-import`, where they sort them like any upload. The files are not copied: each
one points at its original in the old archive's folder. Accounts brought over have no usable
password until an administrator sets one; see [Accounts and groups](../admin/accounts.md).

## What it needs

- **The Archive.** The module depends on `archive`, which is installed with it, and the Archive
  needs the [media service](../ems/index.md) to process what arrives.
- **The extract.** The import commands do not read the MongoDB dump itself. A script in the
  module, `scripts/extract-nodes.ts`, turns the dump's `nodes.bson` into one JSON file per kind of
  record, outside EiN, with Deno. The import commands read those files from the folder `--data`
  names, `/modules-dev/importer/data` unless you give another.
- **The old files.** The originals stay where they are and are read from `/old/files` inside EiN
  (`--old-files`). With the standard installation that is the `old` folder of the data folder;
  see [Your data: backup, moving and removing](../admin/data.md).

## Installing it

The module is not among the published modules, so **Settings → Modules** does not offer it and
`mod install importer` does not find it in the default module source. Whoever has access to its
repository installs it by its address, with a token if the forge is not public, as
[Modules from other places](../admin/modules.md#modules-from-other-places) describes.

## Its commands

Each part of the old archive has a command of its own, `import-users-groups`, `import-files` and
so on, and each of them takes `--dry-run` to report what it would create without writing anything.
They run in order of what owns what: accounts and people first, then albums, files and covers, and
last what attaches to them, the stories, comments and labels. A file whose album is not imported
yet is skipped, and a file that is already there is skipped whole, so an interrupted
`import-files` goes on where it stopped.

`import-check` checks the extract before an import and fails when a file is missing, a record
lacks a field its command needs, or a path lies outside the Archive's folders. `import-check --vfs`
afterwards reports each part that did not land in full.

[Importer commands](commands.md) lists every command and its options.

## Related pages

- [Getting your photos in](../archive/importing.md): photos from anywhere else.
- [Staging for administrators](../archive/staging-admin.md#import-an-older-archive): where the
  imported files of a person's own area land.
- [Modules](../admin/modules.md): installing, updating and removing modules.
