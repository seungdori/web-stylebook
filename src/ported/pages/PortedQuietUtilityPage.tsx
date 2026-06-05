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
                운영을 명확하게 다루도록 설계한 차분하고 기능적인 미학입니다. 순백의 캔버스, 슬레이트 톤의 면, 정교한 간격으로 인지 부하를 최소화합니다.
              </p>
              <p className="subtitle" data-lang="ja" hidden>
                運用を明快に扱うために設計した、穏やかで機能的な美学です。純白のキャンバス、スレート調の面、精密な余白で認知負荷を最小限に抑えます。
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
                <p className="spec-card__desc" data-lang="ko" hidden>콘텐츠가 또렷하게 보이도록 흰색을 바탕으로 깔고, 구조에 위계를 주려고 슬레이트 톤 패널을 씁니다.</p>
                <p className="spec-card__desc" data-lang="ja" hidden>コンテンツを読みやすくするベースの白と、構造に階層をつけるスレート調のパネル。</p>
              </div>
              <div className="spec-card">
                <p className="spec-card__label" data-lang="en">Typography Density</p>
                <p className="spec-card__label" data-lang="ko" hidden>타이포그래피 밀도</p>
                <p className="spec-card__label" data-lang="ja" hidden>タイポグラフィ密度</p>
                <p className="spec-card__value">Inter 400 / 600</p>
                <p className="spec-card__desc" data-lang="en">Restrained sans-serif type with strict hierarchy and optimized line height for readability.</p>
                <p className="spec-card__desc" data-lang="ko" hidden>위계를 엄격하게 지키고 줄 간격을 가독성에 맞춰 다듬은 절제된 산세리프 서체.</p>
                <p className="spec-card__desc" data-lang="ja" hidden>階層を厳格に保ち、行間を読みやすく整えた、抑えのきいたサンセリフ書体。</p>
              </div>
              <div className="spec-card">
                <p className="spec-card__label" data-lang="en">Layout Precision</p>
                <p className="spec-card__label" data-lang="ko" hidden>레이아웃 정밀도</p>
                <p className="spec-card__label" data-lang="ja" hidden>レイアウトの精度</p>
                <p className="spec-card__value">1px Borders / Fine Spacing</p>
                <p className="spec-card__desc" data-lang="en">Separation through subtle 1px lines (#CCD6DD) instead of shadows or gradients.</p>
                <p className="spec-card__desc" data-lang="ko" hidden>그림자나 그라데이션 대신 옅은 1px 선(#CCD6DD)으로 영역을 나눕니다.</p>
                <p className="spec-card__desc" data-lang="ja" hidden>シャドウやグラデーションではなく、淡い1pxの線（#CCD6DD）で領域を分けます。</p>
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
                <p style={{fontSize: '0.85rem', color: 'var(--muted)', margin: 0}} data-lang="ko" hidden>외곽선은 옅게, 글자는 또렷하게 대비를 줘서 중요한 상태를 알리는 작은 직사각형 뱃지.</p>
                <p style={{fontSize: '0.85rem', color: 'var(--muted)', margin: 0}} data-lang="ja" hidden>輪郭は淡く、文字は高コントラストにして、重要な状態を伝える小さな長方形のバッジ。</p>
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
                  <h3 className="showcase-title" data-lang="ko" hidden>운영 데이터 리스트</h3>
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
                  <p className="empty-state__desc" data-lang="ko" hidden>활동이 없는 시간도 정상입니다. 필터를 골라 더 많은 데이터를 보거나 새 작업을 시작하세요.</p>
                  <p className="empty-state__desc" data-lang="ja" hidden>静かな時間にも意味があります。フィルタを選んでデータを増やすか、新しいタスクを始めましょう。</p>
                </div>
              </article>
            </div>
            <div className="prompt-sec">
              <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
              <pre data-lang="en">Design a professional SaaS dashboard in 'Quiet Utility' style.{"\n"}{"\n"}CORE AESTHETIC:{"\n"}- Canvas: Pure white (#FFFFFF) background.{"\n"}- Surfaces: Light slate-tinted panels (#EDF2F4) for sidebar and secondary containers.{"\n"}- Borders: Subtle 1px lines (#CCD6DD). Strictly no shadows or gradients.{"\n"}- Typography: Inter (Sans-Serif). Headings at 600 weight, body at 400. Letter-spacing: -0.02em for titles.{"\n"}- Accents: Restrained use of Slate-Blue (#526371) for primary actions and highlights.{"\n"}{"\n"}UI PRINCIPLES:{"\n"}- High information density with precise 4px or 8px grid spacing.{"\n"}- Rectangular components with small 4px or 6px border-radius.{"\n"}- Functional iconography using thin line weights.{"\n"}- Badge system: Rectangular, muted colors, high-impact readability.{"\n"}{"\n"}LAYOUT:{"\n"}- Left sidebar with 240px width, slate-tinted.{"\n"}- Content header with clear breadcrumbs and search input.{"\n"}- Multi-card dashboard with flat structural separation.{"\n"}{"\n"}FORBIDDEN:{"\n"}- Rounded buttons over 8px.{"\n"}- Background gradients or blur effects (glassmorphism).{"\n"}- Saturated primary colors (keep them muted and gray-tinted).{"\n"}- Large decorative illustrations.</pre>
              <pre data-lang="ko" hidden>'Quiet Utility' 스타일의 전문 SaaS 대시보드를 디자인해줘.{"\n"}{"\n"}핵심 미학:{"\n"}- 캔버스: 순백색(#FFFFFF) 배경.{"\n"}- 면: 사이드바와 보조 컨테이너에 쓸 옅은 슬레이트 톤 패널(#EDF2F4).{"\n"}- 테두리: 옅은 1px 선(#CCD6DD). 그림자나 그라데이션은 절대 금지.{"\n"}- 타이포그래피: Inter (Sans-Serif). 제목은 600, 본문은 400 두께. 제목 자간은 -0.02em.{"\n"}- 포인트 색: 주요 동작과 강조에만 슬레이트 블루(#526371)를 절제해서 사용.{"\n"}{"\n"}UI 원칙:{"\n"}- 4px 또는 8px 그리드로 간격을 정밀하게 잡아 정보 밀도를 높임.{"\n"}- 모서리를 4px 또는 6px만 둥글린 직사각형 컴포넌트.{"\n"}- 얇은 선으로 그린 기능적 아이콘.{"\n"}- 뱃지 시스템: 직사각형, 뮤트 톤 컬러, 한눈에 읽히는 가독성.{"\n"}{"\n"}레이아웃:{"\n"}- 240px 너비의 슬레이트 톤 왼쪽 사이드바.{"\n"}- 경로(Breadcrumbs)와 검색 입력이 또렷하게 보이는 콘텐츠 헤더.{"\n"}- 구조를 평평하게 나눈 멀티 카드 대시보드.{"\n"}{"\n"}금지사항:{"\n"}- 8px 이상으로 둥근 버튼.{"\n"}- 배경 그라데이션이나 블러 효과(글래스모피즘).{"\n"}- 채도가 높은 원색(뮤트 톤과 그레이 톤 유지).{"\n"}- 큰 장식용 일러스트레이션.</pre>
              <pre data-lang="ja" hidden>'Quiet Utility' スタイルのプロフェッショナルなSaaSダッシュボードをデザインしてください。{"\n"}{"\n"}コア・エステティック：{"\n"}- キャンバス：純白（#FFFFFF）の背景。{"\n"}- サーフェス：サイドバーとセカンダリコンテナ用のライトスレート調パネル（#EDF2F4）。{"\n"}- ボーダー：微妙な1pxの線（#CCD6DD）。シャドウやグラデーションは厳禁。{"\n"}- タイポグラフィ：Inter（Sans-Serif）。見出しは600、本文は400のウェイト。タイトルの文字間隔は-0.02em。{"\n"}- アクセント：プライマリアクションとハイライトに、スレートブルー（#526371）を控えめに使う。{"\n"}{"\n"}UIの原則：{"\n"}- 精密な4pxまたは8pxのグリッド間隔による高い情報密度。{"\n"}- 角を4pxまたは6pxだけ丸めた長方形のコンポーネント。{"\n"}- 細い線のウェイトを使用した機能的なアイコン。{"\n"}- バッジシステム：長方形、ミュートカラー、インパクトのある読みやすさ。{"\n"}{"\n"}レイアウト：{"\n"}- 左サイドバー（幅240px、スレート調）。{"\n"}- 明確なパンくずリストと検索入力を備えたコンテンツヘッダー。{"\n"}- フラットな構造的分離を備えたマルチカードダッシュボード。{"\n"}{"\n"}禁止事項：{"\n"}- 8pxを超える丸いボタン。{"\n"}- 背景のグラデーションまたはブラー効果（グラスモーフィズム）。{"\n"}- 彩度の高い原色（ミュートでグレーがかった色に抑える）。{"\n"}- 大きな装飾的なイラスト。</pre>
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
