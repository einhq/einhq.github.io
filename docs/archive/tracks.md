# Trips

A device that travels, such as a phone, a GPS tracker on a boat or a logger carried on walks, keeps
where it was as a track: positions with their times. The Archive cuts the track into trips, says
where they stayed and what the weather was, draws the route on its maps, and makes a trip an album,
all on the device's **Trips** tab. This page is for family members and administrators who bring
routes in, correct trips and make albums of them. The devices themselves are EiN's own, on
[Devices](../guide/devices.md); what took the pictures is on [Cameras](cameras.md).

## Where tracks come from

A track is a device's endpoint of the type `track` under `/dev`: the `position` that EiN's `tracker`
driver keeps for a phone, a GPS tracker or a logger. Its positions come in two ways:

- **Posted as the device moves.** A phone with Traccar Client, or a tracker on a boat or in a car,
  posts its position to EiN with the device's key (see
  [Report from a phone](../guide/devices.md#report-from-a-phone)).
- **From GPX files** a logger or a tracking app saved: written to the device, uploaded on its
  **Trips** tab, or dropped in staging (see [GPX files](#gpx-files)).

A member of the `devices` group makes the device first, saying how it travels when it always travels
the same way:

```bash
# in EiN's terminal, as a member of devices
device-create Sailboat --driver tracker --class boat
device-create 'Ruby phone' --driver tracker --class phone
```

A track is named by its device's label: the sailboat's is called Sailboat. A phone that takes
pictures as well is a [camera](cameras.md) too, and linking the camera to its device ties the two
together (see [A phone that records where it was](cameras.md#a-phone-that-records-where-it-was)).

## The Trips tab

A device with a track has a **Trips** tab on its page, after **Overview**, **History** and **Info**.
Its address is the device's page with `?tab=archive.trips`, such as
`/devices/sailboat?tab=archive.trips`. An album's **Trip** tab and a track's entry on a timeline open
the device's page on it; a live track on the **Map** page, **Device** on a camera's **Info** tab and
a device in an album's **Info** tab open the device's page as it opens.

![The Trips tab of Erik's iPhone: Trips, Travel and Fixes at the top with Upload GPX, How it travels and Find trips again, "2 trips", and a card for each: 6 Aug 2025 – 10 Aug 2025, "3 days · 59.4 km · 17.3 km out at most", with 3 legs, and 22 Apr 2025, "1 day · 21.8 km · 12.8 km out at most", with 1 leg, each with New album… and Put in an album…](../../assets/shots/device-trips.webp "Each trip found in the track is a card, newest first, ready to become an album.")

At its top, **Trips**, **Travel** and **Fixes** choose what it shows:

| View       | What it shows                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| **Trips**  | The view it opens on: the trips found in the track, newest first (see [Trips](#trips))                  |
| **Travel** | How the device travels, its home bases and its description (see below)                                  |
| **Fixes**  | The route on a map, with the positions EiN left out (see [The route on the map](#the-route-on-the-map)) |

Those who may change the track also get **Upload GPX** and **How it travels** beside them. That is
the device's owner, whoever made it, and the administrator, who owns the devices a driver found;
[Devices and their keys](../admin/devices.md#who-may-do-what) says more.

On **Travel**:

- **Travel** lists **Travels as** (its own setting, or the device's class, such as "Boat (the
  device's class)", or "Not set (read as a car)"), **Timezone** (**UTC** when none is set), how many
  **Positions** it holds, the days it was **Recorded** over, such as "12 Jun 2025 – 3 Aug 2025", and
  its **Path** in the tree, such as `/dev/sailboat/position`.
- **Home bases**, where arriving ends a trip (see [Home bases](#home-bases)).
- **About** shows the description, when there is one.

## How a device travels

A device moves as a boat, a car, a bike or on foot, and that says which units its track is shown in:
a boat's distances in nautical miles and its speeds in knots, everyone else's in kilometres and km/h.
It also says what lying still looks like when the track is drawn (see
[The route on the map](#the-route-on-the-map)): a boat lies still within 80 m for 15 minutes, a car
or a bike within 50 or 30 m for 10 minutes, someone on foot within 25 m; and a jump faster than 50
knots, 250, 100 or 40 km/h is a GPS error.

How it travels is the track's **Travels as** setting, or, while that is not set, the device's class
when the class is `boat`, `car`, `bike` or `foot`. A track with neither is read as a car. A phone,
carried on a sailing holiday and in the car alike, is best left as it is, and a tracker that stays
on the boat made with `--class boat`.

Its **Timezone** is the time zone its trips are cut into days in: a day ends at midnight there, and
the times of its trips are on that clock. A track without one has its days in UTC.

To change them:

1. On the device's **Trips** tab, click **How it travels**. The **How it travels** dialog opens.
2. Choose **Travels as**: "How it travels, which tells its stops from drift and its trips from
   rests. A boat’s track is shown in knots and nautical miles, the others’ in km/h and km. Without
   one, the device’s class says it."
3. Choose **Timezone**, "The zone its trips are cut into days in.", from a list of time zones you
   can type in, such as `Europe/Stockholm`. Clear it for UTC.
4. Write a **Description** if you like, and click **Save**.

A changed **Travels as** or **Timezone** finds the track's trips again from the start, and so does a
changed class of its device while **Travels as** is not set.

## Home bases

A track's home bases are the places it belongs: the boat's home berth and winter yard, the house
where the car is parked. Arriving at one ends a trip. **Home bases** on the **Travel** view of the
device's **Trips** tab lists them, each linking to its location, under the line "Where it belongs: a home berth, a winter
yard, the house. Arriving at one ends a trip."

- Click **Add home base**, choose a location in the list (**Pick a location**), and click **Add**. A
  place that is not a location yet is added on the **Locations** page first (see
  [Locations and the map](places.md)).
- Click the cross beside a home base to remove it.

While a track has no home bases of its own, the homes of the owners of the cameras linked to its
device count instead: each place an owner lived while they owned the camera, for the years both are true
(see [A phone that records where it was](cameras.md#a-phone-that-records-where-it-was) and
[Homes and residents](family.md#homes-and-residents)). It then says "None set, so the homes of the
owners of its cameras count:" and lists them with those years, such as "2010 – 2020". With no such
home either, it says "None set, and no owner of a camera linked to the device has a home recorded."
As soon as the track has one home base of its own, the owners' homes no longer count.

Adding and removing are offered to those who may change the track, and each finds the track's trips
again from the start.

## The route on the map

A track shows on the **Fixes** view of its device's **Trips** tab, on the **Map** page with its
**Tracks** layer (see [Locations and the map](places.md)), and on the **Map** tab of an album whose
dates it falls in, when its device is on the album's list: a camera that took some of the album's
pictures is linked to the device, or the device was added to the album (see
[Choose which devices the map shows](albums.md#choose-which-devices-the-map-shows)). A GPS tracker
takes no pictures, so add it to the albums of the trips it was carried on. The device's own
**History** tab draws its positions too, for a day, a week, a month or a year
([Devices](../guide/devices.md#history)).

**Fixes** draws the route on a map that takes most of the window below the device's header, each day
in its own colour, as an album's **Map** tab does. A panel floats over the foot of the map with what
the route adds up to:

| Figure        | What it is                                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Points**    | How many recorded positions the track holds, without those EiN rejected (see below).                                                                                                                                               |
| **Days**      | On how many days it recorded.                                                                                                                                                                                                      |
| **Distance**  | The length of the route, added up day by day, so the gap between one day's end and the next day's start is not counted. In nautical miles for a boat, in kilometres otherwise (see [How a device travels](#how-a-device-travels)). |
| **Avg speed** | The average speed while it moved, in knots for a boat and km/h otherwise. Time lying still, jumps nothing could make, and gaps of more than an hour between two points are left out.                                               |
| **Duration**  | The time from the first point to the last, in hours and minutes. It includes the time between trips, so a track that holds several trips shows the whole span.                                                                     |

While a tracker lies still, its GPS keeps wandering: around a berth or a parking space it records a
tangle of positions, now and then one far out that it never went to. EiN draws neither. Where the
track stayed in one place, at walking pace or slower, the line ends on the middle of where it lay
and later leaves from there, and a position it could not have reached so fast is left out, unless
you accepted it (see [Reject or accept a position by hand](#reject-or-accept-a-position-by-hand)).
What counts as staying and as too fast follows how its device travels (see
[How a device travels](#how-a-device-travels)). The **Points** figure still counts every recorded
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
it was recorded in is uploaded, or the device reports where it is.", with **Upload GPX** under it for
those who may change it.

### Reject or accept a position by hand

The rules can be wrong both ways: a glitch they miss stays on the map, and a real stretch they
reject, such as a flight with the logger off that lands near where it left, is left out. On
**Fixes** the rejected positions are drawn faintly in red, each with a dot, and the panel over
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
[Report from a phone](../guide/devices.md#report-from-a-phone)). While its last
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

A GPX file goes to a device: written to it, `cat summer.gpx > /dev/sailboat` in the terminal, the
device's driver reads its points into the track (see [GPX files](../guide/devices.md#gpx-files) on
the Devices page). The Archive adds two ways, below, and keeps every GPX file it brings in in the
track's `routes` folder, such as `/dev/sailboat/position/routes/`, linked from the track's own
`sources` folder. The same file brought in twice, byte for byte, is kept once.

### Upload a GPX file to a device

If you know which device a file was recorded on, upload it on that device's page:

1. Open the device's **Trips** tab. **Upload GPX** is at its top, beside the views.
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
reads which device the file names and gives the route to that device; the file then moves out of
staging into the device's track's `routes` folder.

The file names its device in its `creator` attribute or in one of its `<name>` entries. It matches a
device when one of these holds, as whole words, the device's label, its manufacturer and model
together, or its serial number, or the name, the make and model together, or the serial number of a
camera linked to the device (see
[A phone that records where it was](cameras.md#a-phone-that-records-where-it-was)). Capital letters
and punctuation do not count, and a name shorter than three letters never matches. A file whose
creator reads `Garmin eTrex 30x` joins the device made with `--manufacturer Garmin --model 'eTrex 30x'`,
one whose creator reads `Apple iPhone 15` joins the phone whose camera has the make `Apple` and the
model `iPhone 15`, and one named `Sailboat` joins the sailboat. Either of these places counts:

```xml
<gpx version="1.1" creator="Apple iPhone 15">
  <metadata><name>Sailboat</name></metadata>
  <trk><name>Sailboat</name> …</trk>
</gpx>
```

A `<name>` inside a track point is a waypoint's label and does not count. Many apps write their
own name as the creator (`Track Logger 2.1`) and no device anywhere; such a file waits for you
to choose its device, as below.

When a file names no device, or more than one, it waits for you:

1. Open **Staging** in the sidebar. A yellow box titled **Needs you** says "1 GPX file waits for the
   device it belongs to." (or how many), whichever category the file was dropped on. The box is on
   the overview, not on a category's page.
2. Click **Choose device**. The page **Routes waiting for a device** opens, with your staging area's
   `routes` folder listed below its header as on the Nodes page, and a panel beside it.
3. Click a file to see in the panel what it says about itself: its **Name** and **Description**,
   its **Tracks**, its **Creator**, when it was **Recorded** (first and last point, in UTC, and how
   long between), its **Points**, its **Size**, and under **Matches** the devices it names, or "no
   device it names". The arrow keys move from file to file.
4. Select the files of one device: <kbd>Ctrl</kbd> and click adds or removes one, <kbd>Shift</kbd>
   and click takes a run of them, <kbd>Ctrl</kbd>+<kbd>A</kbd> takes them all. On a phone, press and
   hold a file, then tap the others. At the top of the panel, choose the device in the
   **Device they come from** list and click **Import** (**Import 3 files** with three selected).
   Each route joins that device's track and its file moves out of the list into the track's `routes`
   folder. A file that cannot be read stays, and the panel names it and why. **Back to staging**
   returns to the staging page.

On a narrow screen the panel is below the list.

In the terminal, [`gpx-info`](commands.md#gpx-info) says the same of any GPX file without importing it:
`gpx-info /home/<you>/staging/routes/*.gpx`.

If the device does not exist yet, have a member of `devices` make it first (see
[Where tracks come from](#where-tracks-come-from)) and open the page again; a waiting file is not
tried again by itself. Waiting files are kept in your staging area's `routes` folder,
`/home/<you>/staging/routes/`. [Sorting in staging](staging.md) describes the staging area.

## Trips

EiN cuts a track into trips by itself, and the **Trips** view of the device's **Trips** tab lists
them, newest first. A trip runs from where the track lay still to where it lay still again:

- Arriving at one of the track's [home bases](#home-bases) ends a trip, once it has been there
  half an hour or the track ends there. Passing by does not.
- Staying anywhere else longer than three days ends a trip too (two days for a bike or on foot), as
  does a gap of that long with no points at all.
- A trip that never gets 500 m from where it started is not a trip, and is left out.

How near a place has to be to count as the same place depends on
[how the device travels](#how-a-device-travels): within 1 km for a boat, 500 m for a car, 300 m
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
the trip shows ([The Trip tab](albums.md#the-trip-tab)). Changing how the device travels (its
**Travels as** or its class), its time zone or its home bases finds them again from the start. **Find trips again** does it at once.

When the track has no trips, the view says **No trips**: "Nothing in the track went 500 m or more
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

### Move a trip to another device

A trip recorded on the wrong device, such as a phone posting the sailboat's trip while it was the
car's tracker that should have, can be moved to the right one. Those who may change the track click
**Move to another device…** on the trip's card, pick the device under **Device** in **Move the trip
to another device** ("Its positions, first to last, leave this device's track for the other's, and
the trips of both are found again."), and click **Move**. The list holds every other device with a
track. Positions you rejected or accepted by hand keep that.

The positions recorded where the trip began and ended stay, as does any GPX file the trip was read
from, in this track's `routes` folder. To move another stretch, use `track-move` with the time
span, naming the devices:

```bash
# in EiN's terminal
track-move ruby-phone sailboat --from 2025-07-01T06:00:00Z --to 2025-07-03T18:00:00Z
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
  albums whose dates overlap the trip and whose map draws this device's track (see
  [Choose which devices the map shows](albums.md#choose-which-devices-the-map-shows));
  their number keys pick them. Type part of a name to find any album you may change, or type a new
  name and press **New album “…”** to make an album of the trip under that name. Choosing an album
  makes it the trip's. An album that already holds another trip is refused with a message saying
  so.

Either way the device is added to the album's devices, so its Map tab draws the route, and the
album spans the trip even before it has any pictures. The card then names the album under **Album**,
with **Take off the album** to undo it; the album and its pictures stay, and so does the device on
its list. A trip is one album's, and an album holds one trip. Each time the trips are found again, or
their stays put at locations, the album follows: it grows while the trip is ongoing, and its stays
get their locations. The album holds on to its trip when the device or its track is moved or renamed.

The album gets a **Trip** tab: the days, the distance in the track's units, where it stayed, and
each day's notes. See [The Trip tab](albums.md#the-trip-tab). Those who may only look at the track
see the albums the trip may belong to under **Maybe in**.

## If something goes differently

| What you see                                                                      | Why                                                                                                                       | What to do                                                                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A device has no **Trips** tab.                                                    | It has no track: it is a sensor or a plug, or a tracker made without `--driver tracker` that has had no position yet.     | Make a phone or a logger with `device-create <name> --driver tracker`; see [Where tracks come from](#where-tracks-come-from).                             |
| The **Trips** view says **No trips** though the track has positions.              | Its trips have not been found yet, or no part of the track went 500 m or more from where it started.                      | Click **Find trips**, or **Find trips again**.                                                                                                            |
| A trip ends at home in the middle of a holiday, or two trips should be one.       | Arriving at a home base, or staying somewhere longer than three days, ends a trip.                                        | Click **Join to the trip before** on the second trip's card.                                                                                              |
| A trip's days end at the wrong hour.                                              | The track's **Timezone** is not set, so its days are cut in UTC, or it is set to another zone.                            | Click **How it travels** and choose the **Timezone** its days belong in.                                                                                  |
| A trip is listed under the wrong device.                                          | The phone or tracker that recorded it posted to another device, or its GPX file was given to the wrong device.            | Click **Move to another device…** on the trip's card; see [Move a trip to another device](#move-a-trip-to-another-device).                                |
| **How it travels**, **Upload GPX** or **Add home base** is missing.               | You may not change this track: it is the device's owner's.                                                                | Ask whoever made the device, or an administrator.                                                                                                         |
| **Upload GPX** gives a message ending in "no track points found".                 | The file holds no recorded track points, only a planned route or waypoints.                                               | Use the file that was recorded while it moved.                                                                                                            |
| **Upload GPX** gives a message ending in "none of its N track points has a time". | The file's points carry no times: a route drawn on a map, or a file the program saved without them.                       | Use the file that was recorded while it moved, or export it again with times.                                                                             |
| A GPX file dropped in staging waits, though its device exists.                    | The file names neither the device nor a camera linked to it, or it names more than one device.                            | Click **Choose device** under **Needs you** on the Staging page; see [GPX files in staging](#gpx-files-in-staging).                                       |
| The phone reports nothing to the track.                                           | It cannot reach EiN over HTTPS from where it is, its key was renewed or taken away, or tracking is off in Traccar Client. | See [Report from a phone](../guide/devices.md#report-from-a-phone) and [Ports, HTTPS and remote access](../admin/network.md#phones-and-trackers-posting). |
| A GPX file sits in an album as an ordinary file.                                  | It was uploaded straight into the album, where GPX files are not read as routes.                                          | Upload it on the device's **Trips** tab, then delete the file from the album.                                                                             |

## From the terminal

Every track command takes a track by its path, or by its device or a camera linked to the device, by
its path or its name: `sailboat` is `/dev/sailboat/position`. A track's `routes` folder holds the GPX
files it was read from, its `homes` folder links its home bases, and its `.trips` keeps its trips.
The commands below are in the [archive command reference](commands.md), and every one takes
`--help`; the devices' own commands are on [Devices](../guide/devices.md#from-the-terminal).

| Task                                                                | Command                                                                                                                                                                                                                                |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List the devices' tracks, with their name, kind, positions and span | [`track-list`](commands.md#track-list), or `track-list <folder>` for those under one folder                                                                                                                                            |
| Find tracks by name or description                                  | [`search-track`](commands.md#search-track) `<words>`                                                                                                                                                                                   |
| Change how a device travels                                         | [`track-update`](commands.md#track-update) `<track> --kind boat` (`car`, `bike`, `foot`), `--timezone <zone>` or `--description <text>`, or `--clear <field>`                                                                          |
| List a track's home bases                                           | [`track-home`](commands.md#track-home) `<track>`; with none of its own, the homes of its cameras' owners and the years they count                                                                                                      |
| Add or remove a home base                                           | [`track-home`](commands.md#track-home) `<track> --add <location>…` or `--remove <location>…`; a location is its path, or its folder name                                                                                               |
| Read a track as the maps draw it                                    | [`track-read`](commands.md#track-read) `<track> --still`; without `--still` every recorded position, `--max-speed <m/s>` to change what is too fast                                                                                    |
| Give a GPX file to a device                                         | `cat <gpx> > /dev/<device>`; [`track-stage`](commands.md#track-stage) `<gpx> --track <device>`, which moves the file to the track's `routes`, or [`track-import`](commands.md#track-import) `<device> <gpx>`, which keeps a copy there |
| Add a position by hand                                              | [`track-append`](commands.md#track-append) `<track> --lat=<lat> --lng=<lng> --ts <time>`                                                                                                                                               |
| See what GPX files hold, without importing                          | [`gpx-info`](commands.md#gpx-info) `<gpx>…`: name, tracks, creator, points and their time span, size, and the devices each names                                                                                                       |
| List the GPX files a track was read from                            | [`source-list`](commands.md#source-list) `/dev/sailboat/position`                                                                                                                                                                      |
| Find a track's trips                                                | [`track-trips`](commands.md#track-trips) `<track>`, `--full` from the start, `--dry-run` to see them without keeping them                                                                                                              |
| List a track's trips                                                | [`trip-list`](commands.md#trip-list) `<track>`                                                                                                                                                                                         |
| Put a track's stays at locations, and name the new ones             | [`track-places`](commands.md#track-places) `<track>`; see [Places a track stayed at](places.md#places-a-track-stayed-at)                                                                                                               |
| Give a track's trips and days their weather                         | [`track-weather`](commands.md#track-weather) `<track>`, `--full` to look every trip up again, `--dry-run` to see what it would look up                                                                                                 |
| Join a trip to the one before, or part one                          | [`trip-edit`](commands.md#trip-edit) `<track> <trip> --merge`, or `<track> <day> --split`                                                                                                                                              |
| Make a trip an album, or take it off                                | [`trip-album`](commands.md#trip-album) `<track> <trip> --new`, `--album=<album>`, or `--detach`                                                                                                                                        |
| Reject or accept positions by hand, or hand them back to the rules  | [`track-mark`](commands.md#track-mark) `<track> --reject`, `--accept` or `--clear`, with `--from`, `--to`, `--near <lat,lng>` and `--marked reject`                                                                                    |
| Move a stretch of a track to another device                         | [`track-move`](commands.md#track-move) `<track> <to-track> --from <time> --to <time>`                                                                                                                                                  |
| Link a camera to the device it is part of                           | [`camera-device`](commands.md#camera-device) `<camera> <device>`, or `<camera> --off`                                                                                                                                                  |
| Put a device on an album's map, or take it off                      | [`album-device-add`](commands.md#album-device-add) and [`album-device-rm`](commands.md#album-device-rm) `<album> <device>…`; see [Albums](albums.md#in-the-terminal)                                                                   |
| Make a phone's or a tracker's key, or renew or take it away         | `device-key <device>`, with `--new` or `--off`; see [Report from a phone](../guide/devices.md#report-from-a-phone)                                                                                                                     |

Making Jon's GPS logger, which he walks with, and adding a route copied into your home folder:

```bash
# in EiN's terminal, as a member of devices
device-create "Jon's eTrex" --driver tracker --class foot --manufacturer Garmin --model 'eTrex 30x'
track-update jon-s-etrex --timezone Pacific/Auckland
track-stage "$HOME/tararua-walk.gpx" --track jon-s-etrex
```

`device-create` prints the device's path, `/dev/jon-s-etrex`, and gives it its track,
`/dev/jon-s-etrex/position`; `--class foot` says how it travels. `track-stage` moves the GPX file to
the track's `routes` folder once its points are in the track. See [Commands by task](tasks.md) for
the rest of the archive's commands.

## Related pages

- [Devices](../guide/devices.md): the device pages, a phone as a tracker, and GPX files written to a
  device.
- [Cameras](cameras.md): the phones and cameras that took the pictures, and the devices they are part
  of.
- [Locations and the map](places.md): the Map page and its Tracks layer, and the places trips
  stayed at.
- [Albums](albums.md): an album's **Map** and **Trip** tabs.
- [Getting your photos in](importing.md): every way files, GPX files among them, get into EiN.
- [Sorting in staging](staging.md): the staging area where waiting routes are.
