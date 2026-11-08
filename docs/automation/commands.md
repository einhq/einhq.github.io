<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Automation commands

The commands the automation module adds. They are there once the module is installed. 12 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[automation-bridge](#automation-bridge) · [automation-rule-check](#automation-rule-check) · [automation-rules](#automation-rules) · [automation-status](#automation-status) · [device-create](#device-create) · [device-forget](#device-forget) · [device-history](#device-history) · [device-label](#device-label) · [device-set](#device-set) · [device-show](#device-show) · [device-tracker](#device-tracker) · [devices](#devices)

## A

### `automation-bridge`

Hear devices on the MQTT broker, keep them under /archive/devices, publish their readings and send what device-set asks (the automation-bridge service)

<small>administrators only · changes things</small>

```text
automation-bridge
```

```bash
service restart automation-bridge
```

### `automation-rule-check`

Check an automation rule: what makes it run, whether its conditions hold now and whose rights its lines run with, or why it is not run; with --run, run its lines now.

<small>reads only</small>

```text
automation-rule-check [--run] <rule>
```

| Argument | What it is                                                                    |
| -------- | ----------------------------------------------------------------------------- |
| `<rule>` | the rule by name (a file in /etc/automation/rules), or a path to a rule file. |

| Option  | What it does                                |
| ------- | ------------------------------------------- |
| `--run` | run its lines now, as you, until one fails. |

```bash
automation-rule-check hall-light
automation-rule-check ~/draft.yaml
automation-rule-check hall-light --run
```

With `JSON_OUTPUT=1`: RuleCheck: name, path, owner, problem, description, when, if [{condition, holds}], then, ran [{line, code}].

### `automation-rules`

Run the rules under /etc/automation/rules when a reading, a press, a device coming or going or the clock says so, each as its file's owner (the automation-rules service)

<small>administrators only · changes things</small>

```text
automation-rules
```

```bash
service restart automation-rules
```

### `automation-status`

Whether the automation bridge hears the MQTT broker, how many devices and entities it found, and which it cannot read.

<small>reads only</small>

```text
automation-status [--brief] [--checks] [--rules]
```

| Option     | What it does                                                  |
| ---------- | ------------------------------------------------------------- |
| `--brief`  | one line, as the services list shows it.                      |
| `--checks` | the checks health reads, as JSON.                             |
| `--rules`  | one line on the rules service, as the services list shows it. |

```bash
automation-status
automation-status --brief
```

With `JSON_OUTPUT=1`: AutomationStatus: configured, url, running, connected, since, sources, devices, entities, messages, unsupported, lastError, rules {count, runs, problems}.

## D

### `device-create`

Make a device by hand, which no source announces: a GPS logger whose files are imported, or something a phone will post the position of (--position)

<small>changes things</small>

```text
device-create [--label=<string>] [--manufacturer=<string>] [--model=<string>] [--position] <name>
```

| Argument | What it is                                      |
| -------- | ----------------------------------------------- |
| `<name>` | what to call it; its node name is made from it. |

| Option                    | What it does                                                     |
| ------------------------- | ---------------------------------------------------------------- |
| `--label=<string>`        | what its page calls it, when not the name.                       |
| `--manufacturer=<string>` | who made it.                                                     |
| `--model=<string>`        | its model.                                                       |
| `--position`              | give it a position, kept as a track, for a tracker or GPX files. |

```bash
device-create Sailboat --position
device-create 'Old logger' --model 'eTrex 30' --position
```

With `JSON_OUTPUT=1`: DeviceCreated: device, path, track.

### `device-forget`

Remove a device and its history, and stop the broker replaying its announcements; one that is still on comes back when it announces itself.

<small>changes things</small>

```text
device-forget <device>
```

| Argument   | What it is                       |
| ---------- | -------------------------------- |
| `<device>` | the device, by its name or path. |

```bash
device-forget old-sensor
```

### `device-history`

Show an entity's readings, oldest first: the latest, those since a time, or a time range summed up per interval (an average an hour, a maximum a day) — a temperature over a week, a plug's power, a button's presses.

<small>reads only</small>

```text
device-history [-n <string>] [--since=<string>] [--until=<string>] [--bucket=<string>] [--agg=<string>] <entity>
```

| Argument   | What it is                        |
| ---------- | --------------------------------- |
| `<entity>` | the entity, as <device>/<entity>. |

| Option              | What it does                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `-n <string>`       | at most this many readings or intervals, the latest (100 when not given)                                     |
| `--since=<string>`  | from this time on: ISO 8601, or a duration such as 24h or 7d meaning that long ago.                          |
| `--until=<string>`  | before this time, as --since takes it.                                                                       |
| `--bucket=<string>` | sum the readings up per interval of this length: 15m, 1h, 1d (a day in the system time zone)                 |
| `--agg=<string>`    | with --bucket, how: avg, min, max, sum, count, first, last (avg when not given; on and off count as 1 and 0) |

```bash
device-history hall-sensor/temperature -n 50
device-history hall-sensor/temperature --since 7d --bucket 1h
device-history hall-plug/switch-0-power --since 30d --bucket 1d --agg max
```

With `JSON_OUTPUT=1`: DeviceHistory: device, entity, unit, bucket {seconds, aggregate}, readings [{at, value, count}].

### `device-label`

Name a device or one of its entities, as its page shows it; its node name and routing keys stay.

<small>changes things</small>

```text
device-label <target> <label>
```

| Argument   | What it is                        |
| ---------- | --------------------------------- |
| `<target>` | the device, or <device>/<entity>. |
| `<label>`  | what to call it.                  |

```bash
device-label hall-plug 'Hall lamp'
device-label hall-sensor/temperature 'Hall temperature'
```

### `device-set`

Switch a device on or off, or set one of its entities to a value: on, off or toggle for a switch or a light, a number, one of the options of a choice, press for an action.

<small>changes things</small>

```text
device-set <entity> <value>
```

| Argument   | What it is                                     |
| ---------- | ---------------------------------------------- |
| `<entity>` | the entity, as <device>/<entity>.              |
| `<value>`  | on, off, toggle, a number, an option or press. |

```bash
device-set hall-plug/switch-0 toggle
device-set heater/target 21
```

With `JSON_OUTPUT=1`: DeviceSetResult: device, entity, value.

### `device-show`

Show a device and each of its entities (readings, switches, buttons) with its latest value and whether it can be set.

<small>reads only</small>

```text
device-show <device>
```

| Argument   | What it is                       |
| ---------- | -------------------------------- |
| `<device>` | the device, by its name or path. |

```bash
device-show hall-plug
```

With `JSON_OUTPUT=1`: DeviceInfo: the DeviceSummary fields, sw, mac and entityList (EntitySummary[]: name, path, label, kind, unit, supported, retired, settable, last {value, at})

### `device-tracker`

Show, turn on, replace or turn off the link a phone or GPS tracker posts a device's position to, with the QR code that sets Traccar Client up.

<small>reads only</small>

```text
device-tracker [--new] [--off] [--origin=<string>] <device>
```

| Argument   | What it is                       |
| ---------- | -------------------------------- |
| `<device>` | the device, by its name or path. |

| Option              | What it does                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `--new`             | turn live tracking on, or replace the link; the one before it stops working.                          |
| `--off`             | turn live tracking off.                                                                               |
| `--origin=<string>` | the address the phone reaches EiN at, such as https://ein.example; adds the full URL and the QR code. |

```bash
device-tracker sailboat
device-tracker sailboat --new --origin https://ein.example
```

With `JSON_OUTPUT=1`: DeviceTracker: whether live tracking is on, the link, and the QR code.

### `devices`

List the devices the automation bridge found (sensors, plugs, buttons), each with whether it is online and its main reading.

<small>reads only</small>

```text
devices [--online]
```

| Option     | What it does                      |
| ---------- | --------------------------------- |
| `--online` | only the devices that are online. |

```bash
devices
devices --online
```

With `JSON_OUTPUT=1`: DeviceSummary[]: name, path, label, source, manufacturer, model, online, entities, lastAt, main {entity, label, value, unit}.
