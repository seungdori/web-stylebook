import type { LocalizedText } from './styles';

// The component index. Routes, the gallery, and the sidebar all read this
// list, so a new component is added in one place. Order is the gallery order.

export type KitCategory = 'status' | 'input' | 'navigation' | 'feedback' | 'foundations';

export interface KitEntry {
  /** Also the registry item name: /r/<slug>.json */
  slug: string;
  name: string;
  category: KitCategory;
  summary: LocalizedText;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

export const KIT_PATH = '/pages/components';
export const KIT_START_SLUG = 'getting-started';

export const kitCategories: Array<{ id: KitCategory; label: LocalizedText }> = [
  { id: 'status', label: t('Status', '상태', '状態') },
  { id: 'input', label: t('Input', '입력', '入力') },
  { id: 'navigation', label: t('Navigation', '탐색', 'ナビゲーション') },
  { id: 'feedback', label: t('Feedback', '안내', '案内') },
  { id: 'foundations', label: t('Foundations', '기초', '基礎') },
];

export const kitCatalog: KitEntry[] = [
  {
    slug: 'rolling-number',
    name: 'Rolling Number',
    category: 'status',
    summary: t(
      'A number whose digits roll to their new value. Units and separators stay still.',
      '값이 바뀌면 각 자리의 숫자가 회전하며 새 값으로 바뀝니다. 단위와 구분 기호는 움직이지 않습니다.',
      '値が変わると数字が桁ごとに回転します。単位と区切り記号は動きません。',
    ),
  },
  {
    slug: 'segmented-control',
    name: 'Segmented Control',
    category: 'input',
    summary: t(
      'One choice from a short list. The thumb slides on a click and jumps on a key press.',
      '짧은 목록에서 하나를 고릅니다. 클릭하면 선택 표시가 부드럽게 이동하고, 키보드로는 바로 이동합니다.',
      '短い一覧から一つを選びます。クリックでは選択表示が滑り、キー操作ではすぐに移動します。',
    ),
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'feedback',
    summary: t(
      'Notifications that stack, fan out on hover, pause while read, and update in place.',
      '알림이 쌓이고, 마우스를 올리면 펼쳐집니다. 읽는 동안 타이머가 멈추고, 같은 자리에서 내용이 바뀝니다.',
      '通知が重なり、ホバーで広がります。読んでいる間はタイマーが止まり、その場で内容が変わります。',
    ),
  },
  {
    slug: 'status-badge',
    name: 'Status Badge',
    category: 'status',
    summary: t(
      'Shows a state in one word and one color: Queued, Running, Done, Needs review, or Failed.',
      '상태를 한 단어와 한 가지 색으로 보여줍니다. 대기, 실행 중, 완료, 검토 필요, 실패에 씁니다.',
      '状態を一語と一色で示します。待機、実行中、完了、要確認、失敗に使います。',
    ),
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    category: 'status',
    summary: t(
      'Task progress in five tones, a state with no known end, and a stacked bar of parts.',
      '작업 진행률을 다섯 가지 색으로 보여줍니다. 끝을 알 수 없는 작업과 항목별 비율도 표시합니다.',
      '作業の進み具合を5色で示します。終わりが分からない処理や項目ごとの割合も表示します。',
    ),
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'feedback',
    summary: t(
      'A hint on hover and keyboard focus. Once one is open, the next opens instantly.',
      '마우스를 올리거나 키보드로 이동하면 힌트를 보여줍니다. 하나가 열린 뒤에는 다음 힌트가 바로 열립니다.',
      'ホバーやキーボードでの移動時にヒントを表示します。一度開くと、次のヒントはすぐに開きます。',
    ),
  },
  {
    slug: 'empty-state',
    name: 'Empty State',
    category: 'status',
    summary: t(
      'Explains why a list is empty and offers the next step: first visit, no results, or a failed load.',
      '목록이 빈 이유와 다음 행동을 보여줍니다. 처음 사용, 검색 결과 없음, 불러오기 실패에 씁니다.',
      '一覧が空の理由と次の操作を示します。初回、検索結果なし、読み込み失敗に使います。',
    ),
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'input',
    summary: t(
      'An on/off setting that applies at once. The thumb stretches while pressed.',
      '바로 적용되는 켜기/끄기 설정입니다. 누르는 동안 손잡이가 늘어납니다.',
      'すぐに反映されるオン/オフの設定です。押している間、つまみが伸びます。',
    ),
  },
  {
    slug: 'text-field',
    name: 'Text Field',
    category: 'input',
    summary: t(
      'Text input and a text area that grows with its content. Label, hint, and error are wired up.',
      '한 줄 입력창과 내용만큼 늘어나는 여러 줄 입력창입니다. 라벨, 도움말, 오류가 입력창에 연결됩니다.',
      '1行の入力欄と、内容に合わせて広がる複数行の入力欄です。ラベル、ヒント、エラーが入力欄に関連付けられます。',
    ),
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'input',
    summary: t(
      'A choice saved with a form, with a mixed state for "select all". The mark draws itself.',
      '폼과 함께 저장하는 선택입니다. 전체 선택에 쓰는 일부 선택 상태가 있고, 체크 표시가 그려집니다.',
      'フォームと一緒に保存する選択です。全選択に使う一部選択の状態があり、チェックが描かれます。',
    ),
  },
  {
    slug: 'radio-group',
    name: 'Radio Group',
    category: 'input',
    summary: t(
      'One choice from a few, all visible at once, as a list or as cards with descriptions.',
      '몇 가지 중 하나를 고릅니다. 모든 선택지가 보이고, 목록이나 설명이 붙은 카드로 표시합니다.',
      'いくつかの中から一つを選びます。すべての選択肢が見え、リストまたは説明付きのカードで表示します。',
    ),
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'input',
    summary: t(
      'One value from a long list. Type a letter to jump. The list flips when there is no room.',
      '긴 목록에서 하나를 고릅니다. 글자를 입력하면 해당 항목으로 이동하고, 자리가 없으면 위로 열립니다.',
      '長い一覧から一つを選びます。文字を入力すると該当の項目へ移動し、余裕がないときは上に開きます。',
    ),
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'input',
    summary: t(
      'A value on a range, with marks and a readout in your own format.',
      '범위 안의 값을 고릅니다. 눈금을 표시하고, 현재 값을 원하는 형식으로 보여줍니다.',
      '範囲内の値を選びます。目盛りを表示し、現在の値を好きな形式で表示します。',
    ),
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    summary: t(
      'Related content in one place. The indicator moves smoothly on a click and jumps on a key press.',
      '관련 내용을 같은 자리에서 전환합니다. 클릭하면 표시가 부드럽게 이동하고, 키보드로는 바로 이동합니다.',
      '関連する内容を同じ場所で切り替えます。クリックでは表示がなめらかに動き、キー操作ではすぐに移動します。',
    ),
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'navigation',
    summary: t(
      'Sections that fold smoothly, with one or several open at a time.',
      '접고 펼치는 구역입니다. 높이가 부드럽게 변하고, 하나만 또는 여러 개를 열 수 있습니다.',
      '折りたたみできる区画です。高さがなめらかに変わり、一つだけ、または複数を開けます。',
    ),
  },
  {
    slug: 'menu',
    name: 'Menu',
    category: 'navigation',
    summary: t(
      'A list of actions on a button, with shortcut hints and a group for destructive actions.',
      '버튼에 붙는 작업 목록입니다. 단축키를 표시하고, 위험한 작업을 따로 묶습니다.',
      'ボタンに付く操作の一覧です。ショートカットを表示し、危険な操作を分けてまとめます。',
    ),
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'feedback',
    summary: t(
      'A modal window for a short task or a confirmation. Focus stays inside and returns when it closes.',
      '짧은 작업이나 확인을 받는 창입니다. 포커스가 창 안에 머물고, 닫으면 원래 자리로 돌아옵니다.',
      '短い作業や確認のためのウィンドウです。フォーカスは内側に留まり、閉じると元の位置に戻ります。',
    ),
  },
  {
    slug: 'button',
    name: 'Button',
    category: 'foundations',
    summary: t(
      'Primary, secondary, and text buttons. While busy, a button shows a spinner and ignores clicks.',
      '주 버튼, 보조 버튼, 텍스트 버튼입니다. 처리 중에는 스피너를 보여주고 클릭을 받지 않습니다.',
      'プライマリ、セカンダリ、テキストボタンです。処理中はスピナーを表示し、クリックを受け付けません。',
    ),
  },
  {
    slug: 'search-field',
    name: 'Search Field',
    category: 'input',
    summary: t(
      'A search input with a clear button. Escape clears the value.',
      '지우기 버튼이 있는 검색 입력창입니다. Esc 키를 누르면 값을 지웁니다.',
      'クリアボタン付きの検索入力欄です。Escキーで値を消します。',
    ),
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'status',
    summary: t(
      'Placeholder blocks while content loads. The group announces one loading message.',
      '내용을 불러오는 동안 보여주는 자리 표시 블록입니다. 그룹은 로딩 안내를 한 번만 읽어줍니다.',
      '読み込み中に表示するプレースホルダーです。グループは読み込み中の案内を一度だけ読み上げます。',
    ),
  },
  {
    slug: 'surface',
    name: 'Surface',
    category: 'foundations',
    summary: t(
      'The tinted Shell and white Panel that frame the other components.',
      '다른 컴포넌트를 담는 두 층입니다. 색이 있는 Shell과 흰 Panel로 나뉩니다.',
      'ほかのコンポーネントを収める2層です。色のあるShellと白いPanelに分かれます。',
    ),
  },
];

export const kitStart = {
  slug: KIT_START_SLUG,
  name: t('Getting started', '시작하기', 'はじめに'),
  summary: t(
    'Install a component with one command, load the fonts, and read the theme tokens.',
    '명령 하나로 컴포넌트를 설치하고, 글꼴을 불러오고, 테마 토큰을 확인합니다.',
    'コマンド一つでコンポーネントをインストールし、フォントを読み込み、テーマトークンを確認します。',
  ),
};

/** Reading order for the sidebar and for previous/next: category by category. */
export const kitReadingOrder: KitEntry[] = kitCategories.flatMap(({ id }) => kitCatalog.filter((entry) => entry.category === id));
