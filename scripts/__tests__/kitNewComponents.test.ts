import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { KIT_ITEMS } from '../build-kit-registry.mts';
import { KIT_PATH, kitCatalog, kitReadingOrder, kitStart } from '../../src/data/kitCatalog';
import { allRoutes, isKitPath, matchRoute } from '../../src/data/routes';
import { ProgressBar, StackedBar } from '../../src/kit/progress-bar/progress-bar';
import { RollingNumber } from '../../src/kit/rolling-number/rolling-number';
import { SegmentedControl } from '../../src/kit/segmented-control/segmented-control';
import { ToastCard, Toaster } from '../../src/kit/toast/toast';
import { Tooltip } from '../../src/kit/tooltip/tooltip';
import { Accordion } from '../../src/kit/accordion/accordion';
import { Checkbox } from '../../src/kit/checkbox/checkbox';
import { Dialog } from '../../src/kit/dialog/dialog';
import { Menu } from '../../src/kit/menu/menu';
import { RadioGroup } from '../../src/kit/radio-group/radio-group';
import { Select } from '../../src/kit/select/select';
import { Slider } from '../../src/kit/slider/slider';
import { Switch } from '../../src/kit/switch/switch';
import { Tabs } from '../../src/kit/tabs/tabs';
import { TextArea, TextField } from '../../src/kit/text-field/text-field';
import { COMPONENT_DOCS } from '../../src/pages/components/docs';

// Components here take different props, so the helper accepts any of them.
const html = (type: ComponentType<never>, props: object) => renderToStaticMarkup(createElement(type as ComponentType<object>, props));
const noop = () => undefined;

describe('SegmentedControl', () => {
  const options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];

  it('is a named radiogroup with one tab stop, on the selected option', () => {
    const markup = html(SegmentedControl, { label: 'Period', value: 'c', options, onValueChange: noop });
    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('aria-label="Period"');
    expect(markup.match(/tabindex="0"/g)).toHaveLength(1);
    expect(markup).toMatch(/aria-checked="true"[^>]*tabindex="0"/);
  });

  it('keeps the group reachable when the value matches nothing', () => {
    expect(html(SegmentedControl, { label: 'Period', value: 'zzz', options, onValueChange: noop }).match(/tabindex="0"/g)).toHaveLength(1);
  });

  it('never gives a disabled option the tab stop', () => {
    const markup = html(SegmentedControl, { label: 'Period', value: 'b', options, onValueChange: noop });
    expect(markup).toMatch(/aria-checked="false"[^>]*tabindex="0"/);
  });
});

describe('RollingNumber', () => {
  it('gives screen readers one string and hides the digits', () => {
    const markup = html(RollingNumber, { value: 1284 });
    expect(markup).toContain('<span class="ws-roll__text">1,284</span>');
    expect(markup).toMatch(/ws-roll__glyphs" aria-hidden="true"/);
  });

  it('rolls digits only: units and separators are plain characters', () => {
    const markup = html(RollingNumber, { value: '54.5k' });
    expect(markup.match(/ws-roll__digit/g)).toHaveLength(3);
    expect(markup).toContain('<span>.</span>');
    expect(markup).toContain('<span>k</span>');
  });

  it('rests each strip on the middle copy of its digit', () => {
    expect(html(RollingNumber, { value: '7' })).toContain(`translateY(${(-17 / 30) * 100}%)`);
  });

  it('uses format for numbers and ignores it for strings', () => {
    const format = (value: number) => `$${value.toFixed(2)}`;
    expect(html(RollingNumber, { value: 3, format })).toContain('$3.00');
    expect(html(RollingNumber, { value: '3', format })).toContain('<span class="ws-roll__text">3</span>');
  });
});

describe('ProgressBar', () => {
  it('names the bar and reports its value', () => {
    const markup = html(ProgressBar, { label: 'Upload', value: 3, max: 4 });
    expect(markup).toContain('role="progressbar"');
    expect(markup).toMatch(/aria-labelledby="[^"]+"/);
    expect(markup).toContain('aria-valuenow="3"');
    expect(markup).toContain('aria-valuemax="4"');
    expect(markup).toContain('75%');
    expect(markup).toContain('translateX(-25%)');
  });

  it('clamps out-of-range values on screen', () => {
    expect(html(ProgressBar, { label: 'Over', value: 140 })).toContain('translateX(0%)');
    expect(html(ProgressBar, { label: 'Under', value: -10 })).toContain('translateX(-100%)');
    expect(html(ProgressBar, { label: 'Empty', value: 5, max: 0 })).toContain('translateX(-100%)');
  });

  it('uses valueText on screen and for screen readers', () => {
    const markup = html(ProgressBar, { label: 'Storage', value: 4, max: 5, valueText: '4 GB / 5 GB' });
    expect(markup).toContain('aria-valuetext="4 GB / 5 GB"');
    expect(markup).toContain('>4 GB / 5 GB<');
  });

  it('reports no value while indeterminate', () => {
    const markup = html(ProgressBar, { label: 'Connecting', indeterminate: true });
    expect(markup).not.toContain('aria-valuenow');
    expect(markup).not.toContain('%');
  });

  it('StackedBar: the legend carries the values and the bar is decorative', () => {
    const markup = html(StackedBar, {
      label: 'Deploys',
      segments: [
        { label: 'Done', value: 3, tone: 'positive' },
        { label: 'Failed', value: 1, tone: 'critical' },
      ],
    });
    expect(markup).toMatch(/ws-stacked__bar" aria-hidden="true"/);
    expect(markup).toContain('<ul class="ws-stacked__legend" aria-label="Deploys">');
    expect(markup).toContain('flex-grow:0.75');
    expect(markup).not.toContain('ws-stacked__free');
    expect(markup).toContain('>Failed<');
  });
});

describe('StackedBar free space', () => {
  it('leaves room at the end when max is larger than the parts', () => {
    const segments = [{ label: 'Used', value: 2, tone: 'accent' }];
    expect(html(StackedBar, { label: 'Disk', segments, max: 5 })).toMatch(/ws-stacked__free" style="flex-grow:0.6"/);
  });

  it('fills the bar with fractional values: grow values add up to 1', () => {
    const segments = [{ label: 'A', value: 0.1, tone: 'info' }, { label: 'B', value: 0.3, tone: 'positive' }];
    const grows = [...html(StackedBar, { label: 'Parts', segments }).matchAll(/flex-grow:([\d.]+)/g)].map((match) => Number(match[1]));
    expect(grows.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1);
  });

  it('treats a max smaller than the parts as the sum', () => {
    const segments = [{ label: 'A', value: 4, tone: 'info' }];
    const markup = html(StackedBar, { label: 'Parts', segments, max: 2 });
    expect(markup).toContain('flex-grow:1');
    expect(markup).not.toContain('ws-stacked__free');
  });

  it('draws nothing for a part with no value, but keeps it in the legend', () => {
    const markup = html(StackedBar, { label: 'Runs', segments: [{ label: 'Done', value: 4, tone: 'positive' }, { label: 'Failed', value: 0, tone: 'critical' }] });
    expect(markup.match(/ws-stacked__part/g)).toHaveLength(1);
    expect(markup).toContain('>Failed<');
  });
});

describe('Tooltip', () => {
  it('renders the trigger alone until it opens', () => {
    const markup = html(Tooltip, { content: 'Hint', children: createElement('button', { type: 'button' }, 'Save') });
    expect(markup).toContain('<button type="button">Save</button>');
    expect(markup).not.toContain('role="tooltip"');
    expect(markup).not.toContain('Hint');
  });
});

describe('Toast', () => {
  it('renders its live region before the first toast', () => {
    const markup = html(Toaster, { label: 'Alerts' });
    expect(markup).toContain('aria-label="Alerts"');
    expect(markup).toContain('aria-live="polite"');
  });

  it('shows a spinner when busy, and a named close button when given a label', () => {
    const markup = html(ToastCard, { title: 'Deploying', busy: true, closeLabel: 'Dismiss' });
    expect(markup).toContain('ws-toast__spinner');
    expect(markup).toContain('aria-label="Dismiss"');
  });

  it('gives each tone its own icon', () => {
    const icons = (['neutral', 'positive', 'caution', 'critical'] as const).map((tone) => html(ToastCard, { title: 'x', tone }).replace(/data-tone="\w+"/, ''));
    expect(new Set(icons).size).toBe(4);
  });

  it('has no close button without a label, as in a static preview', () => {
    expect(html(ToastCard, { title: 'x' })).not.toContain('ws-toast__close');
  });
});

describe('Switch and Checkbox', () => {
  it('Switch is a native checkbox with the switch role, named by its label only', () => {
    const markup = html(Switch, { label: 'Alerts', description: 'Sent on failure.', checked: true, onCheckedChange: noop });
    expect(markup).toMatch(/<input[^>]*type="checkbox"[^>]*role="switch"/);
    expect(markup).toMatch(/aria-labelledby="[^"]+"/);
    expect(markup).toMatch(/aria-describedby="[^"]+"/);
    expect(markup).toContain('checked=""');
  });

  it('Switch has no description link without a description', () => {
    expect(html(Switch, { label: 'Alerts', checked: false, onCheckedChange: noop })).not.toContain('aria-describedby');
  });

  it('Checkbox draws a check and a dash, and leaves both out of the accessibility tree', () => {
    const markup = html(Checkbox, { label: 'All', checked: false, onCheckedChange: noop });
    expect(markup).toContain('ws-checkbox__check');
    expect(markup).toContain('ws-checkbox__dash');
    expect(markup).toMatch(/ws-checkbox__box" aria-hidden="true"/);
  });
});

describe('RadioGroup', () => {
  const options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', description: 'Second', disabled: true },
  ];

  it('groups native radios under one name in a named fieldset', () => {
    const markup = html(RadioGroup, { label: 'Plan', value: 'a', options, onValueChange: noop, name: 'plan' });
    expect(markup).toMatch(/^<fieldset/);
    expect(markup).toContain('<legend class="ws-radios__legend">Plan</legend>');
    expect(markup.match(/type="radio"/g)).toHaveLength(2);
    expect(markup.match(/name="plan"/g)).toHaveLength(2);
    expect(markup.match(/ checked=""/g)).toHaveLength(1);
    expect(markup).toContain('disabled=""');
  });

  it('marks the variant for styling', () => {
    expect(html(RadioGroup, { label: 'Plan', value: '', options, onValueChange: noop, variant: 'cards' })).toContain('data-variant="cards"');
  });
});

describe('TextField and TextArea', () => {
  const base = { label: 'Email', value: '', onValueChange: noop, id: 'mail' };

  it('connects the label and the hint', () => {
    const markup = html(TextField, { ...base, description: 'For receipts.' });
    expect(markup).toContain('for="mail"');
    expect(markup).toContain('aria-describedby="mail-message"');
    expect(markup).toContain('id="mail-message"');
    expect(markup).not.toContain('aria-invalid');
  });

  it('shows the error in place of the hint and marks the field invalid', () => {
    const markup = html(TextField, { ...base, description: 'For receipts.', error: 'Enter a full address.' });
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('Enter a full address.');
    expect(markup).not.toContain('For receipts.');
  });

  it('has no description link with no message', () => {
    expect(html(TextField, base)).not.toContain('aria-describedby');
  });

  it('TextArea is a textarea with the same wiring', () => {
    const markup = html(TextArea, { ...base, error: 'Too long.' });
    expect(markup).toMatch(/<textarea[^>]*aria-invalid="true"/);
    expect(markup).toContain('rows="3"');
  });
});

describe('Select with a long value', () => {
  it('gives the grid a shrinkable column, so a long label cannot widen the page', () => {
    expect(html(Select, { label: 'Project', value: '', options: [], onValueChange: noop })).toContain('class="ws-field ws-select"');
    expect(readFileSync(resolve(process.cwd(), 'src/kit/field/field.css'), 'utf8')).toMatch(/\.ws-field \{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Alpha', hint: '1' },
    { value: 'b', label: 'Beta' },
  ];

  it('is a combobox named by its label and value, with the list closed', () => {
    const markup = html(Select, { label: 'Project', value: 'b', options, onValueChange: noop });
    expect(markup).toMatch(/role="combobox"[^>]*aria-haspopup="listbox"[^>]*aria-expanded="false"/);
    expect(markup).toMatch(/aria-labelledby="[^" ]+ [^" ]+"/);
    expect(markup).toContain('Beta');
    expect(markup).not.toContain('role="listbox"');
  });

  it('shows the placeholder with no value, and adds a form field only when named', () => {
    const empty = html(Select, { label: 'Project', value: '', options, placeholder: 'Choose', onValueChange: noop });
    expect(empty).toContain('data-placeholder=""');
    expect(empty).toContain('Choose');
    expect(empty).not.toContain('type="hidden"');
    expect(html(Select, { label: 'P', value: 'a', options, name: 'project', onValueChange: noop })).toMatch(/type="hidden" name="project" value="a"/);
  });

  it('disables the submitted input and connects its error to the trigger', () => {
    const markup = html(Select, { label: 'Project', id: 'project', value: 'a', options, name: 'project', disabled: true, required: true, error: 'Choose an available project.', onValueChange: noop });
    expect(markup).toMatch(/<input[^>]*type="hidden"[^>]*disabled=""/);
    expect(markup).toContain('for="project"');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('aria-describedby="project-message"');
    expect(markup).toContain('id="project-message"');
  });
});

describe('Menu', () => {
  it('marks its trigger and renders no list until opened', () => {
    const markup = html(Menu, { label: 'Actions', items: [{ key: 'a', label: 'Rename', onSelect: noop }], children: createElement('button', { type: 'button' }, 'More') });
    expect(markup).toContain('aria-haspopup="menu"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).not.toContain('role="menu"');
  });
});

describe('Tabs', () => {
  const items = [
    { value: 'a', label: 'One', content: 'First panel' },
    { value: 'b', label: 'Two', count: 3, content: 'Second panel' },
    { value: 'c', label: 'Off', disabled: true, content: 'Never' },
  ];

  it('links every tab to a mounted panel and hides inactive panels', () => {
    const markup = html(Tabs, { label: 'Sections', value: 'b', items, onValueChange: noop });
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain('aria-label="Sections"');
    // The selected tab is reachable on the server; the panel inspects its
    // focusable children after mounting before adding another tab stop.
    expect(markup.match(/tabindex="0"/g)).toHaveLength(1);
    expect(markup).toContain('Second panel');
    expect(markup).toContain('First panel');
    expect(markup.match(/role="tabpanel"/g)).toHaveLength(3);
    expect(markup.match(/role="tabpanel"[^>]*hidden=""/g)).toHaveLength(2);
    expect(markup.match(/aria-controls=/g)).toHaveLength(3);
    expect(markup).toContain('ws-tabs__count');
  });
});

describe('Tabs ids and reachability', () => {
  const items = [
    { value: 'a b', label: 'One', content: 'x' },
    { value: 'c', label: 'Two', disabled: true, content: 'y' },
  ];

  it('builds ids from position, so a value with a space cannot break the references', () => {
    const markup = html(Tabs, { label: 'S', value: 'a b', items, onValueChange: noop });
    for (const [, id] of markup.matchAll(/(?:aria-controls|aria-labelledby)="([^"]+)"/g)) expect(id).not.toContain(' ');
  });

  it('keeps one tab stop when the selected tab is disabled or missing', () => {
    expect(html(Tabs, { label: 'S', value: 'c', items, onValueChange: noop })).toMatch(/aria-selected="false"[^>]*tabindex="0"/);
    expect(html(Tabs, { label: 'S', value: 'zzz', items, onValueChange: noop })).toMatch(/tabindex="0"/);
  });
});

describe('Accordion', () => {
  const items = [
    { value: 'a', title: 'One', content: 'Body one' },
    { value: 'b', title: 'Two', content: 'Body two' },
  ];

  it('opens the default section and makes the closed one inert', () => {
    const markup = html(Accordion, { items, defaultOpen: ['a'] });
    expect(markup.match(/aria-expanded="true"/g)).toHaveLength(1);
    expect(markup.match(/aria-expanded="false"/g)).toHaveLength(1);
    expect(markup.match(/ inert=""/g)).toHaveLength(1);
  });

  it('puts each title button in a heading of the chosen level', () => {
    expect(html(Accordion, { items, headingAs: 'h4' }).match(/<h4 class="ws-accordion__heading"><button/g)).toHaveLength(2);
  });
});

describe('Slider', () => {
  it('is a native range with the formatted value for screen readers', () => {
    const markup = html(Slider, { label: 'Limit', value: 30, min: 20, max: 40, step: 5, format: (value: number) => `${value} GB`, onValueChange: noop });
    expect(markup).toMatch(/<input[^>]*type="range"/);
    expect(markup).toContain('min="20"');
    expect(markup).toContain('aria-valuetext="30 GB"');
    expect(markup).toContain('--ws-slider-ratio:0.5');
  });

  it('clamps the ratio and survives an empty range', () => {
    expect(html(Slider, { label: 'L', value: 500, max: 100, onValueChange: noop })).toContain('--ws-slider-ratio:1');
    expect(html(Slider, { label: 'L', value: 5, min: 5, max: 5, onValueChange: noop })).toContain('--ws-slider-ratio:0');
  });

  it('labels marks with the same format', () => {
    expect(html(Slider, { label: 'L', value: 0, marks: [0, 50], format: (value: number) => `${value}%`, onValueChange: noop })).toContain('>50%<');
  });
});

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    expect(html(Dialog, { open: false, onOpenChange: noop, title: 'Delete' })).toBe('');
  });

  it('names itself by its title and description', () => {
    const markup = html(Dialog, { open: true, onOpenChange: noop, title: 'Delete', description: 'Cannot be undone.', closeLabel: 'Dismiss' });
    expect(markup).toMatch(/<dialog[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/);
    expect(markup).toContain('aria-label="Dismiss"');
  });

  it('turns the close button off while locked', () => {
    expect(html(Dialog, { open: true, onOpenChange: noop, title: 'Saving', locked: true })).toMatch(/ws-dialog__close"[^>]*disabled=""/);
  });
});

describe('license', () => {
  const kitRoot = resolve(process.cwd(), 'src/kit');
  const kitSources = KIT_ITEMS.flatMap((item) => item.files).filter((file) => /\.(tsx|css)$/.test(file));

  it('marks every kit source file as MIT, so a hand-copied file keeps the notice', () => {
    expect(kitSources.length).toBeGreaterThan(20);
    for (const file of kitSources) {
      const source = readFileSync(resolve(kitRoot, file), 'utf8');
      expect(source, file).toContain('SPDX-License-Identifier: MIT');
      expect(source, file).toContain('Copyright (c) 2026 Web Stylebook');
    }
  });

  it('keeps the use client directive first, where React requires it', () => {
    for (const file of kitSources.filter((path) => path.endsWith('.tsx'))) {
      const source = readFileSync(resolve(kitRoot, file), 'utf8');
      if (source.includes("'use client'")) expect(source.startsWith("'use client';"), file).toBe(true);
    }
  });

  it('installs the license with the theme, which every component depends on', () => {
    expect(KIT_ITEMS.find((item) => item.name === 'theme')?.files).toContain('LICENSE');
  });

  it('publishes the command under MIT with its own license file', () => {
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'packages/cli/package.json'), 'utf8'));
    expect(manifest.license).toBe('MIT');
    expect(readFileSync(resolve(process.cwd(), 'packages/cli/LICENSE'), 'utf8')).toMatch(/^MIT License/);
  });
});

describe('component catalog', () => {
  it('has a doc, a registry item, and a route for every component', () => {
    const registry = new Set(KIT_ITEMS.map((item) => item.name));
    for (const entry of kitCatalog) {
      expect(COMPONENT_DOCS[entry.slug], entry.slug).toBeDefined();
      expect(registry.has(entry.slug), entry.slug).toBe(true);
      expect(matchRoute(`${KIT_PATH}/${entry.slug}`)?.path).toBe(`${KIT_PATH}/${entry.slug}`);
    }
  });

  it('lists every kit component, so none is installable but undocumented', () => {
    const documented = new Set(kitCatalog.map((entry) => entry.slug));
    expect(KIT_ITEMS.map((item) => item.name).filter((name) => !['theme', 'overlay'].includes(name) && !documented.has(name))).toEqual([]);
  });

  it('installs only registry items that exist', () => {
    const registry = new Set(KIT_ITEMS.map((item) => item.name));
    for (const doc of Object.values(COMPONENT_DOCS)) for (const name of doc.install) expect(registry.has(name), name).toBe(true);
  });

  it('shows every kit source file in the code tab of its component', () => {
    const items = new Map(KIT_ITEMS.map((item) => [item.name, item]));
    for (const entry of kitCatalog) {
      const item = items.get(entry.slug)!;
      const required = [...item.files, ...(item.uses ?? []).flatMap((name) => items.get(name)!.files)];
      const shown = COMPONENT_DOCS[entry.slug].files.map((file) => file.path);
      expect(shown.sort()).toEqual(required.sort());
      // Vitest empties CSS imports, so only the TSX text can be compared here.
      for (const file of COMPONENT_DOCS[entry.slug].files.filter(({ path }) => path.endsWith('.tsx'))) {
        expect(file.code).toBe(readFileSync(resolve(process.cwd(), 'src/kit', file.path), 'utf8'));
      }
    }
  });

  it('reads every component once, in category order', () => {
    expect(new Set(kitReadingOrder.map((entry) => entry.slug)).size).toBe(kitCatalog.length);
    expect(kitReadingOrder).toHaveLength(kitCatalog.length);
  });

  it('has one route per path', () => {
    const paths = allRoutes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
    expect(matchRoute(`${KIT_PATH}/${kitStart.slug}`)).toBeDefined();
  });

  it('treats only the components pages as kit paths', () => {
    expect(isKitPath(KIT_PATH)).toBe(true);
    expect(isKitPath(`${KIT_PATH}/toast`)).toBe(true);
    expect(isKitPath('/pages/component-glossary')).toBe(false);
    expect(isKitPath('/pages/componentsx')).toBe(false);
  });
});
