# Show a dashboard on a screen

A screen on the wall — a monitor by the front door, a tablet in the kitchen — shows a dashboard full
screen and never signs in. You give it a **display link**: a link that shows the dashboard as an
account sees it, so its todo lists, devices and birthdays are filled in, while whoever has the link
can change nothing. This page is for whoever sets up the screen; making the account is the
administrator's.

![The Kitchen dashboard full screen, as a screen on the wall shows it: a clock, the weather, a picture, Birthdays, a Todo list, Coming up and a Device card with a map, as glass tiles over the coloured pattern](../../assets/shots/dashboard-wall.webp "What a screen shows: the dashboard full screen, filled in as its account sees it.")

## An account for screens

A display link shows the dashboard, and anything else, as one account sees it. Rather than your
own, use an account made for screens, so a screen sees only what it should:

1. An administrator makes an account, such as **Kitchen display**, in **Settings → Users**; see
   [Accounts and groups](../admin/accounts.md). It needs no password anyone knows.
2. Put it in the groups whose things the screen shows, such as your household's group for its todo
   lists, and **devices** for the devices.
3. Take it out of the **Users** group: on the account, untick **Users** under **Groups**. Every
   account is in it, and it sees what is shared with everyone with an account, such as most albums
   and people. Left in, so does the screen. The share dialog says so when the account you choose
   is still in it.

A card showing something the account may not read, such as a device outside its groups, says so on
the screen instead.

A link never shows things as an administrator, nor as an account in the **admin**, **sudo** or
**ssh** groups, nor as a disabled one. Anyone may make a display link as their own account; only an
administrator makes one as another account.

## Make the display link

1. Open the dashboard and choose **Share**.
2. Under **Show it on a screen**, choose **Shows it as**: the account for screens. Choosing
   yourself warns that anyone with the link can read everything you can.
3. Choose how long it **Works for**. A screen wants **No end date**, which the dialog offers first.
4. Choose **Create link**, and copy the address.

The link's row then says "Shows it as Kitchen display sees it". A screen reads with the account's
groups as they were when it opened the link: after changing them, open the link on the screen again.
If the account is later disabled,
deleted or put in one of the groups above, the row says "Opens nothing" and why, and the screen
shows **This link no longer works**.

## Set up the screen

1. On the screen, open the link. It opens the dashboard full screen.
2. Make the link the browser's start page, so the screen comes back to it after a restart. A
   browser in kiosk mode, such as `chromium --kiosk <link>`, also hides its own toolbars.
3. To hide the browser without kiosk mode, move the pointer and choose **Fill the screen**.

What the screen does by itself:

- It stays on the dashboard: there is no sidebar, and the cards lead nowhere.
- It follows the dashboard: a card added or moved shows on it at once, and what the cards show is
  read again as it changes or every few minutes.
- Nobody has to scroll it: a card with more than fits shows its rows in turn, gliding by slowly.
- It loads itself again each night at about half past three, to take what an update of EiN brought.
- It stays signed in through its link for 30 days after it was last used; while it is on, that is
  for good. If it loses its session, it opens the link again by itself rather than asking to sign in.
- It is kept awake where the browser allows it. Browsers allow that only over HTTPS: over plain HTTP,
  turn off the screen's own sleep, or reach EiN over HTTPS; see
  [Ports, HTTPS and remote access](../admin/network.md).

How long a link's session lasts is the administrator's to change: **Share link session expiry** in
**Settings**, `CFG_LINK_SESSION_EXPIRES_SEC`.

## On a TV

A TV that plays video but runs no browser of its own — a Google Cast TV or Chromecast, a TV that
plays from the network (DLNA) — can still show a dashboard: the
[media service](../ems/index.md) opens it in a browser of its own, as you see it and changing
nothing, and makes live video of it. In EiN's terminal:

```bash
page-stream start /dashboard-wall/Kitchen
```

It answers the stream's id and where to play it: a path ending in `.mp4`, for a Cast device, the
same ending in `.ts`, for a DLNA TV, one ending in `screen.mp4`, the same video saying it lasts a
day, which Chrome hands a TV near it, and one ending in `index.m3u8`, a live HLS playlist, for a
player that takes HLS (Safari, VLC, an Apple TV). Put EiN's address in front, such as
`http://ein.local:8080/live/3f2a…9c.mp4`, and play it in anything that plays a stream from an
address. Anyone with the address can watch it, without signing in, until the stream stops.

- The video is a few seconds behind the dashboard, and a moving dashboard looks as it does in a
  browser, at 30 frames a second, 1920×1080 unless you give `--width`, `--height` or `--fps`.
- It stops by itself 20 seconds after the last one watching stops (`--idle` for longer), and
  `page-stream stop <id>` stops it at once. `page-stream list` lists yours.
- Each stream takes about two processor cores of the media service's machine while the page
  moves, and an encoder of its graphics card when it has one. Two run at once unless the
  administrator allows more (`EMS_PAGES`).

With the [Devices](../devices/index.md#play-on-a-speaker-or-a-screen) module there is no need
to: **Show on…** in the dashboard's **⋮** gives its wall to a Cast or DLNA screen, which streams it
as above and plays it until it is stopped, and `echo /dashboard-wall/Kitchen > /dev/living-room-tv/show`
does the same from the terminal.

Any other page can be streamed the same way, such as an album's slideshow:
`page-stream start '/media?q=sailboat&slideshow=screen'`.

### On a TV where your phone is

When you reach EiN over the internet, away from home, **Show on…** also offers **A screen near you**
for a dashboard's wall, an album's slideshow, the slideshow of what the **Media** page found, and
the file open in the [viewer](../archive/viewer.md). EiN cannot see the TV in the room you are in,
but your browser can: EiN makes something the TV can fetch, and the browser hands its address to the
TV you choose in its own list of screens. The TV then fetches it from EiN, over the internet.

- A page goes as live video of it: the media service makes it as above. Chrome hands the TV the
  video that says it lasts a day, since it offers a TV nothing shorter than 15 seconds and, on a
  phone, no HLS; Safari hands it the HLS playlist.
- A recording or a video from the viewer goes as itself, as a Cast screen in the house is given it
  ([Play on a speaker or a screen](../devices/index.md#from-the-app)): a video that is not H.264
  within 1080p is made into H.264 by the media service while the TV plays it, and one whose length
  is not known cannot go. EiN keeps the address working while your browser keeps the page open,
  and a few minutes after.
- A picture from the viewer goes as the viewer showing it, as live video of that page.

- Chrome offers the Google Cast screens on the network you are on, and Safari the AirPlay ones.
  Firefox offers none, and the row is not there.
- The browser takes a few seconds to find the TVs that can play it; then it wants another tap:
  choose **Choose the screen**.
- The TV reaches EiN at the address you opened it at, so EiN must be reachable from the internet
  over HTTPS ([Reach EiN from outside your home](../admin/network.md#reach-ein-from-outside-your-home)),
  and the video takes some of the upload of EiN's own connection while the TV plays it.
- Chrome offers a screen nothing shorter than 15 seconds: for a shorter recording or video the row
  says so.
- Keep EiN open on the phone while the TV plays: Chrome on Android pauses the TV when you leave the
  page or the screen locks, and it plays on when you come back. A page's stream waits five minutes
  for that.
- The square beside the row, the TV's own remote or the browser's list of screens stops it and lets
  the TV go. A page's stream stops by itself five minutes after the TV stops reading it.

For a page it is there when the [media service](../ems/index.md) is installed, which names
`page-stream start` as the setting `CFG_PAGE_STREAMER`; `stream-page <route>` does the same from
the terminal. For a recording or a video it is there when the [Devices](../devices/index.md) module
is installed, which names `devices-nearby` as the setting `CFG_FILE_STREAMER`; `stream-file <path>`
answers the address, `stream-file --renew <id>` keeps it five minutes more and `stream-file --stop
<id>` lets go of it.

## Turn it off

Choose **Delete link** in the dashboard's **Share** dialog. Every screen showing it goes to **This
link no longer works** at once. Deleting the account does the same for every link shown as it.

## From the terminal

```bash
# in EiN's terminal: a link shown as the account display, with no end date
share-link create '/archive/dashboards/Kitchen.yaml' --as display --never
share-link list '/archive/dashboards/Kitchen.yaml'
```
