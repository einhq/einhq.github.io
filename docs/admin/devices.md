# Devices and their keys

Devices are everyone's to look at and to switch, a few people's to add and remove, and a device's own
to write to when it has a key. This page is for administrators: who may do what with the devices
under `/dev`, how to narrow a switch to some people, what a device key opens, and what reaches EiN
without signing in. [Devices](../guide/devices.md) describes the pages, and
[Devices, endpoints and drivers](../concepts/devices.md) how devices are kept.

## Who may do what

| Who                            | What they may do                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Everyone signed in             | See every device, its readings and its history; switch and set every control; bind queues and logs of their own to any device's routing keys        |
| Members of the `devices` group | Also make devices (`device-create`), rename them (`device-label`) and forget them (`device-forget`); make and renew the key of any device           |
| A device's owner               | Whoever made it by hand: also write values to its endpoints, edit its track (its trips, with the Archive), make its key, and narrow it with `chmod` |
| The administrator              | Everything: also add people to `devices`, own the devices drivers find, and narrow who may switch a control                                         |

EiN makes the group `devices` (**Devices**, "May make, name and forget the devices under /dev") at
every start when it is missing. Add someone to it in **Settings → Groups**, or in the terminal; the
change applies from their next sign-in:

```bash
# in EiN's terminal, as the administrator
group-add-member devices helen
```

`/dev` is the administrator's, with the group `devices` and the mode `1775`, so members of the group
add devices to it; EiN sets this owner and mode again at every start. The device commands check the
group themselves: `device-label` and `device-forget` act on any device for a member, whoever made it.
Remove a device with `device-forget` rather than `rm`: it also tells the device's driver to let it go,
so a broker's last announcement does not make it again.

A device a driver finds belongs to the administrator, since drivers run as EiN's services; a device
made with `device-create` belongs to whoever made it. Either way its group is `devices`, with the
mode `0775`. Its endpoints take the device's owner and group: readings and tracks `0644`, so only the
owner adds to them, and controls `0664` with the group `users`, so everyone with an account may
switch them. A rule of the [Automation](../automation/rules.md) module switches as the person whose
rule it is, with that person's rights.

> [!IMPORTANT]
> Readings are not narrowed device by device. Everyone signed in may read any device's history and
> bind a queue or a log of their own to its routing keys, door and motion sensors included: whoever
> has an account can tell when the front door opened or someone moved in a room, and a phone's track
> says where its owner has been. Narrowing a device's nodes, as below, keeps its history from others,
> but not what it publishes from then on: anyone signed in may still bind a queue to
> `dev.<device>.#`.

### Keep a switch to some people

Each control is a node of its own, and whoever may write it may switch it. To keep the heater to a
group, such as `parents`:

```bash
# in EiN's terminal, as the administrator
chown :parents /dev/heater-plug/switch-0
```

Anyone else is then refused with `Access denied for operation 'w' on node: …`, on the page, in the
terminal and in their rules. `chmod 644 /dev/heater-plug/switch-0` keeps it to its owner instead, the
administrator for a device a driver found. A driver leaves the owner, group and mode of an endpoint
it already has as they are, so the change holds.

### Keep a device to some people

To keep a whole device's history, such as a phone's track, to its owner, the `devices` group and one
group more:

```bash
# in EiN's terminal, as its owner or the administrator
chmod o-rx /dev/ruby-phone
acl -m g:parents:rx /dev/ruby-phone
```

Reaching an endpoint takes passing through its device, so this closes every endpoint of it to
everyone else, visitors included. [Permissions in depth](permissions.md) explains modes and access
lists.

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
  key is made as the device's owner, limited to the device's folder, and the device's driver is told
  it came from the device (`device:ruby-phone`).
- **How it is sent.** As `Authorization: Bearer <key>`, or as `key=` in the address for a client that
  takes only an address, such as Traccar Client.
- **Who sees it.** Whoever may change the device: its owner, the members of `devices` and the
  administrator. It is kept in the device's `.key`, mode `0600`, so the address can be shown again.
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
- **Visitors, while Visitors may browse is on.** A visitor reads what everyone else may
  ([Visitors and share links](permissions.md#visitors-and-share-links)), and a device and its
  readings are readable by everyone else unless narrowed: the device's page opens for a visitor who
  has its address. Keep a device from visitors with the two lines in
  [Keep a device to some people](#keep-a-device-to-some-people), granting `users` instead of a group.
  Visitors never switch a control.
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
| `device-key: only whoever may change <device> sees or changes its key`    | The person may not change the device                                   | Its owner, a member of `devices` or the administrator makes the key   |
| A phone's posts are refused with `403 Forbidden`                          | Its key was renewed or taken away, or its owner's account was disabled | Give the phone the address `device-key` shows now, or a new one       |
| `device write refused` in the system log, from an address you do not know | Something tries keys, or holds an old address                          | Renew the key with `device-key <device> --new` if it may have got out |
| `Access denied for operation 'w' on node: /dev/…` when switching          | The control is narrowed to others                                      | Widen it, or leave it                                                 |

## Related pages

- [Devices](../guide/devices.md): the pages, switching, and a phone as a tracker.
- [Devices, endpoints and drivers](../concepts/devices.md): endpoints, drivers and the routing keys.
- [Accounts and groups](accounts.md): adding someone to a group.
- [Permissions in depth](permissions.md): owners, modes and access lists.
- [Ports, HTTPS and remote access](network.md): reaching EiN from a phone away from home.
