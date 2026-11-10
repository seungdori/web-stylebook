import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { Lang } from '../data/styles';
import { localize } from '../data/styles';
import { KIT_PATH, KIT_START_SLUG, kitCatalog, kitCategories, kitReadingOrder, kitStart, type KitEntry } from '../data/kitCatalog';
import { withLang } from '../utils/language';
import { Panel, Shell } from '../kit/surface/surface';
import { SegmentedControl } from '../kit/segmented-control/segmented-control';
import themeCss from '../kit/theme.css?raw';
import { COMPONENT_DOCS, type ComponentDoc } from './components/docs';
import { copy, pick, t } from './components/copy';
import { ArrowLeftIcon, ArrowRightIcon } from './components/icons';
import { PackageManagerContext, type PackageManager } from './components/packageManager';
import { CodeBlock, CodePane, InstallBox, PropsTable, ReplayButton } from './components/shared';
import { useScrollableTabStop } from './components/useScrollableTabStop';
import './Components.css';

const hrefOf = (slug: string | undefined, lang: Lang) => withLang(slug ? `${KIT_PATH}/${slug}` : KIT_PATH, lang);
const categoryLabel = (entry: KitEntry, lang: Lang) => localize(kitCategories.find(({ id }) => id === entry.category)?.label ?? kitCategories[0].label, lang);

/** Moves focus to the new page's heading after an in-app link, as a page load would. */
function useHeadingFocus() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if ((window.history.state as { kitNav?: boolean } | null)?.kitNav) ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}

/* Gallery ---------------------------------------------------------------------- */

function GalleryCard({ entry, lang }: { entry: KitEntry; lang: Lang }) {
  const { Preview } = COMPONENT_DOCS[entry.slug];
  const [playing, setPlaying] = useState(false);
  return (
    <a
      className="cmp-card"
      href={hrefOf(entry.slug, lang)}
      data-kit-link=""
      onPointerEnter={() => setPlaying(true)}
      onPointerLeave={() => setPlaying(false)}
      onFocus={() => setPlaying(true)}
      onBlur={() => setPlaying(false)}
    >
      {/* A link cannot hold controls, so the preview is inert: it plays but takes no input. */}
      <Panel className="cmp-card__preview" inert aria-hidden="true">
        <Preview lang={lang} playing={playing} />
      </Panel>
      <div className="cmp-card__text">
        <h3>{entry.name}</h3>
        <p>{localize(entry.summary, lang)}</p>
      </div>
    </a>
  );
}

function Gallery({ lang }: { lang: Lang }) {
  const heading = useHeadingFocus();
  return (
    <div className="cmp-gallery">
      <header className="cmp-gallery__head">
        <h1 ref={heading} tabIndex={-1}>
          {pick(copy.title, lang)}
        </h1>
        <p>{pick(copy.lead, lang)}</p>
        <nav className="cmp-gallery__links" aria-label={pick(copy.title, lang)}>
          <a href={hrefOf(KIT_START_SLUG, lang)} data-kit-link="">
            {localize(kitStart.name, lang)}
          </a>
          <a href={withLang('/pages/quiet-utility', lang)}>{pick(copy.styleLink, lang)}</a>
        </nav>
      </header>
      {kitCategories.map((category) => (
        <section className="cmp-group" key={category.id} aria-labelledby={`cmp-group-${category.id}`}>
          <h2 id={`cmp-group-${category.id}`}>{localize(category.label, lang)}</h2>
          <div className="cmp-grid">
            {kitCatalog
              .filter((entry) => entry.category === category.id)
              .map((entry) => (
                <GalleryCard key={entry.slug} entry={entry} lang={lang} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* Component page --------------------------------------------------------------- */

function Sidebar({ current, lang }: { current: string; lang: Lang }) {
  return (
    <nav className="cmp-side" aria-label={pick(copy.componentList, lang)}>
      <ul>
        <li>
          <a href={hrefOf(undefined, lang)} data-kit-link="">
            {pick(copy.allComponents, lang)}
          </a>
        </li>
        <li>
          <a href={hrefOf(KIT_START_SLUG, lang)} data-kit-link="" aria-current={current === KIT_START_SLUG ? 'page' : undefined}>
            {localize(kitStart.name, lang)}
          </a>
        </li>
      </ul>
      {kitCategories.map((category) => (
        <div className="cmp-side__group" key={category.id}>
          <p>{localize(category.label, lang)}</p>
          <ul>
            {kitReadingOrder
              .filter((entry) => entry.category === category.id)
              .map((entry) => (
                <li key={entry.slug}>
                  <a href={hrefOf(entry.slug, lang)} data-kit-link="" aria-current={current === entry.slug ? 'page' : undefined}>
                    {entry.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Stage({ name, doc, lang }: { name: string; doc: ComponentDoc; lang: Lang }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [variantId, setVariantId] = useState(doc.variants[0].id);
  const [run, setRun] = useState(0);
  const variant = doc.variants.find(({ id }) => id === variantId) ?? doc.variants[0];
  const Demo = variant.Demo;

  return (
    <Shell className="cmp-stage">
      <div className="cmp-stage__bar">
        <SegmentedControl
          size="sm"
          label={`${name} ${pick(copy.view, lang)}`}
          value={tab}
          options={[
            { value: 'preview', label: pick(copy.tabs.preview, lang) },
            { value: 'code', label: pick(copy.tabs.code, lang) },
          ]}
          onValueChange={setTab}
        />
        {tab === 'preview' ? (
          <div className="cmp-stage__controls">
            {doc.variants.length > 1 ? (
              <SegmentedControl
                size="sm"
                label={`${name} ${pick(copy.example, lang)}`}
                value={variant.id}
                options={doc.variants.map(({ id, label }) => ({ value: id, label: pick(label, lang) }))}
                onValueChange={setVariantId}
              />
            ) : null}
            {doc.replay ? <ReplayButton label={pick(copy.replay, lang)} onClick={() => setRun((count) => count + 1)} /> : null}
          </div>
        ) : null}
      </div>
      <Panel>
        {tab === 'preview' ? (
          <div key={`${variant.id}-${run}`} className="cmp-stage__canvas">
            <Demo lang={lang} />
          </div>
        ) : (
          <CodePane files={doc.files} lang={lang} />
        )}
      </Panel>
    </Shell>
  );
}

function PageLinks({ slug, lang }: { slug: string; lang: Lang }) {
  const index = kitReadingOrder.findIndex((entry) => entry.slug === slug);
  const previous = kitReadingOrder[index - 1];
  const next = kitReadingOrder[index + 1];
  return (
    <nav className="cmp-pager" aria-label={pick(copy.pager, lang)}>
      {previous ? (
        <a href={hrefOf(previous.slug, lang)} data-kit-link="">
          {ArrowLeftIcon}
          <span>
            <small>{pick(copy.previous, lang)}</small>
            {previous.name}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={hrefOf(next.slug, lang)} data-kit-link="" data-next="">
          <span>
            <small>{pick(copy.next, lang)}</small>
            {next.name}
          </span>
          {ArrowRightIcon}
        </a>
      ) : null}
    </nav>
  );
}

function ComponentPage({ entry, lang }: { entry: KitEntry; lang: Lang }) {
  const heading = useHeadingFocus();
  const doc = COMPONENT_DOCS[entry.slug];
  return (
    <article className="cmp-article">
      <a className="cmp-back" href={hrefOf(undefined, lang)} data-kit-link="">
        {ArrowLeftIcon}
        {pick(copy.allComponents, lang)}
      </a>
      <header className="cmp-article__head">
        <p>{categoryLabel(entry, lang)}</p>
        <h1 ref={heading} tabIndex={-1}>
          {entry.name}
        </h1>
        <p>{localize(entry.summary, lang)}</p>
      </header>
      <Stage name={entry.name} doc={doc} lang={lang} />
      <section className="cmp-section">
        <h2>{pick(copy.install, lang)}</h2>
        <p>{pick(copy.installHint, lang)}</p>
        <InstallBox names={doc.install} lang={lang} />
      </section>
      <section className="cmp-section">
        <h2>{pick(copy.usage, lang)}</h2>
        <CodeBlock code={doc.usage} title="usage.tsx" lang={lang} />
      </section>
      <section className="cmp-section">
        <h2>{pick(copy.props, lang)}</h2>
        <PropsTable rows={doc.props} lang={lang} />
      </section>
      {doc.notes ? (
        <section className="cmp-section">
          <h2>{pick(copy.notes, lang)}</h2>
          <ul className="cmp-notes">
            {doc.notes.map((note) => (
              <li key={note.en}>{pick(note, lang)}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <PageLinks slug={entry.slug} lang={lang} />
    </article>
  );
}

/* Getting started ---------------------------------------------------------------- */

const startCopy = {
  lead: t(
    'The webstylebook command copies the files into your project. Tailwind is not required. The kit needs React 19. It follows the operating system palette unless you force light or dark.',
    'webstylebook 명령이 파일을 프로젝트에 복사합니다. Tailwind는 필요하지 않습니다. React 19가 필요합니다. 밝거나 어둡게 고정하지 않으면 운영체제의 팔레트를 따릅니다.',
    'webstylebookコマンドがファイルをプロジェクトにコピーします。Tailwindは不要です。React 19が必要です。ライトかダークに固定しなければ、OSのパレットに従います。',
  ),
  steps: [
    t(
      'Run this in your project folder. The theme file comes with the component. Files go to src/components/webstylebook/, or components/webstylebook/ if the project has no src folder. Use --dir to choose another folder.',
      '프로젝트 폴더에서 이 명령을 실행하세요. 테마 파일도 함께 설치됩니다. 파일은 src/components/webstylebook/에 들어갑니다. src 폴더가 없으면 components/webstylebook/에 들어갑니다. 다른 폴더를 쓰려면 --dir을 지정하세요.',
      'プロジェクトのフォルダーでこのコマンドを実行してください。テーマファイルも一緒にインストールされます。ファイルはsrc/components/webstylebook/に入ります。srcフォルダーがない場合はcomponents/webstylebook/に入ります。別のフォルダーを使うには--dirを指定してください。',
    ),
    t('Load the fonts: Inter, and Pretendard for Korean text.', '글꼴을 불러오세요. Inter와, 한국어용 Pretendard입니다.', 'フォントを読み込んでください。Interと、韓国語用のPretendardです。'),
    t(
      'Import the component. It loads theme.css itself. The button below is the same one the command installs.',
      '컴포넌트를 가져오세요. theme.css는 컴포넌트가 직접 불러옵니다. 아래 버튼은 명령이 설치하는 것과 같습니다.',
      'コンポーネントをインポートしてください。theme.cssはコンポーネント自身が読み込みます。下のボタンはコマンドがインストールするものと同じです。',
    ),
  ],
  themeStep: t(
    'Omit data-theme to follow the operating system. Set data-theme="dark" or class "dark" to force the dark palette, and data-theme="light" or class "light" to force light, even inside a dark page. .dark and .light are the shadcn class names.',
    'data-theme를 생략하면 운영체제를 따릅니다. data-theme="dark" 또는 class "dark"는 어두운 팔레트를 고정하고, data-theme="light" 또는 class "light"는 어두운 페이지 안에서도 밝게 고정합니다. .dark와 .light는 shadcn에서 쓰는 클래스 이름입니다.',
    'data-themeを省略するとOSに従います。data-theme="dark"またはclass "dark"はダークパレットを固定し、data-theme="light"またはclass "light"はダークなページの中でもライトに固定します。.darkと.lightはshadcnのクラス名です。',
  ),
  override: t(
    'Kit CSS sits outside any cascade layer, so a global rule in your app, such as one for every button, does not break it. For the same reason a Tailwind utility cannot replace a color or border the kit sets: add ! (for example bg-red-500!) or use a class from your own CSS. Spacing utilities such as mt-4 work as usual.',
    'kit CSS는 cascade layer 밖에 있습니다. 그래서 앱의 전역 규칙(예: 모든 button에 거는 규칙)이 컴포넌트를 깨뜨리지 않습니다. 같은 이유로 Tailwind 유틸리티는 kit이 정한 색이나 테두리를 바꾸지 못합니다. 바꾸려면 !를 붙이거나(예: bg-red-500!) 직접 쓴 CSS 클래스를 쓰세요. mt-4 같은 간격 유틸리티는 그대로 동작합니다.',
    'キットのCSSはカスケードレイヤーの外にあります。そのため、アプリ全体のルール(たとえばすべてのbuttonに掛けるルール)でコンポーネントが崩れません。同じ理由で、Tailwindのユーティリティはキットが決めた色や枠線を上書きできません。上書きするには!を付けるか(例: bg-red-500!)、自分で書いたCSSクラスを使ってください。mt-4のような余白のユーティリティはそのまま動きます。',
  ),
  handCopy: t(
    'You can also copy the files by hand: open Code on any component.',
    '파일을 직접 복사해도 됩니다. 컴포넌트마다 코드 탭에 파일이 있습니다.',
    'ファイルを手でコピーしても構いません。各コンポーネントの「コード」にファイルがあります。',
  ),
  shadcn: t(
    'If your project already uses the shadcn CLI, npx shadcn@latest add https://webstylebook.com/r/toast.json installs the same files.',
    'shadcn CLI를 쓰는 프로젝트라면 npx shadcn@latest add https://webstylebook.com/r/toast.json 명령으로 같은 파일을 설치할 수 있습니다.',
    'shadcn CLIを使っているプロジェクトでは、npx shadcn@latest add https://webstylebook.com/r/toast.json で同じファイルをインストールできます。',
  ),
  license: t(
    'The components and the webstylebook command are MIT licensed. Commercial projects can use them. Keep the copyright and license notice in your copies. The rest of this site is CC BY-NC 4.0.',
    '컴포넌트와 webstylebook 명령은 MIT 라이선스입니다. 상업 프로젝트에도 쓸 수 있습니다. 복사본에는 저작권과 라이선스 표시를 그대로 두세요. 사이트의 나머지 콘텐츠는 CC BY-NC 4.0입니다.',
    'コンポーネントとwebstylebookコマンドはMITライセンスです。商用プロジェクトにも使えます。コピーには著作権とライセンスの表示を残してください。サイトのその他のコンテンツはCC BY-NC 4.0です。',
  ),
  tokensTitle: t('Theme tokens', '테마 토큰', 'テーマトークン'),
  tokensLead: t(
    'Every component reads only these variables from theme.css. Values that differ from the Quiet Utility source carry a comment with the reason in the file.',
    '모든 컴포넌트는 theme.css의 이 변수만 읽습니다. Quiet Utility 원본과 다른 값에는 파일 안에 이유를 주석으로 적었습니다.',
    'すべてのコンポーネントはtheme.cssのこの変数だけを読みます。Quiet Utilityの元の値と異なる値には、理由をファイル内のコメントに書いています。',
  ),
  tokensShow: t('Show all tokens', '토큰 전체 보기', 'すべてのトークンを表示'),
  token: t('Token', '토큰', 'トークン'),
  value: t('Value', '값', '値'),
};

const FONT_LINKS = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
<!-- Korean -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css" />`;

const IMPORT_EXAMPLE = `import { Button } from './components/webstylebook/button/button';

export function SaveBar() {
  return <Button variant="primary">Save</Button>;
}`;

const THEME_EXAMPLE = `<html lang="en">
  <!-- follows the operating system -->
</html>

<html lang="en" data-theme="dark" class="dark">
  <!-- forces the dark palette -->
</html>

<html lang="en" data-theme="light" class="light">
  <!-- forces the light palette -->
</html>`;

function themeTokens(): Array<[string, string]> {
  const start = themeCss.indexOf(':root {');
  const block = themeCss.slice(start, themeCss.indexOf('}', start));
  return [...block.matchAll(/(--ws-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]);
}

function GettingStarted({ lang }: { lang: Lang }) {
  const heading = useHeadingFocus();
  const tokens = themeTokens();
  const scroller = useScrollableTabStop<HTMLDivElement>(tokens.length);
  return (
    <article className="cmp-article">
      <a className="cmp-back" href={hrefOf(undefined, lang)} data-kit-link="">
        {ArrowLeftIcon}
        {pick(copy.allComponents, lang)}
      </a>
      <header className="cmp-article__head">
        <h1 ref={heading} tabIndex={-1}>
          {localize(kitStart.name, lang)}
        </h1>
        <p>{pick(startCopy.lead, lang)}</p>
      </header>
      <ol className="cmp-steps">
        <li>
          <p>{pick(startCopy.steps[0], lang)}</p>
          <InstallBox names={['toast', 'button']} lang={lang} />
        </li>
        <li>
          <p>{pick(startCopy.steps[1], lang)}</p>
          <CodeBlock code={FONT_LINKS} title="index.html" lang={lang} />
        </li>
        <li>
          <p>{pick(startCopy.steps[2], lang)}</p>
          <CodeBlock code={IMPORT_EXAMPLE} title="SaveBar.tsx" lang={lang} />
        </li>
      </ol>
      <section className="cmp-section">
        <h2>{pick(t('Light and dark', '밝기와 어둠', 'ライトとダーク'), lang)}</h2>
        <p>{pick(startCopy.themeStep, lang)}</p>
        <CodeBlock code={THEME_EXAMPLE} title="index.html" lang={lang} />
      </section>
      <p className="cmp-note">{pick(startCopy.override, lang)}</p>
      <p className="cmp-note">{pick(startCopy.handCopy, lang)}</p>
      <p className="cmp-note">{pick(startCopy.shadcn, lang)}</p>
      <p className="cmp-note">{pick(startCopy.license, lang)}</p>
      <section className="cmp-section">
        <h2>{pick(startCopy.tokensTitle, lang)}</h2>
        <p>{pick(startCopy.tokensLead, lang)}</p>
        <Shell className="cmp-tokens">
          <details>
            <summary>{pick(startCopy.tokensShow, lang)}</summary>
            <div className="cmp-tokens__more">
              <Panel>
                <div ref={scroller} className="cmp-table" role="region" tabIndex={0} aria-label={pick(startCopy.tokensTitle, lang)}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{pick(startCopy.token, lang)}</th>
                        <th scope="col">{pick(startCopy.value, lang)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map(([name, value]) => (
                        <tr key={name}>
                          <th scope="row">
                            <code>{name}</code>
                          </th>
                          <td>
                            <span className="cmp-token">
                              {value.startsWith('#') ? <span className="cmp-token__swatch" style={{ background: value }} aria-hidden="true" /> : null}
                              <code>{value}</code>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
              <Panel>
                <CodePane files={[{ path: 'theme.css', code: themeCss }]} lang={lang} />
              </Panel>
            </div>
          </details>
        </Shell>
      </section>
    </article>
  );
}

/* Page ------------------------------------------------------------------------------ */

// Sections of the old single page. Links to them were published, so they still land.
const LEGACY_SECTIONS: Record<string, string> = {
  'status-badge': 'status-badge',
  'empty-state': 'empty-state',
  installation: KIT_START_SLUG,
  tokens: KIT_START_SLUG,
};

function goTo(href: string, replace = false) {
  const state = { kitNav: true };
  if (replace) window.history.replaceState(state, '', href);
  else window.history.pushState(state, '', href);
  // App listens for popstate, so this renders the new route without a page load.
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function followKitLink(event: MouseEvent<HTMLDivElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-kit-link]');
  if (!link) return;
  event.preventDefault();
  goTo(link.href);
}

export function Components({ lang, slug }: { lang: Lang; slug?: string }) {
  const [manager, setManager] = useState<PackageManager>('npm');
  const packageManager = useMemo(() => ({ manager, setManager }), [manager]);

  useEffect(() => {
    const target = LEGACY_SECTIONS[window.location.hash.slice(1)];
    if (!slug && target) goTo(hrefOf(target, lang), true);
  }, [slug, lang]);

  const entry = kitCatalog.find((item) => item.slug === slug);

  return (
    <PackageManagerContext value={packageManager}>
      <div className="components-page" onClick={followKitLink}>
        {slug ? (
          <div className="cmp-doc">
            <Sidebar current={slug} lang={lang} />
            {entry ? <ComponentPage key={slug} entry={entry} lang={lang} /> : <GettingStarted key={slug} lang={lang} />}
          </div>
        ) : (
          <Gallery lang={lang} />
        )}
      </div>
    </PackageManagerContext>
  );
}
