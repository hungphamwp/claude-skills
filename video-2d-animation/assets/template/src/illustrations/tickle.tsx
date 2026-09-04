import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { HighlightRing, PointerArrow, PopLabel, PulseRing } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type TickleProps = { frame: number; accent: string };

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

type Face = 'bored' | 'laugh' | 'curious' | 'calm';
const THead: React.FC<{ cx: number; cy: number; r?: number; face: Face; frame?: number }> = ({
  cx,
  cy,
  r = 84,
  face,
  frame = 0,
}) => {
  const ey = cy - r * 0.12;
  const dx = r * 0.34;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={INK} strokeWidth={9} />
      {face === 'laugh' ? (
        <>
          {/* mắt nhắm tít cười */}
          <path
            d={`M ${cx - dx - r * 0.2} ${ey + r * 0.06} q ${r * 0.2} ${-r * 0.24} ${r * 0.4} 0
                M ${cx + dx - r * 0.2} ${ey + r * 0.06} q ${r * 0.2} ${-r * 0.24} ${r * 0.4} 0`}
            fill="none"
            stroke={INK}
            strokeWidth={8}
            strokeLinecap="round"
          />
          {/* miệng cười to */}
          <path
            d={`M ${cx - r * 0.42} ${cy + r * 0.26} q ${r * 0.42} ${r * 0.62} ${r * 0.84} 0 Z`}
            fill={INK}
          />
        </>
      ) : (
        <>
          <ellipse cx={cx - dx} cy={ey} rx={r * 0.17} ry={r * 0.21} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <ellipse cx={cx + dx} cy={ey} rx={r * 0.17} ry={r * 0.21} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <circle cx={cx - dx} cy={ey + (face === 'curious' ? -r * 0.06 : 0)} r={r * 0.1} fill={INK} />
          <circle cx={cx + dx} cy={ey + (face === 'curious' ? -r * 0.06 : 0)} r={r * 0.1} fill={INK} />
          {face === 'bored' ? (
            <>
              {/* mí mắt trĩu + miệng ngang thẳng đơ */}
              <g stroke={INK} strokeWidth={7} strokeLinecap="round">
                <line x1={cx - dx - r * 0.2} y1={ey - r * 0.2} x2={cx - dx + r * 0.2} y2={ey - r * 0.18} />
                <line x1={cx + dx - r * 0.2} y1={ey - r * 0.18} x2={cx + dx + r * 0.2} y2={ey - r * 0.2} />
              </g>
              <line x1={cx - r * 0.28} y1={cy + r * 0.44} x2={cx + r * 0.28} y2={cy + r * 0.44} stroke={INK} strokeWidth={7} strokeLinecap="round" />
            </>
          ) : (
            <line x1={cx - r * 0.24} y1={cy + r * 0.44} x2={cx + r * 0.24} y2={cy + r * 0.44} stroke={INK} strokeWidth={7} strokeLinecap="round" />
          )}
        </>
      )}
    </g>
  );
};

// Bàn tay ngo ngoe ngón — dùng cho cả hai cảnh cù
const WigglyHand: React.FC<{ x: number; y: number; frame: number; flip?: boolean; scale?: number }> = ({
  x,
  y,
  frame,
  flip = false,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    {/* bốn ngón ngo ngoe: vẽ nét đen dày rồi phủ trắng lên để thành ngón có viền */}
    {[0, 1, 2, 3].map((i) => {
      const w = wobble(frame, 0.5, 16, i * 1.25);
      const fx = -54 + i * 36;
      const d = `M ${fx} 20 q ${w} -56 ${10 + w} -104`;
      return (
        <g key={i}>
          <path d={d} fill="none" stroke={INK} strokeWidth={40} strokeLinecap="round" />
          <path d={d} fill="none" stroke="#ffffff" strokeWidth={24} strokeLinecap="round" />
        </g>
      );
    })}
    {/* ngón cái chìa sang bên */}
    <path d="M -74 26 q -62 16 -70 74" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" />
    <path d="M -74 26 q -62 16 -70 74" fill="none" stroke="#ffffff" strokeWidth={26} strokeLinecap="round" />
    {/* lòng bàn tay phủ lên gốc ngón */}
    <ellipse cx={0} cy={52} rx={86} ry={64} fill="#ffffff" stroke={INK} strokeWidth={10} />
  </g>
);

// 1) Tự cù mình — mặt tỉnh bơ
export const TickleSelfFail: React.FC<TickleProps> = ({ frame }) => (
  <Frame bg="#eef2f6">
    <g transform="translate(880 480)">
      <THead cx={0} cy={0} r={110} face="bored" />
      <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
        <line x1={0} y1={110} x2={0} y2={420} />
        <path d="M 0 190 L -190 300" />
        <path d="M 0 420 L -110 620 M 0 420 L 110 620" />
      </g>
      {/* tay tự cù vào nách mình */}
      <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
        <path d="M 0 190 L 210 250 L 90 200" />
      </g>
      <WigglyHand x={70} y={190} frame={frame} scale={0.85} />
    </g>
    <PopLabel frame={frame} at={8} x={480} y={300} text="Tự cù" bg="#8a97a8" size={56} />
    <PopLabel frame={frame} at={26} x={1470} y={520} text="Chẳng buồn gì cả" bg="#8a97a8" size={50} />
    {/* mấy dấu gạch buồn tẻ */}
    <g stroke="#8a97a8" strokeWidth={10} strokeLinecap="round" opacity={easeOut(progress(frame, 34, 16))}>
      <line x1={1180} y1={330} x2={1250} y2={300} />
      <line x1={1200} y1={400} x2={1280} y2={392} />
    </g>
  </Frame>
);

// 2) Người khác cù — cười rầm trời
export const TickleOtherLaugh: React.FC<TickleProps> = ({ frame }) => {
  const shake = wobble(frame, 0.85, 12);
  const pop = easeOut(progress(frame, 6, 14));
  return (
    <Frame bg="#fff3d8">
      {/* người bị cù, rung lắc */}
      <g transform={`translate(${760 + shake} 400) rotate(${wobble(frame, 0.7, 5)} 0 300)`}>
        <THead cx={0} cy={0} r={112} face="laugh" />
        <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
          <line x1={0} y1={112} x2={0} y2={420} />
          <path d="M 0 190 L -230 120 M 0 190 L 230 130" />
          <path d="M 0 420 L -130 620 M 0 420 L 130 620" />
        </g>
      </g>
      {/* người đi cù */}
      <g transform="translate(1450 430)">
        <THead cx={0} cy={0} r={92} face="curious" />
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={0} y1={92} x2={0} y2={380} />
          <path d="M 0 160 L -300 140" />
          <path d="M 0 380 L -90 560 M 0 380 L 90 560" />
        </g>
      </g>
      <WigglyHand x={1150} y={560} frame={frame} flip scale={1} />

      {/* tia cười bật ra */}
      <g stroke="#e63328" strokeWidth={12} strokeLinecap="round" opacity={pop}>
        {[-1.1, -0.7, -0.3, 0.1].map((a, i) => (
          <line
            key={i}
            x1={760 + Math.cos(a) * 190}
            y1={260 + Math.sin(a) * 190}
            x2={760 + Math.cos(a) * (250 + wobble(frame, 0.4, 14, i))}
            y2={260 + Math.sin(a) * (250 + wobble(frame, 0.4, 14, i))}
          />
        ))}
      </g>
      {['HA', 'HA', 'HI'].map((t, i) => {
        const p = ((frame * 1.5 + i * 33) % 100) / 100;
        return (
          <text
            key={i}
            x={330 + i * 130 + p * 60}
            y={420 - p * 200}
            fontSize={70 + i * 14}
            fontWeight={800}
            fill="#e63328"
            opacity={Math.sin(p * Math.PI)}
            fontFamily={FONT}
          >
            {t}
          </text>
        );
      })}
      <PopLabel frame={frame} at={30} x={1080} y={950} text="Người khác cù" bg="#e63328" size={54} />
    </Frame>
  );
};

// 3) Tiểu não là cỗ máy dự báo
export const BrainPredictionEngine: React.FC<TickleProps> = ({ frame }) => {
  const send = easeOut(progress(frame, 16, 26));
  const glow = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.13));
  return (
    <Frame bg="#f3edfd">
      {/* đầu nhìn nghiêng + não */}
      <g transform="translate(620 500)">
        <path
          d="M -280 60 C -280 -220 -50 -320 140 -270 C 330 -220 370 -20 310 130 C 270 240 60 290 -50 270 L -60 350 L -220 330 C -280 290 -280 180 -280 60 Z"
          fill="#ffd9c9"
          stroke={INK}
          strokeWidth={12}
          strokeLinejoin="round"
        />
        <g stroke={INK} strokeWidth={7} fill="none" opacity={0.45}>
          <path d="M -190 -110 q 70 -60 140 0 q 70 60 140 0" />
          <path d="M -180 10 q 70 -60 140 0 q 70 60 140 0" />
        </g>
        {/* tiểu não phía sau dưới */}
        <g>
          <ellipse cx={-150} cy={190} rx={120} ry={78} fill="#a78bfa" stroke={INK} strokeWidth={11} opacity={glow} />
          <g stroke={INK} strokeWidth={5} opacity={0.6}>
            {new Array(5).fill(0).map((_, i) => (
              <path key={i} d={`M -250 ${150 + i * 20} q 100 ${14} 200 0`} fill="none" />
            ))}
          </g>
        </g>
        <text x={-150} y={330} fontSize={40} fontWeight={800} fill="#6d3fd4" textAnchor="middle" fontFamily={FONT}>
          tiểu não
        </text>
      </g>

      {/* bản dự báo bay ra */}
      <g transform={`translate(${960 + send * 380} ${420 - send * 60})`} opacity={send}>
        <rect x={-160} y={-110} width={320} height={220} rx={14} fill="#ffffff" stroke={INK} strokeWidth={11} />
        <text x={0} y={-40} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          DỰ BÁO
        </text>
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.65}>
          <line x1={-110} y1={0} x2={110} y2={0} />
          <line x1={-110} y1={40} x2={60} y2={40} />
        </g>
        <path d="M -60 76 q 60 34 120 -10" fill="none" stroke="#22a04a" strokeWidth={9} strokeLinecap="round" />
      </g>
      <PointerArrow frame={frame} at={14} from={[560, 700]} to={[930, 520]} color="#8b5cf6" curve={-0.22} />
      <PopLabel frame={frame} at={6} x={500} y={170} text="Não đoán trước tương lai" bg="#8b5cf6" size={52} />
      <PopLabel frame={frame} at={44} x={1520} y={800} text="Tay sắp chạm vào đâu, cảm giác ra sao" bg="#ffffff" color={INK} size={40} />
    </Frame>
  );
};

// 4) Dự báo triệt tiêu cảm giác thật
export const SignalCancel: React.FC<TickleProps> = ({ frame }) => {
  const draw1 = easeOut(progress(frame, 6, 22));
  const draw2 = easeOut(progress(frame, 22, 22));
  const cancel = easeOut(progress(frame, 46, 22));
  const waveUp = (y: number) =>
    `M 260 ${y} ${new Array(6).fill(0).map((_, i) => `q 60 ${i % 2 === 0 ? -80 : 80} 120 0`).join(' ')}`;
  const waveDown = (y: number) =>
    `M 260 ${y} ${new Array(6).fill(0).map((_, i) => `q 60 ${i % 2 === 0 ? 80 : -80} 120 0`).join(' ')}`;
  return (
    <Frame bg="#eaf3fb">
      <g>
        <path d={waveUp(280)} fill="none" stroke="#8b5cf6" strokeWidth={13} strokeLinecap="round" {...drawOn(draw1)} />
        <PopLabel frame={frame} at={8} x={1520} y={280} text="Dự báo của não" bg="#8b5cf6" size={44} />
      </g>
      <g>
        <path d={waveDown(540)} fill="none" stroke="#e63328" strokeWidth={13} strokeLinecap="round" {...drawOn(draw2)} />
        <PopLabel frame={frame} at={24} x={1520} y={540} text="Cảm giác thật" bg="#e63328" size={44} />
      </g>
      {/* dấu cộng */}
      <g stroke={INK} strokeWidth={13} strokeLinecap="round" opacity={draw2}>
        <line x1={160} y1={410} x2={230} y2={410} />
        <line x1={195} y1={375} x2={195} y2={445} />
      </g>
      <line x1={230} y1={660} x2={1180} y2={660} stroke={INK} strokeWidth={11} strokeLinecap="round" opacity={draw2} />
      {/* kết quả: đường phẳng lì */}
      <g opacity={cancel}>
        <line x1={260} y1={800} x2={980} y2={800} stroke="#22a04a" strokeWidth={13} strokeLinecap="round" />
        <PopLabel frame={frame} at={50} x={1520} y={800} text="Triệt tiêu!" bg="#22a04a" size={48} />
      </g>
      <PulseRing frame={frame} at={48} cx={620} cy={800} r={200} color="#22a04a" count={2} />
    </Frame>
  );
};

// 5) So sánh ảnh quét não
export const BrainScanCompare: React.FC<TickleProps> = ({ frame }) => {
  const glowA = 0.2 + 0.15 * Math.abs(Math.sin(frame * 0.1));
  const glowB = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.14));
  const Brain: React.FC<{ x: number; glow: number; color: string }> = ({ x, glow, color }) => (
    <g transform={`translate(${x} 520)`}>
      <rect x={-260} y={-260} width={520} height={520} rx={18} fill="#0d1730" stroke={INK} strokeWidth={12} />
      <path
        d="M -170 60 C -170 -130 -30 -190 90 -160 C 200 -130 220 -10 180 80 C 150 150 20 180 -40 168 L -46 210 L -140 198 C -172 172 -170 120 -170 60 Z"
        fill="#2b3f6b"
        stroke="#7fa8dd"
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <ellipse cx={40} cy={-40} rx={92} ry={62} fill={color} opacity={glow} />
      <ellipse cx={40} cy={-40} rx={54} ry={36} fill="#ffe9a8" opacity={glow * 0.9} />
    </g>
  );
  return (
    <Frame bg="#101c3a">
      <Brain x={560} glow={glowA} color="#3a6fd6" />
      <Brain x={1360} glow={glowB} color="#ff8c42" />
      <PopLabel frame={frame} at={6} x={560} y={180} text="Tự chạm" bg="#3a6fd6" size={52} />
      <PopLabel frame={frame} at={20} x={1360} y={180} text="Người khác chạm" bg="#ff8c42" size={52} />
      <PopLabel frame={frame} at={38} x={560} y={890} text="mờ hẳn" bg="#8a97a8" size={46} />
      <PopLabel frame={frame} at={48} x={1360} y={890} text="sáng rực" bg="#e63328" size={46} />
      <HighlightRing frame={frame} at={52} cx={1400} cy={480} r={170} color="#ffd23f" />
    </Frame>
  );
};

// 6) Thí nghiệm hai robot
export const RobotTickleLab: React.FC<TickleProps> = ({ frame }) => {
  const lever = wobble(frame, 0.28, 22);
  return (
    <Frame bg="#eef6f2">
      {/* người ngồi giữa */}
      <g transform="translate(960 380)">
        <THead cx={0} cy={0} r={96} face="curious" />
        <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
          <line x1={0} y1={96} x2={0} y2={330} />
          <path d={`M 0 170 L -260 ${250 + lever}`} />
          <path d="M 0 170 L 260 240" />
        </g>
      </g>
      {/* robot trái: cần gạt tay trái điều khiển */}
      <g transform={`translate(500 700)`}>
        <rect x={-140} y={-40} width={280} height={200} rx={14} fill="#6b7280" stroke={INK} strokeWidth={12} />
        <g transform={`rotate(${lever * 0.5})`}>
          <line x1={0} y1={-40} x2={0} y2={-190} stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <circle cx={0} cy={-200} r={34} fill="#e63328" stroke={INK} strokeWidth={11} />
        </g>
        <text x={0} y={210} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          tay trái điều khiển
        </text>
      </g>
      {/* dây nối */}
      <path
        d={`M 640 660 q 320 ${140 + lever} 700 -20`}
        fill="none"
        stroke={INK}
        strokeWidth={10}
        strokeDasharray="22 18"
        strokeLinecap="round"
      />
      {/* robot phải: cánh tay cù */}
      <g transform="translate(1450 700)">
        <rect x={-120} y={-40} width={240} height={200} rx={14} fill="#6b7280" stroke={INK} strokeWidth={12} />
        <g transform={`translate(0 -40) rotate(${-16 + lever * 0.6})`}>
          <line x1={0} y1={0} x2={0} y2={-160} stroke={INK} strokeWidth={16} strokeLinecap="round" />
          <g transform="translate(0 -180)">
            <WigglyHand x={0} y={0} frame={frame} scale={0.6} />
          </g>
        </g>
        <text x={0} y={210} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          robot cù tay phải
        </text>
      </g>
      <PopLabel frame={frame} at={8} x={960} y={140} text="Thí nghiệm 1998 — 16 người" bg="#22a04a" size={50} />
      <PopLabel frame={frame} at={40} x={960} y={980} text="Tự cù mình… qua máy" bg="#ffffff" color={INK} size={46} />
    </Frame>
  );
};

// 7) Núm vặn độ trễ
export const DelayDial: React.FC<TickleProps> = ({ frame }) => {
  const turn = easeOut(progress(frame, 8, 40));
  const level = turn;
  return (
    <Frame bg="#fff6e0">
      {/* núm vặn */}
      <g transform="translate(560 540)">
        <circle cx={0} cy={0} r={210} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <g transform={`rotate(${-120 + turn * 240})`}>
          <line x1={0} y1={0} x2={0} y2={-160} stroke="#e63328" strokeWidth={18} strokeLinecap="round" />
        </g>
        <circle cx={0} cy={0} r={26} fill={INK} />
        {/* vạch chia */}
        <g stroke={INK} strokeWidth={8} strokeLinecap="round">
          {new Array(7).fill(0).map((_, i) => {
            const a = (-120 + i * 40) * (Math.PI / 180) - Math.PI / 2;
            return <line key={i} x1={Math.cos(a) * 226} y1={Math.sin(a) * 226} x2={Math.cos(a) * 260} y2={Math.sin(a) * 260} />;
          })}
        </g>
        <text x={0} y={330} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          độ trễ của robot
        </text>
      </g>

      {/* thang đo độ buồn */}
      <g transform="translate(1250 300)">
        <text x={230} y={-40} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          mức độ buồn
        </text>
        <rect x={0} y={0} width={460} height={90} rx={20} fill="#ffffff" stroke={INK} strokeWidth={12} />
        <rect x={10} y={10} width={Math.max(0, 440 * level)} height={70} rx={16} fill="#e63328" />
        {/* mặt cười theo mức */}
        <g transform="translate(230 260)">
          <THead cx={0} cy={0} r={110} face={level > 0.55 ? 'laugh' : 'bored'} />
        </g>
      </g>

      <PopLabel frame={frame} at={10} x={430} y={170} text="Vặn cho robot chậm lại" bg="#f5a623" color={INK} size={48} />
      <PopLabel frame={frame} at={48} x={1480} y={880} text="Càng trễ — càng buồn!" bg="#e63328" size={54} />
    </Frame>
  );
};

// 8) Hai kiểu cù
export const TwoTickleTypes: React.FC<TickleProps> = ({ frame }) => {
  const a = easeOut(progress(frame, 4, 18));
  const b = easeOut(progress(frame, 24, 18));
  const featherY = wobble(frame, 0.3, 20);
  return (
    <Frame bg="#f2fbfd">
      <line x1={960} y1={120} x2={960} y2={980} stroke={INK} strokeWidth={10} strokeDasharray="26 20" />

      {/* trái: nhẹ như lông vũ */}
      <g opacity={a}>
        <rect x={200} y={150} width={520} height={110} rx={16} fill="#5fc9e8" stroke={INK} strokeWidth={11} />
        <text x={460} y={225} fontSize={50} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          Nhồn nhột
        </text>
        {/* cánh tay + lông vũ */}
        <path d="M 250 620 q 220 -60 420 10" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <g transform={`translate(470 ${520 + featherY}) rotate(-24)`}>
          <path d="M 0 0 q 30 -110 8 -180 q -46 70 -8 180 Z" fill="#ffffff" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <line x1={4} y1={-6} x2={8} y2={-160} stroke={INK} strokeWidth={7} />
        </g>
        <PopLabel frame={frame} at={30} x={460} y={800} text="Tự làm được" bg="#22a04a" size={48} />
      </g>

      {/* phải: nặng tay, cười ngặt nghẽo */}
      <g opacity={b}>
        <rect x={1200} y={150} width={520} height={110} rx={16} fill="#e63328" stroke={INK} strokeWidth={11} />
        <text x={1460} y={225} fontSize={50} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
          Cười ngặt nghẽo
        </text>
        <g transform={`translate(${1400 + wobble(frame, 0.8, 10)} 560)`}>
          <THead cx={0} cy={0} r={100} face="laugh" />
          <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
            <line x1={0} y1={100} x2={0} y2={300} />
            <path d="M 0 160 L -180 110 M 0 160 L 180 120" />
          </g>
        </g>
        <WigglyHand x={1660} y={640} frame={frame} flip scale={0.75} />
        <PopLabel frame={frame} at={44} x={1460} y={890} text="Phải người khác làm" bg="#e63328" size={48} />
      </g>
    </Frame>
  );
};

// 9) Chỗ buồn là chỗ hiểm
export const SurpriseAttack: React.FC<TickleProps> = ({ frame }) => {
  const spots: [number, number, string, number][] = [
    [860, 400, 'cổ', 10],
    [740, 520, 'nách', 22],
    [980, 620, 'sườn', 34],
    [860, 930, 'gan bàn chân', 46],
  ];
  return (
    <Frame bg="#fdeeea">
      {/* người đứng giữa */}
      <g transform="translate(860 250)">
        <THead cx={0} cy={0} r={98} face="calm" />
        <g stroke={INK} strokeWidth={13} strokeLinecap="round" fill="none">
          <line x1={0} y1={98} x2={0} y2={440} />
          <path d="M 0 170 L -190 350 M 0 170 L 190 350" />
          <path d="M 0 440 L -120 700 M 0 440 L 120 700" />
        </g>
      </g>
      {spots.map(([sx, sy, label, at], i) => (
        <g key={i}>
          <HighlightRing frame={frame} at={at} cx={sx} cy={sy} r={78} color="#e63328" />
          <PopLabel
            frame={frame}
            at={at + 6}
            x={i % 2 === 0 ? 1420 : 380}
            y={sy}
            text={label}
            bg="#e63328"
            size={44}
          />
          <PointerArrow
            frame={frame}
            at={at + 8}
            from={i % 2 === 0 ? [1280, sy] : [520, sy]}
            to={i % 2 === 0 ? [sx + 90, sy] : [sx - 90, sy]}
            color="#e63328"
            width={9}
            curve={0.12}
          />
        </g>
      ))}
      <PopLabel frame={frame} at={2} x={860} y={110} text="Toàn là chỗ hiểm" bg="#e63328" size={54} />
    </Frame>
  );
};

// 10) Câu hỏi khoa học vẫn bỏ ngỏ
export const QuestionStillOpen: React.FC<TickleProps> = ({ frame }) => {
  const bob = wobble(frame, 0.09, 16);
  return (
    <Frame bg="#f3edfd">
      {/* dấu hỏi lớn giữa khung */}
      <g transform={`translate(960 ${430 + bob})`}>
        <path
          d="M -120 -150 C -120 -290 190 -290 190 -140 C 190 -30 20 -20 20 90"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={62}
          strokeLinecap="round"
        />
        <circle cx={20} cy={210} r={40} fill="#8b5cf6" />
      </g>
      {/* nhà nghiên cứu nhún vai hai bên */}
      {[[380, 1], [1540, -1]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} 560) scale(${s} 1)`}>
          <THead cx={0} cy={0} r={84} face="curious" />
          <g fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round">
            <line x1={0} y1={84} x2={0} y2={330} />
            <path d="M 0 150 L -140 90 M 0 150 L 140 90" />
            <path d="M 0 330 L -80 490 M 0 330 L 80 490" />
          </g>
        </g>
      ))}
      <PopLabel frame={frame} at={6} x={960} y={170} text="Đau thì kêu, ngứa thì gãi…" bg="#ffffff" color={INK} size={46} />
      <PopLabel frame={frame} at={30} x={960} y={860} text="Còn cù thì sao lại CƯỜI?" bg="#8b5cf6" size={56} />
      <PopLabel frame={frame} at={50} x={960} y={960} text="Khoa học vẫn chưa chốt" bg="#8a97a8" size={44} />
    </Frame>
  );
};
