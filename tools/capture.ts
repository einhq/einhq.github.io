#!/usr/bin/env -S deno run -A --node-modules-dir=auto
/**
 * Takes the site's screenshots, and the node pictures the hero is laid with, from a running EiN
 * instance that holds the demo archive (the invented Wrenfield family).
 *
 *   deno task capture --url http://demo.example:8080                 every shot, then the node pictures
 *   deno task capture --url … --only lightbox,family                  just those shots (no node pictures)
 *   deno task capture --url … --nodes                                 just the node pictures
 *
 * Signs in as `--user` (admin) with `--password`, or EIN_ADMIN_PASSWORD, or the demo's default
 * "admin". Writes PNGs at twice (phones three times) the CSS size to build/shots/ and the node
 * pictures to build/nodes/; `make images` turns both into the WebP files under assets/. The browser
 * is Playwright's chromium from ~/.cache/ms-playwright. Exits non-zero when any shot fails.
 *
 * Some shots need what only a fully processed instance has: `search` and `postcard` need the media
 * service answering, `chat` the assistant's language model, and `dashboard` says Healthy only once
 * nothing waits.
 */
import { parseArgs } from '@std/cli/parse-args';
import { type Browser, chromium, type Page } from 'playwright';

const flags = parseArgs(Deno.args, {
  string: ['url', 'user', 'password', 'only', 'out'],
  boolean: ['nodes'],
  default: { url: 'http://localhost:8080', user: 'admin', out: 'build' },
});
const BASE = flags.url.replace(/\/$/, '');
const PASSWORD = flags.password ?? Deno.env.get('EIN_ADMIN_PASSWORD') ?? 'admin';

type Shot = {
  id: string;
  /** A phone (390 × 844 at 3×) rather than a desktop window (1440 × 900 at 2×). */
  phone?: boolean;
  /** The part of the window to keep, in CSS pixels, for a shot the page shows at half width. */
  clip?: { x: number; y: number; width: number; height: number };
  run: (page: Page) => Promise<void>;
};

const album = (name: string) => `/albums/${encodeURIComponent(`/archive/albums/${name}`)}`;

/** Settle: media grids stream renditions for as long as they are on screen, so there is no network idle to wait for. */
const settle = (page: Page, ms = 4000) => page.waitForTimeout(ms);

async function open(page: Page, route: string, ms?: number) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main, [role=dialog]', { timeout: 20000 });
  await settle(page, ms);
}

/**
 * Opens one file of an album in the viewer the way a person does, from its tile, and steps to the
 * file, so the viewer counts its place in the album ("3 of 26") rather than "1 of 1".
 */
async function viewer(page: Page, albumName: string, file: string) {
  await open(page, album(albumName));
  await page.locator('main img:not(.mrx-entity-header-background)').first().click();
  await settle(page, 2500);
  const wanted = encodeURIComponent(encodeURIComponent(`/archive/albums/${albumName}/${file}`));
  for (let i = 0; i < 80 && !page.url().includes(wanted); i++) {
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(700);
  }
  if (!page.url().includes(wanted)) throw new Error(`viewer: ${albumName}/${file} not reached`);
  await settle(page, 3500);
}

/** Drags one finger from (x, y) by (dx, dy), as CDP touch events: Playwright has no gesture API. */
async function swipe(page: Page, x: number, y: number, dx: number, dy: number) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 12; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 12, y: y + dy * i / 12 }] });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}

/** Types one line into the terminal pane and waits for it to run. */
async function terminalLine(page: Page, line: string, ms = 2500) {
  await page.keyboard.type(line, { delay: 12 });
  await page.keyboard.press('Enter');
  await page.waitForTimeout(ms);
}

/**
 * Asks the assistant in a new chat in the open drawer, and waits for its answer (a 4B model on a
 * shared card can take minutes). A new chat, so the drawer shows this question alone and the wait
 * cannot mistake an earlier answer's "Ran N commands" for this one's.
 */
async function ask(page: Page, question: string) {
  await page.getByRole('button', { name: 'New chat' }).last().click();
  await settle(page, 1000);
  const input = page.getByPlaceholder(/Ask about what is kept here/);
  await input.click();
  await input.fill(question);
  await page.keyboard.press('Enter');
  // Done when it has run its commands, is neither running nor thinking, and the text holds still
  // between two looks: the answer streams in after the last command.
  let before = '';
  for (let i = 0; i < 80; i++) {
    await page.waitForTimeout(5000);
    const text = await page.locator('body').innerText();
    if (/Ran \d+ commands?/.test(text) && !/Running commands|Thinking|Assistant unavailable/.test(text) && text === before) return;
    if (text.includes('Assistant unavailable')) throw new Error('chat: the assistant is unavailable');
    before = text;
  }
  throw new Error('chat: the answer did not settle within 400 s');
}

const SHOTS: Shot[] = [
  // One picture and everything known about it: the device, the album, who is in it at what age, and where.
  {
    id: 'lightbox',
    run: async (page) => {
      await viewer(page, 'wellington-christmas-2025', 'IMG_0660.HEIC');
      // Every face named on the picture, and the pointer out of the way.
      await page.mouse.move(2, 450);
      await page.keyboard.press('f');
      await settle(page, 1500);
    },
  },
  { id: 'albums', run: (page) => open(page, '/albums') },
  { id: 'album', run: (page) => open(page, album('sailing-2025'), 5000) },
  { id: 'faces', run: (page) => open(page, '/people/Helen_Okafor?tab=faces', 5000) },
  { id: 'family', run: (page) => open(page, '/people/Peggy_Wrenfield?tab=family', 5000) },
  { id: 'person', run: (page) => open(page, '/people/Peggy_Wrenfield', 5000) },
  { id: 'place', run: (page) => open(page, '/locations/The_cottage_at_Malpas', 5000) },
  { id: 'map', run: (page) => open(page, '/map?c=59.2898%2C18.7502&z=11', 6000) },
  { id: 'year', run: (page) => open(page, '/year?year=2025', 5000) },
  { id: 'devices', run: (page) => open(page, '/devices', 5000) },
  // Says "Healthy" only while nothing waits: take it on an instance that has caught up.
  { id: 'dashboard', clip: { x: 240, y: 48, width: 1200, height: 650 }, run: (page) => open(page, '/system', 6000) },
  {
    id: 'recording',
    clip: { x: 300, y: 0, width: 1140, height: 640 },
    run: async (page) => {
      await viewer(page, 'christmas-2019', 'Voice 001.m4a');
      // Each transcript line is a button that seeks to it; the line under the playhead is marked.
      await page.getByRole('dialog').getByRole('button', { name: /^0:41/ }).click();
      await settle(page, 1500);
    },
  },
  { id: 'scan', run: (page) => viewer(page, 'wedding-1956', 'img20120303_120600551.jpg') },
  {
    id: 'postcard',
    run: async (page) => {
      await viewer(page, 'cornwall-1968', 'img20120303_133900582.jpg');
      await page.keyboard.press('t');
      await settle(page, 2500);
    },
  },
  // Every Christmas tree in the archive, in photos and video moments, with nothing tagged: the query and two rows.
  {
    id: 'search',
    clip: { x: 240, y: 48, width: 1200, height: 644 },
    run: (page) => open(page, `/media?q=${encodeURIComponent('Christmas tree')}`, 14000),
  },
  {
    id: 'chat',
    clip: { x: 580, y: 0, width: 860, height: 900 },
    run: async (page) => {
      await viewer(page, 'wellington-christmas-2025', 'IMG_0660.HEIC');
      // The viewer has a chat button of its own, over the page's: the top bar's drawer entry.
      await page.getByRole('dialog').getByRole('button', { name: 'Chat', exact: true }).click();
      await settle(page, 1500);
      await ask(page, 'Who is in this picture, and how old was each of them that day?');
    },
  },
  {
    id: 'terminal',
    clip: { x: 0, y: 0, width: 840, height: 780 },
    run: async (page) => {
      await open(page, album('christmas-2019'));
      await page.keyboard.press('Alt+t');
      await settle(page, 2500);
      // Maximized, so every line stays on screen.
      await page.keyboard.press('Alt+m');
      await settle(page, 1000);
      await terminalLine(page, 'ls /archive');
      // -maxdepth 1: the people found but not yet named are person nodes too, one folder down.
      await terminalLine(page, 'find /archive/people -maxdepth 1 -type person | wc -l');
      await terminalLine(page, 'person-info /archive/people/Peggy_Wrenfield');
      await terminalLine(page, 'cd /archive/albums/christmas-2019 && cat 20191225_155434.jpg', 5000);
    },
  },
  // The gallery: one view of each page, the core's and the modules', as it opens.
  { id: 'home', run: (page) => open(page, '/', 5000) },
  {
    id: 'finder',
    run: async (page) => {
      await open(page, '/', 3000);
      await page.keyboard.press('Control+k');
      await settle(page, 800);
      await page.keyboard.type('>person', { delay: 30 });
      // A busy instance can take a while to look through every node.
      await page.getByText('Looking…').waitFor({ state: 'detached', timeout: 90000 });
      await settle(page, 1500);
    },
  },
  { id: 'nodes', run: (page) => open(page, `/system/nodes?path=${encodeURIComponent('/archive/people/Peggy_Wrenfield')}`, 4000) },
  { id: 'system-work', run: (page) => open(page, '/system?tab=work', 6000) },
  { id: 'system-log', run: (page) => open(page, '/system?tab=log', 5000) },
  { id: 'settings', run: (page) => open(page, '/settings', 4000) },
  { id: 'settings-users', run: (page) => open(page, '/settings?tab=users', 4000) },
  { id: 'settings-permissions', run: (page) => open(page, '/settings?tab=permissions', 4000) },
  { id: 'docs', run: (page) => open(page, '/docs', 4000) },
  { id: 'docs-node-types', run: (page) => open(page, '/docs/node-types', 4000) },
  { id: 'stats', run: (page) => open(page, '/stats', 5000) },
  { id: 'media', run: (page) => open(page, '/media', 6000) },
  { id: 'people', run: (page) => open(page, '/people', 5000) },
  { id: 'people-unknown', run: (page) => open(page, '/people/unknown', 5000) },
  { id: 'locations', run: (page) => open(page, '/locations', 5000) },
  { id: 'device', run: (page) => open(page, '/devices/ruby-iphone', 5000) },
  { id: 'import', run: (page) => open(page, '/staging/import', 4000) },
  { id: 'chat-page', run: (page) => open(page, '/chat', 4000) },
  { id: 'phone-home', phone: true, run: (page) => open(page, '/', 5000) },
  { id: 'phone-person', phone: true, run: (page) => open(page, '/people/Helen_Okafor', 5000) },
  {
    id: 'phone-lightbox',
    phone: true,
    run: async (page) => {
      await viewer(page, 'wellington-christmas-2025', 'IMG_0661.HEIC');
      // Swipe up for the details sheet.
      await swipe(page, 195, 600, 0, -380);
      await settle(page, 2000);
    },
  },
];

/** Playwright's chromium, the newest revision installed. */
function findChromium(): string {
  const root = `${Deno.env.get('HOME')}/.cache/ms-playwright`;
  let revisions: string[] = [];
  try {
    revisions = [...Deno.readDirSync(root)].map((d) => d.name).filter((n) => n.startsWith('chromium-')).sort().reverse();
  } catch {
    // none installed
  }
  for (const revision of revisions) {
    for (const sub of Deno.readDirSync(`${root}/${revision}`)) {
      const candidate = `${root}/${revision}/${sub.name}/chrome`;
      try {
        Deno.statSync(candidate);
        return candidate;
      } catch {
        // keep looking
      }
    }
  }
  throw new Error(`no chromium under ${root}: run npx playwright install chromium`);
}

async function signIn(page: Page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[type=password]', { timeout: 20000 });
  await page.fill('form:has(input[type=password]) input:not([type=password]):not([type=hidden])', flags.user);
  await page.fill('input[type=password]', PASSWORD);
  await page.click('button[type=submit]');
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 20000 }).catch(() => {
    throw new Error(`sign-in as ${flags.user} failed: check --password or EIN_ADMIN_PASSWORD`);
  });
}

async function newPage(browser: Browser, shot: Pick<Shot, 'phone'>): Promise<Page> {
  const context = await browser.newContext(
    shot.phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  );
  const page = await context.newPage();
  await signIn(page);
  return page;
}

/**
 * The pictures the hero is laid with, by the name each has on its page: faces of every age, and
 * album and device covers from seven decades that show the family doing something rather than one
 * face close up, so the field is not a wall of faces. "Isla turns seven" is the still of the hero's
 * video tile. No cover in it is a sourced photo of a real place with a sign in it.
 */
const HERO: Record<string, string[]> = {
  person: [
    'Helen Okafor',
    'David Okafor',
    'Ruby Wrenfield',
    'Peggy Wrenfield',
    'Samuel Okafor',
    'Isla Price',
    'Thomas Wrenfield',
    'Noah Price',
    'Arthur Wrenfield',
    'Freya Wrenfield',
    'Erik Wrenfield',
    'Grace Price',
    'Jon Wrenfield',
    'Kiri Wrenfield',
    'Leo Wrenfield',
  ],
  album: [
    'Isla turns seven',
    'Sailing in the archipelago',
    'The children',
    'Samuel moves to Boston',
    'Cornwall, summer 1968',
    'A week in London',
    'Christmas 1998',
    "Peggy's Falmouth",
    'Grace and Samuel',
    'Christmas at the cottage',
    "Helen and David's wedding",
    'Christmas 1975',
    'Leo comes home',
    'A lockdown walk',
    "Jon's Wellington",
    "David's London",
  ],
  device: ["Erik's iPhone", "Peggy's Lumix", "David's 7D", "Grace's N95", "Helen's Coolpix", "Jon's X-Pro1", "Ruby's iPhone"],
};

/**
 * The pictures the hero's tiles are filled with: the faces and covers HERO names, taken from the
 * pages that show them, so they are what the instance itself chose, in HERO's order. Replaces every
 * earlier picture in build/nodes, so none is left over that the manifest does not name.
 */
async function nodePictures(browser: Browser) {
  const page = await newPage(browser, {});
  const dir = `${flags.out}/nodes`;
  await Deno.mkdir(dir, { recursive: true });
  for (const entry of Deno.readDirSync(dir)) {
    if (entry.name.endsWith('.avif')) Deno.removeSync(`${dir}/${entry.name}`);
  }
  const manifest: { file: string; kind: string; name: string; detail: string }[] = [];
  const grab = async (route: string, kind: string) => {
    await open(page, route, 5000);
    // Each picture with its card's first two lines of text that are not a bare count: a name, and
    // a count of pictures, a date range or a camera's model. A grid loads a card's picture once it
    // nears the screen, so the cards are read at every step of a scroll to the end.
    const cards: { src: string; name: string; detail: string }[] = [];
    await page.mouse.move(800, 600);
    for (let i = 0; i < 12; i++) {
      const seen = await page.locator('main img:not(.mrx-entity-header-background)').evaluateAll((els) =>
        els.map((e) => {
          let el: HTMLElement = e as HTMLElement;
          for (let i = 0; i < 8 && el.parentElement; i++) {
            el = el.parentElement;
            const lines = el.innerText.split('\n').map((s) => s.trim()).filter((s) => s && !/^\d+$/.test(s));
            if (lines.length) return { src: e.getAttribute('src') ?? '', name: lines[0], detail: lines[1] ?? '' };
          }
          return { src: e.getAttribute('src') ?? '', name: '', detail: '' };
        })
      );
      cards.push(...seen.filter((c) => c.src.startsWith('/file/') && !cards.some((k) => k.name === c.name)));
      await page.mouse.wheel(0, 700);
      await settle(page, 900);
    }
    let n = 0;
    for (const name of HERO[kind]) {
      const card = cards.find((c) => c.name === name);
      const response = card && await page.request.get(BASE + card.src);
      if (!card || !response?.ok()) throw new Error(`${kind} "${name}": no picture on ${route}`);
      const file = `${kind}-${String(++n).padStart(2, '0')}.avif`;
      await Deno.writeFile(`${dir}/${file}`, new Uint8Array(await response.body()));
      // A camera's make comes twice when its model repeats it: "Canon Canon EOS 7D".
      manifest.push({ file, kind, name, detail: card.detail.replace(/^(\S+) (?=\1 )/i, '') });
    }
    console.log(`nodes: ${n} ${kind} pictures`);
  };
  await grab('/people', 'person');
  await grab('/albums', 'album');
  await grab('/devices', 'device');
  await Deno.writeTextFile(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
  await page.context().close();
}

const only = flags.only ? new Set(flags.only.split(',')) : null;
const unknown = only ? [...only].filter((id) => !SHOTS.some((s) => s.id === id)) : [];
if (unknown.length) {
  console.error(`unknown shot(s): ${unknown.join(', ')}; the shots are ${SHOTS.map((s) => s.id).join(', ')}`);
  Deno.exit(2);
}

let failed = 0;
const browser = await chromium.launch({ executablePath: findChromium(), args: ['--no-sandbox'] });
try {
  if (!flags.nodes) {
    await Deno.mkdir(`${flags.out}/shots`, { recursive: true });
    for (const shot of SHOTS) {
      if (only && !only.has(shot.id)) continue;
      let page: Page | undefined;
      try {
        page = await newPage(browser, shot);
        await shot.run(page);
        await page.screenshot({ path: `${flags.out}/shots/${shot.id}.png`, clip: shot.clip });
        console.log(`shot: ${shot.id}`);
      } catch (e) {
        failed++;
        console.error(`shot: ${shot.id} failed: ${e instanceof Error ? e.message : e}`);
      } finally {
        await page?.context().close();
      }
    }
  }
  if (flags.nodes || !only) {
    try {
      await nodePictures(browser);
    } catch (e) {
      failed++;
      console.error(`nodes failed: ${e instanceof Error ? e.message : e}`);
    }
  }
} finally {
  await browser.close();
}
if (failed) {
  console.error(`${failed} failed; build/ holds what succeeded`);
  Deno.exit(1);
}
