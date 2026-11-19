import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { StylePrompt } from '../StylePrompt';
import { usePortedPageEffects } from '../usePortedPageEffects';

// The page is the product page of one deploy-monitoring product, written in the
// Runtime Signal style. What describes the style itself lives in the prompt.

type Tri = Record<Lang, string>;

const NAV: Array<{ href: string; label: Tri }> = [
  { href: '#how', label: { en: 'How it works', ko: '작동 방식', ja: '仕組み' } },
  { href: '#timeline', label: { en: 'Deploy record', ko: '배포 기록', ja: 'デプロイ記録' } },
  { href: '#console', label: { en: 'Console', ko: '운영 화면', ja: '運用画面' } },
  { href: '#faq', label: { en: 'FAQ', ko: '질문', ja: '質問' } },
];

const HERO = {
  title: {
    en: 'See what each deploy did to your service within three minutes.',
    ko: '배포의 영향을 3분 안에 확인합니다.',
    ja: 'デプロイの影響を、3分以内に確認します。',
  },
  lede: {
    en: 'Runtime Signal compares error rate and response time right after a deploy with the 30 minutes before it. When a threshold is crossed, it alerts the owner and shows the version to roll back to.',
    ko: 'Runtime Signal은 배포 직후의 오류율과 응답 시간을 배포 전 30분과 비교합니다. 기준을 넘으면 담당자에게 알리고, 롤백할 버전을 함께 보여 줍니다.',
    ja: 'Runtime Signal は、デプロイ直後のエラー率と応答時間を、デプロイ前30分と比較します。基準を超えると担当者に通知し、戻すべきバージョンを合わせて表示します。',
  },
  action: { en: 'See how it works', ko: '작동 방식 보기', ja: '仕組みを見る' },
  pricing: { en: 'See pricing', ko: '요금 보기', ja: '料金を見る' },
} satisfies Record<string, Tri>;

const HOW = {
  title: { en: 'What happens in the three minutes after a deploy', ko: '배포 뒤 3분 동안 하는 일', ja: 'デプロイ後の3分間に行うこと' },
  intro: {
    en: 'Every deploy goes through the same three steps. Nobody has to watch a dashboard.',
    ko: '배포마다 같은 순서로 진행합니다. 사람이 대시보드를 지켜볼 필요가 없습니다.',
    ja: 'デプロイごとに同じ順序で進みます。ダッシュボードを見張る必要はありません。',
  },
  // The ruler above the steps is 18 columns of 10 seconds. Where each span sits on it
  // is set in the stylesheet by the step id.
  ticks: ['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00'],
  steps: [
    {
      id: 'detect',
      span: { en: 'Detect', ko: '감지', ja: '検知' },
      time: { en: '0:00', ko: '0:00', ja: '0:00' },
      title: { en: 'It detects the deploy on its own.', ko: '배포를 자동으로 감지합니다.', ja: 'デプロイを自動で検知します。' },
      body: {
        en: 'It receives the deploy event from CI or a version tag change, then records the time and the scope of the change.',
        ko: 'CI의 배포 이벤트나 버전 태그의 변경을 받아, 배포 시각과 변경 범위를 기록합니다.',
        ja: 'CIのデプロイイベントやバージョンタグの変更を受け取り、時刻と変更範囲を記録します。',
      },
    },
    {
      id: 'compare',
      span: { en: 'Compare with the 30 minutes before', ko: '배포 전 30분과 비교', ja: 'デプロイ前30分と比較' },
      time: { en: '0:10 to 2:20', ko: '0:10~2:20', ja: '0:10〜2:20' },
      title: { en: 'It compares against the 30 minutes before.', ko: '배포 전 30분과 비교합니다.', ja: 'デプロイ前30分と比較します。' },
      body: {
        en: 'Error rate, p95 response time and retry count are compared per service, and the difference is shown as numbers.',
        ko: '오류율, p95 응답 시간, 재시도 횟수를 서비스별로 비교하고 차이를 숫자로 보여 줍니다.',
        ja: 'エラー率、p95応答時間、リトライ回数をサービスごとに比較し、差を数値で示します。',
      },
    },
    {
      id: 'alert',
      span: { en: 'Alert', ko: '알림', ja: '通知' },
      time: {
        en: '2:20, or the moment a threshold is crossed',
        ko: '2:20, 또는 기준을 넘는 순간',
        ja: '2:20、または基準を超えた瞬間',
      },
      title: { en: 'It alerts as soon as a threshold is crossed.', ko: '기준을 넘으면 바로 알립니다.', ja: '基準を超えたらすぐに通知します。' },
      body: {
        en: 'The owner gets a Slack message and a phone call, with the previous version ready to roll back to.',
        ko: '담당자에게 Slack과 전화로 알리고, 롤백할 직전 버전을 함께 표시합니다.',
        ja: '担当者にSlackと電話で知らせ、戻すべき直前のバージョンを合わせて表示します。',
      },
    },
  ],
};

// One deploy, from detection to rollback. It is the object in the hero.
type TraceRow = {
  time: string;
  title: Tri;
  tone?: 'warn' | 'done';
  meta?: Tri;
  /** The warning row shows its measurement as figures instead of a line of text. */
  figures?: { before: string; after: string; unit: string; change: string };
};

const TIMELINE = {
  panelTitle: { en: 'deploy record', ko: '배포 기록', ja: 'デプロイ記録' },
  run: ['deploy #4127', 'api.gateway', 'v2.41.0'],
  // 10:18:02 to 10:23:00.
  outcome: { en: 'rolled back in 4 min 58 s', ko: '4분 58초 만에 롤백', ja: '4分58秒でロールバック' },
  rows: [
    {
      time: '10:18:02',
      title: { en: 'Detected the deploy of api.gateway v2.41.0', ko: 'api.gateway v2.41.0 배포를 감지했습니다', ja: 'api.gateway v2.41.0 のデプロイを検知しました' },
      meta: { en: '14 files changed, owned by the platform team', ko: '변경 파일 14개, 담당은 platform 팀', ja: '変更ファイル14件、担当は platform チーム' },
    },
    {
      time: '10:18:12',
      title: { en: 'Started comparing with the 30 minutes before', ko: '배포 전 30분 구간과 비교를 시작했습니다', ja: 'デプロイ前30分との比較を開始しました' },
      meta: { en: 'error rate, p95, retries', ko: '오류율, p95, 재시도 횟수', ja: 'エラー率、p95、リトライ回数' },
    },
    {
      time: '10:20:11',
      tone: 'warn',
      title: {
        en: 'p95 response time crossed the +50% threshold',
        ko: 'p95 응답 시간이 +50% 기준을 넘었습니다',
        ja: 'p95 応答時間が +50% の基準を超えました',
      },
      figures: { before: '142', after: '488', unit: 'ms', change: '+244%' },
    },
    {
      time: '10:20:14',
      title: { en: 'Alerted the on-call owner', ko: '온콜 담당자에게 알렸습니다', ja: 'オンコール担当者に通知しました' },
      meta: { en: 'one Slack message and one phone call', ko: 'Slack 메시지 1건과 전화 1건', ja: 'Slackメッセージ1件と電話1件' },
    },
    {
      time: '10:23:00',
      tone: 'done',
      title: { en: 'Rolled back to v2.40.3', ko: 'v2.40.3으로 롤백했습니다', ja: 'v2.40.3 にロールバックしました' },
      meta: { en: 'p95 recovered to 151ms', ko: 'p95가 151ms로 회복했습니다', ja: 'p95は151msに回復しました' },
    },
  ] as TraceRow[],
  note: {
    en: 'From detection to the previous version being live again. The 30-day median is 6 min 12 s.',
    ko: '감지부터 직전 버전 복구까지 걸린 시간입니다. 최근 30일 중앙값은 6분 12초입니다.',
    ja: '検知から直前バージョンの復旧までの時間です。直近30日の中央値は6分12秒です。',
  },
  quote: {
    en: '“Nobody watches the dashboard after a deploy any more. If something breaks, the alert reaches us first.”',
    ko: '“배포한 뒤에 대시보드를 지켜보는 사람이 없어졌습니다. 문제가 생기면 알림이 먼저 옵니다.”',
    ja: '「デプロイ後にダッシュボードを見張る人がいなくなりました。問題が起きれば、先に通知が届きます。」',
  },
  quoteMeta: { en: 'SRE lead, payments platform team', ko: '결제 플랫폼 팀, SRE 리드', ja: '決済プラットフォームチーム SREリード' },
};

type Health = 'ok' | 'warn' | 'err';

const HEALTH: Record<Health, Tri> = {
  ok: { en: 'healthy', ko: '정상', ja: '正常' },
  warn: { en: 'degraded', ko: '성능 저하', ja: '低下' },
  err: { en: 'failing', ko: '오류', ja: '失敗' },
};

const SERVICES: Array<{ name: string; health: Health; p95: string; checked: string }> = [
  { name: 'api.gateway', health: 'ok', p95: '142ms', checked: '12s' },
  { name: 'queue.dispatch', health: 'warn', p95: '488ms', checked: '31s' },
  { name: 'store.primary', health: 'ok', p95: '38ms', checked: '9s' },
  { name: 'jobs.scheduler', health: 'err', p95: '—', checked: '2m' },
];

const CONSOLE = {
  title: { en: 'Check every service on one screen.', ko: '서비스 상태를 한 화면에서 확인합니다.', ja: 'サービスの状態を1画面で確認します。' },
  intro: {
    en: "Status per service, today's numbers and open incidents, shown as tables and figures. Refreshed every 30 seconds.",
    ko: '서비스별 상태, 오늘의 지표, 진행 중인 인시던트를 표와 숫자로 보여 줍니다. 30초마다 갱신합니다.',
    ja: 'サービスごとの状態、今日の指標、進行中のインシデントを表と数値で表示します。30秒ごとに更新します。',
  },
  statusTitle: { en: 'Service status', ko: '서비스 상태', ja: 'サービスの状態' },
  statusStamp: { en: 'refreshes every 30s', ko: '30초마다 갱신', ja: '30秒ごとに更新' },
  columns: [
    { en: 'Service', ko: '서비스', ja: 'サービス' },
    { en: 'Status', ko: '상태', ja: '状態' },
    { en: 'p95', ko: 'p95', ja: 'p95' },
    { en: 'Last check', ko: '최근 확인', ja: '最終確認' },
  ] as Tri[],
  searchPlaceholder: { en: 'Search by service name', ko: '서비스 이름으로 검색', ja: 'サービス名で検索' },
  searchLabel: { en: 'Search services', ko: '서비스 검색', ja: 'サービスを検索' },
  filterLabel: { en: 'Status filter', ko: '상태 필터', ja: '状態フィルター' },
  empty: {
    en: 'No service matches the search and the filter.',
    ko: '검색어와 필터에 맞는 서비스가 없습니다.',
    ja: '検索語とフィルターに一致するサービスがありません。',
  },
  reset: { en: 'Clear search and filter', ko: '검색과 필터 지우기', ja: '検索とフィルターをクリア' },
  statsTitle: { en: "Today's numbers", ko: '오늘의 지표', ja: '今日の指標' },
  stats: [
    { label: { en: 'Deploy success rate', ko: '배포 성공률', ja: 'デプロイ成功率' }, value: '99.42', unit: '%', delta: { en: '+0.18', ko: '+0.18', ja: '+0.18' }, trend: 'up' },
    { label: { en: 'Runs per hour', ko: '시간당 실행', ja: '1時間あたりの実行' }, value: '1.4', unit: 'k', delta: { en: '-22', ko: '-22', ja: '-22' }, trend: 'down' },
    { label: { en: 'Open incidents', ko: '진행 중인 인시던트', ja: '進行中のインシデント' }, value: '3', unit: '', delta: { en: '2 acknowledged', ko: '2건 확인됨', ja: '2件確認済み' }, trend: '' },
  ],
  tabsTitle: { en: 'Service detail', ko: '서비스 상세', ja: 'サービス詳細' },
  payloadTitle: { en: 'Webhook event', ko: '웹훅 이벤트', ja: 'Webhookイベント' },
  noticeTitle: { en: 'Sample alerts', ko: '알림 예시', ja: '通知の例' },
  noticeInfo: {
    en: 'Scheduler ran the catch-up job at 10:18. Two queues were drained.',
    ko: '스케줄러가 10:18에 보정 작업을 실행했고, 큐 두 개가 정상으로 돌아왔습니다.',
    ja: 'スケジューラが10:18にキャッチアップジョブを実行し、2件のキューを処理しました。',
  },
  noticeLink: { en: 'View details', ko: '자세히 보기', ja: '詳細を見る' },
  noticeWarn: {
    en: 'Three retries hit the dispatch queue in the last five minutes. The pattern looks transient, but it is worth a look.',
    ko: '최근 5분 동안 디스패치 큐에서 재시도가 세 번 있었습니다. 일시적인 현상으로 보이지만 확인이 필요합니다.',
    ja: '直近5分でディスパッチキューに3回の再試行が発生しました。一時的に見えますが、確認が必要です。',
  },
};

type FilterId = 'all' | 'warn' | 'err';

const FILTERS: Array<{ id: FilterId; label: Tri }> = [
  { id: 'all', label: { en: 'All', ko: '전체', ja: 'すべて' } },
  { id: 'warn', label: { en: 'Degraded', ko: '성능 저하', ja: '低下' } },
  { id: 'err', label: { en: 'Failing', ko: '오류', ja: '失敗' } },
];

const SERVICE_COUNT: Record<Lang, (shown: number, total: number) => string> = {
  en: (shown, total) => `Showing ${shown} of ${total} services`,
  ko: (shown, total) => `서비스 ${total}개 중 ${shown}개 표시`,
  ja: (shown, total) => `${total}件中${shown}件を表示`,
};

// The service detail shows one service: the degraded one from the table above.
type TabId = 'overview' | 'logs' | 'settings' | 'audit';

const DETAIL_SERVICE = 'queue.dispatch';

const TABS: Array<{ id: TabId; label: Tri; count?: number }> = [
  { id: 'overview', label: { en: 'Overview', ko: '개요', ja: '概要' } },
  { id: 'logs', label: { en: 'Logs', ko: '로그', ja: 'ログ' } },
  { id: 'settings', label: { en: 'Settings', ko: '설정', ja: '設定' } },
  { id: 'audit', label: { en: 'Audit log', ko: '감사 로그', ja: '監査ログ' }, count: 12 },
];

const DETAIL_FACTS: Record<'overview' | 'settings', Array<{ term: Tri; value: Tri }>> = {
  overview: [
    { term: { en: 'Version', ko: '버전', ja: 'バージョン' }, value: { en: 'v1.18.2', ko: 'v1.18.2', ja: 'v1.18.2' } },
    { term: { en: 'Owner', ko: '담당 팀', ja: '担当チーム' }, value: { en: 'platform', ko: 'platform', ja: 'platform' } },
    { term: { en: 'Last deploy', ko: '최근 배포', ja: '直近のデプロイ' }, value: { en: 'Yesterday, 16:42', ko: '어제 16:42', ja: '昨日 16:42' } },
    { term: { en: 'Automatic rollback', ko: '자동 롤백', ja: '自動ロールバック' }, value: { en: 'Off', ko: '꺼짐', ja: 'オフ' } },
  ],
  settings: [
    { term: { en: 'Comparison window', ko: '비교 구간', ja: '比較区間' }, value: { en: '30 minutes before the deploy', ko: '배포 전 30분', ja: 'デプロイ前30分' } },
    { term: { en: 'p95 threshold', ko: 'p95 기준', ja: 'p95の基準' }, value: { en: '+50%', ko: '+50%', ja: '+50%' } },
    { term: { en: 'Error-rate threshold', ko: '오류율 기준', ja: 'エラー率の基準' }, value: { en: '+1.0 point', ko: '+1.0%p', ja: '+1.0ポイント' } },
    { term: { en: 'Alerts', ko: '알림', ja: '通知' }, value: { en: 'Slack, phone call', ko: 'Slack, 전화', ja: 'Slack、電話' } },
  ],
};

const DETAIL_LOGS = `10:24:11  retry  run_8c41a9  attempt 2  488ms
10:24:03  retry  run_8c41a7  attempt 2  472ms
10:23:40  ok     run_8c419e  attempt 1  131ms`;

const DETAIL_AUDIT = {
  rows: [
    { time: '11-17 16:42', text: { en: 'j.park deployed v1.18.2.', ko: 'j.park가 v1.18.2를 배포했습니다.', ja: 'j.park が v1.18.2 をデプロイしました。' } },
    {
      time: '11-14 09:10',
      text: {
        en: 'm.seo changed the p95 threshold from +80% to +50%.',
        ko: 'm.seo가 p95 기준을 +80%에서 +50%로 바꿨습니다.',
        ja: 'm.seo が p95 の基準を +80% から +50% に変更しました。',
      },
    },
    { time: '11-12 14:05', text: { en: 'j.park turned on phone alerts.', ko: 'j.park가 전화 알림을 켰습니다.', ja: 'j.park が電話通知を有効にしました。' } },
  ],
  note: { en: 'The latest 3 of 12 entries.', ko: '12건 중 최근 3건입니다.', ja: '12件中、直近の3件です。' },
};

const PAYLOAD = `{
  "id": "run_8c41a9",
  "status": "retry",
  "attempt": 2,
  "duration_ms": 488,
  "queued_at": "10:24:11Z"
}`;

const PLAN_VALUES = {
  days30: { en: '30 days', ko: '30일', ja: '30日' },
  months13: { en: '13 months', ko: '13개월', ja: '13か月' },
  slack: { en: 'Slack', ko: 'Slack', ja: 'Slack' },
  slackAndCalls: {
    en: 'Slack, phone calls and on-call schedules',
    ko: 'Slack, 전화, 온콜 일정',
    ja: 'Slack、電話、オンコールスケジュール',
  },
  yes: { en: 'Included', ko: '포함', ja: '含む' },
  no: { en: 'Not included', ko: '미포함', ja: '含まない' },
} satisfies Record<string, Tri>;

const PLANS = {
  title: { en: 'Pricing is per service.', ko: '요금은 서비스 수로 계산합니다.', ja: '料金はサービス数で決まります。' },
  intro: {
    en: 'Every plan includes deploy comparison and alerts. Paid plans come with a 14-day free trial.',
    ko: '모든 요금제에 배포 비교와 알림이 들어 있습니다. 유료 요금제는 14일 동안 무료로 써 볼 수 있습니다.',
    ja: 'すべてのプランにデプロイ比較と通知が含まれます。有料プランは14日間無料で試せます。',
  },
  // One column per plan. Every row lists its values in the same order as `columns`.
  columns: [
    { name: 'Starter', body: { en: 'For small teams trying it out.', ko: '작은 팀이 먼저 써 보는 요금제입니다.', ja: '小さなチームがまず試すためのプランです。' } },
    { name: 'Team', body: { en: 'For teams that run an on-call rotation.', ko: '온콜을 운영하는 팀을 위한 요금제입니다.', ja: 'オンコールを運用するチーム向けのプランです。' } },
    {
      name: 'Enterprise',
      body: {
        en: 'For organizations that need security review and dedicated support.',
        ko: '보안 심사와 전용 지원이 필요한 조직을 위한 요금제입니다.',
        ja: 'セキュリティ審査と専任サポートが必要な組織向けのプランです。',
      },
    },
  ],
  rows: [
    {
      label: { en: 'Price', ko: '요금', ja: '料金' },
      values: [
        { en: 'Free for up to 5 services', ko: '서비스 5개까지 무료', ja: '5サービスまで無料' },
        { en: '$9 per service a month', ko: '서비스당 월 12,000원', ja: '1サービス 月額1,300円' },
        { en: 'Custom quote', ko: '별도 견적', ja: '個別見積もり' },
      ],
    },
    {
      label: { en: 'Deploy records kept', ko: '배포 기록 보관 기간', ja: 'デプロイ記録の保管期間' },
      values: [PLAN_VALUES.days30, PLAN_VALUES.months13, PLAN_VALUES.months13],
    },
    {
      label: { en: 'Alerts', ko: '알림', ja: '通知' },
      values: [PLAN_VALUES.slack, PLAN_VALUES.slackAndCalls, PLAN_VALUES.slackAndCalls],
    },
    {
      label: { en: 'SSO and audit logs', ko: 'SSO와 감사 로그', ja: 'SSOと監査ログ' },
      values: [PLAN_VALUES.no, PLAN_VALUES.no, PLAN_VALUES.yes],
    },
    {
      label: { en: 'Dedicated support channel', ko: '전용 지원 채널', ja: '専用サポート窓口' },
      values: [PLAN_VALUES.no, PLAN_VALUES.no, PLAN_VALUES.yes],
    },
  ] as Array<{ label: Tri; values: Tri[] }>,
};

const FAQ = {
  title: { en: 'Frequently asked questions', ko: '자주 묻는 질문', ja: 'よくある質問' },
  items: [
    {
      q: { en: 'Does the agent slow my service down?', ko: '에이전트를 설치하면 서비스가 느려지나요?', ja: 'エージェントを入れるとサービスは遅くなりますか。' },
      a: {
        en: 'The agent batches metrics every 10 seconds and sends them in the background. Measured CPU use stays under 1%.',
        ko: '에이전트는 지표를 10초 단위로 묶어 백그라운드에서 보냅니다. 측정한 CPU 사용량은 1% 미만입니다.',
        ja: 'エージェントは指標を10秒ごとにまとめ、バックグラウンドで送信します。計測したCPU使用率は1%未満です。',
      },
    },
    {
      q: { en: 'Which deploy tools does it work with?', ko: '어떤 배포 도구와 연동되나요?', ja: 'どのデプロイツールと連携できますか。' },
      a: {
        en: 'It receives deploy events from GitHub Actions, GitLab CI, Argo CD and Jenkins. Any other tool connects through a webhook.',
        ko: 'GitHub Actions, GitLab CI, Argo CD, Jenkins의 배포 이벤트를 받습니다. 그 밖의 도구는 웹훅으로 연결합니다.',
        ja: 'GitHub Actions、GitLab CI、Argo CD、Jenkins のデプロイイベントを受け取ります。その他のツールはWebhookで接続します。',
      },
    },
    {
      q: { en: 'Does it roll back automatically?', ko: '자동으로 롤백하나요?', ja: '自動でロールバックしますか。' },
      a: {
        en: 'By default it only alerts. You can turn on automatic rollback per service, and every rollback is written to the deploy record.',
        ko: '기본값은 알림만 보냅니다. 서비스별로 자동 롤백을 켤 수 있고, 롤백한 내용은 모두 배포 기록에 저장합니다.',
        ja: '初期設定では通知のみです。サービスごとに自動ロールバックを有効にでき、実行内容はすべてデプロイ記録に保存します。',
      },
    },
    {
      q: { en: 'How long is data kept?', ko: '데이터는 얼마나 보관하나요?', ja: 'データはどのくらい保管しますか。' },
      a: {
        en: 'Deploy records and comparison results are kept for 13 months on paid plans. Raw logs are not stored.',
        ko: '유료 요금제는 배포 기록과 비교 결과를 13개월 보관합니다. 원본 로그는 저장하지 않습니다.',
        ja: '有料プランでは、デプロイ記録と比較結果を13か月保管します。生ログは保存しません。',
      },
    },
  ],
};

const FOOTER = {
  title: { en: 'Start with your next deploy.', ko: '다음 배포부터 확인해 보세요.', ja: '次のデプロイから試してください。' },
  note: {
    en: 'Free for up to 5 services. Setup takes five minutes.',
    ko: '서비스 5개까지 무료입니다. 설치에는 5분이 걸립니다.',
    ja: '5サービスまで無料です。導入は5分で終わります。',
  },
  product: { en: 'Product', ko: '제품', ja: '製品' },
  reference: { en: 'Reference', ko: '참고', ja: '参考' },
  pricing: { en: 'Pricing', ko: '요금', ja: '料金' },
  prompt: { en: 'AI Request Prompt', ko: 'AI 요청 프롬프트', ja: 'AI依頼プロンプト' },
} satisfies Record<string, Tri>;

const PROMPTS: Record<Lang, string> = {
  en: `Design a product page in Runtime Signal style — a dark technical interface on a faint 12-column grid, set in Geist with Geist Mono for times and identifiers, with restrained mineral-teal and brass accents.

This is not a flashy concept page.
Pick one believable product and write its real content. The page must read as that product's page, never as a page about its own style.

Choose a believable category such as developer tools, workflow control, documentation, internal operations, incident review, or scheduling.
Avoid AI spectacle, glossy startup hype, luxury branding, neon cyberpunk, or decorative analytics dashboards.

STYLE DNA:
- dark canvas with the faint vertical lines of a 12-column grid
- one typeface, Geist, in three weights, with tight tracking on headlines
- Geist Mono only for times, identifiers, code and table numerics
- large, direct headlines
- no cards and no pills: one flat surface, square corners, hairlines for structure
- the product's own records are the visuals: a deploy trace, a time ruler, tables
- mineral teal for the healthy or finished state and the solid main-action button, muted brass for warnings
- technical but readable
- no visual clutter

COLOR TOKENS:
--bg: #0b0b0c
--surface: #131416 (code blocks and menus only)
--text: #f1f3f5
--muted: #9a9daa
--line: rgba(255,255,255,0.18)
--grid: rgba(255,255,255,0.06) (the 12-column decoration only)
--accent: #74c2b4
--accent-alt: #c9a36a
--danger: #e58b7c
No gradients as the main visual effect. No blur-heavy glassmorphism.

TYPOGRAPHY:
Headings, body and buttons: Geist, weights 400, 500 and 600
Times, identifiers, code and table numerics: Geist Mono, weights 400 and 500
H1: clamp(2.6rem, 5.1vw, 4.5rem), weight 600, line-height 1, letter-spacing -0.05em
H2: clamp(1.8rem, 3.1vw, 2.5rem), weight 600, line-height 1.05, letter-spacing -0.04em
H3: 1.375rem, weight 600, line-height 1.2, letter-spacing -0.03em
Body: 1.0625rem, line-height 1.6
Secondary text: 0.95rem
Mono meta: 0.8125rem, written in the case it is read in, no added tracking
Figures: 2.2rem, weight 600, letter-spacing -0.05em
Table numerics: Geist Mono 1.125rem, weight 500 for the main metric; other figures 0.9375rem, weight 400
Buttons, filters and tabs: 0.95rem, weight 500

LAYOUT:
- max-width around 1176px on a 12-column grid, 32px side gutters, 20px on a phone
- top bar: wordmark, section links, language menu and one solid button, with a hairline under it
- hero: headline, one paragraph and one outline button on the left six columns, the deploy trace on the right six
- deploy trace: a mono head line (deploy id, service, version, outcome), then the events on a vertical rail with square nodes and mono times; the warning event is a brass-tinted band with large before and after figures
- one customer quote as a plain blockquote under the hero, no card
- left-aligned section headlines, each with a short intro under it; a hairline divides the sections
- the three steps drawn on a time ruler: 18 columns of 10 seconds, one span per step, a tick label every 30 seconds; under it the steps as an ordered list in three columns, each led by its time
- an operations surface with no cards: a status table with working search and status filters, three stat figures in one line divided by hairlines, tabbed service detail beside an event payload, notices as flat lines with a left rule
- plans as a comparison table: one column per plan, one line per attribute; on a phone each plan becomes its own block
- FAQ as a definition list with every answer visible, no accordion
- previous/next page navigation at the end of the page, not fixed to the screen
- breakpoints around 860px (one column) and 560px (tables stack into labelled lines)

COMPONENT RULES:
- corners: square everywhere
- lines: 1px; structural lines at 18% white, and the top rule of the trace and of each table in the text colour; only the grid decoration is fainter
- no cards, pills or badges: a state is a 9px square and a word
- shadows: none
- buttons: 44px high and square; outline by default, solid teal only for the main action (pricing, in the top bar and the footer)
- filters and tabs: text buttons, the selected one with a 2px teal underline
- search: an underlined field with a small icon, no box
- code: a square block on --surface with a 1px line
- links: underline only in the footer and in notices
- every control works: search and filters narrow the table, tabs switch the panel; no decorative inputs
- motion: hover transitions only, 160ms max

COPY TONE:
- direct
- technical
- about the product, never about the page's own style
- specific and readable by both designers and product teams
- written like a real company's product page

FORBIDDEN:
- glowing hero blobs
- thick shadows
- colorful 3D objects
- giant gradient text everywhere
- decorative charts without operational meaning
- glassmorphism
- abstract “future” marketing art
- rounded bordered cards in a grid
- pill buttons, pill chips and pill badges
- a small label above every heading
- all-caps or letter-spaced labels
- numbers on items that are not a sequence
- anything that looks like an AI-generated SaaS concept shot

OUTPUT:
1) CSS custom properties
2) semantic HTML + CSS
3) responsive desktop/tablet/mobile layout
4) accessible contrast
5) no horizontal scroll
6) visible but restrained grid structure`,
  ko: `Runtime Signal 스타일의 제품 페이지를 디자인해줘 — 희미한 12컬럼 그리드 위에 놓인 다크 기술 인터페이스. 시간과 식별자는 Geist Mono, 나머지는 Geist로 조판하고, 절제된 미네랄 틸과 브라스 포인트를 사용해줘.

이건 화려한 컨셉 페이지가 아니다.
현실적인 제품 하나를 정하고 그 제품의 실제 내용을 써라. 페이지는 그 제품의 페이지로 읽혀야 하고, 자기 스타일을 설명하는 페이지가 되면 안 된다.

개발자 도구, 워크플로 제어, 문서화, 내부 운영, 인시던트 검토, 스케줄링처럼 현실적인 카테고리를 선택해라.
AI 과장 연출, 광택 있는 스타트업 하이프, 럭셔리 브랜딩, 네온 사이버펑크, 장식용 분석 대시보드는 피하라.

STYLE DNA:
- 12컬럼 그리드의 희미한 세로선이 있는 다크 캔버스
- 서체는 Geist 하나만 쓰고 세 가지 굵기를 사용하며, 헤드라인은 자간을 좁힘
- Geist Mono는 시간, 식별자, 코드, 표의 숫자에만 사용
- 크고 직접적인 헤드라인
- 카드와 알약형 요소는 쓰지 않음: 평평한 면 하나, 직각 모서리, 구조는 가는 선으로 표현
- 시각 요소는 제품 자체의 기록: 배포 추적, 시간 눈금자, 표
- 미네랄 틸은 정상 또는 완료 상태와 주요 동작 채움 버튼에, 톤다운된 브라스는 경고에 사용
- 기술적이지만 읽기 쉬움
- 시각적 군더더기 없음

COLOR TOKENS:
--bg: #0b0b0c
--surface: #131416 (코드 블록과 메뉴에만 사용)
--text: #f1f3f5
--muted: #9a9daa
--line: rgba(255,255,255,0.18)
--grid: rgba(255,255,255,0.06) (12컬럼 장식선에만 사용)
--accent: #74c2b4
--accent-alt: #c9a36a
--danger: #e58b7c
그라데이션을 메인 시각 효과로 쓰지 말 것. 블러 중심 글래스모피즘 금지.

TYPOGRAPHY:
헤드라인, 본문, 버튼: Geist, 굵기 400, 500, 600
시간, 식별자, 코드, 표의 숫자: Geist Mono, 굵기 400, 500
H1: clamp(2.6rem, 5.1vw, 4.5rem), 굵기 600, line-height 1, letter-spacing -0.05em
H2: clamp(1.8rem, 3.1vw, 2.5rem), 굵기 600, line-height 1.05, letter-spacing -0.04em
H3: 1.375rem, 굵기 600, line-height 1.2, letter-spacing -0.03em
본문: 1.0625rem, line-height 1.6
보조 텍스트: 0.95rem
모노 메타: 0.8125rem, 읽는 그대로 표기하고 자간은 추가하지 않음
수치: 2.2rem, 굵기 600, letter-spacing -0.05em
표 숫자: Geist Mono 1.125rem, 굵기 500은 주요 지표; 그 밖의 수치는 0.9375rem, 굵기 400
버튼, 필터, 탭: 0.95rem, 굵기 500

LAYOUT:
- 최대 폭은 12컬럼 그리드 기준 약 1176px, 좌우 여백 32px, 휴대폰에서는 20px
- 상단 바: 워드마크, 섹션 링크, 언어 메뉴, 채움 버튼 하나, 그 아래 가는 선
- 히어로: 왼쪽 여섯 컬럼에 헤드라인, 문단 하나, 외곽선 버튼 하나. 오른쪽 여섯 컬럼에 배포 추적
- 배포 추적: 모노 제목 줄(배포 ID, 서비스, 버전, 결과), 그 아래 세로 레일 위의 이벤트. 노드는 직각 사각형, 시간은 모노. 경고 이벤트는 브라스 톤의 띠에 변경 전후의 큰 수치를 표시
- 히어로 아래에 고객 인용문 하나를 카드 없이 평범한 blockquote로
- 섹션 헤드라인은 왼쪽 정렬, 아래에 짧은 소개 문단. 가는 선으로 섹션을 구분
- 세 단계는 시간 눈금자에 그림: 10초 단위 18컬럼, 단계마다 구간 하나, 30초마다 눈금 라벨. 그 아래에 세 열의 순서 목록으로 단계를 나열하고 각 항목을 시간으로 시작
- 카드 없는 운영 화면: 검색과 상태 필터가 동작하는 상태 표, 가는 선으로 나눈 한 줄짜리 수치 세 개, 이벤트 페이로드와 나란히 놓인 탭형 서비스 상세, 왼쪽 선이 있는 평평한 알림
- 요금제는 비교표: 요금제마다 열 하나, 속성마다 행 하나. 휴대폰에서는 요금제마다 별도 블록
- FAQ는 모든 답변을 펼쳐 둔 정의 목록으로, 아코디언은 쓰지 않음
- 이전/다음 페이지 이동은 페이지 끝에 두고, 화면에 고정하지 않음
- 브레이크포인트는 약 860px(한 열)과 560px(표는 항목명이 붙은 줄로 쌓임)

COMPONENT RULES:
- 모서리: 모두 직각
- 선: 1px. 구조선은 흰색 18%, 추적 영역과 각 표의 맨 윗줄은 본문 색. 격자 장식선만 더 흐리게
- 카드, 알약형, 배지는 쓰지 않음. 상태는 9px 사각형과 단어 하나로 표시
- 그림자: 없음
- 버튼: 높이 44px, 모서리 직각. 기본은 외곽선, 틸 채움은 주요 동작(요금, 상단 바와 footer)에만
- 필터와 탭: 텍스트 버튼. 선택된 항목에는 2px 틸 밑줄
- 검색: 작은 아이콘이 붙은 밑줄 입력란, 상자 없음
- 코드: --surface 배경의 직각 블록, 1px 선
- 링크: 밑줄은 footer와 알림에서만
- 모든 조작 요소는 동작해야 함: 검색과 필터는 표를 좁히고, 탭은 패널을 바꿈. 장식용 입력 금지
- 모션: hover 전환만, 최대 160ms

COPY TONE:
- 직접적임
- 기술적임
- 제품에 관한 문장만 쓰고, 페이지의 스타일을 설명하지 않음
- 디자이너와 제품팀 모두 읽을 수 있을 정도로 구체적임
- 실제 회사의 제품 페이지처럼 작성

FORBIDDEN:
- 글로우 히어로 블롭
- 두꺼운 그림자
- 알록달록한 3D 오브젝트
- 페이지 전체를 덮는 거대한 그라데이션 텍스트
- 운영 의미 없는 장식 차트
- 글래스모피즘
- 추상적인 미래형 마케팅 아트
- 격자에 놓인 둥근 테두리 카드
- 알약형 버튼, 알약형 칩, 알약형 배지
- 모든 제목 위에 붙는 작은 라벨
- 전부 대문자이거나 자간을 넓힌 라벨
- 순서가 아닌 항목에 붙인 번호
- AI가 만든 SaaS 컨셉 샷처럼 보이는 모든 것

OUTPUT:
1) CSS custom properties
2) semantic HTML + CSS
3) responsive desktop/tablet/mobile layout
4) accessible contrast
5) no horizontal scroll
6) 보이지만 절제된 그리드 구조`,
  ja: `Runtime Signal スタイルの製品ページをデザインしてください — 薄い12カラムグリッドの上に置かれたダークな技術インターフェース。時刻と識別子は Geist Mono、それ以外は Geist を使い、抑えたミネラルティールとブラスのアクセントを付けてください。

これは派手なコンセプトページではありません。
現実味のある製品を1つ決め、その製品の実際の内容を書くこと。ページはその製品のページとして読めること。自分のスタイルを説明するページにしないこと。

開発者ツール、ワークフロー制御、ドキュメント、内部運用、インシデント確認、スケジューリングなど、現実味のあるカテゴリを選ぶこと。
AIっぽい誇張演出、光沢のあるスタートアップハイプ、ラグジュアリーブランディング、ネオンサイバーパンク、装飾ダッシュボードは避けること。

STYLE DNA:
- 12カラムグリッドの薄い縦線があるダークキャンバス
- 書体は Geist 一つのみ。3つのウェイトを使い、見出しはトラッキングを詰める
- Geist Mono は時刻、識別子、コード、表の数値にのみ使用
- 大きく直接的な見出し
- カードとピル型の要素は使わない: 平らな面1つ、角は直角、構造は細い線で表現
- 視覚要素はプロダクト自身の記録: デプロイのトレース、時間の目盛り、表
- ミネラルティールは正常または完了の状態と主要アクションの塗りボタンに、抑えたブラスは警告に使用
- 技術的だが読みやすい
- 視覚的ノイズなし

COLOR TOKENS:
--bg: #0b0b0c
--surface: #131416 (コードブロックとメニューにのみ使用)
--text: #f1f3f5
--muted: #9a9daa
--line: rgba(255,255,255,0.18)
--grid: rgba(255,255,255,0.06) (12カラムの装飾線にのみ使用)
--accent: #74c2b4
--accent-alt: #c9a36a
--danger: #e58b7c
グラデーションを主要な視覚効果として使わないこと。ブラー中心のグラスモーフィズムは禁止。

TYPOGRAPHY:
見出し、本文、ボタン: Geist、ウェイト 400、500、600
時刻、識別子、コード、表の数値: Geist Mono、ウェイト 400、500
H1: clamp(2.6rem, 5.1vw, 4.5rem)、ウェイト 600、line-height 1、letter-spacing -0.05em
H2: clamp(1.8rem, 3.1vw, 2.5rem)、ウェイト 600、line-height 1.05、letter-spacing -0.04em
H3: 1.375rem、ウェイト 600、line-height 1.2、letter-spacing -0.03em
本文: 1.0625rem、line-height 1.6
補助テキスト: 0.95rem
モノのメタ: 0.8125rem、読む通りの大文字・小文字で表記し、字間は追加しない
数値: 2.2rem、ウェイト 600、letter-spacing -0.05em
表の数値: Geist Mono 1.125rem、ウェイト 500は主要な指標、その他の数値は0.9375rem、ウェイト 400
ボタン、フィルター、タブ: 0.95rem、ウェイト 500

LAYOUT:
- 最大幅は12カラムグリッドで約1176px、左右の余白32px、スマートフォンでは20px
- 上部バー: ワードマーク、セクションリンク、言語メニュー、塗りボタン1つ、その下に細い線
- ヒーロー: 左の6カラムに見出し、段落1つ、アウトラインボタン1つ。右の6カラムにデプロイのトレース
- デプロイのトレース: 等幅の見出し行（デプロイID、サービス、バージョン、結果）、その下に縦のレール上のイベント。ノードは四角、時刻は等幅。警告イベントはブラス色を帯びた帯で、変更前後の大きな数値を表示
- ヒーローの下に顧客の引用を、カードなしの素のブロッククォートで1つ
- セクション見出しは左揃え、下に短い紹介文。細い線でセクションを区切る
- 3つのステップは時間の目盛りに描く: 10秒単位の18カラム、ステップごとに区間1つ、30秒ごとに目盛りラベル。その下に3カラムの順序付きリストとして、各ステップを時刻から始める
- カードのない運用画面: 検索と状態フィルターが動作する状態表、細い線で区切る1行の数値3つ、イベントのペイロードと並ぶタブ付きのサービス詳細、左に罫線のある平らな通知行
- 料金プランは比較表: プランごとに1列、属性ごとに1行。スマートフォンではプランごとに1ブロック
- FAQは定義リストで、すべての回答を表示した状態にする。アコーディオンは使わない
- 前後ページのナビゲーションはページ末尾に置き、画面に固定しない
- ブレークポイントは約860px（1列）と560px（表はラベル付きの行に積み重なる）

COMPONENT RULES:
- 角はすべて直角
- 線は1px。構造線は白の18%、トレースと各表の上罫線は本文色。格子の装飾線だけをさらに薄く
- カード、ピル、バッジは使わない。状態は9pxの四角と一語で示す
- 影: なし
- ボタン: 高さ44px、角は直角。基本はアウトライン、ティールの塗りは主要アクション(料金、上部バーとフッター)にのみ
- フィルターとタブ: テキストボタン。選択中の項目は2pxのティール下線
- 検索: 小さなアイコン付きの下線入力欄。枠は付けない
- コード: --surface 背景の直角ブロック、1pxの線
- リンク: 下線はフッターと通知のみ
- すべての操作要素が動作すること: 検索とフィルターは表を絞り込み、タブはパネルを切り替える。装飾用の入力は置かない
- モーション: hover のトランジションのみ、最大160ms

COPY TONE:
- 直接的
- 技術的
- 製品についてだけ書き、ページ自身のスタイルは説明しない
- デザイナーとプロダクトチームの両方が読める程度に具体的
- 実在の会社の製品ページのように書く

FORBIDDEN:
- グローヒーローブロブ
- 厚いシャドウ
- カラフルな3Dオブジェクト
- ページ全体を覆う巨大グラデーションテキスト
- 運用上の意味がない装飾チャート
- グラスモーフィズム
- 抽象的な未来型マーケティングアート
- グリッドに並ぶ角丸・枠線付きのカード
- ピル型のボタン、ピル型のチップ、ピル型のバッジ
- すべての見出しの上に付く小さなラベル
- すべて大文字、または字間を空けたラベル
- 順序ではない項目に付けた番号
- AI生成のSaaSコンセプトショットのように見えるすべてのもの

OUTPUT:
1) CSS custom properties
2) semantic HTML + CSS
3) responsive desktop/tablet/mobile layout
4) accessible contrast
5) no horizontal scroll
6) 見えるが抑制されたグリッド構造`,
};

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function PortedRuntimeSignalPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const t = (text: Tri) => text[lang];

  const langToggleRef = useRef<HTMLButtonElement>(null);
  // The shared page effects close the language menu when a language is chosen. The
  // chosen item leaves the page with the menu, so focus goes back to the menu button.
  const returnFocusToLangToggle = (event: MouseEvent<HTMLUListElement>) => {
    if ((event.target as Element).closest('[data-lang-select]')) langToggleRef.current?.focus();
  };

  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterId>('all');
  const [tab, setTab] = useState<TabId>('overview');

  const needle = query.trim().toLowerCase();
  const visibleServices = SERVICES.filter((service) => (filter === 'all' || service.health === filter) && service.name.includes(needle));

  const resetServices = () => {
    setQuery('');
    setFilter('all');
    // The button that was pressed leaves the page with the empty state.
    searchRef.current?.focus();
  };

  const moveTab = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = TABS.findIndex((item) => item.id === tab);
    const last = TABS.length - 1;
    const target =
      event.key === 'ArrowRight' ? (current === last ? 0 : current + 1)
      : event.key === 'ArrowLeft' ? (current === 0 ? last : current - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : -1;
    if (target < 0) return;
    event.preventDefault();
    setTab(TABS[target].id);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
  };

  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--runtime-signal">
      <div>
        <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
        <a className="page-back-link" href="/" data-i18n-aria="back.hub.aria" aria-label="Back to Hub">
          <BackIcon />
          <span data-i18n="back.hub">Back to Hub</span>
        </a>
        <div className="page-shell">
          <div className="container">
            <header className="runtime-nav" aria-label="Runtime Signal">
              <a className="brand" href="#main-content">Runtime Signal</a>
              <ul className="runtime-nav__links">
                {NAV.map((item) => (
                  <li key={item.href}><a href={item.href}>{t(item.label)}</a></li>
                ))}
              </ul>
              <div className="runtime-nav__actions">
                <div className="lang-dropdown" id="lang-dropdown">
                  <button ref={langToggleRef} className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
                  <ul className="lang-menu" role="menu" onClick={returnFocusToLangToggle}>
                    <li><button role="menuitem" data-lang-select="en">English</button></li>
                    <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                    <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
                  </ul>
                </div>
                <a className="nav-button nav-button--solid" href="#plans">{t(HERO.pricing)}</a>
              </div>
            </header>

            <main id="main-content">
              <section className="rs-hero">
                <div className="rs-hero__copy">
                  <h1>{t(HERO.title)}</h1>
                  <p className="rs-hero__lede">{t(HERO.lede)}</p>
                  <a className="nav-button" href="#how">{t(HERO.action)}</a>
                </div>

                <section className="trace" id="timeline" aria-label={t(TIMELINE.panelTitle)}>
                  <p className="trace__head">
                    {TIMELINE.run.map((part) => <span key={part}>{part}</span>)}
                    <b>{t(TIMELINE.outcome)}</b>
                  </p>
                  <ol className="trace__list">
                    {TIMELINE.rows.map((row) => (
                      <li className={row.tone ? `trace__row trace__row--${row.tone}` : 'trace__row'} key={row.time}>
                        <time dateTime={row.time}>{row.time}</time>
                        <span className="trace__node" aria-hidden="true" />
                        <div>
                          <p className="trace__title">{t(row.title)}</p>
                          {row.figures ? (
                            <p className="trace__delta">
                              <b>{row.figures.before}</b> → <b>{row.figures.after}</b> {row.figures.unit}
                              <strong>{row.figures.change}</strong>
                            </p>
                          ) : null}
                          {row.meta ? <p className="trace__meta">{t(row.meta)}</p> : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="trace__note">{t(TIMELINE.note)}</p>
                </section>

                <figure className="quote">
                  <blockquote>{t(TIMELINE.quote)}</blockquote>
                  <figcaption>{t(TIMELINE.quoteMeta)}</figcaption>
                </figure>
              </section>

              <section className="rs-section" id="how">
                <h2>{t(HOW.title)}</h2>
                <p className="rs-section__intro">{t(HOW.intro)}</p>
                {/* The ruler draws what the list under it says, so assistive technology reads the list only. */}
                <div className="ruler" aria-hidden="true">
                  <div className="ruler__spans">
                    {HOW.steps.map((step) => (
                      <div className={`ruler__span ruler__span--${step.id}`} key={step.id}><span>{t(step.span)}</span></div>
                    ))}
                  </div>
                  <div className="ruler__ticks" />
                  <div className="ruler__labels">
                    {HOW.ticks.map((tick) => <span key={tick}>{tick}</span>)}
                  </div>
                </div>
                <ol className="steps">
                  {HOW.steps.map((step) => (
                    <li key={step.id}>
                      <p className="steps__time">{t(step.time)}</p>
                      <p><strong>{t(step.title)}</strong> {t(step.body)}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rs-section" id="console">
                <h2>{t(CONSOLE.title)}</h2>
                <p className="rs-section__intro">{t(CONSOLE.intro)}</p>

                <div className="console-block">
                  <div className="console-block__head">
                    <h3>{t(CONSOLE.statusTitle)}</h3>
                    <div className="toolbar">
                      <label className="toolbar__field">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                          ref={searchRef}
                          type="search"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder={t(CONSOLE.searchPlaceholder)}
                          aria-label={t(CONSOLE.searchLabel)}
                        />
                      </label>
                      <div className="status-filter" role="group" aria-label={t(CONSOLE.filterLabel)}>
                        {FILTERS.map((item) => (
                          <button type="button" key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>
                            {t(item.label)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {visibleServices.length > 0 ? (
                    <table className="status-table" role="table" aria-label={t(CONSOLE.statusTitle)}>
                      <thead role="rowgroup">
                        <tr role="row">
                          {CONSOLE.columns.map((column) => (
                            <th scope="col" role="columnheader" key={column.en}>{t(column)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {visibleServices.map((service) => (
                          <tr role="row" key={service.name}>
                            <td role="cell">{service.name}</td>
                            <td role="cell"><span className={service.health === 'ok' ? 'health' : `health health--${service.health}`}>{t(HEALTH[service.health])}</span></td>
                            <td role="cell" className="num" data-label={t(CONSOLE.columns[2])}>{service.p95}</td>
                            <td role="cell" className="num" data-label={t(CONSOLE.columns[3])}>{service.checked}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="status-empty">
                      <p>{t(CONSOLE.empty)}</p>
                      <button type="button" className="nav-button" onClick={resetServices}>{t(CONSOLE.reset)}</button>
                    </div>
                  )}
                  <div className="status-foot">
                    <p role="status">{SERVICE_COUNT[lang](visibleServices.length, SERVICES.length)}</p>
                    <span>{t(CONSOLE.statusStamp)}</span>
                  </div>
                </div>

                <div className="console-block">
                  <div className="console-block__head">
                    <h3>{t(CONSOLE.statsTitle)}</h3>
                  </div>
                  <dl className="stat-strip">
                    {CONSOLE.stats.map((stat) => (
                      <div key={stat.label.en}>
                        <dt>{t(stat.label)}</dt>
                        <dd className="stat-strip__value">{stat.value}{stat.unit ? <span className="stat-strip__unit">{stat.unit}</span> : null}</dd>
                        <dd className={stat.trend ? `stat-strip__delta stat-strip__delta--${stat.trend}` : 'stat-strip__delta'}>{t(stat.delta)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="console-pair">
                  <div className="console-block">
                    <div className="console-block__head">
                      <h3>{t(CONSOLE.tabsTitle)}</h3>
                      <span className="console-block__id">{DETAIL_SERVICE}</span>
                    </div>
                    <div className="line-tabs" role="tablist" aria-label={t(CONSOLE.tabsTitle)} onKeyDown={moveTab}>
                      {TABS.map((item) => (
                        <button
                          type="button"
                          role="tab"
                          key={item.id}
                          id={`rs-tab-${item.id}`}
                          aria-selected={tab === item.id}
                          aria-controls="rs-detail-panel"
                          tabIndex={tab === item.id ? 0 : -1}
                          onClick={() => setTab(item.id)}
                        >
                          {t(item.label)}
                          {item.count ? <span className="line-tabs__count">{item.count}</span> : null}
                        </button>
                      ))}
                    </div>
                    <div className="detail-panel" role="tabpanel" id="rs-detail-panel" aria-labelledby={`rs-tab-${tab}`} tabIndex={0}>
                      {tab === 'overview' || tab === 'settings' ? (
                        <dl className="detail-list">
                          {DETAIL_FACTS[tab].map((fact) => (
                            <div key={fact.term.en}>
                              <dt>{t(fact.term)}</dt>
                              <dd>{t(fact.value)}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                      {tab === 'logs' ? <pre className="code-block"><code>{DETAIL_LOGS}</code></pre> : null}
                      {tab === 'audit' ? (
                        <>
                          <ul className="detail-events">
                            {DETAIL_AUDIT.rows.map((row) => (
                              <li key={row.time}>
                                <span className="detail-events__time">{row.time}</span>
                                <span>{t(row.text)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="detail-note">{t(DETAIL_AUDIT.note)}</p>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="console-block">
                    <div className="console-block__head">
                      <h3>{t(CONSOLE.payloadTitle)}</h3>
                      <span className="console-block__id">json</span>
                    </div>
                    <pre className="code-block"><code>{PAYLOAD}</code></pre>
                  </div>
                </div>

                <div className="console-block">
                  <div className="console-block__head">
                    <h3>{t(CONSOLE.noticeTitle)}</h3>
                  </div>
                  <div className="notice">
                    <span className="notice__tag">info</span>
                    <p>{t(CONSOLE.noticeInfo)} <a href="#timeline">{t(CONSOLE.noticeLink)}</a></p>
                  </div>
                  <div className="notice notice--warn">
                    <span className="notice__tag">warn</span>
                    <p>{t(CONSOLE.noticeWarn)}</p>
                  </div>
                </div>
              </section>

              <section className="rs-section" id="plans">
                <h2 id="rs-plans-title">{t(PLANS.title)}</h2>
                <p className="rs-section__intro">{t(PLANS.intro)}</p>
                {/* On a phone the cells are regrouped by plan with CSS, so the table states its roles. */}
                <table className="plan-table" role="table" aria-labelledby="rs-plans-title">
                  <thead role="rowgroup">
                    <tr role="row">
                      <td role="cell" />
                      {PLANS.columns.map((plan) => (
                        <th scope="col" role="columnheader" key={plan.name}>
                          <span className="plan-table__name">{plan.name}</span>
                          <span className="plan-table__for">{t(plan.body)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody role="rowgroup">
                    {PLANS.rows.map((row) => (
                      <tr role="row" key={row.label.en}>
                        <th scope="row" role="rowheader">{t(row.label)}</th>
                        {row.values.map((value, index) => (
                          <td role="cell" data-label={t(row.label)} key={PLANS.columns[index].name}>{t(value)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="rs-section" id="faq">
                <h2>{t(FAQ.title)}</h2>
                <dl className="faq-list">
                  {FAQ.items.map((item) => (
                    <div key={item.q.en}>
                      <dt>{t(item.q)}</dt>
                      <dd>{t(item.a)}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <footer className="footer" id="footer">
                <div className="footer__lead">
                  <h2>{t(FOOTER.title)}</h2>
                  <p className="footer__note">{t(FOOTER.note)}</p>
                  <a className="nav-button nav-button--solid" href="#plans">{t(HERO.pricing)}</a>
                </div>
                <div className="footer__col">
                  <p className="footer__label">{t(FOOTER.product)}</p>
                  <ul>
                    {NAV.slice(0, 3).map((item) => (
                      <li key={item.href}><a href={item.href}>{t(item.label)}</a></li>
                    ))}
                    <li><a href="#plans">{t(FOOTER.pricing)}</a></li>
                  </ul>
                </div>
                <div className="footer__col">
                  <p className="footer__label">{t(FOOTER.reference)}</p>
                  <ul>
                    <li><a href="#faq">{t(FAQ.title)}</a></li>
                    <li><a href="#style-prompt" onClick={() => document.getElementById('style-prompt')?.setAttribute('open', '')}>{t(FOOTER.prompt)}</a></li>
                    <li><a href="/" data-i18n="back.hub">Back to Hub</a></li>
                  </ul>
                </div>
              </footer>

              <StylePrompt prompts={PROMPTS} lang={lang} />
            </main>
          </div>
        </div>
        <nav className="page-nav" data-i18n-aria="page.nav.aria" aria-label="Page navigation">
          <a href="/pages/platform-core.html">
            <BackIcon />
            <span><span className="page-nav__label" data-i18n="page.nav.prev">Previous</span>Platform Core</span>
          </a>
          <span className="page-nav__divider" aria-hidden="true" />
          <a href="/pages/holographic-fluid.html">
            <span><span className="page-nav__label" data-i18n="page.nav.next">Next</span>Holographic Fluid</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
