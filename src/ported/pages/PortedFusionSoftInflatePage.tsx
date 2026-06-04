import { useEffect, useRef, useState } from 'react';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';

type Lang = 'en' | 'ko' | 'ja';
const L = <T extends Record<Lang, string>>(obj: T, lang: Lang): string => obj[lang];
type LocStr = { en: string; ko: string; ja: string };

// ============================================================
// CONCEPT — Soft Inflate v9 · Soft + Sky
// ----------------------------------------------------------------
// Pure white reading surface. Real Unsplash photographs of soft
// inflated forms (balloons, fabric, sky) presented in neumorphically
// framed cards. Sky-blue accent on key moments. The page is a calm
// portfolio of soft things — no fake illustration, no Greek vocab,
// no warm/yellow tint, no origami rigidity.
// ============================================================

// Curated Unsplash photographs. The CDN URLs are stable; we serve a
// reasonable size + auto-format for the card sizes shown.
const IMG = {
  // White balloon floating in blue sky — by insung yoon (gUhMocUj1ow)
  balloon: {
    src: 'https://images.unsplash.com/photo-1712574340322-aaeae2cbaa8f?w=1600&q=82&auto=format&fit=crop',
    alt: { en: 'A single white balloon floating in a clear blue sky', ko: '맑은 푸른 하늘에 떠 있는 하얀 풍선 하나', ja: '澄んだ青空に浮かぶひとつの白い風船' } as LocStr,
    credit: { name: 'insung yoon', url: 'https://unsplash.com/photos/a-white-balloon-floating-in-a-blue-sky-gUhMocUj1ow' },
  },
  // Hot air balloons in pastel sky — by mana5280 (CGFKv3LCiic)
  pastelSky: {
    src: 'https://images.unsplash.com/photo-1750304460623-9dd87aa90658?w=1200&q=82&auto=format&fit=crop',
    alt: { en: 'Hot air balloons rising through a pastel-coloured sky', ko: '파스텔 톤의 하늘로 떠오르는 열기구들', ja: 'パステル調の空へ昇る熱気球' } as LocStr,
    credit: { name: 'mana5280', url: 'https://unsplash.com/photos/hot-air-balloons-are-soaring-in-a-pastel-sky-CGFKv3LCiic' },
  },
  // Soft white fluffy fabric — by breee luise (hL8F2s31BdE)
  fluffy: {
    src: 'https://images.unsplash.com/photo-1743142883555-b0beac669a51?w=1200&q=82&auto=format&fit=crop',
    alt: { en: 'White soft fluffy fabric with subtle folds and shadow', ko: '은은한 주름과 그림자가 진 부드럽고 폭신한 흰 천', ja: 'やわらかな襞と影を持つ柔らかい白い布' } as LocStr,
    credit: { name: 'breee luise', url: 'https://unsplash.com/photos/white-soft-and-fluffy-fabric-hL8F2s31BdE' },
  },
  // Soft white fabric with rainbow light reflection — by Yoko Saito (pykFL3LlmGY)
  rainbow: {
    src: 'https://images.unsplash.com/photo-1776472603139-909c099affd3?w=1200&q=82&auto=format&fit=crop',
    alt: { en: 'Soft white fabric catching a subtle rainbow of light', ko: '은은한 무지개 빛을 머금은 부드러운 흰 천', ja: 'やわらかな虹色の光をまとう柔らかい白い布' } as LocStr,
    credit: { name: 'Yoko Saito', url: 'https://unsplash.com/photos/soft-white-fabric-with-subtle-rainbow-light-reflection-pykFL3LlmGY' },
  },
};

const COPY = {
  brand: {
    en: 'Web Stylebook · *Fusion XVI* · MMXXVI',
    ko: 'Web Stylebook · *퓨전 XVI* · MMXXVI',
    ja: 'Web Stylebook · *フュージョン XVI* · MMXXVI',
  } as LocStr,
  heroTitle: { en: 'Soft', ko: 'Soft', ja: 'Soft' } as LocStr,
  heroTitle2: { en: 'Inflate', ko: 'Inflate', ja: 'Inflate' } as LocStr,
  heroSub: {
    en: 'A fusion of neumorphism and editorial silence, presented as a small *portfolio of soft things* — a balloon, a held breath, fabric catching light.',
    ko: '뉴모피즘과 에디토리얼 사일런스를 합쳐, *부드러운 사물의 작은 포트폴리오*로 펼쳤습니다 — 풍선 하나, 멈춘 한 호흡, 빛을 머금은 천.',
    ja: 'ニューモーフィズムとエディトリアル・サイレンスを掛け合わせ、*やわらかなものの小さなポートフォリオ*として並べた ― ひとつの風船、止めた一呼吸、光をまとった布。',
  } as LocStr,
  heroCaptionKey: { en: 'PLATE I', ko: 'PLATE I', ja: 'PLATE I' } as LocStr,
  heroCaptionVal: { en: '*Balloon* · 2024', ko: '*풍선* · 2024', ja: '*風船* · 2024' } as LocStr,
  metaA: { en: 'CHAPTER', ko: '챕터', ja: '章' } as LocStr,
  metaAVal: { en: 'XVI', ko: 'XVI', ja: 'XVI' } as LocStr,
  metaB: { en: 'BASED ON', ko: '기반', ja: '基づく' } as LocStr,
  metaBVal: { en: 'Neumorphism · Editorial Silence', ko: '뉴모피즘 · 에디토리얼 사일런스', ja: 'ニューモーフィズム · エディトリアル・サイレンス' } as LocStr,
  metaC: { en: 'PUBLISHED', ko: '발행', ja: '発行' } as LocStr,
  metaCVal: { en: '2026 · V · XVI', ko: '2026 · V · XVI', ja: '2026 · V · XVI' } as LocStr,

  // MANIFESTO
  manEye: { en: 'A note from the style', ko: '스타일이 남기는 메모', ja: 'スタイルからの覚書' } as LocStr,
  manH: {
    en: 'Depth, but *quietly*. The page holds one breath every eight seconds and lets the rest sit.',
    ko: '*조용히*, 깊이. 8초마다 한 번 숨을 멈춰 머금고, 나머지는 그대로 둡니다.',
    ja: '*静かに*、深さを。ページは八秒に一度だけ息を止め、あとはそのままにしておく。',
  } as LocStr,
  manP1: {
    en: 'Most neumorphism is a pastel card with a toggle in the middle — a single soft button pretending the whole page wakes up around it. Soft Inflate is the opposite case: a **calm white reading surface** that hosts a handful of soft photographs and lets the light in them do the work.',
    ko: '대부분의 뉴모피즘은 가운데에 토글 하나 박힌 파스텔 카드입니다 — *부드러운 버튼 하나*가 페이지 전체를 깨우는 척하죠. Soft Inflate은 그 반대입니다: **차분한 흰 읽기 면**이 부드러운 사진 몇 장을 품고, 그 안의 빛에 일을 맡깁니다.',
    ja: 'たいていのニューモーフィズムは、真ん中にトグルが一つ付いたパステルのカードだ ― *柔らかなボタン一つ*が、ページ全体を目覚めさせているふりをする。Soft Inflate はその逆をいく。**穏やかな白い読み面**が数枚の柔らかな写真を抱え、その中の光に働いてもらう。',
  } as LocStr,
  manP2: {
    en: 'No drawn illustration. No fake folds. The depth is real — it comes from photographs of objects that **already hold air**: a balloon mid-rise, fabric mid-flutter, sky mid-thought. The page does not invent the softness; it borrows it.',
    ko: '그려낸 일러스트도, 가짜 접힘도 없습니다. 깊이는 진짜입니다 — **이미 공기를 품은** 사물의 사진에서 나옵니다: *떠오르는* 풍선, *흩날리는* 천, *생각에 잠긴* 하늘. 부드러움을 *지어내는 게 아니라*, *빌려옵니다*.',
    ja: '描いたイラストはない。偽の折り目もない。深さは本物だ ― **すでに空気を含んだ**ものの写真から生まれる。*昇りかけの*風船、*翻りかけの*布、*もの思いにふける*空。ページは柔らかさを*でっち上げる*のではなく、*借りてくる*。',
  } as LocStr,
  manP3: {
    en: 'Sky blue, the page\'s one accent, appears at four places only — the title period, the manifesto bracket, the live breath value, and the row marked NEVER FOR. Everywhere else, the page is content to stay quiet.',
    ko: '페이지의 단 하나뿐인 포인트 색, 하늘색은 *오직 네 곳*에만 나타납니다 — 타이틀 끝점, 매니페스토 괄호, 실시간 호흡 수치, 그리고 NEVER FOR 행. 나머지 곳에서는 *조용히 머무는 데 만족합니다*.',
    ja: 'ページ唯一のアクセントである空色が現れるのは、*四か所だけ*だ ― タイトル末尾の点、マニフェストの括弧、リアルタイムの呼吸の数値、そして NEVER FOR の行。それ以外では、ページは*ただ静かにしている*。',
  } as LocStr,

  // PRINCIPLES (new section)
  prinLabel: {
    en: '*Three* rules of the room',
    ko: '방의 *세* 가지 규칙',
    ja: 'この部屋の*三つ*のルール',
  } as LocStr,
  prin1Num: { en: 'PRINCIPLE *I*', ko: 'PRINCIPLE *I*', ja: 'PRINCIPLE *I*' } as LocStr,
  prin1H: { en: 'One *material*', ko: '하나의 *재질*', ja: 'ひとつの*素材*' } as LocStr,
  prin1B: {
    en: 'A page is one material — white paper, white air, white surface. Whatever depth there is comes from **shadow alone**, never from a second colour and never from a line that wasn\'t earned.',
    ko: '페이지는 하나의 재질입니다 — 흰 종이, 흰 공기, 흰 면. 깊이는 모두 **그림자에서만** 나옵니다. 두 번째 색도, *제 몫을 못한 선*도 쓰지 않습니다.',
    ja: 'ページは一つの素材だ ― 白い紙、白い空気、白い面。深さがあるとすれば、それは**影だけ**から生まれる。二つめの色からでもなく、*理由のない線*からでもない。',
  } as LocStr,
  prin1Detail: { en: 'No second colour', ko: '두 번째 색 없음', ja: '第二の色なし' } as LocStr,
  prin1DetailVal: { en: '#FFF only', ko: '#FFF 만', ja: '#FFF のみ' } as LocStr,

  prin2Num: { en: 'PRINCIPLE *II*', ko: 'PRINCIPLE *II*', ja: 'PRINCIPLE *II*' } as LocStr,
  prin2H: { en: 'Light is the *ornament*', ko: '빛이 *장식*', ja: '光が*装飾*' } as LocStr,
  prin2B: {
    en: 'The only thing that moves across this page is the angle of light on a few soft objects. Move your cursor and the photographs **answer**; sit still and the page keeps breathing at its own slow eight-second pace.',
    ko: '이 페이지에서 움직이는 건 부드러운 사물 몇 개에 닿는 *빛의 각도*뿐입니다. 커서를 움직이면 사진이 **응답하고**, 가만히 두면 *느린 8초 박자*로 조용히 호흡합니다.',
    ja: 'このページで動くのは、いくつかの柔らかなものに当たる*光の角度*だけだ。カーソルを動かせば写真が**応える**。じっとしていれば、ページは*ゆっくりとした八秒のリズム*で静かに呼吸を続ける。',
  } as LocStr,
  prin2Detail: { en: 'Cursor + breath', ko: '커서 + 호흡', ja: 'カーソル + 呼吸' } as LocStr,
  prin2DetailVal: { en: '2 signals', ko: '2 신호', ja: '2 信号' } as LocStr,

  prin3Num: { en: 'PRINCIPLE *III*', ko: 'PRINCIPLE *III*', ja: 'PRINCIPLE *III*' } as LocStr,
  prin3H: { en: '*Sky* blue, four times', ko: '*하늘색*, 네 번', ja: '*空色*、四度' } as LocStr,
  prin3B: {
    en: 'One accent, used exactly four times on the whole page. **Never as wallpaper**, never as a background fill — only as a single character, a single word, a single value, a single label that earned its weight.',
    ko: '포인트 색 하나를 페이지 전체에서 *정확히 네 번*만 씁니다. **벽지처럼 깔지 않고**, 배경을 채우지도 않습니다 — 오직 *제 무게를 입증한* 글자 하나, 단어 하나, 값 하나, 라벨 하나로만.',
    ja: 'たった一つのアクセントを、ページ全体で*ちょうど四度*だけ使う。**壁紙のように敷きつめない**し、背景を塗りつぶしもしない ― *その重みにふさわしい*ひと文字、ひと語、一つの値、一つのラベルとしてだけ。',
  } as LocStr,
  prin3Detail: { en: 'Sky 3 → 6', ko: 'Sky 3 → 6', ja: 'Sky 3 → 6' } as LocStr,
  prin3DetailVal: { en: '#7DD3FC · #0EA5E9', ko: '#7DD3FC · #0EA5E9', ja: '#7DD3FC · #0EA5E9' } as LocStr,

  // VARIATIONS
  varLabel: {
    en: '*Three* soft forms',
    ko: '*세* 가지 부드러운 형',
    ja: '*三つ*のやわらかな形',
  } as LocStr,
  var1Num: { en: 'PLATE II', ko: 'PLATE II', ja: 'PLATE II' } as LocStr,
  var1Name: { en: 'Pastel sky', ko: '파스텔 하늘', ja: 'パステルの空' } as LocStr,
  var1Body: {
    en: 'Several inflated forms held in the same warm light. Useful as a hero where the **whole field is the subject**, not a single object.',
    ko: '같은 따뜻한 빛 속에 놓인 여러 부푼 형상. 한 사물이 아니라 **화면 전체가 주제**일 때, 그런 히어로에 잘 맞습니다.',
    ja: '同じ温かな光の中に並ぶ、いくつもの膨らんだかたち。ひとつの物ではなく**画面全体が主題**になるとき ― *場面*そのものを見せたいヒーローに向く。',
  } as LocStr,
  var2Num: { en: 'PLATE III', ko: 'PLATE III', ja: 'PLATE III' } as LocStr,
  var2Name: { en: 'Fluffy fabric', ko: '폭신한 천', ja: '柔らかい布' } as LocStr,
  var2Body: {
    en: 'White fabric folded onto itself in soft shadow. The closest analog to a **neumorphic surface in reality** — a real material with the same depth language.',
    ko: '부드러운 그림자 속에서 제 몸 위로 접힌 흰 천. 현실에서 만나는 **뉴모피즘 면에 가장 가까운 모습** — 같은 *깊이 언어*를 쓰는 실재 재질입니다.',
    ja: '柔らかな影の中で、自らの上に折り重なった白い布。**現実のなかのニューモーフィズム面**にいちばん近い ― 同じ*深さの言葉*を持つ、実在する素材だ。',
  } as LocStr,
  var3Num: { en: 'PLATE IV', ko: 'PLATE IV', ja: 'PLATE IV' } as LocStr,
  var3Name: { en: 'Rainbow light', ko: '무지개 빛', ja: '虹色の光' } as LocStr,
  var3Body: {
    en: 'Soft white fabric catching a sliver of refracted light. A reminder that **even monochrome surfaces hold colour** when the light is right.',
    ko: '굴절된 빛 한 줄기를 머금은 부드러운 흰 천. 빛만 알맞게 들면 **단색 면도 색을 품는다**는 작은 증거입니다.',
    ja: '屈折した光の一筋をとらえた、柔らかい白い布。光さえうまく当たれば**モノクロームの面にも色は宿る** ― そのことを示す小さな証拠だ。',
  } as LocStr,

  // BREATH BAR
  breathH: {
    en: 'The page holds a *single* breath every eight seconds',
    ko: '페이지는 8초마다 *한 번* 숨을 멈춰 머금습니다',
    ja: 'ページは八秒ごとに*ひと*呼吸だけ、そっと息を止める',
  } as LocStr,
  breathRA: { en: 'Cycle', ko: '주기', ja: '周期' } as LocStr,
  breathRAVal: { en: '8.0 s', ko: '8.0초', ja: '8.0秒' } as LocStr,
  breathRB: { en: 'Current', ko: '현재', ja: '現在' } as LocStr,
  breathRC: { en: 'Hue', ko: '톤', ja: 'トーン' } as LocStr,
  breathRCVal: { en: 'Sky 5', ko: 'Sky 5', ja: 'Sky 5' } as LocStr,

  // USES
  usesH: {
    en: 'Where *Soft Inflate* belongs.',
    ko: '*Soft Inflate* 이 어울리는 곳.',
    ja: '*Soft Inflate* がふさわしい場所。',
  } as LocStr,
  use1When: { en: 'Studio launches', ko: '스튜디오 런칭', ja: 'スタジオの始動' } as LocStr,
  use1What: {
    en: 'For studios whose first page should read as **a single careful object** rather than a homepage. A small white catalogue handed across a desk — the page that arrives when the studio wants the visitor to slow down, not click through.',
    ko: '첫 페이지가 홈페이지가 아니라 **공들여 다듬은 한 사물**처럼 읽혀야 하는 스튜디오를 위해. 책상 너머로 건네는 *작은 흰 카탈로그* — 방문자가 *클릭하지 말고 잠시 멈추기를* 바라는 스튜디오의 페이지입니다.',
    ja: '最初のページを、ホームページではなく**丁寧に仕上げたひとつの作品**として読ませたいスタジオへ。机越しにそっと手渡される*小さな白いカタログ* ― 訪問者に、クリックして進むのではなく*しばし立ち止まってほしい*スタジオのためのページだ。',
  } as LocStr,
  use2When: { en: 'Quiet products', ko: '조용한 제품', ja: '静かなプロダクト' } as LocStr,
  use2What: {
    en: 'Stationery, perfume, ceramic studios, slow-paced wellness — products that **arrive in a small box**, often with tissue paper and a hand-written tag. The page should match the box: white, unhurried, with one quiet detail worth noticing.',
    ko: '문구, 향수, 도예, 느린 웰니스 — **작은 상자에 담겨 도착하는** 제품. 보통 *티슈 페이퍼와 손글씨 태그*가 함께 들었죠. 페이지도 그 상자와 결을 맞춰야 합니다: *희고, 서두르지 않고, 눈길을 끄는 조용한 디테일 하나*.',
    ja: '文具、香水、陶芸、ゆっくりとしたウェルネス ― **小さな箱に入って届く**プロダクト。たいていは*薄紙と手書きのタグ*を添えて。ページも、その箱と同じ佇まいでありたい。*白く、急がず、ふと目を留めたくなる静かなディテールがひとつ*。',
  } as LocStr,
  use3When: { en: 'Premium launches', ko: '프리미엄 런칭', ja: 'プレミアム・ローンチ' } as LocStr,
  use3What: {
    en: 'Hardware, watches, audio gear — pages that should feel like **paper packaging** being unfolded around the object before it appears. Use Soft Inflate when the product itself is the dense thing; the page only needs to *create the room* the product walks into.',
    ko: '하드웨어, 시계, 오디오 — 사물이 모습을 드러내기 전, 그 둘레로 **펼쳐지는 종이 포장**처럼 느껴져야 하는 페이지. *제품 자체가 밀도를 쥐고 있을* 때 Soft Inflate을 씁니다. 페이지는 그저 *제품이 걸어 들어올 방을 만들면* 됩니다.',
    ja: 'ハードウェア、時計、オーディオ ― 物が姿を見せる前に、その周りで**ほどかれていく紙の包装**のように感じさせたいページ。*密度を担うのはプロダクトそのもの*なら、Soft Inflate の出番だ。ページはただ、*プロダクトが歩み入る部屋を整える*だけでいい。',
  } as LocStr,
  use4When: { en: 'Never for', ko: '쓰지 말 것', ja: '使わない場面' } as LocStr,
  use4What: {
    en: 'Operations dashboards, real-time games, cyber identities, anything that needs to be **fast and dense on a small screen**. Soft Inflate is the slow lane, and the slow lane has nothing useful to say to a pilot reading a flight plan at four in the morning.',
    ko: '운영 대시보드, 실시간 게임, 사이버 아이덴티티처럼 **작은 화면에서 빠르고 빽빽해야 하는** 모든 것. Soft Inflate은 *느린 차선*입니다. 새벽 4시에 비행 계획서를 읽는 조종사에게 느린 차선이 *해줄 말은 없습니다*.',
    ja: '運用ダッシュボード、リアルタイム・ゲーム、サイバー・アイデンティティ ― **小さな画面で、速く、密でなければならない**もの全般。Soft Inflate は*遅い車線*だ。そしてその遅い車線には、午前四時にフライト・プランを読むパイロットへ*かけてやれる言葉は何もない*。',
  } as LocStr,

  // COLOPHON
  colH: {
    en: 'One white page, *one sky*, four soft photographs.',
    ko: '한 장의 흰 페이지, *한 조각의 하늘*, 네 장의 부드러운 사진.',
    ja: '一枚の白いページ、*ひとひらの空*、四枚の柔らかな写真。',
  } as LocStr,
  colSub: { en: 'Materials & credits', ko: '재료와 크레딧', ja: '素材とクレジット' } as LocStr,
  colP1: {
    en: 'Built on pure white **#FFFFFF** with neutral cool greys for surface variation, and a sky-blue **#7DD3FC / #0EA5E9** accent on the title period, the manifesto bracket, the live-breath numeric, and the *Never For* row.',
    ko: '순백 **#FFFFFF** 바탕에 면의 변화를 주는 중성 cool grey를 깔고, sky-blue **#7DD3FC / #0EA5E9** 포인트 색을 타이틀 끝점, 매니페스토 괄호, 현재 호흡 수치, *Never For* 행에 씁니다.',
    ja: '土台は純白 **#FFFFFF**。面に変化をつけるのは中性のクールグレーで、スカイ・ブルー **#7DD3FC / #0EA5E9** のアクセントは、タイトル末尾の点、マニフェストの括弧、現在の呼吸の数値、*Never For* 行にだけ置く。',
  } as LocStr,
  colP2: {
    en: 'Imagery is curated soft photography — four photographs, each framed as a neumorphic plate with cursor-driven micro saturation. The frame breathes via box-shadow amplitude on an eight-second cycle. No drawn illustration, no SVG figures, no canvas, no GSAP.',
    ko: '이미지는 골라 담은 부드러운 사진 네 장입니다. 각 사진은 neumorphic plate로 프레임을 두르고, 커서를 따라 채도를 미세하게 바꿉니다. 프레임은 8초 주기로 box-shadow 진폭을 키웠다 줄이며 호흡합니다. 그려낸 일러스트도, SVG figure도, canvas도, GSAP도 쓰지 않았습니다.',
    ja: '画像は厳選した柔らかな写真四枚。それぞれを neumorphic plate のフレームに収め、カーソルに合わせて彩度をわずかに動かす。フレームは八秒周期で box-shadow の振幅を伸び縮みさせ、呼吸する。描いたイラストも、SVG figure も、canvas も、GSAP も使っていない。',
  } as LocStr,
  colMA: { en: 'DISPLAY', ko: '디스플레이', ja: 'ディスプレイ' } as LocStr,
  colMAVal: { en: 'Plus Jakarta Sans 800', ko: 'Plus Jakarta Sans 800', ja: 'Plus Jakarta Sans 800' } as LocStr,
  colMB: { en: 'BODY', ko: '본문', ja: '本文' } as LocStr,
  colMBVal: { en: 'Inter 400 / 500', ko: 'Inter 400 / 500', ja: 'Inter 400 / 500' } as LocStr,
  colMC: { en: 'LABELS', ko: '라벨', ja: 'ラベル' } as LocStr,
  colMCVal: { en: 'IBM Plex Mono', ko: 'IBM Plex Mono', ja: 'IBM Plex Mono' } as LocStr,
  colMD: { en: 'PALETTE', ko: '팔레트', ja: 'パレット' } as LocStr,
  colMDVal: { en: '#FFF · cool greys · #7DD3FC + #0EA5E9', ko: '#FFF · cool grey · #7DD3FC + #0EA5E9', ja: '#FFF · クールグレー · #7DD3FC + #0EA5E9' } as LocStr,
  colME: { en: 'EDITION', ko: '에디션', ja: 'エディション' } as LocStr,
  colMEVal: { en: 'Web Stylebook · Fusion XVI · 2026', ko: 'Web Stylebook · 퓨전 XVI · 2026', ja: 'Web Stylebook · フュージョン XVI · 2026' } as LocStr,
  creditHead: { en: 'PHOTOGRAPHY', ko: '사진', ja: '写真' } as LocStr,
} as const;

const PROMPTS: Record<Lang, string> = {
  en: `Design a single landing page titled "Soft Inflate" — a fusion of NEUMORPHISM and EDITORIAL SILENCE built around four curated soft photographs of inflated forms (a white balloon in blue sky, a pastel-sky balloon field, fluffy white fabric, and white fabric catching rainbow light). The page is a calm portfolio, not a tech demo.

PALETTE — pure white with sky-blue accent:
--si-bg:    #FFFFFF / --si-bg-2: #FAFBFC / --si-bg-3: #F1F3F6
--si-line:  #E4E7EC / --si-line-2: #CBD1D9
--si-ink:   #0A0C10 / --si-ink-2: #2A2F38
--si-mute:  #6B7280 / --si-mute-2: #9AA1AC
--si-sky-3: #7DD3FC (primary accent) / --si-sky-5: #0EA5E9 (bold accent) / --si-sky-6: #0284C7 (hover)
NO warm tint, NO yellow, NO grey decision-avoidance. Sky blue does ALL signal work.

TYPE — clean modern only. NO classical serif, NO Archivo Black at display, NO Cormorant.
Display: Plus Jakarta Sans 800 (hero clamp 3.6-12rem) — modern geometric.
Body: Inter 400/500, line-height 1.7.
Mono: IBM Plex Mono — labels / meta / readouts (letter-spacing 0.18-0.42em uppercase).

IMAGE FRAME — the central UI primitive:
Each photograph is a .si-frame card — white background, border-radius 20px, 1px hairline border, multi-layer box-shadow:
  - downward warm shadow rgba(30 41 59 / 0.12) with 18–34px offset breathing on @property --si-breath-ambient
  - upward-left ambient highlight rgba(255 255 255 / 0.9)
  - inset 1px highlight rgba(255 255 255 / 0.7) at top
On hover: translateY(-4px), border darkens to --si-line-2, image scales 1.04 over 600ms cubic-bezier(0.22,1,0.36,1).
Image filter shifts with cursor: saturate(1 + 0.08*var(--si-cursor-x)) brightness(1 + 0.04*var(--si-cursor-y)).
Aspect ratios: hero 16/9 (max 1080px wide), variations 4/5 portrait or 1/1 square.

IMAGES — four real photographs of soft inflated forms (think balloons, fabric, sky — anything that holds air). Composition cues: single subject or small cluster, low angle, soft directional light, generous negative space. The photographs are the page's depth — no drawn SVG figures, no decorative graphics.

KINETIC — two quiet signals:
(1) @property --si-breath-ambient <number>; @keyframes pulsing 0.35 ↔ 0.92 over 8s. Drives each frame's box-shadow throw + the breath-bar live numeric.
(2) pointermove writes --si-cursor-x / --si-cursor-y to root (EMA 0.08 easing). Feeds image filter saturate/brightness.
Nothing else moves.

LAYOUT — six clean editorial sections in a 1280px shell:
1. HERO — mono brand strip + Plus Jakarta 800 "Soft Inflate" title (period in sky-5) + Inter italic sub + the HERO frame (balloon image, 16/9, max 1080px) + hairline meta band.
2. MANIFESTO (2-col) — left frame holds the fluffy fabric image; right column holds eyebrow with sky-5 [ ] brackets + Plus Jakarta 700 headline + 2 Inter body paragraphs.
3. VARIATIONS (3-col) — head label + 3 frames (Pastel sky / Fluffy fabric / Rainbow light) with PLATE II/III/IV mono numerals + Plus Jakarta name + Inter caption per card.
4. BREATH BAR (single row card) — title + 3 mono readouts: Cycle / Current (sky-5 live %) / Hue.
5. USES (2-col) — left title, right 4-row when/what list. NEVER-FOR row label in sky-5.
6. COLOPHON (2-col card) — display headline + 2 body paragraphs + mono spec list + photographer credits row.

NAV — fixed top blurred nav with padding clamp(100px,12vw,140px) — Back chip and brand never overlap.

RULES (forbidden):
- NO warm tint, NO yellow palette, NO grey monochrome safety
- NO drawn SVG figures (no bellows, no lungs, no balloons sketched in path data) — use REAL PHOTOGRAPHS
- NO origami fold polygons
- NO classical serif display, NO Archivo Black at hero
- Sky blue appears at four signal moments: title period, manifesto bracket, live breath numeric, NEVER-FOR row
- Credit photographers in the colophon if the source library asks for it

OUTPUT: single self-contained HTML/CSS/JS. Include @property declarations, @keyframes, pointermove handler with EMA easing, and the six sections with curated soft photographs served via CDN.`,
  ko: `"Soft Inflate" 단일 랜딩 페이지 — 뉴모피즘 × 에디토리얼 사일런스의 퓨전을 네 장의 큐레이션된 부드러운 사진 (푸른 하늘의 흰 풍선, 파스텔 하늘의 열기구들, 폭신한 흰 천, 무지개 빛을 머금은 흰 천) 중심으로 빌드. 페이지는 조용한 포트폴리오, 테크 데모 아님.

팔레트 — 순백 + 하늘색 액센트:
--si-bg: #FFFFFF / --si-bg-2: #FAFBFC / --si-bg-3: #F1F3F6
--si-line: #E4E7EC / --si-line-2: #CBD1D9
--si-ink: #0A0C10 / --si-ink-2: #2A2F38
--si-mute: #6B7280 / --si-mute-2: #9AA1AC
--si-sky-3: #7DD3FC (1차 액센트) / --si-sky-5: #0EA5E9 (강조) / --si-sky-6: #0284C7 (호버)
따뜻한 톤 없음, 노란 톤 없음, 결정 회피용 그레이 없음. 시그널은 모두 하늘색이 맡음.

타이포 — 깔끔 모던만. 클래식 세리프 금지, Archivo Black 디스플레이 금지.
디스플레이: Plus Jakarta Sans 800 (히어로 clamp 3.6-12rem).
본문: Inter 400/500, line-height 1.7.
모노: IBM Plex Mono — 라벨/메타/리드아웃.

이미지 프레임 — 핵심 UI 프리미티브:
각 사진은 .si-frame 카드 — 흰 배경, border-radius 20px, 1px 헤어라인 보더, 다층 box-shadow:
  - 아래쪽 따뜻한 그림자 rgba(30 41 59 / 0.12), 18–34px 오프셋이 @property --si-breath-ambient 로 호흡
  - 좌상단 ambient highlight rgba(255 255 255 / 0.9)
  - 상단 inset 1px highlight rgba(255 255 255 / 0.7)
호버: translateY(-4px), 보더 어두워짐, 이미지 1.04 스케일 (600ms cubic-bezier).
커서가 이미지 필터를 조정: saturate(1 + 0.08*cursor-x) brightness(1 + 0.04*cursor-y).
종횡비: 히어로 16/9 (최대 1080px), variations 4/5 또는 1/1.

이미지 — 부드러운 부푼 형의 실사진 네 장 (풍선, 천, 하늘 — 공기를 품는 사물이면 어떤 것이든). 구도 가이드: 단일 피사체나 작은 군집, 낮은 각도, 부드러운 방향성 빛, 넉넉한 여백. 사진이 페이지의 깊이입니다 — 그려낸 SVG 일러스트 금지, 장식적 그래픽 금지.

키네틱 — 두 조용한 신호:
(1) @property --si-breath-ambient <number>; @keyframes 0.35 ↔ 0.92, 8초. 각 프레임의 box-shadow throw + breath-bar live 수치 구동.
(2) pointermove --si-cursor-x / --si-cursor-y 를 루트에 씀 (EMA 0.08). 이미지 saturate/brightness 공급.
그 외 안 움직임.

레이아웃 — 1280px 셸 안 6 깔끔 에디토리얼 섹션:
1. HERO — 모노 브랜드 + Plus Jakarta 800 "Soft Inflate" (마침표 sky-5) + Inter 이탤릭 서브 + 히어로 frame (balloon 16/9 max 1080px) + 헤어라인 메타 행.
2. MANIFESTO (2단) — 좌측 frame fluffy fabric; 우측 [ ] 괄호 (sky-5) + Plus Jakarta 700 헤드라인 + Inter 본문 2단락.
3. VARIATIONS (3단) — 헤드 라벨 + 3 frame (Pastel sky / Fluffy fabric / Rainbow light) + PLATE II/III/IV 모노 + Plus Jakarta name + Inter caption.
4. BREATH BAR (단일 행 카드) — 타이틀 + 3 모노 readout: Cycle / Current (sky-5 live %) / Hue.
5. USES (2단) — 좌측 타이틀, 우측 4행 when/what. NEVER-FOR 라벨 sky-5.
6. COLOPHON (2단 카드) — 디스플레이 헤드라인 + 본문 2단락 + 모노 스펙 리스트 + 사진가 크레딧.

내비 — 상단 고정 블러 nav, 패딩 clamp(100px,12vw,140px) — Back 칩 / 브랜드 절대 안 겹침.

규칙 (금지):
- 따뜻한 톤, 노란 팔레트, 그레이 모노 회피 금지
- 그려낸 SVG figure 금지 (path data 로 풀무/폐/풍선 그리기 금지) — 실 사진만
- origami fold 폴리곤 금지
- 클래식 세리프 금지, 히어로에 Archivo Black 금지
- 하늘색은 네 신호 모먼트: 타이틀 끝점, 매니페스토 괄호, breath live 수치, NEVER-FOR 행
- 출처 라이브러리가 요구하면 콜로폰에 사진 크레딧

출력: 자기완결 HTML/CSS/JS. @property, @keyframes, EMA 이징 pointermove 핸들러, CDN 큐레이션 부드러운 사진 6 섹션.`,
  ja: `"Soft Inflate" 単一ランディングページ ― ニューモーフィズム × エディトリアル・サイレンスのフュージョンを、四枚のキュレーション済みの柔らかな写真 (青空の白い風船、パステル空の熱気球、ふわふわの白布、虹色の光を持つ白布) を中心に構築。ページは静かなポートフォリオであり、テック・デモではない。

パレット ― 純白 + 空色のアクセント:
--si-bg: #FFFFFF / --si-bg-2: #FAFBFC / --si-bg-3: #F1F3F6
--si-line: #E4E7EC / --si-line-2: #CBD1D9
--si-ink: #0A0C10 / --si-ink-2: #2A2F38
--si-mute: #6B7280 / --si-mute-2: #9AA1AC
--si-sky-3: #7DD3FC (主アクセント) / --si-sky-5: #0EA5E9 (強調) / --si-sky-6: #0284C7 (ホバー)
温かいトーンなし、黄色なし、決定回避のグレーなし。空色がすべての信号仕事を担う。

書体 ― 清潔なモダンのみ。クラシック・セリフ禁止、ディスプレイに Archivo Black 禁止。
ディスプレイ: Plus Jakarta Sans 800 (ヒーロー clamp 3.6-12rem)。
本文: Inter 400/500、line-height 1.7。
モノ: IBM Plex Mono ― ラベル/メタ/リードアウト。

イメージ・フレーム ― シグネチャー・プリミティブ:
各写真は .si-frame カード ― 白背景、border-radius 20px、1px ヘアライン・ボーダー、多層 box-shadow:
  - 下向きの温かい影 rgba(30 41 59 / 0.12)、18–34px オフセットが @property --si-breath-ambient で呼吸
  - 左上のアンビエント・ハイライト rgba(255 255 255 / 0.9)
  - 上部 inset 1px ハイライト rgba(255 255 255 / 0.7)
ホバー: translateY(-4px)、ボーダーが暗くなる、画像 1.04 スケール (600ms cubic-bezier)。
カーソルが画像フィルタを調整: saturate(1 + 0.08*cursor-x) brightness(1 + 0.04*cursor-y)。
アスペクト: ヒーロー 16/9 (最大 1080px)、variations 4/5 または 1/1。

画像 ― 柔らかく膨らんだ形の実写真を四枚 (風船、布、空 ― 空気を抱える事物なら何でも)。構図の手がかり: 単一被写体か小さな群、低い角度、柔らかな方向性のある光、ゆとりのある余白。写真がページの深さである ― 描かれた SVG イラスト禁止、装飾的グラフィック禁止。

運動 ― 二つの静かな信号:
(1) @property --si-breath-ambient <number>; @keyframes 0.35 ↔ 0.92、八秒。各フレームの box-shadow throw + breath-bar live 数値を駆動。
(2) pointermove --si-cursor-x / --si-cursor-y をルートに書く (EMA 0.08)。画像 saturate/brightness を供給。
それ以外は動かない。

レイアウト ― 1280px シェルの中、六つの清潔なエディトリアル・セクション:
1. HERO ― モノのブランド + Plus Jakarta 800 "Soft Inflate" (句点が sky-5) + Inter イタリックのサブ + ヒーロー frame (balloon 16/9 max 1080px) + ヘアラインのメタ行。
2. MANIFESTO (二段) ― 左フレーム fluffy fabric; 右に [ ] 括弧 (sky-5) + Plus Jakarta 700 見出し + Inter 本文二段落。
3. VARIATIONS (三段) ― ヘッド・ラベル + 三 frame (Pastel sky / Fluffy fabric / Rainbow light) + PLATE II/III/IV モノ + Plus Jakarta name + Inter キャプション。
4. BREATH BAR (単一行カード) ― タイトル + 三モノ readout: Cycle / Current (sky-5 live %) / Hue。
5. USES (二段) ― 左タイトル、右四行 when/what。NEVER-FOR ラベル sky-5。
6. COLOPHON (二段カード) ― ディスプレイ見出し + 本文二段落 + モノのスペック・リスト + 写真家クレジット。

ナビ ― 上部固定ぼかし nav、パディング clamp(100px,12vw,140px) ― Back チップ / ブランド絶対に重ならない。

ルール (禁止):
- 温かいトーン、黄色パレット、グレー・モノクローム回避禁止
- 描かれた SVG figure 禁止 (path data でふいご / 肺 / 風船を描かない) ― 実写真のみ
- origami の折りポリゴン禁止
- クラシック・セリフ禁止、ヒーローに Archivo Black 禁止
- 空色は四つの信号瞬間: タイトル末尾の点、マニフェスト括弧、breath live 数値、NEVER-FOR 行
- 出典ライブラリが求めるなら奥付に写真家クレジット

出力: 自己完結 HTML/CSS/JS。@property、@keyframes、EMA イージング pointermove ハンドラ、CDN のキュレーション済み柔らかな写真、六つのセクション。`,
};

function emph(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

function strong(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface FrameProps {
  src: string;
  alt: string;
  variant: 'hero' | 'portrait' | 'square';
  caption?: { key: string; val: React.ReactNode };
}

function Frame({ src, alt, variant, caption }: FrameProps) {
  // Give the browser an intrinsic aspect ratio BEFORE the image loads
  // so layout reserves the right space (no CLS, no infinite-scroll bug).
  // The actual on-screen size still comes from CSS aspect-ratio.
  const dim =
    variant === 'hero' ? { w: 1600, h: 900 } :
    variant === 'portrait' ? { w: 800, h: 1000 } :
    { w: 800, h: 800 };
  return (
    <figure className={`si-frame si-frame--${variant}`}>
      <img
        className="si-frame__img"
        src={src}
        alt={alt}
        loading="lazy"
        width={dim.w}
        height={dim.h}
        decoding="async"
      />
      {caption ? (
        <figcaption className="si-frame__caption">
          <span>{caption.key}</span>
          <b>{caption.val}</b>
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PortedFusionSoftInflatePage({ lang }: PortedStylePageProps) {
  const lng = lang as Lang;
  const rootRef = useRef<HTMLDivElement>(null);
  const [breathPct, setBreathPct] = useState(55);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // === pointer: write directly, throttle to one rAF per move
    //   (the @property + CSS transition on the root smooths it,
    //   so we don't need a continuous RAF loop.) ===
    let pending = false;
    const onMove = (e: PointerEvent) => {
      if (reduced || pending) return;
      pending = true;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      requestAnimationFrame(() => {
        root.style.setProperty('--si-cursor-x', x.toFixed(3));
        root.style.setProperty('--si-cursor-y', y.toFixed(3));
        pending = false;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // === breath readout: setInterval at 250ms, paused when off-screen ===
    const sample = () => {
      const t = (performance.now() / 1000) % 8;
      const phase = (Math.sin((t / 8) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const ambient = 0.35 + (0.92 - 0.35) * phase;
      setBreathPct(Math.round(ambient * 100));
    };
    const intervalId = window.setInterval(sample, 250);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <FusionShell
      fusionId="fusion-soft-inflate"
      lang={lng}
      prev={{ href: '/pages/fusion-pure-noir.html', label: 'Pure Noir' }}
      prompts={PROMPTS}
    >
      <div ref={rootRef} className="si-shell">
        {/* ============================================================ */}
        {/* HERO                                                          */}
        {/* ============================================================ */}
        <section className="si-hero" aria-labelledby="si-title">
          <p className="si-hero__brand">{emph(L(COPY.brand, lng))}</p>
          <h1 id="si-title" className="si-hero__title">
            {L(COPY.heroTitle, lng)} <em>{L(COPY.heroTitle2, lng)}</em><span className="si-dot">.</span>
          </h1>
          <p className="si-hero__sub">{emph(L(COPY.heroSub, lng))}</p>
          <Frame
            src={IMG.balloon.src}
            alt={L(IMG.balloon.alt, lng)}
            variant="hero"
            caption={{ key: L(COPY.heroCaptionKey, lng), val: emph(L(COPY.heroCaptionVal, lng)) }}
          />
          <div className="si-hero__meta">
            <span>{L(COPY.metaA, lng)} &nbsp;<b>{L(COPY.metaAVal, lng)}</b></span>
            <span>{L(COPY.metaB, lng)} &nbsp;<b>{L(COPY.metaBVal, lng)}</b></span>
            <span>{L(COPY.metaC, lng)} &nbsp;<b>{L(COPY.metaCVal, lng)}</b></span>
          </div>
        </section>

        {/* ============================================================ */}
        {/* MANIFESTO                                                     */}
        {/* ============================================================ */}
        <section className="si-manifesto" aria-labelledby="si-man-h">
          <div className="si-manifesto__frame">
            <Frame src={IMG.fluffy.src} alt={L(IMG.fluffy.alt, lng)} variant="portrait" />
          </div>
          <div className="si-manifesto__copy">
            <span className="si-manifesto__eye">{L(COPY.manEye, lng)}</span>
            <h2 id="si-man-h" className="si-manifesto__h">{emph(L(COPY.manH, lng))}</h2>
            <div className="si-manifesto__body">
              <p>{strong(L(COPY.manP1, lng))}</p>
              <p>{strong(L(COPY.manP2, lng))}</p>
              <p>{strong(L(COPY.manP3, lng))}</p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PRINCIPLES — three rules of the room                          */}
        {/* ============================================================ */}
        <section className="si-principles" aria-labelledby="si-prin-h">
          <header className="si-principles__head">
            <span className="si-principles__rule" />
            <h2 id="si-prin-h" className="si-principles__label">{emph(L(COPY.prinLabel, lng))}</h2>
            <span className="si-principles__rule" />
          </header>
          <article className="si-principle">
            <span className="si-principle__num">{emph(L(COPY.prin1Num, lng))}</span>
            <h3 className="si-principle__h">{emph(L(COPY.prin1H, lng))}</h3>
            <p className="si-principle__body">{strong(L(COPY.prin1B, lng))}</p>
            <div className="si-principle__detail">
              <span>{L(COPY.prin1Detail, lng)}</span>
              <b>{L(COPY.prin1DetailVal, lng)}</b>
            </div>
          </article>
          <article className="si-principle">
            <span className="si-principle__num">{emph(L(COPY.prin2Num, lng))}</span>
            <h3 className="si-principle__h">{emph(L(COPY.prin2H, lng))}</h3>
            <p className="si-principle__body">{strong(L(COPY.prin2B, lng))}</p>
            <div className="si-principle__detail">
              <span>{L(COPY.prin2Detail, lng)}</span>
              <b>{L(COPY.prin2DetailVal, lng)}</b>
            </div>
          </article>
          <article className="si-principle">
            <span className="si-principle__num">{emph(L(COPY.prin3Num, lng))}</span>
            <h3 className="si-principle__h">{emph(L(COPY.prin3H, lng))}</h3>
            <p className="si-principle__body">{strong(L(COPY.prin3B, lng))}</p>
            <div className="si-principle__detail">
              <span>{L(COPY.prin3Detail, lng)}</span>
              <b>{L(COPY.prin3DetailVal, lng)}</b>
            </div>
          </article>
        </section>

        {/* ============================================================ */}
        {/* VARIATIONS                                                    */}
        {/* ============================================================ */}
        <section className="si-variations" aria-labelledby="si-var-h">
          <header className="si-variations__head">
            <span className="si-variations__rule" />
            <h2 id="si-var-h" className="si-variations__label">{emph(L(COPY.varLabel, lng))}</h2>
            <span className="si-variations__rule" />
          </header>
          <article className="si-variation">
            <Frame src={IMG.pastelSky.src} alt={L(IMG.pastelSky.alt, lng)} variant="square" />
            <span className="si-variation__num">{L(COPY.var1Num, lng)}</span>
            <h3 className="si-variation__name">{L(COPY.var1Name, lng)}</h3>
            <p className="si-variation__body">{strong(L(COPY.var1Body, lng))}</p>
          </article>
          <article className="si-variation">
            <Frame src={IMG.fluffy.src} alt={L(IMG.fluffy.alt, lng)} variant="square" />
            <span className="si-variation__num">{L(COPY.var2Num, lng)}</span>
            <h3 className="si-variation__name">{L(COPY.var2Name, lng)}</h3>
            <p className="si-variation__body">{strong(L(COPY.var2Body, lng))}</p>
          </article>
          <article className="si-variation">
            <Frame src={IMG.rainbow.src} alt={L(IMG.rainbow.alt, lng)} variant="square" />
            <span className="si-variation__num">{L(COPY.var3Num, lng)}</span>
            <h3 className="si-variation__name">{L(COPY.var3Name, lng)}</h3>
            <p className="si-variation__body">{strong(L(COPY.var3Body, lng))}</p>
          </article>
        </section>

        {/* ============================================================ */}
        {/* BREATH BAR                                                    */}
        {/* ============================================================ */}
        <section className="si-breath" aria-labelledby="si-breath-h">
          <h2 id="si-breath-h" className="si-breath__h">{emph(L(COPY.breathH, lng))}</h2>
          <div className="si-breath__values" aria-live="polite">
            <div>
              <span>{L(COPY.breathRA, lng)}</span>
              <b>{L(COPY.breathRAVal, lng)}</b>
            </div>
            <div>
              <span>{L(COPY.breathRB, lng)}</span>
              <b className="is-sky">{breathPct}%</b>
            </div>
            <div>
              <span>{L(COPY.breathRC, lng)}</span>
              <b>{L(COPY.breathRCVal, lng)}</b>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* USES                                                          */}
        {/* ============================================================ */}
        <section className="si-uses" aria-labelledby="si-uses-h">
          <h2 id="si-uses-h" className="si-uses__h">{emph(L(COPY.usesH, lng))}</h2>
          <ul className="si-uses__list">
            <li className="si-uses__row">
              <span className="si-uses__when">{L(COPY.use1When, lng)}</span>
              <p className="si-uses__what">{strong(L(COPY.use1What, lng))}</p>
            </li>
            <li className="si-uses__row">
              <span className="si-uses__when">{L(COPY.use2When, lng)}</span>
              <p className="si-uses__what">{strong(L(COPY.use2What, lng))}</p>
            </li>
            <li className="si-uses__row">
              <span className="si-uses__when">{L(COPY.use3When, lng)}</span>
              <p className="si-uses__what">{strong(L(COPY.use3What, lng))}</p>
            </li>
            <li className="si-uses__row si-uses__row--never">
              <span className="si-uses__when">{L(COPY.use4When, lng)}</span>
              <p className="si-uses__what">{strong(L(COPY.use4What, lng))}</p>
            </li>
          </ul>
        </section>

        {/* ============================================================ */}
        {/* COLOPHON                                                      */}
        {/* ============================================================ */}
        <section className="si-colophon" aria-labelledby="si-col-h">
          <div>
            <h2 id="si-col-h" className="si-colophon__h">{emph(L(COPY.colH, lng))}</h2>
            <span className="si-colophon__sub">{L(COPY.colSub, lng)}</span>
          </div>
          <div className="si-colophon__body">
            <p>{strong(L(COPY.colP1, lng))}</p>
            <p>{strong(L(COPY.colP2, lng))}</p>
            <ul className="si-colophon__list">
              <li>{L(COPY.colMA, lng)} &nbsp;<b>{L(COPY.colMAVal, lng)}</b></li>
              <li>{L(COPY.colMB, lng)} &nbsp;<b>{L(COPY.colMBVal, lng)}</b></li>
              <li>{L(COPY.colMC, lng)} &nbsp;<b>{L(COPY.colMCVal, lng)}</b></li>
              <li>{L(COPY.colMD, lng)} &nbsp;<b>{L(COPY.colMDVal, lng)}</b></li>
              <li>{L(COPY.colME, lng)} &nbsp;<b>{L(COPY.colMEVal, lng)}</b></li>
            </ul>
            <div className="si-colophon__credit">
              <div>{L(COPY.creditHead, lng)}</div>
              <div>
                <a href={IMG.balloon.credit.url} target="_blank" rel="noreferrer noopener">{IMG.balloon.credit.name}</a>
                {' · '}
                <a href={IMG.pastelSky.credit.url} target="_blank" rel="noreferrer noopener">{IMG.pastelSky.credit.name}</a>
                {' · '}
                <a href={IMG.fluffy.credit.url} target="_blank" rel="noreferrer noopener">{IMG.fluffy.credit.name}</a>
                {' · '}
                <a href={IMG.rainbow.credit.url} target="_blank" rel="noreferrer noopener">{IMG.rainbow.credit.name}</a>
                {' · '}via <a href="https://unsplash.com" target="_blank" rel="noreferrer noopener">Unsplash</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </FusionShell>
  );
}
