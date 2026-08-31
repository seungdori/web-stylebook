# Web Stylebook

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md)

**フロントエンドチームとAIコーディングエージェントのための、実践的なデザイン参照と実装引き継ぎツールです。**

Web Stylebookは、視覚方向の探索、UX・インターフェースデザイン原則、共通UI用語、
インタラクティブツール、AI向けフロントエンド実装プロンプトを1つの多言語静的サイトにつなぎます。

[ライブサイト](https://webstylebook.com/ja/) ·
[実在リファレンス](https://webstylebook.com/ja/pages/reference-explorer) ·
[デザインガイド](https://webstylebook.com/ja/pages/ux-principles) ·
[プロンプト生成](https://webstylebook.com/ja/pages/prompt-workflow) ·
[Web Stylebook MCP](https://github.com/seungdori/web-stylebook-mcp)

## カタログ

| 参照 | 数 |
| --- | ---: |
| 基本スタイル | 32 |
| フュージョンスタイル | 16 |
| 実在サイト観察リファレンス | 520 |
| UX原則 | 23 |
| インターフェースデザイン原則 | 25 |
| コンポーネント用語 | 20 |
| モーションパターン | 29 |
| 対応言語 | 3 |

## サイト構成

`デザインガイド`には、読んで適用する知識があります。

- [UX原則](https://webstylebook.com/ja/pages/ux-principles)
- [インターフェースデザイン原則](https://webstylebook.com/ja/pages/design-principles)
- [コンポーネント用語集](https://webstylebook.com/ja/pages/component-glossary)
- [実在デザインリファレンス](https://webstylebook.com/ja/pages/reference-explorer)

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
- `src/catalog/designPrinciples.ts` — インターフェースデザイン原則の正本カタログ。
- `src/catalog/components.ts` — コンポーネント用語の正本。
- `src/catalog/references.generated.json` — 出典を固定した実在Web観察内容と計測トークン。
- `src/pages/animation-lab/catalog.ts` — モーションパターンカタログ。
- `src/data/routes.ts` — 多言語ルート、canonical、hreflang、SEOデータ。
- `scripts/generate-static-pages.mjs` — 静的出力と従来の`.html`互換エイリアス。
- `scripts/generate-agent-handoff.mjs` — 機械可読のAI引き継ぎデータ。
- `scripts/import-design-references.mts` — 品質・権利ゲートと再試行を備えたOpenDesign固定版インポーター。
- `public/previews/*.html` — 忠実度確認用の保管資料であり、本番レンダー元ではない。

英語ルートは接頭辞なし、韓国語と日本語は`/ko/`、`/ja/`を使用します。

## ライセンス

[CC BY-NC 4.0](./LICENSE)

UX原則の実務ガイドは独自に執筆し、
[Laws of UX](https://lawsofux.com)（CC BY-NC-ND 4.0）を索引参照元として明記しています。
原文、イラスト、ページレイアウトは含みません。独自執筆したUX・インターフェースデザインカタログは
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)でもMITで配布します。

実在サイトのリファレンスは、[OpenDesign](https://opendesign.cc)の構造化仕様を
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)に基づいて編集・選定したものです。
正規化した観察内容と計測トークンのみを保持し、元のスクリーンショット、ロゴ、書体、
コピー、ブランド資産は含めません。各元サイトと視覚的アイデンティティの権利は
それぞれの権利者に帰属します。
