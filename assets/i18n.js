/**
 * i18n — lightweight translation layer for Design Prompt Hub.
 * Stores EN / KO dictionaries, handles switching, persists via localStorage.
 */
(() => {
  // Ensure [hidden] is never overridden by component CSS (e.g. display:inline-flex)
  const style = document.createElement('style');
  style.textContent = '[hidden]{display:none!important}';
  document.head.appendChild(style);

  const translations = {
    /* ─── English (default) ─── */
    en: {
      // Skip link
      'skip': 'Skip to content',

      // Nav
      'nav.styles': 'Styles',
      'nav.fusion': 'Fusion',
      'nav.workflow': 'Workflow',

      // Theme toggle
      'theme.toggle.aria': 'Toggle theme',
      'theme.toggle.title': 'Switch light/dark theme',

      // Language toggle
      'lang.toggle.aria': 'Switch language',

      // Hero
      'hero.aria': 'Hero',
      'hero.desc': 'Browse sample pages by template, combine styles into workflows, and generate step-by-step prompts. Start designing creative web experiences.',
      'chip.style-split': 'Style-separated Templates',
      'chip.combo': 'Combination Experiments',
      'chip.prompt': 'Prompt Management',
      'chip.workflow': 'Workflow Integration',
      'stat.aria': 'Key statistics',

      // Style section
      'section.styles': 'Style Sample Pages',
      'search.placeholder': 'Search styles...',
      'search.aria': 'Search styles',
      'filter.aria': 'Tag filters',
      'filter.all': 'All',
      'palette.aria': 'Key colors',

      // Card descriptions (styles)
      'card.neon-drift.desc': 'Dynamic neon glow style inspired by night cityscapes.',
      'card.editorial-silence.desc': 'Restrained elegance with magazine typography and generous whitespace.',
      'card.kinetic-pop.desc': 'Bold color contrast and rhythm-driven motion design.',
      'card.earth-atelier.desc': 'Neutral, nature-inspired textures and organic layout.',
      'card.brutalist-grid.desc': 'Raw, heavy lines and structural typographic block system.',
      'card.glass-orbit.desc': 'Layered transparent panels with 3D depth glassmorphism.',
      'card.midnight-noir.desc': 'Overwhelming dark luxury with gold and silver accents.',
      'card.bento-bloom.desc': 'Soft pastel tones with an Apple-inspired bento grid.',
      'card.terminal-core.desc': 'Monospace fonts and developer console narrative.',
      'card.console-launch.desc': 'Dark onboarding with interactive cursor and panels.',
      'card.swiss-poster.desc': 'Grid-system and alignment-focused informational style.',
      'card.holographic-fluid.desc': 'Holographic mesh gradients with dreamy fluid motion.',
      'card.cyberpunk-glitch.desc': 'Neon contrast, monospace, and glitch-infused terminal look.',
      'card.zen-minimalism.desc': 'Extreme whitespace and serif fonts focused on essence.',
      'card.aurora-gradient.desc': 'Organic multi-color blur gradients flowing like aurora.',
      'card.grain-texture.desc': 'Film grain overlay and muted analog-tone aesthetic.',
      'card.liquid-metal.desc': 'Chrome metallic reflections with monochrome silver palette.',
      'card.mesh-gradient.desc': 'Apple-style multi-point mesh gradient, bright and refined.',
      'card.mono-type.desc': 'Monochrome style using only typographic weight and size for hierarchy.',
      'card.soft-pastel.desc': 'Ultra-soft pastel tones with warm rounded pill-shaped UI.',
      'card.claymorphism.desc': 'Cozy double-shadow volumetric clay-style web structure.',
      'card.y2k-retro.desc': 'High-contrast colors, pixel fonts, and Windows 95-era hip aesthetic.',
      'card.neumorphism.desc': 'Light and shadow emboss on a unified background surface.',

      // Buttons
      'btn.view': 'View Page',
      'btn.workflow': 'Apply Workflow',
      'btn.set-global': '★\uFE0E Set Global',
      'btn.applied': '★\uFE0E Applied',

      // No results
      'no-results.styles': 'No matching styles found.',
      'no-results.fusion': 'No matching fusion styles found.',

      // Fusion section
      'section.fusion': 'Fusion Styles',
      'card.neon-swiss.desc': 'A perfect blend of neon energy and Swiss design alignment.',
      'card.bento-noir.desc': 'Premium look combining efficient bento layout with dark luxury.',
      'card.editorial-terminal.desc': 'Editorial readability meets tech log aesthetics.',
      'card.holo-glass.desc': 'Dreamy organic backgrounds with transparent 3D glassmorphism.',
      'card.earth-zen.desc': 'Natural neutral tones with gallery-grade whitespace.',
      'card.kinetic-brutal.desc': 'Bold primary-color pop art with thick borders and destructive wireframes.',
      'card.cyber-console.desc': 'Hacker console sensibility fused with cyberpunk neon glitch.',

      // Workflow section
      'section.workflow': 'Prompt Workflow',
      'workflow.desc': 'Automatically generates sequential prompts in order: Design → Component → Assembly → QA. Each selected template has its own DNA-infused environment ready.',
      'workflow.cta': 'Open Smart Workflow Dashboard',

      // Footer
      'footer.desc': 'Design Prompt Hub — A creative workflow hub to explore design styles, experiment with fusion combinations, and auto-generate step-by-step prompts.',
      'footer.stat.styles': 'Style Templates',
      'footer.stat.fusions': 'Fusion Combos',
      'footer.stat.pages': 'Sample Pages',
      'footer.cta': 'Start Workflow',

      // Copy feedback (used by app.js)
      'copy.success': 'Copied!',
      'copy.fail': 'Copy failed',

      // Back link (style/fusion pages)
      'back.hub': 'Back to Hub',
      'back.hub.aria': 'Back to Hub',

      // Prompt-workflow page
      'pw.nav.hub': 'Go to Hub',
      'pw.hero.title': 'Design → Component → Assembly → QA',
      'pw.hero.subtitle': 'Lock in style/typography/stack first, then generate step-by-step prompts. Entering from a template card auto-applies that style to this page.',
      'pw.input.title': 'INPUT CONFIG',
      'pw.label.project': 'Project Name',
      'pw.label.target': 'Core Target',
      'pw.label.target.default': 'Solo creators/early teams building UI fast with AI',
      'pw.label.hub-ref': 'Design Hub References (multi-select)',
      'pw.btn.deselect': 'Deselect All',
      'pw.label.product': 'Product/Service Description',
      'pw.label.product.default': 'A web hub for comparing design samples and generating step-by-step prompts to boost UI productivity',
      'pw.label.hub-summary': 'Hub Style Summary (auto-filled)',
      'pw.label.hub-summary.default': 'Selected design hub styles will be automatically reflected here.',
      'pw.hint.hub-summary': 'Auto-included in prompts. Edit directly if needed.',
      'pw.label.typo-profile': 'Typography Profile',
      'pw.option.typo-auto': 'Style-based recommendation (default)',
      'pw.option.typo-manual': 'Keep manual input',
      'pw.hint.typo': 'Default is a recommendation based on style combination.',
      'pw.label.font-heading': 'Headline Font',
      'pw.label.font-body': 'Body Font',
      'pw.label.font-code': 'Code/Terminal Font',
      'pw.label.type-density': 'Typography Density',
      'pw.label.type-note': 'Typography Notes',
      'pw.label.type-note.default': 'Headlines with clear hierarchy, body prioritizing readability, code text limited to supplementary areas.',
      'pw.label.style-dir': 'Preferred Style Direction',
      'pw.label.style-dir.default': 'Clear information structure, restrained decoration, high component consistency — practical UI',
      'pw.label.must-keep': 'Must Keep',
      'pw.label.must-keep.default': 'Mobile stability, component reusability, readability-first typography, clipping safety rules',
      'pw.label.pages': 'Required Pages',
      'pw.label.tech': 'Tech Stack',
      'pw.option.tech-custom': 'Custom input',
      'pw.placeholder.tech-custom': 'e.g., Nuxt 3 + Tailwind + TypeScript + Storybook',
      'pw.label.forbidden': 'Forbidden',
      'pw.label.forbidden.default': 'Horizontal scroll, meaningless exaggerated motion, excessive blur, low-contrast text',
      'pw.state.title': 'Current Settings',
      'pw.state.style': 'Style',
      'pw.state.style.none': 'None selected',
      'pw.state.typo': 'Typography',
      'pw.state.typo.auto': 'Style-based recommendation',
      'pw.state.stack': 'Stack',
      'pw.state.pages': 'Pages',
      'pw.state.pages.count': ' pages',
      'pw.state.theme': 'Theme',
      'pw.step1': '1) Design Prompt',
      'pw.step2': '2) Component Prompt',
      'pw.step3': '3) Assembly Prompt',
      'pw.step4': '4) QA Prompt',
      'pw.btn.copy': 'Copy',
      'pw.btn.expand': 'Expand',
      'pw.btn.collapse': 'Collapse',
      'pw.full.title': 'Full Execution Prompt',
      'pw.full.copy': 'Copy All',
      'pw.note1': '1. Lock in style/typography first, then proceed to the component phase for stable quality.',
      'pw.note2': '2. For fusion styles, include weight/priority descriptions to avoid inconsistent results.',
      'pw.note3': '3. At the QA stage, verify overflow, responsiveness, and typography consistency simultaneously.',
      'pw.hint.no-ref': 'No references selected',

      // Inline copy feedback
      'copy.done.label': 'Copied!',

      // Common page keys
      'page.heading.prompt': 'AI Request Prompt',
      'page.btn.copy': 'Copy Prompt',
      'page.nav.hub': 'Go to Hub',
      'page.nav.aria': 'Page navigation',
      'page.nav.prev': 'Previous',
      'page.nav.next': 'Next',
    },

    /* ─── Korean ─── */
    ko: {
      'skip': '본문으로 건너뛰기',
      'nav.styles': '스타일',
      'nav.fusion': '퓨전',
      'nav.workflow': '워크플로우',
      'theme.toggle.aria': '테마 전환',
      'theme.toggle.title': '라이트/다크 테마 전환',
      'lang.toggle.aria': '언어 전환',
      'hero.aria': '히어로',
      'hero.desc': '템플릿별 샘플 페이지를 확인하고, 원하는 스타일 조합을 워크플로우에 반영해 단계별 프롬프트를 생성하는 허브입니다. 창의적인 웹 경험 설계를 시작하세요.',
      'chip.style-split': '템플릿별 스타일 분리',
      'chip.combo': '조합 스타일 실험',
      'chip.prompt': '프롬프트 매니징',
      'chip.workflow': '워크플로우 연동',
      'stat.aria': '주요 통계',
      'section.styles': '스타일 샘플 페이지',
      'search.placeholder': '스타일 검색...',
      'search.aria': '스타일 검색',
      'filter.aria': '태그 필터',
      'filter.all': '전체',
      'palette.aria': '대표 컬러',
      'card.neon-drift.desc': '야간 도시, 네온, 글로우 중심의 역동적 스타일.',
      'card.editorial-silence.desc': '잡지형 타이포그래피와 여백을 살린 절제미.',
      'card.kinetic-pop.desc': '강렬한 컬러 대비와 리듬감 있는 모션 중심.',
      'card.earth-atelier.desc': '자연의 질감과 뉴트럴 감성 기반의 레이아웃.',
      'card.brutalist-grid.desc': '굵고 투박한 선, 구조적인 타이포 블록 시스템.',
      'card.glass-orbit.desc': '투명 레이어 중첩과 깊이감을 살린 3D 배경 글래스모피즘.',
      'card.midnight-noir.desc': '압도적인 다크 럭셔리와 세밀한 골드/은빛 포인트.',
      'card.bento-bloom.desc': '부드러운 파스텔 톤과 애플 감성의 벤토 구조.',
      'card.terminal-core.desc': '모노스페이스 폰트와 개발자 콘솔 내러티브.',
      'card.console-launch.desc': '다크 온보딩 방식의 인터랙티브 커서와 패널.',
      'card.swiss-poster.desc': '격자 시스템과 정렬 중심의 정보 지향적 스타일.',
      'card.holographic-fluid.desc': '홀로그래픽 매시 그라데이션과 몽환적인 유체 모션.',
      'card.cyberpunk-glitch.desc': '네온 대비와 모노스페이스, 글리치가 결합된 터미널 룩.',
      'card.zen-minimalism.desc': '극도의 여백과 세리프 폰트로 본질에 집중하는 스타일.',
      'card.aurora-gradient.desc': '오로라처럼 유기적으로 흐르는 다중 컬러 블러 그라데이션 배경.',
      'card.grain-texture.desc': '필름 그레인 오버레이와 뮤트 톤의 아날로그 감성 스타일.',
      'card.liquid-metal.desc': '크롬과 메탈릭 질감의 반사 효과, 모노크롬 실버 팔레트.',
      'card.mesh-gradient.desc': 'Apple 스타일 다중 포인트 메시 그라데이션, 밝고 세련된 느낌.',
      'card.mono-type.desc': '오직 타이포그래피의 크기와 무게로만 위계를 만드는 모노크롬 스타일.',
      'card.soft-pastel.desc': '울트라 소프트 파스텔 톤과 둥근 필 형태의 따뜻한 인터페이스.',
      'card.claymorphism.desc': '포근하고 푹신한 더블 그림자(입체 볼륨) 기반의 친화형 웹 구조.',
      'card.y2k-retro.desc': '고대비 컬러, 픽셀 폰트, 윈도우 95 감성의 투박하고 힙한 구조.',
      'card.neumorphism.desc': '배경과 완벽히 통일된 컬러 위에서 빛과 그림자 양각만으로 승부하는 룩.',
      'btn.view': '페이지 보기',
      'btn.workflow': '워크플로우 적용',
      'btn.set-global': '★\uFE0E 글로벌 테마로 적용',
      'btn.applied': '★\uFE0E 적용 완료',
      'no-results.styles': '일치하는 스타일이 없습니다.',
      'no-results.fusion': '일치하는 퓨전 스타일이 없습니다.',
      'section.fusion': '조합 스타일 (Fusion)',
      'card.neon-swiss.desc': '네온 에너지와 스위스 디자인 정렬의 완벽한 결합.',
      'card.bento-noir.desc': '효율적인 벤토 구조에 다크 럭셔리를 얹어낸 프리미엄 룩.',
      'card.editorial-terminal.desc': '에디토리얼 특유의 압도적 가독성과 기술 로그 감성의 조화.',
      'card.holo-glass.desc': '몽환적인 유기적 배경에 투명한 입체감을 얹은 프리미엄 글래스모피즘.',
      'card.earth-zen.desc': '자연의 뉴트럴 톤과 압도적인 여백 미학의 최고급 갤러리 룩.',
      'card.kinetic-brutal.desc': '강렬한 원색 팝아트와 두꺼운 테두리, 파괴적인 와이어프레임.',
      'card.cyber-console.desc': '해커 콘솔 감성과 사이버펑크 네온 글리치의 치명적 융합.',
      'section.workflow': '프롬프트 워크플로우 실행',
      'workflow.desc': '설계 ➔ 컴포넌트 제작 ➔ 프레임 조립 ➔ 품질 검증 (QA) 순서로 프롬프트를 자동 연속 생성합니다. 선택한 템플릿의 DNA를 이식한 개별 환경이 준비되어 있습니다.',
      'workflow.cta': '🚀 스마트 워크플로우 대시보드 열기',
      'footer.desc': 'Design Prompt Hub — 다양한 디자인 스타일을 탐색하고, 퓨전 조합을 실험하며, 단계별 프롬프트를 자동 생성하는 크리에이티브 워크플로우 허브입니다.',
      'footer.stat.styles': '스타일 템플릿',
      'footer.stat.fusions': '퓨전 조합',
      'footer.stat.pages': '샘플 페이지',
      'footer.cta': '🚀 워크플로우 시작하기',
      'copy.success': '복사 완료',
      'copy.fail': '복사 실패',
      'back.hub': '허브로 돌아가기',
      'back.hub.aria': '허브로 돌아가기',
      'pw.nav.hub': '허브로 이동',
      'pw.hero.title': '설계 -> 컴포넌트 -> 조립 -> QA',
      'pw.hero.subtitle': '스타일/타이포/스택을 먼저 고정하고 단계별 프롬프트를 생성합니다. 템플릿 카드에서 들어오면 해당 스타일 톤이 이 페이지에 자동 적용됩니다.',
      'pw.input.title': 'INPUT CONFIG',
      'pw.label.project': '프로젝트 이름',
      'pw.label.target': '핵심 타겟',
      'pw.label.target.default': 'AI로 UI를 빠르게 제작하려는 1인 제작자/초기 팀',
      'pw.label.hub-ref': '디자인 허브 레퍼런스 (복수 선택)',
      'pw.btn.deselect': '선택 해제',
      'pw.label.product': '제품/서비스 설명',
      'pw.label.product.default': '디자인 샘플을 비교하고, 프롬프트를 단계별로 생성해 UI 생산성을 높이는 웹 허브',
      'pw.label.hub-summary': '허브 스타일 요약(자동 반영)',
      'pw.label.hub-summary.default': '선택한 디자인 허브 스타일이 여기에 자동으로 반영됩니다.',
      'pw.hint.hub-summary': '프롬프트에 자동 포함됩니다. 필요하면 직접 수정하세요.',
      'pw.label.typo-profile': '타이포그래피 프로필',
      'pw.option.typo-auto': '스타일 기반 추천 (기본)',
      'pw.option.typo-manual': '직접 입력 유지',
      'pw.hint.typo': '기본은 스타일 조합에 맞춘 추천값입니다.',
      'pw.label.font-heading': '헤드라인 폰트',
      'pw.label.font-body': '본문 폰트',
      'pw.label.font-code': '코드/터미널 폰트',
      'pw.label.type-density': '타이포 밀도',
      'pw.label.type-note': '타이포 메모',
      'pw.label.type-note.default': '헤드라인은 명확한 계층, 본문은 가독성 우선, 코드 텍스트는 보조 정보 영역에 제한 사용.',
      'pw.label.style-dir': '선호 스타일 방향',
      'pw.label.style-dir.default': '정보 구조는 명확하고, 장식은 절제하며, 컴포넌트 일관성이 높은 실무형 UI',
      'pw.label.must-keep': '반드시 유지할 것',
      'pw.label.must-keep.default': '모바일 안정성, 컴포넌트 재사용성, 가독성 우선 타이포, 클리핑 안전 규칙',
      'pw.label.pages': '필요 페이지',
      'pw.label.tech': '구현 스택',
      'pw.option.tech-custom': '직접 입력',
      'pw.placeholder.tech-custom': '예: Nuxt 3 + Tailwind + TypeScript + Storybook',
      'pw.label.forbidden': '금지사항',
      'pw.label.forbidden.default': '가로 스크롤, 의미 없는 과장 모션, 과한 blur, 낮은 대비 텍스트',
      'pw.state.title': '현재 설정',
      'pw.state.style': '스타일',
      'pw.state.style.none': '선택 안함',
      'pw.state.typo': '타이포',
      'pw.state.typo.auto': '스타일 기반 추천',
      'pw.state.stack': '스택',
      'pw.state.pages': '페이지',
      'pw.state.pages.count': '개',
      'pw.state.theme': '테마',
      'pw.step1': '1) 설계 프롬프트',
      'pw.step2': '2) 컴포넌트 프롬프트',
      'pw.step3': '3) 조립 프롬프트',
      'pw.step4': '4) QA 프롬프트',
      'pw.btn.copy': '복사',
      'pw.btn.expand': '펼치기',
      'pw.btn.collapse': '접기',
      'pw.full.title': '전체 실행 프롬프트',
      'pw.full.copy': '전체 복사',
      'pw.note1': '1. 스타일/타이포를 먼저 확정한 뒤 컴포넌트 단계로 내려가면 품질이 안정됩니다.',
      'pw.note2': '2. 조합 스타일은 가중치/우선순위를 함께 적어야 결과가 흔들리지 않습니다.',
      'pw.note3': '3. QA 단계에서 overflow, 반응형, 타이포 일관성을 동시에 검증하세요.',
      'pw.hint.no-ref': '선택한 레퍼런스 없음',
      'copy.done.label': '복사 완료!',

      // Common page keys
      'page.heading.prompt': 'AI 요청 프롬프트',
      'page.btn.copy': '프롬프트 복사',
      'page.nav.hub': '허브로 이동',
      'page.nav.aria': '페이지 내비게이션',
      'page.nav.prev': '이전',
      'page.nav.next': '다음',
    },

    /* ─── Japanese ─── */
    ja: {
      'skip': '本文へスキップ',
      'nav.styles': 'スタイル',
      'nav.fusion': 'フュージョン',
      'nav.workflow': 'ワークフロー',
      'theme.toggle.aria': 'テーマ切替',
      'theme.toggle.title': 'ライト/ダークテーマ切替',
      'lang.toggle.aria': '言語切替',
      'hero.aria': 'ヒーロー',
      'hero.desc': 'テンプレート別のサンプルページを確認し、スタイルの組み合わせをワークフローに反映してステップ別プロンプトを生成するハブです。クリエイティブなウェブ体験の設計を始めましょう。',
      'chip.style-split': 'テンプレート別スタイル分離',
      'chip.combo': '組み合わせスタイル実験',
      'chip.prompt': 'プロンプト管理',
      'chip.workflow': 'ワークフロー連携',
      'stat.aria': '主要統計',
      'section.styles': 'スタイルサンプルページ',
      'search.placeholder': 'スタイル検索...',
      'search.aria': 'スタイル検索',
      'filter.aria': 'タグフィルター',
      'filter.all': '全て',
      'palette.aria': '代表カラー',
      'card.neon-drift.desc': '夜の都市、ネオン、グロー中心のダイナミックなスタイル。',
      'card.editorial-silence.desc': '雑誌的タイポグラフィと余白を活かした抑制の美。',
      'card.kinetic-pop.desc': '強烈なカラーコントラストとリズム感のあるモーション中心。',
      'card.earth-atelier.desc': '自然の質感とニュートラルな感性ベースのレイアウト。',
      'card.brutalist-grid.desc': '太く荒い線、構造的なタイポブロックシステム。',
      'card.glass-orbit.desc': '透明レイヤーの重なりと奥行き感を活かした3Dグラスモーフィズム。',
      'card.midnight-noir.desc': '圧倒的なダークラグジュアリーと繊細なゴールド/シルバーポイント。',
      'card.bento-bloom.desc': '柔らかなパステルトーンとApple感性のBentoグリッド構造。',
      'card.terminal-core.desc': 'モノスペースフォントと開発者コンソールナラティブ。',
      'card.console-launch.desc': 'ダークオンボーディング方式のインタラクティブカーソルとパネル。',
      'card.swiss-poster.desc': 'グリッドシステムと整列中心の情報指向スタイル。',
      'card.holographic-fluid.desc': 'ホログラフィックメッシュグラデーションと幻想的な流体モーション。',
      'card.cyberpunk-glitch.desc': 'ネオンコントラストとモノスペース、グリッチが融合したターミナルルック。',
      'card.zen-minimalism.desc': '極限の余白とセリフフォントで本質に集中するスタイル。',
      'card.aurora-gradient.desc': 'オーロラのように有機的に流れるマルチカラーブラーグラデーション背景。',
      'card.grain-texture.desc': 'フィルムグレインオーバーレイとミュートトーンのアナログ感性スタイル。',
      'card.liquid-metal.desc': 'クロームとメタリック質感の反射効果、モノクロームシルバーパレット。',
      'card.mesh-gradient.desc': 'Apple風マルチポイントメッシュグラデーション、明るく洗練された印象。',
      'card.mono-type.desc': 'タイポグラフィのサイズと太さだけで階層を作るモノクロームスタイル。',
      'card.soft-pastel.desc': 'ウルトラソフトパステルトーンと丸いピル形の温かいインターフェース。',
      'card.claymorphism.desc': '柔らかなダブルシャドウ（立体ボリューム）ベースの親和型ウェブ構造。',
      'card.y2k-retro.desc': 'ハイコントラストカラー、ピクセルフォント、Windows 95感性のヒップな構造。',
      'card.neumorphism.desc': '背景と完全統一されたカラーの上で光と影のエンボスだけで表現するルック。',
      'btn.view': 'ページを見る',
      'btn.workflow': 'ワークフロー適用',
      'btn.set-global': '★\uFE0E グローバル適用',
      'btn.applied': '★\uFE0E 適用完了',
      'no-results.styles': '一致するスタイルがありません。',
      'no-results.fusion': '一致するフュージョンスタイルがありません。',
      'section.fusion': '組み合わせスタイル（Fusion）',
      'card.neon-swiss.desc': 'ネオンエネルギーとスイスデザイン整列の完璧な融合。',
      'card.bento-noir.desc': '効率的なBentoレイアウトにダークラグジュアリーを載せたプレミアムルック。',
      'card.editorial-terminal.desc': 'エディトリアル特有の圧倒的可読性とテックログ感性の調和。',
      'card.holo-glass.desc': '幻想的な有機的背景に透明な立体感を載せたプレミアムグラスモーフィズム。',
      'card.earth-zen.desc': '自然のニュートラルトーンと圧倒的な余白美学の最高級ギャラリールック。',
      'card.kinetic-brutal.desc': '強烈な原色ポップアートと太い枠線、破壊的なワイヤーフレーム。',
      'card.cyber-console.desc': 'ハッカーコンソール感性とサイバーパンクネオングリッチの致命的融合。',
      'section.workflow': 'プロンプトワークフロー実行',
      'workflow.desc': '設計 ➔ コンポーネント制作 ➔ フレーム組立 ➔ 品質検証（QA）の順でプロンプトを自動連続生成します。選択したテンプレートのDNAを移植した個別環境が準備されています。',
      'workflow.cta': 'スマートワークフローダッシュボードを開く',
      'footer.desc': 'Design Prompt Hub — 多様なデザインスタイルを探索し、フュージョン組み合わせを実験し、ステップ別プロンプトを自動生成するクリエイティブワークフローハブです。',
      'footer.stat.styles': 'スタイルテンプレート',
      'footer.stat.fusions': 'フュージョン組み合わせ',
      'footer.stat.pages': 'サンプルページ',
      'footer.cta': 'ワークフロー開始',
      'copy.success': 'コピー完了',
      'copy.fail': 'コピー失敗',
      'back.hub': 'ハブに戻る',
      'back.hub.aria': 'ハブに戻る',
      'pw.nav.hub': 'ハブへ移動',
      'pw.hero.title': '設計 → コンポーネント → 組立 → QA',
      'pw.hero.subtitle': 'スタイル/タイポ/スタックを先に固定してステップ別プロンプトを生成します。テンプレートカードから入ると、そのスタイルトーンがこのページに自動適用されます。',
      'pw.input.title': 'INPUT CONFIG',
      'pw.label.project': 'プロジェクト名',
      'pw.label.target': 'コアターゲット',
      'pw.label.target.default': 'AIでUIを素早く制作したい個人制作者/初期チーム',
      'pw.label.hub-ref': 'デザインハブリファレンス（複数選択）',
      'pw.btn.deselect': '選択解除',
      'pw.label.product': '製品/サービス説明',
      'pw.label.product.default': 'デザインサンプルを比較し、プロンプトをステップ別に生成してUI生産性を高めるウェブハブ',
      'pw.label.hub-summary': 'ハブスタイル要約（自動反映）',
      'pw.label.hub-summary.default': '選択したデザインハブスタイルがここに自動反映されます。',
      'pw.hint.hub-summary': 'プロンプトに自動含有されます。必要に応じて直接編集してください。',
      'pw.label.typo-profile': 'タイポグラフィプロファイル',
      'pw.option.typo-auto': 'スタイルベース推薦（デフォルト）',
      'pw.option.typo-manual': '手動入力を維持',
      'pw.hint.typo': 'デフォルトはスタイル組み合わせに基づく推薦値です。',
      'pw.label.font-heading': '見出しフォント',
      'pw.label.font-body': '本文フォント',
      'pw.label.font-code': 'コード/ターミナルフォント',
      'pw.label.type-density': 'タイポ密度',
      'pw.label.type-note': 'タイポメモ',
      'pw.label.type-note.default': '見出しは明確な階層、本文は可読性優先、コードテキストは補助情報領域に制限使用。',
      'pw.label.style-dir': '希望スタイル方向',
      'pw.label.style-dir.default': '情報構造は明確で、装飾は抑制し、コンポーネント一貫性が高い実務型UI',
      'pw.label.must-keep': '必ず維持すること',
      'pw.label.must-keep.default': 'モバイル安定性、コンポーネント再利用性、可読性優先タイポ、クリッピング安全ルール',
      'pw.label.pages': '必要ページ',
      'pw.label.tech': '実装スタック',
      'pw.option.tech-custom': '手動入力',
      'pw.placeholder.tech-custom': '例：Nuxt 3 + Tailwind + TypeScript + Storybook',
      'pw.label.forbidden': '禁止事項',
      'pw.label.forbidden.default': '横スクロール、無意味な誇張モーション、過度なblur、低コントラストテキスト',
      'pw.state.title': '現在の設定',
      'pw.state.style': 'スタイル',
      'pw.state.style.none': '未選択',
      'pw.state.typo': 'タイポ',
      'pw.state.typo.auto': 'スタイルベース推薦',
      'pw.state.stack': 'スタック',
      'pw.state.pages': 'ページ',
      'pw.state.pages.count': 'ページ',
      'pw.state.theme': 'テーマ',
      'pw.step1': '1) 設計プロンプト',
      'pw.step2': '2) コンポーネントプロンプト',
      'pw.step3': '3) 組立プロンプト',
      'pw.step4': '4) QAプロンプト',
      'pw.btn.copy': 'コピー',
      'pw.btn.expand': '展開',
      'pw.btn.collapse': '折りたたむ',
      'pw.full.title': '全体実行プロンプト',
      'pw.full.copy': '全体コピー',
      'pw.note1': '1. スタイル/タイポを先に確定してからコンポーネント段階に進むと品質が安定します。',
      'pw.note2': '2. 組み合わせスタイルは重み/優先順位を一緒に記述しないと結果がぶれます。',
      'pw.note3': '3. QA段階でoverflow、レスポンシブ、タイポ一貫性を同時に検証してください。',
      'pw.hint.no-ref': '選択したリファレンスなし',
      'copy.done.label': 'コピー完了！',

      // Common page keys
      'page.heading.prompt': 'AIリクエストプロンプト',
      'page.btn.copy': 'プロンプトをコピー',
      'page.nav.hub': 'ハブへ移動',
      'page.nav.aria': 'ページナビゲーション',
      'page.nav.prev': '前へ',
      'page.nav.next': '次へ',
    }
  };

  /** Get current language */
  function getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
  }

  /** Get a translation string by key */
  function t(key) {
    const lang = getCurrentLang();
    return (translations[lang] && translations[lang][key]) ||
      (translations.en && translations.en[key]) ||
      key;
  }

  /** Apply translations to all data-i18n elements */
  function applyTranslations() {
    const lang = getCurrentLang();
    document.documentElement.lang = lang;

    // textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== key) el.textContent = val;
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val !== key) el.placeholder = val;
    });

    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val !== key) el.setAttribute('aria-label', val);
    });

    // title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val !== key) el.title = val;
    });

    // value (textarea / input default values)
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      const val = t(key);
      if (val !== key) el.value = val;
    });

    // Show/hide data-lang elements (for page-specific content)
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.hidden = el.getAttribute('data-lang') !== lang;
    });

    // Update language dropdown state
    const LANG_NAMES = { en: 'English', ko: '한국어', ja: '日本語' };
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.textContent = LANG_NAMES[lang] || lang;
    }
    // Mark active item in dropdown menu
    document.querySelectorAll('[data-lang-select]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-select') === lang);
    });
  }

  /** Switch language and persist */
  function setLang(lang) {
    localStorage.setItem('lang', lang);
    applyTranslations();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  /** Cycle through en → ko → ja → en */
  function toggleLang() {
    const LANGS = ['en', 'ko', 'ja'];
    const current = getCurrentLang();
    const nextIdx = (LANGS.indexOf(current) + 1) % LANGS.length;
    setLang(LANGS[nextIdx]);
  }

  // Expose globally for app.js and inline scripts
  window.i18n = { getCurrentLang, t, applyTranslations, setLang, toggleLang };

  /** Initialize dropdown or fallback to cycle toggle */
  function initLangUI() {
    applyTranslations();

    const dropdown = document.getElementById('lang-dropdown');
    const langBtn = document.getElementById('lang-toggle');

    if (dropdown && langBtn) {
      // Toggle dropdown open/close
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      // Language selection from menu
      dropdown.querySelectorAll('[data-lang-select]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setLang(btn.getAttribute('data-lang-select'));
          dropdown.classList.remove('open');
        });
      });

      // Close on outside click
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });
    } else if (langBtn) {
      // Fallback: simple cycle toggle for pages without dropdown
      langBtn.addEventListener('click', toggleLang);
    }
  }

  // Apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangUI);
  } else {
    initLangUI();
  }
})();
