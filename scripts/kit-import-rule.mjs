import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

/**
 * @param {string} registryPath
 * @returns {Array<{ name: string, files: string[], uses: string[] }>}
 */
export function readKitItems(registryPath) {
  const text = fs.readFileSync(registryPath, 'utf8');
  const source = ts.createSourceFile(registryPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  /** @type {Array<{ name: string, files: string[], uses: string[] }>} */
  const items = [];

  /** @param {ts.Node} node */
  function visit(node) {
    if (
      ts.isVariableDeclaration(node)
      && ts.isIdentifier(node.name)
      && node.name.text === 'KIT_ITEMS'
      && node.initializer
      && ts.isArrayLiteralExpression(node.initializer)
    ) {
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const item = { name: '', files: /** @type {string[]} */ ([]), uses: /** @type {string[]} */ ([]) };
        for (const prop of element.properties) {
          if (!ts.isPropertyAssignment(prop) || !prop.name) continue;
          const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : '';
          if (key === 'name' && ts.isStringLiteral(prop.initializer)) item.name = prop.initializer.text;
          if ((key === 'files' || key === 'uses') && ts.isArrayLiteralExpression(prop.initializer)) {
            const values = prop.initializer.elements.flatMap((entry) => (ts.isStringLiteral(entry) ? [entry.text] : []));
            if (key === 'files') item.files = values;
            if (key === 'uses') item.uses = values;
          }
        }
        if (item.name) items.push(item);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  if (!items.length) throw new Error(`KIT_ITEMS was not found in ${registryPath}`);
  return items;
}

const items = readKitItems(path.join(process.cwd(), 'scripts/build-kit-registry.mts'));
const byName = new Map(items.map((item) => [item.name, item]));

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'A kit component imports only React, the theme, its own CSS, and the siblings declared in KIT_ITEMS.',
    },
    schema: [],
    messages: {
      foreign: 'Import "{{source}}" is outside the kit boundary.',
      missing: 'Missing "{{source}}", which the kit registry requires.',
      unknown: '{{name}} is not listed in KIT_ITEMS.',
    },
  },
  create(context) {
    const filename = String(context.filename).split(path.sep).join('/');
    const match = filename.match(/src\/kit\/([^/]+)\/\1\.tsx$/);
    if (!match) return {};
    const name = match[1];
    const item = byName.get(name);
    if (!item) {
      return {
        Program(node) {
          context.report({ node, messageId: 'unknown', data: { name } });
        },
      };
    }
    const ownCss = item.files.some((file) => file.endsWith('.css'));
    const required = [
      ...(ownCss ? ['../theme.css', `./${name}.css`] : []),
      ...item.uses.map((dependency) => `../${dependency}/${dependency}`),
    ];
    const seen = new Set();
    return {
      ImportDeclaration(node) {
        if (typeof node.source.value !== 'string') return;
        const source = node.source.value;
        seen.add(source);
        if (source !== 'react' && !required.includes(source)) {
          context.report({ node, messageId: 'foreign', data: { source } });
        }
      },
      'Program:exit'(node) {
        for (const source of required) {
          if (!seen.has(source)) context.report({ node, messageId: 'missing', data: { source } });
        }
      },
    };
  },
};

export default rule;
