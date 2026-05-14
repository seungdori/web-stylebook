import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedQuietUtilityPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--quiet-utility">
      <div>
        <a className="page-back-link" href="/" style={{position: 'fixed', top: 20, left: 20, zIndex: 1001, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: 'var(--bg)', border: '1px solid var(--line)', color: 'var(--text)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span data-i18n="back.hub">Back to Hub</span>
        </a>
        <div className="wrap">
          <header>
            <strong>Templates / Quiet Utility</strong>
            <div className="lang-dropdown" id="lang-dropdown" style={{position: 'relative'}}>
              <button className="lang-toggle" id="lang-toggle" style={{background: 'none', border: '1px solid var(--line)', padding: '4px 12px', borderRadius: 4, fontSize: '0.8rem', cursor: 'pointer'}} data-i18n-aria="lang.toggle.aria">English</button>
              <ul className="lang-menu" role="menu" style={{position: 'absolute', top: '100%', right: 0, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 4, listStyle: 'none', padding: 4, display: 'none', flexDirection: 'column', gap: 2, zIndex: 10, minWidth: 100, marginTop: 4}}>
                <li><button data-lang-select="en" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontSize: '0.85rem', borderRadius: 2}}>English</button></li>
                <li><button data-lang-select="ko" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontSize: '0.85rem', borderRadius: 2}}>한국어</button></li>
                <li><button data-lang-select="ja" style={{width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', fontSize: '0.85rem', borderRadius: 2}}>日本語</button></li>
              </ul>
            </div>
          </header>
          <div className="demo-section">
            <div className="demo-hero">
              <h1 data-lang="en">Quiet Utility</h1>
              <h1 data-lang="ko" hidden>Quiet Utility</h1>
              <h1 data-lang="ja" hidden>Quiet Utility</h1>
              <p className="subtitle" data-lang="en">
                A calm, functional aesthetic designed for operational clarity. It utilizes a pure white canvas, slate-tinted surfaces, and high-precision spacing to minimize cognitive load.
              </p>
              <p className="subtitle" data-lang="ko" hidden>
                업무적 명확성을 위해 설계된 차분하고 기능적인 미학입니다. 순백의 캔버스, 슬레이트 톤의 표면, 정교한 간격을 활용하여 사용자의 인지 부하를 최소화합니다.
              </p>
              <p className="subtitle" data-lang="ja" hidden>
                運用の明快さのために設計された、穏やかで機能的な美学です。純白のキャンバス、スレートの色合いの表面、そして高精度な間隔を利用して認知負荷を最小限に抑えます。
              </p>
            </div>
            <p className="demo-section-title" data-lang="en">Design Specifications</p>
            <p className="demo-section-title" data-lang="ko" hidden>디자인 사양</p>
            <p className="demo-section-title" data-lang="ja" hidden>デザイン仕様</p>
            <div className="spec-grid">
              <div className="spec-card">
                <p className="spec-card__label" data-lang="en">Canvas &amp; Surface</p>
                <p className="spec-card__label" data-lang="ko" hidden>캔버스 및 표면</p>
                <p className="spec-card__label" data-lang="ja" hidden>キャンバスとサーフェス</p>
                <p className="spec-card__value">#FFFFFF / #EDF2F4</p>
                <p className="spec-card__desc" data-lang="en">Base white for content clarity and slate-tinted panels for structural hierarchy.</p>
                <p className="spec-card__desc" data-lang="ko" hidden>콘텐츠 명확성을 위한 기본 흰색과 구조적 위계를 위한 슬레이트 톤 패널의 조화.</p>
                <p className="spec-card__desc" data-lang="ja" hidden>コンテンツの明快さのためのベースホワイトと、構造的な階層のためのスレート色パネル。</p>
              </div>
              <div className="spec-card">
                <p className="spec-card__label" data-lang="en">Typography Density</p>
                <p className="spec-card__label" data-lang="ko" hidden>타이포그래피 밀도</p>
                <p className="spec-card__label" data-lang="ja" hidden>タイポグラフィ密度</p>
                <p className="spec-card__value">Inter 400 / 600</p>
                <p className="spec-card__desc" data-lang="en">Restrained sans-serif type with strict hierarchy and optimized line height for readability.</p>
                <p className="spec-card__desc" data-lang="ko" hidden>엄격한 계층 구조와 가독성을 위해 최적화된 줄 간격을 가진 절제된 산세리프 타입.</p>
                <p className="spec-card__desc" data-lang="ja" hidden>厳格な階層と可読性のために最適化された行の高さを備えた、抑制されたサンセリフ書体。</p>
              </div>
              <div className="spec-card">
                <p className="spec-card__label" data-lang="en">Layout Precision</p>
                <p className="spec-card__label" data-lang="ko" hidden>레이아웃 정밀도</p>
                <p className="spec-card__label" data-lang="ja" hidden>レイアウトの精度</p>
                <p className="spec-card__value">1px Borders / Fine Spacing</p>
                <p className="spec-card__desc" data-lang="en">Separation through subtle 1px lines (#CCD6DD) instead of shadows or gradients.</p>
                <p className="spec-card__desc" data-lang="ko" hidden>그림자나 그라데이션 대신 미묘한 1px 선(#CCD6DD)을 통한 공간 분리.</p>
                <p className="spec-card__desc" data-lang="ja" hidden>シャドウやグラデーションの代わりに、微妙な1pxの線（#CCD6DD）による分離。</p>
              </div>
            </div>
            <p className="demo-section-title" data-lang="en">Visual Showcases</p>
            <p className="demo-section-title" data-lang="ko" hidden>시각적 쇼케이스</p>
            <p className="demo-section-title" data-lang="ja" hidden>ビジュアルショーケース</p>
            <div className="showcase-grid">
              {/* Item 1: Status & UI Badges */}
              <article className="showcase-item">
                <div className="showcase-head">
                  <h3 className="showcase-title" data-lang="en">Status Indicators</h3>
                  <h3 className="showcase-title" data-lang="ko" hidden>상태 표시기</h3>
                  <h3 className="showcase-title" data-lang="ja" hidden>ステータスインジケーター</h3>
                </div>
                <div className="utility-badges">
                  <span className="u-badge u-badge--active">Active</span>
                  <span className="u-badge">Pending</span>
                  <span className="u-badge">Resolved</span>
                  <span className="u-badge u-badge--accent">Operational</span>
                  <span className="u-badge">Draft</span>
                </div>
                <p style={{fontSize: '0.85rem', color: 'var(--muted)', margin: 0}} data-lang="en">Small, rectangular badges with subtle outlines and high-contrast text for critical feedback.</p>
                <p style={{fontSize: '0.85rem', color: 'var(--muted)', margin: 0}} data-lang="ko" hidden>중요한 피드백을 위한 미묘한 외곽선과 높은 대비의 텍스트를 가진 작은 직사각형 뱃지.</p>
                <p style={{fontSize: '0.85rem', color: 'var(--muted)', margin: 0}} data-lang="ja" hidden>重要なフィードバックのための、微妙な輪郭と高コントラストのテキストを備えた小さな長方形のバッジ。</p>
              </article>
              {/* Item 2: Actions & Forms */}
              <article className="showcase-item">
                <div className="showcase-head">
                  <h3 className="showcase-title" data-lang="en">Controls &amp; Forms</h3>
                  <h3 className="showcase-title" data-lang="ko" hidden>컨트롤 및 양식</h3>
                  <h3 className="showcase-title" data-lang="ja" hidden>コントロールとフォーム</h3>
                </div>
                <div style={{display: 'grid', gap: 12}}>
                  <input type="text" className="u-input" placeholder="Search resources..." data-lang-placeholder="en:Search resources...|ko:리소스 검색...|ja:リソースを検索..." />
                  <div className="utility-actions">
                    <button className="u-btn u-btn--primary">Apply Changes</button>
                    <button className="u-btn">Cancel</button>
                  </div>
                </div>
              </article>
              {/* Item 3: Information Architecture */}
              <article className="showcase-item showcase-item--full">
                <div className="showcase-head">
                  <h3 className="showcase-title" data-lang="en">Operational Data List</h3>
                  <h3 className="showcase-title" data-lang="ko" hidden>관리 데이터 리스트</h3>
                  <h3 className="showcase-title" data-lang="ja" hidden>運用データリスト</h3>
                </div>
                <div className="utility-list">
                  <div className="u-list-item">
                    <span>Main Server / Cluster A</span>
                    <span>Online / 14ms</span>
                  </div>
                  <div className="u-list-item">
                    <span>DB Replica / Seoul-01</span>
                    <span>Syncing / 88%</span>
                  </div>
                  <div className="u-list-item">
                    <span>Cache Layer / Redis Cloud</span>
                    <span>High Load / 92%</span>
                  </div>
                </div>
              </article>
              {/* Item 4: Empty States */}
              <article className="showcase-item showcase-item--full">
                <div className="empty-state">
                  <div className="empty-state__icon">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx={12} cy={12} r={10} />
                      <line x1={12} y1={8} x2={12} y2={12} />
                      <line x1={12} y1={16} x2="12.01" y2={16} />
                    </svg>
                  </div>
                  <h3 className="empty-state__title" data-lang="en">No Activity Found</h3>
                  <h3 className="empty-state__title" data-lang="ko" hidden>활동 내역 없음</h3>
                  <h3 className="empty-state__title" data-lang="ja" hidden>アクティビティが見つかりません</h3>
                  <p className="empty-state__desc" data-lang="en">Quiet moments are useful. Select a filter to see more data or start a new task.</p>
                  <p className="empty-state__desc" data-lang="ko" hidden>비어있는 상태도 중요합니다. 필터를 선택하여 더 많은 데이터를 보거나 새 작업을 시작하세요.</p>
                  <p className="empty-state__desc" data-lang="ja" hidden>静かな瞬間は有用です。フィルタを選択して詳細を表示するか、新しいタスクを開始してください。</p>
                </div>
              </article>
            </div>
            <div className="prompt-sec">
              <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
              <pre data-lang="en">Design a professional SaaS dashboard in 'Quiet Utility' style.{"\n"}{"\n"}CORE AESTHETIC:{"\n"}- Canvas: Pure white (#FFFFFF) background.{"\n"}- Surfaces: Light slate-tinted panels (#EDF2F4) for sidebar and secondary containers.{"\n"}- Borders: Subtle 1px lines (#CCD6DD). Strictly no shadows or gradients.{"\n"}- Typography: Inter (Sans-Serif). Headings at 600 weight, body at 400. Letter-spacing: -0.02em for titles.{"\n"}- Accents: Restrained use of Slate-Blue (#526371) for primary actions and highlights.{"\n"}{"\n"}UI PRINCIPLES:{"\n"}- High information density with precise 4px or 8px grid spacing.{"\n"}- Rectangular components with small 4px or 6px border-radius.{"\n"}- Functional iconography using thin line weights.{"\n"}- Badge system: Rectangular, muted colors, high-impact readability.{"\n"}{"\n"}LAYOUT:{"\n"}- Left sidebar with 240px width, slate-tinted.{"\n"}- Content header with clear breadcrumbs and search input.{"\n"}- Multi-card dashboard with flat structural separation.{"\n"}{"\n"}FORBIDDEN:{"\n"}- Rounded buttons over 8px.{"\n"}- Background gradients or blur effects (glassmorphism).{"\n"}- Saturated primary colors (keep them muted and gray-tinted).{"\n"}- Large decorative illustrations.</pre>
              <pre data-lang="ko" hidden>'Quiet Utility' 스타일의 전문 SaaS 대시보드를 디자인해줘.{"\n"}{"\n"}핵심 미학:{"\n"}- 캔버스: 순백색(#FFFFFF) 배경.{"\n"}- 표면: 사이드바와 보조 컨테이너를 위한 옅은 슬레이트 톤 패널(#EDF2F4).{"\n"}- 보더: 미묘한 1px 선(#CCD6DD). 그림자나 그라데이션 절대 금지.{"\n"}- 타이포그래피: Inter (Sans-Serif). 헤딩은 600, 본문은 400 두께. 타이틀의 자간은 -0.02em.{"\n"}- 액센트: 주요 동작 및 하이라이트를 위한 절제된 슬레이트 블루(#526371) 사용.{"\n"}{"\n"}UI 원칙:{"\n"}- 정밀한 4px 또는 8px 그리드 간격을 가진 높은 정보 밀도.{"\n"}- 작은 4px 또는 6px 보더 반경을 가진 직사각형 컴포넌트.{"\n"}- 얇은 선 두께를 사용한 기능적 아이콘.{"\n"}- 뱃지 시스템: 직사각형, 뮤트 톤 컬러, 높은 가독성.{"\n"}{"\n"}레이아웃:{"\n"}- 240px 너비의 슬레이트 톤 왼쪽 사이드바.{"\n"}- 명확한 경로(Breadcrumbs)와 검색 입력이 있는 콘텐츠 헤더.{"\n"}- 플랫한 구조적 분리를 가진 멀티 카드 대시보드.{"\n"}{"\n"}금지사항:{"\n"}- 8px 이상의 둥근 버튼.{"\n"}- 배경 그라데이션 또는 블러 효과(글래스모피즘).{"\n"}- 채도가 높은 원색(뮤트 톤 및 그레이 톤 유지).{"\n"}- 큰 장식용 일러스트레이션.</pre>
              <pre data-lang="ja" hidden>'Quiet Utility' スタイルのプロフェッショナルなSaaSダッシュボードをデザインしてください。{"\n"}{"\n"}コア・エステティック：{"\n"}- キャンバス：純白（#FFFFFF）の背景。{"\n"}- サーフェス：サイドバーとセカンダリコンテナ用のライトスレート調パネル（#EDF2F4）。{"\n"}- ボーダー：微妙な1pxの線（#CCD6DD）。シャドウやグラデーションは厳禁。{"\n"}- タイポグラフィ：Inter（Sans-Serif）。見出しは600、本文は400のウェイト。タイトルの文字間隔は-0.02em。{"\n"}- アクセント：プライマリアクションとハイライトに控えめにスレートブルー（#526371）を使用。{"\n"}{"\n"}UIの原則：{"\n"}- 精密な4pxまたは8pxのグリッド間隔による高い情報密度。{"\n"}- 4pxまたは6pxの小さな境界半径を持つ長方形のコンポーネント。{"\n"}- 細い線のウェイトを使用した機能的なアイコン。{"\n"}- バッジシステム：長方形、ミュートカラー、インパクトのある読みやすさ。{"\n"}{"\n"}LAYOUT:{"\n"}- 左サイドバー（幅240px、スレート調）。{"\n"}- 明確なパンくずリストと検索入力を備えたコンテンツヘッダー。{"\n"}- フラットな構造的分離を備えたマルチカードダッシュボード。{"\n"}{"\n"}禁止事項：{"\n"}- 8pxを超える丸いボタン。{"\n"}- 背景のグラデーションまたはブラー効果（グラスモーフィズム）。{"\n"}- 彩度の高い原色（ミュートでグレーがかった色に抑える）。{"\n"}- 大きな装飾的なイラスト。</pre>
              <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
            </div>
          </div>
        </div>
        <nav className="page-nav" aria-label="Page navigation" id="page-nav">
          {/* Links will be populated by app.js or manual addition */}
          <a href="/pages/swiss-poster.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            <div>
              <span className="page-nav__label" data-i18n="page.nav.prev">Previous</span>
              <span>Swiss Poster</span>
            </div>
          </a>
          <div className="page-nav__divider" />
          <a href="/pages/platform-core.html" style={{justifyContent: 'flex-end', textAlign: 'right'}}>
            <div>
              <span className="page-nav__label" data-i18n="page.nav.next">Next</span>
              <span>Platform Core</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
