<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Media commands

The commands the media module adds. They are there once the module is installed. 1 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[media-pool-kinds](#media-pool-kinds)

## M

### `media-pool-kinds`

The kinds of work a worker of the media pool takes, from the modules' drop-ins, as pipeline-worker's flags.

<small>reads only</small>

```text
media-pool-kinds [--reverse] <worker>
```

| Argument   | What it is                                                          |
| ---------- | ------------------------------------------------------------------- |
| `<worker>` | cpu (the media-worker service) or models (models and models-second) |

| Option      | What it does                                                            |
| ----------- | ----------------------------------------------------------------------- |
| `--reverse` | The kinds in the reverse order, as the second models worker takes them. |

```bash
media-pool-kinds cpu
media-pool-kinds models --reverse
JSON_OUTPUT=1 media-pool-kinds models
```

With `JSON_OUTPUT=1`: the flags (--kind for each kind, --reserve-kind for each reserved one); in JSON the kinds in order and the reserved ones.
