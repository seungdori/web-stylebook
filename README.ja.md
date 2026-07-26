# Web Stylebook

Web Stylebook は、フロントエンドの視覚方向を探し、それを実装用プロンプトへ変換するための静的サイトです。

## 内容

- `src/ported/pages` を source とする48個のReactレンダリング式スタイル参照
- 32個の基本スタイルと16個のフュージョンスタイル
- スタイルの横並び比較
- プロンプトワークフロー生成
- 適用・注意・根拠・確認項目を備えた検索可能なUX原則実務ガイド
- 配置・適用・確認項目を備えた検索可能な視覚デザイン原則実務ガイド
- カラーシステムとコントラスト検証
- インタラクション調整用の Animation Lab
- route data から canonical、hreflang、`sitemap.xml`、`robots.txt` を生成

## 開発

```bash
npm install
npm run dev
```

## 検証

```bash
npm run typecheck
npm run lint
npm run build
npm run generate:seo
npm run generate:agent-handoff
python3 -m http.server 4173 -d dist
```

ビルド後に確認する主な経路:

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

## ソース構成

- `src/data/styles.ts`: スタイルカード、プロンプトプロファイル、配色、SEOメタデータ
- `src/ported/pages/*.tsx`: 32個の基本スタイルページと16個のフュージョンページのReact source of truth
- `src/ported/portedStylePages.css`: ページ別の視覚モチーフ、配色、タイポグラフィ、インタラクションCSS
- `src/data/stylePages.ts`: スタイル詳細ページの型付きfallback/メタデータ
- `src/data/routes.ts`: 静的 route と hreflang URL
- `src/catalog/principles.ts`: UX原則ページとMCPカタログで共有するソース
- `src/catalog/designPrinciples.ts`: 視覚デザイン原則ページとMCPカタログで共有するソース
- `public/previews/*.html`: 移植検証用のレガシー視覚参照で、ビルド source には使わない
- `scripts/generate-static-pages.mjs`: すべてのReact routeへVite entry HTMLを書き、従来の `.html` alias も維持
- `scripts/generate-seo.mjs`: React route data から `sitemap.xml` と `robots.txt` を生成

## License

[CC BY-NC 4.0](./LICENSE)

UX原則の実務ガイドは独自に執筆し、索引参照元として [Laws of UX](https://lawsofux.com)
（CC BY-NC-ND 4.0）を明記しています。原文、イラスト、ページレイアウトは含みません。
独自執筆した原則カタログは
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp)でも MIT で配布します。

視覚デザイン原則の実務ガイドは、現代のインターフェースに向けたタスク中心の確認体系として
独自に執筆しました。意味構造、レスポンシブ再配置、ローカライズ、トークンとテーマ、
複数の入力方式、状態モデル全体、回復、動きの設定を扱います。このカタログは
`web-stylebook-mcp` でも MIT で配布します。
