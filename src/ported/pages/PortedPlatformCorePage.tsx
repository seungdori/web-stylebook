import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';

export function PortedPlatformCorePage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);
  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--platform-core">
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
            <header className="platform-nav">
              <a className="brand" href="#main-content">
                <span className="brand__mark">PC</span>
                <span>Platform Core</span>
              </a>
              <ul className="platform-nav__links">
                <li><a href="#resources"><span data-lang="en">Modes</span><span data-lang="ko" hidden>모드</span><span data-lang="ja" hidden>モード</span></a></li>
                <li><a href="#product"><span data-lang="en">Structure</span><span data-lang="ko" hidden>구성</span><span data-lang="ja" hidden>構成</span></a></li>
                <li><a href="#proof"><span data-lang="en">Rationale</span><span data-lang="ko" hidden>기준</span><span data-lang="ja" hidden>基準</span></a></li>
                <li><a href="#faq"><span data-lang="en">FAQ</span><span data-lang="ko" hidden>FAQ</span><span data-lang="ja" hidden>FAQ</span></a></li>
              </ul>
              <div className="platform-nav__actions">
                <button className="mode-toggle" id="color-mode-toggle" data-mode-toggle="platform-core" type="button" aria-label="Toggle light/dark theme" title="Toggle light/dark theme">
                  <span className="mode-toggle__label mode-toggle__label--to-light">
                    <span data-lang="en">Light theme</span>
                    <span data-lang="ko" hidden>라이트 테마</span>
                    <span data-lang="ja" hidden>ライトテーマ</span>
                  </span>
                  <span className="mode-toggle__label mode-toggle__label--to-dark">
                    <span data-lang="en">Dark theme</span>
                    <span data-lang="ko" hidden>다크 테마</span>
                    <span data-lang="ja" hidden>ダークテーマ</span>
                  </span>
                </button>
                <div className="lang-dropdown" id="lang-dropdown">
                  <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" aria-label="Switch language">English</button>
                  <ul className="lang-menu" role="menu">
                    <li><button role="menuitem" data-lang-select="en">English</button></li>
                    <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
                    <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
                  </ul>
                </div>
                <a className="nav-button nav-button--primary" href="#style-notes">
                  <span data-lang="en">Read the brief</span>
                  <span data-lang="ko" hidden>브리프 보기</span>
                  <span data-lang="ja" hidden>ブリーフを見る</span>
                </a>
              </div>
            </header>
            <main id="main-content">
              <section className="hero">
                <div className="hero__inner">
                  <p className="hero__eyebrow" data-lang="en">Dark-light platform reference</p>
                  <p className="hero__eyebrow" data-lang="ko" hidden>다크-라이트 플랫폼 레퍼런스</p>
                  <p className="hero__eyebrow" data-lang="ja" hidden>ダーク / ライトのプラットフォーム参照</p>
                  <h1 id="hero-title" data-lang="en">Use <span className="nowrap">Platform Core</span> when the page should feel shipped before it feels marketed.</h1>
                  <h1 id="hero-title-ko" data-lang="ko" hidden>페이지가 마케팅보다 먼저 출시된 제품처럼 보여야 한다면 <span className="nowrap">Platform Core</span>가 맞습니다.</h1>
                  <h1 id="hero-title-ja" data-lang="ja" hidden>ページがマーケティングより先に公開済みの製品として見えるべきなら <span className="nowrap">Platform Core</span> が合います。</h1>
                  <p className="hero__lede" data-lang="en">
                    It works best when sign-in, docs, environments, and support details need one calm system.
                    The goal is not spectacle. The goal is to make dark and light feel equally operational.
                  </p>
                  <p className="hero__lede" data-lang="ko" hidden>
                    로그인, 문서, 환경, 지원 정보가 하나의 차분한 시스템처럼 이어져야 할 때 가장 잘 맞습니다.
                    핵심은 연출이 아니라, 다크와 라이트가 똑같이 실무적으로 보이게 만드는 것입니다.
                  </p>
                  <p className="hero__lede" data-lang="ja" hidden>
                    サインイン、ドキュメント、環境、サポート情報がひとつの静かなシステムとして続くときに最も合います。
                    重要なのは演出ではなく、ダークとライトの両方を同じだけ実務的に見せることです。
                  </p>
                  <div className="auth-stack" aria-label="Entry surface preview">
                    <div className="auth-field">
                      <span data-lang="en">Work email</span>
                      <span data-lang="ko" hidden>업무용 이메일</span>
                      <span data-lang="ja" hidden>業務用メール</span>
                    </div>
                    <button className="auth-button auth-button--primary" type="button">
                      <span data-lang="en">Continue</span>
                      <span data-lang="ko" hidden>계속</span>
                      <span data-lang="ja" hidden>続ける</span>
                    </button>
                    <div className="divider">
                      <span data-lang="en">or</span>
                      <span data-lang="ko" hidden>또는</span>
                      <span data-lang="ja" hidden>または</span>
                    </div>
                    <button className="auth-button" type="button">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx={12} cy={12} r={9} />
                        <path d="M8.5 12h7" />
                        <path d="M12 8.5v7" />
                      </svg>
                      <span data-lang="en">Continue with SSO</span>
                      <span data-lang="ko" hidden>SSO로 계속</span>
                      <span data-lang="ja" hidden>SSOで続ける</span>
                    </button>
                    <button className="auth-button" type="button">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 18c-2-1-3.5-3.4-3.5-6a6.5 6.5 0 0 1 13 0c0 2.6-1.5 5-3.5 6" />
                        <path d="M8 18h8" />
                      </svg>
                      <span data-lang="en">Continue with GitHub</span>
                      <span data-lang="ko" hidden>GitHub로 계속</span>
                      <span data-lang="ja" hidden>GitHubで続ける</span>
                    </button>
                    <button className="auth-button" type="button">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x={4} y={5} width={16} height={14} rx={3} />
                        <path d="M8 10h8" />
                        <path d="M8 14h5" />
                      </svg>
                      <span data-lang="en">Continue with company domain</span>
                      <span data-lang="ko" hidden>회사 도메인으로 계속</span>
                      <span data-lang="ja" hidden>会社ドメインで続ける</span>
                    </button>
                    <button className="auth-button" type="button">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1A19.3 19.3 0 0 1 5.3 12.8 19.7 19.7 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3.2a2 2 0 0 1-.6 1.8l-1.7 1.7a16 16 0 0 0 6.5 6.5l1.7-1.7a2 2 0 0 1 1.8-.6l3.2.5A2 2 0 0 1 22 16.9z" />
                      </svg>
                      <span data-lang="en">Continue with phone</span>
                      <span data-lang="ko" hidden>전화번호로 계속</span>
                      <span data-lang="ja" hidden>電話番号で続ける</span>
                    </button>
                    <div className="legal-links">
                      <a href="#footer">
                        <span data-lang="en">Terms of Use</span>
                        <span data-lang="ko" hidden>이용약관</span>
                        <span data-lang="ja" hidden>利用規約</span>
                      </a>
                      <a href="#footer">
                        <span data-lang="en">Privacy Policy</span>
                        <span data-lang="ko" hidden>개인정보처리방침</span>
                        <span data-lang="ja" hidden>プライバシーポリシー</span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <section className="resource-strip" id="resources">
                <div className="resource-grid">
                  <article className="resource-card">
                    <div className="resource-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M8 6h10" />
                        <path d="M8 12h10" />
                        <path d="M8 18h10" />
                        <path d="M4 6h.01" />
                        <path d="M4 12h.01" />
                        <path d="M4 18h.01" />
                      </svg>
                    </div>
                    <div>
                      <h2 data-lang="en">Entry Surface</h2>
                      <h2 data-lang="ko" hidden>진입 표면</h2>
                      <h2 data-lang="ja" hidden>導入面</h2>
                    </div>
                    <p data-lang="en">A centered auth stack makes the page feel like a working platform before deeper copy appears.</p>
                    <p data-lang="ko" hidden>중앙 인증 스택은 본문을 읽기 전부터 이 페이지가 실제 플랫폼처럼 보이게 만듭니다.</p>
                    <p data-lang="ja" hidden>中央の認証スタックは、長い説明より 먼저このページを実在するプラットフォームのように見せます。</p>
                  </article>
                  <article className="resource-card">
                    <div className="resource-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M8 8h8" />
                        <path d="M8 12h8" />
                        <path d="M8 16h5" />
                        <rect x={4} y={4} width={16} height={16} rx={3} />
                      </svg>
                    </div>
                    <div>
                      <h2 data-lang="en">Resource Row</h2>
                      <h2 data-lang="ko" hidden>리소스 행</h2>
                      <h2 data-lang="ja" hidden>リソース列</h2>
                    </div>
                    <p data-lang="en">Four equal cards under the hero turn the first scroll into navigation instead of decoration.</p>
                    <p data-lang="ko" hidden>히어로 아래의 동일한 카드 네 장은 첫 스크롤을 장식이 아니라 내비게이션으로 바꿉니다.</p>
                    <p data-lang="ja" hidden>ヒーロー直下の4枚カードは、最初のスクロールを装飾ではなく案内に変えます。</p>
                  </article>
                  <article className="resource-card">
                    <div className="resource-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M8 7h8" />
                        <path d="M6 12h12" />
                        <path d="M10 17h4" />
                        <rect x={4} y={4} width={16} height={16} rx={4} />
                      </svg>
                    </div>
                    <div>
                      <h2 data-lang="en">Theme Pairing</h2>
                      <h2 data-lang="ko" hidden>테마 페어링</h2>
                      <h2 data-lang="ja" hidden>テーマ設計</h2>
                    </div>
                    <p data-lang="en">Dark and light should share one spacing model, one border language, and one component hierarchy.</p>
                    <p data-lang="ko" hidden>다크와 라이트는 하나의 간격 체계, 하나의 보더 언어, 하나의 컴포넌트 위계를 공유해야 합니다.</p>
                    <p data-lang="ja" hidden>ダークとライトはひとつの余白設計、ひとつの線の言語、ひとつのコンポーネント階層を共有するべきです。</p>
                  </article>
                  <article className="resource-card">
                    <div className="resource-card__icon">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3v18" />
                        <path d="M5 8h14" />
                        <path d="M5 16h14" />
                      </svg>
                    </div>
                    <div>
                      <h2 data-lang="en">Release Tone</h2>
                      <h2 data-lang="ko" hidden>출시 톤</h2>
                      <h2 data-lang="ja" hidden>公開トーン</h2>
                    </div>
                    <p data-lang="en">Legal links, support paths, and end-of-page actions should stay inside the same quiet system.</p>
                    <p data-lang="ko" hidden>약관, 지원 경로, 하단 액션도 모두 같은 조용한 시스템 안에 있어야 합니다.</p>
                    <p data-lang="ja" hidden>規約リンク、サポート導線、末尾の行動要素も同じ静かなシステム内に置くべきです。</p>
                  </article>
                </div>
              </section>
              <section className="section" id="product">
                <div className="section__head">
                  <p className="section__eyebrow" data-lang="en">Structure</p>
                  <p className="section__eyebrow" data-lang="ko" hidden>구성</p>
                  <p className="section__eyebrow" data-lang="ja" hidden>構成</p>
                  <h2 data-lang="en">One component language should cover entry, docs, proof, and support.</h2>
                  <h2 data-lang="ko" hidden>하나의 컴포넌트 언어가 진입, 문서, 근거, 지원까지 모두 덮어야 합니다.</h2>
                  <h2 data-lang="ja" hidden>ひとつのコンポーネント言語で導入、ドキュメント、根拠、サポートまで覆うべきです。</h2>
                  <p className="section__intro" data-lang="en">
                    Platform Core gets weaker when each section invents a new visual idea.
                    Keep the shell consistent so the page reads as one shipped system.
                  </p>
                  <p className="section__intro" data-lang="ko" hidden>
                    섹션마다 다른 시각 아이디어를 꺼내면 Platform Core는 바로 힘을 잃습니다.
                    바깥 껍질을 일관되게 유지해야 페이지 전체가 하나의 출시된 시스템처럼 읽힙니다.
                  </p>
                  <p className="section__intro" data-lang="ja" hidden>
                    セクションごとに別の視覚アイデアを持ち込むと、Platform Core はすぐ弱くなります。
                    外側のシェルを一貫させて、ページ全体をひとつの公開済みシステムとして読ませる必要があります。
                  </p>
                </div>
                <div className="feature-layout">
                  <div className="feature-grid">
                    <article className="feature-card">
                      <div className="feature-card__icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 3l8 4.5v9L12 21 4 16.5v-9L12 3z" />
                          <path d="M12 12l8-4.5" />
                          <path d="M12 12v9" />
                        </svg>
                      </div>
                      <div>
                        <h3 data-lang="en">Dark and light should share the same skeleton.</h3>
                        <h3 data-lang="ko" hidden>다크와 라이트는 같은 골격을 공유해야 합니다.</h3>
                        <h3 data-lang="ja" hidden>ダークとライトは同じ骨格を共有するべきです。</h3>
                      </div>
                      <p data-lang="en">Only the tokens change between modes. Radius, spacing, card density, and border weight stay fixed.</p>
                      <p data-lang="ko" hidden>모드 사이에서 바뀌어야 하는 것은 토큰뿐입니다. 반경, 간격, 카드 밀도, 보더 두께는 그대로 유지합니다.</p>
                      <p data-lang="ja" hidden>モード間で変わるべきなのはトークンだけです。角の半径、余白、カード密度、線の太さは固定します。</p>
                      <ul>
                        <li data-lang="en">Dark mode uses near-black surfaces and bright text.</li>
                        <li data-lang="ko" hidden>다크 모드는 거의 검은 표면과 밝은 텍스트를 사용합니다.</li>
                        <li data-lang="ja" hidden>ダークモードは黒に近い面と明るい文字を使います。</li>
                        <li data-lang="en">Light mode shifts to warm paper neutrals without becoming soft.</li>
                        <li data-lang="ko" hidden>라이트 모드는 따뜻한 페이퍼 뉴트럴로 옮기되 지나치게 부드러워지지 않게 합니다.</li>
                        <li data-lang="ja" hidden>ライトモードは温かい紙のようなニュートラルへ移しますが、甘くしすぎません。</li>
                      </ul>
                    </article>
                    <article className="feature-card">
                      <div className="feature-card__icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 12h16" />
                          <path d="M12 4v16" />
                          <rect x={5} y={5} width={14} height={14} rx={3} />
                        </svg>
                      </div>
                      <div>
                        <h3 data-lang="en">The hero should behave like an entry screen.</h3>
                        <h3 data-lang="ko" hidden>히어로는 슬로건이 아니라 진입 화면처럼 작동해야 합니다.</h3>
                        <h3 data-lang="ja" hidden>ヒーローはスローガンではなく、導入画面として機能するべきです。</h3>
                      </div>
                      <p data-lang="en">A centered sign-in stack gives the page immediate utility and keeps the headline from turning into a slogan wall.</p>
                      <p data-lang="ko" hidden>중앙 인증 스택은 페이지에 즉시 효용을 주고, 헤드라인이 과한 슬로건이 되는 것을 막아줍니다.</p>
                      <p data-lang="ja" hidden>中央の認証スタックはページに即時の用途を与え、見出しが大げさなスローガンになるのを防ぎます。</p>
                      <ul>
                        <li data-lang="en">Keep one clear primary action.</li>
                        <li data-lang="ko" hidden>주 액션은 하나만 분명하게 둡니다.</li>
                        <li data-lang="ja" hidden>主アクションはひとつだけ明確に置きます。</li>
                        <li data-lang="en">Let secondary paths stay visible but visually subordinate.</li>
                        <li data-lang="ko" hidden>보조 경로는 보이게 두되 시각적으로는 한 단계 낮춰 둡니다.</li>
                        <li data-lang="ja" hidden>補助導線は見せつつ、視覚的な優先度は一段下げます。</li>
                      </ul>
                    </article>
                    <article className="feature-card">
                      <div className="feature-card__icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 7h16" />
                          <path d="M4 12h10" />
                          <path d="M4 17h13" />
                        </svg>
                      </div>
                      <div>
                        <h3 data-lang="en">The resource row should explain the model fast.</h3>
                        <h3 data-lang="ko" hidden>리소스 행은 제품 모델을 빠르게 설명해야 합니다.</h3>
                        <h3 data-lang="ja" hidden>リソース列は製品モデルを素早く説明するべきです。</h3>
                      </div>
                      <p data-lang="en">The four cards under the hero do the work of sub-navigation. Short labels and one-line descriptions are enough.</p>
                      <p data-lang="ko" hidden>히어로 아래의 카드 네 장은 사실상 서브 내비게이션 역할을 합니다. 짧은 라벨과 한 줄 설명이면 충분합니다.</p>
                      <p data-lang="ja" hidden>ヒーロー下の4枚カードは、実質的にサブナビの役割を果たします。短いラベルと1行説明で十分です。</p>
                      <ul>
                        <li data-lang="en">Cards should stay equal in height and weight.</li>
                        <li data-lang="ko" hidden>카드는 높이와 무게감이 서로 같아야 합니다.</li>
                        <li data-lang="ja" hidden>カードは高さも重さも揃えるべきです。</li>
                        <li data-lang="en">Icons can be tiny and neutral, never decorative.</li>
                        <li data-lang="ko" hidden>아이콘은 작고 중립적이어야 하며, 장식처럼 보이면 안 됩니다.</li>
                        <li data-lang="ja" hidden>アイコンは小さく中立的であるべきで、装飾化してはいけません。</li>
                      </ul>
                    </article>
                    <article className="feature-card">
                      <div className="feature-card__icon">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2v20" />
                          <path d="M4 8h16" />
                          <path d="M4 16h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 data-lang="en">Proof and support must keep the same visual temperature.</h3>
                        <h3 data-lang="ko" hidden>근거와 지원 섹션도 같은 시각 온도를 유지해야 합니다.</h3>
                        <h3 data-lang="ja" hidden>根拠とサポートも同じ視覚温度を保つ必要があります。</h3>
                      </div>
                      <p data-lang="en">FAQ, legal links, and end-of-page actions should feel like the same system, not a softer marketing footer.</p>
                      <p data-lang="ko" hidden>FAQ, 약관 링크, 하단 액션도 별도 마케팅 푸터가 아니라 같은 시스템처럼 보여야 합니다.</p>
                      <p data-lang="ja" hidden>FAQ、規約リンク、末尾のアクションも、別のマーケティングフッターではなく同じシステムに見えるべきです。</p>
                      <ul>
                        <li data-lang="en">Keep the same line weight and corner language to the bottom of the page.</li>
                        <li data-lang="ko" hidden>페이지 끝까지 같은 보더 두께와 코너 언어를 유지합니다.</li>
                        <li data-lang="ja" hidden>ページ末尾まで同じ線の太さと角の言語を保ちます。</li>
                        <li data-lang="en">Reserve emphasis for one primary button and one accent value.</li>
                        <li data-lang="ko" hidden>강조는 주 버튼 하나와 액센트 값 하나에만 남겨둡니다.</li>
                        <li data-lang="ja" hidden>強調は主ボタン1つとアクセント1値にだけ残します。</li>
                      </ul>
                    </article>
                  </div>
                  <aside className="console-card" aria-label="Style preview">
                    <div className="console-card__top">
                      <span className="console-card__label" data-lang="en">Style tokens</span>
                      <span className="console-card__label" data-lang="ko" hidden>스타일 토큰</span>
                      <span className="console-card__label" data-lang="ja" hidden>スタイルトークン</span>
                      <span className="console-card__badge" data-lang="en">Shared across modes</span>
                      <span className="console-card__badge" data-lang="ko" hidden>양 모드 공통 구조</span>
                      <span className="console-card__badge" data-lang="ja" hidden>両モード共通構造</span>
                    </div>
                    <pre><code data-lang="en">entry_surface:{"\n"}{"  "}layout: centered{"\n"}{"  "}primary_action: 1{"\n"}{"  "}secondary_paths: 4{"\n"}{"\n"}tokens.dark:{"\n"}{"  "}bg: #101010{"\n"}{"  "}surface: #151515{"\n"}{"  "}line: #2b2b2b{"\n"}{"  "}accent: #ffffff{"\n"}{"\n"}tokens.light:{"\n"}{"  "}bg: #fafafa{"\n"}{"  "}surface: #ffffff{"\n"}{"  "}line: #e5e5e5{"\n"}{"  "}accent: #171717</code><code data-lang="ko" hidden>entry_surface:{"\n"}{"  "}layout: centered{"\n"}{"  "}primary_action: 1{"\n"}{"  "}secondary_paths: 4{"\n"}{"\n"}tokens.dark:{"\n"}{"  "}bg: #101010{"\n"}{"  "}surface: #151515{"\n"}{"  "}line: #2b2b2b{"\n"}{"  "}accent: #ffffff{"\n"}{"\n"}tokens.light:{"\n"}{"  "}bg: #fafafa{"\n"}{"  "}surface: #ffffff{"\n"}{"  "}line: #e5e5e5{"\n"}{"  "}accent: #171717</code><code data-lang="ja" hidden>entry_surface:{"\n"}{"  "}layout: centered{"\n"}{"  "}primary_action: 1{"\n"}{"  "}secondary_paths: 4{"\n"}{"\n"}tokens.dark:{"\n"}{"  "}bg: #101010{"\n"}{"  "}surface: #151515{"\n"}{"  "}line: #2b2b2b{"\n"}{"  "}accent: #ffffff{"\n"}{"\n"}tokens.light:{"\n"}{"  "}bg: #fafafa{"\n"}{"  "}surface: #ffffff{"\n"}{"  "}line: #e5e5e5{"\n"}{"  "}accent: #171717</code></pre>
                  </aside>
                </div>
              </section>
              <section className="section" id="proof">
                <div className="section__head">
                  <p className="section__eyebrow" data-lang="en">Why it works</p>
                  <p className="section__eyebrow" data-lang="ko" hidden>작동 기준</p>
                  <p className="section__eyebrow" data-lang="ja" hidden>成立条件</p>
                  <h2 data-lang="en">The page feels credible when the first screen already looks usable.</h2>
                  <h2 data-lang="ko" hidden>첫 화면이 이미 쓸 수 있는 제품처럼 보여야 전체 페이지가 신뢰를 얻습니다.</h2>
                  <h2 data-lang="ja" hidden>最初の画面がすでに使える製品のように見えるとき、ページ全体に信頼が生まれます。</h2>
                </div>
                <div className="proof-grid">
                  <article className="metric-card">
                    <p className="metric-card__eyebrow" data-lang="en">Core ratio</p>
                    <p className="metric-card__eyebrow" data-lang="ko" hidden>핵심 비율</p>
                    <p className="metric-card__eyebrow" data-lang="ja" hidden>コア比率</p>
                    <div className="metric-card__value" data-lang="en">2 modes / 1 system</div>
                    <div className="metric-card__value" data-lang="ko" hidden>2개 모드 / 1개 시스템</div>
                    <div className="metric-card__value" data-lang="ja" hidden>2 モード / 1 システム</div>
                    <p data-lang="en">Dark and light should change tokens, not product logic. That consistency is what makes the page feel launched instead of mocked up.</p>
                    <p data-lang="ko" hidden>다크와 라이트는 토큰만 달라져야 하고 제품 논리는 달라지면 안 됩니다. 그 일관성이 이 페이지를 목업이 아니라 출시된 화면처럼 보이게 만듭니다.</p>
                    <p data-lang="ja" hidden>ダークとライトで変わるべきなのはトークンだけで、製品ロジックではありません。その一貫性が、このページをモックではなく公開済み画面に見せます。</p>
                  </article>
                  <article className="quote-card">
                    <p className="quote-card__eyebrow" data-lang="en">Style note</p>
                    <p className="quote-card__eyebrow" data-lang="ko" hidden>스타일 노트</p>
                    <p className="quote-card__eyebrow" data-lang="ja" hidden>スタイルノート</p>
                    <blockquote data-lang="en">“If the entry screen already looks operational, the rest of the page can explain instead of perform.”</blockquote>
                    <blockquote data-lang="ko" hidden>“첫 진입 화면이 이미 실무적으로 보이면, 나머지 페이지는 연출하지 않고 설명만 해도 됩니다.”</blockquote>
                    <blockquote data-lang="ja" hidden>「最初の導入画面がすでに実務的に見えていれば、残りのページは演出ではなく説明に集中できます。」</blockquote>
                    <div className="quote-card__meta" data-lang="en">Platform Core guideline</div>
                    <div className="quote-card__meta" data-lang="ko" hidden>Platform Core 가이드라인</div>
                    <div className="quote-card__meta" data-lang="ja" hidden>Platform Core ガイドライン</div>
                  </article>
                </div>
                <div className="timeline-grid">
                  <article className="timeline-card">
                    <div className="timeline-card__step">01</div>
                    <h2 data-lang="en">Entry</h2>
                    <h2 data-lang="ko" hidden>진입</h2>
                    <h2 data-lang="ja" hidden>導入</h2>
                    <p data-lang="en">Start with a centered auth-style stack and one dominant action.</p>
                    <p data-lang="ko" hidden>중앙 인증형 스택과 하나의 주 액션으로 시작합니다.</p>
                    <p data-lang="ja" hidden>中央認証スタックとひとつの主アクションから始めます。</p>
                  </article>
                  <article className="timeline-card">
                    <div className="timeline-card__step">02</div>
                    <h2 data-lang="en">Resources</h2>
                    <h2 data-lang="ko" hidden>리소스</h2>
                    <h2 data-lang="ja" hidden>リソース</h2>
                    <p data-lang="en">Place four flat cards immediately below so docs and tools feel one click away.</p>
                    <p data-lang="ko" hidden>바로 아래에 플랫 카드 네 장을 두어 문서와 도구가 한 번에 닿는 것처럼 보이게 합니다.</p>
                    <p data-lang="ja" hidden>直下にフラットカードを4枚並べ、ドキュメントとツールが1クリック先にあるように見せます。</p>
                  </article>
                  <article className="timeline-card">
                    <div className="timeline-card__step">03</div>
                    <h2 data-lang="en">Surface</h2>
                    <h2 data-lang="ko" hidden>표면</h2>
                    <h2 data-lang="ja" hidden>サーフェス</h2>
                    <p data-lang="en">Use a split section with cards on one side and a quiet system preview on the other.</p>
                    <p data-lang="ko" hidden>한쪽은 카드, 다른 한쪽은 조용한 시스템 프리뷰로 나누어 보여줍니다.</p>
                    <p data-lang="ja" hidden>片側にカード、もう片側に静かなシステムプレビューを置く分割構成にします。</p>
                  </article>
                  <article className="timeline-card">
                    <div className="timeline-card__step">04</div>
                    <h2 data-lang="en">Close</h2>
                    <h2 data-lang="ko" hidden>마무리</h2>
                    <h2 data-lang="ja" hidden>締め</h2>
                    <p data-lang="en">End with proof, FAQ, and a restrained footer without changing the component language.</p>
                    <p data-lang="ko" hidden>근거, FAQ, 절제된 푸터로 마무리하되 컴포넌트 언어는 바꾸지 않습니다.</p>
                    <p data-lang="ja" hidden>根拠、FAQ、抑えたフッターで終えつつ、コンポーネント言語は変えません。</p>
                  </article>
                </div>
              </section>
              <section className="section" id="faq">
                <div className="section__head">
                  <p className="section__eyebrow" data-lang="en">FAQ</p>
                  <p className="section__eyebrow" data-lang="ko" hidden>FAQ</p>
                  <p className="section__eyebrow" data-lang="ja" hidden>FAQ</p>
                  <h2 data-lang="en">Common questions when adapting Platform Core to a style page.</h2>
                  <h2 data-lang="ko" hidden>Platform Core를 스타일 페이지로 옮길 때 자주 묻는 질문.</h2>
                  <h2 data-lang="ja" hidden>Platform Core をスタイルページに落とし込むときによくある質問。</h2>
                </div>
                <div className="faq-list">
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">Should light mode feel softer than dark mode?</span>
                      <span data-lang="ko" hidden>라이트 모드가 다크 모드보다 더 부드러워 보여야 하나요?</span>
                      <span data-lang="ja" hidden>ライトモードはダークモードより柔らかく見せるべきですか。</span>
                    </summary>
                    <p data-lang="en">No. It can be warmer, but it should keep the same spacing, border rhythm, and button behavior as dark mode.</p>
                    <p data-lang="ko" hidden>아니요. 더 따뜻할 수는 있지만 간격, 보더 리듬, 버튼 동작은 다크 모드와 같아야 합니다.</p>
                    <p data-lang="ja" hidden>いいえ。少し温かくはできますが、余白、線のリズム、ボタン挙動はダークモードと揃えるべきです。</p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">Do I need a big hero illustration?</span>
                      <span data-lang="ko" hidden>큰 히어로 일러스트가 꼭 필요한가요?</span>
                      <span data-lang="ja" hidden>大きなヒーローイラストは必要ですか。</span>
                    </summary>
                    <p data-lang="en">Not usually. The centered entry stack already gives the page a strong platform identity, so an oversized hero graphic often adds noise.</p>
                    <p data-lang="ko" hidden>보통은 필요 없습니다. 중앙 진입 스택만으로도 플랫폼 정체성이 충분하기 때문에, 큰 히어로 그래픽은 오히려 노이즈가 되기 쉽습니다.</p>
                    <p data-lang="ja" hidden>通常は不要です。中央の導入スタックだけで十分にプラットフォームらしさが出るため、大きなヒーローグラフィックはノイズになりやすいです。</p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">Can this style work outside developer tools?</span>
                      <span data-lang="ko" hidden>이 스타일은 개발자 도구 밖에서도 쓸 수 있나요?</span>
                      <span data-lang="ja" hidden>このスタイルは開発者向け以外にも使えますか。</span>
                    </summary>
                    <p data-lang="en">Yes. It also fits documentation, billing, scheduling, or account-management pages when trust matters more than spectacle.</p>
                    <p data-lang="ko" hidden>네. 신뢰가 연출보다 중요한 문서, 청구, 스케줄링, 계정 관리 페이지에도 잘 맞습니다.</p>
                    <p data-lang="ja" hidden>はい。演出より信頼が重要なドキュメント、請求、スケジューリング、アカウント管理ページにも合います。</p>
                  </details>
                  <details className="faq-item">
                    <summary>
                      <span data-lang="en">What usually makes this style look fake?</span>
                      <span data-lang="ko" hidden>이 스타일이 가장 먼저 가짜처럼 보이게 되는 지점은 무엇인가요?</span>
                      <span data-lang="ja" hidden>このスタイルがまず偽物っぽく見える原因は何ですか。</span>
                    </summary>
                    <p data-lang="en">Glow, dashboard theater, oversized slogans, or a light mode that looks like a separate redesign usually break it first.</p>
                    <p data-lang="ko" hidden>글로우, 대시보드식 연출, 과한 슬로건, 혹은 별도 리디자인처럼 보이는 라이트 모드가 가장 먼저 이 스타일을 깨뜨립니다.</p>
                    <p data-lang="ja" hidden>グロー、ダッシュボード的演出、過大なスローガン、あるいは別リデザインのようなライトモードが最初にこのスタイルを壊します。</p>
                  </details>
                </div>
              </section>
              <section className="section" id="style-notes">
                <div className="section__head">
                  <p className="section__eyebrow" data-lang="en">Style reference</p>
                  <p className="section__eyebrow" data-lang="ko" hidden>스타일 레퍼런스</p>
                  <p className="section__eyebrow" data-lang="ja" hidden>スタイルリファレンス</p>
                  <h2 data-lang="en">Platform Core works when dark and light both behave like product infrastructure.</h2>
                  <h2 data-lang="ko" hidden>Platform Core는 다크와 라이트가 모두 제품 인프라처럼 행동할 때 가장 잘 작동합니다.</h2>
                  <h2 data-lang="ja" hidden>Platform Core はダークとライトの両方が製品インフラのように振る舞うときに最も成立します。</h2>
                  <p className="section__intro" data-lang="en">
                    Use it when sign-in, docs, settings, and support all need to live inside one credible system.
                    The page should feel usable before it tries to persuade.
                  </p>
                  <p className="section__intro" data-lang="ko" hidden>
                    로그인, 문서, 설정, 지원이 모두 하나의 믿을 수 있는 시스템 안에 있어야 할 때 이 스타일이 맞습니다.
                    설득보다 먼저, 실제로 쓸 수 있을 것처럼 보여야 합니다.
                  </p>
                  <p className="section__intro" data-lang="ja" hidden>
                    サインイン、ドキュメント、設定、サポートがひとつの信頼できるシステム内に収まるべきとき、このスタイルが合います。
                    説得より前に、実際に使えそうに見えることが重要です。
                  </p>
                </div>
                <div className="notes-grid">
                  <article className="note-card">
                    <p className="note-card__eyebrow" data-lang="en">Theme pairing</p>
                    <p className="note-card__eyebrow" data-lang="ko" hidden>테마 페어링</p>
                    <p className="note-card__eyebrow" data-lang="ja" hidden>テーマ設計</p>
                    <h3 data-lang="en">Dark and light should share one component model.</h3>
                    <h3 data-lang="ko" hidden>다크와 라이트가 같은 컴포넌트 모델을 공유해야 합니다.</h3>
                    <h3 data-lang="ja" hidden>ダークとライトは同じコンポーネントモデルを共有するべきです。</h3>
                    <p data-lang="en">Do not treat light mode as a separate redesign. Keep the same spacing, border weight, button sizing, and card density so the product still feels operational.</p>
                    <p data-lang="ko" hidden>라이트 모드를 별도 리디자인처럼 다루지 않습니다. 간격, 보더 두께, 버튼 크기, 카드 밀도를 그대로 유지해야 실제 서비스처럼 보입니다.</p>
                    <p data-lang="ja" hidden>ライトモードを別デザインとして扱いません。余白、線の太さ、ボタンサイズ、カード密度を保つことで、実際のサービスらしさが残ります。</p>
                    <ul>
                      <li data-lang="en">Dark mode defaults to near-black surfaces and bright text.</li>
                      <li data-lang="ko" hidden>다크 모드는 거의 검은 표면과 밝은 텍스트를 기본으로 둡니다.</li>
                      <li data-lang="ja" hidden>ダークモードは黒に近い面と明るい文字を基準にします。</li>
                      <li data-lang="en">Light mode shifts to warm paper tones without becoming airy or soft.</li>
                      <li data-lang="ko" hidden>라이트 모드는 따뜻한 종이 톤으로 옮기되 지나치게 가볍거나 부드러워지지 않게 합니다.</li>
                      <li data-lang="ja" hidden>ライトモードは温かいペーパートーンへ移しつつ、軽すぎたり甘くなりすぎたりしないようにします。</li>
                    </ul>
                  </article>
                  <article className="note-card">
                    <p className="note-card__eyebrow" data-lang="en">Page anatomy</p>
                    <p className="note-card__eyebrow" data-lang="ko" hidden>페이지 구조</p>
                    <p className="note-card__eyebrow" data-lang="ja" hidden>ページ構成</p>
                    <h3 data-lang="en">The central sign-in stack sets the tone before anything else.</h3>
                    <h3 data-lang="ko" hidden>중앙 인증 스택이 페이지 톤을 가장 먼저 결정합니다.</h3>
                    <h3 data-lang="ja" hidden>中央のサインインスタックがページのトーンを最初に決めます。</h3>
                    <p data-lang="en">The first screen should look like a place a team could actually enter. That is why the auth stack, resource row, and support paths matter more than a giant headline alone.</p>
                    <p data-lang="ko" hidden>첫 화면은 팀이 실제로 들어갈 수 있는 목적지처럼 보여야 합니다. 그래서 거대한 헤드라인 하나보다 인증 스택, 리소스 행, 지원 경로가 더 중요합니다.</p>
                    <p data-lang="ja" hidden>最初の画面は、チームが実際に入っていける場所のように見えるべきです。だから巨大な見出し単体より、認証スタック、リソース列、サポート導線の方が重要です。</p>
                    <ul>
                      <li data-lang="en">Hero: centered auth flow with one primary action.</li>
                      <li data-lang="ko" hidden>히어로: 하나의 주 액션이 있는 중앙 인증 플로우.</li>
                      <li data-lang="ja" hidden>ヒーロー: 主動線が一つに絞られた中央認証フロー。</li>
                      <li data-lang="en">Middle: resource row, structure section, rationale, and workflow sequence.</li>
                      <li data-lang="ko" hidden>중간: 리소스 행, 구성 섹션, 기준, 워크플로우 순서.</li>
                      <li data-lang="ja" hidden>中盤: リソース列、構成セクション、基準、ワークフローの順序。</li>
                    </ul>
                  </article>
                  <article className="note-card">
                    <p className="note-card__eyebrow" data-lang="en">Surface rules</p>
                    <p className="note-card__eyebrow" data-lang="ko" hidden>표면 규칙</p>
                    <p className="note-card__eyebrow" data-lang="ja" hidden>サーフェス規則</p>
                    <h3 data-lang="en">Keep the system quiet: thin lines, flat fills, muted motion.</h3>
                    <h3 data-lang="ko" hidden>시스템은 조용하게 유지합니다: 얇은 라인, 평평한 면, 절제된 모션.</h3>
                    <h3 data-lang="ja" hidden>システムは静かに保ちます: 細い線、フラットな面、抑えた動き。</h3>
                    <p data-lang="en">The page becomes more believable when it avoids startup theater. Thin borders and consistent radii do more than decorative gradients or glow ever will.</p>
                    <p data-lang="ko" hidden>스타트업식 연출을 빼야 더 그럴듯해집니다. 장식용 그라데이션이나 글로우보다 얇은 보더와 일관된 반경이 훨씬 효과적입니다.</p>
                    <p data-lang="ja" hidden>スタートアップ的な演出を外した方が、かえって信頼できる見え方になります。装飾グラデーションやグローより、細いボーダーと一貫した角の方が効きます。</p>
                    <ul>
                      <li data-lang="en">No gradients, glass, floating badges, or oversized shadows.</li>
                      <li data-lang="ko" hidden>그라데이션, 글래스, 플로팅 배지, 과한 그림자는 사용하지 않습니다.</li>
                      <li data-lang="ja" hidden>グラデーション、ガラス表現、浮遊バッジ、大きなシャドウは使いません。</li>
                      <li data-lang="en">Hover states only adjust color or border tone within 160ms.</li>
                      <li data-lang="ko" hidden>호버는 160ms 안에서 색이나 보더 톤만 조정합니다.</li>
                      <li data-lang="ja" hidden>ホバーは 160ms 以内で色味か線のトーンだけを変えます。</li>
                    </ul>
                  </article>
                </div>
                <section className="prompt" id="style-prompt">
                  <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
                  <pre data-lang="en">Design a landing page in Platform Core style — a real launched developer platform with a restrained dark default theme and a matching light theme.{"\n"}{"\n"}This is not a concept site.{"\n"}It should feel like an actual product customers already use for docs, API access, environments, and launch operations.{"\n"}{"\n"}Choose a believable product category such as developer platform, API console, documentation service, release operations, or account infrastructure.{"\n"}Avoid AI, crypto, cyberpunk, luxury, futuristic visuals, startup hype language, or decorative dashboards.{"\n"}{"\n"}STYLE DNA:{"\n"}- dark mode by default, but light mode must feel equally intentional{"\n"}- central auth stack or account entry surface in the hero{"\n"}- thin-line cards with flat fills{"\n"}- restrained sans-serif typography{"\n"}- real navigation and resource hierarchy{"\n"}- no spectacle{"\n"}{"\n"}COLOR TOKENS:{"\n"}Dark:{"\n"}--bg: #101010{"\n"}--surface: #151515{"\n"}--surface-2: #1b1b1b{"\n"}--surface-3: #202020{"\n"}--text: #f4f4f4{"\n"}--muted: #a3a3a3{"\n"}--line: #2b2b2b{"\n"}--line-strong: #3a3a3a{"\n"}--accent: #ffffff{"\n"}--accent-ink: #121212{"\n"}{"\n"}Light:{"\n"}--bg: #fafafa{"\n"}--surface: #ffffff{"\n"}--surface-2: #f4f4f4{"\n"}--surface-3: #eeeeee{"\n"}--text: #171717{"\n"}--muted: #737373{"\n"}--line: #e5e5e5{"\n"}--line-strong: #d4d4d4{"\n"}--accent: #171717{"\n"}--accent-ink: #fafafa{"\n"}{"\n"}No gradients. No extra colors beyond tiny neutral SVG icons if needed.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}Heading + body: Inter or similar neutral sans-serif{"\n"}H1: clamp(2.8rem, 5.2vw, 4.8rem), weight 600, line-height 1.02{"\n"}H2: clamp(2rem, 4vw, 3.35rem), weight 600, line-height 1.05{"\n"}Card title: 1.35rem to 1.5rem, weight 600{"\n"}Body: 0.98rem to 1.05rem, line-height 1.65 to 1.75{"\n"}Meta/nav: 0.82rem to 0.875rem, weight 500 to 600{"\n"}No serif, no display fonts, no aggressive tracking.{"\n"}{"\n"}LAYOUT:{"\n"}- max-width around 1280px{"\n"}- calm centered hero{"\n"}- compact top nav with real links{"\n"}- hero width around 760px{"\n"}- auth stack width around 820px{"\n"}- four resource cards below hero{"\n"}- split product section with cards on one side and a platform preview panel on the other{"\n"}- one proof section with a metric and one customer quote{"\n"}- one 4-step workflow strip{"\n"}- FAQ{"\n"}- style prompt block near the end{"\n"}- mobile breakpoint around 768px, stack cleanly to one column{"\n"}{"\n"}COMPONENT RULES:{"\n"}- borders: 1px only{"\n"}- large rounded corners are allowed, but keep them consistent{"\n"}- shadows: none, or extremely subtle only{"\n"}- buttons: ordinary platform buttons, not glossy{"\n"}- cards: flat surfaces, no hover lift{"\n"}- links: color or underline shift only{"\n"}- motion: hover transitions only, 160ms max{"\n"}{"\n"}COPY TONE:{"\n"}- calm{"\n"}- operational{"\n"}- specific{"\n"}- written like a company with paying customers{"\n"}- no claims like revolutionary, magical, next-generation, or transforming everything{"\n"}{"\n"}FORBIDDEN:{"\n"}- glassmorphism{"\n"}- mesh gradients{"\n"}- neon glow{"\n"}- floating chips{"\n"}- decorative analytics charts{"\n"}- giant centered slogan blocks with no utility{"\n"}- cinematic marketing art{"\n"}- anything that feels like an AI-generated Dribbble concept{"\n"}{"\n"}OUTPUT:{"\n"}1) CSS custom properties for both dark and light themes{"\n"}2) semantic HTML + CSS{"\n"}3) responsive desktop/tablet/mobile layout{"\n"}4) accessible contrast in both modes{"\n"}5) no horizontal scroll{"\n"}6) a believable real-service information hierarchy</pre>
                  <pre data-lang="ko" hidden>Platform Core 스타일의 랜딩 페이지를 디자인해줘 — 절제된 다크 기본 테마와 이에 정확히 대응하는 라이트 테마를 가진, 실제 출시된 개발자 플랫폼처럼 보여야 한다.{"\n"}{"\n"}이건 컨셉 사이트가 아니다.{"\n"}문서, API 접근, 환경 관리, 출시 운영을 위해 고객이 이미 쓰고 있는 실제 제품처럼 보여야 한다.{"\n"}{"\n"}개발자 플랫폼, API 콘솔, 문서 서비스, 릴리스 운영, 계정 인프라 같은 현실적인 제품 카테고리를 선택해라.{"\n"}AI, 크립토, 사이버펑크, 럭셔리, 미래주의 비주얼, 스타트업 과장 카피, 장식용 대시보드는 피하라.{"\n"}{"\n"}STYLE DNA:{"\n"}- 기본은 다크 모드이되 라이트 모드도 동등하게 의도된 화면이어야 함{"\n"}- 히어로에는 중앙 인증 스택 또는 계정 진입 화면이 있어야 함{"\n"}- 얇은 라인의 플랫 카드{"\n"}- 절제된 산세리프 타이포그래피{"\n"}- 실제 서비스 같은 내비게이션과 리소스 위계{"\n"}- 과장 없음{"\n"}{"\n"}COLOR TOKENS:{"\n"}Dark:{"\n"}--bg: #101010{"\n"}--surface: #151515{"\n"}--surface-2: #1b1b1b{"\n"}--surface-3: #202020{"\n"}--text: #f4f4f4{"\n"}--muted: #a3a3a3{"\n"}--line: #2b2b2b{"\n"}--line-strong: #3a3a3a{"\n"}--accent: #ffffff{"\n"}--accent-ink: #121212{"\n"}{"\n"}Light:{"\n"}--bg: #fafafa{"\n"}--surface: #ffffff{"\n"}--surface-2: #f4f4f4{"\n"}--surface-3: #eeeeee{"\n"}--text: #171717{"\n"}--muted: #737373{"\n"}--line: #e5e5e5{"\n"}--line-strong: #d4d4d4{"\n"}--accent: #171717{"\n"}--accent-ink: #fafafa{"\n"}{"\n"}그라데이션 금지. 필요하다면 아주 작은 중립 SVG 아이콘 정도만 허용.{"\n"}{"\n"}TYPOGRAPHY:{"\n"}제목 + 본문: Inter 또는 유사한 중립 산세리프{"\n"}H1: clamp(2.8rem, 5.2vw, 4.8rem), weight 600, line-height 1.02{"\n"}H2: clamp(2rem, 4vw, 3.35rem), weight 600, line-height 1.05{"\n"}카드 제목: 1.35rem ~ 1.5rem, weight 600{"\n"}본문: 0.98rem ~ 1.05rem, line-height 1.65 ~ 1.75{"\n"}메타/내비: 0.82rem ~ 0.875rem, weight 500 ~ 600{"\n"}세리프, 디스플레이 폰트, 과한 자간 금지.{"\n"}{"\n"}LAYOUT:{"\n"}- 최대 폭은 약 1280px{"\n"}- 차분한 중앙 정렬 히어로{"\n"}- 실제 링크가 있는 컴팩트한 상단 내비{"\n"}- 히어로 폭은 약 760px{"\n"}- 인증 스택 폭은 약 820px{"\n"}- 히어로 아래에 리소스 카드 4개{"\n"}- 한쪽은 카드, 다른 한쪽은 플랫폼 프리뷰 패널인 분할 제품 섹션{"\n"}- metric 1개와 고객 코멘트 1개가 있는 proof 섹션{"\n"}- 4단계 워크플로우 스트립{"\n"}- FAQ{"\n"}- 끝부분에 스타일 프롬프트 블록{"\n"}- 모바일 브레이크포인트는 약 768px, 한 컬럼으로 깔끔하게 정리{"\n"}{"\n"}COMPONENT RULES:{"\n"}- 보더는 1px만 사용{"\n"}- 큰 radius는 허용하지만 일관되게 유지{"\n"}- 그림자는 없거나 매우 약하게만 사용{"\n"}- 버튼은 평범한 플랫폼 버튼, 광택 효과 금지{"\n"}- 카드는 플랫 표면, hover lift 금지{"\n"}- 링크는 색상 변화나 underline 변화만 허용{"\n"}- 모션은 hover 전환만, 최대 160ms{"\n"}{"\n"}COPY TONE:{"\n"}- 차분함{"\n"}- 실무적임{"\n"}- 구체적임{"\n"}- 실제 유료 고객이 있는 회사처럼 작성{"\n"}- revolutionary, magical, next-generation, everything을 바꾼다는 식의 표현 금지{"\n"}{"\n"}FORBIDDEN:{"\n"}- 글래스모피즘{"\n"}- 메시 그라데이션{"\n"}- 네온 글로우{"\n"}- 플로팅 칩{"\n"}- 장식용 분석 차트{"\n"}- 효용 없는 거대한 중앙 슬로건 블록{"\n"}- 영화 같은 마케팅 아트{"\n"}- AI가 생성한 Dribbble 컨셉처럼 보이는 모든 것{"\n"}{"\n"}OUTPUT:{"\n"}1) 다크/라이트 양쪽 테마용 CSS 커스텀 프로퍼티{"\n"}2) semantic HTML + CSS{"\n"}3) 데스크톱/태블릿/모바일 반응형 레이아웃{"\n"}4) 두 모드 모두 접근성 대비 확보{"\n"}5) 가로 스크롤 없음{"\n"}6) 실제 서비스다운 정보 위계</pre>
                  <pre data-lang="ja" hidden>Platform Core スタイルのランディングページをデザインしてください — 節度のあるダークを基本テーマにしつつ、それに対応するライトテーマも同じ完成度で成立する、実際に公開済みの開発者プラットフォームのように見えること。{"\n"}{"\n"}これはコンセプトサイトではない。{"\n"}ドキュメント、API アクセス、環境管理、公開運用のために、すでに顧客が使っている実在サービスのように見せること。{"\n"}{"\n"}開発者プラットフォーム、API コンソール、ドキュメントサービス、リリース運用、アカウント基盤など、現実味のある製品カテゴリを選ぶこと。{"\n"}AI、暗号資産、サイバーパンク、ラグジュアリー、未来的ビジュアル、スタートアップ的な誇張コピー、装飾ダッシュボードは避けること。{"\n"}{"\n"}STYLE DNA:{"\n"}- ダークモードが初期状態だが、ライトモードも同じだけ意図的に設計されていること{"\n"}- ヒーローには中央の認証スタックまたはアカウント導線を置くこと{"\n"}- 細いラインのフラットカード{"\n"}- 抑制されたサンセリフタイポグラフィ{"\n"}- 実サービスのようなナビゲーションとリソース階層{"\n"}- スペクタクルなし{"\n"}{"\n"}COLOR TOKENS:{"\n"}Dark:{"\n"}--bg: #101010{"\n"}--surface: #151515{"\n"}--surface-2: #1b1b1b{"\n"}--surface-3: #202020{"\n"}--text: #f4f4f4{"\n"}--muted: #a3a3a3{"\n"}--line: #2b2b2b{"\n"}--line-strong: #3a3a3a{"\n"}--accent: #ffffff{"\n"}--accent-ink: #121212{"\n"}{"\n"}Light:{"\n"}--bg: #fafafa{"\n"}--surface: #ffffff{"\n"}--surface-2: #f4f4f4{"\n"}--surface-3: #eeeeee{"\n"}--text: #171717{"\n"}--muted: #737373{"\n"}--line: #e5e5e5{"\n"}--line-strong: #d4d4d4{"\n"}--accent: #171717{"\n"}--accent-ink: #fafafa{"\n"}{"\n"}グラデーションは禁止。必要ならごく小さな中立 SVG アイコンのみ許容。{"\n"}{"\n"}TYPOGRAPHY:{"\n"}見出し + 本文: Inter または近いニュートラルサンセリフ{"\n"}H1: clamp(2.8rem, 5.2vw, 4.8rem), weight 600, line-height 1.02{"\n"}H2: clamp(2rem, 4vw, 3.35rem), weight 600, line-height 1.05{"\n"}カードタイトル: 1.35rem から 1.5rem, weight 600{"\n"}本文: 0.98rem から 1.05rem, line-height 1.65 から 1.75{"\n"}メタ/ナビ: 0.82rem から 0.875rem, weight 500 から 600{"\n"}セリフ体、ディスプレイ体、過度な字間は禁止。{"\n"}{"\n"}LAYOUT:{"\n"}- 最大幅は約 1280px{"\n"}- 落ち着いた中央配置のヒーロー{"\n"}- 実リンクを持つコンパクトな上部ナビ{"\n"}- ヒーロー幅は約 760px{"\n"}- 認証スタック幅は約 820px{"\n"}- ヒーロー下に 4 枚のリソースカード{"\n"}- 片側にカード、もう片側にプラットフォームプレビューを置く分割セクション{"\n"}- 指標 1 つと顧客コメント 1 つの proof セクション{"\n"}- 4 ステップのワークフローストリップ{"\n"}- FAQ{"\n"}- 終盤にスタイルプロンプトブロック{"\n"}- モバイルブレークポイントは約 768px、1 カラムに整然と積む{"\n"}{"\n"}COMPONENT RULES:{"\n"}- ボーダーは 1px のみ{"\n"}- 大きめの radius は許容するが全体で統一すること{"\n"}- シャドウはなし、または極めて弱く{"\n"}- ボタンは普通のプラットフォームボタンで、光沢表現なし{"\n"}- カードはフラット面、ホバーで浮かせない{"\n"}- リンクは色変化または下線変化のみ{"\n"}- モーションはホバー遷移のみ、最大 160ms{"\n"}{"\n"}COPY TONE:{"\n"}- 落ち着いている{"\n"}- 実務的{"\n"}- 具体的{"\n"}- 有料顧客がいる会社のように書く{"\n"}- revolutionary、magical、next-generation、すべてを変える、のような表現は禁止{"\n"}{"\n"}FORBIDDEN:{"\n"}- グラスモーフィズム{"\n"}- メッシュグラデーション{"\n"}- ネオングロー{"\n"}- フローティングチップ{"\n"}- 装飾目的の分析チャート{"\n"}- 実用性のない巨大な中央スローガンブロック{"\n"}- シネマティックなマーケティングアート{"\n"}- AI 生成の Dribbble コンセプトに見えるあらゆるもの{"\n"}{"\n"}OUTPUT:{"\n"}1) ダーク / ライト両テーマの CSS カスタムプロパティ{"\n"}2) semantic HTML + CSS{"\n"}3) デスクトップ / タブレット / モバイル対応レイアウト{"\n"}4) 両モードで十分なコントラスト{"\n"}5) 横スクロールなし{"\n"}6) 実サービスらしい情報階層</pre>
                  <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
                </section>
              </section>
              <footer className="footer" id="footer">
                <div className="footer__grid">
                  <section className="footer-panel">
                    <p className="footer__kicker">Platform Core</p>
                    <h2 data-lang="en">A platform reference that stays operational in both dark and light.</h2>
                    <h2 data-lang="ko" hidden>다크와 라이트 모두에서 운영형 톤을 유지하는 플랫폼 레퍼런스.</h2>
                    <h2 data-lang="ja" hidden>ダークとライトの両方で運用感を保つプラットフォーム参照。</h2>
                    <p className="footer__note" data-lang="en">Use this style when trust should come from consistency, thin lines, and a clear entry surface rather than marketing theater.</p>
                    <p className="footer__note" data-lang="ko" hidden>이 스타일은 마케팅 연출보다 일관성, 얇은 라인, 명확한 진입 표면에서 신뢰가 나와야 할 때 적합합니다.</p>
                    <p className="footer__note" data-lang="ja" hidden>このスタイルは、マーケティング演出よりも一貫性、細い線、明確な導入面から信頼が生まれるべきときに向いています。</p>
                    <a className="nav-button nav-button--primary" href="#hero-title">
                      <span data-lang="en">Back to top</span>
                      <span data-lang="ko" hidden>상단으로</span>
                      <span data-lang="ja" hidden>上へ戻る</span>
                    </a>
                  </section>
                  <section className="footer-panel">
                    <p className="footer__kicker" data-lang="en">Sections</p>
                    <p className="footer__kicker" data-lang="ko" hidden>섹션</p>
                    <p className="footer__kicker" data-lang="ja" hidden>セクション</p>
                    <ul>
                      <li><a href="#resources"><span data-lang="en">Modes</span><span data-lang="ko" hidden>모드</span><span data-lang="ja" hidden>モード</span></a></li>
                      <li><a href="#product"><span data-lang="en">Structure</span><span data-lang="ko" hidden>구성</span><span data-lang="ja" hidden>構成</span></a></li>
                      <li><a href="#proof"><span data-lang="en">Rationale</span><span data-lang="ko" hidden>기준</span><span data-lang="ja" hidden>基準</span></a></li>
                    </ul>
                  </section>
                  <section className="footer-panel">
                    <p className="footer__kicker" data-lang="en">Links</p>
                    <p className="footer__kicker" data-lang="ko" hidden>링크</p>
                    <p className="footer__kicker" data-lang="ja" hidden>リンク</p>
                    <ul>
                      <li><a href="#faq"><span data-lang="en">FAQ</span><span data-lang="ko" hidden>FAQ</span><span data-lang="ja" hidden>FAQ</span></a></li>
                      <li><a href="#style-prompt"><span data-lang="en">AI Request Prompt</span><span data-lang="ko" hidden>AI 요청 프롬프트</span><span data-lang="ja" hidden>AI リクエストプロンプト</span></a></li>
                      <li><a href="/" data-i18n="back.hub">Back to Hub</a></li>
                    </ul>
                  </section>
                </div>
              </footer>
            </main>
          </div>
        </div>
        <nav className="page-nav" data-i18n-aria="page.nav.aria" aria-label="Page navigation">
          <a href="/pages/quiet-utility.html">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span><span className="page-nav__label" data-i18n="page.nav.prev">Previous</span>Quiet Utility</span>
          </a>
          <span className="page-nav__divider" aria-hidden="true" />
          <a href="/pages/runtime-signal.html">
            <span><span className="page-nav__label" data-i18n="page.nav.next">Next</span>Runtime Signal</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
