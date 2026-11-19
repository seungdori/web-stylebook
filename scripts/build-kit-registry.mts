// Kit registry builder: src/kit -> public/r/*.json (shadcn registry items).
// Each item carries its source as file content. `npx webstylebook add <name>`
// (packages/cli) copies the files into the user's project. The items follow
// the shadcn registry format, so `npx shadcn add <url>` can install them too.
//
// Usage:
//   tsx scripts/build-kit-registry.mts            write public/r
//   tsx scripts/build-kit-registry.mts --check    fail if public/r is stale
//   tsx scripts/build-kit-registry.mts --base http://localhost:5173/r --out <dir>
//                                                 local install test

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_BASE = 'https://webstylebook.com/r';
const TARGET_DIR = 'src/components/webstylebook';

interface KitItem {
  name: string;
  title: string;
  description: string;
  /** Paths relative to src/kit. */
  files: string[];
  /** Other kit items this one imports. The theme is added to every component. */
  uses?: string[];
}

export const KIT_ITEMS: KitItem[] = [
  {
    name: 'theme',
    title: 'Theme: Quiet Utility',
    description: 'The --ws-* variables every kit component reads. Replace this file to change the style.',
    files: ['theme.css', 'contract.ts', 'LICENSE'],
  },
  {
    name: 'surface',
    title: 'Surface',
    description: 'Shell, ShellHeader, and Panel: the framed layers other components sit in.',
    files: ['surface/surface.tsx', 'surface/surface.css'],
  },
  {
    name: 'button',
    title: 'Button',
    description: 'Primary, secondary, quiet, and critical buttons, including links and an icon-only button.',
    files: ['button/button.tsx', 'button/button.css'],
  },
  {
    name: 'search-field',
    title: 'Search Field',
    description: 'A search input with a clear button; Escape clears the value.',
    files: ['search-field/search-field.tsx', 'search-field/search-field.css'],
  },
  {
    name: 'skeleton',
    title: 'Skeleton',
    description: 'Placeholder blocks and a group that announces one loading message.',
    files: ['skeleton/skeleton.tsx', 'skeleton/skeleton.css'],
  },
  {
    name: 'status-badge',
    title: 'Status Badge',
    description: 'A one-word state in five tones, with a dot or an icon.',
    files: ['status-badge/status-badge.tsx', 'status-badge/status-badge.css'],
  },
  {
    name: 'empty-state',
    title: 'Empty State',
    description: 'Why a list is empty and what to do next: first visit, no results, or a failed load.',
    files: ['empty-state/empty-state.tsx', 'empty-state/empty-state.css'],
  },
  {
    name: 'segmented-control',
    title: 'Segmented Control',
    description: 'One choice from a short list. The thumb slides on a click and jumps on a key press.',
    files: ['segmented-control/segmented-control.tsx', 'segmented-control/segmented-control.css'],
  },
  {
    name: 'rolling-number',
    title: 'Rolling Number',
    description: 'A number whose digits roll to their new value. Units and separators stay still.',
    files: ['rolling-number/rolling-number.tsx', 'rolling-number/rolling-number.css'],
  },
  {
    name: 'progress-bar',
    title: 'Progress Bar',
    description: 'Task progress in five tones, a state with no known end, and a stacked bar of parts.',
    files: ['progress-bar/progress-bar.tsx', 'progress-bar/progress-bar.css'],
  },
  {
    name: 'tooltip',
    title: 'Tooltip',
    description: 'A hint on hover and keyboard focus that opens instantly once one is warm.',
    files: ['tooltip/tooltip.tsx', 'tooltip/tooltip.css'],
    uses: ['overlay'],
  },
  {
    name: 'overlay',
    title: 'Overlay',
    description: 'Shared placement and keyboard code for Tooltip, Select, and Menu. Installed with them.',
    files: ['overlay/overlay.tsx'],
  },
  {
    name: 'switch',
    title: 'Switch',
    description: 'An on/off setting. The thumb stretches while pressed.',
    files: ['switch/switch.tsx', 'switch/switch.css'],
  },
  {
    name: 'field',
    title: 'Field',
    description: 'The label, hint, and error shared by Text Field and Select. Installed with them.',
    files: ['field/field.tsx', 'field/field.css'],
  },
  {
    name: 'text-field',
    title: 'Text Field',
    description: 'Text input and a text area that grows, with label, hint, and error wired up.',
    files: ['text-field/text-field.tsx', 'text-field/text-field.css'],
    uses: ['field'],
  },
  {
    name: 'dialog',
    title: 'Dialog',
    description: 'A modal window on the native dialog element, with an exit animation and a locked state.',
    files: ['dialog/dialog.tsx', 'dialog/dialog.css'],
  },
  {
    name: 'checkbox',
    title: 'Checkbox',
    description: 'A choice that can be on or off, with a mixed state. The mark draws itself.',
    files: ['checkbox/checkbox.tsx', 'checkbox/checkbox.css'],
  },
  {
    name: 'radio-group',
    title: 'Radio Group',
    description: 'One choice from a few, all visible at once, as a list or as cards.',
    files: ['radio-group/radio-group.tsx', 'radio-group/radio-group.css'],
  },
  {
    name: 'select',
    title: 'Select',
    description: 'One value from a list, with typing to jump and a list that flips when there is no room.',
    files: ['select/select.tsx', 'select/select.css'],
    uses: ['overlay', 'field'],
  },
  {
    name: 'slider',
    title: 'Slider',
    description: 'A value on a range, with marks and a formatted readout.',
    files: ['slider/slider.tsx', 'slider/slider.css'],
  },
  {
    name: 'tabs',
    title: 'Tabs',
    description: 'Related content in one place. The indicator slides on a click and jumps on a key press.',
    files: ['tabs/tabs.tsx', 'tabs/tabs.css'],
  },
  {
    name: 'accordion',
    title: 'Accordion',
    description: 'Sections that fold, with one or several open at a time.',
    files: ['accordion/accordion.tsx', 'accordion/accordion.css'],
  },
  {
    name: 'menu',
    title: 'Menu',
    description: 'A list of actions on a button, with shortcuts and a destructive group.',
    files: ['menu/menu.tsx', 'menu/menu.css'],
    uses: ['overlay'],
  },
  {
    name: 'alert',
    title: 'Alert',
    description: 'A message that stays on the page. Critical alerts are announced. The others are read with the page.',
    files: ['alert/alert.tsx', 'alert/alert.css'],
  },
  {
    name: 'popover',
    title: 'Popover',
    description: 'A panel that opens from a click and stays until dismissed. It is not modal.',
    files: ['popover/popover.tsx', 'popover/popover.css'],
    uses: ['overlay'],
  },
  {
    name: 'toast',
    title: 'Toast',
    description: 'Notifications that stack, fan out on hover, pause while read, and update in place.',
    files: ['toast/toast.tsx', 'toast/toast.css'],
  },
];

const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json';
const SCHEMA_REGISTRY = 'https://ui.shadcn.com/schema/registry.json';

function itemJson(item: KitItem, base: string) {
  const dependsOnTheme = item.name !== 'theme';
  const registryDependencies = [...(dependsOnTheme ? ['theme'] : []), ...(item.uses ?? [])].map((name) => `${base}/${name}.json`);
  return {
    $schema: SCHEMA_ITEM,
    name: item.name,
    type: 'registry:component',
    title: item.title,
    description: item.description,
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files: item.files.map((path) => ({
      path: `src/kit/${path}`,
      type: 'registry:file',
      target: `${TARGET_DIR}/${path}`,
      content: readFileSync(join(ROOT, 'src/kit', path), 'utf8'),
    })),
  };
}

/** Every output file, keyed by its path relative to the output directory. */
export function buildKitRegistry(base = DEFAULT_BASE): Map<string, string> {
  const out = new Map<string, string>();
  for (const item of KIT_ITEMS) {
    out.set(`${item.name}.json`, `${JSON.stringify(itemJson(item, base), null, 2)}\n`);
  }
  const index = {
    $schema: SCHEMA_REGISTRY,
    name: 'webstylebook',
    homepage: 'https://webstylebook.com/pages/components',
    items: KIT_ITEMS.map((item) => {
      const { files, ...rest } = itemJson(item, base);
      return { ...rest, files: files.map(({ path, type, target }) => ({ path, type, target })) };
    }),
  };
  out.set('registry.json', `${JSON.stringify(index, null, 2)}\n`);
  return out;
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function main() {
  const check = process.argv.includes('--check');
  const base = argValue('--base') ?? DEFAULT_BASE;
  const outDir = resolve(argValue('--out') ?? join(ROOT, 'public/r'));
  const files = buildKitRegistry(base);

  if (check) {
    const stale = [...files].filter(([name, content]) => {
      const path = join(outDir, name);
      return !existsSync(path) || readFileSync(path, 'utf8') !== content;
    });
    if (stale.length) {
      console.error(`Kit registry is stale: ${stale.map(([name]) => name).join(', ')}. Run: npm run kit:registry`);
      process.exit(1);
    }
    console.log(`Kit registry is current (${files.size} files).`);
    return;
  }

  mkdirSync(outDir, { recursive: true });
  for (const [name, content] of files) writeFileSync(join(outDir, name), content);
  console.log(`Wrote ${files.size} files to ${outDir}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
