# Tracks and trips

A track is a route something travelled, kept as GPS positions with their times: a boat's summers,
a car's drives, a walker's hikes. EiN draws tracks on its maps, cuts each one into trips, says where
the trips stayed and what the weather was, and makes a trip an album. This page is for family
members and administrators who bring tracks in, correct them and make albums of their trips. What
took the pictures is on [Cameras](cameras.md).

## Where tracks come from

A track is a node of the type `track`, anywhere under `/archive`. It gets its positions from a GPS
tracker or a phone that posts where it is, or from the GPX files a GPS logger or a tracking app
saved:

- **A tracker, or a phone posting its position.** With the [Automation](../automation/index.md)
  module, a member of the `automation` group makes a device by hand with a position, and its
  position's history is the track: `device-create Sailboat --position` makes
  `/archive/devices/sailboat/position/history` (see
  [Devices made by hand](../automation/index.md#devices-made-by-hand)). A phone with Traccar Client
  then adds its position as it moves; that is turned on on the device's page (see
  [Live tracking from a phone](../automation/index.md#live-tracking-from-a-phone)).
- **A GPS logger whose files you import.** It is a device made the same way. Its GPX files go into
  its track by [Upload GPX](#upload-a-gpx-file-to-a-track) on the track's page, by
  [staging](#gpx-files-in-staging) or with `track-import`.

Without the Automation module, a track can still be made in the terminal with core's
`mknode -t track`, under any folder of `/archive` you may write in.

A track is named by its own label, or else by the device it belongs to: the sailboat's track is
called Sailboat. A phone that takes pictures as well is a [camera](cameras.md) too, and linking the
camera to its track ties the two together (see
[A phone that records where it was](cameras.md#a-phone-that-records-where-it-was)).

## The Tracks page

Open **Tracks** in the sidebar, under **Browse**.

- The header counts the tracks (**N tracks**). The filter box (**Filter tracks…**) matches the name
  and description as you type.
- **Sort** offers **Name (A-Z)** (the default) and **Last recorded**, the track that recorded most
  lately first. Your choice is remembered in this browser.
- Each card shows the track's name, its description, the days it was recorded over, and badges for
  how it travels (**Boat**, **Car**, **Bike** or **On foot**) and how many positions it holds.
  Pointing at a card shows the track's path. Click a card to open the [track's page](#a-tracks-page).

When there is no track, the page says **No tracks yet**: "Where a GPS tracker, a phone or a GPX
file says something travelled: a boat, a car, a hike. A tracker's history is one, kept with its
device."

## A track's page

Click a card on the Tracks page. A track's page also opens from **Track and trips** on an
automation device's **Overview**, from **Track** on a camera's **Info** tab, from a live track on
the Map page, and from an album's **Info** and **Trip** tabs. The page's address is `/tracks/` and
the track's path, encoded, such as `/tracks/%2Farchive%2Fdevices%2Fsailboat%2Fposition%2Fhistory`,
and a tab other than **Track** adds `?tab=trips` or `?tab=info`.

For those who may change the track, the header's corner has **Upload GPX**, **Share** and **Edit**;
on a phone they are under ⋮. Who may change it is what its **Share** dialog shows and sets (see
[Sharing](../guide/sharing.md)).

| Tab       | What it shows                                                                                |
| --------- | -------------------------------------------------------------------------------------------- |
| **Track** | The page opens here: the route on a map (see [The route on the map](#the-route-on-the-map)). |
| **Trips** | The trips found in the route, newest first (see [Trips](#trips)).                            |
| **Info**  | How the track travels, its home bases and its description (see below).                       |

On the **Info** tab:

- **Track** lists **Travels as** (or "Not set (read as a car)"), **Timezone** (**UTC** when none is
  set), how many **Positions** it holds, the days it was **Recorded** over, such as
  "12 Jun 2025 – 3 Aug 2025", and its **Path** in the tree.
- **Home bases**, where arriving ends a trip (see [Home bases](#home-bases)).
- **About** shows the description, when there is one.

## How a track travels

A track moves as a boat, a car, a bike or on foot. Its **Travels as** setting, **Boat**, **Car**,
**Bike** or **On foot**, says which, and so which units it is shown in: a boat's distances in
nautical miles and its speeds in knots, everyone else's in kilometres and km/h. It also says what
lying still looks like when the track is drawn (see [The route on the map](#the-route-on-the-map)):
a boat lies still within 80 m for 15 minutes, a car or a bike within 50 or 30 m for 10 minutes,
someone on foot within 25 m; and a jump faster than 50 knots, 250, 100 or 40 km/h is a GPS error. A
track without the setting is read as a car. A phone's track, carried on a sailing holiday and in the
car alike, is best left as it is, and a tracker that stays on the boat set to **Boat**.

Its **Timezone** is the time zone its trips are cut into days in: a day ends at midnight there, and
the times of its trips are on that clock. A track without one has its days in UTC.

To change them:

1. On the track's page, click **Edit**. The **Edit track** dialog opens.
2. Choose **Travels as**: "How it travels, which tells its stops from drift and its trips from
   rests. A boat’s track is shown in knots and nautical miles, the others’ in km/h and km."
3. Choose **Timezone**, "The zone its trips are cut into days in.", from a list of time zones you
   can type in, such as `Europe/Stockholm`. Clear it for UTC.
4. Write a **Description** if you like, and click **Save**.

A changed **Travels as** or **Timezone** finds the track's trips again from the start.

## Home bases

A track's home bases are the places it belongs: the boat's home berth and winter yard, the house
where the car is parked. Arriving at one ends a trip. **Home bases** on the track's **Info** tab
lists them, each linking to its location, under the line "Where it belongs: a home berth, a winter
yard, the house. Arriving at one ends a trip."

- Click **Add home base**, choose a location in the list (**Pick a location**), and click **Add**. A
  place that is not a location yet is added on the **Locations** page first (see
  [Locations and the map](places.md)).
- Click the cross beside a home base to remove it.

While a track has no home bases of its own, the homes of the owners of the cameras that record into
it count instead: each place an owner lived while they owned the camera, for the years both are true
(see [A phone that records where it was](cameras.md#a-phone-that-records-where-it-was) and
[Homes and residents](family.md#homes-and-residents)). It then says "None set, so the homes of the
owners of its cameras count:" and lists them with those years, such as "2010 – 2020". With no such
home either, it says "None set, and no owner of a camera that records into it has a home recorded."
As soon as the track has one home base of its own, the owners' homes no longer count.

Adding and removing are offered to those who may change the track, and each finds the track's trips
again from the start.

## The route on the map

A track shows on its page's **Track** tab, on the **Map** page with its **Tracks** layer (see
[Locations and the map](places.md)), and on the **Map** tab of an album whose dates it falls in,
when it is on the album's list: a camera that took some of the album's pictures records into it, or
it was added to the album (see [Choose which tracks the map shows](albums.md#choose-which-tracks-the-map-shows)).
A GPS tracker takes no pictures, so add its track to the albums of the trips it was carried on.

The **Track** tab draws the route on a map that fills the window below the tabs, each day in its
own colour, as an album's **Map** tab does: opening it shrinks the header down to its row of tabs,
so the mouse wheel over the map zooms it. A panel floats over the foot of the map with what the
route adds up to:

| Figure        | What it is                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Points**    | How many recorded positions the track holds, without those EiN rejected (see below).                                                                                                                                             |
| **Days**      | On how many days it recorded.                                                                                                                                                                                                    |
| **Distance**  | The length of the route, added up day by day, so the gap between one day's end and the next day's start is not counted. In nautical miles for a boat, in kilometres otherwise (see [How a track travels](#how-a-track-travels)). |
| **Avg speed** | The average speed while it moved, in knots for a boat and km/h otherwise. Time lying still, jumps nothing could make, and gaps of more than an hour between two points are left out.                                             |
| **Duration**  | The time from the first point to the last, in hours and minutes. It includes the time between trips, so a track that holds several trips shows the whole span.                                                                   |

While a tracker lies still, its GPS keeps wandering: around a berth or a parking space it records a
tangle of positions, now and then one far out that it never went to. EiN draws neither. Where the
track stayed in one place, at walking pace or slower, the line ends on the middle of where it lay
and later leaves from there, and a position it could not have reached so fast is left out, unless
you accepted it (see [Reject or accept a position by hand](#reject-or-accept-a-position-by-hand)).
What counts as staying and as too fast follows its **Travels as** setting (see
[How a track travels](#how-a-track-travels)). The **Points** figure still counts every recorded
position, while **Distance** leaves the wandering out. The **Map** page and an album's **Map** tab
draw tracks the same way.

A GPS can also be wrong for longer than one position. A receiver that loses most of its
satellites can draw a smooth route hundreds of kilometres away for minutes, and a phone that loses
its fix falls back to a position a cell or a network gave it, sometimes the same one over and
over. EiN keeps every position it is given, and as it adds them to a track it rejects such runs:

- a stretch the track jumps out to and back from, faster than anything on the ground or the water
  goes (over 600 km/h for more than a kilometre), within two hours;
- a position it jumps back onto exactly, to the last decimal, after being away from it longer than
  it was there.

A rejected position is not drawn, counted in **Points** or used for trips. A jump that does not come
back, as when a logger starts again somewhere else, keeps its positions, and the line is broken
there instead of drawn across. A route flown with the logger on is neither: every one of its steps
is fast. The same rules apply however the positions arrive: a GPX file uploaded or staged, or a
phone tracking live. `track-read --rejected` reads the rejected positions too, marked, and
`track-read --only-rejected` reads them alone.

A long track is drawn from a thinned copy, and its distance then comes out a little shorter than
the route really was.

EiN draws a track on the maps; it does not use it to give a position to pictures that have none.
To place those, see [Dates and places of pictures](dates-places.md#where-a-pictures-place-comes-from).

A track with no positions yet says **Nothing recorded yet**: "Its route appears here once a GPX file
it was recorded in is uploaded, or its tracker reports where it is.", with **Upload GPX** under it
for those who may change it.

### Reject or accept a position by hand

The rules can be wrong both ways: a glitch they miss stays on the map, and a real stretch they
reject, such as a flight with the logger off that lands near where it left, is left out. On the
**Track** tab the rejected positions are drawn faintly in red, each with a dot, and the panel over
the map says how many there are. Click near a position, drawn or rejected, and the panel says when
it was recorded and what EiN made of it. If you may change the track, it also offers:

- **Reject**, on a drawn position: it is left out, whatever the rules say, and so are the other
  drawn positions within 40 m of it that day (the day in UTC, as the track colours it). A point on
  the drawn line often stands for several positions recorded close together, and one taken away
  would let the next take its place. The panel says how many there are, and the button reads
  **Reject all** and the number. Over 25 is a place the track stayed at, not a glitch, and then
  **Reject** takes the one position alone.
- **Accept**, on a rejected one: it is drawn, whatever the rules say. When it is one of a run of
  rejected positions, **Accept all** takes the whole run.
- **Undo**, on a position you rejected or accepted: it goes back to what the rules make of it.
- **Undo all N that day**, on a position you rejected, when you rejected others that day: every
  position rejected by hand that day goes back to the rules. Positions you accepted stay accepted.

A position rejected by hand is left out before the rules judge the positions around it, so the
line can break somewhere else once it is gone. The track's trips are found again ten minutes
later, as when points arrive. To do the same for a time span, use `track-mark` with `--reject`,
`--accept` or `--clear`:

```bash
# in EiN's terminal
track-mark sailboat --from 2025-07-01T13:00:00Z --to 2025-07-01T15:30:00Z --accept
```

`--from` and `--to` are both optional: without them the whole track is marked, so
`track-mark sailboat --clear` hands every position back to the rules. `--near <lat,lng>` marks
only the positions within 40 m of a point (`--within` sets another distance in metres), and
`--marked reject` or `--marked accept` only those you rejected or accepted. **Undo all N that day**
is this:

```bash
# in EiN's terminal
track-mark sailboat --from 2025-07-01T00:00:00Z --to 2025-07-02T00:00:00Z --marked reject --clear
```

### Live positions

A tracker or a phone that posts its position as it moves adds it to its track as it comes (see
[Live tracking from a phone](../automation/index.md#live-tracking-from-a-phone)). While its last
point is under four hours old, a **Live** line tops the panel with its speed in km/h and how long
ago that point was taken ("12 km/h · 40 s ago"). The map then draws a pin where it is now and
extends the route as points arrive. Click **Follow**, the crosshair at the end of that line, and the
map keeps the newest point in view until you drag it. The **Map** page follows live tracks the same
way; see [Follow a track live](places.md#follow-a-track-live).

## GPX files

A GPX file is the format GPS trackers and tracking apps save routes in. EiN reads the recorded track
points of the file, each with its time; points with a time the track already has are not added
twice, so bringing the same file in again changes nothing. A point without a time is left out, since
EiN cannot tell when the track was there.

EiN keeps every GPX file it reads into a track in the track's `routes` folder, such as
`/archive/devices/sailboat/position/history/routes/`, and the track links each one from its own
`sources` folder. The same file brought in twice, byte for byte, is kept once.

### Upload a GPX file to a track

If you know which track a file belongs to, upload it on that track's page:

1. Open the track's page. **Upload GPX** is in the header's corner; on a phone it is under ⋮.
2. Click **Upload GPX** and choose one or more `.gpx` files. The file picker offers GPX files
   only.
3. Wait for the message: "N new points added to the track", or "The track already had every point
   in it", followed by "; N without a time left out" when some were. A file that cannot be added
   gets a message of its own, starting with its name; the others are added all the same.

The button is offered to those who may change the track. The file is kept with the track under its
own name, in its `routes` folder.

### GPX files in staging

A GPX file that arrives in your staging area, by **Import media**, the Media page's **Upload** or
copying over SFTP (see [Getting your photos in](importing.md)), is not treated as a picture. EiN
reads which track the file names and adds the route to that track; the file then moves out of
staging into the track's `routes` folder.

The file names its track in its `creator` attribute or in one of its `<name>` entries. It matches a
track when one of these holds, as whole words, the track's name, or the name, the make and model
together, or the serial number of a camera that records into the track (see
[A phone that records where it was](cameras.md#a-phone-that-records-where-it-was)). Capital letters
and punctuation do not count, and a name shorter than three letters never matches. A file whose
creator reads `Apple iPhone 15` joins the track of the phone whose camera has the make `Apple` and
the model `iPhone 15`, and one named `Sailboat` joins the sailboat's track. Either of these places
counts:

```xml
<gpx version="1.1" creator="Apple iPhone 15">
  <metadata><name>Sailboat</name></metadata>
  <trk><name>Sailboat</name> …</trk>
</gpx>
```

A `<name>` inside a track point is a waypoint's label and does not count. Many apps write their
own name as the creator (`Track Logger 2.1`) and no track anywhere; such a file waits for you
to choose its track, as below.

When a file names no track, or more than one, it waits for you:

1. Open **Staging** in the sidebar. A yellow box titled **Needs you** says "1 GPX file waits for the
   track it belongs to." (or how many), whichever category the file was dropped on. The box is on
   the overview, not on a category's page.
2. Click **Choose track**. The page **Routes waiting for a track** opens, with your staging area's
   `routes` folder listed below its header as on the Nodes page, and a panel beside it.
3. Click a file to see in the panel what it says about itself: its **Name** and **Description**,
   its **Tracks**, its **Creator**, when it was **Recorded** (first and last point, in UTC, and how
   long between), its **Points**, its **Size**, and under **Matches** the tracks it names, or "no
   track it names". The arrow keys move from file to file.
4. Select the files of one track: <kbd>Ctrl</kbd> and click adds or removes one, <kbd>Shift</kbd>
   and click takes a run of them, <kbd>Ctrl</kbd>+<kbd>A</kbd> takes them all. On a phone, press and
   hold a file, then tap the others. At the top of the panel, choose the track in the
   **Track they belong to** list and click **Import** (**Import 3 files** with three selected). Each
   route joins that track and its file moves out of the list into the track's `routes` folder. A
   file that cannot be read stays, and the panel names it and why. **Back to staging** returns to
   the staging page.

On a narrow screen the panel is below the list.

In the terminal, [`gpx-info`](commands.md#gpx-info) says the same of any GPX file without importing it:
`gpx-info /home/<you>/staging/routes/*.gpx`.

If the track does not exist yet, make it first (see [Where tracks come from](#where-tracks-come-from))
and open the page again; a waiting file is not tried again by itself. Waiting files are kept in your
staging area's `routes` folder, `/home/<you>/staging/routes/`. [Sorting in staging](staging.md)
describes the staging area.

## Trips

EiN cuts a track into trips by itself, and the track's **Trips** tab lists them, newest first. A
trip runs from where the track lay still to where it lay still again:

- Arriving at one of the track's [home bases](#home-bases) ends a trip, once it has been there
  half an hour or the track ends there. Passing by does not.
- Staying anywhere else longer than three days ends a trip too (two days for a bike or on foot), as
  does a gap of that long with no points at all.
- A trip that never gets 500 m from where it started is not a trip, and is left out.

How near a place has to be to count as the same place depends on
[how the track travels](#how-a-track-travels): within 1 km for a boat, 500 m for a car, 300 m
for a bike and 200 m on foot.

Each trip's card shows its dates, an **Ongoing** badge while it has not ended and its last point
is less than two days old, how many days it took, its length, how far from its start it got, and
where it started and ended: the location of the stay, such as a harbour, an island or your home, or
"a point on the way". The farthest place it stayed at is named too. Click a name to open its
location. How stays get their locations and names is on
[Places a track stayed at](places.md#places-a-track-stayed-at). A stay of two hours or more across
midnight is an overnight stay; it does not end the trip. A trip that is an album names it under
**Album**; see [Make a trip an album](#make-a-trip-an-album).

Click **N legs** to see the trip day by day: each day's date, its first and last time, its length,
and where the day ended. A day's length runs from where the day before ended, so a drive across
midnight counts, and the days add up to the trip's length. Days follow the track's **Timezone**, so
a day ends at midnight there, and the times are on that clock; a track without one has its days and
times in UTC.

The trips are kept up to date as the track grows: ten minutes after points arrive, EiN finds them
again from where the last finished trip ended, puts the new stays at locations, and, unless weather
lookups are turned off, gives each trip and day the weather along the track, which an album made of
the trip shows ([The Trip tab](albums.md#the-trip-tab)). Changing how the track travels, its time
zone or its home bases finds them again from the start. **Find trips again** does it at once.

When the track has no trips, the tab says **No trips**: "Nothing in the track went 500 m or more
from where it started.", or, before they were ever looked for, "Trips are found in the track once it
has fixes, and kept up to date as it grows.", with **Find trips** for those who may change the track.

### Join and part trips

EiN may end a trip where you do not: a weekend at home in the middle of a holiday, or a long wait
for weather in a harbour. Those who may change the track can correct it:

- **Join to the trip before**, on a trip's card, makes it and the trip before it one trip,
  whatever ended the first. The card then says **Joined on** and the day, with **Part again** to
  undo it.
- **Start a trip here**, beside a day in a trip's legs, makes that day the first day of a trip of
  its own. **Join to the trip before** on the new trip undoes it.

The trips are found again at once. The changes are kept with the track, in its `tripEdits`
setting, and hold when the trips are found again later.

### Move a trip to another track

A trip recorded into the wrong track, such as a phone posting the sailboat's trip into the car's
track, can be moved to the right one. Those who may change the track click **Move to track…** on the
trip's card, pick the track under **Track** in **Move the trip to another track** ("Its positions,
first to last, leave this track for the other, and the trips of both are found again."), and click
**Move**. The list holds every other track. Positions you rejected or accepted by hand keep that.

The positions recorded where the trip began and ended stay, as does any GPX file the trip was read
from, in this track's `routes` folder. To move another stretch, use `track-move` with the time
span:

```bash
# in EiN's terminal
track-move ruby-iphone sailboat --from 2025-07-01T06:00:00Z --to 2025-07-03T18:00:00Z
```

A position at the very same moment as one the other track has already is dropped, and the other
track keeps its own.

### Make a trip an album

A trip EiN finds is only a proposal until you make it an album. Those who may change the track see,
on each trip's card:

- **New album…**, which opens **Create Album** to ask what the album is called. The name starts as
  the farthest place the trip stayed at when that place has a name; the trip's dates are the
  album's span, not part of its name. **Create** makes the album in `/archive/albums` and opens it.
- **Put in an album…**, which opens **Put the trip in an album**. Before you type, it offers the
  albums whose dates overlap the trip and whose map draws this track (see
  [Choose which tracks the map shows](albums.md#choose-which-tracks-the-map-shows));
  their number keys pick them. Type part of a name to find any album you may change, or type a new
  name and press **New album “…”** to make an album of the trip under that name. Choosing an album
  makes it the trip's. An album that already holds another trip is refused with a message saying
  so.

Either way the track is added to the album's tracks, so its Map tab draws the route, and the album
spans the trip even before it has any pictures. The card then names the album under **Album**, with
**Take off the album** to undo it; the album and its pictures stay, and so does the track on its
list. A trip is one album's, and an album holds one trip. Each time the trips are found again, or
their stays put at locations, the album follows: it grows while the trip is ongoing, and its stays
get their locations.

The album gets a **Trip** tab: the days, the distance in the track's units, where it stayed, and
each day's notes. See [The Trip tab](albums.md#the-trip-tab). Those who may only look at the track
see the albums the trip may belong to under **Maybe in**.

## If something goes differently

| What you see                                                                      | Why                                                                                                                         | What to do                                                                                                                                                                   |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The **Trips** tab says **No trips** though the track has positions.               | Its trips have not been found yet, or no part of the track went 500 m or more from where it started.                        | Click **Find trips**, or **Find trips again**.                                                                                                                               |
| A trip ends at home in the middle of a holiday, or two trips should be one.       | Arriving at a home base, or staying somewhere longer than three days, ends a trip.                                          | Click **Join to the trip before** on the second trip's card.                                                                                                                 |
| A trip's days end at the wrong hour.                                              | The track's **Timezone** is not set, so its days are cut in UTC, or it is set to another zone.                              | **Edit** the track and choose the **Timezone** its days belong in.                                                                                                           |
| A trip is listed under the wrong track.                                           | The phone or tracker that recorded it posted into another track, or its GPX file was uploaded to the wrong track.           | Click **Move to track…** on the trip's card; see [Move a trip to another track](#move-a-trip-to-another-track).                                                              |
| **Edit**, **Upload GPX** or **Add home base** is missing.                         | You may not change this track.                                                                                              | Ask whoever made it, or an administrator, to share it with you.                                                                                                              |
| **Upload GPX** gives a message ending in "no track points found".                 | The file holds no recorded track points, only a planned route or waypoints.                                                 | Use the file that was recorded while it moved.                                                                                                                               |
| **Upload GPX** gives a message ending in "none of its N track points has a time". | The file's points carry no times: a route drawn on a map, or a file the program saved without them.                         | Use the file that was recorded while it moved, or export it again with times.                                                                                                |
| A GPX file dropped in staging waits, though its track exists.                     | The file names neither the track nor a camera that records into it, or it names more than one track.                        | Click **Choose track** under **Needs you** on the Staging page; see [GPX files in staging](#gpx-files-in-staging).                                                           |
| The phone reports nothing to the track.                                           | It cannot reach EiN over HTTPS from where it is, its link was replaced or turned off, or tracking is off in Traccar Client. | See [Live tracking from a phone](../automation/index.md#live-tracking-from-a-phone) and [Ports, HTTPS and remote access](../admin/network.md#phones-posting-their-position). |
| A GPX file sits in an album as an ordinary file.                                  | It was uploaded straight into the album, where GPX files are not read as routes.                                            | Upload it on the track's page, then delete the file from the album.                                                                                                          |

## From the terminal

Every track command takes a track by its path, or by a device or camera that has one, by its path or
its name: `sailboat` is `/archive/devices/sailboat/position/history`. A track's `routes` folder holds
the GPX files it was read from, its `homes` folder links its home bases, and its `.trips` keeps its
trips. The commands below are in the [archive command reference](commands.md), and every one takes
`--help`.

| Task                                                                | Command                                                                                                                                                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List the tracks, with their name, kind, positions and span          | [`track-list`](commands.md#track-list), or `track-list <folder>` for those in one folder                                                                                                                |
| Find tracks by name or description                                  | [`search-track`](commands.md#search-track) `<words>`                                                                                                                                                    |
| Change how a track travels                                          | [`track-update`](commands.md#track-update) `<track> --kind boat` (`car`, `bike`, `foot`), `--timezone <zone>` or `--description <text>`, or `--clear <field>`                                           |
| List a track's home bases                                           | [`track-home`](commands.md#track-home) `<track>`; with none of its own, the homes of its cameras' owners and the years they count                                                                       |
| Add or remove a home base                                           | [`track-home`](commands.md#track-home) `<track> --add <location>…` or `--remove <location>…`; a location is its path, or its folder name                                                                |
| Read a track as the maps draw it                                    | [`track-read`](commands.md#track-read) `<track> --still`; without `--still` every recorded position, `--max-speed <m/s>` to change what is too fast                                                     |
| Add a GPX file to a track                                           | [`track-stage`](commands.md#track-stage) `<gpx> --track <track>`, which moves the file to the track's `routes`, or [`track-import`](commands.md#track-import) `<track> <gpx>`, which keeps a copy there |
| Add a position by hand                                              | [`track-append`](commands.md#track-append) `<track> --lat=<lat> --lng=<lng> --ts <time>`                                                                                                                |
| See what GPX files hold, without importing                          | [`gpx-info`](commands.md#gpx-info) `<gpx>…`: name, tracks, creator, points and their time span, size, and the tracks each names                                                                         |
| List the GPX files a track was read from                            | [`source-list`](commands.md#source-list) `/archive/devices/sailboat/position/history`                                                                                                                   |
| Find a track's trips                                                | [`track-trips`](commands.md#track-trips) `<track>`, `--full` from the start, `--dry-run` to see them without keeping them                                                                               |
| List a track's trips                                                | [`trip-list`](commands.md#trip-list) `<track>`                                                                                                                                                          |
| Put a track's stays at locations, and name the new ones             | [`track-places`](commands.md#track-places) `<track>`; see [Places a track stayed at](places.md#places-a-track-stayed-at)                                                                                |
| Give a track's trips and days their weather                         | [`track-weather`](commands.md#track-weather) `<track>`, `--full` to look every trip up again, `--dry-run` to see what it would look up                                                                  |
| Join a trip to the one before, or part one                          | [`trip-edit`](commands.md#trip-edit) `<track> <trip> --merge`, or `<track> <day> --split`                                                                                                               |
| Make a trip an album, or take it off                                | [`trip-album`](commands.md#trip-album) `<track> <trip> --new`, `--album=<album>`, or `--detach`                                                                                                         |
| Reject or accept positions by hand, or hand them back to the rules  | [`track-mark`](commands.md#track-mark) `<track> --reject`, `--accept` or `--clear`, with `--from`, `--to`, `--near <lat,lng>` and `--marked reject`                                                     |
| Move a stretch of a track to another track                          | [`track-move`](commands.md#track-move) `<track> <to-track> --from <time> --to <time>`                                                                                                                   |
| Link a camera to the track it records into                          | [`camera-track`](commands.md#camera-track) `<camera> <track>`                                                                                                                                           |
| Put a track on an album's map, or take it off                       | [`album-track-add`](commands.md#album-track-add) and [`album-track-rm`](commands.md#album-track-rm) `<album> <track>…`; see [Albums](albums.md#in-the-terminal)                                         |
| Turn live tracking from a phone on, or replace or turn off its link | `device-tracker <device>`, with `--new` or `--off`, from the [Automation](../automation/index.md#live-tracking-from-a-phone) module                                                                     |

Making Jon's GPS logger, saying he walks with it, and adding a route copied into your home folder:

```bash
# in EiN's terminal, as a member of automation
device-create "Jon's eTrex" --model "eTrex 30x" --position
track-update jon-s-etrex --kind foot --timezone Pacific/Auckland
track-stage "$HOME/tararua-walk.gpx" --track jon-s-etrex
```

`device-create` prints the track's path, `/archive/devices/jon-s-etrex/position/history`, and
`track-stage` moves the GPX file to its `routes` folder once its points are in the track. See
[Commands by task](tasks.md) for the rest of the archive's commands.

## Related pages

- [Automation](../automation/index.md): devices with a position, and live tracking from a phone.
- [Cameras](cameras.md): the phones and cameras that took the pictures, and the tracks they record
  into.
- [Locations and the map](places.md): the Map page and its Tracks layer, and the places trips
  stayed at.
- [Albums](albums.md): an album's **Map** and **Trip** tabs.
- [Getting your photos in](importing.md): every way files, GPX files among them, get into EiN.
- [Sorting in staging](staging.md): the staging area where waiting routes are.
