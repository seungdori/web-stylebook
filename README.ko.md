# Web Stylebook — 바이브코딩을 위한 프론트엔드 디자인 갤러리

**AI가 만든 웹사이트, 전부 비슷하게 생기지 않았나요?**

Web Stylebook은 획일화된 AI 프론트엔드 디자인에서 벗어나기 위해 만든 오픈소스 디자인 레퍼런스입니다. **33가지 스타일 템플릿**, **9가지 퓨전 조합**, 그리고 디자인 방향을 구현 프롬프트로 바꾸는 워크플로우 도구를 제공합니다.

**[라이브 데모](https://webstylebook.com)**

[![English](https://img.shields.io/badge/lang-English-blue)](./README.en.md) [![한국어](https://img.shields.io/badge/lang-한국어-red)](./README.ko.md) [![日本語](https://img.shields.io/badge/lang-日本語-green)](./README.ja.md)

---

## 왜 만들었나

Cursor, Claude, v0, Bolt 같은 바이브코딩 도구 덕분에 프론트엔드 개발이 빨라졌습니다. 하지만 문제가 있습니다: **디자인이 전부 똑같아 보입니다.** 같은 그라디언트, 같은 카드 레이아웃, 같은 안전한 색상 조합.

AI한테 "예쁘게 만들어줘"라고 하면, 매번 비슷한 결과가 나옵니다. 이 프로젝트는 **진짜 다른 디자인**을 보여주고, 직접 골라서 쓸 수 있게 만들었습니다.

## 뭐가 들어있나

### 33개 스타일 템플릿

각 페이지는 타이포그래피, 색상 체계, 레이아웃, 모션까지 완전히 다른 디자인 언어를 보여줍니다.

| 카테고리 | 스타일 |
|---------|--------|
| 다크 & 네온 | Neon Drift, Cyberpunk Glitch, Midnight Noir, Holographic Fluid |
| 미니멀 & 에디토리얼 | Editorial Silence, Swiss Poster, Mono Type, Zen Minimalism, Quiet Utility |
| 오가닉 & 따뜻한 톤 | Earth Atelier, Soft Pastel, Aurora Gradient, Grain Texture, Organic Blob |
| 볼드 & 실험적 | Kinetic Pop, Brutalist Grid, Y2K Retro, Liquid Metal, Duotone Bold |
| 모던 & 클린 | Glass Orbit, Bento Bloom, Mesh Gradient, Neumorphism, Notion Style |
| 테크 & 프로덕트 | Terminal Core, Console Launch, Platform Core, Runtime Signal, Framer Motion |
| 촉감 & 프린트 | Claymorphism, Retro Pixel, Risograph Print, Paper Cut |

### 9개 퓨전 페이지

두 가지 스타일을 섞어서 중간 톤을 만든 하이브리드 디자인:

`Neon × Swiss` · `Bento × Noir` · `Editorial × Terminal` · `Holo × Glass` · `Earth × Zen` · `Kinetic × Brutal` · `Cyber × Console` · `Grain × Mono` · `Clay × Aurora`

### 워크플로우 도구

- **프롬프트 워크플로우** — 스타일을 단계별 구현 프롬프트로 변환
- **스타일 비교** — 여러 디자인 방향을 한 화면에서 비교
- **컬러 시스템** — 팔레트와 대비 구조 확인
- **프롬프트 팁** — 바로 복사해 쓸 수 있는 프롬프팅 패턴

## 사용법

### 온라인

**[라이브 데모](https://webstylebook.com)** 에서 바로 볼 수 있습니다.

### 로컬 실행

```bash
# 방법 A — 바로 열기
open index.html

# 방법 B — 로컬 서버
python3 -m http.server 4173
npx serve . -l 4173
```

## 추천 사용 흐름

1. 허브 페이지에서 전체 스타일을 훑어봅니다
2. 마음에 드는 3~5개를 비교합니다
3. 퓨전 페이지에서 중간 톤을 확인합니다
4. 프롬프트 워크플로우에서 원하는 스타일 프리셋을 선택합니다
5. 생성된 방향을 Cursor, Claude, v0, Bolt 또는 코딩 에이전트에 붙여넣습니다
6. 페이지를 복사해서 내 프로젝트에 맞게 수정합니다

## 이런 분들에게 유용합니다

- **프론트엔드 개발자** — AI 코딩 도구 쓰는데 디자인이 매번 비슷해서 답답한 분
- **디자이너** — 무드보드 전에 방향 후보를 빠르게 뽑고 싶은 분
- **기획자/PM** — 팀에서 톤앤매너 합의할 때 비교자료가 필요한 분
- **바이브코딩 입문자** — AI에게 디자인을 잘 시키고 싶은 분

## 기술 스택

- 순수 HTML/CSS/JS — 빌드 도구 없음, 프레임워크 없음
- 다크/라이트 테마 엔진 내장
- 다국어 지원 (한국어/영어/일본어)
- 완전 정적 파일, Cloudflare Pages 배포
- 공식 도메인: <https://webstylebook.com>

## 라이선스

MIT — 자유롭게 사용, 수정, 배포할 수 있습니다.
