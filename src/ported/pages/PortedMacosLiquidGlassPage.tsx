import { useRef } from 'react';
import type { PortedStylePageProps } from '../registry';
import { usePortedCopyPrompt, usePortedPageEffects } from '../usePortedPageEffects';
import './PortedMacosLiquidGlassPage.css';

type Copy = {
  en: string;
  ko: string;
  ja: string;
};

const copy = (en: string, ko: string, ja: string): Copy => ({ en, ko, ja });

const promptText = {
  en: `Design a macOS 26 Liquid Glass interface using the official Apple Design Resources asset model.

SOURCE OF TRUTH:
- Base the design on the Apple macOS 26 UI Kit library structure: Symbols, Text Styles, Layer Styles, and Color Variables.
- Use component groups such as Menu Bar, Dock, Windows, Sidebar, Title Bar and Toolbar, Popover, Dialogs, Search Field, Segmented Controls, Toggles, and Sliders.
- Respect kit dimensions where visible: Menu Bar 1000x34, Dock 882x57, Titlebar 400x26, Toolbar with Tabs 400x59.

VISUAL RULES:
- Build a real macOS component surface, not a generic web landing page.
- Keep the first viewport dense, native, and component-led.
- Use SF Pro/system typography scale: LargeTitle 26, Title1 22, Title2 17, Title3 15, Headline 13, Body 13.
- Use Liquid Glass and Over-Glass styles only for chrome, menus, popovers, toolbars, Dock, and transient controls.
- Content areas should stay calm, mostly opaque, and legible.

COMPONENTS TO SHOW:
- Global menu bar with menu extras.
- A resizable app window with traffic lights, titlebar, toolbar with tabs, source-list sidebar, and inspector panel.
- Menu Bar light/dark specimens, Dock light/dark specimens, popover, dialog, search field, segmented controls, toggle, slider, and color wells.
- Asset-library labels: Symbols 3446, Text Styles 66, Layer Styles 174, Color Variables 118.

FORBIDDEN:
- Do not use Apple logos or copied Apple artwork.
- Do not use letter tiles as Dock icons.
- Do not make broad glassmorphism cards; use the official component taxonomy and native control proportions.`,
  ko: `Apple Design Resources의 공식 macOS 26 Liquid Glass asset 모델을 기준으로 인터페이스를 디자인해줘.

기준:
- Apple macOS 26 UI Kit 라이브러리 구조인 Symbols, Text Styles, Layer Styles, Color Variables를 기준으로 삼는다.
- Menu Bar, Dock, Windows, Sidebar, Title Bar and Toolbar, Popover, Dialogs, Search Field, Segmented Controls, Toggles, Sliders 같은 컴포넌트 그룹을 사용한다.
- 확인 가능한 kit 치수를 반영한다: Menu Bar 1000x34, Dock 882x57, Titlebar 400x26, Toolbar with Tabs 400x59.

시각 규칙:
- 일반 웹 랜딩 페이지가 아니라 실제 macOS 컴포넌트 표면처럼 만든다.
- 첫 화면은 조밀하고 네이티브하며 컴포넌트 중심이어야 한다.
- SF Pro/system 타이포 스케일: LargeTitle 26, Title1 22, Title2 17, Title3 15, Headline 13, Body 13.
- Liquid Glass와 Over-Glass 스타일은 chrome, menu, popover, toolbar, Dock, transient control에만 사용한다.
- 콘텐츠 영역은 차분하고 비교적 불투명하게 유지해 가독성을 지킨다.

보여줄 컴포넌트:
- 메뉴 extras가 있는 전역 Menu Bar.
- traffic lights, titlebar, tabs가 있는 toolbar, source-list sidebar, inspector panel을 가진 앱 윈도우.
- Menu Bar light/dark specimen, Dock light/dark specimen, popover, dialog, search field, segmented controls, toggle, slider, color wells.
- asset-library label: Symbols 3446, Text Styles 66, Layer Styles 174, Color Variables 118.

금지:
- Apple 로고나 Apple artwork를 복사하지 않는다.
- Dock 아이콘을 글자 타일로 만들지 않는다.
- 넓은 glassmorphism 카드로 만들지 말고, 공식 컴포넌트 taxonomy와 네이티브 control 비율을 사용한다.`,
  ja: `Apple Design Resourcesの公式macOS 26 Liquid Glass asset modelを基準にインターフェイスを設計してください。

Source of truth:
- Apple macOS 26 UI Kit library structure: Symbols, Text Styles, Layer Styles, Color Variablesを基準にする。
- Menu Bar、Dock、Windows、Sidebar、Title Bar and Toolbar、Popover、Dialogs、Search Field、Segmented Controls、Toggles、Slidersなどのcomponent groupを使う。
- 確認できるkit寸法を尊重する: Menu Bar 1000x34、Dock 882x57、Titlebar 400x26、Toolbar with Tabs 400x59。

Visual rules:
- 一般的なWeb landingではなく、実際のmacOS component surfaceとして作る。
- first viewportは密度があり、nativeで、component-ledにする。
- SF Pro/system typography scale: LargeTitle 26, Title1 22, Title2 17, Title3 15, Headline 13, Body 13.
- Liquid GlassとOver-Glassはchrome、menus、popovers、toolbars、Dock、transient controlsにだけ使う。
- content areasは落ち着いた不透明寄りの面にして可読性を保つ。

Components:
- menu extras付きglobal menu bar.
- traffic lights、titlebar、tabs付きtoolbar、source-list sidebar、inspector panelを持つapp window.
- Menu Bar light/dark specimens、Dock light/dark specimens、popover、dialog、search field、segmented controls、toggle、slider、color wells.
- asset-library labels: Symbols 3446, Text Styles 66, Layer Styles 174, Color Variables 118.

Forbidden:
- Apple logosやApple artworkをコピーしない。
- Dock iconを文字タイルにしない。
- 大きなglassmorphism cardsではなく、official component taxonomyとnative control proportionsを使う。`,
};

const libraryStats: Array<[string, string]> = [
  ['Symbols', '3,446'],
  ['Text Styles', '66'],
  ['Layer Styles', '174'],
  ['Color Variables', '118'],
];

type GroupItem = { name: string; count: string; active?: boolean };

const componentGroups: GroupItem[] = [
  { name: 'Menu Bar', count: '12' },
  { name: 'Dock', count: '18' },
  { name: 'Windows', count: '34' },
  { name: 'Sidebar', count: '21' },
  { name: 'Title Bar and Toolbar', count: '47', active: true },
  { name: 'Tab Bars', count: '13' },
  { name: 'Popover', count: '14' },
  { name: 'Dialogs', count: '9' },
  { name: 'Context Menus', count: '7' },
  { name: 'Search Field', count: '6' },
  { name: 'Segmented Controls', count: '11' },
  { name: 'Toggles', count: '4' },
  { name: 'Sliders', count: '8' },
  { name: 'Spotlight', count: '5' },
  { name: 'Control Center', count: '16' },
  { name: 'Notifications', count: '8' },
  { name: 'Widgets', count: '22' },
  { name: 'HUDs', count: '5' },
];

const layerStyles: Array<{ name: string; group: string; sample: string }> = [
  { name: 'Liquid Glass / Regular', group: 'Material', sample: 'glass-regular' },
  { name: 'Liquid Glass / Thick', group: 'Material', sample: 'glass-thick' },
  { name: 'Over-Glass / Popover', group: 'Material', sample: 'glass-over' },
  { name: 'Tinted Glass / Accent', group: 'Material', sample: 'glass-tint' },
  { name: 'HUD / Heavy', group: 'Material', sample: 'hud-heavy' },
  { name: 'Fill / Primary 10%', group: 'Fill', sample: 'fill-primary' },
  { name: 'Fill / Tertiary 4%', group: 'Fill', sample: 'fill-tertiary' },
  { name: 'Separator / Opaque', group: 'Separator', sample: 'sep-opaque' },
];

const colorVars: Array<[string, string, string]> = [
  ['Accent / Blue', '#0A84FF', 'accent-blue'],
  ['Accent / Green', '#30D158', 'accent-green'],
  ['Accent / Indigo', '#5E5CE6', 'accent-indigo'],
  ['Accent / Pink', '#FF375F', 'accent-pink'],
  ['Accent / Orange', '#FF9F0A', 'accent-orange'],
  ['System / Gray', '#8E8E93', 'accent-gray'],
];

const colorWells: Array<[string, string]> = [
  ['#0A84FF', 'Blue'],
  ['#30D158', 'Green'],
  ['#FF9F0A', 'Orange'],
  ['#FF375F', 'Pink'],
  ['#5E5CE6', 'Indigo'],
  ['#FFFFFF', 'White'],
];

function MultiText({ value }: { value: Copy }) {
  return (
    <>
      <span data-lang="en">{value.en}</span>
      <span data-lang="ko" hidden>{value.ko}</span>
      <span data-lang="ja" hidden>{value.ja}</span>
    </>
  );
}

type GlyphName =
  | 'search' | 'sidebar' | 'grid' | 'slider' | 'wifi' | 'battery'
  | 'chevron' | 'spark' | 'back' | 'forward' | 'share' | 'plus'
  | 'history' | 'info' | 'control-center' | 'apple-mark'
  | 'spotlight' | 'siri' | 'magnify-x'
  | 'bluetooth' | 'airdrop' | 'focus' | 'stage' | 'sun' | 'moon'
  | 'speaker' | 'mic' | 'play' | 'pause' | 'next' | 'bell'
  | 'globe' | 'lock' | 'cmd' | 'cloud' | 'thermo' | 'wand'
  | 'mail-glyph' | 'calendar-glyph' | 'document' | 'folder' | 'gear'
  | 'airplay' | 'screen-mirror' | 'arrow-up' | 'arrow-corner' | 'return'
  | 'star' | 'eye' | 'tag' | 'people' | 'rotate' | 'dots-h';

function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  const paths: Record<GlyphName, React.ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4" /></>,
    sidebar: <><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><path d="M9 4.5v15" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></>,
    slider: <><path d="M5 7h14" /><path d="M5 12h14" /><path d="M5 17h14" /><circle cx="9" cy="7" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="11" cy="17" r="2" /></>,
    wifi: <><path d="M3.5 10.5a10 10 0 0 1 17 0" /><path d="M6.5 13.5a6.5 6.5 0 0 1 11 0" /><path d="M9.5 16.3a3 3 0 0 1 5 0" /><circle cx="12" cy="18.4" r="1.1" fill="currentColor" stroke="none" /></>,
    battery: <><rect x="3" y="7.5" width="16" height="9" rx="2" /><path d="M21 11v2" /><rect x="5" y="9.5" width="9" height="5" rx="0.8" fill="currentColor" stroke="none" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    spark: <><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" /></>,
    back: <path d="m14 6-6 6 6 6" />,
    forward: <path d="m10 6 6 6-6 6" />,
    share: <><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    history: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
    info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none" /></>,
    'control-center': <><rect x="4" y="4" width="7" height="7" rx="1.4" /><rect x="13" y="4" width="7" height="7" rx="1.4" /><rect x="4" y="13" width="7" height="7" rx="1.4" /><rect x="13" y="13" width="7" height="7" rx="1.4" /></>,
    'apple-mark': <><circle cx="12" cy="12" r="9" /></>,
    spotlight: <><circle cx="11" cy="11" r="5.5" /><path d="m15 15 4 4" /></>,
    siri: <><circle cx="12" cy="12" r="8" /></>,
    'magnify-x': <><circle cx="11" cy="11" r="5.5" /><path d="m15 15 4 4" /><path d="m9 9 4 4M13 9l-4 4" strokeWidth="1.3" /></>,
    bluetooth: <path d="M8 8 16 16 12 20V4l4 4L8 16" />,
    airdrop: <><path d="M4.5 14a7.5 7.5 0 0 0 15 0" /><path d="M8 14a4 4 0 0 0 8 0" /><circle cx="12" cy="18" r="1.4" fill="currentColor" stroke="none" /></>,
    focus: <><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="3.6" fill="currentColor" stroke="none" /></>,
    stage: <><rect x="6" y="6" width="11" height="12" rx="2" /><path d="M18 8v8M20 10v4" /></>,
    sun: <><circle cx="12" cy="12" r="3.6" /><path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20M6.4 6.4l1.7 1.7M15.9 15.9l1.7 1.7M6.4 17.6l1.7-1.7M15.9 8.1l1.7-1.7" /></>,
    moon: <path d="M20 14a8 8 0 1 1-9-9 6.4 6.4 0 0 0 9 9z" />,
    speaker: <><path d="M5 10v4h3l4 3.4V6.6L8 10H5z" /><path d="M16 9.4c1.4 1 1.4 4.2 0 5.2" /><path d="M18.4 7c2.4 1.8 2.4 8.2 0 10" /></>,
    mic: <><rect x="9" y="4" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v2.5" /></>,
    play: <path d="M7.5 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
    pause: <><rect x="7.5" y="5.5" width="2.8" height="13" rx="0.6" fill="currentColor" stroke="none" /><rect x="13.7" y="5.5" width="2.8" height="13" rx="0.6" fill="currentColor" stroke="none" /></>,
    next: <><path d="M6.5 5.5v13l9.5-6.5z" fill="currentColor" stroke="none" /><rect x="16.5" y="5.5" width="2" height="13" rx="0.4" fill="currentColor" stroke="none" /></>,
    bell: <><path d="M6 17V11a6 6 0 0 1 12 0v6h1l-1 2H6l-1-2z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
    globe: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" /></>,
    lock: <><rect x="6" y="11" width="12" height="9" rx="2" /><path d="M9 11V8a3 3 0 1 1 6 0v3" /></>,
    cmd: <path d="M9 9V7a2 2 0 1 0-2 2h2zm0 0v6m0-6h6m0 0V7a2 2 0 1 1 2 2h-2zm0 0v6m0 0h-6m0 0v2a2 2 0 1 1-2-2h2zm6 0v2a2 2 0 1 0 2-2h-2z" />,
    cloud: <path d="M7.5 17a4 4 0 1 1 1-7 5 5 0 0 1 9 1 3.5 3.5 0 0 1-1 6h-9z" />,
    thermo: <><path d="M12 3.5a2 2 0 0 1 2 2v9.4a3.6 3.6 0 1 1-4 0V5.5a2 2 0 0 1 2-2z" /><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" /></>,
    wand: <><path d="m5 19 10.5-10.5" /><path d="m14 3 .9 2.2L17 6l-2.2.9L14 9l-.9-2.2L11 6l2.1-.8z" fill="currentColor" stroke="none" /></>,
    'mail-glyph': <><rect x="4" y="6" width="16" height="12" rx="2" /><path d="m5 8 7 5 7-5" /></>,
    'calendar-glyph': <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M4 9h16M9 3v4M15 3v4" /></>,
    document: <><path d="M7 4h7l4 4v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M14 4v4h4" /></>,
    folder: <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h4l2 2H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19H5.5A1.5 1.5 0 0 1 4 17.5z" />,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2 2M15.7 15.7l2 2M6.3 17.7l2-2M15.7 8.3l2-2" /></>,
    airplay: <><path d="M4 6h16v10h-3" /><path d="M8 20l4-5 4 5z" fill="currentColor" stroke="none" /></>,
    'screen-mirror': <><rect x="3" y="5" width="18" height="11" rx="2" /><path d="M8 20h8M12 16v4" /></>,
    'arrow-up': <><path d="M12 5v14" /><path d="m6 11 6-6 6 6" /></>,
    'arrow-corner': <><path d="M8 5h11v11" /><path d="M19 5 5 19" /></>,
    return: <><path d="M19 6v4a3 3 0 0 1-3 3H6" /><path d="m9 10-3 3 3 3" /></>,
    star: <path d="m12 4 2.4 5 5.6.6-4.3 3.7 1.3 5.5-5-2.8-5 2.8 1.3-5.5L4 9.6 9.6 9z" fill="currentColor" stroke="none" />,
    eye: <><path d="M2.5 12s4-6.5 9.5-6.5 9.5 6.5 9.5 6.5-4 6.5-9.5 6.5S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>,
    tag: <><path d="M4 4v6l9 9 6-6-9-9H4z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" /></>,
    people: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="9" r="2.4" /><path d="M14.5 17.5a4.6 4.6 0 0 1 7 1.5" /></>,
    rotate: <><path d="M4 12a8 8 0 1 0 3-6.2" /><path d="M4 4v5h5" /></>,
    'dots-h': <><circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Stoplights({ size = 'normal' }: { size?: 'normal' | 'small' }) {
  return (
    <div className={`mlg-stoplights mlg-stoplights--${size}`} aria-label="Window controls">
      <i className="is-red"><svg viewBox="0 0 12 12"><path d="M3.6 3.6 8.4 8.4M8.4 3.6 3.6 8.4" /></svg></i>
      <i className="is-yellow"><svg viewBox="0 0 12 12"><path d="M3.4 6h5.2" /></svg></i>
      <i className="is-green"><svg viewBox="0 0 12 12"><path d="M3.6 3.6h2.6v2.6M8.4 8.4H5.8V5.8" /></svg></i>
    </div>
  );
}

type AppIcon =
  | 'browser' | 'mail' | 'maps' | 'photos' | 'messages'
  | 'music' | 'calendar' | 'camera' | 'terminal' | 'settings'
  | 'finder' | 'notes';

function DockAppIcon({ kind }: { kind: AppIcon }) {
  const symbols: Record<AppIcon, React.ReactNode> = {
    finder: (
      <g>
        <path d="M14 13c0-2 2-3 4-3" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M26 13c0-2 2-3 4-3" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M14 26c2 3 6 4 8 4s6-1 8-4" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
    ),
    browser: (
      <g>
        <circle cx="22" cy="22" r="11" fill="#fff" />
        <path d="M22 11v22M11 22h22" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
        <path d="m22 12 3 10-10 3 10-3-3-10z" fill="#ff3b30" />
        <path d="m22 32-3-10 10-3-10 3 3 10z" fill="#c7c7cc" />
        <circle cx="22" cy="22" r="2" fill="#fff" stroke="#1d1d1f" strokeWidth="0.7" />
      </g>
    ),
    mail: (
      <g>
        <rect x="9" y="14" width="26" height="16" rx="3.2" fill="#fff" />
        <path d="m10 16 12 9 12-9" stroke="#0a84ff" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      </g>
    ),
    maps: (
      <g>
        <path d="M22 11c-4 0-7 3-7 7 0 5 7 14 7 14s7-9 7-14c0-4-3-7-7-7z" fill="#ff453a" />
        <circle cx="22" cy="19" r="3.5" fill="#fff" />
        <path d="M22 33c0-2.2 4-3.4 7-3.4M22 33c0-2.2-4-3.4-7-3.4" stroke="#fff" strokeWidth="1.5" opacity="0.5" />
      </g>
    ),
    photos: (
      <g>
        <circle cx="22" cy="22" r="6.5" fill="#ff3b30" />
        <circle cx="22" cy="22" r="6.5" fill="#ff9f0a" transform="rotate(60 22 22)" opacity="0.85" />
        <circle cx="22" cy="22" r="6.5" fill="#ffcc00" transform="rotate(120 22 22)" opacity="0.85" />
        <circle cx="22" cy="22" r="6.5" fill="#30d158" transform="rotate(180 22 22)" opacity="0.85" />
        <circle cx="22" cy="22" r="6.5" fill="#0a84ff" transform="rotate(240 22 22)" opacity="0.85" />
        <circle cx="22" cy="22" r="6.5" fill="#bf5af2" transform="rotate(300 22 22)" opacity="0.85" />
        <circle cx="22" cy="22" r="2.4" fill="#fff" />
      </g>
    ),
    messages: (
      <g>
        <path d="M22 11c-7.2 0-13 4.8-13 10.8 0 3.4 1.8 6.4 4.7 8.4-.4 1.5-1.4 3-2.7 4 2.4-.2 5.4-1.2 7.4-2.6 1.1.2 2.3.3 3.6.3 7.2 0 13-4.8 13-10.8S29.2 11 22 11z" fill="#fff" />
      </g>
    ),
    music: (
      <g>
        <path d="M28 13v13.5c0 2-1.8 3.5-4 3.5s-4-1.5-4-3.5 1.8-3.5 4-3.5c.7 0 1.4.2 2 .4V17l-7 1.6v9.4c0 2-1.8 3.5-4 3.5s-4-1.5-4-3.5 1.8-3.5 4-3.5c.7 0 1.4.2 2 .4v-9.6L28 13z" fill="#fff" />
      </g>
    ),
    calendar: (
      <g>
        <rect x="10" y="12" width="24" height="22" rx="3" fill="#fff" />
        <rect x="10" y="12" width="24" height="6" rx="3" fill="#ff453a" />
        <text x="22" y="29.5" textAnchor="middle" fontFamily="system-ui" fontWeight="700" fontSize="11" fill="#1c1c1e">14</text>
        <text x="22" y="17" textAnchor="middle" fontFamily="system-ui" fontWeight="700" fontSize="5" fill="#fff" letterSpacing="0.6">WED</text>
      </g>
    ),
    camera: (
      <g>
        <rect x="9" y="14" width="26" height="16" rx="3" fill="#1c1c1e" />
        <circle cx="22" cy="22" r="5.4" fill="none" stroke="#fff" strokeWidth="1.4" />
        <circle cx="22" cy="22" r="2.8" fill="#fff" />
        <circle cx="31" cy="17.6" r="1.1" fill="#fff" />
      </g>
    ),
    terminal: (
      <g>
        <rect x="9" y="12" width="26" height="20" rx="3" fill="#1c1c1e" />
        <path d="m14 18 4 4-4 4" stroke="#34c759" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 28h8" stroke="#34c759" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ),
    settings: (
      <g>
        <circle cx="22" cy="22" r="11" fill="#e5e5ea" />
        <g fill="#8e8e93">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="21" y="11.5" width="2" height="3.2" rx="0.6" transform={`rotate(${i * 45} 22 22)`} />
          ))}
        </g>
        <circle cx="22" cy="22" r="4.2" fill="#fff" />
      </g>
    ),
    notes: (
      <g>
        <rect x="10" y="11" width="24" height="22" rx="3" fill="#fff" />
        <rect x="10" y="11" width="24" height="4" fill="#ffcc00" />
        <path d="M14 21h16M14 25h16M14 29h10" stroke="#d4d4d8" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    ),
  };

  const bg: Record<AppIcon, string> = {
    finder: 'linear-gradient(180deg, #6da5ff 0%, #1971ff 100%)',
    browser: 'linear-gradient(180deg, #6abfff 0%, #1a6ff5 100%)',
    mail: 'linear-gradient(180deg, #62baff 0%, #0a84ff 100%)',
    maps: 'linear-gradient(180deg, #95eb88 0%, #34c759 100%)',
    photos: 'linear-gradient(180deg, #ffffff 0%, #f2f2f7 100%)',
    messages: 'linear-gradient(180deg, #58d959 0%, #2bb24c 100%)',
    music: 'linear-gradient(180deg, #ff7a8e 0%, #ff2d55 100%)',
    calendar: 'linear-gradient(180deg, #ffffff 0%, #f2f2f7 100%)',
    camera: 'linear-gradient(180deg, #a5a5a5 0%, #545454 100%)',
    terminal: 'linear-gradient(180deg, #4a4a4a 0%, #0c0c0c 100%)',
    settings: 'linear-gradient(180deg, #b9b9bf 0%, #6e6e73 100%)',
    notes: 'linear-gradient(180deg, #fff2a8 0%, #ffd60a 100%)',
  };

  return (
    <span className="mlg-dock-icon" style={{ background: bg[kind] }}>
      <svg viewBox="0 0 44 44" aria-hidden="true">{symbols[kind]}</svg>
    </span>
  );
}

function MenuBarSpecimen({ tone }: { tone: 'dark' | 'light' }) {
  return (
    <div className={`mlg-specimen-menubar mlg-specimen-menubar--${tone}`}>
      <div className="mlg-mb-left">
        <Glyph name="apple-mark" className="mlg-mb-apple" />
        <strong>Stylebook</strong>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span>
        <span>Help</span>
      </div>
      <div className="mlg-mb-right">
        <Glyph name="search" />
        <Glyph name="control-center" />
        <Glyph name="siri" />
        <Glyph name="battery" />
        <Glyph name="wifi" />
        <span className="mlg-mb-clock">Wed 4:24 PM</span>
      </div>
    </div>
  );
}

const dockApps: AppIcon[] = ['finder', 'browser', 'mail', 'maps', 'photos', 'messages', 'music', 'calendar', 'notes', 'terminal', 'settings'];

function DockSpecimen({ tone }: { tone: 'dark' | 'light' }) {
  return (
    <div className={`mlg-specimen-dock mlg-specimen-dock--${tone}`}>
      <div className="mlg-dock-tray">
        {dockApps.map((app, i) => (
          <span className="mlg-dock-slot" key={app}>
            <DockAppIcon kind={app} />
            {i === 1 || i === 5 ? <i className="mlg-dock-indicator" /> : null}
          </span>
        ))}
        <span className="mlg-dock-divider" />
        <span className="mlg-dock-slot">
          <span className="mlg-dock-icon mlg-dock-icon--bin">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <rect x="13" y="14" width="18" height="3" rx="1.4" fill="#fff" />
              <rect x="15" y="17" width="14" height="15" rx="2" fill="none" stroke="#fff" strokeWidth="1.6" />
              <path d="M19 21v8M22 21v8M25 21v8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
}

function ToolbarWindowSpecimen() {
  return (
    <div className="mlg-specimen-window">
      <div className="mlg-spec-titlebar">
        <Stoplights size="small" />
        <span className="mlg-spec-title">Components</span>
        <span className="mlg-spec-spacer" />
      </div>
      <div className="mlg-spec-toolbar">
        <button type="button" aria-label="Sidebar"><Glyph name="sidebar" /></button>
        <div className="mlg-spec-nav-group">
          <button type="button" aria-label="Back"><Glyph name="back" /></button>
          <button type="button" aria-label="Forward"><Glyph name="forward" /></button>
        </div>
        <div className="mlg-spec-tabs">
          <span className="is-active">Symbols</span>
          <span>Styles</span>
          <span>Variables</span>
        </div>
        <label className="mlg-spec-search">
          <Glyph name="search" />
          <input aria-label="Search components" placeholder="Search Components" />
        </label>
        <button type="button" aria-label="Share"><Glyph name="share" /></button>
      </div>
    </div>
  );
}

function PopoverSpecimen() {
  return (
    <div className="mlg-specimen-popover" role="presentation">
      <div className="mlg-popover-arrow" />
      <div className="mlg-popover-body">
        <p className="mlg-popover-title">Layer Styles</p>
        <ul>
          <li><span className="mlg-pop-swatch mlg-pop-swatch--glass" /> Liquid Glass / Regular</li>
          <li><span className="mlg-pop-swatch mlg-pop-swatch--thick" /> Liquid Glass / Thick</li>
          <li className="is-active"><span className="mlg-pop-swatch mlg-pop-swatch--over" /> Over-Glass / Popover</li>
          <li><span className="mlg-pop-swatch mlg-pop-swatch--fill" /> Fill / Primary 10%</li>
        </ul>
      </div>
    </div>
  );
}

function DialogSpecimen() {
  return (
    <div className="mlg-specimen-dialog" role="presentation">
      <div className="mlg-dialog-icon">
        <span><Glyph name="info" /></span>
      </div>
      <div className="mlg-dialog-body">
        <strong>
          <MultiText value={copy(
            'Replace generic glass cards?',
            '일반 글래스 카드를 교체할까요?',
            '一般的なグラスカードを置き換えますか?',
          )} />
        </strong>
        <p>
          <MultiText value={copy(
            'Use system components so chrome stays Liquid Glass while content areas remain legible.',
            '시스템 컴포넌트를 사용하면 크롬은 Liquid Glass로 유지되고 콘텐츠 영역은 가독성을 지킬 수 있습니다.',
            'システムコンポーネントを使うと、クロームはLiquid Glassのまま、コンテンツ領域は可読性を保てます。',
          )} />
        </p>
      </div>
      <div className="mlg-dialog-actions">
        <button type="button" className="is-secondary">
          <MultiText value={copy('Cancel', '취소', 'キャンセル')} />
        </button>
        <button type="button" className="is-primary">
          <MultiText value={copy('Replace', '교체', '置き換え')} />
        </button>
      </div>
    </div>
  );
}

function SegmentedSpecimen() {
  return (
    <div className="mlg-spec-segmented" role="tablist">
      <button className="is-active" type="button">
        <MultiText value={copy('Icons', '아이콘', 'アイコン')} />
      </button>
      <button type="button">
        <MultiText value={copy('List', '목록', 'リスト')} />
      </button>
      <button type="button">
        <MultiText value={copy('Columns', '열', 'カラム')} />
      </button>
      <button type="button">
        <MultiText value={copy('Gallery', '갤러리', 'ギャラリー')} />
      </button>
    </div>
  );
}

function ToggleRow({ label, on }: { label: Copy; on?: boolean }) {
  return (
    <div className="mlg-control-row">
      <span><MultiText value={label} /></span>
      <label className="mlg-switch">
        <input defaultChecked={on} type="checkbox" />
        <i />
      </label>
    </div>
  );
}

function SliderRow({ label, value }: { label: Copy; value: number }) {
  return (
    <div className="mlg-slider-row">
      <span><MultiText value={label} /></span>
      <div className="mlg-slider" style={{ ['--mlg-slider-fill' as string]: `${value}%` }}>
        <i className="mlg-slider-thumb" />
      </div>
    </div>
  );
}

function SearchFieldSpecimen() {
  return (
    <label className="mlg-spec-searchfield">
      <Glyph name="search" />
      <input aria-label="Search" placeholder="Search" defaultValue="Liquid Glass" />
      <Glyph name="magnify-x" className="mlg-search-clear" />
    </label>
  );
}

function ColorWellRow() {
  return (
    <div className="mlg-color-wells">
      {colorWells.map(([hex, label]) => (
        <span key={hex} className="mlg-color-well" title={label}>
          <span className="mlg-color-well__chip" style={{ background: hex }} />
        </span>
      ))}
    </div>
  );
}

function LayerSampleSwatch({ kind }: { kind: string }) {
  return <span className={`mlg-layer-swatch mlg-layer-swatch--${kind}`} />;
}

/* ---------- Tahoe additions ---------- */

function SpotlightSpecimen() {
  return (
    <div className="mlg-specimen-spotlight" role="presentation">
      <div className="mlg-spot-field">
        <Glyph name="search" />
        <span className="mlg-spot-query">
          <MultiText value={copy('liquid glass', 'liquid glass', 'liquid glass')} />
          <i className="mlg-spot-caret" />
        </span>
        <kbd className="mlg-spot-kbd">
          <Glyph name="cmd" />
          <span>K</span>
        </kbd>
      </div>
      <div className="mlg-spot-divider" />
      <div className="mlg-spot-body">
        <div className="mlg-spot-results">
          <p className="mlg-spot-section">
            <MultiText value={copy('Top Hit', '최상위 결과', 'トップヒット')} />
          </p>
          <ul>
            <li className="is-active">
              <span className="mlg-spot-icon mlg-spot-icon--doc"><Glyph name="document" /></span>
              <div>
                <strong>Liquid Glass — Design Notes.md</strong>
                <span>
                  <MultiText value={copy(
                    'Documents · Modified 12 min ago',
                    '문서 · 12분 전 수정',
                    'ドキュメント · 12分前に編集',
                  )} />
                </span>
              </div>
              <kbd>↩</kbd>
            </li>
            <li>
              <span className="mlg-spot-icon mlg-spot-icon--app"><Glyph name="wand" /></span>
              <div>
                <strong>
                  <MultiText value={copy('Run Shortcut · Tint Wallpaper', '단축어 실행 · 배경화면 톤 조정', 'ショートカット実行 · 壁紙の色調整')} />
                </strong>
                <span>
                  <MultiText value={copy('Shortcut · Quick Action', '단축어 · 빠른 작업', 'ショートカット · クイック操作')} />
                </span>
              </div>
              <kbd>⏎</kbd>
            </li>
          </ul>

          <p className="mlg-spot-section">
            <MultiText value={copy('Suggestions', '추천', '候補')} />
          </p>
          <ul>
            <li>
              <span className="mlg-spot-icon mlg-spot-icon--web"><Glyph name="globe" /></span>
              <div>
                <strong>
                  <MultiText value={copy('Apple Design Resources — Liquid Glass', 'Apple Design Resources — Liquid Glass', 'Apple Design Resources — Liquid Glass')} />
                </strong>
                <span>developer.apple.com</span>
              </div>
            </li>
            <li>
              <span className="mlg-spot-icon mlg-spot-icon--folder"><Glyph name="folder" /></span>
              <div>
                <strong>Glass / Component Library</strong>
                <span>
                  <MultiText value={copy('iCloud Drive · 24 items', 'iCloud Drive · 항목 24개', 'iCloud Drive · 24件')} />
                </span>
              </div>
            </li>
            <li>
              <span className="mlg-spot-icon mlg-spot-icon--calc">≡</span>
              <div>
                <strong>3,446 × 174 = 599,604</strong>
                <span>
                  <MultiText value={copy('Calculator', '계산기', '計算機')} />
                </span>
              </div>
              <kbd>⌘C</kbd>
            </li>
          </ul>
        </div>
        <aside className="mlg-spot-preview">
          <div className="mlg-spot-preview-head">
            <span className="mlg-spot-icon mlg-spot-icon--doc"><Glyph name="document" /></span>
            <div>
              <strong>Liquid Glass — Design Notes.md</strong>
              <span>
                <MultiText value={copy('1,248 words · Markdown', '1,248 단어 · Markdown', '1,248 ワード · Markdown')} />
              </span>
            </div>
          </div>
          <p className="mlg-spot-preview-line">## Materials</p>
          <p className="mlg-spot-preview-body">
            Liquid Glass scales through three densities — Regular, Thick, Over-Glass —
            each tuned for chrome, transient surfaces, and over-content alerts.
          </p>
          <div className="mlg-spot-preview-tags">
            <span><Glyph name="tag" /> design-system</span>
            <span><Glyph name="people" /> shared · 3</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

type CCTile = { icon: GlyphName; title: Copy; sub?: Copy; active?: boolean };

function ControlCenterSpecimen() {
  const conn: CCTile[] = [
    { icon: 'wifi', title: copy('Wi-Fi', 'Wi-Fi', 'Wi-Fi'), sub: copy('Studio · 5GHz', '스튜디오 · 5GHz', 'スタジオ · 5GHz'), active: true },
    { icon: 'bluetooth', title: copy('Bluetooth', '블루투스', 'Bluetooth'), sub: copy('On', '켜짐', 'オン'), active: true },
    { icon: 'airdrop', title: copy('AirDrop', 'AirDrop', 'AirDrop'), sub: copy('Contacts Only', '연락처만', '連絡先のみ') },
  ];

  const quick: CCTile[] = [
    { icon: 'focus', title: copy('Focus', '집중 모드', '集中モード'), sub: copy('Work', '업무', '仕事'), active: true },
    { icon: 'stage', title: copy('Stage Manager', '스테이지 매니저', 'ステージマネージャ') },
    { icon: 'screen-mirror', title: copy('Screen Mirror', '화면 미러링', '画面ミラーリング') },
    { icon: 'airplay', title: copy('AirPlay', 'AirPlay', 'AirPlay') },
  ];

  return (
    <div className="mlg-specimen-cc" role="presentation">
      <div className="mlg-cc-group">
        {conn.map((tile) => (
          <button className={`mlg-cc-tile ${tile.active ? 'is-active' : ''}`} type="button" key={tile.icon}>
            <span className="mlg-cc-tile-icon"><Glyph name={tile.icon} /></span>
            <div>
              <strong><MultiText value={tile.title} /></strong>
              {tile.sub ? <span><MultiText value={tile.sub} /></span> : null}
            </div>
            <Glyph name="chevron" className="mlg-cc-tile-chevron" />
          </button>
        ))}
      </div>

      <div className="mlg-cc-quick">
        {quick.map((tile) => (
          <button className={`mlg-cc-quick-tile ${tile.active ? 'is-active' : ''}`} type="button" key={tile.icon}>
            <span className="mlg-cc-quick-icon"><Glyph name={tile.icon} /></span>
            <strong><MultiText value={tile.title} /></strong>
            {tile.sub ? <span><MultiText value={tile.sub} /></span> : null}
          </button>
        ))}
      </div>

      <div className="mlg-cc-slider-block">
        <div className="mlg-cc-slider">
          <span className="mlg-cc-slider-label">
            <MultiText value={copy('Display', '디스플레이', 'ディスプレイ')} />
          </span>
          <div className="mlg-cc-track" style={{ ['--mlg-cc-fill' as string]: '72%' }}>
            <Glyph name="sun" className="mlg-cc-track-icon" />
          </div>
        </div>
        <div className="mlg-cc-slider">
          <span className="mlg-cc-slider-label">
            <MultiText value={copy('Sound', '사운드', 'サウンド')} />
          </span>
          <div className="mlg-cc-track" style={{ ['--mlg-cc-fill' as string]: '46%' }}>
            <Glyph name="speaker" className="mlg-cc-track-icon" />
          </div>
        </div>
      </div>

      <div className="mlg-cc-now-playing">
        <span className="mlg-cc-np-art" aria-hidden="true">
          <span className="mlg-cc-np-pulse" />
        </span>
        <div className="mlg-cc-np-meta">
          <strong>
            <MultiText value={copy('Aurora Drift', '오로라 드리프트', 'オーロラドリフト')} />
          </strong>
          <span>Glass Sessions · Vol. 2</span>
        </div>
        <div className="mlg-cc-np-actions">
          <button type="button" aria-label="Previous"><Glyph name="next" className="mlg-cc-np-prev" /></button>
          <button type="button" className="is-play" aria-label="Pause"><Glyph name="pause" /></button>
          <button type="button" aria-label="Next"><Glyph name="next" /></button>
        </div>
      </div>
    </div>
  );
}

type NotificationItem = {
  app: 'mail' | 'calendar' | 'messages';
  title: Copy;
  body: Copy;
  time: Copy;
};

function NotificationStackSpecimen() {
  const items: NotificationItem[] = [
    {
      app: 'calendar',
      title: copy('Standup · Design Systems', '스탠드업 · 디자인 시스템', 'スタンドアップ · デザインシステム'),
      body: copy('In 5 minutes · Conference Room 3', '5분 후 · 회의실 3', '5分後 · 会議室3'),
      time: copy('now', '지금', 'たった今'),
    },
    {
      app: 'mail',
      title: copy('Hana Park', '박하나', 'パク・ハナ'),
      body: copy(
        'Re: macOS 26 component review — let me know when you have time to chat',
        'Re: macOS 26 컴포넌트 리뷰 — 시간 되실 때 말씀 주세요',
        'Re: macOS 26 コンポーネントレビュー — お時間ある時にご連絡ください',
      ),
      time: copy('2m ago', '2분 전', '2分前'),
    },
    {
      app: 'messages',
      title: copy('Jamie · iMessage', 'Jamie · iMessage', 'Jamie · iMessage'),
      body: copy(
        'I pushed the popover tweaks — looks much better with the over-glass tint',
        '팝오버 수정 푸시했어 — over-glass 톤이랑 훨씬 잘 어울려',
        'ポップオーバーの修正をプッシュしたよ — over-glass の色合いに合うようになった',
      ),
      time: copy('8m ago', '8분 전', '8分前'),
    },
  ];

  const appBadge: Record<NotificationItem['app'], { bg: string; glyph: GlyphName }> = {
    mail: { bg: 'linear-gradient(180deg, #62baff 0%, #0a84ff 100%)', glyph: 'mail-glyph' },
    calendar: { bg: 'linear-gradient(180deg, #ff7a8e 0%, #ff453a 100%)', glyph: 'calendar-glyph' },
    messages: { bg: 'linear-gradient(180deg, #58d959 0%, #2bb24c 100%)', glyph: 'bell' },
  };

  return (
    <div className="mlg-specimen-notifs" role="presentation">
      {items.map((item, i) => (
        <article className="mlg-notif" data-depth={i} key={item.app}>
          <span className="mlg-notif-icon" style={{ background: appBadge[item.app].bg }}>
            <Glyph name={appBadge[item.app].glyph} />
          </span>
          <div className="mlg-notif-body">
            <header>
              <strong><MultiText value={item.title} /></strong>
              <span className="mlg-notif-time"><MultiText value={item.time} /></span>
            </header>
            <p><MultiText value={item.body} /></p>
          </div>
        </article>
      ))}
      <button type="button" className="mlg-notif-clear">
        <MultiText value={copy('Clear All', '모두 지우기', 'すべて消去')} />
      </button>
    </div>
  );
}

function WidgetClock() {
  const ticks = Array.from({ length: 12 });
  return (
    <div className="mlg-widget mlg-widget--clock">
      <div className="mlg-widget-head">
        <span>San Francisco</span>
        <em>9:41 AM</em>
      </div>
      <div className="mlg-clock-face" aria-hidden="true">
        {ticks.map((_, i) => (
          <i key={i} className="mlg-clock-tick" style={{ transform: `rotate(${i * 30}deg)` }} />
        ))}
        <i className="mlg-clock-hand mlg-clock-hand--hour" />
        <i className="mlg-clock-hand mlg-clock-hand--minute" />
        <i className="mlg-clock-hand mlg-clock-hand--second" />
        <i className="mlg-clock-cap" />
      </div>
    </div>
  );
}

function WidgetWeather() {
  const forecast: Array<{ hour: string; icon: GlyphName; t: string }> = [
    { hour: 'Now', icon: 'sun', t: '22°' },
    { hour: '11AM', icon: 'sun', t: '23°' },
    { hour: '12PM', icon: 'cloud', t: '23°' },
    { hour: '1PM', icon: 'cloud', t: '22°' },
    { hour: '2PM', icon: 'cloud', t: '21°' },
  ];
  return (
    <div className="mlg-widget mlg-widget--weather">
      <div className="mlg-weather-head">
        <span className="mlg-weather-place">San Francisco</span>
        <span className="mlg-weather-now">
          <Glyph name="sun" />
          <strong>22°</strong>
        </span>
        <span className="mlg-weather-cond">
          <MultiText value={copy('Mostly Sunny', '대체로 맑음', '主に晴れ')} /> · H:24° L:14°
        </span>
      </div>
      <div className="mlg-weather-forecast">
        {forecast.map((f) => (
          <span key={f.hour}>
            <em>{f.hour}</em>
            <Glyph name={f.icon} />
            <strong>{f.t}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function WidgetCalendar() {
  return (
    <div className="mlg-widget mlg-widget--calendar">
      <div className="mlg-cal-head">
        <span>
          <MultiText value={copy('WEDNESDAY', '수요일', '水曜日')} />
        </span>
        <strong>14</strong>
      </div>
      <ul className="mlg-cal-events">
        <li className="mlg-cal-event mlg-cal-event--rose">
          <span className="mlg-cal-bar" />
          <div>
            <strong>
              <MultiText value={copy('Design Sync', '디자인 싱크', 'デザイン同期')} />
            </strong>
            <span>10:30 — 11:00 AM · Conf 3</span>
          </div>
        </li>
        <li className="mlg-cal-event mlg-cal-event--blue">
          <span className="mlg-cal-bar" />
          <div>
            <strong>
              <MultiText value={copy('1:1 with Hana', '하나와 1:1', 'ハナと 1:1')} />
            </strong>
            <span>1:30 — 2:00 PM</span>
          </div>
        </li>
        <li className="mlg-cal-event mlg-cal-event--green">
          <span className="mlg-cal-bar" />
          <div>
            <strong>
              <MultiText value={copy('Glass Library Review', '글래스 라이브러리 리뷰', 'グラスライブラリレビュー')} />
            </strong>
            <span>4:00 — 5:00 PM · Zoom</span>
          </div>
        </li>
      </ul>
    </div>
  );
}

function TabBarSpecimen() {
  type Tab = { title: Copy; host: string; favicon: GlyphName; tint: string; active?: boolean };
  const tabs: Tab[] = [
    { title: copy('Apple Design Resources', 'Apple Design Resources', 'Apple Design Resources'), host: 'developer.apple.com', favicon: 'apple-mark', tint: '#5e5ce6', active: true },
    { title: copy('Liquid Glass — WWDC 26', 'Liquid Glass — WWDC 26', 'Liquid Glass — WWDC 26'), host: 'developer.apple.com', favicon: 'spark', tint: '#0a84ff' },
    { title: copy('Component Library', '컴포넌트 라이브러리', 'コンポーネントライブラリ'), host: 'figma.com', favicon: 'grid', tint: '#ff453a' },
    { title: copy('Inbox · 12 new', '받은편지함 · 12 new', '受信箱 · 12件'), host: 'mail.app', favicon: 'mail-glyph', tint: '#30d158' },
  ];

  return (
    <div className="mlg-specimen-tabbar">
      <div className="mlg-tab-titlebar">
        <Stoplights size="small" />
        <div className="mlg-tab-strip">
          {tabs.map((t) => (
            <span className={`mlg-tab ${t.active ? 'is-active' : ''}`} key={t.host + t.title.en}>
              <span className="mlg-tab-fav" style={{ color: t.tint }}>
                <Glyph name={t.favicon} />
              </span>
              <span className="mlg-tab-label">
                <MultiText value={t.title} />
              </span>
              <span className="mlg-tab-x" aria-hidden="true">
                <Glyph name="magnify-x" />
              </span>
            </span>
          ))}
          <span className="mlg-tab-add" aria-hidden="true">
            <Glyph name="plus" />
          </span>
        </div>
      </div>
      <div className="mlg-tab-omnibar">
        <button type="button" aria-label="Back"><Glyph name="back" /></button>
        <button type="button" aria-label="Forward"><Glyph name="forward" /></button>
        <button type="button" aria-label="Reload"><Glyph name="rotate" /></button>
        <div className="mlg-tab-url">
          <Glyph name="lock" />
          <span>developer.apple.com<i>/design/resources/macos</i></span>
          <Glyph name="airdrop" />
        </div>
        <button type="button" aria-label="Share"><Glyph name="share" /></button>
        <button type="button" aria-label="Add"><Glyph name="plus" /></button>
      </div>
    </div>
  );
}

function ContextMenuSpecimen() {
  type MenuItem =
    | { kind: 'item'; label: Copy; shortcut?: string; active?: boolean; destructive?: boolean }
    | { kind: 'divider' };

  const items: MenuItem[] = [
    { kind: 'item', label: copy('Open', '열기', '開く'), shortcut: '⌘O' },
    { kind: 'item', label: copy('Open With ▸', '다음으로 열기 ▸', '別のアプリで開く ▸') },
    { kind: 'divider' },
    { kind: 'item', label: copy('Quick Look', '훑어보기', 'クイックルック'), shortcut: '␣' },
    { kind: 'item', label: copy('Copy "Liquid Glass.md"', '"Liquid Glass.md" 복사', '"Liquid Glass.md" をコピー'), shortcut: '⌘C', active: true },
    { kind: 'item', label: copy('Duplicate', '복제', '複製'), shortcut: '⌘D' },
    { kind: 'divider' },
    { kind: 'item', label: copy('Get Info', '정보 가져오기', '情報を見る'), shortcut: '⌘I' },
    { kind: 'item', label: copy('Tags…', '태그…', 'タグ…') },
    { kind: 'item', label: copy('Compress', '압축', '圧縮') },
    { kind: 'divider' },
    { kind: 'item', label: copy('Move to Bin', '휴지통으로 이동', 'ゴミ箱に入れる'), shortcut: '⌘⌫', destructive: true },
  ];

  return (
    <div className="mlg-specimen-ctxmenu" role="presentation">
      <ul>
        {items.map((it, i) => it.kind === 'divider' ? (
          <li key={`d${i}`} className="mlg-ctx-divider" aria-hidden="true" />
        ) : (
          <li key={i} className={`mlg-ctx-item ${it.active ? 'is-active' : ''} ${it.destructive ? 'is-destructive' : ''}`}>
            <span><MultiText value={it.label} /></span>
            {it.shortcut ? <kbd>{it.shortcut}</kbd> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PortedMacosLiquidGlassPage({ lang }: PortedStylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePortedPageEffects(rootRef, lang);
  const handleCopyPrompt = usePortedCopyPrompt(lang);

  return (
    <div ref={rootRef} className="ported-style-page ported-style-page--macos-liquid-glass">
      <div className="mlg-wallpaper" aria-hidden="true">
        <i className="mlg-flow mlg-flow--one" />
        <i className="mlg-flow mlg-flow--two" />
        <i className="mlg-flow mlg-flow--three" />
      </div>

      <div className="mlg-menu-bar" aria-label="macOS menu bar">
        <div className="mlg-menu-bar__left">
          <Glyph name="apple-mark" className="mlg-mb-apple" />
          <strong>Stylebook</strong>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        <div className="mlg-menu-bar__right">
          <Glyph name="control-center" />
          <Glyph name="battery" />
          <Glyph name="wifi" />
          <span>Wed 4:24 PM</span>
          <div className="lang-dropdown" id="lang-dropdown">
            <button className="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria" type="button">English</button>
            <ul className="lang-menu" role="menu">
              <li><button role="menuitem" data-lang-select="en" type="button">English</button></li>
              <li><button role="menuitem" data-lang-select="ko" type="button">한국어</button></li>
              <li><button role="menuitem" data-lang-select="ja" type="button">日本語</button></li>
            </ul>
          </div>
        </div>
      </div>

      <a className="page-back-link" href="/" aria-label="허브로 돌아가기">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
        <span data-i18n="back.hub">Back to Hub</span>
      </a>

      <main className="mlg-stage">
        <section className="mlg-library-window" aria-labelledby="macos-title">
          <header className="mlg-library-titlebar">
            <Stoplights />
            <div className="mlg-title-crumb">
              <span>Apple macOS 26 UI Kit</span>
              <Glyph name="chevron" />
              <strong>Components</strong>
            </div>
            <div className="mlg-title-actions">
              <button type="button" aria-label="Search"><Glyph name="search" /></button>
              <button type="button" aria-label="Share"><Glyph name="share" /></button>
              <button type="button" aria-label="Add"><Glyph name="plus" /></button>
            </div>
          </header>

          <div className="mlg-library-grid">
            <aside className="mlg-source-list" aria-label="Apple resource library groups">
              <div className="mlg-source-stats">
                {libraryStats.map(([label, value], index) => (
                  <button className={index === 0 ? 'is-active' : ''} type="button" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </button>
                ))}
              </div>
              <div className="mlg-source-groups">
                <p>
                  <MultiText value={copy('Component Groups', '컴포넌트 그룹', 'コンポーネントグループ')} />
                </p>
                {componentGroups.map((group) => (
                  <button className={group.active ? 'is-active' : ''} type="button" key={group.name}>
                    <span className="mlg-group-name">
                      <Glyph name="chevron" className="mlg-group-disc" />
                      {group.name}
                    </span>
                    <em>{group.count}</em>
                  </button>
                ))}
              </div>
            </aside>

            <article className="mlg-canvas">
              <header className="mlg-canvas-header">
                <div>
                  <p>Symbols / Title Bar and Toolbar</p>
                  <h1 id="macos-title">macOS 26 Liquid Glass</h1>
                </div>
                <div className="mlg-canvas-tools">
                  <button className="is-active" type="button">Symbols</button>
                  <button type="button">Styles</button>
                  <button type="button">Variables</button>
                </div>
              </header>

              <section className="mlg-artboard" aria-label="macOS 26 UI Kit component specimens">
                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--wide">
                    <div className="mlg-art-label">
                      <strong>Title Bar with Toolbar / Tabs</strong>
                      <span>400 × 59</span>
                    </div>
                    <ToolbarWindowSpecimen />
                  </div>
                  <div className="mlg-art-item">
                    <div className="mlg-art-label">
                      <strong>Search Field</strong>
                      <span>Liquid Glass · 240 × 28</span>
                    </div>
                    <div className="mlg-art-stack">
                      <SearchFieldSpecimen />
                      <SegmentedSpecimen />
                    </div>
                  </div>
                </div>

                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full">
                    <div className="mlg-art-label">
                      <strong>Menu Bar / On Lighter Background</strong>
                      <span>1000 × 34</span>
                    </div>
                    <div className="mlg-menubar-band mlg-menubar-band--light">
                      <MenuBarSpecimen tone="light" />
                    </div>
                  </div>
                </div>
                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full">
                    <div className="mlg-art-label">
                      <strong>Menu Bar / On Darker Background</strong>
                      <span>1000 × 34</span>
                    </div>
                    <div className="mlg-menubar-band mlg-menubar-band--dark">
                      <MenuBarSpecimen tone="dark" />
                    </div>
                  </div>
                </div>

                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full mlg-art-item--dock">
                    <div className="mlg-art-label">
                      <strong>Dock / Light</strong>
                      <span>882 × 57</span>
                    </div>
                    <DockSpecimen tone="light" />
                  </div>
                </div>
                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full mlg-art-item--dock mlg-art-item--dark">
                    <div className="mlg-art-label">
                      <strong>Dock / Dark</strong>
                      <span>882 × 57</span>
                    </div>
                    <DockSpecimen tone="dark" />
                  </div>
                </div>

                <div className="mlg-art-row">
                  <div className="mlg-art-item">
                    <div className="mlg-art-label">
                      <strong>Popover</strong>
                      <span>Over-Glass · transient</span>
                    </div>
                    <PopoverSpecimen />
                  </div>
                  <div className="mlg-art-item">
                    <div className="mlg-art-label">
                      <strong>Dialog</strong>
                      <span>Alert · 360 × 156</span>
                    </div>
                    <DialogSpecimen />
                  </div>
                </div>

                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full">
                    <div className="mlg-art-label">
                      <strong>Toggles · Sliders · Color Wells</strong>
                      <span>
                        <MultiText value={copy(
                          'Native control proportions',
                          '네이티브 컨트롤 비율',
                          'ネイティブ コントロール プロポーション',
                        )} />
                      </span>
                    </div>
                    <div className="mlg-controls-panel">
                      <div className="mlg-controls-col">
                        <ToggleRow label={copy('Reduce Transparency', '투명도 줄이기', '透明度を下げる')} on />
                        <ToggleRow label={copy('Increase Contrast', '대비 증가', 'コントラストを上げる')} />
                        <ToggleRow label={copy('Auto-Hide Dock', 'Dock 자동 가리기', 'Dockを自動で隠す')} on />
                      </div>
                      <div className="mlg-controls-col">
                        <SliderRow label={copy('Dock Size', 'Dock 크기', 'Dockのサイズ')} value={62} />
                        <SliderRow label={copy('Magnification', '확대', '拡大')} value={38} />
                        <SliderRow label={copy('Accent Saturation', '강조 색 채도', 'アクセント彩度')} value={74} />
                      </div>
                      <div className="mlg-controls-col">
                        <div className="mlg-control-row mlg-control-row--block">
                          <span>
                            <MultiText value={copy('Accent Color', '강조 색', 'アクセントカラー')} />
                          </span>
                          <ColorWellRow />
                        </div>
                        <div className="mlg-control-row mlg-control-row--block">
                          <span>
                            <MultiText value={copy('Highlight Color', '강조 표시 색', 'ハイライトカラー')} />
                          </span>
                          <ColorWellRow />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full">
                    <div className="mlg-art-label">
                      <strong>Spotlight · Tahoe Search</strong>
                      <span>Over-Glass · 720 × 408</span>
                    </div>
                    <div className="mlg-stage-band mlg-stage-band--spotlight">
                      <SpotlightSpecimen />
                    </div>
                  </div>
                </div>

                <div className="mlg-art-row mlg-art-row--cc">
                  <div className="mlg-art-item">
                    <div className="mlg-art-label">
                      <strong>Control Center</strong>
                      <span>Liquid Glass · 320 × 480</span>
                    </div>
                    <div className="mlg-stage-band mlg-stage-band--cc">
                      <ControlCenterSpecimen />
                    </div>
                  </div>
                  <div className="mlg-art-item">
                    <div className="mlg-art-label">
                      <strong>Notification Center</strong>
                      <span>Stacked · Over-Glass</span>
                    </div>
                    <div className="mlg-stage-band mlg-stage-band--notif">
                      <NotificationStackSpecimen />
                    </div>
                  </div>
                </div>

                <div className="mlg-art-row">
                  <div className="mlg-art-item mlg-art-item--full">
                    <div className="mlg-art-label">
                      <strong>Widgets · Desktop</strong>
                      <span>
                        <MultiText value={copy('Clock · Weather · Calendar', '시계 · 날씨 · 캘린더', '時計 · 天気 · カレンダー')} />
                      </span>
                    </div>
                    <div className="mlg-stage-band mlg-stage-band--widgets">
                      <WidgetClock />
                      <WidgetWeather />
                      <WidgetCalendar />
                    </div>
                  </div>
                </div>

                <div className="mlg-art-row mlg-art-row--tabctx">
                  <div className="mlg-art-item mlg-art-item--wide">
                    <div className="mlg-art-label">
                      <strong>Tab Bar / Safari</strong>
                      <span>Liquid Glass · 800 × 76</span>
                    </div>
                    <TabBarSpecimen />
                  </div>
                  <div className="mlg-art-item">
                    <div className="mlg-art-label">
                      <strong>Context Menu</strong>
                      <span>Over-Glass · transient</span>
                    </div>
                    <div className="mlg-stage-band mlg-stage-band--ctx">
                      <ContextMenuSpecimen />
                    </div>
                  </div>
                </div>
              </section>
            </article>

            <aside className="mlg-inspector" aria-label="Inspector">
              <header>
                <div>
                  <strong>Inspector</strong>
                  <span>Title Bar and Toolbar / Utility Panel</span>
                </div>
                <button type="button" aria-label="More" className="mlg-inspector-more"><Glyph name="info" /></button>
              </header>

              <nav className="mlg-inspector-tabs" aria-label="Inspector tabs">
                <button className="is-active" type="button">Style</button>
                <button type="button">Appearance</button>
                <button type="button">Layout</button>
              </nav>

              <section className="mlg-inspector-section">
                <p className="mlg-inspector-heading">Layer Styles<em>174</em></p>
                <ul className="mlg-inspector-list">
                  {layerStyles.map((style) => (
                    <li key={style.name} className={style.sample === 'glass-over' ? 'is-active' : ''}>
                      <LayerSampleSwatch kind={style.sample} />
                      <div>
                        <strong>{style.name}</strong>
                        <span>{style.group}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mlg-inspector-section">
                <p className="mlg-inspector-heading">Color Variables<em>118</em></p>
                <ul className="mlg-inspector-list mlg-inspector-list--colors">
                  {colorVars.map(([label, hex]) => (
                    <li key={label}>
                      <span className="mlg-color-chip" style={{ background: hex }} />
                      <div>
                        <strong>{label}</strong>
                        <span>{hex.toUpperCase()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mlg-inspector-section">
                <p className="mlg-inspector-heading">Text Styles<em>66</em></p>
                <ul className="mlg-inspector-list mlg-inspector-list--type">
                  <li>
                    <div>
                      <strong style={{ fontSize: 17 }}>Aa Title 2</strong>
                      <span>SF Pro · 17 / 22</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong style={{ fontSize: 13, fontWeight: 600 }}>Aa Headline</strong>
                      <span>SF Pro · 13 / 16</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong style={{ fontSize: 11, color: 'rgba(20,24,32,0.5)' }}>Aa Footnote</strong>
                      <span>SF Pro · 11 / 14</span>
                    </div>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </section>

        <section className="prompt">
          <h2 data-i18n="page.heading.prompt">AI Request Prompt</h2>
          <pre data-lang="en">{promptText.en}</pre>
          <pre data-lang="ko" hidden>{promptText.ko}</pre>
          <pre data-lang="ja" hidden>{promptText.ja}</pre>
          <button data-i18n="page.btn.copy" type="button" data-copy-prompt onClick={handleCopyPrompt}>Copy Prompt</button>
        </section>

        <section className="mlg-reference-note">
          <h2>
            <MultiText value={copy('Reference', '참고 자료', 'リファレンス')} />
          </h2>
          <p>
            <MultiText value={copy(
              'This page is structured around the official macOS 26 Sketch UI Kit — 3,446 symbols, 66 text styles, 174 layer styles, and 118 color variables.',
              '이 페이지는 Apple이 제공하는 공식 macOS 26 Sketch UI Kit을 기준으로 구성했습니다. Symbols 3,446개, Text Styles 66개, Layer Styles 174개, Color Variables 118개를 그대로 따릅니다.',
              'このページはAppleが提供する公式macOS 26 Sketch UI Kitを基準に構成しています。Symbols 3,446個、Text Styles 66個、Layer Styles 174個、Color Variables 118個をそのまま踏襲しています。',
            )} />
          </p>
        </section>
      </main>

      <footer className="page-footer">
        <a href="/">Web Stylebook</a> · Style Sample Page
      </footer>

      <nav className="page-nav" aria-label="페이지 내비게이션">
        <a href="/pages/paper-cut.html">
          <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          <span><span className="page-nav__label">이전</span>Paper Cut</span>
        </a>
        <div className="page-nav__divider" />
        <a href="/pages/fusion-neon-swiss.html">
          <span><span className="page-nav__label">다음</span>Neon x Swiss</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg>
        </a>
      </nav>
    </div>
  );
}
