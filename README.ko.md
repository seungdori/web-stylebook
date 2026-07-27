# Web Stylebook

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md)

**프론트엔드 팀과 AI 코딩 에이전트를 위한 실무형 디자인 레퍼런스이자 구현 인계 도구입니다.**

Web Stylebook은 시각 방향 탐색, UX·시각 디자인 원칙, 공통 UI 용어, 인터랙티브 도구,
AI용 프론트엔드 구현 프롬프트를 하나의 다국어 정적 사이트로 연결합니다.

[라이브 사이트](https://webstylebook.com/ko/) ·
[디자인 가이드](https://webstylebook.com/ko/pages/ux-principles) ·
[프롬프트 생성기](https://webstylebook.com/ko/pages/prompt-workflow) ·
[Web Stylebook MCP](https://github.com/seungdori/web-stylebook-mcp)

## 카탈로그

| 레퍼런스 | 수 |
| --- | ---: |
| 기본 스타일 | 32 |
| 퓨전 스타일 | 16 |
| UX 원칙 | 23 |
| 시각 디자인 원칙 | 21 |
| 컴포넌트 용어 | 20 |
| 모션 패턴 | 29 |
| 지원 언어 | 3 |

## 사이트 구성

`디자인 가이드`에는 읽고 적용하는 지식이 있습니다.

- [UX 원칙](https://webstylebook.com/ko/pages/ux-principles)
- [시각 디자인 원칙](https://webstylebook.com/ko/pages/design-principles)
- [컴포넌트 용어집](https://webstylebook.com/ko/pages/component-glossary)

`도구`에는 직접 조작해 결과를 만드는 작업 공간이 있습니다.

- [스타일 비교](https://webstylebook.com/ko/pages/compare)
- [색상 시스템](https://webstylebook.com/ko/pages/color-system)
- [애니메이션 랩](https://webstylebook.com/ko/pages/animation-lab)
- [프롬프트 팁](https://webstylebook.com/ko/pages/prompt-tips)

[프롬프트 생성기](https://webstylebook.com/ko/pages/prompt-workflow)와
[`/agent-handoff.json`](https://webstylebook.com/agent-handoff.json)은 카탈로그를 코딩 에이전트가
사용할 수 있는 구조화된 구현 인계로 변환합니다. 독립 패키지
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)는 동일한 정본
카탈로그를 MCP로 제공합니다.

## 개발

```bash
npm install
npm run dev
```

## 검증

```bash
npm run typecheck
npm run lint
npm run i18n:check
npm run test
npm run mcp:catalog
npm run mcp:catalog:check
npm run mcp:catalog:validate
npm run build
```

## 소스 구조

- `src/data/styles.ts` — 32개 기본·16개 퓨전 스타일 정의.
- `src/ported/pages/*.tsx` — 모든 스타일 페이지의 React 정본.
- `src/catalog/principles.ts` — UX 원칙 정본 카탈로그.
- `src/catalog/designPrinciples.ts` — 시각 디자인 원칙 정본 카탈로그.
- `src/catalog/components.ts` — 컴포넌트 용어 정본.
- `src/pages/animation-lab/catalog.ts` — 모션 패턴 카탈로그.
- `src/data/routes.ts` — 다국어 경로, canonical, hreflang, SEO 데이터.
- `scripts/generate-static-pages.mjs` — 정적 출력과 기존 `.html` 호환 별칭.
- `scripts/generate-agent-handoff.mjs` — 기계가 읽을 수 있는 AI 인계 데이터.
- `public/previews/*.html` — 화면 충실도 검토용 보관 자료이며 배포 소스가 아님.

영문 경로에는 접두사가 없고 한국어와 일본어는 `/ko/`, `/ja/`를 사용합니다.

## 라이선스

[CC BY-NC 4.0](./LICENSE)

UX 원칙 실무 가이드는 독자적으로 작성했으며
[Laws of UX](https://lawsofux.com)(CC BY-NC-ND 4.0)를 색인 참고 출처로 표시합니다.
원문의 문구·삽화·페이지 레이아웃은 포함하지 않습니다. 독자 작성한 UX·시각 디자인
카탈로그는 [`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)에서
MIT로도 배포합니다.
