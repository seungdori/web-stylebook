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
  sideLabel: { en: 'Workspace pages', ko: 'Workspace pages', ja: 'Workspace pages' },
  menu: { en: 'Page list', ko: 'Page list', ja: 'Page list' },
  favourites: { en: 'Favourites', ko: 'Favourites', ja: 'Favourites' },
  studio: { en: 'Studio', ko: 'Studio', ja: 'Studio' },
  private: { en: 'Private', ko: 'Private', ja: 'Private' },
  empty: { en: 'No pages inside', ko: 'No pages inside', ja: 'No pages inside' },
  crumbs: { en: 'Breadcrumb', ko: 'Breadcrumb', ja: 'Breadcrumb' },
  people: { en: 'People', ko: 'People', ja: 'People' },
  edited: { en: 'Edited {date}', ko: 'Edited {date}', ja: 'Edited {date}' },
  favourite: { en: 'Favourite', ko: 'Favourite', ja: 'Favourite' },
  added: { en: 'Added to Favourites.', ko: 'Added to Favourites.', ja: 'Added to Favourites.' },
  removed: { en: 'Removed from Favourites.', ko: 'Removed from Favourites.', ja: 'Removed from Favourites.' },
} satisfies Record<string, Tri>;

interface TreeItem {
  id: string;
  name: Tri;
  icon: IconName;
  children?: TreeItem[];
  current?: boolean;
}

const leaf = (id: string, name: string, icon: IconName = 'page'): TreeItem => ({ id, name: { en: name, ko: name, ja: name }, icon });

const PAGE_TITLE: Tri = { en: 'Onboarding handbook', ko: 'Onboarding handbook', ja: 'Onboarding handbook' };

const STUDIO_TREE: TreeItem[] = [
  {
    id: 'rules',
    name: { en: 'Studio rules', ko: 'Studio rules', ja: 'Studio rules' },
    icon: 'page',
    children: [leaf('rules-projects', 'Running a project'), leaf('rules-leave', 'Holiday and sick days'), leaf('rules-expenses', 'Expenses')],
  },
  {
    id: 'people',
    name: UI.people,
    icon: 'page',
    children: [
      { id: 'onboarding', name: PAGE_TITLE, icon: 'door', current: true },
      leaf('directory', 'Team directory'),
      leaf('planner', 'Holiday planner', 'cal'),
    ],
  },
  { id: 'tasks', name: { en: 'Studio tasks', ko: 'Studio tasks', ja: 'Studio tasks' }, icon: 'db', children: [] },
  {
    id: 'projects',
    name: { en: 'Projects', ko: 'Projects', ja: 'Projects' },
    icon: 'page',
    children: [leaf('calder', 'Calder Bridge wayfinding'), leaf('aldgate', 'Aldgate Library signage'), leaf('northfield', 'Northfield Rail identity')],
  },
  {
    id: 'crit',
    name: { en: 'Crit notes', ko: 'Crit notes', ja: 'Crit notes' },
    icon: 'page',
    children: [leaf('crit-20', 'Crit, 20 November'), leaf('crit-13', 'Crit, 13 November'), leaf('crit-6', 'Crit, 6 November')],
  },
];

const PRIVATE_TREE: TreeItem[] = [
  {
    id: 'payroll',
    name: { en: 'Payroll runs', ko: 'Payroll runs', ja: 'Payroll runs' },
    icon: 'page',
    children: [leaf('payroll-nov', 'November 2026'), leaf('payroll-oct', 'October 2026')],
  },
  {
    id: 'suppliers',
    name: { en: 'Supplier contacts', ko: 'Supplier contacts', ja: 'Supplier contacts' },
    icon: 'page',
    children: [leaf('printers', 'Printers'), leaf('sign-makers', 'Sign makers'), leaf('couriers', 'Couriers')],
  },
];

const PROPS = {
  owner: { en: 'Owner', ko: 'Owner', ja: 'Owner' },
  edited: { en: 'Last edited', ko: 'Last edited', ja: 'Last edited' },
  tags: { en: 'Tags', ko: 'Tags', ja: 'Tags' },
  review: { en: 'Next review', ko: 'Next review', ja: 'Next review' },
  start: { en: 'Start here', ko: 'Start here', ja: 'Start here' },
  ops: { en: 'Studio ops', ko: 'Studio ops', ja: 'Studio ops' },
} satisfies Record<string, Tri>;

const DOC = {
  welcome: { en: 'Welcome, Rosa.', ko: 'Welcome, Rosa.', ja: 'Welcome, Rosa.' },
  callout: {
    en: 'You start on Monday 23 November. Come to 41 Osborne Street, second floor, at 9:30 and press the buzzer marked Hollis Ward. Ines will meet you at the door, and Tomás is your buddy for the first month.',
    ko: 'You start on Monday 23 November. Come to 41 Osborne Street, second floor, at 9:30 and press the buzzer marked Hollis Ward. Ines will meet you at the door, and Tomás is your buddy for the first month.',
    ja: 'You start on Monday 23 November. Come to 41 Osborne Street, second floor, at 9:30 and press the buzzer marked Hollis Ward. Ines will meet you at the door, and Tomás is your buddy for the first month.',
  },
  intro: {
    en: 'This page covers your first week. How we run projects, book holiday and claim expenses is in {rules}. If anything here is out of date, leave a comment and Ines will fix it.',
    ko: 'This page covers your first week. How we run projects, book holiday and claim expenses is in {rules}. If anything here is out of date, leave a comment and Ines will fix it.',
    ja: 'This page covers your first week. How we run projects, book holiday and claim expenses is in {rules}. If anything here is out of date, leave a comment and Ines will fix it.',
  },
  rules: { en: 'Studio rules', ko: 'Studio rules', ja: 'Studio rules' },
  week: { en: 'Your first week', ko: 'Your first week', ja: 'Your first week' },
  weekNote: {
    en: 'Nobody expects you to log billable hours this week. On Thursday at the 16:00 crit, {mark}. Ten minutes is plenty, and nobody brings slides.',
    ko: 'Nobody expects you to log billable hours this week. On Thursday at the 16:00 crit, {mark}. Ten minutes is plenty, and nobody brings slides.',
    ja: 'Nobody expects you to log billable hours this week. On Thursday at the 16:00 crit, {mark}. Ten minutes is plenty, and nobody brings slides.',
  },
  mark: { en: 'show us something you made before you joined', ko: 'show us something you made before you joined', ja: 'show us something you made before you joined' },
  end: {
    en: 'Read {rules} before your second week. Ines checks this page every January and after each new starter.',
    ko: 'Read {rules} before your second week. Ines checks this page every January and after each new starter.',
    ja: 'Read {rules} before your second week. Ines checks this page every January and after each new starter.',
  },
} satisfies Record<string, Tri>;

const THREAD = {
  label: { en: 'Comments', ko: 'Comments', ja: 'Comments' },
  yesterday: { en: 'Yesterday {time}', ko: 'Yesterday {time}', ja: 'Yesterday {time}' },
  justNow: { en: 'Just now', ko: 'Just now', ja: 'Just now' },
  tomas: {
    en: 'Rosa asked if this has to be client work. Can we say personal projects count too?',
    ko: 'Rosa asked if this has to be client work. Can we say personal projects count too?',
    ja: 'Rosa asked if this has to be client work. Can we say personal projects count too?',
  },
  anna: {
    en: 'Personal work is better, it tells us more. {who} can you add a line?',
    ko: 'Personal work is better, it tells us more. {who} can you add a line?',
    ja: 'Personal work is better, it tells us more. {who} can you add a line?',
  },
  replyLabel: { en: 'Reply to the comments', ko: 'Reply to the comments', ja: 'Reply to the comments' },
  placeholder: { en: 'Reply…', ko: 'Reply…', ja: 'Reply…' },
  draft: { en: 'Adding it to the Thursday line now', ko: 'Adding it to the Thursday line now', ja: 'Adding it to the Thursday line now' },
  send: { en: 'Send reply', ko: 'Send reply', ja: 'Send reply' },
  empty: { en: 'Write a reply before you send it.', ko: 'Write a reply before you send it.', ja: 'Write a reply before you send it.' },
  posted: { en: 'Reply posted.', ko: 'Reply posted.', ja: 'Reply posted.' },
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
    text: { en: 'Return the signed contract and the new starter form', ko: 'Return the signed contract and the new starter form', ja: 'Return the signed contract and the new starter form' },
    date: '2026-11-20',
    doneOn: '2026-11-14',
  },
  {
    id: 'laptop',
    text: { en: 'Choose a laptop: 14 or 16 inch MacBook Pro', ko: 'Choose a laptop: 14 or 16 inch MacBook Pro', ja: 'Choose a laptop: 14 or 16 inch MacBook Pro' },
    date: '2026-11-18',
    doneOn: '2026-11-17',
  },
  {
    id: 'bio',
    text: { en: 'Send a photo and a two-line bio for the website', ko: 'Send a photo and a two-line bio for the website', ja: 'Send a photo and a two-line bio for the website' },
    date: '2026-11-20',
    doneOn: '2026-11-19',
  },
  {
    id: 'tour',
    text: { en: 'Studio tour, keys and the alarm code with {who}', ko: 'Studio tour, keys and the alarm code with {who}', ja: 'Studio tour, keys and the alarm code with {who}' },
    who: 'ines',
    date: '2026-11-23',
    time: '10:00',
  },
  {
    id: 'accounts',
    text: { en: 'Sign in to Figma, Slack, Drive and 1Password with {who}', ko: 'Sign in to Figma, Slack, Drive and 1Password with {who}', ja: 'Sign in to Figma, Slack, Drive and 1Password with {who}' },
    who: 'felix',
    date: '2026-11-23',
    time: '14:00',
  },
  {
    id: 'call',
    text: { en: 'Listen in on the Calder Bridge client call with {who}', ko: 'Listen in on the Calder Bridge client call with {who}', ja: 'Listen in on the Calder Bridge client call with {who}' },
    who: 'lewis',
    date: '2026-11-24',
    time: '11:00',
  },
  {
    id: 'lunch',
    text: { en: 'Lunch with Anna and Kit. The studio pays.', ko: 'Lunch with Anna and Kit. The studio pays.', ja: 'Lunch with Anna and Kit. The studio pays.' },
    date: '2026-11-25',
    time: '12:30',
  },
  {
    id: 'crit',
    text: { en: 'Crit: show something from before you joined', ko: 'Crit: show something from before you joined', ja: 'Crit: show something from before you joined' },
    date: '2026-11-26',
    time: '16:00',
  },
  {
    id: 'debrief',
    text: { en: 'Half an hour with {who} on what was confusing', ko: 'Half an hour with {who} on what was confusing', ja: 'Half an hour with {who} on what was confusing' },
    who: 'tomas',
    date: '2026-11-27',
    time: '15:00',
  },
];

const TODO_UI = {
  doneOn: { en: 'Done {date}', ko: 'Done {date}', ja: 'Done {date}' },
  doneToday: { en: 'Done today', ko: 'Done today', ja: 'Done today' },
  due: { en: 'Due {date}', ko: 'Due {date}', ja: 'Due {date}' },
  count: { en: '{done} of {total} done', ko: '{done} of {total} done', ja: '{done} of {total} done' },
} satisfies Record<string, Tri>;

interface TodoState {
  done: boolean;
  doneOn: string | null;
}

const INITIAL_TODOS: Record<string, TodoState> = Object.fromEntries(
  TODOS.map((todo) => [todo.id, { done: Boolean(todo.doneOn), doneOn: todo.doneOn ?? null }]),
);

const ASK = {
  title: { en: 'Who to ask', ko: 'Who to ask', ja: 'Who to ask' },
  rows: [
    { who: 'ines', role: { en: 'Contracts, keys, payroll and holiday', ko: 'Contracts, keys, payroll and holiday', ja: 'Contracts, keys, payroll and holiday' } },
    { who: 'felix', role: { en: 'Your laptop, and any account that will not let you in', ko: 'Your laptop, and any account that will not let you in', ja: 'Your laptop, and any account that will not let you in' } },
    { who: 'tomas', role: { en: 'Your buddy, for the questions that feel too small', ko: 'Your buddy, for the questions that feel too small', ja: 'Your buddy, for the questions that feel too small' } },
    { who: 'lewis', role: { en: 'Projects, timesheets and client calls', ko: 'Projects, timesheets and client calls', ja: 'Projects, timesheets and client calls' } },
    { who: 'priya', role: { en: 'Type licences and the HW Core library', ko: 'Type licences and the HW Core library', ja: 'Type licences and the HW Core library' } },
  ] satisfies Array<{ who: PersonId; role: Tri }>,
};

const TOOLS = {
  title: { en: 'Tools', ko: 'Tools', ja: 'Tools' },
  rows: [
    { name: 'Figma', text: { en: '{name} for all design work. Start every file from the HW Core library.', ko: '{name} for all design work. Start every file from the HW Core library.', ja: '{name} for all design work. Start every file from the HW Core library.' } },
    { name: 'Slack', text: { en: '{name}: #studio for the whole team, #crit for work in progress.', ko: '{name}: #studio for the whole team, #crit for work in progress.', ja: '{name}: #studio for the whole team, #crit for work in progress.' } },
    { name: 'Google Drive', text: { en: '{name}, one folder per job, named by job number such as {job}.', ko: '{name}, one folder per job, named by job number such as {job}.', ja: '{name}, one folder per job, named by job number such as {job}.' } },
    { name: 'Harvest', text: { en: '{name} for your hours. Log the week by 17:00 on Friday.', ko: '{name} for your hours. Log the week by 17:00 on Friday.', ja: '{name} for your hours. Log the week by 17:00 on Friday.' } },
    { name: '1Password', text: { en: '{name} for shared logins. Never paste a password into Slack.', ko: '{name} for shared logins. Never paste a password into Slack.', ja: '{name} for shared logins. Never paste a password into Slack.' } },
  ] satisfies Array<{ name: string; text: Tri }>,
};

const FAQ = {
  title: { en: 'Questions from past starters', ko: 'Questions from past starters', ja: 'Questions from past starters' },
  rows: [
    {
      q: { en: 'What time do people start?', ko: 'What time do people start?', ja: 'What time do people start?' },
      a: {
        en: 'Core hours are 10:00 to 16:00. Most people arrive between 9:00 and 10:00 and leave by 18:00. On Fridays the studio closes at 16:00.',
        ko: 'Core hours are 10:00 to 16:00. Most people arrive between 9:00 and 10:00 and leave by 18:00. On Fridays the studio closes at 16:00.',
        ja: 'Core hours are 10:00 to 16:00. Most people arrive between 9:00 and 10:00 and leave by 18:00. On Fridays the studio closes at 16:00.',
      },
    },
    {
      q: { en: 'Can I work from home?', ko: 'Can I work from home?', ja: 'Can I work from home?' },
      a: {
        en: 'Tuesdays and Fridays, once your first month is over. Tell Lewis the week before if a client meeting falls on one of them.',
        ko: 'Tuesdays and Fridays, once your first month is over. Tell Lewis the week before if a client meeting falls on one of them.',
        ja: 'Tuesdays and Fridays, once your first month is over. Tell Lewis the week before if a client meeting falls on one of them.',
      },
    },
    {
      q: { en: 'How do I book holiday?', ko: 'How do I book holiday?', ja: 'How do I book holiday?' },
      a: {
        en: "Add it to the Holiday planner and tell Ines. You have 28 days including the studio's week off between Christmas and New Year.",
        ko: "Add it to the Holiday planner and tell Ines. You have 28 days including the studio's week off between Christmas and New Year.",
        ja: "Add it to the Holiday planner and tell Ines. You have 28 days including the studio's week off between Christmas and New Year.",
      },
    },
    {
      q: { en: 'What do I do if I am ill?', ko: 'What do I do if I am ill?', ja: 'What do I do if I am ill?' },
      a: {
        en: 'Message Ines before 9:30. You do not need a note for the first seven days.',
        ko: 'Message Ines before 9:30. You do not need a note for the first seven days.',
        ja: 'Message Ines before 9:30. You do not need a note for the first seven days.',
      },
    },
    {
      q: { en: 'Where can I leave my bike?', ko: 'Where can I leave my bike?', ja: 'Where can I leave my bike?' },
      a: {
        en: 'In the yard behind the building. The gate code is on the inside of the studio door.',
        ko: 'In the yard behind the building. The gate code is on the inside of the studio door.',
        ja: 'In the yard behind the building. The gate code is on the inside of the studio door.',
      },
    },
  ] satisfies Array<{ q: Tri; a: Tri }>,
};

type Status = 'done' | 'doing' | 'todo';
type ProjectId = 'studio' | 'calder' | 'aldgate' | 'northfield';

const PROJECTS: Record<ProjectId, Tri> = {
  studio: { en: 'Studio', ko: 'Studio', ja: 'Studio' },
  calder: { en: 'Calder Bridge', ko: 'Calder Bridge', ja: 'Calder Bridge' },
  aldgate: { en: 'Aldgate Library', ko: 'Aldgate Library', ja: 'Aldgate Library' },
  northfield: { en: 'Northfield Rail', ko: 'Northfield Rail', ja: 'Northfield Rail' },
};

const STATUS: Record<Status, Tri> = {
  done: { en: 'Done', ko: 'Done', ja: 'Done' },
  doing: { en: 'In progress', ko: 'In progress', ja: 'In progress' },
  todo: { en: 'Not started', ko: 'Not started', ja: 'Not started' },
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
  { id: 'setup', name: { en: 'Set up laptop and accounts', ko: 'Set up laptop and accounts', ja: 'Set up laptop and accounts' }, status: 'done', who: 'felix', due: '2026-11-23', project: 'studio', onboarding: true },
  { id: 'brief', name: { en: 'Read the Calder Bridge brief', ko: 'Read the Calder Bridge brief', ja: 'Read the Calder Bridge brief' }, status: 'doing', who: 'rosa', due: '2026-11-24', project: 'calder', onboarding: true },
  { id: 'call', name: { en: 'Client call, listening only', ko: 'Client call, listening only', ja: 'Client call, listening only' }, status: 'todo', who: 'lewis', due: '2026-11-24', project: 'calder', onboarding: true },
  { id: 'library', name: { en: 'Walk through the HW Core library', ko: 'Walk through the HW Core library', ja: 'Walk through the HW Core library' }, status: 'todo', who: 'priya', due: '2026-11-25', project: 'studio', onboarding: true },
  { id: 'signs', name: { en: 'Proof the Aldgate Library sign schedule', ko: 'Proof the Aldgate Library sign schedule', ja: 'Proof the Aldgate Library sign schedule' }, status: 'doing', who: 'anna', due: '2026-11-25', project: 'aldgate', onboarding: false },
  { id: 'crit', name: { en: 'Show past work at crit', ko: 'Show past work at crit', ja: 'Show past work at crit' }, status: 'todo', who: 'rosa', due: '2026-11-26', project: 'studio', onboarding: true },
  { id: 'invoice', name: { en: 'Send the Calder Bridge stage 2 invoice', ko: 'Send the Calder Bridge stage 2 invoice', ja: 'Send the Calder Bridge stage 2 invoice' }, status: 'todo', who: 'lewis', due: '2026-12-01', project: 'calder', onboarding: false },
  { id: 'icons', name: { en: 'Redraw the wayfinding icon set', ko: 'Redraw the wayfinding icon set', ja: 'Redraw the wayfinding icon set' }, status: 'todo', who: 'rosa', due: '2026-12-02', project: 'calder', onboarding: true },
  { id: 'licences', name: { en: "Renew the studio's type licences", ko: "Renew the studio's type licences", ja: "Renew the studio's type licences" }, status: 'doing', who: 'priya', due: '2026-12-04', project: 'studio', onboarding: false },
  { id: 'sketches', name: { en: 'First identity sketches for Northfield Rail', ko: 'First identity sketches for Northfield Rail', ja: 'First identity sketches for Northfield Rail' }, status: 'todo', who: 'kit', due: '2026-12-09', project: 'northfield', onboarding: false },
  { id: 'checkin', name: { en: 'First-month check-in', ko: 'First-month check-in', ja: 'First-month check-in' }, status: 'todo', who: 'tomas', due: '2026-12-18', project: 'studio', onboarding: true },
  { id: 'party', name: { en: 'Book the Christmas lunch', ko: 'Book the Christmas lunch', ja: 'Book the Christmas lunch' }, status: 'done', who: 'ines', due: '2026-11-20', project: 'studio', onboarding: false },
];

type ViewId = 'first-month' | 'week' | 'open';

interface View {
  id: ViewId;
  name: Tri;
  filters: Tri[];
  sort: Tri;
  keep: (task: Task) => boolean;
}

const SORT_DUE: Tri = { en: 'Sort: Due', ko: 'Sort: Due', ja: 'Sort: Due' };

const VIEWS: View[] = [
  {
    id: 'first-month',
    name: { en: "Rosa's first month", ko: "Rosa's first month", ja: "Rosa's first month" },
    filters: [
      { en: 'Tag: Onboarding', ko: 'Tag: Onboarding', ja: 'Tag: Onboarding' },
      { en: 'Due: before 1 Jan', ko: 'Due: before 1 Jan', ja: 'Due: before 1 Jan' },
    ],
    sort: SORT_DUE,
    keep: (task) => task.onboarding,
  },
  {
    id: 'week',
    name: { en: 'This week', ko: 'This week', ja: 'This week' },
    filters: [{ en: 'Due: 23 to 27 Nov', ko: 'Due: 23 to 27 Nov', ja: 'Due: 23 to 27 Nov' }],
    sort: SORT_DUE,
    keep: (task) => task.due >= '2026-11-23' && task.due <= '2026-11-27',
  },
  {
    id: 'open',
    name: { en: 'All open', ko: 'All open', ja: 'All open' },
    filters: [{ en: 'Status: not Done', ko: 'Status: not Done', ja: 'Status: not Done' }],
    sort: SORT_DUE,
    keep: (task) => task.status !== 'done',
  },
];

const DB = {
  title: { en: 'Studio tasks', ko: 'Studio tasks', ja: 'Studio tasks' },
  views: { en: 'Views', ko: 'Views', ja: 'Views' },
  filters: { en: 'Filters and sort', ko: 'Filters and sort', ja: 'Filters and sort' },
  task: { en: 'Task', ko: 'Task', ja: 'Task' },
  status: { en: 'Status', ko: 'Status', ja: 'Status' },
  assignee: { en: 'Assignee', ko: 'Assignee', ja: 'Assignee' },
  due: { en: 'Due', ko: 'Due', ja: 'Due' },
  project: { en: 'Project', ko: 'Project', ja: 'Project' },
  count: { en: 'Count {n}', ko: 'Count {n}', ja: 'Count {n}' },
  shown: { en: '{view}: {n} tasks.', ko: '{view}: {n} tasks.', ja: '{view}: {n} tasks.' },
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

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

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
    return todo.time ? `${weekdayDayMonth(todo.date, lang)}, ${todo.time}` : fill(t(TODO_UI.due), { date: dayMonth(todo.date, lang) });
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
                  <dd>{formatDate(EDITED, lang, { day: 'numeric', month: 'long', year: 'numeric' })}, 16:12</dd>
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
