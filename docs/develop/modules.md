# Writing a module

A module is how EiN learns to do something new: its commands, pages, background services, settings
and pipelines come in one folder that you can install on any EiN. This page is for developers. It
walks through a small module from its first file to publishing it, and shows where each kind of
part goes.

## What a module is

A module is a folder with a `mod.json` at its top, kept in a repository of its own named
`module-<name>`. Core knows no module by name: the Archive, the assistant and the media service
client are modules like the one you write, and you can read their repositories to see any part on
this page at full size.

When EiN sets a module up, it finds most of what the module brings by where it is in the folder.
The manifest says who the module is, what it shares with other modules, and what it adds to
machinery core already has. Nothing in the manifest is code.

| In the module             | What EiN does with it at setup                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------- |
| `mod.json`                | Reads and checks it; refuses the module when it is wrong                                            |
| `bin/`                    | Adds the folder to every shell's `PATH`; each file is a command, in bash or TypeScript              |
| `services/<name>/`        | Registers and enables a background service: `start.sh` with a `config.json`                         |
| `pipelines/*.yaml`        | Registers each pipeline definition                                                                  |
| `ui/`                     | Bundles the pages `mod.json` names; links `ui/nav.json` as the module's sidebar and top-bar entries |
| `etc/config`              | Links it as `/etc/config.d/<name>`: the module's own choice of settings                             |
| `etc/<x>.d/`              | Links it as `/etc/<x>.d/<name>`, for the module that reads that folder                              |
| `etc/` (anything else)    | Copies it into `/etc` when it is not there yet; never overwrites                                    |
| `docs/`                   | Links it as `/usr/docs/modules/<name>`: the module's guide                                          |
| `lib/`, `types/`, `test/` | Nothing; ordinary source, reached through the manifest's `imports` and `exports`                    |
| `uninstall.sh`            | Runs it when the module is removed                                                                  |

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
  "coreApi": "^0.2.0",
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

`mod info` on any installed module shows the core API this EiN provides beside the range the module
asks for. A module without `coreApi` still installs, with a warning.

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

Say what the command does to the system with `arg --effect read` or `write`. The assistant runs a
`read` command at once and shows a `write` to the person first; a command that says nothing is
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

| Member                                           | What it is                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `cmd.args`                                       | The words after the command's name; read flags from them with `parseArgs`          |
| `cmd.json`                                       | True when the caller wants JSON, as the web interface and `JSON_OUTPUT=1` do       |
| `cmd.writeLn`, `cmd.writeJSON`, `cmd.writeError` | Write a line, a JSON answer, or a line on stderr                                   |
| `cmd.stdin`                                      | Standard input: `for await (const line of cmd.stdin.lines())`                      |
| `cmd.execute(script)`                            | Run a shell line and get its `code`, `stdout` and `stderr`; quote paths with `shq` |
| `cmd.sys.vfs`                                    | The tree, read and written with `cmd.access`, the caller's access                  |
| `cmd.env`, `cmd.cwd`                             | The caller's environment, settings included, and working folder                    |
| `cmd.interrupted`, `cmd.onInterrupt`             | Whether the person pressed <kbd>Ctrl</kbd>+<kbd>C</kbd>, and a handler for it      |

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
`~/ein/data/modules` unless you chose another `EIN_DATA`, which EiN sees as `/var/lib/modules`.

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
     Linked docs at /usr/docs/modules/recipes
   Module 'recipes' setup complete
     recipes: built, 3.1 KB in 820 ms
   ```

   The last lines come from bundling every module's pages, one line per module.

3. Open a new terminal tab, so its shell reads the new `PATH`, and try the commands:

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
| `docs/`                                          | Nothing: the guide is read when it is opened                       |

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
   and changes the tree only through commands, which is why each part of a module that the web
   interface shows has a command behind it.

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

A page imports only what the web interface lends it, its own files, and anything at all with
`import type`:

| Import                                                                                   | What it is                                                                  |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `react`, `react-dom`                                                                     | React, the one the web interface runs                                       |
| `@mantine/core`, `@mantine/dates`, `@mantine/hooks`                                      | The Mantine components the interface is built with                          |
| `react-router-dom`                                                                       | Routing: `Link`, `useParams`, `useNavigate`, `useSearchParams` and the like |
| `@preact/signals-react`, `@hello-pangea/dnd`                                             | Signals, and drag and drop                                                  |
| `@ein/ui/components`, `@ein/ui/hooks`, `@ein/ui/lib`, `@ein/ui/signals`, `@ein/ui/theme` | The interface's own parts                                                   |
| `@ein/paths`                                                                             | Core's path names                                                           |
| Your module's files, CSS and CSS modules included                                        | By relative path or through its `imports`                                   |

Anything else stops the build with a message naming the file and the import.

### Where an entry opens a route

A module gives the web interface entries and routes, nothing more. Each entry says where its route
opens:

| Entry     | Where it appears                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `sidebar` | In a section of the sidebar (`main`, `explore`, `browse`, `system`); needs `section`, `label`, `icon` and `to` |
| `topbar`  | A button in the top bar, or a row of a dropdown it names as `parent`, such as `ui.create`, the **Create** menu |
| `panels`  | Inside another page, at a `slot` it names, such as `system.tabs` (a tab of the **Dashboard**) or `nodes.tools` |

A top-bar entry's `action` is `{ "navigate": "/recipes" }` for the page, `{ "dialog": "/recipes/new" }`
for the dialog over it, `{ "drawer": … }` for the side drawer and `{ "fullscreen": … }` for over
everything. Each entry's `id` is `<module>.<name>`. `icon` is a Tabler icon name. `admin: true` shows
an entry to administrators only, `signedIn: true` to people who are signed in. `ui-nav` prints the
navigation as the reader gets it, with a warning for each entry it left out and why.

The administrator and each person can move, rename and hide a module's entries;
[Your sidebar and top bar](../guide/customizing.md) shows how.

To make nodes of your type into links wherever EiN shows them, in search results, completions and
the node explorer, name the route that opens one in `mod.json`:
`"ui": { "open": { "recipe": "/recipes/{name}" } }`. `{name}` is the node's last path segment,
`{parent}` the one before it and `{path}` its whole path.

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

## Run something in the background

A service is a script EiN keeps running: a folder `services/<name>/` with a `start.sh` and a
`config.json`. Setup registers and enables it; EiN starts the enabled services when it starts, and
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

| Key             | What it does                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `description`   | One line for the **Dashboard**'s services and `service list`                                             |
| `restartPolicy` | `on-failure`, `always` or `never`; with a restart policy EiN starts a failed service again               |
| `maxRestarts`   | How many restarts within `restartWindow` before the service stays failed; 3 by default                   |
| `restartWindow` | That window, in milliseconds; 60000 by default                                                           |
| `stopTimeout`   | How long a stopping script may take before it is closed, in milliseconds; 5000 by default                |
| `env`           | Environment variables for the script                                                                     |
| `statusCommand` | A command answering the service's health in one line, shown beside its status                            |
| `checkCommand`  | A command answering checks for `health`, as JSON `[{ name, state, reason }]` with `ok`, `warn` or `fail` |
| `gaugeCommand`  | A command answering meters for `top` and the **Dashboard**, as JSON `[{ label, percent?, value }]`       |

Module services use `"restartPolicy": "on-failure"`. A service whose name the module stops
shipping is stopped and removed at the next setup. [Services and logs](../admin/services-logs.md)
shows where a service's output goes.

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

The events come from the modules that emit them: `media.metadata.extracted` is the Archive's, so
this module would list `archive` in its `dependencies`. [Changes and pipelines](../concepts/pipelines.md)
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

What the assistant knows about your module's commands, and how to give it more, is in
[Teaching the assistant](assistant.md).

## Write documentation for it

`docs/index.md` is the module's guide. Its opening is the **About** tab of the module's panel in
**Settings → Modules**, and the whole of `docs/` is on the module's own page in **Documentation**,
together with every command, setting and node type the module brings. Write it for the people who
will use the module, not for developers; the guides of `module-archive` are a model.

The rest of a module's documentation comes from what it already declares: each command's `spec` or
`arg` lines, each setting's `label` and `description`, and in `mod.json` its `nodeTypes` and the
environment variables it reads other than its settings, under `environment`. `docs commands`,
`docs node-types` and `docs env` read them from the installed modules, and so do the reference pages
of this site.

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

2. Mark versions with tags, and raise `version` in `mod.json` with each: the minor when you add
   something another module may come to rely on, the major when something they use changes.

3. Install it on any EiN by its address, with a branch, tag or commit after `@` if you want one:

   ```bash
   # in EiN's terminal, as the administrator
   mod install https://forge.example:3000/wrenfield/module-recipes@v0.1.0
   ```

   EiN fetches the commit over HTTPS, checks the module as setup would, puts it in place, sets it
   up and starts its services.

4. To let administrators install it by name, they add your organisation to **Module sources**,
   `CFG_MODULE_SOURCES`. Then `mod install recipes` finds it, `mod search` lists it and
   **Settings → Modules** offers **Install** and **Update**. [Modules](../admin/modules.md#modules-from-other-places)
   covers sources that need a token.

When EiN's module API changes in a way that breaks modules, a module whose `coreApi` range the new
EiN does not satisfy is refused at setup with `needs @ein/client ^0.2.0, this core provides 0.3.0`.
Publish a version written for the new API, with its `coreApi` raised.

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
| `recipes: needs @ein/client ^0.3.0, this core provides 0.2.1`                 | `coreApi` asks for another version of the module API than this EiN has                                                 |
| `recipes: requires module 'archive' (^0.1.0), which is not installed`         | Install the dependency, or remove it from `dependencies`                                                               |
| `recipes: export './api' points at a missing file: ./lib/api.ts`              | Fix the path in `exports`                                                                                              |
| `recipes: ui.routes['/recipes'] must be a .tsx page: ui/pages/recipes.ts`     | A page is a `.tsx` file                                                                                                |
| `ui-build: recipes: …: '…' is neither lent by the shell nor the module's own` | The page imports a package the interface does not lend; see the table in [Add a page](#add-a-page-and-a-sidebar-entry) |
| `recipe-list: command not found`                                              | Open a new terminal tab, so its shell reads the new `PATH`                                                             |
| `Access denied` when someone else runs a command                              | The file has no execute bit; `chmod 755` it, and commit the mode                                                       |
| The sidebar entry does not appear                                             | Run `ui-nav` and read its warnings: a missing field or an unknown section leaves an entry out                          |
| A page shows an error inside the frame                                        | Its bundle failed to load or the page threw; run `ui-build recipes` and read its output, then the browser's console    |

[Troubleshooting](../admin/troubleshooting.md) covers problems that are not the module's.

## Related pages

- [The module manifest](manifest.md): every field of `mod.json`
- [Teaching the assistant](assistant.md): making the assistant use your module's commands
- [Building from source](source.md): a checkout of core to type-check and test modules in
- [Modules](../admin/modules.md): installing, updating and removing modules as an administrator
- [The shell language](../shell/bash.md): the language bash commands and services are written in
- [Changes and pipelines](../concepts/pipelines.md): how work follows a change in the tree
- [Nodes and node types](../concepts/nodes.md): what a node and its attributes are
- [Core commands](../reference/commands-core.md#mod-setup): `mod setup` and the other `mod` commands
