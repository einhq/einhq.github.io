/**
 * What every page of the site has: the top bar, and the bands of hats laid as the web interface lays
 * them behind a page's header, with the hat tiling's helpers the presentation page's hero draws with
 * too. Everything works without it: the hats are decoration, and the bar is plain links.
 */
import { COVERED, HAT_WIDTH, hats } from './hat-tiling.js';

/**
 * EiN's `mixed` pattern, as its web interface tints the home page's header: node types' colours
 * (site.css) as stops across a field's width.
 */
export const MIXED = [[0.05, 'album'], [0.25, 'person'], [0.45, 'place'], [0.62, 'track'], [0.8, 'device'], [0.98, 'label']];

/** The patch, decoded once: every layout only scales and cuts it. */
export const HATS = hats();

/** A number in [0, 1) of a tile's own, the same on every visit. */
export function noise(index, salt) {
  let h = Math.imul(index + 1, 374761393) ^ Math.imul(salt + 1, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The mixed pattern's colour at `at` (0 to 1) across a field, for a tile drawn in one colour. */
export function mixedAt(at) {
  const next = MIXED.findIndex(([stop]) => stop >= at);
  if (next <= 0) return `var(--${MIXED.at(next)[1]})`;
  const [[from, a], [to, b]] = [MIXED[next - 1], MIXED[next]];
  return `color-mix(in srgb, var(--${b}) ${(((at - from) / (to - from)) * 100).toFixed(0)}%, var(--${a}))`;
}

/**
 * What a field's tiles are painted with: a node type's colour (`--<pattern>` in site.css), or for
 * `mixed` a gradient across the field's `width`, added to `defs` as `id`.
 */
export function paintOf(pattern, defs, width, id) {
  if (pattern !== 'mixed') return `var(--${pattern})`;
  const gradient = svg('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: width, y2: 0 });
  for (const [offset, kind] of MIXED) gradient.append(svg('stop', { offset, style: `stop-color: var(--${kind})` }));
  defs.append(gradient);
  return `url(#${id})`;
}

/**
 * A tile's fill opacity, as the web interface tints a header: a little more at random, where the
 * light falls (`light`, 0 to 1) and on the mirrored hats, and all of it less where `shade` darkens it.
 */
export const tint = (tile, light, shade) => (0.09 + 0.05 * noise(tile.index, 3) + 0.1 * light + (tile.mirrored ? 0.1 : 0)) * shade;

/** A tile's outline opacity: a shared edge, drawn by both its tiles, comes to about .36. */
export const OUTLINE = 0.2;

/**
 * The hats of the patch over a `width` × `height` px field, `scale` px to a patch unit, with the
 * field's top left at `cut` on the patch: each with its outline as a path, its corners, its box and
 * its middle, in the field's pixels.
 */
export function hatsIn(width, height, cut, scale) {
  const reach = 5 * scale;
  const tiles = [];
  for (const [index, hat] of HATS.entries()) {
    // A hat is under 4.6 units across: one far from the field by its first corner is skipped unmapped.
    const [fx, fy] = hat.corners[0];
    const px = (fx - cut.x) * scale;
    const py = (fy - cut.y) * scale;
    if (px < -reach || py < -reach || px > width + reach || py > height + reach) continue;
    const corners = hat.corners.map(([x, y]) => [(x - cut.x) * scale, (y - cut.y) * scale]);
    const xs = corners.map((c) => c[0]);
    const ys = corners.map((c) => c[1]);
    const box = { x: Math.min(...xs), y: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) };
    if (box.right < 0 || box.bottom < 0 || box.x > width || box.y > height) continue;
    const d = 'M' + corners.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z';
    tiles.push({ index, d, box, corners, mirrored: hat.mirrored, cx: (box.x + box.right) / 2, cy: (box.y + box.bottom) / 2 });
  }
  return tiles;
}

export const smooth = (from, to, x) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

export const SVG = 'http://www.w3.org/2000/svg';
export function svg(name, attributes, text) {
  const el = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
  if (text !== undefined) el.textContent = text;
  return el;
}

/**
 * A band of hats over `host`, as the web interface lays one behind a page's header, in the pattern
 * its `data-band` names (`paintOf`): every tile filled and outlined, lit from the upper right and
 * darkening towards the foot, where the title stands. With `data-foot` it is the field under a
 * dialog's buttons instead: hats of the interface's 38 px, none darkened. Band `n` is cut from its own
 * part of the patch, so no two look alike.
 */
export function layBand(host, n) {
  const width = host.clientWidth;
  const height = host.clientHeight;
  if (!width || !height) return;
  const foot = 'foot' in host.dataset;
  const hatPx = foot ? 38 : Math.min(52, Math.max(36, width / 28));
  const scale = hatPx / HAT_WIDTH;
  const spare = { x: Math.max(0, COVERED.width - width / scale), y: Math.max(0, COVERED.height - height / scale) };
  const cut = { x: COVERED.x + noise(n, 11) * spare.x, y: COVERED.y + noise(n, 12) * spare.y };

  const root = svg('svg', { viewBox: `0 0 ${width} ${height}` });
  const defs = svg('defs', {});
  root.append(defs);
  const paint = paintOf(host.dataset.band, defs, width, `band-paint-${n}`);
  for (const tile of hatsIn(width, height, cut, scale)) {
    const light = Math.max(0, 1 - Math.hypot((tile.cx - 0.86 * width) / (0.62 * width), (tile.cy + 0.3 * height) / (1.5 * height)));
    const shade = foot ? 1 : 1 - 0.75 * smooth(0.1, 1, tile.cy / height);
    root.append(svg('path', {
      d: tile.d,
      fill: paint,
      'fill-opacity': tint(tile, light, shade).toFixed(3),
      stroke: paint,
      'stroke-opacity': (OUTLINE * shade).toFixed(3),
      'stroke-linejoin': 'round',
    }));
  }
  host.replaceChildren(root);
}

/** Every band on the page, laid again when its width changes; the top bar's is numbered last, after the chapters'. */
export function bands() {
  const hosts = [...document.querySelectorAll('[data-band]:not([data-foot])'), ...document.querySelectorAll('[data-band][data-foot]')];
  const laid = new Map();
  const observer = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const size = `${target.clientWidth}x${target.clientHeight}`;
      if (laid.get(target) === size) continue;
      laid.set(target, size);
      layBand(target, hosts.indexOf(target));
    }
  });
  for (const host of hosts) observer.observe(host);
}

/** Where the banner and the top bar over the page end; both are fixed, so this does not change on a scroll. */
export function barBottom() {
  return document.querySelector('.bar')?.getBoundingClientRect().bottom ?? 60;
}

/**
 * The top bar: an edge once the page has scrolled, and its link to the chapter in view marked
 * (`aria-current`): the chapter (`ch-` class) of the last section whose start has passed a third of
 * the way down, the hero's being the first link's. Getting started comes both first and last. On a
 * phone its links are a menu (site.css), which a chapter's link, Escape, a tap outside it or a wider
 * window closes again. A page without chapters, such as the documentation's, keeps the link its HTML
 * marks.
 */
export function bar() {
  const header = document.querySelector('.bar');
  if (!header) return;
  const links = [...header.querySelectorAll('nav a')];
  const sections = [...document.querySelectorAll('main > section')];
  const chapterOf = (el) => [...el.classList].find((name) => name.startsWith('ch-'));
  const linkOf = (section) => links.find((link) => chapterOf(link) === chapterOf(section)) ?? links[0];
  const update = () => {
    header.toggleAttribute('data-scrolled', scrollY > 8);
    if (!sections.length) return;
    const line = innerHeight / 3;
    const section = sections.findLast((el) => el.getBoundingClientRect().top <= line);
    const at = section && linkOf(section);
    for (const link of links) link === at ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current');
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();

  const menu = header.querySelector('.bar-menu');
  if (!menu) return;
  const open = (opened) => {
    header.toggleAttribute('data-open', opened);
    menu.setAttribute('aria-expanded', String(opened));
  };
  menu.hidden = false;
  menu.addEventListener('click', () => open(!header.hasAttribute('data-open')));
  for (const link of links) link.addEventListener('click', () => open(false));
  addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !header.hasAttribute('data-open')) return;
    open(false);
    menu.focus();
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) open(false);
  });
  matchMedia('(max-width: 780px)').addEventListener('change', () => open(false));
}
