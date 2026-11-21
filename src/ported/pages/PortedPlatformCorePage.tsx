import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedPlatformCorePage.css';

// The product page of Keyhole, a hosted sign-in and user-account service, in the Platform
// Core style. Figtree sets everything people read, from the headline to the labels inside
// the sign-in widget; Roboto Mono carries the developer half: code, endpoints, request
// fields, dates and versions. Components come from an auth product's own docs: the
// drop-in sign-in drawn as a live preview with a Light/Dark switch, the requests it makes,
// the code that renders it in four frameworks, three ruled rows, a pricing table with a
// usage calculator and the matching band lit, a region table and a changelog on a date
// rail, with a sticky page index beside the sections. Dark page, light widget.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

// Inline `code` and **bold** inside a sentence.
function rich(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**')) return <b key={index}>{part.slice(2, -2)}</b>;
    return part;
  });
}

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

function KeyholeMark() {
  return (
    <svg className="kh-mark__glyph" viewBox="0 0 18 22" aria-hidden="true">
      <circle cx="9" cy="7" r="6" />
      <path d="M6.2 11h5.6l2 11H4.2z" />
    </svg>
  );
}

const HEAD = {
  nav: { en: 'Keyhole', ko: 'Keyhole', ja: 'Keyhole' },
  product: { en: 'Product', ko: '제품', ja: '製品' },
  pricing: { en: 'Pricing', ko: '요금', ja: '料金' },
  regions: { en: 'Data regions', ko: '데이터 리전', ja: 'データの保存先' },
  changelog: { en: 'Changelog', ko: '변경 기록', ja: '変更履歴' },
  start: { en: 'Start building', ko: '시작하기', ja: '導入を始める' },
} satisfies Record<string, Tri>;

const HERO = {
  title: { en: 'Sign-in and user accounts for your app, in one component.', ko: '앱에 로그인과 사용자 계정을, 컴포넌트 하나로.', ja: 'アプリのサインインとユーザーアカウントを、コンポーネント1つで。' },
  lede: {
    en: 'Keyhole hosts the sign-in screens, stores your users and keeps them signed in. Drop the component into a page as it is, or call the same API from forms you build yourself.',
    ko: 'Keyhole은 로그인 화면을 호스팅하고, 사용자 정보를 저장하며, 로그인 상태를 유지합니다. 컴포넌트를 페이지에 그대로 넣거나, 직접 만든 폼에서 같은 API를 호출하면 됩니다.',
    ja: 'Keyholeはサインイン画面をホストし、ユーザーを保存して、ログイン状態を維持します。コンポーネントをそのままページに配置することも、自分で作るフォームから同じAPIを呼び出すこともできます。',
  },
  install: { en: 'Install command', ko: '설치 명령', ja: 'インストールコマンド' },
  free: { en: 'The first 10,000 monthly active users are free.', ko: '월간 활성 사용자 처음 10,000명은 무료입니다.', ja: '月間アクティブユーザーの最初の10,000人は無料です。' },
} satisfies Record<string, Tri>;

const INSTALL = 'npm i @keyhole/react';

const COPY = {
  copy: { en: 'Copy', ko: '복사', ja: 'コピー' },
  copied: { en: 'Copied', ko: '복사됨', ja: 'コピーしました' },
  failed: { en: 'Not copied', ko: '복사 실패', ja: 'コピー失敗' },
  doneInstall: { en: 'Install command copied.', ko: '설치 명령을 복사했습니다.', ja: 'インストールコマンドをコピーしました。' },
  doneCode: { en: '{framework} code copied.', ko: '{framework} 코드를 복사했습니다.', ja: '{framework}のコードをコピーしました。' },
  blocked: {
    en: 'This browser did not allow copying. Select the text and copy it yourself.',
    ko: '이 브라우저에서는 복사할 수 없습니다. 텍스트를 선택해 직접 복사해 주세요.',
    ja: 'このブラウザではコピーできませんでした。テキストを選択して、手動でコピーしてください。',
  },
} satisfies Record<string, Tri>;

// ---------------------------------------------------------------------------------------
// The sign-in preview

const DEFAULT_EMAIL = 'mara@haldenstudio.com';

/** Company domains that sign in through their own identity provider. */
const SSO: Record<string, { idp: string; connection: string; host: string }> = {
  'haldenstudio.com': { idp: 'Okta', connection: 'okta_halden', host: 'haldenstudio.okta.com' },
};

type EmailKind = 'incomplete' | 'sso' | 'code';
type Action = 'passkey' | 'google' | 'signup' | 'continue' | null;
type Appearance = 'light' | 'dark';

interface ReadEmail {
  kind: EmailKind;
  email: string;
  domain: string;
  /** A plain first name before the @, used in the notes as the prototype used "Mara". */
  name: string | null;
}

function readEmail(value: string): ReadEmail {
  const email = value.trim();
  const match = /^([^\s@]+)@([^\s@]+\.[a-z]{2,})$/i.exec(email);
  if (!match) return { kind: 'incomplete', email, domain: '', name: null };
  const domain = match[2].toLowerCase();
  const name = /^[a-z]{2,}$/i.test(match[1]) ? match[1][0].toUpperCase() + match[1].slice(1).toLowerCase() : null;
  return { kind: SSO[domain] ? 'sso' : 'code', email, domain, name };
}

const WIDGET = {
  app: { en: 'Sign in to Tally', ko: 'Tally에 로그인', ja: 'Tallyにサインイン' },
  newHere: { en: 'New to Tally?', ko: 'Tally가 처음이신가요?', ja: 'Tallyは初めてですか？' },
  create: { en: 'Create an account', ko: '계정 만들기', ja: 'アカウントを作成' },
  passkey: { en: 'Continue with a passkey', ko: '패스키로 계속하기', ja: 'パスキーで続行' },
  passkeyBusy: { en: 'Waiting for your passkey', ko: '패스키를 기다리는 중', ja: 'パスキーの確認を待っています' },
  google: { en: 'Continue with Google', ko: 'Google로 계속하기', ja: 'Googleで続行' },
  googleBusy: { en: 'Opening Google', ko: 'Google 여는 중', ja: 'Googleを開いています' },
  or: { en: 'or', ko: '또는', ja: 'または' },
  email: { en: 'Email address', ko: '이메일 주소', ja: 'メールアドレス' },
  hintIncomplete: {
    en: 'Company emails can sign in through their own login.',
    ko: '회사 이메일은 회사 로그인을 사용합니다.',
    ja: '会社のメールは自社ログインを使えます。',
  },
  hintSso: { en: '{domain} signs in through {idp}', ko: '{domain}: {idp}로 로그인', ja: '{domain}：{idp}でサインイン' },
  hintCode: { en: 'We email you a 6-digit code to sign in.', ko: '로그인하려면 6자리 코드를 이메일로 보내 드립니다.', ja: 'サインインには6桁のコードをメールでお送りします。' },
  error: { en: 'Enter an email, like name@work.com.', ko: '이메일을 입력하세요. 예: name@work.com', ja: 'メールアドレスを入力してください。例：name@work.com' },
  continue: { en: 'Continue', ko: '계속', ja: '続行' },
  continueSso: { en: 'Continue with {idp}', ko: '{idp}로 계속하기', ja: '{idp}で続行' },
  busySso: { en: 'Opening {idp}', ko: '{idp} 여는 중', ja: '{idp}を開いています' },
  busyCode: { en: 'Sending your code', ko: '코드를 보내는 중', ja: 'コードを送信しています' },
} satisfies Record<string, Tri>;

const STAGE = {
  preview: { en: 'Preview', ko: '미리보기', ja: 'プレビュー' },
  appearance: { en: 'Appearance', ko: '테마', ja: '外観' },
  light: { en: 'Light', ko: '라이트', ja: 'ライト' },
  dark: { en: 'Dark', ko: '다크', ja: 'ダーク' },
  requests: { en: 'Requests', ko: '요청', ja: 'リクエスト' },
  list: { en: 'Requests made by the component, in order', ko: '컴포넌트가 순서대로 보낸 요청', ja: 'コンポーネントが順番に送ったリクエスト' },
  reset: { en: 'Start over', ko: '처음부터 다시', ja: '最初からやり直す' },
  resetDone: { en: 'The preview is back where it started.', ko: '미리보기를 처음 상태로 되돌렸습니다.', ja: 'プレビューを最初の状態に戻しました。' },
  onContinue: { en: 'on Continue', ko: '계속을 누르면', ja: '続行を押すと' },
  afterPrompt: { en: 'after the prompt', ko: '인증 창 이후', ja: '認証画面の後' },
  waitingEmail: { en: 'waiting for an email', ko: '이메일 대기 중', ja: 'メールを待機中' },
  thisDevice: { en: '1 on this device', ko: '이 기기에 1개', ja: 'この端末に1件' },
  fromPrompt: { en: 'from the browser prompt', ko: '브라우저 인증 창에서', ja: 'ブラウザの認証画面から' },
  theUser: { en: 'the user', ko: '사용자', ja: 'ユーザー' },
} satisfies Record<string, Tri>;

const NEXT = {
  incomplete: {
    en: 'Type an email address and the component works out how it signs in: a company login for domains with single sign-on, an emailed code for the rest.',
    ko: '이메일 주소를 입력하면 컴포넌트가 로그인 방식을 정합니다. 싱글 사인온(SSO)을 쓰는 도메인은 회사 로그인으로, 나머지는 이메일로 받은 코드로 로그인합니다.',
    ja: 'メールアドレスを入力すると、コンポーネントがサインイン方法を判定します。シングルサインオン(SSO)を使うドメインは会社のログインで、それ以外はメールで届くコードでサインインします。',
  },
  sso: {
    en: 'After {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
    ko: '{idp} 인증 후 {who} 로그인 상태로 `/invoices`에 도착하며, 세션은 7일간 유지됩니다.',
    ja: '{idp}の後、{who}はサインインした状態で`/invoices`に移動し、セッションは7日間有効です。',
  },
  ssoGoing: {
    en: 'The browser would now open `{host}`. The preview stops here; after {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
    ko: '브라우저가 이제 `{host}`를 엽니다. 미리보기는 여기서 멈춥니다. {idp} 인증 후 {who} 로그인 상태로 `/invoices`에 도착하며, 세션은 7일간 유지됩니다.',
    ja: 'ブラウザがこれから`{host}`を開きます。プレビューはここで止まります。{idp}の後、{who}はサインインした状態で`/invoices`に移動し、セッションは7日間有効です。',
  },
  code: {
    en: 'On Continue, Keyhole emails a 6-digit code to {email}. The code works for 10 minutes.',
    ko: '계속을 누르면 Keyhole이 {email} 주소로 6자리 코드를 보냅니다. 코드는 10분간 유효합니다.',
    ja: '続行を押すと、Keyholeが{email}宛に6桁のコードを送信します。コードの有効期間は10分です。',
  },
  codeSent: {
    en: 'A 6-digit code is on its way to {email}. The component now asks for it; the code works for 10 minutes.',
    ko: '6자리 코드를 {email} 주소로 보냈습니다. 컴포넌트가 이제 코드를 입력받습니다. 코드는 10분간 유효합니다.',
    ja: '6桁のコードを{email}宛に送信しました。コンポーネントが次にコードの入力を求めます。コードの有効期間は10分です。',
  },
  passkey: {
    en: 'The browser now asks for the passkey saved for `tally.app`, by Touch ID, Windows Hello or a phone. The preview stops here; in your app the user then lands on `/invoices`.',
    ko: '브라우저가 이제 `tally.app`에 저장된 패스키를 요청합니다. Touch ID, Windows Hello 또는 휴대폰으로 인증합니다. 미리보기는 여기서 멈춥니다. 실제 앱에서는 이후 사용자가 `/invoices`에 도착합니다.',
    ja: 'ブラウザが`tally.app`用に保存されたパスキーを求めます。Touch ID、Windows Hello、またはスマートフォンで認証します。プレビューはここで止まります。実際のアプリでは、この後ユーザーは`/invoices`に移動します。',
  },
  google: {
    en: "The browser would now open Google's account picker. The preview stops here; in your app the user then lands on `/invoices`, and a first-time user gets a new account.",
    ko: '브라우저가 이제 Google 계정 선택 창을 엽니다. 미리보기는 여기서 멈춥니다. 실제 앱에서는 이후 사용자가 `/invoices`에 도착하며, 처음 이용하는 사용자는 새 계정이 만들어집니다.',
    ja: 'ブラウザがこれからGoogleのアカウント選択画面を開きます。プレビューはここで止まります。実際のアプリでは、この後ユーザーは`/invoices`に移動し、初めて利用するユーザーには新しいアカウントが作成されます。',
  },
  signup: {
    en: 'The component switches to its sign-up form: the same three methods, plus a name field. The preview stops here.',
    ko: '컴포넌트가 가입 양식으로 바뀝니다. 같은 세 가지 방식에 이름 입력란이 추가됩니다. 미리보기는 여기서 멈춥니다.',
    ja: 'コンポーネントが新規登録フォームに切り替わります。同じ3つの方法に、名前の入力欄が加わります。プレビューはここで止まります。',
  },
} satisfies Record<string, Tri>;

interface Req {
  method: 'GET' | 'POST';
  path: string;
  /** An HTTP status, or (as words) the moment the request will be made. */
  status: string | Tri;
  rows: Array<[string, string | Tri]>;
}

const ENVIRONMENT: Req = {
  method: 'GET',
  path: '/v1/environment',
  status: '200',
  rows: [['methods', 'passkey, google, email_code'], ['sso', 'match-domain']],
};

// The component asks for passkey options when it loads, so the browser can offer a saved passkey.
const PASSKEY_OPTIONS: Req = {
  method: 'POST',
  path: '/v1/passkeys/options',
  status: '200',
  rows: [['rp_id', 'tally.app'], ['credentials', STAGE.thisDevice]],
};

function requestsFor(action: Action, read: ReadEmail): Req[] {
  const base = [ENVIRONMENT, PASSKEY_OPTIONS];
  if (action === 'passkey') {
    return [...base, { method: 'POST', path: '/v1/sign_ins', status: STAGE.afterPrompt, rows: [['strategy', 'passkey'], ['assertion', STAGE.fromPrompt]] }];
  }
  if (action === 'google') {
    return [...base, { method: 'GET', path: '/v1/oauth/google/start', status: '302', rows: [['redirect', 'accounts.google.com'], ['return_to', '/invoices']] }];
  }
  if (action === 'signup') {
    return [...base, { method: 'POST', path: '/v1/sign_ups', status: STAGE.onContinue, rows: [['methods', 'passkey, google, email_code'], ['fields', 'email, name']] }];
  }
  const sent = action === 'continue';
  if (read.kind === 'sso') {
    const sso = SSO[read.domain];
    return [
      ...base,
      { method: 'POST', path: '/v1/sign_ins', status: '200', rows: [['identifier', read.email], ['strategy', 'saml'], ['connection', sso.connection]] },
      { method: 'GET', path: '/v1/sso/start', status: sent ? '302' : STAGE.onContinue, rows: [['redirect', sso.host], ['return_to', '/invoices']] },
    ];
  }
  if (read.kind === 'code') {
    return [
      ...base,
      { method: 'POST', path: '/v1/sign_ins', status: '200', rows: [['identifier', read.email], ['strategy', 'email_code']] },
      { method: 'POST', path: '/v1/sign_ins/si_2Nw8/prepare', status: sent ? '200' : STAGE.onContinue, rows: [['strategy', 'email_code'], ['sends_to', read.email]] },
    ];
  }
  return [...base, { method: 'POST', path: '/v1/sign_ins', status: STAGE.onContinue, rows: [['identifier', STAGE.waitingEmail]] }];
}

// ---------------------------------------------------------------------------------------
// The code that renders the preview, in four frameworks

type Framework = 'react' | 'next' | 'vue' | 'swift';
/** Keyword, tag or type, function, attribute, string, comment. */
type TokenClass = 'k' | 't' | 'f' | 'a' | 's' | 'c';
type Token = string | [TokenClass, string];
interface Line {
  indent: number;
  tokens: Token[];
}

const line = (indent: number, ...tokens: Token[]): Line => ({ indent, tokens });

const FRAMEWORKS: Array<{ id: Framework; name: string; code: (appearance: Appearance) => Line[] }> = [
  {
    id: 'react',
    name: 'React',
    code: (appearance) => [
      line(0, ['k', 'import'], ' { KeyholeProvider, SignIn } ', ['k', 'from'], ' ', ['s', "'@keyhole/react'"], ';'),
      line(0),
      line(0, ['k', 'export default function'], ' ', ['f', 'SignInPage'], '() {'),
      line(1, ['k', 'return'], ' ('),
      line(2, '<', ['t', 'KeyholeProvider'], ' ', ['a', 'publishableKey'], '={process.env.KEYHOLE_KEY}>'),
      line(3, '<', ['t', 'SignIn']),
      line(4, ['a', 'methods'], '={[', ['s', "'passkey'"], ', ', ['s', "'google'"], ', ', ['s', "'email_code'"], ']}'),
      line(4, ['a', 'sso'], '=', ['s', '"match-domain"']),
      line(4, ['a', 'appearance'], '=', ['s', `"${appearance}"`]),
      line(4, ['a', 'afterSignIn'], '=', ['s', '"/invoices"']),
      line(3, '/>'),
      line(2, '</', ['t', 'KeyholeProvider'], '>'),
      line(1, ');'),
      line(0, '}'),
    ],
  },
  {
    id: 'next',
    name: 'Next.js',
    code: (appearance) => [
      line(0, ['c', '// app/sign-in/page.tsx']),
      line(0, ['k', 'import'], ' { SignIn } ', ['k', 'from'], ' ', ['s', "'@keyhole/nextjs'"], ';'),
      line(0),
      line(0, ['k', 'export default function'], ' ', ['f', 'Page'], '() {'),
      line(1, ['k', 'return'], ' ('),
      line(2, '<', ['t', 'SignIn']),
      line(3, ['a', 'methods'], '={[', ['s', "'passkey'"], ', ', ['s', "'google'"], ', ', ['s', "'email_code'"], ']}'),
      line(3, ['a', 'sso'], '=', ['s', '"match-domain"']),
      line(3, ['a', 'appearance'], '=', ['s', `"${appearance}"`]),
      line(3, ['a', 'afterSignIn'], '=', ['s', '"/invoices"']),
      line(2, '/>'),
      line(1, ');'),
      line(0, '}'),
    ],
  },
  {
    id: 'vue',
    name: 'Vue',
    code: (appearance) => [
      line(0, '<', ['t', 'script'], ' ', ['a', 'setup'], '>'),
      line(0, ['k', 'import'], ' { SignIn } ', ['k', 'from'], ' ', ['s', "'@keyhole/vue'"], ';'),
      line(0, '</', ['t', 'script'], '>'),
      line(0),
      line(0, '<', ['t', 'template'], '>'),
      line(1, '<', ['t', 'SignIn']),
      line(2, ['a', ':methods'], '=', ['s', `"['passkey', 'google', 'email_code']"`]),
      line(2, ['a', 'sso'], '=', ['s', '"match-domain"']),
      line(2, ['a', 'appearance'], '=', ['s', `"${appearance}"`]),
      line(2, ['a', 'after-sign-in'], '=', ['s', '"/invoices"']),
      line(1, '/>'),
      line(0, '</', ['t', 'template'], '>'),
    ],
  },
  {
    id: 'swift',
    name: 'Swift',
    code: (appearance) => [
      line(0, ['k', 'import'], ' SwiftUI'),
      line(0, ['k', 'import'], ' Keyhole'),
      line(0),
      line(0, ['k', 'struct'], ' ', ['t', 'SignInScreen'], ': ', ['t', 'View'], ' {'),
      line(1, ['k', 'var'], ' body: ', ['k', 'some'], ' ', ['t', 'View'], ' {'),
      line(2, ['f', 'SignInView'], '('),
      line(3, ['a', 'methods'], ': [.passkey, .google, .emailCode],'),
      line(3, ['a', 'sso'], ': .matchDomain,'),
      line(3, ['a', 'appearance'], `: .${appearance},`),
      line(3, ['a', 'afterSignIn'], ': ', ['s', '"/invoices"']),
      line(2, ')'),
      line(1, '}'),
      line(0, '}'),
    ],
  },
];

const codeText = (lines: Line[]) =>
  lines.map((item) => '  '.repeat(item.indent) + item.tokens.map((token) => (typeof token === 'string' ? token : token[1])).join('')).join('\n');

const CODE = {
  frameworks: { en: 'Framework', ko: '프레임워크', ja: 'フレームワーク' },
} satisfies Record<string, Tri>;

// ---------------------------------------------------------------------------------------
// Sections

const WHAT = {
  title: { en: 'What Keyhole runs for you', ko: 'Keyhole이 대신 처리하는 기능', ja: 'Keyholeが代わりに処理する機能' },
  refs: { en: 'In the code', ko: '코드에서 쓰는 곳', ja: 'コードでの使用箇所' },
  rows: [
    {
      name: { en: 'Sign-in', ko: '로그인', ja: 'サインイン' },
      body: {
        en: 'Passkeys, email codes, passwords, Google, GitHub and Apple, plus SAML or OIDC single sign-on for customers who use their company login. Switch a method on in the dashboard and the component shows it on the next page load.',
        ko: '패스키, 이메일 코드, 비밀번호, Google, GitHub, Apple과 함께, 회사 로그인을 쓰는 고객을 위한 SAML 또는 OIDC 싱글 사인온을 지원합니다. 대시보드에서 방식을 켜면 다음 페이지를 불러올 때 컴포넌트에 표시됩니다.',
        ja: 'パスキー、メールのコード、パスワード、Google、GitHub、Apple、そして会社のログインを使う顧客向けのSAMLまたはOIDCによるシングルサインオンに対応しています。ダッシュボードで方式を有効にすると、次のページ読み込み時にコンポーネントに表示されます。',
      },
      refs: ['<SignIn />', 'POST /v1/sign_ins'],
    },
    {
      name: { en: 'Sessions', ko: '세션', ja: 'セッション' },
      body: {
        en: "Short-lived tokens, refreshed in the background and signed with keys you can rotate without signing anyone out. One call ends a user's sessions on every device, for example after a password change.",
        ko: '수명이 짧은 토큰을 백그라운드에서 갱신하고, 사용자를 로그아웃시키지 않고 교체할 수 있는 키로 서명합니다. API 호출 한 번으로 모든 기기에서 사용자의 세션을 끝낼 수 있습니다. 예를 들어 비밀번호를 바꾼 뒤에 쓸 수 있습니다.',
        ja: '有効期間の短いトークンをバックグラウンドで更新し、ユーザーをサインアウトさせずに交換できるキーで署名します。1回の呼び出しで、すべての端末にあるユーザーのセッションを終了できます。たとえばパスワード変更後などに使えます。',
      },
      refs: ['<SignedIn>', 'sessions.revoke(userId)'],
    },
    {
      name: { en: 'Users', ko: '사용자', ja: 'ユーザー' },
      body: {
        en: "A user list your support team can search by email, name or ID, with each person's sign-in history and linked accounts. Organisations, roles and invitations for apps that sell to companies.",
        ko: '지원팀이 이메일, 이름 또는 ID로 검색할 수 있는 사용자 목록입니다. 각 사용자의 로그인 기록과 연결된 계정을 함께 볼 수 있습니다. 기업에 판매하는 앱을 위한 조직, 역할, 초대 기능도 있습니다.',
        ja: 'サポートチームがメールアドレス、名前、IDで検索できるユーザー一覧です。各ユーザーのサインイン履歴と連携アカウントを表示します。法人向けに販売するアプリのための組織、役割、招待機能もあります。',
      },
      refs: ['<UserButton />', 'GET /v1/users'],
    },
  ],
};

interface Band {
  upTo: number;
  range: Tri;
  per: Tri;
  example: Tri;
}

const BANDS: Band[] = [
  {
    upTo: 10_000,
    range: { en: 'First 10,000', ko: '처음 10,000명', ja: '最初の10,000人' },
    per: { en: 'Free', ko: '무료', ja: '無料' },
    example: { en: '6,500 users cost $0', ko: '사용자 6,500명 요금은 $0', ja: 'ユーザー6,500人は$0' },
  },
  {
    upTo: 100_000,
    range: { en: '10,001 to 100,000', ko: '10,001명에서 100,000명', ja: '10,001人から100,000人' },
    per: { en: '$0.020', ko: '$0.020', ja: '$0.020' },
    example: { en: '60,000 users cost $1,000', ko: '사용자 60,000명 요금은 $1,000', ja: 'ユーザー60,000人は$1,000' },
  },
  {
    upTo: 1_000_000,
    range: { en: '100,001 to 1 million', ko: '100,001명에서 100만 명', ja: '100,001人から100万人' },
    per: { en: '$0.012', ko: '$0.012', ja: '$0.012' },
    example: { en: '250,000 users cost $3,600', ko: '사용자 250,000명 요금은 $3,600', ja: 'ユーザー250,000人は$3,600' },
  },
  {
    upTo: Infinity,
    range: { en: 'Over 1 million', ko: '100만 명 초과', ja: '100万人超' },
    per: { en: 'By contract', ko: '계약 기준', ja: '契約ベース' },
    example: { en: 'Annual terms and invoicing', ko: '연간 계약 조건과 청구서 발행', ja: '年間契約と請求書発行' },
  },
];

const PRICING = {
  title: { en: 'Pricing by monthly active users', ko: '월간 활성 사용자 수 기준 요금', ja: '月間アクティブユーザー数による料金' },
  intro: {
    en: 'A user counts once in a calendar month, the first time they sign in. Every sign-in method, every component and unlimited SSO connections come with every band.',
    ko: '사용자는 달력상 한 달 안에서 처음 로그인할 때 한 번 집계됩니다. 모든 구간에 모든 로그인 방식, 모든 컴포넌트, 무제한 SSO 연결이 포함됩니다.',
    ja: 'ユーザーは暦月の中で初めてサインインした時点で1回と数えます。すべての区分に、すべてのサインイン方法、すべてのコンポーネント、無制限のSSO接続が含まれます。',
  },
  label: { en: 'Monthly active users', ko: '월간 활성 사용자 수', ja: '月間アクティブユーザー数' },
  error: { en: 'Enter a whole number of users, like 42,000.', ko: '정수로 입력하세요. 예: 42,000', ja: '整数で入力してください。例：42,000' },
  perMonth: { en: 'per month', ko: '/월', ja: '/月' },
  contract: { en: 'By contract', ko: '계약 기준', ja: '契約ベース' },
  howFree: { en: 'All {n} users fall inside the free 10,000.', ko: '사용자 {n}명 모두 무료 구간인 10,000명 안에 듭니다.', ja: 'ユーザー{n}人は全員、無料の10,000人以内に収まります。' },
  howGrowth: { en: '{over} users above the free 10,000, at $0.020 each.', ko: '무료 10,000명을 넘는 {over}명에게 1명당 $0.020이 적용됩니다.', ja: '無料の10,000人を超える{over}人に、1人あたり$0.020が適用されます。' },
  howScale: {
    en: '90,000 users at $0.020 and {over} at $0.012, above the free 10,000.',
    ko: '무료 10,000명을 넘는 사용자 중 90,000명에게는 $0.020, {over}명에게는 $0.012가 적용됩니다.',
    ja: '無料の10,000人を超えるユーザーのうち、90,000人には$0.020、{over}人には$0.012が適用されます。',
  },
  howContract: {
    en: 'Above 1 million monthly active users we agree annual terms and send an invoice.',
    ko: '월간 활성 사용자가 100만 명을 넘으면 연간 계약 조건을 정하고 청구서를 보내 드립니다.',
    ja: '月間アクティブユーザーが100万人を超える場合は、年間契約の条件を取り決め、請求書をお送りします。',
  },
  said: { en: '{n} users: {price} per month.', ko: '사용자 {n}명: 월 {price}', ja: 'ユーザー{n}人: 月額{price}' },
  saidContract: { en: '{n} users: priced by contract.', ko: '사용자 {n}명: 계약 기준 요금', ja: 'ユーザー{n}人: 契約ベースの料金' },
  colRange: { en: 'Monthly active users', ko: '월간 활성 사용자 수', ja: '月間アクティブユーザー数' },
  colPer: { en: 'Per user', ko: '사용자당', ja: 'ユーザー1人あたり' },
  colExample: { en: 'For example', ko: '예시', ja: '例' },
  yours: { en: '(your band)', ko: '(내 구간)', ja: '(あなたの区分)' },
  fine: {
    en: 'Development projects are free up to 500 users. Prices are in US dollars and exclude VAT and sales tax.',
    ko: '개발용 프로젝트는 사용자 500명까지 무료입니다. 가격은 미국 달러 기준이며, 부가가치세와 판매세는 포함되지 않습니다.',
    ja: '開発用プロジェクトは500人まで無料です。価格は米ドル建てで、付加価値税と売上税は含まれません。',
  },
} satisfies Record<string, Tri>;

const number = (value: number) => value.toLocaleString('en-US');

function quote(users: number) {
  const band = BANDS.findIndex((item) => users <= item.upTo);
  // Tenths of a cent, so $0.012 a user never meets a rounding error.
  const tenths = band === 0 ? 0 : band === 1 ? (users - 10_000) * 20 : band === 2 ? 1_800_000 + (users - 100_000) * 12 : null;
  if (tenths === null) return { band, price: null };
  const dollars = tenths / 1000;
  const digits = Number.isInteger(dollars) ? 0 : 2;
  return { band, price: `$${dollars.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}` };
}

const REGIONS = {
  title: { en: "Where your users' data is kept", ko: '사용자 데이터가 보관되는 곳', ja: 'ユーザーデータの保管場所' },
  intro: {
    en: 'You pick a region when you create a project. User records, sessions and sign-in logs stay there, and backups go to a second site under the same law.',
    ko: '프로젝트를 만들 때 리전을 고릅니다. 사용자 기록, 세션, 로그인 기록은 그 리전에 머물며, 백업은 같은 법의 적용을 받는 두 번째 사이트로 보내집니다.',
    ja: 'プロジェクトを作成するときにリージョンを選びます。ユーザーの記録、セッション、サインイン履歴はそのリージョンに保管され、バックアップは同じ法律のもとにある2つ目の拠点に保存されます。',
  },
  colRegion: { en: 'Region', ko: '리전', ja: 'リージョン' },
  colStored: { en: 'Stored in', ko: '보관 위치', ja: '保管先' },
  colBackups: { en: 'Backups in', ko: '백업 위치', ja: 'バックアップ先' },
  colCert: { en: 'Local certification', ko: '현지 인증', ja: '現地認証' },
  fine: {
    en: "Every region is covered by **SOC 2 Type II**, for September 2025 to August 2026, and **ISO/IEC 27001:2022**. You sign the GDPR data processing agreement in the dashboard, and we give 30 days' notice before adding a subprocessor.",
    ko: "모든 리전은 2025년 9월부터 2026년 8월까지의 **SOC 2 Type II**와 **ISO/IEC 27001:2022**의 적용을 받습니다. 대시보드에서 GDPR 데이터 처리 계약에 서명할 수 있으며, 하위 처리자를 추가하기 30일 전에 알려 드립니다.",
    ja: "すべてのリージョンは、2025年9月から2026年8月までの**SOC 2 Type II**と**ISO/IEC 27001:2022**の対象です。ダッシュボードでGDPRのデータ処理契約に署名でき、復処理者を追加する場合は30日前にお知らせします。",
  },
  rows: [
    {
      region: { en: 'European Union', ko: '유럽연합', ja: '欧州連合' },
      stored: { en: 'Frankfurt', ko: '프랑크푸르트', ja: 'フランクフルト' },
      backups: { en: 'Dublin', ko: '더블린', ja: 'ダブリン' },
      cert: { en: 'BSI C5', ko: 'BSI C5', ja: 'BSI C5' },
      added: null as Tri | null,
    },
    {
      region: { en: 'United States', ko: '미국', ja: 'アメリカ' },
      stored: { en: 'Northern Virginia', ko: '북버지니아', ja: '北バージニア' },
      backups: { en: 'Oregon', ko: '오리건', ja: 'オレゴン' },
      cert: { en: 'HIPAA, with a signed BAA', ko: 'HIPAA, 서명된 BAA 포함', ja: 'HIPAA、BAA署名済み' },
      added: null,
    },
    {
      region: { en: 'United Kingdom', ko: '영국', ja: 'イギリス' },
      stored: { en: 'London', ko: '런던', ja: 'ロンドン' },
      backups: { en: 'Manchester', ko: '맨체스터', ja: 'マンチェスター' },
      cert: { en: 'Cyber Essentials Plus', ko: 'Cyber Essentials Plus', ja: 'Cyber Essentials Plus' },
      added: null,
    },
    {
      region: { en: 'Australia', ko: '호주', ja: 'オーストラリア' },
      stored: { en: 'Sydney', ko: '시드니', ja: 'シドニー' },
      backups: { en: 'Melbourne', ko: '멜버른', ja: 'メルボルン' },
      cert: { en: 'IRAP assessed', ko: 'IRAP 평가 완료', ja: 'IRAP評価済み' },
      added: null,
    },
    {
      region: { en: 'Japan', ko: '일본', ja: '日本' },
      stored: { en: 'Tokyo', ko: '도쿄', ja: '東京' },
      backups: { en: 'Osaka', ko: '오사카', ja: '大阪' },
      cert: { en: 'ISMAP', ko: 'ISMAP', ja: 'ISMAP' },
      added: { en: 'Added 29 October 2026', ko: '2026년 10월 29일 추가', ja: '2026年10月29日追加' },
    },
  ],
};

const LOG = {
  title: { en: 'Changelog', ko: '변경 기록', ja: '変更履歴' },
  entries: [
    {
      date: '2026-11-18',
      when: { en: '18 Nov 2026', ko: '2026년 11월 18일', ja: '2026年11月18日' },
      tag: 'react 4.12.0',
      title: { en: 'Passkeys inside Android webviews', ko: '안드로이드 웹뷰 안의 패스키', ja: 'Android WebView内のパスキー' },
      body: {
        en: 'Passkey sign-in now works in embedded webviews on Android 14 and later. On older versions the component offers an email code instead.',
        ko: '패스키 로그인이 이제 Android 14 이상의 내장 웹뷰에서 작동합니다. 이전 버전에서는 컴포넌트가 대신 이메일 코드를 제공합니다.',
        ja: 'パスキーでのサインインが、Android 14以降の組み込みWebViewで動作するようになりました。それより古いバージョンでは、コンポーネントが代わりにメールのコードを提供します。',
      },
    },
    {
      date: '2026-11-11',
      when: { en: '11 Nov 2026', ko: '2026년 11월 11일', ja: '2026年11月11日' },
      tag: 'API 2026-11-11',
      title: { en: 'Find accounts nobody uses', ko: '아무도 쓰지 않는 계정 찾기', ja: '使われていないアカウントを探す' },
      body: {
        en: '`GET /v1/users` accepts `last_sign_in_before`, so you can list accounts that have not signed in for a year.',
        ko: '`GET /v1/users`는 `last_sign_in_before`를 받으므로, 1년 넘게 로그인하지 않은 계정을 목록으로 볼 수 있습니다.',
        ja: '`GET /v1/users`は`last_sign_in_before`を受け付けるため、1年以上サインインしていないアカウントを一覧で確認できます。',
      },
    },
    {
      date: '2026-11-04',
      when: { en: '4 Nov 2026', ko: '2026년 11월 4일', ja: '2026年11月4日' },
      tag: 'Dashboard',
      title: { en: 'Failed attempts on the user page', ko: '사용자 페이지의 실패한 로그인 시도', ja: 'ユーザーページの失敗したサインイン試行' },
      body: {
        en: 'Support staff can open a user and see their last 50 sign-in attempts, with the reason each one failed.',
        ko: '지원 담당자는 사용자를 열어 최근 로그인 시도 50건과 각 시도가 실패한 이유를 볼 수 있습니다.',
        ja: 'サポート担当者はユーザーを開いて、直近50回のサインイン試行と、それぞれが失敗した理由を確認できます。',
      },
    },
    {
      date: '2026-10-29',
      when: { en: '29 Oct 2026', ko: '2026년 10월 29일', ja: '2026年10月29日' },
      tag: 'Regions',
      title: { en: 'Tokyo region', ko: '도쿄 리전', ja: '東京リージョン' },
      body: {
        en: 'New projects can keep user data in Tokyo, with backups in Osaka.',
        ko: '새 프로젝트는 사용자 데이터를 도쿄에 보관하고, 백업은 오사카에 둘 수 있습니다.',
        ja: '新しいプロジェクトでは、ユーザーデータを東京に保管し、バックアップを大阪に置くことができます。',
      },
    },
  ],
};

const INDEX = {
  label: { en: 'On this page', ko: '이 페이지 목차', ja: 'このページの目次' },
  items: [
    { id: 'kh-component', name: { en: 'Sign-in component', ko: '로그인 컴포넌트', ja: 'サインインコンポーネント' } },
    { id: 'kh-what', name: { en: 'What it does', ko: '기능 소개', ja: '機能紹介' } },
    { id: 'kh-pricing', name: { en: 'Pricing', ko: '요금', ja: '料金' } },
    { id: 'kh-regions', name: { en: 'Data regions', ko: '데이터 리전', ja: 'データの保存先' } },
    { id: 'kh-changelog', name: { en: 'Changelog', ko: '변경 기록', ja: '変更履歴' } },
  ],
};

const FOOT = {
  nav: { en: 'Footer', ko: '바닥글', ja: 'フッター' },
  company: { en: 'Keyhole Ltd, London', ko: 'Keyhole Ltd, London', ja: 'Keyhole Ltd, London' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Platform Core style: a near-black product page with ruled structure, warm off-white type and one light sign-in widget on it, so the dark page and the light appearance share one screen.

Pick a believable developer product whose first screen can show the thing itself working, such as a hosted sign-in service, a payments form or a file uploader, and write its real content. The page must read as that product's page, never as a page about its own style. Here it is Keyhole, a hosted sign-in and user-account service: its drop-in sign-in component working as a live preview, the requests it makes, the code that renders it, what the service runs, pricing by monthly active users, data regions and the changelog.

TOKENS:
--bg: #101010
--surface: #151515 (opaque; panes, the calculator field and any menu that opens over the page)
--raise: #1b1b1b (hover behind the Copy buttons)
--ink: #f4f4f4
--muted: #a3a3a3
--dim: #808080 (line numbers, code comments, changelog tags)
--soft: #cfcfcf (request values, region cells)
--line: rgba(255,255,255,0.24)
--line-strong: rgba(255,255,255,0.44)
--accent: #f3f1ec, --accent-ink: #121212
--wash: rgba(243,241,236,0.075) (the lit pricing band)
--ok: #d9ddd1 (HTTP status codes)
--error: #ff8f85
Widget, light: #ffffff paper, #171717 ink, #5c5c5c muted, #bcbcbc dividers, #8f8f8f control edges, #b3261e error, #fafafa text on the ink button.
Widget, dark: #1c1c1c, #f4f4f4, #a8a8a8, #4d4d4d, #707070, #ff8f85, #171717, with a 1px --line edge.
Code: plain #c4c4c4, keywords #8c8c8c, attributes #a9a9a9, strings #e8dfcc, tags and function names in --ink.

COLOUR:
- Greys, warmed only in the off-white accent and the code strings; never a hue. The accent fills the keyhole mark, the one solid button, the pressed appearance, the selected tab's underline, the current page-index rule, the lit band's 3px edge, the newest changelog marker and the focus ring (inside the widget the ring is the widget's ink).
- Structural lines are 1px at 0.24; frames, table heads and control outlines use 0.44. The preview stage is a field of 1px dots at rgba(255,255,255,0.13) every 18px.
- No other colours: hovers change text to --ink, a widget button's edge to its ink, or a Copy button's ground to --raise.

TYPOGRAPHY:
Two families. Figtree (400 to 700) sets everything people read, from the headline to the labels inside the widget. Roboto Mono (400 and 500) carries the developer half: code, endpoints, request fields, table heads, dates and versions.
H1: Figtree 500, clamp(2.25rem, 4.7vw, 3.875rem), line-height 1.04, letter-spacing -0.03em, max 15em wide.
H2: Figtree 600, clamp(1.75rem, 3vw, 2.5rem), line-height 1.1, letter-spacing -0.02em.
Row names 600 at 1.625rem; changelog titles 600 at 1.1875rem; the wordmark 600 at 1.3125rem, -0.025em.
Lede 1.1875rem, line-height 1.55 (1.0625rem on phones). Body 1.0625rem, line-height 1.6. Notes and controls 1rem.
Figures: the calculator result 600 at 3rem, -0.035em; per-user prices 600 at 1.375rem; the calculator field 500 at 1.375rem; all tabular.
Widget: title 600 at 1.3125rem, text and buttons 1rem, labels 600.
Mono: code 0.9375rem, line-height 1.75; requests 0.9375rem (method and path at 500); table heads, references and dates 0.9375rem.
No text under 0.9375rem; prose, labels and controls are 1rem or more. No all-caps tracked labels.

LAYOUT:
- A 1120px column. The product bar: wordmark with a two-shape keyhole mark, four in-page links, one solid "Start building" button, on a 1px rule.
- Desktop (1100px and up): the hero is 12 columns. The headline, the lede, the install command and the free-tier line take seven; the preview stage with the live widget takes five, so the headline and the whole widget sit on the first screen of a 1280x800 laptop. Under both, one frame holds the requests (four columns) and the code (eight).
- 900 to 1099px: the headline above one framed example: the stage and a 344px requests pane side by side, the code under both. Below 900px the three panes stack in that frame.
- Below the hero, the sections sit in a main column with a 232px sticky page index 72px to its right; the index's current item has a 2px accent rule. Sections are ruled at the top, 72px over and 80px under (56px and 64px on phones).
- Footer: the wordmark, the same four links, the company line, on a 1px rule.

COMPONENTS:
- Sign-in preview: a pane bar (Preview, and a Light/Dark switch of two aria-pressed buttons) over the dotted stage. The widget is 384px wide at most: logo tile and "Sign in to Tally", "New to Tally? Create an account", "Continue with a passkey", "Continue with Google", an "or" rule, the email field with a hint line, and the primary button. It works: an address at a company domain with single sign-on (haldenstudio.com) shows "haldenstudio.com signs in through Okta" and the button turns to "Continue with Okta"; any other address shows the emailed-code path; an incomplete address on Continue shows an error under the field. Passkey, Google, Create an account and Continue change what the requests pane shows next, and the pressed button reads what is happening ("Waiting for your passkey", "Opening Google", "Opening Okta"). Dark changes only the widget's colours and the code's appearance value.
- Requests: an ordered list of the calls the widget made, each with its method and path, its status (or when it will be sent, in --muted) and its fields as a two-column list, then one sentence on what happens next. "Start over" puts the preview back.
- Code: tabs for React, Next.js, Vue and Swift (tab pattern: arrow keys, Home and End, one panel), a Copy button that says "Copied", and numbered lines that wrap under their own indent instead of scrolling.
- Three ruled rows (Sign-in, Sessions, Users): name, paragraph, two code references.
- Pricing: a monthly-active-users field that recomputes the price and its working as you type and lights the matching band in the table below; a non-number shows an error under the field.
- Data regions: a table, stacked rows with labels on phones; the newest region carries the date it was added.
- Changelog: dates and versions in mono on the left of a 1px rail with square markers; the newest marker is filled.
- Radius: 12px on the example frames and the widget; 8px on buttons, fields, the switch and the install box; 6px on Copy, 5px inside the switch, 7px on the widget's logo tile. No shadows.

MOTION:
- 160ms colour and border changes on hover. Nothing moves on its own. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Cards, card grids, pills, chips, badges, glass panels, glows, gradients, shadows
- A small label above a heading, all-caps tracked labels, numbered section markers
- Logo walls, testimonial quotes, stat counters, dashboard screenshots, browser-window chrome
- A hue for the accent, a second accent, colour-coded status dots
- Illustrations, photographs, emoji, arrows on links, middle-dot meta strings
- Copy about the design, darkness, calm or polish

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a form for the widget, an ordered list for the requests, a tablist with one tabpanel for the code, tables with explicit roles for pricing and regions, an ordered list for the changelog
3) A working widget (domain detection, error, the four actions), Light/Dark, tabs, Copy, the calculator with its lit band, the page index that follows the reading position
4) Responsive layout down to 320px with no horizontal scroll; tables become stacked rows on phones; every control at least 44px tall up to 480px
5) Visible focus on every control, a polite live region for what the reader caused, reduced-motion support`;

const PROMPT_KO = `Platform Core 스타일의 실제 페이지 하나를 디자인한다. 구분선으로 짜인 거의 검은 제품 페이지에 따뜻한 오프화이트 텍스트를 쓰고, 그 위에 밝은 로그인 위젯 하나를 올린다. 어두운 페이지와 밝은 외관이 한 화면을 공유한다.

그럴듯한 개발자 제품을 고르고, 첫 화면에서 제품 자체가 작동하는 모습을 보여 줄 수 있게 하며, 실제 내용을 쓴다. 예: 호스팅 로그인 서비스, 결제 양식, 파일 업로더. 페이지는 그 제품의 페이지로 읽혀야 하며, 자기 스타일에 관한 페이지처럼 읽혀서는 안 된다. 여기서는 호스팅 로그인 및 사용자 계정 서비스인 Keyhole이다. 실시간 미리보기로 동작하는 드롭인 로그인 컴포넌트, 컴포넌트가 보내는 요청, 그것을 렌더링하는 코드, 서비스가 제공하는 기능, 월간 활성 사용자 수 기준 요금, 데이터 리전, 변경 기록을 담는다.

TOKENS:
--bg: #101010
--surface: #151515 (불투명. 패널, 계산기 입력란, 페이지 위에 열리는 메뉴)
--raise: #1b1b1b (복사 버튼 뒤의 호버 배경)
--ink: #f4f4f4
--muted: #a3a3a3
--dim: #808080 (줄 번호, 코드 주석, 변경 기록 태그)
--soft: #cfcfcf (요청 값, 리전 셀)
--line: rgba(255,255,255,0.24)
--line-strong: rgba(255,255,255,0.44)
--accent: #f3f1ec, --accent-ink: #121212
--wash: rgba(243,241,236,0.075) (강조된 요금 구간)
--ok: #d9ddd1 (HTTP 상태 코드)
--error: #ff8f85
위젯, 밝게: #ffffff 바탕, #171717 잉크, #5c5c5c 보조, #bcbcbc 구분선, #8f8f8f 컨트롤 테두리, #b3261e 오류, 잉크색 버튼 위 글자 #fafafa.
위젯, 다크: #1c1c1c, #f4f4f4, #a8a8a8, #4d4d4d, #707070, #ff8f85, #171717, 1px --line 테두리.
코드: 기본 #c4c4c4, 키워드 #8c8c8c, 속성 #a9a9a9, 문자열 #e8dfcc, 태그와 함수 이름은 --ink.

COLOUR:
- 회색은 오프화이트 강조색과 코드 문자열에서만 따뜻하게 하며, 색조는 넣지 않는다. 강조색은 키홀 마크, 단 하나의 채워진 버튼, 눌린 테마 버튼, 선택된 탭의 밑줄, 현재 페이지 목차의 선, 강조된 구간의 3px 가장자리, 가장 최신 변경 기록 마커, 포커스 링에 쓴다. 위젯 안에서는 포커스 링이 위젯의 잉크색이다.
- 구조선은 0.24 불투명도의 1px로 긋는다. 프레임, 표 머리글, 컨트롤 테두리는 0.44를 쓴다. 미리보기 무대는 18px 간격으로 rgba(255,255,255,0.13)의 1px 점을 깐다.
- 다른 색은 쓰지 않는다. 호버에서는 글자를 --ink로, 위젯 버튼의 테두리를 잉크색으로, 복사 버튼의 바탕을 --raise로 바꾼다.

TYPOGRAPHY:
서체는 두 가지다. Figtree(400~700)는 제목부터 위젯 안의 라벨까지 읽히는 모든 글을 맡는다. Roboto Mono(400, 500)는 개발자 영역을 맡는다: 코드, 엔드포인트, 요청 필드, 표 머리글, 날짜, 버전.
H1: Figtree 500, clamp(2.25rem, 4.7vw, 3.875rem), 줄 간격 1.04, 자간 -0.03em, 최대 너비 15em.
H2: Figtree 600, clamp(1.75rem, 3vw, 2.5rem), 줄 간격 1.1, 자간 -0.02em.
행 이름은 600, 1.625rem. 변경 기록 제목은 600, 1.1875rem. 워드마크는 600, 1.3125rem, -0.025em.
리드 문단 1.1875rem, 줄 간격 1.55(휴대폰에서는 1.0625rem). 본문 1.0625rem, 줄 간격 1.6. 주석과 컨트롤은 1rem.
숫자: 계산 결과 600, 3rem, -0.035em. 사용자당 가격 600, 1.375rem. 계산기 입력란 500, 1.375rem. 모두 표 숫자(tabular)로 설정한다.
위젯: 제목 600, 1.3125rem. 텍스트와 버튼 1rem. 라벨 600.
Mono: 코드 0.9375rem, 줄 간격 1.75. 요청 0.9375rem(메서드와 경로는 500). 표 머리글, 참조, 날짜 0.9375rem.
0.9375rem보다 작은 글자는 쓰지 않는다. 산문, 라벨, 컨트롤은 1rem 이상이다. 대문자에 자간을 넓힌 라벨은 쓰지 않는다.

LAYOUT:
- 1120px 칼럼. 제품 바: 두 도형으로 된 키홀 마크가 있는 워드마크, 페이지 안 링크 4개, 단 하나의 채워진 "시작하기" 버튼을 1px 구분선 위에 둔다.
- 데스크톱(1100px 이상): 히어로는 12칼럼이다. 제목, 리드 문단, 설치 명령, 무료 구간 안내가 7칼럼을 쓰고, 실시간 위젯이 있는 미리보기 무대가 5칼럼을 쓴다. 그래서 제목과 위젯 전체가 1280x800 노트북의 첫 화면에 들어간다. 그 아래에서는 프레임 하나가 요청(4칼럼)과 코드(8칼럼)를 담는다.
- 900~1099px: 제목 아래에 프레임 하나짜리 예제를 둔다. 무대와 344px 요청 패널을 나란히 놓고, 코드는 둘 아래에 둔다. 900px 미만에서는 그 프레임 안에서 세 패널을 세로로 쌓는다.
- 히어로 아래에서 섹션은 본문 칼럼에 놓고, 오른쪽 72px 떨어진 곳에 232px 고정 페이지 목차를 둔다. 목차의 현재 항목에는 2px 강조 선을 긋는다. 섹션 위에는 구분선을 두고, 위 72px, 아래 80px의 여백을 준다(휴대폰에서는 56px과 64px).
- 바닥글: 워드마크, 같은 링크 4개, 회사 정보 줄을 1px 구분선 위에 둔다.

COMPONENTS:
- 로그인 미리보기: 점으로 된 무대 위의 패널 막대(미리보기, 그리고 aria-pressed 버튼 두 개로 된 밝게/다크 전환). 위젯은 최대 384px 너비다. 로고 타일과 "Tally에 로그인", "Tally가 처음이신가요? 계정 만들기", "패스키로 계속하기", "Google로 계속하기", "또는" 구분선, 힌트 줄이 있는 이메일 입력란, 기본 버튼을 둔다. 동작은 다음과 같다. 싱글 사인온을 쓰는 회사 도메인(haldenstudio.com) 주소는 "haldenstudio.com 도메인은 Okta로 로그인합니다"를 보여 주고 버튼은 "Okta로 계속하기"로 바뀐다. 그 밖의 주소는 이메일 코드 경로를 보여 준다. 계속을 누른 주소가 불완전하면 입력란 아래에 오류를 보여 준다. 패스키, Google, 계정 만들기, 계속은 요청 패널이 다음에 보여 줄 내용을 바꾸고, 눌린 버튼은 진행 중인 일을 알려 준다("패스키를 기다리는 중", "Google 여는 중", "Okta 여는 중"). 다크는 위젯의 색과 코드의 appearance 값만 바꾼다.
- 요청: 위젯이 보낸 호출을 순서대로 나열한 목록이다. 각 항목에는 메서드와 경로, 상태(또는 보내질 시점, --muted 색), 필드를 두 칸짜리 목록으로 담고, 그 아래에 다음에 일어날 일을 한 문장으로 쓴다. "처음부터 다시"는 미리보기를 원래 상태로 되돌린다.
- 코드: React, Next.js, Vue, Swift 탭(탭 패턴: 화살표 키, Home, End, 패널은 하나). 복사 버튼은 "복사됨"이라고 표시한다. 줄 번호가 붙은 줄은 스크롤하지 않고 자기 들여쓰기 아래에서 줄바꿈한다.
- 구분선이 있는 행 세 개(로그인, 세션, 사용자): 이름, 문단, 코드 참조 두 개.
- 요금: 월간 활성 사용자 수 입력란. 입력하는 동안 가격과 계산 과정을 다시 계산하고, 아래 표에서 해당 구간을 강조한다. 숫자가 아닌 값은 입력란 아래에 오류로 표시한다.
- 데이터 리전: 표. 휴대폰에서는 라벨이 붙은 행을 세로로 쌓는다. 가장 최근에 추가된 리전에는 추가된 날짜를 표시한다.
- 변경 기록: 날짜와 버전은 모노 글꼴로, 1px 레일 왼쪽에 사각 마커와 함께 둔다. 가장 최신 마커는 채운다.
- 모서리 반경: 예제 프레임과 위젯 12px. 버튼, 입력란, 전환 스위치, 설치 상자 8px. 복사 버튼 6px, 스위치 안쪽 5px, 위젯 로고 타일 7px. 그림자는 쓰지 않는다.

MOTION:
- 호버 시 색과 테두리 변화는 160ms. 스스로 움직이는 것은 없다. prefers-reduced-motion에서는 전환을 없앤다.

FORBIDDEN:
- 카드, 카드 그리드, 알약 모양 버튼, 칩, 배지, 유리 패널, 글로우, 그라데이션, 그림자
- 제목 위의 작은 라벨, 자간을 넓힌 대문자 라벨, 번호가 붙은 섹션 표시
- 로고 월, 추천 인용문, 통계 카운터, 대시보드 스크린샷, 브라우저 창 틀
- 강조색의 색조, 두 번째 강조색, 색으로 구분한 상태 점
- 일러스트, 사진, 이모지, 링크의 화살표, 가운뎃점으로 이은 메타 문자열
- 디자인, 어두움, 차분함, 완성도에 관한 문구

OUTPUT:
1) 위 토큰을 담은 CSS 커스텀 속성
2) 시맨틱 HTML: 위젯은 form, 요청은 순서 목록(ol), 코드는 tablist와 tabpanel 하나, 요금과 리전은 역할을 명시한 table, 변경 기록은 ol
3) 실제로 동작하는 위젯(도메인 감지, 오류, 네 가지 동작), 밝게/다크 전환, 탭, 복사, 강조 구간이 있는 계산기, 읽는 위치를 따라가는 페이지 목차
4) 가로 스크롤 없이 320px까지 대응하는 레이아웃. 휴대폰에서 표는 세로로 쌓인 행이 된다. 480px 이하에서는 모든 컨트롤의 높이가 44px 이상이다.
5) 모든 컨트롤에 보이는 포커스, 읽는 사람의 조작 결과를 알리는 정중한 라이브 영역, reduced-motion 지원`;

const PROMPT_JA = `Platform Core スタイルの実在するページを1つデザインする。罫線で組んだほぼ黒の製品ページに、温かみのあるオフホワイトの文字を使い、その上に明るいサインインウィジェットを1つ置く。暗いページと明るい外観は同じ画面を共有する。

最初の画面で製品そのものが動く様子を見せられる、もっともらしい開発者向け製品を1つ選び、実際の内容を書く。例：ホスト型のサインインサービス、決済フォーム、ファイルアップローダー。ページはその製品のページとして読めなければならず、自分のスタイルについてのページに見えてはならない。ここではホスト型のサインインおよびユーザーアカウントのサービスであるKeyholeを使う。ライブプレビューとして動くドロップインのサインインコンポーネント、そのコンポーネントが送るリクエスト、それを描画するコード、サービスが提供する機能、月間アクティブユーザー数による料金、データリージョン、変更履歴を載せる。

TOKENS:
--bg: #101010
--surface: #151515 (不透明。パネル、計算機の入力欄、ページの上に開くメニュー)
--raise: #1b1b1b (コピーボタンの背後のホバー背景)
--ink: #f4f4f4
--muted: #a3a3a3
--dim: #808080 (行番号、コードのコメント、変更履歴のタグ)
--soft: #cfcfcf (リクエストの値、リージョンのセル)
--line: rgba(255,255,255,0.24)
--line-strong: rgba(255,255,255,0.44)
--accent: #f3f1ec, --accent-ink: #121212
--wash: rgba(243,241,236,0.075) (強調された料金区分)
--ok: #d9ddd1 (HTTPステータスコード)
--error: #ff8f85
ウィジェット、明るい: #ffffff の紙面、#171717 のインク、#5c5c5c の補助色、#bcbcbc の区切り線、#8f8f8f のコントロール枠、#b3261e のエラー、インクのボタン上の文字 #fafafa。
ウィジェット、ダーク: #1c1c1c、#f4f4f4、#a8a8a8、#4d4d4d、#707070、#ff8f85、#171717、1pxの --line の縁。
コード: 通常 #c4c4c4、キーワード #8c8c8c、属性 #a9a9a9、文字列 #e8dfcc、タグと関数名は --ink。

COLOUR:
- グレーは、オフホワイトの強調色とコードの文字列だけで暖色にし、色相は付けない。強調色は、キーホールのマーク、塗りつぶしの唯一のボタン、押された外観の切り替え、選択中のタブの下線、現在のページ目次の線、強調区分の3pxの縁、最新の変更履歴のマーカー、フォーカスリングに使う。ウィジェット内ではフォーカスリングがウィジェットのインク色になる。
- 構造線は不透明度0.24の1pxとする。枠、表の見出し、コントロールの輪郭は0.44を使う。プレビュー舞台は18pxごとに rgba(255,255,255,0.13) の1pxの点を敷き詰める。
- 他の色は使わない。ホバーでは文字を --ink に、ウィジェットのボタンの縁をインク色に、コピーボタンの地色を --raise に変える。

TYPOGRAPHY:
ファミリーは2つ。Figtree（400〜700）は、見出しからウィジェット内のラベルまで、読まれるすべての文字を組む。Roboto Mono（400と500）は開発者の領域、つまりコード、エンドポイント、リクエストのフィールド、表の見出し、日付、バージョンを担う。
H1: Figtree 500、clamp(2.25rem, 4.7vw, 3.875rem)、行間 1.04、字間 -0.03em、最大幅 15em。
H2: Figtree 600、clamp(1.75rem, 3vw, 2.5rem)、行間 1.1、字間 -0.02em。
行の名前は 600、1.625rem。変更履歴の見出しは 600、1.1875rem。ワードマークは 600、1.3125rem、-0.025em。
リード文 1.1875rem、行間 1.55（スマートフォンでは 1.0625rem）。本文 1.0625rem、行間 1.6。注記とコントロールは 1rem。
数字：計算結果は 600、3rem、-0.035em。ユーザー1人あたりの価格は 600、1.375rem。計算機の入力欄は 500、1.375rem。すべて表形式の数字（tabular）にする。
ウィジェット：見出し 600、1.3125rem。文字とボタンは 1rem。ラベルは 600。
Mono：コード 0.9375rem、行間 1.75。リクエスト 0.9375rem（メソッドとパスは 500）。表の見出し、参照、日付は 0.9375rem。
0.9375remより小さい文字は使わない。文章、ラベル、コントロールは 1rem 以上。大文字で字間を空けたラベルは使わない。

LAYOUT:
- 1120pxの列。製品バー：2つの図形からなるキーホールのマークを付けたワードマーク、ページ内リンク4つ、塗りつぶした「導入を始める」ボタン1つを、1pxの罫線の上に置く。
- デスクトップ（1100px以上）：ヒーローは12列。見出し、リード文、インストールコマンド、無料枠の案内で7列を使い、ライブウィジェットのあるプレビュー舞台で5列を使う。そのため、見出しとウィジェット全体が1280x800のノートPCの最初の画面に収まる。その下では、1つのフレームにリクエスト（4列）とコード（8列）を収める。
- 900〜1099px：見出しの下に、1つのフレームに収めた例を置く。舞台と幅344pxのリクエストパネルを並べ、コードは両方の下に置く。900px未満では、そのフレームの中で3つのパネルを縦に積む。
- ヒーローの下では、セクションを本文の列に置き、その右72pxに幅232pxの固定ページ目次を配置する。目次の現在の項目には2pxの強調線を引く。セクションの上には罫線を引き、上に72px、下に80pxの余白を取る（スマートフォンでは56pxと64px）。
- フッター：ワードマーク、同じリンク4つ、会社情報の行を、1pxの罫線の上に置く。

COMPONENTS:
- サインインのプレビュー：点を敷いた舞台の上のパネルバー（Preview と、aria-pressed の2つのボタンによる Light/Dark の切り替え）。ウィジェットの幅は最大384px。ロゴタイル、「Tallyにサインイン」「Tallyは初めてですか？アカウントを作成」「パスキーで続行」「Googleで続行」、「または」の区切り線、ヒント行付きのメールアドレス欄、主ボタンを置く。動作は次のとおり。シングルサインオンを使う会社ドメイン（haldenstudio.com）のアドレスでは「haldenstudio.comは Okta でサインインします」を表示し、ボタンは「Oktaで続行」に変わる。それ以外のアドレスではメールのコードの流れを表示する。不完全なアドレスで続行を押すと、欄の下にエラーを表示する。パスキー、Google、アカウント作成、続行は、リクエストパネルに次に表示される内容を変え、押されたボタンは進行中の処理を示す（「パスキーの確認を待っています」「Googleを開いています」「Oktaを開いています」）。ダークはウィジェットの色とコードの appearance 値だけを変える。
- リクエスト：ウィジェットが行った呼び出しを順番に並べた一覧。各項目にはメソッドとパス、ステータス（または送信される時点。--muted色）、フィールドを2列の一覧で示し、その下に次に起こることを1文で書く。「最初からやり直す」でプレビューを元に戻す。
- コード：React、Next.js、Vue、Swift のタブ（タブのパターン：矢印キー、Home、End、パネルは1つ）。コピーボタンは「コピーしました」と表示する。行番号付きの行はスクロールせず、自分のインデントの下で折り返す。
- 罫線付きの行3つ（サインイン、セッション、ユーザー）：名前、段落、コード参照2つ。
- 料金：月間アクティブユーザー数の欄。入力に合わせて料金と計算の内訳を再計算し、下の表で該当する区分を強調する。数字以外の値は欄の下にエラーを表示する。
- データの保存先：表。スマートフォンでは、ラベル付きの行を縦に積む。最も新しく追加されたリージョンには、追加日を表示する。
- 変更履歴：日付とバージョンは等幅フォントで、1pxのレールの左に四角いマーカーとともに置く。最新のマーカーは塗りつぶす。
- 角丸：例のフレームとウィジェットは12px。ボタン、入力欄、切り替え、インストールボックスは8px。コピーボタンは6px、切り替えの内側は5px、ウィジェットのロゴタイルは7px。影は使わない。

MOTION:
- ホバー時の色と枠線の変化は160ms。自動で動くものはない。prefers-reduced-motion では切り替えをなくす。

FORBIDDEN:
- カード、カードグリッド、ピル型ボタン、チップ、バッジ、ガラス調のパネル、グロー、グラデーション、影
- 見出しの上の小さなラベル、字間を空けた大文字のラベル、番号付きのセクション見出し
- ロゴの壁、推薦の言葉、数字のカウンター、ダッシュボードのスクリーンショット、ブラウザウィンドウの枠
- 強調色の色相、2つ目の強調色、色分けされた状態のドット
- イラスト、写真、絵文字、リンクの矢印、中黒（・）で区切ったメタ情報の文字列
- デザイン、暗さ、落ち着き、洗練について書いた文言

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML：ウィジェットはform、リクエストはol、コードはtablistとtabpanel 1つ、料金とリージョンは役割を明示したtable、変更履歴はol
3) 実際に動作するウィジェット（ドメイン判定、エラー、4つの操作）、Light/Dark、タブ、コピー、強調区分付きの計算機、読んでいる位置に追従するページ目次
4) 横スクロールなしで320pxまで対応するレスポンシブレイアウト。スマートフォンでは表を縦に積んだ行にする。480px以下では、すべてのコントロールの高さを44px以上にする
5) すべてのコントロールに見えるフォーカス、利用者の操作結果を伝える穏やかなライブリージョン、reduced-motionへの対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type Copied = { which: 'install' | 'code'; ok: boolean } | null;

export function PortedPlatformCorePage({ lang }: PortedStylePageProps) {
  const t = (text: Tri) => text[lang];

  // The sign-in preview
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [emailError, setEmailError] = useState(false);
  const [action, setAction] = useState<Action>(null);
  const [appearance, setAppearance] = useState<Appearance>('light');
  const emailRef = useRef<HTMLInputElement>(null);

  // The code
  const [framework, setFramework] = useState<Framework>('react');
  const [copied, setCopied] = useState<Copied>(null);
  const copyTimer = useRef(0);
  const tabRefs = useRef<Partial<Record<Framework, HTMLButtonElement | null>>>({});

  // The calculator
  const [usersText, setUsersText] = useState('42,000');
  const [users, setUsers] = useState(42_000);
  const [usersError, setUsersError] = useState(false);

  // The page index
  const [section, setSection] = useState(INDEX.items[0].id);

  // One polite live region for what the reader caused: an action in the preview, a copy,
  // a new price. The same words again get a trailing space, so they are read again.
  const [news, setNews] = useState('');
  // The step texts mark code with backticks for the visible panel; the live region reads plain words.
  const announce = useCallback((raw: string) => {
    const message = raw.replace(/`/g, '');
    setNews((last) => (last === message ? `${message}\u00a0` : message));
  }, []);

  const read = readEmail(email);
  const sso = read.kind === 'sso' ? SSO[read.domain] : null;
  const who = read.name ?? t(STAGE.theUser);
  const requests = requestsFor(action, read);
  const current = FRAMEWORKS.find((item) => item.id === framework) ?? FRAMEWORKS[0];
  const lines = current.code(appearance);
  const { band, price } = quote(users);

  const nextNote = (() => {
    if (action === 'passkey') return t(NEXT.passkey);
    if (action === 'google') return t(NEXT.google);
    if (action === 'signup') return t(NEXT.signup);
    if (sso) return fill(t(action === 'continue' ? NEXT.ssoGoing : NEXT.sso), { idp: sso.idp, host: sso.host, who });
    if (read.kind === 'code') return fill(t(action === 'continue' ? NEXT.codeSent : NEXT.code), { email: read.email });
    return t(NEXT.incomplete);
  })();

  const hint = sso ? fill(t(WIDGET.hintSso), { domain: read.domain, idp: sso.idp }) : t(read.kind === 'code' ? WIDGET.hintCode : WIDGET.hintIncomplete);

  const continueLabel = (() => {
    if (action === 'continue') return sso ? fill(t(WIDGET.busySso), { idp: sso.idp }) : t(WIDGET.busyCode);
    return sso ? fill(t(WIDGET.continueSso), { idp: sso.idp }) : t(WIDGET.continue);
  })();

  const priceNews = price === null ? fill(t(PRICING.saidContract), { n: number(users) }) : fill(t(PRICING.said), { n: number(users), price });

  // The hint under the email field follows the typing. It is read out once the way of
  // signing in has settled for a moment, not on every key.
  const kindKey = sso ? `sso:${read.domain}` : read.kind;
  const lastKind = useRef(kindKey);
  useEffect(() => {
    if (lastKind.current === kindKey) return undefined;
    const timer = window.setTimeout(() => {
      lastKind.current = kindKey;
      announce(hint);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [kindKey, hint, announce]);

  // The new price is read out once typing pauses.
  const lastUsers = useRef(users);
  useEffect(() => {
    if (lastUsers.current === users) return undefined;
    const timer = window.setTimeout(() => {
      lastUsers.current = users;
      announce(priceNews);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [users, priceNews, announce]);

  // The page index marks the section being read.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const ids = INDEX.items.map((item) => item.id);
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let active = ids[0];
      for (const id of ids) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= window.innerHeight * 0.3) active = id;
      }
      setSection(atEnd ? ids[ids.length - 1] : active);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    const timers = copyTimer;
    return () => window.clearTimeout(timers.current);
  }, []);

  const act = (next: Action) => {
    setAction(next);
    setEmailError(false);
  };

  const choose = (next: 'passkey' | 'google' | 'signup') => {
    act(next);
    announce(t(NEXT[next]));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (read.kind === 'incomplete') {
      setEmailError(true);
      emailRef.current?.focus();
      return;
    }
    act('continue');
    announce(sso ? fill(t(NEXT.ssoGoing), { idp: sso.idp, host: sso.host, who }) : fill(t(NEXT.codeSent), { email: read.email }));
  };

  const startOver = () => {
    setEmail(DEFAULT_EMAIL);
    act(null);
    // The reset is the news; the hint it brings back is not read out a second time.
    lastKind.current = `sso:${readEmail(DEFAULT_EMAIL).domain}`;
    announce(t(STAGE.resetDone));
  };

  const copy = async (which: 'install' | 'code', text: string, done: string) => {
    window.clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ which, ok: true });
      announce(done);
    } catch {
      setCopied({ which, ok: false });
      announce(t(COPY.blocked));
    }
    copyTimer.current = window.setTimeout(() => setCopied(null), 2400);
  };

  const copyLabel = (which: 'install' | 'code') => {
    if (copied?.which !== which) return t(COPY.copy);
    return t(copied.ok ? COPY.copied : COPY.failed);
  };

  // Tabs: arrow keys, Home and End move along the row and choose as they go.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = FRAMEWORKS.findIndex((item) => item.id === framework);
    const last = FRAMEWORKS.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const to = keys[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const next = FRAMEWORKS[to].id;
    setFramework(next);
    tabRefs.current[next]?.focus();
  };

  const changeUsers = (value: string) => {
    setUsersText(value);
    const digits = value.replace(/[\s,_]/g, '');
    if (!/^\d{1,10}$/.test(digits)) {
      setUsersError(true);
      return;
    }
    setUsersError(false);
    setUsers(Number(digits));
  };

  const how =
    band === 0
      ? fill(t(PRICING.howFree), { n: number(users) })
      : band === 1
        ? fill(t(PRICING.howGrowth), { over: number(users - 10_000) })
        : band === 2
          ? fill(t(PRICING.howScale), { over: number(users - 100_000) })
          : t(PRICING.howContract);

  return (
    <FusionShell
      fusionId="platform-core"
      lang={lang}
      tone="dark"
      accent="#f3f1ec"
      prev={{ href: '/pages/quiet-utility.html', label: 'Quiet Utility' }}
      next={{ href: '/pages/runtime-signal.html', label: 'Runtime Signal' }}
      prompts={PROMPTS}
    >
      <div className="kh">
        <header className="kh-bar">
          <a className="kh-mark" href="#kh-component">
            <KeyholeMark />
            Keyhole
          </a>
          <nav className="kh-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#kh-what">{t(HEAD.product)}</a>
            <a href="#kh-pricing">{t(HEAD.pricing)}</a>
            <a href="#kh-regions">{t(HEAD.regions)}</a>
            <a href="#kh-changelog">{t(HEAD.changelog)}</a>
          </nav>
          <a className="kh-btn kh-btn--solid kh-bar__start" href="#kh-install">{t(HEAD.start)}</a>
        </header>

        <section className="kh-hero" id="kh-component" aria-labelledby="kh-title">
          <div className="kh-hero__copy">
            <div>
              <h1 id="kh-title">{t(HERO.title)}</h1>
              <p className="kh-lede">{t(HERO.lede)}</p>
            </div>
            <div className="kh-hero__start">
              <div className="kh-install" id="kh-install" role="group" aria-label={t(HERO.install)}>
                <code>{INSTALL}</code>
                <button className="kh-copy" type="button" onClick={() => copy('install', INSTALL, t(COPY.doneInstall))}>
                  {copyLabel('install')}
                </button>
              </div>
              <p className="kh-free">
                {t(HERO.free)} <a href="#kh-pricing">{t(HEAD.pricing)}</a>
              </p>
            </div>
          </div>

          <div className="kh-pane kh-stage" id="kh-preview" role="group" aria-labelledby="kh-stage-label">
            <div className="kh-pane__bar">
              <span id="kh-stage-label">{t(STAGE.preview)}</span>
              <div className="kh-seg" role="group" aria-label={t(STAGE.appearance)}>
                <button type="button" aria-pressed={appearance === 'light'} onClick={() => setAppearance('light')}>{t(STAGE.light)}</button>
                <button type="button" aria-pressed={appearance === 'dark'} onClick={() => setAppearance('dark')}>{t(STAGE.dark)}</button>
              </div>
            </div>
            <div className="kh-stage__canvas">
              <form className={`kh-w${appearance === 'dark' ? ' kh-w--dark' : ''}`} aria-labelledby="kh-w-title" noValidate onSubmit={submit}>
                <div className="kh-w__head">
                  <span className="kh-w__logo" aria-hidden="true">T</span>
                  <p className="kh-w__title" id="kh-w-title">{t(WIDGET.app)}</p>
                </div>
                <p className="kh-w__sub">
                  {t(WIDGET.newHere)}{' '}
                  <button className="kh-w__link" type="button" onClick={() => choose('signup')}>{t(WIDGET.create)}</button>
                </p>
                <button className="kh-w__btn" type="button" onClick={() => choose('passkey')}>
                  {t(action === 'passkey' ? WIDGET.passkeyBusy : WIDGET.passkey)}
                </button>
                <button className="kh-w__btn" type="button" onClick={() => choose('google')}>
                  {t(action === 'google' ? WIDGET.googleBusy : WIDGET.google)}
                </button>
                <p className="kh-w__or">{t(WIDGET.or)}</p>
                <label className="kh-w__label" htmlFor="kh-email">{t(WIDGET.email)}</label>
                <input
                  className="kh-w__input"
                  id="kh-email"
                  ref={emailRef}
                  type="email"
                  autoComplete="off"
                  spellCheck={false}
                  value={email}
                  aria-invalid={emailError || undefined}
                  aria-describedby={emailError ? 'kh-email-error' : 'kh-email-hint'}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    act(null);
                  }}
                />
                {emailError ? (
                  <p className="kh-w__hint is-error" id="kh-email-error" role="alert">{t(WIDGET.error)}</p>
                ) : (
                  <p className="kh-w__hint" id="kh-email-hint">{hint}</p>
                )}
                <button className="kh-w__btn kh-w__btn--primary" type="submit">{continueLabel}</button>
              </form>
            </div>
          </div>

          <div className="kh-pane kh-reqs" role="group" aria-labelledby="kh-reqs-label">
            <div className="kh-pane__bar">
              <span id="kh-reqs-label">{t(STAGE.requests)}</span>
              <button className="kh-textbtn" type="button" onClick={startOver}>{t(STAGE.reset)}</button>
            </div>
            <ol aria-label={t(STAGE.list)}>
              {requests.map((req) => {
                const words = typeof req.status !== 'string';
                return (
                  <li key={`${req.method} ${req.path}`} className={`kh-req${words ? ' is-wait' : ''}`}>
                    <p className="kh-req__head">
                      <b>{req.method} {req.path}</b>{' '}
                      <span>{typeof req.status === 'string' ? req.status : t(req.status)}</span>
                    </p>
                    <dl>
                      {req.rows.map(([key, value]) => (
                        <div key={key}>
                          <dt>{key}</dt>
                          <dd>{typeof value === 'string' ? value : t(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ol>
            <p className="kh-reqs__next">{rich(nextNote)}</p>
          </div>

          <div className="kh-pane kh-code" id="kh-code">
            <div className="kh-pane__bar">
              <div className="kh-tabs" role="tablist" aria-label={t(CODE.frameworks)}>
                {FRAMEWORKS.map((item) => {
                  const selected = item.id === framework;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        tabRefs.current[item.id] = node;
                      }}
                      id={`kh-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="kh-code-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setFramework(item.id)}
                      onKeyDown={onTabKey}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <button className="kh-copy" type="button" onClick={() => copy('code', codeText(lines), fill(t(COPY.doneCode), { framework: current.name }))}>
                {copyLabel('code')}
              </button>
            </div>
            <pre className="kh-src" id="kh-code-panel" role="tabpanel" aria-labelledby={`kh-tab-${framework}`} tabIndex={0}>
              <code>
                {lines.map((item, index) => (
                  <span key={index} className="kh-l" style={{ '--kh-indent': item.indent } as CSSProperties}>
                    {item.tokens.map((token, part) => (typeof token === 'string' ? token : <span key={part} className={`kh-tk-${token[0]}`}>{token[1]}</span>))}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </section>

        <div className="kh-layout">
          <div>
            <section className="kh-section" id="kh-what" aria-labelledby="kh-what-title">
              <h2 id="kh-what-title">{t(WHAT.title)}</h2>
              <div className="kh-rows">
                {WHAT.rows.map((row) => (
                  <div className="kh-row" key={row.name.en}>
                    <h3>{t(row.name)}</h3>
                    <p>{t(row.body)}</p>
                    <ul className="kh-refs" aria-label={t(WHAT.refs)}>
                      {row.refs.map((ref) => (
                        <li key={ref}><code>{ref}</code></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="kh-section" id="kh-pricing" aria-labelledby="kh-pricing-title">
              <h2 id="kh-pricing-title">{t(PRICING.title)}</h2>
              <p className="kh-intro">{t(PRICING.intro)}</p>
              <div className="kh-calc">
                <div>
                  <label htmlFor="kh-mau">{t(PRICING.label)}</label>
                  <input
                    id="kh-mau"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={usersText}
                    aria-invalid={usersError || undefined}
                    aria-describedby={usersError ? 'kh-mau-error' : 'kh-calc-how'}
                    onChange={(event) => changeUsers(event.target.value)}
                    onBlur={() => {
                      if (!usersError) setUsersText(number(users));
                    }}
                  />
                  {usersError ? <p className="kh-calc__error" id="kh-mau-error" role="alert">{t(PRICING.error)}</p> : null}
                </div>
                <div>
                  <p className="kh-calc__out">
                    {price === null ? (
                      <b>{t(PRICING.contract)}</b>
                    ) : (
                      <>
                        <b>{price}</b> {t(PRICING.perMonth)}
                      </>
                    )}
                  </p>
                  <p className="kh-calc__how" id="kh-calc-how">{how}</p>
                </div>
              </div>
              <table className="kh-table kh-price" role="table" aria-labelledby="kh-pricing-title">
                <thead role="rowgroup">
                  <tr role="row">
                    <th role="columnheader" scope="col">{t(PRICING.colRange)}</th>
                    <th role="columnheader" scope="col">{t(PRICING.colPer)}</th>
                    <th role="columnheader" scope="col">{t(PRICING.colExample)}</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {BANDS.map((item, index) => (
                    <tr role="row" key={item.range.en} className={index === band ? 'is-here' : undefined}>
                      <th role="rowheader" scope="row">
                        {t(item.range)}
                        {index === band ? <span className="kh-sr"> {t(PRICING.yours)}</span> : null}
                      </th>
                      <td role="cell">{t(item.per)}</td>
                      <td role="cell">{t(item.example)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="kh-fine">{t(PRICING.fine)}</p>
            </section>

            <section className="kh-section" id="kh-regions" aria-labelledby="kh-regions-title">
              <h2 id="kh-regions-title">{t(REGIONS.title)}</h2>
              <p className="kh-intro">{t(REGIONS.intro)}</p>
              <table className="kh-table kh-regions" role="table" aria-labelledby="kh-regions-title">
                <thead role="rowgroup">
                  <tr role="row">
                    <th role="columnheader" scope="col">{t(REGIONS.colRegion)}</th>
                    <th role="columnheader" scope="col">{t(REGIONS.colStored)}</th>
                    <th role="columnheader" scope="col">{t(REGIONS.colBackups)}</th>
                    <th role="columnheader" scope="col">{t(REGIONS.colCert)}</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {REGIONS.rows.map((row) => (
                    <tr role="row" key={row.region.en}>
                      <th role="rowheader" scope="row">
                        {t(row.region)}
                        {row.added ? <span className="kh-regions__added">{t(row.added)}</span> : null}
                      </th>
                      <td role="cell" data-label={t(REGIONS.colStored)}>{t(row.stored)}</td>
                      <td role="cell" data-label={t(REGIONS.colBackups)}>{t(row.backups)}</td>
                      <td role="cell" data-label={t(REGIONS.colCert)}>{t(row.cert)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="kh-fine">{rich(t(REGIONS.fine))}</p>
            </section>

            <section className="kh-section" id="kh-changelog" aria-labelledby="kh-changelog-title">
              <h2 id="kh-changelog-title">{t(LOG.title)}</h2>
              <ol className="kh-log">
                {LOG.entries.map((entry) => (
                  <li key={entry.date}>
                    <p className="kh-log__when">
                      <time dateTime={entry.date}>{t(entry.when)}</time>
                      <span>{entry.tag}</span>
                    </p>
                    <div className="kh-log__what">
                      <h3>{t(entry.title)}</h3>
                      <p>{rich(t(entry.body))}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="kh-rail">
            <nav className="kh-index" aria-label={t(INDEX.label)}>
              {INDEX.items.map((item) => (
                <a key={item.id} href={`#${item.id}`} aria-current={section === item.id ? 'location' : undefined}>
                  {t(item.name)}
                </a>
              ))}
            </nav>
          </aside>
        </div>

        <footer className="kh-foot">
          <a className="kh-mark" href="#kh-component">
            <KeyholeMark />
            Keyhole
          </a>
          <nav aria-label={t(FOOT.nav)}>
            <a href="#kh-what">{t(HEAD.product)}</a>
            <a href="#kh-pricing">{t(HEAD.pricing)}</a>
            <a href="#kh-regions">{t(HEAD.regions)}</a>
            <a href="#kh-changelog">{t(HEAD.changelog)}</a>
          </nav>
          <p>{t(FOOT.company)}</p>
        </footer>

        <p className="kh-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
