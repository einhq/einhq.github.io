<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Todo commands

The commands the todo module adds. They are there once the module is installed. 14 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[events-todo](#events-todo) · [todo-about](#todo-about) · [todo-add](#todo-add) · [todo-archive](#todo-archive) · [todo-done](#todo-done) · [todo-item](#todo-item) · [todo-items](#todo-items) · [todo-link](#todo-link) · [todo-list-create](#todo-list-create) · [todo-lists](#todo-lists) · [todo-members](#todo-members) · [todo-mine](#todo-mine) · [todo-move](#todo-move) · [todo-set](#todo-set)

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

### `todo-about`

List the items not done, on every list you can see, that are about a path: that link to it, such as a picture, an album or a person. With no path, every item that links to anything; with --done the done ones too.

<small>reads only</small>

```text
todo-about [--done] [<path>...]
```

| Argument      | What it is           |
| ------------- | -------------------- |
| `[<path>...]` | what they are about. |

| Option   | What it does                                                   |
| -------- | -------------------------------------------------------------- |
| `--done` | the done ones as well, those in a list's done/ (not archived/) |

```bash
todo-about /albums/Summer/beach.jpg
todo-about
```

With `JSON_OUTPUT=1`: One entry per item, as todo-items gives them, with listTitle, group, columnTitle and stage (todo, doing or done), list by list in their columns' order.

### `todo-add`

Add an item to a todo list, a markdown file named for when it was added, with the day it is due and who is to do it if you like.

<small>changes things</small>

```text
todo-add [--description=<string>] [--due=<string>] [--assignee=<user>] [--link=<path>] <list> <title>
```

| Argument  | What it is             |
| --------- | ---------------------- |
| `<list>`  | the list, by its path. |
| `<title>` | what is to be done.    |

| Option                   | What it does                                                                 |
| ------------------------ | ---------------------------------------------------------------------------- |
| `--description=<string>` | what it says under the title, in markdown.                                   |
| `--due=<string>`         | the day it is due, as YYYY-MM-DD.                                            |
| `--assignee=<user>`      | who is to do it: a member of the list's group, or you on a list of your own. |
| `--link=<path>`          | what it is about, such as a picture or an album: a softlink under the item.  |

```bash
todo-add /groups/users/todos/Shopping Milk
todo-add ~/todos/'Before the trip' 'Renew the passport' --due 2026-12-01
```

With `JSON_OUTPUT=1`: The new item: path, list, title, done, due, assignee and links.

### `todo-archive`

Put done todo items away in their list's archived/, which is no column of the board. todo-move or todo-done --undo takes one out again.

<small>changes things</small>

```text
todo-archive <item>...
```

| Argument    | What it is                |
| ----------- | ------------------------- |
| `<item>...` | a done item, by its path. |

```bash
todo-archive /groups/users/todos/Shopping/done/2026-11-05-140322.md
```

With `JSON_OUTPUT=1`: The items as they are now, at their paths in archived/.

### `todo-done`

Mark a todo item done, with who did it and when, moving it to the list's done/; with --undo, not done again and back in the list's Todo.

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

### `todo-item`

Show one todo item: its title, description, due day, who is to do it, its column and its links.

<small>reads only</small>

```text
todo-item <item>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<item>` | the item, by its path. |

```bash
todo-item /groups/users/todos/Shopping/2026-11-05-140322.md
```

With `JSON_OUTPUT=1`: The item: path, list, column, title, description, done, doneAt, doneBy, due, assignee, order and links.

### `todo-items`

Show a todo list's board: its columns, Todo (the list itself), each folder in it, then Done (its done/), and the items of each in their order. archived/ is left out.

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

With `JSON_OUTPUT=1`: The list (path, title, group, open, total), its columns (path, title, stage) and their items column by column (path, column, title, description, done, doneAt, doneBy, due, assignee, order, links).

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

With `JSON_OUTPUT=1`: One entry per list: path, title, group (absent for your own), open, total, and its columns (path, title, stage) in their order.

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

List what is left for you to do: items not done given to you on any list, and your own lists' items not done given to nobody, soonest due first, each with its column; with --done the done ones too.

<small>reads only</small>

```text
todo-mine [--done]
```

| Option   | What it does                                                   |
| -------- | -------------------------------------------------------------- |
| `--done` | the done ones as well, those in a list's done/ (not archived/) |

```bash
todo-mine
todo-mine --done
```

With `JSON_OUTPUT=1`: One entry per item, as todo-items gives them, with listTitle, group, columnTitle and stage (todo, doing or done).

### `todo-move`

Move a todo item to another column of its list's board, at its end, or put it just before or just after another item, numbering that column's items in their new order. Into done/ it is marked done, out of it not done.

<small>changes things</small>

```text
todo-move [--column=<path>] [--before=<path>] [--after=<path>] <item>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<item>` | the item, by its path. |

| Option            | What it does                                                             |
| ----------------- | ------------------------------------------------------------------------ |
| `--column=<path>` | the column: the list itself (Todo), or a folder in it such as its done/. |
| `--before=<path>` | the item to put it before, in whichever column that is.                  |
| `--after=<path>`  | the item to put it after, in whichever column that is.                   |

```bash
todo-move /groups/users/todos/Shopping/2026-11-05-140322.md --column '/groups/users/todos/Shopping/In the basket'
todo-move /groups/users/todos/Shopping/2026-11-05-140322.md --before /groups/users/todos/Shopping/2026-11-04-091500.md
```

With `JSON_OUTPUT=1`: The item as it is now, at its new path, with its column and order.

### `todo-set`

Change a todo item's title, its description, the day it is due, or who is to do it.

<small>changes things</small>

```text
todo-set [--title=<string>] [--description=<string>] [--due=<string>] [--no-due] [--assignee=<user>] [--no-assignee] <item>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<item>` | the item, by its path. |

| Option                   | What it does                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `--title=<string>`       | its new title.                                                                             |
| `--description=<string>` | what the file says under the title, in markdown, in place of what it said; empty for none. |
| `--due=<string>`         | the day it is due, as YYYY-MM-DD.                                                          |
| `--no-due`               | it is due on no particular day.                                                            |
| `--assignee=<user>`      | who is to do it: a member of the list's group, or you on a list of your own.               |
| `--no-assignee`          | it is nobody in particular's.                                                              |

```bash
todo-set /groups/users/todos/Shopping/2026-11-05-140322.md --due 2026-11-20 --assignee anna
```

With `JSON_OUTPUT=1`: The item as it is now.
