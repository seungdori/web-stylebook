import type { Lang, LocalizedText } from '../../data/styles';
import { localize } from '../../data/styles';
import {
  getPrincipleExampleKind,
  type PrincipleExampleKind,
} from './principleExampleKinds';
import './PrincipleExample.css';

type ExampleState = 'before' | 'after';
type SceneFamily = 'list' | 'form' | 'layout' | 'status' | 'tokens';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  label: t('Applied example', '적용 전후 예시', '適用前後の例'),
  before: t('Before', '적용 전', '適用前'),
  after: t('After', '적용 후', '適用後'),
  caption: t(
    'The same interface before and after applying this principle.',
    '같은 인터페이스에 이 원칙을 적용하기 전과 후를 비교합니다.',
    '同じインターフェースで、この原則の適用前後を比較します。',
  ),
  improvement: t('What changed', '달라진 점', '変わった点'),
};

const familyByKind: Record<PrincipleExampleKind, SceneFamily> = {
  polish: 'layout',
  choices: 'list',
  chunking: 'list',
  complexity: 'form',
  response: 'status',
  targets: 'form',
  progress: 'status',
  convention: 'form',
  regions: 'layout',
  proximity: 'layout',
  similarity: 'list',
  connection: 'layout',
  'inline-help': 'form',
  completion: 'status',
  'input-tolerance': 'form',
  focus: 'list',
  sequence: 'list',
  distinction: 'list',
  memory: 'list',
  unfinished: 'status',
  fidelity: 'layout',
  tokens: 'tokens',
  hierarchy: 'list',
  contrast: 'layout',
  labels: 'form',
  density: 'list',
  responsive: 'layout',
  'type-scale': 'tokens',
  measure: 'layout',
  localization: 'layout',
  'color-roles': 'tokens',
  ramp: 'tokens',
  signals: 'status',
  'multi-input': 'form',
  depth: 'layout',
  imagery: 'layout',
  states: 'status',
  undo: 'form',
  motion: 'status',
};

function SceneToolbar() {
  return (
    <span className="principle-scene__toolbar">
      <i />
      <i />
      <i />
    </span>
  );
}

function ListScene({ kind, state }: { kind: PrincipleExampleKind; state: ExampleState }) {
  return (
    <div className="principle-scene principle-scene--list" data-kind={kind} data-state={state}>
      <SceneToolbar />
      <span className="principle-scene__list">
        {Array.from({ length: 6 }, (_, index) => (
          <i key={index}>
            <b />
            <em />
          </i>
        ))}
      </span>
      <span className="principle-scene__action" />
    </div>
  );
}

function FormScene({ kind, state }: { kind: PrincipleExampleKind; state: ExampleState }) {
  return (
    <div className="principle-scene principle-scene--form" data-kind={kind} data-state={state}>
      <SceneToolbar />
      <span className="principle-scene__form">
        {Array.from({ length: 3 }, (_, index) => (
          <i key={index}>
            <b />
            <em />
          </i>
        ))}
      </span>
      <span className="principle-scene__helper" />
      <span className="principle-scene__form-action" />
      <span className="principle-scene__toast" />
    </div>
  );
}

function LayoutScene({ kind, state }: { kind: PrincipleExampleKind; state: ExampleState }) {
  return (
    <div className="principle-scene principle-scene--layout" data-kind={kind} data-state={state}>
      <SceneToolbar />
      <span className="principle-scene__layout">
        {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
        {Array.from({ length: 3 }, (_, index) => <b key={index} />)}
        <em />
      </span>
    </div>
  );
}

function StatusScene({ kind, state }: { kind: PrincipleExampleKind; state: ExampleState }) {
  return (
    <div className="principle-scene principle-scene--status" data-kind={kind} data-state={state}>
      <SceneToolbar />
      <span className="principle-scene__status-card">
        <i />
        <b />
        <em />
      </span>
      <span className="principle-scene__progress">
        {Array.from({ length: 4 }, (_, index) => <i key={index} />)}
      </span>
      <span className="principle-scene__status-action" />
      <span className="principle-scene__status-toast" />
    </div>
  );
}

function TokenScene({ kind, state }: { kind: PrincipleExampleKind; state: ExampleState }) {
  return (
    <div className="principle-scene principle-scene--tokens" data-kind={kind} data-state={state}>
      <SceneToolbar />
      <span className="principle-scene__swatches">
        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
      </span>
      <span className="principle-scene__type">
        {Array.from({ length: 3 }, (_, index) => <i key={index} />)}
      </span>
      <span className="principle-scene__token-actions">
        <i />
        <i />
      </span>
    </div>
  );
}

function Specimen({ kind, state }: { kind: PrincipleExampleKind; state: ExampleState }) {
  const family = familyByKind[kind];
  if (family === 'form') return <FormScene kind={kind} state={state} />;
  if (family === 'layout') return <LayoutScene kind={kind} state={state} />;
  if (family === 'status') return <StatusScene kind={kind} state={state} />;
  if (family === 'tokens') return <TokenScene kind={kind} state={state} />;
  return <ListScene kind={kind} state={state} />;
}

export function PrincipleExample({
  scope,
  principleId,
  principleName,
  guidance,
  lang,
}: {
  scope: 'ux' | 'design';
  principleId: string;
  principleName: string;
  guidance: LocalizedText;
  lang: Lang;
}) {
  const kind = getPrincipleExampleKind(scope, principleId);
  const titleId = `${principleId}-${scope}-example-title`;
  const captionId = `${principleId}-${scope}-example-caption`;

  return (
    <figure
      className="principle-example"
      data-scope={scope}
      data-example-kind={kind}
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
          <Specimen kind={kind} state="before" />
        </div>
        <div className="principle-example__case principle-example__case--after">
          <span className="principle-example__case-label">
            <i>✓</i>
            {localize(copy.after, lang)}
          </span>
          <Specimen kind={kind} state="after" />
        </div>
      </div>
      <figcaption id={captionId}>
        <span>{localize(copy.caption, lang)}</span>
        <p>
          <b>{localize(copy.improvement, lang)}</b>
          {localize(guidance, lang)}
        </p>
      </figcaption>
    </figure>
  );
}
