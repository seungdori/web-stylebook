# Web Stylebook Pro Kit Concept

## 핵심 판단

Web Stylebook의 무료 버전은 계속 오픈소스로 공개하는 편이 좋다.

이 프로젝트의 강점은 단순히 프롬프트 몇 개를 파는 것이 아니라, 사람들이 스타일을 탐색하고 AI 빌더에게 넘길 수 있는 신뢰 가능한 기준점을 제공하는 데 있다. 따라서 공개 repo는 SEO, 신뢰, 공유, 커뮤니티, 레퍼런스 역할을 계속 담당해야 한다.

유료화는 공개 repo를 막는 방식보다, 공개 repo 위에 시간을 절약해주는 산출물 묶음을 얹는 방식이 맞다.

정리하면:

- 공개: 스타일 카탈로그, 기본 프롬프트, 추천 로직, 기본 generator UI, SEO 페이지
- 유료: 완성 템플릿, React/Tailwind starter, Framer/Webflow 변환팩, 검증 체크리스트, 업데이트 번들, 라이선스

이 구조는 open-core에 가깝다. 무료만으로도 유용하지만, 실제 제품을 빠르게 만들 사람은 Pro Kit을 사는 구조다.

## Lovable 같은 반복 가능성의 의미

여기서 말한 "반복 가능"은 Lovable처럼 사용자가 제품 설명을 넣으면 매번 비슷한 구조로 앱/페이지 생성 지시가 나오는 흐름을 말한다.

다만 Web Stylebook이 직접 Lovable을 복제할 필요는 없다. 더 현실적인 포지션은 AI 빌더 앞단의 스타일/구현 브리핑 엔진이다.

즉:

1. 사용자가 만들 제품 유형을 고른다.
2. Web Stylebook이 적합한 스타일을 추천한다.
3. 필요한 화면 세트를 제안한다.
4. 색상, 타이포, 레이아웃, 모션 토큰을 잡는다.
5. Codex, Lovable, Framer, Webflow 같은 대상별 프롬프트를 생성한다.
6. Pro 버전에서는 실제 starter code, template, QA prompt, repair prompt까지 제공한다.

이 방식이면 Web Stylebook은 "AI 웹 디자인 스타일 기준점"이 되고, Lovable/Codex/Framer/Webflow는 실행 대상이 된다.

## 무료 버전의 역할

무료 버전은 일부러 너무 약하게 만들면 안 된다.

무료 버전은 다음을 제공해야 한다:

- 스타일별 상세 설명
- 복사 가능한 기본 구현 프롬프트
- 스타일 비교
- 색상/토큰 실험
- AI handoff 링크
- 기본 Pro Kit Generator 데모
- 오픈소스 repo 전체

무료 버전의 목적은 다음이다:

- 검색 유입 만들기
- 신뢰 확보
- "이 사람이 진짜 프롬프트와 디자인 품질을 이해한다"는 증거 만들기
- GitHub stars, 공유, 레퍼런스 링크 확보
- Pro 상품의 샘플 역할

무료 버전이 좋아야 유료 상품도 팔린다.

## Pro 버전의 역할

Pro는 단순히 더 긴 프롬프트가 아니다.

유료로 팔 만한 것은 "시간을 아껴주는 반복 가능한 구현 패키지"다.

예시:

- React/Vite 또는 Next.js starter components
- Tailwind theme preset
- CSS variables/token pack
- Framer template prompt
- Webflow section structure
- Lovable app scaffold prompt
- Codex implementation prompt
- self-audit prompt
- repair prompt
- mobile QA checklist
- 실제 화면별 변형: landing, dashboard, docs, portfolio, admin
- commercial license
- 업데이트 파일

무료가 "이 스타일로 만들어줘"라면, Pro는 "이 스타일로 실제 제품 화면을 반복해서 만들 수 있게 해주는 키트"다.

## 추천 상품 형태

### 1. Web Stylebook Pro Kit

가장 먼저 만들기 좋은 상품.

구성:

- 40~50개 스타일별 Pro prompt
- 제품 유형별 추천 규칙
- React/Tailwind starter snippets
- Codex/Lovable/Framer/Webflow용 프롬프트 변형
- QA/repair prompt
- commercial license

예상 가격:

- 초기: $39~$49
- 성숙 후: $79~$99

### 2. Style Template Pack

더 비싼 상품.

구성:

- 완성형 landing page template
- dashboard/admin starter
- docs site starter
- portfolio starter
- Framer/Webflow export guidance

예상 가격:

- $79~$149

### 3. Generator Pro

나중에 서비스가 커졌을 때.

구성:

- 웹에서 제품 유형 입력
- 스타일 추천
- full implementation prompt 생성
- template download
- license key
- 구매자 전용 업데이트

예상 가격:

- $9~$19/mo
- 또는 $99/year

처음부터 SaaS 구독으로 갈 필요는 없다. 먼저 ZIP/PDF/template pack 판매가 더 가볍다.

## 제품 유형별 generator 구조

초기 generator는 다음 5개 유형으로 충분하다.

### Operational SaaS

예: 대시보드, 어드민, 내부 시스템, 운영 도구

추천 스타일:

- primary: Quiet Utility
- secondary: Runtime Signal

Pro 출력:

- dashboard shell
- table/list view
- detail drawer
- create/edit form
- empty/loading/error states
- dense UI QA checklist

### Launch Campaign

예: 신제품 런칭, 음악 발매, 이벤트, 한정 드롭

추천 스타일:

- primary: Fusion Kinetic Brutal
- secondary: Duotone Bold

Pro 출력:

- hero section
- proof strip
- feature bands
- countdown/drop module
- single CTA flow

### Developer Docs

예: SDK 문서, API 가이드, CLI 매뉴얼

추천 스타일:

- primary: Fusion Editorial Terminal
- secondary: Platform Core

Pro 출력:

- docs layout
- guide article
- API reference shell
- code block components
- search/command palette prompt

### Portfolio / Studio

예: 디자이너 포트폴리오, 스튜디오, 케이스 스터디

추천 스타일:

- primary: Editorial Silence
- secondary: Mono Type

Pro 출력:

- index page
- case study template
- archive grid
- contact page
- writing prompt

### Developer Tool

예: CLI, 보안 도구, 오픈소스 유틸리티, 관측성 도구

추천 스타일:

- primary: Terminal Core
- secondary: Platform Core

Pro 출력:

- install flow
- command demo
- integrations
- GitHub proof module
- enterprise CTA

## 공개 repo와 비공개 상품 경계

공개 repo에 둬도 되는 것:

- 스타일 데이터
- 무료 프롬프트
- basic generator
- style recommendation rules
- static pages
- docs
- sitemap/SEO
- lightweight examples

비공개 또는 유료 상품에 둬야 하는 것:

- 완성 템플릿 ZIP
- export-ready React/Tailwind components
- Framer/Webflow template source
- buyer-only updates
- license files
- private download URLs
- extended QA/repair prompt library
- 실제 상업 프로젝트용 starter packs

중요한 기준:

공개된 것은 "배울 수 있고 테스트할 수 있는 것"이어야 한다.
유료인 것은 "바로 가져다 써서 시간을 아끼는 것"이어야 한다.

## 현재 구현 시도에 대한 판단

현재 만든 `/pages/pro-kit`은 개념 검증용으로는 의미가 있다.

좋은 점:

- 무료/Pro 경계를 페이지 안에 명시했다.
- 제품 유형별 추천 스타일 구조를 만들었다.
- Codex/Lovable/Framer/Webflow 대상별 프롬프트 변형을 만들 수 있다.
- 기존 styleCatalog를 활용하므로 완전히 따로 노는 기능은 아니다.

부족한 점:

- 디자인이 아직 제품답지 않다.
- generator라기보다 설명 페이지처럼 보인다.
- 실제 Pro 상품의 샘플 산출물이 부족하다.
- "이걸 사면 무엇을 받는지"가 아직 충분히 선명하지 않다.
- 무료와 유료의 체험 차이가 아직 작다.

따라서 다음 단계는 UI를 꾸미는 것이 아니라, Pro Kit의 실제 산출물 샘플을 먼저 1~2개 만드는 편이 낫다.

예:

- Operational SaaS Pro Kit sample
- Launch Campaign Pro Kit sample

각각에 대해:

- generated prompt
- token file
- component starter
- QA checklist
- repair prompt
- example output screenshot

이 정도가 있어야 상품성이 보인다.

## 추천 다음 순서

1. 현재 `/pages/pro-kit` 디자인은 버리거나 크게 재설계한다.
2. 먼저 Pro Kit 상품 샘플 1개를 만든다.
3. 샘플은 `Operational SaaS`로 시작한다.
4. 산출물은 문서가 아니라 실제 파일 묶음처럼 구성한다.
5. 그 다음 웹 UI는 "generator"보다 "상품 샘플을 보여주는 tool surface"로 다시 설계한다.

권장 샘플 구조:

```text
products/
  operational-saas-kit/
    README.md
    prompts/
      codex.md
      lovable.md
      repair.md
      self-audit.md
    tokens/
      theme.css
      tailwind.tokens.json
    components/
      AppShell.tsx
      DataTable.tsx
      DetailDrawer.tsx
      EmptyState.tsx
    qa/
      checklist.md
```

이런 실제 산출물 샘플이 생기면, 웹페이지 디자인도 훨씬 명확해진다.

## 최종 결론

무료 오픈소스 공개는 유지한다.

유료화는 repo를 닫는 방식이 아니라, 공개 repo 위에 "반복 가능한 구현 키트"를 판매하는 방식이 맞다.

현재 무료 프롬프트 수준은 충분히 공개해도 된다. 유료 상품은 프롬프트를 조금 더 길게 쓰는 것이 아니라, 템플릿, 토큰, 컴포넌트, QA, repair prompt, license까지 포함한 패키지여야 한다.

가장 현실적인 첫 상품은 다음이다.

```text
Web Stylebook Pro Kit
50 AI-ready style implementation kits
Codex / Lovable / Framer / Webflow prompts
React + Tailwind starter snippets
QA and repair prompt library
Commercial license
```

처음 가격은 $39~$49로 시작하고, 실제 템플릿과 업데이트가 쌓이면 $79~$99까지 올릴 수 있다.
