<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Media service commands

The commands the media service module adds. They are there once the module is installed. 6 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[ems-files](#ems-files) · [ems-files-grant](#ems-files-grant) · [ems-gpu](#ems-gpu) · [ems-gpu-sample](#ems-gpu-sample) · [ems-status](#ems-status) · [ems-text-embed](#ems-text-embed)

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

The media service's GPU now, with the last six hours of utilization and VRAM.

<small>reads only</small>

```text
ems-gpu [--gauge]
```

| Option    | What it does                                                                            |
| --------- | --------------------------------------------------------------------------------------- |
| `--gauge` | The GPU and VRAM gauges top draws beside the host (the gpu-sampler service declares it) |

```bash
ems-gpu
ems-gpu --gauge
```

With `JSON_OUTPUT=1`: utilPct, memUsedMb, memTotalMb, tempC, vramPercent and the utilization and VRAM series, or null when there is no reading.

### `ems-gpu-sample`

One reading of the media service's GPU: utilization, VRAM and temperature.

<small>reads only</small>

```text
ems-gpu-sample
```

```bash
ems-gpu-sample
```

With `JSON_OUTPUT=1`: utilPct, memUsedMb, memTotalMb and tempC, or null when there is no reading.

### `ems-status`

Show media service health: version, every model and its state, what is executing, degradation, worker memory and queues.

<small>reads only</small>

```text
ems-status [--brief] [--checks] [--card]
```

| Option     | What it does                                                                     |
| ---------- | -------------------------------------------------------------------------------- |
| `--brief`  | One line, degradation first (used by service-list --detail)                      |
| `--checks` | The checks health reads: answering, model worker, degradations, card.            |
| `--card`   | The card's mode alone: quiet, busy, switching or off; fails when EMS cannot say. |

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
