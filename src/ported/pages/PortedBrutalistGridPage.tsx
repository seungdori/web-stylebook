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
  { id: 'uk', name: { en: 'United Kingdom', ko: 'United Kingdom', ja: 'United Kingdom' }, short: { en: 'UK', ko: 'UK', ja: 'UK' } },
  { id: 'us', name: { en: 'United States', ko: 'United States', ja: 'United States' }, short: { en: 'US', ko: 'US', ja: 'US' } },
  { id: 'de', name: { en: 'Germany', ko: 'Germany', ja: 'Germany' }, short: { en: 'Germany', ko: 'Germany', ja: 'Germany' } },
  { id: 'fr', name: { en: 'France', ko: 'France', ja: 'France' }, short: { en: 'France', ko: 'France', ja: 'France' } },
  { id: 'jp', name: { en: 'Japan', ko: 'Japan', ja: 'Japan' }, short: { en: 'Japan', ko: 'Japan', ja: 'Japan' } },
  { id: 'br', name: { en: 'Brazil', ko: 'Brazil', ja: 'Brazil' }, short: { en: 'Brazil', ko: 'Brazil', ja: 'Brazil' } },
  { id: 'it', name: { en: 'Italy', ko: 'Italy', ja: 'Italy' }, short: { en: 'Italy', ko: 'Italy', ja: 'Italy' } },
  { id: 'ca', name: { en: 'Canada', ko: 'Canada', ja: 'Canada' }, short: { en: 'Canada', ko: 'Canada', ja: 'Canada' } },
  { id: 'es', name: { en: 'Spain', ko: 'Spain', ja: 'Spain' }, short: { en: 'Spain', ko: 'Spain', ja: 'Spain' } },
  { id: 'rs', name: { en: 'Serbia', ko: 'Serbia', ja: 'Serbia' }, short: { en: 'Serbia', ko: 'Serbia', ja: 'Serbia' } },
  { id: 'ge', name: { en: 'Georgia', ko: 'Georgia', ja: 'Georgia' }, short: { en: 'Georgia', ko: 'Georgia', ja: 'Georgia' } },
  { id: 'ie', name: { en: 'Ireland', ko: 'Ireland', ja: 'Ireland' }, short: { en: 'Ireland', ko: 'Ireland', ja: 'Ireland' } },
  { id: 'mx', name: { en: 'Mexico', ko: 'Mexico', ja: 'Mexico' }, short: { en: 'Mexico', ko: 'Mexico', ja: 'Mexico' } },
  { id: 'ar', name: { en: 'Argentina', ko: 'Argentina', ja: 'Argentina' }, short: { en: 'Argentina', ko: 'Argentina', ja: 'Argentina' } },
  { id: 'in', name: { en: 'India', ko: 'India', ja: 'India' }, short: { en: 'India', ko: 'India', ja: 'India' } },
];

const countryOf = (id: CountryId) => COUNTRIES.find((item) => item.id === id) ?? COUNTRIES[0];

// How a listing is written on the record's stamp and in its State fact.
const LISTING = {
  grade2: { en: 'Grade II', ko: 'Grade II', ja: 'Grade II' },
  grade2star: { en: 'Grade II*', ko: 'Grade II*', ja: 'Grade II*' },
  worldHeritage: { en: 'World Heritage, 2016', ko: 'World Heritage, 2016', ja: 'World Heritage, 2016' },
  monument: { en: 'Listed monument', ko: 'Listed monument', ja: 'Listed monument' },
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
  { id: 'CI-0318', name: 'Busáras', architect: 'Michael Scott', city: 'Dublin', country: 'ie', year: 1953, state: 'listed', listing: { en: 'Protected structure', ko: 'Protected structure', ja: 'Protected structure' }, visited: '2026-02-11' },
  { id: 'CI-0011', name: 'Notre-Dame du Haut', architect: 'Le Corbusier', city: 'Ronchamp', country: 'fr', year: 1955, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-06-22' },
  { id: 'CI-0544', name: 'Hiroshima Peace Memorial Museum', architect: 'Kenzo Tange', city: 'Hiroshima', country: 'jp', year: 1955, state: 'listed', listing: { en: 'Important Cultural Property, 2006', ko: 'Important Cultural Property, 2006', ja: 'Important Cultural Property, 2006' }, visited: '2026-04-03' },
  { id: 'CI-0602', name: 'Palazzetto dello Sport', architect: 'Pier Luigi Nervi, Annibale Vitellozzi', city: 'Rome', country: 'it', year: 1957, state: 'standing', visited: '2026-09-17' },
  { id: 'CI-0388', name: "St Joseph's Church", architect: 'Auguste Perret', city: 'Le Havre', country: 'fr', year: 1957, state: 'listed', listing: { en: 'Monument historique', ko: 'Monument historique', ja: 'Monument historique' }, visited: '2026-07-01' },
  { id: 'CI-0547', name: 'Kagawa Prefectural Government Office', architect: 'Kenzo Tange', city: 'Takamatsu', country: 'jp', year: 1958, state: 'listed', listing: { en: 'Important Cultural Property, 2022', ko: 'Important Cultural Property, 2022', ja: 'Important Cultural Property, 2022' }, visited: '2026-04-06' },
  { id: 'CI-0271', name: 'Corbusierhaus', architect: 'Le Corbusier', city: 'Berlin', country: 'de', year: 1958, state: 'listed', listing: LISTING.monument, visited: '2026-08-12' },
  { id: 'CI-0710', name: 'Los Manantiales', architect: 'Félix Candela, Joaquín Álvarez Ordóñez', city: 'Mexico City', country: 'mx', year: 1958, state: 'standing', visited: '2026-01-27' },
  { id: 'CI-0154', name: 'Alton West Estate', architect: "LCC Architects' Department", city: 'London', country: 'uk', year: 1959, state: 'listed', listing: LISTING.grade2star, visited: '2026-03-21' },
  { id: 'CI-0019', name: 'Sainte-Marie de La Tourette', architect: 'Le Corbusier', city: 'Éveux', country: 'fr', year: 1960, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-06-24' },
  { id: 'CI-0821', name: 'National Congress', architect: 'Oscar Niemeyer', city: 'Brasília', country: 'br', year: 1960, state: 'listed', visited: '2026-02-19' },
  { id: 'CI-0035', name: 'Park Hill', architect: 'Jack Lynn, Ivor Smith', city: 'Sheffield', country: 'uk', year: 1961, state: 'listed', listing: { en: 'Grade II*, 1998', ko: 'Grade II*, 1998', ja: 'Grade II*, 1998' }, visited: '2026-09-05' },
  { id: 'CI-0466', name: 'Plymouth Civic Centre', architect: 'Hector Stirling; Jellicoe, Ballantyne and Coleridge', city: 'Plymouth', country: 'uk', year: 1962, state: 'listed', listing: { en: 'Grade II, 2007', ko: 'Grade II, 2007', ja: 'Grade II, 2007' }, visited: '2026-05-30' },
  { id: 'CI-0905', name: 'Palace of Assembly', architect: 'Le Corbusier', city: 'Chandigarh', country: 'in', year: 1962, state: 'listed', listing: LISTING.worldHeritage, visited: '2026-01-15' },
  { id: 'CI-0503', name: 'Yale Art and Architecture Building', architect: 'Paul Rudolph', city: 'New Haven', country: 'us', year: 1963, state: 'standing', visited: '2026-04-25' },
  { id: 'CI-0517', name: 'Marina City', architect: 'Bertrand Goldberg', city: 'Chicago', country: 'us', year: 1964, state: 'listed', listing: { en: 'Chicago Landmark, 2016', ko: 'Chicago Landmark, 2016', ja: 'Chicago Landmark, 2016' }, visited: '2026-05-18' },
  { id: 'CI-0551', name: 'Yoyogi National Gymnasium', architect: 'Kenzo Tange', city: 'Tokyo', country: 'jp', year: 1964, state: 'listed', listing: { en: 'Important Cultural Property, 2021', ko: 'Important Cultural Property, 2021', ja: 'Important Cultural Property, 2021' }, visited: '2026-04-09' },
  { id: 'CI-0297', name: 'Hutchesontown C', architect: 'Basil Spence', city: 'Glasgow', country: 'uk', year: 1965, state: 'demolished', gone: 1993, visited: '2026-08-27' },
  { id: 'CI-0509', name: 'Salk Institute', architect: 'Louis Kahn', city: 'La Jolla', country: 'us', year: 1965, state: 'standing', visited: '2026-03-02' },
  { id: 'CI-0187', name: 'Centre Point', architect: 'Richard Seifert and Partners', city: 'London', country: 'uk', year: 1966, state: 'listed', listing: { en: 'Grade II, 1995', ko: 'Grade II, 1995', ja: 'Grade II, 1995' }, visited: '2026-10-14' },
  { id: 'CI-0201', name: 'Tricorn Centre', architect: 'Owen Luder Partnership', city: 'Portsmouth', country: 'uk', year: 1966, state: 'demolished', gone: 2004, visited: '2026-07-22' },
  { id: 'CI-0333', name: "St Peter's Seminary", architect: 'Gillespie, Kidd and Coia', city: 'Cardross', country: 'uk', year: 1966, state: 'listed', listing: { en: 'Category A, 1992', ko: 'Category A, 1992', ja: 'Category A, 1992' }, visited: '2026-08-29' },
  { id: 'CI-0642', name: 'Dunelm House', architect: "Architects' Co-Partnership", city: 'Durham', country: 'uk', year: 1966, state: 'listed', listing: { en: 'Grade II, 2021', ko: 'Grade II, 2021', ja: 'Grade II, 2021' }, visited: '2026-09-11' },
  { id: 'CI-0521', name: 'Breuer Building', architect: 'Marcel Breuer', city: 'New York', country: 'us', year: 1966, state: 'standing', visited: '2026-05-12' },
  { id: 'CI-0559', name: 'Kyoto International Conference Center', architect: 'Sachio Otani', city: 'Kyoto', country: 'jp', year: 1966, state: 'standing', visited: '2026-04-11' },
  { id: 'CI-0731', name: 'Bank of London and South America', architect: 'Clorindo Testa, SEPRA', city: 'Buenos Aires', country: 'ar', year: 1966, state: 'standing', visited: '2026-02-06' },
  { id: 'CI-0214', name: 'Trinity Square car park', architect: 'Owen Luder Partnership', city: 'Gateshead', country: 'uk', year: 1967, state: 'demolished', gone: 2010, visited: '2026-09-08' },
  { id: 'CI-0090', name: 'Balfron Tower', architect: 'Ernő Goldfinger', city: 'London', country: 'uk', year: 1967, state: 'listed', listing: LISTING.grade2star, visited: '2026-10-21' },
  { id: 'CI-0377', name: 'Metropolitan Cathedral', architect: 'Frederick Gibberd', city: 'Liverpool', country: 'uk', year: 1967, state: 'listed', listing: LISTING.grade2star, visited: '2026-06-03' },
  { id: 'CI-0612', name: 'Habitat 67', architect: 'Moshe Safdie', city: 'Montreal', country: 'ca', year: 1967, state: 'listed', listing: { en: 'Heritage site, 2009', ko: 'Heritage site, 2009', ja: 'Heritage site, 2009' }, visited: '2026-05-23' },
  { id: 'CI-0145', name: 'Hayward Gallery', architect: "GLC Architects' Department", city: 'London', country: 'uk', year: 1968, state: 'standing', visited: '2026-10-17' },
  { id: 'CI-0266', name: 'Pilgrimage Church, Neviges', architect: 'Gottfried Böhm', city: 'Velbert', country: 'de', year: 1968, state: 'listed', listing: LISTING.monument, visited: '2026-08-15' },
  { id: 'CI-0528', name: 'Boston City Hall', architect: 'Kallmann McKinnell and Knowles', city: 'Boston', country: 'us', year: 1968, state: 'standing', visited: '2026-05-14' },
  { id: 'CI-0533', name: 'Everson Museum of Art', architect: 'I. M. Pei', city: 'Syracuse', country: 'us', year: 1968, state: 'standing', visited: '2026-05-16' },
  { id: 'CI-0830', name: 'São Paulo Museum of Art', architect: 'Lina Bo Bardi', city: 'São Paulo', country: 'br', year: 1968, state: 'listed', listing: { en: 'Listed by IPHAN, 2003', ko: 'Listed by IPHAN, 2003', ja: 'Listed by IPHAN, 2003' }, visited: '2026-02-24' },
  { id: 'CI-0419', name: 'Preston Bus Station', architect: 'Building Design Partnership', city: 'Preston', country: 'uk', year: 1969, state: 'listed', listing: { en: 'Grade II, 2013', ko: 'Grade II, 2013', ja: 'Grade II, 2013' }, visited: '2026-10-02' },
  { id: 'CI-0660', name: 'Torres Blancas', architect: 'Francisco Javier Sáenz de Oiza', city: 'Madrid', country: 'es', year: 1969, state: 'standing', visited: '2026-07-09' },
  { id: 'CI-0834', name: 'Faculty of Architecture and Urbanism, USP', architect: 'Vilanova Artigas, Carlos Cascaldi', city: 'São Paulo', country: 'br', year: 1969, state: 'listed', visited: '2026-02-26' },
  { id: 'CI-0230', name: 'Welbeck Street car park', architect: 'Michael Blampied and Partners', city: 'London', country: 'uk', year: 1970, state: 'demolished', gone: 2019, visited: '2026-10-19' },
  { id: 'CI-0249', name: 'Pimlico School', architect: "John Bancroft, GLC Architects' Department", city: 'London', country: 'uk', year: 1970, state: 'demolished', gone: 2010, visited: '2026-03-28' },
  { id: 'CI-0540', name: 'Geisel Library', architect: 'William Pereira', city: 'San Diego', country: 'us', year: 1970, state: 'standing', visited: '2026-03-04' },
  { id: 'CI-0825', name: 'Cathedral of Brasília', architect: 'Oscar Niemeyer', city: 'Brasília', country: 'br', year: 1970, state: 'listed', visited: '2026-02-18' },
  { id: 'CI-0537', name: 'Government Service Center', architect: 'Paul Rudolph', city: 'Boston', country: 'us', year: 1971, state: 'standing', visited: '2026-05-15' },
  { id: 'CI-0098', name: 'Brunswick Centre', architect: 'Patrick Hodgkinson', city: 'London', country: 'uk', year: 1972, state: 'listed', listing: { en: 'Grade II, 2000', ko: 'Grade II, 2000', ja: 'Grade II, 2000' }, visited: '2026-10-10' },
  { id: 'CI-0093', name: 'Trellick Tower', architect: 'Ernő Goldfinger', city: 'London', country: 'uk', year: 1972, state: 'listed', listing: { en: 'Grade II*, 1998', ko: 'Grade II*, 1998', ja: 'Grade II*, 1998' }, visited: '2026-10-24' },
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
  { id: 'CI-0064', name: 'National Theatre', architect: 'Denys Lasdun', city: 'London', country: 'uk', year: 1976, state: 'listed', listing: { en: 'Grade II*, 1994', ko: 'Grade II*, 1994', ja: 'Grade II*, 1994' }, visited: '2026-10-12' },
  { id: 'CI-0001', name: 'Barbican Estate', architect: 'Chamberlin, Powell and Bon', city: 'London', country: 'uk', year: 1976, state: 'listed', listing: { en: 'Grade II, 2001', ko: 'Grade II, 2001', ja: 'Grade II, 2001' }, visited: '2026-11-03' },
  { id: 'CI-0578', name: 'Hubert H. Humphrey Building', architect: 'Marcel Breuer', city: 'Washington', country: 'us', year: 1977, state: 'standing', visited: '2026-04-30' },
  { id: 'CI-0744', name: 'Western City Gate', architect: 'Mihajlo Mitrović', city: 'Belgrade', country: 'rs', year: 1977, state: 'standing', visited: '2026-08-07' },
  { id: 'CI-0071', name: 'Alexandra Road Estate', architect: 'Neave Brown', city: 'London', country: 'uk', year: 1978, state: 'listed', listing: { en: 'Grade II*, 1993', ko: 'Grade II*, 1993', ja: 'Grade II*, 1993' }, visited: '2026-11-05' },
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
      { term: { en: 'Architects', ko: 'Architects', ja: 'Architects' }, value: { en: 'Building Design Partnership: Keith Ingham, Charles Wilson', ko: 'Building Design Partnership: Keith Ingham, Charles Wilson', ja: 'Building Design Partnership: Keith Ingham, Charles Wilson' } },
      { term: { en: 'Opened', ko: 'Opened', ja: 'Opened' }, value: { en: '12 October 1969', ko: '12 October 1969', ja: '12 October 1969' } },
      { term: { en: 'Address', ko: 'Address', ja: 'Address' }, value: { en: 'Tithebarn Street, Preston, Lancashire, UK', ko: 'Tithebarn Street, Preston, Lancashire, UK', ja: 'Tithebarn Street, Preston, Lancashire, UK' } },
      { term: { en: 'Use', ko: 'Use', ja: 'Use' }, value: { en: 'Bus station, with a multi-storey car park above', ko: 'Bus station, with a multi-storey car park above', ja: 'Bus station, with a multi-storey car park above' } },
      { term: { en: 'Bus stands', ko: 'Bus stands', ja: 'Bus stands' }, value: { en: '80 until 2017, now 40', ko: '80 until 2017, now 40', ja: '80 until 2017, now 40' } },
      { term: { en: 'State', ko: 'State', ja: 'State' }, value: { en: 'Listed Grade II on 23 September 2013', ko: 'Listed Grade II on 23 September 2013', ja: 'Listed Grade II on 23 September 2013' } },
      { term: { en: 'Owner', ko: 'Owner', ja: 'Owner' }, value: { en: 'Lancashire County Council, since 2014', ko: 'Lancashire County Council, since 2014', ja: 'Lancashire County Council, since 2014' } },
      { term: { en: 'Entry', ko: 'Entry', ja: 'Entry' }, value: { en: 'CI-0419, last visited 2 October 2026', ko: 'CI-0419, last visited 2 October 2026', ja: 'CI-0419, last visited 2 October 2026' } },
    ],
    history: [
      {
        en: 'Building Design Partnership designed the station for Preston Corporation. It opened in October 1969 with 80 stands along its two long sides and a car park on the floors above. The curved concrete edges of the parking floors run the whole length of the building.',
        ko: 'Building Design Partnership designed the station for Preston Corporation. It opened in October 1969 with 80 stands along its two long sides and a car park on the floors above. The curved concrete edges of the parking floors run the whole length of the building.',
        ja: 'Building Design Partnership designed the station for Preston Corporation. It opened in October 1969 with 80 stands along its two long sides and a car park on the floors above. The curved concrete edges of the parking floors run the whole length of the building.',
      },
      {
        en: 'By 2012 the city council planned to demolish it and build on the site. Two applications to list it had already been turned down. After a public campaign it was listed at Grade II in September 2013.',
        ko: 'By 2012 the city council planned to demolish it and build on the site. Two applications to list it had already been turned down. After a public campaign it was listed at Grade II in September 2013.',
        ja: 'By 2012 the city council planned to demolish it and build on the site. Two applications to list it had already been turned down. After a public campaign it was listed at Grade II in September 2013.',
      },
      {
        en: 'Lancashire County Council took it over from the city council for £1. The stands were rebuilt and renumbered in 2017, leaving 40, and the station reopened in July 2018.',
        ko: 'Lancashire County Council took it over from the city council for £1. The stands were rebuilt and renumbered in 2017, leaving 40, and the station reopened in July 2018.',
        ja: 'Lancashire County Council took it over from the city council for £1. The stands were rebuilt and renumbered in 2017, leaving 40, and the station reopened in July 2018.',
      },
    ],
    sources: {
      en: 'Sources: Historic England list entry 1416042; Twentieth Century Society case file; site visits in 2019, 2023 and 2026.',
      ko: 'Sources: Historic England list entry 1416042; Twentieth Century Society case file; site visits in 2019, 2023 and 2026.',
      ja: 'Sources: Historic England list entry 1416042; Twentieth Century Society case file; site visits in 2019, 2023 and 2026.',
    },
    plan: true,
  },
  'CI-0035': {
    history: [
      {
        en: "Sheffield's city architects built Park Hill on the slope above the railway station, with decks wide enough for a milk float on every third floor, so that the neighbours of the cleared streets could keep living along a street.",
        ko: "Sheffield's city architects built Park Hill on the slope above the railway station, with decks wide enough for a milk float on every third floor, so that the neighbours of the cleared streets could keep living along a street.",
        ja: "Sheffield's city architects built Park Hill on the slope above the railway station, with decks wide enough for a milk float on every third floor, so that the neighbours of the cleared streets could keep living along a street.",
      },
      {
        en: 'It was listed at Grade II* in 1998. Urban Splash has been refurbishing it block by block since 2009, keeping the concrete frame and replacing the brick infill with coloured panels.',
        ko: 'It was listed at Grade II* in 1998. Urban Splash has been refurbishing it block by block since 2009, keeping the concrete frame and replacing the brick infill with coloured panels.',
        ja: 'It was listed at Grade II* in 1998. Urban Splash has been refurbishing it block by block since 2009, keeping the concrete frame and replacing the brick infill with coloured panels.',
      },
    ],
  },
  'CI-0201': {
    history: [
      {
        en: 'A shopping centre, market and car park by Owen Luder Partnership, with Rodney Gordon as its designer. It opened in 1966 and never filled its shops.',
        ko: 'A shopping centre, market and car park by Owen Luder Partnership, with Rodney Gordon as its designer. It opened in 1966 and never filled its shops.',
        ja: 'A shopping centre, market and car park by Owen Luder Partnership, with Rodney Gordon as its designer. It opened in 1966 and never filled its shops.',
      },
      {
        en: 'The city council demolished it in 2004. Pieces of its concrete were sold to people who wanted to keep one.',
        ko: 'The city council demolished it in 2004. Pieces of its concrete were sold to people who wanted to keep one.',
        ja: 'The city council demolished it in 2004. Pieces of its concrete were sold to people who wanted to keep one.',
      },
    ],
  },
  'CI-0121': {
    history: [
      {
        en: 'Two long slabs with access decks around a planted mound, designed by Alison and Peter Smithson for the Greater London Council and finished in 1972.',
        ko: 'Two long slabs with access decks around a planted mound, designed by Alison and Peter Smithson for the Greater London Council and finished in 1972.',
        ja: 'Two long slabs with access decks around a planted mound, designed by Alison and Peter Smithson for the Greater London Council and finished in 1972.',
      },
      {
        en: 'Campaigns to have it listed failed, and demolition of the west block began in 2017. The Victoria and Albert Museum kept a three-storey section of its facade.',
        ko: 'Campaigns to have it listed failed, and demolition of the west block began in 2017. The Victoria and Albert Museum kept a three-storey section of its facade.',
        ja: 'Campaigns to have it listed failed, and demolition of the west block began in 2017. The Victoria and Albert Museum kept a three-storey section of its facade.',
      },
    ],
  },
  'CI-0565': {
    history: [
      {
        en: 'Kisho Kurokawa hung 140 factory-made capsules on two concrete cores. Each capsule was a studio, meant to be replaced every 25 years.',
        ko: 'Kisho Kurokawa hung 140 factory-made capsules on two concrete cores. Each capsule was a studio, meant to be replaced every 25 years.',
        ja: 'Kisho Kurokawa hung 140 factory-made capsules on two concrete cores. Each capsule was a studio, meant to be replaced every 25 years.',
      },
      {
        en: 'None was ever replaced. The tower was taken down in 2022, and 23 capsules were kept for museums and reuse.',
        ko: 'None was ever replaced. The tower was taken down in 2022, and 23 capsules were kept for museums and reuse.',
        ja: 'None was ever replaced. The tower was taken down in 2022, and 23 capsules were kept for museums and reuse.',
      },
    ],
  },
  'CI-0257': {
    history: [
      {
        en: "John Madin's library opened in 1974, an inverted ziggurat of reading floors around an open atrium.",
        ko: "John Madin's library opened in 1974, an inverted ziggurat of reading floors around an open atrium.",
        ja: "John Madin's library opened in 1974, an inverted ziggurat of reading floors around an open atrium.",
      },
      {
        en: 'The city moved the library to a new building in 2013. Listing was refused, and Madin’s building was demolished in 2016.',
        ko: 'The city moved the library to a new building in 2013. Listing was refused, and Madin’s building was demolished in 2016.',
        ja: 'The city moved the library to a new building in 2013. Listing was refused, and Madin’s building was demolished in 2016.',
      },
    ],
  },
  'CI-0612': {
    history: [
      {
        en: "Moshe Safdie's student thesis, built for Expo 67: 354 precast concrete boxes stacked into 146 homes, each with a garden on the roof of the one below.",
        ko: "Moshe Safdie's student thesis, built for Expo 67: 354 precast concrete boxes stacked into 146 homes, each with a garden on the roof of the one below.",
        ja: "Moshe Safdie's student thesis, built for Expo 67: 354 precast concrete boxes stacked into 146 homes, each with a garden on the roof of the one below.",
      },
      {
        en: 'The Quebec government classified it as a heritage site in 2009.',
        ko: 'The Quebec government classified it as a heritage site in 2009.',
        ja: 'The Quebec government classified it as a heritage site in 2009.',
      },
    ],
  },
  'CI-0519': {
    history: [
      {
        en: "Bertrand Goldberg set four rounded wings of patients' rooms on a concrete core, cantilevered over a square base.",
        ko: "Bertrand Goldberg set four rounded wings of patients' rooms on a concrete core, cantilevered over a square base.",
        ja: "Bertrand Goldberg set four rounded wings of patients' rooms on a concrete core, cantilevered over a square base.",
      },
      {
        en: 'Northwestern University demolished it in 2014 for a research building, after a campaign to save it that went to court.',
        ko: 'Northwestern University demolished it in 2014 for a research building, after a campaign to save it that went to court.',
        ja: 'Northwestern University demolished it in 2014 for a research building, after a campaign to save it that went to court.',
      },
    ],
  },
  'CI-0001': {
    history: [
      {
        en: 'Homes for about 4,000 people on a City of London site bombed flat in 1940: three towers, long terrace blocks over a podium and a lake.',
        ko: 'Homes for about 4,000 people on a City of London site bombed flat in 1940: three towers, long terrace blocks over a podium and a lake.',
        ja: 'Homes for about 4,000 people on a City of London site bombed flat in 1940: three towers, long terrace blocks over a podium and a lake.',
      },
      {
        en: 'The estate was finished in 1976 and listed at Grade II in 2001. The arts centre at its heart opened in 1982.',
        ko: 'The estate was finished in 1976 and listed at Grade II in 2001. The arts centre at its heart opened in 1982.',
        ja: 'The estate was finished in 1976 and listed at Grade II in 2001. The arts centre at its heart opened in 1982.',
      },
    ],
  },
  'CI-0064': {
    history: [
      {
        en: "Denys Lasdun's terraces step down towards the Thames and hold three theatres under two fly towers.",
        ko: "Denys Lasdun's terraces step down towards the Thames and hold three theatres under two fly towers.",
        ja: "Denys Lasdun's terraces step down towards the Thames and hold three theatres under two fly towers.",
      },
      {
        en: 'The Queen opened it in October 1976. It was listed at Grade II* in 1994.',
        ko: 'The Queen opened it in October 1976. It was listed at Grade II* in 1994.',
        ja: 'The Queen opened it in October 1976. It was listed at Grade II* in 1994.',
      },
    ],
  },
};

const HEAD = {
  nav: { en: 'Index', ko: 'Index', ja: 'Index' },
  buildings: { en: 'Buildings', ko: 'Buildings', ja: 'Buildings' },
  years: { en: 'By year', ko: 'By year', ja: 'By year' },
  lost: { en: 'Lost buildings', ko: 'Lost buildings', ja: 'Lost buildings' },
  submit: { en: 'Submit a building', ko: 'Submit a building', ja: 'Submit a building' },
  menu: { en: 'Menu', ko: 'Menu', ja: 'Menu' },
} satisfies Record<string, Tri>;

const HERO = {
  count: { en: '1,284 buildings, {br}41 countries', ko: '1,284 buildings, {br}41 countries', ja: '1,284 buildings, {br}41 countries' },
  added: { en: '6 added', ko: '6 added', ja: '6 added' },
  week: { en: 'week of 16 Nov 2026', ko: 'week of 16 Nov 2026', ja: 'week of 16 Nov 2026' },
  intro: {
    en: 'A record of concrete buildings finished between 1945 and 1979: who designed them, where they are, and whether they are still there. Every entry is checked against planning records and visited at least once.',
    ko: 'A record of concrete buildings finished between 1945 and 1979: who designed them, where they are, and whether they are still there. Every entry is checked against planning records and visited at least once.',
    ja: 'A record of concrete buildings finished between 1945 and 1979: who designed them, where they are, and whether they are still there. Every entry is checked against planning records and visited at least once.',
  },
  search: { en: 'Search by building, architect or city', ko: 'Search by building, architect or city', ja: 'Search by building, architect or city' },
  example: { en: 'Barbican', ko: 'Barbican', ja: 'Barbican' },
  go: { en: 'Search', ko: 'Search', ja: 'Search' },
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
  title: { en: 'Buildings in the index by year finished', ko: 'Buildings in the index by year finished', ja: 'Buildings in the index by year finished' },
  peak: { en: '71 were finished in 1968, more than in any other year.', ko: '71 were finished in 1968, more than in any other year.', ja: '71 were finished in 1968, more than in any other year.' },
  chart: {
    en: 'Bar chart: buildings per year from 1945 to 1979, rising from 2 in 1945 to a peak of 71 in 1968, then falling to 29 in 1979.',
    ko: 'Bar chart: buildings per year from 1945 to 1979, rising from 2 in 1945 to a peak of 71 in 1968, then falling to 29 in 1979.',
    ja: 'Bar chart: buildings per year from 1945 to 1979, rising from 2 in 1945 to a peak of 71 in 1968, then falling to 29 in 1979.',
  },
} satisfies Record<string, Tri>;

// The whole index by state. The stylesheet makes each block as wide as its share.
const SHARES: Array<{ state: BuildingState; count: string; share: string }> = [
  { state: 'standing', count: '731', share: '57%' },
  { state: 'listed', count: '341', share: '27%' },
  { state: 'demolished', count: '212', share: '17%' },
];

const STATE_NAME: Record<BuildingState, Tri> = {
  standing: { en: 'Standing', ko: 'Standing', ja: 'Standing' },
  listed: { en: 'Listed', ko: 'Listed', ja: 'Listed' },
  demolished: { en: 'Demolished', ko: 'Demolished', ja: 'Demolished' },
};

const STATES_TEXT = {
  label: { en: 'The index by state', ko: 'The index by state', ja: 'The index by state' },
  share: {
    standing: { en: 'standing', ko: 'standing', ja: 'standing' },
    listed: { en: 'listed', ko: 'listed', ja: 'listed' },
    demolished: { en: 'demolished', ko: 'demolished', ja: 'demolished' },
  } satisfies Record<BuildingState, Tri>,
  news: {
    en: 'Nine buildings in the index came down this year. Fourteen more have demolition applications pending.',
    ko: 'Nine buildings in the index came down this year. Fourteen more have demolition applications pending.',
    ja: 'Nine buildings in the index came down this year. Fourteen more have demolition applications pending.',
  },
  see: { en: 'See the demolished buildings', ko: 'See the demolished buildings', ja: 'See the demolished buildings' },
};

const BROWSE = {
  title: { en: 'Browse the index', ko: 'Browse the index', ja: 'Browse the index' },
  note: {
    en: 'Records keep their facts, sources and history, including for buildings that have since come down. Listed here are the {n} checked on a site visit this year.',
    ko: 'Records keep their facts, sources and history, including for buildings that have since come down. Listed here are the {n} checked on a site visit this year.',
    ja: 'Records keep their facts, sources and history, including for buildings that have since come down. Listed here are the {n} checked on a site visit this year.',
  },
  filters: { en: 'Filter the listing', ko: 'Filter the listing', ja: 'Filter the listing' },
  country: { en: 'Country', ko: 'Country', ja: 'Country' },
  allCountries: { en: 'All countries', ko: 'All countries', ja: 'All countries' },
  decade: { en: 'Decade finished', ko: 'Decade finished', ja: 'Decade finished' },
  decadeName: { en: '{d}s', ko: '{d}s', ja: '{d}s' },
  inDecade: { en: 'buildings', ko: 'buildings', ja: 'buildings' },
  state: { en: 'State', ko: 'State', ja: 'State' },
  many: { en: '{n} buildings, newest first', ko: '{n} buildings, newest first', ja: '{n} buildings, newest first' },
  manyQuery: { en: '{n} buildings matching “{q}”, newest first', ko: '{n} buildings matching “{q}”, newest first', ja: '{n} buildings matching “{q}”, newest first' },
  one: { en: '{n} building', ko: '{n} building', ja: '{n} building' },
  oneQuery: { en: '{n} building matching “{q}”', ko: '{n} building matching “{q}”', ja: '{n} building matching “{q}”' },
  zero: { en: '{n} buildings', ko: '{n} buildings', ja: '{n} buildings' },
  zeroQuery: { en: '{n} buildings matching “{q}”', ko: '{n} buildings matching “{q}”', ja: '{n} buildings matching “{q}”' },
  clear: { en: 'Clear filters', ko: 'Clear filters', ja: 'Clear filters' },
  noneTitle: { en: 'No buildings match.', ko: 'No buildings match.', ja: 'No buildings match.' },
  noneBody: {
    en: 'Check the spelling, try the architect or the city instead, or take a filter off.',
    ko: 'Check the spelling, try the architect or the city instead, or take a filter off.',
    ja: 'Check the spelling, try the architect or the city instead, or take a filter off.',
  },
  none: { en: 'No buildings match.', ko: 'No buildings match.', ja: 'No buildings match.' },
  caption: { en: 'Buildings, page {p} of {pages}', ko: 'Buildings, page {p} of {pages}', ja: 'Buildings, page {p} of {pages}' },
  colBuilding: { en: 'Building', ko: 'Building', ja: 'Building' },
  colArchitect: { en: 'Architect', ko: 'Architect', ja: 'Architect' },
  colCity: { en: 'City', ko: 'City', ja: 'City' },
  colYear: { en: 'Finished', ko: 'Finished', ja: 'Finished' },
  colState: { en: 'State', ko: 'State', ja: 'State' },
  gone: { en: 'Demolished {y}', ko: 'Demolished {y}', ja: 'Demolished {y}' },
  pages: { en: 'Pages', ko: 'Pages', ja: 'Pages' },
  range: { en: '{from} to {to} of {n}', ko: '{from} to {to} of {n}', ja: '{from} to {to} of {n}' },
  previous: { en: 'Previous', ko: 'Previous', ja: 'Previous' },
  next: { en: 'Next', ko: 'Next', ja: 'Next' },
} satisfies Record<string, Tri>;

const RECORD = {
  label: { en: 'Open record', ko: 'Open record', ja: 'Open record' },
  architects: { en: 'Architects', ko: 'Architects', ja: 'Architects' },
  finished: { en: 'Finished', ko: 'Finished', ja: 'Finished' },
  city: { en: 'City', ko: 'City', ja: 'City' },
  state: { en: 'State', ko: 'State', ja: 'State' },
  entry: { en: 'Entry', ko: 'Entry', ja: 'Entry' },
  standingFact: { en: 'Standing, not listed', ko: 'Standing, not listed', ja: 'Standing, not listed' },
  listedFact: { en: 'Listed', ko: 'Listed', ja: 'Listed' },
  listedNoteFact: { en: 'Listed: {note}', ko: 'Listed: {note}', ja: 'Listed: {note}' },
  goneFact: { en: 'Demolished in {y}', ko: 'Demolished in {y}', ja: 'Demolished in {y}' },
  entryFact: { en: '{id}, last visited {date}', ko: '{id}, last visited {date}', ja: '{id}, last visited {date}' },
  siteFact: { en: '{id}, site last visited {date}', ko: '{id}, site last visited {date}', ja: '{id}, site last visited {date}' },
  notListed: { en: 'Not listed', ko: 'Not listed', ja: 'Not listed' },
  protected: { en: 'Protected', ko: 'Protected', ja: 'Protected' },
  history: { en: 'History', ko: 'History', ja: 'History' },
  noHistory: {
    en: 'No history has been written for this record yet. Volunteers write one after a second visit.',
    ko: 'No history has been written for this record yet. Volunteers write one after a second visit.',
    ja: 'No history has been written for this record yet. Volunteers write one after a second visit.',
  },
  sources: { en: 'Sources: planning records; site visit on {date}.', ko: 'Sources: planning records; site visit on {date}.', ja: 'Sources: planning records; site visit on {date}.' },
  back: { en: 'Back to the listing', ko: 'Back to the listing', ja: 'Back to the listing' },
  planTitle: { en: 'Ground floor, 1969', ko: 'Ground floor, 1969', ja: 'Ground floor, 1969' },
  planNote: {
    en: 'Simplified. Buses pulled in nose first at 40 stands on each long side and reversed out. Passengers waited in the concourse between the two rows.',
    ko: 'Simplified. Buses pulled in nose first at 40 stands on each long side and reversed out. Passengers waited in the concourse between the two rows.',
    ja: 'Simplified. Buses pulled in nose first at 40 stands on each long side and reversed out. Passengers waited in the concourse between the two rows.',
  },
  planAlt: {
    en: 'Plan: a long rectangle with a row of 40 stands along each long side, the concourse between them, and a bus road outside each row.',
    ko: 'Plan: a long rectangle with a row of 40 stands along each long side, the concourse between them, and a bus road outside each row.',
    ja: 'Plan: a long rectangle with a row of 40 stands along each long side, the concourse between them, and a bus road outside each row.',
  },
  stands: { en: '40 stands', ko: '40 stands', ja: '40 stands' },
  concourse: { en: 'Concourse', ko: 'Concourse', ja: 'Concourse' },
  roads: { en: 'Dashed lines: bus roads', ko: 'Dashed lines: bus roads', ja: 'Dashed lines: bus roads' },
  scale: { en: 'Not to scale', ko: 'Not to scale', ja: 'Not to scale' },
} satisfies Record<string, Tri>;

const SUBMIT = {
  title: { en: 'Submit a building', ko: 'Submit a building', ja: 'Submit a building' },
  note: {
    en: 'Anything in concrete finished between 1945 and 1979, in any country, standing or gone. About 30 come in each month.',
    ko: 'Anything in concrete finished between 1945 and 1979, in any country, standing or gone. About 30 come in each month.',
    ja: 'Anything in concrete finished between 1945 and 1979, in any country, standing or gone. About 30 come in each month.',
  },
  readers: { en: 'of the 1,284 entries were sent in by readers.', ko: 'of the 1,284 entries were sent in by readers.', ja: 'of the 1,284 entries were sent in by readers.' },
  steps: { en: 'How a submission works', ko: 'How a submission works', ja: 'How a submission works' },
  start: { en: 'Start a submission', ko: 'Start a submission', ja: 'Start a submission' },
  startNote: { en: 'Four fields now. Photographs come later, by email.', ko: 'Four fields now. Photographs come later, by email.', ja: 'Four fields now. Photographs come later, by email.' },
} satisfies Record<string, Tri>;

const STEPS: Tri[] = [
  {
    en: 'Search the index first. If the building is there, add your photographs to its record instead.',
    ko: 'Search the index first. If the building is there, add your photographs to its record instead.',
    ja: 'Search the index first. If the building is there, add your photographs to its record instead.',
  },
  {
    en: 'Send its name, the city and the year it was finished, with the short form here.',
    ko: 'Send its name, the city and the year it was finished, with the short form here.',
    ja: 'Send its name, the city and the year it was finished, with the short form here.',
  },
  {
    en: 'We email you a link for three photographs you took yourself, one of them showing the whole building.',
    ko: 'We email you a link for three photographs you took yourself, one of them showing the whole building.',
    ja: 'We email you a link for three photographs you took yourself, one of them showing the whole building.',
  },
  {
    en: 'A volunteer checks the planning records and replies within 21 days.',
    ko: 'A volunteer checks the planning records and replies within 21 days.',
    ja: 'A volunteer checks the planning records and replies within 21 days.',
  },
];

type Field = 'name' | 'city' | 'year' | 'email';
type Entry = Record<Field, string>;
type Errors = Partial<Record<Field, Tri>>;

const EMPTY: Entry = { name: '', city: '', year: '', email: '' };

const FORM = {
  title: { en: 'Your building', ko: 'Your building', ja: 'Your building' },
  name: { en: 'Building name', ko: 'Building name', ja: 'Building name' },
  city: { en: 'Town or city', ko: 'Town or city', ja: 'Town or city' },
  year: { en: 'Year finished', ko: 'Year finished', ja: 'Year finished' },
  yearHint: { en: 'From 1945 to 1979', ko: 'From 1945 to 1979', ja: 'From 1945 to 1979' },
  email: { en: 'Your email', ko: 'Your email', ja: 'Your email' },
  send: { en: 'Send the building', ko: 'Send the building', ja: 'Send the building' },
  cancel: { en: 'Cancel', ko: 'Cancel', ja: 'Cancel' },
  nameError: { en: "Write the building's name, or its address if it has none.", ko: "Write the building's name, or its address if it has none.", ja: "Write the building's name, or its address if it has none." },
  cityError: { en: 'Write the town or city it stands in, or stood in.', ko: 'Write the town or city it stands in, or stood in.', ja: 'Write the town or city it stands in, or stood in.' },
  yearError: { en: 'Write the year it was finished as four digits, like 1968.', ko: 'Write the year it was finished as four digits, like 1968.', ja: 'Write the year it was finished as four digits, like 1968.' },
  rangeError: { en: 'The index takes buildings finished from 1945 to 1979.', ko: 'The index takes buildings finished from 1945 to 1979.', ja: 'The index takes buildings finished from 1945 to 1979.' },
  emailError: { en: 'Write an email address we can reply to, like name@example.com.', ko: 'Write an email address we can reply to, like name@example.com.', ja: 'Write an email address we can reply to, like name@example.com.' },
  doneTitle: { en: 'Received: {name}, {city}', ko: 'Received: {name}, {city}', ja: 'Received: {name}, {city}' },
  doneBody: {
    en: 'Thank you. A volunteer checks the planning records for a building finished in {year} and writes to {email} within 21 days, with the link for your photographs.',
    ko: 'Thank you. A volunteer checks the planning records for a building finished in {year} and writes to {email} within 21 days, with the link for your photographs.',
    ja: 'Thank you. A volunteer checks the planning records for a building finished in {year} and writes to {email} within 21 days, with the link for your photographs.',
  },
  another: { en: 'Submit another building', ko: 'Submit another building', ja: 'Submit another building' },
} satisfies Record<string, Tri>;

const FOOT = {
  kept: {
    en: 'Concrete Index is kept by four volunteers in Leeds and 380 contributors.',
    ko: 'Concrete Index is kept by four volunteers in Leeds and 380 contributors.',
    ja: 'Concrete Index is kept by four volunteers in Leeds and 380 contributors.',
  },
  reuse: {
    en: 'Text may be reused with a credit; photographs belong to the people who took them. The whole index is published as a CSV file each January.',
    ko: 'Text may be reused with a credit; photographs belong to the people who took them. The whole index is published as a CSV file each January.',
    ja: 'Text may be reused with a credit; photographs belong to the people who took them. The whole index is published as a CSV file each January.',
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

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

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
