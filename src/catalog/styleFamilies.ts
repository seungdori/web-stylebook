// Style families (04 §8). Token defaults home for the token compiler. Color tokens
// are derived at runtime from each style's palette/accent; families carry the
// role-based typography / radius / motion / density defaults. Every style maps to
// exactly one family (styleFamilyOf), assigned onto CatalogStyle.styleFamilyId.

import { t } from './localization';
import type { StyleFamily } from './types';

export const styleFamilies: StyleFamily[] = [
  {
    id: 'signal',
    name: t('Signal / Utility', '시그널 / 유틸리티', 'シグナル / ユーティリティ'),
    memberStyleIds: [
      'runtime-signal', 'platform-core', 'quiet-utility', 'terminal-core', 'console-launch',
      'notion-style', 'swiss-poster', 'midnight-noir', 'liquid-metal', 'brutalist-grid',
      'fusion-strict-console', 'fusion-editorial-terminal', 'fusion-pure-noir',
      'fusion-noir-metal', 'fusion-quiet-manifesto', 'fusion-product-swiss',
    ],
    tokenDefaults: {
      color: {},
      typography: {
        displayFamily: '"Inter", "Söhne", system-ui, sans-serif',
        bodyFamily: 'system-ui, "Inter", sans-serif',
        monoFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
      },
      radius: { sm: '2px', md: '4px', lg: '8px' },
      motion: { duration: '120ms', easing: 'cubic-bezier(0.2, 0, 0, 1)' },
      density: { row: '32px', gutter: '12px' },
    },
  },
  {
    id: 'editorial',
    name: t('Editorial', '에디토리얼', 'エディトリアル'),
    memberStyleIds: [
      'editorial-silence', 'zen-minimalism', 'earth-atelier', 'paper-cut',
      'mono-type', 'fusion-grain-mono',
    ],
    tokenDefaults: {
      color: {},
      typography: {
        displayFamily: '"Fraunces", "GT Sectra", Georgia, serif',
        bodyFamily: '"Source Serif 4", Georgia, serif',
        monoFamily: 'ui-monospace, monospace',
      },
      radius: { sm: '0px', md: '2px', lg: '4px' },
      motion: { duration: '320ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      density: { row: '40px', gutter: '24px' },
    },
  },
  {
    id: 'expressive',
    name: t('Expressive', '익스프레시브', 'エクスプレッシブ'),
    memberStyleIds: [
      'kinetic-pop', 'duotone-bold', 'cyberpunk-glitch', 'neon-drift', 'y2k-retro',
      'retro-pixel', 'risograph-print', 'framer-motion', 'fusion-kinetic-brutal',
      'fusion-cyber-console', 'fusion-floppy-exe', 'fusion-studio-pixel', 'fusion-neon-swiss',
    ],
    tokenDefaults: {
      color: {},
      typography: {
        displayFamily: '"Clash Display", "Space Grotesk", sans-serif',
        bodyFamily: '"Space Grotesk", system-ui, sans-serif',
        monoFamily: '"Space Mono", ui-monospace, monospace',
      },
      radius: { sm: '4px', md: '8px', lg: '16px' },
      motion: { duration: '260ms', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      density: { row: '40px', gutter: '20px' },
    },
  },
  {
    id: 'soft',
    name: t('Soft / Rounded', '소프트 / 라운드', 'ソフト / ラウンド'),
    memberStyleIds: [
      'soft-pastel', 'claymorphism', 'neumorphism', 'bento-bloom',
      'fusion-soft-inflate', 'fusion-clay-aurora', 'fusion-bento-noir',
    ],
    tokenDefaults: {
      color: {},
      typography: {
        displayFamily: '"Quicksand", "Nunito", system-ui, sans-serif',
        bodyFamily: '"Nunito", system-ui, sans-serif',
        monoFamily: 'ui-monospace, monospace',
      },
      radius: { sm: '8px', md: '16px', lg: '28px' },
      motion: { duration: '300ms', easing: 'cubic-bezier(0.34, 1.4, 0.5, 1)' },
      density: { row: '44px', gutter: '20px' },
    },
  },
  {
    id: 'fluid',
    name: t('Fluid / Glass', '플루이드 / 글래스', 'フルイド / グラス'),
    memberStyleIds: [
      'macos-liquid-glass', 'glass-orbit', 'holographic-fluid', 'aurora-gradient',
      'mesh-gradient', 'fusion-holo-glass',
    ],
    tokenDefaults: {
      color: {},
      typography: {
        displayFamily: '"SF Pro Display", "Inter", system-ui, sans-serif',
        bodyFamily: '"SF Pro Text", "Inter", system-ui, sans-serif',
        monoFamily: 'ui-monospace, monospace',
      },
      radius: { sm: '8px', md: '14px', lg: '24px' },
      motion: { duration: '280ms', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      density: { row: '40px', gutter: '18px' },
    },
  },
];

/** styleId -> styleFamilyId. Built from memberStyleIds; the compiler asserts full coverage. */
export const styleFamilyOf: Record<string, string> = Object.fromEntries(
  styleFamilies.flatMap((f) => f.memberStyleIds.map((id) => [id, f.id])),
);
