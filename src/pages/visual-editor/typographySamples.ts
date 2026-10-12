import type { Lang } from '../../data/styles';
import type { TypographyRoleName } from '../../visual/types';

/** Fixture copy for the role ladder. UI language does not choose these strings. */
export const typographySamples: Record<Lang, Record<TypographyRoleName, string>> = {
  en: {
    display: 'A slower way to travel across the long coastal route',
    heading: 'Field notes from the overnight train',
    subheading: 'What to pack when the schedule slips',
    body: 'The reading column should stay comfortable when a long address appears: https://notes.example.com/field-notes/a-slower-way-to-travel. Figures such as 12,480.50 sit beside the Latin name Field Notes.',
    small: 'Platform 4 · departure 18:40 · coach 12',
    label: 'Save itinerary',
    caption: 'Mina Park · 2026-08-18 · Field Notes',
    data: 'REQ-2048    12,480.50    KRW',
  },
  ko: {
    display: '해안선을 따라 더 천천히 이동하는 긴 여정',
    heading: '야간 열차에서 남긴 Field Notes',
    subheading: '일정이 밀릴 때 챙길 것',
    body: '긴 주소가 들어와도 본문 폭이 읽기 좋아야 합니다. https://notes.example.com/field-notes/a-slower-way-to-travel 숫자 12,480.50과 라틴 이름 Field Notes를 같은 문단에 둡니다.',
    small: '4번 승강장 · 18:40 출발 · 12호차',
    label: '일정 저장',
    caption: '박미나 · 2026-08-18 · Field Notes',
    data: 'REQ-2048    12,480.50    KRW',
  },
  ja: {
    display: '海岸線をゆっくり辿る長い移動のかたち',
    heading: '夜行列車の Field Notes',
    subheading: '予定がずれても持っていくもの',
    body: '長い URL が入っても読み幅は保ちます。https://notes.example.com/field-notes/a-slower-way-to-travel 数値 12,480.50 とラテン名 Field Notes を同じ段落に置きます。',
    small: '4番線 · 18:40 発 · 12号車',
    label: '旅程を保存',
    caption: '朴ミナ · 2026-08-18 · Field Notes',
    data: 'REQ-2048    12,480.50    KRW',
  },
};
