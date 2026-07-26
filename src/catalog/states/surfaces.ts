// v0.1 State Atlas surfaces (06 §2). requiredStateIds/recommendedStateIds reference
// globally-unique recipe ids (frozen here — Phase 2, rank-18). domain-specific recipes
// are discovered by the planner via recipe.surfaceIds + criticality, not listed here.

import { t } from '../localization';
import type { StateSurface } from '../types';

export const stateSurfaces: StateSurface[] = [
  {
    id: 'data-table',
    name: t('Data table', '데이터 테이블', 'データテーブル'),
    description: t(
      'A queryable, paginated table of rows that load, filter, and can fail.',
      '검색·필터·페이지네이션이 있는 행 단위 데이터 테이블.',
      '検索・フィルター・ページングを持つ行データのテーブル。'),
    requiredStateIds: ['initial-loading', 'populated', 'initial-empty', 'filtered-empty', 'fetch-failed'],
    recommendedStateIds: ['partial-data', 'stale-data', 'loading-next-page', 'end-of-results'],
    domainSignals: ['table', 'list', 'filter', 'search', 'pagination', 'rows'],
  },
  {
    id: 'form',
    name: t('Form', '폼', 'フォーム'),
    description: t(
      'An input surface the user fills, validates, and submits.',
      '사용자가 입력·검증·제출하는 입력 화면.',
      'ユーザーが入力・検証・送信する入力画面。'),
    requiredStateIds: ['pristine', 'invalid', 'submitting', 'submission-failed', 'form-success'],
    recommendedStateIds: ['validating', 'dirty', 'server-validation-error', 'unsaved-changes', 'autosaving', 'saved', 'save-conflict'],
    domainSignals: ['form', 'input', 'fields', 'submit', 'validation'],
  },
  {
    id: 'checkout',
    name: t('Checkout', '결제', '決済'),
    description: t(
      'A money-moving transaction surface with authorization and failure paths.',
      '승인·실패 경로가 있는 결제 트랜잭션 화면.',
      '承認・失敗経路を持つ決済トランザクション画面。'),
    requiredStateIds: ['ready', 'processing', 'payment-declined', 'checkout-success', 'session-expired'],
    recommendedStateIds: ['authentication-required', 'insufficient-funds', 'duplicate-submission', 'service-unavailable', 'item-unavailable', 'price-changed'],
    domainSignals: ['checkout', 'payment', 'cart', 'order', 'pay'],
  },
  {
    id: 'chat',
    name: t('Chat', '챗', 'チャット'),
    description: t(
      'A streaming conversational surface with tools, interruption, and reconnection.',
      '스트리밍·도구·중단·재연결이 있는 대화형 화면.',
      'ストリーミング・ツール・中断・再接続を持つ会話画面。'),
    requiredStateIds: ['initial', 'waiting', 'streaming', 'completed', 'chat-failed', 'reconnecting'],
    recommendedStateIds: ['interrupted'],
    domainSignals: ['chat', 'conversation', 'message', 'assistant', 'stream'],
  },
  {
    id: 'developer-console',
    name: t('Developer console', '개발자 콘솔', '開発者コンソール'),
    description: t(
      'An API/request console with auth, quota, and large-response paths.',
      '인증·쿼터·대용량 응답 경로가 있는 API/요청 콘솔.',
      '認証・クォータ・大容量応答経路を持つAPI/リクエストコンソール。'),
    requiredStateIds: ['no-project', 'request-running', 'console-success', 'invalid-request', 'unauthorized', 'forbidden'],
    recommendedStateIds: ['console-rate-limited', 'console-service-unavailable'],
    domainSignals: ['console', 'api', 'request', 'endpoint', 'developer', 'key'],
  },
];
