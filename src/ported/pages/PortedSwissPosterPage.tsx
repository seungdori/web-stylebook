import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedSwissPosterPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--swiss-poster">
      <div>
        <a className="page-back-link" href="/" aria-label="허브로 돌아가기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span>Hub</span></a>
        <main className="page" id="main-content">
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
          <section className="poster">
            <div className="crop-tr" />
            <div className="crop-bl" />
            <div className="poster-inner">
              <div className="geo-circle" />
              {/* MASSIVE HERO TYPE */}
              <h1 className="hero-type" data-lang="en">SW<span className="red">I</span>SS</h1>
              <h1 className="hero-type" data-lang="ko" hidden>SW<span className="red">I</span>SS</h1>
              <h1 className="hero-type" data-lang="ja" hidden>SW<span className="red">I</span>SS</h1>
              <div className="hero-subtitle" data-lang="en">International Typographic Style — Since 1957</div>
              <div className="hero-subtitle" data-lang="ko" hidden>국제 타이포그래피 양식 — 1957년 이후</div>
              <div className="hero-subtitle" data-lang="ja" hidden>国際タイポグラフィ様式 — 1957年以来</div>
              <div className="swiss-grid">
                {/* 01 ASYMMETRIC INTRO */}
                <div className="swiss-grid__section intro-row">
                  <div className="intro-row__text">
                    <span className="section-num">01 — Manifesto</span>
                    <p data-lang="en">A style that makes information alignment and typographic hierarchy extremely clear. When requesting AI, don't just say "Swiss style" — specify "strong grid, single red accent color, left-aligned typography" to achieve superior implementation quality. The grid is not decoration; it is the architecture of communication.</p>
                    <p data-lang="ko" hidden>정보 정렬과 타이포 계층을 극단적으로 명확히 하는 스타일입니다. AI 요청 시 "스위스 스타일"만 쓰지 말고 "강한 그리드, 빨강 포인트 1색, 좌측 정렬 타이포"를 함께 지정해야 구현 품질이 올라갑니다. 그리드는 장식이 아니라 커뮤니케이션의 건축입니다.</p>
                    <p data-lang="ja" hidden>情報整列とタイポグラフィの階層を極端に明確にするスタイルです。AIにリクエストする際は「スイススタイル」だけでなく、「強いグリッド、赤のアクセント1色、左揃えタイポグラフィ」を併せて指定すると実装品質が向上します。グリッドは装飾ではなく、コミュニケーションの建築です。</p>
                  </div>
                  <div className="intro-row__meta" data-lang="en">MODULE: 12 COL<br />ALIGN: LEFT<br />RHYTHM: STRICT<br />WEIGHT: 400 / 800 / 900<br />ACCENT: 1 COLOR<br />GRID: VISIBLE</div>
                  <div className="intro-row__meta" data-lang="ko" hidden>MODULE: 12 COL<br />ALIGN: LEFT<br />RHYTHM: STRICT<br />WEIGHT: 400 / 800 / 900<br />ACCENT: 1 COLOR<br />GRID: VISIBLE</div>
                  <div className="intro-row__meta" data-lang="ja" hidden>MODULE: 12 COL<br />ALIGN: LEFT<br />RHYTHM: STRICT<br />WEIGHT: 400 / 800 / 900<br />ACCENT: 1 COLOR<br />GRID: VISIBLE</div>
                </div>
                {/* 02 TYPE SCALE */}
                <div className="swiss-grid__section type-scale-row">
                  <span className="section-num" data-lang="en">02 — Type Scale</span>
                  <span className="section-num" data-lang="ko" hidden>02 — 타입 스케일</span>
                  <span className="section-num" data-lang="ja" hidden>02 — タイプスケール</span>
                  <ul className="type-scale">
                    <li><span className="type-scale__size">72</span><span className="type-scale__sample" style={{fontSize: 72}} data-lang="en">Grid</span><span className="type-scale__sample" style={{fontSize: 72}} data-lang="ko" hidden>그리드</span><span className="type-scale__sample" style={{fontSize: 72}} data-lang="ja" hidden>グリッド</span></li>
                    <li><span className="type-scale__size">48</span><span className="type-scale__sample" style={{fontSize: 48}} data-lang="en">Helvetica</span><span className="type-scale__sample" style={{fontSize: 48}} data-lang="ko" hidden>헬베티카</span><span className="type-scale__sample" style={{fontSize: 48}} data-lang="ja" hidden>ヘルベチカ</span></li>
                    <li><span className="type-scale__size">36</span><span className="type-scale__sample" style={{fontSize: 36}} data-lang="en">Objective</span><span className="type-scale__sample" style={{fontSize: 36}} data-lang="ko" hidden>객관성</span><span className="type-scale__sample" style={{fontSize: 36}} data-lang="ja" hidden>客観性</span></li>
                    <li><span className="type-scale__size">24</span><span className="type-scale__sample" style={{fontSize: 24}} data-lang="en">Mathematical</span><span className="type-scale__sample" style={{fontSize: 24}} data-lang="ko" hidden>수학적 구조</span><span className="type-scale__sample" style={{fontSize: 24}} data-lang="ja" hidden>数学的構造</span></li>
                    <li><span className="type-scale__size">21</span><span className="type-scale__sample" style={{fontSize: 21}} data-lang="en">Asymmetry</span><span className="type-scale__sample" style={{fontSize: 21}} data-lang="ko" hidden>비대칭</span><span className="type-scale__sample" style={{fontSize: 21}} data-lang="ja" hidden>非対称</span></li>
                    <li><span className="type-scale__size">18</span><span className="type-scale__sample" style={{fontSize: 18}} data-lang="en">Hierarchy</span><span className="type-scale__sample" style={{fontSize: 18}} data-lang="ko" hidden>위계</span><span className="type-scale__sample" style={{fontSize: 18}} data-lang="ja" hidden>階層</span></li>
                    <li><span className="type-scale__size">16</span><span className="type-scale__sample" style={{fontSize: 16}} data-lang="en">Communication</span><span className="type-scale__sample" style={{fontSize: 16}} data-lang="ko" hidden>커뮤니케이션</span><span className="type-scale__sample" style={{fontSize: 16}} data-lang="ja" hidden>コミュニケーション</span></li>
                    <li><span className="type-scale__size">14</span><span className="type-scale__sample" style={{fontSize: 14}} data-lang="en">Precision</span><span className="type-scale__sample" style={{fontSize: 14}} data-lang="ko" hidden>정밀함</span><span className="type-scale__sample" style={{fontSize: 14}} data-lang="ja" hidden>精密さ</span></li>
                    <li><span className="type-scale__size">12</span><span className="type-scale__sample" style={{fontSize: 12}} data-lang="en">Reduction</span><span className="type-scale__sample" style={{fontSize: 12}} data-lang="ko" hidden>축약</span><span className="type-scale__sample" style={{fontSize: 12}} data-lang="ja" hidden>縮約</span></li>
                  </ul>
                </div>
                {/* 03 COMPOSITION */}
                <div className="swiss-grid__section" style={{gridColumn: '1/-1'}}>
                  <span className="section-num" data-lang="en">03 — Composition</span>
                  <span className="section-num" data-lang="ko" hidden>03 — 구성</span>
                  <span className="section-num" data-lang="ja" hidden>03 — 構成</span>
                  <div className="composition-row">
                    <div className="comp-block comp-photo">
                      <span className="comp-ratio">4:3</span>
                      <div className="comp-copy">
                        <strong data-lang="en">Image Field</strong>
                        <strong data-lang="ko" hidden>이미지 필드</strong>
                        <strong data-lang="ja" hidden>画像フィールド</strong>
                        <small data-lang="en">Caption and image share one left edge.</small>
                        <small data-lang="ko" hidden>사진과 캡션이 같은 왼쪽 축에 붙습니다.</small>
                        <small data-lang="ja" hidden>写真とキャプションを同じ左軸に揃えます。</small>
                      </div>
                      <div className="comp-measure" aria-hidden><i /><i /><i /></div>
                    </div>
                    <div className="comp-block comp-tall">
                      <span className="comp-ratio">Portrait</span>
                      <div className="comp-poster-code" aria-hidden>
                        <b>01</b>
                        <b>57</b>
                        <b>CH</b>
                      </div>
                      <div className="comp-copy">
                        <strong data-lang="en">Vertical Lead</strong>
                        <strong data-lang="ko" hidden>세로 리드</strong>
                        <strong data-lang="ja" hidden>縦のリード</strong>
                        <small data-lang="en">A tall column carries the strongest hierarchy.</small>
                        <small data-lang="ko" hidden>높은 컬럼이 가장 강한 위계를 담당합니다.</small>
                        <small data-lang="ja" hidden>高いカラムが最も強い階層を担います。</small>
                      </div>
                    </div>
                    <div className="comp-block comp-wide">
                      <span className="comp-ratio">16:9</span>
                      <div className="comp-rule-stack" aria-hidden><i /><i /><i /><i /></div>
                      <div className="comp-copy">
                        <strong data-lang="en">System Header</strong>
                        <strong data-lang="ko" hidden>시스템 헤더</strong>
                        <strong data-lang="ja" hidden>システムヘッダー</strong>
                        <small data-lang="en">Wide fields keep metadata readable.</small>
                        <small data-lang="ko" hidden>넓은 필드는 메타 정보를 선명하게 유지합니다.</small>
                        <small data-lang="ja" hidden>横長の領域はメタ情報を読みやすく保ちます。</small>
                      </div>
                    </div>
                    <div className="comp-block comp-square">
                      <span className="comp-ratio">1:1</span>
                      <div className="comp-square-mark" aria-hidden>12</div>
                      <div className="comp-copy">
                        <strong data-lang="en">Mark Block</strong>
                        <strong data-lang="ko" hidden>마크 블록</strong>
                        <strong data-lang="ja" hidden>マークブロック</strong>
                        <small data-lang="en">Square modules hold symbols and issue numbers.</small>
                        <small data-lang="ko" hidden>정사각 모듈은 심볼과 호수를 담습니다.</small>
                        <small data-lang="ja" hidden>正方形モジュールは記号と号数を収めます。</small>
                      </div>
                    </div>
                    <div className="comp-block comp-accent">
                      <span className="comp-ratio">Accent</span>
                      <div className="comp-copy">
                        <strong data-lang="en">One Red Signal</strong>
                        <strong data-lang="ko" hidden>하나의 빨강 신호</strong>
                        <strong data-lang="ja" hidden>ひとつの赤い信号</strong>
                        <small data-lang="en">Use color only when the grid needs a decision point.</small>
                        <small data-lang="ko" hidden>색은 그리드에 결정점이 필요할 때만 씁니다.</small>
                        <small data-lang="ja" hidden>色はグリッドに決定点が必要な時だけ使います。</small>
                      </div>
                    </div>
                    <div className="comp-block comp-small">
                      <span className="comp-ratio">3:2</span>
                      <div className="comp-index" aria-hidden>03</div>
                      <div className="comp-copy">
                        <strong data-lang="en">Caption</strong>
                        <strong data-lang="ko" hidden>캡션</strong>
                        <strong data-lang="ja" hidden>キャプション</strong>
                        <small data-lang="en">Short text locks to a baseline.</small>
                        <small data-lang="ko" hidden>짧은 문장은 기준선에 고정됩니다.</small>
                        <small data-lang="ja" hidden>短い文をベースラインへ固定します。</small>
                      </div>
                    </div>
                    <div className="comp-block comp-small">
                      <span className="comp-ratio">3:2</span>
                      <div className="comp-date" aria-hidden>15<br />03</div>
                      <div className="comp-copy">
                        <strong data-lang="en">Date</strong>
                        <strong data-lang="ko" hidden>날짜</strong>
                        <strong data-lang="ja" hidden>日付</strong>
                        <small data-lang="en">Calendar data stays numeric and calm.</small>
                        <small data-lang="ko" hidden>일정 정보는 숫자로 차분하게 둡니다.</small>
                        <small data-lang="ja" hidden>予定情報は数字で静かに置きます。</small>
                      </div>
                    </div>
                    <div className="comp-block comp-small">
                      <span className="comp-ratio">3:2</span>
                      <div className="comp-footnote" aria-hidden>
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="comp-copy">
                        <strong data-lang="en">Footnote</strong>
                        <strong data-lang="ko" hidden>각주</strong>
                        <strong data-lang="ja" hidden>脚注</strong>
                        <small data-lang="en">Details sit quietly beneath the main axis.</small>
                        <small data-lang="ko" hidden>세부 정보는 주축 아래에 조용히 놓입니다.</small>
                        <small data-lang="ja" hidden>詳細は主軸の下に静かに置きます。</small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 04 MODULES */}
                <div className="swiss-grid__section" style={{gridColumn: '1/-1'}}>
                  <span className="section-num" data-lang="en">04 — Modules</span>
                  <span className="section-num" data-lang="ko" hidden>04 — 모듈</span>
                  <span className="section-num" data-lang="ja" hidden>04 — モジュール</span>
                  <div className="modules-row">
                    {/* M1 — Buttons */}
                    <div className="mod-cell">
                      <div className="mod-cell__head">
                        <span className="mod-cell__num">M / 01</span>
                        <span className="mod-cell__title" data-lang="en">Controls</span>
                        <span className="mod-cell__title" data-lang="ko" hidden>컨트롤</span>
                        <span className="mod-cell__title" data-lang="ja" hidden>コントロール</span>
                      </div>
                      <div className="mod-cell__body sw-controls">
                        <button className="sw-btn sw-btn--primary" type="button">
                          <span data-lang="en">View Programme</span>
                          <span data-lang="ko" hidden>프로그램 보기</span>
                          <span data-lang="ja" hidden>プログラムを見る</span>
                        </button>
                        <button className="sw-btn sw-btn--ink" type="button">
                          <span data-lang="en">Download PDF</span>
                          <span data-lang="ko" hidden>PDF 다운로드</span>
                          <span data-lang="ja" hidden>PDFをダウンロード</span>
                        </button>
                        <a className="sw-btn sw-btn--text" href="#main-content">
                          <span data-lang="en">All editions</span>
                          <span data-lang="ko" hidden>전체 호 보기</span>
                          <span data-lang="ja" hidden>全号を見る</span>
                          <span aria-hidden>→</span>
                        </a>
                      </div>
                    </div>

                    {/* M2 — Form */}
                    <div className="mod-cell">
                      <div className="mod-cell__head">
                        <span className="mod-cell__num">M / 02</span>
                        <span className="mod-cell__title" data-lang="en">Subscribe</span>
                        <span className="mod-cell__title" data-lang="ko" hidden>구독</span>
                        <span className="mod-cell__title" data-lang="ja" hidden>購読</span>
                      </div>
                      <div className="mod-cell__body sw-form">
                        <label className="sw-field">
                          <span className="sw-field__label" data-lang="en">Name</span>
                          <span className="sw-field__label" data-lang="ko" hidden>이름</span>
                          <span className="sw-field__label" data-lang="ja" hidden>氏名</span>
                          <input className="sw-field__input" type="text" placeholder="Max Bill" />
                        </label>
                        <label className="sw-field">
                          <span className="sw-field__label" data-lang="en">Email</span>
                          <span className="sw-field__label" data-lang="ko" hidden>이메일</span>
                          <span className="sw-field__label" data-lang="ja" hidden>メール</span>
                          <input className="sw-field__input" type="email" placeholder="name@grid.ch" />
                        </label>
                        <p className="sw-field__hint" data-lang="en">No. 04 · Quarterly · 4 issues / year</p>
                        <p className="sw-field__hint" data-lang="ko" hidden>No. 04 · 분기간 · 연 4호 발행</p>
                        <p className="sw-field__hint" data-lang="ja" hidden>No. 04 · 季刊 · 年4号発行</p>
                      </div>
                    </div>

                    {/* M3 — Tags */}
                    <div className="mod-cell">
                      <div className="mod-cell__head">
                        <span className="mod-cell__num">M / 03</span>
                        <span className="mod-cell__title" data-lang="en">Labels</span>
                        <span className="mod-cell__title" data-lang="ko" hidden>레이블</span>
                        <span className="mod-cell__title" data-lang="ja" hidden>ラベル</span>
                      </div>
                      <div className="mod-cell__body sw-tags">
                        <span className="sw-tag" data-lang="en">Typography</span>
                        <span className="sw-tag" data-lang="ko" hidden>타이포그래피</span>
                        <span className="sw-tag" data-lang="ja" hidden>タイポグラフィ</span>
                        <span className="sw-tag" data-lang="en">Grid</span>
                        <span className="sw-tag" data-lang="ko" hidden>그리드</span>
                        <span className="sw-tag" data-lang="ja" hidden>グリッド</span>
                        <span className="sw-tag sw-tag--ink" data-lang="en">Helvetica</span>
                        <span className="sw-tag sw-tag--ink" data-lang="ko" hidden>헬베티카</span>
                        <span className="sw-tag sw-tag--ink" data-lang="ja" hidden>ヘルベチカ</span>
                        <span className="sw-tag sw-tag--red" data-lang="en">New</span>
                        <span className="sw-tag sw-tag--red" data-lang="ko" hidden>신규</span>
                        <span className="sw-tag sw-tag--red" data-lang="ja" hidden>新着</span>
                        <span className="sw-tag sw-tag--mono">N° 04 / 1957</span>
                      </div>
                    </div>

                    {/* M4 — Stats */}
                    <div className="mod-cell">
                      <div className="mod-cell__head">
                        <span className="mod-cell__num">M / 04</span>
                        <span className="mod-cell__title" data-lang="en">Figures</span>
                        <span className="mod-cell__title" data-lang="ko" hidden>수치</span>
                        <span className="mod-cell__title" data-lang="ja" hidden>数値</span>
                      </div>
                      <div className="mod-cell__body sw-stats">
                        <div className="sw-stat">
                          <div className="sw-stat__value">12</div>
                          <div className="sw-stat__label" data-lang="en">Columns</div>
                          <div className="sw-stat__label" data-lang="ko" hidden>컬럼</div>
                          <div className="sw-stat__label" data-lang="ja" hidden>カラム</div>
                        </div>
                        <div className="sw-stat">
                          <div className="sw-stat__value sw-stat__value--red">1<span className="sw-stat__unit">px</span></div>
                          <div className="sw-stat__label" data-lang="en">Hairline</div>
                          <div className="sw-stat__label" data-lang="ko" hidden>헤어라인</div>
                          <div className="sw-stat__label" data-lang="ja" hidden>ヘアライン</div>
                        </div>
                        <div className="sw-stat">
                          <div className="sw-stat__value">04</div>
                          <div className="sw-stat__label" data-lang="en">Editions / yr</div>
                          <div className="sw-stat__label" data-lang="ko" hidden>발행 / 연</div>
                          <div className="sw-stat__label" data-lang="ja" hidden>発行 / 年</div>
                        </div>
                        <div className="sw-stat">
                          <div className="sw-stat__value">1957</div>
                          <div className="sw-stat__label" data-lang="en">Founded</div>
                          <div className="sw-stat__label" data-lang="ko" hidden>창간</div>
                          <div className="sw-stat__label" data-lang="ja" hidden>創刊</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 05 PROGRAMME / INDEX */}
                <div className="swiss-grid__section" style={{gridColumn: '1/-1'}}>
                  <span className="section-num" data-lang="en">05 — Programme</span>
                  <span className="section-num" data-lang="ko" hidden>05 — 프로그램</span>
                  <span className="section-num" data-lang="ja" hidden>05 — プログラム</span>
                  <div className="sw-programme">
                    <div className="sw-programme__head">
                      <span data-lang="en">Lecture / Workshop</span>
                      <span data-lang="ko" hidden>강연 / 워크숍</span>
                      <span data-lang="ja" hidden>講演 / ワークショップ</span>
                      <span data-lang="en">Speaker</span>
                      <span data-lang="ko" hidden>발표자</span>
                      <span data-lang="ja" hidden>発表者</span>
                      <span data-lang="en">Room</span>
                      <span data-lang="ko" hidden>강의실</span>
                      <span data-lang="ja" hidden>会場</span>
                      <span data-lang="en">Date</span>
                      <span data-lang="ko" hidden>일자</span>
                      <span data-lang="ja" hidden>日付</span>
                    </div>
                    <ol className="sw-programme__list">
                      <li>
                        <span className="sw-programme__num">01</span>
                        <span className="sw-programme__title" data-lang="en">Grid as Architecture</span>
                        <span className="sw-programme__title" data-lang="ko" hidden>건축으로서의 그리드</span>
                        <span className="sw-programme__title" data-lang="ja" hidden>建築としてのグリッド</span>
                        <span className="sw-programme__name">J. Müller-B.</span>
                        <span className="sw-programme__room">A · 204</span>
                        <span className="sw-programme__date">14 / 03</span>
                      </li>
                      <li>
                        <span className="sw-programme__num">02</span>
                        <span className="sw-programme__title" data-lang="en">Scale, not Color</span>
                        <span className="sw-programme__title" data-lang="ko" hidden>색이 아닌 크기</span>
                        <span className="sw-programme__title" data-lang="ja" hidden>色ではなくスケール</span>
                        <span className="sw-programme__name">A. Hofmann</span>
                        <span className="sw-programme__room">B · 118</span>
                        <span className="sw-programme__date">14 / 03</span>
                      </li>
                      <li className="is-now">
                        <span className="sw-programme__num">03</span>
                        <span className="sw-programme__title" data-lang="en">The Mathematical Reason</span>
                        <span className="sw-programme__title" data-lang="ko" hidden>수학적 존재 이유</span>
                        <span className="sw-programme__title" data-lang="ja" hidden>数学的な存在理由</span>
                        <span className="sw-programme__name">E. Ruder</span>
                        <span className="sw-programme__room">A · 204</span>
                        <span className="sw-programme__date">15 / 03 · NOW</span>
                      </li>
                      <li>
                        <span className="sw-programme__num">04</span>
                        <span className="sw-programme__title" data-lang="en">Asymmetric Composition</span>
                        <span className="sw-programme__title" data-lang="ko" hidden>비대칭 구성</span>
                        <span className="sw-programme__title" data-lang="ja" hidden>非対称構成</span>
                        <span className="sw-programme__name">M. Bill</span>
                        <span className="sw-programme__room">B · 118</span>
                        <span className="sw-programme__date">15 / 03</span>
                      </li>
                      <li>
                        <span className="sw-programme__num">05</span>
                        <span className="sw-programme__title" data-lang="en">Order over Ornament</span>
                        <span className="sw-programme__title" data-lang="ko" hidden>장식보다 질서</span>
                        <span className="sw-programme__title" data-lang="ja" hidden>装飾よりも秩序</span>
                        <span className="sw-programme__name">K. Gerstner</span>
                        <span className="sw-programme__room">C · 003</span>
                        <span className="sw-programme__date">16 / 03</span>
                      </li>
                    </ol>
                  </div>
                </div>

                {/* 06 CARDS */}
                <div className="swiss-grid__section" style={{gridColumn: '1/-1'}}>
                  <span className="section-num" data-lang="en">06 — Posters in Series</span>
                  <span className="section-num" data-lang="ko" hidden>06 — 시리즈 포스터</span>
                  <span className="section-num" data-lang="ja" hidden>06 — シリーズポスター</span>
                  <div className="sw-cards">
                    <article className="sw-card">
                      <div className="sw-card__plate" aria-hidden>
                        <span className="sw-card__plate-num">01</span>
                        <span className="sw-card__plate-mark" />
                      </div>
                      <div className="sw-card__body">
                        <div className="sw-card__meta">
                          <span data-lang="en">Series A · Typography</span>
                          <span data-lang="ko" hidden>시리즈 A · 타이포그래피</span>
                          <span data-lang="ja" hidden>シリーズ A · タイポグラフィ</span>
                        </div>
                        <h4 className="sw-card__title" data-lang="en">Helvetica Now</h4>
                        <h4 className="sw-card__title" data-lang="ko" hidden>헬베티카 나우</h4>
                        <h4 className="sw-card__title" data-lang="ja" hidden>ヘルベチカ・ナウ</h4>
                        <p className="sw-card__text" data-lang="en">A reappraisal of the workhorse — drawn for the screen, but still walking off the page.</p>
                        <p className="sw-card__text" data-lang="ko" hidden>가장 부지런한 활자의 재평가 — 화면을 위해 다시 그려졌지만 여전히 종이에서 걸어 나온다.</p>
                        <p className="sw-card__text" data-lang="ja" hidden>もっとも働き者の書体の再評価 — 画面のために描き直されてもなお、紙の上から歩み出てくる。</p>
                      </div>
                    </article>
                    <article className="sw-card">
                      <div className="sw-card__plate sw-card__plate--red" aria-hidden>
                        <span className="sw-card__plate-num">02</span>
                        <span className="sw-card__plate-mark" />
                      </div>
                      <div className="sw-card__body">
                        <div className="sw-card__meta">
                          <span data-lang="en">Series B · Grid</span>
                          <span data-lang="ko" hidden>시리즈 B · 그리드</span>
                          <span data-lang="ja" hidden>シリーズ B · グリッド</span>
                        </div>
                        <h4 className="sw-card__title" data-lang="en">Twelve Columns</h4>
                        <h4 className="sw-card__title" data-lang="ko" hidden>열두 개의 컬럼</h4>
                        <h4 className="sw-card__title" data-lang="ja" hidden>十二のカラム</h4>
                        <p className="sw-card__text" data-lang="en">A short defence of the modular grid — when arithmetic does the work that intuition refuses.</p>
                        <p className="sw-card__text" data-lang="ko" hidden>모듈러 그리드를 위한 짧은 변론 — 직관이 거부하는 일을 산술이 대신해 줄 때.</p>
                        <p className="sw-card__text" data-lang="ja" hidden>モジュラーグリッドへの短い弁明 — 直感が拒む仕事を、算術が代わりに引き受けるとき。</p>
                      </div>
                    </article>
                    <article className="sw-card">
                      <div className="sw-card__plate sw-card__plate--lined" aria-hidden>
                        <span className="sw-card__plate-num">03</span>
                        <span className="sw-card__plate-mark" />
                      </div>
                      <div className="sw-card__body">
                        <div className="sw-card__meta">
                          <span data-lang="en">Series C · Composition</span>
                          <span data-lang="ko" hidden>시리즈 C · 구성</span>
                          <span data-lang="ja" hidden>シリーズ C · 構成</span>
                        </div>
                        <h4 className="sw-card__title" data-lang="en">Asymmetric Balance</h4>
                        <h4 className="sw-card__title" data-lang="ko" hidden>비대칭의 균형</h4>
                        <h4 className="sw-card__title" data-lang="ja" hidden>非対称の均衡</h4>
                        <p className="sw-card__text" data-lang="en">Balance is not the same as symmetry. The eye prefers tension, properly weighted on either side of a line.</p>
                        <p className="sw-card__text" data-lang="ko" hidden>균형은 대칭과 같지 않다. 눈은 적절한 무게로 양쪽에 걸린 긴장을 좋아한다.</p>
                        <p className="sw-card__text" data-lang="ja" hidden>均衡は対称ではない。目は、線の両側に正しく重みのかかった緊張を好む。</p>
                      </div>
                    </article>
                  </div>
                </div>

                {/* 07 PRINCIPLES */}
                <div className="swiss-grid__section" style={{gridColumn: '1/-1'}}>
                  <span className="section-num" data-lang="en">07 — Principles</span>
                  <span className="section-num" data-lang="ko" hidden>07 — 원칙</span>
                  <span className="section-num" data-lang="ja" hidden>07 — 原則</span>
                  <div className="principles-row">
                    <div className="principle">
                      <div className="principle__num">01</div>
                      <h3 data-lang="en">Grid as Architecture</h3>
                      <h3 data-lang="ko" hidden>건축으로서의 그리드</h3>
                      <h3 data-lang="ja" hidden>建築としてのグリッド</h3>
                      <p data-lang="en">Deliver messages directly with crisp alignment and concise sentences. The grid gives every element a mathematical reason to exist where it does.</p>
                      <p data-lang="ko" hidden>선명한 정렬과 간결한 문장으로 메시지를 직선적으로 전달합니다. 그리드는 모든 요소에 수학적 존재 이유를 부여합니다.</p>
                      <p data-lang="ja" hidden>鮮明な整列と簡潔な文章でメッセージを直線的に伝達します。グリッドはすべての要素に数学的な存在理由を与えます。</p>
                    </div>
                    <div className="principle">
                      <div className="principle__num">02</div>
                      <h3 data-lang="en">Scale over Color</h3>
                      <h3 data-lang="ko" hidden>색보다 크기</h3>
                      <h3 data-lang="ja" hidden>色よりもスケール</h3>
                      <p data-lang="en">Use placement and type size contrast for emphasis, not color. Restraint is the most powerful tool in the Swiss designer's practice.</p>
                      <p data-lang="ko" hidden>강조는 색보다 배치와 활자 크기 차이로 처리합니다. 절제는 스위스 디자이너의 가장 강력한 도구입니다.</p>
                      <p data-lang="ja" hidden>強調は色よりも配置と活字サイズの差で処理します。抑制はスイスデザイナーの最も強力なツールです。</p>
                    </div>
                    <div className="principle">
                      <div className="principle__num">03</div>
                      <h3 data-lang="en">Structure First</h3>
                      <h3 data-lang="ko" hidden>구조 우선</h3>
                      <h3 data-lang="ja" hidden>構造優先</h3>
                      <p data-lang="en">Classic information design that prioritizes structure over decoration. Content finds its voice through order, not ornament.</p>
                      <p data-lang="ko" hidden>장식보다 구조를 우선하는 고전적 정보 디자인입니다. 콘텐츠는 장식이 아닌 질서를 통해 목소리를 찾습니다.</p>
                      <p data-lang="ja" hidden>装飾よりも構造を優先する古典的な情報デザインです。コンテンツは装飾ではなく秩序を通じて声を見つけます。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="prompt">
            <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
            <pre data-lang="en">Design a landing page in Swiss Poster style — strict grid information hierarchy with typographic drama.{"\n"}{"\n"}COLOR TOKENS:{"\n"}--paper: #f5f4ef{"\n"}--ink: #111111{"\n"}--red: #d41f18{"\n"}--line: #1f1f1f{"\n"}--panel-bg: #ffffff{"\n"}--meta-bg: #fbfaf6{"\n"}No other colors.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading: Archivo 800, uppercase, tracking -0.03em{"\n"}Body: Archivo 400{"\n"}Meta: Space Mono 400, 0.92rem{"\n"}Scale: 0.92rem / 1rem / clamp(2rem, 6vw, 4.8rem){"\n"}Heading line-height: 0.9{"\n"}Body line-height: 1.7{"\n"}{"\n"}UI:{"\n"}- All borders 2px solid var(--line), sharp 0px radius everywhere{"\n"}- Hero split: 8-col title area (border-right + border-bottom) / 4-col meta sidebar (border-bottom, meta-bg){"\n"}- Below hero: 3 equal 4-col cells, each with border-right (last child none){"\n"}- Prompt box: 2px solid var(--line), white background{"\n"}- CTA button: pill shape (border-radius 999px), --red background, white text, 1px solid var(--line) border{"\n"}{"\n"}LAYOUT:{"\n"}Container: width min(1100px, 94vw), margin 0 auto, padding 24px 0 76px{"\n"}Grid: display grid, grid-template-columns repeat(12, 1fr){"\n"}Title cell: padding clamp(18px, 4vw, 36px){"\n"}Meta cell: padding 16px{"\n"}Column cells: padding 16px{"\n"}Prompt section: margin-top 22px, padding 15px{"\n"}{"\n"}MOTION:{"\n"}Column entrance: @keyframes snap — from opacity 0 translateY(8px) to opacity 1 translateY(0){"\n"}Duration: 0.5s ease both{"\n"}Stagger: 0.08s interval per column (animation-delay){"\n"}No hover animations, no scroll-triggered effects.{"\n"}{"\n"}RESPONSIVE:{"\n"}- &lt;= 840px: all grid children span 12 columns, border-right 0{"\n"}- Desktop: 12-column grid preserved, max-width 1100px{"\n"}{"\n"}FORBIDDEN:{"\n"}- Rounded corners on panels or grid cells{"\n"}- Gradients, glows, or box-shadows on content areas{"\n"}- More than one accent color beyond --red{"\n"}- Illustrations, icons, or decorative imagery{"\n"}- Animations longer than 0.5s{"\n"}{"\n"}OUTPUT:{"\n"}1) Full color token list and typography scale{"\n"}2) 12-column grid layout with exact span ratios (8:4 hero, 4:4:4 columns){"\n"}3) Responsive single-file HTML/CSS with @media breakpoint at 840px</pre>
            <pre data-lang="ko" hidden>스위스 포스터 스타일의 랜딩 페이지를 디자인해줘 — 엄격한 그리드 정보 위계와 타이포그래피 드라마.{"\n"}{"\n"}색상 토큰:{"\n"}--paper: #f5f4ef{"\n"}--ink: #111111{"\n"}--red: #d41f18{"\n"}--line: #1f1f1f{"\n"}--panel-bg: #ffffff{"\n"}--meta-bg: #fbfaf6{"\n"}다른 색상 사용 금지.{"\n"}{"\n"}타이포그래피:{"\n"}제목: Archivo 800, uppercase, tracking -0.03em{"\n"}본문: Archivo 400{"\n"}메타: Space Mono 400, 0.92rem{"\n"}스케일: 0.92rem / 1rem / clamp(2rem, 6vw, 4.8rem){"\n"}제목 line-height: 0.9{"\n"}본문 line-height: 1.7{"\n"}{"\n"}UI:{"\n"}- 모든 보더 2px solid var(--line), 전체 border-radius 0px{"\n"}- 히어로 분할: 8컬럼 타이틀 영역(border-right + border-bottom) / 4컬럼 메타 사이드바(border-bottom, meta-bg){"\n"}- 히어로 하단: 동일한 4컬럼 셀 3개, 각각 border-right (마지막 자식 없음){"\n"}- 프롬프트 박스: 2px solid var(--line), 흰색 배경{"\n"}- CTA 버튼: 필 형태(border-radius 999px), --red 배경, 흰색 텍스트, 1px solid var(--line) 보더{"\n"}{"\n"}레이아웃:{"\n"}컨테이너: width min(1100px, 94vw), margin 0 auto, padding 24px 0 76px{"\n"}그리드: display grid, grid-template-columns repeat(12, 1fr){"\n"}타이틀 셀: padding clamp(18px, 4vw, 36px){"\n"}메타 셀: padding 16px{"\n"}컬럼 셀: padding 16px{"\n"}프롬프트 섹션: margin-top 22px, padding 15px{"\n"}{"\n"}모션:{"\n"}컬럼 등장: @keyframes snap — from opacity 0 translateY(8px) to opacity 1 translateY(0){"\n"}지속시간: 0.5s ease both{"\n"}시차: 컬럼당 0.08s 간격 (animation-delay){"\n"}호버 애니메이션 없음, 스크롤 트리거 효과 없음.{"\n"}{"\n"}반응형:{"\n"}- &lt;= 840px: 모든 그리드 자식 12컬럼 span, border-right 0{"\n"}- 데스크톱: 12컬럼 그리드 유지, max-width 1100px{"\n"}{"\n"}금지사항:{"\n"}- 패널이나 그리드 셀에 둥근 모서리{"\n"}- 콘텐츠 영역에 그라데이션, 글로우, box-shadow{"\n"}- --red 외 추가 포인트 색상{"\n"}- 일러스트, 아이콘, 장식 이미지{"\n"}- 0.5s 초과 애니메이션{"\n"}{"\n"}출력:{"\n"}1) 전체 색상 토큰 목록과 타이포그래피 스케일{"\n"}2) 12컬럼 그리드 레이아웃과 정확한 span 비율 (8:4 히어로, 4:4:4 컬럼){"\n"}3) @media 840px 브레이크포인트 포함 반응형 단일 파일 HTML/CSS</pre>
            <pre data-lang="ja" hidden>スイスポスタースタイルのランディングページをデザインしてください — 厳格なグリッド情報階層とタイポグラフィのドラマ。{"\n"}{"\n"}カラートークン:{"\n"}--paper: #f5f4ef{"\n"}--ink: #111111{"\n"}--red: #d41f18{"\n"}--line: #1f1f1f{"\n"}--panel-bg: #ffffff{"\n"}--meta-bg: #fbfaf6{"\n"}他の色は使用禁止。{"\n"}{"\n"}タイポグラフィ:{"\n"}見出し: Archivo 800, uppercase, tracking -0.03em{"\n"}本文: Archivo 400{"\n"}メタ: Space Mono 400, 0.92rem{"\n"}スケール: 0.92rem / 1rem / clamp(2rem, 6vw, 4.8rem){"\n"}見出し line-height: 0.9{"\n"}本文 line-height: 1.7{"\n"}{"\n"}UI:{"\n"}- 全ボーダー 2px solid var(--line)、全体 border-radius 0px{"\n"}- ヒーロー分割: 8カラムタイトル領域(border-right + border-bottom) / 4カラムメタサイドバー(border-bottom, meta-bg){"\n"}- ヒーロー下部: 均等な4カラムセル3つ、各 border-right（最後の子要素はなし）{"\n"}- プロンプトボックス: 2px solid var(--line)、白背景{"\n"}- CTAボタン: ピル型(border-radius 999px)、--red 背景、白テキスト、1px solid var(--line) ボーダー{"\n"}{"\n"}レイアウト:{"\n"}コンテナ: width min(1100px, 94vw), margin 0 auto, padding 24px 0 76px{"\n"}グリッド: display grid, grid-template-columns repeat(12, 1fr){"\n"}タイトルセル: padding clamp(18px, 4vw, 36px){"\n"}メタセル: padding 16px{"\n"}カラムセル: padding 16px{"\n"}プロンプトセクション: margin-top 22px, padding 15px{"\n"}{"\n"}モーション:{"\n"}カラム登場: @keyframes snap — from opacity 0 translateY(8px) to opacity 1 translateY(0){"\n"}duration: 0.5s ease both{"\n"}スタガー: カラムごとに0.08s間隔 (animation-delay){"\n"}ホバーアニメーションなし、スクロールトリガー効果なし。{"\n"}{"\n"}レスポンシブ:{"\n"}- &lt;= 840px: 全グリッド子要素を12カラム span、border-right 0{"\n"}- デスクトップ: 12カラムグリッド維持、max-width 1100px{"\n"}{"\n"}禁止事項:{"\n"}- パネルやグリッドセルの角丸{"\n"}- コンテンツ領域のグラデーション、グロウ、box-shadow{"\n"}- --red 以外の追加アクセントカラー{"\n"}- イラスト、アイコン、装飾画像{"\n"}- 0.5s超のアニメーション{"\n"}{"\n"}出力:{"\n"}1) 全カラートークンリストとタイポグラフィスケール{"\n"}2) 12カラムグリッドレイアウトと正確なspan比率（8:4ヒーロー、4:4:4カラム）{"\n"}3) @media 840pxブレイクポイント付きレスポンシブ単一ファイルHTML/CSS</pre>
            <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
          </section>
        </main>
        <footer className="page-footer">
          <a href="/">Web Stylebook</a> · Style Sample Page
        </footer>
        <nav className="page-nav" aria-label="페이지 내비게이션"><a href="/pages/cyberpunk-glitch.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg><span><span className="page-nav__label">이전</span>Cyberpunk Glitch</span></a><div className="page-nav__divider" /><a href="/pages/quiet-utility.html"><span><span className="page-nav__label">다음</span>Quiet Utility</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg></a></nav>
      </div>
    </div>
  );
}
