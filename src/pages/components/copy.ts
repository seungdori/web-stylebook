import type { Lang } from '../../data/styles';

export type L = Record<Lang, string>;
export const t = (en: string, ko: string, ja: string): L => ({ en, ko, ja });
export const pick = (text: L, lang: Lang) => text[lang];

export const copy = {
  title: t('Components', '컴포넌트', 'コンポーネント'),
  lead: t(
    'React components we built in the Quiet Utility style. Copy the files into your project. React is the only dependency. MIT licensed, including for commercial use.',
    'Quiet Utility 스타일로 직접 만든 React 컴포넌트입니다. 파일을 프로젝트에 복사해 쓰고, React 외에 필요한 라이브러리가 없습니다. MIT 라이선스이므로 상업 프로젝트에도 쓸 수 있습니다.',
    'Quiet Utilityスタイルで独自に作ったReactコンポーネントです。ファイルをプロジェクトにコピーして使います。React以外のライブラリは必要ありません。MITライセンスなので、商用プロジェクトにも使えます。',
  ),
  styleLink: t('See the Quiet Utility style', 'Quiet Utility 스타일 보기', 'Quiet Utilityスタイルを見る'),
  allComponents: t('All components', '모든 컴포넌트', 'すべてのコンポーネント'),
  componentList: t('Components', '컴포넌트 목록', 'コンポーネント一覧'),
  pager: t('Previous and next components', '이전 컴포넌트와 다음 컴포넌트', '前後のコンポーネント'),
  previous: t('Previous', '이전', '前へ'),
  next: t('Next', '다음', '次へ'),
  packageManager: t('Package manager', '패키지 매니저', 'パッケージマネージャー'),
  replay: t('Replay', '다시 재생', 'もう一度再生'),
  tabs: { preview: t('Preview', '미리보기', 'プレビュー'), code: t('Code', '코드', 'コード') },
  view: t('View', '보기', '表示'),
  example: t('Example', '예시', '例'),
  usage: t('Usage', '사용법', '使い方'),
  install: t('Installation', '설치', 'インストール'),
  installHint: t(
    'The webstylebook command copies the component and the theme into your project.',
    'webstylebook 명령이 컴포넌트와 테마를 프로젝트에 복사합니다.',
    'webstylebookコマンドがコンポーネントとテーマをプロジェクトにコピーします。',
  ),
  props: t('Props', 'Props', 'Props'),
  notes: t('Keyboard and accessibility', '키보드와 접근성', 'キーボードとアクセシビリティ'),
  copy: t('Copy', '복사', 'コピー'),
  copied: t('Copied', '복사했습니다', 'コピーしました'),
  copyFailed: t('Copy failed', '복사하지 못했습니다', 'コピーできませんでした'),
  sourceFiles: t('Files', '파일', 'ファイル'),
  columns: [t('Prop', '이름', '名前'), t('Type', '타입', '型'), t('Default', '기본값', '既定値'), t('Description', '설명', '説明')],
};
