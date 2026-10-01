# 2026-10-01 웹↔MCP 폰트 동기화 검증

웹 체크아웃은 `/Users/seunghyun/showcase` (`main`, `2be7e40ef796720f09fa41433b38c80e0411655d`), MCP는 `/Users/seunghyun/web-stylebook-mcp` (`master`, `6fe95d2`)에서 시작했다. 두 체크아웃의 초기 tracked/untracked 변경은 없었다. 재현과 검증은 별도의 로컬 작업 사본에서 수행하고, 같은 기준 파일인지 확인한 뒤 필요한 변경만 기존 체크아웃에 반영했다. 원격 푸시·PR·npm 게시·배포는 이 작업의 범위가 아니다.

## 재현과 수정

- 기존 MCP는 빌드에 성공했지만 `visual:check`는 최신 웹 `resolve.ts`와의 차이를 검출했다.
- 기존 `visual:sync`는 6개 소스 복사 성공을 보고한 뒤, 빌드가 `TS2307: Cannot find module './fontSources.js'`로 실패했다. 웹 resolver가 heavy CJK fallback 메타데이터를 새로 참조했지만 6파일 allowlist가 이를 누락했다.
- 기존 아티팩트로 최신 웹 계약을 요청하면 `brutalist-grid`의 웹 revision `fnv1a:229761bcdae6bbf6`와 MCP revision `fnv1a:b733ec025ef45f6f` 차이 때문에 요청이 거부됐다.
- `fontSources.ts`를 7번째 MIT source로 동기화하고 해시 provenance에 포함했다. 소스의 static/type/dynamic import, export, require를 파싱하여 7파일 내부 상대 경로와 기존 `zod` 의존성만 허용한다. 누락된 helper·브라우저 loader·Node 모듈·비리터럴 import·MIT 고지 누락은 파일을 덮어쓰기 전에 거부한다. TypeScript parser는 기존 개발 의존성이며 패키지 runtime 의존성을 추가하지 않았다.
- 웹 정본 카탈로그를 재생성했다. 현재 웹 커밋의 카탈로그와 visual artifact는 이미 최신이어서 생성 바이트는 동일했다. MCP의 `catalog.v1.json`, `manifest.v1.json`, `visual-contracts.v1.json`, source provenance를 함께 갱신했다.
- MCP 게시 workflow의 웹 source pin을 `da26ca7`에서 `2be7e40ef796720f09fa41433b38c80e0411655d`로 맞췄다. Workflow 실행이나 게시를 수행했다는 뜻은 아니다.
- 웹 parity 도구의 CSS 비교를 영어에서 EN/KO/JA 전체로 넓혔다. 한·일 heavy display, 일반 본문, 세리프 fallback, 영어 원본, 명시적 override, metadata와 모든 MCP 출력 형식의 회귀 검증을 추가했다.

정본 catalog hash: `sha256:3a2e89fcd0dca9be778ef69333b4089ae64abb0c2410bbe9543f32a506d87cd2`.
Visual library hash: `sha256:de6d48e897b6c43b16407ec9561af0fd9aa04b9ded26d5d7fff5d6abdcca8023`.

## 실제 실행 결과

| 검사 | 결과 |
| --- | --- |
| 웹 `typecheck`, `lint`, `i18n:check` | 통과. 기존 Fast Refresh 경고 4개, 오류 0개 |
| 웹 `test` | 13파일, **127개 통과** |
| 웹 `mcp:catalog`, `mcp:catalog:check`, `mcp:catalog:validate` | 생성·정본 일치·검증 통과 |
| 웹 `build` | 타입·Vite·183개 localized HTML·195개 compatibility alias·SEO·144개 selected handoff 생성 통과 |
| MCP `typecheck`, `build`, `test` | 17파일, **254개 통과** |
| MCP `visual:check`, `catalog:check-canonical` | 7개 MIT source·license·artifact·catalog/manifest 바이트 일치 |
| 웹 `quality:parity` | **48스타일, 55스타일/원본 모드 조합, 330해석 사례, 144정적 전달물** 전체 명세·JSON·EN/KO/JA CSS 일치 |
| 웹 `quality:measure --check` | **19개 자원 예산 통과**. 576개 MCP 형식/언어 호출 측정 |
| npm 패키지 | 압축 **1,065,125 B**, 비압축 **6,247,412 B**, 120개 항목. 폰트 metadata JS/d.ts 포함; font binary·image·website UI·fontLoader·sync tooling 제외 |
| 독립 설치 | `npm install --offline --ignore-scripts --no-audit --no-fund` 성공. 복제된 로컬 npm 캐시 사용 |
| 설치 패키지 CLI·stdio | catalog info/validation, **144개 style/locale 호출**, **12개 heavy-font locale/format 호출**, legacy 호출, stale revision 거부 통과. Client와 CLI server의 fetch/http/https/net/tls/dns 연결을 차단함 |
| 기존 `quality:browser` | **도구 실행 실패**. 첫 `agent-browser 0.38.1` viewport 명령이 45초 timeout; 성공한 검사 0개. 9월의 47개 pass 기록을 이번 실행으로 바꾸지 않음 |
| 대체 Playwright 폰트 검사 | **18개 실제 렌더링 + 2개 외부 폰트 차단 사례 통과**. `brutalist-grid`·`fusion-kinetic-brutal`: EN/KO/JA × 320/1440px; `quiet-utility`·`editorial-silence`: EN/KO/JA × 1440px. reduced motion, computed family/export 일치, font load/error 상태, document overflow, JS 오류 확인 |

브라우저에서 한국어 `Black Han Sans`, 일본어 `Dela Gothic One`이 로드됐고 heavy heading의 CSS weight 400과 일반 본문 fallback을 유지했다. Latin font의 CJK glyph 미지원 상태는 `fallback`으로 남긴다. 차단한 한·일 폰트는 `error`이며 loaded라고 보고하지 않는다. Chrome의 computed `BlinkMacSystemFont` → `system-ui` alias만 비교 시 정규화했다. 이 결과가 모든 Unicode glyph, 텍스트 확대, 모든 화면 상태 또는 모든 원본 스타일의 사람 시각 검수를 증명하지는 않는다. 캡처 일부에는 sticky site shell이 겹치며, 캡처 자체를 자동 시각 승인으로 취급하지 않았다.

Node 24.4.1 / npm 11.4.2 / macOS arm64에서 실행했다. Sandbox 내부의 `tsx` CLI IPC 및 기본 npm cache 쓰기가 차단되어, 동일 script를 `node --import tsx`로 실행하거나 승인된 local build 실행과 작업 폴더의 npm cache를 사용했다. 코드 오류로 분류하지 않는다. CI의 Node 20/22와 게시 workflow는 이 세션에서 실행하지 않았다.

증거는 `/Users/seunghyun/Documents/Codex/2026-10-01/task/`의 `baseline-sync-build.log`, `baseline-parity.log`, `website-tests.log`, `website-build.log`, `mcp-tests.log`, `parity-report.json`, `resource-report.json`, `browser.log`, `browser-font-report.json`, `package-smoke/{pack.json,install.log,smoke-report.json}`에 있다. 캡처는 같은 작업 폴더의 `showcase/output/playwright/font-sync/`에 있다. 대용량 사본·로그·캡처는 npm 패키지나 웹 frontend bundle에 넣지 않는다.

## 열린 이슈 매핑

2026-10-01 GitHub의 열린 본문을 읽고 [9월 검증 기록](visual-fidelity-verification.md), 현재 소스·테스트, 이번 실행 결과를 대조했다. **부분완료**는 구현 근거가 있으나 수락 조건 전체의 완료 근거가 부족하다는 뜻이다. 아래 매핑은 이슈 변경·일괄 종료 요청이 아니다.

| 이슈 | 상태 | 확인된 근거와 남은 경계 |
| --- | --- | --- |
| [웹 #3](https://github.com/seungdori/web-stylebook/issues/3) | 부분완료 | 선택→편집→handoff와 MCP 계약 경로 구현. 자식 전체 수락 조건, cold/warm 브라우저 성능, 반복 AI 결과 비교가 완료되지 않아 epic 완료 근거 없음 |
| [웹 #4](https://github.com/seungdori/web-stylebook/issues/4) | 부분완료 | 48스타일 semantic roles, brutalist text/accent·none/zero·repair·native mode, invalid/backdrop 처리와 parity 통과. 실제 backdrop 대비·원본 전체 시각 검수, editor before/after 성능은 미검증 |
| [웹 #5](https://github.com/seungdori/web-stylebook/issues/5) | 부분완료 | 8역할·편집·export·CJK fallback·가용 weight·source metadata·failed load 구현/테스트. 두 heavy 스타일의 한·일 실제 로드와 차단 검사 통과. 모든 glyph·platform·확대/zoom 및 원본 전체 typography 검수는 미검증 |
| [웹 #6](https://github.com/seungdori/web-stylebook/issues/6) | 부분완료 | selected payload, overrides, deterministic identity, browser/static/MCP·전체 locale CSS parity, offline package, legacy·stale rejection 통과. named tokenizer 실제 측정과 cross-repository parity의 CI 연결/실행 근거는 없음 |
| [웹 #7](https://github.com/seungdori/web-stylebook/issues/7) | 부분완료 | 원본 iframe·same-content·axis-only·copy/swap/apply/undo/reload 구현. 최신 단위 테스트와 9월 `compare-home-evidence.json`의 9언어/폭 조합 근거 있음. 현재 전체 browser workflow 재실행과 axis switch별 실제 resource 재요청 측정은 미검증 |
| [웹 #8](https://github.com/seungdori/web-stylebook/issues/8) | 완료: 로컬 지원 동작 | 현재 workspace 테스트 14개 통과. select/edit/apply/export, 즉시 flush·undo/reset·locale 분리·v0 migration·storage denial·dirty tab conflict를 검증. 9월 `workspace-browser-report.json`의 9개 브라우저 pass 근거도 확인. 이번 47개 browser workflow의 재실행은 도구 장애로 완료하지 못함; release 전체 검증과 구분 |
| [웹 #9](https://github.com/seungdori/web-stylebook/issues/9) | 부분완료 | typography/colors/density 한정 delta, lock conflict, existing stack, screenshot-only limits, accept/reject baseline, failed/not-run evidence 처리와 prompt wording 테스트 통과. refine-existing 실제 UI accept/reject 전체 EN/KO/JA 흐름의 최신 브라우저 증거는 부족함. downstream 결과를 검증했다고 주장하지 않음 |
| [웹 #10](https://github.com/seungdori/web-stylebook/issues/10) | 부분완료 | 실제 hero specimen·purpose shortlist·editorial ordering·draft 연결·empty/back/navigation 구현. 9월 home 9조합·keyboard 근거 확인. 별도 first-use 사용자 과제, no-JS 시각 검사, 초기 실제 transfer/font request 측정은 미실행 |
| [웹 #11](https://github.com/seungdori/web-stylebook/issues/11) | 부분완료 | pinned baseline·deterministic/mutation 검증·브라우저 harness·19예산·AI opt-in protocol 존재. 이번 font matrix와 parity/offline evidence 추가. cold/warm transfer·interaction/long task·allocation·named tokenizer·전체 human review·budget-controlled live 반복 AI 비교는 `not-run`; 기존 browser harness 실행 장애도 보존 |
| [MCP #1](https://github.com/seungdori/web-stylebook-mcp/issues/1) | 부분완료 | pinned artifact/resolver, 모든 format, roles/line-height/tracking/density/zero/none/native/locale, selected access·compatibility, 최신 parity와 offline package 통과. CI의 Node 20/22·배포 순서·실제 consumer 화면 및 광범위 성능/시각 경계는 미검증 |

실제 AI 모델의 반복 생성 비교는 **실행하지 않았다**. 미감·수정 횟수·모델 품질 개선 수치를 만들지 않는다. 9월 기록의 `not-run`·`NOT_VERIFIED` 경계도 보존하며, 어떤 이슈도 닫지 않았다.

기존 두 체크아웃에 반영한 뒤에도 웹 전체 검사·127개 테스트·정본 생성/검증·production build와 MCP 타입·빌드·254개 테스트·7개 공유 소스/아티팩트/카탈로그 일치가 다시 통과했다. 생성 과정의 sitemap 날짜만 변한 내용은 원래 값으로 보존했다. 다른 체크아웃은 수정하지 않았다.
