<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Todo commands

The commands the todo module adds. They are there once the module is installed. 11 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[events-todo](#events-todo) · [todo-add](#todo-add) · [todo-done](#todo-done) · [todo-items](#todo-items) · [todo-link](#todo-link) · [todo-list-create](#todo-list-create) · [todo-lists](#todo-lists) · [todo-members](#todo-members) · [todo-mine](#todo-mine) · [todo-move](#todo-move) · [todo-set](#todo-set)

## E

### `events-todo`

Home's events from the todo lists: open items due around a day that are yours, given to you or to nobody.

<small>reads only</small>

```text
events-todo [--today=<string>] [--days-ahead=<number>] [--days-past=<number>] [--limit=<number>]
```

| Option                  | What it does                                       |
| ----------------------- | -------------------------------------------------- |
| `--today=<string>`      | the day to look around, YYYY-MM-DD (default today) |
| `--days-ahead=<number>` | how many days ahead (default 30)                   |
| `--days-past=<number>`  | how many days back (default 7)                     |
| `--limit=<number>`      | at most this many (default 16)                     |

```bash
events-todo --today 2026-11-04
```

With `JSON_OUTPUT=1`: One events entry per item: title, route, path and date.

## T

### `todo-add`

Add an item to a todo list, a markdown file named for when it was added, with the day it is due and who is to do it if you like.

<small>changes things</small>

```text
todo-add [--due=<string>] [--assignee=<user>] [--link=<path>] <list> <title>
```

| Argument  | What it is             |
| --------- | ---------------------- |
| `<list>`  | the list, by its path. |
| `<title>` | what is to be done.    |

| Option              | What it does                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| `--due=<string>`    | the day it is due, as YYYY-MM-DD.                                            |
| `--assignee=<user>` | who is to do it: a member of the list's group, or you on a list of your own. |
| `--link=<path>`     | what it is about, such as a picture or an album: a softlink under the item.  |

```bash
todo-add /groups/users/todos/Shopping Milk
todo-add ~/todos/'Before the trip' 'Renew the passport' --due 2026-12-01
```

With `JSON_OUTPUT=1`: The new item: path, list, title, done, due, assignee and links.

### `todo-done`

Mark a todo item done, with who did it and when, moving it to the list's done/; with --undo, not done again and back in the list.

<small>changes things</small>

```text
todo-done [--undo] <item>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<item>` | the item, by its path. |

| Option   | What it does      |
| -------- | ----------------- |
| `--undo` | mark it not done. |

```bash
todo-done /groups/users/todos/Shopping/2026-11-05-140322.md
todo-done --undo /groups/users/todos/Shopping/done/2026-11-05-140322.md
```

With `JSON_OUTPUT=1`: The item as it is now, at its new path, with doneAt and doneBy when it is done.

### `todo-items`

Show a todo list and its items: the open ones, then those in its done/, each in the order they were added.

<small>reads only</small>

```text
todo-items <list>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<list>` | the list, by its path. |

```bash
todo-items /groups/users/todos/Shopping
```

With `JSON_OUTPUT=1`: The list (path, title, group, open, total) and its items (path, title, notes, done, doneAt, doneBy, due, assignee).

### `todo-link`

Link a todo item to what it is about, such as a picture or an album: a softlink under the item's file, named as what it points at. rm takes one away.

<small>changes things</small>

```text
todo-link <item> <path>...
```

| Argument    | What it is             |
| ----------- | ---------------------- |
| `<item>`    | the item, by its path. |
| `<path>...` | what it is about.      |

```bash
todo-link ~/todos/Fix/2026-11-05-140322.md /albums/Summer/beach.jpg
```

With `JSON_OUTPUT=1`: The item as it is now, with its links.

### `todo-list-create`

Make a todo list, a folder named by its title: your own, in ~/todos, or with --group one every member of the group shares, in the group's shared home.

<small>changes things</small>

```text
todo-list-create [--group=<group>] <title>
```

| Argument  | What it is                                 |
| --------- | ------------------------------------------ |
| `<title>` | what the list is called, such as Shopping. |

| Option            | What it does                                                       |
| ----------------- | ------------------------------------------------------------------ |
| `--group=<group>` | a group of yours with a shared home, whose members share the list. |

```bash
todo-list-create Shopping --group users
todo-list-create 'Before the trip'
```

With `JSON_OUTPUT=1`: The new list: path, title, group, open and total.

### `todo-lists`

List the todo lists you can see: your own, then those in the shared homes of your groups.

<small>reads only</small>

```text
todo-lists
```

```bash
todo-lists
```

With `JSON_OUTPUT=1`: One entry per list: path, title, group (absent for your own), open and total.

### `todo-members`

List who an item of a todo list may be given to: the members of the list's group, or you for a list of your own.

<small>reads only</small>

```text
todo-members <list>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<list>` | the list, by its path. |

```bash
todo-members /groups/users/todos/Shopping
```

With `JSON_OUTPUT=1`: One entry per person: username and name.

### `todo-mine`

List what is left for you to do: open items given to you on any list, and your own lists' open items given to nobody, soonest due first.

<small>reads only</small>

```text
todo-mine
```

```bash
todo-mine
```

With `JSON_OUTPUT=1`: One entry per item, as todo-items gives them, with listTitle and group.

### `todo-move`

Put an open todo item just before or just after another on its list, numbering the list's open items in their new order.

<small>changes things</small>

```text
todo-move [--before=<path>] [--after=<path>] <item>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<item>` | the item, by its path. |

| Option            | What it does               |
| ----------------- | -------------------------- |
| `--before=<path>` | the item to put it before. |
| `--after=<path>`  | the item to put it after.  |

```bash
todo-move /groups/users/todos/Shopping/2026-11-05-140322.md --before /groups/users/todos/Shopping/2026-11-04-091500.md
```

With `JSON_OUTPUT=1`: The item as it is now, with its order.

### `todo-set`

Change a todo item's title, its notes, the day it is due, or who is to do it.

<small>changes things</small>

```text
todo-set [--title=<string>] [--notes=<string>] [--due=<string>] [--no-due] [--assignee=<user>] [--no-assignee] <item>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<item>` | the item, by its path. |

| Option              | What it does                                                                  |
| ------------------- | ----------------------------------------------------------------------------- |
| `--title=<string>`  | its new title.                                                                |
| `--notes=<string>`  | what the file says under the title, in place of what it said; empty for none. |
| `--due=<string>`    | the day it is due, as YYYY-MM-DD.                                             |
| `--no-due`          | it is due on no particular day.                                               |
| `--assignee=<user>` | who is to do it: a member of the list's group, or you on a list of your own.  |
| `--no-assignee`     | it is nobody in particular's.                                                 |

```bash
todo-set /groups/users/todos/Shopping/2026-11-05-140322.md --due 2026-11-20 --assignee anna
```

With `JSON_OUTPUT=1`: The item as it is now.
