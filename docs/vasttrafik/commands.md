<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Västtrafik commands

The commands the västtrafik module adds. They are there once the module is installed. 7 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[vt-departures](#vt-departures) · [vt-disruptions](#vt-disruptions) · [vt-lines](#vt-lines) · [vt-positions](#vt-positions) · [vt-status](#vt-status) · [vt-stops](#vt-stops) · [vt-tracks](#vt-tracks)

## V

### `vt-departures`

Show the next departures from Västtrafik stops, at the time Västtrafik now expects each, asked of Västtrafik anew once the copy is as old as its setting says, 20 seconds unless set.

<small>reads only</small>

```text
vt-departures [--line=<string>] [--platform=<string>] [--limit=<number>] <stop>
```

| Argument | What it is                                 |
| -------- | ------------------------------------------ |
| `<stop>` | stop areas by gid, as vt-stops lists them. |

| Option                | What it does                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `--line=<string>`     | only this line, by what its signs say (6, X5); repeat it or put commas between for several. |
| `--platform=<string>` | only from this platform (A, B1); A takes A1 and A2 too; repeat it for several.              |
| `--limit=<number>`    | how many from each stop, 1 to 20; 8 unless given.                                           |

```bash
vt-departures 9021014001760000
vt-departures 9021014001760000 --line 6 --line 11 --limit 4
```

With `JSON_OUTPUT=1`: One entry per stop: stop (gid, name), at, freshMs (the milliseconds before Västtrafik is asked anew), and its departures by when they leave, each with line (designation, name, background, foreground, border, mode), direction, platform, planned, estimated, cancelled and partCancelled.

### `vt-disruptions`

List Västtrafik's disruptions in effect at stops or on lines — moved platforms, diversions, lines not running — the worst first, from a copy asked of Västtrafik anew once it is as old as its setting says, five minutes unless set.

<small>reads only</small>

```text
vt-disruptions [--stop=<string>] [--line=<string>] [--ahead=<number>]
```

| Option             | What it does                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--stop=<string>`  | those naming this stop area, by gid as vt-stops lists it; repeat it or put commas between for several.                                      |
| `--line=<string>`  | those naming this line: by what its signs say (6), which takes every line of that name in the region, or by its gid; repeat it for several. |
| `--ahead=<number>` | also those starting within so many hours, 0 to 168; 0 unless given.                                                                         |

```bash
vt-disruptions --stop 9021014001760000
vt-disruptions --line 6 --ahead 24
vt-disruptions
```

With `JSON_OUTPUT=1`: at, freshMs (the milliseconds before Västtrafik is asked anew), and disruptions that name any of the stops or lines given (every one when none is), the worst first: id, title, description, severity (slight, normal, severe), start, end, stops (gid, name) and lines (gid, designation, name, background, foreground, mode).

### `vt-lines`

List the lines that leave Västtrafik stops within twelve hours, with their directions, and the platforms they leave from.

<small>reads only</small>

```text
vt-lines <stop>
```

| Argument | What it is                                                                           |
| -------- | ------------------------------------------------------------------------------------ |
| `<stop>` | stop areas by gid, as vt-stops lists them; several, or one word with commas between. |

```bash
vt-lines 9021014001760000
```

With `JSON_OUTPUT=1`: The stops, the lines (designation, name, background, foreground, border, mode, directions) by designation, and the platforms (platform).

### `vt-positions`

Show where Västtrafik's vehicles are now, around stops or in a box, asked of Västtrafik anew once the copy is as old as its setting says, 5 seconds unless set.

<small>reads only</small>

```text
vt-positions [--around=<string>] [--margin=<number>] [--bbox=<string>] [--line=<string>]
```

| Option              | What it does                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--around=<string>` | stop areas by gid, as vt-stops lists them; the box takes them all, with the margin around.                        |
| `--margin=<number>` | metres around the stops, 100 to 5000; 1000 unless given.                                                          |
| `--bbox=<string>`   | the box instead: south,west,north,east in degrees; with --around too, the stops and their box are still answered. |
| `--line=<string>`   | only this line, by what its signs say; repeat it or put commas between for several.                               |

```bash
vt-positions --around 9021014001760000
vt-positions --bbox 57.70,11.95,57.72,11.99 --line 6
vt-positions --around 9021014001760000 --margin 500 --bbox=57.69,11.94,57.72,11.99
```

With `JSON_OUTPUT=1`: box (south, west, north, east), stops (as vt-stops), around (the box of --around and --margin, when given), at, freshMs (the milliseconds before Västtrafik is asked anew), and vehicles, each with ref, line (designation, name, background, foreground, border, mode), direction, lat, lng and trail (where it was over the last ten minutes, oldest first, a point every half minute, as [lat, lng, seconds before at]).

### `vt-status`

Check that Västtrafik takes the key and that the application subscribes to each API the Västtrafik commands use, asking each anew.

<small>reads only</small>

```text
vt-status
```

```bash
vt-status
```

With `JSON_OUTPUT=1`: One check for the key, then one for each API (Planera Resa v4, Geografi v3, Störning v1) once the key is taken: name, state (ok or fail) and reason.

### `vt-stops`

List Västtrafik's stop areas, every one or those whose name has the words given, from a copy refreshed each day.

<small>reads only</small>

```text
vt-stops [--municipality=<string>] <words>
```

| Argument  | What it is                                                                              |
| --------- | --------------------------------------------------------------------------------------- |
| `<words>` | words the stop and its municipality must have, in any case and with or without accents. |

| Option                    | What it does                                           |
| ------------------------- | ------------------------------------------------------ |
| `--municipality=<string>` | only the stops in this municipality, such as Göteborg. |

```bash
vt-stops brunnsparken
vt-stops --municipality Kungälv
```

With `JSON_OUTPUT=1`: One entry per stop area, by name: gid, name, municipality, label (the name and its municipality), lat and lng.

### `vt-tracks`

Show where the lines through a box, around stops or given, run, each line and direction as one of its journeys runs, clipped to the box: the lines with a vehicle in it now, and those whose path crosses it with a vehicle seen within the day; each path kept a day.

<small>reads only</small>

```text
vt-tracks [--around=<string>] [--margin=<number>] [--bbox=<string>] [--line=<string>]
```

| Option              | What it does                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `--around=<string>` | stop areas by gid, as vt-stops lists them; the box takes them all, with the margin around.                        |
| `--margin=<number>` | metres around the stops, 100 to 5000; 1000 unless given.                                                          |
| `--bbox=<string>`   | the box instead: south,west,north,east in degrees; with --around too, the stops and their box are still answered. |
| `--line=<string>`   | only this line, by what its signs say; repeat it or put commas between for several.                               |

```bash
vt-tracks --around 9021014001760000
vt-tracks --bbox 57.70,11.95,57.72,11.99 --line 6
```

With `JSON_OUTPUT=1`: box (south, west, north, east), at, and tracks, one for each line and direction through the box: line (as vt-positions), direction, and paths, each stretch of the path that crosses the box, as [lat, lng] pairs.
