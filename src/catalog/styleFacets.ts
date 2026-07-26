// Recommendation facets for all 48 styles (04 §3.2, 05 §13 authoring rubric).
//
// HAND-AUTHORED catalog data — this is the highest-value content in the system:
// it drives the 7-dimension scoring engine (05 §4) and the golden suite (05 §12,14).
// Every facet value is grounded in the style's promptProfile + visualProfile prose
// in src/data/styles.ts. Enum values come ONLY from the closed ontology
// (src/catalog/ontology.ts). Invariants enforced here and by the integrity tests
// (04 §3.3): tones ∩ antiTones = ∅; styles whose notIdealFor names
// finance/trust/healthcare never carry trust:'high'; daily-unfriendly styles omit
// usageFrequency:'daily'.

import type { RecommendationFacets, NotIdealMap } from './types';

/* ------------------------------------------------------------------ */
/* notIdealFor free phrase → productType[]  (04 §3.2.1, one-time human  */
/* mapping). PRODUCT_NOT_IDEAL hard-reject (05 §5.1) reads ONLY this    */
/* table — no automatic string matching. Keys are the 115 distinct      */
/* phrases that appear across styles.ts promptProfile.notIdealFor.      */
/* ------------------------------------------------------------------ */

export const notIdealMap: NotIdealMap = {
  // --- B2B / operational / admin ---
  'B2B SaaS': ['operational-saas'],
  'B2B SaaS dashboards': ['operational-saas', 'data-analytics'],
  'B2B admin': ['operational-saas'],
  'B2B operational dashboards': ['operational-saas', 'data-analytics'],
  'B2B trust products': ['operational-saas', 'finance-admin'],
  'admin and data dashboards': ['operational-saas', 'data-analytics'],
  'admin dashboards': ['operational-saas'],
  'admin tools': ['operational-saas'],
  'corporate enterprise dashboards': ['operational-saas', 'data-analytics'],
  'enterprise B2B': ['operational-saas'],
  'enterprise B2B trust products': ['operational-saas', 'finance-admin'],
  'enterprise SaaS': ['operational-saas'],
  'enterprise admin': ['operational-saas'],
  'enterprise admin dashboards': ['operational-saas'],
  'modern enterprise SaaS': ['operational-saas'],
  'professional B2B': ['operational-saas'],
  'professional services': ['operational-saas', 'finance-admin'],
  'operational dashboards': ['operational-saas'],
  'operations dashboards': ['operational-saas'],
  'feature-rich SaaS': ['operational-saas'],
  'consumer SaaS': ['consumer-app'],
  'consumer SaaS landing': ['consumer-app', 'campaign'],

  // --- data / analytics / density ---
  'data visualization tools': ['data-analytics'],
  'dense data dashboards': ['data-analytics', 'operational-saas'],
  'financial dashboards': ['finance-admin', 'data-analytics'],
  'finance dashboards': ['finance-admin', 'data-analytics'],
  'financial reporting': ['finance-admin', 'data-analytics'],
  'high-density admin tools': ['operational-saas', 'data-analytics'],
  'high-density dashboards': ['operational-saas', 'data-analytics'],
  'high-density data': ['data-analytics', 'operational-saas'],
  'high-density data UI': ['data-analytics', 'operational-saas'],
  'high-density data tools': ['data-analytics', 'operational-saas'],

  // --- developer / security ---
  'developer dashboards': ['developer-tool', 'operational-saas'],
  'developer tools': ['developer-tool'],
  'security or dev tools': ['security-console', 'developer-tool'],
  'security products': ['security-console'],

  // --- finance / legal / trust ---
  'finance applications': ['finance-admin'],
  'finance or legal': ['finance-admin'],
  'finance or legal products': ['finance-admin'],
  'finance or legal trust products': ['finance-admin'],
  'finance trust products': ['finance-admin', 'commerce'],
  'financial products needing sober trust': ['finance-admin'],
  'financial trust products': ['finance-admin', 'commerce'],
  'legal or financial trust products': ['finance-admin'],

  // --- healthcare / medical ---
  'healthcare': ['healthcare-portal'],
  'healthcare apps': ['healthcare-portal'],
  'medical or legal products': ['healthcare-portal', 'finance-admin'],

  // --- commerce ---
  'consumer commerce': ['commerce', 'consumer-app'],
  'e-commerce': ['commerce'],
  'flash commerce': ['commerce', 'campaign'],
  'lifestyle commerce': ['commerce', 'consumer-app'],
  'luxury commerce': ['commerce'],

  // --- documentation / knowledge ---
  'documentation sites': ['documentation'],
  'editorial documentation': ['documentation', 'content-editorial'],
  'long-form documentation': ['documentation'],

  // --- editorial / content / publications ---
  'content-heavy sites': ['content-editorial'],
  'editorial content sites': ['content-editorial'],
  'editorial long-form': ['content-editorial'],
  'editorial pages': ['content-editorial'],
  'editorial publications': ['content-editorial'],
  'illustrative storytelling': ['content-editorial'],
  'long-form editorial': ['content-editorial'],
  'print-style editorial': ['content-editorial'],
  'storytelling pages': ['content-editorial'],

  // --- portfolio / art ---
  'art portfolios': ['portfolio'],

  // --- campaign / marketing / launch ---
  'campaign sites': ['campaign'],
  'consumer marketing': ['campaign'],
  'consumer marketing pages': ['campaign'],
  'creator launches': ['campaign'],
  'gaming launches': ['campaign', 'consumer-app'],
  'gaming or tech launches': ['campaign', 'consumer-app'],
  'high-energy campaigns': ['campaign'],
  'high-energy launches': ['campaign'],
  'marketing campaigns': ['campaign'],
  'marketing landing pages': ['campaign'],
  'modern SaaS landing pages': ['campaign', 'operational-saas'],
  'pricing-heavy marketing pages': ['campaign', 'commerce'],

  // --- consumer / lifestyle / playful ---
  'casual consumer apps': ['consumer-app'],
  'casual gaming': ['consumer-app'],
  'children and education': ['consumer-app'],
  'children or education products': ['consumer-app'],
  'children products': ['consumer-app'],
  'kids / education': ['consumer-app'],
  'consumer entertainment': ['consumer-app'],
  'fast small-screen consumer apps': ['consumer-app'],
  'gaming': ['consumer-app'],
  'gaming UI': ['consumer-app'],
  'gaming and entertainment': ['consumer-app'],
  'gaming and playful apps': ['consumer-app'],
  'gaming or security': ['consumer-app', 'security-console'],
  'real-time games': ['consumer-app'],
  'lifestyle apps': ['consumer-app'],
  'pastel consumer apps': ['consumer-app'],
  'playful consumer apps': ['consumer-app'],
  'playful consumer products': ['consumer-app'],
  'playful onboarding': ['consumer-app'],

  // --- wellness / craft / lifestyle brands ---
  'craft and wellness': ['consumer-app', 'commerce'],
  'craft or lifestyle brands': ['consumer-app', 'commerce'],
  'craft or wellness brands': ['consumer-app', 'commerce'],
  'lifestyle / wellness': ['consumer-app'],
  'lifestyle/wellness': ['consumer-app'],
  'wellness and lifestyle': ['consumer-app'],
  'wellness and lifestyle apps': ['consumer-app'],
  'wellness apps': ['consumer-app'],
  'wellness brands': ['consumer-app', 'commerce'],
  'wellness or craft brands': ['consumer-app', 'commerce'],

  // --- luxury brand ---
  'luxury brand sites': ['commerce', 'portfolio'],
  'luxury monochrome brands': ['commerce', 'portfolio'],
  'premium luxury': ['commerce', 'portfolio'],

  // --- retro / nostalgic ---
  'retro or nostalgic products': ['consumer-app'],
  'retro products': ['consumer-app'],

  // --- cross-cutting non-product constraints (mapped to closest product) ---
  'accessibility-critical products': ['healthcare-portal', 'operational-saas'],
  'cyber / hacker identities': ['security-console'],
  'low-motion contexts': ['documentation', 'operational-saas'],
  'maximalist / Y2K': ['consumer-app'],
};

/* ------------------------------------------------------------------ */
/* RecommendationFacets — all 48 styles                               */
/* ------------------------------------------------------------------ */

export const styleFacets: Record<string, RecommendationFacets> = {
  /* ============================ STYLES (32) ============================ */

  // Raw heavy grid, attitude; bestFor developer tools / manifestos / launch
  // pages. notIdealFor: healthcare, children, wellness, finance trust → no high trust.
  'brutalist-grid': {
    productTypes: ['developer-tool', 'campaign', 'portfolio'],
    tones: ['bold', 'editorial', 'technical'],
    antiTones: ['calm', 'premium', 'playful'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'read', 'structure', 'attention'],
    risks: ['harsh contrast', 'abrupt hover', 'unforgiving alignment'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Magazine restraint; essays / portfolios / premium docs. notIdeal: gaming,
  // flash commerce, dev dashboards, high-energy campaigns.
  'editorial-silence': {
    productTypes: ['content-editorial', 'portfolio', 'documentation', 'knowledge-base'],
    tones: ['editorial', 'calm', 'premium'],
    antiTones: ['bold', 'playful', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['read', 'author', 'browse', 'long-form legibility'],
    risks: ['low information density', 'subtle borders', 'understated hierarchy'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Loud immediate posters; campaigns / events / creator products. notIdeal:
  // B2B ops dashboards, enterprise admin, financial reporting, medical/legal.
  'kinetic-pop': {
    productTypes: ['campaign', 'consumer-app', 'portfolio'],
    tones: ['bold', 'playful', 'experimental'],
    antiTones: ['calm', 'technical', 'trustworthy'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'attention', 'energy'],
    risks: ['ambient motion', 'decorative spectacle', 'staggered entrances'],
    motionIntensity: 'high',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Neon glitch terminal; security / game launchers / crypto. notIdeal:
  // healthcare, financial trust, children, editorial → no high trust.
  'cyberpunk-glitch': {
    productTypes: ['security-console', 'consumer-app', 'campaign'],
    tones: ['bold', 'technical', 'experimental'],
    antiTones: ['calm', 'trustworthy', 'premium'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['monitor', 'browse', 'attention', 'tech mood'],
    risks: ['continuous motion', 'glitch flicker', 'dark-only palette', 'low contrast'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // International Typographic Style; information products / guides / studios.
  // notIdeal: casual consumer apps, playful onboarding, gaming UI, storytelling.
  'swiss-poster': {
    productTypes: ['documentation', 'content-editorial', 'portfolio', 'knowledge-base'],
    tones: ['editorial', 'technical', 'bold'],
    antiTones: ['playful', 'experimental', 'premium'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['read', 'browse', 'compare', 'structure'],
    risks: ['rigid grid', 'low decoration tolerance'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Calm operations SaaS; B2B SaaS / ops dashboards / admin tools. Favors
  // scanning, repeated work, trust. notIdeal: consumer marketing, creator
  // launches, campaign sites, gaming.
  'quiet-utility': {
    productTypes: ['operational-saas', 'data-analytics', 'developer-tool', 'finance-admin', 'healthcare-portal', 'security-console'],
    tones: ['calm', 'technical', 'trustworthy'],
    antiTones: ['bold', 'playful', 'experimental'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['monitor', 'manage', 'configure', 'review', 'scan', 'triage', 'communicate', 'schedule'],
    risks: ['understated hierarchy', 'subtle borders'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Deployable platform; developer platforms / SaaS onboarding / API products.
  // notIdeal: playful consumer, lifestyle apps, editorial, art portfolios.
  'platform-core': {
    productTypes: ['developer-tool', 'operational-saas', 'documentation', 'ai-chat', 'healthcare-portal', 'data-analytics', 'security-console', 'finance-admin'],
    tones: ['technical', 'trustworthy', 'calm'],
    antiTones: ['playful', 'experimental', 'bold'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['onboard', 'configure', 'manage', 'read', 'navigate', 'triage', 'communicate', 'schedule', 'upload'],
    risks: ['restrained novelty', 'documentation-heavy'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Runtime dashboard + reference manual; observability / infra dashboards /
  // technical docs. notIdeal: consumer marketing, lifestyle, storytelling, kids.
  'runtime-signal': {
    productTypes: ['operational-saas', 'developer-tool', 'documentation', 'data-analytics', 'security-console'],
    tones: ['technical', 'calm', 'trustworthy'],
    antiTones: ['playful', 'experimental', 'premium'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['monitor', 'analyze', 'read', 'audit', 'status legibility', 'triage'],
    risks: ['dark-only palette', 'glow overuse', 'low-contrast code'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Iridescent fluid mesh; AI tools / creative portfolios / premium launches.
  // notIdeal: enterprise admin, financial dashboards, docs, high-density data.
  'holographic-fluid': {
    productTypes: ['ai-chat', 'portfolio', 'campaign'],
    tones: ['experimental', 'premium', 'bold'],
    antiTones: ['technical', 'trustworthy', 'calm'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'depth', 'atmosphere'],
    risks: ['continuous motion', 'ambient motion', 'low contrast', 'dark-only palette'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // Nightlife neon SaaS/creator; music tools / AI launches / creative apps.
  // notIdeal: enterprise B2B, healthcare, legal/financial trust, editorial.
  'neon-drift': {
    productTypes: ['consumer-app', 'campaign', 'ai-chat', 'portfolio'],
    tones: ['bold', 'experimental', 'premium'],
    antiTones: ['calm', 'trustworthy', 'editorial'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'energy', 'glow accents'],
    risks: ['ambient motion', 'dark-only palette', 'low contrast', 'glow overuse'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // Orbital glass with clean product feel; finance apps / AI dashboards /
  // premium SaaS. notIdeal: high-density admin, editorial docs, wellness, retro.
  'glass-orbit': {
    productTypes: ['finance-admin', 'ai-chat', 'operational-saas', 'data-analytics'],
    tones: ['premium', 'technical', 'calm'],
    antiTones: ['playful', 'editorial', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['monitor', 'analyze', 'browse', 'depth'],
    risks: ['subtle borders', 'low contrast', 'blur overuse'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Developer console narrative; CLIs / developer tools / automation products.
  // notIdeal: consumer SaaS, marketing campaigns, editorial, wellness.
  'terminal-core': {
    productTypes: ['developer-tool', 'operational-saas', 'documentation', 'security-console'],
    tones: ['technical', 'bold', 'editorial'],
    antiTones: ['playful', 'premium', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['low', 'medium'],
    strengths: ['configure', 'monitor', 'read', 'author', 'command flow'],
    risks: ['monospace-only legibility', 'dark-only palette'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Dark luxury with gold; luxury commerce / private memberships / premium
  // services. notIdeal: developer tools, ops dashboards, casual apps, children.
  'midnight-noir': {
    productTypes: ['commerce', 'portfolio', 'campaign'],
    tones: ['premium', 'editorial', 'bold'],
    antiTones: ['playful', 'technical', 'calm'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['browse', 'purchase', 'read', 'atmosphere'],
    risks: ['dark-only palette', 'slow reveals', 'low contrast'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Dark onboarding console; onboarding / CLI products / beta launches.
  // notIdeal: marketing landing, editorial, consumer commerce, luxury.
  'console-launch': {
    productTypes: ['developer-tool', 'operational-saas', 'ai-chat'],
    tones: ['technical', 'calm', 'bold'],
    antiTones: ['premium', 'playful', 'editorial'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['low', 'medium'],
    strengths: ['onboard', 'configure', 'monitor', 'navigate'],
    risks: ['dark-only palette', 'utility-first tone'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Friendly bento for multiple features; consumer SaaS / productivity /
  // feature pages. notIdeal: luxury, editorial, security/dev, finance trust.
  'bento-bloom': {
    productTypes: ['consumer-app', 'campaign', 'commerce'],
    tones: ['playful', 'calm', 'editorial'],
    antiTones: ['bold', 'technical', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'compare', 'onboard', 'modular features', 'checkout', 'communicate'],
    risks: ['pastel wash', 'low contrast'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Warm tactile craft; wellness / studios / food and craft brands. notIdeal:
  // developer tools, gaming/tech launches, corporate dashboards, high-density.
  'earth-atelier': {
    productTypes: ['portfolio', 'commerce', 'content-editorial', 'consumer-app'],
    tones: ['calm', 'premium', 'editorial'],
    antiTones: ['technical', 'bold', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'read', 'purchase', 'warmth'],
    risks: ['low information density', 'organic asymmetry'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Reflective premium tech; hardware / luxury tech / automotive. notIdeal:
  // B2B SaaS dashboards, editorial content, wellness, children/education.
  'liquid-metal': {
    productTypes: ['portfolio', 'commerce', 'campaign'],
    tones: ['premium', 'bold', 'technical'],
    antiTones: ['playful', 'editorial', 'calm'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['browse', 'purchase', 'material presence'],
    risks: ['dark-only palette', 'specular spectacle', 'low contrast'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Cosmic atmospheric hero; AI products / creative launches / media pages.
  // notIdeal: operational dashboards, docs, finance trust, admin tools.
  'aurora-gradient': {
    productTypes: ['ai-chat', 'campaign', 'content-editorial', 'portfolio'],
    tones: ['experimental', 'bold', 'premium'],
    antiTones: ['technical', 'trustworthy', 'calm'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'atmosphere', 'immersion'],
    risks: ['continuous motion', 'ambient motion', 'low contrast'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // Extreme whitespace serif; galleries / mindfulness / premium portfolios.
  // notIdeal: dense data dashboards, gaming, high-energy campaigns, feature SaaS.
  'zen-minimalism': {
    productTypes: ['portfolio', 'content-editorial', 'consumer-app'],
    tones: ['calm', 'premium', 'editorial'],
    antiTones: ['bold', 'technical', 'playful'],
    density: ['low'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['read', 'browse', 'breathing space'],
    risks: ['low information density', 'subtle borders', 'minimal motion'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Typography-as-interface monochrome; docs / archives / minimal portfolios.
  // notIdeal: marketing campaigns, consumer commerce, gaming, data viz.
  'mono-type': {
    productTypes: ['documentation', 'content-editorial', 'portfolio', 'knowledge-base'],
    tones: ['editorial', 'technical', 'calm'],
    antiTones: ['playful', 'premium', 'experimental'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['read', 'author', 'browse', 'type hierarchy'],
    risks: ['no color cues', 'understated hierarchy'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Two-color media system; music apps / media libraries / creator tools.
  // notIdeal: B2B admin, finance dashboards, docs, wellness.
  'duotone-bold': {
    productTypes: ['consumer-app', 'content-editorial', 'campaign'],
    tones: ['bold', 'playful', 'editorial'],
    antiTones: ['calm', 'trustworthy', 'technical'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'read', 'navigate', 'media rails'],
    risks: ['dark-only palette', 'two-color limit'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Polished consumer-tech mesh; consumer apps / AI writing / landing pages.
  // notIdeal: developer tools, admin/data dashboards, editorial docs, craft.
  'mesh-gradient': {
    productTypes: ['consumer-app', 'ai-chat', 'campaign', 'commerce'],
    tones: ['premium', 'calm', 'playful'],
    antiTones: ['technical', 'editorial', 'bold'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'compare', 'soft depth', 'checkout', 'communicate', 'upload'],
    risks: ['ambient motion', 'low contrast', 'gradient overuse'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Motion-first SaaS landing; motion tools / SaaS launches / AI products.
  // notIdeal: accessibility-critical, docs, long-form editorial, low-motion.
  'framer-motion': {
    productTypes: ['campaign', 'ai-chat', 'consumer-app', 'developer-tool'],
    tones: ['bold', 'experimental', 'premium'],
    antiTones: ['calm', 'editorial', 'trustworthy'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'reveal timing', 'hover depth', 'communicate', 'upload'],
    risks: ['continuous motion', 'heavy animation', 'dark-only palette'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // Puffy friendly clay; education / wellness / creator tools. notIdeal:
  // professional B2B, finance/legal, developer tools, security.
  'claymorphism': {
    productTypes: ['consumer-app', 'campaign', 'ai-chat'],
    tones: ['playful', 'calm'],
    antiTones: ['technical', 'premium', 'editorial'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['onboard', 'browse', 'tactile controls'],
    risks: ['stacked shadows', 'low contrast', 'playful-only tone'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Soft hardware-like controls; settings panels / calculators / IoT controls.
  // notIdeal: content-heavy sites, editorial, marketing campaigns, high-density.
  'neumorphism': {
    productTypes: ['consumer-app', 'other'],
    tones: ['calm', 'technical', 'playful'],
    antiTones: ['bold', 'editorial', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['low', 'medium'],
    strengths: ['configure', 'manage', 'tactile controls'],
    risks: ['low contrast', 'subtle borders', 'embossed legibility'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Gentle pastel pills; personal apps / lifestyle products / journals.
  // notIdeal: enterprise B2B, developer tools, finance/legal, gaming/security.
  'soft-pastel': {
    productTypes: ['consumer-app', 'content-editorial', 'campaign', 'healthcare-portal'],
    tones: ['calm', 'playful'],
    antiTones: ['bold', 'technical', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'author', 'read', 'gentle tone', 'communicate', 'schedule'],
    risks: ['low contrast', 'pastel wash', 'subtle borders'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // Clean productivity UI; knowledge bases / dashboards / collaboration tools.
  // notIdeal: marketing landing, gaming, high-energy launches, luxury commerce.
  'notion-style': {
    productTypes: ['knowledge-base', 'documentation', 'operational-saas', 'content-editorial'],
    tones: ['calm', 'editorial', 'technical'],
    antiTones: ['bold', 'playful', 'experimental'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['author', 'read', 'manage', 'navigate', 'search'],
    risks: ['minimal chrome', 'subtle dividers'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // 8-bit pixel art; games / communities / collectibles. notIdeal: B2B SaaS,
  // professional services, finance/legal, enterprise admin, wellness.
  'retro-pixel': {
    productTypes: ['consumer-app', 'campaign', 'portfolio'],
    tones: ['playful', 'bold', 'experimental'],
    antiTones: ['calm', 'trustworthy', 'premium'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'nostalgia', 'game mood'],
    risks: ['stepped animation', 'pixel legibility', 'small hit targets'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Retro Windows 98 desktop; retro docs / launchers / indie tools. notIdeal:
  // modern enterprise SaaS, finance/legal trust, wellness, premium luxury.
  'y2k-retro': {
    productTypes: ['consumer-app', 'portfolio', 'campaign', 'documentation'],
    tones: ['playful', 'experimental', 'editorial'],
    antiTones: ['premium', 'trustworthy', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'navigate', 'nostalgia', 'desktop metaphor'],
    risks: ['compact spacing', 'instant pressed states', 'dated chrome'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Print-shop riso aesthetic; art projects / zines / creative studios.
  // notIdeal: developer dashboards, finance applications, enterprise SaaS, high-density.
  'risograph-print': {
    productTypes: ['portfolio', 'content-editorial', 'campaign'],
    tones: ['editorial', 'playful', 'experimental'],
    antiTones: ['technical', 'trustworthy', 'premium'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'read', 'tactile texture', 'print character'],
    risks: ['spot-color limit', 'low contrast', 'paper texture noise'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Handcrafted layered paper; education / craft brands / story pages.
  // notIdeal: developer tools, B2B SaaS dashboards, finance/legal, high-density.
  'paper-cut': {
    productTypes: ['content-editorial', 'consumer-app', 'portfolio', 'campaign'],
    tones: ['playful', 'calm', 'editorial'],
    antiTones: ['technical', 'trustworthy', 'bold'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['read', 'browse', 'onboard', 'tactile depth'],
    risks: ['directional shadow upkeep', 'low information density'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // Native Apple translucent desktop; macOS apps / admin dashboards / creative
  // tools. notIdeal: print editorial, craft/wellness, gaming, retro.
  'macos-liquid-glass': {
    productTypes: ['operational-saas', 'consumer-app', 'developer-tool', 'data-analytics', 'commerce'],
    tones: ['premium', 'calm', 'technical'],
    antiTones: ['playful', 'experimental', 'editorial'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['manage', 'configure', 'navigate', 'native familiarity', 'checkout'],
    risks: ['low contrast', 'busy glass legibility', 'blur overuse'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'high',
  },

  /* ============================ FUSIONS (16) ============================ */

  // fusionOf neon-drift + swiss-poster. Swiss grid holds neon drama. bestFor
  // AI dashboards / event tech / launch pages. notIdeal: wellness, editorial
  // long-form, children, craft/lifestyle.
  'fusion-neon-swiss': {
    productTypes: ['ai-chat', 'campaign', 'data-analytics', 'portfolio'],
    tones: ['bold', 'technical', 'experimental'],
    antiTones: ['calm', 'playful', 'premium'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'monitor', 'structure', 'glow accents'],
    risks: ['ambient motion', 'dark-only palette', 'glow overuse'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'high',
  },

  // fusionOf swiss-poster + platform-core + kinetic-pop. Crisp product
  // marketing, clean and real. bestFor collaboration tools / design systems /
  // AI product builders / creative SaaS launches. notIdeal: gaming, craft/
  // wellness, luxury commerce, long-form editorial.
  'fusion-product-swiss': {
    productTypes: ['operational-saas', 'campaign', 'developer-tool', 'ai-chat'],
    tones: ['editorial', 'playful', 'technical'],
    antiTones: ['premium', 'experimental', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['browse', 'compare', 'onboard', 'structure', 'product framing'],
    risks: ['governed color discipline', 'staggered reveals'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf bento-bloom + midnight-noir. Modular dark luxury for feature-rich
  // premium platforms. bestFor premium SaaS / membership / finance. notIdeal:
  // developer tools, craft/wellness, children/education, playful consumer apps.
  'fusion-bento-noir': {
    productTypes: ['finance-admin', 'commerce', 'operational-saas', 'data-analytics'],
    tones: ['premium', 'bold', 'editorial'],
    antiTones: ['playful', 'experimental', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['browse', 'compare', 'monitor', 'modular features'],
    risks: ['dark-only palette', 'sparse gold restraint', 'low contrast'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf editorial-silence + terminal-core. Reference/manual with console
  // texture. bestFor technical docs / release pages / developer education.
  // notIdeal: marketing landing, consumer commerce, wellness, gaming.
  'fusion-editorial-terminal': {
    productTypes: ['documentation', 'developer-tool', 'knowledge-base', 'content-editorial'],
    tones: ['editorial', 'technical', 'calm'],
    antiTones: ['playful', 'premium', 'bold'],
    density: ['medium', 'high'],
    usageFrequency: ['occasional', 'daily'],
    trust: ['medium', 'high'],
    strengths: ['read', 'author', 'analyze', 'long-form legibility'],
    risks: ['dark-only palette', 'monospace density'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf holographic-fluid + glass-orbit. Iridescent premium glass for AI/
  // creator. bestFor AI tools / creative suites / premium dashboards. notIdeal:
  // admin dashboards, finance/legal, editorial docs, craft/wellness.
  'fusion-holo-glass': {
    productTypes: ['ai-chat', 'portfolio', 'campaign'],
    tones: ['experimental', 'premium', 'bold'],
    antiTones: ['technical', 'trustworthy', 'calm'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'depth', 'atmosphere'],
    risks: ['continuous motion', 'ambient motion', 'low contrast', 'dark-only palette'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // fusionOf kinetic-pop + brutalist-grid. Maximum energy with structural
  // guardrails. bestFor campaign pages / events / creator drops. notIdeal:
  // B2B trust products, finance/legal, wellness, documentation.
  'fusion-kinetic-brutal': {
    productTypes: ['campaign', 'portfolio', 'consumer-app'],
    tones: ['bold', 'experimental', 'playful'],
    antiTones: ['calm', 'trustworthy', 'premium'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'onboard', 'attention', 'impact'],
    risks: ['ambient motion', 'decorative spectacle', 'abrupt section shifts', 'harsh contrast'],
    motionIntensity: 'high',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf cyberpunk-glitch + console-launch. Dangerous, technical, fast
  // launch console. bestFor security launches / game ops / automation tools.
  // notIdeal: wellness, consumer commerce, editorial, children.
  'fusion-cyber-console': {
    productTypes: ['security-console', 'developer-tool', 'campaign'],
    tones: ['bold', 'technical', 'experimental'],
    antiTones: ['calm', 'premium', 'trustworthy'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['monitor', 'configure', 'attention', 'tech mood'],
    risks: ['continuous motion', 'glitch flicker', 'dark-only palette', 'low contrast'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // fusionOf mono-type. Analog grain monochrome reading. bestFor editorial
  // archives / music writing / zines. notIdeal: developer dashboards,
  // enterprise admin, gaming, high-density data.
  'fusion-grain-mono': {
    productTypes: ['content-editorial', 'portfolio', 'knowledge-base', 'documentation'],
    tones: ['editorial', 'calm', 'premium'],
    antiTones: ['technical', 'bold', 'playful'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['read', 'author', 'browse', 'long-form legibility'],
    risks: ['grain texture noise', 'low information density', 'subtle borders'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // fusionOf claymorphism + aurora-gradient. Playful polished motion for
  // onboarding/learning. bestFor education / AI companions / creative
  // onboarding. notIdeal: enterprise B2B, developer tools, finance/legal, gaming.
  'fusion-clay-aurora': {
    productTypes: ['consumer-app', 'ai-chat', 'campaign'],
    tones: ['playful', 'experimental', 'calm'],
    antiTones: ['technical', 'trustworthy', 'premium'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['onboard', 'browse', 'tactile controls', 'atmosphere'],
    risks: ['continuous motion', 'ambient motion', 'low contrast'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // fusionOf y2k-retro + terminal-core. Win98 chrome + phosphor terminal.
  // bestFor retro launchers / developer toys / playful CLIs / creative
  // portfolios. notIdeal: enterprise B2B trust, finance/legal, wellness, modern SaaS.
  'fusion-floppy-exe': {
    productTypes: ['developer-tool', 'portfolio', 'consumer-app', 'campaign'],
    tones: ['playful', 'technical', 'experimental'],
    antiTones: ['premium', 'trustworthy', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'configure', 'nostalgia', 'desktop metaphor'],
    risks: ['instant pressed states', 'dated chrome', 'compact spacing'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf midnight-noir + liquid-metal. Cinematic warm-black, one amber
  // light, one photo per floor. bestFor cinematic brand pages / archival
  // institutions / real-estate towers / venue presentations. notIdeal:
  // e-commerce, children, pastel consumer apps, casual gaming.
  'fusion-noir-metal': {
    productTypes: ['portfolio', 'campaign', 'content-editorial', 'commerce'],
    tones: ['premium', 'editorial', 'bold'],
    antiTones: ['playful', 'technical', 'calm'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['browse', 'read', 'cinematic atmosphere'],
    risks: ['dark-only palette', 'scroll-snap spectacle', 'low contrast'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'high',
  },

  // fusionOf swiss-poster + quiet-utility. B2B SaaS landing as a SOLARI
  // split-flap board, true-black/amber, mechanical kinetic. bestFor B2B SaaS
  // landings with kinetic signature / design system & devtool launches /
  // fintech & ops console marketing / cinematic mechanical motion. notIdeal:
  // lifestyle commerce, wellness, children, consumer entertainment. Respects
  // prefers-reduced-motion (flap animations disabled).
  'fusion-strict-console': {
    productTypes: ['campaign', 'developer-tool'],
    tones: ['bold', 'technical', 'premium'],
    antiTones: ['playful', 'calm', 'experimental'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium'],
    strengths: ['browse', 'compare', 'structure', 'mechanical signature'],
    risks: ['continuous motion', 'split-flap spectacle', 'dark-only palette'],
    motionIntensity: 'high',
    continuousSpectacle: true,
    maintenanceComplexity: 'high',
  },

  // fusionOf brutalist-grid + mono-type. Studio manifesto as a draughtsman's
  // technical drawing sheet. bestFor design studios / tech-aesthetic manifesto
  // pages / architecture/industrial-design firms / earned editorial about-pages.
  // notIdeal: e-commerce, consumer SaaS landing, gaming, lifestyle/wellness.
  // No layout motion (only 200ms colour transitions on hover).
  'fusion-quiet-manifesto': {
    productTypes: ['portfolio', 'content-editorial', 'documentation', 'knowledge-base'],
    tones: ['editorial', 'technical', 'premium'],
    antiTones: ['playful', 'bold', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['read', 'browse', 'structure', 'drafting precision'],
    risks: ['monospace density', 'specimen-only legibility'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf midnight-noir + platform-core. Linear-tier true-black SaaS
  // marketing, zero chroma, typographic hierarchy, Linear-tier restraint.
  // bestFor B2B SaaS marketing / developer infrastructure / devtool landings /
  // product startup home pages. notIdeal: playful consumer apps, lifestyle/
  // wellness, kids/education, maximalist/Y2K.
  'fusion-pure-noir': {
    productTypes: ['developer-tool', 'operational-saas', 'campaign', 'ai-chat', 'finance-admin'],
    tones: ['premium', 'technical', 'editorial'],
    antiTones: ['playful', 'experimental', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['medium', 'high'],
    strengths: ['browse', 'compare', 'read', 'structure'],
    risks: ['dark-only palette', 'no accent chroma', 'subtle borders'],
    motionIntensity: 'low',
    continuousSpectacle: false,
    maintenanceComplexity: 'low',
  },

  // fusionOf neumorphism + editorial-silence. Quiet near-white editorial with
  // dual-shadow breathing frames (8s box-shadow cycle) + cursor-driven micro
  // saturation. bestFor studio launch pages / quiet small-box products /
  // premium single-product launches / minimal photo portfolios. notIdeal:
  // operations dashboards, real-time games, cyber/hacker, fast consumer apps,
  // pricing-heavy marketing.
  'fusion-soft-inflate': {
    productTypes: ['portfolio', 'content-editorial', 'campaign', 'commerce'],
    tones: ['calm', 'editorial', 'premium'],
    antiTones: ['technical', 'bold', 'experimental'],
    density: ['low', 'medium'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['read', 'browse', 'soft depth', 'curated photography'],
    risks: ['ambient motion', 'low information density', 'subtle borders'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },

  // fusionOf retro-pixel + swiss-poster + platform-core. Clean agency type
  // interrupted by pixel utility type + crooked service ticket board. bestFor
  // digital studios / branding agencies / web-app service landings /
  // productized creative services. notIdeal: enterprise admin dashboards,
  // financial sober-trust products, long-form documentation, luxury monochrome.
  'fusion-studio-pixel': {
    productTypes: ['portfolio', 'campaign', 'consumer-app', 'commerce'],
    tones: ['playful', 'editorial', 'bold'],
    antiTones: ['premium', 'trustworthy', 'calm'],
    density: ['medium', 'high'],
    usageFrequency: ['one-off', 'occasional'],
    trust: ['low', 'medium'],
    strengths: ['browse', 'compare', 'navigate', 'service framing'],
    risks: ['pixel legibility', 'hard-shadow upkeep', 'asymmetric layout'],
    motionIntensity: 'medium',
    continuousSpectacle: false,
    maintenanceComplexity: 'medium',
  },
};
