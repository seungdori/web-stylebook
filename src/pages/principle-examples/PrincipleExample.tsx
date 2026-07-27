import type { Lang, LocalizedText } from '../../data/styles';
import { localize } from '../../data/styles';
import { designScenes, type SceneEntry } from './designScenes';
import { uxScenes } from './uxScenes';
import './PrincipleExample.css';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  label: t('Applied example', '적용 전후 예시', '適用前後の例'),
  before: t('Before', '적용 전', '適用前'),
  after: t('After', '적용 후', '適用後'),
  improvement: t('What changed', '달라진 점', '変わった点'),
};

export function getPrincipleScene(scope: 'ux' | 'design', principleId: string): SceneEntry | undefined {
  return (scope === 'ux' ? uxScenes : designScenes)[principleId];
}

export function PrincipleExample({
  scope,
  principleId,
  principleName,
  lang,
}: {
  scope: 'ux' | 'design';
  principleId: string;
  principleName: string;
  lang: Lang;
}) {
  const scene = getPrincipleScene(scope, principleId);
  if (!scene) return null;

  const titleId = `${principleId}-${scope}-example-title`;
  const captionId = `${principleId}-${scope}-example-caption`;
  const Render = scene.render;

  return (
    <figure
      className="principle-example"
      data-scope={scope}
      data-principle={principleId}
      aria-labelledby={`${titleId} ${captionId}`}
    >
      <header className="principle-example__header">
        <span>{localize(copy.label, lang)}</span>
        <strong id={titleId}>{principleName}</strong>
      </header>
      <div className="principle-example__comparison" aria-hidden="true">
        <div className="principle-example__case principle-example__case--before">
          <span className="principle-example__case-label">
            <i>×</i>
            {localize(copy.before, lang)}
          </span>
          <Render variant="before" lang={lang} />
        </div>
        <div className="principle-example__case principle-example__case--after">
          <span className="principle-example__case-label">
            <i>✓</i>
            {localize(copy.after, lang)}
          </span>
          <Render variant="after" lang={lang} />
        </div>
      </div>
      <figcaption id={captionId}>
        <b>{localize(copy.improvement, lang)}</b>
        <span>{localize(scene.note, lang)}</span>
      </figcaption>
    </figure>
  );
}
