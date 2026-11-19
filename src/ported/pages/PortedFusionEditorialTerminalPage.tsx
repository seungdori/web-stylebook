import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionEditorialTerminalPage.css';

// The page of one issue of Stack Trace, a quarterly magazine about how software
// fails and how teams recover. Newsreader sets what people wrote; Fira Code sets
// what a machine wrote or counted: the log, page numbers, dates and prices.
// Components come from the magazine: a contents list, an article column with the
// byline in the margin, a log figure with its caption, back issues set as log lines.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

// Amber and green are log levels: warning, and ok or resolved.
type Level = 'warn' | 'ok';

const MAGAZINE = 'Stack Trace';

const NAV = {
  label: { en: 'Magazine', ko: '매거진', ja: 'マガジン' },
  issue: { en: 'Issue 04', ko: '04호', ja: '04号' },
  back: { en: 'Back issues', ko: '지난 호', ja: 'バックナンバー' },
  stockists: { en: 'Stockists', ko: '판매처', ja: '取扱店' },
  subscribe: { en: 'Subscribe', ko: '구독', ja: '購読' },
} satisfies Record<string, Tri>;

const ISSUE = {
  title: { en: 'The outage issue', ko: '장애 특집', ja: '障害特集' },
  standfirst: {
    en: 'Seven reports on services that went down and on the people who brought them back. The shortest outage in these pages lasted 44 minutes and the longest ran for six days.',
    ko: '서비스가 멈춘 사례 일곱 편과 그 서비스를 되살린 사람들의 이야기를 싣는다. 이 호에 실린 장애 가운데 가장 짧은 것은 44분, 가장 긴 것은 엿새 동안 이어졌다.',
    ja: '本誌には、停止したサービスに関する7本の記事と、それを復旧させた人々の話を収めた。本号で最も短い障害は44分、最も長いものは6日間に及んだ。',
  },
  facts: [
    {
      key: { en: 'issue', ko: '호', ja: '号' },
      value: { en: '04, 132 pages', ko: '04, 132쪽', ja: '04, 132ページ' },
    },
    {
      key: { en: 'season', ko: '시즌', ja: '季節' },
      value: { en: 'Autumn 2026', ko: '2026년 가을', ja: '2026年秋' },
    },
    {
      key: { en: 'print', ko: '인쇄판', ja: '印刷版' },
      value: { en: '$24 plus postage', ko: '$24 + 우송료', ja: '$24 + 送料' },
    },
    {
      key: { en: 'digital', ko: '디지털판', ja: 'デジタル版' },
      value: { en: '$11, PDF and EPUB', ko: '$11, PDF·EPUB', ja: '$11, PDF・EPUB' },
    },
    {
      key: { en: 'stock', ko: '재고', ja: '在庫' },
      value: { en: 'in print', ko: '인쇄본 재고 있음', ja: '印刷版 在庫あり' },
      level: 'ok',
    },
  ] as Array<{ key: Tri; value: Tri; level?: Level }>,
  buy: { en: 'Where to buy this issue', ko: '이 호를 구입할 수 있는 곳', ja: 'この号の購入先' },
};

// Ordered by page. An entry with `href` is excerpted further down this page.
const CONTENTS = {
  title: { en: 'Contents', ko: '목차', ja: '目次' },
  page: { en: 'page', ko: '쪽', ja: 'ページ' },
  article: { en: 'article', ko: '기사', ja: '記事' },
  author: { en: 'author', ko: '필자', ja: '執筆者' },
  note: {
    en: 'The two underlined reports open on this page.',
    ko: '밑줄이 그어진 두 기사는 이 페이지에서 바로 시작합니다.',
    ja: '下線のある2本の記事は、このページから始まります。',
  },
  items: [
    {
      page: 6,
      title: {
        en: 'The renewal job that reported success for thirty nights',
        ko: '서른 날 동안 성공이라고 보고한 갱신 작업',
        ja: '30夜にわたって成功と報告し続けた更新ジョブ',
      },
      author: 'Ines Okafor',
      href: '#et-lead',
    },
    {
      page: 22,
      title: {
        en: 'Who gets paged at three in the morning',
        ko: '새벽 세 시에 호출을 받는 사람은 누구인가',
        ja: '午前3時に呼び出されるのは誰か',
      },
      author: 'Tomasz Wieczorek',
      href: '#et-second',
    },
    {
      page: 36,
      title: {
        en: 'A status page that told the truth for six days',
        ko: '엿새 동안 사실을 말한 상태 페이지',
        ja: '6日間、真実を伝え続けたステータスページ',
      },
      author: 'Mariam Haddad',
    },
    {
      page: 52,
      title: {
        en: 'Twelve postmortems and what each one left out',
        ko: '사후 분석 열두 건과 각각이 빠뜨린 것',
        ja: '事後検証12件と、それぞれが書き漏らしたこと',
      },
      author: 'Lucía Ferrer',
    },
    {
      page: 70,
      title: {
        en: 'The rollback that needed a rollback',
        ko: '롤백을 다시 롤백해야 했던 배포',
        ja: 'さらに切り戻しが必要になった切り戻し',
      },
      author: 'Dawit Bekele',
    },
    {
      page: 86,
      title: {
        en: 'Rehearsing the loss of a whole region',
        ko: '리전 하나가 통째로 사라졌을 때를 위한 예행연습',
        ja: 'リージョン丸ごと喪失を想定したリハーサル',
      },
      author: 'Sung-min Yoon',
    },
    {
      page: 104,
      title: {
        en: '1,900 support tickets from one bad morning',
        ko: '하루 아침의 장애가 남긴 지원 문의 1,900건',
        ja: 'ある朝の障害が生んだサポートチケット1,900件',
      },
      author: 'Hannah Lindqvist',
    },
  ] as Array<{ page: number; title: Tri; author: string; href?: string }>,
};

const LEAD = {
  by: { en: 'By Ines Okafor', ko: '글 Ines Okafor', ja: '文 Ines Okafor' },
  pages: { en: 'pages 6 to 21', ko: '6–21쪽', ja: '6〜21ページ' },
  bio: {
    en: 'Ines Okafor writes about infrastructure from Lagos. She was on call for a payments company for four years.',
    ko: 'Ines Okafor는 Lagos에서 인프라에 관한 글을 쓴다. 결제 회사에서 4년 동안 당직 엔지니어였다.',
    ja: 'Ines Okafor は Lagos からインフラについて執筆している。決済会社で4年間、当番のエンジニアを務めた。',
  },
  opening: {
    en: "At 02:14 UTC on Tuesday 9 June, the certificate on Harborline's sign-in service expired, and for 44 minutes none of the 3,100 dispatchers on the night shift could sign in. The certificate should have been replaced a month earlier by a job that runs every night at 03:00. Below is what that job logged on 10 May, the first night it tried.",
    ko: '6월 9일 화요일 02:14 UTC에 Harborline 로그인 서비스의 인증서가 만료되었다. 이 때문에 야간 근무 중이던 배차 담당자 3,100명은 44분 동안 아무도 로그인하지 못했다. 이 인증서는 매일 밤 03:00에 실행되는 작업이 한 달 전에 갱신했어야 했다. 아래는 그 작업이 처음 시도한 5월 10일 밤의 로그다.',
    ja: '6月9日(火) 02:14 UTC、Harborlineのサインインサービスの証明書が期限切れになり、夜勤の配車係3,100名は44分間、誰もサインインできなかった。証明書は、毎晩03:00に走るジョブが1か月前に更新しているはずだった。以下は、そのジョブが初めて試行した5月10日の夜のログである。',
  },
  // The first of these refers to line 5 of the log figure.
  body: [
    {
      en: "Line 5 is the only place where the job says that something went wrong. Three days earlier Harborline had moved its DNS to a new provider, and the job still held the old provider's credentials, so the record that proves ownership of the domain was never published and the issuer gave up after 30 seconds. The job kept the old certificate, treated that as a normal outcome and exited with code 0.",
      ko: '5번 줄은 작업이 무언가 잘못되었다고 말하는 유일한 곳이다. 3일 전 Harborline은 DNS를 새 제공업체로 옮겼지만 작업은 여전히 이전 제공업체의 자격 증명을 가지고 있었다. 그래서 도메인의 소유를 증명하는 레코드가 게시되지 않았고, 발급 기관은 30초 뒤 시도를 포기했다. 작업은 기존 인증서를 그대로 두고 이를 정상 결과로 처리한 뒤 종료 코드 0으로 끝났다.',
      ja: '5行目は、ジョブが何かがおかしいと書き残した唯一の箇所である。3日前にHarborlineはDNSを新しいプロバイダーへ移していたが、ジョブは旧プロバイダーの認証情報を保持したままだった。そのためドメインの所有を証明するレコードは公開されず、発行元は30秒で諦めた。ジョブは古い証明書を残し、それを正常な結果として扱って、終了コード0で終えた。',
    },
    {
      en: "The scheduler reads nothing except the exit code, which is how the last line came to be written on thirty nights in a row. The team's dashboard showed thirty green ticks. The warning went to a log stream that carries about 11,000 warnings a day, and nobody is expected to read it.",
      ko: '스케줄러는 종료 코드 말고는 아무것도 읽지 않는다. 그래서 마지막 줄이 서른 밤 연속으로 기록되었다. 팀의 대시보드에는 초록색 체크 표시가 서른 개 떠 있었다. 경고는 하루에 약 11,000건씩 쌓이는 로그 스트림으로 갔고, 이를 읽도록 되어 있는 사람은 없었다.',
      ja: 'スケジューラーは終了コード以外を読まない。そのため最後の行は30夜連続で書き込まれた。チームのダッシュボードには緑のチェックマークが30個並んでいた。警告は1日に約11,000件の警告が流れるログストリームへ送られ、それを読むことになっている人はいなかった。',
    },
    {
      en: 'Kenji Arai, the engineer on call on 9 June, found the expired certificate in nine minutes. The other 35 went on issuing a replacement by hand, because the last person to do that had left the company in 2024 and the steps were in her notes.',
      ko: '6월 9일 당직이던 Kenji Arai는 9분 만에 만료된 인증서를 찾았다. 나머지 35분 동안은 새 인증서를 손으로 발급했다. 그 일을 마지막으로 했던 사람이 2024년에 회사를 떠났고, 절차는 그 사람의 메모에만 남아 있었다.',
      ja: 'Kenji Arai は6月9日の当番エンジニアで、9分で期限切れの証明書を見つけた。残りの35分は、新しい証明書を手作業で発行し続けた。その作業を最後に担当した人物は2024年に退職しており、手順は彼女のメモにしか残っていなかったからだ。',
    },
  ] as Tri[],
  nightLabel: {
    en: 'The night of 9 June, times in UTC',
    ko: '6월 9일 밤, 시간은 UTC 기준',
    ja: '6月9日(火)の夜、時刻はUTC',
  },
  night: [
    { time: '02:14', event: { en: 'certificate expires', ko: '인증서 만료', ja: '証明書の期限切れ' } },
    { time: '02:23', event: { en: 'cause found', ko: '원인 확인', ja: '原因を特定' } },
    { time: '02:58', event: { en: 'sign-in restored', ko: '로그인 복구', ja: 'サインインを復旧' }, level: 'ok' },
  ] as Array<{ time: string; event: Tri; level?: Level }>,
  more: {
    en: 'This is the opening of a 16-page report.',
    ko: '16쪽짜리 기사의 도입부다.',
    ja: '16ページの記事の冒頭部分である。',
  },
  moreLink: { en: 'Find Issue 04 in a shop', ko: '04호를 파는 곳 찾기', ja: '04号を取り扱う店を探す' },
};

// What the job wrote. Machine output is the same in every language.
const LOG = {
  file: '/var/log/jobs/cert-renew.log',
  date: '2026-05-10',
  lines: [
    { time: '03:00:00.118', level: 'info', source: 'cert-renew', message: 'run 4417 started, 14 certificates to check' },
    { time: '03:00:00.640', level: 'info', source: 'cert-renew', message: 'api.harborline.io valid for 61 days, skipped' },
    { time: '03:00:01.102', level: 'info', source: 'cert-renew', message: 'auth.harborline.io valid for 29 days, renewing' },
    { time: '03:00:01.977', level: 'info', source: 'cert-renew', message: 'dns-01 challenge requested from issuer' },
    { time: '03:00:31.979', level: 'warn', source: 'cert-renew', message: 'challenge timed out after 30 s, certificate kept' },
    { time: '03:00:31.981', level: 'info', source: 'cert-renew', message: 'auth.harborline.io expires 2026-06-09 02:14 UTC' },
    { time: '03:00:33.410', level: 'info', source: 'cert-renew', message: '0 renewed, 1 kept, 13 skipped' },
    { time: '03:00:33.412', level: 'info', source: 'cert-renew', message: 'exit code 0' },
    { time: '03:00:33.530', level: 'ok', source: 'scheduler', message: 'job cert-renew succeeded in 33.3 s' },
  ] as Array<{ time: string; level: 'info' | Level; source: string; message: string }>,
  caption: {
    en: "The renewal job's log for 10 May 2026, reproduced with Harborline's permission. Times are UTC. The scheduler wrote the last line and the job wrote the rest.",
    ko: '2026년 5월 10일 갱신 작업의 로그를 Harborline의 허락을 받아 옮겼다. 시간은 UTC 기준이다. 마지막 줄은 스케줄러가, 나머지는 작업이 기록했다.',
    ja: '2026年5月10日の更新ジョブのログを、Harborlineの許可を得て転載した。時刻はUTC。最後の行はスケジューラーが、残りはジョブが書き込んだ。',
  },
};

const SECOND = {
  by: { en: 'By Tomasz Wieczorek', ko: '글 Tomasz Wieczorek', ja: '文 Tomasz Wieczorek' },
  pages: { en: 'pages 22 to 35', ko: '22–35쪽', ja: '22〜35ページ' },
  body: [
    {
      en: 'Calder Freight employs 31 engineers and runs one pager rota. In 2025 the pager went off 511 times between midnight and six in the morning, and 412 of those pages woke one of the same six people.',
      ko: 'Calder Freight는 엔지니어 31명이 있고 호출 당번표는 하나다. 2025년에는 자정부터 오전 여섯 시 사이에 호출이 511번 울렸고, 그중 412번은 같은 여섯 명 가운데 한 명을 깨웠다.',
      ja: 'Calder Freightはエンジニア31名を抱え、呼び出し当番は1つの表で回している。2025年は深夜0時から午前6時までに呼び出しが511回鳴り、そのうち412回は同じ6名のいずれかを起こした。',
    },
    {
      en: 'The six are the platform team. They own the database, the queue and the deploy system, so a page reaches them first whoever wrote the change that caused it. Two of them resigned during the year, and both named broken sleep in their exit interviews.',
      ko: '그 여섯 명은 플랫폼 팀이다. 데이터베이스, 큐, 배포 시스템을 이들이 맡고 있어서, 원인이 된 변경을 누가 작성했든 호출은 이들에게 먼저 간다. 올해 이 가운데 두 명이 퇴사했고, 두 사람 모두 퇴사 면담에서 깨진 수면을 이유로 꼽았다.',
      ja: 'その6名はプラットフォームチームである。データベース、キュー、デプロイシステムを担当しているため、原因となった変更を誰が書いたとしても、呼び出しはまず彼らに届く。今年、そのうち2名が退職し、2名とも退職面談で睡眠が崩れたことを理由に挙げた。',
    },
  ] as Tri[],
  tally: {
    team: { en: 'team', ko: '팀', ja: 'チーム' },
    rota: { en: 'on the rota', ko: '당번 인원', ja: '当番' },
    pages: { en: 'night pages', ko: '야간 호출', ja: '夜間の呼び出し' },
    rows: [
      { team: { en: 'platform', ko: '플랫폼', ja: 'プラットフォーム' }, rota: 6, pages: 412 },
      { team: { en: 'payments', ko: '결제', ja: '決済' }, rota: 9, pages: 96 },
      { team: { en: 'mobile', ko: '모바일', ja: 'モバイル' }, rota: 16, pages: 3 },
    ] as Array<{ team: Tri; rota: number; pages: number }>,
    total: { team: { en: 'all teams', ko: '전체', ja: '全チーム' }, rota: 31, pages: 511 },
    caption: {
      en: "Pages sent between 00:00 and 06:00 at Calder Freight in 2025, from the paging tool's export.",
      ko: '2025년 Calder Freight에서 00:00~06:00 사이에 발송된 호출. 호출 도구의 내보내기 자료.',
      ja: '2025年にCalder Freightが00:00〜06:00の間に送信した呼び出し。呼び出しツールのエクスポートより。',
    },
  },
  more: {
    en: 'This is the opening of a 14-page report.',
    ko: '14쪽짜리 기사의 도입부다.',
    ja: '14ページの記事の冒頭部分である。',
  },
  moreLink: { en: 'Subscribe from Issue 05', ko: '05호부터 구독하기', ja: '05号から購読する' },
};

type Edition = 'print' | 'digital';

const EDITIONS: Array<{ id: Edition; name: Tri; body: Tri; price: Tri; delivery: [Tri, Tri]; done: Tri; charge: Tri }> = [
  {
    id: 'print',
    name: { en: 'Print', ko: '인쇄판', ja: '印刷版' },
    body: { en: 'Four issues a year by post', ko: '연 4회 발행, 우편 배송', ja: '年4号、郵送でお届け' },
    price: { en: '$84 a year', ko: '연 $84', ja: '年額 $84' },
    delivery: [
      { en: 'postage', ko: '우송료', ja: '送料' },
      { en: 'included, worldwide', ko: '전 세계 배송비 포함', ja: '全世界で送料込み' },
    ],
    // {email} is replaced with the address that was entered.
    done: {
      en: 'You are subscribed to the print edition. A receipt is on its way to {email}.',
      ko: '인쇄판 구독이 완료되었습니다. 영수증이 {email} 주소로 발송되고 있습니다.',
      ja: '印刷版の購読が完了しました。領収書は{email}宛てに送信されています。',
    },
    charge: {
      en: '$84 a year, charged when Issue 05 ships',
      ko: '05호 발송 시 연 $84 결제',
      ja: '05号の発送時に年額 $84を請求',
    },
  },
  {
    id: 'digital',
    name: { en: 'Digital', ko: '디지털판', ja: 'デジタル版' },
    body: {
      en: 'Four issues a year as PDF and EPUB',
      ko: '연 4회 발행, PDF·EPUB 파일',
      ja: '年4号、PDFとEPUB',
    },
    price: { en: '$36 a year', ko: '연 $36', ja: '年額 $36' },
    delivery: [
      { en: 'files', ko: '파일', ja: 'ファイル' },
      { en: 'sent by email, no DRM', ko: '이메일 발송, DRM 없음', ja: 'メール送信、DRMなし' },
    ],
    done: {
      en: 'You are subscribed to the digital edition. A receipt is on its way to {email}.',
      ko: '디지털판 구독이 완료되었습니다. 영수증이 {email} 주소로 발송되고 있습니다.',
      ja: 'デジタル版の購読が完了しました。領収書は{email}宛てに送信されています。',
    },
    charge: {
      en: '$36 a year, charged when Issue 05 ships',
      ko: '05호 발송 시 연 $36 결제',
      ja: '05号の発送時に年額 $36を請求',
    },
  },
];

const SUBSCRIBE = {
  title: {
    en: 'Four issues a year, by post or as a download',
    ko: '연 4회 발행, 우편 배송 또는 다운로드',
    ja: '年4号、郵送またはダウンロード版',
  },
  intro: {
    en: 'Subscribers receive each issue two weeks before it reaches the shops. Choose an edition, then enter the email address the receipt should go to.',
    ko: '구독자는 각 호를 서점에 나오기 2주 전에 받습니다. 판을 고른 뒤 영수증을 받을 이메일 주소를 입력해 주세요.',
    ja: '購読者は各号を、書店に並ぶ2週間前に受け取ります。版を選んでから、領収書を受け取るメールアドレスを入力してください。',
  },
  edition: { en: 'Edition', ko: '판', ja: '版' },
  first: { en: 'first', ko: '첫 호', ja: '初回' },
  firstValue: { en: 'Issue 05, January 2027', ko: '05호, 2027년 1월', ja: '05号、2027年1月' },
  renews: { en: 'renews', ko: '갱신', ja: '更新' },
  renewsValue: {
    en: 'each January, cancel any time',
    ko: '매년 1월 갱신, 언제든 해지 가능',
    ja: '毎年1月に更新、いつでも解約可能',
  },
  label: { en: 'Email address', ko: '이메일 주소', ja: 'メールアドレス' },
  submit: { en: 'Subscribe', ko: '구독하기', ja: '購読する' },
  small: {
    en: 'Nothing is charged until Issue 05 ships.',
    ko: '05호가 발송되기 전까지는 어떤 금액도 청구되지 않습니다.',
    ja: '05号が発送されるまで、料金は請求されません。',
  },
  error: {
    en: 'Enter an email address with an @ and a domain, such as you@example.com.',
    ko: '@와 도메인이 포함된 이메일 주소를 입력해 주세요. 예: you@example.com',
    ja: '@とドメインを含むメールアドレスを入力してください。例: you@example.com',
  },
  status: { en: 'status', ko: '상태', ja: '状態' },
  statusValue: { en: 'ok, subscription recorded', ko: 'ok, 구독 접수 완료', ja: 'ok, 購読を受け付けました' },
  price: { en: 'price', ko: '금액', ja: '料金' },
} satisfies Record<string, Tri>;

const BACK = {
  title: { en: 'Back issues', ko: '지난 호', ja: 'バックナンバー' },
  rows: [
    {
      number: '03',
      season: { en: 'Summer 2026', ko: '2026년 여름', ja: '2026年夏' },
      title: { en: 'The migration issue', ko: '이관 특집', ja: '移行特集' },
      stock: { en: 'in print', ko: '인쇄본 재고 있음', ja: '印刷版 在庫あり' },
      level: 'ok',
      price: { en: '$24', ko: '$24', ja: '$24' },
    },
    {
      number: '02',
      season: { en: 'Spring 2026', ko: '2026년 봄', ja: '2026年春' },
      title: { en: 'The on-call issue', ko: '당직 특집', ja: '当番特集' },
      stock: { en: '38 copies left', ko: '38부 남음', ja: '残り38部' },
      level: 'warn',
      price: { en: '$24', ko: '$24', ja: '$24' },
    },
    {
      number: '01',
      season: { en: 'Winter 2026', ko: '2026년 겨울', ja: '2026年冬' },
      title: { en: 'The legacy code issue', ko: '레거시 코드 특집', ja: 'レガシーコード特集' },
      stock: { en: 'print sold out', ko: '인쇄본 품절', ja: '印刷版 売り切れ' },
      price: { en: '$11 digital', ko: '$11 디지털판', ja: '$11 デジタル版' },
    },
  ] as Array<{ number: string; season: Tri; title: Tri; stock: Tri; level?: Level; price: Tri }>,
};

const STOCKISTS = {
  title: { en: 'Stockists', ko: '판매처', ja: '取扱店' },
  note: {
    en: 'Issue 04 is on the shelf in these six shops at $24 or the local equivalent.',
    ko: '04호는 아래 여섯 곳의 서점에 진열되어 있으며, 가격은 $24 또는 현지 통화로 환산한 금액입니다.',
    ja: '04号は下記の6店舗で販売しており、価格は$24またはそれに相当する現地通貨の金額です。',
  },
  shops: [
    { city: { en: 'Berlin', ko: 'Berlin', ja: 'Berlin' }, name: 'Zeile und Spalte', street: 'Oranienstraße 22' },
    { city: { en: 'Lagos', ko: 'Lagos', ja: 'Lagos' }, name: 'Paper Harbour', street: '14 Raymond Njoku Street, Ikoyi' },
    { city: { en: 'Lisbon', ko: 'Lisbon', ja: 'Lisbon' }, name: 'Tinta Fresca', street: 'Rua da Rosa 81' },
    { city: { en: 'Melbourne', ko: 'Melbourne', ja: 'Melbourne' }, name: 'Stapled', street: '7 Degraves Lane' },
    { city: { en: 'Seoul', ko: 'Seoul', ja: 'Seoul' }, name: 'Yeonnam Print Room', street: '29 Donggyo-ro 38-gil' },
    { city: { en: 'Toronto', ko: 'Toronto', ja: 'Toronto' }, name: 'Second Edition', street: '912 Queen Street West' },
  ] as Array<{ city: Tri; name: string; street: string }>,
};

const COLOPHON = {
  title: { en: 'Colophon', ko: '만든 사람들', ja: '奥付' },
  note: {
    en: 'Stack Trace is a quarterly magazine about how software fails and how teams recover. It is written by the people who were there.',
    ko: 'Stack Trace는 소프트웨어가 어떻게 실패하고 팀이 어떻게 회복하는지 다루는 계간지다. 그 자리에 있었던 사람들이 직접 쓴다.',
    ja: 'Stack Traceは、ソフトウェアがどのように壊れ、チームがどのように立ち直るかを扱う季刊誌である。その場に居合わせた人々が書いている。',
  },
  rows: [
    [
      { en: 'editor', ko: '편집장', ja: '編集長' },
      { en: 'Clara Ibekwe', ko: 'Clara Ibekwe', ja: 'Clara Ibekwe' },
    ],
    [
      { en: 'printer', ko: '인쇄', ja: '印刷' },
      { en: 'Northfold Press, Leeds', ko: 'Northfold Press, Leeds', ja: 'Northfold Press, Leeds' },
    ],
    [
      { en: 'paper', ko: '용지', ja: '用紙' },
      {
        en: '115 gsm uncoated cream, cover on 300 gsm board',
        ko: '115 gsm 무코팅 크림색 본문 용지, 표지 300 gsm 보드지',
        ja: '115 gsm 非コートのクリーム色用紙、表紙は300 gsmのボード紙',
      },
    ],
  ] as Array<[Tri, Tri]>,
};

const PROMPT_EN = `Design one real page in Editorial × Terminal fusion: a dark magazine page where a serif sets everything a person wrote and a monospace sets everything a machine wrote or counted.

Pick a believable subject in which prose and machine output belong on the same page, such as a magazine about software failures, an incident review, a changelog with essays or a book about operations, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #0a0e08
--surface: #161b13
--ink: #f4ecd6
--muted: #a8a593
--line: rgba(244,236,214,0.3)
--amber: #ffb45a
--green: #7aff9c
No other colours. Amber and green are log levels with a fixed meaning: amber is a warning, green is ok or resolved. They never decorate. In the log figure the level is always written as a word beside the colour; elsewhere the colour only accompanies words that already state the status, such as "in print".

TYPOGRAPHY:
Two families. Newsreader (variable, optical size 6 to 72, weights 400 to 600, roman and italic) for headlines and prose. Fira Code 400 for the log, page numbers, dates, prices and field names.
Title: Newsreader 400 at optical size 72, clamp(3.5rem, 12.2vw, 9.75rem), line-height 0.9, tracking -0.038em
Article headlines: Newsreader 400 at optical size 72, clamp(2.375rem, 4.6vw, 3.5rem), line-height 1, tracking -0.028em. Minor headings 2rem, weight 500.
Prose: Newsreader 400 at optical size 16, 1.3125rem, line-height 1.52, measure 31em. Standfirst 1.5rem, line-height 1.36.
Italic: authors, the byline and captions, nothing else.
Mono: 0.8125rem, line-height 1.55, field names in lower case, ligatures off. Page numbers 0.9375rem.
Large headlines stay light. No bold headlines and no sans-serif.

LAYOUT:
- One 12-column grid for the whole page, 24px gap, max width about 1120px: a margin of four columns for who, when and how much, and eight columns for the reading.
- Hero: a masthead line with in-page links, the issue title across the full width, then the standfirst, the issue facts as key and value rows and one text link in the margin, with the table of contents beside them as the hero object.
- Lead excerpt: the headline over the reading columns; byline, page range and a short biography in the margin; four paragraphs; one log figure across the full width. One sentence of the prose refers to a line number of the figure.
- A second, shorter excerpt: the byline under the headline and a small table of figures in the margin.
- Subscribe: two editions as ruled rows, the price of the chosen edition in the margin, one single-line email field.
- Back issues as a short log, stockists and colophon as plain rows, one footer line.
- Sections are separated by a 1px line and 48px of space.

COMPONENTS:
- Contents: an ordered list by page. The page number sits in a gutter, then the title at 1.4375rem weight 500, then the author in italic. A 1px ink rule on top, 1px lines between rows, column names in lower-case mono.
- Log figure: a figure with an italic figcaption. A header with the file path and the date, then an ordered list of lines with number, time, level, source and message. Number, time, level and source hang in the margin so the messages start on the same edge as the prose. A 1px vertical rule follows the line numbers. The warn line is amber and the ok line is green, with the words warn and ok in the level column.
- Key and value rows: mono, the key in the muted colour.
- Edition choice: two native radio inputs drawn as rows with a square marker. The price is an output element that changes with the choice.
- Email field: an input on a 1px ink underline with a text button on the same line, a visible label, the error under the field in amber with role="alert". On success the form is replaced by a confirmation that receives focus.
- Actions are underlined words with a 2px underline. Square corners everywhere.

MOTION:
- None. The page is still, and hover changes only an underline.

FORBIDDEN:
- Cards, pills, chips, rounded boxes and filled buttons
- A small label above a heading, and all-caps tracked labels
- Drop caps, rules between paragraphs, pull-quote brackets, stamps and seals
- A blinking cursor, $ prompts, command lines between sections, ASCII borders, scanlines, glow and typewriter effects
- Amber or green as decoration, or a level shown by colour alone
- A palette switcher, a marquee, numbered section labels
- Monospace for prose, or the serif for machine output

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS: an ordered contents list, article, figure and figcaption, a labelled form
3) Responsive layout down to 320px with no horizontal scroll: one column below 1024px, and on phones each log line puts its message under its fields
4) Visible focus, an edition choice that works from the keyboard, announced error and confirmation, reduced-motion support`;

const PROMPT_KO = `Editorial × Terminal 융합으로 실제 페이지 하나를 디자인한다. 사람이 쓴 글은 모두 세리프로, 기계가 쓰거나 센 값은 모두 모노스페이스로 조판하는 어두운 매거진 페이지다.

문장과 기계 출력이 한 페이지에 함께 놓일 법한 주제를 고르고 실제 내용을 쓴다. 예: 소프트웨어 장애를 다루는 매거진, 장애 회고, 에세이가 붙은 변경 기록, 운영을 다룬 책. 페이지는 그 주제의 페이지로 읽혀야 하며, 자기 스타일을 다루는 페이지로 읽혀서는 안 된다.

COLOR TOKENS:
--bg: #0a0e08
--surface: #161b13
--ink: #f4ecd6
--muted: #a8a593
--line: rgba(244,236,214,0.3)
--amber: #ffb45a
--green: #7aff9c
다른 색은 쓰지 않는다. 앰버와 그린은 고정된 의미를 가진 로그 레벨이다. 앰버는 경고, 그린은 ok 또는 해결됨을 뜻한다. 장식으로 쓰지 않는다. 로그 도표에서는 레벨을 항상 색 옆에 글자로 적고, 그 밖에서는 색을 이미 상태를 말하는 글자, 예컨대 "인쇄본 재고 있음"에만 붙인다.

TYPOGRAPHY:
서체는 두 가지다. 제목과 본문에는 Newsreader(가변, 광학 크기 6~72, 굵기 400~600, 로만과 이탤릭)를 쓴다. 로그, 쪽 번호, 날짜, 가격, 필드 이름에는 Fira Code 400을 쓴다.
제목: Newsreader 400, 광학 크기 72, clamp(3.5rem, 12.2vw, 9.75rem), 행간 0.9, 자간 -0.038em
기사 제목: Newsreader 400, 광학 크기 72, clamp(2.375rem, 4.6vw, 3.5rem), 행간 1, 자간 -0.028em. 보조 제목은 2rem, 굵기 500.
본문: Newsreader 400, 광학 크기 16, 1.3125rem, 행간 1.52, 줄 길이 31em. 스탠드퍼스트는 1.5rem, 행간 1.36.
이탤릭은 필자 이름, 바이라인, 캡션에만 쓴다. 그 밖에는 쓰지 않는다.
모노: 0.8125rem, 행간 1.55, 필드 이름은 소문자, 합자 끔. 쪽 번호는 0.9375rem.
큰 제목은 가볍게 유지한다. 굵은 제목과 산세리프는 쓰지 않는다.

LAYOUT:
- 페이지 전체에 12열 그리드 하나를 쓴다. 간격 24px, 최대 너비 약 1120px. 왼쪽 4열은 누가, 언제, 얼마인지를 담는 여백이고, 나머지 8열은 본문이다.
- 히어로: 페이지 내 링크가 있는 매거진 머리글 줄, 전체 너비에 걸친 호 제목, 이어서 스탠드퍼스트, 키와 값으로 된 호 정보 행, 여백에 텍스트 링크 하나. 목차를 히어로의 주요 요소로 그 옆에 둔다.
- 리드 발췌: 제목은 본문 열 위에 둔다. 여백에는 바이라인, 쪽 범위, 짧은 소개를 둔다. 단락은 네 개. 전체 너비에 로그 도표 하나를 둔다. 본문의 문장 하나는 도표의 줄 번호를 가리킨다.
- 두 번째 짧은 발췌: 제목 아래 바이라인, 여백에 작은 수치표를 둔다.
- 구독: 두 판을 선이 그어진 행으로 보여 준다. 선택한 판의 가격은 여백에 둔다. 이메일 입력란은 한 줄짜리 하나.
- 지난 호는 짧은 로그 형식으로, 판매처와 만든 사람들은 평범한 행으로, 푸터는 한 줄로 둔다.
- 섹션은 1px 선과 48px 여백으로 구분한다.

COMPONENTS:
- 목차: 쪽 순서대로 정렬된 목록. 쪽 번호는 거터에 두고, 이어서 제목은 1.4375rem, 굵기 500, 필자 이름은 이탤릭으로 둔다. 맨 위에 1px 잉크색 선, 행 사이에 1px 선, 열 이름은 소문자 모노로 쓴다.
- 로그 도표: 이탤릭 figcaption이 달린 figure. 파일 경로와 날짜가 있는 머리글, 이어서 번호, 시간, 레벨, 소스, 메시지를 담은 순서 목록. 번호, 시간, 레벨, 소스는 여백에 내어 놓고, 메시지는 본문과 같은 가장자리에서 시작하게 한다. 줄 번호 뒤에 1px 세로선을 둔다. warn 줄은 앰버, ok 줄은 그린으로 표시하고, 레벨 열에 warn과 ok라는 단어를 쓴다.
- 키와 값의 행: 모노, 키는 뮤트 색으로 쓴다.
- 판 선택: 네이티브 라디오 입력 두 개를 사각 표식이 있는 행으로 그린다. 가격은 선택에 따라 바뀌는 output 요소로 둔다.
- 이메일 입력란: 1px 잉크색 밑줄 위의 입력창, 같은 줄의 텍스트 버튼, 보이는 레이블. 오류는 입력란 아래에 앰버색으로 role="alert"와 함께 표시한다. 성공 시 폼을 포커스를 받는 확인 메시지로 바꾼다.
- 동작은 2px 밑줄을 그은 단어로 표시한다. 모든 모서리는 직각이다.

MOTION:
- 없음. 페이지는 정지 상태이며, 호버는 밑줄만 바꾼다.

FORBIDDEN:
- 카드, 알약형 태그, 칩, 둥근 상자, 채워진 버튼
- 제목 위의 작은 라벨, 대문자에 자간을 준 라벨
- 드롭 캡, 단락 사이의 선, 풀쿼트 괄호, 스탬프와 인장
- 깜빡이는 커서, $ 프롬프트, 섹션 사이의 명령줄, ASCII 테두리, 스캔라인, 글로우, 타자기 효과
- 장식으로 쓴 앰버나 그린, 색만으로 나타낸 레벨
- 팔레트 전환기, 흐르는 텍스트, 번호가 붙은 섹션 라벨
- 본문에 모노스페이스, 기계 출력에 세리프

OUTPUT:
1) CSS 커스텀 속성
2) 시맨틱 HTML과 CSS: 순서 목록으로 된 목차, article, figure와 figcaption, 레이블이 붙은 폼
3) 320px까지 가로 스크롤 없는 반응형 레이아웃: 1024px 미만에서는 한 열, 휴대폰에서는 각 로그 줄의 메시지를 필드 아래에 둔다.
4) 보이는 포커스, 키보드로 조작할 수 있는 판 선택, 스크린 리더가 읽는 오류와 확인 메시지, 동작 줄이기 설정 지원`;

const PROMPT_JA = `Editorial × Terminal の融合で、実在するページを1枚デザインする。人が書いた文章はすべてセリフ体、機械が書いたり数えたりした値はすべてモノスペース体で組んだ、ダークなマガジンページ。

題材は、散文と機械の出力が同じページにあるのが自然なものを1つ選び、実際の内容を書く。例: ソフトウェア障害を扱うマガジン、インシデントのレビュー、エッセイ付きの変更履歴、運用についての本。ページはその題材のページとして読めなければならず、自分のスタイルについてのページに読めてはならない。

COLOR TOKENS:
--bg: #0a0e08
--surface: #161b13
--ink: #f4ecd6
--muted: #a8a593
--line: rgba(244,236,214,0.3)
--amber: #ffb45a
--green: #7aff9c
他の色は使わない。アンバーとグリーンは意味が固定されたログレベルである。アンバーは警告、グリーンは ok または解決済みを示す。装飾には使わない。ログ図ではレベルを必ず色の横に文字で書き、それ以外では色は「印刷版 在庫あり」のように、状態をすでに言葉で示す表示にだけ添える。

TYPOGRAPHY:
書体は2系統。見出しと本文には Newsreader（可変、光学サイズ 6〜72、ウェイト 400〜600、ローマン体とイタリック体）を使う。ログ、ページ番号、日付、価格、フィールド名には Fira Code 400 を使う。
タイトル: Newsreader 400、光学サイズ 72、clamp(3.5rem, 12.2vw, 9.75rem)、行間 0.9、字間 -0.038em
記事の見出し: Newsreader 400、光学サイズ 72、clamp(2.375rem, 4.6vw, 3.5rem)、行間 1、字間 -0.028em。小見出しは 2rem、ウェイト 500。
本文: Newsreader 400、光学サイズ 16、1.3125rem、行間 1.52、行長 31em。スタンドファーストは 1.5rem、行間 1.36。
イタリックは執筆者名、バイライン、キャプションにだけ使う。それ以外には使わない。
モノ: 0.8125rem、行間 1.55、フィールド名は小文字、合字オフ。ページ番号は 0.9375rem。
大きな見出しは細めに保つ。太字の見出しとサンセリフは使わない。

LAYOUT:
- ページ全体に12カラムのグリッドを1つ使う。間隔 24px、最大幅約 1120px。左の4カラムは誰が・いつ・いくらかを置く余白、残りの8カラムを本文に使う。
- ヒーロー: ページ内リンクのあるマストヘッドの行、全幅の号タイトル、続けてスタンドファースト、キーと値の行で示した号の情報、余白に文字リンクを1つ。目次をヒーローの主要素として横に置く。
- リード抜粋: 見出しは本文のカラムの上に置く。余白にはバイライン、ページ範囲、短い紹介文を置く。段落は4つ。全幅にログ図版を1つ置く。本文の1文は図版の行番号を指す。
- 2本目の短い抜粋: 見出しの下にバイライン、余白に小さな数値表を置く。
- 購読: 2つの版を罫線付きの行として並べる。選んだ版の価格は余白に置く。メール入力欄は1行のものを1つ。
- バックナンバーは短いログ形式、取扱店と奥付は素の行、フッターは1行。
- セクションは 1px の線と 48px の余白で区切る。

COMPONENTS:
- 目次: ページ順の番号付きリスト。ページ番号はガターに置き、続けてタイトルを 1.4375rem、ウェイト 500、執筆者名をイタリックで置く。上端に 1px のインク色の罫線、行の間に 1px の線、列名は小文字のモノ。
- ログ図版: イタリックの figcaption を持つ figure。ファイルパスと日付のヘッダー、続けて番号、時刻、レベル、ソース、メッセージを並べた順序付きリスト。番号、時刻、レベル、ソースは余白に出し、メッセージは本文と同じ端から始まるようにする。行番号の後ろに 1px の縦線を置く。warn の行はアンバー、ok の行はグリーンにし、レベル列に warn と ok の語を書く。
- キーと値の行: モノ。キーはミュート色にする。
- 版の選択: ネイティブのラジオ入力2つを、四角いマーカーのある行として描く。価格は選択に応じて変わる output 要素にする。
- メール入力欄: 1px のインク色の下線の上に入力欄、同じ行にテキストボタン、見えるラベル。エラーは入力欄の下にアンバーで role="alert" を付けて表示する。成功したら、フォームをフォーカスを受ける確認表示に置き換える。
- 操作は 2px の下線を引いた語で示す。角はすべて直角にする。

MOTION:
- なし。ページは静止しており、ホバーは下線だけを変える。

FORBIDDEN:
- カード、ピル型のタグ、チップ、角丸の箱、塗りつぶしのボタン
- 見出しの上の小さなラベル、字間を空けた大文字のラベル
- ドロップキャップ、段落の間の罫線、プルクオートの括弧、スタンプと印章
- 点滅するカーソル、$ のプロンプト、セクション間のコマンド行、ASCII の枠、スキャンライン、グロー、タイプライター効果
- 装飾としてのアンバーやグリーン、色だけで示すレベル
- パレットの切り替え、流れるテキスト、番号付きのセクションラベル
- 本文のモノスペース、機械の出力のセリフ体

OUTPUT:
1) CSS カスタムプロパティ
2) セマンティックな HTML と CSS: 順序付きリストの目次、article、figure と figcaption、ラベル付きのフォーム
3) 320px まで横スクロールのないレスポンシブレイアウト: 1024px 未満では1カラム、スマートフォンでは各ログ行のメッセージをフィールドの下に置く
4) 見えるフォーカス、キーボードで操作できる版の選択、読み上げられるエラーと確認、動きを減らす設定への対応`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_KO,
  ja: PROMPT_JA,
};

type FormState = 'idle' | 'error' | 'done';

export function PortedFusionEditorialTerminalPage({ lang }: PortedStylePageProps) {
  const [editionId, setEditionId] = useState<Edition>('print');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const t = (text: Tri) => text[lang];
  const edition = EDITIONS.find((option) => option.id === editionId) ?? EDITIONS[0];
  const [lead, second] = CONTENTS.items;

  // The form leaves the page once the subscription is in, and focus would fall back
  // to the top of the document. Focus goes to the confirmation that replaces the form.
  useEffect(() => {
    if (formState === 'done') doneRef.current?.focus();
  }, [formState]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormState('done');
      return;
    }
    setFormState('error');
    // A click on the button leaves focus on the button. The field needs the correction.
    emailRef.current?.focus();
  };

  const subscribeTitle = <h2 id="et-subscribe-title" className="et-h2">{t(SUBSCRIBE.title)}</h2>;

  return (
    <FusionShell
      fusionId="fusion-editorial-terminal"
      lang={lang}
      tone="dark"
      accent="#f4ecd6"
      prev={{ href: '/pages/fusion-bento-noir.html', label: 'Bento × Noir' }}
      next={{ href: '/pages/fusion-holo-glass.html', label: 'Holo × Glass' }}
      prompts={PROMPTS}
    >
      <div className="et" id="et-top">
        <header className="et-bar">
          <p className="et-mark">{MAGAZINE}</p>
          <nav aria-label={t(NAV.label)}>
            <a href="#et-top" aria-current="page">{t(NAV.issue)}</a>
            <a href="#et-back">{t(NAV.back)}</a>
            <a href="#et-stockists">{t(NAV.stockists)}</a>
            <a href="#et-subscribe">{t(NAV.subscribe)}</a>
          </nav>
        </header>

        <section className="et-hero" aria-labelledby="et-title">
          <h1 id="et-title" className="et-title">{t(ISSUE.title)}</h1>
          <div className="et-row et-intro">
            <div className="et-side">
              <p className="et-standfirst">{t(ISSUE.standfirst)}</p>
              <dl className="et-facts">
                {ISSUE.facts.map((fact) => (
                  <div key={fact.key.en} className={fact.level ? `et-${fact.level}` : undefined}>
                    <dt>{t(fact.key)}</dt>
                    <dd>{t(fact.value)}</dd>
                  </div>
                ))}
              </dl>
              <a className="et-link" href="#et-stockists">{t(ISSUE.buy)}</a>
            </div>
            <section className="et-toc" aria-labelledby="et-contents">
              <h2 className="et-vh" id="et-contents">{t(CONTENTS.title)}</h2>
              <div className="et-toc__head" aria-hidden="true">
                <span>{t(CONTENTS.page)}</span>
                <span>{t(CONTENTS.article)}</span>
                <span>{t(CONTENTS.author)}</span>
              </div>
              <ol>
                {CONTENTS.items.map((item) => (
                  <li key={item.page}>
                    <span className="et-pg">{item.page}</span>
                    <span className="et-toc__title">
                      {item.href ? <a href={item.href}>{t(item.title)}</a> : t(item.title)}
                    </span>
                    <span className="et-by">{item.author}</span>
                  </li>
                ))}
              </ol>
              <p className="et-toc__note">{t(CONTENTS.note)}</p>
            </section>
          </div>
        </section>

        <article className="et-section et-row et-lead" id="et-lead" aria-labelledby="et-lead-title">
          <h2 id="et-lead-title" className="et-h2">{t(lead.title)}</h2>
          <div className="et-side et-byline">
            <p className="et-who">{t(LEAD.by)}</p>
            <p className="et-pages">{t(LEAD.pages)}</p>
            <p className="et-bio">{t(LEAD.bio)}</p>
          </div>
          <p className="et-prose">{t(LEAD.opening)}</p>

          <figure className="et-fig et-wide">
            <div className="et-log">
              <div className="et-log__head">
                <span>{LOG.file}</span>
                <span>{LOG.date}</span>
              </div>
              <ol>
                {LOG.lines.map((line, index) => (
                  <li key={line.time} className={line.level === 'info' ? undefined : `et-${line.level}`}>
                    <span className="et-log__n">{index + 1}</span>
                    <span>{line.time}</span>
                    <span>{line.level}</span>
                    <span>{line.source}</span>
                    <span className="et-log__msg">{line.message}</span>
                  </li>
                ))}
              </ol>
            </div>
            <figcaption>{t(LOG.caption)}</figcaption>
          </figure>

          {LEAD.body.map((paragraph) => (
            <p key={paragraph.en} className="et-prose">{t(paragraph)}</p>
          ))}
          <aside className="et-side et-night" aria-label={t(LEAD.nightLabel)}>
            <dl className="et-facts">
              {LEAD.night.map((row) => (
                <div key={row.time} className={row.level ? `et-${row.level}` : undefined}>
                  <dt>{row.time}</dt>
                  <dd>{t(row.event)}</dd>
                </div>
              ))}
            </dl>
          </aside>
          <p className="et-more">
            {t(LEAD.more)} <a href="#et-stockists">{t(LEAD.moreLink)}</a>
          </p>
        </article>

        <article className="et-section et-row et-second" id="et-second" aria-labelledby="et-second-title">
          <h2 id="et-second-title" className="et-h2">{t(second.title)}</h2>
          <p className="et-credit">
            <span className="et-who">{t(SECOND.by)}</span>
            <span className="et-pages">{t(SECOND.pages)}</span>
          </p>
          <p className="et-prose">{t(SECOND.body[0])}</p>
          <figure className="et-side et-tally">
            <table>
              <thead>
                <tr>
                  <th scope="col">{t(SECOND.tally.team)}</th>
                  <th scope="col">{t(SECOND.tally.rota)}</th>
                  <th scope="col">{t(SECOND.tally.pages)}</th>
                </tr>
              </thead>
              <tbody>
                {SECOND.tally.rows.map((row) => (
                  <tr key={row.team.en}>
                    <th scope="row">{t(row.team)}</th>
                    <td>{row.rota}</td>
                    <td>{row.pages}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">{t(SECOND.tally.total.team)}</th>
                  <td>{SECOND.tally.total.rota}</td>
                  <td>{SECOND.tally.total.pages}</td>
                </tr>
              </tfoot>
            </table>
            <figcaption>{t(SECOND.tally.caption)}</figcaption>
          </figure>
          <p className="et-prose">{t(SECOND.body[1])}</p>
          <p className="et-more">
            {t(SECOND.more)} <a href="#et-subscribe">{t(SECOND.moreLink)}</a>
          </p>
        </article>

        <section className="et-section" id="et-subscribe" aria-labelledby="et-subscribe-title">
          {formState === 'done' ? (
            <div className="et-row">
              {subscribeTitle}
              <div className="et-done" ref={doneRef} tabIndex={-1}>
                <p className="et-done__line">{t(edition.done).replace('{email}', email.trim())}</p>
                <dl className="et-facts">
                  <div className="et-ok"><dt>{t(SUBSCRIBE.status)}</dt><dd>{t(SUBSCRIBE.statusValue)}</dd></div>
                  <div><dt>{t(SUBSCRIBE.price)}</dt><dd>{t(edition.charge)}</dd></div>
                  <div><dt>{t(SUBSCRIBE.first)}</dt><dd>{t(SUBSCRIBE.firstValue)}</dd></div>
                </dl>
              </div>
            </div>
          ) : (
            <form className="et-row" onSubmit={handleSubmit} noValidate aria-labelledby="et-subscribe-title">
              {subscribeTitle}
              <p className="et-sub__intro">{t(SUBSCRIBE.intro)}</p>
              <fieldset className="et-editions">
                <legend>{t(SUBSCRIBE.edition)}</legend>
                {EDITIONS.map((option) => (
                  <label key={option.id} className="et-option">
                    <input
                      type="radio"
                      name="et-edition"
                      id={`et-edition-${option.id}`}
                      value={option.id}
                      checked={option.id === editionId}
                      onChange={() => setEditionId(option.id)}
                    />
                    <span className="et-option__mark" aria-hidden="true" />
                    <span className="et-option__name">{t(option.name)}</span>
                    <span className="et-option__body">{t(option.body)}</span>
                  </label>
                ))}
              </fieldset>
              <div className="et-side et-terms">
                <output className="et-price" htmlFor="et-edition-print et-edition-digital">{t(edition.price)}</output>
                <dl className="et-facts">
                  <div><dt>{t(edition.delivery[0])}</dt><dd>{t(edition.delivery[1])}</dd></div>
                  <div><dt>{t(SUBSCRIBE.first)}</dt><dd>{t(SUBSCRIBE.firstValue)}</dd></div>
                  <div><dt>{t(SUBSCRIBE.renews)}</dt><dd>{t(SUBSCRIBE.renewsValue)}</dd></div>
                </dl>
              </div>
              <label className="et-label" htmlFor="et-email">{t(SUBSCRIBE.label)}</label>
              <div className={`et-field${formState === 'error' ? ' is-invalid' : ''}`}>
                <input
                  ref={emailRef}
                  id="et-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  aria-invalid={formState === 'error'}
                  aria-describedby={formState === 'error' ? 'et-email-error' : undefined}
                  onChange={(event) => { setEmail(event.target.value); if (formState === 'error') setFormState('idle'); }}
                />
                <button type="submit">{t(SUBSCRIBE.submit)}</button>
              </div>
              {formState === 'error' ? <p className="et-error" id="et-email-error" role="alert">{t(SUBSCRIBE.error)}</p> : null}
              <p className="et-small">{t(SUBSCRIBE.small)}</p>
            </form>
          )}
        </section>

        <section className="et-section et-row" id="et-back" aria-labelledby="et-back-title">
          <h2 id="et-back-title" className="et-h3">{t(BACK.title)}</h2>
          <div className="et-log et-issues et-wide">
            <ol reversed>
              {BACK.rows.map((row) => (
                <li key={row.number}>
                  <span className="et-log__n">{row.number}</span>
                  <span className="et-issues__season">{t(row.season)}</span>
                  <span className="et-issues__title">{t(row.title)}</span>
                  <span className={`et-issues__stock${row.level ? ` et-${row.level}` : ''}`}>{t(row.stock)}</span>
                  <span className="et-issues__price">{t(row.price)}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="et-section et-row" id="et-stockists" aria-labelledby="et-stockists-title">
          <h2 id="et-stockists-title" className="et-h3">{t(STOCKISTS.title)}</h2>
          <p className="et-note">{t(STOCKISTS.note)}</p>
          <ul className="et-rows et-wide">
            {STOCKISTS.shops.map((shop) => (
              <li key={shop.name}>
                <span className="et-rows__key">{t(shop.city)}</span>
                <span className="et-rows__name">{shop.name}</span>
                <span className="et-rows__detail">{shop.street}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="et-row et-colophon" aria-labelledby="et-colophon-title">
          <h2 id="et-colophon-title" className="et-h3">{t(COLOPHON.title)}</h2>
          <p className="et-note">{t(COLOPHON.note)}</p>
          <dl className="et-rows et-wide">
            {COLOPHON.rows.map(([term, value]) => (
              <div key={term.en}>
                <dt className="et-rows__key">{t(term)}</dt>
                <dd className="et-rows__name">{t(value)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="et-footer">
          <span>© 2026 Stack Trace Press</span>
          <span>ISSN 2977-0418</span>
        </footer>
      </div>
    </FusionShell>
  );
}
