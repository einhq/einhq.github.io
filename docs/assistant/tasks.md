# Assistant commands by task

This page is for power users and administrators who use the assistant from the terminal. Each table row gives a task, a command line that does it, and a link to that command's full entry. The commands come with the assistant module and are there once it is installed; [The Assistant](index.md) says what it adds, [Chatting with the assistant](chat.md) covers the chat in the web interface, and [Commands by task](../shell/commands.md) has core's commands.

| Task                                               | Command                                               | Reference                                            |
| -------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Which language model answers, and whether it does  | `llm-status --checks`                                 | [llm-status](commands.md#llm-status)                 |
| Ask the assistant a question                       | `assistant-ask 'Which albums is Peggy Wrenfield in?'` | [assistant-ask](commands.md#assistant-ask)           |
| The same, thinking before each step                | `assistant-ask --think '<question>'`                  | [assistant-ask](commands.md#assistant-ask)           |
| Your saved chats                                   | `assistant-chat list`, `assistant-chat read <id>`     | [assistant-chat](commands.md#assistant-chat)         |
| Delete a chat                                      | `assistant-chat delete <id>`                          | [assistant-chat](commands.md#assistant-chat)         |
| Find a command by meaning                          | `assistant-commands find 'list running services'`     | [assistant-commands](commands.md#assistant-commands) |
| Whether a command line changes anything            | `assistant-commands judge 'service restart cpu'`      | [assistant-commands](commands.md#assistant-commands) |
| Ask the language model one thing, without tools    | `llm-chat 'The colour of the sky?'`                   | [llm-chat](commands.md#llm-chat)                     |
| Score the assistant against the modules' questions | `agent-eval --limit 5 --verbose`                      | [agent-eval](commands.md#agent-eval)                 |

Asked from the terminal, `assistant-ask` runs nothing that changes things: a change comes back as a proposal, and without `--chat` nothing is saved.
