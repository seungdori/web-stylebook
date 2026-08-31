import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE_REVISION = '830b3bda4444362099695e2018aa3ff1c387b649';
const SOURCE_REVISION_DATE = '2026-08-11T09:13:36Z';
const SOURCE_ROOT = `https://raw.githubusercontent.com/qiuyiwu1989-star/opendesign/${SOURCE_REVISION}`;
const OUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'catalog',
  'references.generated.json',
);
const META_OUT_PATH = join(dirname(OUT_PATH), 'references.generated.meta.json');
const PUBLIC_OUT_PATH = join(dirname(OUT_PATH), '..', '..', 'public', 'reference-library.v1.json');

type Locale = 'en' | 'ko' | 'ja';
type ReferenceCategory =
  | 'product'
  | 'technology'
  | 'editorial'
  | 'commerce'
  | 'portfolio'
  | 'studio'
  | 'culture'
  | 'experimental';

type LocalizedAnalysis = {
  palette: string;
  layout: string;
  interaction: string;
  motion: string;
  notes: string;
};

type SourceCatalogEntry = {
  slug: string;
  title: string;
  url: string;
  tags: string[];
  summary: string;
  has_pack: boolean;
  spec_completeness: number;
  token_coverage: Record<string, number>;
  spec_md: string;
  spec_json: string;
};

type SourceCatalog = { count: number; designs: SourceCatalogEntry[] };
type SourceSpec = {
  spec?: {
    colors?: Record<string, unknown>;
    typography?: {
      display?: string | null;
      body?: string | null;
      mono?: string | null;
      scale?: Array<Record<string, unknown>>;
    };
    spacing?: { base?: number | null; scale?: number[]; rhythm?: string | null };
    surfaces?: {
      radius?: Record<string, number | null>;
      borders?: string | null;
    };
    layout?: {
      container?: number | null;
      paragraph?: number | null;
      columns?: number | null;
      gutter?: number | null;
      skeleton?: string | null;
    };
    motion?: {
      durations?: Record<string, number | null>;
      easing?: string | null;
    };
  };
  _generatedAt?: string;
};

const excludedObservation = /access denied|server error|security verification|verification page|security check|captcha|blocked|unstyled|error page|error state|holding page|placeholder|default browser|forbidden|not found|404|timeout|gateway|challenge page|enable javascript|just a moment|temporarily unavailable|browser verification|loading spinner|redirect|보안 게이트|보안 검문|검증 페이지|접근 거부|오류 페이지|연결 시간 초과|로딩 스피너|브라우저 검증|리디렉션|セキュリティゲート|検証ページ|アクセス拒否|エラーページ|接続タイムアウト|ローディングスピナー|ブラウザ検証/i;
const analysisKeys = ['palette', 'layout', 'interaction', 'motion', 'notes'] as const;
const sourceHashes: Record<string, string> = {};

async function fetchJson<T>(path: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(`${SOURCE_ROOT}/${path}`, {
        headers: { 'user-agent': 'web-stylebook-reference-importer/1.0' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`OpenDesign fetch failed: ${path} (${response.status})`);
      const body = await response.text();
      sourceHashes[path] = `sha256:${createHash('sha256').update(body).digest('hex')}`;
      return JSON.parse(body) as T;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`OpenDesign fetch failed: ${path}`);
}

function hasCompleteAnalysis(value: unknown): value is LocalizedAnalysis {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return analysisKeys.every((key) => typeof record[key] === 'string' && record[key].trim().length > 0);
}

function categoryOf(tags: string[]): ReferenceCategory {
  const values = new Set(tags.map((tag) => tag.toLowerCase()));
  const has = (...terms: string[]) => terms.some((term) => values.has(term));

  if (has('experimental', '3d', 'webgl', 'motion', 'immersive')) return 'experimental';
  if (has('developer tools', 'ai', 'saas', 'tooling', 'app ui', 'productivity', 'fintech')) return 'technology';
  if (has('e-commerce', 'commerce', 'retail', 'fashion', 'automotive', 'hardware', 'consumer')) return 'commerce';
  if (has('portfolio', 'photographic', 'gallery')) return 'portfolio';
  if (has('agency', 'studio', 'design')) return 'studio';
  if (has('editorial', 'typography', 'curation', 'books', 'magazine', 'news')) return 'editorial';
  if (has('culture', 'museum', 'art', 'music', 'architecture', 'hospitality')) return 'culture';
  return 'product';
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function compactSpec(source: SourceSpec['spec']) {
  const colors = source?.colors ?? {};
  const typography = source?.typography ?? {};
  const displayScale = typography.scale?.find((entry) => entry.token === 'display');
  const bodyScale = typography.scale?.find((entry) => entry.token === 'body');
  const radius = source?.surfaces?.radius ?? {};
  const durations = source?.motion?.durations ?? {};

  return {
    colors: {
      background: stringValue(colors.bg),
      backgroundSoft: stringValue(colors.bgSoft),
      ink: stringValue(colors.ink),
      inkSoft: stringValue(colors.inkSoft),
      muted: stringValue(colors.muted),
      accent: stringValue(colors.accent),
      line: stringValue(colors.line),
      principle: stringValue(colors.principle),
    },
    typography: {
      display: stringValue(typography.display),
      body: stringValue(typography.body),
      mono: stringValue(typography.mono),
      displaySize: finiteNumber(displayScale?.size),
      bodySize: finiteNumber(bodyScale?.size),
    },
    spacing: {
      base: finiteNumber(source?.spacing?.base),
      scale: (source?.spacing?.scale ?? []).filter((value) => Number.isFinite(value)),
      rhythm: stringValue(source?.spacing?.rhythm),
    },
    surfaces: {
      radiusSmall: finiteNumber(radius.sm),
      radiusMedium: finiteNumber(radius.md),
      radiusLarge: finiteNumber(radius.lg),
      border: stringValue(source?.surfaces?.borders),
    },
    layout: {
      container: finiteNumber(source?.layout?.container),
      paragraph: finiteNumber(source?.layout?.paragraph),
      columns: finiteNumber(source?.layout?.columns),
      gutter: finiteNumber(source?.layout?.gutter),
      skeleton: stringValue(source?.layout?.skeleton),
    },
    motion: {
      micro: finiteNumber(durations.micro),
      small: finiteNumber(durations.small),
      medium: finiteNumber(durations.medium),
      easing: stringValue(source?.motion?.easing),
    },
  };
}

async function main() {
  const [catalog, specs, ...localizedSources] = await Promise.all([
    fetchJson<SourceCatalog>('catalog.json'),
    fetchJson<Record<string, SourceSpec>>('sites-specs.json'),
    ...(['en', 'ko', 'ja'] as Locale[]).map((locale) => (
      fetchJson<Record<string, LocalizedAnalysis>>(`sites-i18n.${locale}.json`)
    )),
  ]);
  const localized = Object.fromEntries(
    (['en', 'ko', 'ja'] as Locale[]).map((locale, index) => [locale, localizedSources[index]]),
  ) as Record<Locale, Record<string, LocalizedAnalysis>>;

  const references = catalog.designs
    .filter((entry) => (
      entry.has_pack
      && entry.spec_completeness >= 0.9
      && entry.token_coverage.colors === 1
      && entry.token_coverage.typography >= 0.7
      && /^https:\/\//.test(entry.url)
      && specs[entry.slug]?.spec
      && !excludedObservation.test([
        entry.summary,
        ...(['en', 'ko', 'ja'] as Locale[]).flatMap((locale) => (
          hasCompleteAnalysis(localized[locale][entry.slug])
            ? analysisKeys.map((key) => localized[locale][entry.slug][key])
            : []
        )),
      ].join(' '))
      && (['en', 'ko', 'ja'] as Locale[]).every((locale) => hasCompleteAnalysis(localized[locale][entry.slug]))
    ))
    .map((entry) => ({
      id: entry.slug,
      title: entry.title,
      url: entry.url,
      category: categoryOf(entry.tags),
      tags: [...new Set(entry.tags)].sort((a, b) => a.localeCompare(b, 'en')),
      analysis: Object.fromEntries(
        analysisKeys.map((key) => [
          key,
          Object.fromEntries((['en', 'ko', 'ja'] as Locale[]).map((locale) => [locale, localized[locale][entry.slug][key]])),
        ]),
      ),
      tokens: compactSpec(specs[entry.slug].spec),
      specCompleteness: entry.spec_completeness,
      tokenCoverage: entry.token_coverage,
      observedAt: new Date(specs[entry.slug]._generatedAt ?? SOURCE_REVISION_DATE).toISOString(),
      sourceSpecUrl: entry.spec_json,
      sourceMarkdownUrl: entry.spec_md,
    }))
    .sort((a, b) => b.specCompleteness - a.specCompleteness || a.title.localeCompare(b.title, 'en'));

  if (references.length < 400) {
    throw new Error(`Reference import unexpectedly small: ${references.length}`);
  }

  const payload = {
    schema: 'webstylebook.reference-library.v1',
    generatedAt: SOURCE_REVISION_DATE,
    sourceRevision: SOURCE_REVISION,
    sourceFiles: Object.fromEntries(Object.entries(sourceHashes).sort(([a], [b]) => a.localeCompare(b, 'en'))),
    attribution: {
      sourceName: 'OpenDesign',
      sourceUrl: 'https://opendesign.cc',
      repositoryUrl: 'https://github.com/qiuyiwu1989-star/opendesign',
      sourceLicense: {
        name: 'CC BY 4.0',
        url: 'https://creativecommons.org/licenses/by/4.0/',
      },
      adaptationNotice: {
        en: 'Adapted by Web Stylebook through automated quality gates, not individual manual verification. Only high-completeness full-pack records are retained; fields are compacted and original screenshots and brand assets are excluded. Check the original site before relying on an observation.',
        ko: 'Web Stylebook이 개별 수동 검수가 아닌 자동 품질 게이트로 수정·선별했습니다. 완성도 높은 full-pack 항목만 유지하고 필드를 축약했으며 원본 스크린샷과 브랜드 자산은 포함하지 않습니다. 관찰 내용에 의존하기 전 원본 사이트를 확인하세요.',
        ja: 'Web Stylebookが個別の手動確認ではなく自動品質ゲートで編集・選定しました。完成度の高いfull-pack項目のみを残してフィールドを圧縮し、元サイトのスクリーンショットやブランド資産は含めていません。観察内容を利用する前に元サイトを確認してください。',
      },
      rightsNotice: {
        en: 'Reference observations and extracted tokens are research material. Each original site, brand, copy, typeface, and visual identity remains the property of its respective owner.',
        ko: '관찰 내용과 추출 토큰은 디자인 연구 자료입니다. 원본 사이트·브랜드·카피·서체·시각 정체성의 권리는 각 권리자에게 있습니다.',
        ja: '観察内容と抽出トークンはデザイン研究資料です。元サイト、ブランド、コピー、書体、視覚的アイデンティティの権利は各権利者に帰属します。',
      },
    },
    references,
  };

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  const serialized = `${JSON.stringify(payload)}\n`;
  writeFileSync(OUT_PATH, serialized, 'utf8');
  writeFileSync(PUBLIC_OUT_PATH, serialized, 'utf8');
  writeFileSync(META_OUT_PATH, `${JSON.stringify({
    schema: payload.schema,
    generatedAt: payload.generatedAt,
    sourceRevision: payload.sourceRevision,
    sourceFiles: payload.sourceFiles,
    referenceCount: references.length,
    attribution: payload.attribution,
  })}\n`, 'utf8');
  console.log(`[references] wrote ${references.length} records from OpenDesign ${SOURCE_REVISION.slice(0, 12)}`);
}

await main();
