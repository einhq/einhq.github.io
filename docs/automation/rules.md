# Rules

A rule switches things when something happens in the house: a button is pressed, a reading crosses a
line and stays there, a device goes away, or the clock comes round to a time. Rules are short YAML
files, written by members of the `automation` group, and each runs with the rights of the person who
wrote it. This page is for those members. [Automation](index.md) covers the devices themselves.

## A first rule

The porch button toggles the hall lamp, but only when it is dark in the hall:

```yaml
# /etc/automation/rules/porch-light.yaml
description: The porch button toggles the hall lamp when it is dark
when:
  event: porch-button/input-0
  is: single
if:
  - state: hall-sensor/illuminance
    below: 30
then:
  - device-set hall-plug/switch-0 toggle
cooldown: 2s
```

1. Write the file in EiN's terminal with `edit /etc/automation/rules/porch-light.yaml`
   ([The editor](../shell/editor.md)), or put it there over SFTP.
2. Make it yours alone to change:

   ```bash
   # in EiN's terminal
   chmod 644 /etc/automation/rules/porch-light.yaml
   ```

   A new file in the folder can be changed by the whole group, and a rule others than its owner may
   change is not run ([Whose rule it is](#whose-rule-it-is)). Do this for every new rule.
3. Check it:

   ```bash
   # in EiN's terminal
   automation-rule-check porch-light
   ```

   ```text
   porch-light (/etc/automation/rules/porch-light.yaml), runs as helen
     The porch button toggles the hall lamp when it is dark
     when porch-button/input-0 is pressed (single)
     if hall-sensor/illuminance below 30: does not hold now
     then device-set hall-plug/switch-0 toggle
   ```

The rules service reads the folder again within a second of a change, so the rule works from the
moment it is saved with the right mode. `automation-rule-check porch-light --run` runs its lines
now, as you, whatever its conditions say: a way to try what it does.

## Where rules are

- Each rule is a file in `/etc/automation/rules` whose name ends in `.yaml`. The rule is called by
  the file's name without it: `porch-light`. Other files in the folder, `.yml` ones included, are
  left alone.
- Only members of the `automation` group see the folder, and write and remove files in it. The
  administrator adds someone with `group-add-member automation helen`, or in **Settings → Groups**.
- To stop a rule, remove its file, or move it out of the folder to keep it:
  `mv /etc/automation/rules/porch-light.yaml ~/`.
- `automation-rule-check` also reads a file elsewhere, such as a draft in your home:
  `automation-rule-check ~/draft.yaml`.

### Whose rule it is

A rule's lines run as the owner of its file, through `runas`, with that person's rights and nothing
more: a rule of Helen's switches what Helen may switch, and a line she may not run fails as it would
for her. Copying someone's rule into a file of your own makes it yours. `automation-rule-check` says
whose it is, in `runs as`.

A rule file that others than its owner may change is not run, since whoever could change it could
run lines as its owner. `chmod 644` is the way out. Until then `automation-rule-check` and
`automation-status` say
`not run: others than its owner may change it, so it is not run (chmod 644)`.

## What a rule says

| Key           | What it is                                                                                   | Needed |
| ------------- | -------------------------------------------------------------------------------------------- | ------ |
| `description` | A sentence for people, which `automation-rule-check` shows                                   | No     |
| `when`        | What makes it run: one trigger, or a list of them, any one of which runs it                  | Yes    |
| `if`          | Conditions: one, or a list of them, all of which must hold when a trigger fires              | No     |
| `then`        | Command lines: one, or a list of them, run in order as the file's owner until one fails      | Yes    |
| `cooldown`    | The least time between two runs, such as `2s` or `5m`. A trigger that fires sooner is let go | No     |

A device's entity is written `<device>/<entity>`, as the device's **Info** tab and `device-show` name
it: `hall-sensor/temperature`, `hall-plug/switch-0`. A time is a number and `s`, `m`, `h` or `d`:
`30s`, `10m`, `1.5h`, `1d`.

### What makes it run: `when`

| Trigger                    | It fires                                                                                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state: <device>/<entity>` | When the entity's value changes                                                                                                                                 |
| … with `to`                | When the value comes to that: a number, a word, or `on` and `off` for a switch or a light                                                                       |
| … with `above`, `below`    | When the value comes above or below that number                                                                                                                 |
| … with `from`              | Only when the value it changed from was that                                                                                                                    |
| … with `for: 10m`          | Once the value has stayed what the trigger waits for that long. When it leaves before, the wait is let go, and starts again the next time the value comes to it |
| `event: <device>/<entity>` | At each press of a button; with `is: single`, only at that kind of press (a Shelly's are `single`, `double`, `triple` and `long`)                               |
| `online: <device>`         | When the device comes online or goes offline; with `is: true` only when it comes, with `is: false` only when it goes                                            |
| `at: "07:30"`              | Once a day at that time, in the system's time zone. Write the time in quotes                                                                                    |
| `every: 15m`               | Each time that much has passed on the clock: `every: 15m` at :00, :15, :30 and :45. A minute or more                                                            |

`to`, `above` and `below` can go together, and the value must then meet all of them. A state
trigger fires when the value comes to what it waits for, not again while it stays there: `above: 23`
fires when the temperature goes from 22.8 to 23.1, and again only after it has been 23 or below.

### What must hold: `if`

| Condition                  | It holds when                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `state: <device>/<entity>` | The entity's latest value `is` a value, is `not` one, is `above` or `below` a number; with none of them, it has one |
| `online: <device>`         | The device is online; with `is: false`, when it is offline                                                          |

An entity that has never reported holds no condition, and a device that never said whether it is
on counts as offline.

### What it does: `then`

Any command line you could type in EiN's terminal, run as the file's owner: `device-set` mostly, but
as well `todo-add` to put something on a list, or a script of your own. The lines run one after the
other, each when the one before has ended. When one fails, the rest are left, and the
[rules log](#see-what-rules-did) says which line failed and why.

Runs never overlap: a rule that fires while another is running waits for it. Readings and presses
that come while the rules service is stopped wait in its queue, and it takes them when it starts
again; a time of day that passed meanwhile is not caught up.

## More examples

### The heater off when the hall is warm

```yaml
# /etc/automation/rules/heater-off.yaml
description: The heater goes off once the hall has been above 23 °C for ten minutes
when:
  state: hall-sensor/temperature
  above: 23
  for: 10m
if:
  - state: heater-plug/switch-0
    is: on
then: device-set heater-plug/switch-0 off
```

The rule fires when the temperature comes above 23 and has stayed there ten minutes. A dip to 23 or
below lets it go, and the ten minutes start again when the temperature next rises above 23. The
condition leaves it be when the heater is off already, so the log does not fill with runs that
changed nothing.

### A warm, lit hall on a cold morning

```yaml
# /etc/automation/rules/morning.yaml
description: On a cold morning, the heater and the hall lamp on at half past six
when:
  at: '06:30'
if:
  - state: hall-sensor/temperature
    below: 19
then:
  - device-set heater-plug/switch-0 on
  - device-set hall-plug/switch-0 on
```

At half past six in the system's time zone (`TZ` in `~/ein/.env`,
[Installing in detail](../admin/install.md#env)), and only when the hall is below 19 °C, the heater
goes on and then the lamp. If switching the heater fails, the lamp is left as it is. The heater
rule above turns the heater off again once the hall is warm.

## See what rules did

Every run is written to the rules log, `/var/logs/automation/rules`, which members of `automation`
can read and which keeps 30 days:

```bash
# in EiN's terminal
log-read /var/logs/automation/rules --since 1d
```

```text
2026-11-08T18:03:55.412Z	{"rule":"porch-light","why":"porch-button/input-0 \"single\"","lines":[{"line":"device-set hall-plug/switch-0 toggle","code":0}],"at":"2026-11-08T18:03:55.410Z"}
```

Each entry names the rule, `why` it ran, each line it ran with its exit `code` (0 when it went well)
and, for one that failed, its `error`, and when it was. `automation-status` sums it up in a line,
`rules: 3, 41 runs`, with a `not run:` line under it for each rule file the service does not run,
and the `automation-rules` service's line on the dashboard's **Services** tab says the same.

## When a rule does not run

| What you see                                                                    | What it means                                                                                                               | What to do                                                                                                          |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `not run: others than its owner may change it, so it is not run (chmod 644)`    | The file can be changed by the group or by anyone                                                                           | `chmod 644` the file                                                                                                |
| `not run: a rule needs when: what makes it run`                                 | The file has no `when`                                                                                                      | Add one                                                                                                             |
| `not run: the rule has …, which a rule does not read`                           | A key is misspelt, or is none a rule takes                                                                                  | Use the keys in [What a rule says](#what-a-rule-says); a trigger's or a condition's own keys are named the same way |
| `not run: state takes <device>/<entity>, not "hall-sensor"`                     | A trigger or a condition names a device where it needs an entity                                                            | Write `hall-sensor/temperature`                                                                                     |
| `not run: at takes a time of day such as "07:30", not …`                        | The time is not in quotes, or not a time                                                                                    | Write `at: "06:30"`                                                                                                 |
| `not run: every takes a minute or more`                                         | `every` is shorter than a minute                                                                                            | Use a minute or more, or a `state` trigger                                                                          |
| `automation-rule-check` says the condition `does not hold now`                  | The rule fires, but its conditions keep it from running                                                                     | Nothing, when that is what you meant                                                                                |
| The rule is fine, but nothing happens when the value changes                    | A state trigger fires when the value comes to what it waits for; it was there already, or the rule is within its `cooldown` | Wait for the value to leave and come back, or try the lines with `automation-rule-check <rule> --run`               |
| The log has a line with a code other than 0 and `Access denied for operation …` | The rule's owner may not do what the line does, such as switch an entity whose `set` node is narrowed                       | Have someone who may write the rule, or ask the administrator                                                       |
| `automation-rule-check` cannot read `/etc/automation/rules`                     | You are not in the `automation` group, or were added since you signed in                                                    | Ask the administrator to add you, then sign in again                                                                |
