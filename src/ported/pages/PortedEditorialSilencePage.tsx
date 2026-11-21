import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedEditorialSilencePage.css';

// The book page of The Salt Year, a debut novel from Weir House, a small press in
// Colchester, in the Editorial Silence style. Spectral sets everything that belongs to
// the book: the title page, the first lines, the two-page spread, the reviews and the
// dates of the readings. Spectral SC opens a chapter in small capitals. Instrument Sans
// sets everything that belongs to the shop: prices, ISBNs, forms and buttons.
// Components come from the book and its publisher: a title page with the order details
// in its outer margin, the novel's first lines set as an epigraph, a spread with running
// head, chapter sinkage and folios, an edition chooser as a ruled table, jacket quotes
// with their sources in the margin, and dated bookshop readings you can reserve.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const PRESS = 'Weir House';
const TITLE = 'The Salt Year';
const AUTHOR = 'Clare Avenell';
const ISBN_HARDBACK = '978-1-916834-00-2';

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const money = (pence: number) => `£${(pence / 100).toFixed(2)}`;

// Copy marks small capitals with <sc>…</sc> and titles of books with <i>…</i>, so a
// translation can keep them where its own sentence puts them.
function rich(text: string): ReactNode[] {
  return text.split(/(<sc>.*?<\/sc>|<i>.*?<\/i>)/).map((part, index) => {
    const caps = /^<sc>(.*)<\/sc>$/.exec(part);
    if (caps) return <span key={index} className="sy-sc">{caps[1]}</span>;
    const title = /^<i>(.*)<\/i>$/.exec(part);
    if (title) return <i key={index}>{title[1]}</i>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BAR = {
  nav: { en: 'This book', ko: '이 책', ja: 'この本' },
  extract: { en: 'Extract', ko: '발췌', ja: '抜粋' },
  editions: { en: 'Editions', ko: '판본', ja: '版型' },
  readings: { en: 'Readings', ko: '낭독회', ja: '朗読会' },
  basket: { en: 'Basket ({n})', ko: '장바구니 ({n})', ja: 'カート ({n})' },
} satisfies Record<string, Tri>;

const TITLE_PAGE = {
  kind: { en: 'A novel', ko: '장편소설', ja: '長編小説' },
  what: { en: 'Hardback, 288 pages', ko: '양장본, 288쪽', ja: 'ハードカバー、288ページ' },
  when: { en: 'Published 1 October 2026', ko: '2026년 10월 1일 출간', ja: '2026年10月1日刊行' },
  order: { en: 'Order the hardback', ko: '양장본 주문하기', ja: 'ハードカバーを注文' },
  also: { en: 'Paperback from 6 May 2027', ko: '2027년 5월 6일부터 페이퍼백', ja: '2027年5月6日よりペーパーバック' },
  place: { en: 'Weir House, Colchester', ko: 'Weir House, Colchester', ja: 'Weir House, Colchester' },
} satisfies Record<string, Tri>;

const OPENING = {
  chap: { en: 'March', ko: '3월', ja: '3月' },
  text: {
    en: '<sc>My mother left me</sc> the salt works, a Land Rover with no reverse gear, and eleven tonnes of unsold salt in paper sacks. The solicitor read the list out twice, as if it might come out differently the second time. I drove down from Leeds the next morning, meaning to sell all three.',
    ko: '<sc>어머니는 나에게</sc> 염전과 후진 기어가 없는 Land Rover, 그리고 팔리지 않은 소금 11톤을 종이 포대째 남겼다. 변호사는 목록을 두 번 소리 내어 읽었다. 두 번째에는 내용이 달라지기라도 할 것처럼. 나는 다음 날 아침 Leeds에서 차를 몰고 내려왔다. 세 가지를 모두 팔 생각이었다.',
    ja: '<sc>母が私に遺したのは</sc>、塩田と、後退ギアのないLand Roverと、紙袋に入ったままの売れ残りの塩11トンだった。弁護士は目録を二度読み上げた。二度目には違う内容になるとでもいうように。私は翌朝Leedsから車を走らせた。三つとも売るつもりで。',
  },
  note: {
    en: 'The first lines. The twelve chapters run from March to February.',
    ko: '첫 대목입니다. 열두 개 장은 3월부터 2월까지 이어집니다.',
    ja: '冒頭部分です。全12章は3月から2月までです。',
  },
  link: { en: 'Read the opening of July', ko: '7월 대목 읽기', ja: '7月の冒頭を読む' },
} satisfies Record<string, Tri>;

const EXCERPT = {
  title: { en: 'Read the opening of July', ko: '7월 대목 읽기', ja: '7月の冒頭を読む' },
  intro: {
    en: 'Four months after she arrived, Nell is still running the salt works she came to sell. This is the week of the July spring tide and the first full harvest.',
    ko: 'Nell은 도착한 지 넉 달이 지났지만, 팔려고 왔던 염전을 여전히 운영하고 있습니다. 7월 대조기가 있는 주이자, 첫 본격적인 수확의 주입니다.',
    ja: 'Nellは到着から4か月がたった今も、売るために来た塩田を動かしています。ここは7月の大潮の週で、初めての本格的な収穫の週です。',
  },
  page: { en: 'Page {n}', ko: '{n}쪽', ja: '{n}ページ' },
  chap: { en: 'July', ko: '7월', ja: '7月' },
  left: [
    {
      en: '<sc>The spring tide</sc> came in at ten past six, and by seven Dennis had the sluice open and the first of the water running into the settling tank. He had been talking about this morning since March. He said it the way other people talk about Christmas: the July tide, the big one, when the sun has been on the marsh for weeks and the creek comes in heavy with salt.',
      ko: '<sc>대조기 물이</sc> 여섯 시 십 분에 들어왔고, 일곱 시에는 Dennis가 수문을 열어 첫 바닷물이 침전 탱크로 흘러들고 있었다. 그는 3월부터 이날 아침 얘기를 해 왔다. 사람들이 크리스마스 얘기를 하듯 말했다. 7월의 조수, 큰 조수 말이다. 태양이 몇 주째 갯벌 위에 머물러 갯골로 소금기 가득한 물이 묵직하게 밀려드는 때.',
      ja: '<sc>大潮の水</sc>が6時10分に満ち、7時にはDennisが水門を開けて、最初の海水が沈殿槽へ流れ込んでいた。彼は3月からこの朝のことを話し続けていた。人がクリスマスを語るような調子で。7月の潮、大きな潮のことだ。太陽が何週間も干潟を照らし、入り江に塩を大量に含んだ水が重く流れ込んでくる時期。',
    },
    {
      en: 'We let it stand for two days so the mud could settle out. On the third morning I lit the burners under the long pan, and Dennis showed me how to tell when the brine was ready: dip a clean finger, hold it up, and wait to see if it dries white. It did. He nodded and turned the gas down until the surface barely moved.',
      ko: '이틀 동안 그대로 두어 진흙이 가라앉게 했다. 사흘째 아침에는 긴 솥 아래 버너에 불을 붙였고, Dennis가 염수가 준비되었는지 알아보는 법을 보여 주었다. 깨끗한 손가락을 담갔다가 들어 올려, 하얗게 마르는지 기다려 보는 것이다. 정말 하얗게 말랐다. 그는 고개를 끄덕이고, 표면이 겨우 움직일 정도가 될 때까지 가스를 줄였다.',
      ja: '2日間そのまま置いて、泥を沈ませた。3日目の朝、私は長い釜の下のバーナーに火を入れた。Dennisが鹹水の仕上がりを見分ける方法を教えてくれた。清潔な指を浸して持ち上げ、白く乾くかどうか待つのだ。本当に白く乾いた。彼はうなずき、表面がほとんど動かなくなるまで火を弱めた。',
    },
  ] satisfies Tri[],
  right: [
    {
      en: 'The crystals came in the afternoon. They form on the top of the water first, small hollow pyramids that float for a minute and then fill and sink, and the pan makes a quiet ticking sound while it happens. I sat on an upturned crate and watched for an hour. Nobody had told me about the sound.',
      ko: '결정은 오후에 생겼다. 먼저 물 위 표면에 맺히는데, 작은 속 빈 피라미드 모양이 잠깐 떠 있다가 속이 차면서 가라앉는다. 그동안 염전에서는 조용한 똑딱거림이 난다. 나는 엎어 놓은 상자에 앉아 한 시간 동안 지켜보았다. 그 소리에 대해서는 아무도 나에게 말해 준 적이 없었다.',
      ja: '結晶は午後に現れた。まず水面にでき、小さな中空のピラミッドのような形が、しばらく浮いてから中が満ちて沈む。その間、塩田は静かにカチカチと音を立てる。私は逆さに置いた木箱に座り、一時間見ていた。その音のことは、誰も教えてくれていなかった。',
    },
    {
      en: 'At five we raked. You draw the salt to the side of the pan in long strokes and lift it into the draining bins with a wooden shovel, and you go slowly or the flakes break. By the second bin my arms were shaking. Dennis took the shovel from me without a word, finished the row, and handed it back.',
      ko: '다섯 시에는 소금을 긁었다. 긴 획으로 소금을 팬 가장자리로 끌어 모은 뒤 나무 삽으로 떠서 물빼기 통에 옮긴다. 천천히 해야 결정이 부서지지 않는다. 두 번째 통에 이르자 내 팔이 떨렸다. Dennis는 말없이 삽을 받아 한 줄을 마저 긁고는 되돌려 주었다.',
      ja: '5時には塩をかき集めた。長いストロークで塩を池の縁へ寄せ、木のシャベルですくって水切りの箱に移す。ゆっくりやらないと結晶が割れる。二つ目の箱の頃には腕が震えていた。Dennisは何も言わずにシャベルを取り、列を最後までかき終えてから返してくれた。',
    },
    {
      en: 'That night I wrote to the estate agent and asked him to wait until September.',
      ko: '그날 밤 나는 부동산 중개인에게 편지를 써서 9월까지 기다려 달라고 했다.',
      ja: 'その夜、私は不動産業者に手紙を書き、9月まで待ってほしいと頼んだ。',
    },
  ] satisfies Tri[],
  pages: { en: 'Pages 130 and 131 of the hardback.', ko: '양장본 130쪽과 131쪽입니다.', ja: 'ハードカバーの130ページと131ページです。' },
  same: {
    en: 'The text is the same in all three editions.',
    ko: '세 판본 모두 본문이 같습니다.',
    ja: '3つの版はすべて本文が同じです。',
  },
};

const ABOUT = {
  title: { en: 'About {author}', ko: '{author} 소개', ja: '{author}について' },
  bio: [
    {
      en: 'Clare Avenell grew up in Tollesbury, on the Essex coast, three miles across the water from the marsh where <i>The Salt Year</i> is set. She worked for eleven years as a pharmacist at Colchester Hospital and wrote the novel between 2019 and 2025, mostly in the two hours before a morning shift.',
      ko: 'Clare Avenell은 Essex 해안의 Tollesbury에서 자랐습니다. 물 건너 3마일 떨어진 곳에 <i>The Salt Year</i>의 배경인 갯벌이 있습니다. 그녀는 Colchester Hospital에서 11년 동안 약사로 일했고, 2019년부터 2025년까지 이 소설을 썼습니다. 대부분은 아침 근무 전 두 시간 동안 썼습니다.',
      ja: 'Clare AvenellはEssex海岸のTollesburyで育ちました。海を3マイル隔てた先に、<i>The Salt Year</i>の舞台となる干潟があります。Colchester Hospitalで11年間薬剤師として働き、2019年から2025年にかけてこの小説を書きました。多くは朝の勤務前の2時間に書いたものです。',
    },
    {
      en: 'To learn the work she spent two summers raking pans at a family salt works near Maldon. She lives in West Mersea with her partner and their two sons, and is writing a second novel, set on the night ferry from Harwich to the Hook of Holland.',
      ko: '그 일을 익히려고 두 번의 여름 동안 Maldon 근처 가족 경영 염전에서 염전 일을 했습니다. 지금은 West Mersea에서 파트너, 두 아들과 함께 살고 있으며, Harwich에서 Hook of Holland로 가는 야간 페리를 배경으로 한 두 번째 소설을 쓰고 있습니다.',
      ja: '仕事を覚えるため、二度の夏、Maldon近くの家族経営の塩田で塩をかき集める作業をしました。今はWest Mersea で、パートナーと二人の息子とともに暮らしています。HarwichからHook of Hollandへ向かう夜行フェリーを舞台にした二作目を執筆中です。',
    },
  ] satisfies Tri[],
  facts: [
    { key: { en: 'Born', ko: '출생', ja: '出生' }, value: { en: 'Colchester, 1986', ko: 'Colchester, 1986년', ja: 'Colchester、1986年' } },
    { key: { en: 'Lives', ko: '거주지', ja: '居住地' }, value: { en: 'West Mersea, Essex', ko: 'West Mersea, Essex', ja: 'West Mersea, Essex' } },
    { key: { en: 'Worked', ko: '경력', ja: '経歴' }, value: { en: 'Pharmacist, 2012 to 2023', ko: '약사, 2012년~2023년', ja: '薬剤師、2012年から2023年' } },
    { key: { en: 'Next book', ko: '다음 작품', ja: '次作' }, value: { en: '<i>Night Crossing</i>, spring 2028', ko: '<i>Night Crossing</i>, 2028년 봄', ja: '<i>Night Crossing</i>、2028年春' } },
  ] satisfies Array<{ key: Tri; value: Tri }>,
};

type EditionId = 'hardback' | 'paperback' | 'ebook';

interface Edition {
  id: EditionId;
  name: Tri;
  desc: Tri;
  pages: string;
  pagesNote: Tri | null;
  isbn: string;
  published: Tri;
  publishedNote: Tri | null;
  /** In pence. */
  price: number;
  /** What the order row calls it. */
  item: Tri;
  /** The order button names the edition. */
  action: Tri;
}

const EDITIONS: Edition[] = [
  {
    id: 'hardback',
    name: { en: 'Hardback', ko: '양장본', ja: 'ハードカバー' },
    desc: {
      en: 'Sewn binding, cloth spine, 216 × 138 mm. The first 500 copies are signed.',
      ko: '사철 제본, 천 책등, 216 × 138 mm. 초판 500부는 서명본입니다.',
      ja: '糸綴じ、クロス張りの背、216 × 138 mm。初版500部は署名入りです。',
    },
    pages: '288',
    pagesNote: null,
    isbn: ISBN_HARDBACK,
    published: { en: '1 October 2026', ko: '2026년 10월 1일', ja: '2026年10月1日' },
    publishedNote: null,
    price: 1699,
    item: { en: 'Signed hardback', ko: '서명본 양장본', ja: '署名入りハードカバー' },
    action: { en: 'Add the hardback to basket', ko: '양장본 장바구니에 담기', ja: 'ハードカバーをカートに入れる' },
  },
  {
    id: 'paperback',
    name: { en: 'Paperback', ko: '페이퍼백', ja: 'ペーパーバック' },
    desc: {
      en: '198 × 129 mm, with questions for reading groups and an afterword.',
      ko: '198 × 129 mm, 독서 모임을 위한 질문과 후기가 실려 있습니다.',
      ja: '198 × 129 mm。読書会向けの質問と後書きを収録しています。',
    },
    pages: '300',
    pagesNote: null,
    isbn: '978-1-916834-01-9',
    published: { en: '6 May 2027', ko: '2027년 5월 6일', ja: '2027年5月6日' },
    publishedNote: { en: 'Pre-order now', ko: '지금 예약 가능', ja: '予約受付中' },
    price: 1099,
    item: { en: 'Paperback pre-order', ko: '페이퍼백 예약 주문', ja: 'ペーパーバック予約' },
    action: { en: 'Pre-order the paperback', ko: '페이퍼백 예약 주문하기', ja: 'ペーパーバックを予約注文' },
  },
  {
    id: 'ebook',
    name: { en: 'Ebook', ko: '전자책', ja: '電子書籍' },
    desc: {
      en: 'EPUB without copy protection, for any reading app.',
      ko: '복제 방지 기능이 없는 EPUB, 어떤 독서 앱에서든 읽을 수 있습니다.',
      ja: 'コピー防止機能のないEPUB。どの読書アプリでも読めます。',
    },
    pages: '288',
    pagesNote: { en: 'in print', ko: '종이책과 같음', ja: '紙の本と同じ' },
    isbn: '978-1-916834-02-6',
    published: { en: '1 October 2026', ko: '2026년 10월 1일', ja: '2026年10月1日' },
    publishedNote: null,
    price: 699,
    item: { en: 'Ebook', ko: '전자책', ja: '電子書籍' },
    action: { en: 'Add the ebook to basket', ko: '전자책 장바구니에 담기', ja: '電子書籍をカートに入れる' },
  },
];

const EDS = {
  title: { en: 'Editions', ko: '판본', ja: '版型' },
  intro: {
    en: 'All three have the same text. The paperback adds twelve pages: questions for reading groups and a note from Clare on the salt works where she learned the work.',
    ko: '세 판본의 본문은 모두 같습니다. 페이퍼백에는 열두 쪽이 더 들어 있습니다. 독서 모임을 위한 질문과, 일을 배운 염전에 대해 Clare가 쓴 글이 실렸습니다.',
    ja: '3つの版はすべて本文が同じです。ペーパーバックには12ページが加わり、読書会向けの質問と、Clareが仕事を学んだ塩田について書いた文章を収録しています。',
  },
  legend: { en: 'Choose an edition', ko: '판본 선택', ja: '版を選択' },
  colEdition: { en: 'Edition', ko: '판본', ja: '版' },
  colPages: { en: 'Pages', ko: '쪽수', ja: 'ページ数' },
  colIsbn: { en: 'ISBN', ko: 'ISBN', ja: 'ISBN' },
  colPublished: { en: 'Published', ko: '출간일', ja: '刊行日' },
  colPrice: { en: 'Price', ko: '가격', ja: '価格' },
  note: {
    en: 'Free UK postage on orders over £20. We post from Colchester within two working days. Any bookshop can also order it with the ISBN.',
    ko: '영국 내 £20 이상 주문은 배송비가 무료입니다. Colchester에서 영업일 기준 이틀 안에 발송합니다. 서점에서도 ISBN으로 주문할 수 있습니다.',
    ja: '英国内で£20以上のご注文は送料無料です。Colchesterから営業日2日以内に発送します。書店でもISBNでご注文いただけます。',
  },
  addedOne: { en: '{item} added. Your basket has 1 book.', ko: '{item}을(를) 담았습니다. 장바구니에 책 1권이 있습니다.', ja: '{item}をカートに入れました。カートに本が1冊あります。' },
  addedMany: { en: '{item} added. Your basket has {n} books.', ko: '{item}을(를) 담았습니다. 장바구니에 책 {n}권이 있습니다.', ja: '{item}をカートに入れました。カートに本が{n}冊あります。' },
} satisfies Record<string, Tri>;

const REVIEWS = {
  title: { en: 'Reviews', ko: '서평', ja: '書評' },
  quotes: [
    {
      text: {
        en: '“The salt works is drawn so exactly that you can smell the marsh, and Nell is the most stubborn narrator I have read this year. I finished it in two evenings.”',
        ko: '“염전이 너무 정확하게 그려져 있어서 갯벌 냄새가 날 것 같다. Nell은 올해 내가 읽은 화자 중 가장 고집 센 화자다. 이틀 저녁 만에 다 읽었다.”',
        ja: '“塩田の描写があまりに正確で、干潟の匂いがしてくるようだ。Nellは今年私が読んだ中で最も頑固な語り手だ。二晩で読み終えた。”',
      },
      by: 'Anna Petrakis',
      paper: 'The Sunday Ledger',
      date: { en: '4 October 2026', ko: '2026년 10월 4일', ja: '2026年10月4日' },
      dateTime: '2026-10-04',
    },
    {
      text: {
        en: '“Avenell writes about physical work better than almost anyone publishing fiction now. The July harvest is the best chapter in the book.”',
        ko: '“Avenell은 지금 소설을 펴내는 작가들 가운데 거의 누구보다도 육체노동을 잘 그려 낸다. 7월의 수확은 이 책에서 가장 좋은 장이다.”',
        ja: '“Avenellは、今小説を発表している作家のほぼ誰よりも肉体労働を巧みに書く。7月の収穫は、この本で最も良い章だ。”',
      },
      by: 'Tom Erskine',
      paper: 'The Quarterly Reader',
      date: { en: 'Autumn 2026', ko: '2026년 가을', ja: '2026年秋' },
      dateTime: '2026-09',
    },
    {
      text: {
        en: '“A quiet, often funny first novel about grief, money and a family business that by rights should have closed in 1990. Dennis deserves a book of his own.”',
        ko: '“상실과 돈, 그리고 원래라면 1990년에 문을 닫았어야 했을 가족 사업을 다룬, 조용하고 종종 웃기기도 한 데뷔 소설. Dennis에게는 자기만의 책이 있어야 마땅하다.”',
        ja: '“喪失、お金、そして本来なら1990年に閉店していてもおかしくない家業をめぐる、静かで、ときにおかしみのあるデビュー小説。Dennisには彼自身の本があってしかるべきだ。”',
      },
      by: 'Priya Shah',
      paper: 'Northern Bookseller',
      date: { en: '15 October 2026', ko: '2026년 10월 15일', ja: '2026年10月15日' },
      dateTime: '2026-10-15',
    },
  ],
};

interface Reading {
  id: string;
  dateTime: string;
  day: Tri;
  time: Tri;
  shop: string;
  street: string;
  postcode: string;
  what: Tri;
  note: Tri;
  /** Places at a reading that takes bookings. */
  places?: { total: number; left: number };
}

const READINGS: Reading[] = [
  {
    id: 'pargeter',
    dateTime: '2026-12-03T19:00',
    day: { en: '3 December', ko: '12월 3일', ja: '12月3日' },
    time: { en: 'Thursday, 19:00 to 20:30', ko: '목요일, 19:00~20:30', ja: '木曜 19:00〜20:30' },
    shop: 'Pargeter’s Bookshop',
    street: '9 Church Street, Coggeshall',
    postcode: 'CO6 1TU',
    what: {
      en: 'Clare reads from July and talks with the bookseller Mina Hale about the year she spent learning the work.',
      ko: 'Clare가 7월 대목을 낭독하고, 서점 직원 Mina Hale과 함께 그녀가 이 일을 배운 한 해에 대해 이야기합니다.',
      ja: 'Clareが7月の章を朗読し、書店員のMina Haleと、彼女がこの仕事を学んだ一年について語ります。',
    },
    note: { en: 'Tickets £5, taken off the price of the book.', ko: '입장권 £5, 책값에서 차감됩니다.', ja: '入場料は£5、本の代金から差し引かれます。' },
    places: { total: 40, left: 14 },
  },
  {
    id: 'quay',
    dateTime: '2026-12-12T11:00',
    day: { en: '12 December', ko: '12월 12일', ja: '12月12日' },
    time: { en: 'Saturday, 11:00 to 13:00', ko: '토요일, 11:00~13:00', ja: '土曜 11:00〜13:00' },
    shop: 'The Quay Bookroom',
    street: '14 High Street, West Mersea',
    postcode: 'CO5 8QA',
    what: {
      en: 'A signing morning. Bring your copy or buy one in the shop, and Clare will sign it with a dedication.',
      ko: '사인회 오전입니다. 가지고 계신 책을 가져오시거나 매장에서 한 권 구입하시면, Clare가 헌정 문구와 함께 서명해 드립니다.',
      ja: 'サイン会の午前です。お手持ちの本をお持ちいただくか、店内で一冊お買い求めいただくと、Clareが献辞を添えてサインします。',
    },
    note: { en: 'Free, no booking needed.', ko: '무료이며 예약은 필요하지 않습니다.', ja: '無料、予約は不要です。' },
  },
];

const READ = {
  title: { en: 'Readings in December', ko: '12월 낭독회', ja: '12月の朗読会' },
  intro: {
    en: 'Clare is at two bookshops near the marsh before Christmas. Both have step-free access.',
    ko: 'Clare는 크리스마스 전에 갯벌 근처 서점 두 곳에서 낭독합니다. 두 곳 모두 계단 없이 들어갈 수 있습니다.',
    ja: 'Clareはクリスマス前、干潟近くの書店2店で朗読します。どちらも段差なしで入店できます。',
  },
  left: { en: '{left} of {total} places left.', ko: '전체 {total}자리 중 {left}자리 남음.', ja: '全{total}席のうち残り{left}席。' },
  reserve: { en: 'Reserve a place', ko: '자리 예약하기', ja: '席を予約する' },
  formTitle: { en: 'Reserve a place at {shop}', ko: '{shop} 자리 예약', ja: '{shop}の席を予約' },
  name: { en: 'Name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  places: { en: 'Places', ko: '인원', ja: '人数' },
  one: { en: 'One place', ko: '1명', ja: '1名' },
  two: { en: 'Two places', ko: '2명', ja: '2名' },
  most: { en: 'Two places at most per booking.', ko: '예약 한 건당 최대 2명까지 가능합니다.', ja: '1回のご予約は最大2名までです。' },
  submitOne: { en: 'Reserve one place', ko: '1명 예약하기', ja: '1名で予約する' },
  submitTwo: { en: 'Reserve two places', ko: '2명 예약하기', ja: '2名で予約する' },
  nameError: { en: 'Write the name the places should be held under.', ko: '자리를 잡아 둘 이름을 입력해 주세요.', ja: '席を確保するお名前を入力してください。' },
  emailError: { en: 'Write an email address, such as name@example.com.', ko: '이메일 주소를 입력해 주세요. 예: name@example.com', ja: 'メールアドレスを入力してください。例: name@example.com' },
  doneOne: {
    en: 'Thank you, {name}. One place is held for you at {shop} on Thursday 3 December.',
    ko: '{name}님, 감사합니다. 12월 3일 목요일 {shop}에 1명 자리를 잡아 두었습니다.',
    ja: '{name}様、ありがとうございます。12月3日（木）、{shop}に1名分の席を確保しました。',
  },
  doneTwo: {
    en: 'Thank you, {name}. Two places are held for you at {shop} on Thursday 3 December.',
    ko: '{name}님, 감사합니다. 12월 3일 목요일 {shop}에 2명 자리를 잡아 두었습니다.',
    ja: '{name}様、ありがとうございます。12月3日（木）、{shop}に2名分の席を確保しました。',
  },
  doneBody: {
    en: 'The details are on their way to {email}. Pay £5 a ticket at the door, and it comes off the price of the book.',
    ko: '자세한 내용은 {email}(으)로 보내 드리고 있습니다. 입장할 때 1매당 £5를 내시면 책값에서 차감됩니다.',
    ja: '詳細は{email}宛てにお送りしています。当日、入口で1枚につき£5をお支払いいただくと、本の代金から差し引かれます。',
  },
  heldOne: { en: 'One place reserved', ko: '1명 자리 예약됨', ja: '1名分の席を確保しました' },
  heldTwo: { en: 'Two places reserved', ko: '2명 자리 예약됨', ja: '2名分の席を確保しました' },
} satisfies Record<string, Tri>;

const FOOT = {
  press: {
    en: 'Weir House publishes four books a year from a room above a boatyard on Hythe Quay. <i>The Salt Year</i> is our eleventh.',
    ko: 'Weir House는 Hythe Quay의 조선소 위 방에서 한 해 네 권의 책을 펴냅니다. <i>The Salt Year</i>는 저희의 열한 번째 책입니다.',
    ja: 'Weir Houseは、Hythe Quayの造船所の上の一室から年に4冊の本を刊行しています。<i>The Salt Year</i>は当社の11冊目です。',
  },
  letter: { en: 'A letter about new books, four times a year', ko: '새 책 소식을 전하는 편지, 연 4회', ja: '新刊のお知らせ（年4回）' },
  placeholder: { en: 'Your email address', ko: '이메일 주소', ja: 'メールアドレス' },
  signUp: { en: 'Sign up', ko: '구독하기', ja: '登録する' },
  error: { en: 'Write an email address, such as name@example.com.', ko: '이메일 주소를 입력해 주세요. 예: name@example.com', ja: 'メールアドレスを入力してください。例: name@example.com' },
  done: {
    en: 'Thank you. The winter letter goes to {email} in the first week of January.',
    ko: '감사합니다. 겨울 편지는 1월 첫째 주에 {email}(으)로 보내 드리겠습니다.',
    ja: 'ありがとうございます。冬号のお知らせは1月第1週に{email}宛てにお送りします。',
  },
} satisfies Record<string, Tri>;

const ADDRESS = ['Unit 3, Hythe Quay', 'Colchester CO2 8JB', '01632 960 418'];

const PROMPT_EN = `Design one real page in the Editorial Silence style: a near-white page set almost entirely in type, with wide margins, a light serif over a quiet sans, near-black ink and no colour.

Pick a believable subject whose page is mostly reading, such as a novel from a small press, a poetry pamphlet or a museum's catalogue essay, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is The Salt Year, a debut novel by Clare Avenell from Weir House, a four-books-a-year press in Colchester: the title page with the order details, the first lines, a two-page spread of the July chapter, the author, the three editions, three reviews and two bookshop readings.

TOKENS:
--paper: #f8f8f8 (the page)
--sheet: #ffffff (the spread, the chosen edition row, the radio squares)
--surface: #ffffff (opaque, for any menu that opens over the page)
--ink: #1c1c1e
--muted: #52525b (notes, addresses, column heads, placeholders)
--line: rgba(28,28,30,0.3)
--error: #a1281e

COLOUR:
- Ink and grey on near-white. Rules that open something are ink: 2px over the title page and the foot; 1px over each section, the order details, the edition table and the readings, and under every text field. Every other line is --line.
- The only colour is --error, on error messages and the 2px underline of a field that failed. No accent colour, no tinted backgrounds, no gradients.

TYPOGRAPHY:
Three families. Spectral (200, 300 and 400, italic 200 and 300) sets everything that belongs to the book. Spectral SC (300) sets the first words of a chapter in small capitals. Instrument Sans (400, 500) sets everything that belongs to the shop: notes, ISBNs, times, forms and buttons.
Title: Spectral 200, clamp(4.5rem, 12.4vw, 11rem), line-height 0.86, letter-spacing -0.045em, two lines on a laptop and a phone.
The press's name: Spectral 400, 1.5rem (1.375rem on phones).
"A novel": Spectral italic 300, clamp(1.25rem, 1.8vw, 1.5rem). Author: Spectral 300, clamp(2rem, 3.4vw, 2.875rem), letter-spacing -0.03em.
H2: Spectral 200, clamp(2.25rem, 3.8vw, 3.25rem), line-height 1.05, letter-spacing -0.035em.
First lines: Spectral 300, clamp(1.1875rem, 1.6vw, 1.375rem), line-height 1.65. Spread text: Spectral 300, 1.1875rem, line-height 1.72, paragraphs indented 1.4em, the first one flush. Chapter head: Spectral italic 300, 2.75rem (2.25rem on phones), sunk 112px (56px on phones).
Reviews: the first in Spectral italic 200 at clamp(1.625rem, 2.6vw, 2.25rem), the others italic 300 at clamp(1.25rem, 1.7vw, 1.4375rem), with hanging opening quotes.
About the author and the press: Spectral 300, 1.25rem. A confirmation: Spectral 300, 1.375rem after a reservation and 1.25rem after the sign-up.
Prices: Spectral 300, 2.375rem on the title page and in the order row (2.125rem on phones), 1.75rem in the edition rows (1.5rem on phones). Reading dates: Spectral 200, clamp(2.375rem, 3.8vw, 3.25rem). Edition names Spectral 400 at 1.75rem (1.5rem on phones); bookshop names 400 at 1.5rem.
Running text in the shop: Instrument Sans 400 at 1.0625rem, line-height 1.6; notes at 1rem; 500 only for the few words that need weight and for buttons. Old-style figures in book text, lining figures in prices and dates, tabular figures in ISBNs. No text under 1rem. No all-caps tracked labels.
Headlines never break inside a word (Korean uses word-break: keep-all, Japanese headings auto-phrase).

LAYOUT:
- A 1120px column on a 12-column grid with 24px gutters (16px on phones). Sections 136px apart (104px under 900px, 80px on phones), each opened by a 1px ink rule with the H2 on the left and a short note from column 8.
- Shop bar: the press name, three in-page links and the basket count. Under 900px the links take their own row.
- Title page under a 2px ink rule: the title over columns 1 to 8, "A novel" under it, the author low on the page, the order details in the outer margin (columns 10 to 12, 9 to 12 below 1080px, their foot level with the author's line), the imprint at the foot on a 1px rule. The title, author, price and "Order the hardback" are all on the first screen of a 1280x800 laptop.
- The first lines sit in columns 5 to 9, where an epigraph would go.
- Under 900px everything takes the full column; the order details follow the author.

COMPONENTS:
- Spread: pages 130 and 131 on a white sheet with a 1px line round it and down the gutter. Running head in Spectral italic 300, folios in Spectral 300 with old-style figures, both muted. One page under 900px; on phones the sheet runs to the screen edges.
- About: two paragraphs in Spectral on the left, the facts as a ruled definition list on the right.
- Edition chooser: a radio group drawn as a ruled table (Edition, Pages, ISBN, Published, Price). A 20px square marks the row; the chosen row is white with a 3px ink rule on its left and a filled square. Under 900px each row stacks with its own labels. Choosing an edition changes the order row: its name, the price and the button label (Add the hardback to basket, Pre-order the paperback, Add the ebook to basket). The button adds it to the basket, updates the count in the shop bar and says so in a polite status line.
- Reviews: the quote on columns 1 to 8, the reviewer, the publication in italic and the date in the margin.
- Readings: one ruled row per evening (date large, the bookshop and its address, what happens with the places left, the action). "Reserve a place" opens a short form under the row (name, email, one or two places as two squares). Errors sit under their field; a valid reservation replaces the form with a confirmation that takes focus, and the places left go down.
- Foot under a 2px ink rule: a sentence about the press, the address, and a letter sign-up on a single underline with a text button. A valid email is replaced by a confirmation that takes focus.
- Buttons are solid ink rectangles with paper text, 48px tall; on hover they turn to paper with ink text. "Reserve a place" is drawn in outline while its form is open. Links in text are underlined in ink and the line thickens on hover; the bar's links are muted and turn ink with an underline on hover.
- Focus: a 2px ink outline 2px to 3px clear of the control; a radio row shows it round the whole row; a confirmation that takes focus shows it 6px clear.
- Square corners everywhere, 1px lines, no shadows.

MOTION:
- A 160ms colour change on hover. Nothing moves on its own. prefers-reduced-motion removes the transition.

FORBIDDEN:
- Cards, rounded boxes, pills, chips, badges, shadows, tinted panels
- A small label above a heading, all-caps tracked labels, numbered section markers
- Any accent colour, coloured links, gradients
- Book cover images, illustrations, photographs, ornaments, drop caps drawn as images, emoji
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about whitespace, silence, restraint or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a radio group for the editions and for the places, figures with blockquote and figcaption for the first lines and the reviews, labelled forms
3) Working edition chooser with a live price, button label and basket count; a reservation form and a sign-up form with error and success states
4) Responsive layout down to 320px with no horizontal scroll and no headline broken inside a word
5) Visible focus on every control, controls at least 44px tall on phones, reduced-motion support`;

const PROMPT_KO = `Editorial Silence 스타일로 실제 페이지 한 장을 디자인한다. 거의 흰색에 가까운 바탕에 대부분을 글자로 짜고, 넓은 여백, 가벼운 세리프 제목과 조용한 산세리프 본문, 거의 검은색에 가까운 잉크를 쓰며, 색은 쓰지 않는다.

그럴듯한 주제를 고른다. 페이지의 대부분이 읽을거리인 것이어야 하며, 예를 들어 소규모 출판사의 소설, 시집 소책자, 미술관 도록의 에세이 등이 있다. 실제 내용을 쓴다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 대한 페이지로 읽혀서는 안 된다. 여기서는 콜체스터의 연 4권 출판사 Weir House가 펴낸 Clare Avenell의 데뷔 소설 The Salt Year를 쓴다. 주문 정보가 있는 표제지, 첫 대목, 7월 장의 두 쪽짜리 펼침면, 저자 소개, 세 가지 판본, 서평 세 편, 서점 낭독회 두 건을 담는다.

TOKENS:
--paper: #f8f8f8 (페이지)
--sheet: #ffffff (펼침면, 선택된 판본 행, 라디오 사각형)
--surface: #ffffff (불투명. 페이지 위에 열리는 모든 메뉴용)
--ink: #1c1c1e
--muted: #52525b (메모, 주소, 열 제목, 플레이스홀더)
--line: rgba(28,28,30,0.3)
--error: #a1281e

COLOUR:
- 거의 흰 바탕 위의 잉크와 회색. 무엇인가를 여는 구분선은 잉크색으로 한다. 표제지와 바닥글 위는 2px, 각 섹션, 주문 정보, 판본 표, 낭독회 위와 모든 텍스트 입력란 아래는 1px. 그 밖의 선은 모두 --line을 쓴다.
- 색은 --error 하나뿐이며, 오류 메시지와 실패한 입력란의 2px 밑줄에만 쓴다. 강조색, 색조 배경, 그라데이션 금지.

TYPOGRAPHY:
서체는 세 가지. Spectral(200, 300, 400, 이탤릭 200과 300)은 책에 속한 모든 것을 짠다. Spectral SC(300)는 장의 첫 단어를 스몰캡으로 짠다. Instrument Sans(400, 500)는 매장에 속한 모든 것을 짠다: 메모, ISBN, 시간, 양식, 버튼.
제목: Spectral 200, clamp(4.5rem, 12.4vw, 11rem), line-height 0.86, letter-spacing -0.045em, 노트북과 휴대폰에서 두 줄.
출판사 이름: Spectral 400, 1.5rem (휴대폰에서는 1.375rem).
"장편소설": Spectral 이탤릭 300, clamp(1.25rem, 1.8vw, 1.5rem). 저자: Spectral 300, clamp(2rem, 3.4vw, 2.875rem), letter-spacing -0.03em.
H2: Spectral 200, clamp(2.25rem, 3.8vw, 3.25rem), line-height 1.05, letter-spacing -0.035em.
첫 대목: Spectral 300, clamp(1.1875rem, 1.6vw, 1.375rem), line-height 1.65. 펼침면 본문: Spectral 300, 1.1875rem, line-height 1.72, 문단은 1.4em 들여쓰고 첫 문단만 들여쓰지 않는다. 장 머리: Spectral 이탤릭 300, 2.75rem (휴대폰에서는 2.25rem), 112px 내림 (휴대폰에서는 56px).
서평: 첫 번째는 Spectral 이탤릭 200, clamp(1.625rem, 2.6vw, 2.25rem), 나머지는 이탤릭 300, clamp(1.25rem, 1.7vw, 1.4375rem), 여는 따옴표는 내어 쓴다.
저자와 출판사 소개: Spectral 300, 1.25rem. 확인 메시지: Spectral 300, 예약 후 1.375rem, 구독 후 1.25rem.
가격: Spectral 300, 표제지와 주문 행에서 2.375rem (휴대폰에서는 2.125rem), 판본 행에서 1.75rem (휴대폰에서는 1.5rem). 낭독회 날짜: Spectral 200, clamp(2.375rem, 3.8vw, 3.25rem). 판본 이름: Spectral 400, 1.75rem (휴대폰에서는 1.5rem). 서점 이름: 400, 1.5rem.
매장 본문: Instrument Sans 400, 1.0625rem, line-height 1.6. 메모는 1rem. 500은 무게가 필요한 몇 단어와 버튼에만 쓴다. 책 본문에는 올드스타일 숫자, 가격과 날짜에는 라이닝 숫자, ISBN에는 고정폭 숫자를 쓴다. 1rem 미만 글자 금지. 전부 대문자에 자간을 넓힌 라벨 금지.
제목은 단어 중간에서 절대 줄바꿈하지 않는다 (한국어는 word-break: keep-all, 일본어 제목은 auto-phrase 사용).

LAYOUT:
- 12열 그리드, 거터 24px (휴대폰에서는 16px)의 1120px 컬럼. 섹션 간격 136px (900px 미만에서는 104px, 휴대폰에서는 80px). 각 섹션은 1px 잉크 구분선으로 열고, 왼쪽에 H2, 8열부터 짧은 메모를 둔다.
- 매장 바: 출판사 이름, 페이지 내 링크 세 개, 장바구니 개수. 900px 미만에서는 링크가 별도 줄을 차지한다.
- 표제지는 2px 잉크 구분선 아래에 둔다. 제목은 1~8열, 그 아래 "장편소설", 저자는 페이지 아래쪽에 둔다. 주문 정보는 바깥 여백(10~12열, 1080px 미만에서는 9~12열, 바닥이 저자 줄과 같은 높이)에 둔다. 판권 정보는 1px 구분선 위 바닥에 둔다. 제목, 저자, 가격, '양장본 주문하기'는 1280x800 노트북 첫 화면에 모두 들어와야 한다.
- 첫 대목은 5~9열에 둔다. 권두 인용문이 놓일 자리다.
- 900px 미만에서는 모든 요소가 전체 컬럼을 차지하며, 주문 정보는 저자 뒤에 온다.

COMPONENTS:
- 펼침면: 130쪽과 131쪽을 흰 종이 한 장에 놓고, 바깥 둘레와 가운데 여백을 따라 1px 선을 두른다. 러닝 헤드는 Spectral 이탤릭 300, 쪽 번호는 올드스타일 숫자의 Spectral 300, 둘 다 흐리게. 900px 미만에서는 한 쪽만 보인다. 휴대폰에서는 종이가 화면 가장자리까지 펼쳐진다.
- 저자 소개: 왼쪽에는 Spectral로 짠 두 문단, 오른쪽에는 구분선을 두른 정의 목록(dl)으로 된 기본 정보.
- 판본 선택: 구분선 표로 그린 라디오 그룹 (판본, 쪽수, ISBN, 출간일, 가격). 20px 사각형이 행을 표시한다. 선택된 행은 흰색 바탕에 왼쪽 3px 잉크 구분선과 채워진 사각형. 900px 미만에서는 각 행이 자체 라벨과 함께 세로로 쌓인다. 판본을 고르면 주문 행이 바뀐다: 이름, 가격, 버튼 라벨 (양장본 장바구니에 담기, 페이퍼백 예약 주문하기, 전자책 장바구니에 담기). 버튼은 장바구니에 담고, 매장 바의 개수를 갱신하며, 정중한 상태 메시지로 알린다.
- 서평: 인용문은 1~8열, 평자, 이탤릭 매체명, 날짜는 여백에 둔다.
- 낭독회: 저녁 하나당 구분선 행 하나 (큰 날짜, 서점과 주소, 남은 자리 정보, 동작). "자리 예약하기"를 누르면 행 아래에 짧은 양식이 열린다 (이름, 이메일, 1명 또는 2명을 사각형 두 개로 선택). 오류는 해당 입력란 아래에 표시하고, 유효한 예약은 양식을 포커스를 받는 확인 메시지로 바꾸며, 남은 자리 수를 줄인다.
- 바닥글은 2px 잉크 구분선 아래에 둔다: 출판사 소개 문장, 주소, 한 줄 밑줄 입력란과 텍스트 버튼으로 된 소식지 구독. 유효한 이메일은 포커스를 받는 확인 메시지로 바뀐다.
- 버튼은 잉크색 직사각형에 바탕색 글자, 높이 48px. 호버 시 바탕색으로 바뀌고 글자는 잉크색이 된다. 양식이 열려 있는 동안 "자리 예약하기"는 외곽선으로 그린다. 본문 링크는 잉크색 밑줄이며 호버 시 밑줄이 두꺼워진다. 바의 링크는 흐리게 두었다가 호버 시 잉크색과 밑줄로 바뀐다.
- 포커스: 2px 잉크색 외곽선, 컨트롤에서 2~3px 떨어뜨린다. 라디오 행은 행 전체를 둘러싸서 표시한다. 포커스를 받는 확인 메시지는 6px 떨어뜨려 표시한다.
- 모서리는 모두 직각, 선은 1px, 그림자 금지.

MOTION:
- 호버 시 160ms 색 변화만 준다. 스스로 움직이는 것은 없다. prefers-reduced-motion에서는 전환을 없앤다.

FORBIDDEN:
- 카드, 둥근 상자, 필(pill), 칩, 배지, 그림자, 색 패널 금지.
- 제목 위의 작은 라벨, 전부 대문자에 자간을 넓힌 라벨, 번호 매긴 섹션 표식 금지.
- 강조색, 색깔 링크, 그라데이션 금지.
- 책 표지 이미지, 일러스트, 사진, 장식, 이미지로 그린 드롭캡, 이모지 금지.
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 번호 금지.
- 여백, 침묵, 절제, 디자인에 관한 문구 금지.

OUTPUT:
1) 위 토큰을 담은 CSS 커스텀 속성
2) 의미를 살린 HTML: 판본과 인원에는 라디오 그룹, 첫 대목과 서평에는 blockquote와 figcaption을 쓴 figure, 라벨이 붙은 양식
3) 실시간 가격, 버튼 라벨, 장바구니 개수가 바뀌는 판본 선택기. 예약 양식과 구독 양식은 오류와 성공 메시지가 나온다.
4) 320px까지 반응형, 가로 스크롤 없음, 제목이 단어 중간에서 끊기지 않음
5) 모든 컨트롤에 보이는 포커스, 휴대폰에서 컨트롤 높이 최소 44px, reduced-motion 지원`;

const PROMPT_JA = `Editorial Silence スタイルで実在するページを1枚デザインする。ほぼ白い紙面に、ほぼ全面を活字で組み、広い余白、軽いセリフ体の見出しと落ち着いたサンセリフ体の本文、ほぼ黒のインク、色は使わない。

もっともらしいテーマを選ぶ。ページの大部分が読むための内容であるもの（小出版社の小説、詩の小冊子、美術館の図録の随筆など）とし、実際の内容を書く。そのページはテーマそのもののページとして読めなければならず、スタイル自体についてのページに見えてはならない。ここでは、コルチェスターの年4冊の出版社Weir Houseから出たClare Avenellのデビュー小説 The Salt Year を扱う。注文情報のある表題ページ、冒頭部分、7月の章の見開き2ページ、著者、三つの版、書評三件、書店の朗読会二件を載せる。

TOKENS:
--paper: #f8f8f8 （ページ）
--sheet: #ffffff （見開き、選ばれた版の行、ラジオの四角）
--surface: #ffffff （不透明。ページの上に開くメニュー用）
--ink: #1c1c1e
--muted: #52525b （注記、住所、列見出し、プレースホルダー）
--line: rgba(28,28,30,0.3)
--error: #a1281e

COLOUR:
- ほぼ白い地にインクとグレー。何かを開く罫線はインク色にする。表題ページと底部の上は2px、各セクション、注文情報、版の表、朗読会の上、そしてすべてのテキスト欄の下は1px。その他の線はすべて --line。
- 色は --error のみ。エラーメッセージと、失敗した入力欄の2px下線にのみ使う。アクセントカラー、色付きの背景、グラデーションは禁止。

TYPOGRAPHY:
フォントは3系統。Spectral（200、300、400、イタリック200と300）は本に属するすべてを組む。Spectral SC（300）は章の最初の語をスモールキャピタルで組む。Instrument Sans（400、500）は店舗に属するすべて（注記、ISBN、時刻、フォーム、ボタン）を組む。
タイトル: Spectral 200、clamp(4.5rem, 12.4vw, 11rem)、line-height 0.86、letter-spacing -0.045em、ノートPCとスマートフォンで2行。
出版社名: Spectral 400、1.5rem（スマートフォンでは1.375rem）。
"長編小説": Spectral イタリック 300、clamp(1.25rem, 1.8vw, 1.5rem)。著者: Spectral 300、clamp(2rem, 3.4vw, 2.875rem)、letter-spacing -0.03em。
H2: Spectral 200、clamp(2.25rem, 3.8vw, 3.25rem)、line-height 1.05、letter-spacing -0.035em。
冒頭部分: Spectral 300、clamp(1.1875rem, 1.6vw, 1.375rem)、line-height 1.65。見開きの本文: Spectral 300、1.1875rem、line-height 1.72、段落は1.4emの字下げ、最初の段落のみ字下げなし。章見出し: Spectral イタリック 300、2.75rem（スマートフォンでは2.25rem）、112pxの下げ（スマートフォンでは56px）。
書評: 最初の一件はSpectral イタリック 200、clamp(1.625rem, 2.6vw, 2.25rem)、残りはイタリック 300、clamp(1.25rem, 1.7vw, 1.4375rem)。始めの引用符はぶら下げる。
著者と出版社の紹介: Spectral 300、1.25rem。確認メッセージ: Spectral 300、予約後は1.375rem、登録後は1.25rem。
価格: Spectral 300、表題ページと注文行では2.375rem（スマートフォンでは2.125rem）、版の行では1.75rem（スマートフォンでは1.5rem）。朗読会の日付: Spectral 200、clamp(2.375rem, 3.8vw, 3.25rem)。版名: Spectral 400、1.75rem（スマートフォンでは1.5rem）。書店名: 400、1.5rem。
店舗の本文: Instrument Sans 400、1.0625rem、line-height 1.6。注記は1rem。500は強調が必要な数語とボタンだけに使う。本文はオールドスタイル数字、価格と日付はライニング数字、ISBNは等幅数字。1rem未満の文字は禁止。全大文字で字間を空けたラベルは禁止。
見出しは語の途中で改行しない（韓国語は word-break: keep-all、日本語の見出しは auto-phrase）。

LAYOUT:
- 12カラムグリッド、ガター24px（スマートフォンでは16px）、幅1120pxのコラム。セクションの間隔は136px（900px未満では104px、スマートフォンでは80px）。各セクションは1pxのインク罫線で始め、左にH2、8カラム目から短い注記を置く。
- ショップバー: 出版社名、ページ内リンク3つ、カートの件数。900px未満ではリンクが別の行に入る。
- 表題ページは2pxのインク罫線の下に置く。タイトルは1〜8カラム、その下に "長編小説"、著者はページの下の方に置く。注文情報は外側の余白（10〜12カラム、1080px未満では9〜12カラム、足元は著者の行と同じ高さ）に置く。奥付は1pxの罫線の上で下部に置く。タイトル、著者、価格、「ハードカバーを注文」は1280x800のノートPCの最初の画面に全て収まる。
- 冒頭部分は5〜9カラムに置く。エピグラフが置かれる位置である。
- 900px未満ではすべての要素が全幅のコラムを使い、注文情報は著者の後に続く。

COMPONENTS:
- 見開き: 130ページと131ページを白い紙面に置き、周囲と中央の綴じ目に沿って1pxの線を引く。ランニングヘッドはSpectral イタリック 300、ノンブルはSpectral 300のオールドスタイル数字、どちらも控えめに。900px未満では1ページのみ表示。スマートフォンでは紙面が画面の端まで広がる。
- 著者紹介: 左にSpectralで組んだ2段落、右に罫線付きの定義リストとして基本情報。
- 版の選択: 罫線付きの表として描いたラジオグループ（版、ページ数、ISBN、刊行日、価格）。20pxの四角が行を示す。選ばれた行は白地で、左に3pxのインク罫線と塗りつぶしの四角。900px未満では各行が自前のラベルとともに縦に積まれる。版を選ぶと注文行が変わる：名称、価格、ボタンのラベル（ハードカバーをカートに入れる、ペーパーバックを予約注文、電子書籍をカートに入れる）。ボタンはカートに追加し、ショップバーの件数を更新して、丁寧なステータス行でそれを伝える。
- 書評: 引用は1〜8カラム、評者、イタリックの掲載紙、日付は余白に置く。
- 朗読会: 1夜につき罫線付きの行1つ（大きな日付、書店と住所、残席の扱い、操作）。「席を予約する」を押すと行の下に短いフォームが開く（お名前、メールアドレス、1名または2名を二つの四角で選択）。エラーは該当する欄の下に出す。有効な予約はフォームを、フォーカスを受ける確認表示に置き換え、残席は減る。
- フッターは2pxのインク罫線の下に置く。出版社の紹介文、住所、そして下線1本の入力欄とテキストボタンによるお知らせ登録。有効なメールアドレスは、フォーカスを受ける確認表示に置き換える。
- ボタンは紙色の文字を載せたインクの長方形、高さ48px。ホバーで紙色に変わり、文字はインク色になる。フォームが開いている間、「席を予約する」は輪郭線で描く。本文のリンクはインク色の下線、ホバーで線が太くなる。バーのリンクは控えめで、ホバーでインク色と下線になる。
- フォーカス: 2pxのインク色の輪郭線を、コントロールから2〜3px離して表示する。ラジオの行は行全体を囲んで表示する。フォーカスを受ける確認表示は6px離して表示する。
- 角は全て直角、線は1px、影は使わない。

MOTION:
- ホバー時は160msの色の変化のみ。自ら動くものはない。prefers-reduced-motion では遷移をなくす。

FORBIDDEN:
- カード、角丸の箱、ピル型、チップ、バッジ、影、色付きパネルは禁止。
- 見出しの上の小さなラベル、全大文字で字間を広げたラベル、番号付きのセクション記号は禁止。
- アクセントカラー、色付きのリンク、グラデーションは禁止。
- 本の表紙画像、イラスト、写真、装飾、画像として描いたドロップキャップ、絵文字は禁止。
- リンクの矢印、中黒（・）で繋いだメタ情報の文字列、実際の順序ではないものへの番号は禁止。
- 余白、沈黙、抑制、デザインについての文言は禁止。

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML: 版と人数にはラジオグループ、冒頭部分と書評にはblockquoteとfigcaptionを使ったfigure、ラベル付きのフォーム
3) 価格、ボタンのラベル、カートの件数がリアルタイムで変わる版の選択。予約フォームと登録フォームは、エラーと成功のメッセージを出す。
4) 320pxまで対応するレスポンシブレイアウト。横スクロールなし、見出しが語の途中で折り返されないこと
5) 全コントロールに見えるフォーカス、スマートフォンでは高さ44px以上、reduced-motion対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type ReserveErrors = { name: boolean; email: boolean };

export function PortedEditorialSilencePage({ lang }: PortedStylePageProps) {
  const [editionId, setEditionId] = useState<EditionId>('hardback');
  const [basket, setBasket] = useState(0);
  const [basketNews, setBasketNews] = useState('');

  const [reserveOpen, setReserveOpen] = useState(false);
  const [guest, setGuest] = useState({ name: '', email: '', seats: 1 });
  const [reserveErrors, setReserveErrors] = useState<ReserveErrors>({ name: false, email: false });
  const [reserved, setReserved] = useState<{ name: string; email: string; seats: number } | null>(null);

  const [letterEmail, setLetterEmail] = useState('');
  const [letterError, setLetterError] = useState(false);
  const [letterDone, setLetterDone] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const reservedRef = useRef<HTMLParagraphElement>(null);
  const letterRef = useRef<HTMLInputElement>(null);
  const letterDoneRef = useRef<HTMLParagraphElement>(null);

  const t = (text: Tri) => text[lang];

  const edition = EDITIONS.find((item) => item.id === editionId) ?? EDITIONS[0];
  const hardback = EDITIONS[0];

  // A confirmation replaces the form that had focus, so focus moves to it.
  useEffect(() => {
    if (reserved) reservedRef.current?.focus();
  }, [reserved]);

  useEffect(() => {
    if (letterDone) letterDoneRef.current?.focus();
  }, [letterDone]);

  const addToBasket = () => {
    const n = basket + 1;
    setBasket(n);
    setBasketNews(fill(t(n === 1 ? EDS.addedOne : EDS.addedMany), { item: t(edition.item), n }));
  };

  const reserve = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { name: guest.name.trim() === '', email: !EMAIL.test(guest.email.trim()) };
    if (!next.name && !next.email) {
      setReserveErrors(next);
      setReserved({ name: guest.name.trim(), email: guest.email.trim(), seats: guest.seats });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the fixed page bar.
    flushSync(() => setReserveErrors(next));
    const field = next.name ? nameRef.current : emailRef.current;
    field?.focus();
    field?.parentElement?.scrollIntoView({ block: 'nearest' });
  };

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = letterEmail.trim();
    if (EMAIL.test(value)) {
      setLetterError(false);
      setLetterDone(value);
      return;
    }
    flushSync(() => setLetterError(true));
    letterRef.current?.focus();
    letterRef.current?.closest('form')?.scrollIntoView({ block: 'nearest' });
  };

  const placesLeft = (reading: Reading) => (reading.places ? reading.places.left - (reserved ? reserved.seats : 0) : 0);

  return (
    <FusionShell
      fusionId="editorial-silence"
      lang={lang}
      accent="#1c1c1e"
      prev={{ href: '/pages/brutalist-grid.html', label: 'Brutalist Grid' }}
      next={{ href: '/pages/kinetic-pop.html', label: 'Kinetic Pop' }}
      prompts={PROMPTS}
    >
      <div className="sy">
        <header className="sy-bar">
          <p className="sy-mark">{PRESS}</p>
          <nav className="sy-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#sy-excerpt">{t(BAR.extract)}</a>
            <a href="#sy-editions">{t(BAR.editions)}</a>
            <a href="#sy-readings">{t(BAR.readings)}</a>
          </nav>
          <p className="sy-basket">{fill(t(BAR.basket), { n: basket })}</p>
        </header>

        <section className="sy-tp" aria-labelledby="sy-title">
          <h1 className="sy-title" id="sy-title">{TITLE}</h1>
          <p className="sy-kind">{t(TITLE_PAGE.kind)}</p>
          <p className="sy-author">{AUTHOR}</p>
          <div className="sy-buy">
            <p className="sy-buy__what">{t(TITLE_PAGE.what)}</p>
            <p className="sy-buy__price">{money(hardback.price)}</p>
            <p className="sy-buy__when">{t(TITLE_PAGE.when)}</p>
            <a className="sy-btn" href="#sy-editions" onClick={() => setEditionId('hardback')}>{t(TITLE_PAGE.order)}</a>
            <p className="sy-buy__also">
              <a className="sy-link" href="#sy-editions" onClick={() => setEditionId('paperback')}>{t(TITLE_PAGE.also)}</a>
            </p>
          </div>
          <p className="sy-imprint">
            <span>{t(TITLE_PAGE.place)}</span>
            <span>2026</span>
          </p>
        </section>

        <figure className="sy-opening">
          <blockquote>
            <p className="sy-opening__chap">{t(OPENING.chap)}</p>
            <p className="sy-opening__text">{rich(t(OPENING.text))}</p>
          </blockquote>
          <figcaption>
            <span>{t(OPENING.note)}</span>
            <a className="sy-link" href="#sy-excerpt">{t(OPENING.link)}</a>
          </figcaption>
        </figure>

        <section className="sy-sec" id="sy-excerpt" aria-labelledby="sy-excerpt-title">
          <div className="sy-head">
            <h2 id="sy-excerpt-title">{t(EXCERPT.title)}</h2>
            <p className="sy-intro">{t(EXCERPT.intro)}</p>
          </div>
          <div className="sy-spread">
            <article className="sy-leaf" aria-label={fill(t(EXCERPT.page), { n: 130 })}>
              <p className="sy-rh" aria-hidden="true" />
              <h3 className="sy-leaf__chap">{t(EXCERPT.chap)}</h3>
              <div className="sy-leaf__text">
                {EXCERPT.left.map((paragraph) => <p key={paragraph.en.slice(0, 24)}>{rich(t(paragraph))}</p>)}
              </div>
              <p className="sy-folio" aria-hidden="true">130</p>
            </article>
            <article className="sy-leaf" aria-label={fill(t(EXCERPT.page), { n: 131 })}>
              <p className="sy-rh" aria-hidden="true">{t(EXCERPT.chap)}</p>
              <div className="sy-leaf__text sy-leaf__text--flush">
                {EXCERPT.right.map((paragraph) => <p key={paragraph.en.slice(0, 24)}>{rich(t(paragraph))}</p>)}
              </div>
              <p className="sy-folio" aria-hidden="true">131</p>
            </article>
          </div>
          <p className="sy-spread__note">
            <span>{t(EXCERPT.pages)}</span>
            <span>{t(EXCERPT.same)}</span>
          </p>
        </section>

        <section className="sy-sec" id="sy-author" aria-labelledby="sy-author-title">
          <div className="sy-head">
            <h2 id="sy-author-title">{fill(t(ABOUT.title), { author: AUTHOR })}</h2>
          </div>
          <div className="sy-about">
            <div className="sy-bio">
              {ABOUT.bio.map((paragraph) => <p key={paragraph.en.slice(0, 24)}>{rich(t(paragraph))}</p>)}
            </div>
            <dl className="sy-facts">
              {ABOUT.facts.map((fact) => (
                <div key={fact.key.en}>
                  <dt>{t(fact.key)}</dt>
                  <dd>{rich(t(fact.value))}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="sy-sec" id="sy-editions" aria-labelledby="sy-editions-title">
          <div className="sy-head">
            <h2 id="sy-editions-title">{t(EDS.title)}</h2>
            <p className="sy-intro">{t(EDS.intro)}</p>
          </div>
          <fieldset className="sy-eds">
            <legend className="sy-sr">{t(EDS.legend)}</legend>
            <div className="sy-eds__th" aria-hidden="true">
              <span>{t(EDS.colEdition)}</span>
              <span>{t(EDS.colPages)}</span>
              <span>{t(EDS.colIsbn)}</span>
              <span>{t(EDS.colPublished)}</span>
              <span>{t(EDS.colPrice)}</span>
            </div>
            {EDITIONS.map((item) => (
              <label key={item.id} className={`sy-ed${item.id === editionId ? ' is-on' : ''}`}>
                <input
                  className="sy-sr"
                  type="radio"
                  name="sy-edition"
                  value={item.id}
                  checked={item.id === editionId}
                  onChange={() => setEditionId(item.id)}
                />
                <span className="sy-ed__box" aria-hidden="true" />
                <span className="sy-ed__nm">
                  <span className="sy-ed__name">{t(item.name)}</span>
                  <span className="sy-ed__desc">{t(item.desc)}</span>
                </span>
                <span className="sy-ed__cells">
                  <span className="sy-ed__cell">
                    <span className="sy-ed__k">{t(EDS.colPages)} </span>
                    <span className="sy-ed__v">
                      {item.pages}
                      {item.pagesNote ? <span className="sy-ed__small"> {t(item.pagesNote)}</span> : null}
                    </span>
                  </span>
                  <span className="sy-ed__cell">
                    <span className="sy-ed__k">{t(EDS.colIsbn)} </span>
                    <span className="sy-ed__v sy-ed__isbn">{item.isbn}</span>
                  </span>
                  <span className="sy-ed__cell">
                    <span className="sy-ed__k">{t(EDS.colPublished)} </span>
                    <span className="sy-ed__v">
                      {t(item.published)}
                      {item.publishedNote ? <span className="sy-ed__small"> {t(item.publishedNote)}</span> : null}
                    </span>
                  </span>
                </span>
                <span className="sy-ed__price">{money(item.price)}</span>
              </label>
            ))}
          </fieldset>
          <div className="sy-order">
            <div className="sy-order__act">
              <p className="sy-order__sum">
                <span className="sy-order__item">{t(edition.item)}</span>
                <span className="sy-order__price">{money(edition.price)}</span>
              </p>
              <button className="sy-btn" type="button" onClick={addToBasket}>{t(edition.action)}</button>
            </div>
            <p className="sy-order__note">{t(EDS.note)}</p>
            <p className="sy-order__status" role="status">{basketNews}</p>
          </div>
        </section>

        <section className="sy-sec" id="sy-reviews" aria-labelledby="sy-reviews-title">
          <div className="sy-head">
            <h2 id="sy-reviews-title">{t(REVIEWS.title)}</h2>
          </div>
          {REVIEWS.quotes.map((quote, index) => (
            <figure key={quote.by} className={`sy-quote${index === 0 ? ' sy-quote--lead' : ''}`}>
              <blockquote>
                <p>{t(quote.text)}</p>
              </blockquote>
              <figcaption>
                <span className="sy-quote__by">{quote.by}</span>
                <cite>{quote.paper}</cite>
                <time dateTime={quote.dateTime}>{t(quote.date)}</time>
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="sy-sec" id="sy-readings" aria-labelledby="sy-readings-title">
          <div className="sy-head">
            <h2 id="sy-readings-title">{t(READ.title)}</h2>
            <p className="sy-intro">{t(READ.intro)}</p>
          </div>
          <ul className="sy-events">
            {READINGS.map((reading) => {
              const booking = Boolean(reading.places);
              return (
                <li key={reading.id} className="sy-event">
                  <p className="sy-event__date">
                    <time className="sy-event__day" dateTime={reading.dateTime}>{t(reading.day)}</time>
                    <span className="sy-event__time">{t(reading.time)}</span>
                  </p>
                  <div className="sy-event__where">
                    <h3 className="sy-event__shop">{reading.shop}</h3>
                    <p className="sy-event__addr">
                      {reading.street} <span className="sy-nw">{reading.postcode}</span>
                    </p>
                  </div>
                  <div className="sy-event__what">
                    <p>{t(reading.what)}</p>
                    <p className="sy-event__note">
                      {t(reading.note)}
                      {reading.places ? ` ${fill(t(READ.left), { left: placesLeft(reading), total: reading.places.total })}` : null}
                    </p>
                  </div>
                  {booking ? (
                    <div className="sy-event__act">
                      {reserved ? (
                        <p className="sy-event__held">{t(reserved.seats === 1 ? READ.heldOne : READ.heldTwo)}</p>
                      ) : (
                        <button
                          className={`sy-btn${reserveOpen ? ' sy-btn--line' : ''}`}
                          type="button"
                          aria-expanded={reserveOpen}
                          aria-controls="sy-reserve"
                          onClick={() => setReserveOpen(!reserveOpen)}
                        >
                          {t(READ.reserve)}
                        </button>
                      )}
                    </div>
                  ) : null}
                  {booking ? (
                    <div className="sy-reserve" id="sy-reserve" hidden={!reserveOpen && !reserved}>
                      {reserved ? (
                        <div className="sy-done">
                          <p className="sy-done__title" ref={reservedRef} tabIndex={-1}>
                            {fill(t(reserved.seats === 1 ? READ.doneOne : READ.doneTwo), { name: reserved.name, shop: reading.shop })}
                          </p>
                          <p className="sy-done__body">{fill(t(READ.doneBody), { email: reserved.email })}</p>
                        </div>
                      ) : (
                        <form className="sy-form" noValidate onSubmit={reserve} aria-label={fill(t(READ.formTitle), { shop: reading.shop })}>
                          <div className={`sy-field${reserveErrors.name ? ' is-invalid' : ''}`}>
                            <label htmlFor="sy-name">{t(READ.name)}</label>
                            <input
                              id="sy-name"
                              ref={nameRef}
                              type="text"
                              autoComplete="name"
                              required
                              value={guest.name}
                              aria-invalid={reserveErrors.name || undefined}
                              aria-describedby={reserveErrors.name ? 'sy-name-error' : undefined}
                              onChange={(event) => {
                                setGuest({ ...guest, name: event.target.value });
                                if (reserveErrors.name) setReserveErrors({ ...reserveErrors, name: false });
                              }}
                            />
                            {reserveErrors.name ? <p className="sy-error" id="sy-name-error" role="alert">{t(READ.nameError)}</p> : null}
                          </div>
                          <div className={`sy-field${reserveErrors.email ? ' is-invalid' : ''}`}>
                            <label htmlFor="sy-email">{t(READ.email)}</label>
                            <input
                              id="sy-email"
                              ref={emailRef}
                              type="email"
                              autoComplete="email"
                              required
                              value={guest.email}
                              aria-invalid={reserveErrors.email || undefined}
                              aria-describedby={reserveErrors.email ? 'sy-email-error' : undefined}
                              onChange={(event) => {
                                setGuest({ ...guest, email: event.target.value });
                                if (reserveErrors.email) setReserveErrors({ ...reserveErrors, email: false });
                              }}
                            />
                            {reserveErrors.email ? <p className="sy-error" id="sy-email-error" role="alert">{t(READ.emailError)}</p> : null}
                          </div>
                          <fieldset className="sy-seats" aria-describedby="sy-seats-note">
                            <legend>{t(READ.places)}</legend>
                            {[1, 2].map((seats) => (
                              <label key={seats} className={`sy-seat${guest.seats === seats ? ' is-on' : ''}`}>
                                <input
                                  className="sy-sr"
                                  type="radio"
                                  name="sy-seats"
                                  value={seats}
                                  checked={guest.seats === seats}
                                  onChange={() => setGuest({ ...guest, seats })}
                                />
                                <span className="sy-ed__box" aria-hidden="true" />
                                {t(seats === 1 ? READ.one : READ.two)}
                              </label>
                            ))}
                            <p className="sy-seats__note" id="sy-seats-note">{t(READ.most)}</p>
                          </fieldset>
                          <button className="sy-btn sy-form__submit" type="submit">{t(guest.seats === 1 ? READ.submitOne : READ.submitTwo)}</button>
                        </form>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="sy-foot">
          <p className="sy-press">{rich(t(FOOT.press))}</p>
          <p className="sy-address">
            <span className="sy-address__name">{PRESS}</span>
            {ADDRESS.map((line) => <span key={line}>{line}</span>)}
          </p>
          {letterDone ? (
            <p className="sy-signup__done" ref={letterDoneRef} tabIndex={-1}>{fill(t(FOOT.done), { email: letterDone })}</p>
          ) : (
            <form className={`sy-signup${letterError ? ' is-invalid' : ''}`} noValidate onSubmit={signUp}>
              <label htmlFor="sy-letter">{t(FOOT.letter)}</label>
              <div className="sy-signup__row">
                <input
                  id="sy-letter"
                  ref={letterRef}
                  type="email"
                  autoComplete="email"
                  placeholder={t(FOOT.placeholder)}
                  value={letterEmail}
                  aria-invalid={letterError || undefined}
                  aria-describedby={letterError ? 'sy-letter-error' : undefined}
                  onChange={(event) => {
                    setLetterEmail(event.target.value);
                    if (letterError) setLetterError(false);
                  }}
                />
                <button type="submit">{t(FOOT.signUp)}</button>
              </div>
              {letterError ? <p className="sy-error" id="sy-letter-error" role="alert">{t(FOOT.error)}</p> : null}
            </form>
          )}
        </footer>
      </div>
    </FusionShell>
  );
}
