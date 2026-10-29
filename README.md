# einhq.github.io

EiN's presentation page, in five chapters that are the top bar's links. It opens on the hero, whose
field wears the interface's mixed pattern as its home page does, and how to install comes right
under it. Core is EiN itself, naming no module: nodes and the core's node types, the tree, the
shell, the web interface, pipelines and modules. Assistant is the chat and what it does on any
installation, ending where it has a real purpose, the Archive. Archive is the first module, with the
screenshots from the demo archive, its media types and pipelines, asking the assistant about the
family, and the media service. Screenshots is a gallery of almost every page, and the system
requirements and the source close the page, Getting started's like the install. Each chapter opens
on a band of hats in the colour of the interface's pages it is about.
It is the GitHub Pages site of the [einhq](https://github.com/einhq) organisation, served at
<https://einhq.eu> (`CNAME`).

It is static: what is in the repository is what is served. The documentation under `docs/`, at
<https://einhq.eu/docs/>, is written in Markdown and its HTML is made from it with `make docs` and
committed beside it ([The documentation](#the-documentation)).

```
index.html          the page
assets/site.css     its styles
assets/site.js      the hero's field, the tour's tabs, the screenshots' viewer, the copy button
assets/page.js      what every page has: the top bar, its links and a phone's menu of them, and the bands of hats
assets/hat-tiling.js  the einstein hat and a patch of its tiling, as EiN's web interface lays them
assets/docs.css     the documentation's pages, over site.css
assets/docs.js      the documentation's search, its pages' drawer on a phone, the code blocks' copy buttons
docs/               the documentation: Markdown, and the HTML and search.json made from it
docs/diagrams/      the documentation's diagrams, SVG
docs/SUMMARY.md     the documentation's pages, in the order of its sidebar
assets/shots/       screenshots of the demo instance, 1x and 2x WebP, and thumbs/ for the gallery
assets/nodes/       the faces and the album and device covers the hero's tiles show, and their names (manifest.json)
assets/fonts/       Familjen Grotesk, Fragment Mono and Mochiy Pop One, the wordmark's and the headings', served from here
assets/og.jpg       the link preview: the page's own hero at 1200 × 630, screenshotted from `make serve`
assets/icon-180.png the home-screen icon, the mark rendered from assets/favicon.svg
install.sh          what the page's install command fetches: it checks the machine, then fetches ein/deploy into ~/ein and runs its setup.sh
ATTRIBUTION.md      who took each real photo in the demo, and under which licence: the demo archive's own, copied
tools/capture.ts    takes the screenshots and the node pictures from a running demo instance
tools/docs.ts       makes the documentation's HTML pages and search index from its Markdown, and checks its links
tools/reference.ts  writes the reference pages (commands, settings, environment, node types) from a running EiN
```

`make help` lists the targets.

## Previewing

`make serve` serves the site on <http://localhost:4507>.

## The documentation

Each page is a Markdown file under `docs/`, listed in `docs/SUMMARY.md`, whose `##` headings are the
sidebar's sections. `make docs` writes an HTML file beside each, in the page's frame, and
`docs/search.json`, which the search box reads; commit both with the Markdown. It fails on a link to
a page, file or heading that is not there, and on a page `SUMMARY.md` leaves out. `make check` fails
when the HTML is not what the Markdown makes.

The Markdown reads the same on a forge: link a page by its `.md` file (`[Modules](../admin/modules.md#updating)`),
put a diagram in `docs/diagrams/` as an SVG (`![What a node is made of](../diagrams/node.svg "Caption")`),
which the HTML draws inline so it takes the page's fonts, and write a callout as GitHub does (`> [!NOTE]`, `TIP`,
`IMPORTANT`, `WARNING`, `CAUTION`). Screenshots are the site's own, `../assets/shots/<id>.webp`, with
their 2x file used where there is one. Examples use invented people and places, never real ones.

A diagram is drawn for the dark page: the ground `#1a1e27` with a `#12151c` frame, text in
`Familjen Grotesk` (`#eceff4`, `#a2abbb` for the quieter), lines in `rgb(255 255 255 / .16)`, and
colour only for node types and pages, as `site.css` names them (person `#da77f2`, album `#339af0`,
place `#38d9a9`, track `#22b8cf`, device `#ffa94d`, label `#f06595`, media `#748ffc`, system
`#a9e34b`, documentation `#b197fc`).

EiN shows the same Markdown on its own **Documentation** page, offline: its image bundles `docs/**/*.md`,
`docs/diagrams/`, the screenshots the pages name and the diagrams' fonts from this repository's `main`,
and renders them itself, its sidebar from `SUMMARY.md`. So the Markdown stays what both read:
GitHub's flavour, relative links, the callouts above, and no HTML but `<kbd>`. A section in a part after
the first (Core) is a module's, in a folder named after it. EiN draws the generated pages from the
installation instead (the reference pages, and a module's `commands.md`), and a link to one opens
its live page there. A change here reaches an installation with its next image.

The pages under `docs/reference/` that list commands, settings, environment variables and node types
are written by `make reference` from a running EiN that has every module, over its SSH:

```bash
make reference SSH='ssh -p 2222 admin@ein.local'
```

It keeps what describes EiN (a setting's default, never its value there). Run it when a command, a
setting, a variable or a node type changes, and commit what it writes; never edit those pages by hand.

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
