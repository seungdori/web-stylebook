import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedClaymorphismPage.css';

// The product page of Pebble Maths, a counting app for children aged 4 to 7.
// Clay is the material of the child's screen only: the practice tray, the shapes to
// count, the answer tiles, the lesson stones and the one kind of button. Everything a
// parent reads is ink on white with ruled lines. Baloo 2 sets the question, the
// headings and the numerals; Andika, drawn for children learning to read, sets the text.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Clay = 'coral' | 'butter' | 'mint' | 'sky';
type Kind = 'ball' | 'block' | 'ring' | 'pebble';

const BRAND = 'Pebble Maths';

const HERO = {
  nav: { en: 'On this page', ko: '이 페이지 메뉴', ja: 'このページのメニュー' },
  lessons: { en: 'Lessons', ko: '레슨', ja: 'レッスン' },
  report: { en: 'Parent report', ko: '학부모 리포트', ja: '保護者レポート' },
  price: { en: 'Price', ko: '가격', ja: '価格' },
  title: {
    en: 'Counting and first sums for children aged 4 to 7.',
    ko: '4~7세 아이를 위한 수 세기와 첫 덧셈.',
    ja: '4〜7歳の子どものための、数の数え方と最初のたし算。',
  },
  lede: {
    en: "Pebble Maths asks one question at a time and says it out loud, so a child who can't read yet can still play. A lesson takes about ten minutes. Eight lessons go from counting to five up to adding and taking away within ten.",
    ko: 'Pebble Maths는 한 번에 한 문제씩 묻고 소리 내어 읽어 줍니다. 아직 글을 읽지 못하는 아이도 함께 할 수 있습니다. 한 레슨은 약 10분이 걸립니다. 8개 레슨에서 5까지 세기부터 10 안에서 더하기와 빼기까지 배웁니다.',
    ja: 'Pebble Mathsは一度に一問ずつ出題し、声に出して読み上げます。まだ字が読めない子どもも遊べます。1レッスンは約10分です。全8レッスンで、5までの数え方から、10までのたし算とひき算まで進みます。',
  },
  get: { en: 'Get Pebble Maths', ko: 'Pebble Maths 받기', ja: 'Pebble Mathsを入手' },
  getNote: {
    en: 'The first two lessons are free. £5.99 unlocks the rest.',
    ko: '처음 두 레슨은 무료입니다. £5.99로 나머지 레슨을 모두 열 수 있습니다.',
    ja: '最初の2レッスンは無料です。£5.99で残りのレッスンが開きます。',
  },
} satisfies Record<string, Tri>;

const PRACTICE = {
  screen: {
    en: 'A practice question, as your child sees it',
    ko: '아이 화면에 보이는 연습 문제',
    ja: 'お子さんの画面に表示される練習問題',
  },
  ask: { en: 'How many?', ko: '몇 개일까요?', ja: 'いくつ？' },
  finished: { en: 'All ten done!', ko: '10문제 모두 완료!', ja: '10問、ぜんぶ終わり！' },
  finishedBody: {
    en: 'You counted every one. See you tomorrow for the next ten.',
    ko: '모두 세었어요! 내일 다음 10문제를 해 봐요.',
    ja: 'ぜんぶ数えられたね。明日は次の10問をしよう。',
  },
  again: { en: 'Play again', ko: '다시 하기', ja: 'もう一度やる' },
  listen: { en: 'Hear the question again', ko: '문제 다시 듣기', ja: '問題をもう一度聞く' },
  noSpeech: {
    en: "This browser can't speak, so the question can't be read out loud here.",
    ko: '이 브라우저는 소리를 낼 수 없어서, 여기에서는 문제를 읽어 줄 수 없습니다.',
    ja: 'このブラウザでは音声を出せないため、ここでは問題を読み上げられません。',
  },
  answers: { en: 'Answers', ko: '답', ja: '答え' },
  right: { en: 'Yes, {n}!', ko: '맞아요, {n}!', ja: 'せいかい、{n}！' },
  wrong: { en: 'Count again.', ko: '다시 세어 보세요.', ja: 'もう一度数えてみよう。' },
  // Said by the status line when the next question comes in, before the question and the shapes.
  next: { en: 'Question {n} of 10.', ko: '10문제 중 {n}번째.', ja: '10問中{n}問目。' },
  caption: {
    en: 'Lesson 4, question {n} of 10. Count the shapes and press a number.',
    ko: '레슨 4, 10문제 중 {n}번째. 도형을 세고 숫자를 누르세요.',
    ja: 'レッスン4、10問中{n}問目。かたちを数えて、数字をおしてください。',
  },
  captionDone: {
    en: 'Lesson 4, all ten questions done for today.',
    ko: '레슨 4, 오늘 10문제를 모두 마쳤습니다.',
    ja: 'レッスン4、今日の10問をすべて終えました。',
  },
} satisfies Record<string, Tri>;

// Questions 6 to 10 of today's session. Each lists its shapes in the order the
// description reads them; the count of shapes is the right answer.
const QUESTION_DATA: Array<{ shapes: Array<[Kind, Clay]>; answers: [number, number, number]; seed: number; label: Tri }> = [
  {
    shapes: [['ball', 'coral'], ['block', 'butter'], ['ball', 'sky'], ['ring', 'mint'], ['pebble', 'coral'], ['block', 'sky'], ['ball', 'butter']],
    answers: [6, 7, 8],
    seed: 11,
    label: {
      en: 'Clay shapes on the tray: a red ball, a yellow block, a blue ball, a green ring, a long red pebble, a blue block and a yellow ball.',
      ko: '쟁반 위의 클레이 도형: 빨간 공, 노란 블록, 파란 공, 초록 고리, 긴 빨간 조약돌, 파란 블록, 노란 공.',
      ja: 'トレーの上のクレイの形: 赤いボール、黄色いブロック、青いボール、緑のリング、細長い赤い小石、青いブロック、黄色いボール。',
    },
  },
  {
    shapes: [['ring', 'sky'], ['ball', 'coral'], ['ball', 'mint'], ['block', 'butter'], ['pebble', 'sky'], ['ball', 'butter'], ['block', 'coral'], ['ball', 'sky'], ['ring', 'butter']],
    answers: [9, 10, 11],
    seed: 23,
    label: {
      en: 'Clay shapes on the tray: a blue ring, a red ball, a green ball, a yellow block, a long blue pebble, a yellow ball, a red block, a blue ball and a yellow ring.',
      ko: '쟁반 위의 클레이 도형: 파란 고리, 빨간 공, 초록 공, 노란 블록, 긴 파란 조약돌, 노란 공, 빨간 블록, 파란 공, 노란 고리.',
      ja: 'トレーの上のクレイの形: 青いリング、赤いボール、緑のボール、黄色いブロック、細長い青い小石、黄色いボール、赤いブロック、青いボール、黄色いリング。',
    },
  },
  {
    shapes: [['block', 'mint'], ['ball', 'coral'], ['pebble', 'butter'], ['ball', 'sky'], ['ring', 'coral'], ['block', 'sky'], ['ball', 'mint'], ['pebble', 'coral']],
    answers: [6, 7, 8],
    seed: 37,
    label: {
      en: 'Clay shapes on the tray: a green block, a red ball, a long yellow pebble, a blue ball, a red ring, a blue block, a green ball and a long red pebble.',
      ko: '쟁반 위의 클레이 도형: 초록 블록, 빨간 공, 긴 노란 조약돌, 파란 공, 빨간 고리, 파란 블록, 초록 공, 긴 빨간 조약돌.',
      ja: 'トレーの上のクレイの形: 緑のブロック、赤いボール、細長い黄色い小石、青いボール、赤いリング、青いブロック、緑のボール、細長い赤い小石。',
    },
  },
  {
    shapes: [['ball', 'butter'], ['ball', 'coral'], ['block', 'sky'], ['ring', 'mint'], ['ball', 'sky'], ['block', 'coral'], ['pebble', 'mint'], ['ball', 'mint'], ['block', 'butter'], ['ring', 'coral']],
    answers: [9, 10, 11],
    seed: 41,
    label: {
      en: 'Clay shapes on the tray: a yellow ball, a red ball, a blue block, a green ring, a blue ball, a red block, a long green pebble, a green ball, a yellow block and a red ring.',
      ko: '쟁반 위의 클레이 도형: 노란 공, 빨간 공, 파란 블록, 초록 고리, 파란 공, 빨간 블록, 긴 초록 조약돌, 초록 공, 노란 블록, 빨간 고리.',
      ja: 'トレーの上のクレイの形: 黄色いボール、赤いボール、青いブロック、緑のリング、青いボール、赤いブロック、細長い緑の小石、緑のボール、黄色いブロック、赤いリング。',
    },
  },
  {
    shapes: [['pebble', 'sky'], ['ball', 'coral'], ['block', 'mint'], ['ball', 'butter'], ['ring', 'sky'], ['ball', 'coral'], ['block', 'coral'], ['ball', 'sky'], ['block', 'butter']],
    answers: [7, 8, 9],
    seed: 53,
    label: {
      en: 'Clay shapes on the tray: a long blue pebble, a red ball, a green block, a yellow ball, a blue ring, a red ball, a red block, a blue ball and a yellow block.',
      ko: '쟁반 위의 클레이 도형: 긴 파란 조약돌, 빨간 공, 초록 블록, 노란 공, 파란 고리, 빨간 공, 빨간 블록, 파란 공, 노란 블록.',
      ja: 'トレーの上のクレイの形: 細長い青い小石、赤いボール、緑のブロック、黄色いボール、青いリング、赤いボール、赤いブロック、青いボール、黄色いブロック。',
    },
  },
];

// The shapes are scattered, not set on a grid, so a child has to count them one by
// one. Each shape is placed where it has the most room among the shapes already on
// the tray (best of many random tries, from a fixed seed so the page never changes).
// Sizes are in tray widths; `reach` is the radius that holds the shape at any turn,
// and `gap` the least room between two shapes, so no two ever touch.
interface Spot { x: number; y: number; s: number; r: number }
interface Tray { w: number; h: number; scale: number; gap: number }

// The trays' proportions match the aspect-ratio of .pm-set in the stylesheet.
const DESK_TRAY: Tray = { w: 100, h: 100 / 3.5, scale: 1, gap: 2 };
const PHONE_TRAY: Tray = { w: 100, h: 100 / 1.3, scale: 1.7, gap: 4 };
const SIZE: Record<Kind, [number, number]> = { ball: [10, 15], block: [10.5, 13], ring: [13.5, 16.5], pebble: [7, 8] };
const REACH: Record<Kind, number> = { ball: 0.5, ring: 0.5, block: 0.62, pebble: 1.3 };

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tryScatter(kinds: Kind[], tray: Tray, seed: number, scale: number): Spot[] | null {
  const rand = seeded(seed);
  const shrink = Math.min(1, Math.sqrt(7 / kinds.length));
  const items = kinds.map((kind, index) => {
    const [low, high] = SIZE[kind];
    const s = (low + rand() * (high - low)) * shrink * tray.scale * scale;
    const r = kind === 'block' || kind === 'pebble' ? Math.round((rand() * 2 - 1) * 16) : 0;
    return { index, kind, s, r, reach: REACH[kind] * s };
  });
  const placed: Array<{ cx: number; cy: number; reach: number }> = [];
  const spots: Spot[] = new Array<Spot>(kinds.length);
  for (const item of [...items].sort((a, b) => b.reach - a.reach)) {
    let best = { cx: tray.w / 2, cy: tray.h / 2, score: -Infinity };
    for (let k = 0; k < 200; k += 1) {
      const cx = item.reach + rand() * (tray.w - 2 * item.reach);
      const cy = item.reach + rand() * (tray.h - 2 * item.reach);
      let score = 1.5 * Math.min(cx - item.reach, tray.w - cx - item.reach, cy - item.reach, tray.h - cy - item.reach) + tray.gap;
      for (const other of placed) score = Math.min(score, Math.hypot(other.cx - cx, other.cy - cy) - other.reach - item.reach);
      if (score > best.score) best = { cx, cy, score };
    }
    if (best.score < tray.gap) return null;
    placed.push({ cx: best.cx, cy: best.cy, reach: item.reach });
    const width = item.kind === 'pebble' ? item.s * 2.5 : item.s;
    spots[item.index] = {
      x: ((best.cx - width / 2) / tray.w) * 100,
      y: ((best.cy - item.s / 2) / tray.h) * 100,
      s: item.s,
      r: item.r,
    };
  }
  return spots;
}

// When a seed leaves two shapes too close, try the next seed with every shape a little smaller.
function scatter(kinds: Kind[], tray: Tray, seed: number): Spot[] {
  for (let attempt = 0, scale = 1; attempt < 16; attempt += 1, scale *= 0.95) {
    const spots = tryScatter(kinds, tray, seed + attempt, scale);
    if (spots) return spots;
  }
  throw new Error(`No room on the tray for ${kinds.length} shapes`);
}

const QUESTIONS = QUESTION_DATA.map((question) => {
  const kinds = question.shapes.map(([kind]) => kind);
  return {
    ...question,
    count: question.shapes.length,
    desk: scatter(kinds, DESK_TRAY, question.seed),
    phone: scatter(kinds, PHONE_TRAY, question.seed + 101),
  };
});

// Today's session is ten questions; the five before these are already done.
const SESSION_LENGTH = 10;
const DONE_BEFORE = SESSION_LENGTH - QUESTIONS.length;

// A right answer stays pressed for this long before the next question comes in.
const ADVANCE_MS = 1100;

const spotStyle = (desk: Spot, phone: Spot) =>
  ({
    '--x': `${desk.x.toFixed(2)}%`,
    '--y': `${desk.y.toFixed(2)}%`,
    '--s': `${desk.s.toFixed(2)}cqw`,
    '--r': `${desk.r}deg`,
    '--mx': `${phone.x.toFixed(2)}%`,
    '--my': `${phone.y.toFixed(2)}%`,
    '--ms': `${phone.s.toFixed(2)}cqw`,
    '--mr': `${phone.r}deg`,
  }) as CSSProperties;

type LessonState = 'done' | 'today' | 'locked';

const LESSON_COPY = {
  title: { en: 'Eight lessons, in order', ko: '8개 레슨, 순서대로', ja: '全8レッスン、順番に' },
  note: {
    en: 'A lesson opens when your child gets eight questions in a row right in the one before it. Most children spend three to five days on each. Choose a lesson to see what it practises.',
    ko: '아이가 바로 앞 레슨에서 8문제를 연속으로 맞히면 다음 레슨이 열립니다. 대부분의 아이는 레슨마다 3~5일을 씁니다. 레슨을 고르면 그 레슨에서 연습하는 내용을 볼 수 있습니다.',
    ja: 'お子さんが直前のレッスンで8問続けて正解すると、次のレッスンが開きます。多くのお子さんは、1レッスンに3〜5日かけています。レッスンを選ぶと、そのレッスンで練習する内容が見られます。',
  },
  tablist: { en: 'Lessons', ko: '레슨', ja: 'レッスン' },
  lesson: { en: 'Lesson', ko: '레슨', ja: 'レッスン' },
  locked: { en: 'locked', ko: '잠김', ja: 'ロック中' },
  questions: { en: '10 questions a session', ko: '한 번에 10문제', ja: '1回10問' },
  minutes: { en: 'About {n} minutes', ko: '약 {n}분', ja: '約{n}分' },
  spoken: { en: 'Spoken in English or Welsh', ko: '영어 또는 웨일스어로 읽어 줌', ja: '英語またはウェールズ語で読み上げ' },
} satisfies Record<string, Tri>;

const LESSONS: Array<{ title: Tri; state: LessonState; clay?: Clay; mark?: Tri; status: Tri; body: Tri; minutes: number }> = [
  {
    title: { en: 'Count to 5', ko: '5까지 세기', ja: '5まで数える' },
    state: 'done',
    clay: 'coral',
    mark: { en: 'Done 2 Nov', ko: '11월 2일 완료', ja: '11月2日 完了' },
    status: { en: 'Done on 2 November, after three days.', ko: '11월 2일에 완료했습니다. 3일 걸렸습니다.', ja: '11月2日に完了。3日かかりました。' },
    body: {
      en: 'One to five things on the tray, first in a line, then in a loose group. The skill is saying one number for each thing and knowing that the last number says how many.',
      ko: '쟁반 위에 1개에서 5개까지 놓습니다. 처음에는 한 줄로, 그다음에는 느슨한 무리로 놓습니다. 핵심은 물건 하나에 수 하나를 말하고, 마지막 수가 전체 개수라는 것을 아는 것입니다.',
      ja: 'トレーに1〜5個置きます。最初は一列に、次はばらばらのまとまりで置きます。大事なのは、1つずつに1つの数を言い、最後の数が全部の数だと分かることです。',
    },
    minutes: 6,
  },
  {
    title: { en: 'Small numbers at a glance', ko: '작은 수를 한눈에', ja: '小さい数をひと目で' },
    state: 'done',
    clay: 'butter',
    mark: { en: 'Done 6 Nov', ko: '11월 6일 완료', ja: '11月6日 完了' },
    status: { en: 'Done on 6 November, after four days.', ko: '11월 6일에 완료했습니다. 4일 걸렸습니다.', ja: '11月6日に完了。4日かかりました。' },
    body: {
      en: 'Up to four dots show for two seconds and then hide. The skill is seeing how many without counting one by one, the way you read the spots on a dice.',
      ko: '점을 최대 4개까지 2초 동안 보여 준 뒤 숨깁니다. 핵심은 하나씩 세지 않고, 주사위의 눈을 보듯 몇 개인지 알아보는 것입니다.',
      ja: '点を最大4つまで2秒間表示してから隠します。1つずつ数えずに、サイコロの目を見るように何個かを見分けるのが目標です。',
    },
    minutes: 5,
  },
  {
    title: { en: 'Count to 10', ko: '10까지 세기', ja: '10まで数える' },
    state: 'done',
    clay: 'mint',
    mark: { en: 'Done 11 Nov', ko: '11월 11일 완료', ja: '11月11日 完了' },
    status: { en: 'Done on 11 November, after five days.', ko: '11월 11일에 완료했습니다. 5일 걸렸습니다.', ja: '11月11日に完了。5日かかりました。' },
    body: {
      en: 'Six to ten shapes set out in rows of five. The skill is carrying on past five without starting again from one.',
      ko: '도형 6개에서 10개를 5개씩 줄을 맞춰 놓습니다. 핵심은 5를 지나서도 1부터 다시 세지 않고 이어서 세는 것입니다.',
      ja: 'かたちを6〜10個、5個ずつの列に並べます。5を過ぎても1からやり直さず、そのまま数え続けるのが目標です。',
    },
    minutes: 8,
  },
  {
    title: { en: 'Count a mixed-up set', ko: '섞여 있는 무리 세기', ja: 'ばらばらの集まりを数える' },
    state: 'today',
    clay: 'sky',
    mark: { en: 'Today', ko: '오늘', ja: '今日' },
    status: {
      en: 'Maya is on this lesson now. Her best run so far is five right in a row; eight in a row opens lesson 5.',
      ko: 'Maya는 지금 이 레슨을 하고 있습니다. 지금까지 가장 많이 연속으로 맞힌 기록은 5문제입니다. 8문제를 연속으로 맞히면 레슨 5가 열립니다.',
      ja: 'Mayaは今このレッスンに取り組んでいます。これまでの最高記録は5問連続正解です。8問連続で正解すると、レッスン5が開きます。',
    },
    body: {
      en: 'Seven to twelve shapes are scattered across the screen in different shapes and colours. The skill is counting each one exactly once. If a shape gets counted twice, the next questions let your child tap each shape as they count, and a tapped shape sinks into the tray.',
      ko: '7개에서 12개의 도형을 모양과 색이 다르게 화면 곳곳에 흩어 놓습니다. 핵심은 도형 하나하나를 빠짐없이 한 번씩만 세는 것입니다. 같은 도형을 두 번 세면, 다음 문제부터 아이가 셀 때마다 도형을 누를 수 있습니다. 눌린 도형은 쟁반 안으로 가라앉습니다.',
      ja: 'かたちを7〜12個、形と色を変えて画面いっぱいに散らします。目標は、1つずつ必ず1回だけ数えることです。同じかたちを2回数えてしまった場合、次の問題からは数えながらかたちをタップできます。タップされたかたちはトレーの中に沈みます。',
    },
    minutes: 9,
  },
  {
    title: { en: 'One more, one less', ko: '하나 더, 하나 적게', ja: '1つ多い、1つ少ない' },
    state: 'locked',
    status: {
      en: 'Locked. It opens when Maya gets eight questions in a row right in lesson 4.',
      ko: '잠겨 있습니다. Maya가 레슨 4에서 8문제를 연속으로 맞히면 열립니다.',
      ja: 'ロック中です。Mayaがレッスン4で8問連続正解すると開きます。',
    },
    body: {
      en: 'A set of shapes, then one more rolls in or one rolls away. The skill is knowing the new number without counting the whole set again.',
      ko: '도형 한 무리가 있고, 하나가 굴러 들어오거나 굴러 나갑니다. 핵심은 전체를 다시 세지 않고 새 수를 아는 것입니다.',
      ja: 'かたちのまとまりがあり、1つ増えるか、1つ減ります。目標は、全部を数え直さずに新しい数がわかることです。',
    },
    minutes: 8,
  },
  {
    title: { en: 'More, fewer, the same', ko: '더 많음, 더 적음, 같음', ja: '多い、少ない、同じ' },
    state: 'locked',
    status: {
      en: 'Locked. It opens after eight right in a row in lesson 5.',
      ko: '잠겨 있습니다. 레슨 5에서 8문제를 연속으로 맞히면 열립니다.',
      ja: 'ロック中です。レッスン5で8問連続正解すると開きます。',
    },
    body: {
      en: 'Two trays side by side. The skill is pairing the shapes up one to one to see which tray has more, without counting either.',
      ko: '쟁반 두 개를 나란히 놓습니다. 핵심은 도형을 하나씩 짝지어 보고, 어느 쪽이 더 많은지 두 쪽 모두 세지 않고 알아내는 것입니다.',
      ja: 'トレーを2つ並べます。目標は、かたちを1対1で組み合わせて、どちらが多いかを両方数えずに見分けることです。',
    },
    minutes: 9,
  },
  {
    title: { en: 'Make 10', ko: '10 만들기', ja: '10を作る' },
    state: 'locked',
    status: {
      en: 'Locked. It opens after eight right in a row in lesson 6.',
      ko: '잠겨 있습니다. 레슨 6에서 8문제를 연속으로 맞히면 열립니다.',
      ja: 'ロック中です。レッスン6で8問連続正解すると開きます。',
    },
    body: {
      en: 'A frame of ten spaces with some already filled. The skill is saying how many more make ten, which is where adding starts.',
      ko: '빈칸이 10개인 틀에 일부가 이미 채워져 있습니다. 핵심은 10이 되려면 몇 개가 더 필요한지 말하는 것입니다. 더하기는 여기에서 시작합니다.',
      ja: '10マスの枠に、いくつか埋まっています。目標は、あと何個で10になるかを言うことです。ここからたし算が始まります。',
    },
    minutes: 9,
  },
  {
    title: { en: 'Add and take away within 10', ko: '10 안에서 더하기와 빼기', ja: '10までのたし算とひき算' },
    state: 'locked',
    status: {
      en: 'Locked. It opens after eight right in a row in lesson 7.',
      ko: '잠겨 있습니다. 레슨 7에서 8문제를 연속으로 맞히면 열립니다.',
      ja: 'ロック中です。レッスン7で8問連続正解すると開きます。',
    },
    body: {
      en: 'Two small groups join, or some shapes leave a group. The skill is saying what happened as a sum, such as 4 + 3 = 7.',
      ko: '작은 두 무리가 합쳐지거나, 무리에서 도형 일부가 빠져나갑니다. 핵심은 무슨 일이 일어났는지 4 + 3 = 7처럼 식으로 말하는 것입니다.',
      ja: '小さい2つのまとまりが合わさったり、まとまりから一部のかたちが無くなったりします。目標は、何が起きたかを4 + 3 = 7のような式で言うことです。',
    },
    minutes: 11,
  },
];

const TODAY_LESSON = LESSONS.findIndex((lesson) => lesson.state === 'today');

const REPORT = {
  title: { en: 'The parent report', ko: '학부모 리포트', ja: '保護者レポート' },
  note: {
    en: "It updates every Sunday at 6 pm in the parent area, which opens after a sum only a grown-up can do, such as 7 × 8. This is Maya's week. She is five.",
    ko: '리포트는 매주 일요일 오후 6시에 학부모 영역에서 갱신됩니다. 이 영역은 7 × 8처럼 어른만 풀 수 있는 셈을 풀면 열립니다. 이번 주는 Maya의 주간입니다. Maya는 5살입니다.',
    ja: '毎週日曜日18時に、保護者用エリアで更新されます。保護者用エリアは、7 × 8のように大人だけが解ける計算を解くと開きます。今回はMayaの1週間分です。Mayaは5歳です。',
  },
  week: { en: 'Maya, 9 to 15 November', ko: 'Maya, 11월 9일~15일', ja: 'Maya、11月9日〜15日' },
  summary: {
    en: '74 minutes over six days. 104 questions, 88 right first time.',
    ko: '6일 동안 74분. 104문제 중 88문제를 한 번에 맞혔습니다.',
    ja: '6日間で74分。104問中88問を一度で正解。',
  },
  minutesTitle: { en: 'Minutes each day', ko: '하루 학습 시간', ja: '1日の学習時間' },
  chart: { en: 'Minutes played each day', ko: '날마다 학습한 시간(분)', ja: '毎日の学習時間（分）' },
  minutesWord: { en: 'minutes', ko: '분', ja: '分' },
  limit: { en: 'Daily limit, 20 min', ko: '하루 제한 20분', ja: '1日の上限 20分' },
  limitNote: {
    en: 'On Saturday the app stopped at the daily limit of 20 minutes.',
    ko: '토요일에는 하루 제한인 20분에 도달해 앱이 멈췄습니다.',
    ja: '土曜日は1日の上限の20分に達したため、アプリが止まりました。',
  },
  skillsTitle: { en: 'Skills practised', ko: '연습한 내용', ja: '練習した内容' },
  tipLead: { en: 'One thing to try at home.', ko: '집에서 해 볼 것 하나.', ja: '家でためせること、ひとつ。' },
  tip: {
    en: 'Maya sometimes counts the same shape twice when the shapes are mixed. Put six spoons on the table and ask her to slide each one aside as she counts it.',
    ko: 'Maya는 도형이 섞여 있으면 가끔 같은 도형을 두 번 셉니다. 숟가락 6개를 식탁에 올려놓고, 하나를 셀 때마다 옆으로 밀어 보게 하세요.',
    ja: 'Mayaは、かたちが混ざっていると同じかたちを2回数えてしまうことがあります。スプーンを6本テーブルに置き、1つ数えるたびに横へずらしてもらいましょう。',
  },
} satisfies Record<string, Tri>;

const DAILY_LIMIT = 20;

const DAYS: Array<{ short: Tri; full: Tri; minutes: number }> = [
  { short: { en: 'Mon', ko: '월', ja: '月' }, full: { en: 'Monday', ko: '월요일', ja: '月曜日' }, minutes: 12 },
  { short: { en: 'Tue', ko: '화', ja: '火' }, full: { en: 'Tuesday', ko: '화요일', ja: '火曜日' }, minutes: 9 },
  { short: { en: 'Wed', ko: '수', ja: '水' }, full: { en: 'Wednesday', ko: '수요일', ja: '水曜日' }, minutes: 0 },
  { short: { en: 'Thu', ko: '목', ja: '木' }, full: { en: 'Thursday', ko: '목요일', ja: '木曜日' }, minutes: 14 },
  { short: { en: 'Fri', ko: '금', ja: '金' }, full: { en: 'Friday', ko: '금요일', ja: '金曜日' }, minutes: 11 },
  { short: { en: 'Sat', ko: '토', ja: '土' }, full: { en: 'Saturday', ko: '토요일', ja: '土曜日' }, minutes: 20 },
  { short: { en: 'Sun', ko: '일', ja: '日' }, full: { en: 'Sunday', ko: '일요일', ja: '日曜日' }, minutes: 8 },
];

const SKILLS: Array<{ name: Tri; kind: Tri; right: number; asked: number }> = [
  {
    name: { en: 'Count a mixed-up set', ko: '섞여 있는 무리 세기', ja: 'ばらばらの集まりを数える' },
    kind: { en: 'New this week', ko: '이번 주 새로 시작', ja: '今週から新しく' },
    right: 17,
    asked: 26,
  },
  {
    name: { en: 'Count to 10', ko: '10까지 세기', ja: '10まで数える' },
    kind: { en: 'Review', ko: '복습', ja: '復習' },
    right: 44,
    asked: 48,
  },
  {
    name: { en: 'Small numbers at a glance', ko: '작은 수를 한눈에', ja: '小さい数をひと目で' },
    kind: { en: 'Review', ko: '복습', ja: '復習' },
    right: 27,
    asked: 30,
  },
];

const OF = { en: '{a} of {b}', ko: '{b}번 중 {a}번 정답', ja: '{b}問中{a}問正解' } satisfies Tri;

const WITHOUT = {
  title: { en: "What Pebble Maths doesn't do", ko: 'Pebble Maths가 하지 않는 것', ja: 'Pebble Mathsがしないこと' },
  rows: [
    {
      lead: { en: 'There are no ads.', ko: '광고가 없습니다.', ja: '広告はありません。' },
      rest: {
        en: 'Nothing in the app links to a shop, a video or another app.',
        ko: '앱 안에서 쇼핑몰, 동영상, 다른 앱으로 연결되는 곳은 없습니다.',
        ja: 'アプリ内に、ショップ・動画・他のアプリへのリンクはありません。',
      },
    },
    {
      lead: { en: 'There is nothing to buy inside it.', ko: '앱 안에서 따로 살 것은 없습니다.', ja: 'アプリ内で追加購入するものはありません。' },
      rest: {
        en: 'One payment unlocks all eight lessons and any lesson we add later.',
        ko: '한 번 결제하면 8개 레슨과 앞으로 추가되는 레슨을 모두 쓸 수 있습니다.',
        ja: '1回のお支払いで、全8レッスンと、今後追加されるレッスンすべてが使えます。',
      },
    },
    {
      lead: {
        en: 'It does not need a connection after the first download.',
        ko: '처음 내려받은 뒤에는 인터넷 연결이 필요하지 않습니다.',
        ja: '最初のダウンロードの後は、インターネット接続が要りません。',
      },
      rest: {
        en: 'Lessons are stored on the device, so it runs on a train or a plane. The report catches up the next time you are online.',
        ko: '레슨은 기기에 저장되어 있어 기차나 비행기 안에서도 쓸 수 있습니다. 리포트는 다음에 온라인이 되면 반영됩니다.',
        ja: 'レッスンは端末に保存されるので、電車や飛行機の中でも使えます。レポートは次にオンラインになったときに反映されます。',
      },
    },
  ],
};

const PRICE = '£5.99';

const BUY = {
  once: { en: 'once', ko: '1회', ja: '1回' },
  body: {
    en: 'Lessons 1 and 2 are free to try. One purchase covers up to three children on every phone and tablet in the family.',
    ko: '레슨 1과 2는 무료로 체험할 수 있습니다. 한 번 구매하면 가족의 모든 휴대폰과 태블릿에서 최대 세 아이가 함께 쓸 수 있습니다.',
    ja: 'レッスン1と2は無料で試せます。1回の購入で、家族のすべてのスマートフォンとタブレットで、最大3人のお子さんが使えます。',
  },
  devices: { en: 'Devices and download', ko: '기기와 다운로드', ja: '対応機種とダウンロード' },
  sendTitle: { en: 'Get the link on your phone', ko: '휴대폰에서 링크 받기', ja: 'スマートフォンでリンクを受け取る' },
  sendBody: {
    en: 'Reading this on a computer? We email you one link that opens Pebble Maths in the App Store or Google Play, whichever the phone uses. Nothing is sent after it.',
    ko: '컴퓨터에서 보고 계신가요? 휴대폰 기종에 맞는 App Store 또는 Google Play에서 Pebble Maths를 여는 링크를 하나 이메일로 보내 드립니다. 이후에는 아무것도 보내지 않습니다.',
    ja: 'パソコンで見ていますか？ お使いのスマートフォンに合わせて、App StoreかGoogle PlayでPebble Mathsを開けるリンクを1つ、メールでお送りします。その後は何も送りません。',
  },
  label: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  submit: { en: 'Email me the link', ko: '링크를 이메일로 받기', ja: 'リンクをメールで受け取る' },
  error: {
    en: 'Enter an email address with an @ and a domain, such as name@example.com.',
    ko: '@와 도메인이 포함된 이메일 주소를 입력하세요. 예: name@example.com',
    ja: '@とドメインを含むメールアドレスを入力してください。例: name@example.com',
  },
  done: {
    en: 'Sent to {email}. Open it on the phone or tablet your child will use.',
    ko: '{email} 주소로 보냈습니다. 아이가 사용할 휴대폰이나 태블릿에서 여세요.',
    ja: '{email}に送信しました。お子さんが使うスマートフォンかタブレットで開いてください。',
  },
} satisfies Record<string, Tri>;

const DEVICES: Array<[Tri, Tri]> = [
  [
    { en: 'iPad and iPhone', ko: 'iPad 및 iPhone', ja: 'iPadとiPhone' },
    { en: 'iOS 16 or later', ko: 'iOS 16 이상', ja: 'iOS 16以降' },
  ],
  [
    { en: 'Android tablets and phones', ko: '안드로이드 태블릿과 휴대폰', ja: 'Androidのタブレットとスマートフォン' },
    { en: 'Android 10 or later', ko: 'Android 10 이상', ja: 'Android 10以降' },
  ],
  [
    { en: 'Download size', ko: '다운로드 용량', ja: 'ダウンロード容量' },
    { en: '180 MB, nothing more after that', ko: '180MB, 이후 추가 다운로드 없음', ja: '180MB、以降の追加ダウンロードなし' },
  ],
  [
    { en: 'Languages', ko: '지원 언어', ja: '対応言語' },
    { en: 'English and Welsh', ko: '영어와 웨일스어', ja: '英語とウェールズ語' },
  ],
];

const FOOTER = {
  made: {
    en: 'Pebble Maths is made in Cardiff by two primary school teachers and one developer.',
    ko: 'Pebble Maths는 카디프에서 초등학교 교사 2명과 개발자 1명이 만들었습니다.',
    ja: 'Pebble Mathsは、カーディフの小学校教師2名と開発者1名が制作しています。',
  },
  email: 'hello@pebblemaths.app',
};

const PROMPT_EN = `Design one real page in Claymorphism style: the product page of a counting app for children aged 4 to 7, where soft clay is the material of the things a child touches and nothing else.

Pick a believable subject a young child plays with, such as a maths or reading app or a toy maker, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #fdfdfd
--surface: #ffffff
--ink: #414a52
--muted: #5d646b
--line: rgba(65, 74, 82, 0.34)
--edge: rgba(65, 74, 82, 0.3)
--tray: #f0f1f3
--dent: #e9ebee
Clay colours, each as base / highlight / shade:
coral #ff8b7e / #ffc2ba / #e0706a
butter #ffd166 / #ffe8a8 / #e2ae3c
mint #7edbb0 / #c2f3dc / #4fbb8b
sky #a2c2ff / #d2e2ff / #7ba6f0
No other colours, except: the field edge #8a9096, the placeholder #6b7279 and the error text #b23b33; white clay shading from #ffffff to #f4f5f7 and dark clay from #59636c to the ink; the under-edges #d2d6db (white clay) and #2a3036 (dark clay); the pressed tiles' tints, #c8f2de to #b3ebd2 over #93d3b6 when right and #ffe1dd to #ffd3cd over #f2b3ab for "Count again"; the daily limit's dashed line in ink at 62%; white highlights, and shadows tinted with the ink or with a shape's own shade.

WHERE THE CLAY GOES:
- Only on the child's screen and the things a child touches: the practice tray, the shapes to count, the progress dots, the answer tiles, the lesson stones, the one kind of button, and the small pebble beside the app's name.
- A shape is a gradient from highlight through base to shade (radial on balls and rings, angled on blocks and pebbles), with a white highlight at the top left, an inner shade at the bottom right and a drop shadow tinted with its own shade.
- The tray is pressed in: 46px radius (32px on phones), 1.5px edge, inset 0 12px 24px -10px rgba(65, 74, 82, 0.2).
- An answer tile is white clay with an 8px solid under-edge (#d2d6db; 6px on phones). Pressed, it sinks 7px (5px on phones) and turns pale mint for a right answer or pale coral for "Count again".
- Everything a parent reads (the report, the lists, the prices) is ink on white with ruled lines. No clay there.

TYPOGRAPHY:
Display: Baloo 2 800 for the question, the app's name, the headline, section headings, the lesson numbers and the price; 700 for small headings, lesson names, the answer numbers, the chart's figures, the answer's word under the tiles and the buttons.
Question clamp(2.75rem, 6.4vw, 4.75rem), line-height 1. Headline clamp(2.6rem, 6.2vw, 5rem), line-height 1, tracking -0.025em. Section headings clamp(2.1rem, 4vw, 3.125rem). Price clamp(4.5rem, 10vw, 8rem).
Body: Andika 400 and 700, 1.0625rem, line-height 1.6. Andika was drawn for children learning to read, so the parent reads the same letters the child sees.
No other families. Nothing under 16px.

LAYOUT:
- Hero: the practice screen as the child sees it (progress dots, the question and a round "hear it again" button in one row on wide screens, with the question on its own line under them on narrower ones and when the longer "All ten done!" replaces it; seven to ten loose shapes; three answer tiles), sized so the tiles sit above the fold of a 1280x800 laptop; the headline across the column under it, then the lede beside the main button.
- Lesson path: eight stepping stones over a pressed groove. Done stones are clay, locked stones are dents. The chosen lesson opens in one panel under the row, with a caret under its stone. Below 980px the stones stand in a column, with the panel beside them on tablets and under them on phones.
- Parent report as a ruled sheet: minutes per day as a bar chart with a dashed daily limit, skills with thin meters, one tip.
- What the app leaves out: three sentences on rules.
- The price at display size beside a ruled list of devices; a one-field form that emails the download link.
- Max width about 1120px, 144px between sections (112px below 980px, 96px on phones).

COMPONENTS:
- Progress dots: done ones are mint clay ringed 2px in ink, the current one is white and larger, ringed 3px in ink, the rest are dents.
- One kind of button: a thick key of dark clay, linear-gradient(180deg, #59636c, #414a52 72%), 18px radius, 58px tall, a 5px solid under-edge (#2a3036); it goes down 4px when pressed.
- Answer tiles are real buttons: a right answer moves on to the next question, a wrong one says "Count again" and lets the child try again.
- Lesson stones are tabs: arrow keys, Home and End move between them; one labelled panel; a locked lesson says why.
- A form field is a dent: tray fill, inset shadow, 18px radius, an edge dark enough to read as a field, the label above and the error under it.

MOTION:
- Tiles, keys and the listen button sink in 80ms when pressed, and a tile rises 2px under the pointer. A chosen stone lifts 8px and grows 8% over 0.16s (a hovered one lifts 4px), and the caret under the row slides to it over 0.2s; in the column of stones the chosen one grows 4% and a hovered one moves 3px to the right.
- On phones, choosing a stone scrolls its panel into view, smoothly.
- No floating, bouncing or looping animation.
- prefers-reduced-motion removes the transitions and makes the scroll instant.

FORBIDDEN:
- Clay on the parent's reading surfaces: no puffy section boxes, no clay cards
- Pills, pastel gradients across the page background, glossy blobs as decoration
- Cards in a grid, labels above headings, all-caps tracked labels
- Emoji, mascots and drawn characters
- Grey-on-grey surfaces with no visible edge

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) A playable practice question, keyboard tabs, visible focus, a validated form and reduced-motion support`;

const PROMPT_KO = `Claymorphism 스타일로 실제 페이지 하나를 디자인한다. 4~7세 아이를 위한 수 세기 앱의 제품 페이지이며, 부드러운 클레이는 아이가 만지는 것의 재료로만 쓴다.

어린아이가 가지고 노는 그럴듯한 주제를 하나 고르고, 그 실제 내용을 쓴다. 수학이나 읽기 앱, 장난감 회사 등이 예다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체를 설명하는 페이지처럼 보이면 안 된다.

COLOR TOKENS:
--bg: #fdfdfd
--surface: #ffffff
--ink: #414a52
--muted: #5d646b
--line: rgba(65, 74, 82, 0.34)
--edge: rgba(65, 74, 82, 0.3)
--tray: #f0f1f3
--dent: #e9ebee
클레이 색상, 각각 기본 / 밝은 면 / 어두운 면:
coral #ff8b7e / #ffc2ba / #e0706a
butter #ffd166 / #ffe8a8 / #e2ae3c
mint #7edbb0 / #c2f3dc / #4fbb8b
sky #a2c2ff / #d2e2ff / #7ba6f0
다른 색은 쓰지 않는다. 예외: 입력란 가장자리 #8a9096, 자리표시자 #6b7279, 오류 글자 #b23b33. 흰 클레이 음영은 #ffffff에서 #f4f5f7까지, 어두운 클레이는 #59636c에서 잉크색까지. 아래쪽 가장자리는 #d2d6db(흰 클레이)와 #2a3036(어두운 클레이). 눌린 타일의 색조는 정답이면 #93d3b6 위의 #c8f2de에서 #b3ebd2, "다시 세어 보세요"이면 #f2b3ab 위의 #ffe1dd에서 #ffd3cd. 하루 제한선의 점선은 잉크색 62%. 흰 하이라이트, 그리고 잉크색이나 도형 자신의 어두운 면색으로 물든 그림자.

WHERE THE CLAY GOES:
- 아이 화면에만 쓴다: 연습 쟁반, 세어야 할 도형, 진행 점, 답 타일, 레슨 돌, 버튼 한 종류, 앱 이름 옆의 작은 조약돌.
- 도형은 밝은 면에서 기본색을 거쳐 어두운 면으로 가는 그라데이션이다(공과 고리는 방사형, 블록과 조약돌은 비스듬히). 왼쪽 위에 흰 하이라이트, 오른쪽 아래에 안쪽 그림자, 자기 어두운 면색으로 물든 드롭 섀도를 준다.
- 쟁반은 안으로 눌린 모양이다: 반지름 46px(휴대폰에서는 32px), 가장자리 1.5px, inset 0 12px 24px -10px rgba(65, 74, 82, 0.2).
- 답 타일은 흰 클레이이며, 아래쪽에 8px 단색 테두리(#d2d6db, 휴대폰에서는 6px)가 있다. 눌리면 7px(휴대폰에서는 5px) 가라앉고, 정답이면 연한 민트색, "다시 세어 보세요"이면 연한 코랄색으로 바뀐다.
- 보호자가 읽는 내용(리포트, 목록, 가격)은 모두 흰 바탕에 줄 쳐진 잉크 글씨다. 여기에는 클레이를 쓰지 않는다.

TYPOGRAPHY:
디스플레이: 질문, 앱 이름, 제목, 섹션 제목, 레슨 번호, 가격에는 Baloo 2 800. 작은 제목, 레슨 이름, 답 숫자, 차트 수치, 타일 아래의 답 단어, 버튼에는 700.
질문 clamp(2.75rem, 6.4vw, 4.75rem), line-height 1. 제목 clamp(2.6rem, 6.2vw, 5rem), line-height 1, 자간 -0.025em. 섹션 제목 clamp(2.1rem, 4vw, 3.125rem). 가격 clamp(4.5rem, 10vw, 8rem).
본문: Andika 400과 700, 1.0625rem, line-height 1.6. Andika는 글을 배우는 아이를 위해 그려진 서체이므로, 보호자도 아이가 보는 것과 같은 글자를 읽는다.
다른 서체는 쓰지 않는다. 16px보다 작은 글자는 쓰지 않는다.

LAYOUT:
- 히어로: 아이가 보는 연습 화면(진행 점, 질문, 둥근 "다시 듣기" 버튼. 넓은 화면에서는 한 줄에 두고, 좁은 화면이나 더 긴 "10문제 모두 완료!"가 질문을 대신할 때는 질문을 그 아래 줄에 둔다. 흩어진 도형 7~10개, 답 타일 3개). 1280x800 노트북에서 타일이 첫 화면에 보이도록 크기를 잡는다. 그 아래 열에 제목을 가로로 두고, 주요 버튼 옆에 도입 문단을 둔다.
- 레슨 경로: 눌린 홈 위에 놓인 징검다리 8개. 완료한 돌은 클레이, 잠긴 돌은 움푹 들어간 모양이다. 선택한 레슨은 줄 아래의 패널 하나로 열리고, 그 돌 아래에 꺾쇠(캐럿)를 둔다. 980px 아래에서는 돌을 세로 열로 세우며, 태블릿에서는 패널을 옆에, 휴대폰에서는 아래에 둔다.
- 보호자 리포트는 줄 쳐진 시트로 만든다: 하루 학습 시간은 점선 일일 제한선이 있는 막대그래프로, 기술은 얇은 게이지로, 팁은 하나만 쓴다.
- 앱에서 뺀 것: 규칙에 관한 문장 세 개.
- 가격은 디스플레이 크기로, 기기 목록 옆에 둔다. 다운로드 링크를 이메일로 보내는 입력란 하나짜리 양식을 둔다.
- 최대 너비 약 1120px, 섹션 사이 간격 144px(980px 아래에서는 112px, 휴대폰에서는 96px).

COMPONENTS:
- 진행 점: 완료한 점은 2px 잉크색 테두리가 있는 민트 클레이, 현재 점은 더 크고 흰색이며 3px 잉크색 테두리, 나머지는 움푹 들어간 모양이다.
- 버튼은 한 종류: 진한 클레이 키, linear-gradient(180deg, #59636c, #414a52 72%), 반지름 18px, 높이 58px, 아래쪽 5px 단색 테두리(#2a3036). 눌리면 4px 내려간다.
- 답 타일은 실제 버튼이다: 정답이면 다음 문제로 넘어가고, 오답이면 "다시 세어 보세요"라고 표시해 아이가 다시 해 볼 수 있게 한다.
- 레슨 돌은 탭이다: 화살표 키, Home, End로 이동한다. 라벨이 붙은 패널은 하나이며, 잠긴 레슨은 그 이유를 표시한다.
- 입력란은 움푹 들어간 모양이다: 쟁반 색 채움, 안쪽 그림자, 반지름 18px, 입력란으로 읽힐 만큼 진한 테두리. 라벨은 위에, 오류 메시지는 아래에 둔다.

MOTION:
- 타일, 키, 듣기 버튼은 누르면 80ms 동안 가라앉고, 타일은 포인터 아래에서 2px 떠오른다. 선택한 돌은 0.16초 동안 8px 떠오르며 8% 커진다(마우스를 올린 돌은 4px 떠오른다). 줄 아래의 캐럿은 0.2초 동안 그 돌까지 미끄러진다. 돌을 세로 열로 놓았을 때는 선택한 돌이 4% 커지고, 마우스를 올린 돌은 오른쪽으로 3px 움직인다.
- 휴대폰에서는 돌을 고르면 그 패널이 보이도록 부드럽게 스크롤한다.
- 떠다니거나, 튀거나, 반복되는 애니메이션은 쓰지 않는다.
- prefers-reduced-motion일 때는 전환 효과를 없애고, 스크롤은 즉시 이동하게 한다.

FORBIDDEN:
- 보호자가 읽는 면에 클레이 사용 금지: 부풀린 섹션 상자, 클레이 카드.
- 알약 모양 버튼, 페이지 배경 전체에 걸친 파스텔 그라데이션, 장식으로 쓰는 광택 덩어리 금지.
- 격자형 카드, 제목 위의 라벨, 모두 대문자이며 자간을 넓힌 라벨 금지.
- 이모지, 마스코트, 그려 넣은 캐릭터 금지.
- 테두리가 보이지 않는 회색 위의 회색 면 금지.

OUTPUT:
1) CSS 커스텀 속성
2) 의미에 맞는 HTML과 CSS
3) 320px까지 반응형 레이아웃, 가로 스크롤 없음
4) 실제로 풀 수 있는 연습 문제, 키보드 탭, 보이는 포커스, 검증된 양식, reduced-motion 지원`;

const PROMPT_JA = `Claymorphismスタイルで、実在するページを1枚デザインする。4〜7歳の子ども向けの数え方アプリの製品ページで、やわらかいクレイは子どもが触れるものだけの素材である。

幼い子どもが遊ぶ、現実味のある題材を1つ選び、その実際の内容を書く。算数や読み書きのアプリ、おもちゃメーカーなどが例である。ページはその題材のページとして読めなければならず、デザインスタイルについてのページであってはならない。

COLOR TOKENS:
--bg: #fdfdfd
--surface: #ffffff
--ink: #414a52
--muted: #5d646b
--line: rgba(65, 74, 82, 0.34)
--edge: rgba(65, 74, 82, 0.3)
--tray: #f0f1f3
--dent: #e9ebee
クレイの色。それぞれ 基本色 / ハイライト / シェード:
coral #ff8b7e / #ffc2ba / #e0706a
butter #ffd166 / #ffe8a8 / #e2ae3c
mint #7edbb0 / #c2f3dc / #4fbb8b
sky #a2c2ff / #d2e2ff / #7ba6f0
ほかの色は使わない。例外: フィールドの縁 #8a9096、プレースホルダー #6b7279、エラー文字 #b23b33。白いクレイの陰影は #ffffff から #f4f5f7、暗いクレイは #59636c からインク色まで。下側の縁は #d2d6db(白いクレイ)と #2a3036(暗いクレイ)。押されたタイルの色合いは、正解なら #93d3b6 の上の #c8f2de から #b3ebd2、「もう一度数えてみよう」なら #f2b3ab の上の #ffe1dd から #ffd3cd。1日の上限の点線はインク色の62%。白いハイライト、インク色または形自身のシェード色で色づけした影。

WHERE THE CLAY GOES:
- 子どもの画面と、子どもが触れるものだけに使う: 練習のトレー、数える形、進捗の点、答えのタイル、レッスンの石、ボタン1種類、アプリ名の横の小さな小石。
- 形は、ハイライトから基本色、シェードへ向かうグラデーション(球と輪は放射状、ブロックと小石は斜め)。左上に白いハイライト、右下に内側のシェード、自身のシェード色で色づけしたドロップシャドウを付ける。
- トレーは内側にへこませる: 角丸46px(スマートフォンでは32px)、縁1.5px、inset 0 12px 24px -10px rgba(65, 74, 82, 0.2)。
- 答えのタイルは白いクレイで、下側に8pxの単色の縁(#d2d6db、スマートフォンでは6px)を持つ。押すと7px(スマートフォンでは5px)沈み、正解なら淡いミント色、「もう一度数えてみよう」なら淡いコーラル色になる。
- 保護者が読むもの(レポート、一覧、価格)はすべて、白地に罫線の入ったインク色で表示する。ここにはクレイを使わない。

TYPOGRAPHY:
ディスプレイ: 質問、アプリ名、見出し、セクション見出し、レッスン番号、価格にはBaloo 2 800。小さい見出し、レッスン名、答えの数字、グラフの数値、タイル下の答えの語、ボタンには700。
質問 clamp(2.75rem, 6.4vw, 4.75rem)、line-height 1。見出し clamp(2.6rem, 6.2vw, 5rem)、line-height 1、字間 -0.025em。セクション見出し clamp(2.1rem, 4vw, 3.125rem)。価格 clamp(4.5rem, 10vw, 8rem)。
本文: Andika 400と700、1.0625rem、line-height 1.6。Andikaは文字を覚え始めた子ども向けに描かれた書体であり、保護者も子どもが見るのと同じ文字を読む。
ほかの書体は使わない。16px未満の文字は使わない。

LAYOUT:
- ヒーロー: 子どもが見る練習画面(進捗の点、質問、丸い「もう一度聞く」ボタン。広い画面では1行に並べ、狭い画面や長い「10問、ぜんぶ終わり！」が質問に代わるときは、質問を下の行に置く。ばらばらのかたち7〜10個、答えのタイル3つ)。1280x800のノートパソコンで、タイルが最初の画面に収まる大きさにする。その下の列に見出しを横長に置き、メインボタンの横にリード文を置く。
- レッスンの道: 凹んだ溝の上に8つの飛び石を並べる。完了した石はクレイ、ロック中の石はくぼみ。選んだレッスンは列の下のパネル1つに開き、その石の下に山形の印を置く。980px未満では石を縦に並べ、タブレットではパネルを横に、スマートフォンでは下に置く。
- 保護者レポートは罫線付きのシートにする: 1日の学習時間は点線の上限線つきの棒グラフ、スキルは細いメーター、ヒントは1つ。
- アプリがしないこと: ルールについての文3つ。
- 価格はディスプレイサイズで、罫線付きの対応機種一覧の横に置く。ダウンロードリンクをメールで送る、入力欄1つのフォーム。
- 最大幅は約1120px、セクション間は144px(980px未満では112px、スマートフォンでは96px)。

COMPONENTS:
- 進捗の点: 完了した点は2pxのインク色の縁があるミント色のクレイ、現在の点は白く大きめで3pxのインク色の縁、残りはくぼみ。
- ボタンは1種類: 濃いクレイの厚いキー、linear-gradient(180deg, #59636c, #414a52 72%)、角丸18px、高さ58px、下側に5pxの単色の縁(#2a3036)。押すと4px下がる。
- 答えのタイルは本物のボタン: 正解なら次の問題へ進み、不正解なら「もう一度数えてみよう」と表示して、子どもがもう一度挑戦できるようにする。
- レッスンの石はタブ: 矢印キー、HomeとEndで移動する。ラベル付きのパネルは1つ。ロック中のレッスンは、その理由を表示する。
- 入力欄はくぼんだ形: トレーと同じ塗り、内側の影、角丸18px、入力欄と分かる濃さの縁。ラベルは上、エラーは下に置く。

MOTION:
- タイル、キー、聞くボタンは押すと80msで沈み、タイルはポインターの下で2px持ち上がる。選んだ石は0.16秒で8px持ち上がり、8%大きくなる(ホバー中の石は4px持ち上がる)。列の下のキャレットは0.2秒かけてその石まで滑る。石を縦に並べたときは、選んだ石が4%大きくなり、ホバー中の石は右へ3px動く。
- スマートフォンでは、石を選ぶとそのパネルが見えるよう滑らかにスクロールする。
- 浮遊、跳ね、繰り返しのアニメーションは使わない。
- prefers-reduced-motionのときは、トランジションを削除し、スクロールは即座に行う。

FORBIDDEN:
- 保護者が読む面にクレイを使わない: ふくらませたセクションの箱、クレイのカードは禁止。
- ピル型のボタン、ページ背景全体のパステルグラデーション、装飾としての光沢のある塊は禁止。
- 格子状のカード、見出しの上のラベル、すべて大文字で字間を広げたラベルは禁止。
- 絵文字、マスコット、描いたキャラクターは禁止。
- 縁が見えない灰色の上の灰色の面は禁止。

OUTPUT:
1) CSS カスタムプロパティ
2) 意味に合ったHTMLとCSS
3) 320pxまで対応するレスポンシブレイアウト。横スクロールなし
4) 実際に解ける練習問題、キーボードのタブ、見えるフォーカス、検証されたフォーム、reduced-motionへの対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const SPEECH_LANG: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };

// Speech support never changes while the page is open, so there is nothing to subscribe to.
const subscribeNever = () => () => {};
const readCanSpeak = () => typeof window.speechSynthesis?.speak === 'function' && typeof window.SpeechSynthesisUtterance === 'function';
const readCanSpeakOnServer = () => true;

type FormState = 'idle' | 'error' | 'done';

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

export function PortedClaymorphismPage({ lang }: PortedStylePageProps) {
  const t = (text: Tri) => text[lang];

  // Practice: `step` is the index of the question on the tray; past the last one, the session is done.
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<{ value: number; right: boolean } | null>(null);
  // True once a right answer has brought in the next question, until the child answers it.
  const [advanced, setAdvanced] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const canSpeak = useSyncExternalStore(subscribeNever, readCanSpeak, readCanSpeakOnServer);
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const finishRef = useRef<HTMLParagraphElement>(null);
  const restartRef = useRef(false);

  const [selected, setSelected] = useState(TODAY_LESSON);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const doneRef = useRef<HTMLParagraphElement>(null);

  const finished = step >= QUESTIONS.length;
  const question = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
  const doneCount = DONE_BEFORE + step;
  const ask = finished ? PRACTICE.finished : PRACTICE.ask;

  // A right answer stays pressed for a moment, then the next question comes in. The
  // page times this, not an animation: reduced motion cuts animations short.
  useEffect(() => {
    if (!pick?.right) return undefined;
    const timer = window.setTimeout(() => {
      setPick(null);
      setAdvanced(true);
      setStep((current) => current + 1);
    }, ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [pick]);

  // The answer tiles leave when the session ends: focus goes to the message that
  // replaces them. Playing again brings the tiles back and focus to the first one.
  useEffect(() => {
    if (step >= QUESTIONS.length) {
      finishRef.current?.focus();
    } else if (step === 0 && restartRef.current) {
      restartRef.current = false;
      tileRefs.current[0]?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (formState === 'done') doneRef.current?.focus();
  }, [formState]);

  useEffect(() => () => {
    if (typeof window.speechSynthesis?.cancel === 'function') window.speechSynthesis.cancel();
  }, []);

  // Speech can end without an end event in some browsers; the button lets go after a while anyway.
  useEffect(() => {
    if (!speaking) return undefined;
    const timer = window.setTimeout(() => setSpeaking(false), 6000);
    return () => window.clearTimeout(timer);
  }, [speaking]);

  const answer = (value: number) => {
    if (pick?.right) return;
    setAdvanced(false);
    setPick({ value, right: value === question.count });
  };

  const playAgain = () => {
    restartRef.current = true;
    setAdvanced(false);
    setPick(null);
    setStep(0);
  };

  const speak = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new window.SpeechSynthesisUtterance(t(ask));
    utterance.lang = SPEECH_LANG[lang];
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utterance);
  };

  const feedback = pick ? (pick.right ? fill(t(PRACTICE.right), { n: pick.value }) : t(PRACTICE.wrong)) : '';
  // Focus stays on the tile when the next question comes in, so the status line says it.
  const nextSaid = advanced && !finished
    ? `${fill(t(PRACTICE.next), { n: DONE_BEFORE + step + 1 })} ${t(PRACTICE.ask)} ${t(question.label)}`
    : '';

  // On a phone the panel sits under all eight stones. After a tap or an arrow key the
  // page scrolls once to show the panel. After an arrow key the chosen stone has focus,
  // so the scroll stops short of taking it off the screen.
  const isPhone = () => window.matchMedia('(max-width: 720px)').matches;

  const revealPanel = (index: number, keepTab: boolean) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.requestAnimationFrame(() => {
      const panel = panelRef.current?.getBoundingClientRect();
      const tab = tabRefs.current[index]?.getBoundingClientRect();
      if (!panel || !tab) return;
      // The fixed back link holds the top 64px (the page's scroll-padding-top).
      const top = 64 + 8;
      const bottom = window.innerHeight - 16;
      let by = Math.min(Math.max(0, panel.bottom - bottom), panel.top - top);
      if (keepTab) by = Math.min(Math.max(by, tab.bottom - bottom), tab.top - top);
      if (by !== 0) window.scrollBy({ top: by, behavior: reduce ? 'instant' : 'smooth' });
    });
  };

  const chooseLesson = (index: number, byKey = false) => {
    setSelected(index);
    if (isPhone()) revealPanel(index, byKey);
  };

  const handleTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = LESSONS.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = selected === last ? 0 : selected + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = selected === 0 ? last : selected - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    // On a phone revealPanel does the one scroll; the focus scroll would race it.
    tabRefs.current[next]?.focus({ preventScroll: isPhone() });
    chooseLesson(next, true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'done' : 'error');
  };

  const lesson = LESSONS[selected];

  return (
    <FusionShell
      fusionId="claymorphism"
      lang={lang}
      tone="light"
      accent="#414a52"
      prev={{ href: '/pages/framer-motion.html', label: 'Framer Motion' }}
      next={{ href: '/pages/neumorphism.html', label: 'Neumorphism' }}
      prompts={PROMPTS}
    >
      <div className="pm">
        <section className="pm-hero" aria-labelledby="pm-title">
          <header className="pm-top">
            <p className="pm-brand"><i className="pm-coral" aria-hidden="true" />{BRAND}</p>
            <nav className="pm-top__nav" aria-label={t(HERO.nav)}>
              <a href="#pm-lessons">{t(HERO.lessons)}</a>
              <a href="#pm-report">{t(HERO.report)}</a>
              <a href="#pm-price">{t(HERO.price)}</a>
            </nav>
          </header>

          <div className="pm-screen" role="group" aria-label={t(PRACTICE.screen)}>
            <div className={finished ? 'pm-screen__bar is-done' : 'pm-screen__bar'}>
              <ol className="pm-progress pm-mint" aria-hidden="true">
                {Array.from({ length: SESSION_LENGTH }, (_, index) => (
                  <li key={index} className={index < doneCount ? 'is-done' : index === doneCount ? 'is-now' : undefined} />
                ))}
              </ol>
              <p className="pm-ask">{t(ask)}</p>
              <button
                className={`pm-listen${speaking ? ' is-speaking' : ''}`}
                type="button"
                aria-label={t(PRACTICE.listen)}
                aria-describedby={canSpeak ? undefined : 'pm-listen-reason'}
                disabled={!canSpeak}
                onClick={speak}
              >
                <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
              </button>
            </div>

            {finished ? (
              <>
                <div className="pm-finish">
                  <p ref={finishRef} tabIndex={-1}>{t(PRACTICE.finishedBody)}</p>
                </div>
                <div className="pm-answers">
                  <button className="pm-key" type="button" onClick={playAgain}>{t(PRACTICE.again)}</button>
                </div>
              </>
            ) : (
              <>
                <div className="pm-set" role="img" aria-label={t(question.label)}>
                  {question.shapes.map(([kind, clay], index) => (
                    <span
                      key={`${step}-${index}`}
                      className={`pm-clay pm-clay--${kind} pm-${clay}`}
                      style={spotStyle(question.desk[index], question.phone[index])}
                    >
                      <b />
                    </span>
                  ))}
                </div>
                <div className="pm-answers" role="group" aria-label={t(PRACTICE.answers)}>
                  {question.answers.map((value, index) => {
                    const chosen = pick?.value === value;
                    const state = chosen ? (pick.right ? ' is-right' : ' is-wrong') : '';
                    return (
                      <button
                        key={index}
                        ref={(element) => { tileRefs.current[index] = element; }}
                        className={`pm-tile${state}`}
                        type="button"
                        aria-pressed={chosen}
                        onClick={() => answer(value)}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <p className="pm-feedback" role="status">
              {feedback}
              {nextSaid ? <span className="pm-sr">{nextSaid}</span> : null}
            </p>
          </div>
          <p className="pm-caption">
            {finished ? t(PRACTICE.captionDone) : fill(t(PRACTICE.caption), { n: DONE_BEFORE + step + 1 })}
          </p>
          {canSpeak ? null : <p className="pm-caption" id="pm-listen-reason">{t(PRACTICE.noSpeech)}</p>}

          <div className="pm-intro">
            <h1 id="pm-title">{t(HERO.title)}</h1>
            <div className="pm-intro__row">
              <p className="pm-lede">{t(HERO.lede)}</p>
              <div className="pm-get">
                <a className="pm-key" href="#pm-price">{t(HERO.get)}</a>
                <p>{t(HERO.getNote)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pm-section" id="pm-lessons" aria-labelledby="pm-lessons-title">
          <h2 id="pm-lessons-title">{t(LESSON_COPY.title)}</h2>
          <p className="pm-note">{t(LESSON_COPY.note)}</p>
          <div className="pm-path">
            <div className="pm-stones" role="tablist" aria-label={t(LESSON_COPY.tablist)} onKeyDown={handleTabKey}>
              {LESSONS.map((item, index) => (
                <button
                  key={item.title.en}
                  ref={(element) => { tabRefs.current[index] = element; }}
                  id={`pm-lesson-tab-${index + 1}`}
                  className={`pm-stone-tab pm-stone-tab--${item.state}${item.clay ? ` pm-${item.clay}` : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={selected === index}
                  aria-controls="pm-lesson-panel"
                  aria-current={item.state === 'today' ? 'step' : undefined}
                  tabIndex={selected === index ? 0 : -1}
                  // detail is 0 when Enter or Space pressed the stone, which keeps focus on it.
                  onClick={(event) => chooseLesson(index, event.detail === 0)}
                >
                  <span className="pm-stone"><span className="pm-sr">{t(LESSON_COPY.lesson)} </span><b>{index + 1}</b></span>
                  <span className="pm-stone-tab__text">
                    <span className="pm-stone-tab__title">{t(item.title)}</span>
                    {item.mark ? <span className="pm-stone-tab__mark">{t(item.mark)}</span> : <span className="pm-sr">{`, ${t(LESSON_COPY.locked)}`}</span>}
                  </span>
                </button>
              ))}
            </div>
            <div
              ref={panelRef}
              className={`pm-lesson pm-lesson--${lesson.state}`}
              id="pm-lesson-panel"
              role="tabpanel"
              aria-labelledby={`pm-lesson-tab-${selected + 1}`}
              tabIndex={0}
              style={{ '--i': selected } as CSSProperties}
            >
              <h3>{`${t(LESSON_COPY.lesson)} ${selected + 1}: ${t(lesson.title)}`}</h3>
              <div>
                <p className="pm-lesson__status">{t(lesson.status)}</p>
                <p className="pm-lesson__body">{t(lesson.body)}</p>
              </div>
              <ul className="pm-lesson__facts">
                <li>{t(LESSON_COPY.questions)}</li>
                <li>{fill(t(LESSON_COPY.minutes), { n: lesson.minutes })}</li>
                <li>{t(LESSON_COPY.spoken)}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pm-section" id="pm-report" aria-labelledby="pm-report-title">
          <div className="pm-report__head">
            <h2 id="pm-report-title">{t(REPORT.title)}</h2>
            <p>{t(REPORT.note)}</p>
          </div>
          <div className="pm-sheet">
            <div className="pm-sheet__top">
              <h3>{t(REPORT.week)}</h3>
              <p>{t(REPORT.summary)}</p>
            </div>
            <div className="pm-sheet__body">
              <div className="pm-minutes">
                <h4>{t(REPORT.minutesTitle)}</h4>
                <div className="pm-chart" style={{ '--limit': DAILY_LIMIT } as CSSProperties}>
                  <div className="pm-chart__limit" aria-hidden="true"><span>{t(REPORT.limit)}</span></div>
                  <ol aria-label={t(REPORT.chart)}>
                    {DAYS.map((day) => (
                      <li key={day.short.en} style={{ '--v': day.minutes } as CSSProperties}>
                        <b aria-hidden="true">{day.minutes}</b>
                        <i aria-hidden="true" />
                        <span className="pm-chart__day" aria-hidden="true">{t(day.short)}</span>
                        <span className="pm-sr">{`${t(day.full)}: ${day.minutes} ${t(REPORT.minutesWord)}`}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="pm-minutes__note">{t(REPORT.limitNote)}</p>
              </div>
              <div className="pm-skills">
                <h4>{t(REPORT.skillsTitle)}</h4>
                <ul>
                  {SKILLS.map((skill) => (
                    <li key={skill.name.en}>
                      <div className="pm-skills__row">
                        <span className="pm-skills__name">{t(skill.name)}</span>
                        <span className="pm-skills__score">{fill(t(OF), { a: skill.right, b: skill.asked })}</span>
                      </div>
                      <span className="pm-skills__kind">{t(skill.kind)}</span>
                      <span className="pm-meter" aria-hidden="true"><i style={{ width: `${Math.round((skill.right / skill.asked) * 100)}%` }} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="pm-sheet__tip"><b>{t(REPORT.tipLead)}</b> {t(REPORT.tip)}</p>
          </div>
        </section>

        <section className="pm-section pm-without" aria-labelledby="pm-without-title">
          <h2 id="pm-without-title">{t(WITHOUT.title)}</h2>
          <ul>
            {WITHOUT.rows.map((row) => (
              <li key={row.lead.en}><b>{t(row.lead)}</b> <span>{t(row.rest)}</span></li>
            ))}
          </ul>
        </section>

        <section className="pm-section" id="pm-price" aria-labelledby="pm-price-title">
          <div className="pm-buy">
            <div>
              {/* The space sits inside the small word so the heading reads "£5.99 once". */}
              <h2 id="pm-price-title" className="pm-price">{PRICE}<small>{` ${t(BUY.once)}`}</small></h2>
              <p className="pm-buy__copy">{t(BUY.body)}</p>
            </div>
            <dl className="pm-devices" aria-label={t(BUY.devices)}>
              {DEVICES.map(([term, value]) => (
                <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
              ))}
            </dl>
          </div>
          <div className="pm-send">
            <div>
              <h3 id="pm-send-title">{t(BUY.sendTitle)}</h3>
              <p>{t(BUY.sendBody)}</p>
            </div>
            {formState === 'done' ? (
              <p className="pm-send__done" ref={doneRef} tabIndex={-1}>{fill(t(BUY.done), { email: email.trim() })}</p>
            ) : (
              <form className="pm-form" onSubmit={handleSubmit} noValidate aria-labelledby="pm-send-title">
                <label htmlFor="pm-email">{t(BUY.label)}</label>
                <div className="pm-form__row">
                  <input
                    id="pm-email"
                    className="pm-input"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    aria-invalid={formState === 'error'}
                    aria-describedby={formState === 'error' ? 'pm-email-error' : undefined}
                    onChange={(event) => { setEmail(event.target.value); if (formState === 'error') setFormState('idle'); }}
                  />
                  {/* Right under the field: on phones the button wraps below it. */}
                  {formState === 'error' ? <p className="pm-form__error" id="pm-email-error" role="alert">{t(BUY.error)}</p> : null}
                  <button className="pm-key" type="submit">{t(BUY.submit)}</button>
                </div>
              </form>
            )}
          </div>
        </section>

        <footer className="pm-foot">
          <p>{t(FOOTER.made)}</p>
          <p>{FOOTER.email}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
