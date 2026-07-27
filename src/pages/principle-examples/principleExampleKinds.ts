export type PrincipleExampleKind =
  | 'polish'
  | 'choices'
  | 'chunking'
  | 'complexity'
  | 'response'
  | 'targets'
  | 'progress'
  | 'convention'
  | 'regions'
  | 'proximity'
  | 'similarity'
  | 'connection'
  | 'inline-help'
  | 'completion'
  | 'input-tolerance'
  | 'focus'
  | 'sequence'
  | 'distinction'
  | 'memory'
  | 'unfinished'
  | 'fidelity'
  | 'tokens'
  | 'hierarchy'
  | 'contrast'
  | 'labels'
  | 'density'
  | 'responsive'
  | 'type-scale'
  | 'measure'
  | 'localization'
  | 'color-roles'
  | 'ramp'
  | 'signals'
  | 'multi-input'
  | 'depth'
  | 'imagery'
  | 'states'
  | 'undo'
  | 'motion';

export const uxPrincipleExampleKinds = {
  'aesthetic-usability-effect': 'polish',
  'choice-overload': 'choices',
  chunking: 'chunking',
  'cognitive-load': 'complexity',
  'doherty-threshold': 'response',
  'fitts-law': 'targets',
  'goal-gradient-effect': 'progress',
  'hicks-law': 'choices',
  'jakobs-law': 'convention',
  'law-of-common-region': 'regions',
  'law-of-proximity': 'proximity',
  'law-of-similarity': 'similarity',
  'law-of-uniform-connectedness': 'connection',
  'mental-model': 'convention',
  'paradox-of-the-active-user': 'inline-help',
  'peak-end-rule': 'completion',
  'postels-law': 'input-tolerance',
  'selective-attention': 'focus',
  'serial-position-effect': 'sequence',
  'teslers-law': 'complexity',
  'von-restorff-effect': 'distinction',
  'working-memory': 'memory',
  'zeigarnik-effect': 'unfinished',
} as const satisfies Record<string, PrincipleExampleKind>;

export const designPrincipleExampleKinds = {
  'core-task-first': 'focus',
  'fidelity-follows-certainty': 'fidelity',
  'bounded-choice-system': 'tokens',
  'attention-budget': 'hierarchy',
  'contrast-before-scale': 'contrast',
  'explicit-labels-and-semantics': 'labels',
  'task-aware-density': 'density',
  'relational-spacing': 'proximity',
  'task-sized-composition': 'responsive',
  'deliberate-type-scale': 'type-scale',
  'measure-and-leading': 'measure',
  'align-for-reading': 'localization',
  'role-based-color': 'color-roles',
  'perceptual-color-ramps': 'ramp',
  'redundant-state-signals': 'signals',
  'multi-input-operability': 'multi-input',
  'depth-explains-structure': 'depth',
  'resilient-imagery': 'imagery',
  'complete-state-model': 'states',
  'recoverable-actions': 'undo',
  'motion-and-preference': 'motion',
} as const satisfies Record<string, PrincipleExampleKind>;

export function getPrincipleExampleKind(
  scope: 'ux' | 'design',
  principleId: string,
): PrincipleExampleKind {
  const examples = scope === 'ux' ? uxPrincipleExampleKinds : designPrincipleExampleKinds;
  return (examples as Record<string, PrincipleExampleKind>)[principleId] ?? 'focus';
}
