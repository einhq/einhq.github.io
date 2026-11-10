# Automations

An automation makes things happen in the house by itself: a lamp goes on at motion when it is dark
and off a while after, a heater keeps a room between two temperatures while someone is home, a
button toggles a lamp, a line runs at half past six on weekdays, a scan is filed as it lands in a
folder. It is made of **nodes wired together**: inputs that hear devices, the clock and files coming
into a folder, logic that compares and combines, values worked
out from readings, timers, and actions that switch controls and run command lines. Each automation
is a YAML file, written by members of the `automation` group, and runs with the rights of the person
whose file it is. This page is for those members. [Automation](index.md) covers connecting the
devices, and [Devices](../guide/devices.md) the devices themselves.

## The Automations page

**System → Automations** in the sidebar, for members of the `automation` group, opens the
automation in the whole of the page below its bar. The list of automations is a drawer over its left
edge, each with a dot that says whether it runs (green), is off (grey) or is held back (red, with
why under its name); tap or drag the handle on the drawer's edge to slide it away to the left and
back. **+** beside the list's filter makes one, empty or from a starting point. On a phone the
drawer covers the page, and closes when you pick one.

An automation opens on three tabs, under its name in the bar:

- **Graph**: its nodes as cards wired together, which you drag and zoom as a map (the wheel or
  two fingers, a double tap to zoom in). With no card selected, the panel on the right lists the kinds of node by group,
  each with what it does, and a filter; click one to add it in the middle of what is in view (on a
  phone, **+** in the canvas's corner lists them). Drag a card to move it. Drag from one of a
  card's outputs on its right edge to another card to wire them (while you drag, the inputs it may go
  to light up, and the others dim): `true` is the green output, `false`
  the red one, and a switch has one per case. Each kind of node has a colour of its own, on the band
  behind its card's title. Tap a card to set it up in the panel instead (a drawer on a phone; × goes back to the list): its **Name**, which is what wires and math name it by and its
  key in the YAML (renaming it renames it there too), a **Label** shown on its card instead, and its
  settings, the required ones starred. A button node has **Press**, while the automation runs. At
  the panel's foot, **About … nodes** says what the kind does, what it sends and what each setting
  means; fold it away and it stays folded. A card that reads or switches a device has the device to
  pick, and under it the device's endpoints (its controls, on a card that switches) with their
  latest values; picking a device picks its first endpoint, and tapping another picks that. Tap a wire and the red bin in the corner, or press Delete, to take it out; the bin at the top right of a node's panel, or Delete on a selected node, asks before the node and its wires go. While the
  automation runs, each wire is labelled at its middle with the last value that went along it and
  how long ago, lit for a moment when one just did; a true wire keeps its last true after its node has
  sent false since. A card says when its timer runs out, and its problems.
- **YAML**: the file itself, to read or change as typed.
- **Runs**: what it did, as its [run log](#see-what-automations-did) has it, as it happens.

The bar also says whether it runs, or how many problems it has: tap **3 problems** to read them,
and one of them to pick the card it is about. Each card with a problem has a red border and says
what it is. There is no Save: every change saves itself a moment after you make it, also when it
leaves problems, and an automation with problems is not run until they are gone. The bar says
**Saving…** and then **Saved**; YAML typed in the YAML tab is saved once it is YAML again, and
until then the bar says **Not saved** and why: tap it to try again, or the round arrow beside it to
read the file again, dropping what was not saved. **On** turns the automation on and off. A change
in the graph writes the YAML anew, so comments in the file are lost; one in the YAML tab keeps it
as typed.
Opening an automation's file in **System → Nodes** ([Nodes](../concepts/nodes.md)) opens it here
too.

A module's automation is shown but not changed here, with the module's name in the bar, and only
the administrator turns it on and off.

## Try one out without switching anything

The flask among the buttons in the graph's corner simulates the automation: it runs the graph as it
is in your browser, on the same engine EiN runs, with nothing real behind it. The bar says
**Simulating**, cards can be moved meanwhile but not wired, set or removed, and the panel on the right (at the foot on a
phone) has:

- **A clock** of the simulation's own, which keeps pace with the real one, holds still with the
  pause button, and moves on with **+1 min**, **+10 min**, **+1 h** or **Next timer**, so a timer of
  five minutes need not take five minutes. Clocks and between nodes go off as it passes their times.
  Times are in your browser's time zone, written in your date and time format (Settings → Language).
- **Inputs**, one for each node that starts things: a device node takes a reading of **on** or **off**, or any value
  you type, sent as a reading, or as a **Press** (a button's single or long); an online node is set
  online or offline; a button node is pressed; a clock node is run on to its next time; a link in is
  sent a value; a file node is given a file's name, as if it came into its folder.
- **Controls**, what each control the automation writes holds in the simulation.
- **Log**, newest first: each input you fed, each node that sent something and on which
  output, each value a node held back and why (a compare or an and that would send what it sent
  last, a reading a device node does not pass on), and each control it would set, command line it
  would run and link out it would send to, with what its debug nodes say. **What it would do** shows
  only those last.

It starts from the devices' latest readings, which it reads but never writes. A control it sets is
not switched: the simulated device takes the value, as a real one would report it back, and a toggle
flips what it holds. A command line is not run, and sends on an empty value. A link out reaches the
automation's own links in, and no other automation. The wires say what went along them, as while it
runs. The flask again, or the cross at the top of the panel, ends the simulation; nothing of it is
kept.

## A first automation

The hall lamp goes on at motion when it is dark, and off five minutes after the motion ends. On the
Automations page, that is **+**, **Motion light**, then the devices set to yours on the cards. In
the terminal:

```bash
# in EiN's terminal
automation-new hall-light --from motion-light
```

```text
made /etc/automations/hall-light.yaml from motion-light: change its devices to yours
```

The file it makes:

```yaml
description: The hall lamp on at motion when it is dark, off five minutes after the motion ends
nodes:
  motion: { type: device, endpoint: hall-sensor/motion, pos: [0, 0], to: [linger] }
  linger:
    type: timer
    off-after: 5m
    pos: [240, 0]
    to: { out: [dark-and-moving], false: [lamp-off] }
  lux: { type: device, endpoint: hall-sensor/illuminance, pos: [0, 140], to: [dark] }
  dark: { type: compare, below: 30, pos: [240, 140], to: [dark-and-moving] }
  dark-and-moving: { type: and, pos: [480, 60], to: { true: [lamp-on] } }
  lamp-on: { type: control, endpoint: hall-lamp/switch-0, value: on, pos: [720, 0] }
  lamp-off: { type: control, endpoint: hall-lamp/switch-0, value: off, pos: [720, 140] }
```

Read it along its wires (`to`): the motion sensor's readings go to a timer, which says true at once
and false five minutes after the motion went false. The light sensor's readings go to a compare,
which says true while it is below 30. The `and` is true while both are, and when it becomes true the
lamp is switched on; when the timer says false, it is switched off.

1. Change the devices to yours: `edit /etc/automations/hall-light.yaml`
   ([The editor](../shell/editor.md)), then save it with `automation-set`, which checks it first:

   ```bash
   # in EiN's terminal
   automation-set hall-light < /etc/automations/hall-light.yaml
   ```

   An automation that is wrong somewhere is not written, and `automation-set` says which node and
   what is wrong with it. `--draft` writes it anyway, to finish later; it is not run until it is
   right. Text that is not YAML at all is never written.
2. Check it:

   ```bash
   # in EiN's terminal
   automation-check hall-light
   ```

   ```text
   hall-light has no problems
     hall-sensor/motion: false
     hall-sensor/illuminance: 12
     hall-lamp/switch-0: "off"
     motion says false
     lux says 12
     dark says true
     dark-and-moving says false
   ```

   It runs the latest readings you may read through the automation and says what each node would
   say now, without switching anything.

The automation engine reads the folder again within a second of a change, so the automation works
from the moment it is saved. `automations` lists them all, and `automation-status hall-light` says
what each of its nodes last sent while it runs.

## Where automations are

- Each automation is a file `/etc/automations/<name>.yaml`, called by its name: `hall-light`.
  `automation-new` makes one, empty or from a starting point (`automation-new --examples` lists
  them), on the database, so it is backed up with everything else.
- Only members of the `automation` group see the folder and write in it. The administrator adds
  someone with `group-add-member automation helen`, or in **Settings → Groups**.
- `automation-disable hall-light` turns one off without removing it, and `automation-enable
  hall-light` on again. To remove one, remove its file.
- A module can bring automations of its own. They are under `/etc/automations.d/<module>/`, called
  `<module>/<name>`, run as the administrator, and change only with the module. The administrator
  turns one off with `automation-disable <module>/<name>`.

### Whose automation it is

An automation runs as the owner of its file, with that person's rights and nothing more: Helen's
automation hears only the endpoints Helen may read, switches only what Helen may switch, hears only
of the files Helen may read, and runs its lines as Helen. One whose owner may not read an endpoint it
listens to, write a control it switches, or read a folder it watches, is not run, and says which: rights are checked when the file is read and every minute
after, so taking a device from someone stops their automations that use it. Copying someone's
automation into a file of your own makes it yours.

A file that others than its owner may change, by its mode or by an entry on its access list, is not
run, since whoever could change it could act as its owner. `automation-new` makes the file yours
alone; after a `chmod` or a `share-set` that let others write it, `chmod 644` and removing the entry
are the way out.

What an automation's nodes say, in `automation-status <name>` and its run log, is for its owner (and
whoever may change its file) to see: it holds the readings the owner may read.

## What an automation says

| Key           | What it is                                                          | Needed |
| ------------- | ------------------------------------------------------------------- | ------ |
| `description` | A sentence for people, which `automations` shows                    | No     |
| `enabled`     | `false` to keep it from running; `automation-disable` does the same | No     |
| `nodes`       | The nodes, each under an id of its own                              | Yes    |

Each node has:

| Key     | What it is                                                                                                                                                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`  | Its kind, below                                                                                                                                                                                                                                       |
| `to`    | The nodes it sends to: a list, such as `to: [lamp-on]`. A node that says true or false also sends on `true` and `false` alone: `to: {true: [lamp-on], false: [lamp-off]}`; a list sends both. A switch sends on each of its cases and `else`, by name |
| `label` | A name for people, beside its id                                                                                                                                                                                                                      |
| `pos`   | Where it is drawn, `[x, y]`                                                                                                                                                                                                                           |

and the settings of its kind. An id is letters, digits, `-` and `_`. A node has one input, and any
number of nodes may be wired into it. The wires may not go round in a circle.

A device's endpoint is written `<device>/<endpoint>`, as the device's **Info** tab and `device-show`
name it: `hall-sensor/temperature`, `hall-plug/switch-0`. A time is a number and `s`, `m`, `h` or
`d`: `30s`, `10m`, `1.5h`, `1d`.

### Messages, and true and false

What goes along a wire is a value: a reading, a word such as `single` for a press, `on` or `off`, a
number. A node that asks whether something is true reads `on`, `true`, `yes`, `open`, a number other
than 0 and any other word as true, and `off`, `false`, `no`, `closed`, `0` and nothing as false.

A node that says true or false (`online`, `compare`, `and`, `or`, `not`, `timer`, `held`,
`between`) sends only when what it says changes, so a stream of readings that keep it true does not
switch the lamp again and again. `every: true` on such a node sends each time. `and` and `or` read
the latest value of each node wired into them; one that has sent nothing yet counts as false.

### The nodes

**Inputs**, which nothing is wired into:

| Type      | Settings                             | It sends                                                                                                                                                                         |
| --------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `device`  | `endpoint`; `is`                     | Each reading of the endpoint, or each press of a button. With `is: single`, only that value or kind of press (a Shelly's are `single`, `double`, `triple` and `long`)            |
| `online`  | `device`                             | True when the device comes online, false when it goes                                                                                                                            |
| `clock`   | `at: '07:30'` and `days`, or `every` | The time, once a day at `at` in the system's time zone (on `days`: `weekdays`, `weekends` or `[mon, wed, fri]`), or each time `every` (a minute or more) has passed on the clock |
| `between` | `from`, `until`, `days`              | True from `from` until `until`, false outside it: `from: '22:00'`, `until: '06:30'` goes over midnight                                                                           |
| `button`  | `value`                              | `true`, or its `value`, when it is pressed with `automation-trigger <name> <node>`                                                                                               |
| `link-in` | `name`                               | What a `link-out` of the same name sends, from any automation of the same owner                                                                                                  |
| `file`    | `folder`; `match`, `changes`         | The path of each file that comes into `folder` ([A file in a folder](#a-file-in-a-folder))                                                                                       |

**Logic**:

| Type      | Settings                      | It sends                                                                                                                                 |
| --------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `compare` | `is`, `not`, `above`, `below` | Whether the value meets all that are given: `below: 30`, `is: on`, `above: 18` with `below: 23`                                          |
| `and`     |                               | True while everything wired into it is true                                                                                              |
| `or`      |                               | True while anything wired into it is true                                                                                                |
| `not`     |                               | True when the value is false                                                                                                             |
| `switch`  | `cases`                       | The value, on the first case it meets, else on `else`: `cases: {cold: {below: 18}, warm: {above: 23}}` sends on `cold`, `warm` or `else` |

**Values**:

| Type        | Settings                                                        | It sends                                                                                                                             |
| ----------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `math`      | `expression`                                                    | A value worked out from the value and the nodes wired in ([Expressions](#expressions))                                               |
| `aggregate` | `fn`: `avg`, `min`, `max`, `sum`, `count`, `any`, `all`, `last` | The average, least, most or sum of the latest values of the nodes wired in, how many are true, whether any or all are, or the newest |
| `set`       | `value`                                                         | Its own value instead of the one that came: a word, a number, or text with `${value}` in it, as `'the hall is ${value} °C'`          |

**Time**:

| Type       | Settings    | It sends                                                                                                                                              |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `delay`    | `for`       | Each value on, `for` later                                                                                                                            |
| `timer`    | `off-after` | True at once when a true value comes, false `off-after` after the value went false, or after the last press. Another true value meanwhile holds it on |
| `held`     | `for`       | True once the value has been true for `for`, false as soon as it is not                                                                               |
| `debounce` | `for`       | The last value, once none has come for `for`                                                                                                          |
| `throttle` | `for`       | At most one value in `for`, and the newest at its end                                                                                                 |

**Actions**:

| Type       | Settings            | It does                                                                                                                                                                                                                                                                              |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `control`  | `endpoint`; `value` | Writes the control, as `echo on > /dev/hall-lamp/switch-0` does: its `value` (`on`, `off`, `toggle`, a number), or else the value that came, true as `on` and false as `off`. A control that already has the value is not written again; `toggle` always is. Then sends the value on |
| `shell`    | `run`; `timeout`    | Runs the command line as the automation's owner ([Lines](#lines)) and sends what it printed on                                                                                                                                                                                       |
| `link-out` | `name`              | Sends the value to every `link-in` of that name in the owner's automations                                                                                                                                                                                                           |
| `debug`    |                     | Writes the value to the run log                                                                                                                                                                                                                                                      |

### Expressions

A `math` node works out a value: `value * 1.8 + 32`, `round(value, 1)`, `outdoor - indoor`,
`value > 25 ? 'warm' : 'cool'`.

- `value` is the value that came, `topic` where it came from (`hall-sensor/temperature`), and each
  node wired in is its latest value under its id, with `-` written `_`: a node `outdoor-temp` is
  `outdoor_temp`. The node waits until every one it reads has sent something.
- Numbers, `'text'`, `true`, `false`, `on`, `off`; `+ - * / %` (`+` also joins text); `== != < <= >
  > =`(`==`reads`on`as true, as a compare's`is`does);`and`,`or`,`not`(or`&& || !`);`a ? b : c`.
- `round(x)` or `round(x, digits)`, `floor`, `ceil`, `abs`, `min`, `max`, `avg`, `sum`, and
  `clamp(x, low, high)`.

### Lines

A `shell` node runs any command line you could type in EiN's terminal, as the automation's owner:
`todo-add` to put something on a list, a script of your own, `echo on > /dev/heater-plug/switch-0`.
The value that came is `$VALUE` and where it came from `$TOPIC`; it never becomes part of the line
itself, so a device can say anything without running anything. What the line prints is the value
the node sends on, a number when it prints one. A line that fails or runs longer than its `timeout`
(30 s unless set) sends nothing, and its node and the run log say why.

An automation's actions run one after another, each when the one before has ended; another
automation's do not wait for them.

### Over a restart

Timers count from when a reading came, not from when the engine heard it, and what an automation
waits for is kept when the engine stops. So a lamp whose motion ended four minutes before EiN
restarted still goes off a minute after it starts again, and a lamp someone switched on by hand an
hour after the motion ended is left on.

Readings and presses that come while the engine is stopped wait in its queue. Those said more than a
minute before it starts again bring the automations up to date but switch nothing: a press from an
hour ago does not toggle a lamp now. A time of day that passed meanwhile is not caught up, and a file
that came into a folder meanwhile is not sent.

## More examples

### A tour of every kind of node

**automation/tour**, under System → Automations, is the Automation module's own: seven small flows
with every kind of node among them, its YAML commented flow by flow (the YAML tab shows it). Its
devices are invented (`example-…`), so it switches nothing real, and it comes off. Simulate it with
the flask to see each flow work, or start one of your own from it: **+** beside the list, starting
point **Tour of every node**, or `automation-new <name> --from tour`, then set your own devices.

1. A motion light: device, compare, not, and, timer, control.
2. A button: a device's **Only when it is**, a button node, set, and a control that writes the value
   that came.
3. Temperature bands: debounce, math, debug, switch.
4. An average indoors, shared: aggregate, throttle, link out.
5. What the link brings: link in, held, or, shell.
6. The clock: clock, delay, between, online.
7. A file: file.

An and, or, math or aggregate keeps the latest value from each node wired into it, so wire a
timer's or a compare's **out** into it (true and false both), as the motion light does, not its
true alone: otherwise it holds the last true for ever.

### The heater between two temperatures

```yaml
# automation-new heater --from heater
description: The heater keeps the hall between 19 and 21 °C while someone is home
nodes:
  temperature: { type: device, endpoint: hall-sensor/temperature, to: [cold, warm] }
  cold: { type: compare, below: 19, to: [cold-a-while] }
  cold-a-while: { type: held, for: 10m, to: [heat] }
  away: { type: device, endpoint: indoors/away, to: [home] }
  home: { type: not, to: [heat] }
  heat: { type: and, to: { true: [heater-on] } }
  warm: { type: compare, above: 21, to: [warm-a-while] }
  warm-a-while: { type: held, for: 5m, to: { true: [heater-off] } }
  heater-on: { type: control, endpoint: heater-plug/switch-0, value: on }
  heater-off: { type: control, endpoint: heater-plug/switch-0, value: off }
```

The heater goes on once the hall has been below 19 °C for ten minutes and nobody is away, and off
once it has been above 21 °C for five. `indoors/away` is a switch of a
[virtual device](virtual-devices.md), which whoever leaves last turns on.

### A button toggles a lamp

```yaml
# automation-new porch --from button-toggle
description: A press of the porch button switches the hall lamp on or off
nodes:
  press: { type: device, endpoint: porch-button/input-0, is: single, to: [toggle] }
  try-it: { type: button, label: Try it, to: [toggle] }
  toggle: { type: control, endpoint: hall-lamp/switch-0, value: toggle }
```

`automation-trigger porch try-it` presses the `button` node, to try the automation without the
real button.

### Half past six on weekdays

```yaml
# automation-new morning --from morning
description: The hall lamp on at half past six on weekdays
nodes:
  morning: { type: clock, at: '06:30', days: weekdays, to: [lamp-on, note] }
  lamp-on: { type: control, endpoint: hall-lamp/switch-0, value: on }
  note: { type: shell, run: 'echo "morning at $VALUE"', to: [shown] }
  shown: { type: debug }
```

Half past six is in the system's time zone (`TZ` in `~/ein/.env`,
[Installing in detail](../admin/install.md#env)). Write a time in quotes.

### A file in a folder

```yaml
# automation-new inbox --from inbox
description: Each PDF scanned into the inbox is moved to the documents folder
nodes:
  scan: { type: file, folder: /home/anna/inbox, match: '*.pdf', to: [file-it] }
  file-it: { type: shell, run: 'mv "$VALUE" /home/anna/documents/ && echo "filed $VALUE"', to: [shown] }
  shown: { type: debug }
```

Set your own folders: a scanner that saves to `/home/helen/inbox` over [SFTP](../shell/ssh-sftp.md),
say, and `/home/helen/documents`. A `file` node sends the whole path of each file that comes into
its `folder`, made there or moved in, as `$VALUE` to a line, and the folder as `$TOPIC`:

- once the file is written in full, two seconds after the last write to it, so a file written in
  pieces is sent once. A file that stays empty is not sent, nor one removed or renamed before then;
  a file written under a name of its own and then renamed, as some scanners do, is sent by its new
  name.
- only the files directly in the folder, not those in folders under it.
- only those whose names match `match` when it is set: `*` is any text and `?` one character, and
  upper and lower case are alike, so `*.pdf` takes `Scan.PDF` too.
- with `changes: true`, also each time a file already there is written again.

The automation's owner must be allowed to read the folder, and hears only of the files in it they
may read: one the administrator puts there that only the administrator may read is not sent.

## See what automations did

```bash
# in EiN's terminal
automations                       # each, whose it is, whether it runs, and why not
automation-status hall-light      # what each node last sent, and what it waits for
log-read /var/logs/automations/hall-light --since 1d
```

An automation's run log, `/var/logs/automations/<name>`, keeps 30 days of its actions, the errors
of those that failed, what its `debug` nodes were sent, and its clock firings, one JSON line each:

```text
2026-11-09T06:30:00.512Z	{"node":"lamp-on","kind":"action","text":"on > hall-lamp/switch-0","at":"2026-11-09T06:30:00.510Z"}
```

Only its owner and the administrator read it. `automation-status` sums the engine up in a line,
`automations: 4 running, 41 actions`, with a `not run:` line under it for each automation the engine
holds back, and the `automation-engine` service's line on the dashboard's **Services** tab says the
same.

## When an automation does not run

| What you see                                                              | What it means                                                                                                                     | What to do                                                          |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `others than its owner may change it, so it is not run`                   | The file can be changed by the group, by anyone, or by someone on its access list                                                 | `chmod 644` the file, and take the others off its access list       |
| `its owner may not read hall-sensor/motion, or there is no such endpoint` | The endpoint is misspelt, gone, or not the owner's to read                                                                        | Correct it with `device-show`, or ask whoever shares the device     |
| `its owner may not read the folder /home/helen/inbox, or there is none`   | The folder is misspelt, gone, or not the owner's to read                                                                          | Correct the path, or have its owner share it (`share-set`)          |
| `its owner may not write hall-lamp/switch-0, or there is no such control` | The control is misspelt, or narrowed to others ([Keep a switch to some people](../admin/devices.md#keep-a-switch-to-some-people)) | Correct it, or have someone who may switch it own the automation    |
| `<node>: endpoint is needed: endpoint`                                    | A setting the node's kind needs is missing                                                                                        | Add it; [The nodes](#the-nodes) lists each kind's                   |
| `<node>: above: a device node does not read this`                         | A setting is misspelt, or one another kind takes                                                                                  | Use the settings in [The nodes](#the-nodes)                         |
| `<node>: to names lamp, which is no node`                                 | A wire goes to an id that is not there                                                                                            | Correct the id                                                      |
| `its wires go round in a circle: a → b → a`                               | A node's messages would come back to it                                                                                           | Take a wire out                                                     |
| `<node>: at takes a time of day such as "07:30"`                          | The time is not in quotes, or not a time                                                                                          | Write `at: '06:30'`                                                 |
| `it is not YAML: …`                                                       | The file does not read as YAML, often a missing space after a `:` or an unclosed `{`                                              | Correct it where the message says                                   |
| A node's status says `waits for outdoor`                                  | A `math` node reads a node that has sent nothing yet                                                                              | Nothing: it works out its value once that node sends                |
| It runs, but nothing happens when the value changes                       | A node that says true or false sends only when that changes; the lamp may already be what it would be                             | `automation-check` and `automation-status` show what each node says |
| A line's error says `Access denied for operation …`                       | The owner may not do what the line does                                                                                           | Have someone who may write the automation, or ask the administrator |
| `automations` cannot read `/etc/automations`                              | You are not in the `automation` group, or were added since you signed in                                                          | Ask the administrator to add you, then sign in again                |
