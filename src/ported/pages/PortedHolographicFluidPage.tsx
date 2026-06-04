import { useRef, useState, type CSSProperties } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

type HoloPalette = {
  id: string;
  name: string;
  /** display label per language */
  label: { en: string; ko: string; ja: string };
  c1: string; c1Rgb: string;
  c2: string; c2Rgb: string;
  c3: string; c3Rgb: string;
  c4: string; c4Rgb: string;
};

const PALETTES: HoloPalette[] = [
  {
    id: 'aurora',
    name: 'AURORA',
    label: { en: 'Aurora · pink → cyan', ko: '오로라 · 핑크 → 시안', ja: 'オーロラ · ピンク → シアン' },
    c1: '#ff7eb3', c1Rgb: '255, 126, 179',
    c2: '#ff758c', c2Rgb: '255, 117, 140',
    c3: '#4facfe', c3Rgb: '79, 172, 254',
    c4: '#00f2fe', c4Rgb: '0, 242, 254',
  },
  {
    id: 'orchid',
    name: 'ORCHID',
    label: { en: 'Orchid · violet bloom', ko: '오키드 · 보라 블룸', ja: 'オーキッド · バイオレットブルーム' },
    c1: '#c084fc', c1Rgb: '192, 132, 252',
    c2: '#ff6ad5', c2Rgb: '255, 106, 213',
    c3: '#7c5cff', c3Rgb: '124, 92, 255',
    c4: '#5cc4ff', c4Rgb: '92, 196, 255',
  },
  {
    id: 'sunset',
    name: 'SUNSET',
    label: { en: 'Sunset · gold → mauve', ko: '선셋 · 골드 → 모브', ja: 'サンセット · ゴールド → モーブ' },
    c1: '#ffd166', c1Rgb: '255, 209, 102',
    c2: '#ff8c5a', c2Rgb: '255, 140, 90',
    c3: '#ff5d8f', c3Rgb: '255, 93, 143',
    c4: '#b388ff', c4Rgb: '179, 136, 255',
  },
  {
    id: 'lagoon',
    name: 'LAGOON',
    label: { en: 'Lagoon · mint → indigo', ko: '라군 · 민트 → 인디고', ja: 'ラグーン · ミント → インディゴ' },
    c1: '#6ee7b7', c1Rgb: '110, 231, 183',
    c2: '#38bdf8', c2Rgb: '56, 189, 248',
    c3: '#818cf8', c3Rgb: '129, 140, 248',
    c4: '#c084fc', c4Rgb: '192, 132, 252',
  },
  {
    id: 'mist',
    name: 'MIST',
    label: { en: 'Mist · frosted pastel', ko: '미스트 · 프로스티드 파스텔', ja: 'ミスト · フロステッドパステル' },
    c1: '#d4c8ff', c1Rgb: '212, 200, 255',
    c2: '#f7c8e0', c2Rgb: '247, 200, 224',
    c3: '#b0d8ff', c3Rgb: '176, 216, 255',
    c4: '#c8efe8', c4Rgb: '200, 239, 232',
  },
  {
    id: 'opal',
    name: 'OPAL',
    label: { en: 'Opal · fire jewel', ko: '오팔 · 파이어 주얼', ja: 'オパール · ファイアジュエル' },
    c1: '#ff6b6b', c1Rgb: '255, 107, 107',
    c2: '#ffb84d', c2Rgb: '255, 184, 77',
    c3: '#4ecdc4', c3Rgb: '78, 205, 196',
    c4: '#a78bfa', c4Rgb: '167, 139, 250',
  },
];

export function PortedHolographicFluidPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  const [activeId, setActiveId] = useState('aurora');
  const palette = PALETTES.find((p) => p.id === activeId) ?? PALETTES[0];

  const styleVars = {
    ['--c1' as string]: palette.c1,
    ['--c2' as string]: palette.c2,
    ['--c3' as string]: palette.c3,
    ['--c4' as string]: palette.c4,
    ['--c1-rgb' as string]: palette.c1Rgb,
    ['--c2-rgb' as string]: palette.c2Rgb,
    ['--c3-rgb' as string]: palette.c3Rgb,
    ['--c4-rgb' as string]: palette.c4Rgb,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className="ported-style-page ported-style-page--holographic-fluid"
      style={styleVars}
      data-palette={palette.id}
    >
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <div className="fluid-bg" />
        <main className="wrap">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">스타일</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">스타일 비교</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">색상 조합</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">프롬프트 생성기</a></li>
                <li><a href="/pages/prompt-tips" data-i18n="nav.more-tips">팁</a></li>
              </ul>
              <div className="nav-actions">
                <button className="nav-burger" id="nav-burger" aria-label="Toggle menu" aria-expanded="false">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </svg>
                </button>
                <div className="lang-dropdown" id="lang-dropdown">
                  <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
                  <ul className="lang-menu" role="menu">
                    <li><button role="menuitem" data-lang-select="en">English</button></li>
                    <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                    <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
                  </ul>
                </div>
                <button className="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme" title="Reset Global Theme">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </button>
              </div>
            </div>
          </nav>
          {/* Palette switcher */}
          <div className="hf-palette-switch" role="region" aria-label="Iridescent palette">
            <div className="hf-palette-switch__label">
              <span className="hf-palette-switch__dot" />
              <span data-lang="en">PALETTE / TAP TO RECOLOR</span>
              <span data-lang="ko" hidden>팔레트 / 눌러서 색 바꾸기</span>
              <span data-lang="ja" hidden>パレット / タップして再着色</span>
            </div>
            <div className="hf-palette-switch__chips" role="radiogroup" aria-label="Iridescent palette">
              {PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={p.id === activeId}
                  className={`hf-palette-chip${p.id === activeId ? ' is-active' : ''}`}
                  onClick={() => setActiveId(p.id)}
                  style={{
                    ['--chip-c1' as string]: p.c1,
                    ['--chip-c2' as string]: p.c2,
                    ['--chip-c3' as string]: p.c3,
                    ['--chip-c4' as string]: p.c4,
                  } as CSSProperties}
                >
                  <span className="hf-palette-chip__swatches" aria-hidden="true">
                    <span className="hf-palette-chip__sw" style={{background: p.c1}} />
                    <span className="hf-palette-chip__sw" style={{background: p.c2}} />
                    <span className="hf-palette-chip__sw" style={{background: p.c3}} />
                    <span className="hf-palette-chip__sw" style={{background: p.c4}} />
                  </span>
                  <span className="hf-palette-chip__name">{p.name}</span>
                </button>
              ))}
            </div>
            <div className="hf-palette-switch__readout" aria-hidden="true">
              <span className="hf-palette-switch__hex">{palette.c1.toUpperCase()}</span>
              <span className="hf-palette-switch__plus">+</span>
              <span className="hf-palette-switch__hex">{palette.c4.toUpperCase()}</span>
            </div>
          </div>
          {/* Hero */}
          <section className="hero">
            <h1>Iridescent<br />Dreamscape</h1>
            <p className="lead" data-lang="en">
              Create a dreamy, sensory UI by blending flowing mesh gradients with holographic colors. Ideal for high-end applications and creative showcases.
            </p>
            <p className="lead" data-lang="ko" hidden>
              흐르는 메시 그라데이션에 홀로그래픽 색감을 더해 몽환적이고 감각적인 UI를 만듭니다. 고사양 앱이나 크리에이티브 쇼케이스에 잘 어울립니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              流れるようなメッシュグラデーションにホログラフィックな色彩を重ね、幻想的で感覚的なUIをつくります。ハイエンドなアプリやクリエイティブショーケースにぴったりです。
            </p>
          </section>
          {/* Spectrum Bar */}
          <div className="spectrum-bar" />
          {/* Prism Cards */}
          <div className="section-label" data-lang="en">Prism Elements</div>
          <div className="section-label" data-lang="ko" hidden>프리즘 요소</div>
          <div className="section-label" data-lang="ja" hidden>プリズム要素</div>
          <div className="prism-cards">
            <div className="prism-card" data-lang="en">
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="28,6 50,46 6,46" />
                <polygon points="28,16 42,42 14,42" opacity="0.4" />
              </svg>
              <h3>Refraction</h3>
              <p>Light splits through layered glass surfaces, casting iridescent color fragments across the interface</p>
            </div>
            <div className="prism-card" data-lang="ko" hidden>
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="28,6 50,46 6,46" />
                <polygon points="28,16 42,42 14,42" opacity="0.4" />
              </svg>
              <h3>굴절</h3>
              <p>겹겹이 쌓인 유리 면을 지나며 빛이 갈라지고, 무지갯빛 색 조각이 화면 곳곳에 흩뿌려집니다</p>
            </div>
            <div className="prism-card" data-lang="ja" hidden>
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="28,6 50,46 6,46" />
                <polygon points="28,16 42,42 14,42" opacity="0.4" />
              </svg>
              <h3>屈折</h3>
              <p>光が幾重ものガラス面を抜けて分かれ、虹色のかけらを画面いっぱいに散らします</p>
            </div>
            <div className="prism-card" data-lang="en">
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <circle cx={28} cy={28} r={22} />
                <circle cx={28} cy={28} r={14} opacity="0.4" />
                <circle cx={28} cy={28} r={6} opacity="0.2" />
              </svg>
              <h3>Diffusion</h3>
              <p>Soft radial blur dissolves hard edges into luminous halos that breathe with ambient motion</p>
            </div>
            <div className="prism-card" data-lang="ko" hidden>
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <circle cx={28} cy={28} r={22} />
                <circle cx={28} cy={28} r={14} opacity="0.4" />
                <circle cx={28} cy={28} r={6} opacity="0.2" />
              </svg>
              <h3>확산</h3>
              <p>부드러운 방사형 블러가 날카로운 경계를 빛나는 헤일로로 풀어주고, 주변 움직임에 맞춰 은은하게 일렁입니다</p>
            </div>
            <div className="prism-card" data-lang="ja" hidden>
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <circle cx={28} cy={28} r={22} />
                <circle cx={28} cy={28} r={14} opacity="0.4" />
                <circle cx={28} cy={28} r={6} opacity="0.2" />
              </svg>
              <h3>拡散</h3>
              <p>柔らかな放射状ブラーが鋭い輪郭をほどき、光るハローへと溶かします。周囲の動きに合わせてゆっくり脈打ちます</p>
            </div>
            <div className="prism-card" data-lang="en">
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="28,4 50,18 50,38 28,52 6,38 6,18" />
                <polygon points="28,12 42,22 42,34 28,44 14,34 14,22" opacity="0.4" />
              </svg>
              <h3>Reflection</h3>
              <p>Mirrored glass surfaces multiply depth, creating infinite corridors of shimmering holographic light</p>
            </div>
            <div className="prism-card" data-lang="ko" hidden>
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="28,4 50,18 50,38 28,52 6,38 6,18" />
                <polygon points="28,12 42,22 42,34 28,44 14,34 14,22" opacity="0.4" />
              </svg>
              <h3>반사</h3>
              <p>거울 같은 유리 면이 깊이를 거듭 비추며, 반짝이는 홀로그래픽 빛이 끝없이 이어지는 복도를 만듭니다</p>
            </div>
            <div className="prism-card" data-lang="ja" hidden>
              <svg viewBox="0 0 56 56" fill="none" stroke="white" strokeWidth="1.5">
                <polygon points="28,4 50,18 50,38 28,52 6,38 6,18" />
                <polygon points="28,12 42,22 42,34 28,44 14,34 14,22" opacity="0.4" />
              </svg>
              <h3>反射</h3>
              <p>鏡面のガラスが奥行きを何重にも映し、きらめくホログラフィックライトの無限回廊をつくり出します</p>
            </div>
          </div>
          {/* Holographic Properties */}
          <div className="holo-properties">
            <div className="section-label" data-lang="en">Holographic Properties</div>
            <div className="section-label" data-lang="ko" hidden>홀로그래픽 속성</div>
            <div className="section-label" data-lang="ja" hidden>ホログラフィック属性</div>
            <div className="holo-meter">
              <div className="holo-meter__header">
                <span data-lang="en">Blur</span><span data-lang="ko" hidden>블러</span><span data-lang="ja" hidden>ブラー</span>
                <span className="holo-meter__value">80px</span>
              </div>
              <div className="holo-meter__track"><div className="holo-meter__fill" /></div>
            </div>
            <div className="holo-meter">
              <div className="holo-meter__header">
                <span data-lang="en">Opacity</span><span data-lang="ko" hidden>불투명도</span><span data-lang="ja" hidden>不透明度</span>
                <span className="holo-meter__value">0.6</span>
              </div>
              <div className="holo-meter__track"><div className="holo-meter__fill" /></div>
            </div>
            <div className="holo-meter">
              <div className="holo-meter__header">
                <span data-lang="en">Rotation</span><span data-lang="ko" hidden>회전</span><span data-lang="ja" hidden>回転</span>
                <span className="holo-meter__value">15deg</span>
              </div>
              <div className="holo-meter__track"><div className="holo-meter__fill" /></div>
            </div>
            <div className="holo-meter">
              <div className="holo-meter__header">
                <span data-lang="en">Scale</span><span data-lang="ko" hidden>스케일</span><span data-lang="ja" hidden>スケール</span>
                <span className="holo-meter__value">1.2x</span>
              </div>
              <div className="holo-meter__track"><div className="holo-meter__fill" /></div>
            </div>
          </div>
          {/* Color Orbs */}
          <div className="section-label" style={{textAlign: 'center'}} data-lang="en">Color Tokens</div>
          <div className="section-label" style={{textAlign: 'center'}} data-lang="ko" hidden>색상 토큰</div>
          <div className="section-label" style={{textAlign: 'center'}} data-lang="ja" hidden>カラートークン</div>
          <div className="color-orbs">
            <div className="orb">
              <div className="orb__circle" />
              <span className="orb__name">--c1</span>
              <span className="orb__label">{palette.c1.toUpperCase()}</span>
            </div>
            <div className="orb">
              <div className="orb__circle" />
              <span className="orb__name">--c2</span>
              <span className="orb__label">{palette.c2.toUpperCase()}</span>
            </div>
            <div className="orb">
              <div className="orb__circle" />
              <span className="orb__name">--c3</span>
              <span className="orb__label">{palette.c3.toUpperCase()}</span>
            </div>
            <div className="orb">
              <div className="orb__circle" />
              <span className="orb__name">--c4</span>
              <span className="orb__label">{palette.c4.toUpperCase()}</span>
            </div>
          </div>
          {/* ============================================
              EXTENDED COMPONENT SHOWCASE
              ============================================ */}

          {/* Buttons */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Iridescent Buttons</h2>
              <h2 data-lang="ko" hidden>이리데센트 버튼</h2>
              <h2 data-lang="ja" hidden>イリデセントボタン</h2>
              <span className="section-sub" data-lang="en">6 variants · cta · ghost · shimmer · neon · outline · icon</span>
              <span className="section-sub" data-lang="ko" hidden>6가지 변형 · CTA · 고스트 · 시머 · 네온 · 아웃라인 · 아이콘</span>
              <span className="section-sub" data-lang="ja" hidden>6つのバリアント · CTA · ゴースト · シマー · ネオン · アウトライン · アイコン</span>
            </div>
            <div className="btn-lab">
              <button type="button" className="holo-btn holo-btn--solid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                <span data-lang="en">Launch Studio</span>
                <span data-lang="ko" hidden>스튜디오 실행</span>
                <span data-lang="ja" hidden>スタジオ起動</span>
              </button>
              <button type="button" className="holo-btn holo-btn--shimmer">
                <span data-lang="en">Upgrade to Pro</span>
                <span data-lang="ko" hidden>프로로 업그레이드</span>
                <span data-lang="ja" hidden>プロにアップグレード</span>
              </button>
              <button type="button" className="holo-btn holo-btn--outline">
                <span data-lang="en">View Gallery</span>
                <span data-lang="ko" hidden>갤러리 보기</span>
                <span data-lang="ja" hidden>ギャラリーを見る</span>
              </button>
              <button type="button" className="holo-btn holo-btn--ghost">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                <span data-lang="en">Discuss</span>
                <span data-lang="ko" hidden>토론</span>
                <span data-lang="ja" hidden>議論</span>
              </button>
              <button type="button" className="holo-btn holo-btn--neon">
                <span data-lang="en">Sync · Live</span>
                <span data-lang="ko" hidden>실시간 동기화</span>
                <span data-lang="ja" hidden>ライブ同期</span>
              </button>
              <button type="button" className="holo-btn holo-btn--icon-only" aria-label="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={3} /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              </button>
            </div>
          </div>

          {/* Aurora Tabs + Tiles */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Aurora Navigation</h2>
              <h2 data-lang="ko" hidden>오로라 내비게이션</h2>
              <h2 data-lang="ja" hidden>オーロラナビゲーション</h2>
              <span className="section-sub" data-lang="en">tabs with iridescent active state</span>
              <span className="section-sub" data-lang="ko" hidden>이리데센트 활성 상태 탭</span>
              <span className="section-sub" data-lang="ja" hidden>イリデセントなアクティブ状態のタブ</span>
            </div>
            <div className="aurora-tabs" role="tablist">
              <button type="button" className="active" data-lang="en">Overview</button>
              <button type="button" className="active" data-lang="ko" hidden>개요</button>
              <button type="button" className="active" data-lang="ja" hidden>概要</button>
              <button type="button" data-lang="en">Spectrum</button>
              <button type="button" data-lang="ko" hidden>스펙트럼</button>
              <button type="button" data-lang="ja" hidden>スペクトラム</button>
              <button type="button" data-lang="en">Motion</button>
              <button type="button" data-lang="ko" hidden>모션</button>
              <button type="button" data-lang="ja" hidden>モーション</button>
              <button type="button" data-lang="en">Export</button>
              <button type="button" data-lang="ko" hidden>내보내기</button>
              <button type="button" data-lang="ja" hidden>エクスポート</button>
            </div>
            <div className="tab-panel">
              <div className="tab-tile">
                <div className="tab-tile__head" data-lang="en">Hue Range</div>
                <div className="tab-tile__head" data-lang="ko" hidden>색상 범위</div>
                <div className="tab-tile__head" data-lang="ja" hidden>色相範囲</div>
                <div className="tab-tile__val">320° → 195°</div>
                <div className="tab-tile__delta" data-lang="en">covers magenta to cyan</div>
                <div className="tab-tile__delta" data-lang="ko" hidden>마젠타에서 시안까지</div>
                <div className="tab-tile__delta" data-lang="ja" hidden>マゼンタからシアンまで</div>
              </div>
              <div className="tab-tile">
                <div className="tab-tile__head" data-lang="en">Glass Layers</div>
                <div className="tab-tile__head" data-lang="ko" hidden>글래스 레이어</div>
                <div className="tab-tile__head" data-lang="ja" hidden>ガラスレイヤー</div>
                <div className="tab-tile__val">3 stacked</div>
                <div className="tab-tile__delta" data-lang="en">blur 40 / 20 / 14 px</div>
                <div className="tab-tile__delta" data-lang="ko" hidden>블러 40 / 20 / 14 px</div>
                <div className="tab-tile__delta" data-lang="ja" hidden>ブラー 40 / 20 / 14 px</div>
              </div>
              <div className="tab-tile">
                <div className="tab-tile__head" data-lang="en">Motion Loop</div>
                <div className="tab-tile__head" data-lang="ko" hidden>모션 루프</div>
                <div className="tab-tile__head" data-lang="ja" hidden>モーションループ</div>
                <div className="tab-tile__val">15.0s</div>
                <div className="tab-tile__delta" data-lang="en">infinite · ease-in-out</div>
                <div className="tab-tile__delta" data-lang="ko" hidden>무한 · ease-in-out</div>
                <div className="tab-tile__delta" data-lang="ja" hidden>無限 · ease-in-out</div>
              </div>
              <div className="tab-tile">
                <div className="tab-tile__head" data-lang="en">Asset Output</div>
                <div className="tab-tile__head" data-lang="ko" hidden>에셋 출력</div>
                <div className="tab-tile__head" data-lang="ja" hidden>アセット出力</div>
                <div className="tab-tile__val">SVG · WebM</div>
                <div className="tab-tile__delta" data-lang="en">vector + motion ready</div>
                <div className="tab-tile__delta" data-lang="ko" hidden>벡터 + 모션 준비 완료</div>
                <div className="tab-tile__delta" data-lang="ja" hidden>ベクター + モーション対応</div>
              </div>
            </div>
          </div>

          {/* Form Lab */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Glass Form Lab</h2>
              <h2 data-lang="ko" hidden>글래스 폼 랩</h2>
              <h2 data-lang="ja" hidden>ガラスフォームラボ</h2>
              <span className="section-sub" data-lang="en">input · select · toggle · slider</span>
              <span className="section-sub" data-lang="ko" hidden>입력 · 셀렉트 · 토글 · 슬라이더</span>
              <span className="section-sub" data-lang="ja" hidden>入力 · セレクト · トグル · スライダー</span>
            </div>
            <div className="form-lab">
              <div className="form-field">
                <span className="form-field__label" data-lang="en">Workspace name</span>
                <span className="form-field__label" data-lang="ko" hidden>워크스페이스 이름</span>
                <span className="form-field__label" data-lang="ja" hidden>ワークスペース名</span>
                <label className="holo-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={9} /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
                  <input type="text" defaultValue="aurora-studio" />
                </label>
              </div>
              <div className="form-field">
                <span className="form-field__label" data-lang="en">Search</span>
                <span className="form-field__label" data-lang="ko" hidden>검색</span>
                <span className="form-field__label" data-lang="ja" hidden>検索</span>
                <label className="holo-input">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" /></svg>
                  <input type="text" placeholder="Find a gradient preset…" />
                </label>
              </div>
              <div className="form-field">
                <span className="form-field__label" data-lang="en">Blend mode</span>
                <span className="form-field__label" data-lang="ko" hidden>블렌드 모드</span>
                <span className="form-field__label" data-lang="ja" hidden>ブレンドモード</span>
                <select className="holo-select" defaultValue="screen">
                  <option value="screen">Screen · luminous</option>
                  <option value="overlay">Overlay · vivid</option>
                  <option value="soft">Soft light · gentle</option>
                  <option value="dodge">Linear dodge · radiant</option>
                </select>
              </div>
              <div className="form-field">
                <span className="form-field__label" data-lang="en">Refraction</span>
                <span className="form-field__label" data-lang="ko" hidden>굴절</span>
                <span className="form-field__label" data-lang="ja" hidden>屈折</span>
                <div>
                  <div className="holo-slider">
                    <div className="holo-slider__track">
                      <div className="holo-slider__fill" />
                      <div className="holo-slider__thumb" />
                    </div>
                  </div>
                  <div className="holo-slider__values">
                    <span>0.0</span><span>0.65</span><span>1.0</span>
                  </div>
                </div>
              </div>
              <div className="form-field">
                <span className="form-field__label" data-lang="en">Switches</span>
                <span className="form-field__label" data-lang="ko" hidden>스위치</span>
                <span className="form-field__label" data-lang="ja" hidden>スイッチ</span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                  <span className="holo-toggle on">
                    <span className="holo-toggle__track"><span className="holo-toggle__thumb" /></span>
                    <span className="holo-toggle__caption" data-lang="en">Auto-iridescence</span>
                    <span className="holo-toggle__caption" data-lang="ko" hidden>자동 이리데센스</span>
                    <span className="holo-toggle__caption" data-lang="ja" hidden>自動イリデセンス</span>
                  </span>
                  <span className="holo-toggle">
                    <span className="holo-toggle__track"><span className="holo-toggle__thumb" /></span>
                    <span className="holo-toggle__caption" data-lang="en">Reduced motion</span>
                    <span className="holo-toggle__caption" data-lang="ko" hidden>모션 감소</span>
                    <span className="holo-toggle__caption" data-lang="ja" hidden>モーション削減</span>
                  </span>
                </div>
              </div>
              <div className="form-field">
                <span className="form-field__label" data-lang="en">Tags</span>
                <span className="form-field__label" data-lang="ko" hidden>태그</span>
                <span className="form-field__label" data-lang="ja" hidden>タグ</span>
                <div className="tag-cloud">
                  <span className="tag tag--active">aurora</span>
                  <span className="tag">iridescent</span>
                  <span className="tag">glass</span>
                  <span className="tag tag--active">fluid</span>
                  <span className="tag">prism</span>
                  <span className="tag">chroma</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="section-label" data-lang="en">Realtime Pulse</div>
          <div className="section-label" data-lang="ko" hidden>실시간 펄스</div>
          <div className="section-label" data-lang="ja" hidden>リアルタイムパルス</div>
          <div className="stats-grid" style={{marginBottom: 40}}>
            <div className="stat-card">
              <div className="stat-card__label" data-lang="en">Active palettes</div>
              <div className="stat-card__label" data-lang="ko" hidden>활성 팔레트</div>
              <div className="stat-card__label" data-lang="ja" hidden>アクティブパレット</div>
              <div className="stat-card__value">2,418</div>
              <div className="stat-card__delta stat-card__delta--up">▲ 12.8% · 24h</div>
              <div className="stat-card__spark">
                <span style={{height: '24%'}} /><span style={{height: '38%'}} /><span style={{height: '31%'}} />
                <span style={{height: '52%'}} /><span style={{height: '46%'}} /><span style={{height: '64%'}} />
                <span style={{height: '58%'}} /><span style={{height: '72%'}} /><span style={{height: '86%'}} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label" data-lang="en">Render time</div>
              <div className="stat-card__label" data-lang="ko" hidden>렌더 시간</div>
              <div className="stat-card__label" data-lang="ja" hidden>レンダリング時間</div>
              <div className="stat-card__value">38<small style={{fontSize: '1rem', opacity: 0.6, fontWeight: 300}}> ms</small></div>
              <div className="stat-card__delta stat-card__delta--up">▼ 6 ms · faster</div>
              <div className="stat-card__spark">
                <span style={{height: '78%'}} /><span style={{height: '64%'}} /><span style={{height: '58%'}} />
                <span style={{height: '48%'}} /><span style={{height: '52%'}} /><span style={{height: '42%'}} />
                <span style={{height: '34%'}} /><span style={{height: '38%'}} /><span style={{height: '28%'}} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label" data-lang="en">Hue coverage</div>
              <div className="stat-card__label" data-lang="ko" hidden>색상 커버리지</div>
              <div className="stat-card__label" data-lang="ja" hidden>色相カバレッジ</div>
              <div className="stat-card__value">87%</div>
              <div className="stat-card__delta">▲ 4 pts · this week</div>
              <div className="stat-card__spark">
                <span style={{height: '32%'}} /><span style={{height: '42%'}} /><span style={{height: '54%'}} />
                <span style={{height: '48%'}} /><span style={{height: '64%'}} /><span style={{height: '72%'}} />
                <span style={{height: '68%'}} /><span style={{height: '82%'}} /><span style={{height: '78%'}} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label" data-lang="en">Active sessions</div>
              <div className="stat-card__label" data-lang="ko" hidden>활성 세션</div>
              <div className="stat-card__label" data-lang="ja" hidden>アクティブセッション</div>
              <div className="stat-card__value">147</div>
              <div className="stat-card__delta stat-card__delta--down">▼ 3 · idle drop</div>
              <div className="stat-card__spark">
                <span style={{height: '62%'}} /><span style={{height: '74%'}} /><span style={{height: '82%'}} />
                <span style={{height: '78%'}} /><span style={{height: '88%'}} /><span style={{height: '72%'}} />
                <span style={{height: '66%'}} /><span style={{height: '58%'}} /><span style={{height: '48%'}} />
              </div>
            </div>
          </div>

          {/* Loaders + Badges */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Liquid Loaders</h2>
              <h2 data-lang="ko" hidden>리퀴드 로더</h2>
              <h2 data-lang="ja" hidden>リキッドローダー</h2>
              <span className="section-sub" data-lang="en">conic · pulse · wave · ripple</span>
              <span className="section-sub" data-lang="ko" hidden>코닉 · 펄스 · 웨이브 · 리플</span>
              <span className="section-sub" data-lang="ja" hidden>コニック · パルス · ウェーブ · リップル</span>
            </div>
            <div className="loader-rack">
              <div className="loader-cell">
                <div className="ld-ring" />
                <div className="loader-cell__label" data-lang="en">Prism ring</div>
                <div className="loader-cell__label" data-lang="ko" hidden>프리즘 링</div>
                <div className="loader-cell__label" data-lang="ja" hidden>プリズムリング</div>
              </div>
              <div className="loader-cell">
                <div className="ld-dots"><span /><span /><span /></div>
                <div className="loader-cell__label" data-lang="en">Bloom dots</div>
                <div className="loader-cell__label" data-lang="ko" hidden>블룸 도트</div>
                <div className="loader-cell__label" data-lang="ja" hidden>ブルームドット</div>
              </div>
              <div className="loader-cell">
                <div className="ld-wave"><span /><span /><span /><span /><span /></div>
                <div className="loader-cell__label" data-lang="en">Spectrum bars</div>
                <div className="loader-cell__label" data-lang="ko" hidden>스펙트럼 바</div>
                <div className="loader-cell__label" data-lang="ja" hidden>スペクトラムバー</div>
              </div>
              <div className="loader-cell">
                <div className="ld-ripple"><span /><span /></div>
                <div className="loader-cell__label" data-lang="en">Echo ripple</div>
                <div className="loader-cell__label" data-lang="ko" hidden>에코 리플</div>
                <div className="loader-cell__label" data-lang="ja" hidden>エコーリップル</div>
              </div>
            </div>
            <div style={{height: 24}} />
            <div className="section-header">
              <h2 style={{fontSize: '1.1rem'}} data-lang="en">Status Badges</h2>
              <h2 style={{fontSize: '1.1rem'}} data-lang="ko" hidden>상태 배지</h2>
              <h2 style={{fontSize: '1.1rem'}} data-lang="ja" hidden>ステータスバッジ</h2>
            </div>
            <div className="badge-row">
              <span className="holo-badge holo-badge--gradient holo-badge--dot" data-lang="en">Live</span>
              <span className="holo-badge holo-badge--gradient holo-badge--dot" data-lang="ko" hidden>실시간</span>
              <span className="holo-badge holo-badge--gradient holo-badge--dot" data-lang="ja" hidden>ライブ</span>
              <span className="holo-badge holo-badge--neon" data-lang="en">New</span>
              <span className="holo-badge holo-badge--neon" data-lang="ko" hidden>NEW</span>
              <span className="holo-badge holo-badge--neon" data-lang="ja" hidden>NEW</span>
              <span className="holo-badge holo-badge--glass" data-lang="en">Beta</span>
              <span className="holo-badge holo-badge--glass" data-lang="ko" hidden>베타</span>
              <span className="holo-badge holo-badge--glass" data-lang="ja" hidden>ベータ</span>
              <span className="holo-badge holo-badge--coral" data-lang="en">Pro · Premium</span>
              <span className="holo-badge holo-badge--coral" data-lang="ko" hidden>프로 · 프리미엄</span>
              <span className="holo-badge holo-badge--coral" data-lang="ja" hidden>プロ · プレミアム</span>
              <span className="holo-badge holo-badge--glass">v2.4.0</span>
              <span className="holo-badge holo-badge--gradient" data-lang="en">Holographic ✦</span>
              <span className="holo-badge holo-badge--gradient" data-lang="ko" hidden>홀로그래픽 ✦</span>
              <span className="holo-badge holo-badge--gradient" data-lang="ja" hidden>ホログラフィック ✦</span>
            </div>
          </div>

          {/* Color Mix */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Gradient Mix Lab</h2>
              <h2 data-lang="ko" hidden>그라데이션 믹스 랩</h2>
              <h2 data-lang="ja" hidden>グラデーションミックスラボ</h2>
              <span className="section-sub" data-lang="en">curated blends from the spectrum</span>
              <span className="section-sub" data-lang="ko" hidden>스펙트럼 큐레이션 블렌드</span>
              <span className="section-sub" data-lang="ja" hidden>スペクトラムキュレーションブレンド</span>
            </div>
            <div className="color-mix">
              <div className="mix-swatch mix-swatch--sunrise">
                <div className="mix-swatch__name" data-lang="en">Sunrise Wash</div>
                <div className="mix-swatch__name" data-lang="ko" hidden>선라이즈 워시</div>
                <div className="mix-swatch__name" data-lang="ja" hidden>サンライズウォッシュ</div>
                <div className="mix-swatch__code">#ff7eb3 → #ff758c · 135°</div>
              </div>
              <div className="mix-swatch mix-swatch--lagoon">
                <div className="mix-swatch__name" data-lang="en">Lagoon Drift</div>
                <div className="mix-swatch__name" data-lang="ko" hidden>라군 드리프트</div>
                <div className="mix-swatch__name" data-lang="ja" hidden>ラグーンドリフト</div>
                <div className="mix-swatch__code">#4facfe → #00f2fe · 135°</div>
              </div>
              <div className="mix-swatch mix-swatch--spectrum">
                <div className="mix-swatch__name" data-lang="en">Full Spectrum</div>
                <div className="mix-swatch__name" data-lang="ko" hidden>풀 스펙트럼</div>
                <div className="mix-swatch__name" data-lang="ja" hidden>フルスペクトラム</div>
                <div className="mix-swatch__code">c1 → c2 → c3 → c4 · 135°</div>
              </div>
              <div className="mix-swatch mix-swatch--violet">
                <div className="mix-swatch__name" data-lang="en">Violet Channel</div>
                <div className="mix-swatch__name" data-lang="ko" hidden>바이올렛 채널</div>
                <div className="mix-swatch__name" data-lang="ja" hidden>バイオレットチャンネル</div>
                <div className="mix-swatch__code">#ff7eb3 → #4facfe · 135°</div>
              </div>
            </div>
          </div>

          {/* Live Session */}
          <div className="section-label" data-lang="en">Now Streaming</div>
          <div className="section-label" data-lang="ko" hidden>지금 스트리밍 중</div>
          <div className="section-label" data-lang="ja" hidden>ストリーミング中</div>
          <div className="live-grid" style={{marginBottom: 40}}>
            <div className="live-card">
              <h3 className="live-card__title" data-lang="en">Aurora Sessions · 24/7</h3>
              <h3 className="live-card__title" data-lang="ko" hidden>오로라 세션 · 24/7</h3>
              <h3 className="live-card__title" data-lang="ja" hidden>オーロラセッション · 24/7</h3>
              <div className="live-card__meta" data-lang="en">Ambient · Chromatic · 432 Hz blend</div>
              <div className="live-card__meta" data-lang="ko" hidden>앰비언트 · 크로마틱 · 432 Hz 블렌드</div>
              <div className="live-card__meta" data-lang="ja" hidden>アンビエント · クロマティック · 432 Hz ブレンド</div>
              <div className="audio-viz" aria-hidden="true">
                {[0,0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.45,0.3,0.18,0.08,0.22,0.35,0.52,0.4,0.28,0.12,0.04].map((d, i) => (
                  <span key={i} style={{animationDelay: `${d}s`}} />
                ))}
              </div>
              <div className="now-playing">
                <span className="track-name" data-lang="en">▸ Refraction in C minor — Luma Field</span>
                <span className="track-name" data-lang="ko" hidden>▸ 굴절 C단조 — 루마 필드</span>
                <span className="track-name" data-lang="ja" hidden>▸ 屈折 ハ短調 — ルマ・フィールド</span>
                <span className="track-meta">04:21 / 06:48</span>
              </div>
            </div>
            <div className="live-card">
              <h3 className="live-card__title" data-lang="en">Listening together</h3>
              <h3 className="live-card__title" data-lang="ko" hidden>함께 듣는 중</h3>
              <h3 className="live-card__title" data-lang="ja" hidden>一緒に再生中</h3>
              <div className="live-card__meta" data-lang="en">4 friends · 143 others</div>
              <div className="live-card__meta" data-lang="ko" hidden>친구 4명 · 다른 143명</div>
              <div className="live-card__meta" data-lang="ja" hidden>友達 4人 · 他 143人</div>
              <div className="avatar-cluster">
                <div className="av" />
                <div className="av" />
                <div className="av" />
                <div className="av" />
                <div className="av av--more">+143</div>
              </div>
              <ul className="listener-list">
                <li>
                  <span className="listener-dot" style={{background: 'var(--c1)', color: 'var(--c1)'}} />
                  <span data-lang="en">Mira · Seoul</span>
                  <span data-lang="ko" hidden>미라 · 서울</span>
                  <span data-lang="ja" hidden>ミラ · ソウル</span>
                  <span className="listener-meta">98 ms</span>
                </li>
                <li>
                  <span className="listener-dot" style={{background: 'var(--c3)', color: 'var(--c3)'}} />
                  <span data-lang="en">Theo · Lisbon</span>
                  <span data-lang="ko" hidden>테오 · 리스본</span>
                  <span data-lang="ja" hidden>テオ · リスボン</span>
                  <span className="listener-meta">142 ms</span>
                </li>
                <li>
                  <span className="listener-dot" style={{background: 'var(--c4)', color: 'var(--c4)'}} />
                  <span data-lang="en">Yuna · Tokyo</span>
                  <span data-lang="ko" hidden>유나 · 도쿄</span>
                  <span data-lang="ja" hidden>ユナ · 東京</span>
                  <span className="listener-meta">76 ms</span>
                </li>
                <li>
                  <span className="listener-dot" style={{background: 'var(--c2)', color: 'var(--c2)'}} />
                  <span data-lang="en">Aris · Athens</span>
                  <span data-lang="ko" hidden>아리스 · 아테네</span>
                  <span data-lang="ja" hidden>アリス · アテネ</span>
                  <span className="listener-meta">188 ms</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Toasts */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Iridescent Toasts</h2>
              <h2 data-lang="ko" hidden>이리데센트 토스트</h2>
              <h2 data-lang="ja" hidden>イリデセントトースト</h2>
              <span className="section-sub" data-lang="en">notification · success · warn</span>
              <span className="section-sub" data-lang="ko" hidden>알림 · 성공 · 경고</span>
              <span className="section-sub" data-lang="ja" hidden>通知 · 成功 · 警告</span>
            </div>
            <div className="notification-stack">
              <div className="holo-toast">
                <div className="holo-toast__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ff9bc7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                </div>
                <div className="holo-toast__body">
                  <div className="holo-toast__title" data-lang="en">New gradient shared</div>
                  <div className="holo-toast__title" data-lang="ko" hidden>새 그라데이션 공유됨</div>
                  <div className="holo-toast__title" data-lang="ja" hidden>新しいグラデーションが共有されました</div>
                  <div className="holo-toast__msg" data-lang="en">Mira just published "Lagoon Drift" to your shared workspace.</div>
                  <div className="holo-toast__msg" data-lang="ko" hidden>미라가 방금 공유 워크스페이스에 "라군 드리프트"를 게시했습니다.</div>
                  <div className="holo-toast__msg" data-lang="ja" hidden>ミラが共有ワークスペースに「ラグーン・ドリフト」を公開しました。</div>
                </div>
                <span className="holo-toast__time">just now</span>
                <button type="button" className="holo-toast__close" aria-label="Dismiss">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
                </button>
              </div>
              <div className="holo-toast holo-toast--success">
                <div className="holo-toast__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#7df0ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <div className="holo-toast__body">
                  <div className="holo-toast__title" data-lang="en">Export complete</div>
                  <div className="holo-toast__title" data-lang="ko" hidden>내보내기 완료</div>
                  <div className="holo-toast__title" data-lang="ja" hidden>エクスポート完了</div>
                  <div className="holo-toast__msg" data-lang="en">12 SVG layers and 1 motion preview rendered in 1.8 s.</div>
                  <div className="holo-toast__msg" data-lang="ko" hidden>SVG 레이어 12개와 모션 미리보기 1개를 1.8초 만에 렌더링했습니다.</div>
                  <div className="holo-toast__msg" data-lang="ja" hidden>12個のSVGレイヤーと1つのモーションプレビューを1.8秒でレンダリングしました。</div>
                </div>
                <span className="holo-toast__time">2m</span>
                <button type="button" className="holo-toast__close" aria-label="Dismiss">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
                </button>
              </div>
              <div className="holo-toast holo-toast--warn">
                <div className="holo-toast__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ffbecb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1={12} y1={9} x2={12} y2={13} /><line x1={12} y1={17} x2={12.01} y2={17} /></svg>
                </div>
                <div className="holo-toast__body">
                  <div className="holo-toast__title" data-lang="en">Reduced motion detected</div>
                  <div className="holo-toast__title" data-lang="ko" hidden>모션 감소 감지됨</div>
                  <div className="holo-toast__title" data-lang="ja" hidden>モーション削減を検出</div>
                  <div className="holo-toast__msg" data-lang="en">Fluid animations paused to respect your system preferences.</div>
                  <div className="holo-toast__msg" data-lang="ko" hidden>시스템 설정에 따라 플루이드 애니메이션을 일시 정지했습니다.</div>
                  <div className="holo-toast__msg" data-lang="ja" hidden>システム設定に従ってフルイドアニメーションを一時停止しました。</div>
                </div>
                <span className="holo-toast__time">12m</span>
                <button type="button" className="holo-toast__close" aria-label="Dismiss">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="section-label" style={{textAlign: 'center'}} data-lang="en">Plan Spectrum</div>
          <div className="section-label" style={{textAlign: 'center'}} data-lang="ko" hidden>플랜 스펙트럼</div>
          <div className="section-label" style={{textAlign: 'center'}} data-lang="ja" hidden>プランスペクトラム</div>
          <div className="pricing-grid" style={{marginBottom: 40}}>
            <div className="price-card">
              <div className="price-card__plan" data-lang="en">Spark</div>
              <div className="price-card__plan" data-lang="ko" hidden>스파크</div>
              <div className="price-card__plan" data-lang="ja" hidden>スパーク</div>
              <div className="price-card__price">$0<small> / mo</small></div>
              <p className="price-card__desc" data-lang="en">A taste of the spectrum. Sample gradients with watermark export.</p>
              <p className="price-card__desc" data-lang="ko" hidden>스펙트럼 맛보기. 워터마크가 들어간 내보내기로 그라데이션을 가볍게 써볼 수 있습니다.</p>
              <p className="price-card__desc" data-lang="ja" hidden>スペクトラムを体験。透かし付きエクスポートでグラデーションを試せます。</p>
              <ul className="price-card__features">
                <li data-lang="en">12 starter palettes</li>
                <li data-lang="ko" hidden>시작 팔레트 12개</li>
                <li data-lang="ja" hidden>スターターパレット 12個</li>
                <li data-lang="en">PNG export · watermarked</li>
                <li data-lang="ko" hidden>PNG 내보내기 · 워터마크</li>
                <li data-lang="ja" hidden>PNGエクスポート · 透かし入り</li>
                <li data-lang="en">Community gallery</li>
                <li data-lang="ko" hidden>커뮤니티 갤러리</li>
                <li data-lang="ja" hidden>コミュニティギャラリー</li>
              </ul>
              <button type="button" className="price-btn" data-lang="en">Start free</button>
              <button type="button" className="price-btn" data-lang="ko" hidden>무료로 시작</button>
              <button type="button" className="price-btn" data-lang="ja" hidden>無料で始める</button>
            </div>
            <div className="price-card price-card--featured">
              <span className="price-card__badge" data-lang="en">Popular</span>
              <span className="price-card__badge" data-lang="ko" hidden>인기</span>
              <span className="price-card__badge" data-lang="ja" hidden>人気</span>
              <div className="price-card__plan" data-lang="en">Prism</div>
              <div className="price-card__plan" data-lang="ko" hidden>프리즘</div>
              <div className="price-card__plan" data-lang="ja" hidden>プリズム</div>
              <div className="price-card__price">$18<small> / mo</small></div>
              <p className="price-card__desc" data-lang="en">Full iridescent toolkit. Live motion, SVG export, team sync.</p>
              <p className="price-card__desc" data-lang="ko" hidden>완전한 이리데센트 툴킷. 실시간 모션, SVG 내보내기, 팀 동기화.</p>
              <p className="price-card__desc" data-lang="ja" hidden>完全なイリデセントツールキット。ライブモーション、SVGエクスポート、チーム同期。</p>
              <ul className="price-card__features">
                <li data-lang="en">Unlimited palettes</li>
                <li data-lang="ko" hidden>무제한 팔레트</li>
                <li data-lang="ja" hidden>無制限パレット</li>
                <li data-lang="en">SVG · WebM · CSS export</li>
                <li data-lang="ko" hidden>SVG · WebM · CSS 내보내기</li>
                <li data-lang="ja" hidden>SVG · WebM · CSS エクスポート</li>
                <li data-lang="en">Motion presets · 24</li>
                <li data-lang="ko" hidden>모션 프리셋 · 24개</li>
                <li data-lang="ja" hidden>モーションプリセット · 24個</li>
                <li data-lang="en">3 seat team workspace</li>
                <li data-lang="ko" hidden>3인 팀 워크스페이스</li>
                <li data-lang="ja" hidden>3席チームワークスペース</li>
              </ul>
              <button type="button" className="price-btn" data-lang="en">Try Prism · 14 days free</button>
              <button type="button" className="price-btn" data-lang="ko" hidden>프리즘 시작 · 14일 무료</button>
              <button type="button" className="price-btn" data-lang="ja" hidden>プリズムを試す · 14日間無料</button>
            </div>
            <div className="price-card">
              <div className="price-card__plan" data-lang="en">Aurora</div>
              <div className="price-card__plan" data-lang="ko" hidden>오로라</div>
              <div className="price-card__plan" data-lang="ja" hidden>オーロラ</div>
              <div className="price-card__price">$48<small> / mo</small></div>
              <p className="price-card__desc" data-lang="en">For studios. Unlimited seats, custom hue tokens, priority render farm.</p>
              <p className="price-card__desc" data-lang="ko" hidden>스튜디오용. 무제한 좌석, 커스텀 색상 토큰, 우선 렌더 팜.</p>
              <p className="price-card__desc" data-lang="ja" hidden>スタジオ向け。無制限の席、カスタム色相トークン、優先レンダーファーム。</p>
              <ul className="price-card__features">
                <li data-lang="en">Everything in Prism</li>
                <li data-lang="ko" hidden>프리즘의 모든 기능</li>
                <li data-lang="ja" hidden>プリズムの全機能</li>
                <li data-lang="en">Unlimited team seats</li>
                <li data-lang="ko" hidden>무제한 팀 좌석</li>
                <li data-lang="ja" hidden>無制限のチーム席</li>
                <li data-lang="en">Custom hue tokens</li>
                <li data-lang="ko" hidden>커스텀 색상 토큰</li>
                <li data-lang="ja" hidden>カスタム色相トークン</li>
                <li data-lang="en">Priority render queue</li>
                <li data-lang="ko" hidden>우선 렌더 큐</li>
                <li data-lang="ja" hidden>優先レンダーキュー</li>
              </ul>
              <button type="button" className="price-btn" data-lang="en">Contact sales</button>
              <button type="button" className="price-btn" data-lang="ko" hidden>영업팀 문의</button>
              <button type="button" className="price-btn" data-lang="ja" hidden>営業に問い合わせ</button>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-panel">
            <div className="section-header">
              <h2 data-lang="en">Spectrum Roadmap</h2>
              <h2 data-lang="ko" hidden>스펙트럼 로드맵</h2>
              <h2 data-lang="ja" hidden>スペクトラムロードマップ</h2>
              <span className="section-sub" data-lang="en">4 milestones · live progress</span>
              <span className="section-sub" data-lang="ko" hidden>마일스톤 4개 · 실시간 진행</span>
              <span className="section-sub" data-lang="ja" hidden>マイルストーン 4個 · ライブ進行</span>
            </div>
            <div className="timeline">
              <div className="timeline-item timeline-item--done">
                <div className="timeline-item__date">2025 · Q3</div>
                <div className="timeline-item__title" data-lang="en">Mesh Engine v1 launched</div>
                <div className="timeline-item__title" data-lang="ko" hidden>매시 엔진 v1 출시</div>
                <div className="timeline-item__title" data-lang="ja" hidden>メッシュエンジン v1 リリース</div>
                <div className="timeline-item__body" data-lang="en">WebGL-powered fluid orbs · 60 fps on M-series · 12 KB runtime.</div>
                <div className="timeline-item__body" data-lang="ko" hidden>WebGL 기반 플루이드 오브 · M 시리즈에서 60fps · 12KB 런타임.</div>
                <div className="timeline-item__body" data-lang="ja" hidden>WebGL駆動のフルイドオーブ · Mシリーズで60fps · 12KBランタイム。</div>
              </div>
              <div className="timeline-item timeline-item--done">
                <div className="timeline-item__date">2026 · Q1</div>
                <div className="timeline-item__title" data-lang="en">Iridescent palette tokens</div>
                <div className="timeline-item__title" data-lang="ko" hidden>이리데센트 팔레트 토큰</div>
                <div className="timeline-item__title" data-lang="ja" hidden>イリデセントパレットトークン</div>
                <div className="timeline-item__body" data-lang="en">Variable hue rotation · CSS @property animations · Figma plugin.</div>
                <div className="timeline-item__body" data-lang="ko" hidden>가변 색상 회전 · CSS @property 애니메이션 · 피그마 플러그인.</div>
                <div className="timeline-item__body" data-lang="ja" hidden>可変色相回転 · CSS @property アニメーション · Figmaプラグイン。</div>
              </div>
              <div className="timeline-item timeline-item--live">
                <div className="timeline-item__date">2026 · Q2 · now</div>
                <div className="timeline-item__title" data-lang="en">Realtime co-editing</div>
                <div className="timeline-item__title" data-lang="ko" hidden>실시간 공동 편집</div>
                <div className="timeline-item__title" data-lang="ja" hidden>リアルタイム共同編集</div>
                <div className="timeline-item__body" data-lang="en">Cursor presence, hue-locked layers and CRDT-based gradient sync.</div>
                <div className="timeline-item__body" data-lang="ko" hidden>커서 프레즌스, 색상 잠금 레이어, CRDT 기반 그라데이션 동기화.</div>
                <div className="timeline-item__body" data-lang="ja" hidden>カーソルプレゼンス、色相ロックレイヤー、CRDTベースのグラデーション同期。</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-item__date">2026 · Q4</div>
                <div className="timeline-item__title" data-lang="en">Spatial holography preview</div>
                <div className="timeline-item__title" data-lang="ko" hidden>공간 홀로그래피 프리뷰</div>
                <div className="timeline-item__title" data-lang="ja" hidden>空間ホログラフィプレビュー</div>
                <div className="timeline-item__body" data-lang="en">visionOS support · depth-aware iridescence · WebXR scene export.</div>
                <div className="timeline-item__body" data-lang="ko" hidden>visionOS 지원 · 깊이 인식 이리데센스 · WebXR 씬 내보내기.</div>
                <div className="timeline-item__body" data-lang="ja" hidden>visionOSサポート · 深度認識イリデセンス · WebXRシーンエクスポート。</div>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div style={{marginBottom: 40}}>
            <div className="section-header" style={{padding: '0 4px 4px'}}>
              <h2 data-lang="en">CSS Token Recipe</h2>
              <h2 data-lang="ko" hidden>CSS 토큰 레시피</h2>
              <h2 data-lang="ja" hidden>CSS トークンレシピ</h2>
              <span className="section-sub">holographic-fluid.css</span>
            </div>
            <div className="holo-code">
              <div className="holo-code__header">
                <div className="holo-code__dots"><span /><span /><span /></div>
                <span className="holo-code__title">holographic-fluid.css</span>
              </div>
              <pre>
<span className="tk-cm">{`/* Iridescent spectrum · ${palette.name} · 4 core hues */`}</span>{`\n`}
<span className="tk-key">:root</span>{` {\n  `}
<span className="tk-prop">--c1</span>{`: `}<span className="tk-val">{palette.c1}</span>{`;\n  `}
<span className="tk-prop">--c2</span>{`: `}<span className="tk-val">{palette.c2}</span>{`;\n  `}
<span className="tk-prop">--c3</span>{`: `}<span className="tk-val">{palette.c3}</span>{`;\n  `}
<span className="tk-prop">--c4</span>{`: `}<span className="tk-val">{palette.c4}</span>{`;\n}\n\n`}
<span className="tk-cm">{`/* Fluid orb · 15s continuous mesh */`}</span>{`\n`}
<span className="tk-key">.fluid-bg</span>{` {\n  `}
<span className="tk-prop">background</span>{`:\n    `}
<span className="tk-fn">radial-gradient</span>{`(circle at 10% 20%, `}<span className="tk-val">var(--c1)</span>{` 0%, transparent 50%),\n    `}
<span className="tk-fn">radial-gradient</span>{`(circle at 80% 80%, `}<span className="tk-val">var(--c3)</span>{` 0%, transparent 50%),\n    `}
<span className="tk-fn">radial-gradient</span>{`(circle at 50% 50%, `}<span className="tk-val">var(--c2)</span>{` 0%, transparent 50%);\n  `}
<span className="tk-prop">filter</span>{`: `}<span className="tk-fn">blur</span>{`(`}<span className="tk-val">80px</span>{`);\n  `}
<span className="tk-prop">animation</span>{`: fluid `}<span className="tk-val">15s</span>{` infinite alternate ease-in-out;\n}\n\n`}
<span className="tk-key">@keyframes</span>{` `}<span className="tk-fn">fluid</span>{` {\n  `}
<span className="tk-str">0%</span>{`   { `}<span className="tk-prop">transform</span>{`: `}<span className="tk-fn">scale</span>{`(1) `}<span className="tk-fn">rotate</span>{`(0deg); }\n  `}
<span className="tk-str">50%</span>{`  { `}<span className="tk-prop">transform</span>{`: `}<span className="tk-fn">scale</span>{`(1.2) `}<span className="tk-fn">rotate</span>{`(15deg); }\n  `}
<span className="tk-str">100%</span>{` { `}<span className="tk-prop">transform</span>{`: `}<span className="tk-fn">scale</span>{`(0.9) `}<span className="tk-fn">rotate</span>{`(-10deg); }\n}`}
              </pre>
            </div>
          </div>

          <section className="prompt">
            <h2 style={{margin: '0 0 10px', fontWeight: 500}} data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">{`Design a landing page in Holographic Fluid style — restrained iridescent gradients on a deep dark canvas. The dreamy mood comes from gentle color drift, NOT from full-strength saturated orbs.

PALETTE: ${palette.name} (${palette.c1.toUpperCase()} · ${palette.c2.toUpperCase()} · ${palette.c3.toUpperCase()} · ${palette.c4.toUpperCase()})

COLOR TOKENS:
--c1: ${palette.c1}
--c2: ${palette.c2}
--c3: ${palette.c3}
--c4: ${palette.c4}
--text: #ffffff
--muted: rgba(255,255,255,0.62)
--bg: #0b0f19
--panel-scrim: rgba(11, 15, 25, 0.45)   /* dark scrim layered UNDER the glass tint so body text stays legible over the orbs */
--panel-tint: rgba(255,255,255,0.04)
--panel-border: rgba(255,255,255,0.10)
--hairline: rgba(255,255,255,0.05)
--card-gradient: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))
No other colors.

READABILITY RULES (most important):
- Background orbs use opacity 0.32, NOT 0.6. They are atmosphere, not chrome.
- Each radial-gradient stops at \`transparent 45%\` (tight orb, no full-canvas wash).
- Every glass panel layers panel-scrim under panel-tint so text gets contrast without losing iridescence.
- backdrop-filter blur stays modest: 28px on hero, 18px on glass panels. Avoid 40px+.
- Body copy color is solid #fff at 0.9 opacity. Never put 0.6-opacity body text over the orbs.

TYPOGRAPHY:
Heading: Outfit 700, tracking -0.03em, line-height 1.1
Body: Outfit 300, line-height 1.6
Scale: 0.78rem / 0.9rem / 1.2rem / clamp(3rem, 7vw, 6rem)
Title text effect: linear-gradient(to right, #fff, rgba(255,255,255,0.5)) with background-clip text
NO gradient body text. Only the hero H1 gets the gradient fill.

UI:
- Hero panel: border-radius 40px, border 1px solid var(--panel-border), background var(--panel-scrim) layered over var(--panel-tint), backdrop-filter blur(28px), inset 0 1px 0 rgba(255,255,255,0.2), drop shadow 0 30px 60px rgba(0,0,0,0.3).
- Glass panels: border-radius 24-28px, same scrim+tint recipe, backdrop-filter blur(18px), 1px solid var(--hairline).
- Cards (prism-card): rgba(255,255,255,0.04) base, gradient border drawn via mask: linear-gradient(135deg, var(--c1), var(--c2)) (or c2→c3, c3→c4 — cycling).
- Prompt box: border-radius 24px, rgba(0,0,0,0.4), 1px solid var(--hairline).
- Copy button: #fff bg, #000 text, border-radius 20px, padding 10px 20px.

PALETTE SWITCHER (this is a defining feature):
Pill-shaped chip row at top of page. Each chip shows a 4-stop micro spectrum of its palette (--c1..--c4 as adjacent swatches) + its uppercase name (e.g. ${palette.name}). Active chip gets a 1px solid var(--c1) border and a soft outer glow 0 0 18px rgba(var(--c1-rgb), 0.32). Pressing a chip swaps all four CSS vars; orbs, spectrum bar, prism-card borders, and the prompt all retint in <500ms.

LAYOUT:
Container: width min(1080px, 92vw), padding 30px 0 78px
Hero: padding 60px (30px on mobile)
Cards grid: grid, repeat(auto-fit, minmax(240px, 1fr)), gap 24px
Lead paragraph: max-width 600px, font-weight 300

MOTION:
Background orbs: 3 radial-gradients (at 10% 20% with --c1, 80% 80% with --c3, 50% 50% with --c2), filter blur(80px), opacity 0.32.
@keyframes fluid — 0% scale(1) rotate(0deg), 50% scale(1.2) rotate(15deg), 100% scale(0.9) rotate(-10deg). 15s infinite alternate ease-in-out.
Hero entrance: fadeIn 1s, from translateY(20px) opacity 0 to translateY(0) opacity 1.
Card hover: transform/box-shadow 0.3s. No bouncy springs.
Palette swap: transition --c1..--c4 via CSS color animation (use color-mix in the few spots that need it) for ~400ms.
Respect prefers-reduced-motion: pause the fluid orb keyframe.

FORBIDDEN:
- Background orb opacity above 0.4 — kills body legibility.
- backdrop-filter blur(40px) or higher on glass panels.
- Body text under 0.85 opacity over orbs.
- Sharp corners on hero or cards (minimum 24px radius).
- Light/white page backgrounds.
- Static backgrounds — orbs must drift, but slowly.

OUTPUT:
1) Full color token list using palette ${palette.name}.
2) Palette switcher row with all 4 swatch chips + active state.
3) Hero / Prism Cards / Property Meters / Color Orbs / Prompt section structure.
4) Single-file HTML/CSS with fluid orb animation, fadeIn keyframes, and prefers-reduced-motion guard.`}</pre>
            <pre data-lang="ko" hidden>{`홀로그래픽 플루이드 스타일의 랜딩 페이지를 디자인해줘 — 깊은 다크 캔버스 위에 절제된 무지갯빛 그라데이션. 몽환적인 분위기는 채도 100%의 오브가 아니라 부드러운 색 흐름에서 나와야 한다.

팔레트: ${palette.name} (${palette.c1.toUpperCase()} · ${palette.c2.toUpperCase()} · ${palette.c3.toUpperCase()} · ${palette.c4.toUpperCase()})

색상 토큰:
--c1: ${palette.c1}
--c2: ${palette.c2}
--c3: ${palette.c3}
--c4: ${palette.c4}
--text: #ffffff
--muted: rgba(255,255,255,0.62)
--bg: #0b0f19
--panel-scrim: rgba(11, 15, 25, 0.45)   /* 글래스 틴트 아래에 까는 다크 스크림 — 오브 위에서도 본문이 읽히게 함 */
--panel-tint: rgba(255,255,255,0.04)
--panel-border: rgba(255,255,255,0.10)
--hairline: rgba(255,255,255,0.05)
--card-gradient: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))
다른 색상 사용 금지.

가독성 원칙 (가장 중요):
- 배경 오브는 opacity 0.32. 0.6 금지. 오브는 분위기이지 크롬이 아니다.
- 각 radial-gradient는 \`transparent 45%\`에서 끊는다. 전체 화면 색 범람 금지.
- 모든 글래스 패널은 panel-tint 아래에 panel-scrim을 깐다. 그래야 이리데센스를 유지하면서도 본문이 읽힌다.
- backdrop-filter blur는 절제: 히어로 28px, 글래스 패널 18px. 40px 이상 금지.
- 본문 텍스트는 #fff opacity 0.9. 오브 위에 0.6 opacity 본문 금지.

타이포그래피:
제목: Outfit 700, tracking -0.03em, line-height 1.1
본문: Outfit 300, line-height 1.6
스케일: 0.78rem / 0.9rem / 1.2rem / clamp(3rem, 7vw, 6rem)
타이틀 텍스트 효과: linear-gradient(to right, #fff, rgba(255,255,255,0.5)) + background-clip text
본문에 gradient text 금지. 히어로 H1에만 gradient fill 사용.

UI:
- 히어로 패널: border-radius 40px, 1px solid var(--panel-border), 배경은 panel-scrim 위에 panel-tint, backdrop-filter blur(28px), inset 0 1px 0 rgba(255,255,255,0.2), drop-shadow 0 30px 60px rgba(0,0,0,0.3).
- 글래스 패널: border-radius 24-28px, 동일한 scrim+tint 레시피, backdrop-filter blur(18px), 1px solid var(--hairline).
- 카드(prism-card): rgba(255,255,255,0.04) 베이스, mask 기법으로 그라데이션 보더 (linear-gradient(135deg, var(--c1), var(--c2)) — c2→c3, c3→c4로 순환).
- 프롬프트 박스: border-radius 24px, rgba(0,0,0,0.4), 1px solid var(--hairline).
- 복사 버튼: #fff 배경, #000 텍스트, border-radius 20px, padding 10px 20px.

팔레트 스위처 (핵심 기능):
페이지 상단에 알약 모양 칩 줄. 각 칩에는 해당 팔레트의 4색 미니 스펙트럼(--c1..--c4 인접 스워치)과 대문자 이름(예: ${palette.name})이 들어간다. 활성 칩에는 1px solid var(--c1) 보더와 부드러운 외부 글로우 0 0 18px rgba(var(--c1-rgb), 0.32). 칩을 누르면 4개 CSS 변수 전체가 교체되어 오브 / 스펙트럼 바 / 프리즘 카드 보더 / 프롬프트의 톤이 500ms 안에 함께 바뀐다.

레이아웃:
컨테이너: width min(1080px, 92vw), padding 30px 0 78px
히어로: padding 60px (모바일 30px)
카드 그리드: grid, repeat(auto-fit, minmax(240px, 1fr)), gap 24px
리드 문단: max-width 600px, font-weight 300

모션:
배경 오브: radial-gradient 3개 (10% 20%에 --c1, 80% 80%에 --c3, 50% 50%에 --c2), filter blur(80px), opacity 0.32.
@keyframes fluid — 0% scale(1) rotate(0deg), 50% scale(1.2) rotate(15deg), 100% scale(0.9) rotate(-10deg). 15s infinite alternate ease-in-out.
히어로 등장: fadeIn 1s, translateY(20px) opacity 0 → translateY(0) opacity 1.
카드 호버: transform / box-shadow 0.3s. 튀는 스프링 금지.
팔레트 교체: --c1..--c4를 ~400ms color transition. prefers-reduced-motion에서는 오브 키프레임 일시정지.

금지:
- 배경 오브 opacity 0.4 초과 — 본문 가독성 파괴.
- 글래스 패널에 backdrop-filter blur(40px) 이상 사용.
- 오브 위 본문 opacity 0.85 미만.
- 히어로/카드의 날카로운 모서리 (최소 24px radius).
- 밝거나 흰색 페이지 배경.
- 정지 배경 — 오브는 천천히라도 반드시 움직임.

출력:
1) 팔레트 ${palette.name} 기준 전체 색상 토큰 목록.
2) 4개 스워치 칩이 들어간 팔레트 스위처 줄 + active 상태.
3) Hero / Prism Cards / Property Meters / Color Orbs / Prompt 섹션 구조.
4) fluid 오브 애니메이션과 fadeIn 키프레임, prefers-reduced-motion 가드 포함 단일 파일 HTML/CSS.`}</pre>
            <pre data-lang="ja" hidden>{`ホログラフィックフルイドスタイルのランディングページをデザインしてください — 深いダークキャンバスの上に抑制された虹色グラデーション。夢幻的なムードは飽和したオーブからではなく、穏やかな色のドリフトから生まれる。

パレット: ${palette.name} (${palette.c1.toUpperCase()} · ${palette.c2.toUpperCase()} · ${palette.c3.toUpperCase()} · ${palette.c4.toUpperCase()})

カラートークン:
--c1: ${palette.c1}
--c2: ${palette.c2}
--c3: ${palette.c3}
--c4: ${palette.c4}
--text: #ffffff
--muted: rgba(255,255,255,0.62)
--bg: #0b0f19
--panel-scrim: rgba(11, 15, 25, 0.45)   /* ガラスティントの下に敷くダークスクリム — オーブの上でも本文が読める */
--panel-tint: rgba(255,255,255,0.04)
--panel-border: rgba(255,255,255,0.10)
--hairline: rgba(255,255,255,0.05)
--card-gradient: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))
他の色は使用禁止。

可読性ルール（最重要）:
- 背景オーブは opacity 0.32。0.6は禁止。オーブは雰囲気であってクロームではない。
- 各 radial-gradient は \`transparent 45%\` で止める。全画面の色氾濫は禁止。
- すべてのガラスパネルは panel-tint の下に panel-scrim を敷く。これでイリデセンスを保ちつつ本文が読める。
- backdrop-filter blur は控えめ：ヒーロー 28px、ガラスパネル 18px。40px 以上禁止。
- 本文テキストは #fff opacity 0.9。オーブ上に opacity 0.6 の本文は禁止。

タイポグラフィ:
見出し: Outfit 700, tracking -0.03em, line-height 1.1
本文: Outfit 300, line-height 1.6
スケール: 0.78rem / 0.9rem / 1.2rem / clamp(3rem, 7vw, 6rem)
タイトルテキスト効果: linear-gradient(to right, #fff, rgba(255,255,255,0.5)) + background-clip text
本文にグラデーションテキスト禁止。ヒーロー H1 のみ gradient fill。

UI:
- ヒーローパネル: border-radius 40px, 1px solid var(--panel-border), 背景は panel-scrim の上に panel-tint, backdrop-filter blur(28px), inset 0 1px 0 rgba(255,255,255,0.2), drop-shadow 0 30px 60px rgba(0,0,0,0.3)。
- ガラスパネル: border-radius 24-28px, 同じ scrim+tint レシピ, backdrop-filter blur(18px), 1px solid var(--hairline)。
- カード（prism-card）: rgba(255,255,255,0.04) ベース, mask テクニックでグラデーションボーダー (linear-gradient(135deg, var(--c1), var(--c2)) — c2→c3, c3→c4 と巡回)。
- プロンプトボックス: border-radius 24px, rgba(0,0,0,0.4), 1px solid var(--hairline)。
- コピーボタン: #fff 背景, #000 テキスト, border-radius 20px, padding 10px 20px。

パレットスイッチャー（中核機能）:
ページ上部にピル型チップ列。各チップにはそのパレットの 4 色ミニスペクトラム（--c1..--c4 の隣接スウォッチ）と大文字の名前（例: ${palette.name}）。アクティブチップには 1px solid var(--c1) のボーダーと柔らかな外側グロー 0 0 18px rgba(var(--c1-rgb), 0.32)。チップを押すと CSS 変数 4 つすべてが入れ替わり、オーブ／スペクトラムバー／プリズムカードボーダー／プロンプトの色が 500ms 以内にそろって変わる。

レイアウト:
コンテナ: width min(1080px, 92vw), padding 30px 0 78px
ヒーロー: padding 60px（モバイル 30px）
カードグリッド: grid, repeat(auto-fit, minmax(240px, 1fr)), gap 24px
リード段落: max-width 600px, font-weight 300

モーション:
背景オーブ: radial-gradient 3つ（10% 20% に --c1, 80% 80% に --c3, 50% 50% に --c2）, filter blur(80px), opacity 0.32。
@keyframes fluid — 0% scale(1) rotate(0deg), 50% scale(1.2) rotate(15deg), 100% scale(0.9) rotate(-10deg)。15s infinite alternate ease-in-out。
ヒーロー登場: fadeIn 1s, translateY(20px) opacity 0 → translateY(0) opacity 1。
カードホバー: transform / box-shadow 0.3s。跳ねるスプリング禁止。
パレット切替: --c1..--c4 を ~400ms color transition。prefers-reduced-motion 時はオーブのキーフレームを一時停止。

禁止:
- 背景オーブの opacity 0.4 超 — 本文可読性を破壊。
- ガラスパネルへの backdrop-filter blur(40px) 以上。
- オーブ上の本文 opacity 0.85 未満。
- ヒーロー/カードの鋭い角（最低 24px radius）。
- 明るい/白いページ背景。
- 静的背景 — オーブはゆっくりでも必ず動く。

出力:
1) パレット ${palette.name} を使った全カラートークンリスト。
2) 4 スウォッチチップ入りパレットスイッチャー列 + アクティブ状態。
3) Hero / Prism Cards / Property Meters / Color Orbs / Prompt セクション構造。
4) fluid オーブアニメーション、fadeIn キーフレーム、prefers-reduced-motion ガード入りの単一ファイル HTML/CSS。`}</pre>
            <button className="copy" data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/runtime-signal.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Runtime Signal</span></a><div className="page-nav__divider" /><a href="/pages/neon-drift.html"><span><span className="page-nav__label">다음</span>Neon Drift</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
