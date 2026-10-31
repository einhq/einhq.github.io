# Building from source

This page is for developers who want to run EiN from its source: which repositories make it up, how to start core on your own machine with a database beside it, how to work on a module against it, and how to test, check and build the image. To install EiN for use, follow [Install EiN](../start/install.md) instead; the installer builds from the same source.

## The repositories

EiN is several repositories in the [einhq](https://github.com/einhq) organisation on GitHub, all under the MIT licence. Core names no module and no service: each is a repository of its own, and a deployment chooses which ones it runs.

| Repository                                                                                                   | What it is                                                                                                           | Language                                 |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [core](https://github.com/einhq/core)                                                                        | EiN itself: the node tree, the shell, pipelines, the SSH server and the web interface                                | TypeScript on Deno, React in the browser |
| [module-archive](https://github.com/einhq/module-archive)                                                    | The [Archive](../archive/index.md) module: people, media, places, staging                                            | TypeScript                               |
| [module-assistant](https://github.com/einhq/module-assistant)                                                | The [Assistant](../assistant/index.md) module: the chat that answers questions about the archive                     | TypeScript                               |
| [module-album-folders](https://github.com/einhq/module-album-folders)                                        | The [Album folders](../album-folders/index.md) module: the albums as folders of real files on disk                   | TypeScript                               |
| [module-ems](https://github.com/einhq/module-ems)                                                            | EiN's client for the [media service](../ems/index.md)                                                                | TypeScript                               |
| [ems](https://github.com/einhq/ems)                                                                          | The media service: every media tool and model behind one HTTP API                                                    | Python                                   |
| [db](https://github.com/einhq/db)                                                                            | The PostgreSQL image (TimescaleDB, pgvector, PostGIS, pg_trgm) and its run script                                    | Containerfile, bash                      |
| [llm](https://github.com/einhq/llm)                                                                          | The local language model the Assistant uses: llama.cpp's server in a container                                       | bash                                     |
| [deploy](https://github.com/einhq/deploy)                                                                    | EiN on one machine with compose: what the installer runs                                                             | bash, compose                            |
| [bash-parser](https://github.com/einhq/bash-parser), [bash-executor](https://github.com/einhq/bash-executor) | The parser and the executor EiN's shell is built on, published on JSR as `@ein/bash-parser` and `@ein/bash-executor` | TypeScript                               |
| [ssh2](https://github.com/einhq/ssh2)                                                                        | The SSH and SFTP library, published on JSR as `@ein/ssh2-ts`                                                         | TypeScript                               |
| [einhq.github.io](https://github.com/einhq/einhq.github.io)                                                  | The site at einhq.eu and this documentation                                                                          | HTML, Markdown                           |

Core takes the shell and SSH libraries from JSR, not from a checkout: its `deno.jsonc` imports `jsr:@ein/bash-executor@^3.0.0` and `jsr:@ein/ssh2-ts@1.1.1`. A change in one of them reaches core once it is published there.

## What you need

- **Deno 2.9.** Core's image is built on `denoland/deno:debian-2.9.6`, so that version is the one EiN is known to run on.
- **podman**, run as your own user. The database, and the media service and the language model when you add them, run in containers, and core's `Makefile` builds and runs its image with podman.
- **git**, to clone the repositories.
- Linux on x86-64, as for an installation. [Performance and sizing](../admin/performance.md#choose-a-machine) lists the memory and disk the media service, which the Archive needs, takes.

Core itself needs no other program on the machine: its shell commands, `jq` and `awk` included, are its own.

## Get the source

Clone core:

```bash
# on your machine
git clone https://github.com/einhq/core.git ein-core
cd ein-core
make help
```

`make help` lists every target of core's `Makefile`. The `deno task` names in `deno.jsonc` are the other half; the sections below use both.

## Start the database

EiN keeps the whole tree in PostgreSQL, which runs as a container of its own from the db repository:

```bash
# on your machine
git clone https://github.com/einhq/db.git ein-db
bash ein-db/run.sh
```

`run.sh` builds the image, starts a container named `postgres` on the host's network and waits until it answers. Its last line is the connection string:

```text
postgres://ein:ein@localhost:5432/ein
```

That is what EiN connects to when `POSTGRES_URL` is unset, so a database started this way needs no setting. The data lives in `~/services/postgres` and stays when you run `run.sh` again, which rebuilds on the newest base image and restarts the container. Set `PGDATA_HOST_PATH`, `PGPORT`, `PG_CONTAINER_NAME`, `POSTGRES_USER`, `POSTGRES_PASSWORD` or `POSTGRES_DB` in front of `bash` to change them; the db repository's README has the table.

EiN creates the extensions it uses in its database, and updates them after a new image, at every start. You never run SQL to set it up.

## Run core

1. Build the web interface once:

   ```bash
   # on your machine, in the core checkout
   deno task bundle-ui
   ```

   This bundles the browser shell into `src/builtin/ui/ui/`, which git ignores. Without it EiN still starts, but it serves the terminal page instead of the web interface.

2. Start EiN:

   ```bash
   # on your machine, in the core checkout
   deno task dev
   ```

3. Read the administrator's password in the output. A new instance without `INITIAL_ADMIN_PASSWORD` in its environment makes a random one and prints it once:

   ```text
   Admin password set to: 4f6c2a1e-…
   ```

   Nothing keeps it. If you miss it, stop EiN, drop the database's data and start again, or set a new password with `user-passwd admin` from a shell that is already signed in.

4. Open `http://localhost:8080` and sign in as `admin` with that password. SSH and SFTP answer on port 2222:

   ```bash
   # on your machine
   ssh -p 2222 admin@localhost
   ```

`deno task dev-w` runs the same with Deno's `--watch`, restarting EiN when a source file changes. `deno task bundle-ui-w` keeps the bundler watching the web interface's sources and rebuilds it on every change; reload the page to see it.

A bare `deno task dev` keeps its files beside the checkout, and reads every other setting from its environment:

| Variable                  | Default                                 | What it is                                                                          |
| ------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| `POSTGRES_URL`            | `postgres://ein:ein@127.0.0.1:5432/ein` | The database.                                                                       |
| `FILE_ROOT_PATH`          | `./files`                               | Where file content is kept.                                                         |
| `VOLATILE_FILE_ROOT_PATH` | `FILE_ROOT_PATH`                        | Where thumbnails, crops and transcodes are kept.                                    |
| `FILE_TMP_PATH`           | `/tmp`                                  | Scratch space while content is written.                                             |
| `DEV_MODULES_PATH`        | `./modules`                             | The module checkouts EiN runs, read-only.                                           |
| `MODULE_INSTALL_PATH`     | `./modules-installed`                   | Where `mod install` puts the modules it fetches.                                    |
| `DOCS_PATH`               | `./guide`                               | The guide at `/usr/docs/guide`: the image's copy of this site, or a checkout of it. |
| `LOG_LEVEL`               | `INFO`                                  | `DEBUG`, `INFO`, `WARN` or `ERROR`.                                                 |

A setting can be given in the environment the same way, as `CFG_…`, and so can the ports, which are not settings: `CFG_HTTP_PORT=8090 deno task dev` moves the web interface to port 8090. [Environment variables](../reference/environment.md#set-by-the-deployment) has every variable, and [Settings](../reference/settings.md) every setting.

## Work on a module

Modules are repositories of their own. To develop one against core, clone it into `modules/<name>` in the core checkout, under the module's name:

```bash
# on your machine, in the core checkout
git clone https://github.com/einhq/module-ems.git modules/ems
git clone https://github.com/einhq/module-archive.git modules/archive
```

The Archive depends on the `ems` module, so clone both. At its next start EiN links every folder under `modules/` that has a `mod.json` into `/usr/modules` in the tree and sets them up in dependency order. A module there wins over an installed module of the same name; the boot log then says `module 'archive' is installed and among the deployment's modules: the deployment's runs`.

What you change takes effect at different times:

| You change                                       | It takes effect                                                                                                                                     |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| A command in the module's `bin/`                 | The next time the command runs.                                                                                                                     |
| A file in the module's `lib/`, or its `mod.json` | When a command that reaches it is next loaded: after the command itself changes, after `mod setup <name>`, or when EiN restarts.                    |
| The module's pages under `ui/`                   | After `ui-build <name>` in EiN's terminal, which bundles them again; reload the page.                                                               |
| The `imports` in its `mod.json`                  | Run `deno task sync:modules` in the core checkout, which writes the module's `deno.jsonc` from its `mod.json`. The tests fail while the two differ. |

Each module is a Deno workspace member of core, so your editor and `deno check` resolve a module's imports exactly as EiN does when it runs them. [Writing a module](modules.md) explains how a module is put together, and [The module manifest](manifest.md) every field of `mod.json`. [`mod-setup`](../reference/commands-core.md#mod-setup) and [`ui-build`](../reference/commands-core.md#ui-build) are in the command reference.

To try a module without a checkout, install it from its repository in EiN's terminal instead, with a branch, tag or commit after `@`:

```bash
# in EiN's terminal
mod install https://github.com/einhq/module-archive@main
```

[Modules](../admin/modules.md) covers installing, updating and removing modules.

## Add the media service and the language model

Core runs without anything more, and the Assistant needs only a language model, below. The Archive needs the media service to make thumbnails, read metadata, find faces and make pictures searchable; without it, files arrive but nothing is analysed. [The media service](../ems/index.md) explains what it does.

The media service reads files by path, not by upload: EiN sends it an absolute path such as `/files/…`, and the service must see the same file at the same path. The simplest way to arrange that on one machine is to run core in its container too, as in [Build and run the image](#build-and-run-the-image), and give both containers the same folders:

```bash
# on your machine
git clone https://github.com/einhq/ems.git ein-ems
cd ein-ems
make build
make run FILES_PATH=$HOME/ein-core/files OLD_PATH=$HOME/ein-core/old \
  VOLATILE_PATH=$HOME/ein-core/files-volatile TMP_PATH=$HOME/ein-core/files-tmp
make health
```

`make build` makes an image of tens of gigabytes, since the models are baked in. Add `GPU=1` to `make run` to give it an NVIDIA card; [The graphics card](../ems/gpu.md) has what the machine needs first. The service listens on port 8181 with the key `let-me-in` unless you set `EMS_PORT` and `EMS_KEY`.

EiN looks for it at `http://127.0.0.1:8181`, the default of [`CFG_EMS_URL`](../reference/settings.md#cfg_ems_url). Give EiN the key with [`CFG_EMS_KEY`](../reference/settings.md#cfg_ems_key), in the settings file you pass to `make container-run` as `ENV_FILE`:

```ini
# ems.env, in the core checkout
CFG_EMS_KEY=let-me-in
```

For the assistant's model, clone [llm](https://github.com/einhq/llm) and run `bash run.sh` in it. It fetches the model on its first start and answers at `http://127.0.0.1:8190`, the default of [`CFG_LLM_URL`](../reference/settings.md#cfg_llm_url), so EiN finds it without a setting. A hosted provider works as well; [The language model](../assistant/language-model.md) explains both.

## Test, check and lint

Run these in the core checkout before you send a change:

| Command                     | What it does                                                                                                                                                                 |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deno task test`            | The fast tier: every test under `src/` and `modules/`, against an in-memory tree. Needs no database and no module; with module checkouts in `modules/`, their tests run too. |
| `make test-pg`              | The same tests, plus the PostgreSQL tier, against the database at `POSTGRES_URL`. Those tests keep their tables under a prefix of their own.                                 |
| `make container-test`       | Every module's end-to-end tests (`*.e2e.test.ts`) inside core's image, against the services the `ENV_FILE` points at. Build the image first.                                 |
| `deno task test:one <file>` | One test file.                                                                                                                                                               |
| `deno task check`           | Type-checks core, the module contract, the modules' commands and the web interface's pages.                                                                                  |
| `deno task lint`            | `deno lint` over `src/` and `modules/`.                                                                                                                                      |
| `deno fmt`                  | Formats the code as `deno.jsonc` says: 175 columns, two spaces, single quotes. `deno fmt --check` reports what it would change.                                              |

The module contract is what modules may import from core: `@ein/client`, `@ein/api`, `@ein/paths` and the web interface's kit, `@ein/ui/*`. Its surface is kept as a snapshot in `src/client/contract.snapshot`, and a test fails when the surface changes. After a deliberate change, raise `MODULE_API_VERSION` in `src/modules/types.ts` and run `deno task contract:snapshot` to write the snapshot again.

The commit history follows Conventional Commits, such as `fix(shell): …` or `feat(archive): …`. Write yours the same way.

## Build and run the image

Core's image holds Deno, core and its documentation, and nothing else: no module, no media tool and no model. Build it with:

```bash
# on your machine, in the core checkout
make container-build
```

and run it with:

```bash
# on your machine, in the core checkout
deno task bundle-ui
mkdir -p old
make container-run ENV_FILE=ems.env
make container-logs
```

`make container-run` mounts the web interface from the checkout's `src/builtin/ui/ui/`, so bundle it first, and the checkout's `old/` at `/old`, so that folder must exist. It runs the container on the host's network, with these variables:

| Variable                                                     | Default                                      | What it sets                                                                     |
| ------------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------- |
| `ENV_FILE`                                                   | none                                         | A file of `KEY=value` lines: every `CFG_…` setting beyond the ports.             |
| `HTTP_PORT`, `SSH_PORT`                                      | `8080`, `2222`                               | The ports, passed in as `CFG_HTTP_PORT` and `CFG_SSH_PORT`.                      |
| `POSTGRES_URL`                                               | `postgres://ein:ein@localhost:5432/ein`      | The database.                                                                    |
| `FILE_ROOT_PATH`, `VOLATILE_FILE_ROOT_PATH`, `FILE_TMP_PATH` | `./files`, `./files-volatile`, `./files-tmp` | The host folders mounted at `/files`, `/files-volatile` and `/files-tmp`.        |
| `MODULES_PATH`                                               | `./modules`                                  | The module checkouts, mounted read-only.                                         |
| `MODULE_INSTALL_PATH`                                        | `./modules-installed`                        | Where `mod install` puts modules, kept when the container is replaced.           |
| `INSTALL_MODULES`                                            | none                                         | Modules to install at boot when they are missing, such as `'archive assistant'`. |
| `CONTAINER_MEMORY`                                           | `6g`                                         | The container's memory, with no swap.                                            |
| `IMAGE_NAME`, `CONTAINER_NAME`                               | `ein`, `ein`                                 | The image and the container.                                                     |
| `LOG_LEVEL`, `LOG_MODULES`                                   | none                                         | The log level, and levels per component such as `ssh-server:DEBUG`.              |
| `DENO_ARGS`                                                  | none                                         | Extra flags for `deno run`, such as `--inspect=127.0.0.1:9229`.                  |

The administrator's password is in `make container-logs` on the first start. `make container-stop` stops the container and `make container-shell` opens bash inside it.

## Run your own build in an installation

An installation made with the installer runs what the organisation that `--source` names holds, `https://github.com/einhq` unless you give it, and keeps it in `.env` as `EIN_SOURCE`. To run your own changes there, push them to an organisation of your own on GitHub, Forgejo or Gitea that holds `deploy`, `core` and `db` (and `ems` and `llm` when you use those options), and install, or run `setup.sh` again, with `--source` and its address. [Where the sources come from](../admin/install.md#where-the-sources-come-from) explains the option, and [Updating](../admin/updating.md) how `setup.sh` fetches the newest commits and builds them.

From `https://github.com/einhq`, `setup.sh` pulls the images `ghcr.io/einhq/core:main`, `ghcr.io/einhq/db:main` and `ghcr.io/einhq/ems:main`, which GitHub builds once a day from the `main` of core, db and ems, when it has moved since the last build. From any other source it builds them itself, as `localhost/ein-core` from `src/core/src/Containerfile`, which also runs `deno task bundle-ui`, `localhost/ein-db` from `src/db` and `localhost/ein-ems` from `src/ems`. EiN installs modules from the places [`CFG_MODULE_SOURCES`](../reference/settings.md#cfg_module_sources) names; with a Forgejo or Gitea source, `setup.sh` sets it to the same organisation, while a GitHub source leaves it at `https://github.com/einhq`.

## When something goes differently

- **`deno task dev` stops at `Connecting to database...`.** PostgreSQL is not answering at `POSTGRES_URL`. Check that the container runs with `podman ps`, and run `bash ein-db/run.sh` again; it reports `postgres did not answer on port 5432` when the server does not come up.
- **The browser shows a terminal instead of the web interface.** The web interface was not bundled when EiN started. Run `deno task bundle-ui` and restart EiN.
- **`make container-run` fails on a missing folder.** Create `old/` in the checkout, or set `OLD_PATH` to a folder that exists.
- **A module's page shows the old version.** Run `ui-build <name>` in EiN's terminal, then reload the page.
- **A test fails in `module-boundary.test.ts` after you edited a manifest.** The module's `deno.jsonc` no longer matches its `mod.json`. Run `deno task sync:modules`.
- **With the Archive, files arrive but get no thumbnails.** The media service is not reached, or sees other paths than EiN. [The media service](../ems/index.md#when-something-goes-differently) has the checks.

## Related pages

- [Writing a module](modules.md)
- [The module manifest](manifest.md)
- [Teaching the assistant](../assistant/teaching.md)
- [Installing in detail](../admin/install.md)
- [The media service](../ems/index.md)
- [Environment variables](../reference/environment.md)
