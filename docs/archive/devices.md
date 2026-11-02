# Devices and GPS tracks

A device is a camera, phone, scanner, camcorder or GPS tracker that took pictures or recorded
routes for your archive. This page is for family members and administrators who register devices,
say who owned them, set their clocks right and bring in GPS tracks.

## What registering a device gives you

EiN reads the camera's name out of every picture, but until the camera is registered as a device
that is all it knows: the viewer shows the make and model the file names, and nothing else. Once a
device is registered, the pictures it took are linked to it, and:

- the viewer's camera line names the device, links to its page and says who owned it (see
  [The details panel](viewer.md#the-details-panel));
- the device's page gathers everything it took, who owned it and when, and the route it recorded;
- an album's **Info** tab lists the devices that took its pictures, and its **Map** tab draws
  their routes (see [Albums](albums.md#the-info-tab)), and the Search page finds devices and narrows albums by them
  (see [Search and the finder](search.md#find-albums-people-locations-and-devices));
- the device's **Timezone**, **Scanner or digitizer** and **Video times in UTC** settings correct
  the dates of every picture it took;
- the GPS route it recorded, its track, is drawn on the maps.

## How EiN recognises a device

When a file arrives, EiN reads what the camera wrote into it: the make (the EXIF tag `Make`), the
model (`Model`) and, when the camera writes one, its serial number (`SerialNumber`,
`InternalSerialNumber` or `DeviceSerialNo`). Some camcorders write the make and model as
`DeviceManufacturer` and `DeviceModelName` instead. These three together are the file's
**fingerprint**, and EiN looks for the registered device that has the same one:

1. a device with the same serial number;
2. otherwise, a device with the same make and the same model.

The device's name plays no part. The make and model are compared exactly as the camera writes
them, so a device registered with the make `Nikon` does not match files that say
`NIKON CORPORATION`.

EiN does this when it first reads the file, and when you register the device: registering a camera
links the files that arrived before it. A make, model or serial number you change later links only
the files that arrive from then on; **Link existing media** on its page finds the rest (see
[Link the files a changed fingerprint matches](#link-the-files-a-changed-fingerprint-matches)).

Two things a fingerprint cannot do:

- **Tell two phones of the same model apart.** A serial number identifies one camera body; a make
  and model identify only a model line, and most phones write no serial number. If two people in
  the family have the same phone model, EiN cannot tell their pictures apart, and all of them are
  linked to one of the two devices.
- **Match a file that names no camera.** Many messaging apps remove the make and model from the
  pictures they send, and a file without them matches nothing. You can link such files by hand in
  the terminal (see [From the terminal](#from-the-terminal)).

A device's fingerprint has nothing to do with the fingerprints EiN takes of the pictures themselves
to find copies; those are described in [Duplicates](duplicates.md).

## The Devices page

Open **Devices** in the sidebar, under **Browse**.

![The Devices page: the header "13 devices" with a filter box, Registered (13) and Unregistered, and the Name (A-Z) sort, above cards for David's 7D, David's camcorder, Erik's iPhone, Freya's Pentax, Helen's scanner and others, each with a picture, the make and model, and badges for the serial number, the time zone and "scanner"](../../assets/shots/devices.webp "Every registered device with the picture that stands for it; the badges show at a glance which ones carry a serial number, a time zone or the scanner setting.")

- The header counts the registered devices (**13 devices**). The filter box (**Filter devices…**)
  matches the name, make, model and serial number as you type.
- **Show** switches between **Registered (N)** and **Unregistered**, the cameras EiN has seen in
  the pictures that match no registered device.
- **Sort** offers **Name (A-Z)** (the default), **Name (Z-A)** and **Make / model**. Your choice is
  remembered in this browser. It has no effect on the unregistered list.
- Each card shows the device's cover, its name, its description or else its make and model, and
  badges: the serial number, the time zone, **scanner** and **video UTC**. Click a card to open the
  [device's page](#a-devices-page).

When nothing is registered yet, the page says **No devices registered yet**: "The cameras and
phones that took the pictures. Unregistered lists the ones the archive has already seen." with
**Show unregistered** and, when you are signed in, **New device**.

## Register a camera EiN has already seen

The quickest way to register a camera is from the pictures it took.

1. On the **Devices** page, choose **Show** → **Unregistered**. The first time in a visit, EiN looks
   through the files it has read for cameras that match nothing registered. The list reads:
   "Cameras found in the indexed media that match nothing in the registry. Registering one lets its
   photos be linked to it, and its timezone and owners apply."
2. Find the camera. Each card shows a suggested name (the model, with the make in front when the
   model does not start with it, such as `Canon EOS 7D` or `Panasonic DMC-TZ1`), the make and
   model, the serial number when there is one, and how many files it took (**N files**). The
   cameras with the most files come first.
3. Click **Register** on its card. The **Register Device** dialog opens with **Name**, **Make**,
   **Model** and **Serial number** filled in from the files.
4. Change **Name** to what the family calls the camera, such as `David's 7D`. Leave **Make**,
   **Model** and **Serial number** as they are: they are what the files are matched on.
5. Under **Timezone**, choose the time zone its clock was set to, and turn on
   **Scanner or digitizer** or **Video times in UTC** if they apply (see
   [Clocks, time zones and scanners](#clocks-time-zones-and-scanners)).
6. Click **Register**. The files the camera took are linked to it and dated by its settings, and
   the device's page opens. For a camera known only by its make and model this can take minutes in
   a large archive.

**Rescan** at the top of the unregistered list looks again, for instance after a large import.
When every camera is registered, the list says "Every camera the media names is registered (N files
matched)." With many unknown cameras it shows the most used ones and says "Only the most-used
cameras are listed; there are more."

### When a card says "registered as …, but unmatchable"

Sometimes a device with the camera's name already exists, but without the make, model or serial
number its files carry, so nothing is matched to it. Its card then has the badge
**registered as &lt;name&gt;, but unmatchable** and the button **Add fingerprint** instead of
**Register**, because registering would make a second copy of a camera EiN already knows.

Click **Add fingerprint**. EiN writes the make, model and serial number from the card into the
existing device and links the files they identify. When it is done, a message says
"Linked N files to &lt;name&gt;." or "&lt;name&gt; now carries the fingerprint, but no unclaimed
files matched it." This is quick for a camera with a serial number and slow for one known only by
its make and model, which can take minutes in a large archive.

The button is there only if you may change that device; otherwise the card has no button.

## Register a device by hand

Register a device by hand when EiN has not seen it in any picture yet: a GPS tracker, a scanner
before the scans arrive, or a camera whose files you are about to import.

1. Open the **Create** menu (the plus in the top bar) and choose **Device**, or click **New device**
   on an empty Devices page. The **Register Device** dialog opens.
2. Fill in the fields below. Only **Name** is required.
3. Click **Register**. The device's page opens. With a serial number, or both a make and a model,
   the files already in the archive that carry them are linked to it first.

| Field                    | What to enter                                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**                 | What the family calls it, such as `Helen's scanner`. The name also gives the device's folder in the tree, so two devices cannot have the same name. |
| **Make**                 | "As the camera writes it in exif: what files are matched on." For example `Canon`.                                                                  |
| **Model**                | "As the camera writes it in exif." For example `Canon EOS 5D Mark III`.                                                                             |
| **Serial number**        | "Tells one body apart, where make and model tell only the model." Optional.                                                                         |
| **Timezone**             | "The zone its clock was set to." Optional.                                                                                                          |
| **Scanner or digitizer** | "Its EXIF device dates describe digitisation, not when the photograph was taken."                                                                   |
| **Video times in UTC**   | "Its videos keep their recording time in UTC, as phones do."                                                                                        |

To copy the make and model exactly, open a picture the camera took in the viewer and open
**Details** at the foot of the details panel. Among the EXIF tags it lists are `Make`, `Model` and,
when the camera writes one, `SerialNumber` (see [The Details section](viewer.md#the-details-section)).

A device without a serial number and without both a make and a model is never matched to any file.
Its page says so: "No serial and no make/model — nothing is matched to this device automatically;
`device-link --device` links files to it by hand."

Anyone signed in can register a device. Changing it afterwards, with the buttons this page
describes, is offered to whoever may change it, which the device's **Share** dialog shows and sets
(see [Sharing](../guide/sharing.md)).

## A device's page

Click a card on the Devices page, or the device's name in the viewer. The page's address is
`/devices/` and the device's folder name, such as `/devices/Jons_eTrex`, and a tab other than
**Info** adds `?tab=` with the tab's name, such as `?tab=track`.

![The page of Ruby's iPhone: a banner picture, the owner Ruby Wrenfield, "75 files · 2025–2026", the tabs Info, Timeline, Media, Track and Owners, the Settings card with Make Apple, Model iPhone 15 and Timezone Pacific/Auckland, the Link existing media card, and the Current owners card](../../assets/shots/device.webp "A device's page opens on its settings, with the button that links the pictures a changed fingerprint matches.")

Under the name, the header shows the current owners (up to three, then "and N more"), how many
files the device took and in which years, such as **75 files · 2025–2026** (**N+ files** when
counting stopped at its limit), and the device's labels. For those who may change the device, the
corner has **Share** and **Edit**, and the ⋮ menu has **Add event** and **Move to trash**. On a
phone they are all under ⋮.

| Tab          | What it shows                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Info**     | The page opens here. The **Settings** card lists Make, Model, Serial number, Timezone, **Travels as**, "Capture dates: Scanner dates suppressed" for a scanner, "Video times: UTC", and the description; with nothing but a name it says "Nothing recorded beyond the name." Below it, **Link existing media**, and beside it **Current owners** with **All owners**, and **Home bases** (see [Home bases](#home-bases)). |
| **Timeline** | The device's history: when each owner started and stopped using it, the events written on it, and the albums holding pictures it took.                                                                                                                                                                                                                                                                                    |
| **Media**    | Every file linked to the device, by date. Select pictures to act on them from the selection bar, for example **Add to album** or **Set time** (see [The selection bar](albums.md#the-selection-bar)).                                                                                                                                                                                                                     |
| **Track**    | The route the device recorded (see [A device's track](#a-devices-track)).                                                                                                                                                                                                                                                                                                                                                 |
| **Owners**   | Everyone who has owned it, with the dates (see [Say who owned a device](#say-who-owned-a-device)).                                                                                                                                                                                                                                                                                                                        |

The **Media** tab is the place to correct a camera whose clock was wrong: select its pictures and
use **Set time**, as [Dates and places of pictures](dates-places.md#set-the-time-of-several-pictures-at-once)
describes.

**Move to trash** sends the device to your trash, and the message's **Undo** brings it back (see
[Your profile, favourites and trash](../guide/profile.md)).

## Link the files a changed fingerprint matches

Files are linked to their device when EiN first reads them and when the device is registered. A
device whose make, model or serial number you change later leaves the files already in the archive
that carry the new ones unclaimed.

1. Open the device's page. The **Info** tab opens.
2. Click **Link existing media**. The card explains: "Files are linked to their device when it is
   registered and when they are indexed. A make, model or serial number changed afterwards leaves
   the files it now matches unclaimed; this finds them by fingerprint and attaches them."
3. Wait for the message, such as "Linked 412 files and updated dates on 37.", or "Nothing new to
   link or update — every matching file already has this device policy."

Linking also dates the files again by the device's settings, which is what "updated dates" counts.
Files that are already linked to another device are left with it.

The card is shown only to those who may change the device, and only when the device has a serial
number or both a make and a model. A device with a serial number is linked quickly; one known only
by its make and model can take minutes in a large archive.

## Change a device's settings

1. On the device's page, click **Edit**. The **Edit device** dialog opens.
2. Change what you need: **Name**, **Make**, **Model**, **Serial number**, **Timezone** (a list of
   time zones you can type in, such as `Pacific/Auckland`), **Travels as** (see
   [How a device travels](#how-a-device-travels)), **Scanner or digitizer**,
   **Video times in UTC**, **Description** and **Labels**.
3. Click **Save**.

A changed **Timezone**, **Scanner or digitizer** or **Video times in UTC** re-dates every file
already linked to the device, and the page says "Re-dated N linked files.", or "Removed scanner
dates from N linked files." when you turned the scanner setting on.

A changed **Make**, **Model** or **Serial number** decides only which files arriving from then on
are linked to the device. Click **Link existing media** afterwards to link the files already in
the archive.

## Clocks, time zones and scanners

Three settings tell EiN how to read a device's dates. Each one applies to every file linked to the
device, and changing it re-dates them.

- **Timezone**: the time zone the camera's clock was set to. A camera's clock writes a time without
  a zone, and EiN reads it in this zone, with the summer time of the year the picture was taken.
  A zone the camera wrote into the file itself comes first. Without a **Timezone**, EiN uses the
  archive's own time zone. Set it for a camera bought abroad, or one left on home time during a
  trip: Helen's Coolpix stayed on London time when she took it to Wellington, and with its
  **Timezone** set to `Europe/London`, EiN reads its clock as London time and gets the moment of
  each picture right.
- **Scanner or digitizer**: the device's clock records when a file was scanned, not when the
  photograph was taken, so EiN does not date pictures by it. Pictures with no other date stay
  undated until someone gives them one. Files brought in through a staging category of the kind
  **Scans** are treated as scans whatever device made them; this setting matters for scans uploaded
  straight into an album, copied in over SFTP, or already in the library.
- **Video times in UTC**: phones keep their videos' recording time in UTC. Turn this on for a phone
  whose videos come out off by its time zone.

[Dates and places of pictures](dates-places.md#time-zones) explains how EiN chooses a picture's date
and time zone, and [Date scans of old prints and slides](dates-places.md#date-scans-of-old-prints-and-slides)
how scans are dated.

## Say who owned a device

A device can have several owners over the years. The viewer lists them under the camera's name,
each with the dates, such as **Owned by** Ruby Wrenfield (2023–), so you can tell whose camera it
was when a picture was taken.

1. On the device's page, open the **Owners** tab: "Who has owned &lt;name&gt;, and when."
2. Click **Add owner**.
3. Under **Person**, choose the person.
4. Fill in **From** and **To** as a year, a month or a day: `2005`, `2005-06` or `2005-06-20`. Leave
   **To** empty while they still own it, and leave both empty if you do not know the dates.
5. Click **Add owner**.

The list shows the current owners first, then the earlier ones, with their dates: "2019 – 2023",
"since 2019", "until 2023", or "dates unknown". A current owner with a start date has the badge
**current**. Use the pencil beside an owner to change the dates (**Save changes**), and the bin to
remove them; EiN asks "Remove &lt;person&gt; as an owner of &lt;device&gt;?" before it does.

An owner without a **To** date counts as a current owner, in the page's header and on the
**Info** tab's **Current owners** card. Dated ownership appears on the **Timeline** tab, as
"&lt;person&gt; started using &lt;device&gt;" and "&lt;person&gt; stopped using &lt;device&gt;". A
date that is not a year, month or day is refused with a message ending in "is not a date
(YYYY[-MM[-DD]])".

## How a device travels

A device that records a track moves as a boat, a car, a bike or on foot. Its **Travels as** setting,
**Boat**, **Car**, **Bike** or **On foot**, says which, and so which units its track is shown in: a
boat's distances in nautical miles and its speeds in knots, everyone else's in kilometres and km/h.
A device without the setting is shown as a car. Set it in the **Edit device** dialog (see
[Change a device's settings](#change-a-devices-settings)); a phone carried on a sailing holiday is
best left as it is, and a tracker that stays on the boat set to **Boat**.

## Home bases

A device's home bases are the places it belongs: the boat's home berth and winter yard, the house
where the car is parked. Arriving at one ends a trip. The **Home bases** card on the **Info** tab
lists them, each linking to its location.

- Click **Add home base**, choose a location in the list, and click **Add**. A place that is not a
  location yet is added on the **Locations** page first (see [Locations and the map](places.md)).
- Click the cross beside a home base to remove it.

While a device has no home bases of its own, its owners' homes count instead: each place an owner
lived while they owned the device, for the years both are true (see
[Say who owned a device](#say-who-owned-a-device) and [Homes and residents](family.md#homes-and-residents)). The card then says
"None set, so its owners' homes count:" and lists them with those years, such as "2010 – 2020". As
soon as the device has one home base of its own, the owners' homes no longer count.

Adding and removing are offered to those who may change the device.

## Write something on a device's timeline

To keep a story with a device, such as where it was bought or when it broke, add an event:

1. On the device's page, open the ⋮ menu and choose **Add event**.
2. Fill in **Date** (such as `2005-06-15`) and **Description** ("What happened"). Both are needed.
   **Written by** is you unless you choose someone else.
3. Click **Add event**.

The event appears on the device's **Timeline** tab. Events are described in full in
[Family tree, events and homes](family.md).

## The device's cover

The picture on a device's card and behind its page's header is its cover: the newest picture linked
to it, by the date it was taken. The cover moves on by itself as newer pictures are linked. A device
that took only videos, such as a camcorder, gets the poster frame of its newest video once that
video has been processed; recordings are never used. The card of a device with no pictures shows
a placeholder with its initials.

The Web UI has no button to choose a device's cover. In the terminal you can link a picture
as the device's `coverPhoto` yourself, and a cover chosen this way is kept. In the demo, Ruby's
iPhone is the folder `/archive/devices/ruby-iphone`:

```bash
# in EiN's terminal
ln -sf /archive/albums/wellington-christmas-2025/IMG_0650.HEIC /archive/devices/ruby-iphone/coverPhoto
```

To go back to the automatic cover, remove the link with `rm /archive/devices/ruby-iphone/coverPhoto`
and run `device-cover /archive/devices/ruby-iphone`.

## A device's track

The route a GPS-capable device recorded is its track. It shows on the device's **Track** tab, on
the **Map** page with its **Tracks** layer (see [Locations and the map](places.md)), and on the
**Map** tab of an album whose dates it falls in, when the device is one of the album's: it took
some of the album's pictures, or was added to the album (see
[Choose which devices' routes the map shows](albums.md#choose-which-devices-routes-the-map-shows)).
A GPS tracker takes no pictures, so add it to the albums of the trips it was carried on.

The **Track** tab draws the route on a map, each day in its own colour, and adds it up:

| Figure            | What it is                                                                                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Points**        | How many recorded positions the track holds.                                                                                                                                                                                       |
| **Days**          | On how many days it recorded.                                                                                                                                                                                                      |
| **Distance**      | The length of the route, added up day by day, so the gap between one day's end and the next day's start is not counted. In nautical miles for a boat, in kilometres otherwise (see [How a device travels](#how-a-device-travels)). |
| **Average speed** | The average speed while it moved, in knots for a boat and km/h otherwise. Time lying still, jumps no device could make, and gaps of more than an hour between two points are left out.                                             |
| **Duration**      | The time from the first point to the last, in hours and minutes. It includes the time between trips, so a track that holds several trips shows the whole span.                                                                     |

Under the figures are the times of the first and the last point. A long track is drawn from a
thinned copy; the line then ends with "drawn from a thinned copy of the track", and the distance
comes out a little shorter than the route really was.

Under them, **Read from** lists the GPX files the track was read from, with their sizes. Click one
to download it. EiN keeps every GPX file it reads into a track, in the device's `routes` folder
(`/archive/devices/<device>/routes/`), and the track links each one from its own `sources` folder.
The same file brought in twice, byte for byte, is kept once.

While the device is sending its position as it moves, and its last point is under four hours old,
a **Live** card sits above the map with its speed in km/h and how long ago that point was taken
("12 km/h · 40 s ago"). The map then draws a pin where the device is now and extends the route as
points arrive. Click **Follow**, the crosshair on the card, and the map keeps the newest point in
view until you drag it. The **Map** page follows live devices the same way; see
[Follow a device live](places.md#follow-a-device-live).

A device with no route says **This device has recorded no track**.

EiN draws a track on the maps; it does not use it to give a position to pictures that have none.
To place those, see [Dates and places of pictures](dates-places.md#where-a-pictures-place-comes-from).

### Upload a GPX file to a device's track

A GPX file is the format GPS trackers and tracking apps save routes in. If you know which device
recorded a file, upload it on that device's page:

1. Open the device's page and the **Track** tab.
2. Click **Upload GPX** and choose one or more `.gpx` files.
3. Wait for the message: "N new points added to the track", or "The track already had every point
   in it".

The button is offered to those who may change the device. EiN reads the recorded track points of
the file, each with its time; points with a time the track already has are not added twice, so
uploading the same file again changes nothing. The file is kept with the device under its own name
and listed under **Read from**.

### GPX files in staging

A GPX file that arrives in your staging area, by **Import media**, the Media page's **Upload** or
copying over SFTP (see [Getting your photos in](importing.md)), is not treated as a picture. EiN
reads which device the file says recorded it and adds the route to that device's track; the file
then moves out of staging into the device's `routes` folder, and is listed under **Read from**.

The file names its device in its `creator` attribute or in one of its `<name>` entries. It matches a
registered device when one of these holds, as whole words, the device's name, its make and model
together, or its serial number. Capital letters and punctuation do not count. A file whose creator
reads `Garmin eTrex 30x` joins the device with the make `Garmin` and the model `eTrex 30x`; in the
demo, Ruby's tracks say `Apple iPhone 15` and join Ruby's iPhone. Either of these places counts:

```xml
<gpx version="1.1" creator="Garmin eTrex 30x">
  <metadata><name>Garmin eTrex 30x</name></metadata>
  <trk><name>Garmin eTrex 30x</name> …</trk>
</gpx>
```

A `<name>` inside a track point is a waypoint's label and does not count. Many apps write their
own name as the creator (`Track Logger 2.1`) and no device anywhere; such a file waits for you
to choose its device, as below.

When a file names no registered device, or more than one, it waits for you:

1. Open **Staging** in the sidebar. A yellow box titled **Needs you** says "1 GPS track waits for the
   device that recorded it." (or how many), whichever category the file was dropped on. The box is
   on the overview, not on a category's page.
2. Click **Choose device**. The page **Routes waiting for a device** opens, with your staging
   area's `routes` folder listed below its header as on the Nodes page, and a panel beside it.
3. Click a file to see in the panel what it says about itself: its **Name** and **Description**,
   its **Tracks**, its **Creator**, when it was **Recorded** (first and last point, in UTC, and how
   long between), its **Points**, its **Size**, and the **Devices named** in it, when it names more
   than one. The arrow keys move from file to file.
4. Select the files that one device recorded: <kbd>Ctrl</kbd> and click adds or removes one,
   <kbd>Shift</kbd> and click takes a run of them, <kbd>Ctrl</kbd>+<kbd>A</kbd> takes them all. At
   the top of the panel, choose the device in the **Device that recorded them** list and click
   **Import** (**Import 3 files** with three selected). Each route joins that device's track and its
   file moves out of the list into the device's `routes` folder. A file that cannot be read stays,
   and the panel names it and why. **Back to staging** returns to the staging page.

On a narrow screen the panel is below the list.

In the terminal, [`gpx-info`](commands.md#gpx-info) says the same of any GPX file without importing it:
`gpx-info /home/<you>/staging/routes/*.gpx`.

If the device is not registered yet, register it first (see
[Register a device by hand](#register-a-device-by-hand)) and open the page again; a waiting file is
not tried again by itself. Waiting files are kept in your staging area's `routes` folder,
`/home/<you>/staging/routes/`. [Sorting in staging](staging.md) describes the staging area.

### Live tracking from a phone

A phone can add its position to a device's track as it moves, with the free
[Traccar Client](https://www.traccar.org/client/) app for Android and iPhone. The app keeps
reporting with the screen off and sends what it recorded out of signal once it is back. A GPS
tracker that posts its position over HTTP, in the OsmAnd protocol or as a GPRMC sentence, can use
the same address.

1. Open the device's page and the **Track** tab. Under the route is **Live tracking from a phone**.
2. Click **Turn on**. EiN gives the device a track if it has none, and shows a QR code and the
   server URL.
3. On the phone, install Traccar Client, open its settings and scan the QR code. It fills in the
   server URL and, as the device identifier, the device's name.
4. Set how often it reports, for example every 30 seconds, and switch tracking on.

Open the device's page at the address the phone will reach EiN at: the QR code and the URL are
made from the address in your browser. The phone has to reach EiN there wherever it is, so EiN
must be reachable from the internet over HTTPS (see
[Ports, HTTPS and remote access](../admin/network.md#phones-posting-their-position)). The section
is offered to those who may change the device.

The address is the whole key: anyone who has it can add positions to the track, and nobody needs
to sign in to use it. The positions are added as the person who owns the track. The section shows
the same address again whenever you open it. If the address got out, click **New link**: the old
one stops working at once, and the phone has to scan the new QR code. **Turn off** stops the
address working and keeps the track.

## If something goes differently

| What you see                                                                                                                                                                                   | Why                                                                                                                                                      | What to do                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The viewer shows only a make and model where the camera's name should be.                                                                                                                      | The camera is not registered, or its make, model or serial number was changed after the picture arrived.                                                 | Register it from **Unregistered**, or click **Link existing media** on its page.                                                                                                                                             |
| A device's **Media** tab says "Nothing is linked to this device yet: no file carries its make and model or serial number. If they changed since it was registered, use “Link existing media”." | No file names this camera as the device has it, or its make, model or serial number was changed after its pictures arrived.                              | Click **Link existing media** on the **Info** tab.                                                                                                                                                                           |
| The **Media** tab says "Nothing is linked to this device yet, and nothing can be: give it a serial number, or both a make and a model."                                                        | The device has no fingerprint.                                                                                                                           | **Edit** it, fill in **Make** and **Model** exactly as the files have them, then click **Link existing media**.                                                                                                              |
| **Link existing media** finds nothing, but pictures from the camera are missing from its page.                                                                                                 | The make or model differs from what the files say; the files are linked to another device; or they name no camera at all.                                | Compare with the `Make` and `Model` in the viewer's **Details**. For files linked elsewhere or naming no camera, use `device-relink --force` or `device-link --device` in the terminal.                                      |
| Pictures from two people's phones are mixed up on one device.                                                                                                                                  | The phones are the same model and write no serial number.                                                                                                | EiN cannot tell them apart. Link one person's pictures by hand with `device-link --device`.                                                                                                                                  |
| A camera's pictures are some hours off.                                                                                                                                                        | Its clock was set to another time zone.                                                                                                                  | Set its **Timezone**; see [Clocks, time zones and scanners](#clocks-time-zones-and-scanners).                                                                                                                                |
| A phone's videos are off by exactly its time zone.                                                                                                                                             | The phone keeps video times in UTC.                                                                                                                      | Turn on **Video times in UTC** for it.                                                                                                                                                                                       |
| Scans are dated to the day they were scanned.                                                                                                                                                  | The scanner is not registered with **Scanner or digitizer**.                                                                                             | Register it with the setting on, or turn it on in **Edit device**.                                                                                                                                                           |
| Registering says `device-create: /archive/devices/…: already exists`.                                                                                                                          | A device with that name exists already. Punctuation such as an apostrophe is left out of the folder name, so `Davids 7D` and `David's 7D` clash.         | Choose another name, or open the existing device.                                                                                                                                                                            |
| **Edit**, **Link existing media**, **Add owner**, **Upload GPX** or **Live tracking from a phone** is missing.                                                                                 | You may not change this device.                                                                                                                          | Ask the person who registered it, or an administrator.                                                                                                                                                                       |
| **Upload GPX** gives a message ending in "no track points found".                                                                                                                              | The file holds no recorded track points, only a planned route or waypoints.                                                                              | Use the file the device recorded while it moved.                                                                                                                                                                             |
| The phone reports nothing to the track.                                                                                                                                                        | It cannot reach EiN at the address it was given, over HTTPS from where it is; the link was replaced or turned off; or tracking is off in Traccar Client. | Open the address in the phone's browser: a page saying `Forbidden` means the link is no longer the device's, so scan the new QR code. If it does not load at all, see [Ports, HTTPS and remote access](../admin/network.md). |
| A GPX file sits in an album as an ordinary file.                                                                                                                                               | It was uploaded straight into the album, where GPX files are not read as routes.                                                                         | Upload it on the device's **Track** tab, then delete the file from the album.                                                                                                                                                |

## From the terminal

Each device is a folder under `/archive/devices`; `ls /archive/devices` lists their names, its
route is the child `track`, and the GPX files the route was read from are in its `routes` folder. The commands below are in the
[archive command reference](commands.md), and every one takes `--help`.

| Task                                                                   | Command                                                                                                                                                                                                     |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List the cameras seen but not registered                               | [`device-scan`](commands.md#device-scan)                                                                                                                                                                    |
| Register a device                                                      | [`device-create`](commands.md#device-create) `--name <name> --make <make> --model <model>`, with `--serial`, `--timezone`, `--digitizer` or `--quicktime-utc`                                               |
| Change a device's settings                                             | [`device-update`](commands.md#device-update) `<device> --timezone <zone>` or `--kind boat` (`car`, `bike`, `foot`), or `--clear <field>`                                                                    |
| List a device's home bases                                             | [`device-home`](commands.md#device-home) `<device> list`; with none of its own, its owners' homes and the years they count                                                                                  |
| Add or remove a home base                                              | [`device-home`](commands.md#device-home) `<device> add <location>…` or `rm <location>…`; a device or location is its path, or its folder name                                                               |
| Show a device and its owners                                           | [`device-info`](commands.md#device-info) `<device>`                                                                                                                                                         |
| Link the files a device's fingerprint matches                          | [`device-relink`](commands.md#device-relink) `<device>`; `--dry-run` reports first, `--force` takes files from another device, `--all` does every device                                                    |
| Link files to a device by hand                                         | [`device-link`](commands.md#device-link) `--device <device> <file or folder>…`                                                                                                                              |
| Add an owner, or change the dates                                      | [`device-set-owner`](commands.md#device-set-owner) `<device> <person> --from <date> --to <date>`, with `--update` to change                                                                                 |
| Remove an owner                                                        | [`device-remove-owner`](commands.md#device-remove-owner) `<device> <person>`                                                                                                                                |
| Add a GPX file to a device's track                                     | [`track-stage`](commands.md#track-stage) `<gpx> --device <device>`, which moves the file to the device's `routes`, or [`track-import`](commands.md#track-import) `<device> <gpx>`, which keeps a copy there |
| Turn live tracking from a phone on, or replace or turn off its address | [`tracker-setup`](commands.md#tracker-setup) `<device>`, with `--new` or `--off`; `--origin https://<where EiN is>` adds the full URL and the QR code                                                       |
| See what GPX files hold, without importing                             | [`gpx-info`](commands.md#gpx-info) `<gpx>…`: name, tracks, creator, points and their time span, size, and the devices each names                                                                            |
| List the GPX files a track was read from                               | [`source-list`](commands.md#source-list) `/archive/devices/<device>/track`                                                                                                                                  |
| Bring a device's automatic cover up to date                            | [`device-cover`](commands.md#device-cover) `<device>`, or `--all`                                                                                                                                           |

Registering Jon's GPS tracker, making him its owner and adding a route copied into your home folder:

```bash
# in EiN's terminal
device-create --name "Jon's eTrex" --make Garmin --model "eTrex 30x" --timezone Pacific/Auckland
device-set-owner /archive/devices/Jons_eTrex /archive/people/jon-wrenfield --from 2021
track-stage "$HOME/tararua-walk.gpx" --device /archive/devices/Jons_eTrex
```

`device-create` prints the device's folder, `/archive/devices/Jons_eTrex`, and `track-stage`
moves the GPX file to `/archive/devices/Jons_eTrex/routes/` once its points are in the track. See
[Commands by task](../shell/commands.md) for the rest of the archive's commands.

## Related pages

- [Locations and the map](places.md): the Map page and its Tracks layer.
- [Dates and places of pictures](dates-places.md): how a picture's date, time zone and place are
  chosen.
- [Getting your photos in](importing.md): every way files, GPX tracks among them, get into EiN.
- [Sorting in staging](staging.md): the staging area where waiting routes are.
- [Viewing photos, videos and recordings](viewer.md): the camera line in the details panel.
