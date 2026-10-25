# Permissions in depth

Every node in EiN has an owner, a group, mode bits and, when it needs one, an access list. This
page is for administrators, and for anyone who wants to see what the **Share** dialog writes: how
EiN decides who may read, change and pass through a node, what a new node starts with, and how to
read and change it all from the terminal.

The **Share** dialog sets all of this without numbers, and [Sharing](../guide/sharing.md) explains
it for everyone in the family. Accounts and groups themselves are made on
[Accounts and groups](accounts.md).

## The four parts of a node's access

Like a file on Linux, every node carries:

| Part        | What it is                                                                                  | Shown as               |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------------- |
| Owner       | One account, by its uid. Usually whoever created the node.                                  | `helen`                |
| Group       | One group, by its gid. Usually the group of the folder it was created in.                   | `users`                |
| Mode        | Read, write and execute, once for the owner, once for the group and once for everyone else. | `rwxr-x---`, or `0750` |
| Access list | Further users and groups, each with its own read, write and execute. Optional.              | `group:family:rwx`     |

What the three letters allow on a node:

| Bit         | On a node                                                | On a folder, album or anything with children  |
| ----------- | -------------------------------------------------------- | --------------------------------------------- |
| `r` read    | See its bytes and attributes.                            | See what it holds; listing takes `r` and `x`. |
| `w` write   | Change it, its attributes, its mode and its access list. | Add to it and remove from it (with `x`).      |
| `x` execute | —                                                        | Pass through it to what lies below.           |

Any node can hold children here, so the folder column applies to albums, people, locations and
files alike: a photo holds its thumbnails and metadata as children.

### How EiN decides

EiN asks, in this order, and stops at the first yes:

1. Are you an administrator? Then yes, always.
2. Is this a write, and are you not signed in? Then no, whatever the bits say.
3. Are you the owner, and do the owner's bits allow it?
4. Is the node's group one of your groups, and do the group's bits allow it?
5. Do everyone else's bits allow it?
6. Does an entry in the access list name you or one of your groups, and allow it?

Every step can only grant. Unlike Linux, being the owner does not shut you out of what the other
bits give: a node at `0074` still lets its owner read it. The access list adds people and never
takes anyone away; there is no entry that denies.

> [!NOTE]
> Write on a node is enough to change its mode and its access list. That is why **Can edit** in the
> **Share** dialog also lets someone change who the album is shared with. Changing the owner is the
> exception; see [Change the owner and the group](#change-the-owner-and-the-group).

## Who you are to EiN

| Who                                          | uid                                  | Groups                                                    | What is special                                                     |
| -------------------------------------------- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------- |
| The administrator, `admin`                   | `0`                                  | `admin` (`0`), `users`                                    | Passes every check.                                                 |
| An account, such as `helen`                  | its own                              | its own group, `users`, and every group it is a member of | —                                                                   |
| A member of `sudo` who chose **Administer…** | its own                              | as above                                                  | Passes every check until the sign-in ends or they leave admin mode. |
| The guest, `guest`                           | `1001`                               | `guest` (`1001`)                                          | Never writes. Whoever opens EiN without signing in.                 |
| A share link                                 | one of its own, from `1073741824` up | none                                                      | Never writes; its entries stop granting when the link expires.      |

A few rules follow from how groups are read:

- **Every signed-in person is in `users`** (gid `1002`). Sharing with `users`, which the dialog calls
  **Everyone with an account**, shares with all of them.
- **A member is someone with a membership link.** `group-add-member family jon` puts a link named
  `jon` to `/etc/users/jon` in `/etc/groups/family/users`. Anything else placed there makes nobody a
  member.
- **Groups are read when someone signs in.** A person added to or taken out of a group keeps the
  groups they signed in with until they sign in again. Taking someone out of `sudo` is the
  exception: it ends their admin mode at once.
- **Being in the `admin` group makes nobody an administrator.** It is the administrator's own group,
  as root's is on Linux, and gives no write to the system's folders. To let someone act as the
  administrator when they need to, add them to `sudo`; see [Accounts and groups](accounts.md).

To see who you are:

```bash
# in EiN's terminal
user-whoami
user-groups helen
```

## See a node's permissions

### In the web interface

1. Open **Nodes** under **System** in the sidebar.
2. Go to the node. The **Mode**, **Owner** and **Group** columns show its access; a lock in place of
   the arrow means you may not list what it holds.
3. Choose **Properties** in the node's context menu, or press <kbd>Alt</kbd>+<kbd>Enter</kbd>.

![The Nodes page at /archive/people/Peggy_Wrenfield: folders children, devices, events, homes and partners, each rwxrwxr-x, owned by admin, group users; the tool pane shows Peggy Wrenfield's picture with her mode, owner and group](../../assets/shots/nodes.webp "The Nodes page shows every node's mode, owner and group, and the properties dialog changes them.")

The properties dialog has three tabs:

- **General** shows the node's **Mode** as a number and as a grid of **Owner**, **Group** and
  **Other** against `r`, `w` and `x`, with **Owner** and **Group** pickers. **Apply** saves them,
  and stays off when you may not change the node.
- **Attributes** lists the node's attributes.
- **Sharing** is the **Share** dialog's own body: owner, grants, visitors and links in words.

### In the terminal

```bash
# in EiN's terminal
ls -l '/archive/albums/Christmas at the cottage'     # mode, owner and group of what it holds
stat '/archive/albums/Christmas at the cottage'      # the node itself: type, mode, owner, times
acl '/archive/albums/Christmas at the cottage'       # owner, group, bits and access list
share-info '/archive/albums/Christmas at the cottage' # the Share dialog's view, as YAML
```

In `ls -l` a `+` after the mode, as in `rwxr-x---+`, says the node has an access list. `acl` prints
the bits and the list in the shape `getfacl` uses:

```text
# node: /archive/albums/Christmas at the cottage
# owner: helen (1003)
# group: users (1002)
user::rwx
group::r-x
other::---
group:family:rwx
user:jon:r-x
link:1073741825:r-x
```

A `link:` line is a share link's entry, by its uid; `share-link list <path>` says which link it is.
`share-info` also lists the photos below a folder that keep their own sharing, its links, and, for
an administrator, everyone who has access and through what.

## Change the mode

`chmod` takes a mode as four octal digits or as symbolic clauses:

```bash
# in EiN's terminal
chmod 0750 '/archive/albums/Christmas at the cottage'
chmod g+w '/archive/albums/Christmas at the cottage'
chmod u=rwx,g=rx,o= '/archive/albums/Christmas at the cottage'
chmod -r o-rw /archive                 # the whole subtree; each node keeps its other bits
```

| Form               | Meaning                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `0750`, `750`      | Set all nine bits. The same mode on every node of a recursive change. |
| `u`, `g`, `o`, `a` | Owner, group, everyone else, all three. No letter means all three.    |
| `+`, `-`, `=`      | Add these bits, take them away, or set exactly these.                 |
| `r`, `w`, `x`      | The bits. Clauses are joined with commas.                             |

A symbolic mode is worked out from each node's own mode, as coreutils' `chmod -R` does, so
`chmod -r o-rw` clears only those bits and leaves every node's other bits as they were. EiN has no
setuid, setgid or sticky bit and no `X`.

`-r` applies the change to the whole subtree (see
[What a recursive change does](#what-a-recursive-change-does)); `-L` changes a softlink itself
rather than what it points to.

## Change the owner and the group

```bash
# in EiN's terminal
chown jon '/archive/albums/Summer 1987'           # owner only (administrator)
chown jon:family '/archive/albums/Summer 1987'    # owner and group (administrator)
chown :family '/archive/albums/Summer 1987'       # group only
chown -r :family '/archive/albums/Summer 1987'    # group of the whole subtree
```

The owner and group are written `user:group` (or `user.group`), by name or by number, and either
half may be left out. The rules are Linux's:

- **Only an administrator gives a node to another user.** Anyone else is refused with
  `Access denied for operation 'change uid'`.
- **Anyone else may move a node only into a group they are in**, and needs write on it. Another
  group is refused with `Access denied for operation 'change gid'`.

Without these rules someone could make what they wrote look like someone else's, or file it in a
group they do not belong to. The owners of accounts, groups and sign-in sessions are the
administrator's alone to change.

## Grant more people with an access list

The mode names one group. An access list adds as many users and groups as you need, each with its
own bits:

```bash
# in EiN's terminal
acl -m g:family:rwx '/archive/albums/Christmas at the cottage'   # the family group may edit
acl -m u:jon:rx '/archive/albums/Christmas at the cottage'       # Jon may view
acl -x u:jon '/archive/albums/Christmas at the cottage'          # take Jon's entry away
acl -b '/archive/albums/Christmas at the cottage'                # remove every user and group entry
acl -r -m g:family:rx '/archive/albums/Christmas at the cottage' # the whole subtree
```

- An entry is `u:<user>:<bits>` or `g:<group>:<bits>` (`user:` and `group:` work too), by name or
  number. `-m` replaces an entry for the same user or group rather than adding a second.
- **Can view** in the **Share** dialog is `rx` and **Can edit** is `rwx`.
- `-b` leaves share links' entries in place: `share-link` gives and takes those. `share-set
  --drop-links` removes them too.
- Each node in a recursive change edits its own list, as `setfacl -R` does, so an entry a folder
  inside already has beyond the edit stays.

## Set it all at once with share-set

`share-set` changes the mode, the owner, the group and the access list together, in one walk of the
subtree, and is what the **Share** dialog runs when you click **Save**. Unlike `chmod -r`, it is
recursive unless you say otherwise:

```bash
# in EiN's terminal
share-set '/archive/albums/Christmas at the cottage' --mode 0750 -b -m g:family:rwx -m u:jon:rx
share-set '/archive/albums/Summer 1987' --group family --mode g+rx
share-set '/archive/albums/Summer 1987' --default-owner          # the configured default sharing
share-set '/archive/albums/Summer 1987/files/IMG_0042.jpg' --reference '/archive/albums/Summer 1987'
share-set '/archive/albums/Summer 1987/files/IMG_0042.jpg' --mode 0700 -b --drop-links --pin
```

```text
updated 214, kept own access 3, skipped 0, failed 0
```

| Option               | What it does                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mode`             | The mode, octal or symbolic.                                                                                                                               |
| `--owner`            | The owner, by name or uid. Administrators only.                                                                                                            |
| `--group`            | The group, by name or gid: one you are in, unless you are an administrator.                                                                                |
| `--default-owner`    | The configured default owner and group (see [What new albums start with](#what-new-albums-start-with)), applied by the server to every node you may write. |
| `--reference <path>` | Share the node as another one is: its group, mode and access list. The owner stays.                                                                        |
| `-m`, `-x`, `-b`     | Edit the access list, as `acl` does.                                                                                                                       |
| `--drop-links`       | Remove share links' entries too, so no link opens the nodes.                                                                                               |
| `--pin`, `--unpin`   | Hold the node against changes from further up, or let them reach it again.                                                                                 |
| `--no-recursive`     | Change only the node named.                                                                                                                                |
| `--strict`           | Exit non-zero when any node below could not be changed.                                                                                                    |

`share-set` exits 0 when only some nodes below refused, and reports them in its counts and on
standard error; it fails only when every path it was given refused. Every option is in the
[reference](../reference/commands-core.md#share-set).

### Keep one photo's own sharing

A pinned node keeps its access when a change comes from further up. A recursive change always
writes the node it was aimed at, but passes over a pinned node and everything below it. This is what
**Share** in an album's selection bar does when you give chosen photos sharing of their own, and how
one photo stays private in a shared album; see
[Keep some photos private in a shared album](../guide/sharing.md#keep-some-photos-private-in-a-shared-album).

```bash
# in EiN's terminal
share-set '/archive/albums/Summer 1987/files/IMG_0042.jpg' --pin
share-set '/archive/albums/Summer 1987/files/IMG_0042.jpg' --reference '/archive/albums/Summer 1987' --unpin
```

The pin is written on that node only. `share-info` on the album lists the pinned nodes below it,
and a share link made on the album does not open them.

## What a recursive change does

`chmod -r`, `chown -r`, `acl -r` and `share-set` walk the subtree the same way:

- **It reads the whole subtree first and writes the folder you named last.** A change can take away
  the access the walk needs to get through, so nothing is written until everything has been
  found, and the folder's own access, which `share-info` reports, is never ahead of what is below
  it.
- **Pinned nodes and everything below them are passed over**, and counted as "kept own access".
- **Softlinks are changed as links**, never followed to their targets, so a link in an album to a
  photo elsewhere does not change that photo.
- **It stops at mount points.** What another store mounts inside the subtree is left alone.
- **A node is changed once**, however many places it hangs in.
- **A node that refuses is counted, not fatal**, as `chmod -R` behaves over files someone else owns.
  What you may not read is not listed to you, so it counts against its folder without names.
- **<kbd>Ctrl</kbd>+<kbd>C</kbd> stops between batches**, with the folder you named as it was.

A plain `chmod` of a large folder rewrites the stored reach of everything below it (see
[A folder governs what is under it](#a-folder-governs-what-is-under-it)), so expect it to take a
while on an album of thousands of photos.

## What a new node starts with

When a node is created and nothing names its access:

| Part        | What it gets                                                                                                                                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner       | Whoever created it.                                                                                                                                                                                                          |
| Group       | Its parent's group, as a setgid directory does on Linux.                                                                                                                                                                     |
| Mode        | Everything for the owner; read and pass-through for the group, plus write where the group could write the parent; for everyone else, only the read and pass-through the parent gives them. Others' write is never inherited. |
| Access list | Its parent's, as a Linux default ACL carries down.                                                                                                                                                                           |

So a family album's new uploads, and the thumbnails, faces and metadata processing adds under them,
take the album's group and grants whoever created them: a person or group granted an album sees
what is added to it later. What is made under `/home/<user>` stays in that user's group, and the
system tree under `/` stays `0755`.

Moving a node with `mv` keeps its own access, as on Linux. Copying with `cp` is a create in the
destination: the copy takes the destination's group and keeps its source's mode, less group write
where the new parent gives none and less everyone else's write.

### What new albums start with

A new album, made in the web interface or with `album create`, and what staging publishes start with the
**default sharing**: an owner, a group and a mode, which an administrator sets under **Settings →
Permissions**, on the **Sharing** card.

![The Permissions tab of Settings: the New users card with the Users group ticked, the Visitors card with Visitors may browse on, the Sharing card saying "Shared with Users: the owner can change it, members can see it, anyone else can't see it", with Owner empty, Group Users and Permissions Owner Edit, Group "users" View, Everyone else None, as 0750, and the Sign-in sessions card](../../assets/shots/settings-permissions.webp "The Sharing card sets what every new album starts with, and says in a sentence what that comes to.")

| Setting                                                                       | On the card                                                                        | Default                   |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------- |
| [`CFG_DEFAULT_SHARE_OWNER`](../reference/settings.md#cfg_default_share_owner) | **Owner**                                                                          | empty: whoever creates it |
| [`CFG_DEFAULT_SHARE_GROUP`](../reference/settings.md#cfg_default_share_group) | **Group**                                                                          | `users`                   |
| [`CFG_DEFAULT_SHARE_MODE`](../reference/settings.md#cfg_default_share_mode)   | **Permissions**: **None**, **View** or **Edit** for owner, group and everyone else | `0750`                    |

On a standard installation a new album is therefore owned by its creator, seen by everyone with an
account and changed only by its owner. Each person narrows or widens that for what they create with
**How widely what you create is shared** on their profile
([`CFG_USER_DEFAULT_SHARE`](../reference/settings.md#cfg_user_default_share)); see
[Your profile](../guide/profile.md#how-widely-what-you-create-is-shared). **Default** in the
**Share** dialog, and `share-set --default-owner`, put a node back on the default sharing.

The same settings in the terminal, in the octal form:

```bash
# in EiN's terminal, as the administrator
config set CFG_DEFAULT_SHARE_GROUP family
config set CFG_DEFAULT_SHARE_MODE 0750
```

[Configuration](configuration.md) explains where settings are kept.

## A folder governs what is under it

Reaching a node by its path takes execute on every folder along the way, from `/` down. EiN applies
the same rule wherever it finds a node without walking a path: search, the Media feed, the map, a
person's faces, duplicates, links. A node shows up only when you may read it **and** at least one of
its paths is open to you all the way down.

This is what keeps staging private. `/home/<user>/staging` is `0700`, so the uploads inside it stay
out of everyone else's search and map, whatever their own modes say.

- **A node linked in two places is reachable through either.** A hard link (`ln` without `-s`) into
  an open folder makes it visible there even when its other path is closed.
- **A softlink is not a path.** It points somewhere; whoever follows it still needs the access along
  the target's own path.
- **What is in someone's trash is never offered by a search**, to anyone, the administrator
  included, though counts may still include it until the trash is emptied.

EiN keeps on each node who can get there, and works it out again below every node whose parents or
access change, so group membership and link expiry are judged as you read and changing them rewrites
nothing. If you suspect the stored answer is wrong, an administrator can check a sample of nodes
against a walk of their paths:

```bash
# in EiN's terminal, as the administrator
reach-check
reach-check --sample=10000
```

```text
2000 nodes judged for 9 callers: 0 disagree
```

Any line under it names a node, a path and a uid for which the stored answer and the walk differ,
and the uids or gids the stored answers name that no account, group or link holds.

## The other bits are the system's

The bits for everyone else give every visitor and every account the parts of EiN they all need to
run: `/`, `/etc`, the commands, the web interface, the modules' files. Content does not use them to
share:

| Path                          | Owner and group            | Mode   | Why                                                                      |
| ----------------------------- | -------------------------- | ------ | ------------------------------------------------------------------------ |
| `/archive`                    | `admin`, `users`           | `0771` | Everyone may pass through; nobody but the group reads it.                |
| `/archive/tags`               | `admin`, `users`           | `0771` | The same.                                                                |
| `/home/<user>`                | the account, its own group | `0751` | Others may pass through to what the owner grants, and read nothing else. |
| `/home/<user>/staging`        | the account                | `0700` | Nobody else, not even through search.                                    |
| `/etc/users/<name>`           | `admin`                    | `0755` | The account itself; only the administrator changes it.                   |
| `/etc/users/<name>/.password` | `admin`                    | `0600` | Its user can neither read nor replace it.                                |
| `/etc/groups/<group>/users` | its creator, the group | `0750` | Members may see who else is in the group, not add anyone. |
| `/var/links/<id>` | `admin` | `0600` | A share link's record, holding its token. |

Content reaches every account through the `users` group, and visitors who are not signed in through
an access-list entry for the `guest` group, `g:guest:rx`, which the **Share** dialog shows as
**Visitors who are not signed in**. When you open the **Share** dialog on something whose
everyone-else bits still read it, the dialog shows them as **Everyone with an account**, and
**Save** moves them there and clears the bits.

To clear what older content still gives everyone else:

```bash
# in EiN's terminal, as the administrator
chmod -r o-rw /archive
```

## Visitors and share links

Someone who opens EiN without signing in acts as the guest. Whether they see anything depends on
**Visitors may browse** under **Settings → Permissions**
([`CFG_GUEST_BROWSING`](../reference/settings.md#cfg_guest_browsing), off unless set):

- **Off**: the guest gets the sign-in page and nothing else. In the terminal they may run only
  `login`, `logout`, `user-whoami`, `share-link`, `config` and `config-list`; anything else answers
  `sign in first`.
- **On**: the guest sees what is granted to the `guest` group, and what the other bits give.

The guest never writes, whatever a mode or an access list says, its own `/home/guest` included.

A share link is a principal of its own: a uid nobody else holds, in no group. Making a link adds an
entry `rx` for it on the node and on everything below it that its creator may change, passing over
pinned nodes. Whoever opens the link reads what it opens and nothing an earlier link opened, never
writes, and loses the access when the link expires. Turning a link off takes its entry off every
node, wherever the node has moved since. Someone already signed in who opens a link stays themselves.
How to make and send one is on [Sharing](../guide/sharing.md#share-an-album-with-a-link).

## Administrators

The administrator, uid `0`, passes every check, as root does on Linux: private albums and other
people's homes and staging included. A member of the `sudo` group passes them too while their
sign-in is elevated, which they start with **Administer…** in the account menu (or `admin` in a
terminal) and end with **Leave admin mode** (or `admin --off`). A terminal acting as the
administrator ends its prompt in `#`. [Accounts and groups](accounts.md) covers who may do this.

Commands that only an administrator may run refuse everyone else before they start:

```text
user-create: permission denied: only an administrator may run it
```

Only an administrator creates or hard-links an account, group or session node, and nobody,
the administrator included, changes an account's uid or a group's gid once it exists, since
ownership and access lists name the number. When an account or group is deleted, its number is
taken off every node first: what it owned goes to the account named with `--to` (the administrator
by default), and every access-list entry naming it is dropped, so whoever is given that number later
inherits nothing.

## Over SSH, SFTP and the web

The same rules apply wherever you come in: the web interface, EiN's terminal, SSH and SFTP all sign
in as the same account and see only what it may. Downloading a file over the web takes read on it.
See [SSH and SFTP](../shell/ssh-sftp.md).

A folder mounted from another machine with `mount … sftp` is different: every node in it is owned by
the mount's owner and group (the administrator who mounted it, by default), and its bits are the
ones the SFTP server reports.

## When something goes differently

**A command says `Access denied for operation 'w' on node: …`.** The letter is what was missing:
`r`, `w` or `x`. The node named is the one that refused, which may be the folder above what you
asked for: creating, removing or moving a node takes `w` and `x` on its folder, and moving it also
takes `w` on the node itself. Check with `acl` on the node and on its folder.

**Someone added to a group still cannot see the album.** Groups are read at sign-in. Ask them to
sign out and in again.

**A folder's mode changed but a photo inside did not.** The photo is pinned, or you may not write
it. The counts after `share-set` (`kept own access`, `failed`) and the lines on standard error say
which. `share-info` on the folder lists the pinned nodes; `share-set <path> --unpin` lets changes
reach a node again.

**A photo is open to someone but they cannot find it in search or on the map.** A folder on every
path to it is closed to them. Give them pass-through on that folder, or link the photo into a
folder they can reach.

**`chown` says `Access denied for operation 'change gid'`.** You are not in the group you named.
An administrator can make the change, or add you to the group.

**`share-info` says `sign in to see who has access`.** You are acting as the guest. Who has access
names people and groups, so it is shown only to someone signed in.

**A visitor sees the sign-in page instead of a shared album.** **Visitors may browse** is off. Turn
it on under **Settings → Permissions**, or send them a [share link](../guide/sharing.md#share-an-album-with-a-link),
which works either way.

## Related pages

- [Sharing](../guide/sharing.md): the **Share** dialog, the visibility chip and share links.
- [Accounts and groups](accounts.md): making accounts and groups, membership, `sudo`.
- [Configuration](configuration.md): where the default sharing and other settings are kept.
- [The tree](../concepts/tree.md) and [Links](../concepts/links.md): where nodes live, and hard and
  soft links.
- [Core commands](../reference/commands-core.md): every option of
  [`chmod`](../reference/commands-core.md#chmod), [`chown`](../reference/commands-core.md#chown),
  [`acl`](../reference/commands-core.md#acl), [`share-set`](../reference/commands-core.md#share-set),
  [`share-info`](../reference/commands-core.md#share-info) and
  [`reach-check`](../reference/commands-core.md#reach-check).
