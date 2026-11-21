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
  nav: { en: 'This guide', ko: '이 가이드', ja: 'このガイド' },
  quick: { en: 'Quickstart', ko: '빠른 시작', ja: 'クイックスタート' },
  commands: { en: 'Commands', ko: '명령어', ja: 'コマンド' },
  wrong: { en: 'Troubleshooting', ko: '문제 해결', ja: 'トラブルシューティング' },
  version: { en: 'Version', ko: '버전', ja: 'バージョン' },
  older: {
    en: 'This is the guide for Lodestone {old}. The current release is {latest}: it adds `count` and file format 6, and it opens files made by 0.13, but 0.13 cannot open files written by 0.14.',
    ko: '이 가이드는 Lodestone {old} 버전용입니다. 현재 릴리스는 {latest}입니다. 이 버전은 `count`를 추가하고 파일 형식 6을 사용합니다. 0.13에서 만든 파일은 열 수 있지만, 0.13은 0.14에서 쓴 파일을 열 수 없습니다.',
    ja: 'このガイドは Lodestone {old} 向けです。現在のリリースは {latest} です。`count` を追加し、ファイル形式 6 を使います。0.13 で作られたファイルは開けますが、0.13 は 0.14 で書かれたファイルを開けません。',
  },
  toLatest: { en: 'Read the {latest} guide', ko: '{latest} 가이드 읽기', ja: '{latest} のガイドを読む' },
  shown: { en: 'Showing the guide for Lodestone {version}.', ko: 'Lodestone {version} 가이드를 보고 있습니다.', ja: 'Lodestone {version} のガイドを表示しています。' },
} satisfies Record<string, Tri>;

const HERO = {
  installWith: { en: 'Install with', ko: '설치 방법', ja: 'インストール方法' },
  title: { en: 'Getting started', ko: '시작하기', ja: 'はじめに' },
  titleSub: { en: 'with Lodestone', ko: 'Lodestone과 함께', ja: 'Lodestone で' },
  copyWhat: { en: 'the install command', ko: '설치 명령', ja: 'インストールコマンド' },
  lede: {
    en: 'Lodestone is a key-value database that runs inside your program and keeps everything in one file. In about ten minutes you will install it, write a few records from its shell, read them back with a range query, and open the same file from Python.',
    ko: 'Lodestone은 프로그램 안에서 실행되고 모든 데이터를 파일 하나에 보관하는 키-값 데이터베이스입니다. 약 10분 안에 설치하고, 셸에서 레코드 몇 개를 쓰고, 범위 질의로 다시 읽은 뒤, 같은 파일을 Python에서 여는 과정을 따라갑니다.',
    ja: 'Lodestone は、プログラムの中で動き、すべてのデータを1つのファイルに保存するキーバリューデータベースです。約10分で、インストール、シェルでのレコード書き込み、範囲クエリでの読み出し、同じファイルの Python からのオープンまで進みます。',
  },
  runsOn: { en: 'Runs on', ko: '지원 환경', ja: '動作環境' },
  runsOnValue: {
    en: 'macOS 13 or later, Linux with glibc 2.31 or later, Windows 10 or later',
    ko: 'macOS 13 이상, glibc 2.31 이상의 Linux, Windows 10 이상',
    ja: 'macOS 13 以降、glibc 2.31 以降の Linux、Windows 10 以降',
  },
  footprint: { en: 'Footprint', ko: '용량', ja: 'サイズ' },
  footprintValue: { en: 'One {size} MB binary. No server, no config file.', ko: '{size} MB 바이너리 하나. 서버도 설정 파일도 없습니다.', ja: '{size} MB のバイナリ1つ。サーバーも設定ファイルも不要です。' },
  forStep: { en: 'For step 4', ko: '4단계 요구 사항', ja: '手順4の要件' },
  forStepValue: { en: 'Python {python} or later', ko: 'Python {python} 이상', ja: 'Python {python} 以降' },
} satisfies Record<string, Tri>;

const QUICK = {
  title: { en: 'From an empty file to your first query', ko: '빈 파일에서 첫 질의까지', ja: '空のファイルから最初のクエリまで' },
  note: {
    en: 'Keep the shell from the install open. Type what follows `shop.db>`; the lines without a prompt are what Lodestone prints back.',
    ko: '설치할 때 열어 둔 셸을 그대로 두세요. `shop.db>` 뒤에 오는 내용을 입력하고, 프롬프트가 없는 줄은 Lodestone이 출력한 내용입니다.',
    ja: 'インストール時に開いたシェルはそのまま使ってください。`shop.db>` の後ろに続く内容を入力します。プロンプトのない行は Lodestone が出力した内容です。',
  },
} satisfies Record<string, Tri>;

interface Step {
  title: Tri;
  body: Tri[];
  lines: (version: Version) => Line[];
}

const STEPS: Step[] = [
  {
    title: { en: 'Write a few keys', ko: '키 몇 개 저장하기', ja: 'キーをいくつか書き込む' },
    body: [
      {
        en: 'Store two users and an order. Keys are plain strings, and Lodestone keeps them sorted byte by byte, so keys that share a prefix such as `user:` sit next to each other in the file.',
        ko: '사용자 두 명과 주문 한 건을 저장합니다. 키는 일반 문자열이며, Lodestone은 바이트 순서대로 정렬해 저장합니다. 그래서 `user:`처럼 접두사가 같은 키는 파일 안에서도 서로 붙어 있습니다.',
        ja: 'ユーザー2人と注文1件を保存します。キーは通常の文字列で、Lodestone はバイト順に並べて保存します。そのため `user:` のように接頭辞が同じキーは、ファイル内でも隣り合って並びます。',
      },
      { en: 'Values can be anything. The shell stores JSON exactly as you type it.', ko: '값은 무엇이든 될 수 있습니다. 셸은 입력한 JSON을 그대로 저장합니다.', ja: '値には何を入れても構いません。シェルは入力したJSONをそのまま保存します。' },
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
    title: { en: 'Read one back', ko: '하나 읽어 보기', ja: '1件読み出す' },
    body: [
      {
        en: '`get` prints the value as you stored it. A key that was never written prints `(none)`. That is an answer, not an error, so a script can test for it.',
        ko: '`get`은 저장한 값을 그대로 출력합니다. 한 번도 쓰지 않은 키는 `(none)`을 출력합니다. 이는 오류가 아니라 응답이므로, 스크립트에서 이 결과를 확인해 분기할 수 있습니다.',
        ja: '`get` は保存した値をそのまま出力します。一度も書き込んでいないキーは `(none)` を出力します。これはエラーではなく応答なので、スクリプトで判定に使えます。',
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
    title: { en: 'Run your first range query', ko: '첫 범위 질의 실행하기', ja: '最初の範囲クエリを実行する' },
    body: [
      {
        en: 'Add two more orders, one of them a day later. Then `scan` the prefix for 20 November: it walks every key that starts with it, in order, and stops at the first key that does not.',
        ko: '주문을 두 건 더 추가하세요. 그중 하나는 하루 뒤 날짜입니다. 그다음 11월 20일 접두사를 `scan`합니다. 이 명령은 접두사로 시작하는 키를 순서대로 모두 읽고, 접두사가 맞지 않는 첫 키에서 멈춥니다.',
        ja: '注文をさらに2件追加します。そのうち1件は1日後の日付です。次に、11月20日の接頭辞を `scan` します。このコマンドは接頭辞で始まるキーを順番にすべて読み、接頭辞に一致しない最初のキーで止まります。',
      },
      {
        en: "Most programs built on Lodestone are a handful of scans like this one: one day's orders, one user's sessions.",
        ko: "Lodestone으로 만든 프로그램은 대부분 이런 스캔 몇 개로 이루어집니다. 예를 들면 하루치 주문이나 사용자 한 명의 세션 같은 것입니다.",
        ja: "Lodestone で作られたプログラムの多くは、このようなスキャンをいくつか組み合わせたものです。たとえば1日分の注文や、ユーザー1人のセッションなどです。",
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
    title: { en: 'Open the same file from Python', ko: 'Python에서 같은 파일 열기', ja: 'Python で同じファイルを開く' },
    body: [
      {
        en: 'Quit the shell first, because one process writes to a file at a time. Install the Python package, save the six lines below as `report.py` next to `shop.db`, and run it.',
        ko: '한 번에 한 프로세스만 파일에 쓸 수 있으므로 먼저 셸을 종료하세요. Python 패키지를 설치한 뒤, 아래 여섯 줄을 `shop.db`와 같은 폴더에 `report.py`로 저장하고 실행하세요.',
        ja: 'ファイルへの書き込みは一度に1つのプロセスだけなので、先にシェルを終了してください。Python パッケージをインストールし、下の6行を `shop.db` と同じフォルダに `report.py` として保存して実行します。',
      },
      { en: "The script runs the scan from step 3 and prints each order's total.", ko: '이 스크립트는 3단계의 스캔을 실행하고, 각 주문의 합계를 출력합니다.', ja: 'このスクリプトは手順3のスキャンを実行し、各注文の合計を出力します。' },
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
  title: { en: 'Shell commands', ko: '셸 명령어', ja: 'シェルのコマンド' },
  note: {
    en: 'Everything the shell understands. Wrap a key or value that contains spaces in single quotes.',
    ko: '셸이 이해하는 모든 명령입니다. 공백이 들어 있는 키나 값은 작은따옴표로 감싸세요.',
    ja: 'シェルが解釈するすべてのコマンドです。空白を含むキーや値は、シングルクォートで囲んでください。',
  },
  filter: { en: 'Filter commands', ko: '명령 필터', ja: 'コマンドの絞り込み' },
  placeholder: { en: 'scan, backup, prefix', ko: 'scan, backup, 접두사', ja: 'scan, backup, 接頭辞' },
  all: { en: '{total} commands', ko: '명령 {total}개', ja: '{total} 件のコマンド' },
  some: { en: '{shown} of {total} commands', ko: '명령 {total}개 중 {shown}개', ja: '{total} 件中 {shown} 件のコマンド' },
  matched: { en: '{shown} of {total} commands match “{query}”.', ko: '검색어 “{query}”: 명령 {total}개 중 {shown}개 일치.', ja: '“{query}” の一致: {total} 件中 {shown} 件。' },
  none: { en: 'No command matches “{query}”.', ko: '“{query}”에 맞는 명령이 없습니다.', ja: '“{query}” に一致するコマンドはありません。' },
  noneHint: {
    en: 'Search by command, by what it does, or by part of an example, such as a key prefix.',
    ko: '명령 이름, 기능 설명, 예시의 일부(예: 키 접두사)로 검색해 보세요.',
    ja: 'コマンド名、機能の説明、例の一部（キーの接頭辞など）で検索してください。',
  },
  clear: { en: 'Clear the filter', ko: '필터 지우기', ja: 'フィルターを解除' },
  colCommand: { en: 'Command', ko: '명령', ja: 'コマンド' },
  colDoes: { en: 'What it does', ko: '기능', ja: '機能' },
  colExample: { en: 'Example', ko: '예시', ja: '例' },
  copyWhat: { en: 'the {name} example', ko: '{name} 예시', ja: '{name} の例' },
  since: { en: 'Added in 0.14.0.', ko: '0.14.0에 추가됨.', ja: '0.14.0 で追加。' },
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
    does: { en: 'Writes a value. A value already stored under that key is replaced.', ko: '값을 씁니다. 같은 키에 이미 저장된 값이 있으면 새 값으로 바꿉니다.', ja: '値を書き込みます。同じキーに既に値がある場合は置き換えます。' },
    example: 'put user:1043 {"plan":"team"}',
  },
  {
    name: 'get',
    syntax: 'get <key>',
    does: { en: 'Prints the value, or `(none)` if the key was never written.', ko: '값을 출력합니다. 한 번도 쓰지 않은 키이면 `(none)`을 출력합니다.', ja: '値を出力します。一度も書き込んでいないキーの場合は `(none)` を出力します。' },
    example: 'get user:1043',
  },
  {
    name: 'del',
    syntax: 'del <key>',
    does: { en: 'Removes a key. Removing a key that is not there does nothing.', ko: '키를 삭제합니다. 없는 키를 삭제해도 아무 일도 일어나지 않습니다.', ja: 'キーを削除します。存在しないキーを削除しても何も起こりません。' },
    example: 'del session:8fa1c2',
  },
  {
    name: 'scan',
    syntax: 'scan <prefix> --limit <n>',
    does: {
      en: 'Lists keys that start with the prefix, in order. Without `--limit` it lists all of them.',
      ko: '접두사로 시작하는 키를 순서대로 나열합니다. `--limit`을 생략하면 모두 나열합니다.',
      ja: '接頭辞で始まるキーを順番に一覧表示します。`--limit` を省略すると、すべて表示します。',
    },
    example: 'scan order:2026-11- --limit 20',
  },
  {
    name: 'range',
    syntax: 'range <from> <to>',
    does: { en: 'Lists keys from *from* up to, but not including, *to*.', ko: '*from* 이상 *to* 미만의 키를 나열합니다.', ja: '*from* 以上、*to* 未満のキーを一覧表示します。' },
    example: 'range user:1000 user:2000',
  },
  {
    name: 'count',
    syntax: 'count <prefix>',
    does: { en: 'Counts the keys under a prefix without reading their values.', ko: '값을 읽지 않고 접두사 아래의 키 개수만 셉니다.', ja: '値を読まずに、接頭辞の下にあるキーの数だけを数えます。' },
    example: 'count order:2026-11-',
    added014: true,
  },
  {
    name: '.backup',
    syntax: '.backup <file>',
    does: {
      en: 'Writes a consistent copy. Other processes can keep reading while it runs.',
      ko: '일관된 복사본을 씁니다. 실행 중에도 다른 프로세스가 계속 읽을 수 있습니다.',
      ja: '整合性のとれたコピーを書き出します。実行中も、他のプロセスは読み出しを続けられます。',
    },
    example: '.backup backup/shop-1121.db',
    dot: true,
  },
  {
    name: '.stats',
    syntax: '.stats',
    does: { en: 'Shows the file size, key count and free pages.', ko: '파일 크기, 키 개수, 빈 페이지 수를 표시합니다.', ja: 'ファイルサイズ、キーの数、空きページ数を表示します。' },
    example: '.stats',
    dot: true,
  },
  {
    name: '.quit',
    syntax: '.quit',
    does: {
      en: 'Finishes any write in progress, closes the file and leaves the shell.',
      ko: '진행 중인 쓰기를 마친 뒤 파일을 닫고 셸을 종료합니다.',
      ja: '進行中の書き込みを完了させてからファイルを閉じ、シェルを終了します。',
    },
    example: '.quit',
    dot: true,
  },
];

const WRONG = {
  title: { en: 'When things go wrong', ko: '문제가 생겼을 때', ja: 'うまくいかないとき' },
  note: {
    en: 'The two errors people hit most often in their first week, and what to do about each.',
    ko: '처음 일주일 동안 사람들이 가장 자주 겪는 오류 두 가지와 각각의 해결 방법입니다.',
    ja: '最初の1週間で最もよく見かける2つのエラーと、それぞれの対処法です。',
  },
  copyWhat: { en: 'the fix', ko: '해결 코드', ja: '修正コード' },
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
    title: { en: 'LockedError: shop.db is locked for writing', ko: 'LockedError: shop.db가 쓰기용으로 잠겨 있습니다', ja: 'LockedError: shop.db は書き込み用にロックされています' },
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
        ko: '파일 하나에 쓰기 권한을 가질 수 있는 프로세스는 하나뿐이고, 셸과 `lodestone.open()`은 기본적으로 모두 쓰기 권한을 요청합니다. 프로세스 48213은 1단계에서 열어 둔 셸로, 다른 창에 아직 떠 있습니다.',
        ja: 'ファイルの書き込み権限を保持できるプロセスは1つだけです。シェルも `lodestone.open()` も、既定では書き込み権限を要求します。プロセス 48213 は手順1で開いたままのシェルで、別のウィンドウに残っています。',
      },
      {
        en: 'Quit that shell with `.quit`, or open the file read-only, which any number of processes can do at once:',
        ko: '`.quit`으로 그 셸을 종료하거나, 여러 프로세스가 동시에 열 수 있는 읽기 전용으로 파일을 여세요:',
        ja: 'そのシェルは `.quit` で終了するか、複数のプロセスが同時に開ける読み取り専用でファイルを開いてください:',
      },
    ],
    fix: [{ out: 'db = lodestone.open("shop.db", read_only=True)' }],
    copy: 'db = lodestone.open("shop.db", read_only=True)',
  },
  {
    id: 'checksum',
    title: { en: 'Checksum mismatch after copying a file', ko: '파일을 복사한 뒤 체크섬 불일치', ja: 'ファイルをコピーした後のチェックサム不一致' },
    lines: [
      { ps: HOME, cmd: 'cp shop.db backup/shop.db' },
      { ps: HOME, cmd: 'lode shell backup/shop.db' },
      { bad: 'error: checksum mismatch on page 1832 of backup/shop.db' },
      { out: 'the page changed while the file was being read' },
    ],
    body: [
      {
        en: '`cp` read `shop.db` while your program was in the middle of a write, so the copy holds one half-written page. The original file is fine.',
        ko: '프로그램이 쓰기 도중일 때 `cp`가 `shop.db`를 읽었기 때문에, 복사본에는 반만 쓰인 페이지가 하나 들어 있습니다. 원본 파일은 괜찮습니다.',
        ja: 'プログラムが書き込みの途中のときに `cp` が `shop.db` を読んだため、コピーには書きかけのページが1つ含まれています。元のファイルは問題ありません。',
      },
      {
        en: 'Delete the broken copy. Make copies with `lode backup`, which waits for the write in progress (inside the shell it is `.backup`), and check them with `lode verify`:',
        ko: '깨진 복사본은 삭제하세요. 복사는 `lode backup`으로 만드세요. 이 명령은 진행 중인 쓰기가 끝날 때까지 기다립니다(셸 안에서는 `.backup`입니다). 복사본은 `lode verify`로 확인하세요:',
        ja: '壊れたコピーは削除してください。コピーは `lode backup` で作成します。このコマンドは実行中の書き込みが終わるまで待機します（シェル内では `.backup`）。コピーの確認には `lode verify` を使います:',
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
  next: { en: 'Next in the guide:', ko: '이 가이드의 다음 장:', ja: 'このガイドの次の章:' },
  nextTitle: { en: 'Transactions and snapshots', ko: '트랜잭션과 스냅샷', ja: 'トランザクションとスナップショット' },
  licence: { en: 'Lodestone {version} is released under the MIT licence.', ko: 'Lodestone {version}은 MIT 라이선스로 배포됩니다.', ja: 'Lodestone {version} は MIT ライセンスで公開されています。' },
} satisfies Record<string, Tri>;

const COPY = {
  idle: { en: 'Copy', ko: '복사', ja: 'コピー' },
  done: { en: 'Copied', ko: '복사됨', ja: 'コピーしました' },
  failed: { en: 'Failed', ko: '실패', ja: '失敗' },
  saidDone: { en: 'Copied: {text}', ko: '복사됨: {text}', ja: 'コピーしました: {text}' },
  saidFailed: {
    en: 'The browser did not allow the copy. Select the command and copy it by hand.',
    ko: '브라우저에서 복사가 허용되지 않았습니다. 명령을 직접 선택해 복사하세요.',
    ja: 'ブラウザでコピーが許可されませんでした。コマンドを選択して手動でコピーしてください。',
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

const PROMPT_KO = `Terminal Core 스타일로 실제 페이지 한 장을 디자인하세요. 거의 검은 화면 위의 녹색 인광 글자, 둥근 인광 테두리와 스캔라인이 있는 터미널 창, 그 밖의 모든 요소는 구분선과 반전 표시로 구성합니다.

독자가 명령줄에서 일하는 실제 주제를 고르고, 그 제품의 실제 문서를 쓰세요. 예를 들면 데이터베이스, 빌드 도구, 동기화 데몬 같은 것입니다. 페이지는 스타일을 소개하는 페이지가 아니라 그 제품의 페이지로 읽혀야 합니다. 여기서는 내장형 키-값 데이터베이스 Lodestone의 시작 가이드입니다. 설치하고, 셸에서 키를 쓰고, 범위 질의로 다시 읽고, 같은 파일을 Python에서 열고, 사람들이 가장 먼저 겪는 오류 두 가지를 고칩니다.

TOKENS:
--bg: #071109 (페이지 배경. 4px마다 2px 굵기의 #061007 선이 깔림)
--surface: #0a190c (터미널 제목 표시줄, 페이지 위에 열리는 모든 메뉴)
--screen: #08140a (터미널 내부, 수정 블록, 필터 입력란. 히어로 화면은 #0d2311에서 시작하는 방사형 광원이 되어 가장자리에서 #061008로 사라짐)
--ink: #b9ffbe
--hi: #e2ffe4 (사용자가 입력하는 내용, 코드, 목록에 나온 파일, 필터 글자)
--out: #8fd697 (프로그램이 출력하는 내용, 보조 텍스트, 링크, 비활성 탭, 버전 값)
--dim: #67ad6e (정의 용어, 표 머리글, Version 라벨, 플레이스홀더, 구문 플레이스홀더, 줄 번호, 라이선스 줄)
--accent: #d4ff5c
--accent-wash: rgba(212,255,92,0.1)
--line: #2f7d37 (테두리, 구분선, 컨트롤 테두리)
--line-2: #24602a (목록이나 표 안의 행)

COLOUR:
- 인광 녹색은 거의 검은 바탕 위에서만 씁니다. 강조색은 프롬프트, 배너 둘째 줄, 단계 번호, 명령 이름, 오류 제목과 오류 줄, 이전 버전 안내의 구분선, 커서, 포커스 링에만 씁니다. 다른 곳에는 쓰지 않습니다. 오류에 빨간색을 쓰지 않습니다. 오류 줄은 --accent-wash 배경 위의 강조색 글자로, 왼쪽에 3px 강조색 선을 두고 화면 전체 너비로 펼칩니다.
- 본문의 인라인 코드는 rgba(185,255,190,0.09) 배경에 놓입니다.
- 글로우: 배너, H2, 워드마크, 다음 장 제목에는 0 0 10px rgba(185,255,190,0.5)와 0 0 34px rgba(185,255,190,0.2)를 줍니다. 단계 번호에는 0 0 14px rgba(212,255,92,0.35)를 줍니다.
- 반전 표시: 선택된 탭은 --ink 배경에 --bg 글자를 씁니다. 호버 시 링크와 탭은 --hi로 밝아지고, 버튼, 버전 선택기, 필터 입력란에는 --ink 테두리가 생깁니다.

TYPOGRAPHY:
글꼴은 두 계열을 씁니다. VT323(400, 이 글꼴의 유일한 굵기)은 셸이 출력하는 글자입니다. 타이틀 배너, H2, H3, 단계 번호, 오류 제목, 워드마크, 빈 필터 메시지, 다음 장 제목에 씁니다. Inconsolata 400은 본문과, 세션에서 입력되거나 출력되는 모든 글자를 담당합니다. 그래서 명령은 문장 속에서나 프롬프트에서나 같아 보입니다. 모든 곳에서 합자를 끕니다.
타이틀 배너(H1): VT323, clamp(2.5rem, min(12.5vw, 14.5vh), 9rem), 줄 간격 0.8, 두 줄, 둘째 줄은 강조색. 히어로 터미널 안에 출력되며, 셸을 여는 명령과 셸의 인사말 사이에 놓입니다.
H2: VT323 clamp(2.75rem, 5.2vw, 4.25rem), 줄 간격 0.9. H3: VT323 2.25rem, 줄 간격 1. 오류 제목: VT323 clamp(1.875rem, 3.2vw, 2.625rem), 줄 간격 1.02, 강조색. 단계 번호: VT323 4.5rem(휴대폰에서는 3rem). 워드마크: VT323 2.375rem(휴대폰에서는 2rem, 400px 미만에서는 1.625rem). 다음 장 제목: VT323 2.5rem. 빈 필터 메시지: VT323 2.25rem.
본문: Inconsolata 1.125rem, 줄 간격 1.6(휴대폰에서는 1.0625rem). 도입 문단(lede)은 1.375rem, 줄 간격 1.5(휴대폰에서는 1.1875rem). 세션: 1.0625rem, 줄 간격 1.55(휴대폰에서는 1rem). 명령 이름: 1.0625rem. 컨트롤: 1rem, 필터 입력란은 1.0625rem. 1rem보다 작은 글자는 쓰지 않습니다. 대문자에 자간을 넓힌 라벨은 쓰지 않습니다.

LAYOUT:
- 1px 구분선 위의 문서 막대: 블록 커서가 있는 워드마크, 페이지 안 링크 세 개(860px 미만에서는 막대 밖으로 빠짐), 보이는 라벨이 있는 버전 선택기.
- 히어로: 터미널 창 전체가 1280x800 노트북의 첫 화면에 들어옵니다. 제목 표시줄에는 설치 방법 탭, 작업 디렉터리, 복사 버튼이 있습니다. 화면에는 설치 과정이 출력된 뒤, "lode shell shop.db", 배너, 셸의 인사말과 블록 커서가 차례로 나옵니다. 그 아래에는 12열 중 7열에 도입 문단이, 마지막 4열에는 필요 조건 목록이 구분선과 함께 놓입니다.
- 빠른 시작: 3열에 걸친 네 단계. 번호와 그 아래로 내려가는 2px 선, 단계 본문, 그리고 단계마다 이어지는 셸 세션 하나가 오른쪽에 놓입니다. 세션의 구간들은 1px 점선으로 이어집니다. 1024px 미만에서는 각 단계의 세션이 본문 아래 자기 테두리를 가집니다. 560px 미만에서는 번호가 별도 줄에 놓입니다.
- 명령 참조: 개수가 표시되는 필터 입력란, 그다음 명령, 기능, 복사 버튼이 있는 예시로 이루어진 표. 점 명령은 2px 구분선 아래에 놓입니다. 860px 미만에서는 각 행이 세로로 쌓입니다.
- 오류: 각 오류는 제목, 그다음 터미널입니다. 터미널에는 7열을 차지하는 역추적(오류 줄 강조 표시 포함)이 있고, 마지막 5열에는 설명과, 복사 버튼이 있는 테두리 블록의 해결 방법이 있습니다. 1024px 미만에서는 세로로 쌓입니다.
- 1120px 열, 섹션 간격 120px(860px 미만에서는 88px).

COMPONENTS:
- 터미널 창: 2px --line 테두리, 14px 둥근 모서리, 46px 제목 표시줄(--surface), 화면은 --screen 바탕에 3px마다 rgba(0,0,0,0.16) 1px 줄이 덮입니다. 1px #0a2010 링, 0 0 56px rgba(47,125,55,0.16) 외부 글로우, 0 24px 40px rgba(0,0,0,0.45) 그림자.
- 설치 탭(brew, curl, cargo, pip): 방향키, Home, End 키로 움직이는 로빙 포커스를 가진 실제 탭 목록. 패널은 설치 세션이며, 각 방법은 자기 명령을 입력하고 자기 출력을 보여 줍니다.
- 버전 선택기: v0.14.2 또는 v0.13.4. 이전 버전을 고르면 막대 아래에 안내 문구(3px 강조색 선, --accent-wash 배경)가 나타나고, 현재 릴리스로 돌아가는 버튼이 함께 나옵니다. 페이지의 모든 버전 번호, 파일 크기, Python 요구 사항, 설치 명령은 이 선택을 따릅니다. 나중에 추가된 명령은 참조에서 빠집니다.
- 복사 버튼: 정사각형, 1px --line 테두리, 높이 32px(휴대폰에서는 44px). 프롬프트를 뺀 명령을 복사하고, 2초 동안 "복사됨"을 표시하며, polite 라이브 영역으로 이를 알립니다.
- 명령 필터: 1px --line 테두리의 라벨이 있는 입력란. 옆에 개수가 표시되며, 결과가 없으면 검색어를 보여 주는 빈 상태가 나오고, 여기에는 필터를 지우고 포커스를 입력란으로 되돌리는 버튼이 있습니다.
- 모든 컨트롤의 모서리는 직각입니다. 둥근 모서리는 터미널 테두리(14px)와 수정 블록(10px)에만 씁니다.

MOTION:
- 없음. 커서는 깜빡이지 않으며, 아무것도 저절로 움직이지 않습니다.

FORBIDDEN:
- 카드, 알약 모양 태그, 칩, 배지, 인광 녹색 이외의 색을 쓴 네온, 스캔라인과 히어로 화면의 광원 외의 그라데이션
- 제목 위의 작은 라벨, 대문자에 자간을 넓힌 라벨, 실제 순서가 아닌 것에 붙은 숫자
- 타이핑 애니메이션, 깜빡이는 커서, 떨어지는 코드 비, ASCII 아트 로고, CRT 곡면, 깜빡임
- 해커, 레트로 컴퓨팅, 터미널을 미학으로 다루는 문구
- 이모지, 일러스트, 링크의 화살표, 가운뎃점으로 이은 메타 문자열

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 지정 속성
2) 시맨틱 HTML: 설치용 탭 목록과 패널, 단계용 순서 목록, 명령용 명시적 역할을 가진 표, 오류용 article
3) 작동하는 탭, 안내 문구가 있는 버전 선택기, 확인 표시가 있는 복사 버튼, 개수와 빈 상태가 있는 필터
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서 모든 컨트롤은 최소 44px 높이
5) 모든 컨트롤에 보이는 포커스, 복사와 버전 변경과 필터 결과를 알리는 polite 라이브 영역`;

const PROMPT_JA = `Terminal Core のスタイルで、実在感のあるページを1枚デザインしてください。ほぼ黒の画面に緑の蛍光文字、丸い蛍光枠と走査線のあるターミナルウィンドウ。それ以外の要素はすべて罫線と反転表示で構成します。

読者がコマンドラインで作業する題材（データベース、ビルドツール、同期デーモンなど）を選び、その製品の実際のドキュメントを書いてください。ページはスタイルについてのページではなく、その製品のページとして読めなければなりません。ここでは、組み込み型キーバリューデータベース Lodestone の入門ガイドです。インストール、シェルでのキー書き込み、範囲クエリでの読み出し、同じファイルの Python からのオープン、利用者が最初に遭遇する2つのエラーの対処を扱います。

TOKENS:
--bg: #071109（ページの背景。4px ごとに #061007 の 2px 罫線）
--surface: #0a190c（ターミナルのタイトルバー、ページの上に開くメニュー）
--screen: #08140a（ターミナルの内側、修正ブロック、フィルター入力欄。ヒーローの画面は #0d2311 から始まる放射状の光だまりになり、端では #061008 に消える）
--ink: #b9ffbe
--hi: #e2ffe4（利用者が入力する内容、コード、一覧のファイル、フィルターの文字）
--out: #8fd697（プログラムの出力、補助テキスト、リンク、非選択のタブ、バージョンの値）
--dim: #67ad6e（定義語、表の見出し、Version ラベル、プレースホルダー、構文のプレースホルダー、行番号、ライセンス行）
--accent: #d4ff5c
--accent-wash: rgba(212,255,92,0.1)
--line: #2f7d37（枠、罫線、コントロールの枠線）
--line-2: #24602a（一覧や表の中の行）

COLOUR:
- 蛍光の緑は、ほぼ黒の背景の上にだけ使う。アクセントは、プロンプト、バナーの2行目、手順番号、コマンド名、エラーの見出しとエラー行、古いバージョンの注記の罫線、カーソル、フォーカスリングにだけ使い、それ以外には使わない。エラーに赤は使わない。エラー行は --accent-wash の背景の上にアクセント色の文字を置き、左に3pxのアクセント罫線を付けて、画面の全幅に広げる。
- 本文中のインラインコードは rgba(185,255,190,0.09) の背景に置く。
- グロー：バナー、H2、ワードマーク、次の章の見出しには 0 0 10px rgba(185,255,190,0.5) と 0 0 34px rgba(185,255,190,0.2) を付ける。手順番号には 0 0 14px rgba(212,255,92,0.35) を付ける。
- 反転表示：選択中のタブは --ink の背景に --bg の文字。ホバー時は、リンクとタブが --hi に明るくなり、ボタン、バージョン選択、フィルター入力欄に --ink の枠線が付く。

TYPOGRAPHY:
フォントは2系統を使う。VT323（400、唯一のウェイト）は、シェルが出力する文字に使う。タイトルバナー、H2、H3、手順番号、エラー見出し、ワードマーク、フィルターの空状態メッセージ、次の章の見出し。Inconsolata 400 は本文と、セッションで入力・出力されるすべての文字に使う。そのため、文中のコマンドもプロンプトのコマンドも同じに見える。合字はすべて無効にする。
タイトルバナー（H1）：VT323、clamp(2.5rem, min(12.5vw, 14.5vh), 9rem)、行の高さ 0.8、2行、2行目はアクセント色。ヒーローのターミナル内に、シェルを開くコマンドとシェルの挨拶の間に出力される。
H2：VT323 clamp(2.75rem, 5.2vw, 4.25rem)、行の高さ 0.9。H3：VT323 2.25rem、行の高さ 1。エラー見出し：VT323 clamp(1.875rem, 3.2vw, 2.625rem)、行の高さ 1.02、アクセント色。手順番号：VT323 4.5rem（スマートフォンでは 3rem）。ワードマーク：VT323 2.375rem（スマートフォンでは 2rem、400px 未満では 1.625rem）。次の章：VT323 2.5rem。フィルターの空状態メッセージ：VT323 2.25rem。
本文：Inconsolata 1.125rem、行の高さ 1.6（スマートフォンでは 1.0625rem）。導入文（lede）は 1.375rem、行の高さ 1.5（スマートフォンでは 1.1875rem）。セッション：1.0625rem、行の高さ 1.55（スマートフォンでは 1rem）。コマンド名：1.0625rem。コントロール：1rem。フィルター入力欄は 1.0625rem。1rem 未満の文字は使わない。大文字で字間を空けたラベルは使わない。

LAYOUT:
- 1px の罫線の上にあるドキュメントバー：カーソルブロック付きのワードマーク、ページ内リンク3つ（860px 未満ではバーの外へ出る）、見えるラベル付きのバージョン選択。
- ヒーロー：ターミナルウィンドウ全体が、1280x800 のノートPCの最初の画面に収まる。タイトルバーには、インストール方法のタブ、作業ディレクトリ、コピーボタンが入る。画面にはインストールの出力が表示され、続いて "lode shell shop.db"、バナー、シェルの挨拶とブロックカーソルが出る。その下には、12列のうち7列に導入文、最後の4列に罫線付きの必要条件リストが置かれる。
- クイックスタート：3列にまたがる4つの手順。番号とそこから下に伸びる2pxの罫線、手順の本文、そして右側を手順から手順へと続く1つのシェルセッション。セッションの区間は1pxの破線で結ぶ。1024px 未満では、各手順のセッションが本文の下に独自の枠を持つ。560px 未満では、番号が独立した行に置かれる。
- コマンドリファレンス：件数付きのフィルター欄、続いてコマンド、機能、コピー付きの例からなる表。ドットコマンドは2pxの罫線の下に置く。860px 未満では各行が縦に積まれる。
- エラー：各エラーは見出し、次にターミナル。ターミナルには7列を使ってトレースバック（エラー行を強調表示）があり、残りの5列に説明と、コピー付きの枠付きブロックにまとめた対処法が入る。1024px 未満では縦に積まれる。
- 1120px のカラム。セクションの間隔は 120px（860px 未満では 88px）。

COMPONENTS:
- ターミナルウィンドウ：2px の --line 枠、角丸 14px、46px のタイトルバー（--surface）。画面は --screen の上に、3px ごとに rgba(0,0,0,0.16) の1px の線が重なる。1px の #0a2010 のリング、0 0 56px rgba(47,125,55,0.16) の外側グロー、0 24px 40px rgba(0,0,0,0.45) の影。
- インストールタブ（brew, curl, cargo, pip）：矢印キー、Home、End で操作できる、ロービングフォーカス付きの実際のタブリスト。パネルはインストールのセッションで、各方法は自分のコマンドを入力し、自分の出力を表示する。
- バージョン選択：v0.14.2 または v0.13.4。古い方を選ぶと、バーの下に注記（3pxのアクセント罫線、--accent-wash の背景）が出て、現行リリースに戻るボタンが付く。ページ上のバージョン番号、ファイルサイズ、Python の要件、インストールコマンドはすべて選択に従う。後から追加されたコマンドはリファレンスから外れる。
- コピーボタン：角型、1px の --line 枠、高さ 32px（スマートフォンでは 44px）。プロンプトを除いたコマンドをコピーし、2秒間「コピーしました」と表示する。polite のライブリージョンで伝える。
- コマンドフィルター：ラベル付きの入力欄（1px の --line 枠）。横に件数を表示し、一致するものがない場合は検索語を示す空状態を出す。空状態には、フィルターを解除してフォーカスを入力欄に戻すボタンがある。
- すべてのコントロールの角は直角。角丸はターミナルの枠（14px）と修正ブロック（10px）だけに使う。

MOTION:
- なし。カーソルは点滅せず、何も自動的に動かない。

FORBIDDEN:
- カード、ピル型、チップ、バッジ、蛍光緑以外の色のネオン、走査線とヒーロー画面の光だまり以外のグラデーション
- 見出しの上の小さなラベル、大文字で字間を空けたラベル、実際の順序ではないものに付けた数字
- タイピングアニメーション、点滅するカーソル、落ちてくるコードの雨、ASCII アートのロゴ、CRT の湾曲、ちらつき
- ハッカー、レトロコンピューティング、ターミナルを美学として語る文章
- 絵文字、イラスト、リンクの矢印、中黒で区切ったメタ文字列

OUTPUT:
1) 上記のトークンを表す CSS カスタムプロパティ
2) セマンティックな HTML：インストール用のタブリストとパネル、手順用の順序付きリスト、コマンド用の明示的なロールを持つ表、エラー用の article
3) 動作するタブ、注記付きのバージョン選択、確認表示付きのコピーボタン、件数と空状態付きのフィルター
4) 320px まで横スクロールなしのレスポンシブレイアウト。スマートフォンでは全コントロールの高さを 44px 以上にする
5) すべてのコントロールに見えるフォーカス、コピー・バージョン変更・フィルター結果を伝える polite のライブリージョン`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

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
