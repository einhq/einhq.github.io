# Virtual devices

A virtual device is a device of the Automation module's `virtual` driver: its readings are worked
out from other devices' readings, and its switches and settings hold whatever people and
automations set them to. It is a device like any other under `/dev`, with its page, its history and
its readings on the bus, and it is shared the same way. This page is for members of the `devices`
group, who make devices.

Use one for:

- **A reading of the house, not of one sensor:** the average temperature indoors, the warmest room,
  whether any window is open, how many lamps are on.
- **A switch or a setting with no hardware behind it:** _away_, a _guest mode_, the temperature the
  heating aims for, which [automations](automations.md) read and set.
- **Something to share in place of what it is made of:** the house's average temperature shared
  with a guest, who sees no single room's sensor.

## Make one

```bash
# in EiN's terminal, as a member of devices
device-create indoors --label Indoors --class sensor --driver virtual \
  --config 'read=temperature=avg hall-sensor/temperature kitchen-sensor/temperature; open=any front-door/contact back-door/contact' \
  --config 'set=away=bool; setpoint=number 5..30 0.5 °C'
```

This makes `/dev/indoors` with two readings, `temperature` (the average of the hall's and the
kitchen's) and `open` (true while either door is), and two controls, `away` (on or off) and
`setpoint` (5 to 30 in steps of 0.5 °C). **New device** on the **Devices** page makes one too: pick
the `virtual` driver and fill in its readings and controls as above.

### Readings: `read`

Each reading is `name=<what> <device>/<endpoint> <device>/<endpoint> …`, separated by `;` or new
lines. `<what>` is one of:

| What    | The reading is                                                          |
| ------- | ----------------------------------------------------------------------- |
| `avg`   | The average of the sources' numbers                                     |
| `min`   | The lowest                                                              |
| `max`   | The highest                                                             |
| `sum`   | Their sum: the power a whole floor draws                                |
| `count` | How many sources are on (true, open, a number other than 0)             |
| `any`   | True while any source is on                                             |
| `all`   | True while every source is on                                           |
| `last`  | The newest source's reading: whichever of two thermometers spoke latest |

A reading is worked out again whenever one of its sources changes, from the latest reading of each,
and kept when it changes. A source that has not reported yet is left out until it does. An average,
a lowest, a highest and a sum take the unit of their sources when they share one.

### Controls: `set`

Each control is `name=<kind>`:

| Kind                              | It holds                                                |
| --------------------------------- | ------------------------------------------------------- |
| `bool`                            | On or off; `toggle` turns it over                       |
| `number [min..max] [step] [unit]` | A number, such as `number 5..30 0.5 °C`                 |
| `enum <option> <option> …`        | One of the options, such as `enum eco comfort off`      |
| `text`                            | Any text                                                |
| `momentary`                       | Nothing: a press, which automations hear, as a button's |

Switch one as any control, on the device's page or with `echo on > /dev/indoors/away`; it holds the
value until it is set again. An automation reads it with a `device` node and sets it with a
`control` node.

### Change one

The config is the device's own, so changing it is changing its `config` attr; the driver sets the
device up again, adding the readings and controls that are new and removing those that are gone,
with their history:

```bash
# in EiN's terminal, as a member of devices
attrs -J 'config={"read": "temperature=avg hall-sensor/temperature kitchen-sensor/temperature bedroom-sensor/temperature", "set": "away=bool"}' /dev/indoors
```

## Who sees what

A virtual device is the devices group's, as every device is, and is shared on its page or with
`share-set` ([Share a device](../admin/devices.md#share-a-device)).

Its readings are worked out with the rights of the devices group and nobody's more. A source the
group may not read, such as a motion sensor someone has narrowed to the parents, is refused, so a
virtual device never shows anyone what its sources would not. A reading it works out is the group's
to read, not to write: nobody adds a reading of their own to it.

## When one does not work

| What you see                                                                                           | What it means                                                                                     | What to do                                                                                         |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `device-create` says `the devices group may not read hall-sensor/motion, or there is no such endpoint` | The source is misspelt, gone, or narrowed to some people                                          | Correct it with `device-show`, or leave it out                                                     |
| `its readings go round in a circle: indoors → upstairs → indoors`                                      | A virtual device reads itself, or two read each other                                             | Read the sources themselves                                                                        |
| `the reading temperature takes one of avg, min, …`                                                     | `<what>` is misspelt or missing                                                                   | Use one from [Readings](#readings-read)                                                            |
| The device is **offline**                                                                              | The `automation-engine` service, which runs the driver, is stopped, or its config stopped working | `service start automation-engine`, as the administrator; `service logs automation-engine` says why |
| A reading stays empty                                                                                  | None of its sources has reported since the device was made                                        | It fills in at their next reading                                                                  |
