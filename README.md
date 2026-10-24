# einhq.github.io

EiN's presentation page, in five chapters that are the top bar's links. Core is EiN itself, naming
no module: nodes and the core's node types, the tree, the shell, the web interface, pipelines and
modules. Assistant is the chat and what it does on any installation, ending where it has a real
purpose, the Archive. Archive is the first module, with the screenshots from the demo archive, its
media types and pipelines, asking the assistant about the family, and the media service.
Screenshots is a gallery of almost every page, and Getting started holds the system requirements,
how to install and the source. Core opens on the hero, whose field wears the interface's mixed
pattern as its home page does; each other chapter opens on a band of hats in the colour of the
interface's pages it is about.
It is the GitHub Pages site of the [einhq](https://github.com/einhq) organisation, served at
<https://einhq.eu> (`CNAME`).

It is a static page with no build step: what is in the repository is what is served.

```
index.html          the page
assets/site.css     its styles
assets/site.js      the hero's field, the bands of hats in the chapters and the top bar, the top bar's links and a phone's menu of them, the tour's tabs, the screenshots' viewer, the copy button
assets/hat-tiling.js  the einstein hat and a patch of its tiling, as EiN's web interface lays them
assets/shots/       screenshots of the demo instance, 1x and 2x WebP, and thumbs/ for the gallery
assets/nodes/       the faces and the album and device covers the hero's tiles show, and their names (manifest.json)
assets/fonts/       Familjen Grotesk, Fragment Mono and Mochiy Pop One, the wordmark's and the headings', served from here
assets/og.jpg       the link preview: the page's own hero at 1200 × 630, screenshotted from `make serve`
assets/icon-180.png the home-screen icon, the mark rendered from assets/favicon.svg
install.sh          what the page's install command fetches: it checks the machine, then fetches ein/deploy into ~/ein and runs its setup.sh
ATTRIBUTION.md      who took each real photo in the demo, and under which licence: the demo archive's own, copied
tools/capture.ts    takes the screenshots and the node pictures from a running demo instance
```

`make help` lists the targets.

## Previewing

`make serve` serves the site on <http://localhost:4507>.

## Taking the screenshots again

The screenshots come from an EiN instance holding the demo archive: an invented family, so nothing
on the page is a real person's. With Playwright's chromium installed (`npx playwright install chromium`):

```bash
EIN_ADMIN_PASSWORD=… make capture URL=http://demo.example:8080   # every shot and the node pictures, into build/
make capture URL=… ONLY=lightbox,family                           # some of them
make images                                                       # build/ into assets/, as WebP, and the thumbnails
```

The instance must be fully processed for every shot to show what the page says. `search` and
`postcard` need its media service answering, `chat` needs the assistant's language model, and
`dashboard` says Healthy only once nothing waits. Look at each shot before committing it.
`make capture NODES=1` takes the node pictures alone (`ONLY` takes none): the faces and covers
`HERO` in `tools/capture.ts` names. When the demo's content changes, copy its `ATTRIBUTION.md` here
again.

## Publishing on GitHub

Create `einhq/einhq.github.io` on GitHub, push `main` to it, and in the
repository's Settings → Pages choose "Deploy from a branch", `main`, `/ (root)`. `.nojekyll` makes
GitHub serve the files as they are. A push mirror from Forgejo keeps it in step afterwards.

The custom domain, einhq.eu, is set in the same settings, which commit it as `CNAME`. Keep that file:
the mirror's push makes GitHub's `main` this repository's, and a `main` without it unsets the domain.

## Formatting

`make fmt` formats everything deno fmt knows, as the shared pre-commit hook checks; `make check`
also type-checks the capture tool.

## Licences

- The page, its scripts and styles: MIT (`LICENSE`).
- The hat tiling comes from ein/core (MIT), which builds it as isohedral/hatviz (BSD-3-Clause) does.
- Familjen Grotesk, Fragment Mono and Mochiy Pop One (the wordmark, as EiN's web interface draws it, and the headings): SIL Open
  Font License 1.1 (`assets/fonts/OFL-*.txt`).
- The screenshots and node pictures show the demo archive. Its story and generated media are CC0;
  the real photos in it keep their own licences, credited one by one in `ATTRIBUTION.md`. Map data
  © OpenStreetMap contributors.
