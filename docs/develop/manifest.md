# The module manifest

Every module has a `mod.json` at its root: who the module is, what it shares with other modules, and what it adds to what core already has. This page is the reference for each field, for the developer writing a module. [Writing a module](modules.md) explains how a module is put together; this page is what to look up while you write its manifest.

Nothing in a manifest is code. What a module does lives in its folders (`bin/`, `services/`, `pipelines/`, `ui/`, `docs/`), and `mod setup` finds those by where they are. The manifest names the module, lists its settings and node types, and declares what core should create or register for it.

## A small manifest

A module that adds a few commands, one setting and one page needs little more than this:

```json
{
  "name": "letters",
  "version": "0.1.0",
  "description": "Letters: scanned letters, who wrote them and to whom",
  "coreApi": "^0.5.0",
  "dependencies": { "archive": "^0.1.0" },
  "exports": { "./api": "./lib/api.ts" },
  "imports": {
    "@letters/parse": "./lib/parse.ts",
    "@std/path": "jsr:@std/path@^1.1.3"
  },
  "config": {
    "options": [
      {
        "key": "CFG_LETTERS_OCR_LANGUAGE",
        "scope": "system",
        "type": "select",
        "choices": ["en", "sv"],
        "default": "en",
        "label": "Letter language",
        "description": "The language a scanned letter is read in.",
        "group": "Letters"
      }
    ]
  },
  "ui": { "routes": { "/letters": "ui/pages/letters.tsx" } }
}
```

`letters` is an invented module, shown for the shape. The Importer's manifest is a real one of about the same size: a name, a version, a description, `coreApi`, one export, its imports and a dependency on `archive`.

## The fields at a glance

| Field               | What it is                                                      | When it matters        |
| ------------------- | --------------------------------------------------------------- | ---------------------- |
| `name`              | the module's name, its directory and its alias prefix           | always                 |
| `version`           | its semver version, checked against dependents' ranges          | `mod setup`            |
| `description`       | one sentence shown wherever the module is listed                | display                |
| `author`, `license` | free text                                                       | display                |
| `coreApi`           | the range of core's module contract it is written against       | `mod setup`            |
| `exports`           | the files other modules may import                              | loading, type checks   |
| `imports`           | its own private aliases and external packages                   | loading, type checks   |
| `dependencies`      | the modules it needs, with version ranges                       | `mod setup`            |
| `config.options`    | the settings it owns                                            | `mod setup`            |
| `environment`       | environment variables it reads that are not settings            | documentation          |
| `nodeTypes`         | the node types it defines; with a `root`, what `@` completes to | documentation, runtime |
| `roots`             | folders directly under `/archive` its content lives in          | `mod setup`            |
| `indexes`           | database indexes on node attrs its queries need                 | `mod setup`            |
| `ui.routes`         | its pages, by route                                             | `ui-build`             |
| `ui.open`           | which route opens a node of a type                              | `ui-build`, browser    |

EiN runs `mod setup --all` at every start, for every installed module in dependency order, so a field read by `mod setup` takes effect the next time EiN starts or the next time you run `mod setup <name>`. "Loading, type checks" means the field is read when the module's TypeScript is loaded, and by `deno task check` through the module's generated `deno.jsonc`. `ui-build` bundles the modules' pages; `mod setup` runs it after it has set modules up.

## Identity

### `name`

The module's name. It must be the name of the directory the module is installed in, `/usr/modules/<name>`, because dependencies and import aliases are both found by directory name. Use lower case letters, digits and hyphens: only such a name can be imported as `@<name>/…`.

The name is also the owner shown beside the module's settings, node types and commands, the prefix of its aliases (everything `archive` shares is imported as `@archive/…`), and the name its navigation, settings and documentation are linked under.

### `version`

The module's version, in semver: `"0.1.0"`. A module that depends on this one names a range, and `mod setup` refuses the dependent when the installed version is outside it. Step it as a caret range reads it: below 1.0.0, raise the minor when something a dependent uses changes or goes, and the patch for anything else; from 1.0.0, the major and the minor. Tag each released version `v<version>` in the module's repository, such as `v0.1.0`, which is what `mod install <name>@v0.1.0` installs.

### `description`, `author`, `license`

Free text. `description` is shown by `mod list --long` and `mod info`, on **Settings → Modules** and on the documentation's modules page. Write it as what the module is, for a reader: the Assistant's is "Assistant: answers questions by running EiN's commands for the user, with what the installed modules offer it".

### `coreApi`

The range of core's module contract the module is written against, as a semver range: `"^0.5.0"`. Core's side of it is `MODULE_API_VERSION` in `src/modules/types.ts`, at present `0.5.0`; `system-info` shows it on its `api` line.

The contract is what a module may use from core: `@ein/client`, `@ein/api`, `@ein/paths` and the web interface's kit, `@ein/ui/*`. Core's `src/client/contract.snapshot` lists every symbol in it, and a test fails when the contract changes without the version and the snapshot changing too. Below 1.0.0 the minor is the breaking part: `^0.5.0` accepts 0.5.x and nothing else.

`mod setup` checks the range:

| Manifest                      | What `mod setup` says                                                         |
| ----------------------------- | ----------------------------------------------------------------------------- |
| no `coreApi`                  | `letters: no coreApi declared, assuming 0.5.0`, and it goes on                |
| a range that does not parse   | `letters: coreApi is not a valid semver range: …`, and it refuses             |
| a range core does not satisfy | `letters: needs @ein/client ^0.6.0, this core provides 0.5.0`, and it refuses |

## What a module shares and uses

`exports`, `imports` and `dependencies` decide what the module's TypeScript may import and which other modules' commands it may run. One function in core, `src/modules/resolve.ts`, applies the rule for the loader that runs `#!ts` commands, for `deno task sync:modules` and for the boundary test, so what type-checks, what runs and what the test allows are the same.

A bare specifier in a module's source is looked up in this order:

1. the module's own `imports`, longest key first, the way an import map resolves;
2. the module's own `exports`, under `@<name>/…`;
3. the `exports` of a module listed in `dependencies`, under `@<dependency>/…`;
4. core's own map: `@ein/client`, `@ein/api`, `@ein/paths` and `@ein/testing`, which no manifest restates.

In a core checkout, each module is a Deno workspace member with a `deno.jsonc` that `deno task sync:modules` writes from its `mod.json`. Never edit that file: change `mod.json` and run the task again. [Building from source](source.md) covers the checkout.

### `exports`

The module's public interface, `"./<name>": "./<file>"`. Another module imports the file as `@<module>/<name>`, and only when it lists this module in its `dependencies`. Nothing else in the module can be reached from outside it. An export is also usable inside the module under the same alias.

```json
"exports": {
  "./people/api": "./lib/people/api.ts",
  "./people/genealogy": "./lib/people/genealogy.ts",
  "./paths": "./lib/paths.ts"
}
```

A key is `./<name>`, or `./<area>/<name>` in a module made of several areas as the Archive is, in lower case with hyphens. The target is a path inside the module, starting with `./`, and the file must exist: `mod setup` refuses `export './api' points at a missing file: ./lib/api.ts`.

Exports the modules use by convention:

- `./api`, or `./<area>/api` in a module with areas: the types of what the module's commands answer under `JSON_OUTPUT=1`, for its own pages and for other modules. These files import only other API files, so a page can import them without type-checking the whole module.
- `./testing`: a stand-in other modules' tests may use. The media service client exports its fake media service this way.

### `imports`

What the module's own code uses: private aliases into its own files, and external packages.

```json
"imports": {
  "@importer/legacy": "./lib/legacy.ts",
  "@std/path": "jsr:@std/path@^1.1.3",
  "bson": "npm:bson@^6.10.4"
}
```

Name a private alias after the module, `@<name>/…`, as you would an export; it is private because it is not in `exports`. A target is a path inside the module starting with `./`, or a package: `jsr:`, `npm:`, `node:`, `http:`, `https:` or `data:`. It is never a path into another module; that is what `dependencies` and the other module's `exports` are for.

An alias reaches below itself only when its key ends in `/` or it maps to a `jsr:` or `npm:` package. `@archive/timeline` mapped to a file says nothing about `@archive/timeline/facets`, which needs an entry of its own. Deno applies the same rule.

### `dependencies`

The other modules this one needs, as name and semver range: `"dependencies": { "ems": "^0.1.0" }`. A dependency is:

- checked by `mod setup`: it must be installed, at a version in the range;
- set up first, since modules are set up in dependency order; a cycle is reported as `mod setup: dependency cycle, skipping: a -> b -> a` and none of its modules is set up;
- the only way to import another module's `exports`;
- required to run another module's commands. Core's boundary test reads command names from `execute(…)` calls, pipeline `command:` lines and shell scripts, and fails on a call into a module that is not listed.

| Problem                                    | What `mod setup` says                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| the module is not installed                | `letters: requires module 'archive' (^0.1.0), which is not installed`      |
| the range does not parse                   | `letters: dependency 'archive' has an invalid semver range: …`             |
| the installed version is outside it        | `letters: requires 'archive' ^0.2.0, but 0.1.0 is installed`               |
| the dependency's own version is not semver | a warning, `… has an unparseable version '…', not checked`, and it goes on |

An import of another module's file gets a message of its own when the module runs or is checked: `… imports '@archive/paths' but does not list 'archive' in its dependencies`, or `… '@archive/x' is not exported by 'archive' (exports: …)`, which lists what it does export.

## Settings

### `config.options`

The settings the module owns. `mod setup` adds them to EiN's table of settings and `mod remove` takes them out, so they appear on **Settings → System**, under **Profile → Preferences** for personal ones, and in `config list`, without core knowing them. [Configuration](../admin/configuration.md) describes how an administrator sees and changes them.

The values are never in the manifest. They live in `/etc/config` for system settings and in each person's `~/.config` for personal ones, and every shell sees them as environment variables.

```json
{
  "key": "CFG_MODEL_SLOTS",
  "scope": "system",
  "type": "number",
  "default": "2",
  "label": "Model requests in flight",
  "description": "How many model-bound media steps (faces, picture vectors, text in pictures, text vectors, transcripts, voices) EiN keeps in flight against the media service at once. …",
  "group": "Processing",
  "restarts": ["models"]
}
```

| Key           | What it is                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `key`         | the environment variable: `CFG_…` for a system setting, `CFG_USER_…` for a personal one                                  |
| `scope`       | `system` (one value, set by an administrator) or `user` (each person their own)                                          |
| `type`        | `string`, `number`, `boolean`, `select`, `mode`, `user`, `group` or `secret`: the control, and what `config set` accepts |
| `choices`     | the allowed values, required for `select`                                                                                |
| `default`     | what applies when nothing is set; always a string, never written to a file                                               |
| `label`       | the setting's name on the Settings page                                                                                  |
| `description` | what the setting does, for the person reading the Settings page; say what changes, not how it is implemented             |
| `group`       | the category it is listed under on the Settings page                                                                     |
| `restarts`    | the services that read it when they start, restarted when it changes                                                     |
| `restartNote` | shown instead of restarting, for a service that cannot be restarted from a page                                          |
| `emptyMeans`  | what an empty value means, when empty is a choice rather than "not set"                                                  |

The example is the Archive's [`CFG_MODEL_SLOTS`](../reference/settings.md#cfg_model_slots). [Settings](../reference/settings.md) lists every setting the installed modules declare, with its default.

The names and the scope must agree:

- a `user` setting is named `CFG_USER_…` (the one exception is `HISTSIZE`, which bash owns), and a `system` setting is not;
- a `secret` is a key to another service. It is named `CFG_…_KEY`, a name only a secret may have, it is a `system` setting, and its `default` is `""`. No shell sees it, and the Settings page says only whether it is set. The Assistant's `CFG_LLM_KEY` is one.

A malformed setting does not stop the module. `mod setup` prints a warning such as `letters: option 'CFG_LETTERS_X': type 'select' needs choices` and leaves that setting out. A key that core or another module already registered is also left out, and the first owner keeps it.

### A module's own choice of values

A module that wants a setting, its own or core's, to have a value of its choosing writes it in `etc/config`, a shell file of `export KEY='value'` lines. `mod setup` links it as `/etc/config.d/<name>` and `mod remove` removes the link. The Archive's is:

```bash
# Read what is typed into the search box as filters: people, locations, years, kinds.
export CFG_SEARCH_PARSER='archive-parse'
```

The file is read before the administrator's `/etc/config`, so a value set on the Settings page wins, and the Settings page shows a value that came from the file as the module's.

## Reference

These two fields describe; they do not change what EiN does, apart from `root` below. `mod setup` warns about an entry it cannot use and leaves it out of the documentation.

### `environment`

Environment variables the module reads that are not its settings, documented for `docs env` and the [Environment variables](../reference/environment.md) page:

```json
{
  "key": "NOMINATIM_SEARCH_URL",
  "kind": "option",
  "default": "https://nominatim.openstreetmap.org/search",
  "description": "Where geocoding asks Nominatim for an address, as geocode-location and location-region do. Point it at your own server to avoid the public one's rate limit."
}
```

`key`, `kind` and `description` are required, `default` is what the reader falls back to when the variable is not set, and `kind` says how the variable reaches whatever reads it:

| `kind`       | How it is set                                                                |
| ------------ | ---------------------------------------------------------------------------- |
| `option`     | nobody sets it for you; export it in a shell to change how a command behaves |
| `deployment` | the EiN process's own environment, read once at start                        |
| `session`    | set for every shell by the server that opened it                             |
| `path`       | the tree's layout, exported at start                                         |
| `system`     | the rest of what EiN exports at start for scripts                            |
| `pipeline`   | set for a pipeline step by the event that started it                         |

A module almost always means `option`.

### `nodeTypes`

The node types the module defines, described for `docs node-types` and the [Node types](../reference/node-types.md) page. A node type exists as soon as a node carries it; one that is used but described nowhere is still listed, with its count and no description.

```json
{
  "type": "album",
  "label": "Album",
  "category": "content",
  "root": "/archive/albums",
  "description": "A collection of photos and videos that behaves as a directory. …"
}
```

`type`, `label`, `description` and `category` are required. `category` is `content` (what the archive holds), `structure` (what organises it) or `system`. `plural` names several of them ("People"; the label with an `s` when it is left out), and `searchable: true` offers the type on the Search page as a choice of what to show, which needs a `root` and a type the `search` command knows.

A type whose nodes live directly under one folder names that folder as `root`, and that makes it something an `@` in the search box completes to. Typing `@hel` lists the names, matching what you typed, of the nodes of every such type directly under its root, so Helen Okafor's person node comes up. `mod setup` registers the types with a root and `mod remove` drops them. When two modules give the same type a root, the first one set up keeps it.

## The archive

### `roots`

The folders directly under `/archive` that the module's content lives in. The Archive's are:

```json
"roots": ["/archive/people", "/archive/locations", "/archive/devices", "/archive/albums"]
```

Each must be `/archive/` followed by one name of lower case letters, digits, `_` and `-`, starting with a letter. `mod setup` creates a missing one, owned by the administrator and the users group, with mode 775. Nothing removes one, so removing a module does not delete its content. Name the roots in your module's own code too, so its dependents can use them: the Archive exports them as `@archive/paths`.

### `indexes`

Database indexes on node attributes, for the queries the module's data is asked. `mod setup` creates each one that is missing.

```json
"indexes": [
  { "name": "device_taken_utc", "on": ["devicePath", "takenAtUtc"], "partial": "devicePath" },
  { "name": "spoken_text", "on": ["text"], "partial": "text", "using": "trigram" },
  { "name": "duplicate_deferred", "on": ["duplicate.deferred"], "using": "statistics" }
]
```

| Key         | What it is                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `name`      | lower case letters, digits and `_`, starting with a letter; the index is named `<attrs table>_<name>_idx`                        |
| `on`        | the attributes, in order; a dotted path reaches into a nested attribute (`relation.from`)                                        |
| `partial`   | index only the nodes where this attribute is set: small and cheap for an attribute few nodes have                                |
| `collation` | `bytes` (the default), `en` or `sv`: the order the values are kept in, which must be the order a query asks for to use the index |
| `using`     | `trigram` or `statistics`, below                                                                                                 |

`using: "trigram"` makes a trigram index over one attribute's text instead. It serves a search for a substring anywhere in the text, and no order, so it takes one attribute in `on` and no `collation`. `using: "statistics"` makes no index at all, only the database's statistics on one attribute, for a condition no index serves that the planner would otherwise misjudge, such as asking for nodes that lack an attribute few nodes have. It takes one attribute and neither `collation` nor `partial`.

If any of `nodeTypes`' roots, `roots` or `indexes` is malformed, `mod setup` warns, for example `letters: index 'Taken': invalid name 'Taken' (lower case, digits, _)`, and none of the three is used: no root is created, no index is made and no type completes after `@`.

## Pages

### `ui.routes`

The module's pages: each route with the file that draws it, relative to the module's root.

```json
"ui": {
  "routes": {
    "/devices": "ui/device/pages/devices.tsx",
    "/devices/:id": "ui/device/pages/device.tsx"
  }
}
```

A route is a path below `/` made of literal and `:param` segments; `/` itself is the home page, which belongs to the web interface. The page is a `.tsx` file inside the module, and its default export is the page's component. If `ui.routes` is present it must hold at least one route.

`ui-build` bundles the pages inside the running EiN whenever modules are set up or removed, and the browser loads a module's bundle the first time one of its routes is opened. When two modules give the same route, the module whose name sorts later is left out: its pages are not served and `ui-build` reports `/devices is archive's route already`. A route at the exact path of one of the web interface's own pages is never reached, since the interface's own is matched first.

How a route is shown, as a page, in a dialog, in the side drawer or full screen, is decided by the entry that opens it in the module's `ui/nav.json`, not by the route. [Writing a module](modules.md) covers navigation entries.

### `ui.open`

Which route opens a node of a type, so the web interface can link nodes it finds but does not know: search results, completions in the header, and **Open** in the node explorer.

```json
"open": {
  "person": "/people/{name}",
  "album": "/albums/{path}",
  "track": "/devices/{parent}?tab=track"
}
```

| Placeholder | Replaced by                  |
| ----------- | ---------------------------- |
| `{name}`    | the node's last path segment |
| `{parent}`  | the segment before it        |
| `{path}`    | the node's whole path        |

Each is URI-encoded. A route must start with `/` and use no other placeholder. A type that no installed module names is shown without a link.

## What `mod setup` finds without a field

Some of what a module brings is found by where it is in the module, not by a field in `mod.json`:

| In the module             | What `mod setup` does with it                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| `bin/`                    | adds it to every shell's `PATH`; each file is a command, a shell script or `#!ts` TypeScript          |
| `services/<name>/`        | registers and enables a service from its `start.sh`; a service the module no longer ships is retired  |
| `pipelines/*.yaml`        | defines each pipeline; one the module no longer ships is undefined                                    |
| `ui/nav.json`             | links it as `/etc/ui/nav.d/<name>.json`: its sidebar, top-bar and panel entries, each opening a route |
| `ui/index.html`           | links `ui/` as a site under `/var/www/<name>`                                                         |
| `etc/config`              | links it as `/etc/config.d/<name>`: the module's own choice of setting values                         |
| `etc/<x>.d/`              | links it as `/etc/<x>.d/<name>`, for whichever module reads `/etc/<x>.d/*` (`assistant.d`)            |
| the rest of `etc/`        | copies each entry into `/etc` when it is not already there; never overwrites                          |
| `docs/`                   | links it as `/usr/docs/modules/<name>`: the module's own guide                                        |
| `lib/`, `types/`, `test/` | ordinary source, reached through `imports` and `exports`                                              |
| `deno.jsonc`              | generated from `mod.json` by `deno task sync:modules`; never edited                                   |

Commands are also found by name. Core runs a module's command when it is named after a role: `members-<type>` for what a node of that type holds, `subject-<kind>` for `search --subject`, `search-*` providers for the search box, and `news-<x>`, `events-<x>` and `onthisday-<x>` for the home page's sections. [Writing a module](modules.md) gives each role's arguments and answer. [Teaching the assistant](assistant.md) covers what a module gives the assistant through `etc/assistant.d`.

## Check a manifest

`mod setup` checks the manifest before it changes anything, since the commands, services and pipelines it registers are live the moment they land.

1. Put the module in place, or change its `mod.json`.
2. In EiN's terminal, as an administrator, set it up again:

   ```bash
   # in EiN's terminal
   mod setup letters
   ```

3. Read what it prints. On success it lists what it did and ends with `Module 'letters' setup complete`.

What goes wrong falls in two kinds:

| Kind    | What it covers                                                                                                                                                                                    | What happens                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Error   | the directory name, `coreApi`, `dependencies`, `exports`, `imports`, `ui`, and a field of the wrong shape (`config.options`, `nodeTypes`, `environment`, `indexes` or `roots` that is not a list) | the module is not set up at all; each problem is printed as `mod setup: letters: …` |
| Warning | a missing `coreApi`, a malformed setting, node type, environment variable, index or root                                                                                                          | the module is set up without the entry; the warning is printed                      |

A module installed under another directory name is refused with `letters: must be installed as /usr/modules/letters, the directory named after it`. When a later step fails, for example a service that cannot be added, `mod setup` ends with `mod setup: module 'letters' setup incomplete`.

`mod list` shows afterwards how each module's last setup went, and **Settings → Modules** shows the same for each module. [Modules](../admin/modules.md) describes both, and [`mod-setup`](../reference/commands-core.md#mod-setup) and [`mod-info`](../reference/commands-core.md#mod-info) the commands.

In a core checkout, `deno task check` type-checks the modules against their manifests, and core's tests include the boundary test and a check that each `deno.jsonc` matches its `mod.json`.
