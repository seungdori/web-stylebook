import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedEditorialSilencePage.css';

// The book page of The Salt Year, a debut novel from Weir House, a small press in
// Colchester, in the Editorial Silence style. Spectral sets everything that belongs to
// the book: the title page, the first lines, the two-page spread, the reviews and the
// dates of the readings. Spectral SC opens a chapter in small capitals. Instrument Sans
// sets everything that belongs to the shop: prices, ISBNs, forms and buttons.
// Components come from the book and its publisher: a title page with the order details
// in its outer margin, the novel's first lines set as an epigraph, a spread with running
// head, chapter sinkage and folios, an edition chooser as a ruled table, jacket quotes
// with their sources in the margin, and dated bookshop readings you can reserve.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const PRESS = 'Weir House';
const TITLE = 'The Salt Year';
const AUTHOR = 'Clare Avenell';
const ISBN_HARDBACK = '978-1-916834-00-2';

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const money = (pence: number) => `£${(pence / 100).toFixed(2)}`;

// Copy marks small capitals with <sc>…</sc> and titles of books with <i>…</i>, so a
// translation can keep them where its own sentence puts them.
function rich(text: string): ReactNode[] {
  return text.split(/(<sc>.*?<\/sc>|<i>.*?<\/i>)/).map((part, index) => {
    const caps = /^<sc>(.*)<\/sc>$/.exec(part);
    if (caps) return <span key={index} className="sy-sc">{caps[1]}</span>;
    const title = /^<i>(.*)<\/i>$/.exec(part);
    if (title) return <i key={index}>{title[1]}</i>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BAR = {
  nav: { en: 'This book', ko: 'This book', ja: 'This book' },
  extract: { en: 'Extract', ko: 'Extract', ja: 'Extract' },
  editions: { en: 'Editions', ko: 'Editions', ja: 'Editions' },
  readings: { en: 'Readings', ko: 'Readings', ja: 'Readings' },
  basket: { en: 'Basket ({n})', ko: 'Basket ({n})', ja: 'Basket ({n})' },
} satisfies Record<string, Tri>;

const TITLE_PAGE = {
  kind: { en: 'A novel', ko: 'A novel', ja: 'A novel' },
  what: { en: 'Hardback, 288 pages', ko: 'Hardback, 288 pages', ja: 'Hardback, 288 pages' },
  when: { en: 'Published 1 October 2026', ko: 'Published 1 October 2026', ja: 'Published 1 October 2026' },
  order: { en: 'Order the hardback', ko: 'Order the hardback', ja: 'Order the hardback' },
  also: { en: 'Paperback from 6 May 2027', ko: 'Paperback from 6 May 2027', ja: 'Paperback from 6 May 2027' },
  place: { en: 'Weir House, Colchester', ko: 'Weir House, Colchester', ja: 'Weir House, Colchester' },
} satisfies Record<string, Tri>;

const OPENING = {
  chap: { en: 'March', ko: 'March', ja: 'March' },
  text: {
    en: '<sc>My mother left me</sc> the salt works, a Land Rover with no reverse gear, and eleven tonnes of unsold salt in paper sacks. The solicitor read the list out twice, as if it might come out differently the second time. I drove down from Leeds the next morning, meaning to sell all three.',
    ko: '<sc>My mother left me</sc> the salt works, a Land Rover with no reverse gear, and eleven tonnes of unsold salt in paper sacks. The solicitor read the list out twice, as if it might come out differently the second time. I drove down from Leeds the next morning, meaning to sell all three.',
    ja: '<sc>My mother left me</sc> the salt works, a Land Rover with no reverse gear, and eleven tonnes of unsold salt in paper sacks. The solicitor read the list out twice, as if it might come out differently the second time. I drove down from Leeds the next morning, meaning to sell all three.',
  },
  note: {
    en: 'The first lines. The twelve chapters run from March to February.',
    ko: 'The first lines. The twelve chapters run from March to February.',
    ja: 'The first lines. The twelve chapters run from March to February.',
  },
  link: { en: 'Read the opening of July', ko: 'Read the opening of July', ja: 'Read the opening of July' },
} satisfies Record<string, Tri>;

const EXCERPT = {
  title: { en: 'Read the opening of July', ko: 'Read the opening of July', ja: 'Read the opening of July' },
  intro: {
    en: 'Four months after she arrived, Nell is still running the salt works she came to sell. This is the week of the July spring tide and the first full harvest.',
    ko: 'Four months after she arrived, Nell is still running the salt works she came to sell. This is the week of the July spring tide and the first full harvest.',
    ja: 'Four months after she arrived, Nell is still running the salt works she came to sell. This is the week of the July spring tide and the first full harvest.',
  },
  page: { en: 'Page {n}', ko: 'Page {n}', ja: 'Page {n}' },
  chap: { en: 'July', ko: 'July', ja: 'July' },
  left: [
    {
      en: '<sc>The spring tide</sc> came in at ten past six, and by seven Dennis had the sluice open and the first of the water running into the settling tank. He had been talking about this morning since March. He said it the way other people talk about Christmas: the July tide, the big one, when the sun has been on the marsh for weeks and the creek comes in heavy with salt.',
      ko: '<sc>The spring tide</sc> came in at ten past six, and by seven Dennis had the sluice open and the first of the water running into the settling tank. He had been talking about this morning since March. He said it the way other people talk about Christmas: the July tide, the big one, when the sun has been on the marsh for weeks and the creek comes in heavy with salt.',
      ja: '<sc>The spring tide</sc> came in at ten past six, and by seven Dennis had the sluice open and the first of the water running into the settling tank. He had been talking about this morning since March. He said it the way other people talk about Christmas: the July tide, the big one, when the sun has been on the marsh for weeks and the creek comes in heavy with salt.',
    },
    {
      en: 'We let it stand for two days so the mud could settle out. On the third morning I lit the burners under the long pan, and Dennis showed me how to tell when the brine was ready: dip a clean finger, hold it up, and wait to see if it dries white. It did. He nodded and turned the gas down until the surface barely moved.',
      ko: 'We let it stand for two days so the mud could settle out. On the third morning I lit the burners under the long pan, and Dennis showed me how to tell when the brine was ready: dip a clean finger, hold it up, and wait to see if it dries white. It did. He nodded and turned the gas down until the surface barely moved.',
      ja: 'We let it stand for two days so the mud could settle out. On the third morning I lit the burners under the long pan, and Dennis showed me how to tell when the brine was ready: dip a clean finger, hold it up, and wait to see if it dries white. It did. He nodded and turned the gas down until the surface barely moved.',
    },
  ] satisfies Tri[],
  right: [
    {
      en: 'The crystals came in the afternoon. They form on the top of the water first, small hollow pyramids that float for a minute and then fill and sink, and the pan makes a quiet ticking sound while it happens. I sat on an upturned crate and watched for an hour. Nobody had told me about the sound.',
      ko: 'The crystals came in the afternoon. They form on the top of the water first, small hollow pyramids that float for a minute and then fill and sink, and the pan makes a quiet ticking sound while it happens. I sat on an upturned crate and watched for an hour. Nobody had told me about the sound.',
      ja: 'The crystals came in the afternoon. They form on the top of the water first, small hollow pyramids that float for a minute and then fill and sink, and the pan makes a quiet ticking sound while it happens. I sat on an upturned crate and watched for an hour. Nobody had told me about the sound.',
    },
    {
      en: 'At five we raked. You draw the salt to the side of the pan in long strokes and lift it into the draining bins with a wooden shovel, and you go slowly or the flakes break. By the second bin my arms were shaking. Dennis took the shovel from me without a word, finished the row, and handed it back.',
      ko: 'At five we raked. You draw the salt to the side of the pan in long strokes and lift it into the draining bins with a wooden shovel, and you go slowly or the flakes break. By the second bin my arms were shaking. Dennis took the shovel from me without a word, finished the row, and handed it back.',
      ja: 'At five we raked. You draw the salt to the side of the pan in long strokes and lift it into the draining bins with a wooden shovel, and you go slowly or the flakes break. By the second bin my arms were shaking. Dennis took the shovel from me without a word, finished the row, and handed it back.',
    },
    {
      en: 'That night I wrote to the estate agent and asked him to wait until September.',
      ko: 'That night I wrote to the estate agent and asked him to wait until September.',
      ja: 'That night I wrote to the estate agent and asked him to wait until September.',
    },
  ] satisfies Tri[],
  pages: { en: 'Pages 130 and 131 of the hardback.', ko: 'Pages 130 and 131 of the hardback.', ja: 'Pages 130 and 131 of the hardback.' },
  same: {
    en: 'The text is the same in all three editions.',
    ko: 'The text is the same in all three editions.',
    ja: 'The text is the same in all three editions.',
  },
};

const ABOUT = {
  title: { en: 'About {author}', ko: 'About {author}', ja: 'About {author}' },
  bio: [
    {
      en: 'Clare Avenell grew up in Tollesbury, on the Essex coast, three miles across the water from the marsh where <i>The Salt Year</i> is set. She worked for eleven years as a pharmacist at Colchester Hospital and wrote the novel between 2019 and 2025, mostly in the two hours before a morning shift.',
      ko: 'Clare Avenell grew up in Tollesbury, on the Essex coast, three miles across the water from the marsh where <i>The Salt Year</i> is set. She worked for eleven years as a pharmacist at Colchester Hospital and wrote the novel between 2019 and 2025, mostly in the two hours before a morning shift.',
      ja: 'Clare Avenell grew up in Tollesbury, on the Essex coast, three miles across the water from the marsh where <i>The Salt Year</i> is set. She worked for eleven years as a pharmacist at Colchester Hospital and wrote the novel between 2019 and 2025, mostly in the two hours before a morning shift.',
    },
    {
      en: 'To learn the work she spent two summers raking pans at a family salt works near Maldon. She lives in West Mersea with her partner and their two sons, and is writing a second novel, set on the night ferry from Harwich to the Hook of Holland.',
      ko: 'To learn the work she spent two summers raking pans at a family salt works near Maldon. She lives in West Mersea with her partner and their two sons, and is writing a second novel, set on the night ferry from Harwich to the Hook of Holland.',
      ja: 'To learn the work she spent two summers raking pans at a family salt works near Maldon. She lives in West Mersea with her partner and their two sons, and is writing a second novel, set on the night ferry from Harwich to the Hook of Holland.',
    },
  ] satisfies Tri[],
  facts: [
    { key: { en: 'Born', ko: 'Born', ja: 'Born' }, value: { en: 'Colchester, 1986', ko: 'Colchester, 1986', ja: 'Colchester, 1986' } },
    { key: { en: 'Lives', ko: 'Lives', ja: 'Lives' }, value: { en: 'West Mersea, Essex', ko: 'West Mersea, Essex', ja: 'West Mersea, Essex' } },
    { key: { en: 'Worked', ko: 'Worked', ja: 'Worked' }, value: { en: 'Pharmacist, 2012 to 2023', ko: 'Pharmacist, 2012 to 2023', ja: 'Pharmacist, 2012 to 2023' } },
    { key: { en: 'Next book', ko: 'Next book', ja: 'Next book' }, value: { en: '<i>Night Crossing</i>, spring 2028', ko: '<i>Night Crossing</i>, spring 2028', ja: '<i>Night Crossing</i>, spring 2028' } },
  ] satisfies Array<{ key: Tri; value: Tri }>,
};

type EditionId = 'hardback' | 'paperback' | 'ebook';

interface Edition {
  id: EditionId;
  name: Tri;
  desc: Tri;
  pages: string;
  pagesNote: Tri | null;
  isbn: string;
  published: Tri;
  publishedNote: Tri | null;
  /** In pence. */
  price: number;
  /** What the order row calls it. */
  item: Tri;
  /** The order button names the edition. */
  action: Tri;
}

const EDITIONS: Edition[] = [
  {
    id: 'hardback',
    name: { en: 'Hardback', ko: 'Hardback', ja: 'Hardback' },
    desc: {
      en: 'Sewn binding, cloth spine, 216 × 138 mm. The first 500 copies are signed.',
      ko: 'Sewn binding, cloth spine, 216 × 138 mm. The first 500 copies are signed.',
      ja: 'Sewn binding, cloth spine, 216 × 138 mm. The first 500 copies are signed.',
    },
    pages: '288',
    pagesNote: null,
    isbn: ISBN_HARDBACK,
    published: { en: '1 October 2026', ko: '1 October 2026', ja: '1 October 2026' },
    publishedNote: null,
    price: 1699,
    item: { en: 'Signed hardback', ko: 'Signed hardback', ja: 'Signed hardback' },
    action: { en: 'Add the hardback to basket', ko: 'Add the hardback to basket', ja: 'Add the hardback to basket' },
  },
  {
    id: 'paperback',
    name: { en: 'Paperback', ko: 'Paperback', ja: 'Paperback' },
    desc: {
      en: '198 × 129 mm, with questions for reading groups and an afterword.',
      ko: '198 × 129 mm, with questions for reading groups and an afterword.',
      ja: '198 × 129 mm, with questions for reading groups and an afterword.',
    },
    pages: '300',
    pagesNote: null,
    isbn: '978-1-916834-01-9',
    published: { en: '6 May 2027', ko: '6 May 2027', ja: '6 May 2027' },
    publishedNote: { en: 'Pre-order now', ko: 'Pre-order now', ja: 'Pre-order now' },
    price: 1099,
    item: { en: 'Paperback pre-order', ko: 'Paperback pre-order', ja: 'Paperback pre-order' },
    action: { en: 'Pre-order the paperback', ko: 'Pre-order the paperback', ja: 'Pre-order the paperback' },
  },
  {
    id: 'ebook',
    name: { en: 'Ebook', ko: 'Ebook', ja: 'Ebook' },
    desc: {
      en: 'EPUB without copy protection, for any reading app.',
      ko: 'EPUB without copy protection, for any reading app.',
      ja: 'EPUB without copy protection, for any reading app.',
    },
    pages: '288',
    pagesNote: { en: 'in print', ko: 'in print', ja: 'in print' },
    isbn: '978-1-916834-02-6',
    published: { en: '1 October 2026', ko: '1 October 2026', ja: '1 October 2026' },
    publishedNote: null,
    price: 699,
    item: { en: 'Ebook', ko: 'Ebook', ja: 'Ebook' },
    action: { en: 'Add the ebook to basket', ko: 'Add the ebook to basket', ja: 'Add the ebook to basket' },
  },
];

const EDS = {
  title: { en: 'Editions', ko: 'Editions', ja: 'Editions' },
  intro: {
    en: 'All three have the same text. The paperback adds twelve pages: questions for reading groups and a note from Clare on the salt works where she learned the work.',
    ko: 'All three have the same text. The paperback adds twelve pages: questions for reading groups and a note from Clare on the salt works where she learned the work.',
    ja: 'All three have the same text. The paperback adds twelve pages: questions for reading groups and a note from Clare on the salt works where she learned the work.',
  },
  legend: { en: 'Choose an edition', ko: 'Choose an edition', ja: 'Choose an edition' },
  colEdition: { en: 'Edition', ko: 'Edition', ja: 'Edition' },
  colPages: { en: 'Pages', ko: 'Pages', ja: 'Pages' },
  colIsbn: { en: 'ISBN', ko: 'ISBN', ja: 'ISBN' },
  colPublished: { en: 'Published', ko: 'Published', ja: 'Published' },
  colPrice: { en: 'Price', ko: 'Price', ja: 'Price' },
  note: {
    en: 'Free UK postage on orders over £20. We post from Colchester within two working days. Any bookshop can also order it with the ISBN.',
    ko: 'Free UK postage on orders over £20. We post from Colchester within two working days. Any bookshop can also order it with the ISBN.',
    ja: 'Free UK postage on orders over £20. We post from Colchester within two working days. Any bookshop can also order it with the ISBN.',
  },
  addedOne: { en: '{item} added. Your basket has 1 book.', ko: '{item} added. Your basket has 1 book.', ja: '{item} added. Your basket has 1 book.' },
  addedMany: { en: '{item} added. Your basket has {n} books.', ko: '{item} added. Your basket has {n} books.', ja: '{item} added. Your basket has {n} books.' },
} satisfies Record<string, Tri>;

const REVIEWS = {
  title: { en: 'Reviews', ko: 'Reviews', ja: 'Reviews' },
  quotes: [
    {
      text: {
        en: '“The salt works is drawn so exactly that you can smell the marsh, and Nell is the most stubborn narrator I have read this year. I finished it in two evenings.”',
        ko: '“The salt works is drawn so exactly that you can smell the marsh, and Nell is the most stubborn narrator I have read this year. I finished it in two evenings.”',
        ja: '“The salt works is drawn so exactly that you can smell the marsh, and Nell is the most stubborn narrator I have read this year. I finished it in two evenings.”',
      },
      by: 'Anna Petrakis',
      paper: 'The Sunday Ledger',
      date: { en: '4 October 2026', ko: '4 October 2026', ja: '4 October 2026' },
      dateTime: '2026-10-04',
    },
    {
      text: {
        en: '“Avenell writes about physical work better than almost anyone publishing fiction now. The July harvest is the best chapter in the book.”',
        ko: '“Avenell writes about physical work better than almost anyone publishing fiction now. The July harvest is the best chapter in the book.”',
        ja: '“Avenell writes about physical work better than almost anyone publishing fiction now. The July harvest is the best chapter in the book.”',
      },
      by: 'Tom Erskine',
      paper: 'The Quarterly Reader',
      date: { en: 'Autumn 2026', ko: 'Autumn 2026', ja: 'Autumn 2026' },
      dateTime: '2026-09',
    },
    {
      text: {
        en: '“A quiet, often funny first novel about grief, money and a family business that by rights should have closed in 1990. Dennis deserves a book of his own.”',
        ko: '“A quiet, often funny first novel about grief, money and a family business that by rights should have closed in 1990. Dennis deserves a book of his own.”',
        ja: '“A quiet, often funny first novel about grief, money and a family business that by rights should have closed in 1990. Dennis deserves a book of his own.”',
      },
      by: 'Priya Shah',
      paper: 'Northern Bookseller',
      date: { en: '15 October 2026', ko: '15 October 2026', ja: '15 October 2026' },
      dateTime: '2026-10-15',
    },
  ],
};

interface Reading {
  id: string;
  dateTime: string;
  day: Tri;
  time: Tri;
  shop: string;
  street: string;
  postcode: string;
  what: Tri;
  note: Tri;
  /** Places at a reading that takes bookings. */
  places?: { total: number; left: number };
}

const READINGS: Reading[] = [
  {
    id: 'pargeter',
    dateTime: '2026-12-03T19:00',
    day: { en: '3 December', ko: '3 December', ja: '3 December' },
    time: { en: 'Thursday, 19:00 to 20:30', ko: 'Thursday, 19:00 to 20:30', ja: 'Thursday, 19:00 to 20:30' },
    shop: 'Pargeter’s Bookshop',
    street: '9 Church Street, Coggeshall',
    postcode: 'CO6 1TU',
    what: {
      en: 'Clare reads from July and talks with the bookseller Mina Hale about the year she spent learning the work.',
      ko: 'Clare reads from July and talks with the bookseller Mina Hale about the year she spent learning the work.',
      ja: 'Clare reads from July and talks with the bookseller Mina Hale about the year she spent learning the work.',
    },
    note: { en: 'Tickets £5, taken off the price of the book.', ko: 'Tickets £5, taken off the price of the book.', ja: 'Tickets £5, taken off the price of the book.' },
    places: { total: 40, left: 14 },
  },
  {
    id: 'quay',
    dateTime: '2026-12-12T11:00',
    day: { en: '12 December', ko: '12 December', ja: '12 December' },
    time: { en: 'Saturday, 11:00 to 13:00', ko: 'Saturday, 11:00 to 13:00', ja: 'Saturday, 11:00 to 13:00' },
    shop: 'The Quay Bookroom',
    street: '14 High Street, West Mersea',
    postcode: 'CO5 8QA',
    what: {
      en: 'A signing morning. Bring your copy or buy one in the shop, and Clare will sign it with a dedication.',
      ko: 'A signing morning. Bring your copy or buy one in the shop, and Clare will sign it with a dedication.',
      ja: 'A signing morning. Bring your copy or buy one in the shop, and Clare will sign it with a dedication.',
    },
    note: { en: 'Free, no booking needed.', ko: 'Free, no booking needed.', ja: 'Free, no booking needed.' },
  },
];

const READ = {
  title: { en: 'Readings in December', ko: 'Readings in December', ja: 'Readings in December' },
  intro: {
    en: 'Clare is at two bookshops near the marsh before Christmas. Both have step-free access.',
    ko: 'Clare is at two bookshops near the marsh before Christmas. Both have step-free access.',
    ja: 'Clare is at two bookshops near the marsh before Christmas. Both have step-free access.',
  },
  left: { en: '{left} of {total} places left.', ko: '{left} of {total} places left.', ja: '{left} of {total} places left.' },
  reserve: { en: 'Reserve a place', ko: 'Reserve a place', ja: 'Reserve a place' },
  formTitle: { en: 'Reserve a place at {shop}', ko: 'Reserve a place at {shop}', ja: 'Reserve a place at {shop}' },
  name: { en: 'Name', ko: 'Name', ja: 'Name' },
  email: { en: 'Email', ko: 'Email', ja: 'Email' },
  places: { en: 'Places', ko: 'Places', ja: 'Places' },
  one: { en: 'One place', ko: 'One place', ja: 'One place' },
  two: { en: 'Two places', ko: 'Two places', ja: 'Two places' },
  most: { en: 'Two places at most per booking.', ko: 'Two places at most per booking.', ja: 'Two places at most per booking.' },
  submitOne: { en: 'Reserve one place', ko: 'Reserve one place', ja: 'Reserve one place' },
  submitTwo: { en: 'Reserve two places', ko: 'Reserve two places', ja: 'Reserve two places' },
  nameError: { en: 'Write the name the places should be held under.', ko: 'Write the name the places should be held under.', ja: 'Write the name the places should be held under.' },
  emailError: { en: 'Write an email address, such as name@example.com.', ko: 'Write an email address, such as name@example.com.', ja: 'Write an email address, such as name@example.com.' },
  doneOne: {
    en: 'Thank you, {name}. One place is held for you at {shop} on Thursday 3 December.',
    ko: 'Thank you, {name}. One place is held for you at {shop} on Thursday 3 December.',
    ja: 'Thank you, {name}. One place is held for you at {shop} on Thursday 3 December.',
  },
  doneTwo: {
    en: 'Thank you, {name}. Two places are held for you at {shop} on Thursday 3 December.',
    ko: 'Thank you, {name}. Two places are held for you at {shop} on Thursday 3 December.',
    ja: 'Thank you, {name}. Two places are held for you at {shop} on Thursday 3 December.',
  },
  doneBody: {
    en: 'The details are on their way to {email}. Pay £5 a ticket at the door, and it comes off the price of the book.',
    ko: 'The details are on their way to {email}. Pay £5 a ticket at the door, and it comes off the price of the book.',
    ja: 'The details are on their way to {email}. Pay £5 a ticket at the door, and it comes off the price of the book.',
  },
  heldOne: { en: 'One place reserved', ko: 'One place reserved', ja: 'One place reserved' },
  heldTwo: { en: 'Two places reserved', ko: 'Two places reserved', ja: 'Two places reserved' },
} satisfies Record<string, Tri>;

const FOOT = {
  press: {
    en: 'Weir House publishes four books a year from a room above a boatyard on Hythe Quay. <i>The Salt Year</i> is our eleventh.',
    ko: 'Weir House publishes four books a year from a room above a boatyard on Hythe Quay. <i>The Salt Year</i> is our eleventh.',
    ja: 'Weir House publishes four books a year from a room above a boatyard on Hythe Quay. <i>The Salt Year</i> is our eleventh.',
  },
  letter: { en: 'A letter about new books, four times a year', ko: 'A letter about new books, four times a year', ja: 'A letter about new books, four times a year' },
  placeholder: { en: 'Your email address', ko: 'Your email address', ja: 'Your email address' },
  signUp: { en: 'Sign up', ko: 'Sign up', ja: 'Sign up' },
  error: { en: 'Write an email address, such as name@example.com.', ko: 'Write an email address, such as name@example.com.', ja: 'Write an email address, such as name@example.com.' },
  done: {
    en: 'Thank you. The winter letter goes to {email} in the first week of January.',
    ko: 'Thank you. The winter letter goes to {email} in the first week of January.',
    ja: 'Thank you. The winter letter goes to {email} in the first week of January.',
  },
} satisfies Record<string, Tri>;

const ADDRESS = ['Unit 3, Hythe Quay', 'Colchester CO2 8JB', '01632 960 418'];

const PROMPT_EN = `Design one real page in the Editorial Silence style: a near-white page set almost entirely in type, with wide margins, a light serif over a quiet sans, near-black ink and no colour.

Pick a believable subject whose page is mostly reading, such as a novel from a small press, a poetry pamphlet or a museum's catalogue essay, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is The Salt Year, a debut novel by Clare Avenell from Weir House, a four-books-a-year press in Colchester: the title page with the order details, the first lines, a two-page spread of the July chapter, the author, the three editions, three reviews and two bookshop readings.

TOKENS:
--paper: #f8f8f8 (the page)
--sheet: #ffffff (the spread, the chosen edition row, the radio squares)
--surface: #ffffff (opaque, for any menu that opens over the page)
--ink: #1c1c1e
--muted: #52525b (notes, addresses, column heads, placeholders)
--line: rgba(28,28,30,0.3)
--error: #a1281e

COLOUR:
- Ink and grey on near-white. Rules that open something are ink: 2px over the title page and the foot; 1px over each section, the order details, the edition table and the readings, and under every text field. Every other line is --line.
- The only colour is --error, on error messages and the 2px underline of a field that failed. No accent colour, no tinted backgrounds, no gradients.

TYPOGRAPHY:
Three families. Spectral (200, 300 and 400, italic 200 and 300) sets everything that belongs to the book. Spectral SC (300) sets the first words of a chapter in small capitals. Instrument Sans (400, 500) sets everything that belongs to the shop: notes, ISBNs, times, forms and buttons.
Title: Spectral 200, clamp(4.5rem, 12.4vw, 11rem), line-height 0.86, letter-spacing -0.045em, two lines on a laptop and a phone.
The press's name: Spectral 400, 1.5rem (1.375rem on phones).
"A novel": Spectral italic 300, clamp(1.25rem, 1.8vw, 1.5rem). Author: Spectral 300, clamp(2rem, 3.4vw, 2.875rem), letter-spacing -0.03em.
H2: Spectral 200, clamp(2.25rem, 3.8vw, 3.25rem), line-height 1.05, letter-spacing -0.035em.
First lines: Spectral 300, clamp(1.1875rem, 1.6vw, 1.375rem), line-height 1.65. Spread text: Spectral 300, 1.1875rem, line-height 1.72, paragraphs indented 1.4em, the first one flush. Chapter head: Spectral italic 300, 2.75rem (2.25rem on phones), sunk 112px (56px on phones).
Reviews: the first in Spectral italic 200 at clamp(1.625rem, 2.6vw, 2.25rem), the others italic 300 at clamp(1.25rem, 1.7vw, 1.4375rem), with hanging opening quotes.
About the author and the press: Spectral 300, 1.25rem. A confirmation: Spectral 300, 1.375rem after a reservation and 1.25rem after the sign-up.
Prices: Spectral 300, 2.375rem on the title page and in the order row (2.125rem on phones), 1.75rem in the edition rows (1.5rem on phones). Reading dates: Spectral 200, clamp(2.375rem, 3.8vw, 3.25rem). Edition names Spectral 400 at 1.75rem (1.5rem on phones); bookshop names 400 at 1.5rem.
Running text in the shop: Instrument Sans 400 at 1.0625rem, line-height 1.6; notes at 1rem; 500 only for the few words that need weight and for buttons. Old-style figures in book text, lining figures in prices and dates, tabular figures in ISBNs. No text under 1rem. No all-caps tracked labels.
Headlines never break inside a word (Korean uses word-break: keep-all, Japanese headings auto-phrase).

LAYOUT:
- A 1120px column on a 12-column grid with 24px gutters (16px on phones). Sections 136px apart (104px under 900px, 80px on phones), each opened by a 1px ink rule with the H2 on the left and a short note from column 8.
- Shop bar: the press name, three in-page links and the basket count. Under 900px the links take their own row.
- Title page under a 2px ink rule: the title over columns 1 to 8, "A novel" under it, the author low on the page, the order details in the outer margin (columns 10 to 12, 9 to 12 below 1080px, their foot level with the author's line), the imprint at the foot on a 1px rule. The title, author, price and "Order the hardback" are all on the first screen of a 1280x800 laptop.
- The first lines sit in columns 5 to 9, where an epigraph would go.
- Under 900px everything takes the full column; the order details follow the author.

COMPONENTS:
- Spread: pages 130 and 131 on a white sheet with a 1px line round it and down the gutter. Running head in Spectral italic 300, folios in Spectral 300 with old-style figures, both muted. One page under 900px; on phones the sheet runs to the screen edges.
- About: two paragraphs in Spectral on the left, the facts as a ruled definition list on the right.
- Edition chooser: a radio group drawn as a ruled table (Edition, Pages, ISBN, Published, Price). A 20px square marks the row; the chosen row is white with a 3px ink rule on its left and a filled square. Under 900px each row stacks with its own labels. Choosing an edition changes the order row: its name, the price and the button label (Add the hardback to basket, Pre-order the paperback, Add the ebook to basket). The button adds it to the basket, updates the count in the shop bar and says so in a polite status line.
- Reviews: the quote on columns 1 to 8, the reviewer, the publication in italic and the date in the margin.
- Readings: one ruled row per evening (date large, the bookshop and its address, what happens with the places left, the action). "Reserve a place" opens a short form under the row (name, email, one or two places as two squares). Errors sit under their field; a valid reservation replaces the form with a confirmation that takes focus, and the places left go down.
- Foot under a 2px ink rule: a sentence about the press, the address, and a letter sign-up on a single underline with a text button. A valid email is replaced by a confirmation that takes focus.
- Buttons are solid ink rectangles with paper text, 48px tall; on hover they turn to paper with ink text. "Reserve a place" is drawn in outline while its form is open. Links in text are underlined in ink and the line thickens on hover; the bar's links are muted and turn ink with an underline on hover.
- Focus: a 2px ink outline 2px to 3px clear of the control; a radio row shows it round the whole row; a confirmation that takes focus shows it 6px clear.
- Square corners everywhere, 1px lines, no shadows.

MOTION:
- A 160ms colour change on hover. Nothing moves on its own. prefers-reduced-motion removes the transition.

FORBIDDEN:
- Cards, rounded boxes, pills, chips, badges, shadows, tinted panels
- A small label above a heading, all-caps tracked labels, numbered section markers
- Any accent colour, coloured links, gradients
- Book cover images, illustrations, photographs, ornaments, drop caps drawn as images, emoji
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about whitespace, silence, restraint or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a radio group for the editions and for the places, figures with blockquote and figcaption for the first lines and the reviews, labelled forms
3) Working edition chooser with a live price, button label and basket count; a reservation form and a sign-up form with error and success states
4) Responsive layout down to 320px with no horizontal scroll and no headline broken inside a word
5) Visible focus on every control, controls at least 44px tall on phones, reduced-motion support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

type ReserveErrors = { name: boolean; email: boolean };

export function PortedEditorialSilencePage({ lang }: PortedStylePageProps) {
  const [editionId, setEditionId] = useState<EditionId>('hardback');
  const [basket, setBasket] = useState(0);
  const [basketNews, setBasketNews] = useState('');

  const [reserveOpen, setReserveOpen] = useState(false);
  const [guest, setGuest] = useState({ name: '', email: '', seats: 1 });
  const [reserveErrors, setReserveErrors] = useState<ReserveErrors>({ name: false, email: false });
  const [reserved, setReserved] = useState<{ name: string; email: string; seats: number } | null>(null);

  const [letterEmail, setLetterEmail] = useState('');
  const [letterError, setLetterError] = useState(false);
  const [letterDone, setLetterDone] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const reservedRef = useRef<HTMLParagraphElement>(null);
  const letterRef = useRef<HTMLInputElement>(null);
  const letterDoneRef = useRef<HTMLParagraphElement>(null);

  const t = (text: Tri) => text[lang];

  const edition = EDITIONS.find((item) => item.id === editionId) ?? EDITIONS[0];
  const hardback = EDITIONS[0];

  // A confirmation replaces the form that had focus, so focus moves to it.
  useEffect(() => {
    if (reserved) reservedRef.current?.focus();
  }, [reserved]);

  useEffect(() => {
    if (letterDone) letterDoneRef.current?.focus();
  }, [letterDone]);

  const addToBasket = () => {
    const n = basket + 1;
    setBasket(n);
    setBasketNews(fill(t(n === 1 ? EDS.addedOne : EDS.addedMany), { item: t(edition.item), n }));
  };

  const reserve = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { name: guest.name.trim() === '', email: !EMAIL.test(guest.email.trim()) };
    if (!next.name && !next.email) {
      setReserveErrors(next);
      setReserved({ name: guest.name.trim(), email: guest.email.trim(), seats: guest.seats });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the fixed page bar.
    flushSync(() => setReserveErrors(next));
    const field = next.name ? nameRef.current : emailRef.current;
    field?.focus();
    field?.parentElement?.scrollIntoView({ block: 'nearest' });
  };

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = letterEmail.trim();
    if (EMAIL.test(value)) {
      setLetterError(false);
      setLetterDone(value);
      return;
    }
    flushSync(() => setLetterError(true));
    letterRef.current?.focus();
    letterRef.current?.closest('form')?.scrollIntoView({ block: 'nearest' });
  };

  const placesLeft = (reading: Reading) => (reading.places ? reading.places.left - (reserved ? reserved.seats : 0) : 0);

  return (
    <FusionShell
      fusionId="editorial-silence"
      lang={lang}
      accent="#1c1c1e"
      prev={{ href: '/pages/brutalist-grid.html', label: 'Brutalist Grid' }}
      next={{ href: '/pages/kinetic-pop.html', label: 'Kinetic Pop' }}
      prompts={PROMPTS}
    >
      <div className="sy">
        <header className="sy-bar">
          <p className="sy-mark">{PRESS}</p>
          <nav className="sy-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#sy-excerpt">{t(BAR.extract)}</a>
            <a href="#sy-editions">{t(BAR.editions)}</a>
            <a href="#sy-readings">{t(BAR.readings)}</a>
          </nav>
          <p className="sy-basket">{fill(t(BAR.basket), { n: basket })}</p>
        </header>

        <section className="sy-tp" aria-labelledby="sy-title">
          <h1 className="sy-title" id="sy-title">{TITLE}</h1>
          <p className="sy-kind">{t(TITLE_PAGE.kind)}</p>
          <p className="sy-author">{AUTHOR}</p>
          <div className="sy-buy">
            <p className="sy-buy__what">{t(TITLE_PAGE.what)}</p>
            <p className="sy-buy__price">{money(hardback.price)}</p>
            <p className="sy-buy__when">{t(TITLE_PAGE.when)}</p>
            <a className="sy-btn" href="#sy-editions" onClick={() => setEditionId('hardback')}>{t(TITLE_PAGE.order)}</a>
            <p className="sy-buy__also">
              <a className="sy-link" href="#sy-editions" onClick={() => setEditionId('paperback')}>{t(TITLE_PAGE.also)}</a>
            </p>
          </div>
          <p className="sy-imprint">
            <span>{t(TITLE_PAGE.place)}</span>
            <span>2026</span>
          </p>
        </section>

        <figure className="sy-opening">
          <blockquote>
            <p className="sy-opening__chap">{t(OPENING.chap)}</p>
            <p className="sy-opening__text">{rich(t(OPENING.text))}</p>
          </blockquote>
          <figcaption>
            <span>{t(OPENING.note)}</span>
            <a className="sy-link" href="#sy-excerpt">{t(OPENING.link)}</a>
          </figcaption>
        </figure>

        <section className="sy-sec" id="sy-excerpt" aria-labelledby="sy-excerpt-title">
          <div className="sy-head">
            <h2 id="sy-excerpt-title">{t(EXCERPT.title)}</h2>
            <p className="sy-intro">{t(EXCERPT.intro)}</p>
          </div>
          <div className="sy-spread">
            <article className="sy-leaf" aria-label={fill(t(EXCERPT.page), { n: 130 })}>
              <p className="sy-rh" aria-hidden="true" />
              <h3 className="sy-leaf__chap">{t(EXCERPT.chap)}</h3>
              <div className="sy-leaf__text">
                {EXCERPT.left.map((paragraph) => <p key={paragraph.en.slice(0, 24)}>{rich(t(paragraph))}</p>)}
              </div>
              <p className="sy-folio" aria-hidden="true">130</p>
            </article>
            <article className="sy-leaf" aria-label={fill(t(EXCERPT.page), { n: 131 })}>
              <p className="sy-rh" aria-hidden="true">{t(EXCERPT.chap)}</p>
              <div className="sy-leaf__text sy-leaf__text--flush">
                {EXCERPT.right.map((paragraph) => <p key={paragraph.en.slice(0, 24)}>{rich(t(paragraph))}</p>)}
              </div>
              <p className="sy-folio" aria-hidden="true">131</p>
            </article>
          </div>
          <p className="sy-spread__note">
            <span>{t(EXCERPT.pages)}</span>
            <span>{t(EXCERPT.same)}</span>
          </p>
        </section>

        <section className="sy-sec" id="sy-author" aria-labelledby="sy-author-title">
          <div className="sy-head">
            <h2 id="sy-author-title">{fill(t(ABOUT.title), { author: AUTHOR })}</h2>
          </div>
          <div className="sy-about">
            <div className="sy-bio">
              {ABOUT.bio.map((paragraph) => <p key={paragraph.en.slice(0, 24)}>{rich(t(paragraph))}</p>)}
            </div>
            <dl className="sy-facts">
              {ABOUT.facts.map((fact) => (
                <div key={fact.key.en}>
                  <dt>{t(fact.key)}</dt>
                  <dd>{rich(t(fact.value))}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="sy-sec" id="sy-editions" aria-labelledby="sy-editions-title">
          <div className="sy-head">
            <h2 id="sy-editions-title">{t(EDS.title)}</h2>
            <p className="sy-intro">{t(EDS.intro)}</p>
          </div>
          <fieldset className="sy-eds">
            <legend className="sy-sr">{t(EDS.legend)}</legend>
            <div className="sy-eds__th" aria-hidden="true">
              <span>{t(EDS.colEdition)}</span>
              <span>{t(EDS.colPages)}</span>
              <span>{t(EDS.colIsbn)}</span>
              <span>{t(EDS.colPublished)}</span>
              <span>{t(EDS.colPrice)}</span>
            </div>
            {EDITIONS.map((item) => (
              <label key={item.id} className={`sy-ed${item.id === editionId ? ' is-on' : ''}`}>
                <input
                  className="sy-sr"
                  type="radio"
                  name="sy-edition"
                  value={item.id}
                  checked={item.id === editionId}
                  onChange={() => setEditionId(item.id)}
                />
                <span className="sy-ed__box" aria-hidden="true" />
                <span className="sy-ed__nm">
                  <span className="sy-ed__name">{t(item.name)}</span>
                  <span className="sy-ed__desc">{t(item.desc)}</span>
                </span>
                <span className="sy-ed__cells">
                  <span className="sy-ed__cell">
                    <span className="sy-ed__k">{t(EDS.colPages)} </span>
                    <span className="sy-ed__v">
                      {item.pages}
                      {item.pagesNote ? <span className="sy-ed__small"> {t(item.pagesNote)}</span> : null}
                    </span>
                  </span>
                  <span className="sy-ed__cell">
                    <span className="sy-ed__k">{t(EDS.colIsbn)} </span>
                    <span className="sy-ed__v sy-ed__isbn">{item.isbn}</span>
                  </span>
                  <span className="sy-ed__cell">
                    <span className="sy-ed__k">{t(EDS.colPublished)} </span>
                    <span className="sy-ed__v">
                      {t(item.published)}
                      {item.publishedNote ? <span className="sy-ed__small"> {t(item.publishedNote)}</span> : null}
                    </span>
                  </span>
                </span>
                <span className="sy-ed__price">{money(item.price)}</span>
              </label>
            ))}
          </fieldset>
          <div className="sy-order">
            <div className="sy-order__act">
              <p className="sy-order__sum">
                <span className="sy-order__item">{t(edition.item)}</span>
                <span className="sy-order__price">{money(edition.price)}</span>
              </p>
              <button className="sy-btn" type="button" onClick={addToBasket}>{t(edition.action)}</button>
            </div>
            <p className="sy-order__note">{t(EDS.note)}</p>
            <p className="sy-order__status" role="status">{basketNews}</p>
          </div>
        </section>

        <section className="sy-sec" id="sy-reviews" aria-labelledby="sy-reviews-title">
          <div className="sy-head">
            <h2 id="sy-reviews-title">{t(REVIEWS.title)}</h2>
          </div>
          {REVIEWS.quotes.map((quote, index) => (
            <figure key={quote.by} className={`sy-quote${index === 0 ? ' sy-quote--lead' : ''}`}>
              <blockquote>
                <p>{t(quote.text)}</p>
              </blockquote>
              <figcaption>
                <span className="sy-quote__by">{quote.by}</span>
                <cite>{quote.paper}</cite>
                <time dateTime={quote.dateTime}>{t(quote.date)}</time>
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="sy-sec" id="sy-readings" aria-labelledby="sy-readings-title">
          <div className="sy-head">
            <h2 id="sy-readings-title">{t(READ.title)}</h2>
            <p className="sy-intro">{t(READ.intro)}</p>
          </div>
          <ul className="sy-events">
            {READINGS.map((reading) => {
              const booking = Boolean(reading.places);
              return (
                <li key={reading.id} className="sy-event">
                  <p className="sy-event__date">
                    <time className="sy-event__day" dateTime={reading.dateTime}>{t(reading.day)}</time>
                    <span className="sy-event__time">{t(reading.time)}</span>
                  </p>
                  <div className="sy-event__where">
                    <h3 className="sy-event__shop">{reading.shop}</h3>
                    <p className="sy-event__addr">
                      {reading.street} <span className="sy-nw">{reading.postcode}</span>
                    </p>
                  </div>
                  <div className="sy-event__what">
                    <p>{t(reading.what)}</p>
                    <p className="sy-event__note">
                      {t(reading.note)}
                      {reading.places ? ` ${fill(t(READ.left), { left: placesLeft(reading), total: reading.places.total })}` : null}
                    </p>
                  </div>
                  {booking ? (
                    <div className="sy-event__act">
                      {reserved ? (
                        <p className="sy-event__held">{t(reserved.seats === 1 ? READ.heldOne : READ.heldTwo)}</p>
                      ) : (
                        <button
                          className={`sy-btn${reserveOpen ? ' sy-btn--line' : ''}`}
                          type="button"
                          aria-expanded={reserveOpen}
                          aria-controls="sy-reserve"
                          onClick={() => setReserveOpen(!reserveOpen)}
                        >
                          {t(READ.reserve)}
                        </button>
                      )}
                    </div>
                  ) : null}
                  {booking ? (
                    <div className="sy-reserve" id="sy-reserve" hidden={!reserveOpen && !reserved}>
                      {reserved ? (
                        <div className="sy-done">
                          <p className="sy-done__title" ref={reservedRef} tabIndex={-1}>
                            {fill(t(reserved.seats === 1 ? READ.doneOne : READ.doneTwo), { name: reserved.name, shop: reading.shop })}
                          </p>
                          <p className="sy-done__body">{fill(t(READ.doneBody), { email: reserved.email })}</p>
                        </div>
                      ) : (
                        <form className="sy-form" noValidate onSubmit={reserve} aria-label={fill(t(READ.formTitle), { shop: reading.shop })}>
                          <div className={`sy-field${reserveErrors.name ? ' is-invalid' : ''}`}>
                            <label htmlFor="sy-name">{t(READ.name)}</label>
                            <input
                              id="sy-name"
                              ref={nameRef}
                              type="text"
                              autoComplete="name"
                              required
                              value={guest.name}
                              aria-invalid={reserveErrors.name || undefined}
                              aria-describedby={reserveErrors.name ? 'sy-name-error' : undefined}
                              onChange={(event) => {
                                setGuest({ ...guest, name: event.target.value });
                                if (reserveErrors.name) setReserveErrors({ ...reserveErrors, name: false });
                              }}
                            />
                            {reserveErrors.name ? <p className="sy-error" id="sy-name-error" role="alert">{t(READ.nameError)}</p> : null}
                          </div>
                          <div className={`sy-field${reserveErrors.email ? ' is-invalid' : ''}`}>
                            <label htmlFor="sy-email">{t(READ.email)}</label>
                            <input
                              id="sy-email"
                              ref={emailRef}
                              type="email"
                              autoComplete="email"
                              required
                              value={guest.email}
                              aria-invalid={reserveErrors.email || undefined}
                              aria-describedby={reserveErrors.email ? 'sy-email-error' : undefined}
                              onChange={(event) => {
                                setGuest({ ...guest, email: event.target.value });
                                if (reserveErrors.email) setReserveErrors({ ...reserveErrors, email: false });
                              }}
                            />
                            {reserveErrors.email ? <p className="sy-error" id="sy-email-error" role="alert">{t(READ.emailError)}</p> : null}
                          </div>
                          <fieldset className="sy-seats" aria-describedby="sy-seats-note">
                            <legend>{t(READ.places)}</legend>
                            {[1, 2].map((seats) => (
                              <label key={seats} className={`sy-seat${guest.seats === seats ? ' is-on' : ''}`}>
                                <input
                                  className="sy-sr"
                                  type="radio"
                                  name="sy-seats"
                                  value={seats}
                                  checked={guest.seats === seats}
                                  onChange={() => setGuest({ ...guest, seats })}
                                />
                                <span className="sy-ed__box" aria-hidden="true" />
                                {t(seats === 1 ? READ.one : READ.two)}
                              </label>
                            ))}
                            <p className="sy-seats__note" id="sy-seats-note">{t(READ.most)}</p>
                          </fieldset>
                          <button className="sy-btn sy-form__submit" type="submit">{t(guest.seats === 1 ? READ.submitOne : READ.submitTwo)}</button>
                        </form>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="sy-foot">
          <p className="sy-press">{rich(t(FOOT.press))}</p>
          <p className="sy-address">
            <span className="sy-address__name">{PRESS}</span>
            {ADDRESS.map((line) => <span key={line}>{line}</span>)}
          </p>
          {letterDone ? (
            <p className="sy-signup__done" ref={letterDoneRef} tabIndex={-1}>{fill(t(FOOT.done), { email: letterDone })}</p>
          ) : (
            <form className={`sy-signup${letterError ? ' is-invalid' : ''}`} noValidate onSubmit={signUp}>
              <label htmlFor="sy-letter">{t(FOOT.letter)}</label>
              <div className="sy-signup__row">
                <input
                  id="sy-letter"
                  ref={letterRef}
                  type="email"
                  autoComplete="email"
                  placeholder={t(FOOT.placeholder)}
                  value={letterEmail}
                  aria-invalid={letterError || undefined}
                  aria-describedby={letterError ? 'sy-letter-error' : undefined}
                  onChange={(event) => {
                    setLetterEmail(event.target.value);
                    if (letterError) setLetterError(false);
                  }}
                />
                <button type="submit">{t(FOOT.signUp)}</button>
              </div>
              {letterError ? <p className="sy-error" id="sy-letter-error" role="alert">{t(FOOT.error)}</p> : null}
            </form>
          )}
        </footer>
      </div>
    </FusionShell>
  );
}
