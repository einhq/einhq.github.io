# Modules

Modules decide what your EiN is for: the Archive, the assistant and the client for the media
service are each a module. This page is for the administrator: which modules there are and what
they need, how to install, update and remove them on **Settings → Modules** or in the terminal, how
to keep one to some groups, how to see whether each one works, and what to do when one does not.

## The modules there are

EiN without modules is the tree, the shell, accounts and the frame of the Web UI. Every
page for photos, people and places, the chat, and the work done on what you upload comes from a
module. [How EiN works](../start/how-ein-works.md#modules-decide-what-ein-is-for) explains what a
module is made of. Each module has a section of its own in this documentation, under **Modules**;
skip the sections of modules you have not installed.

The published modules are the repositories named `module-<name>` in the einhq organisation on
GitHub:

| Module                               | What it gives you                                                                                                                                         | What it needs                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [`archive`](../archive/index.md)     | The Archive: albums, media, people and the family tree, locations, cameras and the trips of devices, staging, and the search that finds things among them | The `ems` module, installed along with it, and the [media service](../ems/index.md) to do its work                                       |
| [`assistant`](../assistant/index.md) | **Chat**: the assistant that answers questions by running EiN's commands for you                                                                          | A [language model](../assistant/language-model.md), either the installer's `--llm` or a hosted one                                       |
| [`devices`](../devices/index.md)     | Drivers for sensors, plugs and lights over MQTT, printers, speakers, screens and web APIs on the network, and cameras watched live                        | An MQTT broker for its MQTT devices and a restreamer for cameras, the installer's `--devices`; the `ems` module, installed along with it |
| [`ems`](../ems/index.md)             | EiN's side of the media service: the client the Archive reaches it through, its health and the graphics card's readings on the **Status**                 | The [media service](../ems/index.md)                                                                                                     |

A module needs only what its manifest names as dependencies; EiN installs those with it. A service
that runs beside EiN, such as the media service or the language model, is no module: the installer
adds it (see [Installing in detail](install.md)), at the version the modules that talk to it ask
for ([Updating](updating.md#the-media-service-and-the-sidecar-follow-their-modules)). Installing
`archive` without the media service gives no error, only a reminder from the installer, and from
`setup.sh` that the `ems` module talks to the media service, which is not installed, but nothing you
upload gets thumbnails, dates, faces or searchable text until the media service is there.

## See what is installed

Open **Settings** in the sidebar and choose the **Modules** tab. Everyone who is signed in has this
tab; for anyone but an administrator it is the only one, and it shows the modules without the
buttons that change them.

![The Modules tab of Settings: the Install button beside the filter, album-folders, archive, assistant, automation, dashboard, ems, media, recipes and todo listed at the left with their versions, and archive open at the right with its version, Active and its description, the buttons Update, Remove and Documentation, its tabs Overview, Dependencies, Services, Pages, Commands, Settings and Node types, and on Overview its details beside the pages of its guide](../../assets/shots/settings-modules.webp "Each installed module, whether it works, and everything it brings, in one place.")

Each module has a picture of its own, a pattern of hats with its initials, in a colour of its own.
The colour comes from the module's name, so a module has the same one here, on the install panel and
in the **About EiN** dialog.

The list at the left holds every installed module with its description; above it, beside the
filter box, is the administrator's **Install** button (see [Install a module](#install-a-module)).
Anyone else has **Published** there instead, which lists the published modules without a way to
install them. A module that works shows
its version at the right; one that does not shows a badge instead and is listed first:

| Badge            | What it means                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **Active**       | Set up since EiN started: its commands are on the path, its services are registered and its pages are built.    |
| **Setup failed** | EiN tried to set it up and refused or failed; the module's panel says why.                                      |
| **Not set up**   | Installed, but not set up since EiN started: its commands are not on the path and its services are not running. |

Type in the filter box to narrow the list by name or description. **Show only active modules**, at
the foot of the list, leaves out the ones that do not work; your browser remembers the switch.

For the administrator the list starts with **Overview**, which the tab opens on when the list and a
panel stand side by side (see [See what can be updated](#see-what-can-be-updated)); its row says
how many updates there are.

Choose a module to open its panel. At the top, on a tile in the module's colour, are its picture,
name, version and state, and under them what it is; a long description shows three lines, and
**More** opens the rest. At the top right are the buttons: **Update** and **Remove** for the
administrator, on a module installed from its repository (see [Update a module](#update-a-module)
and [Remove a module](#remove-a-module)), and **Documentation**, which opens the module's own page
in **Documentation**, with its pages in this guide and every command, setting and node type it
brings. When its setup failed, why is said under the tile. Below are tabs; **Overview** is always
there, the others show how many things each holds, and a tab the module has nothing for is left
out:

| Tab            | What it shows                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Overview**   | What it needs and what needs it, its details, and who has it                                                                                                                                     |
| **Changes**    | For a module installed from its repository, what changed in it: what an update would bring, and the version installed with what came before (see [See what changed](#see-what-changed))          |
| **Set up**     | For the administrator, the module's pages that each set up one thing, the same ones as under **Set up** on the **System** tab (see [Configuration](configuration.md#set-up-one-thing-at-a-time)) |
| **Services**   | Its background services, their state now and how long they have been up. They are started and stopped on the **Status**'s services tab.                                                          |
| **Pages**      | The addresses of the pages it adds; one without a parameter is a link to the page                                                                                                                |
| **Commands**   | Its commands; each opens to its help                                                                                                                                                             |
| **Settings**   | Its settings with their values, each marked **personal** or **system**; a row opens to the setting's description and, if you may change it, its control                                          |
| **Node types** | The kinds of node it defines, with how many of each exist                                                                                                                                        |

**Overview** starts with **Needs**, the modules it needs, and **Needed by**, the modules that need
it, when there are any: a row each with the versions accepted, such as "Accepts ^0.14.0", the
version installed, and a badge when that module does not work or is **Not installed**. Choose a row
to open that module. Beside them, or under them on a narrow screen, are its **Details**:

| Detail        | What it says                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Source**    | The repository it was installed from, as a link, or **Comes with the deployment**                                                                                                        |
| **Installed** | The release, branch or tag it was installed at and its commit, such as `v0.1.0 · 5e1c07a42`, and when it was installed or last updated; one installed at a commit shows the commit alone |
| **Core API**  | The version of EiN's module API it is written for, such as `^0.7.0`                                                                                                                      |
| **Folder**    | Where it is inside EiN, such as `/usr/modules/archive`                                                                                                                                   |

Under them, **Available to** says who has the module; see
[Keep a module to some groups](#keep-a-module-to-some-groups). Its version is the one in its
`mod.json`, beside its name at the top.

A module's system settings are the same ones the **System** tab lists, and its personal ones are
those on **Profile → Preferences**; they save the same way:
[Configuration](configuration.md) explains where a value comes from and what a change restarts.

The **About EiN** dialog, in the menu under your picture, also lists the installed modules, with a
**setup failed** badge on any that did not set up.

In the terminal, `mod list` gives the same list:

```bash
# in EiN's terminal
mod list
```

```text
archive (0.1.0)
assistant (0.1.0)
ems (0.1.0)
```

A module that does not work has `[setup failed]` or `[not set up]` after its version.
`mod list --long` adds each one's description, the problems its setup ran into, its path, the
repository and commit it was installed from, and its commands and services. `mod info archive`
shows one module's manifest: its version, core API, the modules it requires and whether they are
installed, what it exports, and the modules that use it.

## Install a module

You need to be an administrator: signed in as `admin`, or in
[admin mode](../guide/interface.md#admin-mode). EiN needs to reach GitHub, or whichever forge holds
the module.

1. Open **Settings → Modules**.
2. Choose **Install** beside the filter box. The panel at the right is headed **Install a module**
   and lists the published modules in groups: **Updates**, **Not installed** and **Installed**,
   each with how many it holds. A module under **Updates** or **Not installed** is a card with its
   version, its repository and what it is.
3. Choose **Install** on the card of the module you want.
4. EiN asks who the module is for. Keep **Everyone**, or choose **Only some groups** and the groups
   (see [Keep a module to some groups](#keep-a-module-to-some-groups)), then choose **Install** and
   the module's name.

![The Install a module panel on Settings → Modules: its Refresh button, then the group Installed with album-folders, archive and assistant from github.com/einhq, a row each marked The deployment's, and at the foot the From a repository's address box with its Install button](../../assets/shots/modules-published.webp "The published modules and what is installed of each; these came with the deployment, so none offers Install.")

EiN fetches the module, checks it, installs any module it needs that is missing, sets them all up
and starts their services. Its entries in the sidebar and its pages appear without reloading the
page. Every page open in a browser, this one included, then says **EiN has been updated. This page
reloads in 60 s.** and reloads, so it runs the module's pages as installed; each install, update or
removal in a row starts the 60 seconds again, so updating several modules reloads the page once.

The install runs on its own: closing the page, or signing out, does not stop it. While it runs, a
notice at the foot of the screen says so to everyone who has **Settings → Modules** open, with how
many of the module's files are in place, and **Install** and **Update** wait for it, since EiN
installs one thing at a time. A module of many files, such as one with map tiles, can take a long
while. When it ends, the notice says what it installed, with **Open** for the module, or why it
failed, with **Details**, which opens the overview: under **Needs a look** it shows how the last
install went, with its last lines when it failed.

The group a published module is in says what is installed of it:

| Group             | What it holds                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Updates**       | Modules installed from this repository with a newer release out. The card says which version is installed, such as "0.1.0 installed", and its button reads **Update**.                                                                                                                                                                                                             |
| **Not installed** | Modules no version of which is installed; the button reads **Install**.                                                                                                                                                                                                                                                                                                            |
| **Installed**     | The rest, a row each that opens the module's panel: installed from this repository at its newest release, or at a commit past it, or else marked **Installed from elsewhere**, from another repository, or **The deployment's**, when the deployment itself provides it (see [Modules the deployment provides](#modules-the-deployment-provides)) and it cannot be installed over. |

When nothing is to be installed or updated, the panel says "Every published module is installed,
and none has a newer release this EiN can run."

A module written for a different core API says "Needs core API ^0.6.0, which this EiN does not
provide." (with its own range), and its button is greyed out. When only its newest release is
written for another core API and an older one runs here, the module is listed at that older
release, with a note such as "0.3.0 needs core API ^0.8.0, which this EiN does not provide; 0.2.4
is the newest release it can run.", and **Install** installs 0.2.4. **Refresh** asks the sources
again.

In the terminal, `mod search` lists the same, and `mod install` installs:

```bash
# in EiN's terminal
mod search
```

```text
archive 0.1.0
  The family archive, with people, media, places and staging
  https://github.com/einhq/module-archive
assistant 0.1.0 [installed]
  The chat that answers questions about the archive
  https://github.com/einhq/module-assistant
ems 0.1.0
  The client for EMS, the media service
  https://github.com/einhq/module-ems
```

A module's description is the one in its `mod.json` at the release listed, or its repository's
when that has none. Words after `mod search` narrow the list to modules whose name or description
holds them all.

```bash
# in EiN's terminal, as the administrator
mod install archive
```

```text
Fetching https://github.com/einhq/module-archive at v0.1.0 (5e1c07a42)...
archive needs ems ^0.1.0, which is not installed
Fetching https://github.com/einhq/module-ems at v0.1.2 (b83d2f610)...
Installed ems 0.1.0 from https://github.com/einhq/module-ems at b83d2f610
Installed archive 0.1.0 from https://github.com/einhq/module-archive at 5e1c07a42
Setting up module 'ems'...
```

A line follows for each step of each setup, ending in `Module 'archive' setup complete` and the
services it started. `mod install` takes several modules at once, and each can be named in three
ways:

| You write                                     | What is installed                                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `archive`                                     | `module-archive` from the first module source that has it, at its newest release                                |
| `https://github.com/einhq/module-archive`     | That repository, at its newest release                                                                          |
| `archive@v0.1.0`, `…/module-archive@<commit>` | That branch or tag, or a commit by its id, whole or its first seven characters or more, which EiN records whole |

A release is a tag `v` and a version, such as `v0.3.1`, and the newest is the highest version; a
prerelease such as `v0.4.0-rc.1` does not count, unless **Install prereleases**
([`CFG_MODULE_PRERELEASES`](../reference/settings.md#cfg_module_prereleases)) is on. Then a
prerelease is taken like a release, after the release before it and before its own: `v0.4.0-rc.1`
comes after `v0.3.1` and gives way to `v0.4.0`. When the newest release is written for a core API
this EiN does not provide, EiN takes the newest release that is written for it instead and says so:
`archive 0.3.0 needs core API ^0.8.0, and this core provides 0.7.2: taking v0.2.4`. A ref, such as
`archive@v0.3.0`, takes that release or none. A repository with no release is installed at its
default branch, and `@main` installs the default branch of one that has releases, with whatever
was pushed after the last one. A module that is missing and needed by the one you install comes at
its newest release that the module accepts: `archive` needing `ems ^0.1.0` gets `ems` 0.1.2 even
when 0.2.0 is out, and the newest in that range this EiN can run. `mod search` lists each module
at the release `mod install` would take, its version and the core API it needs, and names a newer
release written for another core API: `archive 0.2.4 (0.3.0 needs core API ^0.8.0, this is
0.7.2)`.

The install goes on when the terminal is closed or the connection drops; `mod install` only
follows it, and stops following when you press <kbd>Ctrl</kbd>+<kbd>C</kbd>. `mod install
--background archive` starts it and returns at once. `mod status` says how far the install running
now has got, or what the last one came to, and `mod status --follow` follows it to its end:

```text
mod install seacharts: running for 32s, for admin
  Fetching https://github.com/einhq/module-seacharts at v0.4.0 (3a9c0e1f2)...
    12759 files of seacharts unpacked
```

A member who is not an administrator, asking `mod status` or on the Modules tab of the settings, is
told only that a module install runs, how many files of the module it is unpacking are in place,
and which modules it installed: not what it was asked, who started it, what it says or why it
failed, since the arguments may name a private repository.

EiN installs one thing at a time. While an install runs, `mod install` with the same modules
follows it, and with any other refuses, naming the one running. An install EiN stopped in the
middle of, by restarting, leaves nothing installed of it; the next install clears away what it left.

The [reference](../reference/commands-core.md#mod-install) lists its options.

### Install modules with the installer

The installer's `--module` option names a module for EiN to install at its start, with the
modules it needs:

```bash
# on the machine EiN runs on
~/ein/setup.sh --module assistant
```

`setup.sh` adds the name to `EIN_MODULES` in `~/ein/.env` and, as on every run, fetches the newest
sources, builds and starts EiN again, which installs every module named there that is missing.
At the end `setup.sh` lists the modules installed, each with its version and the release it was
installed at, and below them the lines EiN's start logged about a module it could not install or
run:

```text
The modules installed:
  archive 0.3.1 (v0.3.1)
  assistant 0.2.0 (v0.2.0)
  ems 0.1.2 (v0.1.2)
```

If EiN cannot download a module at its start, its log says `some modules could not be installed or
replaced; continuing boot`, and the `mod install:` line below the list says why. EiN starts without
it; install it from **Settings → Modules** once EiN is up.
[Installing in detail](install.md) has the other options.

### What EiN's start does with installed modules

At every start EiN goes through the modules installed from a repository. One it can run is left as
it is, at whatever version, without asking GitHub, so a restart never updates it. One installed at
a release written for a module API this EiN does not provide, as after an update of EiN that
changed the API, is replaced from its repository by the newest release this EiN can run, as
`mod install` without a ref would take it, and a module it needs that this EiN cannot run either is
replaced the same way. The log says so:

```text
archive 0.3.1 is installed and needs core API ^0.7.0, and this core provides 0.8.0
Fetching https://github.com/einhq/module-archive at v0.4.0 (8c2e41d07)...
```

The release it takes can be older than the newest published: when the newest needs a newer EiN
than this one, it takes the newest that runs here. When no release runs here, the module stays as
it was, does not set up, and `setup.sh`'s list ends with the reason, such as
`mod install: archive: needs @ein/client ^0.7.0, this core provides 0.8.0`.

## See what can be updated

On **Settings → Modules**, the administrator's list starts with **Overview**: everything that can be
updated in one place, and what needs a look. **Check again** asks once more; under the title it
says when the modules and the services were last checked.

| Part                               | What it holds                                                                                                                                                                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EiN and the services beside it** | With the [supervisor](supervisor.md): EiN and each service with a newer release, from the release it runs to the new one, with **Update**, and **Update all services**; a service a module needs that is not installed, with **Install**; one that does not run as it should |
| **Modules**                        | Each module with a newer release, from its version to the new one, the modules updated together with it, and what holds it; **What's new** opens its **Changes** tab, **Update** updates it, and **Update all modules** every one nothing holds                              |
| **Needs a look**                   | Modules whose setup failed or that are not set up, modules whose repository did not answer, how the last install went, and the supervisor's last job when it failed                                                                                                          |

Update EiN and its services first: a module's newer release may need the newer EiN, and the
overview offers it once EiN runs it.

## Update a module

Updating EiN with `setup.sh` does not update its modules. Update them here instead.

- On **Settings → Modules**, choose **Overview** at the top of the list and choose **Update** beside
  a module, or **Update all modules**; or choose **Install** beside the filter box and choose
  **Update** on a module under **Updates**.
- Or open the module's panel. A module installed from its repository has **Update** and
  **Remove** at the top right, and its **Overview** says under **Source** and **Installed** which
  repository and commit it came from and when. When the tab opens, EiN asks the module's repository
  what an update would bring, and the button says so: **Update to 0.3.0** when there is something
  newer, or a greyed-out **Latest version** when there is not; in the list, a module with something
  newer has an arrow beside its version. **Update** fetches the newest release this EiN can run for
  one installed at a release, and the newest commit of the branch for one installed from a branch,
  which the button names by its commit when the version is the same. One installed at any other
  tag gets that tag again, and one installed at a commit stays there, and its panel offers no
  **Update**. When the repository does not answer, the button reads **Update** and tries all the
  same. A notice at the foot of the screen says how it goes, as for an install, and when it ends what
  it updated, or that there was nothing newer.
- In the terminal, `mod outdated` lists the modules with something newer, and `mod install archive`
  updates an installed module. The same commit again is left alone:
  `archive is installed at 5e1c07a42 (v0.1.0) already`.

```bash
# in EiN's terminal
mod outdated
```

```text
archive 0.3.1 → 0.4.0 (v0.4.0)
ems 0.1.2 → 0.1.3 (v0.1.3)
```

`mod outdated` asks the repository of each module installed from one what `mod install` would
update it to, the same way **Update** does, and lists those that would move on, with the version, or
the commit when the version is the same, and the release or ref. Names after it list only those
modules. When every one is current it says `Every module is up to date`; a module whose repository
does not answer is named with why, and the others are still listed.

An update installs what the new version needs and is missing. A module and the modules that depend
on it ask each other for versions, such as `^0.1.0`, so a new version that one of them does not
accept is updated together with the newer releases that accept it. `mod outdated` names them after
the version, and says what holds the update when one has no such release yet:

```text
archive 0.3.1 → 0.4.0 (v0.4.0), with album-folders, letters
  held: letters 0.2.0 needs archive ^0.3.0, and nothing newer of letters takes archive 0.4.0
```

**Update** does the same: when more than the module asked for has to be updated, it says which and
why before it starts, as **More than you asked for is updated**, and installs them together. When
something holds the update, it says which modules will stop working and offers **Update anyway**.

In the terminal, modules named together are one change: `mod install archive album-folders letters`
judges the versions they ask of each other as they will be once all three are installed, and puts
each in place after the modules it needs. One named alone is refused when an installed module
depends on it and does not accept the new version, and the message says what to name with it, for
example `letters needs archive ^0.3.0, and this is archive 0.4.0: mod install archive letters
updates them together, when it has a release that accepts it (mod outdated says), and --force
installs it all the same`. `mod install --force` updates anyway, leaving the modules that do not
accept it with their setup failing, and also fetches again a commit that is installed already.

## See what changed

A module installed from its repository has a **Changes** tab: the commits of its repository, newest
first. Under **Coming with** and the new version are the changes an update would bring, marked down
their left edge; under **Installed** is the commit installed, marked **Installed**, and the changes
before it. A release starts with a line of its own holding its version, and a change says its kind,
such as **feat**, **fix** or **breaking**, when its message does; **Details** opens the rest of it.
**Older** lists more. A module installed from GitHub has one summary for each day it was published;
one from another forge has every change as it was made.

In the terminal, `mod changelog archive` lists the same, a line each, marking the installed commit
and those an update would bring; `--limit` says how many, 50 when not given:

```text
1cc6b1aae 2026-11-24 chore(release): archive 0.4.0 (v0.4.0, coming)
4f0d2e5c1 2026-11-24 feat(archive): albums keep their order (coming)
5e1c07a42 2026-11-20 chore(release): archive 0.3.1 (v0.3.1, installed)
```

After the update EiN sets the module up again and restarts its services; its settings take the new
version's defaults and descriptions, and a setting it no longer has is gone. Every module that depends
on it, directly or through another, is set up again too, and its running services restarted, so
nothing keeps running the code that was replaced. The new version takes the old one's place in a
single step: the module's folder always holds one whole version.

An update that changes only the module's pages, the files under its `ui/` folder, restarts nothing:
its services run none of them, and a restart would stop the work they are in the middle of, such as
the pictures and videos its workers are sending to the media service. The install says so:
`Nothing but the pages of archive changed: its services keep running`.

To keep a module at a version, install it at a commit, such as `mod install archive@463a92f`; its
panel then has no **Update**. The published modules still compare it with the newest release this
EiN can run, so they may offer **Update** for it, which installs that release, as `mod install
archive` without a ref does. A module installed from its default branch past the newest release is not
offered the release.

## Services a module needs

Some modules talk to a service that runs beside EiN, in a container of its own: the `ems` module,
and so the Archive, to the media service; the `devices` module to its sidecar; the Assistant to a
language model. A module's panel lists them under **Services beside EiN** on its **Overview**, with
the versions it takes, as `Accepts ^0.4.4`.

With the [supervisor](supervisor.md), which an installation from GitHub has, each shows whether it
is installed, and the administrator installs one that is not with **Install** beside it; the
[overview](#see-what-can-be-updated) lists a service an installed module talks to that is not
installed, with **Install**. Without
it, the row names the option of `setup.sh` that installs the service on the machine, such as
`./setup.sh --ems`.

## Keep a module to some groups

A module is everyone's until you keep it to some groups. Then only the members of those groups,
and administrators, have it: its commands, its entries in the sidebar and the top bar, its pages,
its personal settings, and the module itself on **Settings → Modules** and on the Docs page's
reference. For everyone else it is as if it were not installed.

- On **Settings → Modules**, open the module. **Available to**, on its **Overview**, says who has
  it, and lists the groups it can be kept to, each with its picture and what it is for. Tick a group
  to keep the module to it, and untick it to let it go; each change is saved as you make it. With
  none ticked the module is everyone's again.
- When you install a module there, **Install** asks first who it is for: **Everyone**, or **Only
  some groups** with the groups to choose. The modules it needs and brings along stay everyone's,
  and an **Update** asks nothing and keeps whom the module was for.
- In the terminal, `mod groups` says who a module is for and changes it, and `mod install --groups`
  installs a module for some groups from the start:

```bash
# in EiN's terminal, as the administrator
mod groups assistant family
mod groups assistant
```

```text
family
```

```bash
# in EiN's terminal, as the administrator
mod groups assistant --everyone
mod install --groups family,friends assistant
```

`mod groups` names groups as `group-list` prints them, and refuses one there is not:
`mod groups: no group famly`.

Someone outside the groups who types one of the module's commands gets `command not found`, and
one who names it by its path is refused:
`/usr/modules/assistant/bin/assistant-ask: permission denied: module assistant is kept to groups you are not in`.
The module's services and pipelines go on working for the whole archive, as they run as the
administrator.

Groups are read when someone signs in, so a person added to a group gets its modules the next time
they sign in. A terminal open already picks up a change to who a module is for at its next
command.

When a module that is everyone's needs the one you keep to groups, `mod groups` and the panel warn
that what it runs of that module fails for anyone outside them, for example
`mod groups: archive depends on ems and is everyone's: what it runs of ems fails for anyone outside family`.
Keep both to the same groups, or neither.

Behind this, the groups are in `/etc/modules/<module>.groups`, one name per line. Setting the module
up puts its commands on the path in `/etc/bashrc.d/<group>` for each group and for `admin`, instead
of in `/etc/bashrc`, and its sidebar entries in `/groups/<group>/.ui/nav.d/<module>.json`, in each
group's [shared home](accounts.md#a-groups-shared-home), instead of in `/etc/ui/nav.d`. A group
without a home is given one, so a module can be kept only to a group that can have one: not to
`admin`, `guest`, `ssh` or `sudo`, nor to a person's own group, which `mod groups` refuses with
`mod groups: a module is kept to groups that can have a home, for its navigation, and 'sudo' is a built-in group`.
Removing the module forgets its groups.
[Configuration files](../reference/config-files.md) lists these files.

## Remove a module

1. Open **Settings → Modules** and choose the module.
2. Choose **Remove** at the top right of its panel.
3. A dialog, **Remove assistant?**, says what goes: "Removing assistant stops its services and
   takes its commands, pages and files away. What it made in the archive stays." When other modules
   need it, it adds which ones and that they will not work without it. Choose **Remove assistant**
   to go ahead, or **Cancel**.

In the terminal, `mod remove` asks first, and `--force` skips the question:

```bash
# in EiN's terminal, as the administrator
mod remove assistant
```

```text
Remove module 'assistant' (0.1.0)? (y/N) y
```

Where no one can answer, as in `ssh host 'mod remove assistant'` or a script, it does not ask: it
stops with `mod-remove: no terminal to answer on; add --force`, and removes nothing.

Removing stops and unregisters the module's services, takes its commands off the path, retires its
pipelines, its sidebar entries and its documentation, rebuilds the pages and deletes its folder.
Some things stay, so that installing it again finds them as they were:

- What it made in the tree: albums, people, labels and the folders under `/archive` that hold them.
- Values set for its settings. They no longer appear on the **System** tab, but come back with the
  module.
- The database indexes it asked for.

EiN does not stop you removing a module that others need. Those modules then fail to set up at the
next start, with `requires module 'ems' (^0.1.0), which is not installed`; install it again to
bring them back.

> [!WARNING]
> A module named in `EIN_MODULES` in `~/ein/.env` comes back at EiN's next start, because EiN
> installs every module named there that is missing. To keep it removed, delete its name from that
> line as well.

## Modules from other places

**Module sources**, `CFG_MODULE_SOURCES`, lists where published modules are looked for:
organisations on GitHub, Forgejo or Gitea, as their addresses separated by spaces. It is
`https://github.com/einhq` by default. Each repository named `module-<name>` in a source is a
module; `mod install <name>` takes the first source that has it, and a module's dependencies come
from its own organisation first. Change it on **Settings → System → Module sources**, under
**Set up**: one organisation to a row, **Add a source** for another, and under **Now** the modules
each source has, or why EiN could not read it. It is also in the **Modules** category, and in the
terminal:

```bash
# in EiN's terminal, as the administrator
config set CFG_MODULE_SOURCES "https://github.com/einhq https://forge.example:3000/wrenfield"
```

A source that is not public needs an access token. **Tokens for module sources**,
`CFG_MODULE_SOURCES_KEY`, takes one per host, as `host=token` separated by spaces, such as
`forge.example:3000=…`. Like every key, nobody can read it back once set, and EiN sends each token
only to its own host, over HTTPS. On the **Module sources** page, what is typed under **Tokens for private
sources** replaces every token set before. [The settings reference](../reference/settings.md#cfg_module_sources) has
both.

A module is code EiN runs, so it is fetched over HTTPS: anyone on the network between EiN and a
forge answering plain HTTP could read its token and change the module on the way. An `http://`
source or repository address is refused unless the forge is on EiN's own machine (`localhost`,
`127.0.0.1`) or **Hosts reached over plain http**, `CFG_MODULE_SOURCES_INSECURE`, names its host, as
`host` or `host:port` separated by spaces, such as `forge.lan:3000`. A token for such a host is
given as `http://forge.lan:3000=…`; one given as `forge.lan:3000=…` goes to it over HTTPS only.
Name a host there only on a network that is yours alone; [the settings reference](../reference/settings.md#cfg_module_sources_insecure)
has it too. An installed file keeps only whether it is
executable: one with an execute bit in the module's archive is installed `0755`, every other `0644`.

A source that does not answer is named above the published modules, as "https://forge.example:3000/wrenfield
did not answer" with the reason, and the other sources are still listed.

A module that is in no source can still be installed from its repository's address:
`mod install https://forge.example:3000/wrenfield/module-recipes`, or the **From a repository's
address** box at the foot of the **Install a module** panel, whose **Install** asks who the module is
for as on a published one. EiN fetches modules over plain
HTTPS, so the forge must answer git's HTTP protocol and serve an archive of a commit, as GitHub,
Forgejo and Gitea do. [Writing a module](../develop/modules.md) is for making one of your own.

## Where modules are kept

A module installed from its repository is kept in a folder of its own outside EiN's container, so
it stays when EiN is updated or its container is made again. With the standard installation that
folder is `modules/` in the data folder, `~/ein/data/modules` unless you chose another data folder.
Inside EiN it is `/var/lib/modules`, and each module is linked as `/usr/modules/<name>`. Each
module's `.install.json` records the repository, the branch or tag, the commit and when it was
installed.

At every start EiN links each module in the folder and sets them all up, in the order of their
dependencies. A module whose setup fails is logged and the others carry on.

### Modules the deployment provides

A deployment can also mount a folder of module checkouts of its own, named by `DEV_MODULES_PATH`
(see [Environment variables](../reference/environment.md#set-by-the-deployment)). The standard
installation does not; it is for running EiN from its source. A module the deployment provides
runs from there: the published modules mark it **The deployment's**, `mod install` refuses it with
`'archive' is one of the deployment's modules (…), which runs instead`, and it has no **Update** or
**Remove** in its panel. `mod remove` takes away only its link, which the next start puts back. It
is updated with the deployment.

## When a module does not work

Open **Settings → Modules**: a module that does not work is at the top of the list with its badge.

**Setup failed.** Its panel shows "Its setup failed" with each problem, as `mod list --long`
does. The usual ones:

| Problem                                                           | What to do                                                                                                                                                                                     |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `archive: requires module 'ems' (^0.1.0), which is not installed` | Install the missing module: `mod install ems`, or **Install** on the **Install a module** panel.                                                                                               |
| `archive: requires 'ems' ^0.2.0, but 0.1.0 is installed`          | Update the module it needs.                                                                                                                                                                    |
| `archive: needs @ein/client ^0.7.0, this core provides 0.6.0`     | The module is written for another version of EiN, often after EiN was updated, and EiN's start found no release of it that fits. Update the module once one is published; until then it waits. |

After fixing the cause, set the module up again with `mod setup archive`, or every module with
`mod setup --all`, which is what EiN runs at each start. Restarting EiN does the same.

**Not set up.** EiN has not set the module up since it started, for example because it was put in
place without setup. `mod setup <name>` sets it up.

**Active, but something is missing.** Check its **Services** tab: a service that shows
`failed` or `disabled` can be started again on the **Status**'s services tab, and
[Services and logs](services-logs.md) explains how to read its log. A module installed from the
terminal shows its pages in a browser tab that was already open once that page has reloaded, which
it does by itself a minute after the install.

**Install or update refused.** The message says why, in words like these:

| Message                                                                                            | What it means                                                                          |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `no module source has 'recipes': …`                                                                | None of the module sources has `module-recipes`, or none answered; the reasons follow. |
| `https://github.com/einhq/module-archive has no branch, tag or commit 'v9'`                        | The ref after `@` does not exist.                                                      |
| `… has no mod.json at its top: not a module`                                                       | The repository is not a module.                                                        |
| `/usr/modules/archive is a module mod install did not put there; mod remove archive first`         | Something else holds the name.                                                         |
| `no module sources to find 'archive' in: CFG_MODULE_SOURCES is empty; name its repository instead` | **Module sources** is empty.                                                           |

[Troubleshooting](troubleshooting.md) covers problems beyond modules.

## Commands

Every command here runs in EiN's [terminal](../shell/terminal.md) or over SSH. Those that change
something are for administrators only.

| Command                               | What it does                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `mod list [--long]`                   | The installed modules and whether each works                                  |
| `mod info <name>`                     | One module's manifest, what it requires and what uses it                      |
| `mod search [words]`                  | The published modules of the module sources, and what is installed of them    |
| `mod outdated [name...]`              | The modules with a newer release, and which go together                       |
| `mod changelog <name>`                | A module's changes, what an update brings above the one installed             |
| `mod install <module>...`             | Install or update modules with what they need, as one change, and set them up |
| `mod groups <name> [group...]`        | Who a module is for, or keep it to groups; `--everyone` makes it everyone's   |
| `mod remove [--force] <name>`         | Stop and remove a module                                                      |
| `mod setup <name>`, `mod setup --all` | Set up one module, or every module in the order of their dependencies         |

[The core commands reference](../reference/commands-core.md#mod) has each one's options, and
[Updating](updating.md) covers updating EiN itself.
