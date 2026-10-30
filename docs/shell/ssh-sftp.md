# SSH and SFTP

EiN runs its own SSH server, so you can reach it from your own computer: log in to the same shell as
the terminal in the web interface, run one command from a script, and copy files in and out with SFTP,
`scp` or a graphical file manager. This page is for anyone with an EiN account who wants to work from
their own machine; going the other way, from EiN out to a NAS or another server, is on
[Reaching other machines](remote.md).

## What you need

| What         | Example       | Where it comes from                                                                   |
| ------------ | ------------- | ------------------------------------------------------------------------------------- |
| The host     | `ein.local`   | The name or address of the machine EiN runs on, the same one you open in the browser. |
| The SSH port | `2222`        | `2222` unless your administrator chose another.                                       |
| Your account | `helen`       | Your EiN username. Your e-mail address works too, where your account has one.         |
| Your secret  | your password | The password you sign in to the web interface with, or a key once you have added one. |

SSH and SFTP share the one port. With the standard install it is set by `EIN_SSH_PORT` in `.env` on
the machine EiN runs on; [Ports, HTTPS and remote access](../admin/network.md) explains how to change
it and how to reach EiN from outside your home network. The setting
[`CFG_SSH_PORT`](../reference/settings.md#cfg_ssh_port) (**SSH port** in **Settings**) is the port
EiN listens on inside its container, and takes effect the next time EiN starts. With the standard
install leave it at `2222`: that is the port `EIN_SSH_PORT` is passed on to.

The examples below use Helen Okafor's account `helen` on `ein.local`, port `2222`. Use your own.

## Log in with a shell

1. On your own computer, open a terminal (on Windows, PowerShell has `ssh` built in) and run:

   ```bash
   # on your own computer
   ssh -p 2222 helen@ein.local
   ```

2. The first time, `ssh` shows the key EiN's server identifies itself with and asks whether to trust it:

   ```text
   The authenticity of host '[ein.local]:2222 ([192.168.1.20]:2222)' can't be established.
   ED25519 key fingerprint is SHA256:…
   Are you sure you want to continue connecting (yes/no/[fingerprint])?
   ```

   Type `yes`. Your computer remembers the key and does not ask again. To be sure it is your EiN
   answering, ask your administrator to compare the fingerprint; they see it in EiN's terminal with
   `ssh-keygen -l -f /etc/ssh_host_key.pub`.

3. Enter your EiN password.

You land in your home folder, `/home/helen`, at the same prompt as in a terminal tab. Everything on
[The terminal](terminal.md) holds here too: your history, your `~/.bashrc`, Tab completion and the
same keys, and every command on [Commands by task](commands.md). The editor works as well
([The editor](editor.md)). Two things belong to the browser alone: the pictures, videos and
recordings `cat` shows, which over SSH print lines starting `__IMG:`, `__VID:` or `__AUD:` instead,
and dropping files to upload them.

To log out, type `exit`. Closing the window or losing the connection ends the shell too, and stops
whatever command was running in it.

> [!TIP]
> If your username is an e-mail address, give it with `-l` so the two `@` do not get mixed up:
> `ssh -p 2222 -l helen@example.com ein.local`.

## Sign in with a key

With a key you are no longer asked for your password. If you have no key yet, make one on your own
computer with `ssh-keygen` and accept the defaults.

1. Give EiN the public half of your key, once:

   ```bash
   # on your own computer
   ssh-copy-id -s -p 2222 helen@ein.local
   ```

   It asks for your EiN password this one time. The `-s` matters: it makes `ssh-copy-id` copy the
   key over SFTP. Without it, `ssh-copy-id` sends a script of Unix shell commands, which EiN's shell
   does not run.

2. Log in as before. `ssh` and `sftp` now use the key and do not ask for the password.

The key lives in `~/.ssh/authorized_keys` in your EiN home, one key per line, as on any Linux server.
You can add and remove lines there yourself. EiN reads lines starting with a key type such as
`ssh-ed25519`, `ssh-rsa` or `ecdsa-sha2-nistp256`, and skips empty lines and lines starting with `#`.
A line with options in front of the key (`command="…"`, `from="…"`, `no-pty` and the like) is
skipped entirely.

EiN trusts the file only while nobody but you can change it, since anyone who could write to it could
sign in as you. Your home, `~/.ssh` and `authorized_keys` must each be owned by you (or the
administrator), writable by neither group nor others nor by anyone else through an access list, and
none of them may be a link. `ssh-copy-id -s` sets the modes for you.

### Add a key without ssh-copy-id

Where `ssh-copy-id` is missing, as on Windows, add the key from EiN's terminal. Copy the contents of
your public key file (`id_ed25519.pub` in the `.ssh` folder of your home on your own computer), then:

```bash
# in EiN's terminal
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo 'ssh-ed25519 AAAA… helen@laptop' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

The two `chmod` lines are what make EiN trust the file. If key sign-in still asks for a password,
check the modes with `ls -la ~/.ssh`: the folder should show `rwx------` and the file `rw-------`.

## Run one command at a time

Give `ssh` a command after the host and it runs just that one, prints the answer and exits with the
command's exit status. That is what a script on your own computer wants:

```bash
# on your own computer
ssh -p 2222 helen@ein.local 'ls /archive/albums'
ssh -p 2222 helen@ein.local 'JSON_OUTPUT=1 ls -l /archive/albums/cornwall-1968' | jq .
```

The examples on this page use the [Archive](../archive/index.md)'s albums, which are there once it is
installed; any folder you may read works the same way.

- With `JSON_OUTPUT=1` commands answer in JSON instead of text (see
  [Environment variables](../reference/environment.md)).
- Each command gets a shell of its own, so `cd` does not carry over to the next `ssh`. Chain steps
  that belong together in one line: `'cd /archive/albums && ls'`.
- The command runs without a terminal, so `edit` and anything else that needs one stops; log in with a
  shell for those. A command that would ask a question, such as a password or "Remove module?",
  stops instead with `<name>: no terminal to answer on`, followed by the option that gives the
  answer: `mod remove --force`, `user-passwd --new-password`, `user-elevate --password`. Commands sent this way are not added to your history.
- Errors arrive on the same stream as the output, so `2>/dev/null` on your side does not separate them.
  Use the exit status to tell success from failure.

## Copy files with SFTP

Any SFTP client works: the `sftp` command, a graphical client such as FileZilla or Cyberduck, or your
file manager's "connect to server". Give it the protocol SFTP, the host, the port and your username,
with your password or key.

```bash
# on your own computer
sftp -P 2222 helen@ein.local
```

Note the capital `-P` for the port in `sftp` and `scp`, where `ssh` takes a lowercase `-p`. You start
in your home folder. Then move around and copy as on any server:

```text
sftp> cd /archive/albums/cornwall-1968
sftp> get beach.jpg
sftp> put harbour.jpg
sftp> bye
```

`scp` works the same way, one command at a time:

```bash
# on your own computer
scp -P 2222 harbour.jpg helen@ein.local:/home/helen/
scp -P 2222 -r helen@ein.local:/archive/albums/cornwall-1968 .
```

`scp` from OpenSSH 9.0 and later copies over SFTP, which EiN serves. An older `scp` uses a different
protocol that EiN does not speak; with OpenSSH 8.7 or 8.8 add `-s`, and with anything older use `sftp`.

What you may see and change is decided by the same [permissions](../admin/permissions.md) as in the web
interface: a folder you cannot open in the browser cannot be opened over SFTP either.

### Bring in a large batch of photos

With the Archive installed, an export or a scanned box of tens of thousands of files is better
copied over SFTP into your staging area than uploaded in the browser, and a photo copied into an
album is taken in as an upload is. [Copy files in over SFTP](../archive/importing.md#copy-files-in-over-sftp)
gives the folder to copy into and how to keep folder names for the grouping, and
[Zips](../archive/importing.md#zips) what happens to a zip you copy in.

## What the tree looks like over SFTP

EiN's tree holds more than an ordinary file system can show, so a few things look different.

**What belongs to a photo.** A file can hold nodes of its own: with the Archive, a photo keeps its
EXIF data, the faces found in it and its thumbnails. Those live in a hidden folder named after the
photo with `_` added: what belongs to `beach.jpg` is in `beach.jpg_`. It is not listed, so copying
an album with `scp -r` or `get -r` copies the photos without it. You can still go in by typing its
name (`cd beach.jpg_`), look around and download at any depth. Nothing in it can be changed over
SFTP, and removing the photo removes it too.

**Modification times.** A file's modification time is when its content last changed, not when EiN last
added something about it. Backup tools therefore see a photo as unchanged while its faces or
description are being worked out. `put -p`, `scp -p` and `cp -p` on a mount keep the time they set.

**Sizes.** A file can be emptied by setting its size to 0. Any other change of size without writing
the content is refused.

**Links.** Softlinks, such as your favourites, or with the Archive an album's cover, a picture added
to an album and a person tagged in a photo, appear as symbolic links, and following one takes you to
what it points to. A recursive copy therefore copies the link, not what lies behind it. `ln -s` in
`sftp` makes a new link, and removing a link removes only the link, never what it points to.
[Links](../concepts/links.md) explains what they are for.

> [!WARNING]
> Removing a file over SFTP deletes it for good, with everything that belongs to it. It does not go to
> your trash, as deleting in the web interface does. Removing a folder works only once it is empty.

## Mount EiN as a folder

With `sshfs` on Linux or macOS you can mount EiN's tree as a folder on your own computer and use any
program on it:

```bash
# on your own computer
mkdir -p ~/ein
sshfs -p 2222 -o transform_symlinks helen@ein.local:/ ~/ein
```

`-o transform_symlinks` matters: a link's target is a path in EiN, such as
`/archive/people/peggy-wrenfield`, and the option makes it point inside the mount rather than to the
same path on your computer. `fusermount -u ~/ein` (on macOS `umount ~/ein`) unmounts it.

`rsync` works against such a mount. Over SSH directly, `rsync helen@ein.local:…` does not, because
it needs an `rsync` program on EiN's side, and EiN's shell has none.

## Who can sign in

- Every account with a password can sign in over SSH and SFTP; no group membership is needed. Being in
  the group `ssh` is about reaching other machines from EiN, not about reaching EiN (see
  [Reaching other machines](remote.md)).
- An account still waiting for a password, such as one imported without one, cannot sign in over SSH,
  with a key or with a password, nor anywhere else, until the administrator sets one for it.
- A disabled account cannot sign in at all, and disabling an account, or deleting it, ends the SSH and
  SFTP connections it already has open. [Accounts and groups](../admin/accounts.md) covers both.
- After five wrong passwords from one address, that address is refused for a while, starting at a second
  and doubling with each further failure up to 15 minutes; failures are forgotten an hour after the
  last one. Your `ssh` shows the same `Permission denied` as for a wrong password, so wait before trying
  again.

EiN's SSH server offers logins, single commands and SFTP. It does not forward ports, X11 or your SSH
agent.

## When something goes wrong

| What you see                                                     | Why                                                                                                      | What to do                                                                                                                         |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Connection refused` or a time-out                               | Wrong port or host, or EiN is not running, or the port is not reachable from where you are.              | Check the port with your administrator; from outside your home network see [Ports, HTTPS and remote access](../admin/network.md).  |
| `Permission denied (publickey,password)` with the right password | The account still waits for a password, is disabled, or your address is held back after failed attempts. | Ask your administrator to set a password or enable the account, or wait and try again.                                             |
| The key is not used and you are asked for the password           | `authorized_keys` is missing, the key line has options in front, or the modes let others write.          | Check with `ls -la ~/.ssh` in EiN's terminal and fix with `chmod 700 ~/.ssh` and `chmod 600 ~/.ssh/authorized_keys`.               |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`               | EiN's server key is not the one your computer remembers, as after EiN was installed again from scratch.  | Ask your administrator whether that happened. If so, forget the old key with `ssh-keygen -R "[ein.local]:2222"` and connect again. |
| `ssh-copy-id` fails without `-s`                                 | Without `-s` it runs Unix shell commands on EiN's side.                                                  | Run it with `-s`.                                                                                                                  |
| `scp` fails right away                                           | An `scp` older than OpenSSH 9.0 uses a protocol EiN does not speak.                                      | Add `-s` (OpenSSH 8.7 or 8.8), or use `sftp`.                                                                                      |
| `edit: not a terminal`                                           | The command was sent along on the `ssh` line, without a shell.                                           | Log in with `ssh -p 2222 helen@ein.local` and run it there.                                                                        |
| A copied folder lacks faces, EXIF and thumbnails                 | What belongs to a photo is in its hidden `_` folder, which recursive copies skip.                        | Go into `beach.jpg_` by name to fetch it; the photos themselves are complete.                                                      |
| Writing in a folder is refused                                   | You may not change that folder, or it lies inside a photo's `_` folder.                                  | See [Permissions in depth](../admin/permissions.md), or copy into your home or staging area instead.                               |
