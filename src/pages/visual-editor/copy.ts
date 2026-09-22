import type { Lang } from '../../data/styles';

export const editorCopy = {
  en: {
    style: 'Selected style', undo: 'Undo', reset: 'Reset this tool', contentLanguage: 'Preview language',
    colorsTitle: 'Color roles', colorsDescription: 'Adjust the colors where they are used. Accepted changes stay with your design.',
    typographyTitle: 'Typography', typographyDescription: 'Adjust the reading system and compare it with the original style.',
    basics: 'Background, text and actions', surfaces: 'Surfaces and supporting colors', states: 'Status and boundaries',
    preview: 'Component preview', original: 'Original typography', edited: 'Your typography', showOriginal: 'Compare with original',
    narrow: 'Narrow', wide: 'Wide', previewWidth: 'Preview width', editCopy: 'Edit preview text',
    heading: 'Heading', body: 'Body', label: 'Action label', caption: 'Metadata',
    role: 'Text role', sizeMinRem: 'Small-screen size (rem)', sizeMaxRem: 'Wide-screen size (rem)',
    fontWeight: 'Weight', lineHeight: 'Line height', letterSpacingEm: 'Letter spacing (em)', measureCh: 'Reading width (ch)',
    paragraphSpacingEm: 'Paragraph spacing (em)', fontFamily: 'Font stack', advanced: 'Advanced typography',
    invalidColor: 'Enter a color such as #1a2b3c. The last valid color is still shown.',
    invalidNumber: 'Use a number within the stated range. The last valid value is still shown.',
    invalidFont: 'Use font names separated by commas; CSS declarations and URLs are not allowed.',
    invalidScale: 'The wide-screen size must be at least the small-screen size.',
    pending: 'Fix the highlighted inputs before exporting. Your last valid design is preserved.',
    export: 'Export this design', css: 'CSS', json: 'JSON', copy: 'Copy', copied: 'Copied', copyError: 'Copy failed. Select the output and copy it manually.',
    contrast: 'Contrast in use', ratio: 'Ratio', result: 'Result', pass: 'Pass', fail: 'Needs adjustment', rendered: 'Needs visual review', na: 'Not applicable',
    contrastNote: 'Text pairs use 4.5:1; focus and essential control boundaries use 3:1. These checks do not certify full accessibility.',
    repair: 'Apply suggested repair', repairs: 'Suggested adjustments', noRepairs: 'No automatic repair is proposed.',
    usage: 'Color usage', saved: 'Design changes are shared across tools.',
    email: 'Project email', placeholder: 'name@example.com', primary: 'Save changes', secondary: 'Preview',
    success: 'Changes saved', caution: 'Review the draft before sharing', critical: 'A required field is missing', info: 'Only this design is exported',
    sampleHeading: 'A clearer view of your project', sampleBody: 'Give the next action a clear place. Supporting details should remain readable on their own surface.',
    sampleCaption: 'Preview content · not a live project', sampleLink: 'Read project notes', sampleSelection: 'Selected view',
    fontStatus: 'Preview fonts', loading: 'Loading', ready: 'Loaded', fallback: 'Fallback in use', error: 'Could not load; fallback in use', system: 'System font',
    fontNote: 'Loaded means the browser accepted the font; check the rendered text for missing glyphs. Font substitutions are included in the design specification.',
    fontUnverified: 'Availability unverified', scriptFallback: 'Other scripts use fallback fonts', weightWarning: 'This weight is not listed for the selected face. Check the rendered weight.',
    changes: 'Typography changes', unchanged: 'No typography changes.', currentValue: 'Current value',
    resetCopy: 'Reset preview text', defaultMode: 'Authored color mode',
  },
  ko: {
    style: '선택한 스타일', undo: '실행 취소', reset: '이 도구의 수정 초기화', contentLanguage: '미리보기 언어',
    colorsTitle: '색상 역할', colorsDescription: '실제로 쓰이는 위치에서 색을 조정하세요. 적용한 값은 다른 도구에서도 유지됩니다.',
    typographyTitle: '타이포그래피', typographyDescription: '글의 크기와 읽는 흐름을 조정하고 원본 스타일과 비교하세요.',
    basics: '배경·글자·버튼', surfaces: '표면과 보조 색상', states: '상태와 경계',
    preview: '요소 미리보기', original: '원본 타이포그래피', edited: '수정한 타이포그래피', showOriginal: '원본과 비교',
    narrow: '좁게', wide: '넓게', previewWidth: '미리보기 너비', editCopy: '미리보기 글 편집',
    heading: '제목', body: '본문', label: '버튼 문구', caption: '보조 정보',
    role: '글자 역할', sizeMinRem: '작은 화면 크기 (rem)', sizeMaxRem: '넓은 화면 크기 (rem)',
    fontWeight: '굵기', lineHeight: '줄 높이', letterSpacingEm: '자간 (em)', measureCh: '읽기 너비 (ch)',
    paragraphSpacingEm: '문단 간격 (em)', fontFamily: '글꼴과 대체 글꼴', advanced: '상세 타이포그래피',
    invalidColor: '#1a2b3c 같은 색상 값을 입력하세요. 마지막으로 적용한 색이 표시됩니다.',
    invalidNumber: '표시된 범위 안의 숫자를 입력하세요. 마지막으로 적용한 값이 표시됩니다.',
    invalidFont: '글꼴 이름을 쉼표로 구분하세요. CSS 선언과 URL은 사용할 수 없습니다.',
    invalidScale: '넓은 화면 크기는 작은 화면 크기 이상이어야 합니다.',
    pending: '표시된 입력을 수정한 뒤 내보내세요. 마지막으로 적용한 디자인은 보존됩니다.',
    export: '이 디자인 내보내기', css: 'CSS', json: 'JSON', copy: '복사', copied: '복사됨', copyError: '복사하지 못했습니다. 출력 내용을 선택해 직접 복사하세요.',
    contrast: '실제 조합의 대비', ratio: '대비율', result: '결과', pass: '통과', fail: '조정 필요', rendered: '화면 확인 필요', na: '해당 없음',
    contrastNote: '글자 조합은 4.5:1, 포커스와 필수 입력 경계는 3:1 기준입니다. 이 검사만으로 접근성 전체를 보장하지는 않습니다.',
    repair: '제안한 색상 적용', repairs: '색상 조정 제안', noRepairs: '자동 조정 제안이 없습니다.',
    usage: '색 사용 규칙', saved: '디자인 수정값은 다른 도구에서도 유지됩니다.',
    email: '프로젝트 이메일', placeholder: 'name@example.com', primary: '변경 저장', secondary: '미리보기',
    success: '변경 내용이 저장되었습니다', caution: '공유 전에 초안을 확인하세요', critical: '필수 항목을 입력하세요', info: '이 디자인만 내보냅니다',
    sampleHeading: '프로젝트를 더 명확하게', sampleBody: '다음 행동이 잘 보이도록 배치하세요. 보조 정보도 각 표면 위에서 읽을 수 있어야 합니다.',
    sampleCaption: '미리보기용 내용 · 실제 프로젝트 아님', sampleLink: '프로젝트 메모 읽기', sampleSelection: '선택한 보기',
    fontStatus: '미리보기 글꼴', loading: '불러오는 중', ready: '불러옴', fallback: '대체 글꼴 사용', error: '불러오지 못해 대체 글꼴 사용', system: '시스템 글꼴',
    fontNote: '불러옴은 브라우저가 글꼴을 받아들였다는 뜻입니다. 실제 글자의 누락 여부도 확인하세요. 글꼴 대체 정보는 디자인 명세에 포함됩니다.',
    fontUnverified: '사용 가능 여부 미확인', scriptFallback: '다른 문자에는 대체 글꼴 사용', weightWarning: '선택한 글꼴에 이 굵기가 등록되어 있지 않습니다. 실제 표시된 굵기를 확인하세요.',
    changes: '타이포그래피 변경 내용', unchanged: '타이포그래피 변경이 없습니다.', currentValue: '현재 값',
    resetCopy: '미리보기 글 초기화', defaultMode: '원본 색상 모드',
  },
  ja: {
    style: '選択したスタイル', undo: '元に戻す', reset: 'このツールの変更をリセット', contentLanguage: 'プレビュー言語',
    colorsTitle: '色の役割', colorsDescription: '実際に使う場所で色を調整。適用した値は他のツールでも維持されます。',
    typographyTitle: 'タイポグラフィ', typographyDescription: '文字の階層や読みやすさを調整し、元のスタイルと比較できます。',
    basics: '背景・文字・ボタン', surfaces: 'サーフェスと補助色', states: '状態と境界',
    preview: '要素のプレビュー', original: '元のタイポグラフィ', edited: '編集後のタイポグラフィ', showOriginal: '元の設定と比較',
    narrow: '狭く', wide: '広く', previewWidth: 'プレビュー幅', editCopy: 'プレビュー文を編集',
    heading: '見出し', body: '本文', label: 'ボタンの文言', caption: '補助情報',
    role: '文字の役割', sizeMinRem: '小さい画面のサイズ (rem)', sizeMaxRem: '広い画面のサイズ (rem)',
    fontWeight: '太さ', lineHeight: '行の高さ', letterSpacingEm: '字間 (em)', measureCh: '読み幅 (ch)',
    paragraphSpacingEm: '段落間隔 (em)', fontFamily: 'フォントと代替フォント', advanced: '詳細な文字設定',
    invalidColor: '#1a2b3c のような色を入力してください。最後に適用した色を表示しています。',
    invalidNumber: '表示範囲内の数値を入力してください。最後に適用した値を表示しています。',
    invalidFont: 'フォント名をカンマで区切ってください。CSS 宣言や URL は使用できません。',
    invalidScale: '広い画面のサイズは小さい画面のサイズ以上にしてください。',
    pending: '強調された入力を修正してから書き出してください。最後に適用したデザインは保持されています。',
    export: 'このデザインを書き出す', css: 'CSS', json: 'JSON', copy: 'コピー', copied: 'コピー済み', copyError: 'コピーできませんでした。出力を選択して手動でコピーしてください。',
    contrast: '実際の組み合わせのコントラスト', ratio: '比率', result: '結果', pass: '合格', fail: '調整が必要', rendered: '画面での確認が必要', na: '対象外',
    contrastNote: '文字は 4.5:1、フォーカスと必須の入力境界は 3:1 で確認します。この検査だけでアクセシビリティ全体は保証できません。',
    repair: '提案された色を適用', repairs: '色の調整案', noRepairs: '自動調整の提案はありません。',
    usage: '色の使用ルール', saved: 'デザインの変更は他のツールでも維持されます。',
    email: 'プロジェクトのメール', placeholder: 'name@example.com', primary: '変更を保存', secondary: 'プレビュー',
    success: '変更を保存しました', caution: '共有前に下書きを確認してください', critical: '必須項目を入力してください', info: 'このデザインだけを書き出します',
    sampleHeading: 'プロジェクトをより明確に', sampleBody: '次の操作が見つかる配置に。補助情報もそれぞれの面で読みやすく保ちます。',
    sampleCaption: 'プレビュー用の内容・実際のプロジェクトではありません', sampleLink: 'プロジェクトのメモを読む', sampleSelection: '選択した表示',
    fontStatus: 'プレビューのフォント', loading: '読み込み中', ready: '読み込み済み', fallback: '代替フォントを使用', error: '読み込めないため代替フォントを使用', system: 'システムフォント',
    fontNote: '読み込み済みはブラウザーがフォントを受け入れた状態です。実際の文字の欠落も確認してください。代替情報はデザイン仕様に含まれます。',
    fontUnverified: '使用可否は未確認', scriptFallback: '他の文字には代替フォントを使用', weightWarning: 'この太さは選択したフォントに登録されていません。実際の表示を確認してください。',
    changes: 'タイポグラフィの変更', unchanged: '文字設定の変更はありません。', currentValue: '現在の値',
    resetCopy: 'プレビュー文をリセット', defaultMode: '元のカラーモード',
  },
} satisfies Record<Lang, Record<string, string>>;

export const colorRoleNames = {
  canvas: ['Page background', 'ページ背景', '페이지 배경'], surface: ['Base surface', '基本サーフェス', '기본 표면'],
  surfaceRaised: ['Raised surface', '前面サーフェス', '전면 표면'], surfaceMuted: ['Muted surface', '補助サーフェス', '보조 표면'],
  text: ['Main text', '主要テキスト', '본문 글자'], textMuted: ['Supporting text', '補助テキスト', '보조 글자'], textInverse: ['Inverse text', '反転テキスト', '반전 글자'],
  accent: ['Accent identity', 'アクセントカラー', '스타일 강조색'], accentText: ['Text on accent', 'アクセント上の文字', '강조색 위 글자'],
  accentSecondary: ['Secondary accent', '補助アクセント', '보조 강조색'], accentSecondaryText: ['Text on secondary accent', '補助アクセント上の文字', '보조 강조색 위 글자'],
  actionPrimary: ['Primary button', '主要ボタン', '주요 버튼 면'], actionPrimaryText: ['Primary button label', '主要ボタンの文字', '주요 버튼 문구'],
  actionSecondary: ['Secondary button', '補助ボタン', '보조 버튼 면'], actionSecondaryText: ['Secondary button label', '補助ボタンの文字', '보조 버튼 문구'],
  border: ['Divider', '区切り線', '구분선'], borderStrong: ['Input boundary', '入力欄の境界', '입력 경계'],
  link: ['Link', 'リンク', '링크'], focus: ['Focus outline', 'フォーカス枠', '포커스 테두리'],
  positive: ['Success', '成功', '성공'], caution: ['Caution', '注意', '주의'], critical: ['Error', 'エラー', '오류'], info: ['Information', '情報', '안내'],
} as const;

export const typographyRoleNames = {
  display: ['Display', '大見出し', '큰 제목'], heading: ['Heading', '見出し', '제목'], subheading: ['Section heading', '節見出し', '소제목'],
  body: ['Body', '本文', '본문'], small: ['Small body', '小さい本文', '작은 본문'], label: ['Label', 'ラベル', '라벨'], caption: ['Caption', '補足', '보조 정보'], data: ['Numeric / data', '数値・データ', '숫자·데이터'],
} as const;

export function roleName(names: readonly string[], lang: Lang): string {
  return names[lang === 'en' ? 0 : lang === 'ja' ? 1 : 2];
}

export function fontStateLabel(font: { status: string; source: string; reason: string }, lang: Lang): string {
  const t = editorCopy[lang];
  if (font.status === 'ready') return t.ready;
  if (font.status === 'loading') return t.loading;
  if (font.status === 'error') return t.error;
  if (font.source === 'system') return t.system;
  if (font.source === 'user') return t.fontUnverified;
  return font.reason === 'script-not-covered' ? t.scriptFallback : t.fallback;
}
