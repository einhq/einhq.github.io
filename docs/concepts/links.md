# Links

A link lets one node be in more than one place in EiN's tree. This page explains the two kinds,
softlinks and hard links, where EiN makes them for you, and what moving, deleting and the trash do
to them. It is for anyone who works in the [terminal](../shell/terminal.md), over
[SFTP](../shell/ssh-sftp.md) or in the **Nodes** explorer, and wants to know why things in the tree
are where they are.

> [!NOTE]
> A _share link_, the address you send to someone without an account, is a different thing.
> [Sharing](../guide/sharing.md#share-an-album-with-a-link) covers it.

## Two kinds of link

|                      | Softlink                                                                   | Hard link                                             |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| What it is           | A node of its own, of type `softlink`, that holds the path of another node | The same node under a second name, in a second folder |
| Made with            | `ln -s <target> <link_name>`, `ln -s` over SFTP, and EiN itself            | `ln <target> <link_name>`                             |
| Can point at nothing | Yes: its target may be missing or gone                                     | No: it is the node                                    |
| Deleting it          | Removes the link, never its target                                         | Removes one name; the node goes with its last name    |
| Used by EiN          | Everywhere one thing belongs in several places                             | Nowhere by itself                                     |

Almost every link you meet in EiN is a softlink. When this documentation says "link" without more,
it means a softlink.

## Softlinks

A softlink stores a path, nothing else. Opening it opens the node at that path: `ls`, `cat`, `cd`
and the web interface all go through to the target, as they do on Unix. If the target has links of
its own on the way, those are followed too, up to 40 in a row; past that EiN stops with
`too many levels of symbolic links`.

The path is kept exactly as it was given:

- An **absolute** target, starting with `/`, means the same node wherever the link is.
- A **relative** target is read from the folder that holds the link. EiN uses one for enabled
  services: `/etc/services/enabled/<name>` points at `../available/<name>`.

EiN does not check that the target exists when you make a softlink, so a link can point at nothing
from the start.

### Where EiN makes softlinks for you

You make most links without typing `ln`: a button in the web interface or a command writes them.

| What you do                                                                                                  | The link it makes                                                                           |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Add a picture to an album from elsewhere ([Albums](../guide/albums.md#add-pictures-that-are-already-in-ein)) | A link in the album, named after the picture, to where the picture lives                    |
| Choose an album's, person's, location's or device's cover                                                    | `coverPhoto` in it, to the picture                                                          |
| Set an album's **Previous album** or **Next album**                                                          | `previous` and `next` in the album, and the matching one back in the other album            |
| Put a label on something ([Labels](../guide/media.md#labels))                                                | A link in `/archive/tags/<label>/` to what carries it                                       |
| Heart a picture ([Favourites](../guide/profile.md#favourites))                                               | A link in `/home/<you>/stars/` to the picture                                               |
| Add a parent, partner or child ([Family tree](../guide/family.md))                                           | A pair: one in `parents/`, `children/` or `partners/` of each person, pointing at the other |
| Add a home or a resident                                                                                     | A pair: one in the person's `homes/`, one in the location's `residents/`                    |
| Link a picture to a location ([Locations](../guide/places.md#how-pictures-join-a-location))                  | `location` in the picture, to the location                                                  |
| Choose **Written by** on an event ([Albums](../guide/albums.md#add-a-note-to-a-day))                         | `writer` in the event, to the person                                                        |
| Put someone in a group ([Accounts and groups](../admin/accounts.md))                                         | A link in `/etc/groups/<group>/users/`, named after the account, to `/etc/users/<account>`  |

The picture is never copied. One photo in five albums is one node with five links to it, so a date,
a place, a face or a label given to it shows in all five.

![One photo, beach.jpg, where it lives in the album Summer 2020, with dashed softlinks pointing at it from Summer 2020's cover, from another album, from a label and from a favourite; Delete in Summer 2020 sends the photo to the trash, while Remove in the other album drops only that album's link](../diagrams/links.svg "One picture, many places: everything that points at it is a softlink, and the picture itself lives in one folder.")

### Pairs of links

How two people are related, and who lived where, is kept as a pair of softlinks, one on each side.
Each half knows where the other half is, so the two stay together:

- Removing a relation with the web interface, `person-remove` or `unrelate` removes both halves.
- When one side is deleted for good, the `relations-guard` service removes the other half.
- When a person is moved, or merged into another with `person-merge`, the pairs follow.

You can make a pair of your own between any two nodes with `relate`. It puts the links in a
`relations/` folder of each node, named `<label>-<name of the other>`:

```bash
# in EiN's terminal
relate /archive/people/Peggy_Wrenfield /archive/people/Helen_Okafor godmother --reverse goddaughter
```

```text
Created bidirectional relation: /archive/people/Peggy_Wrenfield <-godmother/goddaughter-> /archive/people/Helen_Okafor
```

`unrelate /archive/people/Peggy_Wrenfield/relations/godmother-Helen_Okafor` removes both halves
again. `relate` refuses a pair that is already there with `relate: relation already exists:`
and the path.

## Hard links

A hard link gives a node a second name. Both names are the same node: the same id, the same
owner and mode, the same content and children. Nothing marks one name as the original.

```bash
# in EiN's terminal
ln /archive/albums/christmas-2019/files/IMG_0412.jpg /home/helen/IMG_0412.jpg
```

Each node counts its names. The count is the third column of `ls -l`, and **Links** in the
**Nodes** explorer's **Properties**; a node with one name shows `1`. Removing a name with `rm`
lowers the count, and the node itself is deleted only when its last name goes. `rm -r` on a folder
that still has another name removes only that name and leaves everything in it.

EiN makes no hard links of its own, and the web interface has no way to make one. `ln` refuses one
between two different stores, for example into a [mounted](../shell/remote.md) folder of another
machine, with `cannot link across different VFS backends`, and SFTP has no hard links.

> [!WARNING]
> A hard link can make a node visible where its other path is closed. A node with a name in an open
> folder can be reached through that name, whatever the folder of its other name allows.
> [Permissions in depth](../admin/permissions.md#a-folder-governs-what-is-under-it) explains why.

## See links

**In the terminal.** `ls -l` ends a softlink's line with `->` and its target. `find -type l` lists
the softlinks under a folder. Commands follow softlinks unless you ask them not to:

| Command                                   | Without `-L`                  | With `-L`                               |
| ----------------------------------------- | ----------------------------- | --------------------------------------- |
| `ls`                                      | Lists what the link points at | Lists the link itself                   |
| `stat`, `info`                            | Show the target               | Show the link, its target in `softlink` |
| `chmod`, `chown`, `acl`, `attrs`, `props` | Act on the target             | Act on the link                         |

`-L` means "do not follow" in EiN, which is the opposite of GNU `ls -L`.

```bash
# in EiN's terminal
ls -l /archive/tags/sailing
stat -L /archive/albums/christmas-2019/coverPhoto
```

EiN has no `readlink` command, and nothing lists the links that point at a node.

**In the Nodes explorer.** A softlink shows a link icon, with `→` and its target after its name.
Select it and choose **Properties** (<kbd>Alt</kbd>+<kbd>Enter</kbd>) to see **Link to** with the
target and **Links** with the count of names.

![The Nodes explorer open at /archive/people/Peggy_Wrenfield: the folders children, devices, events, homes and partners, and a softlink of type softlink with an arrow to a path under /archive/albums](../../assets/shots/nodes.webp "A person's folder holds folders of relation links and a cover link; the arrow shows where the link points.")

**Over SFTP.** Softlinks are symbolic links: `ls -l` in `sftp` shows them as links, following one
takes you to the target, and `ln -s` makes one. A recursive copy copies the link, not what it points
at. [SSH and SFTP](../shell/ssh-sftp.md#what-the-tree-looks-like-over-sftp) has the rest.

## Make and remove links in the terminal

1. Make a softlink with `ln -s`, the target first:

   ```bash
   # in EiN's terminal
   ln -s /archive/albums/christmas-2019/files/IMG_0412.jpg /home/helen/favourite.jpg
   ```

2. Check it with `ls -l /home/helen`. The line for `favourite.jpg` ends with
   `-> /archive/albums/christmas-2019/files/IMG_0412.jpg`.
3. Remove it with `rm /home/helen/favourite.jpg`. That removes the link only; the picture stays.

If the name is taken, `ln` stops with `ln: failed to create link '<name>': File exists`. `ln -f`
replaces what is there. Unlike GNU `ln`, an existing folder as the second argument is not a place
to put the link in: name the link in full.

For links that EiN keeps track of, use the command that owns them rather than `ln` and `rm`. A
label lives on the node that carries it, and searches read it there, so the link in
`/archive/tags/` alone does not label anything:

| To change               | Use                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Labels                  | `label add`, `label remove`                                                                    |
| Favourites              | `star`, `star -d`                                                                              |
| Relations between nodes | `relate`, `unrelate`                                                                           |
| Family ties and homes   | the `person-…` commands in [Family tree, events and homes](../guide/family.md#in-the-terminal) |
| An album's cover        | `album-cover`                                                                                  |
| Group membership        | `group-add-member`, `group-remove-member`                                                      |

## Moving keeps softlinks pointing right

When a node moves, every softlink that points at it, or at anything under it, is re-pointed to the
new path in the same step. An album can therefore be moved without losing its cover, its labels,
its place in other albums or anyone's favourites. This holds for `mv`, for **Rename** and
**Paste** in the **Nodes** explorer, for filing pictures from staging into an album, and for merging
people or duplicates.

Two kinds of softlink are not re-pointed:

- one with a **relative** target, which keeps its text as it was;
- any link when you move with `mv --no-relink`, which leaves them all on the old path.

One `mv` re-points at most 100,000 links. A move that more links point into is refused with
`more than 100000 links point into the moved paths; move fewer at a time`.

`mv` says nothing about the links on success. Run as `JSON_OUTPUT=1 mv …`, its answer counts them in `relinked`.

Renaming an album in **Edit album** changes only its name on the page; its folder keeps its first
name, so no link needs to change.

## Deleting, the trash and links

What happens to links depends on how a node goes. [Your profile, favourites and trash](../guide/profile.md#the-trash) lists which actions use the trash.

| What you do                                 | The link you act on    | Links pointing at the node                                                                                                                     |
| ------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Remove a picture from an album (**Remove**) | That album's link goes | Others are left alone; the picture stays where it lives                                                                                        |
| Move a node to the trash                    | —                      | Left as they are. They point at nothing while it is in the trash, and work again when you restore it                                           |
| Delete for good, or empty the trash         | —                      | Label links and the other half of every pair are removed by `relations-guard`. Covers, album links and favourites are left pointing at nothing |
| `rm` a softlink                             | The link goes          | —                                                                                                                                              |
| `rm` a node with hard links                 | One name goes          | —                                                                                                                                              |

While something is in the trash it is gone for everyone, including through the links to it. A
node with a hard link elsewhere is different: moving one of its names to the trash leaves it
reachable by its other name.

## When something goes differently

| What you see                                                       | What it means                                                                                              | What to do                                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Node not found:` and a path, when you open a link                 | The link points at nothing: its target was deleted, is in someone's trash, or was moved with `--no-relink` | Restore the target from the trash, point the link again with `ln -sf`, or remove it with `rm`        |
| `too many levels of symbolic links`                                | Links point at each other in a loop, or a chain is longer than 40                                          | Look at the targets with `ls -l` and correct one                                                     |
| A label is still listed with nothing behind it                     | A link in `/archive/tags/<label>/` points at something gone                                                | `label prune` removes every label link that points at nothing                                        |
| The other half of a family tie is missing                          | One half was removed while `relations-guard` was not running                                               | `person-check /archive/people` reports broken ties; remove the tie and add it again                  |
| Labels or relation halves stay after something is deleted for good | The `relations-guard` service is stopped                                                                   | An administrator checks it with `service-status`; see [Services and logs](../admin/services-logs.md) |
| `ln: failed to access '<target>': No such file or directory`       | A hard link needs an existing target                                                                       | Check the path, or make a softlink with `-s`                                                         |
| `Access denied for operation` when you follow a link               | A softlink is not a way in: you need access along the target's own path                                    | Ask the target's owner to [share](../guide/sharing.md) it                                            |

## Related pages

- [Nodes and node types](nodes.md): what a node is, the `softlink` type among them
- [The tree](tree.md): the folders the links live in and point into
- [Files and storage](files.md): what a file node holds
- [Albums](../guide/albums.md): adding, removing and deleting pictures
- [Permissions in depth](../admin/permissions.md): why a softlink grants nothing and a hard link can
- [Commands: `ln`](../reference/commands-core.md#ln), [`mv`](../reference/commands-core.md#mv),
  [`relate`](../reference/commands-core.md#relate), [`label`](../reference/commands-core.md#label)
- [Node types](../reference/node-types.md#structure): the reference entry for `softlink`
