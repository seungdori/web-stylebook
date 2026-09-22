// SPDX-License-Identifier: MIT
// Authored reference primitives were checked against active ported CSS. The finite
// role adapter below explicitly labels additions absent from those specimens.
import recipes from './recipes.json';
import fontWeights from './fontWeights.json';
import { styleCatalog } from '../data/styles';
import { FONT_LICENSES, FONT_SCRIPT_COVERAGE, HEAVY_CJK_FALLBACKS, HEAVY_DISPLAY_FACES } from './fontSources.js';
import { visualContentHash } from './hash.js';
import { zVisualContract, zVisualColor } from './schema.js';
import { resolveContract } from './resolve.js';
import { visualContrastRatio } from './contrast.js';
import type { VisualContract, VisualMode, VisualColors, TypographyRole, FontMetadata, VisualResolutionOptions } from './types.js';

type SourceRecipe = {
  id:string;defaultMode:string;canvas:string;surface:string|null;text:string;muted:string|null;accent:string|null;border:string|null;
  displayFont:string|null;bodyFont:string|null;monoFont:string|null;displayMinRem:number|null;displayMaxRem:number|null;
  displayWeight:number|null;displayLineHeight:number|string|null;bodySizeRem:number|null;bodyLineHeight:number|null;
  borderWidthPx:number|null;radiusPx:number|null;shadow:string|null;density:string;
  source:unknown;notes:string|string[];supportedAlternateModes?:Array<Record<string,unknown>>;alternativeModes?:Partial<Record<string,Record<string,unknown>>>;
  shadowNormalizedFromInvalidAuthoredSyntax?:boolean;
  displayLetterSpacingEm?:number|null;bodyLetterSpacingEm?:number|null;bodyWeight?:number|null;
  motionDurationMs?:number|null;motionEasing?:string|null;
  bodyMinRem?:number|null;bodyMaxRem?:number|null;displayWeightResolved?:number|null;fidelityNotes?:string[];
};
const sourceRecipes:SourceRecipe[]=recipes;
const weightsByFamily:Record<string,number[]>=fontWeights;
const STATUS={light:{positive:'#1a7f37',caution:'#9a6700',critical:'#cf222e',info:'#0969da'},dark:{positive:'#3fb950',caution:'#d29922',critical:'#f85149',info:'#58a6ff'}};
const BACKDROP_STYLES=new Set(['glass-orbit','holographic-fluid','aurora-gradient','mesh-gradient','macos-liquid-glass','fusion-holo-glass','liquid-metal']);
const COLOR_FALLBACKS:Record<string,Partial<VisualColors>>={
  'glass-orbit':{canvas:'#1f1230',surface:'rgba(255,255,255,0.24)'},
  'holographic-fluid':{surface:'rgba(11,15,25,0.45)'},
  'liquid-metal':{surface:'rgba(28,28,28,0.4)'},
  'fusion-grain-mono':{accent:'#d2927b'},
};
// Actual action treatments are intentionally separate from the identity accent.
const ACTIONS:Record<string,{background:string;foreground:string}>={
  'bento-bloom':{background:'#a7d3b8',foreground:'#2b2620'},
  'fusion-pure-noir':{background:'#fafafa',foreground:'#08090a'},
  'fusion-product-swiss':{background:'#0d0d0e',foreground:'#fafafa'},
};
const PAIRS:VisualContract['components']=[
  {id:'body-canvas',foreground:'text',background:'canvas',kind:'text',context:'Body copy on the page'},
  {id:'body-panel',foreground:'text',background:'surface',kind:'text',context:'Body copy in a panel'},
  {id:'muted-panel',foreground:'textMuted',background:'surface',kind:'text',context:'Supporting copy in a panel'},
  {id:'primary-action',foreground:'actionPrimaryText',background:'actionPrimary',kind:'text',context:'Primary button label'},
  {id:'secondary-action',foreground:'actionSecondaryText',background:'actionSecondary',kind:'text',context:'Secondary button label'},
  {id:'input-placeholder',foreground:'textMuted',background:'surfaceRaised',kind:'text',context:'Input placeholder'},
  {id:'input-boundary',foreground:'borderStrong',background:'surfaceRaised',kind:'control',context:'Essential input boundary'},
  {id:'link-canvas',foreground:'link',background:'canvas',kind:'text',context:'Link text'},
  {id:'focus-canvas',foreground:'focus',background:'canvas',kind:'control',context:'Focus indicator adjacent to canvas'},
  {id:'focus-surface',foreground:'focus',background:'surface',kind:'control',context:'Focus indicator adjacent to panel'},
  {id:'selection',foreground:'accentSecondaryText',background:'accentSecondary',kind:'text',context:'Selected item label'},
  {id:'positive-status',foreground:'positive',background:'surface',kind:'text',context:'Success status text'},
  {id:'caution-status',foreground:'caution',background:'surface',kind:'text',context:'Caution status text'},
  {id:'critical-status',foreground:'critical',background:'surface',kind:'text',context:'Error status text'},
  {id:'info-status',foreground:'info',background:'surface',kind:'text',context:'Information status text'},
  {id:'decorative-separator',foreground:'border',background:'canvas',kind:'decorative',context:'Decorative separator, not a control boundary'},
];
function bestOn(color:string):string{return (visualContrastRatio('#ffffff',color)??0)>=(visualContrastRatio('#000000',color)??0)?'#ffffff':'#000000';}
function literal(value:string|null|undefined,fallback:string):string{return value&&zVisualColor.safeParse(value).success?value:fallback;}
function buildColors(r:SourceRecipe,mode:VisualMode,alternate:Record<string,unknown>={}):VisualColors {
  const src={...r,...alternate};const fallback=mode===r.defaultMode?COLOR_FALLBACKS[r.id]:{};
  const canvas=literal(typeof src.canvas==='string'?src.canvas:null,fallback?.canvas??(mode==='light'?'#ffffff':'#101014'));
  const text=literal(typeof src.text==='string'?src.text:null,mode==='light'?'#161616':'#eeeeee');
  const surface=literal(typeof src.surface==='string'?src.surface:null,fallback?.surface??canvas);
  const accent=literal(typeof src.accent==='string'?src.accent:null,fallback?.accent??styleCatalog.find(s=>s.id===r.id)!.accent);
  const action=ACTIONS[r.id];
  return {canvas,surface,surfaceRaised:surface,surfaceMuted:surface,text,textMuted:literal(typeof src.muted==='string'?src.muted:null,text),textInverse:canvas,
    border:literal(typeof src.border==='string'?src.border:null,text),borderStrong:text,accent,accentText:bestOn(accent),accentSecondary:surface,accentSecondaryText:text,
    actionPrimary:action?.background??accent,actionPrimaryText:action?.foreground??bestOn(accent),actionSecondary:surface,actionSecondaryText:text,
    link:accent,focus:accent,...STATUS[mode]};
}
function role(fontFamily:string,sizeMinRem:number,sizeMaxRem:number,fontWeight:number,lineHeight:number,measureCh:number):TypographyRole {
  return {fontFamily,fontWeight,fontStyle:'normal',sizeMinRem,sizeMaxRem,lineHeight,letterSpacingEm:0,paragraphSpacingEm:1,measureCh,textTransform:'none',wordBreak:'normal',overflowWrap:'anywhere',fontVariantNumeric:'normal'};
}
function fontMetadata(stack:string):FontMetadata[] {
  const generic=new Set(['serif','sans-serif','monospace','system-ui','ui-monospace']);
  return stack.split(',').map(s=>s.trim().replace(/^['"]|['"]$/g,'')).filter(f=>!generic.has(f)).map(family=>{
    const approved=FONT_LICENSES[family];const weights=weightsByFamily[family]??[400,700];
    const korean=['Noto Sans KR','Noto Serif KR','IBM Plex Sans KR','Do Hyeon','Jua','Pretendard','Pretendard Variable'].includes(family);
    const japanese=['Noto Sans JP','Noto Serif JP'].includes(family);
    const isPretendard=family.startsWith('Pretendard');
    return {family,source:approved?'external':'system',...(approved?{stylesheetUrl:isPretendard?'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css':`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g,'+')}${weights.length===1&&weights[0]===400?'':`:wght@${weights.join(';')}`}&display=swap`,...approved}:{license:'System-provided font; not redistributed'}),weights,scripts:FONT_SCRIPT_COVERAGE[family]??(korean?['latin','hangul']:japanese?['latin','japanese']:['latin']),fallback:stack.includes('monospace')?'ui-monospace, monospace':stack.endsWith('serif')&&!stack.endsWith('sans-serif')?'Georgia, serif':'system-ui, sans-serif',availability:approved?'requires-load':'system-dependent'} as FontMetadata;
  });
}
function buildContract(r:SourceRecipe):VisualContract {
  const style=styleCatalog.find(s=>s.id===r.id);if(!style)throw new Error(`Unknown visual recipe '${r.id}'`);
  const native=r.defaultMode as VisualMode;
  const body=r.bodyFont??'system-ui, sans-serif';const display=r.displayFont??body;const mono=r.monoFont??'ui-monospace, monospace';
  const bodySize=r.bodyMinRem??r.bodySizeRem??1;const bodySizeMax=r.bodyMaxRem??bodySize;const bodyLeading=r.bodyLineHeight??1.6;
  const displayMin=r.displayMinRem??2;const displayMax=r.displayMaxRem??3.5;const displayWeight=r.displayWeight??r.displayWeightResolved??700;
  const displayLeading=typeof r.displayLineHeight==='number'?r.displayLineHeight:1.2;
  const headingSize=Math.max(bodySize*1.6,Math.min(displayMax*.55,3.5));
  const roles={
    display:role(display,displayMin,displayMax,displayWeight,displayLeading,24),
    heading:role(display,Math.min(1.8,headingSize),headingSize,displayWeight,Math.max(1.1,displayLeading),36),
    subheading:role(display,Math.max(bodySize*1.15,1),Math.max(bodySize*1.35,1.3),Math.min(displayWeight,700),1.35,42),
    body:role(body,bodySize,bodySizeMax,r.bodyWeight??400,bodyLeading,68),
    small:role(body,Math.max(.75,bodySize*.875),Math.max(.75,bodySize*.875),400,bodyLeading,72),
    label:role(body,Math.max(.75,bodySize*.85),Math.max(.75,bodySize*.85),600,1.4,36),
    caption:role(body,Math.max(.6875,bodySize*.75),Math.max(.6875,bodySize*.75),400,1.5,72),
    data:{...role(mono,Math.max(.75,bodySize*.875),Math.max(.75,bodySize*.875),400,1.5,80),fontVariantNumeric:'tabular-nums' as const},
  };
  roles.display.letterSpacingEm=r.displayLetterSpacingEm??0;
  roles.body.letterSpacingEm=r.bodyLetterSpacingEm??0;
  // A heavy single-weight display face ships with heavy CJK display fallbacks; the resolver pairs them per locale.
  const heavyDisplay=(display.split(',')[0]?.trim().replace(/^['"]|['"]$/g,'')??'') in HEAVY_DISPLAY_FACES;
  const fonts=[...new Map([display,body,mono,"'Noto Sans KR', 'Noto Sans JP', 'Noto Serif KR', 'Noto Serif JP', sans-serif",...(heavyDisplay?[`'${HEAVY_CJK_FALLBACKS.hangul}', '${HEAVY_CJK_FALLBACKS.japanese}', sans-serif`]:[])].flatMap(fontMetadata).map(f=>[f.family,f])).values()];
  const modes:VisualContract['modes']={[native]:{colors:buildColors(r,native),backdropDependent:BACKDROP_STYLES.has(r.id)}};
  const alternatives={...r.alternativeModes};for(const alternate of r.supportedAlternateModes??[])if(typeof alternate.mode==='string')alternatives[alternate.mode]=alternate;
  for(const [mode,alternate] of Object.entries(alternatives)){
    // Existing editorial-terminal light toggle remains dark due to stale selectors.
    // It is not advertised as a faithful light recipe until that renderer is fixed.
    if(!alternate||(mode!=='light'&&mode!=='dark')||r.id==='fusion-editorial-terminal')continue;
    modes[mode]={colors:buildColors(r,mode,alternate),backdropDependent:BACKDROP_STYLES.has(r.id),...(typeof alternate.shadow==='string'?{shadows:{sm:'none',md:alternate.shadow,lg:alternate.shadow}}:{})};
  }
  const shadow=r.shadow&& !r.shadow.includes('var(')&&!r.shadow.includes('calc(')?r.shadow:'none';
  const radius=r.radiusPx??0;
  const notes=[...(Array.isArray(r.notes)?r.notes:[r.notes]),...(r.fidelityNotes??[])];
  const source=Array.isArray(r.source)?r.source.join('; '):JSON.stringify(r.source);
  const authoredPaths=['colors.text'];
  if(zVisualColor.safeParse(r.canvas).success)authoredPaths.push('colors.canvas');
  if(r.borderWidthPx!==null)authoredPaths.push('borders.width');
  if(r.radiusPx!==null)authoredPaths.push('radii.md','radii.lg');
  if(r.shadow!==null&&shadow===r.shadow)authoredPaths.push('shadows.md','shadows.lg');
  if(r.motionDurationMs!==null&&r.motionDurationMs!==undefined)authoredPaths.push('motion.duration');
  if(r.motionEasing)authoredPaths.push('motion.easing');
  for(const [field,value] of [['surface',r.surface],['textMuted',r.muted],['accent',r.accent],['border',r.border]] as const)if(value&&zVisualColor.safeParse(value).success)authoredPaths.push(`colors.${field}`);
  for(const [field,value] of Object.entries({fontFamily:r.displayFont,fontWeight:r.displayWeight,letterSpacingEm:r.displayLetterSpacingEm??null,sizeMinRem:r.displayMinRem,sizeMaxRem:r.displayMaxRem,lineHeight:typeof r.displayLineHeight==='number'?r.displayLineHeight:null}))if(value!==null)authoredPaths.push(`typography.roles.display.${field}`);
  for(const [field,value] of Object.entries({fontFamily:r.bodyFont,fontWeight:r.bodyWeight??null,letterSpacingEm:r.bodyLetterSpacingEm??null,sizeMinRem:r.bodyMinRem??r.bodySizeRem,sizeMaxRem:r.bodyMaxRem??r.bodySizeRem,lineHeight:r.bodyLineHeight}))if(value!==null)authoredPaths.push(`typography.roles.body.${field}`);
  const compact=r.density==='high';
  const base:Omit<VisualContract,'revision'>={schema:'webstylebook.visual.v1',styleId:r.id,defaultMode:native,modes,typography:{roles,fonts},
    spacing:{unit:4,section:r.density==='low'?64:compact?32:48,stack:compact?12:20,density:compact?'compact':'comfortable',row:compact?32:44,gutter:compact?12:24},
    borders:{width:r.borderWidthPx??0,style:'solid'},radii:{sm:radius===0?0:Math.min(8,radius),md:radius,lg:radius},shadows:{sm:'none',md:shadow,lg:shadow},
    motion:{duration:r.motionDurationMs??(['brutalist-grid','mono-type','fusion-quiet-manifesto'].includes(r.id)?0:180),easing:r.motionEasing??'ease',reducedMotion:'none',continuous:false},components:PAIRS,
    usage:{preserve:[`Preserve the ${r.id} role relationships; identity accent and action background may differ.`,`Retain the explicit ${r.borderWidthPx??0}px borders, ${radius}px corner radius, and declared surface shadow.`,`Keep display and body font roles separate; their typography values are part of this selection.`],adapt:['Use the selected typography and colors with the target product composition.','Supporting type roles, status colors, spacing, and motion are explicit UI adaptations; consult provenance.'],verify:['Check actual font loading and glyph fallback.','Check component contrast, focus, states, text enlargement, and narrow layouts.','Compare source-specific gradients, materials, and composition in the original specimen.']},
    provenance:{source,selectors:[`.ported-style-page--${r.id}`],notes:[...notes,...(r.shadowNormalizedFromInvalidAuthoredSyntax?['The source shadow syntax is unresolved; this contract uses none rather than claiming a verified shadow.']:[])],authoredPaths,adaptation:'Scalar source primitives are preserved where authored. Supporting semantic roles, type hierarchy, status colors, responsive interpolation, spacing, and motion are explicit finite UI adaptations; backdrop effects require rendered review. No original screenshot or font binary is distributed.'},
  };
  return zVisualContract.parse({...base,revision:visualContentHash(base)});
}
export const visualContracts:Readonly<Record<string,VisualContract>>=Object.fromEntries(sourceRecipes.map(r=>[r.id,buildContract(r)]));
if(Object.keys(visualContracts).length!==styleCatalog.length)throw new Error('Every catalog style must have exactly one visual recipe');
export function getVisualContract(styleId:string):VisualContract{const contract=visualContracts[styleId];if(!contract)throw new Error(`Unknown style '${styleId}'`);return structuredClone(contract);}
export function resolveVisualContract(styleId:string,options:VisualResolutionOptions={}){return resolveContract(getVisualContract(styleId),options);}
