import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type StoryProps = { frame: number; accent: string };

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

// Đầu nhân vật nằm nghiêng, mắt mở trừng hoặc nhắm
const SleepHead: React.FC<{ cx: number; cy: number; r?: number; awake: boolean; blink?: number }> = ({
  cx,
  cy,
  r = 78,
  awake,
  blink = 1,
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={INK} strokeWidth={9} />
    {awake ? (
      <>
        <ellipse cx={cx - r * 0.34} cy={cy - r * 0.1} rx={r * 0.2} ry={r * 0.24 * blink} fill="#ffffff" stroke={INK} strokeWidth={6} />
        <ellipse cx={cx + r * 0.34} cy={cy - r * 0.1} rx={r * 0.2} ry={r * 0.24 * blink} fill="#ffffff" stroke={INK} strokeWidth={6} />
        <circle cx={cx - r * 0.34} cy={cy - r * 0.1} r={r * 0.11 * blink} fill={INK} />
        <circle cx={cx + r * 0.34} cy={cy - r * 0.1} r={r * 0.11 * blink} fill={INK} />
      </>
    ) : (
      <path
        d={`M ${cx - r * 0.52} ${cy - r * 0.12} q ${r * 0.2} ${r * 0.2} ${r * 0.4} 0
            M ${cx + r * 0.12} ${cy - r * 0.12} q ${r * 0.2} ${r * 0.2} ${r * 0.4} 0`}
        fill="none"
        stroke={INK}
        strokeWidth={7}
        strokeLinecap="round"
      />
    )}
    <line x1={cx - r * 0.22} y1={cy + r * 0.46} x2={cx + r * 0.22} y2={cy + r * 0.46} stroke={INK} strokeWidth={7} strokeLinecap="round" />
  </g>
);

// 1) Tỉnh giấc lúc 3 giờ sáng — mắt mở trừng, đồng hồ số nhấp nháy
export const AwakeAt3am: React.FC<StoryProps> = ({ frame }) => {
  const colonOn = Math.floor(frame / 15) % 2 === 0;
  const glow = 0.45 + 0.25 * Math.sin(frame * 0.11);
  // chớp mắt một cái quanh frame 40
  const blink = frame > 38 && frame < 46 ? 0.15 : 1;
  return (
    <Frame bg="#16224d">
      <rect x={0} y={0} width={W} height={640} fill="#25325f" />
      {/* ánh xanh hắt lên tường */}
      <ellipse cx={1500} cy={470} rx={430} ry={300} fill="#4f7fd4" opacity={glow * 0.35} />

      {/* giường */}
      <rect x={250} y={760} width={1120} height={40} rx={14} fill="#8a6b4a" stroke={INK} strokeWidth={9} />
      <rect x={300} y={800} width={40} height={130} fill="#8a6b4a" stroke={INK} strokeWidth={9} />
      <rect x={1280} y={800} width={40} height={130} fill="#8a6b4a" stroke={INK} strokeWidth={9} />
      {/* gối */}
      <path d="M 300 760 q 30 -110 175 -70" fill="#e8e2d4" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {/* chăn */}
      <path d="M 620 760 Q 850 640 1120 690 L 1300 760 Z" fill="#4a63b8" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      {/* tay để ngoài chăn */}
      <line x1={640} y1={735} x2={760} y2={700} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <SleepHead cx={470} cy={690} awake blink={blink} />

      {/* đồng hồ số */}
      <g transform="translate(1520 620)">
        <rect x={-160} y={-95} width={320} height={190} rx={18} fill="#0d1533" stroke={INK} strokeWidth={9} />
        <text x={-108} y={30} fontSize={96} fontWeight={800} fill="#5fa8ff" fontFamily="monospace">
          3
        </text>
        <text x={-44} y={26} fontSize={90} fontWeight={800} fill="#5fa8ff" fontFamily="monospace" opacity={colonOn ? 1 : 0.15}>
          :
        </text>
        <text x={-4} y={30} fontSize={96} fontWeight={800} fill="#5fa8ff" fontFamily="monospace">
          00
        </text>
      </g>
    </Frame>
  );
};

// Khối "giấc ngủ" dùng chung cho hai hình sơ đồ
const SleepBlock: React.FC<{ x: number; y: number; w: number; h: number; label?: string }> = ({
  x,
  y,
  w,
  h,
  label,
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} fill="#2a3a72" stroke={INK} strokeWidth={9} />
    {label ? (
      <text x={x + w / 2} y={y + h / 2 + 14} fontSize={40} fontWeight={700} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
        {label}
      </text>
    ) : null}
  </g>
);

// 2) Sơ đồ ngủ hai giấc
export const TwoSleepsSplit: React.FC<StoryProps> = ({ frame }) => {
  const slide = easeOut(progress(frame, 4, 22));
  const gapGlow = easeOut(progress(frame, 26, 18));
  const barY = 470;
  const barH = 150;
  return (
    <Frame bg="#f6efe0">
      {/* mặt trời lặn / mọc */}
      <g transform="translate(190 545)">
        <circle cx={0} cy={0} r={62} fill="#f08a3c" stroke={INK} strokeWidth={9} />
        <line x1={-95} y1={62} x2={95} y2={62} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </g>
      <g transform="translate(1730 545)">
        <circle cx={0} cy={0} r={62} fill="#ffc23c" stroke={INK} strokeWidth={9} />
        <line x1={-95} y1={62} x2={95} y2={62} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </g>

      {/* khoảng thức ở giữa */}
      <rect x={860} y={barY} width={220} height={barH} rx={12} fill="#ffb84d" stroke={INK} strokeWidth={9} opacity={0.35 + gapGlow * 0.65} />
      <text x={970} y={barY + barH + 62} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
        Tỉnh
      </text>
      {/* nến giữa */}
      <g transform={`translate(970 ${barY - 40})`} opacity={gapGlow}>
        <rect x={-16} y={-6} width={32} height={54} fill="#fff3d0" stroke={INK} strokeWidth={7} />
        <path
          d={`M 0 -18 c ${-20 + wobble(frame, 0.4, 3)} -22 ${-14} -52 0 -66 c ${14} 14 ${20 + wobble(frame, 0.35, 3, 1)} 44 0 66 Z`}
          fill="#ffcf4d"
          stroke={INK}
          strokeWidth={5}
        />
      </g>

      {/* hai khối ngủ trượt vào */}
      <g transform={`translate(${-520 * (1 - slide)} 0)`}>
        <SleepBlock x={340} y={barY} w={520} h={barH} label="Giấc thứ nhất" />
        <text x={600} y={barY - 40} fontSize={54} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT} opacity={slide}>
          <tspan fill={INK}>Z z z</tspan>
        </text>
      </g>
      <g transform={`translate(${520 * (1 - slide)} 0)`}>
        <SleepBlock x={1080} y={barY} w={520} h={barH} label="Giấc thứ hai" />
        <text x={1340} y={barY - 40} fontSize={54} fontWeight={800} textAnchor="middle" fontFamily={FONT} opacity={slide}>
          <tspan fill={INK}>Z z z</tspan>
        </text>
      </g>
    </Frame>
  );
};

// 3) Bên trong nhà tranh giữa đêm — hai người vừa ngồi dậy, nến vừa thắp
export const MidnightWakeCottage: React.FC<StoryProps> = ({ frame }) => {
  const light = easeOut(progress(frame, 6, 30));
  const rise = easeOut(progress(frame, 2, 20));
  return (
    <Frame bg="#20182e">
      {/* tường trong nhà */}
      <rect x={140} y={210} width={1640} height={720} fill="#4a3c2f" stroke={INK} strokeWidth={10} />
      {/* mái tranh */}
      <path d="M 90 210 L 960 40 L 1830 210 Z" fill="#c9a961" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <g stroke={INK} strokeWidth={4} opacity={0.6}>
        {new Array(12).fill(0).map((_, i) => (
          <line key={i} x1={960} y1={55} x2={140 + i * 145} y2={205} />
        ))}
      </g>

      {/* quầng sáng nến */}
      <circle cx={1310} cy={640} r={120 + light * 330} fill="#ffb84d" opacity={0.3 * light} />

      {/* cửa sổ với trăng */}
      <g>
        <rect x={330} y={300} width={240} height={200} fill="#16224d" stroke={INK} strokeWidth={9} />
        <line x1={450} y1={300} x2={450} y2={500} stroke={INK} strokeWidth={7} />
        <line x1={330} y1={400} x2={570} y2={400} stroke={INK} strokeWidth={7} />
        <g transform="translate(510 355)">
          <circle cx={0} cy={0} r={34} fill="#ffe9a8" />
          <circle cx={15} cy={-9} r={29} fill="#16224d" />
        </g>
        {[[370, 350], [400, 460], [530, 470]].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={5} fill="#ffffff" opacity={0.5 + 0.5 * Math.sin(frame * 0.1 + i * 2)} />
        ))}
      </g>

      {/* bếp lửa than đỏ bên trái */}
      <g transform="translate(300 830)">
        <path d="M -90 40 L 90 40 L 60 -10 L -60 -10 Z" fill="#3a2e24" stroke={INK} strokeWidth={8} />
        <ellipse cx={0} cy={-4} rx={44} ry={16} fill="#e0562a" opacity={0.55 + 0.35 * Math.sin(frame * 0.13)} />
      </g>

      {/* giường rơm + hai người ngồi dậy */}
      <rect x={780} y={790} width={620} height={40} rx={12} fill="#d2b877" stroke={INK} strokeWidth={9} />
      <g transform={`translate(0 ${(1 - rise) * 40})`}>
        <SleepHead cx={900} cy={640} r={62} awake />
        <line x1={900} y1={702} x2={900} y2={790} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <SleepHead cx={1090} cy={655} r={62} awake />
        <line x1={1090} y1={717} x2={1090} y2={790} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </g>
      {/* chăn hất sang bên */}
      <path d="M 1150 790 Q 1270 730 1390 790 Z" fill="#5a6fb5" stroke={INK} strokeWidth={9} strokeLinejoin="round" />

      {/* nến */}
      <g transform="translate(1310 700)">
        <rect x={-22} y={0} width={44} height={90} fill="#fff3d0" stroke={INK} strokeWidth={8} />
        <path
          d={`M 0 -10 c ${-24 + wobble(frame, 0.42, 4)} -26 ${-16} -60 0 -76 c ${16} 16 ${24 + wobble(frame, 0.36, 4, 1)} 50 0 76 Z`}
          fill="#ffcf4d"
          stroke={INK}
          strokeWidth={6}
          opacity={light}
        />
      </g>
    </Frame>
  );
};

// 4) Ba việc người xưa làm lúc nửa đêm
export const MidnightActivities: React.FC<StoryProps> = ({ frame }) => {
  const panels = [0, 1, 2].map((i) => easeOut(progress(frame, 6 + i * 12, 18)));
  const px = [140, 690, 1240];
  const pw = 540;
  const py = 250;
  const ph = 580;
  return (
    <Frame bg="#f6efe0">
      {panels.map((p, i) => (
        <g key={i} opacity={0.25 + p * 0.75}>
          <rect x={px[i]} y={py} width={pw} height={ph} rx={16} fill="#20305f" stroke={INK} strokeWidth={10} />
          <circle cx={px[i] + pw / 2} cy={py + ph / 2} r={200} fill="#ffb84d" fillOpacity={0.42 * p} />
        </g>
      ))}

      {/* ô 1: cầu nguyện */}
      <g opacity={panels[0]}>
        {/* người quỳ chắp tay cầu nguyện */}
        <SleepHead cx={px[0] + 230} cy={480} r={54} awake={false} />
        <g stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1={370} y1={534} x2={370} y2={690} />
          <path d="M 370 580 L 430 630 L 370 660" />
          <path d="M 370 690 L 300 745 L 430 745" />
        </g>
        <g transform="translate(500 660)">
          <rect x={-14} y={0} width={28} height={70} fill="#fff3d0" stroke={INK} strokeWidth={7} />
          <path d={`M 0 -8 c -18 -18 -12 -42 0 -54 c 12 12 18 36 0 54 Z`} fill="#ffcf4d" stroke={INK} strokeWidth={5} />
        </g>
      </g>

      {/* ô 2: hai người trò chuyện */}
      <g opacity={panels[1]}>
        <SleepHead cx={px[1] + 160} cy={520} r={52} awake />
        <line x1={850} y1={572} x2={850} y2={700} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <SleepHead cx={px[1] + 390} cy={520} r={52} awake />
        <line x1={1080} y1={572} x2={1080} y2={700} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <g transform={`translate(965 400) scale(${1 + wobble(frame, 0.16, 0.06)})`}>
          <ellipse cx={0} cy={0} rx={78} ry={52} fill="#ffffff" stroke={INK} strokeWidth={8} />
          <path d="M -18 44 L -6 76 L 14 46 Z" fill="#ffffff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          <circle cx={-28} cy={0} r={7} fill={INK} />
          <circle cx={0} cy={0} r={7} fill={INK} />
          <circle cx={28} cy={0} r={7} fill={INK} />
        </g>
      </g>

      {/* ô 3: cời lửa, tàn bay lên */}
      <g opacity={panels[2]}>
        <SleepHead cx={px[2] + 170} cy={510} r={52} awake />
        <line x1={1410} y1={562} x2={1410} y2={700} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <line x1={1410} y1={600} x2={1560} y2={680} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M 1520 760 L 1700 760 L 1670 705 L 1550 705 Z" fill="#3a2e24" stroke={INK} strokeWidth={8} />
        <ellipse cx={1610} cy={710} rx={48} ry={18} fill="#e0562a" opacity={0.6 + 0.3 * Math.sin(frame * 0.14)} />
        {[0, 1, 2, 3].map((k) => {
          const t = ((frame * 1.6 + k * 25) % 100) / 100;
          return (
            <circle
              key={k}
              cx={1610 + (seeded(k) - 0.5) * 110 * t}
              cy={700 - t * 220}
              r={5 + seeded(k + 9) * 5}
              fill="#ffb84d"
              opacity={1 - t}
            />
          );
        })}
      </g>
    </Frame>
  );
};

// 5) Chồng tài liệu cũ + kính lúp + con số 500+
export const OldDocumentsStack: React.FC<StoryProps> = ({ frame }) => {
  const lensX = 520 + Math.sin(frame * 0.045) * 260;
  const numPop = easeOut(progress(frame, 40, 16));
  return (
    <Frame bg="#f6efe0">
      {/* chồng sách */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={620 + (i % 2) * 22}
          y={760 - i * 62}
          width={660}
          height={58}
          rx={8}
          fill={['#c9a961', '#b98a4e', '#d9c48a', '#a87b45'][i]}
          stroke={INK}
          strokeWidth={9}
        />
      ))}
      {/* cuộn giấy da */}
      <g transform="translate(1420 640)">
        <rect x={-40} y={-160} width={230} height={320} rx={10} fill="#efe3c4" stroke={INK} strokeWidth={9} />
        <g stroke={INK} strokeWidth={5} opacity={0.55}>
          {new Array(6).fill(0).map((_, i) => (
            <line key={i} x1={-10} y1={-110 + i * 46} x2={160} y2={-110 + i * 46} />
          ))}
        </g>
      </g>
      {/* trang giấy bay */}
      {[0, 1, 2].map((i) => {
        const t = wobble(frame, 0.05 + i * 0.014, 26, i * 2);
        return (
          <g key={i} transform={`translate(${380 + i * 420} ${300 + t}) rotate(${-12 + i * 11})`}>
            <rect x={-70} y={-92} width={140} height={184} rx={8} fill="#fbf5e4" stroke={INK} strokeWidth={8} />
            <g stroke={INK} strokeWidth={4} opacity={0.5}>
              {new Array(5).fill(0).map((_, k) => (
                <line key={k} x1={-46} y1={-56 + k * 32} x2={46} y2={-56 + k * 32} />
              ))}
            </g>
            {/* gạch chân đỏ sáng dần */}
            <line
              x1={-46}
              y1={-56 + (i % 3) * 32}
              x2={46}
              y2={-56 + (i % 3) * 32}
              stroke="#e63328"
              strokeWidth={7}
              strokeLinecap="round"
              {...drawOn(progress(frame, 14 + i * 10, 16))}
            />
          </g>
        );
      })}
      {/* kính lúp */}
      <g transform={`translate(${lensX} 690)`}>
        <circle cx={0} cy={0} r={120} fill="#ffffff" fillOpacity={0.3} stroke={INK} strokeWidth={14} />
        <line x1={82} y1={82} x2={190} y2={190} stroke={INK} strokeWidth={22} strokeLinecap="round" />
      </g>
      {/* 500+ khoanh tròn */}
      <g transform={`translate(1620 240) scale(${0.6 + numPop * 0.4})`} opacity={numPop}>
        <text x={0} y={22} fontSize={92} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          500+
        </text>
        <ellipse cx={0} cy={-6} rx={168} ry={92} fill="none" stroke="#e63328" strokeWidth={11} />
      </g>
    </Frame>
  );
};

// 6) Trang nhật ký "sáng nay tôi đánh răng"
export const ToothbrushDiary: React.FC<StoryProps> = ({ frame }) => {
  const write = easeOut(progress(frame, 8, 40));
  const qBounce = Math.abs(Math.sin(frame * 0.09)) * 18;
  return (
    <Frame bg="#f6efe0">
      {/* trang nhật ký */}
      <g transform="translate(960 540)">
        <path d="M -560 -330 Q -540 -350 -520 -330 L 520 -330 Q 560 -320 540 -290 L 540 300 Q 560 330 520 330 L -520 330 Q -560 340 -545 300 Z" fill="#fdf8ea" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
        <g stroke={INK} strokeWidth={4} opacity={0.3}>
          {new Array(7).fill(0).map((_, i) => (
            <line key={i} x1={-480} y1={-190 + i * 80} x2={480} y2={-190 + i * 80} />
          ))}
        </g>
        {/* dòng chữ hiện dần */}
        <g clipPath="url(#diaryClip)">
          <text x={-450} y={-30} fontSize={62} fontWeight={700} fill="#243a6b" fontFamily={FONT}>
            Sáng nay tôi đánh răng.
          </text>
        </g>
        <defs>
          <clipPath id="diaryClip">
            <rect x={-460} y={-100} width={940 * write} height={110} />
          </clipPath>
        </defs>
      </g>

      {/* dấu chấm hỏi đỏ */}
      <g transform={`translate(320 ${430 - qBounce})`}>
        <path d="M -40 -60 C -40 -120 70 -120 70 -55 C 70 -8 8 0 8 48" fill="none" stroke="#e63328" strokeWidth={26} strokeLinecap="round" />
        <circle cx={8} cy={100} r={17} fill="#e63328" />
      </g>

      {/* bàn chải + bọt */}
      <g transform={`translate(1560 640) rotate(${-18 + wobble(frame, 0.22, 7)})`}>
        <rect x={-22} y={-40} width={44} height={230} rx={16} fill="#f08a3c" stroke={INK} strokeWidth={9} />
        <rect x={-40} y={-96} width={80} height={62} rx={14} fill="#ffffff" stroke={INK} strokeWidth={9} />
        <g stroke={INK} strokeWidth={6}>
          {[-24, -8, 8, 24].map((bx) => (
            <line key={bx} x1={bx} y1={-96} x2={bx} y2={-124} />
          ))}
        </g>
      </g>
      {[0, 1, 2].map((i) => {
        const t = ((frame * 1.3 + i * 33) % 100) / 100;
        return (
          <circle
            key={i}
            cx={1600 + (seeded(i) - 0.5) * 90}
            cy={480 - t * 190}
            r={16 + seeded(i + 5) * 10}
            fill="#ffffff"
            stroke={INK}
            strokeWidth={5}
            opacity={1 - t}
          />
        );
      })}
    </Frame>
  );
};

// 7) Thí nghiệm phòng tối của Wehr
export const WehrDarkRoom: React.FC<StoryProps> = ({ frame }) => {
  const dark = easeOut(progress(frame, 8, 32));
  const signIn = easeOut(progress(frame, 40, 16));
  const nod = wobble(frame, 0.13, 7);
  return (
    <Frame bg="#f6efe0">
      {/* nhà nghiên cứu */}
      <g transform={`translate(0 ${nod})`}>
        <SleepHead cx={330} cy={330} r={82} awake />
        {/* kính tròn */}
        <g fill="none" stroke={INK} strokeWidth={7}>
          <circle cx={302} cy={322} r={30} />
          <circle cx={358} cy={322} r={30} />
          <line x1={332} y1={322} x2={328} y2={322} />
        </g>
        {/* áo blouse */}
        <path d="M 330 412 L 240 470 L 250 780 L 410 780 L 420 470 Z" fill="#ffffff" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <line x1={330} y1={412} x2={330} y2={780} stroke={INK} strokeWidth={7} />
        <line x1={330} y1={780} x2={280} y2={950} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <line x1={330} y1={780} x2={392} y2={950} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        {/* tay cầm bảng */}
        <line x1={250} y1={520} x2={150} y2={640} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <g transform="translate(140 720)">
          <rect x={-80} y={-90} width={160} height={210} rx={10} fill="#ffffff" stroke={INK} strokeWidth={9} />
          <rect x={-26} y={-110} width={52} height={28} rx={7} fill="#ffffff" stroke={INK} strokeWidth={8} />
          <g stroke={INK} strokeWidth={5} opacity={0.7}>
            {new Array(5).fill(0).map((_, i) => (
              <line key={i} x1={-56} y1={-46 + i * 34} x2={56} y2={-46 + i * 34} />
            ))}
          </g>
        </g>
      </g>

      {/* phòng tối */}
      <g>
        <rect x={780} y={230} width={1000} height={700} rx={12} fill="#d9cdb2" stroke={INK} strokeWidth={12} />
        <rect x={780} y={230} width={1000} height={700} rx={12} fill="#0f1428" opacity={dark} />
        {/* cửa đóng */}
        <rect x={800} y={520} width={90} height={400} fill="#8a6b4a" stroke={INK} strokeWidth={9} opacity={1 - dark * 0.5} />
        <circle cx={868} cy={720} r={11} fill={INK} opacity={1 - dark * 0.5} />
        {/* giường + người nằm */}
        <rect x={1120} y={790} width={520} height={34} rx={12} fill="#8a6b4a" stroke={INK} strokeWidth={9} opacity={1 - dark * 0.55} />
        <g opacity={1 - dark * 0.5}>
          <SleepHead cx={1230} cy={730} r={56} awake={false} />
          <path d="M 1300 790 Q 1440 715 1600 790 Z" fill="#4a63b8" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        </g>
      </g>

      {/* biển 14 giờ tối */}
      <g transform={`translate(1280 ${170 - (1 - signIn) * 60})`} opacity={signIn}>
        <rect x={-230} y={-56} width={460} height={112} rx={14} fill="#ffffff" stroke={INK} strokeWidth={10} />
        <text x={0} y={18} fontSize={54} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          14 giờ tối
        </text>
      </g>
    </Frame>
  );
};

// 8) Giấc ngủ bị nén lại vì đèn điện
export const SleepCompressed: React.FC<StoryProps> = ({ frame }) => {
  const bulbOn = easeOut(progress(frame, 6, 18));
  const squeeze = easeOut(progress(frame, 26, 30));
  const fadeGap = 1 - easeOut(progress(frame, 30, 26));
  const topY = 240;
  const botY = 700;
  const h = 120;
  const shrink = squeeze * 190;
  return (
    <Frame bg="#f6efe0">
      {/* tầng trên: ngày xưa */}
      <text x={200} y={topY - 40} fontSize={48} fontWeight={800} fill={INK} fontFamily={FONT}>
        Ngày xưa
      </text>
      <SleepBlock x={330} y={topY} w={480} h={h} />
      <rect x={810} y={topY} width={200} height={h} rx={12} fill="#ffb84d" stroke={INK} strokeWidth={9} opacity={0.25 + fadeGap * 0.75} />
      <SleepBlock x={1010} y={topY} w={480} h={h} />

      {/* bóng đèn */}
      <g transform="translate(960 540)">
        <circle cx={0} cy={0} r={140} fill="#ffe9a8" opacity={bulbOn * 0.6} />
        <path
          d="M 0 -74 C 56 -74 60 -8 18 26 L -18 26 C -60 -8 -56 -74 0 -74 Z"
          fill={bulbOn > 0.5 ? '#ffd23f' : '#e6e0d2'}
          stroke={INK}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        <rect x={-22} y={26} width={44} height={26} rx={6} fill="#b9b9b9" stroke={INK} strokeWidth={8} />
        <g stroke="#f0a020" strokeWidth={9} strokeLinecap="round" opacity={bulbOn}>
          {[-1, 0, 1].map((k) => (
            <line key={k} x1={k * 60} y1={70} x2={k * 92} y2={124} />
          ))}
        </g>
      </g>

      {/* tầng dưới: bây giờ */}
      <text x={200} y={botY - 40} fontSize={48} fontWeight={800} fill={INK} fontFamily={FONT}>
        Bây giờ
      </text>
      <SleepBlock x={480 + shrink} y={botY} w={960 - shrink * 2} h={h} />

      {/* hai mũi tên ép vào */}
      <g stroke={INK} strokeWidth={16} strokeLinecap="round" fill="none">
        <line x1={230} y1={botY + h / 2} x2={430 + shrink} y2={botY + h / 2} />
        <path d={`M ${430 + shrink} ${botY + h / 2} l -54 -34 M ${430 + shrink} ${botY + h / 2} l -54 34`} />
        <line x1={1690} y1={botY + h / 2} x2={1490 - shrink} y2={botY + h / 2} />
        <path d={`M ${1490 - shrink} ${botY + h / 2} l 54 -34 M ${1490 - shrink} ${botY + h / 2} l 54 34`} />
      </g>
    </Frame>
  );
};
