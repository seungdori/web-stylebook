import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import type { Lang, LocalizedText } from '../data/styles';
import { withLang } from '../utils/language';
import { animationCategories, animationPatterns, text, type AnimationPattern } from './animation-lab/catalog';
import { AnimationPreview, specFor, type EaseCurve } from './animation-lab/AnimationPreview';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });
const local = (value: LocalizedText, lang: Lang) => value[lang] || value.en;

type ShowcaseSetId = 'reveal' | 'touch' | 'state' | 'ambient';
type SpeedOption = 0.5 | 1 | 2;

interface ShowcaseSet {
  id: ShowcaseSetId;
  label: LocalizedText;
  title: LocalizedText;
  caption: LocalizedText;
  patternIds: string[];
}

const copy = {
  eyebrow: t('Motion Studio', '모션 스튜디오', 'モーションスタジオ'),
  titleA: t('Choose motion,', '조용하게', '静かに'),
  titleB: t('without the noise.', '모션 고르기.', 'モーションを選ぶ。'),
  desc: t(
    'A restrained motion workspace for comparing reveal, touch, state, loading, and ambient animation patterns from Animation Lab.',
    '애니메이션 랩의 등장, 반응, 상태 전환, 로딩, 배경 움직임을 차분한 작업 화면에서 비교합니다.',
    'アニメーションラボの表示、反応、状態変化、読み込み、環境モーションを落ち着いた作業画面で比較します。',
  ),
  replay: t('Replay', '다시 재생', '再生'),
  conduct: t('Conduct all', '전체 동시 재생', '同時再生'),
  exitConduct: t('Single view', '단일 보기', 'シングル'),
  lab: t('Open animation lab', '애니메이션 랩으로', 'アニメーションラボへ'),
  collections: t('Motion collections', '모션 컬렉션', 'モーションコレクション'),
  nowShowing: t('Now showing', '지금 보는 효과', '表示中の効果'),
  effectWall: t('Pattern Shelf', '패턴 선반', 'パターン棚'),
  effectWallTitle: t('Compare motion patterns without turning the page into a spectacle.', '페이지를 과하게 만들지 않고 모션 패턴을 비교합니다.', 'ページを派手にしすぎずモーションパターンを比較します。'),
  effectWallSubtitle: t('Click a tile to load it into the stage. Counter ticks each time it plays.', '타일을 누르면 무대에 올라오고, 재생할 때마다 카운터가 늘어납니다.', 'タイルを押すとステージに乗り、再生のたびにカウンターが増えます。'),
  compareTitle: t('A vs. B Lane', 'A 대 B 비교 레인', 'A対B比較レーン'),
  compareKicker: t('Compare Lane', '비교 레인', '比較レーン'),
  compareDesc: t(
    'Pick two motions and watch them race side by side. Useful when you cannot decide which curve fits.',
    '두 모션을 골라 나란히 재생합니다. 어느 곡선이 맞을지 결정이 안 될 때 좋습니다.',
    '二つのモーションを並べて再生します。曲線を決めかねる時に便利です。',
  ),
  compareReplay: t('Replay pair', '쌍 다시 재생', 'ペア再生'),
  compareShuffle: t('Shuffle B', 'B 셔플', 'Bをシャッフル'),
  compareLabelA: t('Track A', '트랙 A', 'トラックA'),
  compareLabelB: t('Track B', '트랙 B', 'トラックB'),
  sequenceKicker: t('Sequence Timeline', '시퀀스 타임라인', 'シーケンスタイムライン'),
  sequenceTitle: t('Watch a collection unfold on a single timeline.', '하나의 타임라인 위에서 컬렉션이 차례로 흐릅니다.', '一つのタイムライン上でコレクションが順に流れます。'),
  sequenceDesc: t(
    'Each featured pattern fires after a small delay. Press play to scrub the playhead and feel the rhythm.',
    '선택된 컬렉션의 각 패턴이 약간의 지연을 두고 등장합니다. 플레이를 누르면 플레이헤드가 흐르며 리듬이 보입니다.',
    'コレクションの各パターンが少しずつ遅れて発火します。プレイで再生ヘッドが流れリズムが見えます。',
  ),
  sequencePlay: t('Play sequence', '시퀀스 재생', 'シーケンス再生'),
  sequencePause: t('Reset playhead', '플레이헤드 리셋', 'ヘッドリセット'),
  rules: t('Motion Notes', '모션 노트', 'モーションノート'),
  rulesTitle: t('Four ground rules that keep this lab honest.', '이 랩을 절제하게 만드는 네 가지 원칙.', 'このラボを抑えるための四つの原則。'),
  selected: t('Selected', '선택됨', '選択中'),
  speedLabel: t('Speed', '속도', '速度'),
  curveLabel: t('Curve', '커브', 'カーブ'),
  gridLabel: t('Grid', '그리드', 'グリッド'),
  on: t('On', '켜짐', 'ON'),
  off: t('Off', '꺼짐', 'OFF'),
  spring: t('Spring', '스프링', 'スプリング'),
  smooth: t('Smooth', '스무스', 'スムース'),
  linear: t('Linear', '리니어', 'リニア'),
  durationKey: t('Duration', '지속 시간', '所要'),
  easingKey: t('Easing', '이징', 'イージング'),
  countKey: t('Plays', '재생 횟수', '再生数'),
  pickPattern: t('Pick pattern', '패턴 선택', 'パターン選択'),
  swap: t('Swap A↔B', 'A↔B 교체', 'A↔B交換'),
};

const showcaseSets: ShowcaseSet[] = [
  {
    id: 'reveal',
    label: t('Reveal', '등장', '表示'),
    title: t('Reveal without drama.', '조용히 등장하기.', '静かに表示する。'),
    caption: t('Fade, blur, and stagger create hierarchy before the user reads a word.', '페이드, 블러, 스태거는 사용자가 읽기 전에 먼저 위계를 만듭니다.', 'フェード、ブラー、スタガーは読む前に階層を作ります。'),
    patternIds: ['fade-up', 'blur-reveal', 'stagger'],
  },
  {
    id: 'touch',
    label: t('Touch', '터치', 'タッチ'),
    title: t('Make controls feel tactile.', '조작감을 또렷하게.', '操作感を明確に。'),
    caption: t('Hover lift, press, and tilt make controls feel responsive without shouting.', '호버 리프트, 프레스, 틸트는 과장 없이 조작감을 만듭니다.', 'ホバー、プレス、チルトで控えめな操作感を作ります。'),
    patternIds: ['hover-lift', 'press', 'tilt'],
  },
  {
    id: 'state',
    label: t('State', '상태', '状態'),
    title: t('Change state with context.', '맥락 있게 전환하기.', '文脈を保って変化する。'),
    caption: t('Modal, toast, accordion, and crossfade keep transitions legible.', '모달, 토스트, 아코디언, 크로스페이드는 전환을 읽기 쉽게 만듭니다.', 'モーダル、トースト、アコーディオン、クロスフェードで変化を読みやすくします。'),
    patternIds: ['modal-pop', 'toast-slide', 'accordion', 'crossfade'],
  },
  {
    id: 'ambient',
    label: t('Ambient', '배경 리듬', '環境'),
    title: t('Keep background motion quiet.', '배경 움직임은 낮게.', '背景の動きは控えめに。'),
    caption: t('Progress, parallax, orbit, and gradient drift add energy around the content.', '프로그레스, 패럴랙스, 오빗, 그라디언트 드리프트는 콘텐츠 주변에 리듬을 더합니다.', 'プログレス、パララックス、オービット、グラデーションで周辺にリズムを加えます。'),
    patternIds: ['progress-bar', 'parallax', 'orbit', 'gradient-drift'],
  },
];

const galleryPatternIds = [
  'fade-up',
  'blur-reveal',
  'stagger',
  'hover-lift',
  'press',
  'tilt',
  'modal-pop',
  'toast-slide',
  'accordion',
  'skeleton-shimmer',
  'progress-bar',
  'gradient-drift',
];

const motionRules = [
  {
    title: t('Purpose first', '목적 먼저', '目的を先に'),
    body: t('Motion should explain what changed, not compete with the content.', '움직임은 콘텐츠와 경쟁하지 않고 무엇이 바뀌었는지 설명해야 합니다.', 'モーションは内容と競わず、何が変わったかを説明します。'),
  },
  {
    title: t('Short travel', '짧은 이동', '短い移動'),
    body: t('Small distance and fast settling usually feel more expensive than long travel.', '짧은 거리와 빠른 안착이 긴 이동보다 더 고급스럽게 느껴집니다.', '短い距離と早い収束は長い移動より上質に感じます。'),
  },
  {
    title: t('One lead', '하나의 주연', '主役は一つ'),
    body: t('Only one strong motion should lead a scene; the rest should support it.', '한 장면에는 강한 움직임 하나만 두고 나머지는 받쳐줘야 합니다.', '一場面で強い動きは一つにし、残りは支えます。'),
  },
  {
    title: t('Reduced motion', '모션 절약', '動きを抑える'),
    body: t('The page respects reduced-motion settings so the design stays usable.', '사용자 환경의 모션 절약 설정을 존중해 화면을 계속 사용할 수 있게 둡니다.', 'ユーザーの低減設定を尊重し、使いやすさを保ちます。'),
  },
];

const isPattern = (pattern: AnimationPattern | undefined): pattern is AnimationPattern => Boolean(pattern);
const findPattern = (id: string) => animationPatterns.find((pattern) => pattern.id === id);
const fallbackPattern = animationPatterns.find((pattern) => pattern.id === 'fade-up') || animationPatterns[0];

function transition(reduced: boolean, delay = 0) {
  return reduced ? { duration: 0.01, delay: 0 } : { duration: 0.56, ease: [0.22, 1, 0.36, 1] as const, delay };
}

function spring(reduced: boolean, delay = 0) {
  return reduced ? { duration: 0.01, delay: 0 } : { type: 'spring' as const, stiffness: 300, damping: 26, mass: 0.8, delay };
}

function categoryName(pattern: AnimationPattern, lang: Lang) {
  const category = animationCategories.find((item) => item.id === pattern.category);
  return category ? text(category.label, lang) : pattern.category;
}

function bezierPath(curve: EaseCurve) {
  if (curve === 'linear') return 'M 4 96 L 96 4';
  if (curve === 'spring') return 'M 4 96 C 14 -8, 46 -18, 64 18 C 76 42, 88 8, 96 4';
  return 'M 4 96 C 24 4, 36 4, 96 4';
}

interface MotionExampleProps {
  lang: Lang;
}

export function MotionExample({ lang }: MotionExampleProps) {
  const reduced = Boolean(useReducedMotion());
  const [activeSetId, setActiveSetId] = useState<ShowcaseSetId>('reveal');
  const [selectedId, setSelectedId] = useState('fade-up');
  const [replayKey, setReplayKey] = useState(0);
  const [speed, setSpeed] = useState<SpeedOption>(1);
  const [curve, setCurve] = useState<EaseCurve>('spring');
  const [gridOn, setGridOn] = useState(true);
  const [conducting, setConducting] = useState(false);
  const [playCount, setPlayCount] = useState<Record<string, number>>({});
  const [compareA, setCompareA] = useState('fade-up');
  const [compareB, setCompareB] = useState('blur-reveal');
  const [compareKey, setCompareKey] = useState(0);
  const [pickerOpen, setPickerOpen] = useState<null | 'A' | 'B'>(null);
  const [sequenceKey, setSequenceKey] = useState(0);
  const [sequencePlaying, setSequencePlaying] = useState(false);

  const activeSet = showcaseSets.find((set) => set.id === activeSetId) || showcaseSets[0];
  const featuredPatterns = useMemo(() => activeSet.patternIds.map(findPattern).filter(isPattern), [activeSet]);
  const galleryPatterns = useMemo(() => galleryPatternIds.map(findPattern).filter(isPattern), []);
  const selectedPattern = galleryPatterns.find((pattern) => pattern.id === selectedId) || featuredPatterns[0] || fallbackPattern;
  const currentIndex = Math.max(0, featuredPatterns.findIndex((pattern) => pattern.id === selectedPattern.id));
  const spec = specFor(selectedPattern.preview, speed, curve);

  const patternA = animationPatterns.find((p) => p.id === compareA) || fallbackPattern;
  const patternB = animationPatterns.find((p) => p.id === compareB) || fallbackPattern;

  const sequenceDuration = useMemo(() => 1.8 + (featuredPatterns.length - 1) * 0.55, [featuredPatterns]);

  function tickCount(id: string) {
    setPlayCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function chooseSet(setId: ShowcaseSetId) {
    const nextSet = showcaseSets.find((set) => set.id === setId) || showcaseSets[0];
    setActiveSetId(setId);
    setSelectedId(nextSet.patternIds[0]);
    setReplayKey((value) => value + 1);
    tickCount(nextSet.patternIds[0]);
  }

  function choosePattern(pattern: AnimationPattern) {
    const owningSet = showcaseSets.find((set) => set.patternIds.includes(pattern.id));
    if (owningSet) setActiveSetId(owningSet.id);
    setSelectedId(pattern.id);
    setReplayKey((value) => value + 1);
    tickCount(pattern.id);
  }

  function replaySelected() {
    setReplayKey((value) => value + 1);
    tickCount(selectedPattern.id);
  }

  function replayPair() {
    setCompareKey((value) => value + 1);
    tickCount(patternA.id);
    tickCount(patternB.id);
  }

  function shuffleCompareB() {
    const pool = animationPatterns.filter((p) => p.id !== patternA.id && p.id !== patternB.id);
    if (!pool.length) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCompareB(next.id);
    setCompareKey((value) => value + 1);
  }

  function swapAB() {
    const previousA = compareA;
    setCompareA(compareB);
    setCompareB(previousA);
    setCompareKey((value) => value + 1);
  }

  useEffect(() => {
    if (!sequencePlaying) return;
    const timer = window.setTimeout(() => setSequencePlaying(false), sequenceDuration * 1000 + 200);
    return () => window.clearTimeout(timer);
  }, [sequencePlaying, sequenceDuration]);

  function startSequence() {
    setSequenceKey((value) => value + 1);
    setSequencePlaying(true);
    featuredPatterns.forEach((pattern) => tickCount(pattern.id));
  }

  function resetSequence() {
    setSequenceKey((value) => value + 1);
    setSequencePlaying(false);
  }

  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    function handleClick(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(null);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [pickerOpen]);

  function pickCompareTarget(id: string) {
    if (pickerOpen === 'A') setCompareA(id);
    else if (pickerOpen === 'B') setCompareB(id);
    setCompareKey((value) => value + 1);
    setPickerOpen(null);
  }

  const totalPlays = Object.values(playCount).reduce((sum, value) => sum + value, 0);

  return (
    <div className="motion-showcase-page" data-set={activeSetId} data-grid={gridOn ? 'on' : 'off'}>
      <section className="motion-showcase-hero" aria-labelledby="motion-showcase-title">
        <motion.div className="motion-showcase-copy">
          <p className="motion-showcase-eyebrow">{local(copy.eyebrow, lang)} · {String(totalPlays).padStart(3, '0')} {lang === 'ko' ? '회 재생' : lang === 'ja' ? '回再生' : 'plays'}</p>
          <h1 id="motion-showcase-title">
            <span>{local(copy.titleA, lang)}</span>
            <span>{local(copy.titleB, lang)}</span>
          </h1>
          <p className="motion-showcase-lede">{local(copy.desc, lang)}</p>

          <div className="motion-showcase-actions">
            <motion.button
              type="button"
              onClick={replaySelected}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              {local(copy.replay, lang)}
            </motion.button>
            <motion.button
              type="button"
              className={`motion-showcase-actions__ghost ${conducting ? 'is-active' : ''}`}
              onClick={() => {
                setConducting((value) => !value);
                setReplayKey((value) => value + 1);
                if (!conducting) featuredPatterns.forEach((pattern) => tickCount(pattern.id));
              }}
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              {local(conducting ? copy.exitConduct : copy.conduct, lang)}
            </motion.button>
            <a href={withLang('/pages/animation-lab', lang)}>{local(copy.lab, lang)}</a>
          </div>

          <div className="motion-showcase-setbar" role="tablist" aria-label={local(copy.collections, lang)}>
            {showcaseSets.map((set) => (
              <button
                className={set.id === activeSetId ? 'is-active' : ''}
                key={set.id}
                type="button"
                role="tab"
                aria-selected={set.id === activeSetId}
                onClick={() => chooseSet(set.id)}
              >
                <span>{local(set.label, lang)}</span>
                <strong>{local(set.title, lang)}</strong>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div className="motion-showcase-stage">
          <div className="motion-showcase-stage__top">
            <div className="motion-showcase-stage__title">
              <span>{local(copy.nowShowing, lang)}</span>
              <em>{conducting ? local(activeSet.label, lang) : categoryName(selectedPattern, lang)}</em>
            </div>
            <div className="motion-showcase-deck" role="group" aria-label="Lab controls">
              <div className="motion-showcase-deck__group" data-deck="speed">
                <span>{local(copy.speedLabel, lang)}</span>
                {[0.5, 1, 2].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value === speed ? 'is-active' : ''}
                    onClick={() => {
                      setSpeed(value as SpeedOption);
                      setReplayKey((current) => current + 1);
                    }}
                  >
                    {value}×
                  </button>
                ))}
              </div>
              <div className="motion-showcase-deck__group" data-deck="curve">
                <span>{local(copy.curveLabel, lang)}</span>
                {(['spring', 'smooth', 'linear'] as EaseCurve[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value === curve ? 'is-active' : ''}
                    onClick={() => {
                      setCurve(value);
                      setReplayKey((current) => current + 1);
                    }}
                  >
                    {local(copy[value], lang)}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`motion-showcase-deck__grid ${gridOn ? 'is-active' : ''}`}
                onClick={() => setGridOn((value) => !value)}
                aria-pressed={gridOn}
              >
                <span>{local(copy.gridLabel, lang)}</span>
                <strong>{local(gridOn ? copy.on : copy.off, lang)}</strong>
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {conducting ? (
              <motion.div
                key={`conduct-${activeSetId}-${replayKey}`}
                className="motion-showcase-conductor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={transition(reduced)}
              >
                {featuredPatterns.map((pattern, index) => (
                  <div className="motion-showcase-conductor__cell" key={pattern.id}>
                    <span className="motion-showcase-conductor__num">{String(index + 1).padStart(2, '0')}</span>
                    <AnimationPreview kind={pattern.preview} replayKey={replayKey} speed={speed} curve={curve} compact />
                    <strong>{text(pattern.name, lang)}</strong>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="motion-showcase-preview-shell"
                key={`${selectedPattern.id}-${replayKey}`}
                initial={false}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                transition={transition(reduced)}
              >
                <AnimationPreview kind={selectedPattern.preview} replayKey={replayKey} speed={speed} curve={curve} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="motion-showcase-spec">
            <div className="motion-showcase-spec__header">
              <span>{String(currentIndex + 1).padStart(2, '0')}</span>
              <strong>{text(selectedPattern.name, lang)}</strong>
            </div>
            <p>{text(selectedPattern.short, lang)}</p>
            <div className="motion-showcase-spec__params">
              <dl>
                <dt>{local(copy.durationKey, lang)}</dt>
                <dd>{spec.duration.toFixed(2)}s</dd>
                <dt>{local(copy.easingKey, lang)}</dt>
                <dd>{spec.easing}</dd>
                <dt>{local(copy.countKey, lang)}</dt>
                <dd>×{playCount[selectedPattern.id] || 0}</dd>
              </dl>
              <svg className="motion-showcase-spec__curve" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <linearGradient id="motionCurveGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--showcase-coral)" />
                    <stop offset="100%" stopColor="var(--showcase-lemon)" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill="none" />
                <line x1="4" y1="96" x2="96" y2="96" />
                <line x1="4" y1="4" x2="4" y2="96" />
                <path d={bezierPath(curve)} />
                <motion.circle
                  cx="4"
                  cy="96"
                  r="3.4"
                  key={`curve-${curve}-${speed}-${replayKey}`}
                  animate={{ offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: spec.duration, ease: 'linear', repeat: spec.loop ? Infinity : 0 }}
                  style={{ offsetPath: `path('${bezierPath(curve)}')` }}
                />
              </svg>
            </div>
          </div>

          <LayoutGroup>
            <div className="motion-showcase-filmstrip" aria-label={local(activeSet.label, lang)}>
              {featuredPatterns.map((pattern) => (
                <motion.button
                  className={pattern.id === selectedPattern.id ? 'is-active' : ''}
                  key={pattern.id}
                  type="button"
                  layout
                  onClick={() => choosePattern(pattern)}
                  whileHover={reduced ? undefined : { y: -3 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                >
                  <AnimationPreview kind={pattern.preview} replayKey={pattern.id === selectedPattern.id ? replayKey : 0} compact />
                  <span>{text(pattern.name, lang)}</span>
                  {playCount[pattern.id] ? <em>×{playCount[pattern.id]}</em> : null}
                </motion.button>
              ))}
            </div>
          </LayoutGroup>
        </motion.div>

        <div className="motion-showcase-ribbon" aria-hidden="true">
          <motion.span
            animate={reduced ? { x: '0%' } : { x: ['0%', '-50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            FADE UP / STAGGER / HOVER LIFT / TOAST SLIDE / PARALLAX / GRADIENT DRIFT / FADE UP / STAGGER / HOVER LIFT / TOAST SLIDE / PARALLAX / GRADIENT DRIFT /
          </motion.span>
        </div>
      </section>

      <section className="motion-showcase-compare" aria-labelledby="motion-showcase-compare-title">
        <div className="motion-showcase-section-head">
          <p className="motion-showcase-eyebrow">{local(copy.compareKicker, lang)}</p>
          <h2 id="motion-showcase-compare-title">{local(copy.compareTitle, lang)}</h2>
          <p>{local(copy.compareDesc, lang)}</p>
        </div>

        <div className="motion-showcase-compare__wrap" ref={pickerRef}>
          <CompareSlot
            label={local(copy.compareLabelA, lang)}
            pattern={patternA}
            replayKey={compareKey}
            speed={speed}
            curve={curve}
            lang={lang}
            onOpen={() => setPickerOpen('A')}
            picker={local(copy.pickPattern, lang)}
            pickerActive={pickerOpen === 'A'}
            slotLetter="A"
            count={playCount[patternA.id] || 0}
          />

          <div className="motion-showcase-compare__divider" aria-hidden="true">
            <span>VS</span>
          </div>

          <CompareSlot
            label={local(copy.compareLabelB, lang)}
            pattern={patternB}
            replayKey={compareKey}
            speed={speed}
            curve={curve}
            lang={lang}
            onOpen={() => setPickerOpen('B')}
            picker={local(copy.pickPattern, lang)}
            pickerActive={pickerOpen === 'B'}
            slotLetter="B"
            count={playCount[patternB.id] || 0}
          />

          {pickerOpen ? (
            <div className="motion-showcase-compare__picker" role="listbox">
              {animationPatterns.map((pattern) => (
                <button key={pattern.id} type="button" onClick={() => pickCompareTarget(pattern.id)}>
                  <strong>{text(pattern.name, lang)}</strong>
                  <span>{categoryName(pattern, lang)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="motion-showcase-compare__actions">
          <button type="button" onClick={replayPair}>{local(copy.compareReplay, lang)}</button>
          <button type="button" onClick={shuffleCompareB}>{local(copy.compareShuffle, lang)}</button>
          <button type="button" onClick={swapAB}>{local(copy.swap, lang)}</button>
        </div>
      </section>

      <section className="motion-showcase-gallery" aria-labelledby="motion-showcase-gallery-title">
        <div className="motion-showcase-section-head">
          <p className="motion-showcase-eyebrow">{local(copy.effectWall, lang)}</p>
          <h2 id="motion-showcase-gallery-title">{local(copy.effectWallTitle, lang)}</h2>
          <p>{local(copy.effectWallSubtitle, lang)}</p>
        </div>
        <div className="motion-showcase-gallery__grid">
          {galleryPatterns.map((pattern, index) => (
            <motion.button
              className={pattern.id === selectedPattern.id ? 'is-active' : ''}
              key={pattern.id}
              type="button"
              onClick={() => choosePattern(pattern)}
              transition={spring(reduced, index * 0.015)}
              whileHover={reduced ? undefined : { y: -5 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
            >
              <AnimationPreview kind={pattern.preview} replayKey={pattern.id === selectedPattern.id ? replayKey : 0} speed={speed} curve={curve} compact />
              <span>{categoryName(pattern, lang)}</span>
              <strong>{text(pattern.name, lang)}</strong>
              <em>×{playCount[pattern.id] || 0}</em>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="motion-showcase-timeline" aria-labelledby="motion-showcase-timeline-title">
        <div className="motion-showcase-section-head">
          <p className="motion-showcase-eyebrow">{local(copy.sequenceKicker, lang)}</p>
          <h2 id="motion-showcase-timeline-title">{local(copy.sequenceTitle, lang)}</h2>
          <p>{local(copy.sequenceDesc, lang)}</p>
        </div>

        <div className="motion-showcase-timeline__actions">
          <button type="button" className="is-primary" onClick={startSequence}>{local(copy.sequencePlay, lang)}</button>
          <button type="button" onClick={resetSequence}>{local(copy.sequencePause, lang)}</button>
          <span className="motion-showcase-timeline__caption">{local(activeSet.caption, lang)}</span>
        </div>

        <div className="motion-showcase-timeline__lane">
          <div className="motion-showcase-timeline__axis" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((tick) => {
              const ratio = tick / 4;
              return (
                <div key={tick} className="motion-showcase-timeline__tick" style={{ left: `${ratio * 100}%` }}>
                  <span>{(ratio * sequenceDuration).toFixed(1)}s</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {sequencePlaying ? (
              <motion.div
                key={`playhead-${sequenceKey}`}
                className="motion-showcase-timeline__playhead"
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: sequenceDuration, ease: 'linear' }}
              />
            ) : null}
          </AnimatePresence>

          <div className="motion-showcase-timeline__tracks">
            {featuredPatterns.map((pattern, index) => {
              const slot = featuredPatterns.length === 1 ? 0 : index / (featuredPatterns.length - 1);
              const delay = featuredPatterns.length === 1 ? 0 : index * 0.55;
              return (
                <div className="motion-showcase-timeline__card" key={`${pattern.id}-${sequenceKey}`} style={{ left: `calc(${slot} * (100% - 240px))` }}>
                  <span className="motion-showcase-timeline__lead">{String(index + 1).padStart(2, '0')} · {delay.toFixed(2)}s</span>
                  <motion.div
                    className="motion-showcase-timeline__preview"
                    initial={sequencePlaying ? { opacity: 0, y: 14, scale: 0.92 } : false}
                    animate={sequencePlaying ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: sequencePlaying ? delay : 0 }}
                  >
                    <AnimationPreview kind={pattern.preview} replayKey={sequenceKey} speed={speed} curve={curve} compact />
                  </motion.div>
                  <strong>{text(pattern.name, lang)}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="motion-showcase-rules" aria-labelledby="motion-showcase-rules-title">
        <div className="motion-showcase-section-head">
          <p className="motion-showcase-eyebrow">{local(copy.rules, lang)}</p>
          <h2 id="motion-showcase-rules-title">{local(copy.rulesTitle, lang)}</h2>
        </div>
        <div className="motion-showcase-rules__grid">
          {motionRules.map((rule, index) => (
            <motion.article
              key={rule.title.en}
              transition={transition(reduced, index * 0.06)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{local(rule.title, lang)}</strong>
              <p>{local(rule.body, lang)}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

interface CompareSlotProps {
  label: string;
  pattern: AnimationPattern;
  replayKey: number;
  speed: SpeedOption;
  curve: EaseCurve;
  lang: Lang;
  onOpen: () => void;
  picker: string;
  pickerActive: boolean;
  slotLetter: 'A' | 'B';
  count: number;
}

function CompareSlot({ label, pattern, replayKey, speed, curve, lang, onOpen, picker, pickerActive, slotLetter, count }: CompareSlotProps) {
  return (
    <div className={`motion-showcase-compare__slot motion-showcase-compare__slot--${slotLetter.toLowerCase()} ${pickerActive ? 'is-picking' : ''}`}>
      <header>
        <span>{label}</span>
        <em>×{count}</em>
      </header>
      <div className="motion-showcase-compare__stage">
        <AnimationPreview kind={pattern.preview} replayKey={replayKey} speed={speed} curve={curve} />
      </div>
      <footer>
        <strong>{text(pattern.name, lang)}</strong>
        <button type="button" onClick={onOpen}>{picker}</button>
      </footer>
    </div>
  );
}
