import type { DesignDraft } from '../visual/workspace';
import { HOME_PURPOSE_IDS } from './purposeDiscovery';

/** Public gallery state. Project text, preview copy, and overrides are never included. */
export const DISCOVERY_QUERY_KEYS = ['q', 'tag', 'sort', 'dir', 'purpose'] as const;

export type DiscoveryQueryKey = (typeof DISCOVERY_QUERY_KEYS)[number];

export type DiscoveryProblem = 'query' | 'tag' | 'sort' | 'direction' | 'purpose';

export interface DiscoveryQueryResult {
  hasKeys: boolean;
  discovery: Partial<DesignDraft['discovery']>;
  problems: DiscoveryProblem[];
}

const SORTS = new Set(['popular', 'latest', 'name']);
const DIRECTIONS = new Set(['asc', 'desc']);
const PURPOSES = new Set<string>(['all', 'mixed', ...HOME_PURPOSE_IDS]);

const DEFAULTS: Record<DiscoveryQueryKey, string> = {
  q: '',
  tag: 'all',
  sort: 'popular',
  dir: 'desc',
  purpose: 'all',
};

function readParams(search: string) {
  return new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
}

export function parseDiscoveryQuery(search: string, knownTags: readonly string[]): DiscoveryQueryResult {
  const params = readParams(search);
  const hasKeys = DISCOVERY_QUERY_KEYS.some((key) => params.has(key));
  const discovery: Partial<DesignDraft['discovery']> = {};
  const problems: DiscoveryProblem[] = [];

  if (params.has('q')) {
    const query = params.get('q') ?? '';
    if (query.length > 200) problems.push('query');
    else discovery.query = query;
  }

  if (params.has('tag')) {
    const tag = params.get('tag') ?? '';
    if (tag.length === 0 || tag.length > 80) problems.push('tag');
    else if (tag !== 'all' && !knownTags.includes(tag)) {
      discovery.tag = tag;
      problems.push('tag');
    } else discovery.tag = tag;
  }

  if (params.has('sort')) {
    const sort = params.get('sort') ?? '';
    if (!SORTS.has(sort)) problems.push('sort');
    else discovery.sort = sort as DesignDraft['discovery']['sort'];
  }

  if (params.has('dir')) {
    const direction = params.get('dir') ?? '';
    if (!DIRECTIONS.has(direction)) problems.push('direction');
    else discovery.direction = direction as DesignDraft['discovery']['direction'];
  }

  if (params.has('purpose')) {
    const purpose = params.get('purpose') ?? '';
    if (!PURPOSES.has(purpose)) problems.push('purpose');
    else discovery.purpose = purpose as DesignDraft['discovery']['purpose'];
  }

  return { hasKeys, discovery, problems };
}

export function urlWithDiscovery(
  pathname: string,
  search: string,
  hash: string,
  discovery: DesignDraft['discovery'],
): string {
  const params = readParams(search);
  const values: Record<DiscoveryQueryKey, string> = {
    q: discovery.query,
    tag: discovery.tag,
    sort: discovery.sort,
    dir: discovery.direction,
    purpose: discovery.purpose,
  };
  for (const key of DISCOVERY_QUERY_KEYS) {
    const value = values[key];
    if (!value || value === DEFAULTS[key]) params.delete(key);
    else params.set(key, value);
  }
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}${hash}`;
}
