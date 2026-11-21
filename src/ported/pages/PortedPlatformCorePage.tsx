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
  product: { en: 'Product', ko: 'Product', ja: 'Product' },
  pricing: { en: 'Pricing', ko: 'Pricing', ja: 'Pricing' },
  regions: { en: 'Data regions', ko: 'Data regions', ja: 'Data regions' },
  changelog: { en: 'Changelog', ko: 'Changelog', ja: 'Changelog' },
  start: { en: 'Start building', ko: 'Start building', ja: 'Start building' },
} satisfies Record<string, Tri>;

const HERO = {
  title: { en: 'Sign-in and user accounts for your app, in one component.', ko: 'Sign-in and user accounts for your app, in one component.', ja: 'Sign-in and user accounts for your app, in one component.' },
  lede: {
    en: 'Keyhole hosts the sign-in screens, stores your users and keeps them signed in. Drop the component into a page as it is, or call the same API from forms you build yourself.',
    ko: 'Keyhole hosts the sign-in screens, stores your users and keeps them signed in. Drop the component into a page as it is, or call the same API from forms you build yourself.',
    ja: 'Keyhole hosts the sign-in screens, stores your users and keeps them signed in. Drop the component into a page as it is, or call the same API from forms you build yourself.',
  },
  install: { en: 'Install command', ko: 'Install command', ja: 'Install command' },
  free: { en: 'The first 10,000 monthly active users are free.', ko: 'The first 10,000 monthly active users are free.', ja: 'The first 10,000 monthly active users are free.' },
} satisfies Record<string, Tri>;

const INSTALL = 'npm i @keyhole/react';

const COPY = {
  copy: { en: 'Copy', ko: 'Copy', ja: 'Copy' },
  copied: { en: 'Copied', ko: 'Copied', ja: 'Copied' },
  failed: { en: 'Not copied', ko: 'Not copied', ja: 'Not copied' },
  doneInstall: { en: 'Install command copied.', ko: 'Install command copied.', ja: 'Install command copied.' },
  doneCode: { en: '{framework} code copied.', ko: '{framework} code copied.', ja: '{framework} code copied.' },
  blocked: {
    en: 'This browser did not allow copying. Select the text and copy it yourself.',
    ko: 'This browser did not allow copying. Select the text and copy it yourself.',
    ja: 'This browser did not allow copying. Select the text and copy it yourself.',
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
  app: { en: 'Sign in to Tally', ko: 'Sign in to Tally', ja: 'Sign in to Tally' },
  newHere: { en: 'New to Tally?', ko: 'New to Tally?', ja: 'New to Tally?' },
  create: { en: 'Create an account', ko: 'Create an account', ja: 'Create an account' },
  passkey: { en: 'Continue with a passkey', ko: 'Continue with a passkey', ja: 'Continue with a passkey' },
  passkeyBusy: { en: 'Waiting for your passkey', ko: 'Waiting for your passkey', ja: 'Waiting for your passkey' },
  google: { en: 'Continue with Google', ko: 'Continue with Google', ja: 'Continue with Google' },
  googleBusy: { en: 'Opening Google', ko: 'Opening Google', ja: 'Opening Google' },
  or: { en: 'or', ko: 'or', ja: 'or' },
  email: { en: 'Email address', ko: 'Email address', ja: 'Email address' },
  hintIncomplete: {
    en: 'Company emails can sign in through their own login.',
    ko: 'Company emails can sign in through their own login.',
    ja: 'Company emails can sign in through their own login.',
  },
  hintSso: { en: '{domain} signs in through {idp}', ko: '{domain} signs in through {idp}', ja: '{domain} signs in through {idp}' },
  hintCode: { en: 'We email you a 6-digit code to sign in.', ko: 'We email you a 6-digit code to sign in.', ja: 'We email you a 6-digit code to sign in.' },
  error: { en: 'Enter an email, like name@work.com.', ko: 'Enter an email, like name@work.com.', ja: 'Enter an email, like name@work.com.' },
  continue: { en: 'Continue', ko: 'Continue', ja: 'Continue' },
  continueSso: { en: 'Continue with {idp}', ko: 'Continue with {idp}', ja: 'Continue with {idp}' },
  busySso: { en: 'Opening {idp}', ko: 'Opening {idp}', ja: 'Opening {idp}' },
  busyCode: { en: 'Sending your code', ko: 'Sending your code', ja: 'Sending your code' },
} satisfies Record<string, Tri>;

const STAGE = {
  preview: { en: 'Preview', ko: 'Preview', ja: 'Preview' },
  appearance: { en: 'Appearance', ko: 'Appearance', ja: 'Appearance' },
  light: { en: 'Light', ko: 'Light', ja: 'Light' },
  dark: { en: 'Dark', ko: 'Dark', ja: 'Dark' },
  requests: { en: 'Requests', ko: 'Requests', ja: 'Requests' },
  list: { en: 'Requests made by the component, in order', ko: 'Requests made by the component, in order', ja: 'Requests made by the component, in order' },
  reset: { en: 'Start over', ko: 'Start over', ja: 'Start over' },
  resetDone: { en: 'The preview is back where it started.', ko: 'The preview is back where it started.', ja: 'The preview is back where it started.' },
  onContinue: { en: 'on Continue', ko: 'on Continue', ja: 'on Continue' },
  afterPrompt: { en: 'after the prompt', ko: 'after the prompt', ja: 'after the prompt' },
  waitingEmail: { en: 'waiting for an email', ko: 'waiting for an email', ja: 'waiting for an email' },
  thisDevice: { en: '1 on this device', ko: '1 on this device', ja: '1 on this device' },
  fromPrompt: { en: 'from the browser prompt', ko: 'from the browser prompt', ja: 'from the browser prompt' },
  theUser: { en: 'the user', ko: 'the user', ja: 'the user' },
} satisfies Record<string, Tri>;

const NEXT = {
  incomplete: {
    en: 'Type an email address and the component works out how it signs in: a company login for domains with single sign-on, an emailed code for the rest.',
    ko: 'Type an email address and the component works out how it signs in: a company login for domains with single sign-on, an emailed code for the rest.',
    ja: 'Type an email address and the component works out how it signs in: a company login for domains with single sign-on, an emailed code for the rest.',
  },
  sso: {
    en: 'After {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
    ko: 'After {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
    ja: 'After {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
  },
  ssoGoing: {
    en: 'The browser would now open `{host}`. The preview stops here; after {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
    ko: 'The browser would now open `{host}`. The preview stops here; after {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
    ja: 'The browser would now open `{host}`. The preview stops here; after {idp}, {who} lands on `/invoices` signed in, with a session that lasts 7 days.',
  },
  code: {
    en: 'On Continue, Keyhole emails a 6-digit code to {email}. The code works for 10 minutes.',
    ko: 'On Continue, Keyhole emails a 6-digit code to {email}. The code works for 10 minutes.',
    ja: 'On Continue, Keyhole emails a 6-digit code to {email}. The code works for 10 minutes.',
  },
  codeSent: {
    en: 'A 6-digit code is on its way to {email}. The component now asks for it; the code works for 10 minutes.',
    ko: 'A 6-digit code is on its way to {email}. The component now asks for it; the code works for 10 minutes.',
    ja: 'A 6-digit code is on its way to {email}. The component now asks for it; the code works for 10 minutes.',
  },
  passkey: {
    en: 'The browser now asks for the passkey saved for `tally.app`, by Touch ID, Windows Hello or a phone. The preview stops here; in your app the user then lands on `/invoices`.',
    ko: 'The browser now asks for the passkey saved for `tally.app`, by Touch ID, Windows Hello or a phone. The preview stops here; in your app the user then lands on `/invoices`.',
    ja: 'The browser now asks for the passkey saved for `tally.app`, by Touch ID, Windows Hello or a phone. The preview stops here; in your app the user then lands on `/invoices`.',
  },
  google: {
    en: "The browser would now open Google's account picker. The preview stops here; in your app the user then lands on `/invoices`, and a first-time user gets a new account.",
    ko: "The browser would now open Google's account picker. The preview stops here; in your app the user then lands on `/invoices`, and a first-time user gets a new account.",
    ja: "The browser would now open Google's account picker. The preview stops here; in your app the user then lands on `/invoices`, and a first-time user gets a new account.",
  },
  signup: {
    en: 'The component switches to its sign-up form: the same three methods, plus a name field. The preview stops here.',
    ko: 'The component switches to its sign-up form: the same three methods, plus a name field. The preview stops here.',
    ja: 'The component switches to its sign-up form: the same three methods, plus a name field. The preview stops here.',
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
  frameworks: { en: 'Framework', ko: 'Framework', ja: 'Framework' },
} satisfies Record<string, Tri>;

// ---------------------------------------------------------------------------------------
// Sections

const WHAT = {
  title: { en: 'What Keyhole runs for you', ko: 'What Keyhole runs for you', ja: 'What Keyhole runs for you' },
  refs: { en: 'In the code', ko: 'In the code', ja: 'In the code' },
  rows: [
    {
      name: { en: 'Sign-in', ko: 'Sign-in', ja: 'Sign-in' },
      body: {
        en: 'Passkeys, email codes, passwords, Google, GitHub and Apple, plus SAML or OIDC single sign-on for customers who use their company login. Switch a method on in the dashboard and the component shows it on the next page load.',
        ko: 'Passkeys, email codes, passwords, Google, GitHub and Apple, plus SAML or OIDC single sign-on for customers who use their company login. Switch a method on in the dashboard and the component shows it on the next page load.',
        ja: 'Passkeys, email codes, passwords, Google, GitHub and Apple, plus SAML or OIDC single sign-on for customers who use their company login. Switch a method on in the dashboard and the component shows it on the next page load.',
      },
      refs: ['<SignIn />', 'POST /v1/sign_ins'],
    },
    {
      name: { en: 'Sessions', ko: 'Sessions', ja: 'Sessions' },
      body: {
        en: "Short-lived tokens, refreshed in the background and signed with keys you can rotate without signing anyone out. One call ends a user's sessions on every device, for example after a password change.",
        ko: "Short-lived tokens, refreshed in the background and signed with keys you can rotate without signing anyone out. One call ends a user's sessions on every device, for example after a password change.",
        ja: "Short-lived tokens, refreshed in the background and signed with keys you can rotate without signing anyone out. One call ends a user's sessions on every device, for example after a password change.",
      },
      refs: ['<SignedIn>', 'sessions.revoke(userId)'],
    },
    {
      name: { en: 'Users', ko: 'Users', ja: 'Users' },
      body: {
        en: "A user list your support team can search by email, name or ID, with each person's sign-in history and linked accounts. Organisations, roles and invitations for apps that sell to companies.",
        ko: "A user list your support team can search by email, name or ID, with each person's sign-in history and linked accounts. Organisations, roles and invitations for apps that sell to companies.",
        ja: "A user list your support team can search by email, name or ID, with each person's sign-in history and linked accounts. Organisations, roles and invitations for apps that sell to companies.",
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
    range: { en: 'First 10,000', ko: 'First 10,000', ja: 'First 10,000' },
    per: { en: 'Free', ko: 'Free', ja: 'Free' },
    example: { en: '6,500 users cost $0', ko: '6,500 users cost $0', ja: '6,500 users cost $0' },
  },
  {
    upTo: 100_000,
    range: { en: '10,001 to 100,000', ko: '10,001 to 100,000', ja: '10,001 to 100,000' },
    per: { en: '$0.020', ko: '$0.020', ja: '$0.020' },
    example: { en: '60,000 users cost $1,000', ko: '60,000 users cost $1,000', ja: '60,000 users cost $1,000' },
  },
  {
    upTo: 1_000_000,
    range: { en: '100,001 to 1 million', ko: '100,001 to 1 million', ja: '100,001 to 1 million' },
    per: { en: '$0.012', ko: '$0.012', ja: '$0.012' },
    example: { en: '250,000 users cost $3,600', ko: '250,000 users cost $3,600', ja: '250,000 users cost $3,600' },
  },
  {
    upTo: Infinity,
    range: { en: 'Over 1 million', ko: 'Over 1 million', ja: 'Over 1 million' },
    per: { en: 'By contract', ko: 'By contract', ja: 'By contract' },
    example: { en: 'Annual terms and invoicing', ko: 'Annual terms and invoicing', ja: 'Annual terms and invoicing' },
  },
];

const PRICING = {
  title: { en: 'Pricing by monthly active users', ko: 'Pricing by monthly active users', ja: 'Pricing by monthly active users' },
  intro: {
    en: 'A user counts once in a calendar month, the first time they sign in. Every sign-in method, every component and unlimited SSO connections come with every band.',
    ko: 'A user counts once in a calendar month, the first time they sign in. Every sign-in method, every component and unlimited SSO connections come with every band.',
    ja: 'A user counts once in a calendar month, the first time they sign in. Every sign-in method, every component and unlimited SSO connections come with every band.',
  },
  label: { en: 'Monthly active users', ko: 'Monthly active users', ja: 'Monthly active users' },
  error: { en: 'Enter a whole number of users, like 42,000.', ko: 'Enter a whole number of users, like 42,000.', ja: 'Enter a whole number of users, like 42,000.' },
  perMonth: { en: 'per month', ko: 'per month', ja: 'per month' },
  contract: { en: 'By contract', ko: 'By contract', ja: 'By contract' },
  howFree: { en: 'All {n} users fall inside the free 10,000.', ko: 'All {n} users fall inside the free 10,000.', ja: 'All {n} users fall inside the free 10,000.' },
  howGrowth: { en: '{over} users above the free 10,000, at $0.020 each.', ko: '{over} users above the free 10,000, at $0.020 each.', ja: '{over} users above the free 10,000, at $0.020 each.' },
  howScale: {
    en: '90,000 users at $0.020 and {over} at $0.012, above the free 10,000.',
    ko: '90,000 users at $0.020 and {over} at $0.012, above the free 10,000.',
    ja: '90,000 users at $0.020 and {over} at $0.012, above the free 10,000.',
  },
  howContract: {
    en: 'Above 1 million monthly active users we agree annual terms and send an invoice.',
    ko: 'Above 1 million monthly active users we agree annual terms and send an invoice.',
    ja: 'Above 1 million monthly active users we agree annual terms and send an invoice.',
  },
  said: { en: '{n} users: {price} per month.', ko: '{n} users: {price} per month.', ja: '{n} users: {price} per month.' },
  saidContract: { en: '{n} users: priced by contract.', ko: '{n} users: priced by contract.', ja: '{n} users: priced by contract.' },
  colRange: { en: 'Monthly active users', ko: 'Monthly active users', ja: 'Monthly active users' },
  colPer: { en: 'Per user', ko: 'Per user', ja: 'Per user' },
  colExample: { en: 'For example', ko: 'For example', ja: 'For example' },
  yours: { en: '(your band)', ko: '(your band)', ja: '(your band)' },
  fine: {
    en: 'Development projects are free up to 500 users. Prices are in US dollars and exclude VAT and sales tax.',
    ko: 'Development projects are free up to 500 users. Prices are in US dollars and exclude VAT and sales tax.',
    ja: 'Development projects are free up to 500 users. Prices are in US dollars and exclude VAT and sales tax.',
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
  title: { en: "Where your users' data is kept", ko: "Where your users' data is kept", ja: "Where your users' data is kept" },
  intro: {
    en: 'You pick a region when you create a project. User records, sessions and sign-in logs stay there, and backups go to a second site under the same law.',
    ko: 'You pick a region when you create a project. User records, sessions and sign-in logs stay there, and backups go to a second site under the same law.',
    ja: 'You pick a region when you create a project. User records, sessions and sign-in logs stay there, and backups go to a second site under the same law.',
  },
  colRegion: { en: 'Region', ko: 'Region', ja: 'Region' },
  colStored: { en: 'Stored in', ko: 'Stored in', ja: 'Stored in' },
  colBackups: { en: 'Backups in', ko: 'Backups in', ja: 'Backups in' },
  colCert: { en: 'Local certification', ko: 'Local certification', ja: 'Local certification' },
  fine: {
    en: "Every region is covered by **SOC 2 Type II**, for September 2025 to August 2026, and **ISO/IEC 27001:2022**. You sign the GDPR data processing agreement in the dashboard, and we give 30 days' notice before adding a subprocessor.",
    ko: "Every region is covered by **SOC 2 Type II**, for September 2025 to August 2026, and **ISO/IEC 27001:2022**. You sign the GDPR data processing agreement in the dashboard, and we give 30 days' notice before adding a subprocessor.",
    ja: "Every region is covered by **SOC 2 Type II**, for September 2025 to August 2026, and **ISO/IEC 27001:2022**. You sign the GDPR data processing agreement in the dashboard, and we give 30 days' notice before adding a subprocessor.",
  },
  rows: [
    {
      region: { en: 'European Union', ko: 'European Union', ja: 'European Union' },
      stored: { en: 'Frankfurt', ko: 'Frankfurt', ja: 'Frankfurt' },
      backups: { en: 'Dublin', ko: 'Dublin', ja: 'Dublin' },
      cert: { en: 'BSI C5', ko: 'BSI C5', ja: 'BSI C5' },
      added: null as Tri | null,
    },
    {
      region: { en: 'United States', ko: 'United States', ja: 'United States' },
      stored: { en: 'Northern Virginia', ko: 'Northern Virginia', ja: 'Northern Virginia' },
      backups: { en: 'Oregon', ko: 'Oregon', ja: 'Oregon' },
      cert: { en: 'HIPAA, with a signed BAA', ko: 'HIPAA, with a signed BAA', ja: 'HIPAA, with a signed BAA' },
      added: null,
    },
    {
      region: { en: 'United Kingdom', ko: 'United Kingdom', ja: 'United Kingdom' },
      stored: { en: 'London', ko: 'London', ja: 'London' },
      backups: { en: 'Manchester', ko: 'Manchester', ja: 'Manchester' },
      cert: { en: 'Cyber Essentials Plus', ko: 'Cyber Essentials Plus', ja: 'Cyber Essentials Plus' },
      added: null,
    },
    {
      region: { en: 'Australia', ko: 'Australia', ja: 'Australia' },
      stored: { en: 'Sydney', ko: 'Sydney', ja: 'Sydney' },
      backups: { en: 'Melbourne', ko: 'Melbourne', ja: 'Melbourne' },
      cert: { en: 'IRAP assessed', ko: 'IRAP assessed', ja: 'IRAP assessed' },
      added: null,
    },
    {
      region: { en: 'Japan', ko: 'Japan', ja: 'Japan' },
      stored: { en: 'Tokyo', ko: 'Tokyo', ja: 'Tokyo' },
      backups: { en: 'Osaka', ko: 'Osaka', ja: 'Osaka' },
      cert: { en: 'ISMAP', ko: 'ISMAP', ja: 'ISMAP' },
      added: { en: 'Added 29 October 2026', ko: 'Added 29 October 2026', ja: 'Added 29 October 2026' },
    },
  ],
};

const LOG = {
  title: { en: 'Changelog', ko: 'Changelog', ja: 'Changelog' },
  entries: [
    {
      date: '2026-11-18',
      when: { en: '18 Nov 2026', ko: '18 Nov 2026', ja: '18 Nov 2026' },
      tag: 'react 4.12.0',
      title: { en: 'Passkeys inside Android webviews', ko: 'Passkeys inside Android webviews', ja: 'Passkeys inside Android webviews' },
      body: {
        en: 'Passkey sign-in now works in embedded webviews on Android 14 and later. On older versions the component offers an email code instead.',
        ko: 'Passkey sign-in now works in embedded webviews on Android 14 and later. On older versions the component offers an email code instead.',
        ja: 'Passkey sign-in now works in embedded webviews on Android 14 and later. On older versions the component offers an email code instead.',
      },
    },
    {
      date: '2026-11-11',
      when: { en: '11 Nov 2026', ko: '11 Nov 2026', ja: '11 Nov 2026' },
      tag: 'API 2026-11-11',
      title: { en: 'Find accounts nobody uses', ko: 'Find accounts nobody uses', ja: 'Find accounts nobody uses' },
      body: {
        en: '`GET /v1/users` accepts `last_sign_in_before`, so you can list accounts that have not signed in for a year.',
        ko: '`GET /v1/users` accepts `last_sign_in_before`, so you can list accounts that have not signed in for a year.',
        ja: '`GET /v1/users` accepts `last_sign_in_before`, so you can list accounts that have not signed in for a year.',
      },
    },
    {
      date: '2026-11-04',
      when: { en: '4 Nov 2026', ko: '4 Nov 2026', ja: '4 Nov 2026' },
      tag: 'Dashboard',
      title: { en: 'Failed attempts on the user page', ko: 'Failed attempts on the user page', ja: 'Failed attempts on the user page' },
      body: {
        en: 'Support staff can open a user and see their last 50 sign-in attempts, with the reason each one failed.',
        ko: 'Support staff can open a user and see their last 50 sign-in attempts, with the reason each one failed.',
        ja: 'Support staff can open a user and see their last 50 sign-in attempts, with the reason each one failed.',
      },
    },
    {
      date: '2026-10-29',
      when: { en: '29 Oct 2026', ko: '29 Oct 2026', ja: '29 Oct 2026' },
      tag: 'Regions',
      title: { en: 'Tokyo region', ko: 'Tokyo region', ja: 'Tokyo region' },
      body: {
        en: 'New projects can keep user data in Tokyo, with backups in Osaka.',
        ko: 'New projects can keep user data in Tokyo, with backups in Osaka.',
        ja: 'New projects can keep user data in Tokyo, with backups in Osaka.',
      },
    },
  ],
};

const INDEX = {
  label: { en: 'On this page', ko: 'On this page', ja: 'On this page' },
  items: [
    { id: 'kh-component', name: { en: 'Sign-in component', ko: 'Sign-in component', ja: 'Sign-in component' } },
    { id: 'kh-what', name: { en: 'What it does', ko: 'What it does', ja: 'What it does' } },
    { id: 'kh-pricing', name: { en: 'Pricing', ko: 'Pricing', ja: 'Pricing' } },
    { id: 'kh-regions', name: { en: 'Data regions', ko: 'Data regions', ja: 'Data regions' } },
    { id: 'kh-changelog', name: { en: 'Changelog', ko: 'Changelog', ja: 'Changelog' } },
  ],
};

const FOOT = {
  nav: { en: 'Footer', ko: 'Footer', ja: 'Footer' },
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

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

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
  const announce = useCallback((message: string) => setNews((last) => (last === message ? `${message}\u00a0` : message)), []);

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
