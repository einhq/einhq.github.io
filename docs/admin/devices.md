# Devices and their keys

Devices are the `devices` group's to look at, switch and look after, and anyone else's once a
member shares one with them, and a device's own to write to when it has a key. This page is for
administrators: who may do what with the devices under `/dev`, how to share a device or keep a
switch to some people, what a device key opens, and what reaches EiN without signing in.
[Devices](../guide/devices.md) describes the pages, and
[Devices, endpoints and drivers](../concepts/devices.md) how devices are kept.

## Who may do what

| Who                             | What they may do                                                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Members of the `devices` group  | See every device, its readings and its history; switch and set every control; share a device; make (`device-create`), rename (`device-label`) and forget (`device-forget`) devices |
| Someone a device is shared with | See that device and its readings, and switch it when it is shared to edit                                                                                                          |
| The administrator               | Everything: own every device, add people to `devices`, and bind queues and logs to the devices' routing keys                                                                       |
| Everyone else signed in         | Nothing of the devices: no device, reading or switch, nor what they publish                                                                                                        |
| A visitor who is not signed in  | Nothing either, whether or not visitors may browse                                                                                                                                 |

EiN makes the group `devices` (**Devices**, "May see, switch, share, make, name and forget every
device under /dev") at every start when it is missing. Add someone to it in **Settings → Groups**, or
in the terminal; the change applies from their next sign-in:

```bash
# in EiN's terminal, as the administrator
group-add-member devices helen
```

`/dev` stays the administrator's, with the mode `0755`, and EiN sets this again at every start:
nobody else adds to it or removes from it, so EiN's own `null` and event routers, and the devices,
stay where they are. The members of `devices` make, name and forget devices through the three
commands, which do it for them as the administrator. `device-forget` also tells the device's driver to
let it go, so a broker's last announcement does not make it again.

Every device belongs to the administrator and the group `devices`, whether a driver found it or a
member made it with `device-create`, and its endpoints take its owner and group:

| Node                        | Mode   | So                                                                                            |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| The device, `/dev/<device>` | `0770` | The members read it, change it and share it                                                   |
| A reading, a log            | `0660` | The members read it and add to it                                                             |
| A track                     | `0770` | The members read it and change it, and what the Archive keeps under it (its homes, its trips) |
| A control                   | `0660` | The members read its states and switch it                                                     |

Nobody outside `devices` reads any of it until it is shared with them. That is what keeps a door or
motion sensor, which says when someone came home or moved in a room, and a phone's track, which says
where its owner has been, to the people who should know. Only the administrator binds a queue or a
log to routing keys, so nobody else hears what a device publishes either
([Changes and pipelines](../concepts/pipelines.md)). An automation of the
[Automation](../automation/automations.md) module hears and switches as the person whose
automation it is, with that person's rights.

### Share a device

A member shares a device on its page with **Share**, as anything else is shared
([Sharing](../guide/sharing.md)): a person or a group to **view** sees the device, its readings and
its history; to **edit** they also switch its controls, write to it and share it on. Sharing a device
shares every endpoint in it, and an endpoint its driver adds later is shared the same way. In the
terminal:

```bash
# in EiN's terminal, as a member of devices
share-set -m u:ruby:rwx /dev/ruby-phone      # Ruby's own phone: hers to see and change
share-set -m g:parents:rx /dev/front-door    # the parents see when the door opens
share-set -x g:parents /dev/front-door       # and no longer
```

### Keep a switch to some people

Each control is a node of its own, and whoever may write it may switch it. To keep the heater to a
group, such as `parents`, take the switch from the members and share it with the group:

```bash
# in EiN's terminal, as the administrator
chmod 640 /dev/heater-plug/switch-0
share-set -m g:parents:rwx /dev/heater-plug/switch-0
```

Anyone else is then refused with `Access denied for operation 'w' on node: …`, on the page, in the
terminal and in their automations, while the members still see its state. A driver leaves the owner, group,
mode and access list of an endpoint it already has as they are, so the change holds. One endpoint can
be kept from someone a device is shared with the same way, with `share-set -x` on the endpoint: it is
left out of the device for them. [Permissions in depth](permissions.md) explains owners, groups and
modes.

## Device keys

A device cannot sign in. A phone, a tracker or a script that posts to EiN carries the device's key
instead, made with the device's **Info** tab or `device-key`:

```bash
# in EiN's terminal
device-key ruby-phone --new --origin https://ein.wrenfield.example
```

```text
https://ein.wrenfield.example/file/dev/ruby-phone?key=Zt2v…
```

- **What it opens.** Writes to `/file/dev/<device>` and `/file/dev/<device>/<endpoint>` of that one
  device, and nothing else: no other device, no reading, no other address. A `GET` with the key on the
  device is the device talking, for a tracker that sends only `GET`s, such as OsmAnd. A write with the
  key is made as the device's owner, the administrator, limited to the device's folder, and the
  device's driver is told it came from the device (`device:ruby-phone`).
- **How it is sent.** As `Authorization: Bearer <key>`, or as `key=` in the address for a client that
  takes only an address, such as Traccar Client.
- **Who sees it.** Whoever may change the device: the members of `devices`, someone it is shared with
  to edit, and the administrator. It is kept in the
  device's `.key`, mode `0600` and the administrator's, so the address can be shown again.
- **Renewing it.** `--new`, or **New key** on the **Info** tab, makes another; the old address stops
  working at once. `--off`, or **Take the key away**, removes it, and nothing writes to the device
  without signing in.

A request with a wrong key, a key for another device, or a device whose owner's account is disabled
is answered `403 Forbidden`, the same for each, and logged in the system log as `device write refused`
with the reason and the client's address:

```bash
# in EiN's terminal, as the administrator
dmesg | grep 'device write refused'
```

A write without a key is a signed-in person's, as every `/file` write is, and needs their session.

## What reaches EiN without signing in

- **A device with its key**, writing to `/file/dev/<device>` as above. Any other write there needs a
  signed-in session.
- **Nothing else of the devices.** A visitor reads no device, reading or track and switches nothing,
  even with **Visitors may browse** on
  ([Visitors and share links](permissions.md#visitors-and-share-links)): the devices are the `devices`
  group's.
- **The MQTT broker**, with the [Automation](../automation/index.md) module's, is not EiN: the devices
  sign in to it with their own password, and whoever reaches it with that password switches them.
  Keep its port in your home network
  ([Before you open EiN to the internet](network.md#before-you-open-ein-to-the-internet)).

A phone away from home reaches EiN only when EiN is reachable from the internet over HTTPS; see
[Phones and trackers posting](network.md#phones-and-trackers-posting).

## When something goes differently

| What you see                                                              | What it means                                                          | What to do                                                            |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `only the devices group's members make, name and forget devices`          | The person is not in `devices`, or was added since they signed in      | Add them, and have them sign in again                                 |
| `device-key: only whoever may change <device> sees or changes its key`    | The person may not change the device                                   | A member of `devices` makes the key, or shares the device to edit     |
| `devices` lists nothing, or `Access denied` on a device                   | The person is not in `devices` and the device is not shared with them  | Share the device with them, or add them to `devices`                  |
| A phone's posts are refused with `403 Forbidden`                          | Its key was renewed or taken away, or its owner's account was disabled | Give the phone the address `device-key` shows now, or a new one       |
| `device write refused` in the system log, from an address you do not know | Something tries keys, or holds an old address                          | Renew the key with `device-key <device> --new` if it may have got out |
| `Access denied for operation 'w' on node: /dev/…` when switching          | The control is narrowed to others                                      | Widen it, or leave it                                                 |

## Related pages

- [Devices](../guide/devices.md): the pages, switching, and a phone as a tracker.
- [Devices, endpoints and drivers](../concepts/devices.md): endpoints, drivers and the routing keys.
- [Accounts and groups](accounts.md): adding someone to a group.
- [Permissions in depth](permissions.md): owners, modes and access lists.
- [Ports, HTTPS and remote access](network.md): reaching EiN from a phone away from home.
