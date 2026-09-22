import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { styleCatalog } from '../../src/data/styles';
import { visualContracts, resolveVisualContract, getVisualContract, resolveContract, zVisualContract, zVisualOverrides, visualContentHash, stableVisualJson, validateResolvedVisualContract, assessContrast, proposeContrastRepairs, visualContrastRatio, parseVisualColor, visualContractToCss } from '../../src/visual';
import { compileVisualLibrary } from '../generate-mcp-catalog.mts';
import type { VisualContract, VisualMode } from '../../src/visual';

function rehash(contract:VisualContract):VisualContract {const {revision:_,...base}=contract;void _;return {...base,revision:visualContentHash(base)};}

describe('canonical visual contract',()=>{
  it('covers every style and authored mode in all three content locales',()=>{
    expect(Object.keys(visualContracts).sort()).toEqual(styleCatalog.map(s=>s.id).sort());
    for(const style of Object.values(visualContracts)){
      expect(zVisualContract.safeParse(style).success).toBe(true);
      for(const mode of Object.keys(style.modes) as VisualMode[])for(const contentLocale of ['en','ko','ja'] as const){
        const result=resolveVisualContract(style.styleId,{mode,contentLocale});
        expect(validateResolvedVisualContract(result)).toEqual(result);
        expect(result.colors.text).toBeTruthy();
        expect(result.typography.roles.data.fontVariantNumeric).toBe('tabular-nums');
        expect(result.provenance.authoredPaths.length).toBeGreaterThan(0);
      }
    }
  });
  it('preserves independently inspected Brutalist text, accent, display/body fonts and absent shadows',()=>{
    const spec=resolveVisualContract('brutalist-grid');
    expect(spec.colors).toMatchObject({canvas:'#e6e6e1',text:'#111',accent:'#d72600'});
    expect(spec.typography.roles.display.fontFamily).toBe("'Archivo Black', sans-serif");
    expect(spec.typography.roles.body.fontFamily).toBe("'IBM Plex Mono', monospace");
    expect(spec.radii.md).toBe(0);expect(spec.shadows.md).toBe('none');expect(spec.motion.duration).toBe(0);
  });
  it('does not let display palette order change design identity',()=>{
    const source=styleCatalog.find(s=>s.id==='brutalist-grid')!;const before=resolveVisualContract(source.id);
    const original=[...source.palette];source.palette.reverse();
    try {expect(resolveVisualContract(source.id)).toEqual(before);}finally{source.palette=original;}
  });
  it('retains current source typography rather than old family approximations',()=>{
    expect(resolveVisualContract('mono-type').typography.roles.display.fontFamily).toBe("'Space Mono', monospace");
    expect(resolveVisualContract('fusion-strict-console').typography.roles.display.fontFamily).toContain('Oswald');
    expect(resolveVisualContract('paper-cut').typography.roles.display.fontFamily).toContain('Pretendard');
    expect(resolveVisualContract('editorial-silence').typography.roles.display.fontFamily).toContain('Noto Serif KR');
  });
  it('keeps the actual primary action separate from brand accent',()=>{
    const bento=resolveVisualContract('bento-bloom'),noir=resolveVisualContract('fusion-pure-noir');
    expect(bento.colors.accent).toBe('#f4d56a');expect(bento.colors.actionPrimary).toBe('#a7d3b8');
    expect(noir.colors.accent.toLowerCase()).toBe('#daa520');expect(noir.colors.actionPrimary).toBe('#fafafa');
    expect(noir.components.find(p=>p.id==='primary-action')).toMatchObject({foreground:'actionPrimaryText',background:'actionPrimary'});
  });
  it('uses native mode and rejects unsupported or inconsistent modes',()=>{
    expect(resolveVisualContract('terminal-core').mode).toBe('dark');
    expect(resolveVisualContract('terminal-core',{mode:'light'}).mode).toBe('light');
    expect(()=>resolveVisualContract('brutalist-grid',{mode:'dark'})).toThrow(/no authored/);
    expect(()=>resolveVisualContract('fusion-editorial-terminal',{mode:'light'})).toThrow(/no authored/);
  });
  it('applies authored mode type/shadow/density before explicit overrides',()=>{
    const base=getVisualContract('brutalist-grid');
    base.modes.dark={colors:{...base.modes.light!.colors,canvas:'#000000',text:'#ffffff'},backdropDependent:false,typography:structuredClone(base.typography),shadows:{sm:'none',md:'none',lg:'none'},spacing:{...base.spacing,density:'compact',row:32,gutter:12}};
    base.modes.dark.typography!.roles.body.lineHeight=1.9;
    const authored=resolveContract(rehash(base),{mode:'dark'});
    expect(authored.typography.roles.body.lineHeight).toBe(1.9);expect(authored.spacing.row).toBe(32);
    const edited=resolveContract(rehash(base),{mode:'dark',overrides:{typography:{body:{lineHeight:2.1}},density:'comfortable'}});
    expect(edited.typography.roles.body.lineHeight).toBe(2.1);expect(edited.spacing.row).toBe(44);expect(edited.spacing.gutter).toBe(24);
  });
  it('preserves exact spacing copies without losing them to family defaults',()=>{
    const before=resolveVisualContract('brutalist-grid');
    const changed=resolveVisualContract('brutalist-grid',{overrides:{spacing:{section:71,gutter:17,row:39}}});
    expect(changed.spacing).toMatchObject({section:71,gutter:17,row:39});expect(changed.colors).toEqual(before.colors);
  });
  it('rejects conflicting density and exact spacing without silently discarding either choice',()=>{
    for (const spacing of [{density:'comfortable' as const,row:70},{row:70},{gutter:24},{stack:20}]) {
      expect(()=>resolveVisualContract('brutalist-grid',{overrides:{density:'compact',spacing}})).toThrow(/conflict/);
    }
    const matching=resolveVisualContract('brutalist-grid',{overrides:{density:'compact',spacing:{density:'compact',row:32,gutter:12,stack:12,section:71}}});
    expect(matching.spacing).toMatchObject({density:'compact',row:32,gutter:12,stack:12,section:71});
  });
  it('hashes meaningful edits and excludes unrelated UI language or timestamps',()=>{
    const before=resolveVisualContract('editorial-silence');
    expect(resolveVisualContract('editorial-silence').contentHash).toBe(before.contentHash);
    const changed=resolveVisualContract('editorial-silence',{overrides:{typography:{body:{lineHeight:2}}}});
    expect(changed.contentHash).not.toBe(before.contentHash);expect(changed.revision).toBe(before.revision);
    expect(JSON.stringify(before)).not.toContain('generatedAt');
  });
  it('rejects unsafe, invalid, missing-version and tampered inputs',()=>{
    for(const override of [{colors:{text:'red; background: url(https://bad)'}},{colors:{text:'rgba(999,0,0,.5)'}},{typography:{body:{fontFamily:'url(https://bad)'}}},{typography:{body:{lineHeight:0}}},{unexpected:true}])expect(zVisualOverrides.safeParse(override).success).toBe(false);
    expect(()=>resolveVisualContract('brutalist-grid',{overrides:{typography:{body:{sizeMinRem:3,sizeMaxRem:1}}}})).toThrow(/minimum/);
    const wrong=getVisualContract('brutalist-grid');wrong.modes.light!.colors.text='#333333';expect(()=>resolveContract(wrong)).toThrow(/stale/);
    const stale=resolveVisualContract('brutalist-grid');stale.colors.text='#444444';expect(()=>validateResolvedVisualContract(stale)).toThrow(/hash/);
  });
  it('discloses optional-role adaptations and locale changes rather than claiming source fidelity',()=>{
    const spec=resolveVisualContract('brutalist-grid',{contentLocale:'ko',overrides:{typography:{body:{lineHeight:2}}}});
    expect(spec.origins['colors.text']).toBe('authored');expect(spec.origins['colors.positive']).toBe('adaptation');
    expect(spec.origins['typography.roles.body.lineHeight']).toBe('override');expect(spec.typography.roles.label.textTransform).toBe('none');
    expect(spec.typography.roles.body.wordBreak).toBe('keep-all');
  });
  it('groups font metadata origins while retaining individual token origins and metadata',()=>{
    const original=resolveVisualContract('editorial-silence');
    expect(original.origins['typography.fonts']).toBe('adaptation');
    expect(Object.keys(original.origins).some(path=>path.startsWith('typography.fonts.'))).toBe(false);
    expect(original.origins['typography.roles.body.lineHeight']).toBe('authored');
    const edited=resolveVisualContract('editorial-silence',{overrides:{fonts:original.typography.fonts}});
    expect(edited.typography.fonts).toEqual(original.typography.fonts);
    expect(edited.origins['typography.fonts']).toBe('override');
    expect(edited.typography.fonts.find(font=>font.family==='Noto Serif KR')).toMatchObject({source:'external',license:'OFL-1.1'});
  });
  it('keeps Latin faces first and prevents Korean shared Han coverage from preempting Japanese fallback',()=>{
    const editorial=resolveVisualContract('editorial-silence',{contentLocale:'ja'});
    expect(editorial.typography.roles.display.fontFamily).toBe("'Noto Serif JP', serif");
    expect(editorial.origins['typography.roles.display.fontFamily']).toBe('locale');
    expect(editorial.typography.fonts.some(font=>font.family==='Noto Serif KR')).toBe(true);
    const noir=resolveVisualContract('midnight-noir',{contentLocale:'ja'}).typography.roles.display.fontFamily;
    expect(noir.startsWith("'Cormorant Garamond'")).toBe(true);
    expect(noir).toContain("'Noto Serif JP'");expect(noir).not.toContain('Noto Serif KR');
    const korean=resolveVisualContract('editorial-silence',{contentLocale:'ko'}).typography.roles.display.fontFamily;
    expect(korean).toBe("'Noto Serif KR', serif");
    const source=resolveVisualContract('editorial-silence');
    expect(editorial.colors).toEqual(source.colors);
  });
  it('marks CSS generic font families as system-dependent rather than user-supplied assets',()=>{
    const spec=resolveVisualContract('editorial-silence');
    expect(spec.typography.fonts.find(font=>font.family==='ui-monospace')).toMatchObject({source:'system',availability:'system-dependent'});
    expect(spec.warnings.some(warning=>warning.includes("Font 'ui-monospace' is user supplied"))).toBe(false);
  });
  it('produces a deterministic library with a verifiable transport hash',()=>{
    const first=compileVisualLibrary();expect(compileVisualLibrary()).toBe(first);
    const {contentHash,...body}=JSON.parse(first);
    expect(contentHash).toBe(`sha256:${createHash('sha256').update(stableVisualJson(body)).digest('hex')}`);
    expect(Object.keys(body.contracts)).toHaveLength(48);
  });
});

describe('context-aware contrast and explicit repairs',()=>{
  it('uses unrounded WCAG ratios and composited foreground alpha including leading-dot decimals',()=>{
    expect(visualContrastRatio('#000','#fff')).toBe(21);
    expect(parseVisualColor('rgba(0,0,0,.45)')?.a).toBe(.45);
    expect(visualContrastRatio('rgba(0,0,0,.45)','#ffffff')).toBeCloseTo(visualContrastRatio('rgba(0,0,0,0.45)','#ffffff')!,12);
    expect(visualContrastRatio('#000','#ffffff00')).toBeNull();
    expect(parseVisualColor('#abcd')?.a).toBeCloseTo(221/255,12);
  });
  it('never marks unresolved glass or transparent backgrounds passing',()=>{
    expect(assessContrast(resolveVisualContract('glass-orbit')).find(p=>p.id==='body-panel')?.status).toBe('needs-rendered-review');
    const transparent=resolveVisualContract('brutalist-grid',{overrides:{colors:{canvas:'#ffffff00'}}});
    expect(assessContrast(transparent).find(p=>p.id==='body-canvas')?.status).toBe('needs-rendered-review');
    expect(assessContrast(transparent).find(p=>p.id==='decorative-separator')?.status).toBe('not-applicable');
  });
  it('checks actual action labels, focus, input boundaries and status text with their relevant thresholds',()=>{
    const checks=assessContrast(resolveVisualContract('brutalist-grid'));
    expect(checks.find(p=>p.id==='primary-action')).toMatchObject({threshold:4.5,foreground:'actionPrimaryText'});
    expect(checks.find(p=>p.id==='focus-canvas')).toMatchObject({threshold:3});
    expect(checks.find(p=>p.id==='critical-status')).toMatchObject({threshold:4.5});
  });
  it('leaves authored/edited values unchanged until an explicit repair is accepted',()=>{
    const overrides={colors:{text:'#eeeeee'}};const current=resolveVisualContract('brutalist-grid',{overrides});
    expect(current.colors.text).toBe('#eeeeee');expect(assessContrast(current).find(p=>p.id==='body-canvas')?.status).toBe('fail');
    const repair=proposeContrastRepairs(current).find(p=>p.role==='text')!;
    const accepted=resolveVisualContract('brutalist-grid',{overrides,acceptedRepairs:[repair]});
    expect(accepted.colors.text).toBe(repair.after);expect(accepted.repairs).toHaveLength(1);expect(accepted.origins['colors.text']).toBe('repair');
    expect(visualContractToCss(accepted)).toContain(`--color-text: ${repair.after};`);
    expect(()=>resolveVisualContract('brutalist-grid',{acceptedRepairs:[repair]})).toThrow(/stale/);
  });
});
