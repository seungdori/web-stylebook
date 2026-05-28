import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { dictionaries } from '../src/data/i18n.ts';
import { proKitArchetypes } from '../src/data/proKit.ts';
import { proKitSamples } from '../src/data/proKitSamples.ts';
import { proKitSampleTranslations } from '../src/data/proKitSampleTranslations.ts';
import { allRoutes, languages } from '../src/data/routes.ts';
import { styleCatalog } from '../src/data/styles.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function fail(message) {
  errors.push(message);
}

function checkLocalizedText(label, value) {
  if (!value || typeof value !== 'object') {
    fail(`${label}: expected localized object`);
    return;
  }

  for (const lang of languages) {
    if (typeof value[lang] !== 'string' || value[lang].trim() === '') {
      fail(`${label}.${lang}: missing or empty translation`);
    }
  }
}

function checkLocalizedList(label, values) {
  if (!Array.isArray(values)) {
    fail(`${label}: expected localized list`);
    return;
  }
  values.forEach((value, index) => checkLocalizedText(`${label}[${index}]`, value));
}

function checkDictionaryParity() {
  const enKeys = Object.keys(dictionaries.en).sort();
  for (const lang of languages) {
    const keys = Object.keys(dictionaries[lang] ?? {}).sort();
    const missing = enKeys.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !enKeys.includes(key));
    missing.forEach((key) => fail(`dictionaries.${lang}: missing key ${key}`));
    extra.forEach((key) => fail(`dictionaries.${lang}: extra key ${key}`));
    keys.forEach((key) => {
      if (typeof dictionaries[lang][key] !== 'string' || dictionaries[lang][key].trim() === '') {
        fail(`dictionaries.${lang}.${key}: empty value`);
      }
    });
  }
}

function checkStyleCatalog() {
  const registry = fs.readFileSync(path.join(root, 'src/ported/registry.ts'), 'utf8');

  for (const style of styleCatalog) {
    checkLocalizedText(`styleCatalog.${style.id}.name`, style.name);
    checkLocalizedText(`styleCatalog.${style.id}.description`, style.description);
    checkLocalizedText(`styleCatalog.${style.id}.summary`, style.summary);
    checkLocalizedText(`styleCatalog.${style.id}.seo.title`, style.seo.title);
    checkLocalizedText(`styleCatalog.${style.id}.seo.description`, style.seo.description);

    if (!registry.includes(`'${style.id}'`)) {
      fail(`ported registry: missing style page registration for ${style.id}`);
    }
  }
}

function checkRoutes() {
  for (const route of allRoutes) {
    checkLocalizedText(`route.${route.path}.title`, route.title);
    checkLocalizedText(`route.${route.path}.description`, route.description);
  }
}

function checkProKitArchetypes() {
  for (const archetype of proKitArchetypes) {
    checkLocalizedText(`proKitArchetypes.${archetype.id}.label`, archetype.label);
    checkLocalizedText(`proKitArchetypes.${archetype.id}.description`, archetype.description);
    checkLocalizedText(`proKitArchetypes.${archetype.id}.fitReason`, archetype.fitReason);
    checkLocalizedList(`proKitArchetypes.${archetype.id}.pageSet`, archetype.pageSet);
    checkLocalizedList(`proKitArchetypes.${archetype.id}.freeOutput`, archetype.freeOutput);
    checkLocalizedList(`proKitArchetypes.${archetype.id}.proOutput`, archetype.proOutput);
    checkLocalizedList(`proKitArchetypes.${archetype.id}.repairChecks`, archetype.repairChecks);
    checkLocalizedText(`proKitArchetypes.${archetype.id}.tokenHints.typography`, archetype.tokenHints.typography);
    checkLocalizedText(`proKitArchetypes.${archetype.id}.tokenHints.layout`, archetype.tokenHints.layout);
    checkLocalizedText(`proKitArchetypes.${archetype.id}.tokenHints.motion`, archetype.tokenHints.motion);
    checkLocalizedList(`proKitArchetypes.${archetype.id}.styleConstraints`, archetype.styleConstraints);
  }
}

function checkProKitSamples() {
  for (const [id, sample] of Object.entries(proKitSamples)) {
    const translation = proKitSampleTranslations[id];
    if (!translation) {
      fail(`proKitSampleTranslations.${id}: missing translation entry`);
      continue;
    }

    checkLocalizedText(`proKitSampleTranslations.${id}.headline`, translation.headline);
    checkLocalizedText(`proKitSampleTranslations.${id}.pitch`, translation.pitch);
    checkLocalizedText(`proKitSampleTranslations.${id}.license`, translation.license);

    if (translation.includes.length !== sample.includes.length) {
      fail(`proKitSampleTranslations.${id}.includes: expected ${sample.includes.length}, got ${translation.includes.length}`);
    }
    checkLocalizedList(`proKitSampleTranslations.${id}.includes`, translation.includes);

    const samplePaths = sample.files.map((file) => file.path).sort();
    const translatedPaths = Object.keys(translation.fileSummaries).sort();
    samplePaths
      .filter((filePath) => !translatedPaths.includes(filePath))
      .forEach((filePath) => fail(`proKitSampleTranslations.${id}.fileSummaries: missing ${filePath}`));
    translatedPaths
      .filter((filePath) => !samplePaths.includes(filePath))
      .forEach((filePath) => fail(`proKitSampleTranslations.${id}.fileSummaries: extra ${filePath}`));

    for (const filePath of samplePaths) {
      if (translation.fileSummaries[filePath]) {
        checkLocalizedText(`proKitSampleTranslations.${id}.fileSummaries.${filePath}`, translation.fileSummaries[filePath]);
      }
    }
  }
}

function checkFusionPageSourceCoverage() {
  const pagesDir = path.join(root, 'src/ported/pages');
  const fusionFiles = fs
    .readdirSync(pagesDir)
    .filter((file) => /^PortedFusion.*Page\.tsx$/.test(file));

  for (const file of fusionFiles) {
    const source = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    if (!/\bko\s*:/.test(source) || !/\bja\s*:/.test(source)) {
      fail(`${file}: missing obvious ko/ja localized copy blocks`);
    }
    if (/>\s*Share\s*</.test(source)) {
      fail(`${file}: hard-coded visible Share label`);
    }
    if (/Flap text=\{d\.status\}/.test(source)) {
      fail(`${file}: departure status rendered without locale mapping`);
    }
  }
}

checkDictionaryParity();
checkStyleCatalog();
checkRoutes();
checkProKitArchetypes();
checkProKitSamples();
checkFusionPageSourceCoverage();

if (errors.length > 0) {
  console.error(`Localization check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('localization-ok');
