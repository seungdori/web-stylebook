import type { ComponentType } from 'react';
import statusBadgeTsx from '../../kit/status-badge/status-badge.tsx?raw';
import statusBadgeCss from '../../kit/status-badge/status-badge.css?raw';
import emptyStateTsx from '../../kit/empty-state/empty-state.tsx?raw';
import emptyStateCss from '../../kit/empty-state/empty-state.css?raw';
import surfaceTsx from '../../kit/surface/surface.tsx?raw';
import surfaceCss from '../../kit/surface/surface.css?raw';
import buttonTsx from '../../kit/button/button.tsx?raw';
import buttonCss from '../../kit/button/button.css?raw';
import searchFieldTsx from '../../kit/search-field/search-field.tsx?raw';
import searchFieldCss from '../../kit/search-field/search-field.css?raw';
import skeletonTsx from '../../kit/skeleton/skeleton.tsx?raw';
import skeletonCss from '../../kit/skeleton/skeleton.css?raw';
import segmentedTsx from '../../kit/segmented-control/segmented-control.tsx?raw';
import segmentedCss from '../../kit/segmented-control/segmented-control.css?raw';
import rollingTsx from '../../kit/rolling-number/rolling-number.tsx?raw';
import rollingCss from '../../kit/rolling-number/rolling-number.css?raw';
import progressTsx from '../../kit/progress-bar/progress-bar.tsx?raw';
import progressCss from '../../kit/progress-bar/progress-bar.css?raw';
import tooltipTsx from '../../kit/tooltip/tooltip.tsx?raw';
import tooltipCss from '../../kit/tooltip/tooltip.css?raw';
import toastTsx from '../../kit/toast/toast.tsx?raw';
import toastCss from '../../kit/toast/toast.css?raw';
import switchTsx from '../../kit/switch/switch.tsx?raw';
import switchCss from '../../kit/switch/switch.css?raw';
import textFieldTsx from '../../kit/text-field/text-field.tsx?raw';
import textFieldCss from '../../kit/text-field/text-field.css?raw';
import dialogTsx from '../../kit/dialog/dialog.tsx?raw';
import dialogCss from '../../kit/dialog/dialog.css?raw';
import overlayTsx from '../../kit/overlay/overlay.tsx?raw';
import checkboxTsx from '../../kit/checkbox/checkbox.tsx?raw';
import checkboxCss from '../../kit/checkbox/checkbox.css?raw';
import radioGroupTsx from '../../kit/radio-group/radio-group.tsx?raw';
import radioGroupCss from '../../kit/radio-group/radio-group.css?raw';
import selectTsx from '../../kit/select/select.tsx?raw';
import selectCss from '../../kit/select/select.css?raw';
import sliderTsx from '../../kit/slider/slider.tsx?raw';
import sliderCss from '../../kit/slider/slider.css?raw';
import tabsTsx from '../../kit/tabs/tabs.tsx?raw';
import tabsCss from '../../kit/tabs/tabs.css?raw';
import accordionTsx from '../../kit/accordion/accordion.tsx?raw';
import accordionCss from '../../kit/accordion/accordion.css?raw';
import menuTsx from '../../kit/menu/menu.tsx?raw';
import menuCss from '../../kit/menu/menu.css?raw';
import alertTsx from '../../kit/alert/alert.tsx?raw';
import alertCss from '../../kit/alert/alert.css?raw';
import popoverTsx from '../../kit/popover/popover.tsx?raw';
import popoverCss from '../../kit/popover/popover.css?raw';
import {
  BadgeDots,
  BadgeIcons,
  ButtonKinds,
  ButtonStates,
  DeployList,
  EmptyCompact,
  EmptyFailed,
  EmptyFirstVisit,
  EmptyNoResults,
  ProgressIndeterminate,
  ProgressStacked,
  ProgressTasks,
  RollingCounter,
  RollingCurrency,
  RollingStats,
  SearchDemo,
  SegmentedDefault,
  SegmentedStates,
  SkeletonDemo,
  SurfaceDemo,
  ToastDemo,
  TooltipSides,
  TooltipToolbar,
  AccordionMultiple,
  AccordionPreview,
  AccordionSingle,
  BadgePreview,
  ButtonPreview,
  CheckboxDemo,
  CheckboxPreview,
  CheckboxStates,
  MenuDemo,
  MenuPreview,
  RadioCards,
  RadioList,
  RadioPreview,
  SelectDemo,
  SelectPreview,
  SliderDemo,
  SliderMarks,
  SliderPreview,
  TabsDemo,
  TabsPreview,
  DialogConfirm,
  DialogPreview,
  DialogRename,
  SwitchDemo,
  SwitchPreview,
  TextAreaDemo,
  TextFieldForm,
  TextFieldPreview,
  TextFieldStates,
  EmptyPreview,
  ProgressPreview,
  RollingPreview,
  SearchPreview,
  SegmentedPreview,
  SkeletonPreview,
  SurfacePreview,
  ToastPreview,
  TooltipPreview,
  AlertDemo,
  AlertPreview,
  PopoverDemo,
  PopoverPreview,
  type DemoProps,
  type PreviewProps,
} from './demos';
import { t, type L } from './copy';
import type { PropRow, SourceFile } from './shared';

export interface DocVariant {
  id: string;
  label: L;
  Demo: ComponentType<DemoProps>;
}

export interface ComponentDoc {
  /** The small inert version on the gallery card. */
  Preview: ComponentType<PreviewProps>;
  /** Registry items to install. */
  install: string[];
  variants: DocVariant[];
  /** False when the demo has no motion to run again. */
  replay: boolean;
  usage: string;
  files: SourceFile[];
  props: PropRow[];
  notes?: L[];
}

const importLine = (names: string, file: string) => `import { ${names} } from './components/webstylebook/${file}/${file}';`;
const sources = (name: string, tsx: string, css: string): SourceFile[] => [
  { path: `${name}/${name}.tsx`, code: tsx },
  { path: `${name}/${name}.css`, code: css },
];
const overlaySource: SourceFile = { path: 'overlay/overlay.tsx', code: overlayTsx };

export const COMPONENT_DOCS: Record<string, ComponentDoc> = {
  'rolling-number': {
    Preview: RollingPreview,
    install: ['rolling-number'],
    replay: true,
    variants: [
      { id: 'counter', label: t('Counter', '카운터', 'カウンター'), Demo: RollingCounter },
      { id: 'currency', label: t('Currency', '금액', '金額'), Demo: RollingCurrency },
      { id: 'stats', label: t('Stat cards', '통계 카드', '統計カード'), Demo: RollingStats },
    ],
    usage: `${importLine('RollingNumber', 'rolling-number')}

<RollingNumber value={tokens} />
<RollingNumber value="54.5k" className="usage-total" />
<RollingNumber value={price} format={(n) => \`$\${n.toFixed(2)}\`} />`,
    files: sources('rolling-number', rollingTsx, rollingCss),
    props: [
      ['value', 'number | string', '—', t('A number, or a preformatted string such as "54.5k". Only digits roll.', '숫자 또는 "54.5k"처럼 형식을 갖춘 문자열입니다. 숫자만 회전합니다.', '数値、または"54.5k"のような整形済みの文字列です。数字だけが回転します。')],
      ['format', '(value: number) => string', 'en-US', t('Formats a numeric value.', '숫자 값의 표시 형식을 정합니다.', '数値の表示形式を決めます。')],
      ['stagger', 'number', '28', t('Delay between neighboring digits, right to left, in milliseconds.', '이웃한 자리 사이의 지연 시간입니다. 오른쪽부터 움직이며 단위는 밀리초입니다.', '隣り合う桁の間の遅延です。右から動き、単位はミリ秒です。')],
      ['className', 'string', '—', t('Size and weight are inherited, so set them here or on a parent.', '크기와 굵기는 상속합니다. 여기나 부모 요소에서 정하세요.', 'サイズと太さは継承します。ここか親要素で指定してください。')],
    ],
    notes: [
      t('Screen readers read the whole value once and never hear the digits roll.', '화면 낭독기는 전체 값을 한 번만 읽습니다. 회전 중인 숫자는 읽지 않습니다.', 'スクリーンリーダーは値全体を一度だけ読み上げます。回転中の数字は読み上げません。'),
      t('With reduced motion, the digits change at once.', '움직임 줄이기를 켜면 숫자가 바로 바뀝니다.', '視差効果を減らす設定では、数字はすぐに変わります。'),
      t('If a change needs announcing, put the value in your own live region.', '값이 바뀐 사실을 읽어줘야 하면 직접 만든 live region에 값을 넣으세요.', '値の変化を読み上げる必要があれば、自分で用意したライブリージョンに値を入れてください。'),
    ],
  },
  'segmented-control': {
    Preview: SegmentedPreview,
    install: ['segmented-control'],
    replay: false,
    variants: [
      { id: 'default', label: t('Default', '기본', '基本'), Demo: SegmentedDefault },
      { id: 'states', label: t('Sizes and disabled', '크기와 비활성', 'サイズと無効'), Demo: SegmentedStates },
    ],
    usage: `${importLine('SegmentedControl', 'segmented-control')}

const [range, setRange] = useState('week');

<SegmentedControl
  label="Period"
  value={range}
  onValueChange={setRange}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>`,
    files: sources('segmented-control', segmentedTsx, segmentedCss),
    props: [
      ['label', 'string', '—', t("The group's name for screen readers.", '화면 낭독기가 읽는 그룹 이름입니다.', 'スクリーンリーダーが読むグループ名です。')],
      ['value', 'T', '—', t('The selected value.', '선택한 값입니다.', '選択中の値です。')],
      ['options', '{ value: T; label: ReactNode; disabled?: boolean }[]', '—', t('The choices. Two to five read best.', '선택지입니다. 2개에서 5개가 읽기 좋습니다.', '選択肢です。2〜5個が読みやすい数です。')],
      ['onValueChange', '(value: T) => void', '—', t('Called on a click and on a key press.', '클릭과 키 입력에서 호출합니다.', 'クリックとキー操作で呼ばれます。')],
      ['size', "'sm' | 'md'", "'md'", t("'md' lines up with a Button or Search Field. 'sm' is for dense toolbars.", "'md'는 Button, Search Field와 높이가 같습니다. 'sm'은 좁은 도구 모음에 씁니다.", "'md'はButtonやSearch Fieldと同じ高さです。'sm'は密度の高いツールバーに使います。")],
      ['name', 'string', '—', t('Adds a hidden input so the value is sent with a form.', '숨은 입력을 추가해 폼과 함께 값을 보냅니다.', '隠し入力を追加し、フォームと一緒に値を送ります。')],
    ],
    notes: [
      t('Tab moves to the group. The arrow keys, Home, and End change the choice.', 'Tab으로 그룹에 들어갑니다. 화살표 키와 Home, End로 선택을 바꿉니다.', 'Tabでグループに移動します。矢印キーとHome、Endで選択を変えます。'),
      t('The group is a radiogroup, so a screen reader announces the position and the selected option.', '그룹은 radiogroup입니다. 화면 낭독기가 위치와 선택한 항목을 읽어줍니다.', 'グループはradiogroupです。スクリーンリーダーが位置と選択中の項目を読み上げます。'),
      t('Inside a Shell, set --ws-segmented-track: transparent.', 'Shell 안에서는 --ws-segmented-track을 transparent로 설정하세요.', 'Shellの中では--ws-segmented-trackをtransparentに設定してください。'),
    ],
  },
  toast: {
    Preview: ToastPreview,
    install: ['toast'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: ToastDemo }],
    usage: `${importLine('toast, Toaster', 'toast')}

// Once, near the root of the app.
<Toaster label="Notifications" closeLabel="Dismiss" />

// Anywhere, including outside React.
toast({ tone: 'positive', title: 'Style saved' });

const id = toast({ busy: true, title: 'Deploying' });
toast.update(id, { busy: false, tone: 'positive', title: 'Deployed' });

toast({
  title: 'Moved to archive',
  action: { label: 'Undo', onClick: restore },
});`,
    files: sources('toast', toastTsx, toastCss),
    props: [
      ['toast({ title })', 'ReactNode', '—', t('What happened, in one short sentence.', '일어난 일을 짧은 한 문장으로 씁니다.', '起きたことを短い一文で書きます。')],
      ['toast({ description })', 'ReactNode', '—', t('One more line, when the title is not enough.', '제목만으로 부족할 때 한 줄을 더합니다.', 'タイトルだけでは足りないときに一行加えます。')],
      ['toast({ tone })', "'neutral' | 'positive' | 'caution' | 'critical'", "'neutral'", t("Sets the icon. 'critical' is announced at once.", "아이콘을 정합니다. 'critical'은 화면 낭독기가 바로 읽어줍니다.", "アイコンを決めます。'critical'はすぐに読み上げられます。")],
      ['toast({ busy })', 'boolean', 'false', t('Shows a spinner and stays until updated or dismissed.', '스피너를 보여주고, 바뀌거나 닫힐 때까지 남아 있습니다.', 'スピナーを表示し、更新されるか閉じるまで残ります。')],
      ['toast({ action })', '{ label: string; onClick: () => void }', '—', t('One button, such as Undo. Pressing it closes the toast.', '실행 취소 같은 버튼 하나입니다. 누르면 알림을 닫습니다.', '「元に戻す」のようなボタン一つです。押すと通知を閉じます。')],
      ['toast({ duration })', 'number', '5000 / 9000', t('Milliseconds on screen. Longer when there is an action.', '화면에 머무는 밀리초입니다. 버튼이 있으면 더 깁니다.', '表示時間（ミリ秒）です。ボタンがあると長くなります。')],
      ['toast.update', '(id, patch) => void', '—', t('Changes a toast in place and restarts its timer.', '알림을 같은 자리에서 바꾸고 타이머를 다시 시작합니다.', '通知をその場で変更し、タイマーを再開します。')],
      ['toast.dismiss', '(id?) => void', '—', t('Closes one toast, or all of them with no id.', '알림 하나를 닫습니다. id가 없으면 모두 닫습니다.', '通知を一つ閉じます。idがなければすべて閉じます。')],
      ['Toaster label', 'string', "'Notifications'", t('Names the region for screen readers.', '화면 낭독기가 읽는 영역 이름입니다.', 'スクリーンリーダーが読む領域名です。')],
      ['Toaster closeLabel', 'string', "'Dismiss'", t('The name of the close button.', '닫기 버튼의 이름입니다.', '閉じるボタンの名前です。')],
    ],
    notes: [
      t('Hovering or tabbing into the stack fans it out and stops every timer.', '마우스를 올리거나 Tab으로 들어가면 쌓인 알림이 펼쳐지고 모든 타이머가 멈춥니다.', 'ホバーするかTabで移動すると、重なった通知が広がり、すべてのタイマーが止まります。'),
      t('Other tones wait for a pause in speech. A critical toast is announced at once.', '일반 알림은 읽던 내용이 끝난 뒤 읽어줍니다. critical 알림은 바로 읽어줍니다.', '通常の通知は読み上げの区切りを待ちます。criticalの通知はすぐに読み上げます。'),
      t('Drag a toast to the right to dismiss it.', '알림을 오른쪽으로 끌면 닫힙니다.', '通知を右へドラッグすると閉じます。'),
    ],
  },
  'status-badge': {
    Preview: BadgePreview,
    install: ['status-badge'],
    replay: true,
    variants: [
      { id: 'dot', label: t('Dot', '점', 'ドット'), Demo: BadgeDots },
      { id: 'icon', label: t('Icon', '아이콘', 'アイコン'), Demo: BadgeIcons },
      { id: 'list', label: t('In a list', '목록 안에서', '一覧の中'), Demo: DeployList },
    ],
    usage: `${importLine('StatusBadge', 'status-badge')}

<StatusBadge tone="info" live>Running</StatusBadge>
<StatusBadge tone="positive" marker="icon">Done</StatusBadge>`,
    files: sources('status-badge', statusBadgeTsx, statusBadgeCss),
    props: [
      ['tone', "'neutral' | 'info' | 'positive' | 'caution' | 'critical'", "'neutral'", t('Sets the color.', '색을 정합니다.', '色を決めます。')],
      ['marker', "'dot' | 'icon'", "'dot'", t("The mark before the label. 'icon' adds a shape per tone, so the state does not rely on color alone.", "라벨 앞의 표시입니다. 'icon'은 상태마다 모양이 달라서, 색만으로 상태를 구분하지 않게 합니다.", "ラベルの前の印です。'icon'は状態ごとに形が違うため、色だけに頼らずに状態を区別できます。")],
      ['live', 'boolean', 'false', t("For work in progress: the dot pulses, and the 'info' icon turns.", "진행 중인 작업에 씁니다. 점이 깜빡이고, 'info' 아이콘이 회전합니다.", "処理中の作業に使います。ドットが脈打ち、'info'アイコンが回ります。")],
      ['children', 'ReactNode', '—', t('The state, in one word.', '상태 이름입니다. 한 단어로 씁니다.', '状態名です。一語で書きます。')],
    ],
    notes: [
      t('The label carries the state, so screen readers read it as plain text.', '라벨이 상태를 전달합니다. 화면 낭독기는 일반 글자로 읽습니다.', 'ラベルが状態を伝えます。スクリーンリーダーは通常のテキストとして読みます。'),
      t('With reduced motion, the pulse and the turn stop.', '움직임 줄이기를 켜면 깜빡임과 회전이 멈춥니다.', '視差効果を減らす設定では、脈動と回転が止まります。'),
    ],
  },
  'progress-bar': {
    Preview: ProgressPreview,
    install: ['progress-bar'],
    replay: true,
    variants: [
      { id: 'tasks', label: t('Tasks', '작업', '作業'), Demo: ProgressTasks },
      { id: 'stacked', label: t('Stacked', '누적 막대', '積み上げ'), Demo: ProgressStacked },
      { id: 'indeterminate', label: t('No known end', '진행률 미정', '終了不明'), Demo: ProgressIndeterminate },
    ],
    usage: `${importLine('ProgressBar, StackedBar', 'progress-bar')}

<ProgressBar label="Upload" value={64} tone="info" />
<ProgressBar label="Storage" value={4.1} max={5} valueText="4.1 GB / 5 GB" tone="caution" />
<ProgressBar label="Connecting" indeterminate />

<StackedBar
  label="Deploys this week"
  segments={[
    { label: 'Done', value: 128, tone: 'positive' },
    { label: 'Failed', value: 5, tone: 'critical' },
  ]}
/>`,
    files: sources('progress-bar', progressTsx, progressCss),
    props: [
      ['label', 'string', '—', t('Names the bar, on screen and for screen readers.', '막대의 이름입니다. 화면에 표시되고 화면 낭독기도 읽어줍니다.', 'バーの名前です。画面に表示され、スクリーンリーダーも読み上げます。')],
      ['hideLabel', 'boolean', 'false', t('Hides the label row from view.', '라벨 행을 화면에서 숨깁니다.', 'ラベル行を画面から隠します。')],
      ['value / max', 'number', '0 / 100', t('How far along it is.', '진행한 정도입니다.', '進み具合です。')],
      ['valueText', 'string', '—', t('Replaces the percentage, on screen and for screen readers.', '화면과 화면 낭독기에서 퍼센트 대신 씁니다.', '画面とスクリーンリーダーでパーセントの代わりに使います。')],
      ['tone', "'accent' | 'info' | 'positive' | 'caution' | 'critical'", "'accent'", t('Sets the color.', '색을 정합니다.', '色を決めます。')],
      ['indeterminate', 'boolean', 'false', t('For work with no known end.', '끝을 알 수 없는 작업에 씁니다.', '終わりが分からない処理に使います。')],
      ['StackedBar segments', '{ label; value; tone; valueText? }[]', '—', t('The parts of the whole.', '전체를 이루는 항목입니다.', '全体を構成する項目です。')],
      ['StackedBar max', 'number', 'sum', t('A larger max leaves free space at the end.', '합계보다 크게 주면 끝에 빈 공간이 생깁니다.', '合計より大きくすると、末尾に空きができます。')],
    ],
    notes: [
      t('The bar has the progressbar role, with its label and current value.', '막대는 progressbar 역할을 쓰고, 라벨과 현재 값을 함께 전달합니다.', 'バーはprogressbarロールを使い、ラベルと現在の値を伝えます。'),
      t('The legend of a stacked bar carries the values, so the colored bar is hidden from screen readers.', '누적 막대는 범례가 값을 전달합니다. 색 막대는 화면 낭독기에서 숨깁니다.', '積み上げバーは凡例が値を伝えます。色のバーはスクリーンリーダーから隠します。'),
    ],
  },
  tooltip: {
    Preview: TooltipPreview,
    install: ['tooltip'],
    replay: false,
    variants: [
      { id: 'toolbar', label: t('Toolbar', '도구 모음', 'ツールバー'), Demo: TooltipToolbar },
      { id: 'sides', label: t('Sides', '방향', '方向'), Demo: TooltipSides },
    ],
    usage: `${importLine('Tooltip', 'tooltip')}

<Tooltip content="Copy link">
  <button type="button" aria-label="Copy link">
    <CopyIcon />
  </button>
</Tooltip>`,
    files: [...sources('tooltip', tooltipTsx, tooltipCss), overlaySource],
    props: [
      ['content', 'ReactNode', '—', t('A short hint.', '짧은 힌트입니다.', '短いヒントです。')],
      ['side', "'top' | 'right' | 'bottom' | 'left'", "'top'", t('The preferred side. Flips when there is no room.', '먼저 놓을 방향입니다. 자리가 없으면 반대로 놓습니다.', '優先する方向です。余裕がないときは反対側に置きます。')],
      ['delay', 'number', '450', t('Wait before the first tooltip opens, in milliseconds.', '첫 툴팁이 열리기까지 기다리는 밀리초입니다.', '最初のツールチップが開くまでの待ち時間（ミリ秒）です。')],
      ['children', 'ReactElement', '—', t('One focusable element.', '포커스를 받을 수 있는 요소 하나입니다.', 'フォーカスできる要素を一つ渡します。')],
    ],
    notes: [
      t('It opens on hover and keyboard focus. It does not open on a click or a touch.', '마우스를 올리거나 키보드로 이동하면 열립니다. 클릭이나 터치로는 열리지 않습니다.', 'ホバーとキーボードでの移動で開きます。クリックやタッチでは開きません。'),
      t('Escape closes it. The pointer can move onto the tooltip without closing it.', 'Esc로 닫습니다. 마우스를 툴팁 위로 옮겨도 닫히지 않습니다.', 'Escで閉じます。ポインターをツールチップの上に移しても閉じません。'),
      t('A touch screen never shows it, so keep the only copy of anything somewhere else.', '터치 화면에서는 보이지 않습니다. 다른 곳에 없는 정보는 넣지 마세요.', 'タッチ画面では表示されません。ほかにない情報は入れないでください。'),
    ],
  },
  'empty-state': {
    Preview: EmptyPreview,
    install: ['empty-state', 'button'],
    replay: true,
    variants: [
      { id: 'initial-empty', label: t('First visit', '처음 사용', '初回'), Demo: EmptyFirstVisit },
      { id: 'filtered-empty', label: t('No results', '검색 결과 없음', '検索結果なし'), Demo: EmptyNoResults },
      { id: 'fetch-failed', label: t('Load failed', '불러오기 실패', '読み込み失敗'), Demo: EmptyFailed },
      { id: 'compact', label: t('Compact', '한 줄', '1行'), Demo: EmptyCompact },
    ],
    usage: `${importLine('EmptyState', 'empty-state')}
${importLine('Button', 'button')}

<EmptyState
  tone="critical"
  icon={<AlertIcon />}
  title="Couldn't load your saved styles"
  description="Check your connection and try again."
  actions={<Button variant="primary" onClick={retry}>Try again</Button>}
/>`,
    files: sources('empty-state', emptyStateTsx, emptyStateCss),
    props: [
      ['title', 'ReactNode', '—', t('What is empty or what failed, in one sentence.', '무엇이 비었는지, 무엇이 실패했는지 한 문장으로 씁니다.', '何が空か、何が失敗したかを一文で書きます。')],
      ['description', 'ReactNode', '—', t('What to do next.', '다음에 할 일을 씁니다.', '次にすることを書きます。')],
      ['icon', 'ReactNode', '—', t('A 20px line icon for the situation.', '상황을 나타내는 20px 선 아이콘입니다.', '状況を表す20pxの線アイコンです。')],
      ['actions', 'ReactNode', '—', t('Usually one button.', '보통 버튼 하나를 둡니다.', '通常はボタンを一つ置きます。')],
      ['tone', "'neutral' | 'critical'", "'neutral'", t("'critical' uses the error colors and role=\"alert\", so the message is announced.", "'critical'은 오류 색과 role=\"alert\"를 써서, 화면 낭독기가 메시지를 읽어줍니다.", "'critical'はエラーの色とrole=\"alert\"を使い、スクリーンリーダーがメッセージを読み上げます。")],
      ['framed', 'boolean', 'false', t('A dashed frame with the kit background, for use outside a Panel.', 'Panel 밖에서 쓸 때 kit 배경과 점선 테두리를 그립니다.', 'Panelの外で使うときに、キットの背景と破線の枠を付けます。')],
      ['compact', 'boolean', 'false', t('One row: icon, text, action. For narrow lists and side panels.', '아이콘, 글, 버튼을 한 줄에 둡니다. 좁은 목록과 옆 패널에 씁니다.', 'アイコン、テキスト、ボタンを1行に置きます。狭い一覧やサイドパネルに使います。')],
      ['titleAs', "'p' | 'h2' | 'h3' | 'h4'", "'p'", t('The title element. Pick a heading level that fits the page.', '제목 요소입니다. 페이지 구조에 맞는 제목 수준을 고르세요.', 'タイトルの要素です。ページ構造に合う見出しレベルを選んでください。')],
    ],
    notes: [
      t('A failed load uses role="alert". The other states are not announced on their own.', '불러오기 실패는 role="alert"를 씁니다. 다른 상태는 자동으로 읽어주지 않습니다.', '読み込み失敗はrole="alert"を使います。ほかの状態は自動では読み上げません。'),
      t('When the list loads, move focus to something that stays. This demo moves it to the search field.', '목록을 불러온 뒤에는 포커스를 사라지지 않는 요소로 옮기세요. 이 예시는 검색창으로 옮깁니다.', '一覧を読み込んだら、残る要素にフォーカスを移してください。この例では検索欄に移します。'),
    ],
  },
  switch: {
    Preview: SwitchPreview,
    install: ['switch'],
    replay: false,
    variants: [{ id: 'settings', label: t('Settings', '설정', '設定'), Demo: SwitchDemo }],
    usage: `${importLine('Switch', 'switch')}

<Switch
  label="Email alerts"
  description="Sent when a deploy fails."
  checked={enabled}
  onCheckedChange={setEnabled}
/>`,
    files: sources('switch', switchTsx, switchCss),
    props: [
      ['label', 'ReactNode', '—', t('What the setting controls.', '이 설정이 다루는 내용입니다.', 'この設定の対象です。')],
      ['description', 'ReactNode', '—', t('One line under the label.', '라벨 아래의 한 줄 설명입니다.', 'ラベルの下の一行の説明です。')],
      ['checked', 'boolean', '—', t('Whether it is on.', '켜져 있는지 나타냅니다.', 'オンかどうかを示します。')],
      ['onCheckedChange', '(checked: boolean) => void', '—', t('Called on a click and on Space.', '클릭과 Space 키에서 호출합니다.', 'クリックとSpaceキーで呼ばれます。')],
      ['disabled', 'boolean', 'false', t('Turns the control off.', '조작을 막습니다.', '操作できなくします。')],
    ],
    notes: [
      t('It is a native checkbox with the switch role. Space toggles it.', '브라우저 기본 체크박스에 switch 역할을 준 요소입니다. Space 키로 바꿉니다.', 'ブラウザ標準のチェックボックスにswitchロールを与えた要素です。Spaceキーで切り替えます。'),
      t('The thumb position shows the state, so it does not rely on color.', '손잡이 위치가 상태를 보여주므로 색에만 의존하지 않습니다.', 'つまみの位置が状態を示すため、色だけに頼りません。'),
    ],
  },
  'text-field': {
    Preview: TextFieldPreview,
    install: ['text-field'],
    replay: false,
    variants: [
      { id: 'form', label: t('Form', '입력 폼', 'フォーム'), Demo: TextFieldForm },
      { id: 'states', label: t('States', '상태', '状態'), Demo: TextFieldStates },
      { id: 'textarea', label: t('Text area', '여러 줄', '複数行'), Demo: TextAreaDemo },
    ],
    usage: `${importLine('TextField, TextArea', 'text-field')}

<TextField
  label="Email"
  type="email"
  value={email}
  onValueChange={setEmail}
  description="We send receipts here."
  error={emailError}
/>

<TextArea label="Release notes" value={notes} onValueChange={setNotes} />`,
    files: sources('text-field', textFieldTsx, textFieldCss),
    props: [
      ['label', 'ReactNode', '—', t('Required. Always connected to the input.', '필수입니다. 입력창에 항상 연결됩니다.', '必須です。常に入力欄に関連付けられます。')],
      ['hideLabel', 'boolean', 'false', t('Hides the label from view. Screen readers still read it.', '라벨을 화면에서 숨깁니다. 화면 낭독기는 그대로 읽습니다.', 'ラベルを画面から隠します。スクリーンリーダーは読み上げます。')],
      ['value', 'string', '—', t('The current text.', '현재 입력값입니다.', '現在の入力値です。')],
      ['onValueChange', '(value: string) => void', '—', t('Called on every change.', '값이 바뀔 때마다 호출합니다.', '値が変わるたびに呼ばれます。')],
      ['description', 'ReactNode', '—', t('A hint below the field. An error takes its place.', '입력창 아래의 도움말입니다. 오류가 있으면 오류를 대신 보여줍니다.', '入力欄の下のヒントです。エラーがあるときはエラーを代わりに表示します。')],
      ['error', 'ReactNode', '—', t('What is wrong and how to fix it. Marks the field invalid.', '무엇이 잘못됐고 어떻게 고치는지 씁니다. 입력창을 오류 상태로 표시합니다.', '何が問題で、どう直すかを書きます。入力欄をエラー状態にします。')],
      ['TextArea rows', 'number', '3', t('The starting height. The box grows up to 240px, then scrolls.', '시작 높이입니다. 240px까지 늘어난 뒤 스크롤합니다.', '最初の高さです。240pxまで広がり、その後スクロールします。')],
    ],
    notes: [
      t('The hint or the error is linked with aria-describedby, and an error sets aria-invalid.', '도움말이나 오류는 aria-describedby로 연결하고, 오류가 있으면 aria-invalid를 설정합니다.', 'ヒントやエラーはaria-describedbyで関連付け、エラーがあるときはaria-invalidを設定します。'),
      t('After a failed submit, move focus to the first field with an error.', '제출에 실패하면 오류가 있는 첫 입력창으로 포커스를 옮기세요.', '送信に失敗したら、エラーのある最初の入力欄にフォーカスを移してください。'),
    ],
  },
  checkbox: {
    Preview: CheckboxPreview,
    install: ['checkbox'],
    replay: false,
    variants: [
      { id: 'all', label: t('Select all', '전체 선택', '全選択'), Demo: CheckboxDemo },
      { id: 'states', label: t('States', '상태', '状態'), Demo: CheckboxStates },
    ],
    usage: `${importLine('Checkbox', 'checkbox')}

<Checkbox
  label="Export everything"
  checked={every}
  indeterminate={some && !every}
  onCheckedChange={selectAll}
/>`,
    files: sources('checkbox', checkboxTsx, checkboxCss),
    props: [
      ['label', 'ReactNode', '—', t('What is being chosen.', '선택하는 내용입니다.', '選択する内容です。')],
      ['description', 'ReactNode', '—', t('One line under the label.', '라벨 아래의 한 줄 설명입니다.', 'ラベルの下の一行の説明です。')],
      ['checked', 'boolean', '—', t('Whether it is on.', '선택되어 있는지 나타냅니다.', '選択されているかを示します。')],
      ['onCheckedChange', '(checked: boolean) => void', '—', t('Called on a click and on Space.', '클릭과 Space 키에서 호출합니다.', 'クリックとSpaceキーで呼ばれます。')],
      ['indeterminate', 'boolean', 'false', t('Some of the items it stands for are selected. Shows a dash.', '대상 중 일부만 선택된 상태입니다. 가로줄을 표시합니다.', '対象の一部だけが選択された状態です。横線を表示します。')],
      ['disabled', 'boolean', 'false', t('Turns the control off.', '조작을 막습니다.', '操作できなくします。')],
    ],
    notes: [
      t('It is a native checkbox. Space toggles it, and a screen reader announces the mixed state.', '브라우저 기본 체크박스입니다. Space 키로 바꾸고, 화면 낭독기가 일부 선택 상태를 읽어줍니다.', 'ブラウザ標準のチェックボックスです。Spaceキーで切り替え、スクリーンリーダーが一部選択の状態を読み上げます。'),
    ],
  },
  'radio-group': {
    Preview: RadioPreview,
    install: ['radio-group'],
    replay: false,
    variants: [
      { id: 'list', label: t('List', '목록', 'リスト'), Demo: RadioList },
      { id: 'cards', label: t('Cards', '카드', 'カード'), Demo: RadioCards },
    ],
    usage: `${importLine('RadioGroup', 'radio-group')}

<RadioGroup
  label="Plan"
  variant="cards"
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: 'personal', label: 'Personal', description: 'One seat.' },
    { value: 'team', label: 'Team', description: 'Ten seats.' },
  ]}
/>`,
    files: sources('radio-group', radioGroupTsx, radioGroupCss),
    props: [
      ['label', 'ReactNode', '—', t('Names the group.', '그룹의 이름입니다.', 'グループの名前です。')],
      ['hideLabel', 'boolean', 'false', t('Hides the name from view. Screen readers still read it.', '이름을 화면에서 숨깁니다. 화면 낭독기는 그대로 읽습니다.', '名前を画面から隠します。スクリーンリーダーは読み上げます。')],
      ['value', 'T | ""', '—', t('The selected value.', '선택한 값입니다.', '選択中の値です。')],
      ['onValueChange', '(value: T) => void', '—', t('Called when the choice changes.', '선택이 바뀔 때 호출합니다.', '選択が変わると呼ばれます。')],
      ['options', '{ value; label; description?; disabled? }[]', '—', t('The choices.', '선택지입니다.', '選択肢です。')],
      ['variant', "'list' | 'cards'", "'list'", t("'cards' frames each option, for choices that need a description.", "'cards'는 선택지마다 테두리를 그립니다. 설명이 필요한 선택에 씁니다.", "'cards'は選択肢ごとに枠を付けます。説明が必要な選択に使います。")],
      ['name', 'string', 'useId', t('The form field name.', '폼 필드 이름입니다.', 'フォームのフィールド名です。')],
    ],
    notes: [
      t('Native radios in a fieldset. Tab reaches the group, and the arrow keys change the choice.', 'fieldset 안의 브라우저 기본 라디오입니다. Tab으로 그룹에 들어가고, 화살표 키로 선택을 바꿉니다.', 'fieldset内のブラウザ標準のラジオです。Tabでグループに移動し、矢印キーで選択を変えます。'),
    ],
  },
  select: {
    Preview: SelectPreview,
    install: ['select'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: SelectDemo }],
    usage: `${importLine('Select', 'select')}

<Select
  label="Project"
  placeholder="Choose a project"
  value={project}
  onValueChange={setProject}
  options={[
    { value: 'store', label: 'store', hint: '4' },
    { value: 'docs', label: 'docs', disabled: true },
  ]}
/>`,
    files: [...sources('select', selectTsx, selectCss), overlaySource],
    props: [
      ['label', 'ReactNode', '—', t('Names the field.', '입력 항목의 이름입니다.', '項目の名前です。')],
      ['hideLabel', 'boolean', 'false', t('Hides the label from view. Screen readers still read it.', '라벨을 화면에서 숨깁니다. 화면 낭독기는 그대로 읽습니다.', 'ラベルを画面から隠します。スクリーンリーダーは読み上げます。')],
      ['value', 'T | ""', '—', t("The selected value, or '' for none.", "선택한 값입니다. 없으면 ''입니다.", "選択中の値です。なければ''です。")],
      ['onValueChange', '(value: T) => void', '—', t('Called when an option is chosen.', '항목을 고를 때 호출합니다.', '項目を選ぶと呼ばれます。')],
      ['options', '{ value; label; hint?; disabled? }[]', '—', t('The list. Typing matches label.', '목록입니다. 글자 입력은 label과 비교합니다.', '一覧です。文字入力はlabelと照合します。')],
      ['placeholder', 'string', "''", t('Shown while nothing is selected.', '선택 전에 보여주는 글입니다.', '未選択のときに表示します。')],
      ['name', 'string', '—', t('Adds a hidden input, so the value is sent with a form. A disabled select does not submit.', '숨은 입력을 추가해 값을 폼과 함께 보냅니다. 비활성 선택은 제출되지 않습니다.', '非表示の入力を追加し、値をフォームと一緒に送ります。無効な選択は送信されません。')],
      ['disabled', 'boolean', 'false', t('Turns the control off.', '조작을 막습니다.', '操作できなくします。')],
      ['error', 'ReactNode', '—', t('What is wrong. Marks the field invalid and replaces the description.', '무엇이 잘못됐는지 보여줍니다. 항목을 잘못된 상태로 표시하고 설명을 대신합니다.', '何が違うかを示します。項目を無効にし、説明の代わりに表示します。')],
      ['description', 'ReactNode', '—', t('A hint under the field.', '항목 아래의 도움말입니다.', '項目の下のヒントです。')],
      ['required', 'boolean', 'false', t('Shows a required mark and sets aria-required.', '필수 표시를 보여주고 aria-required를 설정합니다.', '必須マークを表示し、aria-requiredを設定します。')],
      ['id', 'string', '—', t('The trigger id. The label points at it.', '트리거 id입니다. 라벨이 이것을 가리킵니다.', 'トリガーのidです。ラベルがこれを指します。')],
    ],
    notes: [
      t('Arrow keys, Enter, or Space open the list. Arrow keys, Home, End, and typing a name move through it. Korean and Japanese composition is ignored until the syllable is committed.', '화살표 키, Enter, Space로 목록을 엽니다. 화살표 키, Home, End, 글자 입력으로 항목을 옮겨 다닙니다. 한글과 일본어는 글자가 확정되기 전의 조합을 무시합니다.', '矢印キー、Enter、Spaceで一覧を開きます。矢印キー、Home、End、文字入力で項目を移動します。日本語と韓国語は、文字が確定する前の変換を無視します。'),
      t('Enter chooses, and Escape closes. Focus stays on the field the whole time.', 'Enter로 고르고 Esc로 닫습니다. 포커스는 계속 입력 항목에 있습니다.', 'Enterで選び、Escで閉じます。フォーカスは常に項目に残ります。'),
    ],
  },
  slider: {
    Preview: SliderPreview,
    install: ['slider'],
    replay: false,
    variants: [
      { id: 'default', label: t('Default', '기본', '基本'), Demo: SliderDemo },
      { id: 'marks', label: t('Marks', '눈금', '目盛り'), Demo: SliderMarks },
    ],
    usage: `${importLine('Slider', 'slider')}

<Slider
  label="Storage limit"
  value={limit}
  onValueChange={setLimit}
  min={20}
  max={500}
  step={10}
  format={(value) => \`\${value} GB\`}
/>`,
    files: sources('slider', sliderTsx, sliderCss),
    props: [
      ['label', 'ReactNode', '—', t('Names the slider.', '슬라이더의 이름입니다.', 'スライダーの名前です。')],
      ['hideLabel', 'boolean', 'false', t('Hides the label from view. Screen readers still read it.', '라벨을 화면에서 숨깁니다. 화면 낭독기는 그대로 읽습니다.', 'ラベルを画面から隠します。スクリーンリーダーは読み上げます。')],
      ['value', 'number', '—', t('The current value.', '현재 값입니다.', '現在の値です。')],
      ['onValueChange', '(value: number) => void', '—', t('Called while dragging and on each key press.', '끄는 동안과 키를 누를 때 호출합니다.', 'ドラッグ中とキーを押したときに呼ばれます。')],
      ['min / max / step', 'number', '0 / 100 / 1', t('The range and the step.', '범위와 간격입니다.', '範囲と間隔です。')],
      ['format', '(value: number) => string', 'String', t('The text beside the label, also read by screen readers.', '라벨 옆의 글입니다. 화면 낭독기도 이 글을 읽습니다.', 'ラベルの横のテキストです。スクリーンリーダーもこれを読み上げます。')],
      ['marks', 'number[]', '—', t('Values to label under the track.', '막대 아래에 표시할 값입니다.', 'トラックの下に表示する値です。')],
    ],
    notes: [t('It is a native range input. Arrow keys step, and Home and End go to the ends.', '브라우저 기본 범위 입력입니다. 화살표 키로 한 칸씩, Home과 End로 양 끝으로 이동합니다.', 'ブラウザ標準の範囲入力です。矢印キーで一段ずつ、HomeとEndで両端へ移動します。')],
  },
  tabs: {
    Preview: TabsPreview,
    install: ['tabs'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: TabsDemo }],
    usage: `${importLine('Tabs', 'tabs')}

<Tabs
  label="Project sections"
  value={tab}
  onValueChange={setTab}
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', count: 12, content: <Activity /> },
  ]}
/>`,
    files: sources('tabs', tabsTsx, tabsCss),
    props: [
      ['label', 'string', '—', t('Names the tab list for screen readers.', '화면 낭독기가 읽는 탭 목록의 이름입니다.', 'スクリーンリーダーが読むタブ一覧の名前です。')],
      ['value', 'T', '—', t('The selected tab.', '선택한 탭입니다.', '選択中のタブです。')],
      ['onValueChange', '(value: T) => void', '—', t('Called on a click and on the arrow keys.', '클릭과 화살표 키에서 호출합니다.', 'クリックと矢印キーで呼ばれます。')],
      ['items', '{ value; label; count?; disabled?; content }[]', '—', t('The tabs. Only the selected panel is rendered.', '탭 목록입니다. 선택한 패널만 렌더링합니다.', 'タブの一覧です。選択中のパネルだけをレンダリングします。')],
    ],
    notes: [
      t('Tab reaches the selected tab. The arrow keys, Home, and End change tabs.', 'Tab으로 선택한 탭에 들어갑니다. 화살표 키, Home, End로 탭을 바꿉니다.', 'Tabで選択中のタブに移動します。矢印キー、Home、Endでタブを変えます。'),
      t('To choose a value rather than switch content, use a Segmented Control.', '내용 전환이 아니라 값을 고를 때는 Segmented Control을 쓰세요.', '内容の切り替えではなく値を選ぶときは、Segmented Controlを使ってください。'),
    ],
  },
  accordion: {
    Preview: AccordionPreview,
    install: ['accordion'],
    replay: false,
    variants: [
      { id: 'single', label: t('One open', '하나만 열기', '一つだけ開く'), Demo: AccordionSingle },
      { id: 'multiple', label: t('Several open', '여러 개 열기', '複数開く'), Demo: AccordionMultiple },
    ],
    usage: `${importLine('Accordion', 'accordion')}

<Accordion
  defaultOpen={['install']}
  items={[
    { value: 'install', title: 'What do I need?', content: 'React 19.' },
    { value: 'license', title: 'Which license?', content: 'MIT.' },
  ]}
/>`,
    files: sources('accordion', accordionTsx, accordionCss),
    props: [
      ['items', '{ value; title; content; disabled? }[]', '—', t('The sections.', '구역 목록입니다.', '区画の一覧です。')],
      ['multiple', 'boolean', 'false', t('Lets several sections stay open.', '여러 구역을 함께 열 수 있습니다.', '複数の区画を同時に開けます。')],
      ['defaultOpen', 'string[]', '[]', t('The values open at first.', '처음에 열어 둘 값입니다.', '最初に開いておく値です。')],
      ['headingAs', "'h2' | 'h3' | 'h4'", "'h3'", t('The heading level. Pick one that fits the page.', '제목 수준입니다. 페이지 구조에 맞게 고르세요.', '見出しレベルです。ページ構造に合わせて選んでください。')],
      ['open', 'string[]', '—', t('The values open now. Pass this to control the accordion.', '지금 열린 값입니다. 아코디언을 직접 제어할 때 넘깁니다.', '今開いている値です。アコーディオンを制御するときに渡します。')],
      ['onOpenChange', '(open: string[]) => void', '—', t('Called with the next open values.', '다음에 열릴 값으로 호출합니다.', '次に開く値で呼ばれます。')],
    ],
    notes: [t('Each title is a button in a heading. Content in a closed section leaves the tab order.', '제목은 heading 안의 버튼입니다. 닫힌 구역의 내용은 Tab 순서에서 빠집니다.', 'タイトルは見出し内のボタンです。閉じた区画の内容はTabの順序から外れます。')],
  },
  menu: {
    Preview: MenuPreview,
    install: ['menu', 'button'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: MenuDemo }],
    usage: `${importLine('Menu', 'menu')}
${importLine('Button', 'button')}

<Menu
  label="Style actions"
  items={[
    { key: 'rename', label: 'Rename', shortcut: 'R', onSelect: rename },
    { key: 'line', separator: true },
    { key: 'delete', label: 'Delete', critical: true, onSelect: remove },
  ]}
>
  <Button>More</Button>
</Menu>`,
    files: [...sources('menu', menuTsx, menuCss), overlaySource],
    props: [
      ['label', 'string', '—', t('Names the menu for screen readers.', '화면 낭독기가 읽는 메뉴 이름입니다.', 'スクリーンリーダーが読むメニューの名前です。')],
      ['items', 'MenuEntry[]', '—', t('Actions and separators.', '작업과 구분선입니다.', '操作と区切り線です。')],
      ['item.onSelect', '() => void', '—', t('Runs after the menu closes.', '메뉴가 닫힌 뒤 실행합니다.', 'メニューが閉じた後に実行します。')],
      ['item.shortcut', 'string', '—', t('Text only. The menu does not listen for the key.', '표시만 합니다. 메뉴가 키 입력을 받지는 않습니다.', '表示のみです。メニューはキー入力を受け取りません。')],
      ['item.critical', 'boolean', 'false', t("Red, for an action that removes something. 'danger' is a deprecated alias.", '삭제 같은 작업을 빨간색으로 표시합니다. danger는 같은 뜻의 예전 이름입니다.', '削除などの操作を赤で表示します。dangerは同じ意味の古い名前です。')],
      ['side', "'top' | 'right' | 'bottom' | 'left'", "'bottom'", t('The preferred side. Flips when there is no room.', '먼저 놓을 방향입니다. 자리가 없으면 반대로 놓습니다.', '優先する方向です。余裕がないときは反対側に置きます。')],
      ['children', 'ReactElement', '—', t('The trigger: one button.', '메뉴를 여는 버튼 하나입니다.', 'メニューを開くボタン一つです。')],
    ],
    notes: [
      t('Enter or Space opens it on the first item. Arrow keys, Home, End, and typing a name move through it.', 'Enter나 Space로 열면 첫 항목에서 시작합니다. 화살표 키, Home, End, 글자 입력으로 항목을 옮겨 다닙니다.', 'EnterかSpaceで開くと最初の項目から始まります。矢印キー、Home、End、文字入力で項目を移動します。'),
      t('Escape closes it, and focus returns to the button.', 'Esc로 닫으면 포커스가 버튼으로 돌아옵니다.', 'Escで閉じると、フォーカスがボタンに戻ります。'),
      t('To add a tooltip to the trigger, put Tooltip inside Menu, around the button.', '트리거에 툴팁을 붙이려면 Menu 안에서 버튼을 Tooltip으로 감싸세요.', 'トリガーにツールチップを付けるには、Menuの中でボタンをTooltipで囲んでください。'),
    ],
  },
  dialog: {
    Preview: DialogPreview,
    install: ['dialog', 'button'],
    replay: false,
    variants: [
      { id: 'rename', label: t('Form', '입력', '入力'), Demo: DialogRename },
      { id: 'confirm', label: t('Confirm', '삭제 확인', '削除の確認'), Demo: DialogConfirm },
    ],
    usage: `${importLine('Dialog', 'dialog')}
${importLine('Button', 'button')}

<Dialog
  open={open}
  onOpenChange={setOpen}
  locked={deleting}
  title="Delete this project?"
  description="You cannot undo this."
  footer={
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="critical" busy={deleting} onClick={remove}>Delete</Button>
    </>
  }
/>`,
    files: sources('dialog', dialogTsx, dialogCss),
    props: [
      ['open', 'boolean', '—', t('Whether the dialog is open.', '창이 열려 있는지 나타냅니다.', 'ウィンドウが開いているかを示します。')],
      ['onOpenChange', '(open: boolean) => void', '—', t('Called on Escape, an outside click, and the close button.', 'Esc, 바깥 클릭, 닫기 버튼에서 호출합니다.', 'Esc、外側のクリック、閉じるボタンで呼ばれます。')],
      ['title', 'ReactNode', '—', t('Names the dialog.', '창의 이름입니다.', 'ウィンドウの名前です。')],
      ['description', 'ReactNode', '—', t('What this dialog is for. Read after the title.', '창의 목적입니다. 제목 다음에 읽어줍니다.', 'ウィンドウの目的です。タイトルの次に読み上げます。')],
      ['footer', 'ReactNode', '—', t('Buttons. Put Cancel first, so a destructive action does not get focus.', '버튼을 둡니다. 취소를 앞에 두어 위험한 작업에 포커스가 가지 않게 합니다.', 'ボタンを置きます。キャンセルを先に置き、危険な操作にフォーカスが移らないようにします。')],
      ['locked', 'boolean', 'false', t('While work runs, Escape and outside clicks do nothing.', '작업 중에는 Esc와 바깥 클릭을 막습니다.', '処理中はEscと外側のクリックを無効にします。')],
      ['closeLabel', 'string', "'Close'", t('The name of the close button for screen readers.', '화면 낭독기가 읽는 닫기 버튼 이름입니다.', 'スクリーンリーダーが読む閉じるボタンの名前です。')],
      ['titleAs', "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", "'h2'", t('The heading level. The title always uses the kit text color.', '제목 수준입니다. 제목 색은 항상 키트 글자색을 씁니다.', '見出しレベルです。タイトルの色は常にキットの文字色です。')],
    ],
    notes: [
      t('The browser keeps Tab inside the dialog and returns focus to the trigger on close.', '브라우저가 Tab을 창 안에 가두고, 닫으면 트리거로 포커스를 돌려줍니다.', 'ブラウザがTabをウィンドウ内に留め、閉じるとトリガーにフォーカスを戻します。'),
      t('Escape closes it unless it is locked. The page behind does not scroll.', 'locked가 아니면 Esc로 닫습니다. 뒤쪽 페이지는 스크롤되지 않습니다.', 'lockedでなければEscで閉じます。背後のページはスクロールしません。'),
    ],
  },
  button: {
    Preview: ButtonPreview,
    install: ['button'],
    replay: false,
    variants: [
      { id: 'kinds', label: t('Kinds', '종류', '種類'), Demo: ButtonKinds },
      { id: 'states', label: t('States', '상태', '状態'), Demo: ButtonStates },
    ],
    usage: `${importLine('Button', 'button')}

<Button variant="primary" busy={saving} onClick={save}>Save</Button>
<Button icon={<RefreshIcon />}>Retry</Button>`,
    files: sources('button', buttonTsx, buttonCss),
    props: [
      ['variant', "'primary' | 'secondary' | 'quiet' | 'critical'", "'secondary'", t("Use one primary button per area. 'critical' is for an action that cannot be undone. 'danger' is a deprecated alias.", "한 영역에 주 버튼은 하나만 둡니다. 'critical'은 되돌릴 수 없는 작업에 씁니다. 'danger'는 같은 뜻의 예전 이름입니다.", "一つの領域にプライマリボタンは一つだけ置きます。'critical'は元に戻せない操作に使います。'danger'は同じ意味の古い名前です。")],
      ['href', 'string', '—', t('Renders a link with the same styles. Omit it for a button.', '같은 모양의 링크로 그립니다. 없으면 버튼입니다.', '同じ見た目のリンクとして描きます。省略するとボタンです。')],
      ['aria-label', 'string', '—', t('Required when the button has no visible text, such as an icon-only button.', '보이는 글자가 없을 때 필요합니다. 아이콘만 있는 버튼이 그렇습니다.', '見える文字がないときに必要です。アイコンだけのボタンがそれです。')],
      ['icon', 'ReactNode', '—', t('A 16px line icon before the label.', '라벨 앞의 16px 선 아이콘입니다.', 'ラベルの前の16pxの線アイコンです。')],
      ['busy', 'boolean', 'false', t('Shows a spinner and ignores clicks. Focus stays on the button.', '스피너를 보여주고 클릭을 받지 않습니다. 포커스는 버튼에 그대로 둡니다.', 'スピナーを表示し、クリックを受け付けません。フォーカスはボタンに残ります。')],
    ],
    notes: [t('While busy, the button stays focusable and reports aria-busy.', '처리 중에도 버튼에 포커스할 수 있고, aria-busy로 상태를 알립니다.', '処理中もボタンにフォーカスでき、aria-busyで状態を伝えます。')],
  },
  'search-field': {
    Preview: SearchPreview,
    install: ['search-field'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: SearchDemo }],
    usage: `${importLine('SearchField', 'search-field')}

<SearchField label="Search styles" value={query} onValueChange={setQuery} />`,
    files: sources('search-field', searchFieldTsx, searchFieldCss),
    props: [
      ['label', 'string', '—', t('Required. Hidden from view unless showLabel is set.', '필수입니다. showLabel을 켜지 않으면 화면에는 보이지 않습니다.', '必須です。showLabelを指定しない限り画面には表示されません。')],
      ['value', 'string', '—', t('The current text.', '현재 입력값입니다.', '現在の入力値です。')],
      ['onValueChange', '(value: string) => void', '—', t('Called on typing, on the clear button, and on Escape.', '입력할 때, 지우기 버튼을 누를 때, Esc를 누를 때 호출합니다.', '入力時、クリアボタン、Escキーで呼ばれます。')],
      ['showLabel', 'boolean', 'false', t('Shows the label above the field.', '입력창 위에 라벨을 보여줍니다.', '入力欄の上にラベルを表示します。')],
      ['clearLabel', 'string', "'Clear search'", t('The name of the clear button for screen readers.', '화면 낭독기가 읽는 지우기 버튼 이름입니다.', 'スクリーンリーダーが読むクリアボタンの名前です。')],
    ],
    notes: [t('Escape clears a non-empty value. During Korean or Japanese composition, it only cancels the composition.', 'Esc는 입력값을 지웁니다. 한글이나 일본어를 조합하는 중에는 조합만 취소합니다.', 'Escは入力値を消します。日本語や韓国語の変換中は、変換だけを取り消します。')],
  },
  skeleton: {
    Preview: SkeletonPreview,
    install: ['skeleton'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: SkeletonDemo }],
    usage: `${importLine('Skeleton, SkeletonGroup', 'skeleton')}

<SkeletonGroup label="Loading saved styles">
  <Skeleton width="46%" height={12} />
  <Skeleton width="24%" height={10} />
</SkeletonGroup>`,
    files: sources('skeleton', skeletonTsx, skeletonCss),
    props: [
      ['Skeleton width / height', 'number | string', "'100%' / 12", t('The block size.', '블록 크기입니다.', 'ブロックの大きさです。')],
      ['Skeleton radius', "'xs' | 'sm' | 'round'", "'xs'", t('The corner.', '모서리입니다.', '角の丸みです。')],
      ['SkeletonGroup label', 'string', '—', t('Announced once while the content loads.', '불러오는 동안 한 번 읽어주는 안내입니다.', '読み込み中に一度読み上げる案内です。')],
    ],
    notes: [t('Blocks are hidden from screen readers. Only the group label is announced.', '블록은 화면 낭독기에서 숨깁니다. 그룹 안내만 읽어줍니다.', 'ブロックはスクリーンリーダーから隠します。グループの案内だけを読み上げます。')],
  },
  surface: {
    Preview: SurfacePreview,
    install: ['surface'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: SurfaceDemo }],
    usage: `${importLine('Panel, Shell, ShellHeader', 'surface')}

<Shell>
  <ShellHeader title="Activity" meta="3" />
  <Panel>…</Panel>
</Shell>`,
    files: sources('surface', surfaceTsx, surfaceCss),
    props: [
      ['Shell as', "'div' | 'section' | 'article' | 'aside'", "'div'", t('The outer element.', '바깥 요소입니다.', '外側の要素です。')],
      ['ShellHeader title', 'ReactNode', '—', t('The title in the header row.', '머리글 행의 제목입니다.', 'ヘッダー行のタイトルです。')],
      ['ShellHeader meta', 'ReactNode', '—', t('A short count or status on the right.', '오른쪽에 두는 짧은 개수나 상태입니다.', '右側に置く短い件数や状態です。')],
      ['ShellHeader actions', 'ReactNode', '—', t('Buttons on the right of the title row.', '제목 행 오른쪽의 버튼입니다.', 'タイトル行の右側のボタンです。')],
      ['ShellHeader titleAs', "'p' | 'h2' | 'h3' | 'h4'", "'p'", t('The title element.', '제목 요소입니다.', 'タイトルの要素です。')],
    ],
  },
  alert: {
    Preview: AlertPreview,
    install: ['alert'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: AlertDemo }],
    usage: `${importLine('Alert', 'alert')}

<Alert tone="info" title="Saved styles sync across devices.">
  This stays until you remove it.
</Alert>
<Alert tone="critical" title="The last deploy failed." onDismiss={dismiss} dismissLabel="Dismiss alert" />`,
    files: sources('alert', alertTsx, alertCss),
    props: [
      ['tone', "'neutral' | 'info' | 'positive' | 'caution' | 'critical'", "'info'", t('The color. critical is announced immediately.', '색입니다. critical은 바로 읽어줍니다.', '色です。criticalはすぐに読み上げます。')],
      ['title', 'ReactNode', '—', t('The one line a person should read.', '먼저 읽어야 할 한 줄입니다.', '最初に読む一行です。')],
      ['children', 'ReactNode', '—', t('More detail under the title.', '제목 아래의 자세한 설명입니다.', 'タイトルの下の詳しい説明です。')],
      ['onDismiss', '() => void', '—', t('Shows a close button. The alert does not remove itself.', '닫기 버튼을 보여줍니다. 알림이 스스로 사라지지는 않습니다.', '閉じるボタンを表示します。通知は自分では消えません。')],
      ['dismissLabel', 'string', "'Dismiss'", t('The close button name for screen readers.', '화면 낭독기가 읽는 닫기 버튼 이름입니다.', 'スクリーンリーダーが読む閉じるボタンの名前です。')],
    ],
    notes: [
      t('A critical alert uses role="alert". Other tones are ordinary text, so a banner that is already on the page is not announced again.', 'critical은 role="alert"를 씁니다. 다른 톤은 일반 텍스트라서, 이미 페이지에 있는 배너를 다시 읽어주지 않습니다.', 'criticalはrole="alert"を使います。ほかのトーンは普通のテキストなので、すでにページにあるバナーを再度読み上げません。'),
    ],
  },
  popover: {
    Preview: PopoverPreview,
    install: ['popover', 'button'],
    replay: false,
    variants: [{ id: 'default', label: t('Default', '기본', '基本'), Demo: PopoverDemo }],
    usage: `${importLine('Popover', 'popover')}
${importLine('Button', 'button')}

<Popover label="Density" content={<p>Comfortable keeps 36px controls.</p>}>
  <Button>Density</Button>
</Popover>`,
    files: [...sources('popover', popoverTsx, popoverCss), overlaySource],
    props: [
      ['label', 'string', '—', t('Names the popup for screen readers.', '화면 낭독기가 읽는 팝업 이름입니다.', 'スクリーンリーダーが読むポップアップの名前です。')],
      ['content', 'ReactNode', '—', t('What the popup holds.', '팝업 안의 내용입니다.', 'ポップアップの中身です。')],
      ['open', 'boolean', '—', t('Controls the popup. Omit it to let the popup remember its own open state.', '팝업을 직접 제어합니다. 생략하면 팝업이 열림 상태를 기억합니다.', 'ポップアップを制御します。省略すると、ポップアップが開閉状態を覚えます。')],
      ['defaultOpen', 'boolean', 'false', t('Open at first, when open is not set.', 'open을 쓰지 않을 때 처음부터 열어 둡니다.', 'openを指定しないとき、最初から開いておきます。')],
      ['onOpenChange', '(open: boolean) => void', '—', t('Called when the popup opens or closes.', '팝업이 열리거나 닫힐 때 호출합니다.', 'ポップアップが開閉するときに呼ばれます。')],
      ['side', "'top' | 'right' | 'bottom' | 'left'", "'bottom'", t('The preferred side. Flips when there is no room.', '먼저 놓을 방향입니다. 자리가 없으면 반대로 놓습니다.', '優先する方向です。余裕がないときは反対側に置きます。')],
      ['children', 'ReactElement', '—', t('The trigger: one button.', '팝업을 여는 버튼 하나입니다.', 'ポップアップを開くボタン一つです。')],
    ],
    notes: [
      t('Click or Arrow Down opens it. Escape and an outside press close it, and focus returns to the button. The page behind stays usable.', '클릭이나 아래 화살표로 엽니다. Esc와 바깥 클릭으로 닫히고, 포커스는 버튼으로 돌아갑니다. 뒤의 페이지는 그대로 쓸 수 있습니다.', 'クリックか下矢印で開きます。Escと外側のクリックで閉じ、フォーカスはボタンに戻ります。背後のページはそのまま使えます。'),
    ],
  },
};
