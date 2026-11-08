# More than one media service

This page is for the administrator who wants a second machine, such as a laptop or a desktop with a
card of its own, to take part of the media service's work beside the first. It applies once the
[media service](index.md) runs.

EiN uses one media service, the **primary**, for everything unless told otherwise. Each other media
service, an **instance**, runs on a machine of its own, serves the operations it is set up to serve,
and gets from EiN only the kinds of work whose operations it serves. Work it cannot do goes back at
once to the primary, so adding an instance never holds anything up.

## What an instance takes

Each kind of work in the media pool names the media service's operations its steps call. An instance
takes a kind when it serves every one of them, and when it makes their results the way the primary
makes them: the same face models, picture and text embedders, text reader and transcription
settings. A result made otherwise would look stale to EiN, or would be a vector in another space
than the ones stored, so such a kind stays with the primary.

| Kind            | Worker         | Operations                                                               |
| --------------- | -------------- | ------------------------------------------------------------------------ |
| `ingest`        | `media-worker` | `media.probe`                                                            |
| `stills`        | `media-worker` | `image.renditions`, `video.poster`, `audio.waveform`, `video.storyboard` |
| `transcode`     | `media-worker` | `video.transcode`, `audio.transcode`                                     |
| `fingerprint`   | `media-worker` | `fingerprint.compute`                                                    |
| `shots`         | `models`       | `video.shots`                                                            |
| `embed-picture` | `models`       | `vision.embed`                                                           |
| `ocr`           | `models`       | `ocr.read`, `text.embed`                                                 |
| `embed-text`    | `models`       | `text.embed`                                                             |
| `transcribe`    | `models`       | `speech.transcribe`, `text.embed`                                        |
| `faces`         | `models`       | `faces.detect`, `faces.detect_video`, `image.renditions`, `video.poster` |
| `diarize`       | `models`       | `speech.voiceprint`, `speech.active_speakers`                            |

The other kinds of the media pool run in EiN alone and stay with the primary. A search a person is
waiting on goes to the primary too; when it does not answer, the search goes to an instance that
serves the operation and makes it the way the primary did.

A transcode an instance refuses for its own memory budget is not counted as refused: the primary
gets it.

## What a machine without a card can run

Nothing is turned off on a machine without a card: every model runs on the processor instead, only
more slowly. Which operations are worth giving it is your choice, made with `EMS_OPS`:

| Operations                                                                                                                              | On the processor alone                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `media.probe`, `image.renditions`, `image.decode`, `video.poster`, `video.frames`, `audio.*`, `fingerprint.compute`, `document.extract` | The tools: they run on the processor on any machine. A good share for a second machine.                                                       |
| `video.transcode`, `video.storyboard`                                                                                                   | Run, more slowly than on a card's video units; a long video beyond the machine's memory budget is refused and goes to the primary.            |
| `vision.embed`, `text.embed`, `ocr.read`, `faces.detect`                                                                                | Run, several times slower than on a card. Worth it on a machine that is otherwise idle.                                                       |
| `speech.transcribe`, `speech.voiceprint`, `speech.diarize`, `speech.active_speakers`, `faces.detect_video`, `video.shots`               | Run, many times slower. A transcript made on the processor is made in other settings than the primary's on a card, so EiN never gives it one. |

## Add an instance

1. On the other machine, run the media service with its own name, its key and the operations it
   serves. With podman:

   ```bash
   # on the other machine
   podman run -d --name ems --restart always -p 8181:8181 \
     --cap-add SYS_ADMIN --device /dev/fuse \
     -e EMS_NAME=laptop \
     -e EMS_KEY=a-long-random-key \
     -e EMS_OPS='media.probe,image.*,video.poster,audio.*,fingerprint.compute,vision.embed' \
     --memory 16g ghcr.io/einhq/ems:main
   ```

   Add `--device nvidia.com/gpu=all` on a machine with an NVIDIA card set up as
   [The graphics card](gpu.md) says. `EMS_OPS` is a list of operations separated by commas, where
   `*` stands for any part of a name; without it the instance serves everything. An operation it
   does not serve is answered `op_not_served`.

2. Make EiN's file port reachable from the other machine. The media service reaches the files of
   each request through EiN's `ems-files` port, 2224
   ([How the media service reaches your files](index.md#how-the-media-service-reaches-your-files)):
   with the standard install, set `CFG_EMS_FILES_ADDRESS` to this machine's address and the port in
   `~/ein/.env`, such as `CFG_EMS_FILES_ADDRESS=192.168.1.10:2224`, and run `./setup.sh`, which then
   publishes the port. On a network you do not trust, turn on `CFG_EMS_FILES_TLS` too.

3. In EiN's terminal, as an administrator, add the instance with its address, its key and the address
   it reaches EiN's files at:

   ```bash
   # in EiN's terminal
   ems-instance add laptop --url http://192.168.1.20:8181 --key a-long-random-key --files-address 192.168.1.10:2224
   ```

   The key is kept where only administrators read it. Without `--files-address` the instance
   reaches the files where the primary does, which another machine usually cannot.

4. Within a minute the `models` and `media-worker` services start over with a worker for the new
   instance. `ems-instance list` shows it:

   ```text
   main         up    http://ems:8181  NVIDIA GeForce RTX 5060 Ti  fb6a7d9
   laptop       up    http://192.168.1.20:8181  CPU only  media.probe image.renditions …  1a14c9e
   ```

On the other machine, raise the read-ahead of its mounts as
[Faster reading through the mount](index.md#faster-reading-through-the-mount) says, or big videos
come through slowly.

The instance's slots, how much EiN keeps in flight against it, are its own limits until you set
them: `ems-instance set laptop --model-slots 2 --cpu-slots 4`. `ems-instance show laptop` prints
the instance with the slots in force.

## Watch it

- The **Media service** tab of the **Dashboard** lists the instances beside what the chosen one holds:
  each **up** or **down**, its card or **CPU only**, and the operations another serves. On a phone the
  list is a menu above it.
- The **Overview** tab has **GPU** and **VRAM** tiles for each instance with a card, under its name.
- The **Work** tab's **Where the work is** has columns for each instance, **At laptop** and **On a
  model at laptop**.
- The health checks of an instance carry its name: `ems laptop`, `ems laptop worker`,
  `ems laptop gpu` and `ems laptop card`. An instance that does not answer is a warning: its work
  goes to the others.
- In the terminal, [`ems-status`](commands.md#ems-status), `ems-gpu` and `ems-models` take
  `--instance laptop`; without it they are about the primary.

When an instance stops answering, its workers stop and hand back what they held; they start again
when it answers. When its operations or its models change, its workers start over with the kinds
it now serves, and a new build of it runs the failed work again, as a new build of the primary does.

## Change or remove it

```bash
# in EiN's terminal
ems-instance set laptop --url http://192.168.1.21:8181
ems-instance remove laptop
```

The primary is not changed with `ems-instance`: it is the media service the settings name,
`CFG_EMS_URL` and `CFG_EMS_KEY`.

## Related pages

- [The media service](index.md)
- [The graphics card](gpu.md)
- [Media service commands](commands.md)
- [The Media module's workers](../media/index.md#the-workers)
