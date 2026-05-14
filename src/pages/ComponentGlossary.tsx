import { useState } from 'react';
import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';
import { translate } from '../data/i18n';
import { GlossaryTabs } from '../components/GlossaryTabs';

type TermCategory = 'states' | 'controls' | 'navigation' | 'feedback' | 'layout';
type DemoKind =
  | 'hover'
  | 'focus'
  | 'active'
  | 'disabled'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  | 'slider'
  | 'tabs'
  | 'breadcrumb'
  | 'pagination'
  | 'modal'
  | 'tooltip'
  | 'toast'
  | 'skeleton'
  | 'card'
  | 'badge'
  | 'accordion'
  | 'empty';

interface GlossaryTerm {
  term: LocalizedText;
  category: TermCategory;
  plain: LocalizedText;
  where: LocalizedText;
  avoid: LocalizedText;
  example: string;
  demo: DemoKind;
}

interface GlossaryCategory {
  id: TermCategory;
  title: LocalizedText;
  desc: LocalizedText;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const categories: GlossaryCategory[] = [
  {
    id: 'states',
    title: t('Interaction states', '인터랙션 상태', 'インタラクション状態'),
    desc: t(
      'Words for how a component reacts before, during, and after a user action.',
      '사용자가 누르기 전, 누르는 중, 누른 뒤에 컴포넌트가 어떻게 반응하는지를 설명하는 말입니다.',
      'ユーザー操作の前後でコンポーネントがどう反応するかを表す言葉です。',
    ),
  },
  {
    id: 'controls',
    title: t('Controls', '입력/선택 컨트롤', '入力/選択コントロール'),
    desc: t(
      'Buttons, fields, menus, and switches that let people choose or submit something.',
      '버튼, 입력창, 메뉴, 스위치처럼 사용자가 선택하거나 제출할 때 쓰는 요소입니다.',
      'ボタン、入力欄、メニュー、スイッチなど、選択や送信に使う要素です。',
    ),
  },
  {
    id: 'navigation',
    title: t('Navigation', '이동과 구조', '移動と構造'),
    desc: t(
      'Patterns that help people know where they are and move to another view.',
      '사용자가 현재 위치를 이해하고 다른 화면으로 이동하게 돕는 패턴입니다.',
      '現在地の把握と別画面への移動を助けるパターンです。',
    ),
  },
  {
    id: 'feedback',
    title: t('Feedback & overlays', '피드백과 오버레이', 'フィードバックとオーバーレイ'),
    desc: t(
      'Temporary messages or layers that explain what just happened or ask for attention.',
      '방금 일어난 일을 알려주거나, 사용자의 주의를 잠시 요청하는 임시 메시지/레이어입니다.',
      '直前の結果を伝えたり注意を促したりする一時的な表示です。',
    ),
  },
  {
    id: 'layout',
    title: t('Content patterns', '콘텐츠 패턴', 'コンテンツパターン'),
    desc: t(
      'Reusable blocks for grouping information, scanning lists, and showing waiting states.',
      '정보를 묶고, 목록을 훑고, 대기 상태를 보여주기 위해 반복해서 쓰는 블록입니다.',
      '情報をまとめ、一覧を読みやすくし、待機状態を示すための再利用パターンです。',
    ),
  },
];

const terms: GlossaryTerm[] = [
  {
    term: t('Hover', '호버', 'ホバー'),
    category: 'states',
    plain: t(
      'The visual change that appears when the cursor rests on an element.',
      '마우스 커서를 요소 위에 올렸을 때 나타나는 시각적 변화입니다.',
      'カーソルを要素に重ねた時に出る見た目の変化です。',
    ),
    where: t(
      'Desktop links, buttons, cards, menu rows, and chart points.',
      '데스크톱의 링크, 버튼, 카드, 메뉴 행, 차트 포인트에서 자주 씁니다.',
      'デスクトップのリンク、ボタン、カード、メニュー行、チャート点でよく使います。',
    ),
    avoid: t(
      'Do not rely on hover alone because touch screens cannot hover.',
      '터치 화면에는 호버가 없으므로 핵심 정보를 호버에만 숨기면 안 됩니다.',
      'タッチ画面にはホバーがないため、重要情報をホバーだけに隠さないでください。',
    ),
    example: 'button:hover { background: #111; color: white; }',
    demo: 'hover',
  },
  {
    term: t('Focus', '포커스', 'フォーカス'),
    category: 'states',
    plain: t(
      'The active target for keyboard input, usually shown with an outline or ring.',
      '키보드 입력이 현재 향하는 대상이며 보통 테두리나 링으로 표시됩니다.',
      'キーボード入力の対象で、通常アウトラインやリングで表示されます。',
    ),
    where: t(
      'Forms, search, menus, modal dialogs, and every keyboard-accessible control.',
      '폼, 검색창, 메뉴, 모달, 키보드로 접근 가능한 모든 컨트롤에 필요합니다.',
      'フォーム、検索、メニュー、モーダル、キーボード操作可能な全コントロールに必要です。',
    ),
    avoid: t(
      'Removing the focus ring makes the interface hard to use without a mouse.',
      '포커스 표시를 지우면 마우스 없이 쓰기 어려운 화면이 됩니다.',
      'フォーカス表示を消すと、マウスなしで使いづらくなります。',
    ),
    example: 'input:focus-visible { outline: 3px solid #2563eb; }',
    demo: 'focus',
  },
  {
    term: t('Active / pressed', '액티브 / 눌림', 'アクティブ / 押下'),
    category: 'states',
    plain: t(
      'The state while a control is being pressed or currently selected.',
      '컨트롤을 누르는 순간이거나 현재 선택된 상태를 뜻합니다.',
      '押している瞬間、または現在選択中の状態です。',
    ),
    where: t(
      'Segmented controls, nav tabs, filter chips, and pressed buttons.',
      '세그먼트 컨트롤, 네비게이션 탭, 필터 칩, 눌린 버튼에 씁니다.',
      'セグメント、ナビタブ、フィルタチップ、押下中ボタンで使います。',
    ),
    avoid: t(
      'Do not make active look identical to hover; selected state must remain visible.',
      '액티브와 호버를 똑같이 만들면 무엇이 선택됐는지 남지 않습니다.',
      'アクティブとホバーを同じ見た目にすると、選択状態が残りません。',
    ),
    example: '.tab.is-active { border-color: currentColor; }',
    demo: 'active',
  },
  {
    term: t('Disabled', '비활성', '無効'),
    category: 'states',
    plain: t(
      'A control that exists on the screen but cannot be used right now.',
      '화면에는 있지만 지금은 사용할 수 없는 컨트롤 상태입니다.',
      '画面にはあるが現在は使えないコントロールの状態です。',
    ),
    where: t(
      'Submit buttons before required fields are filled, unavailable plans, and pending actions.',
      '필수 입력 전 제출 버튼, 선택 불가 요금제, 처리 중인 액션에서 씁니다.',
      '必須入力前の送信ボタン、利用不可プラン、処理中アクションで使います。',
    ),
    avoid: t(
      'If the reason is not obvious, place a short hint near the disabled control.',
      '왜 비활성인지 명확하지 않다면 가까이에 짧은 이유를 붙여야 합니다.',
      '理由が明確でない場合は、近くに短い説明を置きます。',
    ),
    example: '<button disabled>Save</button>',
    demo: 'disabled',
  },
  {
    term: t('Dropdown / select', '드롭다운 / 셀렉트', 'ドロップダウン / セレクト'),
    category: 'controls',
    plain: t(
      'A compact control that opens a list of choices.',
      '선택지를 접어 두었다가 클릭하면 목록을 펼치는 컨트롤입니다.',
      '選択肢を折りたたみ、クリックで一覧を開くコントロールです。',
    ),
    where: t(
      'Language, sorting, country, timeframe, plan, and category selection.',
      '언어, 정렬, 국가, 시간대, 요금제, 카테고리 선택에 씁니다.',
      '言語、並び替え、国、時間軸、プラン、カテゴリ選択で使います。',
    ),
    avoid: t(
      'For only two choices, use a toggle or segmented control instead.',
      '선택지가 두 개뿐이면 토글이나 세그먼트 컨트롤이 더 빠릅니다.',
      '選択肢が2つだけなら、トグルやセグメントの方が速いです。',
    ),
    example: '<select><option>Newest</option></select>',
    demo: 'dropdown',
  },
  {
    term: t('Checkbox', '체크박스', 'チェックボックス'),
    category: 'controls',
    plain: t(
      'A yes/no box, often allowing multiple selections in the same group.',
      '예/아니오를 표시하는 상자이며 같은 그룹에서 여러 개를 고를 수 있습니다.',
      'はい/いいえを示す箱で、同じグループ内で複数選択できます。',
    ),
    where: t(
      'Agreements, filters, optional features, and bulk item selection.',
      '동의 항목, 필터, 선택 기능, 여러 항목 선택에 씁니다.',
      '同意、フィルタ、任意機能、複数項目選択で使います。',
    ),
    avoid: t(
      'Do not use checkboxes when exactly one option must be selected.',
      '반드시 하나만 골라야 할 때는 체크박스가 아니라 라디오를 씁니다.',
      '必ず1つだけ選ぶ場合はチェックボックスではなくラジオを使います。',
    ),
    example: '<input type="checkbox" checked />',
    demo: 'checkbox',
  },
  {
    term: t('Radio button', '라디오 버튼', 'ラジオボタン'),
    category: 'controls',
    plain: t(
      'A set of choices where only one option can be selected.',
      '여러 선택지 중 하나만 고를 수 있는 원형 선택 컨트롤입니다.',
      '複数の選択肢から1つだけ選ぶ丸いコントロールです。',
    ),
    where: t(
      'Billing periods, delivery methods, visibility modes, and survey answers.',
      '결제 주기, 배송 방식, 공개 범위, 설문 답변에 씁니다.',
      '請求周期、配送方法、公開範囲、アンケート回答で使います。',
    ),
    avoid: t(
      'Do not hide every option inside a dropdown when comparison matters.',
      '서로 비교해야 하는 선택지는 드롭다운 안에 숨기지 않는 편이 좋습니다.',
      '比較が重要な選択肢はドロップダウンに隠さない方が良いです。',
    ),
    example: '<input type="radio" name="billing" />',
    demo: 'radio',
  },
  {
    term: t('Toggle / switch', '토글 / 스위치', 'トグル / スイッチ'),
    category: 'controls',
    plain: t(
      'An immediate on/off control, like a physical switch.',
      '물리 스위치처럼 즉시 켜고 끄는 컨트롤입니다.',
      '物理スイッチのように即時オン/オフするコントロールです。',
    ),
    where: t(
      'Dark mode, notifications, reduced motion, and feature enablement.',
      '다크 모드, 알림, 움직임 줄이기, 기능 활성화에 씁니다.',
      'ダークモード、通知、動きを減らす、機能有効化で使います。',
    ),
    avoid: t(
      'If the action needs review before saving, use a checkbox plus a save button.',
      '저장 전에 검토가 필요하면 토글보다 체크박스와 저장 버튼이 낫습니다.',
      '保存前に確認が必要なら、トグルよりチェックボックスと保存ボタンが適切です。',
    ),
    example: '<button role="switch" aria-checked="true">On</button>',
    demo: 'toggle',
  },
  {
    term: t('Slider', '슬라이더', 'スライダー'),
    category: 'controls',
    plain: t(
      'A control for choosing a number along a continuous range.',
      '연속된 범위 안에서 숫자 값을 고르는 컨트롤입니다.',
      '連続した範囲から数値を選ぶコントロールです。',
    ),
    where: t(
      'Volume, brightness, intensity, price range, and animation duration.',
      '볼륨, 밝기, 강도, 가격 범위, 애니메이션 지속 시간에 씁니다.',
      '音量、明るさ、強度、価格範囲、アニメーション時間で使います。',
    ),
    avoid: t(
      'When exact values matter, pair it with a numeric input.',
      '정확한 숫자가 중요하면 숫자 입력창을 같이 둡니다.',
      '正確な値が重要なら、数値入力と組み合わせます。',
    ),
    example: '<input type="range" min="0" max="100" />',
    demo: 'slider',
  },
  {
    term: t('Tabs', '탭', 'タブ'),
    category: 'navigation',
    plain: t(
      'A set of labels that switches between related panels in the same place.',
      '같은 자리에서 관련 패널을 바꿔 보여주는 라벨 묶음입니다.',
      '同じ場所で関連パネルを切り替えるラベル群です。',
    ),
    where: t(
      'Settings sections, dashboard views, account areas, and documentation examples.',
      '설정 섹션, 대시보드 보기, 계정 영역, 문서 예시에 씁니다.',
      '設定セクション、ダッシュボード表示、アカウント領域、ドキュメント例で使います。',
    ),
    avoid: t(
      'Do not use tabs for unrelated pages that deserve separate navigation.',
      '서로 관련 없는 페이지를 탭에 억지로 넣으면 구조가 흐려집니다.',
      '関連の薄いページをタブに入れると構造が分かりづらくなります。',
    ),
    example: '<button role="tab" aria-selected="true">Overview</button>',
    demo: 'tabs',
  },
  {
    term: t('Breadcrumb', '브레드크럼', 'パンくずリスト'),
    category: 'navigation',
    plain: t(
      'A small path showing where the current page sits in the site hierarchy.',
      '현재 페이지가 사이트 구조상 어디에 있는지 보여주는 작은 경로입니다.',
      '現在ページがサイト階層のどこにあるかを示す小さな経路です。',
    ),
    where: t(
      'Deep product pages, docs, admin consoles, and nested settings.',
      '깊은 상품 페이지, 문서, 관리자 콘솔, 중첩 설정 화면에 씁니다.',
      '深い商品ページ、ドキュメント、管理画面、階層設定で使います。',
    ),
    avoid: t(
      'Do not replace the main navigation with breadcrumbs.',
      '브레드크럼은 보조 경로이지 메인 네비게이션 대체물이 아닙니다.',
      'パンくずは補助経路であり、メインナビの代替ではありません。',
    ),
    example: 'Home / Docs / Components / Button',
    demo: 'breadcrumb',
  },
  {
    term: t('Pagination', '페이지네이션', 'ページネーション'),
    category: 'navigation',
    plain: t(
      'Controls for moving through many results page by page.',
      '많은 결과를 페이지 단위로 넘기는 이동 컨트롤입니다.',
      '多数の結果をページ単位で移動するコントロールです。',
    ),
    where: t(
      'Search results, tables, article archives, and order history.',
      '검색 결과, 표, 글 목록, 주문 내역에 씁니다.',
      '検索結果、テーブル、記事アーカイブ、注文履歴で使います。',
    ),
    avoid: t(
      'Infinite scroll is not always better when users need stable positions or URLs.',
      '사용자가 위치나 URL을 기억해야 한다면 무한 스크롤이 항상 낫지는 않습니다.',
      '位置やURLを保つ必要がある場合、無限スクロールが常に良いとは限りません。',
    ),
    example: '<nav aria-label="Pagination">1 2 3 Next</nav>',
    demo: 'pagination',
  },
  {
    term: t('Modal dialog', '모달', 'モーダル'),
    category: 'feedback',
    plain: t(
      'A layer that appears above the page and temporarily blocks the underlying screen.',
      '페이지 위에 떠서 아래 화면을 잠시 막는 레이어입니다.',
      'ページ上に重なり、背後の画面を一時的に止めるレイヤーです。',
    ),
    where: t(
      'Confirmations, short forms, destructive actions, and focused editing.',
      '확인, 짧은 폼, 삭제 같은 위험 액션, 집중 편집에 씁니다.',
      '確認、短いフォーム、削除などの危険操作、集中編集で使います。',
    ),
    avoid: t(
      'Do not put long workflows in a modal when a full page would be clearer.',
      '긴 절차를 모달 안에 넣으면 답답하므로 전체 페이지가 더 명확할 수 있습니다.',
      '長い手順をモーダルに入れるより、専用ページの方が明確な場合があります。',
    ),
    example: '<div role="dialog" aria-modal="true">Confirm delete?</div>',
    demo: 'modal',
  },
  {
    term: t('Tooltip', '툴팁', 'ツールチップ'),
    category: 'feedback',
    plain: t(
      'A tiny helper label that appears near an icon or compact control.',
      '아이콘이나 작은 컨트롤 옆에 잠깐 뜨는 짧은 도움말입니다.',
      'アイコンや小さな操作部の近くに出る短い補足です。',
    ),
    where: t(
      'Icon buttons, abbreviations, chart points, and dense toolbars.',
      '아이콘 버튼, 약어, 차트 포인트, 밀도 높은 툴바에 씁니다.',
      'アイコンボタン、略語、チャート点、密度の高いツールバーで使います。',
    ),
    avoid: t(
      'Important instructions should be visible, not hidden inside a tooltip.',
      '중요한 안내는 툴팁 속에 숨기지 말고 화면에 보여야 합니다.',
      '重要な案内はツールチップに隠さず、画面上に表示します。',
    ),
    example: '<button aria-label="Export">↧</button>',
    demo: 'tooltip',
  },
  {
    term: t('Toast / snackbar', '토스트 / 스낵바', 'トースト / スナックバー'),
    category: 'feedback',
    plain: t(
      'A short message that appears after an action, then disappears.',
      '사용자가 액션을 한 뒤 잠깐 나타났다가 사라지는 짧은 메시지입니다.',
      '操作後に一時表示され、消える短いメッセージです。',
    ),
    where: t(
      'Saved, copied, uploaded, failed, or queued status messages.',
      '저장됨, 복사됨, 업로드됨, 실패함, 대기열 추가 같은 상태 안내에 씁니다.',
      '保存、コピー、アップロード、失敗、キュー追加などの状態通知で使います。',
    ),
    avoid: t(
      'Do not use only a disappearing toast for critical errors.',
      '중대한 오류를 사라지는 토스트 하나로만 알리면 놓치기 쉽습니다.',
      '重大エラーを消えるトーストだけで伝えると見逃されます。',
    ),
    example: 'Saved. Undo',
    demo: 'toast',
  },
  {
    term: t('Skeleton loading', '스켈레톤 로딩', 'スケルトンローディング'),
    category: 'feedback',
    plain: t(
      'A temporary gray layout that shows the shape of content while data is loading.',
      '데이터가 오는 동안 콘텐츠의 형태를 회색 블록으로 먼저 보여주는 로딩 상태입니다.',
      'データ読込中にコンテンツ形状を灰色ブロックで先に示す状態です。',
    ),
    where: t(
      'Feeds, tables, cards, dashboards, and detail pages with network data.',
      '피드, 표, 카드, 대시보드, 네트워크 데이터를 기다리는 상세 페이지에 씁니다.',
      'フィード、表、カード、ダッシュボード、通信待ちの詳細ページで使います。',
    ),
    avoid: t(
      'If loading is almost instant, a skeleton may add unnecessary visual noise.',
      '로딩이 거의 즉시 끝난다면 스켈레톤이 오히려 시각적 소음을 만들 수 있습니다.',
      '読込がほぼ即時なら、スケルトンは余計な視覚ノイズになる場合があります。',
    ),
    example: '.skeleton { background: #e5e7eb; }',
    demo: 'skeleton',
  },
  {
    term: t('Card', '카드', 'カード'),
    category: 'layout',
    plain: t(
      'A contained block that groups one item, topic, product, or summary.',
      '하나의 항목, 주제, 상품, 요약 정보를 묶는 독립 블록입니다.',
      '1つの項目、話題、商品、要約をまとめる独立ブロックです。',
    ),
    where: t(
      'Style tiles, product summaries, pricing options, articles, and dashboard widgets.',
      '스타일 타일, 상품 요약, 요금제, 글 목록, 대시보드 위젯에 씁니다.',
      'スタイルタイル、商品要約、料金、記事、ダッシュボードウィジェットで使います。',
    ),
    avoid: t(
      'Do not place every page section inside a card; reserve cards for repeated items.',
      '페이지 섹션 전체를 전부 카드로 감싸기보다 반복 항목에 주로 써야 합니다.',
      'ページ区画を全部カードにせず、反復項目に主に使います。',
    ),
    example: '<article className="card">...</article>',
    demo: 'card',
  },
  {
    term: t('Badge / chip', '배지 / 칩', 'バッジ / チップ'),
    category: 'layout',
    plain: t(
      'A small label that marks status, category, count, or a selected filter.',
      '상태, 카테고리, 개수, 선택된 필터를 작게 표시하는 라벨입니다.',
      '状態、カテゴリ、件数、選択済みフィルタを小さく示すラベルです。',
    ),
    where: t(
      'New, beta, sale, active filters, tags, and unread counts.',
      'New, beta, sale, 활성 필터, 태그, 읽지 않은 개수에 씁니다.',
      'New、beta、sale、有効フィルタ、タグ、未読数で使います。',
    ),
    avoid: t(
      'Too many badges reduce scanability; keep them short and meaningful.',
      '배지가 너무 많으면 훑어보기 어려우므로 짧고 의미 있게 둡니다.',
      'バッジが多すぎると読みにくいため、短く意味あるものに絞ります。',
    ),
    example: '<span className="badge">Beta</span>',
    demo: 'badge',
  },
  {
    term: t('Accordion', '아코디언', 'アコーディオン'),
    category: 'layout',
    plain: t(
      'A stack of expandable rows that show one chunk of hidden content at a time.',
      '접힌 행을 펼쳐 숨겨진 내용을 보여주는 세로형 패턴입니다.',
      '折りたたみ行を開いて隠れた内容を見せる縦型パターンです。',
    ),
    where: t(
      'FAQs, settings groups, mobile filters, and dense documentation.',
      'FAQ, 설정 그룹, 모바일 필터, 밀도 높은 문서에 씁니다.',
      'FAQ、設定グループ、モバイルフィルタ、密度の高い文書で使います。',
    ),
    avoid: t(
      'Do not hide content people must compare side by side.',
      '서로 비교해야 하는 내용은 아코디언에 숨기지 않는 편이 좋습니다.',
      '並べて比較すべき内容はアコーディオンに隠さない方が良いです。',
    ),
    example: '<details><summary>Question</summary>Answer</details>',
    demo: 'accordion',
  },
  {
    term: t('Empty state', '빈 상태', '空状態'),
    category: 'layout',
    plain: t(
      'The screen shown when there is no data, no result, or nothing selected yet.',
      '데이터가 없거나 검색 결과가 없거나 아직 아무것도 선택하지 않았을 때의 화면입니다.',
      'データなし、検索結果なし、未選択時に表示する画面です。',
    ),
    where: t(
      'Dashboards before setup, empty tables, failed searches, and first-time product use.',
      '초기 대시보드, 빈 표, 검색 실패, 첫 사용 화면에 씁니다.',
      '初期ダッシュボード、空テーブル、検索失敗、初回利用画面で使います。',
    ),
    avoid: t(
      'A good empty state explains the next useful action, not just "nothing here".',
      '좋은 빈 상태는 “없음”만 말하지 않고 다음 행동을 알려줍니다.',
      '良い空状態は「何もない」だけでなく次の行動を示します。',
    ),
    example: 'No results. Try removing one filter.',
    demo: 'empty',
  },
];

const quickExamples = [
  {
    label: t('Hover', '호버', 'ホバー'),
    note: t('Cursor feedback', '커서 반응', 'カーソル反応'),
    className: 'component-glossary-demo__hover',
  },
  {
    label: t('Focus', '포커스', 'フォーカス'),
    note: t('Keyboard target', '키보드 대상', 'キーボード対象'),
    className: 'component-glossary-demo__focus',
  },
  {
    label: t('Disabled', '비활성', '無効'),
    note: t('Unavailable now', '현재 사용 불가', '現在利用不可'),
    className: 'component-glossary-demo__disabled',
  },
];

function ComponentPreview({ kind, lang }: { kind: DemoKind; lang: Lang }) {
  const [switchOn, setSwitchOn] = useState(true);
  const [tab, setTab] = useState<'overview' | 'usage'>('overview');
  const [modalOpen, setModalOpen] = useState(true);
  const [toastVisible, setToastVisible] = useState(true);
  const label = (en: string, ko: string, ja: string) => localize(t(en, ko, ja), lang);

  if (kind === 'hover') {
    return (
      <div className="glossary-preview glossary-preview--hover-demo">
        <button type="button">{label('Hover me', '마우스를 올려보세요', 'ホバーしてください')}</button>
        <span>{label('Color and height change on cursor hover.', '커서를 올리면 색과 높이가 변합니다.', 'カーソルで色と高さが変わります。')}</span>
      </div>
    );
  }

  if (kind === 'focus') {
    return (
      <div className="glossary-preview glossary-preview--focus-demo">
        <button type="button">{label('Focused button', '포커스된 버튼', 'フォーカス中ボタン')}</button>
        <span>{label('The blue ring shows the keyboard target.', '파란 링이 키보드 대상입니다.', '青いリングがキーボード対象です。')}</span>
      </div>
    );
  }

  if (kind === 'active') {
    return (
      <div className="glossary-preview">
        <div className="demo-segmented" role="tablist" aria-label={label('View mode', '보기 모드', '表示モード')}>
          <button className="is-active" type="button">
            {label('Selected', '선택됨', '選択中')}
          </button>
          <button type="button">{label('Idle', '대기', '待機')}</button>
        </div>
        <div className="demo-pressed-button">{label('Pressed visual state', '눌린 듯한 상태', '押された見た目')}</div>
      </div>
    );
  }

  if (kind === 'disabled') {
    return (
      <div className="glossary-preview">
        <button className="demo-disabled-button" type="button" disabled>
          {label('Save changes', '변경 저장', '変更を保存')}
        </button>
        <small>{label('Disabled until required fields are complete.', '필수 입력 전에는 사용할 수 없습니다.', '必須入力完了まで使えません。')}</small>
      </div>
    );
  }

  if (kind === 'dropdown') {
    return (
      <div className="glossary-preview">
        <label className="demo-field">
          <span>{label('Sort', '정렬', '並び替え')}</span>
          <select defaultValue="popular">
            <option value="new">{label('Newest', '최신순', '新しい順')}</option>
            <option value="popular">{label('Most popular', '인기순', '人気順')}</option>
            <option value="updated">{label('Recently updated', '업데이트순', '更新順')}</option>
          </select>
        </label>
      </div>
    );
  }

  if (kind === 'checkbox') {
    return (
      <div className="glossary-preview">
        <label className="demo-check-row">
          <input type="checkbox" defaultChecked />
          <span>{label('Email notifications', '이메일 알림', 'メール通知')}</span>
        </label>
        <label className="demo-check-row">
          <input type="checkbox" />
          <span>{label('Marketing updates', '마케팅 소식', 'マーケティング更新')}</span>
        </label>
      </div>
    );
  }

  if (kind === 'radio') {
    return (
      <div className="glossary-preview">
        <label className="demo-check-row">
          <input type="radio" name="glossary-plan-demo" defaultChecked />
          <span>{label('Monthly', '월간', '月額')}</span>
        </label>
        <label className="demo-check-row">
          <input type="radio" name="glossary-plan-demo" />
          <span>{label('Yearly', '연간', '年額')}</span>
        </label>
      </div>
    );
  }

  if (kind === 'toggle') {
    return (
      <div className="glossary-preview">
        <button
          className={`demo-switch ${switchOn ? 'is-on' : ''}`}
          type="button"
          role="switch"
          aria-checked={switchOn}
          onClick={() => setSwitchOn((value) => !value)}
        >
          <span />
        </button>
        <strong>{switchOn ? label('Notifications on', '알림 켜짐', '通知オン') : label('Notifications off', '알림 꺼짐', '通知オフ')}</strong>
      </div>
    );
  }

  if (kind === 'slider') {
    return (
      <div className="glossary-preview">
        <label className="demo-field">
          <span>{label('Intensity', '강도', '強度')}</span>
          <input type="range" min="0" max="100" defaultValue="68" />
        </label>
        <div className="demo-slider-scale">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    );
  }

  if (kind === 'tabs') {
    return (
      <div className="glossary-preview">
        <div className="demo-tabs" role="tablist" aria-label={label('Glossary tab demo', '용어집 탭 예시', '用語集タブ例')}>
          <button className={tab === 'overview' ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === 'overview'} onClick={() => setTab('overview')}>
            {label('Overview', '개요', '概要')}
          </button>
          <button className={tab === 'usage' ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === 'usage'} onClick={() => setTab('usage')}>
            {label('Usage', '사용처', '用途')}
          </button>
        </div>
        <div className="demo-tab-panel">
          {tab === 'overview'
            ? label('Tabs switch related content in place.', '탭은 관련 내용을 같은 자리에서 바꿉니다.', 'タブは関連内容を同じ場所で切り替えます。')
            : label('Use them for sibling sections.', '같은 단계의 섹션에 사용합니다.', '同階層のセクションに使います。')}
        </div>
      </div>
    );
  }

  if (kind === 'breadcrumb') {
    return (
      <nav className="glossary-preview demo-breadcrumb" aria-label={label('Breadcrumb', '브레드크럼', 'パンくず')}>
        <a href="#top">{label('Home', '홈', 'ホーム')}</a>
        <span>/</span>
        <a href="#navigation">{label('Docs', '문서', 'ドキュメント')}</a>
        <span>/</span>
        <strong>{label('Button', '버튼', 'ボタン')}</strong>
      </nav>
    );
  }

  if (kind === 'pagination') {
    return (
      <nav className="glossary-preview demo-pagination" aria-label={label('Pagination', '페이지네이션', 'ページネーション')}>
        <button type="button">{label('Prev', '이전', '前へ')}</button>
        <button type="button">1</button>
        <button className="is-active" type="button">
          2
        </button>
        <button type="button">3</button>
        <button type="button">{label('Next', '다음', '次へ')}</button>
      </nav>
    );
  }

  if (kind === 'modal') {
    return (
      <div className="glossary-preview demo-modal-preview">
        <button type="button" onClick={() => setModalOpen(true)}>
          {label('Open modal', '모달 열기', 'モーダルを開く')}
        </button>
        {modalOpen ? (
          <div className="demo-modal-layer" role="dialog" aria-modal="true" aria-label={label('Delete confirmation', '삭제 확인', '削除確認')}>
            <div>
              <strong>{label('Delete item?', '항목을 삭제할까요?', '項目を削除しますか？')}</strong>
              <p>{label('The rest of the screen is visually blocked.', '아래 화면은 잠시 막힌 상태입니다.', '背後の画面は一時的に止まります。')}</p>
              <button type="button" onClick={() => setModalOpen(false)}>
                {label('Close', '닫기', '閉じる')}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (kind === 'tooltip') {
    return (
      <div className="glossary-preview demo-tooltip-preview">
        <button type="button" aria-label={label('Export', '내보내기', '書き出し')}>
          ?
        </button>
        <span role="tooltip">{label('Short helper text', '짧은 도움말', '短い補足')}</span>
      </div>
    );
  }

  if (kind === 'toast') {
    return (
      <div className="glossary-preview demo-toast-preview">
        <button type="button" onClick={() => setToastVisible((value) => !value)}>
          {label('Toggle toast', '토스트 보기', 'トースト表示')}
        </button>
        {toastVisible ? (
          <div className="demo-toast" role="status">
            <strong>{label('Saved', '저장 완료', '保存済み')}</strong>
            <button type="button">{label('Undo', '되돌리기', '元に戻す')}</button>
          </div>
        ) : null}
      </div>
    );
  }

  if (kind === 'skeleton') {
    return (
      <div className="glossary-preview demo-skeleton-preview" aria-label={label('Loading preview', '로딩 예시', '読込例')}>
        <span />
        <i />
        <i />
        <i />
      </div>
    );
  }

  if (kind === 'card') {
    return (
      <div className="glossary-preview">
        <article className="demo-card">
          <span>{label('Template', '템플릿', 'テンプレート')}</span>
          <strong>Runtime Signal</strong>
          <p>{label('One item grouped as a scan-friendly block.', '하나의 항목을 훑기 쉬운 블록으로 묶습니다.', '1つの項目を見やすいブロックにまとめます。')}</p>
        </article>
      </div>
    );
  }

  if (kind === 'badge') {
    return (
      <div className="glossary-preview demo-badge-preview">
        <span>Beta</span>
        <span>{label('Active', '활성', '有効')}</span>
        <span>12</span>
      </div>
    );
  }

  if (kind === 'accordion') {
    return (
      <div className="glossary-preview">
        <details className="demo-accordion" open>
          <summary>{label('What is included?', '무엇이 포함되나요?', '何が含まれますか？')}</summary>
          <p>{label('A hidden answer expands under the row.', '접힌 답변이 행 아래로 펼쳐집니다.', '隠れた回答が行の下に開きます。')}</p>
        </details>
      </div>
    );
  }

  return (
    <div className="glossary-preview demo-empty-preview">
      <strong>{label('No results', '결과 없음', '結果なし')}</strong>
      <p>{label('Try removing one filter.', '필터 하나를 줄여보세요.', 'フィルタを1つ外してください。')}</p>
      <button type="button">{label('Clear filters', '필터 초기화', 'フィルタを解除')}</button>
    </div>
  );
}

export function ComponentGlossary({ lang }: { lang: Lang }) {
  const [openTermId, setOpenTermId] = useState<string | null>(null);
  const detailLabel = localize(t('Details', '자세히', '詳細'), lang);
  const closeLabel = localize(t('Close details', '접기', '閉じる'), lang);

  function termId(term: GlossaryTerm) {
    return localize(term.term, 'en').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function toggleTerm(id: string) {
    setOpenTermId((current) => (current === id ? null : id));
  }

  return (
    <div className="component-glossary-page">
      <GlossaryTabs active="components" lang={lang} />
      <section className="page-hero page-hero--glossary">
        <div>
          <p className="hero__eyebrow">Component Language</p>
          <h1>{translate(lang, 'glossary.title')}</h1>
          <p>{translate(lang, 'glossary.desc')}</p>
        </div>
        <div className="component-glossary-demo" aria-label={translate(lang, 'glossary.demoLabel')}>
          <div className="component-glossary-demo__toolbar">
            <span>UI</span>
            <span>TERM</span>
            <span>MAP</span>
          </div>
          <div className="component-glossary-demo__stage">
            {quickExamples.map((item) => (
              <button className={item.className} key={localize(item.label, 'en')} type="button">
                <strong>{localize(item.label, lang)}</strong>
                <small>{localize(item.note, lang)}</small>
              </button>
            ))}
          </div>
          <details className="component-glossary-demo__dropdown" open>
            <summary>{translate(lang, 'glossary.dropdownDemo')}</summary>
            <div>
              <span>{translate(lang, 'glossary.dropdownOptionOne')}</span>
              <span>{translate(lang, 'glossary.dropdownOptionTwo')}</span>
              <span>{translate(lang, 'glossary.dropdownOptionThree')}</span>
            </div>
          </details>
        </div>
      </section>

      <nav className="toc toc--glossary" aria-label={translate(lang, 'glossary.contents')}>
        {categories.map((category) => (
          <a href={`#${category.id}`} key={category.id}>
            {localize(category.title, lang)}
          </a>
        ))}
      </nav>

      <section className="glossary-map" aria-label={translate(lang, 'glossary.mapLabel')}>
        <div>
          <span>{translate(lang, 'glossary.mapTerm')}</span>
          <strong>{translate(lang, 'glossary.mapTermValue')}</strong>
          <p>{translate(lang, 'glossary.mapTermDesc')}</p>
        </div>
        <div>
          <span>{translate(lang, 'glossary.mapUse')}</span>
          <strong>{translate(lang, 'glossary.mapUseValue')}</strong>
          <p>{translate(lang, 'glossary.mapUseDesc')}</p>
        </div>
        <div>
          <span>{translate(lang, 'glossary.mapCaution')}</span>
          <strong>{translate(lang, 'glossary.mapCautionValue')}</strong>
          <p>{translate(lang, 'glossary.mapCautionDesc')}</p>
        </div>
      </section>

      {categories.map((category) => {
        const categoryTerms = terms.filter((term) => term.category === category.id);
        return (
          <section className="section glossary-section" id={category.id} key={category.id}>
            <div className="section__head glossary-section__head">
              <div>
                <h2>{localize(category.title, lang)}</h2>
                <p>{localize(category.desc, lang)}</p>
              </div>
              <span>
                {categoryTerms.length} {translate(lang, 'glossary.items')}
              </span>
            </div>

            <div className="glossary-grid">
              {categoryTerms.map((term) => {
                const id = termId(term);
                const isOpen = openTermId === id;
                return (
                  <article className={`glossary-card ${isOpen ? 'is-open' : ''}`} key={id} onClick={() => toggleTerm(id)}>
                    <div className="glossary-card__head">
                      <span>{localize(category.title, lang)}</span>
                      <h3>{localize(term.term, lang)}</h3>
                    </div>
                    <div
                      className="glossary-card__preview"
                      onClick={(event) => {
                        if ((event.target as HTMLElement).closest('button, input, select, a, summary')) {
                          event.stopPropagation();
                        }
                      }}
                    >
                      <ComponentPreview kind={term.demo} lang={lang} />
                    </div>
                    <div className="glossary-card__summary">
                      <p>{localize(term.plain, lang)}</p>
                      <button
                        className="glossary-card__toggle"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`${id}-details`}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleTerm(id);
                        }}
                      >
                        {isOpen ? closeLabel : detailLabel}
                      </button>
                    </div>
                    <div className="glossary-card__details" id={`${id}-details`} hidden={!isOpen} onClick={(event) => event.stopPropagation()}>
                      <dl>
                        <div>
                          <dt>{translate(lang, 'glossary.where')}</dt>
                          <dd>{localize(term.where, lang)}</dd>
                        </div>
                        <div>
                          <dt>{translate(lang, 'glossary.careful')}</dt>
                          <dd>{localize(term.avoid, lang)}</dd>
                        </div>
                      </dl>
                      <code>{term.example}</code>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
