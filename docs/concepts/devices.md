# Devices, endpoints and drivers

A device is something outside EiN that reports or can be told what to do: a temperature sensor, a
plug, a button, a phone that says where it is, a GPS logger whose files you copy in. EiN keeps each
one in the tree at `/dev/<device>`, with what it reports and what it can be told as files under it.
This page explains how that is laid out, how a device's readings get in and go out, and what moves
them. Read it before writing to devices from the terminal or a script, or, as the administrator,
before binding a queue to them. [Devices](../guide/devices.md) covers the pages, and
[Devices and their keys](../admin/devices.md) who may do what.

## A device is a folder

Devices sit directly under `/dev`, beside EiN's own `null` and event routers. A device is a node of
the type `device`, a folder, and its endpoints are the nodes in it, much as Linux shows a device's
values as files in a folder under `/sys`:

```text
/dev/
├── events                  EiN's own: where changes are announced
├── null                    EiN's own: reads nothing, swallows what is written
├── hall-plug/              a device, found by a driver
│   ├── switch-0            a control: on or off
│   ├── switch-0-power      a log of readings, in W
│   └── switch-0-energy     a log of readings, in Wh
├── porch-button/
│   └── input-0             a log of events: single, double, long
└── ruby-phone/             a device made by hand, driven by core's tracker
    ├── .key                its device key
    └── position            a track of positions
```

A device's name is lower-case letters, digits and hyphens, made from what the device or a person
calls it: `Ruby phone` becomes `ruby-phone`. The names `null`, `events`, `pipeline-events`, `tty`,
`stdin`, `stdout` and `stderr` are EiN's own and are refused. The name is what commands, automations and
routing keys use; the device's label is what the pages show, and can be changed without touching
the name.

What a device says about itself is in its attributes:

| Attribute      | What it holds                                                                            |
| -------------- | ---------------------------------------------------------------------------------------- |
| `label`        | What the pages call it                                                                   |
| `class`        | What it is: `phone`, `tracker`, `plug`, `switch`, `light`, `button`, `sensor`, `boat`, … |
| `driver`       | The driver that reads and writes it; none for a device whose endpoints are written to    |
| `manufacturer` | Who made it                                                                              |
| `model`        | Its model                                                                                |
| `firmware`     | The firmware it runs, when it says                                                       |
| `serial`       | Its serial number                                                                        |
| `mac`          | Its network address                                                                      |
| `online`       | Whether it answers now, when its driver can tell                                         |
| `config`       | What a person gave its driver when making it (`device-create --config`)                  |

`attrs /dev/hall-plug` prints them, and [`device-show`](../reference/commands-core.md#device-show) prints the
device with each of its endpoints.

## Endpoints

An endpoint is one thing a device reports or is told. There are three types:

| Type      | What it is                                     | Reading it gives                         | Writing it                                                 |
| --------- | ---------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `log`     | A series of values, or of events               | Each value with its time                 | A value, kept as the next entry                            |
| `track`   | A series of positions                          | Each position with its time              | A position, kept as the next one                           |
| `control` | A value written to change the device, a switch | The states the device reported, in order | A value, checked and sent to the device through its driver |

A log of events is a button's: each entry is a press, such as `single`, `double` or `long`, rather
than a state, and the same press twice is two entries. Into any other log a driver puts a value only
when it differs from the one before (see [How often a reading is kept](#how-often-a-reading-is-kept)).

A control is not a store of what you wrote. Writing `on` to `/dev/hall-plug/switch-0` sends it to the
plug; what reading the control gives is what the plug then reported it was. Until it reports, the
control remembers what was asked, who asked and when (its `requested` attribute), and the device's
page shows the switch as asked, waiting for the device. A press is remembered only once the driver
took it: one it refuses, such as pausing a speaker that plays nothing, is answered with the driver's
error and leaves the page's "pressed … by …" as it was.

What a control takes is its schema:

| Schema      | It takes                                                                                 | Example             |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------- |
| `bool`      | `on` or `off` (`true`, `false`, `1`, `0`, `yes`, `no`), or `toggle`, the opposite of now | a relay, a lamp     |
| `number`    | A number, within the control's least and greatest and in its steps                       | a thermostat's 21.5 |
| `enum`      | One of the control's options                                                             | a heat pump's `eco` |
| `text`      | Any line                                                                                 | a display's message |
| `momentary` | `press`: something the device does once, with no state                                   | a restart, a chime  |

`toggle` needs a state the device has reported; before the first, it is refused. A value the schema
does not take is refused with what it would take, such as `hall-plug/switch-0 takes on, off or
toggle, not '7'`, and nothing is sent.

An endpoint carries attributes of its own: its `label`, `unit` (`°C`, `W`), `deviceClass` (what is
measured: `temperature`, `power`, `door`, `motion`), `retention` (how long its entries are kept,
such as `365 day` or `forever`), `minInterval`, and for a control its `schema`. An endpoint whose
`category` is `diagnostic` or `config` tells of the device itself, such as its own temperature or
its Wi-Fi signal, and the pages put it apart. One the device announced in a way its driver cannot
read is marked `supported: false` and keeps nothing; one the device no longer announces is marked
`retired`, and keeps its history.

## Drivers

A driver is what turns a device's own language into endpoints and back: it reads what the device
sends and appends it to the endpoints, and it sends the device what is written to its controls. A
device names its driver in its `driver` attribute.

| Driver         | Comes with                                      | What it drives                                                                                               |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `tracker`      | EiN itself                                      | A phone, a GPS tracker or a logger: what it posts, or a GPX file written to it, becomes its `position` track |
| `webhook`      | EiN itself                                      | A button, a sensor or a script that posts to an address: each field it sends becomes a reading               |
| `ha-discovery` | the [Automation](../automation/index.md) module | Anything that announces itself over MQTT the way Home Assistant reads: ESPHome, Zigbee2MQTT and others       |
| `shelly`       | the Automation module                           | Shelly's second generation and later, over MQTT                                                              |
| `shelly-gen1`  | the Automation module                           | Shelly's first generation (Plug S, 1, 1PM, 2.5, i3, Dimmer, Bulb, RGBW2), over MQTT                          |

`devices --drivers` lists the drivers running now, with the module each comes from and how many
devices it drives. A module's drivers run while its service does: when the service is stopped, a
write to one of their devices is refused with `<device>'s driver <driver> is not running`, and the
device's **Info** tab says **(not running)** beside the driver.

Most drivers find their devices: a sensor announces itself on the MQTT broker, and its driver makes
the device and its endpoints within seconds. A phone or a GPS logger announces nothing, so a
member of the `devices` group makes it by hand with
[`device-create`](../reference/commands-core.md#device-create), naming its driver:

```bash
# in EiN's terminal
device-create 'Ruby phone' --driver tracker --class phone
```

The driver gives the new device what it has from the start, here an empty `position` track. A device
made without a driver has no endpoints of its own and takes nothing written to the device itself.

### Core's tracker driver

`tracker` reads everything a phone or a GPS tracker sends, and adds each position that has a time to
the device's `position` track:

- what [Traccar Client](https://www.traccar.org/client/) posts, as JSON;
- the OsmAnd protocol, a query such as `?lat=59.32&lon=18.07&timestamp=1794132000`, sent by OsmAnd,
  older Traccar Client versions and many hardware trackers;
- a GPRMC sentence, `?gprmc=$GPRMC,…`;
- a GPX file, as a logger or a tracking app saves it;
- EiN's own positions, a line of JSON each: `{"lat": 59.32, "lng": 18.07, "ts": "2026-11-08T09:00:00Z"}`.

A position at a time the track already has is not added twice, so sending the same file again adds
nothing.

### Core's webhook driver

`webhook` reads what a device or a script posts in the shapes webhooks take, and keeps each field as
a reading on the endpoint of that name, a log made the first time the field comes. Each reading is
kept and published on the bus as a driver's are: a value that repeats the last one is not kept
again, and a number comes at most once every `minInterval` of its endpoint.

| Posted                                                     | Readings                          |
| ---------------------------------------------------------- | --------------------------------- |
| a JSON object, `{"temperature": 21.4, "door": "open"}`     | `temperature` 21.4, `door` `open` |
| a JSON object within one, `{"bme280": {"humidity": 40}}`   | `bme280-humidity` 40              |
| a JSON list of objects                                     | each object's fields, in turn     |
| a form, or the address's query, `?battery=81&event=single` | `battery` 81, `event` `single`    |
| a bare value or a line of text, `21.4`                     | `value` 21.4                      |
| nothing at all, as a button calling its address            | `call` `true`, an event           |

- **Names.** A field's name is made an endpoint's: lower case, anything but letters, digits, `-` and
  `_` a `-`. A field with no name left, or holding a list, is not read; the answer says which.
- **Values.** JSON's numbers, `true`, `false` and text are kept as they are. A form's or a query's
  text that is a number, `true` or `false` is taken as one; `0042` stays text.
- **Time.** A field `ts`, `time` or `timestamp` that reads as a time, a date or epoch seconds or
  milliseconds, is when the post's readings were made, not a reading. Without one, they are kept
  with the time they arrived.
- **Events.** A button's press is news each time, the same one twice included. The fields named in
  the device's `events` setting are kept that way, given when the device is made:
  `device-create 'Porch' --driver webhook --config events=button`.

The answer says how many readings were new, such as `{"taken": 2, "message": "2 of 2 readings new"}`.

## Writing to a device

What is written to the device itself, `/dev/<device>`, is raw input for its driver: a GPX file, a
tracker's post, whatever the driver reads. What is written to an endpoint is a value in EiN's own
form. Both work the same from the terminal, over SFTP, and over HTTP:

```bash
# in EiN's terminal
cat ~/summer-walk.gpx > /dev/old-logger                  # raw input: the tracker driver reads the GPX
echo on > /dev/hall-plug/switch-0                        # a value for a control, sent to the plug
echo 41.5 > /dev/garden-sensor/soil-moisture             # a value appended to a log
cat /dev/hall-plug/switch-0                              # the states the plug reported
tail -f /dev/hall-plug/switch-0-power                    # each new reading, until Ctrl+C
```

A write to a device or a control is answered when its driver has taken it: `echo` fails at once when
the value is refused or the driver is not running, and a control's write that the device has not
taken within 10 seconds fails with `<device> did not answer within 10 s`.

A write to a log or a track endpoint appends to it, with `>` as with `>>`: an endpoint keeps its
history, unlike a file or a log elsewhere in the tree, which `>` empties first. A value written to a
log endpoint by hand, a number, `true` or `false`, or a word, is kept as `{"value": …}`, as a
driver's readings are, so the device's page and `device-history` read it; a line that is a JSON
object is kept as it is. Every log a driver makes has this from its `valueField` attribute, and a log
made by hand under a device gets it with `attrs -s valueField=value <log>`. A value written by hand is
neither throttled nor published on the bus: only what a driver appends is. A control takes `>`;
`>>` on a control would append a state as if the device had reported it, which only the
administrator may do.

Over HTTP the device's file in the tree takes the same writes at `/file/dev/<device>` and
`/file/dev/<device>/<endpoint>`, where a body of a bare value, such as `21.4`, is kept as
`{"value": 21.4}`. A device cannot sign in, so it sends its **device key** with them, which opens its
own folder for these writes and nothing else; see
[Devices and their keys](../admin/devices.md#device-keys).

## Readings on the bus

Every reading a driver keeps is also published on a routing key, a name a message goes out under,
which any queue or log bound to it gets a copy of. Only the administrator binds one, since a queue
bound to `dev.#` hears every device whoever may read it; the automations of the
[Automation](../automation/automations.md) module read them for everyone else, each only what its
owner may read:

| Routing key               | What comes on it                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `dev.<device>.<endpoint>` | Each new value of the endpoint: a reading, a press, a state the device reported, a position |
| `dev.<device>`            | The device coming online or going offline                                                   |

A message is a line of JSON that says whose it is, so it can be read without its key:

```text
{"device":"hall-sensor","endpoint":"temperature","value":21.4,"unit":"°C","at":"2026-11-08T07:42:10.512Z"}
{"device":"porch-button","endpoint":"input-0","value":"single","event":true,"at":"2026-11-08T18:03:55.120Z"}
{"device":"ruby-phone","endpoint":"position","fix":{"lat":59.3251,"lng":18.0711,"speed":1.2},"at":"2026-11-08T12:10:04.000Z"}
{"device":"hall-plug","online":false,"at":"2026-11-08T22:15:02.004Z"}
```

`value` is a number, a word, or `true` and `false` for on and off; `event` marks a press; `fix` is a
position, its speed in metres per second; `at` is when it was read. A reading the device replayed,
as an MQTT broker does with the last one after EiN reconnects, also has `"retained": true`. A GPX
file with thousands of positions publishes only its newest.

In a key, `*` stands for one part and `#` for any number of them, none included:
`dev.*.temperature` is every endpoint called `temperature`, and `dev.hall-plug.#` everything the hall
plug says, its coming and going included.

### A queue bound to keys

A queue bound to keys keeps every message that comes on them until it is taken, whether or not
anyone is reading. The administrator makes one for what they want, such as every press of the porch
button:

```bash
# in EiN's terminal, as the administrator
mkqueue -k 'dev.porch-button.#' ~/presses
queue-peek ~/presses     # the next ones, left in the queue
cat ~/presses            # takes them out as it prints them
```

Remove it with `rm ~/presses` when you no longer want it, or it keeps filling.

### A log bound to keys

A log keeps what comes on its keys as entries with their times, for as long as you say:

```bash
# in EiN's terminal, as the administrator
mklog -k 'dev.*.temperature' -r '90 day' ~/temperatures
log-read ~/temperatures --since 1d
log-read ~/temperatures --since 30d --bucket 1d --field value --agg max
```

## How often a reading is kept

A driver hands EiN every reading it hears, and EiN keeps and publishes it only when it is news:

- A value the same as the endpoint's last is not kept again.
- A number is kept at most once every `minInterval` seconds, the endpoint's own attribute. One that
  comes sooner waits for the end of the interval, and only the newest of those is kept, so the last
  of a burst is never lost.
- On and off, words, positions and every press are kept as they come.

A sensor that reports its power every second therefore costs a row every ten seconds or so while it
changes, and none while it holds still. The [Automation](../automation/index.md#settings) module
gives the endpoints it makes a `minInterval` from its **Seconds between readings** setting.

## Related pages

- [Devices](../guide/devices.md): the Devices pages, switching, history, and a phone as a tracker.
- [Devices and their keys](../admin/devices.md): who may do what, and what a device key opens.
- [Writing a driver](../develop/drivers.md): the driver API, for module authors.
- [The tree](tree.md): `/dev` among the other folders.
- [Changes and pipelines](pipelines.md): routing keys, queues and logs in general.
- [Automation](../automation/index.md): the MQTT drivers and automations.
