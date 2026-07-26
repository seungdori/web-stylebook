# Web Stylebook

Web Stylebook은 프론트엔드 디자인 방향을 탐색하고, 그 방향을 구현 프롬프트로 바꾸기 위한 정적 사이트입니다.

## 포함 기능

- `src/ported/pages`를 source로 렌더링하는 48개 스타일 레퍼런스
- 32개 기본 스타일과 16개 퓨전 스타일 조합
- 스타일 좌우 비교
- 프롬프트 워크플로우 생성기
- 적용·주의·근거·검증 항목을 갖춘 검색형 UX 원칙 실무 가이드
- 배치·적용·검증 항목을 갖춘 검색형 시각 디자인 원칙 실무 가이드
- 색상 시스템 및 명도 대비 테스트
- 인터랙션 조정을 위한 Animation Lab
- route data 기반 canonical, hreflang, `sitemap.xml`, `robots.txt` 생성

## 개발

```bash
npm install
npm run dev
```

## 검증

```bash
npm run typecheck
npm run lint
npm run build
npm run generate:seo
npm run generate:agent-handoff
python3 -m http.server 4173 -d dist
```

빌드 후 아래 경로를 확인합니다.

- `/`
- `/ko/`
- `/pages/brutalist-grid.html`
- `/ko/pages/neon-drift.html`
- `/ja/pages/framer-motion.html`
- `/pages/compare`
- `/pages/compare.html`
- `/pages/prompt-workflow`
- `/pages/prompt-workflow.html`
- `/pages/animation-lab`
- `/pages/animation-example`
- `/pages/component-glossary`
- `/pages/ux-principles`
- `/pages/design-principles`

## 소스 구조

- `src/data/styles.ts`: 스타일 카드, 프롬프트 프로필, 팔레트, SEO 메타데이터
- `src/ported/pages/*.tsx`: 32개 기본 스타일과 16개 퓨전 페이지의 React source of truth
- `src/ported/portedStylePages.css`: 페이지별 비주얼 모티프, 팔레트, 타이포그래피, 인터랙션 CSS
- `src/data/stylePages.ts`: 스타일 상세 페이지의 타입 기반 fallback/메타데이터
- `src/data/routes.ts`: 정적 route 생성과 hreflang URL
- `src/catalog/principles.ts`: UX 원칙 페이지와 MCP 카탈로그가 함께 사용하는 원본
- `src/catalog/designPrinciples.ts`: 시각 디자인 원칙 페이지와 MCP 카탈로그가 함께 사용하는 원본
- `public/previews/*.html`: 포팅 검증용 레거시 시각 레퍼런스이며 빌드 source로 쓰지 않음
- `scripts/generate-static-pages.mjs`: 모든 React route에 Vite entry HTML을 쓰고 기존 `.html` alias도 유지
- `scripts/generate-seo.mjs`: React route data에서 `sitemap.xml`, `robots.txt` 생성

## 라이선스

[CC BY-NC 4.0](./LICENSE)

UX 원칙 실무 가이드는 독자적으로 작성했으며 [Laws of UX](https://lawsofux.com)
(CC BY-NC-ND 4.0)를 색인 참고 출처로 표시합니다. 원문의 문구·삽화·페이지 레이아웃은 포함하지 않습니다.
독자 작성한 원칙 카탈로그는
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)에서 MIT로도 배포합니다.

시각 디자인 원칙 실무 가이드는 현대 인터페이스를 위한 과업 중심 검토 체계로 독자 작성했습니다.
의미 구조·반응형 재배치·현지화·토큰과 테마·다중 입력 방식·전체 상태 모델·복구·동작 선호를
함께 다룹니다. 이 카탈로그는 `web-stylebook-mcp`에서 MIT로도 배포합니다.
