# Reaching other machines

From EiN's shell you can log in to another machine, run a command there, copy files in and out, and
put your key on it, with `ssh`, `scp`, `ssh-copy-id` and `ssh-keygen`. An administrator can also
mount a folder of another machine into the tree over SFTP. This page is for members of the group
`ssh` and for the administrator who lets them in.

Everything here goes out from EiN to another machine. To come in to EiN from your own computer, see
[SSH and SFTP](ssh-sftp.md).

## What you need

- **Membership of the group `ssh`**, or the administrator account. `ssh`, `scp` and `ssh-copy-id`
  refuse everyone else:

  ```text
  ssh: permission denied, you must be a member of group 'ssh'
  ```

  `ssh-keygen` works for everyone, since it only touches your own `~/.ssh`.
- **An account on the other machine**, and that machine running an SSH server.
- **A network path from the machine EiN runs on.** The connection starts there, not on the computer
  your browser runs on. A host you can reach from your laptop is not always one EiN can reach.

The commands work the way OpenSSH's do, and read and write the same files, but those files live in
your home folder in EiN's tree (`/home/<you>/.ssh`), not on the machine EiN runs on. You can look at
them with `ls -la ~/.ssh` and open them with [`edit`](editor.md).

## Let someone use ssh

The group `ssh` is made when EiN starts for the first time, with the title **SSH users**. It is
empty until the administrator adds people.

1. Open **Settings → Groups** and choose **SSH users**. The page says what the group is for: "Its
   members may use ssh, scp and ssh-copy-id to reach other machines."
2. Under **Members**, tick the people who may use them.
3. Ask them to sign out and in again. As the section says, changes apply the next time each person
   signs in.

The same from the terminal, as the administrator:

```bash
# in EiN's terminal, as the administrator
group-add-member ssh helen
```

Take someone out again by unticking them, or with `group-remove-member ssh helen`.
[Accounts and groups](../admin/accounts.md) covers groups in general.

> [!WARNING]
> A member of `ssh` can copy anything they may read in EiN to any machine they can log in to, and
> run commands on those machines from the machine EiN runs on. Add only people you would give that.

## Log in to another machine

```bash
# in EiN's terminal
ssh anna@nas.local
```

The first time, `ssh` does not know the machine and asks:

```text
The authenticity of host 'nas.local' can't be established.
ED25519 key fingerprint is SHA256:Xb7k2Qy9mWv0Tz4hJc1pLr8sNe5uGa3dFo6iKq2YwBM.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Compare the fingerprint with the one the other machine shows for its own key (on a Linux machine,
`ssh-keygen -l -f /etc/ssh/ssh_host_ed25519_key.pub` there). Type `yes`, or paste the fingerprint,
to go on; anything else is asked again, and `no` stops. The key is then written to
`~/.ssh/known_hosts`:

```text
Warning: Permanently added 'nas.local' (ED25519) to the list of known hosts.
```

Next, `ssh` offers your keys. When none is accepted it asks for the password:

```text
anna@nas.local's password:
```

You are then in the other machine's shell, in the same terminal tab. Everything you type goes to it,
<kbd>Ctrl</kbd>+<kbd>C</kbd> included, and full-screen programs such as `top` or an editor draw as
they would anywhere. Resizing the panel resizes the remote terminal.

To leave, type `exit` or press <kbd>Ctrl</kbd>+<kbd>D</kbd>. If the other side stops answering,
type <kbd>~</kbd> and <kbd>.</kbd> at the start of a line (after <kbd>Enter</kbd>): that cuts the
connection, and `ssh` prints `Connection to anna@nas.local closed.`

Who you log in as:

| You type                | Remote user                                           |
| ----------------------- | ----------------------------------------------------- |
| `ssh anna@nas.local`    | `anna`                                                |
| `ssh -l anna nas.local` | `anna`                                                |
| `ssh nas.local`         | a `User` from `~/.ssh/config`, else your EiN username |

The port is 22 unless you give another with `-p`: `ssh -p 2222 backup.example.com`. A host followed
by `:port` is not understood; use `-p`. An IPv6 address may be bracketed: `ssh anna@[fe80::1]`.

## Run one command on another machine

Put the command after the host. Everything after the host goes to the other machine, flags included:

```bash
# in EiN's terminal
ssh nas.local 'df -h'
ssh anna@nas.local ls -la photos
```

The output comes back to your terminal, and `ssh` ends with the remote command's exit status, so it
works in scripts and with `&&`. When the connection itself fails, the status is `255`.

A single command runs without a terminal on the other side. Add `-t` for one that needs a terminal,
such as `top`; `-tt` asks for one even when `ssh` itself runs without a terminal. `-T` never asks for
one.

Input is passed along, so pipes work in both directions:

```bash
# in EiN's terminal
cat ~/notes.md | ssh anna@nas.local 'cat > notes-from-ein.md'
ssh anna@nas.local 'cat photos/list.txt' | wc -l
```

A plain `ssh nas.local` without a terminal (in a script, or with input from a pipe) warns
`Pseudo-terminal will not be allocated because stdin is not a terminal.` and runs the remote shell
on your input. `-q` leaves out that warning and the `Connection to … closed.` line.

## Log in with a key instead of a password

A key saves you typing the password, and is required for a [mount](#mount-a-folder-of-another-machine).

1. Make a key pair:

   ```bash
   # in EiN's terminal
   ssh-keygen
   ```

   ```text
   Generating public/private ed25519 key pair.
   Enter passphrase (empty for no passphrase):
   Enter same passphrase again:
   Your identification has been saved in /home/helen/.ssh/id_ed25519
   Your public key has been saved in /home/helen/.ssh/id_ed25519.pub
   The key fingerprint is:
   SHA256:4fJq0Vw2nRb8tYc6LmZ1xKd9sPe3uHa7gTo5iNy2QwE helen@ein
   ```

   A passphrase protects the private key; `ssh` and `scp` then ask for it when they use the key. Leave
   it empty for a key that scripts and mounts can use without anyone at the keyboard.
2. Put the public key on the other machine:

   ```bash
   # in EiN's terminal
   ssh-copy-id anna@nas.local
   ```

   ```text
   ssh-copy-id: INFO: Source of key(s) to be installed: "/home/helen/.ssh/id_ed25519.pub"
   anna@nas.local's password:

   Number of key(s) added: 1

   Now try logging into the machine, with:   "ssh 'anna@nas.local'"
   and check to make sure that only the key(s) you wanted were added.
   ```

   It logs in once with the password, adds the key to `~/.ssh/authorized_keys` there (making the
   folder and file when they are missing), and adds nothing when the key is already in the file.
3. Run `ssh anna@nas.local`. It logs in without asking for the password.

When you do not name a key, `ssh` and `scp` offer every key they find of `~/.ssh/id_ed25519`,
`~/.ssh/id_ecdsa` and `~/.ssh/id_rsa`, in that order; `ssh-copy-id` installs the first public key it
finds of the same three. Name another with `-i`.

| Task                                       | Command                                                         |
| ------------------------------------------ | --------------------------------------------------------------- |
| An RSA key, for an old server              | `ssh-keygen -t rsa -b 4096 -C "backup key"`                     |
| A key in a file of its own                 | `ssh-keygen -f ~/.ssh/nas -N ''`                                |
| Show a key's fingerprint                   | `ssh-keygen -l -f ~/.ssh/id_ed25519.pub`                        |
| Print the public key of a private key file | `ssh-keygen -y -f ~/.ssh/nas`                                   |
| Show what `ssh-copy-id` would add          | `ssh-copy-id -n anna@nas.local`                                 |
| Install a named key on another port        | `ssh-copy-id -i ~/.ssh/nas.pub -p 2222 anna@backup.example.com` |

Key types are `ed25519` (the default), `ecdsa` (256, 384 or 521 bits) and `rsa` (3072 bits unless
you give at least 2048 with `-b`). The comment is `<your username>@ein` unless you give one with
`-C`. A key named with `-f` goes into a folder that must exist already: plain `ssh-keygen`, or
accepting a first host key, makes `~/.ssh` for you. When the file exists, `ssh-keygen` asks `Overwrite (y/n)?`; without a terminal it stops
instead. See [ssh-keygen](../reference/commands-core.md#ssh-keygen) and
[ssh-copy-id](../reference/commands-core.md#ssh-copy-id) for every option.

## Copy files in and out

`scp` copies between EiN's tree and one other machine. A path is remote when it has `host:` before
any `/`, as in OpenSSH: `anna@nas.local:photos/1968`. A remote path without a leading `/` starts in
the remote user's home folder; `anna@nas.local:` alone is that home folder.

Copy in from another machine:

```bash
# in EiN's terminal
scp anna@nas.local:photos/sailboat.jpg /home/helen/staging/files/inbox/
scp -r anna@nas.local:photos/1968 /home/helen/staging/files/inbox/
scp "anna@nas.local:photos/*.jpg" /home/helen/staging/files/inbox/
```

Quote a remote pattern so EiN's shell leaves it alone; the other machine's files are matched against
it (`*`, `?` and `[…]`, and a name starting with a dot only by a pattern that starts with one). When
nothing matches, `scp` says `No match`.

A file copied in is recorded the way an upload is: its size, checksum and type are worked out, and
EiN's processing takes it in from there. Copying into your staging folder is a way to bring a
machine's photos into the archive: see [Sorting in staging](../guide/staging.md).

Copy out to another machine:

```bash
# in EiN's terminal
scp -r /archive/albums/christmas-2019 anna@nas.local:backup/
```

Copying a folder out carries its files and folders only. What EiN keeps beside a photo (its
thumbnails, the metadata read from it, its links to people and places) stays behind.

| Option           | What it does                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `-r`             | Copy folders and everything in them. Without it a folder is refused with `not a regular file`. |
| `-p`             | Keep modes and modification times.                                                             |
| `-q`             | No progress meter. The meter shows only in a terminal.                                         |
| `-B`             | Never ask for a password or passphrase.                                                        |
| `-P`             | The port (capital P, unlike `ssh`).                                                            |
| `-i`, `-F`, `-o` | A key, a config file, an option: as for `ssh`.                                                 |

`scp` ends with `0` when every file was copied and `1` when any failed; each failure is printed with
the path. It does not copy between two remote machines (`copying between two remote hosts is not
supported; copy into EiN first`), nor between two EiN paths (use `cp`). All remote sources in one
command must be on the same machine. See [scp](../reference/commands-core.md#scp).

## Keep settings per machine in ~/.ssh/config

Settings you would otherwise type every time go in `~/.ssh/config`, in OpenSSH's format:

```text
# ~/.ssh/config in your EiN home
Host nas
    HostName 192.168.1.20
    User anna
    IdentityFile ~/.ssh/nas

Host backup
    HostName backup.example.com
    Port 2222
    StrictHostKeyChecking accept-new
```

Then `ssh nas`, `scp -r nas:photos/1968 .` and `ssh-copy-id nas` use them. Open the file with
`edit ~/.ssh/config`.

EiN acts on these keywords, from the file or from `-o Keyword=value` on the command line:

| Keyword                  | What it sets                                                |
| ------------------------ | ----------------------------------------------------------- |
| `HostName`               | The machine to reach, when the name you type is an alias.   |
| `Port`                   | The port.                                                   |
| `User`                   | The remote user.                                            |
| `IdentityFile`           | The key to use. `~/` is your EiN home.                      |
| `StrictHostKeyChecking`  | What to do about an unknown host key: see the next section. |
| `BatchMode`              | `yes`: never ask for anything.                              |
| `ConnectTimeout`         | Seconds to connect and log in (15 unless set).              |
| `ServerAliveInterval`    | Seconds between keepalives (none unless set).               |
| `PasswordAuthentication` | `no`: do not fall back to a password.                       |

As in OpenSSH, the first value found for a keyword wins, so put the specific `Host` blocks before a
`Host *` block. `Match` with `all`, `host`, `originalhost`, `user` and `localuser` works, and so does
`Include`. Other keywords in the file are skipped without a word; on the command line, `-o` with a
keyword not in the table stops with `unsupported option`. `-F <file>` reads another file instead,
and `-F none` reads none.

## Host keys

`~/.ssh/known_hosts` holds the key of each machine you have accepted, filed under its name, or under
`[name]:port` for a port other than 22. Each EiN account has its own.

What happens with a machine whose key is not in the file is up to `StrictHostKeyChecking`:

| Value           | Unknown host                                | Changed key          |
| --------------- | ------------------------------------------- | -------------------- |
| `ask` (default) | Asks you; refuses when there is no terminal | Refuses              |
| `yes`           | Refuses                                     | Refuses              |
| `accept-new`    | Adds the key without asking                 | Refuses              |
| `no`            | Adds the key without asking                 | Warns, then connects |

In a script, `-o StrictHostKeyChecking=accept-new` saves the first question while still catching a
key that changes later.

When a machine's key has changed, `ssh` stops with a warning that starts
`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`, prints the new fingerprint and the line numbers
of the old entry, and ends with `Host key verification failed.` Either someone is between you and
the machine, or the machine was reinstalled and has a new key. When you know it is the second, forget
the old key and connect again to accept the new one:

```bash
# in EiN's terminal
ssh-keygen -R nas.local
ssh-keygen -R '[backup.example.com]:2222'
```

`known_hosts` lines written by OpenSSH work as they are, hashed names and `@revoked` included.
`@cert-authority` lines are skipped: EiN does not check host certificates.

## Mount a folder of another machine

The administrator can mount a folder of another machine into the tree over SFTP. Its files then show
under the mount point and stay on the other machine.

1. As the administrator, make a key without a passphrase and put it on the other machine. A mount
   logs in with a key only, since it reconnects on its own when nobody is there to type a password.
   If `~/.ssh` does not exist yet, run `ssh-keygen` once without `-f` first, or `mkdir ~/.ssh`:

   ```bash
   # in EiN's terminal, as the administrator
   ssh-keygen -f ~/.ssh/nas -N ''
   ssh-copy-id -i ~/.ssh/nas.pub anna@nas.local
   ```

2. Make the mount point, which must exist, and mount the folder on it:

   ```bash
   # in EiN's terminal, as the administrator
   mkdir -p /mnt/nas
   mount --save /mnt/nas sftp "host=nas.local,user=anna,path=/srv/photos,key=/home/admin/.ssh/nas"
   ```

   ```text
   mounted sftp at '/mnt/nas' (saved in /etc/fstab)
   ```

   The first mount from a terminal asks about an unknown host key as `ssh` does. `--save` writes the
   mount to `/etc/fstab`, so it is made again every time EiN starts.
3. Run `ls /mnt/nas` to see the files, and `mount` alone to list every mount.

| Option       | What it is                                                                               |
| ------------ | ---------------------------------------------------------------------------------------- |
| `host`       | The machine. Required.                                                                   |
| `port`       | The port; 22 unless set.                                                                 |
| `user`       | The remote user; the administrator's EiN username unless set.                            |
| `path`       | The remote folder to mount. A relative one starts in the remote user's home.             |
| `key`        | The key file in EiN's tree. Without it, the default keys in `~/.ssh` are tried.          |
| `hostkey`    | The host key's fingerprint (`SHA256:…`) to accept, instead of `known_hosts`.             |
| `uid`, `gid` | The EiN user and group that own every file in the mount; the administrator's unless set. |
| `readonly`   | Nothing in the mount can be changed from EiN.                                            |

Options are `key=value` pairs separated by commas; values cannot hold a comma or `=`.

How a mount behaves:

- **Ownership comes from the mount, permissions from the other machine.** Every file belongs to the
  mount's `uid` and `gid`, whoever owns it there; the permission bits are the other machine's. To let
  a group read the files, give the mount that `gid` and make the files group-readable there.
- **Nothing is processed.** The mount is a mirror: EiN makes no thumbnails, reads no dates and finds
  no faces in it. To bring photos into the archive, copy them into
  staging.
- **It reconnects on its own.** When the other machine goes away, commands on the mount fail with
  the reason and the time of the next attempt (`next attempt in 8s`); the wait grows to at most a
  minute between attempts.
- **At start-up it does not wait.** EiN mounts the saved entries without waiting for the other
  machine, and connects once it answers. It asks nobody about host keys then, so a host must already
  be in `known_hosts` or be pinned with `hostkey=`. Pinning the fingerprint is the safer choice for a
  saved mount.

To take a mount away, and out of `/etc/fstab`:

```bash
# in EiN's terminal, as the administrator
unmount --save /mnt/nas
```

`mount -a` makes every `/etc/fstab` entry that is not mounted yet. Only the administrator can mount
and unmount; everyone can list mounts with `mount`. See
[mount](../reference/commands-core.md#mount) and [unmount](../reference/commands-core.md#unmount).

## What is not there

The commands cover logging in, running commands, copying and keys. There is no port forwarding
(`-L`, `-R`, `-D`), no agent and no agent forwarding, no jump hosts, and no `sftp` or `rsync`
command; use `scp`, or a mount. `ssh` refuses flags it does not have with `unknown option`.

## When something goes wrong

| Message                                                                                               | What it means and what to do                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `permission denied, you must be a member of group 'ssh'`                                              | Ask the administrator to add you to **SSH users**, then sign out and in.                                                                                                               |
| `Could not resolve hostname nas.local: Name or service not known`                                     | The machine EiN runs on does not know that name. Names ending in `.local` may not resolve where EiN runs; use the IP address, or set it as `HostName` in `~/.ssh/config`.              |
| `connect to host nas.local port 22: Connection refused`                                               | Nothing listens on that port: the SSH server is off, or on another port (`-p`).                                                                                                        |
| `connect to host nas.local port 22: Connection timed out`                                             | No answer within 15 seconds: the machine is off, or a firewall is between it and EiN.                                                                                                  |
| `anna@nas.local: Permission denied.`                                                                  | The keys were refused and the password was wrong or not asked for. In a script there is nobody to ask, so only keys are tried: install one with `ssh-copy-id`.                         |
| `No ED25519 host key is known for nas.local` … `Connect once from an interactive shell to accept it.` | The host is unknown and there was nobody to ask (a script, `BatchMode`, or `StrictHostKeyChecking yes`). Connect once from the terminal, or use `-o StrictHostKeyChecking=accept-new`. |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`                                                    | See [Host keys](#host-keys).                                                                                                                                                           |
| `Warning: Identity file /home/helen/.ssh/nas not accessible: No such file or directory.`              | The key named with `-i` or `IdentityFile` is not there. Check the path with `ls ~/.ssh`.                                                                                               |
| `Load key "/home/helen/.ssh/id_rsa": encrypted, and no one to ask for its passphrase`                 | A key with a passphrase and no `.pub` beside it, used where nobody can type it. Use a key without a passphrase for scripts and mounts.                                                 |
| `ssh-copy-id: no public key found in ~/.ssh; make one with ssh-keygen`                                | Run `ssh-keygen` first.                                                                                                                                                                |
| `ssh-copy-id: WARNING: All keys were skipped because they already exist on the remote system.`        | Nothing to do: the key is installed. `-f` adds it again.                                                                                                                               |
| `mount: permission denied, only admin is allowed to mount`                                            | Mounting is for the administrator.                                                                                                                                                     |

## Related pages

- [SSH and SFTP](ssh-sftp.md): reaching EiN from your own computer.
- [The terminal](terminal.md): where these commands run.
- [Commands by task](commands.md): the other commands, grouped by what they do.
- [Accounts and groups](../admin/accounts.md): groups and how membership works.
- [Ports, HTTPS and remote access](../admin/network.md): the network around the machine EiN runs on.
- [Files and storage](../concepts/files.md): where file contents are kept.
