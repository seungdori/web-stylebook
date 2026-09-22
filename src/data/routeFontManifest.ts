// Font families used by the existing authored demos, including their declared fallbacks.
// Keep this manifest in sync with src/ported CSS when a demo's typography changes.
// Google Fonts remains the external source; no font files are bundled.
export const routeFontQueries: Readonly<Record<string, string>> = {
  "Inter": "Inter:wght@300;400;500;600;700;800",
  "Space Grotesk": "Space+Grotesk:wght@500;700",
  "Space Mono": "Space+Mono:wght@400;700",
  "Exo 2": "Exo+2:wght@400;600;700",
  "Outfit": "Outfit:wght@300;600",
  "Share Tech Mono": "Share+Tech+Mono",
  "Syncopate": "Syncopate:wght@400;700",
  "Cormorant Garamond": "Cormorant+Garamond:wght@400;600;700",
  "Nunito": "Nunito:wght@500;700;800",
  "JetBrains Mono": "JetBrains+Mono:wght@500;700;800",
  "Fira Code": "Fira+Code:wght@400;500;700",
  "Playfair Display": "Playfair+Display:wght@600;700",
  "Libre Baskerville": "Libre+Baskerville:wght@400;700",
  "DM Sans": "DM+Sans:wght@400;500;600;700;800",
  "DM Serif Display": "DM+Serif+Display",
  "Sora": "Sora:wght@400;500;600;700;800",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;600;700;800",
  "Instrument Sans": "Instrument+Sans:wght@400;500;600;700;800",
  "IBM Plex Mono": "IBM+Plex+Mono:wght@400;500;600",
  "Noto Serif KR": "Noto+Serif+KR:wght@500;700",
  "Noto Sans KR": "Noto+Sans+KR:wght@300;400;500;700",
  "IBM Plex Sans KR": "IBM+Plex+Sans+KR:wght@400;500;600;700",
  "Archivo Black": "Archivo+Black",
  "Rajdhani": "Rajdhani:wght@500;600;700",
  "Noto Serif JP": "Noto+Serif+JP:wght@500;700",
  "Fraunces": "Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1",
  "Jersey 20": "Jersey+20",
  "Oswald": "Oswald:wght@400;500;600;700"
};

export const originalStyleFonts: Readonly<Record<string, readonly string[]>> = {
  "brutalist-grid": [
    "Archivo Black",
    "IBM Plex Mono"
  ],
  "editorial-silence": [
    "Instrument Sans",
    "Noto Serif JP",
    "Noto Serif KR"
  ],
  "kinetic-pop": [],
  "cyberpunk-glitch": [
    "Share Tech Mono",
    "Syncopate"
  ],
  "swiss-poster": [
    "Space Mono"
  ],
  "quiet-utility": [
    "IBM Plex Sans KR",
    "Inter"
  ],
  "platform-core": [
    "IBM Plex Sans KR",
    "Inter"
  ],
  "runtime-signal": [
    "IBM Plex Mono",
    "IBM Plex Sans KR",
    "Instrument Sans",
    "Inter"
  ],
  "holographic-fluid": [
    "IBM Plex Mono",
    "JetBrains Mono",
    "Noto Sans KR",
    "Outfit"
  ],
  "neon-drift": [
    "IBM Plex Mono",
    "IBM Plex Sans KR",
    "JetBrains Mono",
    "Rajdhani"
  ],
  "glass-orbit": [
    "Exo 2",
    "Noto Sans KR"
  ],
  "terminal-core": [
    "JetBrains Mono"
  ],
  "midnight-noir": [
    "Cormorant Garamond",
    "IBM Plex Mono",
    "IBM Plex Sans KR",
    "Inter",
    "JetBrains Mono",
    "Noto Sans KR",
    "Noto Serif KR"
  ],
  "console-launch": [
    "IBM Plex Sans KR",
    "JetBrains Mono"
  ],
  "bento-bloom": [
    "IBM Plex Mono",
    "Inter",
    "JetBrains Mono",
    "Outfit"
  ],
  "earth-atelier": [
    "Cormorant Garamond",
    "Inter"
  ],
  "liquid-metal": [
    "Noto Sans KR",
    "Sora"
  ],
  "aurora-gradient": [
    "Cormorant Garamond",
    "IBM Plex Mono",
    "JetBrains Mono",
    "Noto Sans KR",
    "Noto Serif KR",
    "Plus Jakarta Sans"
  ],
  "zen-minimalism": [
    "Cormorant Garamond",
    "Noto Sans KR"
  ],
  "mono-type": [
    "Noto Sans KR",
    "Space Mono"
  ],
  "duotone-bold": [
    "Noto Sans KR",
    "Plus Jakarta Sans",
    "Space Grotesk"
  ],
  "mesh-gradient": [
    "Inter",
    "Noto Sans KR"
  ],
  "framer-motion": [
    "Inter",
    "JetBrains Mono",
    "Noto Sans KR",
    "Plus Jakarta Sans"
  ],
  "claymorphism": [
    "Nunito"
  ],
  "neumorphism": [],
  "soft-pastel": [
    "Noto Sans KR",
    "Nunito"
  ],
  "notion-style": [],
  "retro-pixel": [],
  "y2k-retro": [],
  "risograph-print": [
    "Space Grotesk",
    "Space Mono"
  ],
  "paper-cut": [
    "IBM Plex Mono",
    "Inter",
    "JetBrains Mono",
    "Outfit"
  ],
  "macos-liquid-glass": [
    "Noto Sans KR"
  ],
  "fusion-neon-swiss": [
    "Inter",
    "JetBrains Mono"
  ],
  "fusion-product-swiss": [
    "IBM Plex Mono",
    "IBM Plex Sans KR",
    "Instrument Sans",
    "JetBrains Mono",
    "Plus Jakarta Sans"
  ],
  "fusion-bento-noir": [
    "Cormorant Garamond",
    "Inter",
    "JetBrains Mono",
    "Noto Serif KR"
  ],
  "fusion-editorial-terminal": [
    "JetBrains Mono",
    "Noto Serif JP",
    "Noto Serif KR"
  ],
  "fusion-holo-glass": [
    "Inter",
    "JetBrains Mono"
  ],
  "fusion-kinetic-brutal": [
    "Archivo Black",
    "Inter",
    "JetBrains Mono"
  ],
  "fusion-cyber-console": [
    "Inter",
    "JetBrains Mono"
  ],
  "fusion-grain-mono": [
    "JetBrains Mono"
  ],
  "fusion-clay-aurora": [
    "Inter",
    "JetBrains Mono"
  ],
  "fusion-floppy-exe": [
    "IBM Plex Mono",
    "JetBrains Mono",
    "Noto Sans KR"
  ],
  "fusion-noir-metal": [
    "Inter",
    "JetBrains Mono",
    "Noto Sans KR",
    "Share Tech Mono",
    "Space Grotesk"
  ],
  "fusion-strict-console": [
    "Archivo Black",
    "IBM Plex Mono",
    "Inter",
    "JetBrains Mono",
    "Oswald"
  ],
  "fusion-quiet-manifesto": [
    "JetBrains Mono"
  ],
  "fusion-pure-noir": [
    "Inter",
    "JetBrains Mono",
    "Libre Baskerville",
    "Noto Serif KR",
    "Space Grotesk"
  ],
  "fusion-soft-inflate": [
    "IBM Plex Mono",
    "IBM Plex Sans KR",
    "Inter",
    "Plus Jakarta Sans"
  ],
  "fusion-studio-pixel": [
    "DM Sans",
    "IBM Plex Mono",
    "IBM Plex Sans KR",
    "Jersey 20",
    "JetBrains Mono",
    "Noto Sans KR",
    "Sora"
  ]
};
