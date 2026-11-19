import type { Lang } from '../../data/styles';

/* Copy for the home page sections added with rule set D. Strings that already exist elsewhere
   (nav labels, card labels, the candidate preview and purpose copy) are read from i18n.ts and
   homeChoiceCopy.ts instead. */
export interface HomeCopy {
  title: string[];
  lead: string;
  viewStyles: string;
  howTo: string;
  bandLabel: string;
  previousStyle: string;
  nextStyle: string;
  pause: string;
  play: string;
  stylesTitle: string;
  stylesLead: string;
  hoverHint: string;
  light: string;
  dark: string;
  dual: string;
  fusion: string;
  viewAll: string;
  viewGroups: string;
  applyTitle: string[];
  applyLead: string;
  stepChoose: string;
  stepChooseBody: string;
  stepChooseLink: string;
  stepAdjust: string;
  stepAdjustBody: string;
  stepAdjustColors: string;
  stepAdjustType: string;
  stepApply: string;
  stepApplyBody: string;
  methods: string;
  tabPrompt: string;
  tabMcp: string;
  tabCli: string;
  promptBody: string;
  mcpBody: string;
  cliBody: string;
  copy: string;
  copied: string;
  copyFailed: string;
  moreTitle: string;
  referencesBody: string;
  principlesBody: string;
  proKitBody: string;
}

/* {count} is the catalog size, {styles} the base styles and {fusions} the fusions. */
const en: HomeCopy = {
  title: ['One style changes', 'the whole page.'],
  lead: 'See {count} web design styles as real pages. Apply the one you choose to your project with a prompt or MCP.',
  viewStyles: 'View {count} styles',
  howTo: 'How to use',
  bandLabel: '{count} style screens. Drag sideways to move through them.',
  previousStyle: 'Previous style',
  nextStyle: 'Next style',
  pause: 'Pause',
  play: 'Play',
  stylesTitle: '{count} styles',
  stylesLead: '{styles} base styles and {fusions} fusions that mix two styles.',
  hoverHint: 'Point at a card to see further down its page.',
  light: 'Light',
  dark: 'Dark',
  dual: 'Dark and light',
  fusion: 'Fusion',
  viewAll: 'View all {count}',
  viewGroups: 'View by group',
  applyTitle: ['How to apply a style', 'to your project'],
  applyLead: 'Choose a style, adjust the details, then hand it over with a prompt or MCP.',
  stepChoose: 'Choose a style',
  stepChooseBody: 'Open the real pages, and compare two styles side by side with the same content.',
  stepChooseLink: 'Open Style Compare',
  stepAdjust: 'Adjust the details',
  stepAdjustBody: 'Changes to color and typography show in the preview at once, and the values carry over to the next step.',
  stepAdjustColors: 'Adjust colors',
  stepAdjustType: 'Adjust typography',
  stepApply: 'Apply it to your project',
  stepApplyBody: 'Pick the method that fits how you work.',
  methods: 'How to apply',
  tabPrompt: 'Prompt',
  tabMcp: 'MCP server',
  tabCli: 'Component CLI',
  promptBody: 'Turns the chosen style and your adjustments into one prompt, for a new design or for improving part of an existing one.',
  mcpBody: 'Your coding agent reads the same catalog directly. Add this to your MCP settings file.',
  cliBody: 'Copies the source of the Quiet Utility React components into your project. Nothing is needed besides React 19.',
  copy: 'Copy',
  copied: 'Copied',
  copyFailed: 'Could not copy',
  moreTitle: 'More resources',
  referencesBody: 'Compare screens of {references} real websites, with a design analysis and a link to each original site.',
  principlesBody: 'Layout, hierarchy, type, color, imagery, navigation, and states, each tied to concrete checks.',
  proKitBody: 'Open finished example pages for each product type, and see what each bundle includes.',
};

const ko: HomeCopy = {
  title: ['스타일 하나가', '페이지 전체를 바꿉니다.'],
  lead: '{count}가지 웹 디자인 스타일을 실제 페이지로 확인하세요. 고른 스타일은 프롬프트나 MCP로 내 프로젝트에 적용할 수 있습니다.',
  viewStyles: '스타일 {count}가지 보기',
  howTo: '사용 방법 보기',
  bandLabel: '스타일 화면 {count}장. 좌우로 끌어서 넘길 수 있습니다.',
  previousStyle: '이전 스타일',
  nextStyle: '다음 스타일',
  pause: '일시정지',
  play: '재생',
  stylesTitle: '스타일 {count}가지',
  stylesLead: '기본 스타일 {styles}가지와, 두 스타일을 섞은 퓨전 {fusions}가지입니다.',
  hoverHint: '카드에 포인터를 올리면 페이지 아래쪽까지 보입니다.',
  light: '라이트',
  dark: '다크',
  dual: '다크와 라이트 모두 지원',
  fusion: '퓨전',
  viewAll: '{count}가지 모두 보기',
  viewGroups: '분류별로 보기',
  applyTitle: ['고른 스타일을', '프로젝트에 적용하는 방법'],
  applyLead: '스타일을 고르고, 세부를 조정한 뒤, 프롬프트나 MCP로 전달합니다.',
  stepChoose: '스타일을 고릅니다',
  stepChooseBody: '실제 페이지를 열어 보고, 두 스타일을 같은 내용으로 나란히 비교합니다.',
  stepChooseLink: '스타일 비교 열기',
  stepAdjust: '세부를 조정합니다',
  stepAdjustBody: '색상과 타이포그래피를 바꾸면 미리보기에 바로 반영됩니다. 조정한 값은 다음 단계로 그대로 넘어갑니다.',
  stepAdjustColors: '색상 조정 열기',
  stepAdjustType: '타이포그래피 조정 열기',
  stepApply: '프로젝트에 적용합니다',
  stepApplyBody: '작업 방식에 맞는 방법 하나를 고르세요.',
  methods: '적용 방법',
  tabPrompt: '프롬프트',
  tabMcp: 'MCP 서버',
  tabCli: '컴포넌트 CLI',
  promptBody: '선택한 스타일과 수정값을 하나의 프롬프트로 만듭니다. 새 디자인과 기존 디자인의 부분 개선을 나누어 쓸 수 있습니다.',
  mcpBody: '코딩 에이전트가 같은 카탈로그를 직접 조회합니다. 아래 설정을 MCP 설정 파일에 추가하세요.',
  cliBody: 'Quiet Utility 스타일의 React 컴포넌트 소스를 프로젝트에 복사합니다. React 19 외에 필요한 라이브러리가 없습니다.',
  copy: '복사',
  copied: '복사됨',
  copyFailed: '복사하지 못했습니다',
  moreTitle: '함께 보면 좋은 자료',
  referencesBody: '실제 웹사이트 {references}곳의 화면을 비교하고, 디자인 분석과 원본 사이트를 확인합니다.',
  principlesBody: '배치, 위계, 글자, 색, 이미지, 내비게이션, 상태를 실제 검증 항목과 연결합니다.',
  proKitBody: '제품 유형별로 완성된 예시 페이지를 열어 보고, 번들 구성을 확인합니다.',
};

const ja: HomeCopy = {
  title: ['スタイルを一つ変えると', 'ページ全体が変わります。'],
  lead: '{count}種類のWebデザインスタイルを実際のページで確認できます。選んだスタイルは、プロンプトまたはMCPでプロジェクトに適用できます。',
  viewStyles: 'スタイル{count}種類を見る',
  howTo: '使い方を見る',
  bandLabel: 'スタイル画面{count}枚。左右にドラッグして切り替えられます。',
  previousStyle: '前のスタイル',
  nextStyle: '次のスタイル',
  pause: '一時停止',
  play: '再生',
  stylesTitle: 'スタイル{count}種類',
  stylesLead: '基本スタイル{styles}種類と、2つのスタイルを組み合わせたフュージョン{fusions}種類です。',
  hoverHint: 'カードにポインターを合わせると、ページの下の方まで見えます。',
  light: 'ライト',
  dark: 'ダーク',
  dual: 'ダークとライトの両方に対応',
  fusion: 'フュージョン',
  viewAll: '{count}種類をすべて見る',
  viewGroups: 'グループ別に見る',
  applyTitle: ['選んだスタイルを', 'プロジェクトに適用する方法'],
  applyLead: 'スタイルを選び、細部を調整してから、プロンプトまたはMCPで渡します。',
  stepChoose: 'スタイルを選ぶ',
  stepChooseBody: '実際のページを開き、同じ内容の2つのスタイルを並べて比べられます。',
  stepChooseLink: 'スタイル比較を開く',
  stepAdjust: '細部を調整する',
  stepAdjustBody: '色とタイポグラフィを変更すると、プレビューにすぐ反映されます。調整した値は次の手順にそのまま引き継がれます。',
  stepAdjustColors: '色の調整を開く',
  stepAdjustType: 'タイポグラフィの調整を開く',
  stepApply: 'プロジェクトに適用する',
  stepApplyBody: '作業の進め方に合う方法を一つ選んでください。',
  methods: '適用方法',
  tabPrompt: 'プロンプト',
  tabMcp: 'MCPサーバー',
  tabCli: 'コンポーネントCLI',
  promptBody: '選んだスタイルと調整値を一つのプロンプトにまとめます。新しいデザインにも、既存デザインの一部の改善にも使えます。',
  mcpBody: 'コーディングエージェントが同じカタログを直接参照します。下の設定をMCPの設定ファイルに追加してください。',
  cliBody: 'Quiet UtilityスタイルのReactコンポーネントのソースを、プロジェクトにコピーします。React 19以外に必要なものはありません。',
  copy: 'コピー',
  copied: 'コピーしました',
  copyFailed: 'コピーできませんでした',
  moreTitle: '関連資料',
  referencesBody: '実在するWebサイト{references}件の画面を比較し、デザイン分析と元サイトへのリンクを確認できます。',
  principlesBody: 'レイアウト、階層、文字、色、画像、ナビゲーション、状態を、具体的な確認項目とともに整理しています。',
  proKitBody: '製品タイプごとに完成した例のページを開き、バンドルの内容を確認できます。',
};

export const homeCopy: Record<Lang, HomeCopy> = { en, ko, ja };

export function fill(template: string, values: Record<string, number | string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
