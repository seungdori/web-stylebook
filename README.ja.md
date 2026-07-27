# Web Stylebook

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md)

**フロントエンドチームとAIコーディングエージェントのための、実践的なデザイン参照と実装引き継ぎツールです。**

Web Stylebookは、視覚方向の探索、UX・視覚デザイン原則、共通UI用語、
インタラクティブツール、AI向けフロントエンド実装プロンプトを1つの多言語静的サイトにつなぎます。

[ライブサイト](https://webstylebook.com/ja/) ·
[デザインガイド](https://webstylebook.com/ja/pages/ux-principles) ·
[プロンプト生成](https://webstylebook.com/ja/pages/prompt-workflow) ·
[Web Stylebook MCP](https://github.com/seungdori/web-stylebook-mcp)

## カタログ

| 参照 | 数 |
| --- | ---: |
| 基本スタイル | 32 |
| フュージョンスタイル | 16 |
| UX原則 | 23 |
| 視覚デザイン原則 | 21 |
| コンポーネント用語 | 20 |
| モーションパターン | 29 |
| 対応言語 | 3 |

## サイト構成

`デザインガイド`には、読んで適用する知識があります。

- [UX原則](https://webstylebook.com/ja/pages/ux-principles)
- [視覚デザイン原則](https://webstylebook.com/ja/pages/design-principles)
- [コンポーネント用語集](https://webstylebook.com/ja/pages/component-glossary)

`ツール`には、操作して結果を作るワークスペースがあります。

- [スタイル比較](https://webstylebook.com/ja/pages/compare)
- [カラーシステム](https://webstylebook.com/ja/pages/color-system)
- [Animation Lab](https://webstylebook.com/ja/pages/animation-lab)
- [プロンプトTips](https://webstylebook.com/ja/pages/prompt-tips)

[プロンプト生成](https://webstylebook.com/ja/pages/prompt-workflow)と
[`/agent-handoff.json`](https://webstylebook.com/agent-handoff.json)は、カタログを
コーディングエージェント向けの構造化された実装引き継ぎへ変換します。独立パッケージ
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)は、同じ正本
カタログをMCP経由で提供します。

## 開発

```bash
npm install
npm run dev
```

## 検証

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

## ソース構成

- `src/data/styles.ts` — 32の基本・16のフュージョンスタイル定義。
- `src/ported/pages/*.tsx` — 全スタイルページのReact正本。
- `src/catalog/principles.ts` — UX原則の正本カタログ。
- `src/catalog/designPrinciples.ts` — 視覚デザイン原則の正本カタログ。
- `src/catalog/components.ts` — コンポーネント用語の正本。
- `src/pages/animation-lab/catalog.ts` — モーションパターンカタログ。
- `src/data/routes.ts` — 多言語ルート、canonical、hreflang、SEOデータ。
- `scripts/generate-static-pages.mjs` — 静的出力と従来の`.html`互換エイリアス。
- `scripts/generate-agent-handoff.mjs` — 機械可読のAI引き継ぎデータ。
- `public/previews/*.html` — 忠実度確認用の保管資料であり、本番レンダー元ではない。

英語ルートは接頭辞なし、韓国語と日本語は`/ko/`、`/ja/`を使用します。

## ライセンス

[CC BY-NC 4.0](./LICENSE)

UX原則の実務ガイドは独自に執筆し、
[Laws of UX](https://lawsofux.com)（CC BY-NC-ND 4.0）を索引参照元として明記しています。
原文、イラスト、ページレイアウトは含みません。独自執筆したUX・視覚デザインカタログは
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)でもMITで配布します。
