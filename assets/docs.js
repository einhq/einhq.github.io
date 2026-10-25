/**
 * The documentation's pages: the top bar and the band of hats over each page (page.js), and beside
 * them the search, the pages' drawer on a narrow screen, the code blocks' copy buttons and the
 * heading in view marked in the page's outline. Everything works without it: the search falls back
 * to a web search of the site, and the pages' list stays under the page.
 */
import { bands, bar } from './page.js';

// --- search ---

/** Words of a query, lowercased, each at least one letter long. */
const words = (text) => text.toLowerCase().split(/[^\p{L}\p{N}_$-]+/u).filter(Boolean);

/**
 * How well part `p` of a page matches every word of the query: a word in the page's title counts
 * most, then in the part's heading, then in its text; a word that matches nowhere drops the part.
 * A whole-word match counts more than the start of one, which counts more than a match inside one.
 */
function score(page, part, query) {
  const title = page.t.toLowerCase();
  const heading = part.h.toLowerCase();
  const text = part.x.toLowerCase();
  let total = 0;
  for (const word of query) {
    const whole = new RegExp(`(^|[^\\p{L}\\p{N}])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}\\p{N}])`, 'u');
    const weigh = (field, weight) => (whole.test(field) ? weight * 3 : field.includes(word) ? weight : 0);
    const best = Math.max(weigh(title, 10), weigh(heading, 6), weigh(text, 1));
    if (!best) return 0;
    total += best;
  }
  return total + (part.a ? 0 : 0.5);
}

/** Up to ~160 characters of `text` around the first of `query`'s words, with every word marked. */
function snippet(text, query) {
  const lower = text.toLowerCase();
  const at = Math.min(...query.map((w) => lower.indexOf(w)).filter((i) => i >= 0), text.length);
  const start = Math.max(0, at - 50);
  let cut = text.slice(start, start + 160);
  if (start > 0) cut = '…' + cut.slice(cut.indexOf(' ') + 1);
  if (start + 160 < text.length) cut = cut.slice(0, cut.lastIndexOf(' ')) + '…';
  const escaped = cut.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const pattern = new RegExp(`(${query.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return escaped.replace(pattern, '<mark>$1</mark>');
}

function search() {
  const form = document.querySelector('.docs-search');
  const input = form?.querySelector('input[type=search]');
  const list = form?.querySelector('.docs-results');
  if (!form || !input || !list) return;
  const url = document.body.dataset.search;
  const root = new URL(url, location.href).href.replace(/docs\/search\.json$/, '');
  let index;
  let results = [];
  let selected = 0;

  const load = () => (index ??= fetch(url).then((r) => r.json()).catch(() => []));
  input.addEventListener('focus', load, { once: true });

  const show = (items) => {
    results = items;
    selected = 0;
    list.hidden = false;
    if (!items.length) {
      list.innerHTML = '<p class="r-none">Nothing found. Try fewer or other words.</p>';
      return;
    }
    list.innerHTML = items.map((r, i) =>
      `<a href="${r.href}" role="option" id="docs-r-${i}" aria-selected="${i === 0}">` +
      `<span class="r-where">${r.where}</span><span class="r-title">${r.title}</span>` +
      (r.text ? `<span class="r-text">${r.text}</span>` : '') + '</a>'
    ).join('');
    input.setAttribute('aria-activedescendant', 'docs-r-0');
  };
  const close = () => {
    list.hidden = true;
    input.removeAttribute('aria-activedescendant');
  };
  const select = (i) => {
    const links = [...list.querySelectorAll('a')];
    if (!links.length) return;
    selected = (i + links.length) % links.length;
    links.forEach((a, n) => a.setAttribute('aria-selected', String(n === selected)));
    links[selected].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', links[selected].id);
  };

  input.addEventListener('input', async () => {
    const query = words(input.value);
    if (!query.length) return close();
    const pages = await load();
    if (words(input.value).join(' ') !== query.join(' ')) return;
    const scored = [];
    for (const page of pages) {
      for (const part of page.p) {
        const s = score(page, part, query);
        if (s) scored.push({ s, page, part });
      }
    }
    scored.sort((a, b) => b.s - a.s);
    // A page's best part first, and at most three parts of any one page.
    const shown = [];
    const perPage = new Map();
    for (const hit of scored) {
      const n = perPage.get(hit.page.u) ?? 0;
      if (n >= 3) continue;
      perPage.set(hit.page.u, n + 1);
      shown.push({
        href: root + hit.page.u + (hit.part.a ? `#${hit.part.a}` : ''),
        where: [hit.page.s, hit.part.a ? hit.page.t : ''].filter(Boolean).join(' › ').replace(/</g, '&lt;'),
        title: (hit.part.h || hit.page.t).replace(/</g, '&lt;'),
        text: snippet(hit.part.x, query),
      });
      if (shown.length >= 12) break;
    }
    show(shown);
  });
  input.addEventListener('keydown', (event) => {
    if (list.hidden) return;
    if (event.key === 'ArrowDown') select(selected + 1);
    else if (event.key === 'ArrowUp') select(selected - 1);
    else if (event.key === 'Escape') close();
    else return;
    event.preventDefault();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (results.length) location.href = results[selected].href;
  });
  document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) close();
  });
  // `/` or Ctrl+K (⌘K) from anywhere but a field goes to the search, as in EiN's own interface.
  addEventListener('keydown', (event) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '') || document.activeElement?.isContentEditable;
    const slash = event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey;
    const k = event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey);
    if (!slash && !k) return;
    event.preventDefault();
    drawer(true);
    input.focus();
    input.select();
  });
}

// --- the pages' drawer on a narrow screen ---

let drawer = () => {};

function side() {
  const aside = document.querySelector('.docs-side');
  const button = document.querySelector('.docs-menu');
  if (!aside || !button) return;
  const narrow = matchMedia('(max-width: 900px)');
  drawer = (opened) => {
    if (!narrow.matches) return;
    aside.toggleAttribute('data-open', opened);
    button.setAttribute('aria-expanded', String(opened));
    if (opened) aside.querySelector('[aria-current]')?.scrollIntoView({ block: 'center' });
  };
  button.hidden = false;
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    drawer(!aside.hasAttribute('data-open'));
  });
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && aside.hasAttribute('data-open')) {
      drawer(false);
      button.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (aside.hasAttribute('data-open') && !aside.contains(event.target)) drawer(false);
  });
  narrow.addEventListener('change', () => drawer(false));
}

// --- code blocks ---

/**
 * A copy button on every code block: it copies the block's text, without a console's `$ ` prompts,
 * and where the clipboard is refused selects the text for the reader to copy.
 */
function copyButtons() {
  for (const block of document.querySelectorAll('.code')) {
    const code = block.querySelector('code');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy this code');
    block.append(button);
    button.addEventListener('click', async () => {
      const prompt = block.dataset.lang === 'console';
      const text = prompt ? code.textContent.split('\n').filter((l) => l.startsWith('$ ')).map((l) => l.slice(2)).join('\n') : code.textContent.replace(/\n$/, '');
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        button.textContent = 'Press Ctrl+C';
      }
      button.toggleAttribute('data-done', true);
      setTimeout(() => {
        button.textContent = 'Copy';
        button.removeAttribute('data-done');
      }, 1800);
    });
  }
}

// --- the outline ---

/** The outline's link to the last heading whose top has passed a fifth of the way down, marked. */
function outline() {
  const links = [...document.querySelectorAll('.docs-toc a')];
  if (!links.length) return;
  const headings = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  const update = () => {
    const line = innerHeight / 5;
    const at = headings.findLast((h) => h.getBoundingClientRect().top <= line) ?? headings[0];
    for (const a of links) a.hash.slice(1) === at?.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

// Each part on its own, so one that fails leaves the others working.
for (const part of [bar, bands, side, search, copyButtons, outline]) {
  Promise.resolve().then(part).catch((error) => console.error(error));
}
