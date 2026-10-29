# Teaching the assistant

The assistant knows no module by name: everything it can do with your module, it learns from a few files your module ships. This page is for module developers who want the chat to answer questions about their part, and for administrators who want to change what the assistant is told. It applies once the [Assistant](index.md) module is installed.

What the chat looks like to the people who use it is in [Chatting with the assistant](chat.md). Where the language model runs and how to point EiN at another one is in [The language model](language-model.md).

## How the assistant learns about a module

Each turn of the chat is a short loop. The language model is given a system message and a list of tools, calls one tool at a time, reads what the command printed, and finally answers with a tool called `final_answer`. At most 12 tool calls are made before the model must answer.

Both the system message and the tools are put together from the installed modules each time:

- The tools are the commands the modules list, each described by its own `--help` spec, plus `find_commands`, `command_help`, `run_command` and `final_answer`.
- The system message is the prompt file `/etc/assistant-prompt.md`, then what each module says about its part.
- The cards an answer can carry, the questions an empty chat suggests and the questions `agent-eval` asks also come from the modules.

A module gives all of this in one directory, `etc/assistant.d/`. When an administrator runs `mod setup`, that directory is linked as `/etc/assistant.d/<module>/`, and the setup log says `Linked assistant.d at /etc/assistant.d/<module>` (`Assistant.d already linked at …` when the link is there already). The assistant reads every directory under `/etc/assistant.d/` in name order, as the user who is asking. Every file is optional; a module ships only the ones it needs.

| File         | What it gives the assistant                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `tools`      | The module's commands that the model may call directly, one name a line.                             |
| `prompt.md`  | What the model should know about the module's part: where things are and which command answers what. |
| `cards.json` | Pages of the module that can be drawn under an answer: a map, a family tree, a chart.                |
| `examples`   | Questions the chat suggests before anything has been asked, one a line.                              |
| `eval.json`  | Questions with known good commands, for `agent-eval` to measure the assistant with.                  |

The assistant module ships its own drop-in this way (the `ls`, `stat`, `find` and `cat` tools and the chart card), and so does the Archive (its search, people and location commands, the family tree and map cards). The media service and importer modules ship none.

```text
modules/<module>/
├── mod.json
├── bin/
│   └── recipe-search
└── etc/
    └── assistant.d/
        ├── tools
        ├── prompt.md
        ├── cards.json
        ├── examples
        └── eval.json
```

Because the directory is linked rather than copied, an edit to a file in it is seen without running `mod setup` again, and `mod remove` takes the link away. How a module is laid out in general is in [Writing a module](../develop/modules.md).

## Offer a command as a tool

List the commands the model should be able to call directly in `etc/assistant.d/tools`, one a line. A `#` starts a comment. A command that two modules list is offered once.

```text
# The commands the recipes module offers the assistant's model as tools, one a line.
recipe-search
recipe-info
recipe-add-note
```

The assistant asks each listed command for its spec with `JSON_OUTPUT=1 <command> --help` and turns the spec into a tool. Nothing about the command is written down twice: what `--help` says is exactly what the model reads. A listed command that does not answer `--help` with a spec is left out of the tools, and asked again on the next turn.

### Commands you do not list are still reachable

You do not have to list every command. The model can search for any command on the asking user's path by what it should do (`find_commands`), read its spec (`command_help`) and run a shell line (`run_command`). Listing a command saves the model those steps and makes it the obvious choice, so list the few commands that answer most questions about your part, and leave the rest to the search.

The search ranks commands by their name, description and `returns` sentence, so a clear description helps there too. Try it from EiN's terminal:

```bash
# in EiN's terminal
assistant-commands find 'find a recipe by ingredient'
```

The answer lists the best commands with their description, whether they change anything, and a score. An administrator's command (`admin: true` in its spec) is only found for administrators, a daemon is never run from the chat, and `edit`, `login`, `logout`, `assistant-ask` and `agent-eval` are refused outright. The full list of the command's options is in [the command reference](commands.md#assistant-commands).

### Write a spec the model can use

A small model calls a command exactly as its spec describes it. Give every command you list:

| Field         | What the model gets from it                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `description` | What the command is for, in one sentence. The first line of the tool's description.                        |
| `args`        | Positional arguments, each a property of the tool under its own name, with its description.                |
| `flags`       | Each flag a property of the tool. `type` is required: `bool` makes a switch, any other type takes a value. |
| `examples`    | One or two real command lines, without a prompt. Shown to the model under `Examples:`.                     |
| `returns`     | What the command answers with under `JSON_OUTPUT=1`, in a sentence. Shown under `Returns:`.                |
| `effect`      | `read` or `write`. Decides whether the chat runs a line at once or shows it to the user first.             |

How a spec becomes a tool:

- A positional argument is required unless its description contains "optional" or "default", as in `day as MM-DD (default today)`. Say so in the description of every argument that may be left out.
- An argument marked `variadic` becomes a list.
- A flag marked `repeatable` becomes a list, and each entry is passed as its own `--flag=value`. Use it where a user might name several things, such as two people in one search.
- When a short and a long flag have the same description, only the long one is offered.
- A long flag is always written as `--flag=value`, so a value starting with a dash (a longitude west of Greenwich) is not read as another flag.

A TypeScript command carries its spec as a `spec` property. This is the Archive's `file-set-description`:

```ts
fileSetDescription.spec = {
  name: 'file-set-description',
  effect: 'write' as const,
  description: "Set a file's hand-written description",
  args: [
    { name: 'file', type: 'path' as const, description: 'VFS path to file node' },
  ],
  flags: [
    { name: 'text', type: 'string' as const, description: 'the description; empty clears it' },
    { name: 'text-base64', type: 'string' as const, description: 'the description, base64-encoded (for multi-line text)' },
  ],
  examples: [
    "file-set-description --text 'Ett exempel' /archive/albums/Exempelalbum_2019/files/IMG_0042.jpg",
  ],
  returns: 'nothing; the description is written.',
};
```

A bash command declares the same with the `arg` builtin. This is the Archive's `person-create`, with some of its options left out:

```bash
#!bash
arg --desc "Create a person node"
arg --effect write
arg '<target>' path "VFS path for the person node"
arg -n --name string "Display name"
arg -b --born string "Birth date (YYYY[-MM[-DD]])"
arg --example "person-create /archive/people/Disa_Exempel --name 'Disa Exempel' --born 2019-01-01"
arg --returns "nothing; the person node is created."
arg --export
```

An optional bash argument (`arg [<name>] type = default "desc"`) needs the word "optional" or "default" in its description too, or the model is told it is required.

Check what the model will read with the command's own help:

```bash
# in EiN's terminal
JSON_OUTPUT=1 recipe-search --help
```

### Commands that change things become proposals

The chat never runs a change on its own. Every line the model wants to run, whether a listed tool or a `run_command` line, is judged against the specs of the commands in it. A line that only reads runs at once and its output goes back to the model. A line that writes ends the turn with a card showing the exact line, and runs only when the user clicks **Run**, as that user. After **Run** or **Decline** the turn goes on, and the model reads what the line printed or that it was declined.

So `effect` matters more than any other field:

- `read`: running it never changes anything.
- `write`: it changes something every time.
- A command that does both is `read`, with what makes it a write marked: a flag with `writes: true`, an argument with `writes: true` (any value) or `writes: ['create', …]` (only those values). In bash: `arg --writes <name> [value…]`.
- A flag with `dryRun: true` reports what the command would do: a line that uses it is a read, even for a `write` command.

A command without `effect` is judged a write, so the user is asked before it runs even when it only reads. You can see how a line is judged:

```bash
# in EiN's terminal
assistant-commands judge 'recipe-add-note /home/anna/recipes/Bread --text "Less salt"'
```

The answer says `read` or `write`, with the reasons. How a command's spec is written in general is in [Writing a module](../develop/modules.md).

## Tell the model about your part

The model knows the node types every EiN has, but nothing about where your module keeps things or which of your commands answers what. Write that in `etc/assistant.d/prompt.md`. Each module's text follows the prompt file in the system message, in module name order, separated by a blank line.

Write it for a small model that reads it before every question:

- Say where your nodes live, as paths: `recipes are /home/<user>/recipes/<Recipe>, each with ingredients/ and notes/`.
- Name your node types and the attributes that matter, and which command reads them.
- Map kinds of questions to commands, one bullet each: what the user asks, the command, and how to call it. The Archive's `prompt.md` is a good model: "Birthdays and anniversaries: events. Never a search bounded by today's date."
- Say what the model must not do, where it would otherwise guess, such as working out a family relation itself instead of calling the command that walks the tree.
- Leave out what the tool specs already say. The model reads every flag's description in the tool list; the prompt is for choosing between commands, not for repeating them.

Keep it short. Every word is read on every turn, and the model's context is limited.

## Draw a card under an answer

A card is one of your module's pages, drawn under the answer as a panel. The assistant knows none of them: a module offers its cards in `etc/assistant.d/cards.json`, a list of objects, and each card becomes an optional property of `final_answer`. When the model gives that property, what it filled in becomes the page's query string.

| Field         | What it is                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | The card's property in `final_answer`, such as `map`. Characters other than letters, digits and `_` become `_`.                                                  |
| `route`       | A route of your module's, declared in `ui.routes` in `mod.json`, such as `/map/pins`.                                                                            |
| `description` | When the card is wanted, and how to fill it in. The model reads this to decide; say "only when the user asks for a map" when that is what you mean.              |
| `params`      | A JSON Schema of the route's query: `type: "object"`, `properties` and `required`.                                                                               |
| `fill`        | Optional. A parameter filled with the paths of the pictures the answer shows when the model names none: `{ "paths": "pictures" }`. `pictures` is the only value. |

This is the Archive's map card:

```json
[
  {
    "name": "map",
    "route": "/map/pins",
    "description": "A map under the answer, only when the user asks where something is or for a map. Name the locations and pictures a result gave you by path, and the areas location-region looked up by the name you gave it; name nothing to pin the pictures the answer shows. The app pins each one where the archive has it: never write coordinates.",
    "params": {
      "type": "object",
      "properties": {
        "title": { "type": "string", "description": "A short title, in the language of the reply." },
        "paths": { "type": "array", "items": { "type": "string", "format": "path" }, "description": "Locations or pictures a result named." },
        "areas": { "type": "array", "items": { "type": "string" }, "description": "Areas location-region looked up this turn: a city, a country." }
      }
    },
    "fill": { "paths": "pictures" }
  }
]
```

What the model fills in is checked before it becomes a query:

- A string with `"format": "path"` must be an absolute path the asking user can see; any other is left out.
- A `number` or `integer` that is not a number is left out. Text is cut at 400 characters, and a list at 100 values.
- A list of strings or numbers becomes one query value per item (`?paths=…&paths=…`). A list of objects, or an object, becomes its JSON text in one value, which your page parses.
- A card with a `required` parameter missing, or with nothing in its query at all, is dropped.
- The names `answer`, `paths`, `links` and `table` belong to `final_answer`. A card with one of those names, or a name another module already took, is offered as `<module>_<name>`.

The chat stores only the route with its query, and draws it when the message is shown. Your page reads its query (with `useSearchParams` from `react-router-dom`) and fetches what it shows with ordinary commands, as the person looking at it. A card therefore shows what EiN holds when it is drawn, never values the model wrote down, and its address is a page of its own as well. Keep the page compact: it is drawn in the chat's column, between the answer and the next message. How a module declares its pages is in [The module manifest](../develop/manifest.md).

A card is not a table. For many rows, the model uses `final_answer`'s own `table`: it names the line that prints the rows, and the chat runs it and draws every row, so your command only has to print them.

## Suggest questions

An empty chat shows "Ask about what is kept here, or about EiN itself." and, under it, "For example:" with two suggested questions. They come from the modules' `etc/assistant.d/examples`, one question a line, with `#` lines as comments:

```text
# Questions the chat suggests before anything is asked, one a line.
Which recipes use rhubarb?
```

All modules' questions are put together in module name order, and the first two are shown, so with the Archive installed its questions come first. `assistant-chat examples` prints the whole list.

## Measure the assistant with agent-eval

A change to a spec, a prompt or a card description can make the model better at one kind of question and worse at another. `agent-eval` asks a set of questions through the chat's own loop, against the real data on the machine, and scores what happened. Nothing is changed: a line that would write is recorded as a proposal, as the chat would show it.

### Write questions in eval.json

Each module keeps the questions about its part in `etc/assistant.d/eval.json`:

```json
{
  "note": "Questions for agent-eval about recipes.",
  "resolvers": ["recipe-search"],
  "questions": [
    {
      "id": "find-by-ingredient",
      "bucket": "search",
      "lang": "en",
      "ask": "Which recipes use rhubarb?",
      "commands": ["recipe-search"]
    },
    {
      "id": "note-on-open-recipe",
      "bucket": "write",
      "lang": "en",
      "ask": "Add a note to this recipe: less salt next time",
      "context": { "node": "/home/anna/recipes/Bread" },
      "commands": ["recipe-add-note"]
    }
  ]
}
```

| Field       | What it is                                                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | A short name for the question, for `--ids`.                                                                                                        |
| `bucket`    | A group of questions, for `--bucket`: `search`, `kin`, `write`, whatever suits your part.                                                          |
| `lang`      | `sv` or `en`: the language the answer must be in.                                                                                                  |
| `ask`       | The question, as a user would type it.                                                                                                             |
| `context`   | Optional. What the app shows when it is asked: `route`, `section`, `title`, `about`, `node`, or `lightbox` for a picture open in the viewer.       |
| `commands`  | The commands that do the job. Reaching any of them counts. An empty list means the question should be answered without a command, like a greeting. |
| `resolvers` | At the top level. Commands that turn a name into a path, so calling one of them first is not counted as a wrong first choice.                      |

### Run it

`agent-eval` runs in EiN's terminal, as the account you are signed in with. By default it asks as the person linked to that account, as the chat does, so questions with "my" and "I" can be answered.

```bash
# in EiN's terminal
agent-eval --limit 5 --verbose
agent-eval --bucket write
agent-eval --print-prompt
```

- `--verbose` prints a line per question as it finishes, such as `find-by-ingredient: reached recipe-search via recipe-search`.
- `--print-prompt` prints the whole system message and every tool schema the model is given, and stops. It is the quickest way to see what your `prompt.md`, `tools` and `cards.json` turned into.
- `--fixtures=<path>` asks the questions of one file instead of every module's, and `--prompt=<path>` tries another prompt file without replacing the installed one.
- `--user=<path>` asks as another person, by the path of their node.

At the end it prints a summary as JSON: the model that answered, how many questions there were, how many reached one of their commands (`reached`) and how many did so first (`firstChoice`), how many were answered and in the right language, how many lines ran, failed or became proposals, and the time per question, with how much of it the model took.

A full run over every module's questions takes a long time. Run it so it survives a dropped connection, and keep the results in a file that is written after every question:

```bash
# in EiN's terminal
nohup agent-eval --out /tmp/agent-eval.json
```

The file holds the summary and, for each question, every call the model made and the conversation exactly as it was sent. The chat's prompts and fast answers are tuned for `qwen3.5-4b`; a run names the model that answered it, so you can compare runs on different models. Every option is in [the command reference](commands.md#agent-eval).

## When a change is seen

| You change                   | When the chat sees it                                                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A file in `etc/assistant.d/` | `prompt.md`, `cards.json` and the list in `tools` on the next question. `examples` the next time the web interface is loaded.                                                                                       |
| A listed command's spec      | Specs are kept for ten minutes, so within ten minutes, or at once after EiN restarts.                                                                                                                               |
| A command found by search    | The command search asks a command for its spec again once its file has changed, as `mod setup` and an update do, and finds a new command within a minute. `assistant-commands reindex` rebuilds the search at once. |
| `/etc/assistant-prompt.md`   | On the next question.                                                                                                                                                                                               |

A chat that is already going on keeps working after such a change. The first turn after it is slower: the new system message and tools replace the old ones at the top of the conversation, and the model reads the whole chat again from the start.

## Change the assistant's main prompt

The rules every module's text follows are in `/etc/assistant-prompt.md`: how to work, the node types every EiN has, which command to use for the system's own questions, how to write the reply, and that the reply is in the language of the user's question. An administrator can edit it in EiN's terminal with the [editor](../shell/editor.md):

```bash
# in EiN's terminal, as the administrator
edit /etc/assistant-prompt.md
```

The assistant module ships this file and `mod setup` copies it only when it is not there yet (the setup log says `etc/assistant-prompt.md already exists, skipping`). Your edits are therefore kept across updates, and so are the old rules: a newer version of the module's prompt is not installed over yours. To take the module's version, move your file aside and set the module up again:

```bash
# in EiN's terminal, as the administrator
mv /etc/assistant-prompt.md /etc/assistant-prompt.md.mine
mod setup assistant
```

Try a changed prompt before you install it with `agent-eval --prompt=<path>`.

> [!NOTE]
> Without a readable `/etc/assistant-prompt.md` the assistant has no system message and cannot answer; the chat says the assistant is unavailable.

## When something goes differently

- **Your command never appears in the tools.** Run `agent-eval --print-prompt`. If it is missing there, `agent-eval` also says `agent-eval: <command> did not describe itself; it is offered by nothing`: the command is not on the path, or its `--help` does not answer with a spec under `JSON_OUTPUT=1`. Check that `mod setup` has run, so the module's `bin/` is on the path, and that `/etc/assistant.d/<module>` exists.
- **The model calls your command with a flag as a stray word, or a value as a switch.** A flag without a `type` cannot be told apart. Give every flag one.
- **The model keeps leaving out an argument it needs, or insists on one it does not.** Check whether its description says "optional" or "default"; that alone decides whether it is required.
- **Every use of your command asks the user first.** Its spec has no `effect`, or it is `write`. A command that only reads should say `read`.
- **A command the model ran is refused as "x is not an EiN command".** The model made up a command name. That message, which the model reads, names similar commands it found; a clearer description or an example in `prompt.md` helps it pick the right one.
- **A card never appears.** The model gives a card only when its `description` says it is wanted. Check the card with `agent-eval --print-prompt` under `final_answer`, and check that every `required` parameter can be filled: a path the asking user cannot see is dropped, and with it a card that needed it.
- **Answers are good in one language and poor in another.** Add questions in both to `eval.json` and compare `language` in the summary.
