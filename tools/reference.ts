#!/usr/bin/env -S deno run --allow-read=. --allow-write=docs
/**
 * Writes the documentation's reference pages under docs/reference/ from what a running EiN says about
 * itself, as `make reference` fetches it into build/reference/:
 *
 *   commands.json     JSON_OUTPUT=1 docs commands      every command, with its spec and module
 *   settings.json     JSON_OUTPUT=1 config list        every setting, as an administrator sees them
 *   environment.json  JSON_OUTPUT=1 docs env           the environment variables EiN describes
 *   node-types.json   JSON_OUTPUT=1 docs node-types    every node type
 *
 * Only what describes EiN is kept: a setting's default, never its value on that instance, and no
 * variable that instance has set without describing it. The pages are as good as the instance's
 * modules are complete, so take them from one running every module (`mod list`).
 */
import { dirname, join } from '@std/path';

const IN = 'build/reference';
const OUT = 'docs/reference';

/** Where a module's command page lives: core's among the reference pages, each module's in its own part. */
const commandsPath = (module: string) => (module === 'core' ? 'commands-core.md' : `../${module}/commands.md`);

type Arg = { name: string; type?: string; description?: string; optional?: boolean; variadic?: boolean; repeatable?: boolean; choices?: string[] };
type Flag = { name: string; short?: string; type?: string; description?: string; repeatable?: boolean };
type Spec = {
  name: string;
  description?: string;
  admin?: boolean;
  guest?: boolean;
  effect?: string;
  json?: boolean;
  args?: Arg[];
  flags?: Flag[];
  examples?: string[];
  returns?: string;
  daemon?: boolean;
};
type Command = { name: string; module: string; spec: Spec };
type Setting = {
  key: string;
  scope: 'system' | 'user';
  type: string;
  default?: string;
  label?: string;
  description?: string;
  group?: string;
  owner?: string;
  choices?: string[];
  restarts?: string[];
  restartNote?: string;
  emptyMeans?: string;
};
type EnvVar = { key: string; kind: string; description?: string; default?: string; owner?: string; undescribed?: boolean };
type NodeType = { type: string; label: string; description: string; category: string; root?: string; owner?: string };

const read = <T>(name: string): T => JSON.parse(Deno.readTextFileSync(join(IN, name)));
const GENERATED = (from: string) => `<!-- Written by tools/reference.ts from \`${from}\` on a running EiN: make reference, never by hand. -->\n`;

/** Text from a spec for a Markdown line: no line breaks, and nothing read as a table's column. */
const inline = (text = '') => text.replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|').trim();
const sentence = (text = '') => {
  const t = inline(text);
  return t && !/[.!?:)]$/.test(t) ? `${t}.` : t;
};
const code = (text: string) => (text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``);

const MODULES: Record<string, string> = {
  core: 'Core',
  archive: 'Archive',
  assistant: 'Assistant',
  ems: 'Media service',
};

/** Modules that are not published, which the public documentation leaves out even when the EiN it is made from has them. */
const UNPUBLISHED = new Set(['importer']);
const published = (module = 'core') => !UNPUBLISHED.has(module);
const moduleName = (m: string) => MODULES[m] ?? m[0].toUpperCase() + m.slice(1);

// --- commands ---

function flagName(f: Flag): string {
  const dash = f.name.length === 1 ? `-${f.name}` : `--${f.name}`;
  if (f.type === 'bool' || f.type === undefined) return dash;
  return f.name.length === 1 ? `${dash} <${f.type}>` : `${dash}=<${f.type}>`;
}

function argName(a: Arg): string {
  const name = `<${a.name}>${a.variadic || a.repeatable ? '...' : ''}`;
  return a.optional ? `[${name}]` : name;
}

function usage(c: Command): string {
  const flags = (c.spec.flags ?? []).map((f) => `[${flagName(f)}]`);
  const args = (c.spec.args ?? []).map(argName);
  return [c.name, ...flags, ...args].join(' ');
}

function commandSection(c: Command): string {
  const s = c.spec;
  const tags = [
    s.admin ? 'administrators only' : '',
    s.guest ? 'visitors too' : '',
    s.effect === 'write' ? 'changes things' : s.effect === 'read' ? 'reads only' : '',
    s.json ? 'answers JSON with `JSON_OUTPUT=1`' : '',
  ].filter(Boolean);
  const out = [`### ${code(c.name)}`, '', sentence(s.description) || '_Not described._', ''];
  if (tags.length) out.push(`<small>${tags.join(' · ')}</small>`, '');
  out.push('```text', usage(c), '```', '');
  if (s.args?.length) {
    out.push('| Argument | What it is |', '| --- | --- |');
    for (const a of s.args) {
      const choices = a.choices?.length ? ` One of ${a.choices.map(code).join(', ')}.` : '';
      out.push(`| ${code(argName(a))} | ${sentence(a.description)}${choices} |`);
    }
    out.push('');
  }
  if (s.flags?.length) {
    out.push('| Option | What it does |', '| --- | --- |');
    for (const f of s.flags) out.push(`| ${code(flagName(f))}${f.short ? `, ${code(`-${f.short}`)}` : ''} | ${sentence(f.description)} |`);
    out.push('');
  }
  if (s.examples?.length) out.push('```bash', ...s.examples, '```', '');
  if (s.returns) out.push(`With \`JSON_OUTPUT=1\`: ${sentence(s.returns)}`, '');
  return out.join('\n');
}

function commandPage(module: string, commands: Command[]): string {
  const letters = new Map<string, Command[]>();
  for (const c of commands) {
    const letter = /[a-z]/i.test(c.name[0]) ? c.name[0].toUpperCase() : '#';
    letters.set(letter, [...(letters.get(letter) ?? []), c]);
  }
  const title = module === 'core' ? 'Core commands' : `${moduleName(module)} commands`;
  const intro = module === 'core'
    ? 'The commands every EiN has, whatever modules it runs.'
    : `The commands the ${moduleName(module).toLowerCase()} module adds. They are there once the module is installed.`;
  const out = [
    GENERATED('docs commands'),
    `# ${title}`,
    '',
    `${intro} ${commands.length} of them, by name. Every command also says this with \`--help\`; [Commands](${
      module === 'core' ? '' : '../reference/'
    }commands.md) explains how to read an entry.`,
    '',
    commands.map((c) => `[${c.name}](#${c.name.toLowerCase().replace(/[^a-z0-9_-]/g, '')})`).join(' · '),
    '',
  ];
  for (const [letter, group] of letters) {
    out.push(`## ${letter}`, '');
    for (const c of group) out.push(commandSection(c));
  }
  return out.join('\n');
}

function commandIndex(commands: Command[], modules: string[]): string {
  const out = [
    GENERATED('docs commands'),
    '# Commands',
    '',
    `Every command an EiN with all its modules has: ${commands.length} of them. Each module's page describes its commands in full; this page lists them by what they are for, in a line each.`,
    '',
    '## Reading an entry',
    '',
    'Each command is shown with how it is typed:',
    '',
    '```text',
    'share-link [--expires=<string>] [--never] [--session] <subcommand> <target>',
    '```',
    '',
    '- `<target>` is something you give, `[...]` may be left out, and `...` may be given more than once.',
    '- `--name=<value>` takes a value after an equals sign, which a value starting with a minus needs (`--lng=-3.7`); `-x` is a short option.',
    '- _administrators only_ marks a command only the administrator may run; _visitors too_, one a visitor browsing without signing in may run.',
    '- _answers JSON_ marks a command whose answer comes as JSON with `JSON_OUTPUT=1` in front of it, which is what the web interface reads.',
    '',
    'A command of a family, such as `mod-install` or `user-passwd`, can be typed as two words where the family has a command of its own: `mod install archive`. ' +
    'In the shell, `<command> --help` says the same as these pages, for what is installed there; the documentation page in the web interface has them too.',
    '',
  ];
  for (const module of modules) {
    const own = commands.filter((c) => c.module === module);
    out.push(`## ${moduleName(module)}`, '', `[All ${own.length} in full](${commandsPath(module)}).`, '', '| Command | What it does |', '| --- | --- |');
    for (const c of own) out.push(`| [${c.name}](${commandsPath(module)}#${c.name.toLowerCase().replace(/[^a-z0-9_-]/g, '')}) | ${sentence(c.spec.description)} |`);
    out.push('');
  }
  return out.join('\n');
}

// --- settings ---

const SCOPES = { system: 'Everyone (an administrator sets it)', user: 'Each person (Profile → Preferences)' };

function settingsPage(settings: Setting[]): string {
  const groups = new Map<string, Setting[]>();
  for (const s of settings) groups.set(s.group ?? 'Other', [...(groups.get(s.group ?? 'Other') ?? []), s]);
  const out = [
    GENERATED('config list'),
    '# Settings',
    '',
    `Every setting of an EiN with all its modules: ${settings.length} of them, in the groups the Settings page shows. [Configuration](../admin/configuration.md) says where each value comes from and how to change it.`,
    '',
    '- **Who it is for**: _everyone_ is a system setting, which only an administrator changes, on Settings → System or with `config set`; _each person_ is a preference everyone sets for themselves, on Profile → Preferences.',
    '- **Default**: the value until someone changes it. A deployment can set another in `.env`, and a module can choose one.',
    '- **Restarts**: the services a change restarts by itself. Work already running is picked up again when they are back.',
    '',
  ];
  for (const [group, list] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    out.push(`## ${group}`, '');
    for (const s of list) {
      out.push(`### ${code(s.key)}`, '', `**${inline(s.label ?? s.key)}**. ${sentence(s.description)}`, '');
      const rows: [string, string][] = [['Who it is for', SCOPES[s.scope] ?? s.scope]];
      const def = s.type === 'secret' ? 'none: a key is set by you, and never shown again' : s.default === undefined || s.default === '' ? 'empty' : code(s.default);
      rows.push(['Default', s.emptyMeans && (s.default ?? '') === '' ? `${def}, which means ${inline(s.emptyMeans)}` : def]);
      if (s.choices?.length) rows.push(['Choices', s.choices.map(code).join(', ')]);
      rows.push(['Kind', s.type === 'secret' ? 'a key: never readable, in no shell' : s.type]);
      if (s.restarts?.length) rows.push(['Restarts', s.restarts.map(code).join(', ')]);
      if (s.restartNote) rows.push(['Takes effect', sentence(s.restartNote)]);
      if (s.owner) rows.push(['From the module', moduleName(s.owner)]);
      out.push('| | |', '| --- | --- |', ...rows.map(([k, v]) => `| ${k} | ${v} |`), '');
    }
  }
  return out.join('\n');
}

// --- environment ---

const KINDS: Record<string, [string, string]> = {
  deployment: [
    'Set by the deployment',
    "Read once, from EiN's own environment, when it starts: `.env` in an installation made with the installer. No shell has them, and none is shown back, since `POSTGRES_URL` carries the database's password.",
  ],
  path: ['Folders in the tree', 'Where the tree keeps each kind of thing, exported for every shell, so `cd $LOGS_PATH` works wherever the folder lives.'],
  system: ['Set by the system', 'What EiN exports for every shell at its start besides the folders: the built-in accounts and the host folders its storage is on.'],
  session: ['Set for each shell', 'Set by the server that opened the shell: the web interface, the terminal panel or SSH.'],
  option: ['Options you set', 'Nobody sets these for you. Export one in a shell, or put it in front of a command, to change how commands behave there: `JSON_OUTPUT=1 ls`.'],
  pipeline: ['Set for a pipeline step', 'Set for each step of a pipeline by the change that started it.'],
};

function environmentPage(vars: EnvVar[]): string {
  const out = [
    GENERATED('docs env'),
    '# Environment variables',
    '',
    'The variables EiN reads or sets, apart from its settings (`CFG_…`), which are on [Settings](settings.md). In the shell, `docs env` lists them with their values there.',
    '',
  ];
  for (const [kind, [title, intro]] of Object.entries(KINDS)) {
    const list = vars.filter((v) => v.kind === kind);
    if (!list.length) continue;
    out.push(`## ${title}`, '', intro, '', '| Variable | Default | What it is |', '| --- | --- | --- |');
    for (const v of list) {
      const owner = v.owner ? ` From the ${moduleName(v.owner).toLowerCase()} module.` : '';
      out.push(`| ${code(v.key)} | ${v.default ? code(inline(v.default)) : ''} | ${sentence(v.description)}${owner} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

// --- node types ---

const CATEGORIES: Record<string, [string, string]> = {
  content: ['Content', 'What the archive is made of: what people add, and what EiN works out about it.'],
  structure: ['Structure', 'How the tree is arranged: folders, links, and what holds other nodes.'],
  system: ['System', 'How EiN runs: its commands, logs, queues and the other parts of the system that are nodes too.'],
};

function nodeTypesPage(types: NodeType[]): string {
  const out = [
    GENERATED('docs node-types'),
    '# Node types',
    '',
    `Every node has a type, which decides what it holds and how it behaves. These are the ${types.length} types of an EiN with all its modules. [Nodes and node types](../concepts/nodes.md) explains what a node is.`,
    '',
  ];
  for (const [category, [title, intro]] of Object.entries(CATEGORIES)) {
    const list = types.filter((t) => t.category === category);
    if (!list.length) continue;
    out.push(`## ${title}`, '', intro, '', '| Type | What it is | Lives under | Module |', '| --- | --- | --- | --- |');
    for (const t of list) out.push(`| ${code(t.type)} ${inline(t.label)} | ${sentence(t.description)} | ${t.root ? code(t.root) : ''} | ${moduleName(t.owner ?? 'core')} |`);
    out.push('');
  }
  return out.join('\n');
}

// --- writing ---

const commands = read<Command[]>('commands.json').filter((c) => published(c.module)).sort((a, b) => a.name.localeCompare(b.name));
const modules = ['core', ...[...new Set(commands.map((c) => c.module))].filter((m) => m !== 'core').sort()];
const settings = read<Setting[]>('settings.json').filter((s) => published(s.owner));
const environment = read<EnvVar[]>('environment.json').filter((v) => !v.undescribed && v.description && published(v.owner));
const nodeTypes = read<NodeType[]>('node-types.json').filter((t) => published(t.owner));

const pages: Record<string, string> = {
  'commands.md': commandIndex(commands, modules),
  'settings.md': settingsPage(settings),
  'environment.md': environmentPage(environment),
  'node-types.md': nodeTypesPage(nodeTypes),
};
for (const module of modules) pages[commandsPath(module)] = commandPage(module, commands.filter((c) => c.module === module));

for (const [name, text] of Object.entries(pages)) {
  const path = join(OUT, name);
  Deno.mkdirSync(dirname(path), { recursive: true });
  Deno.writeTextFileSync(path, text.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
}
console.log(
  `${Object.keys(pages).length} reference pages: ${commands.length} commands, ${settings.length} settings, ${environment.length} variables, ${nodeTypes.length} node types`,
);
