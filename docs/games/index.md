# Games

The Games module gives EiN a **Games** page: a card for each game you can play in the browser, on
the computer you sit at, with the keyboard and the mouse. Your saved games and settings are kept in
your home, so you go on where you left off on any computer, and a game can be played together, by
the people here and by someone you invite from another EiN. This page is for everyone who plays, and
for the administrator who sets the games up.

The games themselves come from **game modules**. Games names none of them: each game module brings
the engine that plays its games and the commands that fetch and list them, and Games gives every one
of them the same page, the same saves and the same way of playing together. A game's engine runs
beside the page in the browser, in a worker of its own, and reads the game's files from EiN as it
needs them, so a large game starts without downloading all of it first.

## Install it

Game modules are made by others than EiN, and are not among EiN's published modules: install one
from its repository's address, as [Modules from other places](../admin/modules.md#modules-from-other-places)
describes, or by name once its organisation is one of your **Module sources**:

```bash
# in EiN's terminal, as the administrator
mod install https://forge.example/someone/module-rover
```

A game module needs Games, and `mod install` installs Games along with it. You can also install
Games by itself, `mod install games`, but its page then says that no game module is installed.
[Modules](../admin/modules.md) covers installing, updating and removing modules.

**Games** is then in the sidebar, under **Browse**, for everyone who is signed in.

## The Games page

**Games** shows a card for each installed game, with its picture and a line on what it is, such as
its size. A card opens the game's own page. With more than one game module installed, each card
also names the module its game is from. Type in **Filter games…** to narrow the cards by title.

Under **Free downloads** are the games a game module offers but that are not here yet, such as a
free demo or a game whose makers gave it away, each with what it is. Only an administrator downloads
one, since it comes from the internet: **Download** on its card, where an installed game's picture
is, which also says how much it downloads. Everyone else sees "An administrator can download it."
Once it is downloaded, it moves up among the installed games.

To the administrator, the page also lists at its foot what the game modules could not answer, such
as a game module whose list of games failed.

## Play a game

Choose a game's card. Its page has the game's picture and title in the header, with **Games ›**
above the title to go back. Under the title are what the game is, for a game its module knows, and
how it is played: its keys, what a click does now, and that <kbd>F11</kbd> toggles fullscreen. Below
is the game's frame, its cover whole and dimmed behind the play button, at the game's shape,
until the game runs and again after it ends. Choose the play button to start it.

- **The keyboard**: while the game has the keyboard, it takes every key it uses, before EiN does, so
  EiN's own shortcuts wait until you leave the game. A key held down with <kbd>⌘</kbd> (Meta) stays
  the browser's. Click the game to give it the keyboard back, after clicking elsewhere on the page.
- **The mouse**: in a game played with the mouse, a click on the game gives it the mouse: the
  pointer disappears, and moving the mouse turns or aims. <kbd>Escape</kbd> gives the mouse back.
  In a game that says when its menu is up, the mouse is yours while the game's menu or console is
  up and the game's again when you close it, and the <kbd>Escape</kbd> that gives the mouse back
  opens the menu too. If the browser does not hand the mouse back as the menu closes (Chrome does
  not after you took the mouse back with <kbd>Escape</kbd>), click the game. The line under the title says
  which is the case.
- **Fullscreen**: <kbd>F11</kbd>, or the button in the header, shows the running game on the whole
  screen, and again leaves it; a game may offer it in its own video menu as well. A game always
  starts in the page, since a browser goes fullscreen only when you press a key or click. In
  fullscreen the game keeps the mouse, its menus up or not, and <kbd>Escape</kbd> is the game's
  alone: turn fullscreen off, press <kbd>F11</kbd>, or quit the game to leave. That takes Chrome or
  Edge, with EiN's address starting `https://` (or on the computer EiN runs on); holding
  <kbd>Escape</kbd> down still leaves fullscreen there. Elsewhere, and in Firefox and Safari,
  <kbd>Escape</kbd> leaves fullscreen, and the game carries on in the page with its menu open.
- **Sound off** and **Sound on**, the loudspeaker in the header, turn the game's sound off and on.
  Your browser remembers it, for every game.
- **Quit** from the game's own menu ends the game, and the page shows the play button again.

A game stands still while its page is hidden, such as in another tab, and its sound waits with it.
Leaving the page stops the game. When a game stops by itself with an error, the frame says so, with
the last lines the game wrote, which often say why, and **Play again**.

### Start on a map

Some games can start on any of their maps, rather than at their own beginning. Their page has a
**Play on a map** box in the header: type part of the map's name, such as `arena`, and choose
`arena3` to start the game there.

### Saved games and settings

When you are signed in, what the game writes for you, its saved games and its settings, is kept in
your home, in a folder of each game's: `~/.rover/classic` for the game `classic` of a game module
named `rover`. The next time you play the game, on any computer, it reads them from there, and its
own menus list your saved games. Nobody else sees them, and each game has its own, so a save is only
ever loaded into the game it was made in. A game module may keep your settings once for all its
games, in `~/.rover` itself, so your key bindings are the same whichever of its games you play.
Without an account nothing is kept beyond the page.

### Delete a game

**Delete game** under **⋮** in the header removes the game's files from EiN, for everyone who plays
here, after asking. What players keep of it, their saves, stays in their homes. Deleting it needs
the right to remove its files, which an administrator has.

## Add games and maps by dropping them

Drop a game's files or folder anywhere on the Games page to add it, and drop a map to add it to a
game you have. While you drag files over the page it says "Drop games and maps to add them".

Each game module says which files are its own: by their names, such as a name ending in `.rvr`; for
a folder, by a file at its top; and for a file, by the bytes it starts with. The page tries every
thing you drop, a file or a folder, against each module's rules, without uploading anything first:

- When exactly one place takes it, it is uploaded there: a game's files into the game module's
  folder, a map into the `maps/` folder of the game it is for.
- When more than one place could take it, such as a map that two of your games can play, or when no
  game module recognises it, a dialog, **Where do they go?**, asks for each such thing where it goes.
  A recognised thing has the first place chosen already; one nobody recognised can go into any game
  module's folder or into any installed game. **Leave it out** uploads it nowhere. **Upload** sends
  the rest.

What is uploaded goes through EiN's uploads, as any upload does, and once it has landed, a notice
says what went where, such as "Uploaded level9.map, a Star Rover map, into Star Rover › maps", and
the cards are read again. Nothing starts by itself: a new game is a new card, and a new map is
played from its game's page, with **Play on a map** or as the map to host a game on.

## Play together

A game that can be played together, one whose module plays together and that has maps, has more
buttons in its header: **Start server**, **Invite** and **Connect**.

### Start a server here

**Start server** has EiN run the game on the server for others to join. Choose the **Map**, how it
is played, such as **Deathmatch** or **Cooperative**, when the game has more than one way, and how
many **Players** it has room for. Then **Start server**. It takes a moment to start; you need to be
signed in.

While it runs, the play button says whose server it is and who plays: "On anna's server, arena3,
deathmatch, 1/4 playing". The play button then enters the game on that server, for you and for everyone
else here who opens the game's page. A player who reloads the page comes back as the same player.

The server runs until it is stopped:

- **Stop server** in the header stops it, for the one who started it and for an administrator, after
  asking: everyone in it is dropped.
- When nobody has played on it for five minutes, it stops by itself.
- It stops when the service that runs it stops.

When the server stops while you play, the frame says that the game on the server ended.

### Invite someone from another EiN

While a server of the game runs here, **Invite** gives a link for someone on another EiN, such as a
friend's. Copy it and send it to them; it lets them in until the time the dialog gives, twelve hours
from now. They need the same game on their EiN, with the map the server plays: they play with their
own copy of the game there, and their browser plays in the server here.

### Connect to a game on another EiN

When someone on another EiN invites you, open the game's page here and choose **Connect**, paste the
link and choose **Connect**. The link says which game and map it is for. If the game is another of
your games of the same kind that has the map, its page opens instead. The play button then says "On the
server at" their EiN's address, and enters their game. **Disconnect** goes back to playing here.

**Connect** is there while no server of the game runs here; while one does, the play button enters that one.

### The services that run them

A hosted game is run by a service, which runs while its module is installed:

- A game module whose games play against a server brings that server as a service of its own, with a
  name of its own.
- For a game module whose players play directly with one another, Games' own service,
  `games-relay`, runs the game: it runs none of the game itself, and passes each player's moves to
  the others.

When the service is not running, **Start server** says so, and nobody can host its games until an
administrator starts it, on the **Status** page's **Services** tab or in the terminal:

```bash
# in EiN's terminal, as the administrator
service start games-relay
```

[Services and logs](../admin/services-logs.md) covers services, and the lines each service writes
about the games it runs, who sat down and who left, are in its log.

## On a dashboard

A game module can offer [Dashboards](../dashboard/index.md) a card of its own that plays one of its
games' demos, as the game does when nobody plays: silent, without keys or mouse, one demo after the
other. Add it as any card; it is listed under the game module.

## From the terminal

The same is there in EiN's terminal:

```bash
games-list                                # the game modules and their games
games-host rover classic arena3 --max 4 --mode deathmatch
# k3x9
games-servers                             # the games hosted, and who plays in each
games-invite k3x9 --hours 2               # an invitation's link, valid two hours
games-stop k3x9
```

`games-host` answers the hosted game's id once it runs, and `games-servers` lists each with its
module, game, map, mode, players and state. `games-invite` answers the link's path on this EiN's
address: put the address in front of it before you send it, such as
`https://ein.example/__invite/…#rover::classic:arena3`. Downloading a game, and its game module's own
commands, are the game module's.

## Related pages

- [Modules](../admin/modules.md): installing a game module
- [Dashboards](../dashboard/index.md): the cards a game module offers
- [Services and logs](../admin/services-logs.md): starting a game's service, and its log
- [Writing a module](../develop/modules.md#offer-games): making a game module of your own
