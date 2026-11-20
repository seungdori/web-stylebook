import { Fragment, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedSoftPastelPage.css';

// The page of Tilde, a mood journal, in the Soft Pastel style. The app is ink on white;
// pastel colour is only ever mood data: the month of thirty soft squares, the scale of
// five shapes, the counted days of each finding. Petrona sets what the person writes and
// the headlines, Karla everything the app says.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Mood = 1 | 2 | 3 | 4 | 5;

/** Copy with **bold** runs and {tokens}, so a translation can move both. */
function rich(template: string, values: Record<string, ReactNode> = {}): ReactNode[] {
  return template
    .split(/(\*\*.+?\*\*|\{\w+\})/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) return <b key={index}>{rich(part.slice(2, -2), values)}</b>;
      const token = part.match(/^\{(\w+)\}$/);
      if (token && token[1] in values) return <Fragment key={index}>{values[token[1]]}</Fragment>;
      return part;
    });
}

/** The same template filled with plain strings, for labels and announcements. */
const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));

const MOODS: Array<{ id: Mood; name: Tri; csv: string }> = [
  { id: 1, name: { en: 'Heavy', ko: '무거움', ja: '重い' }, csv: 'heavy' },
  { id: 2, name: { en: 'Low', ko: '낮음', ja: '低め' }, csv: 'low' },
  { id: 3, name: { en: 'Steady', ko: '차분함', ja: '穏やか' }, csv: 'steady' },
  { id: 4, name: { en: 'Good', ko: '좋음', ja: '良い' }, csv: 'good' },
  { id: 5, name: { en: 'Bright', ko: '밝음', ja: '明るい' }, csv: 'bright' },
];

const moodName = (id: Mood) => MOODS[id - 1].name;

// November 2026 starts on a Sunday. Days 1 to 29 are written; the 30th is tonight's entry.
const NOVEMBER: Mood[] = [2, 3, 3, 4, 3, 4, 5, 2, 3, 4, 3, 2, 4, 5, 1, 3, 3, 2, 1, 3, 4, 2, 3, 4, 4, 5, 4, 4, 3];
const DAYS = Array.from({ length: 30 }, (_, index) => index + 1);
const TODAY = 30;

const WEEKDAYS: Array<{ letter: Tri; short: Tri; long: Tri }> = [
  { letter: { en: 'S', ko: '일', ja: '日' }, short: { en: 'Sun', ko: '일', ja: '日' }, long: { en: 'Sunday', ko: '일요일', ja: '日曜日' } },
  { letter: { en: 'M', ko: '월', ja: '月' }, short: { en: 'Mon', ko: '월', ja: '月' }, long: { en: 'Monday', ko: '월요일', ja: '月曜日' } },
  { letter: { en: 'T', ko: '화', ja: '火' }, short: { en: 'Tue', ko: '화', ja: '火' }, long: { en: 'Tuesday', ko: '화요일', ja: '火曜日' } },
  { letter: { en: 'W', ko: '수', ja: '水' }, short: { en: 'Wed', ko: '수', ja: '水' }, long: { en: 'Wednesday', ko: '수요일', ja: '水曜日' } },
  { letter: { en: 'T', ko: '목', ja: '木' }, short: { en: 'Thu', ko: '목', ja: '木' }, long: { en: 'Thursday', ko: '목요일', ja: '木曜日' } },
  { letter: { en: 'F', ko: '금', ja: '金' }, short: { en: 'Fri', ko: '금', ja: '金' }, long: { en: 'Friday', ko: '금요일', ja: '金曜日' } },
  { letter: { en: 'S', ko: '토', ja: '土' }, short: { en: 'Sat', ko: '토', ja: '土' }, long: { en: 'Saturday', ko: '토요일', ja: '土曜日' } },
];

const weekdayOf = (day: number) => WEEKDAYS[(day - 1) % 7];

// The one-word notes the month shows in its squares.
const NOTES: Partial<Record<number, Tri>> = {
  7: { en: 'hike', ko: '등산', ja: 'ハイキング' },
  12: { en: 'dentist', ko: '치과', ja: '歯医者' },
  14: { en: 'Ana', ko: 'Ana', ja: 'Ana' },
  19: { en: 'deadline', ko: '마감', ja: '締め切り' },
  21: { en: 'concert', ko: '공연', ja: 'コンサート' },
  26: { en: 'snow', ko: '눈', ja: '雪' },
};

// What the findings count. Sleep is the night before the day it is filed under.
const AFTER_GOOD_SLEEP = [2, 4, 6, 7, 9, 10, 13, 14, 23, 24, 25, 26, 27, 28];
const WALK_DAYS = [1, 3, 4, 6, 7, 10, 12, 13, 14, 18, 24, 25, 26, 27, 28, 30];
const SUNDAYS = [1, 8, 15, 22, 29];

const TOP = {
  nav: { en: 'Tilde', ko: 'Tilde', ja: 'Tilde' },
  entry: { en: "Tonight's entry", ko: '오늘 밤의 기록', ja: '今夜の記録' },
  month: { en: 'Your month', ko: '이번 달', ja: '今月' },
  remind: { en: 'Reminders', ko: '알림', ja: 'リマインダー' },
  privacy: { en: 'Privacy', ko: '개인정보 보호', ja: 'プライバシー' },
  get: { en: 'Get the app', ko: '앱 받기', ja: 'アプリを入手' },
} satisfies Record<string, Tri>;

const HERO = {
  title: { en: 'Give each day a colour.', ko: '하루에 색 하나를 남기세요.', ja: '毎日に、ひとつの色を。' },
  lede: {
    en: "Tilde is a mood journal. Each evening it asks how the day was, and you answer with one of five colours and a line if you like. This is one person's November, with tonight's entry still open.",
    ko: 'Tilde는 기분을 기록하는 일기 앱입니다. 매일 저녁 하루가 어땠는지 묻고, 다섯 가지 색 중 하나와 원한다면 한 줄로 답하면 됩니다. 이 화면은 한 사람의 11월이며, 오늘 밤의 기록은 아직 열려 있습니다.',
    ja: 'Tildeは気分を記録するジャーナルアプリです。毎晩、その日がどうだったかを尋ねるので、五つの色のうち一つと、必要ならひと言で答えてください。これはひとりの11月の記録で、今夜の分はまだ開いています。',
  },
  cta: { en: 'Get Tilde', ko: 'Tilde 받기', ja: 'Tildeを入手' },
  ctaNote: {
    en: 'Free on iPhone and Android. No account needed.',
    ko: 'iPhone과 Android에서 무료입니다. 계정은 필요 없습니다.',
    ja: 'iPhone・Androidで無料。アカウントは不要です。',
  },
} satisfies Record<string, Tri>;

const MONTH = {
  title: { en: 'November 2026', ko: '2026년 11월', ja: '2026年11月' },
  open: { en: "{n} days written, tonight's still open", ko: '{n}일 기록됨, 오늘 밤 기록은 아직입니다', ja: '{n}日分を記録済み。今夜はまだです' },
  done: { en: 'All 30 days written', ko: '30일 모두 기록됨', ja: '30日分すべて記録済み' },
  today: { en: 'today', ko: '오늘', ja: '今日' },
  notes: { en: 'Notes this month', ko: '이번 달 메모', ja: '今月のメモ' },
} satisfies Record<string, Tri>;

const ENTRY = {
  title: { en: "Tonight's entry", ko: '오늘 밤의 기록', ja: '今夜の記録' },
  intro: {
    en: "Each evening, at the time you choose, Tilde asks how the day was. Pick the shape closest to the day, write a line if you want to, and tag who you were with or what you did. Sleep and walking distance come in from your phone's Health app.",
    ko: '매일 저녁, 정한 시간에 Tilde가 하루가 어땠는지 묻습니다. 그날과 가장 가까운 모양을 고르고, 원하면 한 줄을 쓰고, 누구와 있었는지 또는 무엇을 했는지 태그를 붙이세요. 수면과 걸은 거리는 휴대폰의 건강 앱에서 가져옵니다.',
    ja: '毎晩、設定した時間にTildeがその日のことを尋ねます。一日に最も近い形を選び、書きたければひと言添えて、誰と過ごしたか、何をしたかをタグで付けてください。睡眠と歩いた距離は、スマートフォンのヘルスケアから取り込まれます。',
  },
  date: { en: 'Monday 30 November', ko: '11월 30일 월요일', ja: '11月30日(月)' },
  time: { en: '9:42 pm', ko: '오후 9:42', ja: '午後9:42' },
  ask: { en: 'How was today?', ko: '오늘은 어땠나요?', ja: '今日はどうでしたか?' },
  noteLabel: { en: 'Note', ko: '메모', ja: 'メモ' },
  note: {
    en: 'Walked to the market with Ana after work and bought clementines. Slept badly, but the afternoon was easy.',
    ko: '퇴근 후 Ana와 함께 걸어서 시장에 갔다가 귤을 샀습니다. 잠은 잘 못 잤지만 오후는 편했습니다.',
    ja: '仕事のあとAnaと歩いて市場に行き、クレメンタインを買いました。よく眠れませんでしたが、午後は穏やかでした。',
  },
  count: { en: '{n} of {max} characters', ko: '{max}자 중 {n}자', ja: '{max}文字中 {n}文字' },
  health: { en: 'From Health', ko: '건강 앱 데이터', ja: 'ヘルスケアのデータ' },
  sleep: { en: 'Sleep', ko: '수면', ja: '睡眠' },
  sleepValue: { en: '6 h 10 min', ko: '6시간 10분', ja: '6時間10分' },
  walk: { en: 'Walk', ko: '걸음', ja: '歩行' },
  walkValue: { en: '4.2 km', ko: '4.2 km', ja: '4.2 km' },
  kept: { en: 'Kept on this phone only', ko: '이 휴대폰에만 저장됩니다', ja: 'この端末にだけ保存されます' },
  save: { en: 'Save entry', ko: '기록 저장', ja: '記録を保存' },
  saveAgain: { en: 'Save changes', ko: '변경 사항 저장', ja: '変更を保存' },
  saved: { en: 'Entry saved at 9:42 pm.', ko: '오후 9:42에 기록을 저장했습니다.', ja: '午後9:42に記録を保存しました。' },
} satisfies Record<string, Tri>;

const NOTE_MAX = 280;

const TAGS = {
  label: { en: 'Tags', ko: '태그', ja: 'タグ' },
  add: { en: 'Add a tag', ko: '태그 추가', ja: 'タグを追加' },
  field: { en: 'New tag', ko: '새 태그', ja: '新しいタグ' },
  confirm: { en: 'Add', ko: '추가', ja: '追加' },
  cancel: { en: 'Cancel', ko: '취소', ja: 'キャンセル' },
  remove: { en: 'Remove tag {tag}', ko: '{tag} 태그 삭제', ja: '{tag}のタグを削除' },
  empty: { en: 'Write a word for the tag first.', ko: '태그로 쓸 단어를 먼저 입력하세요.', ja: 'タグにする言葉を先に入力してください。' },
  same: { en: 'This entry already has that tag.', ko: '이 기록에는 이미 같은 태그가 있습니다.', ja: 'この記録には同じタグが既にあります。' },
  added: { en: 'Tag {tag} added.', ko: '{tag} 태그를 추가했습니다.', ja: '{tag}のタグを追加しました。' },
  removed: { en: 'Tag {tag} removed.', ko: '{tag} 태그를 삭제했습니다.', ja: '{tag}のタグを削除しました。' },
} satisfies Record<string, Tri>;

const TAG_MAX = 20;

interface Tag {
  key: string;
  /** The two tags the entry starts with are copy; a tag the reader adds is their own word. */
  label: Tri | null;
  text: string;
}

const START_TAGS: Tag[] = [
  { key: 'ana', label: { en: 'Ana', ko: 'Ana', ja: 'Ana' }, text: '' },
  { key: 'walk', label: { en: 'walk', ko: '산책', ja: '散歩' }, text: '' },
];

const NOTICED = {
  title: { en: 'What Tilde noticed in November', ko: '11월에 Tilde가 알아챈 것', ja: 'Tildeが見つけた11月のこと' },
  intro: {
    en: 'On the last evening of the month, after you save, Tilde reads back over the 30 days and writes down what it found. It counts only your entries and what Health recorded.',
    ko: '월의 마지막 날 저녁, 기록을 저장하면 Tilde가 30일을 되짚어 보고 찾은 내용을 적습니다. 기록한 내용과 건강 앱에 남은 값만 셉니다.',
    ja: '月末の夜、記録を保存すると、Tildeが30日分を振り返って、わかったことを書き留めます。数えるのは、あなたの記録とヘルスケアに残った値だけです。',
  },
  sleepCap: { en: '{n} days after 7 hours of sleep', ko: '7시간 이상 잔 뒤의 {n}일', ja: '7時間以上眠った翌日の{n}日' },
  sleepSay: {
    en: 'After the **{n} nights** you slept 7 hours or more, **{good}** of the days that followed were {m4} or {m5}.',
    ko: '7시간 이상 잔 **{n}번의 밤** 뒤에 이어진 날 가운데 **{good}일**이 {m4} 또는 {m5}이었습니다.',
    ja: '7時間以上眠った**{n}回の夜**の翌日のうち、**{good}日**が{m4}か{m5}と感じた日でした。',
  },
  walkCap: { en: '{n} days with a walk', ko: '산책한 {n}일', ja: '散歩した{n}日' },
  walkSay: {
    en: 'On the **{n} days** you went for a walk, **52 km** in all, you had **{good}** of your **{all}** {m4} or {m5} days.',
    ko: '걸은 **{n}일**은 모두 합쳐 **52 km**였습니다. {m4} 또는 {m5}이었던 **{all}일** 가운데 **{good}일**이 걸은 날이었습니다.',
    ja: '歩いた**{n}日**は合わせて**52 km**でした。{m4}か{m5}と感じた**{all}日**のうち、**{good}日**が歩いた日でした。',
  },
  sundayCap: { en: '{n} Sundays', ko: '{n}번의 일요일', ja: '{n}回の日曜日' },
  sundaySay: {
    en: 'Sundays were your lowest days: **{low}** of the **{n}** were {m2} or {m1}.',
    ko: '일요일에 기분이 가장 낮았습니다. {n}번의 일요일 중 **{low}번**이 {m2} 또는 {m1}이었습니다.',
    ja: '日曜日は最も低めの日でした。**{n}回**のうち**{low}回**が{m2}か{m1}と感じた日でした。',
  },
} satisfies Record<string, Tri>;

const REMIND = {
  title: { en: 'Reminders', ko: '알림', ja: 'リマインダー' },
  intro: {
    en: 'One notification each evening at the time you pick, and none on days you have already written.',
    ko: '고른 시간에 매일 저녁 한 번 알림이 오고, 이미 기록한 날에는 오지 않습니다.',
    ja: '選んだ時間に、毎晩1回だけ通知が届きます。すでに記録した日には届きません。',
  },
  on: { en: 'Evening reminder', ko: '저녁 알림', ja: '夜の通知' },
  onNote: { en: 'Once a day, never more', ko: '하루에 한 번만', ja: '1日1回だけ' },
  time: { en: 'Time', ko: '시간', ja: '時刻' },
  days: { en: 'Days', ko: '요일', ja: '曜日' },
  skip: { en: "Skip if I've written today", ko: '오늘 기록했으면 건너뛰기', ja: '今日記録済みならスキップ' },
  skipNote: { en: 'No reminder after an entry is saved', ko: '기록을 저장하면 알림이 오지 않습니다', ja: '記録を保存したら通知は届きません' },
  preview: { en: 'How the reminder looks', ko: '알림 미리보기', ja: '通知のプレビュー' },
  app: { en: 'Tilde', ko: 'Tilde', ja: 'Tilde' },
  message: { en: 'How was today? Tap a shape to answer.', ko: '오늘은 어땠나요? 모양을 눌러 답하세요.', ja: '今日はどうでしたか? 形をタップして答えてください。' },
  tonight: { en: 'Next reminder: tonight at {time}.', ko: '다음 알림: 오늘 밤 {time}.', ja: '次の通知: 今夜{time}。' },
  next: { en: 'Next reminder: {weekday} {day} December at {time}.', ko: '다음 알림: 12월 {day}일 {weekday} {time}.', ja: '次の通知: 12月{day}日、{weekday} {time}。' },
  none: { en: 'No days are chosen, so no reminder will come.', ko: '선택한 요일이 없어서 알림이 오지 않습니다.', ja: '曜日が選ばれていないので、通知は届きません。' },
  off: {
    en: 'Reminders are off. You can still open Tilde and write any evening.',
    ko: '알림이 꺼져 있습니다. 그래도 아무 저녁에나 Tilde를 열어 기록할 수 있습니다.',
    ja: '通知はオフです。それでも、どの夜にもTildeを開いて記録できます。',
  },
} satisfies Record<string, Tri>;

// Monday 30 November, 9:42 pm: the moment the entry is being written.
const NOW_WEEKDAY = 1;
const NOW_MINUTES = 21 * 60 + 42;

const TIMES: Array<{ minutes: number; label: Tri }> = [
  { minutes: 19 * 60, label: { en: '7:00 pm', ko: '오후 7:00', ja: '午後7:00' } },
  { minutes: 19 * 60 + 30, label: { en: '7:30 pm', ko: '오후 7:30', ja: '午後7:30' } },
  { minutes: 20 * 60, label: { en: '8:00 pm', ko: '오후 8:00', ja: '午後8:00' } },
  { minutes: 20 * 60 + 30, label: { en: '8:30 pm', ko: '오후 8:30', ja: '午後8:30' } },
  { minutes: 21 * 60, label: { en: '9:00 pm', ko: '오후 9:00', ja: '午後9:00' } },
  { minutes: 21 * 60 + 30, label: { en: '9:30 pm', ko: '오후 9:30', ja: '午後9:30' } },
  { minutes: 22 * 60, label: { en: '10:00 pm', ko: '오후 10:00', ja: '午後10:00' } },
  { minutes: 22 * 60 + 30, label: { en: '10:30 pm', ko: '오후 10:30', ja: '午後10:30' } },
  { minutes: 23 * 60, label: { en: '11:00 pm', ko: '오후 11:00', ja: '午後11:00' } },
];

const PRIVACY = {
  title: { en: 'Privacy', ko: '개인정보 보호', ja: 'プライバシー' },
  stored: {
    en: 'Your entries are stored on your phone and nowhere else, because Tilde has no account and no server.',
    ko: 'Tilde에는 계정도 서버도 없으므로, 기록은 휴대폰에만 저장되고 다른 곳에는 저장되지 않습니다.',
    ja: 'Tildeにはアカウントもサーバーもないため、記録はこの端末にだけ保存され、ほかには残りません。',
  },
  export: {
    en: 'You can export every entry as a CSV file from Settings at any time.',
    ko: '설정에서 언제든지 모든 기록을 CSV 파일로 내보낼 수 있습니다.',
    ja: '設定からいつでも、すべての記録をCSVファイルとして書き出せます。',
  },
  size: { en: '{n} rows, 4 KB', ko: '{n}행, 4 KB', ja: '{n}行、4 KB' },
  caption: { en: 'The last three rows of the export', ko: '내보내기 파일의 마지막 세 행', ja: '書き出したファイルの最後の3行' },
  noNote: { en: 'no note', ko: '메모 없음', ja: 'メモなし' },
} satisfies Record<string, Tri>;

const CSV_FILE = 'tilde-2026-11.csv';
const CSV_COLUMNS = ['date', 'mood', 'sleep', 'note'] as const;
const CSV_ROWS: Array<{ day: number; sleep: string }> = [
  { day: 27, sleep: '7.6' },
  { day: 28, sleep: '7.4' },
  { day: 29, sleep: '6.8' },
];
const TODAY_SLEEP = '6.2';

const GET = {
  line: {
    en: 'Tilde is free on iPhone and Android, with no account and no ads. Search for Tilde in the App Store or on Google Play.',
    ko: 'Tilde는 iPhone과 Android에서 무료이며, 계정도 광고도 없습니다. App Store 또는 Google Play에서 Tilde를 검색하세요.',
    ja: 'Tildeは iPhone と Android で無料で、アカウントも広告もありません。App Store または Google Play で「Tilde」を検索してください。',
  },
  iphone: { en: 'iPhone', ko: 'iPhone', ja: 'iPhone' },
  iphoneNeeds: { en: 'iOS 17 or later', ko: 'iOS 17 이상', ja: 'iOS 17以降' },
  android: { en: 'Android', ko: 'Android', ja: 'Android' },
  androidNeeds: { en: 'Android 10 or later', ko: 'Android 10 이상', ja: 'Android 10以降' },
  nav: { en: 'On this page', ko: '이 페이지 목차', ja: 'このページの項目' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Soft Pastel style — ink on white, with pastel colour used only as data.

Pick a believable product where soft colour carries meaning, such as a mood journal, a cycle tracker, a habit diary or a baby's sleep log, and write its real content. The page must read as that product's page, never as a page about its own style.

COLOR TOKENS:
--bg: #fbfafa
--surface: #ffffff
--ink: #3d3229
--muted: #6b5f56
--line: rgba(61,50,41,0.28)
--edge: rgba(61,50,41,0.6) (the edge of a control: tags, weekday keys, the time select)
--off: #8a7f76 (a switch that is off)
Mood colours, used only for data:
--heavy: #b09be8
--low: #e4ddf8 (always with a 1.5px #9484c9 edge, so it holds on white)
--steady: #8fd4b0
--good: #ffd671
--bright: #ff9a76
No other colours: the button darkens to #2a221b on hover, hover fills are ink at 5% and 8%, every mood but Low takes a 1px edge of ink at 12%, and the shapes and the notification cast soft ink shadows. Buttons, switches, rings and selected states are ink.

PASTEL AS DATA:
- The month is thirty soft squares, 16px corners, each filled with that day's mood colour and a faint white light in its top left corner.
- The scale is five shapes that grow taller and rounder as the day gets better: a flat mound, a low pebble, a rounded square, a circle, an upright egg.
- The same colours fill the counted days of small months and underline words in sentences. Never a pastel background, panel or button.

TYPOGRAPHY:
Two voices. Petrona for the headlines and every word the person writes; Karla for everything the app says.
Display: Petrona 500, clamp(3.1rem, 8vw, 6.5rem) when centred (clamp(2.6rem, 13vw, 3.6rem) on phones), min(4.75rem, 5.6vw) beside the month so it keeps to two lines, line-height 0.98, tracking -0.035em
Headings: Petrona 500, clamp(2.3rem, 4.5vw, 3.5rem), line-height 1.02, tracking -0.03em
What the person writes (the note, the words in the month, the CSV note): Petrona italic 400 to 500, 1.3125rem in the note field (1.1875rem on phones)
Findings: Petrona 400, clamp(1.55rem, 2.8vw, 2.25rem), line-height 1.22, figures in 700
Interface: Karla 400 at 1.0625rem with line-height 1.6; the names on the scale and the weekdays 500; labels 600; buttons, dates and day numbers 700
No rounded display sans, no third family.

LAYOUT:
- A plain app header: the name in Petrona italic, four section links, "Get the app" underlined.
- Hero: headline, one short paragraph and one action on the left, the month on the right; below 1200px they stack and centre. The five cells left after the 30th hold the key of five shapes.
- Tonight's entry: the screen as the app shows it. Date and time, the question, the five-shape scale, a note field, and a side column with tags and the day's sleep and walk from the phone's Health app; Save at the foot.
- What it noticed: three sentences, each beside a small month in which only the counted days keep their colour.
- Reminders and privacy share the last band: a settings list, a preview of the notification, two sentences about storage and the end of the CSV export as a real table.
- Max width about 1120px, section gap 136px (96px on phones).

COMPONENTS:
- Rounded corners are the material: 30px on the entry and the settings list (24px on phones), 22px on the notification, 18px on the note field and the scale's options (14px on phones), 16px on the day squares (13px below 760px, 9px on phones), the button and the saved note, 14px on the time select, 12px on the notification's icon, 11px on tags (a tag's remove button fills its rounded right end), the tag field, weekday keys (10px on phones) and switches, 7px on a switch's knob, 5px on the days of the small months, 4px on the mood dot in the export. Never a pill.
- One solid ink button, 54px high, Karla 700.
- Mood scale: a radio group of the five shapes. The chosen one rises 4px and takes a 2.5px ink ring, and today's square in the month takes its colour.
- Note field: 2px ink border, Petrona italic, a character count beside its label.
- Tags written with a tilde: 1.5px edge, a remove button in each, "Add a tag" opens a one-line field.
- Switches: an ink track when on, an outlined track when off. Weekday keys: ink when on, outlined when off.
- Lines: 1.5px at 28% ink; the rules over the findings and over the export are 1.5px ink.

MOTION:
- The chosen shape rises 4px over 0.2s and a switch's knob slides over 0.2s. Nothing else moves.
- prefers-reduced-motion removes both transitions.

FORBIDDEN:
- Pastel page backgrounds, pastel buttons, pastel panels, blurred colour blobs
- A grid of rounded cards, pills, chips with coloured dots
- A small label above a heading, all-caps tracked labels
- White text on peach or on any pastel
- A rounded display sans such as Nunito or Quicksand
- Emoji, mascots, illustrations

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll; the month keeps seven columns and moves its notes into a list on phones
4) Working controls: a radio group, switches with role="switch", toggle keys with aria-pressed, a labelled note field, visible focus, reduced motion`;

const PROMPT_KO = `Soft Pastel 스타일로 실제 페이지 하나를 디자인하세요. 흰 바탕에 잉크색 글씨를 쓰고, 파스텔 색은 데이터로만 씁니다.

그럴듯한 제품을 고르세요. 부드러운 색이 의미를 전하는 제품이면 됩니다. 예를 들어 기분 일기, 주기 추적기, 습관 일기, 아기 수면 기록 같은 것입니다. 실제 내용을 채워 넣으세요. 페이지는 그 제품의 페이지로 읽혀야 하며, 스타일에 관한 페이지로 읽히면 안 됩니다.

COLOR TOKENS:
--bg: #fbfafa
--surface: #ffffff
--ink: #3d3229
--muted: #6b5f56
--line: rgba(61,50,41,0.28)
--edge: rgba(61,50,41,0.6) (컨트롤의 테두리: 태그, 요일 키, 시간 선택 상자)
--off: #8a7f76 (꺼진 스위치)
데이터로만 쓰는 기분 색:
--heavy: #b09be8
--low: #e4ddf8 (흰 바탕에서도 보이도록 항상 1.5px #9484c9 테두리와 함께 씁니다)
--steady: #8fd4b0
--good: #ffd671
--bright: #ff9a76
다른 색은 쓰지 않습니다. 버튼은 호버 시 #2a221b로 어두워지고, 호버 배경은 잉크색 5%와 8%입니다. Low를 뺀 모든 기분 색은 잉크색 12%의 1px 테두리를 가지며, 모양과 알림은 부드러운 잉크색 그림자를 드리웁니다. 버튼, 스위치, 링, 선택 상태는 모두 잉크색입니다.

PASTEL AS DATA:
- 월은 30개의 부드러운 정사각형입니다. 모서리 반경은 16px이며, 각 칸은 그날의 기분 색으로 채우고 왼쪽 위 모서리에 옅은 흰빛을 둡니다.
- 척도는 다섯 가지 모양입니다. 하루가 좋을수록 더 높고 둥글어집니다. 납작한 언덕, 낮은 조약돌, 둥근 사각형, 원, 똑바로 선 달걀.
- 같은 색을 작은 월간 달력의 집계된 날과 문장 속 단어의 밑줄에 씁니다. 파스텔 배경, 패널, 버튼은 쓰지 않습니다.

TYPOGRAPHY:
두 가지 목소리를 씁니다. 제목과 사용자가 쓰는 모든 글은 Petrona, 앱이 말하는 모든 글은 Karla를 씁니다.
Display: Petrona 500, 가운데 정렬일 때 clamp(3.1rem, 8vw, 6.5rem)(휴대폰에서는 clamp(2.6rem, 13vw, 3.6rem)), 월 옆에서는 두 줄을 유지하도록 min(4.75rem, 5.6vw), line-height 0.98, 자간 -0.035em
Headings: Petrona 500, clamp(2.3rem, 4.5vw, 3.5rem), line-height 1.02, 자간 -0.03em
사용자가 쓰는 글(메모, 월 안의 단어, CSV 메모): Petrona 이탤릭 400~500, 메모 입력란에서는 1.3125rem(휴대폰에서는 1.1875rem)
발견 내용: Petrona 400, clamp(1.55rem, 2.8vw, 2.25rem), line-height 1.22, 숫자는 700
인터페이스: Karla 400, 1.0625rem, line-height 1.6; 척도의 이름과 요일은 500; 라벨 600; 버튼, 날짜, 날짜 숫자 700
둥근 디스플레이 산세리프와 세 번째 서체는 쓰지 않습니다.

LAYOUT:
- 평범한 앱 헤더: 이름은 Petrona 이탤릭, 섹션 링크 네 개, '앱 받기'에 밑줄.
- 히어로: 제목, 짧은 문단 하나, 행동 버튼 하나를 왼쪽에, 월은 오른쪽에 둡니다. 1200px 아래에서는 세로로 쌓고 가운데 정렬합니다. 30일 뒤 남은 다섯 칸에는 다섯 모양의 범례를 넣습니다.
- 오늘 밤의 기록: 앱 화면을 그대로 옮깁니다. 날짜와 시간, 질문, 다섯 모양의 척도, 메모 입력란, 그리고 태그와 건강 앱에서 가져온 수면·걸음 거리를 담은 옆 열. 저장 버튼은 하단에 둡니다.
- 발견한 내용: 문장 세 개, 각각 옆에 작은 월간 달력을 둡니다. 집계된 날만 색을 유지합니다.
- 알림과 개인정보는 마지막 구역을 함께 씁니다. 설정 목록, 알림 미리보기, 저장소에 관한 문장 두 개, 그리고 CSV 내보내기를 실제 표로 보여줍니다.
- 최대 너비는 약 1120px, 섹션 간격은 136px(휴대폰에서는 96px).

COMPONENTS:
- 둥근 모서리가 이 디자인의 재료입니다. 오늘 밤의 기록과 설정 목록은 30px(휴대폰에서는 24px), 알림은 22px, 메모 입력란과 척도 항목은 18px(휴대폰에서는 14px), 날짜 칸은 16px(760px 아래에서는 13px, 휴대폰에서는 9px), 버튼과 저장된 메모는 16px, 시간 선택 상자는 14px, 알림 아이콘은 12px, 태그는 11px(태그의 삭제 버튼은 둥근 오른쪽 끝을 채웁니다), 태그 입력란, 요일 키(휴대폰에서는 10px)와 스위치는 11px, 스위치의 노브는 7px, 작은 월간 달력의 날은 5px, 내보내기의 기분 점은 4px입니다. 알약 모양은 쓰지 않습니다.
- 잉크색 버튼 하나, 높이 54px, Karla 700.
- 기분 척도: 다섯 모양의 라디오 그룹. 선택된 모양은 4px 올라가고 2.5px 잉크 링을 얻으며, 월의 오늘 칸은 그 색을 가집니다.
- 메모 입력란: 2px 잉크 테두리, Petrona 이탤릭, 라벨 옆에 글자 수.
- 물결표(~)로 쓴 태그: 1.5px 테두리, 각각에 삭제 버튼. '태그 추가'를 누르면 한 줄 입력란이 열립니다.
- 스위치: 켜지면 잉크색 트랙, 꺼지면 테두리만 있는 트랙. 요일 키: 켜지면 잉크색, 꺼지면 테두리만 있습니다.
- 선: 잉크색 28%, 1.5px. 발견 내용 위와 내보내기 위의 구분선은 잉크색 1.5px입니다.

MOTION:
- 선택된 모양은 0.2초 동안 4px 올라가고, 스위치의 노브는 0.2초 동안 미끄러집니다. 다른 것은 움직이지 않습니다.
- prefers-reduced-motion에서는 두 전환을 모두 없앱니다.

FORBIDDEN:
- 파스텔 페이지 배경, 파스텔 버튼, 파스텔 패널, 흐린 색 얼룩
- 둥근 카드 격자, 알약 모양, 색 점이 붙은 칩
- 제목 위의 작은 라벨, 모두 대문자이고 자간을 넓힌 라벨
- 복숭아색이나 어떤 파스텔 색 위의 흰 글씨
- Nunito나 Quicksand 같은 둥근 디스플레이 산세리프
- 이모지, 마스코트, 일러스트

OUTPUT:
1) CSS 커스텀 속성
2) 시맨틱 HTML과 CSS
3) 320px까지 가로 스크롤 없이 반응형으로. 월은 일곱 열을 유지하고, 휴대폰에서는 메모를 목록으로 옮깁니다.
4) 작동하는 컨트롤: 라디오 그룹, role="switch"를 가진 스위치, aria-pressed를 가진 요일 키, 라벨이 있는 메모 입력란, 보이는 포커스, 모션 감소.`;

const PROMPT_JA = `Soft Pastel スタイルで、実在するページを一つデザインする。白地にインク色の文字を置き、パステル色はデータとしてのみ使う。

もっともらしいプロダクトを選び、柔らかい色が意味を担うものにする。例：気分ジャーナル、周期トラッカー、習慣の日記、赤ちゃんの睡眠記録。実際の内容を書く。ページはそのプロダクトのページとして読めること。スタイルについてのページとして読めてはならない。

COLOR TOKENS:
--bg: #fbfafa
--surface: #ffffff
--ink: #3d3229
--muted: #6b5f56
--line: rgba(61,50,41,0.28)
--edge: rgba(61,50,41,0.6) （コントロールの縁：タグ、曜日キー、時刻の選択）
--off: #8a7f76 （オフのスイッチ）
データとしてのみ使う気分の色:
--heavy: #b09be8
--low: #e4ddf8 （白地でも見えるよう、必ず 1.5px #9484c9 の縁を付ける）
--steady: #8fd4b0
--good: #ffd671
--bright: #ff9a76
ほかの色は使わない。ボタンはホバー時に #2a221b へ濃くなり、ホバーの塗りはインク色の5%と8%。Low以外の気分の色はインク色12%の1pxの縁を持ち、形と通知は柔らかいインク色の影を落とす。ボタン、スイッチ、リング、選択状態はすべてインク色。

PASTEL AS DATA:
- 月は30個の柔らかい正方形。角の丸みは16px。各マスはその日の気分の色で塗り、左上にごく淡い白い光を入れる。
- 尺度は五つの形。一日が良いほど背が高く丸くなる。平たい盛り土、低い小石、丸い四角、円、直立した卵。
- 同じ色を、小さな月の集計された日や文中の語の下線に使う。パステルを背景、パネル、ボタンには使わない。

TYPOGRAPHY:
二つの声を使う。見出しと利用者が書く文字はPetrona、アプリが表示する文字はKarla。
Display: Petrona 500。中央揃えのとき clamp(3.1rem, 8vw, 6.5rem)（スマートフォンでは clamp(2.6rem, 13vw, 3.6rem)）、月の横では二行に収まるよう min(4.75rem, 5.6vw)、line-height 0.98、letter-spacing -0.035em
Headings: Petrona 500、clamp(2.3rem, 4.5vw, 3.5rem)、line-height 1.02、letter-spacing -0.03em
利用者が書く文字（メモ、月の中の語、CSVのメモ）: Petrona イタリック 400〜500。メモ欄では 1.3125rem（スマートフォンでは 1.1875rem）
所見: Petrona 400、clamp(1.55rem, 2.8vw, 2.25rem)、line-height 1.22、数字は 700
UI: Karla 400、1.0625rem、line-height 1.6。尺度の名前と曜日は 500、ラベルは 600、ボタン・日付・日の数字は 700。
丸みのあるディスプレイ用サンセリフと第三の書体は使わない。

LAYOUT:
- 素のアプリヘッダー：名前は Petrona イタリック、セクションリンク4つ、「アプリを入手」に下線。
- ヒーロー：見出し、短い段落、行動ボタン1つを左に、月を右に置く。1200px未満では縦に積み、中央揃えにする。30日の後に残る五マスには、五つの形の凡例を入れる。
- 今夜の記録：アプリの画面どおりに再現する。日付と時刻、質問、五つの形の尺度、メモ欄、そしてタグと、スマートフォンのヘルスケアから取り込んだ睡眠・歩行距離を載せる側の列。保存ボタンは末尾。
- 気づいたこと：文三つ。それぞれの横に小さな月を置き、集計された日だけ色を残す。
- リマインダーとプライバシーは最後の帯を共有する。設定リスト、通知のプレビュー、保存に関する文二つ、CSVの書き出しを実際の表で示す。
- 最大幅は約1120px、セクション間隔は136px（スマートフォンでは96px）。

COMPONENTS:
- 角の丸みが素材である。今夜の記録と設定リストは30px（スマートフォンでは24px）、通知は22px、メモ欄と尺度の選択肢は18px（スマートフォンでは14px）、日付マスは16px（760px未満では13px、スマートフォンでは9px）、ボタンと保存されたメモは16px、時刻の選択欄は14px、通知のアイコンは12px、タグは11px（タグの削除ボタンは丸い右端を埋める）、タグ入力欄、曜日キー（スマートフォンでは10px）とスイッチは11px、スイッチのノブは7px、小さな月の日は5px、書き出しの気分の点は4px。カプセル形は使わない。
- インク色のボタンは一つ。高さ54px、Karla 700。
- 気分の尺度：五つの形のラジオグループ。選ばれた形は4px上がり、2.5pxのインクのリングが付く。月の今日のマスはその色になる。
- メモ欄：2pxのインクの枠線、Petrona イタリック、ラベルの横に文字数。
- チルダ（~）付きのタグ：1.5pxの縁、それぞれに削除ボタン。「タグを追加」で一行の入力欄が開く。
- スイッチ：オンのときはインクのトラック、オフのときは枠線だけのトラック。曜日キー：オンはインク、オフは枠線だけ。
- 線：インク28%、1.5px。所見の上と書き出しの上の罫線は1.5pxのインク色。

MOTION:
- 選ばれた形が0.2秒かけて4px上がり、スイッチのノブは0.2秒かけて滑る。ほかは動かさない。
- prefers-reduced-motion では両方の遷移をなくす。

FORBIDDEN:
- パステルのページ背景、パステルのボタン、パステルのパネル、ぼやけた色の塊
- 丸いカードのグリッド、カプセル形、色の点付きのチップ
- 見出しの上の小さなラベル、全て大文字で字間を広げたラベル
- パステル（桃色を含む）の上の白い文字
- NunitoやQuicksandのような丸みのあるディスプレイ用サンセリフ
- 絵文字、マスコット、イラスト

OUTPUT:
1) CSSカスタムプロパティ
2) セマンティックなHTMLとCSS
3) 320pxまでスクロールなしで対応する。月は7列を保ち、スマートフォンではメモをリストに移す。
4) 動作するコントロール：ラジオグループ、role="switch" のスイッチ、aria-pressed を持つ切り替えキー、ラベル付きのメモ欄、見えるフォーカス、モーション軽減。`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

interface Saved {
  mood: Mood;
  note: string | null;
  tags: string;
}

function MoodShape({ mood }: { mood: Mood }) {
  return (
    <span className="tl-sh-box" aria-hidden="true">
      <i className={`tl-sh tl-m${mood}`} />
    </span>
  );
}

function MiniMonth({ counted, moodOf }: { counted: number[]; moodOf: (day: number) => Mood }) {
  return (
    <div className="tl-mini" aria-hidden="true">
      {DAYS.map((day) => (
        <i key={day} className={counted.includes(day) ? `tl-m${moodOf(day)}` : undefined} />
      ))}
    </div>
  );
}

export function PortedSoftPastelPage({ lang }: PortedStylePageProps) {
  const t = (text: Tri) => text[lang];

  const [mood, setMood] = useState<Mood>(4);
  // null while the note is the one the page opens with, so it follows the language.
  const [note, setNote] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>(START_TAGS);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [tagError, setTagError] = useState<'empty' | 'same' | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [saved, setSaved] = useState<Saved | null>(null);

  const [remindOn, setRemindOn] = useState(true);
  const [time, setTime] = useState(21 * 60 + 30);
  const [days, setDays] = useState<boolean[]>([true, true, true, true, true, true, false]);
  const [skipWritten, setSkipWritten] = useState(true);

  const tagCount = useRef(0);
  // The id of the element that takes focus after the next render: the control that
  // replaces one that leaves, or the confirmation that replaces the Save button.
  const focusNext = useRef<string | null>(null);

  useEffect(() => {
    if (focusNext.current === null) return;
    document.getElementById(focusNext.current)?.focus();
    focusNext.current = null;
  });

  const moodOf = (day: number): Mood => (day === TODAY ? mood : NOVEMBER[day - 1]);
  const tagText = (tag: Tag) => (tag.label ? t(tag.label) : tag.text);
  const noteText = note ?? t(ENTRY.note);
  const tagKeys = tags.map((tag) => tag.key).join('|');
  const dirty = saved === null || saved.mood !== mood || saved.note !== note || saved.tags !== tagKeys;

  const markFor = (id: Mood) => <mark className={`tl-mark tl-m${id}`}>{t(moodName(id))}</mark>;
  const marks = { m1: markFor(1), m2: markFor(2), m4: markFor(4), m5: markFor(5) };
  const isGood = (day: number) => moodOf(day) >= 4;
  const sleepGood = AFTER_GOOD_SLEEP.filter(isGood).length;
  const walkGood = WALK_DAYS.filter(isGood).length;
  const allGood = DAYS.filter(isGood).length;
  const sundaysLow = SUNDAYS.filter((day) => moodOf(day) <= 2).length;

  const timeLabel = t(TIMES.find((option) => option.minutes === time)?.label ?? TIMES[5].label);
  const nextReminder = (): string => {
    if (!remindOn) return t(REMIND.off);
    for (let offset = 0; offset <= 7; offset += 1) {
      const weekday = (NOW_WEEKDAY + offset) % 7;
      if (!days[weekday]) continue;
      if (offset === 0) {
        if (time <= NOW_MINUTES || (skipWritten && saved !== null)) continue;
        return fill(t(REMIND.tonight), { time: timeLabel });
      }
      return fill(t(REMIND.next), { weekday: t(WEEKDAYS[weekday].long), day: offset, time: timeLabel });
    }
    return t(REMIND.none);
  };

  const openTagField = () => {
    setAdding(true);
    setDraft('');
    setTagError(null);
    focusNext.current = 'tl-tag-new';
  };

  const closeTagField = () => {
    setAdding(false);
    setDraft('');
    setTagError(null);
    focusNext.current = 'tl-tag-add';
  };

  const addTag = () => {
    const word = draft.trim().replace(/^~+/, '').replace(/\s+/g, ' ').trim();
    if (!word) {
      setTagError('empty');
      return;
    }
    if (tags.some((tag) => tagText(tag).toLowerCase() === word.toLowerCase())) {
      setTagError('same');
      return;
    }
    tagCount.current += 1;
    setTags([...tags, { key: `own-${tagCount.current}`, label: null, text: word }]);
    setAnnouncement(fill(t(TAGS.added), { tag: `~${word}` }));
    closeTagField();
  };

  const removeTag = (index: number) => {
    const removed = tags[index];
    const rest = tags.filter((_, position) => position !== index);
    setTags(rest);
    setAnnouncement(fill(t(TAGS.removed), { tag: `~${tagText(removed)}` }));
    const neighbour = rest[index] ?? rest[index - 1];
    focusNext.current = neighbour ? `tl-tag-${neighbour.key}` : adding ? 'tl-tag-new' : 'tl-tag-add';
  };

  const handleTagKey = (event: KeyboardEvent<HTMLInputElement>) => {
    // The field sits inside the entry form: Enter adds the tag instead of saving the entry.
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeTagField();
    }
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved({ mood, note, tags: tagKeys });
    setAdding(false);
    setDraft('');
    setTagError(null);
    focusNext.current = 'tl-saved';
  };

  const toggleDay = (index: number) => setDays(days.map((on, position) => (position === index ? !on : on)));

  const savedNote = saved ? saved.note ?? t(ENTRY.note) : '';
  const csvRows = saved
    ? [...CSV_ROWS.slice(1).map((row) => ({ ...row, mood: NOVEMBER[row.day - 1], note: '' })), { day: TODAY, sleep: TODAY_SLEEP, mood: saved.mood, note: savedNote.trim() }]
    : CSV_ROWS.map((row) => ({ ...row, mood: NOVEMBER[row.day - 1], note: '' }));

  return (
    <FusionShell
      fusionId="soft-pastel"
      lang={lang}
      tone="light"
      accent="#3d3229"
      prev={{ href: '/pages/neumorphism.html', label: 'Neumorphism' }}
      next={{ href: '/pages/notion-style.html', label: 'Notion Style' }}
      prompts={PROMPTS}
    >
      <div className="tl">
        <header className="tl-top">
          <a className="tl-logo" href="#tl-title">tilde</a>
          <nav className="tl-top__nav" aria-label={t(TOP.nav)}>
            <a href="#tl-entry">{t(TOP.entry)}</a>
            <a href="#tl-month">{t(TOP.month)}</a>
            <a href="#tl-remind">{t(TOP.remind)}</a>
            <a href="#tl-privacy">{t(TOP.privacy)}</a>
          </nav>
          <a className="tl-top__get" href="#tl-get">{t(TOP.get)}</a>
        </header>

        <section className="tl-hero" aria-labelledby="tl-title">
          <div className="tl-hero__copy">
            <h1 id="tl-title" className="tl-title">{t(HERO.title)}</h1>
            <p className="tl-lede">{t(HERO.lede)}</p>
            <div className="tl-act">
              <a className="tl-btn" href="#tl-get">{t(HERO.cta)}</a>
              <p>{t(HERO.ctaNote)}</p>
            </div>
          </div>

          <div className="tl-cal" id="tl-month">
            <div className="tl-cal__head">
              <h2 id="tl-month-title">{t(MONTH.title)}</h2>
              <p aria-live="polite">{saved ? t(MONTH.done) : fill(t(MONTH.open), { n: TODAY - 1 })}</p>
            </div>
            <ol className="tl-wk" aria-hidden="true">
              {WEEKDAYS.map((weekday) => (
                <li key={weekday.long.en}>
                  <span className="tl-wk__short">{t(weekday.short)}</span>
                  <span className="tl-wk__letter">{t(weekday.letter)}</span>
                </li>
              ))}
            </ol>
            <ol className="tl-days" aria-labelledby="tl-month-title">
              {DAYS.map((day) => {
                const dayMood = moodOf(day);
                const word = day === TODAY ? t(MONTH.today) : NOTES[day] ? t(NOTES[day]) : null;
                const classes = ['tl-day', `tl-m${dayMood}`];
                if (day === TODAY) classes.push('is-today');
                if (NOTES[day]) classes.push('has-note');
                return (
                  <li key={day} className={classes.join(' ')} aria-current={day === TODAY ? 'date' : undefined}>
                    <b>{day}</b>
                    <span className="tl-vh">{`${t(weekdayOf(day).long)}, ${t(moodName(dayMood))}`}</span>
                    {word ? <span className="tl-day__note">{word}</span> : null}
                  </li>
                );
              })}
              <li className="tl-key" aria-hidden="true">
                <ul>
                  {MOODS.map((item) => (
                    <li key={item.id} className={item.id === mood ? 'tl-key__item is-chosen' : 'tl-key__item'}>
                      <MoodShape mood={item.id} />
                      <span>{t(item.name)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </ol>
            <dl className="tl-notes" aria-label={t(MONTH.notes)}>
              {DAYS.filter((day) => NOTES[day]).map((day) => (
                <div key={day}>
                  <dt>{`${t(weekdayOf(day).short)} ${day}`}</dt>
                  <dd>{t(NOTES[day] as Tri)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="tl-section" id="tl-entry" aria-labelledby="tl-entry-title">
          <div className="tl-intro">
            <h2 id="tl-entry-title">{t(ENTRY.title)}</h2>
            <p>{t(ENTRY.intro)}</p>
          </div>

          <form className="tl-entry" onSubmit={handleSave} noValidate aria-labelledby="tl-entry-title">
            <p className="tl-entry__date">
              <b>{t(ENTRY.date)}</b>
              <span>{t(ENTRY.time)}</span>
            </p>
            <h3 id="tl-ask" className="tl-entry__ask">{t(ENTRY.ask)}</h3>
            <div className="tl-scale" role="radiogroup" aria-labelledby="tl-ask">
              {MOODS.map((item) => (
                <label key={item.id} className={item.id === mood ? 'tl-scale__opt is-chosen' : 'tl-scale__opt'}>
                  <input className="tl-vh" type="radio" name="tl-mood" value={item.id} checked={item.id === mood} onChange={() => setMood(item.id)} />
                  <MoodShape mood={item.id} />
                  <span className="tl-scale__name">{t(item.name)}</span>
                </label>
              ))}
            </div>

            <div className="tl-entry__note">
              <div className="tl-field-head">
                <label htmlFor="tl-note">{t(ENTRY.noteLabel)}</label>
                <span id="tl-note-count" className="tl-count">
                  <span aria-hidden="true">{`${noteText.length} / ${NOTE_MAX}`}</span>
                  <span className="tl-vh">{fill(t(ENTRY.count), { n: noteText.length, max: NOTE_MAX })}</span>
                </span>
              </div>
              <textarea
                id="tl-note"
                className="tl-note"
                rows={4}
                maxLength={NOTE_MAX}
                value={noteText}
                aria-describedby="tl-note-count"
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            <div className="tl-entry__side">
              <div>
                <p id="tl-tags-title" className="tl-side-label">{t(TAGS.label)}</p>
                <ul className="tl-tags" aria-labelledby="tl-tags-title">
                  {tags.map((tag, index) => (
                    <li key={tag.key} className="tl-tag">
                      <span>{`~${tagText(tag)}`}</span>
                      <button
                        type="button"
                        id={`tl-tag-${tag.key}`}
                        className="tl-tag__remove"
                        aria-label={fill(t(TAGS.remove), { tag: `~${tagText(tag)}` })}
                        onClick={() => removeTag(index)}
                      >
                        <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                          <path d="M4 4l8 8M12 4l-8 8" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                {adding ? (
                  <div className="tl-tag-field">
                    <label htmlFor="tl-tag-new">{t(TAGS.field)}</label>
                    <div className="tl-tag-field__row">
                      <span className={tagError ? 'tl-tag-input is-invalid' : 'tl-tag-input'}>
                        <span aria-hidden="true">~</span>
                        <input
                          id="tl-tag-new"
                          type="text"
                          autoComplete="off"
                          maxLength={TAG_MAX}
                          value={draft}
                          aria-invalid={tagError !== null}
                          aria-describedby={tagError ? 'tl-tag-error' : undefined}
                          onChange={(event) => {
                            setDraft(event.target.value);
                            if (tagError) setTagError(null);
                          }}
                          onKeyDown={handleTagKey}
                        />
                      </span>
                      <button type="button" className="tl-textbtn" onClick={addTag}>{t(TAGS.confirm)}</button>
                      <button type="button" className="tl-textbtn tl-textbtn--quiet" onClick={closeTagField}>{t(TAGS.cancel)}</button>
                    </div>
                    {tagError ? <p id="tl-tag-error" className="tl-error" role="alert">{t(tagError === 'empty' ? TAGS.empty : TAGS.same)}</p> : null}
                  </div>
                ) : (
                  <button type="button" id="tl-tag-add" className="tl-textbtn" onClick={openTagField}>{t(TAGS.add)}</button>
                )}
                <p className="tl-vh" aria-live="polite">{announcement}</p>
              </div>
              <div>
                <p id="tl-health-title" className="tl-side-label">{t(ENTRY.health)}</p>
                <dl className="tl-health" aria-labelledby="tl-health-title">
                  <div><dt>{t(ENTRY.sleep)}</dt><dd>{t(ENTRY.sleepValue)}</dd></div>
                  <div><dt>{t(ENTRY.walk)}</dt><dd>{t(ENTRY.walkValue)}</dd></div>
                </dl>
              </div>
            </div>

            <div className="tl-entry__foot">
              <p>{t(ENTRY.kept)}</p>
              {dirty ? (
                <button type="submit" className="tl-btn">{t(saved ? ENTRY.saveAgain : ENTRY.save)}</button>
              ) : (
                <p id="tl-saved" className="tl-saved" tabIndex={-1}>
                  <svg viewBox="0 0 20 20" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10.5l4 4 8-9" />
                  </svg>
                  {t(ENTRY.saved)}
                </p>
              )}
            </div>
          </form>
        </section>

        <section className="tl-section" id="tl-noticed" aria-labelledby="tl-noticed-title">
          <div className="tl-intro">
            <h2 id="tl-noticed-title">{t(NOTICED.title)}</h2>
            <p>{t(NOTICED.intro)}</p>
          </div>
          <ol className="tl-found">
            <li>
              <div className="tl-mini-wrap">
                <MiniMonth counted={AFTER_GOOD_SLEEP} moodOf={moodOf} />
                <p className="tl-mini-cap">{fill(t(NOTICED.sleepCap), { n: AFTER_GOOD_SLEEP.length })}</p>
              </div>
              <p className="tl-say">{rich(t(NOTICED.sleepSay), { n: AFTER_GOOD_SLEEP.length, good: sleepGood, ...marks })}</p>
            </li>
            <li>
              <div className="tl-mini-wrap">
                <MiniMonth counted={WALK_DAYS} moodOf={moodOf} />
                <p className="tl-mini-cap">{fill(t(NOTICED.walkCap), { n: WALK_DAYS.length })}</p>
              </div>
              <p className="tl-say">{rich(t(NOTICED.walkSay), { n: WALK_DAYS.length, good: walkGood, all: allGood, ...marks })}</p>
            </li>
            <li>
              <div className="tl-mini-wrap">
                <MiniMonth counted={SUNDAYS} moodOf={moodOf} />
                <p className="tl-mini-cap">{fill(t(NOTICED.sundayCap), { n: SUNDAYS.length })}</p>
              </div>
              <p className="tl-say">{rich(t(NOTICED.sundaySay), { n: SUNDAYS.length, low: sundaysLow, ...marks })}</p>
            </li>
          </ol>
        </section>

        <div className="tl-section tl-last">
          <section id="tl-remind" aria-labelledby="tl-remind-title">
            <div className="tl-intro">
              <h2 id="tl-remind-title">{t(REMIND.title)}</h2>
              <p>{t(REMIND.intro)}</p>
            </div>
            <div className="tl-remind">
              <div className="tl-row">
                <p>
                  <span id="tl-r-on">{t(REMIND.on)}</span>
                  <small id="tl-r-on-note">{t(REMIND.onNote)}</small>
                </p>
                <button
                  type="button"
                  role="switch"
                  className="tl-switch"
                  aria-checked={remindOn}
                  aria-labelledby="tl-r-on"
                  aria-describedby="tl-r-on-note"
                  onClick={() => setRemindOn(!remindOn)}
                />
              </div>
              <div className={remindOn ? 'tl-row' : 'tl-row is-off'}>
                <label htmlFor="tl-time">{t(REMIND.time)}</label>
                <span className="tl-time">
                  <select id="tl-time" value={time} disabled={!remindOn} onChange={(event) => setTime(Number(event.target.value))}>
                    {TIMES.map((option) => (
                      <option key={option.minutes} value={option.minutes}>{t(option.label)}</option>
                    ))}
                  </select>
                  <svg viewBox="0 0 16 16" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </span>
              </div>
              <div className={remindOn ? 'tl-row tl-row--days' : 'tl-row tl-row--days is-off'}>
                <p id="tl-days-title">{t(REMIND.days)}</p>
                <div className="tl-wdays" role="group" aria-labelledby="tl-days-title">
                  {WEEKDAYS.map((weekday, index) => (
                    <button
                      key={weekday.long.en}
                      type="button"
                      aria-pressed={days[index]}
                      aria-label={t(weekday.long)}
                      disabled={!remindOn}
                      onClick={() => toggleDay(index)}
                    >
                      {t(weekday.letter)}
                    </button>
                  ))}
                </div>
              </div>
              <div className={remindOn ? 'tl-row' : 'tl-row is-off'}>
                <p>
                  <span id="tl-r-skip">{t(REMIND.skip)}</span>
                  <small id="tl-r-skip-note">{t(REMIND.skipNote)}</small>
                </p>
                <button
                  type="button"
                  role="switch"
                  className="tl-switch"
                  aria-checked={skipWritten}
                  aria-labelledby="tl-r-skip"
                  aria-describedby="tl-r-skip-note"
                  disabled={!remindOn}
                  onClick={() => setSkipWritten(!skipWritten)}
                />
              </div>
            </div>
            <figure className="tl-notif">
              <div className="tl-notif__card">
                <span className="tl-notif__icon" aria-hidden="true"><span>~</span></span>
                <p className="tl-notif__top"><b>{t(REMIND.app)}</b><span>{timeLabel}</span></p>
                <p>{t(REMIND.message)}</p>
              </div>
              <figcaption>
                <span className="tl-vh">{t(REMIND.preview)}</span>
                <span className="tl-notif__next" aria-live="polite">{nextReminder()}</span>
              </figcaption>
            </figure>
          </section>

          <section className="tl-privacy" id="tl-privacy" aria-labelledby="tl-privacy-title">
            <h2 id="tl-privacy-title">{t(PRIVACY.title)}</h2>
            <p className="tl-privacy__say">{t(PRIVACY.stored)}</p>
            <p className="tl-privacy__say">{t(PRIVACY.export)}</p>
            <div className="tl-file">
              <p className="tl-file__head">
                <b>{CSV_FILE}</b>
                <span>{fill(t(PRIVACY.size), { n: saved ? TODAY : TODAY - 1 })}</span>
              </p>
              <table className="tl-csv" role="table">
                <caption className="tl-vh">{t(PRIVACY.caption)}</caption>
                <thead role="rowgroup">
                  <tr role="row">
                    {CSV_COLUMNS.map((column) => (
                      <th key={column} scope="col" role="columnheader">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {csvRows.map((row) => (
                    <tr key={row.day} role="row">
                      <td role="cell" data-label="date">{`2026-11-${row.day}`}</td>
                      <td role="cell" data-label="mood"><i className={`tl-dot tl-m${row.mood}`} aria-hidden="true" />{MOODS[row.mood - 1].csv}</td>
                      <td role="cell" data-label="sleep">{row.sleep}</td>
                      <td role="cell" data-label="note" className={row.note ? 'tl-csv__note' : 'tl-csv__empty'}>{row.note || t(PRIVACY.noNote)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="tl-foot" id="tl-get">
          <p className="tl-logo">tilde</p>
          <p className="tl-foot__line">{t(GET.line)}</p>
          <dl className="tl-foot__needs">
            <div><dt>{t(GET.iphone)}</dt><dd>{t(GET.iphoneNeeds)}</dd></div>
            <div><dt>{t(GET.android)}</dt><dd>{t(GET.androidNeeds)}</dd></div>
          </dl>
          <nav className="tl-foot__nav" aria-label={t(GET.nav)}>
            <a href="#tl-entry">{t(TOP.entry)}</a>
            <a href="#tl-month">{t(TOP.month)}</a>
            <a href="#tl-remind">{t(TOP.remind)}</a>
            <a href="#tl-privacy">{t(TOP.privacy)}</a>
          </nav>
        </footer>
      </div>
    </FusionShell>
  );
}
