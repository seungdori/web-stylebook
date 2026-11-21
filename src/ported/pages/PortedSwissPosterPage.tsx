import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedSwissPosterPage.css';

// The exhibition page of Museum Kleinbasel for "Ruth Vogt, Posters 1958–1974", in the
// Swiss Poster style. One grotesk, Arimo (drawn to Helvetica's metrics), at every size:
// the name cut to the width of a white poster sheet, bold figures for catalogue numbers,
// hours, prices and talk dates, the regular cut for reading. Components come from a
// museum's exhibition page: the poster itself with crop marks, a room-by-room works list
// with catalogue numbers and a miniature of each sheet, one timetable for hours and
// prices beside the ticket form, and the Thursday talks as a dated list. Red marks only
// the circle in the name, today, the next talk, the ticket buttons and errors.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const MUSEUM = 'Museum Kleinbasel';
const ADDRESS = 'Clarastrasse 21, 4058 Basel';
const PHONE = '+41 61 555 21 40';
const EMAIL = 'info@museum-kleinbasel.ch';
const YEARS = '1958–1974';

// The page is set on Saturday 21 November 2026. Booking runs from today to the last day.
const TODAY = '2026-11-21';
const LAST_DAY = '2027-01-24';
const CLOSED_DATES = ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'];
const PRICES = { adult: 16, concession: 10 } as const;
const MAX_TICKETS = 9;
const SEATS = 60;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const HEAD = {
  nav: { en: 'Museum', ko: '미술관', ja: '美術館' },
  works: { en: 'Works', ko: '작품', ja: '作品' },
  visit: { en: 'Visit', ko: '방문', ja: '来館' },
  talks: { en: 'Talks', ko: '강연', ja: 'トーク' },
  tickets: { en: 'Tickets', ko: '입장권', ja: 'チケット' },
} satisfies Record<string, Tri>;

const POSTER = {
  posters: { en: 'Posters', ko: '포스터', ja: 'ポスター' },
  from: { en: '18 September 2026', ko: '2026년 9월 18일', ja: '2026年9月18日' },
  to: { en: 'to 24 January 2027', ko: '2027년 1월 24일까지', ja: '2027年1月24日まで' },
  buy: { en: 'Buy tickets', ko: '입장권 예약', ja: 'チケットを予約' },
} satisfies Record<string, Tri>;

const INTRO = {
  lede: {
    en: 'Ruth Vogt printed 212 posters in Basel between 1958 and 1974, for concert halls, theatres, the tram company and the shops on her own street. Forty of them hang together here for the first time, lent by her estate and by eleven collections.',
    ko: 'Ruth Vogt는 1958년부터 1974년까지 바젤에서 포스터 212점을 찍었습니다. 음악 공연장, 극장, 트램 회사, 그리고 그녀의 거리에 있던 상점들을 위한 작업이었습니다. 그중 40점이 이곳에 처음으로 함께 걸립니다. 유족과 11곳의 소장처가 빌려주었습니다.',
    ja: 'Ruth Vogtは1958年から1974年まで、バーゼルで212点のポスターを制作しました。コンサートホール、劇場、トラム会社、そして彼女の通りの店のためのものです。そのうち40点が、ここで初めて一堂に展示されます。遺族と11のコレクションからの貸し出しです。',
  },
  body: {
    en: 'They hang in the order she made them, from the linocuts of her first year to the large offset sheets of the 1970s. Next to them are her pencil sketches, colour proofs with the printer’s notes in the margin, and the wooden letters she cut by hand for Musica Viva in 1958.',
    ko: '작품은 그녀가 만든 순서대로 걸립니다. 첫해의 리노컷에서 1970년대의 대형 오프셋 판까지입니다. 그 곁에는 연필 스케치, 여백에 인쇄소의 메모가 적힌 색 교정쇄, 그리고 그녀가 1958년 Musica Viva를 위해 손으로 깎은 나무 활자가 놓입니다.',
    ja: '作品は制作順に並んでいます。初年度のリノカットから、1970年代の大判オフセットまで。その隣には、鉛筆のスケッチ、余白に印刷所の注記がある色校正、そして1958年にMusica Vivaのために彼女が手で彫った木活字があります。',
  },
  where: { en: 'Where', ko: '장소', ja: '場所' },
  hall: { en: 'Hall 2, ground floor', ko: '1층 2번 홀', ja: '1階 第2ホール' },
  today: { en: 'Open today, Saturday', ko: '오늘 개관, 토요일', ja: '本日開館、土曜日' },
  todayHours: { en: '10:00 to 18:00', ko: '10:00~18:00', ja: '10:00〜18:00' },
  admission: { en: 'Admission', ko: '관람료', ja: '入場料' },
  admissionValue: { en: 'CHF 16, under 16 free', ko: 'CHF 16, 16세 미만 무료', ja: 'CHF 16、16歳未満無料' },
} satisfies Record<string, Tri>;

const WORKS = {
  title: { en: 'Works', ko: '작품', ja: '作品' },
  note: {
    en: 'Forty posters in four rooms. Sheets are 128 × 90.5 cm, the size of a Basel billboard, unless noted.',
    ko: '네 개 전시실에 포스터 40점이 걸립니다. 판은 128 × 90.5 cm로, 바젤 빌보드와 같은 크기이며, 다른 크기는 따로 표기했습니다.',
    ja: '4つの展示室に40点のポスター。判型は特記がない限り128 × 90.5 cmで、バーゼルの広告塔と同じ大きさです。',
  },
  rooms: { en: 'Rooms', ko: '전시실', ja: '展示室' },
  room: { en: 'Room {n}', ko: '{n}전시실', ja: '展示室{n}' },
  list: { en: 'Room {n}, {years}', ko: '{n}전시실, {years}', ja: '展示室{n}、{years}' },
  cat: { en: 'Cat.', ko: '번호', ja: '番号' },
  sheet: { en: 'Sheet', ko: '포스터', ja: 'ポスター' },
  work: { en: 'Title', ko: '제목', ja: 'タイトル' },
  year: { en: 'Year', ko: '연도', ja: '年' },
  client: { en: 'Client', ko: '의뢰처', ja: '依頼主' },
  technique: { en: 'Technique', ko: '기법', ja: '技法' },
  next: { en: 'Room {n}, cat. {from} to {to}', ko: '{n}전시실, {from}~{to}번', ja: '展示室{n}、番号{from}〜{to}' },
  back: { en: 'Back to Room 1, cat. {from} to {to}', ko: '1전시실로 돌아가기, {from}~{to}번', ja: '展示室1に戻る、番号{from}〜{to}' },
} satisfies Record<string, Tri>;

const TECH = {
  linoLetter: { en: 'Linocut and letterpress', ko: '리노컷과 활판 인쇄', ja: 'リノカットと活版印刷' },
  letterpress: { en: 'Letterpress', ko: '활판 인쇄', ja: '活版印刷' },
  screen: { en: 'Screen print', ko: '실크스크린', ja: 'シルクスクリーン' },
  screen3: { en: 'Screen print, three colours', ko: '실크스크린, 3색', ja: 'シルクスクリーン、3色' },
  screen4: { en: 'Screen print, four colours', ko: '실크스크린, 4색', ja: 'シルクスクリーン、4色' },
  screen5: { en: 'Screen print, five colours', ko: '실크스크린, 5색', ja: 'シルクスクリーン、5色' },
  screen6: { en: 'Screen print, six colours', ko: '실크스크린, 6색', ja: 'シルクスクリーン、6色' },
  screen12: { en: 'Screen print, twelve colours', ko: '실크스크린, 12색', ja: 'シルクスクリーン、12色' },
  photolitho: { en: 'Photolithograph', ko: '사진석판', ja: '写真石版' },
  offset2: { en: 'Offset, two colours', ko: '오프셋, 2색', ja: 'オフセット、2色' },
  offset3: { en: 'Offset, three colours', ko: '오프셋, 3색', ja: 'オフセット、3色' },
  offset4: { en: 'Offset, four colours', ko: '오프셋, 4색', ja: 'オフセット、4色' },
  offsetPhoto: { en: 'Offset, photograph and two colours', ko: '오프셋, 사진과 2색', ja: 'オフセット、写真と2色' },
} satisfies Record<string, Tri>;

interface Work {
  cat: number;
  /** The German title as printed on the sheet. */
  title: string;
  gloss: Tri | null;
  year: number;
  client: string;
  tech: Tri;
  /** Only when the sheet is not the 128 × 90.5 cm billboard size. */
  size?: string;
  /** What the sheet shows, read in place of its miniature. */
  sheet: Tri;
}

interface Room {
  years: string;
  note: Tri;
  works: Work[];
}

const ROOMS: Room[] = [
  {
    years: '1958–1961',
    note: {
      en: 'The first studio, a single room above a print shop on the Rheinsprung. Vogt cut and printed the early sheets herself, two colours at most.',
      ko: '첫 작업실은 Rheinsprung의 인쇄소 위에 있던 방 한 칸이었습니다. 초기 판은 Vogt가 직접 깎고 찍었으며, 색은 많아야 두 가지였습니다.',
      ja: '最初のスタジオは、Rheinsprungにある印刷所の上の一室でした。初期の判はVogtが自ら彫って刷り、色は多くても2色です。',
    },
    works: [
      { cat: 1, title: 'Musica Viva', gloss: { en: 'First concert of the season', ko: '시즌 첫 연주회', ja: 'シーズン最初の演奏会' }, year: 1958, client: 'Kammerorchester Kleinbasel', tech: TECH.linoLetter, sheet: { en: 'A red circle on black', ko: '검은 바탕의 빨간 원', ja: '黒地に赤い円' } },
      { cat: 2, title: 'Neue Wohnungen', gloss: { en: 'New flats', ko: '새 아파트', ja: '新しい住宅' }, year: 1958, client: 'Wohnbaugenossenschaft Hirzbrunnen', tech: TECH.letterpress, sheet: { en: 'Two black bars over a short red one', ko: '짧은 빨간 막대 위의 검은 막대 두 개', ja: '短い赤い棒の上に黒い棒が二本' } },
      { cat: 3, title: 'Orgelkonzerte im Münster', gloss: { en: 'Organ concerts in the cathedral', ko: '대성당의 오르간 연주회', ja: '大聖堂のオルガン演奏会' }, year: 1959, client: 'Münstergemeinde Basel', tech: TECH.screen, sheet: { en: 'Close black stripes between white bands', ko: '흰 띠 사이의 촘촘한 검은 줄무늬', ja: '白い帯の間の細かい黒い縞' } },
      { cat: 4, title: 'Die Uhr', gloss: { en: 'The clock', ko: '시계', ja: '時計' }, year: 1959, client: 'Uhrenverband Biel', tech: TECH.photolitho, sheet: { en: 'Black rings around a red dot', ko: '빨간 점을 둘러싼 검은 고리', ja: '赤い点を囲む黒い輪' } },
      { cat: 5, title: 'Herbstmesse 1959', gloss: { en: 'Autumn fair', ko: '가을 박람회', ja: '秋の見本市' }, year: 1959, client: 'Messeverein Kleinbasel', tech: TECH.offset2, sheet: { en: 'Red and white, cut on the diagonal', ko: '빨강과 흰색, 대각선으로 자른 면', ja: '赤と白、斜めに切り分けた面' } },
      { cat: 6, title: 'Theater am Rhein', gloss: { en: 'Season 1959/60', ko: '1959/60 시즌', ja: '1959/60シーズン' }, year: 1959, client: 'Theater am Rhein', tech: TECH.screen, sheet: { en: 'A black field over a red line', ko: '빨간 선 위의 검은 면', ja: '赤い線の上の黒い面' } },
      { cat: 7, title: 'Schwarz auf Weiss', gloss: { en: 'Black on white', ko: '흰 바탕의 검정', ja: '白地に黒' }, year: 1960, client: 'Kunsthalle Olten', tech: TECH.letterpress, size: '64 × 45 cm', sheet: { en: 'A black block on white', ko: '흰 바탕의 검은 블록', ja: '白地に黒いブロック' } },
      { cat: 8, title: 'Rheinhafen Kleinhüningen', gloss: { en: 'The Rhine port', ko: '라인 항구', ja: 'ライン河の港' }, year: 1960, client: 'Rheinschifffahrt Basel', tech: TECH.offset2, sheet: { en: 'A red block above black lines', ko: '검은 선 위의 빨간 블록', ja: '黒い線の上の赤いブロック' } },
      { cat: 9, title: 'Jazz im Volkshaus', gloss: { en: 'Jazz at the Volkshaus', ko: 'Volkshaus의 재즈', ja: 'Volkshausのジャズ' }, year: 1961, client: 'Volkshaus Basel', tech: TECH.screen, sheet: { en: 'A red quarter circle meeting a black one', ko: '검은 사분원과 맞닿은 빨간 사분원', ja: '黒い四分円に接する赤い四分円' } },
      { cat: 10, title: 'Mit dem Tram 8 an den Rhein', gloss: { en: 'Take tram 8 to the Rhine', ko: '8번 트램을 타고 강가로', ja: '8番トラムでライン河畔へ' }, year: 1961, client: 'Verkehrsbetriebe Basel', tech: TECH.offset2, sheet: { en: 'A black band across white, with a red block', ko: '흰 바탕을 가로지르는 검은 띠와 빨간 블록', ja: '白地を横切る黒い帯と赤いブロック' } },
    ],
  },
  {
    years: '1962–1965',
    note: {
      en: 'In 1962 Vogt moved to a ground-floor studio on the Klybeckstrasse and began working with the printer Paul Wassermann, who printed for her until 1974. The sheets grow larger and the type moves to the edge.',
      ko: '1962년 Vogt는 Klybeckstrasse의 1층 작업실로 옮겼고, 1974년까지 Vogt의 포스터를 찍은 인쇄업자 Paul Wassermann과 일하기 시작했습니다. 판은 커지고 글자는 가장자리로 옮겨 갑니다.',
      ja: '1962年、Vogtは Klybeckstrasse の1階のスタジオに移り、1974年まで彼女の仕事を刷った印刷業者 Paul Wassermann と組むようになりました。判は大きくなり、文字は端へ寄っていきます。',
    },
    works: [
      { cat: 11, title: 'Junge Schweizer Kunst', gloss: { en: 'Young Swiss art', ko: '젊은 스위스 미술', ja: '若いスイス美術' }, year: 1962, client: 'Kunsthalle Olten', tech: TECH.offset2, sheet: { en: 'A white circle and a red one on black', ko: '검은 바탕의 흰 원과 빨간 원', ja: '黒地の白い円と赤い円' } },
      { cat: 12, title: 'Weniger Lärm', gloss: { en: 'Less noise', ko: '소음을 줄이자', ja: '騒音を減らそう' }, year: 1962, client: 'Gesundheitsamt Basel-Stadt', tech: TECH.offset2, sheet: { en: 'A field of small black dots', ko: '작은 검은 점들이 펼쳐진 면', ja: '小さな黒い点が広がる面' } },
      { cat: 13, title: 'Bücher der Woche', gloss: { en: 'Books of the week', ko: '이번 주의 책', ja: '今週の本' }, year: 1962, client: 'Buchhandlung Krebs', tech: TECH.letterpress, size: '64 × 45 cm', sheet: { en: 'A white block on red', ko: '빨간 바탕의 흰 블록', ja: '赤地に白いブロック' } },
      { cat: 14, title: 'Theater am Rhein', gloss: { en: 'Season 1962/63', ko: '1962/63 시즌', ja: '1962/63シーズン' }, year: 1962, client: 'Theater am Rhein', tech: TECH.screen, sheet: { en: 'A red dot over a black slope', ko: '검은 경사면 위의 빨간 점', ja: '黒い斜面の上の赤い点' } },
      { cat: 15, title: 'Fahr mit dem Tram', gloss: { en: 'Take the tram', ko: '트램을 타세요', ja: 'トラムに乗ろう' }, year: 1963, client: 'Verkehrsbetriebe Basel', tech: TECH.offset3, sheet: { en: 'Black, red and black stripes on white', ko: '흰 바탕의 검정, 빨강, 검정 줄무늬', ja: '白地に黒、赤、黒の縞' } },
      { cat: 16, title: 'Neue Musik im Stadtcasino', gloss: { en: 'New music at the Stadtcasino', ko: 'Stadtcasino의 새 음악', ja: 'Stadtcasinoの新しい音楽' }, year: 1963, client: 'Musik-Forum Basel', tech: TECH.screen, sheet: { en: 'Black and white squares, one inside the other', ko: '겹쳐진 검은 정사각형과 흰 정사각형', ja: '入れ子になった黒と白の正方形' } },
      { cat: 17, title: 'Herbstmesse 1964', gloss: { en: 'Autumn fair', ko: '가을 박람회', ja: '秋の見本市' }, year: 1964, client: 'Messeverein Kleinbasel', tech: TECH.offset4, sheet: { en: 'A red half circle rising from the bottom edge', ko: '아래 가장자리에서 솟아오르는 빨간 반원', ja: '下辺から立ち上がる赤い半円' } },
      { cat: 18, title: 'Milch', gloss: { en: 'Milk', ko: '우유', ja: '牛乳' }, year: 1964, client: 'Milchverband Nordwestschweiz', tech: TECH.photolitho, sheet: { en: 'A large black circle cut by the edge', ko: '가장자리에 잘린 큰 검은 원', ja: '端で切れた大きな黒い円' } },
      { cat: 19, title: 'Velorennen Basel–Olten', gloss: { en: 'Cycle race', ko: '자전거 경주', ja: '自転車レース' }, year: 1965, client: 'Veloclub Kleinbasel', tech: TECH.offset2, sheet: { en: 'Black and white diagonal stripes', ko: '검정과 흰색의 대각선 줄무늬', ja: '黒と白の斜めの縞' } },
      { cat: 20, title: 'Musica Viva 1965/66', gloss: { en: 'Eight concerts', ko: '연주회 8회', ja: '全8回の演奏会' }, year: 1965, client: 'Kammerorchester Kleinbasel', tech: TECH.screen, sheet: { en: 'A red circle over a black line', ko: '검은 선 위의 빨간 원', ja: '黒い線の上の赤い円' } },
    ],
  },
  {
    years: '1966–1970',
    note: {
      en: 'Peter Wyss joined as her assistant in 1967. The studio took on its largest work: the tram company’s campaigns and the theatre’s seasons, printed in up to twelve colours on one press.',
      ko: '1967년 Peter Wyss가 조수로 합류했습니다. 이 시기 작업실은 가장 큰 일을 맡았습니다. 트램 회사의 캠페인과 극장의 시즌 포스터를 한 대의 인쇄기로 최대 12색까지 써서 찍었습니다.',
      ja: '1967年、Peter Wyssが助手として加わりました。この時期、スタジオは最大規模の仕事を引き受けました。トラム会社のキャンペーンと劇場のシーズン・ポスターを、1台の印刷機で最大12色まで使って刷りました。',
    },
    works: [
      { cat: 21, title: 'Theater am Rhein', gloss: { en: 'Season 1966/67', ko: '1966/67 시즌', ja: '1966/67シーズン' }, year: 1966, client: 'Theater am Rhein', tech: TECH.screen6, sheet: { en: 'Black and white halves with a red block', ko: '검은 반과 흰 반, 그리고 빨간 블록', ja: '黒と白の半分と赤いブロック' } },
      { cat: 22, title: 'Plakate aus Polen', gloss: { en: 'Posters from Poland', ko: '폴란드의 포스터', ja: 'ポーランドのポスター' }, year: 1966, client: 'Galerie Riehentor', tech: TECH.offset2, sheet: { en: 'A red circle overlapping a black one', ko: '검은 원과 겹쳐진 빨간 원', ja: '黒い円に重なる赤い円' } },
      { cat: 23, title: 'Linie 14', gloss: { en: 'Line 14', ko: '14번 노선', ja: '14番線' }, year: 1967, client: 'Verkehrsbetriebe Basel', tech: TECH.offset3, sheet: { en: 'Black rings spreading from one corner', ko: '한 모서리에서 퍼져 나가는 검은 고리', ja: '一つの角から広がる黒い輪' } },
      { cat: 24, title: 'Zwölf Farben', gloss: { en: 'Twelve colours', ko: '열두 가지 색', ja: '12色' }, year: 1967, client: 'Druckerei Wassermann', tech: TECH.screen12, sheet: { en: 'Fine black, red and white stripes', ko: '가는 검정, 빨강, 흰색 줄무늬', ja: '細かい黒、赤、白の縞' } },
      { cat: 25, title: 'Jazzfestival Augst', gloss: { en: 'Jazz festival at Augst', ko: 'Augst 재즈 페스티벌', ja: 'アウグストのジャズ・フェスティバル' }, year: 1968, client: 'Jazzverein Augst', tech: TECH.screen4, sheet: { en: 'A small red circle and a large black one', ko: '작은 빨간 원과 큰 검은 원', ja: '小さな赤い円と大きな黒い円' } },
      { cat: 26, title: 'Wohnen heute', gloss: { en: 'Living today', ko: '오늘의 주거', ja: '今日の暮らし' }, year: 1968, client: 'Wohnbaugenossenschaft Hirzbrunnen', tech: TECH.offset2, sheet: { en: 'A black and white chequerboard', ko: '검정과 흰색의 체크무늬', ja: '黒と白の市松模様' } },
      { cat: 27, title: 'Fasnacht 1969', gloss: { en: 'Carnival', ko: '카니발', ja: 'カーニバル' }, year: 1969, client: 'Quartierverein Kleinbasel', tech: TECH.screen5, sheet: { en: 'Black dots over red and white', ko: '빨강과 흰색 위의 검은 점들', ja: '赤と白の上の黒い点' } },
      { cat: 28, title: 'Rheinschwimmen', gloss: { en: 'Swimming in the Rhine', ko: '라인 강 수영', ja: 'ライン河での水泳' }, year: 1969, client: 'Rheinclub Basel', tech: TECH.offset2, sheet: { en: 'A red dot over black and white lines', ko: '검은 선과 흰 선 위의 빨간 점', ja: '黒と白の線の上の赤い点' } },
      { cat: 29, title: 'Die Dreigroschenoper', gloss: { en: 'The Threepenny Opera', ko: '서푼짜리 오페라', ja: '三文オペラ' }, year: 1970, client: 'Theater am Rhein', tech: TECH.screen4, sheet: { en: 'A white bar and a red line on black', ko: '검은 바탕의 흰 막대와 빨간 선', ja: '黒地の白い棒と赤い線' } },
      { cat: 30, title: 'Frauen stimmen', gloss: { en: 'Women vote', ko: '여성 투표', ja: '女性の投票' }, year: 1970, client: 'Aktionskomitee Frauenstimmrecht Basel', tech: TECH.offset2, sheet: { en: 'A white circle on red', ko: '빨간 바탕의 흰 원', ja: '赤地に白い円' } },
    ],
  },
  {
    years: '1971–1974',
    note: {
      en: 'The large offset sheets of the 1970s, with photographs cut into the type. Vogt closed the studio in 1974 and taught lettering in Basel until 1990.',
      ko: '1970년대의 대형 오프셋 판으로, 사진을 글자 사이에 잘라 넣었습니다. Vogt는 1974년 작업실을 닫았고, 1990년까지 바젤에서 레터링을 가르쳤습니다.',
      ja: '1970年代の大判オフセットの作品群で、写真を文字の間に組み込んでいます。Vogtは1974年にスタジオを閉じ、1990年までバーゼルでレタリングを教えました。',
    },
    works: [
      { cat: 31, title: 'Frauenstimmrecht: Ja', gloss: { en: 'Votes for women: yes', ko: '여성 참정권: 찬성', ja: '女性参政権: 賛成' }, year: 1971, client: 'Aktionskomitee Frauenstimmrecht Basel', tech: TECH.offset2, sheet: { en: 'A tall black bar beside a red block', ko: '빨간 블록 옆의 높은 검은 막대', ja: '赤いブロックの横に立つ高い黒い棒' } },
      { cat: 32, title: 'Musica Viva 1971/72', gloss: { en: 'Nine concerts', ko: '연주회 9회', ja: '全9回の演奏会' }, year: 1971, client: 'Kammerorchester Kleinbasel', tech: TECH.offset3, sheet: { en: 'Three circles in a row, the middle one red', ko: '가운데만 빨간 세 개의 원이 나란히', ja: '三つの円が一列に並び、中央だけ赤' } },
      { cat: 33, title: 'Die Stadt am Fluss', gloss: { en: 'The city on the river', ko: '강변의 도시', ja: '川辺の都市' }, year: 1971, client: 'Verkehrsverein Basel', tech: TECH.offsetPhoto, sheet: { en: 'A halftone photograph above a red band', ko: '빨간 띠 위의 하프톤 사진', ja: '赤い帯の上のハーフトーン写真' } },
      { cat: 34, title: 'Rock im Volkshaus', gloss: { en: 'Rock at the Volkshaus', ko: 'Volkshaus의 록', ja: 'Volkshausのロック' }, year: 1972, client: 'Volkshaus Basel', tech: TECH.screen3, sheet: { en: 'Red, black and white quarters turned on the corner', ko: '모서리에서 돌아간 빨강, 검정, 흰색의 사분면', ja: '角で回転する赤、黒、白の四分割' } },
      { cat: 35, title: 'Theater am Rhein', gloss: { en: 'Season 1972/73', ko: '1972/73 시즌', ja: '1972/73シーズン' }, year: 1972, client: 'Theater am Rhein', tech: TECH.offset4, sheet: { en: 'A red circle across a black and white split', ko: '검정과 흰색으로 나뉜 면을 가로지르는 빨간 원', ja: '黒と白に分かれた面を横切る赤い円' } },
      { cat: 36, title: 'Basler Brot', gloss: { en: 'Bread from Basel', ko: '바젤의 빵', ja: 'バーゼルのパン' }, year: 1972, client: 'Bäckermeisterverband Basel', tech: TECH.offset2, sheet: { en: 'A black ring under a red line', ko: '빨간 선 아래의 검은 고리', ja: '赤い線の下の黒い輪' } },
      { cat: 37, title: 'Herbstmesse 1973', gloss: { en: 'Autumn fair', ko: '가을 박람회', ja: '秋の見本市' }, year: 1973, client: 'Messeverein Kleinbasel', tech: TECH.offset4, sheet: { en: 'Red, black and white bands on the diagonal', ko: '대각선 방향의 빨강, 검정, 흰색 띠', ja: '斜めに走る赤、黒、白の帯' } },
      { cat: 38, title: 'Tram 8: letzte Fahrt', gloss: { en: 'Tram 8’s last run', ko: '8번 트램의 마지막 운행', ja: '8番トラム、最終運行' }, year: 1973, client: 'Verkehrsbetriebe Basel', tech: TECH.offset3, sheet: { en: 'A red bar across fine black lines', ko: '가는 검은 선들을 가로지르는 빨간 막대', ja: '細い黒い線を横切る赤い棒' } },
      { cat: 39, title: 'Energie sparen', gloss: { en: 'Save energy', ko: '에너지를 아끼자', ja: '省エネルギー' }, year: 1974, client: 'Elektrizitätswerk Basel', tech: TECH.offset2, sheet: { en: 'A red dot on a white and black split', ko: '흰색과 검정으로 나뉜 면 위의 빨간 점', ja: '白と黒に分かれた面の上の赤い点' } },
      { cat: 40, title: 'Ruth Vogt: Plakate', gloss: { en: 'Ruth Vogt: posters', ko: 'Ruth Vogt: 포스터', ja: 'Ruth Vogt: ポスター' }, year: 1974, client: 'Galerie Riehentor', tech: TECH.screen, sheet: { en: 'A black ring around a red centre', ko: '빨간 중심을 둘러싼 검은 고리', ja: '赤い中心を囲む黒い輪' } },
    ],
  },
];

const VISIT = {
  title: { en: 'Hours and tickets', ko: '관람 시간과 입장권', ja: '開館時間とチケット' },
  note: {
    en: 'Closed on 24, 25 and 31 December and on 1 January. Tram 6, 8 or 14 to Claraplatz, then two minutes on foot.',
    ko: '12월 24일, 25일, 31일과 1월 1일은 휴관합니다. 6, 8, 14번 트램으로 Claraplatz까지 가신 뒤 도보 2분입니다.',
    ja: '12月24日、25日、31日と1月1日は休館です。トラム6、8、14番でClaraplatzまで行き、そこから徒歩2分です。',
  },
  hours: { en: 'Opening hours', ko: '개관 시간', ja: '開館時間' },
  prices: { en: 'Tickets', ko: '입장료', ja: '入場料' },
} satisfies Record<string, Tri>;

interface TimetableRow {
  name: Tri;
  value: Tri;
  note?: Tri;
  today?: boolean;
  shut?: boolean;
}

const HOURS: TimetableRow[] = [
  { name: { en: 'Monday', ko: '월요일', ja: '月曜日' }, value: { en: 'Closed', ko: '휴관', ja: '休館' }, shut: true },
  { name: { en: 'Tuesday and Wednesday', ko: '화요일, 수요일', ja: '火曜日・水曜日' }, value: { en: '10:00–18:00', ko: '10:00–18:00', ja: '10:00–18:00' } },
  { name: { en: 'Thursday', ko: '목요일', ja: '木曜日' }, value: { en: '10:00–20:00', ko: '10:00–20:00', ja: '10:00–20:00' }, note: { en: 'Talks at 18:30', ko: '강연 18:30', ja: 'トーク 18:30' } },
  { name: { en: 'Friday', ko: '금요일', ja: '金曜日' }, value: { en: '10:00–18:00', ko: '10:00–18:00', ja: '10:00–18:00' } },
  { name: { en: 'Saturday, today', ko: '토요일, 오늘', ja: '土曜日・本日' }, value: { en: '10:00–18:00', ko: '10:00–18:00', ja: '10:00–18:00' }, today: true },
  { name: { en: 'Sunday', ko: '일요일', ja: '日曜日' }, value: { en: '10:00–17:00', ko: '10:00–17:00', ja: '10:00–17:00' } },
];

const PRICE_LIST: TimetableRow[] = [
  { name: { en: 'Adults', ko: '성인', ja: '大人' }, value: { en: 'CHF 16', ko: 'CHF 16', ja: 'CHF 16' } },
  { name: { en: 'Students, apprentices and over 65', ko: '학생, 견습생, 65세 이상', ja: '学生・見習い・65歳以上' }, value: { en: 'CHF 10', ko: 'CHF 10', ja: 'CHF 10' } },
  { name: { en: 'Under 16', ko: '16세 미만', ja: '16歳未満' }, value: { en: 'Free', ko: '무료', ja: '無料' } },
  { name: { en: 'Thursday from 17:00', ko: '목요일 17:00 이후', ja: '木曜日 17:00以降' }, value: { en: 'CHF 8', ko: 'CHF 8', ja: 'CHF 8' }, note: { en: 'Includes the talk', ko: '강연 포함', ja: 'トーク込み' } },
  { name: { en: 'Groups of 10 or more', ko: '10명 이상 단체', ja: '10名以上の団体' }, value: { en: 'CHF 12 each', ko: '1인 CHF 12', ja: '1名 CHF 12' }, note: { en: 'Book two weeks ahead', ko: '2주 전 예약', ja: '2週間前までに予約' } },
];

type Kind = keyof typeof PRICES;
type DateIssue = 'missing' | 'past' | 'late' | 'monday' | 'holiday';

const TICKETS = {
  title: { en: 'Tickets for your visit', ko: '방문 입장권', ja: 'ご来館のチケット' },
  date: { en: 'Day of your visit', ko: '방문 날짜', ja: '来館日' },
  open: { en: '{day}, open {from} to {to}', ko: '{day}, {from}~{to} 개관', ja: '{day}、{from}〜{to}開館' },
  openTalk: { en: '{day}, open {from} to {to}, talk at 18:30', ko: '{day}, {from}~{to} 개관, 18:30 강연', ja: '{day}、{from}〜{to}開館、18:30からトーク' },
  closed: { en: '{day}: the museum is closed.', ko: '{day}: 휴관일입니다.', ja: '{day}は休館日です。' },
  legend: { en: 'Tickets', ko: '입장권', ja: 'チケット' },
  adult: { en: 'Adult', ko: '성인', ja: '大人' },
  concession: { en: 'Concession', ko: '할인', ja: '割引' },
  concessionWho: { en: 'Students, apprentices and over 65', ko: '학생, 견습생, 65세 이상', ja: '学生・見習い・65歳以上' },
  addAdult: { en: 'Add an adult ticket', ko: '성인 입장권 추가', ja: '大人のチケットを追加' },
  removeAdult: { en: 'Remove an adult ticket', ko: '성인 입장권 빼기', ja: '大人のチケットを減らす' },
  addConcession: { en: 'Add a concession ticket', ko: '할인 입장권 추가', ja: '割引チケットを追加' },
  removeConcession: { en: 'Remove a concession ticket', ko: '할인 입장권 빼기', ja: '割引チケットを減らす' },
  countNote: {
    en: 'Under 16 free, no ticket needed. Up to nine tickets at a time; for a group of ten or more, call {phone}.',
    ko: '16세 미만은 무료이며 입장권이 필요하지 않습니다. 한 번에 최대 9장까지 예약할 수 있습니다. 10명 이상 단체는 {phone}으로 문의하십시오.',
    ja: '16歳未満は無料で、チケットは不要です。一度に9枚まで予約できます。10名以上の団体は{phone}までお電話ください。',
  },
  max: { en: 'Nine tickets is the most for one booking.', ko: '한 번에 예약할 수 있는 최대 매수는 9장입니다.', ja: '一度の予約で取れるチケットは最大9枚です。' },
  total: { en: 'Total', ko: '합계', ja: '合計' },
  email: { en: 'Email for the tickets', ko: '입장권을 받을 이메일', ja: 'チケットを受け取るメールアドレス' },
  submitOne: { en: 'Book 1 ticket, CHF {total}', ko: '1장 예약, CHF {total}', ja: '1枚を予約、CHF {total}' },
  submitMany: { en: 'Book {n} tickets, CHF {total}', ko: '{n}장 예약, CHF {total}', ja: '{n}枚を予約、CHF {total}' },
  submitNone: { en: 'Book tickets', ko: '입장권 예약', ja: 'チケットを予約' },
  pay: {
    en: 'Booked tickets are paid at the desk, by card or in cash, and skip the queue.',
    ko: '예약한 입장권은 데스크에서 카드나 현금으로 결제하며, 줄을 서지 않고 입장하실 수 있습니다.',
    ja: '予約したチケットは受付でカードまたは現金にてお支払いいただけます。列に並ばずに入場できます。',
  },
  adultsOne: { en: '1 adult', ko: '성인 1명', ja: '大人1名' },
  adultsMany: { en: '{n} adults', ko: '성인 {n}명', ja: '大人{n}名' },
  concessionsOne: { en: '1 concession', ko: '할인 1명', ja: '割引1名' },
  concessionsMany: { en: '{n} concessions', ko: '할인 {n}명', ja: '割引{n}名' },
  both: { en: '{a} and {b}', ko: '{a}, {b}', ja: '{a}、{b}' },
  none: { en: 'No tickets', ko: '입장권 없음', ja: 'チケットなし' },
  news: { en: '{counts}. Total CHF {total}.', ko: '{counts}. 합계 CHF {total}.', ja: '{counts}。合計 CHF {total}。' },
  doneTitle: { en: 'Booked for {day}.', ko: '{day} 예약이 완료되었습니다.', ja: '{day}の予約が完了しました。' },
  doneBody: {
    en: '{counts}, CHF {total}, to pay at the desk. The tickets are on their way to {email}.',
    ko: '{counts}, CHF {total}, 데스크에서 결제하십시오. 입장권을 {email} 주소로 발송하고 있습니다.',
    ja: '{counts}、CHF {total}、受付でお支払いください。チケットは{email}宛に送信中です。',
  },
  again: { en: 'Book more tickets', ko: '입장권 추가 예약', ja: 'チケットを追加で予約' },
  countError: { en: 'Add at least one ticket.', ko: '입장권을 한 장 이상 추가하십시오.', ja: 'チケットを1枚以上追加してください。' },
  emailError: { en: 'Write an email address like name@example.ch.', ko: 'name@example.ch 형식의 이메일 주소를 입력하십시오.', ja: 'name@example.ch のようなメールアドレスを入力してください。' },
} satisfies Record<string, Tri>;

const DATE_ERRORS: Record<DateIssue, Tri> = {
  missing: { en: 'Choose the day of your visit.', ko: '방문 날짜를 선택하십시오.', ja: '来館日を選択してください。' },
  past: { en: 'Choose today or a later day.', ko: '오늘 또는 그 이후 날짜를 선택하십시오.', ja: '本日以降の日付を選択してください。' },
  late: { en: 'The exhibition closes on 24 January 2027. Choose a day before then.', ko: '전시는 2027년 1월 24일에 끝납니다. 그 전 날짜를 선택하십시오.', ja: '展示は2027年1月24日に終了します。それ以前の日付を選択してください。' },
  monday: { en: 'The museum is closed on Mondays. Choose another day.', ko: '월요일은 휴관합니다. 다른 날짜를 선택하십시오.', ja: '月曜日は休館です。別の日付を選択してください。' },
  holiday: {
    en: 'The museum is closed on 24, 25 and 31 December and on 1 January. Choose another day.',
    ko: '12월 24일, 25일, 31일과 1월 1일은 휴관합니다. 다른 날짜를 선택하십시오.',
    ja: '12月24日、25日、31日と1月1日は休館です。別の日付を選択してください。',
  },
};

const LOCALES: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };

/** A YYYY-MM-DD value as a UTC date, or null when it is not a real day. */
function parseDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const day = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return day.toISOString().slice(0, 10) === value ? day : null;
}

function dateIssue(value: string): DateIssue | null {
  const day = parseDay(value);
  if (!day) return 'missing';
  if (value < TODAY) return 'past';
  if (value > LAST_DAY) return 'late';
  if (day.getUTCDay() === 1) return 'monday';
  if (CLOSED_DATES.includes(value)) return 'holiday';
  return null;
}

/** Opening and closing time by weekday, Sunday first. Monday is closed. */
const OPEN_HOURS: Array<[string, string] | null> = [
  ['10:00', '17:00'],
  null,
  ['10:00', '18:00'],
  ['10:00', '18:00'],
  ['10:00', '20:00'],
  ['10:00', '18:00'],
  ['10:00', '18:00'],
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Talk {
  id: string;
  date: string;
  day: number;
  month: Tri;
  when: Tri;
  title: Tri;
  who: Tri;
  /** Past talks: the length of the recording and its chapters. */
  recording?: { minutes: number; chapters: Array<{ at: string; title: Tri }> };
  /** Seats left before you book. Zero means full. */
  left?: number;
  /** People already on the waiting list of a full talk. */
  waiting?: number;
  next?: boolean;
}

const TALKS: Talk[] = [
  {
    id: 'rheinsprung',
    date: '2026-10-08',
    day: 8,
    month: { en: 'October', ko: '10월', ja: '10月' },
    when: { en: 'Thursday, 18:30', ko: '목요일, 18:30', ja: '木曜日、18:30' },
    title: { en: 'The first studio on the Rheinsprung', ko: 'Rheinsprung의 첫 작업실', ja: 'Rheinsprungの最初のスタジオ' },
    who: { en: 'Lena Fischer, curator of the exhibition', ko: 'Lena Fischer, 전시 큐레이터', ja: 'Lena Fischer、展示キュレーター' },
    recording: {
      minutes: 52,
      chapters: [
        { at: '0:00', title: { en: 'Why the exhibition starts on the Rheinsprung', ko: '전시가 Rheinsprung에서 시작하는 이유', ja: '展示がRheinsprungから始まる理由' } },
        { at: '6:40', title: { en: 'The print shop downstairs and its two presses', ko: '아래층 인쇄소와 두 대의 인쇄기', ja: '階下の印刷所と2台の印刷機' } },
        { at: '19:15', title: { en: 'Cutting the wooden letters for Musica Viva', ko: 'Musica Viva를 위해 나무 활자를 깎는 과정', ja: 'Musica Vivaのための木活字を彫る' } },
        { at: '34:30', title: { en: 'The first sheet for the tram company', ko: '트램 회사를 위한 첫 포스터', ja: 'トラム会社のための最初のポスター' } },
        { at: '44:05', title: { en: 'Questions from the room', ko: '객석의 질문', ja: '会場からの質問' } },
      ],
    },
  },
  {
    id: 'trams',
    date: '2026-10-29',
    day: 29,
    month: { en: 'October', ko: '10월', ja: '10月' },
    when: { en: 'Thursday, 18:30', ko: '목요일, 18:30', ja: '木曜日、18:30' },
    title: { en: 'Posters for the Basel trams, 1961 to 1973', ko: '바젤 트램 포스터, 1961~1973', ja: 'バーゼル・トラムのポスター、1961〜1973' },
    who: { en: 'Marco Bernasconi, archivist at the Verkehrsbetriebe Basel', ko: 'Marco Bernasconi, Verkehrsbetriebe Basel 기록 보관 담당자', ja: 'Marco Bernasconi、Verkehrsbetriebe Baselの資料管理担当' },
    recording: {
      minutes: 47,
      chapters: [
        { at: '0:00', title: { en: 'How the tram company bought posters in 1961', ko: '1961년 트램 회사가 포스터를 사들인 방식', ja: '1961年にトラム会社がポスターを発注した経緯' } },
        { at: '9:20', title: { en: 'Line 14 and its twelve-week campaign', ko: '14번 노선과 12주 캠페인', ja: '14番線と12週間のキャンペーン' } },
        { at: '23:45', title: { en: 'What the drivers made of the posters', ko: '운전사들이 포스터를 어떻게 봤는지', ja: '運転士たちが見たポスター' } },
        { at: '36:10', title: { en: 'Tram 8’s last run, 1973', ko: '1973년 8번 트램의 마지막 운행', ja: '1973年、8番トラムの最終運行' } },
        { at: '41:30', title: { en: 'Questions from the room', ko: '객석의 질문', ja: '会場からの質問' } },
      ],
    },
  },
  {
    id: 'colours',
    date: '2026-11-26',
    day: 26,
    month: { en: 'November', ko: '11월', ja: '11月' },
    when: { en: 'Thursday, 18:30', ko: '목요일, 18:30', ja: '木曜日、18:30' },
    title: { en: 'Twelve colours on one press', ko: '인쇄기 한 대로 찍은 열두 가지 색', ja: '一台の印刷機で刷る12色' },
    who: { en: 'Anna Keller, screen printer, with the proofs of cat. 21, 24 and 29', ko: 'Anna Keller, 실크스크린 인쇄사, 번호 21, 24, 29 교정쇄 지참', ja: 'Anna Keller、シルクスクリーン印刷師。番号21、24、29の校正刷りを持参' },
    left: 14,
    next: true,
  },
  {
    id: 'assistant',
    date: '2026-12-10',
    day: 10,
    month: { en: 'December', ko: '12월', ja: '12月' },
    when: { en: 'Thursday, 18:30', ko: '목요일, 18:30', ja: '木曜日、18:30' },
    title: { en: 'Four years as Ruth Vogt’s assistant', ko: 'Ruth Vogt의 조수로 보낸 4년', ja: 'Ruth Vogtの助手としての4年間' },
    who: { en: 'Peter Wyss, who worked in her studio from 1967 to 1971', ko: 'Peter Wyss, 1967년부터 1971년까지 그녀의 작업실에서 일함', ja: 'Peter Wyss、1967年から1971年まで彼女のスタジオで働いた' },
    left: 0,
    waiting: 3,
  },
  {
    id: 'last-walk',
    date: '2027-01-21',
    day: 21,
    month: { en: 'January 2027', ko: '2027년 1월', ja: '2027年1月' },
    when: { en: 'Thursday, 18:30', ko: '목요일, 18:30', ja: '木曜日、18:30' },
    title: { en: 'Last walk through the four rooms', ko: '네 개 전시실을 함께 둘러보는 마지막 관람', ja: '4つの展示室をめぐる最後のツアー' },
    who: { en: 'Lena Fischer, curator of the exhibition', ko: 'Lena Fischer, 전시 큐레이터', ja: 'Lena Fischer、展示キュレーター' },
    left: SEATS,
  },
];

const TALK_COPY = {
  title: { en: 'Talks', ko: '강연', ja: 'トーク' },
  note: {
    en: 'Thursdays at 18:30 in the lecture room on the first floor, in German. A seat is free with your ticket; there are 60.',
    ko: '목요일 18:30, 1층 강의실에서 독일어로 진행합니다. 입장권이 있으면 좌석을 무료로 예약할 수 있으며, 좌석은 60석입니다.',
    ja: '毎週木曜日18:30、1階の講義室でドイツ語により行います。入場券があれば席は無料で、全60席です。',
  },
  nextTalk: { en: 'Next talk', ko: '다음 강연', ja: '次のトーク' },
  book: { en: 'Book a seat', ko: '좌석 예약', ja: '席を予約' },
  cancel: { en: 'Cancel the seat', ko: '좌석 예약 취소', ja: '席の予約を取り消す' },
  left: { en: '{n} of 60 seats left', ko: '60석 중 {n}석 남음', ja: '全60席のうち残り{n}席' },
  have: { en: 'You have a seat. {n} of 60 seats left.', ko: '좌석이 예약되었습니다. 60석 중 {n}석 남았습니다.', ja: '席を予約済みです。全60席のうち残り{n}席です。' },
  full: { en: 'Full', ko: '매진', ja: '満席' },
  waiting: { en: '{n} people are on the waiting list.', ko: '대기자 {n}명이 있습니다.', ja: '{n}名がキャンセル待ちをしています。' },
  join: { en: 'Join the waiting list', ko: '대기 명단에 등록', ja: 'キャンセル待ちに登録' },
  leave: { en: 'Leave the waiting list', ko: '대기 명단에서 나가기', ja: 'キャンセル待ちを取り消す' },
  onList: {
    en: 'You are number {n} on the waiting list. Seats that come free are given out at the door from 18:15.',
    ko: '대기 명단 {n}번입니다. 빈 좌석은 18:15부터 현장에서 배정합니다.',
    ja: 'キャンセル待ち{n}番です。空いた席は18:15から会場入口で配布します。',
  },
  recorded: { en: 'Recorded, {n} minutes', ko: '녹화본, {n}분', ja: '録画、{n}分' },
  chapters: { en: 'Chapters', ko: '챕터', ja: 'チャプター' },
  station: {
    en: 'In German. The recording plays on the listening station in Room 4 until 24 January.',
    ko: '독일어로 진행됩니다. 녹화본은 1월 24일까지 4전시실의 청취 스테이션에서 재생됩니다.',
    ja: 'ドイツ語です。録画は1月24日まで展示室4の視聴コーナーで再生されます。',
  },
  booked: { en: '{title}: seat booked. {n} of 60 seats left.', ko: '{title}: 좌석을 예약했습니다. 60석 중 {n}석 남았습니다.', ja: '{title}：席を予約しました。全60席のうち残り{n}席です。' },
  cancelled: { en: '{title}: seat cancelled. {n} of 60 seats left.', ko: '{title}: 좌석 예약을 취소했습니다. 60석 중 {n}석 남았습니다.', ja: '{title}：席の予約を取り消しました。全60席のうち残り{n}席です。' },
  joined: { en: '{title}: you are number {n} on the waiting list.', ko: '{title}: 대기 명단 {n}번으로 등록되었습니다.', ja: '{title}：キャンセル待ち{n}番で登録されました。' },
  left_: { en: '{title}: you have left the waiting list.', ko: '{title}: 대기 명단에서 빠졌습니다.', ja: '{title}：キャンセル待ちを取り消しました。' },
} satisfies Record<string, Tri>;

const FOOT = {
  support: {
    en: 'The exhibition is supported by the Ernst Vogt Foundation and the City of Basel.',
    ko: '이 전시는 Ernst Vogt 재단과 바젤시의 지원을 받았습니다.',
    ja: '本展は Ernst Vogt 財団とバーゼル市の支援を受けています。',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Swiss Poster style: an off-white page with one white poster sheet on it, black type in a single grotesk, black rules on a 12-column grid, and one red.

Pick a believable subject whose page has to carry a poster and a lot of exact information, such as a museum exhibition, a concert season or a film festival, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Museum Kleinbasel's exhibition "Ruth Vogt, Posters 1958–1974": the poster, the works room by room, hours and tickets with a ticket form, and the Thursday talks.

TOKENS:
--paper: #f5f4ef (the page)
--sheet: #ffffff (the poster sheet, fields and the language menu)
--ink: #111111
--muted: #545454 (secondary text, past talks)
--rule: #111111 (structural rules)
--rule-soft: rgba(17,17,17,0.3) (row rules, miniature edges, disabled steppers)
--red: #d41f18
--baseline: rgba(17,17,17,0.045) (the sheet's 24px baseline lines)
--hover: rgba(17,17,17,0.06) (hover on an unselected room tab)

COLOUR:
- Red marks only the O in the name, today's row in the hours, the date of the next talk, the two ticket buttons (white text, 5.2:1) and error messages and the border of an invalid field. Nothing else is red.
- Buttons are ink on a 2px ink border and fill with ink on hover; the red buttons fill with ink on hover. The selected room tab is white on ink. Focus is a 3px ink ring (white inside the ink tab).
- The miniatures of the posters use only ink, white and red.

TYPOGRAPHY:
One family, Arimo (400 and 700), drawn to Helvetica's metrics. Hierarchy comes from size and weight only.
Name: 700, min(15rem, 27vw) (25vw under 560px, 24vw under 360px), line-height 0.8, letter-spacing -0.055em, upper case, two lines cut to the width of the sheet.
Subtitle: 700, clamp(1.75rem, 3.3vw, 2.75rem), line-height 1, letter-spacing -0.035em. Dates: 400, clamp(1.125rem, 1.6vw, 1.375rem), line-height 1.3.
H2: 700, clamp(2.25rem, 4vw, 3.25rem), line-height 0.98, letter-spacing -0.04em. H3: 700, 1.3125rem.
Lede: 400, clamp(1.1875rem, 1.7vw, 1.4375rem), line-height 1.38.
Figures are 700 and tabular: catalogue numbers 1.625rem, talk days clamp(3.25rem, 5.4vw, 4.5rem) at line-height 0.8, hours and prices 1.25rem, the ticket total 2rem.
Body: 400, 1.0625rem, line-height 1.55. Secondary text 1rem. No text under 1rem. No all-caps labels anywhere except the name.

LAYOUT:
- A 1120px column. A museum bar: the museum's name in 700, three in-page links and an outlined "Tickets" button on a 1px ink rule.
- The poster: a white sheet with a 1px ink border, four 12px crop marks 14px outside its corners (8px and 10px under 560px), 24px baseline lines, and a 1px ink circle in its top right corner. The name fills the first eight columns; the subtitle, the dates and a red "Buy tickets" button stand in the last four, bottom-aligned with the name. The whole sheet fits on the first screen of a 1280x800 laptop. Below 1080px the subtitle and dates move under the name.
- Under the sheet, on the paper: the lede and one paragraph in seven columns, and three facts (where, open today, admission) in the last four, on 1px soft rules.
- Sections 96px apart (72px under 960px, 60px on phones), each opened by a 2px ink rule: the heading and a note in the first three columns, the content in the other nine.
- A three-column footer on a 1px rule.

COMPONENTS:
- Room tabs: four equal cells in a 1px ink frame, "Room 1" in 700 over its years. The tab pattern: roving tabindex, arrow keys, Home and End, one labelled panel. On phones two by two.
- Works list: a table with explicit roles. Catalogue number, a 42px miniature of the sheet (abstract shapes in ink, white and red, with a text description), the German title in 700 with its English meaning under it, year, client, technique. Header row in muted text on a 1px ink rule, rows on soft rules. Under 760px each row stacks: number and miniature on the left, the title, year and client, technique on the right. A button at the end opens the next room and moves focus to its tab.
- Hours and tickets: one timetable in two groups (opening hours, tickets) with the group name in 700 over a 1px ink rule; today's row red. Beside it a ticket form on a 2px ink rule: a date field (today to the last day; Mondays and holidays refused, with the day's opening hours written under it), steppers for adults (CHF 16) and concessions (CHF 10) with 44px square buttons, up to nine tickets, a total in CHF that updates, an email field, and one red full-width button that names the count and the price. Errors sit under their field; a valid booking replaces the form with a confirmation that takes focus.
- Talks: a dated list on soft rules. The day huge, the month and time beside it; title in 700 and the speaker in muted. Past talks in muted with their recording's length and a Chapters disclosure. The next talk's day is red. "Book a seat" and "Join the waiting list" change to "Cancel the seat" and "Leave the waiting list", update the seat count and are announced in a polite live region.
- Square corners everywhere. No shadows.

MOTION:
- None. Hover fills a button with ink or thickens an underline, at once. Nothing moves on its own.

FORBIDDEN:
- Cards, rounded corners, pills, chips, badges, shadows, colour gradients, glass
- A small label above a heading, all-caps tracked labels, numbered section markers
- Red on anything not listed under COLOUR; a second accent colour
- Photographs, illustrations of people or things, emoji, icons beyond a minus and a plus
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about grids, Helvetica, Swiss design or typography

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a tab list with one tab panel, a works table with roles, a timetable with row and group headers, a labelled ticket form, a list of talks
3) Working room tabs, steppers and total, form validation with error and success states, seat booking and waiting list with live announcements
4) Responsive layout down to 320px with no horizontal scroll; tables stack on phones instead of scrolling
5) Visible focus on every control, 44px touch targets, no text under 16px`;

const PROMPT_KO = `Swiss Poster 스타일로 실제 페이지 한 장을 디자인한다. 오프화이트 페이지 위에 흰색 포스터 판 한 장을 올리고, 단일 그로테스크 서체의 검은 글자, 12열 그리드 위의 검은 괘선, 빨간색 한 가지를 쓴다.

그럴듯한 주제를 하나 고른다. 포스터와 많은 정확한 정보를 담아야 하는 페이지여야 하며, 예를 들면 미술관 전시, 연주회 시즌, 영화제가 있다. 실제 내용을 써라. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 Museum Kleinbasel의 전시 "Ruth Vogt, Posters 1958–1974"다. 포스터, 전시실별 작품, 관람 시간과 입장권(입장권 양식 포함), 목요일 강연 목록을 담는다.

TOKENS:
--paper: #f5f4ef (페이지)
--sheet: #ffffff (포스터 판, 입력란, 언어 메뉴)
--ink: #111111
--muted: #545454 (보조 텍스트, 지난 강연)
--rule: #111111 (구조 괘선)
--rule-soft: rgba(17,17,17,0.3) (행 구분선, 미니어처 가장자리, 비활성 스테퍼)
--red: #d41f18
--baseline: rgba(17,17,17,0.045) (판의 24px 기준선)
--hover: rgba(17,17,17,0.06) (선택되지 않은 전시실 탭에 마우스를 올렸을 때)

COLOUR:
- 빨간색은 이름의 O, 개관 시간표에서 오늘의 행, 다음 강연의 날짜, 입장권 버튼 두 개(흰색 글자, 5.2:1), 오류 메시지, 잘못된 입력란의 테두리에만 쓴다. 다른 곳에는 빨간색을 쓰지 않는다.
- 버튼은 2px 잉크 테두리에 잉크색 글자이며, 마우스를 올리면 잉크색으로 채워진다. 빨간 버튼도 마우스를 올리면 잉크색으로 채워진다. 선택된 전시실 탭은 잉크 바탕에 흰 글자다. 포커스는 3px 잉크 링이며, 잉크 탭 안에서는 흰색 링이다.
- 포스터 미니어처는 잉크, 흰색, 빨간색만 쓴다.

TYPOGRAPHY:
한 가지 서체 Arimo(400과 700)를 쓴다. Helvetica의 규격에 맞춰 그려진 서체다. 위계는 크기와 굵기로만 만든다.
이름: 700, min(15rem, 27vw)(560px 미만은 25vw, 360px 미만은 24vw), 줄 높이 0.8, 자간 -0.055em, 대문자, 판의 너비에 맞춘 두 줄.
부제: 700, clamp(1.75rem, 3.3vw, 2.75rem), 줄 높이 1, 자간 -0.035em. 날짜: 400, clamp(1.125rem, 1.6vw, 1.375rem), 줄 높이 1.3.
H2: 700, clamp(2.25rem, 4vw, 3.25rem), 줄 높이 0.98, 자간 -0.04em. H3: 700, 1.3125rem.
리드 문단: 400, clamp(1.1875rem, 1.7vw, 1.4375rem), 줄 높이 1.38.
숫자는 700이며 고정폭으로 쓴다. 작품 번호 1.625rem, 강연 날짜 clamp(3.25rem, 5.4vw, 4.5rem)(줄 높이 0.8), 시간과 가격 1.25rem, 입장권 합계 2rem.
본문: 400, 1.0625rem, 줄 높이 1.55. 보조 텍스트 1rem. 1rem보다 작은 글자는 쓰지 않는다. 이름을 제외하고 전부 대문자로 된 라벨은 쓰지 않는다.

LAYOUT:
- 너비 1120px의 단. 미술관 바: 700 굵기의 미술관 이름, 페이지 내 링크 세 개, 1px 잉크 괘선 위의 "입장권" 외곽선 버튼.
- 포스터: 1px 잉크 테두리의 흰색 판. 모서리에서 14px 바깥에 12px 크롭 마크 네 개(560px 미만은 8px과 10px), 24px 기준선, 오른쪽 위 모서리의 1px 잉크 원. 이름은 앞의 8개 열을 채우고, 부제, 날짜, 빨간 "입장권 예약" 버튼은 뒤의 4개 열에 이름과 아래쪽을 맞춰 놓는다. 판 전체는 1280x800 노트북의 첫 화면에 들어가야 한다. 1080px 미만에서는 부제와 날짜를 이름 아래로 내린다.
- 판 아래, 페이지 바탕 위: 리드 문단과 본문 한 단락을 일곱 개 열에, 세 가지 정보(장소, 오늘 개관, 관람료)를 뒤의 네 개 열에 1px 부드러운 괘선으로 구분해 놓는다.
- 섹션 사이는 96px 간격(960px 미만은 72px, 휴대폰은 60px). 각 섹션은 2px 잉크 괘선으로 시작한다. 제목과 메모는 앞의 세 개 열에, 내용은 나머지 아홉 개 열에 놓는다.
- 1px 괘선 위의 세 열 푸터.

COMPONENTS:
- 전시실 탭: 1px 잉크 틀 안의 같은 크기 칸 네 개. 700 굵기의 "1전시실"과 그 아래 연도. 탭 패턴: roving tabindex, 화살표 키, Home과 End, 레이블이 붙은 패널 하나. 휴대폰에서는 2×2로 배치.
- 작품 목록: 역할(role)을 명시한 표. 작품 번호, 판의 42px 미니어처(잉크, 흰색, 빨간색의 추상 도형과 텍스트 설명), 700 굵기의 독일어 제목과 그 아래 영어 뜻, 연도, 의뢰처, 기법. 헤더 행은 1px 잉크 괘선 위에 보조 텍스트로, 행은 부드러운 괘선으로 구분한다. 760px 미만에서는 각 행을 쌓는다. 왼쪽에 번호와 미니어처, 오른쪽에 제목, 연도와 의뢰처, 기법. 마지막의 버튼은 다음 전시실을 열고 포커스를 그 탭으로 옮긴다.
- 관람 시간과 입장권: 두 그룹(개관 시간, 입장료)으로 나눈 시간표 하나. 그룹 이름은 700 굵기로 1px 잉크 괘선 위에 놓고, 오늘의 행은 빨간색이다. 옆에는 2px 잉크 괘선 위의 입장권 양식을 둔다. 날짜 입력란(오늘부터 마지막 날까지. 월요일과 휴관일은 선택할 수 없으며, 그날의 개관 시간을 아래에 적는다), 성인(CHF 16)과 할인(CHF 10) 스테퍼(44px 정사각형 버튼), 최대 9장, 값이 바뀌는 CHF 합계, 이메일 입력란, 그리고 매수와 금액을 표시하는 전체 너비의 빨간 버튼 하나. 오류는 해당 입력란 아래에 표시한다. 유효한 예약이 되면 양식은 포커스를 받는 확인 화면으로 바뀐다.
- 강연: 부드러운 괘선으로 나눈 날짜별 목록. 날짜 숫자는 크게, 월과 시간은 옆에. 제목은 700 굵기, 연사는 보조 텍스트. 지난 강연은 보조 텍스트로, 녹화 길이와 챕터 펼치기 버튼을 함께 둔다. 다음 강연의 날짜는 빨간색이다. "좌석 예약"과 "대기 명단에 등록"은 "좌석 예약 취소"와 "대기 명단에서 나가기"로 바뀌고, 좌석 수를 갱신하며 정중한 라이브 영역(polite live region)으로 알린다.
- 모든 모서리는 직각. 그림자는 쓰지 않는다.

MOTION:
- 없음. 마우스를 올리면 버튼이 즉시 잉크색으로 채워지거나 밑줄이 즉시 굵어진다. 스스로 움직이는 요소는 없다.

FORBIDDEN:
- 카드, 둥근 모서리, 알약형 버튼, 칩, 배지, 그림자, 색 그라데이션, 유리 질감
- 제목 위의 작은 라벨, 자간을 넓힌 전부 대문자 라벨, 번호가 붙은 섹션 표식
- COLOUR에 나열되지 않은 곳의 빨간색, 두 번째 강조색
- 사진, 사람이나 사물의 일러스트, 이모지, 마이너스와 플러스를 넘는 아이콘
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 번호
- 그리드, Helvetica, 스위스 디자인, 타이포그래피에 관한 문구

OUTPUT:
1) 위 토큰의 CSS 사용자 정의 속성
2) 시맨틱 HTML: 탭 패널 하나를 가진 탭 목록, 역할을 명시한 작품 표, 행 헤더와 그룹 헤더가 있는 시간표, 레이블이 붙은 입장권 양식, 강연 목록
3) 작동하는 전시실 탭, 스테퍼와 합계, 오류와 성공 상태가 있는 양식 검증, 라이브 알림이 있는 좌석 예약과 대기 명단
4) 320px까지 가로 스크롤 없이 반응하는 레이아웃. 표는 스크롤되지 않고 휴대폰에서 세로로 쌓인다.
5) 모든 컨트롤에 보이는 포커스, 44px 터치 영역, 16px 미만 글자 없음`;

const PROMPT_JA = `Swiss Poster のスタイルで、実在するページを一枚デザインする。オフホワイトのページに白いポスター用紙を一枚置き、単一のグロテスク書体による黒い文字、12列グリッド上の黒い罫線、そして赤を一色だけ使う。

もっともらしい題材を一つ選ぶ。ポスターと多くの正確な情報を載せる必要があるページであること（美術館の展覧会、演奏会のシーズン、映画祭など）。実際の内容を書くこと。ページはその題材のページとして読めなければならず、スタイルそのものについてのページであってはならない。ここでは Museum Kleinbasel の展覧会「Ruth Vogt, Posters 1958–1974」とする。ポスター、展示室ごとの作品、開館時間と入場券（購入フォームを含む）、木曜日のトークを扱う。

TOKENS:
--paper: #f5f4ef (ページ)
--sheet: #ffffff (ポスター用紙、入力欄、言語メニュー)
--ink: #111111
--muted: #545454 (補足テキスト、過去のトーク)
--rule: #111111 (構造の罫線)
--rule-soft: rgba(17,17,17,0.3) (行の罫線、ミニチュアの縁、無効のステッパー)
--red: #d41f18
--baseline: rgba(17,17,17,0.045) (用紙の24pxベースライン)
--hover: rgba(17,17,17,0.06) (選択されていない展示室タブにホバーしたとき)

COLOUR:
- 赤が使われるのは、名前のO、開館時間表の今日の行、次のトークの日付、入場券ボタン2つ（白い文字、コントラスト比5.2:1）、エラーメッセージ、無効な入力欄の枠線だけ。ほかには一切赤を使わない。
- ボタンは2pxのインク色の枠線に、インク色の文字。ホバーでインク色に塗りつぶされる。赤いボタンもホバーでインク色に塗りつぶされる。選択中の展示室タブは、インク色の地に白い文字。フォーカスは3pxのインク色のリング（インク色のタブの内側は白）。
- ポスターのミニチュアはインク、白、赤のみを使う。

TYPOGRAPHY:
書体は一種類、Arimo（400と700）を使う。Helveticaの規格に合わせて描かれた書体である。階層は大きさと太さだけで作る。
名前: 700、min(15rem, 27vw)（560px未満は25vw、360px未満は24vw）、行の高さ0.8、字間-0.055em、大文字、用紙の幅に合わせた2行。
副題: 700、clamp(1.75rem, 3.3vw, 2.75rem)、行の高さ1、字間-0.035em。日付: 400、clamp(1.125rem, 1.6vw, 1.375rem)、行の高さ1.3。
H2: 700、clamp(2.25rem, 4vw, 3.25rem)、行の高さ0.98、字間-0.04em。H3: 700、1.3125rem。
リード: 400、clamp(1.1875rem, 1.7vw, 1.4375rem)、行の高さ1.38。
数字は700で等幅。作品番号は1.625rem、トークの日付はclamp(3.25rem, 5.4vw, 4.5rem)・行の高さ0.8、時間と料金は1.25rem、入場券の合計は2rem。
本文: 400、1.0625rem、行の高さ1.55。補足テキストは1rem。1rem未満の文字は使わない。名前以外に大文字だけのラベルは使わない。

LAYOUT:
- 幅1120pxのカラム。美術館バー: 美術館名を700で、ページ内リンク3つ、1pxのインク色の罫線上に「入場券」の外枠ボタン。
- ポスター: 1pxのインク色の枠線を持つ白い用紙。角から14px外側に12pxのトリムマーク4つ（560px未満では8pxと10px）、24pxのベースライン、右上角の1pxインク色の円。名前は最初の8列を占める。副題、日付、赤い「チケットを予約」ボタンは最後の4列に置き、名前と下端を揃える。用紙全体は1280x800のノートPCの最初の画面に収めること。1080px未満では副題と日付を名前の下へ移す。
- 用紙の下、ページ地の上: リード文と本文の一段落を7列に、最後の4列に3つの情報（場所、本日の開館、入場料）を1pxの柔らかい罫線で区切って置く。
- セクションの間隔は96px（960px未満では72px、スマートフォンでは60px）。各セクションは2pxのインク色の罫線で始まる。見出しと注記は最初の3列に、内容は残りの9列に置く。
- 1pxの罫線の上に3列のフッター。

COMPONENTS:
- 展示室タブ: 1pxのインク色の枠内に同じ大きさのセル4つ。700の「展示室1」とその下の年代。タブのパターン: roving tabindex、矢印キー、HomeとEnd、ラベル付きのパネル1つ。スマートフォンでは2×2。
- 作品リスト: 役割を明示したテーブル。作品番号、用紙の42pxのミニチュア（インク、白、赤の抽象図形と、テキストによる説明）、700のドイツ語タイトルとその下の英語の意味、年、依頼主、技法。ヘッダー行は1pxのインク色の罫線の上に補足テキストで、行は柔らかい罫線で区切る。760px未満では各行を縦に積む。左に番号とミニチュア、右にタイトル、年と依頼主、技法。末尾のボタンで次の展示室を開き、フォーカスをそのタブへ移す。
- 開館時間と入場券: 2グループ（開館時間、入場料）からなる時間表1つ。グループ名は700で、1pxのインク色の罫線の上に置く。今日の行は赤。その横に、2pxのインク色の罫線の上の入場券フォーム: 日付欄（今日から最終日まで。月曜日と休館日は受け付けず、その日の開館時間を下に書く）、成人（CHF 16）と割引（CHF 10）のステッパー（44pxの正方形ボタン）、最大9枚、更新されるCHF建ての合計、メール欄、そして枚数と金額を表示する全幅の赤いボタン1つ。エラーは各欄の下に表示する。有効な予約が通ると、フォームはフォーカスを受ける確認画面に置き換わる。
- トーク: 柔らかい罫線で区切った日付つきの一覧。日付の数字は大きく、その横に月と時間。タイトルは700、登壇者は補足テキスト。過去のトークは補足テキストで、録画の長さと「チャプター」の開閉ボタンを付ける。次のトークの日付は赤。「席を予約」と「キャンセル待ちに登録」は「席の予約を取り消す」と「キャンセル待ちを取り消す」に変わり、座席数を更新し、polite なライブリージョンで読み上げる。
- 角はすべて直角。影は使わない。

MOTION:
- なし。ホバーはボタンを即座にインク色で塗るか、下線を即座に太くするだけ。自ら動く要素はない。

FORBIDDEN:
- カード、角丸、ピル型、チップ、バッジ、影、色のグラデーション、ガラス効果
- 見出しの上の小さなラベル、字間を空けた全大文字のラベル、番号付きのセクション記号
- COLOUR に挙げていない箇所の赤、2つ目のアクセントカラー
- 写真、人や物のイラスト、絵文字、マイナスとプラス以外のアイコン
- リンクの矢印、中点で区切ったメタ文字列、実際の連番ではないものへの番号
- グリッド、Helvetica、スイスデザイン、タイポグラフィについての文章

OUTPUT:
1) 上記トークンの CSS カスタムプロパティ
2) セマンティック HTML: タブパネル1つを持つタブリスト、役割付きの作品テーブル、行見出しとグループ見出しを持つ時間表、ラベル付きの入場券フォーム、トークの一覧
3) 動作する展示室タブ、ステッパーと合計、エラーと成功の状態を持つフォーム検証、ライブ通知付きの席の予約とキャンセル待ち
4) 320pxまで横スクロールなしで対応するレイアウト。表はスクロールさせず、スマートフォンでは縦に積む
5) すべてのコントロールに見えるフォーカス、44pxのタッチ領域、16px未満の文字なし`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type Errors = { date: DateIssue | null; count: boolean; email: boolean };
type Booking = { date: string; counts: Record<Kind, number>; email: string; total: number };

const NO_ERRORS: Errors = { date: null, count: false, email: false };

export function PortedSwissPosterPage({ lang }: PortedStylePageProps) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [visitDate, setVisitDate] = useState(TODAY);
  const [counts, setCounts] = useState<Record<Kind, number>>({ adult: 1, concession: 0 });
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [countNews, setCountNews] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [seats, setSeats] = useState<Record<string, boolean>>({});
  const [waits, setWaits] = useState<Record<string, boolean>>({});
  const [chapters, setChapters] = useState<Record<string, boolean>>({});
  const [talkNews, setTalkNews] = useState('');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dateRef = useRef<HTMLInputElement>(null);
  const addAdultRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasBooked = useRef(false);

  const t = (text: Tri) => text[lang];
  const room = ROOMS[roomIndex];
  const total = counts.adult * PRICES.adult + counts.concession * PRICES.concession;
  const tickets = counts.adult + counts.concession;

  // The form and the confirmation replace each other. Focus goes to what took the place of
  // the control that left: the confirmation, or, after "Book more tickets", the date field.
  useEffect(() => {
    if (booking) doneRef.current?.focus();
    else if (wasBooked.current) dateRef.current?.focus();
    wasBooked.current = booking !== null;
  }, [booking]);

  const formatDay = (value: string) => {
    const day = parseDay(value);
    return day ? new Intl.DateTimeFormat(LOCALES[lang], { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(day) : '';
  };

  const countPhrase = (value: Record<Kind, number>) => {
    const adults = value.adult === 0 ? '' : value.adult === 1 ? t(TICKETS.adultsOne) : fill(t(TICKETS.adultsMany), { n: value.adult });
    const concessions = value.concession === 0 ? '' : value.concession === 1 ? t(TICKETS.concessionsOne) : fill(t(TICKETS.concessionsMany), { n: value.concession });
    if (adults && concessions) return fill(t(TICKETS.both), { a: adults, b: concessions });
    return adults || concessions || t(TICKETS.none);
  };

  const chooseRoom = (index: number, focus: boolean) => {
    flushSync(() => setRoomIndex(index));
    if (focus) tabRefs.current[index]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = ROOMS.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: roomIndex === last ? 0 : roomIndex + 1,
      ArrowDown: roomIndex === last ? 0 : roomIndex + 1,
      ArrowLeft: roomIndex === 0 ? last : roomIndex - 1,
      ArrowUp: roomIndex === 0 ? last : roomIndex - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    chooseRoom(moves[event.key], true);
  };

  const step = (kind: Kind, delta: 1 | -1) => {
    if (delta > 0 && tickets >= MAX_TICKETS) {
      setCountNews(t(TICKETS.max));
      return;
    }
    if (delta < 0 && counts[kind] === 0) return;
    const next = { ...counts, [kind]: counts[kind] + delta };
    setCounts(next);
    if (errors.count && next.adult + next.concession > 0) setErrors({ ...errors, count: false });
    setCountNews(fill(t(TICKETS.news), { counts: countPhrase(next), total: next.adult * PRICES.adult + next.concession * PRICES.concession }));
  };

  const book = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = { date: dateIssue(visitDate), count: tickets === 0, email: !EMAIL_PATTERN.test(email.trim()) };
    if (!next.date && !next.count && !next.email) {
      setErrors(NO_ERRORS);
      setBooking({ date: visitDate, counts, email: email.trim(), total });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the fixed page bar.
    flushSync(() => setErrors(next));
    const field = next.date ? dateRef.current : next.count ? addAdultRef.current : emailRef.current;
    field?.focus();
    field?.closest('.rv-field, .rv-count')?.scrollIntoView({ block: 'nearest' });
  };

  const toggleSeat = (talk: Talk) => {
    const has = !seats[talk.id];
    setSeats({ ...seats, [talk.id]: has });
    const left = (talk.left ?? 0) - (has ? 1 : 0);
    setTalkNews(fill(t(has ? TALK_COPY.booked : TALK_COPY.cancelled), { title: t(talk.title), n: left }));
  };

  const toggleWait = (talk: Talk) => {
    const on = !waits[talk.id];
    setWaits({ ...waits, [talk.id]: on });
    setTalkNews(on ? fill(t(TALK_COPY.joined), { title: t(talk.title), n: (talk.waiting ?? 0) + 1 }) : fill(t(TALK_COPY.left_), { title: t(talk.title) }));
  };

  const day = parseDay(visitDate);
  const hours = day ? OPEN_HOURS[day.getUTCDay()] : null;
  const issue = dateIssue(visitDate);
  const dayLine = !day
    ? ''
    : issue === 'monday' || issue === 'holiday'
      ? fill(t(TICKETS.closed), { day: formatDay(visitDate) })
      : issue === null && hours
        ? fill(t(day.getUTCDay() === 4 ? TICKETS.openTalk : TICKETS.open), { day: formatDay(visitDate), from: hours[0], to: hours[1] })
        : '';
  const submitLabel = tickets === 0
    ? t(TICKETS.submitNone)
    : fill(t(tickets === 1 ? TICKETS.submitOne : TICKETS.submitMany), { n: tickets, total });
  const nextRoom = (roomIndex + 1) % ROOMS.length;
  const nextWorks = ROOMS[nextRoom].works;

  return (
    <FusionShell
      fusionId="swiss-poster"
      lang={lang}
      tone="light"
      accent="#d41f18"
      prev={{ href: '/pages/cyberpunk-glitch.html', label: 'Cyberpunk Glitch' }}
      next={{ href: '/pages/quiet-utility.html', label: 'Quiet Utility' }}
      prompts={PROMPTS}
    >
      <div className="rv">
        <header className="rv-bar">
          <p className="rv-mark">{MUSEUM}</p>
          <nav className="rv-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#rv-works">{t(HEAD.works)}</a>
            <a href="#rv-visit">{t(HEAD.visit)}</a>
            <a href="#rv-talks">{t(HEAD.talks)}</a>
          </nav>
          <a className="rv-btn rv-bar__tickets" href="#rv-buy">{t(HEAD.tickets)}</a>
        </header>

        <section className="rv-poster" aria-labelledby="rv-title">
          <i className="rv-crop rv-crop--tl" aria-hidden="true" />
          <i className="rv-crop rv-crop--tr" aria-hidden="true" />
          <i className="rv-crop rv-crop--bl" aria-hidden="true" />
          <i className="rv-crop rv-crop--br" aria-hidden="true" />
          <div className="rv-poster__sheet">
            <i className="rv-geo" aria-hidden="true" />
            <h1 id="rv-title" className="rv-name">
              <span>Ruth</span>
              <span>V<span className="rv-o">o</span>gt</span>
            </h1>
            <div className="rv-poster__side">
              <p className="rv-sub">{t(POSTER.posters)}<br />{YEARS}</p>
              <p className="rv-dates"><span>{t(POSTER.from)}</span> <span>{t(POSTER.to)}</span></p>
              <a className="rv-btn rv-btn--red rv-poster__buy" href="#rv-buy">{t(POSTER.buy)}</a>
            </div>
          </div>
        </section>

        <div className="rv-intro">
          <div className="rv-about">
            <p className="rv-lede">{t(INTRO.lede)}</p>
            <p>{t(INTRO.body)}</p>
          </div>
          <dl className="rv-facts">
            <div><dt>{t(INTRO.where)}</dt><dd>{t(INTRO.hall)}<br />{ADDRESS}</dd></div>
            <div><dt>{t(INTRO.today)}</dt><dd>{t(INTRO.todayHours)}</dd></div>
            <div><dt>{t(INTRO.admission)}</dt><dd>{t(INTRO.admissionValue)}</dd></div>
          </dl>
        </div>

        <section className="rv-sec" id="rv-works" aria-labelledby="rv-works-title">
          <div className="rv-sec__head">
            <h2 id="rv-works-title">{t(WORKS.title)}</h2>
            <p>{t(WORKS.note)}</p>
          </div>
          <div className="rv-sec__body">
            <div className="rv-rooms" role="tablist" aria-label={t(WORKS.rooms)} onKeyDown={onTabKey}>
              {ROOMS.map((item, index) => (
                <button
                  key={item.years}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className="rv-tab"
                  type="button"
                  role="tab"
                  id={`rv-tab-${index + 1}`}
                  aria-selected={index === roomIndex}
                  aria-controls="rv-room"
                  tabIndex={index === roomIndex ? 0 : -1}
                  onClick={() => chooseRoom(index, false)}
                >
                  <b>{fill(t(WORKS.room), { n: index + 1 })}</b>
                  <span>{item.years}</span>
                </button>
              ))}
            </div>

            <div className="rv-room" id="rv-room" role="tabpanel" aria-labelledby={`rv-tab-${roomIndex + 1}`}>
              <p className="rv-room__note">{t(room.note)}</p>
              <div className="rv-works" role="table" aria-label={fill(t(WORKS.list), { n: roomIndex + 1, years: room.years })}>
                <div role="rowgroup">
                  <div className="rv-works__row rv-works__row--head" role="row">
                    <span role="columnheader">{t(WORKS.cat)}</span>
                    <span role="columnheader"><span className="rv-sr">{t(WORKS.sheet)}</span></span>
                    <span role="columnheader">{t(WORKS.work)}</span>
                    <span role="columnheader">{t(WORKS.year)}</span>
                    <span role="columnheader">{t(WORKS.client)}</span>
                    <span role="columnheader">{t(WORKS.technique)}</span>
                  </div>
                </div>
                <div role="rowgroup">
                  {room.works.map((work) => (
                    <div key={work.cat} className="rv-works__row" role="row">
                      <span className="rv-works__cat" role="cell" data-label={t(WORKS.cat)}>{work.cat}</span>
                      <span className="rv-works__thumb" role="cell" data-label={t(WORKS.sheet)}>
                        <i className={`rv-mp rv-mp--${work.cat}`} aria-hidden="true" />
                        <span className="rv-sr">{t(work.sheet)}</span>
                      </span>
                      <span className="rv-works__title" role="rowheader" data-label={t(WORKS.work)}>
                        <b lang="de">{work.title}</b>
                        {work.gloss ? <span>{t(work.gloss)}</span> : null}
                      </span>
                      <span className="rv-works__year" role="cell" data-label={t(WORKS.year)}>{work.year}</span>
                      <span className="rv-works__client" role="cell" data-label={t(WORKS.client)} lang="de">{work.client}</span>
                      <span className="rv-works__tech" role="cell" data-label={t(WORKS.technique)}>
                        {t(work.tech)}
                        {work.size ? <span>{work.size}</span> : null}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rv-room__next">
                <button className="rv-btn" type="button" onClick={() => chooseRoom(nextRoom, true)}>
                  {fill(t(nextRoom === 0 ? WORKS.back : WORKS.next), {
                    n: nextRoom + 1,
                    from: nextWorks[0].cat,
                    to: nextWorks[nextWorks.length - 1].cat,
                  })}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rv-sec" id="rv-visit" aria-labelledby="rv-visit-title">
          <div className="rv-sec__head">
            <h2 id="rv-visit-title">{t(VISIT.title)}</h2>
            <p>{t(VISIT.note)}</p>
          </div>
          <div className="rv-sec__body rv-visit">
            <table className="rv-hours">
              {[
                { name: VISIT.hours, rows: HOURS },
                { name: VISIT.prices, rows: PRICE_LIST },
              ].map((group) => (
                <tbody key={group.name.en}>
                  <tr>
                    <th scope="colgroup" colSpan={2}>{t(group.name)}</th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.name.en} className={row.today ? 'is-today' : row.shut ? 'is-shut' : undefined}>
                      <th scope="row">{t(row.name)}</th>
                      <td>
                        <b>{t(row.value)}</b>
                        {row.note ? <span>{t(row.note)}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>

            <div className="rv-buy" id="rv-buy">
              <h3 id="rv-buy-title">{t(TICKETS.title)}</h3>
              {booking ? (
                <div className="rv-done" ref={doneRef} tabIndex={-1} aria-labelledby="rv-done-title">
                  <p className="rv-done__title" id="rv-done-title">{fill(t(TICKETS.doneTitle), { day: formatDay(booking.date) })}</p>
                  <p className="rv-done__body">
                    {fill(t(TICKETS.doneBody), { counts: countPhrase(booking.counts), total: booking.total, email: booking.email })}
                  </p>
                  <button className="rv-btn" type="button" onClick={() => setBooking(null)}>{t(TICKETS.again)}</button>
                </div>
              ) : (
                <form className="rv-form" noValidate onSubmit={book} aria-labelledby="rv-buy-title">
                  <div className={`rv-field${errors.date ? ' is-invalid' : ''}`}>
                    <label htmlFor="rv-date">{t(TICKETS.date)}</label>
                    <input
                      id="rv-date"
                      ref={dateRef}
                      type="date"
                      min={TODAY}
                      max={LAST_DAY}
                      required
                      value={visitDate}
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? 'rv-date-error' : dayLine ? 'rv-date-day' : undefined}
                      onChange={(event) => {
                        setVisitDate(event.target.value);
                        if (errors.date) setErrors({ ...errors, date: null });
                      }}
                    />
                    {errors.date ? (
                      <p className="rv-error" id="rv-date-error" role="alert">{t(DATE_ERRORS[errors.date])}</p>
                    ) : dayLine ? (
                      <p className="rv-field__note" id="rv-date-day">{dayLine}</p>
                    ) : null}
                  </div>

                  <fieldset className={`rv-count${errors.count ? ' is-invalid' : ''}`} aria-describedby={errors.count ? 'rv-count-error rv-count-note' : 'rv-count-note'}>
                    <legend>{t(TICKETS.legend)}</legend>
                    {(['adult', 'concession'] as const).map((kind) => {
                      const full = tickets >= MAX_TICKETS;
                      const empty = counts[kind] === 0;
                      return (
                        <div key={kind} className="rv-count__row" role="group" aria-labelledby={`rv-${kind}-name rv-${kind}-n`}>
                          <p className="rv-count__name" id={`rv-${kind}-name`}>
                            <b>{t(kind === 'adult' ? TICKETS.adult : TICKETS.concession)}</b>
                            {kind === 'concession' ? <span>{t(TICKETS.concessionWho)}</span> : null}
                            <span>CHF {PRICES[kind]}</span>
                          </p>
                          <div className="rv-step">
                            <button
                              className="rv-step__btn"
                              type="button"
                              aria-label={t(kind === 'adult' ? TICKETS.removeAdult : TICKETS.removeConcession)}
                              aria-disabled={empty || undefined}
                              onClick={() => step(kind, -1)}
                            >
                              <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true"><path d="M3 8h10" /></svg>
                            </button>
                            <span className="rv-step__n" id={`rv-${kind}-n`}>{counts[kind]}</span>
                            <button
                              className="rv-step__btn"
                              type="button"
                              ref={kind === 'adult' ? addAdultRef : undefined}
                              aria-label={t(kind === 'adult' ? TICKETS.addAdult : TICKETS.addConcession)}
                              aria-disabled={full || undefined}
                              onClick={() => step(kind, 1)}
                            >
                              <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true"><path d="M3 8h10M8 3v10" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <p className="rv-field__note" id="rv-count-note">{fill(t(TICKETS.countNote), { phone: PHONE })}</p>
                    {errors.count ? <p className="rv-error" id="rv-count-error" role="alert">{t(TICKETS.countError)}</p> : null}
                  </fieldset>

                  <p className="rv-total">
                    <span>{t(TICKETS.total)}</span>
                    <b>CHF {total}</b>
                  </p>

                  <div className={`rv-field${errors.email ? ' is-invalid' : ''}`}>
                    <label htmlFor="rv-email">{t(TICKETS.email)}</label>
                    <input
                      id="rv-email"
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      aria-invalid={errors.email || undefined}
                      aria-describedby={errors.email ? 'rv-email-error' : undefined}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (errors.email) setErrors({ ...errors, email: false });
                      }}
                    />
                    {errors.email ? <p className="rv-error" id="rv-email-error" role="alert">{t(TICKETS.emailError)}</p> : null}
                  </div>

                  <button className="rv-btn rv-btn--red rv-form__submit" type="submit">{submitLabel}</button>
                  <p className="rv-field__note">{t(TICKETS.pay)}</p>
                  <p className="rv-sr" role="status">{countNews}</p>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="rv-sec" id="rv-talks" aria-labelledby="rv-talks-title">
          <div className="rv-sec__head">
            <h2 id="rv-talks-title">{t(TALK_COPY.title)}</h2>
            <p>{t(TALK_COPY.note)}</p>
          </div>
          <div className="rv-sec__body">
            <ul className="rv-talks">
              {TALKS.map((talk) => {
                const past = talk.recording !== undefined;
                const hasSeat = Boolean(seats[talk.id]);
                const onList = Boolean(waits[talk.id]);
                const open = Boolean(chapters[talk.id]);
                const state = past ? ' is-past' : talk.next ? ' is-next' : '';
                return (
                  <li key={talk.id} className={`rv-talk${state}`}>
                    <div className="rv-talk__date">
                      <time dateTime={talk.date}>
                        <span className="rv-talk__day">{talk.day}</span>
                        <span className="rv-talk__when"><b>{t(talk.month)}</b>{t(talk.when)}</span>
                      </time>
                      {talk.next ? <span className="rv-sr">{t(TALK_COPY.nextTalk)}</span> : null}
                    </div>
                    <div className="rv-talk__body">
                      <h3>{t(talk.title)}</h3>
                      <p className="rv-talk__who">{t(talk.who)}</p>
                    </div>
                    <div className="rv-talk__act">
                      {talk.recording ? (
                        <>
                          <p>{fill(t(TALK_COPY.recorded), { n: talk.recording.minutes })}</p>
                          <button
                            className="rv-textbtn"
                            type="button"
                            aria-expanded={open}
                            aria-controls={`rv-chapters-${talk.id}`}
                            onClick={() => setChapters({ ...chapters, [talk.id]: !open })}
                          >
                            {t(TALK_COPY.chapters)}
                          </button>
                        </>
                      ) : talk.left === 0 ? (
                        <>
                          <p><b>{t(TALK_COPY.full)}</b></p>
                          <p>{onList ? fill(t(TALK_COPY.onList), { n: (talk.waiting ?? 0) + 1 }) : fill(t(TALK_COPY.waiting), { n: talk.waiting ?? 0 })}</p>
                          <button className="rv-textbtn" type="button" onClick={() => toggleWait(talk)}>
                            {t(onList ? TALK_COPY.leave : TALK_COPY.join)}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="rv-btn" type="button" onClick={() => toggleSeat(talk)}>
                            {t(hasSeat ? TALK_COPY.cancel : TALK_COPY.book)}
                          </button>
                          <p>
                            {hasSeat
                              ? fill(t(TALK_COPY.have), { n: (talk.left ?? 0) - 1 })
                              : fill(t(TALK_COPY.left), { n: talk.left ?? 0 })}
                          </p>
                        </>
                      )}
                    </div>
                    {talk.recording ? (
                      <div className="rv-talk__chapters" id={`rv-chapters-${talk.id}`} hidden={!open}>
                        <p>{t(TALK_COPY.station)}</p>
                        <ol>
                          {talk.recording.chapters.map((chapter) => (
                            <li key={chapter.at}>
                              <b>{chapter.at}</b>
                              <span>{t(chapter.title)}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="rv-sr" role="status">{talkNews}</p>
          </div>
        </section>

        <footer className="rv-foot">
          <p><b>{MUSEUM}</b><br />{ADDRESS}</p>
          <p>{PHONE}<br />{EMAIL}</p>
          <p>{t(FOOT.support)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
