# The Archive

The Archive is the module that makes EiN a family archive: albums of photos, videos, recordings and
documents, the people in them and the family tree, the places they were taken, and the devices that
took them. This page is for anyone deciding whether to install it and for anyone starting to use
it: what it needs, how to install it, what it adds to EiN, and where to begin. The pages in this
section apply once the Archive is installed.

## What it is for

| Part                   | What it gives you                                                                                                                   | Covered on                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Albums and media       | Albums that hold photos, videos, audio recordings and documents, the Media feed and the Year page, labels, and the viewer           | [Albums](albums.md), [Media, Year and labels](media.md), [Viewing photos, videos and recordings](viewer.md) |
| Staging                | A private place for each person, where uploads wait, get their dates and places read, and are grouped into suggested albums to file | [Getting your photos in](importing.md), [Sorting in staging](staging.md)                                    |
| People and the family  | People, the faces found in pictures, the family tree, events in their lives and the homes they lived in                             | [People and faces](people.md), [Family tree, events and homes](family.md)                                   |
| Locations and the map  | Named places with outlines on the map, and pictures placed by their GPS position                                                    | [Locations and the map](places.md)                                                                          |
| Devices and GPS tracks | The cameras, phones and trackers that took pictures or recorded routes, their owners and clocks                                     | [Devices and GPS tracks](devices.md)                                                                        |
| Search                 | Finding pictures by what they show, say and contain, and the albums, people, locations and devices they belong to                   | [Searching your pictures](search.md)                                                                        |
| Home                   | On this day, News and Events on the Home page, and the life-event charts on the Statistics page                                     | [Memories, news and events on Home](home.md)                                                                |

## What it needs

- **The `ems` module.** The Archive reaches the media service through it. EiN installs `ems` along
  with the Archive.
- **The media service**, a separate container beside EiN that reads dates and places, makes the
  previews, and finds faces, text and speech. Installing the module does not install it: the
  installer's `--ems` option does. Without it, the Archive installs and uploads arrive, but nothing
  gets thumbnails, dates, faces or searchable text, and uploads wait in staging as **being
  prepared** until the service is there. [The media service](../ems/index.md) covers it.

A language model is optional. With the assistant module's model, the search box also reads people
and places out of a sentence; see [Searching your pictures](search.md#write-what-you-are-looking-for).

## Install it

Installing takes an administrator. Any of these installs the Archive with the `ems` module:

- **At the install**, with the installer's `--module archive`, together with `--ems` for the media
  service:

  ```bash
  # on the machine that will run EiN
  curl -fsSL https://einhq.eu/install.sh | bash -s -- --ems --module archive
  ```

  On an EiN that is already installed, `~/ein/setup.sh --ems --module archive` does the same.
  Without `--ems`, the installer's `archive` line says `low` and reminds you that the Archive needs
  the media service.
- **In the web interface**: open **Settings → Modules**, choose the **Published modules** button
  beside the filter, and choose **Install** beside `archive`. When it brings `ems` along, EiN says
  "Installed, with ems".
- **In the terminal**, as the administrator:

  ```bash
  # in EiN's terminal
  mod install archive
  ```

Its pages appear in the sidebar without a reload. [Modules](../admin/modules.md) covers installing,
updating and removing modules, and [Installing in detail](../admin/install.md) the installer's
options.

## What it adds to the interface

In the sidebar:

| Section     | Entries                                               |
| ----------- | ----------------------------------------------------- |
| (top)       | **Media**, and **Staging** when you are signed in     |
| **Explore** | **Year** and **Map**, beside EiN's own **Search**     |
| **Browse**  | **Albums**, **People**, **Locations** and **Devices** |

In the top bar:

- The **Create** menu gets **Import media** (when you are signed in), **Album**, **Person**,
  **Location** and **Device**.
- The account menu gets **Favourites**.
- **Random album**, the button with two crossing arrows beside the search box, opens an album at
  random; <kbd>Alt</kbd>+<kbd>R</kbd> does the same.

In EiN's own pages:

- **Home**: the Archive fills **On this day**, **News** and **Events**, and offers **Import media**
  under an empty News when you are signed in; see [Memories, news and events on Home](home.md).
- **Statistics**: the **Events** section, with births, engagements, marriages and deaths by month.
- **Search**: the **People**, **Locations**, **Years** and **Labels** rows before you search, and,
  when you are signed in, the pictures that look like a label in a search for that one label; see
  [Searching your pictures](search.md).
- **Nodes**: a **Duplicates** tab among the page's tools, for the folder that is open.
- **The finder** in the top bar finds albums, people, locations and devices by name, and offers
  **Pictures of "…"** to search the Media page.

[Finding your way around](../guide/interface.md) shows where each of these sits.

## Where its content lives

The Archive keeps its content in the tree: in folders under `/archive` that it makes when it is set
up, and in a staging folder in each person's home:

| Path                 | What is there                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `/archive/albums`    | Albums, and the photos, videos, recordings and documents in them                                        |
| `/archive/people`    | People, with their family, homes, events and devices                                                    |
| `/archive/locations` | Locations, each with its outline on the map                                                             |
| `/archive/devices`   | Cameras, phones and GPS trackers, each with the route it recorded                                       |
| `~/staging`          | In each person's home, such as `/home/helen/staging`: uploads waiting to be sorted, seen by nobody else |

Removing the module never removes the folders under `/archive`, since they hold the content.
[The tree](../concepts/tree.md#archive-the-content) describes them, and the labels in
`/archive/tags`, which are EiN's own.

## Start using it

1. **Upload.** In the top bar, open **Create** (the plus) and choose **Import media**. Choose
   **Inbox** under **Into which category?**, click **Choose files** or **Choose a folder**, and
   click **Upload**. Keep the tab open until the **Uploads** button in the top bar says it is done.
   For more than about 10,000 files, copy them over SFTP instead. See
   [Getting your photos in](importing.md).
2. **Sort in staging.** A few minutes after the files are prepared, open **Staging** in the sidebar,
   then the category, then **Sort**. Each group shows its proposal, such as **New album “…”**,
   which <kbd>Enter</kbd> accepts on a computer; or choose **New album…** in the group's ⋯ menu,
   check the **Name** and choose **Create album**. The pictures leave staging for the album, which is now under **Albums**. Every
   decision can be undone. See [Sorting in staging](staging.md).
3. **Share an album.** Open the album and choose **Share** in its header. Under **Who can see it**,
   **Default** lets everyone with an account see it, and **Private** only its owner; for someone
   without an account, choose **Create link** under **Share with a link**. See
   [Sharing](../guide/sharing.md).

Then name the people in your pictures ([People and faces](people.md)), and find what you have
([Searching your pictures](search.md)). An administrator setting EiN up for a family finds the
whole order of steps on [First steps](../start/first-steps.md).

## Pages in this section

- [Getting your photos in](importing.md): Import media, dropping files, SFTP, zips and Google
  Takeout.
- [Sorting in staging](staging.md): filing uploads into albums.
- [Duplicates](duplicates.md): copies, look-alikes and bursts, and removing them.
- [Dates and places of pictures](dates-places.md): when and where each picture was taken, and
  setting them right.
- [Albums](albums.md): making, editing and arranging albums.
- [Viewing photos, videos and recordings](viewer.md): the viewer, its details panel and slideshow.
- [Media, Year and labels](media.md): the Media feed, the Year page and labels.
- [Searching your pictures](search.md): finding pictures and what they belong to.
- [People and faces](people.md): people, and naming the faces found in pictures.
- [Family tree, events and homes](family.md): how people are related, and their lives.
- [Locations and the map](places.md): places, their outlines and the map.
- [Devices and GPS tracks](devices.md): cameras, phones and trackers, and their routes.
- [Memories, news and events on Home](home.md): what the Archive shows on Home and Statistics.
- [Supported files](file-types.md): the files the Archive reads.
- [Processing pictures](processing.md): the work done on every file, for administrators.
- [Staging for administrators](staging-admin.md): staging areas, large imports and repairs.
- [Archive commands](commands.md): the Archive's commands in the terminal.
