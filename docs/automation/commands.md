<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Automation commands

The commands the automation module adds. They are there once the module is installed. 10 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[automation-check](#automation-check) · [automation-disable](#automation-disable) · [automation-enable](#automation-enable) · [automation-engine](#automation-engine) · [automation-new](#automation-new) · [automation-set](#automation-set) · [automation-show](#automation-show) · [automation-status](#automation-status) · [automation-trigger](#automation-trigger) · [automations](#automations)

## A

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

### `automation-status`

Whether the automation engine runs, how many automations it runs, the actions they took and the ones it holds back, and why; or, given one, what each of its nodes last did.

<small>reads only</small>

```text
automation-status [--brief] [<automation>]
```

| Argument         | What it is                           |
| ---------------- | ------------------------------------ |
| `[<automation>]` | one automation, whose nodes to show. |

| Option    | What it does                             |
| --------- | ---------------------------------------- |
| `--brief` | one line, as the services list shows it. |

```bash
automation-status
automation-status --brief
automation-status hall-light
```

With `JSON_OUTPUT=1`: AutomationStatus: running, automations, actions, problems; with an automation, AutomationRunStatus: name, running, problems, nodes.

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
