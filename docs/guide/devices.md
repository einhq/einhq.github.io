# Devices

The **Devices** page holds the things outside EiN that report to it or can be switched from it: the
sensors, plugs, switches, lights and buttons in the house, a phone that says where it is, a GPS
logger, a boat. Each has a page with what it reports now, how that went over time, and the switches
to turn. The members of the `devices` group see them all and add phones and loggers; anyone else
sees the devices a member has shared with them. This page is for everyone who uses them. [Devices, endpoints and drivers](../concepts/devices.md) explains how they
are kept, and [Devices and their keys](../admin/devices.md) who may do what.

## Where devices come from

- **A driver finds them.** With the [Automation](../automation/index.md) module, a sensor or a plug
  that announces itself on the house's MQTT broker, such as one running ESPHome or a Shelly, is on
  the Devices page within seconds of connecting, with everything it reads and does. Nothing is
  entered in EiN. One that is on the network but not yet on the broker is counted in the header,
  such as **2 found**, and a Shelly is added from there
  ([Add a device found on the network](../automation/index.md#add-a-device-found-on-the-network)).
- **Someone makes them.** A phone or a GPS logger announces nothing, so a member of the `devices`
  group makes it by hand (see [A phone or a GPS tracker](#a-phone-or-a-gps-tracker)). EiN's own
  `tracker` driver then reads what it sends. So is a button, a sensor or a script that posts to an
  address, read by EiN's `webhook` driver (see
  [A device that posts to a webhook](#a-device-that-posts-to-a-webhook)), and, with the Automation
  module, a camera ([A camera](../automation/index.md#a-camera)).

A device has a name, such as `hall-plug`, that commands and automations use, and a label, such as **Hall
lamp**, that the pages show. Each thing it reports or takes is an **endpoint** with a name of its
own within it: `hall-plug/switch-0` is the plug's relay, `hall-plug/switch-0-power` the power it
draws, `ruby-phone/position` where the phone has been.

## The Devices page

Open **Devices** in the sidebar, under **Browse**. It has a card for every device you may see: its
label, its main value, and badges for **online** or **offline**, what it is (such as **plug** or
**phone**) and how many endpoints it has. A camera's card shows its picture as it was when the page
last read the devices. The main value is a temperature when the device has one,
then power, humidity, light or energy, else any other reading, else a switch; a device with none
shows its manufacturer and model instead. A device that only posts what it has, such as a phone or
tracker sending its position or one posting to a webhook, is **online** while it has been heard
from in the last 15 minutes; a device that says nothing of whether it is on has neither **online**
nor **offline**. Choose a card to open the device.

- Type in the filter box to narrow the cards by label, name, what it is, manufacturer or model.
- **Show** **All** devices or only those **Online**.
- **Sort** by **Name (A-Z)** or by **Latest value**, the device that reported most lately first.

The header counts the devices and how many are online. With none yet, the page says **No devices
yet**: "Devices appear here when a driver finds them, or when someone makes one with device-create."

## A device's page

The header names the device, its manufacturer and model, whether it is online, what it is, and how
long ago its last value came. Under it are three tabs, and any that modules add:

| Tab          | What it shows                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| **Overview** | The page opens here: a tile for each endpoint as it is now, with the switches                            |
| **History**  | How each endpoint went over a day, a week, a month or a year                                             |
| **Info**     | What the device is, its driver, each endpoint and its key                                                |
| **Trips**    | With the [Archive](../archive/index.md), on a device that has a track: [its trips](../archive/tracks.md) |
| **Live**     | With the [Automation](../automation/index.md) module, on a camera: its picture as it comes               |

Members of the `devices` group also have **Edit** in the header's corner, and **Forget** under ⋮
(see [Rename or forget a device](#rename-or-forget-a-device)); on a phone both are under ⋮.

The address is `/devices/` and the device's name, such as `/devices/hall-plug`, and the tab is in
`?tab=` ([Addresses in the Web UI](../reference/routes.md#eins-own-pages)). A device opened from the
**Nodes** page opens here, and so does any of its endpoints.

### Overview

A tile for each endpoint:

- **A reading**, such as a temperature: its value with its unit, how long ago it came, and a line of
  the last six hours.
- **A button**: its last press, such as `single`, and how long ago it was ("pressed 4 min ago"), or
  "not pressed yet".
- **A position**: a small map of the day up to its last position, and that position: its
  coordinates, its altitude, speed (in knots on a boat, km/h otherwise) and course when the device
  sent them, and when it came. The button on the map, **Enlarge map**, opens it large, with the
  choice of map; **Over time** opens it on the **History** tab.
- **A switch or a light**: a toggle that switches it.
- **A setting that takes a number**, such as a thermostat's target: a slider, set when you let go, or
  a box with **Set** when it has no range.
- **A setting that takes one of some choices**: a list to pick from.
- **A setting that takes a word**: a box with **Set**.
- **A colour**, such as a light's: a colour box whose picker sets it when you let go, or a colour typed
  as `#ff8000` and set with **Set**.
- **An action**, such as a restart or a chime: **Press**, with when it was last pressed and by whom.
- **A camera's stream**: its picture now, taken again every ten seconds while the page is open, with
  its size and codec under it, or **No picture** while the camera gives none. **Live** plays it as it
  comes.

A switch or a setting you change shows what you asked for at once, with "asked on, waiting for the
device" under its label, until the device says it has done it; then it shows what the device reports.
A switch you may not change is greyed out. What tells of the device itself rather than of the house,
such as its own temperature or its Wi-Fi signal, is under **About the device itself**. An endpoint the
device no longer announces is left out; its history stays.

### History

Every endpoint kept over time is drawn at once, over the span picked at the right of the header's
tabs: **Day**, **Week**, **Month** or **Year** (on a phone, the span's icon button). A track's map
comes first, then a chart for each reading, the device's main value, the one its card shows, first
among them. **Over time** on a position's tile puts its track at the top. An endpoint the device no
longer announces is marked **(retired)**.

- **A reading** is charted as the average of every 15 minutes over a day, of every 2 hours over a
  week, of every 6 hours over a month and of every day over a year, to five significant digits.
- **Anything on or off**, a switch, a door or a motion sensor, is charted as the share of the time it
  was on.
- **A button** is charted as how many presses there were.
- **A track** is drawn on a map, each position of the span, up to the latest 20,000, with how many
  there are and how long ago the last was.

A span with nothing in it says **No values in this span.** or **No fixes in this span.**

### Info

- What the device is: its **Name** in commands and automations, **Class**, **Driver**, **Manufacturer**,
  **Model**, **Firmware**, **Serial** and **MAC**. A driver whose module's service is stopped reads
  **(not running)**, in red: the device's switches do nothing until it runs again.
- **Web page**, the device's own page, opened in a new tab, when its driver knows it: a Shelly's and
  an ESPHome node's from what they say of themselves, a printer's admin page and the HTTP page of
  anything added from the network at its address now. It is on your home network, so it opens only
  where that network is reached.
- Each endpoint, with its label and name, its type (`log`, `track` or `control`), its unit, its latest
  value, and whether you may write it. **events** marks a button's presses, **diagnostic** or
  **config** what tells of the device itself, **not read** an endpoint whose values its driver cannot
  read, and **retired** one the device no longer announces.
- **Device key**, for a device whose driver reads what is posted to it, such as a phone: the address
  it posts to (see [A phone or a GPS tracker](#a-phone-or-a-gps-tracker)). Only those who may change
  the device see it.

## Switch something

The toggles, sliders, colour pickers and **Press** buttons on a device's **Overview** switch it. In the terminal, write
the value to the control:

```bash
# in EiN's terminal
echo on > /dev/hall-plug/switch-0
echo toggle > /dev/hall-plug/switch-0
echo 21.5 > /dev/heater/target-temperature
echo eco > /dev/heat-pump/mode
echo '#ff8000' > /dev/desk-lamp/rgbw-0-color
echo press > /dev/hall-sensor/restart
```

A switch takes `on`, `off` or `toggle`; a number setting a number within its limits; a choice one of
its options; a word setting any line; a colour `#rrggbb` or `r,g,b`; an action `press`. The device's **Info** tab and `device-show` say which endpoints are
controls and whether you may write them. The value goes to the device at once, and the command ends
when the device's driver has taken it, or fails, saying why:

- `hall-plug/switch-0 takes on, off or toggle, not '7'`: the value is not one the control takes.
- `hall-plug's driver shelly is not running`: the module that drives it has its service stopped.
- `hall-plug/switch-0: not connected to the broker, so nothing was sent`: with Automation, EiN does
  not hear the MQTT broker just now.
- `Access denied for operation 'w' on node: …`: the control is narrowed to others
  ([Devices and their keys](../admin/devices.md#keep-a-switch-to-some-people)).

Nothing is kept to be sent later: a lamp switched on an hour after it was asked would surprise. Use
`>` to switch, never `>>` (see [Writing to a device](../concepts/devices.md#writing-to-a-device)).

With the [Assistant](../assistant/index.md) and the Automation module, asking the chat to "turn on the
hall lamp" gives a [proposal card](../assistant/chat.md#when-the-assistant-offers-to-make-a-change)
with the `echo` line, which you run or decline. With Automation, [automations](../automation/automations.md)
switch things by themselves when a reading, a press or the clock says so.

## Read what a device reported

```bash
# in EiN's terminal
devices                                                       # every device, with its main value
devices --online
device-show hall-sensor                                       # its endpoints and their values now
device-history hall-sensor/temperature -n 10                  # the latest 10 values
device-history hall-sensor/temperature --since 7d --bucket 1h            # an average an hour
device-history heater-plug/switch-0-power --since 30d --bucket 1d --agg max   # the highest each day
device-history ruby-phone/position --since 1d                 # the day's positions
cat /dev/hall-plug/switch-0                                   # every state the plug reported
tail -f /dev/hall-sensor/temperature                          # each new reading, until Ctrl+C
```

`device-history` prints a line per value, its time, a tab and the value: `--since` and `--until`
take a time or a duration such as `24h` or `7d`, and `--bucket` sums the values up per interval, with
`--agg` as `avg` (the default), `min`, `max`, `sum`, `count`, `first` or `last`; on and off count as
1 and 0. Without `--since` it gives the latest 100, `-n` for another number. A track gives its
positions.

## A phone or a GPS tracker

A phone that reports where it is as it moves, a GPS tracker on a boat or in a car, and a logger whose
files you copy in are all devices driven by EiN's `tracker` driver, each keeping where it was in its
`position` track. Members of the `devices` group make one with **Create** › **Device** in the top
bar: a name, **Reports by** (its position, for these), and **What it is**. **Create** opens the new
device. Or in the terminal:

```bash
# in EiN's terminal, as a member of devices
device-create 'Ruby phone' --driver tracker --class phone
device-create 'Sailboat' --driver tracker --class boat
device-create "Jon's eTrex" --driver tracker --class foot --manufacturer Garmin --model 'eTrex 30x'
```

`device-create` prints the device's path, such as `/dev/ruby-phone`. `--class` says what it is:
`phone`, `tracker`, or, for something that always travels the same way, `boat`, `car`, `bike` or
`foot`, which the Archive takes as [how its trips travel](../archive/tracks.md#how-a-device-travels).
`--manufacturer` and `--model` say more about it, and let a GPX file that names them find it.

### Report from a phone

A phone with the free [Traccar Client](https://www.traccar.org/client/) app adds its position to the
device's track as it moves:

1. Open the device's page at the address the phone will reach EiN at, such as
   `https://ein.wrenfield.example`, and its **Info** tab.
2. Under **Device key**, choose **Make a key**. A QR code and the address appear.
3. On the phone, install Traccar Client and scan the QR code in its settings, or with the phone's
   camera, which opens the app. It fills in the server URL with the key in it and, as the device
   identifier, the device's name. **Or type the server URL in by hand** shows
   the address to type instead.
4. Set how often it reports, for example every 30 seconds, and switch tracking on.

[OsmAnd](https://osmand.net/) reports the same way: give its online tracking the device's address
with `&lat={0}&lon={1}&timestamp={2}` added. So does a hardware tracker that posts the OsmAnd
protocol, or GPRMC sentences, over HTTP.

The phone posts to EiN from wherever it is, so EiN must be reachable from the internet over HTTPS
([Phones and trackers posting](../admin/network.md#phones-and-trackers-posting)). The address holds
the device's key, and anyone who has it can add positions to the device: **New key** makes another
(the phone stops reaching EiN until it is given the new address), and **Take the key away** stops it
and keeps the track. In the terminal:

```bash
# in EiN's terminal
device-key ruby-phone --new --origin https://ein.wrenfield.example   # a new key, and the address
device-key ruby-phone --origin https://ein.wrenfield.example         # the address, while it has one
device-key ruby-phone --off
```

### GPX files

A GPS logger, a watch or a tracking app saves its routes as GPX files. Write one to the device and
its positions join the track; a position with a time the track already has is not added twice, and
one without a time is left out:

```bash
# in EiN's terminal
cat ~/tararua-walk.gpx > /dev/jon-s-etrex
```

Over SFTP, copy the file onto the device's path, `/dev/jon-s-etrex`. With the Archive, a GPX file
uploaded into staging finds its device by itself, and the device's **Trips** tab has **Upload GPX**;
see [GPX files](../archive/tracks.md#gpx-files).

## A device that posts to a webhook

Something without a driver of its own, such as a button that calls an address, a sensor that posts
JSON, or a script reading a meter, posts what it reads to a device driven by EiN's `webhook` driver.
A member of `devices` makes the device and gives it the device's key:

```bash
# in EiN's terminal, as a member of devices
device-create 'Garden sensor' --driver webhook --class sensor
device-key garden-sensor --new --origin https://ein.wrenfield.example
```

```bash
# on the machine that posts
curl -H 'Authorization: Bearer <the key>' -H 'Content-Type: application/json' \
  --data '{"soil-moisture": 41.5, "battery": 87}' https://ein.wrenfield.example/file/dev/garden-sensor
```

The key is the part of the address after `key=`. Each field becomes a reading on the endpoint of that
name, made the first time it comes, here `soil-moisture` and `battery`: it shows on the device's page
and is published on the bus as `dev.garden-sensor.soil-moisture`, where the
[Automation](../automation/automations.md) module's automations hear it, like any driver's reading. A device that
only takes an address sends its values in it instead,
`https://ein.wrenfield.example/file/dev/garden-sensor?key=<the key>&soil-moisture=41.5`. What the
driver reads, and how a button's presses are kept, is in
[Core's webhook driver](../concepts/devices.md#cores-webhook-driver).

### Values written to an endpoint

A script can also write a value straight to a log it made under a device, with no driver in between:

```bash
# in EiN's terminal, as a member of devices
device-create 'Garden sensor' --class sensor
mklog /dev/garden-sensor/soil-moisture
attrs -s valueField=value /dev/garden-sensor/soil-moisture
device-key garden-sensor --new --origin https://ein.wrenfield.example
```

```bash
# on the machine that runs the script
curl -H 'Authorization: Bearer <the key>' --data 41.5 https://ein.wrenfield.example/file/dev/garden-sensor/soil-moisture
```

Each value is kept with the time it arrived, as `{"value": 41.5}`, and shows on the device's page
like any reading; `valueField` makes the log keep a value written in the terminal the same way,
`echo 41.5 > /dev/garden-sensor/soil-moisture`. Values written this way are not published on the bus;
post them to a `webhook` device for that.

## Rename or forget a device

Members of the `devices` group rename a device on its page with **Edit**: **Name**, what its pages
and cards call it, and under **Endpoints** a name for each endpoint it announces, each field headed
by the endpoint's name in `/dev`. **Save** writes what changed. **Forget**, under ⋮, removes the
device and everything it kept after asking "Forget &lt;device&gt; and all it has kept? A driver that
finds it again makes it again." A sensor that is still on comes back when it next announces itself,
without its old history.

In the terminal:

```bash
# in EiN's terminal, as a member of devices
device-label hall-plug 'Hall lamp'                     # the label its page shows
device-label hall-sensor/temperature 'Hall temperature'
device-forget old-sensor                               # the device and everything it kept
```

The name in commands and automations stays as it is. Forgetting removes the device's history with it; a
device a driver still hears comes back new.

## From the terminal

| Task                                        | Command                                                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| List the devices, with their main value     | [`devices`](../reference/commands-core.md#devices), `--online` for those that answer                                   |
| List the drivers running, and their devices | `devices --drivers`                                                                                                    |
| A device's endpoints and their values now   | [`device-show`](../reference/commands-core.md#device-show) `<device>`                                                  |
| An endpoint's history                       | [`device-history`](../reference/commands-core.md#device-history) `<device>/<endpoint>`, `--since`, `--bucket`, `--agg` |
| Switch or set a control                     | `echo <value> > /dev/<device>/<endpoint>`                                                                              |
| Follow an endpoint as values come           | `tail -f /dev/<device>/<endpoint>`                                                                                     |
| Make a phone, tracker or logger             | [`device-create`](../reference/commands-core.md#device-create) `<name> --driver tracker --class <class>`               |
| Make a device that posts to a webhook       | `device-create <name> --driver webhook`, `--config events=<field>,…` for a button's presses                            |
| Give a GPX file to a tracker                | `cat <file>.gpx > /dev/<device>`                                                                                       |
| Show, renew or take away a device's key     | [`device-key`](../reference/commands-core.md#device-key) `<device>`, `--new`, `--off`, `--origin <address>`            |
| Rename a device or an endpoint              | [`device-label`](../reference/commands-core.md#device-label) `<device>[/<endpoint>] <label>`                           |
| Forget a device                             | [`device-forget`](../reference/commands-core.md#device-forget) `<device>`                                              |

## When something goes differently

| What you see                                                                          | What it means                                                                                                            | What to do                                                                                                                            |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Devices** is not in the sidebar                                                     | You are not signed in                                                                                                    | Sign in                                                                                                                               |
| **No devices yet**                                                                    | No driver has found one, and nobody has made one                                                                         | With Automation, see [Check that EiN hears them](../automation/index.md#check-that-ein-hears-them)                                    |
| A switch stays "waiting for the device"                                               | The device took the command but has not said it switched: it is off, or out of reach                                     | Check its power and its network; the switch shows what it reports once it does                                                        |
| The driver reads **(not running)**                                                    | The service of the module that brings the driver is stopped                                                              | An administrator starts it on the dashboard's **Services** tab, or with `service start`                                               |
| `toggle needs the state the device last reported, and it has reported none`           | The control has never reported a state                                                                                   | Write `on` or `off` instead                                                                                                           |
| `device-create` says `only the devices group's members make, name and forget devices` | You are not in the `devices` group, or were added since you signed in                                                    | Ask the administrator to add you, then sign in again                                                                                  |
| **Edit** and **Forget** are missing                                                   | The same                                                                                                                 | The same                                                                                                                              |
| `device-create` says `'null' is core's own in /dev, not a device's name`              | The name is one of EiN's own in `/dev`                                                                                   | Choose another name                                                                                                                   |
| `cat ride.gpx > /dev/thermometer` says the device has no driver                       | Only a device with a driver that reads raw input takes a file                                                            | Write it to the tracker it was recorded on                                                                                            |
| The phone reports nothing                                                             | It cannot reach EiN over HTTPS from where it is, its key was renewed or taken away, or tracking is off in Traccar Client | See [Report from a phone](#report-from-a-phone) and [Ports, HTTPS and remote access](../admin/network.md#phones-and-trackers-posting) |

## Related pages

- [Devices, endpoints and drivers](../concepts/devices.md): how devices are kept, written to and
  published.
- [Devices and their keys](../admin/devices.md): who may do what, and what a device key opens.
- [Automation](../automation/index.md): sensors, plugs and buttons over MQTT, and automations.
- [Trips](../archive/tracks.md): with the Archive, the trips a device's track is cut into.
