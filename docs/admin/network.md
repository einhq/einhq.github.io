# Ports, HTTPS and remote access

This page is for whoever runs EiN: which ports it listens on and how to change them, how to put it behind an HTTPS proxy, and how to reach it from outside your home safely. It assumes an installation made with the installer, in `~/ein`; [Installing in detail](install.md) explains that folder.

## What EiN listens on

EiN publishes two ports, on every address of the machine it runs on:

| Port   | What answers                                   | Protocol   |
| ------ | ---------------------------------------------- | ---------- |
| `8080` | the web interface, its files and its WebSocket | plain HTTP |
| `2222` | the SSH and SFTP server                        | SSH        |

These are the ports `setup.sh` picks. When another program on the machine already listens on one, it takes the next free port instead, writes it to `.env` and says so ("Port 8080 is taken on this machine: EiN uses 8081 instead").

Nothing else is reachable from outside. The database, and the media service and the language model when they are installed, answer only EiN, on the containers' own network: no port of theirs is published on the machine.

EiN itself serves plain HTTP only. It has no certificate and no HTTPS port of its own. On your home network that is fine; for anything else, an HTTPS proxy goes in front of it, as described in [Put EiN behind HTTPS](#put-ein-behind-https).

## Change the ports or the address

Which ports the machine publishes, and on which address, are three lines in `~/ein/.env`, written at the install:

```ini
# in ~/ein/.env
EIN_BIND=0.0.0.0
EIN_HTTP_PORT=8080
EIN_SSH_PORT=2222
```

| Line            | What it decides                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `EIN_BIND`      | The address of the machine the two ports are published on. `0.0.0.0` is every address; `127.0.0.1` keeps them to the machine itself. |
| `EIN_HTTP_PORT` | The port of the machine that reaches the web interface.                                                                              |
| `EIN_SSH_PORT`  | The port of the machine that reaches SSH and SFTP.                                                                                   |

To change one:

1. Open `~/ein/.env` in an editor and change the value.
2. Apply it:

   ```bash
   # on the machine EiN runs on, in ~/ein
   podman compose up -d   # or: docker compose up -d
   ```

   Running `./setup.sh` applies it too, and also updates EiN.
3. Open EiN at the new address, such as `http://ein.local:8443/` after `EIN_HTTP_PORT=8443`.

Inside its container EiN always listens on 8080 and 2222; these lines only change what the machine maps to them.

> [!WARNING]
> Leave the settings **HTTP port** and **SSH port** (`CFG_HTTP_PORT`, `CFG_SSH_PORT`) on **Settings → System**, in the **Network** group, as they are. They set the ports EiN listens on inside its container, and the machine forwards only 8080 and 2222 to it: a change there makes the web interface or SSH unreachable at the next start. Change `.env` instead.

A few things to know:

- **Ports below 1024**, such as 80 or 443, cannot be published by rootless podman unless the machine allows it (the kernel setting `net.ipv4.ip_unprivileged_port_start`). Use a port above 1024, or let an HTTPS proxy take 443.
- **`EIN_BIND` takes one address.** With an address other than `0.0.0.0` or `127.0.0.1`, such as the machine's LAN address, EiN runs normally, but `setup.sh` waits for it at `127.0.0.1`, does not find it, and ends with "EiN did not answer" after ten minutes.
- **The built-in guide** shows SSH commands with port 2222 even when `EIN_SSH_PORT` maps another port, since that is the port EiN listens on. Tell your family the port you chose.

## Open the ports in the firewall

When another computer on the network cannot open EiN while the machine itself can, the machine's firewall is the usual cause. Open the two ports there:

```bash
# on the machine EiN runs on, with ufw (Ubuntu, Debian)
sudo ufw allow 8080/tcp
sudo ufw allow 2222/tcp
```

```bash
# on the machine EiN runs on, with firewalld (Fedora, RHEL)
sudo firewall-cmd --permanent --add-port=8080/tcp --add-port=2222/tcp
sudo firewall-cmd --reload
```

Use your own port numbers if you changed them. Behind an HTTPS proxy on the same machine, open the proxy's port (443) instead, and not 8080.

> [!NOTE]
> Docker opens the ports it publishes in the machine's packet filter itself, past rules set with ufw. A closed port in ufw does not keep EiN's ports off the network under Docker; `EIN_BIND=127.0.0.1` does.

## Put EiN behind HTTPS

An HTTPS proxy is a web server that holds the certificate, answers browsers over HTTPS, and passes each request on to EiN over plain HTTP. You need one when:

- EiN is reached from outside your home, so that passwords and pictures do not cross the internet unencrypted;
- a phone should add EiN to its home screen as an app, which needs an address beginning with `https://` (see [EiN on a phone](../guide/phone.md#put-ein-on-your-home-screen));
- you want the browser's clipboard to work everywhere: over plain HTTP, copying a share link falls back to selecting the text.

### What EiN needs from the proxy

Any proxy works, such as Caddy, nginx or Traefik, when it does the following:

| Requirement                                                    | Why                                                                                                                                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Serves EiN at the root of its own host name                    | The interface asks for `/file/…`, `/s/…` and `/__shell` from the root. EiN cannot be served under a path such as `https://example.org/ein/`.                                      |
| Passes WebSocket connections                                   | The whole interface talks to EiN over a WebSocket at `/__shell`, not only the terminal. Without it, pages do not load their contents.                                             |
| Sends `X-Forwarded-Proto: https` (or `Forwarded: proto=https`) | EiN then marks its sign-in cookie `Secure`, so the browser sends it only over HTTPS. Over plain HTTP the cookie is not marked, so the same EiN keeps working on the home network. |
| Has no limit on the size of a request                          | A file is uploaded in one request, whole: a long video is several gigabytes.                                                                                                      |
| Allows long requests and idle connections                      | Uploads and downloads of large files take time, and the WebSocket can be quiet for minutes. When the proxy closes it, the interface reconnects after two seconds.                 |

The proxy keeps the `Host` header as the browser sent it; EiN uses whatever address the browser shows.

### Caddy

Caddy gets a certificate from Let's Encrypt by itself and does everything in the table without further settings. For a host name that points at your home, such as `ein.wrenfield.example`:

```text
# /etc/caddy/Caddyfile, on the machine EiN runs on
ein.wrenfield.example {
	reverse_proxy 127.0.0.1:8080
}
```

Then reload Caddy (`sudo systemctl reload caddy`). For the certificate, Caddy must be reachable on ports 80 and 443 from the internet under that name.

For HTTPS on the home network only, such as for `ein.local`, Caddy can sign its own certificate with `tls internal`. Browsers warn about it until Caddy's root certificate is installed on each device:

```text
# /etc/caddy/Caddyfile, on the machine EiN runs on
ein.local {
	tls internal
	reverse_proxy 127.0.0.1:8080
}
```

### nginx

nginx needs the WebSocket, the size limit and the timeouts set explicitly. With a certificate you have already obtained, for example with certbot:

```text
# /etc/nginx/conf.d/ein.conf, on the machine EiN runs on
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 443 ssl;
    server_name ein.wrenfield.example;
    ssl_certificate     /etc/letsencrypt/live/ein.wrenfield.example/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ein.wrenfield.example/privkey.pem;

    client_max_body_size 0;
    proxy_request_buffering off;
    proxy_buffering off;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 1h;
        proxy_send_timeout 1h;
    }
}
```

Check it with `sudo nginx -t` and reload with `sudo systemctl reload nginx`.

### Keep EiN's own port to the machine

With the proxy on the same machine, nothing else needs to reach port 8080. Close it to the network:

1. In `~/ein/.env`, set `EIN_BIND=127.0.0.1`.
2. Apply it with `podman compose up -d` (or `docker compose up -d`) in `~/ein`.
3. Open `https://ein.wrenfield.example/` and sign in.

This closes port 2222 to the network as well, since `EIN_BIND` applies to both. To keep SSH and SFTP reachable from other machines, leave `EIN_BIND=0.0.0.0` and close 8080 in the firewall instead (under Docker, see the note in [Open the ports in the firewall](#open-the-ports-in-the-firewall)).

To check that the proxy passes everything, sign in, open a few pages, upload a file, and open the terminal with <kbd>Alt</kbd>+<kbd>T</kbd> (see [The terminal](../shell/terminal.md)): each of these uses a different part of the table above.

## Reach EiN from outside your home

There are three ways, from the least exposed to the most:

| Way                                   | What you set up                                                                                                                                                  | Who can reach EiN                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| A VPN, such as WireGuard or Tailscale | The VPN on the machine and on each device. EiN needs no change: devices open its usual address over the VPN.                                                     | Only devices on the VPN.                           |
| An SSH tunnel through the machine     | The machine's own SSH server (not EiN's), reachable from outside. On the laptop: `ssh -L 8080:127.0.0.1:8080 you@your-home`, then open `http://localhost:8080/`. | Only people with an account on the machine.        |
| A public HTTPS proxy                  | A host name pointing at your home, ports 80 and 443 forwarded by your router to the proxy, and the proxy in front of EiN as above.                               | Anyone on the internet can reach the sign-in page. |

EiN's own SSH server does not forward ports, so the tunnel goes through the machine's SSH server, not through port 2222.

Only the public proxy makes [share links](../guide/sharing.md#share-an-album-with-a-link) work for people outside the family: a share link begins with the address the person who made it had open, so it reaches whoever can reach that address. Make links while EiN is open at its public address, not at `http://ein.local:8080`.

### Before you open EiN to the internet

- **Change the admin password** if you have not: [Install EiN](../start/install.md#change-the-admin-password-straight-away) shows how. Give every account a password of its own; [Accounts and groups](accounts.md) covers them.
- **Leave visitors out.** The setting **Visitors may browse** (`CFG_GUEST_BROWSING`, under **Settings → System**) is off after an install. Keep it off: on, anyone who reaches EiN can browse what is shared with visitors without signing in.
- **Publish HTTPS only.** Forward only the proxy's ports, never 8080, which is plain HTTP.
- **Decide about SSH.** Port 2222 is not needed for the web interface. Leave it closed to the internet and use SSH and SFTP over the VPN, or forward it on your router and have people sign in with keys; see [SSH and SFTP](../shell/ssh-sftp.md).

### How EiN slows down password guessing

EiN counts failed sign-ins, in the web interface and over SSH alike, per client address and per account:

- After five failures from one address, that address is refused without its password being checked, with "too many failed sign-ins; try again in" and the number of seconds. The wait starts at a second and doubles with each further failure, up to 15 minutes.
- After five failures at one account, each attempt at it waits, up to 10 seconds, but the account is never locked: someone guessing a password cannot lock its owner out.
- A failed attempt is answered no sooner than a second after it was made.
- Failures are forgotten an hour after the last one.

Repeated failures are logged as "repeated failed sign-ins", with the address or account; [Services and logs](services-logs.md) shows where to read them.

EiN believes `X-Forwarded-For` and `Forwarded` only from a proxy whose connections reach it from the loopback address. When the proxy's connections reach EiN from another address, as can happen with the container's network in between, EiN sees every visitor as the proxy: `who` in EiN's terminal then shows the proxy's address for every web connection, and failures from one visitor hold back everyone who comes through the proxy. Run `who` once after setting up the proxy to see which you have.

```bash
# in EiN's terminal, as an administrator
who
```

## SSH and SFTP from another network

SSH does not go through an HTTPS proxy. To reach EiN's SSH server from outside, forward a TCP port on your router to the machine's `EIN_SSH_PORT`, or connect over a VPN. Then connect with the host name and the port:

```bash
# on your own computer
ssh -p 2222 helen@ein.wrenfield.example
sftp -P 2222 helen@ein.wrenfield.example
```

The server's host key is made at EiN's first start and kept in the tree as `/etc/ssh_host_key`, with its public half in `/etc/ssh_host_key.pub`, so it stays the same across updates and new containers. A client warns about a changed host key only when EiN was installed afresh. [SSH and SFTP](../shell/ssh-sftp.md) covers keys, clients and file managers.

## When something goes differently

| What you see                                                                                                       | What to do                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EiN opens on the machine itself but not from another computer                                                      | Open the ports in the machine's firewall, and check that `EIN_BIND` is `0.0.0.0`. Try the machine's IP address instead of a name ending in `.local`.                                                                                                        |
| `compose up` fails because the address or port is already in use                                                   | Another program has the port. Choose another `EIN_HTTP_PORT` or `EIN_SSH_PORT` in `.env`, or stop that program.                                                                                                                                             |
| Behind the proxy, the page frame loads but stays empty, and the terminal does not connect                          | The proxy does not pass WebSocket connections. Add the `Upgrade` and `Connection` headers (nginx) or check the proxy's WebSocket support.                                                                                                                   |
| Uploads of large files fail behind the proxy, often with 413                                                       | The proxy limits the size of a request. In nginx, set `client_max_body_size 0;`.                                                                                                                                                                            |
| The terminal or the interface reconnects every minute behind the proxy                                             | The proxy closes idle connections. Raise its read timeout, such as `proxy_read_timeout 1h;` in nginx.                                                                                                                                                       |
| Signing in works, but the next page asks you to sign in again                                                      | The browser uses plain `http://` while something in front of EiN sends `X-Forwarded-Proto: https`, so the cookie is marked `Secure` and the browser does not send it back. Open the `https://` address, or have the proxy send the scheme the browser used. |
| Signing in says "too many failed sign-ins"                                                                         | Wait the seconds it names. When it keeps happening to everyone behind your proxy, EiN sees all of them as one address: see [How EiN slows down password guessing](#how-ein-slows-down-password-guessing).                                                   |
| After a change to **HTTP port** or **SSH port** on **Settings → System**, the web interface or SSH does not answer | Reset the setting through the one that still answers: on the **System** tab, or with `config unset CFG_HTTP_PORT` (or `CFG_SSH_PORT`) in EiN's terminal or over SSH. Then restart EiN with `podman compose restart ein` in `~/ein`.                         |
| A share link does not open for the person you sent it to                                                           | It begins with the address you had open. Open EiN at its public address and make the link again; see [Sharing](../guide/sharing.md).                                                                                                                        |
| `setup.sh` ends with "EiN did not answer at http://127.0.0.1:…"                                                    | When `EIN_BIND` is an address other than `0.0.0.0` or `127.0.0.1`, this is expected and EiN is running: open it at that address. Otherwise read `podman compose logs ein`; see [Troubleshooting](troubleshooting.md).                                       |

## Related pages

- [Installing in detail](install.md): the `~/ein` folder, `.env` and `setup.sh`.
- [Configuration](configuration.md): settings, `.env` and where each is kept.
- [SSH and SFTP](../shell/ssh-sftp.md): signing in with keys, file managers and `scp`.
- [EiN on a phone](../guide/phone.md): what HTTPS gives a phone.
- [Sharing](../guide/sharing.md): share links and who can open them.
- [Settings](../reference/settings.md#cfg_http_port): the reference entries for the ports and every other setting.
- [Troubleshooting](troubleshooting.md): when EiN does not start or answer at all.
