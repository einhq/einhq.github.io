# Automation

The Automation module makes the house do things by itself. An automation is nodes wired together,
which switch things and run command lines when a reading, a press, a device coming or going, a file
coming into a folder or the clock says so: a lamp on at motion when it is dark, a heater between two
temperatures, a scan filed as it lands in a folder. Each is a YAML file, run with the rights of the
person whose it is. It acts on whatever is under `/dev`, so the devices, their pages and their
commands are EiN's own: [Devices](../guide/devices.md).

This page is for the administrator who installs the module and lets people make automations.
[Automations](automations.md) covers making them.

## What it adds

| Part                                                                                                                                                      | What it is                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The **Automations** page                                                                                                                                  | Under **System** in the sidebar: each automation drawn as its nodes wired together, to make, change, simulate and follow as it runs; see [The Automations page](automations.md#the-automations-page)   |
| `automation/tour`                                                                                                                                         | The module's own automation, off: nine small flows with every kind of node, to simulate or start one of your own from; see [A tour of every kind of node](automations.md#a-tour-of-every-kind-of-node) |
| The `virtual` driver                                                                                                                                      | Devices whose readings are worked out from other devices' (an average, the most, whether any is on) and whose controls hold what is set; see [Virtual devices](virtual-devices.md)                     |
| The `automation-engine` service                                                                                                                           | Runs the automations under `/etc/automations` and `/etc/automations.d`, each as its owner, and the virtual devices                                                                                     |
| The group `automation`                                                                                                                                    | Its members make automations                                                                                                                                                                           |
| `automations`, `automation-new`, `automation-set`, `automation-show`, `automation-check`, `automation-enable`, `automation-disable`, `automation-trigger` | The automations, making and changing them, what one would do now, turning one on and off, and pressing its button                                                                                      |
| `automation-status`                                                                                                                                       | Whether the engine runs, how many automations it runs, and the ones it holds back                                                                                                                      |

With the [Assistant](../assistant/index.md), it also teaches the chat to make automations.

## What it needs

Nothing but EiN: no service beside it and no other module. An automation acts on whatever is under
`/dev`:

- EiN's own devices: a [phone or a GPS tracker](../guide/devices.md#a-phone-or-a-gps-tracker), a device that
  [posts to a webhook](../guide/devices.md#a-device-that-posts-to-a-webhook), and the machine EiN
  runs on ([Core's host driver](../concepts/devices.md#cores-host-driver)).
- The [Devices](../devices/index.md) module's, when it is installed: sensors, plugs, lights and
  buttons over MQTT, printers, speakers and screens on the network, web APIs and cameras.
- The [virtual devices](virtual-devices.md) this module adds, worked out from the others.

An automation that only reacts to the clock, to files coming into a folder or to EiN's events needs
no device at all.

## Install it

Install it from **Settings → Modules**, or in EiN's terminal:

```bash
# in EiN's terminal, as the administrator
mod install automation
```

At a new install, name it to the installer, `curl -fsSL https://einhq.eu/install.sh | bash -s --
automation`, or give `--module automation` to `setup.sh`. **Automations** is then under **System**
in the sidebar, for members of the `automation` group. [Modules](../admin/modules.md) covers
installing and removing modules.

The module runs one service, `automation-engine`. When it first starts it makes the group
`automation`, whose members make automations. Nobody is in it to begin with: add the people who
make automations, in **Settings → Groups** or in the terminal.

```bash
# in EiN's terminal, as the administrator
group-add-member automation helen
```

A person added signs in again before the group applies to them.

## Check that the engine runs

```bash
# in EiN's terminal
automation-status
```

| What it says                 | What it means                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `4 running, 41 actions`      | The engine runs, with how many automations it runs and the actions they have taken since it started.                                                            |
| `not run: hall-light: <why>` | An automation the engine holds back, with its first problem; [When an automation does not run](automations.md#when-an-automation-does-not-run) says what to do. |
| `not running`                | The `automation-engine` service is stopped: `service start automation-engine`, as the administrator. Virtual devices are offline meanwhile.                     |

`automation-status --brief` is the line the `automation-engine` service has on the Status page's
**Services** tab, and `automation-status hall-light` says what each node of a running automation
last sent ([See what automations did](automations.md#see-what-automations-did)).

## Who may do what

| Who                               | What they may do                                                                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Members of the `automation` group | Make automations, which act with their owner's rights and nothing more: they hear and switch only the devices their owner may read and switch |
| Members of the `devices` group    | Make [virtual devices](virtual-devices.md), as they make every device                                                                         |
| The administrator                 | Everything: add people to the group, turn a module's automations on and off, and raise EiN's events from an automation                        |

[Whose automation it is](automations.md#whose-automation-it-is) has the rest, and
[Devices and their keys](../admin/devices.md) how to share a device and keep a switch to some
people.

## Ask the assistant

With the [Assistant](../assistant/index.md) installed, asking for an automation, "turn the hall lamp
on when there is motion after dark", gives a
[proposal card](../assistant/chat.md#when-the-assistant-offers-to-make-a-change). The assistant
looks up the devices you name and makes the automation from the
[starting point](automations.md#a-starting-point-with-your-devices) it fits, with your devices set.
One that fits no starting point is proposed as an `automation-set` line with its YAML. Either line
is tried with `--dry-run` before you see it, and one with something wrong goes back to the assistant
to correct, so the card you get is one that can run. It also answers what an automation does and
whether it runs.

## From the terminal

```bash
# in EiN's terminal
automations                           # the automations, and why one does not run
automation-new hall-light --from motion-light   # one from a starting point
automation-check hall-light           # what an automation's nodes would say now
automation-status                     # whether the engine runs, and what it holds back
```

[Automation commands](commands.md) lists every option.

## Settings

| Setting                         | On the Settings page        | Default | What it does                                                                                                                                                                                                                           |
| ------------------------------- | --------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CFG_USER_AUTOMATION_NODE_DOCS` | **Node docs in the editor** | on      | Whether a node's panel in the editor shows, at its foot, what the node does and what each of its settings means. Folding or opening them there sets it. Each person's own, in the **Automation** category of **Profile → Preferences** |

## Related pages

- [Automations](automations.md): making automations, the nodes and what they say.
- [Virtual devices](virtual-devices.md): readings worked out from other devices', and switches with no hardware behind them.
- [Devices](../devices/index.md): the module that brings sensors, plugs, lights, speakers, screens and cameras.
- [Devices](../guide/devices.md): the device pages, switching and history.
- [Devices, endpoints and drivers](../concepts/devices.md): endpoints, controls and the routing keys.
