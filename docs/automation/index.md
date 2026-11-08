# Automation

The Automation module brings the devices in the house into EiN: sensors, plugs, switches, lights
and buttons that talk MQTT, such as those running ESPHome and Shelly's. Each device has a page with
its readings as they are now and as they went, and the switches to turn. Every reading is kept, and
published on EiN's routing keys, where a queue or a log of your own can take it, and
[rules](rules.md) switch things when a reading, a press or the clock says so.

This page is for the household that uses the devices and for the administrator who installs the
module and connects them. [Rules](rules.md) covers writing rules.

## What it needs

- **An MQTT broker**, the server the devices and EiN exchange their messages through. The
  installer runs one beside EiN with `--mqtt`; a broker you already run works as well.
- **Devices that speak MQTT**: those running ESPHome, and Shelly's of the second generation and
  later.
- Nothing else: neither the Archive nor the media service. With the [Archive](../archive/index.md)
  installed, a device's position is drawn on its maps and cut into trips; with the
  [Assistant](../assistant/index.md), the chat reads the devices and switches them.

## Install it

With the installer's broker, add the broker and the module in one run:

```bash
# on the machine EiN runs on, in ~/ein
./setup.sh --mqtt --module automation
```

On a new machine the installer takes the same options:
`curl -fsSL https://einhq.eu/install.sh | bash -s -- --mqtt --module automation`. With a broker of
your own, install the module alone, from **Settings → Modules** or in EiN's terminal, and then give
it the broker ([A broker you already run](#a-broker-you-already-run)):

```bash
# in EiN's terminal, as the administrator
mod install automation
```

**Devices** is then in the sidebar. The module runs two services: `automation-bridge`, which hears
the broker, and `automation-rules`, which runs the rules. When they first start they make the group
`automation`, whose members look after the devices and write the rules
([Who may do what](#who-may-do-what)). [Modules](../admin/modules.md) covers installing and removing
modules.

### The installer's broker

`--mqtt` runs Mosquitto in a container of its own, `mqtt`, beside EiN:

- It takes no anonymous clients. EiN signs in as `ein` and the devices as `device`, with passwords
  `setup.sh` made at the install and keeps in `~/ein/.env`: `MQTT_EIN_PASSWORD` and
  `MQTT_DEVICE_PASSWORD`. A password changed there takes effect at the next `./setup.sh`.
- The devices reach it on port 1883 of the machine (`MQTT_PORT` in `.env`), on the address
  `EIN_BIND` names.
- `setup.sh` gives EiN the broker's address, user and password itself: the three settings say
  **From deployment** on the Settings page and need nothing from you.
- It keeps what the devices announce in the data folder's `mqtt` folder, so it is all there again
  after a restart.
- `./setup.sh --no-mqtt` takes it out again, and `./setup.sh --only mqtt` updates it alone.

The devices need the device password. Read it on the machine:

```bash
# on the machine EiN runs on, in ~/ein
grep MQTT_DEVICE_PASSWORD .env
```

> [!WARNING]
> The broker speaks plain MQTT, without TLS. Whoever reaches port 1883 with the device password can
> switch the house's devices and read what they say. Keep the port on your home network and never
> forward it on your router; [Ports, HTTPS and remote access](../admin/network.md#what-ein-listens-on)
> lists it with EiN's other ports.

### A broker you already run

Give EiN the broker's address and an account on it, under **Settings → System** in the
**Automation** group, or with `config set`:

```bash
# in EiN's terminal, as the administrator
config set CFG_AUTOMATION_MQTT_URL mqtt://192.0.2.20:1883
config set CFG_AUTOMATION_MQTT_USER ein
 config set CFG_AUTOMATION_MQTT_KEY 'the password'   # the leading space keeps it out of your history
```

**MQTT broker** takes `mqtt://host:1883`, or `mqtts://host:8883` for a broker that takes TLS.
**MQTT password** is a key: nobody can read it back, and EiN sends it only to that broker
([Give a key to another service](../admin/configuration.md#give-a-key-to-another-service)). Saving
any of the three restarts `automation-bridge`. While **MQTT broker** is empty, automation is off: no
device is heard.

## Connect a device

A device announces itself on the broker, and EiN makes it a device as soon as it hears it: within
seconds of the device connecting it is on the **Devices** page with all it reads and does. Nothing is
entered in EiN.

A device is named in EiN as it names itself, in lower case with hyphens, such as `hall-sensor`, and
each of its entities by its own name within it, such as `hall-sensor/temperature`. Commands, routing
keys and rules use these names. **Rename** on a device's page gives it a friendlier name on the pages
and leaves these as they are.

### ESPHome

Add an `mqtt:` block to the device's configuration, with the machine EiN runs on as the broker, and
install the configuration on the device as usual:

```yaml
# hall-sensor.yaml, the device's ESPHome configuration
esphome:
  name: hall-sensor

mqtt:
  broker: 192.0.2.10 # the machine EiN runs on
  username: device
  password: !secret mqtt_password # in secrets.yaml: MQTT_DEVICE_PASSWORD from ~/ein/.env
```

With an `mqtt:` block ESPHome announces each of its entities the way Home Assistant's MQTT discovery
reads them, which is on unless you turn it off. Leave its prefix as it is, `homeassistant`. The
device is named by its `name:`, and an entity by its own name: a sensor called Temperature on the
device above is `hall-sensor/temperature`.

Other software that announces devices the same way, such as Zigbee2MQTT, is read as far as it keeps
to what ESPHome sends; `automation-status` names what it could not read.

### Shelly

Shelly's devices of the second generation and later are read: Plus, Pro, Gen3 and Gen4. The first
generation is not.

1. Open the Shelly's own web page, at its address on your network, and go to **Settings → MQTT**.
2. Turn MQTT on. Set the server to the machine EiN runs on with the port, such as
   `192.0.2.10:1883`, the user to `device`, and the password to the device password.
3. Turn on **Generic status update over MQTT** and **RPC status notifications over MQTT**.
4. Save. The Shelly restarts and connects.

The topic prefix may stay as it is, the Shelly's id, such as `shellyplus1pm-a8032ab12345`. It is the
device's name in EiN, so a short one of your own, such as `hall-plug`, makes commands and rules
easier to read. Choose it before the Shelly is first heard: a new prefix is a new device.

A Shelly's entities are named after its parts: `switch-0` is its first relay, `switch-0-power`,
`switch-0-energy`, `switch-0-voltage` and `switch-0-current` what the relay measures, and `input-0`
its first input. An input set to button mode gives presses, `single`, `double`, `triple` or `long`,
rather than on and off.

### Check that EiN hears them

```bash
# in EiN's terminal
automation-status
```

| What it says                             | What it means                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `5 devices, 31 entities, 18420 messages` | The bridge is connected: what it found, and the messages it has had since it started.                                                                   |
| `not read: <device>/<entity>: <why>`     | An entity whose values the bridge cannot read, such as one announced with a template it does not understand. Nothing of it is kept.                     |
| `rules: 3, 41 runs`                      | The rules service runs, with its rules and how often they ran; see [Rules](rules.md).                                                                   |
| `off: no broker set`                     | **MQTT broker** is empty: [install the broker](#install-it) or [give EiN yours](#a-broker-you-already-run).                                             |
| `cannot reach mqtt://…: <why>`           | The broker does not answer, or refuses EiN's account. The bridge tries again by itself, waiting a second, then twice as long each time, up to a minute. |
| `not running`                            | The `automation-bridge` service is stopped: `service start automation-bridge`, as the administrator.                                                    |

The dashboard says the same: its `automation bridge` check is fine while the bridge is connected,
a warning while it cannot reach the broker, and failed while its service is stopped
([Health and the dashboard](../admin/monitoring.md#read-the-checks)).

## The Devices page

**Devices** in the sidebar has a card for every device: what it is called, its main reading and
badges for **online** or **offline** and for its number of entities. The main reading is a
temperature when the device has one, then power, humidity, light or energy, else any other reading,
else a switch. A device that says nothing of whether it is on has neither badge. Choose a card to
open the device.

- Type in the filter box to narrow the cards by name, manufacturer or model.
- **Show** **All** devices or only those **Online**.
- **Sort** by **Name (A-Z)** or by **Latest reading**, the newest first.

## A device's page

The header names the device, its manufacturer and model, whether it is online, and how long ago its
last reading came. Under it are three tabs.

### Overview

A tile for each of the device's entities:

- **A reading**, such as a temperature: its value with its unit, how long ago it came, and a line of
  the last six hours.
- **A switch or a light**: a toggle that switches it. The tile shows the new state once the device
  says it has switched.
- **A button**: its last press, such as `single`, and how long ago it was.
- **An action**, such as a restart: **Press**.
- **A position**: how many positions its track holds, when the last came, and **Track and trips**,
  which opens the track with the Archive installed.

What tells of the device itself rather than of the house, such as its own temperature or its Wi-Fi
signal, is under **About the device itself**. An entity the device no longer announces is left out;
its history stays.

### History

Pick an entity and a span: **Day**, **Week**, **Month** or **Year**; the tab opens on the device's
main reading, the one its card shows. The chart shows the average of every 15 minutes over a day, of
every 2 hours over a week, of every 6 hours over a month and of every day over a year, to five
significant digits. Anything on or off, a switch, a door or a motion sensor, is charted as the share
of the time it was on.

### Info

- What the device is: its **Name** in commands, **Found by** (`ha-discovery`, `shelly`, or `manual`
  for one made by hand), its manufacturer, model, firmware and MAC address.
- Each entity, with its label, its name, its kind and its value now. **settable** marks an entity
  that can be switched or set, **not read** one whose values the bridge cannot read, and **retired**
  one the device no longer announces.
- **Live tracking**, for a device made by hand or one with a position
  ([Devices made by hand](#devices-made-by-hand)).
- **Called** and **Rename**: the name the pages show. The device's name in commands stays.
- **Forget**: removes the device and everything kept of it, after asking. A device that is still on
  comes back when it next announces itself, without its old history.

The kinds an entity can be:

| Kind       | What it is                                                    | What `device-set` takes    |
| ---------- | ------------------------------------------------------------- | -------------------------- |
| `sensor`   | A reading: a number with its unit, or a word                  |                            |
| `binary`   | On or off, read only: a door, motion, an input                |                            |
| `switch`   | On or off, and can be switched: a relay, a plug               | `on`, `off` or `toggle`    |
| `light`    | A switch that is a light                                      | `on`, `off` or `toggle`    |
| `number`   | A number the device takes, such as a thermostat's target      | a number within its limits |
| `text`     | A word the device takes, such as a mode                       | one of its options         |
| `button`   | A physical button: its presses, which are events, not a state |                            |
| `action`   | Something the device does when asked, such as a restart       | `press`                    |
| `position` | Where it is, kept as a track of positions                     |                            |

## Switch things

The toggles on a device's **Overview** switch it, and so does `device-set` in the terminal:

```bash
# in EiN's terminal
device-set hall-plug/switch-0 on
device-set hall-plug/switch-0 toggle
device-set heater/target 21
```

The command goes to the device through the broker at once. When the bridge is not connected,
`device-set` refuses, saying that nothing would be sent: a command is never kept for later, since a
lamp switched on an hour after it was asked would surprise.

## Readings on the bus

Every entity keeps its readings in its history, and publishes each one as it comes on a routing key:
a name a message is published under, which any queue or log bound to it gets a copy of.

| Routing key                          | What comes on it                                  |
| ------------------------------------ | ------------------------------------------------- |
| `automation.state.<device>.<entity>` | Each new reading or state: a temperature, on, off |
| `automation.event.<device>.<entity>` | Each press of a button                            |
| `automation.online.<device>`         | The device coming online or going offline         |

A message is a line of JSON that says whose it is, so it can be read without its key:

```text
{"device":"hall-sensor","entity":"temperature","kind":"state","value":21.4,"unit":"°C","at":"2026-11-08T07:42:10.512Z"}
{"device":"porch-button","entity":"input-0","kind":"event","value":"single","at":"2026-11-08T18:03:55.120Z"}
{"device":"hall-plug","online":false,"at":"2026-11-08T22:15:02.004Z"}
```

`kind` is `state` or `event`, `value` a number, a word, or `true` and `false` for on and off, and
`at` the time EiN received it. A reading the broker passed on again after EiN reconnected, the
device's last, also has `"retained": true`.

A number is published at most once every 10 seconds for each entity (**Seconds between readings**).
One that comes sooner waits for the end of the 10 seconds, and only the newest of those is
published, so the last of a burst is never lost. A reading the same as the last one is not
published at all. On and off, words and presses go out as they come.

The devices are nodes under `/archive/devices`:

```text
/archive/devices/
└── hall-sensor/                 the device
    ├── .online                  where its coming and going is published
    └── temperature/             an entity
        ├── history              its readings, a log
        ├── live                 where each reading is published
        └── set                  what it is asked to be, for an entity that can be set
```

### A queue of your own

A queue bound to keys keeps every message that comes on them until it is taken, whether or not
anyone is reading. Make one in your home for what you want, such as every press of every button:

```bash
# in EiN's terminal
mkqueue -k 'automation.event.#' ~/presses
queue-peek ~/presses     # the next ones, left in the queue
cat ~/presses            # takes them out as it prints them
```

In a key, `*` stands for one part and `#` for any number of them: `automation.state.*.temperature` is
every temperature in the house, and `automation.state.hall-sensor.*` everything the hall sensor
reads. Remove the queue with `rm ~/presses` when you no longer want it, or it keeps filling.

### A log of your own

A log keeps what comes on its keys as entries with their times, for as long as you say:

```bash
# in EiN's terminal
mklog -k 'automation.state.*.temperature' -r '90 day' ~/temperatures
log-read ~/temperatures --since 1d
log-read ~/temperatures --since 30d --bucket 1d --field value --agg max
```

### Watch one live

```bash
# in EiN's terminal
cat /archive/devices/hall-sensor/temperature/live
```

prints each reading as it is published, until <kbd>Ctrl</kbd>+<kbd>C</kbd>. Nothing is kept: what
comes while you are not watching is not shown.

## Who may do what

| Who                               | What they may do                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Everyone signed in                | See every device, its readings and its history; switch and set devices; bind queues and logs of their own to any automation key |
| Members of the `automation` group | Also rename and forget devices, make devices by hand, turn live tracking on and off, and write [rules](rules.md)                |
| The administrator                 | Also add people to the `automation` group, and narrow who may switch a device                                                   |

The administrator adds someone to the group in **Settings → Groups**, or in the terminal; the
change applies from their next sign-in:

```bash
# in EiN's terminal, as the administrator
group-add-member automation helen
```

Each entity that can be set has a `set` node, and whoever may write it may set the entity. It is the
`users` group's from the start, so everyone with an account may. To keep the heater to a group of its
own, such as `parents`:

```bash
# in EiN's terminal, as the administrator
chown :parents /archive/devices/heater-plug/switch-0/set
```

Anyone else is then refused with `device-set: Access denied for operation 'w' on node: …`, and so
are their rules. [Permissions in depth](../admin/permissions.md) explains groups and modes.

> [!IMPORTANT]
> Readings are not narrowed device by device. Everyone signed in may bind a queue or a log to any
> automation key and read any device's history, door and motion sensors included: whoever has an
> account can tell when the front door opened or someone moved in a room.

## Devices made by hand

Some things worth following have no MQTT: a boat, a car, a GPS logger. A member of `automation`
makes such a device by hand:

```bash
# in EiN's terminal
device-create Sailboat --position
```

It answers with the path of its track, `/archive/devices/sailboat/position/history`: `--position`
gives the device a `position` entity whose history is a track of GPS positions rather than a log.
`--label`, `--manufacturer` and `--model` say more about it.

### Live tracking from a phone

A phone with the free [Traccar Client](https://www.traccar.org/client/) app can add its position to
the device's track as it moves:

1. Open the device's page at the address the phone will reach EiN at, such as
   `https://ein.wrenfield.example`, and its **Info** tab.
2. Under **Live tracking**, choose **Turn on**. A QR code and the server URL appear.
3. On the phone, install Traccar Client and scan the QR code in its settings. It fills in the server
   URL and, as the device identifier, the device's name.
4. Set how often it reports, for example every 30 seconds, and switch tracking on.

The phone posts to EiN from wherever it is, so EiN must be reachable from the internet over HTTPS
([Phones posting their position](../admin/network.md#phones-posting-their-position)). The address is
the whole key: anyone who has it can add positions to the track. **New link** makes another, and the
old one stops working at once; **Turn off** stops it and keeps the track. In the terminal:

```bash
# in EiN's terminal
device-tracker sailboat --new --origin https://ein.wrenfield.example   # turn it on, or a new link
device-tracker sailboat --origin https://ein.wrenfield.example         # the link, while it is on
device-tracker sailboat --off
```

### Tracks and trips

With the Archive installed, the track is one like any other: GPX files go into it with the Archive's
[`track-import`](../archive/commands.md#track-import), its points are drawn on the maps, and the
Archive cuts it into trips. **Track and trips** on the device's **Overview** opens them.

```bash
# in EiN's terminal
track-import /archive/devices/sailboat/position/history ~/summer-sail.gpx
```

The Archive's pages describe [a track](../archive/tracks.md#the-route-on-the-map) and
[its trips](../archive/tracks.md#trips).

## Ask the assistant

With the [Assistant](../assistant/index.md) installed, the chat reads the devices: ask "how warm is
it in the hall?", "which devices are offline?" or "how much did the heater draw yesterday?", and it
answers at once, with a chart of a reading's history when you ask how it went. Asking it to switch
something, "turn on the hall lamp", gives a
[proposal card](../assistant/chat.md#when-the-assistant-offers-to-make-a-change) with the
`device-set` line, which you run or decline.

## From the terminal

Every part of the pages is a command:

```bash
# in EiN's terminal
devices                                                     # every device, with its main reading
devices --online
device-show hall-sensor                                     # its entities and their values now
device-history hall-sensor/temperature                      # the latest 100 readings
device-history hall-sensor/temperature --since 7d --bucket 1h            # an average an hour
device-history heater-plug/switch-0-power --since 30d --bucket 1d --agg max   # the highest each day
device-set hall-plug/switch-0 toggle
device-label hall-plug 'Hall lamp'                          # the name its page shows
device-label hall-sensor/temperature 'Hall temperature'
device-forget old-sensor
device-create Sailboat --position
device-tracker sailboat --new --origin https://ein.wrenfield.example
automation-status
automation-rule-check porch-light
```

`device-history` prints a line per reading, its time, a tab and its value: `--since` and `--until`
take a time or a duration such as `24h` or `7d`, and `--bucket` sums the readings up per interval,
with `--agg` as `avg` (the default), `min`, `max`, `sum`, `count`, `first` or `last`; on and off
count as 1 and 0. `device-label`, `device-forget`, `device-create` and `device-tracker` are for
members of `automation`. [Automation commands](commands.md) lists every option.

## Settings

The module's settings are in the **Automation** group of **Settings → System**, and each restarts
`automation-bridge` when saved:

| Setting                           | On the Settings page         | Default                    | What it does                                                                                                                                                                                                |
| --------------------------------- | ---------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CFG_AUTOMATION_MQTT_URL`         | **MQTT broker**              | empty; `--mqtt` sets it    | The broker, as `mqtt://host:1883` or `mqtts://host:8883`. Empty, automation is off                                                                                                                          |
| `CFG_AUTOMATION_MQTT_USER`        | **MQTT user**                | empty; `--mqtt` sets `ein` | The account EiN signs in to the broker with. Empty, it signs in without one                                                                                                                                 |
| `CFG_AUTOMATION_MQTT_KEY`         | **MQTT password**            | none; `--mqtt` sets it     | That account's password, a key nobody can read back                                                                                                                                                         |
| `CFG_AUTOMATION_SOURCES`          | **Device sources**           | `ha-discovery shelly`      | Which kinds of device the bridge listens for, separated by spaces: `ha-discovery` for ESPHome and whatever announces itself as it does, and `shelly`                                                        |
| `CFG_AUTOMATION_DISCOVERY_PREFIX` | **Discovery prefix**         | `homeassistant`            | The topic `ha-discovery` devices announce themselves under                                                                                                                                                  |
| `CFG_AUTOMATION_HISTORY`          | **Reading history**          | `365 day`                  | How long an entity's readings are kept: `30 day`, `90 day`, `365 day` or `forever`. It applies to entities found from then on; one found before keeps its own, which `attrs` on its history changes (below) |
| `CFG_AUTOMATION_MIN_INTERVAL`     | **Seconds between readings** | `10`                       | The shortest time between two published readings of one number. An entity's own `minInterval` attribute overrides it                                                                                        |

An entity found before keeps its history's retention, and an entity can take its own interval, read
when the bridge next starts:

```bash
# in EiN's terminal, as a member of automation
attrs -s 'retention=90 day' /archive/devices/hall-sensor/temperature/history
attrs -J minInterval=60 /archive/devices/heater-plug/switch-0-power
service restart automation-bridge   # as the administrator
```

## When something goes differently

| What you see                                                          | What it means                                                            | What to do                                                                                                                                                                               |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No devices yet** on the Devices page                                | No device has announced itself, or EiN does not hear the broker          | Run `automation-status`, and check the device's own broker settings                                                                                                                      |
| A device never shows up, while others do                              | It cannot reach the broker, or the broker refuses its account            | Check its server, user and password. ESPHome's log says whether MQTT connected. Open port 1883 in the machine's firewall ([network](../admin/network.md#open-the-ports-in-the-firewall)) |
| A Shelly shows up without readings                                    | Its status updates are off                                               | Turn on **Generic status update over MQTT** and **RPC status notifications over MQTT**                                                                                                   |
| A Shelly is there twice, under two names                              | Its topic prefix changed, and a new prefix is a new device               | **Forget** the old one                                                                                                                                                                   |
| An entity is marked **not read**                                      | The device announced it in a way the bridge does not understand          | `automation-status` says why. Its readings are not kept                                                                                                                                  |
| `device-set: … cannot be set`                                         | The entity is a reading, or the device announced no way to set it        | Only an entity marked **settable** takes a value                                                                                                                                         |
| `device-set: … takes on, off or toggle, not …`                        | The value is not one the entity takes                                    | See the kinds in [Info](#info)                                                                                                                                                           |
| `device-set: the automation bridge is not connected to the broker, …` | EiN does not hear the broker just now                                    | Run `automation-status`                                                                                                                                                                  |
| `device-set: Access denied for operation 'w' on node: …`              | The entity's `set` node is narrowed to others                            | Ask the administrator                                                                                                                                                                    |
| **Rename**, **Forget** or `device-create` is refused                  | You are not in the `automation` group, or were added since you signed in | Ask the administrator to add you, then sign in again                                                                                                                                     |
| A device stays **offline**                                            | It said it was going, or the broker said so for it when it disappeared   | Check its power and its Wi-Fi                                                                                                                                                            |
