# Web Stylebook — バイブコーディングのためのフロントエンドデザインギャラリー

**AIが作るWebサイト、全部同じに見えませんか？**

Web Stylebookは、画一的なAIフロントエンドデザインから脱却するためのオープンソースデザインリファレンスです。**22種類のWebデザインスタイル + 7つのフュージョン組み合わせ**を実際に見て、比較して、プロジェクトに活用できます。

**[ライブデモ](https://webstylebook.com)**

[![English](https://img.shields.io/badge/lang-English-blue)](./README.en.md) [![한국어](https://img.shields.io/badge/lang-한국어-red)](./README.ko.md) [![日本語](https://img.shields.io/badge/lang-日本語-green)](./README.ja.md)

---

## なぜ作ったのか

Cursor、Claude、v0、Boltなどのバイブコーディングツールでフロントエンド開発が高速化しました。しかし問題があります：**デザインが全部同じに見える。** 同じグラデーション、同じカードレイアウト、同じ無難な配色。

このプロジェクトは**本当に異なるデザイン**を提供し、自分で選んで使えるようにしました。

## 収録コンテンツ

### 22のスタイルページ

各ページはタイポグラフィ、カラー、レイアウト、モーションまで完全に異なるデザイン言語を示します。

| カテゴリ | スタイル |
|---------|---------|
| ダーク＆ネオン | Neon Drift, Cyberpunk Glitch, Midnight Noir, Holographic Fluid |
| ミニマル＆エディトリアル | Editorial Silence, Swiss Poster, Mono Type, Zen Minimalism |
| オーガニック＆ウォーム | Earth Atelier, Soft Pastel, Aurora Gradient, Grain Texture |
| ボールド＆実験的 | Kinetic Pop, Brutalist Grid, Y2K Retro, Liquid Metal |
| モダン＆クリーン | Glass Orbit, Bento Bloom, Mesh Gradient, Neumorphism |
| テック＆ターミナル | Terminal Core, Console Launch, Claymorphism |

### 7つのフュージョンページ

2つのスタイルをブレンドしたハイブリッドデザイン：

`Neon × Swiss` · `Bento × Noir` · `Editorial × Terminal` · `Holo × Glass` · `Earth × Zen` · `Kinetic × Brutal` · `Cyber × Console`

### プロンプトワークフロー

デザイン意図 → コンポーネント設計 → 組み立て → QA まで、段階的なプロンプト作成ガイド。

## 使い方

### オンライン

**[ライブデモ](https://webstylebook.com)** ですぐに閲覧できます。

### ローカル実行

```bash
# 方法A — 直接開く
open index.html

# 方法B — ローカルサーバー
python3 -m http.server 4173
npx serve . -l 4173
```

## 推奨フロー

1. ハブページで全スタイルを概観する
2. 気になる3〜5個を比較する
3. フュージョンページで中間トーンを確認する
4. 選んだスタイルをリファレンスにCursor、Claude、v0等でプロンプトする
5. ページをコピーして自分のプロジェクトに合わせて修正する

## こんな方に

- **フロントエンド開発者** — AIツールを使っているがデザインがいつも同じになる方
- **デザイナー** — ムードボード前に方向候補を素早く出したい方
- **PM・企画** — チームでトーン＆マナーを合意する際の比較資料が必要な方
- **バイブコーディング初心者** — AIに良いデザインを指示したい方

## 技術スタック

- 純粋HTML/CSS/JS — ビルドツールなし、フレームワークなし
- ダーク／ライトテーマエンジン内蔵
- 多言語対応（EN/KO/JA）
- 完全静的 — どこでもデプロイ可能

## ライセンス

MIT — 自由に使用・修正・配布できます。
