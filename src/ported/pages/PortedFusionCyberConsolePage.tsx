import { useEffect, useState, type KeyboardEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionCyberConsolePage.css';

// The home page of driftsync, a command-line tool that keeps a folder encrypted and
// in sync between machines, in the Cyber Console style. The whole page is set in one
// monospace family, as if the tool had printed it. Its components are the terminal's:
// a window split into panes, a ruled command table, tabs over a one-line command.
// The three neons have fixed meanings: lime is ok, magenta is changed, warned or
// failed, cyan is information, command names and links.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

/** A command line in parts. A part made with `n` is a command name and is set in cyan. */
type Part = string | { name: string };
const n = (name: string): Part => ({ name });
const plain = (parts: Part[]) => parts.map((part) => (typeof part === 'string' ? part : part.name)).join('');

type Tone = 'ok' | 'warn' | 'changed' | 'new' | 'info' | 'conflict';

type OsId = 'macos' | 'linux' | 'windows';
/** Every copy control on the page: the install line of the hero, and one per system. */
type CopyId = 'hero' | OsId;

/** One line of output: a tag, then one to three columns. The tone colours the tag. */
interface Line {
  kind: 'out' | 'file' | 'stat' | 'snap';
  tag: string;
  cells: string[];
  tone?: Tone;
}

const out = (tag: string, text: string, tone?: Tone): Line => ({ kind: 'out', tag, cells: [text], tone });
const file = (tone: 'new' | 'changed', path: string, size: string): Line => ({ kind: 'file', tag: tone, cells: [path, size], tone });
const stat = (tone: 'ok' | 'changed' | 'new' | 'conflict', name: string, size: string, where: string): Line => ({ kind: 'stat', tag: tone, cells: [name, size, where], tone });
const snap = (id: string, time: string, machine: string, sum: string): Line => ({ kind: 'snap', tag: id, cells: [time, machine, sum] });

/** A command and what it printed. `copy` puts a copy control at the end of the command. */
interface Step {
  command: Part[];
  lines: Line[];
  copy?: CopyId;
}

const CURL_INSTALL: Part[] = [n('curl'), ' -fsSL https://get.driftsync.dev | ', n('sh')];

const HERO = {
  nav: { en: 'On this page', ko: '페이지 목차', ja: 'ページ内の項目' },
  title: {
    en: 'Encrypted folder sync from the terminal.',
    ko: '터미널에서 쓰는 암호화 폴더 동기화.',
    ja: 'ターミナルから使う、暗号化されたフォルダ同期。',
  },
  lede: {
    en: 'driftsync encrypts every file before upload, stores it in a bucket you own, and keeps the folder identical on each of your machines.',
    ko: 'driftsync는 업로드하기 전에 모든 파일을 암호화하고, 직접 관리하는 버킷에 저장하며, 여러 컴퓨터에서 폴더를 똑같이 유지합니다.',
    ja: 'driftsyncは、アップロードの前にすべてのファイルを暗号化し、自分の管理するバケットに保存して、複数のマシンでフォルダを同じ状態に保ちます。',
  },
  window: {
    en: 'A first sync between two machines',
    ko: '두 컴퓨터 사이의 첫 동기화',
    ja: '2台のマシン間での最初の同期',
  },
  facts: {
    en: 'Runs on macOS, Linux and Windows. Stores to S3, Backblaze B2 or SFTP. MIT license.',
    ko: 'macOS, Linux, Windows에서 실행됩니다. S3, Backblaze B2, SFTP에 저장합니다. MIT 라이선스.',
    ja: 'macOS、Linux、Windowsで動作します。S3、Backblaze B2、SFTPに保存します。MITライセンス。',
  },
} satisfies Record<string, Tri>;

// The state a pane shows in its top rule.
const PANE_STATE = {
  waiting: { en: '1 file waiting', ko: '파일 1개 대기', ja: '1件待機中' },
  synced: { en: 'in sync', ko: '동기화됨', ja: '同期済み' },
  conflict: { en: '1 conflict', ko: '충돌 1건', ja: '競合1件' },
} satisfies Record<string, Tri>;

// The first machine installs driftsync, starts the folder and pushes it.
const LATHE_STEPS: Step[] = [
  {
    command: CURL_INSTALL,
    copy: 'hero',
    lines: [
      out('fetch', 'driftsync 0.9.2 linux-x86_64'),
      out('verify', 'checksum and signature match'),
      out('install', '~/.local/bin/driftsync'),
    ],
  },
  {
    command: [n('driftsync init'), ' --to s3://mira-notes'],
    lines: [
      out('key', 'new device key 9f2c 41aa 7be0'),
      out('remote', 'bucket reachable, empty'),
      out('index', '214 files, 38.6 MB'),
      out('ok', 'ready, nothing uploaded yet', 'ok'),
    ],
  },
  {
    command: [n('driftsync push')],
    lines: [
      out('scan', '214 files, 38.6 MB'),
      out('encrypt', '214 files, XChaCha20-Poly1305'),
      out('upload', '213 files, 38.5 MB in 12.4 s'),
      out('warn', 'journal/2026-11-18.md changed during upload and waits for the next push', 'warn'),
      out('ok', 'snapshot 7c1e0b4 at 09:42:17', 'ok'),
    ],
  },
];

// The second machine joins with a one-time code, then pushes its own changes.
const TERN_STEPS: Step[] = [
  {
    command: [n('driftsync link'), ' 4821-0937'],
    lines: [
      out('key', 'new device key c07d 5e12 88ab'),
      out('pull', '213 files, 38.5 MB in 9.1 s'),
      out('ok', 'linked to s3://mira-notes', 'ok'),
    ],
  },
  {
    command: [n('driftsync push')],
    lines: [
      file('new', 'projects/kiln/kiln-04.jpg', '3.2 MB'),
      file('changed', 'projects/kiln/shelf-plan.md', '4.0 kB'),
      file('changed', 'recipes/miso-soup.md', '1.8 kB'),
      out('upload', '3 files, 3.2 MB in 1.6 s'),
      out('ok', 'snapshot a41f9c2 at 10:12:44', 'ok'),
    ],
  },
  {
    command: [n('driftsync log'), ' -n 2'],
    lines: [
      snap('a41f9c2', '10:12:44', 'tern', '3 files, 3.2 MB'),
      snap('7c1e0b4', '09:42:17', 'lathe', '213 files, 38.5 MB'),
    ],
  },
];

const COMMANDS = {
  title: { en: 'Commands', ko: '명령어', ja: 'コマンド' },
  body: {
    en: 'Eight commands cover daily use. Each one prints what it did and exits with a status code.',
    ko: '일상적인 사용에는 명령어 8개면 충분합니다. 각 명령어는 한 일을 출력하고 상태 코드와 함께 종료합니다.',
    ja: '日常的な使い方は8つのコマンドで足ります。各コマンドは実行した内容を表示し、終了ステータスを返して終わります。',
  },
  columns: [
    { en: 'command', ko: '명령어', ja: 'コマンド' },
    { en: 'what it does', ko: '하는 일', ja: '内容' },
    { en: 'example', ko: '예시', ja: '例' },
  ] as Tri[],
  rows: [
    {
      name: 'init',
      does: {
        en: 'Creates a key and an index for this folder.',
        ko: '이 폴더의 키와 색인을 만듭니다.',
        ja: 'このフォルダの鍵と索引を作成します。',
      },
      example: [n('driftsync init'), ' --to s3://mira-notes'],
    },
    {
      name: 'push',
      does: {
        en: 'Encrypts changed files and uploads them.',
        ko: '변경된 파일을 암호화해 업로드합니다.',
        ja: '変更されたファイルを暗号化してアップロードします。',
      },
      example: [n('driftsync push')],
    },
    {
      name: 'pull',
      does: {
        en: 'Downloads new changes and decrypts them.',
        ko: '새 변경 사항을 내려받아 복호화합니다.',
        ja: '新しい変更をダウンロードして復号します。',
      },
      example: [n('driftsync pull')],
    },
    {
      name: 'status',
      does: {
        en: 'Compares each file with the last snapshot.',
        ko: '각 파일을 마지막 스냅샷과 비교합니다.',
        ja: '各ファイルを最後のスナップショットと比較します。',
      },
      example: [n('driftsync status'), ' projects/kiln'],
    },
    {
      name: 'watch',
      does: {
        en: 'Pushes and pulls whenever a file changes.',
        ko: '파일이 바뀔 때마다 보내고 받습니다.',
        ja: 'ファイルが変わるたびに送信と受信を行います。',
      },
      example: [n('driftsync watch'), ' --every 30s'],
    },
    {
      name: 'link',
      does: {
        en: 'Adds another machine with a one-time code.',
        ko: '일회용 코드로 다른 컴퓨터를 추가합니다.',
        ja: '使い捨てのコードで別のマシンを追加します。',
      },
      example: [n('driftsync link'), ' 4821-0937'],
    },
    {
      name: 'log',
      does: {
        en: 'Lists past snapshots with time and machine.',
        ko: '지난 스냅샷을 시간과 컴퓨터와 함께 나열합니다.',
        ja: '過去のスナップショットを時刻とマシンとともに一覧表示します。',
      },
      example: [n('driftsync log'), ' -n 10'],
    },
    {
      name: 'restore',
      does: {
        en: 'Brings a file back from an earlier snapshot.',
        ko: '이전 스냅샷에서 파일을 되돌립니다.',
        ja: '以前のスナップショットからファイルを戻します。',
      },
      example: [n('driftsync restore'), ' plan.md --at 7c1e0b4'],
    },
  ] as Array<{ name: string; does: Tri; example: Part[] }>,
};

const STATUS = {
  title: { en: 'What status prints', ko: 'status 출력 내용', ja: 'status の出力内容' },
  body: {
    en: 'One line per file: what happened to it and on which machine. The exit code says the same thing to a script.',
    ko: '파일마다 한 줄씩, 무슨 일이 일어났는지와 어느 컴퓨터에서 일어났는지를 보여 줍니다. 종료 코드는 스크립트에 같은 내용을 전합니다.',
    ja: 'ファイルごとに1行で、何が起きたか、どのマシンで起きたかを表示します。終了コードは、スクリプトに対して同じ内容を伝えます。',
  },
  window: {
    en: 'Output of driftsync status, and a script that reads its exit code',
    ko: 'driftsync status의 출력과 그 종료 코드를 읽는 스크립트',
    ja: 'driftsync status の出力と、その終了コードを読むスクリプト',
  },
} satisfies Record<string, Tri>;

const STATUS_COMMAND: Part[] = [n('driftsync status'), ' projects/kiln'];
const STATUS_REMOTE = out('remote', 'a41f9c2 from tern, 10:12:44');
const STATUS_FILES: Line[] = [
  stat('ok', 'firing-log.md', '2.1 kB', 'in sync'),
  stat('ok', 'glaze-tests.md', '8.4 kB', 'in sync'),
  stat('changed', 'budget.csv', '1.3 kB', 'edited here 10:05'),
  stat('changed', 'schedule.md', '640 B', 'edited here 10:11'),
  stat('new', 'kiln-04.jpg', '3.2 MB', 'only on tern'),
  stat('conflict', 'shelf-plan.md', '4.0 kB', 'edited on both'),
];
const STATUS_HINT = out('hint', 'pull first, both are kept', 'info');
const STATUS_EXIT = 'exit 2';

// The script answers each exit code of `driftsync status`. The comments say what the code means.
const EXIT_CASES: Array<{ code: string; meaning: Tri; action: Part[] }> = [
  { code: '0', meaning: { en: 'in sync', ko: '동기화됨', ja: '同期済み' }, action: ['exit 0;;'] },
  {
    code: '1',
    meaning: { en: 'something to push or pull', ko: '보내거나 받을 것이 있음', ja: '送信または受信するものがある' },
    action: [n('driftsync pull'), ' && ', n('driftsync push'), ';;'],
  },
  {
    code: '2',
    meaning: { en: 'edited on two machines', ko: '두 컴퓨터에서 수정됨', ja: '2台のマシンで編集された' },
    action: [n('notify-send'), ' "notes: conflict";;'],
  },
];

const INSTALL = {
  title: { en: 'Install', ko: '설치', ja: 'インストール' },
  body: {
    en: 'One binary, 11 MB, with no background service. Run the same command again to update.',
    ko: '바이너리 1개(11 MB)이며 백그라운드 서비스가 없습니다. 업데이트하려면 같은 명령을 다시 실행합니다.',
    ja: 'バイナリは1つ（11 MB）で、常駐するサービスはありません。更新するには同じコマンドをもう一度実行します。',
  },
  tabs: { en: 'Operating system', ko: '운영체제', ja: 'OS' },
  systems: [
    {
      id: 'macos',
      label: 'macOS',
      prompt: '$',
      command: [n('brew'), ' install driftsync'],
      needs: { en: '# needs macOS 12 or later', ko: '# macOS 12 이상 필요', ja: '# macOS 12以降が必要' },
    },
    {
      id: 'linux',
      label: 'Linux',
      prompt: '$',
      command: CURL_INSTALL,
      needs: { en: '# needs glibc 2.31 or later', ko: '# glibc 2.31 이상 필요', ja: '# glibc 2.31以降が必要' },
    },
    {
      id: 'windows',
      label: 'Windows',
      prompt: '>',
      command: [n('winget'), ' install driftsync'],
      needs: {
        en: '# needs Windows 10 1809 or later',
        ko: '# Windows 10 1809 이상 필요',
        ja: '# Windows 10 1809以降が必要',
      },
    },
  ] as Array<{ id: OsId; label: string; prompt: string; command: Part[]; needs: Tri }>,
};

const COPY = {
  idle: { en: 'copy', ko: '복사', ja: 'コピー' },
  done: { en: 'copied', ko: '복사됨', ja: '完了' },
  failed: { en: 'failed', ko: '실패', ja: '失敗' },
  saidDone: { en: 'Copied to the clipboard.', ko: '클립보드에 복사했습니다.', ja: 'クリップボードにコピーしました。' },
  saidFailed: {
    en: 'The browser did not allow the copy. Select the command and copy it by hand.',
    ko: '브라우저가 복사를 허용하지 않았습니다. 명령을 선택해 직접 복사해 주십시오.',
    ja: 'ブラウザがコピーを許可しませんでした。コマンドを選択して手動でコピーしてください。',
  },
} satisfies Record<string, Tri>;

// Backticks in copy mark a file or command name; `withCode` sets it as code.
const CONFIG = {
  title: { en: 'Configuration', ko: '설정', ja: '設定' },
  body: {
    en: 'driftsync reads one file, `driftsync.toml`, at the top of the folder it syncs. Only `remote` is required.',
    ko: 'driftsync는 동기화할 폴더 맨 위에 있는 `driftsync.toml` 파일 하나를 읽습니다. 필수 항목은 `remote`뿐입니다.',
    ja: 'driftsyncは、同期するフォルダの最上位にある`driftsync.toml`という1つのファイルを読み込みます。必須なのは`remote`だけです。',
  },
  keyTitle: { en: 'Where the key is stored', ko: '기기 키 저장 위치', ja: '機器の鍵の保存場所' },
  keyBody: {
    en: 'The device key is never written to this file. driftsync keeps it in the system keychain of each machine, and `driftsync link` gives a new machine a key of its own.',
    ko: '기기 키는 이 파일에 저장되지 않습니다. driftsync는 각 컴퓨터의 시스템 키체인에 키를 보관하며, `driftsync link`를 실행하면 새 컴퓨터마다 고유한 키가 발급됩니다.',
    ja: '機器の鍵はこのファイルには書き込まれません。driftsyncは各マシンのシステムのキーチェーンに鍵を保管し、`driftsync link`を実行すると新しいマシンには専用の鍵が発行されます。',
  },
} satisfies Record<string, Tri>;

const CONFIG_FILE = '~/notes/driftsync.toml';

// The keys of the file. `note` is the comment that explains the key.
const CONFIG_KEYS: Array<{ name: string; value: string; note: Tri }> = [
  {
    name: 'remote',
    value: '"s3://mira-notes"',
    note: {
      en: 'storage: s3://, b2:// or sftp://',
      ko: '저장소: s3://, b2:// 또는 sftp://',
      ja: '保存先: s3://、b2://、sftp://のいずれか',
    },
  },
  {
    name: 'ignore',
    value: '["*.tmp", ".DS_Store"]',
    note: { en: 'paths that are never uploaded', ko: '업로드하지 않는 경로', ja: 'アップロードしないパス' },
  },
  {
    name: 'every',
    value: '"30s"',
    note: {
      en: 'how often watch looks for changes',
      ko: 'watch가 변경을 확인하는 주기',
      ja: 'watchが変更を確認する間隔',
    },
  },
  {
    name: 'keep',
    value: '"90d"',
    note: {
      en: 'how long old snapshots are kept',
      ko: '오래된 스냅샷을 보관하는 기간',
      ja: '古いスナップショットを保持する期間',
    },
  },
  {
    name: 'on_conflict',
    value: '"keep-both"',
    note: {
      en: 'on a conflict, keep both versions',
      ko: '충돌이 나면 두 버전을 모두 보관',
      ja: '競合したら両方のバージョンを保持',
    },
  },
];

const CHANGELOG = {
  title: { en: 'Changelog', ko: '변경 기록', ja: '変更履歴' },
  releases: [
    {
      version: '0.9.2',
      date: '2026-11-04',
      note: {
        en: 'A push resumes after a dropped connection instead of starting over.',
        ko: '푸시는 연결이 끊겨도 처음부터 다시 시작하지 않고 이어서 진행합니다.',
        ja: 'プッシュは接続が切れても最初からやり直さず、途中から再開されます。',
      },
    },
    {
      version: '0.9.1',
      date: '2026-10-21',
      note: {
        en: 'Fixed a crash on file names that contain a line break.',
        ko: '줄바꿈이 들어 있는 파일 이름에서 발생하던 충돌을 고쳤습니다.',
        ja: '改行を含むファイル名でクラッシュする問題を修正しました。',
      },
    },
    {
      version: '0.9.0',
      date: '2026-09-30',
      note: {
        en: 'Added `watch`, which pushes and pulls whenever a file changes.',
        ko: '`watch`를 추가했습니다. 파일이 바뀔 때마다 보내고 받습니다.',
        ja: '`watch`を追加しました。ファイルが変わるたびに送信と受信を行います。',
      },
    },
    {
      version: '0.8.4',
      date: '2026-08-12',
      note: {
        en: 'The Windows build is signed and available through winget.',
        ko: 'Windows 빌드에 서명을 적용했으며 winget으로 설치할 수 있습니다.',
        ja: 'Windows版にコード署名を施し、wingetからインストールできるようにしました。',
      },
    },
    {
      version: '0.8.3',
      date: '2026-07-08',
      note: {
        en: '`restore` accepts a date as well as a snapshot id.',
        ko: '`restore`는 스냅샷 ID뿐 아니라 날짜도 받습니다.',
        ja: '`restore`はスナップショットIDに加えて日付も指定できます。',
      },
    },
  ] as Array<{ version: string; date: string; note: Tri }>,
};

const FOOTER = {
  source: {
    en: 'Source at `git.driftsync.dev/driftsync`',
    ko: '소스: `git.driftsync.dev/driftsync`',
    ja: 'ソース: `git.driftsync.dev/driftsync`',
  },
  license: {
    en: 'MIT license. Copyright 2026 the driftsync authors.',
    ko: 'MIT 라이선스. Copyright 2026 the driftsync authors.',
    ja: 'MITライセンス。Copyright 2026 the driftsync authors.',
  },
} satisfies Record<string, Tri>;

const PROMPTS: Record<Lang, string> = {
  en: `Design one real page in Cyber Console style — a near-black terminal page where three neon colours each carry one fixed meaning.

Pick a believable subject that lives in a terminal, such as a command-line tool, a self-hosted server, a database or a network utility, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #060608
--surface: #0e0f14
--text: #e8ecf4
--dim: #b4bacb
--muted: #8b91a5
--line: rgba(232,236,244,0.4)
--rule: rgba(232,236,244,0.24)
--magenta: #ff2db1
--lime: #a3ff2d
--cyan: #2df0ff
No other colours.

WHAT EACH COLOUR MEANS:
- Lime is ok: the prompt after a clean exit, the "ok" tag, a pane that is in sync.
- Magenta is changed, warned or failed: the "changed" and "warn" tags, a conflict (dark text on a magenta block), the prompt after a failed exit, a pane with something pending.
- Cyan is information and things to follow: command names, links, the "new" and "hint" tags, the copy control.
- A colour never appears without its meaning and never as decoration. Headlines and body text stay off-white.

THE ONE GLITCH:
- The wordmark carries a fixed one-pixel colour split: text-shadow -1px 0 magenta, 1px 0 cyan.
- It appears once on the page and does not move.

TYPOGRAPHY:
One family for everything: Martian Mono (variable, weight 400 to 800, width 75 to 112.5). Hierarchy comes from size, weight and the width axis.
Wordmark: 800, width 112.5, 1.75rem, tracking -0.04em
Headline: 700, width 112.5, tracking -0.045em, line-height 1.08, clamp(2rem, 5.3vw, 4.25rem)
Section headings: 600, width 112.5, tracking -0.04em, clamp(1.5rem, 2.6vw, 2rem)
Sub-headings: 600, 1.125rem, tracking -0.03em
Body: 400, 1rem, line-height 1.7, at most 62 characters to a line
Terminal text: 400 (500 on the command line), 0.875rem, line-height 1.75; on phones 0.8125rem at width 75, and 0.75rem below 347px, so lines still fit
Pane titles and table headings: 400, 0.8125rem
No second typeface.

LAYOUT:
- Header: the wordmark and in-page links.
- Hero: the headline and one sentence at full width, then one terminal window split into two panes (two machines side by side), then one sentence of facts.
- Commands: a ruled reference table (command, what it does, example); on phones each row folds into stacked lines.
- Under the table, a second split window: the output of one command beside the short script that reads its exit code.
- Install: tabs for each operating system over a one-line command with a copy control.
- Configuration: one config file in a window, each key with its comment.
- Changelog: versions and dates as ruled rows, newest first. Then one footer line with source and license.
- A full-width 1px line and 72px to 80px of space between sections. Max width about 1120px.

COMPONENTS:
- Window: a 1px frame split into panes the way a terminal multiplexer splits it. Each pane has a 2px top rule in the colour of its state, with the pane title and the state set into that rule. A faint 1px scanline every 3px is the only texture.
- Command line: the prompt, the command name in cyan, arguments in off-white. Output lines: a tag column 9 characters wide, then the message.
- Table: 1px rules only, no cell backgrounds. Command names in cyan at weight 600.
- Tabs: plain words; the active tab has a 1px border on three sides and is open at the bottom, so it runs into the window under it.
- Copy control: the underlined word "copy" in cyan. It reads "copied" in lime for a moment, or "failed" in magenta.
- Square corners everywhere. Focus is a 2px off-white outline.

MOTION:
- None. The cursor is a static block and nothing loops.
- Colour changes on hover and after a copy are instant.

FORBIDDEN:
- Glow, bloom and blurred neon shadows
- Gradient text and neon gradients
- Looping animation: blinking cursors, flicker, moving scanlines, typing effects
- Window chrome with coloured dots
- Glitch effects anywhere but the wordmark
- Cards, pills and rounded corners
- A small label above headings, and all-caps tracked labels
- A neon colour used outside its meaning
- A page about the style in place of a subject

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Each pane a labelled region with its transcript as text, working tabs and copy controls, visible focus`,
  ko: `Cyber Console 스타일로 실제 페이지 하나를 디자인한다. 거의 검은 터미널 페이지이며, 세 가지 네온 색은 각각 고정된 의미 하나만 가진다.

터미널에서 쓰는 그럴듯한 주제를 고른다. 예를 들면 명령줄 도구, 자체 호스팅 서버, 데이터베이스, 네트워크 유틸리티이며, 실제 내용을 작성한다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일에 관한 페이지로 읽혀서는 안 된다.

COLOR TOKENS:
--bg: #060608
--surface: #0e0f14
--text: #e8ecf4
--dim: #b4bacb
--muted: #8b91a5
--line: rgba(232,236,244,0.4)
--rule: rgba(232,236,244,0.24)
--magenta: #ff2db1
--lime: #a3ff2d
--cyan: #2df0ff
다른 색은 쓰지 않는다.

WHAT EACH COLOUR MEANS:
- 라임은 정상이다: 정상 종료 후의 프롬프트, "ok" 태그, 동기화된 패널.
- 마젠타는 변경, 경고 또는 실패다: "changed"와 "warn" 태그, 충돌(마젠타 블록 위의 어두운 글자), 실패 종료 후의 프롬프트, 대기 중인 항목이 있는 패널.
- 시안은 정보와 따라갈 대상이다: 명령어 이름, 링크, "new"와 "hint" 태그, 복사 컨트롤.
- 색은 의미 없이 나타나지 않으며 장식으로 쓰지 않는다. 제목과 본문 글자는 오프화이트를 유지한다.

THE ONE GLITCH:
- 워드마크에 고정된 1픽셀 색 분리를 적용한다: text-shadow -1px 0 magenta, 1px 0 cyan.
- 페이지에 한 번만 나타나며 움직이지 않는다.

TYPOGRAPHY:
모든 곳에 서체 하나를 쓴다: Martian Mono (variable, weight 400 to 800, width 75 to 112.5). 위계는 크기, 두께, 너비 축으로 만든다.
워드마크: 800, width 112.5, 1.75rem, tracking -0.04em
제목: 700, width 112.5, tracking -0.045em, line-height 1.08, clamp(2rem, 5.3vw, 4.25rem)
섹션 제목: 600, width 112.5, tracking -0.04em, clamp(1.5rem, 2.6vw, 2rem)
소제목: 600, 1.125rem, tracking -0.03em
본문: 400, 1rem, line-height 1.7, 한 줄은 최대 62자
터미널 텍스트: 400(명령줄은 500), 0.875rem, line-height 1.75. 휴대폰에서는 width 75의 0.8125rem, 347px 미만에서는 0.75rem을 써서 줄이 맞게 한다.
패널 제목과 표 제목: 400, 0.8125rem
두 번째 서체는 쓰지 않는다.

LAYOUT:
- 머리말: 워드마크와 페이지 내 링크.
- 히어로: 전체 너비의 제목과 문장 하나, 그다음 두 패널로 나뉜 터미널 창 하나(두 컴퓨터를 나란히 배치), 그다음 사실을 전하는 문장 하나.
- 명령어: 선이 그어진 참조 표(명령어, 하는 일, 예시). 휴대폰에서는 각 행을 세로로 쌓인 줄로 접는다.
- 표 아래에는 두 번째 분할 창을 둔다. 명령 하나의 출력과, 그 종료 코드를 읽는 짧은 스크립트를 나란히 보여 준다.
- 설치: 운영체제별 탭, 그 아래에 복사 컨트롤이 있는 한 줄 명령.
- 설정: 창 하나에 설정 파일 하나, 각 키에 주석을 함께 표시한다.
- 변경 기록: 버전과 날짜를 선이 그어진 행으로, 최신순으로 배치한다. 그다음 소스와 라이선스를 담은 바닥글 한 줄.
- 전체 너비의 1px 선과 섹션 사이 72px~80px 여백. 최대 너비는 약 1120px.

COMPONENTS:
- 창: 터미널 멀티플렉서가 나누는 방식대로 패널로 나뉜 1px 테두리. 각 패널은 상태 색의 2px 상단 선을 가지며, 패널 제목과 상태가 그 선 안에 놓인다. 3px마다 나타나는 흐릿한 1px 주사선이 유일한 질감이다.
- 명령줄: 프롬프트, 시안 색 명령어 이름, 오프화이트 인자. 출력 줄은 너비 9자의 태그 열 뒤에 메시지를 놓는다.
- 표: 1px 선만 쓰고 셀 배경은 없다. 명령어 이름은 두께 600의 시안 색.
- 탭: 일반 단어. 활성 탭은 세 면에 1px 테두리가 있고 아래가 열려 있어서, 그 아래의 창과 이어진다.
- 복사 컨트롤: 밑줄이 그어진 시안 색 "복사". 잠시 라임 색 "복사됨"으로, 또는 마젠타 색 "실패"로 바뀐다.
- 모서리는 모두 직각이다. 포커스는 2px 오프화이트 외곽선이다.

MOTION:
- 없음. 커서는 고정된 블록이며 아무것도 반복하지 않는다.
- 호버와 복사 후의 색 변화는 즉시 일어난다.

FORBIDDEN:
- 글로우, 블룸, 흐릿한 네온 그림자 금지
- 그라데이션 글자와 네온 그라데이션 금지
- 반복 애니메이션 금지: 깜빡이는 커서, 깜박임, 움직이는 주사선, 타이핑 효과
- 색 점이 있는 창 장식 금지
- 워드마크 외의 곳에 글리치 효과 금지
- 카드, 알약 모양 버튼, 둥근 모서리 금지
- 제목 위의 작은 라벨과 자간을 넓힌 대문자 라벨 금지
- 의미 밖에서 쓰는 네온 색 금지
- 주제 대신 스타일을 설명하는 페이지 금지

OUTPUT:
1) CSS 커스텀 속성
2) 시맨틱 HTML과 CSS
3) 320px까지 가로 스크롤 없이 반응형 레이아웃
4) 각 패널은 기록을 텍스트로 담은 이름 있는 영역으로 만들고, 탭과 복사 컨트롤이 작동하며 포커스가 보이게 한다.`,
  ja: `Cyber Console スタイルで実在するページを1つデザインする。ほぼ黒のターミナルページで、3色のネオンカラーがそれぞれ決まった意味を1つだけ持つ。

ターミナルで扱う現実味のある題材を選ぶ。例としてコマンドラインツール、セルフホストサーバー、データベース、ネットワークユーティリティがあり、実際の内容を書く。ページはその題材のページとして読めること。スタイルについてのページであってはならない。

COLOR TOKENS:
--bg: #060608
--surface: #0e0f14
--text: #e8ecf4
--dim: #b4bacb
--muted: #8b91a5
--line: rgba(232,236,244,0.4)
--rule: rgba(232,236,244,0.24)
--magenta: #ff2db1
--lime: #a3ff2d
--cyan: #2df0ff
ほかの色は使わない。

WHAT EACH COLOUR MEANS:
- ライム: 正常。正常終了後のプロンプト、"ok" タグ、同期済みのペイン。
- マゼンタ: 変更、警告、失敗。"changed" と "warn" タグ、競合（マゼンタのブロック上の暗い文字）、失敗終了後のプロンプト、未処理のものがあるペイン。
- シアン: 情報と、たどるべき対象。コマンド名、リンク、"new" と "hint" タグ、コピー操作。
- 色は意味なしに現れず、装飾として使わない。見出しと本文はオフホワイトのまま。

THE ONE GLITCH:
- ワードマークに固定の1ピクセルの色ずれを適用する: text-shadow -1px 0 magenta, 1px 0 cyan.
- ページに1回だけ現れ、動かない。

TYPOGRAPHY:
全体で1つのファミリーを使う: Martian Mono (variable, weight 400 to 800, width 75 to 112.5)。階層はサイズ、太さ、幅の軸で作る。
ワードマーク: 800, width 112.5, 1.75rem, tracking -0.04em
見出し: 700, width 112.5, tracking -0.045em, line-height 1.08, clamp(2rem, 5.3vw, 4.25rem)
セクション見出し: 600, width 112.5, tracking -0.04em, clamp(1.5rem, 2.6vw, 2rem)
小見出し: 600, 1.125rem, tracking -0.03em
本文: 400, 1rem, line-height 1.7, 1行は最大62文字
ターミナル文字: 400（コマンドラインは500）、0.875rem、line-height 1.75。スマートフォンでは width 75 の 0.8125rem、347px 未満では 0.75rem にして行が収まるようにする。
パネルのタイトルと表の見出し: 400, 0.8125rem
2つ目の書体は使わない。

LAYOUT:
- ヘッダー: ワードマークとページ内リンク。
- ヒーロー: 全幅の見出しと一文、続いて2つのパネルに分かれたターミナルウィンドウ1つ（2台のマシンを並べて表示）、最後に事実を伝える一文。
- コマンド: 罫線付きの参照表（コマンド、内容、例）。スマートフォンでは各行を縦に積んだ行に折りたたむ。
- 表の下に2つ目の分割ウィンドウを置く。1つのコマンドの出力と、その終了コードを読む短いスクリプトを並べる。
- インストール: 各OSのタブと、コピー操作付きの一行コマンド。
- 設定: ウィンドウ内に設定ファイル1つ。各キーにコメントを付ける。
- 変更履歴: バージョンと日付を罫線付きの行として、新しい順に並べる。続けて、ソースとライセンスを記したフッターの一行。
- 全幅1pxの線と、セクション間72px〜80pxの余白。最大幅は約1120px。

COMPONENTS:
- ウィンドウ: ターミナルのマルチプレクサが分割する方法どおりにパネルへ分けた1pxの枠。各パネルは状態の色の2pxの上罫線を持ち、パネルのタイトルと状態をその罫線の中に置く。3pxごとの薄い1pxの走査線が唯一のテクスチャー。
- コマンドライン: プロンプト、シアンのコマンド名、オフホワイトの引数。出力行は幅9文字のタグ欄の後にメッセージを置く。
- 表: 1pxの罫線のみ。セルの背景なし。コマンド名は太さ600のシアン。
- タブ: 普通の語。アクティブなタブは3辺に1pxの枠があり、下は開いているため、その下のウィンドウとつながる。
- コピー操作: 下線付きのシアンの「コピー」。一時的にライムで「完了」、またはマゼンタで「失敗」と表示される。
- 角は全て直角。フォーカスは2pxのオフホワイトの輪郭。

MOTION:
- なし。カーソルは固定されたブロックで、何も繰り返さない。
- ホバーとコピー後の色の変化は即座に行う。

FORBIDDEN:
- グロー、ブルーム、ぼかしたネオンの影 禁止
- グラデーションの文字とネオンのグラデーション 禁止
- 繰り返しアニメーション 禁止: 点滅するカーソル、ちらつき、動く走査線、タイピング効果
- 色の付いた点のあるウィンドウ装飾 禁止
- ワードマーク以外でのグリッチ効果 禁止
- カード、ピル型のボタン、角丸 禁止
- 見出しの上の小さなラベル、字間を広げた大文字のラベル 禁止
- 意味の外で使うネオンカラー 禁止
- 題材の代わりにスタイルを説明するページ 禁止

OUTPUT:
1) CSS カスタムプロパティ
2) セマンティックな HTML と CSS
3) 320pxまで、横スクロールなしのレスポンシブレイアウト
4) 各パネルは、記録をテキストで含むラベル付きの領域にする。タブとコピー操作は機能させ、フォーカスは見えるようにする。`,
};

// The copy control shows its answer for this long, then reads "copy" again.
const COPY_FEEDBACK_MS = 1600;

/** Writes to the clipboard and reports whether it worked. A page served without
    HTTPS has no Clipboard API, so it copies through a selected text area. */
async function writeClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // The browser refused. The control says so.
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
  // Selecting the text area took the focus from the control.
  if (focused instanceof HTMLElement) focused.focus();
  return ok;
}

/** Sets the words between backticks as code. */
const withCode = (text: string) =>
  text.split('`').map((part, index) => (index % 2 ? <code key={index}>{part}</code> : part));

/** The parts of a command, with each command name marked. */
const marked = (parts: Part[]) =>
  parts.map((part, index) => (typeof part === 'string' ? part : <b key={index}>{part.name}</b>));

function Command({ parts, id }: { parts: Part[]; id?: string }) {
  return <code id={id}>{marked(parts)}</code>;
}

function Output({ line }: { line: Line }) {
  return (
    <div className={line.tone ? `cc-${line.kind} is-${line.tone}` : `cc-${line.kind}`}>
      <b>{line.tag}</b>
      {line.cells.map((cell, index) => <span key={index}>{cell}</span>)}
    </div>
  );
}

export function PortedFusionCyberConsolePage({ lang }: PortedStylePageProps) {
  const [os, setOs] = useState<OsId>('macos');
  const [copied, setCopied] = useState<{ id: CopyId; ok: boolean } | null>(null);
  const t = (text: Tri) => text[lang];
  const system = INSTALL.systems.find((item) => item.id === os) ?? INSTALL.systems[0];

  // The answer of a copy control is timed here, not by an animation.
  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(null), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async (id: CopyId, command: Part[]) => {
    const ok = await writeClipboard(plain(command));
    setCopied({ id, ok });
  };

  // The control is named by its own word and by the command it copies, so the name
  // follows the word on the screen: "copy brew install driftsync", then "copied ...".
  const copyControl = (id: CopyId, command: Part[]) => {
    const state = copied?.id === id ? (copied.ok ? 'done' : 'failed') : 'idle';
    return (
      <button
        type="button"
        className={state === 'idle' ? 'cc-copy' : `cc-copy is-${state}`}
        id={`cc-copy-${id}`}
        aria-labelledby={`cc-copy-${id} cc-copy-${id}-text`}
        onClick={() => { void copy(id, command); }}
      >
        {t(COPY[state])}
      </button>
    );
  };

  const moveTab = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = INSTALL.systems.findIndex((item) => item.id === os);
    const last = INSTALL.systems.length - 1;
    const target =
      event.key === 'ArrowRight' ? (current === last ? 0 : current + 1)
      : event.key === 'ArrowLeft' ? (current === 0 ? last : current - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : -1;
    if (target < 0) return;
    event.preventDefault();
    setOs(INSTALL.systems[target].id);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
  };

  const steps = (list: Step[]) =>
    list.map((step) => (
      <div className="cc-step" key={plain(step.command)}>
        <div className="cc-cmd">
          <i>$</i>
          <Command parts={step.command} id={step.copy ? `cc-copy-${step.copy}-text` : undefined} />
          {step.copy ? copyControl(step.copy, step.command) : null}
        </div>
        {step.lines.map((line) => <Output line={line} key={line.tag + line.cells[0]} />)}
      </div>
    ));

  return (
    <FusionShell
      fusionId="fusion-cyber-console"
      lang={lang}
      tone="dark"
      accent="#2df0ff"
      prev={{ href: '/pages/fusion-kinetic-brutal.html', label: 'Kinetic × Brutal' }}
      next={{ href: '/pages/fusion-grain-mono.html', label: 'Analog Press' }}
      prompts={PROMPTS}
    >
      <div className="cc">
        <header className="cc-bar">
          <div className="cc-mark">driftsync</div>
          <nav className="cc-bar__nav" aria-label={t(HERO.nav)}>
            <a href="#cc-commands">{t(COMMANDS.title)}</a>
            <a href="#cc-install">{t(INSTALL.title)}</a>
            <a href="#cc-config">{t(CONFIG.title)}</a>
            <a href="#cc-changelog">{t(CHANGELOG.title)}</a>
          </nav>
        </header>

        <section className="cc-hero" aria-labelledby="cc-title">
          <h1 id="cc-title">{t(HERO.title)}</h1>
          <p className="cc-lede">{t(HERO.lede)}</p>

          <div className="cc-term cc-term--split" role="group" aria-label={t(HERO.window)}>
            <section className="cc-pane cc-pane--changed" aria-labelledby="cc-lathe-title cc-lathe-state">
              <div className="cc-pane__title" id="cc-lathe-title"><span>mira@</span>lathe: ~/notes</div>
              <div className="cc-pane__state" id="cc-lathe-state">{t(PANE_STATE.waiting)}</div>
              <div className="cc-tx">
                {steps(LATHE_STEPS)}
                <div className="cc-cmd"><i>$</i><span className="cc-cur cc-cur--idle" aria-hidden="true" /></div>
              </div>
            </section>

            <section className="cc-pane cc-pane--ok" aria-labelledby="cc-tern-title cc-tern-state">
              <div className="cc-pane__title" id="cc-tern-title"><span>mira@</span>tern: ~/notes</div>
              <div className="cc-pane__state" id="cc-tern-state">{t(PANE_STATE.synced)}</div>
              <div className="cc-tx">
                {steps(TERN_STEPS)}
                <div className="cc-cmd"><i>$</i><span className="cc-cur" aria-hidden="true" /></div>
              </div>
            </section>
          </div>

          <p className="cc-facts">{t(HERO.facts)}</p>
        </section>

        <section className="cc-section" id="cc-commands" aria-labelledby="cc-commands-title">
          <h2 id="cc-commands-title">{t(COMMANDS.title)}</h2>
          <p>{t(COMMANDS.body)}</p>
          <table className="cc-table" role="table" aria-labelledby="cc-commands-title">
            <thead role="rowgroup">
              <tr role="row">
                {COMMANDS.columns.map((column) => (
                  <th scope="col" role="columnheader" key={column.en}>{t(column)}</th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {COMMANDS.rows.map((row) => (
                <tr role="row" key={row.name}>
                  <th scope="row" role="rowheader">{row.name}</th>
                  <td role="cell" data-label={t(COMMANDS.columns[1])}>{t(row.does)}</td>
                  <td role="cell" data-label={t(COMMANDS.columns[2])}><i>$</i> <Command parts={row.example} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cc-sub">
            <h3>{t(STATUS.title)}</h3>
            <p>{t(STATUS.body)}</p>
            <div className="cc-term cc-term--split" role="group" aria-label={t(STATUS.window)}>
              <section className="cc-pane cc-pane--changed" aria-labelledby="cc-status-title cc-status-state">
                <div className="cc-pane__title" id="cc-status-title"><span>mira@</span>lathe: ~/notes</div>
                <div className="cc-pane__state" id="cc-status-state">{t(PANE_STATE.conflict)}</div>
                <div className="cc-tx">
                  <div className="cc-step">
                    <div className="cc-cmd"><i>$</i><Command parts={STATUS_COMMAND} /></div>
                    <Output line={STATUS_REMOTE} />
                  </div>
                  <div className="cc-step">
                    {STATUS_FILES.map((line) => <Output line={line} key={line.cells[0]} />)}
                  </div>
                  <div className="cc-step">
                    <Output line={STATUS_HINT} />
                  </div>
                  <div className="cc-cmd cc-cmd--failed">
                    <i>$</i>
                    <span className="cc-cur cc-cur--idle" aria-hidden="true" />
                    <span className="cc-exit">{STATUS_EXIT}</span>
                  </div>
                </div>
              </section>

              <section className="cc-pane" aria-labelledby="cc-script-title">
                <div className="cc-pane__title" id="cc-script-title"><span>mira@</span>lathe: ~/bin</div>
                <div className="cc-tx">
                  <div className="cc-step">
                    <div className="cc-cmd"><i>$</i><Command parts={[n('cat'), ' notes-sync']} /></div>
                    <div className="cc-src">#!/bin/sh</div>
                    <div className="cc-src"><b>driftsync status</b> --quiet</div>
                    <div className="cc-src">case $? in</div>
                    {EXIT_CASES.map((item) => (
                      <div className="cc-case" key={item.code}>
                        <div className="cc-src"><i>{`# ${item.code}: ${t(item.meaning)}`}</i></div>
                        <div className="cc-src">
                          {`${item.code}) `}
                          {marked(item.action)}
                        </div>
                      </div>
                    ))}
                    <div className="cc-src">esac</div>
                  </div>
                  <div className="cc-cmd"><i>$</i><span className="cc-cur" aria-hidden="true" /></div>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="cc-section" id="cc-install" aria-labelledby="cc-install-title">
          <h2 id="cc-install-title">{t(INSTALL.title)}</h2>
          <p>{t(INSTALL.body)}</p>
          <div className="cc-install">
            <div className="cc-tabs" role="tablist" aria-label={t(INSTALL.tabs)} onKeyDown={moveTab}>
              {INSTALL.systems.map((item) => (
                <button
                  type="button"
                  role="tab"
                  key={item.id}
                  id={`cc-tab-${item.id}`}
                  aria-selected={os === item.id}
                  aria-controls="cc-install-panel"
                  tabIndex={os === item.id ? 0 : -1}
                  onClick={() => setOs(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="cc-term" role="tabpanel" id="cc-install-panel" aria-labelledby={`cc-tab-${system.id}`} tabIndex={0}>
              <div className="cc-pane">
                <div className="cc-tx">
                  <div className="cc-cmd cc-cmd--bar">
                    <i>{system.prompt}</i>
                    <Command parts={system.command} id={`cc-copy-${system.id}-text`} />
                    <span className="cc-note">{t(system.needs)}</span>
                    {copyControl(system.id, system.command)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cc-section" id="cc-config" aria-labelledby="cc-config-title">
          <h2 id="cc-config-title">{t(CONFIG.title)}</h2>
          <p>{withCode(t(CONFIG.body))}</p>
          <div className="cc-term">
            <section className="cc-pane" aria-labelledby="cc-config-file">
              <div className="cc-pane__title" id="cc-config-file">{CONFIG_FILE}</div>
              <div className="cc-tx">
                {CONFIG_KEYS.map((key) => (
                  <div className="cc-key" key={key.name}>
                    <i>{`# ${t(key.note)}`}</i>
                    <b>{key.name}</b>
                    <span>{`= ${key.value}`}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="cc-sub">
            <h3>{t(CONFIG.keyTitle)}</h3>
            <p>{withCode(t(CONFIG.keyBody))}</p>
          </div>
        </section>

        <section className="cc-section" id="cc-changelog" aria-labelledby="cc-changelog-title">
          <h2 id="cc-changelog-title">{t(CHANGELOG.title)}</h2>
          <ol className="cc-log" reversed>
            {CHANGELOG.releases.map((release) => (
              <li key={release.version}>
                <b>{release.version}</b>
                <time dateTime={release.date}>{release.date}</time>
                <p>{withCode(t(release.note))}</p>
              </li>
            ))}
          </ol>
        </section>

        <footer className="cc-footer">
          <span>{withCode(t(FOOTER.source))}</span>
          <span>{t(FOOTER.license)}</span>
        </footer>

        <p className="cc-sr" role="status">{copied ? t(copied.ok ? COPY.saidDone : COPY.saidFailed) : ''}</p>
      </div>
    </FusionShell>
  );
}
