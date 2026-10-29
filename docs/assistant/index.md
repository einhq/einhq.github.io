# The Assistant

The Assistant is the module that adds a chat to EiN: you ask in your own words, and it answers by
running EiN's commands as you. This page is for anyone deciding whether to install it and for the
administrator who does: what it does, what it needs, how to install it and what it adds.

## What it does

The assistant answers questions about what is kept in EiN, and about EiN itself. To find the
answer it runs EiN's own commands as you, with your permissions, and shows you every command it
ran. A command that only reads runs at once. One that would change something, such as writing a
caption or moving a file, comes to you as a proposal card with the exact commands, which you run or
decline: the assistant never changes anything on its own. [Chatting with the assistant](chat.md)
shows the chat from the user's side.

The assistant knows no module by name. Each installed module tells it which of its commands to
offer, what to know about its part, which cards to draw under an answer and which questions to
suggest; [Teaching the assistant](teaching.md) describes how.

## With or without the Archive

The assistant works on an EiN with no other module. It then answers from core's commands and its
own: what is in a folder or a file, which services are running, how much disk space is used, and
charts of what it counted.

With the [Archive](../archive/index.md) installed, it also searches pictures, people, albums and
places, answers questions about family, birthdays and events, proposes captions and events on
someone's timeline, and can draw a family tree or a map under an answer. The Archive's search box
then reads a sentence typed into it with the assistant's language model too
([The language model](language-model.md#what-the-language-model-is-for)).

## What it needs

A language model that speaks the OpenAI chat API. The module brings none of its own:

- **The model EiN runs itself**, which the installer adds with `--llm` as a container beside EiN,
  on the graphics card or the processor.
- **A hosted provider's model**, such as OpenAI's, set with four settings in `~/ein/.env`. Your
  questions, and what the assistant reads to answer them, then leave your machine.

[The language model](language-model.md) covers both, and how to check that the model answers.
Without a model, the chat waits for one and then says **Assistant unavailable**.

The assistant needs no other module. With the [media service](../ems/index.md) and its `ems` module
installed as well, its command search finds commands by meaning rather than by their words
([Find the command you need](../shell/terminal.md#find-the-command-you-need)).

## Install it

Install it like any module, in any of three ways:

- **With the installer**, at the first install or any time after, together with the model:

  ```bash
  # on the machine that will run EiN
  curl -fsSL https://einhq.eu/install.sh | bash -s -- --module assistant --llm
  ```

  On a machine where EiN runs already, `~/ein/setup.sh --module assistant` does the same; add
  `--llm` for the model.
- **On Settings → Modules**: open **Published modules** and choose **Install** on `assistant`.
- **In EiN's terminal**, as the administrator: `mod install assistant`.

[Modules](../admin/modules.md) explains each way, and how to update and remove a module.

## What it adds

| Where                              | What                                                                                                                                                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The sidebar                        | **Chat**, which opens the Chat page with your recent chats                                                                                                                                                |
| The top bar                        | The **Chat** button, which opens the chat in the side drawer beside the page you are on                                                                                                                   |
| **About EiN**, in the account menu | A **Language model** tile: the model's name, and "on this host" or the provider's name                                                                                                                    |
| **Settings → System**              | The **Assistant** group: the model's address, key, provider and name, where it runs, whether it thinks, how much it may write and how long the chat waits for it ([settings](language-model.md#settings)) |
| **Dashboard → Services**           | The `llm-link` row, which says whether the model answers and where it runs                                                                                                                                |
| EiN's terminal                     | The commands `assistant-chat`, `assistant-commands`, `llm-chat`, `llm-status`, `agent-eval` and `assistant-ask` ([Assistant commands](commands.md))                                                       |

Your conversations are kept as logs in your home folder, under `~/.chats/`
([Where your conversations are kept](chat.md#where-your-conversations-are-kept)).

## The pages in this section

- [Chatting with the assistant](chat.md): asking, reading an answer, running or declining a
  proposal, and your conversations.
- [The language model](language-model.md): running the model on your machine or using a hosted
  one, and checking that it answers.
- [Teaching the assistant](teaching.md): how a module offers the assistant its commands, cards and
  questions, and how to measure it with `agent-eval`.
- [Assistant commands](commands.md): every command the module brings.

The graphics card the model can run on is covered in [The graphics card](../ems/gpu.md).
