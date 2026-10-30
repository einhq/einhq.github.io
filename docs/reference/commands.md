<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Commands

Every command an EiN with all its modules has: 350 of them. Each module's page describes its commands in full; this page lists them by what they are for, in a line each.

## Reading an entry

Each command is shown with how it is typed:

```text
share-link [--expires=<string>] [--never] [--session] <subcommand> <target>
```

- `<target>` is something you give, `[...]` may be left out, and `...` may be given more than once.
- `--name=<value>` takes a value after an equals sign, which a value starting with a minus needs (`--lng=-3.7`); `-x` is a short option.
- _administrators only_ marks a command only the administrator may run; _visitors too_, one a visitor browsing without signing in may run.
- _answers JSON_ marks a command whose answer comes as JSON with `JSON_OUTPUT=1` in front of it, which is what the web interface reads.

A command of a family, such as `mod-install` or `user-passwd`, can be typed as two words where the family has a command of its own: `mod install archive`. In the shell, `<command> --help` says the same as these pages, for what is installed there; the documentation page in the web interface has them too.

## Core

[All 207 in full](commands-core.md).

| Command | What it does |
| --- | --- |
| [abspath](commands-core.md#abspath) | Ensure path is abspath. |
| [acl](commands-core.md#acl) | Display or modify a node access control list. |
| [admin](commands-core.md#admin) | Become the administrator in this terminal, for a member of the sudo group (user-elevate) |
| [attrs](commands-core.md#attrs) | Display or set node attributes. |
| [audit](commands-core.md#audit) | Show who created, changed, moved, linked or removed which node, and when (administrators only) |
| [awk](commands-core.md#awk) | Pattern scanning and text processing language (fields, patterns, arrays, printf) |
| [basename](commands-core.md#basename) | Strip directory and suffix from filenames. |
| [cat](commands-core.md#cat) | Print nodes' contents, one after the other: a text file, a log (one JSON entry a line), a position or an embedding (JSON) |
| [chmod](commands-core.md#chmod) | Change file mode bits. |
| [chown](commands-core.md#chown) | Change file owner and group. |
| [clear](commands-core.md#clear) | Clear the terminal screen. |
| [comment](commands-core.md#comment) | Manage comments on a node (list, add, remove) |
| [completion](commands-core.md#completion) | Spec-driven completion helpers. |
| [completion-arg](commands-core.md#completion-arg) | Autocomplete a command argument. |
| [completion-commands](commands-core.md#completion-commands) | Autocomplete a command name, without the subcommands of groups. |
| [completion-entity](commands-core.md#completion-entity) | Complete a person, location, album, device or track by name. |
| [completion-group](commands-core.md#completion-group) | Autocomplete a group. |
| [completion-path](commands-core.md#completion-path) | Autocomplete a path. |
| [completion-subcommand](commands-core.md#completion-subcommand) | Autocomplete a command. |
| [completion-user](commands-core.md#completion-user) | Autocomplete a user. |
| [config](commands-core.md#config) | Read and change system and personal settings. |
| [config-get](commands-core.md#config-get) | Print the effective value of one setting; for a key, only whether it is set. |
| [config-list](commands-core.md#config-list) | List settings with their effective values. |
| [config-publish](commands-core.md#config-publish) | Copy settings from this process's environment into /etc/environment. |
| [config-set](commands-core.md#config-set) | Change a setting and restart the services that read it only at start. |
| [config-unset](commands-core.md#config-unset) | Reset a setting to its default. |
| [cp](commands-core.md#cp) | Copy files and directories. |
| [cut](commands-core.md#cut) | Remove sections from each line of files. |
| [date](commands-core.md#date) | Print or set the system date and time. |
| [detach](commands-core.md#detach) | detach a job so it keeps running after the shell closes. |
| [df](commands-core.md#df) | Free space per storage tier, its growth per day and when it fills, and the database size. |
| [dirname](commands-core.md#dirname) | Strip last component from file name. |
| [dmesg](commands-core.md#dmesg) | Print system log. |
| [docs](commands-core.md#docs) | Describe what this installation is made of: its commands, node types and environment variables. |
| [docs-commands](commands-core.md#docs-commands) | List every command on your PATH with its full spec and the module it comes from. |
| [docs-env](commands-core.md#docs-env) | List the environment variables EiN and its modules read, with their values in this shell. |
| [docs-find](commands-core.md#docs-find) | Commands by what they do, best first: by the command CFG_COMMAND_FINDER names, else by their words. |
| [docs-node-types](commands-core.md#docs-node-types) | List every node type, described or in use, with what it is for and how many exist. |
| [du](commands-core.md#du) | Estimate file usage in node structures. |
| [edit](commands-core.md#edit) | Edit a text file, with syntax highlighting and checks for JSON, YAML, bash and Markdown. |
| [env](commands-core.md#env) | Print environment variables. |
| [events](commands-core.md#events) | What falls on the days around a date, from every events-* command on PATH. |
| [facets](commands-core.md#facets) | Bucket counts (per year, per kind) for sizing search filters. |
| [file-stat](commands-core.md#file-stat) | Stat for on disk file. |
| [file-sync](commands-core.md#file-sync) | Sync for on disk file. |
| [find](commands-core.md#find) | Search for nodes under a path, as GNU find does: starting points, then an expression of tests (-name -iname -path -ipath GLOB, -regex -iregex RE on the whole path, -type f\|d\|l\|<node type>, -empty, -size [+-]N[cwbkMG], -user -group NAME, -uid -gid N, -newer PATH, -mmin and -mtime [+-]N), operators (! -not -a -o and parentheses), options (-maxdepth -mindepth N, -depth) and actions (-print -print0 -printf FORMAT -prune -quit -delete, -exec CMD {} ';' and -exec CMD {} +); -printf knows %p %f %h %P %d %s %y %m %u %g %U %G %t %c and %Tk %Ck %Bk for k in @YymdHMSFTDab+; the flags below are the same tests. |
| [find-containing](commands-core.md#find-containing) | Find positions whose shape contains a point. |
| [find-nearby](commands-core.md#find-nearby) | Find positions near a position node, by distance. |
| [find-similar](commands-core.md#find-similar) | Find similar nodes by embedding. |
| [fold](commands-core.md#fold) | Wrap each input line to fit a width (fold -w1: one character per line) |
| [gauges](commands-core.md#gauges) | List the gauges running services draw beside the host's (a card's memory, say) |
| [grep](commands-core.md#grep) | Search for patterns in input. |
| [group](commands-core.md#group) | Manage groups. |
| [group-add-member](commands-core.md#group-add-member) | Add a user to a group. |
| [group-create](commands-core.md#group-create) | Create a new group. |
| [group-delete](commands-core.md#group-delete) | Delete a group: what it owned goes to another group, and ACL entries naming it are dropped. |
| [group-exists](commands-core.md#group-exists) | Check if a group exists. |
| [group-info](commands-core.md#group-info) | Display group information. |
| [group-is-member](commands-core.md#group-is-member) | Check if a user is a member of a group. |
| [group-list](commands-core.md#group-list) | List the groups; as JSON with each one's description and built-in role. |
| [group-members](commands-core.md#group-members) | List members of a group. |
| [group-remove-member](commands-core.md#group-remove-member) | Remove a user from a group. |
| [group-resolve](commands-core.md#group-resolve) | Resolve group name to GID or vice versa. |
| [group-update](commands-core.md#group-update) | Update a group's title or description; its gid is fixed when it is created. |
| [head](commands-core.md#head) | Output the first part of files, logs, or stdin; on a queue, the next entries without consuming them. |
| [health](commands-core.md#health) | Say whether the system is healthy, catching up, stuck or needs a person, and the checks that decide it. |
| [host-metrics](commands-core.md#host-metrics) | The machine's CPU, this container's memory and event-loop lag now, with their recent history from metrics-sampler. |
| [http-server](commands-core.md#http-server) | Start an HTTP server. |
| [info](commands-core.md#info) | Display node ID and type. |
| [jq](commands-core.md#jq) | Lightweight JSON processor. |
| [label](commands-core.md#label) | Manage labels/tags (add, remove, list, prune) |
| [labels](commands-core.md#labels) | List labels (all, or of a node); search --tag <label> finds what carries one. |
| [ln](commands-core.md#ln) | Create links between files. |
| [log-append](commands-core.md#log-append) | Append a JSON entry to a log, optionally at an explicit (backdated) timestamp. |
| [login](commands-core.md#login) | Authenticate as a user. |
| [logout](commands-core.md#logout) | Log out of the current session. |
| [ls](commands-core.md#ls) | List directory contents. |
| [members](commands-core.md#members) | Who is in a container: an album's members by its rules, or a directory's media. |
| [metrics-sampler](commands-core.md#metrics-sampler) | Sample host, storage and workload metrics into /var/logs/metrics (long-running) |
| [mime](commands-core.md#mime) | Show stored, extension-based and content-sniffed mimetype of a node. |
| [mkbuf](commands-core.md#mkbuf) | Create a buffer node. |
| [mkdir](commands-core.md#mkdir) | Create a directory node (-p to create parents) |
| [mkfile](commands-core.md#mkfile) | Create an empty text file node (what touch does elsewhere) |
| [mklog](commands-core.md#mklog) | Create a log node. |
| [mknode](commands-core.md#mknode) | Create new or ensure node. |
| [mkpool](commands-core.md#mkpool) | Create a pool node. |
| [mkqueue](commands-core.md#mkqueue) | Create a queue node. |
| [mkrouter](commands-core.md#mkrouter) | Create a router node. |
| [mod](commands-core.md#mod) | Module management. |
| [mod-cache](commands-core.md#mod-cache) | Pre-fetch a module's TypeScript command dependencies. |
| [mod-groups](commands-core.md#mod-groups) | Say which groups a module is kept to, or keep it to some groups, or make it everyone's again. |
| [mod-info](commands-core.md#mod-info) | Show module information. |
| [mod-install](commands-core.md#mod-install) | Install modules from their repositories, or update them, with the dependencies they lack, and set them up. |
| [mod-list](commands-core.md#mod-list) | List installed modules, those kept to groups only for their members and administrators. |
| [mod-remove](commands-core.md#mod-remove) | Uninstall a module. |
| [mod-search](commands-core.md#mod-search) | The published modules: each module-* repository of the module sources (CFG_MODULE_SOURCES), with its version and whether it is installed. |
| [mod-setup](commands-core.md#mod-setup) | Set up a module already in the modules directory. |
| [mount](commands-core.md#mount) | Mount a filesystem. |
| [mv](commands-core.md#mv) | Move or rename files and directories, re-pointing the softlinks at each moved path or anywhere under it (and a relation link’s peerLink with them) |
| [news](commands-core.md#news) | What has been added lately, newest first, from every news-* command on PATH. |
| [nohup](commands-core.md#nohup) | run a command detached, immune to shell hang-up, logging to /var/logs/jobs. |
| [onthisday](commands-core.md#onthisday) | What the archive has from a calendar day (MM-DD, default today) in earlier years, from every onthisday-* command on PATH. |
| [parse-search](commands-core.md#parse-search) | A search's words read as filters — subjects, an area, years, kinds — by the command CFG_SEARCH_PARSER names, or as words when it names none. |
| [pipeline](commands-core.md#pipeline) | Manage pipelines. |
| [pipeline-cancel](commands-core.md#pipeline-cancel) | Cancel a running pipeline. |
| [pipeline-define](commands-core.md#pipeline-define) | Register a pipeline definition from a YAML file. |
| [pipeline-engine](commands-core.md#pipeline-engine) | Run the pipeline engine (long-running) |
| [pipeline-heal](commands-core.md#pipeline-heal) | Rerun failed instances after a growing wait, and mark those that keep failing for a person. |
| [pipeline-instances](commands-core.md#pipeline-instances) | List pipeline instances — running, failed or completed — newest first. |
| [pipeline-list](commands-core.md#pipeline-list) | List pipeline definitions. |
| [pipeline-overview](commands-core.md#pipeline-overview) | Pipeline workload summary: instance counts (running, failed, completed), queue depths, active instances, completion rate. |
| [pipeline-prune](commands-core.md#pipeline-prune) | Remove completed and cancelled pipeline instances; failed ones only when asked. |
| [pipeline-remove](commands-core.md#pipeline-remove) | Remove pipeline instances (cancels running ones first) |
| [pipeline-repair](commands-core.md#pipeline-repair) | Return instances marked terminal while still holding unfinished steps to running. |
| [pipeline-rerun](commands-core.md#pipeline-rerun) | Rerun pipeline(s) from the current definition, replacing the old instance. |
| [pipeline-restart](commands-core.md#pipeline-restart) | Restart a failed pipeline (re-queue failed steps) |
| [pipeline-start](commands-core.md#pipeline-start) | Manually start a pipeline. |
| [pipeline-status](commands-core.md#pipeline-status) | Show pipeline instance status. |
| [pipeline-step-restart](commands-core.md#pipeline-step-restart) | Run one pipeline step again: a failed or skipped one, or a running one, which is stopped first. |
| [pipeline-undefine](commands-core.md#pipeline-undefine) | Remove a pipeline definition, and cancel its running instances. |
| [pipeline-worker](commands-core.md#pipeline-worker) | Run a pool worker (long-running) |
| [pool](commands-core.md#pool) | Manage work pools. |
| [pool-add](commands-core.md#pool-add) | Add a job to a pool. |
| [pool-cancel](commands-core.md#pool-cancel) | Cancel pending or claimed jobs. |
| [pool-claim](commands-core.md#pool-claim) | Claim the best matching job from a pool under a lease. |
| [pool-list](commands-core.md#pool-list) | List jobs in a pool. |
| [pool-purge](commands-core.md#pool-purge) | Delete finished jobs so a pool does not grow without bound. |
| [pool-retry](commands-core.md#pool-retry) | Return failed or cancelled jobs to the pool with a clean attempt count. |
| [pool-stat](commands-core.md#pool-stat) | Show a pool backlog, job counts, policy and throughput per job kind; every pool without a path. |
| [pool-wake](commands-core.md#pool-wake) | Try resting job kinds again now, every resting kind without a name. |
| [position-get](commands-core.md#position-get) | Where nodes are: each path's name, type and the shape of its position (a location's, a picture's GPS) |
| [position-set](commands-core.md#position-set) | Set the shape of a position node (point, circle or polygon), making the node when it is missing. |
| [props](commands-core.md#props) | Display node properties. |
| [ps](commands-core.md#ps) | List the commands running now: pid, user, shell, how long, and the command line. Admin sees everyone's, anyone else their own. |
| [queue-dead](commands-core.md#queue-dead) | List the entries a queue set aside after their delivery attempts, or retry or drop them. |
| [queue-peek](commands-core.md#queue-peek) | List the next entries of a queue without consuming them. |
| [reach-check](commands-core.md#reach-check) | Check stored reach against a walk of each path, for a sample of nodes and every account. |
| [relate](commands-core.md#relate) | Create a bidirectional relation between two nodes. |
| [relations-guard](commands-core.md#relations-guard) | Remove reciprocal relation links when one side is deleted (long-running) |
| [resolve-id](commands-core.md#resolve-id) | Resolve node ID to path. |
| [rev](commands-core.md#rev) | Reverse lines character-wise. |
| [rm](commands-core.md#rm) | Remove (delete) files or directories. |
| [rmdir](commands-core.md#rmdir) | Remove empty directories. |
| [scp](commands-core.md#scp) | Copy files between EiN and another machine over SSH (members of group ssh) |
| [search](commands-core.md#search) | Faceted search over content: text, time, region, kind, tags, subjects (people, locations, devices) and containers. |
| [sed](commands-core.md#sed) | Stream editor for filtering and transforming text. |
| [seq](commands-core.md#seq) | Print a sequence of numbers. |
| [service](commands-core.md#service) | Manage system services. |
| [service-add](commands-core.md#service-add) | Add a service by linking to a service script directory. |
| [service-disable](commands-core.md#service-disable) | Disable a service. |
| [service-enable](commands-core.md#service-enable) | Enable a service. |
| [service-list](commands-core.md#service-list) | List services, with how often each has restarted. |
| [service-remove](commands-core.md#service-remove) | Remove a service. |
| [service-restart](commands-core.md#service-restart) | Restart a service. |
| [service-start](commands-core.md#service-start) | Start a service. |
| [service-start-all](commands-core.md#service-start-all) | Start all enabled services. |
| [service-status](commands-core.md#service-status) | Show service status. |
| [service-stop](commands-core.md#service-stop) | Stop a service. |
| [service-stop-all](commands-core.md#service-stop-all) | Stop all running services. |
| [session-reap](commands-core.md#session-reap) | Remove session and tty nodes left behind by dead shells. |
| [share](commands-core.md#share) | Show and set who has access to a node. |
| [share-info](commands-core.md#share-info) | Show who has access to a node, and through what. |
| [share-link](commands-core.md#share-link) | Make, list, change and turn off links that open a node without signing in. |
| [share-set](commands-core.md#share-set) | Set who has access to nodes and everything below them. |
| [sleep](commands-core.md#sleep) | Delay for a specified amount of time. |
| [sort](commands-core.md#sort) | Sort lines of text. |
| [ssh](commands-core.md#ssh) | Log in to another machine or run a command there (members of group ssh) |
| [ssh-copy-id](commands-core.md#ssh-copy-id) | Install your public key in another machine's authorized_keys (members of group ssh) |
| [ssh-keygen](commands-core.md#ssh-keygen) | Make an SSH key pair in ~/.ssh, show a fingerprint (-l) or forget a host key (-R) |
| [ssh-server](commands-core.md#ssh-server) | Start an SSH server. |
| [star](commands-core.md#star) | Bookmark nodes as softlinks in $HOME/stars (star <path>..., star -d <path>..., star [list]) |
| [stat](commands-core.md#stat) | Display file or node status. |
| [stats-overview](commands-core.md#stats-overview) | Per-type archive growth: nodes and bytes added by year and month. |
| [system-info](commands-core.md#system-info) | Which instance this is: host name, uptime, core's version and commit, the module API, each module's commit, and the PostgreSQL and Deno versions. |
| [tail](commands-core.md#tail) | Output the last part of files, logs, or stdin (with -f to follow) |
| [top](commands-core.md#top) | Watch the system live: CPU graph, memory and event-loop lag, disks, pipeline work, running commands, sessions, services and recent problems. Keys: q quits, arrows scroll, s sorts, + and - change the interval, p pauses. |
| [tr](commands-core.md#tr) | Translate or delete characters. |
| [trash](commands-core.md#trash) | Move nodes into the reader's trash, alone or as one batch, list it, restore entries, or empty it. |
| [truncate](commands-core.md#truncate) | Truncate an associated resource of a node if it has one. |
| [ui-build](commands-core.md#ui-build) | Bundle modules' pages into /var/cache/ui for the web UI to load, unless unchanged since the last build. |
| [ui-icons](commands-core.md#ui-icons) | Tabler icons by name, as SVG markup, for the web UI. |
| [ui-nav](commands-core.md#ui-nav) | The web UI's sidebar, top bar and panels for the caller, from every module's entries and the administrator's, the caller's groups' and the user's changes. |
| [uniq](commands-core.md#uniq) | Report or omit repeated lines. |
| [unmount](commands-core.md#unmount) | Unmount a filesystem. |
| [unrelate](commands-core.md#unrelate) | Remove a bidirectional relation (both sides) |
| [unzip](commands-core.md#unzip) | Expand a zip archive into a directory, streaming each entry. Refuses an archive with an entry that would land outside the directory, or whose files would not leave a tenth of their size free. A file already there at its entry’s size is left as it is, so a run that stopped can be run again. |
| [user](commands-core.md#user) | Manage users. |
| [user-create](commands-core.md#user-create) | Create a user account and its home with its own group (an existing group of its name when that group's gid is free as a uid) and link it into its own and its other groups. |
| [user-delete](commands-core.md#user-delete) | Delete a user account, its home, its own group, and its open sessions; what it owned goes to another user. |
| [user-disable](commands-core.md#user-disable) | Disable a user account and end its open sessions. |
| [user-elevate](commands-core.md#user-elevate) | Make this sign-in an administrator's, for a member of the sudo group, after entering the password again. |
| [user-enable](commands-core.md#user-enable) | Enable a disabled user account. |
| [user-exists](commands-core.md#user-exists) | Check if a user account exists. |
| [user-groups](commands-core.md#user-groups) | List groups a user belongs to. |
| [user-id](commands-core.md#user-id) | Print user and group IDs. |
| [user-info](commands-core.md#user-info) | Display user account information. |
| [user-list](commands-core.md#user-list) | List the user accounts; as JSON with each one's primary group, e-mail address, description, person and built-in role, and for an administrator whether a password is set. |
| [user-passwd](commands-core.md#user-passwd) | Change user password. |
| [user-resolve](commands-core.md#user-resolve) | Resolve username to UID or vice versa. |
| [user-set-primary-group](commands-core.md#user-set-primary-group) | Set a user's primary group. |
| [user-update](commands-core.md#user-update) | Update an account's display name, description and (an administrator only) e-mail address; anyone may update their own name and description. |
| [user-whoami](commands-core.md#user-whoami) | Print the current username. |
| [uuid](commands-core.md#uuid) | Generate a random UUID. |
| [wc](commands-core.md#wc) | Print newline, word, and byte counts of files or stdin. |
| [who](commands-core.md#who) | List who is signed in: each SSH login, terminal and web UI connection, the address it connects from, its idle time and what it runs. Admin sees everyone's, anyone else their own. |
| [www](commands-core.md#www) | Manage active web UI. |
| [xargs](commands-core.md#xargs) | Run a command with the items read from stdin as its arguments, as GNU xargs does: as many per run as fit, or -n per run, or one input line per run with -L, or once per line with -I replacing a string in the command. Items are separated by blanks and newlines, with quotes and backslashes as GNU has them; -0 and -d split on one character instead. The command reads an empty stdin; with no command it is echo. Exits 123 when a run failed, 124 when one exited 255, 125 when one was killed, 126 or 127 when one could not run. |

## Archive

[All 133 in full](../archive/commands.md).

| Command | What it does |
| --- | --- |
| [album](../archive/commands.md#album) | Manage albums (create, info, list, set, add files) |
| [album-cover](../archive/commands.md#album-cover) | Give an album without a cover a random one of its own pictures (coverPhoto softlink) |
| [album-profile](../archive/commands.md#album-profile) | Build the profile staging matches suggested groups against, beside each library album as its .profile: its members' times, days, places and people, and the pictures that stand for it. |
| [album-random](../archive/commands.md#album-random) | The path of one album somebody made, at random. |
| [album-span](../archive/commands.md#album-span) | Write an album's time span (timeStart/timeEnd/mediaCount) onto the album node: its media's, widened to the days set by hand (spanStart/spanEnd) |
| [album-stack](../archive/commands.md#album-stack) | Reconcile album-local stacks of consecutive, perceptually similar photos. |
| [archive-bridge](../archive/commands.md#archive-bridge) | Derive media and location domain events from VFS mutations (long-running) |
| [archive-parse](../archive/commands.md#archive-parse) | Turn a written search into search filters (kinds, years, people and locations as subjects, an area, what the pictures show) |
| [assign-faces](../archive/commands.md#assign-faces) | Match an image's detected faces to existing people, creating unnamed people for the rest. |
| [assign-speakers](../archive/commands.md#assign-speakers) | Match a recording's voices to existing people, creating unnamed people for the rest. |
| [auto-album-assign](../archive/commands.md#auto-album-assign) | Weigh media against the library albums they may belong in, as staging weighs its suggested groups, and write nothing. |
| [auto-album-cluster](../archive/commands.md#auto-album-cluster) | Show how the staging organizer would group the media at and under some paths (directories, albums or files) into suggested albums, writing nothing. |
| [cluster-faces](../archive/commands.md#cluster-faces) | Recognize untagged faces as existing people (label propagation) + optionally create unnamed people for leftover clusters. |
| [cluster-voices](../archive/commands.md#cluster-voices) | Recognize untagged speech turns as existing people (label propagation) + optionally create unnamed people for leftover clusters. |
| [compute-fingerprint](../archive/commands.md#compute-fingerprint) | Compute the fingerprints that find copies of a media file: SSCD for pictures and video keyframes, chromaprint for sound. |
| [dayinhistory](../archive/commands.md#dayinhistory) | List media taken on a given day (MM-DD, default today) in past years. |
| [detect-chapters](../archive/commands.md#detect-chapters) | Find a video's cuts and write them as its chapters (metadata/chapters) |
| [detect-faces](../archive/commands.md#detect-faces) | Detect faces in an image or a video and keep the usable ones as face regions. |
| [device](../archive/commands.md#device) | Camera and recording device management. |
| [device-cover](../archive/commands.md#device-cover) | Give a device without a cover of its own its newest picture, or its newest video with thumbnails (coverPhoto softlink) |
| [device-create](../archive/commands.md#device-create) | Create a device node. |
| [device-info](../archive/commands.md#device-info) | Show device details and owners. |
| [device-link](../archive/commands.md#device-link) | Link a file to its capture device using extracted exif, or to a device named by hand. |
| [device-list](../archive/commands.md#device-list) | List all devices. |
| [device-match](../archive/commands.md#device-match) | Match a device by serial number or make/model. |
| [device-relink](../archive/commands.md#device-relink) | Link existing media to a registered device by its fingerprint. |
| [device-remove-owner](../archive/commands.md#device-remove-owner) | Unlink a person from a device (removes both halves) |
| [device-scan](../archive/commands.md#device-scan) | Propose devices seen in media but not registered. |
| [device-set-owner](../archive/commands.md#device-set-owner) | Link a person as owner of a device (dated relation pair) |
| [device-timeline](../archive/commands.md#device-timeline) | One device's history as a chronological feed: owners getting and giving it up, its events and the albums with photos it took. |
| [device-update](../archive/commands.md#device-update) | Change a device's settings. |
| [duplicates](../archive/commands.md#duplicates) | Find duplicate files by checksum (exact) or by fingerprint, copies with other bytes (--fuzzy); record the staged exact copies of files (--record), or look checksums up before an upload (--checksum) |
| [embed-picture](../archive/commands.md#embed-picture) | Embed a photo or a video's keyframes for search by what is in the picture. |
| [events-anniversaries](../archive/commands.md#events-anniversaries) | Birthdays, memorials and wedding anniversaries around a date, as events entries (core events gathers them) |
| [exif-extract](../archive/commands.md#exif-extract) | Extract EXIF metadata from file and create exif/position nodes; the file's paired sidecar (<file>/sidecar) dates and places it too, a staged file is dated by its category's time rules, and its exact copies among its inbox's files are recorded with it. A staged exact copy of a file its owner can read is recorded and not indexed (duplicate.deferred) unless forced. |
| [exiftool](../archive/commands.md#exiftool) | Extract metadata from a file, as exiftool reads it (through the media service) |
| [face-add](../archive/commands.md#face-add) | Add a human-drawn face box to an image or a video frame as a new unidentified person. |
| [face-confirm](../archive/commands.md#face-confirm) | Confirm that regions show the person they are assigned to. |
| [face-doubt](../archive/commands.md#face-doubt) | Question whether regions show the person they are assigned to. |
| [face-remove](../archive/commands.md#face-remove) | Remove a face and its person when it was the person's only unidentified face. |
| [face-reset](../archive/commands.md#face-reset) | Undo automatic face→person assignments by provenance, leaving manual ones intact. |
| [face-set-box](../archive/commands.md#face-set-box) | Change a region's box and regenerate its preview crop; a moved face stops voting in recognition. |
| [file-set-description](../archive/commands.md#file-set-description) | Set a file's hand-written description. |
| [file-set-orientation](../archive/commands.md#file-set-orientation) | Rotate or mirror a file for good: writes angle/angleManual/mirror, remaps face boxes and regenerates renditions (a video re-encodes on the media pool) |
| [file-set-photographer](../archive/commands.md#file-set-photographer) | Link the person who took a file (photographer softlink) |
| [file-set-position](../archive/commands.md#file-set-position) | Set a manual location override (positionManual + child position node) on a file, or clear its location. |
| [file-set-text](../archive/commands.md#file-set-text) | Write the text in a picture by hand, in place of what was read from it. |
| [file-set-text-language](../archive/commands.md#file-set-text-language) | Set the language the text in a picture is written in (or auto), and read the picture again in it. |
| [file-set-time](../archive/commands.md#file-set-time) | Set, annotate or clear a hand-typed capture time (whenManual) on one or more files. |
| [file-set-transcript](../archive/commands.md#file-set-transcript) | Write what is said in a video or a recording by hand, in place of the transcript. |
| [find-within](../archive/commands.md#find-within) | Find positions inside a geographic bounding box: media points and locations. |
| [generate-derivatives](../archive/commands.md#generate-derivatives) | Generate web derivatives (still pictures, transcoded renditions) for a media file. |
| [geocode-files](../archive/commands.md#geocode-files) | Batch reverse geocode the position nodes of the files under a directory. |
| [geocode-location](../archive/commands.md#geocode-location) | Resolve a location's written address to coordinates (Nominatim forward geocoding) |
| [geocode-position](../archive/commands.md#geocode-position) | Reverse geocode a file's position node using Nominatim (OSM) |
| [hello](../archive/commands.md#hello) | Say hello (example TypeScript module command) |
| [index-document](../archive/commands.md#index-document) | Extract text content and generate embedding for a document file. |
| [label-model](../archive/commands.md#label-model) | Learn labels from their pictures, so search --like /archive/tags/<label> can suggest where else they belong. |
| [latest](../archive/commands.md#latest) | List the most recently captured media, newest first. |
| [location-link-media](../archive/commands.md#location-link-media) | Link geotagged media files to the location whose shape contains them (<file>/location softlink) |
| [location-list](../archive/commands.md#location-list) | List locations with their saved coordinates. |
| [location-locate](../archive/commands.md#location-locate) | Give a location coordinates from its linked media, falling back to geocoding its address. |
| [location-region](../archive/commands.md#location-region) | Turn a location name (a city, a country, an area) into the region search --bbox filters on. |
| [location-timeline](../archive/commands.md#location-timeline) | What happened at one location as a chronological feed: residents moving in and out, its events and the albums with photos from it. |
| [location-update](../archive/commands.md#location-update) | Change a location's name, address, description, city or country. |
| [media-details](../archive/commands.md#media-details) | Read description, time, location, location, device with owners, albums, tagged people (with age) and comments for a media file. |
| [media-reembed](../archive/commands.md#media-reembed) | Embed the extracted texts, transcripts and hand-written descriptions already stored into the current text space, from the stored text alone. |
| [media-resolve-time](../archive/commands.md#media-resolve-time) | Re-resolve media originals' capture times from their stored exif and manual sources. |
| [media-scan](../archive/commands.md#media-scan) | Emit media events for files the bridge never saw (backfill / gap recovery) |
| [media-sidecars](../archive/commands.md#media-sidecars) | Pair the Google Photos Takeout JSON and XMP sidecars in a folder with their files, as <file>/sidecar, and carry over their dates, places, captions and favourites. |
| [members-album](../archive/commands.md#members-album) | List an album's media by the album's own rules: an imported album's files/ folder, links followed, the cover left out, stacks of similar photos folded. |
| [merge-duplicates](../archive/commands.md#merge-duplicates) | Keep one file of a set of duplicates, fill it in from the others, and move them to the trash as one batch. |
| [news-albums](../archive/commands.md#news-albums) | Recently created albums, newest first, with who made them, as news entries (core news gathers them) |
| [onthisday-media](../archive/commands.md#onthisday-media) | The years with pictures taken on a day (MM-DD, default today), as onthisday entries (core onthisday gathers them) |
| [parse-eval](../archive/commands.md#parse-eval) | Score the search parse (archive-parse) against the filters each question means. |
| [person](../archive/commands.md#person) | People and family tree management. |
| [person-add-event](../archive/commands.md#person-add-event) | Add an event (blob) to a person, album, location or device. |
| [person-check](../archive/commands.md#person-check) | Check family-tree integrity (dangling links, reciprocity, cycles, dates, birth/death events not on born/died) |
| [person-children](../archive/commands.md#person-children) | List a person's children (children/ dir) |
| [person-cover](../archive/commands.md#person-cover) | Give a named person without a cover the crop of one of their own faces (coverPhoto softlink) |
| [person-create](../archive/commands.md#person-create) | Create a person node. |
| [person-detach](../archive/commands.md#person-detach) | Take faces off a person: to a new unnamed person, to an existing one, or off identity entirely. |
| [person-discard](../archive/commands.md#person-discard) | Say unidentified people are not a person at all: unassign and lock everything they hold, and remove them. |
| [person-faces](../archive/commands.md#person-faces) | Every face and tag assigned to a person, with the photo each came from. |
| [person-family-tree](../archive/commands.md#person-family-tree) | Display ancestors and descendants of a person. |
| [person-fixup](../archive/commands.md#person-fixup) | Repair family-tree links (recreate missing reciprocals, rewrite stale reciprocal paths, drop dangling) |
| [person-graph](../archive/commands.md#person-graph) | Family graph around a person as nodes and edges, for drawing a tree. |
| [person-how-related](../archive/commands.md#person-how-related) | Compute the kinship term between two persons (English/Swedish) |
| [person-info](../archive/commands.md#person-info) | Show person details, relationships, and events. |
| [person-list](../archive/commands.md#person-list) | List the named people, with how many files of the library each is seen or heard in. |
| [person-merge](../archive/commands.md#person-merge) | Merge people into another (faces, events, relations and links to them move; the sources are removed) |
| [person-name](../archive/commands.md#person-name) | Name an unidentified person and move them into /people. |
| [person-relatives](../archive/commands.md#person-relatives) | Who a kin phrase reaches from a person through the family tree: 'moster', 'mammas syster', 'barn', 'my father's brother'. |
| [person-remove](../archive/commands.md#person-remove) | Remove a relationship between two persons (both sides) |
| [person-remove-home](../archive/commands.md#person-remove-home) | Remove a person↔location residence relation (both halves) |
| [person-set-home](../archive/commands.md#person-set-home) | Record where a person lived, and when (dated relation pair) |
| [person-set-parent](../archive/commands.md#person-set-parent) | Add a parent relationship (parents/ ↔ children/) |
| [person-set-partner](../archive/commands.md#person-set-partner) | Add or update a partner relationship (partners/, both directions) |
| [person-stats](../archive/commands.md#person-stats) | Count births, engagements, marriages and deaths by calendar month across all years. |
| [person-timeline](../archive/commands.md#person-timeline) | One person's life as a chronological feed: events, homes, partnerships, children and albums. |
| [person-unknown](../archive/commands.md#person-unknown) | List auto-created people nobody has named yet, with face counts and crops. |
| [person-update](../archive/commands.md#person-update) | Change a person's profile: names, birth and death dates, gender, allergies, description, contact details. An empty value clears the field. |
| [person-voices](../archive/commands.md#person-voices) | Every recording a person is heard in, with how long they speak and a moment to hear them. |
| [promote-exif-attrs](../archive/commands.md#promote-exif-attrs) | Copy width/height/duration from a file's exif node onto the file node. |
| [raw](../archive/commands.md#raw) | Detect RAW image files and report (or --sort) the non-RAW file(s) they are related to. |
| [read-text](../archive/commands.md#read-text) | Read the text written in a picture and keep it for search. |
| [regenerate](../archive/commands.md#regenerate) | Regenerate web derivatives for media files under a path. |
| [regenerate-face-crops](../archive/commands.md#regenerate-face-crops) | Re-encode a bounded, resumable batch of existing face crops without re-detecting faces. |
| [search-album](../archive/commands.md#search-album) | Search albums by name, description and what their pictures show. |
| [search-device](../archive/commands.md#search-device) | Search devices by name, make, model or serial number. |
| [search-document](../archive/commands.md#search-document) | Search documents (PDF, Word, text) by what their text is about, using semantic similarity. |
| [search-location](../archive/commands.md#search-location) | Search locations by name. |
| [search-media](../archive/commands.md#search-media) | Search media files by what they show, the text in them, what is said in them, their written descriptions and their names, or by likeness to a picture or a label. |
| [search-people](../archive/commands.md#search-people) | Search people by partial name; every query word must match the same person. |
| [search-track](../archive/commands.md#search-track) | Search tracks by the name of the device that recorded them, or their description. |
| [see-speakers](../archive/commands.md#see-speakers) | Tie a video's voices to the faces seen speaking them, the video's own face regions first. |
| [staging](../archive/commands.md#staging) | Manage a user's private staging area: its categories and which one a newly arrived folder looks like it belongs in, their suggested groups and the organizer that makes them, the edits that change them, and the decisions that file them into the library or discard them, each journaled and undoable. |
| [subcluster-faces](../archive/commands.md#subcluster-faces) | Re-cluster one person's faces with average linkage, to find two people fused into one. |
| [subcluster-voices](../archive/commands.md#subcluster-voices) | Re-cluster one person's voices with average linkage, to find two people fused into one. |
| [subject-device](../archive/commands.md#subject-device) | What `search --subject device:<ref>` asks: the media a device produced, as the attr equality the store answers. |
| [subject-location](../archive/commands.md#subject-location) | What `search --subject location:<ref>` asks: the media linked to a location node. |
| [subject-person](../archive/commands.md#subject-person) | What `search --subject person:<ref>` asks: the media a person is in: tagged with a box (a face or a drawn region) or without one. |
| [subjects-in](../archive/commands.md#subjects-in) | Who and what the media in an album or folder have: the people in them, their locations, the devices that took them and the photographers, counted. |
| [timeline](../archive/commands.md#timeline) | Chronological feed of albums, life events, birthdays and tracks, newest first. |
| [timeline-facets](../archive/commands.md#timeline-facets) | Per-day, per-month and per-year counts for the timeline scrubber. |
| [track-append](../archive/commands.md#track-append) | Append coordinate points to a device's track. |
| [track-create](../archive/commands.md#track-create) | Give a device a track for the coordinate points it recorded (the device's child track) |
| [track-import](../archive/commands.md#track-import) | Import GPX track points into a device's track. |
| [track-list](../archive/commands.md#track-list) | List the devices that have a track, with its point count, span and extent. |
| [track-read](../archive/commands.md#track-read) | Read a device's track as drawable segments ({segments, points, truncated}) |
| [track-stage](../archive/commands.md#track-stage) | Import a staged GPX file into the track of the device it names, and remove the file; mark it pending when no single device matches, and keep it in its staging area's routes/. |
| [transcribe-file](../archive/commands.md#transcribe-file) | Transcribe audio or video into a timed WebVTT node with chunk embeddings. |
| [voiceprint-file](../archive/commands.md#voiceprint-file) | Find the voices of an audio or video recording: who speaks when, with one voiceprint per voice. |

## Assistant

[All 6 in full](../assistant/commands.md).

| Command | What it does |
| --- | --- |
| [agent-eval](../assistant/commands.md#agent-eval) | Ask the chat's loop the modules' questions against the real archive, and score what happens. |
| [assistant-ask](../assistant/commands.md#assistant-ask) | Answer a question about EiN by running its commands (the chat drawer's backend) |
| [assistant-chat](../assistant/commands.md#assistant-chat) | List, create, read, or delete durable assistant chats; read a turn in flight; record how a proposal ended; the questions the modules suggest. |
| [assistant-commands](../assistant/commands.md#assistant-commands) | Find a command by what it is for, judge whether a line changes anything, or rebuild the assistant's command index. |
| [llm-chat](../assistant/commands.md#llm-chat) | Ask the assistant's language model one thing, and print what it answers. |
| [llm-status](../assistant/commands.md#llm-status) | Whose the assistant's language model is, where it runs, and (with --checks) whether it answers. |

## Media service

[All 4 in full](../ems/commands.md).

| Command | What it does |
| --- | --- |
| [ems-gpu](../ems/commands.md#ems-gpu) | The media service's GPU now, with the last six hours of utilization and VRAM. |
| [ems-gpu-sample](../ems/commands.md#ems-gpu-sample) | One reading of the media service's GPU: utilization, VRAM and temperature. |
| [ems-status](../ems/commands.md#ems-status) | Show media service health: version, every model and its state, what is executing, degradation, worker memory and queues. |
| [ems-text-embed](../ems/commands.md#ems-text-embed) | Texts as vectors, by EMS's current text model, to compare by meaning. |
