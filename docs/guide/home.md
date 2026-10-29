# Home and statistics

Home is the page EiN opens on, with three sections the installed modules fill: **On this day**,
**News** and **Events**. The **Statistics** page shows how what EiN holds has grown, with sections
modules add. This page is for everyone who uses EiN, and covers what EiN itself gives; with the
Archive installed, [Memories, news and events on Home](../archive/home.md) covers what it shows
there.

## Open Home

Choose **Home** at the top of the sidebar. On a computer, the EiN mark at the top left also takes
you there. EiN opens on Home when you sign in, unless you were on your way to another page.

The page is headed **Welcome**, "What is new in the archive, what is coming up, and this day in
years past". Under the header:

- **On this day** runs across the top, when there is anything to show;
- **News** fills the wider column on the left;
- **Events** stands in a card on the right. On a narrow window or a phone it comes after News, so
  scroll down past the news to see it.

Each section loads on its own, so one can appear before the others. All three show only what you
may see. "Today" is the date on your own computer or phone, not the server's.

## What fills Home

Each section gathers what every installed module has to say about it, and each entry is drawn by
the module it came from. EiN itself adds no entries:

| Section         | What EiN does with the modules' entries                                                                                                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **On this day** | One row, newest year first, up to 8 entries; when you have more than fit, swipe the row sideways or scroll it with a trackpad. With no entry the section is not shown at all.                                                                |
| **News**        | A timeline, newest first, up to 8 entries. Beside each is the portrait of the person whose account did it, when the account is linked to a person in the archive ([Your profile, favourites and trash](profile.md)); otherwise an icon.      |
| **Events**      | A card headed **Events** with the number of entries beside it, in up to three groups: **Today**, **Coming up** (nearest first) and **Recently** (the most recent first). It looks 7 days back and 30 days ahead, and holds up to 16 entries. |

At the right of each Events entry it says when: "Today", "Tomorrow", "Yesterday", "in 9 days" or
"3 days ago" up to 13 days away, and after that in weeks, "in 3 weeks" or "2 weeks ago". When
there are more than 16 entries, the ones their module marks as milestones are kept first, then the
ones nearest to today.

With no module installed, Home shows the **Welcome** header, News says "Nothing has been added yet"
and "What people add shows up here.", Events says "Nothing comes round in the next few weeks.",
and On this day is not shown. A module can offer a way to begin under the empty News: the Archive
offers **Import media** when you are signed in.

With the Archive installed, On this day shows the pictures taken on today's date in earlier years,
News the albums people made lately, and Events the birthdays, memorials and wedding anniversaries
around today; see [Memories, news and events on Home](../archive/home.md).

## The Statistics page

Choose **Statistics** in the sidebar, under **System**. Everyone can open it. The page is headed
**Statistics**, "Archive statistics over time". It holds the sections the installed modules give
it, then **Nodes**, which is EiN's own. With the Archive installed, the first section is
**Events**, charts of when in the year births, weddings and deaths fall; see
[Life events on the Statistics page](../archive/home.md#life-events-on-the-statistics-page).

### How what EiN holds grew

The **Nodes** section shows what has been added to EiN, year by year. Everything in EiN is a node:
each file and folder, and with the Archive each photo, album, person and place, and each file EiN
makes from them; see [How EiN works](../start/how-ein-works.md).

- **File storage growth** runs across the full width: the size of the files added each year,
  counting the originals and the smaller versions EiN makes of them, with a line for "Cumulative
  file size by month". The total is at the top right.
- Then one chart for each kind of node, such as **Person nodes** or **Album nodes**, **File nodes**
  first and the others largest first:
  bars for the nodes created in each calendar year, a line for the "Cumulative total by month", and
  the total, such as "2,431 nodes". Rest the pointer on a bar to read the year's count.

A node counts in the year it was created in EiN. The charts leave out the kinds that make up the system
itself, such as folders, links, accounts and sessions, and they count what you may see.

These charts can take a few seconds to appear on a large archive. When there is nothing to count,
the section says "No node history found".

## When something goes differently

| What you see                 | Why, and what to do                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home is empty                | No installed module fills it. [Modules](../admin/modules.md) says which modules there are.                                                                     |
| Events is a day out          | Home takes today's date from your computer or phone. Check its date and time zone.                                                                             |
| A red box above the sections | One section could not be loaded, and the box gives the reason. The other sections still show. Reload the page; if the box stays, tell whoever looks after EiN. |

[Memories, news and events on Home](../archive/home.md#when-something-goes-differently) covers what
goes differently in the Archive's entries.

## In the terminal

Home runs ordinary commands, which you can run yourself in [the terminal](../shell/terminal.md).
The Home page passes your own date to them; run in the terminal, they take today's date in UTC
unless you name a day.

```bash
# in EiN's terminal
onthisday                                  # what On this day shows, one line a year
onthisday 12-25 --limit 20                 # another day, more years
news                                       # what News shows, with the time in UTC
news --limit 20
events                                     # what Events shows: 7 days back, 30 days ahead
events --today 2026-01-20                  # around another date
events --days-ahead 0 --days-past 0        # today only
```

Each of the three gathers what every installed module offers, from the commands named
`onthisday-…`, `news-…` and `events-…`; with no module they print nothing.
[Writing a module](../develop/modules.md#plug-into-search-the-home-page-and-other-places) shows how
a module adds to them. The full options are in the reference for
[`onthisday`](../reference/commands-core.md#onthisday),
[`news`](../reference/commands-core.md#news) and [`events`](../reference/commands-core.md#events),
and [Commands by task](../shell/commands.md) lists more.

## Related pages

- [Memories, news and events on Home](../archive/home.md): what the Archive shows on Home and on
  the Statistics page.
- [Sharing](sharing.md): who sees what.
- [Modules](../admin/modules.md): the modules that fill Home.
- [Commands by task](../shell/commands.md): the shell commands by what they do.
