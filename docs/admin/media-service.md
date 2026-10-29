# The media service

The media service, EMS, is the container that holds every media tool and model EiN uses: it reads
metadata, makes thumbnails and video renditions, finds faces, voices and text, transcribes speech and
makes pictures searchable. This page is for the administrator who installs it, watches it and
tunes it.

## What the media service does

EiN itself runs no media tool. Whenever a file needs looking at, EiN sends the media service a
request naming the file, and the media service answers or writes the result where EiN asked. It
keeps no data of its own and knows nothing of the tree: it reads the files EiN stores, and nothing
else.

| Work                                                | What you see in EiN                                              |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| Reading dates, places, cameras and codecs           | Dates and places on pictures; staging can group files            |
| Thumbnails, picture sizes, posters and waveforms    | Pictures, videos and recordings show in the grids and the viewer |
| Video and audio renditions (AV1 video, AAC audio)   | Videos and recordings play in the browser                        |
| Faces, voices and who is speaking                   | [People and faces](../guide/people.md)                           |
| Transcripts and language detection                  | What is said in videos and recordings, searchable                |
| Text in pictures and handwriting, text in documents | Text found in photographed pages, letters and PDFs, searchable   |
| Picture and text vectors                            | Finding pictures by what they show, and text by meaning          |
| Fingerprints and copy detection                     | [Duplicates](../guide/duplicates.md)                             |
| Shot boundaries                                     | Chapters in a video                                              |

The [Archive](modules.md) needs it: installing the `archive` module installs the `ems` module with
it, which is EiN's side of the media service. The `ems` module is the client, the health checks,
the **Media service** tab on the dashboard and the GPU readings; the media service itself is a
separate container that the module does not install.

The media service generates no text. The chat belongs to the assistant's
[language model](language-model.md), and no processing step depends on it.

## What happens without it

Without the media service, EiN still takes in, keeps and shares what you upload, but nothing new is
read:

- Uploads wait in staging as **being prepared**.
- New files get no metadata, thumbnails, faces, transcripts or search vectors.
- The **Dashboard** shows the warning `http://ems:8181 is not answering; work that needs it waits`
  on its **Overview** tab. A warning does not stop **Healthy**.

None of this work is lost. Each step that needs the media service waits without using up its
retries, and runs once the media service answers again.

## Add the media service

The installer adds it with `--ems`, at the first install or any time after:

1. On the machine EiN runs on, run:

   ```bash
   # on the machine EiN runs on, in ~/ein
   ./setup.sh --ems
   ```

2. Wait for the build. The first time, `setup.sh` prints
   `== Building the images (the media service the first time: about 30 GB)`: the image carries
   every model, and building it takes a while and about 30 GB of disk. [Install EiN](../start/install.md#what-you-need)
   lists what the machine needs with the media service.
3. `setup.sh` starts the containers and prints `EiN is up at http://…:8080/` once EiN answers.
4. Open **Dashboard** under **System** in the sidebar, and choose the **Media service** tab. For the
   first minutes the media service loads its models; the tab then shows the **healthy** badge.

`--ems` writes `EIN_EMS=1` to `~/ein/.env`, so a later `./setup.sh` keeps it. When `setup.sh` found
an NVIDIA card with its CDI spec at the first install (`EIN_GPU=1`), the media service gets the card;
[The graphics card](gpu.md) explains how.

To leave the media service out again, run `./setup.sh --no-ems`. Its container stops and is
removed; your files and everything already made from them stay.

## How EiN reaches it

In the standard install, both containers run on the same machine and only EiN talks to the media
service, on the compose network. Nothing outside the machine reaches it. Three things connect
them, all set up by `setup.sh`:

| What        | Where it is set                                                                           | Value                            |
| ----------- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| The address | `CFG_EMS_URL` for EiN, in `compose.yaml`                                                  | `http://ems:8181`                |
| The key     | `EMS_KEY` in `.env`, made at the install; EiN gets it as `CFG_EMS_KEY`                    | 48 random hexadecimal characters |
| The folders | The same four folders under the data folder, mounted at the same paths in both containers | see below                        |

| Path in both containers | What it holds   | The media service may |
| ----------------------- | --------------- | --------------------- |
| `/files`                | your originals  | read                  |
| `/old`                  | older originals | read                  |
| `/files-volatile`       | the renditions  | read and write        |
| `/files-tmp`            | scratch space   | read and write        |

Because a path means the same file on both sides, nothing is ever copied between them, and the
media service can never change an original. It refuses any path outside these four.

The key is a secret: no shell in EiN sees it, and the settings page never shows it once it is set.
The media service accepts a request only with that key. Leave `CFG_EMS_URL`, `EMS_KEY`, `EMS_PORT`
and `EMS_ROOTS` as `setup.sh` and the compose files set them; [Configuration](configuration.md)
explains how a value set in the deployment relates to the settings page.

## Check that it is running

### On the dashboard

Open **Dashboard** under **System** and choose the **Media service** tab. It asks the media service
how it is, again and again, while the tab is open.

- **Media service**: a badge, **healthy**, **degraded** or **model worker down**, and the facts:
  **version**, **commit**, **api**, **uptime**, **batch worker** and **query worker** (`up`, or `down`,
  with `×` and the number of restarts), **card**, **driver** and **url**.
- **Graphics card mode**, when there is a card: who has the card now (see
  [The graphics card](#the-graphics-card) below).
- An orange box for each degradation, such as `gpu degraded`, and a yellow one for each warning.
- **Graphics card memory**: the card's memory split by process, the media service's workers and
  everything **outside EMS**, and what is free; **GPU load**, **Batch worker RAM** and **Query worker RAM**.
- **Models**: every model the media service can load, loaded or not, with **Status** (for example
  **GPU loaded** or **CPU loading**), **Loaded**, **Last used**, **Size** and **Activity**. Hover a
  model's name for what it does. The heading counts them: for example `3 of 15 loaded · 2 on the GPU`.
- **Executing**: the requests running or waiting now, and the three lanes they go through, **models**,
  **tools** and **encodes**, each with how many run at once.

When the media service does not answer, the tab shows only **The media service is not answering**,
with the address it tried.

The **Overview** tab shows **GPU** and **VRAM** tiles beside the computer's own CPU and memory when
the media service has a card. With no card, or no media service, they are not there.

![The System dashboard's Overview tab with the Healthy badge above the title, tiles for CPU, memory, GPU and VRAM, and the Work card](../../assets/shots/dashboard.webp "The GPU and VRAM tiles are the media service's card; they show only when it has one")

**About EiN** in the account menu also has a **Media service** tile: its version, the API it speaks,
its commit, how long it has been up and the card it runs on, or **Not answering**.

### The health checks

The dashboard's verdict and the [`health`](../reference/commands-core.md#health) command read these
checks about the media service:

| Check        | State | When                                                                       |
| ------------ | ----- | -------------------------------------------------------------------------- |
| `ems`        | ok    | It answers: `EMS <commit> answering, up <time>`                            |
| `ems`        | warn  | It does not answer: `<address> is not answering; work that needs it waits` |
| `ems worker` | warn  | `the model worker is down; EMS starts it again`                            |
| `ems gpu`    | fail  | The card is meant to be there and is not, or the card stopped working      |
| `ems card`   | ok    | Who has the card, `busy` or `quiet`, and which search models are on it     |

Only `ems gpu` fails, and a failed check turns the verdict to **Needs a person**. The others are
warnings: while the media service restarts or loads its models, the work that needs it waits.

### In the terminal

[`ems-status`](../reference/commands-ems.md#ems-status) prints the whole answer the dashboard
draws, and its options shorten it:

```bash
# in EiN's terminal
ems-status            # everything: version, models, requests, card, memory
ems-status --brief    # one line, degradations first
ems-status --checks   # the checks above
ems-gpu               # the card now, with the last six hours
```

```text
ok    ems  EMS 3f9a2c1 answering, up 2.4h
ok    ems card  quiet, search on it: text-query, siglip-text
```

[`service-list --detail`](../reference/commands-core.md#service-list) shows the same one line as
`ems-status --brief` beside the `ems-link` service. When the media service does not answer,
`ems-status` says `ems-status: http://ems:8181 is not answering` and exits with 1.

### On the machine

The media service is the `ems` service of compose:

```bash
# on the machine EiN runs on, in ~/ein
podman compose ps ems          # or docker compose
podman compose logs -f ems     # what it says, as it says it
podman compose restart ems
```

Compose checks it every 30 seconds, and gives it 120 seconds to start before a failed check counts.

## The graphics card

The media service uses an NVIDIA card when it has one, and the CPU otherwise. Without a card every
model and every encoder still runs, only more slowly. Where each
model runs is the media service's own decision, made each time it loads one; it changes how fast an
answer comes, never what it is. A model that does not fit on the card runs on the CPU, except transcription and the handwriting
readers, which wait for room on the card.

With a card, the media service hands the card between indexing and search, and **Graphics card
mode** on the **Media service** tab shows which has it:

| Mode          | What it means                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| **busy**      | Indexing has the graphics card and search runs on the CPU, until no indexing work has come for a while. |
| **quiet**     | No indexing work, so its models are unloaded and search runs on the graphics card, as far as it fits.   |
| **switching** | Handing the graphics card over between indexing and search.                                             |
| **off**       | No graphics card to share: every model runs where its setting says.                                     |

When the mode is off, which `EMS_CARD_QUIET_AFTER=0` makes it too, the tab leaves **Graphics card mode** out.

It turns **quiet** after 600 seconds without indexing work (`EMS_CARD_QUIET_AFTER`). A search never
waits for the card: a separate model process answers searches on the CPU throughout.

[The graphics card](gpu.md) covers preparing the machine, checking that every model really runs on
the card, [sharing the card with the language model](gpu.md#share-one-card-with-the-language-model)
and [being told when the card goes missing](gpu.md#be-told-when-the-card-goes-missing).

## Change how it works

The media service is configured by its environment alone. `~/ein/.env` is that environment, so an
`EMS_` line there reaches it:

1. Add or change the line in `~/ein/.env`:

   ```ini
   # in ~/ein/.env
   EMS_WHISPER_LANGUAGES=sv,en
   ```

2. Apply it:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose up -d
   ```

   Under podman-compose, a container that `podman compose up -d` makes again has no swap limit, so
   the media service's idle models may go to swap and a search waits for them; `./setup.sh` makes
   the containers again with the limit.

Any change restarts the media service, and EiN with it, since both read `.env`. Requests in flight fail and are retried; see
[When the media service restarts](#when-the-media-service-restarts).

These are the settings an administrator is most likely to need:

| Setting                   | Default                       | What it does                                                                                                                                                          |
| ------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EMS_MEMORY`              | `16g`                         | The most memory the container may use. Compose reads it, not the media service.                                                                                       |
| `EMS_WHISPER_LANGUAGES`   | empty                         | The languages spoken in your recordings, as codes separated by commas, the most common first. Detection is biased towards them; empty lets detection alone decide.    |
| `EMS_WHISPER_LANGUAGE`    | empty                         | One language every recording is transcribed as; detection never runs. Right only when every recording is in that language.                                            |
| `EMS_EXPECT_GPU`          | empty                         | `1`: the machine is meant to have a card, and the `ems gpu` check fails when none is visible.                                                                         |
| `EMS_CARD_SHARE_MB`       | `0`                           | The most of the card the media service holds, in MB, for a card shared with the language model; `0` is all of it.                                                     |
| `EMS_CARD_QUIET_AFTER`    | `600`                         | Seconds without indexing work before search gets the card; `0` keeps search on the CPU.                                                                               |
| `EMS_MODEL_IDLE_EVICT`    | `21600`                       | Seconds a model may sit unused before it is unloaded.                                                                                                                 |
| `EMS_MODEL_PINNED`        | `text-query`                  | Models loaded at start and never unloaded, separated by commas. The search models, `text-query` and `siglip-text`, are pinned in the query worker whatever this says. |
| `EMS_MODEL_MAX_RSS`       | 0.6 of the container's memory | The batch worker's memory ceiling, such as `10g`. At the ceiling the worker finishes its requests and starts again; `0` turns the ceiling off.                        |
| `EMS_LIMIT_MODELS`        | `8`                           | Model requests admitted at once.                                                                                                                                      |
| `EMS_LIMIT_TOOLS`         | `4`                           | Tool requests at once: metadata, thumbnails, fingerprints, document text. Each tool uses one core, so this is a number of cores.                                      |
| `EMS_LIMIT_ENCODES`       | `2`                           | Transcodes and other whole-file decodes at once.                                                                                                                      |
| `EMS_QUEUE_DEPTH`         | `64`                          | Requests that may wait before a new one is answered `busy`.                                                                                                           |
| `EMS_INTERACTIVE_RESERVE` | `1`                           | Slots more for a request a person is waiting on, so a person never waits behind indexing.                                                                             |
| `EMS_VIDEO_ENCODER`       | empty                         | The video encoder: empty picks `av1_nvenc` on a card that offers it and `libsvtav1` otherwise.                                                                        |
| `EMS_CPU_ENCODE_MAX_MB`   | `4000`                        | Memory one video decode on the CPU may grow to. A long video is encoded in pieces within it; one that cannot be is refused. `0` turns the CPU encode off.             |
| `EMS_TOOL_STALL`          | `900`                         | Seconds a tool may go without using the CPU or moving a byte before it is stopped as stuck. Not a limit on how long it may take.                                      |

> [!WARNING]
> Leave `EMS_WHISPER_MODEL` as it is (`large-v3`). It must match the model built into the image;
> another name makes the first transcription download one, or fail without a network.

A change to the transcription settings changes what EMS reports as its transcript settings. With
**Keep transcripts current** ([`CFG_MEDIA_TRANSCRIPTS_CURRENT`](../reference/settings.md#cfg_media_transcripts_current))
left on, the Archive then transcribes every video and recording again in the background, behind new
media. On a large archive that is hours of work.

### Settings on EiN's side

EiN's own settings for the media service are in the **Media service** and **Transcription** groups
of **Settings → System**, with `CFG_MODEL_SLOTS`, the Archive's, in **Processing**. All can be set
with `config set`:

| Setting                                                                                     | Default                                                     | What it does                                                                            |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`CFG_EMS_URL`](../reference/settings.md#cfg_ems_url)                                       | `http://127.0.0.1:8181`; the install sets `http://ems:8181` | Where the media service answers                                                         |
| [`CFG_EMS_KEY`](../reference/settings.md#cfg_ems_key)                                       | none; the install sets it                                   | The key the media service expects                                                       |
| [`CFG_EMS_CONNECT_RETRY`](../reference/settings.md#cfg_ems_connect_retry)                   | `90`                                                        | Seconds a background request keeps retrying while the media service refuses connections |
| [`CFG_EMS_LINK_INTERVAL_SECONDS`](../reference/settings.md#cfg_ems_link_interval_seconds)   | `60`                                                        | How often `ems-link` asks whether the media service answers                             |
| [`CFG_WHISPER_LANGUAGE`](../reference/settings.md#cfg_whisper_language)                     | empty                                                       | A language sent with every transcription; empty lets the media service decide           |
| [`CFG_WHISPER_VAD_MIN_SILENCE_MS`](../reference/settings.md#cfg_whisper_vad_min_silence_ms) | empty                                                       | The pause that ends a stretch of speech                                                 |
| [`CFG_WHISPER_WORD_TIMESTAMPS`](../reference/settings.md#cfg_whisper_word_timestamps)       | empty                                                       | `1` for the time of every word, `0` for timings per segment                             |
| [`CFG_MODEL_SLOTS`](../reference/settings.md#cfg_model_slots)                               | `2`                                                         | Model requests the Archive keeps in flight against the media service at once            |

For the languages of a family archive, prefer `EMS_WHISPER_LANGUAGES` in `.env` to
`CFG_WHISPER_LANGUAGE`: the first biases detection, so a holiday clip in English is still
transcribed as English; the second forces one language on everything. [Processing and pipelines](processing.md) explains `CFG_MODEL_SLOTS` and the other slots.

## When the media service restarts

A restart takes tens of seconds, longer when models load. Meanwhile:

- A background request that finds the connection refused tries again for up to
  `CFG_EMS_CONNECT_RETRY` seconds (90) before the step gives up for now.
- A step that cannot reach the media service, finds it `busy`, or finds a model still loading waits
  without using up an attempt, and runs again later.
- A request a person is waiting on, such as a search, does not wait: it fails at once.
- The `ems-link` service writes each change to its log, such as
  `ems-link: down — not answering` and `ems-link: up — …`.

When the media service comes back with a different build, `ems-link` runs every failed pipeline
instance again at once, since a new build is the likeliest fix for what failed under the old one.
It logs `ems-link: EMS <old> -> <new>; failed work runs again: …`. [Services and logs](services-logs.md) shows how to read that log.

## Update the media service

`./setup.sh` without options fetches the newest sources of EiN and of each service it runs, the
media service included, rebuilds the images and starts them again. [Updating](updating.md) has the
whole procedure.

## When something goes differently

**The Media service tab says The media service is not answering.** Look at the container:
`podman compose ps ems`. If it is not running, `podman compose logs ems` says why; start it with
`podman compose up -d`. If `.env` has `EIN_EMS=0`, the media service is not installed: run
`./setup.sh --ems`.

**It answers, but the badge says model worker down.** The model process stopped; the media service
starts it again by itself. If it keeps stopping, the count after `×` beside **batch worker** climbs:
`podman compose logs ems` says why. When it ran out of memory, give the container more with
`EMS_MEMORY` in `.env`.

**`gpu degraded` and the verdict is Needs a person.** The card the machine should have is not
visible to the media service, or its context was lost. A reboot that renumbers the cards is the
usual cause; [The graphics card](gpu.md) has the fix.

**A warning `no keys configured: authentication is off`.** The media service got no key. Check that
`EMS_KEY` is in `~/ein/.env`, and run `podman compose up -d`.

**A warning `no roots configured: every file request will be refused`.** `EMS_ROOTS` is empty. It
is set in `compose.ems.yaml`; undo a change to that file with `git -C ~/ein checkout compose.ems.yaml`
and run `podman compose up -d`.

**Uploads stay being prepared for a long time.** Look at **Executing** on the **Media service** tab.
Requests waiting in the lanes mean the media service is busy: after a large import, the **Dashboard**
reads **Catching up** until the work is done. With a card, a model shown as **CPU loaded** is several
times slower than on the card; see [Performance and sizing](performance.md).

**The first transcription or face search after a quiet spell is slow.** Models are unloaded after
`EMS_MODEL_IDLE_EVICT` seconds unused, and loading one again takes tens of seconds. The **Models**
table shows it as loading.

**The build fails or the disk fills.** The media service's image is about 30 GB, and podman builds
it in a folder beside its own storage, not in `/tmp`. Free space there and run `./setup.sh` again.

[Troubleshooting](troubleshooting.md) covers problems that are not the media service's own.

## Related pages

- [The graphics card](gpu.md)
- [Installing in detail](install.md)
- [Configuration](configuration.md)
- [Health and the dashboard](monitoring.md)
- [Processing and pipelines](processing.md)
- [Performance and sizing](performance.md)
- [Media service commands](../reference/commands-ems.md)
- [Settings](../reference/settings.md#media-service)
