// Deterministic JSON serialization for the committed MCP catalog (ADR-004 amended).
// Guarantees byte-identical output across machines: codepoint-sorted keys,
// NFKC-normalized strings, 2-space pretty, trailing newline, no timestamps,
// no floats introduced here. Hash excludes its own field.

import { createHash } from 'node:crypto';

/** NFKC-normalize a string (applied at serialize time, not just search). */
export function nfkc(s: string): string {
  return s.normalize('NFKC');
}

/**
 * Recursively produce a normalized clone:
 * - object keys sorted by codepoint (ASCII field names; localeCompare is forbidden)
 * - array order PRESERVED (source TS order is already deterministic)
 * - strings NFKC-normalized
 */
export function stableNormalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }
  if (value !== null && typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort(codepointCompare)) {
      const v = stableNormalize(input[key]);
      if (v !== undefined) out[key] = v;
    }
    return out;
  }
  if (typeof value === 'string') {
    return nfkc(value);
  }
  return value;
}

/** Pure codepoint comparison (NOT locale-aware). */
export function codepointCompare(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Stable pretty JSON: 2-space indent + trailing newline. */
export function stableStringify(value: unknown): string {
  return JSON.stringify(stableNormalize(value), null, 2) + '\n';
}

/** Lowercase hex SHA-256 of a UTF-8 string. */
export function sha256Hex(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Content hash over an object, computed on its stable serialization.
 * The caller passes the envelope WITHOUT the contentHash field.
 */
export function contentHashOf(envelopeWithoutHash: unknown): `sha256:${string}` {
  return `sha256:${sha256Hex(stableStringify(envelopeWithoutHash))}`;
}
