# The language model

The assistant's chat, and the search box when you type a sentence, read people's words with a language model. This page is for the administrator who sets that model up: on the machine EiN runs on, on its graphics card or processor, or at a hosted provider, and how to check that it answers.

## What the language model is for

EiN asks the language model in three places:

- **The chat.** Every answer in the chat comes from the model, which runs EiN's commands to look things up. [Chatting with the assistant](../guide/assistant.md) shows it from the user's side.
- **The search box.** When someone types a sentence, such as `photos of Ruby Wrenfield from 1987`, the Archive's search parser asks the model which words are people, places, years and kinds of media. When the model does not answer within 20 seconds, the parser reads the sentence with its own rules instead, so search keeps working without it.
- **Plain picture requests in the chat**, such as "Show photos of Peggy Wrenfield from 1990", which go through the same search parser and are answered with one search.

All three belong to the **assistant** module. Without it installed, EiN asks no language model at all. Install it like any module: `~/ein/setup.sh --module assistant`, **Settings → Modules**, or `mod install assistant` ([Modules](modules.md)).

The language model does no media processing. Faces, picture descriptions, transcripts and the vectors that find things by meaning come from the [media service](media-service.md), which runs models of its own.

## Choose where the model runs

| Where                                 | How you set it up                                 | What it costs                                                                                                      |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| On this machine, on the graphics card | `setup.sh --llm` on a machine with an NVIDIA card | Part of the card's memory, shared with the media service. Answers in seconds.                                      |
| On this machine, on the processor     | `setup.sh --llm` on a machine without a card      | Memory and processor time. The answers are the same, only slower.                                                  |
| At a hosted provider                  | Four settings in `~/ein/.env`                     | The provider's charges. Questions, and what the assistant reads in the archive to answer them, leave your machine. |

The model EiN runs itself is Qwen3.5-4B in llama.cpp's server. The prompts, the chat's shortcuts and the assistant's test questions are tuned for that model, and it is the only one EiN calls tried. Any service that speaks the OpenAI chat API can stand in for it: a hosted provider such as OpenAI, OpenRouter, Mistral or Groq, or a server of your own such as vLLM, Ollama or LM Studio.

## Run the model on your machine

1. Add the model on the machine EiN runs on:

   ```bash
   # on the machine EiN runs on
   ~/ein/setup.sh --llm
   ```

   `setup.sh` keeps `EIN_LLM=1` in `~/ein/.env`, fetches the model's sources into `~/ein/src/llm`, adds an `llm` container, and restarts EiN. When the first install found an NVIDIA card (`EIN_GPU=1` in `.env`), the container gets the card. The installer takes the same option: `curl -fsSL https://einhq.eu/install.sh | bash -s -- --llm`.

2. Wait for the model to download. On its first start the container fetches the model file from Hugging Face into the `llm` folder of your data folder (`~/ein/data/llm` unless you chose another), a download of several gigabytes. Follow it with:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose logs -f llm
   ```

   The model is ready when the log says the server is listening on port 8190. A later start reads the file from disk and takes a minute or two.

3. Check that EiN reaches it. In EiN's terminal:

   ```bash
   # in EiN's terminal
   llm-status --checks
   ```

   ```text
   ok    llm  ours, qwen3.5-4b at http://llm:8190, on the card
   ```

   `on the CPU` instead of `on the card` means the model runs on the processor. [Check that the model answers](#check-that-the-model-answers) explains the other lines you may see.

4. Open the chat and ask something. The first answer after a start can take longer, while the model reads the assistant's instructions for the first time.

The commands on this page are written for podman. With Docker, write `docker compose` where they say `podman compose`.

### What the container runs

| What     | Value                                                                                     |
| -------- | ----------------------------------------------------------------------------------------- |
| Model    | `Qwen3.5-4B-Q8_0.gguf` from `unsloth/Qwen3.5-4B-GGUF`, named `qwen3.5-4b`                 |
| Server   | llama.cpp's server, a ready-made image pinned to one build                                |
| Address  | `http://llm:8190`, on the compose network only; nothing outside the containers reaches it |
| Context  | 32768 tokens: the most of a conversation the model reads at once                          |
| Requests | One at a time; a second question waits until the first is answered                        |
| Memory   | At most 10 GB (`LLM_MEMORY`)                                                              |
| Thinking | Off, unless a question asks for it (the chat's **Think harder**)                          |

The server keeps what it last read in a cache, so a follow-up question in the same chat reads only the new message. It stays loaded between questions.

### Share the graphics card with the media service

With the media service on the same card, the two divide its memory. The model loads as many of its layers onto the card as fit while leaving `LLM_CARD_RESERVE_MB` free, 8800 MB unless you change it, and runs the rest on the processor. On a 16 GB card every layer fits; on a smaller one some run on the processor, and the answers come more slowly.

To change the division, set both sides in `~/ein/.env` and apply it:

```ini
# in ~/ein/.env
LLM_CARD_RESERVE_MB=8800   # what the model leaves free on the card
EMS_CARD_SHARE_MB=8000     # the most the media service takes; a little less than the line above
```

```bash
# on the machine EiN runs on, in ~/ein
podman compose up -d
```

[The graphics card](gpu.md) covers the card itself, and [Performance and sizing](performance.md) how much card and memory each part needs.

### Settings for the container

These go in `~/ein/.env` and take effect at the next `podman compose up -d`.

| Variable              | Default                   | What it sets                                                     |
| --------------------- | ------------------------- | ---------------------------------------------------------------- |
| `LLM_GGUF_REPO`       | `unsloth/Qwen3.5-4B-GGUF` | The Hugging Face repository the model file comes from            |
| `LLM_GGUF_FILE`       | `Qwen3.5-4B-Q8_0.gguf`    | The model file                                                   |
| `LLM_CARD_RESERVE_MB` | `8800`                    | How much of the card the model leaves free for the media service |
| `LLM_MEMORY`          | `10g`                     | The most memory the container may use                            |
| `LLM_IMAGE`           | a pinned llama.cpp build  | The server's image                                               |

> [!WARNING]
> The container's chat template is written for Qwen3.5, and the server names whatever it loaded `qwen3.5-4b`. A model of another family needs its own template, which `.env` cannot choose, and the health check cannot tell that it is not the tried model. Change `LLM_GGUF_FILE` only to another quantisation of Qwen3.5-4B, or use a server of your own and point EiN at it as described below.

## Use a hosted provider instead

1. Open `~/ein/.env` on the machine EiN runs on. The file has the lines ready, commented out. Remove the `#` and fill them in:

   ```ini
   # in ~/ein/.env
   CFG_LLM_URL=https://api.openai.com
   CFG_LLM_KEY=<the key the provider gave you>
   CFG_LLM_PROVIDER=OpenAI
   CFG_LLM_MODEL=<the model's name, as the provider writes it>
   ```

   - `CFG_LLM_URL` is the address of the API without `/v1`.
   - `CFG_LLM_PROVIDER` is the name the chat shows. Always set it for a hosted model: while it is empty, EiN treats the model as running on your machine and tells no one that their questions leave it.
   - `CFG_LLM_MODEL` must be a model the provider offers. Left out, EiN asks for `qwen3.5-4b`, which a provider does not have.

2. Apply it. If the model was running on your machine, take it out at the same time:

   ```bash
   # on the machine EiN runs on, in ~/ein
   ./setup.sh --no-llm      # removes the llm container and restarts EiN; the model file stays
   ```

   Otherwise `podman compose up -d` is enough.

3. Check it with `llm-status --checks` in EiN's terminal:

   ```text
   ok    llm  OpenAI's <model> at https://api.openai.com: questions, and what the assistant reads to answer them, leave this host
   warn  llm model  <model> is untried: the prompts, the fast path and the eval set are tuned for qwen3.5-4b; run agent-eval against it before trusting it
   ```

   The second line is expected for every model but Qwen3.5-4B. It is a warning only: the chat answers, but nobody has measured how well. [Try a model before you rely on it](#try-a-model-before-you-rely-on-it) shows how to measure it.

The same settings are on **Settings → System**, in the **Assistant** category, for an administrator who prefers the web interface: **Language model address**, **Language model key**, **Language model provider** and **Language model**. A value saved there wins over `.env` and shows the badge **Set here**; a value from `.env` shows **From deployment**. **Restore inherited value** goes back to the one from `.env`. In the terminal, `config-set CFG_LLM_PROVIDER OpenAI` does the same as saving it on the page ([reference](../reference/commands-core.md#config-set)).

### What a provider receives

Once `CFG_LLM_PROVIDER` is set, the chat shows a line above the question box, with a globe icon:

```text
Answered by OpenAI: your questions, and the names, places and search results used to answer them, leave this server.
```

What goes to the provider is each question, the page the person is on, their name, and everything the commands print while the assistant looks things up: names, dates, places, captions, and the text of files it reads. Sentences typed into the search box go there too, since the search parser asks the same model. Pictures, videos and recordings are never sent. Tell the people who use your EiN before you switch.

### How the key is kept

The key is a secret. No shell in EiN sees it, `config-get CFG_LLM_KEY` says only whether it is set, and the settings page shows **Set — type a new one to replace it** rather than the key. A key saved on the settings page is kept in `/etc/keys`, which only an administrator can read; one in `.env` stays in EiN's own process. EiN sends the key only to the address in `CFG_LLM_URL` as the system has it, never to an address someone puts in front of a command.

## Check that the model answers

| Where                                    | What it tells you                                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `llm-status`                             | Whose the model is and where it runs, from the settings alone, without asking the model                           |
| `llm-status --checks`                    | Whether the model answers, whose it is, where it runs, and whether it is the tried model. `health` reads the same |
| **Dashboard → Services**, row `llm-link` | The same checks in one line                                                                                       |
| **About EiN**, in the account menu       | A **Language model** tile with the model's name, and "on this host" or the provider's name under it               |
| `podman compose logs llm`                | The server's own log, for a model on your machine                                                                 |

![The Services tab of the system dashboard, listing EiN's services; the llm-link row says "ours, qwen3.5-4b at" the model's address](../../assets/shots/system-services.webp "The llm-link row shows at a glance whether the chat's model answers and where it runs.")

`llm-link` is not the model itself but a service of the assistant module that watches it. Once a minute it asks the model whether it answers, and writes a line to its log each time the answer changes, so `/var/logs/services/llm-link/stdout.log` shows when the model went away or came back:

```text
llm-link: watching ours at http://llm:8190
llm-link: ours, qwen3.5-4b at http://llm:8190, on the card
llm-link: http://llm:8190 is not answering; the chat cannot answer until it does
```

The log starts over each time the service starts. A model that does not answer is a warning in `health`, never a failure: the archive's work goes on without it. [Health and the dashboard](monitoring.md) and [Services and logs](services-logs.md) cover both in general.

## Settings

All of these are system settings, on **Settings → System → Assistant**, in `~/ein/.env`, or with `config-set`. [Configuration](configuration.md) explains where a value comes from and which one wins.

| Setting                                                             | Label on the settings page                | Default                 | What it does                                                                                                                                            |
| ------------------------------------------------------------------- | ----------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`CFG_LLM_URL`](../reference/settings.md#cfg_llm_url)               | **Language model address**                | `http://127.0.0.1:8190` | The API's address, without `/v1`. The compose install sets `http://llm:8190`.                                                                           |
| [`CFG_LLM_MODEL`](../reference/settings.md#cfg_llm_model)           | **Language model**                        | `qwen3.5-4b`            | The model name sent with each request. llama.cpp answers with the model it loaded, whatever this says.                                                  |
| [`CFG_LLM_KEY`](../reference/settings.md#cfg_llm_key)               | **Language model key**                    | not set                 | The bearer key a provider expects.                                                                                                                      |
| [`CFG_LLM_PROVIDER`](../reference/settings.md#cfg_llm_provider)     | **Language model provider**               | empty                   | The provider's name. Empty means the model runs on this host.                                                                                           |
| [`CFG_LLM_CARD`](../reference/settings.md#cfg_llm_card)             | **Where our language model runs**         | empty                   | `card` or `cpu`, for the status lines. `setup.sh --llm` sets it from whether the machine has a card.                                                    |
| [`CFG_LLM_THINKING`](../reference/settings.md#cfg_llm_thinking)     | **Think before answering**                | empty                   | `1` or `0` turns the model's thinking on or off for every question that does not ask otherwise. Only llama.cpp reads it; empty leaves it to the server. |
| [`CFG_LLM_MAX_TOKENS`](../reference/settings.md#cfg_llm_max_tokens) | **Answer length (tokens)**                | `2048`                  | How much the model may write in one step of an answer. A model that thinks needs more.                                                                  |
| [`CFG_LLM_WAIT`](../reference/settings.md#cfg_llm_wait)             | **Wait for the language model (seconds)** | `180`                   | How long a chat question waits for a model that is restarting or loading before it gives up. `0` gives up at once.                                      |
| [`CFG_LANGUAGE_MODEL`](../reference/settings.md#cfg_language_model) | **Language model command**                | empty                   | The command the search parser asks. The assistant module sets it to `llm-chat`; empty, the search box reads sentences by its rules.                     |

A change on the settings page restarts `llm-link`, and the next question uses the new value; EiN itself does not restart. A change in `.env` takes effect at the next `podman compose up -d`, unless the same setting has been saved on the settings page.

## Ask the model directly

`llm-chat` sends one question to the model, with nothing from the archive, and prints the answer. It is the quickest way to see that the model answers and how fast:

```bash
# in EiN's terminal
llm-chat 'Answer in one word: what colour is the sky?'
llm-chat --system 'Answer in one word.' 'The colour of grass?'
```

It gives up after 180 seconds (`--timeout`) and does not wait for a model that is restarting. [`llm-chat`](../reference/commands-assistant.md#llm-chat) lists its options.

### Try a model before you rely on it

`agent-eval` asks the chat the test questions every module ships, against your real archive, and scores whether the model reached the right commands and answered. Run it after switching to another model, and compare it with a run on the default one:

```bash
# in EiN's terminal
agent-eval --limit 5 --verbose
nohup agent-eval --out /tmp/agent-eval.json
```

A full run asks many questions and can take a long time; `--out` writes the results after every question, so a closed terminal loses nothing. [`agent-eval`](../reference/commands-assistant.md#agent-eval) lists its options.

## Who may use the model

Everyone who has signed in can use the chat and the model. People who have not signed in, such as visitors through a share link, may use it only where the archive is open to visitors; otherwise the model refuses them with `sign in to use the language model`. [Permissions in depth](permissions.md) covers opening the archive to visitors.

## Take the model away

```bash
# on the machine EiN runs on, in ~/ein
./setup.sh --no-llm
```

This removes the `llm` container and restarts EiN. The model file stays in the `llm` folder of your data folder, so `--llm` later starts without downloading it again; delete the folder to free the space. With no model, the chat waits for `CFG_LLM_WAIT` seconds and then answers **Assistant unavailable**, and the search box reads sentences by its rules. To remove the chat altogether, remove the assistant module ([Modules](modules.md)).

## When something goes differently

| What you see                                                                          | What to do                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every chat question waits three minutes, then shows **Assistant unavailable**         | No model answers. Run `llm-status --checks`. Without `--llm` and without a provider in `.env`, there is no model: add one as above.                                                                                    |
| `http://llm:8190 is not answering; the chat cannot answer until it does`              | The container is not running or still loading. Look at `podman compose ps` and `podman compose logs llm`. On the first start it may still be downloading the model.                                                    |
| The chat says "The language model is restarting; waiting for it…" after a restart     | The model is loading. The chat waits up to `CFG_LLM_WAIT` seconds and goes on when it answers.                                                                                                                         |
| `llm-status --checks` says `on the CPU`, or answers are slow on a machine with a card | Either `EIN_GPU=0` in `.env`, or the media service left too little of the card. See [Share the graphics card with the media service](#share-the-graphics-card-with-the-media-service) and [The graphics card](gpu.md). |
| The `llm` container restarts again and again                                          | It is out of memory, or the card filled while it loaded. Look at `podman compose logs llm`; give it more with `LLM_MEMORY`, or leave more of the card free for it.                                                     |
| `OpenAI does not offer qwen3.5-4b; the chat's questions to it fail`                   | `CFG_LLM_MODEL` is not set, or names a model the provider does not have. Set it to one of the provider's models.                                                                                                       |
| A hosted model answers `HTTP 401` in the error card's small type                      | The key is wrong or missing. Set `CFG_LLM_KEY` again. A key saved on the settings page wins over the one in `.env`.                                                                                                    |
| You changed `CFG_LLM_URL` in `.env` and nothing changed                               | The setting is saved on **Settings → System**, which wins. Click **Restore inherited value** there, or change it there instead.                                                                                        |
| **Answer too long** in the chat                                                       | The answer reached **Answer length (tokens)**. Asking for less usually helps; a higher `CFG_LLM_MAX_TOKENS` lets the model write more.                                                                                 |
| The chat has no provider line, but the model is hosted                                | `CFG_LLM_PROVIDER` is empty. Set it, so the people using EiN know where their questions go.                                                                                                                            |

[Troubleshooting](troubleshooting.md) has more, and [Chatting with the assistant](../guide/assistant.md#when-the-assistant-cannot-answer) explains the chat's error cards from the user's side.
