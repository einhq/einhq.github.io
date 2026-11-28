<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Games commands

The commands the games module adds. They are there once the module is installed. 8 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[games-folders](#games-folders) · [games-host](#games-host) · [games-invite](#games-invite) · [games-join](#games-join) · [games-list](#games-list) · [games-relay](#games-relay) · [games-servers](#games-servers) · [games-stop](#games-stop)

## G

### `games-folders`

Keep each game module's folder out of the media work, so the pictures in it are not taken for the family's photos: give it an empty processing attribute. The games-folders pipeline does it for a game module's folder as it is made.

<small>administrators only · changes things</small>

```text
games-folders <folder>
```

| Argument   | What it is                                               |
| ---------- | -------------------------------------------------------- |
| `<folder>` | one game module's folder; every module's when not given. |

```bash
games-folders
games-folders /groups/users/rover
```

With `JSON_OUTPUT=1`: One entry per game module: its name, its folder and what was done: kept (given the attribute now), already (it had it) or missing (the folder is not there yet).

### `games-host`

Host a game that others here join, or guests from another EiN with games-invite: its module's service runs it until you stop it with games-stop or nobody has played for five minutes.

<small>changes things</small>

```text
games-host [--max=<number>] [--mode=<string>] <module> <game> <map>
```

| Argument   | What it is                                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `<module>` | the game module, as games-list lists it.                                                                   |
| `<game>`   | the game, by its id in the module, as games-list lists it.                                                 |
| `<map>`    | the map to start on, one of the game's; the first of the module's usual maps the game has, else its first. |

| Option            | What it does                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `--max=<number>`  | how many may play, from 2 to the module's most; the module's usual number when not given. |
| `--mode=<string>` | how the game is played, one of the module's modes; its first when not given.              |

```bash
games-host arcade demo
games-host arcade full arena2 --max 4 --mode coop
```

With `JSON_OUTPUT=1`: The hosted game as its server.json has it once it runs: id, module, game, title, family, map, mode, maxPlayers, startedBy, startedAt, state and players.

### `games-invite`

Invite someone on another EiN into a hosted game: an invitation that connects whoever has its link to the game's socket, played with their own EiN's copy of the game.

<small>changes things</small>

```text
games-invite [--hours=<number>] <id>
```

| Argument | What it is                                       |
| -------- | ------------------------------------------------ |
| `<id>`   | the hosted game's id, as games-servers lists it. |

| Option             | What it does                                                            |
| ------------------ | ----------------------------------------------------------------------- |
| `--hours=<number>` | how long the link lets the guest in, at most a week; 12 when not given. |

```bash
games-invite k3x9
games-invite k3x9 --hours 2
```

With `JSON_OUTPUT=1`: The way in as games-join answers it, with the invitation's link, its path on this EiN's address followed by #<module>:<family>:<game>:<map>, each part URI-encoded, and when it expires.

### `games-join`

The way into a hosted game: its socket node, which a player's page connects to and carries the game's datagrams both ways over, and the address the game connects to.

<small>reads only</small>

```text
games-join <id>
```

| Argument | What it is                                       |
| -------- | ------------------------------------------------ |
| `<id>`   | the hosted game's id, as games-servers lists it. |

```bash
games-join k3x9
```

With `JSON_OUTPUT=1`: The hosted game's id, its module, the game's id, title and family, its map, the path of its socket, and the address the game connects to.

### `games-list`

List the game modules installed and their games: each module's drop-in in /etc/games.d, and the games its list command answers, run as the caller.

<small>reads only</small>

```text
games-list
```

```bash
games-list
```

With `JSON_OUTPUT=1`: The game modules (title, icon, the route a game is played at, its list and fetch commands, its folder, the rules it takes dropped files by, how it plays together, how to add its games in Markdown), every game each lists (id, module, title, installed or offered, size or download, cover, path, family, maps), installed games first, and what could not be read: a drop-in that is wrong, a list command that failed.

### `games-relay`

Run the games hosted of every game module whose players play peer to peer, passing each player's datagrams to the others; no game runs on the server (the games-relay service)

<small>administrators only · changes things</small>

```text
games-relay
```

```bash
service restart games-relay
```

### `games-servers`

List the games people host, of every game module or of one, with who plays in each.

<small>reads only</small>

```text
games-servers [--module=<string>] [--relay] [--count]
```

| Option              | What it does                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `--module=<string>` | Only the games of this game module.                                                                |
| `--relay`           | Only the games the games-relay service runs: those of the modules whose players play peer to peer. |
| `--count`           | Say only how many games run and how many play, in one line.                                        |

```bash
games-servers
games-servers --module arcade --count
```

With `JSON_OUTPUT=1`: One entry per hosted game: its id, its module, the game's id, title and family, the map, the mode, how many may play, who hosted it and when, its state (starting, running or failed, with the error), and its players with their frags, pings and seats.

### `games-stop`

Stop a hosted game, which drops everyone in it; the one who hosted it or an administrator may.

<small>changes things</small>

```text
games-stop <id>
```

| Argument | What it is                                       |
| -------- | ------------------------------------------------ |
| `<id>`   | the hosted game's id, as games-servers lists it. |

```bash
games-stop k3x9
```

With `JSON_OUTPUT=1`: Nothing; the game is stopped and its folder gone.
