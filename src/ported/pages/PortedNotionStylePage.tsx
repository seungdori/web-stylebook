import { Fragment, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedNotionStylePage.css';

// The onboarding handbook of Hollis Ward, a twelve-person design studio, open in its
// workspace app in the Notion style. Type is the system UI stack and nothing else, retuned:
// a tight bold title, a 16px/1.6 reading size held near 33em, tabular figures in dates and
// counts. Components are the workspace's own blocks: a page tree, a breadcrumb bar, typed
// properties, a callout, a comment thread in the margin of one paragraph, to-do blocks with
// dates, a two-column block, a toggle list and a linked database view with three views.
// Corners stay at 3 to 6px, tags and statuses are tinted rectangles, rules are 24% ink.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const STUDIO = 'Hollis Ward';
const WS_MARK = 'HW';

const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };
const SEP: Record<Lang, string> = { en: ', ', ko: ' ', ja: ' ' };
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const formatDate = (iso: string, lang: Lang, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE[lang], { ...options, timeZone: 'UTC' }).format(toDate(iso));
const dayMonth = (iso: string, lang: Lang) => formatDate(iso, lang, { day: 'numeric', month: 'short' });
const weekdayDayMonth = (iso: string, lang: Lang) => formatDate(iso, lang, { weekday: 'short', day: 'numeric', month: 'short' });

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// Puts nodes into a sentence at its {placeholders}, so a name or a mention can carry its own markup.
const compose = (text: string, nodes: Record<string, ReactNode>): ReactNode[] =>
  text.split(/(\{\w+\})/).map((part, index) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return key && key in nodes ? <Fragment key={index}>{nodes[key]}</Fragment> : part;
  });

type IconName = 'page' | 'door' | 'db' | 'tri' | 'menu' | 'star' | 'owner' | 'clock' | 'tags' | 'cal' | 'pin' | 'table' | 'up';

// Stroke icons of at most three shapes, drawn on a 16px grid.
const ICONS: Record<IconName, ReactNode> = {
  page: (
    <>
      <path d="M3.75 1.75h5.5l3 3v9.5h-8.5z M9 1.75v3.25h3.25" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.75 8.25h4.5M5.75 10.75h4.5" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  door: (
    <>
      <path d="M2 2h12v12H2z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.5 11.5V4.5M4 11.5h8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 4.5a7 7 0 0 1 7 7" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.4 1.2" />
    </>
  ),
  db: <path d="M2 2.75h12v10.5H2z M2 6.25h12 M2 9.75h12 M6.25 2.75v10.5" fill="none" stroke="currentColor" strokeWidth="1.2" />,
  tri: <path d="M5.5 3.5 11 8l-5.5 4.5z" fill="currentColor" />,
  menu: <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
  star: <path d="M8 2.2l1.75 3.6 3.95.55-2.85 2.8.68 3.95L8 11.25 4.47 13.1l.68-3.95L2.3 6.35l3.95-.55z" strokeWidth="1.2" strokeLinejoin="round" />,
  owner: (
    <>
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.75V8l2.25 1.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  tags: <path d="M2.6 4.5h.4M2.6 8h.4M2.6 11.5h.4M6 4.5h7.5M6 8h7.5M6 11.5h7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
  cal: <path d="M2.5 3.5h11v10h-11z M2.5 6.75h11 M5.25 2v2.5 M10.75 2v2.5" fill="none" stroke="currentColor" strokeWidth="1.3" />,
  pin: (
    <>
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="2.6" fill="currentColor" />
    </>
  ),
  table: <path d="M2 3h12v10H2z M2 6.5h12 M6 6.5V13" fill="none" stroke="currentColor" strokeWidth="1.25" />,
  up: <path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
};

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className ? `nw-g ${className}` : 'nw-g'} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

type PersonId = 'ines' | 'felix' | 'tomas' | 'lewis' | 'priya' | 'anna' | 'rosa' | 'kit';
type Tone = 'grey' | 'blue' | 'green' | 'orange';

const PEOPLE: Record<PersonId, { name: string; initials: string; tone: Tone }> = {
  ines: { name: 'Ines Duarte', initials: 'ID', tone: 'blue' },
  felix: { name: 'Felix Brandt', initials: 'FB', tone: 'grey' },
  tomas: { name: 'Tomás Reyes', initials: 'TR', tone: 'green' },
  lewis: { name: 'Lewis McAra', initials: 'LM', tone: 'orange' },
  priya: { name: 'Priya Nair', initials: 'PN', tone: 'grey' },
  anna: { name: 'Anna Hollis', initials: 'AH', tone: 'orange' },
  rosa: { name: 'Rosa Delgado', initials: 'RD', tone: 'orange' },
  kit: { name: 'Kit Moreau', initials: 'KM', tone: 'green' },
};

function Avatar({ who, large }: { who: PersonId; large?: boolean }) {
  const person = PEOPLE[who];
  return (
    <span className={`nw-av nw-av--${person.tone}${large ? ' nw-av--large' : ''}`} aria-hidden="true">
      {person.initials}
    </span>
  );
}

function Mention({ who }: { who: PersonId }) {
  return <span className="nw-mention">{PEOPLE[who].name}</span>;
}

const UI = {
  sideLabel: { en: 'Workspace pages', ko: '워크스페이스 페이지', ja: 'ワークスペースのページ' },
  menu: { en: 'Page list', ko: '페이지 목록', ja: 'ページ一覧' },
  favourites: { en: 'Favourites', ko: '즐겨찾기', ja: 'お気に入り' },
  studio: { en: 'Studio', ko: '스튜디오', ja: 'スタジオ' },
  private: { en: 'Private', ko: '비공개', ja: '非公開' },
  empty: { en: 'No pages inside', ko: '하위 페이지 없음', ja: '下位のページはありません' },
  crumbs: { en: 'Breadcrumb', ko: '현재 위치', ja: 'パンくずリスト' },
  people: { en: 'People', ko: '구성원', ja: 'メンバー' },
  edited: { en: 'Edited {date}', ko: '{date} 수정됨', ja: '{date} 編集' },
  favourite: { en: 'Favourite', ko: '즐겨찾기', ja: 'お気に入り' },
  added: { en: 'Added to Favourites.', ko: '즐겨찾기에 추가했습니다.', ja: 'お気に入りに追加しました。' },
  removed: { en: 'Removed from Favourites.', ko: '즐겨찾기에서 제거했습니다.', ja: 'お気に入りから削除しました。' },
} satisfies Record<string, Tri>;

interface TreeItem {
  id: string;
  name: Tri;
  icon: IconName;
  children?: TreeItem[];
  current?: boolean;
}

const leaf = (id: string, name: Tri, icon: IconName = 'page'): TreeItem => ({ id, name, icon });

const PAGE_TITLE: Tri = { en: 'Onboarding handbook', ko: '온보딩 안내서', ja: 'オンボーディングガイド' };

const STUDIO_TREE: TreeItem[] = [
  {
    id: 'rules',
    name: { en: 'Studio rules', ko: '스튜디오 규칙', ja: 'スタジオの規則' },
    icon: 'page',
    children: [
      leaf('rules-projects', { en: 'Running a project', ko: '프로젝트 진행 방법', ja: 'プロジェクトの進め方' }),
      leaf('rules-leave', { en: 'Holiday and sick days', ko: '휴가와 병가', ja: '休暇と病欠' }),
      leaf('rules-expenses', { en: 'Expenses', ko: '경비 정산', ja: '経費精算' }),
    ],
  },
  {
    id: 'people',
    name: UI.people,
    icon: 'page',
    children: [
      { id: 'onboarding', name: PAGE_TITLE, icon: 'door', current: true },
      leaf('directory', { en: 'Team directory', ko: '팀 디렉터리', ja: 'チーム名簿' }),
      leaf('planner', { en: 'Holiday planner', ko: '휴가 일정표', ja: '休暇プランナー' }, 'cal'),
    ],
  },
  { id: 'tasks', name: { en: 'Studio tasks', ko: '스튜디오 업무', ja: 'スタジオのタスク' }, icon: 'db', children: [] },
  {
    id: 'projects',
    name: { en: 'Projects', ko: '프로젝트', ja: 'プロジェクト' },
    icon: 'page',
    children: [
      leaf('calder', { en: 'Calder Bridge wayfinding', ko: 'Calder Bridge 안내 체계', ja: 'Calder Bridge の案内計画' }),
      leaf('aldgate', { en: 'Aldgate Library signage', ko: 'Aldgate Library 사인물', ja: 'Aldgate Library のサイン' }),
      leaf('northfield', { en: 'Northfield Rail identity', ko: 'Northfield Rail 아이덴티티', ja: 'Northfield Rail のアイデンティティ' }),
    ],
  },
  {
    id: 'crit',
    name: { en: 'Crit notes', ko: '비평 회의 메모', ja: '講評メモ' },
    icon: 'page',
    children: [
      leaf('crit-20', { en: 'Crit, 20 November', ko: '비평 회의, 11월 20일', ja: '講評会、11月20日' }),
      leaf('crit-13', { en: 'Crit, 13 November', ko: '비평 회의, 11월 13일', ja: '講評会、11月13日' }),
      leaf('crit-6', { en: 'Crit, 6 November', ko: '비평 회의, 11월 6일', ja: '講評会、11月6日' }),
    ],
  },
];

const PRIVATE_TREE: TreeItem[] = [
  {
    id: 'payroll',
    name: { en: 'Payroll runs', ko: '급여 지급', ja: '給与計算' },
    icon: 'page',
    children: [
      leaf('payroll-nov', { en: 'November 2026', ko: '2026년 11월', ja: '2026年11月' }),
      leaf('payroll-oct', { en: 'October 2026', ko: '2026년 10월', ja: '2026年10月' }),
    ],
  },
  {
    id: 'suppliers',
    name: { en: 'Supplier contacts', ko: '거래처 연락처', ja: '取引先の連絡先' },
    icon: 'page',
    children: [
      leaf('printers', { en: 'Printers', ko: '인쇄소', ja: '印刷会社' }),
      leaf('sign-makers', { en: 'Sign makers', ko: '간판 제작사', ja: 'サイン制作会社' }),
      leaf('couriers', { en: 'Couriers', ko: '배송 업체', ja: '配送業者' }),
    ],
  },
];

const PROPS = {
  owner: { en: 'Owner', ko: '담당자', ja: '担当者' },
  edited: { en: 'Last edited', ko: '마지막 수정', ja: '最終編集' },
  tags: { en: 'Tags', ko: '태그', ja: 'タグ' },
  review: { en: 'Next review', ko: '다음 검토', ja: '次回の見直し' },
  start: { en: 'Start here', ko: '여기서 시작', ja: 'ここから始める' },
  ops: { en: 'Studio ops', ko: '스튜디오 운영', ja: 'スタジオ運営' },
} satisfies Record<string, Tri>;

const DOC = {
  welcome: { en: 'Welcome, Rosa.', ko: 'Rosa 님, 환영합니다.', ja: 'Rosa さん、ようこそ。' },
  callout: {
    en: 'You start on Monday 23 November. Come to 41 Osborne Street, second floor, at 9:30 and press the buzzer marked Hollis Ward. Ines will meet you at the door, and Tomás is your buddy for the first month.',
    ko: '입사일은 11월 23일 월요일입니다. 9시 30분까지 41 Osborne Street 2층으로 오셔서 인터폰의 Hollis Ward 버튼을 눌러 주세요. 현관에서 Ines가 맞이하며, Tomás가 첫 한 달 동안 버디를 맡습니다.',
    ja: '入社は11月23日（月）です。9時30分までに41 Osborne Street の2階へお越しください。インターホンの「Hollis Ward」を押してください。入口では Ines がお迎えします。最初の1か月は Tomás がバディを務めます。',
  },
  intro: {
    en: 'This page covers your first week. How we run projects, book holiday and claim expenses is in {rules}. If anything here is out of date, leave a comment and Ines will fix it.',
    ko: '이 페이지는 입사 첫 주의 내용을 다룹니다. 프로젝트 진행, 휴가 신청, 경비 청구 방법은 {rules}에 있습니다. 이 페이지에서 오래된 내용을 발견하면 댓글을 남겨 주세요. Ines가 고치겠습니다.',
    ja: 'このページでは入社後の最初の1週間について説明します。プロジェクトの進め方、休暇の申請、経費の精算は{rules}にまとめています。内容が古くなっている箇所があれば、コメントで知らせてください。Ines が修正します。',
  },
  rules: { en: 'Studio rules', ko: '스튜디오 규칙', ja: 'スタジオの規則' },
  week: { en: 'Your first week', ko: '입사 첫 주', ja: '入社1週目' },
  weekNote: {
    en: 'Nobody expects you to log billable hours this week. On Thursday at the 16:00 crit, {mark}. Ten minutes is plenty, and nobody brings slides.',
    ko: '이번 주에는 청구 가능 시간을 기록하지 않으셔도 됩니다. 목요일 16:00 비평 회의에서 {mark}. 10분이면 충분하며, 슬라이드는 가져오지 않아도 됩니다.',
    ja: '今週は請求対象時間の記録は求めていません。木曜日16時の講評会では{mark}。10分あれば十分で、スライドは不要です。',
  },
  mark: { en: 'show us something you made before you joined', ko: '입사 전에 만든 작업을 하나 보여 주세요', ja: '入社前に作った作品を一つ見せてください' },
  end: {
    en: 'Read {rules} before your second week. Ines checks this page every January and after each new starter.',
    ko: '2주차가 시작되기 전에 {rules}를 읽어 주세요. Ines는 매년 1월과 신규 입사자가 들어올 때마다 이 페이지를 확인합니다.',
    ja: '2週目が始まる前に{rules}をお読みください。Ines は毎年1月と新しいメンバーが入るたびに、このページを確認します。',
  },
} satisfies Record<string, Tri>;

const THREAD = {
  label: { en: 'Comments', ko: '댓글', ja: 'コメント' },
  yesterday: { en: 'Yesterday {time}', ko: '어제 {time}', ja: '昨日 {time}' },
  justNow: { en: 'Just now', ko: '방금', ja: 'たった今' },
  tomas: {
    en: 'Rosa asked if this has to be client work. Can we say personal projects count too?',
    ko: 'Rosa가 이것이 고객 작업이어야 하는지 물었습니다. 개인 프로젝트도 인정된다고 적어도 될까요?',
    ja: 'Rosa から、クライアント案件でなければならないのかと質問がありました。個人プロジェクトも対象になると書いてもよいでしょうか。',
  },
  anna: {
    en: 'Personal work is better, it tells us more. {who} can you add a line?',
    ko: '개인 작업이 더 좋습니다. 그쪽이 더 많은 것을 보여 주니까요. {who}, 한 줄 추가해 주실 수 있나요?',
    ja: '個人の作品のほうが、その人のことがよくわかります。{who}、一文追加していただけますか。',
  },
  replyLabel: { en: 'Reply to the comments', ko: '댓글에 답글 달기', ja: 'コメントへの返信' },
  placeholder: { en: 'Reply…', ko: '답글 입력…', ja: '返信を入力…' },
  draft: { en: 'Adding it to the Thursday line now', ko: '지금 목요일 항목에 추가하고 있습니다', ja: '今、木曜日の項目に追加しています' },
  send: { en: 'Send reply', ko: '답글 보내기', ja: '返信を送信' },
  empty: { en: 'Write a reply before you send it.', ko: '답글을 입력한 뒤 보내 주세요.', ja: '返信を入力してから送信してください。' },
  posted: { en: 'Reply posted.', ko: '답글을 등록했습니다.', ja: '返信を投稿しました。' },
} satisfies Record<string, Tri>;

interface Todo {
  id: string;
  text: Tri;
  who?: PersonId;
  /** The day it is planned for, and its time when it is a meeting. */
  date: string;
  time?: string;
  /** The day it was ticked off, for the ones already done. */
  doneOn?: string;
}

const TODOS: Todo[] = [
  {
    id: 'contract',
    text: { en: 'Return the signed contract and the new starter form', ko: '서명한 계약서와 입사 양식 제출하기', ja: '署名済みの契約書と入社書類を提出する' },
    date: '2026-11-20',
    doneOn: '2026-11-14',
  },
  {
    id: 'laptop',
    text: { en: 'Choose a laptop: 14 or 16 inch MacBook Pro', ko: '노트북 고르기: 14인치 또는 16인치 MacBook Pro', ja: 'ノートPCを選ぶ: 14インチまたは16インチの MacBook Pro' },
    date: '2026-11-18',
    doneOn: '2026-11-17',
  },
  {
    id: 'bio',
    text: { en: 'Send a photo and a two-line bio for the website', ko: '웹사이트용 사진과 두 줄 소개글 보내기', ja: 'ウェブサイト用の写真と二行の自己紹介文を送る' },
    date: '2026-11-20',
    doneOn: '2026-11-19',
  },
  {
    id: 'tour',
    text: { en: 'Studio tour, keys and the alarm code with {who}', ko: '{who}와 함께 스튜디오 둘러보기, 열쇠와 알람 코드 받기', ja: '{who}と一緒にスタジオを見学し、鍵と警報の暗証番号を受け取る' },
    who: 'ines',
    date: '2026-11-23',
    time: '10:00',
  },
  {
    id: 'accounts',
    text: { en: 'Sign in to Figma, Slack, Drive and 1Password with {who}', ko: '{who}와 함께 Figma, Slack, Drive, 1Password에 로그인하기', ja: '{who}と一緒に Figma、Slack、Drive、1Password にサインインする' },
    who: 'felix',
    date: '2026-11-23',
    time: '14:00',
  },
  {
    id: 'call',
    text: { en: 'Listen in on the Calder Bridge client call with {who}', ko: '{who}와 함께 Calder Bridge 고객 통화 듣기', ja: '{who}と一緒に Calder Bridge のクライアント通話を聞く' },
    who: 'lewis',
    date: '2026-11-24',
    time: '11:00',
  },
  {
    id: 'lunch',
    text: { en: 'Lunch with Anna and Kit. The studio pays.', ko: 'Anna, Kit과 점심. 비용은 스튜디오가 부담합니다.', ja: 'Anna、Kit とランチ。費用はスタジオ持ちです。' },
    date: '2026-11-25',
    time: '12:30',
  },
  {
    id: 'crit',
    text: { en: 'Crit: show something from before you joined', ko: '비평 회의: 입사 전 작업 하나 보여 주기', ja: '講評会: 入社前の作品を一つ見せる' },
    date: '2026-11-26',
    time: '16:00',
  },
  {
    id: 'debrief',
    text: { en: 'Half an hour with {who} on what was confusing', ko: '{who}와 30분, 헷갈렸던 부분 정리하기', ja: '{who}と30分、わかりにくかった点を振り返る' },
    who: 'tomas',
    date: '2026-11-27',
    time: '15:00',
  },
];

const TODO_UI = {
  doneOn: { en: 'Done {date}', ko: '{date} 완료', ja: '{date} 完了' },
  doneToday: { en: 'Done today', ko: '오늘 완료', ja: '今日完了' },
  due: { en: 'Due {date}', ko: '{date} 마감', ja: '{date} 期限' },
  count: { en: '{done} of {total} done', ko: '{total}개 중 {done}개 완료', ja: '{total}件中{done}件完了' },
} satisfies Record<string, Tri>;

interface TodoState {
  done: boolean;
  doneOn: string | null;
}

const INITIAL_TODOS: Record<string, TodoState> = Object.fromEntries(
  TODOS.map((todo) => [todo.id, { done: Boolean(todo.doneOn), doneOn: todo.doneOn ?? null }]),
);

const ASK = {
  title: { en: 'Who to ask', ko: '문의할 사람', ja: '問い合わせ先' },
  rows: [
    { who: 'ines', role: { en: 'Contracts, keys, payroll and holiday', ko: '계약, 열쇠, 급여와 휴가', ja: '契約、鍵、給与、休暇' } },
    { who: 'felix', role: { en: 'Your laptop, and any account that will not let you in', ko: '노트북과 로그인이 안 되는 계정', ja: 'ノートPCと、ログインできないアカウント' } },
    { who: 'tomas', role: { en: 'Your buddy, for the questions that feel too small', ko: '버디, 사소해 보여서 묻기 망설여지는 질문', ja: 'バディ、細かすぎて聞きにくい質問' } },
    { who: 'lewis', role: { en: 'Projects, timesheets and client calls', ko: '프로젝트, 근무 시간 기록, 고객 통화', ja: 'プロジェクト、勤務時間の記録、クライアント通話' } },
    { who: 'priya', role: { en: 'Type licences and the HW Core library', ko: '서체 라이선스와 HW Core 라이브러리', ja: 'フォントのライセンスと HW Core ライブラリ' } },
  ] satisfies Array<{ who: PersonId; role: Tri }>,
};

const TOOLS = {
  title: { en: 'Tools', ko: '도구', ja: 'ツール' },
  rows: [
    { name: 'Figma', text: { en: '{name} for all design work. Start every file from the HW Core library.', ko: '디자인 작업은 모두 {name}에서 합니다. 모든 파일은 HW Core 라이브러리에서 시작하세요.', ja: 'デザイン作業はすべて{name}で行います。どのファイルも HW Core ライブラリから始めてください。' } },
    { name: 'Slack', text: { en: '{name}: #studio for the whole team, #crit for work in progress.', ko: '{name}: 팀 전체는 #studio, 진행 중인 작업은 #crit을 사용합니다.', ja: '{name}: チーム全体は #studio、進行中の作業は #crit を使います。' } },
    { name: 'Google Drive', text: { en: '{name}, one folder per job, named by job number such as {job}.', ko: '{name}: 작업마다 폴더를 하나씩 만들고, {job}처럼 작업 번호로 이름을 붙입니다.', ja: '{name}: 案件ごとにフォルダを1つ作り、{job}のように案件番号で名前を付けます。' } },
    { name: 'Harvest', text: { en: '{name} for your hours. Log the week by 17:00 on Friday.', ko: '근무 시간은 {name}에 기록합니다. 금요일 17:00까지 한 주의 기록을 마치세요.', ja: '勤務時間は{name}に記録します。金曜日の17時までに1週間分を入力してください。' } },
    { name: '1Password', text: { en: '{name} for shared logins. Never paste a password into Slack.', ko: '공용 로그인 정보는 {name}에 보관합니다. 비밀번호를 Slack에 붙여 넣지 마세요.', ja: '共有のログイン情報は{name}で管理します。パスワードを Slack に貼り付けないでください。' } },
  ] satisfies Array<{ name: string; text: Tri }>,
};

const FAQ = {
  title: { en: 'Questions from past starters', ko: '이전 입사자들이 물었던 질문', ja: '過去の新メンバーからの質問' },
  rows: [
    {
      q: { en: 'What time do people start?', ko: '출근 시간은 언제인가요?', ja: '出社時間は何時ですか。' },
      a: {
        en: 'Core hours are 10:00 to 16:00. Most people arrive between 9:00 and 10:00 and leave by 18:00. On Fridays the studio closes at 16:00.',
        ko: '코어타임은 10:00부터 16:00까지입니다. 대부분 9:00에서 10:00 사이에 출근해 18:00 전에 퇴근합니다. 금요일에는 16:00에 스튜디오 문을 닫습니다.',
        ja: 'コアタイムは10時から16時までです。ほとんどの人は9時から10時の間に出社し、18時までに退社します。金曜日はスタジオが16時に閉まります。',
      },
    },
    {
      q: { en: 'Can I work from home?', ko: '재택근무를 할 수 있나요?', ja: '在宅勤務はできますか。' },
      a: {
        en: 'Tuesdays and Fridays, once your first month is over. Tell Lewis the week before if a client meeting falls on one of them.',
        ko: '첫 달이 지난 뒤 화요일과 금요일에 가능합니다. 그중 하루에 고객 미팅이 잡혀 있으면 일주일 전에 Lewis에게 알려 주세요.',
        ja: '最初の1か月が過ぎたら、火曜日と金曜日に可能です。そのどちらかにクライアントとの打ち合わせがある場合は、1週間前に Lewis に伝えてください。',
      },
    },
    {
      q: { en: 'How do I book holiday?', ko: '휴가는 어떻게 신청하나요?', ja: '休暇はどのように申請しますか。' },
      a: {
        en: "Add it to the Holiday planner and tell Ines. You have 28 days including the studio's week off between Christmas and New Year.",
        ko: '휴가 일정표에 추가한 뒤 Ines에게 알려 주세요. 연차는 28일이며, 크리스마스와 새해 사이 스튜디오 휴무 주간도 여기에 포함됩니다.',
        ja: '休暇プランナーに入れて、Ines に伝えてください。年次休暇は28日で、クリスマスから年始までのスタジオの休業週もこの日数に含まれます。',
      },
    },
    {
      q: { en: 'What do I do if I am ill?', ko: '아플 때는 어떻게 하나요?', ja: '体調を崩したときはどうすればよいですか。' },
      a: {
        en: 'Message Ines before 9:30. You do not need a note for the first seven days.',
        ko: '9:30 전에 Ines에게 메시지를 보내 주세요. 처음 7일 동안은 진단서가 필요하지 않습니다.',
        ja: '9時30分までに Ines にメッセージを送ってください。最初の7日間は診断書は不要です。',
      },
    },
    {
      q: { en: 'Where can I leave my bike?', ko: '자전거는 어디에 두면 되나요?', ja: '自転車はどこに停めればいいですか。' },
      a: {
        en: 'In the yard behind the building. The gate code is on the inside of the studio door.',
        ko: '건물 뒤편 마당에 두세요. 출입문 비밀번호는 스튜디오 문 안쪽에 적혀 있습니다.',
        ja: '建物の裏の中庭に停めてください。門の暗証番号はスタジオのドアの内側に書いてあります。',
      },
    },
  ] satisfies Array<{ q: Tri; a: Tri }>,
};

type Status = 'done' | 'doing' | 'todo';
type ProjectId = 'studio' | 'calder' | 'aldgate' | 'northfield';

const PROJECTS: Record<ProjectId, Tri> = {
  studio: { en: 'Studio', ko: '스튜디오', ja: 'スタジオ' },
  calder: { en: 'Calder Bridge', ko: 'Calder Bridge', ja: 'Calder Bridge' },
  aldgate: { en: 'Aldgate Library', ko: 'Aldgate Library', ja: 'Aldgate Library' },
  northfield: { en: 'Northfield Rail', ko: 'Northfield Rail', ja: 'Northfield Rail' },
};

const STATUS: Record<Status, Tri> = {
  done: { en: 'Done', ko: '완료', ja: '完了' },
  doing: { en: 'In progress', ko: '진행 중', ja: '進行中' },
  todo: { en: 'Not started', ko: '시작 전', ja: '未着手' },
};

interface Task {
  id: string;
  name: Tri;
  status: Status;
  who: PersonId;
  due: string;
  project: ProjectId;
  onboarding: boolean;
}

const TASKS: Task[] = [
  { id: 'setup', name: { en: 'Set up laptop and accounts', ko: '노트북과 계정 설정', ja: 'ノートPCとアカウントの設定' }, status: 'done', who: 'felix', due: '2026-11-23', project: 'studio', onboarding: true },
  { id: 'brief', name: { en: 'Read the Calder Bridge brief', ko: 'Calder Bridge 브리프 읽기', ja: 'Calder Bridge のブリーフを読む' }, status: 'doing', who: 'rosa', due: '2026-11-24', project: 'calder', onboarding: true },
  { id: 'call', name: { en: 'Client call, listening only', ko: '고객 통화, 듣기만 하기', ja: 'クライアント通話（聞くだけ）' }, status: 'todo', who: 'lewis', due: '2026-11-24', project: 'calder', onboarding: true },
  { id: 'library', name: { en: 'Walk through the HW Core library', ko: 'HW Core 라이브러리 살펴보기', ja: 'HW Core ライブラリの説明を受ける' }, status: 'todo', who: 'priya', due: '2026-11-25', project: 'studio', onboarding: true },
  { id: 'signs', name: { en: 'Proof the Aldgate Library sign schedule', ko: 'Aldgate Library 사인 일정 교정하기', ja: 'Aldgate Library のサイン制作スケジュールを校正する' }, status: 'doing', who: 'anna', due: '2026-11-25', project: 'aldgate', onboarding: false },
  { id: 'crit', name: { en: 'Show past work at crit', ko: '비평 회의에서 지난 작업 보여 주기', ja: '講評会で過去の作品を見せる' }, status: 'todo', who: 'rosa', due: '2026-11-26', project: 'studio', onboarding: true },
  { id: 'invoice', name: { en: 'Send the Calder Bridge stage 2 invoice', ko: 'Calder Bridge 2단계 청구서 보내기', ja: 'Calder Bridge の第2段階の請求書を送る' }, status: 'todo', who: 'lewis', due: '2026-12-01', project: 'calder', onboarding: false },
  { id: 'icons', name: { en: 'Redraw the wayfinding icon set', ko: '안내 아이콘 세트 다시 그리기', ja: '案内アイコンセットを描き直す' }, status: 'todo', who: 'rosa', due: '2026-12-02', project: 'calder', onboarding: true },
  { id: 'licences', name: { en: "Renew the studio's type licences", ko: '스튜디오 서체 라이선스 갱신하기', ja: 'スタジオのフォントライセンスを更新する' }, status: 'doing', who: 'priya', due: '2026-12-04', project: 'studio', onboarding: false },
  { id: 'sketches', name: { en: 'First identity sketches for Northfield Rail', ko: 'Northfield Rail 아이덴티티 첫 스케치', ja: 'Northfield Rail のアイデンティティの初期スケッチ' }, status: 'todo', who: 'kit', due: '2026-12-09', project: 'northfield', onboarding: false },
  { id: 'checkin', name: { en: 'First-month check-in', ko: '첫 달 점검 면담', ja: '最初の1か月の振り返り面談' }, status: 'todo', who: 'tomas', due: '2026-12-18', project: 'studio', onboarding: true },
  { id: 'party', name: { en: 'Book the Christmas lunch', ko: '크리스마스 점심 예약하기', ja: 'クリスマスランチを予約する' }, status: 'done', who: 'ines', due: '2026-11-20', project: 'studio', onboarding: false },
];

type ViewId = 'first-month' | 'week' | 'open';

interface View {
  id: ViewId;
  name: Tri;
  filters: Tri[];
  sort: Tri;
  keep: (task: Task) => boolean;
}

const SORT_DUE: Tri = { en: 'Sort: Due', ko: '정렬: 마감일', ja: '並べ替え: 期限' };

const VIEWS: View[] = [
  {
    id: 'first-month',
    name: { en: "Rosa's first month", ko: 'Rosa의 첫 달', ja: 'Rosa の最初の1か月' },
    filters: [
      { en: 'Tag: Onboarding', ko: '태그: 온보딩', ja: 'タグ: オンボーディング' },
      { en: 'Due: before 1 Jan', ko: '마감: 1월 1일 이전', ja: '期限: 1月1日より前' },
    ],
    sort: SORT_DUE,
    keep: (task) => task.onboarding,
  },
  {
    id: 'week',
    name: { en: 'This week', ko: '이번 주', ja: '今週' },
    filters: [{ en: 'Due: 23 to 27 Nov', ko: '마감: 11월 23일~27일', ja: '期限: 11月23日～27日' }],
    sort: SORT_DUE,
    keep: (task) => task.due >= '2026-11-23' && task.due <= '2026-11-27',
  },
  {
    id: 'open',
    name: { en: 'All open', ko: '미완료 전체', ja: '未完了すべて' },
    filters: [{ en: 'Status: not Done', ko: '상태: 완료 제외', ja: 'ステータス: 完了以外' }],
    sort: SORT_DUE,
    keep: (task) => task.status !== 'done',
  },
];

const DB = {
  title: { en: 'Studio tasks', ko: '스튜디오 업무', ja: 'スタジオのタスク' },
  views: { en: 'Views', ko: '보기', ja: 'ビュー' },
  filters: { en: 'Filters and sort', ko: '필터와 정렬', ja: 'フィルターと並べ替え' },
  task: { en: 'Task', ko: '업무', ja: 'タスク' },
  status: { en: 'Status', ko: '상태', ja: 'ステータス' },
  assignee: { en: 'Assignee', ko: '담당자', ja: '担当者' },
  due: { en: 'Due', ko: '마감', ja: '期限' },
  project: { en: 'Project', ko: '프로젝트', ja: 'プロジェクト' },
  count: { en: 'Count {n}', ko: '총 {n}개', ja: '{n}件' },
  shown: { en: '{view}: {n} tasks.', ko: '{view}: 업무 {n}개.', ja: '{view}: {n}件のタスク。' },
} satisfies Record<string, Tri>;

const EDITED = '2026-11-20';
const NEXT_REVIEW = '2027-01-01';

const PROMPT_EN = `Design one real page in the Notion style: a document open in a workspace app, white paper beside a warm grey page tree, set in the system UI font, with one calm blue for focus, checked boxes and the reply box.

Pick a believable subject whose real home is a shared workspace page, such as a studio's onboarding handbook, a team's launch checklist or a school's term plan, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is the onboarding handbook of Hollis Ward, a twelve-person design studio, open on the Friday before Rosa Delgado starts: her first week, who to ask, the tools, the questions past starters asked and the studio's task database.

TOKENS:
--bg: #ffffff (the document, the top bar and every popover; opaque)
--side: #f7f6f3 (the page tree)
--side-on: #e8e7e4 (a hovered or current row in the page tree)
--side-ink: #5f5e5a (page tree text)
--block: #f1f1ef (the callout, and the hover of buttons and toggles)
--ink: #37352f
--muted: #72716e (labels, dates, placeholders; 4.5:1 on --bg and --side)
--line: rgba(55,53,47,0.24) (every structural rule)
--accent: #2383e2 (focus rings, checked boxes, the reply box border, the send button, the In progress dot)
--accent-soft: #e8f0fe, --accent-ink: #1b5fa6 (blue tags, filters, avatars and the In progress status)
--ok-soft: rgba(77,170,87,0.16), --ok-ink: #2a6a33, --ok: #4daa57 (the Done status and the checklist bar)
--warn-soft: rgba(203,145,47,0.2), --warn-ink: #7f5714, --warn: #cb912f (orange tags and avatars, the callout icon, the highlighted words, a favourite star)
--grey-soft: rgba(55,53,47,0.09) (grey tags and avatars, the Not started status, the sort, the track of the checklist bar)
--red: #c4332b (the error under the reply box, its border and its focus ring)
The highlighted words in the commented paragraph sit on rgba(203,145,47,0.14) with a 2px --warn underline. Only the white of the workspace icon's letters, the checkmark and the send arrow is added; there are no other colours.

TYPOGRAPHY:
One family, the system UI stack: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif. No web font. Tabular figures throughout.
Page title (H1): 700, 2.75rem, line-height 1.12, letter-spacing -0.026em; 2.125rem on phones.
Headings (H2): 650, 1.5rem, line-height 1.3, letter-spacing -0.016em; 1.3125rem on phones. The database title: 700, 1.25rem.
Body: 400, 1rem, line-height 1.6, paragraphs held to 33em.
App text: the page tree, the breadcrumb, the view tabs, the roles under names and the reply error 0.9375rem; properties, the comments and the table 1rem; dates beside the to-dos, comment times, the edit date, column headers, tags, statuses, filters, group names and counts 0.875rem. Avatar initials are decorative and hidden from assistive technology. Bold names 600, mentions 500 with a muted @.

LAYOUT:
- An app window with a 1px --line border and 6px corners: on wide screens 1240px wide, breaking out of the 1120px text column; on phones it runs edge to edge with rules only above and below.
- Inside: the page tree on the left (240px, 220px on narrower windows), the top bar with the breadcrumb, the edit date and a favourite star, then the document in a column of at most 640px.
- When the document area is at least 976px wide, the comment thread sits in a 240px margin 32px to the right of its paragraph and the database widens into that margin. Narrower, the thread follows its paragraph.
- On the first screen of a 1280x800 laptop: the breadcrumb, the page icon, the title, the four properties and the welcome callout.
- Under 860px of window the page tree leaves the side: a Page list button in the top bar opens it as a panel under the bar and closes it again.

COMPONENTS:
- Page tree: the workspace name, the groups Studio and Private, page rows 30px tall (44px on phones) with 4px corners. A row with pages inside has a triangle and is a button with aria-expanded; it opens and closes its children (indented 22px), and an empty one says "No pages inside". The current page is a link with aria-current on --side-on in 600. Starring the page adds a Favourites group at the top.
- Breadcrumb: an ordered list joined by "/" in --muted, the current page in --ink with its icon.
- Properties: a two-column list (148px labels with icons, values) under the title, closed by a 1px rule: owner with avatar, last edited, three tinted tags with 3px corners, next review.
- Callout: --block background, 4px corners, a 22px icon in --warn, bold first words.
- Comment thread: on the paragraph's highlighted words; a white popover with a 1px --line border, 6px corners and the shadow 0 6px 18px rgba(15,15,15,0.08); 22px round avatars, names in 600, times in --muted; a reply box with a 1px --accent border and 4px corners, a round 26px --accent send button with a white arrow. Enter or the button posts the reply into the thread as "Just now"; an empty reply is refused with a message in --red under the box (role="alert").
- To-dos: 16px boxes with a 1.5px --ink border and 2px corners; checked ones fill --accent with a white tick and strike their text in --muted. Each date sits right-aligned in --muted and becomes "Done today" when ticked. Under the list, a 96px bar in --ok on --grey-soft and "3 of 9 done", which counts as boxes change.
- Two-column block: Who to ask (30px avatars, name, role in --muted, 1px rules between people) and Tools (a bulleted list with bold names). One column on narrow documents.
- Toggle list: a filled triangle that turns 90 degrees when open; native details and summary.
- Database view: the title with a table icon; three view tabs ("Rosa's first month", "This week", "All open") as a tab list on a 1px rule, the selected one underlined 2px in --ink; the view's filters and sort as tinted rectangles with 4px corners; a table with 1px rules between columns and rows: Task in 500, Status as a tinted rectangle with a 7px dot, Assignee with a 20px avatar, Due, Project with a page icon; "Count" at the foot. Each tab filters the rows. Under 860px of table width each row stacks: the task, then status, assignee, due and project with their labels.

MOTION:
- Background colour changes of 0.12s on rows and buttons, a 0.15s turn of the triangles, a 0.2s growth of the checklist bar. Nothing moves on its own. prefers-reduced-motion removes them.

FORBIDDEN:
- Cards, pills, glass panels, gradients, glows, shadows other than the comment popover's
- A small label above a heading, all-caps tracked labels, numbered section markers
- Emoji page icons, illustrations, photographs, cover images
- Drag handles, slash menus or buttons that do nothing; every control on the page works
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about productivity, minimalism or the app itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a nav with disclosure buttons for the page tree, an ordered breadcrumb, a description list for the properties, checkboxes with labels, details and summary for the toggles, a tab list with one labelled panel, a table with explicit roles
3) Working tree toggles, page list on phones, to-dos with their count, toggles, view tabs, and a reply form with an empty-reply error
4) Responsive layout down to 320px with no horizontal scroll; every control at least 44px tall on phones
5) A visible 2px --accent focus ring on every control, polite announcements for the count, the posted reply, the view and the favourite, reduced-motion support`;

const PROMPT_KO = `Notion 스타일로 실제 페이지 하나를 디자인한다. 워크스페이스 앱에서 열린 문서로, 흰 종이 옆에 따뜻한 회색 페이지 트리를 두고, 시스템 UI 서체를 쓴다. 포커스, 체크된 상자, 답글 입력창에만 차분한 파란색 하나를 쓴다.

실제 공유 워크스페이스 페이지에 있을 법한 주제를 고르고, 그 페이지의 실제 내용을 쓴다. 예: 스튜디오의 온보딩 안내서, 팀의 출시 체크리스트, 학교의 학기 계획. 페이지는 그 주제의 페이지로 읽혀야 하며, 자기 스타일에 관한 페이지로 읽히면 안 된다. 여기서는 직원 열두 명의 디자인 스튜디오 Hollis Ward의 온보딩 안내서이며, Rosa Delgado가 입사하기 전 금요일에 열어 둔 상태다. 내용은 입사 첫 주, 누구에게 물어볼지, 도구, 이전 입사자들이 한 질문, 스튜디오의 업무 데이터베이스다.

TOKENS:
--bg: #ffffff (문서, 상단 막대, 모든 팝오버. 불투명)
--side: #f7f6f3 (페이지 트리)
--side-on: #e8e7e4 (페이지 트리에서 호버되었거나 현재인 행)
--side-ink: #5f5e5a (페이지 트리 텍스트)
--block: #f1f1ef (콜아웃, 버튼과 토글의 호버)
--ink: #37352f
--muted: #72716e (라벨, 날짜, 플레이스홀더. --bg와 --side 위에서 4.5:1)
--line: rgba(55,53,47,0.24) (모든 구조선)
--accent: #2383e2 (포커스 링, 체크된 상자, 답글 입력창 테두리, 보내기 버튼, '진행 중' 점)
--accent-soft: #e8f0fe, --accent-ink: #1b5fa6 (파란 태그, 필터, 아바타, '진행 중' 상태)
--ok-soft: rgba(77,170,87,0.16), --ok-ink: #2a6a33, --ok: #4daa57 ('완료' 상태와 체크리스트 막대)
--warn-soft: rgba(203,145,47,0.2), --warn-ink: #7f5714, --warn: #cb912f (주황 태그와 아바타, 콜아웃 아이콘, 강조된 단어, 즐겨찾기 별)
--grey-soft: rgba(55,53,47,0.09) (회색 태그와 아바타, '시작 전' 상태, 정렬, 체크리스트 막대의 트랙)
--red: #c4332b (답글 입력창 아래 오류, 그 테두리와 포커스 링)
댓글이 달린 문단의 강조된 단어는 rgba(203,145,47,0.14) 배경에 2px --warn 밑줄을 쓴다. 흰색은 워크스페이스 아이콘의 글자, 체크 표시, 보내기 화살표에만 추가한다. 그 밖의 색은 쓰지 않는다.

TYPOGRAPHY:
서체는 시스템 UI 스택 하나만 쓴다: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif. 웹 폰트는 쓰지 않는다. 모든 숫자는 고정폭 숫자(tabular figures)로 쓴다.
페이지 제목(H1): 700, 2.75rem, 행간 1.12, 자간 -0.026em. 휴대폰에서는 2.125rem.
제목(H2): 650, 1.5rem, 행간 1.3, 자간 -0.016em. 휴대폰에서는 1.3125rem. 데이터베이스 제목: 700, 1.25rem.
본문: 400, 1rem, 행간 1.6. 문단 너비는 33em으로 제한한다.
앱 텍스트: 페이지 트리, 현재 위치, 보기 탭, 이름 아래 역할, 답글 오류는 0.9375rem. 속성, 댓글, 표는 1rem. 할 일 옆 날짜, 댓글 시각, 수정 날짜, 열 머리글, 태그, 상태, 필터, 그룹 이름, 개수는 0.875rem. 아바타 이니셜은 장식이므로 보조 기술에서 숨긴다. 굵은 이름은 600, 멘션은 500이며 흐린 @를 붙인다.

LAYOUT:
- 1px --line 테두리와 6px 모서리를 가진 앱 창. 넓은 화면에서는 너비 1240px로, 1120px 본문 열 밖으로 나온다. 휴대폰에서는 가장자리까지 채우고 위아래 구분선만 둔다.
- 내부: 왼쪽에 페이지 트리(240px, 좁은 창에서는 220px), 현재 위치, 수정 날짜, 즐겨찾기 별이 있는 상단 막대, 그다음 최대 640px 너비의 문서 열.
- 문서 영역이 최소 976px이면 댓글 스레드는 문단 오른쪽 32px 떨어진 240px 여백에 놓이고, 데이터베이스는 그 여백까지 넓어진다. 더 좁으면 스레드는 문단 바로 아래에 놓인다.
- 1280x800 노트북의 첫 화면에는 현재 위치, 페이지 아이콘, 제목, 네 가지 속성, 환영 콜아웃이 보여야 한다.
- 창 너비가 860px 미만이면 페이지 트리는 옆에서 사라진다. 상단 막대의 '페이지 목록' 버튼이 막대 아래 패널로 열고, 다시 누르면 닫힌다.

COMPONENTS:
- 페이지 트리: 워크스페이스 이름, '스튜디오'와 '비공개' 그룹, 4px 모서리의 페이지 행(높이 30px, 휴대폰에서는 44px). 하위 페이지가 있는 행에는 삼각형이 있고 aria-expanded를 가진 버튼이다. 하위 항목을 열고 닫으며(22px 들여쓰기), 비어 있으면 '하위 페이지 없음'이라고 쓴다. 현재 페이지는 aria-current를 가진 링크이며 --side-on 배경에 600 굵기다. 페이지에 별표를 하면 맨 위에 '즐겨찾기' 그룹이 추가된다.
- 현재 위치: --muted 색 '/'로 이어진 순서 목록. 현재 페이지는 아이콘과 함께 --ink 색으로 쓴다.
- 속성: 제목 아래 두 열 목록(아이콘이 붙은 148px 라벨과 값). 1px 구분선으로 닫는다. 담당자와 아바타, 마지막 수정, 3px 모서리의 색 입힌 태그 세 개, 다음 검토.
- 콜아웃: --block 배경, 4px 모서리, --warn 색 22px 아이콘, 앞 단어는 굵게.
- 댓글 스레드: 문단의 강조된 단어에 연결된다. 흰색 팝오버는 1px --line 테두리, 6px 모서리, 그림자 0 6px 18px rgba(15,15,15,0.08)를 가진다. 22px 원형 아바타, 이름은 600, 시각은 --muted. 답글 입력창은 1px --accent 테두리와 4px 모서리를 가지며, 흰색 화살표가 있는 지름 26px의 --accent 원형 보내기 버튼이 붙는다. Enter 키나 버튼을 누르면 답글이 '방금'이라는 표시로 스레드에 등록된다. 빈 답글은 거부되며, 입력창 아래에 --red 색 메시지가 role="alert"로 나타난다.
- 할 일: 1.5px --ink 테두리와 2px 모서리를 가진 16px 상자. 체크된 상자는 --accent로 채우고 흰색 체크 표시를 넣으며, 텍스트에는 --muted 색 취소선을 긋는다. 각 날짜는 오른쪽 정렬로 --muted 색이며, 체크하면 '오늘 완료'로 바뀐다. 목록 아래에는 --grey-soft 위의 --ok 색 96px 막대와 '9개 중 3개 완료'가 있고, 상자를 바꿀 때마다 개수가 갱신된다.
- 두 열 블록: '문의할 사람'(30px 아바타, 이름, --muted 색 역할, 사람 사이 1px 구분선)과 '도구'(굵은 이름이 있는 글머리 기호 목록). 좁은 문서에서는 한 열이다.
- 토글 목록: 열리면 90도 회전하는 채워진 삼각형. 네이티브 details와 summary를 쓴다.
- 데이터베이스 보기: 표 아이콘이 있는 제목. 1px 구분선 위의 탭 목록에 보기 탭 세 개('Rosa의 첫 달', '이번 주', '미완료 전체')가 있으며, 선택된 탭은 --ink 색 2px 밑줄을 가진다. 보기의 필터와 정렬은 4px 모서리를 가진 색 입힌 사각형으로 표시한다. 열과 행 사이에 1px 구분선이 있는 표: 업무는 500 굵기, 상태는 7px 점이 있는 색 입힌 사각형, 담당자는 20px 아바타, 마감, 페이지 아이콘이 있는 프로젝트. 아래쪽에는 개수 표시. 각 탭은 행을 필터링한다. 표 너비가 860px 미만이면 각 행을 쌓는다. 업무, 그다음 상태, 담당자, 마감, 프로젝트를 각각의 라벨과 함께 보여 준다.

MOTION:
- 행과 버튼의 배경색 변화는 0.12초, 삼각형 회전은 0.15초, 체크리스트 막대 증가는 0.2초. 스스로 움직이는 요소는 없다. prefers-reduced-motion에서는 이 모두를 제거한다.

FORBIDDEN:
- 카드, 알약 모양 버튼, 유리 패널, 그라데이션, 글로우, 댓글 팝오버 외의 그림자
- 제목 위의 작은 라벨, 전부 대문자이고 자간을 넓힌 라벨, 번호가 붙은 섹션 표시
- 이모지 페이지 아이콘, 일러스트, 사진, 커버 이미지
- 드래그 핸들, 아무 동작도 하지 않는 슬래시 메뉴나 버튼. 페이지의 모든 컨트롤은 작동해야 한다.
- 링크의 화살표, 가운뎃점으로 이어진 메타 문자열, 실제 순서가 아닌 것에 붙인 번호
- 생산성, 미니멀리즘, 앱 자체에 관한 문구

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 정의 속성
2) 시맨틱 HTML: 페이지 트리는 펼침 버튼이 있는 nav, 순서 있는 현재 위치 목록, 속성은 설명 목록(dl), 라벨이 있는 체크박스, 토글은 details와 summary, 라벨이 있는 패널 하나를 가진 탭 목록, 역할을 명시한 표
3) 작동하는 트리 토글, 휴대폰의 페이지 목록, 개수가 있는 할 일, 토글, 보기 탭, 빈 답글 오류가 있는 답글 폼
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서 모든 컨트롤의 높이는 44px 이상
5) 모든 컨트롤에 보이는 2px --accent 포커스 링. 개수, 등록된 답글, 보기, 즐겨찾기에 대한 부드러운 알림(aria-live="polite"). reduced-motion 지원`;

const PROMPT_JA = `Notion スタイルの実在するページを一つデザインする。ワークスペースアプリで開かれたドキュメントで、白い紙の横に温かみのあるグレーのページツリーを置き、システムUIフォントを使う。フォーカス、チェックされた箱、返信欄にだけ落ち着いた青を一色使う。

共有ワークスペースのページに実際に置かれていそうな題材を選び、そのページの実際の内容を書く。例: スタジオのオンボーディングガイド、チームのローンチチェックリスト、学校の学期計画。そのページは題材のページとして読めなければならず、自分のスタイルについてのページに見えてはならない。ここでは、社員12名のデザインスタジオ Hollis Ward のオンボーディングガイドを扱う。Rosa Delgado の入社前の金曜日に開かれている状態で、内容は入社1週目、誰に質問するか、ツール、過去の新メンバーからの質問、スタジオのタスクデータベース。

TOKENS:
--bg: #ffffff（ドキュメント、上部バー、すべてのポップオーバー。不透明）
--side: #f7f6f3（ページツリー）
--side-on: #e8e7e4（ページツリーでホバーされている行、または現在の行）
--side-ink: #5f5e5a（ページツリーの文字）
--block: #f1f1ef（コールアウト、ボタンとトグルのホバー）
--ink: #37352f
--muted: #72716e（ラベル、日付、プレースホルダー。--bg と --side 上で 4.5:1）
--line: rgba(55,53,47,0.24)（すべての構造線）
--accent: #2383e2（フォーカスリング、チェックされた箱、返信欄の枠線、送信ボタン、「進行中」の点）
--accent-soft: #e8f0fe, --accent-ink: #1b5fa6（青いタグ、フィルター、アバター、「進行中」のステータス）
--ok-soft: rgba(77,170,87,0.16), --ok-ink: #2a6a33, --ok: #4daa57（「完了」のステータスとチェックリストのバー）
--warn-soft: rgba(203,145,47,0.2), --warn-ink: #7f5714, --warn: #cb912f（オレンジのタグとアバター、コールアウトのアイコン、強調語、お気に入りの星）
--grey-soft: rgba(55,53,47,0.09)（グレーのタグとアバター、「未着手」のステータス、並べ替え、チェックリストバーの軌道）
--red: #c4332b（返信欄の下のエラー、その枠線とフォーカスリング）
コメントの付いた段落の強調語は rgba(203,145,47,0.14) の上に 2px の --warn 下線を引く。白は、ワークスペースアイコンの文字、チェックマーク、送信矢印にだけ加える。ほかの色は使わない。

TYPOGRAPHY:
フォントファミリーは一つだけ。システムUIスタック: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif。Webフォントは使わない。すべての数字は等幅数字（tabular figures）にする。
ページタイトル（H1）: 700、2.75rem、行間 1.12、字間 -0.026em。スマートフォンでは 2.125rem。
見出し（H2）: 650、1.5rem、行間 1.3、字間 -0.016em。スマートフォンでは 1.3125rem。データベースのタイトル: 700、1.25rem。
本文: 400、1rem、行間 1.6。段落は 33em に収める。
アプリ内テキスト: ページツリー、パンくず、ビュータブ、名前の下の役割、返信エラーは 0.9375rem。プロパティ、コメント、表は 1rem。やること横の日付、コメントの時刻、編集日、列見出し、タグ、ステータス、フィルター、グループ名、件数は 0.875rem。アバターのイニシャルは装飾なので支援技術から隠す。太字の名前は 600、メンションは 500 で、薄い色の @ を付ける。

LAYOUT:
- 1px の --line 枠線と 6px の角丸を持つアプリウィンドウ。広い画面では幅 1240px で、1120px の本文列からはみ出す。スマートフォンでは端から端まで広がり、上下の罫線だけを持つ。
- 内部: 左に幅 240px のページツリー（狭いウィンドウでは 220px）、パンくず、編集日、お気に入りの星がある上部バー、その下に最大 640px の列でドキュメント。
- ドキュメント領域の幅が 976px 以上のとき、コメントスレッドは段落の右 32px、幅 240px の余白に置かれ、データベースはその余白まで広がる。より狭いときは、スレッドが段落の直下に来る。
- 1280x800 のノートPCの最初の画面: パンくず、ページアイコン、タイトル、4 つのプロパティ、ようこそのコールアウト。
- ウィンドウ幅が 860px 未満では、ページツリーは横から消える。上部バーの「ページ一覧」ボタンで、バーの下のパネルとして開き、もう一度押すと閉じる。

COMPONENTS:
- ページツリー: ワークスペース名、「スタジオ」と「非公開」のグループ、4px の角丸を持つ高さ 30px のページ行（スマートフォンでは 44px）。下位ページを持つ行は三角形があり、aria-expanded を持つボタンである。子を開閉し（22px インデント）、空の場合は「下位のページはありません」と表示する。現在のページは aria-current を持つリンクで、--side-on の上に 600 の太字。ページにスターを付けると、一番上に「お気に入り」グループが加わる。
- パンくず: --muted の「/」で区切った順序付きリスト。現在のページは --ink で、アイコン付き。
- プロパティ: タイトルの下の 2 列リスト（アイコン付きの 148px のラベルと値）。1px の罫線で閉じる。担当者とアバター、最終編集、3px の角丸を持つ色付きタグ 3 つ、次回の見直し。
- コールアウト: --block の背景、4px の角丸、--warn の 22px アイコン、冒頭の語は太字。
- コメントスレッド: 段落の強調語に付く。白いポップオーバーは 1px の --line 枠線、6px の角丸、影 0 6px 18px rgba(15,15,15,0.08)。22px の丸いアバター、名前は 600、時刻は --muted。返信欄は 1px の --accent 枠線と 4px の角丸、白い矢印を持つ直径 26px の丸い --accent の送信ボタン。Enter キーかボタンで、返信が「たった今」としてスレッドに投稿される。空の返信は拒否され、欄の下に --red の文言が role="alert" で表示される。
- やること: 1.5px の --ink 枠線と 2px の角丸を持つ 16px の箱。チェックされた箱は --accent で塗り、白いチェックマークを入れ、文字は --muted で取り消し線を引く。各日付は右揃えで --muted。チェックすると「今日完了」に変わる。リストの下には、--grey-soft の上の --ok の 96px バーと「9件中3件完了」を置き、箱を変えるたびに件数を更新する。
- 2 列のブロック: 「問い合わせ先」（30px のアバター、名前、--muted の役割、人の間に 1px の罫線）と「ツール」（太字の名前を持つ箇条書き）。狭いドキュメントでは 1 列。
- トグルリスト: 開くと 90 度回転する塗りつぶしの三角形。ネイティブの details と summary を使う。
- データベースビュー: 表アイコン付きのタイトル。1px の罫線の上のタブリストに、3 つのビュー（「Rosa の最初の1か月」「今週」「未完了すべて」）。選択中のタブは --ink の 2px 下線。ビューのフィルターと並べ替えは、4px の角丸を持つ色付きの四角形。列と行の間に 1px の罫線がある表: 業務は 500、ステータスは 7px の点を持つ色付きの四角形、担当者は 20px のアバター、期限、ページアイコン付きのプロジェクト。末尾には件数表示。各タブは行を絞り込む。表の幅が 860px 未満では、各行を積み重ねる。業務、続いてステータス、担当者、期限、プロジェクトを、それぞれのラベル付きで表示する。

MOTION:
- 行とボタンの背景色の変化は 0.12 秒、三角形の回転は 0.15 秒、チェックリストバーの伸びは 0.2 秒。自動で動くものはない。prefers-reduced-motion では、これらをすべて外す。

FORBIDDEN:
- カード、ピル型ボタン、ガラス調のパネル、グラデーション、光彩、コメントポップオーバー以外の影
- 見出しの上の小さなラベル、すべて大文字で字間を空けたラベル、番号付きのセクション記号
- 絵文字のページアイコン、イラスト、写真、カバー画像
- ドラッグハンドル、何もしないスラッシュメニューやボタン。ページ上のすべての操作は機能すること
- リンクの矢印、中黒で区切ったメタ文字列、実際の順序ではないものへの番号
- 生産性、ミニマリズム、アプリ自体についての文言

OUTPUT:
1) 上のトークンの CSS カスタムプロパティ
2) セマンティック HTML: ページツリーは開閉ボタン付きの nav、順序付きのパンくず、プロパティは説明リスト（dl）、ラベル付きのチェックボックス、トグルは details と summary、ラベル付きのパネル 1 つを持つタブリスト、役割を明示した表
3) 動作するツリーの開閉、スマートフォンのページ一覧、件数付きのやること、トグル、ビュータブ、空の返信エラーを持つ返信フォーム
4) 320px までのレスポンシブレイアウト。横スクロールなし。スマートフォンでは全コントロールの高さを 44px 以上にする
5) すべてのコントロールに見える 2px の --accent フォーカスリング。件数、投稿された返信、ビュー、お気に入りについての穏やかな通知（aria-live="polite"）。reduced-motion への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

export function PortedNotionStylePage({ lang }: PortedStylePageProps) {
  const [sideOpen, setSideOpen] = useState(false);
  const [openIds, setOpenIds] = useState<string[]>(['people']);
  const [favourite, setFavourite] = useState(false);
  const [todos, setTodos] = useState<Record<string, TodoState>>(INITIAL_TODOS);
  const [replies, setReplies] = useState<string[]>([]);
  const [draft, setDraft] = useState(() => THREAD.draft[lang]);
  const [replyError, setReplyError] = useState(false);
  const [viewId, setViewId] = useState<ViewId>('first-month');
  const [news, setNews] = useState('');
  const menuRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const t = (text: Tri) => text[lang];

  // A repeated message gets a trailing no-break space, so the live region reads it again.
  const announce = (message: string) => setNews((previous) => (previous === message ? `${message}\u00a0` : message));

  const doneCount = TODOS.filter((todo) => todos[todo.id].done).length;
  const view = VIEWS.find((item) => item.id === viewId) ?? VIEWS[0];
  const rows = TASKS.filter(view.keep).sort((a, b) => a.due.localeCompare(b.due));

  const toggleTree = (id: string) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));

  // On phones the page tree is a panel under the top bar. Opening the current page from it
  // closes the panel, and focus goes to the title the link leads to.
  const goToTitle = () => {
    if (!sideOpen) return;
    setSideOpen(false);
    window.requestAnimationFrame(() => titleRef.current?.focus());
  };

  const onSideKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape' || !sideOpen) return;
    event.preventDefault();
    setSideOpen(false);
    menuRef.current?.focus();
  };

  const toggleFavourite = () => {
    const next = !favourite;
    setFavourite(next);
    announce(t(next ? UI.added : UI.removed));
  };

  const toggleTodo = (id: string) => {
    const nowDone = !todos[id].done;
    setTodos({ ...todos, [id]: { done: nowDone, doneOn: null } });
    announce(fill(t(TODO_UI.count), { done: doneCount + (nowDone ? 1 : -1), total: TODOS.length }));
  };

  const todoWhen = (todo: Todo) => {
    const state = todos[todo.id];
    if (state.done) return state.doneOn ? fill(t(TODO_UI.doneOn), { date: dayMonth(state.doneOn, lang) }) : t(TODO_UI.doneToday);
    return todo.time ? `${weekdayDayMonth(todo.date, lang)}${SEP[lang]}${todo.time}` : fill(t(TODO_UI.due), { date: dayMonth(todo.date, lang) });
  };

  const postReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    replyRef.current?.focus();
    if (!text) {
      setReplyError(true);
      return;
    }
    setReplies([...replies, text]);
    setDraft('');
    setReplyError(false);
    announce(t(THREAD.posted));
  };

  const onReplyKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const chooseView = (next: View) => {
    setViewId(next.id);
    announce(fill(t(DB.shown), { view: t(next.name), n: TASKS.filter(next.keep).length }));
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = VIEWS.length - 1;
    const target =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
        : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
          : event.key === 'Home' ? 0
            : event.key === 'End' ? last
              : -1;
    if (target < 0) return;
    event.preventDefault();
    chooseView(VIEWS[target]);
    tabRefs.current[target]?.focus();
  };

  const currentRow = (
    <a className="nw-row nw-row--current" href="#nw-title" aria-current="page" onClick={goToTitle}>
      <Icon name="door" />
      <span className="nw-row__name">{t(PAGE_TITLE)}</span>
    </a>
  );

  const renderTree = (items: TreeItem[]): ReactNode =>
    items.map((item) => {
      if (item.current) return <li key={item.id}>{currentRow}</li>;
      if (!item.children) {
        return (
          <li key={item.id}>
            <span className="nw-row nw-row--leaf">
              <Icon name={item.icon} />
              <span className="nw-row__name">{t(item.name)}</span>
            </span>
          </li>
        );
      }
      const open = openIds.includes(item.id);
      return (
        <li key={item.id}>
          <button type="button" className="nw-row" aria-expanded={open} aria-controls={`nw-tree-${item.id}`} onClick={() => toggleTree(item.id)}>
            <Icon name="tri" className="nw-tw" />
            <Icon name={item.icon} />
            <span className="nw-row__name">{t(item.name)}</span>
          </button>
          <ul id={`nw-tree-${item.id}`} hidden={!open}>
            {item.children.length > 0 ? (
              renderTree(item.children)
            ) : (
              <li><span className="nw-row nw-row--empty">{t(UI.empty)}</span></li>
            )}
          </ul>
        </li>
      );
    });

  const pageRef = (
    <span className="nw-ref">
      <Icon name="page" />
      {t(DOC.rules)}
    </span>
  );

  return (
    <FusionShell
      fusionId="notion-style"
      lang={lang}
      tone="light"
      accent="#2383e2"
      prev={{ href: '/pages/soft-pastel.html', label: 'Soft Pastel' }}
      next={{ href: '/pages/retro-pixel.html', label: 'Retro Pixel' }}
      prompts={PROMPTS}
    >
      <div className="nw">
        <p className="nw-sr" role="status">{news}</p>
        <div className="nw-app">
          <div className={`nw-grid${sideOpen ? ' is-side-open' : ''}`}>
            <header className="nw-top">
              <button
                ref={menuRef}
                type="button"
                className="nw-ib nw-menu"
                aria-label={t(UI.menu)}
                aria-expanded={sideOpen}
                aria-controls="nw-side"
                onClick={() => setSideOpen(!sideOpen)}
              >
                <Icon name="menu" />
              </button>
              <ol className="nw-crumbs" aria-label={t(UI.crumbs)}>
                <li><span>{STUDIO}</span></li>
                <li><span>{t(UI.studio)}</span></li>
                <li><span>{t(UI.people)}</span></li>
                <li aria-current="page">
                  <span>
                    <Icon name="door" />
                    {t(PAGE_TITLE)}
                  </span>
                </li>
              </ol>
              <span className="nw-edited">{fill(t(UI.edited), { date: dayMonth(EDITED, lang) })}</span>
              <button
                type="button"
                className={`nw-ib nw-star${favourite ? ' is-on' : ''}`}
                aria-label={t(UI.favourite)}
                aria-pressed={favourite}
                onClick={toggleFavourite}
              >
                <Icon name="star" />
              </button>
            </header>

            <nav className="nw-side" id="nw-side" aria-label={t(UI.sideLabel)} onKeyDown={onSideKey}>
              <div className="nw-side__in">
                <p className="nw-ws">
                  <i aria-hidden="true">{WS_MARK}</i>
                  {STUDIO}
                </p>
                {favourite ? (
                  <>
                    <p className="nw-group" id="nw-group-fav">{t(UI.favourites)}</p>
                    <ul className="nw-tree" aria-labelledby="nw-group-fav">
                      <li>{currentRow}</li>
                    </ul>
                  </>
                ) : null}
                <p className="nw-group" id="nw-group-studio">{t(UI.studio)}</p>
                <ul className="nw-tree" aria-labelledby="nw-group-studio">{renderTree(STUDIO_TREE)}</ul>
                <p className="nw-group" id="nw-group-private">{t(UI.private)}</p>
                <ul className="nw-tree" aria-labelledby="nw-group-private">{renderTree(PRIVATE_TREE)}</ul>
              </div>
            </nav>

            <div className="nw-area">
              <article className="nw-doc" aria-labelledby="nw-title">
                <svg className="nw-page-icon" viewBox="0 0 72 72" aria-hidden="true" focusable="false">
                  <rect x="7" y="7" width="58" height="58" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M19 53V19M17 53h36" fill="none" stroke="currentColor" strokeWidth="3.5" />
                  <path d="M19 19a34 34 0 0 1 34 34" fill="none" stroke="currentColor" strokeWidth="1.75" />
                </svg>
                <h1 className="nw-title" id="nw-title" ref={titleRef} tabIndex={-1}>{t(PAGE_TITLE)}</h1>

                <dl className="nw-props">
                  <dt><Icon name="owner" />{t(PROPS.owner)}</dt>
                  <dd>
                    <span className="nw-person"><Avatar who="ines" />{PEOPLE.ines.name}</span>
                  </dd>
                  <dt><Icon name="clock" />{t(PROPS.edited)}</dt>
                  <dd>{formatDate(EDITED, lang, { day: 'numeric', month: 'long', year: 'numeric' })}{SEP[lang]}16:12</dd>
                  <dt><Icon name="tags" />{t(PROPS.tags)}</dt>
                  <dd>
                    <span className="nw-tag nw-tag--orange">{t(PROPS.start)}</span>
                    <span className="nw-tag nw-tag--blue">{t(UI.people)}</span>
                    <span className="nw-tag">{t(PROPS.ops)}</span>
                  </dd>
                  <dt><Icon name="cal" />{t(PROPS.review)}</dt>
                  <dd>{formatDate(NEXT_REVIEW, lang, { month: 'long', year: 'numeric' })}</dd>
                </dl>

                <div className="nw-callout">
                  <Icon name="pin" />
                  <p><b>{t(DOC.welcome)}</b> {t(DOC.callout)}</p>
                </div>

                <p className="nw-p">{compose(t(DOC.intro), { rules: pageRef })}</p>

                <h2 className="nw-h2">{t(DOC.week)}</h2>
                <div className="nw-has-thread">
                  <p className="nw-p">{compose(t(DOC.weekNote), { mark: <mark className="nw-mark">{t(DOC.mark)}</mark> })}</p>
                  <aside className="nw-thread" aria-label={t(THREAD.label)}>
                    <ol className="nw-msgs">
                      <li className="nw-msg">
                        <Avatar who="tomas" />
                        <div>
                          <p className="nw-who"><b>{PEOPLE.tomas.name}</b><time dateTime="2026-11-20T17:41">{fill(t(THREAD.yesterday), { time: '17:41' })}</time></p>
                          <p className="nw-msg__text">{t(THREAD.tomas)}</p>
                        </div>
                      </li>
                      <li className="nw-msg">
                        <Avatar who="anna" />
                        <div>
                          <p className="nw-who"><b>{PEOPLE.anna.name}</b><time dateTime="2026-11-20T18:02">{fill(t(THREAD.yesterday), { time: '18:02' })}</time></p>
                          <p className="nw-msg__text">{compose(t(THREAD.anna), { who: <Mention who="ines" /> })}</p>
                        </div>
                      </li>
                      {replies.map((reply, index) => (
                        <li className="nw-msg" key={index}>
                          <Avatar who="ines" />
                          <div>
                            <p className="nw-who"><b>{PEOPLE.ines.name}</b><span className="nw-time">{t(THREAD.justNow)}</span></p>
                            <p className="nw-msg__text nw-msg__text--own">{reply}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <form className="nw-reply" noValidate onSubmit={postReply}>
                      <Avatar who="ines" />
                      <div className={`nw-field${replyError ? ' is-invalid' : ''}`}>
                        <label className="nw-sr" htmlFor="nw-reply">{t(THREAD.replyLabel)}</label>
                        <textarea
                          id="nw-reply"
                          ref={replyRef}
                          rows={1}
                          value={draft}
                          placeholder={t(THREAD.placeholder)}
                          aria-invalid={replyError || undefined}
                          aria-describedby={replyError ? 'nw-reply-error' : undefined}
                          onChange={(event) => {
                            setDraft(event.target.value);
                            if (replyError) setReplyError(false);
                          }}
                          onKeyDown={onReplyKey}
                        />
                        <button type="submit" className="nw-send" aria-label={t(THREAD.send)}>
                          <span className="nw-send__dot"><Icon name="up" /></span>
                        </button>
                      </div>
                      {replyError ? <p className="nw-reply__error" id="nw-reply-error" role="alert">{t(THREAD.empty)}</p> : null}
                    </form>
                  </aside>
                </div>

                <ul className="nw-todos">
                  {TODOS.map((todo) => {
                    const done = todos[todo.id].done;
                    return (
                      <li key={todo.id} className="nw-todo">
                        <label className="nw-todo__row">
                          <input className="nw-todo__input" type="checkbox" checked={done} onChange={() => toggleTodo(todo.id)} />
                          <span className="nw-todo__box" aria-hidden="true" />
                          <span className="nw-todo__body">
                            <span className="nw-todo__t">{todo.who ? compose(t(todo.text), { who: <Mention who={todo.who} /> }) : t(todo.text)}</span>
                            <span className="nw-todo__when">{todoWhen(todo)}</span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <p className="nw-done">
                  <span className="nw-done__bar" aria-hidden="true">
                    <i style={{ width: `${(doneCount / TODOS.length) * 100}%` }} />
                  </span>
                  {fill(t(TODO_UI.count), { done: doneCount, total: TODOS.length })}
                </p>

                <div className="nw-cols">
                  <section aria-labelledby="nw-ask-title">
                    <h2 className="nw-h2" id="nw-ask-title">{t(ASK.title)}</h2>
                    <ul className="nw-people">
                      {ASK.rows.map((row) => (
                        <li key={row.who}>
                          <Avatar who={row.who} large />
                          <div>
                            <b>{PEOPLE[row.who].name}</b>
                            <span className="nw-people__role">{t(row.role)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section aria-labelledby="nw-tools-title">
                    <h2 className="nw-h2" id="nw-tools-title">{t(TOOLS.title)}</h2>
                    <ul className="nw-tools">
                      {TOOLS.rows.map((row) => (
                        <li key={row.name}>{compose(t(row.text), { name: <b>{row.name}</b>, job: <span className="nw-nowrap">HW-0412</span> })}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <h2 className="nw-h2">{t(FAQ.title)}</h2>
                <div className="nw-faq">
                  {FAQ.rows.map((row, index) => (
                    <details key={row.q.en} open={index === 0}>
                      <summary>{t(row.q)}</summary>
                      <div className="nw-faq__ans"><p>{t(row.a)}</p></div>
                    </details>
                  ))}
                </div>

                <section className="nw-db" aria-labelledby="nw-db-title">
                  <h2 className="nw-db__title" id="nw-db-title"><Icon name="db" />{t(DB.title)}</h2>
                  <div className="nw-views" role="tablist" aria-label={t(DB.views)}>
                    {VIEWS.map((item, index) => {
                      const selected = item.id === view.id;
                      return (
                        <button
                          key={item.id}
                          ref={(node) => {
                            tabRefs.current[index] = node;
                          }}
                          type="button"
                          role="tab"
                          id={`nw-tab-${item.id}`}
                          className="nw-view"
                          aria-selected={selected}
                          aria-controls="nw-view-panel"
                          tabIndex={selected ? 0 : -1}
                          onClick={() => chooseView(item)}
                          onKeyDown={(event) => onTabKey(event, index)}
                        >
                          <Icon name="table" />
                          {t(item.name)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="nw-panel" role="tabpanel" id="nw-view-panel" aria-labelledby={`nw-tab-${view.id}`} tabIndex={0}>
                    <ul className="nw-filters" aria-label={t(DB.filters)}>
                      {view.filters.map((filter) => (
                        <li key={filter.en} className="nw-filter">{t(filter)}</li>
                      ))}
                      <li className="nw-filter nw-filter--sort">{t(view.sort)}</li>
                    </ul>
                    <div className="nw-table" role="table" aria-labelledby={`nw-db-title nw-tab-${view.id}`}>
                      <div className="nw-thead" role="rowgroup">
                        <div className="nw-tr nw-tr--head" role="row">
                          <span className="nw-th" role="columnheader"><span className="nw-aa" aria-hidden="true">Aa</span>{t(DB.task)}</span>
                          <span className="nw-th" role="columnheader">{t(DB.status)}</span>
                          <span className="nw-th" role="columnheader">{t(DB.assignee)}</span>
                          <span className="nw-th" role="columnheader">{t(DB.due)}</span>
                          <span className="nw-th" role="columnheader">{t(DB.project)}</span>
                        </div>
                      </div>
                      <div role="rowgroup">
                        {rows.map((task) => (
                          <div className="nw-tr" role="row" key={task.id}>
                            <span className="nw-td nw-td--name" role="rowheader">{t(task.name)}</span>
                            <span className="nw-td" role="cell" data-label={t(DB.status)}>
                              <span className={`nw-status nw-status--${task.status}`}><i aria-hidden="true" />{t(STATUS[task.status])}</span>
                            </span>
                            <span className="nw-td" role="cell" data-label={t(DB.assignee)}>
                              <span className="nw-person"><Avatar who={task.who} />{PEOPLE[task.who].name}</span>
                            </span>
                            <span className="nw-td nw-td--due" role="cell" data-label={t(DB.due)}>{dayMonth(task.due, lang)}</span>
                            <span className="nw-td nw-td--project" role="cell" data-label={t(DB.project)}>
                              <span className="nw-ref nw-ref--plain"><Icon name="page" />{t(PROJECTS[task.project])}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="nw-db__foot">{compose(t(DB.count), { n: <b>{rows.length}</b> })}</p>
                  </div>
                </section>

                <p className="nw-p nw-end">{compose(t(DOC.end), { rules: pageRef })}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </FusionShell>
  );
}
