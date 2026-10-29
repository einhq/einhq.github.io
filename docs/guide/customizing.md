# Your sidebar and top bar

You can rename, reorder and hide the entries in the sidebar and the buttons in the top bar, and add
pages, buttons and menus of your own, by writing a short JSON file. This page shows how to do it
for yourself and, if you are an administrator, for everyone on your EiN or for one group.

There is no page in **Settings** for this: the files on this page are the only way. You need to be
signed in and able to edit a few lines of JSON, usually in the [terminal](../shell/terminal.md).

## How the sidebar and top bar are put together

The sidebar and the top bar are laid together from four layers, read in this order:

| Layer                | File                                                                                     | Written by                     | Applies to          |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ | ------------------- |
| The modules' entries | `/etc/ui/nav.d/<module>.json`, one for each module; EiN's own is `/etc/ui/nav.d/ui.json` | each module, when it is set up | everyone            |
| Changes for everyone | `/etc/ui/nav.json`                                                                       | an administrator               | everyone            |
| A group's changes    | `/etc/ui/groups/<group>/nav.json`, one for each group that has one                       | an administrator               | the group's members |
| Your changes         | `~/.ui/nav.json`, which is `/home/<your username>/.ui/nav.json`                          | you                            | you only            |

![Four layers stacked into the sidebar: the modules' entries in /etc/ui/nav.d, the administrator's /etc/ui/nav.json for everyone, a group's /etc/ui/groups/<group>/nav.json for its members, and your ~/.ui/nav.json, with the rules same id changes fields, another id adds an entry, hide removes one](../diagrams/nav-layers.svg "Each layer changes only what it names, so your file holds only what you want different.")

Every entry has an id, such as `archive.albums` for **Albums**. A later layer works on the earlier
ones by id:

- **Same id: change fields.** Naming an id that an earlier layer gives changes only the fields you
  write. The entry keeps all the others.
- **Another id: add.** An id that no earlier layer gives adds an entry of your own.
- **`hide`: remove.** The ids listed under `"hide"` are left out.

So your file holds only what you want different, and when a module is updated, its changes still
reach everything you left alone.

A few things follow from this:

- None of `/etc/ui/nav.json`, `/etc/ui/groups/<group>/nav.json` and `~/.ui/nav.json` exists until
  someone writes it.
- What one layer hides stays hidden. There is no way to unhide, so you cannot bring back an entry
  your administrator hid.
- The files in `/etc/ui/nav.d` are links to the modules' own files, and an update replaces them.
  Leave them alone and put changes in `/etc/ui/nav.json` instead.
- EiN reads the navigation once, when a page loads. After you change a file, reload the page in
  your browser. Your terminal sessions come back after the reload.

## See what you have

Run `ui-nav` in the terminal. It prints the sidebar and the top bar as they are for you, with every
entry's id:

```bash
# in EiN's terminal
ui-nav
```

For someone signed in who is not an administrator, on an EiN with the archive, the assistant and
the media service modules, it prints:

```text
(main)
  Home             /                ui.home
  Chat             /chat            assistant.chat
  Media            /media           archive.media
  Staging          /staging         archive.staging
Explore
  Search           /search          ui.search
  Year             /year            archive.year
  Map              /map             archive.map
Browse
  Albums           /albums          archive.albums
  People           /people          archive.people
  Locations        /locations       archive.locations
  Devices          /devices         archive.devices
System
  Settings         /settings        ui.settings
  Statistics       /stats           ui.stats
  Documentation    /docs            ui.docs
top bar
  Chat             assistant.chat
  Create           ui.create
    Import media   archive.import
    Album          archive.create-album
    Person         archive.create-person
    Location       archive.create-location
    Device         archive.create-device
  Random album     archive.random-album (alt+R)
  Account          ui.account
    Favourites     archive.favourites
panels
  search.explore   People           /explore/people          archive.explore-people
  search.explore   Locations        /explore/locations       archive.explore-locations
  search.explore   Years            /explore/years           archive.explore-years
  search.explore   Labels           /explore/labels          archive.explore-labels
  nodes.tools      Duplicates       /duplicates?path={path}  archive.duplicates
  stats.sections   Events           /stats/life-events       archive.life-events
  home.start       Import media     /start/upload            archive.start-upload
  search.label     Looks like       /looks-like?path={path}  archive.looks-like
  about.services   Language model   /about/language-model    assistant.about
  system.overview  GPU              /system/gpu              ems.gpu
  system.tabs      Media service    /system/media-service    ems.media-service
  about.services   Media service    /about/media-service     ems.about
```

- **The sidebar** comes first, a section at a time. Each section starts with its heading; the
  first section has none, so its id shows in brackets, `(main)`. Under it, each entry's label, its
  address and its id.
- **`top bar`** lists the buttons with their titles and ids, and a key in brackets where one is
  set. A dropdown's rows are indented under it: `Create` is the plus, and `Account` is the menu
  under your picture.
- **`panels`** are parts that modules draw inside other pages; see
  [Change the panels inside pages](#change-the-panels-inside-pages).

An administrator also gets **Nodes** and **Dashboard** under **System**. The
[sidebar](interface.md#the-sidebar) and [top bar](interface.md#the-top-bar) sections of
[Finding your way around](interface.md) say what each entry is.

The first part of an id says where the entry comes from: `ui.` is EiN's own, and `archive.`,
`assistant.` and `ems.` are the [Archive](../archive/index.md)'s, the
[assistant](../assistant/index.md)'s and the [media service module](../ems/index.md)'s, there once
that module is installed. On an EiN with no modules, the sidebar holds only **Home**, **Search**,
**Settings**, **Statistics** and **Documentation**, with **Nodes** and **Dashboard** for an
administrator, and there are no panels.

When something in a file cannot be used, `ui-nav` says so after the list, on lines that start with
`ui-nav:`; [When something goes differently](#when-something-goes-differently) explains each one.
The browser's console shows the same lines.

To read every field a module gives its entries, print its file, for example
`cat /etc/ui/nav.d/archive.json`. `JSON_OUTPUT=1 ui-nav` gives the result as JSON, the form the web
interface reads.

## Create or edit your file

### In the terminal

1. Open the terminal with the **Toggle Terminal (Alt+T)** button in the top bar, or press
   <kbd>Alt</kbd>+<kbd>T</kbd>.
2. Make the folder and open the file in the editor:

   ```bash
   # in EiN's terminal
   mkdir -p ~/.ui
   edit ~/.ui/nav.json
   ```

   When the file does not exist, the editor starts empty and creates the file when you save.
3. Type or paste the JSON. The editor checks it as you type and marks a mistake with ✗.
4. Press <kbd>Ctrl</kbd>+<kbd>S</kbd> to save, then <kbd>Ctrl</kbd>+<kbd>Q</kbd> to quit. If the
   JSON has a mistake, saving first asks `Save with errors? (y/N)` and shows the problem.
5. Run `ui-nav` to check the result, then reload the page.

[The editor](../shell/editor.md) lists all of the editor's keys. You can do the same over
[SSH](../shell/ssh-sftp.md) from your own computer, or put the file at
`/home/<your username>/.ui/nav.json` with an SFTP client. A phone has no terminal button; use a
computer for this.

### In the Nodes explorer's code editor

The **Nodes** explorer opens an existing file in a code editor, but it cannot create a file. Make
the file in the terminal first; after that you can edit it here:

1. Open **Nodes**. Administrators have it under **System** in the sidebar; anyone signed in can open
   it at the address `/system/nodes`. The first time, it opens at your home folder.
2. Names that start with a dot are hidden. Press <kbd>Ctrl</kbd>+<kbd>H</kbd>, or choose the eye
   button, **Show names starting with a dot (Ctrl+H)**.
3. Double-click the `.ui` folder, then right-click `nav.json` and choose **Open**.
4. Make your changes, then choose **Save** or press <kbd>Ctrl</kbd>+<kbd>S</kbd>. While a change
   is not saved, the editor shows **unsaved**, and **Close** asks **Discard unsaved changes?** with
   **Keep editing** and **Discard**.

This editor does not check the JSON. Run `ui-nav` afterwards, or reload the page and look.

## Rename, move and hide entries

The examples on this page change entries the Archive and the assistant add, and lead to their
pages, such as `/albums` and `/people/Peggy_Wrenfield`. The same works for any entry, EiN's own
included, and for any address on your EiN.

To rename **Albums** to **Photo albums**, move it up beside **Home**, and hide **Map**, write this in
`~/.ui/nav.json`:

```json
{
  "sidebar": [
    { "id": "archive.albums", "section": "main", "label": "Photo albums", "order": 15 }
  ],
  "hide": ["archive.map"]
}
```

Save, reload the page, and the first section reads **Home**, **Photo albums**, **Chat**, **Media**,
**Staging**; **Explore** has no **Map**. `ui-nav` shows the same:

```text
(main)
  Home             /                ui.home
  Photo albums     /albums          archive.albums
  Chat             /chat            assistant.chat
  Media            /media           archive.media
  Staging          /staging         archive.staging
Explore
  Search           /search          ui.search
  Year             /year            archive.year
Browse
  People           /people          archive.people
  ...
```

- **`order`** places an entry within its section, lowest first. The shipped entries count in tens
  (**Home** 10, **Chat** 20, **Media** 30), so 15 lands between **Home** and **Chat**. An entry
  without `order` goes to the end of its section.
- **`section`** moves the entry to another section: `main`, `explore`, `browse`, `system`, or one
  of your own.
- **`hide`** takes away anything by id: an entry, a top-bar button, a panel or a whole section. A
  hidden section takes its entries with it.

One id can name both a sidebar entry and a top-bar button: `assistant.chat` is the sidebar's
**Chat** and the top bar's chat button, so hiding it removes both.

Sections can be changed the same way. This gives the first section the heading **Start** and
renames **Browse**:

```json
{
  "sections": [
    { "id": "main", "label": "Start" },
    { "id": "browse", "label": "Collections" }
  ]
}
```

## Add a page of your own

An entry of your own needs an id that nothing else uses, and four fields: `section`, `label`,
`icon` and `to`. This adds a section **Family** with two people's pages, and puts a saved search
for Cornwall in **Explore** after **Search**:

```json
{
  "sections": [
    { "id": "family", "label": "Family", "order": 25 }
  ],
  "sidebar": [
    { "id": "me.peggy", "section": "family", "label": "Grandma Peggy", "icon": "user", "to": "/people/Peggy_Wrenfield" },
    { "id": "me.ruby", "section": "family", "label": "Ruby", "icon": "user", "to": "/people/Ruby_Wrenfield" },
    { "id": "me.cornwall", "section": "explore", "label": "Cornwall", "icon": "beach", "to": "/media?q=Cornwall", "order": 15 }
  ]
}
```

With `"order": 25`, **Family** stands between **Explore** (20) and **Browse** (30). Your entries
also appear in the search box's list under **Go to**, like every sidebar entry.

- **`to`** is an address inside EiN, starting with `/`. The easiest way to get one is to open the
  page and copy what your browser's address bar shows after the host, such as
  `/people/Peggy_Wrenfield`. Filters you set on a page are part of its address, which is how
  `/media?q=Cornwall` opens **Media** already searching for Cornwall.
  [Addresses in the web interface](../reference/routes.md) lists them all. A sidebar entry cannot
  lead to another website.
- **`icon`** is the name of any icon at [tabler.io/icons](https://tabler.io/icons), written as it
  is there: `map-pin`, `beach`, `heart`. Add `-filled` for the filled form, `heart-filled`. It can
  also be the full path, starting with `/`, of an SVG file in EiN that you may read, which is drawn
  in the colour of the text.
- **`id`** can be anything no one else uses. The shipped ones are `<module>.<name>`; starting yours
  with `me.` keeps them apart.

The sidebar lights the entry whose address is the page's, or the start of it, so **Albums** is lit
on an album too. When several match, the longest address wins: on `/system/nodes` only **Nodes** is
lit, not **Dashboard** at `/system`. An entry whose address has a `?` in it, like the saved search
above, is never lit.

## Add buttons to the top bar

A top-bar button is an entry under `"topbar"` with an `id`, a `title` (its tooltip), an `icon` and
an `action` that says what choosing it does:

| Action                                                    | What choosing the button does                                                                                                                                                                                         |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ "navigate": "/albums" }`                               | Opens the address as the page.                                                                                                                                                                                        |
| `{ "dialog": "/albums/new" }`                             | Opens it in a dialog over the page you are on.                                                                                                                                                                        |
| `{ "drawer": "/favourites" }`                             | Opens it in the side drawer at the right, or closes the drawer when it shows that address. The button is lit while the drawer is open, and left out on that address's own page. On a phone it opens a dialog instead. |
| `{ "fullscreen": "/map" }`                                | Opens it over everything, the top bar too, until <kbd>Esc</kbd> or the browser's Back.                                                                                                                                |
| `{ "run": "<command line>" }`                             | Runs the command line as you, as the web interface runs its commands: with `JSON_OUTPUT=1`.                                                                                                                           |
| `{ "run": "album-random", "navigate": "/albums/{path}" }` | Runs the command, then opens an address filled in from its answer.                                                                                                                                                    |

[Finding your way around](interface.md#pages-dialogs-the-side-drawer-and-full-screen) shows what a
dialog, the side drawer and full screen look like.

This adds four buttons:

```json
{
  "topbar": [
    { "id": "me.peggy-button", "title": "Grandma Peggy", "icon": "user", "action": { "navigate": "/people/Peggy_Wrenfield" } },
    { "id": "me.new-album", "title": "New album", "icon": "photo-plus", "action": { "dialog": "/albums/new" } },
    { "id": "me.favourites", "title": "Favourites", "icon": "heart", "action": { "drawer": "/favourites" } },
    { "id": "me.map", "title": "Map", "icon": "map", "action": { "fullscreen": "/map" } }
  ]
}
```

They stand between **Create** and the terminal button, in the order you wrote them; hold the
pointer over one to see its title. They also appear in the search box's list under **Do**.

About `run`:

- The command's output is not shown anywhere. The button turns into a spinner while the command
  takes more than a moment. If the command fails, the page shows nothing; the browser's console
  has the error.
- With `navigate` as well, EiN reads the command's answer as JSON and replaces each `{key}` in the
  address with the answer's field of that name, or with nothing when there is none. The archive's
  **Random album** is made this way: [`album-random`](../archive/commands.md#album-random)
  answers with an album's `path`, and the button opens `/albums/{path}`.

Three more fields change a button:

- **`"place": "search"`** stands the button beside the search box, as **Random album** does,
  instead of with the others at the right.
- **`"phone": false`** leaves the button out on a phone. Its key, if it has one, still works.
- **`"color"`** colours its icon: `blue`, `cyan`, `grape`, `green`, `indigo`, `lime`, `orange`,
  `pink`, `red`, `teal`, `violet` or `yellow`.

```json
{
  "topbar": [
    { "id": "me.year", "title": "This year", "icon": "calendar", "color": "teal", "place": "search", "action": { "navigate": "/year" } }
  ]
}
```

## Make a dropdown menu

A top-bar entry with no `action` becomes a dropdown when other entries name it as their `parent`.
Each of those is a row of the menu and needs an `action` of its own:

```json
{
  "topbar": [
    { "id": "me.family-menu", "title": "Family", "label": "Family pages", "icon": "users", "order": 15 },
    { "id": "me.family-peggy", "parent": "me.family-menu", "title": "Grandma Peggy", "icon": "user", "action": { "navigate": "/people/Peggy_Wrenfield" } },
    { "id": "me.family-ruby", "parent": "me.family-menu", "title": "Ruby", "icon": "user", "action": { "navigate": "/people/Ruby_Wrenfield" } }
  ]
}
```

The dropdown's `title` is its button's tooltip, and its `label` is the heading at the top of the
open menu. With `"order": 15` the button stands between **Chat** (10) and **Create** (20). A row's
`title` is its text, and `order` places it in the menu.

Rows can go into the menus EiN has as well:

- **`"parent": "ui.create"`** adds a row to the **Create New** menu under the plus. The archive's
  rows are **Import media** (5), **Album** (10), **Person** (20), **Location** (30) and **Device**
  (40).
- **`"parent": "ui.account"`** adds a row to the menu under your picture, after **Me** and before
  **Profile**, where the archive puts **Favourites**. The menu's other rows are EiN's own and cannot
  be changed.

```json
{
  "topbar": [
    {
      "id": "me.new-category",
      "parent": "ui.create",
      "title": "Staging category",
      "icon": "folder-plus",
      "color": "cyan",
      "order": 50,
      "action": { "dialog": "/staging/categories/new" }
    },
    { "id": "me.docs", "parent": "ui.account", "title": "Documentation", "icon": "book", "action": { "navigate": "/docs" } }
  ]
}
```

A dropdown with no rows left, because they were all hidden or none were given, is not shown. A row
goes where its dropdown goes: hide the dropdown, or keep it from someone, and its rows go too. In
the search box's list a row reads with its menu's title, as `Create: Staging category`.

## Give an entry a key

A top-bar button or a dropdown's row can have a key that does what choosing it does, from anywhere
outside a text field:

```json
{
  "topbar": [
    { "id": "archive.create-album", "shortcut": "alt+A" },
    { "id": "me.map", "title": "Map", "icon": "map", "shortcut": "alt+P", "action": { "fullscreen": "/map" } },
    { "id": "archive.random-album", "shortcut": null }
  ]
}
```

This gives **Create** › **Album** the key <kbd>Alt</kbd>+<kbd>A</kbd>, gives your **Map** button
<kbd>Alt</kbd>+<kbd>P</kbd>, and takes <kbd>Alt</kbd>+<kbd>R</kbd> away from **Random album**.

- A key is modifiers and one key, joined by `+`. The modifiers are `alt`, `ctrl`, `shift`, `meta`,
  and `mod`, which is <kbd>Ctrl</kbd>, or <kbd>⌘</kbd> on a Mac. Letter case does not matter:
  `alt+R` and `Alt+r` are the same key.
- `null` takes a key away, which is how you remove a module's key.
- The key shows in the button's tooltip, such as **Map (Alt+P)**, beside the row in its menu, and
  in the **Keyboard shortcuts** list that <kbd>?</kbd> opens, under **Anywhere**; a row is listed
  with its menu, as **Create › Album**. On a Mac, Alt shows as <kbd>⌥</kbd>.
- A dropdown itself cannot have a key; its rows can.
- A key is given once. When two entries ask for the same key, the one that comes first in the top
  bar's order keeps it: by `order`, lowest first, and a dropdown's rows where their dropdown stands.
  A button placed beside the search box counts by its `order` too.
- EiN keeps its own keys: <kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>⌘</kbd>+<kbd>K</kbd>), <kbd>?</kbd>,
  and <kbd>Alt</kbd> with <kbd>T</kbd>, <kbd>N</kbd>, <kbd>M</kbd>, <kbd>W</kbd> or an arrow key,
  which the terminal uses. An entry that asks for one of these as EiN writes it (`mod+K`, `shift+?`,
  `alt+T` and so on) does not get it.

Some pages have keys of their own while they are on screen, such as the photo viewer. Press
<kbd>?</kbd> on a page to see which keys it uses before you pick one;
[Keyboard shortcuts](../reference/shortcuts.md) lists every key EiN knows.

## Change the panels inside pages

Panels are parts that modules draw inside EiN's own pages, such as the **Media service** tab on the
**Dashboard** or the **People**, **Locations**, **Years** and **Labels** sections of the **Search**
page. They are in the same files under `"panels"`, so you can reorder, rename or hide them by id
like any entry. This puts **Years** first on the **Search** page and hides **Labels** there:

```json
{
  "panels": [
    { "id": "archive.explore-years", "order": 5 }
  ],
  "hide": ["archive.explore-labels"]
}
```

Each panel has a slot, the place in a page where it is drawn:

| Slot              | Where it is drawn                                                  | Panels the modules ship                                                 |
| ----------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `search.explore`  | A section of the **Search** page before you search                 | `archive.explore-people`, `-locations`, `-years`, `-labels`             |
| `search.label`    | Above the **Search** page's results when it searches for one label | `archive.looks-like` (**Looks like**, signed in only)                   |
| `home.start`      | Under **News** on **Home** while there is no news                  | `archive.start-upload` (**Import media**, signed in only)               |
| `stats.sections`  | A section of **Statistics**                                        | `archive.life-events` (**Events**)                                      |
| `nodes.tools`     | A tool in the **Nodes** explorer's tool pane                       | `archive.duplicates` (**Duplicates**)                                   |
| `system.tabs`     | A tab of the **Dashboard**                                         | `ems.media-service` (**Media service**)                                 |
| `system.overview` | Gauges beside the computer's own on the **Dashboard**'s overview   | `ems.gpu` (**GPU**)                                                     |
| `about.services`  | A tile in **About EiN**                                            | `assistant.about` (**Language model**), `ems.about` (**Media service**) |

A panel draws a page that a module made for that place. Adding panels of your own works the same
way in principle, but it is a module's work; see [Writing a module](../develop/modules.md).

## Change the navigation for everyone

As an administrator, signed in as `admin` or in [admin mode](interface.md#admin-mode), you write the
same kind of file to `/etc/ui/nav.json`. It applies to every account and to visitors, and each
person's own file is laid over it.

```bash
# in EiN's terminal, as an administrator
edit /etc/ui/nav.json
```

Two fields show an entry to some people only. They work in any file, but the file for everyone is
where they matter:

| Field              | The entry is shown                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"admin": true`    | Only to administrators: the `admin` account and anyone in admin mode. In your own file, it shows the entry only while you are in admin mode.                   |
| `"signedIn": true` | Only to someone signed in, never to a visitor browsing without signing in, where [**Visitors may browse**](../reference/settings.md#cfg_guest_browsing) is on. |

EiN uses them itself: **Nodes** and **Dashboard** are `admin`; **Staging**, **Settings**, **Create**
and the account menu are `signedIn`.

This file, for a family with no cameras or GPS trackers to register, hides **Devices** in the
sidebar and in the **Create** menu, keeps **Statistics** from visitors, and gives administrators a
button that reruns failed work with
[`pipeline-heal`](../reference/commands-core.md#pipeline-heal):

```json
{
  "sidebar": [
    { "id": "ui.stats", "signedIn": true }
  ],
  "topbar": [
    { "id": "site.retry", "title": "Retry failed work", "icon": "refresh", "admin": true, "action": { "run": "pipeline-heal --apply" } }
  ],
  "hide": ["archive.devices", "archive.create-device"]
}
```

Everyone gets the change the next time they load a page. People can still rename and move, in their
own files, what you changed, but they cannot bring back what you hid. To change the navigation for
some accounts only, write a [group's file](#change-the-navigation-for-a-group).
[Processing and pipelines](../admin/processing.md) explains what `pipeline-heal` reruns.

## Change the navigation for a group

As an administrator you can also change the navigation for the members of one group, such as a
link to a page only they use. The file is `/etc/ui/groups/<group>/nav.json`, where `<group>` is the
group's name as `group-list` prints it, not its title, in the same format as the other files.

This gives the members of a `sailors` group a page of their own in the **Explore** section:

```bash
# in EiN's terminal, as an administrator
mkdir -p /etc/ui/groups/sailors
edit /etc/ui/groups/sailors/nav.json
```

```json
{
  "sidebar": [
    { "id": "sailors.boats", "section": "explore", "label": "Boats", "icon": "sailboat", "to": "/search?q=sailboat" }
  ]
}
```

A group's file is laid over `/etc/ui/nav.json` and under each member's own file, so members can
still rename and move what it gives. Someone in several groups with a file gets each of them, in the
order of the groups' names. Groups are read at sign-in, so someone added to a group gets its file the
next time they sign in. The `guest` group's file is for visitors browsing without signing in.
If the folder's name is not a group, `ui-nav` warns `/etc/ui/groups/<name>: no group <name>`.

> [!WARNING]
> `hide`, `admin` and `signedIn` decide only what the sidebar and top bar show. A page still opens
> by its address for anyone whose permissions allow it, and anyone can add an entry of their own
> that leads to it. To keep people away from something, set its permissions; see
> [Permissions in depth](../admin/permissions.md).

## Field reference

### The file

A file is one JSON object with any of these keys:

| Key        | Holds                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------ |
| `sections` | A list of the sidebar's sections.                                                          |
| `sidebar`  | A list of sidebar entries.                                                                 |
| `topbar`   | A list of top-bar buttons, dropdowns and dropdown rows.                                    |
| `panels`   | A list of panels.                                                                          |
| `hide`     | A list of ids to leave out, of any kind. Hidden in one layer means hidden in all after it. |

Every entry in the four lists needs an `id`. To change an entry, give its id and the fields to
change. An entry of your own needs every field marked required below.

### `sections`

| Field   | Required | Value                                                                                                                             |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`    | yes      | `main`, `explore`, `browse`, `system`, or one of your own.                                                                        |
| `label` | no       | The heading, shown in capitals; choosing it folds the section. Without one the section has no heading and cannot fold, as `main`. |
| `order` | no       | The section's place, lowest first: `main` 10, `explore` 20, `browse` 30, `system` 40. Without it, 1000.                           |

A section with no entries left to show is not drawn.

### `sidebar`

| Field      | Required | Value                                                                                                                                   |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | yes      | The entry's id: `archive.albums`, or one of your own such as `me.peggy`.                                                                |
| `section`  | yes      | The id of the section it is in.                                                                                                         |
| `label`    | yes      | The text.                                                                                                                               |
| `icon`     | yes      | A [Tabler](https://tabler.io/icons) icon name (`map-pin`, `heart-filled`), or the path of an SVG file in EiN.                           |
| `to`       | yes      | The address it opens, inside EiN, starting with `/`. The entry is lit on this address and those below it, unless the address has a `?`. |
| `order`    | no       | Its place in the section, lowest first. Without it, 1000; entries with the same number keep the order the files give them.              |
| `admin`    | no       | `true`: shown to administrators only.                                                                                                   |
| `signedIn` | no       | `true`: never shown to a visitor.                                                                                                       |

### `topbar`

| Field      | Required | Value                                                                                                                                                 |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | yes      | The entry's id. EiN's dropdowns are `ui.create` (the plus) and `ui.account` (the menu under your picture).                                            |
| `title`    | yes      | A button's tooltip, a row's text; also its name in the search box's list and the **Keyboard shortcuts** list.                                         |
| `icon`     | yes      | As for the sidebar.                                                                                                                                   |
| `action`   | see text | What choosing it does; see [`action`](#action). A button and a row need one. An entry with neither an action nor rows is left out, without a warning. |
| `parent`   | no       | The id of the dropdown this entry is a row of: `ui.create`, `ui.account` or one of your own.                                                          |
| `label`    | no       | A dropdown's heading in the open menu, such as **Create New**.                                                                                        |
| `color`    | no       | The icon's colour: `blue`, `cyan`, `grape`, `green`, `indigo`, `lime`, `orange`, `pink`, `red`, `teal`, `violet` or `yellow`.                         |
| `order`    | no       | Its place, lowest first: among the buttons (**Chat** 10, **Create** 20, **Random album** 30), or in its menu for a row. Without it, 1000.             |
| `place`    | no       | `"search"`: the button stands beside the search box instead of at the right.                                                                          |
| `phone`    | no       | `false`: the button is left out on a phone; its key still works.                                                                                      |
| `shortcut` | no       | A key, such as `alt+R` or `mod+shift+K`; see [Give an entry a key](#give-an-entry-a-key). `null` takes a key away. Not on a dropdown.                 |
| `admin`    | no       | `true`: shown to administrators only.                                                                                                                 |
| `signedIn` | no       | `true`: never shown to a visitor.                                                                                                                     |

The terminal button and your picture are EiN's own, always at the right end, and cannot be moved
or hidden; neither can the search box.

### `action`

Give one of these:

| Action                                                 | Does                                                                                                                                                |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ "navigate": "<address>" }`                          | Opens the address as the page.                                                                                                                      |
| `{ "dialog": "<address>" }`                            | Opens it in a dialog over the page.                                                                                                                 |
| `{ "drawer": "<address>" }`                            | Opens it in the side drawer, or closes the drawer when it shows it. A dialog on a phone.                                                            |
| `{ "fullscreen": "<address>" }`                        | Opens it over everything until <kbd>Esc</kbd> or the browser's Back.                                                                                |
| `{ "run": "<command line>" }`                          | Runs the command line as you. Its output is not shown.                                                                                              |
| `{ "run": "<command line>", "navigate": "<address>" }` | Runs it, then opens the address with each `{key}` replaced by that field of the command's JSON answer, URI-encoded; a missing field leaves nothing. |

### `panels`

| Field      | Required | Value                                                                                                     |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `id`       | yes      | The panel's id, such as `archive.explore-years`.                                                          |
| `slot`     | yes      | Where it is drawn; see the slots in [Change the panels inside pages](#change-the-panels-inside-pages).    |
| `label`    | yes      | The tab's or tool's label, or the section's heading.                                                      |
| `route`    | yes      | The address drawn there. In `nodes.tools` and `search.label`, `{path}` is replaced by a path in the tree. |
| `icon`     | no       | An icon, as for the sidebar, for the slots that show one.                                                 |
| `order`    | no       | Its place among the panels of its slot. Without it, 1000.                                                 |
| `admin`    | no       | `true`: shown to administrators only.                                                                     |
| `signedIn` | no       | `true`: never shown to a visitor.                                                                         |

## When something goes differently

`ui-nav` prints a line for each thing it could not use, and leaves that thing out. The rest of the
file still applies, except when the file is not valid JSON.

| Line after `ui-nav:`                                                                                         | What it means                                                                             | What to do                                                                                                   |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `/home/anna/.ui/nav.json: Expected ',' or '}' after property value in JSON at position 71 (line 3 column 3)` | The file is not valid JSON, so none of it is used. The end says where the parser stopped. | Look just before that line and column: often a missing comma, or a comma after the last item of a list.      |
| `<file>: not a navigation object`                                                                            | The file is valid JSON but not one object in `{ }`.                                       | Put everything inside one pair of braces.                                                                    |
| `<file>: sidebar is not a list`                                                                              | `sidebar`, `sections`, `topbar` or `panels` holds something other than a list.            | Put the entries in `[ ]`, even a single one.                                                                 |
| `<file>: a sidebar entry without an id`                                                                      | An entry in that list has no `id`.                                                        | Give it one.                                                                                                 |
| `<file>: hide is not a list`                                                                                 | `hide` holds a single id.                                                                 | Write `"hide": ["archive.map"]`.                                                                             |
| `me.cornwall: no icon, to`                                                                                   | An entry of your own lacks the required fields named.                                     | Add them. If you meant to change a module's entry, check the id: a misspelled id makes an entry of your own. |
| `me.peggy: no section family`                                                                                | The section does not exist.                                                               | Check the spelling, or add the section under `"sections"`.                                                   |
| `me.family-peggy: no top-bar entry me.family-menu`                                                           | The `parent` names no top-bar entry.                                                      | Check the spelling, or add the dropdown.                                                                     |
| `me.map: action is none of navigate, dialog, drawer, fullscreen or run`                                      | The `action` has none of those keys with text after it.                                   | Check the spelling and the quotes.                                                                           |
| `me.map: shortcut "alt+" is not modifiers and one key joined by +`                                           | The key is not written as modifiers and one key.                                          | Write it like `alt+P`.                                                                                       |
| `me.family-menu: a dropdown has no shortcut, its rows may`                                                   | A key was given to a dropdown.                                                            | Give keys to its rows. The dropdown is still shown.                                                          |
| `me.map: shortcut alt+A is already archive.create-album's`                                                   | Another entry, earlier in the top bar's order, has the key.                               | Choose another key, or take it from the other entry with `"shortcut": null`.                                 |
| `me.map: shortcut alt+T is already the shell's`                                                              | EiN keeps that key for itself.                                                            | Choose another key.                                                                                          |
| `ui: archive.albums is already given by archive`                                                             | Two modules give the same id; the first by module name keeps it.                          | Tell the authors of the module named first.                                                                  |

Other things that can go differently:

- **Nothing changes.** Reload the page; EiN reads the navigation only when a page loads. Then check
  that the file is where EiN looks, with `cat ~/.ui/nav.json`.
- **A button you added is missing, and `ui-nav` says nothing.** It has no `action` and no rows; or
  it is a dropdown whose rows are all hidden; or it has `"phone": false` and you are on a phone; or
  it opens the side drawer and you are on that address's own page.
- **An empty space where an icon should be.** The name is not one of Tabler's. `ui-icons` checks
  names: it prints the size of each icon it has and `none` for a name it does not know.

  ```bash
  # in EiN's terminal
  ui-icons beach beech
  ```

  ```text
  beach: 807 bytes
  beech: none
  ```

- **An entry of yours is never lit.** Its address has a `?` in it, so it cannot match the page.
- **A key does nothing.** Keys do not work while the cursor is in a text field. Press <kbd>?</kbd>
  to see whether the key is listed; if it is not, run `ui-nav` for the reason.
- **An entry you want back was hidden by your administrator.** You cannot unhide it. Ask your
  administrator.

## Where to go next

- [Finding your way around](interface.md): every part of the sidebar and the top bar.
- [The editor](../shell/editor.md): editing files in the terminal and in the Nodes explorer.
- [Configuration files](../reference/config-files.md): `/etc/ui/nav.json`, a group's file, `~/.ui/nav.json` and
  the other files you can edit.
- [Writing a module](../develop/modules.md): how a module gives its own entries, routes and panels.
