# Todo lists

The Todo module keeps lists of things to do: lists of your own that nobody else sees, and lists you
share with a group, such as the household's shopping list. An item can have a day it is due and
someone to do it, and what falls due shows on Home among the events.

## Install it

Install it from **Settings → Modules**, or in EiN's terminal:

```bash
# in EiN's terminal, as the administrator
mod install todo
```

**Todo** is then in the sidebar, and **Todo item** in the top bar's **Create** menu.
[Modules](../admin/modules.md) covers installing and removing modules.

## Lists are folders, items are files

A list is a folder, named by its title, and each item on it is a Markdown file you can read and
change in any editor, over SFTP or in EiN's terminal as well as on the Todo page:

```markdown
---
due: 2026-12-01
assignee: helen
---

# Renew the passport

The old one is in the desk drawer.
```

- The first heading is the item's **title**, and what follows it is its **notes**.
- The front matter between the `---` lines says the day it is **due**, who is to do it
  (`assignee`) and its place on the list (`order`). All are optional, and an item with none needs
  no front matter at all.
- A new item's file is named for when it was added, such as `2026-11-05-140322.md`, so the files
  sort in the order they came. Any other name works as well: rename a file, or write a text file of
  your own into the list, and it is an item.
- Items are in the order their `order` numbers say. Dragging an item on the page, or `todo-move`,
  numbers the open items from 1 in their new order; an item with no number comes after those that
  have one, in the order it was added.
- An item can be about something else in EiN, such as a picture to fix or an album to sort: a
  [softlink](../concepts/links.md) under the item's own file points at it, and goes with the item
  when it is done. When the picture is moved or renamed, the link follows it.
- A done item is moved to the list's `done/` folder, so `ls` of a list is what is left on it. An
  item in `done/` is done whether or not its file says so. Ticking it off on the page or with
  `todo-done` also writes `done:` and `done-by:` into its front matter, the time and who did it.

## Your own lists and a group's

A list is either yours or a group's, and that is decided when you make it:

- **Your own** lists are in `~/todos` in your home. Nobody else sees them, the administrator aside.
- **A group's** lists are in `todos/` of the group's [shared home](../admin/accounts.md#a-groups-shared-home),
  such as `/groups/family/todos`. Every member of the group can read, add, tick off and change
  them, and nobody else sees them. Everyone with an account is in `users`, so a list shared with
  `users` is the whole household's.

You can share a list only with a group that has a shared home and that you are in. `users` has one
from the start; the administrator gives other groups theirs.

## Use the Todo page

Open **Todo** in the sidebar. The box at the left lists **What's mine** and then every list you can
see, each with how much is left on it and whose it is; type in **Filter lists…** to narrow them by
title. On a phone the lists are under the list button in the page's bar.

- **Make a list**: choose **+** in the page's bar, type a **Title** such as Shopping, and under
  **Shared with** keep **Nobody, it is mine** or pick a group. Choose **Create list**.
- **Add an item**: open the list, type in **Add an item** and press <kbd>Enter</kbd>. The calendar
  button beside it picks a due day, and on a group's list **Anyone** picks who is to do it; both
  are optional.
- **Reorder**: drag an open item by the grip at its left to where it belongs.
- **Tick an item off**: its box marks it done, and it moves under **Done** at the foot of the list,
  where hovering the check mark says who did it and when. Untick it there to bring it back.
- **Change an item**: the pencil opens its title, its notes, its due day and who is to do it;
  **Save** keeps the change. Under them are the item's links: the cross on one takes it away, and
  **Link a path** adds one, such as `/albums/Summer/beach.jpg`. **Move to trash** takes the item away into your [trash](../guide/profile.md), from where it can be
  restored.

A due day that has passed is red. An item can be given only to a member of the list's group; on a
list of your own every item is yours.

**What's mine** is what is left for you, soonest due first: the items given to you on any list, and
the items of your own lists given to nobody. Each says the list it is on; choose that to open the
list.

To add an item from anywhere, choose **Create → Todo item** in the top bar, pick the list and
choose **Add**. Opened while a picture, an album or another page about one thing is showing, it
offers **About** that thing, ticked, and the new item links to it.

An item's links show under its title, a picture as its thumbnail. Choosing one opens what it points
at: a picture in the lightbox, an album or a person on their page. A link to something that is gone,
or that you may not see, is greyed out.

## On Home

Home's **Events** lists the items falling due that are yours to do: given to you, or to nobody on
a list you can see. They show from a week before they are due until a week after, beside the other
events, and choosing one opens its list. [Home and statistics](../guide/home.md) covers the rest of
Home.

## From the terminal

Every part of the page is a command, and a list or an item is named by its path:

```bash
# in EiN's terminal
todo-lists                                          # every list you can see
todo-list-create Shopping --group users             # a list shared with users
todo-list-create 'Before the trip'                  # a list of your own
todo-add /groups/users/todos/Shopping Milk
todo-add ~/todos/'Before the trip' 'Renew the passport' --due 2026-12-01
todo-items /groups/users/todos/Shopping             # the list and its items
ls /groups/users/todos/Shopping                     # what is left on it, as files
todo-done /groups/users/todos/Shopping/2026-11-05-140322.md
todo-done --undo /groups/users/todos/Shopping/done/2026-11-05-140322.md
todo-set /groups/users/todos/Shopping/2026-11-05-140322.md --assignee helen --due 2026-11-20
todo-move /groups/users/todos/Shopping/2026-11-05-140322.md --before /groups/users/todos/Shopping/2026-11-04-091500.md
todo-add ~/todos/Fix 'Straighten the horizon' --link /albums/Summer/beach.jpg
todo-link ~/todos/Fix/2026-11-05-150210.md /albums/Summer   # another link
todo-mine                                           # what is left for you
```

An item's path is its list's and then its file's name, which `todo-items` shows; a done item's is
in the list's `done/`. An item's links are under its file, `…/2026-11-05-150210.md/beach.jpg`, and
`rm` of one takes the link away and leaves the picture. Once `~/todos` is there, `mkdir` in it makes a list as well as `todo-list-create` does, and
`cat` and any editor read and change an item. Remove an item, or a whole list, with
[`trash put`](../reference/commands-core.md#trash). [Todo commands](commands.md) lists every
option.

## When something goes differently

| What you see                                           | What it means                                          | What to do                                                             |
| ------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Shared with** offers no group                        | None of your groups has a shared home                  | Ask the administrator to give your group one, or share it with `users` |
| `todo-add: 'peggy' is not in the group 'family'`       | An item goes only to a member of the list's group      | Pick a member, or ask the administrator to add them to the group       |
| `todo-add: an item on your own list can only be yours` | A list of your own is nobody else's                    | Make the list a group's to share it                                    |
| A list someone made is not in your box                 | It is someone else's own, or of a group you are not in | Group changes apply the next time you sign in                          |
| `todo-list-create: there is already a list called …`   | A list's name is its title, and that one is taken      | Pick another title, or add to the list that is there                   |
| An item's due day or person is not shown               | Its front matter is not YAML the module can read       | Open the file and correct the lines between the `---` lines            |
| An item due long ago is not on Home                    | Home shows a week back                                 | **What's mine** lists every open item of yours, overdue or not         |
