<!-- Written by tools/reference.ts from `config list` on a running EiN: make reference, never by hand. -->

# Settings

Every setting of an EiN with all its modules: 81 of them, in the groups the Settings page shows. [Configuration](../admin/configuration.md) says where each value comes from and how to change it.

- **Who it is for**: _everyone_ is a system setting, which only an administrator changes, on Settings → System or with `config set`; _each person_ is a preference everyone sets for themselves, on Profile → Preferences.
- **Default**: the value until someone changes it. A deployment can set another in `.env`, and a module can choose one.
- **Restarts**: the services a change restarts by itself. Work already running is picked up again when they are back.

## Albums

### `CFG_ALBUM_STACK_THRESHOLD`

**Stack similarity**. How alike two neighbouring photos in an album must look to be stacked as one burst. Higher stacks only near-identical shots.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.75` |
| Kind | number |
| Restarts | `album-metadata` |
| From the module | Archive |

### `CFG_ALBUM_STACK_MAX_GAP_SECONDS`

**Stack time gap (seconds)**. How far apart in capture time two neighbouring photos may be and still be stacked together.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `10` |
| Kind | number |
| Restarts | `album-metadata` |
| From the module | Archive |

## Appearance

### `CFG_USER_HEADER_ENTRANCE`

**Header entrance**. How the tiles of a page's header arrive when the page opens: drawn as if by pen and filled from the bottom up, falling into place, sliding in from the right, swept in from left to right, growing from the bottom edge, rippling out from the title, snapping in like puzzle pieces, or a wave of light across them. A device set to reduce motion never animates it.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `drawn` |
| Choices | `drawn`, `falling`, `sliding`, `sweep`, `growing`, `ripple`, `puzzle`, `wave` |
| Kind | select |

### `CFG_USER_HEADER_ENTRANCE_TIME`

**Header entrance time**. How many milliseconds the header's entrance takes, from the first tile starting to the last one in place. 0 shows the header as it is, without an entrance.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `450` |
| Kind | number |

### `CFG_USER_HEADER_COVER`

**Header over a cover**. How the tiles of a page's header meet its cover photo: split gives the left of the header to the tiles, dissolving hat by hat into the photo along a slanted edge, with their outlines running on over it; lines lays only their outlines over the photo, fading out from the left.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `split` |
| Choices | `split`, `lines` |
| Kind | select |

## Assistant

### `CFG_LLM_MAX_TOKENS`

**Answer length (tokens)**. How many tokens the model may write in one call when thinking is not asked for. A thinking model writes its thought inside the same budget, so it may need more.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `2048` |
| Kind | number |
| From the module | Assistant |

### `CFG_LLM_MODEL`

**Language model**. The model name sent with each request. A llama.cpp server answers with whichever model it loaded, whatever this says.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `qwen3.5-4b` |
| Kind | string |
| Restarts | `llm-link` |
| From the module | Assistant |

### `CFG_LLM_URL`

**Language model address**. The base of an OpenAI-compatible chat API, without /v1: ours (a llama.cpp server) or a provider's, which is then named under Language model provider.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `http://127.0.0.1:8190` |
| Kind | string |
| Restarts | `llm-link` |
| From the module | Assistant |

### `CFG_LLM_KEY`

**Language model key**. The bearer key the provider expects, sent only to the language model address above. Unset when the server needs none. No shell sees it, and nothing shows it once it is set.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | none: a key is set by you, and never shown again |
| Kind | a key: never readable, in no shell |
| Restarts | `llm-link` |
| From the module | Assistant |

### `CFG_LLM_PROVIDER`

**Language model provider**. The provider's name when the language model is a service elsewhere (OpenAI, say). The chat names it and says that questions, and what the assistant reads in the archive to answer them, are sent there. Set by the host profile.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means ours, run on this host |
| Kind | string |
| Restarts | `llm-link` |
| From the module | Assistant |

### `CFG_LLM_THINKING`

**Think before answering**. 1 asks the model to think before it answers, 0 asks it not to. Sent as llama.cpp's chat_template_kwargs, so only a server that reads them honours it. Empty sends nothing and the server decides.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the server decides |
| Choices | `1`, `0` |
| Kind | select |
| From the module | Assistant |

### `CFG_LLM_WAIT`

**Wait for the language model (seconds)**. How long a question to the assistant waits for a language model that is not there, restarting or still loading its model, before the chat says the assistant is unavailable. The chat says it is waiting meanwhile. 0 gives up at once. The search box never waits; it reads the words without the model.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `180` |
| Kind | number |
| From the module | Assistant |

### `CFG_LLM_CARD`

**Where our language model runs**. card: on the graphics card, beside the share it leaves. cpu: on the processor. Set by the host profile; unused when a provider runs the model.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the host does not say |
| Choices | `card`, `cpu` |
| Kind | select |
| Restarts | `llm-link` |
| From the module | Assistant |

## Faces

### `CFG_FACE_MIN_CREATE_CONFIDENCE`

**Confidence to start a new person from a face**. How sure the detector must be of a face that matches nobody before it starts a new, unnamed person. Less certain faces stay unknown.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.7` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_ATTACH_THRESHOLD`

**Face match threshold**. How similar two faces must be before one is attached to a known person. Higher is stricter and produces fewer wrong matches but more unknown faces.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.55` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_VOTE_THRESHOLD`

**Face neighbour similarity**. How similar a known face must be to count as a vote for its person. Faces less alike than this are ignored when deciding who an unknown face is.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.5` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_K`

**Face neighbours compared**. How many of the most similar known faces are compared with each unknown one.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `24` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_MARGIN`

**Face winner margin**. How far the leading person's votes must outweigh the runner-up's before a face is attached. 1.2 means 20% more; higher leaves close calls unknown.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `1.2` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_MAX_YAW`

**Maximum head turn (degrees)**. How far a head may be turned away from the camera, estimated from the eyes, nose and mouth, and still be kept as a face. Full profiles beyond this match the wrong person far more often.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `80` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_MIN_CONFIDENCE`

**Minimum face confidence**. How sure the detector must be before a box is kept as a face that takes part in recognition. Below 0.7 most detections are backs of heads, blur or things that are not faces, and they pull strangers toward the wrong person. Applies to new detections; a box below it is not stored unless someone tags it by hand.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.7` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_MIN_SIZE`

**Minimum face size (px)**. The shorter side a face box must have, in pixels of the displayed photo, to be kept as a face.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `24` |
| Kind | number |
| From the module | Archive |

### `CFG_FACE_MIN_CREATE_SIZE`

**Size to start a new person from a face (px)**. The shorter side, in pixels, a face that matches nobody must have before it starts a new, unnamed person. Small faces stay unknown rather than seeding people from blur.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `48` |
| Kind | number |
| From the module | Archive |

## Language

### `CFG_LANGUAGE`

**Archive language**. The language the archive is kept in: the order names are sorted in, the words it offers as labels, and how it describes how two people are related.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `en` |
| Choices | `en`, `sv` |
| Kind | select |

## Media service

### `CFG_EMS_URL`

**Media service address**. Where EMS answers. Every model and media-tool request goes there; the models themselves are configured on the EMS side.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `http://127.0.0.1:8181` |
| Kind | string |
| Restarts | `models`, `cpu`, `ems-link`, `metrics-sampler` |
| From the module | Media service |

### `CFG_EMS_LINK_INTERVAL_SECONDS`

**Media service check interval (seconds)**. How often the ems-link service asks whether EMS answers, and logs when that changes.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `60` |
| Kind | number |
| Restarts | `ems-link` |
| From the module | Media service |

### `CFG_EMS_KEY`

**Media service key**. The bearer key EMS expects (one of the lines in its keys file), sent only to the media service address above. Unset when EMS runs without keys. No shell sees it, and nothing shows it once it is set.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | none: a key is set by you, and never shown again |
| Kind | a key: never readable, in no shell |
| Restarts | `ems-link` |
| From the module | Media service |

### `CFG_EMS_CONNECT_RETRY`

**Media service restart patience (seconds)**. How long a batch request keeps retrying a refused connection before the step fails. EMS restarts refuse connections for tens of seconds; this is what keeps the steps in flight across one from failing for good. Interactive requests never wait.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `90` |
| Kind | number |
| Restarts | `models`, `cpu` |
| From the module | Media service |

## Modules

### `CFG_MODULE_SOURCES`

**Module sources**. Where published modules are looked for: organisations on GitHub, Forgejo or Gitea, as their addresses separated by spaces, such as https://github.com/einhq. Each repository named module-<name> in them is a module. A module installed by name comes from the first source that has it, and a module's dependencies from its own organisation first.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `https://github.com/einhq` |
| Kind | string |

### `CFG_MODULE_SOURCES_KEY`

**Tokens for module sources**. Access tokens for module sources that are not public, as host=token separated by spaces, such as forge.example:3000=… github.com=…. Each token is sent to its own host only.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | none: a key is set by you, and never shown again |
| Kind | a key: never readable, in no shell |

## Network

### `CFG_HTTP_PORT`

**HTTP port**. The port the web interface listens on.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `8080` |
| Kind | number |
| Takes effect | Takes effect the next time the server starts — restarting it from here would drop this connection. |

### `CFG_SSH_PORT`

**SSH port**. The port the SSH and SFTP server listens on.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `2222` |
| Kind | number |
| Takes effect | Takes effect the next time the server starts. |

## Playback

### `CFG_USER_KEN_BURNS`

**Ken Burns effect**. Slowly pan and zoom each photo during a slideshow.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `true` |
| Kind | boolean |
| From the module | Archive |

### `CFG_USER_SLIDESHOW_SECONDS`

**Seconds per slide**. How long each photo is shown in a slideshow.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `3` |
| Kind | number |
| From the module | Archive |

## Processing

### `CFG_CPU_SLOTS`

**CPU budget for media work**. How much CPU-bound media work runs at once. Each job declares what it costs, so one video transcode can exclude a face assignment on a small box.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `2` |
| Kind | number |
| Restarts | `cpu` |
| From the module | Archive |

### `CFG_CPU_NON_ENTRY_SLOTS`

**CPU slots for downstream media**. Soft reservation for non-ingest CPU work. Ingest borrows unused slots, but ready downstream jobs get them first so a continuous ingest backlog cannot starve the rest of the pipeline.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `1` |
| Kind | number |
| Restarts | `cpu` |
| From the module | Archive |

### `CFG_CPU_WORKERS`

**CPU worker slots**. Upper bound on concurrent CPU media jobs. The budget above is the real limit; this only caps how many can be in flight.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `4` |
| Kind | number |
| Restarts | `cpu` |
| From the module | Archive |

### `CFG_PIPELINE_ENTRY_ADMISSION_PERCENT`

**Entry pipeline reservation (%)**. Share of trigger claims that first try pipelines declaring options.entryPoint. Empty reserved claims fall back to the ordinary fair rotation.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0` |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_MEDIA_HEAL_INTERVAL`

**Gap check interval (seconds)**. How often the background check looks for media missing something a pipeline should have given it, when nothing else is waiting to be processed.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `900` |
| Kind | number |
| Restarts | `media-heal` |
| From the module | Archive |

### `CFG_MEDIA_TRANSCRIPTS_CURRENT`

**Keep transcripts current**. Videos and recordings transcribed with other speech-recognition settings than the media service runs now are transcribed again in the background, behind new media. Set to "off" to leave existing transcripts alone. On a large library a change of settings means hours of background work.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty |
| Kind | string |
| From the module | Archive |

### `CFG_MODEL_KIND_QUANTUM_MS`

**Model backlog rotation (ms)**. How long the models worker stays on one backlog (faces, picture vectors, text in pictures, text vectors, transcripts, voices) before rotating to the next when work remains on more than one. Faces outrank the other backlogs and a crawl finds new ones continuously, so without this they would starve the rest outright. Each rotation costs the media service a minute or two of loading models and of slots waiting for the last long step of the old backlog, so an hour puts throughput before the wait of the other backlogs; a backlog with no work hands its turn on at once either way.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `3600000` |
| Kind | number |
| Restarts | `models` |
| From the module | Archive |

### `CFG_MODEL_SLOTS`

**Model requests in flight**. How many model-bound media steps (faces, picture vectors, text in pictures, text vectors, transcripts, voices) EiN keeps in flight against the media service at once. Whether each runs on the GPU or the CPU is the media service's decision; size this against its own model limit, since more slots than it runs at once only move the wait into its queue.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `2` |
| Kind | number |
| Restarts | `models` |
| From the module | Archive |

### `CFG_PIPELINE_PRUNE_INTERVAL`

**Pipeline cleanup interval (seconds)**. How often finished pipeline instances are pruned.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `3600` |
| Kind | number |
| Restarts | `pipeline-pruner` |

### `CFG_PIPELINE_MAX_OPEN_INSTANCES`

**Pipeline instances held open**. How many pipeline instances the engine holds open at once, including those waiting on a worker pool. Every stuck sweep re-advances each open instance, so raise it together with the sweep interval.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `5000` |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_PIPELINE_MAX_CONCURRENT`

**Pipeline steps in parallel**. How many inline pipeline steps the engine runs at once. Steps that are GPU- or CPU-heavy go to a worker pool instead and are bounded separately.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `4` |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_PIPELINE_CONSUME_CONCURRENCY`

**Queue consume concurrency**. How many queue entries the engine consumes in parallel.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `4` |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_PIPELINE_STEP_QUIET_MS`

**Quiet step warning (ms)**. How long a running pipeline step may go without writing any output before the pipeline overview flags it. A flagged step keeps running: no step is ever stopped for taking long.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `1800000` |
| Kind | number |

### `CFG_MEDIA_HEAL_REST`

**Rest after a full gap check (seconds)**. How long the background gap check waits after it has been through the whole archive before it starts over.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `21600` |
| Kind | number |
| Restarts | `media-heal` |
| From the module | Archive |

### `CFG_MODEL_SECOND_SLOTS`

**Second models worker's slots**. Slots of a second worker for the model-bound media steps, which goes through the same backlogs in the reverse order, so the media service runs a second model family beside the first worker's. 0 leaves it off. Size both workers' slots together against the media service's model limit, and mind its card: two families' models must fit there, or one runs on the CPU.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0` |
| Kind | number |
| Restarts | `models-second` |
| From the module | Archive |

### `CFG_PIPELINE_MAX_ADMITTED_STEPS`

**Steps held in flight**. How many dispatched steps the engine holds in memory before it stops claiming triggers. Work beyond it waits in the pool, where it costs nothing. Empty means 25 times the pipeline steps in parallel.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means 25 × pipeline steps in parallel |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_PIPELINE_STUCK_SWEEP_MS`

**Stuck sweep interval (ms)**. How often, at most, the engine re-advances its open instances to repair any that stopped without finishing, and how long it backs off while admission is full.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `60000` |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_PIPELINE_TRIGGER_CONCURRENCY`

**Trigger concurrency**. How many pipeline triggers the engine evaluates at once against incoming VFS events.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `4` |
| Kind | number |
| Restarts | `pipeline-engine` |

### `CFG_PIPELINE_KIND_QUANTUM_MS`

**Worker backlog rotation (ms)**. How long a pipeline worker that serves several kinds of job stays on one before rotating to the next when work remains on both. 0 always takes the highest-priority kind. Applies to workers whose service does not set its own rotation.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0` |
| Kind | number |
| Takes effect | Read by each pipeline worker when it starts: restart the services that run one. |

## Search

### `CFG_COMMAND_FINDER`

**Command finder**. The command that finds shell commands by what they are for, in the documentation's command search. Empty matches the words against command names and descriptions. The assistant sets itself here when it is installed.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means a match on names and descriptions |
| Kind | string |

### `CFG_LANGUAGE_MODEL`

**Language model command**. The command that asks a language model, for reading what a person writes as they write it — the search box's parser reads people, locations and words with it. Empty asks no model. The assistant sets itself here when it is installed.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means no model |
| Kind | string |

### `CFG_SEARCH_PARSER`

**Search parser**. The command that reads what is typed into the search box as filters — people, locations, years, kinds. Empty searches the words as they are. Archive sets its parser here when it is installed.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the words as they are |
| Kind | string |

### `CFG_TEXT_EMBEDDER`

**Text embedder**. The command that turns texts into vectors, for finding by meaning — the command finder ranks commands with it. Empty finds by words alone. The media service sets itself here when it is installed.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means by words alone |
| Kind | string |

## Sessions

### `CFG_SESSION_REAP_INTERVAL`

**Session cleanup interval (seconds)**. How often expired sessions and stranded terminals are collected, and expired share links turned off.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `3600` |
| Kind | number |
| Restarts | `session-reaper` |

### `CFG_SESSION_MAX_AGE_SEC`

**Session cookie lifetime**. How long a browser keeps its session cookie. Refreshed on every navigation, so this bounds idleness rather than total session age.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `86400` |
| Kind | number |

### `CFG_SESSION_EXPIRES_SEC`

**Session expiry**. How long after its last activity a session is collected by the reaper. A session keeps the value it was created with; one holding an open terminal is never collected, whatever this says.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `43200` |
| Kind | number |

### `CFG_TERMINAL_RECONNECT_GRACE_SEC`

**Terminal reconnect grace**. How long an interactive terminal survives without a browser connection, allowing reloads and short network interruptions to reattach. A change applies from the next disconnect.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `300` |
| Kind | number |

## Sharing

### `CFG_USER_DEFAULT_SHARE`

**How widely what you create is shared**. Where anything you create as shared starts out: private, shared with its group, or with everyone who has an account. "Default" follows the system setting.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `default` |
| Choices | `default`, `private`, `shared`, `everyone` |
| Kind | select |

## Shell

### `HISTSIZE`

**Shell history length**. How many commands the terminal remembers between sessions.

| | |
| --- | --- |
| Who it is for | Each person (Profile → Preferences) |
| Default | `1000` |
| Kind | number |

## Storage

### `CFG_TMP_RETENTION_HOURS`

**Hours in /tmp**. How long a file left in /tmp, such as a picture sent to search with, is kept before it is removed.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `24` |
| Kind | number |
| Restarts | `tmp-sweeper` |

## Transcription

### `CFG_WHISPER_VAD_MIN_SILENCE_MS`

**Silence that splits speech (ms)**. How long a pause must be before transcription treats it as the end of a stretch of speech. Empty uses the media service's own setting.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the media service decides |
| Kind | number |
| From the module | Media service |

### `CFG_WHISPER_LANGUAGE`

**Transcription language**. The language spoken in recordings, as a code such as sv or en, sent with every transcription. Empty lets the media service detect it, or use its own default.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the media service decides |
| Kind | string |
| From the module | Media service |

### `CFG_WHISPER_WORD_TIMESTAMPS`

**Word timings**. 1 asks transcription for the time of every word, 0 for timings per segment only. Empty uses the media service's own setting.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the media service decides |
| Choices | `1`, `0` |
| Kind | select |
| From the module | Media service |

## Trash

### `CFG_TRASH_RETENTION_DAYS`

**Days in the trash**. How long a trashed file stays restorable before it is removed for good.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `30` |
| Kind | number |
| Restarts | `trash-purger` |

## Users and sharing

### `CFG_DEFAULT_SHARE_GROUP`

**Default group**. The group anything created as shared belongs to. This is the grant that lets the rest of the household see it.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `users` |
| Kind | group |

### `CFG_DEFAULT_USER_GROUPS`

**Default groups for new users**. The groups a new account joins besides its own, as a comma-separated list of names. The New user form starts with them ticked, and user-create takes them unless --groups names others.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `users` |
| Kind | string |

### `CFG_DEFAULT_SHARE_OWNER`

**Default owner**. Who owns anything created as shared; a private album stays its creator's. Leave empty to let whoever creates it own it.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | empty, which means the person who creates it |
| Kind | user |

### `CFG_DEFAULT_SHARE_MODE`

**Default permissions**. Who may see and who may change anything created as shared: its owner, its group and everyone else, each with no access, view or edit. Everyone else is visitors who are not signed in, where they may browse, and anyone with an account outside the group. Kept as an octal mode, as in 0750.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0750` |
| Kind | mode |

### `CFG_GUEST_BROWSING`

**Visitors may browse**. Whether someone who has not signed in may browse the archive as the guest, seeing what is shared with visitors, rather than being asked to sign in. Off, the guest can only sign in or open a share link, in the web interface and through the API alike. Only on does the assistant's language model answer them. Off for a family's own archive; on for a public demo.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `false` |
| Kind | boolean |

## Voices

### `CFG_VOICE_ASD_VOTE_WEIGHT`

**Lip-sync vote weight**. How much it counts, as a similarity, that a person's face is seen speaking in step with the voice. Only voices someone named or locked are weighed against it.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.9` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_ASD_MIN_SCORE`

**Minimum lip-sync score**. How clearly a face must be seen speaking in step with a voice before that counts as a vote at all.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.6` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_MIN_CREATE_SECONDS`

**Speech to start a new person (seconds)**. How long a voice that matches nobody must have spoken in a recording, in all, before it starts a new, unnamed person. Voices heard for less stay unknown.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `10` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_PERSON_THRESHOLD`

**Voice likeness to the person**. How similar a voice must be to the average of a person's voices before it joins them. Stops a person drifting from one speaker to the next through a chain of loosely similar voices.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.7` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_ASD_PERSON_THRESHOLD`

**Voice likeness to the person seen speaking**. How similar a voice must be to the average of a person's voices before a face seen speaking with it may join them. Lower than the plain likeness bar, since the face is evidence too; it stops the camera operator's voice going to whoever is in frame.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.5` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_ATTACH_THRESHOLD`

**Voice match threshold**. How similar a voice in a recording must be to a known voice before it is attached to that person. Higher is stricter and produces fewer wrong matches but more unknown speakers.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.55` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_VOTE_THRESHOLD`

**Voice neighbour similarity**. How similar a known voice must be to count as a vote for its person. Voices less alike than this are ignored when deciding who is speaking.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `0.5` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_K`

**Voice neighbours compared**. How many of the most similar known voices are compared with each unknown one.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `24` |
| Kind | number |
| From the module | Archive |

### `CFG_VOICE_MARGIN`

**Voice winner margin**. How far the leading person's votes must outweigh the runner-up's before a voice is attached. 1.2 means 20% more; higher leaves close calls unknown.

| | |
| --- | --- |
| Who it is for | Everyone (an administrator sets it) |
| Default | `1.2` |
| Kind | number |
| From the module | Archive |
