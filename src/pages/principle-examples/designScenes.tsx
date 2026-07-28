import type { ReactElement } from 'react';
import type { LocalizedText } from '../../data/styles';
import {
  Badge, Button, Cluster, Field, Grid, Media, Note, Panel, Row, Scene, Stack, Swatch, Text,
  reader, t,
  type SceneProps,
} from './sceneKit';

export type SceneEntry = {
  /** What the picture changes — shown under the comparison, in place of
   *  repeating the principle's own "apply" line. */
  note: LocalizedText;
  render: (props: SceneProps) => ReactElement;
};

/* ------------------------------------------------------------------ *
 * 01 core-task-first — the task path, not the shell, gets the room.
 * ------------------------------------------------------------------ */
const coreTaskFirst: SceneEntry = {
  note: t(
    'The task path (amount → account → send) moves from a corner into the full frame; the shell keeps only the navigation needed to enter and leave.',
    '과업 경로(금액 → 계좌 → 보내기)가 구석에서 화면 전체로 나오고, 껍데기에는 진입과 이탈에 필요한 내비게이션만 남습니다.',
    'タスク経路（金額→口座→送信）が隅から画面全体へ移り、外枠には出入りに必要なナビゲーションだけが残ります。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const amount = L(t('Amount', '보낼 금액', '送金額'));
    const account = L(t('To account', '받는 계좌', '受取口座'));
    const send = L(t('Send', '보내기', '送信'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Shell first', '껍데기부터', '外枠から'))}>
          <Stack gap={6}>
            <Cluster gap={4} wrap>
              <Badge>{L(t('Promo', '프로모션', 'プロモ'))}</Badge>
              <Badge>{L(t('Notice', '공지', 'お知らせ'))}</Badge>
              <Badge>{L(t('Survey', '설문', 'アンケート'))}</Badge>
            </Cluster>
            <Grid cols={3} gap={6}>
              <Panel label={L(t('Menu', '메뉴', 'メニュー'))}>
                <Stack gap={3}>
                  <Row label={L(t('Home', '홈', 'ホーム'))} state="quiet" />
                  <Row label={L(t('Cards', '카드', 'カード'))} state="quiet" />
                  <Row label={L(t('Points', '포인트', 'ポイント'))} state="quiet" />
                </Stack>
              </Panel>
              <Panel label={L(t('Transfer', '이체', '振込'))}>
                <Stack gap={3}>
                  <Field label={amount} placeholder="0" />
                  <Button label={send} size="sm" />
                </Stack>
              </Panel>
              <Panel label={L(t('Ads', '광고', '広告'))}>
                <Media ratio="4 / 3" busy />
              </Panel>
            </Grid>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Task first', '과업부터', 'タスクから'))}>
        <Stack gap={9}>
          <Cluster gap={6} align="between">
            <Note>{L(t('Transfer', '이체', '振込'))}</Note>
            <Note>{L(t('Close', '닫기', '閉じる'))}</Note>
          </Cluster>
          <Field label={amount} value="₩ 240,000" />
          <Field label={account} value={L(t('Shinhan 110-***-4471', '신한 110-***-4471', 'みずほ 110-***-4471'))} />
          <Cluster gap={6} align="between">
            <Note>{L(t('Fee ₩0 · arrives instantly', '수수료 0원 · 즉시 도착', '手数料0円・即時着金'))}</Note>
            <Button label={send} tone="accent" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 01b opening-earns-its-frame — the paste test.
 * ------------------------------------------------------------------ */
const openingEarnsItsFrame: SceneEntry = {
  note: t(
    'The template opening — a headline with one italicised word, a column of copy, an abstract shape and three identical feature cards — is replaced by the product’s actual output: a real route search with real results owning most of the frame.',
    '헤드라인 한 줄에 이탤릭 한 단어, 카피 컬럼, 추상적인 도형, 똑같이 생긴 기능 카드 세 개로 이루어진 템플릿 오프닝을 걷어내고, 제품이 실제로 내놓는 것을 화면에 둡니다. 실제 노선 검색과 그 결과가 화면 대부분을 차지합니다.',
    '見出しに斜体一語、コピーの列、抽象的な図形、同じ形の機能カード三つという定型のオープニングをやめ、製品が実際に出すものを画面に置きます。実際の経路検索とその結果が画面の大半を占めます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Could be any product', '어느 제품에나 붙는 오프닝', 'どの製品にも貼れる'))}>
          <Stack gap={8}>
            <div className="pex-hero">
              <Text size={15} weight={700}>
                {L(t('Travel, ', '이동을 ', '移動を'))}
                <span>{L(t('reimagined', '새롭게', '新しく'))}</span>
              </Text>
              <Text size={9.5} tone="muted">
                {L(t('The modern way to move. Fast, simple, delightful.', '더 빠르고, 더 간단하고, 더 즐거운 이동.', 'より速く、より簡単で、心地よい移動。'))}
              </Text>
              <Button label={L(t('Get started', '시작하기', '始める'))} tone="accent" size="sm" />
            </div>
            <Grid cols={3} gap={6}>
              <Panel><Text size={9.5} tone="muted">{L(t('Fast', '빠릅니다', '速い'))}</Text></Panel>
              <Panel><Text size={9.5} tone="muted">{L(t('Simple', '간단합니다', '簡単'))}</Text></Panel>
              <Panel><Text size={9.5} tone="muted">{L(t('Secure', '안전합니다', '安全'))}</Text></Panel>
            </Grid>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Only this product', '이 제품에만 맞는 오프닝', 'この製品にしか合わない'))}>
        <Stack gap={8}>
          <Cluster gap={5} wrap>
            <Badge tone="accent">{L(t('Seoul', '서울', 'ソウル'))}</Badge>
            <Note>→</Note>
            <Badge tone="accent">{L(t('Busan', '부산', '釜山'))}</Badge>
            <Note>{L(t('Fri 14 Aug', '8월 14일(금)', '8月14日(金)'))}</Note>
          </Cluster>
          <Stack gap={4}>
            <Row label="06:00 → 08:37" meta={L(t('₩59,800 · 12 left', '59,800원 · 12석', '59,800円・残12'))} state="primary" />
            <Row label="06:30 → 09:14" meta={L(t('₩47,300 · 4 left', '47,300원 · 4석', '47,300円・残4'))} />
            <Row label="07:00 → 09:41" meta={L(t('₩59,800 · sold out', '59,800원 · 매진', '59,800円・満席'))} state="quiet" />
            <Row label="07:25 → 10:02" meta={L(t('₩38,600 · 31 left', '38,600원 · 31석', '38,600円・残31'))} />
          </Stack>
          <Cluster gap={6} align="between">
            <Note tone="accent">{L(t('Cheapest is 25 min slower', '가장 싼 편이 25분 더 걸립니다', '最安は25分長くかかります'))}</Note>
            <Button label={L(t('Reserve', '예매', '予約'))} tone="accent" size="sm" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 02 fidelity-follows-certainty — finish only what is settled.
 * ------------------------------------------------------------------ */
const fidelityFollowsCertainty: SceneEntry = {
  note: t(
    'Both panels are mid-project. Before, an unsettled recommendation block is already styled; after, it stays schematic and marked open while the settled summary is finished.',
    '둘 다 작업 중인 화면입니다. 적용 전에는 아직 정하지 못한 추천 영역까지 꾸며져 있고, 적용 후에는 그 영역을 개략적으로 두고 미정으로 표시하며 확정된 요약만 완성합니다.',
    'どちらも作業途中の画面です。適用前は未確定の推薦領域まで作り込まれ、適用後はそこを概略のまま未定と示し、確定した要約だけを仕上げます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const summary = L(t('Order summary', '주문 요약', '注文サマリー'));
    const recommend = L(t('Recommended for you', '추천 상품', 'おすすめ'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Polish before the content is settled', '내용이 정해지기 전에 마감', '内容が決まる前に仕上げ'))}>
          <Stack gap={8}>
            <Panel label={summary} elevation={2}>
              <Stack gap={4}>
                <Row label={L(t('Lorem ipsum dolor', '내용 미정', '内容未定'))} meta="₩ ??" state="quiet" />
                <Row label={L(t('Lorem ipsum', '내용 미정', '内容未定'))} meta="₩ ??" state="quiet" />
              </Stack>
            </Panel>
            <Panel label={recommend} elevation={2}>
              <Grid cols={3} gap={6}>
                <Media ratio="1 / 1" />
                <Media ratio="1 / 1" />
                <Media ratio="1 / 1" />
              </Grid>
            </Panel>
            <Note>{L(t('Rule still undecided', '노출 기준 미정', '表示基準は未定'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Detail where the content is settled', '내용이 정해진 곳만 마감', '内容が決まった所だけ仕上げ'))}>
        <Stack gap={8}>
          <Panel label={summary} elevation={1}>
            <Stack gap={4}>
              <Row label={L(t('Wool coat', '울 코트', 'ウールコート'))} meta="₩ 189,000" />
              <Row label={L(t('Shipping', '배송비', '送料'))} meta="₩ 0" state="quiet" />
            </Stack>
          </Panel>
          <Panel label={recommend}>
            <Stack gap={5}>
              <Note>{L(t('Open: ranking rule not decided', '미정: 정렬 기준 미확정', '未定：並び順が未確定'))}</Note>
              <Grid cols={3} gap={6}>
                <Media ratio="1 / 1" fallback="?" />
                <Media ratio="1 / 1" fallback="?" />
                <Media ratio="1 / 1" fallback="?" />
              </Grid>
            </Stack>
          </Panel>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 03 bounded-choice-system — base → semantic → component, plus modes.
 * ------------------------------------------------------------------ */
const boundedChoiceSystem: SceneEntry = {
  note: t(
    'Raw values pasted per component become a base → semantic → component chain, so light, dark and high-contrast modes resolve from the same graph.',
    '컴포넌트마다 붙여넣던 원시 값이 기초 → 의미 → 컴포넌트 연결로 바뀌고, 밝음·어두움·고대비 모드가 같은 그래프에서 해석됩니다.',
    'コンポーネントごとに貼り付けた生値が、基礎→意味→コンポーネントの連結になり、明暗と高対比が同じグラフから解決されます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Values pasted per component', '컴포넌트마다 값 붙여넣기', 'コンポーネントごとに値を貼付'))}>
          <Stack gap={7}>
            <Row label={L(t('Button / primary', '버튼 / 기본', 'ボタン / 既定'))} meta="#1B4FD8" />
            <Row label={L(t('Link', '링크', 'リンク'))} meta="#1C4ED6" />
            <Row label={L(t('Tab / selected', '탭 / 선택됨', 'タブ / 選択'))} meta="#2050DA" />
            <Row label={L(t('Chip / active', '칩 / 활성', 'チップ / 有効'))} meta="#1B4FD8" />
            <Note tone="danger">{L(t('4 near-identical blues · no dark mode', '거의 같은 파랑 4개 · 어두움 모드 없음', 'ほぼ同じ青が4つ・ダークなし'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('One graph, three modes', '하나의 그래프, 세 가지 모드', '一つのグラフ、三つのモード'))}>
        <Stack gap={7}>
          <Cluster gap={5} wrap>
            <Note>base</Note>
            <Note>blue-600</Note>
            <Note>→</Note>
            <Note tone="accent">action.primary</Note>
            <Note>→</Note>
            <Note>button · link · tab</Note>
          </Cluster>
          <Stack gap={4}>
            <Row label="action.primary" meta="blue-600" state="primary" />
            <Row label="action.primary / hover" meta="blue-700" />
            <Row label="action.primary / disabled" meta="gray-300" state="quiet" />
          </Stack>
          <Cluster gap={5} wrap>
            <Badge tone="accent">{L(t('Light', '밝음', 'ライト'))}</Badge>
            <Badge tone="accent">{L(t('Dark', '어두움', 'ダーク'))}</Badge>
            <Badge tone="accent">{L(t('High contrast', '고대비', '高対比'))}</Badge>
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 04 attention-budget — one primary, the rest quieter.
 * ------------------------------------------------------------------ */
const attentionBudget: SceneEntry = {
  note: t(
    'Four regions all competing at full strength become one primary, one supporting and two contextual — the same content, ranked.',
    '네 영역이 모두 최대 강도로 경쟁하던 것을 핵심 하나·보조 하나·맥락 둘로 등급화합니다. 내용은 그대로입니다.',
    '四領域が最大強度で競う状態を、主要一つ・補助一つ・文脈二つに格付けします。内容は同じです。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const items = [
      { label: L(t('Pay ₩38,900', '38,900원 결제하기', '38,900円を支払う')), rank: L(t('primary', '핵심', '主要')) },
      { label: L(t('Delivery Thu 10/2', '10월 2일(목) 도착', '10月2日(木) 到着')), rank: L(t('supporting', '보조', '補助')) },
      { label: L(t('Earn 380 points', '380P 적립', '380P 付与')), rank: L(t('context', '맥락', '文脈')) },
      { label: L(t('Gift wrap available', '선물 포장 가능', 'ギフト包装可')), rank: L(t('context', '맥락', '文脈')) },
    ];
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Everything at full strength', '모두 최대 강도', 'すべて最大強度'))}>
          <Stack gap={6}>
            {items.map((item) => (
              <Row key={item.label} label={item.label} state="primary" />
            ))}
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Ranked', '등급화', '格付け'))}>
        <Stack gap={6}>
          {items.map((item, index) => (
            <Row
              key={item.label}
              label={item.label}
              meta={item.rank}
              state={index === 0 ? 'primary' : index === 1 ? 'default' : 'quiet'}
            />
          ))}
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 05 contrast-before-scale — reach for contrast, not size.
 * ------------------------------------------------------------------ */
const contrastBeforeScale: SceneEntry = {
  note: t(
    'The label is not enlarged. It stays at 15px and gains contrast and weight instead, so the heading keeps its place in the scale.',
    '라벨을 키우지 않습니다. 15px을 유지한 채 대비와 굵기만 올려서, 제목이 척도 안의 자리를 지키게 합니다.',
    'ラベルを大きくしません。15pxのまま対比と太さだけを上げ、見出しが尺度内の位置を保つようにします。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const heading = L(t('Payment method', '결제 수단', 'お支払い方法'));
    const label = L(t('Card expires this month', '이번 달 만료 예정', '今月で有効期限切れ'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Made bigger', '크기를 키움', '大きくした'))}>
          <Stack gap={10}>
            <Text size={13} weight={600}>{heading}</Text>
            <Text size={24} weight={400} tone="muted">{label}</Text>
            <Note tone="danger">24px · {L(t('contrast', '대비', 'コントラスト'))} 1.9:1</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Made stronger', '대비를 올림', '対比を上げた'))}>
        <Stack gap={10}>
          <Text size={13} weight={600}>{heading}</Text>
          <Text size={15} weight={700} tone="accent">{label}</Text>
          <Note tone="accent">15px · {L(t('contrast', '대비', 'コントラスト'))} 8.2:1</Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 06 explicit-labels-and-semantics — names that survive without sight.
 * ------------------------------------------------------------------ */
const explicitLabels: SceneEntry = {
  note: t(
    'Placeholders become persistent labels, the button names its action, and the error is stated in words next to the field it belongs to.',
    '플레이스홀더가 사라지지 않는 라벨이 되고, 버튼이 자기 행동을 이름으로 말하며, 오류는 해당 필드 옆에 문장으로 놓입니다.',
    'プレースホルダーが消えないラベルになり、ボタンが自らの動作を名で示し、エラーは該当項目の横に文で置かれます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Placeholder only', '플레이스홀더만', 'プレースホルダーのみ'))}>
          <Stack gap={9}>
            <Field placeholder={L(t('Enter email', '이메일 입력', 'メール入力'))} />
            <Field value="1994" />
            <Cluster gap={6} align="between">
              <Note tone="danger">{L(t('Error', '오류', 'エラー'))}</Note>
              <Button label={L(t('Click here', '여기 클릭', 'ここをクリック'))} />
            </Cluster>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Named and tied', '이름과 연결', '名前と対応付け'))}>
        <Stack gap={9}>
          <Field
            label={L(t('Email', '이메일', 'メール'))}
            value="hyun@lafi.kr"
            hint={L(t('Used for the receipt', '영수증을 보낼 주소입니다', '領収書の送付先です'))}
          />
          <Field
            label={L(t('Year of birth', '태어난 해', '生年'))}
            value="1994"
            tone="danger"
            error={L(t('Enter 4 digits between 1900 and 2026', '1900~2026 사이 네 자리를 입력하세요', '1900〜2026の4桁を入力してください'))}
          />
          <Cluster gap={6} align="between">
            <Note>{L(t('2 fields', '입력 2개', '入力2件'))}</Note>
            <Button label={L(t('Create account', '계정 만들기', 'アカウント作成'))} tone="accent" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 07 task-aware-density — scanning and editing want different densities.
 * ------------------------------------------------------------------ */
const taskAwareDensity: SceneEntry = {
  note: t(
    'One comfortable density is applied to everything before; after, the scan list tightens to show more rows while the touch control keeps its 44px target.',
    '적용 전에는 모든 곳에 같은 여유 밀도를 씁니다. 적용 후에는 훑어보는 목록은 촘촘해져 더 많은 행을 보여주고, 터치 컨트롤은 44px 영역을 유지합니다.',
    '適用前は全てに同じ余裕ある密度を使います。適用後は一覧を詰めて行数を増やし、タッチ操作は44pxの領域を保ちます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const rows = [
      [L(t('Seoul → Busan', '서울 → 부산', 'ソウル → 釜山')), '08:00'],
      [L(t('Seoul → Daegu', '서울 → 대구', 'ソウル → 大邱')), '08:20'],
      [L(t('Seoul → Gwangju', '서울 → 광주', 'ソウル → 光州')), '08:45'],
      [L(t('Seoul → Jeonju', '서울 → 전주', 'ソウル → 全州')), '09:10'],
      [L(t('Seoul → Ulsan', '서울 → 울산', 'ソウル → 蔚山')), '09:30'],
    ];
    const shown = variant === 'before' ? rows.slice(0, 2) : rows;
    return (
      <Scene caption={variant === 'before'
        ? L(t('One density everywhere', '한 가지 밀도로 통일', 'すべて同じ密度'))
        : L(t('Density follows the task', '과업에 맞춘 밀도', 'タスクに合わせた密度'))}
      >
        <Stack gap={variant === 'before' ? 10 : 8}>
          <Stack gap={variant === 'before' ? 12 : 3}>
            {shown.map(([label, meta]) => <Row key={label} label={label} meta={meta} />)}
          </Stack>
          <Cluster gap={6} align="between">
            <Note tone={variant === 'before' ? 'danger' : 'accent'}>
              {variant === 'before'
                ? L(t('2 of 42 rows visible', '42행 중 2행 표시', '42行中2行を表示'))
                : L(t('5 of 42 rows visible', '42행 중 5행 표시', '42行中5行を表示'))}
            </Note>
            <Button
              label={L(t('Book', '예매', '予約'))}
              tone={variant === 'before' ? 'ghost' : 'accent'}
              size="lg"
              hint="44px"
            />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 08 relational-spacing — gaps say what belongs together.
 * ------------------------------------------------------------------ */
const relationalSpacing: SceneEntry = {
  note: t(
    'Every gap is 12px before, so the hint could belong to either field. After, related parts sit 4px apart and separate groups 20px apart.',
    '적용 전에는 모든 간격이 12px이라 도움말이 어느 필드의 것인지 알 수 없습니다. 적용 후에는 한 덩어리는 4px, 다른 묶음과는 20px로 벌립니다.',
    '適用前は全ての間隔が12pxで、補足がどちらの項目のものか分かりません。適用後は同じまとまりを4px、別の組を20px離します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const tight = variant === 'after';
    return (
      <Scene caption={tight
        ? L(t('4px inside · 20px between', '안쪽 4px · 사이 20px', '内側4px・間20px'))
        : L(t('12px everywhere', '전부 12px', 'すべて12px'))}
      >
        <Stack gap={tight ? 20 : 12}>
          <Field
            label={L(t('Card number', '카드 번호', 'カード番号'))}
            value="5310 **** **** 0042"
            hint={L(t('Visa and Mastercard only', '비자·마스터카드만 가능합니다', 'VisaとMastercardのみ'))}
            labelGap={tight ? 4 : 12}
            hintGap={tight ? 4 : 12}
          />
          <Field
            label={L(t('Billing postcode', '청구지 우편번호', '請求先郵便番号'))}
            value="04524"
            labelGap={tight ? 4 : 12}
          />
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 09 task-sized-composition — columns follow content, not a fixed count.
 * ------------------------------------------------------------------ */
const taskSizedComposition: SceneEntry = {
  note: t(
    'At the same 340px container, a fixed four-column grid truncates every label; letting the content set the column count keeps all four readable.',
    '같은 340px 컨테이너에서 4열 고정 그리드는 모든 라벨을 잘라냅니다. 콘텐츠가 열 수를 정하게 하면 넷 다 읽힙니다.',
    '同じ340pxのコンテナで、4列固定グリッドは全ラベルを切ります。内容が列数を決めれば四つとも読めます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const items = variant === 'before'
      ? [
        L(t('Depart…', '출발일…', '出発日…')),
        L(t('Return…', '도착일…', '帰着日…')),
        L(t('Passen…', '인원…', '人数…')),
        L(t('Cabin …', '좌석 등…', '座席…')),
      ]
      : [
        L(t('Departure date', '출발일', '出発日')),
        L(t('Return date', '도착일', '帰着日')),
        L(t('Passengers', '인원', '人数')),
        L(t('Cabin class', '좌석 등급', '座席クラス')),
      ];
    return (
      <Scene caption={variant === 'before'
        ? L(t('340px · 4 columns, fixed', '340px · 4열 고정', '340px・4列固定'))
        : L(t('340px · 2 columns, content-led', '340px · 콘텐츠에 맞춘 2열', '340px・内容に合わせ2列'))}
      >
        <Stack gap={8}>
          <Grid cols={variant === 'before' ? 4 : 2} gap={6}>
            {items.map((item) => (
              <Panel key={item}><Text size={11}>{item}</Text></Panel>
            ))}
          </Grid>
          <Note tone={variant === 'before' ? 'danger' : 'accent'}>
            {variant === 'before'
              ? L(t('4 of 4 labels truncated', '라벨 4개 모두 잘림', 'ラベル4件すべて省略'))
              : L(t('0 of 4 labels truncated', '잘린 라벨 없음', '省略なし'))}
          </Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 10 deliberate-type-scale — few steps, doing visible work.
 * ------------------------------------------------------------------ */
const deliberateTypeScale: SceneEntry = {
  note: t(
    'Six sizes within 5px of each other collapse into three steps far enough apart to read as levels, with weight carrying the rest.',
    '5px 안에 몰려 있던 여섯 크기를 단계로 읽히는 세 크기로 줄이고, 나머지는 굵기가 맡습니다.',
    '5px以内に密集した六つのサイズを、段階として読める三つに減らし、残りは太さが担います。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const title = L(t('Trip to Busan', '부산 여행', '釜山への旅'));
    const meta = L(t('3 nights · 2 travellers', '3박 · 2명', '3泊・2名'));
    const body = L(t('Free cancellation until 2 October.', '10월 2일까지 무료 취소.', '10月2日まで無料キャンセル。'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('6 sizes: 13·14·15·16·17·18', '6단계: 13·14·15·16·17·18', '6段階: 13·14·15·16·17·18'))}>
          <Stack gap={7}>
            <Text size={18}>{title}</Text>
            <Text size={17}>{meta}</Text>
            <Text size={16}>{body}</Text>
            <Text size={15} tone="muted">{L(t('Ref. 88-3921', '예약번호 88-3921', '予約番号 88-3921'))}</Text>
            <Text size={14}>{L(t('Deposit paid', '예약금 결제 완료', '予約金の支払い済み'))}</Text>
            <Text size={13} tone="muted">{L(t('Booked 12 Aug', '8월 12일 예약', '8月12日に予約'))}</Text>
            <Note tone="danger">{L(t('No step reads as a level', '어느 단계도 위계로 안 읽힘', 'どの段も階層に読めない'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('3 steps: 22·15·12', '3단계: 22·15·12', '3段階: 22·15·12'))}>
        <Stack gap={7}>
          <Text size={22} weight={700}>{title}</Text>
          <Text size={12} tone="muted">{meta}</Text>
          <Text size={15}>{body}</Text>
          <Text size={15} weight={600}>{L(t('Deposit paid', '예약금 결제 완료', '予約金の支払い済み'))}</Text>
          <Text size={12} tone="muted">{L(t('Ref. 88-3921 · booked 12 Aug', '예약번호 88-3921 · 8월 12일 예약', '予約番号 88-3921・8月12日'))}</Text>
          <Note tone="accent">{L(t('Weight separates the two 12px lines', '같은 12px은 굵기로 구분', '同じ12pxは太さで区別'))}</Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 11 measure-and-leading — real running text, measured.
 * ------------------------------------------------------------------ */
const measureAndLeading: SceneEntry = {
  note: t(
    'The same paragraph is re-set: the line stops running the full width and is capped at 34 characters, and the leading opens from 1.15 to 1.75, so the eye finds the start of the next line.',
    '같은 문단을 다시 조판합니다. 행이 화면 폭을 다 쓰지 않고 34자에서 끊기며, 행간이 1.15에서 1.75로 벌어져 눈이 다음 줄의 시작을 찾게 됩니다.',
    '同じ段落を組み直します。行が画面幅いっぱいに伸びず34字で折り返し、行間が1.15から1.75へ広がって、次の行の始まりを目が見つけられます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const body = L(t(
      'Refunds are issued to the original payment method within five business days. If the card has expired we send a bank transfer instead, and you will receive a message when it leaves our account.',
      '환불은 결제하신 수단으로 영업일 기준 5일 안에 처리됩니다. 카드 유효기간이 지난 경우에는 계좌 이체로 보내드리며, 출금이 끝나면 안내 메시지를 보내드립니다.',
      '返金は決済された方法へ、営業日で5日以内に処理されます。カードの有効期限が切れている場合は口座振込に切り替え、送金が完了した時点でご連絡します。',
    ));
    const before = variant === 'before';
    return (
      <Scene caption={before
        ? `line-height 1.15 · ${L(t('no line-length limit', '행 길이 제한 없음', '行長の制限なし'))}`
        : 'line-height 1.75 · 34ch'}
      >
        <Stack gap={8}>
          <Text size={before ? 8.5 : 11} leading={before ? 1.15 : 1.75} measure={before ? undefined : 34}>
            {body}
          </Text>
          <Note tone={before ? 'danger' : 'accent'}>
            {before
              ? L(t('Long line, tight leading', '긴 행, 좁은 행간', '長い行、狭い行間'))
              : L(t('Shorter line, open leading', '짧은 행, 여유 있는 행간', '短い行、余裕ある行間'))}
          </Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 12 align-for-reading — one box, three scripts.
 * ------------------------------------------------------------------ */
const alignForReading: SceneEntry = {
  note: t(
    'The same button box is tuned for Latin only, clipping Korean and Japanese. After, line height and padding follow the script and use logical properties, so a right-to-left locale mirrors too.',
    '같은 버튼 상자를 라틴 문자에만 맞추면 한국어와 일본어가 잘립니다. 적용 후에는 행간과 여백이 문자 체계를 따르고 논리 속성을 써서 오른쪽에서 왼쪽으로 읽는 언어도 뒤집힙니다.',
    '同じボタン枠をラテン文字だけに合わせると、韓国語と日本語が切れます。適用後は行間と余白が文字体系に従い、論理プロパティにより右書き言語も反転します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const before = variant === 'before';
    return (
      <Scene caption={before
        ? 'height: 16px · text-align: left'
        : 'line-height: 1.6 · text-align: start'}
      >
        <Stack gap={7}>
          <div className="pex-script" data-clip={before ? 'on' : undefined}>
            <span>Continue to payment</span>
            <span>결제 단계로 이동하기</span>
            <span>お支払いへ進む</span>
            <span dir="rtl">المتابعة إلى الدفع</span>
          </div>
          <Note tone={before ? 'danger' : 'accent'}>
            {before
              ? L(t('Tall scripts clipped · right-to-left text pinned left', '높이가 큰 문자는 잘리고, 오른쪽에서 왼쪽으로 읽는 글도 왼쪽 고정', '高さのある文字は切れ、右書きの文も左寄せのまま'))
              : L(t('No clipping · alignment follows the script', '잘림 없음 · 정렬이 문자 체계를 따름', '切れなし・揃えが文字体系に追従'))}
          </Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 13 role-based-color — name the job, not the hue.
 * ------------------------------------------------------------------ */
const roleBasedColor: SceneEntry = {
  note: t(
    'The palette is renamed from hue-and-number to the interface job each colour does, so "which blue" stops being a question and disabled or danger states have somewhere to live.',
    '팔레트 이름을 색상과 번호에서 각 색이 맡은 인터페이스 역할로 바꿉니다. 어떤 파랑을 쓸지 묻지 않게 되고, 비활성이나 위험 상태에도 자리가 생깁니다.',
    'パレット名を色相と番号から、各色が担う役割に変えます。どの青かを問わずに済み、無効や危険の状態にも居場所ができます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Named by hue', '색상으로 이름 붙임', '色相で命名'))}>
          <Stack gap={9}>
            <Cluster gap={6} wrap>
              <Swatch color="#eef2fb" name="blue-50" />
              <Swatch color="#c8cdd6" name="gray-300" />
              <Swatch color="#1b4fd8" name="blue-600" />
              <Swatch color="#8d3437" name="red-700" />
              <Swatch color="#26262a" name="gray-900" />
            </Cluster>
            <Note tone="danger">
              {L(t('Which blue is a link, and which is a button?', '어느 파랑이 링크이고 어느 파랑이 버튼인가요?', 'どの青がリンクで、どの青がボタンですか。'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Named by role', '역할로 이름 붙임', '役割で命名'))}>
        <Stack gap={9}>
          <Cluster gap={6} wrap>
            <Swatch color="#eef2fb" name="surface" value="blue-50" />
            <Swatch color="#c8cdd6" name="border" value="gray-300" />
            <Swatch color="#1b4fd8" name="action" value="blue-600" />
            <Swatch color="#8d3437" name="danger" value="red-700" />
            <Swatch color="#26262a" name="text" value="gray-900" />
          </Cluster>
          <Cluster gap={6} align="between">
            <Note tone="danger">danger · {L(t('Payment failed', '결제 실패', '決済失敗'))}</Note>
            <Button label={L(t('Retry', '다시 시도', '再試行'))} tone="accent" hint="action" />
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 14 perceptual-color-ramps — even steps, same hue.
 * ------------------------------------------------------------------ */
const perceptualColorRamps: SceneEntry = {
  note: t(
    'The same hue is kept; only the spacing of the steps changes. Uneven lightness jumps (25, 5, 28, 26) become even ones (18, 18, 18, 18), so 300 and 400 stop reading as one colour.',
    '색상은 그대로 두고 단계 간격만 고칩니다. 들쭉날쭉하던 명도 차이(25, 5, 28, 26)가 고르게(18, 18, 18, 18) 바뀌어, 300과 400이 같은 색으로 보이지 않습니다.',
    '色相はそのままに、段の間隔だけを直します。不均一な明度差（25, 5, 28, 26）が均等（18, 18, 18, 18）になり、300と400が同じ色に見えなくなります。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Uneven steps', '간격이 고르지 않음', '間隔が不均一'))}>
          <Stack gap={9}>
            <Cluster gap={6} wrap>
              <Swatch color="#f2f5fd" name="100" ratio="L* 96" />
              <Swatch color="#a8b9e6" name="200" ratio="L* 74" />
              <Swatch color="#9db1e3" name="300" ratio="L* 71" />
              <Swatch color="#3a63cf" name="400" ratio="L* 45" />
              <Swatch color="#12245c" name="500" ratio="L* 19" />
            </Cluster>
            <Note tone="danger">
              {L(t('200→300 differs by 3; 300→400 by 26', '200→300은 3, 300→400은 26 차이', '200→300は3、300→400は26の差'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Even steps', '고른 간격', '均等な間隔'))}>
        <Stack gap={9}>
          <Cluster gap={6} wrap>
            <Swatch color="#eef2fd" name="100" ratio="L* 95" />
            <Swatch color="#bfcdf2" name="200" ratio="L* 81" />
            <Swatch color="#8098de" name="300" ratio="L* 63" />
            <Swatch color="#3f63c4" name="400" ratio="L* 45" />
            <Swatch color="#1d3172" name="500" ratio="L* 27" />
          </Cluster>
          <Note tone="accent">
            {L(t('18 lightness steps throughout', '전 구간 명도 18 단계', '全区間で明度18の段差'))}
          </Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 15 redundant-state-signals — colour is never the only carrier.
 * ------------------------------------------------------------------ */
const redundantStateSignals: SceneEntry = {
  note: t(
    'A red dot alone says nothing to a screen reader or a red-green colour-blind reader. After, the same state carries a shape, a word and a next action.',
    '빨간 점만으로는 화면 낭독기나 적록 색약 사용자에게 아무 정보도 전해지지 않습니다. 적용 후에는 같은 상태를 도형·문장·다음 행동이 함께 전합니다.',
    '赤い点だけでは、読み上げや赤緑色覚特性の利用者に何も伝わりません。適用後は同じ状態を、形と文と次の行動が共に伝えます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const rows = [
      L(t('Invoice 2291', '청구서 2291', '請求書 2291')),
      L(t('Invoice 2292', '청구서 2292', '請求書 2292')),
      L(t('Invoice 2293', '청구서 2293', '請求書 2293')),
    ];
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Colour only', '색만 사용', '色のみ'))}>
          <Stack gap={7}>
            {rows.map((row, index) => (
              <div className="pex-signal" key={row} data-tone={index === 1 ? 'danger' : 'ok'}>
                <i />
                <span>{row}</span>
              </div>
            ))}
            <Note tone="danger">{L(t('Announced as "Invoice 2292" and nothing more', '낭독기는 "청구서 2292"까지만 읽습니다', '読み上げは「請求書 2292」までです'))}</Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Colour, shape and words', '색·도형·문장', '色・形・文'))}>
        <Stack gap={7}>
          {rows.map((row, index) => (
            <div className="pex-signal" key={row} data-tone={index === 1 ? 'danger' : 'ok'} data-rich="on">
              <i>{index === 1 ? '!' : '✓'}</i>
              <span>{row}</span>
              <b>{index === 1 ? L(t('Payment failed', '결제 실패', '決済失敗')) : L(t('Paid', '결제 완료', '支払済'))}</b>
            </div>
          ))}
          <Note tone="accent">{L(t('Announced as "Invoice 2292, payment failed"', '낭독기는 "청구서 2292, 결제 실패"로 읽습니다', '読み上げは「請求書 2292、決済失敗」となります'))}</Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 16 multi-input-operability — pointer, keyboard and touch reach it.
 * ------------------------------------------------------------------ */
const multiInputOperability: SceneEntry = {
  note: t(
    'An action that only appears on hover becomes permanently reachable: a visible focus ring, a 44px touch target, and the same action available without a pointer.',
    '호버할 때만 나타나던 행동을 항상 닿을 수 있게 만듭니다. 보이는 포커스 표시, 44px 터치 영역, 포인터 없이도 쓸 수 있는 같은 행동입니다.',
    'ホバー時だけ現れる操作を、常に届くようにします。見えるフォーカス表示、44pxのタッチ領域、ポインタなしでも使える同じ操作です。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const row = L(t('Q3 report.pdf', '3분기 보고서.pdf', '第3四半期レポート.pdf'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Hover only', '호버할 때만', 'ホバー時のみ'))}>
          <Stack gap={9}>
            <Cluster gap={6} align="between">
              <Text size={11}>{row}</Text>
              <Button label="⋯" size="sm" hint="24px" />
            </Cluster>
            <Note tone="danger">{L(t('Appears on hover · no focus ring · 24px target', '호버 시에만 표시 · 포커스 표시 없음 · 24px 영역', 'ホバー時のみ表示・フォーカス表示なし・24px'))}</Note>
            <Cluster gap={5} wrap>
              <Badge>{L(t('Pointer', '포인터', 'ポインタ'))}</Badge>
              <Badge tone="danger">{L(t('Keyboard ✕', '키보드 ✕', 'キーボード ✕'))}</Badge>
              <Badge tone="danger">{L(t('Touch ✕', '터치 ✕', 'タッチ ✕'))}</Badge>
            </Cluster>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Always reachable', '항상 닿을 수 있게', '常に届く'))}>
        <Stack gap={9}>
          <Cluster gap={6} align="between">
            <Text size={11}>{row}</Text>
            <Button label={L(t('Share', '공유', '共有'))} tone="accent" size="lg" focus hint="44px" />
          </Cluster>
          <Note tone="accent">{L(t('Always visible · focus ring · 44px target', '항상 표시 · 포커스 표시 · 44px 영역', '常に表示・フォーカス表示・44px'))}</Note>
          <Cluster gap={5} wrap>
            <Badge tone="accent">{L(t('Pointer', '포인터', 'ポインタ'))}</Badge>
            <Badge tone="accent">{L(t('Keyboard', '키보드', 'キーボード'))}</Badge>
            <Badge tone="accent">{L(t('Touch', '터치', 'タッチ'))}</Badge>
          </Cluster>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 17 depth-explains-structure — elevation as a small vocabulary.
 * ------------------------------------------------------------------ */
const depthExplainsStructure: SceneEntry = {
  note: t(
    'Shadows on everything mean nothing is above anything. After, three named levels are used — page, card, popover — and only the popover, which really floats, gets the top one.',
    '모든 것에 그림자를 주면 무엇이 위에 있는지 알 수 없습니다. 적용 후에는 페이지·카드·팝오버 세 단계만 쓰고, 실제로 떠 있는 팝오버에만 가장 높은 단계를 줍니다.',
    'すべてに影を付けると、何が上にあるか分かりません。適用後はページ・カード・ポップオーバーの三段のみを使い、実際に浮くポップオーバーだけに最上段を与えます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Everything floats', '전부 떠 있음', 'すべてが浮いている'))}>
          <Grid cols={2} gap={8}>
            <Panel label={L(t('Card', '카드', 'カード'))} elevation={2}><Text size={11}>₩ 42,000</Text></Panel>
            <Panel label={L(t('Card', '카드', 'カード'))} elevation={2}><Text size={11}>₩ 18,500</Text></Panel>
            <Panel label={L(t('Page header', '페이지 헤더', 'ページ見出し'))} elevation={2}><Text size={11}>{L(t('Orders', '주문 내역', '注文履歴'))}</Text></Panel>
            <Panel label={L(t('Footer note', '하단 안내', '下部の案内'))} elevation={2}><Text size={11}>{L(t('VAT included', '부가세 포함', '税込'))}</Text></Panel>
          </Grid>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Three levels: 0 · 1 · 2', '세 단계: 0 · 1 · 2', '三段階: 0 · 1 · 2'))}>
        <Stack gap={8}>
          <Panel label={`0 · ${L(t('page', '페이지', 'ページ'))}`} elevation={0}>
            <Grid cols={2} gap={8}>
              <Panel label={`1 · ${L(t('card', '카드', 'カード'))}`} elevation={1}><Text size={11}>₩ 42,000</Text></Panel>
              <Panel label={`1 · ${L(t('card', '카드', 'カード'))}`} elevation={1}><Text size={11}>₩ 18,500</Text></Panel>
            </Grid>
          </Panel>
          <div className="pex-popover">
            <Panel label={`2 · ${L(t('popover', '팝오버', 'ポップオーバー'))}`} elevation={2}>
              <Text size={11}>{L(t('Change delivery date', '배송일 변경', '配送日を変更'))}</Text>
            </Panel>
          </div>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 18 resilient-imagery — assume the picture will misbehave.
 * ------------------------------------------------------------------ */
const resilientImagery: SceneEntry = {
  note: t(
    'The caption moves off the subject so it stays readable whatever the photo turns out to be, and a failed image falls back to its alt text instead of leaving a blank hole in the layout.',
    '설명이 피사체를 비켜나 어떤 사진이 오더라도 읽히고, 이미지가 실패하면 레이아웃에 빈 구멍을 남기지 않고 대체 텍스트가 자리를 지킵니다.',
    'キャプションが被写体から外れ、どんな写真でも読める位置に移り、画像が失敗しても空白を残さず代替テキストが場所を保ちます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    const caption = L(t('Namsan at dusk', '해질 무렵의 남산', '夕暮れの南山'));
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Assumes a perfect image', '완벽한 이미지를 가정', '完璧な画像を前提'))}>
          <Grid cols={2} gap={8}>
            <Media busy overlay={caption} focal="center" />
            <Media broken />
          </Grid>
          <Note tone="danger">
            {L(t('Text on the subject · no ratio box · failure shows nothing', '피사체 위 텍스트 · 비율 상자 없음 · 실패 시 아무것도 없음', '被写体上の文字・比率枠なし・失敗時は空白'))}
          </Note>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Survives a bad image', '이미지가 나빠도 견딤', '画像が悪くても耐える'))}>
        <Grid cols={2} gap={8}>
          <Media busy overlay={caption} focal="left" />
          <Media fallback={caption} />
        </Grid>
        <Note tone="accent">
          {L(t('Caption off the subject · 16:9 reserved · alt text on failure', '피사체를 피한 설명 · 16:9 예약 · 실패 시 대체 텍스트', '被写体を避けた説明・16:9確保・失敗時は代替テキスト'))}
        </Note>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 19 complete-state-model — the four states nobody designs.
 * ------------------------------------------------------------------ */
const completeStateModel: SceneEntry = {
  note: t(
    'Only the success state exists before. After, the same list is specified for empty, loading, partial failure and error as well — each with what it says and what the reader can do next.',
    '적용 전에는 성공 상태만 있습니다. 적용 후에는 같은 목록에 빈 상태·로딩·부분 실패·오류까지 정의하고, 각 상태가 무엇을 말하고 다음에 무엇을 할 수 있는지 함께 둡니다.',
    '適用前は成功状態しかありません。適用後は同じ一覧に空・読込中・一部失敗・エラーまで定義し、各状態が何を伝え次に何ができるかを併記します。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('One state designed', '설계된 상태 1개', '設計済み1状態'))}>
          <Stack gap={7}>
            <Badge tone="accent">{L(t('Success', '완료', '完了'))}</Badge>
            <Row label={L(t('Payout 2291', '정산 2291', '精算 2291'))} meta="₩ 1,204,000" />
            <Row label={L(t('Payout 2292', '정산 2292', '精算 2292'))} meta="₩ 820,000" />
            <Stack gap={4}>
              <Note tone="danger">{L(t('Empty · Loading · Partial · Error — undefined', '빈 상태 · 로딩 · 부분 실패 · 오류 — 미정의', '空・読込・一部失敗・エラー — 未定義'))}</Note>
            </Stack>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Five states specified', '설계된 상태 5개', '設計済み5状態'))}>
        <Stack gap={6}>
          <Row label={L(t('Empty', '빈 상태', '空'))} meta={L(t('No payouts yet · Add an account', '정산 내역 없음 · 계좌 추가', '精算なし・口座を追加'))} state="quiet" />
          <Row label={L(t('Loading', '로딩', '読込中'))} meta={L(t('Rows keep their height', '행 높이를 유지', '行の高さを維持'))} state="quiet" />
          <Row label={L(t('Partial', '부분 실패', '一部失敗'))} meta={L(t('2 of 14 failed · Retry those 2', '14건 중 2건 실패 · 2건만 재시도', '14件中2件失敗・2件のみ再試行'))} />
          <Row label={L(t('Error', '오류', 'エラー'))} meta={L(t('Bank unreachable · Try again', '은행 응답 없음 · 다시 시도', '銀行応答なし・再試行'))} state="danger" />
          <Row label={L(t('Success', '완료', '完了'))} meta="₩ 1,204,000" state="primary" />
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 20 recoverable-actions — a way back from the destructive one.
 * ------------------------------------------------------------------ */
const recoverableActions: SceneEntry = {
  note: t(
    'Deletion goes from immediate and final to reversible: the row is removed optimistically, an undo stays available, and only the truly irreversible step asks for typed confirmation.',
    '삭제가 즉시 확정되던 것에서 되돌릴 수 있는 방식으로 바뀝니다. 행은 먼저 사라지고 실행 취소가 남아 있으며, 정말로 되돌릴 수 없는 단계에만 직접 입력해 확인하게 합니다.',
    '削除が即時確定から取り消し可能に変わります。行は先に消え、取り消しが残り、本当に戻せない段階だけ入力による確認を求めます。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption={L(t('Immediate and final', '즉시 확정', '即時確定'))}>
          <Stack gap={9}>
            <Row label={L(t('Design assets', '디자인 자료', 'デザイン素材'))} meta={L(t('412 files', '412개 파일', '412ファイル'))} />
            <Cluster gap={6} align="between">
              <Note tone="danger">{L(t('No confirmation · no undo', '확인 없음 · 되돌리기 없음', '確認なし・取り消しなし'))}</Note>
              <Button label={L(t('Delete', '삭제', '削除'))} tone="danger" />
            </Cluster>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption={L(t('Reversible', '되돌릴 수 있음', '取り消せる'))}>
        <Stack gap={9}>
          <Row label={L(t('Design assets', '디자인 자료', 'デザイン素材'))} meta={L(t('Deleted', '삭제됨', '削除済み'))} state="quiet" />
          <div className="pex-snackbar">
            <span>{L(t('Moved to trash · 30 days', '휴지통으로 이동 · 30일 보관', 'ゴミ箱へ移動・30日保管'))}</span>
            <b>{L(t('Undo', '실행 취소', '元に戻す'))}</b>
          </div>
          <Note tone="accent">
            {L(t('Permanent deletion asks you to type the folder name', '영구 삭제는 폴더 이름을 직접 입력해야 합니다', '完全削除はフォルダ名の入力を求めます'))}
          </Note>
        </Stack>
      </Scene>
    );
  },
};

/* ------------------------------------------------------------------ *
 * 21 motion-and-preference — short, interruptible, optional.
 * ------------------------------------------------------------------ */
const motionAndPreference: SceneEntry = {
  note: t(
    'A 600ms bounce that has to finish becomes a 140ms fade that can be interrupted, and reduced-motion gets an instant update rather than a shortened animation.',
    '끝날 때까지 기다려야 하는 600ms 튕김이 중단할 수 있는 140ms 페이드로 바뀌고, 동작 최소화 설정에서는 짧은 애니메이션이 아니라 즉시 갱신을 씁니다.',
    '完了を待つ必要のある600msの弾みが、中断できる140msのフェードになり、動きを減らす設定では短い動画ではなく即時更新にします。',
  ),
  render: ({ variant, lang }) => {
    const L = reader(lang);
    if (variant === 'before') {
      return (
        <Scene caption="600ms · cubic-bezier(.68,-.55,.27,1.55)">
          <Stack gap={9}>
            <div className="pex-frames" data-mode="bounce">
              <i /><i /><i /><i /><i />
            </div>
            <Note tone="danger">
              {L(t('Overshoots, cannot be interrupted, ignores reduced motion', '과하게 튀고, 중단할 수 없으며, 동작 최소화를 무시합니다', '行き過ぎ、中断できず、動きの軽減を無視します'))}
            </Note>
          </Stack>
        </Scene>
      );
    }
    return (
      <Scene caption="140ms · ease-out">
        <Stack gap={9}>
          <div className="pex-frames" data-mode="fade">
            <i /><i /><i />
          </div>
          <Note tone="accent">
            {L(t('Interruptible · prefers-reduced-motion: updates instantly', '중단 가능 · prefers-reduced-motion에서는 즉시 갱신', '中断可能・prefers-reduced-motionでは即時更新'))}
          </Note>
        </Stack>
      </Scene>
    );
  },
};

export const designScenes: Record<string, SceneEntry> = {
  'core-task-first': coreTaskFirst,
  'opening-earns-its-frame': openingEarnsItsFrame,
  'fidelity-follows-certainty': fidelityFollowsCertainty,
  'bounded-choice-system': boundedChoiceSystem,
  'attention-budget': attentionBudget,
  'contrast-before-scale': contrastBeforeScale,
  'explicit-labels-and-semantics': explicitLabels,
  'task-aware-density': taskAwareDensity,
  'relational-spacing': relationalSpacing,
  'task-sized-composition': taskSizedComposition,
  'deliberate-type-scale': deliberateTypeScale,
  'measure-and-leading': measureAndLeading,
  'align-for-reading': alignForReading,
  'role-based-color': roleBasedColor,
  'perceptual-color-ramps': perceptualColorRamps,
  'redundant-state-signals': redundantStateSignals,
  'multi-input-operability': multiInputOperability,
  'depth-explains-structure': depthExplainsStructure,
  'resilient-imagery': resilientImagery,
  'complete-state-model': completeStateModel,
  'recoverable-actions': recoverableActions,
  'motion-and-preference': motionAndPreference,
};

