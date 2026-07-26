import { t } from '../../localization';
import type { StateRecipe } from '../types';

export const chatRecipes: StateRecipe[] = [
  {
    id: 'initial',
    surfaceIds: ['chat'],
    category: 'content',
    criticality: 'required',
    name: t('Initial', '시작 상태', '初期状態'),
    summary: t(
      'A fresh conversation with no messages yet; the user has not asked anything.',
      '메시지가 아직 없는 새 대화. 사용자가 아무것도 묻지 않은 상태.',
      'メッセージがまだ無い新規の会話。ユーザーがまだ何も尋ねていない状態。'),
    aliases: ['empty chat', 'new conversation', 'blank thread', 'welcome', '새 대화', '빈 대화', '시작 화면', '空のチャット', '新規会話', 'ウェルカム'],
    domainSignals: ['chat', 'conversation', 'assistant', 'first-run'],
    triggers: [
      t('A new thread opens with no prior turns', '이전 대화가 없는 새 스레드가 열림', '過去のやり取りが無い新規スレッドが開く'),
      t('The user has not sent a first message', '사용자가 첫 메시지를 아직 보내지 않음', 'ユーザーがまだ最初のメッセージを送っていない'),
    ],
    userQuestions: [
      t('What can I ask here, and how do I start?',
        '여기서 뭘 물어볼 수 있고 어떻게 시작하지?',
        'ここで何を聞けて、どう始めればいい?'),
      t('Will it understand my own files or context?',
        '내 파일이나 맥락을 이해할 수 있나?',
        '自分のファイルや文脈を理解してくれる?'),
    ],
    mustShow: [
      t('A clear input affordance ready for the first message', '첫 메시지를 받을 입력창이 분명히 보임', '最初のメッセージを受け取る入力欄が明確に見える'),
      t('A short hint of what the assistant can help with', '어시스턴트가 무엇을 도울 수 있는지 간단한 힌트', 'アシスタントが何を手伝えるかの短いヒント'),
      t('A few example prompts the user can tap', '바로 누를 수 있는 예시 프롬프트 몇 개', 'すぐ押せる例プロンプトをいくつか'),
    ],
    mustPreserve: [
      t('Any draft already typed into the input', '입력창에 이미 입력된 초안', '入力欄にすでに打ち込まれた下書き'),
      t('The chosen model or mode selection', '선택한 모델·모드', '選択したモデル・モード'),
    ],
    primaryActions: [t('Send the first message', '첫 메시지 보내기', '最初のメッセージを送る')],
    secondaryActions: [
      t('Use an example prompt', '예시 프롬프트 사용', '例プロンプトを使う'),
      t('Attach a file or context', '파일·맥락 첨부', 'ファイル・文脈を添付'),
    ],
    mustNot: [
      t('Show a loading or thinking indicator before any input', '입력 전에 로딩·생각 중 표시를 보여주기', '入力前にローディング・思考中表示を出す'),
      t('Bury the input below a wall of marketing copy', '입력창을 긴 홍보 문구 아래에 묻기', '入力欄を長い宣伝文の下に埋める'),
      t('Pretend a conversation already exists', '대화가 이미 있는 것처럼 보이게 하기', '会話がすでにあるかのように見せる'),
    ],
    accessibility: {
      announcement: t('Announce that the chat is ready for input, politely', '채팅이 입력 준비됨을 방해되지 않게 안내', 'チャットが入力可能であることを控えめに通知'),
      focus: t('Place focus in the message input on open', '열릴 때 포커스를 메시지 입력창에 둠', '開いた時にフォーカスをメッセージ入力欄へ'),
      keyboard: [
        t('Enter sends, Shift+Enter inserts a newline', 'Enter는 전송, Shift+Enter는 줄바꿈', 'Enterで送信、Shift+Enterで改行'),
        t('Example prompts reachable by Tab', '예시 프롬프트를 Tab으로 도달', '例プロンプトにTabで到達'),
      ],
      contrast: [
        t('Placeholder text meets contrast minimums', '플레이스홀더 텍스트가 대비 최소치를 충족', 'プレースホルダー文字が最低コントラストを満たす'),
      ],
    },
    motion: {
      guidance: [t('Gently fade example prompts in; keep input instant', '예시 프롬프트는 부드럽게 페이드인, 입력창은 즉시', '例プロンプトはやわらかくフェードイン、入力欄は即時')],
      reducedMotion: [t('Show prompts and input with no transition', '전환 없이 프롬프트와 입력창 표시', 'トランジション無しでプロンプトと入力欄を表示')],
    },
  },
  {
    id: 'waiting',
    surfaceIds: ['chat'],
    category: 'network',
    criticality: 'required',
    name: t('Waiting', '응답 대기', '応答待ち'),
    summary: t(
      'The message was sent and the assistant is preparing a reply, but no tokens have streamed yet.',
      '메시지를 보냈고 어시스턴트가 답을 준비 중이지만 아직 토큰이 스트리밍되지 않은 상태.',
      'メッセージを送り、アシスタントが返答を準備中だが、まだトークンが流れていない状態。'),
    aliases: ['thinking', 'pending', 'loading reply', 'awaiting response', '생각 중', '대기 중', '응답 준비', '考え中', '待機中', '応答準備'],
    domainSignals: ['chat', 'pending', 'request-sent', 'thinking'],
    triggers: [
      t('The user message is sent and acknowledged', '사용자 메시지가 전송·접수됨', 'ユーザーメッセージが送信・受理された'),
      t('The model has not yet emitted its first token', '모델이 첫 토큰을 아직 내보내지 않음', 'モデルが最初のトークンをまだ出していない'),
    ],
    userQuestions: [
      t('Did my message go through, and is it actually working?',
        '내 메시지가 전달된 거 맞나, 정말 처리 중인가?',
        '私のメッセージは届いた?本当に処理中?'),
      t('How long will this take, or is it stuck?',
        '얼마나 걸리나, 아니면 멈춘 건가?',
        'どれくらいかかる?それとも止まってる?'),
    ],
    mustShow: [
      t('A clear in-progress indicator tied to the sent message', '보낸 메시지에 연결된 진행 중 표시', '送信したメッセージに紐づく進行中表示'),
      t('The user message already rendered in the thread', '스레드에 이미 표시된 사용자 메시지', 'スレッドにすでに表示されたユーザーメッセージ'),
      t('A way to stop or cancel the pending reply', '대기 중인 응답을 멈추거나 취소하는 방법', '待機中の応答を止める・取り消す手段'),
    ],
    mustPreserve: [
      t('The full conversation history', '대화 기록 전체', '会話履歴の全体'),
      t('The scroll position the user is reading', '사용자가 읽던 스크롤 위치', 'ユーザーが読んでいたスクロール位置'),
      t('Any new draft typed while waiting', '대기 중 입력한 새 초안', '待機中に入力した新しい下書き'),
    ],
    primaryActions: [t('Stop the request', '요청 중지', 'リクエストを停止')],
    secondaryActions: [t('Keep typing the next message', '다음 메시지 계속 작성', '次のメッセージを書き続ける')],
    mustNot: [
      t('Block the input or the stop control while waiting', '대기 중 입력창이나 중지 버튼을 막기', '待機中に入力欄や停止ボタンを塞ぐ'),
      t('Replace the user message with a spinner', '사용자 메시지를 스피너로 대체', 'ユーザーメッセージをスピナーで置き換える'),
      t('Imply a timeout that has not happened yet', '아직 일어나지 않은 타임아웃을 암시', 'まだ起きていないタイムアウトを示唆する'),
    ],
    accessibility: {
      announcement: t('Announce "generating a response" politely', '“응답 생성 중”을 방해되지 않게 안내', '「応答を生成中」を控えめに通知'),
      focus: t('Do not move focus; leave it where the user left it', '포커스를 옮기지 않고 사용자가 둔 자리에 유지', 'フォーカスを動かさず、ユーザーが置いた場所に維持'),
      keyboard: [
        t('Escape triggers stop', 'Escape로 중지', 'Escapeで停止'),
      ],
    },
    motion: {
      guidance: [t('Use a calm looping indicator, not a frantic spinner', '조급한 스피너 대신 차분한 반복 인디케이터', '焦るスピナーではなく落ち着いたループ表示')],
      reducedMotion: [t('Show a static "generating…" label instead of animation', '애니메이션 대신 정적 “생성 중…” 표시', 'アニメの代わりに静的な「生成中…」表示')],
    },
  },
  {
    id: 'streaming',
    surfaceIds: ['chat'],
    category: 'network',
    criticality: 'required',
    name: t('Streaming', '스트리밍 중', 'ストリーミング中'),
    summary: t(
      'The assistant reply is arriving token by token and being appended live to the thread.',
      '어시스턴트 응답이 토큰 단위로 도착해 스레드에 실시간으로 이어붙는 상태.',
      'アシスタントの返答がトークン単位で届き、スレッドにリアルタイムで追記される状態。'),
    aliases: ['typing', 'token stream', 'live response', 'generating', '타이핑 중', '실시간 응답', '토큰 스트림', 'タイピング中', 'ライブ応答', 'トークンストリーム'],
    domainSignals: ['chat', 'streaming', 'tokens', 'sse'],
    triggers: [
      t('The first token of the reply arrives', '응답의 첫 토큰이 도착', '返答の最初のトークンが届く'),
      t('More tokens continue to append until the reply ends', '응답이 끝날 때까지 토큰이 계속 이어붙음', '返答が終わるまでトークンが追記され続ける'),
    ],
    userQuestions: [
      t('Can I stop this if it is going the wrong way?',
        '엉뚱하게 가면 멈출 수 있나?',
        '見当違いなら途中で止められる?'),
      t('Is this the final answer or still coming?',
        '이게 최종 답인가, 아직 오는 중인가?',
        'これが最終回答?まだ続いている?'),
    ],
    mustShow: [
      t('Text appended live as it streams', '스트리밍되는 텍스트를 실시간으로 추가 표시', 'ストリーミングされる文字をライブで追記表示'),
      t('An always-available stop control', '항상 누를 수 있는 중지 버튼', '常に押せる停止ボタン'),
      t('A visible signal that generation is still ongoing', '생성이 진행 중임을 보여주는 표시', '生成が進行中であることを示すサイン'),
    ],
    mustPreserve: [
      t('Already-streamed text if the user scrolls away', '사용자가 스크롤해도 이미 스트리밍된 텍스트', 'ユーザーがスクロールしても既にストリーミングされた文字'),
      t('The conversation history above', '위쪽 대화 기록', '上の会話履歴'),
      t('The user draft for the next message', '다음 메시지용 사용자 초안', '次のメッセージ用のユーザー下書き'),
    ],
    primaryActions: [t('Stop generating', '생성 중지', '生成を停止')],
    secondaryActions: [
      t('Scroll up to read earlier text', '위로 스크롤해 앞부분 읽기', '上にスクロールして前の部分を読む'),
      t('Copy the partial text', '부분 텍스트 복사', '途中までの文字をコピー'),
    ],
    mustNot: [
      t('Disable or hide the stop control while streaming', '스트리밍 중 중지 버튼을 비활성·숨김', 'ストリーミング中に停止ボタンを無効・非表示にする'),
      t('Force-scroll the user back down on every token', '토큰마다 사용자를 강제로 아래로 스크롤', 'トークンごとにユーザーを強制で下にスクロール'),
      t('Re-render the whole message on each token (flicker)', '토큰마다 메시지 전체를 다시 그려 깜빡임 유발', 'トークンごとにメッセージ全体を再描画してちらつかせる'),
    ],
    accessibility: {
      announcement: t('Stream into a polite live region; do not re-announce each token', 'aria-live="polite" 영역에 스트리밍, 토큰마다 재안내 금지', 'aria-live="polite"の領域へ流し、トークンごとの再通知はしない'),
      focus: t('Keep focus on the stop control or input, not the moving text', '움직이는 텍스트가 아닌 중지 버튼·입력창에 포커스 유지', '動く文字ではなく停止ボタン・入力欄にフォーカスを維持'),
      keyboard: [
        t('Escape stops generation', 'Escape로 생성 중지', 'Escapeで生成停止'),
      ],
    },
    motion: {
      guidance: [t('Append text smoothly; avoid a jumpy cursor or layout shift', '텍스트를 매끄럽게 추가, 커서 튐·레이아웃 이동 방지', '文字を滑らかに追記、カーソル跳ね・レイアウトずれを防ぐ')],
      reducedMotion: [t('Append finalized chunks without a blinking cursor', '깜빡이는 커서 없이 확정된 덩어리를 추가', '点滅カーソル無しで確定したまとまりを追記')],
    },
  },
  {
    id: 'completed',
    surfaceIds: ['chat'],
    category: 'data',
    criticality: 'required',
    name: t('Completed', '응답 완료', '応答完了'),
    summary: t(
      'The assistant finished its reply in full; the turn is settled and the user can act on it.',
      '어시스턴트가 응답을 끝까지 마친 상태. 한 턴이 정리되어 사용자가 후속 동작을 할 수 있음.',
      'アシスタントが返答を最後まで終えた状態。一つのターンが整い、ユーザーが次の操作をできる。'),
    aliases: ['done', 'finished reply', 'answer ready', 'turn complete', '완료', '답변 완료', '응답 끝', '完了', '回答完了', 'ターン終了'],
    domainSignals: ['chat', 'completed', 'final', 'turn-end'],
    triggers: [
      t('The reply stream reaches its natural end', '응답 스트림이 자연스럽게 끝까지 도달', '返答ストリームが自然に最後まで到達'),
      t('No tool call or follow-up is pending', '대기 중인 도구 호출·후속 작업이 없음', '保留中のツール呼び出し・後続作業が無い'),
    ],
    userQuestions: [
      t('Is this the complete answer, and what can I do with it?',
        '이게 완전한 답인가, 이걸로 뭘 할 수 있나?',
        'これは完全な回答?これで何ができる?'),
      t('How do I keep going or ask a follow-up?',
        '이어가거나 후속 질문을 어떻게 하지?',
        '続けるには、追加質問はどうする?'),
    ],
    mustShow: [
      t('The full reply with a clear end-of-message boundary', '메시지 끝이 분명한 완성된 응답', 'メッセージ終端が明確な完成した返答'),
      t('Per-message actions such as copy and regenerate', '복사·재생성 같은 메시지별 동작', 'コピー・再生成などメッセージ単位の操作'),
      t('A ready input for the next turn', '다음 턴을 위한 준비된 입력창', '次のターン用の準備済み入力欄'),
    ],
    mustPreserve: [
      t('The completed reply in the conversation history', '대화 기록에 남은 완료된 응답', '会話履歴に残る完了した返答'),
      t('Scroll position so the user is not yanked to the bottom', '사용자가 끝으로 끌려가지 않도록 스크롤 위치', 'ユーザーが末尾へ引っ張られないようスクロール位置'),
    ],
    primaryActions: [t('Ask a follow-up', '후속 질문하기', '追加で質問する')],
    secondaryActions: [
      t('Copy the reply', '응답 복사', '返答をコピー'),
      t('Regenerate the reply', '응답 재생성', '返答を再生成'),
      t('Give feedback (thumbs up/down)', '피드백 주기(좋아요/싫어요)', 'フィードバック(高評価/低評価)'),
    ],
    mustNot: [
      t('Keep showing a generating indicator after completion', '완료 후에도 생성 중 표시를 유지', '完了後も生成中表示を出し続ける'),
      t('Auto-start a new generation without the user asking', '사용자가 요청하지 않은 새 생성을 자동 시작', 'ユーザーが頼んでいない新たな生成を自動開始'),
      t('Hide whether the answer was cut off vs. truly finished', '답이 잘렸는지 정말 끝났는지를 숨기기', '回答が途切れたのか本当に終わったのかを隠す'),
    ],
    accessibility: {
      announcement: t('Announce "response complete" politely once', '“응답 완료”를 방해되지 않게 한 번 안내', '「応答完了」を控えめに一度通知'),
      focus: t('Return focus to the input for the next message', '다음 메시지를 위해 포커스를 입력창으로 복귀', '次のメッセージのためフォーカスを入力欄へ戻す'),
      keyboard: [
        t('Message actions reachable by keyboard', '메시지 동작을 키보드로 도달', 'メッセージ操作にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Settle the message with a subtle finalize cue, no celebration', '축하 없이 미묘한 완료 신호로 메시지를 마무리', '祝福無しの控えめな完了サインでメッセージを締める')],
      reducedMotion: [t('Show the final message and actions with no transition', '전환 없이 최종 메시지와 동작 표시', 'トランジション無しで最終メッセージと操作を表示')],
    },
  },
  {
    id: 'chat-failed',
    surfaceIds: ['chat'],
    category: 'network',
    criticality: 'required',
    name: t('Failed', '응답 실패', '応答失敗'),
    summary: t(
      'The request errored out and no usable reply was produced (server error, timeout, or aborted stream).',
      '요청이 오류로 끝나 쓸 만한 응답이 나오지 못한 상태(서버 오류·타임아웃·스트림 중단).',
      'リクエストがエラーで終わり、使える返答が得られなかった状態(サーバーエラー・タイムアウト・ストリーム中断)。'),
    aliases: ['error', 'request failed', 'generation error', 'something went wrong', '오류', '요청 실패', '생성 오류', 'エラー', 'リクエスト失敗', '生成エラー'],
    domainSignals: ['chat', 'error', 'failed', 'timeout'],
    triggers: [
      t('The backend returns an error or the stream aborts', '백엔드가 오류를 반환하거나 스트림이 중단됨', 'バックエンドがエラーを返す、またはストリームが中断'),
      t('A request times out before any usable reply', '쓸 만한 응답 전에 요청이 타임아웃', '使える返答の前にリクエストがタイムアウト'),
    ],
    userQuestions: [
      t('Did I lose my message, and can I just try again?',
        '내 메시지가 날아간 건가, 그냥 다시 해도 되나?',
        '私のメッセージは消えた?もう一度やり直せる?'),
      t('Is this my fault or the service being down?',
        '내 문제인가, 서비스 장애인가?',
        '私のせい?それともサービス障害?'),
    ],
    mustShow: [
      t('A plain explanation that the reply failed', '응답이 실패했다는 평이한 설명', '返答が失敗したという平易な説明'),
      t('The user message preserved and clearly retryable', '보존된 채 명확히 재시도 가능한 사용자 메시지', '保持され、明確に再試行できるユーザーメッセージ'),
      t('A safe reason if known (e.g., overloaded, network)', '알 수 있으면 안전한 사유(과부하·네트워크 등)', '分かる範囲で安全な理由(過負荷・ネットワークなど)'),
    ],
    mustPreserve: [
      t('The user message that failed, intact for retry', '재시도용으로 온전한 실패 메시지', '再試行用に無傷の失敗メッセージ'),
      t('The full conversation history before the failure', '실패 이전의 대화 기록 전체', '失敗前の会話履歴の全体'),
      t('Any draft the user had typed', '사용자가 입력해둔 초안', 'ユーザーが入力していた下書き'),
    ],
    primaryActions: [t('Retry the message', '메시지 재시도', 'メッセージを再試行')],
    secondaryActions: [
      t('Copy the message text', '메시지 텍스트 복사', 'メッセージ文をコピー'),
      t('Report the problem', '문제 신고', '問題を報告'),
    ],
    mustNot: [
      t('Silently auto-retry without telling the user', '사용자에게 알리지 않고 조용히 자동 재시도', 'ユーザーに伝えず黙って自動再試行する'),
      t('Discard the user message that just failed', '방금 실패한 사용자 메시지를 버리기', '今失敗したユーザーメッセージを破棄する'),
      t('Show a raw stack trace or internal error code', '원시 스택 트레이스·내부 오류 코드 노출', '生のスタックトレース・内部エラーコードを露出'),
    ],
    accessibility: {
      announcement: t('Announce the failure assertively (role=alert)', '실패를 단호하게(alert) 안내', '失敗をはっきりと(alert)通知'),
      focus: t('Move focus to the retry action', '포커스를 재시도 동작으로 이동', 'フォーカスを再試行操作へ移す'),
      keyboard: [
        t('Retry reachable and operable by keyboard', '재시도를 키보드로 도달·실행', '再試行にキーボードで到達・実行'),
      ],
      contrast: [
        t('Error state colors meet contrast minimums', '오류 상태 색상이 대비 최소치를 충족', 'エラー状態の色が最低コントラストを満たす'),
      ],
    },
    motion: {
      guidance: [t('Reveal the error calmly; no shake or alarm flash', '오류를 차분히 표시, 흔들림·경보 깜빡임 금지', 'エラーを落ち着いて表示、揺れ・警報点滅を禁止')],
      reducedMotion: [t('Show the error immediately with no animation', '애니메이션 없이 즉시 오류 표시', 'アニメ無しで即時にエラー表示')],
    },
  },
  {
    id: 'reconnecting',
    surfaceIds: ['chat'],
    category: 'network',
    criticality: 'required',
    name: t('Reconnecting', '재연결 중', '再接続中'),
    summary: t(
      'The live connection dropped mid-conversation and the client is trying to restore it without losing the in-progress turn.',
      '대화 도중 실시간 연결이 끊겨 진행 중인 턴을 잃지 않고 연결을 복구하려는 상태.',
      '会話の途中で接続が切れ、進行中のターンを失わずに復旧を試みている状態。'),
    aliases: ['reconnect', 'connection lost', 'restoring stream', 'offline retry', '재연결', '연결 끊김', '스트림 복구', '再接続', '接続切断', 'ストリーム復旧'],
    domainSignals: ['chat', 'reconnect', 'websocket', 'connection-lost'],
    triggers: [
      t('The streaming connection drops during a turn', '턴 진행 중 스트리밍 연결이 끊김', 'ターン中にストリーミング接続が切れる'),
      t('The client begins automatic reconnection attempts', '클라이언트가 자동 재연결을 시도하기 시작', 'クライアントが自動再接続を試み始める'),
    ],
    userQuestions: [
      t('Did I lose the answer that was coming in?',
        '오던 답변을 잃은 건가?',
        '届きかけていた回答を失った?'),
      t('Will it pick up where it left off, or start over?',
        '끊긴 데서 이어지나, 처음부터 다시 하나?',
        '途切れた所から続く?それとも最初からやり直す?'),
    ],
    mustShow: [
      t('A non-alarming "reconnecting" status', '불안하지 않은 “재연결 중” 상태', '不安を煽らない「再接続中」状態'),
      t('The partial reply received so far, kept on screen', '지금까지 받은 부분 응답을 화면에 유지', 'これまで受け取った途中の返答を画面に保持'),
      t('Whether it will resume or need a manual retry', '이어서 복구되는지 수동 재시도가 필요한지', '再開できるのか手動再試行が要るのか'),
    ],
    mustPreserve: [
      t('The in-progress message already streamed', '이미 스트리밍된 진행 중 메시지', 'すでにストリーミングされた進行中のメッセージ'),
      t('The full conversation history', '대화 기록 전체', '会話履歴の全体'),
      t('The user draft and scroll position', '사용자 초안과 스크롤 위치', 'ユーザー下書きとスクロール位置'),
    ],
    primaryActions: [t('Wait for automatic reconnection', '자동 재연결 기다리기', '自動再接続を待つ')],
    secondaryActions: [
      t('Retry now', '지금 재시도', '今すぐ再試行'),
      t('Continue reading what already arrived', '이미 도착한 내용 계속 읽기', '既に届いた内容を読み続ける'),
    ],
    mustNot: [
      t('Duplicate the in-progress message on reconnect', '재연결 시 진행 중 메시지를 중복 생성', '再接続時に進行中メッセージを重複させる'),
      t('Clear the partial reply already shown', '이미 보여준 부분 응답을 지우기', '既に表示した途中の返答を消す'),
      t('Treat a transient drop as a hard failure prematurely', '일시적 끊김을 성급히 완전 실패로 처리', '一時的な切断を早まって完全失敗として扱う'),
    ],
    accessibility: {
      announcement: t('Announce "reconnecting" politely; escalate only if it fails', '“재연결 중”을 방해되지 않게 안내, 실패 시에만 격상', '「再接続中」を控えめに通知、失敗時のみ昇格'),
      focus: t('Do not steal focus while reconnecting', '재연결 중 포커스를 빼앗지 않기', '再接続中にフォーカスを奪わない'),
      keyboard: [
        t('Manual retry reachable by keyboard', '수동 재시도를 키보드로 도달', '手動再試行にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Use a quiet pulsing status, not a spinning alarm', '회전하는 경보 대신 조용한 펄스 상태', '回る警報ではなく静かなパルス状態を使う')],
      reducedMotion: [t('Show a static "reconnecting…" label with no pulse', '펄스 없이 정적 “재연결 중…” 표시', 'パルス無しで静的な「再接続中…」表示')],
    },
  },
  {
    id: 'interrupted',
    surfaceIds: ['chat'],
    category: 'interaction',
    criticality: 'recommended',
    name: t('Interrupted', '중단됨', '中断'),
    summary: t(
      'The user deliberately stopped the reply mid-stream; what arrived so far is kept and marked as stopped.',
      '사용자가 스트리밍 도중 응답을 의도적으로 멈춘 상태. 지금까지 온 내용은 보존되고 중단됨으로 표시됨.',
      'ユーザーがストリーミング途中で意図的に返答を止めた状態。これまで届いた内容は保持され、中断と表示される。'),
    aliases: ['stopped', 'user cancelled', 'halted generation', 'aborted by user', '정지', '사용자 취소', '생성 중단', '停止', 'ユーザー取消', '生成中断'],
    domainSignals: ['chat', 'stopped', 'user-cancelled', 'aborted'],
    triggers: [
      t('The user presses stop during streaming', '스트리밍 중 사용자가 중지를 누름', 'ストリーミング中にユーザーが停止を押す'),
      t('Generation halts on the user command, not an error', '오류가 아닌 사용자 명령으로 생성이 멈춤', 'エラーではなくユーザー命令で生成が止まる'),
    ],
    userQuestions: [
      t('Did my stop actually take effect, and can I keep what I got?',
        '내 중지가 진짜 먹은 건가, 받은 건 그대로 둘 수 있나?',
        '私の停止は本当に効いた?受け取った分はそのまま使える?'),
      t('Can I let it continue from here if I change my mind?',
        '마음 바뀌면 여기서 이어가게 할 수 있나?',
        '気が変わったらここから続けさせられる?'),
    ],
    mustShow: [
      t('That generation was stopped by the user, not failed', '실패가 아니라 사용자가 중단했음을', '失敗ではなくユーザーが中断したことを'),
      t('The partial reply received, clearly marked as stopped', '중단으로 표시된, 받은 부분 응답', '中断と明記された、受け取った途中の返答'),
    ],
    mustPreserve: [
      t('The partial reply text up to the stop point', '중단 지점까지의 부분 응답 텍스트', '停止地点までの途中の返答テキスト'),
      t('The conversation history and the user draft', '대화 기록과 사용자 초안', '会話履歴とユーザー下書き'),
    ],
    primaryActions: [t('Continue generating', '이어서 생성', '続けて生成')],
    secondaryActions: [
      t('Regenerate from scratch', '처음부터 재생성', '最初から再生成'),
      t('Ask something else', '다른 것 묻기', '別のことを聞く'),
    ],
    mustNot: [
      t('Discard the partial text the user chose to keep', '사용자가 남기려 한 부분 텍스트를 버리기', 'ユーザーが残そうとした途中テキストを破棄する'),
      t('Label a user stop as an error or failure', '사용자 중지를 오류·실패로 표시', 'ユーザーの停止をエラー・失敗と表示する'),
      t('Auto-resume without the user asking', '사용자 요청 없이 자동으로 이어쓰기', 'ユーザーの依頼なく自動で続行する'),
    ],
    accessibility: {
      announcement: t('Announce "stopped" politely', '“중지됨”을 방해되지 않게 안내', '「停止しました」を控えめに通知'),
      focus: t('Return focus to the input', '포커스를 입력창으로 복귀', 'フォーカスを入力欄へ戻す'),
      keyboard: [
        t('Continue and regenerate reachable by keyboard', '이어서·재생성을 키보드로 도달', '続行・再生成にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Freeze the streamed text instantly; no rewind animation', '스트리밍 텍스트를 즉시 정지, 되감기 애니메이션 금지', 'ストリーミング文字を即時に固定、巻き戻しアニメ禁止')],
      reducedMotion: [t('Stop appending immediately and show the stopped marker', '추가를 즉시 멈추고 중단 표시를 보여줌', '追記を即時に止め、中断マーカーを表示')],
    },
  },
  {
    id: 'tool-running',
    surfaceIds: ['chat'],
    category: 'data',
    criticality: 'domain-specific',
    name: t('Tool running', '도구 실행 중', 'ツール実行中'),
    summary: t(
      'The assistant paused text to call a tool (search, code, API) and is waiting on that tool to return.',
      '어시스턴트가 텍스트를 멈추고 도구(검색·코드·API)를 호출해 결과를 기다리는 상태.',
      'アシスタントが文章を止めてツール(検索・コード・API)を呼び出し、その結果を待っている状態。'),
    aliases: ['tool call', 'running tool', 'function call', 'agent step', '도구 호출', '함수 호출', '에이전트 단계', 'ツール呼び出し', '関数呼び出し', 'エージェントステップ'],
    domainSignals: ['chat', 'tool-call', 'function', 'agent'],
    triggers: [
      t('The model invokes a tool mid-reply', '응답 도중 모델이 도구를 호출', '返答の途中でモデルがツールを呼び出す'),
      t('The reply waits on the tool result to continue', '응답이 계속되려면 도구 결과를 기다림', '返答を続けるためツール結果を待つ'),
    ],
    userQuestions: [
      t('What is it doing right now, and can I stop it?',
        '지금 뭘 하는 거고, 멈출 수 있나?',
        '今何をしてる?止められる?'),
      t('Is it using my data or going off and searching?',
        '내 데이터를 쓰나, 밖에서 검색하나?',
        '私のデータを使ってる?外部で検索してる?'),
    ],
    mustShow: [
      t('Which tool is running, in plain language', '어떤 도구가 실행 중인지 쉬운 말로', 'どのツールが実行中かを平易な言葉で'),
      t('A progress or running indicator for that step', '해당 단계의 진행·실행 표시', 'その手順の進行・実行表示'),
      t('A control to wait or cancel the tool step', '도구 단계를 기다리거나 취소하는 컨트롤', 'ツール手順を待つ・取り消すコントロール'),
    ],
    mustPreserve: [
      t('The reply text streamed before the tool call', '도구 호출 전에 스트리밍된 응답 텍스트', 'ツール呼び出し前にストリーミングされた返答テキスト'),
      t('The conversation history and user draft', '대화 기록과 사용자 초안', '会話履歴とユーザー下書き'),
    ],
    primaryActions: [t('Wait for the tool to finish', '도구 완료 기다리기', 'ツールの完了を待つ')],
    secondaryActions: [
      t('Cancel the tool step', '도구 단계 취소', 'ツール手順を取り消す'),
      t('View tool inputs or details', '도구 입력·상세 보기', 'ツールの入力・詳細を見る'),
    ],
    mustNot: [
      t('Hide which tool is running behind a generic spinner', '실행 중인 도구를 일반 스피너 뒤에 숨기기', '実行中のツールを汎用スピナーの裏に隠す'),
      t('Block the user from cancelling the step', '사용자가 단계를 취소하지 못하게 막기', 'ユーザーが手順を取り消せないようにする'),
      t('Imply the final answer is ready while a tool is pending', '도구가 대기 중인데 최종 답이 준비된 듯 보이기', 'ツール待ちなのに最終回答が出来たように見せる'),
    ],
    accessibility: {
      announcement: t('Announce "running {tool}" politely', '“{tool} 실행 중”을 방해되지 않게 안내', '「{tool}を実行中」を控えめに通知'),
      focus: t('Do not move focus; keep it on the input or cancel control', '포커스를 옮기지 않고 입력창·취소 버튼에 유지', 'フォーカスを動かさず入力欄・取消ボタンに維持'),
      keyboard: [
        t('Cancel reachable by keyboard', '취소를 키보드로 도달', '取消にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Show a discrete step indicator, not a full-message shimmer', '메시지 전체 셰이머 대신 단계별 표시', 'メッセージ全体のシマーではなく手順ごとの表示')],
      reducedMotion: [t('Show a static "running {tool}…" label', '정적 “{tool} 실행 중…” 표시', '静的な「{tool}を実行中…」表示')],
    },
  },
  {
    id: 'tool-failed',
    surfaceIds: ['chat'],
    category: 'data',
    criticality: 'domain-specific',
    name: t('Tool failed', '도구 실패', 'ツール失敗'),
    summary: t(
      'A tool the assistant called errored out; the turn can often continue, but that step did not return a usable result.',
      '어시스턴트가 호출한 도구가 오류로 끝난 상태. 턴은 이어갈 수 있는 경우가 많지만 그 단계는 쓸 결과를 내지 못함.',
      'アシスタントが呼び出したツールがエラーで終わった状態。ターンは続けられることが多いが、その手順は使える結果を返せなかった。'),
    aliases: ['tool error', 'function failed', 'step failed', 'tool unavailable', '도구 오류', '함수 실패', '단계 실패', 'ツールエラー', '関数失敗', '手順失敗'],
    domainSignals: ['chat', 'tool-call', 'tool-error', 'agent'],
    triggers: [
      t('A called tool returns an error or times out', '호출한 도구가 오류를 반환하거나 타임아웃', '呼び出したツールがエラーを返す・タイムアウトする'),
      t('The tool result is missing or unusable', '도구 결과가 없거나 사용할 수 없음', 'ツール結果が無い・使えない'),
    ],
    userQuestions: [
      t('Did the whole answer fail, or just one step?',
        '답 전체가 실패한 건가, 한 단계만 실패한 건가?',
        '回答全体が失敗?それとも一手順だけ?'),
      t('Can it try the tool again or answer without it?',
        '도구를 다시 시도하거나 도구 없이 답할 수 있나?',
        'ツールを再試行できる?ツール無しでも答えられる?'),
    ],
    mustShow: [
      t('Which tool step failed, distinct from the reply itself', '응답 자체와 구분되는, 실패한 도구 단계', '返答そのものと区別される、失敗したツール手順'),
      t('Whether the assistant can continue without that result', '그 결과 없이 어시스턴트가 이어갈 수 있는지', 'その結果無しでアシスタントが続けられるか'),
      t('A safe, non-technical reason if known', '알 수 있으면 안전한 비기술적 사유', '分かる範囲で安全な非技術的理由'),
    ],
    mustPreserve: [
      t('Text and successful tool steps already produced', '이미 만들어진 텍스트와 성공한 도구 단계', '既に生成された文章と成功したツール手順'),
      t('The conversation history and user draft', '대화 기록과 사용자 초안', '会話履歴とユーザー下書き'),
    ],
    primaryActions: [t('Retry the tool step', '도구 단계 재시도', 'ツール手順を再試行')],
    secondaryActions: [
      t('Continue without that tool', '그 도구 없이 계속', 'そのツール無しで続行'),
      t('View the error detail', '오류 상세 보기', 'エラー詳細を見る'),
    ],
    mustNot: [
      t('Collapse a tool failure into a blank or silent reply', '도구 실패를 빈·무응답으로 뭉개기', 'ツール失敗を空白・無応答に潰す'),
      t('Silently retry the tool in a loop', '도구를 조용히 반복 재시도', 'ツールを黙ってループ再試行する'),
      t('Expose raw tool stack traces or secrets', '원시 도구 스택 트레이스·비밀 노출', '生のツールスタックトレース・秘密を露出'),
    ],
    accessibility: {
      announcement: t('Announce the tool failure assertively (role=alert)', '도구 실패를 단호하게(alert) 안내', 'ツール失敗をはっきりと(alert)通知'),
      focus: t('Move focus to the retry-or-continue choice', '포커스를 재시도·계속 선택으로 이동', 'フォーカスを再試行・続行の選択へ移す'),
      keyboard: [
        t('Retry and continue reachable by keyboard', '재시도·계속을 키보드로 도달', '再試行・続行にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Reveal the failed step calmly inside the step list', '실패한 단계를 단계 목록 안에서 차분히 표시', '失敗した手順を手順リスト内で落ち着いて表示')],
      reducedMotion: [t('Show the failed step state with no animation', '애니메이션 없이 실패 단계 상태 표시', 'アニメ無しで失敗手順の状態を表示')],
    },
  },
  {
    id: 'context-limit',
    surfaceIds: ['chat'],
    category: 'content',
    criticality: 'domain-specific',
    name: t('Context limit', '컨텍스트 한도', 'コンテキスト上限'),
    summary: t(
      'The conversation has grown past what the model can hold, so older turns risk being dropped or the reply cannot fit.',
      '대화가 모델이 담을 수 있는 한도를 넘어 이전 턴이 잘릴 위험이 있거나 응답이 들어가지 못하는 상태.',
      '会話がモデルの保持できる量を超え、古いターンが切り捨てられる恐れがある、または返答が収まらない状態。'),
    aliases: ['context full', 'token limit', 'conversation too long', 'window exceeded', '컨텍스트 가득', '토큰 한도', '대화 너무 김', 'コンテキスト満杯', 'トークン上限', '会話が長すぎる'],
    domainSignals: ['chat', 'context-window', 'token-limit', 'truncation'],
    triggers: [
      t('Total tokens approach or exceed the context window', '총 토큰이 컨텍스트 창에 근접·초과', '合計トークンがコンテキストウィンドウに接近・超過'),
      t('Older turns must be dropped to fit a new reply', '새 응답을 넣으려면 이전 턴을 버려야 함', '新しい返答を入れるため古いターンを捨てる必要がある'),
    ],
    userQuestions: [
      t('Why is this happening, and will it forget what we discussed?',
        '왜 이런 거고, 우리가 얘기한 걸 잊어버리나?',
        'なぜこうなる?話したことを忘れてしまう?'),
      t('How do I keep going without losing the thread?',
        '맥락을 잃지 않고 어떻게 계속하지?',
        '文脈を失わずにどう続ければいい?'),
    ],
    mustShow: [
      t('Why the limit was hit, in plain language', '한도에 닿은 이유를 쉬운 말로', '上限に達した理由を平易な言葉で'),
      t('What is at risk of being dropped (older turns)', '잘릴 위험이 있는 것(이전 턴)', '切り捨ての恐れがあるもの(古いターン)'),
      t('A concrete path forward: new thread or summarize', '구체적 해결 경로: 새 대화 또는 요약', '具体的な進路: 新規スレッド、または要約'),
    ],
    mustPreserve: [
      t('The most recent and most relevant turns', '가장 최근의·가장 관련 있는 턴', '直近かつ最も関連するターン'),
      t('The user draft and scroll position', '사용자 초안과 스크롤 위치', 'ユーザー下書きとスクロール位置'),
    ],
    primaryActions: [t('Start a new thread carrying a summary', '요약을 가져가 새 대화 시작', '要約を引き継いで新規スレッドを開始')],
    secondaryActions: [
      t('Summarize and continue here', '요약하고 여기서 계속', '要約してここで続ける'),
      t('Trim older messages manually', '이전 메시지를 수동으로 정리', '古いメッセージを手動で整理'),
    ],
    mustNot: [
      t('Just fail without explaining why or offering a path', '이유·해결책 없이 그냥 실패시키기', '理由も解決策も示さず単に失敗させる'),
      t('Drop older turns silently with no warning', '경고 없이 이전 턴을 조용히 버리기', '警告無しで古いターンを黙って捨てる'),
      t('Show only an opaque token-count error code', '불투명한 토큰 수 오류 코드만 보여주기', '不透明なトークン数エラーコードだけを見せる'),
    ],
    accessibility: {
      announcement: t('Announce the limit and the offered path politely', '한도와 제시된 경로를 방해되지 않게 안내', '上限と提示した進路を控えめに通知'),
      focus: t('Move focus to the new-thread or summarize action', '포커스를 새 대화·요약 동작으로 이동', 'フォーカスを新規スレッド・要約操作へ移す'),
      keyboard: [
        t('New thread and summarize reachable by keyboard', '새 대화·요약을 키보드로 도달', '新規スレッド・要約にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Present the notice as a calm inline panel, no alarm', '경보 없이 차분한 인라인 패널로 안내', '警報無しで落ち着いたインラインパネルとして表示')],
      reducedMotion: [t('Show the notice and options with no transition', '전환 없이 안내와 선택지 표시', 'トランジション無しで通知と選択肢を表示')],
    },
  },
  {
    id: 'partial-response',
    surfaceIds: ['chat'],
    category: 'data',
    criticality: 'domain-specific',
    name: t('Partial response', '부분 응답', '部分応答'),
    summary: t(
      'The reply ended before it was complete (cut off by length, a stop reason, or a dropped stream) and must be marked as unfinished.',
      '응답이 완성 전에 끝난 상태(길이·중단 사유·스트림 끊김으로 잘림). 미완성임을 분명히 표시해야 함.',
      '返答が完成前に終わった状態(長さ・停止理由・ストリーム切断で途切れた)。未完成であると明記しなければならない。'),
    aliases: ['truncated', 'incomplete answer', 'cut off', 'max length reached', '잘린 응답', '미완성 답변', '중간에 끊김', '途切れた応答', '未完成回答', '最大長到達'],
    domainSignals: ['chat', 'truncated', 'incomplete', 'max-tokens'],
    triggers: [
      t('The reply hits a length cap before finishing', '응답이 완료 전 길이 한도에 도달', '返答が完了前に長さ上限に達する'),
      t('The stream ends without a natural completion', '스트림이 자연스러운 완료 없이 끝남', 'ストリームが自然な完了無しに終わる'),
    ],
    userQuestions: [
      t('Is this the whole answer or did it get cut off?',
        '이게 전부인가, 아니면 중간에 잘린 건가?',
        'これで全部?それとも途中で切れた?'),
      t('Can I get the rest of it from where it stopped?',
        '멈춘 데서 나머지를 받을 수 있나?',
        '止まった所から残りをもらえる?'),
    ],
    mustShow: [
      t('A clear marker that the answer is incomplete', '답이 미완성임을 분명히 표시', '回答が未完成であると明確に表示'),
      t('Why it stopped (length, stop reason)', '멈춘 이유(길이·중단 사유)', '止まった理由(長さ・停止理由)'),
      t('The partial text received so far, kept intact', '지금까지 받은 부분 텍스트를 온전히 유지', 'これまで受け取った途中の文章を無傷で保持'),
    ],
    mustPreserve: [
      t('The partial reply text, not discarded', '버리지 않은 부분 응답 텍스트', '破棄しない途中の返答テキスト'),
      t('The conversation history and user draft', '대화 기록과 사용자 초안', '会話履歴とユーザー下書き'),
    ],
    primaryActions: [t('Continue the answer from where it stopped', '멈춘 데서 답변 이어받기', '止まった所から回答を続ける')],
    secondaryActions: [
      t('Regenerate the full answer', '전체 답변 재생성', '回答全体を再生成'),
      t('Copy the partial text', '부분 텍스트 복사', '途中の文章をコピー'),
    ],
    mustNot: [
      t('Present the truncated reply as if it were complete', '잘린 응답을 완성된 것처럼 보이기', '途切れた返答を完成したように見せる'),
      t('Discard the partial text the user might still want', '사용자가 원할 수 있는 부분 텍스트를 버리기', 'ユーザーがまだ欲しいかもしれない途中文を破棄する'),
      t('Auto-continue without telling the user it was partial', '부분 응답임을 알리지 않고 자동 이어쓰기', '部分応答だと伝えず自動で続行する'),
    ],
    accessibility: {
      announcement: t('Announce that the response is incomplete politely', '응답이 미완성임을 방해되지 않게 안내', '応答が未完成であることを控えめに通知'),
      focus: t('Move focus to the continue action', '포커스를 이어받기 동작으로 이동', 'フォーカスを続行操作へ移す'),
      keyboard: [
        t('Continue and regenerate reachable by keyboard', '이어받기·재생성을 키보드로 도달', '続行・再生成にキーボードで到達'),
      ],
    },
    motion: {
      guidance: [t('Append the incomplete marker quietly at the cut point', '잘린 지점에 미완성 표시를 조용히 덧붙임', '途切れた地点に未完成マーカーを静かに付ける')],
      reducedMotion: [t('Show the partial text and marker with no animation', '애니메이션 없이 부분 텍스트와 표시를 보여줌', 'アニメ無しで途中文とマーカーを表示')],
    },
  },
];
