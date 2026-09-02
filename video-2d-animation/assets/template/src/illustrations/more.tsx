import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { Stars } from './parts';

const W = 1920;
const H = 1080;

export type MoreProps = { frame: number; accent: string };

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

// 6) Người nằm ngủ, chữ Zzz bay lên, trăng lưỡi liềm
export const PersonSleeping: React.FC<MoreProps> = ({ frame }) => {
  const breathe = wobble(frame, 0.08, 8);
  return (
    <Frame bg="#1b2a5e">
      <Stars frame={frame} width={W} height={640} />
      {/* trăng lưỡi liềm */}
      <g transform="translate(1580 190)">
        <circle cx={0} cy={0} r={95} fill="#ffe9a8" />
        <circle cx={42} cy={-26} r={82} fill="#1b2a5e" />
      </g>
      {/* nền đất */}
      <path d={`M 0 720 Q ${W / 2} 680 ${W} 735 L ${W} ${H} L 0 ${H} Z`} fill="#3c2f6b" />
      {/* chiếu nằm */}
      <rect x={430} y={805} width={1060} height={34} rx={16} fill="#c9a961" stroke={INK} strokeWidth={9} />
      {/* người nằm */}
      <g transform={`translate(0 ${breathe})`}>
        {/* chăn */}
        <path
          d="M 720 805 Q 900 690 1150 730 L 1420 805 Z"
          fill="#5b7fd4"
          stroke={INK}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        {/* đầu */}
        <circle cx={620} cy={735} r={82} fill="#ffffff" stroke={INK} strokeWidth={9} />
        {/* mắt nhắm */}
        <path d="M 585 720 q 22 20 44 0 M 645 718 q 20 18 40 0" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <line x1={600} y1={775} x2={640} y2={775} stroke={INK} strokeWidth={7} strokeLinecap="round" />
        {/* gối */}
        <path d="M 470 805 q 40 -95 165 -60" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </g>
      {/* Zzz bay lên */}
      {[0, 1, 2].map((i) => {
        const cycle = (frame * 1.4 + i * 34) % 100;
        const p = cycle / 100;
        return (
          <text
            key={i}
            x={760 + p * 130}
            y={640 - p * 300}
            fontSize={70 + i * 22}
            fontWeight={800}
            fill="#ffffff"
            opacity={Math.sin(p * Math.PI)}
            fontFamily='"Comic Sans MS", Inter, sans-serif'
          >
            Z
          </text>
        );
      })}
    </Frame>
  );
};

// 7) Mặt trời mọc — tia sáng xoay, mặt trời nhô lên
export const Sunrise: React.FC<MoreProps> = ({ frame }) => {
  const rise = easeOut(progress(frame, 0, 70));
  const sunY = 760 - rise * 300;
  return (
    <Frame bg="#ffd9a0">
      <rect x={0} y={0} width={W} height={330} fill="#7fb2e5" />
      <rect x={0} y={330} width={W} height={200} fill="#ffc46b" />
      {/* tia sáng xoay */}
      <g transform={`rotate(${frame * 0.35} ${W / 2} ${sunY})`}>
        {new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={W / 2 + Math.cos(a) * 250}
              y1={sunY + Math.sin(a) * 250}
              x2={W / 2 + Math.cos(a) * (360 + wobble(frame, 0.2, 20, i))}
              y2={sunY + Math.sin(a) * (360 + wobble(frame, 0.2, 20, i))}
              stroke="#ffb020"
              strokeWidth={18}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <circle cx={W / 2} cy={sunY} r={215} fill="#ffb020" stroke={INK} strokeWidth={10} />
      {/* đồi */}
      <path d={`M 0 780 Q 380 640 760 785 T 1500 770 T ${W} 800 L ${W} ${H} L 0 ${H} Z`} fill="#4e9c3f" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d={`M 0 900 Q 520 810 1080 915 T ${W} 900 L ${W} ${H} L 0 ${H} Z`} fill="#3d8130" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
    </Frame>
  );
};

// 8) Biểu đồ cột mọc dần
export const BarChart: React.FC<MoreProps> = ({ frame, accent }) => {
  const values = [0.42, 0.6, 0.5, 0.78, 0.95];
  const baseY = 860;
  const maxH = 560;
  return (
    <Frame bg="#ffffff">
      {/* trục */}
      <g stroke={INK} strokeWidth={12} strokeLinecap="round">
        <line x1={340} y1={220} x2={340} y2={baseY} />
        <line x1={340} y1={baseY} x2={1660} y2={baseY} />
      </g>
      {values.map((v, i) => {
        const p = easeOut(progress(frame, 8 + i * 8, 22));
        const h = v * maxH * p;
        const x = 430 + i * 235;
        return (
          <g key={i}>
            <rect
              x={x}
              y={baseY - h}
              width={165}
              height={h}
              fill={i === values.length - 1 ? accent : '#7fb2e5'}
              stroke={INK}
              strokeWidth={9}
            />
            {p > 0.95 ? (
              <text
                x={x + 82}
                y={baseY - h - 28}
                fontSize={46}
                fontWeight={800}
                textAnchor="middle"
                fill={INK}
                fontFamily='"Comic Sans MS", Inter, sans-serif'
              >
                {Math.round(v * 100)}%
              </text>
            ) : null}
          </g>
        );
      })}
      {/* mũi tên xu hướng */}
      <g stroke={accent} strokeWidth={14} fill="none" strokeLinecap="round">
        <line x1={470} y1={330} x2={1560} y2={200} {...drawOn(progress(frame, 55, 25))} />
        {progress(frame, 55, 25) > 0.9 ? (
          <path d="M 1560 200 l -66 -6 M 1560 200 l -46 46" />
        ) : null}
      </g>
    </Frame>
  );
};

// 9) Thành phố về đêm — cửa sổ sáng nhấp nháy
export const CityNight: React.FC<MoreProps> = ({ frame }) => {
  const buildings = [
    { x: 140, w: 210, h: 420 },
    { x: 375, w: 165, h: 620 },
    { x: 560, w: 240, h: 330 },
    { x: 820, w: 190, h: 700 },
    { x: 1030, w: 220, h: 480 },
    { x: 1270, w: 175, h: 620 },
    { x: 1465, w: 250, h: 380 },
    { x: 1735, w: 165, h: 540 },
  ];
  const groundY = 960;
  return (
    <Frame bg="#101c44">
      <Stars frame={frame} width={W} height={520} />
      <circle cx={1650} cy={170} r={80} fill="#ffe9a8" />
      {buildings.map((b, i) => {
        const top = groundY - b.h;
        const cols = Math.floor(b.w / 62);
        const rows = Math.floor(b.h / 78);
        return (
          <g key={i}>
            <rect x={b.x} y={top} width={b.w} height={b.h} fill="#1d2f66" stroke={INK} strokeWidth={9} />
            {new Array(cols * rows).fill(0).map((_, k) => {
              const c = k % cols;
              const rIdx = Math.floor(k / cols);
              const lit = seeded(i * 40 + k) > 0.42;
              const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.09 + seeded(k + i) * 6.5));
              if (!lit) return null;
              return (
                <rect
                  key={k}
                  x={b.x + 22 + c * 62}
                  y={top + 30 + rIdx * 78}
                  width={34}
                  height={46}
                  fill="#ffd25e"
                  opacity={blink}
                />
              );
            })}
          </g>
        );
      })}
      <rect x={0} y={groundY} width={W} height={H - groundY} fill="#0a1230" stroke={INK} strokeWidth={9} />
    </Frame>
  );
};

// 10) Bóng đèn ý tưởng — sáng dần, tia tỏa ra
export const LightbulbIdea: React.FC<MoreProps> = ({ frame, accent }) => {
  const on = progress(frame, 20, 20);
  const glow = 0.35 + 0.65 * on * (0.85 + 0.15 * Math.sin(frame * 0.25));
  const cx = W / 2;
  const cy = 470;
  return (
    <Frame bg="#ffffff">
      <circle cx={cx} cy={cy} r={330} fill="#ffe9a8" opacity={glow * 0.65} />
      {/* tia sáng */}
      <g stroke={accent} strokeWidth={16} strokeLinecap="round">
        {new Array(10).fill(0).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const p = progress(frame, 26 + i * 2, 14);
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * 340}
              y1={cy + Math.sin(a) * 340}
              x2={cx + Math.cos(a) * 470}
              y2={cy + Math.sin(a) * 470}
              {...drawOn(p)}
            />
          );
        })}
      </g>
      {/* bóng đèn */}
      <path
        d={`M ${cx} ${cy - 250}
            C ${cx + 190} ${cy - 250} ${cx + 200} ${cy + 20} ${cx + 60} ${cy + 130}
            L ${cx - 60} ${cy + 130}
            C ${cx - 200} ${cy + 20} ${cx - 190} ${cy - 250} ${cx} ${cy - 250} Z`}
        fill={on > 0.5 ? '#ffd23f' : '#f2f2f2'}
        stroke={INK}
        strokeWidth={11}
        strokeLinejoin="round"
      />
      {/* tim đèn */}
      <path
        d={`M ${cx - 55} ${cy - 60} L ${cx - 20} ${cy - 130} L ${cx + 20} ${cy - 30} L ${cx + 55} ${cy - 110}`}
        fill="none"
        stroke={INK}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* đui đèn */}
      <g fill="#b9b9b9" stroke={INK} strokeWidth={10}>
        <rect x={cx - 62} y={cy + 130} width={124} height={54} rx={10} />
        <rect x={cx - 62} y={cy + 184} width={124} height={54} rx={10} />
        <rect x={cx - 40} y={cy + 238} width={80} height={40} rx={14} />
      </g>
    </Frame>
  );
};
