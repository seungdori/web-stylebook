import type { CSSProperties } from 'react';
import type { Lang } from '../../data/styles';
import { TYPOGRAPHY_ROLES, typographyRoleStyle, type ResolvedVisualContract, type TypographyRoleName } from '../../visual';
import { roleName, typographyRoleNames } from './copy';
import { typographySamples } from './typographySamples';

function primaryFamily(stack: string): string {
  return stack.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') ?? stack;
}

/** Live role ladder. Sample copy follows the preview language; labels follow the UI language. */
export function TypographyRoleLadder({
  spec,
  contentLocale,
  uiLang,
  width,
  activeRole,
}: {
  spec: ResolvedVisualContract;
  contentLocale: Lang;
  uiLang: Lang;
  width: 'narrow' | 'wide';
  activeRole?: TypographyRoleName;
}) {
  const samples = typographySamples[contentLocale];
  return (
    <div className="type-workbench" data-width={width} lang={contentLocale}>
      {TYPOGRAPHY_ROLES.map((name) => {
        const role = spec.typography.roles[name];
        const style = typographyRoleStyle(role, 'container') as CSSProperties;
        return (
          <div className="type-workbench__role" data-type-role={name} data-active={activeRole === name || undefined} key={name}>
            <p className="type-workbench__meta">
              {roleName(typographyRoleNames[name], uiLang)} · {primaryFamily(role.fontFamily)} · {role.fontWeight} · {role.lineHeight} · {role.letterSpacingEm}em
            </p>
            <p className="type-workbench__sample" style={style}>{samples[name]}</p>
          </div>
        );
      })}
    </div>
  );
}
