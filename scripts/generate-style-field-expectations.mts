import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleCatalog } from '../src/data/styles';
import { COLOR_ROLES, getVisualContract, resolveVisualContract } from '../src/visual';
import type { ColorRole, VisualLocale, VisualMode } from '../src/visual';

const output = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/quality-contract/style-fields.json');

function roleFields(role: { fontFamily: string; lineHeight: number; letterSpacingEm: number; textTransform: string; wordBreak: string; paragraphSpacingEm: number }) {
  return {
    fontFamily: role.fontFamily,
    lineHeight: role.lineHeight,
    letterSpacingEm: role.letterSpacingEm,
    paragraphSpacingEm: role.paragraphSpacingEm,
    textTransform: role.textTransform,
    wordBreak: role.wordBreak,
  };
}

const expectations = styleCatalog.map((style) => style.id).sort((left, right) => left.localeCompare(right)).flatMap((styleId) => {
  const authored = getVisualContract(styleId);
  const modes = (['light', 'dark'] as const satisfies readonly VisualMode[]).filter((mode) => authored.modes[mode]);
  return modes.flatMap((mode) => (['en', 'ko', 'ja'] as const satisfies readonly VisualLocale[]).map((contentLocale) => {
    const resolved = resolveVisualContract(styleId, { mode, contentLocale });
    const colors = Object.fromEntries(COLOR_ROLES.map((role) => [role, resolved.colors[role]])) as Record<ColorRole, string>;
    return {
      styleId,
      contentLocale,
      mode: resolved.mode,
      contractRevision: resolved.revision,
      contentHash: resolved.contentHash,
      colors,
      display: roleFields(resolved.typography.roles.display),
      body: roleFields(resolved.typography.roles.body),
      spacing: {
        density: resolved.spacing.density,
        row: resolved.spacing.row,
        gutter: resolved.spacing.gutter,
        stack: resolved.spacing.stack,
        section: resolved.spacing.section,
      },
      shadows: { ...resolved.shadows },
      radii: { ...resolved.radii },
      borders: { ...resolved.borders },
      motion: {
        duration: resolved.motion.duration,
        easing: resolved.motion.easing,
        reducedMotion: resolved.motion.reducedMotion,
        continuous: resolved.motion.continuous,
      },
      origins: {
        'colors.text': resolved.origins['colors.text'],
        'colors.accent': resolved.origins['colors.accent'],
        'typography.roles.display.lineHeight': resolved.origins['typography.roles.display.lineHeight'],
        'typography.roles.display.letterSpacingEm': resolved.origins['typography.roles.display.letterSpacingEm'],
        'typography.roles.body.lineHeight': resolved.origins['typography.roles.body.lineHeight'],
        'typography.roles.body.letterSpacingEm': resolved.origins['typography.roles.body.letterSpacingEm'],
        'shadows.sm': resolved.origins['shadows.sm'],
      },
    };
  }));
});

const document = {
  schema: 'webstylebook.quality-contract-style-fields.v1',
  note: 'Reviewed field literals for every current style, authored mode, and content locale. Tests compare one resolution and its CSS, JSON, and static handoff to these values. The published static file is the default mode. This file is not rewritten by quality:baseline.',
  expectations,
};

if (!process.argv.includes('--write')) {
  console.error('Refusing to write. Pass --write only when the visual change is intentional.');
  process.exit(1);
}

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
console.log(`wrote ${expectations.length} field rows to ${output}`);
