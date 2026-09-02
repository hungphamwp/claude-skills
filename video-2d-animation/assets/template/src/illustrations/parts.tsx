import React from 'react';
import { INK, seeded, wobble } from './anim';

const STROKE = 9;

// ---------- Đầu nhân vật que ----------
export const Head: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  glasses?: boolean;
  brow?: 'flat' | 'raised' | 'worried';
  look?: 'front' | 'up';
}> = ({ cx, cy, r = 95, glasses = false, brow = 'flat', look = 'front' }) => {
  const eyeY = cy - r * 0.12;
  const eyeDx = r * 0.36;
  const pupilDy = look === 'up' ? -r * 0.09 : 0;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={INK} strokeWidth={STROKE} />
      {/* mắt */}
      <ellipse cx={cx - eyeDx} cy={eyeY} rx={r * 0.16} ry={r * 0.19} fill="#ffffff" stroke={INK} strokeWidth={STROKE * 0.65} />
      <ellipse cx={cx + eyeDx} cy={eyeY} rx={r * 0.16} ry={r * 0.19} fill="#ffffff" stroke={INK} strokeWidth={STROKE * 0.65} />
      <circle cx={cx - eyeDx} cy={eyeY + pupilDy} r={r * 0.075} fill={INK} />
      <circle cx={cx + eyeDx} cy={eyeY + pupilDy} r={r * 0.075} fill={INK} />
      {/* lông mày */}
      {brow === 'flat' ? (
        <>
          <line x1={cx - eyeDx - r * 0.2} y1={eyeY - r * 0.4} x2={cx - eyeDx + r * 0.2} y2={eyeY - r * 0.4} stroke={INK} strokeWidth={STROKE * 0.7} strokeLinecap="round" />
          <line x1={cx + eyeDx - r * 0.2} y1={eyeY - r * 0.4} x2={cx + eyeDx + r * 0.2} y2={eyeY - r * 0.4} stroke={INK} strokeWidth={STROKE * 0.7} strokeLinecap="round" />
        </>
      ) : null}
      {brow === 'raised' ? (
        <>
          <path d={`M ${cx - eyeDx - r * 0.22} ${eyeY - r * 0.34} q ${r * 0.22} ${-r * 0.14} ${r * 0.44} 0`} fill="none" stroke={INK} strokeWidth={STROKE * 0.7} strokeLinecap="round" />
          <path d={`M ${cx + eyeDx - r * 0.22} ${eyeY - r * 0.46} q ${r * 0.22} ${-r * 0.16} ${r * 0.44} ${r * 0.04}`} fill="none" stroke={INK} strokeWidth={STROKE * 0.7} strokeLinecap="round" />
        </>
      ) : null}
      {/* kính */}
      {glasses ? (
        <g fill="none" stroke={INK} strokeWidth={STROKE * 0.7}>
          <circle cx={cx - eyeDx} cy={eyeY} r={r * 0.3} />
          <circle cx={cx + eyeDx} cy={eyeY} r={r * 0.3} />
          <line x1={cx - eyeDx + r * 0.3} y1={eyeY} x2={cx + eyeDx - r * 0.3} y2={eyeY} />
          <line x1={cx - eyeDx - r * 0.3} y1={eyeY} x2={cx - r * 0.95} y2={eyeY - r * 0.08} />
          <line x1={cx + eyeDx + r * 0.3} y1={eyeY} x2={cx + r * 0.95} y2={eyeY - r * 0.08} />
        </g>
      ) : null}
      {/* miệng */}
      <line x1={cx - r * 0.28} y1={cy + r * 0.45} x2={cx + r * 0.28} y2={cy + r * 0.45} stroke={INK} strokeWidth={STROKE * 0.75} strokeLinecap="round" />
    </g>
  );
};

// ---------- Nhân vật đứng ----------
export const StandingFigure: React.FC<{
  x: number;
  y: number; // y của đỉnh đầu
  scale?: number;
  glasses?: boolean;
  brow?: 'flat' | 'raised' | 'worried';
}> = ({ x, y, scale = 1, glasses = false, brow = 'flat' }) => {
  const r = 95;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Head cx={0} cy={r} r={r} glasses={glasses} brow={brow} />
      <g stroke={INK} strokeWidth={STROKE} strokeLinecap="round" fill="none">
        <line x1={0} y1={r * 2} x2={0} y2={r * 2 + 250} />
        <line x1={0} y1={r * 2 + 60} x2={-150} y2={r * 2 + 190} />
        <line x1={0} y1={r * 2 + 60} x2={150} y2={r * 2 + 190} />
        <line x1={0} y1={r * 2 + 250} x2={-120} y2={r * 2 + 470} />
        <line x1={0} y1={r * 2 + 250} x2={120} y2={r * 2 + 470} />
      </g>
    </g>
  );
};

// ---------- Nhân vật ngồi bó gối ----------
export const SittingFigure: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const r = 95;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Head cx={0} cy={r} r={r} brow="raised" look="up" />
      <g stroke={INK} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* thân ngả nhẹ ra sau */}
        <line x1={0} y1={r * 2} x2={-55} y2={r * 2 + 235} />
        {/* chân trước co cao, bàn chân chạm đất */}
        <path d={`M -55 ${r * 2 + 235} L 120 ${r * 2 + 130} L 165 ${r * 2 + 320}`} />
        <line x1={165} y1={r * 2 + 320} x2={230} y2={r * 2 + 325} />
        {/* chân sau gập dưới người */}
        <path d={`M -55 ${r * 2 + 235} L 55 ${r * 2 + 300} L -165 ${r * 2 + 325}`} />
        {/* tay chống cằm */}
        <path d={`M -18 ${r * 2 + 55} L 145 ${r * 2 + 175} L 62 ${r * 2 - 5}`} />
      </g>
    </g>
  );
};

// ---------- Lửa trại ----------
export const Campfire: React.FC<{
  x: number;
  y: number; // đáy đống lửa
  scale?: number;
  frame: number;
  withLogs?: boolean;
}> = ({ x, y, scale = 1, frame, withLogs = true }) => {
  const flick = wobble(frame, 0.35, 1);
  const flick2 = wobble(frame, 0.52, 1, 1.7);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {withLogs ? (
        <g stroke={INK} strokeWidth={STROKE} strokeLinecap="round">
          <line x1={-95} y1={0} x2={95} y2={-35} stroke="#a9713a" strokeWidth={26} />
          <line x1={-95} y1={-35} x2={95} y2={0} stroke="#8c5a2b" strokeWidth={26} />
        </g>
      ) : null}
      {/* ngọn lửa ngoài */}
      <path
        d={`M 0 -30 C ${-85 + flick * 6} -70 ${-70 + flick * 8} -170 ${-18 + flick * 5} -250
            C ${-8 + flick * 4} -195 ${34 + flick2 * 6} -215 ${28 + flick2 * 5} -260
            C ${70 + flick2 * 8} -205 ${86 + flick * 6} -95 0 -30 Z`}
        fill="#f47b20"
        stroke={INK}
        strokeWidth={STROKE * 0.8}
        strokeLinejoin="round"
      />
      {/* ngọn lửa trong */}
      <path
        d={`M 0 -40 C ${-45 + flick2 * 5} -70 ${-38 + flick * 5} -130 ${-6 + flick2 * 4} -180
            C ${6 + flick * 3} -135 ${40 + flick * 5} -140 ${34 + flick2 * 4} -175
            C ${52 + flick * 5} -125 ${48 + flick2 * 5} -70 0 -40 Z`}
        fill="#ffd23f"
        stroke="none"
      />
    </g>
  );
};

// ---------- Bầu trời sao ----------
const STAR_COUNT = 26;
export const Stars: React.FC<{ frame: number; width: number; height: number }> = ({
  frame,
  width,
  height,
}) => (
  <g>
    {new Array(STAR_COUNT).fill(0).map((_, i) => {
      const sx = seeded(i + 1) * width;
      const sy = seeded(i + 50) * height;
      const r = 5 + seeded(i + 90) * 7;
      const tw = 0.55 + 0.45 * Math.sin(frame * 0.12 + i * 1.7);
      return <circle key={i} cx={sx} cy={sy} r={r} fill="#ffffff" opacity={tw} />;
    })}
  </g>
);

// ---------- Nhà tranh ----------
export const Hut: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {/* thân nhà */}
    <rect x={-230} y={-330} width={460} height={330} fill="#e2c98d" stroke={INK} strokeWidth={STROKE} />
    <rect x={-120} y={-300} width={240} height={300} fill="#c9a961" stroke={INK} strokeWidth={STROKE * 0.7} />
    {/* mái tranh */}
    <path d="M -320 -330 L 0 -560 L 320 -330 Z" fill="#e6d29a" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    {/* nét rơm tỏa từ đỉnh mái xuống mép */}
    <g stroke={INK} strokeWidth={STROKE * 0.45} opacity={0.7}>
      {new Array(13).fill(0).map((_, i) => {
        const t = (i + 1) / 14;
        return <line key={i} x1={0} y1={-555} x2={-315 + t * 630} y2={-333} />;
      })}
    </g>
    {/* riềm mái răng cưa */}
    <path
      d={`M -320 -330 ${new Array(16)
        .fill(0)
        .map((_, i) => `l 20 26 l 20 -26`)
        .join(' ')}`}
      fill="none"
      stroke={INK}
      strokeWidth={STROKE * 0.6}
    />
  </g>
);

// ---------- Khỉ ----------
export const Monkey: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round">
    {/* đuôi */}
    <path d="M -150 -120 C -260 -120 -250 30 -170 40" fill="none" strokeLinecap="round" />
    {/* thân */}
    <ellipse cx={0} cy={-110} rx={155} ry={125} fill="#9c6239" />
    {/* chân */}
    <path d="M -80 -10 q -10 60 20 70 l 60 0 q 10 -30 -20 -40 Z" fill="#9c6239" />
    <path d="M 60 -10 q -10 60 20 70 l 60 0 q 10 -30 -20 -40 Z" fill="#9c6239" />
    {/* đầu */}
    <circle cx={135} cy={-190} r={100} fill="#9c6239" />
    <ellipse cx={60} cy={-215} rx={26} ry={34} fill="#9c6239" />
    {/* mõm */}
    <ellipse cx={185} cy={-160} rx={62} ry={52} fill="#a86d40" strokeWidth={STROKE * 0.7} />
    {/* mắt */}
    <ellipse cx={150} cy={-225} rx={26} ry={30} fill="#ffffff" strokeWidth={STROKE * 0.6} />
    <ellipse cx={210} cy={-222} rx={26} ry={30} fill="#ffffff" strokeWidth={STROKE * 0.6} />
    <circle cx={158} cy={-222} r={11} fill={INK} stroke="none" />
    <circle cx={218} cy={-219} r={11} fill={INK} stroke="none" />
    {/* miệng */}
    <line x1={165} y1={-140} x2={215} y2={-140} strokeWidth={STROKE * 0.7} strokeLinecap="round" />
  </g>
);

// ---------- Dấu chấm hỏi ----------
export const QuestionMark: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({
  x,
  y,
  scale = 1,
  color = '#ffffff',
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M -42 -95 C -42 -150 62 -150 62 -88 C 62 -40 6 -34 6 12"
      fill="none"
      stroke={color}
      strokeWidth={26}
      strokeLinecap="round"
    />
    <circle cx={6} cy={62} r={16} fill={color} />
  </g>
);
