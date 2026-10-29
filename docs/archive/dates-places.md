# Dates and places of pictures

Every picture in EiN gets a date when anything can tell it one, and a place when it was taken with
GPS or someone gives it one. This page is for family members who fix when and where pictures were
taken: where EiN finds both, how to correct them, and what happens to scans and to pictures nobody
has dated.

## Where you see a picture's date and place

Open a picture in the viewer. On a computer the date and the place sit in the bar under the picture;
on a phone the date is centred over the top of the picture and the bar at the foot keeps the place.

- The date is written as precisely as it is known: "Saturday, 16 June 1956, 14:03:11" for a full
  time, "1975" for a picture known only to a year, "August 1968" for one known to a month. A picture
  with no date shows none.
- Point at the date for a tooltip. It names where the date came from (the time source), any note
  someone left with it, and the time in your own time zone when the picture was taken in another
  ("… your time").
- The place is the name of the location the picture is linked to, else its street address, else its
  city and country.

The details panel (**Details (i)**, or <kbd>i</kbd>; on a phone, swipe up) shows more. Its place
section has the location's name as a link, the street address and a small map with **Enlarge map**.
The **Details** fold at its foot holds **Taken at** (the date exactly as stored, with its time zone),
**Taken at (UTC)** and **Time source**. [Viewing photos, videos and recordings](viewer.md) covers the
rest of the panel.

In an album the pictures are laid out in sections by day. One known only to a year sits under a
heading with only the year; one with no date comes after the dated ones, under **Undated**. A
person's, location's or device's **Media** tab lists undated pictures after the rest too. The Media
feed lists pictures by date, so it leaves out a picture that has none.

## Which date a picture gets

EiN looks at up to five sources for a picture's date and takes the first one that has it. The
**Time source** says in words which one it was.

![A ladder of five date sources, the first with a date winning, each with the words Time source shows: set by hand, a sidecar or Google Photos, GPS time, the camera's clock and the file name, then Undated; beside the last three, a box for scans, whose GPS time, camera clock and file name are ignored, so a scan waits for a person's date](../diagrams/dates.svg "The first source on the ladder that has a date decides; a scan waits until a person gives it one")

| Order | Source                     | Time source reads               | What it is                                                                                                                        |
| ----- | -------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Set by hand                | entered by hand                 | A date someone gave with **Set time** or `file-set-time`. It always wins, and it may be as vague as a year.                       |
| 2     | A sidecar or Google Photos | from Google Photos or a sidecar | A date a photo editor or scanning program wrote into an XMP sidecar, or a date someone changed in Google Photos before exporting. |
| 3     | GPS                        | from GPS                        | The GPS receiver's clock, the one source that knows the exact moment.                                                             |
| 4     | The camera's clock         | from the camera clock           | The date and time the camera or phone wrote into the file, or a video's recording time.                                           |
| 5     | The file name              | from the file name              | A date the name spells, such as `IMG_20190601_123456.jpg`, for files from a staging category whose names count as dates.          |

When none of them has a date, the picture is undated. EiN never dates a picture by when it was
uploaded or when the file was last changed.

A **sidecar** is a small file beside a picture that says things about it: the JSON Google Photos
writes for each photo of a Takeout export, or the `.xmp` file a photo editor writes. EiN pairs
sidecars with their pictures as they arrive in staging, in every kind of category but Messaging and
Screenshots. [Getting your photos in](importing.md) and [Supported files](file-types.md) say which
names it understands.

A few rules decide the close cases:

- **A GPS time far from the camera's clock is ignored.** More than 26 hours apart, the GPS time is
  taken for an old position the receiver kept reporting, and the camera's clock dates the picture.
- **Google Photos' time counts as a person's date only when it differs.** More than 26 hours from
  the camera's clock (or, for a picture without one, from when it was uploaded to Google), it is a
  date someone set there, and it comes second on the ladder. Closer than that, it is Google's
  reading of the camera's clock: the picture keeps the camera's time, Google's time tells EiN which
  time zone the clock was in, and **Time source** reads "from Google Photos or a sidecar". A GPS time
  still comes first then, and a camera that recorded its own time zone keeps "from the camera
  clock".
- **File names count only where a staging category says so**, and only the names a phone, a
  messenger, a screenshot tool or a desktop uploader writes. A name that dates a picture before 1995
  is not believed, and a scanner's running number such as `IMG_20190601_0001.jpg` is no date.
- **A scanner's clock never dates a picture** once the scanner is registered as a device with
  **Scanner or digitizer** turned on (see [Devices and GPS tracks](devices.md)). A GPS time in the
  file still counts.

## Date scans of old prints and slides

A scanner writes the day of the scan into the file, and a scanning app on a phone adds where the
scan was made. Neither says when the picture was taken. When files arrive in a staging category of
the kind **Scans**, EiN marks them as scans and sets aside the scanner's clock, the GPS time and
position, the file name, and a Google Photos time that agrees with them. A scan is dated only by a
date a person gives it: with **Set time**, with `file-set-time`, in an XMP sidecar, or by changing
it in Google Photos. Until then it is undated, rather than dated to the day it was scanned.

**Time source** on a scan adds "a scan: its scanner’s clocks are not when it was taken". The mark
goes with the file when it is filed into an album, so the scan stays undated there until someone
dates it.

To bring in a box of scans:

1. Open the **Create** menu (the plus in the top bar) and choose **Import media**.
2. Under **Into which category?**, choose your Scans category, or **New category** with **What it
   holds** set to **Scans** and a name under **Called**, such as "Box 3".
3. Press **Choose files** or **Choose a folder**, then **Upload**, which shows the number of files.

Scans that already arrived in the Inbox can be moved: on the Inbox's **Files** tab, open the
folder's ⋯ menu, choose **Move to category…**, pick the Scans category and press **Move here**. EiN
dates the moved files again by the scans' rules, in the background. [Sorting in staging](staging.md)
explains categories and the Files tab.

> [!NOTE]
> A scan uploaded straight into an album, or copied into one over SFTP, is not marked: no staging
> category's rules apply there. For those, register the scanner as a device with **Scanner or
> digitizer** turned on. Saving that setting re-dates the files already linked to it and says
> "Removed scanner dates from N linked files."

Helen Okafor scanned the family's slides of "Cornwall, summer 1968" in March 2012. Uploaded into a
Scans category, they wait undated until she gives them a date. Uploaded straight into an album
from an unregistered scanner, they would all show March 2012.

In a Scans category the **Sort** tab keeps the scans in runs, by folder and file name, under
**To sort**, dated or not. Once most of a run has dates set by hand, its name gains their years, and
a run splits where two neighbouring scans were given different years.

## Time rules of staging categories

Each staging category has two time rules, which come with its kind (**What it holds**): whether its
files are scans, and whether a date in a file name counts.

| What it holds        | Treated as scans | File names count as dates |
| -------------------- | ---------------- | ------------------------- |
| Inbox                | no               | yes                       |
| Google Photos export | no               | no                        |
| Scans                | yes              | no                        |
| Phone                | no               | yes                       |
| Camera               | no               | no                        |
| Messaging            | no               | yes                       |
| Screenshots          | no               | yes                       |
| Other                | no               | no                        |

- Files that move into a category with other rules are dated again by that category's rules, in the
  background. A move within a category, or between two with the same rules, changes nothing.
- **Category settings** has no switch for the two rules. Changing **What it holds** there resets
  them, together with the category's other settings, to those of the kind you chose.
- In the terminal, `staging category <name> --digitized on|off` and
  `staging category <name> --filename-dates on|off` change one rule and date the category's files
  again before they answer.
- A date set by hand outranks both rules.

## Give pictures that need a date a date

Staging shows what has no date. A category's card on the Staging overview, and the strip above the
category's tabs, has a bar whose **Needs a date** part counts the pictures read without a date. On
the category's **Sort** tab, the **Needs a date** lane holds groups of undated pictures, named like
"Undated · Peggy's shoebox", and groups of pictures dated only to a year or a month, named like
"1987 · Peggy's shoebox". In a Scans category the scans stay in their runs under **To sort**
instead, as described above.

1. Open **Staging**, then the category, then its **Sort** tab.
2. Choose **Needs a date** in the row of lanes above the groups. The row appears when more than one
   lane has groups, each lane with its number of groups.
3. Open a group: click it, or move to it with <kbd>J</kbd> and <kbd>K</kbd>.
4. Press <kbd>T</kbd>, or open the group's ⋯ menu and choose **Set the time…**. To date only some of
   its pictures, select them first; <kbd>T</kbd> then sets the time of those.
5. In the **Set time** dialog, set **Start time** and the order (see the next section), then press
   **Set time on N files**. A picture dated only to a year or a month keeps that date unless you
   click its row first (see the next section), so a group named like "1987 · Peggy's shoebox"
   needs a click on each row you want to date.

EiN confirms with "The time is set on N photos of “<group>”". Within a few minutes the organizer
puts the pictures into groups by the dates you gave them: an event, a trip, or a year's
**Everyday** lane. On a phone there are no keys; tap the group and use its ⋯ menu.

You can also file a **Needs a date** group as it is, undated, with **New album…**, **Add to album…**
or the other decisions of the Sort tab. Its proposal is the category's album when the category has
one; otherwise there is none.

Pictures already in the library have no lane. An album lists its undated pictures last, under
**Undated**: select them there and use **Set time**. In the [terminal](../shell/terminal.md),
`search --undated` lists everything undated in the library that you may see.

## Set the time of several pictures at once

**Set time** is in the selection bar that appears when you select pictures: on an album page, the
Media page, a person's, location's or device's **Media** tab, and the **Files** tab in staging. On a
narrow screen it is under **Actions**. It is offered only when you may change every selected
picture. In staging's **Sort** tab, <kbd>T</kbd> opens the same dialog.

The dialog is titled **Set time**, with the number of files under it.

- **Order** decides which picture comes first: **Current time** (the default; earliest first,
  undated last), **Name** (by file name, `IMG_2` before `IMG_10`) or **Manual**. Drag a row by the
  grip at its left to reorder; dragging switches to **Manual**.
- **Start time** is the time the first row gets. It starts at the earliest date in the batch, or at
  today's date and time when none of the pictures has one.
- Each row shows the picture, its name, its current date or "No date", and after the arrow the time
  it will get.

The times are worked out from the top:

1. The first row gets **Start time**.
2. Each following row gets the time of the row before it plus the gap between their current times.
   Where either of the two has no date, or your order puts a later picture before an earlier one,
   the gap is one minute. Pictures taken in the same second stay in the same second.
3. Changing a row's time pins it: that row keeps your time and the rows after it follow on from it.
   The round arrow at the end of a pinned row ("Unpin — follow the row above again") lets it follow
   the row above again.
4. A picture known only to a year or a month keeps its date. Its row reads "<date> — unchanged",
   with the tooltip "Keeping this date as it is. Give it a time to replace it.", and the rows after
   it follow the last row that took a time. Click it to give it a full time instead.

Press **Set time on N files**. Each picture's date becomes one entered by hand, with the time of day
included, also for a picture that was known only to the day. Albums holding the pictures update
their date range.

> [!WARNING]
> The dialog shows and writes times in your browser's time zone. For a picture taken in another
> time zone, such as on a trip abroad, the time after the arrow can differ by some hours from its
> current date before you change anything. Compare the rows before you press **Set time on N files**.

Some ways to use it:

- **The camera's clock was wrong**, an hour behind after a trip or never set at all: select that
  camera's pictures, keep **Current time**, and set **Start time** to the right time of the first
  picture. The others move by the same amount and keep their spacing.
- **Scans of an album, in page order**: select them, choose **Name**, and set **Start time** to the
  day. They spread a minute apart in scan order, so they stay in that order everywhere.
- **Undated pictures where you know the time of some**: set **Start time**, then change the rows
  whose time you know. The rows between follow on from them.
- **One picture**: select only that one.

## Give a picture a vague date

A date can be as vague as it really is: a year ("1975"), a month ("August 1968") or a day. EiN keeps
it that way and never adds a day or an hour nobody knew. The **Set time** dialog writes full times
only, so a vague date is given in the [terminal](../shell/terminal.md) with `file-set-time`.

1. Open the picture in the viewer and open the details panel.
2. Open the **Details** fold at its foot and click the path under **Path**. A terminal tab opens,
   standing in the picture itself, so `.` names the picture.
3. Type `file-set-time`, the picture and the date:

   ```bash
   # in EiN's terminal, opened from Path
   file-set-time . 1968-08
   ```

   EiN answers with the date the picture has and where it came from:

   ```text
   /archive/albums/Cornwall, summer 1968/scan0004.jpg: 1968-08 (manual)
   ```

The date can be `1968`, `1968-08`, `1968-08-14`, `1968-08-14T15:30` or `1968-08-14T15:30:00`, and
the last two may end in a time zone, `+01:00` or `Z`. The year must lie between 1826 and next year;
anything else is refused with "file-set-time: not a capture time: <value>".

More forms, run in the folder that holds the pictures (`cd ..` from the picture):

```bash
# in EiN's terminal, in the album's folder
file-set-time scan0004.jpg 1968-08 scan0005.jpg 1968-08 --note "Peggy remembers the August heatwave"
for f in scan00*.jpg; do file-set-time "$f" 1968; done
file-set-time --clear scan0004.jpg
```

- Several pictures go in one call as pairs of picture and date. If one date is wrong or one picture
  is missing, nothing is written.
- `--note` keeps a reason with the date. It shows beside the time source, in the date's tooltip and
  under **Time source**.
- `--clear` takes away a date set by hand, and its note. The picture falls back to the next source
  on the ladder, or to no date. The web interface has no button for this.

## Time zones

A picture is shown at the time on the clock the photographer was reading. A photograph taken at noon
in Wellington reads 12:00, whoever looks at it; when your own time zone differs, the date's tooltip
adds the same moment in yours ("… your time").

EiN works out the time zone of a picture from:

- the time zone the camera recorded in the file, as many phones do;
- the difference between the GPS time and the camera's clock, rounded to whole hours;
- the difference between Google Photos' time and the camera's clock, for a picture from a Takeout;
- the **Timezone** of the registered device that took it, which knows the summer time of the year
  the picture was taken in.

A picture none of these places carries no time zone. It is shown at the camera's time without a
"your time" line, and EiN reads it in the archive's own time zone, which is the time zone of the
machine EiN runs on (`TZ`, under
[Environment variables](../reference/environment.md#set-by-the-deployment)).

When a camera's pictures come out hours off:

- **The camera's clock was set to another zone**, for one bought abroad or kept on home time during
  a trip: give the camera's device the **Timezone** its clock was set to. For a registered camera,
  open its page, press **Edit** and set **Timezone**; saving re-dates the pictures linked to it and
  says "Re-dated N linked files." Register an unregistered one from the **Devices** page with its
  **Timezone**, then press **Link existing media** on its page, which links its pictures and updates
  their dates. [Devices and GPS tracks](devices.md) has the details.
- **A phone's videos are off by exactly its time zone**: turn on **Video times in UTC** for that
  phone. Phones keep their videos' recording time in UTC.
- **The clock was wrong by some amount**: use **Set time** as described above.

A time from the **Set time** dialog carries no time zone and is read in the archive's time zone, so
a picture from a trip abroad that you re-time loses its "your time" line. In the terminal you can
give the zone with the time:

```bash
# in EiN's terminal, in the album's folder
file-set-time DSCF0412.JPG 1996-02-03T14:30+13:00
```

## Where a picture's place comes from

A picture gets its place from the first of these that has one:

1. A place set by hand, with **Set location**, in **Edit file** or with `file-set-position`. It
   replaces anything the file carries, and EiN reading the file again never puts the GPS position
   back over it.
2. The GPS position in the file.
3. The place in its sidecar: an XMP sidecar's, or a Google Photos Takeout's.

A scan's own GPS position is where it was scanned, so EiN ignores it, and a Takeout's place for a
scan too, unless someone set that place in Google Photos.

**Street addresses.** EiN looks up each picture's position once in OpenStreetMap's Nominatim
service, which turns coordinates into a street address. Only the coordinates are sent, never the
picture. The address shows in the place section of the details panel, and in the viewer's bar when
the picture is linked to no location. It can arrive a while after the picture: Nominatim answers
one question a second, and a lookup that fails is asked again later.

**Locations.** When a picture gets a position, EiN links it to the location whose shape contains the
point, the nearest one when several do. A shape is a circle or a polygon drawn for the location, or
the circle a location gets from its address or from its pictures. A location that is only a point,
because coordinates were typed or clicked when it was created, contains nothing, so no picture joins
it by itself. When a location's shape changes, the library's pictures inside it are linked to it and
those left outside are let go. The link gives the picture the location's name in the viewer and puts
it on the location's **Media** tab. A link someone made by hand, or one brought in from an older
archive, is never replaced. [Locations and the map](places.md) shows how to draw a location's shape.

A device's GPS track is drawn beside the pictures on the map and on an album's **Map** tab. EiN does
not use it to give pictures a position.

## Set the place of pictures

1. Select the pictures in a grid: an album, the Media page, your favourites, a person's,
   location's or device's **Media** tab, the pictures behind a pile on the map, or the **Files** tab
   in staging.
2. Press **Set location** in the selection bar. It is offered only when you may change every
   selected picture.
3. The dialog asks "Where was this taken?", or "Where were these taken?" for several. Choose the
   place in one of two ways:
   - Under **A known location** ("Pick one, or click the map"), pick a location. The list holds the
     locations that have a place on the map, and picking one moves the point to it.
   - Under **On the map** ("Click where it was taken, or type the coordinates."), click the map, or
     type **Latitude** and **Longitude**.
4. Press **Set location**. EiN confirms with "Location set on N files".

The hint at the foot of the dialog says what happens: "This replaces whatever position the files
carry, for the map and for searching by location." Picking a known location gives the pictures that
location's point. They are linked to the location, and show its name, when the point lies inside
its circle or polygon.

## Change or clear the place of one picture

1. Open the picture in the viewer and open the details panel.
2. Click the pencil at the top of the panel and choose **Edit**. The **Edit file** dialog opens, with
   **Description** and the labels on one side and the place on the other, starting at the picture's
   point.
3. To move the point, pick under **A known location**, click the map under **On the map**, or type
   **Latitude** and **Longitude**. The hint reads "The new location replaces the position the file
   carries, for the map and for searching by location."
4. To take the place away, press **Clear location**. The hint reads "The file will have no location,
   for the map or for searching by location."
5. Press **Save**.

The pencil menu has **Edit** when you may change the picture. **Clear location** removes the point,
whether the GPS or a person put it there, and the picture's link to a location, however it was
made. EiN reads a file's GPS position when it takes the file in, so the picture stays without a
place. To clear several pictures at once, use `file-set-position` with `--clear` in the terminal.

## In the terminal

The [terminal](../shell/terminal.md) does the same work with commands, and some of it only there:

| Task                                                          | Command                                                                                        |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Give pictures a date, as vague as it is                       | [`file-set-time`](commands.md#file-set-time) `<file> <date> [<file> <date> …] [--note <text>]` |
| Take away a date set by hand                                  | `file-set-time --clear <file>…`                                                                |
| List what is undated in the library                           | [`search`](../reference/commands-core.md#search) `--undated`                                   |
| Set the place of pictures                                     | [`file-set-position`](commands.md#file-set-position) `<file>… --lat=<n> --lng=<n>`             |
| Clear the place of pictures                                   | `file-set-position <file>… --clear`                                                            |
| Link a picture to a location by hand                          | `ln -s -f /archive/locations/<location> '<file>/location'`                                     |
| Look up a picture's street address again, as an administrator | [`geocode-position`](commands.md#geocode-position) `-f '<file>/position'`                      |
| Date a staging category's files again by its rules            | [`staging`](commands.md#staging) `retime [<category>]`                                         |
| Change a category's time rules                                | `staging category <name> --digitized on\|off` or `--filename-dates on\|off`                    |

Write a negative coordinate with `=`, as in `--lng=-5.066`: on its own, `-5.066` would be read as an
option.

```bash
# in EiN's terminal, in the album's folder
file-set-position P1000412.JPG P1000413.JPG --lat=50.153 --lng=-5.066
```

```text
Set location 50.153,-5.066 on /archive/albums/Peggy's Falmouth/P1000412.JPG
Set location 50.153,-5.066 on /archive/albums/Peggy's Falmouth/P1000413.JPG
```

## When something goes differently

- **A scan shows the day it was scanned.** It did not arrive in a Scans category, and its scanner is
  not registered as one. Give it its date with **Set time**, which outranks the scanner's clock; move
  its folder into a Scans category while it is still in staging; or register the scanner with
  **Scanner or digitizer**.
- **A picture has a date you did not expect.** Look at **Time source** under **Details**. "from the
  file name" means its category reads dates from names; "from the camera clock" with a wrong year
  means the camera's clock was wrong.
- **All pictures from one camera are some hours off.** Set the device's **Timezone**, or for a
  phone's videos turn on **Video times in UTC**, as described under
  [Time zones](#time-zones).
- **Set time is not in the selection bar.** You may not change every selected picture: select only
  pictures you may change, or ask whoever owns the others. Your favourites and the pictures behind a
  pile on the map do not offer **Set time** at all; select the pictures in their album instead.
- **The times after the arrow in Set time are hours off before you change anything.** The pictures
  were taken in another time zone than your browser's; see the warning under
  [Set the time of several pictures at once](#set-the-time-of-several-pictures-at-once).
- **The street address still names the old street after you moved the point.** EiN looks up an
  address once per picture and does not look again when the point moves. An administrator can look
  it up again in the terminal with `geocode-position -f '<file>/position'`.
- **A picture is on the map but has no street address.** The lookup has not run yet, or the machine
  EiN runs on cannot reach `nominatim.openstreetmap.org`. It is asked again later.
- **The picture is not linked to the location you picked.** That location is a single point, which
  contains nothing. Draw a circle or a polygon for it, as
  [Locations and the map](places.md) describes, and the pictures inside join it.
- **The picture still names its old location after you moved it.** Its link was made by hand, and
  EiN never replaces such a link. In **Edit file**, press
  **Clear location** and **Save**, then open **Edit file** again and set the point.
- **`file-set-time` answers "not a capture time".** Write the date as `YYYY`, `YYYY-MM`,
  `YYYY-MM-DD`, `YYYY-MM-DDTHH:MM` or `YYYY-MM-DDTHH:MM:SS`, with a year from 1826 to next year.
