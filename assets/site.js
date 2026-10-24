/**
 * The page's behaviour: the hero's field of hats, the bands of hats that open the other chapters, the
 * tour's tabs, the screenshots' viewer, the copy button and the top bar. Everything works without
 * it: the hats are decoration, without script the tour shows every page one after another
 * (site.css, `scripting: none`), and a screenshot's card links to its image.
 */
import { COVERED, HAT_WIDTH, hats } from './hat-tiling.js';

/**
 * EiN's `mixed` pattern, as its web interface tints the home page's header: node types' colours
 * (site.css) as stops across a field's width.
 */
const MIXED = [[0.05, 'album'], [0.25, 'person'], [0.45, 'place'], [0.62, 'track'], [0.8, 'device'], [0.98, 'label']];

const NAMES = { person: 'Person', album: 'Album', device: 'Device' };

/**
 * Tiles that show a node other than a picture, so the field says EiN keeps more than photos: each
 * is drawn by a function of its own (GLYPHS).
 */
const OTHERS = [
  { glyph: 'terminal', name: 'A shell', detail: 'bash, on every node in the tree' },
  { glyph: 'waveform', name: 'A recording', detail: 'Transcribed, its speakers told apart' },
  { glyph: 'pipeline', name: 'A pipeline', detail: 'Steps that run on every change' },
  { glyph: 'track', name: 'A GPS track', detail: "A day's route, on the map" },
  { glyph: 'letter', name: 'A letter', detail: 'Handwriting, read and searchable' },
  { glyph: 'log', name: 'A log', detail: 'Followed live with tail -f' },
  { glyph: 'chat', name: 'A chat', detail: 'Answered by running commands as you' },
  { glyph: 'pin', name: 'A place', detail: 'A point, a circle or an outline on the map' },
  { glyph: 'video', name: 'A home video', detail: 'Played as AV1, every word transcribed', still: 'Isla turns seven' },
];

/**
 * What a tile shows, for spreading them: a face, a picture of the family doing something, or a
 * drawn node. Neighbours of one role would read as one patch, so the field mixes them.
 */
const role = (picture) => picture.glyph ? 'drawn' : picture.kind === 'person' ? 'face' : 'scene';

/** How far apart, in hats, the middles of two filled tiles are at least, besides never touching. */
const SPACING = 0.9;

/** Where on the patch the field is cut, in patch units: fixed, so the page always shows the same hats. */
const CUT = { x: COVERED.x + 58, y: COVERED.y + 36 };

/** How much more the hero tints its tiles than a header band does: it is the page's picture, not a ground for controls. */
const HERO_TINT = 1.5;

/** The patch, decoded once: every layout only scales and cuts it. */
const HATS = hats();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

/** A number in [0, 1) of a tile's own, the same on every visit. */
function noise(index, salt) {
  let h = Math.imul(index + 1, 374761393) ^ Math.imul(salt + 1, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The mixed pattern's colour at `at` (0 to 1) across a field, for a tile drawn in one colour. */
function mixedAt(at) {
  const next = MIXED.findIndex(([stop]) => stop >= at);
  if (next <= 0) return `var(--${MIXED.at(next)[1]})`;
  const [[from, a], [to, b]] = [MIXED[next - 1], MIXED[next]];
  return `color-mix(in srgb, var(--${b}) ${(((at - from) / (to - from)) * 100).toFixed(0)}%, var(--${a}))`;
}

/**
 * What a field's tiles are painted with: a node type's colour (`--<pattern>` in site.css), or for
 * `mixed` a gradient across the field's `width`, added to `defs` as `id`.
 */
function paintOf(pattern, defs, width, id) {
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
const tint = (tile, light, shade) => (0.09 + 0.05 * noise(tile.index, 3) + 0.1 * light + (tile.mirrored ? 0.1 : 0)) * shade;

/** A tile's outline opacity: a shared edge, drawn by both its tiles, comes to about .36. */
const OUTLINE = 0.2;

/**
 * The hats of the patch over a `width` × `height` px field, `scale` px to a patch unit, with the
 * field's top left at `cut` on the patch: each with its outline as a path, its corners, its box and
 * its middle, in the field's pixels.
 */
function hatsIn(width, height, cut, scale) {
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

/** Whether (x, y) lies inside the polygon `corners`. */
function inside(corners, x, y) {
  let within = false;
  corners.forEach(([x0, y0], i) => {
    const [x1, y1] = corners[(i + 1) % corners.length];
    if ((y0 > y) !== (y1 > y) && x < x0 + ((y - y0) * (x1 - x0)) / (y1 - y0)) within = !within;
  });
  return within;
}

/** Whether hats `a` and `b` touch: a corner of one lies on the other's outline. */
function touches(a, b) {
  if (a.box.x > b.box.right + 2 || b.box.x > a.box.right + 2 || a.box.y > b.box.bottom + 2 || b.box.y > a.box.bottom + 2) return false;
  const onOutline = ([px, py], corners) =>
    corners.some(([x0, y0], i) => {
      const [x1, y1] = corners[(i + 1) % corners.length];
      const [dx, dy] = [x1 - x0, y1 - y0];
      const t = Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(x0 + t * dx - px, y0 + t * dy - py) < 1.5;
    });
  return a.corners.some((p) => onOutline(p, b.corners)) || b.corners.some((p) => onOutline(p, a.corners));
}

/**
 * About the largest rectangle `aspect` times as wide as high inside the hat `corners`, within its
 * box `b`: where a drawn tile puts what must not be cut. A hat is concave and turned every way, so
 * its box's middle may be outside it.
 */
function solid(corners, b, aspect) {
  // Its sides lie inside the hat, sampled, and none of the hat's corners pokes into it.
  const fits = (cx, cy, h) => {
    const w = h * aspect;
    const [left, top, right, bottom] = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
    for (let i = 0; i <= 6; i++) {
      const [x, y] = [left + (w * i) / 6, top + (h * i) / 6];
      if (!inside(corners, x, top) || !inside(corners, x, bottom) || !inside(corners, left, y) || !inside(corners, right, y)) return false;
    }
    return corners.every(([x, y]) => x <= left || x >= right || y <= top || y >= bottom);
  };
  let best = { x: b.x + b.w / 2, y: b.y + b.h / 2, h: 0 };
  for (let i = 1; i < 12; i++) {
    for (let j = 1; j < 12; j++) {
      const [cx, cy] = [b.x + (b.w * i) / 12, b.y + (b.h * j) / 12];
      if (!inside(corners, cx, cy)) continue;
      let [low, high] = [best.h, b.h];
      if (!fits(cx, cy, low + 0.5)) continue;
      for (let k = 0; k < 10; k++) {
        const mid = (low + high) / 2;
        if (fits(cx, cy, mid)) low = mid;
        else high = mid;
      }
      best = { x: cx, y: cy, h: low };
    }
  }
  const w = best.h * aspect;
  return { x: best.x - w / 2, y: best.y - best.h / 2, w, h: best.h, cx: best.x, cy: best.y };
}

const smooth = (from, to, x) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

const SVG = 'http://www.w3.org/2000/svg';
function svg(name, attributes, text) {
  const el = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value);
  if (text !== undefined) el.textContent = text;
  return el;
}

/** A line of monospaced text from (x, y) at `size` px, in runs of `[text, class]`. */
function mono(x, y, size, runs) {
  const text = svg('text', { x: x.toFixed(1), y: y.toFixed(1), 'font-size': size.toFixed(1), class: 'g-text' });
  for (const [part, cls] of runs) text.append(svg('tspan', cls ? { class: cls } : {}, part));
  return text;
}

/** A dark screen over box `b`, as the interface draws one. */
const ground = (b) => svg('rect', { x: b.x, y: b.y, width: b.w, height: b.h, class: 'g-screen' });

/** Rows of `mono` text on a screen, from the top left of the hat's solid part `r` on down. */
function screen(b, r, size, rows) {
  return [ground(b), ...rows.map((runs, i) => mono(r.x + size * 0.2, r.y + size * (1.05 + 1.55 * i), size, runs))];
}

/** A path through points given as fractions of a box. */
const through = (b, points) => 'M' + points.map(([fx, fy]) => `${(b.x + fx * b.w).toFixed(1)},${(b.y + fy * b.h).toFixed(1)}`).join('L');

/** A light street map: land, water along one side, a park and roads, cut differently by `seed`. */
function map(b, seed) {
  const flip = noise(seed, 13) < 0.5;
  const at = ([fx, fy]) => [flip ? 1 - fx : fx, fy];
  const roads = [
    [[-0.1, 0.3], [0.4, 0.38], [1.1, 0.2]],
    [[0.55, -0.1], [0.5, 0.5], [0.62, 1.1]],
    [[-0.1, 0.78], [0.5, 0.5], [1.1, 0.7]],
  ].map((road) => through(b, road.map(at)));
  return [
    svg('rect', { x: b.x, y: b.y, width: b.w, height: b.h, class: 'g-land' }),
    svg('path', { d: through(b, [[-0.1, 0.62], [0.12, 0.7], [0.22, 0.9], [0.18, 1.1], [-0.1, 1.1]].map(at)) + 'Z', class: 'g-water' }),
    svg('path', { d: through(b, [[0.66, 0.36], [0.92, 0.42], [0.86, 0.6], [0.7, 0.55]].map(at)) + 'Z', class: 'g-park' }),
    ...roads.map((d) => svg('path', { d, class: 'g-road-case', 'stroke-width': (b.w * 0.055).toFixed(1) })),
    ...roads.map((d) => svg('path', { d, class: 'g-road', 'stroke-width': (b.w * 0.032).toFixed(1) })),
  ];
}

/**
 * What a tile that is not a picture shows: a crop of the node as EiN shows it, filling the tile's
 * box `b` as a photo fills its tile; the hat clips the rest. What must not be cut starts in `r`, the
 * largest rectangle inside the hat (`solid`); `frame` is a picture for the video.
 */
const GLYPHS = {
  terminal: (b, r) =>
    screen(b, r, b.w * 0.085, [
      [['$ ', 'g-accent'], ['ls /']],
      [['archive  dev  etc', 'g-muted']],
      [['home  tmp  usr  var', 'g-muted']],
      [['$ ', 'g-accent'], ['whoami']],
      [['helen', 'g-muted']],
      [['$ ', 'g-accent'], ['▍']],
    ]),
  log: (b, r) =>
    screen(
      b,
      r,
      b.w * 0.08,
      [
        ['31', 'INFO', 'http GET /albums'],
        ['33', 'INFO', 'ingest done'],
        ['35', 'WARN', 'ems busy, retry'],
        ['40', 'INFO', 'ssh helen in'],
        ['41', 'INFO', 'ocr done'],
        ['52', 'INFO', 'sftp put scans.zip'],
      ].map(([s, level, text]) => [[`04:${s} `, 'g-faint'], [level, level === 'WARN' ? 'g-warn' : 'g-ok'], [` ${text}`]]),
    ),
  waveform: (b, r, seed) => {
    const n = 22;
    const played = 0.45;
    const size = b.w * 0.075;
    const span = b.w * 0.86;
    const left = r.cx - span / 2;
    const mid = r.cy - size * 0.6;
    const bw = (span / n) * 0.55;
    const bars = Array.from({ length: n }, (_, i) => {
      const burst = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.6 + seed));
      const bh = Math.max(2, (r.h - size * 1.6) * burst * (0.3 + 0.7 * noise(seed + i, 7)));
      return svg('rect', {
        x: (left + (span * i) / n).toFixed(1),
        y: (mid - bh / 2).toFixed(1),
        width: bw.toFixed(1),
        height: bh.toFixed(1),
        rx: (bw / 2).toFixed(1),
        class: i / n < played ? 'g-fill' : 'g-bar',
      });
    });
    const head = left + span * played - (span / n) * 0.22;
    return [
      ground(b),
      ...bars,
      svg('rect', { x: head.toFixed(1), y: (mid - r.h * 0.42).toFixed(1), width: 1.5, height: (r.h * 0.84).toFixed(1), class: 'g-light' }),
      svg('text', { x: r.cx.toFixed(1), y: (r.y + r.h).toFixed(1), 'font-size': size.toFixed(1), 'text-anchor': 'middle', class: 'g-text g-accent' }, '0:41 / 3:12'),
    ];
  },
  track: (b, _r, seed) => {
    const route = through(b, [[0.06, 0.84], [0.22, 0.66], [0.34, 0.7], [0.46, 0.5], [0.62, 0.47], [0.72, 0.3], [0.94, 0.18]]);
    const dot = ([fx, fy]) => svg('circle', { cx: (b.x + fx * b.w).toFixed(1), cy: (b.y + fy * b.h).toFixed(1), r: (b.w * 0.035).toFixed(1), class: 'g-route-end' });
    return [...map(b, seed), svg('path', { d: route, class: 'g-route', 'stroke-width': (b.w * 0.04).toFixed(1) }), dot([0.06, 0.84]), dot([0.94, 0.18])];
  },
  pin: (b, { cx, cy, h }, seed) => {
    const r = b.w * 0.07;
    const pin = `M${cx.toFixed(1)},${(cy + r * 1.3).toFixed(1)} l${(-r * 0.75).toFixed(1)},${(-r * 1.35).toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1 1 ${
      (r * 1.5).toFixed(1)
    },0 Z`;
    return [
      ...map(b, seed + 1),
      svg('circle', { cx: cx.toFixed(1), cy: cy.toFixed(1), r: Math.max(h * 0.6, b.w * 0.18).toFixed(1), class: 'g-place', 'stroke-width': 1.5 }),
      svg('path', { d: pin, transform: `translate(0 ${(-r * 1.3).toFixed(1)})`, class: 'g-pin' }),
      svg('circle', { cx: cx.toFixed(1), cy: (cy - r * 1.3 - r * 0.35).toFixed(1), r: (r * 0.38).toFixed(1), class: 'g-light' }),
    ];
  },
  // A run of a pipeline, step by step: done, running, still to come.
  pipeline: (b, r) => {
    const steps = [['ingest', 'done'], ['faces', 'done'], ['transcribe', 'running'], ['album', 'waiting']];
    const size = b.w * 0.08;
    const step = size * 1.6;
    const dot = size * 0.42;
    const dx = r.x + dot * 1.4;
    const top = r.y + size * 0.6;
    return [
      ground(b),
      svg('rect', { x: (dx - 0.75).toFixed(1), y: top.toFixed(1), width: 1.5, height: (step * 3).toFixed(1), class: 'g-bar' }),
      ...steps.flatMap(([name, state], i) => {
        const y = top + i * step;
        const text = svg('text', {
          x: (dx + dot * 2.2).toFixed(1),
          y: (y + size * 0.36).toFixed(1),
          'font-size': size.toFixed(1),
          class: `g-text g-sans${state === 'waiting' ? ' g-faint' : ''}`,
        }, name);
        return [svg('circle', { cx: dx.toFixed(1), cy: y.toFixed(1), r: dot.toFixed(1), class: `g-dot g-dot-${state}` }), text];
      }),
    ];
  },
  chat: (b, r) => {
    const size = b.w * 0.07;
    const line = (x, y, runs) => {
      const text = mono(x, y, size, runs);
      text.setAttribute('class', 'g-text g-sans');
      return text;
    };
    const bubble = { x: r.x + r.w * 0.2, y: r.y, w: b.w * 0.62, h: size * 2 };
    const top = bubble.y + bubble.h + size * 1.3;
    return [
      ground(b),
      svg('rect', { x: bubble.x.toFixed(1), y: bubble.y.toFixed(1), width: bubble.w.toFixed(1), height: bubble.h.toFixed(1), rx: (size * 0.8).toFixed(1), class: 'g-bubble' }),
      line(bubble.x + size * 0.7, bubble.y + size * 1.35, [['Who is this?', 'g-strong']]),
      line(r.x, top, [['› Ran 1 command', 'g-faint']]),
      ...[['David', '69'], ['Helen', '67'], ['Ruby', '26']].map(([name, age], i) =>
        line(r.x, top + size * 1.5 * (i + 1), [['• '], [name, 'g-strong'], [` – ${age}`, 'g-muted']])
      ),
    ];
  },
  video: (b, r, _seed, frame) => {
    const size = b.w * 0.07;
    const play = Math.min(r.h * 0.3, b.w * 0.12);
    const [cx, cy] = [r.cx, r.y + play * 1.05];
    const bar = { x: r.cx - r.w * 0.5, y: r.y + r.h - 2.5, w: r.w };
    return [
      frame ? svg('image', { href: frame, x: b.x, y: b.y, width: b.w, height: b.h, preserveAspectRatio: 'xMidYMid slice' }) : ground(b),
      svg('rect', { x: b.x, y: b.y, width: b.w, height: b.h, class: 'g-dim' }),
      svg('circle', { cx: cx.toFixed(1), cy: cy.toFixed(1), r: play.toFixed(1), class: 'g-play' }),
      svg('path', {
        d: `M${(cx - play * 0.32).toFixed(1)},${(cy - play * 0.48).toFixed(1)} L${(cx + play * 0.5).toFixed(1)},${cy.toFixed(1)} L${(cx - play * 0.32).toFixed(1)},${
          (cy + play * 0.48).toFixed(1)
        }Z`,
        class: 'g-light',
      }),
      svg('text', { x: r.cx.toFixed(1), y: (bar.y - size * 0.7).toFixed(1), 'font-size': size.toFixed(1), 'text-anchor': 'middle', class: 'g-caption' }, 'Higher, Grandpa!'),
      svg('rect', { x: bar.x.toFixed(1), y: bar.y.toFixed(1), width: bar.w.toFixed(1), height: 2.5, rx: 1.25, class: 'g-track' }),
      svg('rect', { x: bar.x.toFixed(1), y: bar.y.toFixed(1), width: (bar.w * 0.35).toFixed(1), height: 2.5, rx: 1.25, class: 'g-fill' }),
    ];
  },
  // Handwriting on paper: words of joined letters that lean forward, humps, loops and cups, a tall
  // loop now and then.
  letter: (b, r, seed) => {
    const ink = [];
    const size = b.h * 0.05;
    const f = (v) => v.toFixed(1);
    for (let row = 0, y = b.y + b.h * 0.12; y < b.y + b.h; row++, y += size * 3) {
      let x = b.x + b.w * (row % 3 ? 0.04 : 0.14);
      let n = 0;
      while (x < b.x + b.w * 0.96) {
        const word = b.w * (0.08 + 0.18 * noise(seed + row * 17 + n, 9));
        let d = `M${f(x)},${f(y)}`;
        for (let k = 0, px = x; px < x + word; k++) {
          const kind = noise(seed + row * 31 + n * 7 + k, 19);
          const step = size * (0.5 + 0.45 * noise(seed + n + k, 23));
          const up = size * (0.8 + 0.4 * noise(seed + k + row, 21));
          if (kind < 0.35) {
            // A hump, as in n and m.
            d += ` C${f(px + step * 0.5)},${f(y - up)} ${f(px + step * 1.25)},${f(y - up)} ${f(px + step * 0.75)},${f(y)}`;
            d += ` Q${f(px + step * 0.88)},${f(y + size * 0.12)} ${f(px + step)},${f(y - size * 0.1)}`;
          } else if (kind < 0.65 || kind >= 0.85) {
            // A loop, as in e, or as in l when tall.
            const high = kind >= 0.85 ? up * 2.2 : up * 0.9;
            d += ` C${f(px + step * 1.3)},${f(y - high)} ${f(px - step * 0.2)},${f(y - high)} ${f(px + step)},${f(y)}`;
          } else {
            // A cup, as in u and w.
            d += ` Q${f(px + step * 0.1)},${f(y - up)} ${f(px + step * 0.3)},${f(y - up * 0.7)}`;
            d += ` Q${f(px + step * 0.55)},${f(y + size * 0.2)} ${f(px + step)},${f(y - up * 0.15)}`;
          }
          px += step;
        }
        ink.push(svg('path', { d, class: 'g-ink', 'stroke-width': (0.5 + b.w * 0.005).toFixed(2) }));
        x += word + size * 1.4;
        n++;
      }
    }
    const stamp = { w: b.w * 0.15, h: b.w * 0.18 };
    Object.assign(stamp, { x: r.x + r.w - stamp.w, y: r.y });
    return [
      svg('rect', { x: b.x, y: b.y, width: b.w, height: b.h, class: 'g-paper' }),
      ...ink,
      svg('rect', { x: stamp.x.toFixed(1), y: stamp.y.toFixed(1), width: stamp.w.toFixed(1), height: stamp.h.toFixed(1), class: 'g-stamp' }),
    ];
  },
};

/**
 * Lays the hats over `host`: the faces of the demo's people, the covers of its albums and cameras and
 * the drawn nodes spread over the whole field, dimmed where the copy stands over them, and every other
 * tile tinted in EiN's mixed pattern, brighter on the open side: right of the copy on a wide screen,
 * above the headline on a narrow one. A pictured tile's outline takes the pattern's colour where it lies.
 */
function layField(host, pictures, entering) {
  const width = host.clientWidth;
  const height = host.clientHeight;
  // Below 1000 px the copy spans the width, so the pictures go above the headline (site.css darkens
  // the field from the foot up there).
  const stacked = width < 1000;
  const origin = host.getBoundingClientRect();
  const headline = host.parentElement.querySelector('h1');
  const copyTop = headline ? headline.getBoundingClientRect().top - origin.top : height * 0.4;
  // The copy's box, around the lines of the headline and the lede and the buttons (a headline's
  // own box is wider than its words), and where the key under it starts.
  const lines = (selector) => {
    const range = document.createRange();
    const el = host.parentElement.querySelector(selector);
    if (!el) return [];
    range.selectNodeContents(el);
    return [...range.getClientRects()];
  };
  const parts = [...lines('h1'), ...lines('.lede'), ...[...host.parentElement.querySelectorAll('.actions > *')].map((el) => el.getBoundingClientRect())];
  const copy = parts.length
    ? {
      x: Math.min(...parts.map((r) => r.left)) - origin.left,
      y: Math.min(...parts.map((r) => r.top)) - origin.top,
      right: Math.max(...parts.map((r) => r.right)) - origin.left,
      bottom: Math.max(...parts.map((r) => r.bottom)) - origin.top,
    }
    : null;
  const key = host.parentElement.querySelector('.field-key');
  const foot = key ? key.getBoundingClientRect().top - origin.top - 8 : height;
  const hatPx = width < 720 ? 60 : Math.min(112, Math.max(76, width / 14));
  const tiles = hatsIn(width, height, CUT, hatPx / HAT_WIDTH);

  // The open side, right of the copy or above the headline when stacked, where the tinted hats are
  // brighter.
  const openness = (t) =>
    stacked ? 1 - smooth(copyTop * 0.5, copyTop * 0.92, t.cy) : smooth(width * 0.38, width * 0.8, t.cx) * (1 - smooth(height * 0.66, height * 0.92, t.cy));
  // A picture behind the copy is dimmed, so the text over it stays easy to read.
  const margin = hatPx * 0.3;
  const behindCopy = (t) => copy && t.cx > copy.x - margin && t.cx < copy.right + margin && t.cy > copy.y - margin && t.cy < copy.bottom + margin;
  const whole = (t) => t.box.x >= 0 && t.box.y >= barBottom() && t.box.right <= width && t.box.bottom <= foot;
  // Pictures go to whole tiles over the whole field, spread evenly: the most open tile first, then
  // each time the tile farthest from those chosen, until every picture has a tile or no tile is a
  // spacing clear of the others and touches none of them.
  const free = tiles.filter(whole);
  const chosen = [];
  while (chosen.length < pictures.length && free.length) {
    let best;
    for (const [i, t] of free.entries()) {
      const near = Math.min(Infinity, ...chosen.map((c) => Math.hypot(c.cx - t.cx, c.cy - t.cy)));
      if (near <= hatPx * SPACING || chosen.some((c) => touches(c, t))) continue;
      const score = (chosen.length ? near : openness(t) * hatPx) + noise(t.index, 1);
      if (!best || score > best.score) best = { i, score };
    }
    if (!best) break;
    chosen.push(...free.splice(best.i, 1));
  }
  // Each chosen tile, in the order chosen, takes the next picture of the role its neighbours show least,
  // and of those the role with the most still to lay, so the roles mix evenly wherever the field ends.
  const queues = new Map();
  for (const picture of pictures) queues.set(role(picture), [...(queues.get(role(picture)) ?? []), picture]);
  const pictured = new Map();
  for (const tile of chosen) {
    const near = [...pictured].filter(([t]) => Math.hypot(t.cx - tile.cx, t.cy - tile.cy) < hatPx * 2.6).map(([, p]) => role(p));
    const left = [...queues.values()].reduce((sum, queue) => sum + queue.length, 0);
    let best;
    for (const [name, queue] of queues) {
      if (!queue.length) continue;
      const score = near.filter((r) => r === name).length - queue.length / left;
      if (!best || score < best.score) best = { queue, score };
    }
    pictured.set(tile, best.queue.shift());
  }

  const root = svg('svg', { viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: 'xMidYMid slice' });
  const defs = svg('defs', {});
  root.append(defs);
  const paint = paintOf('mixed', defs, width, 'hero-paint');

  const focus = stacked ? [width * 0.5, copyTop * 0.45] : [width * 0.78, height * 0.42];
  const reach = Math.hypot(width, height);

  for (const tile of tiles) {
    const picture = pictured.get(tile);
    const delay = (Math.hypot(tile.cx - focus[0], tile.cy - focus[1]) / reach) * 1100 + noise(tile.index, 4) * 160;
    if (picture) {
      const accent = mixedAt(tile.cx / width);
      const group = svg('g', {
        class: 'tile tile-picture',
        style: `--delay: ${delay.toFixed(0)}ms; --accent: ${accent}${behindCopy(tile) ? '; opacity: 0.4' : ''}`,
      });
      const clip = `hat-${tile.index}`;
      const clipPath = svg('clipPath', { id: clip });
      clipPath.append(svg('path', { d: tile.d }));
      defs.append(clipPath);
      const [x, y, w, h] = [tile.box.x, tile.box.y, tile.box.right - tile.box.x, tile.box.bottom - tile.box.y];
      if (picture.glyph) {
        const content = svg('g', { 'clip-path': `url(#${clip})`, class: 'g' });
        const box = { x, y, w, h };
        content.append(...GLYPHS[picture.glyph](box, solid(tile.corners, box, 1.25), tile.index, picture.frame));
        group.append(content, svg('path', { d: tile.d, fill: 'none' }));
      } else {
        // Centred halfway from the box's middle to the hat's solid part, so a face is cut less by the
        // hat's corners, and as large as it must be to still fill the whole box from there.
        const solidPart = solid(tile.corners, { x, y, w, h }, 1);
        const [cx, cy] = [(x + w / 2 + solidPart.cx) / 2, (y + h / 2 + solidPart.cy) / 2];
        const half = Math.max(cx - x, x + w - cx, cy - y, y + h - cy);
        group.append(
          svg('image', {
            href: `assets/nodes/${picture.file.replace(/\.avif$/, '.webp')}`,
            x: (cx - half).toFixed(1),
            y: (cy - half).toFixed(1),
            width: (half * 2).toFixed(1),
            height: (half * 2).toFixed(1),
            preserveAspectRatio: 'xMidYMid slice',
            'clip-path': `url(#${clip})`,
          }),
          svg('path', { d: tile.d, fill: 'none' }),
        );
      }
      group.dataset.name = picture.name;
      group.dataset.detail = picture.glyph ? picture.detail : [NAMES[picture.kind], picture.detail].filter(Boolean).join(', ');
      root.append(group);
    } else {
      root.append(
        svg('path', {
          class: 'tile',
          d: tile.d,
          fill: paint,
          'fill-opacity': (HERO_TINT * tint(tile, openness(tile), 1)).toFixed(3),
          stroke: paint,
          'stroke-opacity': OUTLINE,
          style: `--delay: ${delay.toFixed(0)}ms`,
        }),
      );
    }
  }

  if (entering && !reducedMotion.matches) {
    root.dataset.entering = '';
    setTimeout(() => delete root.dataset.entering, 2600);
  }
  host.replaceChildren(root);
}

/**
 * A name and what it is, over a pictured tile while the pointer rests on it: above the tile, or
 * below it when the top bar would cover it, and kept inside the hero.
 */
function tooltips(host) {
  const hero = host.parentElement;
  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.hidden = true;
  tip.setAttribute('aria-hidden', 'true');
  hero.append(tip);
  host.addEventListener('pointerover', (event) => {
    const group = event.target.closest('.tile-picture');
    if (!group) return;
    tip.style.setProperty('--accent', group.style.getPropertyValue('--accent'));
    tip.replaceChildren(
      Object.assign(document.createElement('strong'), { textContent: group.dataset.name }),
      Object.assign(document.createElement('span'), { textContent: group.dataset.detail }),
    );
    tip.hidden = false;
    const tile = group.getBoundingClientRect();
    const box = hero.getBoundingClientRect();
    const size = tip.getBoundingClientRect();
    const below = tile.top - size.height - 12 < barBottom() + 4;
    tip.style.transform = below ? 'translate(-50%, 12px)' : '';
    tip.style.top = `${(below ? tile.bottom : tile.top) - box.top}px`;
    const x = tile.left + tile.width / 2 - box.left;
    tip.style.left = `${Math.min(Math.max(x, size.width / 2 + 8), box.width - size.width / 2 - 8)}px`;
  });
  host.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget?.closest?.('.tile-picture')) tip.hidden = true;
  });
}

async function field() {
  const host = document.querySelector('[data-field]');
  if (!host) return;
  let pictures = [];
  try {
    const response = await fetch('assets/nodes/manifest.json');
    if (response.ok) pictures = await response.json();
  } catch {
    // The field is laid with colours alone.
  }
  // The video shows an album's cover as its still, so that album is not a tile of its own.
  const others = OTHERS.map((other) => {
    const still = pictures.find((p) => p.kind === 'album' && p.name === other.still);
    return still ? { ...other, frame: `assets/nodes/${still.file.replace(/\.avif$/, '.webp')}` } : other;
  });
  // Every picture and every drawn tile, which layField spreads and mixes.
  const mixed = [...pictures.filter((p) => !OTHERS.some((other) => other.still === p.name)), ...others];

  layField(host, mixed, true);
  tooltips(host);
  // Laid again when the hero changes size by more than a little either way: under `slice` a
  // field laid for another size would be scaled and cropped.
  let laid = [host.clientWidth, host.clientHeight];
  let timer;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const now = [host.clientWidth, host.clientHeight];
      if (Math.abs(now[0] - laid[0]) < 24 && Math.abs(now[1] - laid[1]) < 24) return;
      laid = now;
      layField(host, mixed, false);
    }, 160);
  }).observe(host);
}

/**
 * A band of hats over `host`, as the web interface lays one behind a page's header, in the pattern
 * its `data-band` names (`paintOf`): every tile filled and outlined, lit from the upper right and
 * darkening towards the foot, where the title stands. With `data-foot` it is the field under a
 * dialog's buttons instead: hats of the interface's 38 px, none darkened. Band `n` is cut from its own
 * part of the patch, so no two look alike.
 */
function layBand(host, n) {
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
function bands() {
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

/** The tour's tabs: click, or the arrow keys, Home and End, as a tab list does. */
function tabs() {
  for (const root of document.querySelectorAll('[data-tabs]')) {
    const buttons = [...root.querySelectorAll('[role=tab]')];
    if (!buttons.length) continue;
    const select = (button, focus) => {
      for (const other of buttons) {
        const selected = other === button;
        other.setAttribute('aria-selected', String(selected));
        other.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      }
      if (focus) button.focus();
    };
    for (const button of buttons) {
      button.addEventListener('click', () => select(button, false));
      button.addEventListener('keydown', (event) => {
        const at = buttons.indexOf(button);
        const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: buttons.length - 1 }[event.key];
        if (to === undefined) return;
        event.preventDefault();
        select(buttons[(to + buttons.length) % buttons.length], true);
      });
    }
    select(buttons.find((b) => b.getAttribute('aria-selected') === 'true') ?? buttons[0], false);
  }
}

/**
 * The install commands' copy buttons: each copies its command as the page shows it, and where the
 * clipboard is refused, selects it for the visitor to copy. A status beside it says which.
 */
function copyButtons() {
  for (const button of document.querySelectorAll('[data-copy]')) {
    const code = button.parentElement.querySelector('code');
    const status = button.parentElement.querySelector('[role=status]');
    if (!code) continue;
    const command = () => code.textContent.replace(/^\$\s*/, '');
    const say = (text) => {
      button.textContent = text;
      if (status) status.textContent = text;
    };
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(command());
        say('Copied');
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code.lastChild);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        say('Press Ctrl+C');
      }
      setTimeout(() => (button.textContent = 'Copy'), 1800);
    });
  }
}

/**
 * The screenshots' viewer: a card opens its shot large in the dialog, with its title and text, and
 * the arrow keys (or the buttons) step through every shot on the page. Without script a card is a
 * link to its image.
 */
function viewer() {
  const dialog = document.querySelector('.viewer');
  const cards = [...document.querySelectorAll('[data-shot]')];
  if (!dialog || !cards.length) return;
  const image = dialog.querySelector('img');
  const [title, text] = dialog.querySelectorAll('figcaption > *');
  let at = 0;
  const show = (index) => {
    at = (index + cards.length) % cards.length;
    const card = cards[at];
    const item = card.closest('li');
    image.src = card.href;
    image.width = card.dataset.width;
    image.height = card.dataset.height;
    image.alt = card.querySelector('img').alt;
    title.textContent = item.querySelector('h4').textContent;
    text.textContent = item.querySelector('p').textContent;
  };
  cards.forEach((card, index) =>
    card.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      show(index);
      dialog.showModal();
    })
  );
  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.viewer-prev').addEventListener('click', () => show(at - 1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => show(at + 1));
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(at - 1);
    if (event.key === 'ArrowRight') show(at + 1);
  });
  // A click on the dark around the picture closes it, as Escape does.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.tagName === 'FIGURE') dialog.close();
  });
}

/** Where the banner and the top bar over the page end; both are fixed, so this does not change on a scroll. */
function barBottom() {
  return document.querySelector('.bar')?.getBoundingClientRect().bottom ?? 60;
}

/**
 * The top bar: an edge once the page has scrolled, and its link to the chapter in view marked
 * (`aria-current`), the chapter being the last whose start has passed a third of the way down. On a
 * phone its links are a menu (site.css), which a chapter's link, Escape, a tap outside it or a wider
 * window closes again.
 */
function bar() {
  const header = document.querySelector('.bar');
  if (!header) return;
  const links = [...header.querySelectorAll('nav a')];
  const starts = links.map((link) => document.querySelector(link.hash));
  const update = () => {
    header.toggleAttribute('data-scrolled', scrollY > 8);
    const line = innerHeight / 3;
    const at = starts.findLastIndex((start) => start && start.getBoundingClientRect().top <= line);
    links.forEach((link, i) => i === at ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current'));
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

// Each part on its own, so one that fails leaves the others working.
for (const part of [tabs, copyButtons, bar, viewer, bands, field]) {
  Promise.resolve().then(part).catch((error) => console.error(error));
}
