# Addresses in the web interface

Every page of EiN's web interface has an address of its own, and most of what a page shows, such
as the tab, the filters, the year or the part of the map, is written into that address. This page
lists the addresses and their parameters, so you can bookmark a view, send someone a link to it,
or type one in. It is for anyone who uses EiN in a browser, and for administrators who link to
EiN from elsewhere.

## How an address is made

An address is the place EiN is reached at, then a path, then sometimes a query:

```text
http://ein.local:8080/people/helen-okafor?tab=faces
└──── where EiN is ──┘└────── path ──────┘└─ query ─┘
```

- The path says which page: `/people/helen-okafor` is Helen Okafor's page.
- The query, after `?`, says how the page looks: `tab=faces` opens it on **Faces**. Several
  parameters are joined with `&`.
- A part that holds a path in the tree, such as an album's, is URL-encoded: `/` becomes `%2F` and a
  space `%20`. EiN writes these addresses itself when you move around; you only meet the encoding
  when you type one by hand.

Copy the address from the browser's address bar to share or bookmark what you see. Someone who
opens it sees the same page, as far as their own permissions let them.

The pages come from EiN itself and from its [modules](../admin/modules.md). The lists below are
those of an installation with the Archive, the Assistant and the media service. A module that is not
installed brings none of its addresses, and opening one shows **Nothing here**.

## Pages, dialogs, the side panel and full screen

The same address can be shown four ways. Which one depends on how you open it, not on the address:

| Shown as                       | How you get there                                                               | Is it in the address bar? |
| ------------------------------ | ------------------------------------------------------------------------------- | ------------------------- |
| A page                         | The sidebar, a link, or typing the address                                      | Yes, as the path          |
| A dialog over the page         | Entries of the top bar's **Create New** menu, **About EiN** in the account menu | No                        |
| The side panel beside the page | The top bar's **Chat** button                                                   | No                        |
| Full screen                    | A picture, video or recording opened from a grid, a memory on the home page     | Yes, as `?fullscreen=`    |

**Create New → Person** opens `/people/new` in a dialog; typing `/people/new` into the address bar
opens the same form as a page. In the same way, `/chat` is the side panel from the top bar and a
full page from the sidebar. On a phone, what would open in the side panel opens in a dialog
instead. [Finding your way around](../guide/interface.md) shows each of these.

Full screen is the one kind that lives in the address. When you open a picture from an album, the
address keeps the album and adds the picture:

```text
/albums/%2Farchive%2Falbums%2FMalpas%201979?fullscreen=%2Fmedia%2F%252Farchive%252F…
```

Back closes the picture and leaves you on the album, and a reload or a shared link opens the album
with the picture over it. Opened by its own address, `/media/<path>`, the picture is the page.

## EiN's own pages

| Address                             | What it shows                                                                        | Who can open it                   |
| ----------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------- |
| `/`                                 | **Home**                                                                             | Everyone who can browse           |
| `/login`                            | The sign-in page                                                                     | Everyone                          |
| `/s/<token>`                        | Where a share link lands, see [Share links](#share-links)                            | Everyone                          |
| `/search`                           | **Search**, see [Search and the finder](../guide/search.md)                          | Everyone who can browse           |
| `/stats`                            | **Statistics**                                                                       | Everyone who can browse           |
| `/docs`                             | **Documentation**, see [Links into the documentation](#links-into-the-documentation) | Everyone who can browse           |
| `/profile`                          | **Profile**: your account, preferences and security                                  | Signed in                         |
| `/settings`                         | **Settings**                                                                         | Signed in                         |
| `/trash`                            | Your **Trash**                                                                       | Signed in                         |
| `/about`                            | **About EiN**; from the account menu it opens in a dialog                            | Signed in                         |
| `/system`                           | **Dashboard**, see [Health and the dashboard](../admin/monitoring.md)                | In the sidebar for administrators |
| `/system/nodes`                     | **Nodes**, the node explorer                                                         | In the sidebar for administrators |
| `/system/pipelines/<pipeline>`      | One pipeline and its recent runs, for example `/system/pipelines/media-faces`        | Reached from the **Dashboard**    |
| `/system/pipelines/<pipeline>/<id>` | One run of a pipeline                                                                | Reached from the pipeline's page  |

"Everyone who can browse" means signed-in users, and also visitors who have not signed in when the
administrator turns on [`CFG_GUEST_BROWSING`](settings.md#cfg_guest_browsing). A page marked "Signed
in" always asks a visitor to sign in first. What each person then sees on a page follows the
permissions on the nodes behind it; see [Permissions in depth](../admin/permissions.md).

## The Archive's pages

Addresses with `<name>` take the name of the node in the tree, which is the person's, place's or
device's name in lower case with hyphens: Helen Okafor is `/people/helen-okafor`. Addresses with
`<path>` take the node's whole path, URL-encoded.

### Browsing

| Address                   | What it shows                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `/media`                  | **Media**: every picture, video, recording and document, see [Media, Year and labels](../guide/media.md) |
| `/media/<path>`           | One file in the viewer, see [Viewing photos, videos and recordings](../guide/viewer.md)                  |
| `/year`                   | **Year**                                                                                                 |
| `/timeline`               | Opens `/year`, keeping the query                                                                         |
| `/map`                    | **Map**, see [Locations and the map](../guide/places.md)                                                 |
| `/albums`                 | **Albums**, see [Albums](../guide/albums.md)                                                             |
| `/albums/<path>`          | One album, for example `/albums/%2Farchive%2Falbums%2FMalpas%201979`                                     |
| `/people`                 | **People**, see [People and faces](../guide/people.md)                                                   |
| `/people/<name>`          | One person, for example `/people/peggy-wrenfield`                                                        |
| `/people/unknown`         | The people EiN has seen or heard but nobody has named                                                    |
| `/family`                 | A family tree of chosen people, see [Family tree, events and homes](../guide/family.md)                  |
| `/locations`              | **Locations**                                                                                            |
| `/locations/<name>`       | One location                                                                                             |
| `/devices`                | **Devices**, see [Devices and GPS tracks](../guide/devices.md)                                           |
| `/devices/<name>`         | One device                                                                                               |
| `/favourites`             | Your **Favourites**; signed in only, see [Your profile, favourites and trash](../guide/profile.md)       |
| `/duplicates?path=<path>` | The copies of a node, see [Duplicates](../guide/duplicates.md)                                           |

### Creating

These are the forms of the top bar's **Create New** menu. They open in a dialog from the menu and as
a page by their address. All of them need you to be signed in.

| Address          | Form                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| `/albums/new`    | **Create Album**                                                                     |
| `/people/new`    | **Create Person**                                                                    |
| `/locations/new` | **Create Location**                                                                  |
| `/devices/new`   | **Register Device**; `?name=`, `?make=`, `?model=` and `?serial=` fill in its fields |

### Staging and importing

All of these need you to be signed in. [Sorting in staging](../guide/staging.md) and [Getting your photos in](../guide/importing.md) explain the work itself.

| Address                      | What it shows                                                            |
| ---------------------------- | ------------------------------------------------------------------------ |
| `/staging`                   | **Staging**: your categories, or the one category when you have only one |
| `/staging/import`            | **Import media**, also from **Create New**                               |
| `/staging/categories/new`    | **New category**                                                         |
| `/staging/categories/<name>` | **Category settings** for one category                                   |

### Parts of other pages

Some addresses are pieces that other pages draw inside themselves: a section of **Statistics**, an
entry in the home page's news, a group on the **Search** page's landing. Each opens as a page of
its own too, which is mostly useful for linking to it.

| Address                                                                      | Drawn in                                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/stats/life-events`                                                         | **Statistics**, the **Events** section                                                |
| `/explore/people`, `/explore/locations`, `/explore/years`, `/explore/labels` | The **Search** page before you search                                                 |
| `/looks-like?path=<path>`                                                    | The **Search** page, when you search for one label                                    |
| `/memories/<MM-DD>?year=<year>`                                              | Full screen from the home page: one calendar day across the years, starting at `year` |
| `/start/upload`                                                              | **Home**, while there is no news yet                                                  |
| `/news/album`, `/onthisday/media`, `/events/anniversary`                     | Entries of the home page; the home page writes their parameters                       |
| `/map/pins`                                                                  | Pins on a small map, under an answer in the chat                                      |

## The Assistant's and the media service's pages

| Address                 | What it shows                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `/chat`                 | **Chat** with your latest conversation, see [Chatting with the assistant](../guide/assistant.md) |
| `/chat/<id>`            | One conversation; the address follows when you switch conversations                              |
| `/chart`                | A chart the chat draws under an answer; its parameters come from the chat                        |
| `/about/language-model` | The language model, as **About EiN** shows it                                                    |
| `/system/media-service` | The media service, the **Media service** tab of the **Dashboard**                                |
| `/system/gpu`           | The graphics card, a part of the **Dashboard**'s overview                                        |
| `/about/media-service`  | The media service, as **About EiN** shows it                                                     |

## Parameters

A parameter that is missing, or holds a value the page does not know, is ignored: the page opens as
it would without it. You never get an error for a mistyped parameter.

### Tabs

Pages with tabs keep the open tab in `tab`. An address without `tab` opens the first one.

| Page                | Values of `tab` (default first)                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/profile`          | `account` (**Account**), `preferences` (**Preferences**), `security` (**Security**)                                                                         |
| `/settings`         | `system` (**System**), `users` (**Users**), `groups` (**Groups**), `permissions` (**Permissions**), `modules` (**Modules**)                                 |
| `/system`           | `overview` (**Overview**), `work` (**Work**), `ems.media-service` (**Media service**), `services` (**Services**), `log` (**Log**)                           |
| `/people/<name>`    | `timeline` (**Timeline**), `info` (**Info**), `media` (**Media**), `faces` (**Faces**), `voices` (**Heard in**), `family` (**Family**), `homes` (**Homes**) |
| `/albums/<path>`    | `media` (**Media**), `map` (**Map**), `info` (**Info**)                                                                                                     |
| `/locations/<name>` | `info` (**Info**), `timeline` (**Timeline**), `media` (**Media**), `residents` (**Residents**)                                                              |
| `/devices/<name>`   | `info` (**Info**), `timeline` (**Timeline**), `media` (**Media**), `track` (**Track**), `owners` (**Owners**)                                               |
| `/staging`          | `sort` (**Sort**), `duplicates` (**Duplicates**), `files` (**Files**), `done` (**Done**)                                                                    |

On **Settings**, the first four tabs are for administrators. Anyone else who asks for one of them
gets **Modules**, and an administrator who names no tab gets **System**.

### Search and Media

**Search** and **Media** keep their whole search in the address, so a search can be linked to and
survives a reload. The parameters are named after the flags of the
[`search`](commands-core.md#search) command.

| Parameter      | What it holds                                                                                                                    | Example                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `q`            | The words searched for                                                                                                           | `q=sailing`                          |
| `kind`         | Kinds, separated by commas: `photo`, `video`, `audio`, `document`, `person`, `location`, `album`, `device`, `track`              | `kind=photo,video`                   |
| `tag`          | Labels, separated by commas                                                                                                      | `tag=beach`                          |
| `subject`      | A person, location or device that must be in it, as `<kind>:<name>` or a path; repeat it for several, all of which must be there | `subject=person:helen-okafor`        |
| `subject-name` | Every subject of a kind whose name matches the words, as `<kind>:<words>`; repeatable                                            | `subject-name=person:Wrenfield`      |
| `from`, `to`   | The first and last year, both included                                                                                           | `from=1975&to=1985`                  |
| `bbox`         | A rectangle on the map: north, south, east, west                                                                                 | `bbox=50.3,50.2,-5.0,-5.1`           |
| `circle`       | A circle on the map: latitude, longitude, radius in metres                                                                       | `circle=50.263,-5.051,2000`          |
| `poly`         | A polygon: at least three `latitude,longitude` pairs separated by `;`                                                            | `poly=50.3,-5.1;50.3,-5.0;50.2,-5.0` |
| `under`        | Only what one album or folder holds, by path                                                                                     | `under=/archive/albums/Malpas 1979`  |
| `like`         | Pictures that look like this one, by path                                                                                        | `like=/archive/…/IMG_0412.jpg`       |
| `sort`         | `score`, `time` (oldest first), `-time` (newest first) or `name`                                                                 | `sort=-time`                         |

For example, every picture and video of Helen Okafor from the 1980s, newest first:

```text
/media?kind=photo,video&subject=person:helen-okafor&from=1980&to=1989&sort=-time
```

Only one of `bbox`, `circle` and `poly` applies. **Search** with no parameters shows its landing
page rather than searching for everything.

### Map

The map keeps where you look, the layers and the filters in the address. What is at its default is
left out, so a plain `/map` stays plain.

| Parameter                   | What it holds                                                                | Default   |
| --------------------------- | ---------------------------------------------------------------------------- | --------- |
| `c`                         | The centre, as `latitude,longitude`                                          |           |
| `z`                         | The zoom level                                                               |           |
| `layers`                    | Layers shown, separated by commas: `media`, `locations`, `tracks`; or `none` | All three |
| `from`, `to`                | The first and last year                                                      | No limit  |
| `base`                      | The background: `Map`, `Dark map` or `Satellite`                             | `Map`     |
| `q`                         | Words to search for                                                          |           |
| `person`, `location`, `tag` | Only what has this person, location or label                                 |           |

```text
/map?c=50.26300,-5.05100&z=13&layers=media,tracks&from=1979&to=1979&base=Satellite
```

### Other pages

| Page                                           | Parameter            | What it does                                                                                                                             |
| ---------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/year`                                        | `year`               | The year shown, for example `year=1979`; this year when left out                                                                         |
| `/people`, `/albums`, `/locations`, `/devices` | `q`                  | The filter typed into the page's own search box                                                                                          |
| `/people/<name>`                               | `faces=doubtful`     | On **Faces**, only the faces EiN is unsure of                                                                                            |
| `/people/unknown`                              | `sort`               | `faces` (the default) or `created`                                                                                                       |
| `/people/unknown`                              | `min`                | Seen at least this many times: `0`, `2`, `5`, `10` or `50`                                                                               |
| `/people/unknown`                              | `person`             | The unknown person open for review                                                                                                       |
| `/staging`                                     | `c`                  | The category, by name, for example `c=inbox`                                                                                             |
| `/staging`                                     | `lane`               | On **Sort**: `sort` (**To sort**), `everyday` (**Everyday**), `undated` (**Needs a date**), `clutter` (**Clutter**), `later` (**Later**) |
| `/staging`                                     | `order=new`          | On **Sort**: newest first                                                                                                                |
| `/staging`                                     | `g`                  | On **Sort**: the group open, for example `g=auto-2019-06-14`                                                                             |
| `/staging`                                     | `dir`, `view=folder` | On **Files**: the folder open, and the folder view                                                                                       |
| `/staging/categories/new`                      | `kind`, `move`       | The kind of the new category, and a staged folder to move into it                                                                        |
| `/settings?tab=modules`                        | `module`             | The module open, for example `module=archive`                                                                                            |
| `/settings?tab=modules`                        | `section`            | Its part: `dependencies`, `services`, `pages`, `commands`, `settings` or `types` (**About** when left out)                               |
| `/settings?tab=modules`                        | `published=1`        | The modules published for installing                                                                                                     |
| `/settings?tab=users`                          | `user`               | The account open, by username                                                                                                            |
| `/settings?tab=groups`                         | `group`              | The group open, by name                                                                                                                  |
| `/settings?tab=users`, `?tab=groups`           | `new=1`              | The form for a new account or group                                                                                                      |
| `/system/nodes`                                | `path`               | The path open in the explorer, for example `path=/archive/albums`                                                                        |
| `/docs`                                        | `find`               | The words in the documentation's search box                                                                                              |
| `/login`                                       | `next`               | Where to go after signing in                                                                                                             |

## Links into the documentation

The **Documentation** section has its own addresses. The reference pages are drawn from the
installation you are on, so they list exactly what it has.

| Address                | What it shows                                                               |
| ---------------------- | --------------------------------------------------------------------------- |
| `/docs`                | The guide's overview                                                        |
| `/docs/<path>`         | One guide page, by its URL-encoded path under `/usr/docs/guide`             |
| `/docs/commands`       | Every command, see also [Commands](commands.md)                             |
| `/docs/settings`       | Every setting with its current value, see also [Settings](settings.md)      |
| `/docs/environment`    | The environment variables, see also [Environment variables](environment.md) |
| `/docs/node-types`     | The node types, see also [Node types](node-types.md)                        |
| `/docs/modules`        | What is installed                                                           |
| `/docs/modules/<name>` | One installed module, for example `/docs/modules/archive`                   |

The reference pages have an anchor for every entry, which scrolls to it and marks it for a moment:

| Entry       | Address                                                                         |
| ----------- | ------------------------------------------------------------------------------- |
| A command   | `/docs/commands#cmd-<name>`, for example `/docs/commands#cmd-share-link`        |
| A setting   | `/docs/settings#set-<KEY>`, for example `/docs/settings#set-CFG_GUEST_BROWSING` |
| A node type | `/docs/node-types#type-<type>`                                                  |

## Signing in and share links

### The return after signing in

A visitor who opens a page they must sign in for is sent to the sign-in page, with the address they
asked for in `next`:

```text
/login?next=%2Fpeople%2Fhelen-okafor%3Ftab%3Dfaces
```

After signing in they land on that page. `next` only leads to a page on the same EiN; anything else
leads to **Home**. Someone already signed in who opens `/login` goes straight on to `next`, or to
**Home**.

### Share links

A share link has the form `/s/<token>`, for example `http://ein.local:8080/s/` followed by a long
string of letters and digits. You make one with **Share** in the interface, see
[Sharing](../guide/sharing.md), or with [`share-link create`](commands-core.md#share-link) in the
terminal.

Opening it shows **Opening what was shared with you…** and then the page of what was shared,
such as the album's address. Where visitors may not browse, the visitor stays on what the link
opens: other pages ask them to sign in. A link that has expired or been turned off shows **This link no longer works** with a
**Sign in** button.

## When an address does not open

| What you see                                 | What it means                                                                              | What to do                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Nothing here** and "There is no page at …" | No page has that path: a typing mistake, or a page of a module that is not installed       | Check the address; **Go back** or **Go home**                                                |
| The sign-in page                             | The page is for signed-in users, or visitors may not browse                                | Sign in; you go on to the page afterwards                                                    |
| **This page did not load**                   | The page's code could not be fetched, often because EiN was updated while the tab was open | Choose **Reload**                                                                            |
| **Something broke on this page**             | The page failed while drawing; the error is shown below the message                        | Choose **Reload**; if it keeps happening, see [Troubleshooting](../admin/troubleshooting.md) |
| **This link no longer works**                | A share link that expired or was turned off                                                | Ask for a new link, or sign in                                                               |

In a dialog or the side panel the same messages appear smaller, with **Close** in place of
**Go home**.

After an administrator installs or updates a module, its pages reach the browser once EiN has
rebuilt them with [`ui-build`](commands-core.md#ui-build), which it does when it starts. An open tab
picks them up when you reload it.

## Other addresses the server answers

Besides the pages, EiN's web server answers a few addresses that programs use rather than people.
You meet them in links to files, in scripts, and in a reverse proxy's configuration
([Ports, HTTPS and remote access](../admin/network.md)).

| Address                          | Method        | What it does                                                                                                  |
| -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- |
| `/file/<path>`                   | `GET`, `HEAD` | The bytes of a file in the tree, read with the permissions of whoever asks                                    |
| `/file/<path>`                   | `PUT`         | Stores the body at exactly that path, creating or replacing the file                                          |
| `/file/<directory>/?name=<name>` | `POST`        | Stores an upload under a name nothing in the directory has yet: `name`, else `name (2)`, `name (3)` and so on |
| `/archive`                       | `POST`        | Collects a selection of files for a download as one zip                                                       |
| `/archive/<token>`               | `GET`         | Downloads that zip                                                                                            |
| `/log/<path>`                    | `POST`        | Adds JSON entries to a log node                                                                               |
| `/track/<path>`                  | `POST`        | Adds GPS points to a track node, see [Devices and GPS tracks](../guide/devices.md)                            |
| `/__shell`                       |               | The connection the web interface talks to EiN over; a proxy must pass it on as a WebSocket                    |

Any other path that is not a file of the web interface returns the interface itself, which then
shows the page or **Nothing here**. A visitor who is not signed in where visitors may not browse
gets `sign in first` from `/file/` and `/archive/`.

## Related pages

- [Finding your way around](../guide/interface.md): the pages, dialogs and side panel these
  addresses open.
- [Sharing](../guide/sharing.md): making and turning off share links.
- [Search and the finder](../guide/search.md): the search the `/search` parameters describe.
- [Your sidebar and top bar](../guide/customizing.md): which entries open which address.
- [Keyboard shortcuts](shortcuts.md).
- [The module manifest](../develop/manifest.md): how a module adds its own addresses.
