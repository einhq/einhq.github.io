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
- **Add an item**: open the list, type in **Add an item** and press <kbd>Enter</kbd>. Pick a due day
  and, on a group's list, who is to do it beside it if you like.
- **Tick an item off**: its box marks it done, and it moves under **Done** at the foot of the list,
  where hovering the check mark says who did it and when. Untick it there to bring it back.
- **Change an item**: the pencil opens its title, **Due** and **Who**; **Save** keeps the change, and
  **Move to trash** takes the item away into your [trash](../guide/profile.md), from where it can be
  restored.

A due day that has passed is red. An item can be given only to a member of the list's group; on a
list of your own every item is yours.

**What's mine** is what is left for you, soonest due first: the items given to you on any list, and
the items of your own lists given to nobody. Each says the list it is on; choose that to open the
list.

To add an item from anywhere, choose **Create → Todo item** in the top bar, pick the list and
choose **Add**.

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
todo-add /groups/users/todos/shopping Milk
todo-add ~/todos/before-the-trip 'Renew the passport' --due 2026-12-01
todo-items /groups/users/todos/shopping             # the list and its items
todo-done /groups/users/todos/shopping/01JC...      # --undo marks it not done again
todo-set /groups/users/todos/shopping/01JC... --assignee helen --due 2026-11-20
todo-mine                                           # what is left for you
```

An item's path is its list's and then an id, which `todo-items` shows. Remove an item, or a whole
list, with [`trash put`](../reference/commands-core.md#trash). [Todo commands](commands.md) lists
every option.

## When something goes differently

| What you see                                           | What it means                                          | What to do                                                             |
| ------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Shared with** offers no group                        | None of your groups has a shared home                  | Ask the administrator to give your group one, or share it with `users` |
| `todo-add: 'peggy' is not in the group 'family'`       | An item goes only to a member of the list's group      | Pick a member, or ask the administrator to add them to the group       |
| `todo-add: an item on your own list can only be yours` | A list of your own is nobody else's                    | Make the list a group's to share it                                    |
| A list someone made is not in your box                 | It is someone else's own, or of a group you are not in | Group changes apply the next time you sign in                          |
| An item due long ago is not on Home                    | Home shows a week back                                 | **What's mine** lists every open item of yours, overdue or not         |
