import { useRef, type CSSProperties, type ReactNode } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

// ---------------------------------------------------------------------------
// Inline paper-cut compositions. Each piece is a real layered scene.
// ---------------------------------------------------------------------------

function HeroScene() {
  return (
    <div className="gf-scene">
      <div className="gf-scene__sky" />
      <div className="gf-scene__sun" />
      <div className="gf-scene__mountain gf-scene__mountain--far" />
      <div className="gf-scene__mountain gf-scene__mountain--mid" />
      <div className="gf-scene__mountain gf-scene__mountain--fg" />
      <span className="gf-scene__pine" style={{ left: '12%', '--pine-size': '24px' } as CSSProperties} />
      <span className="gf-scene__pine" style={{ left: '60%', '--pine-size': '30px' } as CSSProperties} />
      <span className="gf-scene__pine" style={{ left: '82%', '--pine-size': '20px' } as CSSProperties} />
      <span className="gf-scene__poppy" />
    </div>
  );
}

function HarbourPiece() {
  return (
    <div className="gf-piece gf-piece--harbour">
      <div className="gf-harbour__sun" />
      <div className="gf-harbour__band gf-harbour__band--1" />
      <div className="gf-harbour__band gf-harbour__band--2" />
      <div className="gf-harbour__band gf-harbour__band--3" />
      <span className="gf-harbour__boat gf-harbour__boat--a" />
      <span className="gf-harbour__boat gf-harbour__boat--b" />
    </div>
  );
}

function MeadowPiece() {
  return (
    <div className="gf-piece gf-piece--meadow">
      <div className="gf-meadow__sky" />
      <div className="gf-meadow__hill" />
      <div className="gf-meadow__ground" />
      <span className="gf-meadow__poppy" style={{ left: '22%', bottom: '20%' }} />
      <span className="gf-meadow__poppy" style={{ left: '48%', bottom: '14%' }} />
      <span className="gf-meadow__poppy" style={{ left: '72%', bottom: '24%' }} />
    </div>
  );
}

function CityPiece() {
  const windows = [
    { left: '12%', top: '46%' },
    { left: '14%', top: '52%' },
    { left: '30%', top: '38%' },
    { left: '44%', top: '54%' },
    { left: '56%', top: '40%' },
    { left: '68%', top: '50%' },
    { left: '82%', top: '34%' },
  ];
  return (
    <div className="gf-piece gf-piece--city">
      <div className="gf-city__moon" />
      <div className="gf-city__skyline" />
      {windows.map((w, i) => (
        <span key={i} className="gf-city__window" style={{ left: w.left, top: w.top }} />
      ))}
    </div>
  );
}

interface WorkRowProps {
  index: number;
  title: string;
  year: number;
  caption: ReactNode;
  body: ReactNode;
  piece: ReactNode;
  align: 'left' | 'right';
}

function WorkRow({ index, title, year, caption, body, piece, align }: WorkRowProps) {
  return (
    <article className={`gf-work gf-work--${align}`}>
      <div className="gf-work__piece">{piece}</div>
      <div className="gf-work__text">
        <span className="gf-mono">
          No. {String(index).padStart(2, '0')} · {year}
        </span>
        <h3 className="gf-work__title">{title}</h3>
        <p className="gf-work__caption">{caption}</p>
        <p className="gf-work__body">{body}</p>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function PortedPaperCutPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--paper-cut">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Hub</span>
        </a>
        <main className="shell">
          <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
          <nav className="site-nav" role="navigation" aria-label="Main navigation">
            <div className="site-nav__inner">
              <a className="site-nav__logo" href="/">Web Stylebook</a>
              <ul className="site-nav__links">
                <li><a href="/#styles" data-i18n="nav.styles">Styles</a></li>
                <li><a href="/pages/compare" data-i18n="nav.compare">Compare</a></li>
                <li><a href="/pages/color-system" data-i18n="nav.tips">Colors</a></li>
                <li><a href="/pages/prompt-workflow" data-i18n="nav.workflow">Prompt Builder</a></li>
                <li><a href="/pages/prompt-tips" data-i18n="nav.more-tips">Tips</a></li>
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

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <section className="gf-hero">
            <div className="gf-hero__lead">
              <span className="gf-mono">
                <span data-lang="en">Goki Folio — Studio for paper-cut work</span>
                <span data-lang="ko" hidden>Goki Folio — 페이퍼 컷 작업실</span>
                <span data-lang="ja" hidden>Goki Folio — ペーパーカット工房</span>
              </span>
              <h1 className="gf-hero__title">
                <span data-lang="en">Paper, one sheet at a time, becomes depth.</span>
                <span data-lang="ko" hidden>한 장씩 자른 종이가 깊이가 된다.</span>
                <span data-lang="ja" hidden>一枚ずつ切った紙が、奥行きになる。</span>
              </h1>
              <p className="gf-hero__sub">
                <span data-lang="en">A two-person studio in Seoul. Book covers, magazine illustration, the occasional exhibition. Every image is made from hand-cut paper.</span>
                <span data-lang="ko" hidden>서울에서 일하는 두 사람의 작업실. 책 표지, 잡지 일러스트레이션, 그리고 가끔의 전시. 모든 그림은 손으로 자른 종이로 만들어집니다.</span>
                <span data-lang="ja" hidden>ソウルで活動する二人の工房。本の表紙、雑誌のイラスト、たまの展示。すべての絵は手で切った紙でできています。</span>
              </p>
              <div className="gf-hero__cta-row">
                <span className="gf-mono">
                  <span data-lang="en">Open for 2026 commissions</span>
                  <span data-lang="ko" hidden>2026년 작업 의뢰 받습니다</span>
                  <span data-lang="ja" hidden>2026年の制作依頼を受付中</span>
                </span>
                <a href="#contact" className="gf-cta">
                  <span data-lang="en">Email the studio →</span>
                  <span data-lang="ko" hidden>작업실 이메일 →</span>
                  <span data-lang="ja" hidden>工房にメール →</span>
                </a>
              </div>
            </div>
            <div className="gf-hero__visual">
              <HeroScene />
            </div>
          </section>

          {/* ─── Manifesto ──────────────────────────────────────── */}
          <section className="gf-manifesto">
            <span className="gf-mono">
              <span data-lang="en">On the work</span>
              <span data-lang="ko" hidden>작업에 대하여</span>
              <span data-lang="ja" hidden>仕事について</span>
            </span>
            <p className="gf-manifesto__lede">
              <span data-lang="en">We cut paper in an age when digital painting is faster. Not for the speed — the honest edges and shadows that only paper can give make the picture truer.</span>
              <span data-lang="ko" hidden>우리는 디지털 페인팅이 더 빠른 시대에 종이를 자른다. 빠르기 위해서가 아니라, 종이만이 가진 단호한 가장자리와 그림자가 그림을 더 정직하게 만들기 때문이다.</span>
              <span data-lang="ja" hidden>デジタル絵がより速い時代に、私たちは紙を切る。速さのためではなく、紙だけが持つ毅然とした輪郭と影が、絵をより正直にするからだ。</span>
            </p>
            <p className="gf-manifesto__body">
              <span data-lang="en">Every piece is built from five to seven sheets. Colours are flat. Depth comes only from shadow. The design tools are scissors, a blade, and one tube of paste.</span>
              <span data-lang="ko" hidden>모든 작업은 5–7 장의 종이로 짓는다. 색은 평평하고, 깊이는 그림자에서만 온다. 디자인 도구는 가위와 칼, 그리고 한 통의 풀.</span>
              <span data-lang="ja" hidden>すべての作品は5〜7枚の紙から作る。色は平らで、奥行きは影だけから生まれる。道具は鋏、ナイフ、そして一本の糊。</span>
            </p>
          </section>

          {/* ─── Selected works ─────────────────────────────────── */}
          <section className="gf-works">
            <header className="gf-works__head">
              <span className="gf-mono">
                <span data-lang="en">Selected works · 2023 → 2025</span>
                <span data-lang="ko" hidden>주요 작업 · 2023 → 2025</span>
                <span data-lang="ja" hidden>主な仕事 · 2023 → 2025</span>
              </span>
            </header>

            <WorkRow
              index={1}
              title="Harbour at Five"
              year={2025}
              caption={<>
                <span data-lang="en">Cover commission for Banpo Quarterly, summer issue.</span>
                <span data-lang="ko" hidden>반포 계간지 여름호 표지 의뢰.</span>
                <span data-lang="ja" hidden>反浦クォータリー夏号の表紙制作。</span>
              </>}
              body={<>
                <span data-lang="en">A four-layer composition. The deepest water sits at the back as walnut ink; each lighter band moves toward the viewer until the foreground reads as the shoreline. Two boats sit on the second band, framed against the sun.</span>
                <span data-lang="ko" hidden>네 겹의 컴포지션. 가장 깊은 물은 호두색 잉크로 가장 뒤에 자리하고, 더 밝은 띠가 앞으로 다가올수록 마지막에는 해안선이 된다. 두 척의 배가 두번째 띠 위에 떠 있고 해를 등진다.</span>
                <span data-lang="ja" hidden>四層構成。最も深い水はクルミ色のインクで奥に置かれ、明るい帯が手前に進むほど海岸線になる。二艘の舟は二層目の上に置かれ、太陽を背にする。</span>
              </>}
              piece={<HarbourPiece />}
              align="left"
            />

            <WorkRow
              index={2}
              title="Meadow, after Rain"
              year={2024}
              caption={<>
                <span data-lang="en">Editorial illustration for an essay by Han Kang.</span>
                <span data-lang="ko" hidden>한강 작가의 에세이를 위한 편집 일러스트레이션.</span>
                <span data-lang="ja" hidden>韓江氏のエッセイのためのエディトリアル・イラスト。</span>
              </>}
              body={<>
                <span data-lang="en">Two ground planes, one sky, three poppies. The poppies are the only saturated red on the page — they earn that color by being the smallest paper shapes in the composition. Everything else holds the muted register.</span>
                <span data-lang="ko" hidden>두 개의 지평면, 하나의 하늘, 그리고 세 송이의 양귀비. 양귀비는 페이지의 유일한 채도 컬러다 — 가장 작은 종이 조각이기에 그 자격을 얻는다. 나머지는 모두 절제된 톤을 유지한다.</span>
                <span data-lang="ja" hidden>二つの地面、一つの空、三つのポピー。ポピーはこのページ唯一の彩度をもつ赤で、最も小さな紙片であることでその資格を得る。他のすべては抑えた色を保つ。</span>
              </>}
              piece={<MeadowPiece />}
              align="right"
            />

            <WorkRow
              index={3}
              title="Night Census"
              year={2023}
              caption={<>
                <span data-lang="en">Self-initiated print, edition of 40.</span>
                <span data-lang="ko" hidden>자체 기획 프린트, 40부 한정.</span>
                <span data-lang="ja" hidden>自主企画プリント、40部限定。</span>
              </>}
              body={<>
                <span data-lang="en">The buildings are one shape, cut once with twenty-three windows. The lit windows are pasted afterward in peach paper. The composition lives or dies by the window pattern — uneven on purpose, never decorative.</span>
                <span data-lang="ko" hidden>건물은 하나의 형태에서 스물세 개의 창을 한 번에 도려낸다. 불 켜진 창은 그 후 피치 종이를 덧붙여 만든다. 컴포지션의 성패는 창의 패턴에 달려있다 — 의도적으로 불균일하게, 절대 장식적이지 않게.</span>
                <span data-lang="ja" hidden>建物は一枚の形に、二十三の窓を一度に切り抜く。明かりが灯った窓はあとから桃色の紙を貼る。構図の成否は窓の配列にかかっている — 意図して不均等に、装飾にはしない。</span>
              </>}
              piece={<CityPiece />}
              align="left"
            />
          </section>

          {/* ─── Materials & rules ──────────────────────────────── */}
          <section className="gf-materials">
            <header className="gf-materials__head">
              <span className="gf-mono">
                <span data-lang="en">Materials</span>
                <span data-lang="ko" hidden>재료</span>
                <span data-lang="ja" hidden>素材</span>
              </span>
              <h2 className="gf-materials__title">
                <span data-lang="en">Five papers, three rules.</span>
                <span data-lang="ko" hidden>다섯 장의 종이, 세 가지 규칙.</span>
                <span data-lang="ja" hidden>五枚の紙、三つの規則。</span>
              </h2>
            </header>

            <div className="gf-swatches">
              {[
                { name: 'White', hex: '#ffffff' },
                { name: 'Clay', hex: '#e8c5a5' },
                { name: 'Sage', hex: '#8eb59b' },
                { name: 'Slate', hex: '#486b8c' },
                { name: 'Walnut', hex: '#221d16' },
              ].map((s) => (
                <div key={s.name} className="gf-swatch">
                  <div className="gf-swatch__chip" style={{ background: s.hex }} />
                  <div className="gf-swatch__meta">
                    <strong>{s.name}</strong>
                    <code>{s.hex}</code>
                  </div>
                </div>
              ))}
            </div>

            <div className="gf-rules">
              <article className="gf-rule">
                <span className="gf-mono">Rule 01</span>
                <h3 className="gf-rule__title">
                  <span data-lang="en">Flat colour only.</span>
                  <span data-lang="ko" hidden>색은 평평하게만.</span>
                  <span data-lang="ja" hidden>色は平らに、ただそれだけ。</span>
                </h3>
                <p className="gf-rule__body">
                  <span data-lang="en">No gradients inside a paper shape. Depth comes from shadow, never from a fade. A flat shape with a hard shadow reads as paper; the same shape with a gradient reads as a digital illustration.</span>
                  <span data-lang="ko" hidden>형태 안에 그라데이션을 두지 않는다. 깊이는 그림자에서만 온다. 단호한 그림자를 가진 평평한 형태는 종이로 읽히고, 같은 형태에 그라데이션을 입히면 디지털 일러스트가 된다.</span>
                  <span data-lang="ja" hidden>形の中にグラデーションを置かない。奥行きは影だけから来る。鋭い影を持つフラットな形は紙に見え、同じ形にグラデーションを入れるとデジタル絵になる。</span>
                </p>
              </article>
              <article className="gf-rule">
                <span className="gf-mono">Rule 02</span>
                <h3 className="gf-rule__title">
                  <span data-lang="en">Shadows have direction.</span>
                  <span data-lang="ko" hidden>그림자에는 방향이 있다.</span>
                  <span data-lang="ja" hidden>影には方向がある。</span>
                </h3>
                <p className="gf-rule__body">
                  <span data-lang="en">Every shadow on the page falls in the same direction — down and to the right, six to ten degrees off vertical. When a single piece breaks the direction, the eye reads it as a mistake, not a flourish.</span>
                  <span data-lang="ko" hidden>페이지의 모든 그림자는 같은 방향 — 오른쪽 아래로, 수직에서 6–10도 떨어진 방향 — 으로 떨어진다. 한 작품이라도 방향을 깨면 시선은 그것을 의도가 아니라 실수로 읽는다.</span>
                  <span data-lang="ja" hidden>ページ上のすべての影は同じ方向に落ちる — 右下、垂直から6〜10度。一点でも方向を外すと、それは演出ではなく事故に見える。</span>
                </p>
              </article>
              <article className="gf-rule">
                <span className="gf-mono">Rule 03</span>
                <h3 className="gf-rule__title">
                  <span data-lang="en">One accent, used once.</span>
                  <span data-lang="ko" hidden>액센트는 하나, 한 번만.</span>
                  <span data-lang="ja" hidden>アクセントは一つ、一度だけ。</span>
                </h3>
                <p className="gf-rule__body">
                  <span data-lang="en">Poppy red appears in exactly one place on each composition. The accent earns its loudness by being small, and by being surrounded by mute paper. Two reds in one piece would be vanity.</span>
                  <span data-lang="ko" hidden>양귀비의 붉음은 한 작품에 정확히 한 군데에만 나타난다. 그 색이 큰 소리를 낼 자격을 얻는 것은 가장 작아서이고, 주변이 묵직하게 차분해서다. 한 작품에 붉음이 두 군데 이상이면 그건 자만이다.</span>
                  <span data-lang="ja" hidden>ポピーの赤は一作品に一箇所だけ現れる。その色が大きな声を持つ資格を得るのは、最も小さく、周囲が静かだからだ。一作品に赤が二つあれば、それは自惚れだ。</span>
                </p>
              </article>
            </div>
          </section>

          {/* ─── Contact ────────────────────────────────────────── */}
          <section id="contact" className="gf-contact">
            <span className="gf-mono">
              <span data-lang="en">Visit</span>
              <span data-lang="ko" hidden>방문</span>
              <span data-lang="ja" hidden>連絡</span>
            </span>
            <p className="gf-contact__email">hello@gokifolio.kr</p>
            <p className="gf-contact__note">
              <span data-lang="en">A studio in Mapo-gu, Seoul. Commissions are received by email only. We take two engagements per quarter.</span>
              <span data-lang="ko" hidden>서울 마포구 작업실. 작업 의뢰는 이메일로. 일정은 분기당 두 건으로 한정합니다.</span>
              <span data-lang="ja" hidden>ソウル麻浦区の工房。依頼はメールで承ります。四半期に二件まで。</span>
            </p>
          </section>

          {/* ─── AI prompt (folded, kept for parity with other style pages) ── */}
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
              <pre data-lang="en">Design a single-page portfolio for a paper-cut illustration studio. Five sections: hero (statement headline + a real paper-cut composition as the right-side visual), manifesto (two short paragraphs), three selected works (each with its own composition, alternating left/right), a materials and rules card grid (five paper swatches + three rules), and a minimal email-only contact. Palette: cream substrate, white / clay / sage / slate / walnut papers, one poppy red used exactly once. Type: Pretendard 800 for display, Pretendard 500 for body, IBM Plex Mono for metadata. Tight line-heights on display (0.95), relaxed on body (1.7). Every paper sits on a hard offset shadow (6-12px, no blur). No gradients inside any shape. Letter-spacing tuned for Korean (max -0.01em on display, 0 on body).</pre>
              <pre data-lang="ko" hidden>페이퍼 컷 일러스트레이션 작업실의 단일 페이지 포트폴리오를 디자인해줘. 다섯 섹션: hero(선언적 헤드라인 + 우측에 진짜 종이 컴포지션), manifesto(짧은 두 문단), 작업 셋(각 컴포지션 다름, 좌우 교차), materials & rules 카드 그리드(다섯 종이 swatch + 세 규칙), 미니멀 이메일 contact. 팔레트: 크림 substrate, 흰색/클레이/세이지/슬레이트/월넛 종이, 양귀비 빨강은 정확히 한 번만. 타입: 디스플레이 Pretendard 800, 본문 Pretendard 500, 메타데이터 IBM Plex Mono. 디스플레이 행간 0.95, 본문 행간 1.7. 모든 종이는 하드 오프셋 그림자 위에 (6–12px, blur 없음). 형태 내 그라데이션 금지. 한글 친화 letter-spacing (디스플레이 -0.01em 이하, 본문 0).</pre>
              <pre data-lang="ja" hidden>ペーパーカット作家のためのシングルページポートフォリオをデザインしてください。5セクション: hero(宣言的見出し + 右側に実物の紙の構図), manifesto(短い二段落), 主要作品3点(各構図は異なる、左右交互), materials & rules カードグリッド(紙のスウォッチ5つ + 規則3つ), ミニマルなメール連絡先。パレット: クリーム substrate、白/クレイ/セージ/スレート/ウォルナット紙、ポピー赤は厳密に一度のみ。タイプ: 見出し Pretendard 800、本文 Pretendard 500、メタ IBM Plex Mono。見出しの行送り 0.95、本文 1.7。すべての紙はハードオフセット影の上 (6–12px、ブラーなし)。形の中にグラデーション禁止。韓国語/日本語に合わせた letter-spacing 調整 (見出しは -0.01em 以下、本文は 0)。</pre>
              <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
            </details>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션">
          <a href="/pages/risograph-print.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            <span><span className="page-nav__label">이전</span>Risograph Print</span>
          </a>
          <div className="page-nav__divider" />
          <a href="/pages/macos-liquid-glass.html">
            <span><span className="page-nav__label">다음</span>macOS Liquid Glass</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
