<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Media service commands

The commands the media service module adds. They are there once the module is installed. 10 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[ems-files](#ems-files) · [ems-files-grant](#ems-files-grant) · [ems-gpu](#ems-gpu) · [ems-instance](#ems-instance) · [ems-link](#ems-link) · [ems-memory](#ems-memory) · [ems-models](#ems-models) · [ems-sampler](#ems-sampler) · [ems-status](#ems-status) · [ems-text-embed](#ems-text-embed)

## E

### `ems-files`

Serve the media service the files of its requests in flight over SFTP, the only way it reaches EiN's files (the ems-files service)

<small>administrators only · changes things</small>

```text
ems-files
```

### `ems-files-grant`

Names for paths through ems-files for a while, and the EMS-Files header that reaches them, to try a media service's way to EiN's files by hand.

<small>administrators only · changes things</small>

```text
ems-files-grant [--read=<string>] [--write=<string>] [--seconds=<string>]
```

| Option               | What it does                                                                  |
| -------------------- | ----------------------------------------------------------------------------- |
| `--read=<string>`    | A file to read, as a VFS path or a path on disk; may be given more than once. |
| `--write=<string>`   | A file to write; may be given more than once.                                 |
| `--seconds=<string>` | How long the names last (default 300)                                         |

```bash
ems-files-grant --read /archive/albums/Exempelalbum_2019/IMG_0001.JPG --seconds 120
```

With `JSON_OUTPUT=1`: the EMS-Files header value, then a line per path: read or write, its name, the path.

### `ems-gpu`

The GPU of an instance of the media service now, with the last six hours of utilization and VRAM, from its machine device.

<small>reads only</small>

```text
ems-gpu [--gauge] [--instance=<string>]
```

| Option                | What it does                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `--gauge`             | The GPU and VRAM gauges top draws beside the host, each instance's with a card (the ems-sampler service declares it) |
| `--instance=<string>` | The instance whose card (ems-instance list); main, the primary, by default.                                          |

```bash
ems-gpu
ems-gpu --instance laptop
ems-gpu --gauge
```

With `JSON_OUTPUT=1`: utilPct, memUsedMb, memTotalMb, tempC, vramPercent and the utilization and VRAM series, or null when there is no reading.

### `ems-instance`

The media service's instances: list them and what each serves, or add, change or remove one beside the primary.

<small>administrators only · reads only</small>

```text
ems-instance [--url=<string>] [--key=<string>] [--files-address=<string>] [--model-slots=<string>] [--cpu-slots=<string>] [--names] [--others] <action> <name> <field>
```

| Argument   | What it is                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------- |
| `<action>` | list (the default), show, add, set or remove. One of `list`, `show`, `add`, `set`, `remove`.  |
| `<name>`   | show, add, set, remove: the instance; main is the primary.                                    |
| `<field>`  | show: print this field alone (url, filesAddress, modelSlots, cpuSlots, answering, calls, ops) |

| Option                     | What it does                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `--url=<string>`           | add, set: where the instance answers, http://host:port.                               |
| `--key=<string>`           | add, set: the bearer key the instance expects; empty for none.                        |
| `--files-address=<string>` | add, set: host:port of ems-files as the instance reaches it; empty for the primary's. |
| `--model-slots=<string>`   | add, set: model requests kept in flight against it; empty for its own limit.          |
| `--cpu-slots=<string>`     | add, set: tool requests kept in flight against it; empty for its own limit.           |
| `--names`                  | list: the names alone, without asking any instance.                                   |
| `--others`                 | list: leave out the primary.                                                          |

```bash
ems-instance list
ems-instance add laptop --url http://192.168.1.20:8181 --key let-me-in --files-address 192.168.1.10:2224
ems-instance show laptop modelSlots
ems-instance set laptop --cpu-slots 2
ems-instance remove laptop
```

With `JSON_OUTPUT=1`: list: each instance with its address, files address, slots and whether a key is set, and while it answers its own name, ops, card and build. show: one, or one field of it.

### `ems-link`

Watch every instance of the media service: log when one comes or goes, run failed work again when one's build changes, and keep the primary's card at the share CFG_EMS_CARD_SHARE_MB names (the ems-link service)

<small>administrators only · changes things</small>

```text
ems-link
```

### `ems-memory`

The memory of the media service's machine now, with the last six hours, and what EMS holds of it.

<small>reads only</small>

```text
ems-memory
```

```bash
ems-memory
```

With `JSON_OUTPUT=1`: usedMb, totalMb, percent, emsMb, emsLimitMb and the series of percent, or null when there is no reading.

### `ems-models`

What the media service held over the last hours, a sample a minute, with the work EiN had waiting beside it.

<small>reads only</small>

```text
ems-models [--hours=<string>] [--instance=<string>]
```

| Option                | What it does                                                     |
| --------------------- | ---------------------------------------------------------------- |
| `--hours=<string>`    | Hours of history, 1 to 24 (default 6)                            |
| `--instance=<string>` | The instance (ems-instance list); main, the primary, by default. |

```bash
ems-models
ems-models --hours 24
ems-models --instance laptop
```

With `JSON_OUTPUT=1`: windowMs and samples: at, and mode, copies, working, notStarted and inLine.

### `ems-sampler`

Drive the machine each instance of the media service runs on as a device, and sample what it holds (the ems-sampler service)

<small>administrators only · changes things</small>

```text
ems-sampler
```

```bash
service restart ems-sampler
```

### `ems-status`

Show media service health: version, every model and its state, what is executing, degradation, worker memory and queues.

<small>reads only</small>

```text
ems-status [--brief] [--checks] [--instance=<string>]
```

| Option                | What it does                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `--brief`             | One line, degradation first (used by service-list --detail)                                         |
| `--checks`            | The checks health reads: answering, model worker, degradations, card.                               |
| `--instance=<string>` | The instance to ask (ems-instance list); main, the primary, by default, and for --checks every one. |

### `ems-text-embed`

Texts as vectors, by EMS's current text model, to compare by meaning.

<small>reads only</small>

```text
ems-text-embed [--role=<string>] [--timeout=<number>] [--model] <text>...
```

| Argument    | What it is                  |
| ----------- | --------------------------- |
| `<text>...` | the texts, one vector each. |

| Option               | What it does                                                                  |
| -------------------- | ----------------------------------------------------------------------------- |
| `--role=<string>`    | query for what is searched with, document (the default) for what is searched. |
| `--timeout=<number>` | seconds to wait for EMS.                                                      |
| `--model`            | the current text model alone, no vectors.                                     |

```bash
ems-text-embed --role query 'restart a service'
ems-text-embed --model
```

With `JSON_OUTPUT=1`: model, the model that made them, and vectors, one per text in order.
