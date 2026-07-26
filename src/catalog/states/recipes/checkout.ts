import { t } from '../../localization';
import type { StateRecipe } from '../types';

export const checkoutRecipes: StateRecipe[] = [
  {
    id: 'ready',
    surfaceIds: ['checkout'],
    category: 'interaction',
    criticality: 'required',
    name: t('Ready to pay', '결제 준비 완료', '支払い準備完了'),
    summary: t(
      'The order summary, totals, and payment fields are filled and valid, and the user can submit the payment.',
      '주문 요약·합계·결제 입력이 채워져 유효하며, 사용자가 결제를 진행할 수 있는 상태.',
      '注文サマリー・合計・支払い入力が揃って有効で、ユーザーが支払いを実行できる状態。'),
    aliases: ['ready to checkout', 'payable', 'review and pay', '결제 가능', '주문 확인', '支払い可能', '注文確認'],
    domainSignals: ['checkout', 'payment', 'cart', 'order'],
    triggers: [
      t('All required fields are valid and a payment method is selected', '필수 입력이 모두 유효하고 결제 수단이 선택됨', '必須入力がすべて有効で支払い手段が選択済み'),
      t('Totals, tax, and shipping have been calculated', '합계·세금·배송비가 계산 완료됨', '合計・税・送料が計算済み'),
    ],
    userQuestions: [
      t('Is this the final amount I will be charged, and what am I paying for?',
        '내가 최종으로 결제할 금액이 이건가, 무엇에 대한 결제인가?',
        '最終的に請求される金額はこれか、何への支払いか?'),
    ],
    mustShow: [
      t('The final total with tax and shipping broken out', '세금·배송비가 분리된 최종 합계', '税・送料が分かれた最終合計'),
      t('The items being purchased and the chosen payment method', '구매 품목과 선택한 결제 수단', '購入品目と選択した支払い手段'),
      t('A clear, single primary "Pay" action', '명확한 단일 "결제" 기본 동작', '明確な単一の「支払う」操作'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Pay now', '결제하기', '支払う') ],
    secondaryActions: [
      t('Edit the cart', '장바구니 수정', 'カートを編集'),
      t('Apply a discount code', '할인 코드 적용', '割引コードを適用'),
    ],
    mustNot: [
      t('Submit the payment on a single accidental keystroke without confirmation', '단일 오타·키 입력으로 확인 없이 결제 제출', '誤った単一キー入力で確認なく決済送信'),
      t('Hide tax, fees, or shipping until after submission', '세금·수수료·배송비를 제출 후로 숨기기', '税・手数料・送料を送信後まで隠す'),
      t('Show multiple competing primary buttons', '경쟁하는 기본 버튼을 여러 개 노출', '競合する主要ボタンを複数表示'),
    ],
    accessibility: {
      announcement: t('Announce the final total politely when it changes', '최종 합계 변경 시 방해되지 않게 안내', '最終合計の変更時に控えめに通知'),
      focus: t('Keep focus on the pay action when the form is valid', '폼이 유효하면 결제 동작에 포커스 유지', 'フォームが有効なら支払い操作にフォーカス維持'),
      keyboard: [ t('Pay action reachable and operable by keyboard', '결제 동작을 키보드로 도달·실행 가능', '支払い操作をキーボードで到達・実行可能') ],
    },
    motion: {
      guidance: [ t('Calm, no urgency animation around the pay button', '차분하게, 결제 버튼 주변 긴박 애니메이션 금지', '落ち着いて、支払いボタン周りの煽りアニメ禁止') ],
      reducedMotion: [ t('Show the totals and button with no transition', '전환 없이 합계·버튼 표시', 'トランジション無しで合計・ボタン表示') ],
    },
  },
  {
    id: 'processing',
    surfaceIds: ['checkout'],
    category: 'network',
    criticality: 'required',
    name: t('Processing payment', '결제 처리 중', '決済処理中'),
    summary: t(
      'The payment has been submitted and the result is pending; the outcome is not yet known.',
      '결제가 제출되어 결과를 기다리는 중이며 성패가 아직 확정되지 않은 상태.',
      '決済が送信され結果待ちで、成否がまだ確定していない状態。'),
    aliases: ['payment in progress', 'authorizing', 'pending charge', '결제 진행 중', '승인 대기', '決済中', '承認待ち'],
    domainSignals: ['payment', 'checkout', 'processing'],
    triggers: [
      t('The user has submitted payment and the processor has not responded yet', '사용자가 결제를 제출했고 결제사 응답이 아직 없음', 'ユーザーが決済を送信し決済会社の応答がまだ無い'),
    ],
    userQuestions: [
      t('Did it go through? Should I wait, or did it fail silently?',
        '결제가 된 건가? 기다려야 하나, 아니면 조용히 실패한 건가?',
        '通ったのか?待つべきか、それとも黙って失敗したのか?'),
    ],
    mustShow: [
      t('That the payment is in progress and the result is not final', '결제가 진행 중이며 결과가 확정되지 않았음', '決済が進行中で結果は未確定であること'),
      t('That the user should not close or refresh the page', '페이지를 닫거나 새로고침하지 말 것', 'ページを閉じたり更新したりしないこと'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Wait for the result', '결과 기다리기', '結果を待つ') ],
    secondaryActions: [],
    mustNot: [
      t('Re-submit or auto-retry the same card while a result is pending', '결과 대기 중 같은 카드를 재제출·자동 재시도', '結果待ち中に同じカードを再送信・自動再試行'),
      t('Imply the charge succeeded before the processor confirms', '결제사 확정 전에 결제 성공으로 오해시키기', '決済会社の確定前に成功と誤解させる'),
      t('Let the pay button stay clickable so a double charge can happen', '결제 버튼을 클릭 가능하게 둬 이중 결제가 나게 하기', '支払いボタンを押せるままにして二重請求を起こす'),
    ],
    accessibility: {
      announcement: t('Announce "processing payment" politely via a status region', '"결제 처리 중"을 status 영역으로 방해되지 않게 안내', '「決済処理中」をstatus領域で控えめに通知'),
      focus: t('Keep focus stable; do not steal it during the wait', '포커스를 안정적으로 유지, 대기 중 빼앗지 않기', 'フォーカスを安定維持、待機中に奪わない'),
    },
    motion: {
      guidance: [ t('Use a calm indeterminate indicator, no fake progress bar', '차분한 비결정 인디케이터 사용, 가짜 진행바 금지', '落ち着いた不確定インジケーター、偽の進捗バー禁止') ],
      reducedMotion: [ t('Show a static "processing" label instead of a spinner', '스피너 대신 정적 "처리 중" 라벨 표시', 'スピナーの代わりに静的な「処理中」ラベル表示') ],
    },
  },
  {
    id: 'payment-declined',
    surfaceIds: ['checkout'],
    category: 'network',
    criticality: 'required',
    name: t('Payment declined', '결제 거절됨', '決済が拒否されました'),
    summary: t(
      'The payment processor reached a decision and declined the charge (not a network failure).',
      '결제사가 요청을 처리했으나 승인을 거절한 상태.',
      '決済会社が要求を処理したが、承認を拒否した状態。'),
    aliases: ['card declined', 'charge failed', 'payment rejected', '카드 거절', '승인 거절', 'カード拒否', '決済失敗'],
    domainSignals: ['payment', 'card', 'checkout'],
    triggers: [
      t('Processor returns a decline (not a network error)', '결제사가 네트워크 오류가 아닌 거절을 반환', '決済会社がネットワークエラーではなく拒否を返す'),
    ],
    userQuestions: [
      t('Was I charged? What do I fix to succeed?', '결제가 된 건가? 무엇을 고치면 되나?', '請求された?何を直せば通る?'),
    ],
    mustShow: [
      t('That no charge was completed', '결제가 완료되지 않았음', '請求は完了していないこと'),
      t('A safe, non-blaming reason if known', '알 수 있으면 비난 없는 사유', '分かる範囲で責めない理由'),
      t('A concrete next step (different method)', '구체적 다음 단계(다른 수단)', '具体的な次の手順(別手段)'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping/options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Try a different payment method', '다른 결제 수단 시도', '別の決済手段を試す') ],
    secondaryActions: [ t('Review order', '주문 확인', '注文を確認') ],
    mustNot: [
      t('Auto-retry the same card silently', '같은 카드를 조용히 자동 재시도', '同じカードで黙って自動再試行'),
      t('Imply the user was charged', '결제됐다고 오해시키기', '請求済みと誤解させる'),
      t('Expose raw processor error codes', '결제사 원시 오류 코드 노출', '決済会社の生エラーコード露出'),
    ],
    accessibility: {
      announcement: t('Announce the failure assertively (role=alert)', '실패를 단호하게(alert) 안내', '失敗をはっきりと(alert)通知'),
      focus: t('Move focus to the error summary', '포커스를 오류 요약으로 이동', 'フォーカスをエラー要約へ'),
    },
    motion: {
      guidance: [ t('No celebratory motion; steady error reveal', '축하성 모션 금지, 차분한 오류 표시', '祝福系モーション禁止、落ち着いた表示') ],
      reducedMotion: [ t('Show error immediately, no shake', '흔들림 없이 즉시 표시', '揺れ無しで即時表示') ],
    },
  },
  {
    id: 'checkout-success',
    surfaceIds: ['checkout'],
    category: 'data',
    criticality: 'required',
    name: t('Order confirmed', '주문 완료', '注文確定'),
    summary: t(
      'The charge succeeded and the order has been placed; the user needs confirmation and what happens next.',
      '결제가 성공해 주문이 접수된 상태로, 사용자는 확인과 다음 절차 안내가 필요한 상태.',
      '決済が成功し注文が確定した状態で、ユーザーは確認と次の手順案内が必要な状態。'),
    aliases: ['order placed', 'purchase complete', 'payment success', '결제 완료', '구매 완료', '注文完了', '購入完了'],
    domainSignals: ['checkout', 'order', 'confirmation', 'success'],
    triggers: [
      t('The processor confirms the charge and the order is created', '결제사가 승인을 확정하고 주문이 생성됨', '決済会社が承認を確定し注文が作成される'),
    ],
    userQuestions: [
      t('Did it actually go through, and what happens next?',
        '정말 결제가 된 건가, 이제 무엇이 일어나나?',
        '本当に通ったのか、これから何が起きるのか?'),
    ],
    mustShow: [
      t('A clear confirmation with the order id or number', '주문 번호와 함께 분명한 완료 확인', '注文番号付きの明確な確認'),
      t('What happens next (receipt, email, shipping or delivery timing)', '다음 절차(영수증·이메일·배송 시점)', '次の手順(領収書・メール・配送時期)'),
      t('The amount charged and the payment method used', '결제된 금액과 사용한 결제 수단', '請求金額と使用した支払い手段'),
    ],
    mustPreserve: [
      t('A record of the order so the user can return to it', '사용자가 다시 찾아볼 수 있는 주문 기록', 'ユーザーが後で参照できる注文記録'),
    ],
    primaryActions: [ t('View order details', '주문 상세 보기', '注文詳細を見る') ],
    secondaryActions: [
      t('Continue shopping', '쇼핑 계속하기', '買い物を続ける'),
      t('Download the receipt', '영수증 다운로드', '領収書をダウンロード'),
    ],
    mustNot: [
      t('Leave the page in a way that re-submits the order on back or refresh', '뒤로가기·새로고침으로 주문이 재전송되게 두기', '戻る・更新で注文が再送信される状態にする'),
      t('Omit the order id so the user has no reference', '주문 번호를 빠뜨려 참조 수단을 없애기', '注文番号を欠落させ参照手段を無くす'),
      t('Bury "what happens next" under marketing upsell', '"다음 절차"를 마케팅 추천 밑에 묻기', '「次の手順」をマーケ訴求の下に埋める'),
    ],
    accessibility: {
      announcement: t('Announce success politely and move focus to the confirmation heading', '성공을 방해되지 않게 안내하고 확인 제목으로 포커스 이동', '成功を控えめに通知し確認見出しへフォーカス移動'),
      focus: t('Move focus to the confirmation heading', '포커스를 완료 확인 제목으로 이동', 'フォーカスを確認見出しへ移動'),
    },
    motion: {
      guidance: [ t('A brief, single confirmation cue is fine; no looping celebration', '짧은 단발 완료 신호는 허용, 반복 축하 금지', '短い単発の確認演出は可、ループする祝福は禁止') ],
      reducedMotion: [ t('Show the confirmation immediately with no animation', '애니메이션 없이 즉시 완료 표시', 'アニメーション無しで即時に確認表示') ],
    },
  },
  {
    id: 'session-expired',
    surfaceIds: ['checkout'],
    category: 'time',
    criticality: 'required',
    name: t('Session expired', '세션 만료됨', 'セッションの期限切れ'),
    summary: t(
      'The checkout session timed out before submission; the user must refresh or re-authenticate to continue.',
      '제출 전에 체크아웃 세션이 만료되어, 계속하려면 새로고침이나 재인증이 필요한 상태.',
      '送信前にチェックアウトセッションが期限切れになり、続けるには更新か再認証が必要な状態。'),
    aliases: ['session timed out', 'checkout expired', 'token expired', '세션 타임아웃', '결제 세션 만료', 'セッションタイムアウト', '期限切れ'],
    domainSignals: ['session', 'checkout', 'expiry', 'timeout'],
    triggers: [
      t('The checkout token or session lifetime elapsed before payment', '결제 전에 체크아웃 토큰·세션 수명이 경과', '支払い前にチェックアウトのトークン・セッション寿命が経過'),
    ],
    userQuestions: [
      t('Did I lose my cart, and did I get charged for anything?',
        '장바구니가 날아간 건가, 그리고 뭔가 결제된 건 없나?',
        'カートは消えたのか、何か請求されていないか?'),
    ],
    mustShow: [
      t('That the session expired due to time, not the user doing anything wrong', '사용자 잘못이 아니라 시간 경과로 세션이 만료됐음', 'ユーザーの誤りではなく時間経過でセッションが切れたこと'),
      t('That no charge was made', '결제가 이루어지지 않았음', '請求は行われていないこと'),
      t('A one-tap way to resume the same checkout', '같은 체크아웃을 한 번에 재개하는 방법', '同じチェックアウトをワンタップで再開する方法'),
    ],
    mustPreserve: [
      t('The cart contents', '장바구니 내용', 'カートの内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Resume checkout', '체크아웃 재개', 'チェックアウトを再開') ],
    secondaryActions: [ t('Review cart', '장바구니 확인', 'カートを確認') ],
    mustNot: [
      t('Blame the user or imply they were too slow', '사용자를 탓하거나 너무 느렸다고 암시하기', 'ユーザーを責めたり遅すぎたと示唆する'),
      t('Discard the cart or entered details on expiry', '만료 시 장바구니나 입력값을 버리기', '期限切れ時にカートや入力内容を破棄する'),
      t('Force a full re-entry of everything when a resume is possible', '재개가 가능한데 전부 다시 입력하게 강제하기', '再開可能なのに全項目の再入力を強制する'),
    ],
    accessibility: {
      announcement: t('Announce the expiry assertively (role=alert)', '만료를 단호하게(alert) 안내', '期限切れをはっきりと(alert)通知'),
      focus: t('Move focus to the resume action', '포커스를 재개 동작으로 이동', 'フォーカスを再開操作へ移動'),
    },
    motion: {
      guidance: [ t('Static, informational reveal; no alarm animation', '정적·정보 전달, 경보 애니메이션 금지', '静的・情報提示、警報アニメ禁止') ],
      reducedMotion: [ t('Show the message immediately with no transition', '전환 없이 즉시 메시지 표시', 'トランジション無しで即時メッセージ表示') ],
    },
  },
  {
    id: 'authentication-required',
    surfaceIds: ['checkout'],
    category: 'permission',
    criticality: 'recommended',
    name: t('Authentication required', '인증 필요', '認証が必要'),
    summary: t(
      'The bank requires an additional verification step (such as 3-D Secure) before the charge can proceed.',
      '은행이 결제 진행 전에 3-D Secure 같은 추가 인증 단계를 요구하는 상태.',
      '銀行が決済を進める前に3-Dセキュアなどの追加認証ステップを要求している状態。'),
    aliases: ['3d secure', '3ds challenge', 'bank verification', 'sca', '추가 인증', '본인 확인', '本人認証', '追加認証'],
    domainSignals: ['payment', 'authentication', '3ds', 'verification'],
    triggers: [
      t('The issuer requires a verification challenge to approve the charge', '발급사가 승인을 위해 인증 챌린지를 요구', '発行会社が承認のため認証チャレンジを要求'),
    ],
    userQuestions: [
      t('Why is my bank asking me this, and is the payment still going to work?',
        '은행이 왜 이걸 묻나, 결제는 그대로 되는 건가?',
        'なぜ銀行がこれを聞くのか、支払いはこのまま通るのか?'),
    ],
    mustShow: [
      t('That an extra verification step from the bank is needed', '은행의 추가 인증 단계가 필요함', '銀行の追加認証ステップが必要であること'),
      t('That the charge has not completed yet', '결제가 아직 완료되지 않았음', '請求はまだ完了していないこと'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Verify with your bank', '은행 인증 진행', '銀行で認証する') ],
    secondaryActions: [ t('Use a different payment method', '다른 결제 수단 사용', '別の決済手段を使う') ],
    mustNot: [
      t('Auto-retry the same card without completing verification', '인증을 마치지 않고 같은 카드를 자동 재시도', '認証を終えずに同じカードを自動再試行'),
      t('Imply the user was charged before verification finishes', '인증 완료 전에 결제됐다고 오해시키기', '認証完了前に請求済みと誤解させる'),
      t('Hide that the challenge comes from the bank, not the store', '챌린지가 가게가 아니라 은행에서 온 것임을 숨기기', 'チャレンジが店ではなく銀行由来であることを隠す'),
    ],
    accessibility: {
      announcement: t('Announce that verification is required politely', '인증이 필요함을 방해되지 않게 안내', '認証が必要であることを控えめに通知'),
      focus: t('Move focus into the verification step or its launch control', '포커스를 인증 단계나 그 실행 컨트롤로 이동', 'フォーカスを認証ステップまたはその起動操作へ移動'),
    },
    motion: {
      guidance: [ t('Calm transition into the verification step; no urgency cues', '인증 단계로 차분히 전환, 긴박 신호 금지', '認証ステップへ落ち着いて遷移、煽る演出禁止') ],
      reducedMotion: [ t('Present the verification step with no transition', '전환 없이 인증 단계를 제시', 'トランジション無しで認証ステップを提示') ],
    },
  },
  {
    id: 'insufficient-funds',
    surfaceIds: ['checkout'],
    category: 'network',
    criticality: 'recommended',
    name: t('Insufficient funds', '잔액 부족', '残高不足'),
    summary: t(
      'The processor declined the charge specifically because the account or card lacks available funds.',
      '계좌·카드의 사용 가능 잔액이 부족해 결제사가 승인을 거절한 상태.',
      '口座・カードの利用可能残高が不足し、決済会社が承認を拒否した状態。'),
    aliases: ['not enough funds', 'over limit', 'balance too low', 'nsf', '잔고 부족', '한도 초과', '残高不足', '限度額超過'],
    domainSignals: ['payment', 'card', 'funds', 'balance'],
    triggers: [
      t('The processor returns a decline with an insufficient-funds reason', '결제사가 잔액 부족 사유로 거절을 반환', '決済会社が残高不足の理由で拒否を返す'),
    ],
    userQuestions: [
      t('Was I charged, and is the fix to use another card or add funds?',
        '결제가 된 건가, 다른 카드를 쓰거나 잔액을 채우면 되나?',
        '請求されたのか、別カードを使うか入金すれば直るのか?'),
    ],
    mustShow: [
      t('That no charge was completed', '결제가 완료되지 않았음', '請求は完了していないこと'),
      t('That the decline was due to available funds, stated without judgement', '잔액 때문에 거절됐음을 비난 없이 안내', '残高が理由で拒否されたことを責めずに案内'),
      t('A concrete next step (another method or add funds)', '구체적 다음 단계(다른 수단이나 잔액 충전)', '具体的な次の手順(別手段か入金)'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Use a different payment method', '다른 결제 수단 사용', '別の決済手段を使う') ],
    secondaryActions: [ t('Review order', '주문 확인', '注文を確認') ],
    mustNot: [
      t('Auto-retry the same card silently', '같은 카드를 조용히 자동 재시도', '同じカードで黙って自動再試行'),
      t('Imply the user was charged', '결제됐다고 오해시키기', '請求済みと誤解させる'),
      t('Expose raw processor or bank decline codes', '결제사·은행 원시 거절 코드 노출', '決済会社・銀行の生拒否コード露出'),
    ],
    accessibility: {
      announcement: t('Announce the decline assertively (role=alert)', '거절을 단호하게(alert) 안내', '拒否をはっきりと(alert)通知'),
      focus: t('Move focus to the error summary', '포커스를 오류 요약으로 이동', 'フォーカスをエラー要約へ移動'),
    },
    motion: {
      guidance: [ t('No celebratory motion; steady error reveal', '축하성 모션 금지, 차분한 오류 표시', '祝福系モーション禁止、落ち着いた表示') ],
      reducedMotion: [ t('Show the error immediately, no shake', '흔들림 없이 즉시 오류 표시', '揺れ無しで即時にエラー表示') ],
    },
  },
  {
    id: 'duplicate-submission',
    surfaceIds: ['checkout'],
    category: 'interaction',
    criticality: 'recommended',
    name: t('Duplicate submission', '중복 제출', '重複送信'),
    summary: t(
      'The same order was submitted more than once; the system must collapse it to a single charge.',
      '같은 주문이 두 번 이상 제출되어, 단일 결제로 합쳐 처리해야 하는 상태.',
      '同じ注文が複数回送信され、単一の決済にまとめて処理すべき状態。'),
    aliases: ['double submit', 'repeat order', 'double charge risk', '이중 제출', '중복 주문', '二重送信', '重複注文'],
    domainSignals: ['checkout', 'idempotency', 'duplicate', 'order'],
    triggers: [
      t('A second submission arrives for an order already in flight or placed', '이미 진행 중이거나 접수된 주문에 두 번째 제출이 도착', '進行中または確定済みの注文に二度目の送信が届く'),
    ],
    userQuestions: [
      t('Did I just get charged twice for the same order?',
        '같은 주문을 두 번 결제한 건 아닌가?',
        '同じ注文で二重に請求されていないか?'),
    ],
    mustShow: [
      t('That the order was already submitted and is being handled once', '주문이 이미 제출됐고 한 번만 처리됨', '注文は既に送信済みで一度だけ処理されること'),
      t('A pointer to the existing order or its status', '기존 주문이나 그 상태로 가는 경로', '既存注文またはその状態への案内'),
    ],
    mustPreserve: [
      t('The original order and its single charge', '원래 주문과 단일 결제', '元の注文と単一の請求'),
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
    ],
    primaryActions: [ t('View the existing order', '기존 주문 보기', '既存の注文を見る') ],
    secondaryActions: [ t('Contact support', '고객지원 문의', 'サポートに問い合わせ') ],
    mustNot: [
      t('Create a second order or charge for the same submission', '같은 제출로 두 번째 주문·결제를 만들기', '同じ送信で二件目の注文・請求を作る'),
      t('Imply two charges were made when only one is real', '실제로 한 번인데 두 번 결제된 것처럼 오해시키기', '実際は一回なのに二重請求と誤解させる'),
      t('Silently swallow the duplicate without telling the user what happened', '무슨 일이 있었는지 알리지 않고 중복을 조용히 삼키기', '何が起きたか伝えずに重複を黙って飲み込む'),
    ],
    accessibility: {
      announcement: t('Announce that the order was already submitted politely', '주문이 이미 제출됐음을 방해되지 않게 안내', '注文は既に送信済みであることを控えめに通知'),
      focus: t('Move focus to the existing order link', '포커스를 기존 주문 링크로 이동', 'フォーカスを既存注文のリンクへ移動'),
    },
    motion: {
      guidance: [ t('Static, informational; no alarm animation', '정적·정보 전달, 경보 애니메이션 금지', '静的・情報提示、警報アニメ禁止') ],
      reducedMotion: [ t('Show the message immediately with no transition', '전환 없이 즉시 메시지 표시', 'トランジション無しで即時メッセージ表示') ],
    },
  },
  {
    id: 'service-unavailable',
    surfaceIds: ['checkout'],
    category: 'network',
    criticality: 'recommended',
    name: t('Service unavailable', '서비스 이용 불가', 'サービス利用不可'),
    summary: t(
      'The payment service or checkout backend is temporarily unreachable, so the charge cannot be attempted right now.',
      '결제 서비스나 체크아웃 백엔드에 일시적으로 접근할 수 없어 지금은 결제를 시도할 수 없는 상태.',
      '決済サービスやチェックアウトのバックエンドに一時的に到達できず、今は決済を試みられない状態。'),
    aliases: ['payment outage', 'gateway down', 'temporarily unavailable', '503', '서비스 장애', '결제 불가', 'サービス障害', '一時的に利用不可'],
    domainSignals: ['payment', 'service', 'outage', 'availability'],
    triggers: [
      t('The payment gateway or checkout backend is down or timing out', '결제 게이트웨이나 체크아웃 백엔드가 다운·타임아웃', '決済ゲートウェイやチェックアウトのバックエンドがダウン・タイムアウト'),
    ],
    userQuestions: [
      t('Is this my problem or theirs, and was I charged anyway?',
        '내 문제인가 그쪽 문제인가, 혹시 결제는 된 건 아닌가?',
        'これは自分の問題か相手の問題か、もしや請求されていないか?'),
    ],
    mustShow: [
      t('That the issue is on the service side and is temporary', '문제가 서비스 측이며 일시적임', '問題はサービス側で一時的であること'),
      t('That no charge was made', '결제가 이루어지지 않았음', '請求は行われていないこと'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Try again in a moment', '잠시 후 다시 시도', '少し後に再試行') ],
    secondaryActions: [ t('Check service status', '서비스 상태 확인', 'サービス状態を確認') ],
    mustNot: [
      t('Auto-retry the same card on a tight loop and risk a double charge', '같은 카드를 짧은 주기로 자동 재시도해 이중 결제를 부르기', '同じカードを短い間隔で自動再試行し二重請求を招く'),
      t('Imply the user was charged when the request never reached the processor', '요청이 결제사에 닿지도 않았는데 결제됐다고 오해시키기', '要求が決済会社に届いてもいないのに請求済みと誤解させる'),
      t('Expose raw gateway error codes or stack traces', '게이트웨이 원시 오류 코드나 스택 트레이스 노출', 'ゲートウェイの生エラーコードやスタックトレース露出'),
    ],
    accessibility: {
      announcement: t('Announce the outage assertively (role=alert)', '장애를 단호하게(alert) 안내', '障害をはっきりと(alert)通知'),
      focus: t('Move focus to the error summary', '포커스를 오류 요약으로 이동', 'フォーカスをエラー要約へ移動'),
    },
    motion: {
      guidance: [ t('Static, informational reveal; no alarm animation', '정적·정보 전달, 경보 애니메이션 금지', '静的・情報提示、警報アニメ禁止') ],
      reducedMotion: [ t('Show the message immediately with no transition', '전환 없이 즉시 메시지 표시', 'トランジション無しで即時メッセージ表示') ],
    },
  },
  {
    id: 'refund-pending',
    surfaceIds: ['checkout'],
    category: 'time',
    criticality: 'domain-specific',
    name: t('Refund pending', '환불 처리 중', '返金処理中'),
    summary: t(
      'A refund has been initiated and accepted but the money has not yet returned to the customer.',
      '환불이 접수되어 처리에 들어갔으나 아직 고객에게 금액이 돌아가지 않은 상태.',
      '返金が受理され処理に入ったが、まだ顧客に金額が戻っていない状態。'),
    aliases: ['refund in progress', 'refund processing', 'awaiting refund', '환불 진행 중', '환불 대기', '返金中', '返金待ち'],
    domainSignals: ['refund', 'payment', 'pending', 'settlement'],
    triggers: [
      t('A refund was approved and is awaiting bank or processor settlement', '환불이 승인되어 은행·결제사 정산을 기다리는 중', '返金が承認され銀行・決済会社の精算待ち'),
    ],
    userQuestions: [
      t('When will the money actually come back to me?',
        '돈이 실제로 언제 돌아오나?',
        'お金は実際にいつ戻ってくるのか?'),
    ],
    mustShow: [
      t('That the refund is confirmed and in progress, not lost', '환불이 확정되어 진행 중이며 사라진 게 아님', '返金が確定し進行中で、消えていないこと'),
      t('A realistic timeframe and the destination method', '현실적인 소요 기간과 환불 받을 수단', '現実的な所要期間と返金先の手段'),
    ],
    mustPreserve: [
      t('The original order and its refund record', '원래 주문과 그 환불 기록', '元の注文とその返金記録'),
    ],
    primaryActions: [ t('View refund status', '환불 상태 보기', '返金状況を見る') ],
    secondaryActions: [ t('Contact support', '고객지원 문의', 'サポートに問い合わせ') ],
    mustNot: [
      t('Imply the refund is already complete when it is only pending', '아직 처리 중인데 환불이 완료됐다고 오해시키기', 'まだ処理中なのに返金完了と誤解させる'),
      t('Promise an exact instant arrival the store cannot control', '가게가 통제할 수 없는 즉시 도착 시점을 약속하기', '店が制御できない即時到着時刻を約束する'),
      t('Hide the destination so the user cannot tell where the money goes', '환불 받을 수단을 숨겨 돈이 어디로 가는지 알 수 없게 하기', '返金先を隠して金がどこへ行くか分からなくする'),
    ],
    accessibility: {
      announcement: t('Announce the refund status politely', '환불 상태를 방해되지 않게 안내', '返金状況を控えめに通知'),
      focus: t('Keep focus on the refund status region', '포커스를 환불 상태 영역에 유지', 'フォーカスを返金状況の領域に維持'),
    },
    motion: {
      guidance: [ t('Calm, informational; no urgency or countdown animation', '차분·정보 전달, 긴박·카운트다운 애니메이션 금지', '落ち着いた情報提示、煽り・カウントダウンのアニメ禁止') ],
      reducedMotion: [ t('Show the status text with no transition', '전환 없이 상태 텍스트 표시', 'トランジション無しで状態テキスト表示') ],
    },
  },
  {
    id: 'item-unavailable',
    surfaceIds: ['checkout'],
    category: 'data',
    criticality: 'recommended',
    name: t('Item unavailable', '구매 불가 상품', '購入不可の商品'),
    summary: t(
      'An item in the cart went out of stock or was withdrawn before or at checkout, so it can no longer be purchased.',
      '장바구니의 상품이 결제 직전·결제 시점에 품절되거나 판매 중단되어 더는 구매할 수 없는 상태.',
      'カート内の商品が決済直前・決済時点で在庫切れ、または販売停止となり、もう購入できない状態。'),
    aliases: ['out of stock', 'sold out', 'no longer available', 'item removed', '품절', '재고 없음', '판매 중단', '在庫切れ', '完売', '販売終了'],
    domainSignals: ['checkout', 'cart', 'inventory', 'stock'],
    triggers: [
      t('An item in the cart sells out between adding it and checkout', '장바구니에 담은 뒤 결제 전에 그 상품이 품절됨', 'カートに入れてから決済前にその商品が売り切れる'),
      t('A product is withdrawn or disabled while the cart still holds it', '장바구니에 남아 있는데 상품이 판매 중단·비활성화됨', 'カートに残ったまま商品が販売停止・無効化される'),
    ],
    userQuestions: [
      t('Which item can I not buy, and can I still check out with the rest?',
        '어떤 상품을 못 사는 거고, 나머지는 그대로 결제할 수 있나?',
        'どの商品が買えなくて、残りはそのまま決済できる?'),
    ],
    mustShow: [
      t('Exactly which item is unavailable', '어떤 상품이 구매 불가인지 정확히', 'どの商品が購入不可かを正確に'),
      t('That it cannot be purchased and is excluded from the order', '그 상품은 구매할 수 없으며 주문에서 제외됨', 'その商品は購入できず、注文から除外されること'),
      t('How to proceed: remove it or save it for later, then continue', '해결 방법: 삭제하거나 나중을 위해 저장한 뒤 계속 진행', '進め方: 削除するか後で購入用に保存して続行'),
    ],
    mustPreserve: [
      t('The rest of the cart and the entered details', '나머지 장바구니와 입력값', '残りのカートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Remove the unavailable item', '구매 불가 상품 삭제', '購入不可の商品を削除') ],
    secondaryActions: [
      t('Save it for later', '나중을 위해 저장', '後で購入用に保存'),
      t('Find a similar item', '비슷한 상품 찾기', '似た商品を探す'),
    ],
    mustNot: [
      t('Silently drop the item without telling the user', '사용자에게 알리지 않고 상품을 조용히 빼버리기', 'ユーザーに伝えず商品を黙って外す'),
      t('Silently change the total without flagging the removed item', '빠진 상품을 짚어주지 않고 합계만 조용히 바꾸기', '外れた商品を示さず合計だけ黙って変える'),
      t('Let the user pay for an item that cannot be fulfilled', '제공할 수 없는 상품을 결제하게 두기', '提供できない商品を決済させる'),
    ],
    accessibility: {
      announcement: t('Announce which item became unavailable assertively (role=alert)', '어떤 상품이 구매 불가가 됐는지 단호하게(alert) 안내', 'どの商品が購入不可になったかをはっきりと(alert)通知'),
      focus: t('Move focus to the affected line item', '포커스를 해당 상품 항목으로 이동', 'フォーカスを該当の明細項目へ移動'),
    },
    motion: {
      guidance: [ t('Mark the affected item calmly in the cart; no alarm motion', '해당 상품을 장바구니에서 차분히 표시, 경보 모션 금지', '該当商品をカート内で落ち着いて表示、警報モーション禁止') ],
      reducedMotion: [ t('Show the unavailable marker immediately with no transition', '전환 없이 구매 불가 표시를 즉시 노출', 'トランジション無しで購入不可マーカーを即時表示') ],
    },
  },
  {
    id: 'price-changed',
    surfaceIds: ['checkout'],
    category: 'data',
    criticality: 'recommended',
    name: t('Price changed', '가격 변경됨', '価格が変わりました'),
    summary: t(
      'The price of an item changed between the cart and the confirmation step, so the total no longer matches what the user saw.',
      '장바구니와 결제 확인 단계 사이에 상품 가격이 바뀌어, 합계가 사용자가 봤던 금액과 달라진 상태.',
      'カートと確認ステップの間で商品の価格が変わり、合計がユーザーが見た金額と一致しなくなった状態。'),
    aliases: ['price updated', 'price increase', 'total changed', 'repricing', '가격 변동', '가격 인상', '합계 변경', '価格変更', '値上がり', '合計変更'],
    domainSignals: ['checkout', 'price', 'cart', 'total'],
    triggers: [
      t('An item is repriced between adding to cart and confirming the order', '장바구니에 담은 뒤 주문 확정 전에 상품 가격이 변경됨', 'カート追加後、注文確定前に商品の価格が変更される'),
      t('A promotion or discount expires before the user pays', '사용자가 결제하기 전에 프로모션·할인이 만료됨', 'ユーザーが支払う前にプロモーション・割引が終了する'),
    ],
    userQuestions: [
      t('What changed and by how much — and do I still want to buy at the new price?',
        '무엇이 얼마나 바뀌었나, 그리고 바뀐 가격에도 살 건가?',
        '何がどれだけ変わった?変わった価格でも買う?'),
    ],
    mustShow: [
      t('The old price and the new price, side by side', '이전 가격과 새 가격을 나란히', '旧価格と新価格を並べて'),
      t('Which item changed and the new total', '어떤 상품이 바뀌었는지와 새 합계', 'どの商品が変わったかと新しい合計'),
      t('An explicit re-consent step before charging', '결제 전 명시적인 재동의 단계', '請求前の明示的な再同意ステップ'),
    ],
    mustPreserve: [
      t('The cart and entered details', '장바구니와 입력값', 'カートと入力内容'),
      t('The chosen shipping and options', '선택한 배송·옵션', '選択した配送・オプション'),
    ],
    primaryActions: [ t('Review and accept the new price', '새 가격을 확인하고 동의', '新しい価格を確認して同意') ],
    secondaryActions: [
      t('Remove the repriced item', '가격이 바뀐 상품 삭제', '価格が変わった商品を削除'),
      t('Edit the cart', '장바구니 수정', 'カートを編集'),
    ],
    mustNot: [
      t('Charge the new price without the user re-consenting', '사용자 재동의 없이 새 가격으로 결제하기', 'ユーザーの再同意なく新価格で請求する'),
      t('Hide the change and slip the new total past the user', '변경을 숨기고 새 합계를 사용자 몰래 통과시키기', '変更を隠して新しい合計をこっそり通す'),
      t('Frame an increase as if it were the originally shown price', '인상된 가격을 원래 보여준 가격인 것처럼 표시하기', '値上がりを元々表示していた価格のように見せる'),
    ],
    accessibility: {
      announcement: t('Announce the price change assertively (role=alert) before any charge', '결제 전에 가격 변경을 단호하게(alert) 안내', '請求前に価格変更をはっきりと(alert)通知'),
      focus: t('Move focus to the price-change summary and its consent control', '포커스를 가격 변경 요약과 동의 컨트롤로 이동', 'フォーカスを価格変更の要約と同意操作へ移動'),
    },
    motion: {
      guidance: [ t('Reveal the old-vs-new comparison calmly; no urgency cues', '이전·새 가격 비교를 차분히 표시, 긴박 신호 금지', '旧・新価格の比較を落ち着いて表示、煽る演出禁止') ],
      reducedMotion: [ t('Show the comparison and consent step with no transition', '전환 없이 비교와 동의 단계를 표시', 'トランジション無しで比較と同意ステップを表示') ],
    },
  },
];
