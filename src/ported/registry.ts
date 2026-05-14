import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { Lang, StyleData } from '../data/styles';
import './portedStylePages.css';
import './retroPixelExpanded.css';
import './fusionShell.css';
import './fusionPages.css';

export interface PortedStylePageProps {
  style: StyleData;
  lang: Lang;
}

type PortedStyleComponent = LazyExoticComponent<ComponentType<PortedStylePageProps>>;
type PortedPageModule = Record<string, ComponentType<PortedStylePageProps>>;

const pageModules = import.meta.glob<PortedPageModule>('./pages/Ported*Page.tsx');

const pageRegistry: Record<string, { path: string; exportName: string }> = {
  'brutalist-grid': { path: './pages/PortedBrutalistGridPage.tsx', exportName: 'PortedBrutalistGridPage' },
  'editorial-silence': { path: './pages/PortedEditorialSilencePage.tsx', exportName: 'PortedEditorialSilencePage' },
  'kinetic-pop': { path: './pages/PortedKineticPopPage.tsx', exportName: 'PortedKineticPopPage' },
  'cyberpunk-glitch': { path: './pages/PortedCyberpunkGlitchPage.tsx', exportName: 'PortedCyberpunkGlitchPage' },
  'swiss-poster': { path: './pages/PortedSwissPosterPage.tsx', exportName: 'PortedSwissPosterPage' },
  'quiet-utility': { path: './pages/PortedQuietUtilityPage.tsx', exportName: 'PortedQuietUtilityPage' },
  'platform-core': { path: './pages/PortedPlatformCorePage.tsx', exportName: 'PortedPlatformCorePage' },
  'runtime-signal': { path: './pages/PortedRuntimeSignalPage.tsx', exportName: 'PortedRuntimeSignalPage' },
  'holographic-fluid': { path: './pages/PortedHolographicFluidPage.tsx', exportName: 'PortedHolographicFluidPage' },
  'neon-drift': { path: './pages/PortedNeonDriftPage.tsx', exportName: 'PortedNeonDriftPage' },
  'glass-orbit': { path: './pages/PortedGlassOrbitPage.tsx', exportName: 'PortedGlassOrbitPage' },
  'terminal-core': { path: './pages/PortedTerminalCorePage.tsx', exportName: 'PortedTerminalCorePage' },
  'midnight-noir': { path: './pages/PortedMidnightNoirPage.tsx', exportName: 'PortedMidnightNoirPage' },
  'console-launch': { path: './pages/PortedConsoleLaunchPage.tsx', exportName: 'PortedConsoleLaunchPage' },
  'bento-bloom': { path: './pages/PortedBentoBloomPage.tsx', exportName: 'PortedBentoBloomPage' },
  'earth-atelier': { path: './pages/PortedEarthAtelierPage.tsx', exportName: 'PortedEarthAtelierPage' },
  'liquid-metal': { path: './pages/PortedLiquidMetalPage.tsx', exportName: 'PortedLiquidMetalPage' },
  'aurora-gradient': { path: './pages/PortedAuroraGradientPage.tsx', exportName: 'PortedAuroraGradientPage' },
  'zen-minimalism': { path: './pages/PortedZenMinimalismPage.tsx', exportName: 'PortedZenMinimalismPage' },
  'mono-type': { path: './pages/PortedMonoTypePage.tsx', exportName: 'PortedMonoTypePage' },
  'duotone-bold': { path: './pages/PortedDuotoneBoldPage.tsx', exportName: 'PortedDuotoneBoldPage' },
  'mesh-gradient': { path: './pages/PortedMeshGradientPage.tsx', exportName: 'PortedMeshGradientPage' },
  'framer-motion': { path: './pages/PortedFramerMotionPage.tsx', exportName: 'PortedFramerMotionPage' },
  'claymorphism': { path: './pages/PortedClaymorphismPage.tsx', exportName: 'PortedClaymorphismPage' },
  'neumorphism': { path: './pages/PortedNeumorphismPage.tsx', exportName: 'PortedNeumorphismPage' },
  'soft-pastel': { path: './pages/PortedSoftPastelPage.tsx', exportName: 'PortedSoftPastelPage' },
  'notion-style': { path: './pages/PortedNotionStylePage.tsx', exportName: 'PortedNotionStylePage' },
  'retro-pixel': { path: './pages/PortedRetroPixelPage.tsx', exportName: 'PortedRetroPixelPage' },
  'y2k-retro': { path: './pages/PortedY2kRetroPage.tsx', exportName: 'PortedY2kRetroPage' },
  'risograph-print': { path: './pages/PortedRisographPrintPage.tsx', exportName: 'PortedRisographPrintPage' },
  'paper-cut': { path: './pages/PortedPaperCutPage.tsx', exportName: 'PortedPaperCutPage' },
  'macos-liquid-glass': { path: './pages/PortedMacosLiquidGlassPage.tsx', exportName: 'PortedMacosLiquidGlassPage' },
  'fusion-neon-swiss': { path: './pages/PortedFusionNeonSwissPage.tsx', exportName: 'PortedFusionNeonSwissPage' },
  'fusion-product-swiss': { path: './pages/PortedFusionProductSwissPage.tsx', exportName: 'PortedFusionProductSwissPage' },
  'fusion-bento-noir': { path: './pages/PortedFusionBentoNoirPage.tsx', exportName: 'PortedFusionBentoNoirPage' },
  'fusion-editorial-terminal': { path: './pages/PortedFusionEditorialTerminalPage.tsx', exportName: 'PortedFusionEditorialTerminalPage' },
  'fusion-holo-glass': { path: './pages/PortedFusionHoloGlassPage.tsx', exportName: 'PortedFusionHoloGlassPage' },
  'fusion-earth-zen': { path: './pages/PortedFusionEarthZenPage.tsx', exportName: 'PortedFusionEarthZenPage' },
  'fusion-kinetic-brutal': { path: './pages/PortedFusionKineticBrutalPage.tsx', exportName: 'PortedFusionKineticBrutalPage' },
  'fusion-cyber-console': { path: './pages/PortedFusionCyberConsolePage.tsx', exportName: 'PortedFusionCyberConsolePage' },
  'fusion-grain-mono': { path: './pages/PortedFusionGrainMonoPage.tsx', exportName: 'PortedFusionGrainMonoPage' },
  'fusion-clay-aurora': { path: './pages/PortedFusionClayAuroraPage.tsx', exportName: 'PortedFusionClayAuroraPage' },
};

function lazyPortedStylePage(path: string, exportName: string): PortedStyleComponent {
  return lazy(async () => {
    const load = pageModules[path];
    if (!load) throw new Error(`Missing ported style page module: ${path}`);
    const module = await load();
    const Component = module[exportName];
    if (!Component) throw new Error(`Missing ported style export: ${exportName}`);
    return { default: Component };
  });
}

export const portedStylePages = Object.fromEntries(
  Object.entries(pageRegistry).map(([styleId, entry]) => [
    styleId,
    lazyPortedStylePage(entry.path, entry.exportName),
  ]),
) as Partial<Record<string, PortedStyleComponent>>;
