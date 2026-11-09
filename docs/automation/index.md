# Automation

The Automation module brings the devices in the house that talk MQTT into EiN: sensors, plugs,
switches, lights and buttons, such as those running ESPHome and Shelly's. It adds drivers that hear
them on an MQTT broker and make each one a device under `/dev`, with its readings, presses and
switches, and [rules](rules.md) that switch things when a reading, a press or the clock says so.
The devices, their pages and their commands are EiN's own, the same for a plug as for a phone:
[Devices](../guide/devices.md).

This page is for the administrator who installs the module and connects the devices, and for the
household that uses them. [Rules](rules.md) covers writing rules.

## What it adds

| Part                                                        | What it is                                                                                                                                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The `ha-discovery` driver                                   | Anything that announces itself over MQTT the way Home Assistant reads it: ESPHome, and Zigbee2MQTT as far as it keeps to that                                           |
| The `shelly` driver                                         | Shelly's second generation and later: Plus, Pro, Gen3 and Gen4                                                                                                          |
| The `shelly-gen1` driver                                    | Shelly's first generation: Plug S, 1, 1PM, 2.5, i3                                                                                                                      |
| The `ipp` driver                                            | A network printer, asked over IPP: its state, its warnings and how much of each ink or toner is left                                                                    |
| The `cast` driver                                           | A Google Cast speaker or screen: what it plays, its volume and mute, play, pause and stop                                                                               |
| The `snmp` driver                                           | A NAS, a router or anything else that answers SNMP: its uptime, load, memory, each volume's use and its temperatures                                                    |
| The `network` driver                                        | Anything else on the network: whether it answers, and how fast                                                                                                          |
| The `automation-bridge` service                             | Hears the broker and runs the drivers                                                                                                                                   |
| The `automation-rules` service                              | Runs the [rules](rules.md) under `/etc/automation/rules`                                                                                                                |
| The group `automation`                                      | Its members write the rules                                                                                                                                             |
| `automation-status`, `automation-rule-check`                | Whether the broker is heard, and what a rule does                                                                                                                       |
| **Found on the network**                                    | The devices on the network that are not devices yet, with a button on the **Devices** page; see [Add a device found on the network](#add-a-device-found-on-the-network) |
| `automation-found`, `automation-adopt`, `automation-ignore` | What is on the network and all it said, adding it as a device, and leaving something out                                                                                |

With the [Assistant](../assistant/index.md), it also teaches the chat to read the devices and to
propose switching them.

## What it needs

- **An MQTT broker**, the server the devices and EiN exchange their messages through. The
  installer runs one beside EiN with `--mqtt`; a broker you already run works as well.
- **Devices that speak MQTT**: those running ESPHome, and Shelly's of every generation. Printers,
  Google Cast speakers and anything else on the network are asked directly, once added.
- Nothing else: neither the Archive nor the media service.

## Install it

With the installer's broker, add the broker and the module in one run:

```bash
# on the machine EiN runs on, in ~/ein
./setup.sh --mqtt --module automation
```

On a new machine the installer takes the same options:
`curl -fsSL https://einhq.eu/install.sh | bash -s -- --mqtt --module automation`. With a broker of
your own, install the module alone, from **Settings → Modules** or in EiN's terminal, and then give
it the broker ([A broker you already run](#a-broker-you-already-run)):

```bash
# in EiN's terminal, as the administrator
mod install automation
```

The module runs two services: `automation-bridge`, which hears the broker and drives the devices,
and `automation-rules`, which runs the rules. When `automation-rules` first starts it makes the group
`automation`, whose members write the rules. [Modules](../admin/modules.md) covers installing and
removing modules.

### The installer's broker

`--mqtt` runs Mosquitto in a container of its own, `mqtt`, beside EiN:

- It takes no anonymous clients. EiN signs in as `ein` and the devices as `device`, with passwords
  `setup.sh` made at the install and keeps in `~/ein/.env`: `MQTT_EIN_PASSWORD` and
  `MQTT_DEVICE_PASSWORD`. A password changed there takes effect at the next `./setup.sh`.
- The devices reach it on port 1883 of the machine (`MQTT_PORT` in `.env`), on the address
  `EIN_BIND` names.
- `setup.sh` gives EiN the broker's address, user and password itself, and the `device` account a
  device added from the network is given: those settings say **From deployment** on the Settings
  page and need nothing from you.
- It keeps what the devices announce in the data folder's `mqtt` folder, so it is all there again
  after a restart.
- Beside it runs `discovery`, a small listener on the machine's own network, which finds the
  devices that are not on the broker yet:
  [Add a device found on the network](#add-a-device-found-on-the-network).
- `./setup.sh --no-mqtt` takes it out again, and `./setup.sh --only mqtt` updates it alone.

The devices need the device password. Read it on the machine:

```bash
# on the machine EiN runs on, in ~/ein
grep MQTT_DEVICE_PASSWORD .env
```

> [!WARNING]
> The broker speaks plain MQTT, without TLS. Whoever reaches port 1883 with the device password can
> switch the house's devices and read what they say. Keep the port on your home network and never
> forward it on your router; [Ports, HTTPS and remote access](../admin/network.md#what-ein-listens-on)
> lists it with EiN's other ports.

### A broker you already run

Give EiN the broker's address and an account on it, under **Settings → System** in the
**Automation** group, or with `config set`:

```bash
# in EiN's terminal, as the administrator
config set CFG_AUTOMATION_MQTT_URL mqtt://192.0.2.20:1883
config set CFG_AUTOMATION_MQTT_USER ein
 config set CFG_AUTOMATION_MQTT_KEY 'the password'   # the leading space keeps it out of your history
```

**MQTT broker** takes `mqtt://host:1883`, or `mqtts://host:8883` for a broker that takes TLS.
**MQTT password** is a key: nobody can read it back, and EiN sends it only to that broker
([Give a key to another service](../admin/configuration.md#give-a-key-to-another-service)). Saving
any of the three restarts `automation-bridge`. While **MQTT broker** is empty, automation is off: no
device is heard.

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
and hears what announces itself over mDNS in between. It does not scan addresses: it hears only what
announces itself. Each thing that answered is named
by what it said, such as a Shelly Plus 1PM, an ESPHome board, a HomeKit or Matter accessory, a Hue
bridge, a speaker, a TV or a printer, and is matched to the devices EiN has already, by its name and
its hardware address.

When something found can become a device and is none yet, the **Devices** page's header has a
button that says how many, such as **2 found**. It opens **Found on the network**, a card for each,
and **Add** on a card makes it a device:

| What was found                                | What **Add** does                                                                                                                                                                                                                                                                                                |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A Shelly, of any generation                   | EiN sets its MQTT to the broker, with the `device` account, and restarts it. It is under **Devices** when it is back, within a minute, with all it reads and switches.                                                                                                                                           |
| A printer                                     | A device of the `ipp` driver at once: its `state` (idle, printing, stopped), its `warnings` (such as `marker-supply-low-warning`) and a level in % for each ink or toner it reports.                                                                                                                             |
| A Google Cast speaker or screen               | A device of the `cast` driver: `player` says whether it plays (`idle`, `playing`, `paused`) and `playing` what, as title – artist (app); `volume` and `muted` can be set, and `play`, `pause` and `stop` pressed.                                                                                                |
| Anything that answers SNMP: a NAS, a router … | A device of the `snmp` driver: `uptime`, `load`, `memory-used`, for each volume `<volume>-used` (%) and `<volume>-free` (GB), and a `<sensor>-temperature` for each temperature its agent reports. EiN asks with the community **SNMP community** in the **Automation** settings, `public` unless you change it. |
| Anything else: a NAS without SNMP, a TV …     | A device of the `network` driver, online while it answers, with its `response-time`. EiN does not speak its own protocol yet.                                                                                                                                                                                    |
| ESPHome or Tasmota                            | No **Add**: the line under it says how to point it at the broker, and the sections below say more.                                                                                                                                                                                                               |

A device added from the network follows it to a new address: EiN knows it by its hardware address.
A printer is asked every two minutes, a Cast device every 15 seconds and the rest every minute.

SNMP is often off on a NAS or a router until it is turned on in its own settings, usually read-only
with the community `public`; a NETGEAR ReadyNAS has it under **System → SNMP**. One added before
SNMP was on is a `network` device: forget it and add it again. To see what a device's agent answers
beyond what the driver reads, walk it:

```bash
# in EiN's terminal, as a member of the devices group
automation-snmp 192.0.2.40                      # its name, description and uptime
automation-snmp 192.0.2.40 1.3.6.1.2.1.25.2.3   # its volumes
automation-snmp 192.0.2.40 1.3.6.1.4.1          # what its maker adds
```

Choose a card to see all the listener heard of it: what EiN makes of it, each mDNS service with its
records, each SSDP answer with what the device's own description says, and the raw message, as it came.
For something EiN does not support, it is what there is to go on. **Ignore** leaves one out of the
count and the list; **Show** **Everything** finds it again, with **Take back**. **Open** opens one
that is a device already.

**Show** chooses **Can be added** (the default), **Not a device yet**, or **Everything** the
listener heard, devices included. The page and the button are for members of the
`devices` group, who make devices; the button stays away for everyone else.

> [!NOTE]
> A Shelly with a password of its own refuses EiN; turn the password off on its web page, or set
> its MQTT there as below. A first-generation Shelly does not use Shelly's cloud while MQTT is on.

The same from the terminal:

```bash
# in EiN's terminal, as a member of the devices group
automation-found                # what can become a device, and is none yet
automation-found --all          # everything the listener heard
automation-found 7c2ebd614055   # one, with all the listener heard of it
automation-adopt a8032ab12345   # add the Shelly with this id, as automation-found says it
automation-adopt 7c2ebd614055   # add the Cast speaker
echo 30 > /dev/kitchen-speaker/volume
echo press > /dev/kitchen-speaker/pause
automation-ignore d0ad08c5e709  # leave the printer out
```

The listener needs the machine EiN runs on to be on the same network as the devices: mDNS and SSDP
stay on the network they are sent on. A device on another network, or another VLAN, is not found,
and is connected by hand as below. **Broker for devices** in the **Automation** settings is the
address a device added from the network is given; empty, it is the address the listener says the
machine has on the devices' network. With a broker of your own there is no listener: the page says
so, and devices are connected by hand.

A device is named in EiN as it names itself, in lower case with hyphens, such as `hall-sensor`, and
each of its endpoints by its own name within it, such as `hall-sensor/temperature`. Commands,
routing keys and rules use these names. **Rename** on a device's **Info** tab gives it a friendlier
label on the pages and leaves the names as they are.

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

Other software that announces devices the same way, such as Zigbee2MQTT, is read as far as it keeps
to what ESPHome sends; `automation-status` names what it could not read.

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

### Shelly, first generation

The first generation, such as the Plug S, the 1, the 1PM, the 2.5 and the i3, is read by the
`shelly-gen1` driver.

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

### Check that EiN hears them

```bash
# in EiN's terminal
automation-status
```

| What it says                                 | What it means                                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `5 devices, 31 endpoints, 18420 messages`    | The bridge is connected: the devices its drivers drive, their endpoints, and the messages it has had since it started.                                  |
| `drivers: ha-discovery, shelly, shelly-gen1` | The drivers it runs, as **Device sources** names them.                                                                                                  |
| `not read: <device>/<endpoint>: <why>`       | An endpoint whose values the bridge cannot read, such as one announced with a template it does not understand. Nothing of it is kept.                   |
| `rules: 3, 41 runs`                          | The rules service runs, with its rules and how often they ran; see [Rules](rules.md).                                                                   |
| `off: no broker set`                         | **MQTT broker** is empty: [install the broker](#install-it) or [give EiN yours](#a-broker-you-already-run).                                             |
| `cannot reach mqtt://…: <why>`               | The broker does not answer, or refuses EiN's account. The bridge tries again by itself, waiting a second, then twice as long each time, up to a minute. |
| `not running`                                | The `automation-bridge` service is stopped: `service start automation-bridge`, as the administrator.                                                    |

The dashboard says the same: its `automation bridge` check is fine while the bridge is connected,
a warning while it cannot reach the broker, and failed while its service is stopped
([Health and the dashboard](../admin/monitoring.md#read-the-checks)). `devices --drivers` lists the
three drivers with their devices while the bridge runs.

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

## Readings on the bus

Every reading, press and change of state is kept in its endpoint and published on the routing key
`dev.<device>.<endpoint>`, and a device coming or going on `dev.<device>`, where the rules service
reads them and a queue or a log the administrator binds can take them:

```bash
# in EiN's terminal, as the administrator
mkqueue -k 'dev.porch-button.#' ~/presses
mklog -k 'dev.*.temperature' -r '90 day' ~/temperatures
```

A number is kept and published at most once every 10 seconds for each endpoint (**Seconds between
readings**); [Readings on the bus](../concepts/devices.md#readings-on-the-bus) shows the messages,
and [How often a reading is kept](../concepts/devices.md#how-often-a-reading-is-kept) the rest.

## Who may do what

| Who                               | What they may do                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Members of the `devices` group    | See every device, its readings and its history; switch and set devices; share, rename and forget them |
| Someone a device is shared with   | See that device, and switch it when it is shared to edit                                              |
| Members of the `automation` group | Also write [rules](rules.md), which switch with their own rights                                      |
| The administrator                 | Everything: add people to either group, and bind queues and logs to the devices' keys                 |

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

## From the terminal

The devices' own commands, `devices`, `device-show`, `device-history`, `device-label` and
`device-forget`, are EiN's; [Devices](../guide/devices.md#from-the-terminal) lists them. The module
adds:

```bash
# in EiN's terminal
automation-status                     # the broker, the drivers, the devices they drive, and the rules
automation-rule-check porch-light     # what a rule does, and whether it would run now
```

[Automation commands](commands.md) lists every option.

## Settings

The module's settings are in the **Automation** group of **Settings → System**, and each restarts
`automation-bridge` when saved:

| Setting                           | On the Settings page         | Default                           | What it does                                                                                                                                                                                                  |
| --------------------------------- | ---------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CFG_AUTOMATION_MQTT_URL`         | **MQTT broker**              | empty; `--mqtt` sets it           | The broker, as `mqtt://host:1883` or `mqtts://host:8883`. Empty, automation is off                                                                                                                            |
| `CFG_AUTOMATION_MQTT_USER`        | **MQTT user**                | empty; `--mqtt` sets `ein`        | The account EiN signs in to the broker with. Empty, it signs in without one                                                                                                                                   |
| `CFG_AUTOMATION_MQTT_KEY`         | **MQTT password**            | none; `--mqtt` sets it            | That account's password, a key nobody can read back                                                                                                                                                           |
| `CFG_AUTOMATION_SOURCES`          | **Device sources**           | `ha-discovery shelly shelly-gen1` | Which drivers the bridge runs, separated by spaces: `ha-discovery` for ESPHome and whatever announces itself as it does, `shelly` for Shelly's second generation and later, and `shelly-gen1` for the first   |
| `CFG_AUTOMATION_DISCOVERY_PREFIX` | **Discovery prefix**         | `homeassistant`                   | The topic `ha-discovery` devices announce themselves under                                                                                                                                                    |
| `CFG_AUTOMATION_HISTORY`          | **Reading history**          | `365 day`                         | How long an endpoint's values are kept: `30 day`, `90 day`, `365 day` or `forever`. It applies to endpoints found from then on; one found before keeps its own, which `attrs` on the endpoint changes (below) |
| `CFG_AUTOMATION_MIN_INTERVAL`     | **Seconds between readings** | `10`                              | The shortest time between two kept readings of one number, given to endpoints found from then on as their `minInterval`, which may be changed on each                                                         |

An endpoint found before keeps its retention, and each endpoint can take its own interval, which
counts within a minute:

```bash
# in EiN's terminal, as the administrator
attrs -s 'retention=90 day' /dev/hall-sensor/temperature
attrs -J minInterval=60 /dev/heater-plug/switch-0-power
```

## When something goes differently

| What you see                                                | What it means                                                          | What to do                                                                                                                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No devices yet** on the Devices page                      | No device has announced itself, or EiN does not hear the broker        | Run `automation-status`, and check the device's own broker settings                                                                                                                      |
| A device never shows up, while others do                    | It cannot reach the broker, or the broker refuses its account          | Check its server, user and password. ESPHome's log says whether MQTT connected. Open port 1883 in the machine's firewall ([network](../admin/network.md#open-the-ports-in-the-firewall)) |
| A Shelly shows up without readings                          | Its status updates are off                                             | On a second-generation Shelly, turn on **Generic status update over MQTT** and **RPC status notifications over MQTT**                                                                    |
| A first-generation Shelly never shows up                    | It has not restarted since MQTT was turned on, or uses a custom prefix | Restart it, and turn its custom MQTT prefix off                                                                                                                                          |
| A Shelly is there twice, under two names                    | Its topic prefix changed, and a new prefix is a new device             | **Forget** the old one                                                                                                                                                                   |
| An endpoint is marked **not read**                          | The device announced it in a way the bridge does not understand        | `automation-status` says why. Its readings are not kept                                                                                                                                  |
| `… takes on, off or toggle, not …` when switching           | The value is not one the control takes                                 | See [What a device becomes](#what-a-device-becomes)                                                                                                                                      |
| `… not connected to the broker, so nothing was sent`        | EiN does not hear the broker just now                                  | Run `automation-status`                                                                                                                                                                  |
| `<device>'s driver shelly is not running`                   | The `automation-bridge` service is stopped                             | `service start automation-bridge`, as the administrator                                                                                                                                  |
| `Access denied for operation 'w' on node: …` when switching | The control is narrowed to others                                      | Ask the administrator                                                                                                                                                                    |
| A device stays **offline**                                  | It said it was going, or the broker said so for it when it disappeared | Check its power and its Wi-Fi                                                                                                                                                            |

## Related pages

- [Devices](../guide/devices.md): the device pages, switching and history.
- [Devices, endpoints and drivers](../concepts/devices.md): endpoints, controls and the routing keys.
- [Rules](rules.md): switching things when something happens.
- [Devices and their keys](../admin/devices.md): who may do what with the devices.
