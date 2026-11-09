# Writing a driver

A driver teaches EiN a kind of device: it turns what such a device sends into endpoints under
`/dev/<device>`, and sends the device what is written to its controls. Core has two drivers of its
own, `tracker`, for phones and GPS loggers, and `webhook`, for anything that posts its readings; the [Automation](../automation/index.md) module brings
three for MQTT devices. This page is for developers who write one in a module. It assumes
[Writing a module](modules.md), and [Devices, endpoints and drivers](../concepts/devices.md) for what
a device, an endpoint and a control are.

## What a driver does

| Direction      | What happens                                                                                                | Through                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Device to EiN  | The driver hears the device, makes the device and its endpoints when they are new, and appends each reading | `ensureDevice`, `ensureEndpoint`, `append`, `online` |
| Written to EiN | What a person, a script or the device itself writes to `/dev/<device>` reaches the driver as raw input      | the driver's `input`                                 |
| EiN to device  | A value written to one of the device's controls, checked against its schema, reaches the driver to send on  | the driver's `write`                                 |

A driver that finds its devices, such as one listening on a broker, makes them itself. One whose
devices announce nothing, such as core's `tracker`, waits for a person to make one with
`device-create <name> --driver <driver>`, and gets its `setup` called to give it its first endpoints.

## Where a driver runs

A driver is registered by a service of its module, in EiN's own process, and lives as long as the
service runs. The service's `start.sh` runs a `#!ts` command that registers the driver and waits
until the service is stopped:

```ts
#!ts
/**
 * weather-bridge — the weather-bridge service: registers the weather-json driver until stopped.
 */
import type { CmdReturn, Command } from '@ein/client';
import { weatherDriver } from '@weather/driver';

const weatherBridge = async (cmd: Command): CmdReturn => {
  const devices = cmd.sys.devices;
  if (!devices) {
    await cmd.writeError('weather-bridge: this EiN keeps no devices\n');
    return 1;
  }
  const stopped = new Promise<void>((resolve) => cmd.onInterrupt(resolve));
  const unregister = devices.registerDriver('weather-json', weatherDriver(cmd, devices));
  await cmd.writeLn('weather-bridge: driving weather-json');
  try {
    await stopped;
  } finally {
    unregister();
  }
  return 0;
};

weatherBridge.spec = {
  name: 'weather-bridge',
  admin: true,
  daemon: true,
  effect: 'write' as const,
  json: false,
  description: 'Drive weather stations that post their readings as JSON (the weather-bridge service)',
  examples: ['service restart weather-bridge'],
};

export default weatherBridge;
```

```bash
# services/weather-bridge/start.sh
weather-bridge
```

`cmd.sys.devices` is core's device API, `ModuleDevices` in `@ein/client`. A service runs as the
administrator, so `cmd.access` writes any device; pass it to every call. `registerDriver` answers a
function that unregisters the driver; while it is unregistered, a write to one of its devices is
refused with `<device>'s driver weather-json is not running`, and the device's page says
**(not running)**. A driver's name is lower-case letters, digits, `-` and `_`, and a second
registration under the same name replaces the first.

## The driver

`registerDriver(name, driver)` takes an object with these members:

| Member         | Needed | What it is                                                                                                                                              |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description`  | yes    | One line for `devices --drivers`                                                                                                                        |
| `module`       | no     | The module that brings it, for `devices --drivers`                                                                                                      |
| `config`       | no     | What a person gives when making a device with it: `{ name, label, type, required? }`, `type` being `string`, `number` or `url`                          |
| `input(raw)`   | no     | Raw input written to one of its devices; without it, its devices take none                                                                              |
| `write(cmd)`   | no     | A value written to one of its devices' controls, to send to the device                                                                                  |
| `setup(name)`  | no     | A person made one of its devices with `device-create --driver`: give it the endpoints it has from the start                                             |
| `forget(name)` | no     | One of its devices is being forgotten: let go of whatever would make it again, such as a retained announcement on a broker. Called before it is removed |

Core awaits each hook while the write that caused it waits, so whoever wrote hears at once whether
it was taken. A hook refuses by throwing: the message reaches the writer, as `echo`'s error in the
terminal or as the body of a `400` over HTTP, after the device's name (and the control's, for a
`write`).

### `input`

What is written to `/dev/<device>`, from the terminal (`cat ride.gpx > /dev/old-logger`), over SFTP,
or over HTTP to `/file/dev/<device>`, arrives whole, once the writer closes, as a `DriverInput`:

| Field         | What it holds                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `device`      | The device's name                                                                                        |
| `path`        | `/dev/<device>`                                                                                          |
| `attrs`       | The device's attributes: its `label`, `class`, `config` and the rest                                     |
| `bytes`       | What was written                                                                                         |
| `contentType` | The type it came with over HTTP; unset from the terminal or SFTP                                         |
| `query`       | The query it came with over HTTP, without `?` or the device's key; a `GET` with the key brings only this |
| `by`          | Who wrote it: an account's name, or `device:<name>` for a write made with the device's key               |

It answers an optional `{ taken, message }`, which an HTTP writer gets back as JSON: how many values
were new, and a word for whoever sent them.

### `write`

A value written to a control arrives as a `DriverWrite` once core has checked it against the
control's `schema`, so `value` is already what the control takes: `true` or `false` for `bool`, a
number within its limits for `number`, one of its options for `enum`, a line for `text`, `press` for
`momentary`, with `toggle` turned into the opposite of the state the device last reported. Its
fields are `device`, `endpoint`, `path`, the device's `attrs`, the control's `endpointAttrs`,
`value` and `by`.

Send it, and return once the device or its broker has taken it. Do not append the new state here:
append what the device reports back, which is what reading the control gives. Until then the
control's `requested` attribute holds what was asked, by whom and when, and its page shows it as
waiting for the device. A `write` that has not returned after 10 seconds is answered
`<device> did not answer within 10 s`.

## Writing devices and endpoints

What a driver hears it writes through the same `ModuleDevices`:

| Call                                                          | What it does                                                                                                                                                                                    |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ensureDevice(access, name, attrs)`                           | Makes `/dev/<name>` when it is missing, else sets the attributes given where they differ. A label is set only when the device is made, so a person's `device-label` is kept. Answers the path   |
| `ensureEndpoint(access, device, name, type, attrs, mode?)`    | Makes the endpoint `log`, `track` or `control` when it is missing, else sets the attributes given where they differ; refuses one of another type. Answers the path                              |
| `removeEndpoint(access, device, endpoint)`                    | Removes an endpoint and its history: one the device no longer has, or one that changed type                                                                                                     |
| `append(access, device, endpoint, value, { at?, retained? })` | A reading for a log or a control, or a position `{ lat, lng, alt?, speed?, course?, accuracy? }` for a track: kept, and published on `dev.<device>.<endpoint>`. Answers whether it was kept now |
| `appendFixes(access, device, endpoint, fixes)`                | Many positions for a track at once, each with its `ts`, such as a file's. Answers how many were new; publishes the newest                                                                       |
| `online(access, device, up)`                                  | The device came or went: sets its `online` attribute when it changed, and publishes `{ device, online }` on `dev.<device>`                                                                      |
| `forget(access, device)`                                      | Removes the device and everything under it, after calling the driver's own `forget`                                                                                                             |

A device's name, and an endpoint's, is lower-case letters, digits, `-` and `_`, at most 63 long;
`deviceName(text)` from `@ein/api` makes one from what a device calls itself. EiN's own names in `/dev`
are refused.

`append` does the throttling, so a driver hands it every reading: a value the same as the endpoint's
last is dropped, a number that comes sooner than the endpoint's `minInterval` waits for the end of
it and is replaced by any later one, and an event endpoint keeps every press. Pass `retained: true`
for a value the device or its broker replayed rather than read now; it is kept the same way and
published marked as such.

The attributes a driver gives an endpoint:

| Attribute     | What it says                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | What the pages call it; set only when it is made                                                                                                     |
| `unit`        | `°C`, `W`, `%`: shown beside its values and published with them                                                                                      |
| `deviceClass` | What is measured, as Home Assistant names it: `temperature`, `power`, `humidity`, `illuminance`, `energy`, `door`                                    |
| `category`    | `diagnostic` or `config` for what tells of the device itself; the pages put it apart                                                                 |
| `events`      | `true` for a log whose entries are events, a button's presses, rather than states                                                                    |
| `minInterval` | The fewest seconds between two kept numbers                                                                                                          |
| `retention`   | How long its entries are kept: `30 day`, `365 day`, `forever`; give it when the endpoint is made                                                     |
| `schema`      | A control's: `{ type: 'bool' }`, `{ type: 'number', min?, max?, step? }`, `{ type: 'enum', options }`, `{ type: 'text' }` or `{ type: 'momentary' }` |
| `supported`   | `false` for one the driver cannot read; it keeps nothing                                                                                             |
| `retired`     | `true` for one the device no longer announces; its history stays                                                                                     |

The device's card and page take its main value from the first of `temperature`, `power`, `humidity`,
`illuminance` and `energy` among its readings, so give `deviceClass` where you know it. An endpoint
is made with its device's owner, group and access list, a reading or a control `0660` and a track
`0770`, unless `mode` says otherwise
([Devices and their keys](../admin/devices.md#who-may-do-what)): the members of `devices` read it,
switch a control and share it, and whoever the device is shared with gets the endpoint too. A device
`ensureDevice` makes is `0770`, the administrator's and the `devices` group's. A log endpoint keeps a bare
value written to it by hand as `{ value }` (its `valueField`), as `append` keeps a driver's.

## An example: a weather station that posts JSON

A weather station posts `{"temperature": 4.2, "humidity": 81, "wind": 5.5}` to EiN every minute. A
member of `devices` makes the station and gives it its key; the station posts to
`/file/dev/<device>` with it:

```bash
# in EiN's terminal, as a member of devices
device-create 'Garden station' --driver weather-json --class sensor
device-key garden-station --new --origin https://ein.wrenfield.example
```

```ts
// lib/driver.ts, imported as @weather/driver
import type { Command, Driver, ModuleDevices } from '@ein/client';
import type { EndpointAttrs } from '@ein/api';

const READINGS: Record<string, EndpointAttrs> = {
  temperature: { label: 'Temperature', unit: '°C', deviceClass: 'temperature' },
  humidity: { label: 'Humidity', unit: '%', deviceClass: 'humidity' },
  wind: { label: 'Wind', unit: 'm/s', deviceClass: 'wind_speed' },
};

/** A station that posts its readings as one JSON object: each known field becomes a log. */
export const weatherDriver = (cmd: Command, devices: ModuleDevices): Driver => ({
  description: 'A weather station that posts its readings as JSON',
  module: 'weather',
  async setup(device) {
    for (const [name, attrs] of Object.entries(READINGS)) {
      await devices.ensureEndpoint(cmd.access, device, name, 'log', { ...attrs, minInterval: 60, retention: '365 day' });
    }
  },
  async input(raw) {
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(new TextDecoder().decode(raw.bytes));
    } catch {
      throw new Error('takes a JSON object of readings');
    }
    let taken = 0;
    for (const name of Object.keys(READINGS)) {
      const value = body[name];
      if (typeof value === 'number' && await devices.append(cmd.access, raw.device, name, value)) taken++;
    }
    await devices.online(cmd.access, raw.device, true);
    return { taken, message: `${taken} new readings` };
  },
});
```

`setup` gives the station its three logs as soon as it is made, so its page shows them before the
first post. A body that is not JSON is refused with `garden-station: takes a JSON object of readings`.
A test of the driver can call its hooks directly, with a stub in place of `ModuleDevices`.

## A tab on the device page

A module that knows more about some devices adds a tab to their page with a panel in its
`ui/nav.json`, in the slot `device.tabs`. The tab draws one of the module's routes, with
`{path}` replaced by the device's path, `/dev/<device>`, URI-encoded. `when` keeps it to the devices
that have an endpoint of a type; without it, every device gets the tab. This is the Archive's
**Trips** tab:

```json
{
  "panels": [
    { "id": "archive.trips", "slot": "device.tabs", "label": "Trips", "icon": "map-route", "route": "/trips?device={path}", "when": { "has": "track" } }
  ]
}
```

The route is one the module declares in `mod.json`'s `ui.routes`, like any page; it reads the device
from its query. The tab comes after the page's own **Overview**, **History** and **Info**, its id is
the page's `?tab=` (`/devices/sailboat?tab=archive.trips`), and an administrator or a person can
rename, reorder or hide it like any panel
([Change the panels inside pages](../guide/customizing.md#change-the-panels-inside-pages)).

## The contract

Drivers came with core's module contract 0.14.0: give the module `"coreApi": "^0.14.0"`
([The module manifest](manifest.md#coreapi)). What a driver uses is in it:

| Import        | What it gives                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@ein/client` | `ModuleDevices`, `Driver`, `DriverInput`, `DriverWrite`, `DriverAnswer`, `AppendOptions`                                                                            |
| `@ein/api`    | `DeviceAttrs`, `EndpointAttrs`, `EndpointType`, `ControlSchema`, `DeviceValue`, `DeviceFix`, `DeviceMessage`, `deviceName`, `deviceRoutingKey`, `DEVICES_GROUPNAME` |
| `@ein/paths`  | `DEV_PATH` and `devicePath(name)`                                                                                                                                   |

## If something goes differently

| What you see                                                                   | Why                                                                               | What to do                                                                           |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `<device>'s driver <name> is not running`                                      | The service that registers it is stopped, or registered it under another name     | `service status <service>`; check the name the device's `driver` attribute holds     |
| `<device>'s driver <name> takes nothing written to the device`                 | The driver has no `input`                                                         | Write to the device's endpoints, or give the driver an `input`                       |
| `<device> has no driver to read what is written to it: write to its endpoints` | The device was made without `--driver`                                            | Make it again with `--driver`, or set it with `attrs -s driver=<name> /dev/<device>` |
| `<path> is a log, not a control: remove it first`                              | `ensureEndpoint` was asked for another type than the endpoint has                 | `removeEndpoint` it first; its history goes with it                                  |
| `<device> did not answer within 10 s`                                          | The driver's `write` did not return in time                                       | Return once the message is sent, not once the device has switched                    |
| A reading never shows, though `append` is called                               | It repeats the last one, or waits for its `minInterval`; `append` answers `false` | Nothing, for a repeat; a lower `minInterval` for a faster endpoint                   |

## Related pages

- [Devices, endpoints and drivers](../concepts/devices.md): endpoints, controls and the routing keys.
- [Writing a module](modules.md): services, `#!ts` commands and pages.
- [The module manifest](manifest.md): `coreApi`, `ui.routes`.
- [Your sidebar and top bar](../guide/customizing.md#change-the-panels-inside-pages): panels and their slots.
- [Automation](../automation/index.md): three drivers at full size, in the `module-automation` repository.
