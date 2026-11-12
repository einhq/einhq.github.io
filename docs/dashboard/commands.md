<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Dashboards commands

The commands the dashboards module adds. They are there once the module is installed. 9 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[dashboard-card-add](#dashboard-card-add) · [dashboard-card-remove](#dashboard-card-remove) · [dashboard-card-set](#dashboard-card-set) · [dashboard-cards](#dashboard-cards) · [dashboard-copy](#dashboard-copy) · [dashboard-create](#dashboard-create) · [dashboard-set](#dashboard-set) · [dashboard-show](#dashboard-show) · [dashboards](#dashboards)

## D

### `dashboard-card-add`

Put a card on a dashboard.

<small>changes things</small>

```text
dashboard-card-add [--size=<string>] [--title=<string>] [--no-title] [--with=<string>] [--at=<string>] <dashboard> <card>
```

| Argument      | What it is                                                |
| ------------- | --------------------------------------------------------- |
| `<dashboard>` | its title, or its path under /archive/dashboards.         |
| `<card>`      | the card, as <module>.<name>; dashboard-cards lists them. |

| Option             | What it does                                                    |
| ------------------ | --------------------------------------------------------------- |
| `--size=<string>`  | <columns>x<rows>, such as 4x3 (default the card's own)          |
| `--title=<string>` | its header's title in place of the card's name.                 |
| `--no-title`       | no header at all.                                               |
| `--with=<string>`  | key=value: what it shows, as the card takes it; again for each. |
| `--at=<string>`    | its place among the cards, from 0 (default the end)             |

```bash
dashboard-card-add Kitchen dashboard.clock
dashboard-card-add Kitchen dashboard.coming-up --size 4x5 --with days=14
```

With `JSON_OUTPUT=1`: The card as dashboard-show shows it: id, card, size, title, with, label, icon, color, frame, and route or a problem.

### `dashboard-card-remove`

Take a card off a dashboard.

<small>changes things</small>

```text
dashboard-card-remove <dashboard> <id>
```

| Argument      | What it is                                        |
| ------------- | ------------------------------------------------- |
| `<dashboard>` | its title, or its path under /archive/dashboards. |
| `<id>`        | the card's id, as dashboard-show lists it.        |

```bash
dashboard-card-remove Kitchen k7q2
```

With `JSON_OUTPUT=1`: { ok: true }.

### `dashboard-card-set`

Change a card on a dashboard: its size, title, what it shows, or its place.

<small>changes things</small>

```text
dashboard-card-set [--size=<string>] [--title=<string>] [--no-title] [--card-title] [--with=<string>] [--without=<string>] [--to=<string>] <dashboard> <id>
```

| Argument      | What it is                                        |
| ------------- | ------------------------------------------------- |
| `<dashboard>` | its title, or its path under /archive/dashboards. |
| `<id>`        | the card's id, as dashboard-show lists it.        |

| Option               | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `--size=<string>`    | <columns>x<rows>, such as 4x3.                                  |
| `--title=<string>`   | its header's title in place of the card's name.                 |
| `--no-title`         | no header at all.                                               |
| `--card-title`       | the card's own name in its header again.                        |
| `--with=<string>`    | key=value: what it shows, as the card takes it; again for each. |
| `--without=<string>` | a setting to take away, back to its default; again for each.    |
| `--to=<string>`      | its new place among the cards, from 0.                          |

```bash
dashboard-card-set Kitchen k7q2 --size 6x4
dashboard-card-set Kitchen k7q2 --to 0
dashboard-card-set Kitchen k7q2 --with days=7
```

With `JSON_OUTPUT=1`: The card as dashboard-show shows it.

### `dashboard-cards`

List the cards the installed modules offer for dashboards.

<small>reads only</small>

```text
dashboard-cards
```

```bash
dashboard-cards
```

With `JSON_OUTPUT=1`: One entry per card: id (<module>.<name>), module, name, label, description, icon, color, route, frame, size, min, and params, a JSON Schema of what it takes.

### `dashboard-copy`

Make a new dashboard laid out as another one.

<small>changes things</small>

```text
dashboard-copy <dashboard> <title>...
```

| Argument      | What it is                               |
| ------------- | ---------------------------------------- |
| `<dashboard>` | the one to copy: its title, or its path. |
| `<title>...`  | the copy's title.                        |

```bash
dashboard-copy Kitchen 'Kitchen, winter'
```

With `JSON_OUTPUT=1`: The new dashboard, as dashboards lists it.

### `dashboard-create`

Make a new, empty dashboard.

<small>changes things</small>

```text
dashboard-create [--color=<string>] [--description=<string>] [--columns=<string>] [--share=<string>] <title>...
```

| Argument     | What it is                                                          |
| ------------ | ------------------------------------------------------------------- |
| `<title>...` | what it is called; its file is <title>.yaml in /archive/dashboards. |

| Option                   | What it does                                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color=<string>`       | the colour its page and wall are drawn in: mixed, album, person, location, track, camera, device, label, media, staging, system (default mixed) |
| `--description=<string>` | a line about it, under its title.                                                                                                               |
| `--columns=<string>`     | cells across: 6, 8, 12 (default 12)                                                                                                             |
| `--share=<string>`       | default (as you share new things), private, shared or everyone.                                                                                 |

```bash
dashboard-create Kitchen
dashboard-create 'Living room' --color device --share private
```

With `JSON_OUTPUT=1`: The new dashboard, as dashboards lists it.

### `dashboard-set`

Change a dashboard's title, colour, description, columns or wall.

<small>changes things</small>

```text
dashboard-set [--title=<string>] [--color=<string>] [--description=<string>] [--columns=<string>] [--effects=<string>] [--dim=<string>] [--no-dim] <dashboard>
```

| Argument      | What it is                                        |
| ------------- | ------------------------------------------------- |
| `<dashboard>` | its title, or its path under /archive/dashboards. |

| Option                   | What it does                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `--title=<string>`       | a new title, which renames its file.                                                              |
| `--color=<string>`       | its colour: mixed, album, person, location, track, camera, device, label, media, staging, system. |
| `--description=<string>` | a line about it; empty takes it away.                                                             |
| `--columns=<string>`     | cells across: 6, 8, 12.                                                                           |
| `--effects=<string>`     | full, or light: no blur behind the tiles on its wall, for a slow screen.                          |
| `--dim=<string>`         | dim its wall between two times, to a level: 22:30-06:30@0.3.                                      |
| `--no-dim`               | never dim its wall.                                                                               |

```bash
dashboard-set Kitchen --color device
dashboard-set Kitchen --title 'Kitchen wall' --dim 22:30-06:30@0.3
```

With `JSON_OUTPUT=1`: The dashboard, as dashboard-show answers.

### `dashboard-show`

Show one dashboard: its cards, each with the route it is drawn with.

<small>reads only</small>

```text
dashboard-show <dashboard>
```

| Argument      | What it is                                        |
| ------------- | ------------------------------------------------- |
| `<dashboard>` | its title, or its path under /archive/dashboards. |

```bash
dashboard-show Kitchen
```

With `JSON_OUTPUT=1`: The dashboard (as dashboards lists it) with its wall settings, its cards — id, card, size, title, with, label, icon, color, frame, and route, or a problem — and problems read in its file.

### `dashboards`

List the dashboards you can see.

<small>reads only</small>

```text
dashboards
```

```bash
dashboards
```

With `JSON_OUTPUT=1`: One entry per dashboard: path, name, color, description, columns, its cards laid out as tiles (x, y, w, h, color), owner, modified, and whether you may change it.
