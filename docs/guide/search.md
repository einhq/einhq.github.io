# Search and the finder

EiN gives you two ways to find something: the finder in the top bar, which takes you to a page, an
action or a command in a few keystrokes, and the **Search** page. What there is to search comes
from the modules installed; this page covers what EiN itself gives, for everyone who uses EiN in a
browser. With the Archive installed, [Searching your pictures](../archive/search.md) covers finding
photos, videos, recordings and documents, and the albums, people and places they belong to.

## The finder in the top bar

The box in the middle of the top bar, **Search for anything**, is the finder. Click it, or press
<kbd>Ctrl</kbd>+<kbd>K</kbd> (<kbd>⌘</kbd>+<kbd>K</kbd> on a Mac) wherever you are, and a list opens
under it. The list closes when you press <kbd>Esc</kbd>, click somewhere else or choose a row, and
choosing a row empties the box.

When something covers the box (a dialog, the viewer, or a page shown full screen), the same keys
open the finder as a dialog of its own, with the prompt **Search, or go to a page…**. <kbd>Esc</kbd>, or <kbd>Ctrl</kbd>+<kbd>K</kbd> again, closes it.

On a phone the box reads **Search**, the list takes the width of the screen, and the keyboard's
search key does what <kbd>Enter</kbd> does. [EiN on a phone](phone.md) covers the rest.

With no module installed, the finder finds the pages in your sidebar, the actions in the top bar
and EiN's commands. Each module adds its pages and actions, and the Archive adds its albums,
people, locations and devices by name.

### Go somewhere with nothing typed

With the box empty, the list shows two groups:

- **Go to**: every page in your sidebar, with the sidebar section it is in beside it.
- **Do**: every button in the top bar, and every row of its menus named after its menu. With the
  Archive and the assistant installed, these include **Chat**, **Random album**, **Create: Album**,
  **Create: Import media** and **Account: Favourites**.

Use the arrow keys to light a row and <kbd>Enter</kbd> to open it, or click it. While nothing is
typed, <kbd>Enter</kbd> does nothing until an arrow key has lit a row.

### Type a name

As you type, the list changes to these groups, in this order:

| Group                           | Rows                                                                                                                                            | A row takes you to                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Search**                      | `Search for "<your words>"`, and with the Archive installed `Pictures of "<your words>"`                                                        | The Search page, or the Archive's Media page, searching for the words |
| **Go to** and **Do**            | The pages and actions whose names hold your words                                                                                               | That page or action                                                   |
| The kinds the Search page finds | Their things whose names match, with the kind of each beside it. With the Archive installed the group is **Albums, people, locations, devices** | Its page                                                              |

The first row is lit, so <kbd>Enter</kbd> opens the Search page for your words, and so does the
arrow button at the end of the box. To go straight to a page or a thing, light its row with the
arrow keys or click it. With the Archive installed, in the Wrenfield demo, typing `peggy` offers
Peggy Wrenfield, and typing `christmas` offers albums such as Christmas 1975, Christmas 1998 and
Christmas in Wellington.

While names are being looked up the list says **Looking…**; when nothing fits it says **Nothing
matches.**

> [!NOTE]
> Words you take to the Search or Media page from the finder are searched exactly as you typed
> them. To have a sentence read into people, places and years (see
> [Write what you are looking for](../archive/search.md#write-what-you-are-looking-for)), press
> <kbd>Enter</kbd> once more in that page's own box.

### Find a command with `>`

![The finder with ">person" typed, listing person-add-event, person-check, person-children, person-cover, person-create and person-detach under Commands, each with its one-line description](../../assets/shots/finder.webp "Starting with > turns the finder into a search of EiN's commands.")

1. Click the box or press <kbd>Ctrl</kbd>+<kbd>K</kbd>.
2. Type `>` followed by what the command should do, or part of its name, such as `>person`.
3. Up to six commands appear under **Commands**, each with its one-line description.
4. Choose one to open its entry in EiN's documentation (**Documentation** in the sidebar).

Choosing a command does not run it: you run commands in the [terminal](../shell/terminal.md). With
fewer than two letters after the `>`, the list says **Type what the command should do.**, and when
nothing fits, **No command matches.** The line at the foot of the list, **Type > to find a
command**, is there as a reminder.

When the assistant module and the media service are installed, the finder looks for commands by
what they are for, so a command can turn up even when its name and description use other words than
yours. Without them, and while the media service is not answering, it matches your words against
the commands' names and descriptions. The [command reference](../reference/commands.md) lists every
command.

## The Search page

**Search**, under Explore in the sidebar, searches the kinds of things the installed modules make
searchable. With no module installed it has nothing to search: before you type it says **Search
for anything**, and a search answers **No results found**. With the Archive installed it finds
albums, people, locations and devices; see
[Find albums, people, locations and devices](../archive/search.md#find-albums-people-locations-and-devices).

1. Open **Search** in the sidebar, or choose **Search for "…"** in the finder. The header reads
   **Search** and **Search by name, date or @mention**.
2. Type in the box, **Search, or type @ to pick something by name**, and press <kbd>Enter</kbd>.
3. The results appear as cards, 60 at a time, with more as you scroll. A card shows the name, a
   cover picture and the kind. Click a card to open its page.
4. When the modules make more than one kind searchable, narrow the results with **Show**: **All**,
   or one of the kinds.
5. Order them with **Sort**: **Relevance** (the default), **Name (A-Z)**, **Newest first** or
   **Oldest first**.

When nothing is found, the page says **No results found**.

The box takes `@` to pick something exactly, turns what it understood into chips you can remove
one by one, and offers the **Interpreted filter** to show what it searched for. Which words it
reads as people, places, years and kinds comes from a module: the Archive reads them, and
[Searching your pictures](../archive/search.md#write-what-you-are-looking-for) explains how.
Without it, the box searches your words as they are.

Every search finds only what you are allowed to see; a visitor browsing without signing in finds
only what is shared with everyone ([Sharing](sharing.md)).

### Before you search

Before you type, the Search page shows **Recent searches**: your last eight searches on this page.
Click one to run it again, its × (**Forget …**) to drop it, or **Clear** to drop them all. They are
kept in this browser, not in your account, so another computer or phone has a list of its own.

Under them come the sections the modules give the page. With the Archive installed, these are the
people, locations, years and labels to start from; see
[Start from people, places, years and labels](../archive/search.md#start-from-people-places-years-and-labels).
With no recent search and no module to offer a section, the page says **Search for anything** and
"Type a name, a year or a few words; @ picks something by name."

### Share or keep a search

The address in your browser holds the whole search: the words, the chips, **Show** and **Sort**.
So a search can be linked, and the browser's Back and Forward step through your searches. Copy the
address to send a search to someone in the family, or to come back to it later. Whoever opens the
link sees only what they are allowed to see. To keep a search in your sidebar, see
[Your sidebar and top bar](customizing.md).

## Where search comes from

EiN's search is one command, `search`, and the modules supply what it searches. A module plugs in
by the names of its commands and by its manifest:

| What a module gives                                | What it adds to search                                                                             |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `search-<x>` commands                              | Hits for the words of a search; `search` asks every one on the path and puts the hits together     |
| `subject-<kind>` commands                          | What a person, location or device picked with `@` has                                              |
| Node types marked `searchable` in its manifest     | The kinds the Search page finds and offers under **Show**, and the things the finder finds by name |
| Panels for the Search page                         | The sections shown before you search, and what a search for one label adds                         |
| A reader for the box, named by `CFG_SEARCH_PARSER` | How a sentence is read into chips                                                                  |
| A command finder, named by `CFG_COMMAND_FINDER`    | Commands found by what they are for, in the finder                                                 |

With no module, `search` has no provider to ask and the Search page no kind to find. The Archive
brings the providers for albums, people, locations, devices, tracks, media and documents, and the
reader for the box; the assistant brings the command finder. [Writing a module](../develop/modules.md#plug-into-search-the-home-page-and-other-places)
shows how a module plugs in, and the settings are in the
[settings reference](../reference/settings.md#cfg_search_parser).

In the [terminal](../shell/terminal.md), `search` answers the same questions as the pages. Its
options are in the [command reference](../reference/commands-core.md#search);
[Search from the terminal](../archive/search.md#search-from-the-terminal) gives examples over the
Archive.
