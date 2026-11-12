# Dashboards

The Dashboards module puts cards together on one page: the time, what is coming up, a picture of
the day, a device's readings, a todo list. You choose the cards and arrange them, show the page full
screen on a screen on the wall, and give that screen a link so it never has to sign in. The cards
come from the modules you have installed: each module offers the cards of what it holds, and a
dashboard shows whichever you pick. This page is for everyone who uses EiN.

## Install it

Install it from **Settings → Modules**, or in EiN's terminal:

```bash
# in EiN's terminal, as the administrator
mod install dashboard
```

**Dashboards** is then in the sidebar, under **System**, and **Dashboard** in the **Create New**
menu. [Modules](../admin/modules.md) covers installing and removing modules.

## Make a dashboard

1. Choose **Create New → Dashboard**, or **New dashboard** on the **Dashboards** page.
2. Give it a **Title**, such as "Kitchen", and if you like a **Description**, such as "By the
   fridge".
3. Choose its **Colour**: what its page and its wall are drawn in. **Every colour** runs all of
   EiN's colours across it; the others are the colours of what EiN holds, such as **People violet**
   or **Devices orange**.
4. Choose **Who sees it**: as you share new things, only you, or everyone with an account. The
   **Share** button on its page changes that later, as for an album; see
   [Sharing](../guide/sharing.md).
5. Choose **Create dashboard**. It opens, empty, ready to arrange.

The **Dashboards** page shows every dashboard you can see as a tile. Its picture is the dashboard's
layout in small, each card in its colour. Type in **Filter dashboards…** to narrow them by title.

## Add cards

On the dashboard's page, choose **Add card** (in the **⋮** menu, or the tile at the end while you
arrange it). The cards the installed modules offer are listed, each with what it shows and which
module offers it.

1. Choose a card.
2. Fill in its settings: what it shows, such as which todo list or which device. A setting with a
   list to choose from reads it from EiN as you, so it lists what you can see.
3. Give it a **Title** if you want another than the card's own, and choose its **Size**.
4. The **Preview** beside the settings draws the card as it will look, a moment after each change.
5. Choose **Add card**. It goes on at the end of the dashboard.

The cards that come with Dashboards:

| Card            | What it shows                                                                                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Clock**       | The time, large, with the day and date under it; another place's time zone, the seconds, and a label if you like                                                                                                             |
| **Coming up**   | What falls on the days ahead from every module that tells of it: birthdays and anniversaries from the [Archive](../archive/home.md), todos falling due from [Todo](../todo/index.md); **Only from** keeps it to some of them |
| **On this day** | Pictures taken on this day in earlier years, a ring for each year, as on Home                                                                                                                                                |
| **News**        | What was added lately, such as albums, as on Home                                                                                                                                                                            |
| **Device**      | A [device](../concepts/devices.md)'s readings and switches, each as on its page                                                                                                                                              |
| **Reading**     | One reading of a device, large, with how it went over the last hours                                                                                                                                                         |
| **Note**        | A few words of your own, in Markdown                                                                                                                                                                                         |

Other modules add their own: the Archive the **Picture of the day** and **Birthdays**, Todo a
**Todo list**. A card whose module is removed later says so on the dashboard until you take it off.

## Arrange it

Choose **Arrange** on the dashboard's page. Each card gets a row of buttons in its corner:

- **⠿**: hold it and drag the card to another place; the others make room as it passes.
- **Size**: Small, Medium, Wide, Tall, Large, Hero or Banner.
- **Settings**: what the card shows, its title and size, beside a preview, and **Take off**.
- **×**: take the card off. **Undo** in the message at the foot of the screen puts it back.

On a phone, arrows move a card up and down instead of dragging. Choose **Done** when it is as you
want it. Cards are laid out in their order from the top left, each in the first place it fits, so a
small card fills the gap a large one leaves. On a phone the cards stand in two columns.

**⋮ → Settings** changes its title, description, colour, how many **Columns** wide it is (6, 8 or
12; more columns size the cards more finely) and how its wall looks. **⋮ → Make a copy** makes
another dashboard laid out the same, and **⋮ → Move to trash** removes it.

Everything changes at once for everyone looking at the dashboard, a screen on the wall included.

## Show it full screen

Choose **Full screen** on the dashboard's page. Its cards fill the screen as glass tiles over the
pattern in its colour, as large as the screen allows; the pattern lights a tile now and then. The
address in the browser now opens it full screen, so you can bookmark it.

- Move the pointer to see the buttons in the corner: **Fill the screen** hides the browser too,
  **Arrange** goes back to the page to arrange it, and **×** (or <kbd>Esc</kbd>) leaves.
- The pointer and the buttons go after three seconds without moving the pointer.
- The screen is kept awake where the browser allows it, which over plain HTTP most do not; see
  [Show a dashboard on a screen](screens.md).
- **⋮ → Settings → On the wall**: **Plain tiles, for a slow screen** leaves out the blur behind the
  tiles. **Dim from** and **until** dim the wall between two times, such as 22:30 and 06:30, to the
  **Brightness while dimmed**.

To show a dashboard on a screen nobody signs in at, see [Show a dashboard on a screen](screens.md).

## Ask the assistant

With the [Assistant](../assistant/index.md) installed, the chat reads and arranges your dashboards
too: ask "which dashboards are there?", "make a kitchen dashboard with a clock and the birthdays
coming up", "show the hall temperature on this dashboard" or "dim the kitchen wall at night". With a
dashboard open, "this dashboard" means that one. It looks up what a card can show, such as a device
and its readings, before it sets it. Reading happens at once; making a dashboard, adding, changing
or taking off a card, and a [display link](screens.md) for a screen are each a
[proposal card](../assistant/chat.md#when-the-assistant-offers-to-make-a-change) you run or decline.

## From the terminal

A dashboard is a YAML file in `/archive/dashboards`, named by its title: the dashboard Kitchen is
`/archive/dashboards/Kitchen.yaml`. Its file holds its layout, which you can read and change in any
editor:

```yaml
columns: 12
wall:
  dim: { from: '22:30', to: '06:30', level: 0.35 }
cards:
  - id: k7q2
    card: dashboard.clock
    size: [4, 3]
  - id: p3mx
    card: archive.picture
    size: [8, 6]
    with: { from: onthisday, every: day }
  - id: t1zz
    card: todo.list
    size: [4, 5]
    title: Shopping
    with: { list: /groups/wrenfield/todos/Shopping }
```

Each card has an `id`, the card it is (`<module>.<name>`), its `size` in columns and rows, a
`title` (or `false` for no header), and `with`, what it shows. Changing it with the commands rewrites
it, without your comments. What cannot be read, such as a card no module offers, is shown on the
page while you arrange it.

```bash
# in EiN's terminal
dashboards                                            # the dashboards you can see
dashboard-cards --brief                               # the cards the modules offer
dashboard-create Kitchen --color device
dashboard-card-add Kitchen dashboard.clock --size 4x3
dashboard-card-add Kitchen dashboard.coming-up --with days=14 --with only=anniversaries
dashboard-show Kitchen                                # its cards and their ids
dashboard-card-set Kitchen k7q2 --size 6x3 --to 0     # resize the clock and move it first
dashboard-set Kitchen --dim 22:30-06:30@0.3
```

[Dashboards commands](commands.md) lists every flag.

## Offer a card from a module

A module offers cards in `etc/dashboard.d/cards.json`; see
[Writing a module](../develop/modules.md#offer-cards-to-dashboards).
