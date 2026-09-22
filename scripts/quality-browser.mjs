import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

// Pinned CLI; run `npx --yes agent-browser@0.38.1 install --with-deps` in fresh CI.
// Screenshots are evidence for human review, never automatically approved baselines.
const base = process.env.WEB_STYLEBOOK_BROWSER_URL ?? 'http://127.0.0.1:4175';
const out = resolve('output/playwright/webstylebook-fidelity/browser-smoke');
const session = `wsb-quality-${process.pid}`;
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const checks = [];
const captures = [];
let server;
mkdirSync(out, { recursive: true });
function browser(...args) {
  const command = spawnSync(npx, ['--yes', 'agent-browser@0.38.1', '--session', session, '--json', ...args], { encoding: 'utf8', timeout: 45000 });
  if (command.error) throw command.error;
  const lines = command.stdout.trim().split('\n');
  let result;
  try { result = JSON.parse(lines.findLast((line) => line.startsWith('{'))); } catch { throw new Error(command.stderr || command.stdout); }
  if (command.status || !result.success) throw new Error(`${args[0]}: ${result.error ?? command.stderr}`);
  return result.data;
}
function evaluate(code) { return browser('eval', code).result; }
function snapshot(name) { writeFileSync(resolve(out, `${name}.snapshot.json`), JSON.stringify(browser('snapshot', '-i'), null, 2)); }
function capture(name) {
  evaluate('(async()=>{await document.fonts.ready;return document.fonts.status})()');
  const path = resolve(out, `${name}.png`); browser('screenshot', path); captures.push(path);
}
function pass(name, actual) { checks.push({ name, status: 'pass', actual }); console.log(`[browser] ${name}`); }
function fit() {
  const size = evaluate('({viewport:innerWidth,document:document.documentElement.scrollWidth})');
  assert(size.document <= size.viewport + 1, `Horizontal overflow: ${JSON.stringify(size)}`);
  return size;
}
function draft() { return evaluate('JSON.parse(localStorage.getItem("webstylebook.design-draft"))'); }
function open(path, selector) { browser('open', `${base}${path}`); browser('wait', selector); }
function click(selector, waitFor) { browser('scrollintoview', selector); browser('click', selector); if (waitFor) browser('wait', waitFor); }
function clearErrors() { browser('errors', '--clear'); }
function checkErrors() {
  const errors = browser('errors');
  assert(!errors.errors?.length, JSON.stringify(errors));
  const overlay = evaluate('Boolean(document.querySelector("vite-error-overlay, #webpack-dev-server-client-overlay"))');
  assert.equal(overlay, false);
  return errors;
}
try {
  if (!process.env.WEB_STYLEBOOK_BROWSER_URL) {
    server = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4175', '--strictPort'], { stdio: 'ignore' });
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt++) {
      try { const response = await globalThis.fetch(base); if (response.ok) { ready = true; break; } } catch { /* Wait for the owned local preview. */ }
      await delay(250);
    }
    assert(ready, 'The production preview server did not start');
  }
  browser('set', 'viewport', '1440', '1000');
  browser('set', 'media', 'light', 'reduced-motion');
  open('/', '.home-choice');
  snapshot('home-en'); capture('home-en-1440');
  pass('Home renders an active owned specimen', evaluate('document.querySelectorAll(".home-choice .visual-specimen").length'));
  assert.equal(evaluate('document.querySelectorAll(".home-choice .visual-specimen").length'), 1);
  fit(); checkErrors(); clearErrors();

  click('.home-choice__actions a[href*="color-system"]', '#color-text');
  snapshot('color-before');
  assert.equal(evaluate('getComputedStyle(document.querySelector(".color-role-preview")).color'), 'rgb(17, 17, 17)');
  assert.equal(evaluate('document.querySelector("#color-actionPrimary").value.toLowerCase()'), '#d72600');
  pass('Brutalist body ink remains distinct from action red');
  browser('fill', '#color-text', 'not-a-color');
  assert.equal(evaluate('document.querySelector("#color-text").getAttribute("aria-invalid")'), 'true');
  assert.equal(evaluate('document.querySelector(".visual-editor-export button.button--dark").disabled'), true);
  assert.equal(evaluate('getComputedStyle(document.querySelector(".color-role-preview")).color'), 'rgb(17, 17, 17)');
  browser('fill', '#color-text', '#243447');
  click('.workspace-status__tools a[href*="typography"]', '.visual-editor-controls > label select');
  assert.equal(draft().overrides.colors.text, '#243447');
  pass('Invalid color stays isolated; valid edit survives actual navigation');

  snapshot('typography-before');
  browser('select', '.visual-editor-controls > label select', 'body');
  browser('fill', 'input[aria-describedby^="type-lineHeight-help"]', '1.9');
  click('.visual-editor-export .segmented button:nth-child(2)');
  let exported = JSON.parse(evaluate('document.querySelector(".visual-editor-export pre").textContent'));
  assert.equal(exported.colors.text, '#243447');
  assert.equal(exported.typography.roles.body.lineHeight, 1.9);
  const type = evaluate('(()=>{const s=getComputedStyle(document.querySelector(".visual-specimen p[data-type-role=body]"));return {fontSize:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight),color:s.color}})()');
  assert(Math.abs(type.lineHeight / type.fontSize - 1.9) < 0.01);
  assert.equal(type.color, 'rgb(36, 52, 71)');
  capture('typography-edited-1440');
  browser('reload'); browser('wait', '.visual-editor');
  assert.equal(draft().overrides.typography.body.lineHeight, 1.9);
  pass('Rendered type and JSON agree, including edits after reload', type);

  open('/pages/compare?left=brutalist-grid&right=editorial-silence', '.compare-setup');
  snapshot('compare-before');
  click('.compare-setup > .home-choice__switches:first-child button:nth-child(3)');
  click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(3)');
  const beforeAxis = draft();
  const acknowledge = evaluate('Boolean(document.querySelector(".compare-warning input[type=checkbox]"))');
  if (acknowledge) browser('check', '.compare-warning input[type=checkbox]');
  click('.compare-axis-result > button.button--dark');
  click('.workspace-status__tools a[href*="prompt-workflow"]', '.selected-handoff');
  const afterAxis = draft();
  assert.deepEqual(afterAxis.overrides.colors, beforeAxis.overrides.colors);
  assert.deepEqual(afterAxis.overrides.typography, beforeAxis.overrides.typography);
  assert.equal(afterAxis.axisSources.density, 'editorial-silence');
  snapshot('handoff-edited');
  const prompt = evaluate('document.querySelector(".selected-handoff pre").textContent');
  const handoff = JSON.parse(prompt.slice(prompt.indexOf('{')));
  assert.equal(handoff.design.colors.text, '#243447');
  assert.equal(handoff.design.typography.roles.body.lineHeight, 1.9);
  assert.equal(handoff.design.spacing.row, afterAxis.overrides.spacing.row);
  assert(handoff.verification.every((item) => item.outcome === 'not-run'));
  assert(!prompt.includes('webstylebook.visual.v1",\n      "styleId": "quiet-utility'));
  pass('Select → color → type → compare axis → handoff preserves current values');
  evaluate('(()=>{const write=navigator.clipboard.writeText.bind(navigator.clipboard);navigator.clipboard.writeText=async value=>{await write(value);window.__qualityWrittenPrompt=value};return true})()');
  click('.handoff-actions button.button--primary');
  const written = evaluate('window.__qualityWrittenPrompt');
  assert(written.startsWith('Implement the requested product'));
  const copiedHandoff = JSON.parse(written.slice(written.indexOf('{')));
  assert.deepEqual(copiedHandoff.design, handoff.design);
  assert.deepEqual(copiedHandoff.project, handoff.project);
  assert(copiedHandoff.verification.every((item) => item.outcome === 'not-run'));
  pass('Copy writes the same current design and project in a compact implementation prompt');
  checkErrors();

  const beforeLocale = draft();
  open('/ko/pages/prompt-workflow', '.selected-handoff');
  assert.equal(draft().contentLocale, beforeLocale.contentLocale);
  assert.deepEqual(draft().overrides, beforeLocale.overrides);
  pass('UI locale navigation preserves preview locale and edits');

  for (const locale of ['en', 'ko', 'ja']) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    open(`${prefix}/pages/typography`, '.visual-editor-toolbar');
    browser('select', '.visual-editor-toolbar select:has(option[value="ja"])', locale);
    for (const width of [320, 390, 1440]) {
      browser('set', 'viewport', String(width), width === 1440 ? '1000' : '844');
      for (const [path, selector, name] of [['/pages/color-system', '.color-role-preview', 'color'], ['/pages/typography', '.visual-specimen', 'typography'], ['/pages/prompt-workflow', '.selected-handoff', 'handoff']]) {
        open(`${prefix}${path}`, selector);
        const size = fit(); checkErrors();
        capture(`${name}-${locale}-${width}`);
        pass(`${name} ${locale} ${width}px renders without page overflow`, size);
      }
    }
  }
  browser('set', 'media', 'light', 'reduced-motion');
  open('/pages/typography', '.visual-editor-controls');
  browser('focus', '.visual-editor-controls > label select');
  browser('press', 'Tab');
  assert.equal(evaluate('document.activeElement?.tagName'), 'INPUT');
  capture('keyboard-focus');
  pass('Typography keyboard controls remain reachable with reduced motion');
  open('/pages/color-system', '#color-text');
  browser('select', '.visual-editor-toolbar select:has(option[value="ja"])', 'en');
  for (const style of ['brutalist-grid', 'editorial-silence', 'runtime-signal', 'glass-orbit', 'cyberpunk-glitch', 'midnight-noir']) {
    snapshot(`representative-${style}-before`);
    browser('select', '.visual-editor-toolbar > label:first-child select', style);
    const pending = evaluate('Array.from(document.querySelectorAll(".workspace-status__notice button")).some(button=>button.textContent === "Apply linked style")');
    if (pending) browser('find', 'role', 'button', 'click', '--name', 'Apply linked style');
    assert.equal(draft().styleId, style);
    for (const width of [390, 1440]) {
      browser('set', 'viewport', String(width), width === 1440 ? '1000' : '844');
      fit(); checkErrors();
      capture(`representative-${style}-${width}`);
      pass(`Native ${style} ${width}px role preview renders`, evaluate('({mode:document.querySelector(".color-role-preview").style.colorScheme,text:getComputedStyle(document.querySelector(".color-role-preview")).color,fonts:document.fonts.status,contrast:Array.from(document.querySelectorAll("[data-result]")).map(node=>node.dataset.result)})'));
    }
  }
  const report = { schemaVersion: 1, base, browser: 'agent-browser 0.38.1 / Chromium', screenshots: 'Captured for human review; no automatic visual pass implied', checks, captures, aiEvaluation: 'not-run' };
  writeFileSync(resolve(out, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`[browser] PASS ${checks.length} checks; evidence ${out}`);
} catch (error) {
  try { snapshot('failure'); capture('failure'); } catch { /* Retain the original failure. */ }
  writeFileSync(resolve(out, 'failure.json'), JSON.stringify({ checks, error: String(error) }, null, 2));
  throw error;
} finally {
  try { browser('close'); } catch { /* Cleanup must not hide test failure. */ }
  server?.kill('SIGTERM');
}
