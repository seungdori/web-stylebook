import { useEffect, useRef, useState } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Locale = 'en' | 'ko' | 'ja';
type LampTone = 'oak' | 'walnut' | 'ebonised';
type LampView = 'front' | 'top' | 'exploded';
const L = <T extends Record<Locale, string>>(obj: T, lang: Locale) => obj[lang];

// ============================================================
// CONCEPT
// ============================================================
// A product page for an actual physical object — a desk lamp —
// rendered as a draughtsman's technical drawing.
//
// What designers can lift from this page:
//   · Drafting-sheet visual language (frame, crosshairs, ruler,
//     dimension lines, rubber stamp, title block)
//   · Hardware-product page structure: nav, hero, spec grid,
//     B.O.M., detail close-up, variant cards with prices,
//     studio bio, newsletter footer.
// ============================================================

const GRID_X = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const GRID_Y = ['1', '2', '3', '4', '5', '6', '7', '8'];

const NAV = [
  { en: 'Lamp',       ko: '램프',     ja: 'ランプ' },
  { en: 'Materials',  ko: '소재',     ja: '素材' },
  { en: 'Atelier',    ko: '아틀리에', ja: 'アトリエ' },
  { en: 'Manifesto',  ko: '선언',     ja: '宣言' },
  { en: 'Shop',       ko: '주문',     ja: '購入' },
];

const SPECS = [
  { k: { en: 'HEIGHT',     ko: '높이',   ja: '高さ' },     v: '540 mm', sub: { en: 'arm fully extended', ko: '암 완전 연장 기준', ja: 'アーム全伸長時' } },
  { k: { en: 'REACH',      ko: '도달',   ja: '到達' },     v: '480 mm', sub: { en: 'arm + head',            ko: '암 + 헤드',          ja: 'アーム + ヘッド' } },
  { k: { en: 'BASE',       ko: '베이스', ja: 'ベース' },   v: '220 mm', sub: { en: 'oak disc, weighted',    ko: '오크 원반, 가중',    ja: 'オーク円盤、加重' } },
  { k: { en: 'MASS',       ko: '질량',   ja: '質量' },     v: '1.2 kg', sub: { en: 'brass arm 0.48 kg',     ko: '황동 암 0.48 kg',    ja: '真鍮アーム0.48 kg' } },
  { k: { en: 'WATTAGE',    ko: '소비',   ja: '消費電力' },  v: '6 W',    sub: { en: 'warm 2700 K LED',       ko: '웜 2700 K LED',     ja: '暖色 2700 K LED' } },
  { k: { en: 'LIFETIME',   ko: '수명',   ja: '寿命' },     v: '25 yr',  sub: { en: 'replacement parts kept', ko: '교체 부품 보유',     ja: '交換部品保有' } },
];

const BOM = [
  { item: '01', pn: 'LMP-ARM-BR',  desc: { en: 'Reach arm',            ko: '도달 암',        ja: '到達アーム' },        mat: { en: 'Solid brass',        ko: '솔리드 황동',       ja: 'ソリッド真鍮' },      finish: { en: 'Lacquered',          ko: '래커 코팅',          ja: 'ラッカー仕上' },     origin: { en: 'KIX', ko: 'KIX', ja: 'KIX' }, qty: '1' },
  { item: '02', pn: 'LMP-JNT-BR',  desc: { en: 'Articulating joint',   ko: '관절',           ja: '関節' },             mat: { en: 'Brass · steel pin',   ko: '황동 · 강철 핀',    ja: '真鍮 · 鋼ピン' },    finish: { en: 'Hand-polished',      ko: '수동 연마',          ja: '手研磨' },           origin: { en: 'KIX', ko: 'KIX', ja: 'KIX' }, qty: '2' },
  { item: '03', pn: 'LMP-STM-BR',  desc: { en: 'Vertical stem',        ko: '수직 스템',      ja: '垂直ステム' },        mat: { en: 'Drawn brass tube',    ko: '인발 황동 튜브',     ja: '引抜真鍮管' },        finish: { en: 'Brushed satin',      ko: '브러쉬 새틴',        ja: 'ヘアライン' },       origin: { en: 'KIX', ko: 'KIX', ja: 'KIX' }, qty: '1' },
  { item: '04', pn: 'LMP-BAS-OK',  desc: { en: 'Disc base',            ko: '디스크 베이스',  ja: 'ディスク台' },        mat: { en: 'White oak',           ko: '화이트 오크',        ja: 'ホワイトオーク' },    finish: { en: 'Hardwax oil',        ko: '하드왁스 오일',      ja: 'ハードワックスオイル' }, origin: { en: 'SEL', ko: 'SEL', ja: 'SEL' }, qty: '1' },
  { item: '05', pn: 'LMP-WGT-FE',  desc: { en: 'Counterweight',        ko: '카운터웨이트',   ja: 'カウンターウェイト' }, mat: { en: 'Cast iron',           ko: '주철',               ja: '鋳鉄' },              finish: { en: 'Powder-coated',      ko: '분체 도장',          ja: '粉体塗装' },         origin: { en: 'SEL', ko: 'SEL', ja: 'SEL' }, qty: '1' },
  { item: '06', pn: 'LMP-SHD-LN',  desc: { en: 'Linen-paper shade',    ko: '리넨 페이퍼 셰이드', ja: 'リネン紙シェード' },  mat: { en: 'Linen on washi',      ko: '와시 위 리넨',       ja: '和紙にリネン' },     finish: { en: 'Natural',            ko: '자연 마감',          ja: 'ナチュラル' },       origin: { en: 'KYO', ko: 'KYO', ja: 'KYO' }, qty: '1' },
  { item: '07', pn: 'LMP-LED-27',  desc: { en: 'LED module',           ko: 'LED 모듈',       ja: 'LEDモジュール' },     mat: { en: '2700 K · 6 W · 95 CRI', ko: '2700 K · 6 W · 95 CRI', ja: '2700 K · 6 W · 95 CRI' }, finish: { en: 'Replaceable',  ko: '교체 가능',          ja: '交換可能' },         origin: { en: 'TYO', ko: 'TYO', ja: 'TYO' }, qty: '1' },
];

const PRINCIPLES = [
  {
    n: '01',
    head: { en: 'EVERY PART IS REPLACEABLE',     ko: '모든 부품은 교체 가능',     ja: 'すべての部品は交換可能' },
    body: {
      en: 'Bulbs, joints, the shade, even the brass arm — every numbered part can be unscrewed and ordered from the studio for twenty-five years from purchase. Nothing is glued. Nothing is sealed.',
      ko: '전구, 관절, 셰이드, 황동 암까지 — 모든 번호 부품은 풀어서 분리되고 구매 후 25년간 스튜디오에서 주문할 수 있다. 본드 사용 없음. 봉인 없음.',
      ja: '電球、関節、シェード、真鍮アームまで — すべての番号付き部品はネジを外して取り外し、購入から25年間スタジオから注文できる。接着剤未使用。封止なし。',
    },
  },
  {
    n: '02',
    head: { en: 'TOOLS COME WITH THE OBJECT',     ko: '도구는 제품과 함께',         ja: '工具は製品とともに' },
    body: {
      en: 'A hex key, a polish cloth, and a paper bulb-replacement guide ship inside the base of the lamp. If a future owner cannot find us, the lamp can still be repaired with what is in the box.',
      ko: '육각 렌치, 연마용 천, 그리고 종이로 된 전구 교체 안내서가 램프 베이스 안에 함께 동봉된다. 미래의 사용자가 우리를 찾지 못해도, 상자 안의 도구만으로 수리할 수 있다.',
      ja: '六角レンチ、磨き布、紙の電球交換ガイドがランプの台座内に同梱される。将来の所有者が私たちに連絡できなくなっても、箱の中身だけで修理できる。',
    },
  },
  {
    n: '03',
    head: { en: 'FIFTY LAMPS PER QUARTER',       ko: '분기당 50개',                ja: '四半期に50台' },
    body: {
      en: 'We assemble fifty lamps per quarter by hand, the four of us, in the same room. We never increase the run. When the run is full, we send a postcard with the date of the next opening.',
      ko: '4인이 한 방에서 손으로 분기당 50개를 조립한다. 수량은 늘리지 않는다. 분기가 마감되면 다음 오픈일을 적은 엽서를 보낸다.',
      ja: '4人で同じ部屋にて手作業で四半期50台を組み立てる。台数は決して増やさない。受付が満了したら、次回開始日を記したはがきを送る。',
    },
  },
];

const VARIANTS = [
  {
    code: 'OAK',
    name: { en: 'NATURAL OAK',  ko: '내추럴 오크',  ja: 'ナチュラル・オーク' },
    sub:  { en: 'Hardwax-oiled white oak base',  ko: '하드왁스 오일 화이트 오크 베이스', ja: 'ハードワックス・オイルのホワイトオーク台座' },
    pn:   'LMP-VR-OAK',
    price: '₩  980,000',
    priceUsd: '$  720',
    inStock: { en: '12 / 50 remaining',  ko: '잔여 12 / 50',  ja: '残12 / 50' },
  },
  {
    code: 'WAL',
    name: { en: 'AMERICAN WALNUT', ko: '아메리칸 월넛',  ja: 'アメリカン・ウォルナット' },
    sub:  { en: 'Oiled solid walnut, ages amber', ko: '오일 마감 솔리드 월넛, 호박색으로 변색', ja: 'オイル仕上ソリッドウォルナット、琥珀色に経年変化' },
    pn:   'LMP-VR-WAL',
    price: '₩1,180,000',
    priceUsd: '$  860',
    inStock: { en: '07 / 50 remaining',  ko: '잔여 07 / 50',  ja: '残07 / 50' },
  },
  {
    code: 'EBO',
    name: { en: 'EBONISED OAK',     ko: '에보니화 오크',  ja: '黒檀化オーク' },
    sub:  { en: 'Iron-acetate ebonised, hand-rubbed',  ko: '철 아세테이트 에보니화, 수작업 광택', ja: '酢酸鉄黒檀化、手磨き' },
    pn:   'LMP-VR-EBO',
    price: '₩1,180,000',
    priceUsd: '$  860',
    inStock: { en: 'WAITLIST · Q4 2026', ko: '대기 · 2026 Q4', ja: 'ウェイトリスト · 2026 Q4' },
  },
];

const COPY = {
  drNo: 'DR.NO. WS-LMP-2026-Q3 / 01',
  status: { en: 'STATUS · 19 / 50 LEFT THIS QUARTER',  ko: '상태 · 이번 분기 잔여 19 / 50',  ja: '状態 · 今期残19 / 50' },
  rev:    { en: 'REV ▲ A · 15·MAY·2026',                ko: 'REV ▲ A · 2026·05·15',            ja: 'REV ▲ A · 2026·05·15' },

  brand: 'WS / PRACTICE',
  brandSub: { en: 'A four-person studio · Seoul',  ko: '4인 스튜디오 · 서울',  ja: '4名のスタジオ · ソウル' },
  cart: { en: 'Cart (0)',  ko: '장바구니 (0)',  ja: 'カート (0)' },

  sheetTag: { en: 'SHEET 01 OF 06 — PRODUCT VIEW',  ko: '시트 01 / 06 — 제품도',  ja: 'SHEET 01 / 06 — 製品図' },
  productCode: { en: 'PART NO. LMP-01-DESK',  ko: '부품번호 LMP-01-DESK',  ja: '部品番号 LMP-01-DESK' },
  title:    { en: { line1: 'MANIFESTO', line2: '01 · DESK' }, ko: { line1: '매니페스토', line2: '01 · 데스크' }, ja: { line1: 'マニフェスト', line2: '01 · デスク' } },
  productKind: { en: 'A desk lamp, drawn by hand and sold by the studio that drew it.', ko: '손으로 작도하여, 작도한 스튜디오가 직접 판매하는 데스크 램프.', ja: '手で作図し、作図したスタジオが直接販売するデスク・ランプ。' },

  priceLabel: { en: 'FROM',  ko: '시작가',  ja: '価格' },
  price: '₩  980,000',
  priceUsd: '$  720',
  vat: { en: 'VAT incl. · Free shipping in EU / JP / KR / US',  ko: 'VAT 포함 · EU / JP / KR / US 무료 배송',  ja: 'VAT込 · EU / JP / KR / US 送料無料' },

  cta:  { en: 'ORDER  ▶',  ko: '주문하기 ▶',  ja: '注文する ▶' },
  cta2: { en: 'ADD TO ATELIER NOTES',  ko: '아틀리에 노트에 추가',  ja: 'アトリエ・ノートに追加' },

  dimSectionA: { en: 'SECTION A — SPECIFICATIONS',  ko: '단면 A — 사양',         ja: '断面 A — 仕様' },
  dimSectionB: { en: 'SECTION B — DESIGN PRINCIPLES', ko: '단면 B — 설계 원칙',   ja: '断面 B — 設計原則' },
  dimSectionC: { en: 'SECTION C — BILL OF MATERIALS', ko: '단면 C — 부품표',     ja: '断面 C — 部品表' },
  dimSectionD: { en: 'DETAIL (A) — THE BRASS JOINT',  ko: '상세 (A) — 황동 관절', ja: '詳細 (A) — 真鍮の関節' },
  dimSectionE: { en: 'SECTION E — VARIANTS & ORDER',  ko: '단면 E — 사양 & 주문', ja: '断面 E — 仕様と注文' },
  dimSectionF: { en: 'SECTION F — STUDIO',            ko: '단면 F — 스튜디오',    ja: '断面 F — スタジオ' },

  specsIntro: {
    en: 'A single product. Six specifications you can verify in your hand with a tape measure on arrival. We disclose every number.',
    ko: '단일 제품. 도착 시 줄자로 직접 검증할 수 있는 여섯 가지 사양. 모든 수치를 공개합니다.',
    ja: '単一の製品。到着時に巻尺で検証できる6つの仕様。すべての数値を開示します。',
  },

  bomSub: { en: 'Sheet 03 / 06 — assembled by hand by four people, in one room.', ko: '시트 03 / 06 — 4명이 한 방에서 손으로 조립.', ja: 'シート 03 / 06 — 4名が同じ部屋で手作業で組立。' },
  bomCols: [
    { en: 'ITEM',      ko: '항목',     ja: '項目' },
    { en: 'PART NO.',  ko: '부품번호', ja: '部品番号' },
    { en: 'PART',      ko: '품명',     ja: '品名' },
    { en: 'MATERIAL',  ko: '소재',     ja: '素材' },
    { en: 'FINISH',    ko: '마감',     ja: '仕上' },
    { en: 'ORG.',      ko: '원산',     ja: '原産' },
    { en: 'QTY',       ko: '수량',     ja: '数量' },
  ],
  bomTol: {
    en: '▲ Hand-fit tolerance ±0.2 mm on all brass parts.    ◇ Every part replaceable for 25 years.    ◯ Lamp leaves the atelier with two spare bulbs and one hex key.',
    ko: '▲ 모든 황동 부품 수공 가공 공차 ±0.2 mm.   ◇ 모든 부품은 25년간 교체 가능.   ◯ 출고 시 예비 전구 2개 + 육각 렌치 1개 포함.',
    ja: '▲ 全真鍮部品の手作業公差 ±0.2 mm。   ◇ 全部品25年間交換可能。   ◯ 出荷時に予備電球2個と六角レンチ1本同梱。',
  },
  stamp: { en: 'HAND-MADE · 50/Q',  ko: '수작업 · 분기 50대',  ja: '手作業 · 50/Q' },

  detailScale: { en: 'SCALE 5 ×', ko: '축척 5 배', ja: '縮尺 5 倍' },
  detailBody: {
    en: 'A brass joint that holds its angle by friction, not springs. We machine it once and hand-polish it twice. After ten thousand pivots it still holds the angle you set.',
    ko: '스프링이 아니라 *마찰*로 각도를 유지하는 황동 관절. 한 번 가공하고 두 번 손으로 광을 낸다. 만 번을 움직여도 사용자가 정해 둔 각도를 유지한다.',
    ja: 'バネではなく*摩擦*で角度を保つ真鍮の関節。一度切削し、二度手で磨く。一万回動かしても、使用者が設定した角度を保ち続ける。',
  },
  detailQuote: {
    en: '"A lamp is just a joint, repeated."',
    ko: '"램프는 결국 하나의 관절을, 반복한 것이다."',
    ja: '「ランプとは結局、ひとつの関節を、繰り返したものである。」',
  },
  detailQuoteBy: { en: '— Founding note · 2019',  ko: '— 창립 메모 · 2019',  ja: '— 創立メモ · 2019' },

  variantsIntro: {
    en: 'Three finishes. Each is a separate run of fifty per quarter. Place an order and we send a paper postcard within three working days with your assembly slot.',
    ko: '세 가지 마감. 각각 분기마다 50대로 별도 제작. 주문하시면 영업일 3일 안에 *조립 배정 일정*이 적힌 종이 엽서를 보내드립니다.',
    ja: '3つの仕上。それぞれが四半期50台の個別ロット。ご注文後、営業日3日以内に*組立スケジュール*を記した紙のはがきをお送りします。',
  },
  variantBuy: { en: 'ORDER ▶',  ko: '주문 ▶',  ja: '注文 ▶' },
  variantNotify: { en: 'NOTIFY ME',  ko: '알림 받기',  ja: '通知を受ける' },

  studioHead: { en: 'WS / PRACTICE — A four-person studio',  ko: 'WS / PRACTICE — 4인 스튜디오',  ja: 'WS / PRACTICE — 4名のスタジオ' },
  studioBody: {
    en: 'We are four — a draughtsman, a machinist, an upholsterer, and a writer. We share a room above a print shop in Bukchon. We make one product per year: a desk lamp, a chair, a side table. We sell only to people who write us a letter first.',
    ko: '우리는 4인이다 — 제도가 한 명, 기계 가공자 한 명, 가구 제작자 한 명, 글쓰는 사람 한 명. 북촌의 인쇄소 위층 방을 함께 쓴다. 연간 한 제품만 만든다: 데스크 램프 한 해, 의자 한 해, 사이드 테이블 한 해. 먼저 *편지*를 보낸 분께만 판매한다.',
    ja: '私たちは4人 — 製図者一人、機械工一人、家具職人一人、文筆家一人。北村の印刷所の上の階の部屋を共有している。年に一つの製品だけを作る: ある年はデスク・ランプ、ある年は椅子、ある年はサイドテーブル。先に*手紙*を書いてくれた人にだけ販売する。',
  },

  newsletterHead: { en: 'PAPER CORRESPONDENCE',  ko: '종이 통신',  ja: '紙通信' },
  newsletterBody: {
    en: 'Twice a year we send a paper postcard with the next opening date. Enter an address — a real one — and we will send the first one within a week.',
    ko: '연 2회, 다음 판매 오픈일이 적힌 종이 엽서를 보냅니다. *실제 주소*를 입력해 주시면, 일주일 안에 첫 엽서가 도착합니다.',
    ja: '年に二度、次回販売開始日を記した紙のはがきをお送りします。*実際の住所*を入力していただければ、一週間以内に最初の一通が届きます。',
  },
  newsletterCta: { en: 'POST ME A CARD ▶',  ko: '엽서 받기 ▶',  ja: 'はがきを受け取る ▶' },
  newsletterPlaceholder: { en: 'Street, city, postal code',  ko: '도로명, 시, 우편번호',  ja: '住所、市、郵便番号' },

  tbCells: [
    { k: { en: 'FIRM',     ko: '회사',    ja: '会社' },     v: 'WS / PRACTICE',         sub: { en: 'Bukchon-ro 12-gil · Jongno-gu · Seoul 03052', ko: '북촌로12길 · 종로구 · 서울 03052', ja: '北村路12通 · 鍾路区 · ソウル 03052' } },
    { k: { en: 'CONTACT',  ko: '연락',    ja: '連絡' },     v: 'studio@ws.practice',   sub: { en: '+82 (0)10 2026 0519',                          ko: '+82 (0)10 2026 0519',              ja: '+82 (0)10 2026 0519' } },
    { k: { en: 'OPEN',     ko: '영업',    ja: '営業' },     v: 'MON · THU',             sub: { en: '10–18 KST · by appointment',                    ko: '10–18 KST · 예약제',              ja: '10–18 KST · 予約制' } },
    { k: { en: 'WARRANTY', ko: '보증',    ja: '保証' },     v: '25 yr',                 sub: { en: 'parts kept, returns repaired',                   ko: '부품 보유, 반품은 수리',           ja: '部品保有、返品は修理対応' } },
    { k: { en: 'RUN',      ko: '제작',    ja: '製作' },     v: '50 / QUARTER',          sub: { en: 'four-person hand assembly',                       ko: '4인 수작업 조립',                  ja: '4名による手作業組立' } },
    { k: { en: 'PAYMENT',  ko: '결제',    ja: '決済' },     v: 'KRW · JPY · USD · EUR', sub: { en: 'card, wire, paper invoice',                      ko: '카드 · 송금 · 종이 청구서',         ja: 'カード · 送金 · 紙の請求書' } },
  ],

  footNotes: [
    { en: 'NOTE · 01 — DO NOT SCALE THIS DRAWING.',                                  ko: 'NOTE · 01 — 이 도면을 자로 측정하지 말 것.',                    ja: 'NOTE · 01 — この図面を寸法計測に使用しないこと。' },
    { en: 'NOTE · 02 — DIMENSIONS IN MILLIMETRES UNLESS OTHERWISE NOTED.',            ko: 'NOTE · 02 — 별도 표기 없는 한 모든 치수는 mm 단위.',            ja: 'NOTE · 02 — 別記なき限り全寸法 mm 単位。' },
    { en: 'NOTE · 03 — ALL BRASS IS LACQUERED · UNLACQUER ON REQUEST.',                ko: 'NOTE · 03 — 모든 황동은 래커 코팅 · 미코팅 옵션 요청 가능.',     ja: 'NOTE · 03 — 全真鍮はラッカー仕上 · 未仕上は要望対応。' },
    { en: 'NOTE · 04 — © WS / PRACTICE · 2019—2026 · ALL DRAWINGS BY HAND.',           ko: 'NOTE · 04 — © WS / PRACTICE · 2019—2026 · 모든 도면은 손으로.', ja: 'NOTE · 04 — © WS / PRACTICE · 2019—2026 · 全図面手描き。' },
  ],
  colophon: {
    en: 'SET IN JETBRAINS MONO · DRAFTED ON PAPER #FAFAF7 · OXBLOOD INK #6E1D1F · NEVER PURE WHITE',
    ko: 'JETBRAINS MONO 조판 · 페이퍼 #FAFAF7 작도 · 옥스블러드 잉크 #6E1D1F · 순백 사용 금지',
    ja: 'JETBRAINS MONO組版 · ペーパー #FAFAF7作図 · オックスブラッド・インク #6E1D1F · 純白禁止',
  },
  views: [
    { id: 'front',    label: { en: 'FRONT',    ko: '정면',    ja: '正面' } },
    { id: 'top',      label: { en: 'TOP',      ko: '평면',    ja: '平面' } },
    { id: 'exploded', label: { en: 'EXPLODED', ko: '분해도',  ja: '分解' } },
  ] as const,
  scrollHint: {
    en: 'SCROLL · DISASSEMBLE',
    ko: '스크롤 · 분해 시작',
    ja: 'SCROLL · 分解開始',
  },
  beats: {
    top: {
      tag:   { en: 'BEAT · 02 / 03',   ko: '비트 · 02 / 03',   ja: 'BEAT · 02 / 03' },
      head:  { en: 'FOOTPRINT',         ko: '풋프린트',          ja: 'フットプリント' },
      body: {
        en: 'A 220 mm white-oak disc with a single brass shaft. The arm reaches 480 mm from centre. Set it on a 250 mm shelf and it has space to breathe.',
        ko: '220 mm 화이트 오크 원반과 한 줄의 황동 샤프트. 암은 중심에서 480 mm까지 뻗는다. 250 mm 선반에 놓으면 호흡할 공간이 있다.',
        ja: '直径220 mmのホワイトオーク円盤と一本の真鍮シャフト。アームは中心から480 mmまで届く。250 mmの棚に置けば呼吸する余裕がある。',
      },
      annot: [
        { k: { en: 'BASE Ø',    ko: '베이스 Ø', ja: 'ベース Ø' }, v: '220 mm' },
        { k: { en: 'ARM REACH', ko: '암 도달',  ja: 'アーム到達' }, v: '480 mm' },
        { k: { en: 'CLEARANCE', ko: '여유',     ja: '余裕' },     v: '30 mm' },
      ],
    },
    exploded: {
      tag:   { en: 'BEAT · 03 / 03',   ko: '비트 · 03 / 03',   ja: 'BEAT · 03 / 03' },
      head:  { en: 'ANATOMY',           ko: '구조',              ja: '構造' },
      body: {
        en: 'Eight parts. No glue. One hex key, shipped inside the base. Every part remains in production for twenty-five years, and may be re-ordered by name from the studio.',
        ko: '여덟 개 부품. 본드 없음. 베이스 안에 동봉된 육각 렌치 한 개. 모든 부품은 25년간 생산되며, 스튜디오에 *이름으로* 주문할 수 있다.',
        ja: '八つの部品。接着剤なし。台座内に同梱された六角レンチ一本。全部品は25年間生産され、*名前で*スタジオに再注文できる。',
      },
      annot: [
        { k: { en: 'PARTS',          ko: '부품 수',  ja: '部品数' },    v: '08' },
        { k: { en: 'YEARS SUPPORT',  ko: '지원 기간', ja: 'サポート' }, v: '25 yr' },
        { k: { en: 'GLUE',           ko: '본드',     ja: '接着剤' },   v: '0 g' },
      ],
    },
  },
} as const;

// ---- prompts ----

const promptEn = `Design a single-product e-commerce page (premium hardware — a desk lamp made by a four-person studio) where every surface looks like a real draughtsman's technical drawing. The aesthetic IS the brand. Reusable as a reference for any hardware / industrial-design / atelier / architecture product page.

PARENTS:
Brutalist Grid — visible 2 px sheet border, hairline construction grid, registration crosshairs at four corners, ALL-CAPS mono labels, tabular numerals.
Mono Type — JetBrains Mono everywhere, including the display title. Uniform draftsman stroke; no serif anywhere.

INVERSION (THE GIFT):
A standard product page is glossy and friendly. Render it as cold engineering instead: hero gets a "DR.NO." strip and dimension lines under the lamp drawing; features become "SECTION A — SPECIFICATIONS"; ingredients become "BILL OF MATERIALS"; close-up shots become "DETAIL (A) at 5×"; pricing-variant cards become "SECTION E — VARIANTS & ORDER" with part numbers; the order CTA is a text-only "ORDER ▶" with thick underline-on-hover; the footer is a real engineering "TITLE BLOCK" with FIRM / CONTACT / OPEN / WARRANTY / RUN / PAYMENT cells.

PAGE STRUCTURE (a complete e-commerce page, top to bottom):
0) Sheet frame (2 px ink border + 1 px inner rule at -12 px) with four oxblood registration crosshairs and a 32 px construction-grid underlay.
1) Coordinate ruler A–H along the top inner edge, 1–8 along the right edge.
2) Top navigation bar (in the sheet, full-width). Left: brand "WS / PRACTICE" + 1-line tagline. Centre: 5 nav links (Lamp / Materials / Atelier / Manifesto / Shop) underline-on-hover. Right: cart counter "Cart (0)" + language chip. 1.5 px ink rule below.
3) Strip header — three boxed cells: DR.NO. · STATUS dot + "19/50 LEFT THIS QUARTER" (oxblood) · REV ▲ A.
4) Hero — two columns. LEFT: a CSS/SVG line drawing of the lamp with dimension annotations (←480→, ←220→, ↕540) on three sides — pure black 1.5 px strokes on vellum. RIGHT: a "SHEET 01/06 — PRODUCT VIEW" kicker, the two-line monospace display title (MANIFESTO / 01 · DESK), product kind subtitle, FROM-price ₩980,000 / $720, VAT line, two CTA links ("ORDER ▶" with thick underline / "ADD TO ATELIER NOTES" smaller).
5) Section A — SPECIFICATIONS · a 3×2 spec grid (HEIGHT / REACH / BASE / MASS / WATTAGE / LIFETIME) — each cell has small mono caps label + big tabular value + italic mono sub-line. Cells share a 1.5 px ink frame.
6) Section B — DESIGN PRINCIPLES · three numbered rows with NOTE 01 / HEAD / BODY columns. A "HAND-MADE · 50/Q" rubber stamp rotated -8° in oxblood overlapping the top-right of the section.
7) Section C — BILL OF MATERIALS · 7-column table (ITEM / PART NO. / PART / MATERIAL / FINISH / ORG. / QTY). Black header row with vellum text. 7 rows. Tolerance footnote below with ▲ ◇ ◯ glyphs.
8) Section D — DETAIL (A) — a 112 px oxblood ring labelled "A" callout with a SCALE 5× chip, leading to a 30-word description and a single short pull-quote in oxblood.
9) Section E — VARIANTS & ORDER · three variant cards in a row. Each card: small lamp drawing tinted by the finish (oak/walnut/ebonised), variant name, sub, part number, price, stock state, "ORDER ▶" text-button (or NOTIFY ME when waitlisted). Same hairline frame as B.O.M. above.
10) Section F — STUDIO · two columns. LEFT: studio bio (4-person studio, room above a print shop). RIGHT: a paper-correspondence newsletter form — postal address input + "POST ME A CARD ▶" button (not email; signal the brand by asking for a real address).
11) Title block (engineering footer) — 6-cell grid: FIRM / CONTACT / OPEN / WARRANTY / RUN / PAYMENT. Big mono value + italic mono sub on each.
12) Footer notes — 4 numbered NOTE lines + a single mono colophon.

DISCIPLINE:
1) One accent — oxblood #6e1d1f — for crosshairs, status dot, callout ring, rubber stamp, price emphasis, part-number badges.
2) NO solid-fill buttons. Every CTA is a text link with 3 px underline-on-hover + a small ▶ arrow. The hover surface is the underline, not a coloured pill.
3) Paper white #fafaf7 base — clean technical paper, oxblood is the only chroma, never blueprint blue. White is reserved for the title-block cells.
4) Display title is monospace 700 at 9–11 vw with second line indented 16% for typographic rhythm.
5) Borders ≥1.5 px solid ink; hairlines no fainter than 28 % opacity black. No ghost borders.
6) Dimension-line separator between every section: ◀───── SECTION X — TITLE ─────▶.

TOKENS:
--qm-vellum #fafaf7  --qm-vellum-2 #ffffff  --qm-paper #f3f2ed  --qm-ink #0a0a0a  --qm-ink-2 #2a2a2a  --qm-mute #6a6a65  --qm-line rgba(10,10,10,0.42)  --qm-hair rgba(10,10,10,0.18)  --qm-grid rgba(10,10,10,0.045)  --qm-red #8a1c1c  --qm-stamp #6e1d1f

TYPOGRAPHY:
JetBrains Mono everywhere. Title 700 9–11 vw. Labels uppercase tracking +0.08em. Body 0.96 rem line-height 1.65. Tabular numerals on all numerics.

MOTION:
None on layout/rules. 200 ms colour transitions on hover. Rubber stamp rotates -8° once on first paint.

OUTPUT:
1) Tokens as CSS variables on the page root.
2) Sheet frame, crosshairs, and coordinate ruler as positioned pseudo-elements.
3) All twelve blocks above, in order, with dimension-line separators.
4) Responsive: at 880 px hide coordinate ruler, stack hero, collapse spec grid to 2 col, drop ORG. and QTY from BOM, stack variant cards, stack title-block cells.`;

const promptKo = `프리미엄 하드웨어 제품(4인 스튜디오에서 손으로 만드는 데스크 램프)의 단일 제품 e-커머스 페이지를 *실제 기계 도면*처럼 설계한다. 미감 자체가 *브랜드*다. 하드웨어 · 산업디자인 · 아틀리에 · 건축 등 어떤 단일 제품 페이지에도 *레퍼런스로 재활용 가능*해야 한다.

부모:
Brutalist Grid — 2 px 시트 테두리, 헤어라인 작도 그리드, 네 모서리 등록 십자선, 모든 라벨은 대문자 모노, tabular 숫자.
Mono Type — *디스플레이 타이틀 포함* 모든 텍스트가 JetBrains Mono. 세리프 본문 사용 금지.

전환(이 페이지가 주는 선물):
표준 제품 페이지는 매끈하고 친절하다. 우리는 *공학*으로 렌더링한다 — 히어로에 DR.NO. 스트립과 램프 도면 아래 치수선을, 피처는 § 단면 A — 사양으로, 성분 표는 § 단면 C — 부품표로, 클로즈업은 § 상세 (A) 5× 확대로, 가격 변형 카드는 § 단면 E — 사양·주문 + 부품번호로 렌더링한다. CTA는 *텍스트 전용* "ORDER ▶"에 hover 시 3 px 굵은 밑줄. 푸터는 실제 도면의 *표제란* — FIRM / CONTACT / OPEN / WARRANTY / RUN / PAYMENT 6셀.

페이지 구조(완전한 e-커머스 페이지):
0) 시트 프레임(2 px + 내부 1 px) + 네 모서리 옥스블러드 등록 십자선 + 32 px 작도 그리드.
1) 좌표 룰러(상단 A–H, 우측 1–8).
2) 상단 네비게이션 바 — 좌: 브랜드 + 태그라인. 가운데: 5개 메뉴(Lamp/Materials/Atelier/Manifesto/Shop) hover 밑줄. 우: Cart (0) + 언어 칩. 하단 1.5 px 룰.
3) 스트립 헤더 3셀 — DR.NO. · 옥스블러드 점 + STATUS 19/50 · REV ▲ A.
4) 히어로 2-컬럼 — 좌: 램프의 *CSS/SVG 라인 드로잉* + 치수선(←480→, ←220→, ↕540). 우: SHEET 01/06 키커 + 2줄 모노 타이틀(매니페스토 / 01 · 데스크) + 제품 설명 + 시작가 ₩980,000/$720 + VAT 라인 + 텍스트 CTA 두 개.
5) § A — SPECIFICATIONS · 3×2 사양 그리드(높이/도달/베이스/질량/소비/수명).
6) § B — DESIGN PRINCIPLES · NOTE 01-03 3행 + 회전된 "HAND-MADE · 50/Q" 옥스블러드 고무도장.
7) § C — BILL OF MATERIALS · 7-열 표(ITEM/PART NO./PART/MATERIAL/FINISH/ORG./QTY) + ▲◇◯ 공차 풋노트.
8) § D — DETAIL (A) · 옥스블러드 링 + 5× 칩 + 짧은 설명 + 풍 인용.
9) § E — VARIANTS & ORDER · 3개 마감(오크/월넛/에보니화)의 변형 카드 행. 각 카드: 마감 색조의 미니 램프 + 이름 + 부품번호 + 가격 + 재고 상태 + "ORDER ▶"(대기 시 "NOTIFY ME").
10) § F — STUDIO · 2-컬럼. 좌: 4인 스튜디오 약력. 우: *종이 우편* 뉴스레터 폼(이메일 아님, 우편 주소 입력 + "POST ME A CARD ▶") — 브랜드의 신호.
11) 표제란 — 6셀 그리드(FIRM/CONTACT/OPEN/WARRANTY/RUN/PAYMENT).
12) 푸터 노트 4행 + 모노 콜로폰.

규율:
1) 액센트 옥스블러드 #6e1d1f 하나 — 십자선·상태 점·콜아웃 링·고무도장·가격 강조·부품번호 배지.
2) *솔리드 버튼 사용 금지*. 모든 CTA는 ▶ 화살표 + hover 3 px 밑줄.
3) 페이퍼 화이트 #fafaf7 기본. 옥스블러드 한 색만 chroma로.
4) 디스플레이 타이틀은 *모노스페이스* 700, 9–11 vw, 2줄(두 번째 줄 16% 인덴트).
5) 보더는 1.5 px solid ink 이상. 헤어라인 최저 28% 검정. 유령 보더 금지.
6) 섹션마다 치수선 구분자: ◀───── SECTION X ─────▶.

토큰: --qm-vellum #fafaf7 · --qm-vellum-2 #ffffff · --qm-paper #f3f2ed · --qm-ink #0a0a0a · --qm-ink-2 #2a2a2a · --qm-mute #6a6a65 · --qm-line rgba(10,10,10,0.42) · --qm-hair rgba(10,10,10,0.18) · --qm-grid rgba(10,10,10,0.045) · --qm-red #8a1c1c · --qm-stamp #6e1d1f

타이포: 전부 JetBrains Mono. 타이틀 700 · 9–11 vw. 라벨 대문자 자간 +0.08em. 본문 0.96 rem · 라인하이트 1.65. 모든 숫자 tabular.

모션: 레이아웃 정지. hover 색 200 ms. 고무도장 첫 페인트 한 번 회전.

출력: 위 12개 블록을 토큰 변수 + CSS 의사 요소(프레임/십자선/룰러)와 함께 순서대로. 880 px에서 좌표 룰러 숨김, 히어로 스택, 사양 2열, BOM에서 ORG.·QTY 제거, 변형 카드 스택, 표제란 셀 스택.`;

const promptJa = `プレミアム・ハードウェア製品(4名のスタジオが手作りするデスク・ランプ)の単一製品 e-コマース・ページを*実際の機械図面*として設計する。美意識そのものが*ブランド*である。ハードウェア・産業デザイン・アトリエ・建築の単一製品ページの*再利用可能なリファレンス*。

親:
Brutalist Grid — 2 pxシート枠、ヘアラインの作図グリッド、四隅の見当十字、全ラベル大文字モノ、tabular数値。
Mono Type — *ディスプレイ・タイトル含む*すべてが JetBrains Mono。セリフ本文一切なし。

転倒(このページが贈るもの):
標準の製品ページは滑らかで親しげ。私たちは*エンジニアリング*としてレンダリングする — ヒーローに DR.NO. ストリップとランプ図の下に寸法線、フィーチャーは § 断面 A — 仕様、原材料は § 断面 C — 部品表、クローズアップは § 詳細 (A) 5×拡大、価格バリアントは § 断面 E — 仕様と注文 + 部品番号で。CTAは*テキスト専用* "ORDER ▶" にホバー3 px 太下線。フッターは実際の図面の*表題欄* — FIRM / CONTACT / OPEN / WARRANTY / RUN / PAYMENT 6セル。

ページ構成: シート枠+十字+ルーラー → トップナビ → ストリップ・ヘッダー → ヒーロー(左=ランプ図 + 寸法線、右=モノタイトル + 価格 + CTA) → § A 仕様3×2 → § B 設計原則3行+回転ゴム印 → § C 部品表7列 → § D 詳細(A) 5× → § E バリアント・カード3枚 → § F スタジオ伝記+紙はがき・ニュースレター → 表題欄6セル → フッター・ノート4行 + コロフォン。

規律: アクセントはオックスブラッド一色のみ(十字・ステータス・リング・ゴム印・価格・部品番号)。*ソリッド・ボタン禁止*、全 CTA は ▶ + ホバー3 px 下線。ペーパーホワイト #fafaf7 基本。タイトルはモノスペース 700、9–11 vw、2行(2行目16%インデント)。ボーダー1.5 px 以上、ヘアライン最低28%。セクションごとに寸法線セパレーター。

トークン:
--qm-vellum #fafaf7 · --qm-vellum-2 #ffffff · --qm-paper #f3f2ed · --qm-ink #0a0a0a · --qm-ink-2 #2a2a2a · --qm-mute #6a6a65 · --qm-line rgba(10,10,10,0.42) · --qm-hair rgba(10,10,10,0.18) · --qm-grid rgba(10,10,10,0.045) · --qm-red #8a1c1c · --qm-stamp #6e1d1f

タイポ: 全 JetBrains Mono。タイトル700・9–11vw、ラベル大文字+0.08em、本文0.96rem 行間1.65、全数値tabular。

モーション: レイアウト動きなし、ホバー色200 ms、ゴム印は初回ペイントで一度回転。

出力: 上記12ブロックを CSS変数 + 疑似要素(枠/十字/ルーラー)と共に順序通り。880 pxで座標ルーラー非表示、ヒーロー縦積み、仕様2列、BOMから ORG.・QTY 削除、バリアント・カード縦積み、表題欄セル縦積み。`;

function withItalics(text: string) {
  return text.split('*').map((chunk, i) =>
    i % 2 === 1 ? <em key={i}>{chunk}</em> : <span key={i}>{chunk}</span>,
  );
}

function DimSeparator({ label }: { label: string }) {
  return (
    <div className="qm-dim" role="separator" aria-label={label}>
      <span className="qm-dim__cap qm-dim__cap--l" aria-hidden="true" />
      <span className="qm-dim__line" aria-hidden="true" />
      <span className="qm-dim__badge">{label}</span>
      <span className="qm-dim__line" aria-hidden="true" />
      <span className="qm-dim__cap qm-dim__cap--r" aria-hidden="true" />
    </div>
  );
}

function toneFill(tone: LampTone) {
  return tone === 'oak' ? '#d8c79a' : tone === 'walnut' ? '#8b5a3c' : '#1a1410';
}

function LampFrontSVG({ tone = 'oak' }: { tone?: LampTone }) {
  const baseFill = toneFill(tone);
  return (
    <svg viewBox="0 0 200 320" className="qm-lamp" aria-label="Desk lamp · front view">
      <rect x="44" y="290" width="112" height="14" fill={baseFill} stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="100" y1="290" x2="100" y2="304" stroke="#0a0a0a" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="100" y1="290" x2="100" y2="146" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="100" cy="146" r="6.5" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="100" cy="146" r="1.8" fill="#0a0a0a" />
      <line x1="100" y1="146" x2="156" y2="92" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="156" cy="92" r="6" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="156" cy="92" r="1.6" fill="#0a0a0a" />
      <path d="M156 92 L184 72 L156 36 L128 72 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="miter" />
      <line x1="148" y1="78" x2="164" y2="78" stroke="#0a0a0a" strokeWidth="1" />
      <line x1="100" y1="146" x2="92" y2="138" stroke="#0a0a0a" strokeWidth="0.8" />
      <line x1="100" y1="146" x2="108" y2="138" stroke="#0a0a0a" strokeWidth="1" />
    </svg>
  );
}

function LampTopSVG({ tone = 'oak' }: { tone?: LampTone }) {
  const baseFill = toneFill(tone);
  return (
    <svg viewBox="0 0 200 320" className="qm-lamp" aria-label="Desk lamp · top view (plan)">
      {/* centreline crosshair */}
      <line x1="20"  y1="200" x2="180" y2="200" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
      <line x1="100" y1="40"  x2="100" y2="320" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
      {/* circular base seen from above */}
      <circle cx="100" cy="200" r="60" fill={baseFill} stroke="#0a0a0a" strokeWidth="1.5" />
      {/* hatching on the base for texture */}
      <g stroke="#0a0a0a" strokeWidth="0.5" opacity="0.4">
        <line x1="55" y1="200" x2="145" y2="200" />
        <line x1="60" y1="180" x2="140" y2="180" />
        <line x1="60" y1="220" x2="140" y2="220" />
        <line x1="70" y1="160" x2="130" y2="160" />
        <line x1="70" y1="240" x2="130" y2="240" />
      </g>
      {/* stem cross-section in centre */}
      <circle cx="100" cy="200" r="6" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="100" cy="200" r="2" fill="#0a0a0a" />
      {/* arm projected from above (foreshortened) */}
      <line x1="100" y1="200" x2="158" y2="148" stroke="#0a0a0a" strokeWidth="2.5" />
      {/* upper joint */}
      <circle cx="158" cy="148" r="5" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      {/* shade head from above (rectangle / cone outline) */}
      <rect x="145" y="120" width="28" height="22" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="145" y1="131" x2="173" y2="131" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* small "N" arrow north */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="#0a0a0a">
        <line x1="174" y1="60" x2="174" y2="36" stroke="#0a0a0a" strokeWidth="1.5" />
        <path d="M170 40 L174 32 L178 40 Z" fill="#0a0a0a" />
        <text x="170" y="76">N</text>
      </g>
    </svg>
  );
}

function LampExplodedSVG({ tone = 'oak' }: { tone?: LampTone }) {
  const baseFill = toneFill(tone);
  const LBL = 124;  // x where leader lines end / labels begin
  return (
    <svg viewBox="0 0 320 480" className="qm-lamp" aria-label="Desk lamp · exploded view">
      {/* vertical assembly guideline */}
      <line x1="60" y1="0" x2="60" y2="480" stroke="#8a1c1c" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.6" />

      {/* 01 SHADE */}
      <path d="M32 56 L88 28 L88 -4 L32 24 Z" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="miter" />
      <line x1="36" y1="36" x2="60" y2="36" stroke="#0a0a0a" strokeWidth="1" />
      <line x1="92" y1="20" x2={LBL} y2="20" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="16" fill="#8a1c1c">01 · SHADE</text>
        <text x={LBL + 4} y="28" fill="#5e5544" fontWeight="500">LINEN ON WASHI</text>
      </g>

      {/* 02 UPPER JOINT */}
      <circle cx="60" cy="90" r="7" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="60" cy="90" r="2" fill="#0a0a0a" />
      <line x1="68" y1="90" x2={LBL} y2="90" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="86" fill="#8a1c1c">02 · JOINT</text>
        <text x={LBL + 4} y="98" fill="#5e5544" fontWeight="500">BRASS · POLISHED</text>
      </g>

      {/* 03 ARM */}
      <line x1="30" y1="160" x2="90" y2="130" stroke="#0a0a0a" strokeWidth="2.5" />
      <circle cx="30" cy="160" r="3" fill="#0a0a0a" />
      <circle cx="90" cy="130" r="3" fill="#0a0a0a" />
      <line x1="93" y1="130" x2={LBL} y2="130" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="128" fill="#8a1c1c">03 · ARM</text>
        <text x={LBL + 4} y="140" fill="#5e5544" fontWeight="500">SOLID BRASS · LACQUER</text>
      </g>

      {/* 04 LOWER JOINT */}
      <circle cx="60" cy="200" r="7" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <circle cx="60" cy="200" r="2" fill="#0a0a0a" />
      <line x1="68" y1="200" x2={LBL} y2="200" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="196" fill="#8a1c1c">04 · JOINT</text>
        <text x={LBL + 4} y="208" fill="#5e5544" fontWeight="500">BRASS · STEEL PIN</text>
      </g>

      {/* 05 STEM */}
      <rect x="56" y="240" width="8" height="100" fill="#ffffff" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="60" y1="240" x2="60" y2="340" stroke="#0a0a0a" strokeWidth="0.5" strokeDasharray="2 3" />
      <line x1="64" y1="290" x2={LBL} y2="290" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="288" fill="#8a1c1c">05 · STEM</text>
        <text x={LBL + 4} y="300" fill="#5e5544" fontWeight="500">DRAWN BRASS TUBE</text>
      </g>

      {/* 06 COUNTERWEIGHT */}
      <rect x="40" y="358" width="40" height="14" fill="#3a342a" stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="82" y1="365" x2={LBL} y2="365" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="363" fill="#8a1c1c">06 · WEIGHT</text>
        <text x={LBL + 4} y="375" fill="#5e5544" fontWeight="500">CAST IRON · 480 g</text>
      </g>

      {/* 07 BASE DISC */}
      <ellipse cx="60" cy="400" rx="50" ry="10" fill={baseFill} stroke="#0a0a0a" strokeWidth="1.5" />
      <line x1="10" y1="400" x2="110" y2="400" stroke="#0a0a0a" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
      <line x1="112" y1="400" x2={LBL} y2="400" stroke="#8a1c1c" strokeWidth="1" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="398" fill="#8a1c1c">07 · BASE</text>
        <text x={LBL + 4} y="410" fill="#5e5544" fontWeight="500">WHITE OAK · HARDWAX</text>
      </g>

      {/* 08 HARDWARE (tools shipped inside the base) */}
      <g transform="translate(30, 442)" stroke="#0a0a0a" strokeWidth="1.2" fill="none">
        {/* hex key */}
        <path d="M0 4 L18 4 L22 0 L18 -4 L0 -4 Z" fill="#3a342a" />
        {/* polish cloth — small folded rect */}
        <rect x="28" y="-3" width="14" height="10" fill="#ffffff" />
        <line x1="28" y1="0" x2="42" y2="0" />
        {/* spare bulb circle */}
        <circle cx="52" cy="1" r="4" fill="#ffffff" />
      </g>
      <line x1="86" y1="443" x2={LBL} y2="443" stroke="#8a1c1c" strokeWidth="1" strokeDasharray="3 2" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700">
        <text x={LBL + 4} y="441" fill="#8a1c1c">08 · TOOLKIT</text>
        <text x={LBL + 4} y="453" fill="#5e5544" fontWeight="500">HEX · CLOTH · BULB ×2</text>
      </g>
    </svg>
  );
}

function LampDrawing({ view = 'front', tone = 'oak' }: { view?: LampView; tone?: LampTone }) {
  if (view === 'top') return <LampTopSVG tone={tone} />;
  if (view === 'exploded') return <LampExplodedSVG tone={tone} />;
  return <LampFrontSVG tone={tone} />;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

function buildCursorElement() {
  const cursor = document.createElement('div');
  cursor.className = 'qm-cursor';

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.setAttribute('width', '40');
  svg.setAttribute('height', '40');
  svg.setAttribute('aria-hidden', 'true');

  const ring = document.createElementNS(SVG_NS, 'circle');
  ring.setAttribute('cx', '20'); ring.setAttribute('cy', '20'); ring.setAttribute('r', '14');
  ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', 'currentColor'); ring.setAttribute('stroke-width', '1.2');
  svg.appendChild(ring);

  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', '20'); dot.setAttribute('cy', '20'); dot.setAttribute('r', '1.6'); dot.setAttribute('fill', 'currentColor');
  svg.appendChild(dot);

  const ticks: Array<[number, number, number, number]> = [
    [0, 20, 6, 20], [34, 20, 40, 20], [20, 0, 20, 6], [20, 34, 20, 40],
  ];
  ticks.forEach(([x1, y1, x2, y2]) => {
    const ln = document.createElementNS(SVG_NS, 'line');
    ln.setAttribute('x1', String(x1)); ln.setAttribute('y1', String(y1));
    ln.setAttribute('x2', String(x2)); ln.setAttribute('y2', String(y2));
    ln.setAttribute('stroke', 'currentColor'); ln.setAttribute('stroke-width', '1.2');
    svg.appendChild(ln);
  });

  cursor.appendChild(svg);

  const label = document.createElement('span');
  label.className = 'qm-cursor__label';
  cursor.appendChild(label);

  return { cursor, label };
}

export function PortedFusionQuietManifestoPage({ lang }: PortedStylePageProps) {
  const lng = lang as Locale;
  const [view, setView] = useState<LampView>('front');
  const sheetRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const manualLockRef = useRef(false);

  // Scroll-driven view morphing within the tall hero. Updates view based on
  // which beat is closest to viewport centre. Once the user clicks a view
  // toggle, manualLockRef freezes further auto-changes.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const beats = hero.querySelectorAll<HTMLElement>('.qm-hero__beat');
    if (!beats.length) return;

    // The actual scroll container is the .ported-style-page wrapper
    // (overflow-y: auto). Walk up to find it.
    let scroller: HTMLElement | Window = window;
    let p: HTMLElement | null = hero;
    while (p) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll)/.test(cs.overflowY)) { scroller = p; break; }
      p = p.parentElement;
    }

    let rafId = 0;
    const compute = () => {
      rafId = 0;
      if (manualLockRef.current) return;
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) return;
      const centreY = window.innerHeight / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      beats.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const beatCentre = r.top + r.height / 2;
        const d = Math.abs(beatCentre - centreY);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      const nextView = beats[bestIdx].dataset.beat as LampView | undefined;
      if (nextView && nextView !== view) setView(nextView);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(compute);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    compute();
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [view]);

  // Keyboard shortcuts: 1/2/3 cycle through views. Locks auto-progression once used.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, LampView> = { '1': 'front', '2': 'top', '3': 'exploded' };
      const v = map[e.key];
      if (!v) return;
      manualLockRef.current = true;
      setView(v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Scroll-reveal: fade + slide-up sections as they enter the viewport.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const targets = sheet.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((t) => t.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [lng]);

  // Custom crosshair cursor. Activates only when hovering the sheet; respects coarse pointers.
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const sheet = sheetRef.current;
    if (!sheet) return;

    const { cursor, label } = buildCursorElement();
    document.body.appendChild(cursor);

    let mx = 0, my = 0, rafId = 0;
    const apply = () => {
      cursor.style.transform = `translate3d(${mx - 20}px, ${my - 20}px, 0)`;
      rafId = 0;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(apply);
    };

    let active = false;
    const onEnter = () => { active = true; cursor.classList.add('is-active'); };
    const onLeave = () => { active = false; cursor.classList.remove('is-active'); };

    const onOver = (e: Event) => {
      if (!active) return;
      const t = e.target as HTMLElement;
      const ring = t.closest('.qm-detail__ring, .qm-lamp');
      const cta  = t.closest('.qm-cta, .qm-nav__cart, .qm-nav__list a, .qm-views button, .qm-bom__table tbody tr, .qm-variant, .qm-spec, .qm-note');
      if (ring) {
        cursor.classList.add('is-zoom');
        cursor.classList.remove('is-target');
        label.textContent = '5 ×';
      } else if (cta) {
        cursor.classList.add('is-target');
        cursor.classList.remove('is-zoom');
        label.textContent = '+';
      } else {
        cursor.classList.remove('is-target', 'is-zoom');
        label.textContent = '';
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    sheet.addEventListener('mouseenter', onEnter);
    sheet.addEventListener('mouseleave', onLeave);
    sheet.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      sheet.removeEventListener('mouseenter', onEnter);
      sheet.removeEventListener('mouseleave', onLeave);
      sheet.removeEventListener('mouseover', onOver);
      if (rafId) cancelAnimationFrame(rafId);
      cursor.remove();
    };
  }, []);

  return (
    <FusionShell
      fusionId="fusion-quiet-manifesto"
      lang={lang}
      prev={{ href: '/pages/fusion-strict-console.html', label: 'Strict Console' }}
      next={{ href: '/pages/fusion-neon-swiss.html', label: 'Neon × Swiss' }}
      prompts={{ en: promptEn, ko: promptKo, ja: promptJa }}
    >
      <div className="qm-sheet" ref={sheetRef} role="article" aria-label="WS / PRACTICE — Manifesto 01 Desk Lamp" data-view={view}>

        {/* corner registration crosshairs */}
        <span className="qm-cross qm-cross--tl" aria-hidden="true" />
        <span className="qm-cross qm-cross--tr" aria-hidden="true" />
        <span className="qm-cross qm-cross--bl" aria-hidden="true" />
        <span className="qm-cross qm-cross--br" aria-hidden="true" />

        {/* coordinate ruler */}
        <ol className="qm-ruler qm-ruler--top" aria-hidden="true">
          {GRID_X.map((c) => <li key={c}>{c}</li>)}
        </ol>
        <ol className="qm-ruler qm-ruler--right" aria-hidden="true">
          {GRID_Y.map((c) => <li key={c}>{c}</li>)}
        </ol>

        {/* TOP NAV */}
        <nav className="qm-nav" aria-label="Primary">
          <a className="qm-nav__brand" href="#top">
            <strong>{COPY.brand}</strong>
            <em>{L(COPY.brandSub, lng)}</em>
          </a>
          <ul className="qm-nav__list">
            {NAV.map((n, i) => (
              <li key={i}><a href="#">{L(n, lng)}</a></li>
            ))}
          </ul>
          <div className="qm-nav__end">
            <a className="qm-nav__cart" href="#cart">{L(COPY.cart, lng)}</a>
          </div>
        </nav>

        {/* strip header */}
        <header className="qm-strip">
          <span className="qm-strip__cell qm-strip__cell--drno">{COPY.drNo}</span>
          <span className="qm-strip__cell qm-strip__cell--status">
            <span className="qm-strip__dot" aria-hidden="true" />
            {L(COPY.status, lng)}
          </span>
          <span className="qm-strip__cell qm-strip__cell--rev">{L(COPY.rev, lng)}</span>
        </header>

        {/* HERO — tall, scroll-driven product showcase */}
        <section className="qm-hero" id="top" ref={heroRef}>
          <div className="qm-hero__viz">
            <div className="qm-views" role="tablist" aria-label="Lamp view">
              {COPY.views.map((v, i) => {
                const idx = ['A', 'B', 'C'][i];
                const key = ['1', '2', '3'][i];
                const active = view === v.id;
                return (
                  <button
                    key={v.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-keyshortcuts={key}
                    title={`Press ${key}`}
                    className={`qm-views__btn ${active ? 'is-active' : ''}`}
                    onClick={() => { manualLockRef.current = true; setView(v.id as LampView); }}
                  >
                    <span className="qm-views__idx">{idx}</span>
                    <span>{L(v.label, lng)}</span>
                    <kbd className="qm-views__kbd" aria-hidden="true">{key}</kbd>
                  </button>
                );
              })}
            </div>
            <div className="qm-hero__lamp" data-view={view}>
              <LampDrawing view={view} tone="oak" />
              {view === 'front' && (
                <>
                  <div className="qm-hero__dim qm-hero__dim--w">
                    <span className="qm-hero__dim-cap qm-hero__dim-cap--l" aria-hidden="true" />
                    <span className="qm-hero__dim-line" aria-hidden="true" />
                    <span className="qm-hero__dim-val">220</span>
                    <span className="qm-hero__dim-line" aria-hidden="true" />
                    <span className="qm-hero__dim-cap qm-hero__dim-cap--r" aria-hidden="true" />
                  </div>
                  <div className="qm-hero__dim qm-hero__dim--h">
                    <span className="qm-hero__dim-cap qm-hero__dim-cap--t" aria-hidden="true" />
                    <span className="qm-hero__dim-line qm-hero__dim-line--v" aria-hidden="true" />
                    <span className="qm-hero__dim-val qm-hero__dim-val--v">540</span>
                    <span className="qm-hero__dim-line qm-hero__dim-line--v" aria-hidden="true" />
                    <span className="qm-hero__dim-cap qm-hero__dim-cap--b" aria-hidden="true" />
                  </div>
                  <div className="qm-hero__dim qm-hero__dim--reach">
                    <span className="qm-hero__dim-cap qm-hero__dim-cap--l" aria-hidden="true" />
                    <span className="qm-hero__dim-line" aria-hidden="true" />
                    <span className="qm-hero__dim-val">480</span>
                    <span className="qm-hero__dim-line" aria-hidden="true" />
                    <span className="qm-hero__dim-cap qm-hero__dim-cap--r" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
            <div className="qm-hero__viewmeta">
              <span className="qm-hero__viewmeta-k">CURRENT VIEW</span>
              <strong className="qm-hero__viewmeta-v">{L(COPY.views.find((v) => v.id === view)!.label, lng)}</strong>
            </div>
          </div>

          <div className="qm-hero__info">
            {/* BEAT 1 — product info (FRONT) */}
            <div className="qm-hero__beat" data-beat="front">
              <span className="qm-hero__kicker">{L(COPY.sheetTag, lng)} · {L(COPY.productCode, lng)}</span>
              <h1 className="qm-hero__title">
                <span>{COPY.title[lng].line1}</span>
                <span>{COPY.title[lng].line2}</span>
              </h1>
              <p className="qm-hero__sub">{L(COPY.productKind, lng)}</p>

              <dl className="qm-hero__price">
                <dt>{L(COPY.priceLabel, lng)}</dt>
                <dd>
                  <strong>{COPY.price}</strong>
                  <em>{COPY.priceUsd}</em>
                </dd>
                <dd className="qm-hero__vat">{L(COPY.vat, lng)}</dd>
              </dl>

              <div className="qm-hero__cta">
                <a className="qm-cta qm-cta--primary" href="#order">{L(COPY.cta, lng)}</a>
                <a className="qm-cta qm-cta--secondary" href="#notes">{L(COPY.cta2, lng)}</a>
              </div>

              <div className="qm-hero__hint" aria-hidden="true">
                <span>{L(COPY.scrollHint, lng)}</span>
                <span className="qm-hero__hint-line" />
                <svg viewBox="0 0 12 24" width="12" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="6" y1="0" x2="6" y2="22" />
                  <polyline points="2 18 6 22 10 18" />
                </svg>
              </div>
            </div>

            {/* BEAT 2 — TOP / footprint narrative */}
            <div className="qm-hero__beat" data-beat="top">
              <span className="qm-hero__beat-tag">{L(COPY.beats.top.tag, lng)}</span>
              <h2 className="qm-hero__beat-head">{L(COPY.beats.top.head, lng)}</h2>
              <p className="qm-hero__beat-body">{L(COPY.beats.top.body, lng)}</p>
              <ul className="qm-hero__beat-annot">
                {COPY.beats.top.annot.map((a, i) => (
                  <li key={i}>
                    <span>{L(a.k, lng)}</span>
                    <strong>{a.v}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* BEAT 3 — EXPLODED / anatomy narrative */}
            <div className="qm-hero__beat" data-beat="exploded">
              <span className="qm-hero__beat-tag">{L(COPY.beats.exploded.tag, lng)}</span>
              <h2 className="qm-hero__beat-head">{L(COPY.beats.exploded.head, lng)}</h2>
              <p className="qm-hero__beat-body">{withItalics(L(COPY.beats.exploded.body, lng))}</p>
              <ul className="qm-hero__beat-annot">
                {COPY.beats.exploded.annot.map((a, i) => (
                  <li key={i}>
                    <span>{L(a.k, lng)}</span>
                    <strong>{a.v}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION A — SPECIFICATIONS */}
        <DimSeparator label={L(COPY.dimSectionA, lng)} />
        <section className="qm-specs" data-reveal>
          <p className="qm-specs__intro">{L(COPY.specsIntro, lng)}</p>
          <ul className="qm-specs__grid">
            {SPECS.map((s, i) => (
              <li key={i} className="qm-spec">
                <span className="qm-spec__k">{L(s.k, lng)}</span>
                <strong className="qm-spec__v">{s.v}</strong>
                <em className="qm-spec__s">{L(s.sub, lng)}</em>
              </li>
            ))}
          </ul>
        </section>

        {/* SECTION B — DESIGN PRINCIPLES */}
        <DimSeparator label={L(COPY.dimSectionB, lng)} />
        <section className="qm-notes" data-reveal>
          <ol className="qm-notes__list">
            {PRINCIPLES.map((n) => (
              <li key={n.n} className="qm-note">
                <span className="qm-note__num">NOTE {n.n}</span>
                <h3 className="qm-note__head">{L(n.head, lng)}</h3>
                <p className="qm-note__body">{L(n.body, lng)}</p>
              </li>
            ))}
          </ol>
          <aside className="qm-stamp" aria-hidden="true">
            <span>{L(COPY.stamp, lng)}</span>
          </aside>
        </section>

        {/* SECTION C — BILL OF MATERIALS */}
        <DimSeparator label={L(COPY.dimSectionC, lng)} />
        <section className="qm-bom" data-reveal>
          <p className="qm-bom__sub">{L(COPY.bomSub, lng)}</p>
          <table className="qm-bom__table">
            <thead>
              <tr>
                {COPY.bomCols.map((c, i) => (
                  <th key={i} scope="col">{L(c, lng)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOM.map((row) => (
                <tr key={row.item}>
                  <td className="qm-bom__item">{row.item}</td>
                  <td className="qm-bom__pn">{row.pn}</td>
                  <td className="qm-bom__desc">{L(row.desc, lng)}</td>
                  <td className="qm-bom__mat">{L(row.mat, lng)}</td>
                  <td className="qm-bom__fin">{L(row.finish, lng)}</td>
                  <td className="qm-bom__org">{L(row.origin, lng)}</td>
                  <td className="qm-bom__qty">{row.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="qm-bom__tol">{L(COPY.bomTol, lng)}</p>
        </section>

        {/* SECTION D — DETAIL (A) */}
        <DimSeparator label={L(COPY.dimSectionD, lng)} />
        <section className="qm-detail" data-reveal>
          <figure className="qm-detail__fig">
            <span className="qm-detail__ring" aria-hidden="true"><span>A</span></span>
            <span className="qm-detail__scale" aria-hidden="true">{L(COPY.detailScale, lng)}</span>
            <div className="qm-detail__body">
              <p className="qm-detail__copy">{withItalics(L(COPY.detailBody, lng))}</p>
              <blockquote className="qm-detail__quote">
                <p>{L(COPY.detailQuote, lng)}</p>
                <figcaption>{L(COPY.detailQuoteBy, lng)}</figcaption>
              </blockquote>
            </div>
          </figure>
        </section>

        {/* SECTION E — VARIANTS & ORDER */}
        <DimSeparator label={L(COPY.dimSectionE, lng)} />
        <section className="qm-variants" id="order" data-reveal>
          <p className="qm-variants__intro">{withItalics(L(COPY.variantsIntro, lng))}</p>
          <div className="qm-variants__row">
            {VARIANTS.map((v) => {
              const waitlisted = v.code === 'EBO';
              return (
                <article key={v.code} className="qm-variant">
                  <div className={`qm-variant__viz qm-variant__viz--${v.code.toLowerCase()}`}>
                    <LampDrawing tone={v.code === 'WAL' ? 'walnut' : v.code === 'EBO' ? 'ebonised' : 'oak'} />
                  </div>
                  <div className="qm-variant__meta">
                    <span className="qm-variant__pn">{v.pn}</span>
                    <h3 className="qm-variant__name">{L(v.name, lng)}</h3>
                    <p className="qm-variant__sub">{L(v.sub, lng)}</p>
                  </div>
                  <div className="qm-variant__price">
                    <strong>{v.price}</strong>
                    <em>{v.priceUsd}</em>
                  </div>
                  <div className="qm-variant__stock">{L(v.inStock, lng)}</div>
                  <a className="qm-cta qm-cta--primary" href="#cart">
                    {waitlisted ? L(COPY.variantNotify, lng) : L(COPY.variantBuy, lng)}
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION F — STUDIO + NEWSLETTER */}
        <DimSeparator label={L(COPY.dimSectionF, lng)} />
        <section className="qm-studio" data-reveal>
          <div className="qm-studio__bio">
            <h2>{L(COPY.studioHead, lng)}</h2>
            <p>{withItalics(L(COPY.studioBody, lng))}</p>
          </div>
          <form className="qm-studio__news" onSubmit={(e) => e.preventDefault()} aria-label="Paper correspondence sign-up">
            <h3>{L(COPY.newsletterHead, lng)}</h3>
            <p>{withItalics(L(COPY.newsletterBody, lng))}</p>
            <div className="qm-studio__field">
              <input type="text" placeholder={L(COPY.newsletterPlaceholder, lng)} aria-label={L(COPY.newsletterPlaceholder, lng)} />
              <button type="submit" className="qm-cta qm-cta--primary">{L(COPY.newsletterCta, lng)}</button>
            </div>
          </form>
        </section>

        {/* TITLE BLOCK */}
        <section className="qm-tb" data-reveal>
          <div className="qm-tb__grid">
            {COPY.tbCells.map((c, i) => (
              <div key={i} className={`qm-tb__cell qm-tb__cell--${i}`}>
                <span className="qm-tb__k">{L(c.k, lng)}</span>
                <strong className="qm-tb__v">{c.v}</strong>
                <em className="qm-tb__s">{L(c.sub, lng)}</em>
              </div>
            ))}
          </div>
        </section>

        {/* footer notes */}
        <footer className="qm-foot">
          <ol className="qm-foot__notes">
            {COPY.footNotes.map((n, i) => (
              <li key={i}>{L(n, lng)}</li>
            ))}
          </ol>
          <span className="qm-foot__colophon">{L(COPY.colophon, lng)}</span>
        </footer>
      </div>
    </FusionShell>
  );
}
