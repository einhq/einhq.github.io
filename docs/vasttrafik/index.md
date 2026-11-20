# Västtrafik

The Västtrafik module shows public transport in and around Gothenburg on a dashboard: when the next
tram, bus or boat leaves a stop, where the vehicles are right now, and what disrupts them: a moved
platform, a diversion, a line not running. It asks
[Västtrafik's open API](https://developer.vasttrafik.se) for all three, with a key of your own, and
a screen in the hall can show it as well as a phone.

## Install it

Install it from **Settings → Modules**, or in EiN's terminal:

```bash
# in EiN's terminal, as the administrator
mod install vasttrafik
```

[Modules](../admin/modules.md) covers installing and removing modules.

## Give it a key

Västtrafik answers only an application it knows. Make one, once:

1. Sign in at [developer.vasttrafik.se](https://developer.vasttrafik.se) and create an application.
2. Subscribe the application to **Planera Resa v4**, for departures and vehicles,
   **Geografi v3**, for the list of stops, and **Störning v1**, for disruptions.
3. Copy the application's **authentication key**: the key and secret written together as one
   string.
4. In EiN, open **Settings → System → Västtrafik** and paste it into **Västtrafik key**, or, in
   EiN's terminal:

   ```bash
   # in EiN's terminal, as the administrator
   config set CFG_VASTTRAFIK_KEY '<the authentication key>'
   ```

The key is a secret: no shell sees it, the Settings page says only whether it is set, and EiN sends
it to Västtrafik's address alone. Without it, the cards say that the key is missing; with an
application that lacks a subscription, they name the API it lacks.

## On a dashboard

The module offers three cards to [Dashboards](../dashboard/index.md):

| Card                    | What it shows                                                                                                                                                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Departures**          | The next departures from one stop: each line's badge in its own colours, where it is going, its platform, and the minutes until it leaves as Västtrafik now expects it. A cancelled one is struck out in red, and a line Västtrafik reports a disruption on has a warning mark.            |
| **Vehicles on the map** | The trams, buses and boats around one or more stops on a map, where they are now: each a dot under its line's badge in its own colours, as on **Departures**, gliding on to the next place, on its line's faint track with the stretch it just drove marked behind it; the stops are pins. |
| **Disruptions**         | What Västtrafik says disrupts some stops, and some lines anywhere along them: each with its lines' badges, its title, what Västtrafik says further, and until when it lasts. The worst first, marked red, then orange, then yellow.                                                        |

Their settings:

- **Stop** (**Stops** on the map): type part of its name, such as `brunns`, and pick it. The list
  holds every one of Västtrafik's stops, over eleven thousand, and shows those that match what you
  type.
- **Lines**: only these lines, chosen among those that leave the stop within the next twelve hours.
  Every line when you choose none.
- **Platforms**, on **Departures**: only from these, such as `A`; a platform lettered `A` takes `A1`
  and `A2` as well.
- **At most**, on **Departures**: how many departures it lists, up to 20. A small tile shows the
  first that fit.
- **Show**, on **Departures**: the minutes until each leaves, or the time it leaves. With the time,
  a departure that is late or early has the time it was planned for struck out beside it.
- **Lines**, on **Disruptions**: also these lines' disruptions anywhere along them, not only those
  at the stops. A line here is the one that calls at your stops: line 6 in another town is another
  line.
- **Also those starting within**, on **Disruptions**: hours ahead, up to a week, to list a closure
  that has not begun yet as well; it says when it starts. None unless you set it.
- **What Västtrafik says further**, on **Disruptions**: the description below each title, such as
  the reason and the hours it applies. On unless you turn it off.
- **Metres around the stops**, on the map: how much of the map the card shows, as how far it reaches
  beyond the stops, from 100 to 5,000 metres. The vehicles and tracks are those of the whole card,
  however large it is, and a little beyond its edges, so that a vehicle drives in from the edge
  rather than appearing on the map. Västtrafik gives at most 200 vehicles at a time, which a large
  map of the city centre can hold.
- **The lines' tracks**, on the map: where each line runs, drawn faintly under its vehicles in the
  darker of its colours. A line is drawn once one of its vehicles has been on the map, in each
  direction one was going, as Västtrafik gives that vehicle's journey, and stays drawn for a day
  after, between its vehicles. Behind each vehicle, the stretch it drove in the last ten minutes is
  drawn strongly, fading as it ages, up to where the next vehicle of its line and direction is: at a
  glance, a strong stretch was passed a minute ago, a faint one ten or more. On unless you turn it
  off.

On **Departures**, a warning mark before a departure's direction says that Västtrafik reports a
disruption on its line, wherever along the line it is; one after the stop's name, a disruption at
the stop itself, such as a platform moved. Hover over the mark to read what it is; the
**Disruptions** card gives the whole text.

The departures are asked for again as soon as EiN's answer is 20 seconds old, and the minutes count
down in between. The map is asked for again as soon as its answer is five seconds old, and each
vehicle glides from where it was to where it is; the vehicles themselves move every two or three
seconds. The tracks are asked for every minute, so a line coming onto the map is drawn within one.

## How often it asks Västtrafik

EiN asks Västtrafik only while a card or a command wants an answer, and keeps each answer for a
while, so that every screen showing the same stop costs a single call:

| What                  | Kept for |
| --------------------- | -------- |
| The list of stops     | a day    |
| The lines at a stop   | 6 hours  |
| A stop's departures   | 20 s     |
| The disruptions       | 5 min    |
| The vehicles in a box | 5 s      |
| A line's track        | a day    |
| Where a vehicle was   | 10 min   |

Each is kept from when Västtrafik was asked. A departures or map card asks again just as its answer
is due, so the first screen to ask brings the new one and every other screen on the same stop has it
at once: what a screen shows is never older than the time above.

When Västtrafik does not answer, which it does now and then for vehicles, the last answer is given
for a while longer: up to two minutes for departures, 30 seconds for vehicles, half an hour for disruptions.

## In the terminal

The cards draw what six commands answer, which you can run yourself:

```bash
# in EiN's terminal
vt-stops brunnsparken
# 9021014001760000  Brunnsparken, Göteborg
vt-departures 9021014001760000 --line 6 --limit 3
# 17:40  6     Kortedala  (C1)  +5 min
# 17:43  6     Länsmansgården  (B2)
# 17:45  6     Kortedala  (C1)  +2 min
vt-lines 9021014001760000
vt-positions --around 9021014001760000 --margin 500 --line 6
vt-positions --bbox=57.69,11.94,57.72,11.99
vt-tracks --around 9021014001760000 --margin 500 --line 2,3
# 2     Linnéplatsen  27 points
# 3     Marklandsgatan  34 points
vt-disruptions --stop 9021014001760000
# normal  2026-11-01 04:00 – 2026-12-20 23:59  lines 6
#   Linje 6, Rådmansgatan läge B är flyttad cirka 100 meter norrut.
#   Orsaken är ledningsarbete.
```

A stop is named by its gid, the 16 digits `vt-stops` lists. [Västtrafik commands](commands.md) has
every option.

## Related pages

- [Dashboards](../dashboard/index.md): putting cards on a dashboard
- [Show a dashboard on a screen](../dashboard/screens.md): a dashboard on a wall screen, with no one
  signed in
- [Configuration](../admin/configuration.md): settings and secrets
