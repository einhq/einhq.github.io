# Devices

The Devices module brings the things in the house and on its network into EiN: sensors, plugs,
switches, lights and buttons that talk MQTT, such as those running ESPHome and Shelly's; printers,
NAS boxes, speakers and screens asked over the network; web APIs; and [cameras](#a-camera) whose
picture you watch live. Its drivers make each one a device under `/dev`, with its readings, presses
and switches, and what is on the network but not yet a device is found and added with a button.
The devices, their pages and their commands are EiN's own, the same for a plug as for a phone:
[Devices](../guide/devices.md). Rules that switch them by themselves, when a reading, a press or the
clock says so, are the [Automation](../automation/index.md) module's.

This page is for the administrator who installs the module and connects the devices, and for the
household that uses them.

## What it adds

| Part                                                               | What it is                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The `ha-discovery` driver                                          | Anything that announces itself over MQTT the way Home Assistant reads it: ESPHome, and Zigbee2MQTT as far as it keeps to that; lights with their brightness and colour                                                                                                  |
| The `shelly` driver                                                | Shelly's second generation and later: Plus, Pro, Gen3 and Gen4; relays, lights with their brightness and colour, and covers                                                                                                                                             |
| The `shelly-gen1` driver                                           | Shelly's first generation: Plug S, 1, 1PM, 2.5, i3, Dimmer, Bulb, Duo, RGBW2                                                                                                                                                                                            |
| The `ipp` driver                                                   | A network printer, asked over IPP: its state, its warnings and how much of each ink or toner is left                                                                                                                                                                    |
| The `cast` driver                                                  | A Google Cast speaker or screen: what it plays, its volume and mute, play, pause, stop and seek, and the recordings, videos, pictures and pages whose paths are written to its `show` played on it; see [Play on a speaker or a screen](#play-on-a-speaker-or-a-screen) |
| The `dlna` driver                                                  | A DLNA renderer, a TV's or a speaker's, without Cast: the same as `cast`'s, over UPnP AV; see [Play on a speaker or a screen](#play-on-a-speaker-or-a-screen)                                                                                                           |
| The `snmp` driver                                                  | A NAS, a router or anything else that answers SNMP: its uptime, load, memory, each volume's use and its temperatures                                                                                                                                                    |
| The `network` driver                                               | Anything else on the network: whether it answers, and how fast                                                                                                                                                                                                          |
| The `http` driver                                                  | A web API that answers JSON, asked at its address for the readings you name, and set at the addresses you name: the weather, the price of electricity, a device on your network with a web API of its own; see [A web API](#a-web-api)                                  |
| The `rtsp` driver                                                  | A camera that sends its picture over RTSP: its streams, a picture of each now, and the picture live; see [A camera](#a-camera)                                                                                                                                          |
| The `onvif` driver                                                 | A camera that speaks ONVIF, found on the network: its streams as `rtsp`'s, its events (motion, the people it sees, tampering, a line crossed and the like), and its presets and moves where it turns; see [An ONVIF camera](#an-onvif-camera)                           |
| The **Live** tab                                                   | A camera's picture as it comes, on its device page                                                                                                                                                                                                                      |
| **Found on the network**                                           | The devices on the network that are not devices yet, with a button on the **Devices** page; see [Add a device found on the network](#add-a-device-found-on-the-network)                                                                                                 |
| The **Camera** and **Button** cards                                | For [dashboards](../dashboard/index.md): a camera's picture, and one large button for a control; see [On a dashboard](#on-a-dashboard)                                                                                                                                  |
| **MQTT broker** and **Restreamer**                                 | Two pages under **Set up** on **Settings → System**, for a [broker](#a-broker-you-already-run) and a restreamer of your own                                                                                                                                             |
| The `devices-bridge` service                                       | Hears the broker and runs the drivers                                                                                                                                                                                                                                   |
| `devices-status`                                                   | Whether the broker is heard, the drivers and the devices they drive, and whether the restreamer answers                                                                                                                                                                 |
| `devices-found`, `devices-adopt`, `devices-ignore`, `devices-snmp` | What is on the network and all it said, adding it as a device, leaving something out, and what a device answers over SNMP                                                                                                                                               |

With the [Assistant](../assistant/index.md), it also teaches the chat to read the devices, to
propose switching them, and to find and add what is on the network.

## What it needs

- **An MQTT broker**, the server the devices and EiN exchange their messages through, for the
  devices that speak MQTT: those running ESPHome, and Shelly's of every generation. The installer
  runs one beside EiN with `--devices`, in the [devices sidecar](#the-installers-sidecar); a
  broker you already run works as well.
- **A restreamer** for cameras, which the sidecar has too: it keeps one connection to each camera,
  and EiN's pages and commands watch the camera through it. Without it a camera gives only its
  still picture, when it has one.
- No broker for the rest: printers, Google Cast speakers, NAS boxes, [web APIs](#a-web-api) and
  anything else on the network are asked by EiN directly, once added, with or without one. Without
  the installer's broker nothing is found on the network, though, so add them by hand with
  `device-create`.
- **The `ems` module**, which EiN installs along with it, to ask the
  [media service](../ems/index.md) for the videos and pages a screen cannot play as they are
  ([Play on a speaker or a screen](#play-on-a-speaker-or-a-screen)). Without the media service
  itself, a screen is still given recordings, pictures and the videos it plays as they are, and the
  rest of the module works as well.
- Nothing else: not the Archive, and not the [Automation](../automation/index.md) module, which
  adds rules on top of the devices.

## Install it

With the installer's broker, add the broker and the module in one run:

```bash
# on the machine EiN runs on, in ~/ein
./setup.sh --devices --module devices
```

On a new machine, name the module to the installer, which makes it the same options:
`curl -fsSL https://einhq.eu/install.sh | bash -s -- devices`. With a broker of
your own, install the module alone, from **Settings → Modules** or in EiN's terminal, and then give
it the broker ([A broker you already run](#a-broker-you-already-run)):

```bash
# in EiN's terminal, as the administrator
mod install devices
```

The module runs one service, `devices-bridge`, which hears the broker and drives the devices.
[Modules](../admin/modules.md) covers installing and removing modules.

### The installer's sidecar

`--devices` runs the devices sidecar, one container beside EiN on the machine's own network,
`devices`, with three services in it:

- **The MQTT broker**, Mosquitto. It takes no anonymous clients. EiN signs in as `ein` and the
  devices as `device`, with passwords `setup.sh` made at the install and keeps in `~/ein/.env`:
  `MQTT_EIN_PASSWORD` and `MQTT_DEVICE_PASSWORD`. A password changed there takes effect at the next
  `./setup.sh`. The devices reach it on port 1883 of the machine (`MQTT_PORT` in `.env`), on the
  address `EIN_BIND` names. It keeps what the devices announce in the data folder's `mqtt` folder,
  so it is all there again after a restart.
- **A listener** on the machine's own network, which finds the devices that are not on the broker
  yet: [Add a device found on the network](#add-a-device-found-on-the-network).
- **A restreamer**, go2rtc, which keeps one connection to each [camera](#a-camera) EiN has and
  serves it again, to EiN on port 1984 (`STREAMS_PORT`) and over RTSP on 8554 (`RTSP_PORT`), behind the account `ein` and `STREAMS_PASSWORD` from `.env`. EiN
  gives it the cameras itself.

`setup.sh` gives EiN the broker's and the restreamer's addresses and passwords itself, and the
`device` account a device added from the network is given: those settings say **From deployment**
on the Settings page and need nothing from you. `./setup.sh --no-devices` takes the sidecar out
again, and `./setup.sh --only devices` updates it alone.

A restreamer of your own is set on **Settings → System → Restreamer**, under **Set up**: its address,
its RTSP as the media service reaches it, and the password of its account `ein`, saved together so
`devices-bridge` restarts once. Under **Now** the page says whether the restreamer answers that
account, with how many streams it has, or why not, such as "the restreamer answered 401" for a wrong
password. `devices-status --streams` says the same in the terminal.

Under Docker, and podman run as root, EiN reaches the sidecar at the machine's address on its
container network, so the sidecar needs `EIN_BIND` to be `0.0.0.0`: `setup.sh` says so when it is
not.

The devices need the device password. Read it on the machine:

```bash
# on the machine EiN runs on, in ~/ein
grep MQTT_DEVICE_PASSWORD .env
```

> [!WARNING]
> The broker speaks plain MQTT, without TLS. Whoever reaches port 1883 with the device password can
> switch the house's devices and read what they say, and whoever reaches 1984 or 8554 with the
> restreamer's password watches the cameras. Keep the ports on your home network and never forward
> them on your router; [Ports, HTTPS and remote access](../admin/network.md#what-ein-listens-on)
> lists it with EiN's other ports.

### A broker you already run

Give EiN the broker's address and an account on it:

1. Sign in as an administrator, choose **Settings** in the sidebar, and **MQTT broker** under
   **Set up**.
2. Fill in **Broker**, `mqtt://host:1883`, or `mqtts://host:8883` for a broker that takes TLS, and
   the **User** and **Password** EiN signs in with.
3. Choose **Save**. The three are saved together and `devices-bridge` restarts once. Under
   **Now** the page says whether EiN is connected to the broker, with how many devices and messages
   it has heard, or why it is not, such as "Connection refused".

Or with `config set`, the three in one call:

```bash
# in EiN's terminal, as the administrator; the leading space keeps the password out of your history
 config set CFG_DEVICES_MQTT_URL=mqtt://192.0.2.20:1883 CFG_DEVICES_MQTT_USER=ein 'CFG_DEVICES_MQTT_KEY=the password'
```

The same three are in the **Devices** category of **Settings → System**, as **MQTT broker**,
**MQTT user** and **MQTT password**. The password is a key: nobody can read it back, and EiN sends
it only to that broker ([Give a key to another service](../admin/configuration.md#give-a-key-to-another-service)).
Giving the **MQTT broker** page a broker on another host without a password removes the one saved
here, so it is not sent to the new broker. While the broker is empty no device is heard on a
broker, and only the devices EiN asks over the network itself are read.

## Connect a device

A device announces itself on the broker, and its driver makes it a device as soon as it hears it:
within seconds of the device connecting it is on the **Devices** page with all it reads and does.
Nothing is entered in EiN.

A device that is on the network but not yet on the broker is found too, and a Shelly is added from
EiN without opening its own web page: [Add a device found on the network](#add-a-device-found-on-the-network).
The sections after it say how to point each kind at the broker by hand.

### Add a device found on the network

With the installer's broker, its listener `discovery` asks the network every two minutes what is
there, over mDNS (Bonjour) and SSDP (UPnP), the way phones and computers find printers and speakers,
and over WS-Discovery, the way cameras that speak ONVIF are found, and hears what announces itself
over mDNS in between. It does not scan addresses: it hears only what
announces itself. Each thing that answered is named
by what it said, such as a Shelly Plus 1PM, an ESPHome board, a HomeKit or Matter accessory, a Hue
bridge, a camera, a speaker, a TV or a printer, and is matched to the devices EiN has already, by its name and
its hardware address.

When something found can become a device and is none yet, the **Devices** page's header has a
button that says how many, such as **2 found**. It opens **Found on the network**, a card for each,
and **Add** on a card makes it a device:

| What was found                                | What **Add** does                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A Shelly, of any generation                   | EiN sets its MQTT to the broker, with the `device` account, and restarts it. It is under **Devices** when it is back, within a minute, with all it reads and switches.                                                                                                                                                                              |
| A camera that speaks ONVIF                    | **Add** asks for the account EiN signs in to the camera with, and checks it with the camera: a device of the `onvif` driver at once, with its streams, its events, and its presets and moves where it turns ([An ONVIF camera](#an-onvif-camera)).                                                                                                  |
| A printer                                     | A device of the `ipp` driver at once: its `state` (idle, printing, stopped), its `warnings` (such as `marker-supply-low-warning`) and a level in % for each ink or toner it reports.                                                                                                                                                                |
| A Google Cast speaker or screen               | A device of the `cast` driver: `player` says whether it plays (`idle`, `playing`, `paused`) and `playing` what, as title – artist (app); `volume` and `muted` can be set, `play`, `pause` and `stop` pressed, and `seek` given a second. What is written to its `show` is played ([Play on a speaker or a screen](#play-on-a-speaker-or-a-screen)). |
| A DLNA renderer: a TV or a speaker            | A device of the `dlna` driver, with the same endpoints as a Cast device's. A TV that has Cast as well is one device of the `cast` driver, which uses its DLNA renderer when Cast does not answer.                                                                                                                                                   |
| Anything that answers SNMP: a NAS, a router … | A device of the `snmp` driver: `uptime`, `load`, `memory-used`, for each volume `<volume>-used` (%) and `<volume>-free` (GB), and a `<sensor>-temperature` for each temperature its agent reports. EiN asks with the community **SNMP community** in the **Devices** settings, `public` unless you change it.                                       |
| Anything else: a NAS without SNMP …           | A device of the `network` driver, online while it answers, with its `response-time`. EiN does not speak its own protocol yet.                                                                                                                                                                                                                       |
| ESPHome or Tasmota                            | No **Add**: the line under it says how to point it at the broker, and the sections below say more.                                                                                                                                                                                                                                                  |

A device added from the network follows it to a new address: EiN knows it by its hardware address,
and a Cast device or a DLNA renderer by the id it gives itself, so a TV that has used both its cable
and its Wi-Fi is one device, asked at the address it announced itself at last.
A printer is asked every two minutes, a Cast device or DLNA renderer every 15 seconds and the rest
every minute.

SNMP is often off on a NAS or a router until it is turned on in its own settings, usually read-only
with the community `public`; a NETGEAR ReadyNAS has it under **System → SNMP**. One added before
SNMP was on is a `network` device: forget it and add it again. To see what a device's agent answers
beyond what the driver reads, walk it:

```bash
# in EiN's terminal, as a member of the devices group
devices-snmp 192.0.2.40                      # its name, description and uptime
devices-snmp 192.0.2.40 1.3.6.1.2.1.25.2.3   # its volumes
devices-snmp 192.0.2.40 1.3.6.1.4.1          # what its maker adds
```

Choose a card to see all the listener heard of it: what EiN makes of it, each mDNS service with its
records, each SSDP answer with what the device's own description says, and the raw message, as it came.
For something EiN does not support, it is what there is to go on. **Ignore** leaves one out of the
count and the list; **Show** **Everything** finds it again, with **Take back**. **Open** opens one
that is a device already.

**Show** chooses **Can be added** (the default), **Not a device yet**, or **Everything** the
listener heard, devices included. What the listener has not heard for a day leaves the page, also
when it last heard it before EiN was restarted. The page and the button are for members of the
`devices` group, who make devices; the button stays away for everyone else.

> [!NOTE]
> A Shelly with a password of its own refuses EiN; turn the password off on its web page, or set
> its MQTT there as below. A first-generation Shelly does not use Shelly's cloud while MQTT is on.

The same from the terminal:

```bash
# in EiN's terminal, as a member of the devices group
devices-found                # what can become a device, and is none yet
devices-found --all          # everything the listener heard
devices-found 7c2ebd614055   # one, with all the listener heard of it
devices-adopt a8032ab12345   # add the Shelly with this id, as devices-found says it
devices-adopt 7c2ebd614055   # add the Cast speaker
 devices-adopt ec71db0a1b2c --user admin --password 'the password'   # add the camera; the leading space keeps it out of your history
echo 30 > /dev/kitchen-speaker/volume
echo press > /dev/kitchen-speaker/pause
devices-ignore d0ad08c5e709  # leave the printer out
```

The listener needs the machine EiN runs on to be on the same network as the devices: mDNS, SSDP and
WS-Discovery stay on the network they are sent on. A device on another network, or another VLAN, is not found,
and is connected by hand as below. **Broker for devices** in the **Devices** settings is the
address a device added from the network is given; empty, it is the address the listener says the
machine has on the devices' network. With a broker of your own there is no listener: the page says
so, and devices are connected by hand.

A device is named in EiN as it names itself, in lower case with hyphens, such as `hall-sensor`, and
each of its endpoints by its own name within it, such as `hall-sensor/temperature`. Commands,
routing keys and rules use these names. **Edit** on a device's page gives it and its endpoints
friendlier labels on the pages and leaves the names as they are.

### ESPHome

Add an `mqtt:` block to the device's configuration, with the machine EiN runs on as the broker, and
install the configuration on the device as usual:

```yaml
# hall-sensor.yaml, the device's ESPHome configuration
esphome:
  name: hall-sensor

mqtt:
  broker: 192.0.2.10 # the machine EiN runs on
  username: device
  password: !secret mqtt_password # in secrets.yaml: MQTT_DEVICE_PASSWORD from ~/ein/.env
```

With an `mqtt:` block ESPHome announces each of its entities the way Home Assistant's MQTT discovery
reads them, which is on unless you turn it off. Leave its prefix as it is, `homeassistant`
(**Discovery prefix** in the settings). The device is named by its `name:`, and an endpoint by its
entity's own name: a sensor called Temperature on the device above is `hall-sensor/temperature`.

A light is on or off, and has its brightness and its colour beside it when it has them, each to
be set: `<light>-brightness`, 0–100 % whatever scale the light counts in, and `<light>-color`, as
`#rrggbb`, such as `#ff8000`; `255,128,0` is taken too. A light that takes its colour as hue and
saturation, or as x and y, as many Zigbee lights do, is read and set in them.

```bash
# in EiN's terminal, as a member of the devices group
echo on > /dev/living-room/ceiling
echo 40 > /dev/living-room/ceiling-brightness
echo '#ff8000' > /dev/living-room/ceiling-color
```

Other software that announces devices the same way, such as Zigbee2MQTT, is read as far as it keeps
to what ESPHome sends; `devices-status` names what it could not read.

### Shelly, second generation and later

Shelly's Plus, Pro, Gen3 and Gen4 devices are read by the `shelly` driver.

1. Open the Shelly's own web page, at its address on your network, and go to **Settings → MQTT**.
2. Turn MQTT on. Set the server to the machine EiN runs on with the port, such as
   `192.0.2.10:1883`, the user to `device`, and the password to the device password.
3. Turn on **Generic status update over MQTT** and **RPC status notifications over MQTT**.
4. Save. The Shelly restarts and connects.

The topic prefix may stay as it is, the Shelly's id, such as `shellyplus1pm-a8032ab12345`. It is the
device's name in EiN, so a short one of your own, such as `hall-plug`, makes commands and rules
easier to read. Choose it before the Shelly is first heard: a new prefix is a new device.

Its endpoints are named after its parts: `switch-0` is its first relay, `switch-0-power`,
`switch-0-energy`, `switch-0-voltage` and `switch-0-current` what the relay measures, and `input-0`
its first input. An input set to button mode gives presses, `single`, `double`, `triple` or `long`,
rather than on and off.

A light is `light-0`, or `rgb-0`, `rgbw-0` or `cct-0` for a colour or white-tone one such as the
Plus RGBW PM, and each can be set:

| Endpoint                  | What it is                                                            |
| ------------------------- | --------------------------------------------------------------------- |
| `light-0`                 | On or off                                                             |
| `light-0-brightness`      | Its brightness, 0–100 %                                               |
| `rgb-0-color`             | Its colour, as `#rrggbb`, such as `#ff8000`; `255,128,0` is taken too |
| `rgbw-0-white`            | Its white channel, 0–255                                              |
| `cct-0-color-temperature` | Its white's colour temperature, in K                                  |

A cover, such as a Plus 2PM in cover mode, has `cover-0-position` (0–100 %, set to move it there),
`cover-0-state` (`open`, `closed`, `opening`, `closing` or `stopped`), and `cover-0-open`,
`cover-0-close` and `cover-0-stop` to press:

```bash
# in EiN's terminal
echo 40 > /dev/desk-lamp/rgbw-0-brightness
echo '#ff8000' > /dev/desk-lamp/rgbw-0-color
echo 30 > /dev/kitchen-blind/cover-0-position
echo press > /dev/kitchen-blind/cover-0-stop
```

### Shelly, first generation

The first generation, such as the Plug S, the 1, the 1PM, the 2.5, the i3, the Dimmer, the Bulb,
the Duo and the RGBW2, is read by the `shelly-gen1` driver.

1. Open the Shelly's own web page, at its address on your network, and go to **Internet & Security →
   Advanced – Developer Settings**.
2. Turn MQTT on. Set the server to the machine EiN runs on with the port, such as `192.0.2.10:1883`,
   the user to `device`, and the password to the device password. Leave its custom MQTT prefix off:
   the driver listens under `shellies/`.
3. Save, and restart the Shelly: a first-generation Shelly takes its MQTT settings when it starts.
   With MQTT on it does not use Shelly's cloud.

It is named by its own id, such as `shellyplug-s-c8c9a3`, which cannot be changed; give it a label
with **Rename**. Its endpoints are `relay-0` for its first relay, `relay-0-power` and `relay-0-energy`
(the energy since it last started, in Wh) for what the relay measures, `temperature` for its own, and
`input-0` for a button's presses: `single`, `double`, `triple`, `long`, `single-long` or
`long-single`. A Shelly the bridge has not heard announce itself, because it connected before the
bridge started, is asked to.

A light is `light-0`, and an RGBW2 in white mode has `light-0` to `light-3`, one for each channel. A
light has as many of these as it reports, each of which can be set: `light-0-brightness` (0–100 %),
`light-0-color` (`#rrggbb`), `light-0-white` (an RGBW2's white channel, 0–255) and
`light-0-color-temperature` (in K). A light that has both modes, such as a Color Bulb, turns to
colour mode when set to a colour, and to white when set to a colour temperature; its brightness is
that of the mode it is in. For white light from a Color Bulb, set its colour temperature: it has no
white channel to mix with a colour. `light-0-power` and `light-0-energy` are what a light that
measures it draws, as for a relay. A 2.5 in roller mode has `roller-0-state` (`open`, `close` or `stop`, the way it
last moved), `roller-0-position` (0–100 %, empty until the roller is calibrated), and
`roller-0-open`, `roller-0-close` and `roller-0-stop` to press.

### A web API

The `http` driver asks an address that answers JSON, as often as you say, and keeps the readings you
name in its answer: today's weather, the price of electricity this hour, or a device on your network
that answers on a web API of its own, and can be switched there. Nothing announces such a device; a
member of `devices` makes it in the terminal:

```bash
# in EiN's terminal, as a member of devices
device-create Weather --driver http \
  --config 'url=https://api.open-meteo.com/v1/forecast?latitude=57.7&longitude=11.97&current=temperature_2m,wind_speed_10m' \
  --config 'read=temperature=current.temperature_2m °C; wind=current.wind_speed_10m m/s' \
  --config interval=15m
```

| Config     | What it is                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `url`      | The address to ask. `{date}` (2026-11-09), `{year}`, `{month}`, `{day}` and `{hour}` in it become the day and hour it is asked at, in EiN's time zone. A user and password in it, `http://admin:secret@192.0.2.20/status`, are sent as the device's sign-in. |
| `read`     | The readings, `name=path unit`, separated by `;`. Each becomes an endpoint of that name; the unit may be left out.                                                                                                                                           |
| `interval` | How often it is asked: seconds, or `30s`, `15m`, `1h`. Five minutes unless given, and ten seconds at the least.                                                                                                                                              |
| `set`      | The controls, `name=address on/off`, separated by `;`; see [Switching it](#switching-it). May be left out.                                                                                                                                                   |

A path walks the answer from the top:

| Path                                 | Reads                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `current.temperature_2m`             | a field of a field                                                                             |
| `relay:0.power`                      | a field whose name has a colon in it                                                           |
| `energy['total today']`              | a field whose name has a space in it                                                           |
| `meters[0].power`, `items[-1].value` | the first item of a list, the last                                                             |
| `[time_start..time_end].SEK_per_kWh` | the item of a list whose `time_start` has come and whose `time_end` has not: this hour's price |
| `[from..].price`                     | the last item whose `from` has come, for a list that gives only when each starts               |
| `.`                                  | the whole answer, for an address that answers a number or a word as plain text                 |

A number written as text, `"0.42"`, is kept as a number; a list or an object is not kept. A device
whose answer has none of its readings, or that does not answer, is offline until it does, and the
bridge's log says why once. A reading's unit says what it is: `°C` is a temperature, `W` power and
`kWh` energy, so the device's card shows it first.

Another:

```bash
# the price of electricity this hour, in Swedish price area SE3, from elprisetjustnu.se
device-create Electricity price --driver http \
  --config 'url=https://www.elprisetjustnu.se/api/v1/prices/{year}/{month}-{day}_SE3.json' \
  --config 'read=price=[time_start..time_end].SEK_per_kWh SEK/kWh' --config interval=5m
```

A config `device-create` does not understand is refused with what is wrong, such as `a reading is
name=path [unit], not 'price'`; the device is made all the same, so change its config, on its
**Info** tab or with `device-config`, or forget it and make it again:

```bash
device-config electricity-price 'read=price=[time_start..time_end].SEK_per_kWh SEK/kWh'
```

#### Switching it

A device whose web API also takes commands is switched at an address of its own, which `set` names
for each control: `name=address on/off`. `{value}` in the address becomes the value, spelled as the
device spells on and off, which is what `on/off` says: `ON/OFF`, `on/off`, `1/0` or `true/false`. An
address without `http://` is taken from `url`'s, sign-in included. A control whose name is also a
reading's is a switch that shows that reading as its state, read as on or off however the device
spells them; EiN asks the device again a second after it is switched. A control with no `{value}` and
no `on/off` is a button that asks its address when pressed, such as a restart.

Say a garden pump's controller on your network answers `{"pump": {"running": true, "power": 420}}` at
`/api/status`, runs or stops the pump at `/api/pump?run=1` and `/api/pump?run=0`, and restarts at
`/api/restart`:

```bash
device-create Garden pump --driver http --config 'url=http://admin:secret@192.0.2.40/api/status' \
  --config 'read=pump=pump.running; power=pump.power W' \
  --config 'set=pump=api/pump?run={value} 1/0; restart=api/restart' --config interval=30s
```

`pump` is then a switch, on while the answer says `running` is true, and `restart` a button; both
are asked with the sign-in in `url`.

The address, with a password in it, is the device's config, which every member of `devices` sees.
EiN asks it from the machine it runs on, so an address on your home network is asked from there.

### A camera

The `rtsp` driver takes a camera on your network that sends its picture over RTSP, as most cameras
that work without a cloud do (Reolink, Hikvision, Dahua, Amcrest, Axis, Tapo, …). The camera's
manual, or its own web page, names its stream's address; many send a second, smaller stream beside
the main one, which costs less to watch and to take a picture of. A member of `devices` makes the
camera in the terminal:

```bash
# in EiN's terminal, as a member of devices
 device-create 'Front door' --driver rtsp \
  --config url=rtsp://192.0.2.30:554/h264Preview_01_main \
  --config sub=rtsp://192.0.2.30:554/h264Preview_01_sub \
  --config user=viewer --config password='the password'   # the leading space keeps it out of your history
```

| Config     | What it is                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `url`      | The main stream's address, `rtsp://…`                                                                                             |
| `sub`      | A second, smaller stream's address. May be left out                                                                               |
| `snapshot` | The address of the camera's still picture, `http://…`, which a picture is taken from when there is no restreamer. May be left out |
| `user`     | The camera's account                                                                                                              |
| `password` | That account's password. It is kept in the device's `.secret`, which the administrator alone reads, and goes only to the sidecar  |

A password or an address that changed is given again on the camera's **Info** tab, with **Change**,
or in the terminal, and the camera is reached with it at once:

```bash
device-config front-door password='the new password'
```

The camera becomes a device of class `camera`, with a `stream` endpoint for each stream: `main`, and
`sub` with a second one. EiN gives the streams to the [sidecar's restreamer](#the-installers-sidecar),
which keeps one connection to the camera however many watch it, and says within a minute how large
each picture is and which codec it is sent in. Its page shows a picture of each stream now, taken
again every ten seconds while the page is open, and the **Live** tab plays the picture as it comes:
the main stream, or the smaller one, a button away. The **Devices** page shows a picture of the
smaller stream on the camera's card. Without a restreamer (**Restreamer** empty) nothing is watched
live, so the camera's page has no **Live** tab, and a picture is the camera's still picture, from
its `snapshot` address.

A picture is a file too, a JPEG of the stream now, taken each time it is read:

```bash
# in EiN's terminal
cat /dev/front-door/main > ~/front-door.jpg
```

With the [Archive](../archive/index.md), the media service also watches each camera's smaller
stream for faces: the camera gets a **Faces** log, which says who each face that came into view
was, or `unknown`, within a second or so, as `dev.<camera>.faces` for automations, and the faces'
pictures are filed under the camera in the archive, where they are named as photos' faces are
([Faces a camera sees](../archive/people.md#faces-a-camera-sees)). The media service records the
camera's largest stream as well, and a clip of each visit, from a little before the face until a
little after, is filed beside them as a video ([A security camera](../archive/cameras.md#a-security-camera)).

The camera is **online** while it gives a picture, asked every other minute. Who may see the
pictures is who may read the stream: the household, as for every device
([Who may do what](#who-may-do-what)). EiN's pages reach the camera only through EiN, signed in, so
neither its address nor its password reaches a browser.

### An ONVIF camera

Most cameras that work without a cloud also speak ONVIF, a standard for asking a camera what it
sends, what it sees and how it turns. Such a camera needs no stream address: EiN asks the camera
for it. It is found on the network, where **Add** on its card asks for the account EiN signs in to
it with ([Add a device found on the network](#add-a-device-found-on-the-network)). Many cameras
have ONVIF off, or want an account of its own for it, until it is set on their web page, among the
advanced network settings: on a Hikvision under **Network → Advanced Settings → Integration
Protocol**. A camera on another network is made in the terminal:

```bash
# in EiN's terminal, as a member of devices
 device-create 'Back yard' --driver onvif \
  --config address=192.0.2.31 \
  --config user=admin --config password='the password'   # the leading space keeps it out of your history
```

| Config     | What it is                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `address`  | The camera's address, `192.0.2.31` or `192.0.2.31:8000`, or its ONVIF service's whole address, `http://192.0.2.31/onvif/device_service` |
| `user`     | The camera's account                                                                                                                    |
| `password` | That account's password, kept in the device's `.secret` as `rtsp`'s is. The camera is sent a digest of it, never the password itself    |

The camera's largest picture becomes its `main` stream and its smallest its `sub`, with the codec,
size and frame rate the camera says, and everything else about them is as for [A camera](#a-camera).
EiN asks the camera again every hour, and whenever it is not reached, so a stream the camera moved
is followed. One added from the network is asked at the address the listener last heard it at, so
it is followed to a new address too.

Beside its streams, a camera has what it tells and what it turns:

| Endpoint                                                                     | What it is                                                                                                                   |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `motion`                                                                     | On while the camera sees motion, off when it stops, as the camera itself detects it                                          |
| `person`, `vehicle`, `animal`                                                | On while the camera sees a person, a vehicle or an animal, for a camera that tells them from the rest                        |
| `tamper`                                                                     | On while the camera is covered, turned away or its picture changed all at once                                               |
| `sound`                                                                      | On while the camera hears a sound over the level set on it                                                                   |
| `line-crossing`                                                              | An event, `crossed`, each time something crosses a line drawn on the camera's picture                                        |
| `intrusion`                                                                  | On while something is inside a field drawn on the camera's picture                                                           |
| `storage-failure`                                                            | On while the camera's memory card fails; a diagnostic                                                                        |
| `ptz-preset`                                                                 | One of the positions saved on the camera: setting it turns the camera there. For a camera that turns and has positions saved |
| `ptz-left`, `ptz-right`, `ptz-up`, `ptz-down`, `ptz-zoom-in`, `ptz-zoom-out` | A button each: a press turns or zooms the camera a short step. For a camera that turns, and zooms                            |

A camera has those it lists among its events, and only where it is set to detect them: lines,
fields and the sound level are drawn and set on the camera's own web page. They are readings like
any other, so an [automation](../automation/automations.md) takes them: a person in the back yard at night can
turn on its light, or turn the camera to the gate, and a line crossed at the gate can ring the
hall.

```bash
# in EiN's terminal
echo Gate > /dev/back-yard/ptz-preset    # turn to the position saved as Gate
echo press > /dev/back-yard/ptz-left     # a step to the left
```

### Check that EiN hears them

```bash
# in EiN's terminal
devices-status
```

| What it says                                 | What it means                                                                                                                                                                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `5 devices, 31 endpoints, 18420 messages`    | The bridge is connected: the devices its drivers drive, their endpoints, and the messages it has had since it started.                                                                      |
| `drivers: ha-discovery, shelly, shelly-gen1` | The drivers it runs, as **Device sources** names them.                                                                                                                                      |
| `not read: <device>/<endpoint>: <why>`       | An endpoint whose values the bridge cannot read, such as one announced with a template it does not understand. Nothing of it is kept.                                                       |
| `…; no broker set, so only …`                | **MQTT broker** is empty: the devices EiN asks over the network are read, and none on a broker. [Install the broker](#install-it) or [give EiN yours](#a-broker-you-already-run) for those. |
| `cannot reach mqtt://…: <why>`               | The broker does not answer, or refuses EiN's account. The bridge tries again by itself, waiting a second, then twice as long each time, up to a minute.                                     |
| `not running`                                | The `devices-bridge` service is stopped: `service start devices-bridge`, as the administrator.                                                                                              |

The Status page says the same: its `devices bridge` check is fine while the bridge is connected, or runs without a broker,
a warning while it cannot reach the broker, and failed while its service is stopped
([Health and status](../admin/monitoring.md#read-the-checks)). Its `devices sidecar` check fails
when the installer's sidecar is a version the module does not speak, such as `the devices sidecar
reports no version, older than the ^0.1.0 this module needs: update the sidecar`, which `./setup.sh --only
devices` does ([Updating](../admin/updating.md#the-media-service-and-the-sidecar-follow-their-modules)).
`devices --drivers` lists the drivers with their devices while the bridge runs.

## What a device becomes

Each thing a device announces becomes an endpoint of the device under `/dev`:

| The device announces                                     | Endpoint                      | Takes                                |
| -------------------------------------------------------- | ----------------------------- | ------------------------------------ |
| A reading: a temperature, power, humidity, a word        | a log                         |                                      |
| Something on or off it only reads: a door, motion, input | a log                         |                                      |
| A button                                                 | a log of events, its presses  |                                      |
| A switch, a relay, a light                               | a control, on or off          | `on`, `off` or `toggle`              |
| A number it takes, such as a thermostat's target         | a control, a number           | a number within its limits and steps |
| A choice it takes, such as a mode                        | a control, one of its options | one of its options                   |
| Something it does when asked, such as a restart          | a control, pressed            | `press`                              |

The device's class comes from the endpoint that says the most of what it is, whichever is heard
first: what it switches says the most (`plug` for an outlet, `light`), then what it senses or a
button (`sensor`, `button`), and a bare relay least (`switch`); its power, energy, voltage or current
says nothing. A class the device has is replaced only by one that says more, and one that is none of
these, such as `heater` set by a person, stays. What tells of the device itself, such as its own temperature
or its Wi-Fi signal, is marked `diagnostic` and kept apart on its page. An endpoint the device no
longer announces is marked retired, and its history stays. [Devices](../guide/devices.md#a-devices-page)
shows how the page draws each.

## Switch things

The toggles on a device's **Overview** switch it, and so does writing to the control in the
terminal:

```bash
# in EiN's terminal
echo on > /dev/hall-plug/switch-0
echo toggle > /dev/hall-plug/switch-0
echo 21 > /dev/heater/target
```

The command goes to the device through the broker at once, and the switch shows the new state once
the device reports it. When the bridge is not connected, the write is refused with
`hall-plug/switch-0: not connected to the broker, so nothing was sent`, and while its service is
stopped with `hall-plug's driver shelly is not running`: a command is never kept for later, since a
lamp switched on an hour after it was asked would surprise.
[Switch something](../guide/devices.md#switch-something) has the rest.

## Play on a speaker or a screen

Write the paths of what to play to the `show` of a speaker or screen of the `cast` or `dlna` driver,
one per line, and it plays them in order: recordings, videos and pictures, and on the last line a
page of EiN. `show` then says the line it is on.

```bash
# in EiN's terminal
echo /archive/music/Wrenfield-choir/evening-song.mp3 > /dev/kitchen-speaker/show
find /archive/music/Wrenfield-choir -name '*.flac' | sort > /dev/kitchen-speaker/show
find /archive/albums/Summer-2025 -type f | sort > /dev/living-room-tv/show
echo /dashboard-wall/Kitchen > /dev/living-room-tv/show
echo 90 > /dev/living-room-tv/seek
echo press > /dev/living-room-tv/stop
```

| A line names                                                                                                         | What the speaker or screen is given                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A recording                                                                                                          | Its playback copy (AAC) when one was made, else the original.                                                                                                                                                                      |
| A video                                                                                                              | What its `video` setting says (below). By default an original that is H.264, up to 1080p, in MP4 or MOV goes as it is, and any other video as H.264 the [media service](../ems/index.md) makes while it plays.                     |
| A picture                                                                                                            | Its largest picture copy (AVIF), else the original when it is a JPEG, PNG, AVIF, WebP or GIF. It shows for 10 seconds (its `picture` setting) before the next; the last one stays until it is stopped.                             |
| Any other path, such as `/dashboard-wall/Kitchen` or `/slideshow?under=/archive/albums/Summer-2025&slideshow=screen` | That page of EiN as you see it, with its sound, which the media service renders into live video, a few seconds behind ([On a TV](../dashboard/screens.md#on-a-tv)). It plays until it is stopped, so it can only be the last line. |

`find … -type f` lists the copies EiN made under each file too; they are left out when the list
names the files themselves. A path is written from `/`, and a path under one of EiN's folders that
is not there, or a file of another kind, is refused. Writing again plays the new list in place of
the old.

A video the media service makes while it plays starts within about 10 seconds, and the screen's own
timeline works: seeking with its remote, from a phone or with `seek` plays again within a few
seconds. A screen of the `dlna` driver, or a video whose length EiN does not know, is given one
stream instead, which cannot be sought in. Each video being made holds one of the media service's
encoders, two at once unless the administrator allows more (`EMS_STREAMS`).

Without the media service, or while it does not answer, a speaker or screen is still given
recordings, pictures, and a video it plays as it is, as its `video` setting says; EiN asks the
media service each time a list is written, so it is used again as soon as it answers. A video that
would have to be made is refused, as in `/archive/films/sea.mov: a device is given it as H.264 by the
media service, which is not there; set video=original for a device that plays the original`, and a
page with `/dashboard-wall/Kitchen: no such file, and pages are rendered by the media service, which
is not there`.

Each screen has two settings, set with `device-config`:

| Setting   | What it does                                                                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `video`   | `h264`, the default, as above; `av1` gives EiN's own copy of a video (AV1, up to 1080p) for a screen that plays AV1, such as a recent Google TV; `original` gives the original, for a screen that plays it. |
| `picture` | How many seconds a picture shows before the next, 10 unless set.                                                                                                                                            |

```bash
# in EiN's terminal, as a member of the devices group
device-config living-room-tv video=av1 picture=8
```

The speaker or screen fetches each thing from EiN itself, in the media player every Cast device has,
or in its DLNA renderer. A Cast device refuses an original it cannot play when it comes to it. A DLNA
renderer says which formats it plays, so it is given what it plays, and a list with something it
plays none of is refused at once, as in `/archive/music/a.flac: it plays none of audio/mp4,
audio/flac`. It fetches a file with a link for that one file, made as you and good only while it
plays, and a video or page made for it at an address of its own, so only what you may read is
played.

A TV that has both Cast and a DLNA renderer is one device. EiN plays on it over Cast, and over its
renderer when Cast does not answer, and then asks and tells it over the one it played on until the
list is done. A DLNA renderer plays one thing at a time, so EiN gives it the next as the one before
ends. On many TVs the renderer has to be switched on in the TV's own settings first, under a name
such as **DLNA**, **DMR** or **Media sharing**.

### From the app

**Show on…** gives what is open to a speaker or screen, without the terminal. It is there when you
have one whose `show` you may write to and whose driver runs, so none while the `devices-bridge`
service is stopped (`devices --endpoint show` lists them in the terminal):

| Where                                                | What the speaker or screen is given                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| The [viewer](../archive/viewer.md#the-more-menu)'s ⋮ | The file shown, such as `/archive/music/Wrenfield-choir/evening-song.mp3`.                                                       |
| An album's **⋮**                                     | The album's slideshow for a screen, narrowed and ordered as the album is: `/slideshow?under=/archive/albums/…&slideshow=screen`. |
| The **Media** page's **⋮**                           | The slideshow of what is found: `/slideshow?q=sailboat&slideshow=screen`.                                                        |
| A [dashboard](../dashboard/index.md)'s **⋮**         | Its wall: `/dashboard-wall/Kitchen`.                                                                                             |

It lists the speakers and screens. One that does not answer is greyed and marked **offline**, and
cannot be chosen until it answers again. Choose one to give it what is open, and a note at the foot
of the screen says what it answered, such as **Kitchen speaker: playing evening-song**, or why it
refused. The square beside each stops what it plays.

A TV where your phone is, which EiN does not reach itself, has a button of its own, the cast icon
**Show on a screen near you**, beside **Share** and **Edit**, and in the viewer under the picture
or, on a phone, in its top right corner ([On a TV where your phone is](../dashboard/screens.md#on-a-tv-where-your-phone-is)).

`player` and `playing` say what it plays, `pause`, `play` and `stop` act on it, and a number of
seconds written to `seek` goes there. A Cast speaker or screen that lets go of the list on its own
while it plays, as some do after a while, is given it again from where it was; one that lets go
again within five minutes, as when someone stops it from their phone, is left. A DLNA renderer
stopped before a recording ends is left. When the list is done, stopped or taken over, what was made
for it stops.

The speaker reaches EiN at **EiN's address for speakers and screens** in the **Devices**
settings, plain HTTP on the speaker's network, such as `http://192.0.2.10:8080`. Empty, it is the
address the [listener](#add-a-device-found-on-the-network) says the machine has, on port 8080: set it
when the installer publishes EiN on another port (`EIN_HTTP_PORT`), or when there is no listener,
where a write is refused with `EiN does not know its address on the network to give it: set
CFG_DEVICES_MEDIA_URL`.

## On a dashboard

With the [Dashboards](../dashboard/index.md) module, Devices offers two cards beside the
dashboard's own **Device** and **Reading**:

- **Camera**: a camera's picture filling the card, a new one every 10 seconds (**Seconds between
  pictures**), with the camera's name and the time the picture is from at its foot. Tap it to watch
  it live, as on the **Live** tab, for five minutes; tap again to go back to pictures. **Always
  live** plays it live all the time. **Stream** picks the smaller of its streams, which costs
  less to send, and **Picture** whether it fills the card or shows all of it. A camera that cannot
  be played live (no restreamer, or a codec the browser does not play) shows its pictures, and says
  why at the top.
- **Button**: one large button for a device's control, lit while the control is what the button
  sets. Without **Sets it to**, it presses a button, such as a [virtual device](../automation/virtual-devices.md)'s
  `momentary` control an automation starts on, and switches something on and off to the other.
  With it, it sets the control to that value, such as `eco` for a mode or `21` for a heater, as a
  scene button does. **Ask first** makes the first press only ask for a second, for a door or a
  gate. **Icon** takes a [Tabler icon](https://tabler.io/icons)'s name, such as `bell` or `garage`.

Who may press a button is who may write its control
([Who may do what](#who-may-do-what)). On a screen opened from a
[display link](../dashboard/screens.md), which changes nothing, a button shows its state and does
nothing when pressed, and a camera shows its pictures if the screen's account may read the camera.

## Readings on the bus

Every reading, press and change of state is kept in its endpoint and published on the routing key
`dev.<device>.<endpoint>`, and a device coming or going on `dev.<device>`, where the
[Automation](../automation/index.md) module's engine reads them and a queue or a log the
administrator binds can take them:

```bash
# in EiN's terminal, as the administrator
mkqueue -k 'dev.porch-button.#' ~/presses
mklog -k 'dev.*.temperature' -r '90 day' ~/temperatures
```

A number is kept and published at most once every 10 seconds for each endpoint (**Seconds between
readings**); [Readings on the bus](../concepts/devices.md#readings-on-the-bus) shows the messages,
and [How often a reading is kept](../concepts/devices.md#how-often-a-reading-is-kept) the rest.

## Who may do what

| Who                               | What they may do                                                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Members of the `devices` group    | See every device, its readings and its history; switch and set devices; share, rename and forget them                                        |
| Someone a device is shared with   | See that device, and switch it when it is shared to edit                                                                                     |
| Members of the `automation` group | With the [Automation](../automation/index.md) module, also make [automations](../automation/automations.md), which act with their own rights |
| The administrator                 | Everything: add people to either group, and bind queues and logs to the devices' keys                                                        |

The devices the drivers find belong to the administrator and the `devices` group, and nobody else
reads them, a door or motion sensor included, until a member shares one.
[Devices and their keys](../admin/devices.md) shows how to share a device and keep a switch to some
people.

## Ask the assistant

With the [Assistant](../assistant/index.md) installed, the chat reads the devices: ask "how warm is
it in the hall?", "which devices are offline?" or "how much did the heater draw yesterday?", and it
answers at once, with a chart of a reading's history when you ask how it went. Asking it to switch
something, "turn on the hall lamp", gives a
[proposal card](../assistant/chat.md#when-the-assistant-offers-to-make-a-change) with the `echo`
line, which you run or decline.

It finds what is on the network too: ask "is the new plug found?", and it answers with what
`devices-found` says. Asking it to add one, "add the kitchen speaker", gives a proposal card with
the `devices-adopt` line, and so does asking it to read a web API as a device, with the
`device-create` line ([A web API](#a-web-api)). With the [Automation](../automation/index.md)
module, it also makes automations ([Ask the assistant](../automation/index.md#ask-the-assistant)).

## From the terminal

The devices' own commands, `devices`, `device-show`, `device-history`, `device-label` and
`device-forget`, are EiN's; [Devices](../guide/devices.md#from-the-terminal) lists them. The module
adds:

```bash
# in EiN's terminal
devices-status                     # the broker, the drivers and the devices they drive
devices-status --streams           # whether the restreamer answers, and how many streams it has
devices-found                      # what is on the network and not a device yet
devices-snmp 192.0.2.40            # what a NAS answers over SNMP
```

[Devices commands](commands.md) lists every option.

## Settings

The module's settings are in the **Devices** group of **Settings → System**, and each restarts
`devices-bridge` when saved:

| Setting                        | On the Settings page                 | Default                           | What it does                                                                                                                                                                                                  |
| ------------------------------ | ------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CFG_DEVICES_MQTT_URL`         | **MQTT broker**                      | empty; `--devices` sets it        | The broker, as `mqtt://host:1883` or `mqtts://host:8883`. Empty, only the devices EiN asks over the network are read                                                                                          |
| `CFG_DEVICES_MQTT_USER`        | **MQTT user**                        | empty; `--devices` sets `ein`     | The account EiN signs in to the broker with. Empty, it signs in without one                                                                                                                                   |
| `CFG_DEVICES_MQTT_KEY`         | **MQTT password**                    | none; `--devices` sets it         | That account's password, a key nobody can read back                                                                                                                                                           |
| `CFG_DEVICES_STREAMS_URL`      | **Restreamer**                       | empty; `--devices` sets it        | The restreamer cameras are given to, go2rtc's API as `http://host:1984`. Empty, a camera has no live view, and its picture is asked of the camera itself                                                      |
| `CFG_DEVICES_STREAMS_KEY`      | **Restreamer password**              | none; `--devices` sets it         | The password of the restreamer's account `ein`, a key nobody can read back                                                                                                                                    |
| `CFG_DEVICES_STREAMS_RTSP`     | **Restreamer for the media service** | empty; `--devices` sets it        | The restreamer's RTSP as the media service reaches it, `rtsp://host:8554`. Empty, no camera is watched for faces                                                                                              |
| `CFG_DEVICES_SOURCES`          | **Device sources**                   | `ha-discovery shelly shelly-gen1` | Which drivers the bridge runs, separated by spaces: `ha-discovery` for ESPHome and whatever announces itself as it does, `shelly` for Shelly's second generation and later, and `shelly-gen1` for the first   |
| `CFG_DEVICES_DISCOVERY_PREFIX` | **Discovery prefix**                 | `homeassistant`                   | The topic `ha-discovery` devices announce themselves under                                                                                                                                                    |
| `CFG_DEVICES_HISTORY`          | **Reading history**                  | `365 day`                         | How long an endpoint's values are kept: `30 day`, `90 day`, `365 day` or `forever`. It applies to endpoints found from then on; one found before keeps its own, which `attrs` on the endpoint changes (below) |
| `CFG_DEVICES_MIN_INTERVAL`     | **Seconds between readings**         | `10`                              | The shortest time between two kept readings of one number, given to endpoints found from then on as their `minInterval`, which may be changed on each                                                         |

An endpoint found before keeps its retention, and each endpoint can take its own interval, which
counts within a minute:

```bash
# in EiN's terminal, as the administrator
attrs -s 'retention=90 day' /dev/hall-sensor/temperature
attrs -J minInterval=60 /dev/heater-plug/switch-0-power
```

## When something goes differently

| What you see                                                | What it means                                                                | What to do                                                                                                                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No devices yet** on the Devices page                      | No device has announced itself, or EiN does not hear the broker              | Run `devices-status`, and check the device's own broker settings                                                                                                                         |
| A device never shows up, while others do                    | It cannot reach the broker, or the broker refuses its account                | Check its server, user and password. ESPHome's log says whether MQTT connected. Open port 1883 in the machine's firewall ([network](../admin/network.md#open-the-ports-in-the-firewall)) |
| A Shelly shows up without readings                          | Its status updates are off                                                   | On a second-generation Shelly, turn on **Generic status update over MQTT** and **RPC status notifications over MQTT**                                                                    |
| A first-generation Shelly never shows up                    | It has not restarted since MQTT was turned on, or uses a custom prefix       | Restart it, and turn its custom MQTT prefix off                                                                                                                                          |
| A Shelly is there twice, under two names                    | Its topic prefix changed, and a new prefix is a new device                   | **Forget** the old one                                                                                                                                                                   |
| An endpoint is marked **not read**                          | The device announced it in a way the bridge does not understand              | `devices-status` says why. Its readings are not kept                                                                                                                                     |
| `… takes on, off or toggle, not …` when switching           | The value is not one the control takes                                       | See [What a device becomes](#what-a-device-becomes)                                                                                                                                      |
| `… not connected to the broker, so nothing was sent`        | EiN does not hear the broker just now                                        | Run `devices-status`                                                                                                                                                                     |
| `<device>'s driver shelly is not running`                   | The `devices-bridge` service is stopped                                      | `service start devices-bridge`, as the administrator                                                                                                                                     |
| `Access denied for operation 'w' on node: …` when switching | The control is narrowed to others                                            | Ask the administrator                                                                                                                                                                    |
| A device stays **offline**                                  | It said it was going, or the broker said so for it when it disappeared       | Check its power and its Wi-Fi                                                                                                                                                            |
| A camera shows **No picture**, and stays offline            | The restreamer cannot reach the camera, or the camera refuses it             | Check `url`, `user` and the password, and change them on its **Info** tab or with `device-config`. `service logs devices-bridge` says what the camera answered                           |
| Adding a camera says `the camera refused admin's password`  | The account is not the camera's ONVIF account, or ONVIF is off on the camera | Turn ONVIF on in the camera's web page and give it an account there; some cameras keep ONVIF's accounts apart from the web page's                                                        |
| A camera is not found on the network                        | ONVIF is off on the camera, or it is on another network                      | Turn ONVIF on in its web page, or make it in the terminal ([An ONVIF camera](#an-onvif-camera))                                                                                          |
| A camera's page has no **Live** tab                         | No restreamer is set, or `devices-bridge` is stopped                         | Set the **Restreamer** ([The installer's sidecar](#the-installers-sidecar)), or `service start devices-bridge`                                                                           |
| `… which is not there` when showing a video or a page       | The [media service](../ems/index.md) is not installed, or does not answer    | Set `video=original` for a screen that plays the original, or see [Check that it is running](../ems/index.md#check-that-it-is-running)                                                   |
| A screen is greyed in **Show on…**                          | It does not answer: it is off, or off the network                            | Turn it on; it can be chosen once EiN hears it again                                                                                                                                     |
| The **Live** tab says the stream could not be reached       | As above, or the sidecar is not running                                      | `podman compose ps` on the machine; `./setup.sh --only devices` starts it again                                                                                                          |
| **Live** plays nothing in a browser on a phone              | The browser does not play the camera's codec, often H.265                    | Watch the smaller stream, which is often H.264, or set the camera to send H.264                                                                                                          |

## Related pages

- [Devices](../guide/devices.md): the device pages, switching and history.
- [Devices, endpoints and drivers](../concepts/devices.md): endpoints, controls and the routing keys.
- [Automation](../automation/index.md): rules that switch the devices and run commands by themselves.
- [Virtual devices](../automation/virtual-devices.md): readings worked out from other devices', and switches with no hardware behind them.
- [Devices and their keys](../admin/devices.md): who may do what with the devices.
