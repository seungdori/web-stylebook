import type { Lang, LocalizedText } from './styles';

export const specimenFixtureIds = ['product', 'operations', 'editorial'] as const;
export type SpecimenFixtureId = (typeof specimenFixtureIds)[number];

export interface SpecimenCopy {
  eyebrow: string;
  heading: string;
  body: string;
  label: string;
  caption: string;
  sectionHeading: string;
  sectionBody: string;
  metric: string;
  metricLabel: string;
  items: { title: string; detail: string; value: string }[];
  footer: string;
}

export const specimenFixtureNames: Record<SpecimenFixtureId, LocalizedText> = {
  product: { en: 'Product workspace', ko: '제품 작업 공간', ja: 'プロダクトのワークスペース' },
  operations: { en: 'Operations dashboard', ko: '운영 대시보드', ja: '運用ダッシュボード' },
  editorial: { en: 'Editorial journal', ko: '에디토리얼 저널', ja: 'エディトリアルジャーナル' },
};

const fixtures: Record<SpecimenFixtureId, Record<Lang, SpecimenCopy>> = {
  product: {
    en: {
      eyebrow: 'FIELDNOTES / TEAM WORKSPACE',
      heading: 'Plan your next release.',
      body: 'Keep the next release in view. Bring research, decisions, and delivery into one shared workspace.',
      label: 'View workspace',
      caption: 'A shared plan for a small team with a big idea.',
      sectionHeading: 'This week’s priorities',
      sectionBody: 'Three clear next steps to move the release forward.',
      metric: '12',
      metricLabel: 'Tasks completed this week',
      items: [
        { title: 'Customer interviews', detail: 'Review notes from five conversations.', value: 'Research' },
        { title: 'First-run experience', detail: 'Simplify the path to a first project.', value: 'Design' },
        { title: 'Release checklist', detail: 'Confirm ownership and final checks.', value: 'Delivery' },
      ],
      footer: 'Sample workspace · All content is for preview.',
    },
    ko: {
      eyebrow: 'FIELDNOTES / 팀 작업 공간',
      heading: '다음 출시를 계획하세요.',
      body: '다음 출시까지 필요한 일을 한눈에 살펴보세요. 리서치부터 의사결정, 출시 준비까지 하나의 작업 공간에서 함께 진행합니다.',
      label: '작업 공간 보기',
      caption: '큰 아이디어를 함께 실현하는 작은 팀의 계획.',
      sectionHeading: '이번 주 우선순위',
      sectionBody: '출시를 위해 다음으로 진행할 세 가지 작업입니다.',
      metric: '12',
      metricLabel: '이번 주 완료한 작업',
      items: [
        { title: '고객 인터뷰', detail: '다섯 번의 인터뷰에서 얻은 내용을 정리합니다.', value: '리서치' },
        { title: '첫 사용 경험', detail: '첫 프로젝트를 만드는 과정을 간소화합니다.', value: '디자인' },
        { title: '출시 체크리스트', detail: '담당자와 최종 확인 항목을 점검합니다.', value: '출시 준비' },
      ],
      footer: '예시 작업 공간 · 모든 내용은 미리보기용입니다.',
    },
    ja: {
      eyebrow: 'FIELDNOTES / チームワークスペース',
      heading: '次のリリースを計画する。',
      body: '次のリリースに必要なことをひと目で把握。リサーチから意思決定、公開準備まで、ひとつのワークスペースで進めます。',
      label: 'ワークスペースを見る',
      caption: '大きなアイデアを形にする、小さなチームの計画。',
      sectionHeading: '今週の優先事項',
      sectionBody: 'リリースに向けて進める、次の3つのタスクです。',
      metric: '12',
      metricLabel: '今週完了したタスク',
      items: [
        { title: '顧客インタビュー', detail: '5件のインタビューから得た知見を整理。', value: 'リサーチ' },
        { title: '初回利用の体験', detail: '最初のプロジェクト作成をより簡単に。', value: 'デザイン' },
        { title: 'リリースチェックリスト', detail: '担当者と最終確認項目をチェック。', value: '公開準備' },
      ],
      footer: 'サンプルワークスペース · 内容はプレビュー用です。',
    },
  },
  operations: {
    en: {
      eyebrow: 'NORTHLINE / OPERATIONS',
      heading: 'A clear view of today’s deliveries.',
      body: 'See what is ready, what is moving, and where your team needs to act. Keep every handoff on track.',
      label: 'Open delivery queue',
      caption: 'Today’s snapshot · Updated at 09:30',
      sectionHeading: 'Deliveries to review',
      sectionBody: 'Check the next handoff for each active shipment.',
      metric: '24',
      metricLabel: 'Scheduled deliveries today',
      items: [
        { title: 'NL-2041 · Studio supplies', detail: 'Packing complete · Pickup at 10:00', value: 'Ready' },
        { title: 'NL-2042 · Print samples', detail: 'With courier · Arrival by 12:00', value: 'In transit' },
        { title: 'NL-2043 · Display kit', detail: 'Confirm the recipient’s delivery address.', value: 'Needs review' },
      ],
      footer: 'Sample operations data · No live shipments.',
    },
    ko: {
      eyebrow: 'NORTHLINE / 운영 현황',
      heading: '오늘의 배송 흐름을 한눈에.',
      body: '준비가 끝난 배송, 이동 중인 배송, 확인이 필요한 배송을 살펴보세요. 팀이 다음 인계를 놓치지 않도록 돕습니다.',
      label: '배송 목록 열기',
      caption: '오늘의 현황 · 09:30 기준',
      sectionHeading: '확인할 배송',
      sectionBody: '진행 중인 배송별로 다음 인계 사항을 확인하세요.',
      metric: '24',
      metricLabel: '오늘 예정된 배송',
      items: [
        { title: 'NL-2041 · 스튜디오 용품', detail: '포장 완료 · 10:00 수거 예정', value: '준비 완료' },
        { title: 'NL-2042 · 인쇄 견본', detail: '배송 기사 인계 완료 · 12:00까지 도착 예정', value: '배송 중' },
        { title: 'NL-2043 · 전시 키트', detail: '받는 사람의 배송 주소를 확인하세요.', value: '확인 필요' },
      ],
      footer: '예시 운영 데이터 · 실제 배송 정보가 아닙니다.',
    },
    ja: {
      eyebrow: 'NORTHLINE / 運用状況',
      heading: '今日の配送を、ひと目で把握。',
      body: '準備済み、配送中、確認待ちの荷物を一覧で確認。チームの次の引き継ぎをスムーズに進めます。',
      label: '配送一覧を開く',
      caption: '本日の状況 · 09:30時点',
      sectionHeading: '確認する配送',
      sectionBody: '進行中の各配送について、次の引き継ぎを確認してください。',
      metric: '24',
      metricLabel: '本日の配送予定',
      items: [
        { title: 'NL-2041 · スタジオ用品', detail: '梱包済み · 10:00集荷予定', value: '準備完了' },
        { title: 'NL-2042 · 印刷サンプル', detail: '配達員に引き渡し済み · 12:00までに到着予定', value: '配送中' },
        { title: 'NL-2043 · 展示キット', detail: '受取人の配送先住所を確認してください。', value: '要確認' },
      ],
      footer: 'サンプル運用データ · 実際の配送情報ではありません。',
    },
  },
  editorial: {
    en: {
      eyebrow: 'COMMON GROUND / ISSUE 08',
      heading: 'Small spaces. Considered ways of living.',
      body: 'Stories about the places we make our own, the objects we keep, and the everyday rituals that bring them to life.',
      label: 'Read the latest issue',
      caption: 'Words, photographs, and a little room to pause.',
      sectionHeading: 'From this issue',
      sectionBody: 'Three perspectives on making more of the space around us.',
      metric: '08',
      metricLabel: 'The small spaces issue',
      items: [
        { title: 'A table by the window', detail: 'How a shared kitchen became the heart of a home.', value: '6 min read' },
        { title: 'Objects worth keeping', detail: 'A ceramicist on repair, patience, and daily use.', value: '4 min read' },
        { title: 'The quiet end of the street', detail: 'A walk through a neighborhood built for people.', value: '8 min read' },
      ],
      footer: 'Sample journal · Stories are for preview.',
    },
    ko: {
      eyebrow: 'COMMON GROUND / 제08호',
      heading: '작은 공간에서 발견하는 사려 깊은 생활.',
      body: '나만의 공간을 만드는 일, 오래 곁에 두는 물건, 일상에 생기를 더하는 작은 습관에 관한 이야기를 전합니다.',
      label: '최신호 읽기',
      caption: '글과 사진, 그리고 잠시 쉬어 갈 여백.',
      sectionHeading: '이번 호의 이야기',
      sectionBody: '주변 공간을 더 풍성하게 누리는 세 가지 시선.',
      metric: '08',
      metricLabel: '작은 공간 특집',
      items: [
        { title: '창가에 놓인 식탁', detail: '함께 쓰는 주방이 집의 중심이 되기까지.', value: '6분 읽기' },
        { title: '오래 간직할 물건', detail: '수선과 기다림, 매일의 쓰임에 관한 도예가의 이야기.', value: '4분 읽기' },
        { title: '골목 끝의 고요함', detail: '사람을 위해 만들어진 동네를 걷다.', value: '8분 읽기' },
      ],
      footer: '예시 저널 · 모든 이야기는 미리보기용입니다.',
    },
    ja: {
      eyebrow: 'COMMON GROUND / 第08号',
      heading: '小さな空間で、暮らしを丁寧に。',
      body: '自分らしい場所、長く大切にするもの、日々に彩りを添える習慣。身近な暮らしの物語を届けます。',
      label: '最新号を読む',
      caption: '言葉と写真、そしてひと息つくための余白。',
      sectionHeading: '今号のストーリー',
      sectionBody: '身のまわりの空間を豊かに楽しむ、3つの視点。',
      metric: '08',
      metricLabel: '小さな空間特集',
      items: [
        { title: '窓辺のテーブル', detail: '共同のキッチンが、住まいの中心になるまで。', value: '読了6分' },
        { title: '長く持ち続けたいもの', detail: '修理と待つ時間、日々の使い方を語る陶芸家。', value: '読了4分' },
        { title: '路地の先の静けさ', detail: '人のためにつくられた街を歩く。', value: '読了8分' },
      ],
      footer: 'サンプルジャーナル · ストーリーはプレビュー用です。',
    },
  },
};

export function getSpecimenCopy(id: SpecimenFixtureId, lang: Lang): SpecimenCopy {
  return fixtures[id][lang];
}
