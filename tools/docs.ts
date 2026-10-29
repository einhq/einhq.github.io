#!/usr/bin/env -S deno run --allow-read=. --allow-write=docs
/**
 * Builds the documentation served at einhq.eu/docs: each page docs/SUMMARY.md lists, from its Markdown
 * under docs/ to an HTML file beside it, and docs/search.json, the index the pages' search reads.
 *
 *   deno task docs            write the pages
 *   deno task docs --check    write nothing; fail when a page is stale
 *
 * Either way it fails on a broken link: a page, file or heading that is not there, or a link to the
 * site's root, which the in-app documentation's links are and the site's never are. It fails too on a
 * Markdown file SUMMARY.md leaves out, and in --check on an HTML file no page writes.
 *
 * The Markdown reads on a forge as it does here: links between pages name the .md files, which become
 * .html, a diagram is an SVG under docs/diagrams/, inlined into the HTML so it is drawn in the page's
 * own fonts, and a callout is GitHub's `> [!NOTE]`.
 */
import { parseArgs } from '@std/cli/parse-args';
import { dirname, join, normalize, relative } from '@std/path';
import { Marked, Renderer, type Token, type Tokens } from 'marked';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import ini from 'highlight.js/lib/languages/ini';
import json from 'highlight.js/lib/languages/json';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import yaml from 'highlight.js/lib/languages/yaml';

const DOCS = 'docs';
const SITE = 'https://einhq.eu';
const SOURCE = 'https://github.com/einhq/einhq.github.io/blob/main';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('typescript', typescript);
/** A code block's language as written after the fence, to the grammar that colours it; others are left plain. */
const LANGUAGES: Record<string, string> = {
  bash: 'bash',
  sh: 'bash',
  console: 'shell',
  json: 'json',
  jsonc: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  ini: 'ini',
  env: 'ini',
  dotenv: 'ini',
  ts: 'typescript',
  typescript: 'typescript',
};

const ALERTS: Record<string, string> = { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' };

type Entry = { title: string; path: string; section: string; depth: number };
type Section = { title: string; part: string; pages: Entry[] };
type Heading = { id: string; text: string; depth: number };
type Link = { from: string; target: string; hash: string; raw: string };
type Page = Entry & {
  html: string;
  description: string;
  headings: Heading[];
  ids: Set<string>;
  links: Link[];
};

const flags = parseArgs(Deno.args, { boolean: ['check'] });
const problems: string[] = [];

// --- the contents ---

/**
 * docs/SUMMARY.md, in mdBook's form: a link before any heading is a page outside the sections (the
 * welcome page), each `#` heading a part that groups the sections after it (Core, then the
 * modules), each `##` heading a section of the sidebar, and each list item under it a page,
 * indented two spaces for a page under the one above.
 */
function contents(text: string): { sections: Section[]; pages: Entry[] } {
  const sections: Section[] = [{ title: '', part: '', pages: [] }];
  let part = '';
  for (const line of text.split('\n')) {
    const heading = line.match(/^(#{1,2})\s+(.+)$/);
    if (heading?.[1] === '#') {
      // The file's own title, "# Contents", comes before any section and names no part.
      if (sections.length > 1 || sections[0].pages.length) part = heading[2].trim();
      continue;
    }
    if (heading) {
      sections.push({ title: heading[2].trim(), part, pages: [] });
      continue;
    }
    const item = line.match(/^(\s*)(?:[-*]\s+)?\[([^\]]+)\]\(([^)]+\.md)\)\s*$/);
    if (!item) continue;
    const current = sections.at(-1)!;
    current.pages.push({ title: item[2], path: normalize(item[3]), section: current.title, depth: Math.floor(item[1].length / 2) });
  }
  return { sections: sections.filter((s) => s.pages.length), pages: sections.flatMap((s) => s.pages) };
}

// --- rendering one page ---

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A heading's plain text, from its inline tokens: what its anchor is made of and what the outline shows. */
function plain(tokens: Token[] | undefined): string {
  return (tokens ?? []).map((t) => {
    if ('tokens' in t && t.tokens) return plain(t.tokens);
    if (t.type === 'codespan' || t.type === 'text' || t.type === 'escape') return (t as Tokens.Text).text;
    return '';
  }).join('');
}

/** A heading's anchor as GitHub makes it, so a link to `page.md#heading` works on the forge and here. */
function slugger() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = text.toLowerCase().trim().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}

/** Width and height of a PNG or WebP, from its header, so the page keeps the image's room while it loads. */
function imageSize(bytes: Uint8Array): { width: number; height: number } | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (at: number, n: number) => String.fromCharCode(...bytes.subarray(at, at + n));
  if (tag(1, 3) === 'PNG') return { width: view.getUint32(16), height: view.getUint32(20) };
  if (tag(0, 4) !== 'RIFF' || tag(8, 4) !== 'WEBP') return undefined;
  const chunk = tag(12, 4);
  if (chunk === 'VP8 ') return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = view.getUint32(21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') {
    const u24 = (at: number) => bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16);
    return { width: u24(24) + 1, height: u24(27) + 1 };
  }
  return undefined;
}

const exists = (path: string) => {
  try {
    return Deno.statSync(path).isFile;
  } catch {
    return false;
  }
};

/**
 * An SVG drawn into the page: its ids (and what refers to them) prefixed with `prefix`, so two
 * diagrams on one page keep their own gradients and markers, and labelled with `alt` for a screen
 * reader. The diagram's own width and height give way to the page's CSS.
 */
function inlineSvg(source: string, prefix: string, alt: string): string {
  let svg = source.replace(/<\?xml[^>]*\?>/, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  const ids = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    const quoted = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    svg = svg
      .replace(new RegExp(`(\\sid=")${quoted}"`, 'g'), `$1${prefix}-${id}"`)
      .replace(new RegExp(`url\\(#${quoted}\\)`, 'g'), `url(#${prefix}-${id})`)
      .replace(new RegExp(`((?:xlink:)?href=")#${quoted}"`, 'g'), `$1#${prefix}-${id}"`);
  }
  return svg.replace(/<svg\b([^>]*)>/, (_, attributes: string) => {
    const kept = attributes.replace(/\s(width|height|role|aria-label)="[^"]*"/g, '');
    return `<svg${kept} role="img" aria-label="${escape(alt)}">`;
  });
}

function render(entry: Entry, markdown: string): Page {
  const file = join(DOCS, entry.path);
  const dir = dirname(file);
  const slug = slugger();
  const headings: Heading[] = [];
  const ids = new Set<string>();
  const links: Link[] = [];
  let svgs = 0;

  const marked = new Marked({ gfm: true });
  const base = new Renderer();
  marked.use({
    renderer: {
      heading(this: Renderer, token: Tokens.Heading) {
        const text = plain(token.tokens);
        const id = slug(text);
        ids.add(id);
        const inner = this.parser.parseInline(token.tokens);
        if (token.depth === 1) return `<h1 id="${id}">${inner}</h1>\n`;
        if (token.depth <= 3) headings.push({ id, text, depth: token.depth });
        return `<h${token.depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Link to this section"></a></h${token.depth}>\n`;
      },
      link(this: Renderer, token: Tokens.Link) {
        const inner = this.parser.parseInline(token.tokens);
        const title = token.title ? ` title="${escape(token.title)}"` : '';
        const href = token.href;
        if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return `<a href="${escape(href)}"${title}>${inner}</a>`;
        if (href.startsWith('/')) {
          problems.push(`${file}: link to the site's root, ${href}: link to the page's file instead`);
          return `<a href="${escape(href)}"${title}>${inner}</a>`;
        }
        const [path, hash = ''] = href.split('#');
        const target = path ? normalize(join(dir, decodeURIComponent(path))) : file;
        links.push({ from: file, target, hash, raw: href });
        const out = path.endsWith('.md') ? path.replace(/\.md$/, '.html') : path;
        return `<a href="${escape(out)}${hash ? `#${escape(hash)}` : ''}"${title}>${inner}</a>`;
      },
      image(token: Tokens.Image) {
        const path = normalize(join(dir, decodeURIComponent(token.href)));
        const caption = token.title ? `<figcaption>${marked.parseInline(token.title)}</figcaption>` : '';
        if (!exists(path)) {
          problems.push(`${file}: no image ${token.href}`);
          return '';
        }
        if (path.endsWith('.svg')) {
          svgs += 1;
          const prefix = `${entry.path.replace(/\W+/g, '-')}-${svgs}`;
          return `<figure class="diagram">${inlineSvg(Deno.readTextFileSync(path), prefix, token.text)}${caption}</figure>`;
        }
        const size = imageSize(Deno.readFileSync(path));
        const double = path.replace(/(\.\w+)$/, '@2x$1');
        const srcset = exists(double) ? ` srcset="${escape(token.href)} 1x, ${escape(token.href.replace(/(\.\w+)$/, '@2x$1'))} 2x"` : '';
        const dims = size ? ` width="${size.width}" height="${size.height}"` : '';
        return `<figure class="shot"><a href="${escape(exists(double) ? token.href.replace(/(\.\w+)$/, '@2x$1') : token.href)}">` +
          `<img src="${escape(token.href)}"${srcset} alt="${escape(token.text)}"${dims} loading="lazy" decoding="async"></a>${caption}</figure>`;
      },
      paragraph(this: Renderer, token: Tokens.Paragraph) {
        // A paragraph that is only an image is a figure, which a <p> may not hold.
        const meaningful = token.tokens.filter((t) => !(t.type === 'text' && !t.raw.trim()));
        if (meaningful.length === 1 && meaningful[0].type === 'image') return this.parser.parseInline(token.tokens) + '\n';
        return `<p>${this.parser.parseInline(token.tokens)}</p>\n`;
      },
      blockquote(this: Renderer, token: Tokens.Blockquote) {
        const alert = token.text.match(/^\[!(\w+)\][^\S\n]*\n?/);
        if (!alert || !ALERTS[alert[1]]) return `<blockquote>\n${this.parser.parse(token.tokens)}</blockquote>\n`;
        const body = marked.lexer(token.text.slice(alert[0].length));
        return `<aside class="callout callout-${alert[1].toLowerCase()}"><p class="callout-title">${ALERTS[alert[1]]}</p>\n` +
          `${this.parser.parse(body)}</aside>\n`;
      },
      code(token: Tokens.Code) {
        const lang = (token.lang ?? '').trim().split(/\s/)[0].toLowerCase();
        const grammar = LANGUAGES[lang];
        const body = grammar ? hljs.highlight(token.text, { language: grammar }).value : escape(token.text);
        const label = lang && lang !== 'text' ? ` data-lang="${escape(lang)}"` : '';
        return `<div class="code"${label}><pre tabindex="0"><code>${body}</code></pre></div>\n`;
      },
      table(this: Renderer, token: Tokens.Table) {
        return `<div class="table-scroll" role="region" tabindex="0">${base.table.call(this, token)}</div>\n`;
      },
    },
  });

  const tokens = marked.lexer(markdown);
  const h1 = tokens.findIndex((t) => t.type === 'heading' && (t as Tokens.Heading).depth === 1);
  const titleToken = h1 >= 0 ? tokens.splice(h1, 1)[0] as Tokens.Heading : undefined;
  if (!titleToken) problems.push(`${file}: no # title`);
  const first = tokens.find((t) => t.type === 'paragraph') as Tokens.Paragraph | undefined;
  const description = first ? plain(first.tokens).replace(/\s+/g, ' ').trim() : '';
  const html = marked.parser(tokens);
  return {
    ...entry,
    title: titleToken ? plain(titleToken.tokens) : entry.title,
    html,
    description,
    headings,
    ids,
    links,
  };
}

// --- the page around it ---

/** The site's root from a page at `path` under docs/, as a relative URL that works on a forge's preview as on the site. */
const rootOf = (path: string) => '../'.repeat(path.split('/').length);

function sidebar(sections: Section[], current: Page, root: string): string {
  const href = (p: Entry) => relative(dirname(join(DOCS, current.path)), join(DOCS, p.path)).replace(/\.md$/, '.html');
  const item = (p: Entry) => `<li${p.depth ? ' class="nested"' : ''}><a href="${href(p)}"${p.path === current.path ? ' aria-current="page"' : ''}>${escape(p.title)}</a></li>`;
  return sections.map((s, i) =>
    (s.part && s.part !== sections[i - 1]?.part ? `<p class="docs-part">${escape(s.part)}</p>` : '') +
    (s.title
      ? `<section${s.pages.some((p) => p.path === current.path) ? ' class="here"' : ''}><h2>${escape(s.title)}</h2><ul>${s.pages.map(item).join('')}</ul></section>`
      : `<ul class="top">${s.pages.map(item).join('')}</ul>`)
  ).join('\n') + `\n<p class="side-foot"><a href="${root}">einhq.eu</a> · <a href="https://github.com/einhq">GitHub</a></p>`;
}

function outline(page: Page): string {
  // A long reference page lists its letters or groups, not every entry under them.
  const all = page.headings.filter((h) => h.depth <= 3);
  const items = all.length > 40 ? all.filter((h) => h.depth === 2) : all;
  if (items.length < 2) return '';
  return `<aside class="docs-toc" aria-labelledby="toc-title"><p id="toc-title">On this page</p><ul>` +
    items.map((h) => `<li${h.depth === 3 ? ' class="nested"' : ''}><a href="#${h.id}">${escape(h.text)}</a></li>`).join('') +
    `</ul></aside>`;
}

function neighbours(order: Page[], page: Page): string {
  const at = order.indexOf(page);
  const href = (p: Page) => relative(dirname(join(DOCS, page.path)), join(DOCS, p.path)).replace(/\.md$/, '.html');
  const link = (p: Page | undefined, rel: string, label: string) =>
    p ? `<a class="${rel}" href="${href(p)}" rel="${rel}"><span>${label}</span>${escape(p.title)}</a>` : '<span></span>';
  return `<nav class="pager" aria-label="Previous and next page">${link(order[at - 1], 'prev', 'Previous')}${link(order[at + 1], 'next', 'Next')}</nav>`;
}

function document(page: Page, order: Page[], sections: Section[]): string {
  const root = rootOf(page.path);
  const url = `${SITE}/docs/${page.path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')}`;
  const title = page.path === 'index.md' ? 'EiN documentation' : `${page.title} – EiN documentation`;
  const description = escape(page.description || 'How to install, run and use EiN.');
  const crumb = page.section ? `<p class="crumb">${escape(page.section)}</p>` : '';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escape(title)}</title>
    <meta name="description" content="${description}">
    <meta name="theme-color" content="#12151c">
    <meta name="color-scheme" content="dark">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${escape(title)}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${SITE}/assets/og.jpg">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="EiN">
    <meta property="og:url" content="${url}">
    <link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${root}assets/icon-180.png">
    <link rel="preload" href="${root}assets/fonts/familjen-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${root}assets/site.css">
    <link rel="stylesheet" href="${root}assets/docs.css">
    <script type="module" src="${root}assets/docs.js"></script>
  </head>
  <body class="docs" data-search="${root}docs/search.json">
    <a class="skip" href="#main">Skip to the content</a>

    <p class="notice">
      <strong>Work in progress</strong>
      <span class="notice-long">EiN runs, but nothing is released yet: the installer builds it from source, and what these pages describe may change.</span>
      <span class="notice-short">Nothing is released yet.</span>
    </p>

    <header class="bar" data-strip>
      <div class="bar-hats" aria-hidden="true"></div>
      <a class="brand" href="${root}" aria-label="EiN, the presentation page">
        <img src="${root}assets/favicon.svg" alt="" width="26" height="26">
        <span>EiN</span>
      </a>
      <nav id="chapters" aria-label="Chapters">
        <a class="ch-core" href="${root}#top">Core</a>
        <a class="ch-assistant" href="${root}#assistant">Assistant</a>
        <a class="ch-archive" href="${root}#archive">Archive</a>
        <a class="ch-screenshots" href="${root}#screenshots">Screenshots</a>
        <a class="ch-start" href="${root}#start">Getting started</a>
        <a class="ch-docs" href="${root}docs/" aria-current="true">Docs</a>
      </nav>
      <a class="bar-source" href="https://github.com/einhq">
        <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="${GITHUB}" />
        </svg>
        <span class="bar-source-label">GitHub</span>
      </a>
      <button class="bar-menu" type="button" aria-label="Chapters" aria-controls="chapters" aria-expanded="false" hidden><span></span></button>
    </header>

    <div class="docs-layout">
      <div class="docs-band" data-band="mixed" data-jagged aria-hidden="true"></div>
      <aside class="docs-side" id="docs-side" aria-label="Documentation">
        <form class="docs-search" role="search" action="https://duckduckgo.com/" method="get">
          <label class="visually-hidden" for="docs-q">Search the documentation</label>
          <input id="docs-q" name="q" type="search" placeholder="Search the docs" autocomplete="off" spellcheck="false">
          <input type="hidden" name="sites" value="einhq.eu">
          <kbd aria-hidden="true">/</kbd>
          <div class="docs-results" role="listbox" aria-label="Results" hidden></div>
        </form>
        <nav class="docs-nav" aria-label="Pages">
${sidebar(sections, page, root)}
        </nav>
      </aside>

      <main id="main" class="docs-main">
        <button class="docs-menu" type="button" aria-controls="docs-side" aria-expanded="false" hidden>Contents<span class="docs-menu-page">${
    escape(page.title)
  }</span></button>
        <header class="docs-head">
          ${crumb}
          <h1>${escape(page.title)}</h1>
        </header>
        <article class="prose">
${page.html}
        </article>
        <footer class="docs-foot">
          ${neighbours(order, page)}
          <p class="page-source"><a href="${SOURCE}/docs/${page.path}">This page's source</a> · <a href="${root}">einhq.eu</a></p>
        </footer>
      </main>
      ${outline(page)}
    </div>
  </body>
</html>
`;
}

/** GitHub's mark, as Primer's Octicons (MIT) draw it; the presentation page draws the same. */
const GITHUB =
  'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z';

// --- the search index ---

/**
 * The page cut at its h2 and h3 headings, each part as plain text: what a search matches and where a
 * result leads. Diagrams are left out, their captions kept.
 */
function searchEntry(page: Page) {
  const url = `docs/${page.path.replace(/\.md$/, '.html')}`;
  const text = (html: string) =>
    html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const parts = page.html.split(/(?=<h[23] id=")/);
  return {
    u: url,
    t: page.title,
    s: page.section,
    p: parts.map((part) => {
      const heading = part.match(/^<h[23] id="([^"]+)">([\s\S]*?)<\/h[23]>/);
      return heading ? { a: heading[1], h: text(heading[2]), x: text(part.slice(heading[0].length)) } : { a: '', h: '', x: text(part) };
    }).filter((p) => p.h || p.x),
  };
}

// --- the build ---

function walk(dir: string, ext: string): string[] {
  const out: string[] = [];
  for (const entry of Deno.readDirSync(dir)) {
    const path = join(dir, entry.name);
    if (entry.isDirectory) out.push(...walk(path, ext));
    else if (entry.name.endsWith(ext)) out.push(path);
  }
  return out.sort();
}

const { sections, pages: entries } = contents(Deno.readTextFileSync(join(DOCS, 'SUMMARY.md')));
const seen = new Set<string>();
for (const entry of entries) {
  if (seen.has(entry.path)) problems.push(`${DOCS}/SUMMARY.md: ${entry.path} is listed twice`);
  seen.add(entry.path);
}
for (const file of walk(DOCS, '.md')) {
  const path = relative(DOCS, file);
  if (path !== 'SUMMARY.md' && path !== 'README.md' && !seen.has(path)) problems.push(`${file}: not in SUMMARY.md`);
}

const pages = entries.filter((e) => {
  if (exists(join(DOCS, e.path))) return true;
  problems.push(`${DOCS}/SUMMARY.md: no page ${e.path}`);
  return false;
}).map((e) => render(e, Deno.readTextFileSync(join(DOCS, e.path))));

const byFile = new Map(pages.map((p) => [join(DOCS, p.path), p]));
for (const page of pages) {
  for (const link of page.links) {
    if (link.target.endsWith('.md')) {
      const target = byFile.get(link.target);
      if (!target) problems.push(`${link.from}: link to ${link.raw}, which is no page`);
      else if (link.hash && !target.ids.has(link.hash)) problems.push(`${link.from}: link to ${link.raw}, which has no heading #${link.hash}`);
    } else if (link.target === link.from) {
      if (link.hash && !page.ids.has(link.hash)) problems.push(`${link.from}: link to #${link.hash}, which this page has no heading for`);
    } else if (!exists(link.target) && !exists(join(link.target, 'index.html'))) {
      problems.push(`${link.from}: link to ${link.raw}, which is no file`);
    }
  }
}

const outputs = new Map<string, string>();
for (const page of pages) outputs.set(join(DOCS, page.path.replace(/\.md$/, '.html')), document(page, pages, sections));
outputs.set(join(DOCS, 'search.json'), JSON.stringify(pages.map(searchEntry)) + '\n');

const stale: string[] = [];
for (const [path, content] of outputs) {
  let current: string | undefined;
  try {
    current = Deno.readTextFileSync(path);
  } catch {
    current = undefined;
  }
  if (current === content) continue;
  stale.push(path);
  if (!flags.check) {
    Deno.mkdirSync(dirname(path), { recursive: true });
    Deno.writeTextFileSync(path, content);
  }
}
const orphans = walk(DOCS, '.html').filter((path) => !outputs.has(path));
for (const path of orphans) {
  if (flags.check) problems.push(`${path}: no page writes it`);
  else Deno.removeSync(path);
}

if (flags.check && stale.length) problems.push(...stale.map((path) => `${path}: stale, run make docs`));
for (const problem of problems) console.error(problem);
if (!flags.check) console.log(`${pages.length} pages, ${stale.length} written, ${orphans.length} removed`);
if (problems.length) Deno.exit(1);
