import type { Lang, LocalizedText } from './styles';
import type { HomePurposeId } from './purposeDiscovery';

export interface HomeChoiceCopy {
  title: string;
  lead: string;
  candidates: string;
  chosen: string;
  compare: string;
  adjust: string;
  export: string;
  undo: string;
  adapted: string;
  original: string;
  purpose: string;
  browse: string;
  mixed: string;
  shortlist: string;
  because: string;
  caution: string;
  poorFit: string;
  fullCatalog: string;
  neutralMixed: string;
  neutralUnknown: string;
  unsupported: string;
  fontFallback: string;
  fontsLoading: string;
  previewSize: string;
  overview: string;
  actualSize: string;
  tags: string;
  utilities: string;
  staticSpecimen: string;
  staticNeedJs: string;
  styleCount: string;
  fusionCount: string;
  missingStyle: string;
}

export const homeChoiceCopy: Record<Lang, HomeChoiceCopy> = {
  en: {
    title: 'One example. Different design choices.',
    lead: 'Choose a style, adjust its details, and take the result into your project.',
    candidates: 'Try a direction',
    chosen: 'Working design',
    compare: 'Compare',
    adjust: 'Adjust colors',
    export: 'Export this design',
    undo: 'Undo selection',
    adapted: 'An adapted specimen using your current design values. Open the original example for its full composition and effects.',
    original: 'Original example',
    purpose: 'What are you making?',
    browse: 'Browse freely',
    mixed: 'Mixed or not sure',
    shortlist: 'A starting shortlist',
    because: 'Fits because',
    caution: 'Caution',
    poorFit: 'The catalog lists this as a poor fit for this purpose.',
    fullCatalog: 'View the full catalog',
    neutralMixed: 'A mixed purpose stays neutral. Nothing is hidden; choose any style below.',
    neutralUnknown: 'That purpose is not in the catalog. Nothing is hidden; choose any style below.',
    unsupported: 'This filter is not in the catalog. Choose another tag or reset.',
    fontFallback: 'Font availability may affect this preview on your device:',
    fontsLoading: 'Loading the selected fonts…',
    previewSize: 'Preview size',
    overview: 'Overview',
    actualSize: 'Actual size',
    tags: 'Style tags',
    utilities: 'More guides and tools',
    staticSpecimen: 'Sample content compared across directions',
    staticNeedJs: 'JavaScript switches this sample between styles and keeps a working design. The sample content and starting shortlist stay readable without it.',
    styleCount: '{count} styles',
    fusionCount: '{count} fusions',
    missingStyle: 'The saved style is not in this catalog. The list below is unchanged.',
  },
  ko: {
    title: '같은 내용으로, 디자인의 차이를 보세요.',
    lead: '스타일을 고르고 세부를 조정한 뒤, 내 프로젝트로 가져가세요.',
    candidates: '스타일 바꿔 보기',
    chosen: '작업 중인 디자인',
    compare: '비교하기',
    adjust: '색상 조정',
    export: '이 디자인 내보내기',
    undo: '선택 되돌리기',
    adapted: '현재 디자인 값을 적용한 비교용 예시입니다. 전체 구성과 효과는 원본 예시에서 확인하세요.',
    original: '원본 예시',
    purpose: '어떤 화면을 만드나요?',
    browse: '자유롭게 둘러보기',
    mixed: '섞여 있거나 아직 모름',
    shortlist: '먼저 살펴볼 스타일',
    because: '어울리는 이유',
    caution: '주의',
    poorFit: '카탈로그에서 이 목적에는 잘 안 맞는 스타일로 적혀 있습니다.',
    fullCatalog: '전체 카탈로그 보기',
    neutralMixed: '목적이 섞여 있으면 후보를 좁히지 않습니다. 아래 스타일은 그대로 고를 수 있습니다.',
    neutralUnknown: '카탈로그에 없는 목적입니다. 아래 스타일은 숨기지 않습니다.',
    unsupported: '카탈로그에 없는 필터입니다. 다른 태그를 고르거나 초기화하세요.',
    fontFallback: '글꼴 설치와 로딩 상태에 따라 미리보기가 다를 수 있습니다:',
    fontsLoading: '선택한 글꼴을 불러오는 중…',
    previewSize: '미리보기 크기',
    overview: '전체 보기',
    actualSize: '실제 크기',
    tags: '스타일 태그',
    utilities: '다른 가이드와 도구',
    staticSpecimen: '같은 예시 내용을 여러 방향으로 비교',
    staticNeedJs: '스타일 전환과 작업 중인 디자인 유지는 JavaScript가 필요합니다. 예시 내용과 시작 후보는 JavaScript 없이도 읽을 수 있습니다.',
    styleCount: '스타일 {count}개',
    fusionCount: '퓨전 {count}개',
    missingStyle: '저장된 스타일이 이 카탈로그에 없습니다. 아래 목록은 그대로입니다.',
  },
  ja: {
    title: '同じ内容で、デザインの違いを見る。',
    lead: 'スタイルを選び、細部を調整して、自分のプロジェクトに持ち込みましょう。',
    candidates: 'スタイルを切り替える',
    chosen: '編集中のデザイン',
    compare: '比較する',
    adjust: '色を調整',
    export: 'このデザインを書き出す',
    undo: '選択を元に戻す',
    adapted: '現在のデザイン値を適用した比較用の例です。全体の構成や効果は元の作例で確認できます。',
    original: '元の作例',
    purpose: 'どんな画面を作りますか？',
    browse: '自由に探す',
    mixed: '複数・まだ決めていない',
    shortlist: '最初に見る候補',
    because: '向いている理由',
    caution: '注意',
    poorFit: 'カタログでは、この目的に向きにくいスタイルとして記載されています。',
    fullCatalog: 'カタログ全体を見る',
    neutralMixed: '目的が混在する場合は候補を絞りません。下のスタイルはすべて選べます。',
    neutralUnknown: 'カタログにない目的です。下のスタイルは隠していません。',
    unsupported: 'カタログにない絞り込みです。別のタグを選ぶか、リセットしてください。',
    fontFallback: 'フォントのインストールや読み込み状況で表示が異なる場合があります：',
    fontsLoading: '選択したフォントを読み込み中…',
    previewSize: 'プレビューサイズ',
    overview: '全体表示',
    actualSize: '実際のサイズ',
    tags: 'スタイルのタグ',
    utilities: 'その他のガイドとツール',
    staticSpecimen: '同じ見本の内容を方向別に比較',
    staticNeedJs: 'スタイルの切り替えと作業中デザインの維持にはJavaScriptが必要です。見本の内容と最初の候補はJavaScriptなしでも読めます。',
    styleCount: 'スタイル {count}件',
    fusionCount: 'フュージョン {count}件',
    missingStyle: '保存されたスタイルはこのカタログにありません。下の一覧はそのままです。',
  },
};

export const purposeChoiceLabels: Record<HomePurposeId, LocalizedText> = {
  'operational-saas': { en: 'Repeated-use tools', ko: '반복해서 쓰는 도구', ja: '繰り返し使うツール' },
  'content-editorial': { en: 'Reading and editorial', ko: '읽기와 에디토리얼', ja: '読みものとエディトリアル' },
  campaign: { en: 'Product presentation', ko: '제품 소개', ja: '製品紹介' },
  commerce: { en: 'Commerce', ko: '쇼핑과 판매', ja: '販売と購入' },
};

export function homeChoiceText(lang: Lang, key: keyof HomeChoiceCopy): string {
  return homeChoiceCopy[lang][key];
}

export function formatCount(template: string, count: number): string {
  return template.replace('{count}', String(count));
}
