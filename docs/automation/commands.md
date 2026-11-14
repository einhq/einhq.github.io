<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Automation commands

The commands the automation module adds. They are there once the module is installed. 15 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[automation-adopt](#automation-adopt) · [automation-bridge](#automation-bridge) · [automation-check](#automation-check) · [automation-disable](#automation-disable) · [automation-enable](#automation-enable) · [automation-engine](#automation-engine) · [automation-found](#automation-found) · [automation-ignore](#automation-ignore) · [automation-new](#automation-new) · [automation-set](#automation-set) · [automation-show](#automation-show) · [automation-snmp](#automation-snmp) · [automation-status](#automation-status) · [automation-trigger](#automation-trigger) · [automations](#automations)

## A

### `automation-adopt`

Make something found on the network a device: a Shelly is pointed at the broker and restarted, a camera, a printer, a Cast speaker or anything else is added with a driver that asks it itself (for members of the devices group)

<small>changes things</small>

```text
automation-adopt [--user=<string>] [--password=<string>] <id>
```

| Argument | What it is                                                                      |
| -------- | ------------------------------------------------------------------------------- |
| `<id>`   | what automation-found calls it: its hardware address without colons, or its IP. |

| Option                | What it does                                             |
| --------------------- | -------------------------------------------------------- |
| `--user=<string>`     | an ONVIF camera's user.                                  |
| `--password=<string>` | an ONVIF camera's password, kept in the device's secret. |

```bash
automation-adopt a8032ab12345
automation-adopt 7c2ebd614055
automation-adopt ec71db0a1b2c --user admin --password s3cret
```

With `JSON_OUTPUT=1`: AdoptAnswer: id, label, driver, broker, restarted, device.

### `automation-bridge`

Hear devices on the MQTT broker and drive them as devices under /dev (the ha-discovery and shelly drivers), sending them what is written to their controls (the automation-bridge service)

<small>administrators only · changes things</small>

```text
automation-bridge
```

```bash
service restart automation-bridge
```

### `automation-check`

What is wrong with an automation, and what each of its nodes would say now, from the latest readings the caller may read; no action is run.

<small>reads only</small>

```text
automation-check [--yaml=<string>] <automation>
```

| Argument       | What it is                            |
| -------------- | ------------------------------------- |
| `<automation>` | <name>, <module>/<name>, or its file. |

| Option            | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `--yaml=<string>` | check this YAML instead, a draft not yet written. |

```bash
automation-check hall-light
```

With `JSON_OUTPUT=1`: AutomationCheck: name, problems, nodes (each node: value, at, due, problem, messages), endpoints (endpoint, readable, value, at)

### `automation-disable`

Turn an automation off: a person's by whoever may change its file, a module's by the administrator.

<small>changes things</small>

```text
automation-disable <automation>
```

| Argument       | What it is                            |
| -------------- | ------------------------------------- |
| `<automation>` | <name>, <module>/<name>, or its file. |

```bash
automation-disable hall-light
```

### `automation-enable`

Turn an automation on: a person's by whoever may change its file, a module's by the administrator.

<small>changes things</small>

```text
automation-enable <automation>
```

| Argument       | What it is                            |
| -------------- | ------------------------------------- |
| `<automation>` | <name>, <module>/<name>, or its file. |

```bash
automation-enable hall-light
```

### `automation-engine`

Run the automations under /etc/automations and /etc/automations.d when a reading, a press, a device coming or going or the clock says so, each as its owner (the automation-engine service)

<small>administrators only · changes things</small>

```text
automation-engine
```

```bash
service restart automation-engine
```

### `automation-found`

The devices on the network the network listener heard over mDNS, SSDP and WS-Discovery: what each is, whether it can become a device and whether it is one already (for members of the devices group)

<small>reads only</small>

```text
automation-found [--addable] [--all] [<id>]
```

| Argument | What it is                                                             |
| -------- | ---------------------------------------------------------------------- |
| `[<id>]` | one host, by its id or address: it, with all the listener heard of it. |

| Option      | What it does                                                        |
| ----------- | ------------------------------------------------------------------- |
| `--addable` | only the ones that can become a device of automation’s.             |
| `--all`     | every one, the devices already under /dev and the ignored ones too. |

```bash
automation-found
automation-found --addable
automation-found --all
automation-found 7c2ebd614055
```

With `JSON_OUTPUT=1`: FoundAnswer: round, broker, devices [{id, ip, mac, names, seen, services, kind, vendor, label, model, firmware, class, addable, adopt, connect, device, ignored}]; with an id, FoundDetail: one of those and host {ip, mac, names, seen, mdns, ssdp}.

### `automation-ignore`

Leave devices found on the network out of automation-found, or take them back with --undo (for members of the devices group)

<small>changes things</small>

```text
automation-ignore [--undo] <id>
```

| Argument | What it is                                                  |
| -------- | ----------------------------------------------------------- |
| `<id>`   | what automation-found calls it; more than one may be given. |

| Option   | What it does    |
| -------- | --------------- |
| `--undo` | take them back. |

```bash
automation-ignore d0ad08c5e709
automation-ignore d0ad08c5e709 --undo
```

### `automation-new`

Make an automation under /etc/automations, empty or from a starting point with its slots set to your devices; one with slots set is checked, and refused with problems (members of the automation group)

<small>changes things</small>

```text
automation-new [--from=<string>] [--set=<string>] [--description=<string>] [--dry-run] [--examples] <name>
```

| Argument | What it is                             |
| -------- | -------------------------------------- |
| `<name>` | its name: letters, digits, ., - and _. |

| Option                   | What it does                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--from=<string>`        | a starting point: empty, motion-light, button-toggle, heater, morning, inbox, dusk-to-dawn, tour.                                           |
| `--set=<string>`         | a slot of the starting point, <slot>=<value>: an endpoint as <device>/<endpoint>, none to leave an optional one out; --examples lists them. |
| `--description=<string>` | what it does, a sentence (the starting point says it when not given)                                                                        |
| `--dry-run`              | write nothing: say what is wrong with it, and in text the YAML it would write.                                                              |
| `--examples`             | list the starting points and their slots.                                                                                                   |

```bash
automation-new hall-light --from motion-light
automation-new hall-light --from motion-light --set motion=hall-sensor/motion --set lamp=hall-lamp/switch-0 --set light-level=none --dry-run
automation-new --examples
```

With `JSON_OUTPUT=1`: AutomationSetAnswer: name, path, written, created, problems.

### `automation-set`

Write an automation's YAML, made when it is new; one with problems is refused unless --draft.

<small>changes things</small>

```text
automation-set [--yaml=<string>] [--json=<string>] [--draft] [--dry-run] <automation>
```

| Argument       | What it is          |
| -------------- | ------------------- |
| `<automation>` | <name> or its file. |

| Option            | What it does                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `--yaml=<string>` | the YAML, written as given.                                                                                     |
| `--json=<string>` | its graph as JSON, written as YAML.                                                                             |
| `--draft`         | write it even with problems, unless it is not YAML; it is not run until they are gone.                          |
| `--dry-run`       | write nothing: say what is wrong with it as automation-check does, devices you may not read or switch among it. |

```bash
automation-set hall-light < hall-light.yaml
automation-set hall-light --yaml "$text" --draft
```

With `JSON_OUTPUT=1`: AutomationSetAnswer: name, path, written, created, problems.

### `automation-show`

An automation's YAML, whose it is, whether it runs and what is wrong with it; in JSON mode also its graph with every node placed.

<small>reads only</small>

```text
automation-show <automation>
```

| Argument       | What it is                            |
| -------------- | ------------------------------------- |
| `<automation>` | <name>, <module>/<name>, or its file. |

```bash
automation-show hall-light
```

With `JSON_OUTPUT=1`: AutomationDetail: name, path, module, owner, description, enabled, running, nodes, problems, writable, text, spec.

### `automation-snmp`

Walk a device's SNMP objects under an OID (the system group unless one is given), for members of the devices group.

<small>reads only</small>

```text
automation-snmp [--community=<string>] [--port=<string>] [--limit=<string>] <host> [<oid>]
```

| Argument  | What it is                                      |
| --------- | ----------------------------------------------- |
| `<host>`  | its address.                                    |
| `[<oid>]` | where to walk from: 1.3.6.1.2.1.1 unless given. |

| Option                 | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `--community=<string>` | the community to ask with, when not CFG_AUTOMATION_SNMP_COMMUNITY. |
| `--port=<string>`      | its agent’s port, when not 161.                                    |
| `--limit=<string>`     | the most objects to answer (5000)                                  |

```bash
automation-snmp 192.0.2.40
automation-snmp 192.0.2.40 1.3.6.1.2.1.25.2.3
automation-snmp 192.0.2.40 1.3.6.1.4.1.4526 --community home
```

With `JSON_OUTPUT=1`: SnmpObject[]: oid, type, value.

### `automation-status`

Whether the automation bridge hears the MQTT broker, which drivers it registered, how many devices under /dev they drive, what they cannot read, and the automations; or, given one, what each of its nodes last did.

<small>reads only</small>

```text
automation-status [--brief] [--checks] [--automations] [--streams] [<automation>]
```

| Argument         | What it is                           |
| ---------------- | ------------------------------------ |
| `[<automation>]` | one automation, whose nodes to show. |

| Option          | What it does                                                      |
| --------------- | ----------------------------------------------------------------- |
| `--brief`       | one line, as the services list shows it.                          |
| `--checks`      | the checks health reads, as JSON.                                 |
| `--automations` | one line on the automation engine, as the services list shows it. |
| `--streams`     | whether the restreamer answers, and how many streams it has.      |

```bash
automation-status
automation-status --brief
automation-status --streams
automation-status hall-light
```

With `JSON_OUTPUT=1`: AutomationStatus: configured, url, running, connected, since, drivers, devices, endpoints, messages, unsupported, lastError, automations {running, actions, problems}; with an automation, AutomationRunStatus: name, running, problems, nodes; with --streams, RestreamerStatus: configured, url, rtsp, answering, streams, error.

### `automation-trigger`

Press a button node of a running automation: what it is wired to runs now, as its owner.

<small>changes things</small>

```text
automation-trigger <automation> <node>
```

| Argument       | What it is                            |
| -------------- | ------------------------------------- |
| `<automation>` | <name>, <module>/<name>, or its file. |
| `<node>`       | the button node.                      |

```bash
automation-trigger hall-light try-it
```

### `automations`

The automations, whose each is, whether it runs, and what is wrong with those that do not.

<small>reads only</small>

```text
automations
```

```bash
automations
```

With `JSON_OUTPUT=1`: AutomationSummary[]: name, path, module, owner, description, enabled, running, nodes, problems, writable.
