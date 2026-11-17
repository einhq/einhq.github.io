<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Devices commands

The commands the devices module adds. They are there once the module is installed. 6 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[devices-adopt](#devices-adopt) · [devices-bridge](#devices-bridge) · [devices-found](#devices-found) · [devices-ignore](#devices-ignore) · [devices-snmp](#devices-snmp) · [devices-status](#devices-status)

## D

### `devices-adopt`

Make something found on the network a device: a Shelly is pointed at the broker and restarted, a camera, a printer, a Cast or DLNA speaker or TV or anything else is added with a driver that asks it itself (for members of the devices group)

<small>changes things</small>

```text
devices-adopt [--user=<string>] [--password=<string>] <id>
```

| Argument | What it is                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `<id>`   | what devices-found calls it: a Cast device’s or DLNA renderer’s own id, else its hardware address without colons, else its IP. |

| Option                | What it does                                             |
| --------------------- | -------------------------------------------------------- |
| `--user=<string>`     | an ONVIF camera's user.                                  |
| `--password=<string>` | an ONVIF camera's password, kept in the device's secret. |

```bash
devices-adopt a8032ab12345
devices-adopt 7c2ebd614055
devices-adopt ec71db0a1b2c --user admin --password s3cret
```

With `JSON_OUTPUT=1`: AdoptAnswer: id, label, driver, broker, restarted, device.

### `devices-bridge`

Hear devices on the MQTT broker and drive them as devices under /dev (the ha-discovery and shelly drivers), sending them what is written to their controls (the devices-bridge service)

<small>administrators only · changes things</small>

```text
devices-bridge
```

```bash
service restart devices-bridge
```

### `devices-found`

The devices on the network the network listener heard over mDNS, SSDP and WS-Discovery: what each is, whether it can become a device and whether it is one already (for members of the devices group)

<small>reads only</small>

```text
devices-found [--addable] [--all] [<id>]
```

| Argument | What it is                                                             |
| -------- | ---------------------------------------------------------------------- |
| `[<id>]` | one host, by its id or address: it, with all the listener heard of it. |

| Option      | What it does                                                        |
| ----------- | ------------------------------------------------------------------- |
| `--addable` | only the ones that can become a device of this module’s.            |
| `--all`     | every one, the devices already under /dev and the ignored ones too. |

```bash
devices-found
devices-found --addable
devices-found --all
devices-found 7c2ebd614055
```

With `JSON_OUTPUT=1`: FoundAnswer: round, broker, devices [{id, ip, mac, names, seen, services, kind, vendor, label, model, firmware, class, addable, adopt, connect, device, ignored}]; with an id, FoundDetail: one of those and host {ip, mac, names, seen, mdns, ssdp}.

### `devices-ignore`

Leave devices found on the network out of devices-found, or take them back with --undo (for members of the devices group)

<small>changes things</small>

```text
devices-ignore [--undo] <id>
```

| Argument | What it is                                               |
| -------- | -------------------------------------------------------- |
| `<id>`   | what devices-found calls it; more than one may be given. |

| Option   | What it does    |
| -------- | --------------- |
| `--undo` | take them back. |

```bash
devices-ignore d0ad08c5e709
devices-ignore d0ad08c5e709 --undo
```

### `devices-snmp`

Walk a device's SNMP objects under an OID (the system group unless one is given), for members of the devices group.

<small>reads only</small>

```text
devices-snmp [--community=<string>] [--port=<string>] [--limit=<string>] <host> [<oid>]
```

| Argument  | What it is                                      |
| --------- | ----------------------------------------------- |
| `<host>`  | its address.                                    |
| `[<oid>]` | where to walk from: 1.3.6.1.2.1.1 unless given. |

| Option                 | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `--community=<string>` | the community to ask with, when not CFG_DEVICES_SNMP_COMMUNITY. |
| `--port=<string>`      | its agent’s port, when not 161.                                 |
| `--limit=<string>`     | the most objects to answer (5000)                               |

```bash
devices-snmp 192.0.2.40
devices-snmp 192.0.2.40 1.3.6.1.2.1.25.2.3
devices-snmp 192.0.2.40 1.3.6.1.4.1.4526 --community home
```

With `JSON_OUTPUT=1`: SnmpObject[]: oid, type, value.

### `devices-status`

Whether the devices bridge hears the MQTT broker, which drivers it registered, how many devices under /dev they drive, what they cannot read, and whether the sidecar is one this module speaks; or whether the restreamer answers.

<small>reads only</small>

```text
devices-status [--brief] [--checks] [--streams]
```

| Option      | What it does                                                 |
| ----------- | ------------------------------------------------------------ |
| `--brief`   | one line, as the services list shows it.                     |
| `--checks`  | the checks health reads, as JSON.                            |
| `--streams` | whether the restreamer answers, and how many streams it has. |

```bash
devices-status
devices-status --brief
devices-status --streams
```

With `JSON_OUTPUT=1`: DevicesStatus: configured, url, running, connected, since, drivers, devices, endpoints, messages, unsupported, lastError, sidecar {version, problem}; with --streams, RestreamerStatus: configured, url, rtsp, answering, streams, error.
