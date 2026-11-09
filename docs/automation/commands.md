<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Automation commands

The commands the automation module adds. They are there once the module is installed. 7 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[automation-adopt](#automation-adopt) · [automation-bridge](#automation-bridge) · [automation-found](#automation-found) · [automation-ignore](#automation-ignore) · [automation-rule-check](#automation-rule-check) · [automation-rules](#automation-rules) · [automation-status](#automation-status)

## A

### `automation-adopt`

Make a Shelly found on the network a device: point its MQTT at the broker and restart it (for members of the devices group)

<small>changes things</small>

```text
automation-adopt <id>
```

| Argument | What it is                                                                      |
| -------- | ------------------------------------------------------------------------------- |
| `<id>`   | what automation-found calls it: its hardware address without colons, or its IP. |

```bash
automation-adopt a8032ab12345
```

With `JSON_OUTPUT=1`: AdoptAnswer: id, label, driver, broker, restarted.

### `automation-bridge`

Hear devices on the MQTT broker and drive them as devices under /dev (the ha-discovery and shelly drivers), sending them what is written to their controls (the automation-bridge service)

<small>administrators only · changes things</small>

```text
automation-bridge
```

```bash
service restart automation-bridge
```

### `automation-found`

The devices on the network the network listener heard over mDNS and SSDP: what each is, whether it can become a device and whether it is one already (for members of the devices group)

<small>reads only</small>

```text
automation-found [--addable] [--all]
```

| Option      | What it does                                                        |
| ----------- | ------------------------------------------------------------------- |
| `--addable` | only the ones that can become a device of automation’s.             |
| `--all`     | every one, the devices already under /dev and the ignored ones too. |

```bash
automation-found
automation-found --addable
automation-found --all
```

With `JSON_OUTPUT=1`: FoundAnswer: round, broker, devices [{id, ip, mac, names, seen, services, kind, vendor, label, model, firmware, class, addable, adopt, connect, device, ignored}].

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

Whether the automation bridge hears the MQTT broker, which drivers it registered, how many devices under /dev they drive, what they cannot read, and the rules.

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

With `JSON_OUTPUT=1`: AutomationStatus: configured, url, running, connected, since, drivers, devices, endpoints, messages, unsupported, lastError, rules {count, runs, problems}.
