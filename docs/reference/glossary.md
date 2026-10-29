# Glossary

This page defines the words the EiN documentation uses, in alphabetical order, for anyone who meets
one and wants to know what it means. Each entry is short and links the page that explains the
topic in full.

A few words mean two things in EiN, depending on where you meet them: an **event** is a change to
the tree or a dated note on a person, a **group** is a set of accounts or a suggested album in
staging, and a **link** is a softlink, a hard link or a share link. Each meaning has an entry of its
own.

Most words are core's and hold on every EiN. A word that belongs to a module starts its entry with
the module's name in italics, such as _Archive._, and means something only with that module
installed.

[A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) ·
[J](#j) · [L](#l) · [M](#m) · [N](#n) · [O](#o) · [P](#p) · [Q](#q) · [R](#r) · [S](#s) ·
[T](#t) · [U](#u) · [V](#v) · [W](#w)

## A

### Access list

Further users and groups that a node grants access to, beyond its owner and group, each with its
own read, write and execute, such as `group:family:rwx`. It is optional. The **Share** dialog
fills it in for you; `acl` and `share-set` set it in the terminal. See
[Permissions in depth](../admin/permissions.md#grant-more-people-with-an-access-list).

### Account

A person who can sign in, with a username, a password and a home folder. Each account is a `user`
node under `/etc/users`, belongs to groups and has a personal group named like itself. EiN starts
with two accounts, `admin` and `guest`. See [Accounts and groups](../admin/accounts.md).

### Admin mode

A sign-in of a member of the `sudo` group that acts as the administrator for a while. It starts
with **Administer…** in the account menu, or `admin` in a terminal for that terminal alone, and ends with
**Leave admin mode**, or `admin --off`. See
[Finding your way around](../guide/interface.md#admin-mode).

### Administrator

The `admin` account, uid `0`, which passes every permission check, as `root` does on Linux. A member
of the `sudo` group in admin mode passes them too. Some commands and pages, such as **Nodes** and
**Dashboard**, are for administrators only. See
[Permissions in depth](../admin/permissions.md#administrators).

### Album

_Archive._ A node of type `album` that gathers the photos, videos and recordings of one occasion. It holds the
files uploaded into it and links to pictures added from elsewhere, and keeps its cover, its time
span and its stacks. Albums are under `/archive/albums`. See [Albums](../archive/albums.md).

### Archive

The first module, `archive`, and what it adds: albums, people and their family tree, locations,
devices and their tracks, labels, staging, and the pipelines that process media. Its parts of the
tree are `/archive/albums`, `/archive/people`, `/archive/locations` and `/archive/devices`. Without it, EiN keeps what you give it and works nothing out. See
[The Archive](../archive/index.md) and [Modules](../admin/modules.md).

### Assistant

The chat that answers questions about what the archive holds and about EiN, by running EiN's
commands as you. A command that would change something waits until you press **Run**. It comes
with the `assistant` module and needs a language model. See [The Assistant](../assistant/index.md)
and [Chatting with the assistant](../assistant/chat.md).

### Attribute

A named value a node carries besides its name and permissions: a photo's size, checksum and capture
time, a person's names and dates. The node's type decides which attributes it has. `attrs` shows
them in the terminal. See [Nodes and node types](../concepts/nodes.md).

### Audit trail

A record of every write to the tree: who created, changed, moved, linked or removed which node,
when, and what changed. The `audit` command reads it, for administrators only. Writes under `/var`
and terminal sessions leave no record. See [Commands](commands-core.md#audit).

## B

### Bulk lane

The lowest place in the order of the pipeline engine's work. With the Archive, work on a staging
category of the **Google Photos export** or **Scans** kind runs there unless you change it, so what
people upload in the meantime is processed first. See
[Processing and pipelines](../admin/processing.md#the-bulk-lane).

### Burst

_Archive._ Several shots taken a moment apart. A burst is not a duplicate: EiN folds it into a stack and
removes nothing. See [Duplicates](../archive/duplicates.md#copies-look-alikes-and-bursts).

## C

### Category

_Archive._ A folder of your staging area that keeps one source together, such as a Google Photos export, a box
of scanned prints or a phone. Its kind (**Inbox**, **Google Photos export**, **Scans**, **Phone**,
**Camera**, **Messaging**, **Screenshots** or **Other**) decides how its files are grouped, dated
and ordered for processing. See [Sorting in staging](../archive/staging.md#categories).

### Container

One part of an installation, run by podman or Docker with compose: `ein` (EiN itself), `db`
(PostgreSQL), and if you chose them `ems` (the media service) and `llm` (the language model). Only
`ein` has ports open to other machines. A container is not a service. See
[How EiN works](../start/how-ein-works.md#what-runs-beside-ein).

### Core

EiN without modules: the tree, the shell and its commands, the pipeline engine, accounts and
sharing, and the frame of the web interface. Core brings no pipelines of its own. See
[How EiN works](../start/how-ein-works.md#modules-decide-what-ein-is-for).

### Cover

_Archive._ The picture that stands for an album, a person, a location or a device on its card and in its
header. A cover is a softlink to one of the pictures, for a person to one of their face crops. See [Albums](../archive/albums.md) and
[People and faces](../archive/people.md#cover-pictures).

## D

### Dashboard

The administrator's page that sums up the system's state in one verdict (**Healthy**,
**Catching up**, **Stuck** or **Needs a person**) with tabs for the checks, the work waiting, the
services and the log, and with the `ems` module the media service. See [Health and the dashboard](../admin/monitoring.md).

### Data folder

The folder on the machine's disk that holds your files: the originals in `files`, the renditions
EiN makes from them in `files-volatile`. It is `~/ein/data` unless you chose another at install.
The database is kept apart, in the container engine's volume `ein_db`. See
[Files and storage](../concepts/files.md).

### Details panel

_Archive._ The panel beside a photo, video or recording in the viewer, with its date, place, people, labels,
camera and the text read from it. <kbd>i</kbd> opens and closes it. See
[Viewing photos, videos and recordings](../archive/viewer.md#the-details-panel).

### Device

_Archive._ A camera, phone or tracker, matched by its make, model and serial number. A registered device dates
the pictures it took in its own time zone and can keep a GPS track. Devices are under
`/archive/devices`. See [Devices and GPS tracks](../archive/devices.md).

### Discard

_Archive._ The staging decision that sends a group's files to your trash instead of filing them. It can be
undone. See [Sorting in staging](../archive/staging.md).

### Duplicate

_Archive._ A file that is the same picture as another. An exact copy is the same bytes and is kept once; a
look-alike is the same picture in other bytes, marked with how alike the two are, for you to
decide. A burst is not a duplicate. See [Duplicates](../archive/duplicates.md).

## E

### Embedding

A list of numbers that stands for a picture, a face, a voice or a text, so that similar things have
similar numbers. Search by meaning, finding faces of the same person and searching with a picture
all compare embeddings. The media service makes them. Also called a vector. See
[Search and the finder](../guide/search.md).

### EMS

_Media service._ The media service. The name is short for EiN Media Service.

### Event, a change

The announcement that a node was created, changed, moved or deleted, made once the change is saved.
Pipelines start from events. See [Changes and pipelines](../concepts/pipelines.md).

### Event, on a timeline

_Archive._ A dated note on a person, an album, a location or a device: a wedding, a move, a birth. A person's
event has the type **Generic**, **Birth**, **Death**, **Marriage** or **Engagement**. See
[Family tree, events and homes](../archive/family.md#record-an-event).

### EXIF

_Archive._ The metadata a camera or phone writes into a picture: the camera, the time it was taken, the
exposure and often where. EiN reads it on arrival and keeps it under the file as
`metadata/exif`. See [Dates and places of pictures](../archive/dates-places.md).

## F

### Favourite

A picture you have marked with a heart. A favourite is a softlink in the folder `stars` in your home
folder, so hearting a picture never copies or moves it. See
[Your profile, favourites and trash](../guide/profile.md#favourites).

### File

A node of type `file`: stored bytes with a name, a mimetype, a size and a checksum. A photo, a video,
a recording and a document are files. With the Archive, a media file keeps what EiN works out about it as children:
`metadata/`, `thumbnails/`, `regions/`. See [Files and storage](../concepts/files.md).

### Filing

_Archive._ The staging decision that moves a group's files into the library, as a new album, a new private
album or into an album that exists. Only filing makes your uploads visible to anyone else. See
[Sorting in staging](../archive/staging.md).

### Finder

The box in the middle of the top bar, **Search for anything**. It finds pages, and with the Archive albums,
people and places, as you type, and <kbd>Ctrl</kbd>+<kbd>K</kbd> puts the cursor in it from anywhere. See
[Search and the finder](../guide/search.md#the-finder-in-the-top-bar).

### Fingerprint

_Archive._ A short summary of a file's picture or sound that finds copies in other bytes, such as a smaller
version or a re-encoded video. EiN makes one once a file's metadata is read and compares it to find
look-alikes. See [Duplicates](../archive/duplicates.md).

### Front

_Archive._ The photo a stack shows as its tile in an album's grid. **Make front** in the viewer chooses another.
See [Albums](../archive/albums.md#stacks-of-similar-photos).

## G

### Group, of accounts

A set of accounts, kept under `/etc/groups`. Every node has one group, and an access list can name
more. EiN starts with the groups `admin`, `users`, `ssh`, `sudo` and `guest`, and every account has
a personal group. See [Accounts and groups](../admin/accounts.md).

### Group, in staging

_Archive._ A suggested album: files in a staging category that the organizer put together because they belong
to one occasion, folder or year. You file, discard or put aside each group. See
[Sorting in staging](../archive/staging.md).

### Guest

Whoever opens EiN without signing in. The guest can sign in or open a share link and nothing more,
unless an administrator turns on **Visitors may browse**; then the guest sees what is granted to
the `guest` group. The guest never changes anything. See
[Permissions in depth](../admin/permissions.md#visitors-and-share-links).

## H

### Hard link

The same node under a second name in another folder, as on Unix. Unlike a softlink, it is not a
node of its own. See [Links](../concepts/links.md).

### Health

What the `health` command and the **Dashboard** report: a verdict, **Healthy**, **Catching up**,
**Stuck** or **Needs a person**, and the checks behind it. See
[Health and the dashboard](../admin/monitoring.md#what-the-verdict-means).

### Home folder

Your own space in the tree, `/home/<username>`: your settings, shell history, favourites in `stars`,
your trash and, with the Archive, your staging area. See [The tree](../concepts/tree.md).

## I

### Importer

The `importer` module, which moves one particular older archive into EiN. It is not published and is
not a general importer: photos from anywhere else come in through the Archive's staging. See
[The Importer](../importer/index.md) and [Getting your photos in](../archive/importing.md).

### Inbox

_Archive._ The staging category every account has, which cannot be removed. Uploads land in it unless you
choose another category. See [Sorting in staging](../archive/staging.md#categories).

### Instance

One run of a pipeline on one node, with its steps and their status. A pipeline runs at most once per
node at a time. The **Work** tab of the dashboard lists instances, and `pipeline-status` prints one.
See [Processing and pipelines](../admin/processing.md#look-at-one-pipeline-and-its-instances).

## J

### Journal

_Archive._ The record of every staging decision, in `staging/journal` in your home folder, each with the plan
that undoes it. The **Done** tab and `staging undo` undo an entry. See
[Staging and importing for administrators](../archive/staging-admin.md#what-a-staging-area-is).

## L

### Label

One word, such as `sailing`, put on a picture, an album, a person, a location or a device. The same
word is the same label across the archive. A label is a folder under `/archive/tags` holding a link
to everything that carries it. See [Media, Year and labels](../archive/media.md#labels).

### Lane

_Archive._ A part of a staging category's stream of groups: **To sort**, **Everyday**, **Needs a date**,
**Clutter** and **Later**. Not to be confused with the bulk lane of processing. See
[Sorting in staging](../archive/staging.md#the-lanes).

### Language model

_Assistant._ The model the assistant asks, either in the `llm` container on your machine or at a hosted provider
with an OpenAI-compatible API. Everything except the chat works without one. See
[The language model](../assistant/language-model.md).

### Location

_Archive._ A named place, such as "Highbury", with an address, a description, labels, the people who lived
there, and a point, a circle or a polygon on the map. Pictures whose position falls inside a circle
or polygon are linked to it. Locations are under `/archive/locations`. See
[Locations and the map](../archive/places.md#what-a-location-is).

### Log

A node that keeps lines appended to it for a time, such as the system log `/var/logs/system`. See
[Services and logs](../admin/services-logs.md#where-the-logs-are).

### Look-alike

_Archive._ A file that shows the same picture as another in other bytes: a smaller version, a re-save in
another format, a mild crop. EiN marks it with how alike the two are and suggests which to keep. See
[Duplicates](../archive/duplicates.md#copies-look-alikes-and-bursts).

## M

### Manifest

A module's `mod.json`, which names the module and says what it needs. See
[The module manifest](../develop/manifest.md).

### Media service

_Media service._ The container, `ems`, that holds every media tool and model EiN uses: it reads metadata, makes
thumbnails and video renditions, finds faces, voices and text, transcribes speech and makes the
embeddings search compares. It keeps no data of its own. The Archive needs it. See
[The media service](../ems/index.md).

### Mode

The permission bits of a node: read, write and execute, once for the owner, once for the group and
once for everyone else, written as `0750` or `rwxr-x---`. `chmod` changes it. See
[Permissions in depth](../admin/permissions.md#the-four-parts-of-a-nodes-access).

### Module

A folder with a manifest that adds to EiN what its folders hold: commands, services, pipelines,
pages and sidebar entries, settings, node types and documentation. The published modules are
`archive`, `assistant` and `ems`. An administrator installs them on **Settings → Modules** or with
`mod install`. See [Modules](../admin/modules.md).

### Mount

A folder of another machine, reached over SFTP, shown at a path in the tree. An administrator makes
one with `mount`. See [Reaching other machines](../shell/remote.md#mount-a-folder-of-another-machine).

## N

### News

_Archive._ The timeline on **Home** of the albums people made lately. See
[Memories, news and events on Home](../archive/home.md#news).

### Node

Anything EiN keeps: a photo, an album, a person, an account, a log, a command. Every node has a
type, a name in its folder, an owner, a group, a mode and the attributes its type needs, and any
node can have children. See [Nodes and node types](../concepts/nodes.md).

### Node type

What decides what a node holds and how EiN treats it, such as `file`, `album`, `person` or `log`.
Core has types of its own and modules add theirs. See [Node types](node-types.md).

## O

### On this day

_Archive._ The row on **Home** with a ring for each year that has pictures taken on today's date. A ring opens
that day's memories story. See [Memories, news and events on Home](../archive/home.md#on-this-day).

### Organizer

_Archive._ The part of the Archive that sorts the files in your staging area into groups, within a few minutes
of their arrival. It leaves alone a group you have edited. The `staging-organize` pipeline runs it,
and the `staging-organizer` service asks for a run of what it missed.
See [Sorting in staging](../archive/staging.md).

### Owner

The account a node belongs to, usually whoever created it. The owner's bits in the mode say what
the owner may do. `chown` changes it. See [Permissions in depth](../admin/permissions.md).

## P

### Path

Where a node is in the tree, from `/`, as a file has: `/archive/albums/christmas-2019`. See
[The tree](../concepts/tree.md).

### Person

_Archive._ Someone in the archive, with names, dates and contact details, under `/archive/people`. Parents,
children and partners are links between people, and the photos a person is in are found by their
faces. See [People and faces](../archive/people.md).

### Personal group

The group every account made on the **Users** tab or with `user-create` gets, named like the
account: the account `helen` has the group `helen`. See
[Accounts and groups](../admin/accounts.md#the-accounts-and-groups-ein-starts-with).

### Pipeline

A definition of the change it waits for and the steps, each a command, that it then runs on the node
that changed. Modules bring pipelines; core brings none. See
[Changes and pipelines](../concepts/pipelines.md) and
[Processing and pipelines](../admin/processing.md).

### Pool

A node under `/var/pools` holding long-running jobs that wait for a worker with room for them. The
Archive's media steps wait in `/var/pools/media`, where its workers `cpu`, `models` and
`models-second` take them.
`pool stat` shows what is waiting. See
[Processing and pipelines](../admin/processing.md).

### Position

_Archive._ Where a photo, a location or an event is on the map, kept as its child named `position`: a point,
with a radius or an outline for a location. See
[Dates and places of pictures](../archive/dates-places.md).

## Q

### Queue

A node that holds messages in order until they are read; reading one removes it. The pipeline
engine takes its work from `/var/queues/pipeline-engine`. See
[Changes and pipelines](../concepts/pipelines.md).

## R

### Region

_Archive._ A box on a photo, kept under the photo's `regions/`: a face the detector found or a box someone
drew. It says who is in it. In the viewer a face box no person is assigned to reads **Unassigned**.
See [People and faces](../archive/people.md).

### Rendition

_Archive._ A version of a file that EiN makes for showing it: a thumbnail, a display size, or a video or
recording the browser can play. Renditions are kept in `files-volatile` in the data folder and can
be made again from the original. See [Files and storage](../concepts/files.md).

### Router

A node that passes what is written to it to everyone reading at that moment and keeps nothing, such
as `/dev/events`. See [Node types](node-types.md#system).

## S

### Service

A long-running job inside the `ein` container, a shell script EiN runs as the administrator: the web
server, the SSH server, the pipeline engine, the pool workers and tidying loops. Core brings nine,
and modules add theirs. A service is not a container. See
[Services and logs](../admin/services-logs.md#what-a-service-is).

### Session

A signed-in connection, a browser, an SSH login or a service, kept under `/var/sessions` and removed
when it ends. See [Accounts and groups](../admin/accounts.md).

### Setting

A named value that changes how EiN works, such as `CFG_TRASH_RETENTION_DAYS`. System settings, named
`CFG_…`, are changed by an administrator on **Settings → System**; personal ones, named
`CFG_USER_…` (and `HISTSIZE`), by each person under **Profile → Preferences**. Both can be changed with `config set`.
See [Configuration](../admin/configuration.md#two-kinds-of-settings) and [Settings](settings.md).

### Share link

An address that opens one node, such as an album, and what it holds, to anyone who has it, without
an account. It
expires after 30 days unless you choose another time, and **Delete link** stops it at once. Share
links are kept under `/var/links`. See
[Sharing](../guide/sharing.md#share-an-album-with-a-link).

### Sharing

Who can see and change a node, such as a folder or, with the Archive, an album, a person, a location
or a device, set in words with **Share**:
**Can view** or **Can edit** for people and groups, and links for people without an account. It
sets the same mode and access list as `chmod` and `acl`. See [Sharing](../guide/sharing.md).

### Shell

EiN's command language: bash syntax, run inside EiN, where the files and folders are the nodes of the
tree. The terminal, SSH and the assistant all run it. See [The shell language](../shell/bash.md).

### Side drawer

The panel at the right of the screen, where the chat opens. See
[Finding your way around](../guide/interface.md#pages-dialogs-the-side-drawer-and-full-screen).

### Sidebar

The column of entries down the left of every page. Core gives **Home**, **Search**, **Settings**,
**Statistics** and **Documentation**, and for administrators **Nodes** and **Dashboard**, and
modules add theirs. See
[Your sidebar and top bar](../guide/customizing.md).

### Softlink

A node that points at another node by its path; opening it opens what it points at. Labels and
favourites are softlinks, and with the Archive so are album covers, pictures added to an album
from elsewhere and relations between people. Moving a node re-points every softlink to it. See [Links](../concepts/links.md).

### Stack

_Archive._ Similar photos taken in a row, folded behind one tile in an album's grid, with the count in its
corner. No file moves, and a stack belongs to one album. See
[Albums](../archive/albums.md#stacks-of-similar-photos).

### Staging area

_Archive._ Your private inbox for uploads, `/home/<username>/staging`, where files wait, seen only by you,
until you file them into an album or discard them. It comes with the Archive. See
[Sorting in staging](../archive/staging.md).

### Step

One command in a pipeline. The pipeline engine runs short steps itself and puts long ones as jobs in
a pool. Its status is `pending`, `queued`, `waiting`, `running`, `completed`, `failed` or `skipped`.
See [Processing and pipelines](../admin/processing.md#look-at-one-pipeline-and-its-instances).

## T

### Terminal

The panel that drops down over the page with a shell of your own in each tab. The top bar's terminal
button or <kbd>Alt</kbd>+<kbd>T</kbd> opens it. See [The terminal](../shell/terminal.md).

### Top bar

The bar across the top of every page, with the finder, **Create**, the terminal button and the
account menu. See [Finding your way around](../guide/interface.md#the-top-bar).

### Track

_Archive._ The route a device recorded: GPS points with times, kept as the device's child named `track`, from
GPX files or sent live. See [Devices and GPS tracks](../archive/devices.md#a-devices-track).

### Trash

Where what you delete in the web interface waits, in `.trash` in your home folder, for 30 days
unless the administrator set another number in
[`CFG_TRASH_RETENTION_DAYS`](settings.md#cfg_trash_retention_days). `rm` and **Delete** on the
Nodes page do not use it. See [Your profile, favourites and trash](../guide/profile.md#the-trash).

### Tree

The one hierarchy of nodes that holds everything in EiN, from `/`: `/archive`, `/home`, `/etc`,
`/var`, `/usr`, `/dev` and `/tmp`. See [The tree](../concepts/tree.md).

## U

### Unidentified person

_Archive._ A person recognition started for a face or a voice that matches nobody, with a placeholder name such as
`Unknown 4XK9QM`, waiting for someone to say who it is. See
[People and faces](../archive/people.md#name-the-people-recognition-found).

## V

### Viewer

_Archive._ The full-screen view of one photo, video or recording, with the details panel beside it. See
[Viewing photos, videos and recordings](../archive/viewer.md).

### Visibility chip

_Archive._ The coloured word under an album's title that says how visible it is: _Public_, _Restricted_ or
_Private_. An album everyone with an account can see has none. See
[Sharing](../guide/sharing.md#the-visibility-chip).

### Visitors may browse

The setting under **Settings → Permissions**,
[`CFG_GUEST_BROWSING`](settings.md#cfg_guest_browsing), that lets people who have not signed in
see what is granted to the `guest` group. It is off unless set. See [Guest](#guest).

## W

### Worker

A service that takes long jobs from a pool when it has room. The Archive brings three, all on
`/var/pools/media`: `cpu`, for work
done on this machine such as thumbnails and transcoding, and `models`, for work done by a model in
the media service such as finding faces, with `models-second`, off unless
`CFG_MODEL_SECOND_SLOTS` is set above 0, beside it. See [Processing pictures](../archive/processing.md#the-workers),
and [Processing and pipelines](../admin/processing.md) for workers in general.
