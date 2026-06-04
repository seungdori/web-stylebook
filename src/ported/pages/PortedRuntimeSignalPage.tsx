import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedRuntimeSignalPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--runtime-signal">
      <div>
        <a className="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>
        <a className="page-back-link" href="/" data-i18n-aria="back.hub.aria" aria-label="Back to Hub">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span data-i18n="back.hub">Back to Hub</span>
        </a>
        <div className="page-shell">
          <div className="container">
            <header className="runtime-nav" aria-label="Runtime Signal style">
              <a className="brand" href="#main-content">
                <span className="brand__mark" aria-hidden="true">RS</span>
                <span>Runtime Signal</span>
              </a>
              <ul className="runtime-nav__links">
                <li><a href="#layer"><span data-lang="en">DNA</span><span data-lang="ko" hidden>DNA</span><span data-lang="ja" hidden>DNA</span></a></li>
                <li><a href="#visibility"><span data-lang="en">Anatomy</span><span data-lang="ko" hidden>구성</span><span data-lang="ja" hidden>構成</span></a></li>
                <li><a href="#examples"><span data-lang="en">Components</span><span data-lang="ko" hidden>컴포넌트</span><span data-lang="ja" hidden>コンポーネント</span></a></li>
                <li><a href="#faq"><span data-lang="en">FAQ</span><span data-lang="ko" hidden>FAQ</span><span data-lang="ja" hidden>FAQ</span></a></li>
              </ul>
              <div className="runtime-nav__actions">
                <div className="lang-dropdown" id="lang-dropdown">
                  <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
                  <ul className="lang-menu" role="menu">
                    <li><button role="menuitem" data-lang-select="en">English</button></li>
                    <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                    <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
                  </ul>
                </div>
                <a className="nav-button--secondary" href="#style-notes">
                  <span data-lang="en">View style notes</span>
                  <span data-lang="ko" hidden>스타일 노트 보기</span>
                  <span data-lang="ja" hidden>スタイルノートを見る</span>
                </a>
                <a className="nav-button" href="#prompt-block">
                  <span data-lang="en">Open the prompt</span>
                  <span data-lang="ko" hidden>프롬프트 열기</span>
                  <span data-lang="ja" hidden>プロンプトを見る</span>
                </a>
              </div>
            </header>
            <main id="main-content">
              <section className="hero">
                <div className="hero__body">
                  <p className="eyebrow" data-lang="en">dark technical style</p>
                  <p className="eyebrow" data-lang="ko" hidden>다크 기술 스타일</p>
                  <p className="eyebrow" data-lang="ja" hidden>ダーク技術スタイル</p>
                  <h1 data-lang="en">Technical trust comes from structure, restraint, and one controlled accent.</h1>
                  <h1 data-lang="ko" hidden>기술적 신뢰는 구조와 절제, 그리고 포인트 색 하나에서 나옵니다.</h1>
                  <h1 data-lang="ja" hidden>技術的な信頼感は、構造、節制、そして一つの差し色から生まれます。</h1>
                  <p className="hero__lede" data-lang="en">
                    Use Runtime Signal when a page should feel like a real technical product, not a concept shot.
                    The layout works best when the grid stays quiet, the panels stay flat, and the typography carries most of the authority.
                  </p>
                  <p className="hero__lede" data-lang="ko" hidden>
                    Runtime Signal은 페이지가 컨셉 샷이 아니라 실제 기술 제품처럼 보여야 할 때 잘 맞습니다.
                    그리드는 조용히, 패널은 플랫하게 두고, 화면의 중심은 타이포그래피가 잡게 하는 것이 핵심입니다.
                  </p>
                  <p className="hero__lede" data-lang="ja" hidden>
                    Runtime Signal は、ページをコンセプトショットではなく実際の技術製品のように見せたいときによく効きます。
                    グリッドは静かに、パネルはフラットに保ち、信頼感の大半をタイポグラフィに担わせるのがコツです。
                  </p>
                  <p className="hero__note" data-lang="en">
                    If the page starts feeling decorative, <span className="note-highlight">reduce color before you reduce structure</span>.
                  </p>
                  <p className="hero__note" data-lang="ko" hidden>
                    페이지가 장식적으로 느껴지기 시작하면, <span className="note-highlight">구조를 덜어내기 전에 색부터 줄이세요</span>.
                  </p>
                  <p className="hero__note" data-lang="ja" hidden>
                    ページが装飾的に感じ始めたら、<span className="note-highlight">構造を削る前にまず色を減らします</span>。
                  </p>
                  <div className="hero__actions">
                    <a className="nav-button" href="#layer">
                      <span data-lang="en">Read the rules</span>
                      <span data-lang="ko" hidden>핵심 기준 보기</span>
                      <span data-lang="ja" hidden>基準を見る</span>
                    </a>
                  </div>
                </div>
              </section>
              <section className="section section--center" id="layer">
                <p className="eyebrow" data-lang="en">core rules</p>
                <p className="eyebrow" data-lang="ko" hidden>핵심 기준</p>
                <p className="eyebrow" data-lang="ja" hidden>主要ルール</p>
                <h2 className="display-accent" data-lang="en">Three rules keep this style clean.</h2>
                <h2 className="display-accent" data-lang="ko" hidden>이 스타일은 세 가지 기준이면 깔끔하게 유지됩니다.</h2>
                <h2 className="display-accent" data-lang="ja" hidden>このスタイルは三つのルールで整います。</h2>
                <p className="section__intro" data-lang="en">
                  The goal is not to add more technical decoration. The goal is to let structure, type, and one accent create a steady operational tone.
                </p>
                <p className="section__intro" data-lang="ko" hidden>
                  기술적인 장식을 더하는 것이 목표가 아닙니다. 구조와 타이포, 포인트 색 하나로 차분하고 안정된 인상을 만드는 것이 목표입니다.
                </p>
                <p className="section__intro" data-lang="ja" hidden>
                  目的は技術的な装飾を増やすことではありません。構造とタイポ、差し色一つで、落ち着いた安定感を作ることです。
                </p>
                <div className="feature-grid">
                  <article className="feature-card">
                    <div className="feature-card__number">01</div>
                    <p className="feature-card__tag" data-lang="en">grid first</p>
                    <p className="feature-card__tag" data-lang="ko" hidden>그리드 우선</p>
                    <p className="feature-card__tag" data-lang="ja" hidden>グリッド優先</p>
                    <h3 data-lang="en">Keep the vertical lines faint and useful.</h3>
                    <h3 data-lang="ko" hidden>세로 라인은 희미하고 유용하게 남깁니다.</h3>
                    <h3 data-lang="ja" hidden>縦のラインは淡く、役に立つ状態で残します。</h3>
                    <p data-lang="en">The grid should support alignment and atmosphere. If it starts looking decorative, it is already too loud.</p>
                    <p data-lang="ko" hidden>그리드는 정렬과 분위기를 거들어야 합니다. 장식처럼 보이기 시작했다면 이미 너무 시끄럽다는 신호입니다.</p>
                    <p data-lang="ja" hidden>グリッドは整列と空気を支えるためにあります。装飾のように見え始めた時点で、すでに強すぎます。</p>
                  </article>
                  <article className="feature-card">
                    <div className="feature-card__number">02</div>
                    <p className="feature-card__tag" data-lang="en">type before chrome</p>
                    <p className="feature-card__tag" data-lang="ko" hidden>타이포 우선</p>
                    <p className="feature-card__tag" data-lang="ja" hidden>タイポ優先</p>
                    <h3 data-lang="en">Let the headline carry the authority.</h3>
                    <h3 data-lang="ko" hidden>화면의 중심은 헤드라인이 잡게 둡니다.</h3>
                    <h3 data-lang="ja" hidden>強さは見出しに担わせます。</h3>
                    <p data-lang="en">Use Instrument Sans for the main voice. Mono stays narrow and secondary, only for labels, times, and machine-like cues.</p>
                    <p data-lang="ko" hidden>본문의 목소리는 Instrument Sans가 맡고, 모노는 라벨이나 시각 정보 같은 보조 유틸리티에만 좁게 씁니다.</p>
                    <p data-lang="ja" hidden>主役の声は Instrument Sans が担い、モノはラベルや時刻のような補助的ユーティリティにだけ細く使います。</p>
                  </article>
                  <article className="feature-card">
                    <div className="feature-card__number">03</div>
                    <p className="feature-card__tag" data-lang="en">one accent only</p>
                    <p className="feature-card__tag" data-lang="ko" hidden>포인트 색 하나</p>
                    <p className="feature-card__tag" data-lang="ja" hidden>差し色は一つ</p>
                    <h3 data-lang="en">Keep the panels flat and let color stay rare.</h3>
                    <h3 data-lang="ko" hidden>패널은 플랫하게, 색은 드물게 씁니다.</h3>
                    <h3 data-lang="ja" hidden>パネルはフラットに、色はまれに使います。</h3>
                    <p data-lang="en">Mineral teal is enough for the main CTA and one focal phrase. Depth should come from spacing and borders, not shadows or multiple bright states.</p>
                    <p data-lang="ko" hidden>미네랄 틸 하나면 메인 CTA와 핵심 문장 하나를 강조하기에 충분합니다. 깊이는 그림자가 아니라 간격과 보더에서 나와야 합니다.</p>
                    <p data-lang="ja" hidden>ミネラルティールは一つで十分です。メインCTAと焦点となる一文だけに使います。奥行きは影ではなく、余白とボーダーから生み出します。</p>
                  </article>
                </div>
              </section>
              <section className="section" id="visibility">
                <p className="eyebrow" data-lang="en">example surface</p>
                <p className="eyebrow" data-lang="ko" hidden>예시 화면</p>
                <p className="eyebrow" data-lang="ja" hidden>画面例</p>
                <h2 data-lang="en">The components can stay product-like. The copy should stay explanatory.</h2>
                <h2 data-lang="ko" hidden>컴포넌트는 제품 화면처럼 두고, 문장은 설명형으로 유지합니다.</h2>
                <h2 data-lang="ja" hidden>コンポーネントは製品画面のまま、文章は解説型に保ちます。</h2>
                <p className="section__intro" data-lang="en">
                  A good style page still shows realistic UI. The difference is that each block explains the visual logic instead of pretending to sell a fictional feature set.
                </p>
                <p className="section__intro" data-lang="ko" hidden>
                  좋은 스타일 페이지도 현실적인 UI를 그대로 보여줍니다. 다만 가짜 기능을 파는 대신, 각 블록이 시각 논리를 설명한다는 점이 다릅니다.
                </p>
                <p className="section__intro" data-lang="ja" hidden>
                  良いスタイルページは現実的な UI をそのまま見せます。違いは、架空の機能を売るのではなく、視覚ロジックを各ブロックで説明することです。
                </p>
                <div className="trace-layout">
                  <article className="trace-panel" aria-label="Trace panel">
                    <div className="trace-panel__top">
                      <div>
                        <p className="trace-panel__title" data-lang="en">layout anatomy</p>
                        <p className="trace-panel__title" data-lang="ko" hidden>구성 해설</p>
                        <p className="trace-panel__title" data-lang="ja" hidden>構成解説</p>
                        <div className="trace-panel__run">runtime-signal / reference-page</div>
                      </div>
                      <span className="trace-badge" data-lang="en">annotated</span>
                      <span className="trace-badge" data-lang="ko" hidden>annotated</span>
                      <span className="trace-badge" data-lang="ja" hidden>annotated</span>
                    </div>
                    <div className="trace-list">
                      <div className="trace-row">
                        <div className="trace-row__time">01</div>
                        <div>
                          <div className="trace-row__title" data-lang="en">Eyebrow and mono label set the tone first</div>
                          <div className="trace-row__title" data-lang="ko" hidden>아이브로우와 모노 라벨이 먼저 톤을 잡습니다</div>
                          <div className="trace-row__title" data-lang="ja" hidden>アイブロウとモノラベルが先に空気を決めます</div>
                          <p className="trace-row__meta" data-lang="en">utility cues arrive before the headline, but never compete with it</p>
                          <p className="trace-row__meta" data-lang="ko" hidden>유틸리티 신호는 헤드라인보다 먼저 오되, 헤드라인과 경쟁하지는 않습니다</p>
                          <p className="trace-row__meta" data-lang="ja" hidden>ユーティリティの手がかりは見出しより先に出ても、決して競いません</p>
                        </div>
                        <span className="trace-badge trace-status trace-status--ok" data-lang="en">keep</span>
                        <span className="trace-badge trace-status trace-status--ok" data-lang="ko" hidden>유지</span>
                        <span className="trace-badge trace-status trace-status--ok" data-lang="ja" hidden>維持</span>
                      </div>
                      <div className="trace-row">
                        <div className="trace-row__time">02</div>
                        <div>
                          <div className="trace-row__title" data-lang="en">Headline spans multiple lines without theatrical styling</div>
                          <div className="trace-row__title" data-lang="ko" hidden>헤드라인은 과장된 연출 없이 여러 줄로 힘을 냅니다</div>
                          <div className="trace-row__title" data-lang="ja" hidden>見出しは大げさな演出なしに、複数行で強さを出します</div>
                          <p className="trace-row__meta" data-lang="en">authority comes from size, weight, and line breaks</p>
                          <p className="trace-row__meta" data-lang="ko" hidden>힘은 크기와 굵기, 줄바꿈에서 나옵니다</p>
                          <p className="trace-row__meta" data-lang="ja" hidden>強さはサイズ、太さ、改行から生まれます</p>
                        </div>
                        <span className="trace-badge trace-status trace-status--ok" data-lang="en">scale</span>
                        <span className="trace-badge trace-status trace-status--ok" data-lang="ko" hidden>크기</span>
                        <span className="trace-badge trace-status trace-status--ok" data-lang="ja" hidden>スケール</span>
                      </div>
                      <div className="trace-row">
                        <div className="trace-row__time">03</div>
                        <div>
                          <div className="trace-row__title" data-lang="en">Accent appears once in the focal sentence and active control</div>
                          <div className="trace-row__title" data-lang="ko" hidden>포인트 색은 핵심 문장과 활성 컨트롤에 한 번만 나옵니다</div>
                          <div className="trace-row__title" data-lang="ja" hidden>差し色は、焦点となる一文とアクティブ要素に一度だけ現れます</div>
                          <p className="trace-row__meta" data-lang="en">one bright decision is stronger than five small ones</p>
                          <p className="trace-row__meta" data-lang="ko" hidden>과감한 결정 하나가 작은 강조 다섯 개보다 강합니다</p>
                          <p className="trace-row__meta" data-lang="ja" hidden>思い切った判断ひとつの方が、小さな強調を五つ重ねるより強く働きます</p>
                        </div>
                        <span className="trace-badge trace-status trace-status--retry" data-lang="en">limit</span>
                        <span className="trace-badge trace-status trace-status--retry" data-lang="ko" hidden>제한</span>
                        <span className="trace-badge trace-status trace-status--retry" data-lang="ja" hidden>制限</span>
                      </div>
                      <div className="trace-row">
                        <div className="trace-row__time">04</div>
                        <div>
                          <div className="trace-row__title" data-lang="en">Panels stay flat, bordered, and close in value</div>
                          <div className="trace-row__title" data-lang="ko" hidden>패널은 플랫하게, 보더는 얇게, 명도 차는 작게 유지합니다</div>
                          <div className="trace-row__title" data-lang="ja" hidden>パネルはフラットに、ボーダーは細く、明度差は小さく保ちます</div>
                          <p className="trace-row__meta" data-lang="en">depth comes from layering and spacing, not from shadows</p>
                          <p className="trace-row__meta" data-lang="ko" hidden>깊이는 그림자가 아니라 겹쳐 쌓기와 간격에서 나옵니다</p>
                          <p className="trace-row__meta" data-lang="ja" hidden>奥行きは影ではなく、レイヤーと余白から生まれます</p>
                        </div>
                        <span className="trace-badge trace-status trace-status--resume" data-lang="en">surface</span>
                        <span className="trace-badge trace-status trace-status--resume" data-lang="ko" hidden>패널</span>
                        <span className="trace-badge trace-status trace-status--resume" data-lang="ja" hidden>面</span>
                      </div>
                      <div className="trace-row">
                        <div className="trace-row__time">05</div>
                        <div>
                          <div className="trace-row__title" data-lang="en">FAQ, notes, and prompt blocks reuse the same shell language</div>
                          <div className="trace-row__title" data-lang="ko" hidden>FAQ, 노트, 프롬프트 블록도 같은 셸 언어를 재사용합니다</div>
                          <div className="trace-row__title" data-lang="ja" hidden>FAQ、ノート、プロンプトも同じシェル言語を再利用します</div>
                          <p className="trace-row__meta" data-lang="en">long-form sections should still feel like one consistent system</p>
                          <p className="trace-row__meta" data-lang="ko" hidden>긴 섹션도 결국 하나의 일관된 시스템처럼 보여야 합니다</p>
                          <p className="trace-row__meta" data-lang="ja" hidden>長いセクションでも最終的には一つの一貫したシステムに見えるべきです</p>
                        </div>
                        <span className="trace-badge trace-status trace-status--complete" data-lang="en">repeat</span>
                        <span className="trace-badge trace-status trace-status--complete" data-lang="ko" hidden>반복</span>
                        <span className="trace-badge trace-status trace-status--complete" data-lang="ja" hidden>反復</span>
                      </div>
                    </div>
                  </article>
                  <div className="proof-stack">
                    <article className="metric-card">
                      <p className="metric-card__eyebrow" data-lang="en">good fit</p>
                      <p className="metric-card__eyebrow" data-lang="ko" hidden>잘 맞는 범위</p>
                      <p className="metric-card__eyebrow" data-lang="ja" hidden>相性のよい範囲</p>
                      <div className="metric-card__value" data-lang="en">Docs, ops, admin</div>
                      <div className="metric-card__value" data-lang="ko" hidden>문서, 운영, 어드민</div>
                      <div className="metric-card__value" data-lang="ja" hidden>Docs・運用・管理</div>
                      <p data-lang="en">Use it for developer tools, documentation, scheduling, admin systems, and other screens where calm technical trust matters more than warmth.</p>
                      <p data-lang="ko" hidden>개발자 도구, 문서, 스케줄링, 어드민처럼 따뜻함보다 차분한 기술 신뢰가 중요한 화면에 잘 맞습니다.</p>
                      <p data-lang="ja" hidden>開発者ツール、文書、スケジューリング、管理画面など、温かさより落ち着いた技術的信頼が重要な画面に向いています。</p>
                    </article>
                    <article className="quote-card">
                      <p className="quote-card__eyebrow" data-lang="en">avoid</p>
                      <p className="quote-card__eyebrow" data-lang="ko" hidden>피할 것</p>
                      <p className="quote-card__eyebrow" data-lang="ja" hidden>避けること</p>
                      <blockquote data-lang="en">“Too many chips, multiple bright accents, heavy shadows, and futuristic copy will break the tone faster than any layout mistake.”</blockquote>
                      <blockquote data-lang="ko" hidden>“칩을 너무 많이 두거나, 밝은 색을 여러 개 쓰거나, 그림자를 무겁게 깔거나, 미래지향 문구를 넣으면 어떤 레이아웃 실수보다 톤이 먼저 무너집니다.”</blockquote>
                      <blockquote data-lang="ja" hidden>「チップの詰め込みすぎ、明るい色の使いすぎ、重い影、未来志向すぎるコピー。どんなレイアウトのミスよりも、これらが先にトーンを壊します。」</blockquote>
                      <div className="quote-card__meta" data-lang="en">Common failure mode of this style</div>
                      <div className="quote-card__meta" data-lang="ko" hidden>이 스타일에서 가장 흔한 실패 패턴</div>
                      <div className="quote-card__meta" data-lang="ja" hidden>このスタイルで最も多い失敗パターン</div>
                    </article>
                  </div>
                </div>
              </section>
              <section className="section" id="examples">
                <p className="eyebrow" data-lang="en">component patterns</p>
                <p className="eyebrow" data-lang="ko" hidden>컴포넌트 패턴</p>
                <p className="eyebrow" data-lang="ja" hidden>コンポーネントパターン</p>
                <h2 data-lang="en">Reusable building blocks for an operational surface.</h2>
                <h2 data-lang="ko" hidden>운영 화면에서 다시 쓰는 기본 컴포넌트들.</h2>
                <h2 data-lang="ja" hidden>運用画面で繰り返し使う基本コンポーネント。</h2>
                <p className="section__intro" data-lang="en">
                  These are the small, repeated elements that hold the page together — status rows, toolbars, stat strips, tabs, and inline notices.
                  Every one of them stays flat, bordered, and quiet, so the layout never starts competing with the content.
                </p>
                <p className="section__intro" data-lang="ko" hidden>
                  페이지를 지탱하는 작고 반복되는 요소들입니다 — 상태 행, 툴바, 스탯 스트립, 탭, 인라인 노티스.
                  모두 플랫하게, 보더 한 줄로 정리하고 조용히 두기 때문에 레이아웃이 콘텐츠와 경쟁하지 않습니다.
                </p>
                <p className="section__intro" data-lang="ja" hidden>
                  ページを支える小さな繰り返し要素です — ステータス行、ツールバー、スタットストリップ、タブ、インライン通知。
                  すべてフラットで、ボーダー一本に整い、静かに保たれているため、レイアウトがコンテンツと競合しません。
                </p>

                <div className="example-grid">
                  <article className="example-card example-card--wide">
                    <header className="example-card__head">
                      <div>
                        <p className="example-card__eyebrow" data-lang="en">status table</p>
                        <p className="example-card__eyebrow" data-lang="ko" hidden>상태 테이블</p>
                        <p className="example-card__eyebrow" data-lang="ja" hidden>ステータス表</p>
                        <h3 data-lang="en">Service health rows</h3>
                        <h3 data-lang="ko" hidden>서비스 상태 행</h3>
                        <h3 data-lang="ja" hidden>サービス状態の行</h3>
                      </div>
                      <span className="example-card__stamp">live · 30s</span>
                    </header>
                    <table className="status-table" aria-label="Service status">
                      <thead>
                        <tr>
                          <th scope="col" data-lang="en">Service</th>
                          <th scope="col" data-lang="ko" hidden>서비스</th>
                          <th scope="col" data-lang="ja" hidden>サービス</th>
                          <th scope="col" data-lang="en">Status</th>
                          <th scope="col" data-lang="ko" hidden>상태</th>
                          <th scope="col" data-lang="ja" hidden>状態</th>
                          <th scope="col" data-lang="en">p95</th>
                          <th scope="col" data-lang="ko" hidden>p95</th>
                          <th scope="col" data-lang="ja" hidden>p95</th>
                          <th scope="col" data-lang="en">Last check</th>
                          <th scope="col" data-lang="ko" hidden>최근 체크</th>
                          <th scope="col" data-lang="ja" hidden>最終確認</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><span className="status-dot status-dot--ok" aria-hidden="true" />api.gateway</td>
                          <td><span className="state-pill state-pill--ok" data-lang="en">healthy</span><span className="state-pill state-pill--ok" data-lang="ko" hidden>정상</span><span className="state-pill state-pill--ok" data-lang="ja" hidden>正常</span></td>
                          <td className="num">142ms</td>
                          <td className="num">12s</td>
                        </tr>
                        <tr>
                          <td><span className="status-dot status-dot--warn" aria-hidden="true" />queue.dispatch</td>
                          <td><span className="state-pill state-pill--warn" data-lang="en">degraded</span><span className="state-pill state-pill--warn" data-lang="ko" hidden>저하됨</span><span className="state-pill state-pill--warn" data-lang="ja" hidden>低下</span></td>
                          <td className="num">488ms</td>
                          <td className="num">31s</td>
                        </tr>
                        <tr>
                          <td><span className="status-dot status-dot--ok" aria-hidden="true" />store.primary</td>
                          <td><span className="state-pill state-pill--ok" data-lang="en">healthy</span><span className="state-pill state-pill--ok" data-lang="ko" hidden>정상</span><span className="state-pill state-pill--ok" data-lang="ja" hidden>正常</span></td>
                          <td className="num">38ms</td>
                          <td className="num">9s</td>
                        </tr>
                        <tr>
                          <td><span className="status-dot status-dot--err" aria-hidden="true" />jobs.scheduler</td>
                          <td><span className="state-pill state-pill--err" data-lang="en">failing</span><span className="state-pill state-pill--err" data-lang="ko" hidden>실패</span><span className="state-pill state-pill--err" data-lang="ja" hidden>失敗</span></td>
                          <td className="num">—</td>
                          <td className="num">2m</td>
                        </tr>
                      </tbody>
                    </table>
                  </article>

                  <article className="example-card">
                    <header className="example-card__head">
                      <div>
                        <p className="example-card__eyebrow" data-lang="en">toolbar</p>
                        <p className="example-card__eyebrow" data-lang="ko" hidden>툴바</p>
                        <p className="example-card__eyebrow" data-lang="ja" hidden>ツールバー</p>
                        <h3 data-lang="en">Search and filter row</h3>
                        <h3 data-lang="ko" hidden>검색과 필터 행</h3>
                        <h3 data-lang="ja" hidden>検索とフィルター行</h3>
                      </div>
                    </header>
                    <div className="toolbar">
                      <label className="toolbar__field">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input data-lang="en" type="search" placeholder="Search runs, services, jobs" aria-label="Search" readOnly />
                        <input data-lang="ko" type="search" placeholder="실행, 서비스, 작업 검색" aria-label="검색" readOnly hidden />
                        <input data-lang="ja" type="search" placeholder="実行・サービス・ジョブを検索" aria-label="検索" readOnly hidden />
                        <span className="toolbar__hint">⌘K</span>
                      </label>
                      <div className="segmented" role="tablist" aria-label="Filter">
                        <button type="button" className="segmented__item is-active" role="tab" aria-selected="true"><span data-lang="en">All</span><span data-lang="ko" hidden>전체</span><span data-lang="ja" hidden>全て</span></button>
                        <button type="button" className="segmented__item" role="tab" aria-selected="false"><span data-lang="en">Errors</span><span data-lang="ko" hidden>오류</span><span data-lang="ja" hidden>エラー</span></button>
                        <button type="button" className="segmented__item" role="tab" aria-selected="false"><span data-lang="en">Retries</span><span data-lang="ko" hidden>재시도</span><span data-lang="ja" hidden>リトライ</span></button>
                      </div>
                    </div>
                  </article>

                  <article className="example-card">
                    <header className="example-card__head">
                      <div>
                        <p className="example-card__eyebrow" data-lang="en">stat strip</p>
                        <p className="example-card__eyebrow" data-lang="ko" hidden>스탯 스트립</p>
                        <p className="example-card__eyebrow" data-lang="ja" hidden>スタットストリップ</p>
                        <h3 data-lang="en">Inline operational metrics</h3>
                        <h3 data-lang="ko" hidden>운영 지표 인라인</h3>
                        <h3 data-lang="ja" hidden>運用指標のインライン</h3>
                      </div>
                    </header>
                    <dl className="stat-strip">
                      <div>
                        <dt data-lang="en">Success rate</dt>
                        <dt data-lang="ko" hidden>성공률</dt>
                        <dt data-lang="ja" hidden>成功率</dt>
                        <dd>99.42<span className="stat-strip__unit">%</span></dd>
                        <p className="stat-strip__delta stat-strip__delta--up">+0.18</p>
                      </div>
                      <div>
                        <dt data-lang="en">Runs / hour</dt>
                        <dt data-lang="ko" hidden>시간당 실행</dt>
                        <dt data-lang="ja" hidden>毎時実行</dt>
                        <dd>1.4<span className="stat-strip__unit">k</span></dd>
                        <p className="stat-strip__delta stat-strip__delta--down">-22</p>
                      </div>
                      <div>
                        <dt data-lang="en">Open incidents</dt>
                        <dt data-lang="ko" hidden>진행 중 인시던트</dt>
                        <dt data-lang="ja" hidden>進行中インシデント</dt>
                        <dd>3</dd>
                        <p className="stat-strip__delta">2 acknowledged</p>
                      </div>
                    </dl>
                  </article>

                  <article className="example-card">
                    <header className="example-card__head">
                      <div>
                        <p className="example-card__eyebrow" data-lang="en">tabs</p>
                        <p className="example-card__eyebrow" data-lang="ko" hidden>탭</p>
                        <p className="example-card__eyebrow" data-lang="ja" hidden>タブ</p>
                        <h3 data-lang="en">Underlined navigation</h3>
                        <h3 data-lang="ko" hidden>밑줄형 내비게이션</h3>
                        <h3 data-lang="ja" hidden>下線型ナビゲーション</h3>
                      </div>
                    </header>
                    <nav className="line-tabs" aria-label="View">
                      <a href="#examples" className="is-active"><span data-lang="en">Overview</span><span data-lang="ko" hidden>개요</span><span data-lang="ja" hidden>概要</span></a>
                      <a href="#examples"><span data-lang="en">Logs</span><span data-lang="ko" hidden>로그</span><span data-lang="ja" hidden>ログ</span></a>
                      <a href="#examples"><span data-lang="en">Settings</span><span data-lang="ko" hidden>설정</span><span data-lang="ja" hidden>設定</span></a>
                      <a href="#examples" className="line-tabs__muted">
                        <span data-lang="en">Audit</span><span data-lang="ko" hidden>감사 로그</span><span data-lang="ja" hidden>監査</span>
                        <span className="line-tabs__badge">12</span>
                      </a>
                    </nav>
                    <p className="example-card__caption" data-lang="en">A single underline marks the active view. Keep the rest neutral so the eye picks up the current section instantly.</p>
                    <p className="example-card__caption" data-lang="ko" hidden>활성 뷰는 밑줄 한 줄로만 표시합니다. 나머지는 중립으로 두어 현재 섹션이 한눈에 들어오게 합니다.</p>
                    <p className="example-card__caption" data-lang="ja" hidden>アクティブビューは一本の下線だけで示し、残りは中立に保って現在のセクションが一目で分かるようにします。</p>
                  </article>

                  <article className="example-card">
                    <header className="example-card__head">
                      <div>
                        <p className="example-card__eyebrow" data-lang="en">event payload</p>
                        <p className="example-card__eyebrow" data-lang="ko" hidden>이벤트 페이로드</p>
                        <p className="example-card__eyebrow" data-lang="ja" hidden>イベントペイロード</p>
                        <h3 data-lang="en">Mono code block</h3>
                        <h3 data-lang="ko" hidden>모노 코드 블록</h3>
                        <h3 data-lang="ja" hidden>モノのコードブロック</h3>
                      </div>
                      <span className="example-card__stamp">json</span>
                    </header>
                    <pre className="code-block"><code>{`{
  "id": "run_8c41a9",
  "status": "retry",
  "attempt": 2,
  "duration_ms": 488,
  "queued_at": "10:24:11Z"
}`}</code></pre>
                  </article>

                  <article className="example-card example-card--wide">
                    <header className="example-card__head">
                      <div>
                        <p className="example-card__eyebrow" data-lang="en">inline notice</p>
                        <p className="example-card__eyebrow" data-lang="ko" hidden>인라인 노티스</p>
                        <p className="example-card__eyebrow" data-lang="ja" hidden>インライン通知</p>
                        <h3 data-lang="en">One-line operational notice</h3>
                        <h3 data-lang="ko" hidden>한 줄짜리 운영 알림</h3>
                        <h3 data-lang="ja" hidden>一行の運用通知</h3>
                      </div>
                    </header>
                    <div className="notice notice--info">
                      <span className="notice__tag">info</span>
                      <p data-lang="en">
                        Scheduler ran the catch-up job at 10:18. Two queues were drained.
                        <a href="#examples"> View details</a>
                      </p>
                      <p data-lang="ko" hidden>
                        스케줄러가 10:18에 보정 작업을 실행했고, 두 개의 큐가 정상화되었습니다.
                        <a href="#examples"> 자세히 보기</a>
                      </p>
                      <p data-lang="ja" hidden>
                        スケジューラが10:18にキャッチアップジョブを実行し、2件のキューを処理しました。
                        <a href="#examples"> 詳細を見る</a>
                      </p>
                    </div>
                    <div className="notice notice--warn">
                      <span className="notice__tag">warn</span>
                      <p data-lang="en">
                        Three retries hit the dispatch queue in the last five minutes. The pattern looks transient, but worth a glance.
                      </p>
                      <p data-lang="ko" hidden>
                        최근 5분 동안 디스패치 큐에서 재시도가 세 번 있었습니다. 일시적인 현상으로 보이지만, 한 번 확인해 두면 좋습니다.
                      </p>
                      <p data-lang="ja" hidden>
                        直近5分でディスパッチキューに3回の再試行が発生しました。一時的なパターンに見えますが、一度確認することをおすすめします。
                      </p>
                    </div>
                  </article>
                </div>
              </section>
              <section className="section" id="faq">
                <p className="eyebrow" data-lang="en">faq</p>
                <p className="eyebrow" data-lang="ko" hidden>faq</p>
                <p className="eyebrow" data-lang="ja" hidden>faq</p>
                <h2 data-lang="en">Common questions when applying this style to a real product page.</h2>
                <h2 data-lang="ko" hidden>이 스타일을 실제 제품 페이지에 적용할 때 자주 나오는 질문.</h2>
                <h2 data-lang="ja" hidden>このスタイルを実際のプロダクトページへ適用するときによく出る質問。</h2>
                <div className="faq">
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">Is this style only for developer tools?</span>
                      <span data-lang="ko" hidden>이 스타일은 개발자 도구에만 어울리나요?</span>
                      <span data-lang="ja" hidden>このスタイルは開発者ツール専用ですか。</span>
                    </summary>
                    <p data-lang="en">No. It also works for scheduling, admin systems, finance ops, and documentation products whenever operational trust matters more than warmth or spectacle.</p>
                    <p data-lang="ko" hidden>아닙니다. 따뜻함이나 연출보다 운영형 신뢰가 더 중요한 스케줄링, 관리 시스템, 재무 운영, 문서 제품에도 잘 맞습니다.</p>
                    <p data-lang="ja" hidden>いいえ。温かさや演出より運用上の信頼感が重要なスケジューリング、管理システム、財務運用、文書製品にも向いています。</p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">Should the grid always be visible?</span>
                      <span data-lang="ko" hidden>그리드는 항상 보여야 하나요?</span>
                      <span data-lang="ja" hidden>グリッドは常に見えているべきですか。</span>
                    </summary>
                    <p data-lang="en">Yes, but faintly. If the viewer notices the grid before the content, it is already too strong.</p>
                    <p data-lang="ko" hidden>네, 다만 아주 희미하게만 보여야 합니다. 콘텐츠보다 그리드가 먼저 보인다면 이미 너무 강한 것입니다.</p>
                    <p data-lang="ja" hidden>はい。ただしごく淡くです。内容より先にグリッドが目に入るなら、すでに強すぎます。</p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">Can I use more than one bright accent?</span>
                      <span data-lang="ko" hidden>밝은 포인트 색을 여러 개 써도 되나요?</span>
                      <span data-lang="ja" hidden>明るい差し色を複数使ってもいいですか。</span>
                    </summary>
                    <p data-lang="en">Keep one dominant teal accent. A muted brass aside is acceptable once, but multiple bright accents make the page feel like a concept board.</p>
                    <p data-lang="ko" hidden>주 포인트 색은 틸 하나로 유지하세요. 톤다운된 브라스를 보조로 한 번 쓰는 정도는 괜찮지만, 밝은 색이 여러 개면 페이지가 컨셉 보드처럼 보입니다.</p>
                    <p data-lang="ja" hidden>主役の差し色はティール一つに保ちます。落ち着いたブラスの補助強調は一度なら許容できますが、明るい色が複数あるとコンセプトボードのように見えます。</p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">What breaks the style fastest?</span>
                      <span data-lang="ko" hidden>이 스타일을 가장 빨리 망가뜨리는 요소는 무엇인가요?</span>
                      <span data-lang="ja" hidden>このスタイルを最も早く壊す要素は何ですか。</span>
                    </summary>
                    <p data-lang="en">Glass effects, oversized gradients, thick shadows, or too many chip colors. The page should feel technical, not theatrical.</p>
                    <p data-lang="ko" hidden>글래스 효과, 과한 그라데이션, 두꺼운 그림자, 지나치게 많은 칩 색입니다. 이 페이지는 극적이기보다 기술적으로 보여야 합니다.</p>
                    <p data-lang="ja" hidden>グラス効果、大きすぎるグラデーション、厚いシャドウ、色数の多すぎるチップです。このページは劇的ではなく技術的に見えるべきです。</p>
                  </details>
                </div>
              </section>
              <section className="section" id="style-notes">
                <p className="eyebrow" data-lang="en">style reference</p>
                <p className="eyebrow" data-lang="ko" hidden>스타일 레퍼런스</p>
                <p className="eyebrow" data-lang="ja" hidden>スタイルリファレンス</p>
                <h2 data-lang="en">The page should feel technical, not theatrical.</h2>
                <h2 data-lang="ko" hidden>이 페이지는 극적이기보다 기술적으로 정돈되어 보여야 합니다.</h2>
                <h2 data-lang="ja" hidden>このページはドラマチックというより、技術的に整って見えるべきです。</h2>
                <p className="section__intro" data-lang="en">
                  This style works when the typography is clean, the grid is visible but quiet, and the accent color is restrained enough to feel intentional.
                </p>
                <p className="section__intro" data-lang="ko" hidden>
                  이 스타일은 타이포가 깔끔하고, 그리드는 보이되 조용하며, 포인트 색이 의도적으로 절제되어 있을 때 가장 잘 작동합니다.
                </p>
                <p className="section__intro" data-lang="ja" hidden>
                  このスタイルは、タイポグラフィがクリーンで、グリッドが見えても静かで、差し色が意図的に抑えられているときに最も成立します。
                </p>
                <div className="notes-grid">
                  <article className="note-card">
                    <p className="note-card__eyebrow" data-lang="en">type system</p>
                    <p className="note-card__eyebrow" data-lang="ko" hidden>타입 시스템</p>
                    <p className="note-card__eyebrow" data-lang="ja" hidden>タイプシステム</p>
                    <h3 data-lang="en">Use a crisp grotesk for meaning, mono only for utility.</h3>
                    <h3 data-lang="ko" hidden>의미 전달은 선명한 그로테스크로, 유틸리티 정보만 모노로 처리합니다.</h3>
                    <h3 data-lang="ja" hidden>意味は鮮明なグロテスクで、ユーティリティ情報だけをモノにします。</h3>
                    <p data-lang="en">Large headlines do the emotional work. Mono labels, timestamps, and tags stay secondary and precise.</p>
                    <p data-lang="ko" hidden>인상은 큰 헤드라인이 만들고, 모노 라벨과 시각 정보는 정밀한 보조 요소로 남깁니다.</p>
                    <p data-lang="ja" hidden>感情に訴える役割は大きな見出しが担い、モノのラベルや時刻情報は精密な脇役にとどめます。</p>
                    <ul data-lang="en">
                      <li>Clean sans for every headline and paragraph.</li>
                      <li>Mono only for labels, times, and machine-like data.</li>
                    </ul>
                    <ul data-lang="ko" hidden>
                      <li>모든 헤드라인과 문단은 깨끗한 산세리프로 처리합니다.</li>
                      <li>모노는 라벨, 시각, 기계적인 데이터에만 씁니다.</li>
                    </ul>
                    <ul data-lang="ja" hidden>
                      <li>見出しと段落はすべてクリーンなサンセリフで組みます。</li>
                      <li>モノはラベル、時刻、機械的データにだけ使います。</li>
                    </ul>
                  </article>
                  <article className="note-card">
                    <p className="note-card__eyebrow" data-lang="en">grid atmosphere</p>
                    <p className="note-card__eyebrow" data-lang="ko" hidden>그리드 분위기</p>
                    <p className="note-card__eyebrow" data-lang="ja" hidden>グリッドの空気</p>
                    <h3 data-lang="en">Let the column lines exist, but never dominate.</h3>
                    <h3 data-lang="ko" hidden>컬럼 라인은 존재하되 주인공이 되어선 안 됩니다.</h3>
                    <h3 data-lang="ja" hidden>カラムラインは存在してよいですが、主役になってはいけません。</h3>
                    <p data-lang="en">The faint grid gives the page technical posture. It should support alignment, not turn into decoration.</p>
                    <p data-lang="ko" hidden>희미한 그리드는 페이지에 기술적인 태도를 더합니다. 정렬을 돕는 선이어야지 장식이 되어선 안 됩니다.</p>
                    <p data-lang="ja" hidden>淡いグリッドはページに技術的な姿勢を与えます。整列を支える線であって、装飾になってはいけません。</p>
                    <ul data-lang="en">
                      <li>Low-contrast vertical rules only.</li>
                      <li>Generous spacing keeps the page from feeling noisy.</li>
                    </ul>
                    <ul data-lang="ko" hidden>
                      <li>대비가 낮은 세로 라인만 사용합니다.</li>
                      <li>넉넉한 간격으로 페이지가 시끄러워지지 않게 합니다.</li>
                    </ul>
                    <ul data-lang="ja" hidden>
                      <li>低コントラストの縦線だけを使います。</li>
                      <li>十分な余白でページがうるさくならないようにします。</li>
                    </ul>
                  </article>
                  <article className="note-card">
                    <p className="note-card__eyebrow" data-lang="en">accent control</p>
                    <p className="note-card__eyebrow" data-lang="ko" hidden>포인트 색 제어</p>
                    <p className="note-card__eyebrow" data-lang="ja" hidden>アクセント制御</p>
                    <h3 data-lang="en">Let mineral teal lead, and keep brass as a single aside.</h3>
                    <h3 data-lang="ko" hidden>미네랄 틸을 주역으로 두고, 브라스는 보조로 한 번만 씁니다.</h3>
                    <h3 data-lang="ja" hidden>ミネラルティールを主役にして、ブラスは一度だけ脇役に使います。</h3>
                    <p data-lang="en">Mineral teal carries the signature. Muted brass can stress one short phrase or one secondary state. Everything else stays neutral.</p>
                    <p data-lang="ko" hidden>시그니처는 미네랄 틸이 맡고, 톤다운된 브라스는 짧은 문구 하나나 보조 상태 하나만 강조합니다. 나머지는 중립으로 둡니다.</p>
                    <p data-lang="ja" hidden>ミネラルティールがシグネチャを担い、落ち着いたブラスは短い一文か補助状態を一度だけ強調します。残りは中立に保ちます。</p>
                    <ul data-lang="en">
                      <li>No rainbow treatment or glowing gradients.</li>
                      <li>Color should explain hierarchy, not mood-board the page.</li>
                    </ul>
                    <ul data-lang="ko" hidden>
                      <li>무지개 처리나 글로우 그라데이션은 쓰지 않습니다.</li>
                      <li>색은 페이지를 무드보드로 만드는 게 아니라 위계를 설명해야 합니다.</li>
                    </ul>
                    <ul data-lang="ja" hidden>
                      <li>虹色処理やグローグラデーションは使いません。</li>
                      <li>色はムードではなく、階層を説明するために使います。</li>
                    </ul>
                  </article>
                </div>
                <section className="prompt" id="prompt-block">
                  <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
                  <pre data-lang="en">Design a landing page or style-reference page in Runtime Signal style — a dark technical interface with faint column grid lines, crisp grotesk typography, mono utility labels, and restrained mineral-teal accents.{"\n"}{"\n"}This is not a flashy concept page.{"\n"}It should feel like a credible product or internal design reference that already looks calm and production-ready.{"\n"}{"\n"}Choose a believable category such as developer tools, workflow control, documentation, internal operations, incident review, or scheduling.{"\n"}Avoid AI spectacle, glossy startup hype, luxury branding, neon cyberpunk, or decorative analytics dashboards.{"\n"}{"\n"}STYLE DNA:{"\n"}- dark canvas with subtle vertical grid lines{"\n"}- extremely clean sans-serif typography{"\n"}- mono used only for utility labels and timestamps{"\n"}- large, direct headlines{"\n"}- restrained mineral-teal accent with optional muted brass for one inline emphasis{"\n"}- technical but readable{"\n"}- no visual clutter{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #0b0b0c{"\n"}--surface: #101113{"\n"}--surface-strong: #15171b{"\n"}--surface-soft: #0f1012{"\n"}--text: #f1f3f5{"\n"}--muted: #9a9daa{"\n"}--line: rgba(255,255,255,0.08){"\n"}--line-strong: rgba(255,255,255,0.14){"\n"}--accent: #74c2b4{"\n"}--accent-alt: #b89663{"\n"}--accent-cool: #8ea0ff{"\n"}No gradients as the main visual effect. No blur-heavy glassmorphism.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Headings + body: Instrument Sans, Inter, or similarly crisp neutral grotesk{"\n"}Utility labels/code/meta: IBM Plex Mono or similar clean mono{"\n"}H1: clamp(3rem, 7vw, 5.4rem), weight 800, line-height 0.96{"\n"}H2: clamp(2.2rem, 5vw, 4.2rem), weight 800, line-height 0.98{"\n"}H3: 1.5rem, weight 700{"\n"}Body: 1rem, line-height 1.7{"\n"}Meta: 0.78rem to 0.875rem, mono, lowercase{"\n"}{"\n"}LAYOUT:{"\n"}- max-width around 1160px{"\n"}- hero content aligned inside a 12-column structure, with the main copy offset from the left edge{"\n"}- large left-aligned hero{"\n"}- centered second section headline{"\n"}- 2x2 feature grid{"\n"}- one annotated interface panel paired with two supporting explanation cards{"\n"}- FAQ{"\n"}- style prompt block near the end{"\n"}- fixed bottom page navigation{"\n"}- mobile breakpoint around 768px{"\n"}{"\n"}COMPONENT RULES:{"\n"}- borders: 1px only{"\n"}- card radius: around 14px to 18px{"\n"}- shadows: very subtle or none{"\n"}- cards: dark flat panels, no hover lift{"\n"}- buttons: understated dark buttons or one bright solid CTA{"\n"}- links: underline only in footer/support contexts{"\n"}- motion: hover transitions only, 160ms max{"\n"}{"\n"}COPY TONE:{"\n"}- direct{"\n"}- technical{"\n"}- style-explanatory, not hype-heavy{"\n"}- specific and readable by both designers and product teams{"\n"}- written like a real company or internal design reference{"\n"}{"\n"}FORBIDDEN:{"\n"}- glowing hero blobs{"\n"}- thick shadows{"\n"}- colorful 3D objects{"\n"}- giant gradient text everywhere{"\n"}- decorative charts without operational meaning{"\n"}- glassmorphism{"\n"}- abstract “future” marketing art{"\n"}- anything that looks like an AI-generated SaaS concept shot{"\n"}{"\n"}OUTPUT:{"\n"}1) CSS custom properties{"\n"}2) semantic HTML + CSS{"\n"}3) responsive desktop/tablet/mobile layout{"\n"}4) accessible contrast{"\n"}5) no horizontal scroll{"\n"}6) visible but restrained grid structure</pre>
                  <pre data-lang="ko" hidden>Runtime Signal 스타일의 랜딩 페이지 또는 스타일 레퍼런스 페이지를 디자인해줘 — 희미한 컬럼 그리드, 선명한 그로테스크 타이포그래피, 모노 유틸리티 라벨, 절제된 미네랄 틸 포인트가 있는 다크 기술 인터페이스.{"\n"}{"\n"}이건 화려한 컨셉 페이지가 아니다.{"\n"}차분하고 이미 프로덕션에 올릴 수 있는 실제 제품이나 내부 디자인 레퍼런스처럼 보여야 한다.{"\n"}{"\n"}개발자 도구, 워크플로 제어, 문서화, 내부 운영, 인시던트 검토, 스케줄링처럼 현실적인 카테고리를 선택해라.{"\n"}AI 과장 연출, 광택 있는 스타트업 하이프, 럭셔리 브랜딩, 네온 사이버펑크, 장식용 분석 대시보드는 피하라.{"\n"}{"\n"}STYLE DNA:{"\n"}- 다크 캔버스와 은은한 세로 그리드 라인{"\n"}- 매우 깔끔한 산세리프 타이포그래피{"\n"}- 모노는 유틸리티 라벨과 시각 정보에만 사용{"\n"}- 크고 직접적인 헤드라인{"\n"}- 절제된 미네랄 틸 포인트, 필요하면 톤다운된 브라스는 한 문장 강조에만 사용{"\n"}- 기술적이지만 읽기 쉬움{"\n"}- 시각적 군더더기 없음{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #0b0b0c{"\n"}--surface: #101113{"\n"}--surface-strong: #15171b{"\n"}--surface-soft: #0f1012{"\n"}--text: #f1f3f5{"\n"}--muted: #9a9daa{"\n"}--line: rgba(255,255,255,0.08){"\n"}--line-strong: rgba(255,255,255,0.14){"\n"}--accent: #74c2b4{"\n"}--accent-alt: #b89663{"\n"}--accent-cool: #8ea0ff{"\n"}그라데이션을 메인 시각 효과로 쓰지 말 것. 블러 중심 글래스모피즘 금지.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}헤드라인 + 본문: Instrument Sans, Inter 또는 유사한 깨끗한 뉴트럴 그로테스크{"\n"}유틸리티 라벨/코드/메타: IBM Plex Mono 또는 유사한 깔끔한 모노{"\n"}H1: clamp(3rem, 7vw, 5.4rem), weight 800, line-height 0.96{"\n"}H2: clamp(2.2rem, 5vw, 4.2rem), weight 800, line-height 0.98{"\n"}H3: 1.5rem, weight 700{"\n"}본문: 1rem, line-height 1.7{"\n"}메타: 0.78rem ~ 0.875rem, mono, lowercase{"\n"}{"\n"}LAYOUT:{"\n"}- 최대 폭은 약 1160px{"\n"}- 12컬럼 구조 안에서 히어로 카피가 약간 안쪽으로 들어와 정렬됨{"\n"}- 큰 좌측 정렬 히어로{"\n"}- 중앙 정렬된 두 번째 섹션 헤드라인{"\n"}- 2x2 feature 그리드{"\n"}- 해설이 붙은 인터페이스 패널 1개 + 보조 설명 카드 2개{"\n"}- FAQ{"\n"}- 끝부분의 스타일 프롬프트 블록{"\n"}- 고정 하단 페이지 내비게이션{"\n"}- 모바일 브레이크포인트는 약 768px{"\n"}{"\n"}COMPONENT RULES:{"\n"}- 보더는 1px만 사용{"\n"}- 카드 radius는 14px ~ 18px 정도{"\n"}- 그림자는 매우 약하거나 없음{"\n"}- 카드는 다크 플랫 패널, hover lift 금지{"\n"}- 버튼은 절제된 다크 버튼 또는 밝은 단일 CTA 하나{"\n"}- 링크는 footer/support 맥락에서만 underline 허용{"\n"}- 모션은 hover 전환만, 최대 160ms{"\n"}{"\n"}COPY TONE:{"\n"}- 직접적임{"\n"}- 기술적임{"\n"}- 스타일 설명형이고 과장되지 않음{"\n"}- 디자이너와 제품팀 모두 읽을 수 있을 정도로 구체적임{"\n"}- 실제 회사 문서나 내부 디자인 레퍼런스처럼 작성{"\n"}{"\n"}FORBIDDEN:{"\n"}- 글로우 히어로 블롭{"\n"}- 두꺼운 그림자{"\n"}- 알록달록한 3D 오브젝트{"\n"}- 페이지 전체를 덮는 거대한 그라데이션 텍스트{"\n"}- 운영 의미 없는 장식 차트{"\n"}- 글래스모피즘{"\n"}- 추상적인 미래형 마케팅 아트{"\n"}- AI가 만든 SaaS 컨셉 샷처럼 보이는 모든 것{"\n"}{"\n"}OUTPUT:{"\n"}1) CSS custom properties{"\n"}2) semantic HTML + CSS{"\n"}3) responsive desktop/tablet/mobile layout{"\n"}4) accessible contrast{"\n"}5) no horizontal scroll{"\n"}6) 보이지만 절제된 그리드 구조</pre>
                  <pre data-lang="ja" hidden>Runtime Signal スタイルのランディングページまたはスタイルリファレンスページをデザインしてください — ほのかなカラムグリッド、鮮明なグロテスクタイポグラフィ、モノのユーティリティラベル、抑制されたミネラルティールアクセントを持つダークな技術インターフェース。{"\n"}{"\n"}これは派手なコンセプトページではありません。{"\n"}落ち着いていて、本番投入済みの実製品または社内デザインリファレンスのように見えること。{"\n"}{"\n"}開発者ツール、ワークフロー制御、ドキュメント、内部運用、インシデント確認、スケジューリングなど、現実味のあるカテゴリを選ぶこと。{"\n"}AIっぽい誇張演出、光沢のあるスタートアップハイプ、ラグジュアリーブランディング、ネオンサイバーパンク、装飾ダッシュボードは避けること。{"\n"}{"\n"}STYLE DNA:{"\n"}- ダークキャンバスと控えめな縦グリッドライン{"\n"}- 非常にクリーンなサンセリフタイポグラフィ{"\n"}- モノはユーティリティラベルと時刻情報だけに使用{"\n"}- 大きく直接的な見出し{"\n"}- 抑えたミネラルティールアクセント、必要なら落ち着いたブラスは一文強調だけ{"\n"}- 技術的だが読みやすい{"\n"}- 視覚的ノイズなし{"\n"}{"\n"}COLOR TOKENS:{"\n"}--bg: #0b0b0c{"\n"}--surface: #101113{"\n"}--surface-strong: #15171b{"\n"}--surface-soft: #0f1012{"\n"}--text: #f1f3f5{"\n"}--muted: #9a9daa{"\n"}--line: rgba(255,255,255,0.08){"\n"}--line-strong: rgba(255,255,255,0.14){"\n"}--accent: #74c2b4{"\n"}--accent-alt: #b89663{"\n"}--accent-cool: #8ea0ff{"\n"}グラデーションを主要演出にしないこと。ブラー中心のグラスモーフィズムは禁止。{"\n"}{"\n"}TYPOGRAPHY:{"\n"}見出し + 本文: Instrument Sans, Inter または近いクリーンなニュートラルグロテスク{"\n"}ユーティリティラベル/コード/メタ: IBM Plex Mono または近いクリーンなモノ{"\n"}H1: clamp(3rem, 7vw, 5.4rem), weight 800, line-height 0.96{"\n"}H2: clamp(2.2rem, 5vw, 4.2rem), weight 800, line-height 0.98{"\n"}H3: 1.5rem, weight 700{"\n"}本文: 1rem, line-height 1.7{"\n"}メタ: 0.78rem から 0.875rem, mono, lowercase{"\n"}{"\n"}LAYOUT:{"\n"}- 最大幅は約1160px{"\n"}- 12カラム構造の中でヒーローコピーを少し内側にオフセット{"\n"}- 大きな左揃えヒーロー{"\n"}- 中央揃えの第2セクション見出し{"\n"}- 2x2 の feature グリッド{"\n"}- 注釈付きインターフェースパネル1つ + 補助説明カード2枚{"\n"}- FAQ{"\n"}- 終盤のスタイルプロンプトブロック{"\n"}- 固定下部ページナビゲーション{"\n"}- モバイルブレークポイントは約768px{"\n"}{"\n"}COMPONENT RULES:{"\n"}- ボーダーは1pxのみ{"\n"}- カード radius は14pxから18px程度{"\n"}- シャドウは非常に弱く、またはなし{"\n"}- カードはダークでフラット、hover で浮かせない{"\n"}- ボタンは控えめなダークボタン、または明るい単一CTA{"\n"}- リンクは footer/support 文脈でのみ下線{"\n"}- モーションは hover 遷移のみ、最大160ms{"\n"}{"\n"}COPY TONE:{"\n"}- 直接的{"\n"}- 技術的{"\n"}- スタイル解説寄りで、誇張しない{"\n"}- デザイナーとプロダクトチームの両方が読める程度に具体的{"\n"}- 実在の会社文書や社内デザインリファレンスのように書く{"\n"}{"\n"}FORBIDDEN:{"\n"}- グローヒーローブロブ{"\n"}- 厚いシャドウ{"\n"}- カラフルな3Dオブジェクト{"\n"}- ページ全体を覆う巨大グラデーションテキスト{"\n"}- 運用上の意味がない装飾チャート{"\n"}- グラスモーフィズム{"\n"}- 抽象的な未来型マーケティングアート{"\n"}- AI生成のSaaSコンセプトショットのように見えるすべてのもの{"\n"}{"\n"}OUTPUT:{"\n"}1) CSS custom properties{"\n"}2) semantic HTML + CSS{"\n"}3) responsive desktop/tablet/mobile layout{"\n"}4) accessible contrast{"\n"}5) no horizontal scroll{"\n"}6) 見えるが抑制されたグリッド構造</pre>
                  <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
                </section>
              </section>
              <footer className="footer section" id="footer">
                <div className="footer__grid">
                  <section className="footer__panel">
                    <p className="footer__kicker">Runtime Signal</p>
                    <h3 data-lang="en">Use this style when the page must feel operational before it feels promotional.</h3>
                    <h3 data-lang="ko" hidden>페이지가 홍보보다 먼저 운영형 신뢰를 보여줘야 할 때 이 스타일을 씁니다.</h3>
                    <h3 data-lang="ja" hidden>このスタイルは、ページが宣伝より先に運用的な信頼感を見せる必要があるときに使います。</h3>
                    <p className="footer__note" data-lang="en">It works well for technical products that need structure, trust, and a small amount of controlled color.</p>
                    <p className="footer__note" data-lang="ko" hidden>구조, 신뢰, 그리고 절제된 색 사용이 필요한 기술 제품에 잘 맞습니다.</p>
                    <p className="footer__note" data-lang="ja" hidden>構造、信頼感、そして抑えた色使いが必要な技術製品によく合います。</p>
                    <div>
                      <a className="nav-button" href="#main-content">
                        <span data-lang="en">Back to overview</span>
                        <span data-lang="ko" hidden>개요로 돌아가기</span>
                        <span data-lang="ja" hidden>概要へ戻る</span>
                      </a>
                    </div>
                  </section>
                  <section className="footer__panel">
                    <p className="footer__kicker" data-lang="en">Sections</p>
                    <p className="footer__kicker" data-lang="ko" hidden>섹션</p>
                    <p className="footer__kicker" data-lang="ja" hidden>セクション</p>
                    <ul>
                      <li><a href="#layer"><span data-lang="en">Style DNA</span><span data-lang="ko" hidden>스타일 DNA</span><span data-lang="ja" hidden>スタイルDNA</span></a></li>
                      <li><a href="#visibility"><span data-lang="en">Layout anatomy</span><span data-lang="ko" hidden>레이아웃 해설</span><span data-lang="ja" hidden>レイアウト解説</span></a></li>
                      <li><a href="#examples"><span data-lang="en">Components</span><span data-lang="ko" hidden>컴포넌트</span><span data-lang="ja" hidden>コンポーネント</span></a></li>
                      <li><a href="#style-notes"><span data-lang="en">Style notes</span><span data-lang="ko" hidden>스타일 노트</span><span data-lang="ja" hidden>スタイルノート</span></a></li>
                    </ul>
                  </section>
                  <section className="footer__panel">
                    <p className="footer__kicker" data-lang="en">Reference</p>
                    <p className="footer__kicker" data-lang="ko" hidden>참고</p>
                    <p className="footer__kicker" data-lang="ja" hidden>参照</p>
                    <ul>
                      <li><a href="#faq"><span data-lang="en">FAQ</span><span data-lang="ko" hidden>FAQ</span><span data-lang="ja" hidden>FAQ</span></a></li>
                      <li><a href="#prompt-block"><span data-lang="en">AI Request Prompt</span><span data-lang="ko" hidden>AI 요청 프롬프트</span><span data-lang="ja" hidden>AIリクエストプロンプト</span></a></li>
                      <li><a href="/" data-i18n="back.hub">Back to Hub</a></li>
                    </ul>
                  </section>
                </div>
              </footer>
            </main>
          </div>
        </div>
        <nav className="page-nav" data-i18n-aria="page.nav.aria" aria-label="Page navigation">
          <a href="/pages/platform-core.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span><span className="page-nav__label" data-i18n="page.nav.prev">Previous</span>Platform Core</span>
          </a>
          <span className="page-nav__divider" aria-hidden="true" />
          <a href="/pages/holographic-fluid.html">
            <span><span className="page-nav__label" data-i18n="page.nav.next">Next</span>Holographic Fluid</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
