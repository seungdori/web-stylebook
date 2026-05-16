import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
type LocStr = Record<Lang, string>;

const L = (obj: LocStr, lang: Lang): string => obj[lang];

interface Service {
  id: string;
  code: string;
  color: string;
  label: LocStr;
  title: LocStr;
  meta: LocStr;
  icon: 'brand' | 'web' | 'desktop' | 'mobile';
}

interface ProcessStep {
  no: string;
  title: LocStr;
  body: LocStr;
  signal: LocStr;
}

const COPY = {
  eyebrow: {
    en: 'Fusion 17 / Studio Pixel',
    ko: 'Fusion 17 / Studio Pixel',
    ja: 'Fusion 17 / Studio Pixel',
  },
  titleA: {
    en: 'Build the future',
    ko: '브랜드를 설계하고',
    ja: '未来を設計し',
  },
  titleB: {
    en: 'without losing the pixel.',
    ko: '티켓처럼 정리합니다.',
    ja: 'ピクセルで証明する。',
  },
  lead: {
    en: 'A warm agency page re-cut as a ticket board: oversized type, pixel labels, and shuffled service slips turn the offer into something concrete and memorable.',
    ko: '큰 헤드라인과 픽셀 라벨은 유지하되, 서비스를 티켓 보드처럼 뜯어 붙여서 제안이 바로 보이게 만든 페이지입니다.',
    ja: '大きなプロダクト書体、ピクセルの対位法、オフセットされたサービスタイルで、スタジオを精密で有用に見せる温かいエージェンシーページです。',
  },
  serviceStrip: {
    en: 'Branding / Web / Desktop / Mobile',
    ko: '브랜딩 / 웹 / 데스크톱 / 모바일',
    ja: 'Branding / Web / Desktop / Mobile',
  },
  boardKicker: {
    en: 'Service ticket board',
    ko: '서비스 티켓 보드',
    ja: 'サービスチケットボード',
  },
  boardStatus: {
    en: 'Active brief',
    ko: '현재 정리 중',
    ja: '進行中のブリーフ',
  },
  activeTicket: {
    en: 'Selected ticket',
    ko: '선택된 티켓',
    ja: '選択中のチケット',
  },
  scroll: { en: 'Scroll for process', ko: '진행 방식 보기', ja: 'プロセスへ' },
  locale: { en: 'Seoul, 2026', ko: 'Seoul, 2026', ja: 'Seoul, 2026' },
  manifestKicker: { en: 'Who this style is for', ko: '이 스타일의 쓰임', ja: 'このスタイルの使い方' },
  manifestTitle: {
    en: 'A studio page should sell capability before decoration.',
    ko: '스튜디오 페이지는 예뻐 보이기 전에 할 수 있는 일을 보여줘야 합니다.',
    ja: 'スタジオページは装飾より先に能力を売るべきだ。',
  },
  manifestBody: {
    en: 'Studio Pixel borrows the agency confidence of a huge first viewport, then turns the offer into a working board: four service tickets, one active brief, clear process rows, and a pixel voice used only where it sharpens memory.',
    ko: 'Studio Pixel은 큰 첫 화면의 자신감은 유지하되, 서비스를 작업 보드처럼 보여줍니다. 네 개의 티켓, 현재 정리 중인 제안, 진행 방식, 꼭 필요한 픽셀 라벨로 페이지를 기억에 남게 만듭니다.',
    ja: 'Studio Pixelは巨大なファーストビューのエージェンシー的な自信を借りつつ、提案を具体化します。四つのサービスタイル、ひとつのプロセスレール、明確な技術信号、記憶を鋭くする箇所だけに使うピクセルの声。',
  },
  processKicker: { en: 'From idea to shipped system', ko: '아이디어에서 실제 출시까지', ja: 'アイデアから公開システムまで' },
  processTitle: { en: 'From brief to launch', ko: '기획부터 운영까지', ja: 'ブリーフから公開まで' },
  systemKicker: { en: 'Promptable rules', ko: '프롬프트 규칙', ja: 'プロンプト可能なルール' },
  systemTitle: {
    en: 'Warm canvas, crooked tickets, useful service proof.',
    ko: '따뜻한 배경, 살짝 비뚤어진 티켓, 바로 이해되는 제안.',
    ja: '温かいキャンバス、硬い影、役に立つサービスの証拠。',
  },
  finale: {
    en: 'A studio can be friendly without becoming soft. It can be playful without becoming unserious.',
    ko: '친근해 보여도 가볍지 않고, 개성이 있어도 산만하지 않은 스튜디오 페이지.',
    ja: 'スタジオは親しみやすくても弱くならず、遊び心があっても軽くならない。',
  },
} as const;

const SERVICES: Service[] = [
  {
    id: 'brand',
    code: '01',
    color: '#fff8f3',
    icon: 'brand',
    label: { en: 'Branding', ko: '브랜딩', ja: 'ブランディング' },
    title: { en: 'Identity system', ko: '아이덴티티 시스템', ja: 'アイデンティティ' },
    meta: { en: 'Naming / story / mark', ko: '네이밍 / 스토리 / 로고', ja: '命名 / 物語 / マーク' },
  },
  {
    id: 'web',
    code: '02',
    color: '#d8665a',
    icon: 'web',
    label: { en: 'Web', ko: '웹', ja: 'Web' },
    title: { en: 'Conversion website', ko: '문의로 이어지는 웹사이트', ja: '成果型サイト' },
    meta: { en: 'IA / UI / frontend', ko: 'IA / UI / 프론트엔드', ja: 'IA / UI / フロント' },
  },
  {
    id: 'desktop',
    code: '03',
    color: '#739ed0',
    icon: 'desktop',
    label: { en: 'Desktop app', ko: '데스크톱 앱', ja: 'デスクトップ' },
    title: { en: 'Operational product', ko: '운영 도구', ja: '運用プロダクト' },
    meta: { en: 'API / panels / data', ko: 'API / 관리자 화면 / 데이터', ja: 'API / パネル / データ' },
  },
  {
    id: 'mobile',
    code: '04',
    color: '#36a3a5',
    icon: 'mobile',
    label: { en: 'Mobile app', ko: '모바일 앱', ja: 'モバイル' },
    title: { en: 'Pocket workflow', ko: '모바일 워크플로우', ja: '手の中のワークフロー' },
    meta: { en: 'Prototype / iOS / Android', ko: '프로토타입 / iOS / Android', ja: '試作 / iOS / Android' },
  },
];

const PROCESS: ProcessStep[] = [
  {
    no: '01',
    title: { en: 'Discover the business pressure', ko: '먼저 문제부터 정확히 잡기', ja: '事業上の圧力を見つける' },
    body: {
      en: 'Start with market, audience, and conversion constraints. The page should feel designed after listening, not after browsing moodboards.',
      ko: '시장, 고객, 전환 목표를 먼저 확인합니다. 무드보드를 먼저 고르는 대신, 어떤 문제를 해결해야 하는지부터 정리합니다.',
      ja: '市場、対象、コンバージョン制約から始めます。ムードボードではなく、話を聞いた後に作られたページに見せます。',
    },
    signal: { en: 'Research / offer map', ko: '리서치 / 목표 정리', ja: '調査 / 提案地図' },
  },
  {
    no: '02',
    title: { en: 'Design a memorable service surface', ko: '기억에 남는 서비스 카드 만들기', ja: '記憶に残るサービス面を作る' },
    body: {
      en: 'Use color as a service identifier, not atmosphere. Each slab needs a role, an icon, and a visible boundary.',
      ko: '컬러는 분위기용이 아니라 서비스 구분용으로 씁니다. 각 카드는 역할, 아이콘, 경계가 분명해야 합니다.',
      ja: '色は雰囲気ではなくサービス識別子として使います。各タイルには役割、アイコン、見える境界が必要です。',
    },
    signal: { en: 'Cards / type / proof', ko: '카드 / 타이포 / 근거', ja: 'カード / 書体 / 証拠' },
  },
  {
    no: '03',
    title: { en: 'Build the product truth', ko: '실제로 만들 수 있는 흐름 보여주기', ja: 'プロダクトの実在感を作る' },
    body: {
      en: 'Show a process, not a promise. Panels, milestones, and constraints should make the studio feel ready to ship.',
      ko: '말로만 약속하지 않고 진행 방식을 보여줍니다. 화면 구성, 일정, QA 기준이 함께 보여야 출시까지 맡길 수 있다는 신뢰가 생깁니다.',
      ja: '約束ではなくプロセスを見せます。パネル、マイルストーン、制約で公開できるスタジオに見せます。',
    },
    signal: { en: 'Prototype / QA / handoff', ko: '프로토타입 / QA / 인계', ja: '試作 / QA / 引き渡し' },
  },
  {
    no: '04',
    title: { en: 'Support after the launch', ko: '출시 이후까지 이어가기', ja: '公開後まで支える' },
    body: {
      en: 'The final section needs continuity: maintenance, iteration, analytics, and the next product loop.',
      ko: '출시 후에는 유지보수, 개선, 분석이 이어져야 합니다. 다음 업데이트까지 자연스럽게 이어지는 구조를 잡습니다.',
      ja: '最後のセクションには保守、改善、分析、次のプロダクトループまで続く連続性が必要です。',
    },
    signal: { en: 'Care / analytics / iteration', ko: '운영 / 분석 / 개선', ja: '運用 / 分析 / 改善' },
  },
];

const RULES: Record<Lang, string[]> = {
  en: [
    'Use one warm page background and no full-screen gradient.',
    'Set the first line in a rounded agency sans; reserve pixel type for the second-line memory punch and counters.',
    'Make service cards tactile: black outline, hard offset shadow, stable aspect ratio.',
    'Every colored slab must represent a service or state. No decorative color blobs.',
    'Motion should be small: reveal, lift, and active process marker only.',
  ],
  ko: [
    '페이지 배경은 따뜻한 단색 하나로 잡고 전체 화면 그라데이션을 쓰지 않습니다.',
    '첫 줄은 둥근 산세리프로 크게 잡고, 픽셀 폰트는 티켓 번호와 짧은 라벨에만 씁니다.',
    '서비스는 가지런한 카드가 아니라 작업 보드에 붙은 티켓처럼 배치합니다.',
    '찢김선, 반투명 테이프, 선택된 티켓 스트립처럼 작은 물성 장치를 넣습니다.',
    '컬러는 반드시 서비스나 상태를 구분하는 역할을 해야 합니다. 장식용 색 덩어리는 금지합니다.',
    '모션은 등장, 티켓 리프트, 현재 단계 표시 정도로 작게 유지합니다.',
  ],
  ja: [
    'ページ背景は温かい単色にし、全画面グラデーションを使わない。',
    '一行目は丸みのあるエージェンシー系サンセリフ、ピクセル書体は二行目と番号だけに使う。',
    'サービスタイルは黒い外枠、硬いオフセット影、安定した比率で触覚的にする。',
    '色の面は必ずサービスまたは状態を表す。装飾だけの色の塊は禁止。',
    '動きは表示、リフト、アクティブなプロセスマーカーだけに抑える。',
  ],
};

const PROMPTS: Record<Lang, string> = {
  en: `Design a single-page landing in Studio Pixel fusion style: warm agency confidence plus pixel countertype and tactile service slabs.

REFERENCE INTERPRETATION:
Use the spirit of a modern European digital studio page: huge centered headline, warm cream canvas, four service tiles, pixel utility type, hard black offset shadows, and a process section. Do not copy any logo, wording, or exact layout from a reference site.

TOKENS:
--spx-bg #FFF4EE
--spx-ink #080604
--spx-red #CF493C
--spx-teal #2F8B8E
--spx-blue #6D98CA
--spx-line #080604
--spx-paper #FFFDF9

TYPOGRAPHY:
Main headline: rounded agency sans such as Sora or Plus Jakarta Sans, 700-800.
Pixel line: Jersey 20, Pixelify Sans, or a bitmap display face. Use it only for the second headline line, counters, and a few labels.
Body: clean product sans, 400-520.

LAYOUT:
1) Warm empty hero with centered oversized headline. First line smooth, second line pixel.
2) Four tactile service cards under the headline: Branding, Web, Desktop App, Mobile App. Each card has black border, hard offset shadow, service color, small icon, code, and metadata.
3) Manifest section with a huge statement and one compact explanatory paragraph.
4) Process section with a sticky pixel title/step rail on the left and four clean content rows on the right.
5) Rules/finale section proving how to reuse the style.

MOTION:
Small reveal on load, card lift through transform + offset-shadow, IntersectionObserver active process marker. No decorative looping motion.

RESPONSIVE:
Desktop keeps the first viewport airy. Mobile stacks cards in two columns or one column, reduces headline through breakpoints, and keeps all text inside cards.`,
  ko: `Studio Pixel 퓨전 스타일의 단일 랜딩 페이지를 디자인하세요. 따뜻한 스튜디오 분위기, 픽셀 느낌의 보조 타이포, 작업 보드에 붙은 서비스 티켓을 결합합니다.

레퍼런스 해석:
현대적인 디지털 스튜디오 페이지의 느낌만 참고합니다. 큰 헤드라인, 따뜻한 크림 배경, 픽셀 느낌의 라벨, 살짝 밀린 검은 그림자, 진행 방식 소개 섹션은 유지하되, 첫 화면은 비대칭 서비스 티켓 보드로 재구성합니다. 특정 로고, 문구, 정확한 레이아웃은 복제하지 않습니다.

토큰:
--spx-bg #FFF4EE
--spx-ink #080604
--spx-red #CF493C
--spx-teal #2F8B8E
--spx-blue #6D98CA
--spx-line #080604
--spx-paper #FFFDF9

타이포:
메인 헤드라인: Sora 또는 Plus Jakarta Sans 같은 둥근 산세리프 700-800.
픽셀 보조 라인: Jersey 20, Pixelify Sans, bitmap display face. 두 번째 헤드라인 줄, 숫자, 일부 라벨에만 사용.
본문: 깔끔한 제품용 산세리프 400-520.

레이아웃:
1) 왼쪽에는 큰 헤드라인과 설명, 오른쪽에는 작업 보드처럼 보이는 서비스 티켓 묶음.
2) 서비스 티켓 네 개: Branding, Web, Desktop App, Mobile App. 검은 테두리, 살짝 밀린 검은 그림자, 서비스별 색상, 작은 아이콘, 코드, 간단한 설명을 포함.
3) 티켓에는 찢김선, 작은 테이프, 선택된 티켓을 보여주는 하단 스트립을 둡니다.
4) 큰 선언문과 짧은 설명 문단이 있는 소개 섹션.
5) 왼쪽에는 스크롤 중 고정되는 픽셀 타이틀과 단계 표시, 오른쪽에는 네 개의 설명 블록.
6) 재사용 규칙과 마무리 섹션.

모션:
로드 시 짧은 등장 애니메이션, 카드 리프트, 현재 단계 표시만 사용. 장식용 루프 모션은 금지.

반응형:
데스크톱은 첫 화면의 여백을 유지합니다. 모바일에서는 카드를 2열 또는 1열로 쌓고, 헤드라인은 반응형 기준점에 맞춰 줄이며, 모든 텍스트가 카드 안에 들어가야 합니다.`,
  ja: `Studio Pixel融合スタイルの単一ランディングページを設計してください。温かいエージェンシーの自信、ピクセルの対位書体、触覚的なサービスタイルを組み合わせます。

参照の解釈:
現代的なデジタルスタジオページの精神だけを使います。巨大な中央見出し、温かいクリームのキャンバス、四つのサービスタイル、ピクセルUI書体、黒いオフセット影、プロセスセクション。特定のロゴ、文言、正確なレイアウトはコピーしません。

トークン:
--spx-bg #FFF4EE
--spx-ink #080604
--spx-red #CF493C
--spx-teal #2F8B8E
--spx-blue #6D98CA
--spx-line #080604
--spx-paper #FFFDF9

タイポグラフィ:
メイン見出し: Sora または Plus Jakarta Sans のような丸みのあるサンセリフ 700-800。
ピクセル行: Jersey 20、Pixelify Sans、bitmap display face。二行目、番号、一部ラベルだけに使用。
本文: 読みやすいプロダクトサンセリフ 400-520。

レイアウト:
1) 温かく余白のあるヒーロー。第一行は滑らかに、第二行はピクセルで。
2) 見出し下に四つのサービスカード: Branding、Web、Desktop App、Mobile App。黒い枠、硬いオフセット影、サービス色、小さなアイコン、コード、メタ。
3) 大きな宣言文と短い説明文のマニフェスト。
4) 左にstickyなピクセルタイトル/ステップレール、右に四つのコンテンツ行。
5) 再利用ルールとフィナーレ。

モーション:
短い表示、カードリフト、IntersectionObserverのアクティブマーカーのみ。装飾的なループモーションは禁止。

レスポンシブ:
デスクトップではファーストビューの余白を保つ。モバイルではカードを2列または1列にし、見出しはブレークポイントでのみ縮小し、すべてのテキストをカード内に収める。`,
};

export function PortedFusionStudioPixelPage({ lang }: PortedStylePageProps) {
  const lng = lang as Lang;
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activeService, setActiveService] = useState(SERVICES[1].id);
  const activeServiceData = SERVICES.find((service) => service.id === activeService) || SERVICES[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-spx-step]'));
    if (steps.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActiveStep(Number((visible.target as HTMLElement).dataset.spxStep || 0));
      },
      { rootMargin: '-38% 0px -44%', threshold: [0.1, 0.35, 0.6] },
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <FusionShell
      fusionId="fusion-studio-pixel"
      lang={lng}
      prev={{ href: '/pages/fusion-soft-inflate.html', label: 'Soft Inflate' }}
      prompts={PROMPTS}
    >
      <div className="spx-page" ref={rootRef}>
        <section className="spx-hero" aria-labelledby="spx-hero-title">
          <div className="spx-hero__top">
            <span>{L(COPY.eyebrow, lng)}</span>
            <span>{L(COPY.locale, lng)}</span>
          </div>

          <div className="spx-hero__workbench">
            <div className="spx-hero__copy">
              <p className="spx-service-strip">{L(COPY.serviceStrip, lng)}</p>
              <h1 id="spx-hero-title">
                <span>{L(COPY.titleA, lng)}</span>
                <span className="spx-pixel">{L(COPY.titleB, lng)}</span>
              </h1>
              <p className="spx-hero__lead">{L(COPY.lead, lng)}</p>
              <div className="spx-hero__bottom">
                <span>{L(COPY.scroll, lng)}</span>
                <span className="spx-pixel">F17 / PX</span>
              </div>
            </div>

            <aside className="spx-ticket-wall" aria-label={L(COPY.boardKicker, lng)}>
              <span className="spx-ticket-wall__tape spx-ticket-wall__tape--left" aria-hidden="true" />
              <span className="spx-ticket-wall__tape spx-ticket-wall__tape--right" aria-hidden="true" />
              <div className="spx-ticket-wall__stamp" aria-hidden="true">
                <span>{L(COPY.boardStatus, lng)}</span>
                <strong className="spx-pixel">F17</strong>
              </div>
              <div className="spx-ticket-wall__rail" aria-hidden="true">
                <span>STUDIO</span>
                <span>PIXEL</span>
                <span>BOARD</span>
              </div>
              <p className="spx-ticket-wall__kicker">{L(COPY.boardKicker, lng)}</p>
              <div className="spx-service-grid" aria-label={L(COPY.serviceStrip, lng)}>
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className={`spx-card ${activeService === service.id ? 'is-active' : ''}`}
                    style={{ '--spx-card-color': service.color } as CSSProperties}
                    aria-pressed={activeService === service.id}
                    onMouseEnter={() => setActiveService(service.id)}
                    onFocus={() => setActiveService(service.id)}
                    onClick={() => setActiveService(service.id)}
                  >
                    <span className="spx-card__label">{L(service.label, lng)}</span>
                    <span className={`spx-icon spx-icon--${service.icon}`} aria-hidden="true" />
                    <strong>{L(service.title, lng)}</strong>
                    <span className="spx-card__meta">
                      <i />
                      {service.code} / {L(service.meta, lng)}
                    </span>
                  </button>
                ))}
              </div>
              <div
                className="spx-ticket-wall__active"
                style={{ '--spx-active-color': activeServiceData.color } as CSSProperties}
              >
                <span>{L(COPY.activeTicket, lng)}</span>
                <strong>{activeServiceData.code} / {L(activeServiceData.title, lng)}</strong>
                <em>{L(activeServiceData.meta, lng)}</em>
              </div>
            </aside>
          </div>
        </section>

        <section className="spx-manifest" aria-labelledby="spx-manifest-title">
          <p className="spx-kicker">{L(COPY.manifestKicker, lng)}</p>
          <h2 id="spx-manifest-title">{L(COPY.manifestTitle, lng)}</h2>
          <p>{L(COPY.manifestBody, lng)}</p>
        </section>

        <section className="spx-process" aria-labelledby="spx-process-title">
          <div className="spx-process__rail">
            <p className="spx-kicker">{L(COPY.processKicker, lng)}</p>
            <h2 id="spx-process-title" className="spx-pixel">{L(COPY.processTitle, lng)}</h2>
            <div className="spx-step-tabs" aria-hidden="true">
              {PROCESS.map((step, index) => (
                <span key={step.no} className={activeStep === index ? 'is-active' : ''}>{step.no}</span>
              ))}
            </div>
          </div>

          <div className="spx-process__list">
            {PROCESS.map((step, index) => (
              <article key={step.no} className="spx-step" data-spx-step={index}>
                <span className="spx-step__no">{step.no}</span>
                <div>
                  <p className="spx-step__signal">{L(step.signal, lng)}</p>
                  <h3>{L(step.title, lng)}</h3>
                  <p>{L(step.body, lng)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="spx-system" aria-labelledby="spx-system-title">
          <div>
            <p className="spx-kicker">{L(COPY.systemKicker, lng)}</p>
            <h2 id="spx-system-title">{L(COPY.systemTitle, lng)}</h2>
          </div>
          <ul className="spx-rules">
            {RULES[lng].map((rule, index) => (
              <li key={rule}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        <section className="spx-finale" aria-label="Studio Pixel finale">
          <p>{L(COPY.finale, lng)}</p>
          <div className="spx-finale__stamp">
            <span>Studio Pixel</span>
            <strong className="spx-pixel">READY / F17</strong>
          </div>
        </section>
      </div>
    </FusionShell>
  );
}
