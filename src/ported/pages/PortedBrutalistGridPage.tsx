import { useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedBrutalistGridPage.css';

// The page of Concrete Index, a volunteer-run online archive of concrete buildings finished
// between 1945 and 1979, in the Brutalist Grid style. Anton, a tall condensed poster face, sets
// the archive's name, the counts, years, decades and the open record's name; Overpass Mono
// sets every record field, the way an index card is typed. Components come from the archive:
// header blocks, a year-by-year bar ruler in a black band, the three states as blocks sized by
// their share, a filter bar over a dense ruled listing, one record with a fact sheet, its
// history and a plan drawn in plain rules, and the submission blocks colliding on the grey
// ground. Black rules, no rounding, no shadows. Yellow marks listed buildings, the pressed
// filter and the open row; red marks demolished buildings and the actions that send something.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Vars = CSSProperties & Record<`--${string}`, string | number>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

// Puts one value into a sentence as a node, so it can be set in its own face.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<span key={index}>{node}</span>, part]));

const LOCALE: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };
const formatDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

// Search ignores case and accents, so "Erno" finds Ernő and "Sao Paulo" finds São Paulo.
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NAME_SOLID = 'Concrete';
const NAME_HOLLOW = 'Index';
const NAME = `${NAME_SOLID} ${NAME_HOLLOW}`;
const PER_PAGE = 10;

type BuildingState = 'standing' | 'listed' | 'demolished';
type Decade = 1940 | 1950 | 1960 | 1970;
type CountryId = 'uk' | 'us' | 'fr' | 'jp' | 'br' | 'de' | 'it' | 'ca' | 'ie' | 'es' | 'rs' | 'ge' | 'mx' | 'ar' | 'in';

const DECADES: Decade[] = [1940, 1950, 1960, 1970];
const STATES: BuildingState[] = ['standing', 'listed', 'demolished'];
const decadeOf = (year: number) => (Math.floor(year / 10) * 10) as Decade;

// In the order of how many entries each country has in the whole index.
const COUNTRIES: Array<{ id: CountryId; name: Tri; short: Tri }> = [
  { id: 'uk', name: { en: 'United Kingdom', ko: '영국', ja: 'イギリス' }, short: { en: 'UK', ko: '영국', ja: 'イギリス' } },
  { id: 'us', name: { en: 'United States', ko: '미국', ja: 'アメリカ' }, short: { en: 'US', ko: '미국', ja: 'アメリカ' } },
  { id: 'de', name: { en: 'Germany', ko: '독일', ja: 'ドイツ' }, short: { en: 'Germany', ko: '독일', ja: 'ドイツ' } },
  { id: 'fr', name: { en: 'France', ko: '프랑스', ja: 'フランス' }, short: { en: 'France', ko: '프랑스', ja: 'フランス' } },
  { id: 'jp', name: { en: 'Japan', ko: '일본', ja: '日本' }, short: { en: 'Japan', ko: '일본', ja: '日本' } },
  { id: 'br', name: { en: 'Brazil', ko: '브라질', ja: 'ブラジル' }, short: { en: 'Brazil', ko: '브라질', ja: 'ブラジル' } },
  { id: 'it', name: { en: 'Italy', ko: '이탈리아', ja: 'イタリア' }, short: { en: 'Italy', ko: '이탈리아', ja: 'イタリア' } },
  { id: 'ca', name: { en: 'Canada', ko: '캐나다', ja: 'カナダ' }, short: { en: 'Canada', ko: '캐나다', ja: 'カナダ' } },
  { id: 'es', name: { en: 'Spain', ko: '스페인', ja: 'スペイン' }, short: { en: 'Spain', ko: '스페인', ja: 'スペイン' } },
  { id: 'rs', name: { en: 'Serbia', ko: '세르비아', ja: 'セルビア' }, short: { en: 'Serbia', ko: '세르비아', ja: 'セルビア' } },
  { id: 'ge', name: { en: 'Georgia', ko: '조지아', ja: 'ジョージア' }, short: { en: 'Georgia', ko: '조지아', ja: 'ジョージア' } },
  { id: 'ie', name: { en: 'Ireland', ko: '아일랜드', ja: 'アイルランド' }, short: { en: 'Ireland', ko: '아일랜드', ja: 'アイルランド' } },
  { id: 'mx', name: { en: 'Mexico', ko: '멕시코', ja: 'メキシコ' }, short: { en: 'Mexico', ko: '멕시코', ja: 'メキシコ' } },
  { id: 'ar', name: { en: 'Argentina', ko: '아르헨티나', ja: 'アルゼンチン' }, short: { en: 'Argentina', ko: '아르헨티나', ja: 'アルゼンチン' } },
  { id: 'in', name: { en: 'India', ko: '인도', ja: 'インド' }, short: { en: 'India', ko: '인도', ja: 'インド' } },
];

const countryOf = (id: CountryId) => COUNTRIES.find((item) => item.id === id) ?? COUNTRIES[0];

// How a listing is written on the record's stamp and in its State fact.
const LISTING = {
  grade2: { en: 'Grade II', ko: 'Grade II', ja: 'Grade II' },
  grade2star: { en: 'Grade II*', ko: 'Grade II*', ja: 'Grade II*' },
  worldHeritage: { en: 'World Heritage, 2016', ko: '세계유산, 2016년', ja: '世界遺産、2016年' },
  monument: { en: 'Listed monument', ko: '지정 기념물', ja: '指定記念物' },
} satisfies Record<string, Tri>;

interface Building {
  /** Entry number in the index. */
  id: string;
  name: string;
  architect: string;
  city: string;
  country: CountryId;
  year: number;
  state: BuildingState;
  /** The year it came down. */
  gone?: number;
  /** The protection it has, for the stamp and the State fact. */
  listing?: Tri;
  /** The last site visit, all in 2026. */
  visited: string;
}

const BUILDINGS: Building[] = [
  { id: 'CI-0112', name: 'Spa Green Estate', architect: 'Berthold Lubetkin, Tecton', city: 'London', country: 'uk', year: 1949, state: 'listed', listing: LISTING.grade2star, visited: '2026-03-14' },
  { id: 'CI-0236', name: 'Brynmawr Rubber Factory', architect: "Architects' Co-Partnership", city: 'Brynmawr', country: 'uk', year: 1951, state: 'demolished', gone: 2001, visited: '2026-05-09' },
  { id: 'CI-0007', name: "Unité d'Habitation", architect: 'Le Corbusier', city: 'Marseille', country: 'fr', year: 1952, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-06-20' },
  { id: 'CI-0318', name: 'Busáras', architect: 'Michael Scott', city: 'Dublin', country: 'ie', year: 1953, state: 'listed', listing: { en: 'Protected structure', ko: '보호 건축물', ja: '保護建築物' }, visited: '2026-02-11' },
  { id: 'CI-0011', name: 'Notre-Dame du Haut', architect: 'Le Corbusier', city: 'Ronchamp', country: 'fr', year: 1955, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-06-22' },
  { id: 'CI-0544', name: 'Hiroshima Peace Memorial Museum', architect: 'Kenzo Tange', city: 'Hiroshima', country: 'jp', year: 1955, state: 'listed', listing: { en: 'Important Cultural Property, 2006', ko: '중요문화재, 2006년', ja: '重要文化財、2006年' }, visited: '2026-04-03' },
  { id: 'CI-0602', name: 'Palazzetto dello Sport', architect: 'Pier Luigi Nervi, Annibale Vitellozzi', city: 'Rome', country: 'it', year: 1957, state: 'standing', visited: '2026-09-17' },
  { id: 'CI-0388', name: "St Joseph's Church", architect: 'Auguste Perret', city: 'Le Havre', country: 'fr', year: 1957, state: 'listed', listing: { en: 'Monument historique', ko: 'Monument historique', ja: 'Monument historique' }, visited: '2026-07-01' },
  { id: 'CI-0547', name: 'Kagawa Prefectural Government Office', architect: 'Kenzo Tange', city: 'Takamatsu', country: 'jp', year: 1958, state: 'listed', listing: { en: 'Important Cultural Property, 2022', ko: '중요문화재, 2022년', ja: '重要文化財、2022年' }, visited: '2026-04-06' },
  { id: 'CI-0271', name: 'Corbusierhaus', architect: 'Le Corbusier', city: 'Berlin', country: 'de', year: 1958, state: 'listed', listing: LISTING.monument, visited: '2026-08-12' },
  { id: 'CI-0710', name: 'Los Manantiales', architect: 'Félix Candela, Joaquín Álvarez Ordóñez', city: 'Mexico City', country: 'mx', year: 1958, state: 'standing', visited: '2026-01-27' },
  { id: 'CI-0154', name: 'Alton West Estate', architect: "LCC Architects' Department", city: 'London', country: 'uk', year: 1959, state: 'listed', listing: LISTING.grade2star, visited: '2026-03-21' },
  { id: 'CI-0019', name: 'Sainte-Marie de La Tourette', architect: 'Le Corbusier', city: 'Éveux', country: 'fr', year: 1960, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-06-24' },
  { id: 'CI-0821', name: 'National Congress', architect: 'Oscar Niemeyer', city: 'Brasília', country: 'br', year: 1960, state: 'listed', visited: '2026-02-19' },
  { id: 'CI-0035', name: 'Park Hill', architect: 'Jack Lynn, Ivor Smith', city: 'Sheffield', country: 'uk', year: 1961, state: 'listed', listing: { en: 'Grade II*, 1998', ko: 'Grade II*, 1998년', ja: 'Grade II*、1998年' }, visited: '2026-09-05' },
  { id: 'CI-0466', name: 'Plymouth Civic Centre', architect: 'Hector Stirling; Jellicoe, Ballantyne and Coleridge', city: 'Plymouth', country: 'uk', year: 1962, state: 'listed', listing: { en: 'Grade II, 2007', ko: 'Grade II, 2007년', ja: 'Grade II、2007年' }, visited: '2026-05-30' },
  { id: 'CI-0905', name: 'Palace of Assembly', architect: 'Le Corbusier', city: 'Chandigarh', country: 'in', year: 1962, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-01-15' },
  { id: 'CI-0503', name: 'Yale Art and Architecture Building', architect: 'Paul Rudolph', city: 'New Haven', country: 'us', year: 1963, state: 'standing', visited: '2026-04-25' },
  { id: 'CI-0517', name: 'Marina City', architect: 'Bertrand Goldberg', city: 'Chicago', country: 'us', year: 1964, state: 'listed', listing: { en: 'Chicago Landmark, 2016', ko: '시카고 랜드마크, 2016년', ja: 'シカゴ・ランドマーク、2016年' }, visited: '2026-05-18' },
  { id: 'CI-0551', name: 'Yoyogi National Gymnasium', architect: 'Kenzo Tange', city: 'Tokyo', country: 'jp', year: 1964, state: 'listed', listing: { en: 'Important Cultural Property, 2021', ko: '중요문화재, 2021년', ja: '重要文化財、2021年' }, visited: '2026-04-09' },
  { id: 'CI-0297', name: 'Hutchesontown C', architect: 'Basil Spence', city: 'Glasgow', country: 'uk', year: 1965, state: 'demolished', gone: 1993, visited: '2026-08-27' },
  { id: 'CI-0509', name: 'Salk Institute', architect: 'Louis Kahn', city: 'La Jolla', country: 'us', year: 1965, state: 'standing', visited: '2026-03-02' },
  { id: 'CI-0187', name: 'Centre Point', architect: 'Richard Seifert and Partners', city: 'London', country: 'uk', year: 1966, state: 'listed', listing: { en: 'Grade II, 1995', ko: 'Grade II, 1995년', ja: 'Grade II、1995年' }, visited: '2026-10-14' },
  { id: 'CI-0201', name: 'Tricorn Centre', architect: 'Owen Luder Partnership', city: 'Portsmouth', country: 'uk', year: 1966, state: 'demolished', gone: 2004, visited: '2026-07-22' },
  { id: 'CI-0333', name: "St Peter's Seminary", architect: 'Gillespie, Kidd and Coia', city: 'Cardross', country: 'uk', year: 1966, state: 'listed', listing: { en: 'Category A, 1992', ko: 'Category A, 1992년', ja: 'Category A、1992年' }, visited: '2026-08-29' },
  { id: 'CI-0642', name: 'Dunelm House', architect: "Architects' Co-Partnership", city: 'Durham', country: 'uk', year: 1966, state: 'listed', listing: { en: 'Grade II, 2021', ko: 'Grade II, 2021년', ja: 'Grade II、2021年' }, visited: '2026-09-11' },
  { id: 'CI-0521', name: 'Breuer Building', architect: 'Marcel Breuer', city: 'New York', country: 'us', year: 1966, state: 'standing', visited: '2026-05-12' },
  { id: 'CI-0559', name: 'Kyoto International Conference Center', architect: 'Sachio Otani', city: 'Kyoto', country: 'jp', year: 1966, state: 'standing', visited: '2026-04-11' },
  { id: 'CI-0731', name: 'Bank of London and South America', architect: 'Clorindo Testa, SEPRA', city: 'Buenos Aires', country: 'ar', year: 1966, state: 'standing', visited: '2026-02-06' },
  { id: 'CI-0214', name: 'Trinity Square car park', architect: 'Owen Luder Partnership', city: 'Gateshead', country: 'uk', year: 1967, state: 'demolished', gone: 2010, visited: '2026-09-08' },
  { id: 'CI-0090', name: 'Balfron Tower', architect: 'Ernő Goldfinger', city: 'London', country: 'uk', year: 1967, state: 'listed', listing: LISTING.grade2star, visited: '2026-10-21' },
  { id: 'CI-0377', name: 'Metropolitan Cathedral', architect: 'Frederick Gibberd', city: 'Liverpool', country: 'uk', year: 1967, state: 'listed', listing: LISTING.grade2star, visited: '2026-06-03' },
  { id: 'CI-0612', name: 'Habitat 67', architect: 'Moshe Safdie', city: 'Montreal', country: 'ca', year: 1967, state: 'listed', listing: { en: 'Heritage site, 2009', ko: '유산 지정, 2009년', ja: '遺産指定、2009年' }, visited: '2026-05-23' },
  { id: 'CI-0145', name: 'Hayward Gallery', architect: "GLC Architects' Department", city: 'London', country: 'uk', year: 1968, state: 'standing', visited: '2026-10-17' },
  { id: 'CI-0266', name: 'Pilgrimage Church, Neviges', architect: 'Gottfried Böhm', city: 'Velbert', country: 'de', year: 1968, state: 'listed', listing: LISTING.monument, visited: '2026-08-15' },
  { id: 'CI-0528', name: 'Boston City Hall', architect: 'Kallmann McKinnell and Knowles', city: 'Boston', country: 'us', year: 1968, state: 'standing', visited: '2026-05-14' },
  { id: 'CI-0533', name: 'Everson Museum of Art', architect: 'I. M. Pei', city: 'Syracuse', country: 'us', year: 1968, state: 'standing', visited: '2026-05-16' },
  { id: 'CI-0830', name: 'São Paulo Museum of Art', architect: 'Lina Bo Bardi', city: 'São Paulo', country: 'br', year: 1968, state: 'listed', listing: { en: 'Listed by IPHAN, 2003', ko: 'IPHAN 지정, 2003년', ja: 'IPHAN指定、2003年' }, visited: '2026-02-24' },
  { id: 'CI-0419', name: 'Preston Bus Station', architect: 'Building Design Partnership', city: 'Preston', country: 'uk', year: 1969, state: 'listed', listing: { en: 'Grade II, 2013', ko: 'Grade II, 2013년', ja: 'Grade II、2013年' }, visited: '2026-10-02' },
  { id: 'CI-0660', name: 'Torres Blancas', architect: 'Francisco Javier Sáenz de Oiza', city: 'Madrid', country: 'es', year: 1969, state: 'standing', visited: '2026-07-09' },
  { id: 'CI-0834', name: 'Faculty of Architecture and Urbanism, USP', architect: 'Vilanova Artigas, Carlos Cascaldi', city: 'São Paulo', country: 'br', year: 1969, state: 'listed', visited: '2026-02-26' },
  { id: 'CI-0230', name: 'Welbeck Street car park', architect: 'Michael Blampied and Partners', city: 'London', country: 'uk', year: 1970, state: 'demolished', gone: 2019, visited: '2026-10-19' },
  { id: 'CI-0249', name: 'Pimlico School', architect: "John Bancroft, GLC Architects' Department", city: 'London', country: 'uk', year: 1970, state: 'demolished', gone: 2010, visited: '2026-03-28' },
  { id: 'CI-0540', name: 'Geisel Library', architect: 'William Pereira', city: 'San Diego', country: 'us', year: 1970, state: 'standing', visited: '2026-03-04' },
  { id: 'CI-0825', name: 'Cathedral of Brasília', architect: 'Oscar Niemeyer', city: 'Brasília', country: 'br', year: 1970, state: 'listed', visited: '2026-02-18' },
  { id: 'CI-0537', name: 'Government Service Center', architect: 'Paul Rudolph', city: 'Boston', country: 'us', year: 1971, state: 'standing', visited: '2026-05-15' },
  { id: 'CI-0098', name: 'Brunswick Centre', architect: 'Patrick Hodgkinson', city: 'London', country: 'uk', year: 1972, state: 'listed', listing: { en: 'Grade II, 2000', ko: 'Grade II, 2000년', ja: 'Grade II、2000年' }, visited: '2026-10-10' },
  { id: 'CI-0093', name: 'Trellick Tower', architect: 'Ernő Goldfinger', city: 'London', country: 'uk', year: 1972, state: 'listed', listing: { en: 'Grade II*, 1998', ko: 'Grade II*, 1998년', ja: 'Grade II*、1998年' }, visited: '2026-10-24' },
  { id: 'CI-0121', name: 'Robin Hood Gardens', architect: 'Alison and Peter Smithson', city: 'London', country: 'uk', year: 1972, state: 'demolished', gone: 2017, visited: '2026-10-22' },
  { id: 'CI-0304', name: 'Hulme Crescents', architect: 'Hugh Wilson, Lewis Womersley', city: 'Manchester', country: 'uk', year: 1972, state: 'demolished', gone: 1994, visited: '2026-09-02' },
  { id: 'CI-0565', name: 'Nakagin Capsule Tower', architect: 'Kisho Kurokawa', city: 'Tokyo', country: 'jp', year: 1972, state: 'demolished', gone: 2022, visited: '2026-04-08' },
  { id: 'CI-0412', name: 'Clifton Cathedral', architect: 'Percy Thomas Partnership', city: 'Bristol', country: 'uk', year: 1973, state: 'listed', listing: LISTING.grade2star, visited: '2026-06-01' },
  { id: 'CI-0615', name: 'Robarts Library', architect: 'Warner, Burns, Toan and Lunde', city: 'Toronto', country: 'ca', year: 1973, state: 'standing', visited: '2026-05-26' },
  { id: 'CI-0257', name: 'Birmingham Central Library', architect: 'John Madin', city: 'Birmingham', country: 'uk', year: 1974, state: 'demolished', gone: 2016, visited: '2026-07-15' },
  { id: 'CI-0681', name: 'Les Choux de Créteil', architect: 'Gérard Grandval', city: 'Créteil', country: 'fr', year: 1974, state: 'standing', visited: '2026-06-27' },
  { id: 'CI-0627', name: 'Monte Amiata housing, Gallaratese', architect: 'Carlo Aymonino, Aldo Rossi', city: 'Milan', country: 'it', year: 1974, state: 'standing', visited: '2026-09-19' },
  { id: 'CI-0752', name: 'Ministry of Highways', architect: 'George Chakhava, Zurab Jalaghania', city: 'Tbilisi', country: 'ge', year: 1975, state: 'standing', visited: '2026-08-04' },
  { id: 'CI-0519', name: "Prentice Women's Hospital", architect: 'Bertrand Goldberg', city: 'Chicago', country: 'us', year: 1975, state: 'demolished', gone: 2014, visited: '2026-05-19' },
  { id: 'CI-0574', name: 'J. Edgar Hoover Building', architect: 'C. F. Murphy Associates', city: 'Washington', country: 'us', year: 1975, state: 'standing', visited: '2026-04-29' },
  { id: 'CI-0064', name: 'National Theatre', architect: 'Denys Lasdun', city: 'London', country: 'uk', year: 1976, state: 'listed', listing: { en: 'Grade II*, 1994', ko: 'Grade II*, 1994년', ja: 'Grade II*、1994年' }, visited: '2026-10-12' },
  { id: 'CI-0001', name: 'Barbican Estate', architect: 'Chamberlin, Powell and Bon', city: 'London', country: 'uk', year: 1976, state: 'listed', listing: { en: 'Grade II, 2001', ko: 'Grade II, 2001년', ja: 'Grade II、2001年' }, visited: '2026-11-03' },
  { id: 'CI-0578', name: 'Hubert H. Humphrey Building', architect: 'Marcel Breuer', city: 'Washington', country: 'us', year: 1977, state: 'standing', visited: '2026-04-30' },
  { id: 'CI-0744', name: 'Western City Gate', architect: 'Mihajlo Mitrović', city: 'Belgrade', country: 'rs', year: 1977, state: 'standing', visited: '2026-08-07' },
  { id: 'CI-0071', name: 'Alexandra Road Estate', architect: 'Neave Brown', city: 'London', country: 'uk', year: 1978, state: 'listed', listing: { en: 'Grade II*, 1993', ko: 'Grade II*, 1993년', ja: 'Grade II*、1993年' }, visited: '2026-11-05' },
];

const OPENED_FIRST = 'CI-0419';

// The fuller records. Every other record holds its facts and waits for a history.
interface RecordText {
  facts?: Array<{ term: Tri; value: Tri }>;
  history: Tri[];
  sources?: Tri;
  plan?: boolean;
}

const RECORDS: Record<string, RecordText> = {
  'CI-0419': {
    facts: [
      { term: { en: 'Architects', ko: '건축가', ja: '建築家' }, value: { en: 'Building Design Partnership: Keith Ingham, Charles Wilson', ko: 'Building Design Partnership: Keith Ingham, Charles Wilson', ja: 'Building Design Partnership: Keith Ingham, Charles Wilson' } },
      { term: { en: 'Opened', ko: '완공', ja: '完成' }, value: { en: '12 October 1969', ko: '1969년 10월 12일', ja: '1969年10月12日' } },
      { term: { en: 'Address', ko: '주소', ja: '住所' }, value: { en: 'Tithebarn Street, Preston, Lancashire, UK', ko: 'Tithebarn Street, Preston, Lancashire, UK', ja: 'Tithebarn Street, Preston, Lancashire, UK' } },
      { term: { en: 'Use', ko: '용도', ja: '用途' }, value: { en: 'Bus station, with a multi-storey car park above', ko: '버스 터미널, 위층은 다층 주차장', ja: 'バスターミナル（上階は立体駐車場）' } },
      { term: { en: 'Bus stands', ko: '승강장 수', ja: 'バース数' }, value: { en: '80 until 2017, now 40', ko: '2017년까지 80개, 현재 40개', ja: '2017年まで80、現在40' } },
      { term: { en: 'State', ko: '상태', ja: '状態' }, value: { en: 'Listed Grade II on 23 September 2013', ko: '2013년 9월 23일 Grade II 지정', ja: '2013年9月23日にGrade II指定' } },
      { term: { en: 'Owner', ko: '소유자', ja: '所有者' }, value: { en: 'Lancashire County Council, since 2014', ko: 'Lancashire County Council, 2014년부터', ja: 'Lancashire County Council、2014年から' } },
      { term: { en: 'Entry', ko: '항목', ja: '項目' }, value: { en: 'CI-0419, last visited 2 October 2026', ko: 'CI-0419, 최종 방문 2026년 10월 2일', ja: 'CI-0419、最終訪問 2026年10月2日' } },
    ],
    history: [
      {
        en: 'Building Design Partnership designed the station for Preston Corporation. It opened in October 1969 with 80 stands along its two long sides and a car park on the floors above. The curved concrete edges of the parking floors run the whole length of the building.',
        ko: '1969년 10월 개장한 이 역은 Building Design Partnership이 Preston Corporation을 위해 설계했습니다. 긴 두 면을 따라 승강장 80개가 늘어서고, 그 위층에 주차장이 있습니다. 주차층 가장자리의 곡선 콘크리트는 건물 전체 길이에 걸쳐 이어집니다.',
        ja: '1969年10月に開業したこの駅は、Building Design PartnershipがPreston Corporationのために設計しました。長い二つの辺に沿って80のバースがあり、その上の階に駐車場があります。駐車階の曲線状のコンクリートの縁は、建物の全長にわたって続いています。',
      },
      {
        en: 'By 2012 the city council planned to demolish it and build on the site. Two applications to list it had already been turned down. After a public campaign it was listed at Grade II in September 2013.',
        ko: '2012년까지 시의회는 이 건물을 철거하고 그 부지에 새 건물을 짓겠다는 계획이었습니다. 지정 신청은 이미 두 차례 기각되었습니다. 시민 운동을 거쳐 2013년 9월 Grade II로 지정되었습니다.',
        ja: '2012年までに市議会はこの建物を取り壊し、跡地に新たな建物を建てる計画でした。指定の申請はすでに2度却下されていました。市民運動のあと、2013年9月にGrade IIに指定されました。',
      },
      {
        en: 'Lancashire County Council took it over from the city council for £1. The stands were rebuilt and renumbered in 2017, leaving 40, and the station reopened in July 2018.',
        ko: 'Lancashire County Council이 시의회로부터 £1에 이 건물을 넘겨받았습니다. 2017년에 승강장을 다시 짓고 번호를 새로 매기면서 40개만 남았고, 역은 2018년 7월 다시 문을 열었습니다.',
        ja: 'Lancashire County Councilは市議会からこの建物を£1で引き継ぎました。2017年に乗り場を作り直して番号を振り直し、40だけが残りました。駅は2018年7月に再開しました。',
      },
    ],
    sources: {
      en: 'Sources: Historic England list entry 1416042; Twentieth Century Society case file; site visits in 2019, 2023 and 2026.',
      ko: '출처: Historic England 목록 항목 1416042; Twentieth Century Society 사건 기록; 2019년, 2023년, 2026년 현장 방문.',
      ja: '出典：Historic England 登録リスト項目 1416042、Twentieth Century Society の事例ファイル、2019年・2023年・2026年の現地訪問。',
    },
    plan: true,
  },
  'CI-0035': {
    history: [
      {
        en: "Sheffield's city architects built Park Hill on the slope above the railway station, with decks wide enough for a milk float on every third floor, so that the neighbours of the cleared streets could keep living along a street.",
        ko: 'Sheffield 시의 건축가들은 기차역 위 경사지에 Park Hill을 지었습니다. 정리된 옛 거리의 주민들이 계속 같은 길에서 살 수 있도록, 셋째 층마다 우유 배달 수레가 지나갈 만큼 넓은 통로를 두었습니다.',
        ja: "シェフィールド市の建築家たちは、鉄道駅の上の斜面にPark Hillを建てました。取り壊された街区の住民が同じ通りで暮らし続けられるように、3階ごとに牛乳配達の荷車が通れるほど広い廊下を設けました。",
      },
      {
        en: 'It was listed at Grade II* in 1998. Urban Splash has been refurbishing it block by block since 2009, keeping the concrete frame and replacing the brick infill with coloured panels.',
        ko: '1998년 Grade II*로 지정되었습니다. Urban Splash는 2009년부터 콘크리트 골조는 그대로 두고 벽돌 충전재를 색이 있는 패널로 바꾸며, 블록 단위로 개보수하고 있습니다.',
        ja: '1998年にGrade II*に指定されました。Urban Splashは2009年から、コンクリートの骨組みを残し、レンガの充填材を色付きのパネルに替えながら、ブロックごとに改修を進めています。',
      },
    ],
  },
  'CI-0201': {
    history: [
      {
        en: 'A shopping centre, market and car park by Owen Luder Partnership, with Rodney Gordon as its designer. It opened in 1966 and never filled its shops.',
        ko: 'Owen Luder Partnership가 설계한 쇼핑센터, 시장, 주차장입니다. 설계자로는 Rodney Gordon도 참여했습니다. 1966년에 문을 열었지만 상점은 끝내 다 차지 않았습니다.',
        ja: 'Owen Luder Partnershipが手がけたショッピングセンター、市場、駐車場です。設計者としてRodney Gordonも関わりました。1966年に開業しましたが、店舗が埋まることはありませんでした。',
      },
      {
        en: 'The city council demolished it in 2004. Pieces of its concrete were sold to people who wanted to keep one.',
        ko: '시의회는 2004년 이 건물을 철거했습니다. 건물의 콘크리트 일부는 간직하고 싶어 한 사람들에게 팔렸습니다.',
        ja: '市議会は2004年にこの建物を取り壊しました。コンクリートの一部は、記念に残したいという人々に売られました。',
      },
    ],
  },
  'CI-0121': {
    history: [
      {
        en: 'Two long slabs with access decks around a planted mound, designed by Alison and Peter Smithson for the Greater London Council and finished in 1972.',
        ko: '녹지를 올린 언덕을 둘러싼 외부 통로 달린 긴 판 모양 건물 두 동입니다. Alison and Peter Smithson이 Greater London Council을 위해 설계했고 1972년에 완공했습니다.',
        ja: '植栽を施した丘を囲む、外廊下付きの長い板状の二棟です。Alison and Peter Smithsonが大ロンドン議会（Greater London Council）のために設計し、1972年に完成しました。',
      },
      {
        en: 'Campaigns to have it listed failed, and demolition of the west block began in 2017. The Victoria and Albert Museum kept a three-storey section of its facade.',
        ko: '지정을 위한 운동은 실패했고, 2017년에 서쪽 동 철거가 시작되었습니다. Victoria and Albert Museum은 정면의 3층 부분을 보존했습니다.',
        ja: '指定を求める運動は実らず、2017年に西棟の取り壊しが始まりました。ヴィクトリア&アルバート博物館は正面の三層分を残しました。',
      },
    ],
  },
  'CI-0565': {
    history: [
      {
        en: 'Kisho Kurokawa hung 140 factory-made capsules on two concrete cores. Each capsule was a studio, meant to be replaced every 25 years.',
        ko: 'Kisho Kurokawa는 공장에서 만든 캡슐 140개를 콘크리트 코어 두 개에 매달았습니다. 각 캡슐은 하나의 작업실이었고, 25년마다 교체하도록 계획되었습니다.',
        ja: '黒川紀章は工場で作ったカプセル140基を、二本のコンクリートの芯に取り付けました。各カプセルは一つのスタジオで、25年ごとに交換する前提でした。',
      },
      {
        en: 'None was ever replaced. The tower was taken down in 2022, and 23 capsules were kept for museums and reuse.',
        ko: '한 번도 교체되지 않았습니다. 탑은 2022년에 철거되었고, 캡슐 23개는 박물관 소장과 재사용을 위해 보존되었습니다.',
        ja: '一度も交換されませんでした。タワーは2022年に解体され、23基のカプセルは博物館への寄贈と再利用のために保存されました。',
      },
    ],
  },
  'CI-0257': {
    history: [
      {
        en: "John Madin's library opened in 1974, an inverted ziggurat of reading floors around an open atrium.",
        ko: "John Madin의 도서관은 1974년에 문을 열었습니다. 열린 중정을 둘러싼 열람실들이 거꾸로 세운 지구라트처럼 층층이 쌓여 있었습니다.",
        ja: "ジョン・マディンの図書館は1974年に開館しました。開いた吹き抜けを囲んで閲覧室が層をなし、逆さまのジグラットのような形をしていました。",
      },
      {
        en: 'The city moved the library to a new building in 2013. Listing was refused, and Madin’s building was demolished in 2016.',
        ko: '시는 2013년 도서관을 새 건물로 옮겼습니다. 지정 신청은 거절되었고, Madin’s 건물은 2016년에 철거되었습니다.',
        ja: '市は2013年に図書館を新しい建物へ移しました。指定は認められず、マディンの建物は2016年に取り壊されました。',
      },
    ],
  },
  'CI-0612': {
    history: [
      {
        en: "Moshe Safdie's student thesis, built for Expo 67: 354 precast concrete boxes stacked into 146 homes, each with a garden on the roof of the one below.",
        ko: 'Moshe Safdie의 학생 졸업 논문으로, 1967년 엑스포를 위해 지어졌습니다. 공장에서 만든 콘크리트 상자 354개를 쌓아 146세대의 주택을 만들었고, 각 주택은 아래 세대의 지붕 위에 정원을 두었습니다.',
        ja: 'モシェ・サフディの学生時代の卒業制作で、1967年の万博のために建てられました。工場で作ったコンクリートの箱354個を積み上げて146戸の住宅とし、各住戸は下の住戸の屋根に庭を持ちます。',
      },
      {
        en: 'The Quebec government classified it as a heritage site in 2009.',
        ko: '퀘벡 주 정부는 2009년 이 건물을 유산 지역으로 지정했습니다.',
        ja: 'ケベック州政府は2009年にこの建物を遺産地区に指定しました。',
      },
    ],
  },
  'CI-0519': {
    history: [
      {
        en: "Bertrand Goldberg set four rounded wings of patients' rooms on a concrete core, cantilevered over a square base.",
        ko: 'Bertrand Goldberg는 콘크리트 코어 위에 환자실이 있는 둥근 날개 네 개를 얹었습니다. 날개는 사각형 기단 위로 내밀어 있습니다.',
        ja: 'バートランド・ゴールドバーグは、コンクリートの芯の上に患者用の病室を収めた丸い翼を四つ配置し、四角い基壇の上に片持ち梁で張り出させました。',
      },
      {
        en: 'Northwestern University demolished it in 2014 for a research building, after a campaign to save it that went to court.',
        ko: 'Northwestern University는 법정 다툼으로 번진 보존 운동 끝에 2014년 연구 건물을 짓기 위해 이 건물을 철거했습니다.',
        ja: 'ノースウェスタン大学は、保存を求める運動が裁判にまで発展したのち、2014年に研究棟を建てるためこの建物を取り壊しました。',
      },
    ],
  },
  'CI-0001': {
    history: [
      {
        en: 'Homes for about 4,000 people on a City of London site bombed flat in 1940: three towers, long terrace blocks over a podium and a lake.',
        ko: '1940년 폭격으로 평지가 된 City of London 부지에 약 4,000명을 위한 주택을 지었습니다. 탑 세 개, 기단 위의 긴 연립형 블록, 그리고 호수가 있습니다.',
        ja: '1940年の爆撃で平らになったCity of Londonの敷地に、約4,000人のための住宅を建てました。三つの塔、台座の上に並ぶ長い連続住棟、そして池があります。',
      },
      {
        en: 'The estate was finished in 1976 and listed at Grade II in 2001. The arts centre at its heart opened in 1982.',
        ko: '단지는 1976년에 완공되었고, 2001년 Grade II로 지정되었습니다. 중심부의 예술센터는 1982년에 문을 열었습니다.',
        ja: '団地は1976年に完成し、2001年にGrade IIに指定されました。中心にある芸術センターは1982年に開館しました。',
      },
    ],
  },
  'CI-0064': {
    history: [
      {
        en: "Denys Lasdun's terraces step down towards the Thames and hold three theatres under two fly towers.",
        ko: 'Denys Lasdun의 테라스는 템스 강 쪽으로 계단처럼 내려가며, 두 개의 무대탑 아래 극장 세 곳을 품고 있습니다.',
        ja: 'デニス・ラスダンのテラスはテムズ川に向かって階段状に下り、二本の舞台塔の下に三つの劇場を収めています。',
      },
      {
        en: 'The Queen opened it in October 1976. It was listed at Grade II* in 1994.',
        ko: '엘리자베스 2세 여왕이 1976년 10월 개관했습니다. 1994년 Grade II*로 지정되었습니다.',
        ja: '1976年10月に女王が開館させました。1994年にGrade II*に指定されました。',
      },
    ],
  },
};

const HEAD = {
  nav: { en: 'Index', ko: '색인', ja: '索引' },
  buildings: { en: 'Buildings', ko: '건물', ja: '建物' },
  years: { en: 'By year', ko: '연도별', ja: '年別' },
  lost: { en: 'Lost buildings', ko: '사라진 건물', ja: '取り壊された建物' },
  submit: { en: 'Submit a building', ko: '건물 제보하기', ja: '建物を提出' },
  menu: { en: 'Menu', ko: '메뉴', ja: 'メニュー' },
} satisfies Record<string, Tri>;

const HERO = {
  count: { en: '1,284 buildings, {br}41 countries', ko: '건물 1,284개, {br}41개국', ja: '建物1,284件、{br}41カ国' },
  added: { en: '6 added', ko: '6개 추가', ja: '6件追加' },
  week: { en: 'week of 16 Nov 2026', ko: '2026년 11월 16일 주', ja: '2026年11月16日の週' },
  intro: {
    en: 'A record of concrete buildings finished between 1945 and 1979: who designed them, where they are, and whether they are still there. Every entry is checked against planning records and visited at least once.',
    ko: '1945년부터 1979년 사이에 완공된 콘크리트 건물의 기록입니다. 누가 설계했고, 어디에 있으며, 지금도 남아 있는지를 담습니다. 모든 항목은 건축 허가 기록과 대조하고, 최소 한 번 현장을 방문해 확인합니다.',
    ja: '1945年から1979年のあいだに完成したコンクリート建築の記録です。設計者、所在地、現存するかどうかを載せています。すべての項目は建築許可の記録と照合し、少なくとも一度は現地を訪れて確認しています。',
  },
  search: { en: 'Search by building, architect or city', ko: '건물, 건축가 또는 도시로 검색', ja: '建物、建築家、都市で検索' },
  example: { en: 'Barbican', ko: 'Barbican', ja: 'Barbican' },
  go: { en: 'Search', ko: '검색', ja: '検索' },
} satisfies Record<string, Tri>;

// Buildings finished per year, 1945 to 1979, across the whole index. They add up to 1,284.
const PER_YEAR = [
  2, 4, 6, 8, 11,
  13, 16, 18, 21, 24, 26, 28, 31, 34, 37,
  40, 41, 43, 45, 47, 50, 53, 58, 71, 64,
  66, 64, 61, 58, 52, 49, 43, 38, 33, 29,
];
const PEAK = Math.max(...PER_YEAR);
const AXIS = ['1945', '1950', '1955', '1960', '1965', '1970', '1975'];

const YEARS = {
  title: { en: 'Buildings in the index by year finished', ko: '완공 연도별 색인 건물 수', ja: '完成年別の収録建物数' },
  peak: { en: '71 were finished in 1968, more than in any other year.', ko: '1968년에 71개 건물이 완공되어 어느 해보다 많았습니다.', ja: '1968年には71件が完成し、どの年よりも多くなりました。' },
  chart: {
    en: 'Bar chart: buildings per year from 1945 to 1979, rising from 2 in 1945 to a peak of 71 in 1968, then falling to 29 in 1979.',
    ko: '막대 그래프: 1945년부터 1979년까지 연도별 건물 수입니다. 1945년 2개에서 1968년 71개로 최고점을 찍은 뒤, 1979년에는 29개로 줄어듭니다.',
    ja: '棒グラフ：1945年から1979年までの年別の建物数です。1945年の2件から1968年の71件でピークに達し、1979年には29件に減少しています。',
  },
} satisfies Record<string, Tri>;

// The whole index by state. The stylesheet makes each block as wide as its share.
const SHARES: Array<{ state: BuildingState; count: string; share: string }> = [
  { state: 'standing', count: '731', share: '57%' },
  { state: 'listed', count: '341', share: '27%' },
  { state: 'demolished', count: '212', share: '17%' },
];

const STATE_NAME: Record<BuildingState, Tri> = {
  standing: { en: 'Standing', ko: '현존', ja: '現存' },
  listed: { en: 'Listed', ko: '지정', ja: '指定' },
  demolished: { en: 'Demolished', ko: '철거', ja: '取り壊し' },
};

const STATES_TEXT = {
  label: { en: 'The index by state', ko: '상태별 색인', ja: '状態別の索引' },
  share: {
    standing: { en: 'standing', ko: '현존', ja: '現存' },
    listed: { en: 'listed', ko: '지정', ja: '指定' },
    demolished: { en: 'demolished', ko: '철거', ja: '取り壊し' },
  } satisfies Record<BuildingState, Tri>,
  news: {
    en: 'Nine buildings in the index came down this year. Fourteen more have demolition applications pending.',
    ko: '이번 해에 색인의 건물 9개가 철거되었습니다. 철거 신청이 접수된 건물은 14개 더 있습니다.',
    ja: '今年、索引の建物9件が取り壊されました。取り壊しの申請が出ている建物はさらに14件あります。',
  },
  see: { en: 'See the demolished buildings', ko: '철거된 건물 보기', ja: '取り壊された建物を見る' },
};

const BROWSE = {
  title: { en: 'Browse the index', ko: '색인 둘러보기', ja: '索引を見る' },
  note: {
    en: 'Records keep their facts, sources and history, including for buildings that have since come down. Listed here are the {n} checked on a site visit this year.',
    ko: '기록에는 사실 정보, 출처, 연혁이 남아 있으며, 이미 철거된 건물의 기록도 포함됩니다. 아래 목록은 올해 현장 방문으로 확인한 {n}개 건물입니다.',
    ja: '記録には基本情報、出典、経緯が残っており、すでに取り壊された建物の記録も含まれています。下の一覧は、今年の現地訪問で確認した{n}件です。',
  },
  filters: { en: 'Filter the listing', ko: '목록 필터', ja: '一覧の絞り込み' },
  country: { en: 'Country', ko: '국가', ja: '国' },
  allCountries: { en: 'All countries', ko: '모든 국가', ja: 'すべての国' },
  decade: { en: 'Decade finished', ko: '완공 연대', ja: '完成年代' },
  decadeName: { en: '{d}s', ko: '{d}년대', ja: '{d}年代' },
  inDecade: { en: 'buildings', ko: '건물', ja: '件' },
  state: { en: 'State', ko: '상태', ja: '状態' },
  many: { en: '{n} buildings, newest first', ko: '건물 {n}개, 최신순', ja: '建物{n}件、新しい順' },
  manyQuery: { en: '{n} buildings matching “{q}”, newest first', ko: '“{q}” 검색 건물 {n}개, 최신순', ja: '“{q}”に一致する建物{n}件、新しい順' },
  one: { en: '{n} building', ko: '건물 {n}개', ja: '建物{n}件' },
  oneQuery: { en: '{n} building matching “{q}”', ko: '“{q}”에 맞는 건물 {n}개', ja: '“{q}”に一致する建物{n}件' },
  zero: { en: '{n} buildings', ko: '건물 {n}개', ja: '建物{n}件' },
  zeroQuery: { en: '{n} buildings matching “{q}”', ko: '“{q}”에 맞는 건물 {n}개', ja: '“{q}”に一致する建物{n}件' },
  clear: { en: 'Clear filters', ko: '필터 해제', ja: '絞り込みを解除' },
  noneTitle: { en: 'No buildings match.', ko: '일치하는 건물이 없습니다.', ja: '一致する建物はありません。' },
  noneBody: {
    en: 'Check the spelling, try the architect or the city instead, or take a filter off.',
    ko: '철자를 확인하거나, 건축가나 도시로 찾아보거나, 필터를 하나 해제해 보세요.',
    ja: 'つづりを確認するか、建築家や都市名で探すか、絞り込みを一つ解除してください。',
  },
  none: { en: 'No buildings match.', ko: '일치하는 건물이 없습니다.', ja: '一致する建物はありません。' },
  caption: { en: 'Buildings, page {p} of {pages}', ko: '건물 목록, {pages}쪽 중 {p}쪽', ja: '建物一覧、{pages}ページ中{p}ページ' },
  colBuilding: { en: 'Building', ko: '건물', ja: '建物' },
  colArchitect: { en: 'Architect', ko: '건축가', ja: '建築家' },
  colCity: { en: 'City', ko: '도시', ja: '都市' },
  colYear: { en: 'Finished', ko: '완공', ja: '完成' },
  colState: { en: 'State', ko: '상태', ja: '状態' },
  gone: { en: 'Demolished {y}', ko: '{y}년 철거', ja: '{y}年に取り壊し' },
  pages: { en: 'Pages', ko: '페이지', ja: 'ページ' },
  range: { en: '{from} to {to} of {n}', ko: '{n}개 중 {from}~{to}', ja: '{n}件中 {from}～{to}' },
  previous: { en: 'Previous', ko: '이전', ja: '前へ' },
  next: { en: 'Next', ko: '다음', ja: '次へ' },
} satisfies Record<string, Tri>;

const RECORD = {
  label: { en: 'Open record', ko: '열린 기록', ja: '開いている記録' },
  architects: { en: 'Architects', ko: '건축가', ja: '建築家' },
  finished: { en: 'Finished', ko: '완공', ja: '完成' },
  city: { en: 'City', ko: '도시', ja: '都市' },
  state: { en: 'State', ko: '상태', ja: '状態' },
  entry: { en: 'Entry', ko: '항목', ja: '項目' },
  standingFact: { en: 'Standing, not listed', ko: '현존, 지정되지 않음', ja: '現存、指定なし' },
  listedFact: { en: 'Listed', ko: '지정', ja: '指定' },
  listedNoteFact: { en: 'Listed: {note}', ko: '지정: {note}', ja: '指定：{note}' },
  goneFact: { en: 'Demolished in {y}', ko: '{y}년 철거', ja: '{y}年に取り壊し' },
  entryFact: { en: '{id}, last visited {date}', ko: '{id}, 최종 방문 {date}', ja: '{id}、最終訪問 {date}' },
  siteFact: { en: '{id}, site last visited {date}', ko: '{id}, 현장 최종 방문 {date}', ja: '{id}、現地の最終訪問 {date}' },
  notListed: { en: 'Not listed', ko: '지정되지 않음', ja: '指定なし' },
  protected: { en: 'Protected', ko: '보호 대상', ja: '保護対象' },
  history: { en: 'History', ko: '연혁', ja: '経緯' },
  noHistory: {
    en: 'No history has been written for this record yet. Volunteers write one after a second visit.',
    ko: '이 기록의 연혁은 아직 작성되지 않았습니다. 자원봉사자가 두 번째 방문 뒤에 작성합니다.',
    ja: 'この記録の経緯はまだ書かれていません。ボランティアが2回目の訪問後に書きます。',
  },
  sources: { en: 'Sources: planning records; site visit on {date}.', ko: '출처: 건축 허가 기록, {date} 현장 방문.', ja: '出典：建築許可の記録、{date}の現地訪問。' },
  back: { en: 'Back to the listing', ko: '목록으로 돌아가기', ja: '一覧に戻る' },
  planTitle: { en: 'Ground floor, 1969', ko: '1층 평면, 1969년', ja: '1階平面、1969年' },
  planNote: {
    en: 'Simplified. Buses pulled in nose first at 40 stands on each long side and reversed out. Passengers waited in the concourse between the two rows.',
    ko: '간략도입니다. 버스는 긴 변마다 40개씩 있는 승강장에 앞머리부터 들어와 후진해 나갔습니다. 승객은 두 줄 사이의 대합실에서 기다렸습니다.',
    ja: '簡略図です。バスは両長辺にある40のバースに先頭から入り、後退して出ていきました。乗客は2列のあいだのコンコースで待ちました。',
  },
  planAlt: {
    en: 'Plan: a long rectangle with a row of 40 stands along each long side, the concourse between them, and a bus road outside each row.',
    ko: '평면도: 긴 직사각형이며, 긴 변마다 승강장 40개가 늘어서 있고, 그 사이에 대합실이 있으며, 각 줄 바깥에 버스 도로가 있습니다.',
    ja: '平面図：細長い長方形で、長辺それぞれに40のバースが並び、その間にコンコースがあり、各列の外側にバス道路があります。',
  },
  stands: { en: '40 stands', ko: '승강장 40개', ja: 'バース40' },
  concourse: { en: 'Concourse', ko: '대합실', ja: 'コンコース' },
  roads: { en: 'Dashed lines: bus roads', ko: '점선: 버스 도로', ja: '破線：バス道路' },
  scale: { en: 'Not to scale', ko: '축척 아님', ja: '縮尺不同' },
} satisfies Record<string, Tri>;

const SUBMIT = {
  title: { en: 'Submit a building', ko: '건물 제보하기', ja: '建物を提出' },
  note: {
    en: 'Anything in concrete finished between 1945 and 1979, in any country, standing or gone. About 30 come in each month.',
    ko: '1945년부터 1979년 사이에 완공된 콘크리트 건물이라면 어느 나라의 것이든, 현존하든 철거되었든 받습니다. 매달 약 30건이 들어옵니다.',
    ja: '1945年から1979年に完成したコンクリート建築であれば、国を問わず、現存するものでも取り壊されたものでも受け付けます。毎月約30件が寄せられます。',
  },
  readers: { en: 'of the 1,284 entries were sent in by readers.', ko: '1,284개 항목 중 독자가 제보한 항목입니다.', ja: '1,284件の項目のうち、読者から寄せられた件数です。' },
  steps: { en: 'How a submission works', ko: '제보 절차', ja: '提出の流れ' },
  start: { en: 'Start a submission', ko: '제보 시작', ja: '提出を始める' },
  startNote: { en: 'Four fields now. Photographs come later, by email.', ko: '지금은 네 개 항목만 입력합니다. 사진은 나중에 이메일로 보내 주세요.', ja: '今は4項目だけ入力します。写真は後からメールでお送りください。' },
} satisfies Record<string, Tri>;

const STEPS: Tri[] = [
  {
    en: 'Search the index first. If the building is there, add your photographs to its record instead.',
    ko: '먼저 색인에서 검색해 보세요. 건물이 이미 있다면, 대신 그 기록에 사진을 추가해 주세요.',
    ja: 'まず索引で検索してください。建物がすでにあれば、代わりにその記録へ写真を追加してください。',
  },
  {
    en: 'Send its name, the city and the year it was finished, with the short form here.',
    ko: '건물 이름, 도시, 완공 연도를 아래의 간단한 양식으로 보내 주세요.',
    ja: '建物の名前、都市、完成年を、下の簡単なフォームで送ってください。',
  },
  {
    en: 'We email you a link for three photographs you took yourself, one of them showing the whole building.',
    ko: '직접 찍은 사진 세 장을 위한 링크를 이메일로 보내 드립니다. 그중 한 장은 건물 전체가 보여야 합니다.',
    ja: 'ご自身で撮影した写真3枚のためのリンクをメールでお送りします。そのうち1枚は建物全体が写るものにしてください。',
  },
  {
    en: 'A volunteer checks the planning records and replies within 21 days.',
    ko: '자원봉사자가 건축 허가 기록을 확인하고 21일 안에 답장합니다.',
    ja: 'ボランティアが建築許可の記録を確認し、21日以内に返信します。',
  },
];

type Field = 'name' | 'city' | 'year' | 'email';
type Entry = Record<Field, string>;
type Errors = Partial<Record<Field, Tri>>;

const EMPTY: Entry = { name: '', city: '', year: '', email: '' };

const FORM = {
  title: { en: 'Your building', ko: '건물 정보', ja: '建物の情報' },
  name: { en: 'Building name', ko: '건물 이름', ja: '建物名' },
  city: { en: 'Town or city', ko: '도시 또는 지역', ja: '都市または町' },
  year: { en: 'Year finished', ko: '완공 연도', ja: '完成年' },
  yearHint: { en: 'From 1945 to 1979', ko: '1945년부터 1979년까지', ja: '1945年から1979年まで' },
  email: { en: 'Your email', ko: '이메일', ja: 'メールアドレス' },
  send: { en: 'Send the building', ko: '건물 보내기', ja: '建物を送信' },
  cancel: { en: 'Cancel', ko: '취소', ja: 'キャンセル' },
  nameError: { en: "Write the building's name, or its address if it has none.", ko: '건물 이름을 입력해 주세요. 이름이 없다면 주소를 입력해 주세요.', ja: '建物名を入力してください。名前がなければ住所を入力してください。' },
  cityError: { en: 'Write the town or city it stands in, or stood in.', ko: '건물이 있거나 있었던 도시 또는 지역을 입력해 주세요.', ja: '建物が所在する、または所在していた都市を入力してください。' },
  yearError: { en: 'Write the year it was finished as four digits, like 1968.', ko: '완공 연도를 1968처럼 네 자리 숫자로 입력해 주세요.', ja: '完成年を1968のように4桁の数字で入力してください。' },
  rangeError: { en: 'The index takes buildings finished from 1945 to 1979.', ko: '색인은 1945년부터 1979년 사이에 완공된 건물만 받습니다.', ja: '索引が受け付けるのは、1945年から1979年に完成した建物です。' },
  emailError: { en: 'Write an email address we can reply to, like name@example.com.', ko: '답장을 받을 수 있는 이메일 주소를 입력해 주세요. 예: name@example.com', ja: '返信を受け取れるメールアドレスを入力してください。例：name@example.com' },
  doneTitle: { en: 'Received: {name}, {city}', ko: '접수됨: {name}, {city}', ja: '受け付けました：{name}、{city}' },
  doneBody: {
    en: 'Thank you. A volunteer checks the planning records for a building finished in {year} and writes to {email} within 21 days, with the link for your photographs.',
    ko: '감사합니다. 자원봉사자가 {year}년에 완공된 건물의 건축 허가 기록을 확인하고, 사진을 올릴 링크와 함께 21일 안에 {email} 주소로 답장합니다.',
    ja: 'ありがとうございます。ボランティアが{year}年に完成した建物の建築許可の記録を確認し、写真の提出リンクとともに21日以内に{email}へ返信します。',
  },
  another: { en: 'Submit another building', ko: '다른 건물 제보하기', ja: '別の建物を提出' },
} satisfies Record<string, Tri>;

const FOOT = {
  kept: {
    en: 'Concrete Index is kept by four volunteers in Leeds and 380 contributors.',
    ko: 'Concrete Index는 리즈의 자원봉사자 네 명과 기여자 380명이 운영합니다.',
    ja: 'Concrete Indexは、リーズのボランティア4人と寄稿者380人が運営しています。',
  },
  reuse: {
    en: 'Text may be reused with a credit; photographs belong to the people who took them. The whole index is published as a CSV file each January.',
    ko: '본문은 출처를 밝히면 다시 쓸 수 있습니다. 사진의 권리는 촬영자에게 있습니다. 색인 전체는 매년 1월 CSV 파일로 공개합니다.',
    ja: '本文は出典を明記すれば再利用できます。写真の権利は撮影者にあります。索引全体は毎年1月にCSVファイルで公開しています。',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Brutalist Grid style: a white sheet in a 5px black frame on a flat grey ground, divided by 4px black rules, with yellow and red used as solid blocks.

Pick a believable subject that lives on records and counts, such as a building archive, a municipal register or a railway timetable, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Concrete Index, a volunteer-run online archive of 1,284 concrete buildings finished between 1945 and 1979 in 41 countries: its name and counts, the buildings finished per year, the share standing, listed and demolished, a filterable listing, one building's record and how to submit a building.

TOKENS:
--bg: #e6e6e1 (the ground, the filter bar, the record head, the plan and the submit area)
--paper: #ffffff (the sheet, fields, buttons, white text on red)
--ink: #111111 (type, every rule, the black band, pressed filters, the open row)
--muted: #4d4d49 (only the site bar's secondary text)
--hint: #5b5b57 (only the placeholder in the search field)
--yellow: #ffd12f (the name block, listed, the fact sheet, the steps, hover on any framed control, the peak bar; as text on ink: pressed filters, the open Menu block, the current page, the Search block, the peak's label, the readers count, the news link, the open row's name and year)
--red: #d72600 (demolished, the Submit block, Start a submission, the send button and the form's title bar, the stamp in the hero, the year ticks, the open row's bar, error text and error borders, the focus ring)
Inside black areas, rules use the ground colour at 42 to 50% opacity, and the open row's column rules are white at 40%. No other colours. White on red and red on white are 5:1, ink on yellow 13:1; red text never sits on the grey (a stamp on the grey gets a white fill).

TYPOGRAPHY:
Two families. Anton (400, its only weight) for the archive's name, counts, years, decades, headings, the open record's name, button words and stamps; its words are always upper case (decades keep their lower-case s). Overpass Mono (400, 500, 600) for every record field, label, paragraph and control, the way an index card is typed. Never a synthesised bold.
Name: Anton min(14rem, 16.2cqi) of the hero, line-height 0.84, the second word hollow (transparent fill, 2.5px ink stroke); below 600px 26cqi on two lines, line-height 0.92.
Count: Anton min(5.5rem, 8.2cqi), line-height 0.9; 12.6cqi below 600px.
H2: Anton clamp(2.5rem, 5.4vw, 4.5rem), line-height 0.9. The open record's name: Anton clamp(2.5rem, 12vw, 9rem), line-height 0.92. H3: Anton 2rem.
Anton also sets the name block 1.75rem, the Submit block 1.3125rem, stamps 1.75rem, the state counts clamp(3rem, 5vw, 4.25rem), the news line clamp(1.625rem, 3.2vw, 2.5rem), decades 1.625rem, the result count 1.75rem, years in the listing 1.5rem, step numbers 2.75rem, the readers count clamp(4.5rem, 9vw, 7.5rem), block titles clamp(1.75rem, 3.2vw, 2.5rem) and the send button 1.5rem.
Body: Overpass Mono 400 at 1rem, line-height 1.6; labels 500 or 600. No text under 1rem anywhere in the page. Letter-spacing never wider than 0.04em, and no small all-caps labels.

LAYOUT:
- One sheet: header blocks (the yellow name block, three in-page links, a red "Submit a building" block), then every section stacked inside the frame and separated by 4px rules, no gaps.
- Hero on a 12-column grid: the name across all twelve; the count in the first eight with a rotated red stamp ("6 added, week of 16 Nov 2026") beside it; a short intro in columns 1 to 6 and the search form in 8 to 12. On a 1280x800 laptop the name and the count sit fully above the fold.
- A black band: buildings finished per year, 1945 to 1979, as 35 bars on 5-year rules with a red tick under each year and the peak (71 in 1968) in yellow.
- The three states as blocks as wide as their share (731 standing on white, 341 listed on yellow, 212 demolished on red), then a news line in Anton on black.
- Browse: the heading, the filter bar on the grey, the result line, a dense ruled table, the pager.
- The open record: its name huge on the grey with a rotated stamp, a yellow fact sheet in columns 1 to 5 and the history in 6 to 12, and for Preston Bus Station a ground-floor plan drawn only with rules.
- Submit: a black block, a yellow block of four steps and a red block that collide on the grey ground, overlapping by about 40px. A two-column footer under a 4px rule.
- Below 900px the links fold into a Menu block that opens a stacked list, the stamp and the search move under the count, and the states stack under a strip that keeps their proportions. Below 820px each listing row becomes a grid: name and year, architect, then city and state. Below 600px the Submit block moves into the menu.

COMPONENTS:
- Search: label above a 4px-framed field and an ink "Search" block with yellow Anton. Searching starts a new search: the filters reset, the listing shows what matches (ignoring case and accents, by building, architect, city or country) and focus moves to the result line.
- Filter bar: Country as a framed select with a count per country; Decade finished as four toggle buttons (aria-pressed), each decade in Anton over its count under the other filters; State as three toggle buttons with a square swatch (white, yellow, red). Pressed is ink with yellow text. Any combination works.
- Result line: the count in Anton, the search in quotes, and "Clear filters" while any filter is on. A filter change is announced once in a polite live region. With nothing to show, an empty state with its own "Clear filters" replaces the table and the pager.
- Listing: a table with explicit roles, ten rows a page, newest first; each building's name is a link that opens its record and moves focus to the record's name. The open row is ink with a red 8px bar, its name and year yellow, and aria-current on the link.
- Pager: "1 to 10 of 29", Previous, numbered pages and Next as 46px framed squares; the current page is ink with yellow text. Changing page moves focus to the result line.
- Record: a dl of facts on yellow with 3px rules, the history (or a line saying none is written yet), its sources, and "Back to the listing", which returns focus to the row.
- Submission: "Start a submission" (or the header's "Submit a building") opens a four-field form under a red title bar: building name, town or city, year finished from 1945 to 1979, email. Errors sit under their field in red with role="alert" and focus goes to the first; a valid entry is replaced by a confirmation that takes focus and wraps any text the reader typed.
- Square corners, 2 to 5px black rules, no shadows. Hover turns a framed control yellow; red blocks underline their words instead, and the news link thickens its underline. Focus is a 3px red outline 3px off the edge; on red blocks it is ink, on the ink Search block it is yellow, and on blocks that sit flush against each other it is drawn inside the block.

MOTION:
- Background colours change in 120ms steps(2, end), only when the reader has not asked for reduced motion. Nothing moves on its own.

FORBIDDEN:
- Rounded corners, shadows, blurs, smooth gradients, glows (hard-stop gradients only draw the plan's dashes and bays and the phone proportion strip)
- Cards, pills, chips, badges, a small label above a heading, all-caps tracked labels
- Pastel or low-contrast pairs, a third accent colour, red text on the grey
- Photographs, building illustrations, icons beyond a square swatch, emoji
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about rawness, honesty, grids or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a search form, filter groups of toggle buttons, a table with explicit roles, a pager in a nav, an article for the record, a labelled form
3) Working search, filters with counts and an empty state, pagination over the filtered list, opening a record, and a form with error and success states
4) Responsive layout from 320px with no horizontal scroll; the table becomes stacked rows on phones, every control at least 44px tall
5) Visible focus on every control, a text alternative for the bar chart, reduced-motion support`;

const PROMPT_KO = `Brutalist Grid 스타일로 실제 페이지 한 장을 디자인한다. 평평한 회색 바탕 위에 5px 검은 테두리를 두른 흰 시트를 두고, 4px 검은 선으로 나누며, 노랑과 빨강은 단색 블록으로만 쓴다.

기록과 수치를 다루는 그럴듯한 주제를 고르고, 그 주제의 실제 내용을 쓴다. 페이지는 스타일에 관한 페이지가 아니라 그 주제의 페이지로 읽혀야 한다. 여기서는 Concrete Index다. 1945년부터 1979년 사이에 41개국에서 완공된 콘크리트 건물 1,284개를 다루는 자원봉사 운영 온라인 아카이브다. 이름과 수치, 연도별 완공 건물 수, 현존·지정·철거의 비율, 필터가 되는 목록, 건물 하나의 기록, 건물 제보 방법을 담는다.

TOKENS:
--bg: #e6e6e1 (바탕, 필터 막대, 기록 머리, 평면도, 제보 영역)
--paper: #ffffff (시트, 입력란, 버튼, 빨강 위의 흰 글자)
--ink: #111111 (글자, 모든 선, 검은 띠, 눌린 필터, 열린 행)
--muted: #4d4d49 (사이트 막대의 보조 글자에만)
--hint: #5b5b57 (검색 입력란의 안내 글자에만)
--yellow: #ffd12f (이름 블록, 지정, 사실 시트, 단계, 테두리 있는 컨트롤의 hover, 최고치 막대; 검정 위의 글자로는 눌린 필터, 열린 메뉴 블록, 현재 페이지, 검색 블록, 최고치 라벨, 독자 수, 소식 링크, 열린 행의 이름과 연도)
--red: #d72600 (철거, 제보 블록, 제보 시작, 보내기 버튼과 양식 제목 막대, 히어로의 도장, 연도 눈금, 열린 행의 막대, 오류 글자와 오류 테두리, 포커스 링)
검은 영역 안의 선은 바탕색을 42~50% 불투명도로 쓴다. 열린 행의 열 구분선은 흰색 40%다. 다른 색은 쓰지 않는다. 흰색 위의 빨강과 빨강 위의 흰색은 5:1, 노랑 위의 검정은 13:1이다. 빨간 글자는 회색 바탕에 두지 않는다. 회색 바탕의 도장에는 흰 채움을 준다.

TYPOGRAPHY:
서체는 두 가지다. Anton(400, 이 굵기만 사용)은 아카이브의 이름, 수치, 연도, 연대, 제목, 열린 기록의 이름, 버튼 글자, 도장에 쓴다. 글자는 항상 대문자로 쓴다(연대의 소문자 s는 그대로 둔다). Overpass Mono(400, 500, 600)는 모든 기록 항목, 라벨, 본문, 컨트롤에 쓴다. 색인 카드에 타자로 친 것처럼 보이게 한다. 합성 굵은 글씨는 쓰지 않는다.
이름: 히어로의 Anton min(14rem, 16.2cqi), 줄 높이 0.84, 둘째 단어는 속이 빈 글자(채움은 투명, 2.5px ink 획). 600px 아래에서는 26cqi, 두 줄, 줄 높이 0.92.
수치: Anton min(5.5rem, 8.2cqi), 줄 높이 0.9. 600px 아래에서는 12.6cqi.
H2: Anton clamp(2.5rem, 5.4vw, 4.5rem), 줄 높이 0.9. 열린 기록의 이름: Anton clamp(2.5rem, 12vw, 9rem), 줄 높이 0.92. H3: Anton 2rem.
Anton은 이 밖에도 이름 블록 1.75rem, 제보 블록 1.3125rem, 도장 1.75rem, 상태별 수치 clamp(3rem, 5vw, 4.25rem), 소식 줄 clamp(1.625rem, 3.2vw, 2.5rem), 연대 1.625rem, 결과 수 1.75rem, 목록의 연도 1.5rem, 단계 번호 2.75rem, 독자 수 clamp(4.5rem, 9vw, 7.5rem), 블록 제목 clamp(1.75rem, 3.2vw, 2.5rem), 보내기 버튼 1.5rem에 쓴다.
본문: Overpass Mono 400, 1rem, 줄 높이 1.6. 라벨은 500 또는 600. 페이지 어디에도 1rem보다 작은 글자를 쓰지 않는다. 자간은 0.04em을 넘지 않으며, 작은 대문자 라벨은 쓰지 않는다.

LAYOUT:
- 시트 하나. 머리 블록(노란 이름 블록, 페이지 내 링크 세 개, 빨간 "건물 제보하기" 블록)을 두고, 그 아래 모든 구획을 테두리 안에 쌓고 4px 선으로 나눈다. 간격은 두지 않는다.
- 히어로는 12열 격자를 쓴다. 이름은 열 12개 전체에 걸친다. 수치는 앞의 8열에 두고, 옆에 회전시킨 빨간 도장("6개 추가, 2026년 11월 16일 주")을 붙인다. 짧은 소개는 1~6열, 검색 양식은 8~12열이다. 1280x800 노트북에서는 이름과 수치가 접히는 선 위에 모두 보여야 한다.
- 검은 띠: 1945년부터 1979년까지 연도별 완공 건물 수를 5년 간격 선 위의 막대 35개로 보여 준다. 각 연도 아래에 빨간 눈금을 두고, 최고치(1968년 71개)는 노랑으로 표시한다.
- 세 상태는 비율만큼 넓은 블록으로 보여 준다(현존 731개는 흰색, 지정 341개는 노랑, 철거 212개는 빨강). 그 아래 검은 바탕에 Anton으로 소식 줄을 둔다.
- 둘러보기: 제목, 회색 바탕의 필터 막대, 결과 줄, 선이 촘촘한 표, 페이저.
- 열린 기록: 회전시킨 도장과 함께 이름을 회색 바탕에 크게 둔다. 노란 사실 시트는 1~5열, 연혁은 6~12열이다. Preston Bus Station에는 선만으로 그린 1층 평면도를 둔다.
- 제보: 검은 블록, 네 단계의 노란 블록, 빨간 블록을 회색 바탕 위에서 약 40px 겹치게 배치한다. 4px 선 아래에 두 열짜리 바닥글을 둔다.
- 900px 아래에서는 링크가 메뉴 블록으로 접혀 쌓인 목록이 열린다. 도장과 검색은 수치 아래로 내려간다. 상태 블록은 비율을 유지하는 띠 아래로 쌓인다. 820px 아래에서는 목록의 각 행이 격자가 되어 이름과 연도, 건축가, 도시와 상태 순으로 배치된다. 600px 아래에서는 제보 블록이 메뉴 안으로 들어간다.

COMPONENTS:
- 검색: 4px 테두리 입력란 위에 라벨을 두고 검정 "검색" 블록(노란 Anton 글자)을 붙인다. 검색하면 새 검색이 시작된다. 필터는 초기화되고, 목록에는 건물, 건축가, 도시, 국가로 일치하는 항목이 나온다(대소문자와 악센트는 무시한다). 포커스는 결과 줄로 옮겨 간다.
- 필터 막대: 국가는 국가별 건수가 붙은 테두리 선택 상자다. 완공 연대는 토글 버튼 네 개(aria-pressed)이며, 각 연대는 Anton 글자의 연대명과 다른 필터를 적용한 건수로 표시한다. 상태는 정사각형 견본(흰색, 노랑, 빨강)이 붙은 토글 버튼 세 개다. 눌린 상태는 검정 바탕에 노란 글자다. 어떤 조합이든 작동한다.
- 결과 줄: Anton으로 쓴 건수, 따옴표 안의 검색어, 필터가 하나라도 켜져 있으면 "필터 해제". 필터를 바꾸면 한 번만 polite 라이브 영역으로 알린다. 보여 줄 것이 없으면 자체 "필터 해제" 버튼이 있는 빈 상태가 표와 페이저를 대신한다.
- 목록: 명시적 role을 가진 표, 페이지당 10행, 최신순. 각 건물 이름은 기록을 여는 링크이며, 포커스는 기록의 이름으로 옮겨 간다. 열린 행은 검정 바탕에 8px 빨간 막대가 붙고, 이름과 연도는 노랑이며, 링크에 aria-current를 둔다.
- 페이저: "29개 중 1~10", 이전, 번호 쪽, 다음을 46px 테두리 정사각형으로 둔다. 현재 쪽은 검정 바탕에 노란 글자다. 쪽을 바꾸면 포커스는 결과 줄로 옮겨 간다.
- 기록: 노란 바탕의 사실 목록(dl, 3px 선), 연혁(또는 아직 작성되지 않았다는 줄), 출처, "목록으로 돌아가기". 이 버튼은 포커스를 행으로 돌려준다.
- 제보: "제보 시작"(또는 머리의 "건물 제보하기")을 누르면 빨간 제목 막대 아래 네 칸짜리 양식이 열린다. 항목은 건물 이름, 도시, 1945~1979년 사이의 완공 연도, 이메일이다. 오류는 각 칸 아래에 빨강으로 role="alert"와 함께 나오고, 포커스는 첫 번째 오류 칸으로 간다. 올바르게 입력하면 확인 화면으로 바뀌어 포커스를 받고, 독자가 입력한 긴 글도 줄바꿈되어 보인다.
- 모서리는 각지게 하고, 선은 2~5px 검정, 그림자는 없다. 마우스를 올리면 테두리 컨트롤이 노랗게 바뀐다. 빨간 블록은 글자에 밑줄을 긋고, 소식 링크는 밑줄이 굵어진다. 포커스는 가장자리에서 3px 떨어진 3px 빨간 윤곽선이다. 빨간 블록 위에서는 검정, 검정 검색 블록 위에서는 노랑이며, 서로 맞닿은 블록에서는 블록 안쪽에 그린다.

MOTION:
- 배경색은 120ms steps(2, end)로 바뀐다. 독자가 동작 줄이기를 요청하지 않은 경우에만 적용한다. 스스로 움직이는 것은 없다.

FORBIDDEN:
- 둥근 모서리, 그림자, 흐림, 부드러운 그라데이션, 빛 번짐(하드 스톱 그라데이션은 평면도의 점선과 구획, 모바일 비율 띠에만 씁니다)
- 카드, 알약 모양, 칩, 배지, 제목 위의 작은 라벨, 대문자 자간 라벨
- 파스텔 또는 대비가 낮은 색 조합, 세 번째 강조색, 회색 바탕 위의 빨간 글자
- 사진, 건물 일러스트, 정사각형 견본을 넘는 아이콘, 이모지
- 링크의 화살표, 가운뎃점으로 이어진 메타 문자열, 실제 순서가 아닌 것에 붙인 숫자
- 생생함, 정직함, 격자나 디자인에 관한 문구

OUTPUT:
1) 위 토큰의 CSS 사용자 지정 속성
2) 의미 있는 HTML: 검색 양식, 토글 버튼 그룹 필터, 명시적 role을 가진 표, nav 안의 페이저, 기록용 article, 라벨이 붙은 양식
3) 작동하는 검색, 건수와 빈 상태가 있는 필터, 필터된 목록의 쪽 나누기, 기록 열기, 오류와 성공 상태가 있는 양식
4) 320px부터 가로 스크롤이 없는 반응형 레이아웃. 표는 휴대폰에서 쌓인 행이 되며, 모든 컨트롤은 높이 44px 이상
5) 모든 컨트롤에 보이는 포커스, 막대 차트의 텍스트 대체 설명, 동작 줄이기 지원`;

const PROMPT_JA = `Brutalist Gridスタイルの実在するページを一つデザインする。平らなグレーの地の上に、5pxの黒枠で囲んだ白いシート。4pxの黒い罫線で区切り、黄色と赤は単色のブロックとしてのみ使う。

記録と数字を扱う、もっともらしい題材を選び、その実際の内容を書く。ページはスタイルについてのページではなく、その題材のページとして読めなければならない。ここではConcrete Index。1945年から1979年のあいだに41カ国で完成したコンクリート建築1,284件を収めた、ボランティアが運営するオンライン・アーカイブである。名称と数字、年別の完成件数、現存・指定・取り壊しの割合、絞り込みできる一覧、一件の記録、建物の提出方法を載せる。

TOKENS:
--bg: #e6e6e1 （地、フィルター帯、記録の見出し、平面図、提出エリア）
--paper: #ffffff （シート、入力欄、ボタン、赤の上の白い文字）
--ink: #111111 （文字、すべての罫線、黒い帯、押された絞り込み、開いている行）
--muted: #4d4d49 （サイトバーの補足文字のみ）
--hint: #5b5b57 （検索欄のプレースホルダーのみ）
--yellow: #ffd12f （名称ブロック、指定、事実シート、手順、枠付きコントロールのホバー、ピークの棒。黒の上の文字としては、押された絞り込み、開いたメニューのブロック、現在のページ、検索ブロック、ピークのラベル、読者数、ニュースのリンク、開いている行の名称と年）
--red: #d72600 （取り壊し、提出ブロック、提出を始める、送信ボタンとフォームのタイトルバー、ヒーローの判子、年の目盛り、開いている行の棒、エラー文字とエラー枠、フォーカスリング）
黒い領域の中の罫線は、地の色を42〜50%の不透明度で使う。開いている行の列の罫線は白の40%。他の色は使わない。白の上の赤、赤の上の白は5:1、黄の上の黒は13:1。赤い文字をグレーの地に置かない（グレーの上の判子には白い地を与える）。

TYPOGRAPHY:
フォントは二系統。Anton（400。このウェイトのみ）は、アーカイブの名称、数字、年、年代、見出し、開いている記録の名称、ボタンの語、判子に使う。語は常に大文字。年代の小文字のsはそのまま残す。Overpass Mono（400、500、600）は、すべての記録項目、ラベル、本文、コントロールに使う。索引カードにタイプで打ったように見せる。合成の太字は使わない。
名称: ヒーローのAnton min(14rem, 16.2cqi)。行の高さ0.84。二語目は中抜き（塗りは透明、2.5pxの黒の線）。600px未満では26cqi、二行、行の高さ0.92。
数字: Anton min(5.5rem, 8.2cqi)、行の高さ0.9。600px未満では12.6cqi。
H2: Anton clamp(2.5rem, 5.4vw, 4.5rem)、行の高さ0.9。開いている記録の名称: Anton clamp(2.5rem, 12vw, 9rem)、行の高さ0.92。H3: Anton 2rem。
Antonはこのほかに次の要素でも使う。名称ブロック1.75rem、提出ブロック1.3125rem、判子1.75rem、状態別の数字 clamp(3rem, 5vw, 4.25rem)、ニュース行 clamp(1.625rem, 3.2vw, 2.5rem)、年代1.625rem、結果の件数1.75rem、一覧の年1.5rem、手順番号2.75rem、読者数 clamp(4.5rem, 9vw, 7.5rem)、ブロックの見出し clamp(1.75rem, 3.2vw, 2.5rem)、送信ボタン1.5rem。
本文: Overpass Mono 400、1rem、行の高さ1.6。ラベルは500または600。ページのどこにも1remより小さい文字を使わない。字間は0.04emを超えない。小さな大文字ラベルは使わない。

LAYOUT:
- シート一枚。ヘッダーのブロック（黄色の名称ブロック、ページ内リンク三つ、赤の「建物を提出」ブロック）を置き、その下にすべての区画を枠の中に積み上げ、4pxの罫線で区切る。間隔は空けない。
- ヒーローは12列のグリッド。名称は12列すべてにまたがる。数字は最初の8列に置き、その横に回転させた赤い判子（「6件追加、2026年11月16日の週」）を付ける。短い紹介文は1〜6列、検索フォームは8〜12列。1280x800のノートPCでは、名称と数字が折り目より上に完全に収まる。
- 黒い帯: 1945年から1979年までの年別完成件数を、5年ごとの罫線の上の35本の棒で示す。各年の下に赤い目盛りを付け、ピーク（1968年の71件）は黄色。
- 三つの状態は、その割合の幅を持つブロックで示す（現存731件は白、指定341件は黄色、取り壊し212件は赤）。その下に、黒の上のAntonでニュース行を置く。
- 一覧: 見出し、グレーの上のフィルター帯、結果の行、罫線の詰まった表、ページャー。
- 開いている記録: 回転させた判子とともに、大きな名称をグレーの上に置く。黄色の事実シートは1〜5列、経緯は6〜12列。Preston Bus Stationでは、罫線だけで描いた1階平面図を置く。
- 提出: 黒のブロック、四つの手順からなる黄色のブロック、赤のブロックを、グレーの地の上で約40px重ねて並べる。4pxの罫線の下に二列のフッター。
- 900px未満では、リンクがメニューブロックにまとまり、開くと縦に積まれた一覧になる。判子と検索は件数の下に移る。状態は割合を保つ帯の下に積まれる。820px未満では一覧の各行が格子になり、名称と年、建築家、都市と状態の順になる。600px未満では提出ブロックがメニューに移る。

COMPONENTS:
- 検索: 4pxの枠の入力欄の上にラベル、黒い「検索」ブロック（黄色のAnton）。検索すると新しい検索が始まる。絞り込みはリセットされ、一覧には一致するものが出る（大文字小文字と発音記号は無視し、建物名、建築家、都市、国で照合する）。フォーカスは結果の行へ移る。
- フィルター帯: 国は国別件数付きの枠付きセレクト。完成年代は四つのトグルボタン（aria-pressed）で、各年代はAntonの年代名と、ほかの絞り込みを適用した件数。状態は、四角い見本（白、黄、赤）付きのトグルボタン三つ。押された状態は黒地に黄色の文字。どの組み合わせも機能する。
- 結果の行: Antonの件数、引用符付きの検索語、絞り込みが一つでもかかっている間は「絞り込みを解除」。絞り込みを変えた際は、polite のライブ領域で一度だけ知らせる。表示するものがないときは、専用の「絞り込みを解除」を持つ空の状態が、表とページャーに代わる。
- 一覧: 明示的なロールを持つ表、1ページ10行、新しい順。各建物名は記録を開くリンクで、フォーカスは記録の名称へ移る。開いている行は黒地に8pxの赤い棒が付き、名称と年は黄色、リンクにはaria-current。
- ページャー: 「29件中 1〜10」、前へ、番号付きのページ、次へを、46pxの枠付き正方形で置く。現在のページは黒地に黄色の文字。ページを変えるとフォーカスは結果の行へ移る。
- 記録: 黄色の上に3pxの罫線を引いた事実のdl、経緯（または未作成であることを示す一行）、出典、「一覧に戻る」。戻ると、フォーカスは行に戻る。
- 提出: 「提出を始める」（またはヘッダーの「建物を提出」）で、赤いタイトルバーの下に四項目の入力欄が開く。建物名、都市、1945〜1979年の完成年、メールアドレス。エラーは各項目の下に赤でrole="alert"付きで出し、フォーカスは最初の誤りへ移る。正しく入力すると確認画面に置き換わり、そこがフォーカスを受け、読者が入力した長い文も折り返して表示する。
- 角は四角、2〜5pxの黒い罫線、影なし。ホバーで枠付きコントロールが黄色になる。赤いブロックは語に下線を引き、ニュースのリンクは下線が太くなる。フォーカスは縁から3px離れた3pxの赤い輪郭。赤いブロックの上では黒、黒の検索ブロックの上では黄色、互いに接するブロックでは、ブロックの内側に描く。

MOTION:
- 背景色は120ms steps(2, end)で変わる。読者が動きの軽減を求めていない場合に限る。自ら動くものはない。

FORBIDDEN:
- 丸い角、影、ぼかし、滑らかなグラデーション、グロー（ハードストップのグラデーションは、平面図の点線と区画、モバイルの比率帯にだけ使う）
- カード、ピル型、チップ、バッジ、見出しの上の小さなラベル、大文字で字間を空けたラベル
- パステルや低コントラストの組み合わせ、第三のアクセント色、グレーの上の赤い文字
- 写真、建物のイラスト、正方形の見本を超えるアイコン、絵文字
- リンクの矢印、中黒でつないだメタ文字列、実際の順序ではないものへの数字
- 生々しさ、正直さ、グリッドやデザインについてのコピー

OUTPUT:
1) 上のトークンのCSSカスタムプロパティ
2) 意味のあるHTML: 検索フォーム、トグルボタンのグループによるフィルター、明示的なロールを持つ表、nav内のページャー、記録のためのarticle、ラベル付きのフォーム
3) 動く検索、件数と空の状態を持つフィルター、絞り込み後の一覧のページ送り、記録を開くこと、エラーと成功の状態を持つフォーム
4) 320pxから横スクロールのないレスポンシブレイアウト。表は携帯端末では積み重なった行になり、すべてのコントロールは高さ44px以上
5) すべてのコントロールに見えるフォーカス、棒グラフのテキスト代替、動きの軽減への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

interface Filters {
  country: CountryId | 'all';
  decades: Decade[];
  states: BuildingState[];
  query: string;
}

const START_FILTERS: Filters = { country: 'all', decades: [1960], states: [], query: '' };
const NO_FILTERS: Filters = { country: 'all', decades: [], states: [], query: '' };

// A building passes when it matches every filter except the one being counted.
function matches(building: Building, filters: Filters, lang: Lang, skip?: 'country' | 'decade') {
  if (skip !== 'country' && filters.country !== 'all' && building.country !== filters.country) return false;
  if (skip !== 'decade' && filters.decades.length > 0 && !filters.decades.includes(decadeOf(building.year))) return false;
  if (filters.states.length > 0 && !filters.states.includes(building.state)) return false;
  const query = fold(filters.query.trim());
  if (query) {
    const country = countryOf(building.country);
    const haystack = fold([building.name, building.architect, building.city, country.name.en, country.name[lang]].join(' '));
    if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
  }
  return true;
}

const newestFirst = (a: Building, b: Building) => b.year - a.year || a.name.localeCompare(b.name, 'en');

export function PortedBrutalistGridPage({ lang }: PortedStylePageProps) {
  const t = (text: Tri) => text[lang];

  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [filters, setFilters] = useState<Filters>(START_FILTERS);
  const [page, setPage] = useState(1);
  const [news, setNews] = useState('');
  const [openId, setOpenId] = useState(OPENED_FIRST);
  const [stage, setStage] = useState<'closed' | 'open' | 'sent'>('closed');
  const [entry, setEntry] = useState<Entry>(EMPTY);
  const [sent, setSent] = useState<Entry>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLTableSectionElement>(null);
  const recordRef = useRef<HTMLElement>(null);
  const recordNameRef = useRef<HTMLHeadingElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  // Read only in event handlers, after the form has rendered.
  const inputOf = (field: Field) => ({ name: nameRef, city: cityRef, year: yearRef, email: emailRef })[field].current;

  const results = useMemo(() => BUILDINGS.filter((building) => matches(building, filters, lang)).sort(newestFirst), [filters, lang]);
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const filtered = filters.country !== 'all' || filters.decades.length > 0 || filters.states.length > 0 || filters.query !== '';

  const decadeCount = (decade: Decade) =>
    BUILDINGS.filter((building) => decadeOf(building.year) === decade && matches(building, filters, lang, 'decade')).length;
  const countryCount = (id: CountryId) => BUILDINGS.filter((building) => building.country === id && matches(building, filters, lang, 'country')).length;

  // The result line in words. The search is shown in it, so the reader sees what was looked for.
  const countTemplate = (n: number, query: string) => {
    if (n === 0) return t(query ? BROWSE.zeroQuery : BROWSE.zero);
    if (n === 1) return t(query ? BROWSE.oneQuery : BROWSE.one);
    return t(query ? BROWSE.manyQuery : BROWSE.many);
  };
  const [countBefore, countAfter = ''] = countTemplate(results.length, filters.query).split('{n}');

  const open = BUILDINGS.find((building) => building.id === openId) ?? BUILDINGS[0];
  const record = RECORDS[open.id];
  const openCountry = countryOf(open.country);

  // A filter control keeps focus, so its result is announced once in the live region.
  const applyFilters = (next: Filters) => {
    setFilters(next);
    setPage(1);
    const n = BUILDINGS.filter((building) => matches(building, next, lang)).length;
    setNews(n === 0 ? t(BROWSE.none) : fill(countTemplate(n, next.query), { n, q: next.query }));
  };

  const toggleDecade = (decade: Decade) => {
    const on = filters.decades.includes(decade);
    applyFilters({ ...filters, decades: on ? filters.decades.filter((item) => item !== decade) : [...filters.decades, decade].sort() });
  };

  const toggleState = (state: BuildingState) => {
    const on = filters.states.includes(state);
    applyFilters({ ...filters, states: on ? filters.states.filter((item) => item !== state) : STATES.filter((item) => item === state || filters.states.includes(item)) });
  };

  // Actions that start a new view move focus to the result line, which reads the count.
  const showResults = (next: Filters, bring: 'filters' | 'result' | 'none') => {
    flushSync(() => {
      setFilters(next);
      setPage(1);
      setDraft(next.query);
      setNews('');
    });
    if (bring === 'filters') filtersRef.current?.scrollIntoView({ block: 'start' });
    if (bring === 'result') resultRef.current?.scrollIntoView({ block: 'start' });
    resultRef.current?.focus({ preventScroll: bring !== 'none' });
  };

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showResults({ ...NO_FILTERS, query: draft.trim() }, 'filters');
  };

  const showLost = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    showResults({ ...NO_FILTERS, states: ['demolished'] }, 'filters');
  };

  const clearFilters = () => showResults(NO_FILTERS, 'none');

  const goToPage = (next: number) => {
    flushSync(() => {
      setPage(next);
      setNews('');
    });
    resultRef.current?.scrollIntoView({ block: 'start' });
    resultRef.current?.focus({ preventScroll: true });
  };

  const openRecord = (event: MouseEvent, id: string) => {
    event.preventDefault();
    flushSync(() => setOpenId(id));
    recordRef.current?.scrollIntoView({ block: 'start' });
    recordNameRef.current?.focus({ preventScroll: true });
  };

  // The record hands focus back to its row, or to the result line when the row is on another page.
  const backToListing = () => {
    const link = listRef.current?.querySelector<HTMLAnchorElement>(`[data-row="${openId}"] a`);
    if (link) link.focus();
    else resultRef.current?.focus();
  };

  const onHeaderKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  };

  const openForm = () => {
    flushSync(() => setStage('open'));
    formRef.current?.scrollIntoView({ block: 'start' });
    inputOf('name')?.focus({ preventScroll: true });
  };

  const goToSubmit = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    if (stage === 'sent') {
      doneRef.current?.scrollIntoView({ block: 'start' });
      doneRef.current?.focus({ preventScroll: true });
      return;
    }
    openForm();
  };

  const cancelForm = () => {
    flushSync(() => {
      setStage('closed');
      setErrors({});
    });
    startRef.current?.focus();
  };

  const validate = (value: Entry): Errors => {
    const found: Errors = {};
    if (!value.name.trim()) found.name = FORM.nameError;
    if (!value.city.trim()) found.city = FORM.cityError;
    const year = value.year.trim();
    if (!/^\d{4}$/.test(year)) found.year = FORM.yearError;
    else if (Number(year) < 1945 || Number(year) > 1979) found.year = FORM.rangeError;
    if (!EMAIL_PATTERN.test(value.email.trim())) found.email = FORM.emailError;
    return found;
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(entry);
    const first = (['name', 'city', 'year', 'email'] as Field[]).find((field) => found[field]);
    if (first) {
      // The errors render first, so the field and its message come into view together.
      flushSync(() => setErrors(found));
      const input = inputOf(first);
      input?.focus();
      input?.parentElement?.scrollIntoView({ block: 'nearest' });
      return;
    }
    flushSync(() => {
      setSent({ name: entry.name.trim(), city: entry.city.trim(), year: entry.year.trim(), email: entry.email.trim() });
      setErrors({});
      setStage('sent');
    });
    doneRef.current?.focus();
  };

  const another = () => {
    flushSync(() => {
      setEntry(EMPTY);
      setStage('open');
    });
    inputOf('name')?.focus();
  };

  const edit = (field: Field, value: string) => {
    setEntry({ ...entry, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const stateCell = (building: Building) => (building.state === 'demolished' && building.gone ? fill(t(BROWSE.gone), { y: building.gone }) : t(STATE_NAME[building.state]));

  const stateFact = (building: Building) => {
    if (building.state === 'standing') return t(RECORD.standingFact);
    if (building.state === 'demolished') return fill(t(RECORD.goneFact), { y: building.gone ?? '' });
    return building.listing ? fill(t(RECORD.listedNoteFact), { note: t(building.listing) }) : t(RECORD.listedFact);
  };

  const stampLine = (building: Building) => {
    if (building.state === 'standing') return t(RECORD.notListed);
    if (building.state === 'demolished') return String(building.gone ?? '');
    return building.listing ? t(building.listing) : t(RECORD.protected);
  };

  const visited = formatDate(open.visited, lang);
  const facts: Array<{ term: string; value: string }> = record?.facts
    ? record.facts.map((fact) => ({ term: t(fact.term), value: t(fact.value) }))
    : [
        { term: t(RECORD.architects), value: open.architect },
        { term: t(RECORD.finished), value: String(open.year) },
        { term: t(RECORD.city), value: `${open.city}, ${t(openCountry.name)}` },
        { term: t(RECORD.state), value: stateFact(open) },
        { term: t(RECORD.entry), value: fill(t(open.state === 'demolished' ? RECORD.siteFact : RECORD.entryFact), { id: open.id, date: visited }) },
      ];

  const navLinks = (
    <>
      <a href="#ci-browse" aria-current="page" onClick={() => setMenuOpen(false)}>{t(HEAD.buildings)}</a>
      <a href="#ci-years" onClick={() => setMenuOpen(false)}>{t(HEAD.years)}</a>
      <a href="#ci-browse" onClick={showLost}>{t(HEAD.lost)}</a>
    </>
  );

  const fieldProps = (field: Field) => ({
    id: `ci-${field}`,
    value: entry[field],
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': [field === 'year' ? 'ci-year-hint' : '', errors[field] ? `ci-${field}-error` : ''].filter(Boolean).join(' ') || undefined,
    onChange: (event: { target: { value: string } }) => edit(field, event.target.value),
  });

  const fieldError = (field: Field) =>
    errors[field] ? <p className="ci-error" id={`ci-${field}-error`} role="alert">{t(errors[field])}</p> : null;

  return (
    <FusionShell
      fusionId="brutalist-grid"
      lang={lang}
      tone="light"
      accent="#d72600"
      prev={{ href: '/pages/prompt-tips', label: 'Prompt Tips — Web Stylebook' }}
      next={{ href: '/pages/editorial-silence.html', label: 'Editorial Silence' }}
      prompts={PROMPTS}
    >
      <div className="ci">
        <div className="ci-sheet">
          <header className={`ci-top${menuOpen ? ' is-open' : ''}`} onKeyDown={onHeaderKey}>
            <div className="ci-top__row">
              <p className="ci-mark">{NAME}</p>
              <nav className="ci-nav" aria-label={t(HEAD.nav)}>{navLinks}</nav>
              <a className="ci-cta" href="#ci-submit" onClick={goToSubmit}>{t(HEAD.submit)}</a>
              <button
                ref={menuButtonRef}
                className="ci-menu-button"
                type="button"
                aria-expanded={menuOpen}
                aria-controls="ci-menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {t(HEAD.menu)}
              </button>
            </div>
            <nav className="ci-menu" id="ci-menu" aria-label={t(HEAD.nav)} hidden={!menuOpen}>
              {navLinks}
              <a className="ci-menu__submit" href="#ci-submit" onClick={goToSubmit}>{t(HEAD.submit)}</a>
            </nav>
          </header>

          <section className="ci-hero" aria-labelledby="ci-title">
            <h1 className="ci-mega" id="ci-title">
              <span>{NAME_SOLID}</span> <span className="ci-hollow">{NAME_HOLLOW}</span>
            </h1>
            <p className="ci-count">{place(t(HERO.count), 'br', <br />)}</p>
            <p className="ci-stamp ci-stamp--red"><b>{t(HERO.added)}</b><span>{t(HERO.week)}</span></p>
            <p className="ci-intro">{t(HERO.intro)}</p>
            <form className="ci-search" role="search" onSubmit={search}>
              <label htmlFor="ci-q">{t(HERO.search)}</label>
              <div className="ci-search__row">
                <input id="ci-q" type="search" autoComplete="off" placeholder={t(HERO.example)} value={draft} onChange={(event) => setDraft(event.target.value)} />
                <button type="submit">{t(HERO.go)}</button>
              </div>
            </form>
          </section>

          <section className="ci-years" id="ci-years" aria-labelledby="ci-years-title">
            <div className="ci-years__head">
              <h2 id="ci-years-title">{t(YEARS.title)}</h2>
              <p>{t(YEARS.peak)}</p>
            </div>
            <div className="ci-bars" role="img" aria-label={t(YEARS.chart)}>
              {PER_YEAR.map((n, index) => (
                <i key={1945 + index} className={n === PEAK ? 'is-peak' : undefined} style={{ '--n': n } as Vars}>
                  {n === PEAK ? <b aria-hidden="true">{n}</b> : null}
                </i>
              ))}
            </div>
            <div className="ci-axis" aria-hidden="true">
              {AXIS.map((year) => <span key={year}>{year}</span>)}
            </div>
          </section>

          <ul className="ci-states" aria-label={t(STATES_TEXT.label)}>
            {SHARES.map((item) => (
              <li key={item.state} className={`ci-st ci-st--${item.state}`}>
                <b>{item.count}</b>
                <span>{t(STATES_TEXT.share[item.state])} <em>{item.share}</em></span>
              </li>
            ))}
          </ul>

          <p className="ci-news">
            {t(STATES_TEXT.news)} <a href="#ci-browse" onClick={showLost}>{t(STATES_TEXT.see)}</a>
          </p>

          <section className="ci-browse" id="ci-browse" aria-labelledby="ci-browse-title">
            <div className="ci-browse__head">
              <h2 className="ci-h2" id="ci-browse-title">{t(BROWSE.title)}</h2>
              <p>{fill(t(BROWSE.note), { n: BUILDINGS.length })}</p>
            </div>

            <div className="ci-filters" ref={filtersRef} role="group" aria-label={t(BROWSE.filters)}>
              <div className="ci-f">
                <label className="ci-f__label" htmlFor="ci-country">{t(BROWSE.country)}</label>
                <div className="ci-select">
                  <select
                    id="ci-country"
                    value={filters.country}
                    onChange={(event) => applyFilters({ ...filters, country: event.target.value as CountryId | 'all' })}
                  >
                    <option value="all">{t(BROWSE.allCountries)}</option>
                    {COUNTRIES.map((item) => (
                      <option key={item.id} value={item.id}>{t(item.name)} ({countryCount(item.id)})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="ci-f" role="group" aria-labelledby="ci-decade-label">
                <p className="ci-f__label" id="ci-decade-label">{t(BROWSE.decade)}</p>
                <div className="ci-seg ci-seg--decade">
                  {DECADES.map((decade) => (
                    <button key={decade} type="button" className="ci-dec" aria-pressed={filters.decades.includes(decade)} onClick={() => toggleDecade(decade)}>
                      <b>{fill(t(BROWSE.decadeName), { d: decade })}</b>{' '}
                      <span>{decadeCount(decade)}<span className="ci-sr"> {t(BROWSE.inDecade)}</span></span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="ci-f" role="group" aria-labelledby="ci-state-label">
                <p className="ci-f__label" id="ci-state-label">{t(BROWSE.state)}</p>
                <div className="ci-seg ci-seg--state">
                  {STATES.map((state) => (
                    <button key={state} type="button" aria-pressed={filters.states.includes(state)} onClick={() => toggleState(state)}>
                      <i className={`ci-sw ci-sw--${state}`} aria-hidden="true" />
                      {t(STATE_NAME[state])}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ci-result">
              <p className="ci-result__count" ref={resultRef} tabIndex={-1}>
                {fill(countBefore, { q: filters.query })}
                <b>{results.length}</b>
                {fill(countAfter, { q: filters.query })}
              </p>
              {filtered && results.length > 0 ? <button className="ci-clear" type="button" onClick={clearFilters}>{t(BROWSE.clear)}</button> : null}
            </div>
            <p className="ci-sr" role="status">{news}</p>

            {results.length === 0 ? (
              <div className="ci-empty">
                <p className="ci-empty__title">{t(BROWSE.noneTitle)}</p>
                <p>{t(BROWSE.noneBody)}</p>
                <button className="ci-clear ci-clear--big" type="button" onClick={clearFilters}>{t(BROWSE.clear)}</button>
              </div>
            ) : (
              <>
                <table className="ci-list" role="table">
                  <caption className="ci-sr">{fill(t(BROWSE.caption), { p: current, pages })}</caption>
                  <colgroup>
                    <col className="ci-list__c1" />
                    <col className="ci-list__c2" />
                    <col className="ci-list__c3" />
                    <col className="ci-list__c4" />
                    <col className="ci-list__c5" />
                  </colgroup>
                  <thead role="rowgroup">
                    <tr role="row">
                      <th role="columnheader" scope="col">{t(BROWSE.colBuilding)}</th>
                      <th role="columnheader" scope="col">{t(BROWSE.colArchitect)}</th>
                      <th role="columnheader" scope="col">{t(BROWSE.colCity)}</th>
                      <th role="columnheader" scope="col">{t(BROWSE.colYear)}</th>
                      <th role="columnheader" scope="col">{t(BROWSE.colState)}</th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup" ref={listRef}>
                    {rows.map((building) => {
                      const isOpen = building.id === openId;
                      return (
                        <tr
                          key={building.id}
                          role="row"
                          data-row={building.id}
                          className={isOpen ? 'is-open' : undefined}
                          onClick={(event) => {
                            if (!(event.target as HTMLElement).closest('a')) openRecord(event, building.id);
                          }}
                        >
                          <th className="ci-list__name" role="rowheader" scope="row" data-label={t(BROWSE.colBuilding)}>
                            <a href="#ci-record" aria-current={isOpen ? 'true' : undefined} onClick={(event) => openRecord(event, building.id)}>{building.name}</a>
                          </th>
                          <td className="ci-list__arch" role="cell" data-label={t(BROWSE.colArchitect)}>{building.architect}</td>
                          <td className="ci-list__city" role="cell" data-label={t(BROWSE.colCity)}>{building.city}, {t(countryOf(building.country).short)}</td>
                          <td className="ci-list__yr" role="cell" data-label={t(BROWSE.colYear)}>{building.year}</td>
                          <td className="ci-list__state" role="cell" data-label={t(BROWSE.colState)}>
                            <span className="ci-state"><i className={`ci-sw ci-sw--${building.state}`} aria-hidden="true" />{stateCell(building)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <nav className="ci-pager" aria-label={t(BROWSE.pages)}>
                  <p>{fill(t(BROWSE.range), { from: (current - 1) * PER_PAGE + 1, to: (current - 1) * PER_PAGE + rows.length, n: results.length })}</p>
                  {pages > 1 ? (
                    <ol>
                      {current > 1 ? <li><button type="button" onClick={() => goToPage(current - 1)}>{t(BROWSE.previous)}</button></li> : null}
                      {Array.from({ length: pages }, (_, index) => index + 1).map((n) => (
                        <li key={n}>
                          <button type="button" aria-current={n === current ? 'page' : undefined} onClick={() => goToPage(n)}>{n}</button>
                        </li>
                      ))}
                      {current < pages ? <li><button type="button" onClick={() => goToPage(current + 1)}>{t(BROWSE.next)}</button></li> : null}
                    </ol>
                  ) : null}
                </nav>
              </>
            )}
          </section>

          <article className="ci-record" id="ci-record" ref={recordRef} aria-labelledby="ci-record-name">
            <header className="ci-record__head">
              <h2 className="ci-rec-name" id="ci-record-name" ref={recordNameRef} tabIndex={-1}>{open.name}</h2>
              <p className={`ci-stamp ci-stamp--${open.state === 'demolished' ? 'red' : 'ink'}`}>
                <b>{t(STATE_NAME[open.state])}</b>
                <span>{stampLine(open)}</span>
              </p>
            </header>
            <div className="ci-record__body">
              <dl className="ci-facts">
                {facts.map((fact) => (
                  <div key={fact.term}>
                    <dt>{fact.term}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="ci-history">
                <h3>{t(RECORD.history)}</h3>
                {record ? record.history.map((paragraph) => <p key={paragraph.en}>{t(paragraph)}</p>) : <p>{t(RECORD.noHistory)}</p>}
                <p className="ci-src">{record?.sources ? t(record.sources) : fill(t(RECORD.sources), { date: visited })}</p>
                <button className="ci-back" type="button" onClick={backToListing}>{t(RECORD.back)}</button>
              </div>
            </div>
            {record?.plan ? (
              <figure className="ci-plan">
                <div className="ci-plan__head">
                  <h3>{t(RECORD.planTitle)}</h3>
                  <p>{t(RECORD.planNote)}</p>
                </div>
                <div className="ci-draw" role="img" aria-label={t(RECORD.planAlt)}>
                  <div className="ci-road" />
                  <div className="ci-bld">
                    <div className="ci-bays"><span className="ci-tag" aria-hidden="true">{t(RECORD.stands)}</span></div>
                    <div className="ci-hall"><span className="ci-tag" aria-hidden="true">{t(RECORD.concourse)}</span></div>
                    <div className="ci-bays"><span className="ci-tag" aria-hidden="true">{t(RECORD.stands)}</span></div>
                  </div>
                  <div className="ci-road" />
                </div>
                <figcaption className="ci-dim"><span>{t(RECORD.roads)}</span><span>{t(RECORD.scale)}</span></figcaption>
              </figure>
            ) : null}
          </article>

          <section className="ci-submit" id="ci-submit" aria-labelledby="ci-submit-title">
            <div className="ci-sub-a">
              <h2 className="ci-h2" id="ci-submit-title">{t(SUBMIT.title)}</h2>
              <p>{t(SUBMIT.note)}</p>
              <p className="ci-readers"><b>1,031</b><span>{t(SUBMIT.readers)}</span></p>
            </div>
            <ol className="ci-steps" aria-label={t(SUBMIT.steps)}>
              {STEPS.map((step, index) => (
                <li key={step.en}>
                  <b aria-hidden="true">{index + 1}</b>
                  <p>{t(step)}</p>
                </li>
              ))}
            </ol>

            {stage === 'closed' ? (
              <button ref={startRef} className="ci-start" type="button" onClick={openForm}>
                <b>{t(SUBMIT.start)}</b>
                <span>{t(SUBMIT.startNote)}</span>
              </button>
            ) : null}

            {stage === 'open' ? (
              <form className="ci-form" ref={formRef} noValidate onSubmit={send} aria-labelledby="ci-form-title">
                <h3 className="ci-form__title" id="ci-form-title">{t(FORM.title)}</h3>
                <div className="ci-form__grid">
                  <div className={`ci-field${errors.name ? ' is-invalid' : ''}`}>
                    <label htmlFor="ci-name">{t(FORM.name)}</label>
                    <input {...fieldProps('name')} ref={nameRef} type="text" autoComplete="off" />
                    {fieldError('name')}
                  </div>
                  <div className={`ci-field${errors.city ? ' is-invalid' : ''}`}>
                    <label htmlFor="ci-city">{t(FORM.city)}</label>
                    <input {...fieldProps('city')} ref={cityRef} type="text" autoComplete="address-level2" />
                    {fieldError('city')}
                  </div>
                  <div className={`ci-field${errors.year ? ' is-invalid' : ''}`}>
                    <label htmlFor="ci-year">{t(FORM.year)}</label>
                    <input {...fieldProps('year')} ref={yearRef} type="text" inputMode="numeric" autoComplete="off" maxLength={4} />
                    <p className="ci-field__hint" id="ci-year-hint">{t(FORM.yearHint)}</p>
                    {fieldError('year')}
                  </div>
                  <div className={`ci-field${errors.email ? ' is-invalid' : ''}`}>
                    <label htmlFor="ci-email">{t(FORM.email)}</label>
                    <input {...fieldProps('email')} ref={emailRef} type="email" autoComplete="email" spellCheck={false} />
                    {fieldError('email')}
                  </div>
                </div>
                <div className="ci-form__actions">
                  <button className="ci-send" type="submit">{t(FORM.send)}</button>
                  <button className="ci-cancel" type="button" onClick={cancelForm}>{t(FORM.cancel)}</button>
                </div>
              </form>
            ) : null}

            {stage === 'sent' ? (
              <div className="ci-done" ref={doneRef} tabIndex={-1}>
                <p className="ci-done__title">{fill(t(FORM.doneTitle), { name: sent.name, city: sent.city })}</p>
                <p>{fill(t(FORM.doneBody), { year: sent.year, email: sent.email })}</p>
                <button className="ci-another" type="button" onClick={another}>{t(FORM.another)}</button>
              </div>
            ) : null}
          </section>

          <footer className="ci-foot">
            <p>{t(FOOT.kept)}</p>
            <p>{t(FOOT.reuse)}</p>
          </footer>
        </div>
      </div>
    </FusionShell>
  );
}
