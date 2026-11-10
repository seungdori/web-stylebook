// Style families (04 §8). Color tokens stay empty because each member owns its
// palette. Typography here is only a generic fallback. A quoted family name would
// claim a face the member pages do not share, so these stacks stay unquoted.

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
        displayFamily: 'system-ui, sans-serif',
        bodyFamily: 'system-ui, sans-serif',
        monoFamily: 'ui-monospace, monospace',
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
        displayFamily: 'Georgia, serif',
        bodyFamily: 'Georgia, serif',
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
        displayFamily: 'system-ui, sans-serif',
        bodyFamily: 'system-ui, sans-serif',
        monoFamily: 'ui-monospace, monospace',
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
        displayFamily: 'system-ui, sans-serif',
        bodyFamily: 'system-ui, sans-serif',
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
        displayFamily: 'system-ui, sans-serif',
        bodyFamily: 'system-ui, sans-serif',
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
