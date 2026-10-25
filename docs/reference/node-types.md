<!-- Written by tools/reference.ts from `docs node-types` on a running EiN: make reference, never by hand. -->

# Node types

Every node has a type, which decides what it holds and how it behaves. These are the 24 types of an EiN with all its modules. [Nodes and node types](../concepts/nodes.md) explains what a node is.

## Content

What the archive is made of: what people add, and what EiN works out about it.

| Type | What it is | Lives under | Module |
| --- | --- | --- | --- |
| `album` Album | A collection of photos and videos that behaves as a directory. It holds its files, and links the ones added to it from elsewhere. It remembers its cover, the time span of its media, and the stacks of similar photos taken in a row. | `/archive/albums` | Archive |
| `album-profile` Album profile | A summary of a library album's members — their times, days, places, people and a few pictures that stand for how it looks — kept beside it as its .profile child, which staging matches suggested groups against. |  | Archive |
| `device` Device | A camera, phone or tracker, matched by make, model and serial number. Knows its time zone, so photos without one get their capture time right. | `/archive/devices` | Archive |
| `exif` EXIF | The metadata read from a media file — camera, capture time, exposure, position — kept as a child of the file. |  | Archive |
| `file` File | Stored bytes with a name, a mimetype, a size and a checksum: a photo, a video, a document, an event text. Media files carry what was read from them (capture time, orientation, faces) and hold their derived pieces — thumbnails, captions, EXIF — as children. |  | Core |
| `location` Location | A location under /archive/locations: its name, the address it was written down with and how that was geocoded, the people who lived there and the photos linked to it. Where it is on the map is its child named position, a point, circle or outline. | `/archive/locations` | Archive |
| `media-region` Region | A box on a photo, kept under the photo's regions/ directory: a face the detector found, a box someone drew, or a tag imported from the old archive. It carries who is in it. A region that shows a usable face has the face's vector as a child named embedding, and only those take part in face recognition. |  | Archive |
| `person` Person | Someone in the archive, with names, dates of birth and death, and contact details. Parents, children and partners are links between people; the photos they appear in are found by their faces. | `/archive/people` | Archive |
| `position` Position | A point on the map with an optional radius or outline. A photo, a location or an event keeps where it is as a child named position. |  | Core |
| `track` Track | The route a device recorded, kept as the device's child named track: timestamped GPS points, live or from imported GPX files, summarised by their extent and time span. |  | Core |

## Structure

How the tree is arranged: folders, links, and what holds other nodes.

| Type | What it is | Lives under | Module |
| --- | --- | --- | --- |
| `directory` Directory | A folder that holds other nodes. The archive roots — albums, people, locations, devices and labels — are directories. |  | Core |
| `group` Group | A set of users, under /etc/groups. A node's group, and any group in its ACL, decides who besides the owner may read or change it. |  | Core |
| `softlink` Softlink | A pointer to another node by path, followed transparently. Album covers, pictures added to an album, labels and the relations between people and locations are all softlinks. |  | Core |
| `user` User | An account that can sign in, under /home. Owns nodes, belongs to groups, and keeps its settings and shell history in its home directory. |  | Core |

## System

How EiN runs: its commands, logs, queues and the other parts of the system that are nodes too.

| Type | What it is | Lives under | Module |
| --- | --- | --- | --- |
| `command` Command | A built-in shell command, carrying its own description, arguments and flags. Commands a module adds are files in the module's bin directory instead. |  | Core |
| `embedding` Embedding | A numeric fingerprint of an image, a face or a text, kept for similarity search: what finds photos by what they show and faces of the same person. |  | Core |
| `log` Log | An append-only record of lines kept for a retention period, such as the system log under /var/logs. |  | Core |
| `null` Null | /dev/null: reading it gives nothing and what is written to it is thrown away, for output nobody wants. |  | Core |
| `pool` Pool | Background jobs waiting for a worker with the right resources, under /var/pools. `pool stat` shows what is waiting. |  | Core |
| `queue` Queue | A durable first-in, first-out buffer; reading an entry removes it. The pipeline engine takes its work from one. |  | Core |
| `router` Router | A live broadcast channel: what is written reaches every current reader and nothing is kept. /dev/events is one. |  | Core |
| `session` Session | A signed-in connection — a browser, an SSH login, a service — under /var/sessions. Removed when it ends. |  | Core |
| `share-link` Share link | A link that opens an album, and what it holds, to whoever has it, without signing in; under /var/links, with when it expires and how often it was opened. `share-link` makes, lists and turns them off. |  | Core |
| `tty` Terminal | An interactive terminal belonging to a session, with its size and working directory. |  | Core |
