# Cameras

A camera is what took pictures for your archive: a camera, a phone, a scanner or a camcorder. This
page is for family members and administrators who register cameras, say who owned them and set
their clocks right. Where a phone or a GPS tracker went is its device's track, on
[Devices](../guide/devices.md) and [Trips](tracks.md).

## What registering a camera gives you

EiN reads the camera's name out of every picture, but until the camera is registered that is all
it knows: the viewer shows the make and model the file names, and nothing else. Once a camera is
registered, the pictures it took are linked to it, and:

- the viewer's camera line names the camera, links to its page and says who owned it (see
  [The details panel](viewer.md#the-details-panel));
- the camera's page gathers everything it took, who owned it and when, and the device it is part
  of, such as a phone, if it has one;
- an album's **Info** tab lists the cameras that took its pictures, and its **Map** tab draws the
  tracks of the devices they are part of (see [Albums](albums.md#the-info-tab));
- the Search page finds cameras and narrows albums by them, and `@` in a search box picks one to
  keep the pictures it took (see [Search and the finder](search.md#find-albums-people-locations-and-cameras));
- the camera's **Timezone**, **Scanner or digitizer** and **Video times in UTC** settings correct
  the dates of every picture it took.

## How EiN recognises a camera

When a file arrives, EiN reads what the camera wrote into it: the make (the EXIF tag `Make`), the
model (`Model`) and, when the camera writes one, its serial number (`SerialNumber`,
`InternalSerialNumber` or `DeviceSerialNo`). Some camcorders write the make and model as
`DeviceManufacturer` and `DeviceModelName` instead. These three together are the file's
**fingerprint**, and EiN looks for the registered camera that has the same one:

1. a camera with the same serial number;
2. otherwise, a camera with the same make and the same model, also when the file carries a serial
   number that no camera has.

The camera's name plays no part. The make and model are compared exactly as the camera writes
them, so a camera registered with the make `Nikon` does not match files that say
`NIKON CORPORATION`.

EiN does this when it first reads the file, when you register the camera and when you change its
make, model or serial number: registering a camera, or giving it a new fingerprint, links the files
already in the archive that carry it. **Link existing media** on its page looks again for any it
missed (see [Link the files a camera missed](#link-the-files-a-camera-missed)).

Two things a fingerprint cannot do:

- **Tell two phones of the same model apart.** A serial number identifies one camera body; a make
  and model identify only a model line, and most phones write no serial number. If two people in
  the family have the same phone model, EiN cannot tell their pictures apart, and all of them are
  linked to one of the two cameras.
- **Match a file that names no camera.** Many messaging apps remove the make and model from the
  pictures they send, and a file without them matches nothing. You can link such files by hand in
  the terminal (see [From the terminal](#from-the-terminal)).

A camera's fingerprint has nothing to do with the fingerprints EiN takes of the pictures themselves
to find copies; those are described in [Duplicates](duplicates.md).

## The Cameras page

Open **Cameras** in the sidebar, under **Browse**.

![The Cameras page: the header "13 cameras" with a filter box, Registered (13) and Unregistered, and the Name (A-Z) sort, above cards for David's 7D, David's camcorder, Erik's iPhone, Freya's Pentax, Helen's scanner and others, each with a picture, the make and model, and badges for the serial number, the time zone and "scanner"](../../assets/shots/cameras.webp "Every registered camera with the picture that stands for it; the badges show at a glance which ones carry a serial number, a time zone or the scanner setting.")

- The header counts the registered cameras (**13 cameras**). The filter box (**Filter cameras…**)
  matches the name, make, model and serial number as you type.
- **Show** switches between **Registered (N)** and **Unregistered**, the cameras EiN has seen in
  the pictures that match no registered camera.
- **Sort** offers **Name (A-Z)** (the default), **Name (Z-A)** and **Make / model**. Your choice is
  remembered in this browser. It has no effect on the unregistered list.
- Each card shows the camera's cover, its name, its description or else its make and model, and
  badges: the serial number, the time zone, **scanner** and **video UTC**. Click a card to open the
  [camera's page](#a-cameras-page).

When nothing is registered yet, the page says **No cameras registered yet**: "The cameras and
phones that took the pictures. Unregistered lists the ones the archive has already seen." with
**Show unregistered** and, when you are signed in, **New camera**.

## Register a camera EiN has already seen

The quickest way to register a camera is from the pictures it took.

1. On the **Cameras** page, choose **Show** → **Unregistered**. The first time in a visit, EiN looks
   through the files it has read for cameras that match nothing registered. The list reads:
   "Cameras found in the indexed media that match nothing in the registry. Registering one lets its
   photos be linked to it, and its timezone and owners apply."
2. Find the camera. Each card shows a suggested name (the model, with the make in front when the
   model does not start with it, such as `Canon EOS 7D` or `Panasonic DMC-TZ1`), the make and
   model, the serial number when there is one, and how many files it took (**N files**). The
   cameras with the most files come first.
3. Click **Register** on its card. The **Register Camera** dialog opens with **Name**, **Make**,
   **Model** and **Serial number** filled in from the files.
4. Change **Name** to what the family calls the camera, such as `David's 7D`. Leave **Make**,
   **Model** and **Serial number** as they are: they are what the files are matched on.
5. Under **Timezone**, choose the time zone its clock was set to, and turn on
   **Scanner or digitizer** or **Video times in UTC** if they apply (see
   [Clocks, time zones and scanners](#clocks-time-zones-and-scanners)).
6. Click **Register**. The files the camera took are linked to it and dated by its settings, and
   the camera's page opens. The more files carry its fingerprint, the longer this takes: some
   minutes for a camera with tens of thousands of pictures.

**Rescan** at the top of the unregistered list looks again, for instance after a large import.
When every camera is registered, the list says "Every camera the media names is registered (N files
matched)." With many unknown cameras it shows the most used ones and says "Only the most-used
cameras are listed; there are more."

### When a card says "registered as …, but unmatchable"

Sometimes a camera with that name already exists, but without the make, model or serial number its
files carry, so nothing is matched to it. Its card then has the badge
**registered as &lt;name&gt;, but unmatchable** and the button **Add fingerprint** instead of
**Register**, because registering would make a second copy of a camera EiN already knows.

Click **Add fingerprint**. EiN writes the make, model and serial number from the card into the
existing camera and links the files they identify. When it is done, a message says
"Linked N files to &lt;name&gt;." or "&lt;name&gt; now carries the fingerprint, but no unclaimed
files matched it." This is quick for a camera with a serial number and slow for one known only by
its make and model, which can take minutes in a large archive.

The button is there only if you may change that camera; otherwise the card has no button.

## Register a camera by hand

Register a camera by hand when EiN has not seen it in any picture yet: a scanner before the scans
arrive, or a camera whose files you are about to import.

1. Open the **Create** menu (the plus in the top bar) and choose **Camera**, or click **New camera**
   on an empty Cameras page. The **Register Camera** dialog opens.
2. Fill in the fields below. Only **Name** is required.
3. Click **Register**. The camera's page opens. With a serial number, or both a make and a model,
   the files already in the archive that carry them are linked to it first.

| Field                    | What to enter                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                 | What the family calls it, such as `Helen's scanner`. The name also gives the camera's folder in the tree, so two cameras cannot have the same name. |
| **Make**                 | "As the camera writes it in exif: what files are matched on." For example `Canon`.                                                                  |
| **Model**                | "As the camera writes it in exif." For example `Canon EOS 5D Mark III`.                                                                             |
| **Serial number**        | "Tells one body apart, where make and model tell only the model." Optional.                                                                         |
| **Timezone**             | "The zone its clock was set to." Optional.                                                                                                          |
| **Scanner or digitizer** | "Its EXIF camera dates describe digitisation, not when the photograph was taken."                                                                   |
| **Video times in UTC**   | "Its videos keep their recording time in UTC, as phones do."                                                                                        |

To copy the make and model exactly, open a picture the camera took in the viewer and open
**Details** at the foot of the details panel. Among the EXIF tags it lists are `Make`, `Model` and,
when the camera writes one, `SerialNumber` (see [The Details section](viewer.md#the-details-section)).

A camera without a serial number and without both a make and a model is never matched to any file.
Its page says so: "No serial and no make/model — nothing is matched to this camera automatically;
`camera-link --camera` links files to it by hand."

Anyone signed in can register a camera. Changing it afterwards, with the buttons this page
describes, is offered to whoever may change it, which the camera's **Share** dialog shows and sets
(see [Sharing](../guide/sharing.md)).

## A camera's page

Click a card on the Cameras page, or the camera's name in the viewer. The page's address is
`/cameras/` and the camera's folder name, such as `/cameras/Davids_7D`, and the **Media** tab adds
`?tab=media`.

Under the name, the header shows the current owners (up to three, then "and N more"), how many
files the camera took and in which years, such as **75 files · 2025–2026** (**N+ files** when
counting stopped at its limit), and the camera's labels. For those who may change the camera, the
corner has **Share** and **Edit**, and the ⋮ menu has **Add event** and **Move to trash**. On a
phone they are all under ⋮.

| Tab       | What it shows                                                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Info**  | The page opens here: the camera's timeline, and beside it its settings, owners, device and description (see below).                                                                                   |
| **Media** | Every file linked to the camera, by date. Select pictures to act on them from the selection bar, for example **Add to album** or **Set time** (see [The selection bar](albums.md#the-selection-bar)). |

On the **Info** tab, the **timeline** on the left is the camera's history: when each owner started
and stopped using it, the events written on it, and the albums holding pictures it took. When it has
none, it says "Nothing recorded for &lt;camera&gt; yet. Owners with dates, and albums with photos it
took, appear on its timeline." On the right, and above the timeline on a phone:

- **Camera** lists Make, Model, Serial number, Timezone, "Capture dates: Scanner dates suppressed"
  for a scanner and "Video times: UTC"; with nothing but a name it says "Nothing recorded beyond the
  name." Under them is **Link existing media** (see
  [Link the files a camera missed](#link-the-files-a-camera-missed)).
- **Owners** lists everyone who has owned it, with the dates (see
  [Say who owned a camera](#say-who-owned-a-camera)).
- **Device** links to the device the camera is part of, such as the phone, or says "It is part of
  no device." (see [A phone that records where it was](#a-phone-that-records-where-it-was)). It is
  left out for those who may not change the camera when there is no device.
- **About** shows the description, when there is one.

The **Media** tab is the place to correct a camera whose clock was wrong: select its pictures and
use **Set time**, as [Dates and places of pictures](dates-places.md#set-the-time-of-several-pictures-at-once)
describes.

**Move to trash** sends the camera to your trash, and the message's **Undo** brings it back (see
[Your profile, favourites and trash](../guide/profile.md)).

## Link the files a camera missed

Files are linked to their camera when EiN first reads them, when the camera is registered and when
its make, model or serial number is changed. A file can still miss its camera, such as one that was
read while linking was not running.

1. Open the camera's page. The **Info** tab opens.
2. Click **Link existing media** under **Camera**. The text under it explains: "Files are linked to
   their camera when they are indexed, when it is registered and when its make, model or serial
   number is changed. This looks again for the files that carry its fingerprint and are linked to
   no camera, such as one indexed while linking was not running."
3. Wait for the message, such as "Linked 412 files and updated dates on 37.", or "Nothing new to
   link or update — every matching file already has this camera policy."

Linking also dates the files again by the camera's settings, which is what "updated dates" counts.
Files that are already linked to another camera are left with it.

The button is shown only to those who may change the camera, and only when the camera has a serial
number or both a make and a model. A camera that has both is looked for both ways. The more files
carry its fingerprint, the longer it takes: some minutes for a camera with tens of thousands of
pictures.

## Change a camera's settings

1. On the camera's page, click **Edit**. The **Edit camera** dialog opens.
2. Change what you need: **Name**, **Make**, **Model**, **Serial number**, **Timezone** (a list of
   time zones you can type in, such as `Pacific/Auckland`), **Scanner or digitizer**,
   **Video times in UTC**, **Description** and **Labels**.
3. Click **Save**.

A changed **Timezone**, **Scanner or digitizer** or **Video times in UTC** re-dates every file
already linked to the camera, and the page says "Re-dated N linked files.", or "Removed scanner
dates from N linked files." when you turned the scanner setting on.

A changed **Make**, **Model** or **Serial number** links the files already in the archive that carry
the new fingerprint and are linked to no other camera, and the page says "Linked N files.", or
"Linked N files and updated dates on M." when linking also re-dated files of the camera. A camera
with a serial number is linked quickly; one known only by its make and model can take minutes in a
large archive, and **Save** waits for it. Files linked under the old fingerprint stay linked.

## Clocks, time zones and scanners

Three settings tell EiN how to read a camera's dates. Each one applies to every file linked to the
camera, and changing it re-dates them.

- **Timezone**: the time zone the camera's clock was set to. A camera's clock writes a time without
  a zone, and EiN reads it in this zone, with the summer time of the year the picture was taken.
  A zone the camera wrote into the file itself comes first. Without a **Timezone**, EiN uses the
  archive's own time zone. Set it for a camera bought abroad, or one left on home time during a
  trip: Helen's Coolpix stayed on London time when she took it to Wellington, and with its
  **Timezone** set to `Europe/London`, EiN reads its clock as London time and gets the moment of
  each picture right.
- **Scanner or digitizer**: the camera's clock records when a file was scanned, not when the
  photograph was taken, so EiN dates pictures neither by it nor by a date in the file names it
  gives them. Pictures with no other date stay
  undated until someone gives them one. Files brought in through a staging category of the kind
  **Scans** are treated as scans whatever camera made them; this setting matters for scans uploaded
  straight into an album, copied in over SFTP, or already in the library.
- **Video times in UTC**: phones keep their videos' recording time in UTC. Turn this on for a phone
  whose videos come out off by its time zone.

[Dates and places of pictures](dates-places.md#time-zones) explains how EiN chooses a picture's date
and time zone, and [Date scans of old prints and slides](dates-places.md#date-scans-of-old-prints-and-slides)
how scans are dated.

A camera's **Timezone** is about its clock alone. The days of a device's trips are cut in its track's
own time zone, set on the device's **Trips** tab (see [How a device travels](tracks.md#how-a-device-travels)).

## Say who owned a camera

A camera can have several owners over the years. The viewer lists them under the camera's name,
each with the dates, such as **Owned by** Ruby Wrenfield (2023–), so you can tell whose camera it
was when a picture was taken.

1. Open the camera's page. **Owners** is on the right of the **Info** tab, the tab it opens on.
2. Click **Add owner** beside the heading.
3. Under **Person**, choose the person.
4. Fill in **From** and **To** as a year, a month or a day: `2005`, `2005-06` or `2005-06-20`. Leave
   **To** empty while they still own it, and leave both empty if you do not know the dates.
5. Click **Add owner**.

The list shows the current owners first, then the earlier ones, with their dates: "2019 – 2023",
"since 2019", "until 2023", or "dates unknown". A current owner with a start date has the badge
**current**. Use the pencil beside an owner to change the dates (**Save changes**), and the bin to
remove them; EiN asks "Remove &lt;person&gt; as an owner of &lt;camera&gt;?" before it does. With no
owner, it says "Nobody is recorded as owning this."

An owner without a **To** date counts as a current owner, in the page's header and under
**Owners**. Dated ownership appears on the camera's timeline, on the **Info** tab, as
"&lt;person&gt; started using &lt;camera&gt;" and "&lt;person&gt; stopped using &lt;camera&gt;". A
date that is not a year, month or day is refused with a message ending in "is not a date
(YYYY[-MM[-DD]])".

The owners' homes also count as the home bases of the track of the camera's device while the track
has none of its own (see [Home bases](tracks.md#home-bases)).

## A phone that records where it was

A phone can keep where it was as well as take pictures: it posts its position as it moves, or leaves
a GPX file of its route. That route is the track of the phone as a device (see
[Where tracks come from](tracks.md#where-tracks-come-from)), and the phone's camera is part of that
device. Link the camera to the device, and:

- the camera's page links to the device, under **Device** on the **Info** tab;
- an album with pictures the camera took draws the device's track on its **Map** tab (see
  [Choose which devices the map shows](albums.md#choose-which-devices-the-map-shows));
- a GPX file that names the camera, by its name, its make and model, or its serial number, goes to
  the device when it is dropped in staging (see [GPX files in staging](tracks.md#gpx-files-in-staging));
- while the device's track has no home bases of its own, the homes of the camera's owners count (see
  [Home bases](tracks.md#home-bases)).

To link it:

1. Open the camera's page. **Device** is on the right of the **Info** tab, with the line "A phone's
   camera is part of the phone, whose track says where its pictures were taken."
2. Click **Set device**, choose the device in the list (**Pick a device**), and click **Set**. The
   list holds the devices that keep a track.

**Change device** picks another, and the cross beside the device (**Take the device away**) takes the
link away; the device and its track stay as they are. Both are offered to those who may change the
camera. A camera that records nowhere, such as Helen's Coolpix or a scanner, needs no device. A phone
that is not a device yet is made by a member of the `devices` group (see
[A phone or a GPS tracker](../guide/devices.md#a-phone-or-a-gps-tracker)).

## Write something on a camera's timeline

To keep a story with a camera, such as where it was bought or when it broke, add an event:

1. On the camera's page, open the ⋮ menu and choose **Add event**.
2. Fill in **Date** (such as `2005-06-15`) and **Description** ("What happened"). Both are needed.
   **Written by** is you unless you choose someone else.
3. Click **Add event**.

The event appears on the camera's timeline, on its **Info** tab. Events are described in full in
[Family tree, events and homes](family.md).

## The camera's cover

The picture on a camera's card and behind its page's header is its cover: the newest picture linked
to it, by the date it was taken. The cover moves on by itself as newer pictures are linked. A camera
that took only videos, such as a camcorder, gets the poster frame of its newest video once that
video has been processed; recordings are never used. The card of a camera with no pictures shows
a placeholder with its initials.

The Web UI has no button to choose a camera's cover. In the terminal you can link a picture
as the camera's `coverPhoto` yourself, and a cover chosen this way is kept. In the demo, Ruby's
iPhone is the folder `/archive/cameras/ruby-iphone`:

```bash
# in EiN's terminal
ln -sf /archive/albums/wellington-christmas-2025/IMG_0650.HEIC /archive/cameras/ruby-iphone/coverPhoto
```

To go back to the automatic cover, remove the link with `rm /archive/cameras/ruby-iphone/coverPhoto`
and run `camera-cover /archive/cameras/ruby-iphone`.

## If something goes differently

| What you see                                                                                                                                                                                                | Why                                                                                                                                              | What to do                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The viewer shows only a make and model where the camera's name should be.                                                                                                                                   | The camera is not registered, or the picture was read while linking was not running.                                                             | Register it from **Unregistered**, or click **Link existing media** on its page.                                                                                                                            |
| A camera's **Media** tab says "Nothing is linked to this camera yet: no file carries its make and model or serial number. If files from it are missing, “Link existing media” on its Info tab looks again." | No file names this camera as the camera has it, or its files were read while linking was not running.                                            | Compare its **Make** and **Model** with the `Make` and `Model` in a picture's **Details**, and **Edit** them to match; saving links the files. Otherwise click **Link existing media** on the **Info** tab. |
| The **Media** tab says "Nothing is linked to this camera yet, and nothing can be: give it a serial number, or both a make and a model."                                                                     | The camera has no fingerprint.                                                                                                                   | **Edit** it and fill in **Make** and **Model** exactly as the files have them; saving links the files.                                                                                                      |
| **Link existing media** finds nothing, but pictures from the camera are missing from its page.                                                                                                              | The make or model differs from what the files say; the files are linked to another camera; or they name no camera at all.                        | Compare with the `Make` and `Model` in the viewer's **Details**. For files linked elsewhere or naming no camera, use `camera-relink --force` or `camera-link --camera` in the terminal.                     |
| Pictures from two people's phones are mixed up on one camera.                                                                                                                                               | The phones are the same model and write no serial number.                                                                                        | EiN cannot tell them apart. Link one person's pictures by hand with `camera-link --camera`.                                                                                                                 |
| A camera's pictures are some hours off.                                                                                                                                                                     | Its clock was set to another time zone.                                                                                                          | Set its **Timezone**; see [Clocks, time zones and scanners](#clocks-time-zones-and-scanners).                                                                                                               |
| A phone's videos are off by exactly its time zone.                                                                                                                                                          | The phone keeps video times in UTC.                                                                                                              | Turn on **Video times in UTC** for it.                                                                                                                                                                      |
| Scans are dated to the day they were scanned.                                                                                                                                                               | The scanner is not registered with **Scanner or digitizer**.                                                                                     | Register it with the setting on, or turn it on in **Edit camera**.                                                                                                                                          |
| Registering says `camera-create: /archive/cameras/…: already exists`.                                                                                                                                       | A camera with that name exists already. Punctuation such as an apostrophe is left out of the folder name, so `Davids 7D` and `David's 7D` clash. | Choose another name, or open the existing camera.                                                                                                                                                           |
| An album's map does not draw the route a phone recorded.                                                                                                                                                    | The phone's camera is not linked to its device.                                                                                                  | **Set device** on the camera's **Info** tab; see [A phone that records where it was](#a-phone-that-records-where-it-was).                                                                                   |
| **Edit**, **Link existing media**, **Add owner** or **Set device** is missing.                                                                                                                              | You may not change this camera.                                                                                                                  | Ask the person who registered it, or an administrator.                                                                                                                                                      |

## From the terminal

Each camera is a folder under `/archive/cameras`; `ls /archive/cameras` lists their names, and the
link to the device a camera is part of is its child `device`. The commands below are in the
[archive command reference](commands.md), and every one takes `--help`. Those that start with
`camera-` can also be typed as two words: `camera info` is `camera-info`.

| Task                                                             | Command                                                                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List the cameras                                                 | [`camera-list`](commands.md#camera-list)                                                                                                                      |
| List the cameras seen but not registered                         | [`camera-scan`](commands.md#camera-scan)                                                                                                                      |
| Find cameras by name, make, model or serial number               | [`search-camera`](commands.md#search-camera) `<words>`                                                                                                        |
| Which camera a make and model, or a serial number, is matched to | [`camera-match`](commands.md#camera-match) `--make <make> --model <model>`, or `--serial <serial>`                                                            |
| Register a camera                                                | [`camera-create`](commands.md#camera-create) `--name <name> --make <make> --model <model>`, with `--serial`, `--timezone`, `--digitizer` or `--quicktime-utc` |
| Change a camera's settings                                       | [`camera-update`](commands.md#camera-update) `<camera> --timezone <zone>`, or `--clear <field>`                                                               |
| Show a camera and its owners                                     | [`camera-info`](commands.md#camera-info) `<camera>`                                                                                                           |
| A camera's history                                               | [`camera-timeline`](commands.md#camera-timeline) `<camera>`                                                                                                   |
| Link the files a camera's fingerprint matches                    | [`camera-relink`](commands.md#camera-relink) `<camera>`; `--dry-run` reports first, `--force` takes files from another camera, `--all` does every camera      |
| Date a camera's files again by its settings, linking nothing     | `camera-relink <camera> --reapply`                                                                                                                            |
| Link files to a camera by hand                                   | [`camera-link`](commands.md#camera-link) `--camera <camera> <file or folder>…`                                                                                |
| Add an owner, or change the dates                                | [`camera-set-owner`](commands.md#camera-set-owner) `<camera> <person> --from <date> --to <date>`, with `--update` to change                                   |
| Remove an owner                                                  | [`camera-remove-owner`](commands.md#camera-remove-owner) `<camera> <person>`                                                                                  |
| Link a camera to the device it is part of, or take the link away | [`camera-device`](commands.md) `<camera> <device>`, or `<camera> --off`; a device is its name, its path under `/dev`, or a track of it                        |
| Bring a camera's automatic cover up to date                      | [`camera-cover`](commands.md#camera-cover) `<camera>`, or `--all`                                                                                             |
| The pictures a camera took                                       | [`search`](../reference/commands-core.md#search) `--subject camera:<camera> --kind photo`                                                                     |

Registering Jon's camera and making him its owner:

```bash
# in EiN's terminal
camera-create --name "Jon's X-Pro1" --make FUJIFILM --model X-Pro1 --timezone Pacific/Auckland
camera-set-owner /archive/cameras/Jons_X-Pro1 /archive/people/jon-wrenfield --from 2014
```

`camera-create` prints the camera's folder, `/archive/cameras/Jons_X-Pro1`, and how many files it
linked. See [Commands by task](tasks.md) for the rest of the archive's commands.

## Related pages

- [Trips](tracks.md): where phones and GPS trackers went, and their trips.
- [Dates and places of pictures](dates-places.md): how a picture's date, time zone and place are
  chosen.
- [Viewing photos, videos and recordings](viewer.md): the camera line in the details panel.
- [Albums](albums.md): the cameras on an album's **Info** tab.
