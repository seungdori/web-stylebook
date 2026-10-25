import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

// Pinned CLI; run `npx --yes agent-browser@0.38.1 install --with-deps` in fresh CI.
// Screenshots are evidence for human review, never automatically approved baselines.
const base = process.env.WEB_STYLEBOOK_BROWSER_URL ?? 'http://127.0.0.1:4175';
const out = resolve('output/playwright/webstylebook-fidelity/browser-smoke');
const session = `wsb-quality-${process.pid}`;
let activeSession = session;
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const checks = [];
const captures = [];
const DRAFT_KEY = 'webstylebook.design-draft';
const CONFLICT = 'Another tab changed this draft. Choose which version to keep before saving.';
const LOAD_REMOTE = 'Load other tab\u2019s version';
const KEEP_LOCAL = 'Keep this tab\u2019s version';
const MEMORY = {
  en: 'Changes are available in this tab, but could not be saved. Export before leaving.',
  ko: '이 탭에서는 수정할 수 있지만 저장하지 못했습니다. 페이지를 떠나기 전에 내보내세요.',
  ja: 'このタブでは編集できますが、保存できませんでした。移動する前に書き出してください。',
};
const SAVING = ['Saving…', '저장 중…', '保存中…'];
let server;
mkdirSync(out, { recursive: true });
function browser(...args) {
  const command = spawnSync(npx, ['--yes', 'agent-browser@0.38.1', '--session', activeSession, '--json', ...args], { encoding: 'utf8', timeout: 45000 });
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
async function waitDraft(check, label) {
  const deadline = Date.now() + 5000;
  let last = null;
  while (Date.now() <= deadline) {
    const raw = evaluate(`localStorage.getItem(${JSON.stringify(DRAFT_KEY)})`);
    if (typeof raw === 'string') {
      try { last = JSON.parse(raw); } catch { last = null; }
      if (last && check(last)) return last;
    }
    await delay(40);
  }
  throw new Error(`${label}; stored ${JSON.stringify(last)}`);
}
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
function activeTabId() {
  const active = browser('tab').tabs.find((tab) => tab.active);
  assert(active, 'no active tab');
  return active.tabId;
}
function switchTab(tab) { browser('tab', tab); }
function pageSample(withStorage = false) {
  const rawExpr = withStorage ? `localStorage.getItem(${JSON.stringify(DRAFT_KEY)})` : 'null';
  return evaluate(`(() => {
    const node = document.querySelector('.workspace-status__notice');
    const paragraph = !node ? null : (node.matches('p') ? node : node.querySelector('p'));
    return {
      raw: ${rawExpr},
      line: document.querySelector('small.workspace-status__saved')?.textContent ?? null,
      field: document.querySelector('#color-text')?.value ?? '',
      notice: paragraph ? paragraph.textContent : null,
      labels: Array.from(document.querySelectorAll('.workspace-status__notice button')).map((button) => button.textContent),
    };
  })()`);
}
function fieldColor(sample) { return String(sample.field ?? '').toLowerCase(); }
function storedFrom(raw) {
  assert.equal(typeof raw, 'string');
  let parsed;
  try { parsed = JSON.parse(raw); } catch (error) { assert.fail(`draft JSON: ${error}`); }
  const color = parsed?.overrides?.colors?.text;
  return { raw, textColor: typeof color === 'string' ? color.toLowerCase() : '' };
}
function textColor() { return fieldColor(pageSample()); }
function noticeText() { return pageSample().notice; }
function isSaving(line) { return typeof line === 'string' && SAVING.some((phrase) => line.startsWith(phrase)); }
function readStored() { return storedFrom(pageSample(true).raw); }
function buttonLabels(sample = pageSample()) { return sample.labels; }
function assertDraft(expected) {
  if (expected.textColor !== undefined) assert.equal(textColor(), expected.textColor);
  if ('notice' in expected) assert.equal(noticeText(), expected.notice);
  if (typeof expected.raw === 'string') assert.equal(readStored().raw, expected.raw);
}
function reloadAndAssert(expected) {
  browser('reload');
  browser('wait', '#color-text');
  assertDraft(expected);
}
function editField(hex) { browser('fill', '#color-text', hex); }
async function waitUntilStored(hex) {
  const wanted = hex.toLowerCase();
  const deadline = Date.now() + 3000;
  let sawSaving = false;
  let detail = '';
  while (Date.now() <= deadline) {
    const sample = pageSample(true);
    const stored = storedFrom(sample.raw);
    if (isSaving(sample.line)) sawSaving = true;
    detail = `${stored.textColor} ${JSON.stringify(sample.line)}`;
    if (stored.textColor === wanted || (sawSaving && !isSaving(sample.line))) {
      assert.equal(stored.textColor, wanted);
      return stored;
    }
    await delay(50);
  }
  throw new Error(`draft did not store ${wanted}; ${detail}`);
}
async function editUntilStored(tab, hex) {
  switchTab(tab);
  editField(hex);
  return waitUntilStored(hex);
}
async function waitForConflict(saved) {
  const deadline = Date.now() + 3000;
  let detail = '';
  while (Date.now() <= deadline) {
    const sample = pageSample(true);
    const field = fieldColor(sample);
    const labels = buttonLabels(sample);
    detail = `${JSON.stringify(sample.notice)} ${JSON.stringify(labels)}`;
    if (sample.notice === CONFLICT && labels.includes(LOAD_REMOTE) && labels.includes(KEEP_LOCAL)) {
      assert.equal(sample.raw, saved.raw);
      assert.notEqual(field, saved.textColor);
      return;
    }
    await delay(50);
  }
  throw new Error(`conflict missing: ${detail}`);
}
async function waitStaleHeld(savedRaw, staleHex) {
  const deadline = Date.now() + 3000;
  let committedAt = 0;
  let line = null;
  while (Date.now() <= deadline) {
    const sample = pageSample(true);
    line = sample.line;
    assert.equal(sample.raw, savedRaw);
    if (fieldColor(sample) === staleHex && committedAt === 0) committedAt = Date.now();
    if (committedAt && Date.now() - committedAt >= 300 && !isSaving(line)) return;
    await delay(50);
  }
  throw new Error(`stale edit did not settle; saved line ${JSON.stringify(line)}`);
}
async function showStaleConflict(tab, saved, staleHex) {
  const other = activeTabId();
  switchTab(tab);
  await waitForConflict(saved);
  editField(staleHex);
  await waitStaleHeld(saved.raw, staleHex);
  switchTab(other);
  switchTab(tab);
  assert.equal(readStored().raw, saved.raw);
  assert.equal(textColor(), staleHex);
  assert.equal(noticeText(), CONFLICT);
  pass('Stale tab does not replace the saved draft', saved.textColor);
}
async function choose(choice) {
  const name = choice === 'load-remote' ? LOAD_REMOTE : KEEP_LOCAL;
  const localHex = textColor();
  browser('find', 'role', 'button', 'click', '--name', name);
  const deadline = Date.now() + 3000;
  let detail = '';
  while (Date.now() <= deadline) {
    const sample = pageSample(choice === 'load-remote');
    const field = fieldColor(sample);
    const remoteHex = choice === 'load-remote' ? storedFrom(sample.raw).textColor : localHex;
    detail = `${JSON.stringify(sample.notice)} ${field}`;
    if (sample.notice !== CONFLICT && field === remoteHex) return;
    await delay(50);
  }
  throw new Error(`${choice} left ${detail}`);
}
function faultSetItem() {
  evaluate(`(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === ${JSON.stringify(DRAFT_KEY)}) throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      return original.call(this, key, value);
    };
    return true;
  })()`);
}
async function waitQuotaHeld(raw, next) {
  const deadline = Date.now() + 3000;
  let detail = '';
  while (Date.now() <= deadline) {
    const sample = pageSample(true);
    detail = `${JSON.stringify(sample.notice)} ${fieldColor(sample)} ${JSON.stringify(sample.line)}`;
    assert.equal(sample.raw, raw);
    if (sample.notice === MEMORY.en && fieldColor(sample) === next && !isSaving(sample.line)) return;
    await delay(50);
  }
  throw new Error(`quota notice ${detail}`);
}
function installInitScript(block) {
  const path = resolve(out, block === 'getter' ? 'block-getter.js' : 'block-getitem.js');
  const source = block === 'getter'
    ? `Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('Storage is disabled.', 'SecurityError'); } });\n`
    : `Storage.prototype.getItem = function () { throw new DOMException('Storage is disabled.', 'SecurityError'); };\n`;
  writeFileSync(path, source);
  browser('--init-script', path, 'open', `${base}/pages/color-system`);
}
async function waitMemoryOnly(hex, lang) {
  const deadline = Date.now() + 3000;
  let detail = '';
  while (Date.now() <= deadline) {
    const sample = pageSample();
    detail = `${fieldColor(sample)} ${JSON.stringify(sample.notice)} ${JSON.stringify(sample.line)}`;
    if (fieldColor(sample) === hex && sample.notice === MEMORY[lang] && !isSaving(sample.line)) return;
    await delay(50);
  }
  throw new Error(`memory-only ${lang} ${detail}`);
}
async function openBlocked(path, lang, shot, block) {
  browser('set', 'viewport', shot ? '390' : '1440', shot ? '844' : '1000');
  browser('open', `${base}${path}`);
  browser('wait', '#color-text');
  if (shot) { browser('reload'); browser('wait', '#color-text'); }
  assert.equal(noticeText(), MEMORY[lang]);
  const next = textColor() === '#112233' ? '#0a3d62' : '#112233';
  editField(next);
  await waitMemoryOnly(next, lang);
  assert.equal(textColor(), next);
  assert.equal(noticeText(), MEMORY[lang]);
  checkErrors();
  if (shot) {
    browser('scrollintoview', '.workspace-status__notice');
    capture(shot.captureName);
  }
  pass(`Memory-only notice ${lang} ${block}`, MEMORY[lang]);
}
async function proveDraftTabChoice() {
  browser('set', 'viewport', '1440', '1000');
  open('/pages/color-system', '#color-text');
  const tabA = activeTabId();
  const shared = textColor();
  const tabB = 'draft-b';
  browser('tab', 'new', '--label', tabB, `${base}/pages/color-system`);
  browser('wait', '#color-text');
  assert.equal(textColor(), shared);
  const sharedRaw = readStored().raw;
  switchTab(tabA);
  assert.equal(textColor(), shared);
  assert.equal(readStored().raw, sharedRaw);
  pass('Two tabs open the same draft', shared);
  const next = textColor() === '#112233' ? '#0a3d62' : '#112233';
  const saved = await editUntilStored(tabA, next);
  await showStaleConflict(tabB, saved, '#7a1f6d');
  browser('scrollintoview', '.workspace-status__notice');
  capture('draft-conflict-1440');
  await choose('load-remote');
  assertDraft({ textColor: saved.textColor, raw: saved.raw, notice: null });
  reloadAndAssert({ textColor: saved.textColor, raw: saved.raw });
  checkErrors();
  pass("Load other tab's version survives reload", saved.textColor);
  const newer = await editUntilStored(tabA, '#445566');
  await showStaleConflict(tabB, newer, '#778899');
  await choose('keep-local');
  assertDraft({ textColor: '#778899', notice: null });
  const kept = readStored();
  assert.equal(kept.textColor, '#778899');
  assert.equal(JSON.parse(kept.raw).schemaVersion, 1);
  reloadAndAssert({ textColor: '#778899' });
  switchTab(tabA);
  assertDraft({ textColor: newer.textColor, notice: CONFLICT });
  reloadAndAssert({ textColor: '#778899' });
  checkErrors();
  pass("Keep this tab's version survives reload", '#778899');
  switchTab(tabA);
  browser('tab', 'close', tabB);
  assert.equal(browser('tab').tabs.length, 1);
}
async function proveQuotaKeepsCompleteDraft() {
  const before = readStored();
  const next = before.textColor === '#112233' ? '#0a3d62' : '#112233';
  faultSetItem();
  editField(next);
  await waitQuotaHeld(before.raw, next);
  assert.equal(readStored().raw, before.raw);
  assert.equal(noticeText(), MEMORY.en);
  assert.equal(textColor(), next);
  checkErrors();
  pass('Quota failure leaves the last complete draft', before.textColor);
  browser('reload');
  browser('wait', '#color-text');
  assert.equal(readStored().raw, before.raw);
  assert.equal(textColor(), before.textColor);
  checkErrors();
  pass('Reload after quota reads the last complete draft', before.textColor);
}
async function proveRefineExisting() {
  const previous = activeSession;
  activeSession = `${session}-refine`;
  const linePath = 'typography.roles.body.lineHeight';
  try {
    browser('set', 'viewport', '1440', '1000');
    browser('set', 'media', 'light', 'reduced-motion');
    open('/pages/prompt-workflow', '.selected-handoff');
    browser('find', 'role', 'button', 'click', '--name', 'Refine an existing design');
    browser('find', 'role', 'button', 'click', '--name', 'Save current specimen as baseline');
    await delay(400);
    assert.equal(draft().taskMode, 'refine-existing');
    assert.equal(draft().refinement.evidenceKind, 'draft');
    const baselineHeight = draft().refinement.baseline.typography.roles.body.lineHeight;
    click('.handoff-links a[href*="typography"]', '.visual-editor-controls');
    browser('select', '.visual-editor-controls > label select', 'body');
    browser('fill', 'input[aria-describedby^="type-lineHeight-help"]', '1.8');
    click('.workspace-status__tools a[href*="prompt-workflow"]', '.handoff-comparison');
    assert.equal(evaluate('document.querySelectorAll(".handoff-comparison .visual-specimen").length'), 2);
    assert.equal(evaluate(`document.querySelector('[aria-label="Accept ${linePath}"]')?.textContent`), 'Accept');
    evaluate(`document.querySelector('[aria-label="Accept ${linePath}"]').click()`);
    const accepted = evaluate('document.querySelector(".selected-handoff pre").textContent');
    assert(accepted.includes(linePath), accepted);
    assert(accepted.includes('1.8'), accepted);
    evaluate(`document.querySelector('[aria-label="Undo ${linePath}"]').click()`);
    const undone = evaluate('document.querySelector(".selected-handoff pre").textContent');
    assert(!undone.includes(linePath), undone);
    evaluate(`document.querySelector('[aria-label="Reject ${linePath}"]').click()`);
    const matched = evaluate(`(() => {
      const samples = [...document.querySelectorAll('.handoff-comparison .visual-specimen p[data-type-role=body]')];
      return samples.map((node) => {
        const style = getComputedStyle(node);
        return parseFloat(style.lineHeight) / parseFloat(style.fontSize);
      });
    })()`);
    assert.equal(matched.length, 2);
    assert(Math.abs(matched[0] - baselineHeight) < 0.02, JSON.stringify(matched));
    assert(Math.abs(matched[1] - baselineHeight) < 0.02, JSON.stringify(matched));
    evaluate(`document.querySelector('[aria-label="Undo ${linePath}"]').click()`);
    await delay(400);
    browser('reload');
    browser('wait', '.handoff-comparison');
    assert.equal(draft().taskMode, 'refine-existing');
    assert.equal(draft().refinement.baseline.typography.roles.body.lineHeight, baselineHeight);
    assert.equal(draft().overrides.typography.body.lineHeight, 1.8);
    browser('fill', '#refinement-locks', linePath);
    assert.equal(evaluate(`document.querySelector('[aria-label="Accept ${linePath}"]').disabled`), true);
    assert.equal(draft().overrides.typography.body.lineHeight, 1.8);
    assert(evaluate('document.querySelector(".handoff-conflicts")?.textContent')?.includes('locked'), evaluate('document.querySelector(".handoff-conflicts")?.textContent'));
    evaluate(`(() => {
      const node = document.querySelector('#refinement-locks');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(node, '');
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.dispatchEvent(new Event('change', { bubbles: true }));
      return node.value;
    })()`);
    assert.equal(evaluate('document.querySelector(".handoff-conflicts") === null'), true);
    const pngPath = resolve(out, 'evidence.png');
    writeFileSync(pngPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
    browser('upload', '#refinement-screenshot', pngPath);
    await delay(400);
    browser('wait', '.handoff-screenshot img');
    const stored = evaluate('localStorage.getItem("webstylebook.refinement-screenshot")');
    const savedDraft = JSON.stringify(draft());
    assert(stored.includes('data:image/png;base64,'));
    assert(!savedDraft.includes('data:image'));
    assert.equal(draft().refinement.evidenceKind, 'screenshot-only');
    assert.equal(draft().refinement.screenshot.mime, 'image/png');
    const limited = evaluate('document.querySelector(".selected-handoff pre").textContent');
    assert(limited.includes('screenshot-only'), limited);
    assert(limited.includes('Confidence: limited'), limited);
    assert(limited.includes('No computed values are included.'), limited);
    assert(!limited.includes('1.8'), limited);
    assert(!limited.includes('verified: true'), limited);
    browser('reload');
    browser('wait', '.handoff-screenshot img');
    assert.equal(draft().taskMode, 'refine-existing');
    assert.equal(draft().refinement.evidenceKind, 'screenshot-only');
    open('/ko/pages/prompt-workflow', '.handoff-comparison');
    assert.equal(evaluate('document.querySelector(".handoff-comparison h2").textContent'), '기준과 제안');
    assert.equal(evaluate('document.querySelector(".handoff-screenshot img") !== null'), true);
    fit();
    checkErrors();
    capture('refine-existing-1440');
    pass('Refine-existing compares specimens, accepts and undoes one change, blocks a locked part, and keeps a screenshot local');
  } finally {
    try { browser('close'); } catch { /* Cleanup must not hide test failure. */ }
    activeSession = previous;
  }
}
async function proveBlockedStorage(block) {
  const previous = activeSession;
  activeSession = `${session}-${block}`;
  try {
    installInitScript(block);
    const langs = block === 'getter' ? Object.keys(MEMORY) : ['en'];
    for (const lang of langs) {
      const shot = block === 'getter' && lang === 'en' ? { width: 390, captureName: 'draft-memory-only-390' } : undefined;
      await openBlocked(lang === 'en' ? '/pages/color-system' : `/${lang}/pages/color-system`, lang, shot, block);
    }
  } finally {
    try { browser('close'); } catch { /* Cleanup must not hide test failure. */ }
    activeSession = previous;
  }
}
async function proveHomeDiscovery() {
  const resources = () => evaluate('[...performance.getEntriesByType("resource")].map((entry) => entry.name)');
  assert.equal(evaluate('document.querySelectorAll(".home-choice .visual-specimen").length'), 1);
  assert.equal(evaluate('document.querySelectorAll("iframe").length'), 0);
  const initialHeading = evaluate('document.querySelector(".home-choice .visual-specimen h3").textContent');
  const initialHash = evaluate('document.querySelector(".home-choice .visual-specimen").dataset.visualHash');
  assert.equal(evaluate('document.querySelector(".home-choice").dataset.activeStyle'), 'brutalist-grid');
  await delay(700);
  assert.equal(evaluate('document.querySelector(".home-choice .visual-specimen").dataset.visualHash'), initialHash);
  assert.equal(evaluate('document.querySelectorAll(".home-choice .visual-specimen").length'), 1);
  const loaded = resources();
  assert.equal(loaded.some((url) => url.includes('reference-library') || url.includes('agent-handoff.full')), false);
  const fontLinks = evaluate('document.querySelectorAll(\'link[href*="fonts.googleapis.com"]\').length');
  const cards = evaluate('document.querySelectorAll(".style-card").length');
  assert(fontLinks < cards, `font stylesheets ${fontLinks} should stay under catalog cards ${cards}`);
  pass('Home mounts one specimen and skips the reference corpus', { fontLinks, cards, sample: loaded.filter((url) => url.includes('font')).length });

  click('[data-home-style="editorial-silence"]');
  await waitDraft((item) => item.styleId === 'editorial-silence', 'editorial selection');
  assert.equal(evaluate('document.querySelector(".home-choice .visual-specimen h3").textContent'), initialHeading);
  assert.notEqual(evaluate('document.querySelector(".home-choice .visual-specimen").dataset.visualHash'), initialHash);
  assert.equal(evaluate('document.querySelectorAll(".home-choice .visual-specimen").length'), 1);
  click('[data-home-style="quiet-utility"]');
  await waitDraft((item) => item.styleId === 'quiet-utility', 'quiet-utility selection');
  assert.equal(evaluate('document.querySelector(".home-choice .visual-specimen h3").textContent'), initialHeading);
  pass('Hero switch keeps the same content and updates the working draft');

  click('[data-purpose="operational-saas"]');
  browser('wait', '.purpose-discovery__shortlist button');
  const shortlist = evaluate('Array.from(document.querySelectorAll(".purpose-discovery__shortlist button")).map((button) => ({ id: button.dataset.styleId, reason: button.querySelector("span")?.textContent ?? "", source: button.dataset.reasonSource }))');
  assert(shortlist.length >= 1 && shortlist.length <= 3, JSON.stringify(shortlist));
  assert(shortlist.every((item) => item.source === 'bestFor' && item.reason.includes('Fits because')), JSON.stringify(shortlist));
  assert.equal(evaluate('document.querySelectorAll(".style-card").length'), cards);
  assert(evaluate('document.querySelector(".purpose-discovery__cautions").textContent').length > 8);
  capture('home-purpose-1440');
  browser('set', 'viewport', '390', '844');
  fit();
  capture('home-purpose-390');
  browser('set', 'viewport', '1440', '1000');
  click('.purpose-discovery__results > a');
  assert.equal(evaluate('location.hash'), '#styles');
  assert.equal(evaluate('document.querySelectorAll(".style-card").length'), cards);
  pass('Purpose shortlist cites catalog reasons without hiding styles', shortlist);

  click('[data-purpose="commerce"]');
  browser('wait', '[data-purpose="commerce"][aria-pressed="true"]');
  const chosen = evaluate('document.querySelector(".purpose-discovery__shortlist button").dataset.styleId');
  click('.purpose-discovery__shortlist button');
  await waitDraft((item) => item.styleId === chosen, 'purpose selection');
  assert.equal(evaluate('document.querySelector(".home-choice").dataset.activeStyle'), chosen);
  click('.home-choice__actions a[href*="prompt-workflow"]', '.selected-handoff');
  await waitDraft((item) => item.styleId === chosen, 'export keeps selection');
  const prompt = evaluate('document.querySelector(".selected-handoff pre").textContent');
  const handoff = JSON.parse(prompt.slice(prompt.indexOf('{')));
  assert.equal(handoff.identity.styleId, chosen);
  pass('Selecting a purpose candidate reaches export with the same draft', chosen);

  open('/', '.home-choice');
  click('[data-home-style="brutalist-grid"]');
  click('[data-purpose="all"]');
  await waitDraft((item) => item.styleId === 'brutalist-grid' && item.discovery.purpose === 'all', 'restored brutalist browse');

  open('/?purpose=spaceship', '.purpose-discovery');
  assert.equal(evaluate('document.querySelector(".purpose-discovery").dataset.purposeStatus'), 'neutral');
  assert.equal(evaluate('document.querySelectorAll(".purpose-discovery__shortlist button").length'), 0);
  assert(evaluate('document.querySelectorAll(".style-card").length') > 0);
  pass('Unknown purpose stays neutral and keeps the catalog');

  open('/?tag=not-a-tag', '[data-discovery-problem="tag"]');
  assert(evaluate('document.querySelector("[data-discovery-problem=tag]").textContent').includes('not in the catalog'));
  click('.filter-reset');
  browser('wait', '.style-card');
  pass('Unsupported tag explains itself and reset restores the catalog');

  browser('fill', 'input[type=search]', 'zzzz-no-such-style');
  browser('wait', '#styles .empty-state');
  click('.filter-reset');
  browser('wait', '.style-card');
  click('[data-purpose="mixed"]');
  browser('wait', '.purpose-discovery[data-purpose-status="neutral"]');
  click('[data-purpose="all"]');
  pass('Empty search and a mixed purpose stay recoverable');

  for (const [locale, path] of [['en', '/'], ['ko', '/ko/'], ['ja', '/ja/']]) {
    open(path, '.home-choice');
    for (const width of [1440, 390, 320]) {
      browser('set', 'viewport', String(width), width === 1440 ? '1000' : '844');
      const size = fit();
      capture(`home-choice-${locale}-${width}`);
      pass(`Home ${locale} ${width}px has no horizontal overflow`, size);
    }
  }
  browser('set', 'viewport', '1440', '1000');
  open('/', '.home-choice');
  browser('focus', '[data-home-style="editorial-silence"]');
  browser('press', 'Enter');
  await waitDraft((item) => item.styleId === 'editorial-silence', 'keyboard selection');
  click('[data-home-style="brutalist-grid"]');
  await waitDraft((item) => item.styleId === 'brutalist-grid' && item.discovery.purpose === 'all', 'keyboard restore');
  pass('Home specimen switch is keyboard reachable with reduced motion');
}
async function waitFor(read, ready, label, timeout = 25000) {
  const deadline = Date.now() + timeout;
  let last;
  while (Date.now() <= deadline) {
    last = read();
    if (ready(last)) return last;
    await delay(100);
  }
  throw new Error(`${label}: ${JSON.stringify(last)}`);
}
function typographyGateView() {
  return evaluate(`(() => {
    const gate = document.querySelector('[data-typography-gate]');
    const alert = document.querySelector('.compare-axis-result [role="alert"]');
    const status = document.querySelector('.compare-axis-result [role="status"]');
    return {
      state: gate ? gate.dataset.typographyGate : '',
      diff: Boolean(document.querySelector('.compare-field-diff')),
      alert: alert ? alert.textContent : '',
      status: status ? status.textContent : '',
      disabled: Boolean(document.querySelector('.compare-axis-result > button.button--dark')?.disabled),
      fonts: document.fonts.status,
    };
  })()`);
}
async function waitUntilTypographyReady() {
  const view = await waitFor(typographyGateView, (item) => item.state === 'ready' || item.state === 'failed', 'typography gate');
  assert.equal(view.state, 'ready', JSON.stringify(view));
  assert.equal(view.diff, true);
  assert.equal(view.status, '');
  return view;
}
function paneAnchors() {
  return evaluate(`(() => {
    function read(pane) {
      const origin = pane.getBoundingClientRect().top;
      const regions = [...pane.querySelectorAll('[data-fixture-region]')].map((node) => {
        const rect = node.getBoundingClientRect();
        const start = rect.top - origin + pane.scrollTop;
        return { id: node.dataset.fixtureRegion, start, end: start + rect.height };
      }).filter((region) => region.end > region.start);
      const top = pane.scrollTop;
      let index = 0;
      regions.forEach((region, cursor) => { if (region.start <= top + 0.5) index = cursor; });
      const region = regions[index];
      const next = regions[index + 1];
      const span = Math.max((next ? next.start : region.end) - region.start, 1);
      return { id: region?.id || '', progress: region ? Math.min(1, Math.max(0, (top - region.start) / span)) : 0, scrollTop: pane.scrollTop, scrollHeight: pane.scrollHeight, clientHeight: pane.clientHeight, ids: regions.map((item) => item.id) };
    }
    const left = document.querySelector('[data-paired-pane="left"]');
    const right = document.querySelector('[data-paired-pane="right"]');
    return { left: read(left), right: read(right), behavior: getComputedStyle(left).scrollBehavior, reduced: left.dataset.reducedMotion, paired: left.dataset.paired, motion: matchMedia('(prefers-reduced-motion: reduce)').matches };
  })()`);
}
function assertRegionSync(anchors) {
  assert.equal(anchors.left.id, anchors.right.id, JSON.stringify(anchors));
  assert(Math.abs(anchors.left.progress - anchors.right.progress) < 0.08, JSON.stringify(anchors));
}
function fontResourceNames() {
  return evaluate(`(() => {
    const names = performance.getEntriesByType('resource').map((entry) => entry.name);
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href);
    return [...new Set([...names, ...links].filter((name) => /fonts\\.googleapis|fonts\\.gstatic|fontsource|pretendard|\\.woff2?/i.test(name)))].sort();
  })()`);
}
async function provePairedScrollAndFontGate() {
  browser('set', 'viewport', '1440', '900');
  browser('set', 'media', 'light', 'reduced-motion');
  open('/pages/compare?left=neon-drift&right=swiss-poster', '.compare-grid');
  assert.equal(evaluate('document.querySelector("[data-paired-scroll]").disabled'), true);
  assert.equal(evaluate('document.querySelector("[data-paired-scroll]").getAttribute("aria-pressed")'), 'false');
  assert.equal(evaluate('document.querySelector("#compare-pair-note").textContent'), 'Original examples scroll independently.');
  assert.equal(evaluate('document.querySelectorAll("[data-paired-pane]").length'), 0);
  assert.equal(evaluate('document.querySelectorAll(".compare-grid iframe.compare-frame").length'), 2);
  pass('Original examples keep independent scrolling');

  open('/pages/compare?left=brutalist-grid&right=editorial-silence&mode=complete&fixture=editorial', '[data-paired-pane="right"]');
  const initial = paneAnchors();
  assert.deepEqual(initial.left.ids, ['hero', 'section', 'footer']);
  assert.deepEqual(initial.right.ids, ['hero', 'section', 'footer']);
  assert.equal(initial.paired, 'true');
  assert.equal(initial.motion, true);
  assert.equal(initial.reduced, 'true');
  assert.equal(initial.behavior, 'auto');
  assert(initial.left.scrollHeight > initial.left.clientHeight + 8, JSON.stringify(initial.left));
  assert(initial.right.scrollHeight > initial.right.clientHeight + 8, JSON.stringify(initial.right));
  browser('focus', '[data-paired-pane="left"]');
  assert.equal(evaluate('document.activeElement?.dataset.pairedPane'), 'left');
  browser('press', 'Home');
  browser('press', 'PageDown');
  const synced = paneAnchors();
  assert(synced.left.scrollTop > 0, JSON.stringify(synced));
  assertRegionSync(synced);
  const beforeEcho = synced.left.scrollTop;
  evaluate('document.querySelector("[data-paired-pane=\\"right\\"]").dispatchEvent(new Event("scroll"))');
  assert.equal(paneAnchors().left.scrollTop, beforeEcho);
  pass('Paired scrolling follows fixture regions from the keyboard without a feedback loop');

  click('[data-paired-scroll]');
  assert.equal(evaluate('document.querySelector("[data-paired-scroll]").getAttribute("aria-pressed")'), 'false');
  const unpairedBehavior = paneAnchors();
  assert.equal(unpairedBehavior.behavior, 'auto');
  const parked = unpairedBehavior.right.scrollTop;
  browser('focus', '[data-paired-pane="left"]');
  browser('press', 'ArrowDown');
  const unpaired = paneAnchors();
  assert(unpaired.left.scrollTop > synced.left.scrollTop, JSON.stringify(unpaired));
  assert.equal(unpaired.right.scrollTop, parked);
  click('[data-paired-scroll]');
  browser('focus', '[data-paired-pane="left"]');
  browser('press', 'Home');
  browser('press', 'ArrowDown');
  const again = paneAnchors();
  assert.equal(again.paired, 'true');
  assertRegionSync(again);
  assert.equal(again.behavior, 'auto');
  pass('Pair scrolling can be turned off and reduced motion stays instant');

  open('/pages/compare?left=brutalist-grid&right=editorial-silence&mode=axis&axis=typography&fixture=editorial', '[data-typography-gate]');
  await waitUntilTypographyReady();
  const beforeFonts = fontResourceNames();
  click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(1)');
  browser('wait', '.compare-axis-result');
  await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'font set after color axis');
  const afterColor = fontResourceNames().filter((name) => !beforeFonts.includes(name));
  assert.deepEqual(afterColor, []);
  click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(3)');
  await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'font set after density axis');
  const afterDensity = fontResourceNames().filter((name) => !beforeFonts.includes(name));
  assert.deepEqual(afterDensity, []);
  assert.equal(evaluate('document.querySelector("[data-typography-gate]") === null'), true);
  pass('Switching color or density does not request new fonts');

  click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(2)');
  browser('wait', '[data-typography-gate]');
  evaluate(`(() => {
    const fonts = document.fonts;
    const original = fonts.load.bind(fonts);
    let release = () => {};
    const held = new Promise((resolve) => { release = resolve; });
    window.__releaseFonts = () => { fonts.load = original; release(); };
    fonts.load = (descriptor, sample) => held.then(() => original(descriptor, sample));
    return true;
  })()`);
  browser('select', '.compare-content-controls label:nth-child(2) select', 'ko');
  const pending = await waitFor(typographyGateView, (view) => view.state === 'pending', 'pending font gate');
  assert.equal(pending.diff, false);
  assert.equal(pending.disabled, true);
  assert.match(pending.status, /not a typography result yet/);
  evaluate('window.__releaseFonts()');
  browser('select', '.compare-content-controls label:nth-child(2) select', 'en');
  await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'font set after releasing the held load');

  evaluate(`(() => {
    const fonts = document.fonts;
    const original = fonts.load.bind(fonts);
    window.__restoreFontLoad = () => { fonts.load = original; };
    fonts.load = () => Promise.reject(new Error('blocked'));
    return true;
  })()`);
  browser('select', '.compare-content-controls label:nth-child(2) select', 'ja');
  const failed = await waitFor(typographyGateView, (view) => view.state === 'failed', 'failed font gate');
  assert.equal(failed.diff, false);
  assert.equal(failed.disabled, true);
  assert.match(failed.alert, /not a typography result/);
  assert.doesNotMatch(failed.alert, /ready|pass/i);
  evaluate('window.__restoreFontLoad()');
  browser('select', '.compare-content-controls label:nth-child(2) select', 'en');
  await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'font set after a failed load');
  pass('A typography comparison stays pending or failed until both panes finish loading fonts');
}
const FONT_RESOURCE = /fonts\.googleapis\.com|fonts\.gstatic\.com|fontsource|cdn\.jsdelivr\.net\/[^?\s]*font|\.woff2?(?:$|\?)/i;
const REMOTE_GUARD = /openai\.com|anthropic\.com|generativelanguage\.googleapis|reference-library|reference-corpus|agent-handoff\.full\.json|\/catalog\.json|\/v1\/chat\/completions|\/v1\/messages/i;
const SENTINEL_FONT = /Jersey\+20|Jersey%2020|Fraunces|DM\+Serif\+Display|DM%20Serif|Libre\+Baskerville|Libre%20Baskerville/i;
function resourceSnapshot() {
  return evaluate(`(() => {
    const names = performance.getEntriesByType('resource').map((entry) => entry.name);
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.href);
    const fetches = Array.isArray(window.__guardUrls) ? window.__guardUrls.slice() : [];
    return {
      names,
      links,
      fetches,
      homeSpecimens: document.querySelectorAll('.home-choice .visual-specimen').length,
      iframes: document.querySelectorAll('iframe').length,
    };
  })()`);
}
function installResourceGuard() {
  evaluate(`(() => {
    performance.clearResourceTimings();
    window.__guardUrls = [];
    if (window.__guardFetch) return true;
    const orig = window.fetch.bind(window);
    window.__guardFetch = orig;
    window.fetch = (...args) => {
      const input = args[0];
      const url = typeof input === 'string' ? input : (input && input.url) || String(input);
      window.__guardUrls.push(url);
      return orig(...args);
    };
    return true;
  })()`);
}
function fontFamilies(urls) {
  return [...new Set(urls.flatMap((url) => [...String(url).matchAll(/family=([^&]+)/g)].map((match) => decodeURIComponent(match[1]).split(':')[0].replaceAll('+', ' '))))];
}
// Site chrome routes with Korean headings. Style previews keep their authored wrapping and leading.
const KOREAN_CHROME_ROUTES = ['/', '/pages/reference-explorer', '/pages/compare', '/pages/prompt-workflow', '/pages/color-system', '/pages/typography', '/pages/prompt-tips', '/pages/animation-lab', '/pages/animation-example', '/pages/component-glossary', '/pages/ux-principles', '/pages/design-principles', '/pages/pro-kit'];
// Same preview list as the heading text-wrap rule in src/styles.css.
const PREVIEW_SCOPES = '.ported-style-page, .style-experience, .visual-specimen, .color-role-preview, .visual-editor-preview, .type-workbench, .handoff-specimen, .glossary-preview, .component-glossary-demo, .animation-preview, .principle-example';
function koreanWrapReport() {
  return evaluate(`(async () => {
    await document.fonts.ready;
    const word = /[\\p{L}\\p{N}]/u;
    const hangul = /\\p{Script=Hangul}/u;
    const visible = (el) => el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true });
    const blockOf = (node) => { let el = node.parentElement; while (el && /^(inline|contents)$/.test(getComputedStyle(el).display)) el = el.parentElement; return el; };
    const issues = [];
    let headings = 0;
    for (const el of document.querySelectorAll('h1, h2, h3, p, li, dd')) {
      const heading = /^H[1-3]$/.test(el.tagName);
      if (el.closest(${JSON.stringify(PREVIEW_SCOPES)}) || !visible(el) || (!heading && el.parentElement?.closest('p, li, dd'))) continue;
      const box = el.getBoundingClientRect();
      // Screen-reader-only headings are clipped to a pixel and wrap every glyph.
      if (box.width <= 2 || box.height <= 2) continue;
      const text = el.textContent.replace(/\\s+/g, ' ').trim();
      if (!hangul.test(text)) continue;
      const style = getComputedStyle(el);
      const leading = parseFloat(style.lineHeight) / parseFloat(style.fontSize);
      if (heading) headings += 1;
      if (!(leading >= (heading ? 1.15 : 1.6) - 0.005)) issues.push({ kind: heading ? 'heading-leading' : 'body-leading', tag: el.tagName, leading: Number(leading.toFixed(3)), text: text.slice(0, 40) });
      if (!heading) continue;
      const chars = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (node.nodeType === 1) { if (node.tagName === 'BR') chars.push({ ch: ' ' }); continue; }
        if (!node.parentElement || !visible(node.parentElement)) continue;
        const block = blockOf(node);
        let index = 0;
        for (const ch of node.nodeValue) {
          const range = document.createRange();
          range.setStart(node, index);
          range.setEnd(node, index + ch.length);
          const rect = [...range.getClientRects()].find((item) => item.height > 0);
          chars.push({ ch, top: rect?.top, bottom: rect?.bottom, block });
          index += ch.length;
        }
      }
      // A new line that starts between two letters of one word is a mid-word break.
      for (let k = 1; k < chars.length; k += 1) {
        const a = chars[k - 1];
        const b = chars[k];
        if (a.top === undefined || b.top === undefined || a.block !== b.block) continue;
        if (b.top >= a.bottom - 1 && word.test(a.ch) && word.test(b.ch)) {
          const line = chars.map((item) => item.ch).join('');
          issues.push({ kind: 'mid-word', tag: el.tagName, at: line.slice(Math.max(0, k - 8), k) + ' / ' + line.slice(k, k + 8) });
        }
      }
    }
    const body = getComputedStyle(document.body);
    return { lang: document.documentElement.lang, headings, bodyLeading: parseFloat(body.lineHeight) / parseFloat(body.fontSize), wordBreak: body.wordBreak, issues };
  })()`);
}
function proveKoreanChromeWrapping() {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    browser('set', 'viewport', String(width), String(height));
    let headings = 0;
    for (const path of KOREAN_CHROME_ROUTES) {
      open(`/ko${path}`, 'h1');
      const report = koreanWrapReport();
      assert.equal(report.lang, 'ko', path);
      assert.equal(report.wordBreak, 'keep-all', path);
      assert(report.bodyLeading >= 1.695, `${path} body leading ${report.bodyLeading}`);
      assert.deepEqual(report.issues, [], `${path} at ${width}px: ${JSON.stringify(report.issues)}`);
      headings += report.headings;
      if (path === '/') {
        const size = evaluate('parseFloat(getComputedStyle(document.querySelector(".home-choice__intro h1")).fontSize)');
        if (width === 1440) assert(size >= 56 && size <= 72, `home h1 ${size}px at 1440`);
        else assert(size >= 32, `home h1 ${size}px at ${width}`);
        capture(`korean-chrome-home-${width}`);
      }
      fit();
    }
    pass(`Korean chrome headings wrap between words with open leading at ${width}px`, { routes: KOREAN_CHROME_ROUTES.length, headings });
  }
}
async function proveResourceGuard() {
  const previous = activeSession;
  activeSession = `${session}-resource`;
  try {
    browser('set', 'viewport', '1440', '900');
    browser('set', 'media', 'light', 'reduced-motion');
    open('/', '.home-choice');
    await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'home fonts idle');
    const home = resourceSnapshot();
    assert.equal(home.homeSpecimens, 1);
    assert.equal(home.iframes, 0);
    const homeUrls = [...home.names, ...home.links, ...home.fetches];
    const homeFonts = homeUrls.filter((url) => FONT_RESOURCE.test(url));
    const homeRemote = homeUrls.filter((url) => REMOTE_GUARD.test(url));
    assert.deepEqual(homeRemote, [], JSON.stringify(homeRemote));
    assert.equal(homeFonts.some((url) => SENTINEL_FONT.test(url)), false, JSON.stringify(homeFonts));
    const homeFamilies = fontFamilies(homeFonts);
    assert(homeFamilies.length < 24, `home preloaded ${homeFamilies.length} families: ${homeFamilies.join(', ')}`);
    pass('Home first view loads one specimen without every catalog font or a model call', { firstUseFontResources: homeFonts.length, families: homeFamilies });

    open('/pages/color-system', '#color-text');
    await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'color fonts idle');
    const firstColor = resourceSnapshot();
    const firstUseFonts = [...firstColor.names, ...firstColor.links].filter((url) => FONT_RESOURCE.test(url));
    assert.deepEqual([...firstColor.names, ...firstColor.links, ...firstColor.fetches].filter((url) => REMOTE_GUARD.test(url)), []);
    installResourceGuard();
    browser('fill', '#color-text', '#243447');
    click('.visual-editor-export .segmented button:nth-child(2)');
    await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'fonts idle after color export');
    const warmEdit = resourceSnapshot();
    const warmEditHits = [...warmEdit.names, ...warmEdit.fetches].filter((url) => FONT_RESOURCE.test(url) || REMOTE_GUARD.test(url));
    const newFontLinks = warmEdit.links.filter((url) => FONT_RESOURCE.test(url) && !firstColor.links.includes(url));
    assert.deepEqual(warmEditHits, [], JSON.stringify(warmEditHits));
    assert.deepEqual(newFontLinks, [], JSON.stringify(newFontLinks));
    assert.equal(evaluate('document.querySelector(".visual-editor-export pre").textContent').includes('#243447'), true);
    pass('Warm color edit and JSON export do not repeat font, catalog, or model requests', { firstUseFontResources: firstUseFonts.length, warmFontResources: warmEditHits.length });

    open('/pages/compare?left=brutalist-grid&right=editorial-silence&mode=axis&axis=color&fixture=editorial', '.compare-axis-result');
    await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'compare fonts idle');
    const firstAxis = resourceSnapshot();
    const firstAxisFonts = [...firstAxis.names, ...firstAxis.links].filter((url) => FONT_RESOURCE.test(url));
    installResourceGuard();
    click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(3)');
    await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'fonts idle after density axis');
    click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(1)');
    await waitFor(() => evaluate('document.fonts.status'), (status) => status !== 'loading', 'fonts idle after color axis');
    const warmAxis = resourceSnapshot();
    const warmAxisHits = [...warmAxis.names, ...warmAxis.fetches].filter((url) => FONT_RESOURCE.test(url) || REMOTE_GUARD.test(url));
    const axisLinks = warmAxis.links.filter((url) => FONT_RESOURCE.test(url) && !firstAxis.links.includes(url));
    assert.deepEqual(warmAxisHits, [], JSON.stringify(warmAxisHits));
    assert.deepEqual(axisLinks, [], JSON.stringify(axisLinks));
    pass('Warm color and density axis switches do not repeat font or catalog fetches', { firstUseFontResources: firstAxisFonts.length, warmFontResources: warmAxisHits.length });
  } finally {
    try { browser('close'); } catch { /* Cleanup must not hide test failure. */ }
    activeSession = previous;
  }
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
  await proveHomeDiscovery();
  checkErrors(); clearErrors();

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
  assert.equal(draft().styleId, 'brutalist-grid');
  assert.equal(draft().overrides.colors.text, '#243447');
  assert.equal(draft().overrides.typography.body.lineHeight, 1.9);
  pass('Comparison link keeps the working design until apply');
  click('.compare-setup > .home-choice__switches:first-child button:nth-child(3)');
  click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(3)');
  browser('reload');
  browser('wait', '.compare-setup');
  assert.equal(draft().comparison.mode, 'axis');
  assert.equal(draft().comparison.axis, 'density');
  assert.equal(draft().overrides.colors.text, '#243447');
  assert.equal(draft().overrides.typography.body.lineHeight, 1.9);
  pass('Reload keeps the latest comparison selection and accepted edits');
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
  assert.equal(handoff.axisSources.density, 'editorial-silence');
  assert.equal(handoff.axisSources.color, undefined);
  assert.equal(handoff.axisSources.typography, undefined);
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
  browser('set', 'viewport', '1440', '1000');
  const beforeInvalid = draft();
  open('/pages/compare?left=not-a-style&right=editorial-silence&fixture=not-a-fixture', '.compare-setup');
  browser('wait', '.workspace-status__notice');
  assert.equal(evaluate('document.querySelector(".workspace-status__notice p").textContent'), 'This comparison link contains unavailable styles or settings. Your current design and comparison are unchanged.');
  assert.equal(draft().comparison.left, beforeInvalid.comparison.left);
  assert.equal(draft().comparison.right, beforeInvalid.comparison.right);
  assert.equal(draft().fixtureId, beforeInvalid.fixtureId);
  assert.equal(draft().styleId, beforeInvalid.styleId);
  assert.equal(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).some(node => node.value === "not-a-style")'), false);
  pass('Invalid style and fixture ids stay visible and leave the comparison unchanged');

  open('/pages/compare?left=neon-drift&right=swiss-poster', '.compare-grid');
  assert.equal(draft().comparison.mode, 'original');
  assert.equal(draft().comparison.left, 'neon-drift');
  assert.equal(draft().comparison.right, 'swiss-poster');
  assert.equal(draft().styleId, beforeInvalid.styleId);
  assert.equal(evaluate('document.querySelectorAll(".compare-grid iframe.compare-frame").length'), 2);
  assert.equal(evaluate('document.querySelectorAll(".compare-grid .visual-specimen").length'), 0);
  assert.equal(evaluate('document.querySelector(".compare-slot select").value'), 'neon-drift');
  assert.equal(evaluate('document.querySelectorAll(".compare-slot select")[1].value'), 'swiss-poster');
  pass('Legacy left/right link keeps original examples and mounts only that pair');

  open('/pages/compare?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial', '.compare-copy-editor');
  const stylesBeforeCopy = evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)');
  click('.compare-copy-editor summary');
  browser('fill', '.compare-copy-editor textarea', 'Shared heading for both candidates');
  const headings = evaluate('Array.from(document.querySelectorAll(".compare-grid .visual-specimen h3")).map(node => node.textContent)');
  assert.deepEqual(headings, ['Shared heading for both candidates', 'Shared heading for both candidates']);
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)'), stylesBeforeCopy);
  assert.equal(evaluate('document.querySelectorAll(".compare-grid .visual-specimen").length'), 2);
  assert.equal(evaluate('document.querySelectorAll(".compare-grid iframe.compare-frame").length'), 0);
  const isolated = evaluate(`(() => {
    const slots = Array.from(document.querySelectorAll('.compare-grid .visual-specimen'));
    const nav = getComputedStyle(document.querySelector('.site-nav'));
    return {
      hostToken: nav.getPropertyValue('--vs-text').trim(),
      bodyToken: getComputedStyle(document.body).getPropertyValue('--vs-canvas').trim(),
      leftToken: slots[0].style.getPropertyValue('--vs-text'),
      rightToken: slots[1].style.getPropertyValue('--vs-text'),
      rightComputed: getComputedStyle(slots[1]).getPropertyValue('--vs-text').trim(),
      hostFont: nav.fontFamily,
      leftFont: slots[0].style.fontFamily,
    };
  })()`);
  assert.equal(isolated.hostToken, '');
  assert.equal(isolated.bodyToken, '');
  assert.notEqual(isolated.leftToken, isolated.rightToken);
  assert.equal(isolated.rightComputed, isolated.rightToken);
  assert.equal(isolated.hostFont.includes(isolated.leftFont.split(',')[0].replaceAll("'", '').trim()), false);
  browser('reload');
  browser('wait', '.compare-copy-editor');
  assert.equal(evaluate('document.querySelector(".compare-copy-editor textarea").value'), 'Shared heading for both candidates');
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-grid .visual-specimen h3")).map(node => node.textContent)'), headings);
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)'), stylesBeforeCopy);
  click('.compare-setup > .home-choice__switches:first-child button:nth-child(1)');
  assert.equal(draft().comparison.mode, 'original');
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)'), stylesBeforeCopy);
  assert.equal(evaluate('document.querySelectorAll(".compare-grid iframe.compare-frame").length'), 2);
  click('.compare-setup > .home-choice__switches:first-child button:nth-child(2)');
  browser('wait', '.compare-grid .visual-specimen h3');
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-grid .visual-specimen h3")).map(node => node.textContent)'), headings);
  pass('Shared copy updates both candidates, survives reload and mode changes, and stays inside each specimen');

  const beforeSwap = evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)');
  click('.compare-controls > button.button');
  const swapped = evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)');
  assert.deepEqual(swapped, [beforeSwap[1], beforeSwap[0]]);
  click('.compare-controls > button.button');
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)'), beforeSwap);
  pass('Swapping candidates twice restores the same pair');

  click('.compare-setup > .home-choice__switches:first-child button:nth-child(3)');
  click('.compare-setup > .home-choice__switches:nth-child(2) button:nth-child(2)');
  browser('wait', '.compare-axis-result');
  await waitUntilTypographyReady();
  const axisPair = evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)');
  const axisDraft = draft().comparison;
  click('.compare-controls > button.button');
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)'), [axisPair[1], axisPair[0]]);
  assert.equal(draft().comparison.left, axisDraft.left);
  assert.equal(draft().comparison.right, axisDraft.right);
  click('.compare-controls > button.button');
  assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-slot select")).map(node => node.value)'), axisPair);
  const beforeApply = draft();
  const acknowledgeAxis = evaluate('Boolean(document.querySelector(".compare-warning input[type=checkbox]"))');
  if (acknowledgeAxis) browser('check', '.compare-warning input[type=checkbox]');
  click('.compare-axis-result > button.button--dark');
  assert.equal(draft().axisSources.typography, 'quiet-utility');
  assert.equal(draft().styleId, beforeApply.styleId);
  assert.equal(draft().overrides.colors?.text, beforeApply.overrides.colors?.text);
  click('.compare-continuation button.button');
  assert.equal(draft().axisSources.typography, beforeApply.axisSources.typography);
  assert.deepEqual(draft().overrides, beforeApply.overrides);
  pass('Applying typography only can be undone without touching the other draft fields');

  await provePairedScrollAndFontGate();

  open('/ko/pages/compare?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial', '.compare-grid .visual-specimen');
  assert.equal(evaluate('document.querySelector(".compare-setup > .home-choice__switches button[aria-pressed=true]").textContent'), '같은 내용');
  click('.compare-copy-editor summary');
  click('.compare-copy-editor > button');
  browser('select', '.compare-content-controls label:nth-child(2) select', 'ko');
  const korean = evaluate('Array.from(document.querySelectorAll(".compare-grid .visual-specimen h3")).map(node => node.textContent)');
  assert.deepEqual(korean, ['작은 공간에서 발견하는 사려 깊은 생활.', '작은 공간에서 발견하는 사려 깊은 생활.']);
  assert.equal(evaluate('document.querySelector(".compare-grid .visual-specimen").lang'), 'ko');
  assert.equal(draft().contentLocale, 'ko');
  assert.equal(draft().comparison.left, 'editorial-silence');
  assert.equal(draft().comparison.right, 'quiet-utility');
  fit();
  pass('Korean compare route renders the same editorial fixture in both candidates');

  browser('select', '.compare-content-controls label:nth-child(2) select', 'en');
  const shots = [
    ['editorial', 'editorial-silence', 'quiet-utility', 'editorial'],
    ['utility', 'quiet-utility', 'editorial-silence', 'operations'],
    ['expressive', 'kinetic-pop', 'swiss-poster', 'product'],
  ];
  for (const [name, left, right, fixture] of shots) {
    for (const [mode, axis] of [['complete', 'color'], ['axis', 'typography']]) {
      open(`/pages/compare?left=${left}&right=${right}&mode=${mode}&axis=${axis}&fixture=${fixture}`, mode === 'axis' ? '.compare-axis-result' : '.compare-grid .visual-specimen');
      if (mode === 'axis' && axis === 'typography') {
        const settled = await waitFor(typographyGateView, (view) => view.state === 'ready' || view.state === 'failed', `compare ${name} font gate`);
        if (settled.state === 'ready') assert.equal(settled.diff, true);
        else {
          assert.equal(settled.diff, false);
          assert.equal(settled.disabled, true);
          assert.match(settled.alert, /not a typography result/);
        }
      }
      assert.equal(evaluate('document.querySelectorAll(".compare-grid .visual-specimen").length'), 2);
      assert.equal(evaluate('document.querySelectorAll("iframe.compare-frame").length'), 0);
      for (const [width, height] of [[1440, 1000], [390, 844]]) {
        browser('set', 'viewport', String(width), String(height));
        if (width === 390) {
          click('.compare-mobile-switch button:nth-child(2)');
          const hidden = evaluate('Array.from(document.querySelectorAll(".compare-grid > .compare-slot")).map(node => getComputedStyle(node).display)');
          assert.deepEqual(hidden, ['none', 'flex']);
          click('.compare-mobile-switch button:nth-child(1)');
          assert.deepEqual(evaluate('Array.from(document.querySelectorAll(".compare-grid > .compare-slot")).map(node => getComputedStyle(node).display)'), ['flex', 'none']);
        }
        browser('scrollintoview', '.compare-grid');
        fit();
        capture(`compare-${mode}-${name}-${width}`);
        pass(`Compare ${mode} ${name} ${width}px`, evaluate('({mode:document.querySelector(".compare-setup button[aria-pressed=true]").textContent,fixture:document.querySelector(".compare-content-controls select").value,mounted:document.querySelectorAll(".compare-grid .visual-specimen").length})'));
      }
    }
  }
  proveKoreanChromeWrapping();
  checkErrors(); clearErrors();
  browser('set', 'viewport', '1440', '1000');
  await proveDraftTabChoice();
  await proveQuotaKeepsCompleteDraft();
  await proveBlockedStorage('getter');
  await proveBlockedStorage('getItem');
  await proveRefineExisting();
  await proveResourceGuard();

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
