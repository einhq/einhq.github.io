# The shell language

EiN's shell speaks bash: the quoting, variables, loops, functions, pipes and redirections you know
from bash on Linux work the same way on EiN's tree. This page is for anyone who writes more than one
command at a time: what EiN's shell does like bash, where it differs, how to keep settings in
`~/.bashrc`, how to write scripts of your own, how to run long jobs in the background, and how to
get answers as JSON.

The terminal itself, with its tabs, keys, history and <kbd>Tab</kbd> completion, has a page of its
own: [The terminal](terminal.md). [Commands by task](commands.md) tells you which command does what.

## Bash, on a tree of nodes

The shell is a bash written for EiN and tested against the test suite of GNU bash 5.2. Everything
the language has is there:

| What                     | Example                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| Pipes and lists          | `find /archive/people -type person \| wc -l`, `cd /archive && ls`, `a \|\| b` |
| Quoting                  | `ls "/archive/albums/Summer 2020"`, `echo 'no $expansion here'`               |
| Variables and parameters | `name=${file%.jpg}`, `${#name}`, `${name^^}`, `${dir:-/archive}`              |
| Command substitution     | `count=$(ls -1 /archive/people \| wc -l)`                                     |
| Arithmetic               | `$(( 6 * 7 ))`, `(( n >= 10 ))`, `let n++`                                    |
| Brace expansion          | `echo {2019..2023}`                                                           |
| Arrays                   | `people=(Peggy Ruby Jon)`, `"${people[@]}"`, `declare -A seen`                |
| Tests                    | `[[ $name == *.jpg ]]`, `[[ $line =~ ^([0-9]+) ]]`, `[ -e "$path" ]`          |
| Control flow             | `if`, `for`, `while`, `until`, `case`, `for (( i = 0; i < 3; i++ ))`          |
| Functions                | `count() { ls -1 "$1" \| wc -l; }`                                            |
| Redirections             | `> out.txt`, `>> log.txt`, `2>/dev/null`, `2>&1`, `< in.txt`                  |
| Here-documents           | `cat > note.txt <<'EOF'` … `EOF`, and here-strings `<<< "$line"`              |
| Process substitution     | `mapfile -t names < <(find /archive/people -type person)`                     |
| Jobs                     | `cmd &`, `jobs`, `fg`, `bg`, `wait`, `kill %1`                                |
| Options and traps        | `set -euo pipefail`, `shopt -s globstar`, `trap 'echo bye' EXIT`              |

The difference is what the words name. A path is a node of EiN's tree, not a file on a disk: `/`
is the root of the tree, `~` is your home folder `/home/<you>`, and globs such as `*.jpg` match the
names of nodes. Commands are EiN's own, not programs installed on a machine. [The tree](../concepts/tree.md)
shows what lies where, and [Nodes and node types](../concepts/nodes.md) what a node is.

```bash
# in EiN's terminal
for person in /archive/people/*_Wrenfield; do
  echo "${person##*/}"
done
```

```text
Arthur_Wrenfield
Erik_Wrenfield
Freya_Wrenfield
Jon_Wrenfield
Kiri_Wrenfield
Leo_Wrenfield
Peggy_Wrenfield
Ruby_Wrenfield
Thomas_Wrenfield
```

## What happens when you press Enter

The shell reads the line you typed. When it is not finished yet, because a quote is open, an `if`
has no `fi` or a here-document has no end line, the prompt changes to `>` and waits for the next
line. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to give up on it.

The first word is then looked up in this order, the first match wins:

1. An alias, such as `ll` for `ls -al`.
2. A function you defined.
3. A builtin of the shell: `cd`, `echo`, `read`, `export`, `source` and the others in
   [Builtins](#builtins).
4. One of EiN's own commands, such as `ls`, `cp` or `search`.
5. A command found on `PATH`: core's other commands, then each installed module's. `echo $PATH`
   shows the folders: `/usr/bin` and `/usr/lib/core/bin` first, then `/usr/modules/<module>/bin`
   for each module.

A word with a `/` in it, such as `./tidy.sh` or `~/bin/album-sizes`, runs that node instead.

`type <name>` says which of these a name is, and `command -v <name>` prints only where it is
found. When nothing matches, you see:

```text
error: command 'albm' not found
```

and the status is `127`. Commands such as `person-info` exist only where their module is
installed; `mod list` shows which modules are.

<kbd>Ctrl</kbd>+<kbd>C</kbd> stops the command that is running. A loop stops too, rather than going
on with the next round.

## How EiN's shell differs from bash on Linux

Most scripts written for bash run unchanged. These are the places where EiN behaves differently,
because the tree is not a disk and the commands are not Linux programs.

**Every node can hold others.** A photo has children of its own, such as its EXIF data and the regions of its faces, so
`[ -d "$path" ]` is true for every node that exists. Test with `[ -e "$path" ]` whether a node is
there, and `[ -f "$path" ]` whether it is a file. `[ -s "$path" ]` is true only for a file with
content. `[ -t 1 ]` is always false.

**Plain variables reach commands.** A command or script started from the shell sees all of the
shell's variables, not only the exported ones. `JSON_OUTPUT=1` on a line of its own therefore
changes every command after it until you `unset JSON_OUTPUT`. Put it in front of one command to
change only that one.

**`ls` in the terminal writes columns into a pipe too.** In the terminal panel and an SSH login,
`ls` lays names out in columns even when its output goes to another command. Give `-1` when you
count or loop over names: `ls -1 /archive/albums | wc -l`. `find` always writes one path per line.

**`-h` right after a command's name asks for help.** `du -h` prints `du`'s help instead of sizes;
write `du -sh`. A value that starts with a minus goes after an equals sign, `--lng=-3.7`; on its
own `-3.7` would be read as another option.

**There is no `sh` or `bash` command.** Run a script by its path, or read it into the shell you are
in with `source`. See [Write a script](#write-a-script).

**<kbd>Ctrl</kbd>+<kbd>Z</kbd> does not pause a command.** Start a long one with `&` instead; see
[Run a long job in the background](#run-a-long-job-in-the-background).

**Process substitution waits for the end.** `<(cmd)` writes the command's whole output to a
temporary node under `/tmp` before the reading command opens it, so it is not streamed.

**Many Unix programs are missing.** `tar`, `curl`, `diff`, `less` and others have no EiN command.
[Commands by task](commands.md#unix-commands-ein-does-not-have) lists what to use instead.

**Permissions are EiN's.** A command you may not run is refused the same way in the shell, the web
interface and over SSH. [Permissions in depth](../admin/permissions.md) explains who may do what.

## One shell per terminal tab

Each terminal tab, and each SSH login, is one shell that lasts until you close it. A `cd`, an
`export`, an alias or a function you define stays for the next command in that tab, and survives a
page reload (see [Come back to a running shell](terminal.md#come-back-to-a-running-shell)). Other
tabs have shells of their own and do not see it.

A command sent with `ssh host 'command'` from your own computer, and every command the web pages
run for you, gets a fresh shell that ends with the command. Join what belongs together with `&&` in
one line:

```bash
# on your own computer
ssh -p 2222 helen@ein.local 'cd /archive/albums && ls -1 | wc -l'
```

[SSH and SFTP](ssh-sftp.md) covers logging in from your own computer.

## Keep your settings in ~/.bashrc

When a terminal tab or an SSH login opens, the shell reads, in this order:

1. `/etc/bashrc`, the same for everyone. It defines the aliases `ll` (`ls -al`), `la` (`ls -A`),
   `whoami` and `id`, and reads the settings: the administrator's in `/etc/config`, then your own in
   `~/.config`.
2. `~/.bashrc`, your own file, if you have one.

EiN reads no `~/.bash_profile` or `~/.profile`. A command sent with `ssh host 'command'` reads
`/etc/bashrc` but not `~/.bashrc`.

To make a change that lasts:

1. Open the file in the editor:

   ```bash
   # in EiN's terminal
   edit ~/.bashrc
   ```

2. Add what you want, for example:

   ```bash
   # ~/.bashrc
   export HOSTNAME=ein
   export PATH="$HOME/bin:$PATH"
   alias albums='cd /archive/albums && ls'
   people() { find /archive/people -mindepth 1 -maxdepth 1 -type person; }
   ```

3. Save with <kbd>Ctrl</kbd>+<kbd>S</kbd> and leave with <kbd>Ctrl</kbd>+<kbd>Q</kbd>.
   [The editor](editor.md) has its other keys.
4. Run `source ~/.bashrc` to use it in the tab you are in. New tabs read it when they open.

A `~/.bashrc` that fails does not stop the shell from opening: the lines before the error have run,
and you get a prompt. Fix the file and `source` it again.

Some things to put there:

| Line                             | What it does                                                           |
| -------------------------------- | ---------------------------------------------------------------------- |
| `export HOSTNAME=ein`            | Shows a host name in the prompt, `helen@ein:~$`                        |
| `PS1='\u:\W\$ '`                 | Changes the prompt; see below                                          |
| `export PATH="$HOME/bin:$PATH"`  | Lets your own scripts in `~/bin` run by name                           |
| `export MEDIA_LINES=30`          | Draws pictures with `cat` 30 lines tall                                |
| `export HISTSIZE=5000`           | Keeps more history in this shell                                       |
| `set -o ignoreeof`               | <kbd>Ctrl</kbd>+<kbd>D</kbd> on an empty line no longer ends the shell |
| `complete -F _my_func my-script` | Your own <kbd>Tab</kbd> completion for a command                       |

`PS1` understands `\u` (your username), `\h` (the host name), `\w` (the folder, with `~` for your
home), `\W` (the last part of the folder), `\$` (`#` when the shell acts as an administrator, `$`
otherwise), `\t` and `\T` (the time in 24- and 12-hour form), `\n` (a new line) and `\e` for colour
codes. Unset `PS1` to get EiN's coloured prompt back.

Settings such as the length of your history are better changed under **Profile → Preferences**,
which writes them to `~/.config`; see [Your profile, favourites and trash](../guide/profile.md).
[Configuration](../admin/configuration.md) explains how the administrator's settings and yours are
layered.

## Write a script

A script is a text file of shell commands. EiN runs any text file you have execute permission on as
a bash script.

1. Make a folder for your scripts and open a new file in it:

   ```bash
   # in EiN's terminal
   mkdir -p ~/bin
   edit ~/bin/album-sizes
   ```

2. Write the script. Start it with `#!bash`, so the editor colours and checks it as bash:

   ```bash
   #!bash
   # How much each album holds, largest first
   for album in /archive/albums/*; do
     printf '%6d  %s\n' "$(ls -1 "$album" | wc -l)" "${album##*/}"
   done | sort -rn
   ```

3. Save it, and give yourself permission to run it:

   ```bash
   # in EiN's terminal
   chmod 755 ~/bin/album-sizes
   ```

4. Run it by its path:

   ```bash
   # in EiN's terminal
   ~/bin/album-sizes
   ```

   With `~/bin` on your `PATH` (see [Keep your settings in ~/.bashrc](#keep-your-settings-in-bashrc)),
   `album-sizes` alone is enough.

A script run like this is a process of its own: its `cd`, variables and functions end with it, and
`exit` ends the script, not your shell. `$1`, `$2`, `$@` and `$#` are its arguments, and `$0` is its
path. `source ~/bin/album-sizes` (or `. ~/bin/album-sizes`) runs the same lines in the shell you are
in instead, so what they change stays; a sourced file needs no execute permission.

Pick a name that is not already a command: a name such as `ls` or `cp` always runs EiN's own
command, whatever is on your `PATH`. `type album-sizes` shows what a name runs.

A file whose first line is `#!ts` is a TypeScript command, and EiN runs those only from a module
installed under `/usr/modules`. [Writing a module](../develop/modules.md) covers that.

### Give a script options and help with arg

The builtin `arg` gives a script the options, help and <kbd>Tab</kbd> completion that EiN's own
commands have. Declare what the script takes, then `arg --export` reads the arguments and sets one
variable for each, named in capitals:

```bash
#!bash
arg --desc "Count what each album holds"
arg '[<under>]' path = /archive/albums "where the albums are"
arg -m --min number = 0 "leave out albums holding fewer"
arg --example "album-sizes --min 50"
arg --export

for album in "$UNDER"/*; do
  n=$(ls -1 "$album" | wc -l)
  if (( n >= MIN )); then printf '%6d  %s\n' "$n" "${album##*/}"; fi
done
```

`album-sizes --help` then prints:

```text
Usage: /home/helen/bin/album-sizes [OPTIONS] [<under>]

Count what each album holds

Arguments:
  [<under>]            where the albums are [default: /archive/albums]

Options:
  -m, --min <number>       leave out albums holding fewer [default: 0]
  -h, --help                 Show this help message

Examples:
  album-sizes --min 50
```

An option the script does not declare, a missing argument, or a word where a number belongs stops
the script with a message such as `Unknown option: --bogus` and
`Try '/home/helen/bin/album-sizes --help' for more information.`, status `1`.

| Line                                 | Declares                                                            |
| ------------------------------------ | ------------------------------------------------------------------- |
| `arg --desc "text"`                  | What the script does, shown by `--help`                             |
| `arg '<name>' type "text"`           | An argument that must be given; its value is in `$NAME`             |
| `arg '[<name>]' type = value "text"` | An argument that may be left out, with its default                  |
| `arg -s --long type "text"`          | An option that takes a value, `$LONG`; `= value` gives it a default |
| `arg -s --long "text"`               | An option without a value: `$LONG` is `1` when given, empty if not  |
| `arg --rest`                         | Leaves the arguments it does not know in `$@` instead of refusing   |
| `arg --example "command line"`       | An example for `--help`                                             |
| `arg --returns "text"`               | What the script answers with, in a sentence                         |
| `arg --effect read` or `write`       | Whether running it changes anything                                 |
| `arg --export`                       | Reads the arguments and sets the variables; put it last             |

The types are `string`, `number`, `boolean`, `path`, `user`, `group` and `command`. A `-` in an
option's name becomes `_` in its variable: `--max-count` is `$MAX_COUNT`.

Because the script declares what it takes, <kbd>Tab</kbd> completes its options and, for a `path`,
`user` or `group`, their values, once the script is on your `PATH`. A script without `arg`
completes paths.

## Run a long job in the background

End a command with `&` and the prompt comes back at once while it runs:

```bash
# in EiN's terminal
~/bin/album-sizes > ~/album-sizes.txt &
```

```text
[1] bg-01JBXK4T9Q2M8N5R7V3W6Y0Z1A
```

`[1]` is the job's number in this shell, and the rest is its process id, which `ps` lists too.
When the job ends, the shell says so before the next prompt, as `[1]+  Done` with the command.

| Command      | What it does                                                                    |
| ------------ | ------------------------------------------------------------------------------- |
| `jobs`       | Lists this shell's jobs and whether they still run                              |
| `fg %1`      | Waits for job 1 in the foreground; <kbd>Ctrl</kbd>+<kbd>C</kbd> stops it        |
| `wait`       | Waits for all of this shell's jobs to end                                       |
| `kill %1`    | Stops job 1, everything it runs included                                        |
| `kill <pid>` | Stops a process by its id from `ps`; your own, or anyone's for an administrator |
| `echo $!`    | The process id of the last job you started                                      |

A background job belongs to its shell. When the shell ends (you close the tab, sign out, or stay
away longer than the five minutes the terminal waits), its jobs are stopped with it.

### Keep a job running after you leave

To let a job go on after its shell has ended, detach it. Start it detached with `nohup`:

```bash
# in EiN's terminal
nohup album-sizes --min 50
```

```text
nohup: [1] bg-01JBXM2C6D8F0G3H5J7K9L1N4P -> /var/logs/jobs/bg-01JBXM2C6D8F0G3H5J7K9L1N4P/
```

Or detach a job you already started with `&`: `detach %1`, or `detach` alone for the latest. EiN
answers `detached [1] <pid> <command>`.

A detached job leaves the shell's `jobs` list and no longer writes to the terminal. Its output goes
to `stdout.log` and `stderr.log` in `/var/logs/jobs/<pid>/`, beside a `status.json` that says
whether it still runs and how it ended. `detach --list` lists the detached jobs, newest first, one line each with the process id, the
state, when it started and the command, or `no detached jobs`.

`running` means it still goes, `exited` gives its status in brackets, and `abandoned` means EiN
restarted while it ran. A detached job does not survive a restart of EiN.

`nohup` runs one command with its arguments. For several steps, or a pipe, put them in a script and
detach that, or `nohup source ~/sweep.sh`. Stop a detached job with `kill <pid>`.

[`detach`](../reference/commands-core.md#detach) and [`nohup`](../reference/commands-core.md#nohup)
are in the reference.

## Get answers as JSON

Put `JSON_OUTPUT=1` in front of a command and it answers in JSON instead of text. This is how the
web interface runs every command, so the JSON holds everything the pages show. Read it with `jq`:

```bash
# in EiN's terminal
JSON_OUTPUT=1 ls /archive/people | jq -r '.[]'
JSON_OUTPUT=1 ls -l /archive/albums | jq '.[].name'
```

`ls` alone answers with a list of names; `ls -l` with a record for each node.

- `JSON_OUTPUT=1 <command> --help` answers with the command's description of its arguments and
  options as JSON, a script's from its `arg` lines included.
- Text tools such as `grep`, `sort`, `head`, `cut`, `wc` and `cat` keep writing text, so they work
  in the same pipe.
- Set without a command in front, `JSON_OUTPUT=1` holds for every command after it in that shell,
  until `unset JSON_OUTPUT`.

[`jq`](../reference/commands-core.md#jq) is EiN's own, a lighter jq that knows filters such as
`.field`, `.field.nested`, `.[]`, `.[] | .name` and `startswith("x")`, with `-r` for plain text and `-c` for one line per
result.

[Environment variables](../reference/environment.md#options-you-set) lists `JSON_OUTPUT` with the
other variables that change how commands behave, and `docs env` prints them in the terminal.

## Builtins

These are part of the shell itself, so they have no entry in the
[commands reference](../reference/commands.md). `help <name>` prints a builtin's usage in the
terminal.

| Builtins                                                                     | For                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `cd`, `pwd`, `pushd`, `popd`, `dirs`                                         | Moving around; `cd` alone goes home, `cd -` back                            |
| `echo`, `printf`, `read`, `mapfile`, `readarray`                             | Writing and reading lines                                                   |
| `export`, `unset`, `local`, `declare`, `typeset`, `readonly`, `let`, `shift` | Variables                                                                   |
| `source`, `.`, `eval`, `exit`, `return`, `true`, `false`, `:`                | Running and ending                                                          |
| `test`, `[`                                                                  | Tests                                                                       |
| `jobs`, `fg`, `bg`, `wait`, `kill`, `disown`                                 | Jobs                                                                        |
| `set`, `shopt`, `trap`, `umask`, `ulimit`                                    | Options and signals                                                         |
| `alias`, `unalias`, `type`, `command`, `builtin`, `hash`, `enable`, `help`   | Names and lookup                                                            |
| `history`, `fc`                                                              | History; see [Find an earlier command](terminal.md#find-an-earlier-command) |
| `complete`, `compgen`, `compopt`                                             | <kbd>Tab</kbd> completion                                                   |
| `getopts`, `arg`, `caller`, `times`                                          | Scripts                                                                     |

`disown` takes a job out of the list and lets it outlive the shell, as `detach` does. `kill` takes
the signals `HUP`, `INT`, `TERM`, `KILL`, `PIPE`, `TSTP` and `CONT` by name, `kill -TERM %1`.

## If something goes differently

**The prompt shows `>` and nothing happens.** The line is not finished: a quote or a bracket is
open, or an `if`, `for` or here-document has no end. Type the rest, or press
<kbd>Ctrl</kbd>+<kbd>C</kbd> to start again.

**`error: command 'album-sizes' not found`.** The script's folder is not on your `PATH`. Run it by
its path, `~/bin/album-sizes`, or add `export PATH="$HOME/bin:$PATH"` to `~/.bashrc` and
`source ~/.bashrc`.

**Running a script by its path is refused.** You have no execute permission on it. Run
`chmod 755 <script>`, or read it in with `source <script>`.

**`error: <name>: a #!ts command runs only from a module in /usr/modules`.** A `#!ts` file runs
only from an installed module. Write the script in bash, or make it part of a module.

**A count from `ls | wc -l` is too small.** `ls` wrote its names in columns. Use `ls -1`.

**Every command answers in JSON.** `JSON_OUTPUT=1` was set on its own line, or in `~/.bashrc`. Run
`unset JSON_OUTPUT`.

**An alias or function from `~/.bashrc` is missing.** It is read when a tab opens: run
`source ~/.bashrc` in tabs that were open before you changed it. A command sent with
`ssh host 'command'` does not read `~/.bashrc`.

**A background job stopped when I closed the tab.** Jobs end with their shell. Start it with
`nohup`, or `detach` it before you leave.

**`nohup: <command>: nothing left to detach — it had already finished`.** The command ended, or
failed to start, before `nohup` could detach it. Run it without `nohup` to see what it says.

**`detach: no such job: %2`.** This shell has no such job, or it has ended. `jobs` lists the ones
there are.

## Related pages

- [The terminal](terminal.md): opening it, tabs, keys, history and <kbd>Tab</kbd> completion.
- [Commands by task](commands.md): which command does what.
- [The editor](editor.md): `edit`, for `~/.bashrc` and scripts.
- [SSH and SFTP](ssh-sftp.md): the same shell from your own computer.
- [Commands reference](../reference/commands.md): every command with all its options.
- [Environment variables](../reference/environment.md): the variables every shell has.
- [Writing a module](../develop/modules.md): commands that come with a module.
