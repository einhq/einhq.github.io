# Getting your photos in

This page is for everyone in the family who brings photos, videos, recordings and letters into EiN.
It shows every way in, where each one puts your files, and what happens to them until they are in
an album.

## Where new files go

Almost everything you bring in lands first in your **staging area**, a private place that only you
can see. EiN reads each file there, checks whether you have it already and suggests albums for it.
Nobody else sees the files, and they stay out of the shared library, until you file them into an
album. The usual way past staging is to upload straight into an album that already exists.

| Way in                                               | Where the files go                                    | Folders kept |
| ---------------------------------------------------- | ----------------------------------------------------- | ------------ |
| **Create → Import media**                            | the staging category you choose                       | yes          |
| Dropping files on the **Staging** page               | the category you drop them on                         | yes          |
| **Upload**, or dropping files, on the **Media** page | your **Inbox** in staging                             | yes          |
| **Upload**, or dropping files, on an album's page    | that album, in the library                            | no           |
| Copying over SFTP or `scp`                           | the folder you copy into, normally a staging category | yes          |

Your staging area is divided into **categories**. The **Inbox** is always there and takes
everything you do not put elsewhere; you can add others, one per source: a Google Photos export, a
box of scanned prints, an old phone. Each category is a folder, `/home/<you>/staging/files/<name>`.
[Sorting in staging](staging.md) covers categories in full.

Until they are filed, staged files stay out of the library's own views: the Media page, the map, On
this day, the newest pictures and search leave them out. You find them on the **Staging** page,
in the sidebar below **Media**.

EiN takes photos (camera RAW files too), videos, recordings, documents such as PDFs, and GPX tracks.
[Supported files](file-types.md) lists the formats and what EiN works out from each. A GPX track
you upload into staging is not a picture: it joins the track of the device that recorded it, or
waits for you to say which device that was (see [Devices and GPS tracks](devices.md)).

> [!NOTE]
> You need to be signed in to bring files in: visitors are not offered **Import media** or
> **Staging**.

## Import media

**Import media** is the main way in. It puts files into one staging category, keeping the folders
you choose.

1. Open the **Create** menu (the plus in the top bar) and choose **Import media**. The same dialog
   opens from the **Import media** button on the Staging page, the **Import** button on a category's
   card, **Import media…** in a category's ⋮ menu and, while the Home page has no news yet, the
   **Import media** button there.
2. Under **Into which category?**, pick a category. Each shows how many files it holds and its
   folder, for example "0 files · files/inbox". The Inbox is chosen unless you opened the dialog
   from a category.
3. To keep this batch in a category of its own, choose **New category** instead ("For one source
   kept together: an export, a box of scans, a phone."). Pick **What it holds**, and type what the
   category is **Called**. The line under the name shows the folder it gets, for example
   "Folder files/box-3".
4. Choose **Choose files** or **Choose a folder**. The line under the buttons counts what you
   picked, for example "212 files in 3 folders, 1.4 GB".
5. Choose **Upload 212**. The button counts your files.

![The Import media dialog with the Inbox chosen, the Choose files and Choose a folder buttons, and the SFTP folder with its copy button and How link](../../assets/shots/import.webp "Import media: a category, the files, then Upload.")

The dialog closes, the category opens on its **Files** tab and the files upload in the background.
If you made a new category, it is created first.

**What it holds** starts on **Google Photos export**. Pick the kind closest to where the files come
from: **Google Photos export**, **Scans**, **Phone**, **Camera**, **Messaging**, **Screenshots** or
**Other**. The kind decides how the files are dated and grouped; a scan, for example, is never
dated by the scanner's clock. [The kinds of category](staging.md#the-kinds-of-category) explains
each one.

For an existing category, the dialog also says "Over about 10,000 files? Copy them over SFTP
instead, folders and all, into" with the category's folder, a button that copies the path, and a
**How** link. See [Copy files in over SFTP](#copy-files-in-over-sftp).

### Follow an upload

While files upload, an **Uploads** button with a progress ring appears in the top bar. Its panel
shows how far the whole upload is ("1,204 of 3,000" and the bytes), the progress of each place the
files go (a category or an album), the files being sent, and the last failures with their reasons.

- **Cancel** stops the upload: the files being sent are stopped and the waiting ones dropped.
- **Retry failed** sends the failed files again.
- **Clear** forgets the finished files; the button goes away until the next upload.

Four files are sent at a time. The upload goes on while you move around EiN, but it runs in this
browser tab: closing or reloading the tab stops the files not sent yet. The files already sent
stay.

A name already taken in a folder is never replaced. The file is stored under a numbered name, such
as `IMG_0042 (2).jpg`, and the panel says "N saved under a new name, theirs was taken".

## Upload or drop files on a page

Four pages take files from a button in their header and from files dropped anywhere on them:

| Page                                          | Buttons                                     | When you drag files over it                                                       | Where the files go                       |
| --------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| **Staging** (the overview of your categories) | **Import media**                            | "Drop the files on where they go", with a tile for each category                  | the category whose tile you drop them on |
| A staging category, on any tab                | **Upload**, and **Upload a folder** under ⋮ | "Drop files to upload", "Into Box 3, folders and all" (with the category's name)  | that category                            |
| **Media**                                     | **Upload**, and **Upload a folder** under ⋮ | "Drop files to upload", "Into staging, folders and all"                           | your Inbox                               |
| An album you may change                       | **Upload**                                  | "Drop files to upload", "Into Sailing in the archipelago" (with the album's name) | that album                               |

On the Staging overview, files dropped beside the tiles go nowhere.

An upload into staging goes into a folder for the day inside the category, named
`upload-YYYY-MM-DD`, and a folder you drop or choose keeps its structure below it:
`Trip/day 2/IMG_0001.jpg` lands in `upload-2026-10-25/Trip/day 2/`. Folder names help the
grouping. In most kinds of category, a folder you named yourself, holding at least three pictures,
becomes a suggested album of its own, named after the folder, such as "Cornwall, summer 1968".
Names that cameras and exports give folders, such as `DCIM`, `100CANON`, a bare year or date, or
`Takeout`, are not used.

On a phone the header's buttons fold into the ⋮ menu, and **Upload** offers your photos, videos,
recordings and GPX files, and the camera. [EiN on a phone](phone.md) has more.

Files dropped on a terminal tab are uploaded into that tab's current folder, without their folders;
see [The terminal](../shell/terminal.md).

## Upload straight into an album

An album's page has **Upload** in its header, and files dropped anywhere on the page go into the
album. This skips staging, and it differs from an upload into staging in these ways:

- The files are in the album at once, shared as the album is: everyone who can see the album sees
  them as soon as they are processed.
- EiN suggests nothing and does not check them against your other pictures for copies.
- Folders are not kept: every file goes straight into the album.
- A zip stays a zip; it is expanded only in staging.

New files show a plain tile with a picture icon until their thumbnails are made, and take their
place in date order once their dates have been read.

**Upload** is offered only on an album you may change, and never on a suggested album (a staging
group opened as an album page). [Albums](albums.md) covers the album page.

### Staging or an album?

Use staging (**Import media**, the Media page or the Staging page) when:

- you bring in a batch: a phone's worth, an export, a box of scans or a folder from an old laptop;
- you want EiN to find the pictures you have already and suggest which albums the rest belong in;
- you want to look at the pictures before anyone else sees them.

Upload straight into an album when you have a few pictures that belong in an album that already
exists, you may change that album, and the people it is shared with may see them right away.

## Copy files in over SFTP

For tens of thousands of files, or a whole export, copy them over SFTP instead of through the
browser. You need the host name, the SSH port (2222 unless your administrator changed it), and your
EiN username and password. `sftp`, `scp`, FileZilla, Cyberduck and your file manager's "connect to
server" all work; [SSH and SFTP](../shell/ssh-sftp.md) explains connecting.

1. Open **Staging** in the web interface once. This sets up your staging area. Without that, EiN
   sets it up within the hour.
2. For a big export or a box of scans, make its category first: on the Staging page, choose its
   kind on the **New category** card, type what it is **Called** and choose **Create**.
3. Copy the files into the category's folder, `/home/<you>/staging/files/<name>/`. The Staging page
   says "Tens of thousands of files? Copy them over SFTP into a category's folder:", and the Import
   media dialog shows the folder of the category you pick, with a button that copies the path.

```bash
# on your own computer
scp -P 2222 -r "From the old laptop" anna@ein.local:/home/anna/staging/files/inbox/
```

Mind the capital `-P` for the port in `scp` and `sftp`. Files copied over SFTP are taken in exactly
as a browser upload is; on the Staging page they show as "being prepared" (the "arriving" stage
counts uploads from your browser only).

### Keep folder names for the grouping

A folder becomes a suggested album of its own, named after the folder, only when it lies two or
more levels below the category. A browser upload does this for you, because it adds the folder
for the day. Over SFTP, copy a folder that holds your event folders, not the event folders
themselves:

```text
staging/files/inbox/
  From the old laptop/          one level down: its name is not used
    Cornwall, summer 1968/      two levels down: suggested as "Cornwall, summer 1968"
    Christmas 1975/             two levels down: suggested as "Christmas 1975"
```

Pictures in a folder only one level down are still grouped, by when and where they were taken;
only the folder's name is not used.

Put files in a category's folder, never in `files/` itself: a folder copied directly into `files/`
becomes a category of its own, of the **Other** kind, and a file left there belongs to no category
until EiN moves it into `files/inbox/unsorted/`. It does that once an hour, for a file nothing has
changed on for six hours, so a copy still being written is left alone.

> [!WARNING]
> A file you delete over SFTP is gone for good; it does not go to the trash. To get rid of staged
> files, use **Discard…** on the category's **Files** tab, which puts them in your trash with Undo.

## Zips and Google Takeout exports

### Zips

You do not need to unpack a zip first. A zip uploaded or copied anywhere into a staging category
is expanded once its upload has ended: what it holds goes into the folder the zip lies in, and the
zip is removed.

- One zip is expanded at a time.
- The disk needs room for what the zip holds and a tenth more. A zip that does not fit, or that
  would put a file outside its folder, is left as it is.
- A file already there at the same size is skipped, so a zip whose expansion was cut off is
  finished on the next attempt. A file of the same name and another size is not written over: the
  rest of the zip is expanded, and the zip stays.
- When a zip stays, your administrator can see why on the pipeline's page; see
  [Processing and pipelines](../admin/processing.md).

Outside staging, for example uploaded into an album, a zip stays a zip.

### A Google Takeout export

A Google Photos Takeout comes as one or more zips. Beside every photo and video, Google writes a
JSON file with what it knows of it: when it was taken, where, its caption and whether it was a
favourite. EiN reads these files, called sidecars, and gives what they say to the picture.

1. On the Staging page, choose **Google Photos export** on the **New category** card. Call it, for
   example, "Google Photos"; its folder is `files/google-photos`. You can also choose
   **New category** in the Import media dialog, where **Google Photos export** is the first kind.
2. Bring in the zips as they are: in **Import media**, choose the category, **Choose files** and
   the zips, then **Upload**. For a large export, copy them over SFTP instead:

   ```bash
   # on your own computer
   scp -P 2222 takeout-001.zip takeout-002.zip anna@ein.local:/home/anna/staging/files/google-photos/
   ```

3. Wait. Each zip is expanded and removed, and the parts of one export fill one tree of folders.
   About 30 seconds after a folder's files stop arriving, EiN pairs each JSON file with its photo
   or video.

What a paired JSON file gives its picture:

| In the Takeout                  | In EiN                                                  |
| ------------------------------- | ------------------------------------------------------- |
| when the picture was taken      | its date                                                |
| where it was taken              | its place, when the file has no GPS position of its own |
| its caption                     | its description, when it has none                       |
| marked as a favourite           | in your **Favourites**                                  |
| an album's folder and its title | a suggested album under that title                      |
| the people Google named in it   | not used: EiN finds the faces itself                    |

A paired JSON file moves under its picture and is no longer listed as a file of its own. A JSON
file that matches no picture stays where it is and counts among the category's **Other files**.
The pairing knows Google's ways of naming: `IMG_0001.jpg.json` and
`IMG_0001.jpg.supplemental-metadata.json`, names cut short, the `(1)` of a second picture of the
same name, edited copies, and the video of a Live Photo.

A category of the Google Photos export kind is worth making for two reasons: it pairs sidecars, and
its processing waits behind other work, so pictures you upload to the Inbox in the meantime are
ready first. A **Scans** category waits behind other work in the same way.

An XMP file that a photo editor or a scanning tool writes beside a picture (`IMG_0001.jpg.xmp` or
`IMG_0001.xmp`) is paired the same way. Every kind of category pairs sidecars except
**Messaging** and **Screenshots**.

### If the export went into the Inbox

A folder that arrives in the Inbox is looked at to see where it came from. When it looks like an
export, a blue box on the Staging page and on the Inbox's **Files** tab says so, for example
"“Takeout” looks like Google Photos", with the two strongest signs.

- **Make a Google Photos export category…** makes the category and moves the folder into it.
- **Move to Google Photos…** (with your category's name) appears instead when you have a category
  of that kind already.
- The ✕ ("Keep it here, stop asking") leaves the folder where it is.

Nothing moves by itself. The same box recognises scans, a phone's or a camera's pictures, pictures
from a messenger and screenshots.

## What happens after the upload

![Four ways in (Import media, drag and drop, SFTP, a zip or Takeout) lead to a category folder in your staging area, where files go through arriving, being prepared and being grouped and become a suggested album in a lane; from there they are filed into the library as a new album, a new private album or into an album already there, put aside in the Later lane, or discarded to your trash](../diagrams/staging-flow.svg "Files wait in your staging area until you decide; only filing can make them visible to others")

Each category's card on the Staging page, and the strip above a category's tabs, show where your
newest files are. Each stage shows while it holds files:

| You see                          | Its tooltip                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------ |
| "N of M arriving"                | "Uploading from this browser"                                                  |
| "N being prepared, about 12 min" | "Their dates and places are being read; the groups they join may still change" |
| "N being grouped"                | "Read, and waiting for the organizer to put them in a group"                   |

1. **Arriving.** The files are on their way from your browser. Files copied over SFTP skip this
   stage and show first as being prepared.
2. **Being prepared.** EiN reads each file's date, place and camera. A file that is an exact copy
   of a picture you can open already is recognised here and goes no further: it is not processed,
   and shows its original's picture (see
   [An exact copy shows its original](duplicates.md#an-exact-copy-shows-its-original)). The time
   estimate comes from how fast files left this stage while the page was open.
3. **Being grouped.** The organizer sorts read files into groups within minutes of their arrival.
   On a category's page, **Group now** beside this stage asks it at once, and a message says
   "Grouping asked for: the new files are grouped within a few minutes".
4. **Suggested albums.** The groups appear on the category's **Sort** tab, one after another, each
   in a lane: **To sort**, **Everyday**, **Needs a date**, **Clutter** or **Later**. Before the
   first is ready, the tab says "No groups yet" and "Groups appear as your files are prepared:
   N still to go."
5. **Filed.** For each group you choose **New album**, **New private album**, **Add to album…**,
   **Later** or **Discard**. Filing moves the files into an album in the library, with everything
   EiN worked out about them; from then on whoever can see that album sees them. A discarded group
   goes to your trash. Filing and discarding can be undone on the category's **Done** tab.

The card's bar shows the same files by how far along they are: **Being prepared**, **To sort**
(read, with a date), **Needs a date** (read, but with no date) and **Other files** (files that are
not pictures, videos or recordings). An exact copy that went no further, and an empty picture,
video or recording, are in none of them. How to go through the groups is on
[Sorting in staging](staging.md#sort-the-stream-of-suggested-albums).

## Why new pictures have no thumbnails yet

Reading a file's date and place is only the first step. The rest of the work runs side by side
afterwards, and each part shows up in EiN when it is done.

![From upload to findable: a file arrives and its date, place and camera are read first, by media-ingest; then thumbnails, video and sound to play, faces and people, picture vectors, text in the picture, transcripts and voices, fingerprints and the address are worked out side by side, each showing up in its own place: the grids and viewer, People, Search, duplicates and stacks, or Locations](../diagrams/pipeline.svg "Each piece of work fills in its own part of EiN as it finishes.")

| Work                                                                        | What it gives you                                                                                                            |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Thumbnails, and a version of each video and recording your browser can play | the picture in grids and in the viewer; until then a plain tile with a picture icon                                          |
| Faces                                                                       | the people in the picture, named or waiting for a name ([People and faces](people.md))                                       |
| Picture vectors                                                             | searching by what a picture shows                                                                                            |
| Text in pictures and documents                                              | letters, signs, handwriting and the text of PDFs become searchable; read once a file is filed, not while it waits in staging |
| Transcripts and voices                                                      | what is said in videos and recordings becomes searchable, with who says it                                                   |
| Fingerprints                                                                | look-alikes, stacks of photos taken in a burst, and the same recording twice                                                 |
| Address lookup                                                              | the street address for a GPS position, from OpenStreetMap                                                                    |

The **media service** does most of this work. It is the part of your EiN installation that holds
the tools and models for pictures, video and sound. With a graphics card it is faster; without one
it makes the same things, more slowly. A few new pictures take moments; an export of tens of
thousands keeps it busy for a long while. While files are being prepared, their category's card
on the Staging page estimates how long that stage has left, as in "about 12 min".

If the media service is not running, nothing new is read: files stay "being prepared", while
uploading and browsing go on working. Nothing is lost; the work waits and goes on once the media
service answers. [The media service](../admin/media-service.md) is the administrator's page on it.

Your administrator follows this work on the **Dashboard**, whose verdict reads **Catching up**
while work is waiting and getting done. Only **Stuck** or **Needs a person**, for long, means
something needs looking at; see [Health and the dashboard](../admin/monitoring.md). Anyone can ask
the same question in the terminal with `health`, whose first line is the verdict:

```text
catching up: 1,500 jobs waiting, the slowest kind done in 4h00m
```

## If something goes differently

**Upload stays greyed out in the dialog.** Choose files first. With **New category**, the name must
hold a letter or a digit; the line under it says "Needs a letter or digit" until it does.

**Some files failed.** Open the **Uploads** button in the top bar: the failures are listed with
their reasons. Choose **Retry failed**.

**The panel says files were "saved under a new name, theirs was taken".** A file of that name was in
the folder already. If it is the same picture uploaded twice, the second one is marked as an exact
copy; remove it on the category's **Duplicates** tab ([Duplicates](duplicates.md)).

**An album has no Upload button.** You may not change that album, or it is a suggested album from
staging. Filing from staging into an album also needs you to be able to change it, so ask whoever
shares the album to let you edit it ([Sharing](sharing.md)), or file the pictures into an album of
your own.

**Files stay "being prepared" for a long time.** A large import can take hours. If the count does not
go down at all, the media service may not be running; tell your administrator.

**The Sort tab says "No groups yet".** The files are still being prepared, or the organizer has not
grouped them yet. Wait a few minutes, or choose **Group now** on the category's page.

**A zip is still a zip.** It was uploaded outside staging, the disk lacked room, or a file in it
clashed with one already there. Your administrator can see the reason.

**A folder's name was not used for a group.** The folder lies only one level below the category
(see [Keep folder names for the grouping](#keep-folder-names-for-the-grouping)), holds fewer than
three pictures, or has a name a camera or an export gives.

**New pictures are not on the Media page, the map or in search.** That is how staging works: they
appear there once you file them. Look for them on the **Staging** page.

**Over SFTP, `/home/<you>/staging` does not exist.** Open **Staging** in the web interface once, then
copy again.

**The dates are wrong, or scans have none.** A scan is undated until you give it a date; see
[Dates and places of pictures](dates-places.md).

## Related pages

- [Sorting in staging](staging.md): categories, the suggested albums and filing them.
- [Duplicates](duplicates.md): exact copies, look-alikes and bursts.
- [Supported files](file-types.md): what EiN takes in and what it works out from each file.
- [SSH and SFTP](../shell/ssh-sftp.md): connecting from your own computer.
- [Staging and importing for administrators](../admin/staging.md): the background work, big
  imports and the `staging` command.
