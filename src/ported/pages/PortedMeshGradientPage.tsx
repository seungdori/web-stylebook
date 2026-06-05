import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedMeshGradientPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--mesh-gradient">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <div className="mesh-bg" />
        <main className="shell">
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
          {/* ── Hero ── */}
          <section className="hero">
            <h1>Mesh Gradient<br />Interface</h1>
            <p className="lead" data-lang="en">
              Multi-point radial gradients layer like watercolor washes, creating soft dimensional
              depth. Each orb bleeds into the next -- no hard edges, only luminous transitions
              that shift as you scroll.
            </p>
            <p className="lead" data-lang="ko" hidden>
              여러 지점에서 퍼지는 방사형 그라데이션이 수채화처럼 겹쳐 부드럽고 입체적인 깊이를 만듭니다.
              오브가 서로 번지며 이어져 날카로운 경계가 없고, 스크롤할 때마다 빛이 흐르듯 색이 바뀝니다.
            </p>
            <p className="lead" data-lang="ja" hidden>
              複数の点から広がる放射グラデーションが水彩のように重なり合い、柔らかく立体的な奥行きを生み出します。
              オーブ同士がにじんでつながるので、鋭い境界はありません。スクロールするたびに、光が流れるように色が移り変わります。
            </p>
          </section>
          {/* ── Gradient Anatomy ── */}
          <section className="anatomy">
            <p className="section-label" data-lang="en">X-Ray View</p>
            <p className="section-label" data-lang="ko" hidden>X-Ray 뷰</p>
            <p className="section-label" data-lang="ja" hidden>X-Ray ビュー</p>
            <h2 className="section-title" data-lang="en">Gradient Anatomy</h2>
            <h2 className="section-title" data-lang="ko" hidden>그라데이션 구조</h2>
            <h2 className="section-title" data-lang="ja" hidden>グラデーション解剖図</h2>
            <p className="section-desc" data-lang="en">Five radial gradient orbs positioned at precise mesh coordinates. Each point radiates color that fades into transparency, blending where they overlap.</p>
            <p className="section-desc" data-lang="ko" hidden>정밀한 메시 좌표에 오브 다섯 개를 배치했습니다. 각 지점에서 퍼진 색이 가장자리로 갈수록 투명해지고, 겹치는 곳에서 자연스럽게 섞입니다.</p>
            <p className="section-desc" data-lang="ja" hidden>5つの放射グラデーションオーブを、正確なメッシュ座標に配置しています。各ポイントから広がる色は外側へいくほど透明になり、重なり合う部分で自然に混ざります。</p>
            <div className="anatomy-canvas">
              <div className="orb-dot orb-1" data-label="20% 10%  --accent  0.28" />
              <div className="orb-dot orb-2" data-label="80% 20%  --accent-2  0.22" />
              <div className="orb-dot orb-3" data-label="50% 60%  --accent-3  0.18" />
              <div className="orb-dot orb-4" data-label="10% 80%  --accent  0.15" />
              <div className="orb-dot orb-5" data-label="90% 80%  gold  0.12" />
            </div>
          </section>
          {/* ── Layer Stack ── */}
          <section className="layer-stack">
            <p className="section-label" data-lang="en">Composition</p>
            <p className="section-label" data-lang="ko" hidden>구성</p>
            <p className="section-label" data-lang="ja" hidden>コンポジション</p>
            <h2 className="section-title" data-lang="en">Layer Stack</h2>
            <h2 className="section-title" data-lang="ko" hidden>레이어 스택</h2>
            <h2 className="section-title" data-lang="ja" hidden>レイヤースタック</h2>
            <p className="section-desc" data-lang="en">Mesh gradients are built by stacking translucent radial layers. Each layer contributes one color zone -- together they form the full mesh.</p>
            <p className="section-desc" data-lang="ko" hidden>메시 그라데이션은 반투명한 방사형 레이어를 쌓아 만듭니다. 레이어 하나가 색 영역 하나를 맡고, 이들이 모여 전체 메시를 이룹니다.</p>
            <p className="section-desc" data-lang="ja" hidden>メッシュグラデーションは、半透明の放射レイヤーを重ねて作ります。各レイヤーが一つの色の領域を受け持ち、それらが集まって全体のメッシュになります。</p>
            <div className="layers">
              <div className="layer-strip">
                <div className="layer-swatch" />
                <div className="layer-info">
                  <span className="layer-name" data-lang="en">Layer 1 -- Violet Core</span>
                  <span className="layer-name" data-lang="ko" hidden>레이어 1 -- 바이올렛 코어</span>
                  <span className="layer-name" data-lang="ja" hidden>レイヤー1 -- バイオレットコア</span>
                  <span className="layer-meta"><span>at 20% 10%</span><span>opacity 0.28</span><span>spread 50%</span></span>
                </div>
              </div>
              <div className="layer-strip">
                <div className="layer-swatch" />
                <div className="layer-info">
                  <span className="layer-name" data-lang="en">Layer 2 -- Rose Bloom</span>
                  <span className="layer-name" data-lang="ko" hidden>레이어 2 -- 로즈 블룸</span>
                  <span className="layer-name" data-lang="ja" hidden>レイヤー2 -- ローズブルーム</span>
                  <span className="layer-meta"><span>at 80% 20%</span><span>opacity 0.22</span><span>spread 50%</span></span>
                </div>
              </div>
              <div className="layer-strip">
                <div className="layer-swatch" />
                <div className="layer-info">
                  <span className="layer-name" data-lang="en">Layer 3 -- Coral Center</span>
                  <span className="layer-name" data-lang="ko" hidden>레이어 3 -- 코랄 센터</span>
                  <span className="layer-name" data-lang="ja" hidden>レイヤー3 -- コーラルセンター</span>
                  <span className="layer-meta"><span>at 50% 60%</span><span>opacity 0.18</span><span>spread 50%</span></span>
                </div>
              </div>
              <div className="layer-strip">
                <div className="layer-swatch" />
                <div className="layer-info">
                  <span className="layer-name" data-lang="en">Layer 4 -- Violet Echo</span>
                  <span className="layer-name" data-lang="ko" hidden>레이어 4 -- 바이올렛 에코</span>
                  <span className="layer-name" data-lang="ja" hidden>レイヤー4 -- バイオレットエコー</span>
                  <span className="layer-meta"><span>at 10% 80%</span><span>opacity 0.15</span><span>spread 40%</span></span>
                </div>
              </div>
              <div className="layer-strip">
                <div className="layer-swatch" />
                <div className="layer-info">
                  <span className="layer-name" data-lang="en">Layer 5 -- Gold Accent</span>
                  <span className="layer-name" data-lang="ko" hidden>레이어 5 -- 골드 액센트</span>
                  <span className="layer-name" data-lang="ja" hidden>レイヤー5 -- ゴールドアクセント</span>
                  <span className="layer-meta"><span>at 90% 80%</span><span>opacity 0.12</span><span>spread 40%</span></span>
                </div>
              </div>
            </div>
          </section>
          {/* ── Application Gallery ── */}
          <section className="app-gallery">
            <p className="section-label" data-lang="en">In Practice</p>
            <p className="section-label" data-lang="ko" hidden>실전 적용</p>
            <p className="section-label" data-lang="ja" hidden>実践適用</p>
            <h2 className="section-title" data-lang="en">Application Gallery</h2>
            <h2 className="section-title" data-lang="ko" hidden>적용 갤러리</h2>
            <h2 className="section-title" data-lang="ja" hidden>適用ギャラリー</h2>
            <p className="section-desc" data-lang="en">Three blur intensities show how content layers over the mesh. Lower blur reveals more color; higher blur creates frosted glass.</p>
            <p className="section-desc" data-lang="ko" hidden>블러 강도를 세 단계로 바꿔 콘텐츠가 메시 위에 어떻게 얹히는지 보여줍니다. 블러가 약하면 색이 더 살아나고, 강하면 서리 낀 유리 같은 질감이 됩니다.</p>
            <p className="section-desc" data-lang="ja" hidden>3段階のブラー強度で、コンテンツがメッシュの上にどう重なるかを見せます。ブラーが弱いほど色がはっきり出て、強いほどフロストガラスのような質感になります。</p>
            <div className="gallery-stack">
              <div className="gallery-card">
                <p className="gallery-card__blur-label">blur(4px)</p>
                <p className="gallery-card__title" data-lang="en">Light Frost</p>
                <p className="gallery-card__title" data-lang="ko" hidden>라이트 프로스트</p>
                <p className="gallery-card__title" data-lang="ja" hidden>ライトフロスト</p>
                <p className="gallery-card__text" data-lang="en">Minimal blur lets gradient colors show through. Best for decorative backgrounds where vibrancy matters.</p>
                <p className="gallery-card__text" data-lang="ko" hidden>블러를 최소로 줘 그라데이션 색이 그대로 비칩니다. 색이 선명해야 하는 장식용 배경에 잘 맞습니다.</p>
                <p className="gallery-card__text" data-lang="ja" hidden>ブラーを最小限にすると、グラデーションの色がそのまま透けて見えます。鮮やかさを生かしたい装飾的な背景に向いています。</p>
              </div>
              <div className="gallery-card">
                <p className="gallery-card__blur-label">blur(12px)</p>
                <p className="gallery-card__title" data-lang="en">Medium Glass</p>
                <p className="gallery-card__title" data-lang="ko" hidden>미디엄 글래스</p>
                <p className="gallery-card__title" data-lang="ja" hidden>ミディアムグラス</p>
                <p className="gallery-card__text" data-lang="en">Balanced blur softens the mesh into a gentle haze. Ideal for content cards that need readable text.</p>
                <p className="gallery-card__text" data-lang="ko" hidden>적당한 블러가 메시를 은은한 안개처럼 풀어 줍니다. 본문이 잘 읽혀야 하는 콘텐츠 카드에 적합합니다.</p>
                <p className="gallery-card__text" data-lang="ja" hidden>ほどよいブラーで、メッシュを穏やかなかすみのように和らげます。本文をしっかり読ませたいコンテンツカードに向いています。</p>
              </div>
              <div className="gallery-card">
                <p className="gallery-card__blur-label">blur(24px) + saturate(140%)</p>
                <p className="gallery-card__title" data-lang="en">Deep Frosted</p>
                <p className="gallery-card__title" data-lang="ko" hidden>딥 프로스티드</p>
                <p className="gallery-card__title" data-lang="ja" hidden>ディープフロスト</p>
                <p className="gallery-card__text" data-lang="en">Heavy blur with saturation boost. Creates opaque-feeling panels while retaining translucent luminosity.</p>
                <p className="gallery-card__text" data-lang="ko" hidden>채도를 끌어올린 강한 블러입니다. 반투명한 광택은 그대로 살리면서 불투명한 인상의 패널을 만듭니다.</p>
                <p className="gallery-card__text" data-lang="ja" hidden>彩度を上げた強いブラー。半透明の輝きを保ちつつ、不透明に近い質感のパネルに仕上げます。</p>
              </div>
            </div>
          </section>
          {/* ── Color Tokens Bar ── */}
          <div className="color-tokens-bar">
            <div className="token">
              <div className="token-orb t1" />
              <div>
                <span className="token-label">--accent</span>
                <span className="token-hex">#6c63ff</span>
              </div>
            </div>
            <div className="token">
              <div className="token-orb t2" />
              <div>
                <span className="token-label">--accent-2</span>
                <span className="token-hex">#f857a6</span>
              </div>
            </div>
            <div className="token">
              <div className="token-orb t3" />
              <div>
                <span className="token-label">--accent-3</span>
                <span className="token-hex">#ff5858</span>
              </div>
            </div>
          </div>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Mesh Gradient style — layered radial color blobs on a light base.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #faf8f6{"\n"}--card-bg: rgba(255, 255, 255, 0.75){"\n"}--border: rgba(26, 26, 46, 0.08){"\n"}--text: #1a1a2e{"\n"}--text-muted: #8e8e9a{"\n"}--accent-1: #6c63ff{"\n"}--accent-2: #f857a6{"\n"}--accent-3: #ff5858{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: "Inter" sans-serif, 800 weight, tracking -0.04em{"\n"}Body: "Noto Sans" / "Inter" sans-serif, 400 / 500 weight{"\n"}Scale: 14 / 15 / 16 / 17 / 32 / 74px (clamp(2rem, 5.5vw, 4.6rem)){"\n"}Body line-height: 1.8{"\n"}Heading line-height: 1.05{"\n"}Title uses gradient text: linear-gradient(135deg, #6c63ff 0%, #f857a6 50%, #ff5858 100%), background-clip text.{"\n"}{"\n"}UI:{"\n"}- Hero card: 1px solid var(--border), border-radius 32px, background var(--card-bg), backdrop-filter blur(20px) saturate(140%), box-shadow 0 20px 60px rgba(0,0,0,0.06){"\n"}- Tiles: 1px solid var(--border), border-radius 18px, background rgba(255,255,255,0.55), backdrop-filter blur(8px){"\n"}- Tile hover: transform translateY(-2px), box-shadow 0 8px 24px rgba(108,99,255,0.1){"\n"}- Prompt section: background var(--card-bg), border-radius 24px, backdrop-filter blur(12px){"\n"}- Buttons: 1px solid var(--accent-1), border-radius 999px, background rgba(108,99,255,0.06), font-weight 500, hover background rgba(108,99,255,0.14) + box-shadow 0 4px 16px rgba(108,99,255,0.15){"\n"}{"\n"}LAYOUT:{"\n"}- Container: min(1080px, 92vw) centered, padding 28px 0 80px{"\n"}- Hero padding: clamp(24px, 5vw, 52px){"\n"}- Feature grid: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}- Lead paragraph max-width: 680px{"\n"}{"\n"}MOTION:{"\n"}- Tile entrance: translateY(14px) to 0, opacity 0 to 1, 0.6s ease, stagger 0.08s per tile{"\n"}- Tile hover: transform 0.2s, box-shadow 0.2s{"\n"}- Button hover: all 0.25s ease{"\n"}- Mesh background: fixed div with 5 radial-gradients:{"\n"}{"  "}radial-gradient(at 20% 10%, rgba(108,99,255,0.28), transparent 50%){"\n"}{"  "}radial-gradient(at 80% 20%, rgba(248,87,166,0.22), transparent 50%){"\n"}{"  "}radial-gradient(at 50% 60%, rgba(255,88,88,0.18), transparent 50%){"\n"}{"  "}radial-gradient(at 10% 80%, rgba(108,99,255,0.15), transparent 40%){"\n"}{"  "}radial-gradient(at 90% 80%, rgba(255,200,55,0.12), transparent 40%){"\n"}{"\n"}RESPONSIVE:{"\n"}- Below 768px: single column tiles, gradient opacity reduced by 40%, card border-radius 20px, hero padding 24px, title clamps down to 2rem{"\n"}- Above 768px: auto-fit grid 2–4 columns, full backdrop-filter effects{"\n"}{"\n"}FORBIDDEN:{"\n"}- No dark backgrounds — light airy base only{"\n"}- No hard borders heavier than 1px{"\n"}- No box-shadow darker than rgba(0,0,0,0.06){"\n"}- No more than 5 gradient layers in mesh background{"\n"}- No solid opaque card backgrounds — must remain translucent{"\n"}{"\n"}OUTPUT:{"\n"}1. Single HTML file with inline CSS{"\n"}2. Fixed mesh gradient background with 5 radial-gradient layers{"\n"}3. Frosted glass cards using backdrop-filter blur + saturate{"\n"}4. Gradient-clipped heading text{"\n"}5. Color token custom properties in :root{"\n"}6. Responsive layout using CSS clamp() and auto-fit grid</pre>
            <pre data-lang="ko" hidden>Mesh Gradient 스타일의 랜딩 페이지를 디자인해줘 — 밝은 베이스 위에 겹겹이 쌓인 방사형 컬러 블롭.{"\n"}{"\n"}색상 토큰:{"\n"}--bg: #faf8f6{"\n"}--card-bg: rgba(255, 255, 255, 0.75){"\n"}--border: rgba(26, 26, 46, 0.08){"\n"}--text: #1a1a2e{"\n"}--text-muted: #8e8e9a{"\n"}--accent-1: #6c63ff{"\n"}--accent-2: #f857a6{"\n"}--accent-3: #ff5858{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: "Inter" sans-serif, 800 weight, tracking -0.04em{"\n"}본문: "Noto Sans" / "Inter" sans-serif, 400 / 500 weight{"\n"}스케일: 14 / 15 / 16 / 17 / 32 / 74px (clamp(2rem, 5.5vw, 4.6rem)){"\n"}본문 line-height: 1.8{"\n"}제목 line-height: 1.05{"\n"}제목에 그라데이션 텍스트 적용: linear-gradient(135deg, #6c63ff 0%, #f857a6 50%, #ff5858 100%), background-clip text.{"\n"}{"\n"}UI:{"\n"}- 히어로 카드: 1px solid var(--border), border-radius 32px, background var(--card-bg), backdrop-filter blur(20px) saturate(140%), box-shadow 0 20px 60px rgba(0,0,0,0.06){"\n"}- 타일: 1px solid var(--border), border-radius 18px, background rgba(255,255,255,0.55), backdrop-filter blur(8px){"\n"}- 타일 hover: transform translateY(-2px), box-shadow 0 8px 24px rgba(108,99,255,0.1){"\n"}- 프롬프트 섹션: background var(--card-bg), border-radius 24px, backdrop-filter blur(12px){"\n"}- 버튼: 1px solid var(--accent-1), border-radius 999px, background rgba(108,99,255,0.06), font-weight 500, hover시 background rgba(108,99,255,0.14) + box-shadow 0 4px 16px rgba(108,99,255,0.15){"\n"}{"\n"}레이아웃:{"\n"}- 컨테이너: min(1080px, 92vw) 중앙정렬, padding 28px 0 80px{"\n"}- 히어로 padding: clamp(24px, 5vw, 52px){"\n"}- 피처 그리드: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}- 리드 문단 max-width: 680px{"\n"}{"\n"}모션:{"\n"}- 타일 등장: translateY(14px)→0, opacity 0→1, 0.6s ease, 타일당 0.08s 순차 지연{"\n"}- 타일 hover: transform 0.2s, box-shadow 0.2s{"\n"}- 버튼 hover: all 0.25s ease{"\n"}- 메시 배경: fixed div에 5개 radial-gradient:{"\n"}{"  "}radial-gradient(at 20% 10%, rgba(108,99,255,0.28), transparent 50%){"\n"}{"  "}radial-gradient(at 80% 20%, rgba(248,87,166,0.22), transparent 50%){"\n"}{"  "}radial-gradient(at 50% 60%, rgba(255,88,88,0.18), transparent 50%){"\n"}{"  "}radial-gradient(at 10% 80%, rgba(108,99,255,0.15), transparent 40%){"\n"}{"  "}radial-gradient(at 90% 80%, rgba(255,200,55,0.12), transparent 40%){"\n"}{"\n"}반응형:{"\n"}- 768px 미만: 단일 열 타일, 그라데이션 opacity 40% 감소, 카드 border-radius 20px, 히어로 padding 24px, 제목 최소 2rem{"\n"}- 768px 이상: auto-fit 그리드 2~4열, 풀 backdrop-filter 효과{"\n"}{"\n"}금지사항:{"\n"}- 다크 배경 금지 — 밝고 경쾌한 베이스만{"\n"}- 1px보다 두꺼운 보더 금지{"\n"}- rgba(0,0,0,0.06)보다 진한 box-shadow 금지{"\n"}- 메시 배경에 그라데이션 레이어 5개 초과 금지{"\n"}- 불투명 카드 배경 금지 — 반드시 반투명 유지{"\n"}{"\n"}출력:{"\n"}1. 인라인 CSS가 포함된 단일 HTML 파일{"\n"}2. 5개 radial-gradient 레이어의 고정 메시 그라데이션 배경{"\n"}3. backdrop-filter blur + saturate를 활용한 프로스티드 글래스 카드{"\n"}4. 그라데이션 클리핑 제목 텍스트{"\n"}5. :root에 색상 토큰 커스텀 프로퍼티{"\n"}6. CSS clamp()와 auto-fit 그리드를 활용한 반응형 레이아웃</pre>
            <pre data-lang="ja" hidden>Mesh Gradientスタイルのランディングページをデザインしてください — 明るいベースの上にレイヤードされた放射状カラーブロブ。{"\n"}{"\n"}カラートークン:{"\n"}--bg: #faf8f6{"\n"}--card-bg: rgba(255, 255, 255, 0.75){"\n"}--border: rgba(26, 26, 46, 0.08){"\n"}--text: #1a1a2e{"\n"}--text-muted: #8e8e9a{"\n"}--accent-1: #6c63ff{"\n"}--accent-2: #f857a6{"\n"}--accent-3: #ff5858{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: "Inter" sans-serif, 800 weight, tracking -0.04em{"\n"}本文: "Noto Sans" / "Inter" sans-serif, 400 / 500 weight{"\n"}スケール: 14 / 15 / 16 / 17 / 32 / 74px (clamp(2rem, 5.5vw, 4.6rem)){"\n"}本文 line-height: 1.8{"\n"}見出し line-height: 1.05{"\n"}タイトルにグラデーションテキスト適用: linear-gradient(135deg, #6c63ff 0%, #f857a6 50%, #ff5858 100%), background-clip text。{"\n"}{"\n"}UI:{"\n"}- ヒーローカード: 1px solid var(--border), border-radius 32px, background var(--card-bg), backdrop-filter blur(20px) saturate(140%), box-shadow 0 20px 60px rgba(0,0,0,0.06){"\n"}- タイル: 1px solid var(--border), border-radius 18px, background rgba(255,255,255,0.55), backdrop-filter blur(8px){"\n"}- タイルhover: transform translateY(-2px), box-shadow 0 8px 24px rgba(108,99,255,0.1){"\n"}- プロンプトセクション: background var(--card-bg), border-radius 24px, backdrop-filter blur(12px){"\n"}- ボタン: 1px solid var(--accent-1), border-radius 999px, background rgba(108,99,255,0.06), font-weight 500, hover時 background rgba(108,99,255,0.14) + box-shadow 0 4px 16px rgba(108,99,255,0.15){"\n"}{"\n"}レイアウト:{"\n"}- コンテナ: min(1080px, 92vw) 中央揃え, padding 28px 0 80px{"\n"}- ヒーロー padding: clamp(24px, 5vw, 52px){"\n"}- フィーチャーグリッド: repeat(auto-fit, minmax(200px, 1fr)), gap 12px{"\n"}- リード段落 max-width: 680px{"\n"}{"\n"}モーション:{"\n"}- タイル登場: translateY(14px)→0, opacity 0→1, 0.6s ease, タイルごとに0.08s順次遅延{"\n"}- タイルhover: transform 0.2s, box-shadow 0.2s{"\n"}- ボタンhover: all 0.25s ease{"\n"}- メッシュ背景: fixed divに5つのradial-gradient:{"\n"}{"  "}radial-gradient(at 20% 10%, rgba(108,99,255,0.28), transparent 50%){"\n"}{"  "}radial-gradient(at 80% 20%, rgba(248,87,166,0.22), transparent 50%){"\n"}{"  "}radial-gradient(at 50% 60%, rgba(255,88,88,0.18), transparent 50%){"\n"}{"  "}radial-gradient(at 10% 80%, rgba(108,99,255,0.15), transparent 40%){"\n"}{"  "}radial-gradient(at 90% 80%, rgba(255,200,55,0.12), transparent 40%){"\n"}{"\n"}レスポンシブ:{"\n"}- 768px未満: 単一列タイル, グラデーションopacity 40%低減, カードborder-radius 20px, ヒーローpadding 24px, タイトル最小2rem{"\n"}- 768px以上: auto-fitグリッド2〜4列, フルbackdrop-filter効果{"\n"}{"\n"}禁止事項:{"\n"}- ダーク背景禁止 — 明るくエアリーなベースのみ{"\n"}- 1pxより太いボーダー禁止{"\n"}- rgba(0,0,0,0.06)より濃いbox-shadow禁止{"\n"}- メッシュ背景にグラデーションレイヤー5個超過禁止{"\n"}- 不透明なカード背景禁止 — 必ず半透明を維持{"\n"}{"\n"}出力:{"\n"}1. インラインCSS付きの単一HTMLファイル{"\n"}2. 5つのradial-gradientレイヤーによる固定メッシュグラデーション背景{"\n"}3. backdrop-filter blur + saturateを活用したフロストガラスカード{"\n"}4. グラデーションクリッピングの見出しテキスト{"\n"}5. :rootにカラートークンカスタムプロパティ{"\n"}6. CSS clamp()とauto-fitグリッドを活用したレスポンシブレイアウト</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/duotone-bold.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Duotone Bold</span></a><div className="page-nav__divider" /><a href="/pages/framer-motion.html"><span><span className="page-nav__label">다음</span>Framer Motion</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
