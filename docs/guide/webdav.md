# WebDAV

EiN serves its tree over WebDAV, at `/dav/` on the address you open the Web UI at, so programs that
sync or browse files over the web can reach your files without SSH. Above all that is a phone's
backup app, which sends each new photo into your staging area by itself (see
[Back up your phone automatically](phone.md#back-up-your-phone-automatically)), but a file manager
that connects to WebDAV works too. This page is for anyone with an EiN account who sets up such a
program.

## What you need

| What         | Example                              | Where it comes from                                                                                                                                                                      |
| ------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The address  | `https://ein.wrenfield.example/dav/` | The address you open EiN at, with `/dav/` after it. Most apps take only one that begins with `https://`; see [Ports, HTTPS and remote access](../admin/network.md#put-ein-behind-https). |
| Your account | `helen`                              | Your EiN username. Your e-mail address works too, where your account has one.                                                                                                            |
| Your secret  | your password                        | The password you sign in to the Web UI with.                                                                                                                                             |

The program sends your password with every request it makes. Over an `https://` address that is
encrypted on its way; over a plain `http://` one, on your home network, anyone on that network who
listens can read it, as with the Web UI's sign-in there.

The examples below use Helen Okafor's account `helen` and the address `https://ein.wrenfield.example`.
Use your own.

## What the tree looks like over WebDAV

`/dav/` is the root of EiN's tree, so `/dav/home/helen/` is Helen's home and
`/dav/home/helen/staging/files/` her staging area, with the Archive installed. What you may see and
change is decided by the same [permissions](../admin/permissions.md) as in the Web UI and over SFTP:
a folder you cannot open in the browser cannot be opened over WebDAV either.

A few things differ from the Web UI:

- **A file is a file.** What EiN keeps about a photo, such as its EXIF data, its faces and its
  thumbnails, is not shown; [SFTP](../shell/ssh-sftp.md#what-the-tree-looks-like-over-sftp) shows it.
- **A link is shown as what it points to**: a favourite folder as that folder, a picture added to an
  album as the picture. A link that leads to nothing you may open is left out. A program that copies a
  folder therefore copies what its links point to; SFTP copies the links themselves.
- **A file's date** is when its content last changed, not when EiN last learned something about it.
  A sync program that compares dates does not send a photo again because its faces were found.

## What a program can do

| To                                    | Over WebDAV                                                                                                                                          |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| List folders and read files           | Yes.                                                                                                                                                 |
| Send a file                           | Yes. It is taken in as an upload in the browser is: into a staging category, a photo waits there to be sorted.                                       |
| Make a folder, rename and move        | Yes.                                                                                                                                                 |
| Delete                                | Yes, into your trash, as **Move to trash** in the Web UI does; see [Your profile, favourites and trash](profile.md). Over SFTP a delete is for good. |
| Set a file's date                     | Yes, as sync programs do after sending a file.                                                                                                       |
| Copy a file within EiN                | No. A program that asks EiN to make the copy is refused; one that copies by reading and sending again works.                                         |
| Lock a file while it is being changed | No. So macOS Finder and Windows' **Map network drive** show EiN, but read-only.                                                                      |

What lies in a trash can be read over WebDAV but not changed: restore it from your trash in the Web
UI.

### Photos you send are frozen

A picture, video or recording you send is [frozen](../concepts/files.md#frozen-files) once the
whole of it has arrived, as an upload in the browser is: sending another file under its name is
refused with `403 Forbidden`, while renaming, moving and deleting it work. Which types are frozen is
up to your administrator, in `/etc/frozen-uploads`.

A file whose sending breaks off part-way, as when the phone loses its connection, is not kept: the
program sends it again from the start next time.

## Signing in

A program signs in with your username and password on each request, so there is nothing to sign
out of. EiN remembers a password that was right for up to an hour, so a program sending thousands
of files is not slowed down by checking it each time, but it notices at once when the password is
changed or the account disabled: the next request is refused.

Wrong passwords count as failed sign-ins, in the Web UI, over SSH and over WebDAV alike, and many of
them hold back the address they come from for a while; [How EiN slows down password guessing](../admin/network.md#how-ein-slows-down-password-guessing) has the rules. Sign-ins over
WebDAV are recorded in the access log with the way in `dav`.

## When something goes wrong

| What you see                                               | Why                                                                                                                   | What to do                                                                                                                          |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| The program cannot connect, or wants an `https://` address | EiN is reached over plain `http://`, which most apps refuse for WebDAV.                                               | Ask your administrator for an `https://` address; see [Ports, HTTPS and remote access](../admin/network.md#put-ein-behind-https).   |
| `401 Unauthorized`                                         | The username or password is wrong, the account is disabled, or there were too many failed sign-ins from your address. | Check the username and password. After many failures, wait: the message says how long ("too many failed sign-ins; try again in …"). |
| `403 Forbidden` when sending a file                        | A frozen photo is already there under that name, or you may not write in that folder.                                 | Send it under another name, or into a folder of yours, such as a staging category.                                                  |
| `403 Forbidden` from a web page                            | WebDAV refuses requests a browser says come from a page, so no page can act as you through it.                        | Use a WebDAV program, not a page in a browser.                                                                                      |
| `409 Conflict`                                             | The folder the file should go into does not exist.                                                                    | Make the folder first.                                                                                                              |
| Sending a long video stops after about a minute            | The HTTPS proxy in front of EiN ends requests that take longer than it allows.                                        | Ask your administrator; [Ports, HTTPS and remote access](../admin/network.md#what-ein-needs-from-the-proxy) has the setting.        |

## Related pages

- [EiN on a phone](phone.md): backing up a phone's photos with an app.
- [SSH and SFTP](../shell/ssh-sftp.md): the shell and file transfers over SSH, with what WebDAV leaves out.
- [Getting your photos in](../archive/importing.md): every way files get into EiN.
- [Ports, HTTPS and remote access](../admin/network.md): HTTPS and reaching EiN from outside the home, for administrators.
