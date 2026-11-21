import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedTerminalCorePage.css';

// The getting-started guide of Lodestone, an embedded key-value database, in the
// Terminal Core style. VT323, drawn from the DEC VT320 character cell, is what the
// shell prints: the title banner, the headings, the step numbers and the error lines.
// Inconsolata reads the prose and everything typed or printed in a session, so a
// command looks the same in a sentence and at the prompt. Components come from database
// documentation: a terminal whose tabs pick the install method, the quickstart as one
// shell session running down the page beside its steps, a filterable command reference
// with a pasteable example per row, and two real error messages with their fixes.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// Backticks mark code and asterisks a placeholder, so a sentence can name a command.
function rich(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*[^*]+\*)/).map((part, index) => {
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*')) return <var key={index}>{part.slice(1, -1)}</var>;
    return part;
  });
}

// A command's syntax, with <placeholders> set as variables.
function syntax(text: string): ReactNode[] {
  return text.split(/(<[^>]+>)/).map((part, index) => (part.startsWith('<') ? <var key={index}>{part.slice(1, -1)}</var> : part));
}

/** Writes to the clipboard and reports whether it worked. A page served without
    HTTPS has no Clipboard API, so it copies through a selected text area. */
async function writeClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  const focused = document.activeElement;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(area);
  // Selecting the text area took the focus from the button.
  if (focused instanceof HTMLElement) focused.focus();
  return ok;
}

type Version = '0.14.2' | '0.13.4';

const LATEST: Version = '0.14.2';
const VERSIONS: Version[] = ['0.14.2', '0.13.4'];

const RELEASE: Record<Version, { format: number; size: string; python: string }> = {
  '0.14.2': { format: 6, size: '4.1', python: '3.10' },
  '0.13.4': { format: 5, size: '3.8', python: '3.9' },
};

// One line of a shell session: a typed command, a printed line, an error line, or a
// file listed by `cat -n`.
type Line = { ps: string; cmd: string } | { out: string } | { bad: string } | { file: string[] };

const HOME = '~/shop $';
const SHELL = 'shop.db>';

type Method = 'brew' | 'curl' | 'cargo' | 'pip';

const METHODS: Method[] = ['brew', 'curl', 'cargo', 'pip'];

// What each install method types and prints. The installer script's host is a reserved
// example domain, so a copied command can never fetch someone else's script.
function install(method: Method, version: Version): { cmd: string; out: string[] } {
  const latest = version === LATEST;
  const size = RELEASE[version].size;
  if (method === 'brew') {
    const formula = latest ? 'lodestone' : 'lodestone@0.13';
    return {
      cmd: `brew install ${formula}`,
      out: [`==> Pouring ${formula}--${version}.arm64_sequoia.bottle.tar.gz`, `/opt/homebrew/Cellar/${formula}/${version}: 9 files, ${size}MB`],
    };
  }
  if (method === 'curl') {
    return {
      cmd: `curl -fsSL https://lodestone.example/install.sh | sh${latest ? '' : ` -s -- --version ${version}`}`,
      out: [`Downloaded lode ${version} for macOS arm64 (${size} MB), checksum OK`, 'Installed lode to ~/.local/bin/lode'],
    };
  }
  if (method === 'cargo') {
    return {
      cmd: `cargo install lodestone${latest ? '' : ` --version ${version}`}`,
      out: [`   Compiling lodestone v${version}`, `   Installed package \`lodestone v${version}\` (executable \`lode\`)`],
    };
  }
  return {
    cmd: `pip install lodestone${latest ? '' : `==${version}`}`,
    out: [`Downloading lodestone-${version}-cp39-abi3-macosx_11_0_arm64.whl (1.6 MB)`, `Successfully installed lodestone-${version}`],
  };
}

const BAR = {
  nav: { en: 'This guide', ko: 'This guide', ja: 'This guide' },
  quick: { en: 'Quickstart', ko: 'Quickstart', ja: 'Quickstart' },
  commands: { en: 'Commands', ko: 'Commands', ja: 'Commands' },
  wrong: { en: 'Troubleshooting', ko: 'Troubleshooting', ja: 'Troubleshooting' },
  version: { en: 'Version', ko: 'Version', ja: 'Version' },
  older: {
    en: 'This is the guide for Lodestone {old}. The current release is {latest}: it adds `count` and file format 6, and it opens files made by 0.13, but 0.13 cannot open files written by 0.14.',
    ko: 'This is the guide for Lodestone {old}. The current release is {latest}: it adds `count` and file format 6, and it opens files made by 0.13, but 0.13 cannot open files written by 0.14.',
    ja: 'This is the guide for Lodestone {old}. The current release is {latest}: it adds `count` and file format 6, and it opens files made by 0.13, but 0.13 cannot open files written by 0.14.',
  },
  toLatest: { en: 'Read the {latest} guide', ko: 'Read the {latest} guide', ja: 'Read the {latest} guide' },
  shown: { en: 'Showing the guide for Lodestone {version}.', ko: 'Showing the guide for Lodestone {version}.', ja: 'Showing the guide for Lodestone {version}.' },
} satisfies Record<string, Tri>;

const HERO = {
  installWith: { en: 'Install with', ko: 'Install with', ja: 'Install with' },
  title: { en: 'Getting started', ko: 'Getting started', ja: 'Getting started' },
  titleSub: { en: 'with Lodestone', ko: 'with Lodestone', ja: 'with Lodestone' },
  copyWhat: { en: 'the install command', ko: 'the install command', ja: 'the install command' },
  lede: {
    en: 'Lodestone is a key-value database that runs inside your program and keeps everything in one file. In about ten minutes you will install it, write a few records from its shell, read them back with a range query, and open the same file from Python.',
    ko: 'Lodestone is a key-value database that runs inside your program and keeps everything in one file. In about ten minutes you will install it, write a few records from its shell, read them back with a range query, and open the same file from Python.',
    ja: 'Lodestone is a key-value database that runs inside your program and keeps everything in one file. In about ten minutes you will install it, write a few records from its shell, read them back with a range query, and open the same file from Python.',
  },
  runsOn: { en: 'Runs on', ko: 'Runs on', ja: 'Runs on' },
  runsOnValue: {
    en: 'macOS 13 or later, Linux with glibc 2.31 or later, Windows 10 or later',
    ko: 'macOS 13 or later, Linux with glibc 2.31 or later, Windows 10 or later',
    ja: 'macOS 13 or later, Linux with glibc 2.31 or later, Windows 10 or later',
  },
  footprint: { en: 'Footprint', ko: 'Footprint', ja: 'Footprint' },
  footprintValue: { en: 'One {size} MB binary. No server, no config file.', ko: 'One {size} MB binary. No server, no config file.', ja: 'One {size} MB binary. No server, no config file.' },
  forStep: { en: 'For step 4', ko: 'For step 4', ja: 'For step 4' },
  forStepValue: { en: 'Python {python} or later', ko: 'Python {python} or later', ja: 'Python {python} or later' },
} satisfies Record<string, Tri>;

const QUICK = {
  title: { en: 'From an empty file to your first query', ko: 'From an empty file to your first query', ja: 'From an empty file to your first query' },
  note: {
    en: 'Keep the shell from the install open. Type what follows `shop.db>`; the lines without a prompt are what Lodestone prints back.',
    ko: 'Keep the shell from the install open. Type what follows `shop.db>`; the lines without a prompt are what Lodestone prints back.',
    ja: 'Keep the shell from the install open. Type what follows `shop.db>`; the lines without a prompt are what Lodestone prints back.',
  },
} satisfies Record<string, Tri>;

interface Step {
  title: Tri;
  body: Tri[];
  lines: (version: Version) => Line[];
}

const STEPS: Step[] = [
  {
    title: { en: 'Write a few keys', ko: 'Write a few keys', ja: 'Write a few keys' },
    body: [
      {
        en: 'Store two users and an order. Keys are plain strings, and Lodestone keeps them sorted byte by byte, so keys that share a prefix such as `user:` sit next to each other in the file.',
        ko: 'Store two users and an order. Keys are plain strings, and Lodestone keeps them sorted byte by byte, so keys that share a prefix such as `user:` sit next to each other in the file.',
        ja: 'Store two users and an order. Keys are plain strings, and Lodestone keeps them sorted byte by byte, so keys that share a prefix such as `user:` sit next to each other in the file.',
      },
      { en: 'Values can be anything. The shell stores JSON exactly as you type it.', ko: 'Values can be anything. The shell stores JSON exactly as you type it.', ja: 'Values can be anything. The shell stores JSON exactly as you type it.' },
    ],
    lines: () => [
      { ps: SHELL, cmd: 'put user:1042 {"name":"Ines Achterberg","plan":"team"}' },
      { out: 'OK  0.21 ms' },
      { ps: SHELL, cmd: 'put user:1043 {"name":"Tomas Rehn","plan":"solo"}' },
      { out: 'OK  0.18 ms' },
      { ps: SHELL, cmd: 'put order:2026-11-20:7781 {"user":1042,"total":64.00}' },
      { out: 'OK  0.19 ms' },
    ],
  },
  {
    title: { en: 'Read one back', ko: 'Read one back', ja: 'Read one back' },
    body: [
      {
        en: '`get` prints the value as you stored it. A key that was never written prints `(none)`. That is an answer, not an error, so a script can test for it.',
        ko: '`get` prints the value as you stored it. A key that was never written prints `(none)`. That is an answer, not an error, so a script can test for it.',
        ja: '`get` prints the value as you stored it. A key that was never written prints `(none)`. That is an answer, not an error, so a script can test for it.',
      },
    ],
    lines: () => [
      { ps: SHELL, cmd: 'get user:1042' },
      { out: '{"name":"Ines Achterberg","plan":"team"}' },
      { ps: SHELL, cmd: 'get user:1044' },
      { out: '(none)' },
    ],
  },
  {
    title: { en: 'Run your first range query', ko: 'Run your first range query', ja: 'Run your first range query' },
    body: [
      {
        en: 'Add two more orders, one of them a day later. Then `scan` the prefix for 20 November: it walks every key that starts with it, in order, and stops at the first key that does not.',
        ko: 'Add two more orders, one of them a day later. Then `scan` the prefix for 20 November: it walks every key that starts with it, in order, and stops at the first key that does not.',
        ja: 'Add two more orders, one of them a day later. Then `scan` the prefix for 20 November: it walks every key that starts with it, in order, and stops at the first key that does not.',
      },
      {
        en: "Most programs built on Lodestone are a handful of scans like this one: one day's orders, one user's sessions.",
        ko: "Most programs built on Lodestone are a handful of scans like this one: one day's orders, one user's sessions.",
        ja: "Most programs built on Lodestone are a handful of scans like this one: one day's orders, one user's sessions.",
      },
    ],
    lines: () => [
      { ps: SHELL, cmd: 'put order:2026-11-20:7782 {"user":1043,"total":18.50}' },
      { out: 'OK  0.17 ms' },
      { ps: SHELL, cmd: 'put order:2026-11-21:7790 {"user":1042,"total":120.00}' },
      { out: 'OK  0.20 ms' },
      { ps: SHELL, cmd: 'scan order:2026-11-20:' },
      { out: 'order:2026-11-20:7781  {"user":1042,"total":64.00}' },
      { out: 'order:2026-11-20:7782  {"user":1043,"total":18.50}' },
      { out: '2 keys in 0.09 ms' },
    ],
  },
  {
    title: { en: 'Open the same file from Python', ko: 'Open the same file from Python', ja: 'Open the same file from Python' },
    body: [
      {
        en: 'Quit the shell first, because one process writes to a file at a time. Install the Python package, save the six lines below as `report.py` next to `shop.db`, and run it.',
        ko: 'Quit the shell first, because one process writes to a file at a time. Install the Python package, save the six lines below as `report.py` next to `shop.db`, and run it.',
        ja: 'Quit the shell first, because one process writes to a file at a time. Install the Python package, save the six lines below as `report.py` next to `shop.db`, and run it.',
      },
      { en: "The script runs the scan from step 3 and prints each order's total.", ko: "The script runs the scan from step 3 and prints each order's total.", ja: "The script runs the scan from step 3 and prints each order's total." },
    ],
    lines: (version) => [
      { ps: SHELL, cmd: '.quit' },
      { ps: HOME, cmd: install('pip', version).cmd },
      { out: `Successfully installed lodestone-${version}` },
      { ps: HOME, cmd: 'cat -n report.py' },
      {
        file: [
          'import lodestone',
          '',
          'db = lodestone.open("shop.db")',
          'with db.read() as tx:',
          '    for key, value in tx.scan("order:2026-11-20:"):',
          '        print(key, value["total"])',
        ],
      },
      { ps: HOME, cmd: 'python report.py' },
      { out: 'order:2026-11-20:7781 64.0' },
      { out: 'order:2026-11-20:7782 18.5' },
    ],
  },
];

const REF = {
  title: { en: 'Shell commands', ko: 'Shell commands', ja: 'Shell commands' },
  note: {
    en: 'Everything the shell understands. Wrap a key or value that contains spaces in single quotes.',
    ko: 'Everything the shell understands. Wrap a key or value that contains spaces in single quotes.',
    ja: 'Everything the shell understands. Wrap a key or value that contains spaces in single quotes.',
  },
  filter: { en: 'Filter commands', ko: 'Filter commands', ja: 'Filter commands' },
  placeholder: { en: 'scan, backup, prefix', ko: 'scan, backup, prefix', ja: 'scan, backup, prefix' },
  all: { en: '{total} commands', ko: '{total} commands', ja: '{total} commands' },
  some: { en: '{shown} of {total} commands', ko: '{shown} of {total} commands', ja: '{shown} of {total} commands' },
  matched: { en: '{shown} of {total} commands match “{query}”.', ko: '{shown} of {total} commands match “{query}”.', ja: '{shown} of {total} commands match “{query}”.' },
  none: { en: 'No command matches “{query}”.', ko: 'No command matches “{query}”.', ja: 'No command matches “{query}”.' },
  noneHint: {
    en: 'Search by command, by what it does, or by part of an example, such as a key prefix.',
    ko: 'Search by command, by what it does, or by part of an example, such as a key prefix.',
    ja: 'Search by command, by what it does, or by part of an example, such as a key prefix.',
  },
  clear: { en: 'Clear the filter', ko: 'Clear the filter', ja: 'Clear the filter' },
  colCommand: { en: 'Command', ko: 'Command', ja: 'Command' },
  colDoes: { en: 'What it does', ko: 'What it does', ja: 'What it does' },
  colExample: { en: 'Example', ko: 'Example', ja: 'Example' },
  copyWhat: { en: 'the {name} example', ko: 'the {name} example', ja: 'the {name} example' },
  since: { en: 'Added in 0.14.0.', ko: 'Added in 0.14.0.', ja: 'Added in 0.14.0.' },
} satisfies Record<string, Tri>;

interface Command {
  name: string;
  syntax: string;
  does: Tri;
  example: string;
  /** Dot commands talk to the shell, not the data, and are listed after a heavier rule. */
  dot?: boolean;
  /** Added in 0.14.0, so the guide for 0.13 leaves it out. */
  added014?: boolean;
}

const COMMANDS: Command[] = [
  {
    name: 'put',
    syntax: 'put <key> <value>',
    does: { en: 'Writes a value. A value already stored under that key is replaced.', ko: 'Writes a value. A value already stored under that key is replaced.', ja: 'Writes a value. A value already stored under that key is replaced.' },
    example: 'put user:1043 {"plan":"team"}',
  },
  {
    name: 'get',
    syntax: 'get <key>',
    does: { en: 'Prints the value, or `(none)` if the key was never written.', ko: 'Prints the value, or `(none)` if the key was never written.', ja: 'Prints the value, or `(none)` if the key was never written.' },
    example: 'get user:1043',
  },
  {
    name: 'del',
    syntax: 'del <key>',
    does: { en: 'Removes a key. Removing a key that is not there does nothing.', ko: 'Removes a key. Removing a key that is not there does nothing.', ja: 'Removes a key. Removing a key that is not there does nothing.' },
    example: 'del session:8fa1c2',
  },
  {
    name: 'scan',
    syntax: 'scan <prefix> --limit <n>',
    does: {
      en: 'Lists keys that start with the prefix, in order. Without `--limit` it lists all of them.',
      ko: 'Lists keys that start with the prefix, in order. Without `--limit` it lists all of them.',
      ja: 'Lists keys that start with the prefix, in order. Without `--limit` it lists all of them.',
    },
    example: 'scan order:2026-11- --limit 20',
  },
  {
    name: 'range',
    syntax: 'range <from> <to>',
    does: { en: 'Lists keys from *from* up to, but not including, *to*.', ko: 'Lists keys from *from* up to, but not including, *to*.', ja: 'Lists keys from *from* up to, but not including, *to*.' },
    example: 'range user:1000 user:2000',
  },
  {
    name: 'count',
    syntax: 'count <prefix>',
    does: { en: 'Counts the keys under a prefix without reading their values.', ko: 'Counts the keys under a prefix without reading their values.', ja: 'Counts the keys under a prefix without reading their values.' },
    example: 'count order:2026-11-',
    added014: true,
  },
  {
    name: '.backup',
    syntax: '.backup <file>',
    does: {
      en: 'Writes a consistent copy. Other processes can keep reading while it runs.',
      ko: 'Writes a consistent copy. Other processes can keep reading while it runs.',
      ja: 'Writes a consistent copy. Other processes can keep reading while it runs.',
    },
    example: '.backup backup/shop-1121.db',
    dot: true,
  },
  {
    name: '.stats',
    syntax: '.stats',
    does: { en: 'Shows the file size, key count and free pages.', ko: 'Shows the file size, key count and free pages.', ja: 'Shows the file size, key count and free pages.' },
    example: '.stats',
    dot: true,
  },
  {
    name: '.quit',
    syntax: '.quit',
    does: {
      en: 'Finishes any write in progress, closes the file and leaves the shell.',
      ko: 'Finishes any write in progress, closes the file and leaves the shell.',
      ja: 'Finishes any write in progress, closes the file and leaves the shell.',
    },
    example: '.quit',
    dot: true,
  },
];

const WRONG = {
  title: { en: 'When things go wrong', ko: 'When things go wrong', ja: 'When things go wrong' },
  note: {
    en: 'The two errors people hit most often in their first week, and what to do about each.',
    ko: 'The two errors people hit most often in their first week, and what to do about each.',
    ja: 'The two errors people hit most often in their first week, and what to do about each.',
  },
  copyWhat: { en: 'the fix', ko: 'the fix', ja: 'the fix' },
} satisfies Record<string, Tri>;

interface Trouble {
  id: string;
  title: Tri;
  lines: Line[];
  body: Tri[];
  fix: Line[];
  /** What Copy puts on the clipboard: the code, or the commands without their output. */
  copy: string;
}

const TROUBLES: Trouble[] = [
  {
    id: 'locked',
    title: { en: 'LockedError: shop.db is locked for writing', ko: 'LockedError: shop.db is locked for writing', ja: 'LockedError: shop.db is locked for writing' },
    lines: [
      { ps: HOME, cmd: 'python report.py' },
      { out: 'Traceback (most recent call last):' },
      { out: '  File "report.py", line 3, in <module>' },
      { out: '    db = lodestone.open("shop.db")' },
      { bad: 'lodestone.LockedError: shop.db is locked for writing by pid 48213 (lode shell)' },
    ],
    body: [
      {
        en: 'Only one process can hold a file for writing, and both the shell and `lodestone.open()` ask for write access by default. Process 48213 is the shell from step 1, still open in another window.',
        ko: 'Only one process can hold a file for writing, and both the shell and `lodestone.open()` ask for write access by default. Process 48213 is the shell from step 1, still open in another window.',
        ja: 'Only one process can hold a file for writing, and both the shell and `lodestone.open()` ask for write access by default. Process 48213 is the shell from step 1, still open in another window.',
      },
      {
        en: 'Quit that shell with `.quit`, or open the file read-only, which any number of processes can do at once:',
        ko: 'Quit that shell with `.quit`, or open the file read-only, which any number of processes can do at once:',
        ja: 'Quit that shell with `.quit`, or open the file read-only, which any number of processes can do at once:',
      },
    ],
    fix: [{ out: 'db = lodestone.open("shop.db", read_only=True)' }],
    copy: 'db = lodestone.open("shop.db", read_only=True)',
  },
  {
    id: 'checksum',
    title: { en: 'Checksum mismatch after copying a file', ko: 'Checksum mismatch after copying a file', ja: 'Checksum mismatch after copying a file' },
    lines: [
      { ps: HOME, cmd: 'cp shop.db backup/shop.db' },
      { ps: HOME, cmd: 'lode shell backup/shop.db' },
      { bad: 'error: checksum mismatch on page 1832 of backup/shop.db' },
      { out: 'the page changed while the file was being read' },
    ],
    body: [
      {
        en: '`cp` read `shop.db` while your program was in the middle of a write, so the copy holds one half-written page. The original file is fine.',
        ko: '`cp` read `shop.db` while your program was in the middle of a write, so the copy holds one half-written page. The original file is fine.',
        ja: '`cp` read `shop.db` while your program was in the middle of a write, so the copy holds one half-written page. The original file is fine.',
      },
      {
        en: 'Delete the broken copy. Make copies with `lode backup`, which waits for the write in progress (inside the shell it is `.backup`), and check them with `lode verify`:',
        ko: 'Delete the broken copy. Make copies with `lode backup`, which waits for the write in progress (inside the shell it is `.backup`), and check them with `lode verify`:',
        ja: 'Delete the broken copy. Make copies with `lode backup`, which waits for the write in progress (inside the shell it is `.backup`), and check them with `lode verify`:',
      },
    ],
    fix: [
      { ps: HOME, cmd: 'lode backup shop.db backup/shop.db' },
      { ps: HOME, cmd: 'lode verify backup/shop.db' },
      { out: '1906 pages, all checksums match' },
    ],
    copy: 'lode backup shop.db backup/shop.db\nlode verify backup/shop.db',
  },
];

const FOOT = {
  next: { en: 'Next in the guide:', ko: 'Next in the guide:', ja: 'Next in the guide:' },
  nextTitle: { en: 'Transactions and snapshots', ko: 'Transactions and snapshots', ja: 'Transactions and snapshots' },
  licence: { en: 'Lodestone {version} is released under the MIT licence.', ko: 'Lodestone {version} is released under the MIT licence.', ja: 'Lodestone {version} is released under the MIT licence.' },
} satisfies Record<string, Tri>;

const COPY = {
  idle: { en: 'Copy', ko: 'Copy', ja: 'Copy' },
  done: { en: 'Copied', ko: 'Copied', ja: 'Copied' },
  failed: { en: 'Failed', ko: 'Failed', ja: 'Failed' },
  saidDone: { en: 'Copied: {text}', ko: 'Copied: {text}', ja: 'Copied: {text}' },
  saidFailed: {
    en: 'The browser did not allow the copy. Select the command and copy it by hand.',
    ko: 'The browser did not allow the copy. Select the command and copy it by hand.',
    ja: 'The browser did not allow the copy. Select the command and copy it by hand.',
  },
} satisfies Record<string, Tri>;

function SessionLines({ lines }: { lines: Line[] }) {
  return (
    <>
      {lines.map((line, index) => {
        if ('ps' in line) {
          return (
            <span key={index} className="ld-l">
              <span className="ld-ps">{line.ps}</span> <span className="ld-in">{line.cmd}</span>
            </span>
          );
        }
        if ('bad' in line) return <span key={index} className="ld-l ld-bad">{line.bad}</span>;
        if ('file' in line) {
          return (
            <span key={index} className="ld-file">
              {line.file.map((code, n) => (
                <span key={n} className="ld-l ld-l--num">
                  <span className="ld-ln" aria-hidden="true">{n + 1}</span>
                  {code}
                </span>
              ))}
            </span>
          );
        }
        return <span key={index} className="ld-l">{line.out}</span>;
      })}
    </>
  );
}

const PROMPT_EN = `Design one real page in the Terminal Core style: green phosphor on a near-black screen, terminal windows with rounded phosphor frames and scanlines, and everything else ruled lines and inverse video.

Pick a believable subject whose readers live at a command line, such as a database, a build tool or a sync daemon, and write its real documentation. The page must read as that product's page, never as a page about its own style. Here it is the getting-started guide of Lodestone, an embedded key-value database: install it, write keys from its shell, read them back with a range query, open the same file from Python, and fix the two errors people hit first.

TOKENS:
--bg: #071109 (the page, under 2px lines of #061007 every 4px)
--surface: #0a190c (terminal title bars, and any menu that opens over the page)
--screen: #08140a (inside terminals, fix blocks and the filter field; the hero screen lifts to #0d2311 in a radial pool that fades to #061008 at its edges)
--ink: #b9ffbe
--hi: #e2ffe4 (what the reader types, code, a listed file, the filter text)
--out: #8fd697 (what the program prints, secondary text, links, inactive tabs, the version value)
--dim: #67ad6e (definition terms, table heads, the Version label, placeholders, syntax placeholders, line numbers, the licence line)
--accent: #d4ff5c
--accent-wash: rgba(212,255,92,0.1)
--line: #2f7d37 (frames, rules, control borders)
--line-2: #24602a (rows inside a list or table)

COLOUR:
- Phosphor greens on near-black only. The accent marks prompts, the banner's second line, step numbers, command names, error headings and error lines, the older-version note's rule, the caret and focus rings; nothing else. No red for errors: an error line is accent text on the accent wash with a 3px accent rule on its left, running the full width of its screen.
- Inline code in prose sits on rgba(185,255,190,0.09).
- Glow: the banner, the H2s, the wordmark and the next chapter's title carry 0 0 10px rgba(185,255,190,0.5) and 0 0 34px rgba(185,255,190,0.2); step numbers carry 0 0 14px rgba(212,255,92,0.35).
- Inverse video for the selected tab: --ink background, --bg text. Hover: links and tabs brighten to --hi; buttons, the version selector and the filter field get an --ink border.

TYPOGRAPHY:
Two families. VT323 (400, its only weight) is what the shell prints: the title banner, H2, H3, step numbers, error headings, the wordmark, the empty-filter message and the next chapter's title. Inconsolata 400 reads the prose and everything typed or printed in a session, so a command looks the same in a sentence and at the prompt. Ligatures off everywhere.
Title banner (H1): VT323, clamp(2.5rem, min(12.5vw, 14.5vh), 9rem), line-height 0.8, two lines, the second in the accent. It is printed inside the hero terminal, between the command that opens the shell and the shell's greeting.
H2: VT323 clamp(2.75rem, 5.2vw, 4.25rem), line-height 0.9. H3: VT323 2.25rem, line-height 1. Error headings: VT323 clamp(1.875rem, 3.2vw, 2.625rem), line-height 1.02, in the accent. Step numbers: VT323 4.5rem (3rem on phones). Wordmark: VT323 2.375rem (2rem on phones, 1.625rem under 400px). Next chapter: VT323 2.5rem. Empty-filter message: VT323 2.25rem.
Body: Inconsolata 1.125rem, line-height 1.6 (1.0625rem on phones); the lede 1.375rem, line-height 1.5 (1.1875rem on phones). Sessions: 1.0625rem, line-height 1.55 (1rem on phones). Command names: 1.0625rem. Controls: 1rem; the filter field 1.0625rem. No text under 1rem. No all-caps tracked labels.

LAYOUT:
- A docs bar on a 1px rule: the wordmark with a block cursor, three in-page links (they leave the bar below 860px) and the version selector with its visible label.
- Hero: the terminal window, entirely on the first screen of a 1280x800 laptop. Its title bar holds the install-method tabs, the working directory and Copy. The screen prints the install, then "lode shell shop.db", then the banner, then the shell's greeting and a block cursor. Under it, the lede in seven of twelve columns and a ruled list of requirements in the last four.
- Quickstart: four steps on three columns: the number with a 2px rule running down from it, the step's text, and one shell session that continues down the right side from step to step, its segments joined by 1px dashed rules. Below 1024px each step's session gets its own frame under its text; below 560px the number sits on a line of its own.
- Command reference: a filter field with a count, then a table of command, what it does and an example with Copy; the dot commands sit under a 2px rule. Below 860px each row stacks.
- Errors: each error is a heading, then a terminal with the traceback (the error line marked) in seven columns and, in the last five, the explanation with the fix in a framed block with Copy. Below 1024px they stack.
- A 1120px column, sections 120px apart (88px below 860px).

COMPONENTS:
- Terminal window: 2px --line frame, 14px radius, a 46px title bar on --surface, the screen on --screen with a 1px line of rgba(0,0,0,0.16) every 3px over it, a 1px #0a2010 ring, an outer glow of 0 0 56px rgba(47,125,55,0.16) and a 0 24px 40px rgba(0,0,0,0.45) drop.
- Install tabs (brew, curl, cargo, pip): a real tab list with roving focus and arrow, Home and End keys; the panel is the install session. Each method types its own command and prints its own output.
- Version selector: v0.14.2 or v0.13.4. The older one shows a note under the bar (3px accent rule, accent wash) with a button back to the current release, and every version number, file size, Python requirement and install command on the page follows the choice; commands added later leave the reference.
- Copy buttons: square, 1px --line border, 32px tall (44px on phones). They copy the command without its prompt, read "Copied" for two seconds and say so in a polite live region.
- Command filter: a labelled field on a 1px --line frame, the count beside it, and an empty state that names the query with a button that clears it and returns focus to the field.
- Square corners on every control. Only terminal frames (14px) and fix blocks (10px) are rounded.

MOTION:
- None. The cursor does not blink and nothing moves on its own.

FORBIDDEN:
- Cards, pills, chips, badges, neon in any colour but phosphor green, gradients other than the scanlines and the hero screen's pool
- A small label above a heading, all-caps tracked labels, numbers on anything that is not a real sequence
- Typing animations, blinking cursors, falling-code rain, ASCII-art logos, CRT curvature, flicker
- Copy about hackers, retro computing or terminals as an aesthetic
- Emoji, illustrations, arrows on links, middle-dot meta strings

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a tab list and panel for the install, an ordered list for the steps, a table with explicit roles for the commands, articles for the errors
3) Working tabs, version selector with its note, Copy buttons with confirmation, and the filter with its count and empty state
4) Responsive layout down to 320px with no horizontal scroll, every control at least 44px tall on phones
5) Visible focus on every control, a polite live region for copies, version changes and filter results`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

// Copy reads "Copied" for this long, then "Copy" again.
const COPY_FEEDBACK_MS = 2000;
// The filter's result is announced once typing pauses, not on every key.
const FILTER_NEWS_DELAY_MS = 700;

export function PortedTerminalCorePage({ lang }: PortedStylePageProps) {
  const [method, setMethod] = useState<Method>('brew');
  const [version, setVersion] = useState<Version>(LATEST);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<{ id: string; ok: boolean } | null>(null);
  // A changing count makes the same message (copying twice) a new announcement.
  const [news, setNews] = useState({ text: '', count: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const versionRef = useRef<HTMLSelectElement>(null);
  const filterRef = useRef<HTMLInputElement>(null);
  const copyTimer = useRef(0);
  const filterTimer = useRef(0);

  const t = (text: Tri) => text[lang];
  const say = (text: string) => setNews((current) => ({ text, count: current.count + 1 }));

  const release = RELEASE[version];
  const latest = version === LATEST;
  const session = install(method, version);
  const commands = COMMANDS.filter((command) => !command.added014 || latest);
  const total = commands.length;
  const matching = (text: string) => {
    const needle = text.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((command) => [command.syntax, t(command.does), command.example].some((part) => part.toLowerCase().includes(needle)));
  };
  const shown = matching(query);
  const filtered = query.trim() !== '';

  useEffect(
    () => () => {
      window.clearTimeout(copyTimer.current);
      window.clearTimeout(filterTimer.current);
    },
    [],
  );

  // What the live region says about the filter: the count, or that nothing matches.
  const filterNews = (text: string) => {
    const count = matching(text).length;
    if (count === 0) return fill(t(REF.none), { query: text.trim() });
    return text.trim() ? fill(t(REF.matched), { shown: count, total, query: text.trim() }) : fill(t(REF.all), { total });
  };

  // The count beside the field changes as you type; the live region hears it once you pause.
  const onFilter = (text: string) => {
    setQuery(text);
    window.clearTimeout(filterTimer.current);
    filterTimer.current = window.setTimeout(() => say(filterNews(text)), FILTER_NEWS_DELAY_MS);
  };

  const copy = async (id: string, text: string) => {
    const ok = await writeClipboard(text);
    setCopied({ id, ok });
    say(ok ? fill(t(COPY.saidDone), { text }) : t(COPY.saidFailed));
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), COPY_FEEDBACK_MS);
  };

  // A Copy button keeps "Copy" at the start of its name; the rest says what it copies.
  const copyButton = (id: string, text: string, what: string) => {
    const state = copied?.id === id ? (copied.ok ? COPY.done : COPY.failed) : COPY.idle;
    return (
      <button type="button" className="ld-copy" onClick={() => void copy(id, text)}>
        {t(state)}
        <span className="ld-sr"> {what}</span>
      </button>
    );
  };

  const chooseVersion = (next: Version) => {
    setVersion(next);
    say(fill(t(BAR.shown), { version: next }));
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = METHODS.length - 1;
    const target = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setMethod(METHODS[target]);
    tabRefs.current[target]?.focus();
  };

  // The empty state leaves with the query, so focus goes back to the field.
  const clearFilter = () => {
    window.clearTimeout(filterTimer.current);
    setQuery('');
    say(filterNews(''));
    filterRef.current?.focus();
  };

  return (
    <FusionShell
      fusionId="terminal-core"
      lang={lang}
      tone="dark"
      accent="#d4ff5c"
      prev={{ href: '/pages/glass-orbit.html', label: 'Glass Orbit' }}
      next={{ href: '/pages/midnight-noir.html', label: 'Midnight Noir' }}
      prompts={PROMPTS}
    >
      <div className="ld">
        <header className="ld-bar">
          <p className="ld-mark"><i aria-hidden="true" />lodestone</p>
          <nav className="ld-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#ld-quick">{t(BAR.quick)}</a>
            <a href="#ld-ref">{t(BAR.commands)}</a>
            <a href="#ld-wrong">{t(BAR.wrong)}</a>
          </nav>
          <div className="ld-ver">
            <label htmlFor="ld-version">{t(BAR.version)}</label>
            <span className="ld-ver__pick">
              <select id="ld-version" ref={versionRef} value={version} onChange={(event) => chooseVersion(event.target.value as Version)}>
                {VERSIONS.map((item) => <option key={item} value={item}>v{item}</option>)}
              </select>
            </span>
          </div>
        </header>

        {latest ? null : (
          <div className="ld-older">
            <p>{rich(fill(t(BAR.older), { old: version, latest: LATEST }))}</p>
            <button
              type="button"
              className="ld-btn"
              onClick={() => {
                chooseVersion(LATEST);
                versionRef.current?.focus();
              }}
            >
              {fill(t(BAR.toLatest), { latest: LATEST })}
            </button>
          </div>
        )}

        <section className="ld-hero" aria-labelledby="ld-title">
          <div className="ld-term ld-term--hero">
            <div className="ld-term__bar">
              <div className="ld-tabs" role="tablist" aria-label={t(HERO.installWith)}>
                {METHODS.map((item, index) => (
                  <button
                    key={item}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`ld-tab-${item}`}
                    className="ld-tab"
                    aria-selected={item === method}
                    aria-controls="ld-install"
                    tabIndex={item === method ? 0 : -1}
                    onClick={() => setMethod(item)}
                    onKeyDown={(event) => onTabKey(event, index)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <span className="ld-term__where">~/shop</span>
              {copyButton('install', session.cmd, t(HERO.copyWhat))}
            </div>
            <div className="ld-term__screen">
              <div className="ld-install" role="tabpanel" id="ld-install" aria-labelledby={`ld-tab-${method}`} tabIndex={0}>
                <pre><SessionLines lines={[{ ps: HOME, cmd: session.cmd }, ...session.out.map((out) => ({ out }))]} /></pre>
              </div>
              <pre><SessionLines lines={[{ ps: HOME, cmd: 'lode shell shop.db' }]} /></pre>
              <h1 className="ld-banner" id="ld-title">
                <span>{t(HERO.title)}</span> <span className="ld-banner__sub">{t(HERO.titleSub)}</span>
              </h1>
              <pre>
                <SessionLines lines={[{ out: `Lodestone ${version}, file format ${release.format}. Created shop.db (empty, 16 KB).` }, { out: 'Type .help for commands and .quit to leave.' }]} />
                <span className="ld-l"><span className="ld-ps">{SHELL}</span> <i className="ld-cursor" aria-hidden="true" /></span>
              </pre>
            </div>
          </div>

          <div className="ld-intro">
            <p className="ld-lede">{t(HERO.lede)}</p>
            <dl className="ld-needs">
              <div><dt>{t(HERO.runsOn)}</dt><dd>{t(HERO.runsOnValue)}</dd></div>
              <div><dt>{t(HERO.footprint)}</dt><dd>{fill(t(HERO.footprintValue), { size: release.size })}</dd></div>
              <div><dt>{t(HERO.forStep)}</dt><dd>{fill(t(HERO.forStepValue), { python: release.python })}</dd></div>
            </dl>
          </div>
        </section>

        <section className="ld-section" id="ld-quick" aria-labelledby="ld-quick-title">
          <div className="ld-head">
            <h2 id="ld-quick-title">{t(QUICK.title)}</h2>
            <p>{rich(t(QUICK.note))}</p>
          </div>
          <ol className="ld-steps">
            {STEPS.map((step, index) => (
              <li key={step.title.en} className="ld-step">
                <span className="ld-step__n" aria-hidden="true">{index + 1}</span>
                <div className="ld-step__text">
                  <h3>{t(step.title)}</h3>
                  {step.body.map((paragraph) => <p key={paragraph.en}>{rich(t(paragraph))}</p>)}
                </div>
                <div className="ld-session">
                  {index === 0 ? (
                    <div className="ld-term__bar ld-session__bar"><span>lode shell</span><span className="ld-term__where">shop.db</span></div>
                  ) : null}
                  <div className="ld-session__screen">
                    <pre><SessionLines lines={step.lines(version)} /></pre>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ld-section" id="ld-ref" aria-labelledby="ld-ref-title">
          <div className="ld-head">
            <h2 id="ld-ref-title">{t(REF.title)}</h2>
            <p>{t(REF.note)}</p>
          </div>

          <div className="ld-filter">
            <label htmlFor="ld-filter">{t(REF.filter)}</label>
            <div className="ld-filter__row">
              <input
                id="ld-filter"
                ref={filterRef}
                type="search"
                autoComplete="off"
                spellCheck={false}
                placeholder={t(REF.placeholder)}
                value={query}
                aria-describedby="ld-filter-count"
                onChange={(event) => onFilter(event.target.value)}
              />
              <p className="ld-filter__count" id="ld-filter-count">
                {filtered ? fill(t(REF.some), { shown: shown.length, total }) : fill(t(REF.all), { total })}
              </p>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="ld-empty">
              <p className="ld-empty__title">{fill(t(REF.none), { query: query.trim() })}</p>
              <p>{t(REF.noneHint)}</p>
              <button type="button" className="ld-btn" onClick={clearFilter}>{t(REF.clear)}</button>
            </div>
          ) : (
            <div className="ld-cmds" role="table" aria-labelledby="ld-ref-title">
              <div role="rowgroup">
                <div className="ld-cmds__row ld-cmds__row--head" role="row">
                  <span role="columnheader">{t(REF.colCommand)}</span>
                  <span role="columnheader">{t(REF.colDoes)}</span>
                  <span role="columnheader">{t(REF.colExample)}</span>
                </div>
              </div>
              <div role="rowgroup">
                {shown.map((command, index) => {
                  // The heavier rule sits above the first dot command that is still listed.
                  const firstDot = command.dot && !shown[index - 1]?.dot && index > 0;
                  return (
                    <div key={command.name} className={`ld-cmds__row${firstDot ? ' is-dot' : ''}`} role="row">
                      <span className="ld-cmds__cmd" role="rowheader" data-label={t(REF.colCommand)}>
                        <code>{syntax(command.syntax)}</code>
                      </span>
                      <span className="ld-cmds__does" role="cell" data-label={t(REF.colDoes)}>
                        {rich(t(command.does))}
                        {command.added014 ? <> {t(REF.since)}</> : null}
                      </span>
                      <span className="ld-cmds__ex" role="cell" data-label={t(REF.colExample)}>
                        <code><span className="ld-ps">{SHELL}</span> {command.example}</code>
                        {copyButton(`cmd-${command.name}`, command.example, fill(t(REF.copyWhat), { name: command.name }))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="ld-section" id="ld-wrong" aria-labelledby="ld-wrong-title">
          <div className="ld-head">
            <h2 id="ld-wrong-title">{t(WRONG.title)}</h2>
            <p>{t(WRONG.note)}</p>
          </div>

          {TROUBLES.map((trouble) => (
            <article key={trouble.id} className="ld-err" aria-labelledby={`ld-err-${trouble.id}`}>
              <h3 id={`ld-err-${trouble.id}`}>{t(trouble.title)}</h3>
              <div className="ld-term">
                <div className="ld-term__bar"><span>zsh</span><span className="ld-term__where">~/shop</span></div>
                <div className="ld-err__screen">
                  <pre><SessionLines lines={trouble.lines} /></pre>
                </div>
              </div>
              <div className="ld-err__fix">
                {trouble.body.map((paragraph) => <p key={paragraph.en}>{rich(t(paragraph))}</p>)}
                <div className="ld-fix">
                  <pre><SessionLines lines={trouble.fix} /></pre>
                  {copyButton(`fix-${trouble.id}`, trouble.copy, t(WRONG.copyWhat))}
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="ld-foot">
          <p className="ld-next">{t(FOOT.next)} <b>{t(FOOT.nextTitle)}</b></p>
          <p className="ld-licence">{fill(t(FOOT.licence), { version })}</p>
        </footer>

        <p className="ld-sr" role="status">{news.text}{news.count % 2 ? ' ' : ''}</p>
      </div>
    </FusionShell>
  );
}
