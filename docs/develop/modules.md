# Writing a module

A module is how EiN learns to do something new: its commands, pages, background services, settings
and pipelines come in one folder that you can install on any EiN. This page is for developers. It
walks through a small module from its first file to publishing it, and shows where each kind of
part goes.

## What a module is

A module is a folder with a `mod.json` at its top, kept in a repository of its own named
`module-<name>`. Core knows no module by name: the [Archive](../archive/index.md), the
[Assistant](../assistant/index.md) and the media service client, `ems`
([The media service](../ems/index.md)), are modules like the one you write, and you can read their repositories to see any part on
this page at full size.

When EiN sets a module up, it finds most of what the module brings by where it is in the folder.
The manifest says who the module is, what it shares with other modules, and what it adds to
machinery core already has. Nothing in the manifest is code.

| In the module             | What EiN does with it at setup                                                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mod.json`                | Reads and checks it; refuses the module when it is wrong                                                                                                                    |
| `bin/`                    | Adds the folder to every shell's `PATH`; each file is a command, in bash or TypeScript                                                                                      |
| `services/<name>/`        | Registers and enables a background service: `start.sh` with a `config.json`; a single script `services/<name>` is wrapped in a folder of its own                            |
| `pipelines/*.yaml`        | Registers each pipeline definition                                                                                                                                          |
| `ui/`                     | Bundles the pages `mod.json` names; links `ui/nav.json` as the module's sidebar and top-bar entries                                                                         |
| `ui/index.html`           | Links a built `ui/` as a site of its own, `/var/www/<name>`                                                                                                                 |
| `etc/config`              | Links it as `/etc/config.d/<name>`: the module's own choice of settings                                                                                                     |
| `etc/<x>.d/`              | Links it as `/etc/<x>.d/<name>`, for the module that reads that folder; `mod install` restarts the services that read it when it changes ([`dropIns`](manifest.md#dropins)) |
| `etc/` (anything else)    | Copies it into `/etc` when it is not there yet; never overwrites                                                                                                            |
| `lib/`, `types/`, `test/` | Nothing; ordinary source, reached through the manifest's `imports` and `exports`                                                                                            |
| `uninstall.sh`            | Runs it when the module is removed                                                                                                                                          |

![A module's folder beside what EiN makes of each part at mod setup: mod.json is checked and its settings, node types, archive roots and indexes registered; bin/ becomes commands on every shell's PATH; services/ are registered in /etc/services and enabled; pipelines/ are defined in /var/pipelines/definitions; ui/ gives pages bundled by ui-build and sidebar and top-bar entries linked into /etc/ui/nav.d; etc/ gives settings values and drop-ins, linked, and other files copied once into /etc; and uninstall.sh, dashed, runs when mod remove takes the module away](../diagrams/module.svg "EiN finds most of a module by where each part sits in its folder; mod.json says the rest.")

[The module manifest](manifest.md) describes every field of `mod.json`. This page uses the few a
first module needs.

## Before you start

You need:

- An EiN you are the administrator of, to install the module on while you work. A test
  installation is better than the one holding your family's archive.
- A place for the module's files that you can edit, on the machine EiN runs on.
- For publishing, a repository on GitHub, Forgejo or Gitea.

You do not need a copy of EiN's source to write a module: EiN bundles a module's pages and runs its
TypeScript itself. To type-check a module and run its tests you work inside a checkout of core,
which [Building from source](source.md) sets up.

There is no command that makes a new module for you. Start from the folder below, or copy a small
published module such as `module-ems` and cut it down.

## Lay out the module

This page builds `recipes`, a module that keeps the Wrenfield family's recipes as nodes under
`/archive/recipes`, with a command to add one, a command to list them and a page that shows them:

```text
module-recipes/
├── mod.json
├── bin/
│   ├── recipe-add          a command in bash
│   └── recipe-list         a command in TypeScript
├── ui/
│   ├── nav.json            its sidebar entry
│   └── pages/
│       └── recipes.tsx     its page
└── docs/
    └── index.md            its guide
```

The module's name is lower case, digits and hyphens. It is the folder's name under
`/usr/modules`, the owner EiN shows beside its commands and settings, and the prefix of its import
aliases (`@recipes/…`).

## Write the manifest

Start `mod.json` with who the module is and the core it is written for:

```json
{
  "name": "recipes",
  "version": "0.1.0",
  "description": "The family's recipes: who cooked what, for how many",
  "author": "Ruby Wrenfield",
  "license": "MIT",
  "coreApi": "^0.6.0",
  "roots": ["/archive/recipes"],
  "nodeTypes": [
    {
      "type": "recipe",
      "label": "Recipe",
      "category": "content",
      "root": "/archive/recipes",
      "description": "One dish: its title and how many it serves."
    }
  ],
  "ui": {
    "routes": { "/recipes": "ui/pages/recipes.tsx" }
  }
}
```

| Field         | What it does here                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `name`        | The module's name; it must match the folder it is installed in                                                          |
| `version`     | Its semver version, which other modules' `dependencies` ranges are checked against                                      |
| `description` | One sentence for `mod list`, **Settings → Modules** and the documentation                                               |
| `coreApi`     | The range of core's module API the module is written against; `mod setup` refuses it when this core does not satisfy it |
| `roots`       | Folders under `/archive` the module's content lives in; setup creates a missing one and nothing ever removes one        |
| `nodeTypes`   | The node types it defines, for the documentation; one with a `root` is what an `@` in the search box completes to       |
| `ui.routes`   | Its pages, each route with the file that draws it                                                                       |

`mod info` on any installed module shows the range it asks for under **Core API**, followed by the
core API this EiN provides, which `system-info` also shows on its `api` line. A module without `coreApi` still installs,
with a warning.

## Add a command in bash

A file in `bin/` that starts with `#!bash` is a command written in EiN's shell language. The `arg`
builtin declares its arguments, which gives it `--help`, <kbd>Tab</kbd> completion and an entry in
the command reference, the same as EiN's own commands. Write `bin/recipe-add`:

```bash
#!bash
arg --desc "Add a recipe"
arg --effect write
arg '<title>' string "The dish, as the family calls it"
arg -s --serves number "How many it serves"
arg --example "recipe-add 'Apple cake' --serves 8"
arg --returns "nothing; the recipe node is created."
arg --export

name=$(echo "$TITLE" | tr ' ' '_' | tr -cd 'A-Za-z0-9_-')
mknode -t recipe "/archive/recipes/$name" --as "title=$TITLE" --as "serves=$SERVES" || exit 1
echo "added /archive/recipes/$name"
```

`arg --export` reads the arguments and sets `$TITLE` and `$SERVES`. A command run this way runs
with the access of whoever runs it, like any script. [The shell language](../shell/bash.md#give-a-script-options-and-help-with-arg)
lists every form `arg` takes.

Say what the command does to the system with `arg --effect read` or `write`. With the Assistant
installed, the assistant runs a `read` command at once and shows a `write` to the person first; a command that says nothing is
treated as a write.

## Add a command in TypeScript

A file in `bin/` that starts with `#!ts` is a TypeScript command. Its default export is a function
that takes the command object and returns an exit code, and carries a `spec` that describes it.
Write `bin/recipe-list`:

```ts
#!ts
import type { CmdReturn, Command } from '@ein/client';

const ROOT = '/archive/recipes';

const recipeList = async (cmd: Command): CmdReturn => {
  const entries = await cmd.sys.vfs.children(cmd.access, ROOT).catch(() => []);
  const recipes = entries
    .filter((entry) => entry.node.type === 'recipe')
    .map((entry) => ({
      path: `${ROOT}/${entry.name}`,
      title: String(entry.node.attrs.title ?? entry.name),
      serves: String(entry.node.attrs.serves ?? ''),
    }));

  if (cmd.json) await cmd.writeJSON(recipes);
  else for (const recipe of recipes) await cmd.writeLn(`${recipe.title}  (serves ${recipe.serves || '?'})`);
  return 0;
};

recipeList.spec = {
  name: 'recipe-list',
  effect: 'read' as const,
  description: 'List the recipes, with how many each serves',
  args: [],
  flags: [],
  examples: ['recipe-list'],
  returns: 'One entry per recipe: path, title and serves.',
};

export default recipeList;
```

A `#!ts` command runs inside EiN's own process, with all of its permissions. EiN therefore runs one
only from a module under `/usr/modules`, where only the administrator can put files. The same file
anywhere else, a home folder included, stops with
`a #!ts command runs only from a module in /usr/modules` and status `126`. A person's own commands
are bash scripts.

Module code imports from core only `@ein/client`, the module API. What a command uses most:

| Member                                           | What it is                                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `cmd.args`                                       | The words after the command's name; read flags from them with `parseArgs`                                     |
| `cmd.json`                                       | True when the caller wants JSON, as the Web UI and `JSON_OUTPUT=1` do                                         |
| `cmd.writeLn`, `cmd.writeJSON`, `cmd.writeError` | Write a line, a JSON answer, or a line on stderr                                                              |
| `cmd.stdin`                                      | Standard input: `for await (const line of cmd.stdin.lines())`, or all of it with `cmd.stdin.text()`           |
| `cmd.execute(script, { stdin })`                 | Run a shell line and get its `code`, `stdout` and `stderr`; quote paths with `shq`, and pass text as `stdin`  |
| `cmd.progress(fraction)`                         | Say how much of the work is done, 0 to 1; a pipeline step shows it under Ongoing, and it keeps it off quiet   |
| `cmd.sys.vfs`                                    | The tree, read and written with `cmd.access`, the caller's access: nodes, their content, queries and searches |
| `cmd.env`, `cmd.cwd`                             | The caller's environment, settings included, and working folder                                               |
| `cmd.interrupted`, `cmd.onInterrupt`             | Whether the person pressed <kbd>Ctrl</kbd>+<kbd>C</kbd>, and a handler for it                                 |

And the parts of `spec`:

| Field         | What it says                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | The command's name, the same as the file's                                                                                        |
| `description` | What it is for, in one line, for `--help`, the command reference and the assistant                                                |
| `args`        | Each positional argument: `name`, `type` (`string`, `path`, `user`, `group`, `command`, `number`, `subcommand`) and `description` |
| `flags`       | Each flag: `name`, `type` (`bool` for a switch) and `description`                                                                 |
| `effect`      | `read` or `write`; a reading command marks the arguments or flags that make it a write with `writes`                              |
| `examples`    | One or two real command lines                                                                                                     |
| `returns`     | What it answers with under `JSON_OUTPUT=1`, in a sentence                                                                         |
| `admin`       | `true` when only an administrator may run it; for anyone else it is left out of completion and the reference                      |
| `json`        | `false` for a command that writes text even when JSON is asked for                                                                |

A command may import packages through the manifest's `imports`, such as
`"@std/path": "jsr:@std/path@^1.1.3"`, and files of its own through aliases named after the module,
such as `"@recipes/store": "./lib/store.ts"`. A file outside the module is reached only through
another module's exports (see [Use another module](#use-another-module)).

## Try the module on your EiN

With the standard installation, EiN keeps the modules it installs in `modules/` in its data folder,
`~/ein/data/modules` unless you chose another data folder, which EiN sees as `/var/lib/modules`.

1. Put the module's folder there under the module's name, and make its commands executable:

   ```bash
   # on the machine EiN runs on
   cp -r ~/src/module-recipes ~/ein/data/modules/recipes
   chmod 755 ~/ein/data/modules/recipes/bin/*
   ```

2. Link it among the installed modules and set it up:

   ```bash
   # in EiN's terminal, as the administrator
   ln -s /var/lib/modules/recipes /usr/modules/recipes
   mod setup recipes
   ```

   Setup says what it did, with lines like these:

   ```text
   Setting up module 'recipes'...
     roots: /archive/recipes
     Added /usr/modules/recipes/bin to PATH
     Linked navigation at /etc/ui/nav.d/recipes.json
   Module 'recipes' setup complete
     recipes: built, 3.1 KB in 820 ms
   ```

   The last lines come from bundling every module's pages, one line per module.

3. Try the commands. `mod setup` added `bin/` to `PATH` in `/etc/bashrc`, which every shell reads again before its next command, an open terminal tab included:

   ```bash
   # in EiN's terminal
   recipe-add "Peggy Wrenfield's apple cake" --serves 8
   recipe-list
   recipe-list --help
   ```

4. Reload the web page. **Settings → Modules** lists `recipes` as **Active**, and its panel shows
   what it brings.

Restarting EiN does step 2 for you: at every start EiN links each folder in `/var/lib/modules` that
has a `mod.json` and sets every module up, in the order of their dependencies.

> [!WARNING]
> `mod remove recipes` deletes a module's folder in `/var/lib/modules` along with its link. Keep
> your working copy, and its git history, somewhere else and copy it in.

## Change it and see the change

What you have to do after an edit depends on what you changed:

| You changed                                      | To see it                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| A file in `bin/`                                 | Nothing: the next run uses it                                      |
| A file in `lib/` that a `#!ts` command imports   | `mod setup recipes`, which drops the commands EiN has loaded       |
| `mod.json`: settings, node types, roots, indexes | `mod setup recipes`                                                |
| A new file in `services/` or `pipelines/`        | `mod setup recipes`, then `service start <name>` for a new service |
| A page, or anything it imports                   | `ui-build recipes`, then reload the web page                       |
| `ui/nav.json`                                    | Reload the web page                                                |

EiN keeps a loaded TypeScript command against its file alone, so an edited `lib/` file reaches a
command when the command's own file changes, after `mod setup`, or after EiN restarts.

## Add a page and a sidebar entry

A module's pages are React components. EiN bundles them itself, from the module's files, whenever
modules are set up; there is no build step on your side and nothing is fetched from the network.

1. Name each route and the file that draws it in `mod.json`, as above:
   `"ui": { "routes": { "/recipes": "ui/pages/recipes.tsx" } }`. A route is a path below `/`, of
   literal and `:param` segments, such as `/recipes/:name`.

2. Write the page. Its default export is the component:

   ```tsx
   import { Stack, Table, Title } from '@mantine/core';
   import { EmptyState, PageLoader } from '@ein/ui/components';
   import { useCommand } from '@ein/ui/hooks';

   type Recipe = { path: string; title: string; serves: string };

   export default function Recipes() {
     const { data, loading, error } = useCommand<Recipe[]>('recipe-list');
     if (loading) return <PageLoader />;
     if (error) return <EmptyState title='Recipes could not be read'>{error.message}</EmptyState>;
     if (!data?.length) return <EmptyState title='No recipes yet'>Add one with recipe-add.</EmptyState>;
     return (
       <Stack>
         <Title order={2}>Recipes</Title>
         <Table>
           <Table.Tbody>
             {data.map((recipe) => (
               <Table.Tr key={recipe.path}>
                 <Table.Td>{recipe.title}</Table.Td>
                 <Table.Td>{recipe.serves}</Table.Td>
               </Table.Tr>
             ))}
           </Table.Tbody>
         </Table>
       </Stack>
     );
   }
   ```

   `useCommand` runs a command in the reader's own shell, as JSON, and keeps its answer. A page reads
   and changes the tree only through commands, which is why each part of a module that the Web
   UI shows has a command behind it.

3. Give it a sidebar entry in `ui/nav.json`:

   ```json
   {
     "sidebar": [
       { "id": "recipes.list", "section": "browse", "label": "Recipes", "icon": "tools-kitchen-2", "to": "/recipes", "order": 60 }
     ]
   }
   ```

4. Run `ui-build recipes` and reload the web page. **Recipes** is in the sidebar's **Browse**
   section.

A page imports only what the Web UI lends it, its own files, and anything at all with
`import type`:

| Import                                                                                   | What it is                                                                  |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `react`, `react-dom`                                                                     | React, the one the Web UI runs                                              |
| `@mantine/core`, `@mantine/dates`, `@mantine/hooks`                                      | The Mantine components the interface is built with                          |
| `react-router-dom`                                                                       | Routing: `Link`, `useParams`, `useNavigate`, `useSearchParams` and the like |
| `@preact/signals-react`, `@hello-pangea/dnd`                                             | Signals, and drag and drop                                                  |
| `@ein/ui/components`, `@ein/ui/hooks`, `@ein/ui/lib`, `@ein/ui/signals`, `@ein/ui/theme` | The interface's own parts                                                   |
| `@ein/paths`                                                                             | Core's path names                                                           |
| Your module's files, CSS and CSS modules included                                        | By relative path or through its `imports`                                   |

Anything else stops the build with a message naming the file and the import.

A page writes a date or a time with `formatDateTime`, `formatDate` or `formatTime` from `@ein/ui/lib`,
which take the options `toLocaleString` takes, or with `dateTimeFormat` where it needs an
`Intl.DateTimeFormat`. They follow the reader's **Date and time format**; `toLocaleString` and a
bare `Intl.DateTimeFormat` follow the browser's language instead, which gives an English browser a
12-hour clock. `deno lint` refuses those in a page (the rule `ein/ui-date-locale`): `toLocaleDateString`,
`toLocaleTimeString`, `toLocaleString` on what reads as a date, and an `Intl.DateTimeFormat` without
a locale. A number's `toLocaleString()` stays allowed.

### Where an entry opens a route

A module gives the Web UI entries and routes, nothing more. Each entry says where its route
opens:

| Entry     | Where it appears                                                                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sidebar` | In a section of the sidebar (`main`, `explore`, `browse`, `system`); needs `section`, `label`, `icon` and `to`                                                                                                    |
| `topbar`  | A button in the top bar, or a row of a dropdown it names as `parent`, such as `ui.create`, the **Create** menu                                                                                                    |
| `panels`  | Inside another page, at a `slot` it names, such as `system.tabs` (a tab of the **Status**), `device.tabs` (a tab of a device's page), `nodes.tools` or `settings.views` (a page under **Set up** on **Settings**) |

A top-bar entry's `action` is `{ "navigate": "/recipes" }` for the page, `{ "dialog": "/recipes/new" }`
for the dialog over it, `{ "drawer": … }` for the side drawer and `{ "fullscreen": … }` for over
everything; `{ "run": … }` runs a command line instead, and with `navigate` beside it goes where the
command's answer says. Each entry's `id` is `<module>.<name>`. `icon` is a Tabler icon name. `admin: true` shows
an entry to administrators only, `signedIn: true` to people who are signed in, `group: "<group>"` to that group's
members and administrators, and `app: true` only in the EiN app for Android, never in a browser. `ui-nav` prints the
navigation as the reader gets it, with a warning for each entry it left out and why.

The administrator and each person can move, rename and hide a module's entries;
[Your sidebar and top bar](../guide/customizing.md) shows how.

To make nodes of your type into links wherever EiN shows them, in search results, completions and
the node explorer, name the route that opens one in `mod.json`:
`"ui": { "open": { "recipe": "/recipes/{name}" } }`. `{name}` is the node's last path segment,
`{parent}` the one before it and `{path}` its whole path. Files of your own under a folder open the
same way by the folder: `"/etc/things/": "/things/{rest}"`
([`ui.open`](manifest.md#uiopen)).

A page that draws something to drag and zoom, as a map or a diagram, takes the gestures from
`usePanZoom` in `@ein/ui/hooks`: dragging, pinching, the wheel about the cursor and a double tap,
with `ignore` for what on the drawing keeps a press to itself, such as a card dragged on it. The
family tree draws with it, and so does the Automation module's graph.

## Add a setting

A module owns settings by listing them in `mod.json` under `config.options`. Setup adds them to
**Settings** and `config`; the values live in `/etc/config` and each person's `~/.config`, and every
shell sees them as environment variables.

```json
"config": {
  "options": [
    {
      "key": "CFG_RECIPES_DEFAULT_SERVES",
      "scope": "system",
      "type": "number",
      "default": "4",
      "label": "Servings when none is given",
      "description": "How many a recipe serves when it was added without saying.",
      "group": "Recipes"
    }
  ]
}
```

A command reads it as `$CFG_RECIPES_DEFAULT_SERVES`, or `cmd.env.CFG_RECIPES_DEFAULT_SERVES`. A
`user` setting is named `CFG_USER_…`, and a key to another service is a `secret` named `CFG_…_KEY`,
which no shell sees. [The module manifest](manifest.md) lists every key of an option, and
[Configuration](../admin/configuration.md) explains how the values are layered.

A module that wants a setting, its own or core's, to have a value of its choosing writes it in
`etc/config`, as `export KEY='value'` lines. Setup links the file as `/etc/config.d/<name>`; a value
the administrator sets wins over it. The `ems` module's names its text embedder this way:

```bash
export CFG_TEXT_EMBEDDER='ems-text-embed'
```

### Give a settings view

Settings that belong together, such as a service's address and its key, are easier to set up on a
page of their own than one by one in their category. A module gives such a page as a route and a
`settings.views` panel in `ui/nav.json`; **Settings → System** lists it under **Set up**, before the
categories, and the module's own **Settings** tab under **Settings → Modules** shows it before its
settings. `description` is the line under its name:

```json
"panels": [
  {
    "id": "recipes.source",
    "slot": "settings.views",
    "label": "Recipe source",
    "description": "Where new recipes come from, and the key it takes.",
    "icon": "chef-hat",
    "route": "/settings/recipe-source",
    "admin": true
  }
]
```

The page reads the settings with `useConfig('system')` from `@ein/ui/hooks` and saves them with its
`saveAll({ KEY: 'value', … })` or `resetAll([KEY, …])`, one `config set KEY=VALUE…` or
`config unset KEY…`: all are checked before any is written, and a service that reads several
restarts once. `SaveBar` and `useViewSave` from `@ein/ui/components` give it the Save and Cancel
every such page has and say what the save restarted or why it failed; `settingOf` picks one setting
from the table, and `SettingSource` draws its badge. It saves only what it changed, so a setting
left alone keeps its source. The page and the categories read the same settings, and a save
through either is seen by the other at once.

## Run something in the background

A service is a script EiN keeps running: a folder `services/<name>/` with a `start.sh` and a
`config.json`. Setup registers it, and enables it the first time it does: an administrator who
disables it keeps it disabled. EiN starts the enabled services when it starts, and
`service start <name>` starts one now.

```json
{
  "description": "Checks the recipes every hour",
  "restartPolicy": "on-failure"
}
```

```bash
# services/recipe-check/start.sh
while true; do
  recipe-list > /dev/null
  sleep 3600
done
```

| Key             | What it does                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `description`   | One line for the **Status**'s services and `service list`                                                         |
| `restartPolicy` | `on-failure`, `always` or `never`; with a restart policy EiN starts a failed service again                        |
| `maxRestarts`   | How many restarts within `restartWindow` before the service stays failed; 3 by default                            |
| `restartWindow` | That window, in milliseconds; 60000 by default                                                                    |
| `stopTimeout`   | How long a stopping script may take before it is closed, in milliseconds; 5000 by default                         |
| `env`           | Environment variables for the script                                                                              |
| `statusCommand` | A command answering the service's health in one line, shown beside its status                                     |
| `checkCommand`  | A command answering checks for `health`, as JSON `[{ name, state, reason }]` with `ok`, `warn` or `fail`          |
| `gaugeCommand`  | A command answering meters for `top` and the **Status**, as JSON `[{ label, percent?, value }]`                   |
| `workClass`     | `background` for a service whose work may wait behind people's: its database connections leave some free for them |

Module services use `"restartPolicy": "on-failure"`. A service whose name the module stops
shipping is stopped and removed at the next setup. [Services and logs](../admin/services-logs.md)
shows where a service's output goes.

## Talk live with a page

A module's service and its pages can talk while both run, such as a game several people play or a
board they draw on at once, through two node types of which nothing is kept:

- A **`socket`** is a conversation: the service listens on it, and each page connects to it, each
  connection carrying messages both ways between that page and the service alone.
- A **`stream`** is live bytes from one writer to any number of readers, such as a camera's video.

A page holds either open over a WebSocket at the node's address under `/file/`, with
`openNodeSocket(path, mode)` from `@ein/ui/lib`, which gives a `WebSocket` on the page's own host,
`ws:` or `wss:` as the page is, with its messages as `ArrayBuffer`s. The service opens the same node
as it opens a file.

### A conversation: a socket

The service makes the socket where its pages find it, open to the accounts that may join, and
listens on it:

```bash
# in EiN's terminal, or the service's setup
mknode -t socket -m 0666 /tmp/recipes/board
```

```ts
import { isSocketListener, type SocketConnection } from '@ein/client';

const listener = await cmd.sys.vfs.open(cmd.access, '/tmp/recipes/board', { mode: 'r' });
if (!isSocketListener(listener)) throw new Error('not a socket');
for (let connection = await listener.accept(); connection; connection = await listener.accept()) void answer(connection);

// Answers each message with itself, until the page leaves.
async function answer(connection: SocketConnection) {
  for (let message = await connection.read(65536); message.length > 0; message = await connection.read(65536)) await connection.write(message);
}
```

The page connects with `rw`:

```tsx
import { NODE_SOCKET_CLOSE, openNodeSocket } from '@ein/ui/lib';

const board = openNodeSocket('/tmp/recipes/board', 'rw');
board.onopen = () => board.send(new TextEncoder().encode('hello'));
board.onmessage = (event) => show(new Uint8Array(event.data));
board.onclose = (event) => {
  if (event.code === NODE_SOCKET_CLOSE.ended) startOver();
};
```

- **Who listens**: the socket's owner, or an administrator, opening it to read. A socket has one
  listener at a time; another is refused. A module's service runs as the administrator, so it
  listens on any socket it makes.
- **Who connects**: an account that may both read and write the socket, at `/file/<path>?mode=rw`,
  or with any mode that writes when it opens the node itself (`vfs.open` with `mode: 'w'`). While
  nobody listens the socket is closed with 4503.
- **`accept`** answers each connection in turn, and `undefined` once the listener is closed or the
  node removed. A connection's `peer` says who opened it: the account's `uid` and `gid`, and the
  `invitation` it came through (below).
- **Messages** are binary, at most 8 MiB each, and arrive whole, each `send` one message and each
  `read` one message when its size holds it. What a page sends before the service accepts it waits
  in its connection.
- **Nobody waits for the other end.** An end that falls more than 8 MiB behind lets the connection
  go: the page's socket closes with 4001.
- **Either end closing ends the connection**: the page's close makes the service's `read` answer an
  empty message, and the service's `close` closes the page's socket with 1000. Closing the listener,
  or removing the node, ends every connection.

### One writer, many readers: a stream

A stream carries one direction: the service writes it and every page reading it is given what it
writes from then on, or a page writes it for the service to read.

```bash
# in the service: the board's moves, for everyone watching
mknode -t stream -m 0644 /tmp/recipes/moves
```

```tsx
const moves = openNodeSocket('/tmp/recipes/moves', 'r');
moves.onmessage = (event) => show(new Uint8Array(event.data));
```

- **`mode=w`**: the socket is the stream's writer for as long as it is open. Each binary message is
  one write, and closing the socket ends the stream for its readers. A stream has one writer at a
  time: a second socket is closed with 4409.
- **`mode=r`**: each write comes as one binary message. A reader starts at the moment it opens, or
  at the latest point the writer marked as a start; what came before is gone. The writer's close
  closes the reader's socket with 1000, and the reader opens it again to go on.
- **Messages** are binary, and at most 8 MiB each. A reader is given each write whole, so between a
  page writing over a socket and a page reading over one, a message arrives as it was sent. A writer
  that writes in pieces of its own, such as `cat` or a program over SFTP, may pass on several
  messages as one write or one as several: give the messages a frame of your own, such as a length
  before each, when they pass through one.
- **Nobody waits for a reader.** A reader that falls more than 8 MiB behind is given what it holds
  and then closed with 4001.
- A stream is read or written, never both: a conversation is a socket.

### Who may open them, and how they end

Who may open either is decided as for any `/file/` address: as the account signed in, with the
node's own permissions, and only from EiN's own pages; a page from any other address cannot use the
sign-in. A file ticket (`?ticket=`) reads a stream instead, and never writes, and an invitation
(`?invite=`) opens its own nodes from a page at any address (below). `nodeSocketUrl(path, mode)`
gives a socket's address without opening it. Any other node type is refused.

What could not open, and how a socket ended, is in its close code, with a reason a page can show.
All of them are in `NODE_SOCKET_CLOSE`:

| Code | `NODE_SOCKET_CLOSE` | What happened                                                                                  |
| ---- | ------------------- | ---------------------------------------------------------------------------------------------- |
| 1000 | `ended`             | The stream's writer closed, the node was removed under a reader, or the connection ended       |
| 1001 |                     | EiN is stopping                                                                                |
| 1003 | `unsupported`       | A text message, or a message from a stream's reader                                            |
| 1009 | `tooBig`            | A message over 8 MiB                                                                           |
| 1011 | `failed`            | Something failed in EiN                                                                        |
| 4001 | `behind`            | The reader, or one end of a connection, fell more than 8 MiB behind                            |
| 4400 | `badRequest`        | No `mode`, a mode the node does not open with, or a node that is neither a stream nor a socket |
| 4401 | `signIn`            | Not signed in, where visitors may not browse                                                   |
| 4403 | `forbidden`         | The account may not open the node in that mode, or the ticket or invitation does not open it   |
| 4404 | `notFound`          | Nothing at the path                                                                            |
| 4409 | `conflict`          | The stream has a writer already                                                                |
| 4410 | `gone`              | The node was removed under its writer, or the invitation expired or was turned off             |
| 4503 | `unavailable`       | Nobody listens on the socket, or too many connections wait for its listener                    |

### Someone with no account here

Someone without an account here, or a page served by another EiN, takes part through an
[invitation](../admin/permissions.md#invitations): a token that opens the nodes it names, a socket to
connect to or a stream to read or to write, as the account that made it, until it expires or is
turned off. The service makes one when someone is invited, and hands its link to whoever invites
them:

```bash
# in the service: someone from elsewhere is invited to the board
invitation create --connect /tmp/recipes/board
# /__invite/Xq3…  opens rw /tmp/recipes/board until …
```

It works for 24 hours unless `--expires` says otherwise. With `JSON_OUTPUT=1` in front it answers
the token, the link and the nodes as JSON. Either way it gives the token once: only a hash of it is
kept. Put the server's own address in front of the link, `https://ein.example/__invite/Xq3…`, and
send that. A page that is handed it, on this EiN or another, asks the link what it opens and opens
each node with the token instead of a sign-in:

```tsx
import { fetchInvitation, openNodeSocket } from '@ein/ui/lib';

const invitation = await fetchInvitation(link);
const sockets = invitation.nodes.map((node) => openNodeSocket(node.path, node.mode, { origin: invitation.origin, invite: invitation.token }));
```

`fetchInvitation` reads `GET <origin>/__invite/<token>`, which answers a page at any address with the
nodes and the expiry, `{ "nodes": [{ "path": …, "mode": "rw" }], "expires": "2026-…Z" }`, or `404`
once the invitation opens nothing; `parseInvitationLink` splits a link into its EiN and token without
asking. The socket is `wss://ein.example/file/<path>?mode=<mode>&invite=<token>`: on it EiN reads no
cookie and does not ask which page it came from, and opens only the invitation's nodes, each in its
own mode. A connection made with it is its maker's, and its `peer.invitation` is the invitation's
id, so the service can tell a guest from the maker. When the invitation expires or is turned off,
its sockets close with 4410.

`openNodeSocket`, `nodeSocketUrl` and `NODE_SOCKET_CLOSE` came with core's module contract 0.15.71;
invitations, `fetchInvitation`, `parseInvitationLink` and `openNodeSocket`'s `origin` and `invite`
with 0.15.73; and socket nodes, `isSocketListener`, `isSocketConnection` and `rw` with 0.15.74: give
a module that uses them `"coreApi": "^0.15.74"`.

## React to changes with pipelines

A pipeline runs commands when something happens in the tree, such as a photo's metadata being read.
Each file in `pipelines/` defines one:

```yaml
name: recipe-photo
description: Link a photo of a dish to its recipe

trigger:
  on: media.metadata.extracted

steps:
  link:
    command: recipe-link $NODE_PATH
    description: Find the recipe the photo shows

options:
  maxAttempts: 2
  priority: 5
```

The events come from the modules that emit them: `media.metadata.extracted` is the Media module's,
so this module would list `media` in its `dependencies`. [Changes and pipelines](../concepts/pipelines.md)
explains triggers and steps, and [Processing and pipelines](../admin/processing.md) how to watch them
run. A definition the module stops shipping is removed at the next setup.

## Plug into search, the home page and other places

Core asks for some things by a command's name, so a module provides them by naming a command in
`bin/` after them. No manifest field is involved, and core never names your module:

| Command name     | What core does with it                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `search-<x>`     | `search` asks it for hits; it answers `--kinds` with what it finds (`{ "kinds": ["recipe"] }`) |
| `news-<x>`       | The home page's news: what was added lately, `--limit N`                                       |
| `events-<x>`     | The home page's coming events, `--today YYYY-MM-DD --days-ahead A --days-past P --limit N`     |
| `onthisday-<x>`  | The home page's "on this day", `MM-DD --limit N`                                               |
| `members-<type>` | How a node of that type lists its members, for `search --under` and `members`                  |
| `subject-<kind>` | The media a subject has, for `search --subject <kind>:<ref>`                                   |

Each is run with `JSON_OUTPUT=1` and answers a shape that `@ein/api` or `@ein/client` declares.
These prefixes are reserved: a command so named is asked, so do not use them for anything else.
For the home page, each entry carries a `title`, the `route` of your own page that draws it, and the
`path` of the node it is about.

Other jobs only one command may do are chosen by a setting the module sets in its `etc/config`:
`CFG_SEARCH_PARSER` reads the words typed in the search box, `CFG_COMMAND_FINDER` finds commands
by what they do, and `CFG_LANGUAGE_MODEL` and `CFG_TEXT_EMBEDDER` name the commands a module runs
for a language model or text vectors. The settings are in
[the settings reference](../reference/settings.md).

With the Assistant installed, what the assistant knows about your module's commands, and how to
give it more, is in [Teaching the assistant](../assistant/teaching.md). A module that brings a kind
of device registers a driver from one of its services; see [Writing a driver](drivers.md).

## Offer cards to dashboards

With the [Dashboards](../dashboard/index.md) module installed, a person puts cards on a dashboard
from those the installed modules offer. A card is a route of your module drawn inside a tile, and
the module offers it in `etc/dashboard.d/cards.json`, which `mod setup` links as
`/etc/dashboard.d/<module>/cards.json`. Nothing else is needed: the dashboard names no module, and
your module does not depend on it. The Todo module's list card:

```json
[
  {
    "name": "list",
    "label": "Todo list",
    "description": "One list's items not done yet, late ones first and then by when they are due.",
    "icon": "list-check",
    "color": "yellow",
    "route": "/cards/todo/list",
    "size": [4, 5],
    "min": [3, 3],
    "params": {
      "type": "object",
      "required": ["list"],
      "properties": {
        "list": { "type": "string", "format": "path", "title": "List", "x-choices": { "command": "todo-lists", "value": "path", "label": "title" } },
        "who": { "type": "boolean", "title": "Who is to do each", "default": true }
      }
    }
  }
]
```

| Field         | What it is                                                                                        | Default     |
| ------------- | ------------------------------------------------------------------------------------------------- | ----------- |
| `name`        | Lower case letters, digits and `-`; the card is `<module>.<name>`                                 | required    |
| `label`       | What the picker and the tile's header call it                                                     | required    |
| `route`       | The route that draws it, without a query; one of your `ui.routes`                                 | required    |
| `size`        | `[columns, rows]` a new one takes, of a dashboard 12 columns wide                                 | required    |
| `min`         | The smallest `[columns, rows]` it may be made                                                     | `[1, 1]`    |
| `description` | One sentence in the picker                                                                        | the label   |
| `icon`        | A [Tabler](https://tabler.io/icons) icon name                                                     | `puzzle`    |
| `color`       | A Mantine colour name, the kind colour of what it shows                                           | `gray`      |
| `frame`       | `titled` draws a header with its icon and title above the route; `plain` gives the route the tile | `titled`    |
| `params`      | A JSON Schema of an object: what a person sets, passed to the route in its query                  | no settings |

Each parameter has a `type` (`string`, `number`, `integer`, `boolean` or `array` of strings or
numbers), and may have a `title`, `description`, `default`, `minimum`, `maximum`, and `enum` or
`oneOf` (`{ "const": …, "title": … }`) for a fixed choice. `format` picks the input: `path` for a
node, `markdown`, `timezone`, `date` or `time`. `x-choices` lists the choices from a read command:
the form runs `command` as the person editing, with `JSON_OUTPUT=1`, and takes `value` and `label`
from each entry of its answer, or of the list at the key path `items` when the answer is not a list;
`{other}` in `command` is another parameter's value, so `"command": "device-show {device}",
"items": "endpointList"` lists a chosen device's endpoints. `where` keeps the entries whose fields
have one of the given values: `"where": { "type": "control" }` lists only its controls. The
form shows a hundred choices at a time and narrows them as the person types, so a command may list
thousands, as the Västtrafik module's `vt-stops` does. `dashboard-card-add` checks a card's
values against its `params` before it puts it on.

The route is drawn with the values in its query, `/cards/todo/list?list=%2Fgroups%2F…&who=true`,
a list as the key repeated. Keep card routes under `/cards/<module>/`, a first segment none of your
pages use, and draw them to fill the tile: the tile is a size container, so `cqmin` units and
`clamp()` scale text with it. On a dashboard whose cards are pieces of the hat tiling, a `plain`
card is given the whole piece, jagged edge and all, and the tile says in `--dash-inset-top`,
`--dash-inset-right`, `--dash-inset-bottom` and `--dash-inset-left` how far in its words keep clear
of that edge: fill the piece with a picture or a colour, and pad the words with, say,
`padding: var(--dash-inset-top, 0.8em) var(--dash-inset-right, 1em) var(--dash-inset-bottom, 0.8em)
var(--dash-inset-left, 1em)`, which keeps your own padding on rounded cards. A card reads its own data as whoever looks at the dashboard and keeps
itself current, with `useNodeEvents` for what changes by events or `usePolledCommand` for what
changes on a clock. On a screen opened from a [display link](../dashboard/screens.md) nobody is
signed in (`isAuthenticated` is false): draw no controls there and link nowhere, since every write
is refused. `dashboard-cards` lists what the modules offer and says what in a list could not be read.

## Offer games

With the [Games](../games/index.md) module installed, the **Games** page shows a card for each game
the installed game modules have, and plays each on a page that is the same for every game. A game
module brings only its engine, the commands that list and fetch its games, and the routes that hand
the engine to Games. Games, its commands and its documentation never name a game module, and nothing
of the game module's is in EiN: it depends on Games, as any module depends on another
([Use another module](#use-another-module)):

```json
"dependencies": { "games": "^0.1.0" }
```

Its pages are drawn by Games' components, which takes `"coreApi": "^0.15.75"` or later.

Games exports the contract a game module writes against: `@games/api`, the data (`GamesDropIn`,
`GameEntry`, `DropRule`, `MultiplayerSpec`, `ServerInfo`); `@games/adapter`, the engine's interface
(`GameAdapter`); `@games/page` and `@games/card`, the play page and the dashboard's card;
`@games/net` and `@games/host`, playing together; and `@games/png`, for covers. The examples below
are of `rover`, a module whose games are called Star Rover.

### The drop-in

A game module says what it is in `etc/games.d/games.json`, which `mod setup` links as
`/etc/games.d/rover/games.json`. Games reads every module's drop-in there, without running the
module:

```json
{
  "title": "Star Rover",
  "icon": "rocket",
  "route": "/rover",
  "list": "rover-list",
  "fetch": "rover-fetch",
  "folder": "/groups/users/rover",
  "drops": [
    { "place": "own-folder", "label": "a Star Rover game", "name": "\\.rvr$", "magic": [{ "at": 0, "text": "RVR1" }] },
    { "place": "module", "label": "Star Rover's game data", "contains": "rover.dat" },
    { "place": "game", "label": "a Star Rover map", "name": "\\.map$", "into": "maps", "families": ["rover2"] }
  ],
  "multiplayer": {
    "modes": [{ "value": "deathmatch", "label": "Deathmatch" }, { "value": "coop", "label": "Cooperative" }],
    "maxPlayers": 8,
    "defaultPlayers": 4,
    "defaultMaps": ["arena3", "level1"],
    "transport": "server"
  }
}
```

| Field         | What it is                                                                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | The module's name for its games, as the Games page and its chooser of a dropped file say it                                                                                |
| `icon`        | A [Tabler](https://tabler.io/icons) icon name, or a picture's path in EiN's tree; a card without a cover stands with it                                                    |
| `route`       | Where its games are played: a game's page is `<route>/<id>`, which the module's `mod.json` routes. A path, without a query or a `/` at its end                             |
| `list`        | The command that lists its games, run as the person looking ([The list command](#the-list-command))                                                                        |
| `fetch`       | The command that fetches an offered game, given its id; only an administrator is offered it, since it downloads. Without it, offered games are shown and cannot be fetched |
| `folder`      | Where its games are, an absolute path, such as a folder in the household's shared home; a dropped thing placed `module` or `own-folder` goes into it                       |
| `drops`       | The rules it recognises dropped files by ([Dropped files](#dropped-files))                                                                                                 |
| `multiplayer` | How its games are played together, when they are ([Playing together](#playing-together))                                                                                   |

A drop-in with one wrong part is wrong as a whole: `games-list` leaves the module out and says why
among its problems, which the Games page shows its administrator.

### The list command

`games-list` runs every module's `list` command as the caller, with `JSON_OUTPUT=1` in front, and
reads its answer as a list of `GameEntry`, one for each game, installed or offered. The answer may
hold more of a game, what the module's own page needs to start it; Games reads only these:

| Field         | What it is                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | Which game it is in the module, the last part of its page's route; unique in the module. Required                                                         |
| `title`       | Its name on its card and its page. Required                                                                                                               |
| `state`       | `installed`, here and playable, or `offered`, free to fetch with `fetch`. Required                                                                        |
| `detail`      | A line under an installed game's title: what it is, how large                                                                                             |
| `description` | What the game is, a sentence or two, shown under its title on its page; for the games the module knows                                                    |
| `about`       | What an offered game is                                                                                                                                   |
| `download`    | The bytes fetching an offered game downloads                                                                                                              |
| `size`        | An installed game's bytes                                                                                                                                 |
| `cover`       | Its picture, at the game's own shape: a path in EiN's tree, or a `data:` URL                                                                              |
| `path`        | An installed game's folder or file. **Delete game** removes it, and a dropped file placed `game` goes into it; without it neither is offered              |
| `family`      | What plays it, when the module has more than one engine (`rover`, `rover2`): drop rules name families, and an invitation is played with a game of its own |
| `maps`        | An installed game's maps by name (`level1`, `arena3`): what it is hosted on, and started on                                                               |
| `hostable`    | Whether it can be hosted for others to join: the module plays together, and the game has maps                                                             |
| `sealed`      | A game that reads nothing but its own files, as a shareware episode does: dropped files are never put into it                                             |

```json
[
  {
    "id": "classic",
    "title": "Star Rover",
    "state": "installed",
    "detail": "The first episode, 12 MB",
    "size": 12582912,
    "cover": "data:image/png;base64,iVBORw0…",
    "path": "/groups/users/rover/classic",
    "family": "rover",
    "maps": ["level1", "level2", "arena3"],
    "hostable": true
  },
  { "id": "return", "title": "Star Rover: The Return", "state": "offered", "about": "The free demo of the second game", "download": 48234496 }
]
```

An entry without an `id`, a `title` or a `state`, or with an `id` listed before, is left out and
named among the problems. A module that decodes a game's picture from the game's own files encodes
it with `@games/png`, which uses nothing but web standards and so runs in a command:
`pngDataUrl(width, height, rgba)` answers a `data:` URL from RGBA pixels a row after another, and
`encodePng` the PNG file's bytes.

### The page and the card

A game's page is a route of the module's own, since a route cannot load another module's engine:

```json
"ui": {
  "routes": {
    "/rover/:game": "ui/pages/play.tsx",
    "/cards/rover/demo": "ui/cards/demo.tsx"
  }
}
```

Each file is little more than Games' component, given the module's adapter:

```tsx
// ui/pages/play.tsx: a game's page
import { GamePage } from '@games/page';
import { adapter } from '../adapter.ts';

export { gamePageHandle as handle } from '@games/page';
export default function Play() {
  return <GamePage adapter={adapter} />;
}
```

```tsx
// ui/cards/demo.tsx: the dashboard's card
import { DemoCard } from '@games/card';
import { adapter } from '../adapter.ts';

export default function Demo() {
  return <DemoCard adapter={adapter} />;
}
```

`GamePage` is everything on a game's page: the header with the cover, the trail back to **Games**,
**Play on a map**, sound, fullscreen, **Delete game**, **Fetch** for an offered game and playing
together; the frame with **Play**, loading and errors, and the line under it; the keys, the mouse
and the saves. `gamePageHandle` draws it edge to edge. `DemoCard` plays the game its `game` query
parameter names, else the first installed, with `demo: true`: no sound, no keys, no mouse. The
module offers it to dashboards as any card ([Offer cards to dashboards](#offer-cards-to-dashboards)),
with the game as a parameter its list command fills:

```json
"params": {
  "type": "object",
  "properties": {
    "game": { "type": "string", "title": "Game", "x-choices": { "command": "rover-list", "value": "id", "label": "title", "where": { "state": "installed" } } }
  }
}
```

### The adapter

The module's engine is behind one interface, `GameAdapter` from `@games/adapter`, which the page and
the card drive:

```ts
import type { GameAdapter } from '@games/adapter';
import type { GameEntry } from '@games/api';
import { execCommand } from '@ein/ui/signals';
import { startRover } from './engine.ts';

/** A game as rover-list answers it, with what the engine needs to start it. */
export type RoverGame = GameEntry & { data: string[] };

export const adapter: GameAdapter<RoverGame> = {
  module: 'rover',
  title: 'Star Rover',
  list: () => execCommand<RoverGame[]>('rover-list'),
  start: startRover,
  help: 'The mouse steers and fires, W A S D move, Space jumps, Escape opens the menu.',
  pointer: true,
  kept: { pattern: /^(rover\.cfg|save\/s\d+\/[^/]+)$/, depth: 2 },
  startsOnMap: true,
};
```

| Member        | What it is for                                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `module`      | The module's name, as its drop-in's folder in `/etc/games.d` is named                                                                                                                                                                                |
| `title`       | What the page says before it knows the game                                                                                                                                                                                                          |
| `list()`      | The module's games, with all `start` needs: its list command's answer                                                                                                                                                                                |
| `start()`     | Load the engine and the game's files, and start it; answers a `RunningGame`                                                                                                                                                                          |
| `help`        | The line under the frame: how the game is played                                                                                                                                                                                                     |
| `pointer`     | Whether the game is played with the mouse: a click on it then hands it the mouse (the browser's pointer lock), and fullscreen does too                                                                                                               |
| `kept`        | The player's files the game keeps, by their paths in the player's saves folder: those `pattern` matches, found `depth` folders deep; those `shared` matches too are kept once for every game of the module. None for a game that keeps nothing       |
| `startsOnMap` | Whether a game can start on one of its `maps`, which the page then offers as **Play on a map**                                                                                                                                                       |
| `frame`       | The shape the game is always shown at, whatever size it draws at: 640 by 480 for an engine drawing 320 by 200 for a 4:3 screen. Without it the shape is each frame's own, starting at 640 by 480, so a wider video mode the player picks shows wider |

`start` is given `StartOptions`:

| Option   | What it is                                                                                                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `game`   | The entry, as `list` answered it                                                                                                                                                                                               |
| `sound`  | The game's sound on Web Audio, opened in the click on **Play**: `effects(render)` pulls the samples the engine mixes, `music(folder, tracks)` plays a track's file, and an engine's own nodes go to `output`. None on the card |
| `log`    | Where the game's printed lines go, one at a time; the last few are shown when it fails                                                                                                                                         |
| `kept`   | The player's kept files, each its path in the saves folder and its bytes, for the game to read as it starts                                                                                                                    |
| `onKeep` | Call it with each file the game writes that is to be kept, a save or its settings; with `folder`, a save slot's folder whose files replace all it had. None without an account                                                 |
| `name`   | The player's account's name, to play under when they have none of their own in the game                                                                                                                                        |
| `map`    | The map to start on, with `startsOnMap`                                                                                                                                                                                        |
| `online` | A hosted game to play in: `network`, the `Network` to it, and `address`, what the engine connects to ([Playing together](#playing-together))                                                                                   |
| `demo`   | Play the game's own demos, as it does when nobody plays, for the card                                                                                                                                                          |

The page runs the `RunningGame` it answers:

| Member                              | What it is for                                                                                                                                                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `step()`                            | Run the game on, once each animation frame, which stop while the page is hidden. Throws when the game ends: what `quitted()` recognises when the player chose Quit, anything else when it failed                             |
| `frames()`                          | How many frames the game has drawn; a new number is a new frame to copy                                                                                                                                                      |
| `width()`, `height()`               | The frame's size, which the game's video options may change                                                                                                                                                                  |
| `draw(image)`                       | Copy the current frame into `image`, an `ImageData` of that size                                                                                                                                                             |
| `key(pressed, code)`                | A key (`KeyboardEvent.code`) went down or up; answers whether the game takes it, which the page then keeps from EiN                                                                                                          |
| `button(pressed, button)`           | A mouse button went down or up while the game has the mouse; answers whether it takes it                                                                                                                                     |
| `mouse(dx, dy)`                     | The mouse moved while the game has it                                                                                                                                                                                        |
| `wheel(up)`                         | The wheel turned while the game has the mouse                                                                                                                                                                                |
| `keep()`                            | Write the player's settings now, as the game does on Quit: the page is closing, or stops the game                                                                                                                            |
| `disconnect()`                      | Leave the hosted game, telling its server                                                                                                                                                                                    |
| `menu()`                            | Whether a menu of the game's or its console is up, which the player works without the mouse. Optional: with it, the game has the mouse on the page only while none is up, and the browser's own **Escape** opens its menu    |
| `fullscreen()`, `setFullscreen(on)` | Whether the game is to be shown fullscreen, as its own video menu sets it. Optional: the page follows it, and sets it for **F11**, its button, or the browser leaving fullscreen itself. Without them the page keeps its own |

`quitted(error)` recognises an engine built with Emscripten exiting with status 0, which Quit in its
menu does; the page then shows **Play** again. Every key and button a game took down is let go of
for it when the frame loses the focus or the game the mouse. Fullscreen, **Escape** and **F11**
are the game's (the keyboard lock of Chrome and Edge, over HTTPS), and a game played with the mouse keeps it
until fullscreen is turned off or the game ends.

### Saves

What the game keeps of a player is in their home, `~/.rover/<game id>`, a folder for each game, so a
save is only ever loaded into the game it was made in. The page makes the folder, reads the files
`kept` matches into `StartOptions.kept` before the game starts, and writes each `onKeep` hands it
in the order the game wrote them. A save slot written as a whole (`{ files, folder: 'save/s1' }`)
empties the slot's folder first. Files `kept.shared` matches as well are kept once for every game of
the module, in `~/.rover` itself: settings a player has whatever they play, as
`kept: { pattern: /^(rover\.cfg|save\/s\d+\/[^/]+)$/, depth: 2, shared: /^rover\.cfg$/ }` keeps the
key bindings in `~/.rover/rover.cfg`. Someone not signed in keeps nothing.

### Dropped files

Each rule in `drops` is tried on each thing dropped on the Games page, a file or a folder, in the
browser, before anything is uploaded. Every condition a rule gives must hold, and it gives at least
one of `name`, `contains` and `magic`:

| Field      | What it is                                                                                                                                                                                                                                                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `place`    | Where a match goes: `module`, into the module's `folder` as it was dropped, a folder by its name; `own-folder`, a file into a folder of its own in `folder`, named after the file without its extension (a game that is one file); `game`, into an installed game's `path` |
| `label`    | What the match is, in the chooser and the notice: `a Star Rover map`. Required                                                                                                                                                                                             |
| `name`     | A regular expression the file's or the folder's name matches, without regard to case                                                                                                                                                                                       |
| `contains` | A dropped folder: the name of a file at its top, without regard to case                                                                                                                                                                                                    |
| `magic`    | A dropped file: bytes it starts with, any one of a list of `{ "at": offset, "text": "RVR1" }` (printable ASCII) or `{ "at": offset, "hex": "52565231" }`                                                                                                                   |
| `into`     | With `game`: the folder under the game's `path` it goes into, such as `maps`                                                                                                                                                                                               |
| `families` | With `game`: the families of the games that take it; every installed game of the module's when not given                                                                                                                                                                   |

A `game` rule is a place for each installed game it fits, and none when no game fits. When exactly
one place holds for a thing, it is uploaded there; when several do, across rules, games and modules,
or none, the person chooses: among those that hold, or, when none does, any module's folder and any
installed game. Nothing starts by itself.

### Playing together

A game is hosted, joined and stopped by Games' commands, the same for every module:
`games-host <module> <game> [map] --max N --mode M`, `games-servers`, `games-join <id>`,
`games-invite <id>` and `games-stop <id>`. A hosted game is a folder,
`/groups/users/games/servers/<module>/<id>`, with its `server.json` (`ServerInfo`: its game, map,
mode, who hosted it, its state and players) and one socket node, `socket`, which each player's page
connects to with `rw`, or with an invitation from another EiN
([Talk live with a page](#talk-live-with-a-page)). The service that runs the module's games makes
the module's folder, which is how `games-host` knows the service runs, and runs each game
`games-host` asks for in it.

The drop-in's `multiplayer` says how:

| Field            | What it is                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modes`          | The ways a game is hosted, `{ "value", "label" }`: `value` is what the module's server takes, `label` what the page says. The first is the default |
| `maxPlayers`     | The most players a game is hosted for, from 2                                                                                                      |
| `defaultPlayers` | The players a host is offered first, from 2 to `maxPlayers`                                                                                        |
| `defaultMaps`    | The maps offered first, in order, when a game has them; else its first                                                                             |
| `transport`      | `server`, the players play against a server the module's own service runs; `relay`, they play peer to peer, through Games' `games-relay`           |

Either way a link carries one datagram in each message. The engine's socket layer hands its
datagrams to a `Network` from `@games/net` in place of UDP, and reads them from it:
`open(port)` (0 for a free port), `close(port)`, `send(from, ip, to, data)`, `recv(port)`, which
answers `{ ip, port, data }` or nothing, and `waiting(port)`. An address is one number, as
`addressNumber('10.66.0.1')` and `addressText` turn it. A socket keeps 256 datagrams unread before
it drops the oldest, and a datagram for nobody is dropped, as UDP drops it.

#### Against a server

Each message is a frame: the port the datagram is from and the port it is for, two bytes each,
big-endian (`FRAME_HEADER`, 4 bytes), then its bytes, at most 65,535. `frame(from, to, data)` and
`unframe(message)` make and read one. A player sees the server at `SERVER_ADDRESS`, `10.66.0.1`,
which is `online.address`: the page's `Network` sends every datagram up the link, whatever address
it is for, and gives every one that comes down as from that address.

The module's own service runs its games with `GameServers` from `@games/host` and a `ServerEngine`
of its own. The service is a command with `admin: true` and `daemon: true` in its `spec`, run by
`services/rover-server/start.sh`:

```ts
#!ts
/** rover-server — the rover-server service: runs every hosted Star Rover game until it is stopped. */
import type { CmdReturn, Command } from '@ein/client';
import { GameServers } from '@games/host';
import { roverEngine } from '@rover/server';

const roverServer = async (cmd: Command): CmdReturn => {
  const stopped = new Promise<void>((resolve) => cmd.onInterrupt(resolve));
  await new GameServers(cmd, ['rover'], roverEngine()).run(stopped);
  return 0;
};

roverServer.spec = {
  name: 'rover-server',
  admin: true,
  daemon: true,
  effect: 'write' as const,
  json: false,
  description: 'Run the Star Rover games hosted here (the rover-server service)',
  args: [],
  flags: [],
};

export default roverServer;
```

Its `start.sh` is the one line `rover-server`, and its `config.json` says what it is and how to
count what it runs, as Games' own `games-relay` does:

```json
{
  "description": "Runs the Star Rover games hosted here",
  "restartPolicy": "on-failure",
  "statusCommand": "games-servers --module rover --count"
}
```

`GameServers` does everything but the game: it makes the module's folder and empties it as it
starts, starts each game whose `server.json` says `starting` and marks it `running` once it runs,
stops one asked to stop (`games-stop` leaves a `stop` file in its folder) or whose folder has gone, stops one nobody has played for five
minutes, and keeps a failed one listed for a minute with why. It makes each game's socket and
listens on it. Whoever connects sits down at an address of the game's, `10.66.0.2`, `10.66.0.3` and
on (`playerAddress(n)`), kept by their seat's name, the account's or `guest` for an invitation's,
with `-2`, `-3` for another of the same, so a player who reloads the page is the same player to the
game. It gives the engine every frame a player sends with their address, and sends every frame the
engine gives for an address down that player's link.

```ts
type ServerEngine = { start(info: ServerInfo, io: ServerIo): Promise<HostedGame> };
```

- `start` resolves once the game runs, within two minutes, or rejects with why it did not start,
  which `games-host` and the page say. Run the game in a worker, so a slow frame never holds up EiN.
- `HostedGame` is `deliver(ip, frame)`, a frame a player sent, the engine's to keep; `seated(ip,
  seat)`, called before anything a new player sends, which answers why they may not play when they
  may not, and the service then closes their link; `left(ip)`, their link closed; and `stop()`.
- `ServerIo` is what the game has of the service: `send(ip, frame)`, `log(line)`, `ended(error?)`
  when the game ends by itself, and `status(map, players)`. Call `status` every few seconds with the
  map and who plays, each by their address, with `name`, `frags` and `ping` as the game knows them:
  it is written into `server.json` when it changed, and a game whose status has listed nobody for
  five minutes is stopped.

A server in a worker reads its players' datagrams while it runs without returning, when no message
could reach it: the service writes each frame into a `Ring` (`@games/net`), memory the two share,
and the worker's `Network` reads it in its `pump`, given as the second argument, before each read.

#### Through the relay

A module whose engine plays peer to peer needs no service: `games-relay`, Games' own, runs every
relayed game with no game on the server, seats as many players as it was hosted for, and passes
each datagram on. A relayed frame starts with an address, four bytes, big-endian, then is a frame as
above (`RELAY_HEADER`, 8 bytes, then the datagram):

- **Up a link**, from a player, the address is whom the datagram is for: another player's address,
  or `BROADCAST_ADDRESS`, `255.255.255.255`, for every other player. The relay drops a datagram for
  any other address, its sender's own included.
- **Down a link**, to a player, the address is whom it is from. The ports and the bytes are passed
  on as they came.

The relay's own word is JSON, in a frame from `SERVER_ADDRESS`, port `CONTROL_PORT` (0), to port 0,
where an engine's sockets never are (`RelayControl`):

```json
{ "type": "roster", "you": "10.66.0.3", "players": [{ "address": "10.66.0.2", "seat": "anna" }, { "address": "10.66.0.3", "seat": "olle" }] }
```

```json
{ "type": "refused", "reason": "the game has room for 4 players, and that many play" }
```

Every player is sent the roster when they sit down, with their own address as `you`, and again
whenever someone sits down or leaves. It lists every player, them too, by address, in the same
order for everyone, so peers that number their players agree on the numbers. A player the game has
no room for is sent `refused`, and their link is closed.

The page gives a relayed game's engine a `RelayNetwork` as `online.network`, and the relay's
`SERVER_ADDRESS` as `address`. Once the first roster has come, which the page waits for before it
starts the game, `self` is the player's own address and `players` who plays, `seated` has settled,
and `onRoster(listener)` hears each later roster. `send` sends each datagram to the address it is
for, or `BROADCAST_ADDRESS`; one to the player's own address comes back without leaving, and `recv`
gives each with the address it is from. `relayFrame`, `unrelayFrame` and `controlFrame` make and
read the frames, for an engine or a test that speaks to the relay itself.

## Write documentation for it

A module's documentation in EiN comes from what it already declares: each command's `spec` or
`arg` lines, each setting's `label` and `description`, and in `mod.json` its `nodeTypes` and the
environment variables it reads other than its settings, under `environment`. `docs commands`,
`docs node-types` and `docs env` read them from the installed modules, and so do the reference pages
of this site.

A guide for the people who use the module, written for them rather than for developers, goes in its
repository, beside `mod.json`. The modules published with EiN have theirs here, in this site's
**Modules** part, which EiN carries offline in **Documentation**.

## Use another module

A module shares files by naming them in `exports`, and another module imports them only if it
lists the first in `dependencies`:

```json
"dependencies": { "archive": "^0.1.0" }
```

With that, `recipes` may import what the Archive exports, as `@archive/<name>`, and run its
commands. Nothing else of the Archive's is reachable. A dependency is checked at setup: it must be
installed, at a version in the range, and it is set up first. `mod install` installs a missing
dependency along with the module. `mod info archive` lists what the Archive exports and which
installed modules depend on it.

To share your own files, export them: `"exports": { "./api": "./lib/api.ts" }` is imported
elsewhere as `@recipes/api`. By convention `./api` holds the types of what your commands answer as
JSON, imports nothing but other such files, and is what your own pages import too.

Your pages may import a dependency's exports too, components and code as well as types: the
exported file and what it imports are bundled into your pages, so a page of yours can be drawn by
another module's component, as a [game module's](#offer-games) is. When that module is updated,
your pages are bundled again with it. This came with core's module contract 0.15.75: give a module
that does it `"coreApi": "^0.15.75"`.

## Test it

A module's tests run inside a checkout of core, with the module in its `modules/` folder; see
[Building from source](source.md). There, `deno task sync:modules` writes the module's
`deno.jsonc` from its `mod.json` (never edit that file), `deno task check` type-checks it, and
`deno task test:one modules/recipes/test/` runs its tests.

A test imports `@ein/testing` and runs commands in an EiN with the module set up:

```ts
import { assertEquals } from '@std/assert';
import { createTestContext } from '@ein/testing';

const testCtx = createTestContext({ modules: ['recipes'], boot: true });

Deno.test({ name: 'recipes', sanitizeResources: false, sanitizeOps: false }, async () => {
  await testCtx.setup();
  const client = await testCtx.server.createShellClient();
  await client.exec("recipe-add 'Apple cake' --serves 8");
  const recipes = await client.execJson<{ title: string }[]>('recipe-list');
  assertEquals(recipes.map((recipe) => recipe.title), ['Apple cake']);
});
```

The tests in core check what every module must keep to: a module imports from core only
`@ein/client`, `@ein/api`, `@ein/paths` and, in pages, the interface's parts, and runs another
module's commands only when it depends on it.

## Publish it

1. Push the module to a repository named `module-recipes`, with `mod.json` at its top. Commit the
   commands with their execute bit (`git update-index --chmod=+x bin/*`): EiN installs each file
   with the mode the repository gives it.

2. Release versions as tags `v<version>`, such as `v0.1.0`, and raise `version` in `mod.json` with
   each: the minor when you add something another module may come to rely on, the major when
   something they use changes. Without a ref, `mod install` takes the highest of them, and the
   default branch only while there is none.

3. Install it on any EiN by its address, with a branch, tag or commit after `@` if you want one:

   ```bash
   # in EiN's terminal, as the administrator
   mod install https://forge.example:3000/wrenfield/module-recipes@v0.1.0
   ```

   EiN fetches the commit from the forge, checks the module as setup would, puts it in place, sets it
   up and starts its services.

4. To let administrators install it by name, they add your organisation to **Module sources**,
   `CFG_MODULE_SOURCES`. Then `mod install recipes` finds it, `mod search` lists it and
   **Settings → Modules** offers **Install** and **Update**. [Modules](../admin/modules.md#modules-from-other-places)
   covers sources that need a token.

When EiN's module API changes in a way that breaks modules, a module whose `coreApi` range the new
EiN does not satisfy is refused at setup with `needs @ein/client ^0.5.0, this core provides 0.6.0`.
Publish a version written for the new API, with its `coreApi` raised. An EiN that is older than the
API a release asks for still installs your module by name: `mod install` without a ref takes the
newest release whose `coreApi` it satisfies.

## Remove it

`mod remove recipes` asks before it removes anything, runs the module's `uninstall.sh` if it has
one, then takes back what setup did: its commands leave `PATH`, its services are stopped and
removed, its pipelines, settings, navigation and guide are unlinked, and its pages are rebuilt
without it. The module's content stays: its roots under `/archive`, and the values of its settings
in `/etc/config`, which come back if the module is installed again.

## If something goes differently

`mod setup` names each problem; `mod list --long` and the module's panel in **Settings → Modules**
show them afterwards.

| What you see                                                                  | What to do                                                                                                             |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `mod setup: module not found: /usr/modules/recipes`                           | The link in `/usr/modules` is missing; make it as in [Try the module](#try-the-module-on-your-ein)                     |
| `mod setup: no mod.json found in /usr/modules/recipes`                        | `mod.json` must be at the folder's top                                                                                 |
| `recipes: needs @ein/client ^0.7.0, this core provides 0.6.0`                 | `coreApi` asks for another version of the module API than this EiN has                                                 |
| `recipes: requires module 'archive' (^0.1.0), which is not installed`         | Install the dependency, or remove it from `dependencies`                                                               |
| `recipes: export './api' points at a missing file: ./lib/api.ts`              | Fix the path in `exports`                                                                                              |
| `recipes: ui.routes['/recipes'] must be a .tsx page: ui/pages/recipes.ts`     | A page is a `.tsx` file                                                                                                |
| `ui-build: recipes: …: '…' is neither lent by the shell nor the module's own` | The page imports a package the interface does not lend; see the table in [Add a page](#add-a-page-and-a-sidebar-entry) |
| `recipe-list: command not found`                                              | `mod setup` has not run since `bin/` was made, or the file is not in `bin/`; run `mod setup recipes`                   |
| `Access denied` when someone else runs a command                              | The file has no execute bit; `chmod 755` it, and commit the mode                                                       |
| The sidebar entry does not appear                                             | Run `ui-nav` and read its warnings: a missing field or an unknown section leaves an entry out                          |
| A page shows an error inside the frame                                        | Its bundle failed to load or the page threw; run `ui-build recipes` and read its output, then the browser's console    |

[Troubleshooting](../admin/troubleshooting.md) covers problems that are not the module's.

## Related pages

- [The module manifest](manifest.md): every field of `mod.json`
- [Writing a driver](drivers.md): bringing a kind of device to EiN
- [Teaching the assistant](../assistant/teaching.md): making the assistant use your module's commands
- [Games](../games/index.md): the page a game module's games are played on
- [Building from source](source.md): a checkout of core to type-check and test modules in
- [Modules](../admin/modules.md): installing, updating and removing modules as an administrator
- [The shell language](../shell/bash.md): the language bash commands and services are written in
- [Changes and pipelines](../concepts/pipelines.md): how work follows a change in the tree
- [Nodes and node types](../concepts/nodes.md): what a node and its attributes are
- [Core commands](../reference/commands-core.md#mod-setup): `mod setup` and the other `mod` commands
