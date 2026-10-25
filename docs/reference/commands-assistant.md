<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Assistant commands

The commands the assistant module adds. They are there once the module is installed. 6 of them, by name. Every command also says this with `--help`; [Commands](commands.md) explains how to read an entry.

[agent-eval](#agent-eval) · [assistant-ask](#assistant-ask) · [assistant-chat](#assistant-chat) · [assistant-commands](#assistant-commands) · [llm-chat](#llm-chat) · [llm-status](#llm-status)

## A

### `agent-eval`

Ask the chat's loop the modules' questions against the real archive, and score what happens.

<small>reads only</small>

```text
agent-eval [--fixtures=<path>] [--bucket=<string>] [--ids=<string>] [--limit=<number>] [--verbose] [--prompt=<path>] [--print-prompt] [--user=<path>] [--out=<path>]
```

| Option | What it does |
| --- | --- |
| `--fixtures=<path>` | a file of questions to ask (default: every module's, in its drop-in's eval.json) |
| `--bucket=<string>` | only questions from this bucket. |
| `--ids=<string>` | only these questions, by id, comma-separated. |
| `--limit=<number>` | stop after this many questions. |
| `--verbose` | a line per question as it finishes. |
| `--prompt=<path>` | the prompt file to use (default /etc/assistant-prompt.md) |
| `--print-prompt` | print the system prompt and the tool schemas the model is given, and stop. |
| `--user=<path>` | the person to ask as, by path (default: the person linked to the account running it) |
| `--out=<path>` | write the results here after every question, so a dropped session loses nothing. |

```bash
agent-eval --limit 5 --verbose
agent-eval --bucket kin
nohup agent-eval --user /archive/people/Anna_Exempel --out /tmp/agent-eval.json
```

With `JSON_OUTPUT=1`: a summary — the model that answered, how often the right command was reached, how many lines ran, how many questions were answered — and the turns of each question.

### `assistant-ask`

Answer a question about EiN by running its commands (the chat drawer's backend)

<small>changes things</small>

```text
assistant-ask [--think] [--resume] [--chat=<string>] [--history=<string>] [--context=<string>] [--max-steps=<string>] [--progress=<string>] <message>
```

| Argument | What it is |
| --- | --- |
| `<message>` | what the user wrote; none with --resume. |

| Option | What it does |
| --- | --- |
| `--think` | think before every model call: slower, fewer malformed commands. |
| `--resume` | go on with the chat's last turn after the user ran or declined its proposal. |
| `--chat=<string>` | durable chat id; loads and appends history in $HOME/.chats. |
| `--history=<string>` | earlier turns as a JSON array of {role: user\|assistant, content}. |
| `--context=<string>` | what the UI shows, as JSON {route?, section?, title?, about?, node?, lightbox?, shown?: [paths already shown]}. |
| `--max-steps=<string>` | tool calls allowed before the model must answer (default 12) |
| `--progress=<string>` | ephemeral turn id whose waiting/thinking phase may be read while this command runs. |

### `assistant-chat`

List, create, read, or delete durable assistant chats; read a turn in flight; record how a proposal ended; the questions the modules suggest.

<small>reads only</small>

```text
assistant-chat [--error=<string>] [--results=<string>] [--script=<string>] <action> [<id>] [<message>] [<status>]
```

| Argument | What it is |
| --- | --- |
| `<action>` | list, create, read, delete, progress, examples, or outcome. |
| `[<id>]` | chat id for read/delete/outcome. |
| `[<message>]` | outcome: id of the message carrying the proposal. |
| `[<status>]` | outcome: ran, failed, or dismissed. |

| Option | What it does |
| --- | --- |
| `--error=<string>` | outcome: what the failed command said. |
| `--results=<string>` | outcome: JSON array of {command, ok, exitCode?, output}, what each command said. |
| `--script=<string>` | outcome: the block as run, when the user edited it first. |

### `assistant-commands`

Find a command by what it is for, judge whether a line changes anything, or rebuild the assistant's command index.

<small>reads only</small>

```text
assistant-commands [--limit=<number>] <action> <text>...
```

| Argument | What it is |
| --- | --- |
| `<action>` | find, judge or reindex. |
| `<text>...` | find: what the command should do; judge: the shell line. |

| Option | What it does |
| --- | --- |
| `--limit=<number>` | find: how many commands (default 8) |

```bash
assistant-commands find 'list running services'
assistant-commands judge 'service restart pipeline-pruner'
```

With `JSON_OUTPUT=1`: find: the best commands with name, description, effect and score; judge: read or write with the reasons; reindex: how many commands were indexed.

## L

### `llm-chat`

Ask the assistant's language model one thing, and print what it answers.

<small>reads only</small>

```text
llm-chat [--system=<string>] [--history=<string>] [--max-tokens=<number>] [--timeout=<number>] [--think] <message>...
```

| Argument | What it is |
| --- | --- |
| `<message>...` | what to ask. |

| Option | What it does |
| --- | --- |
| `--system=<string>` | the system text: what the model is and how to answer. |
| `--history=<string>` | earlier turns, as JSON: [{"role":"user"\|"assistant","content":"…"}]. |
| `--max-tokens=<number>` | the most the answer may be (default 768) |
| `--timeout=<number>` | seconds to wait for the answer (default 180) |
| `--think` | let the model think before it answers. |

```bash
llm-chat 'Vad är huvudstaden i Norge?'
llm-chat --system 'Answer in one word.' 'The colour of the sky?'
```

With `JSON_OUTPUT=1`: content, the answer, and model, the model that wrote it.

### `llm-status`

Whose the assistant's language model is, where it runs, and (with --checks) whether it answers.

<small>reads only</small>

```text
llm-status [--checks] [--brief]
```

| Option | What it does |
| --- | --- |
| `--checks` | The checks health reads: whether it answers, where it is, whether its model has been tried. |
| `--brief` | The checks in one line (used by service-list --detail) |

```bash
llm-status
llm-status --checks
```

With `JSON_OUTPUT=1`: url, model, kind (ours or external), provider for an external one, card (card or cpu) for ours. With --checks, health's checks.
