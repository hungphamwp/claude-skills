import React from 'react';
import { INK, drawOn, progress, wobble } from './anim';
import { Campfire, Hut, Monkey, QuestionMark, SittingFigure, StandingFigure, Stars } from './parts';
import { BarChart, CityNight, LightbulbIdea, PersonSleeping, Sunrise } from './more';
import {
  AgentSecurityWarning,
  AgentStars,
  AiAgentNew,
  AiToolJungle,
  ChatbotLineup,
  ChatbotStrengths,
  DecisionTable,
  ImageTools,
  PickByJob,
  SoraDeprecated,
  VideoToolsPrice,
  WebBuilderLanes,
} from './aitools';
import {
  CoreWebVitals,
  DistanceCdn,
  HeavyImageAnvil,
  LayoutShift,
  NoCacheKitchen,
  PluginPile,
  SharedHostingCrowd,
  SlowSiteWaiting,
  SpeedChecklist,
  ThreeSecondRule,
} from './speed';
import {
  AddressVsHouse,
  BuyDomainOnly,
  DnsDirectory,
  DomainWrongOwner,
  FullPicture,
  HostingHouse,
  MoveHouseSameAddress,
  NameserverSignpost,
  RentCalendar,
  SeparateBills,
} from './domain';
import {
  BrainPredictionEngine,
  BrainScanCompare,
  DelayDial,
  QuestionStillOpen,
  RobotTickleLab,
  SignalCancel,
  SurpriseAttack,
  TickleOtherLaugh,
  TickleSelfFail,
  TwoTickleTypes,
} from './tickle';
import {
  BabyLearningMontage,
  BabyScannerGlow,
  BabyWordlessBubble,
  FakeBalloonPhoto,
  FirstMemoryQuestion,
  FreudNotebookCouch,
  HippocampusUnderScaffold,
  LabMouseHypothesis,
  LockedBoxNoKey,
  MemoryTimelineFade,
  MirrorRedDot,
  NeuronOverwriteScribble,
  PhotoStoryImplant,
} from './memory';
import {
  CoffeeNap,
  NapDeep,
  NapDeskTired,
  NapFullCycle,
  NapGoldenWindow,
  NapShallow,
  NapTooLate,
  NapTwoOutcomes,
  NasaPilotNap,
  SleepCycleWave,
  SleepInertiaZombie,
} from './nap';
import {
  AwakeAt3am,
  MidnightActivities,
  MidnightWakeCottage,
  OldDocumentsStack,
  SleepCompressed,
  ToothbrushDiary,
  TwoSleepsSplit,
  WehrDarkRoom,
} from './story3am';

const W = 1920;
const H = 1080;

export type IllustrationProps = { frame: number; accent: string; step?: number };

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = '#ffffff' }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ position: 'absolute', inset: 0 }}
  >
    <rect x={0} y={0} width={W} height={H} fill={bg} />
    {children}
  </svg>
);

// 1) Đêm bên đống lửa — nhân vật ngồi suy nghĩ, sao nhấp nháy, lửa bập bùng
const CampfireNight: React.FC<IllustrationProps> = ({ frame }) => {
  const bob = wobble(frame, 0.09, 14);
  return (
    <Frame bg="#2f4d9c">
      <Stars frame={frame} width={W} height={620} />
      <path d={`M 0 640 Q ${W / 2} 590 ${W} 660 L ${W} ${H} L 0 ${H} Z`} fill="#9c5a21" />
      <g transform={`translate(0 ${bob})`}>
        <QuestionMark x={870} y={215} scale={1.15} />
      </g>
      <SittingFigure x={870} y={270} scale={1.15} />
      <Campfire x={1420} y={1000} scale={1.15} frame={frame} />
    </Frame>
  );
};

// 2) "Everything starts here" — mũi tên đỏ tỏa ra, vẽ dần từng cái
const EverythingStartsHere: React.FC<IllustrationProps> = ({ frame, accent }) => {
  const arrows = new Array(12).fill(0).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const inner = 300;
    const outer = 300 + 520 * (0.75 + 0.25 * Math.abs(Math.cos(angle)));
    const cx = W / 2;
    const cy = H / 2 + 40;
    return {
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cy + Math.sin(angle) * outer,
      angle,
      delay: i * 2.5,
    };
  });
  return (
    <Frame bg="#ffffff">
      {arrows.map((a, i) => {
        const p = progress(frame, 8 + a.delay, 18);
        if (p <= 0) return null;
        const headLen = 60;
        const spread = 0.42;
        return (
          <g key={i} stroke={accent} strokeWidth={16} strokeLinecap="round" fill="none" opacity={p > 0 ? 1 : 0}>
            <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} {...drawOn(p)} />
            {p > 0.85 ? (
              <>
                <line
                  x1={a.x2}
                  y1={a.y2}
                  x2={a.x2 - Math.cos(a.angle - spread) * headLen}
                  y2={a.y2 - Math.sin(a.angle - spread) * headLen}
                />
                <line
                  x1={a.x2}
                  y1={a.y2}
                  x2={a.x2 - Math.cos(a.angle + spread) * headLen}
                  y2={a.y2 - Math.sin(a.angle + spread) * headLen}
                />
              </>
            ) : null}
          </g>
        );
      })}
      {/* đá quanh lửa */}
      <g fill="#9b9187" stroke={INK} strokeWidth={7}>
        {[-210, -120, -30, 60, 150].map((dx, i) => (
          <ellipse key={i} cx={W / 2 + dx + 20} cy={H / 2 + 250} rx={58} ry={44} />
        ))}
      </g>
      <Campfire x={W / 2} y={H / 2 + 235} scale={1.35} frame={frame} />
    </Frame>
  );
};

// 3) Người và bầy khỉ trên nền cỏ
const EvolutionLine: React.FC<IllustrationProps> = ({ frame }) => {
  const pop = (i: number) => progress(frame, 6 + i * 7, 14);
  return (
    <Frame bg="#ffffff">
      <rect x={0} y={840} width={W} height={H - 840} fill="#22a04a" />
      <g style={{ opacity: pop(0) }}>
        <StandingFigure x={300} y={210} scale={1.05} />
      </g>
      {[820, 1240, 1660].map((x, i) => (
        <g key={x} style={{ opacity: pop(i + 1) }} transform={`translate(0 ${wobble(frame, 0.12, 6, i)})`}>
          <Monkey x={x} y={840} scale={0.95} />
        </g>
      ))}
    </Frame>
  );
};

// 4) Vòng sáng của lửa với thước đo "30 FEET"
const FireRadius: React.FC<IllustrationProps> = ({ frame, accent }) => {
  const p = progress(frame, 10, 24);
  const glow = 1 + wobble(frame, 0.18, 0.012);
  const cx = W / 2;
  const cy = H / 2 + 30;
  return (
    <Frame bg="#0d0d0d">
      <g transform={`translate(${cx} ${cy}) scale(${glow}) translate(${-cx} ${-cy})`}>
        <circle cx={cx} cy={cy} r={470} fill="#f4a63a" />
        <circle cx={cx} cy={cy} r={390} fill="#fbc55f" />
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={380}
        fill="none"
        stroke={INK}
        strokeWidth={16}
        strokeDasharray="42 34"
        strokeLinecap="round"
        transform={`rotate(${frame * 0.25} ${cx} ${cy})`}
      />
      <g stroke={accent} strokeWidth={13} strokeLinecap="round" fill="none">
        <line x1={cx - 340} y1={cy - 90} x2={cx + 340} y2={cy - 90} {...drawOn(p)} />
        {p > 0.9 ? (
          <>
            <path d={`M ${cx - 340} ${cy - 90} l 58 -34 M ${cx - 340} ${cy - 90} l 58 34`} />
            <path d={`M ${cx + 340} ${cy - 90} l -58 -34 M ${cx + 340} ${cy - 90} l -58 34`} />
          </>
        ) : null}
      </g>
      <Campfire x={cx} y={cy + 260} scale={0.75} frame={frame} />
    </Frame>
  );
};

// 5) Nhà nghiên cứu bên nhà tranh
const ResearcherHut: React.FC<IllustrationProps> = ({ frame }) => {
  const p = progress(frame, 4, 16);
  return (
    <Frame bg="#ffffff">
      <path d={`M 0 900 Q ${W / 2} 860 ${W} 905 L ${W} ${H} L 0 ${H} Z`} fill="#8a5a2b" />
      <g style={{ opacity: p }} transform={`translate(0 ${wobble(frame, 0.1, 5)})`}>
        <StandingFigure x={640} y={210} scale={1.05} glasses />
        {/* bảng kẹp giấy (đặt ngay dưới bàn tay trái) */}
        <g transform="translate(455 700)">
          <rect x={-110} y={-70} width={220} height={280} rx={10} fill="#ffffff" stroke={INK} strokeWidth={9} />
          <rect x={-30} y={-92} width={60} height={30} rx={8} fill="#ffffff" stroke={INK} strokeWidth={9} />
          <g stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.8}>
            {new Array(7).fill(0).map((_, i) => (
              <line key={i} x1={-80} y1={-20 + i * 32} x2={80} y2={-20 + i * 32} />
            ))}
          </g>
        </g>
        {/* bút chì (trong bàn tay phải) */}
        <g transform="translate(805 655) rotate(24)">
          <rect x={-16} y={-95} width={32} height={190} fill="#ffffff" stroke={INK} strokeWidth={9} />
          <path d="M -16 95 L 0 135 L 16 95 Z" fill={INK} />
        </g>
      </g>
      <Hut x={1500} y={900} scale={1} />
    </Frame>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<IllustrationProps>> = {
  'campfire-night': CampfireNight,
  'everything-starts-here': EverythingStartsHere,
  'evolution-line': EvolutionLine,
  'fire-radius': FireRadius,
  'researcher-hut': ResearcherHut,
  'person-sleeping': PersonSleeping,
  sunrise: Sunrise,
  'bar-chart': BarChart,
  'city-night': CityNight,
  'lightbulb-idea': LightbulbIdea,
  'awake-at-3am': AwakeAt3am,
  'two-sleeps-split': TwoSleepsSplit,
  'midnight-wake-cottage': MidnightWakeCottage,
  'midnight-activities': MidnightActivities,
  'old-documents-stack': OldDocumentsStack,
  'toothbrush-diary': ToothbrushDiary,
  'wehr-dark-room': WehrDarkRoom,
  'sleep-compressed': SleepCompressed,
  'nap-desk-tired': NapDeskTired,
  'nap-two-outcomes': NapTwoOutcomes,
  'sleep-cycle-wave': SleepCycleWave,
  'nap-shallow': NapShallow,
  'nap-deep': NapDeep,
  'sleep-inertia-zombie': SleepInertiaZombie,
  'nap-golden-window': NapGoldenWindow,
  'nasa-pilot-nap': NasaPilotNap,
  'nap-full-cycle': NapFullCycle,
  'nap-too-late': NapTooLate,
  'coffee-nap': CoffeeNap,
  'first-memory-question': FirstMemoryQuestion,
  'photo-story-implant': PhotoStoryImplant,
  'memory-timeline-fade': MemoryTimelineFade,
  'baby-learning-montage': BabyLearningMontage,
  'freud-notebook-couch': FreudNotebookCouch,
  'hippocampus-under-scaffold': HippocampusUnderScaffold,
  'neuron-overwrite-scribble': NeuronOverwriteScribble,
  'lab-mouse-hypothesis': LabMouseHypothesis,
  'baby-wordless-bubble': BabyWordlessBubble,
  'mirror-red-dot': MirrorRedDot,
  'fake-balloon-photo': FakeBalloonPhoto,
  'baby-scanner-glow': BabyScannerGlow,
  'locked-box-no-key': LockedBoxNoKey,
  'tickle-self-fail': TickleSelfFail,
  'tickle-other-laugh': TickleOtherLaugh,
  'brain-prediction-engine': BrainPredictionEngine,
  'signal-cancel': SignalCancel,
  'brain-scan-compare': BrainScanCompare,
  'robot-tickle-lab': RobotTickleLab,
  'delay-dial': DelayDial,
  'two-tickle-types': TwoTickleTypes,
  'surprise-attack': SurpriseAttack,
  'question-still-open': QuestionStillOpen,
  'address-vs-house': AddressVsHouse,
  'buy-domain-only': BuyDomainOnly,
  'hosting-house': HostingHouse,
  'dns-directory': DnsDirectory,
  'nameserver-signpost': NameserverSignpost,
  'move-house-same-address': MoveHouseSameAddress,
  'separate-bills': SeparateBills,
  'rent-calendar': RentCalendar,
  'domain-wrong-owner': DomainWrongOwner,
  'full-picture': FullPicture,
  'slow-site-waiting': SlowSiteWaiting,
  'three-second-rule': ThreeSecondRule,
  'heavy-image-anvil': HeavyImageAnvil,
  'shared-hosting-crowd': SharedHostingCrowd,
  'no-cache-kitchen': NoCacheKitchen,
  'plugin-pile': PluginPile,
  'distance-cdn': DistanceCdn,
  'core-web-vitals': CoreWebVitals,
  'layout-shift': LayoutShift,
  'speed-checklist': SpeedChecklist,
  'ai-tool-jungle': AiToolJungle,
  'pick-by-job': PickByJob,
  'chatbot-lineup': ChatbotLineup,
  'chatbot-strengths': ChatbotStrengths,
  'image-tools': ImageTools,
  'video-tools-price': VideoToolsPrice,
  'sora-deprecated': SoraDeprecated,
  'web-builder-lanes': WebBuilderLanes,
  'ai-agent-new': AiAgentNew,
  'agent-stars': AgentStars,
  'agent-security-warning': AgentSecurityWarning,
  'decision-table': DecisionTable,
};

export const ILLUSTRATION_KEYS = Object.keys(ILLUSTRATIONS);
