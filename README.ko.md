# Web Stylebook

Web Stylebook은 프론트엔드 디자인 방향을 탐색하고, 그 방향을 구현 프롬프트로 바꾸기 위한 정적 사이트입니다.

## 포함 기능

- `src/ported/pages`를 source로 렌더링하는 48개 스타일 레퍼런스
- 32개 기본 스타일과 16개 퓨전 스타일 조합
- 스타일 좌우 비교
- 프롬프트 워크플로우 생성기
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
- `/?lang=ko`
- `/pages/brutalist-grid.html`
- `/pages/neon-drift.html?lang=ko`
- `/pages/framer-motion.html?lang=ko`
- `/pages/compare`
- `/pages/compare.html`
- `/pages/prompt-workflow`
- `/pages/prompt-workflow.html`
- `/pages/animation-lab`
- `/pages/animation-example`
- `/pages/component-glossary`

## 소스 구조

- `src/data/styles.ts`: 스타일 카드, 프롬프트 프로필, 팔레트, SEO 메타데이터
- `src/ported/pages/*.tsx`: 32개 기본 스타일과 16개 퓨전 페이지의 React source of truth
- `src/ported/portedStylePages.css`: 페이지별 비주얼 모티프, 팔레트, 타이포그래피, 인터랙션 CSS
- `src/data/stylePages.ts`: 스타일 상세 페이지의 타입 기반 fallback/메타데이터
- `src/data/routes.ts`: 정적 route 생성과 hreflang URL
- `public/previews/*.html`: 포팅 검증용 레거시 시각 레퍼런스이며 빌드 source로 쓰지 않음
- `scripts/generate-static-pages.mjs`: 모든 React route에 Vite entry HTML을 쓰고 기존 `.html` alias도 유지
- `scripts/generate-seo.mjs`: React route data에서 `sitemap.xml`, `robots.txt` 생성

## 라이선스

MIT
