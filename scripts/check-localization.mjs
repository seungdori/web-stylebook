import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { dictionaries } from '../src/data/i18n.ts';
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
checkFusionPageSourceCoverage();

if (errors.length > 0) {
  console.error(`Localization check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('localization-ok');
