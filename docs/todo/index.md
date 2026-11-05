# Todo lists

The Todo module keeps lists of things to do: lists of your own that nobody else sees, and lists you
share with a group, such as the household's shopping list. Each list is a board whose columns an
item moves through, from Todo to Done. An item can have a day it is due and someone to do it, and
what falls due shows on Home among the events.

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

- The first heading is the item's **title**, and what follows it is its **description**.
- The front matter between the `---` lines says the day it is **due**, who is to do it
  (`assignee`) and its place on the list (`order`). All are optional, and an item with none needs
  no front matter at all.
- A new item's file is named for when it was added, such as `2026-11-05-140322.md`, so the files
  sort in the order they came. Any other name works as well: rename a file, or write a text file of
  your own into the list, and it is an item.
- Items are in the order their `order` numbers say, in each column of the list. Dragging an item
  on the page, or `todo-move`, numbers the items of the column it lands in from 1 in their new
  order; an item with no number comes after those that have one, in the order it was added.
- An item can be about something else in EiN, such as a picture to fix or an album to sort: a
  [softlink](../concepts/links.md) under the item's own file points at it, and goes with the item
  when it is done. When the picture is moved or renamed, the link follows it.
- A done item is moved to the list's `done/` folder. An item in `done/` is done whether or not its
  file says so. Moving it there on the page, or with `todo-done` or `todo-move`, also writes
  `done:` and `done-by:` into its front matter, the time and who did it.

## Columns are folders too

A list is a board of columns, and an item is in one of them:

- **Todo** is the list's own folder: what is not started yet. `ls` of a list is its Todo column.
- Every folder in the list is a column of its own, such as `In progress/` or `Waiting/`, in the
  order the folders were made. It is called by its folder's name, unless the folder has a `name`
  attribute, which is then its title: `attrs ~/todos/Fix/doing -s 'name=In progress'`.
- **Done** is the list's `done/` folder, always the last column. A new list has one from the start.
- `archived/` is where done items are put away. It is no column, so they are off the board and out
  of the counts, but they are still files in the list.

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

Open **Todo** in the sidebar. The bar at the top has a tab for **Overview** and then one for every
list you can see, your own marked with a list and a group's with two people; hovering a tab says
whose it is. On a phone the tabs scroll sideways.

A list's columns stand side by side in one frame, in alternating shades, sharing the width of the
page and running to its foot; each scrolls its own cards. When
there are more than fit, the board scrolls sideways, and on a phone it shows one column at a time.

- **Make a list**: choose **⋮** in the page's bar and **New list**, type a **Title** such as Shopping, and under
  **Shared with** keep **Nobody, it is mine** or pick a group. Choose **Create list**.
- **Add an item**: open the list's tab, type in **Add an item** at the foot of **Todo** and press
  <kbd>Enter</kbd>. The line stays for the next one.
- **Move an item**: drag its card to another place in the column, or to another column; a dashed
  frame shows where it will land. Dropped on **Done** it is done, and dragged out of Done it is not.
- **Give it to someone**: the round button at a card's right is the face of whoever is to do it,
  their person's picture or their initials, or an empty circle when it is nobody's. Choose it to
  give the item to a member of the list's group, or to **Nobody in particular**.
- **Give it a due day**: the calendar in a card's heading picks one; once set, the day stands there
  instead and opens the picker again, where **No due day** takes it away.
- **Read the description**: a card shows the first line of its description, with **…** when there
  is more. Choose it to read the whole of it, as formatted Markdown, and again to fold it.
- **Change an item**: the pencil in a card's heading opens the item in a dialog: its **Title**, its
  **Description**, written in Markdown (lists, links, **bold**; **Preview** shows how it will look),
  the day it is **Due**, and **Assign to**, where typing a name narrows the members to choose from.
  **Save** keeps the change.
- **Link an item**: in the same dialog, type in **Link to** to find a person, a place, an album or
  the other things the top bar's search finds by name, and choose one; or type a whole path, such as
  `/albums/Summer/beach.jpg`, to link a picture or a folder. A link is made as soon as you choose
  it, and the cross on one takes it away.
- **Delete an item**: **Delete** in the dialog removes it for good, with its links; what they point
  at stays where it is.
- **Add a column**: open the list's tab, choose **⋮** in the page's bar and **New column**, and type
  its name; it comes before **Done**. The pencil in a column's heading renames it and, once no card
  is left in it, **Delete** takes it away. Todo cannot be renamed, Done cannot be deleted, and
  `done` and `archived` are names the list keeps for itself.
- **Archive done items**: tick the cards in **Done** you want put away, or the box in its heading
  for all of them, and choose **Archive**. They move to the list's `archived/` folder.

On a computer a card shows its pencil, and its calendar when it has no due day, while the pointer is
over it; on a phone they are always there. A due day that has passed is red.
An item can be given only to a member of the list's group; on a list of your own every item is
yours.

**Overview** is what is left for you, soonest due first: the items given to you on any list, and
the items of your own lists given to nobody. It has two columns, **Todo** for what is not started
and **In progress** for what is in any other column of its list. Each card says the list it is on,
and the column when it is started; choose that to open the list's tab.

To add an item from anywhere, choose **Create → Todo item** in the top bar, pick the list and
choose **Add**. Opened while a picture, an album or another page about one thing is showing, it
offers **About** that thing, ticked, and the new item links to it.

A card's links are listed at its foot, each with its picture: a picture's own, an album's cover, a
person's, place's or device's picture. A link is called what it points at is called, such as an
album's title. Choosing one opens it: a picture in the lightbox, an album or a person on their page.
A link to something that is gone, or that you may not see, is greyed out.

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
todo-items /groups/users/todos/Shopping             # the list, its columns and their items
todo-item /groups/users/todos/Shopping/2026-11-05-140322.md   # one item, with its description and links
ls /groups/users/todos/Shopping                     # what is not started, as files
todo-done /groups/users/todos/Shopping/2026-11-05-140322.md
todo-done --undo /groups/users/todos/Shopping/done/2026-11-05-140322.md
todo-set /groups/users/todos/Shopping/2026-11-05-140322.md --assignee helen --due 2026-11-20
todo-move /groups/users/todos/Shopping/2026-11-05-140322.md --before /groups/users/todos/Shopping/2026-11-04-091500.md
mkdir '/groups/users/todos/Shopping/In the basket'  # a column
todo-move /groups/users/todos/Shopping/2026-11-05-140322.md --column '/groups/users/todos/Shopping/In the basket'
todo-archive /groups/users/todos/Shopping/done/2026-11-05-140322.md
todo-add ~/todos/Fix 'Straighten the horizon' --link /albums/Summer/beach.jpg
todo-link ~/todos/Fix/2026-11-05-150210.md /albums/Summer   # another link
todo-mine                                           # what is left for you
```

An item's path is its list's, then its column's folder unless it is in Todo, and then its file's
name, which `todo-items` shows; a done item's is in the list's `done/`, an archived one's in
`archived/`. `todo-move --column` or `todo-done --undo` takes an archived item out again. An item's links are under its file, `…/2026-11-05-150210.md/beach.jpg`, and
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
| A list someone made has no tab                         | It is someone else's own, or of a group you are not in | Group changes apply the next time you sign in                          |
| `todo-list-create: there is already a list called …`   | A list's name is its title, and that one is taken      | Pick another title, or add to the list that is there                   |
| An item's due day or person is not shown               | Its front matter is not YAML the module can read       | Open the file and correct the lines between the `---` lines            |
| An item due long ago is not on Home                    | Home shows a week back                                 | **Overview** lists every item of yours not done, overdue or not        |
| A folder in the list is not a column                   | Its name starts with a dot, or it is `archived`        | Rename the folder                                                      |
