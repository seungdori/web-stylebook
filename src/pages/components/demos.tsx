import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import { Panel, Shell, ShellHeader } from '../../kit/surface/surface';
import { Button } from '../../kit/button/button';
import { SearchField } from '../../kit/search-field/search-field';
import { Skeleton, SkeletonGroup } from '../../kit/skeleton/skeleton';
import { StatusBadge, type StatusTone } from '../../kit/status-badge/status-badge';
import { EmptyState } from '../../kit/empty-state/empty-state';
import { SegmentedControl } from '../../kit/segmented-control/segmented-control';
import { RollingNumber } from '../../kit/rolling-number/rolling-number';
import { ProgressBar, StackedBar } from '../../kit/progress-bar/progress-bar';
import { Tooltip } from '../../kit/tooltip/tooltip';
import { toast, ToastCard, Toaster } from '../../kit/toast/toast';
import { Switch } from '../../kit/switch/switch';
import { TextArea, TextField } from '../../kit/text-field/text-field';
import { Dialog } from '../../kit/dialog/dialog';
import { Checkbox } from '../../kit/checkbox/checkbox';
import { RadioGroup } from '../../kit/radio-group/radio-group';
import { Select } from '../../kit/select/select';
import { Slider } from '../../kit/slider/slider';
import { Tabs } from '../../kit/tabs/tabs';
import { Accordion } from '../../kit/accordion/accordion';
import { Menu, type MenuEntry } from '../../kit/menu/menu';
import { Alert } from '../../kit/alert/alert';
import { Popover } from '../../kit/popover/popover';
import { pick, t, type L } from './copy';
import { AlertIcon, ArchiveIcon, BookmarkIcon, CopyIcon, MoreIcon, PencilIcon, RefreshIcon, SearchIcon, TrashIcon } from './icons';

export interface DemoProps {
  lang: Lang;
}

export interface PreviewProps extends DemoProps {
  /** True while the gallery card is hovered or focused. */
  playing: boolean;
}

/** Counts up a fixed number of times after mount, then stops. Replay remounts it. */
function useTicks(count: number, ms: number, firstDelay = 500) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (tick >= count) return;
    const timer = window.setTimeout(() => setTick((value) => value + 1), tick === 0 ? firstDelay : ms);
    return () => window.clearTimeout(timer);
  }, [tick, count, ms, firstDelay]);
  return tick;
}

/** Steps through indexes only while a gallery card is hovered. */
function useCycle(length: number, playing: boolean, ms = 900) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % length), ms);
    return () => window.clearInterval(timer);
  }, [playing, length, ms]);
  return playing ? index : 0;
}

/** A button for static previews: it shows the busy state for a moment, then returns. */
function DemoButton({ variant, icon, children }: { variant?: 'primary' | 'secondary' | 'quiet' | 'critical'; icon?: ReactNode; children: ReactNode }) {
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

/* Status Badge ---------------------------------------------------------------- */

const TONE_LABEL: Record<StatusTone, L> = {
  neutral: t('Queued', '대기', '待機'),
  info: t('Running', '실행 중', '実行中'),
  positive: t('Done', '완료', '完了'),
  caution: t('Needs review', '검토 필요', '要確認'),
  critical: t('Failed', '실패', '失敗'),
};

const TONES: StatusTone[] = ['neutral', 'info', 'positive', 'caution', 'critical'];

function Badges({ lang, marker }: DemoProps & { marker: 'dot' | 'icon' }) {
  return (
    <div className="cmp-row">
      {TONES.map((tone) => (
        <StatusBadge key={tone} tone={tone} marker={marker} live={tone === 'info'}>
          {pick(TONE_LABEL[tone], lang)}
        </StatusBadge>
      ))}
    </div>
  );
}

export const BadgeDots = ({ lang }: DemoProps) => <Badges lang={lang} marker="dot" />;
export const BadgeIcons = ({ lang }: DemoProps) => <Badges lang={lang} marker="icon" />;

interface Deploy {
  name: string;
  branch: string;
  /** Milliseconds into the demo at which each state starts. */
  steps: Array<[at: number, tone: StatusTone]>;
  /** Run time of a deploy that finished before the demo starts. */
  seconds?: number;
}

const DEPLOYS: Deploy[] = [
  { name: 'web-stylebook', branch: 'main', steps: [[0, 'positive']], seconds: 72 },
  { name: 'store', branch: 'release/0.5', steps: [[0, 'info'], [1800, 'positive']] },
  { name: 'mcp-server', branch: 'feat/state-atlas', steps: [[0, 'neutral'], [900, 'info'], [2900, 'critical']] },
  { name: 'docs', branch: 'main', steps: [[0, 'neutral'], [2000, 'info'], [3900, 'caution']] },
  { name: 'api-gateway', branch: 'hotfix/timeouts', steps: [[0, 'info'], [3200, 'positive']] },
  { name: 'design-tokens', branch: 'main', steps: [[0, 'neutral'], [3000, 'info'], [4600, 'positive']] },
];

const DEPLOY_DEMO_MS = Math.max(...DEPLOYS.flatMap((deploy) => deploy.steps.map(([at]) => at)));
// Demo time runs faster than the clock, so a full run fits in five seconds.
const DEPLOY_TIME_SCALE = 30;

function deployAt(deploy: Deploy, now: number): { tone: StatusTone; seconds: number | undefined } {
  const tone = deploy.steps.filter(([at]) => at <= now).at(-1)?.[1] ?? deploy.steps[0][1];
  const start = deploy.steps.find(([, step]) => step === 'info')?.[0];
  if (start === undefined) return { tone, seconds: deploy.seconds };
  if (now < start) return { tone, seconds: undefined };
  const end = deploy.steps.find(([, step]) => step !== 'info' && step !== 'neutral')?.[0] ?? now;
  return { tone, seconds: Math.round(((Math.min(now, end) - start) * DEPLOY_TIME_SCALE) / 1000) };
}

function formatRunTime(total: number, lang: Lang) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  const [minuteUnit, secondUnit, gap] = lang === 'ko' ? ['분', '초', ' '] : lang === 'ja' ? ['分', '秒', ''] : ['m', 's', ' '];
  if (!minutes) return `${seconds}${secondUnit}`;
  return seconds ? `${minutes}${minuteUnit}${gap}${seconds}${secondUnit}` : `${minutes}${minuteUnit}`;
}

function deployMeta(pending: number, lang: Lang) {
  if (pending === 0) return pick(t('All finished', '모두 끝났습니다', 'すべて完了'), lang);
  return pick(t(`${pending} in progress`, `진행 중 ${pending}개`, `進行中 ${pending}件`), lang);
}

export function DeployList({ lang }: DemoProps) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setNow(Math.min(elapsed, DEPLOY_DEMO_MS));
      if (elapsed >= DEPLOY_DEMO_MS) window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  const rows = DEPLOYS.map((deploy) => ({ deploy, ...deployAt(deploy, now) }));
  const pending = rows.filter(({ tone }) => tone === 'neutral' || tone === 'info').length;
  return (
    <Shell className="cmp-demo-shell">
      <ShellHeader title={pick(t('Deploys', '배포', 'デプロイ'), lang)} meta={deployMeta(pending, lang)} />
      <Panel>
        <ul className="cmp-rows cmp-rows--deploys">
          {rows.map(({ deploy, tone, seconds }) => (
            <li key={deploy.name}>
              <span className="cmp-rows__text">
                <span className="cmp-rows__name">{deploy.name}</span>
                <span className="cmp-rows__sub cmp-rows__sub--mono">{deploy.branch}</span>
              </span>
              <span className="cmp-rows__time">{seconds === undefined ? '—' : formatRunTime(seconds, lang)}</span>
              <span className="cmp-rows__status">
                <StatusBadge tone={tone} live={tone === 'info'}>
                  {pick(TONE_LABEL[tone], lang)}
                </StatusBadge>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}

/* Empty State ----------------------------------------------------------------- */

type Scenario = 'initial-empty' | 'filtered-empty' | 'fetch-failed';

const SAVED = [
  { name: 'Quiet Utility', mode: t('Light mode', '밝은 모드', 'ライトモード') },
  { name: 'Brutalist Grid', mode: t('Light mode', '밝은 모드', 'ライトモード') },
  { name: 'Console Launch', mode: t('Dark mode', '어두운 모드', 'ダークモード') },
  { name: 'Bento Bloom', mode: t('Light mode', '밝은 모드', 'ライトモード') },
  { name: 'macOS Liquid Glass', mode: t('Light mode', '밝은 모드', 'ライトモード') },
];

type SavedData = { kind: 'ready'; saved: typeof SAVED } | { kind: 'loading' } | { kind: 'failed' };

function initialData(scenario: Scenario): SavedData {
  if (scenario === 'fetch-failed') return { kind: 'failed' };
  return { kind: 'ready', saved: scenario === 'filtered-empty' ? SAVED : [] };
}

function SavedStyles({ lang, scenario }: DemoProps & { scenario: Scenario }) {
  const [data, setData] = useState<SavedData>(() => initialData(scenario));
  const [query, setQuery] = useState(scenario === 'filtered-empty' ? 'neon' : '');
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
          {SAVED.map((item) => (
            <div className="cmp-loading__row" key={item.name}>
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
            t('Select Save on any style page and it appears here.', '스타일 페이지에서 저장을 누르면 이 목록에 추가됩니다.', 'スタイルページで「保存」を押すと、ここに追加されます。'),
            lang,
          )}
          actions={
            <Button variant="primary" onClick={load}>
              {pick(t('Save 5 examples', '예시 5개 저장', '例を5件保存'), lang)}
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
          description={pick(t('Try another name or clear the search.', '다른 이름으로 찾거나 검색어를 지우세요.', '別の名前で探すか、検索をクリアしてください。'), lang)}
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

  const resultMessage = meta === undefined ? '' : pick(t(`${meta} ${meta === '1' ? 'style' : 'styles'}`, `${meta}개`, `${meta}件`), lang);

  return (
    <Shell className="cmp-demo-shell">
      <ShellHeader title={pick(t('Saved styles', '저장한 스타일', '保存したスタイル'), lang)} meta={meta}>
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
      <Panel ref={panelRef} tabIndex={-1} className="cmp-demo-panel">
        {body()}
      </Panel>
    </Shell>
  );
}

export const EmptyFirstVisit = ({ lang }: DemoProps) => <SavedStyles lang={lang} scenario="initial-empty" />;
export const EmptyNoResults = ({ lang }: DemoProps) => <SavedStyles lang={lang} scenario="filtered-empty" />;
export const EmptyFailed = ({ lang }: DemoProps) => <SavedStyles lang={lang} scenario="fetch-failed" />;

export function EmptyCompact({ lang }: DemoProps) {
  return (
    <Panel className="cmp-narrow">
      <EmptyState
        compact
        icon={BookmarkIcon}
        title={pick(t('No saved styles yet', '아직 저장한 스타일이 없습니다', '保存したスタイルはまだありません'), lang)}
        description={pick(t('Saved styles appear here.', '저장한 스타일이 여기에 표시됩니다.', '保存したスタイルがここに表示されます。'), lang)}
        actions={<DemoButton>{pick(t('Browse', '둘러보기', '見る'), lang)}</DemoButton>}
      />
    </Panel>
  );
}

/* Button ---------------------------------------------------------------------- */

export function ButtonKinds({ lang }: DemoProps) {
  return (
    <div className="cmp-row">
      <DemoButton variant="primary">{pick(t('Save', '저장', '保存'), lang)}</DemoButton>
      <DemoButton>{pick(t('Cancel', '취소', 'キャンセル'), lang)}</DemoButton>
      <DemoButton variant="quiet">{pick(t('Skip', '건너뛰기', 'スキップ'), lang)}</DemoButton>
      <DemoButton variant="critical">{pick(t('Delete', '삭제', '削除'), lang)}</DemoButton>
    </div>
  );
}

export function ButtonStates({ lang }: DemoProps) {
  return (
    <div className="cmp-row">
      <Button icon={RefreshIcon}>{pick(t('Retry', '다시 시도', '再試行'), lang)}</Button>
      <Button variant="primary" busy>
        {pick(t('Saving', '저장 중', '保存中'), lang)}
      </Button>
      <Button disabled>{pick(t('Unavailable', '사용할 수 없음', '使用不可'), lang)}</Button>
      <Button href="#save">{pick(t('Docs', '문서', 'ドキュメント'), lang)}</Button>
      <Button icon={RefreshIcon} aria-label={pick(t('Retry', '다시 시도', '再試行'), lang)} />
    </div>
  );
}

/* Search Field ---------------------------------------------------------------- */

export function SearchDemo({ lang }: DemoProps) {
  const [query, setQuery] = useState('Quiet');
  return (
    <div className="cmp-narrow">
      <SearchField
        label={pick(t('Search styles', '스타일 찾기', 'スタイルを検索'), lang)}
        placeholder={pick(t('Search by name', '스타일 이름으로 찾기', '名前で検索'), lang)}
        clearLabel={pick(t('Clear search', '검색어 지우기', '検索をクリア'), lang)}
        value={query}
        onValueChange={setQuery}
      />
    </div>
  );
}

/* Skeleton -------------------------------------------------------------------- */

export function SkeletonDemo({ lang }: DemoProps) {
  return (
    <Panel className="cmp-narrow">
      <SkeletonGroup className="cmp-loading" label={pick(t('Loading the list', '목록을 불러오는 중', '一覧を読み込み中'), lang)}>
        {['52%', '38%', '46%'].map((width) => (
          <div className="cmp-loading__row" key={width}>
            <Skeleton width={width} height={12} />
            <Skeleton width="24%" height={10} />
          </div>
        ))}
      </SkeletonGroup>
    </Panel>
  );
}

/* Surface --------------------------------------------------------------------- */

const ACTIVITY = [
  { name: t('Theme tokens updated', '테마 토큰 수정', 'テーマトークンを更新'), time: t('2m', '2분 전', '2分前') },
  { name: t('Button radius changed', '버튼 모서리 변경', 'ボタンの角を変更'), time: t('1h', '1시간 전', '1時間前') },
  { name: t('Registry rebuilt', '레지스트리 재생성', 'レジストリを再生成'), time: t('3h', '3시간 전', '3時間前') },
];

export function SurfaceDemo({ lang }: DemoProps) {
  return (
    <Shell className="cmp-demo-shell">
      <ShellHeader title={pick(t('Activity', '활동', 'アクティビティ'), lang)} meta="3" />
      <Panel>
        <ul className="cmp-rows">
          {ACTIVITY.map((item) => (
            <li key={item.name.en}>
              <span className="cmp-rows__name">{pick(item.name, lang)}</span>
              <span className="cmp-rows__time">{pick(item.time, lang)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}

/* Segmented Control ------------------------------------------------------------ */

type Range = 'day' | 'week' | 'month';

const RANGES: Array<{ value: Range; label: L; total: number; caption: L }> = [
  { value: 'day', label: t('Day', '일', '日'), total: 1284, caption: t('Requests today', '오늘 처리한 요청', '今日のリクエスト') },
  { value: 'week', label: t('Week', '주', '週'), total: 8902, caption: t('Requests this week', '이번 주 처리한 요청', '今週のリクエスト') },
  { value: 'month', label: t('Month', '월', '月'), total: 38140, caption: t('Requests this month', '이번 달 처리한 요청', '今月のリクエスト') },
];

export function SegmentedDefault({ lang }: DemoProps) {
  const [range, setRange] = useState<Range>('week');
  const current = RANGES.find((item) => item.value === range) ?? RANGES[0];
  return (
    <div className="cmp-stack">
      <SegmentedControl
        label={pick(t('Period', '기간', '期間'), lang)}
        value={range}
        options={RANGES.map((item) => ({ value: item.value, label: pick(item.label, lang) }))}
        onValueChange={setRange}
      />
      <div className="cmp-figure">
        <RollingNumber className="cmp-figure__value" value={current.total} />
        <span className="cmp-figure__label">{pick(current.caption, lang)}</span>
      </div>
    </div>
  );
}

export function SegmentedStates({ lang }: DemoProps) {
  const [view, setView] = useState('list');
  const [plan, setPlan] = useState('team');
  return (
    <div className="cmp-stack">
      <SegmentedControl
        size="sm"
        label={pick(t('View', '보기', '表示'), lang)}
        value={view}
        options={[
          { value: 'list', label: pick(t('List', '목록', 'リスト'), lang) },
          { value: 'board', label: pick(t('Board', '보드', 'ボード'), lang) },
          { value: 'calendar', label: pick(t('Calendar', '달력', 'カレンダー'), lang) },
        ]}
        onValueChange={setView}
      />
      <SegmentedControl
        label={pick(t('Plan', '요금제', 'プラン'), lang)}
        value={plan}
        options={[
          { value: 'personal', label: pick(t('Personal', '개인', '個人'), lang) },
          { value: 'team', label: pick(t('Team', '팀', 'チーム'), lang) },
          { value: 'enterprise', label: pick(t('Enterprise', '기업', '企業'), lang), disabled: true },
        ]}
        onValueChange={setPlan}
      />
    </div>
  );
}

/* Rolling Number --------------------------------------------------------------- */

const TOKENS = ['48.2k', '49.7k', '51.3k', '54.5k', '61.8k', '62.4k'];

export function RollingCounter({ lang }: DemoProps) {
  const tick = useTicks(TOKENS.length - 1, 1300);
  return (
    <div className="cmp-figure">
      <RollingNumber className="cmp-figure__value" value={TOKENS[tick]} />
      <span className="cmp-figure__label">{pick(t('of 200k tokens', '200k 토큰 중', '200kトークン中'), lang)}</span>
    </div>
  );
}

const PRICES = [1284.5, 1312.75, 1299.1, 1847.2, 2006.35];
const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export function RollingCurrency({ lang }: DemoProps) {
  const tick = useTicks(PRICES.length - 1, 1300);
  return (
    <div className="cmp-figure">
      <RollingNumber className="cmp-figure__value" value={PRICES[tick]} format={usd} />
      <span className="cmp-figure__label">{pick(t('Spent this month', '이번 달 사용액', '今月の利用額'), lang)}</span>
    </div>
  );
}

const STATS: Array<{ label: L; from: string; to: string; delta: L; tone: StatusTone }> = [
  { label: t('Requests', '처리 건수', '処理件数'), from: '12,840', to: '13,126', delta: t('2.2% up', '2.2% 증가', '2.2%増'), tone: 'positive' },
  { label: t('Success rate', '성공률', '成功率'), from: '99.2%', to: '99.4%', delta: t('0.2 pt up', '0.2pt 상승', '0.2pt上昇'), tone: 'positive' },
  { label: t('Average time', '평균 시간', '平均時間'), from: '1.8s', to: '2.4s', delta: t('0.6s slower', '0.6초 느려짐', '0.6秒遅い'), tone: 'caution' },
];

export function RollingStats({ lang }: DemoProps) {
  const tick = useTicks(1, 0, 700);
  return (
    <div className="cmp-stats">
      {STATS.map((stat) => (
        <Panel key={stat.label.en} className="cmp-stat">
          <span className="cmp-stat__label">{pick(stat.label, lang)}</span>
          <RollingNumber className="cmp-stat__value" value={tick ? stat.to : stat.from} />
          <StatusBadge tone={stat.tone} marker="icon">
            {pick(stat.delta, lang)}
          </StatusBadge>
        </Panel>
      ))}
    </div>
  );
}

/* Progress Bar ----------------------------------------------------------------- */

export function ProgressTasks({ lang }: DemoProps) {
  const tick = useTicks(10, 340, 300);
  const clamp = (value: number) => Math.min(100, value);
  const build = clamp(tick * 12);
  const upload = clamp(tick * 25);
  return (
    <div className="cmp-bars">
      <ProgressBar
        label={pick(t('Upload', '업로드', 'アップロード'), lang)}
        value={upload}
        tone={upload === 100 ? 'positive' : 'info'}
        valueText={upload === 100 ? pick(t('Done', '완료', '完了'), lang) : undefined}
      />
      <ProgressBar label={pick(t('Build', '빌드', 'ビルド'), lang)} value={build} tone="info" />
      <ProgressBar label={pick(t('Storage', '저장 공간', 'ストレージ'), lang)} value={4.1} max={5} tone="caution" valueText="4.1 GB / 5 GB" />
      <ProgressBar label={pick(t('Monthly quota', '월 사용량', '月間使用量'), lang)} value={98} tone="critical" />
    </div>
  );
}

export function ProgressStacked({ lang }: DemoProps) {
  const tick = useTicks(1, 0, 400);
  return (
    <div className="cmp-bars">
      <StackedBar
        label={pick(t('Deploys this week', '이번 주 배포', '今週のデプロイ'), lang)}
        segments={[
          { label: pick(t('Done', '완료', '完了'), lang), value: tick ? 128 : 96, tone: 'positive' },
          { label: pick(t('Running', '실행 중', '実行中'), lang), value: tick ? 18 : 30, tone: 'info' },
          { label: pick(t('Needs review', '검토 필요', '要確認'), lang), value: tick ? 9 : 16, tone: 'caution' },
          { label: pick(t('Failed', '실패', '失敗'), lang), value: tick ? 5 : 18, tone: 'critical' },
        ]}
      />
    </div>
  );
}

export function ProgressIndeterminate({ lang }: DemoProps) {
  return (
    <div className="cmp-bars">
      <ProgressBar label={pick(t('Connecting to the server', '서버에 연결하는 중', 'サーバーに接続中'), lang)} indeterminate />
    </div>
  );
}

/* Tooltip ---------------------------------------------------------------------- */

export function TooltipToolbar({ lang }: DemoProps) {
  const actions: Array<[L, ReactNode]> = [
    [t('Copy link', '링크 복사', 'リンクをコピー'), CopyIcon],
    [t('Rename', '이름 바꾸기', '名前を変更'), PencilIcon],
    [t('Archive', '보관', 'アーカイブ'), ArchiveIcon],
    [t('Delete', '삭제', '削除'), TrashIcon],
  ];
  return (
    <div className="cmp-toolbar">
      {actions.map(([label, icon]) => (
        <Tooltip key={label.en} content={pick(label, lang)}>
          <button type="button" className="cmp-icon-button" aria-label={pick(label, lang)}>
            {icon}
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

export function TooltipSides({ lang }: DemoProps) {
  const sides = [
    ['top', t('Top', '위', '上')],
    ['right', t('Right', '오른쪽', '右')],
    ['bottom', t('Bottom', '아래', '下')],
    ['left', t('Left', '왼쪽', '左')],
  ] as const;
  return (
    <div className="cmp-row">
      {sides.map(([side, label]) => (
        <Tooltip key={side} side={side} content={pick(t('A short hint', '짧은 힌트입니다', '短いヒントです'), lang)}>
          <Button>{pick(label, lang)}</Button>
        </Tooltip>
      ))}
    </div>
  );
}

/* Toast ------------------------------------------------------------------------- */

export function ToastDemo({ lang }: DemoProps) {
  // Replay and leaving the page clear what this demo put on the screen.
  useEffect(() => () => toast.dismiss(), []);

  function saved() {
    toast({ tone: 'positive', title: pick(t('Style saved', '스타일을 저장했습니다', 'スタイルを保存しました'), lang) });
  }

  function failed() {
    toast({
      tone: 'critical',
      title: pick(t('Could not publish', '게시하지 못했습니다', '公開できませんでした'), lang),
      description: pick(t('The server did not respond. Try again.', '서버가 응답하지 않았습니다. 다시 시도하세요.', 'サーバーが応答しませんでした。もう一度お試しください。'), lang),
      action: { label: pick(t('Retry', '다시 시도', '再試行'), lang), onClick: saved },
    });
  }

  function deploy() {
    const id = toast({
      busy: true,
      title: pick(t('Deploying', '배포하는 중', 'デプロイ中'), lang),
      description: 'web-stylebook',
    });
    window.setTimeout(() => {
      toast.update(id, {
        busy: false,
        tone: 'positive',
        title: pick(t('Deployed', '배포했습니다', 'デプロイしました'), lang),
      });
    }, 1800);
  }

  function archive() {
    toast({
      title: pick(t('Moved to archive', '보관함으로 옮겼습니다', 'アーカイブに移動しました'), lang),
      action: {
        label: pick(t('Undo', '실행 취소', '元に戻す'), lang),
        onClick: () => toast({ title: pick(t('Restored', '되돌렸습니다', '元に戻しました'), lang) }),
      },
    });
  }

  return (
    <>
      <div className="cmp-row">
        <Button onClick={saved}>{pick(t('Success', '성공', '成功'), lang)}</Button>
        <Button onClick={failed}>{pick(t('Error', '오류', 'エラー'), lang)}</Button>
        <Button onClick={deploy}>{pick(t('Busy, then done', '진행 후 완료', '処理後に完了'), lang)}</Button>
        <Button onClick={archive}>{pick(t('With undo', '실행 취소 포함', '元に戻す付き'), lang)}</Button>
      </div>
      <Toaster label={pick(t('Notifications', '알림', '通知'), lang)} closeLabel={pick(t('Dismiss', '닫기', '閉じる'), lang)} />
    </>
  );
}

/* Gallery previews --------------------------------------------------------------- */

export function RollingPreview({ lang, playing }: PreviewProps) {
  return (
    <div className="cmp-figure">
      <RollingNumber className="cmp-figure__value" value={playing ? '54.5k' : '48.2k'} />
      <span className="cmp-figure__label">{pick(t('of 200k tokens', '200k 토큰 중', '200kトークン中'), lang)}</span>
    </div>
  );
}

export function SegmentedPreview({ lang, playing }: PreviewProps) {
  const index = useCycle(RANGES.length, playing);
  return (
    <SegmentedControl
      label={pick(t('Period', '기간', '期間'), lang)}
      value={RANGES[(index + 1) % RANGES.length].value}
      options={RANGES.map((item) => ({ value: item.value, label: pick(item.label, lang) }))}
      onValueChange={() => undefined}
    />
  );
}

export function ToastPreview({ lang }: PreviewProps) {
  const cards = [
    { tone: 'neutral', title: pick(t('Moved to archive', '보관함으로 옮겼습니다', 'アーカイブに移動しました'), lang) },
    { tone: 'critical', title: pick(t('Could not publish', '게시하지 못했습니다', '公開できませんでした'), lang) },
    { tone: 'positive', title: pick(t('Style saved', '스타일을 저장했습니다', 'スタイルを保存しました'), lang) },
  ] as const;
  return (
    <div className="cmp-toast-fan">
      {cards.map((card) => (
        <ToastCard key={card.tone} tone={card.tone} title={card.title} />
      ))}
    </div>
  );
}

export function BadgePreview({ lang, playing }: PreviewProps) {
  const index = useCycle(3, playing, 1000);
  const sets: StatusTone[][] = [
    ['info', 'positive', 'critical'],
    ['positive', 'positive', 'caution'],
    ['positive', 'info', 'positive'],
  ];
  return (
    <div className="cmp-row">
      {sets[index].map((tone, position) => (
        <StatusBadge key={position} tone={tone} marker="icon" live={tone === 'info'}>
          {pick(TONE_LABEL[tone], lang)}
        </StatusBadge>
      ))}
    </div>
  );
}

export function ProgressPreview({ lang, playing }: PreviewProps) {
  return (
    <div className="cmp-bars cmp-bars--card">
      <ProgressBar label={pick(t('Upload', '업로드', 'アップロード'), lang)} value={playing ? 92 : 46} tone="info" />
      <ProgressBar label={pick(t('Storage', '저장 공간', 'ストレージ'), lang)} value={playing ? 84 : 68} tone="caution" />
    </div>
  );
}

export function TooltipPreview({ lang }: PreviewProps) {
  return (
    <div className="cmp-fake-tip">
      <span className="cmp-fake-tip__bubble">{pick(t('Copy link', '링크 복사', 'リンクをコピー'), lang)}</span>
      <span className="cmp-toolbar">
        <span className="cmp-icon-button">{CopyIcon}</span>
        <span className="cmp-icon-button">{PencilIcon}</span>
        <span className="cmp-icon-button">{TrashIcon}</span>
      </span>
    </div>
  );
}

export function EmptyPreview({ lang }: PreviewProps) {
  return (
    <EmptyState
      icon={BookmarkIcon}
      title={pick(t('No saved styles yet', '아직 저장한 스타일이 없습니다', '保存したスタイルはまだありません'), lang)}
    />
  );
}

export function ButtonPreview({ lang, playing }: PreviewProps) {
  return (
    <div className="cmp-row">
      <Button variant="primary" busy={playing}>
        {pick(t('Save', '저장', '保存'), lang)}
      </Button>
      <Button>{pick(t('Cancel', '취소', 'キャンセル'), lang)}</Button>
    </div>
  );
}

export function SearchPreview({ lang, playing }: PreviewProps) {
  return (
    <div className="cmp-card-field">
      <SearchField
        label={pick(t('Search styles', '스타일 찾기', 'スタイルを検索'), lang)}
        placeholder={pick(t('Search by name', '스타일 이름으로 찾기', '名前で検索'), lang)}
        value={playing ? 'Quiet Utility' : ''}
        onValueChange={() => undefined}
      />
    </div>
  );
}

export function SkeletonPreview() {
  return (
    <div className="cmp-card-field cmp-skeleton-stack">
      <Skeleton width="62%" height={12} />
      <Skeleton width="92%" height={10} />
      <Skeleton width="44%" height={10} />
    </div>
  );
}

export function SurfacePreview() {
  return (
    <Shell className="cmp-card-field">
      <ShellHeader title="Shell" meta="ShellHeader" />
      <Panel>
        <p className="cmp-panel-text">Panel</p>
      </Panel>
    </Shell>
  );
}

/* Switch ------------------------------------------------------------------------- */

export function SwitchDemo({ lang }: DemoProps) {
  const [email, setEmail] = useState(true);
  const [digest, setDigest] = useState(false);
  return (
    <Panel className="cmp-narrow cmp-settings">
      <Switch
        label={pick(t('Email alerts', '이메일 알림', 'メール通知'), lang)}
        description={pick(t('Sent when a deploy fails.', '배포가 실패하면 보냅니다.', 'デプロイが失敗したときに送ります。'), lang)}
        checked={email}
        onCheckedChange={setEmail}
      />
      <Switch
        label={pick(t('Weekly summary', '주간 요약', '週次サマリー'), lang)}
        description={pick(t('Every Monday morning.', '매주 월요일 아침에 보냅니다.', '毎週月曜の朝に送ります。'), lang)}
        checked={digest}
        onCheckedChange={setDigest}
      />
      <Switch
        label={pick(t('Beta features', '베타 기능', 'ベータ機能'), lang)}
        description={pick(t('Available on the Team plan.', 'Team 요금제에서 쓸 수 있습니다.', 'Teamプランで利用できます。'), lang)}
        checked={false}
        onCheckedChange={() => undefined}
        disabled
      />
    </Panel>
  );
}

export function SwitchPreview({ lang, playing }: PreviewProps) {
  return <Switch label={pick(t('Email alerts', '이메일 알림', 'メール通知'), lang)} checked={playing} onCheckedChange={() => undefined} />;
}

/* Text Field ---------------------------------------------------------------------- */

export function TextFieldForm({ lang }: DemoProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('hello@');
  const [touched, setTouched] = useState(true);
  const invalid = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <div className="cmp-narrow cmp-form">
      <TextField
        label={pick(t('Name', '이름', '名前'), lang)}
        placeholder={pick(t('Your name', '이름을 입력하세요', '名前を入力'), lang)}
        value={name}
        onValueChange={setName}
        required
      />
      <TextField
        label={pick(t('Email', '이메일', 'メール'), lang)}
        type="email"
        value={email}
        onValueChange={setEmail}
        onBlur={() => setTouched(true)}
        description={pick(t('We send receipts here.', '영수증을 이 주소로 보냅니다.', '領収書をこのアドレスに送ります。'), lang)}
        error={invalid ? pick(t('Enter a full address, such as name@example.com.', 'name@example.com처럼 전체 주소를 입력하세요.', 'name@example.comのように完全なアドレスを入力してください。'), lang) : undefined}
      />
    </div>
  );
}

export function TextFieldStates({ lang }: DemoProps) {
  const [value, setValue] = useState('Quiet Utility');
  return (
    <div className="cmp-narrow cmp-form">
      <TextField label={pick(t('With a hint', '도움말', 'ヒントあり'), lang)} value={value} onValueChange={setValue} description={pick(t('Shown on the public page.', '공개 페이지에 표시됩니다.', '公開ページに表示されます。'), lang)} />
      <TextField label={pick(t('Read only', '읽기 전용', '読み取り専用'), lang)} value="ws_2Fk9xQ" onValueChange={() => undefined} readOnly />
      <TextField label={pick(t('Disabled', '비활성', '無効'), lang)} value={pick(t('Managed by your admin', '관리자가 설정합니다', '管理者が設定します'), lang)} onValueChange={() => undefined} disabled />
    </div>
  );
}

export function TextAreaDemo({ lang }: DemoProps) {
  const [value, setValue] = useState(pick(t('Type a few lines. The box grows with them.', '여러 줄을 입력해 보세요. 입력창이 함께 늘어납니다.', '数行入力してみてください。入力欄が一緒に広がります。'), lang));
  return (
    <div className="cmp-narrow">
      <TextArea label={pick(t('Release notes', '릴리스 노트', 'リリースノート'), lang)} value={value} onValueChange={setValue} />
    </div>
  );
}

export function TextFieldPreview({ lang }: PreviewProps) {
  return (
    <div className="cmp-card-field">
      <TextField label={pick(t('Email', '이메일', 'メール'), lang)} value="name@example.com" onValueChange={() => undefined} />
    </div>
  );
}

/* Dialog ----------------------------------------------------------------------------- */

const dialogWords = {
  cancel: t('Cancel', '취소', 'キャンセル'),
  close: t('Close', '닫기', '閉じる'),
};

export function DialogRename({ lang }: DemoProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Quiet Utility');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  function save() {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setOpen(false);
    }, 900);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>{pick(t('Rename style', '스타일 이름 바꾸기', 'スタイル名を変更'), lang)}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        locked={busy}
        closeLabel={pick(dialogWords.close, lang)}
        title={pick(t('Rename style', '스타일 이름 바꾸기', 'スタイル名を変更'), lang)}
        description={pick(t('The new name appears everywhere this style is used.', '이 스타일을 쓰는 모든 곳에 새 이름이 표시됩니다.', 'このスタイルを使うすべての場所に新しい名前が表示されます。'), lang)}
        footer={
          <>
            <Button disabled={busy} onClick={() => setOpen(false)}>
              {pick(dialogWords.cancel, lang)}
            </Button>
            <Button variant="primary" busy={busy} onClick={save}>
              {pick(t('Save', '저장', '保存'), lang)}
            </Button>
          </>
        }
      >
        <TextField
          label={pick(t('Name', '이름', '名前'), lang)}
          value={name}
          onValueChange={(next) => {
            setName(next);
            setError(false);
          }}
          error={error ? pick(t('Enter a name.', '이름을 입력하세요.', '名前を入力してください。'), lang) : undefined}
        />
      </Dialog>
    </>
  );
}

export function DialogConfirm({ lang }: DemoProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const attempts = useRef(0);

  function remove() {
    setBusy(true);
    setFailed(false);
    window.setTimeout(() => {
      setBusy(false);
      attempts.current += 1;
      // The first try fails, so the error state is visible in the demo.
      if (attempts.current === 1) setFailed(true);
      else setOpen(false);
    }, 900);
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        {pick(t('Delete project', '프로젝트 삭제', 'プロジェクトを削除'), lang)}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        locked={busy}
        closeLabel={pick(dialogWords.close, lang)}
        title={pick(t('Delete this project?', '이 프로젝트를 삭제할까요?', 'このプロジェクトを削除しますか？'), lang)}
        description={pick(t('Deploys and settings are removed. You cannot undo this.', '배포 기록과 설정이 지워집니다. 되돌릴 수 없습니다.', 'デプロイ履歴と設定が削除されます。元に戻せません。'), lang)}
        footer={
          <>
            <Button disabled={busy} onClick={() => setOpen(false)}>
              {pick(dialogWords.cancel, lang)}
            </Button>
            <Button variant="danger" busy={busy} onClick={remove}>
              {failed ? pick(t('Try again', '다시 시도', '再試行'), lang) : pick(t('Delete', '삭제', '削除'), lang)}
            </Button>
          </>
        }
      >
        {failed ? (
          <p className="cmp-dialog-error" role="alert">
            {pick(t("Couldn't delete the project. Check your connection and try again.", '프로젝트를 삭제하지 못했습니다. 연결을 확인한 뒤 다시 시도하세요.', 'プロジェクトを削除できませんでした。接続を確認して、もう一度お試しください。'), lang)}
          </p>
        ) : null}
      </Dialog>
    </>
  );
}

export function DialogPreview({ lang }: PreviewProps) {
  return (
    <div className="ws-dialog__panel cmp-fake-dialog">
      <p className="ws-dialog__title">{pick(t('Delete this project?', '이 프로젝트를 삭제할까요?', 'このプロジェクトを削除しますか？'), lang)}</p>
      <p className="ws-dialog__description">{pick(t('You cannot undo this.', '되돌릴 수 없습니다.', '元に戻せません。'), lang)}</p>
      <div className="ws-dialog__footer">
        <Button>{pick(dialogWords.cancel, lang)}</Button>
        <Button variant="danger">{pick(t('Delete', '삭제', '削除'), lang)}</Button>
      </div>
    </div>
  );
}

/* Checkbox ---------------------------------------------------------------------- */

const EXPORT_PARTS = [t('Theme tokens', '테마 토큰', 'テーマトークン'), t('Components', '컴포넌트', 'コンポーネント'), t('Usage notes', '사용 안내', '使い方の説明')];

export function CheckboxDemo({ lang }: DemoProps) {
  const [picked, setPicked] = useState([true, false, true]);
  const every = picked.every(Boolean);
  const some = picked.some(Boolean);
  return (
    <Panel className="cmp-narrow cmp-settings">
      <Checkbox label={pick(t('Export everything', '모두 내보내기', 'すべて書き出す'), lang)} checked={every} indeterminate={some && !every} onCheckedChange={(next) => setPicked(picked.map(() => next))} />
      <div className="cmp-indent">
        {EXPORT_PARTS.map((part, index) => (
          <Checkbox key={part.en} label={pick(part, lang)} checked={picked[index]} onCheckedChange={(next) => setPicked(picked.map((value, position) => (position === index ? next : value)))} />
        ))}
      </div>
    </Panel>
  );
}

export function CheckboxStates({ lang }: DemoProps) {
  const [terms, setTerms] = useState(false);
  return (
    <Panel className="cmp-narrow cmp-settings">
      <Checkbox
        label={pick(t('Share usage data', '사용 데이터 공유', '利用データを共有'), lang)}
        description={pick(t('Helps us find what to fix first.', '먼저 고칠 부분을 찾는 데 씁니다.', '先に直すべき点を見つけるために使います。'), lang)}
        checked={terms}
        onCheckedChange={setTerms}
      />
      <Checkbox label={pick(t('Required by your admin', '관리자가 설정한 항목', '管理者が設定した項目'), lang)} checked onCheckedChange={() => undefined} disabled />
      <Checkbox label={pick(t('Not available', '사용할 수 없음', '使用不可'), lang)} checked={false} onCheckedChange={() => undefined} disabled />
    </Panel>
  );
}

export function CheckboxPreview({ lang, playing }: PreviewProps) {
  return (
    <div className="cmp-checks">
      <Checkbox label={pick(EXPORT_PARTS[0], lang)} checked onCheckedChange={() => undefined} />
      <Checkbox label={pick(EXPORT_PARTS[1], lang)} checked={playing} onCheckedChange={() => undefined} />
    </div>
  );
}

/* Radio Group ---------------------------------------------------------------------- */

const VISIBILITY = [
  { value: 'public', label: t('Public', '공개', '公開') },
  { value: 'link', label: t('Anyone with the link', '링크가 있는 사람', 'リンクを知っている人') },
  { value: 'private', label: t('Private', '비공개', '非公開') },
] as const;

type Visibility = (typeof VISIBILITY)[number]['value'];

export function RadioList({ lang }: DemoProps) {
  const [value, setValue] = useState<Visibility>('link');
  return (
    <div className="cmp-narrow">
      <RadioGroup label={pick(t('Who can see this style', '이 스타일을 볼 수 있는 사람', 'このスタイルを見られる人'), lang)} value={value} onValueChange={setValue} options={VISIBILITY.map((option) => ({ value: option.value, label: pick(option.label, lang) }))} />
    </div>
  );
}

export function RadioCards({ lang }: DemoProps) {
  const [plan, setPlan] = useState('team');
  return (
    <div className="cmp-narrow">
      <RadioGroup
        variant="cards"
        label={pick(t('Plan', '요금제', 'プラン'), lang)}
        value={plan}
        onValueChange={setPlan}
        options={[
          { value: 'personal', label: pick(t('Personal', '개인', '個人'), lang), description: pick(t('One seat and three projects.', '1명, 프로젝트 3개까지 씁니다.', '1名、プロジェクト3件まで使えます。'), lang) },
          { value: 'team', label: pick(t('Team', '팀', 'チーム'), lang), description: pick(t('Ten seats and shared styles.', '10명까지 쓰고 스타일을 공유합니다.', '10名まで使え、スタイルを共有できます。'), lang) },
          { value: 'enterprise', label: pick(t('Enterprise', '기업', '企業'), lang), description: pick(t('Contact sales to enable.', '영업팀에 문의하면 쓸 수 있습니다.', '営業にお問い合わせください。'), lang), disabled: true },
        ]}
      />
    </div>
  );
}

export function RadioPreview({ lang, playing }: PreviewProps) {
  const index = useCycle(VISIBILITY.length, playing);
  return (
    <div className="cmp-card-field">
      <RadioGroup hideLabel label={pick(t('Visibility', '공개 범위', '公開範囲'), lang)} name="preview-visibility" value={VISIBILITY[(index + 1) % VISIBILITY.length].value} onValueChange={() => undefined} options={VISIBILITY.map((option) => ({ value: option.value, label: pick(option.label, lang) }))} />
    </div>
  );
}

/* Select ------------------------------------------------------------------------------- */

const PROJECTS = [
  { value: 'web-stylebook', label: 'web-stylebook', hint: '12' },
  { value: 'store', label: 'store', hint: '4' },
  { value: 'mcp-server', label: 'mcp-server', hint: '7' },
  { value: 'docs', label: 'docs', hint: '3' },
  { value: 'api-gateway', label: 'api-gateway', hint: '9' },
  { value: 'design-tokens', label: 'design-tokens', hint: '2' },
  { value: 'billing', label: 'billing', hint: '5' },
  { value: 'marketing-site', label: 'marketing-site', disabled: true },
];

export function SelectDemo({ lang }: DemoProps) {
  const [project, setProject] = useState('');
  return (
    <div className="cmp-narrow">
      <Select label={pick(t('Project', '프로젝트', 'プロジェクト'), lang)} placeholder={pick(t('Choose a project', '프로젝트를 고르세요', 'プロジェクトを選択'), lang)} value={project} onValueChange={setProject} options={PROJECTS} />
    </div>
  );
}

export function SelectPreview({ lang }: PreviewProps) {
  return (
    <div className="cmp-card-field cmp-fake-select">
      <span className="ws-select__label">{pick(t('Project', '프로젝트', 'プロジェクト'), lang)}</span>
      <span className="ws-select__trigger">
        <span className="ws-select__value">web-stylebook</span>
      </span>
      <ul className="ws-select__list">
        <li className="ws-select__option" data-active="">
          <span className="ws-select__option-label">web-stylebook</span>
          <span className="ws-select__hint">12</span>
        </li>
        <li className="ws-select__option">
          <span className="ws-select__option-label">store</span>
          <span className="ws-select__hint">4</span>
        </li>
      </ul>
    </div>
  );
}

/* Slider --------------------------------------------------------------------------------- */

export function SliderDemo({ lang }: DemoProps) {
  const [storage, setStorage] = useState(120);
  return (
    <div className="cmp-narrow">
      <Slider label={pick(t('Storage limit', '저장 공간 한도', 'ストレージ上限'), lang)} value={storage} min={20} max={500} step={10} format={(value) => `${value} GB`} onValueChange={setStorage} />
    </div>
  );
}

export function SliderMarks({ lang }: DemoProps) {
  const [ratio, setRatio] = useState(50);
  return (
    <div className="cmp-narrow">
      <Slider label={pick(t('Traffic share', '트래픽 비율', 'トラフィック比率'), lang)} value={ratio} step={25} format={(value) => `${value}%`} marks={[0, 25, 50, 75, 100]} onValueChange={setRatio} />
    </div>
  );
}

export function SliderPreview({ lang, playing }: PreviewProps) {
  return (
    <div className="cmp-card-field">
      <Slider label={pick(t('Storage limit', '저장 공간 한도', 'ストレージ上限'), lang)} value={playing ? 320 : 120} min={20} max={500} step={10} format={(value) => `${value} GB`} onValueChange={() => undefined} />
    </div>
  );
}

/* Tabs ------------------------------------------------------------------------------------ */

type TabKey = 'overview' | 'activity' | 'settings' | 'billing';

function tabItems(lang: Lang) {
  return [
    { value: 'overview' as TabKey, label: pick(t('Overview', '개요', '概要'), lang), content: <p className="cmp-tab-text">{pick(t('Deploys run from main. The last one finished two minutes ago.', 'main 브랜치에서 배포합니다. 마지막 배포는 2분 전에 끝났습니다.', 'mainブランチからデプロイします。最後のデプロイは2分前に完了しました。'), lang)}</p> },
    { value: 'activity' as TabKey, label: pick(t('Activity', '활동', 'アクティビティ'), lang), count: 12, content: <p className="cmp-tab-text">{pick(t('12 events this week. Three need a review.', '이번 주 활동은 12건이고, 3건은 검토가 필요합니다.', '今週のアクティビティは12件で、3件は確認が必要です。'), lang)}</p> },
    { value: 'settings' as TabKey, label: pick(t('Settings', '설정', '設定'), lang), content: <p className="cmp-tab-text">{pick(t('Change the name, the branch, and who can deploy.', '이름, 브랜치, 배포 권한을 바꿉니다.', '名前、ブランチ、デプロイ権限を変更します。'), lang)}</p> },
    { value: 'billing' as TabKey, label: pick(t('Billing', '결제', '請求'), lang), disabled: true, content: null },
  ];
}

export function TabsDemo({ lang }: DemoProps) {
  const [tab, setTab] = useState<TabKey>('overview');
  return (
    <div className="cmp-wide">
      <Tabs label={pick(t('Project sections', '프로젝트 메뉴', 'プロジェクトのメニュー'), lang)} value={tab} onValueChange={setTab} items={tabItems(lang)} />
    </div>
  );
}

export function TabsPreview({ lang, playing }: PreviewProps) {
  const keys: TabKey[] = ['overview', 'activity', 'settings'];
  const index = useCycle(keys.length, playing);
  return (
    <div className="cmp-card-field cmp-card-field--wide">
      <Tabs label={pick(t('Project sections', '프로젝트 메뉴', 'プロジェクトのメニュー'), lang)} value={keys[index]} onValueChange={() => undefined} items={tabItems(lang).slice(0, 3)} />
    </div>
  );
}

/* Accordion -------------------------------------------------------------------------------- */

function faqItems(lang: Lang) {
  return [
    {
      value: 'install',
      title: pick(t('What do I need to install?', '설치에 무엇이 필요한가요?', 'インストールに何が必要ですか？'), lang),
      content: pick(t('React 19 and one command. The files are copied into your project.', 'React 19와 명령 하나면 됩니다. 파일이 프로젝트로 복사됩니다.', 'React 19とコマンド一つで済みます。ファイルがプロジェクトにコピーされます。'), lang),
    },
    {
      value: 'tailwind',
      title: pick(t('Does it need Tailwind?', 'Tailwind가 필요한가요?', 'Tailwindは必要ですか？'), lang),
      content: pick(t('No. The components are plain CSS with variables.', '아니요. 컴포넌트는 일반 CSS와 변수로 만들었습니다.', 'いいえ。コンポーネントはプレーンなCSSと変数で作っています。'), lang),
    },
    {
      value: 'license',
      title: pick(t('Can I use it in a commercial project?', '상업 프로젝트에 써도 되나요?', '商用プロジェクトで使えますか？'), lang),
      content: pick(t('Yes. The components are MIT licensed.', '네. 컴포넌트는 MIT 라이선스입니다.', 'はい。コンポーネントはMITライセンスです。'), lang),
    },
  ];
}

export function AccordionSingle({ lang }: DemoProps) {
  return (
    <Panel className="cmp-wide">
      <Accordion items={faqItems(lang)} defaultOpen={['install']} />
    </Panel>
  );
}

export function AccordionMultiple({ lang }: DemoProps) {
  return (
    <Panel className="cmp-wide">
      <Accordion multiple items={faqItems(lang)} defaultOpen={['install', 'license']} />
    </Panel>
  );
}

export function AccordionPreview({ lang }: PreviewProps) {
  return (
    <Panel className="cmp-card-field cmp-card-field--wide">
      <Accordion items={faqItems(lang).slice(0, 2)} defaultOpen={['tailwind']} headingAs="h4" />
    </Panel>
  );
}

/* Menu ---------------------------------------------------------------------------------------- */

function menuWords(lang: Lang) {
  return {
    rename: pick(t('Rename', '이름 바꾸기', '名前を変更'), lang),
    duplicate: pick(t('Duplicate', '복제', '複製'), lang),
    archive: pick(t('Archive', '보관', 'アーカイブ'), lang),
    remove: pick(t('Delete', '삭제', '削除'), lang),
  };
}

export function MenuDemo({ lang }: DemoProps) {
  const [last, setLast] = useState('');
  const words = menuWords(lang);
  const items: MenuEntry[] = [
    { key: 'rename', label: words.rename, icon: PencilIcon, shortcut: 'R', onSelect: () => setLast(words.rename) },
    { key: 'duplicate', label: words.duplicate, icon: CopyIcon, shortcut: 'D', onSelect: () => setLast(words.duplicate) },
    { key: 'archive', label: words.archive, icon: ArchiveIcon, onSelect: () => setLast(words.archive) },
    { key: 'separator', separator: true },
    { key: 'delete', label: words.remove, icon: TrashIcon, critical: true, onSelect: () => setLast(words.remove) },
  ];
  return (
    <div className="cmp-stack">
      <Menu label={pick(t('Style actions', '스타일 작업', 'スタイルの操作'), lang)} items={items}>
        <Button icon={MoreIcon}>{pick(t('More', '더보기', 'その他'), lang)}</Button>
      </Menu>
      <p className="cmp-result" aria-live="polite">
        {last ? pick(t(`Chose: ${last}`, `선택한 작업: ${last}`, `選択した操作: ${last}`), lang) : '\u00A0'}
      </p>
    </div>
  );
}

export function MenuPreview({ lang }: PreviewProps) {
  const words = menuWords(lang);
  return (
    <div className="ws-menu cmp-fake-menu">
      <div className="ws-menu__item" data-active="">
        <span className="ws-menu__icon">{PencilIcon}</span>
        <span className="ws-menu__label">{words.rename}</span>
        <kbd className="ws-menu__shortcut">R</kbd>
      </div>
      <div className="ws-menu__item">
        <span className="ws-menu__icon">{CopyIcon}</span>
        <span className="ws-menu__label">{words.duplicate}</span>
        <kbd className="ws-menu__shortcut">D</kbd>
      </div>
      <div className="ws-menu__separator" />
      <div className="ws-menu__item" data-critical="" data-danger="">
        <span className="ws-menu__icon">{TrashIcon}</span>
        <span className="ws-menu__label">{words.remove}</span>
      </div>
    </div>
  );
}

/* Alert ----------------------------------------------------------------------- */

export function AlertDemo({ lang }: DemoProps) {
  const [visible, setVisible] = useState(true);
  return (
    <div className="cmp-stack cmp-narrow">
      <Alert tone="info" title={pick(t('Saved styles sync across devices.', '저장한 스타일은 기기 간에 동기화됩니다.', '保存したスタイルは端末間で同期されます。'), lang)}>
        {pick(t('This stays on the page until you remove it.', '직접 지우기 전까지 페이지에 남습니다.', '自分で消すまでページに残ります。'), lang)}
      </Alert>
      {visible ? (
        <Alert
          tone="critical"
          title={pick(t('The last deploy failed.', '마지막 배포가 실패했습니다.', '最後のデプロイに失敗しました。'), lang)}
          dismissLabel={pick(t('Dismiss alert', '알림 닫기', '通知を閉じる'), lang)}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <Button onClick={() => setVisible(true)}>{pick(t('Show the alert', '알림 다시 보기', '通知を再表示'), lang)}</Button>
      )}
    </div>
  );
}

export function AlertPreview({ lang }: PreviewProps) {
  return (
    <Alert tone="caution" title={pick(t('Review the contrast before publishing.', '게시하기 전에 대비를 확인하세요.', '公開前にコントラストを確認してください。'), lang)} />
  );
}

/* Popover --------------------------------------------------------------------- */

export function PopoverDemo({ lang }: DemoProps) {
  return (
    <Popover label={pick(t('Density', '밀도', '密度'), lang)} content={<p style={{ margin: 0 }}>{pick(t('Comfortable keeps 36px controls. Compact is for dense tables.', 'Comfortable는 36px 컨트롤을 유지합니다. Compact는 빽빽한 표에 씁니다.', 'Comfortableは36pxのコントロールを保ちます。Compactは密度の高い表に使います。'), lang)}</p>}>
      <Button>{pick(t('Density', '밀도', '密度'), lang)}</Button>
    </Popover>
  );
}

export function PopoverPreview({ lang }: PreviewProps) {
  return <Button>{pick(t('Density', '밀도', '密度'), lang)}</Button>;
}
