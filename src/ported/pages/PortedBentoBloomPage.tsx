import { useRef, type CSSProperties, type ReactNode } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

// ---------------------------------------------------------------------------
// "Boram" — soft Korean productivity app concept.
// The page is a marketing-style showcase for Boram, using bento-grid
// compositions to render real app moments instead of generic UI demos.
// ---------------------------------------------------------------------------

// ─── App preview (hero right side): a real bento screen ────────────────────

function HeroAppPreview() {
  return (
    <div className="br-preview" aria-hidden="true">
      <div className="br-preview__tile br-preview__tile--today">
        <span className="br-preview__caption">오늘 · Today</span>
        <p className="br-preview__title">오늘은 조금 천천히.</p>
        <span className="br-preview__hint">— 보람</span>
      </div>
      <div className="br-preview__tile br-preview__tile--mood">
        <span className="br-preview__caption">기분 색</span>
        <div className="br-preview__mood">
          {['#a7d3b8', '#f1c6a6', '#c9b9e3', '#f4d56a', '#9ec8d6'].map((c, i) => (
            <span
              key={c}
              className="br-preview__mood-dot"
              style={{ background: c, opacity: i === 2 ? 1 : 0.4 } as CSSProperties}
            />
          ))}
        </div>
      </div>
      <div className="br-preview__tile br-preview__tile--bloom">
        <BloomMascot size="large" />
        <span className="br-preview__bloom-label">오늘의 꽃</span>
      </div>
      <div className="br-preview__tile br-preview__tile--streak">
        <span className="br-preview__caption">연속 기록</span>
        <strong className="br-preview__big">12일</strong>
        <span className="br-preview__hint">함께 피고 있어요</span>
      </div>
      <div className="br-preview__tile br-preview__tile--memo">
        <span className="br-preview__caption">메모 · 자판기</span>
        <p className="br-preview__memo-line">— 비 오는 날의 자판기 커피.</p>
        <p className="br-preview__memo-line">— 작은 우산을 빌려준 사람.</p>
        <p className="br-preview__memo-line br-preview__memo-line--accent">— 종로 5가의 그 작은 약국.</p>
      </div>
    </div>
  );
}

// ─── Bloom mascot — the page's signature illustration ─────────────────────
// A larger, more characterful flower than the small BloomSvg above.
// Appears in hero preview, statement band, and at the bottom of materials.

interface BloomMascotProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'marigold' | 'peach' | 'lavender';
}

function BloomMascot({ size = 'medium', variant = 'marigold' }: BloomMascotProps) {
  const dim = size === 'large' ? 140 : size === 'medium' ? 96 : 60;
  const petalColor = variant === 'marigold' ? '#f4d56a' : variant === 'peach' ? '#f1c6a6' : '#c9b9e3';
  const centerColor = variant === 'marigold' ? '#c84a32' : '#2b2620';
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 100 100"
      fill="none"
      className="br-mascot"
    >
      {/* 8 petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        return (
          <ellipse
            key={i}
            cx="50"
            cy="22"
            rx="13"
            ry="22"
            fill={petalColor}
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
      {/* Inner ring of accent petals */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * 360 + 30;
        return (
          <ellipse
            key={`inner-${i}`}
            cx="50"
            cy="34"
            rx="6"
            ry="10"
            fill={variant === 'marigold' ? '#e8a830' : centerColor}
            transform={`rotate(${angle} 50 50)`}
            opacity="0.85"
          />
        );
      })}
      {/* Center */}
      <circle cx="50" cy="50" r="11" fill={centerColor} />
      <circle cx="50" cy="50" r="5" fill="#fffbe6" opacity="0.85" />
    </svg>
  );
}

// ─── Bloom SVG primitives ──────────────────────────────────────────────────

interface BloomSvgProps {
  variant: 'peach' | 'sage' | 'lavender' | 'cream';
  size?: number;
}

function BloomSvg({ variant, size = 64 }: BloomSvgProps) {
  const palette: Record<BloomSvgProps['variant'], string> = {
    peach: '#f1c6a6',
    sage: '#a7d3b8',
    lavender: '#c9b9e3',
    cream: '#f6efd9',
  };
  const color = palette[variant];
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className="br-bloom">
      <g>
        <circle cx="30" cy="14" r="10" fill={color} />
        <circle cx="46" cy="30" r="10" fill={color} />
        <circle cx="30" cy="46" r="10" fill={color} />
        <circle cx="14" cy="30" r="10" fill={color} />
        <circle cx="30" cy="30" r="6" fill="#fffbe6" />
      </g>
    </svg>
  );
}

// ─── Feature vignettes (3 bento moments) ──────────────────────────────────

function FeatureJournal() {
  return (
    <div className="br-vignette br-vignette--peach">
      <div className="br-vignette__line">
        <span className="br-vignette__date">04 · 16</span>
        <span className="br-vignette__weather">맑음</span>
      </div>
      <p className="br-vignette__entry">— 오늘은 한 가지만.</p>
      <p className="br-vignette__entry">— 오랜만에 한식.</p>
      <p className="br-vignette__entry br-vignette__entry--soft">— 종이를 펴고, 닫고.</p>
      <div className="br-vignette__pen" />
    </div>
  );
}

function FeatureMood() {
  return (
    <div className="br-vignette br-vignette--lavender">
      <span className="br-vignette__caption">기분의 한 주</span>
      <div className="br-vignette__moods">
        {[
          { color: '#a7d3b8', day: '월' },
          { color: '#f4d56a', day: '화' },
          { color: '#f1c6a6', day: '수' },
          { color: '#c9b9e3', day: '목' },
          { color: '#9ec8d6', day: '금' },
          { color: '#e4c4d6', day: '토' },
          { color: '#f4d56a', day: '일' },
        ].map((d) => (
          <div key={d.day} className="br-vignette__mood-cell">
            <span className="br-vignette__mood-chip" style={{ background: d.color }} />
            <span className="br-vignette__mood-day">{d.day}</span>
          </div>
        ))}
      </div>
      <p className="br-vignette__note">한 주에 다섯 가지 색이면 충분합니다.</p>
    </div>
  );
}

function FeatureGarden() {
  return (
    <div className="br-vignette br-vignette--sage">
      <span className="br-vignette__caption">함께 핀 정원</span>
      <div className="br-vignette__garden">
        <div className="br-vignette__friend br-vignette__friend--1">
          <BloomSvg variant="peach" size={44} />
          <span>지수</span>
        </div>
        <div className="br-vignette__friend br-vignette__friend--2">
          <BloomSvg variant="lavender" size={56} />
          <span>민호</span>
        </div>
        <div className="br-vignette__friend br-vignette__friend--3">
          <BloomSvg variant="cream" size={40} />
          <span>윤서</span>
        </div>
        <span className="br-vignette__sprout">💛</span>
      </div>
      <p className="br-vignette__note">7명이 함께 피었어요.</p>
    </div>
  );
}

// ─── Generic primitives ────────────────────────────────────────────────────

interface VignetteRowProps {
  index: number;
  tag: string;
  title: string;
  body: ReactNode;
  visual: ReactNode;
  align: 'left' | 'right';
}

function VignetteRow({ index, tag, title, body, visual, align }: VignetteRowProps) {
  return (
    <article className={`br-feature br-feature--${align}`}>
      <div className="br-feature__visual">{visual}</div>
      <div className="br-feature__text">
        <span className="br-mono">
          Feature {String(index).padStart(2, '0')} · {tag}
        </span>
        <h3 className="br-feature__title">{title}</h3>
        <p className="br-feature__body">{body}</p>
      </div>
    </article>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export function PortedBentoBloomPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--bento-bloom">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Hub</span>
        </a>
        <main className="page">
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
                  <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">한국어</button>
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

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <section className="br-hero">
            <div className="br-hero__lead">
              <span className="br-mono">Boram — 마음 따뜻한 생산성 도구</span>
              <h1 className="br-hero__title">
                <span data-lang="en">A softer way to keep your day.</span>
                <span data-lang="ko" hidden>하루를 정리하는 가장 부드러운 방법.</span>
                <span data-lang="ja" hidden>一日を整える、いちばん柔らかな方法。</span>
              </h1>
              <p className="br-hero__sub">
                <span data-lang="en">Memos, mood, streaks, and a small garden you grow with friends. One screen. No to-do lists. No reminders.</span>
                <span data-lang="ko" hidden>메모, 기분, 연속 기록, 그리고 친구와 함께 가꾸는 작은 정원. 한 화면에 다 들어있고, 할 일 목록과 알림은 없습니다.</span>
                <span data-lang="ja" hidden>メモ、気分、連続記録、そして友達と育てる小さな庭。一画面で、To-Doも通知もありません。</span>
              </p>
              <div className="br-hero__cta-row">
                <span className="br-mono">
                  <span data-lang="en">A demo for a soft productivity tool</span>
                  <span data-lang="ko" hidden>부드러운 생산성 도구를 위한 디자인 데모</span>
                  <span data-lang="ja" hidden>柔らかな生産性ツールのためのデザインデモ</span>
                </span>
              </div>
            </div>
            <div className="br-hero__preview">
              <HeroAppPreview />
            </div>
          </section>

          {/* ─── Manifesto ──────────────────────────────────────── */}
          <section className="br-manifesto">
            <span className="br-mono">
              <span data-lang="en">Why soft</span>
              <span data-lang="ko" hidden>왜 부드러운가</span>
              <span data-lang="ja" hidden>なぜ柔らかいのか</span>
            </span>
            <p className="br-manifesto__lede">
              <span data-lang="en">Most productivity tools shout. They want every minute, every task, every database. Boram asks for less — a sentence a day, one colour for how you feel, a friend or two.</span>
              <span data-lang="ko" hidden>대부분의 생산성 도구는 소리를 지른다. 모든 분, 모든 일, 모든 데이터베이스를 가져가려 한다. 보람은 더 적게 묻는다 — 하루 한 줄, 마음의 색 하나, 한두 명의 친구.</span>
              <span data-lang="ja" hidden>多くの生産性ツールは叫ぶ。すべての分、すべての仕事、すべてのデータベースを要求する。Boramはより少なく頼む — 一日一行、気分の色一つ、一人か二人の友達。</span>
            </p>
            <p className="br-manifesto__body">
              <span data-lang="en">The day fits in one screen. The screen blooms at its own pace.</span>
              <span data-lang="ko" hidden>하루가 한 화면에 들어가고, 그 화면이 자기 속도로 핀다.</span>
              <span data-lang="ja" hidden>一日が一画面に収まり、その画面が自分のペースで咲く。</span>
            </p>
          </section>

          {/* ─── Statement band — full-bleed sage punctuation ──── */}
          <section className="br-statement">
            <div className="br-statement__mascot">
              <BloomMascot size="large" variant="marigold" />
            </div>
            <p className="br-statement__line">
              <span data-lang="en">Today, in one line. That's enough.</span>
              <span data-lang="ko" hidden>오늘이 어땠는지, 한 줄로만 적어도 충분합니다.</span>
              <span data-lang="ja" hidden>今日がどうだったか、一行で十分です。</span>
            </p>
          </section>

          {/* ─── Features as vignettes ──────────────────────────── */}
          <section className="br-features">
            <header className="br-features__head">
              <span className="br-mono">
                <span data-lang="en">Three quiet features</span>
                <span data-lang="ko" hidden>세 가지 조용한 기능</span>
                <span data-lang="ja" hidden>三つの静かな機能</span>
              </span>
            </header>

            <VignetteRow
              index={1}
              tag="Journal"
              title="오늘의 한 줄"
              body={<>
                <span data-lang="en">A single line a day. Date, weather, and what kept your attention. No goals, no streaks-as-pressure — the streak just appears, behind you.</span>
                <span data-lang="ko" hidden>하루에 한 줄. 날짜, 날씨, 그리고 오늘 마음에 머무른 것. 목표도 없고, 연속 기록의 압박도 없습니다 — 기록은 그저 뒤에서 자란다.</span>
                <span data-lang="ja" hidden>一日に一行。日付、天気、そして今日心に留まったもの。目標も連続記録のプレッシャーもなく、記録はただ背中で育つ。</span>
              </>}
              visual={<FeatureJournal />}
              align="left"
            />

            <VignetteRow
              index={2}
              tag="Mood"
              title="기분 색"
              body={<>
                <span data-lang="en">Pick one of five colours for how the day felt. A week is a row of dots. Five colours is enough; ten would be a chart.</span>
                <span data-lang="ko" hidden>오늘의 기분을 다섯 가지 색 중 하나로 고른다. 한 주는 다섯 점의 행이 된다. 다섯이면 충분하다. 열이면 차트가 된다.</span>
                <span data-lang="ja" hidden>その日の気分を五色から一つ選ぶ。一週間は五つの点の列。五で十分。十なら、それはチャートになる。</span>
              </>}
              visual={<FeatureMood />}
              align="right"
            />

            <VignetteRow
              index={3}
              tag="Garden"
              title="함께 핀 정원"
              body={<>
                <span data-lang="en">Invite a friend or two. Their tiles bloom beside yours. No leaderboards, no streaks pitted against each other — only the quiet sight of someone else's day taking its own shape.</span>
                <span data-lang="ko" hidden>한두 명의 친구를 초대합니다. 그들의 타일이 당신의 옆에서 핀다. 순위표도 없고, 서로의 연속 기록을 겨루지도 않는다 — 그저 누군가의 하루가 자기 모양으로 펴지는 풍경.</span>
                <span data-lang="ja" hidden>一人か二人の友達を招く。彼らのタイルがあなたの隣で咲く。ランキングもなく、互いの連続を競うこともない — 誰かの一日が自分の形で開いていく静かな景色だけがある。</span>
              </>}
              visual={<FeatureGarden />}
              align="left"
            />
          </section>

          {/* ─── Materials & rules ──────────────────────────────── */}
          <section className="br-materials">
            <header className="br-materials__head">
              <span className="br-mono">
                <span data-lang="en">Materials</span>
                <span data-lang="ko" hidden>재료</span>
                <span data-lang="ja" hidden>素材</span>
              </span>
              <h2 className="br-materials__title">
                <span data-lang="en">Four soft papers, three rules.</span>
                <span data-lang="ko" hidden>네 장의 부드러운 종이, 세 가지 규칙.</span>
                <span data-lang="ja" hidden>四枚の柔らかな紙、三つの規則。</span>
              </h2>
            </header>

            <div className="br-swatches">
              {[
                { name: 'Sage', hex: '#a7d3b8' },
                { name: 'Peach', hex: '#f1c6a6' },
                { name: 'Lavender', hex: '#c9b9e3' },
                { name: 'Cream', hex: '#f6efd9' },
                { name: 'Marigold', hex: '#f4d56a', accent: true },
              ].map((s) => (
                <div key={s.name} className="br-swatch">
                  <div className="br-swatch__chip" style={{ background: s.hex }} />
                  <div className="br-swatch__meta">
                    <strong>{s.name}</strong>
                    <code>{s.hex}</code>
                    {s.accent ? <span className="br-swatch__role">accent · once per page</span> : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="br-rules">
              <article className="br-rule br-rule--sage">
                <span className="br-mono">Rule 01</span>
                <h3 className="br-rule__title">
                  <span data-lang="en">Bento spans 4 / 6 / 8 / 12 only.</span>
                  <span data-lang="ko" hidden>벤토는 4 · 6 · 8 · 12 columns만.</span>
                  <span data-lang="ja" hidden>ベントは4 · 6 · 8 · 12 columnsのみ。</span>
                </h3>
                <p className="br-rule__body">
                  <span data-lang="en">12-column grid; tiles span 4, 6, 8, or 12. Never 5 or 7. Asymmetry comes from arrangement, not from accidental spans.</span>
                  <span data-lang="ko" hidden>12 컬럼 그리드. 타일은 4, 6, 8, 12만. 5나 7은 없다. 비대칭은 배치에서 오지, 어긋난 span에서 오지 않는다.</span>
                  <span data-lang="ja" hidden>12カラムグリッド。タイルは4, 6, 8, 12のみ。5や7は禁止。非対称は配置から生まれ、ずれたspanからは生まれない。</span>
                </p>
              </article>
              <article className="br-rule br-rule--peach">
                <span className="br-mono">Rule 02</span>
                <h3 className="br-rule__title">
                  <span data-lang="en">Soft hard-offset shadows.</span>
                  <span data-lang="ko" hidden>부드럽지만 단호한 그림자.</span>
                  <span data-lang="ja" hidden>柔らかく、けれども毅然とした影。</span>
                </h3>
                <p className="br-rule__body">
                  <span data-lang="en">Shadows are hard-edged (no blur) but small (4-8px). The pastel substrate softens them; the hard edge keeps the page from drifting into Bootstrap.</span>
                  <span data-lang="ko" hidden>그림자는 날카로운 가장자리(블러 없음)지만, 작다(4-8px). 파스텔 substrate가 그림자를 부드럽게 만들고, 날카로운 가장자리가 페이지를 generic한 Bootstrap에서 구한다.</span>
                  <span data-lang="ja" hidden>影はシャープなエッジ(ブラーなし)、ただし小さい(4-8px)。パステルの substrate が影を柔らかくし、シャープなエッジがページを Bootstrap から守る。</span>
                </p>
              </article>
              <article className="br-rule br-rule--lavender">
                <span className="br-mono">Rule 03</span>
                <h3 className="br-rule__title">
                  <span data-lang="en">One accent, used once.</span>
                  <span data-lang="ko" hidden>액센트는 하나, 한 번만.</span>
                  <span data-lang="ja" hidden>アクセントは一つ、一度だけ。</span>
                </h3>
                <p className="br-rule__body">
                  <span data-lang="en">Marigold yellow is the page's only saturated color, used exactly once per page — usually as a single highlighted memo line or the today-flower in the preview.</span>
                  <span data-lang="ko" hidden>마리골드 노랑은 페이지의 유일한 채도. 페이지당 정확히 한 번만 등장한다 — 보통 강조된 메모 한 줄, 혹은 preview의 오늘의 꽃에.</span>
                  <span data-lang="ja" hidden>マリゴールド・イエローはページ唯一の彩度。ページごとに一度きり登場する — 通常はハイライトされたメモ一行か、preview の今日の花。</span>
                </p>
              </article>
            </div>
          </section>

          {/* ─── AI prompt (folded) ─────────────────────────────── */}
          <section className="prompt">
            <details className="prompt-fold">
              <summary className="prompt-fold__summary">
                <span className="prompt-fold__label" data-i18n="page.heading.prompt">AI Request Prompt</span>
                <span className="prompt-fold__hint">
                  <span data-lang="en">Open the folded prompt</span>
                  <span data-lang="ko" hidden>접힌 프롬프트 펼치기</span>
                  <span data-lang="ja" hidden>折りたたまれたプロンプトを開く</span>
                </span>
              </summary>
              <pre data-lang="en">Design a single-page marketing site for "Boram", a soft Korean productivity app. Five sections: hero (statement headline + a real app-preview bento composition on the right), manifesto (one display lede + body), three feature vignettes (each a bento composition demonstrating one feature: journal / mood / garden), a materials and rules card grid (5 swatches + 3 rules), and a quiet signup section. Palette: sage / peach / lavender / cream + marigold accent used exactly once. Type: Pretendard 800 for display, Pretendard 500 for body, IBM Plex Mono for metadata. Tight line-heights on display (0.95-1.05), relaxed body (1.7). Every tile sits on a hard-offset shadow 4-8px (no blur). Bento spans are 4 / 6 / 8 / 12 only.</pre>
              <pre data-lang="ko" hidden>"Boram"이라는 부드러운 한국식 생산성 앱의 단일 페이지 마케팅 사이트를 디자인해줘. 다섯 섹션: hero(선언적 헤드라인 + 우측의 진짜 앱-프리뷰 벤토 컴포지션), manifesto(디스플레이 lede + body 한 문단씩), 세 기능 vignette(각각 한 기능을 보여주는 벤토 컴포지션: journal / mood / garden), materials & rules 카드 그리드(5 swatches + 3 rules), 그리고 조용한 가입 섹션. 팔레트: sage / peach / lavender / cream + marigold 액센트는 페이지당 정확히 한 번. 타입: 디스플레이 Pretendard 800, 본문 Pretendard 500, 메타데이터 IBM Plex Mono. 디스플레이 행간 0.95-1.05, 본문 1.7. 모든 타일은 hard-offset 4-8px 그림자(블러 없음). 벤토 span은 4 / 6 / 8 / 12만.</pre>
              <pre data-lang="ja" hidden>"Boram"という柔らかな韓国式生産性アプリのシングルページマーケティングサイトをデザインしてください。5セクション: hero(宣言的見出し + 右側に実際のアプリプレビュー bento コンポジション), manifesto(ディスプレイ lede + body)、3つの機能 vignette(各々が一つの機能を示すベント構成: journal / mood / garden), materials & rules カードグリッド(5 swatches + 3 rules), そして静かな登録セクション。パレット: sage / peach / lavender / cream + marigold アクセントはページ毎に厳密に一度。タイプ: ディスプレイ Pretendard 800、本文 Pretendard 500、メタ IBM Plex Mono。ディスプレイ行送り 0.95-1.05、本文 1.7。すべてのタイルはハードオフセット 4-8px の影(ブラーなし)。ベント span は 4 / 6 / 8 / 12 のみ。</pre>
              <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
            </details>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션">
          <a href="/pages/aurora-gradient.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            <span><span className="page-nav__label">이전</span>Aurora Gradient</span>
          </a>
          <div className="page-nav__divider" />
          <a href="/pages/midnight-noir.html">
            <span><span className="page-nav__label">다음</span>Midnight Noir</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
