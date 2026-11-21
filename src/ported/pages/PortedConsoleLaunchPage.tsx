import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedConsoleLaunchPage.css';

// The launch-day page of Lomvi Aerospace: Kestrel-2 carries the sea-ice satellite
// Fjellrev-1 from Andøya, in the Console Launch style. B612 was drawn for cockpit
// displays and sets the headings, the reading and every figure; B612 Mono sets the
// labels an operator scans (units, column heads, axes, call signs on the lamps).
// Components come from the control room: the countdown clock, the launch window with
// a "now" line, weather against its limits, the go/no-go poll board, the ascent
// profile and the pad telemetry held at zero. Emerald marks "go" and nothing else;
// a hold is white with hatching. FusionShell is the shared style-page chrome.

type Tri = Record<Lang, string>;
type Zone = 'cet' | 'utc';

const COMPANY = 'Lomvi';
const COMPANY_REST = ' Aerospace';
const PLACE = 'Andøya';
const ZONE_NAME: Record<Zone, string> = { cet: 'CET', utc: 'UTC' };
const ZONES: Zone[] = ['cet', 'utc'];

// Every time on the page is kept in seconds after midnight, Central European Time
// (Norway in November), and shown in the zone the reader picks.
const hms = (h: number, m: number, s = 0) => h * 3600 + m * 60 + s;
const START = hms(11, 57, 50);
const LIFTOFF = hms(12, 40);
const STRIP_FROM = hms(11, 30);
const STRIP_SPAN = hms(2, 30);
const INTERNAL_POWER = hms(12, 30);

const pad = (n: number) => String(n).padStart(2, '0');

function wall(seconds: number, zone: Zone, withSeconds = false) {
  const s = seconds - (zone === 'utc' ? 3600 : 0);
  const text = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}`;
  return withSeconds ? `${text}:${pad(s % 60)}` : text;
}

const parse = (clock: string) => {
  const [h, m, s = 0] = clock.split(':').map(Number);
  return hms(h, m, s);
};

const countText = (left: number) => `T-${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`;

// The count runs on the real clock from the moment the page opened, and stops at liftoff.
const liveNow = (openedAt: number) => Math.min(LIFTOFF, START + Math.floor((Date.now() - openedAt) / 1000));

// Fills {key} placeholders. A key with no value is left in place for a later step.
const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

// Sets the {lead} of a sentence in bold.
function lead(text: string, bold: string): ReactNode[] {
  return text.split('{lead}').flatMap((part, index) => (index === 0 ? keep(part, 'a') : [<b key={`lead-${index}`}>{bold}</b>, ...keep(part, `b${index}-`)]));
}

// Names and count times stay on one line: Kestrel-2, Fjellrev-1, T-15, T+09:50.
const NOBREAK = /(Kestrel-2|Fjellrev-1|T[-+]\d+(?::\d\d)*)/;
function keep(text: string, prefix = ''): ReactNode[] {
  return text.split(NOBREAK).map((part, index) => (index % 2 ? <span className="kl-nw" key={`${prefix}${index}`}>{part}</span> : part));
}

const HEAD = {
  nav: { en: 'Launch day', ko: '발사 당일', ja: '打ち上げ当日' },
  poll: { en: 'Go/no-go poll', ko: 'Go/No-go 확인', ja: 'Go/No-go 確認' },
  flight: { en: 'Flight', ko: '비행', ja: '飛行' },
  tele: { en: 'Telemetry', ko: '원격 측정', ja: 'テレメトリ' },
  alerts: { en: 'Launch alerts', ko: '발사 알림', ja: '打ち上げ通知' },
  watch: { en: 'Watch live', ko: '실시간 보기', ja: 'ライブで見る' },
} satisfies Record<string, Tri>;

const HERO = {
  title: { en: 'Kestrel-2 launches Fjellrev-1 from Andøya at {time} today', ko: 'Kestrel-2, 오늘 {time} Andøya에서 Fjellrev-1 발사', ja: 'Kestrel-2、本日{time}にAndøyaからFjellrev-1を打ち上げ' },
  lede: {
    en: 'Flight 4 lifts off from the Nordmela pad in northern Norway and carries a sea-ice satellite to a 520 km polar orbit.',
    ko: 'Flight 4는 노르웨이 북부 Nordmela 발사대에서 이륙해, 해빙 관측 위성을 520 km 극궤도에 올립니다.',
    ja: 'Flight 4はノルウェー北部のNordmela発射台から打ち上げられ、海氷観測衛星を520 kmの極軌道へ運びます。',
  },
} satisfies Record<string, Tri>;

const COUNT = {
  head: { en: 'Liftoff Saturday 21 November, {time}', ko: '발사 11월 21일 토요일, {time}', ja: '打ち上げ 11月21日(土) {time}' },
  running: { en: 'Clock running', ko: '카운트 진행 중', ja: 'カウント中' },
  paused: { en: 'Paused on this page', ko: '이 페이지에서 일시정지', ja: 'このページでは一時停止中' },
  liftoff: { en: 'Liftoff', ko: '발사', ja: '打ち上げ' },
  pause: { en: 'Pause', ko: '일시정지', ja: '一時停止' },
  resume: { en: 'Resume', ko: '재생', ja: '再開' },
  timer: { en: 'T minus {h} hours, {m} minutes, {s} seconds', ko: '발사까지 {h}시간 {m}분 {s}초', ja: '打ち上げまで{h}時間{m}分{s}秒' },
  h: { en: 'h', ko: '시간', ja: '時間' },
  min: { en: 'min', ko: '분', ja: '分' },
  s: { en: 's', ko: '초', ja: '秒' },
  status: {
    en: 'Counting. Range and weather on hold until the T-15 poll.',
    ko: '카운트 진행 중. 발사장 상태와 기상은 T-15 확인 때까지 보류입니다.',
    ja: 'カウント中。射場と気象はT-15の確認まで保留です。',
  },
  pausedNews: {
    en: 'Clock paused on this page at {count}. The count goes on at the pad.',
    ko: '이 페이지의 시계가 {count}에 일시정지되었습니다. 카운트는 발사대에서 계속됩니다.',
    ja: 'このページの時計は{count}で一時停止しました。カウントは発射台で続きます。',
  },
  resumedNews: { en: 'Clock live again at {count}.', ko: '시계가 다시 실시간으로 돌아왔습니다. 현재 {count}.', ja: '時計がリアルタイムに戻りました。現在 {count}。' },
} satisfies Record<string, Tri>;

const SEQ_TEXT = {
  title: { en: 'The rest of the count', ko: '남은 카운트 일정', ja: 'カウントの残り' },
  next: { en: 'next', ko: '다음', ja: '次' },
} satisfies Record<string, Tri>;

const SEQ: Array<{ count: string; at: string; what: Tri }> = [
  { count: 'T-30:00', at: '12:10', what: { en: 'Live stream starts', ko: '실시간 방송 시작', ja: 'ライブ配信開始' } },
  { count: 'T-15:00', at: '12:25', what: { en: 'Final go/no-go poll', ko: '최종 Go/No-go 확인', ja: '最終 Go/No-go 確認' } },
  { count: 'T-10:00', at: '12:30', what: { en: 'Rocket switches to internal power', ko: '로켓이 내부 전원으로 전환', ja: 'ロケットが内部電源に切り替え' } },
  { count: 'T-04:00', at: '12:36', what: { en: 'Tanks pressurised for flight', ko: '비행용 탱크 가압', ja: '飛行用タンクを加圧' } },
  { count: 'T-01:00', at: '12:39', what: { en: 'Flight computer takes over the count', ko: '비행 컴퓨터가 카운트를 넘겨받음', ja: '飛行コンピュータがカウントを引き継ぐ' } },
  { count: 'T-00:00', at: '12:40', what: { en: 'Liftoff', ko: '발사', ja: '打ち上げ' } },
];

const WINDOW = {
  title: { en: 'Launch window', ko: '발사 가능 시간대', ja: '打ち上げ時間帯' },
  zone: { en: 'Time zone for every time on this page', ko: '이 페이지의 모든 시각에 적용되는 시간대', ja: 'このページのすべての時刻のタイムゾーン' },
  to: { en: 'to', ko: '~', ja: '〜' },
  note: { en: '72 minutes. A hold moves liftoff later inside the window.', ko: '72분. 보류가 걸리면 발사 시각이 이 시간대 안에서 뒤로 밀립니다.', ja: '72分。保留になると、打ち上げ時刻はこの時間帯の中で後ろにずれます。' },
  now: { en: 'Now', ko: '현재', ja: '現在' },
  window: { en: 'Window', ko: '발사 구간', ja: '打ち上げ枠' },
  backup: { en: 'Backup', ko: '예비일', ja: '予備日' },
  backupDay: { en: 'Sunday 22 November, {range}', ko: '11월 22일 일요일, {range}', ja: '11月22日(日) {range}' },
  range: { en: '{from} to {to}', ko: '{from} ~ {to}', ja: '{from}〜{to}' },
  newsCet: { en: 'Times are now shown in Central European Time.', ko: '이제 모든 시각을 중부유럽시간(CET)으로 표시합니다.', ja: '時刻は中央ヨーロッパ時間（CET）で表示します。' },
  newsUtc: { en: 'Times are now shown in UTC.', ko: '이제 모든 시각을 UTC로 표시합니다.', ja: '時刻はUTCで表示します。' },
} satisfies Record<string, Tri>;

const TICKS = ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];

const WX = {
  title: { en: 'Weather at the pad', ko: '발사대 기상', ja: '発射台の気象' },
  hold: { en: 'HOLD', ko: '보류', ja: '保留' },
};

const WX_ROWS: Array<{ name: Tri; value: Tri; hold?: boolean; limit?: { share: number; label: Tri } }> = [
  {
    name: { en: 'Ground wind', ko: '지상 풍속', ja: '地上風速' },
    value: { en: '7 m/s, gusts 11', ko: '7 m/s, 돌풍 11', ja: '7 m/s、突風 11' },
    limit: { share: 73, label: { en: 'limit 15', ko: '한계 15', ja: '上限 15' } },
  },
  {
    name: { en: 'Wind shear at 11 km', ko: '11 km 고도 윈드시어', ja: '高度11 kmのウィンドシア' },
    value: { en: '92%', ko: '92%', ja: '92%' },
    hold: true,
    limit: { share: 92, label: { en: 'of limit', ko: '한계 대비', ja: '上限比' } },
  },
  { name: { en: 'Cloud ceiling', ko: '운고', ja: '雲底高度' }, value: { en: '1,200 m', ko: '1,200 m', ja: '1,200 m' } },
  { name: { en: 'Air temperature', ko: '기온', ja: '気温' }, value: { en: '-3 °C', ko: '-3 °C', ja: '-3 °C' } },
  { name: { en: 'Lightning', ko: '낙뢰', ja: '落雷' }, value: { en: 'None in 40 km', ko: '40 km 이내 없음', ja: '40 km以内になし' } },
];

const POLL = {
  title: { en: 'Go/no-go poll', ko: 'Go/No-go 확인', ja: 'Go/No-go 確認' },
  lede: {
    en: 'Launch director Ingrid Solheim polled the eight stations at {a}, T-45 minutes. Liftoff needs all eight to answer go. The next poll is at {b}. Open a station for its full note.',
    ko: '발사 책임자 Ingrid Solheim이 {a}(T-45분)에 8개 담당 구역에 확인을 요청했습니다. 발사에는 8개 담당 구역 모두의 진행 응답이 필요합니다. 다음 확인은 {b}입니다. 담당 구역을 열면 전체 메모를 볼 수 있습니다.',
    ja: '打ち上げ責任者 Ingrid Solheim が {a}（T-45分）に8つの担当へ確認しました。打ち上げには8担当すべての可が必要です。次の確認は {b} です。担当を開くと全文のメモを読めます。',
  },
  tally: { en: 'of {n} stations go', ko: '곳 진행 (전체 {n}곳)', ja: '担当が可（全{n}担当）' },
  station: { en: 'Station', ko: '담당 구역', ja: '担当' },
  console: { en: 'Console', ko: '담당자', ja: '担当者' },
  answer: { en: 'Answer', ko: '응답', ja: '回答' },
  note: { en: 'Note', ko: '메모', ja: 'メモ' },
  go: { en: 'GO', ko: '진행', ja: '可' },
  hold: { en: 'HOLD', ko: '보류', ja: '保留' },
} satisfies Record<string, Tri>;

interface Station {
  call: string;
  name: Tri;
  who: string;
  hold: boolean;
  note: Tri;
  /** The rest of the station's report, shown when the row is opened. Times are {a}, {b}, ... */
  more: Tri;
  times: Record<string, string>;
}

const STATIONS: Station[] = [
  {
    call: 'PROP',
    name: { en: 'Propulsion', ko: '추진', ja: '推進' },
    who: 'Henrik Dahl',
    hold: false,
    note: { en: 'Oxygen and propane loaded. Topping the second-stage oxygen at 0.4 kg/s.', ko: '산소와 프로판 충전 완료. 2단 산소를 0.4 kg/s로 보충 중입니다.', ja: '酸素とプロパンの充填完了。2段目の酸素を0.4 kg/sで補給中です。' },
    more: {
      en: 'Loading finished at {a}. Oxygen boils off on the pad, so the second stage is topped up until T-2 minutes and stands at 99.6% now. Tank pressures are 3.4 and 2.9 bar, inside their limits.',
      ko: '{a}에 충전이 끝났습니다. 발사대에서는 산소가 증발하므로 2단은 T-2분까지 계속 보충하며, 현재 99.6%입니다. 탱크 압력은 3.4 bar와 2.9 bar로 한계 안에 있습니다.',
      ja: '{a}に充填が完了しました。発射台では酸素が蒸発するため、2段目はT-2分まで補給を続けており、現在99.6%です。タンク圧は3.4 barと2.9 barで、いずれも上限内です。',
    },
    times: { a: '11:41' },
  },
  {
    call: 'AVI',
    name: { en: 'Avionics', ko: '항공전자', ja: 'アビオニクス' },
    who: 'Marte Lie',
    hold: false,
    note: { en: 'Flight computer switches to internal power at T-10.', ko: '비행 컴퓨터는 T-10에 내부 전원으로 전환합니다.', ja: '飛行コンピュータはT-10で内部電源に切り替わります。' },
    more: {
      en: 'The flight battery reads 28.9 V on the ground charger. The flight computer has run its full self-test twice today without a fault, the last one at {a}.',
      ko: '비행 배터리는 지상 충전기에서 28.9 V를 가리킵니다. 비행 컴퓨터는 오늘 전체 자가 점검을 두 번 수행했고 결함은 없었습니다. 마지막 점검은 {a}에 이루어졌습니다.',
      ja: '飛行バッテリーは地上充電器で28.9 Vを示しています。飛行コンピュータは本日、全自己診断を2回実施し、異常はありませんでした。最後の診断は{a}です。',
    },
    times: { a: '11:20' },
  },
  {
    call: 'GNC',
    name: { en: 'Guidance', ko: '유도', ja: '誘導' },
    who: 'Jonas Berg',
    hold: false,
    note: { en: 'Targeting file 4C loaded for {a}.', ko: '{a} 발사 기준 목표 파일 4C를 적재했습니다.', ja: '{a}の発射に合わせた目標ファイル4Cを読み込み済みです。' },
    more: {
      en: 'File 4C steers to a 520 km polar orbit for a liftoff on the second. If a hold moves liftoff later, the files for every later minute up to {b} are loaded as well.',
      ko: '파일 4C는 초 단위까지 맞춘 발사 시각에 맞춰 520 km 극궤도로 유도합니다. 보류로 발사 시각이 늦춰지면, {b}까지 이후 매 분의 파일도 함께 적재합니다.',
      ja: 'ファイル4Cは秒単位で定めた打ち上げ時刻に合わせて、520 kmの極軌道へ誘導します。保留で打ち上げが遅れた場合に備え、{b}までの後続の各分のファイルも読み込まれています。',
    },
    times: { a: '12:40:00', b: '13:52' },
  },
  {
    call: 'GSE',
    name: { en: 'Ground systems', ko: '지상 설비', ja: '地上設備' },
    who: 'Sara Nygaard',
    hold: false,
    note: { en: 'Umbilicals and pad water deluge armed.', ko: '엄빌리컬 연결과 발사대 살수 장치 대기 완료.', ja: 'アンビリカルと発射台の散水設備が待機完了。' },
    more: {
      en: 'The tower tank holds 180 tonnes of water for the deluge. The pad was cleared of staff at {a} and the road gate at Nordmela is closed.',
      ko: '타워 탱크에 살수용 물 180톤이 있습니다. {a}에 발사대 인원 철수가 끝났고, Nordmela의 도로 차단문은 닫혀 있습니다.',
      ja: 'タワーのタンクには散水用の水が180トンあります。{a}に発射台からの人員退避が完了し、Nordmelaの道路ゲートは閉鎖されています。',
    },
    times: { a: '11:15' },
  },
  {
    call: 'WX',
    name: { en: 'Weather', ko: '기상', ja: '気象' },
    who: 'Ola Haug',
    hold: true,
    note: { en: 'Wind shear at 11 km is 92% of the limit and rising.', ko: '11 km 고도의 윈드시어는 한계의 92%이며 계속 오르고 있습니다.', ja: '高度11 kmのウィンドシアは上限の92%で、なお上昇中です。' },
    more: {
      en: 'The balloon at {a} read 85% of the limit and the one at {b} read 92%. The next goes up at {c}, and its reading comes in before the {d} poll. Ground wind, cloud and lightning are inside their limits.',
      ko: '{a}에 띄운 관측 풍선은 한계의 85%, {b}에 띄운 풍선은 92%를 기록했습니다. 다음 풍선은 {c}에 띄우며, 측정값은 {d} 확인 전에 나옵니다. 지상 풍속, 운고, 낙뢰는 모두 한계 안에 있습니다.',
      ja: '{a}に上げた観測気球は上限の85%、{b}の気球は92%を記録しました。次の気球は{c}に上げ、その測定値は{d}の確認前に得られます。地上風、雲底、落雷はいずれも上限内です。',
    },
    times: { a: '10:30', b: '11:30', c: '12:05', d: '12:25' },
  },
  {
    call: 'PL',
    name: { en: 'Payload', ko: '탑재체', ja: 'ペイロード' },
    who: 'Aiko Tanaka',
    hold: false,
    note: { en: 'Fjellrev-1 on its own battery, charged to 98%.', ko: 'Fjellrev-1은 자체 배터리로 가동 중이며 충전율은 98%입니다.', ja: 'Fjellrev-1は自前のバッテリーで動作中、充電率98%です。' },
    more: {
      en: 'Fjellrev-1 went to its own battery at {a}. It stays switched off, apart from its heaters, until it leaves the second stage at T+09:50.',
      ko: 'Fjellrev-1은 {a}에 자체 배터리로 전환했습니다. 히터를 제외하고 전원을 끈 상태로 두며, T+09:50에 2단에서 분리될 때까지 그대로 있습니다.',
      ja: 'Fjellrev-1は{a}に自前のバッテリーへ切り替わりました。ヒーターを除いて電源は切ったままで、T+09:50に2段目から離れるまで続きます。',
    },
    times: { a: '11:50' },
  },
  {
    call: 'TRK',
    name: { en: 'Tracking', ko: '추적', ja: '追跡' },
    who: 'Elias Moen',
    hold: false,
    note: { en: 'Antennas on Andøya and Svalbard locked on the vehicle.', ko: 'Andøya와 Svalbard의 안테나가 기체를 포착했습니다.', ja: 'AndøyaとSvalbardのアンテナが機体を捕捉しています。' },
    more: {
      en: 'Andøya follows Kestrel-2 from liftoff, and Svalbard takes over about six minutes in as the second stage climbs north. Both stations recorded a clean test signal at {a}.',
      ko: 'Andøya는 발사 순간부터 Kestrel-2를 추적하고, 2단이 북쪽으로 올라가면 약 6분 뒤 Svalbard가 이어받습니다. 두 관측소 모두 {a}에 깨끗한 시험 신호를 기록했습니다.',
      ja: 'Andøyaは打ち上げの瞬間からKestrel-2を追跡し、2段目が北へ上昇して約6分後にSvalbardが引き継ぎます。両局とも{a}に良好な試験信号を記録しました。',
    },
    times: { a: '11:45' },
  },
  {
    call: 'RSO',
    name: { en: 'Range safety', ko: '발사장 안전', ja: '射場安全' },
    who: 'Kari Strand',
    hold: true,
    note: { en: 'A fishing boat is inside hazard area B, 14 km off Bleik.', ko: '어선 한 척이 Bleik 앞바다 14 km, 위험 구역 B 안에 있습니다.', ja: '漁船1隻が、Bleik沖14 kmの危険区域B内にいます。' },
    more: {
      en: 'The coast guard has spoken to the skipper and the boat is heading south at 9 knots. It should be out by {a}. Hazard areas A and C are clear, and the airspace closed at {b}.',
      ko: '해안경비대가 선장과 통화했고, 배는 시속 9노트로 남쪽으로 항해 중입니다. {a}까지 구역을 벗어날 것으로 보입니다. 위험 구역 A와 C는 비어 있고, 영공은 {b}에 폐쇄되었습니다.',
      ja: '沿岸警備隊が船長と話し、船は時速9ノットで南へ向かっています。{a}までに区域を出る見込みです。危険区域AとCは空いており、空域は{b}に閉鎖されました。',
    },
    times: { a: '12:20', b: '11:00' },
  },
];

const FLIGHT = {
  title: { en: 'From liftoff to payload separation', ko: '발사부터 탑재체 분리까지', ja: '打ち上げからペイロード分離まで' },
  lede: {
    en: 'Kestrel-2 flies north-west over the Norwegian Sea. Fjellrev-1 leaves the second stage 9 minutes 50 seconds after liftoff, 521 km up.',
    ko: 'Kestrel-2는 노르웨이해 상공을 북서쪽으로 비행합니다. Fjellrev-1은 발사 9분 50초 뒤, 고도 521 km에서 2단을 떠납니다.',
    ja: 'Kestrel-2はノルウェー海の上空を北西へ飛行します。Fjellrev-1は打ち上げの9分50秒後、高度521 kmで2段目を離れます。',
  },
  plot: {
    en: 'Altitude against time after liftoff. The climb is steep for the first three minutes, then levels off into a 520 km orbit by T+08:40. Every flight event is listed in the table below.',
    ko: '발사 후 시간에 따른 고도입니다. 처음 3분 동안 가파르게 올라간 뒤, T+08:40까지 520 km 궤도에서 수평을 이룹니다. 모든 비행 이벤트는 아래 표에 나와 있습니다.',
    ja: '打ち上げ後の時間に対する高度です。最初の3分は急角度で上昇し、T+08:40までに520 kmの軌道で水平飛行に移ります。すべての飛行イベントを下の表に示します。',
  },
  minutes: { en: '11 min', ko: '11분', ja: '11分' },
  time: { en: 'Time', ko: '시각', ja: '時刻' },
  event: { en: 'Event', ko: '이벤트', ja: 'イベント' },
  altitude: { en: 'Altitude', ko: '고도', ja: '高度' },
  speed: { en: 'Speed', ko: '속도', ja: '速度' },
} satisfies Record<string, Tri>;

type LabelSide = 'up' | 'below' | 'upleft' | 'down';

interface FlightEvent {
  time: string;
  name: Tri;
  note: Tri;
  altitude: string;
  speed: string;
  /** Seconds after liftoff and kilometres up, for the marker on the profile. */
  mark?: { t: number; km: number; label?: LabelSide };
  go?: boolean;
}

const EVENTS: FlightEvent[] = [
  {
    time: 'T+00:00',
    name: { en: 'Liftoff', ko: '발사', ja: '打ち上げ' },
    note: { en: 'The five first-stage engines reach full thrust and the hold-down clamps let go.', ko: '1단 엔진 다섯 기가 최대 추력에 이르고, 기체를 잡고 있던 고정 클램프가 풀립니다.', ja: '1段目のエンジン5基が最大推力に達し、機体を押さえていたクランプが外れます。' },
    altitude: '0 km',
    speed: '0 m/s',
    mark: { t: 0, km: 0 },
  },
  {
    time: 'T+00:11',
    name: { en: 'Clears the tower', ko: '타워 이탈', ja: 'タワーを離脱' },
    note: { en: 'Kestrel-2 rolls onto its north-west heading.', ko: 'Kestrel-2가 북서쪽 침로로 방향을 틉니다.', ja: 'Kestrel-2が北西の針路へ向きを変えます。' },
    altitude: '0.1 km',
    speed: '31 m/s',
  },
  {
    time: 'T+00:58',
    name: { en: 'Max-Q', ko: '최대 동압', ja: '最大動圧' },
    note: { en: 'The highest air pressure on the vehicle in flight, 41 kPa.', ko: '비행 중 기체가 받는 가장 높은 공기압, 41 kPa.', ja: '飛行中に機体が受ける最大の空気圧、41 kPa。' },
    altitude: '11 km',
    speed: '410 m/s',
    mark: { t: 58, km: 11, label: 'up' },
  },
  {
    time: 'T+02:24',
    name: { en: 'First-stage cutoff', ko: '1단 연소 종료', ja: '1段目エンジン停止' },
    note: { en: 'All five engines shut down together.', ko: '엔진 다섯 기가 동시에 정지합니다.', ja: 'エンジン5基がそろって停止します。' },
    altitude: '68 km',
    speed: '2,310 m/s',
    mark: { t: 144, km: 68 },
  },
  {
    time: 'T+02:28',
    name: { en: 'Stage separation', ko: '단 분리', ja: '段分離' },
    note: { en: 'The first stage falls into the sea 380 km downrange.', ko: '1단은 전방 380 km 지점의 바다에 떨어집니다.', ja: '1段目は前方380 kmの海に落下します。' },
    altitude: '71 km',
    speed: '2,300 m/s',
    mark: { t: 148, km: 71, label: 'below' },
  },
  {
    time: 'T+02:32',
    name: { en: 'Second-stage ignition', ko: '2단 점화', ja: '2段目点火' },
    note: { en: 'One vacuum engine burns for six minutes.', ko: '진공용 엔진 한 기가 6분 동안 연소합니다.', ja: '真空用エンジン1基が6分間燃焼します。' },
    altitude: '74 km',
    speed: '2,295 m/s',
  },
  {
    time: 'T+03:05',
    name: { en: 'Fairing separation', ko: '페어링 분리', ja: 'フェアリング分離' },
    note: { en: 'The two halves of the nose fall away above the air.', ko: '노즈 페어링 두 쪽이 대기권 위에서 떨어져 나갑니다.', ja: 'ノーズフェアリングの左右2片が大気圏の上で離脱します。' },
    altitude: '112 km',
    speed: '2,520 m/s',
    mark: { t: 185, km: 112, label: 'upleft' },
  },
  {
    time: 'T+08:40',
    name: { en: 'Second-stage cutoff', ko: '2단 연소 종료', ja: '2段目エンジン停止' },
    note: { en: 'Kestrel-2 is in a 520 km polar orbit.', ko: 'Kestrel-2가 520 km 극궤도에 들어갑니다.', ja: 'Kestrel-2は520 kmの極軌道に入ります。' },
    altitude: '520 km',
    speed: '7,610 m/s',
    mark: { t: 520, km: 520, label: 'down' },
  },
  {
    time: 'T+09:50',
    name: { en: 'Fjellrev-1 separates', ko: 'Fjellrev-1 분리', ja: 'Fjellrev-1 分離' },
    note: { en: 'Springs push the satellite off its adapter at 0.6 m/s.', ko: '스프링이 위성을 0.6 m/s로 어댑터에서 밀어냅니다.', ja: 'スプリングが衛星を0.6 m/sでアダプターから押し出します。' },
    altitude: '521 km',
    speed: '7,612 m/s',
    mark: { t: 590, km: 521, label: 'upleft' },
    go: true,
  },
  {
    time: 'T+10:20',
    name: { en: 'Rideshare release', ko: '부차 탑재체 방출', ja: '相乗り衛星の放出' },
    note: { en: 'Two small satellites built by a student team in Tromsø.', ko: 'Tromsø의 학생 팀이 만든 소형 위성 두 기입니다.', ja: 'Tromsøの学生チームが製作した小型衛星2機です。' },
    altitude: '521 km',
    speed: '7,612 m/s',
    mark: { t: 620, km: 521 },
  },
];

// The ascent as the profile draws it: 660 s across, 600 km up, with y counted from the top.
const ASCENT_PATH =
  'M0 600 L11 599.9 L30 598 L45 594 L58 589 L75 581 L90 572 L105 562 L120 552 L135 540 L144 532 L148 529 L152 526 L170 507 L185 488 L210 450 L240 400 L270 348 L300 300 L330 255 L360 215 L390 180 L420 150 L450 124 L480 104 L500 91 L520 80 L560 79.2 L660 79';
const Y_MARKS = [
  { km: '600', top: '0%' },
  { km: '400', top: '33.33%' },
  { km: '200', top: '66.67%' },
  { km: '0', top: '100%' },
];
const X_MARKS = ['T+0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const TELE = {
  title: { en: 'Telemetry from the pad', ko: '발사대 원격 측정', ja: '発射台からのテレメトリ' },
  lede: {
    en: 'Mission time, altitude, speed and distance stay at zero until the clamps let go, then update ten times a second. Tank levels, pressures and power are live now, read over the pad cable.',
    ko: '임무 시각, 고도, 속도, 거리는 클램프가 풀릴 때까지 0으로 있다가, 그 뒤 초당 10회 갱신됩니다. 탱크 양, 압력, 전원은 지금 발사대 케이블을 통해 실시간으로 읽고 있습니다.',
    ja: 'ミッション時刻、高度、速度、距離はクランプが外れるまで0のままで、その後は毎秒10回更新されます。タンクの量、圧力、電源は今、発射台のケーブル経由で読み取っています。',
  },
  link: { en: 'Kestrel-2 downlink, 2.25 GHz', ko: 'Kestrel-2 하향 링크, 2.25 GHz', ja: 'Kestrel-2 下りリンク、2.25 GHz' },
  locked: { en: 'Locked, updated {t}', ko: '수신 고정, {t} 갱신', ja: '受信固定、{t}更新' },
  mission: { en: 'Mission time', ko: '임무 시각', ja: 'ミッション時刻' },
  altitude: { en: 'Altitude', ko: '고도', ja: '高度' },
  speed: { en: 'Speed', ko: '속도', ja: '速度' },
  downrange: { en: 'Downrange', ko: '전방 거리', ja: '前方距離' },
  tanks: { en: 'Propellant tanks', ko: '추진제 탱크', ja: '推進剤タンク' },
} satisfies Record<string, Tri>;

const GAUGES: Array<{ name: Tri; value: string; topping?: boolean }> = [
  { name: { en: 'Stage 1 oxygen', ko: '1단 산소', ja: '1段目 酸素' }, value: '100%' },
  { name: { en: 'Stage 1 propane', ko: '1단 프로판', ja: '1段目 プロパン' }, value: '100%' },
  { name: { en: 'Stage 2 oxygen', ko: '2단 산소', ja: '2段目 酸素' }, value: '99.6%', topping: true },
  { name: { en: 'Stage 2 propane', ko: '2단 프로판', ja: '2段目 プロパン' }, value: '100%' },
];

const PAD = {
  stage1: { en: 'Stage 1 tank pressure', ko: '1단 탱크 압력', ja: '1段目 タンク圧力' },
  stage2: { en: 'Stage 2 tank pressure', ko: '2단 탱크 압력', ja: '2段目 タンク圧力' },
  battery: { en: 'Flight battery', ko: '비행 배터리', ja: '飛行バッテリー' },
  satellites: { en: 'Navigation satellites', ko: '항법 위성', ja: '航法衛星' },
  inView: { en: '14 in view', ko: '가시 14개', ja: '14基が可視' },
  power: { en: 'Power source', ko: '전원', ja: '電源' },
  ground: { en: 'Ground', ko: '지상', ja: '地上' },
  internal: { en: 'Internal', ko: '내부', ja: '内部' },
} satisfies Record<string, Tri>;

const WATCH = {
  title: { en: 'Where to watch', ko: '관람 장소', ja: '観覧場所' },
  lede: {
    en: 'In late November the sun stays low over Andøya all day, so the flame shows from far off. Dress for wind and -3 °C.',
    ko: '11월 말에는 Andøya 위로 해가 하루 종일 낮게 떠 있어 불꽃이 멀리서도 보입니다. 바람과 -3 °C에 대비해 따뜻하게 입으세요.',
    ja: '11月下旬は太陽がAndøyaの上空に一日中低くあるため、炎は遠くからでも見えます。風と-3 °Cに備えた服装でお越しください。',
  },
  from: { en: 'from {t}', ko: '{t}부터', ja: '{t}から' },
} satisfies Record<string, Tri>;

const PLACES: Array<{ name: Tri; from: string; lead: Tri; text: Tri; times: Record<string, string> }> = [
  {
    name: { en: 'Live stream', ko: '실시간 방송', ja: 'ライブ配信' },
    from: '12:10',
    lead: { en: 'lomvi.space/live', ko: 'lomvi.space/live', ja: 'lomvi.space/live' },
    text: {
      en: '{lead}, in Norwegian and English. It stays on until Fjellrev-1 sends its first signal, about 50 minutes after liftoff.',
      ko: '{lead}에서 노르웨이어와 영어로 볼 수 있습니다. 방송은 발사 약 50분 뒤 Fjellrev-1이 첫 신호를 보낼 때까지 계속됩니다.',
      ja: '{lead}で、ノルウェー語と英語で視聴できます。配信は打ち上げの約50分後にFjellrev-1が最初の信号を送るまで続きます。',
    },
    times: {},
  },
  {
    name: { en: 'Bleik harbour', ko: 'Bleik 항구', ja: 'Bleik港' },
    from: '10:00',
    lead: { en: '9 km south of the pad', ko: '발사대 남쪽 9 km', ja: '発射台から南へ9 km' },
    text: {
      en: '{lead}, the closest public place. Free. The coast road north of Bleik closes from {a} to {b}, so park in the village. You hear the engines 26 seconds after you see the flame.',
      ko: '{lead}, 가장 가까운 공개 장소입니다. 무료입니다. Bleik 북쪽 해안도로는 {a}부터 {b}까지 통제되므로 마을에 주차하세요. 불꽃을 본 뒤 26초 뒤에 엔진 소리가 들립니다.',
      ja: '{lead}。最も近い一般公開の場所です。無料です。Bleikの北の海岸道路は{a}から{b}まで通行止めになるため、村に駐車してください。炎が見えてから26秒後にエンジン音が聞こえます。',
    },
    times: { a: '11:30', b: '14:30' },
  },
  {
    name: { en: 'Andenes harbour', ko: 'Andenes 항구', ja: 'Andenes港' },
    from: '11:30',
    lead: { en: '22 km north', ko: '북쪽 22 km', ja: '北へ22 km' },
    text: {
      en: '{lead}. Look south-west, low over the hills. The sound arrives about a minute after liftoff.',
      ko: '{lead}. 남서쪽 언덕 위 낮은 곳을 보세요. 소리는 발사 약 1분 뒤에 도착합니다.',
      ja: '{lead}。南西の丘の上の低い空を見てください。音は打ち上げの約1分後に届きます。',
    },
    times: {},
  },
];

const ALERTS = {
  title: { en: 'Launch alerts', ko: '발사 알림', ja: '打ち上げ通知' },
  note: {
    en: 'Three emails at most: when the live stream starts at {a}, at liftoff, and if the launch moves to the backup day. We delete the address on 23 November.',
    ko: '이메일은 최대 3통입니다. 실시간 방송이 {a}에 시작할 때, 발사 순간에, 발사가 예비일로 옮겨질 때 보냅니다. 11월 23일에 이 주소를 삭제합니다.',
    ja: 'メールは最大3通です。ライブ配信が{a}に始まったとき、打ち上げの瞬間、そして打ち上げが予備日に移ったときに送ります。11月23日にこのメールアドレスを削除します。',
  },
  label: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  submit: { en: 'Send me alerts', ko: '알림 받기', ja: '通知を受け取る' },
  empty: { en: 'Write the email address the alerts should go to.', ko: '알림을 받을 이메일 주소를 입력하세요.', ja: '通知を受け取るメールアドレスを入力してください。' },
  invalid: {
    en: 'This address is missing a part. It should look like name@example.no.',
    ko: '이메일 주소의 일부가 빠졌습니다. name@example.no 형식이어야 합니다.',
    ja: 'メールアドレスの一部が足りません。name@example.no の形式で入力してください。',
  },
  doneTitle: { en: 'Alerts will go to {email}.', ko: '알림을 {email} 주소로 보냅니다.', ja: '通知は{email}に届きます。' },
  doneBody: {
    en: 'The first one comes at {a}, when the live stream starts. Every email has a link that stops the rest.',
    ko: '첫 알림은 실시간 방송이 시작하는 {a}에 옵니다. 모든 이메일에는 나머지 알림을 멈추는 링크가 있습니다.',
    ja: '最初の通知は、ライブ配信が始まる{a}に届きます。どのメールにも、以降の通知を止めるリンクがあります。',
  },
  change: { en: 'Use another address', ko: '다른 주소 사용', ja: '別のアドレスを使う' },
} satisfies Record<string, Tri>;

const FOOT = {
  company: { en: 'Lomvi Aerospace, Andenes, Norway', ko: 'Lomvi Aerospace, Andenes, 노르웨이', ja: 'Lomvi Aerospace, Andenes, ノルウェー' },
  cet: { en: 'All times are Central European Time', ko: '모든 시각은 중부유럽시간(CET)입니다', ja: 'すべての時刻は中央ヨーロッパ時間（CET）です' },
  utc: { en: 'All times are UTC', ko: '모든 시각은 UTC입니다', ja: 'すべての時刻はUTCです' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Console Launch style: a true-black control-room page in neutral greys, where one emerald marks "go" and nothing else.

Pick a believable subject that is read at a glance against a clock, such as a rocket launch day, a ferry crossing in weather or a marathon start, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is the launch-day page of Lomvi Aerospace: Kestrel-2 carries the sea-ice satellite Fjellrev-1 from Andøya, Norway, at 12:40 today. The countdown, the launch window, the weather against its limits, the go/no-go poll, the flight from liftoff to payload separation, the pad telemetry, where to watch and a launch-alert sign-up.

TOKENS:
--bg: #080808
--panel: #111111 (also the opaque surface for any menu that opens over the page)
--raise: #191919 (the empty track of a limit bar)
--ink: #ececec (headings, figures, the pressed time-zone key, the HOLD tag and answer, the form's button, the focus ring)
--text: #e2e2e2 (reading text)
--muted: #9c9c9c (labels, notes, units)
--dim: #626262 (the clock's colons and the telemetry still at zero, both large figures)
--line: #4c4c4c (panel borders, section rules, header rules)
--line-soft: #404040 (rows inside a panel or table)
--grid: #262626 (the profile's gridlines)
--fill: #c4c4c4 (the used part of a limit bar and the gauge segments)
--hold: #e6e6e6 (holds: a 4px edge, a hatch of 2px lines every 6px at -45deg, and the hold wash rgba(255,255,255,0.05))
--go: #10b981, --go-soft: #6ee7b7, --go-wash: rgba(16,185,129,0.16), dark text on go: #03140d

COLOUR:
- Emerald appears only on "go": the clock-running and downlink lamps, the square before the count's status, the GO answers and lamps, the launch window band and its label, the liftoff row, the payload separation event and the one "Watch live" action (#6ee7b7 on hover). No emerald headings, borders or gradients.
- A hold is white: a hatched lamp or bar, an ink HOLD tag, a white edge on the row. A form error uses the same white edge on the field and a hatched square before the message, never red. Pausing the page's clock turns its lamp into the hatched square.
- Text is light grey on black; muted text keeps at least 4.5:1. Structural lines are 1px solid #4c4c4c, rows inside them #404040; only the profile's gridlines are fainter. Square corners everywhere, no shadows, no glow.

TYPOGRAPHY:
Two families, both drawn for cockpit displays. B612 (400, 700) sets headings, reading and every figure, with tabular figures. B612 Mono (400, 700) sets what an operator scans: units, column heads, the profile's axes, the call signs on the lamps, the telemetry labels, the gauge captions (B612 on phones), the "next" and HOLD tags, the limits, the time-zone keys and the Pause key.
H1: B612 700, clamp(2.1rem, 3.8vw, 3.125rem), line-height 1.08, letter-spacing -0.02em.
H2: B612 700, clamp(1.75rem, 2.6vw, 2.25rem), line-height 1.15, letter-spacing -0.015em; panel titles 1.0625rem 700.
The countdown: B612 700 sized to its panel (container width / 5.6), line-height 0.9; the colons in --dim; units under each pair in B612 Mono 1rem.
The window times: B612 700 2.375rem. The tally: B612 700 5.25rem. Telemetry readouts: B612 700 clamp(2.4rem, 4.4vw, 3.6rem) in --dim, 2.25rem on phones.
Body: B612 400 at 1rem, line-height 1.6; section ledes 1.0625rem (1rem beside the headline and on phones). No text under 1rem, except the drawn labels of the window strip, the profile's axis numbers and the lamp call signs, which are hidden from assistive technology and said in text nearby, at 0.875rem. No letter-spaced capitals; call signs and GO/HOLD are written as operators write them, with no added tracking.

LAYOUT:
- The site's own bar: the company mark, four in-page links, the local time at the pad, and "Watch live" as the one emerald button.
- Hero on a 12-column grid: the H1 over eight columns with a one-sentence lede beside it; then the countdown panel (eight columns) beside the launch window panel (four), both in full on a 1280x800 laptop's first screen; under them "The rest of the count" beside the weather panel. Below 1080px the countdown takes the full width and the window and weather sit side by side; on phones everything stacks.
- Then the go/no-go poll, the flight, the telemetry, where to watch, launch alerts and a two-part footer. A 1120px column; each section opens on a 1px rule with 72px of space above and below its content (56px on phones).

COMPONENTS:
- Countdown: a panel whose head names liftoff (day and time with its zone), a "Clock running" lamp and a Pause key. The clock is T-hh:mm:ss, a role="timer" with a spoken label, and ticks every second from the real clock. Pause freezes the page's clock and says the count goes on at the pad; Resume shows the live count again. A one-line status sits under the clock.
- Launch window: the window times, a 150-minute strip with the window as a labelled emerald band and a labelled 2px "now" line that moves with the clock, hourly ticks, and the backup day. A CET/UTC switch (two keys with aria-pressed) changes every time on the page, including the header clock, the count's times, the notes, the watch list and the footer, and announces the change.
- The rest of the count: an ordered list of count time, clock time and event; the next event carries a small "next" tag and passed events turn muted.
- Weather: rows of reading against limit, with a thin bar and a 2px limit mark; the reading that holds the count has a HOLD tag and a hatched bar.
- Go/no-go poll: the tally of stations go with eight lamps, then a board of station, console, answer and note. Each station is a button (aria-expanded) that opens its full note under the short one. GO is emerald text on a 3px emerald edge; HOLD is an ink tag, and its row has a white edge and the hold wash.
- Flight: an altitude profile with square event markers and labels, then the same events as a table of time, event, altitude and speed. On phones the labels leave the profile and the table rows stack.
- Telemetry: big readouts held at zero in --dim, four tank gauges of 20 segments, and a list of pad readings; the power source turns from Ground to Internal at T-10.
- Launch alerts: one email field with a label, a solid ink button, an error under the field with role="alert", and a confirmation that replaces the form, takes focus and offers "Use another address".

MOTION:
- Only the clock-running lamp breathes, 2s. The digits change in place without animation. Hover changes colour in 120ms. prefers-reduced-motion stops the lamp and the transitions; the clock still counts.

FORBIDDEN:
- Cards, rounded corners, pills, chips, glass, glows, shadows, neon, scanlines, terminal green
- A small label above a heading, letter-spaced capitals, numbered section markers
- Blue, cyan, red or amber anywhere; emerald on anything that is not "go"
- Rocket illustrations, photographs, emoji, decorative icons
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about consoles, darkness or the design itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a timer, a toggle group for the zone, an ordered list for the count, a description list for the weather, tables with explicit roles for the poll, the flight and the watch list, a labelled form
3) A working countdown with Pause and Resume, the zone switch, the station notes and the alert form with error and success states
4) Responsive layout down to 320px with no horizontal scroll; every control at least 44px tall on phones
5) Visible focus on every control, a polite live region for the zone and pause changes, reduced-motion support`;

const PROMPT_KO = `Console Launch 스타일로 실제 페이지 하나를 디자인한다. 무채색 회색의 순검정 관제실 페이지이며, 에메랄드색은 "go"만 표시하고 그 밖에는 쓰지 않는다.

시계에 맞춰 한눈에 읽히는 그럴듯한 주제를 고르고, 그 주제의 실제 내용을 쓴다. 예를 들면 로켓 발사일, 악천후 속 페리 운항, 마라톤 출발이다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 Lomvi Aerospace의 발사일 페이지다. Kestrel-2가 오늘 12:40에 노르웨이 Andøya에서 해빙 관측 위성 Fjellrev-1을 싣고 발사된다. 카운트다운, 발사 가능 시간대, 한계와 비교한 기상, Go/No-go 확인, 발사부터 탑재체 분리까지의 비행, 발사대 원격 측정, 시청 장소, 발사 알림 신청을 담는다.

TOKENS:
--bg: #080808
--panel: #111111 (페이지 위에 열리는 메뉴의 불투명 표면도 겸함)
--raise: #191919 (한계 막대의 빈 트랙)
--ink: #ececec (제목, 숫자, 눌린 시간대 키, 보류 태그와 응답, 폼 버튼, 포커스 링)
--text: #e2e2e2 (본문 텍스트)
--muted: #9c9c9c (라벨, 메모, 단위)
--dim: #626262 (시계의 콜론과 아직 0인 원격 측정값, 둘 다 큰 숫자)
--line: #4c4c4c (패널 테두리, 섹션 구분선, 헤더 구분선)
--line-soft: #404040 (패널이나 표 안의 행)
--grid: #262626 (프로파일의 격자선)
--fill: #c4c4c4 (한계 막대의 사용된 부분과 게이지 칸)
--hold: #e6e6e6 (보류: 4px 가장자리, -45deg로 6px마다 2px 선이 있는 빗금, 보류 음영 rgba(255,255,255,0.05))
--go: #10b981, --go-soft: #6ee7b7, --go-wash: rgba(16,185,129,0.16), go 위의 어두운 글자: #03140d

COLOUR:
- 에메랄드색은 "go"에만 나타난다. 카운트 진행과 하향 링크 램프, 카운트 상태 앞의 사각형, 진행 응답과 램프, 발사 시간대 띠와 라벨, 발사 행, 탑재체 분리 이벤트, 그리고 "실시간 보기" 버튼 하나(호버 시 #6ee7b7)다. 에메랄드색 제목, 테두리, 그라디언트는 쓰지 않는다.
- 보류는 흰색이다. 빗금 친 램프나 막대, --ink 색 보류 태그, 행의 흰 가장자리로 나타낸다. 폼 오류는 필드의 같은 흰 가장자리와 메시지 앞의 빗금 사각형으로 나타내며, 빨간색은 쓰지 않는다. 페이지 시계를 일시정지하면 램프가 빗금 사각형으로 바뀐다.
- 텍스트는 검정 바탕의 밝은 회색이다. 흐린 텍스트도 명도 대비 4.5:1 이상을 유지한다. 구조선은 1px 실선 #4c4c4c이고 그 안의 행은 #404040이다. 격자선만 더 옅다. 모서리는 모두 직각이며, 그림자와 광채는 없다.

TYPOGRAPHY:
두 가지 서체군이며, 둘 다 조종석 디스플레이를 위해 그렸다. B612(400, 700)는 제목, 본문, 모든 숫자를 맡고 고정폭 숫자를 쓴다. B612 Mono(400, 700)는 운영자가 훑어보는 요소를 맡는다. 단위, 열 머리글, 프로파일의 축, 램프의 호출 부호, 원격 측정 라벨, 게이지 캡션(휴대폰에서는 B612), "다음" 태그, 보류 태그, 한계값, 시간대 키, 일시정지 키다.
H1: B612 700, clamp(2.1rem, 3.8vw, 3.125rem), line-height 1.08, letter-spacing -0.02em.
H2: B612 700, clamp(1.75rem, 2.6vw, 2.25rem), line-height 1.15, letter-spacing -0.015em. 패널 제목은 1.0625rem 700.
카운트다운: 패널 너비에 맞춘 B612 700(컨테이너 너비 / 5.6), line-height 0.9. 콜론은 --dim, 각 쌍 아래의 단위는 B612 Mono 1rem.
시간대 시각: B612 700 2.375rem. 집계: B612 700 5.25rem. 원격 측정 수치: --dim 색의 B612 700 clamp(2.4rem, 4.4vw, 3.6rem), 휴대폰에서는 2.25rem.
본문: B612 400, 1rem, line-height 1.6. 섹션 리드 문단은 1.0625rem(제목 옆과 휴대폰에서는 1rem)이다. 1rem보다 작은 텍스트는 두지 않는다. 예외는 시간대 띠에 그려진 라벨, 프로파일 축 숫자, 램프 호출 부호뿐이며, 이들은 보조 기술에서 숨기고 근처 본문에서 0.875rem으로 설명한다. 자간을 넓힌 대문자는 쓰지 않는다. 호출 부호와 진행/보류는 운영자가 쓰는 방식 그대로 적고 자간을 더하지 않는다.

LAYOUT:
- 사이트 자체 상단 바: 회사 마크, 페이지 내 링크 네 개, 발사대의 현지 시각, 에메랄드색 버튼 하나인 "실시간 보기".
- 히어로는 12열 그리드다. 8열을 차지하는 H1 옆에 한 문장짜리 리드를 둔다. 그다음 카운트다운 패널(8열)과 발사 시간대 패널(4열)을 나란히 두며, 1280x800 노트북의 첫 화면에 둘 다 전부 들어가야 한다. 그 아래에 날씨 패널과 나란히 "남은 카운트 일정"을 둔다. 1080px 미만에서는 카운트다운이 전체 너비를 쓰고, 시간대와 날씨는 나란히 놓는다. 휴대폰에서는 모두 세로로 쌓는다.
- 그다음은 Go/No-go 확인, 비행, 원격 측정, 시청 장소, 발사 알림, 두 부분으로 된 바닥글이다. 본문 열은 1120px이며, 각 섹션은 1px 구분선으로 시작하고 내용 위아래로 72px 여백을 둔다(휴대폰에서는 56px).

COMPONENTS:
- 카운트다운: 헤더에 발사 시각(날짜, 시간, 시간대)을 적고, "카운트 진행 중" 램프와 일시정지 키를 둔다. 시계는 T-hh:mm:ss이며, 음성 라벨이 있는 role="timer"이고, 실제 시계에 맞춰 매초 갱신한다. 일시정지는 페이지의 시계를 멈추고 카운트는 발사대에서 계속된다고 알린다. 재생은 다시 실시간 카운트를 보여 준다. 시계 아래에 한 줄짜리 상태 문구를 둔다.
- 발사 시간대: 시간대 시각, 150분짜리 띠(발사 구간은 라벨이 붙은 에메랄드색 띠), 시계와 함께 움직이는 라벨 붙은 2px "현재" 선, 매시 눈금, 예비일. CET/UTC 전환(aria-pressed를 가진 키 두 개)은 헤더 시계, 카운트 시각, 메모, 시청 목록, 바닥글을 포함해 페이지의 모든 시각을 바꾸고, 그 변경을 알린다.
- 남은 카운트 일정: 카운트 시각, 시계 시각, 이벤트를 담은 순서 있는 목록. 다음 이벤트에는 작은 "다음" 태그를 달고, 지난 이벤트는 흐리게 바꾼다.
- 기상: 측정값과 한계를 비교하는 행. 얇은 막대와 2px 한계 표시를 둔다. 카운트를 보류시키는 측정값에는 보류 태그와 빗금 막대를 단다.
- Go/No-go 확인: 진행 담당 구역 집계와 램프 8개, 그 아래에 담당 구역, 담당자, 응답, 메모 열을 가진 표. 각 담당 구역은 aria-expanded를 가진 버튼이며, 누르면 짧은 메모 아래에 전체 메모가 열린다. 진행(GO)은 3px 에메랄드 가장자리 위의 에메랄드색 글자이고, 보류는 --ink 색 태그이며, 그 행에는 흰 가장자리와 보류 음영을 둔다.
- 비행: 사각형 이벤트 표시와 라벨을 단 고도 프로파일, 그다음 같은 이벤트를 시각, 이벤트, 고도, 속도 표로 보여 준다. 휴대폰에서는 라벨을 프로파일 밖으로 빼고 표의 행을 세로로 쌓는다.
- 원격 측정: --dim 색으로 0에 머무는 큰 수치, 20칸짜리 탱크 게이지 네 개, 발사대 측정값 목록. 전원은 T-10에 지상에서 내부로 바뀐다.
- 발사 알림: 라벨이 붙은 이메일 입력란 하나, 단색 --ink 버튼, 입력란 아래의 role="alert" 오류 메시지, 폼을 대신하며 포커스를 받고 "다른 주소 사용"을 제시하는 확인 화면.

MOTION:
- 카운트 진행 램프만 2초 주기로 밝기가 오르내린다. 숫자는 애니메이션 없이 제자리에서 바뀐다. 호버 색 변화는 120ms다. prefers-reduced-motion에서는 램프와 전환 효과를 멈추며, 시계는 계속 센다.

FORBIDDEN:
- 카드, 둥근 모서리, 알약형 버튼, 칩, 유리 질감, 글로우, 그림자, 네온, 스캔라인, 터미널 초록
- 제목 위의 작은 라벨, 자간을 넓힌 대문자, 번호가 붙은 섹션 표시
- 파란색, 청록색, 빨간색, 호박색 금지. "go"가 아닌 곳에 에메랄드색 금지
- 로켓 일러스트, 사진, 이모지, 장식 아이콘
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙이는 번호
- 콘솔, 어둠, 디자인 자체에 대한 문구

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 정의 속성
2) 시맨틱 HTML: 타이머, 시간대용 토글 그룹, 카운트용 순서 목록, 날씨용 설명 목록, 확인·비행·시청 목록에 명시적 role을 준 표, 라벨이 붙은 폼
3) 일시정지와 재생이 작동하는 카운트다운, 시간대 전환, 담당 구역 메모, 오류와 성공 상태를 가진 알림 폼
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서는 모든 컨트롤의 높이를 최소 44px로 한다.
5) 모든 컨트롤에 보이는 포커스, 시간대와 일시정지 변경을 알리는 polite 라이브 영역, reduced-motion 지원`;

const PROMPT_JA = `Console Launch スタイルで実在するページを一つデザインする。無彩色のグレーで組んだ真っ黒な管制室ページで、エメラルド色は「go」を示すためだけに使い、ほかには使わない。

時計に照らして一目で読まれる、もっともらしい題材を選び、その実際の内容を書く。例えばロケットの打ち上げ日、荒天時のフェリーの航行、マラソンのスタート。ページはその題材のページとして読まれなければならず、スタイルそのものについてのページであってはならない。ここでは Lomvi Aerospace の打ち上げ当日のページである。Kestrel-2 が本日12:40にノルウェーの Andøya から海氷観測衛星 Fjellrev-1 を運ぶ。カウントダウン、打ち上げ時間帯、上限と比べた気象、Go/No-go の確認、打ち上げからペイロード分離までの飛行、発射台のテレメトリ、視聴場所、打ち上げ通知の登録を含める。

TOKENS:
--bg: #080808
--panel: #111111（ページの上に開くメニューの不透明な面も兼ねる）
--raise: #191919（上限バーの空のトラック）
--ink: #ececec（見出し、数字、押された時間帯キー、保留タグと回答、フォームのボタン、フォーカスリング）
--text: #e2e2e2（本文）
--muted: #9c9c9c（ラベル、メモ、単位）
--dim: #626262（時計のコロンと、まだ0のテレメトリ。いずれも大きな数字）
--line: #4c4c4c（パネルの枠線、セクションの区切り線、ヘッダーの区切り線）
--line-soft: #404040（パネルや表の中の行）
--grid: #262626（高度プロファイルの格子線）
--fill: #c4c4c4（上限バーの使用済み部分とゲージの区画）
--hold: #e6e6e6（保留：4pxの縁、-45degで6pxごとに2pxの線を引く斜線、保留の淡い色 rgba(255,255,255,0.05)）
--go: #10b981, --go-soft: #6ee7b7, --go-wash: rgba(16,185,129,0.16), go 上の暗い文字: #03140d

COLOUR:
- エメラルド色は「go」にだけ現れる。カウント中と下りリンクのランプ、カウント状態の前の四角、可（GO）の回答とランプ、打ち上げ時間帯の帯とそのラベル、打ち上げの行、ペイロード分離のイベント、そして「ライブで見る」の操作ひとつ（ホバー時 #6ee7b7）。エメラルド色の見出し、枠線、グラデーションは使わない。
- 保留は白である。斜線の入ったランプや棒、--ink 色の保留タグ、行の白い縁で示す。フォームのエラーは、フィールドに同じ白い縁を付け、メッセージの前に斜線の四角を置く。赤は使わない。ページの時計を一時停止すると、ランプが斜線の四角に変わる。
- テキストは黒地の明るいグレーである。控えめなテキストも4.5:1以上のコントラストを保つ。構造線は1pxの実線 #4c4c4c、その中の行は #404040 である。格子線だけがさらに淡い。角はすべて直角で、影と光彩は使わない。

TYPOGRAPHY:
2種類の書体で、どちらも計器盤のために描かれたものである。B612（400、700）は見出し、本文、すべての数字を組み、数字は等幅にする。B612 Mono（400、700）は運用者が一目で追う要素を組む。単位、列見出し、プロファイルの軸、ランプのコールサイン、テレメトリのラベル、ゲージのキャプション（スマートフォンでは B612）、「次」と保留のタグ、上限値、時間帯のキー、一時停止キーである。
H1: B612 700, clamp(2.1rem, 3.8vw, 3.125rem), line-height 1.08, letter-spacing -0.02em.
H2: B612 700, clamp(1.75rem, 2.6vw, 2.25rem), line-height 1.15, letter-spacing -0.015em。パネル見出しは 1.0625rem 700。
カウントダウン: パネル幅に合わせた B612 700（コンテナ幅 / 5.6）、line-height 0.9。コロンは --dim、各組の下の単位は B612 Mono 1rem。
時間帯の時刻: B612 700 2.375rem。集計: B612 700 5.25rem。テレメトリの数値: --dim の B612 700 clamp(2.4rem, 4.4vw, 3.6rem)、スマートフォンでは 2.25rem。
本文: B612 400、1rem、line-height 1.6。セクションの導入文は 1.0625rem（見出しの横とスマートフォンでは 1rem）。1rem未満の文字は使わない。例外は時間帯の帯に描いたラベル、プロファイル軸の数字、ランプのコールサインで、支援技術からは隠し、近くの本文で 0.875rem により説明する。字間を広げた大文字は使わない。コールサインと可/保留は運用者が書くとおりに書き、字間は足さない。

LAYOUT:
- サイト自体のバー: 社名マーク、ページ内リンク4つ、発射台の現地時刻、エメラルド色のボタン1つ「ライブで見る」。
- ヒーローは12列のグリッドである。8列を使うH1の横に一文の導入文を置く。続いてカウントダウンのパネル（8列）と打ち上げ時間帯のパネル（4列）を並べ、1280x800のノートパソコンの最初の画面に両方が全部収まるようにする。その下に「カウントの残り」を天気のパネルと並べる。1080px未満ではカウントダウンが全幅を使い、時間帯と天気が横に並ぶ。スマートフォンではすべてを縦に積む。
- 続いて Go/No-go の確認、飛行、テレメトリ、視聴場所、打ち上げ通知、二部構成のフッターである。本文の幅は1120px。各セクションは1pxの区切り線で始まり、内容の上下に72pxの余白を取る（スマートフォンでは56px）。

COMPONENTS:
- カウントダウン: 見出しに打ち上げの日時（タイムゾーン付き）を示すパネル。「カウント中」のランプと一時停止キーを置く。時計は T-hh:mm:ss で、音声ラベル付きの role="timer" とし、実際の時計に合わせて毎秒更新する。一時停止はページの時計を止め、カウントは発射台で続くと伝える。再開を押すと再びリアルタイムのカウントを表示する。時計の下に一行の状態文を置く。
- 打ち上げ時間帯: 時間帯の時刻、150分の帯（時間帯はラベル付きのエメラルド色の帯）、時計とともに動くラベル付きの2pxの「現在」線、1時間ごとの目盛り、予備日。CET/UTC の切り替え（aria-pressed を持つキー2つ）は、ヘッダーの時計、カウントの時刻、メモ、視聴リスト、フッターを含むページのすべての時刻を変え、その変更を伝える。
- カウントの残り: カウント時刻、時計の時刻、イベントを並べた順序付きリスト。次のイベントには小さな「次」タグを付け、過ぎたイベントは淡い色にする。
- 気象: 測定値と上限を比べる行。細い棒と2pxの上限マークを付ける。カウントを保留させている測定値には保留タグと斜線の棒を付ける。
- Go/No-go の確認: 可の担当数と8個のランプの集計、その下に担当、担当者、回答、メモの列を持つ表。各担当は aria-expanded を持つボタンで、押すと短いメモの下に全文のメモが開く。可（GO）は3pxのエメラルド色の縁の上のエメラルド色の文字、保留は --ink 色のタグで、その行には白い縁と保留の淡い色を付ける。
- 飛行: 四角いイベント印とラベルを付けた高度プロファイル。その後に同じイベントを時刻、イベント、高度、速度の表で示す。スマートフォンではラベルをプロファイルの外に出し、表の行を縦に積む。
- テレメトリ: --dim 色で0のままの大きな数値、20区画のタンクゲージ4つ、発射台の測定値の一覧。電源はT-10で地上から内部に切り替わる。
- 打ち上げ通知: ラベル付きのメールアドレス欄1つ、単色の --ink ボタン、欄の下に role="alert" のエラー。フォームに代わる確認画面はフォーカスを受け取り、「別のアドレスを使う」を示す。

MOTION:
- カウント中のランプだけが2秒周期で明暗を変える。数字はアニメーションなしでその場で変わる。ホバーの色変化は120ms。prefers-reduced-motion では、ランプと遷移を止めるが、時計は数え続ける。

FORBIDDEN:
- カード、角丸、ピル型、チップ、ガラス調、グロー、影、ネオン、スキャンライン、ターミナルグリーン
- 見出しの上の小さなラベル、字間を広げた大文字、番号付きのセクション印
- 青、シアン、赤、アンバーは使わない。「go」以外にエメラルド色を使わない
- ロケットのイラスト、写真、絵文字、装飾アイコン
- リンクの矢印、中黒でつないだメタ文字列、実際の順序でないものへの番号
- コンソール、暗さ、デザインそのものについての文言

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML: タイマー、時間帯用のトグルグループ、カウント用の順序付きリスト、気象用の説明リスト、確認・飛行・視聴リストに明示的な role を付けた表、ラベル付きのフォーム
3) 一時停止と再開が動くカウントダウン、時間帯の切り替え、担当のメモ、エラーと成功の状態を持つ通知フォーム
4) 320pxまで横スクロールなしで対応するレスポンシブレイアウト。スマートフォンではすべてのコントロールの高さを最低44pxにする。
5) すべてのコントロールに見えるフォーカス、時間帯と一時停止の変更を伝える polite なライブ領域、reduced-motion への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type EmailError = 'empty' | 'invalid' | null;

export function PortedConsoleLaunchPage({ lang }: PortedStylePageProps) {
  const [zone, setZone] = useState<Zone>('cet');
  const [now, setNow] = useState(START);
  const [paused, setPaused] = useState(false);
  const [news, setNews] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<EmailError>(null);
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const openedAt = useRef<number | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasSubscribed = useRef(false);

  const t = (text: Tri) => text[lang];
  const at = (clock: string) => wall(parse(clock), zone, clock.length > 5);
  const timed = (text: Tri, times: Record<string, string>) =>
    fill(t(text), Object.fromEntries(Object.entries(times).map(([key, clock]) => [key, at(clock)])));

  // The clock reads the real time four times a second, so a slow tick never skips a second on screen.
  useEffect(() => {
    if (openedAt.current === null) openedAt.current = Date.now();
    if (paused) return undefined;
    const opened = openedAt.current;
    const id = window.setInterval(() => setNow(liveNow(opened)), 250);
    return () => window.clearInterval(id);
  }, [paused]);

  // The form and the confirmation replace each other; focus goes to what took the place.
  useEffect(() => {
    if (subscribed !== null) doneRef.current?.focus();
    else if (wasSubscribed.current) emailRef.current?.focus();
    wasSubscribed.current = subscribed !== null;
  }, [subscribed]);

  const left = LIFTOFF - now;
  const [hh, mm, ss] = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60];
  const lifted = left <= 0;
  const nextEvent = SEQ.find((event) => parse(event.at) > now);
  const nowShare = Math.min(100, ((now - STRIP_FROM) / STRIP_SPAN) * 100);
  const goCount = STATIONS.filter((station) => !station.hold).length;

  const togglePause = () => {
    if (paused) {
      const live = liveNow(openedAt.current ?? Date.now());
      setNow(live);
      setPaused(false);
      setNews(fill(t(COUNT.resumedNews), { count: countText(LIFTOFF - live) }));
    } else {
      setPaused(true);
      setNews(fill(t(COUNT.pausedNews), { count: countText(left) }));
    }
  };

  const chooseZone = (next: Zone) => {
    if (next === zone) return;
    setZone(next);
    setNews(t(next === 'utc' ? WINDOW.newsUtc : WINDOW.newsCet));
  };

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const error: EmailError = value === '' ? 'empty' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : 'invalid';
    if (error === null) {
      setEmailError(null);
      setSubscribed(value);
      return;
    }
    // The error renders first, so the field and its message can be brought clear of the fixed page bar.
    flushSync(() => setEmailError(error));
    emailRef.current?.focus();
    emailRef.current?.closest('form')?.scrollIntoView({ block: 'nearest' });
  };

  const lampClass = lifted ? 'kl-lamp' : paused ? 'kl-lamp kl-lamp--paused' : 'kl-lamp kl-lamp--live';
  const lampText = t(lifted ? COUNT.liftoff : paused ? COUNT.paused : COUNT.running);
  const zoneName = ZONE_NAME[zone];

  return (
    <FusionShell
      fusionId="console-launch"
      lang={lang}
      tone="dark"
      accent="#10b981"
      prev={{ href: '/pages/midnight-noir.html', label: 'Midnight Noir' }}
      next={{ href: '/pages/bento-bloom.html', label: 'Bento Bloom' }}
      prompts={PROMPTS}
    >
      <div className="kl">
        <header className="kl-bar">
          <p className="kl-mark">
            <i aria-hidden="true" />
            <span>{COMPANY}<span className="kl-mark__rest">{COMPANY_REST}</span></span>
          </p>
          <nav className="kl-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#kl-poll">{t(HEAD.poll)}</a>
            <a href="#kl-flight">{t(HEAD.flight)}</a>
            <a href="#kl-tele">{t(HEAD.tele)}</a>
            <a href="#kl-alerts">{t(HEAD.alerts)}</a>
          </nav>
          <p className="kl-now">
            {PLACE} <b>{wall(now, zone, true)}</b> {zoneName}
          </p>
          <a className="kl-btn kl-btn--go" href="#kl-watch">{t(HEAD.watch)}</a>
        </header>

        <section className="kl-hero" aria-labelledby="kl-title">
          <div className="kl-hero__title">
            <h1 id="kl-title">{keep(fill(t(HERO.title), { time: at('12:40') }))}</h1>
            <p className="kl-lede">{t(HERO.lede)}</p>
          </div>

          <section className="kl-panel kl-count" aria-labelledby="kl-count-title">
            <div className="kl-head">
              <h2 id="kl-count-title">{fill(t(COUNT.head), { time: `${wall(LIFTOFF, zone, true)} ${zoneName}` })}</h2>
              <div className="kl-head__end">
                <span className={lampClass}>{lampText}</span>
                <button type="button" className="kl-key" onClick={togglePause}>
                  <i className={paused ? 'kl-key__play' : 'kl-key__pause'} aria-hidden="true" />
                  {t(paused ? COUNT.resume : COUNT.pause)}
                </button>
              </div>
            </div>
            <div className="kl-count__body">
              <div className="kl-clock" role="timer" aria-label={fill(t(COUNT.timer), { h: hh, m: mm, s: ss })}>
                <span aria-hidden="true">T-</span>
                <span aria-hidden="true">{pad(hh)}<small>{t(COUNT.h)}</small></span>
                <span className="kl-clock__sep" aria-hidden="true">:</span>
                <span aria-hidden="true">{pad(mm)}<small>{t(COUNT.min)}</small></span>
                <span className="kl-clock__sep" aria-hidden="true">:</span>
                <span aria-hidden="true">{pad(ss)}<small>{t(COUNT.s)}</small></span>
              </div>
            </div>
            <p className="kl-status"><span>{keep(t(COUNT.status))}</span></p>
          </section>

          <section className="kl-panel kl-window" aria-labelledby="kl-window-title">
            <div className="kl-window__head">
              <h2 className="kl-panel__title" id="kl-window-title">{t(WINDOW.title)}</h2>
              <div className="kl-tz" role="group" aria-label={t(WINDOW.zone)}>
                {ZONES.map((item) => (
                  <button key={item} type="button" aria-pressed={zone === item} onClick={() => chooseZone(item)}>
                    {ZONE_NAME[item]}
                  </button>
                ))}
              </div>
            </div>
            <p className="kl-window__time">
              {at('12:40')}<span> {t(WINDOW.to)} </span>{at('13:52')}
            </p>
            <p className="kl-window__note">{t(WINDOW.note)}</p>
            <div className="kl-strip" aria-hidden="true">
              <div className="kl-strip__track">
                <span className="kl-strip__win">{t(WINDOW.window)}</span>
                <span className="kl-strip__now" style={{ left: `${nowShare.toFixed(3)}%` }}>
                  <span>{t(WINDOW.now)}</span>
                </span>
              </div>
              <div className="kl-strip__ticks">
                {TICKS.map((tick) => <span key={tick}>{at(tick)}</span>)}
              </div>
            </div>
            <p className="kl-backup">
              {t(WINDOW.backup)}{' '}
              <b>
                {t(WINDOW.backupDay).split('{range}')[0]}
                <span className="kl-nw">{fill(t(WINDOW.range), { from: at('12:38'), to: at('13:50') })}</span>
                {t(WINDOW.backupDay).split('{range}')[1]}
              </b>
            </p>
          </section>

          <section className="kl-panel kl-seq" aria-labelledby="kl-seq-title">
            <div className="kl-head">
              <h2 id="kl-seq-title">{t(SEQ_TEXT.title)}</h2>
            </div>
            <ol className="kl-seq__list">
              {SEQ.map((event) => {
                const passed = parse(event.at) <= now;
                const state = [passed ? 'is-done' : '', event === nextEvent ? 'is-next' : '', event.count === 'T-00:00' ? 'is-t0' : ''].filter(Boolean).join(' ');
                return (
                  <li key={event.count} className={state || undefined}>
                    <b>{event.count}</b>
                    <time dateTime={`2026-11-21T${event.at}+01:00`}>{at(event.at)}</time>
                    <span>
                      {t(event.what)}
                      {event === nextEvent ? <span className="kl-tag">{t(SEQ_TEXT.next)}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="kl-panel kl-wx" aria-labelledby="kl-wx-title">
            <h2 className="kl-panel__title" id="kl-wx-title">{t(WX.title)}</h2>
            <dl>
              {WX_ROWS.map((row) => (
                <div key={row.name.en} className={row.hold ? 'is-hold' : undefined}>
                  <dt>
                    {row.hold ? <span className="kl-hold">{t(WX.hold)}</span> : null}
                    {t(row.name)}
                  </dt>
                  <dd>{t(row.value)}</dd>
                  {row.limit ? (
                    <dd className="kl-limit">
                      <i aria-hidden="true" style={{ '--kl-share': `${row.limit.share}%` } as CSSProperties} />
                      <span>{t(row.limit.label)}</span>
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </section>
        </section>

        <section className="kl-section kl-poll" id="kl-poll" aria-labelledby="kl-poll-title">
          <div className="kl-poll__head">
            <div>
              <h2 id="kl-poll-title">{t(POLL.title)}</h2>
              <p className="kl-lede">{keep(timed(POLL.lede, { a: '11:55', b: '12:25' }))}</p>
            </div>
            <div className="kl-tally">
              <p>
                <b>{goCount}</b>
                <span>{fill(t(POLL.tally), { n: STATIONS.length })}</span>
              </p>
              <ol className="kl-lamps" aria-hidden="true">
                {STATIONS.map((station) => (
                  <li key={station.call} className={station.hold ? 'is-hold' : undefined}>{station.call}</li>
                ))}
              </ol>
            </div>
          </div>

          <table className="kl-board" role="table" aria-labelledby="kl-poll-title">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(POLL.station)}</th>
                <th role="columnheader" scope="col">{t(POLL.console)}</th>
                <th role="columnheader" scope="col">{t(POLL.answer)}</th>
                <th role="columnheader" scope="col">{t(POLL.note)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {STATIONS.map((station) => {
                const isOpen = open[station.call] === true;
                const id = `kl-note-${station.call.toLowerCase()}`;
                return (
                  <tr key={station.call} role="row" className={station.hold ? 'is-hold' : undefined}>
                    <th role="rowheader" scope="row" data-label={t(POLL.station)}>
                      <button
                        type="button"
                        className="kl-board__open"
                        aria-expanded={isOpen}
                        aria-controls={id}
                        onClick={() => setOpen((current) => ({ ...current, [station.call]: !current[station.call] }))}
                      >
                        <i className={`kl-plus${isOpen ? ' is-open' : ''}`} aria-hidden="true" />
                        <span className="kl-call">{station.call}</span>
                        <span className="kl-board__name">{t(station.name)}</span>
                      </button>
                    </th>
                    <td role="cell" data-label={t(POLL.console)}>{station.who}</td>
                    <td role="cell" data-label={t(POLL.answer)}>
                      <span className={`kl-ans kl-ans--${station.hold ? 'hold' : 'go'}`}>{t(station.hold ? POLL.hold : POLL.go)}</span>
                    </td>
                    <td role="cell" data-label={t(POLL.note)}>
                      <p>{keep(timed(station.note, station.times))}</p>
                      <p className="kl-board__more" id={id} hidden={!isOpen}>{keep(timed(station.more, station.times))}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="kl-section" id="kl-flight" aria-labelledby="kl-flight-title">
          <h2 id="kl-flight-title">{t(FLIGHT.title)}</h2>
          <p className="kl-lede">{keep(t(FLIGHT.lede))}</p>

          <figure className="kl-plot">
            <div className="kl-plot__y" aria-hidden="true">
              <span className="kl-plot__unit">km</span>
              {Y_MARKS.map((mark) => <span key={mark.km} style={{ top: mark.top }}>{mark.km}</span>)}
            </div>
            <div className="kl-plot__area" role="img" aria-label={t(FLIGHT.plot)}>
              <svg viewBox="0 0 660 600" preserveAspectRatio="none" aria-hidden="true">
                <path className="kl-plot__orbit" d="M0 79 H660" />
                <path d={ASCENT_PATH} />
              </svg>
              {EVENTS.filter((event) => event.mark).map((event) => {
                const mark = event.mark!;
                const place = { '--kl-t': mark.t, '--kl-km': mark.km } as CSSProperties;
                return (
                  <Fragment key={event.time}>
                    <i className={`kl-ev${event.go ? ' kl-ev--go' : ''}`} style={place} />
                    {mark.label ? (
                      <span className={`kl-ev-label kl-ev-label--${mark.label}${event.go ? ' kl-ev-label--go' : ''}`} style={place}>
                        {t(event.name)}
                        <small>{event.time}</small>
                      </span>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
            <div className="kl-plot__x" aria-hidden="true">
              {X_MARKS.map((mark) => <span key={mark}>{mark}</span>)}
              <span>{t(FLIGHT.minutes)}</span>
            </div>
          </figure>

          <table className="kl-ascent" role="table" aria-labelledby="kl-flight-title">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(FLIGHT.time)}</th>
                <th role="columnheader" scope="col">{t(FLIGHT.event)}</th>
                <th role="columnheader" scope="col">{t(FLIGHT.altitude)}</th>
                <th role="columnheader" scope="col">{t(FLIGHT.speed)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {EVENTS.map((event) => (
                <tr key={event.time} role="row" className={event.go ? 'is-go' : undefined}>
                  <td role="cell" data-label={t(FLIGHT.time)}>{event.time}</td>
                  <td role="cell" data-label={t(FLIGHT.event)}>
                    <b>{keep(t(event.name))}</b>
                    <span>{keep(t(event.note))}</span>
                  </td>
                  <td role="cell" data-label={t(FLIGHT.altitude)}>{event.altitude}</td>
                  <td role="cell" data-label={t(FLIGHT.speed)}>{event.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="kl-section" id="kl-tele" aria-labelledby="kl-tele-title">
          <h2 id="kl-tele-title">{t(TELE.title)}</h2>
          <p className="kl-lede">{t(TELE.lede)}</p>
          <div className="kl-panel kl-tele">
            <div className="kl-head">
              <span>{keep(t(TELE.link))}</span>
              <span className="kl-lamp">{fill(t(TELE.locked), { t: wall(now - 1, zone, true) })}</span>
            </div>
            <dl className="kl-big">
              <div><dt>{t(TELE.mission)}</dt><dd>T+00:00:00</dd></div>
              <div><dt>{t(TELE.altitude)}</dt><dd>0.0<small>km</small></dd></div>
              <div><dt>{t(TELE.speed)}</dt><dd>0<small>m/s</small></dd></div>
              <div><dt>{t(TELE.downrange)}</dt><dd>0.0<small>km</small></dd></div>
            </dl>
            <div className="kl-pad">
              <div className="kl-gauges" role="group" aria-label={t(TELE.tanks)}>
                {GAUGES.map((gauge) => (
                  <figure key={gauge.name.en} className={`kl-gauge${gauge.topping ? ' kl-gauge--topping' : ''}`}>
                    <b>{gauge.value}</b>
                    <i aria-hidden="true" />
                    <figcaption>{t(gauge.name)}</figcaption>
                  </figure>
                ))}
              </div>
              <dl className="kl-readings">
                <div><dt>{t(PAD.stage1)}</dt><dd>3.4 bar</dd></div>
                <div><dt>{t(PAD.stage2)}</dt><dd>2.9 bar</dd></div>
                <div><dt>{t(PAD.battery)}</dt><dd>28.9 V</dd></div>
                <div><dt>{t(PAD.satellites)}</dt><dd>{t(PAD.inView)}</dd></div>
                <div><dt>{t(PAD.power)}</dt><dd>{t(now >= INTERNAL_POWER ? PAD.internal : PAD.ground)}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="kl-section" id="kl-watch" aria-labelledby="kl-watch-title">
          <h2 id="kl-watch-title">{t(WATCH.title)}</h2>
          <p className="kl-lede">{t(WATCH.lede)}</p>
          <table className="kl-watch" role="table" aria-labelledby="kl-watch-title">
            <tbody role="rowgroup">
              {PLACES.map((place) => (
                <tr key={place.name.en} role="row">
                  <th role="rowheader" scope="row">{t(place.name)}</th>
                  <td role="cell">{fill(t(WATCH.from), { t: at(place.from) })}</td>
                  <td role="cell">{lead(timed(place.text, place.times), t(place.lead))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="kl-section kl-alerts" id="kl-alerts" aria-labelledby="kl-alerts-title">
          <div>
            <h2 id="kl-alerts-title">{t(ALERTS.title)}</h2>
            <p className="kl-lede">{timed(ALERTS.note, { a: '12:10' })}</p>
          </div>
          {subscribed !== null ? (
            <div className="kl-done" ref={doneRef} tabIndex={-1}>
              <p className="kl-done__title">{fill(t(ALERTS.doneTitle), { email: subscribed })}</p>
              <p>{timed(ALERTS.doneBody, { a: '12:10' })}</p>
              <button type="button" className="kl-link" onClick={() => setSubscribed(null)}>{t(ALERTS.change)}</button>
            </div>
          ) : (
            <form className={`kl-form${emailError ? ' is-invalid' : ''}`} noValidate onSubmit={subscribe}>
              <label htmlFor="kl-email">{t(ALERTS.label)}</label>
              <div className="kl-form__row">
                <input
                  id="kl-email"
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? 'kl-email-error' : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError(null);
                  }}
                />
                <button className="kl-btn kl-btn--ink" type="submit">{t(ALERTS.submit)}</button>
              </div>
              {emailError ? (
                <p className="kl-error" id="kl-email-error" role="alert">{t(emailError === 'empty' ? ALERTS.empty : ALERTS.invalid)}</p>
              ) : null}
            </form>
          )}
        </section>

        <footer className="kl-foot">
          <p>{t(FOOT.company)}</p>
          <p>{t(zone === 'utc' ? FOOT.utc : FOOT.cet)}</p>
        </footer>

        <p className="kl-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
