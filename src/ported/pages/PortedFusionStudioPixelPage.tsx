import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionStudioPixelPage.css';

// The page of Oktop, an eleven-person design and engineering studio in Mapo, Seoul, in the
// Studio Pixel style. Readex Pro (on its HEXP axis) says what the studio says; Jersey 10, the
// low-resolution cut of a sports-shirt numeral, sets every number the studio commits to:
// weeks, dates, prices, years and results, and the second line of the headline.
// Components come from the studio's own working surface: the board of taped job tickets
// (colour = kind of work), a scope sheet on a 20-week ruler, a project track, a price ladder
// beside a quote that was sent, a work index, and the slot calendar with the brief form.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type KindId = 'brand' | 'web' | 'desk' | 'mob';

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const NAME = 'Oktop';
const EMAIL = 'hello@oktop.studio';
const PHONE = '+82 2 3142 0716';

const HEAD = {
  nav: { en: 'Oktop', ko: 'Oktop', ja: 'Oktop' },
  services: { en: 'Services', ko: '서비스', ja: 'サービス' },
  process: { en: 'Process', ko: '진행 과정', ja: '進め方' },
  prices: { en: 'Prices', ko: '요금', ja: '料金' },
  work: { en: 'Work', ko: '작업', ja: '実績' },
  start: { en: 'Start a project', ko: '프로젝트 시작하기', ja: 'プロジェクトを始める' },
} satisfies Record<string, Tri>;

const HERO = {
  strip: {
    en: 'Branding / Websites / Desktop apps / Mobile apps',
    ko: '브랜딩 / 웹사이트 / 데스크톱 앱 / 모바일 앱',
    ja: 'ブランディング / ウェブサイト / デスクトップアプリ / モバイルアプリ',
  },
  // Korean and Japanese read the audience first, as their headlines would; the lines keep their faces.
  titleA: { en: 'Brands, sites and apps', ko: '5~50명 팀을 위한', ja: '5〜50人のチームのための' },
  titleB: { en: 'for teams of 5 to 50.', ko: '브랜드, 사이트, 앱', ja: 'ブランド、サイト、アプリ' },
  lede: {
    en: 'Oktop is eleven designers and engineers in a rooftop office in Mapo, Seoul. We run up to six projects at a time and stay with each one from the first logo sketch to the app in the store.',
    ko: 'Oktop은 서울 마포구 옥상 사무실에서 일하는 디자이너와 엔지니어 11명의 스튜디오입니다. 한 번에 최대 여섯 개 프로젝트를 진행하며, 첫 로고 스케치부터 앱이 스토어에 올라가는 순간까지 각 프로젝트를 끝까지 함께합니다.',
    ja: 'Oktopは、ソウル麻浦区の屋上オフィスで働く、デザイナーとエンジニア11名のスタジオです。同時に進めるプロジェクトは最大6件。最初のロゴ案から、アプリがストアに並ぶまで、一件ずつ最後まで担当します。',
  },
  prices: { en: 'See prices', ko: '요금 보기', ja: '料金を見る' },
} satisfies Record<string, Tri>;

const BOARD = {
  rail: { en: 'On the board, week 47', ko: '작업 보드, 47주차', ja: '作業ボード、47週目' },
  nextStart: { en: 'Next start', ko: '다음 시작', ja: '次の開始日' },
  nextDate: { en: '12 Jan', ko: '1월 12일', ja: '1月12日' },
  weeks: { en: 'weeks', ko: '주', ja: '週' },
  weekOf: { en: 'week {done} of {total}', ko: '{total}주 중 {done}주차', ja: '全{total}週のうち{done}週目' },
  next: { en: 'Next on {client}', ko: '{client} 다음 일정', ja: '{client}の次の作業' },
  announce: { en: '{date}: {news}', ko: '{date} 소식: {news}', ja: '{date}：{news}' },
} satisfies Record<string, Tri>;

const KIND_NAMES: Record<KindId, Tri> = {
  brand: { en: 'Branding', ko: '브랜딩', ja: 'ブランディング' },
  web: { en: 'Website', ko: '웹사이트', ja: 'ウェブサイト' },
  desk: { en: 'Desktop app', ko: '데스크톱 앱', ja: 'デスクトップアプリ' },
  mob: { en: 'Mobile app', ko: '모바일 앱', ja: 'モバイルアプリ' },
};

interface Ticket {
  id: string;
  kind: KindId;
  client: string;
  done: number;
  total: number;
  what: Tri;
  date: Tri;
  news: Tri;
}

const TICKETS: Ticket[] = [
  {
    id: 'oda',
    kind: 'brand',
    client: 'Oda Bakery',
    done: 4,
    total: 6,
    what: { en: 'Name, logo and boxes for three shops', ko: '3개 매장의 이름, 로고, 상자', ja: '3店舗の店名、ロゴ、箱' },
    date: { en: '4 Dec', ko: '12월 4일', ja: '12月4日' },
    news: {
      en: 'Oda Bakery’s cake boxes go to the printer. Ji‑woo Han leads the identity.',
      ko: 'Oda Bakery의 케이크 상자가 인쇄소로 넘어갑니다. 한지우가 아이덴티티 작업을 이끕니다.',
      ja: 'Oda Bakeryのケーキ箱が印刷に回ります。ハン・ジウがアイデンティティを担当しています。',
    },
  },
  {
    id: 'haru',
    kind: 'web',
    client: 'Haru Dental',
    done: 7,
    total: 10,
    what: { en: 'Booking site in Korean and English', ko: '한국어와 영어로 된 예약 사이트', ja: '韓国語と英語の予約サイト' },
    date: { en: '9 Dec', ko: '12월 9일', ja: '12月9日' },
    news: {
      en: 'Haru Dental’s booking site goes live. Seo‑yeon Kim leads the design.',
      ko: 'Haru Dental의 예약 사이트가 공개됩니다. 김서연이 디자인을 이끕니다.',
      ja: 'Haru Dentalの予約サイトが公開されます。キム・ソヨンがデザインを担当しています。',
    },
  },
  {
    id: 'linefeed',
    kind: 'desk',
    client: 'Linefeed',
    done: 11,
    total: 16,
    what: { en: 'Version 3 of their invoicing app', ko: '청구서 앱 3.0 버전', ja: '請求書アプリ バージョン3' },
    date: { en: '15 Dec', ko: '12월 15일', ja: '12月15日' },
    news: {
      en: 'Linefeed’s beta goes out to 40 customers. Tae‑hoon Park leads the build.',
      ko: 'Linefeed의 베타판이 고객 40곳에 배포됩니다. 박태훈이 개발을 이끕니다.',
      ja: 'Linefeedのベータ版が顧客40社に届きます。パク・テフンが開発を担当しています。',
    },
  },
  {
    id: 'bom',
    kind: 'mob',
    client: 'Bom Bikes',
    done: 2,
    total: 14,
    what: { en: 'Rental app for iOS and Android', ko: 'iOS와 안드로이드용 자전거 대여 앱', ja: 'iOS・Android向け自転車レンタルアプリ' },
    date: { en: '26 Nov', ko: '11월 26일', ja: '11月26日' },
    news: {
      en: 'Bom Bikes reviews the first two directions. Hana Yoon leads the design.',
      ko: 'Bom Bikes가 첫 두 가지 시안을 검토합니다. 윤하나가 디자인을 이끕니다.',
      ja: 'Bom Bikesが最初の2案を検討中です。ユン・ハナがデザインを担当しています。',
    },
  },
];

/** A row of square cells: `filled` solid, then `range` hatched, then empty, `total` in all. */
function Cells({ total, filled, range = 0, now }: { total: number; filled: number; range?: number; now?: number }) {
  return (
    <span className="ok-cells" style={{ '--n': total } as CSSProperties} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => {
        const state = index === now ? 'is-now' : index < filled ? 'is-f' : index < filled + range ? 'is-r' : undefined;
        return <i key={index} className={state} />;
      })}
    </span>
  );
}

/** Jersey 10 has no won sign, so it is set apart in the text face. */
function Money({ value }: { value: string }) {
  return (
    <>
      {value.split('₩').flatMap((part, index) => (index === 0 ? [part] : [<span key={index} className="ok-won">₩</span>, part]))}
    </>
  );
}

const SERVICES = {
  title: { en: 'What we make', ko: '저희가 만드는 것', ja: '手がける分野' },
  note: {
    en: 'Four kinds of work. Most clients come for one of them and return for a second within two years. Each bar counts the weeks a project usually takes.',
    ko: '작업은 네 가지입니다. 대부분의 고객은 그중 한 가지로 찾아와 2년 안에 다시 의뢰합니다. 각 막대는 프로젝트가 보통 걸리는 주 수를 나타냅니다.',
    ja: '手がける仕事は4種類です。ほとんどのお客様は、そのうち1つでご依頼いただき、2年以内にまたご相談をくださいます。各バーは、プロジェクトが通常かかる週数を示しています。',
  },
  weeks: { en: 'weeks', ko: '주', ja: '週' },
  rows: [
    {
      kind: 'brand' as KindId,
      name: { en: 'Branding', ko: '브랜딩', ja: 'ブランディング' },
      body: {
        en: 'Name check, logo, type and colours, packaging or signage, and a guide your own team can follow.',
        ko: '네이밍 검토, 로고, 서체와 색상, 패키지나 간판, 그리고 고객사 팀이 그대로 따를 수 있는 가이드를 만듭니다.',
        ja: '命名の確認、ロゴ、書体と配色、パッケージやサイン、そして御社のチームがそのまま使えるガイドを作成します。',
      },
      from: 6,
      to: 8,
    },
    {
      kind: 'web' as KindId,
      name: { en: 'Websites', ko: '웹사이트', ja: 'ウェブサイト' },
      body: {
        en: 'Page structure, copy editing, design, and a build on a CMS your team can update. Korean and English as standard.',
        ko: '페이지 구조, 원고 편집, 디자인, 그리고 고객사 팀이 직접 수정할 수 있는 CMS로 구축합니다. 한국어와 영어를 기본으로 합니다.',
        ja: 'ページ構成、原稿編集、デザイン、そして御社のチームが更新できるCMSでの構築まで。日本語と英語を標準で対応します。',
      },
      from: 8,
      to: 12,
    },
    {
      kind: 'desk' as KindId,
      name: { en: 'Desktop apps', ko: '데스크톱 앱', ja: 'デスクトップアプリ' },
      body: {
        en: 'Internal tools and paid apps for Mac and Windows, with sign-in, payments and automatic updates.',
        ko: 'Mac과 Windows용 사내 도구와 유료 앱. 로그인, 결제, 자동 업데이트를 포함합니다.',
        ja: 'Mac・Windows向けの社内ツールと有料アプリ。ログイン、決済、自動アップデートに対応します。',
      },
      from: 12,
      to: 20,
    },
    {
      kind: 'mob' as KindId,
      name: { en: 'Mobile apps', ko: '모바일 앱', ja: 'モバイルアプリ' },
      body: {
        en: 'One codebase for iOS and Android, the store listings, and the first two updates after launch.',
        ko: 'iOS와 안드로이드를 하나의 코드베이스로 개발하고, 스토어 등록 정보와 출시 후 첫 두 번의 업데이트까지 맡습니다.',
        ja: 'iOSとAndroidを1つのコードベースで開発し、ストアの掲載情報と、公開後最初の2回のアップデートまで担当します。',
      },
      from: 10,
      to: 16,
    },
  ],
};

const RULER = [1, 5, 10, 15, 20];

const PROCESS = {
  title: { en: 'How a project runs', ko: '프로젝트가 진행되는 방식', ja: 'プロジェクトの進め方' },
  note: {
    en: 'Every project goes through the same four steps. This is the Haru Dental website, ten weeks long. Apps spend more time in step 3.',
    ko: '모든 프로젝트는 같은 네 단계를 거칩니다. 아래는 10주가 걸린 Haru Dental 웹사이트입니다. 앱은 3단계에 더 많은 시간을 씁니다.',
    ja: 'すべてのプロジェクトは、同じ4つのステップで進みます。以下は10週間かかったHaru Dentalのウェブサイトです。アプリは3番目のステップにより多くの時間をかけます。',
  },
  track: { en: 'Haru Dental website, ten weeks', ko: 'Haru Dental 웹사이트, 10주', ja: 'Haru Dentalのウェブサイト、10週間' },
  nowSr: { en: ', now in week 7', ko: ', 현재 7주차', ja: '、現在7週目' },
  nowLead: { en: 'This is week 7.', ko: '지금은 7주차입니다.', ja: '現在は7週目です。' },
  nowBody: { en: 'The engineers are building the booking flow.', ko: '엔지니어들이 예약 흐름을 만들고 있습니다.', ja: 'エンジニアが予約の流れを構築しています。' },
  youGet: { en: 'You get', ko: '받는 것', ja: 'お渡しするもの' },
  track4: [
    { weeks: { en: 'Week 1', ko: '1주차', ja: '1週目' }, total: 1, filled: 1 },
    { weeks: { en: 'Weeks 2–4', ko: '2–4주차', ja: '2〜4週目' }, total: 3, filled: 3 },
    { weeks: { en: 'Weeks 5–9', ko: '5–9주차', ja: '5〜9週目' }, total: 5, filled: 2, now: 2 },
    { weeks: { en: 'Week 10', ko: '10주차', ja: '10週目' }, total: 1, filled: 0 },
  ],
  steps: [
    {
      name: { en: 'Kickoff', ko: '킥오프', ja: 'キックオフ' },
      length: { en: '1 week', ko: '1주', ja: '1週間' },
      body: {
        en: 'Two half-day workshops at our office or yours. We meet the people who will use what we make and agree on scope, budget and a launch date.',
        ko: '저희 사무실이나 고객사 사무실에서 반나절짜리 워크숍을 두 번 엽니다. 결과물을 쓸 사람들을 만나 범위, 예산, 출시일을 함께 정합니다.',
        ja: '当社または御社のオフィスで、半日のワークショップを2回行います。制作物を使われる方々とお会いし、範囲、予算、公開日を決めます。',
      },
      get: { en: 'a two-page brief and a fixed quote.', ko: '두 페이지짜리 브리프와 확정 견적.', ja: '2ページのブリーフと確定見積もり。' },
    },
    {
      name: { en: 'Design', ko: '디자인', ja: 'デザイン' },
      length: { en: '3 to 5 weeks', ko: '3~5주', ja: '3〜5週間' },
      body: {
        en: 'Two directions in the first fortnight, then we develop one. We review together every Thursday at 10:00, here or on a call.',
        ko: '첫 2주 동안 두 가지 방향을 제안하고, 그중 하나를 발전시킵니다. 매주 목요일 10시에 저희 사무실이나 통화로 함께 검토합니다.',
        ja: '最初の2週間で2つの方向性を提案し、その後1つを発展させます。毎週木曜日10時に、当社または通話で一緒にレビューします。',
      },
      get: { en: 'approved screens and a prototype you can click through.', ko: '승인된 화면과 직접 눌러 볼 수 있는 프로토타입.', ja: '承認済みの画面と、実際に操作できるプロトタイプ。' },
    },
    {
      name: { en: 'Build', ko: '개발', ja: '開発' },
      length: { en: '4 to 12 weeks', ko: '4~12주', ja: '4〜12週間' },
      body: {
        en: 'Every Friday the engineers send a link to the working build. You test it on your own phone and laptop.',
        ko: '매주 금요일, 엔지니어가 동작하는 빌드 링크를 보냅니다. 고객사는 자신의 휴대폰과 노트북에서 직접 테스트합니다.',
        ja: '毎週金曜日、エンジニアが動作するビルドのリンクをお送りします。御社のスマートフォンとノートパソコンで直接テストいただけます。',
      },
      get: { en: 'the finished site or app, tested on 14 devices.', ko: '완성된 사이트 또는 앱, 기기 14대에서 테스트 완료.', ja: '完成したサイトまたはアプリ。14台の端末で動作確認済み。' },
    },
    {
      name: { en: 'Launch and care', ko: '출시와 사후 관리', ja: '公開とアフターケア' },
      length: { en: 'Launch day and 30 days', ko: '출시일과 30일', ja: '公開日と30日間' },
      body: {
        en: 'We launch with you, then fix anything that breaks in the first 30 days at no charge.',
        ko: '출시를 함께 진행하고, 출시 후 30일 안에 생기는 문제는 무상으로 수정합니다.',
        ja: '公開作業をご一緒し、公開後30日以内に不具合が出た場合は無償で修正します。',
      },
      get: { en: 'the source code, the design files and every password.', ko: '소스 코드, 디자인 파일, 모든 비밀번호.', ja: 'ソースコード、デザインファイル、すべてのパスワード。' },
    },
  ],
};

const PRICES = {
  title: { en: 'Three ways to work with us', ko: '함께 일하는 세 가지 방식', ja: 'ご依頼の3つの方法' },
  note: {
    en: 'Prices are in Korean won and exclude VAT. Every project starts with a kickoff, ₩3M, which comes off the price if you go ahead with us.',
    ko: '가격은 원화(₩) 기준이며 부가세는 제외합니다. 모든 프로젝트는 킥오프 ₩3M으로 시작하며, 본 프로젝트를 진행하시면 이 금액을 총액에서 차감합니다.',
    ja: '料金は韓国ウォン建てで、消費税は含みません。すべてのプロジェクトはキックオフ（₩3M）から始まり、そのまま進める場合はこの金額を料金から差し引きます。',
  },
  fixed: { en: 'Fixed project', ko: '고정 가격 프로젝트', ja: '固定価格プロジェクト' },
  fixedBody: {
    en: 'Scope and price are fixed after the kickoff. You pay in three parts: at the start, after design, and at launch.',
    ko: '킥오프 후 범위와 가격이 확정됩니다. 결제는 세 번에 나눠 진행합니다. 시작할 때, 디자인이 끝났을 때, 출시할 때 각각 냅니다.',
    ja: 'キックオフ後に範囲と料金が確定します。お支払いは3回に分けていただきます。着手時、デザイン完了時、公開時です。',
  },
  ladder: { en: 'Fixed project prices', ko: '고정 가격 프로젝트 요금', ja: '固定価格プロジェクトの料金' },
  team: { en: 'Monthly team', ko: '월간 팀', ja: '月額チーム' },
  teamBody: {
    en: 'One designer and one engineer, four days a week, for three months or more. For products that change every month.',
    ko: '디자이너 1명과 엔지니어 1명이 주 4일, 3개월 이상 함께합니다. 매달 바뀌는 제품을 위한 방식입니다.',
    ja: 'デザイナー1名とエンジニア1名が、週4日、3か月以上参加します。毎月変わるプロダクトのための形です。',
  },
  care: { en: 'Care plan', ko: '케어 플랜', ja: 'ケアプラン' },
  careBody: {
    en: 'Up to 12 hours a month of fixes and small changes after launch. We reply within one working day.',
    ko: '출시 후 수정과 작은 변경을 월 최대 12시간까지 처리합니다. 영업일 기준 하루 안에 답변합니다.',
    ja: '公開後の修正と小さな変更を、月12時間まで対応します。営業日1日以内にご返信します。',
  },
  aMonth: { en: 'a month', ko: '월', ja: '月' },
  quoteLabel: { en: 'A quote we sent', ko: '발송한 견적', ja: '送付した見積もり' },
  sent: { en: 'Sent 2 September 2026', ko: '2026년 9월 2일 발송', ja: '2026年9月2日送付' },
  accepted: { en: 'Accepted 9 September', ko: '9월 9일 승인', ja: '9月9日承認' },
  quoteTitle: { en: 'Haru Dental, booking website', ko: 'Haru Dental, 예약 웹사이트', ja: 'Haru Dental、予約ウェブサイト' },
  pay: {
    en: '₩14.8M on signing, ₩11.1M when design is approved, ₩11.1M at launch.',
    ko: '계약 시 ₩14.8M, 디자인 승인 시 ₩11.1M, 출시 시 ₩11.1M.',
    ja: '契約時 ₩14.8M、デザイン承認時 ₩11.1M、公開時 ₩11.1M。',
  },
} satisfies Record<string, Tri>;

const LADDER: Array<{ kind: KindId; price: string }> = [
  { kind: 'brand', price: '₩18–30M' },
  { kind: 'web', price: '₩30–60M' },
  { kind: 'mob', price: '₩60–140M' },
  { kind: 'desk', price: '₩70–160M' },
];

const QUOTE: Array<{ item: Tri; amount: string }> = [
  { item: { en: 'Kickoff, two workshops', ko: '킥오프, 워크숍 2회', ja: 'キックオフ、ワークショップ2回' }, amount: '₩3,000,000' },
  { item: { en: 'Design, 3 weeks', ko: '디자인, 3주', ja: 'デザイン、3週間' }, amount: '₩12,000,000' },
  { item: { en: 'Build, 5 weeks', ko: '개발, 5주', ja: '開発、5週間' }, amount: '₩21,000,000' },
  { item: { en: 'Launch and 30 days of fixes', ko: '출시와 30일 수정', ja: '公開と30日間の修正' }, amount: '₩4,000,000' },
  { item: { en: 'Kickoff credit', ko: '킥오프 차감', ja: 'キックオフ分の差し引き' }, amount: '−₩3,000,000' },
];

const QUOTE_TOTAL = { item: { en: 'Total, before VAT', ko: '합계 (부가세 제외)', ja: '合計（消費税別）' }, amount: '₩37,000,000' };

const WORK = {
  title: { en: 'Selected work', ko: '선정 작업', ja: '主な実績' },
  note: {
    en: 'Thirty-one projects since we opened in 2016. These are six from the last four years, with a number each client was happy to share.',
    ko: '2016년 개업 이후 31개 프로젝트를 진행했습니다. 아래는 최근 4년간의 6개 프로젝트이며, 각 고객사가 공유에 동의한 수치를 함께 실었습니다.',
    ja: '2016年の開業以来、31件のプロジェクトを手がけてきました。以下は直近4年間の6件で、各お客様に公開をご承諾いただいた数値を添えています。',
  },
  year: { en: 'Year', ko: '연도', ja: '年' },
  client: { en: 'Client', ko: '고객사', ja: 'お客様' },
  made: { en: 'What we made', ko: '제작 내용', ja: '制作内容' },
  result: { en: 'Result', ko: '성과', ja: '成果' },
} satisfies Record<string, Tri>;

const WORK_ROWS: Array<{ year: string; client: string; what: Tri; kinds: KindId[]; figure: string; unit: Tri }> = [
  {
    year: '2026',
    client: 'Danbi Climbing',
    what: { en: 'Membership app with day passes and a QR door check, for four gyms.', ko: '4개 암장을 위한 회원 앱. 일일권과 QR 출입 확인을 지원합니다.', ja: '4店舗向けの会員アプリ。デイパスとQRによる入館確認に対応。' },
    kinds: ['mob'],
    figure: '11,200',
    unit: { en: 'members', ko: '회원', ja: '会員' },
  },
  {
    year: '2025',
    client: 'Linefeed',
    what: { en: 'Name, logo and the first version of their invoicing app for Mac and Windows.', ko: 'Mac과 Windows용 청구서 앱의 이름, 로고, 첫 버전.', ja: 'Mac・Windows向け請求書アプリの名称、ロゴ、初版。' },
    kinds: ['brand', 'desk'],
    figure: '4,200',
    unit: { en: 'paying teams', ko: '유료 팀', ja: '有料チーム' },
  },
  {
    year: '2025',
    client: 'Namu Coffee',
    what: { en: 'A new look for nine cafés, from cups to signs, and a stamp-card app.', ko: '카페 9곳의 새 디자인(컵부터 간판까지)과 스탬프 카드 앱.', ja: 'カフェ9店舗の新しいデザイン（カップから看板まで）とスタンプカードアプリ。' },
    kinds: ['brand', 'mob'],
    figure: '9',
    unit: { en: 'cafés', ko: '카페', ja: '店舗' },
  },
  {
    year: '2024',
    client: 'Weave Rooms',
    what: { en: 'Website and meeting-room booking for six coworking floors.', ko: '6개 층 공유오피스를 위한 웹사이트와 회의실 예약.', ja: '6フロアのコワーキングスペース向けのウェブサイトと会議室予約。' },
    kinds: ['web'],
    figure: '38%',
    unit: { en: 'booked online', ko: '온라인 예약', ja: 'オンライン予約' },
  },
  {
    year: '2023',
    client: 'Saebyeok Freight',
    what: { en: 'Dispatch app for Windows, used by the office team that routes 120 drivers.', ko: 'Windows용 배차 앱. 120명의 기사를 배정하는 사무실 팀이 씁니다.', ja: 'Windows向けの配車アプリ。120名のドライバーを配車する事務所チームが使用。' },
    kinds: ['desk'],
    figure: '120',
    unit: { en: 'drivers', ko: '기사', ja: 'ドライバー' },
  },
  {
    year: '2022',
    client: 'Gongbang Tools',
    what: { en: 'Brand and online shop for a family hand-tool maker in Incheon.', ko: '인천의 가족 수공구 제조사를 위한 브랜드와 온라인 쇼핑몰.', ja: '仁川の家族経営の手工具メーカー向けのブランドとオンラインショップ。' },
    kinds: ['brand', 'web'],
    figure: '3×',
    unit: { en: 'online sales', ko: '온라인 매출', ja: 'オンライン売上' },
  },
];

interface Month {
  id: string;
  short: Tri;
  name: Tri;
  booked: number;
}

const MONTHS: Month[] = [
  { id: 'dec', short: { en: 'Dec', ko: '12월', ja: '12月' }, name: { en: 'December 2026', ko: '2026년 12월', ja: '2026年12月' }, booked: 3 },
  { id: 'jan', short: { en: 'Jan', ko: '1월', ja: '1月' }, name: { en: 'January 2027', ko: '2027년 1월', ja: '2027年1月' }, booked: 2 },
  { id: 'feb', short: { en: 'Feb', ko: '2월', ja: '2月' }, name: { en: 'February 2027', ko: '2027년 2월', ja: '2027年2月' }, booked: 1 },
  { id: 'mar', short: { en: 'Mar', ko: '3월', ja: '3月' }, name: { en: 'March 2027', ko: '2027년 3월', ja: '2027年3月' }, booked: 0 },
  { id: 'apr', short: { en: 'Apr', ko: '4월', ja: '4月' }, name: { en: 'April 2027', ko: '2027년 4월', ja: '2027年4月' }, booked: 0 },
];

const SLOTS_PER_MONTH = 3;

const BUDGETS: Array<{ id: string; label: Tri }> = [
  { id: 'under-30', label: { en: 'Under ₩30M', ko: '₩30M 미만', ja: '₩30M未満' } },
  { id: '30-60', label: { en: '₩30M to ₩60M', ko: '₩30M~₩60M', ja: '₩30M〜₩60M' } },
  { id: '60-100', label: { en: '₩60M to ₩100M', ko: '₩60M~₩100M', ja: '₩60M〜₩100M' } },
  { id: 'over-100', label: { en: 'Over ₩100M', ko: '₩100M 초과', ja: '₩100M超' } },
  { id: 'unsure', label: { en: 'Not sure yet', ko: '아직 정하지 않음', ja: '未定' } },
];

const KIND_ORDER: KindId[] = ['brand', 'web', 'desk', 'mob'];

const START = {
  title: { en: 'Start a project', ko: '프로젝트 시작하기', ja: 'プロジェクトを始める' },
  note: {
    en: 'Pick a month, then tell us what you need and a budget range. We reply within two working days with a time for a 30‑minute call.',
    ko: '월을 고른 뒤 필요한 작업과 예산 범위를 알려 주세요. 영업일 기준 2일 안에 30분 통화 가능 시간을 보내 드립니다.',
    ja: '月を選び、必要な作業と予算の範囲をお知らせください。営業日2日以内に、30分のお打ち合わせ日時をご連絡します。',
  },
  slots: { en: 'Project slots', ko: '프로젝트 일정', ja: 'プロジェクトの枠' },
  nextOpening: { en: 'Next opening', ko: '다음 가능 시기', ja: '次の空き' },
  full: { en: 'Full', ko: '마감', ja: '満席' },
  open: { en: '{n} open', ko: '{n}자리 남음', ja: '残り{n}枠' },
  booked: { en: 'Booked', ko: '예약됨', ja: '予約済み' },
  openKey: { en: 'Open', ko: '가능', ja: '空き' },
  cap: { en: 'We start at most three projects a month.', ko: '한 달에 시작하는 프로젝트는 최대 3건입니다.', ja: '1か月に着手するプロジェクトは最大3件です。' },
  held: {
    en: 'Your month is pencilled in. To choose another, edit the brief.',
    ko: '선택하신 월은 임시로 잡아 두었습니다. 다른 월을 고르려면 브리프를 수정해 주세요.',
    ja: 'ご希望の月は仮押さえしています。別の月を選ぶには、ブリーフを修正してください。',
  },
  name: { en: 'Your name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  kinds: { en: 'What do you need?', ko: '어떤 작업이 필요하신가요?', ja: 'どの作業が必要ですか？' },
  budget: { en: 'Budget range', ko: '예산 범위', ja: '予算の範囲' },
  budgetPick: { en: 'Choose a range', ko: '범위 선택', ja: '範囲を選択' },
  when: { en: 'Start', ko: '시작 시기', ja: '開始時期' },
  whenNone: { en: 'pick an open month in the calendar', ko: '달력에서 가능한 월을 선택해 주세요', ja: 'カレンダーで空きのある月を選んでください' },
  send: { en: 'Send the brief', ko: '브리프 보내기', ja: 'ブリーフを送信' },
  errName: { en: 'Write your name, so we know who to reply to.', ko: '이름을 입력해 주세요. 답장을 보낼 분을 확인하기 위해서입니다.', ja: 'お名前を入力してください。ご返信先の確認に使います。' },
  errEmail: { en: 'Write an email address like name@company.com.', ko: 'name@company.com 형식으로 이메일 주소를 입력해 주세요.', ja: 'name@company.com の形式でメールアドレスを入力してください。' },
  errKinds: { en: 'Choose at least one kind of work.', ko: '작업 종류를 하나 이상 선택해 주세요.', ja: '作業の種類を1つ以上選んでください。' },
  errBudget: { en: 'Choose a budget range. Not sure yet is fine.', ko: '예산 범위를 선택해 주세요. 아직 정하지 않았다면 "아직 정하지 않음"을 골라도 됩니다.', ja: '予算の範囲を選んでください。未定の場合は「未定」を選んでも構いません。' },
  errMonth: { en: 'Choose an open month in the calendar.', ko: '달력에서 가능한 월을 선택해 주세요.', ja: 'カレンダーで空きのある月を選んでください。' },
  doneTitle: { en: 'Thank you, {name}. Your brief is with us.', ko: '{name}님, 감사합니다. 브리프를 잘 받았습니다.', ja: '{name}様、ありがとうございます。ブリーフを受け付けました。' },
  doneBody: {
    en: 'Min‑jae Oh will write to {email} within two working days with a time for a 30‑minute call. We have pencilled you in for {month}.',
    ko: '오민재가 영업일 기준 2일 안에 {email} 주소로 연락해 30분 통화 가능 시간을 알려 드립니다. {month}로 일정을 임시로 잡아 두었습니다.',
    ja: 'オ・ミンジェより、営業日2日以内に{email}宛てに、30分のお打ち合わせ日時をご連絡します。{month}で仮押さえしています。',
  },
  doneWork: { en: 'Work', ko: '작업', ja: '作業' },
  doneBudget: { en: 'Budget', ko: '예산', ja: '予算' },
  edit: { en: 'Edit the brief', ko: '브리프 수정', ja: 'ブリーフを修正' },
  writeTo: { en: 'Or write to us', ko: '또는 메일 보내기', ja: 'またはメールでご連絡' },
  phone: { en: 'Phone', ko: '전화', ja: '電話' },
  hours: { en: 'Office hours', ko: '영업 시간', ja: '営業時間' },
  hoursValue: { en: 'Monday to Friday, 10:00 to 18:00', ko: '월요일~금요일, 10:00~18:00', ja: '月曜日〜金曜日、10:00〜18:00' },
  visit: { en: 'Visit', ko: '방문', ja: '所在地' },
  visitValue: { en: 'Rooftop, 22 Wausan-ro 21-gil, Mapo‑gu, Seoul', ko: '옥상, 서울 마포구 와우산로21길 22', ja: '屋上、ソウル麻浦区 Wausan-ro 21-gil 22' },
  askFor: { en: 'Ask for', ko: '담당자', ja: 'ご担当者' },
  askForValue: { en: 'Min‑jae Oh, studio lead', ko: '오민재, 스튜디오 총괄', ja: 'オ・ミンジェ、スタジオ責任者' },
} satisfies Record<string, Tri>;

const FOOT = {
  where: { en: 'Oktop Studio, Mapo‑gu, Seoul', ko: 'Oktop 스튜디오, 서울 마포구', ja: 'Oktop Studio、ソウル麻浦区' },
  reg: { en: 'Business registration 105-88-41207', ko: '사업자등록번호 105-88-41207', ja: '事業者登録番号 105-88-41207' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Studio Pixel style: a warm cream studio page drawn with 2px ink lines and hard ink offset shadows, a wide rounded sans for what the studio says, a low-resolution pixel numeral for every number it commits to, and four colours that each mean one kind of work.

Pick a believable subject that sells made work on a schedule, such as a small design and engineering studio, a print workshop or a sign maker, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Oktop, eleven designers and engineers in a rooftop office in Mapo, Seoul: the jobs on their board this week, what they make, how a project runs, their prices and a quote they sent, selected work, and the slot calendar with a project brief.

TOKENS:
--bg: #fff4ee (under a 96px grid of 1px ink lines at 4.5% and 3.5%)
--paper: #fffdf9 (the board, the track, the quote, the slot calendar, form fields; also the opaque surface for menus)
--ink: #080604
--muted: #5f5651
--faint: rgba(8,6,4,0.3) (ruled lines inside lists, empty ruler cells)
--red: #cc4639 (the square before the studio's name, the service strip, buttons, the stamp, the current step, step numbers, open slots, the next opening, invalid fields and the error marker)
--teal: #2f8b8e (the board's side rail and the focus ring)
--brand: #f2aca1, --web: #d8665a, --desk: #739ed0, --mob: #36a3a5 (one per kind of work)

COLOUR:
- Each kind of work keeps its colour everywhere: its ticket, the date in the strip under the board, its key square, its bar on the ruler, its rung on the price ladder, its line in the work index and its ticked checkbox in the brief.
- Red is for action and for what comes next; teal only for the rail and the focus ring. Text on the four kind colours is ink (5.7:1 or more); text on red and on ink is paper; red text only at 24px and up.
- No other colours. Textures are ink, cream or red at low opacity: the page and board grids, tape (cream at 82% with fine ink lines), the dotted perforation on each ticket, the dashed inner line of the board, a huge "Ok" in red at 8% behind the hero copy. Errors are ink text after a red square. Hover moves buttons and tickets up and left with a longer shadow, underlines links or thickens their underline, and tints calendar rows with --bg.
- Structural edges are 2px ink lines; ruled lines inside lists are 2px --faint.

TYPOGRAPHY:
Two families. Readex Pro (300 to 700, HEXP axis at 36 on headings and names) says what the studio says. Jersey 10 (400) sets every number the studio commits to (weeks, dates, prices, years, results, step numbers, months), the studio's name, the service strip and the second line of the headline. Jersey 10 has no won sign: ₩ is set in Readex Pro 600 at max(1rem, 0.62em) beside the figures.
H1, two lines. Readex Pro 700, line-height 0.98, letter-spacing -0.035em: clamp(2.3rem, 4.6vw, 3.75rem) beside the board, clamp(2.3rem, 6.6vw, 4.25rem) below 1200px. Then Jersey 10, line-height 0.8, letter-spacing 0.01em: clamp(3.9rem, 7.6vw, 6.1rem) beside the board, clamp(3.9rem, 11.6vw, 7.8rem) below 1200px, 3.25rem with line-height 0.86 below 360px.
H2: Readex Pro 700, clamp(2rem, 4vw, 3.4rem), line-height 1, letter-spacing -0.035em, balanced. H3: Readex Pro 600, 1.3rem, line-height 1.15, letter-spacing -0.02em.
Jersey 10 sizes: the studio's name 2.5rem (2.1rem on phones); the service strip 1.75rem, clamp(1.4rem, 2.05vw, 1.65rem) beside the board; ticket weeks 2.1rem; the stamp's date 3rem; the rail 1.6rem (1.5rem on phones); the date in the strip 1.8rem; step numbers and the next opening 4.6rem (3.9rem on phones); track numbers 4.6rem in a row and at the price size once the blocks stack; prices, results, week ranges and the quote number 2.6rem (2rem on phones); years 3rem; months 2.1rem; quote lines 1.5rem; ruler marks 1.25rem.
Body: Readex Pro 300 at 1.03rem, line-height 1.68; the lede 1.125rem; client names in the work index and the calendar's title 600 at 1.3rem; ticket names 600 at 1.0625rem; kinds, labels, buttons and "weeks" 600 at 1rem; ticket lines and notes 400 at 1rem. No text under 1rem. No all-caps tracked labels.

LAYOUT:
- The studio's own bar on a 2px ink rule: the name in Jersey after a red square with a 4px ink offset, four in-page links, one "Start a project" button.
- Hero on a 1120px column, two columns from 1200px (0.88fr and 1.12fr, 48px apart): on the left the red service strip, the two-line headline, a lede and two actions; on the right the board, with the whole headline and board on the first screen of a 1280x800 laptop. Below 1200px the board goes under the copy, at most 620px wide.
- Then: the scope sheet (name and line on the left, the bar on a shared 20-week ruler on the right), the project track and four steps, the price ladder beside the taped quote, the work index, and the slot calendar beside the brief form with the contact details under them. Sections are 96px apart (72px below 860px), each on a 2px ink rule.

COMPONENTS:
- The board: a paper sheet on a 38px grid with a dashed inner line, turned 1deg (0.8deg on phones), two pieces of tape, a red "Next start 12 Jan" stamp turned -7deg over its top-left corner, a 38px teal rail on the right with "On the board, week 47" set vertically, and four job tickets in two columns (one on phones). Each ticket is a toggle button (aria-pressed) in its kind's colour, turned between -2.6deg and 2.4deg, with a strip of tape and a perforated left edge: the kind, the weeks done as a pixel figure over the word "weeks", the client, a row of square cells (ink for weeks done) and one line about the job. The chosen ticket lifts (translate -5px -7px, turned 1deg, a 14px shadow and a 3px ink outline 5px out). The ink strip under the tickets shows the chosen job's next date on its colour and what happens then; a change is announced politely.
- Scope sheet: each service on a row of 20 square cells (filled in its colour for the usual weeks, hatched for the range, empty cells on --faint) with the range in pixel figures.
- Project track: an ordered list of four blocks sized 1:3:5:1 by weeks on paper; the current one is red with this week drawn as a raised paper cell. Below 1080px the blocks become rows. Four steps underneath: number, name, length, what happens, and "You get" over a 2px rule.
- Price ladder: a fixed-price model with rows of key square, kind and price range, then two monthly models with their price on the right. The quote: paper, turned 1.4deg, taped, its number in pixels, a ruled list of lines with the amounts and an ink-ruled total.
- Work index: a table (explicit roles, column headers for assistive technology) of year, client and what was made, kinds with key squares, and the result. Below 860px each row stacks with the year beside it.
- Slot calendar: a paper panel, the next opening in large red pixels, then one radio group of five months, three 36px square cells each (ink booked, red open); a full month is disabled; the chosen month turns ink with paper text. Brief form: name, email, kind of work (four square checkboxes that fill with the kind colour), budget range (a square select with a drawn chevron), and the chosen month restated above the button. Errors sit under their field (role="alert") and turn its border red; a valid brief replaces the fields with a confirmation that takes focus, and the calendar locks until "Edit the brief".
- Square corners everywhere. Shadows are hard ink offsets with no blur: 5px on buttons, 9px on tickets, the stamp and the track, 14px on the quote and the calendar, 18px on the board (smaller on phones).
- Fields are 52px tall with a 2px ink border on paper; buttons are at least 48px; every control is at least 44px tall on phones.

MOTION:
- Buttons and tickets move on hover and selection with a 140ms transform and shadow change; nothing moves on its own. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Rounded corners, pills, chips, blurred or soft shadows, gradients other than the grid, tape and hatch textures
- A small label above a heading, all-caps tracked labels, numbers on anything that is not a real sequence
- Pixel-art characters, sprites, scenes or any figurative illustration; emoji
- Colour that does not mean a kind of work, an action or what comes next
- Arrows on links, middle-dot meta strings
- Copy about the page, the style, pixels or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: toggle buttons for the tickets, ordered lists for the track and steps, a table with roles for the work, a radio group for the months, a labelled form
3) Working ticket choice with the strip, month choice, and a form with error and success states
4) Responsive layout down to 320px with no horizontal scroll
5) A visible 3px teal focus ring on every control, reduced-motion support`;

const PROMPT_KO = `Studio Pixel 스타일로 실제 페이지 한 장을 디자인한다. 2px 잉크 선과 잉크색 하드 오프셋 그림자를 쓴 따뜻한 크림색 스튜디오 페이지다. 스튜디오가 하는 말은 넓은 둥근 산세리프로, 스튜디오가 약속하는 모든 숫자는 저해상도 픽셀 숫자로 쓴다. 네 가지 색은 각각 한 종류의 작업을 뜻한다.

일정에 맞춰 만든 결과물을 파는 실제 같은 주제를 고르고, 실제 내용을 쓴다. 예: 작은 디자인·엔지니어링 스튜디오, 인쇄 공방, 간판 제작사. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일이나 픽셀에 관한 페이지로 읽혀서는 안 된다. 여기서는 서울 마포구 옥상 사무실에서 일하는 디자이너와 엔지니어 11명의 스튜디오 Oktop이다. 이번 주 보드의 작업, 스튜디오가 만드는 것, 프로젝트 진행 방식, 요금과 발송한 견적, 선정 작업, 일정 달력과 프로젝트 브리프를 담는다.

TOKENS:
--bg: #fff4ee (1px 잉크 선으로 된 96px 격자 아래, 선 불투명도 4.5%와 3.5%)
--paper: #fffdf9 (보드, 트랙, 견적, 일정 달력, 폼 필드, 메뉴의 불투명 배경)
--ink: #080604
--muted: #5f5651
--faint: rgba(8,6,4,0.3) (목록 안의 구분선, 빈 눈금 셀)
--red: #cc4639 (스튜디오 이름 앞의 정사각형, 서비스 띠, 버튼, 도장, 현재 단계, 단계 번호, 가능한 일정, 다음 시작일, 잘못된 필드와 오류 표시)
--teal: #2f8b8e (보드의 옆 레일과 포커스 링)
--brand: #f2aca1, --web: #d8665a, --desk: #739ed0, --mob: #36a3a5 (작업 종류마다 하나씩)

COLOUR:
- 각 작업 종류는 어디서나 자기 색을 유지한다. 티켓, 보드 아래 띠의 날짜, 핵심 정사각형, 눈금의 막대, 가격 사다리의 칸, 작업 목록의 줄, 브리프에서 체크한 상자가 모두 같은 색이다.
- 빨강은 행동과 다음에 올 것에만 쓴다. 청록은 레일과 포커스 링에만 쓴다. 네 가지 작업 색 위의 글자는 잉크색(명도 대비 5.7:1 이상)이며, 빨강과 잉크 위의 글자는 종이색이다. 빨간 글자는 24px 이상에서만 쓴다.
- 다른 색은 쓰지 않는다. 질감은 저불투명도의 잉크, 크림, 빨강만 쓴다. 페이지와 보드의 격자, 테이프(크림 82%에 가는 잉크 선), 티켓마다 점선 천공, 보드의 점선 안쪽 선, 히어로 문구 뒤의 8% 빨간 큰 "Ok"가 해당한다. 오류는 빨간 정사각형 뒤의 잉크색 글자로 표시한다. 호버 시 버튼과 티켓은 왼쪽 위로 올라가며 그림자가 길어지고, 링크는 밑줄이 생기거나 두꺼워지며, 일정 행은 --bg색으로 칠해진다.
- 구조선은 2px 잉크 선이다. 목록 안의 구분선은 2px --faint이다.

TYPOGRAPHY:
서체는 두 가지다. Readex Pro(300~700, 제목과 이름에는 HEXP 축 36)는 스튜디오가 하는 말을 담는다. Jersey 10(400)은 스튜디오가 약속하는 모든 숫자(주 수, 날짜, 가격, 연도, 결과, 단계 번호, 월), 스튜디오 이름, 서비스 띠, 제목의 둘째 줄을 담는다. Jersey 10에는 원화 기호가 없으므로, ₩는 숫자 옆에 Readex Pro 600으로 max(1rem, 0.62em) 크기로 쓴다.
H1, 두 줄. Readex Pro 700, line-height 0.98, letter-spacing -0.035em, 크기는 보드 옆에서 clamp(2.3rem, 4.6vw, 3.75rem), 1200px 아래에서 clamp(2.3rem, 6.6vw, 4.25rem). 이어서 Jersey 10, line-height 0.8, letter-spacing 0.01em, 크기는 보드 옆에서 clamp(3.9rem, 7.6vw, 6.1rem), 1200px 아래에서 clamp(3.9rem, 11.6vw, 7.8rem), 360px 아래에서 3.25rem, line-height 0.86.
H2: Readex Pro 700, clamp(2rem, 4vw, 3.4rem), line-height 1, letter-spacing -0.035em, balanced. H3: Readex Pro 600, 1.3rem, line-height 1.15, letter-spacing -0.02em.
Jersey 10 크기: 스튜디오 이름 2.5rem(휴대폰에서 2.1rem), 서비스 띠 1.75rem(보드 옆에서 clamp(1.4rem, 2.05vw, 1.65rem)), 티켓의 주 수 2.1rem, 도장의 날짜 3rem, 레일 1.6rem(휴대폰에서 1.5rem), 띠의 날짜 1.8rem, 단계 번호와 다음 시작일 4.6rem(휴대폰에서 3.9rem), 트랙 숫자는 한 줄에서 4.6rem이고 블록이 쌓이면 가격 크기, 가격·결과·주 범위·견적 번호 2.6rem(휴대폰에서 2rem), 연도 3rem, 월 2.1rem, 견적 줄 1.5rem, 눈금 표시 1.25rem.
본문: Readex Pro 300, 1.03rem, line-height 1.68. 리드 문단은 1.125rem. 작업 목록의 고객명과 달력 제목은 600, 1.3rem. 티켓 이름은 600, 1.0625rem. 작업 종류, 라벨, 버튼, "주"는 600, 1rem. 티켓 본문과 메모는 400, 1rem. 1rem보다 작은 글자는 쓰지 않는다. 자간을 넓힌 전체 대문자 라벨은 쓰지 않는다.

LAYOUT:
- 스튜디오 자체 바는 2px 잉크 선 위에 놓인다. 빨간 정사각형 뒤에 Jersey로 쓴 이름(4px 잉크 오프셋), 페이지 내 링크 4개, "프로젝트 시작하기" 버튼 하나를 둔다.
- 히어로는 1120px 열에 놓인다. 1200px부터는 두 열이다(0.88fr과 1.12fr, 간격 48px). 왼쪽에는 빨간 서비스 띠, 두 줄 제목, 리드 문단, 버튼 두 개를 두고, 오른쪽에는 보드를 둔다. 1280x800 노트북의 첫 화면에 제목 전체와 보드가 모두 보여야 한다. 1200px 아래에서는 보드가 문구 아래로 내려가며, 최대 620px 너비다.
- 이어서 범위 시트(왼쪽에 이름과 설명, 오른쪽에 공통 20주 눈금 위의 막대), 프로젝트 트랙과 네 단계, 테이프로 붙인 견적 옆의 가격 사다리, 선정 작업 목록, 브리프 폼 옆의 일정 달력과 그 아래 연락처를 둔다. 섹션 간격은 96px(860px 아래에서는 72px)이며, 각 섹션은 2px 잉크 선으로 구분한다.

COMPONENTS:
- 보드: 38px 격자 종이 시트에 점선 안쪽 선이 있고 1deg 기울어진다(휴대폰에서는 0.8deg). 테이프 두 장, 왼쪽 위 모서리에 -7deg로 걸친 빨간 "다음 시작 1월 12일" 도장, 오른쪽의 38px 청록 레일(세로로 쓴 "작업 보드, 47주차"), 2열(휴대폰에서는 1열)의 작업 티켓 네 장이 있다. 각 티켓은 작업 종류 색을 쓰는 토글 버튼(aria-pressed)이다. -2.6deg에서 2.4deg 사이로 기울고, 테이프 띠와 천공된 왼쪽 가장자리가 있다. 내용은 작업 종류, 완료한 주를 픽셀 숫자로 쓴 것과 그 옆의 "주", 고객명, 완료한 주를 잉크색 정사각형 셀로 나타낸 줄, 작업에 관한 한 줄 설명이다. 선택된 티켓은 들어 올려진다(translate -5px -7px, 1deg 기울기, 14px 그림자, 바깥으로 5px 떨어진 3px 잉크 외곽선). 티켓 아래의 잉크 띠는 선택한 작업의 다음 날짜를 그 작업의 색으로 보여 주고, 그때 일어날 일을 쓴다. 변경은 차분하게 알린다(polite).
- 범위 시트: 서비스마다 정사각형 셀 20개짜리 줄이다. 평소 주 수는 해당 색으로 채우고, 범위는 빗금으로, 나머지는 --faint 빈 셀로 둔다. 범위는 픽셀 숫자로 쓴다.
- 프로젝트 트랙: 주 수 기준 1:3:5:1 비율의 블록 네 개를 종이 위에 순서대로 놓은 목록이다. 현재 블록은 빨간색이며, 이번 주는 솟아오른 종이 셀로 표시한다. 1080px 아래에서는 블록이 행으로 바뀐다. 그 아래에는 네 단계를 둔다: 번호, 이름, 기간, 할 일, 2px 선 위의 "받는 것".
- 가격 사다리: 고정 가격 모델은 핵심 정사각형, 작업 종류, 가격 범위가 있는 행으로 구성한다. 월간 모델 두 개는 오른쪽에 가격을 둔다. 견적: 종이, 1.4deg 기울기, 테이프, 픽셀 숫자 견적 번호, 금액이 있는 구분선 목록, 잉크 선으로 구분한 합계.
- 선정 작업: 표다(역할을 명시하고 보조 기술을 위한 열 머리글 포함). 연도, 고객, 제작 내용(핵심 정사각형이 있는 작업 종류), 성과를 담는다. 860px 아래에서는 각 행이 쌓이고 연도가 옆에 온다.
- 일정 달력: 종이 패널이다. 큰 빨간 픽셀로 다음 가능 일정을 쓰고, 다섯 달을 담은 라디오 그룹 하나를 둔다. 각 달은 36px 정사각형 셀 3개로 표시한다(잉크는 예약됨, 빨강은 가능). 마감된 달은 비활성이다. 선택한 달은 잉크색 바탕에 종이색 글자가 된다. 브리프 폼은 이름, 이메일, 작업 종류(핵심 색으로 채워지는 정사각형 체크박스 4개), 예산 범위(그려진 쉐브론이 있는 정사각형 select), 버튼 위에 다시 쓴 선택한 월로 구성한다. 오류는 해당 필드 아래에 표시(role="alert")하고 테두리를 빨갛게 바꾼다. 올바른 브리프는 필드를 대신해 포커스를 받는 확인 메시지로 바뀌며, "브리프 수정"을 누르기 전까지 달력은 잠긴다.
- 모서리는 모두 직각이다. 그림자는 흐림 없는 잉크 오프셋이다: 버튼 5px, 티켓·도장·트랙 9px, 견적과 달력 14px, 보드 18px(휴대폰에서는 더 작게).
- 입력 필드는 높이 52px, 종이 배경에 2px 잉크 테두리다. 버튼은 최소 48px이다. 휴대폰에서 모든 컨트롤은 최소 44px 높이다.

MOTION:
- 버튼과 티켓은 호버와 선택 시 140ms 동안 변형과 그림자가 바뀌며 움직인다. 저절로 움직이는 것은 없다. prefers-reduced-motion에서는 전환을 제거한다.

FORBIDDEN:
- 둥근 모서리, 알약 모양, 칩, 흐리거나 부드러운 그림자, 격자·테이프·빗금 질감 외의 그라디언트
- 제목 위의 작은 라벨, 자간을 넓힌 전체 대문자 라벨, 실제 순서가 아닌 대상에 붙인 숫자
- 픽셀 아트 캐릭터, 스프라이트, 장면, 그림 같은 일러스트, 이모지
- 작업 종류, 행동, 다음 단계를 뜻하지 않는 색
- 링크의 화살표, 가운뎃점으로 이어 붙인 메타 문자열
- 페이지, 스타일, 픽셀, 디자인 자체에 관한 문구

OUTPUT:
1) 위 토큰을 담은 CSS 커스텀 속성
2) 시맨틱 HTML: 티켓은 토글 버튼, 트랙과 단계는 순서 있는 목록, 작업은 역할을 명시한 표, 월은 라디오 그룹, 라벨이 있는 폼
3) 작동하는 티켓 선택(띠 포함), 월 선택, 오류와 성공 상태가 있는 폼
4) 320px까지 가로 스크롤 없이 대응하는 반응형 레이아웃
5) 모든 컨트롤에 보이는 3px 청록 포커스 링, reduced-motion 지원`;

const PROMPT_JA = `Studio Pixelスタイルで、実在するページを1枚デザインする。2pxのインク線と、ぼかしのないインク色のオフセット影を使った、温かいクリーム色のスタジオページ。スタジオの言葉は幅の広い丸みのあるサンセリフ、スタジオが約束するすべての数字は低解像度のピクセル数字で組む。4色はそれぞれ一種類の仕事を表す。

スケジュール通りに制作物を売る、もっともらしい題材を選び、実際の内容を書く。例: 小さなデザイン・エンジニアリングスタジオ、印刷工房、看板製作所。ページはその題材のページとして読めること。スタイルやピクセルについてのページに見えてはならない。ここでは、麻浦区（ソウル）の屋上オフィスで働くデザイナーとエンジニア11名のスタジオ、Oktop。今週のボードの仕事、制作内容、プロジェクトの進め方、料金と送付した見積もり、主な実績、日程カレンダーとプロジェクトのブリーフを掲載する。

TOKENS:
--bg: #fff4ee（1pxのインク線による96pxのグリッドの下、線の不透明度4.5%と3.5%）
--paper: #fffdf9（ボード、トラック、見積もり、日程カレンダー、フォーム欄、メニューの不透明な背景）
--ink: #080604
--muted: #5f5651
--faint: rgba(8,6,4,0.3)（リスト内の罫線、空のスケール用セル）
--red: #cc4639（スタジオ名の前の四角、サービス帯、ボタン、スタンプ、現在のステップ、ステップ番号、空きのある日程、次の開始日、無効な欄とエラーマーカー）
--teal: #2f8b8e（ボードの横のレールとフォーカスリング）
--brand: #f2aca1, --web: #d8665a, --desk: #739ed0, --mob: #36a3a5（仕事の種類ごとに1色）

COLOUR:
- 各仕事の種類は、どこでもその色を保つ。チケット、ボード下の帯の日付、主要な四角、スケール上のバー、料金の梯子の段、実績リストの行、ブリーフでチェックされた欄がすべて同じ色になる。
- 赤は行動と次に来るものにだけ使う。青緑はレールとフォーカスリングにだけ使う。4つの仕事色の上の文字はインク色（コントラスト比5.7:1以上）、赤とインクの上の文字は紙色にする。赤い文字は24px以上でだけ使う。
- 他の色は使わない。質感はインク、クリーム、赤の低不透明度のみ。ページとボードのグリッド、テープ（クリーム82%に細いインク線）、チケットごとの点線の切り取り線、ボードの破線の内側の線、ヒーロー文の後ろの8%の赤い大きな「Ok」。エラーは赤い四角の後のインク色の文字で示す。ホバー時はボタンとチケットが左上に動き、影が長くなる。リンクは下線が付くか太くなり、日程の行は --bg で色づけする。
- 構造の境界は2pxのインク線。リスト内の罫線は2px --faint。

TYPOGRAPHY:
2つのファミリー。Readex Pro（300〜700、見出しと名前ではHEXP軸36）はスタジオの言葉を担う。Jersey 10（400）はスタジオが約束するすべての数字（週数、日付、価格、年、結果、ステップ番号、月）、スタジオ名、サービス帯、見出しの2行目を組む。Jersey 10に円（₩）の記号はないため、₩は数字の横でReadex Pro 600を max(1rem, 0.62em) の大きさで組む。
H1、2行。Readex Pro 700、line-height 0.98、letter-spacing -0.035em。ボードの横では clamp(2.3rem, 4.6vw, 3.75rem)、1200px未満では clamp(2.3rem, 6.6vw, 4.25rem)。続けて Jersey 10、line-height 0.8、letter-spacing 0.01em。ボードの横では clamp(3.9rem, 7.6vw, 6.1rem)、1200px未満では clamp(3.9rem, 11.6vw, 7.8rem)、360px未満では 3.25rem で line-height 0.86。
H2: Readex Pro 700、clamp(2rem, 4vw, 3.4rem)、line-height 1、letter-spacing -0.035em、balanced。H3: Readex Pro 600、1.3rem、line-height 1.15、letter-spacing -0.02em。
Jersey 10の大きさ: スタジオ名 2.5rem（スマートフォンでは2.1rem）、サービス帯 1.75rem（ボードの横では clamp(1.4rem, 2.05vw, 1.65rem)）、チケットの週数 2.1rem、スタンプの日付 3rem、レール 1.6rem（スマートフォンでは1.5rem）、帯の日付 1.8rem、ステップ番号と次の空き 4.6rem（スマートフォンでは3.9rem）、トラックの数字は1行では 4.6rem、ブロックが積み重なると価格の大きさ、価格・結果・週の範囲・見積もり番号 2.6rem（スマートフォンでは2rem）、年 3rem、月 2.1rem、見積もりの行 1.5rem、スケールの目盛り 1.25rem。
本文: Readex Pro 300、1.03rem、line-height 1.68。リード文 1.125rem。実績リストの顧客名とカレンダーの見出しは 600、1.3rem。チケット名は 600、1.0625rem。仕事の種類、ラベル、ボタン、「週」は 600、1rem。チケットの本文と注記は 400、1rem。1rem未満の文字は使わない。字間を広げた全大文字のラベルは使わない。

LAYOUT:
- スタジオ自身のバーは2pxのインク線の上に置く。赤い四角の後にJerseyの名前（4pxのインクオフセット）、ページ内リンク4つ、「プロジェクトを始める」ボタン1つ。
- ヒーローは1120pxの列。1200pxからは2列（0.88frと1.12fr、間隔48px）。左に赤いサービス帯、2行の見出し、リード文、ボタン2つ。右にボード。1280x800のノートPCの最初の画面に、見出し全体とボードの両方が収まること。1200px未満ではボードが本文の下に来て、最大幅は620px。
- 続いて、範囲シート（左に名前と説明、右に共通の20週スケール上のバー）、プロジェクトのトラックと4つのステップ、テープで留めた見積もりの横の料金の梯子、実績一覧、ブリーフフォームの横の日程カレンダーと、その下の連絡先。セクションの間隔は96px（860px未満では72px）。各セクションは2pxのインク線で区切る。

COMPONENTS:
- ボード: 38pxのグリッドの紙シートに点線の内側の線があり、1deg傾く（スマートフォンでは0.8deg）。テープ2枚、左上の角に -7deg で重なる赤い「次の開始 1月12日」スタンプ、右側の38pxの青緑のレール（縦書きの「作業ボード、47週目」）、2列（スマートフォンでは1列）に並ぶ仕事のチケット4枚。各チケットは仕事の種類の色を使うトグルボタン（aria-pressed）で、-2.6deg から 2.4deg の間で傾き、テープの帯と切り取り線の入った左端を持つ。内容は仕事の種類、完了した週をピクセル数字で示したもの（その上に「週」）、顧客名、完了した週を示す四角いセルの列（完了はインク色）、仕事についての1行。選択されたチケットは持ち上がる（translate -5px -7px、1deg、14pxの影、5px外側に3pxのインクの縁取り）。チケットの下のインクの帯は、選んだ仕事の次の日付をその色で示し、その時に何が起きるかを書く。変更は穏やかに知らせる（polite）。
- 範囲シート: サービスごとに、20個の四角いセルの行。通常の週数はその色で塗り、範囲は斜線、残りは --faint の空セル。範囲はピクセル数字で示す。
- プロジェクトのトラック: 週数で 1:3:5:1 の比率にした4つのブロックを、紙の上に順に並べたリスト。現在のブロックは赤で、今週は持ち上がった紙のセルとして描く。1080px未満ではブロックが行になる。その下に4つのステップ: 番号、名前、期間、内容、2pxの線の上の「受け取るもの」。
- 料金の梯子: 固定料金モデルは、主要な四角、仕事の種類、料金の範囲を並べた行。月額モデル2つは右側に価格を置く。見積もり: 紙、1.4deg、テープ、ピクセル数字の見積もり番号、金額付きの罫線つきリスト、インクの罫線で区切った合計。
- 実績一覧: 表（役割を明示し、支援技術のための列見出しを持つ）。年、顧客、制作内容（主要な四角付きの仕事の種類）、成果。860px未満では各行が積み重なり、年が横に並ぶ。
- 日程カレンダー: 紙のパネル。大きな赤いピクセルで次の空きを示し、5か月のラジオグループ1つを置く。各月は36pxの四角いセル3つ（インクは予約済み、赤は空き）。満席の月は無効。選ばれた月はインク色の背景に紙色の文字になる。ブリーフのフォームは、名前、メールアドレス、仕事の種類（仕事の色で塗られる四角いチェックボックス4つ）、予算の範囲（描かれたシェブロンのある四角いselect）、ボタンの上に再掲した選択月からなる。エラーはその欄の下に表示し（role="alert"）、欄の枠線を赤くする。有効なブリーフは、欄の代わりにフォーカスを受け取る確認表示になり、「ブリーフを修正」まではカレンダーをロックする。
- すべての角は直角。影はぼかしのないインクのオフセット: ボタン5px、チケット・スタンプ・トラック9px、見積もりとカレンダー14px、ボード18px（スマートフォンではさらに小さく）。
- 入力欄は高さ52px、紙の背景に2pxのインク枠。ボタンは最低48px。スマートフォンでは、すべての操作部品が最低44px。

MOTION:
- ボタンとチケットは、ホバーと選択時に140msで変形と影が変わって動く。自動で動くものはない。prefers-reduced-motion では遷移をなくす。

FORBIDDEN:
- 角丸、ピル形、チップ、ぼかしたり柔らかい影、グリッド・テープ・斜線の質感以外のグラデーション
- 見出しの上の小さなラベル、字間を広げた全大文字のラベル、実際の順序ではないものに付けた数字
- ピクセルアートのキャラクター、スプライト、場面、絵的なイラスト、絵文字
- 仕事の種類、操作、次の段階を意味しない色
- リンクの矢印、中黒で区切ったメタ文字列
- ページ、スタイル、ピクセル、デザインそのものについての文言

OUTPUT:
1) 上記のトークンを表すCSSカスタムプロパティ
2) セマンティックHTML: チケットはトグルボタン、トラックとステップは順序付きリスト、仕事は役割を明示した表、月はラジオグループ、ラベル付きのフォーム
3) 帯を含む動作するチケット選択、月の選択、エラーと成功の状態を持つフォーム
4) 320pxまで横スクロールなしのレスポンシブレイアウト
5) すべての操作部品に見える3pxの青緑のフォーカスリング、reduced-motion対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type Errors = { name: boolean; email: boolean; kinds: boolean; budget: boolean; month: boolean };
const NO_ERRORS: Errors = { name: false, email: false, kinds: false, budget: false, month: false };

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function PortedFusionStudioPixelPage({ lang }: PortedStylePageProps) {
  const t = (text: Tri) => text[lang];

  const [ticketId, setTicketId] = useState('haru');
  const [ticketNews, setTicketNews] = useState('');
  const [month, setMonth] = useState<string | null>(null);
  const [brief, setBrief] = useState({ name: '', email: '', budget: '' });
  const [kinds, setKinds] = useState<KindId[]>([]);
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [sent, setSent] = useState(false);
  const slotsRef = useRef<HTMLFieldSetElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const kindsRef = useRef<HTMLFieldSetElement>(null);
  const budgetRef = useRef<HTMLSelectElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const wasSent = useRef(false);

  const ticket = TICKETS.find((item) => item.id === ticketId) ?? TICKETS[1];
  const chosenMonth = MONTHS.find((item) => item.id === month) ?? null;
  const nextOpen = MONTHS.find((item) => item.booked < SLOTS_PER_MONTH) ?? MONTHS[0];

  // The fields and the confirmation replace each other, and the control that had focus
  // leaves the page with them. Focus goes to what took its place: the confirmation, or,
  // after "Edit the brief", the first field.
  useEffect(() => {
    if (sent) doneRef.current?.focus();
    else if (wasSent.current) nameRef.current?.focus();
    wasSent.current = sent;
  }, [sent]);

  const chooseTicket = (next: Ticket) => {
    setTicketId(next.id);
    setTicketNews(fill(t(BOARD.announce), { date: t(next.date), news: t(next.news) }));
  };

  const toggleKind = (kind: KindId) => {
    setKinds((list) => (list.includes(kind) ? list.filter((item) => item !== kind) : [...list, kind]));
    if (errors.kinds) setErrors({ ...errors, kinds: false });
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {
      month: chosenMonth === null,
      name: brief.name.trim() === '',
      email: !isEmail(brief.email.trim()),
      kinds: kinds.length === 0,
      budget: brief.budget === '',
    };
    if (!Object.values(next).some(Boolean)) {
      setErrors(NO_ERRORS);
      setSent(true);
      return;
    }
    // The errors render first, so the first one can be brought into view with its field.
    flushSync(() => setErrors(next));
    if (next.month) {
      slotsRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
      slotsRef.current?.scrollIntoView({ block: 'nearest' });
      return;
    }
    const target = next.name ? nameRef.current : next.email ? emailRef.current : next.kinds ? kindsRef.current?.querySelector('input') : budgetRef.current;
    target?.focus();
    target?.closest('.ok-field')?.scrollIntoView({ block: 'nearest' });
  };

  const kindList = KIND_ORDER.filter((kind) => kinds.includes(kind)).map((kind) => t(KIND_NAMES[kind])).join(', ');
  const budgetLabel = BUDGETS.find((item) => item.id === brief.budget);

  return (
    <FusionShell
      fusionId="fusion-studio-pixel"
      lang={lang}
      accent="#cc4639"
      prev={{ href: '/pages/fusion-soft-inflate.html', label: 'Soft Inflate' }}
      prompts={PROMPTS}
    >
      <div className="ok">
        <header className="ok-bar">
          <p className="ok-mark"><i aria-hidden="true" />{NAME}</p>
          <nav className="ok-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#ok-services">{t(HEAD.services)}</a>
            <a href="#ok-process">{t(HEAD.process)}</a>
            <a href="#ok-prices">{t(HEAD.prices)}</a>
            <a href="#ok-work">{t(HEAD.work)}</a>
          </nav>
          <a className="ok-btn ok-bar__start" href="#ok-start">{t(HEAD.start)}</a>
        </header>

        <section className="ok-hero" aria-labelledby="ok-title">
          <span className="ok-hero__ok" aria-hidden="true">Ok</span>
          <div className="ok-hero__copy">
            <p className="ok-strip">{t(HERO.strip)}</p>
            <h1 id="ok-title">
              <span className="ok-h1a">{t(HERO.titleA)}</span>
              <span className="ok-h1b">{t(HERO.titleB)}</span>
            </h1>
            <p className="ok-lede">{t(HERO.lede)}</p>
            <div className="ok-hero__act">
              <a className="ok-btn" href="#ok-start">{t(HEAD.start)}</a>
              <a className="ok-link" href="#ok-prices">{t(HERO.prices)}</a>
            </div>
          </div>

          <section className="ok-board" aria-labelledby="ok-rail">
            <span className="ok-tape ok-tape--l" aria-hidden="true" />
            <span className="ok-tape ok-tape--r" aria-hidden="true" />
            <p className="ok-stamp">
              <span>{t(BOARD.nextStart)}</span> <b>{t(BOARD.nextDate)}</b>
            </p>
            <p className="ok-rail" id="ok-rail">{t(BOARD.rail)}</p>
            <div className="ok-tickets">
              {TICKETS.map((item) => {
                const on = item.id === ticket.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`ok-tick${on ? ' is-on' : ''}`}
                    data-kind={item.kind}
                    aria-pressed={on}
                    onClick={() => chooseTicket(item)}
                  >
                    <span className="ok-tick__kind">{t(KIND_NAMES[item.kind])}</span>
                    <span className="ok-tick__wk" aria-hidden="true">
                      <b>{item.done}/{item.total}</b> <span>{t(BOARD.weeks)}</span>
                    </span>
                    <span className="ok-sr">, {fill(t(BOARD.weekOf), { done: item.done, total: item.total })}, </span>
                    <Cells total={item.total} filled={item.done} />
                    <span className="ok-tick__name">{item.client}</span>
                    <span className="ok-tick__what">{t(item.what)}</span>
                  </button>
                );
              })}
            </div>
            <div className="ok-selected" data-kind={ticket.kind}>
              <p className="ok-selected__date">
                <span className="ok-sr">{fill(t(BOARD.next), { client: ticket.client })}: </span>
                {t(ticket.date)}
              </p>
              <p className="ok-selected__news">{t(ticket.news)}</p>
            </div>
            <p className="ok-sr" role="status">{ticketNews}</p>
          </section>
        </section>

        <section className="ok-sec" id="ok-services" aria-labelledby="ok-services-title">
          <div className="ok-sec__head">
            <h2 id="ok-services-title">{t(SERVICES.title)}</h2>
            <p>{t(SERVICES.note)}</p>
          </div>
          <div className="ok-scope">
            <div className="ok-scope__axis" aria-hidden="true">
              {RULER.map((mark) => <span key={mark} style={{ '--at': mark } as CSSProperties}>{mark}</span>)}
            </div>
            {SERVICES.rows.map((row) => (
              <div key={row.kind} className="ok-svc" data-kind={row.kind}>
                <div className="ok-svc__text">
                  <h3><i className="ok-key" aria-hidden="true" />{t(row.name)}</h3>
                  <p>{t(row.body)}</p>
                </div>
                <div className="ok-svc__bar">
                  <Cells total={20} filled={row.from} range={row.to - row.from} />
                  <p className="ok-svc__len"><b>{row.from}–{row.to}</b> <span>{t(SERVICES.weeks)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ok-sec" id="ok-process" aria-labelledby="ok-process-title">
          <div className="ok-sec__head">
            <h2 id="ok-process-title">{t(PROCESS.title)}</h2>
            <p>{t(PROCESS.note)}</p>
          </div>
          <ol className="ok-track" aria-label={t(PROCESS.track)}>
            {PROCESS.track4.map((block, index) => (
              <li key={block.weeks.en} className={block.now !== undefined ? 'is-now' : undefined}>
                <b>{index + 1}</b>
                <span className="ok-track__weeks">
                  {t(block.weeks)}
                  {block.now !== undefined ? <span className="ok-sr">{t(PROCESS.nowSr)}</span> : null}
                </span>
                <Cells total={block.total} filled={block.filled} now={block.now} />
              </li>
            ))}
          </ol>
          <p className="ok-track__note"><b>{t(PROCESS.nowLead)}</b> {t(PROCESS.nowBody)}</p>
          <ol className="ok-steps">
            {PROCESS.steps.map((step, index) => (
              <li key={step.name.en} className="ok-step">
                <span className="ok-step__n" aria-hidden="true">{index + 1}</span>
                <h3>{t(step.name)}</h3>
                <p className="ok-step__len">{t(step.length)}</p>
                <p>{t(step.body)}</p>
                <p className="ok-step__get"><b>{t(PROCESS.youGet)}</b> {t(step.get)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ok-sec" id="ok-prices" aria-labelledby="ok-prices-title">
          <div className="ok-sec__head">
            <h2 id="ok-prices-title">{t(PRICES.title)}</h2>
            <p>{t(PRICES.note)}</p>
          </div>
          <div className="ok-prices">
            <div className="ok-models">
              <div className="ok-model">
                <h3>{t(PRICES.fixed)}</h3>
                <p>{t(PRICES.fixedBody)}</p>
                <ul className="ok-ladder" aria-label={t(PRICES.ladder)}>
                  {LADDER.map((rung) => (
                    <li key={rung.kind} data-kind={rung.kind}>
                      <i className="ok-key" aria-hidden="true" />
                      <span>{t(KIND_NAMES[rung.kind])}</span>
                      <b><Money value={rung.price} /></b>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ok-model">
                <h3>{t(PRICES.team)}</h3>
                <p>{t(PRICES.teamBody)}</p>
                <p className="ok-model__price"><b><Money value="₩24M" /></b> <span>{t(PRICES.aMonth)}</span></p>
              </div>
              <div className="ok-model">
                <h3>{t(PRICES.care)}</h3>
                <p>{t(PRICES.careBody)}</p>
                <p className="ok-model__price"><b><Money value="₩1.8M" /></b> <span>{t(PRICES.aMonth)}</span></p>
              </div>
            </div>

            <aside className="ok-quote" aria-labelledby="ok-quote-no ok-quote-title">
              <div className="ok-quote__no">
                <p id="ok-quote-no"><span className="ok-sr">{t(PRICES.quoteLabel)}, </span>Q-2611</p>
                <p className="ok-quote__dates">{t(PRICES.sent)}<br />{t(PRICES.accepted)}</p>
              </div>
              <h3 id="ok-quote-title">{t(PRICES.quoteTitle)}</h3>
              <dl>
                {QUOTE.map((line) => (
                  <div key={line.item.en}>
                    <dt>{t(line.item)}</dt>
                    <dd><Money value={line.amount} /></dd>
                  </div>
                ))}
                <div className="ok-quote__total">
                  <dt>{t(QUOTE_TOTAL.item)}</dt>
                  <dd><Money value={QUOTE_TOTAL.amount} /></dd>
                </div>
              </dl>
              <p className="ok-quote__pay">{t(PRICES.pay)}</p>
            </aside>
          </div>
        </section>

        <section className="ok-sec" id="ok-work" aria-labelledby="ok-work-title">
          <div className="ok-sec__head">
            <h2 id="ok-work-title">{t(WORK.title)}</h2>
            <p>{t(WORK.note)}</p>
          </div>
          <table className="ok-work" role="table" aria-labelledby="ok-work-title">
            <thead className="ok-sr" role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(WORK.year)}</th>
                <th role="columnheader" scope="col">{t(WORK.client)}</th>
                <th role="columnheader" scope="col">{t(WORK.made)}</th>
                <th role="columnheader" scope="col">{t(WORK.result)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {WORK_ROWS.map((row) => (
                <tr key={row.client} role="row">
                  <td className="ok-work__yr" role="cell" data-label={t(WORK.year)}>{row.year}</td>
                  <th className="ok-work__client" role="rowheader" scope="row" data-label={t(WORK.client)}>
                    <b>{row.client}</b>
                    <span>{t(row.what)}</span>
                  </th>
                  <td className="ok-work__kinds" role="cell" data-label={t(WORK.made)}>
                    {row.kinds.map((kind) => (
                      <span key={kind} data-kind={kind}><i className="ok-key" aria-hidden="true" />{t(KIND_NAMES[kind])}</span>
                    ))}
                  </td>
                  <td className="ok-work__res" role="cell" data-label={t(WORK.result)}>
                    <b>{row.figure}</b> <span>{t(row.unit)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="ok-sec" id="ok-start" aria-labelledby="ok-start-title">
          <div className="ok-sec__head">
            <h2 id="ok-start-title">{t(START.title)}</h2>
            <p>{t(START.note)}</p>
          </div>

          <form className="ok-brief" noValidate onSubmit={send}>
            <fieldset
              className={`ok-slots${errors.month ? ' is-invalid' : ''}`}
              ref={slotsRef}
              aria-describedby={errors.month ? 'ok-month-error' : 'ok-slots-note'}
            >
              <legend className="ok-sr">{t(START.slots)}</legend>
              <div className="ok-slots__head" aria-hidden="true">
                <p className="ok-slots__title">{t(START.slots)}</p>
                <p className="ok-slots__next"><span>{t(START.nextOpening)}</span> <b>{t(BOARD.nextDate)}</b></p>
              </div>
              <p className="ok-sr">{t(START.nextOpening)} {t(BOARD.nextDate)}, {t(nextOpen.name)}.</p>
              <div className="ok-months">
                {MONTHS.map((item) => {
                  const open = SLOTS_PER_MONTH - item.booked;
                  const full = open === 0;
                  const chosen = item.id === month;
                  return (
                    <label key={item.id} className={`ok-month${full ? ' is-full' : ''}${chosen ? ' is-on' : ''}`}>
                      <input
                        className="ok-sr"
                        type="radio"
                        name="ok-month"
                        value={item.id}
                        checked={chosen}
                        disabled={full || sent}
                        aria-invalid={errors.month || undefined}
                        onChange={() => {
                          setMonth(item.id);
                          if (errors.month) setErrors({ ...errors, month: false });
                        }}
                      />
                      <span className="ok-month__name" aria-hidden="true">{t(item.short)}</span>
                      <span className="ok-sr">{t(item.name)}</span>
                      <Cells total={SLOTS_PER_MONTH} filled={item.booked} />
                      <span className="ok-month__open">{full ? t(START.full) : fill(t(START.open), { n: open })}</span>
                    </label>
                  );
                })}
              </div>
              {errors.month ? (
                <p className="ok-error" id="ok-month-error" role="alert">{t(START.errMonth)}</p>
              ) : null}
              <p className="ok-legend" id="ok-slots-note">
                <span><i className="is-f" aria-hidden="true" />{t(START.booked)}</span>
                <span><i aria-hidden="true" />{t(START.openKey)}</span>
                <span>{sent ? t(START.held) : t(START.cap)}</span>
              </p>
            </fieldset>

            {sent ? (
              <div className="ok-done">
                <p className="ok-done__title" ref={doneRef} tabIndex={-1}>{fill(t(START.doneTitle), { name: brief.name.trim() })}</p>
                <p className="ok-done__body">
                  {fill(t(START.doneBody), { email: brief.email.trim(), month: chosenMonth ? t(chosenMonth.name) : '' })}
                </p>
                <dl className="ok-done__facts">
                  <div><dt>{t(START.doneWork)}</dt><dd>{kindList}</dd></div>
                  <div><dt>{t(START.doneBudget)}</dt><dd>{budgetLabel ? t(budgetLabel.label) : ''}</dd></div>
                  <div><dt>{t(START.when)}</dt><dd>{chosenMonth ? t(chosenMonth.name) : ''}</dd></div>
                </dl>
                <button className="ok-btn ok-btn--plain" type="button" onClick={() => setSent(false)}>{t(START.edit)}</button>
              </div>
            ) : (
              <div className="ok-fields">
                <div className={`ok-field${errors.name ? ' is-invalid' : ''}`}>
                  <label htmlFor="ok-name">{t(START.name)}</label>
                  <input
                    id="ok-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    required
                    value={brief.name}
                    aria-invalid={errors.name || undefined}
                    aria-describedby={errors.name ? 'ok-name-error' : undefined}
                    onChange={(event) => {
                      setBrief({ ...brief, name: event.target.value });
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                  />
                  {errors.name ? <p className="ok-error" id="ok-name-error" role="alert">{t(START.errName)}</p> : null}
                </div>
                <div className={`ok-field${errors.email ? ' is-invalid' : ''}`}>
                  <label htmlFor="ok-email">{t(START.email)}</label>
                  <input
                    id="ok-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    required
                    value={brief.email}
                    aria-invalid={errors.email || undefined}
                    aria-describedby={errors.email ? 'ok-email-error' : undefined}
                    onChange={(event) => {
                      setBrief({ ...brief, email: event.target.value });
                      if (errors.email) setErrors({ ...errors, email: false });
                    }}
                  />
                  {errors.email ? <p className="ok-error" id="ok-email-error" role="alert">{t(START.errEmail)}</p> : null}
                </div>
                <fieldset
                  className={`ok-field ok-kinds${errors.kinds ? ' is-invalid' : ''}`}
                  ref={kindsRef}
                  aria-describedby={errors.kinds ? 'ok-kinds-error' : undefined}
                >
                  <legend>{t(START.kinds)}</legend>
                  <div className="ok-kinds__list">
                    {KIND_ORDER.map((kind) => (
                      <label key={kind} className="ok-check" data-kind={kind}>
                        <input
                          type="checkbox"
                          name="ok-kind"
                          value={kind}
                          checked={kinds.includes(kind)}
                          aria-invalid={errors.kinds || undefined}
                          onChange={() => toggleKind(kind)}
                        />
                        <span>{t(KIND_NAMES[kind])}</span>
                      </label>
                    ))}
                  </div>
                  {errors.kinds ? <p className="ok-error" id="ok-kinds-error" role="alert">{t(START.errKinds)}</p> : null}
                </fieldset>
                <div className={`ok-field${errors.budget ? ' is-invalid' : ''}`}>
                  <label htmlFor="ok-budget">{t(START.budget)}</label>
                  <select
                    id="ok-budget"
                    ref={budgetRef}
                    required
                    value={brief.budget}
                    aria-invalid={errors.budget || undefined}
                    aria-describedby={errors.budget ? 'ok-budget-error' : undefined}
                    onChange={(event) => {
                      setBrief({ ...brief, budget: event.target.value });
                      if (errors.budget) setErrors({ ...errors, budget: false });
                    }}
                  >
                    <option value="" disabled>{t(START.budgetPick)}</option>
                    {BUDGETS.map((item) => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
                  </select>
                  {errors.budget ? <p className="ok-error" id="ok-budget-error" role="alert">{t(START.errBudget)}</p> : null}
                </div>
                <p className="ok-when">
                  {t(START.when)}: {chosenMonth ? <b>{t(chosenMonth.name)}</b> : <span>{t(START.whenNone)}</span>}
                </p>
                <button className="ok-btn ok-btn--send" type="submit">{t(START.send)}</button>
              </div>
            )}
          </form>

          <div className="ok-reach">
            <p className="ok-reach__mail"><span>{t(START.writeTo)}</span> <b>{EMAIL}</b></p>
            <dl>
              <div><dt>{t(START.phone)}</dt><dd>{PHONE}</dd></div>
              <div><dt>{t(START.hours)}</dt><dd>{t(START.hoursValue)}</dd></div>
              <div><dt>{t(START.visit)}</dt><dd>{t(START.visitValue)}</dd></div>
              <div><dt>{t(START.askFor)}</dt><dd>{t(START.askForValue)}</dd></div>
            </dl>
          </div>
        </section>

        <footer className="ok-foot">
          <p>{t(FOOT.where)}</p>
          <p>{t(FOOT.reg)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
