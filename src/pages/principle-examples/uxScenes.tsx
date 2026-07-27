import {
  Badge, Button, Cluster, Field, Grid, Meter, Note, Panel, Row, Scene, Stack, Text,
  reader, t,
} from './sceneKit';
import type { SceneEntry } from './designScenes';

/* ------------------------------------------------------------------ *
 * aesthetic-usability-effect — order reads as competence.
 * ------------------------------------------------------------------ */
const aestheticUsability: SceneEntry = {
  note: t(
    'Nothing is added or removed. Edges line up, the two buttons stop using two different shapes for one role, and the spacing repeats — and the same form starts to look like it will work.',
    '더하거나 뺀 것은 없습니다. 모서리가 맞고, 같은 역할을 하던 두 버튼이 서로 다른 모양을 쓰지 않게 되고, 간격이 반복됩니다. 같은 폼인데 잘 작동할 것처럼 보입니다.',
    '足しも引きもしていません。端が揃い、同じ役割の二つのボタンが別々の形をやめ、間隔が反復します。同じフォームが、きちんと動きそうに見えます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const messy = variant === 'before';
    return (
      <Scene caption={messy
        ? L(t('Ragged edges, mixed shapes', '들쭉날쭉한 정렬, 뒤섞인 모양', '不揃いな端、混在した形'))
        : L(t('Aligned, one shape per role', '정렬 일치, 역할당 한 가지 모양', '揃った端、役割ごとに一つの形'))}
      >
        <div className="pex-align" data-messy={messy ? 'on' : undefined}>
          <Stack gap={messy ? 11 : 10}>
            <Field label={L(t('Full name', '이름', '氏名'))} value={L(t('Kim Seunghyun', '김승현', '金承賢'))} />
            <Field label={L(t('Mobile', '휴대폰', '携帯'))} value="010-2841-9930" />
            <Cluster gap={6} align="between">
              <Button label={L(t('Back', '이전', '戻る'))} size={messy ? 'sm' : 'md'} />
              <Button label={L(t('Continue', '다음', '次へ'))} tone="accent" size={messy ? 'lg' : 'md'} />
            </Cluster>
          </Stack>
        </div>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * choice-overload — fewer options, and a defensible default.
 * ------------------------------------------------------------------ */
const choiceOverload: SceneEntry = {
  note: t(
    'Nine plans shown side by side become three, with the one most people need marked and the rest one click away. The catalogue does not shrink; the decision does.',
    '나란히 놓인 요금제 아홉 개가 셋으로 줄고, 대부분에게 맞는 하나를 표시하며 나머지는 한 번 더 눌러 봅니다. 상품이 줄어드는 것이 아니라 결정이 줄어듭니다.',
    '横並びの九つの料金が三つになり、多くの人に合う一つを示し、残りはもう一度押せば見られます。商品ではなく、決定が減ります。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      const plans: [string, string][] = [
        ['Lite', '₩5,000'], ['Basic', '₩9,000'], ['Basic+', '₩13,000'],
        ['Plus', '₩19,000'], ['Pro', '₩25,000'], ['Pro+', '₩31,000'],
        ['Team', '₩39,000'], ['Team+', '₩49,000'], ['Max', '₩69,000'],
      ];
      return (
        <Scene caption={L(t('9 plans, all equal', '요금제 9개, 모두 동등', '9つの料金、すべて同格'))}>
          <Stack gap={8}>
            <Grid cols={3} gap={5}>
              {plans.map(([plan, price]) => (
                <Panel key={plan}>
                  <Text size={10} weight={600}>{plan}</Text>
                  <Text size={10} tone="muted">{price}</Text>
                </Panel>
              ))}
            </Grid>
            <Note tone="danger">{L(t('No default, no comparison order', '기본값 없음, 비교 기준 없음', '既定なし、比較の基準なし'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('3 plans, one recommended', '요금제 3개, 하나를 추천', '3つの料金、一つを推奨'))}>
        <Stack gap={8}>
          <Grid cols={3} gap={6}>
            <Panel><Text size={10} weight={600}>Basic</Text><Text size={10} tone="muted">₩9,000</Text></Panel>
            <Panel tone="accent">
              <Text size={10} weight={700}>Plus</Text>
              <Text size={10} tone="muted">₩19,000</Text>
            </Panel>
            <Panel><Text size={10} weight={600}>Team</Text><Text size={10} tone="muted">₩39,000</Text></Panel>
          </Grid>
          <Cluster gap={6} align="between">
            <Note tone="accent">{L(t('Recommended for 2–10 people', '2~10인에게 추천', '2〜10名におすすめ'))}</Note>
            <Note>{L(t('Compare all 9', '전체 9개 비교', '9件すべて比較'))}</Note>
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * chunking — the canonical grouped-digits demonstration.
 * ------------------------------------------------------------------ */
const chunking: SceneEntry = {
  note: t(
    'The same sixteen digits and the same five settings are regrouped, not reduced: four groups of four, and two named sections instead of one flat run.',
    '같은 숫자 열여섯 자리와 같은 설정 다섯 개를 줄이지 않고 다시 묶습니다. 네 자리씩 네 묶음, 그리고 하나로 이어진 목록 대신 이름 붙은 두 구획입니다.',
    '同じ十六桁と同じ五つの設定を、減らさずに組み直します。四桁ずつ四組、そして一続きの一覧ではなく名前の付いた二区画です。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const before = variant === 'before';
    return (
      <Scene caption={before
        ? L(t('One run', '한 덩어리', '一続き'))
        : L(t('Grouped', '묶어서', 'まとめて'))}
      >
        <Stack gap={10}>
          <Field
            label={L(t('Card number', '카드 번호', 'カード番号'))}
            value={before ? '5310084219930042' : '5310 0842 1993 0042'}
          />
          {before ? (
            <Stack gap={4}>
              <Row label={L(t('Email receipts', '영수증 메일', '領収書メール'))} />
              <Row label={L(t('Two-factor login', '2단계 인증', '二段階認証'))} />
              <Row label={L(t('Marketing email', '마케팅 메일', '販促メール'))} />
              <Row label={L(t('Backup codes', '백업 코드', 'バックアップコード'))} />
              <Row label={L(t('Weekly digest', '주간 요약', '週次サマリー'))} />
            </Stack>
          ) : (
            <Stack gap={8}>
              <Panel label={L(t('Security', '보안', 'セキュリティ'))}>
                <Row label={L(t('Two-factor login', '2단계 인증', '二段階認証'))} />
                <Row label={L(t('Backup codes', '백업 코드', 'バックアップコード'))} />
              </Panel>
              <Panel label={L(t('Email', '메일', 'メール'))}>
                <Row label={L(t('Email receipts', '영수증 메일', '領収書メール'))} />
                <Row label={L(t('Weekly digest', '주간 요약', '週次サマリー'))} />
                <Row label={L(t('Marketing email', '마케팅 메일', '販促メール'))} />
              </Panel>
            </Stack>
          )}
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * cognitive-load — remove what the task never needed.
 * ------------------------------------------------------------------ */
const cognitiveLoad: SceneEntry = {
  note: t(
    'The task is "reset my password". Everything that does not serve it — the promo strip, the org chart panel, the internal field names — is taken out, and the labels are said in ordinary words.',
    '과업은 "비밀번호 재설정"입니다. 여기에 쓰이지 않는 프로모션 띠, 조직도 패널, 내부 필드 이름을 걷어내고 라벨을 평범한 말로 바꿉니다.',
    'タスクは「パスワード再設定」です。役に立たない販促帯、組織図パネル、内部の項目名を取り除き、ラベルを普通の言葉にします。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Task plus everything else', '과업 + 나머지 전부', 'タスク＋その他すべて'))}>
          <Stack gap={7}>
            <div className="pex-promo">{L(t('New! Try our AI assistant →', '새 기능! AI 어시스턴트 →', '新機能！AIアシスタント →'))}</div>
            <Field label="auth_principal_id" placeholder="" />
            <Field label="cred_rotation_secret" placeholder="" />
            <Grid cols={2} gap={6}>
              <Panel label={L(t('Org chart', '조직도', '組織図'))}><Text size={10} tone="muted">3 {L(t('teams', '팀', 'チーム'))}</Text></Panel>
              <Panel label={L(t('Usage', '사용량', '使用量'))}><Text size={10} tone="muted">82%</Text></Panel>
            </Grid>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Only the task', '과업만', 'タスクだけ'))}>
        <Stack gap={10}>
          <Text size={13} weight={700}>{L(t('Reset your password', '비밀번호 재설정', 'パスワードの再設定'))}</Text>
          <Field
            label={L(t('New password', '새 비밀번호', '新しいパスワード'))}
            value="••••••••••"
            hint={L(t('At least 10 characters', '10자 이상', '10文字以上')) }
          />
          <Cluster gap={6} align="between">
            <Note>{L(t('1 field', '입력 1개', '入力1件'))}</Note>
            <Button label={L(t('Save password', '비밀번호 저장', 'パスワードを保存'))} tone="accent" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * doherty-threshold — answer inside 400ms, or show the work.
 * ------------------------------------------------------------------ */
const dohertyThreshold: SceneEntry = {
  note: t(
    'A 3.2-second silence becomes an immediate echo. The row appears at once with a pending mark, and the one genuinely slow step reports its own progress instead of showing a bare spinner.',
    '3.2초의 침묵이 즉각적인 반응으로 바뀝니다. 행이 곧바로 대기 표시와 함께 나타나고, 실제로 느린 단계만 빈 스피너 대신 진행 상황을 알립니다.',
    '3.2秒の沈黙が即座の反応に変わります。行はすぐに保留表示付きで現れ、本当に遅い段階だけが空のスピナーではなく進捗を伝えます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Nothing for 3.2s', '3.2초 동안 아무것도 없음', '3.2秒間なにもない'))}>
          <Stack gap={10}>
            <Cluster gap={6} align="between">
              <Text size={11}>{L(t('Add “Kim Seunghyun” to the team', '팀에 "김승현" 추가', 'チームに「金承賢」を追加'))}</Text>
              <span className="pex-spinner" />
            </Cluster>
            <div className="pex-blank">{L(t('Empty until the server replies', '서버 응답 전까지 비어 있음', 'サーバ応答まで空'))}</div>
            <Note tone="danger">3,200ms</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Answer at 40ms', '40ms에 반응', '40msで反応'))}>
        <Stack gap={10}>
          <Row label={L(t('Kim Seunghyun', '김승현', '金承賢'))} meta={L(t('Adding…', '추가 중…', '追加中…'))} state="quiet" />
          <Row label={L(t('Park Jimin', '박지민', '朴智旻'))} meta={L(t('Member', '멤버', 'メンバー'))} />
          <Meter value={3} total={5} label={L(t('Syncing 3 of 5 directories', '디렉터리 5개 중 3개 동기화', 'ディレクトリ5件中3件を同期'))} />
          <Note tone="accent">40ms → {L(t('visible', '반응 표시', '反応表示'))}</Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * fitts-law — size and distance, and what sits next door.
 * ------------------------------------------------------------------ */
const fittsLaw: SceneEntry = {
  note: t(
    'The primary target grows from 26×18 to 128×44 and moves to where the hand already is. Just as important, it stops sitting 4px from the destructive action.',
    '주요 대상이 26×18에서 128×44로 커지고, 손이 이미 있는 자리로 옮겨집니다. 그만큼 중요하게, 파괴적인 행동에서 4px 떨어져 있던 것을 떼어놓습니다.',
    '主要な対象が26×18から128×44に広がり、手が既にある位置へ移ります。同じくらい重要な点として、破壊的な操作から4pxの距離をやめます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption="26 × 18px">
          <Stack gap={10}>
            <Text size={11} tone="muted">{L(t('Cart · 3 items · ₩64,300', '장바구니 · 3개 · 64,300원', 'カート・3点・64,300円'))}</Text>
            <Cluster gap={4} align="between">
              <span />
              <Cluster gap={4}>
                <Button label={L(t('Empty', '비우기', '空にする'))} tone="danger" size="sm" />
                <Button label={L(t('Pay', '결제', '決済'))} size="sm" />
              </Cluster>
            </Cluster>
            <Note tone="danger">{L(t('4px from “Empty cart”', '"비우기"에서 4px', '「空にする」から4px'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption="128 × 44px">
        <Stack gap={10}>
          <Text size={11} tone="muted">{L(t('Cart · 3 items · ₩64,300', '장바구니 · 3개 · 64,300원', 'カート・3点・64,300円'))}</Text>
          <Button label={L(t('Pay ₩64,300', '64,300원 결제', '64,300円を決済'))} tone="accent" size="lg" />
          <Cluster gap={6} align="between">
            <Note>{L(t('“Empty cart” moved into the menu', '"비우기"는 메뉴 안으로', '「空にする」はメニュー内へ'))}</Note>
            <Note tone="accent">44px</Note>
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * goal-gradient-effect — effort feels smaller near the end.
 * ------------------------------------------------------------------ */
const goalGradient: SceneEntry = {
  note: t(
    'The same five steps are shown as already underway. Two are pre-completed from what the account already knows, so the reader starts at 2 of 5 rather than at zero, and each remaining step is named.',
    '같은 다섯 단계를 이미 시작된 상태로 보여줍니다. 계정에 있는 정보로 두 단계를 미리 채워 0이 아니라 5분의 2에서 시작하게 하고, 남은 단계마다 이름을 붙입니다.',
    '同じ五段階を、既に進行中として示します。アカウントにある情報で二つを先に埋め、0ではなく5分の2から始め、残る段階に名前を付けます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Starts at zero', '0에서 시작', 'ゼロから開始'))}>
          <Stack gap={10}>
            <Text size={13} weight={600}>{L(t('Set up your shop', '상점 설정', 'ショップ設定'))}</Text>
            <Meter value={0} total={5} label={L(t('0% complete', '0% 완료', '0% 完了'))} tone="muted" />
            <Note tone="danger">{L(t('Five unnamed steps ahead', '이름 없는 다섯 단계', '名前のない五段階'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Starts at 2 of 5', '5분의 2에서 시작', '5分の2から開始'))}>
        <Stack gap={8}>
          <Text size={13} weight={600}>{L(t('Set up your shop', '상점 설정', 'ショップ設定'))}</Text>
          <Meter value={2} total={5} label={L(t('2 of 5 done · 3 to go', '5개 중 2개 완료 · 3개 남음', '5件中2件完了・残り3件'))} />
          <Stack gap={4}>
            <Row label={L(t('Email verified', '이메일 확인됨', 'メール確認済み'))} meta="✓" state="quiet" />
            <Row label={L(t('Shop name added', '상점 이름 입력됨', '店名入力済み'))} meta="✓" state="quiet" />
            <Row label={L(t('Add your first product', '첫 상품 등록하기', '最初の商品を登録'))} state="primary" />
          </Stack>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * hicks-law — shape the decision, do not just shorten the list.
 * ------------------------------------------------------------------ */
const hicksLaw: SceneEntry = {
  note: t(
    'Twelve equally weighted destinations become four categories that are chosen first. Nothing is deleted — the same twelve live one level down, so each decision is between four things, not twelve.',
    '동등하게 놓인 열두 개 항목이 먼저 고르는 네 개 분류로 바뀝니다. 삭제한 것은 없습니다. 같은 열두 개가 한 단계 아래에 있어서, 한 번의 판단이 열둘이 아니라 넷 사이에서 이뤄집니다.',
    '同格の十二項目が、先に選ぶ四つの分類になります。削除はありません。同じ十二項目が一段下にあり、一度の判断が十二ではなく四つの間で行われます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      const items = [
        L(t('Orders', '주문', '注文')), L(t('Refunds', '환불', '返金')), L(t('Shipping', '배송', '配送')),
        L(t('Invoices', '청구서', '請求書')), L(t('Taxes', '세금', '税金')), L(t('Payouts', '정산', '精算')),
        L(t('Products', '상품', '商品')), L(t('Stock', '재고', '在庫')), L(t('Reviews', '리뷰', 'レビュー')),
        L(t('Staff', '직원', 'スタッフ')), L(t('Roles', '권한', '権限')), L(t('Logs', '로그', 'ログ')),
      ];
      return (
        <Scene caption={L(t('12 at one level', '한 단계에 12개', '一段に12件'))}>
          <Stack gap={8}>
            <Grid cols={3} gap={4}>
              {items.map((item) => <Row key={item} label={item} />)}
            </Grid>
            <Note tone="danger">{L(t('One choice among 12', '12개 중 하나를 선택', '12件から一つを選択'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('4, then 3', '4개, 그다음 3개', '4件、次に3件'))}>
        <Stack gap={8}>
          <Grid cols={2} gap={6}>
            <Panel tone="accent"><Text size={11} weight={600}>{L(t('Sales', '판매', '販売'))}</Text></Panel>
            <Panel><Text size={11}>{L(t('Money', '정산·세금', '精算・税'))}</Text></Panel>
            <Panel><Text size={11}>{L(t('Catalogue', '상품', '商品'))}</Text></Panel>
            <Panel><Text size={11}>{L(t('People', '사람', '人'))}</Text></Panel>
          </Grid>
          <Cluster gap={5} wrap>
            <Note tone="accent">{L(t('Sales', '판매', '販売'))} →</Note>
            <Note>{L(t('Orders', '주문', '注文'))}</Note>
            <Note>{L(t('Refunds', '환불', '返金'))}</Note>
            <Note>{L(t('Shipping', '배송', '配送'))}</Note>
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * jakobs-law — sit where other sites have taught people to look.
 * ------------------------------------------------------------------ */
const jakobsLaw: SceneEntry = {
  note: t(
    'Conventional positions are restored: the logo goes home, the cart sits top-right, search is a field rather than a hamburger, and the primary action is at the end of the form instead of above it.',
    '익숙한 자리를 되돌립니다. 로고는 홈으로, 장바구니는 오른쪽 위로, 검색은 햄버거 아이콘이 아니라 입력창으로, 주요 버튼은 폼 위가 아니라 아래로 갑니다.',
    '慣れた位置に戻します。ロゴはホームへ、カートは右上へ、検索はハンバーガーではなく入力欄へ、主要ボタンはフォームの上ではなく下へ。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Invented placement', '임의로 정한 배치', '独自の配置'))}>
          <Stack gap={9}>
            <Cluster gap={6} align="between">
              <Button label={L(t('Buy now', '지금 구매', '今すぐ購入'))} tone="accent" size="sm" />
              <Cluster gap={5}>
                <Badge>☰</Badge>
                <Text size={11} weight={700}>SHOP</Text>
              </Cluster>
            </Cluster>
            <Field label={L(t('Quantity', '수량', '数量'))} value="1" />
            <Note tone="danger">
              {L(t('“☰” opens search · logo centre-right · buy above the form', '"☰"가 검색 · 로고는 오른쪽 · 구매 버튼이 폼 위', '「☰」が検索・ロゴは右・購入がフォーム上'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Where people look first', '사람들이 먼저 보는 자리', '人が最初に見る位置'))}>
        <Stack gap={9}>
          <Cluster gap={6} align="between">
            <Text size={11} weight={700}>SHOP</Text>
            <Cluster gap={5}>
              <Field placeholder={L(t('Search', '검색', '検索'))} height={20} />
              <Badge>{L(t('Cart 3', '장바구니 3', 'カート 3'))}</Badge>
            </Cluster>
          </Cluster>
          <Field label={L(t('Quantity', '수량', '数量'))} value="1" />
          <Cluster gap={6} align="between">
            <span />
            <Button label={L(t('Buy now', '지금 구매', '今すぐ購入'))} tone="accent" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * law-of-common-region — a border decides what belongs together.
 * ------------------------------------------------------------------ */
const commonRegion: SceneEntry = {
  note: t(
    'Two addresses printed as one stream become two enclosed regions. The border does the work no amount of wording could: it says where the sender ends and the recipient begins.',
    '하나로 이어져 있던 두 주소가 각각 테두리 안으로 들어갑니다. 문구로는 하기 어려운 일을 테두리가 합니다. 보내는 사람이 어디서 끝나고 받는 사람이 어디서 시작하는지 보여줍니다.',
    '一続きだった二つの住所が、それぞれ枠の中に入ります。文言では難しいことを枠が行います。差出人がどこで終わり、宛先がどこから始まるかを示します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const sender = L(t('Sender', '보내는 사람', '差出人'));
    const recipient = L(t('Recipient', '받는 사람', '宛先'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('One stream', '이어진 한 덩어리', '一続き'))}>
          <Stack gap={6}>
            <Text size={10} tone="muted">{sender}</Text>
            <Row label={L(t('Kim Seunghyun', '김승현', '金承賢'))} />
            <Row label={L(t('Seoul, Mapo-gu', '서울 마포구', '東京都港区'))} />
            <Text size={10} tone="muted">{recipient}</Text>
            <Row label={L(t('Park Jimin', '박지민', '朴智旻'))} />
            <Row label={L(t('Busan, Haeundae-gu', '부산 해운대구', '大阪市北区'))} />
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Two regions', '두 영역', '二つの領域'))}>
        <Stack gap={9}>
          <Panel label={sender}>
            <Row label={L(t('Kim Seunghyun', '김승현', '金承賢'))} />
            <Row label={L(t('Seoul, Mapo-gu', '서울 마포구', '東京都港区'))} />
          </Panel>
          <Panel label={recipient} tone="accent">
            <Row label={L(t('Park Jimin', '박지민', '朴智旻'))} />
            <Row label={L(t('Busan, Haeundae-gu', '부산 해운대구', '大阪市北区'))} />
          </Panel>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * law-of-proximity — the classic ambiguous-label demonstration.
 * ------------------------------------------------------------------ */
const proximity: SceneEntry = {
  note: t(
    'The label sits exactly halfway between two fields, so it could belong to either. Moving it 4px from its own field and 20px from the next one settles the question without a word of explanation.',
    '라벨이 두 필드 정확히 가운데 있어서 어느 쪽 것인지 알 수 없습니다. 자기 필드에서 4px, 다음 필드에서 20px로 옮기면 설명 한 줄 없이 문제가 해결됩니다.',
    'ラベルが二つの項目のちょうど中間にあり、どちらのものか分かりません。自分の項目から4px、次の項目から20pxにすれば、説明なしで解決します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const before = variant === 'before';
    return (
      <Scene caption={before
        ? L(t('12px above and below', '위아래 모두 12px', '上下とも12px'))
        : L(t('4px above, 20px below', '위 4px, 아래 20px', '上4px、下20px'))}
      >
        <div className="pex-proximity" data-tight={before ? undefined : 'on'}>
          <span className="pex-field__input" data-filled="on">2026-08-14</span>
          <span className="pex-proximity__label">{L(t('Departure date', '출발일', '出発日'))}</span>
          <span className="pex-field__input" data-filled="on">2026-08-21</span>
          <span className="pex-proximity__label">{L(t('Return date', '도착일', '帰着日'))}</span>
          <span className="pex-field__input" data-filled="on">2</span>
        </div>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * law-of-similarity — one role, one look.
 * ------------------------------------------------------------------ */
const similarity: SceneEntry = {
  note: t(
    'Four controls that all do the same thing — remove a row — are drawn four different ways. Giving the role one appearance means the reader learns it once.',
    '모두 같은 일(행 삭제)을 하는 컨트롤 네 개가 서로 다른 모양으로 그려져 있습니다. 역할에 하나의 모양을 주면 한 번만 익히면 됩니다.',
    '同じこと（行の削除）をする四つの操作が、別々の形で描かれています。役割に一つの見た目を与えれば、覚えるのは一度で済みます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const rows = [
      L(t('Wool coat', '울 코트', 'ウールコート')),
      L(t('Linen shirt', '린넨 셔츠', 'リネンシャツ')),
      L(t('Leather belt', '가죽 벨트', 'レザーベルト')),
      L(t('Cotton socks', '면 양말', 'コットン靴下')),
    ];
    const beforeLabels = ['✕', L(t('Delete', '삭제', '削除')), '🗑', L(t('Remove', '빼기', '外す'))];
    return (
      <Scene caption={variant === 'before'
        ? L(t('One role, four looks', '한 역할, 네 가지 모양', '一つの役割、四つの形'))
        : L(t('One role, one look', '한 역할, 한 가지 모양', '一つの役割、一つの形'))}
      >
        <Stack gap={7}>
          {rows.map((row, index) => (
            <Cluster key={row} gap={6} align="between">
              <Text size={11}>{row}</Text>
              {variant === 'before'
                ? <Button label={beforeLabels[index]} size={index === 1 ? 'md' : 'sm'} tone={index === 3 ? 'danger' : 'ghost'} />
                : <Button label={L(t('Remove', '삭제', '削除'))} size="sm" />}
            </Cluster>
          ))}
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * law-of-uniform-connectedness — a shared line beats mere nearness.
 * ------------------------------------------------------------------ */
const uniformConnectedness: SceneEntry = {
  note: t(
    'Three steps that are merely near each other get an explicit connector, so the order and the dependency are visible rather than inferred from position.',
    '가까이 놓여 있을 뿐이던 세 단계를 실제로 이어 그립니다. 순서와 의존 관계를 위치로 짐작하지 않고 눈으로 보게 됩니다.',
    '近くにあるだけだった三段階を、実際に線でつなぎます。順序と依存関係を位置から推測せず、目で見て分かります。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const steps = [
      L(t('Upload file', '파일 올리기', 'ファイル送信')),
      L(t('Map columns', '열 연결하기', '列の対応付け')),
      L(t('Import', '가져오기', '取り込み')),
    ];
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Near, but unconnected', '가깝지만 이어지지 않음', '近いが、つながらない'))}>
          <Grid cols={3} gap={8}>
            {steps.map((step) => (
              <Panel key={step}><Text size={10}>{step}</Text></Panel>
            ))}
          </Grid>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Connected', '이어짐', 'つながる'))}>
        <div className="pex-connected">
          {steps.map((step, index) => (
            <span key={step} data-current={index === 1 ? 'on' : undefined}>
              <b>{index + 1}</b>
              <em>{step}</em>
            </span>
          ))}
        </div>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * mental-model — say it in the reader's words, not the schema's.
 * ------------------------------------------------------------------ */
const mentalModel: SceneEntry = {
  note: t(
    'The screen stops exposing the data model. "Entity", "record" and "commit" are replaced by the words a clinic receptionist already uses, and the object the reader has in mind — an appointment — becomes the thing on screen.',
    '화면이 데이터 모델을 그대로 드러내지 않게 합니다. "엔티티", "레코드", "커밋"을 병원 접수 담당자가 이미 쓰는 말로 바꾸고, 사용자가 떠올리는 대상인 예약을 화면의 주인공으로 둡니다.',
    '画面がデータモデルをそのまま見せるのをやめます。「エンティティ」「レコード」「コミット」を受付担当が既に使う言葉に替え、利用者が思い浮かべる対象である予約を画面の主役にします。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('The schema, on screen', '스키마가 그대로 화면에', 'スキーマがそのまま画面に'))}>
          <Stack gap={8}>
            <Text size={12} weight={600}>{L(t('Create entity', '엔티티 생성', 'エンティティ生成'))}</Text>
            <Field label="entity_type" value="APPT" />
            <Field label="resource_ref" value="usr_9f2a1" />
            <Cluster gap={6} align="between">
              <Note tone="danger">{L(t('Nothing here names a patient or a time', '환자도 시간도 이름으로 나오지 않음', '患者も時間も名で出てこない'))}</Note>
              <Button label={L(t('Commit', '커밋', 'コミット'))} size="sm" />
            </Cluster>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('The clinic’s words', '접수대의 말', '受付の言葉'))}>
        <Stack gap={8}>
          <Text size={12} weight={600}>{L(t('New appointment', '진료 예약 만들기', '診察予約の作成'))}</Text>
          <Field label={L(t('Patient', '환자', '患者'))} value={L(t('Park Jimin', '박지민', '朴智旻'))} />
          <Field label={L(t('Date and time', '날짜와 시간', '日時'))} value={L(t('Fri 14 Aug, 10:30', '8월 14일(금) 10:30', '8月14日(金) 10:30'))} />
          <Cluster gap={6} align="between">
            <span />
            <Button label={L(t('Book appointment', '예약하기', '予約する'))} tone="accent" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * paradox-of-the-active-user — nobody reads the manual first.
 * ------------------------------------------------------------------ */
const activeUser: SceneEntry = {
  note: t(
    'The tour that has to be finished before anything works is replaced by a screen that is usable on arrival, with the one piece of guidance attached to the control it explains.',
    '무언가를 하기 전에 끝내야 하던 안내 투어를 없애고, 도착하자마자 쓸 수 있는 화면으로 바꿉니다. 안내는 설명 대상인 컨트롤 옆에 하나만 둡니다.',
    '何かをする前に終える必要のあるツアーをやめ、着いてすぐ使える画面にします。案内は説明対象の操作の横に一つだけ置きます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Read this first', '먼저 읽으세요', 'まずお読みください'))}>
          <Stack gap={9}>
            <Text size={12} weight={600}>{L(t('Welcome — 6 steps', '환영합니다 — 6단계', 'ようこそ — 6ステップ'))}</Text>
            <Text size={10} tone="muted" leading={1.6}>
              {L(t(
                'Before you begin, review how projects, boards, labels, filters and permissions relate to one another. You can revisit this tour from the help menu at any time.',
                '시작하기 전에 프로젝트, 보드, 라벨, 필터, 권한이 서로 어떻게 연결되는지 확인하세요. 이 안내는 도움말 메뉴에서 다시 볼 수 있습니다.',
                '始める前に、プロジェクト、ボード、ラベル、フィルタ、権限の関係をご確認ください。この案内はヘルプメニューからいつでも見られます。',
              ))}
            </Text>
            <Cluster gap={6} align="between">
              <Note tone="danger">{L(t('The board is behind this', '보드는 이 뒤에 있음', 'ボードはこの後ろ'))}</Note>
              <Button label={L(t('Next (1/6)', '다음 (1/6)', '次へ (1/6)'))} size="sm" />
            </Cluster>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Usable on arrival', '들어오자마자 사용', '入ってすぐ使える'))}>
        <Stack gap={8}>
          <Text size={12} weight={600}>{L(t('Today', '오늘', '今日'))}</Text>
          <Row label={L(t('Draft the launch note', '출시 안내 초안 쓰기', 'リリース案内の下書き'))} control="check" />
          <Row label={L(t('Review pricing page', '가격 페이지 검토', '価格ページの確認'))} control="check" />
          <Field
            placeholder={L(t('Add a task', '할 일 추가', 'タスクを追加'))}
            hint={L(t('Tip: type a date like “Friday” to schedule it', '"금요일"처럼 날짜를 적으면 일정이 잡힙니다', '「金曜」のように書くと日程が入ります'))}
          />
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * peak-end-rule — the last screen is remembered as the whole.
 * ------------------------------------------------------------------ */
const peakEnd: SceneEntry = {
  note: t(
    'The ending stops being a bare acknowledgement. The same completion states what was actually agreed, what happens next and when — and offers the one action most people want at that moment.',
    '마지막 화면이 통보에 그치지 않게 합니다. 같은 완료 화면이 무엇이 정해졌고 다음에 무엇이 언제 일어나는지 밝히고, 그 순간 대부분이 원하는 행동 하나를 함께 둡니다.',
    '最後の画面を通知だけで終わらせません。同じ完了画面が、何が決まり次に何がいつ起きるかを示し、その時点で多くの人が求める行動を一つ添えます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Bare acknowledgement', '통보로 끝남', '通知で終わり'))}>
          <Stack gap={10}>
            <Text size={13} weight={600}>{L(t('Done', '완료', '完了'))}</Text>
            <Text size={11} tone="muted">{L(t('Your request has been submitted.', '요청이 접수되었습니다.', 'リクエストを受け付けました。'))}</Text>
            <Note tone="danger">{L(t('What was booked? What happens now?', '무엇이 예약됐고, 이제 무슨 일이 생기나요?', '何が予約され、次に何が起きますか。'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('A considered ending', '마무리를 설계함', '締めくくりを設計'))}>
        <Stack gap={8}>
          <Text size={13} weight={600}>{L(t('Booked — Fri 14 Aug, 10:30', '예약 완료 — 8월 14일(금) 10:30', '予約完了 — 8月14日(金) 10:30'))}</Text>
          <Row label={L(t('Dr Han · Internal medicine', '한 원장 · 내과', '韓医師・内科'))} meta={L(t('2nd floor', '2층', '2階'))} />
          <Row label={L(t('Reminder', '알림', 'リマインド'))} meta={L(t('Text, 1 day before', '하루 전 문자', '前日にSMS'))} state="quiet" />
          <Cluster gap={6} align="between">
            <Note tone="accent">{L(t('Free to change until Thursday', '목요일까지 무료 변경', '木曜まで無料で変更'))}</Note>
            <Button label={L(t('Add to calendar', '캘린더에 추가', 'カレンダーに追加'))} tone="accent" size="sm" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * postels-law — accept what people actually type.
 * ------------------------------------------------------------------ */
const postelsLaw: SceneEntry = {
  note: t(
    'The field stops rejecting the formats people actually paste. Spaces, hyphens and a leading country code are accepted and normalised on the way in, and the stored value is shown so nothing is silently changed.',
    '사람들이 실제로 붙여넣는 형식을 거부하지 않게 합니다. 공백·하이픈·국가 번호를 받아들여 저장할 때 정리하고, 무엇으로 저장되는지 보여줘서 몰래 바뀌는 일이 없게 합니다.',
    '実際に貼り付けられる形式を拒否しないようにします。空白・ハイフン・国番号を受け入れて保存時に整え、何として保存されるかを示し、黙って変わらないようにします。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Rejects everything but one shape', '한 가지 형식만 허용', '一つの形式のみ許可'))}>
          <Stack gap={9}>
            <Field
              label={L(t('Mobile', '휴대폰', '携帯'))}
              value="010-2841-9930"
              tone="danger"
              error={L(t('Digits only, no hyphens', '하이픈 없이 숫자만 입력하세요', 'ハイフンなしの数字のみ'))}
            />
            <Note tone="danger">
              {L(t('“010 2841 9930” and “+82 10…” are rejected too', '"010 2841 9930", "+82 10…"도 거부됩니다', '「010 2841 9930」「+82 10…」も拒否'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Accepts, then normalises', '받아들이고 정리함', '受け入れて整える'))}>
        <Stack gap={9}>
          <Field
            label={L(t('Mobile', '휴대폰', '携帯'))}
            value="010-2841-9930"
            hint={L(t('Saved as +82 10 2841 9930', '+82 10 2841 9930으로 저장됩니다', '+82 10 2841 9930として保存されます'))}
          />
          <Cluster gap={5} wrap>
            <Badge tone="accent">010 2841 9930</Badge>
            <Badge tone="accent">01028419930</Badge>
            <Badge tone="accent">+82 10-2841-9930</Badge>
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * selective-attention — banner blindness.
 * ------------------------------------------------------------------ */
const selectiveAttention: SceneEntry = {
  note: t(
    'The warning is not made louder — it is moved. Sitting in the banner slot at the top of the page it is skipped as advertising; placed in the payment step it is read, because that is where the eye already is.',
    '경고를 더 크게 만들지 않고 자리를 옮깁니다. 페이지 맨 위 배너 자리에 있으면 광고로 여겨 건너뛰고, 결제 단계 안에 두면 읽힙니다. 시선이 이미 그곳에 있기 때문입니다.',
    '警告を大きくせず、位置を変えます。ページ上部のバナー枠にあると広告として飛ばされ、決済の段階に置けば読まれます。視線が既にそこにあるからです。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const warning = L(t('This card expires before the delivery date', '이 카드는 배송일 전에 만료됩니다', 'このカードは配送日前に期限切れです'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('In the banner slot', '배너 자리에', 'バナー枠に'))}>
          <Stack gap={9}>
            <div className="pex-promo" data-warning="on">{warning}</div>
            <Text size={11} weight={600}>{L(t('Payment', '결제', 'お支払い'))}</Text>
            <Row label={L(t('Shinhan ···· 0042', '신한 ···· 0042', 'みずほ ···· 0042'))} meta="12/26" />
            <Button label={L(t('Pay ₩64,300', '64,300원 결제', '64,300円を決済'))} tone="accent" size="sm" />
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('In the payment step', '결제 단계 안에', '決済の段階に'))}>
        <Stack gap={9}>
          <Text size={11} weight={600}>{L(t('Payment', '결제', 'お支払い'))}</Text>
          <div className="pex-inline-warning">
            <Row label={L(t('Shinhan ···· 0042', '신한 ···· 0042', 'みずほ ···· 0042'))} meta="12/26" state="danger" />
            <span>{warning}</span>
          </div>
          <Button label={L(t('Pay ₩64,300', '64,300원 결제', '64,300円を決済'))} tone="accent" size="sm" />
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * serial-position-effect — first and last are remembered.
 * ------------------------------------------------------------------ */
const serialPosition: SceneEntry = {
  note: t(
    'The list is reordered, not restyled. The two items that matter — the one people came for and the one they must not miss — move to the first and last positions, where recall is strongest.',
    '목록의 모양이 아니라 순서를 바꿉니다. 중요한 두 항목, 즉 사람들이 찾아온 항목과 놓치면 안 되는 항목을 기억에 가장 잘 남는 처음과 마지막 자리로 옮깁니다.',
    '見た目ではなく順序を変えます。重要な二つ、つまり目的の項目と見落とせない項目を、記憶に残りやすい最初と最後に移します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const key1 = L(t('Track my order', '주문 조회', '注文の確認'));
    const key2 = L(t('Cancel a subscription', '구독 해지', '定期購入の解約'));
    const filler = [
      L(t('Gift cards', '기프트 카드', 'ギフトカード')),
      L(t('Store locations', '매장 안내', '店舗案内')),
      L(t('Press enquiries', '언론 문의', '報道関係')),
      L(t('Careers', '채용', '採用')),
    ];
    const items = variant === 'before'
      ? [filler[0], filler[1], key1, key2, filler[2], filler[3]]
      : [key1, filler[0], filler[1], filler[2], filler[3], key2];
    return (
      <Scene caption={variant === 'before'
        ? L(t('Buried at positions 3 and 4', '3·4번째에 묻힘', '3・4番目に埋もれる'))
        : L(t('First and last', '처음과 마지막', '最初と最後'))}
      >
        <Stack gap={5}>
          {items.map((item, index) => (
            <Row
              key={item}
              label={item}
              meta={`${index + 1}`}
              state={item === key1 || item === key2 ? (variant === 'before' ? 'default' : 'primary') : 'quiet'}
            />
          ))}
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * teslers-law — the system absorbs the complexity it can.
 * ------------------------------------------------------------------ */
const teslersLaw: SceneEntry = {
  note: t(
    'The complexity does not vanish — it moves. Four values the system can already derive are filled in and shown for checking, leaving the reader the one decision only they can make.',
    '복잡함이 사라지는 것이 아니라 옮겨 갑니다. 시스템이 이미 알아낼 수 있는 값 네 개를 채워서 확인할 수 있게 보여주고, 사용자에게는 본인만 내릴 수 있는 판단 하나를 남깁니다.',
    '複雑さは消えず、移ります。システムが導ける四つの値を埋めて確認できるようにし、利用者には本人にしかできない判断を一つ残します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Five fields, all yours', '입력 5개, 모두 사용자 몫', '入力5件、すべて利用者が'))}>
          <Stack gap={7}>
            <Field label={L(t('Country', '국가', '国'))} placeholder="" />
            <Field label={L(t('Currency', '통화', '通貨'))} placeholder="" />
            <Field label={L(t('Tax rate', '세율', '税率'))} placeholder="" />
            <Field label={L(t('Invoice prefix', '청구서 접두어', '請求書接頭辞'))} placeholder="" />
            <Field label={L(t('Payout account', '정산 계좌', '精算口座'))} placeholder="" />
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Four derived, one decided', '4개는 자동, 1개만 판단', '4件は自動、1件だけ判断'))}>
        <Stack gap={7}>
          <Row label={L(t('Country', '국가', '国'))} meta={L(t('Korea · from your address', '대한민국 · 주소에서', '韓国・住所から'))} state="quiet" />
          <Row label={L(t('Currency', '통화', '通貨'))} meta={L(t('KRW · from country', 'KRW · 국가에서', 'KRW・国から'))} state="quiet" />
          <Row label={L(t('Tax rate', '세율', '税率'))} meta={L(t('10% · standard VAT', '10% · 표준 부가세', '10%・標準税率'))} state="quiet" />
          <Row label={L(t('Invoice prefix', '청구서 접두어', '請求書接頭辞'))} meta="LAFI-2026-" state="quiet" />
          <Field label={L(t('Payout account', '정산 계좌', '精算口座'))} placeholder={L(t('Only you can choose this', '이것만 직접 선택하세요', 'ここだけご自身で選択'))} tone="accent" />
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * von-restorff-effect — one exception, or none.
 * ------------------------------------------------------------------ */
const vonRestorff: SceneEntry = {
  note: t(
    'Three competing highlights cancel each other out. Keeping exactly one — and letting the rest be plain — is what makes the difference visible at all.',
    '강조 세 개가 서로를 지웁니다. 정확히 하나만 남기고 나머지를 평범하게 두어야 차이가 비로소 보입니다.',
    '三つの強調が互いを打ち消します。ちょうど一つだけ残し、他を平らにして初めて差が見えます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const rows = [
      L(t('Standard · 3–5 days · ₩0', '일반 · 3~5일 · 0원', '通常・3〜5日・0円')),
      L(t('Express · next day · ₩3,000', '빠른 배송 · 익일 · 3,000원', '速達・翌日・3,000円')),
      L(t('Pick-up · today · ₩0', '매장 수령 · 당일 · 0원', '店舗受取・当日・0円')),
      L(t('Locker · 2 days · ₩1,000', '무인함 · 2일 · 1,000원', 'ロッカー・2日・1,000円')),
    ];
    return (
      <Scene caption={variant === 'before'
        ? L(t('Three things shouting', '세 곳이 동시에 강조', '三か所が同時に強調'))
        : L(t('One thing marked', '한 곳만 표시', '一か所だけ表示'))}
      >
        <Stack gap={7}>
          {rows.map((row, index) => (
            <Row
              key={row}
              label={row}
              state={variant === 'before'
                ? (index === 3 ? 'quiet' : 'primary')
                : (index === 2 ? 'primary' : 'default')}
              meta={variant === 'after' && index === 2 ? L(t('Fastest and free', '가장 빠르고 무료', '最速かつ無料')) : undefined}
            />
          ))}
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * working-memory — do not ask people to hold the earlier steps.
 * ------------------------------------------------------------------ */
const workingMemory: SceneEntry = {
  note: t(
    'On step three, the choices made in steps one and two are no longer hidden behind a Back button. They stay on screen, so the comparison the reader is making does not have to be held in their head.',
    '3단계에서 1·2단계의 선택이 이전 버튼 뒤로 사라지지 않습니다. 화면에 남아 있어서, 비교하고 있는 내용을 머릿속에 담고 있지 않아도 됩니다.',
    '3段階目で、1・2段階目の選択が戻るボタンの裏に消えません。画面に残るため、比較している内容を頭の中に保つ必要がありません。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Step 3 of 3', '3단계 중 3단계', '3段階中3段階目'))}>
          <Stack gap={10}>
            <Text size={12} weight={600}>{L(t('Choose a delivery date', '배송일 선택', '配送日の選択'))}</Text>
            <Field label={L(t('Date', '날짜', '日付'))} placeholder={L(t('Select', '선택', '選択'))} />
            <Note tone="danger">
              {L(t('Which address did I pick? Go back to check.', '주소를 무엇으로 골랐더라? 이전으로 가서 확인해야 합니다.', 'どの住所を選んだか。戻って確認が必要です。'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Step 3 of 3, with steps 1–2 in view', '3단계 중 3단계, 1~2단계도 보임', '3段階目、1〜2段階も表示'))}>
        <Stack gap={9}>
          <Panel label={L(t('Chosen so far', '지금까지 선택', 'ここまでの選択'))}>
            <Row label={L(t('Address', '주소', '住所'))} meta={L(t('Home · Mapo-gu', '집 · 마포구', '自宅・港区'))} state="quiet" />
            <Row label={L(t('Payment', '결제', '決済'))} meta={L(t('Shinhan ···· 0042', '신한 ···· 0042', 'みずほ ···· 0042'))} state="quiet" />
          </Panel>
          <Field label={L(t('Delivery date', '배송일', '配送日'))} value={L(t('Fri 14 Aug', '8월 14일(금)', '8月14日(金)'))} />
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * zeigarnik-effect — an interruption should leave a way back in.
 * ------------------------------------------------------------------ */
const zeigarnik: SceneEntry = {
  note: t(
    'An abandoned draft stops being a vague "incomplete" badge. It is saved with a timestamp and names the exact place to resume, so returning costs one click instead of a fresh start.',
    '중단한 초안이 막연한 "미완료" 표시로 남지 않습니다. 저장 시각과 함께 어디서 이어서 쓸지 정확히 알려주어, 다시 시작하지 않고 한 번의 클릭으로 돌아갑니다.',
    '中断した下書きが曖昧な「未完了」表示で終わりません。保存時刻と再開位置を明示し、やり直しではなく一度のクリックで戻れます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Vaguely unfinished', '막연한 미완료', '漠然と未完了'))}>
          <Stack gap={9}>
            <Row label={L(t('Listing: Wool coat', '상품 등록: 울 코트', '出品：ウールコート'))} meta={L(t('Incomplete', '미완료', '未完了'))} state="quiet" />
            <Note tone="danger">
              {L(t('Nothing says what is missing, or whether the text survived', '무엇이 빠졌는지, 쓴 글이 남아 있는지 알 수 없습니다', '何が足りないか、書いた内容が残るか分かりません'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('A named place to resume', '이어서 쓸 자리를 알려줌', '再開位置を明示'))}>
        <Stack gap={9}>
          <Row label={L(t('Listing: Wool coat', '상품 등록: 울 코트', '出品：ウールコート'))} meta={L(t('Draft saved 14:02', '초안 저장 14:02', '下書き保存 14:02'))} state="quiet" />
          <Meter value={3} total={4} label={L(t('3 of 4 sections done', '4개 구획 중 3개 완료', '4区画中3区画完了'))} />
          <Cluster gap={6} align="between">
            <Note tone="accent">{L(t('Left to do: shipping price', '남은 항목: 배송비', '残り：送料'))}</Note>
            <Button label={L(t('Resume', '이어서 쓰기', '続きから'))} tone="accent" size="sm" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

export const uxScenes: Record<string, SceneEntry> = {
  'aesthetic-usability-effect': aestheticUsability,
  'choice-overload': choiceOverload,
  chunking,
  'cognitive-load': cognitiveLoad,
  'doherty-threshold': dohertyThreshold,
  'fitts-law': fittsLaw,
  'goal-gradient-effect': goalGradient,
  'hicks-law': hicksLaw,
  'jakobs-law': jakobsLaw,
  'law-of-common-region': commonRegion,
  'law-of-proximity': proximity,
  'law-of-similarity': similarity,
  'law-of-uniform-connectedness': uniformConnectedness,
  'mental-model': mentalModel,
  'paradox-of-the-active-user': activeUser,
  'peak-end-rule': peakEnd,
  'postels-law': postelsLaw,
  'selective-attention': selectiveAttention,
  'serial-position-effect': serialPosition,
  'teslers-law': teslersLaw,
  'von-restorff-effect': vonRestorff,
  'working-memory': workingMemory,
  'zeigarnik-effect': zeigarnik,
};
