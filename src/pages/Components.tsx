import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Lang } from '../data/styles';
import { withLang } from '../utils/language';
import { copyText } from '../utils/clipboard';
import { Panel, Shell, ShellHeader } from '../kit/surface/surface';
import { Button } from '../kit/button/button';
import { SearchField } from '../kit/search-field/search-field';
import { Skeleton, SkeletonGroup } from '../kit/skeleton/skeleton';
import { StatusBadge, type StatusTone } from '../kit/status-badge/status-badge';
import { EmptyState } from '../kit/empty-state/empty-state';
import themeCss from '../kit/theme.css?raw';
import statusBadgeTsx from '../kit/status-badge/status-badge.tsx?raw';
import statusBadgeCss from '../kit/status-badge/status-badge.css?raw';
import emptyStateTsx from '../kit/empty-state/empty-state.tsx?raw';
import emptyStateCss from '../kit/empty-state/empty-state.css?raw';
import surfaceTsx from '../kit/surface/surface.tsx?raw';
import surfaceCss from '../kit/surface/surface.css?raw';
import buttonTsx from '../kit/button/button.tsx?raw';
import buttonCss from '../kit/button/button.css?raw';
import searchFieldTsx from '../kit/search-field/search-field.tsx?raw';
import searchFieldCss from '../kit/search-field/search-field.css?raw';
import skeletonTsx from '../kit/skeleton/skeleton.tsx?raw';
import skeletonCss from '../kit/skeleton/skeleton.css?raw';
import './Components.css';

type L = Record<Lang, string>;
const t = (en: string, ko: string, ja: string): L => ({ en, ko, ja });

const REGISTRY = 'https://webstylebook.com/r';

/* Copy ------------------------------------------------------------------------ */

const copy = {
  title: t('Components', '컴포넌트', 'コンポーネント'),
  lead: t(
    'React components in the Quiet Utility style, ready to copy into your project. Each one comes with its loading, empty, and error states, written in plain CSS.',
    'Quiet Utility 스타일로 만든 React 컴포넌트입니다. 프로젝트에 바로 복사해 쓸 수 있습니다. 로딩, 빈 목록, 오류 상태를 처음부터 갖추고 있고, 일반 CSS로 만들었습니다.',
    'Quiet Utilityスタイルで作ったReactコンポーネントです。プロジェクトにそのままコピーして使えます。読み込み中、空の一覧、エラーの状態を最初から備え、プレーンなCSSで書いています。',
  ),
  facts: [t('Quiet Utility', 'Quiet Utility', 'Quiet Utility'), t('Light mode', '밝은 모드', 'ライトモード'), t('React 19', 'React 19', 'React 19'), t('Plain CSS, no Tailwind', '일반 CSS, Tailwind 없음', 'プレーンCSS、Tailwindなし')],
  styleLink: t('See the Quiet Utility style', 'Quiet Utility 스타일 보기', 'Quiet Utilityスタイルを見る'),
  examples: t('Examples', '예시', '使用例'),
  deployTitle: t('Deploys', '배포', 'デプロイ'),
  deployCaption: t(
    'Status Badge in a live list. Each row changes state as the run moves.',
    '목록 안의 Status Badge입니다. 작업이 진행되면 행마다 상태가 바뀝니다.',
    '一覧の中のStatus Badgeです。処理が進むと行ごとに状態が変わります。',
  ),
  savedTitle: t('Saved styles', '저장한 스타일', '保存したスタイル'),
  savedCaption: t(
    'Empty State for a first visit, a search with no results, and a failed load. Every button works.',
    '처음 사용, 검색 결과 없음, 불러오기 실패를 보여주는 Empty State입니다. 모든 버튼이 동작합니다.',
    '初回、検索結果なし、読み込み失敗を示すEmpty Stateです。すべてのボタンが動作します。',
  ),
  replay: t('Replay', '다시 재생', 'もう一度再生'),
  reset: t('Reset', '처음으로', '最初から'),
  situation: t('Situation', '상황', '状況'),
  scenarios: {
    'initial-empty': t('First visit', '처음 사용', '初回'),
    'filtered-empty': t('No results', '검색 결과 없음', '検索結果なし'),
    'fetch-failed': t('Load failed', '불러오기 실패', '読み込み失敗'),
  },
  tabs: { preview: t('Preview', '미리보기', 'プレビュー'), code: t('Code', '코드', 'コード') },
  view: t('View', '보기', '表示'),
  marker: t('Marker', '표시 방식', 'マーカー'),
  dot: t('Dot', '점', 'ドット'),
  icon: t('Icon', '아이콘', 'アイコン'),
  placement: t('Placement', '배치', '配置'),
  inPanel: t('In a panel', '패널 안', 'パネル内'),
  framed: t('Framed', '테두리', '枠付き'),
  usage: t('Usage', '사용', '使い方'),
  install: t('Install', '설치', 'インストール'),
  props: t('Props', 'Props', 'Props'),
  copy: t('Copy', '복사', 'コピー'),
  copied: t('Copied', '복사했습니다', 'コピーしました'),
  copyFailed: t('Copy failed', '복사하지 못했습니다', 'コピーできませんでした'),
  sourceFiles: t('Files', '파일', 'ファイル'),
  columns: [t('Prop', '이름', '名前'), t('Type', '타입', '型'), t('Default', '기본값', '既定値'), t('Description', '설명', '説明')],
  statusBadge: t(
    'Shows a state in one word and one color: Queued, Running, Done, Needs review, or Failed.',
    '상태를 한 단어와 한 가지 색으로 보여줍니다. 대기, 실행 중, 완료, 검토 필요, 실패에 씁니다.',
    '状態を一語と一色で示します。待機、実行中、完了、要確認、失敗に使います。',
  ),
  emptyState: t(
    'Explains why a list is empty and offers the next step. It covers the State Atlas states initial-empty, filtered-empty, and fetch-failed.',
    '목록이 빈 이유와 다음 행동을 보여줍니다. State Atlas의 initial-empty, filtered-empty, fetch-failed 상태를 다룹니다.',
    '一覧が空の理由と次の操作を示します。State Atlasのinitial-empty、filtered-empty、fetch-failedの状態を扱います。',
  ),
  partsTitle: t('Parts', '기본 부품', '基本パーツ'),
  partsLead: t(
    'The examples above also use these parts. Each one installs on its own.',
    '위 예시는 이 부품들도 함께 씁니다. 부품마다 따로 설치할 수 있습니다.',
    '上の使用例はこれらのパーツも使っています。パーツごとに個別にインストールできます。',
  ),
  parts: {
    surface: t(
      'Shell is the framed outer layer; its header sits in the padding. Panel is the white content layer inside it.',
      'Shell은 테두리가 있는 바깥 층이고, 머리글은 Shell의 여백에 놓입니다. Panel은 그 안의 흰 내용 층입니다.',
      'Shellは枠のある外側のレイヤーで、ヘッダーはその余白に置きます。Panelはその内側の白いコンテンツ層です。',
    ),
    button: t(
      'Primary and secondary buttons. While busy, a button shows a spinner, keeps its label, and ignores clicks.',
      '주 버튼과 보조 버튼입니다. 처리 중에는 스피너를 보여주고, 라벨은 그대로 두고, 클릭을 받지 않습니다.',
      'プライマリとセカンダリのボタンです。処理中はスピナーを表示し、ラベルはそのままで、クリックを受け付けません。',
    ),
    search: t(
      'A search input with a clear button. Escape clears the value.',
      '지우기 버튼이 있는 검색 입력창입니다. Esc 키를 누르면 값을 지웁니다.',
      'クリアボタン付きの検索入力欄です。Escキーで値を消します。',
    ),
    skeleton: t(
      'Placeholder blocks while content loads. The group announces one loading message.',
      '내용을 불러오는 동안 보여주는 자리 표시 블록입니다. 그룹은 로딩 안내를 한 번만 읽어줍니다.',
      '読み込み中に表示するプレースホルダーです。グループは読み込み中の案内を一度だけ読み上げます。',
    ),
  },
  installTitle: t('Installation', '설치', 'インストール'),
  installLead: t(
    'The shadcn CLI copies the files into your project. Tailwind is not required.',
    'shadcn CLI가 파일을 프로젝트에 복사합니다. Tailwind는 필요하지 않습니다.',
    'shadcn CLIがファイルをプロジェクトにコピーします。Tailwindは不要です。',
  ),
  steps: [
    t(
      'If your project has no components.json, add this one. The CLI needs the file even without Tailwind.',
      '프로젝트에 components.json이 없으면 아래 파일을 추가하세요. Tailwind가 없어도 CLI는 이 파일이 필요합니다.',
      'プロジェクトにcomponents.jsonがない場合は、次のファイルを追加してください。Tailwindがなくても、CLIにはこのファイルが必要です。',
    ),
    t(
      'Add a component. The theme file comes with it. Files go to src/components/webstylebook/.',
      '컴포넌트를 추가하세요. 테마 파일도 함께 설치됩니다. 파일은 src/components/webstylebook/에 들어갑니다.',
      'コンポーネントを追加してください。テーマファイルも一緒にインストールされます。ファイルはsrc/components/webstylebook/に入ります。',
    ),
    t(
      'Load the fonts: Inter, and Pretendard for Korean text.',
      '글꼴을 불러오세요. Inter와, 한국어용 Pretendard입니다.',
      'フォントを読み込んでください。Interと、韓国語用のPretendardです。',
    ),
  ],
  overrideNote: t(
    'Kit CSS sits outside any cascade layer, so a global rule in your app, such as one for every button, does not break it. For the same reason a Tailwind utility cannot replace a color or border the kit sets: add ! (for example bg-red-500!) or use a class from your own CSS. Spacing utilities such as mt-4 work as usual.',
    'kit CSS는 cascade layer 밖에 있습니다. 그래서 앱의 전역 규칙(예: 모든 button에 거는 규칙)이 컴포넌트를 깨뜨리지 않습니다. 같은 이유로 Tailwind 유틸리티는 kit이 정한 색이나 테두리를 바꾸지 못합니다. 바꾸려면 !를 붙이거나(예: bg-red-500!) 직접 쓴 CSS 클래스를 쓰세요. mt-4 같은 간격 유틸리티는 그대로 동작합니다.',
    'キットのCSSはカスケードレイヤーの外にあります。そのため、アプリ全体のルール(たとえばすべてのbuttonに掛けるルール)でコンポーネントが崩れません。同じ理由で、Tailwindのユーティリティはキットが決めた色や枠線を上書きできません。上書きするには!を付けるか(例: bg-red-500!)、自分で書いたCSSクラスを使ってください。mt-4のような余白のユーティリティはそのまま動きます。',
  ),
  installCopyNote: t(
    'You can also copy the files by hand: open Code on any component.',
    '파일을 직접 복사해도 됩니다. 컴포넌트마다 코드 탭에 파일이 있습니다.',
    'ファイルを手でコピーしても構いません。各コンポーネントの「コード」にファイルがあります。',
  ),
  tokensTitle: t('Theme tokens', '테마 토큰', 'テーマトークン'),
  tokensLead: t(
    'Every component reads only these variables from theme.css. Values that differ from the Quiet Utility source carry a comment with the reason in the file.',
    '모든 컴포넌트는 theme.css의 이 변수만 읽습니다. Quiet Utility 원본과 다른 값에는 파일 안에 이유를 주석으로 적었습니다.',
    'すべてのコンポーネントはtheme.cssのこの変数だけを読みます。Quiet Utilityの元の値と異なる値には、理由をファイル内のコメントに書いています。',
  ),
  tokensShow: t('Show all tokens', '토큰 전체 보기', 'すべてのトークンを表示'),
  token: t('Token', '토큰', 'トークン'),
  value: t('Value', '값', '値'),
};

const pick = (text: L, lang: Lang) => text[lang];

/* Small page controls ------------------------------------------------------------ */

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<readonly [T, string]>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="cmp-choice" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)}>
          {text}
        </button>
      ))}
    </div>
  );
}

function CopyButton({ text, lang }: { text: string; lang: Lang }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const label = state === 'copied' ? copy.copied : state === 'failed' ? copy.copyFailed : copy.copy;
  return (
    <button
      type="button"
      className="cmp-copy"
      data-state={state}
      onClick={() => {
        copyText(text).then(
          () => setState('copied'),
          (error: unknown) => {
            console.error('Copy to clipboard failed', error);
            setState('failed');
          },
        );
      }}
    >
      <span aria-live="polite">{pick(label, lang)}</span>
    </button>
  );
}

function CodeBlock({ code, title, lang }: { code: string; title: string; lang: Lang }) {
  return (
    <figure className="cmp-code">
      <figcaption>
        <code>{title}</code>
        <CopyButton text={code} lang={lang} />
      </figcaption>
      <pre>
        <code>{code.trimEnd()}</code>
      </pre>
    </figure>
  );
}

function InstallLine({ names, lang }: { names: string[]; lang: Lang }) {
  const command = `npx shadcn@latest add ${names.map((name) => `${REGISTRY}/${name}.json`).join(' ')}`;
  return <CodeBlock code={command} title={pick(copy.install, lang)} lang={lang} />;
}

type PropRow = [name: string, type: string, fallback: string, description: L];

function PropsTable({ rows, lang }: { rows: PropRow[]; lang: Lang }) {
  return (
    <div className="cmp-table">
      <table>
        <thead>
          <tr>
            {copy.columns.map((column) => (
              <th scope="col" key={column.en}>
                {pick(column, lang)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, fallback, description]) => (
            <tr key={name}>
              <th scope="row">
                <code>{name}</code>
              </th>
              <td>
                <code>{type}</code>
              </td>
              <td>
                <code>{fallback}</code>
              </td>
              <td>{pick(description, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SourceFile {
  path: string;
  code: string;
}

function ComponentFrame({
  label,
  controls,
  preview,
  usage,
  files,
  lang,
}: {
  label: string;
  controls?: ReactNode;
  preview: ReactNode;
  usage: string;
  files: SourceFile[];
  lang: Lang;
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  return (
    <div className="cmp-frame">
      <div className="cmp-frame__bar">
        <Choice
          label={`${label} ${pick(copy.view, lang)}`}
          value={tab}
          options={[
            ['preview', pick(copy.tabs.preview, lang)],
            ['code', pick(copy.tabs.code, lang)],
          ]}
          onChange={setTab}
        />
        {tab === 'preview' && controls ? <div className="cmp-frame__controls">{controls}</div> : null}
      </div>
      {tab === 'preview' ? (
        <div className="cmp-preview">{preview}</div>
      ) : (
        <div className="cmp-frame__code">
          <CodeBlock code={usage} title={pick(copy.usage, lang)} lang={lang} />
          {files.map((file) => (
            <CodeBlock key={file.path} code={file.code} title={file.path} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

/** A button for static previews: it shows the busy state for a moment, then returns. */
function DemoButton({ variant, icon, children }: { variant?: 'primary' | 'secondary'; icon?: ReactNode; children: ReactNode }) {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 900);
    return () => window.clearTimeout(timer);
  }, [busy]);

  return (
    <Button variant={variant} icon={icon} busy={busy} onClick={() => setBusy(true)}>
      {children}
    </Button>
  );
}

/* Icons used by the examples ------------------------------------------------------ */

const iconProps = {
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const BookmarkIcon = (
  <svg {...iconProps}>
    <path d="M6 3.5h8v13l-4-2.75-4 2.75z" />
  </svg>
);
const SearchIcon = (
  <svg {...iconProps}>
    <circle cx="9" cy="9" r="5" />
    <path d="M13 13l3.5 3.5" />
  </svg>
);
const AlertIcon = (
  <svg {...iconProps}>
    <circle cx="10" cy="10" r="6.75" />
    <path d="M10 6.5v4.25" />
    <path d="M10 13.5v.01" />
  </svg>
);
const RefreshIcon = (
  <svg {...iconProps} viewBox="0 0 16 16">
    <path d="M13 8a5 5 0 1 1-1.46-3.54" />
    <path d="M13 3v2.5h-2.5" />
  </svg>
);

/* Deploy example ----------------------------------------------------------------- */

const TONE_LABEL: Record<StatusTone, L> = {
  neutral: t('Queued', '대기', '待機'),
  info: t('Running', '실행 중', '実行中'),
  positive: t('Done', '완료', '完了'),
  caution: t('Needs review', '검토 필요', '要確認'),
  critical: t('Failed', '실패', '失敗'),
};

const TONES: StatusTone[] = ['neutral', 'info', 'positive', 'caution', 'critical'];

const DEPLOYS: Array<{ name: string; branch: string; steps: Array<[at: number, tone: StatusTone]> }> = [
  { name: 'web-stylebook', branch: 'main', steps: [[0, 'positive']] },
  { name: 'store', branch: 'release/0.5', steps: [[0, 'info'], [1800, 'positive']] },
  { name: 'mcp-server', branch: 'feat/state-atlas', steps: [[0, 'neutral'], [900, 'info'], [2900, 'critical']] },
  { name: 'docs', branch: 'main', steps: [[0, 'neutral'], [2000, 'info'], [3900, 'caution']] },
];

function deployMeta(pending: number, lang: Lang) {
  if (pending === 0) return pick(t('All finished', '모두 끝났습니다', 'すべて完了'), lang);
  return pick(t(`${pending} in progress`, `진행 중 ${pending}개`, `進行中 ${pending}件`), lang);
}

function DeployList({ lang, marker }: { lang: Lang; marker: 'dot' | 'icon' }) {
  const [tones, setTones] = useState<StatusTone[]>(() => DEPLOYS.map((deploy) => deploy.steps[0][1]));

  useEffect(() => {
    const timers = DEPLOYS.flatMap((deploy, index) =>
      deploy.steps.slice(1).map(([at, tone]) =>
        window.setTimeout(() => setTones((previous) => previous.map((current, row) => (row === index ? tone : current))), at),
      ),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const pending = tones.filter((tone) => tone === 'neutral' || tone === 'info').length;
  return (
    <Shell className="cmp-example-shell">
      <ShellHeader title={pick(copy.deployTitle, lang)} meta={deployMeta(pending, lang)} />
      <Panel>
        <ul className="cmp-rows">
          {DEPLOYS.map((deploy, index) => (
            <li key={deploy.name}>
              <span className="cmp-rows__text">
                <span className="cmp-rows__name">{deploy.name}</span>
                <span className="cmp-rows__sub cmp-rows__sub--mono">{deploy.branch}</span>
              </span>
              <StatusBadge tone={tones[index]} marker={marker}>
                {pick(TONE_LABEL[tones[index]], lang)}
              </StatusBadge>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}

/* Saved styles example ------------------------------------------------------------- */

type Scenario = 'initial-empty' | 'filtered-empty' | 'fetch-failed';

const SAVED = [
  { name: 'Quiet Utility', mode: t('Light mode', '밝은 모드', 'ライトモード') },
  { name: 'Brutalist Grid', mode: t('Light mode', '밝은 모드', 'ライトモード') },
  { name: 'Console Launch', mode: t('Dark mode', '어두운 모드', 'ダークモード') },
];

type SavedData = { kind: 'ready'; saved: typeof SAVED } | { kind: 'loading' } | { kind: 'failed' };

function initialData(scenario: Scenario): SavedData {
  if (scenario === 'fetch-failed') return { kind: 'failed' };
  return { kind: 'ready', saved: scenario === 'filtered-empty' ? SAVED : [] };
}

function SavedStyles({ lang, scenario }: { lang: Lang; scenario: Scenario }) {
  const [data, setData] = useState<SavedData>(() => initialData(scenario));
  const [query, setQuery] = useState(scenario === 'filtered-empty' ? 'glass' : '');
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusSearchWhenReady = useRef(false);

  useEffect(() => {
    if (data.kind !== 'loading') return;
    const timer = window.setTimeout(() => setData({ kind: 'ready', saved: SAVED }), 900);
    return () => window.clearTimeout(timer);
  }, [data.kind]);

  // The pressed button unmounts when the list loads. Focus waits on the
  // Panel, then moves to the search field once it is enabled.
  useEffect(() => {
    if (data.kind !== 'ready' || !focusSearchWhenReady.current) return;
    focusSearchWhenReady.current = false;
    searchRef.current?.focus();
  }, [data.kind]);

  function load() {
    focusSearchWhenReady.current = true;
    panelRef.current?.focus();
    setData({ kind: 'loading' });
  }

  function clearSearch() {
    setQuery('');
    searchRef.current?.focus();
  }

  const needle = query.trim().toLowerCase();
  const visible = data.kind === 'ready' ? data.saved.filter((item) => item.name.toLowerCase().includes(needle)) : [];
  const searchable = data.kind === 'ready' && data.saved.length > 0;
  const meta = data.kind === 'ready' && data.saved.length > 0 ? String(visible.length) : undefined;

  function body() {
    if (data.kind === 'loading') {
      return (
        <SkeletonGroup className="cmp-loading" label={pick(t('Loading saved styles', '저장한 스타일을 불러오는 중', '保存したスタイルを読み込み中'), lang)}>
          {[0, 1, 2].map((row) => (
            <div className="cmp-loading__row" key={row}>
              <Skeleton width="46%" height={12} />
              <Skeleton width="24%" height={10} />
            </div>
          ))}
        </SkeletonGroup>
      );
    }
    if (data.kind === 'failed') {
      return (
        <EmptyState
          tone="critical"
          icon={AlertIcon}
          title={pick(t("Couldn't load your saved styles", '목록을 불러오지 못했습니다', '保存したスタイルを読み込めませんでした'), lang)}
          description={pick(
            t(
              'Check your connection and try again. Your saved styles are not lost.',
              '네트워크 연결을 확인한 뒤 다시 시도하세요. 저장한 스타일은 지워지지 않았습니다.',
              '接続を確認して、もう一度お試しください。保存したスタイルは消えていません。',
            ),
            lang,
          )}
          actions={
            <Button variant="primary" icon={RefreshIcon} onClick={load}>
              {pick(t('Try again', '다시 시도', '再試行'), lang)}
            </Button>
          }
        />
      );
    }
    if (data.saved.length === 0) {
      return (
        <EmptyState
          icon={BookmarkIcon}
          title={pick(t('No saved styles yet', '아직 저장한 스타일이 없습니다', '保存したスタイルはまだありません'), lang)}
          description={pick(
            t(
              'Select Save on any style page and it appears here.',
              '스타일 페이지에서 저장을 누르면 이 목록에 추가됩니다.',
              'スタイルページで「保存」を押すと、ここに追加されます。',
            ),
            lang,
          )}
          actions={
            <Button variant="primary" onClick={load}>
              {pick(t('Save 3 examples', '예시 3개 저장', '例を3件保存'), lang)}
            </Button>
          }
        />
      );
    }
    if (visible.length === 0) {
      const shown = query.trim();
      return (
        <EmptyState
          icon={SearchIcon}
          title={pick(t(`No results for “${shown}”`, `‘${shown}’ 검색 결과가 없습니다`, `「${shown}」に一致するスタイルはありません`), lang)}
          description={pick(
            t('Try another name or clear the search.', '다른 이름으로 찾거나 검색어를 지우세요.', '別の名前で探すか、検索をクリアしてください。'),
            lang,
          )}
          actions={<Button onClick={clearSearch}>{pick(t('Clear search', '검색어 지우기', '検索をクリア'), lang)}</Button>}
        />
      );
    }
    return (
      <ul className="cmp-rows">
        {visible.map((item) => (
          <li key={item.name}>
            <span className="cmp-rows__text">
              <span className="cmp-rows__name">{item.name}</span>
              <span className="cmp-rows__sub">{pick(item.mode, lang)}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  const resultMessage = meta === undefined ? '' : pick(t(`${meta} styles`, `${meta}개`, `${meta}件`), lang);

  return (
    <Shell className="cmp-example-shell">
      <ShellHeader title={pick(copy.savedTitle, lang)} meta={meta}>
        <SearchField
          ref={searchRef}
          label={pick(t('Search saved styles', '저장한 스타일 찾기', '保存したスタイルを検索'), lang)}
          placeholder={pick(t('Search by name', '스타일 이름으로 찾기', '名前で検索'), lang)}
          clearLabel={pick(t('Clear search', '검색어 지우기', '検索をクリア'), lang)}
          value={query}
          onValueChange={setQuery}
          disabled={!searchable}
        />
      </ShellHeader>
      <span className="sr-only" aria-live="polite">
        {resultMessage}
      </span>
      <Panel ref={panelRef} tabIndex={-1} className="cmp-example-panel">
        {body()}
      </Panel>
    </Shell>
  );
}

/* Sections ------------------------------------------------------------------------- */

function Examples({ lang }: { lang: Lang }) {
  const [run, setRun] = useState(0);
  const [scenario, setScenario] = useState<Scenario>('initial-empty');
  const [savedRun, setSavedRun] = useState(0);
  const scenarioOptions = (Object.keys(copy.scenarios) as Scenario[]).map((key) => [key, pick(copy.scenarios[key], lang)] as const);

  return (
    <section className="cmp-examples" aria-labelledby="cmp-examples-title">
      <h2 className="sr-only" id="cmp-examples-title">
        {pick(copy.examples, lang)}
      </h2>
      <figure className="cmp-scene">
        <div className="cmp-preview cmp-scene__stage">
          <DeployList key={run} lang={lang} marker="dot" />
        </div>
        <figcaption className="cmp-scene__caption">
          <p>{pick(copy.deployCaption, lang)}</p>
          <button type="button" className="cmp-text-button" onClick={() => setRun((count) => count + 1)}>
            {pick(copy.replay, lang)}
          </button>
        </figcaption>
      </figure>
      <figure className="cmp-scene cmp-scene--saved">
        <div className="cmp-preview cmp-scene__stage">
          <SavedStyles key={`${scenario}-${savedRun}`} lang={lang} scenario={scenario} />
        </div>
        <figcaption className="cmp-scene__caption">
          <p>{pick(copy.savedCaption, lang)}</p>
          <div className="cmp-scene__controls">
            <Choice label={pick(copy.situation, lang)} value={scenario} options={scenarioOptions} onChange={setScenario} />
            <button type="button" className="cmp-text-button" onClick={() => setSavedRun((count) => count + 1)}>
              {pick(copy.reset, lang)}
            </button>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

function SectionHead({ id, title, lead, install }: { id: string; title: string; lead: string; install?: string }) {
  return (
    <div className="cmp-section__head">
      <h2 id={id}>{title}</h2>
      <p>{lead}</p>
      {install ? <code className="cmp-section__name">{install}</code> : null}
    </div>
  );
}

function StatusBadgeSection({ lang }: { lang: Lang }) {
  const [marker, setMarker] = useState<'dot' | 'icon'>('dot');
  return (
    <section className="cmp-section" id="status-badge" aria-labelledby="status-badge-title">
      <SectionHead id="status-badge-title" title="Status Badge" lead={pick(copy.statusBadge, lang)} />
      <ComponentFrame
        label="Status Badge"
        lang={lang}
        controls={
          <Choice
            label={pick(copy.marker, lang)}
            value={marker}
            options={[
              ['dot', pick(copy.dot, lang)],
              ['icon', pick(copy.icon, lang)],
            ]}
            onChange={setMarker}
          />
        }
        preview={
          <div className="cmp-badges">
            {TONES.map((tone) => (
              <StatusBadge key={tone} tone={tone} marker={marker}>
                {pick(TONE_LABEL[tone], lang)}
              </StatusBadge>
            ))}
          </div>
        }
        usage={`import { StatusBadge } from './components/webstylebook/status-badge/status-badge';

<StatusBadge tone="info" marker="icon">Running</StatusBadge>`}
        files={[
          { path: 'status-badge/status-badge.tsx', code: statusBadgeTsx },
          { path: 'status-badge/status-badge.css', code: statusBadgeCss },
        ]}
      />
      <InstallLine names={['status-badge']} lang={lang} />
      <PropsTable
        lang={lang}
        rows={[
          ['tone', "'neutral' | 'info' | 'positive' | 'caution' | 'critical'", "'neutral'", t('Sets the color.', '색을 정합니다.', '色を決めます。')],
          [
            'marker',
            "'dot' | 'icon'",
            "'dot'",
            t(
              "The mark before the label. 'icon' adds a shape per tone, so the state does not rely on color alone.",
              "라벨 앞의 표시입니다. 'icon'은 상태마다 모양이 달라서, 색만으로 상태를 구분하지 않게 합니다.",
              "ラベルの前の印です。'icon'は状態ごとに形が違うため、色だけに頼らずに状態を区別できます。",
            ),
          ],
          ['children', 'ReactNode', '—', t('The state, in one word.', '상태 이름입니다. 한 단어로 씁니다.', '状態名です。一語で書きます。')],
        ]}
      />
    </section>
  );
}

function EmptyStateSection({ lang }: { lang: Lang }) {
  const [scenario, setScenario] = useState<Scenario>('initial-empty');
  const [placement, setPlacement] = useState<'panel' | 'framed'>('panel');
  const scenarioOptions = (Object.keys(copy.scenarios) as Scenario[]).map((key) => [key, pick(copy.scenarios[key], lang)] as const);

  const states: Record<Scenario, ReactNode> = {
    'initial-empty': (
      <EmptyState
        framed={placement === 'framed'}
        icon={BookmarkIcon}
        title={pick(t('No saved styles yet', '아직 저장한 스타일이 없습니다', '保存したスタイルはまだありません'), lang)}
        description={pick(t('Select Save on any style page and it appears here.', '스타일 페이지에서 저장을 누르면 이 목록에 추가됩니다.', 'スタイルページで「保存」を押すと、ここに追加されます。'), lang)}
        actions={<DemoButton variant="primary">{pick(t('Browse styles', '스타일 둘러보기', 'スタイルを見る'), lang)}</DemoButton>}
      />
    ),
    'filtered-empty': (
      <EmptyState
        framed={placement === 'framed'}
        icon={SearchIcon}
        title={pick(t('No results for “glass”', '‘glass’ 검색 결과가 없습니다', '「glass」に一致するスタイルはありません'), lang)}
        description={pick(t('Try another name or clear the search.', '다른 이름으로 찾거나 검색어를 지우세요.', '別の名前で探すか、検索をクリアしてください。'), lang)}
        actions={<DemoButton>{pick(t('Clear search', '검색어 지우기', '検索をクリア'), lang)}</DemoButton>}
      />
    ),
    'fetch-failed': (
      <EmptyState
        framed={placement === 'framed'}
        tone="critical"
        // A docs preview, not a real failure: no role="alert" announcement.
        role={undefined}
        icon={AlertIcon}
        title={pick(t("Couldn't load your saved styles", '목록을 불러오지 못했습니다', '保存したスタイルを読み込めませんでした'), lang)}
        description={pick(t('Check your connection and try again. Your saved styles are not lost.', '네트워크 연결을 확인한 뒤 다시 시도하세요. 저장한 스타일은 지워지지 않았습니다.', '接続を確認して、もう一度お試しください。保存したスタイルは消えていません。'), lang)}
        actions={
          <DemoButton variant="primary" icon={RefreshIcon}>
            {pick(t('Try again', '다시 시도', '再試行'), lang)}
          </DemoButton>
        }
      />
    ),
  };

  return (
    <section className="cmp-section" id="empty-state" aria-labelledby="empty-state-title">
      <SectionHead id="empty-state-title" title="Empty State" lead={pick(copy.emptyState, lang)} />
      <ComponentFrame
        label="Empty State"
        lang={lang}
        controls={
          <>
            <Choice label={pick(copy.situation, lang)} value={scenario} options={scenarioOptions} onChange={setScenario} />
            <Choice
              label={pick(copy.placement, lang)}
              value={placement}
              options={[
                ['panel', pick(copy.inPanel, lang)],
                ['framed', pick(copy.framed, lang)],
              ]}
              onChange={setPlacement}
            />
          </>
        }
        preview={<div className="cmp-empty-demo">{placement === 'panel' ? <Panel>{states[scenario]}</Panel> : states[scenario]}</div>}
        usage={`import { EmptyState } from './components/webstylebook/empty-state/empty-state';
import { Button } from './components/webstylebook/button/button';

<EmptyState
  tone="critical"
  icon={<AlertIcon />}
  title="Couldn't load your saved styles"
  description="Check your connection and try again."
  actions={<Button variant="primary" onClick={retry}>Try again</Button>}
/>`}
        files={[
          { path: 'empty-state/empty-state.tsx', code: emptyStateTsx },
          { path: 'empty-state/empty-state.css', code: emptyStateCss },
        ]}
      />
      <InstallLine names={['empty-state', 'button']} lang={lang} />
      <PropsTable
        lang={lang}
        rows={[
          ['title', 'ReactNode', '—', t('What is empty or what failed, in one sentence.', '무엇이 비었는지, 무엇이 실패했는지 한 문장으로 씁니다.', '何が空か、何が失敗したかを一文で書きます。')],
          ['description', 'ReactNode', '—', t('What to do next.', '다음에 할 일을 씁니다.', '次にすることを書きます。')],
          ['icon', 'ReactNode', '—', t('A 20px line icon for the situation.', '상황을 나타내는 20px 선 아이콘입니다.', '状況を表す20pxの線アイコンです。')],
          ['actions', 'ReactNode', '—', t('Usually one button.', '보통 버튼 하나를 둡니다.', '通常はボタンを一つ置きます。')],
          [
            'tone',
            "'neutral' | 'critical'",
            "'neutral'",
            t("'critical' uses the error colors and role=\"alert\", so the message is announced.", "'critical'은 오류 색과 role=\"alert\"를 써서, 화면 낭독기가 메시지를 읽어줍니다.", "'critical'はエラーの色とrole=\"alert\"を使い、スクリーンリーダーがメッセージを読み上げます。"),
          ],
          [
            'framed',
            'boolean',
            'false',
            t(
              'A dashed frame with the kit background, for use outside a Panel. The kit is light only, so on a dark page use a Panel or framed.',
              'Panel 밖에서 쓸 때 kit 배경과 점선 테두리를 그립니다. kit은 밝은 모드 전용이므로, 어두운 페이지에서는 Panel 안에 두거나 framed를 쓰세요.',
              'Panelの外で使うときに、キットの背景と破線の枠を付けます。キットはライトモード専用なので、暗いページではPanelに入れるかframedを使ってください。',
            ),
          ],
          ['titleAs', "'p' | 'h2' | 'h3' | 'h4'", "'p'", t('The title element. Pick a heading level that fits the page.', '제목 요소입니다. 페이지 구조에 맞는 제목 수준을 고르세요.', 'タイトルの要素です。ページ構造に合う見出しレベルを選んでください。')],
        ]}
      />
    </section>
  );
}

function PartCard({
  name,
  install,
  lead,
  preview,
  files,
  rows,
  lang,
}: {
  name: string;
  install: string;
  lead: string;
  preview: ReactNode;
  files: SourceFile[];
  rows: PropRow[];
  lang: Lang;
}) {
  return (
    <article className="cmp-part" aria-labelledby={`part-${install}`}>
      <div className="cmp-part__head">
        <h3 id={`part-${install}`}>{name}</h3>
        <p>{lead}</p>
      </div>
      <div className="cmp-preview cmp-part__preview">{preview}</div>
      <details className="cmp-part__details">
        <summary>
          {pick(copy.props, lang)}, {pick(copy.sourceFiles, lang)}, {pick(copy.install, lang)}
        </summary>
        <PropsTable rows={rows} lang={lang} />
        <InstallLine names={[install]} lang={lang} />
        {files.map((file) => (
          <CodeBlock key={file.path} code={file.code} title={file.path} lang={lang} />
        ))}
      </details>
    </article>
  );
}

function PartsSection({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('Quiet');
  return (
    <section className="cmp-section" id="parts" aria-labelledby="parts-title">
      <SectionHead id="parts-title" title={pick(copy.partsTitle, lang)} lead={pick(copy.partsLead, lang)} />
      <div className="cmp-parts">
        <PartCard
          name="Surface"
          install="surface"
          lead={pick(copy.parts.surface, lang)}
          lang={lang}
          preview={
            <Shell className="cmp-part__shell">
              <ShellHeader title="Shell" meta="ShellHeader" />
              <Panel>
                <p className="cmp-part__panel-text">Panel</p>
              </Panel>
            </Shell>
          }
          files={[
            { path: 'surface/surface.tsx', code: surfaceTsx },
            { path: 'surface/surface.css', code: surfaceCss },
          ]}
          rows={[
            ['Shell as', "'div' | 'section' | 'article' | 'aside'", "'div'", t('The outer element.', '바깥 요소입니다.', '外側の要素です。')],
            ['ShellHeader title', 'ReactNode', '—', t('The title in the header row.', '머리글 행의 제목입니다.', 'ヘッダー行のタイトルです。')],
            ['ShellHeader meta', 'ReactNode', '—', t('A short count or status on the right.', '오른쪽에 두는 짧은 개수나 상태입니다.', '右側に置く短い件数や状態です。')],
            ['ShellHeader actions', 'ReactNode', '—', t('Buttons on the right of the title row.', '제목 행 오른쪽의 버튼입니다.', 'タイトル行の右側のボタンです。')],
            ['ShellHeader titleAs', "'p' | 'h2' | 'h3' | 'h4'", "'p'", t('The title element.', '제목 요소입니다.', 'タイトルの要素です。')],
          ]}
        />
        <PartCard
          name="Button"
          install="button"
          lead={pick(copy.parts.button, lang)}
          lang={lang}
          preview={
            <div className="cmp-part__row">
              <DemoButton variant="primary">{pick(t('Save', '저장', '保存'), lang)}</DemoButton>
              <Button>{pick(t('Cancel', '취소', 'キャンセル'), lang)}</Button>
              <Button disabled>{pick(t('Unavailable', '사용할 수 없음', '使用不可'), lang)}</Button>
              <Button variant="primary" busy>
                {pick(t('Saving', '저장 중', '保存中'), lang)}
              </Button>
            </div>
          }
          files={[
            { path: 'button/button.tsx', code: buttonTsx },
            { path: 'button/button.css', code: buttonCss },
          ]}
          rows={[
            ['variant', "'primary' | 'secondary'", "'secondary'", t('Use one primary button per area.', '한 영역에 주 버튼은 하나만 둡니다.', '一つの領域にプライマリボタンは一つだけ置きます。')],
            ['icon', 'ReactNode', '—', t('A 16px line icon before the label.', '라벨 앞의 16px 선 아이콘입니다.', 'ラベルの前の16pxの線アイコンです。')],
            ['busy', 'boolean', 'false', t('Shows a spinner and ignores clicks. Focus stays on the button.', '스피너를 보여주고 클릭을 받지 않습니다. 포커스는 버튼에 남습니다.', 'スピナーを表示し、クリックを受け付けません。フォーカスはボタンに残ります。')],
          ]}
        />
        <PartCard
          name="Search Field"
          install="search-field"
          lead={pick(copy.parts.search, lang)}
          lang={lang}
          preview={
            <div className="cmp-part__field">
              <SearchField
                label={pick(t('Search styles', '스타일 찾기', 'スタイルを検索'), lang)}
                placeholder={pick(t('Search by name', '스타일 이름으로 찾기', '名前で検索'), lang)}
                clearLabel={pick(t('Clear search', '검색어 지우기', '検索をクリア'), lang)}
                value={query}
                onValueChange={setQuery}
              />
            </div>
          }
          files={[
            { path: 'search-field/search-field.tsx', code: searchFieldTsx },
            { path: 'search-field/search-field.css', code: searchFieldCss },
          ]}
          rows={[
            ['label', 'string', '—', t('Required. Hidden from view unless showLabel is set.', '필수입니다. showLabel을 켜지 않으면 화면에는 보이지 않습니다.', '必須です。showLabelを指定しない限り画面には表示されません。')],
            ['value', 'string', '—', t('The current text.', '현재 입력값입니다.', '現在の入力値です。')],
            ['onValueChange', '(value: string) => void', '—', t('Called on typing, on the clear button, and on Escape.', '입력할 때, 지우기 버튼을 누를 때, Esc를 누를 때 호출합니다.', '入力時、クリアボタン、Escキーで呼ばれます。')],
            ['showLabel', 'boolean', 'false', t('Shows the label above the field.', '입력창 위에 라벨을 보여줍니다.', '入力欄の上にラベルを表示します。')],
            ['clearLabel', 'string', "'Clear search'", t('The name of the clear button for screen readers.', '화면 낭독기가 읽는 지우기 버튼 이름입니다.', 'スクリーンリーダーが読むクリアボタンの名前です。')],
          ]}
        />
        <PartCard
          name="Skeleton"
          install="skeleton"
          lead={pick(copy.parts.skeleton, lang)}
          lang={lang}
          preview={
            <div className="cmp-part__skeleton" aria-hidden="true">
              <Skeleton width="60%" height={12} />
              <Skeleton width="90%" height={10} />
              <Skeleton width="40%" height={10} />
            </div>
          }
          files={[
            { path: 'skeleton/skeleton.tsx', code: skeletonTsx },
            { path: 'skeleton/skeleton.css', code: skeletonCss },
          ]}
          rows={[
            ['Skeleton width / height', 'number | string', "'100%' / 12", t('The block size.', '블록 크기입니다.', 'ブロックの大きさです。')],
            ['Skeleton radius', "'xs' | 'sm' | 'round'", "'xs'", t('The corner.', '모서리입니다.', '角の丸みです。')],
            ['SkeletonGroup label', 'string', '—', t('Announced once while the content loads.', '불러오는 동안 한 번 읽어주는 안내입니다.', '読み込み中に一度読み上げる案内です。')],
          ]}
        />
      </div>
    </section>
  );
}

const COMPONENTS_JSON = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}`;

const FONT_LINKS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
<!-- Korean -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css" />`;

function InstallSection({ lang }: { lang: Lang }) {
  return (
    <section className="cmp-section" id="installation" aria-labelledby="installation-title">
      <SectionHead id="installation-title" title={pick(copy.installTitle, lang)} lead={pick(copy.installLead, lang)} />
      <ol className="cmp-steps">
        <li>
          <p>{pick(copy.steps[0], lang)}</p>
          <CodeBlock code={COMPONENTS_JSON} title="components.json" lang={lang} />
        </li>
        <li>
          <p>{pick(copy.steps[1], lang)}</p>
          <CodeBlock code={`npx shadcn@latest add ${REGISTRY}/empty-state.json ${REGISTRY}/button.json`} title={pick(copy.install, lang)} lang={lang} />
        </li>
        <li>
          <p>{pick(copy.steps[2], lang)}</p>
          <CodeBlock code={FONT_LINKS} title="index.html" lang={lang} />
        </li>
      </ol>
      <p className="cmp-note">{pick(copy.overrideNote, lang)}</p>
      <p className="cmp-note">{pick(copy.installCopyNote, lang)}</p>
    </section>
  );
}

function themeTokens(): Array<[string, string]> {
  const start = themeCss.indexOf(':root {');
  const block = themeCss.slice(start, themeCss.indexOf('}', start));
  return [...block.matchAll(/(--ws-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]);
}

function TokensSection({ lang }: { lang: Lang }) {
  const tokens = themeTokens();
  return (
    <section className="cmp-section" id="tokens" aria-labelledby="tokens-title">
      <SectionHead id="tokens-title" title={pick(copy.tokensTitle, lang)} lead={pick(copy.tokensLead, lang)} />
      <details className="cmp-tokens">
        <summary>{pick(copy.tokensShow, lang)}</summary>
        <div className="cmp-table">
          <table>
            <thead>
              <tr>
                <th scope="col">{pick(copy.token, lang)}</th>
                <th scope="col">{pick(copy.value, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map(([name, value]) => (
                <tr key={name}>
                  <th scope="row">
                    <code>{name}</code>
                  </th>
                  <td>
                    <span className="cmp-token">
                      {value.startsWith('#') ? <span className="cmp-token__swatch" style={{ background: value }} aria-hidden="true" /> : null}
                      <code>{value}</code>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={themeCss} title="theme.css" lang={lang} />
      </details>
    </section>
  );
}

/* Page ------------------------------------------------------------------------------ */

export function Components({ lang }: { lang: Lang }) {
  // The page is lazy-loaded, so the browser's own jump to #section runs
  // before the section exists. Jump once the content is in place.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="components-page">
      <header className="page-hero cmp-hero">
        <h1>{pick(copy.title, lang)}</h1>
        <p>{pick(copy.lead, lang)}</p>
        <div className="cmp-hero__meta">
          <ul className="cmp-facts">
            {copy.facts.map((fact) => (
              <li key={fact.en}>{pick(fact, lang)}</li>
            ))}
          </ul>
          <a href={withLang('/pages/quiet-utility', lang)}>{pick(copy.styleLink, lang)}</a>
        </div>
      </header>
      <Examples lang={lang} />
      <StatusBadgeSection lang={lang} />
      <EmptyStateSection lang={lang} />
      <PartsSection lang={lang} />
      <InstallSection lang={lang} />
      <TokensSection lang={lang} />
    </div>
  );
}
