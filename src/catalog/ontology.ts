// Closed ontology vocabulary (04 §2). Normalization, hard-reject, and facet
// authoring use ONLY these values. Adding a term is an explicit catalog change.

import { t } from './localization';
import type {
  Ontology, OntologyTerm, ConstraintMapping, ProductType,
} from './types';

const productTypes: OntologyTerm[] = [
  { value: 'operational-saas', label: t('Operational SaaS', '운영형 SaaS', '運用系SaaS'),
    aliases: ['ops dashboard', 'dashboard', 'admin console', 'monitoring', 'observability', 'sre', 'control panel', 'helpdesk', 'help desk', 'ticketing', 'support queue', '대시보드', '운영', '관제', '헬프데스크', '監視', '管理画面', '運用'] },
  { value: 'developer-tool', label: t('Developer tool', '개발자 도구', '開発者ツール'),
    aliases: ['devtool', 'cli', 'sdk', 'api client', 'ide', '개발도구', '개발자', '開発', 'ツール'] },
  { value: 'documentation', label: t('Documentation', '문서/레퍼런스', 'ドキュメント'),
    aliases: ['docs', 'api docs', 'reference', 'guide', 'manual', '문서', '레퍼런스', 'ドキュメント', '資料'] },
  { value: 'data-analytics', label: t('Data analytics', '데이터 분석', 'データ分析'),
    aliases: ['analytics', 'bi', 'reporting', 'metrics', 'charts', 'data viz', '분석', '리포트', '지표', '分析', 'レポート'] },
  { value: 'security-console', label: t('Security console', '보안 콘솔', 'セキュリティコンソール'),
    aliases: ['security', 'siem', 'threat', 'audit log', 'access control', '보안', '위협', '監査', 'セキュリティ'] },
  { value: 'finance-admin', label: t('Finance admin', '금융/정산 관리', '金融管理'),
    aliases: ['finance', 'fintech', 'billing', 'ledger', 'payments admin', 'trading', '금융', '정산', '결제', '金融', '会計', '決済'] },
  { value: 'healthcare-portal', label: t('Healthcare portal', '헬스케어 포털', 'ヘルスケアポータル'),
    aliases: ['healthcare', 'medical', 'patient', 'clinical', 'ehr', '의료', '헬스케어', '환자', '医療', '患者'] },
  { value: 'commerce', label: t('Commerce', '커머스/쇼핑', 'コマース'),
    aliases: ['ecommerce', 'shop', 'store', 'cart', 'checkout', 'retail', '쇼핑', '커머스', '스토어', '通販', 'EC', 'ショップ'] },
  { value: 'ai-chat', label: t('AI chat', 'AI 챗', 'AIチャット'),
    aliases: ['chat', 'chatbot', 'chat bot', 'chat widget', 'assistant', 'conversational', 'llm', 'copilot', '챗봇', '대화', 'チャット', 'チャットボット', 'アシスタント'] },
  { value: 'content-editorial', label: t('Content / editorial', '콘텐츠/에디토리얼', 'コンテンツ/編集'),
    aliases: ['editorial', 'magazine', 'blog', 'news', 'publication', 'cms', '에디토리얼', '매거진', '블로그', '編集', '記事', 'ブログ'] },
  { value: 'knowledge-base', label: t('Knowledge base', '지식베이스', 'ナレッジベース'),
    aliases: ['kb', 'wiki', 'help center', 'faq', 'support docs', '지식', '위키', '도움말', 'ヘルプ', 'ナレッジ'] },
  { value: 'portfolio', label: t('Portfolio', '포트폴리오', 'ポートフォリオ'),
    aliases: ['portfolio', 'showcase', 'personal site', 'studio site', 'agency', '포트폴리오', '쇼케이스', '作品集', 'ポートフォリオ'] },
  { value: 'campaign', label: t('Campaign / launch', '캠페인/런치', 'キャンペーン'),
    aliases: ['landing', 'launch', 'promo', 'event', 'marketing', 'product launch', '랜딩', '캠페인', '런치', 'ランディング', 'キャンペーン', '告知'] },
  { value: 'consumer-app', label: t('Consumer app', '소비자 앱', 'コンシューマーアプリ'),
    aliases: ['consumer', 'mobile app', 'social', 'lifestyle', 'b2c', '앱', '소비자', '소셜', 'アプリ', '一般向け'] },
  { value: 'other', label: t('Other', '기타', 'その他'),
    aliases: ['other', 'misc', 'unknown', '기타', 'その他'] },
];

const tones: OntologyTerm[] = [
  { value: 'calm', label: t('Calm', '차분함', '落ち着き'), aliases: ['quiet', 'restful', 'understated', 'serene', '차분', '조용', '静か', '穏やか'] },
  { value: 'technical', label: t('Technical', '기술적', 'テクニカル'), aliases: ['precise', 'engineering', 'systematic', 'dense', '기술', '정밀', '技術', '精密'] },
  { value: 'trustworthy', label: t('Trustworthy', '신뢰감', '信頼感'), aliases: ['credible', 'reliable', 'secure', 'professional', '신뢰', '믿음', '信頼', '安心'] },
  { value: 'premium', label: t('Premium', '고급', 'プレミアム'), aliases: ['luxury', 'refined', 'high-end', 'elegant', '고급', '럭셔리', '高級', '上質'] },
  { value: 'editorial', label: t('Editorial', '에디토리얼', '編集的'), aliases: ['magazine', 'typographic', 'narrative', 'literary', '에디토리얼', '활자', '編集', '誌面'] },
  { value: 'playful', label: t('Playful', '경쾌함', '遊び心'), aliases: ['fun', 'friendly', 'lively', 'cheerful', '경쾌', '발랄', '楽しい', '親しみ'] },
  { value: 'bold', label: t('Bold', '강렬함', '大胆'), aliases: ['strong', 'confident', 'loud', 'striking', '강렬', '대담', '大胆', '力強い'] },
  { value: 'experimental', label: t('Experimental', '실험적', '実験的'), aliases: ['avant-garde', 'unconventional', 'edgy', 'expressive', '실험', '파격', '実験', '前衛'] },
];

const densityLevels: OntologyTerm[] = [
  { value: 'low', label: t('Low density', '낮은 밀도', '低密度'), aliases: ['spacious', 'airy', 'sparse', 'roomy', '여백', '넓은', '余白', 'ゆったり'] },
  { value: 'medium', label: t('Medium density', '중간 밀도', '中密度'), aliases: ['balanced', 'moderate', '보통', '중간', '標準', '中程度'] },
  { value: 'high', label: t('High density', '높은 밀도', '高密度'), aliases: ['compact', 'dense', 'information-dense', 'tight', '고밀도', '빽빽', '高密度', '密'] },
];

const usageFrequencies: OntologyTerm[] = [
  { value: 'one-off', label: t('One-off', '일회성', '一回性'), aliases: ['single visit', 'first impression', 'landing', '한 번', '일회성', '一度', '初回'] },
  { value: 'occasional', label: t('Occasional', '가끔', '時々'), aliases: ['periodic', 'sometimes', 'now and then', '가끔', '주기적', '時々', '定期'] },
  { value: 'daily', label: t('Daily', '매일', '毎日'), aliases: ['everyday', 'frequent', 'constant', 'repeated', '매일', '상시', '반복', '毎日', '常用'] },
];

const trustLevels: OntologyTerm[] = [
  { value: 'low', label: t('Low trust sensitivity', '낮은 신뢰 민감도', '低信頼感度'), aliases: ['casual', 'low stakes', '가벼운', '低リスク'] },
  { value: 'medium', label: t('Medium trust sensitivity', '중간 신뢰 민감도', '中信頼感度'), aliases: ['moderate stakes', '보통', '中程度'] },
  { value: 'high', label: t('High trust sensitivity', '높은 신뢰 민감도', '高信頼感度'), aliases: ['regulated', 'sensitive', 'compliance', 'money', 'health', '규제', '민감', '高リスク', '規制'] },
];

const taskTags: OntologyTerm[] = [
  { value: 'monitor', label: t('Monitor', '모니터링', '監視'), aliases: ['watch', 'observe', 'track', '모니터', '관찰', '監視'] },
  { value: 'triage', label: t('Triage', '트리아지', 'トリアージ'), aliases: ['prioritize', 'incident', 'respond', '분류', '대응', '対応'] },
  { value: 'configure', label: t('Configure', '설정', '設定'), aliases: ['setup', 'settings', 'adjust', '설정', '구성', '設定'] },
  { value: 'analyze', label: t('Analyze', '분석', '分析'), aliases: ['examine', 'inspect', 'explore data', '분석', '조사', '分析'] },
  { value: 'audit', label: t('Audit', '감사', '監査'), aliases: ['review log', 'trace', 'compliance check', '감사', '추적', '監査'] },
  { value: 'author', label: t('Author', '작성', '作成'), aliases: ['create', 'write', 'compose', 'edit', '작성', '편집', '作成', '編集'] },
  { value: 'read', label: t('Read', '읽기', '読む'), aliases: ['view', 'consume', 'browse content', '읽기', '열람', '閲覧'] },
  { value: 'search', label: t('Search', '검색', '検索'), aliases: ['find', 'query', 'lookup', '검색', '찾기', '検索'] },
  { value: 'browse', label: t('Browse', '둘러보기', '閲覧'), aliases: ['explore', 'discover', 'scan', '둘러보기', '탐색', '探索'] },
  { value: 'compare', label: t('Compare', '비교', '比較'), aliases: ['evaluate', 'contrast', '비교', '평가', '比較'] },
  { value: 'purchase', label: t('Purchase', '구매', '購入'), aliases: ['buy', 'order', 'subscribe', '구매', '주문', '購入'] },
  { value: 'checkout', label: t('Checkout', '결제', '決済'), aliases: ['pay', 'payment', 'cart', '결제', '계산', '決済'] },
  { value: 'communicate', label: t('Communicate', '소통', 'コミュニケーション'), aliases: ['message', 'chat', 'reply', '대화', '메시지', '会話'] },
  { value: 'onboard', label: t('Onboard', '온보딩', 'オンボーディング'), aliases: ['get started', 'signup', 'first run', '온보딩', '시작', '登録'] },
  { value: 'navigate', label: t('Navigate', '이동', 'ナビゲート'), aliases: ['move', 'route', 'wayfind', '이동', '내비', '移動'] },
  { value: 'manage', label: t('Manage', '관리', '管理'), aliases: ['administer', 'organize', 'maintain', '관리', '운영', '管理'] },
  { value: 'review', label: t('Review', '검토', 'レビュー'), aliases: ['approve', 'check', 'verify', '검토', '승인', 'レビュー'] },
  { value: 'upload', label: t('Upload', '업로드', 'アップロード'), aliases: ['import', 'attach', 'send file', '업로드', '첨부', 'アップロード'] },
  { value: 'schedule', label: t('Schedule', '예약/일정', 'スケジュール'), aliases: ['book', 'plan', 'calendar', '예약', '일정', '予約'] },
];

const stateCategories: OntologyTerm[] = [
  { value: 'data', label: t('Data', '데이터', 'データ'), aliases: ['content', 'result', '데이터', 'データ'] },
  { value: 'network', label: t('Network', '네트워크', 'ネットワーク'), aliases: ['request', 'fetch', 'connection', '네트워크', '요청', '通信'] },
  { value: 'permission', label: t('Permission', '권한', '権限'), aliases: ['auth', 'access', 'role', '권한', '인증', '権限'] },
  { value: 'interaction', label: t('Interaction', '상호작용', 'インタラクション'), aliases: ['input', 'edit', 'gesture', '상호작용', '입력', '操作'] },
  { value: 'content', label: t('Content', '콘텐츠', 'コンテンツ'), aliases: ['empty', 'overflow', 'limit', '콘텐츠', '비었음', 'コンテンツ'] },
  { value: 'environment', label: t('Environment', '환경', '環境'), aliases: ['offline', 'responsive', 'device', '환경', '오프라인', '環境'] },
  { value: 'time', label: t('Time', '시간', '時間'), aliases: ['stale', 'expired', 'pending', '시간', '만료', '時間'] },
];

// Symmetric adjacency (04 §2.1). Listed once per pair; both directions valid.
const productAdjacency: Record<string, ProductType[]> = {
  'operational-saas': ['developer-tool', 'security-console', 'data-analytics', 'finance-admin'],
  'developer-tool': ['operational-saas', 'documentation', 'ai-chat'],
  'documentation': ['developer-tool', 'knowledge-base', 'content-editorial'],
  'data-analytics': ['operational-saas', 'finance-admin', 'security-console'],
  'finance-admin': ['operational-saas', 'data-analytics', 'commerce'],
  'healthcare-portal': ['finance-admin', 'consumer-app'],
  'commerce': ['consumer-app', 'finance-admin', 'campaign'],
  'ai-chat': ['developer-tool', 'consumer-app'],
  'content-editorial': ['documentation', 'portfolio', 'campaign'],
  'knowledge-base': ['documentation', 'content-editorial'],
  'portfolio': ['content-editorial', 'campaign'],
  'campaign': ['commerce', 'content-editorial', 'portfolio'],
  'consumer-app': ['commerce', 'ai-chat', 'healthcare-portal'],
  'security-console': ['operational-saas', 'data-analytics'],
};

const constraintMappings: ConstraintMapping[] = [
  { constraint: 'reduced-motion-required', matchesRisks: ['continuous motion', 'heavy animation', 'ambient motion'], hardReject: 'ACCESSIBILITY_CONFLICT' },
  { constraint: 'high-contrast-required', matchesRisks: ['low contrast', 'subtle borders', 'low-contrast text'], hardReject: 'ACCESSIBILITY_CONFLICT' },
  { constraint: 'no-dark-only', matchesRisks: ['dark-only palette'] },
  { constraint: 'no-decoration', matchesRisks: ['decorative spectacle', 'ornamental motion', 'visual noise'] },
  { constraint: 'keyboard-first', matchesRisks: ['mouse-dependent', 'hover-only affordance'] },
];

export const ontology: Ontology = {
  productTypes,
  tones,
  densityLevels,
  usageFrequencies,
  trustLevels,
  taskTags,
  stateCategories,
  productAdjacency,
  constraintMappings,
};

/** Symmetric adjacency lookup (handles either direction). */
export function adjacentProductTypes(p: ProductType): ProductType[] {
  const direct = productAdjacency[p] ?? [];
  const reverse = (Object.keys(productAdjacency) as ProductType[]).filter(
    (k) => (productAdjacency[k] ?? []).includes(p),
  );
  return Array.from(new Set([...direct, ...reverse]));
}
