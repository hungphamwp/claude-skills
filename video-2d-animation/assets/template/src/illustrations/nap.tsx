import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { HighlightRing, PointerArrow, PopLabel, PulseRing } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type NapProps = { frame: number; accent: string };

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

// Đầu nhân vật với nhiều biểu cảm dùng riêng cho bộ hình này
type Face = 'sleepy' | 'asleep' | 'fresh' | 'groggy' | 'alarmed';
const NapHead: React.FC<{ cx: number; cy: number; r?: number; face: Face; frame?: number }> = ({
  cx,
  cy,
  r = 76,
  face,
  frame = 0,
}) => {
  const eyeY = cy - r * 0.1;
  const dx = r * 0.34;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={INK} strokeWidth={9} />
      {face === 'asleep' || face === 'sleepy' ? (
        <path
          d={`M ${cx - dx - r * 0.2} ${eyeY} q ${r * 0.2} ${r * 0.22} ${r * 0.4} 0
              M ${cx + dx - r * 0.2} ${eyeY} q ${r * 0.2} ${r * 0.22} ${r * 0.4} 0`}
          fill="none"
          stroke={INK}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ) : null}
      {face === 'fresh' || face === 'alarmed' ? (
        <>
          <ellipse cx={cx - dx} cy={eyeY} rx={r * 0.18} ry={r * (face === 'alarmed' ? 0.26 : 0.2)} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <ellipse cx={cx + dx} cy={eyeY} rx={r * 0.18} ry={r * (face === 'alarmed' ? 0.26 : 0.2)} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <circle cx={cx - dx} cy={eyeY} r={r * 0.1} fill={INK} />
          <circle cx={cx + dx} cy={eyeY} r={r * 0.1} fill={INK} />
        </>
      ) : null}
      {face === 'groggy' ? (
        <>
          {/* mắt xoáy mòng mòng */}
          {[-1, 1].map((s) => (
            <path
              key={s}
              d={`M ${cx + s * dx} ${eyeY} m -18 0 a 18 18 0 1 1 12 17 a 11 11 0 1 0 7 -11`}
              fill="none"
              stroke={INK}
              strokeWidth={6}
              transform={`rotate(${frame * 2} ${cx + s * dx} ${eyeY})`}
            />
          ))}
        </>
      ) : null}
      {/* miệng */}
      {face === 'fresh' ? (
        <path d={`M ${cx - r * 0.26} ${cy + r * 0.36} q ${r * 0.26} ${r * 0.3} ${r * 0.52} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      ) : face === 'groggy' ? (
        <path d={`M ${cx - r * 0.26} ${cy + r * 0.52} q ${r * 0.26} ${-r * 0.24} ${r * 0.52} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      ) : face === 'asleep' ? (
        <ellipse cx={cx} cy={cy + r * 0.45} rx={r * 0.16} ry={r * 0.12} fill={INK} />
      ) : (
        <line x1={cx - r * 0.24} y1={cy + r * 0.45} x2={cx + r * 0.24} y2={cy + r * 0.45} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      )}
    </g>
  );
};

const Zzz: React.FC<{ x: number; y: number; frame: number; color?: string; count?: number }> = ({
  x,
  y,
  frame,
  color = INK,
  count = 3,
}) => (
  <g>
    {new Array(count).fill(0).map((_, i) => {
      const t = ((frame * 1.3 + i * (100 / count)) % 100) / 100;
      return (
        <text
          key={i}
          x={x + t * 90}
          y={y - t * 190}
          fontSize={46 + i * 16}
          fontWeight={800}
          fill={color}
          opacity={Math.sin(t * Math.PI)}
          fontFamily={FONT}
        >
          Z
        </text>
      );
    })}
  </g>
);

// 1) Gục xuống bàn lúc 3 giờ chiều
export const NapDeskTired: React.FC<NapProps> = ({ frame }) => {
  const droop = wobble(frame, 0.06, 10);
  return (
    <Frame bg="#fdf3e0">
      {/* cửa sổ nắng chiều */}
      <g>
        <rect x={110} y={130} width={330} height={300} fill="#ffd88a" stroke={INK} strokeWidth={10} />
        <line x1={275} y1={130} x2={275} y2={430} stroke={INK} strokeWidth={8} />
        <line x1={110} y1={280} x2={440} y2={280} stroke={INK} strokeWidth={8} />
        <circle cx={370} cy={205} r={44} fill="#ffb020" stroke={INK} strokeWidth={8} />
      </g>

      {/* bàn */}
      <rect x={300} y={720} width={1340} height={36} fill="#b98a4e" stroke={INK} strokeWidth={10} />
      <rect x={400} y={756} width={34} height={230} fill="#b98a4e" stroke={INK} strokeWidth={10} />
      <rect x={1500} y={756} width={34} height={230} fill="#b98a4e" stroke={INK} strokeWidth={10} />

      {/* laptop */}
      <g transform="translate(1180 720)">
        <path d="M -190 0 L -150 -200 L 150 -200 L 190 0 Z" fill="#cfd6de" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <rect x={-150} y={-200} width={300} height={-24} fill="#cfd6de" stroke={INK} strokeWidth={10} />
        <rect x={-140} y={-420} width={280} height={196} rx={8} fill="#eaf1f7" stroke={INK} strokeWidth={10} />
        <g stroke="#9fb0c0" strokeWidth={8} strokeLinecap="round">
          {new Array(5).fill(0).map((_, i) => (
            <line key={i} x1={-105} y1={-385 + i * 34} x2={105 - (i % 2) * 70} y2={-385 + i * 34} />
          ))}
        </g>
      </g>

      {/* cốc cà phê cạn */}
      <g transform="translate(560 660)">
        <path d="M -52 0 L -40 60 L 40 60 L 52 0 Z" fill="#ffffff" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M 52 12 q 40 12 0 34" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <ellipse cx={0} cy={52} rx={30} ry={7} fill="#8a5a2b" />
      </g>

      {/* người gục xuống bàn */}
      <g transform={`translate(0 ${droop})`}>
        <NapHead cx={830} cy={640} face="sleepy" />
        <path d="M 900 700 Q 1010 690 1080 715" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M 760 700 Q 700 700 690 716" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </g>
      <Zzz x={930} y={560} frame={frame} />

      <PopLabel frame={frame} at={6} x={300} y={520} text="3 giờ chiều" bg="#f5a623" color={INK} size={52} />
      <PointerArrow frame={frame} at={30} from={[760, 470]} to={[600, 620]} color="#e63328" curve={-0.3} />
      <PopLabel frame={frame} at={44} x={790} y={430} text="cà phê hết rồi" bg="#ffffff" color={INK} size={40} />
    </Frame>
  );
};

// 2) Hai kết cục: 20 phút vs 45 phút
export const NapTwoOutcomes: React.FC<NapProps> = ({ frame }) => {
  const left = easeOut(progress(frame, 4, 18));
  const right = easeOut(progress(frame, 20, 18));
  const bounce = wobble(frame, 0.16, 9);
  return (
    <Frame bg="#f6efe0">
      <line x1={960} y1={110} x2={960} y2={980} stroke={INK} strokeWidth={10} strokeDasharray="26 20" />

      {/* bên trái: 20 phút - tỉnh táo */}
      <g opacity={left}>
        <rect x={220} y={130} width={430} height={110} rx={16} fill="#22a04a" stroke={INK} strokeWidth={10} />
        <text x={435} y={205} fontSize={62} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
          20 phút
        </text>
        <g transform={`translate(0 ${-Math.abs(bounce)})`}>
          <NapHead cx={435} cy={480} r={92} face="fresh" />
          <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
            <line x1={435} y1={572} x2={435} y2={790} />
            <line x1={435} y1={630} x2={310} y2={540} />
            <line x1={435} y1={630} x2={560} y2={540} />
            <line x1={435} y1={790} x2={350} y2={940} />
            <line x1={435} y1={790} x2={520} y2={940} />
          </g>
          {/* tia năng lượng */}
          <g stroke="#22a04a" strokeWidth={10} strokeLinecap="round">
            {[-1, 0, 1].map((k) => (
              <line key={k} x1={435 + k * 96} y1={352 - Math.abs(k) * 14} x2={435 + k * 140} y2={286 - Math.abs(k) * 20} />
            ))}
          </g>
        </g>
        <text x={435} y={1015} fontSize={46} fontWeight={800} fill="#22a04a" textAnchor="middle" fontFamily={FONT}>
          Tỉnh như sáo
        </text>
      </g>

      {/* bên phải: 45 phút - vật vờ */}
      <g opacity={right}>
        <rect x={1270} y={130} width={430} height={110} rx={16} fill="#e63328" stroke={INK} strokeWidth={10} />
        <text x={1485} y={205} fontSize={62} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
          45 phút
        </text>
        <g transform={`translate(0 ${Math.abs(wobble(frame, 0.07, 7))}) rotate(${wobble(frame, 0.05, 3)} 1485 700)`}>
          <NapHead cx={1485} cy={500} r={92} face="groggy" frame={frame} />
          {/* tóc bù */}
          <g stroke={INK} strokeWidth={8} strokeLinecap="round">
            {[-70, -30, 10, 50].map((hx, i) => (
              <line key={hx} x1={1485 + hx} y1={425 - Math.abs(hx) * 0.25} x2={1485 + hx * 1.3} y2={355 - i * 6} />
            ))}
          </g>
          <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
            <line x1={1485} y1={592} x2={1470} y2={800} />
            <line x1={1478} y1={650} x2={1360} y2={730} />
            <line x1={1478} y1={650} x2={1600} y2={735} />
            <line x1={1470} y1={800} x2={1390} y2={945} />
            <line x1={1470} y1={800} x2={1560} y2={945} />
          </g>
        </g>
        <text x={1485} y={1015} fontSize={46} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          Mệt hơn lúc chưa ngủ
        </text>
      </g>
    </Frame>
  );
};

// Đồ thị sóng chu kỳ giấc ngủ, dùng lại cho vài cảnh
const CycleGraph: React.FC<{
  frame: number;
  markAt?: number; // 0..1 vị trí con trỏ trên trục
  highlight?: 'shallow' | 'deep' | 'full' | 'none';
}> = ({ frame, markAt, highlight = 'none' }) => {
  const x0 = 260;
  const x1 = 1680;
  const yTop = 330;
  const yBot = 760;
  const draw = easeOut(progress(frame, 6, 40));
  // đường cong: chìm xuống rồi nổi lên trong 90 phút
  const path = `M ${x0} ${yTop} C ${x0 + 220} ${yTop + 40} ${x0 + 300} ${yBot} ${(x0 + x1) / 2} ${yBot}
                C ${x1 - 300} ${yBot} ${x1 - 180} ${yTop + 60} ${x1} ${yTop}`;
  const cursorX = markAt !== undefined ? x0 + (x1 - x0) * markAt : null;
  return (
    <g>
      {/* vùng nhấn */}
      {highlight === 'shallow' ? (
        <rect x={x0 - 20} y={yTop - 60} width={(x1 - x0) * 0.24} height={yBot - yTop + 130} rx={16} fill="#5fc9e8" fillOpacity={0.35} />
      ) : null}
      {highlight === 'deep' ? (
        <rect x={x0 + (x1 - x0) * 0.3} y={yTop - 60} width={(x1 - x0) * 0.4} height={yBot - yTop + 130} rx={16} fill="#2a3a72" fillOpacity={0.3} />
      ) : null}
      {highlight === 'full' ? (
        <rect x={x0 - 20} y={yTop - 60} width={x1 - x0 + 40} height={yBot - yTop + 130} rx={16} fill="#22a04a" fillOpacity={0.22} />
      ) : null}

      {/* trục */}
      <line x1={x0 - 40} y1={yTop - 70} x2={x0 - 40} y2={yBot + 80} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <line x1={x0 - 40} y1={yBot + 80} x2={x1 + 40} y2={yBot + 80} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <text x={x0 - 70} y={yTop - 90} fontSize={36} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
        Nông
      </text>
      <text x={x0 - 70} y={yBot + 140} fontSize={36} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
        Sâu
      </text>

      <path d={path} fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" {...drawOn(draw)} />

      {/* mốc thời gian */}
      {[0, 0.22, 0.5, 1].map((t, i) => (
        <g key={i}>
          <line x1={x0 + (x1 - x0) * t} y1={yBot + 66} x2={x0 + (x1 - x0) * t} y2={yBot + 96} stroke={INK} strokeWidth={7} />
          <text x={x0 + (x1 - x0) * t} y={yBot + 148} fontSize={34} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
            {['0', '20p', '45p', '90p'][i]}
          </text>
        </g>
      ))}

      {cursorX !== null ? (
        <g>
          <line x1={cursorX} y1={yTop - 70} x2={cursorX} y2={yBot + 80} stroke="#e63328" strokeWidth={8} strokeDasharray="16 12" />
          <circle cx={cursorX} cy={yTop - 70} r={16} fill="#e63328" />
        </g>
      ) : null}
    </g>
  );
};

export const SleepCycleWave: React.FC<NapProps> = ({ frame }) => (
  <Frame bg="#f6efe0">
    <text x={W / 2} y={190} fontSize={58} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
      Một chu kỳ ngủ ~ 90 phút
    </text>
    <CycleGraph frame={frame} />
  </Frame>
);

// 3) Tầng nông — nổi gần mặt nước
export const NapShallow: React.FC<NapProps> = ({ frame }) => {
  const bob = wobble(frame, 0.1, 14);
  return (
    <Frame bg="#d6f2fb">
      {/* mặt nước */}
      <path
        d={`M 0 320 ${new Array(16)
          .fill(0)
          .map((_, i) => `q 60 ${i % 2 === 0 ? -22 : 22} 120 0`)
          .join(' ')} L ${W} ${H} L 0 ${H} Z`}
        fill="#5fc9e8"
        stroke={INK}
        strokeWidth={10}
        strokeLinejoin="round"
      />
      <rect x={0} y={640} width={W} height={H - 640} fill="#2f7fa8" opacity={0.55} />
      <PopLabel frame={frame} at={4} x={430} y={190} text="20 phút đầu" bg="#22a04a" size={54} />
      <PopLabel frame={frame} at={16} x={430} y={278} text="còn ở tầng nông" bg="#ffffff" color={INK} size={44} />

      {/* người nổi gần mặt nước */}
      <g transform={`translate(0 ${bob})`}>
        <NapHead cx={860} cy={470} r={84} face="asleep" />
        <g stroke={INK} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* thân nằm ngang */}
          <line x1={944} y1={500} x2={1180} y2={506} />
          {/* hai chân co nhẹ, thả lỏng trong nước */}
          <path d="M 1180 506 L 1292 468 L 1372 502" />
          <path d="M 1180 506 L 1276 556 L 1368 576" />
          {/* tay thả nổi lên trên */}
          <path d="M 1010 504 L 1084 428 L 1156 452" />
        </g>
        <Zzz x={880} y={370} frame={frame} count={2} />
      </g>

      <HighlightRing frame={frame} at={30} cx={860} cy={480} r={230} color="#22a04a" />
      <PopLabel frame={frame} at={46} x={1450} y={840} text="Gọi một tiếng là dậy" bg="#22a04a" size={42} />

      {/* bọt nổi lên dễ dàng */}
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame * 1.5 + i * 25) % 100) / 100;
        return (
          <circle key={i} cx={520 + seeded(i) * 900} cy={780 - t * 380} r={9 + seeded(i + 4) * 9} fill="#ffffff" stroke={INK} strokeWidth={4} opacity={1 - t} />
        );
      })}
    </Frame>
  );
};

// 4) Tầng sâu — chìm sát đáy
export const NapDeep: React.FC<NapProps> = ({ frame }) => {
  const sink = easeOut(progress(frame, 0, 45));
  const drift = wobble(frame, 0.05, 12);
  return (
    <Frame bg="#0d1b3e">
      <path
        d={`M 0 180 ${new Array(16)
          .fill(0)
          .map((_, i) => `q 60 ${i % 2 === 0 ? -16 : 16} 120 0`)
          .join(' ')} L ${W} 0 L 0 0 Z`}
        fill="#5fc9e8"
        stroke={INK}
        strokeWidth={10}
      />
      <rect x={0} y={180} width={W} height={340} fill="#2a5a95" opacity={0.5} />
      <rect x={0} y={520} width={W} height={560} fill="#101c44" opacity={0.55} />
      <PopLabel frame={frame} at={4} x={420} y={170} text="Sau 30 phút" bg="#e63328" size={54} />
      <PopLabel frame={frame} at={40} x={420} y={980} text="Tầng ngủ sâu" bg="#2a3a72" size={50} />
      <PointerArrow frame={frame} at={22} from={[420, 250]} to={[720, 700]} color="#e63328" curve={0.2} />

      {/* người chìm xuống */}
      <g transform={`translate(${drift} ${240 + sink * 330})`}>
        <NapHead cx={880} cy={420} r={84} face="asleep" />
        <g stroke={INK} strokeWidth={10} strokeLinecap="round">
          <line x1={964} y1={452} x2={1230} y2={470} />
          <line x1={1230} y1={470} x2={1330} y2={420} />
          <line x1={1230} y1={470} x2={1336} y2={528} />
          <line x1={796} y1={450} x2={676} y2={430} />
        </g>
      </g>

      <PopLabel frame={frame} at={54} x={1440} y={880} text="Rất khó kéo dậy" bg="#e63328" size={42} />

      {/* sóng não chậm */}
      <g transform="translate(0 0)">
        <path
          d={`M 260 760 ${new Array(6)
            .fill(0)
            .map((_, i) => `q 90 ${i % 2 === 0 ? -70 : 70} 180 0`)
            .join(' ')}`}
          fill="none"
          stroke="#5fc9e8"
          strokeWidth={11}
          strokeLinecap="round"
          opacity={0.85}
          {...drawOn(easeOut(progress(frame, 24, 30)))}
        />
      </g>
    </Frame>
  );
};

// 5) Quán tính giấc ngủ — dậy vật vờ
export const SleepInertiaZombie: React.FC<NapProps> = ({ frame }) => {
  const sway = wobble(frame, 0.06, 16);
  return (
    <Frame bg="#efe6fb">
      <text x={W / 2} y={170} fontSize={60} fontWeight={800} fill="#6d3fd4" textAnchor="middle" fontFamily={FONT}>
        Quán tính giấc ngủ
      </text>

      {/* đồng hồ chỉ 30-60 phút vật vờ */}
      <g transform="translate(1520 400)">
        <circle cx={0} cy={0} r={140} fill="#ffffff" stroke={INK} strokeWidth={11} />
        <line x1={0} y1={0} x2={0} y2={-96} stroke={INK} strokeWidth={11} strokeLinecap="round" transform={`rotate(${frame * 4})`} />
        <line x1={0} y1={0} x2={68} y2={0} stroke={INK} strokeWidth={9} strokeLinecap="round" transform={`rotate(${frame * 0.9})`} />
        <circle cx={0} cy={0} r={12} fill={INK} />
        <text x={0} y={210} fontSize={42} fontWeight={800} fill="#6d3fd4" textAnchor="middle" fontFamily={FONT}>
          30 - 60 phút
        </text>
      </g>

      {/* nhân vật vật vờ */}
      <g transform={`rotate(${sway * 0.4} 720 900)`}>
        <NapHead cx={720} cy={430} r={100} face="groggy" frame={frame} />
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={720} y1={530} x2={706} y2={770} />
          <line x1={714} y1={590} x2={560} y2={640} />
          <line x1={714} y1={590} x2={880} y2={648} />
          <line x1={706} y1={770} x2={614} y2={950} />
          <line x1={706} y1={770} x2={806} y2={950} />
        </g>
        {/* sao quay quanh đầu */}
        {[0, 1, 2].map((i) => {
          const a = frame * 0.05 + (i * Math.PI * 2) / 3;
          return (
            <circle key={i} cx={720 + Math.cos(a) * 150} cy={330 + Math.sin(a) * 44} r={13} fill="#6d3fd4" />
          );
        })}
      </g>
    </Frame>
  );
};

// 6) Khung giờ vàng
export const NapGoldenWindow: React.FC<NapProps> = ({ frame }) => {
  const grow = easeOut(progress(frame, 8, 24));
  return (
    <Frame bg="#fff6e0">
      <text x={W / 2} y={180} fontSize={58} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
        Khung giờ vàng
      </text>
      {/* trục thời gian trong ngày */}
      <line x1={200} y1={620} x2={1720} y2={620} stroke={INK} strokeWidth={11} strokeLinecap="round" />
      {[
        ['6h', 0],
        ['9h', 0.2],
        ['12h', 0.4],
        ['15h', 0.6],
        ['18h', 0.8],
        ['21h', 1],
      ].map(([lab, t], i) => (
        <g key={i}>
          <line x1={200 + 1520 * Number(t)} y1={606} x2={200 + 1520 * Number(t)} y2={648} stroke={INK} strokeWidth={7} />
          <text x={200 + 1520 * Number(t)} y={716} fontSize={38} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
            {lab}
          </text>
        </g>
      ))}
      {/* vùng vàng 13-15h */}
      <g transform={`translate(${200 + 1520 * 0.466} 0)`}>
        <rect x={0} y={430} width={190 * grow} height={190} rx={14} fill="#ffc23c" stroke={INK} strokeWidth={10} opacity={grow} />
      </g>
      <text x={200 + 1520 * 0.56} y={390} fontSize={50} fontWeight={800} fill="#e08a00" textAnchor="middle" fontFamily={FONT} opacity={grow}>
        1 - 3 giờ chiều
      </text>

      {/* đồng hồ hẹn 20 phút */}
      <g transform="translate(420 400)">
        <circle cx={0} cy={0} r={120} fill="#ffffff" stroke={INK} strokeWidth={11} />
        <path d={`M 0 0 L 0 -96 A 96 96 0 0 1 ${96 * Math.sin(2.1)} ${-96 * Math.cos(2.1)} Z`} fill="#22a04a" opacity={0.75} />
        <circle cx={0} cy={0} r={11} fill={INK} />
        <text x={0} y={190} fontSize={46} fontWeight={800} fill="#22a04a" textAnchor="middle" fontFamily={FONT}>
          20 phút
        </text>
      </g>
      {/* mặt trời chếch */}
      <g transform="translate(1560 330)">
        <circle cx={0} cy={0} r={78} fill="#ffb020" stroke={INK} strokeWidth={10} />
        <g stroke="#ffb020" strokeWidth={11} strokeLinecap="round">
          {new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + frame * 0.006;
            return <line key={i} x1={Math.cos(a) * 100} y1={Math.sin(a) * 100} x2={Math.cos(a) * 138} y2={Math.sin(a) * 138} />;
          })}
        </g>
      </g>
    </Frame>
  );
};

// 7) Thí nghiệm NASA trong buồng lái
export const NasaPilotNap: React.FC<NapProps> = ({ frame }) => {
  const bar1 = easeOut(progress(frame, 26, 22));
  const bar2 = easeOut(progress(frame, 38, 22));
  return (
    <Frame bg="#eaf1f7">
      {/* cửa sổ buồng lái */}
      <path d="M 120 210 Q 620 120 1120 210 L 1120 560 Q 620 640 120 560 Z" fill="#9fd0f5" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
      <line x1={620} y1={165} x2={620} y2={600} stroke={INK} strokeWidth={10} />
      {/* mây trôi */}
      {[0, 1, 2].map((i) => {
        const cx = ((frame * 1.1 + i * 380) % 1300) - 100;
        return (
          <g key={i} opacity={0.85}>
            <ellipse cx={200 + cx * 0.7} cy={300 + i * 90} rx={80} ry={34} fill="#ffffff" />
            <ellipse cx={250 + cx * 0.7} cy={310 + i * 90} rx={62} ry={28} fill="#ffffff" />
          </g>
        );
      })}

      {/* bảng điều khiển */}
      <rect x={120} y={600} width={1000} height={150} rx={12} fill="#4b5563" stroke={INK} strokeWidth={11} />
      <g>
        {new Array(8).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={200 + i * 118}
            cy={675}
            r={22}
            fill={seeded(i) > 0.5 ? '#22a04a' : '#ffc23c'}
            stroke={INK}
            strokeWidth={6}
            opacity={0.55 + 0.45 * Math.sin(frame * 0.1 + i)}
          />
        ))}
      </g>

      {/* ghế và phi công ngủ gục */}
      <g transform={`translate(0 ${wobble(frame, 0.05, 5)})`}>
        {/* lưng ghế */}
        <rect x={300} y={790} width={230} height={290} rx={20} fill="#6b7280" stroke={INK} strokeWidth={10} />
        {/* thân phi công ngả ra ghế */}
        <path d="M 470 900 L 452 1080 L 660 1080 L 640 900 Z" fill="#ffffff" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <NapHead cx={556} cy={840} r={78} face="asleep" />
        {/* mũ phi công */}
        <path d="M 478 812 q 78 -74 156 0 Z" fill="#2a3a72" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        <Zzz x={650} y={770} frame={frame} count={2} />
      </g>

      {/* biểu đồ kết quả */}
      <g transform="translate(1280 250)">
        <text x={220} y={0} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          Sau 26 phút
        </text>
        <line x1={40} y1={620} x2={440} y2={620} stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <rect x={90} y={620 - 300 * bar1} width={130} height={300 * bar1} fill="#3a8fd6" stroke={INK} strokeWidth={9} />
        <rect x={270} y={620 - 460 * bar2} width={130} height={460 * bar2} fill="#e63328" stroke={INK} strokeWidth={9} />
        {bar1 > 0.95 ? (
          <text x={155} y={600 - 300} fontSize={42} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            +34%
          </text>
        ) : null}
        {bar2 > 0.95 ? (
          <text x={335} y={600 - 460} fontSize={42} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            +54%
          </text>
        ) : null}
        <text x={155} y={678} fontSize={32} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
          hiệu suất
        </text>
        <text x={335} y={678} fontSize={32} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
          tỉnh táo
        </text>
      </g>
    </Frame>
  );
};

// 8) Ngủ trọn chu kỳ 90 phút
export const NapFullCycle: React.FC<NapProps> = ({ frame }) => (
  <Frame bg="#eafbef">
    <text x={W / 2} y={180} fontSize={56} fontWeight={800} fill="#1c7a3a" textAnchor="middle" fontFamily={FONT}>
      Ngủ trọn 90 phút
    </text>
    <CycleGraph frame={frame} markAt={1} highlight="full" />
    <PulseRing frame={frame} at={34} cx={960} cy={760} r={260} color="#e63328" />
    <g opacity={easeOut(progress(frame, 30, 20))}>
      <rect x={700} y={880} width={520} height={96} rx={16} fill="#e63328" stroke={INK} strokeWidth={10} />
      <text x={960} y={946} fontSize={44} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
        Tránh: 30 - 60 phút
      </text>
    </g>
  </Frame>
);

// 9) Ngủ trưa muộn hại giấc đêm
export const NapTooLate: React.FC<NapProps> = ({ frame }) => {
  const cross = easeOut(progress(frame, 16, 20));
  return (
    <Frame bg="#1b2450">
      {/* nửa trái: ngủ muộn lúc 5h chiều */}
      <rect x={0} y={0} width={960} height={H} fill="#f7c98b" />
      <g>
        <circle cx={300} cy={250} r={80} fill="#ff8c42" stroke={INK} strokeWidth={10} />
        <text x={300} y={410} fontSize={52} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          5 giờ chiều
        </text>
        <rect x={180} y={700} width={620} height={34} rx={12} fill="#b98a4e" stroke={INK} strokeWidth={10} />
        <NapHead cx={330} cy={640} r={74} face="asleep" />
        <path d="M 410 700 Q 560 630 740 700 Z" fill="#5a6fb5" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <Zzz x={380} y={560} frame={frame} count={2} />
        {/* dấu X đỏ */}
        <g stroke="#e63328" strokeWidth={22} strokeLinecap="round" fill="none">
          <line x1={130} y1={520} x2={830} y2={880} {...drawOn(cross)} />
          <line x1={830} y1={520} x2={130} y2={880} {...drawOn(Math.max(0, cross - 0.35) / 0.65)} />
        </g>
      </g>

      {/* nửa phải: đêm nằm thao láo */}
      <g>
        <g transform="translate(1650 230)">
          <circle cx={0} cy={0} r={72} fill="#ffe9a8" />
          <circle cx={30} cy={-18} r={62} fill="#1b2450" />
        </g>
        {new Array(10).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={1010 + seeded(i) * 880}
            cy={90 + seeded(i + 20) * 400}
            r={5 + seeded(i + 40) * 5}
            fill="#ffffff"
            opacity={0.5 + 0.5 * Math.sin(frame * 0.1 + i * 2)}
          />
        ))}
        <text x={1440} y={560} fontSize={52} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
          2 giờ sáng
        </text>
        <rect x={1120} y={800} width={620} height={34} rx={12} fill="#8a6b4a" stroke={INK} strokeWidth={10} />
        <NapHead cx={1270} cy={740} r={74} face="alarmed" />
        <path d="M 1350 800 Q 1500 730 1680 800 Z" fill="#4a63b8" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      </g>
    </Frame>
  );
};

// 10) Cà phê rồi mới nằm
export const CoffeeNap: React.FC<NapProps> = ({ frame }) => {
  const step = (i: number) => easeOut(progress(frame, 6 + i * 16, 18));
  return (
    <Frame bg="#f6efe0">
      <text x={W / 2} y={170} fontSize={58} fontWeight={800} fill="#7a4a1e" textAnchor="middle" fontFamily={FONT}>
        Cà phê rồi mới nằm
      </text>

      {/* bước 1: uống cà phê */}
      <g opacity={step(0)} transform="translate(340 560)">
        <path d="M -80 -70 L -62 90 L 62 90 L 80 -70 Z" fill="#ffffff" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
        <path d="M 80 -40 q 62 20 0 58" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
        <path d="M -74 -22 L -58 82 L 58 82 L 74 -22 Z" fill="#8a5a2b" />
        {[0, 1, 2].map((i) => {
          const t = ((frame * 1.6 + i * 33) % 100) / 100;
          return (
            <path
              key={i}
              d={`M ${-30 + i * 30} ${-90 - t * 70} q 16 -22 0 -40`}
              fill="none"
              stroke="#b08968"
              strokeWidth={7}
              strokeLinecap="round"
              opacity={1 - t}
            />
          );
        })}
        <text x={0} y={180} fontSize={42} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          1. Uống
        </text>
      </g>

      <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none" opacity={step(1)}>
        <line x1={500} y1={560} x2={700} y2={560} />
        <path d="M 700 560 l -46 -30 M 700 560 l -46 30" />
      </g>

      {/* bước 2: ngủ 20 phút */}
      <g opacity={step(1)} transform="translate(960 560)">
        <NapHead cx={0} cy={-40} r={82} face="asleep" />
        <rect x={-160} y={50} width={320} height={28} rx={10} fill="#b98a4e" stroke={INK} strokeWidth={9} />
        <Zzz x={70} y={-110} frame={frame} count={2} />
        <text x={0} y={180} fontSize={42} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          2. Ngủ 20 phút
        </text>
      </g>

      <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none" opacity={step(2)}>
        <line x1={1220} y1={560} x2={1420} y2={560} />
        <path d="M 1420 560 l -46 -30 M 1420 560 l -46 30" />
      </g>

      {/* bước 3: tỉnh gấp đôi */}
      <g opacity={step(2)} transform="translate(1650 560)">
        <NapHead cx={0} cy={-40} r={82} face="fresh" />
        <g stroke="#22a04a" strokeWidth={10} strokeLinecap="round">
          {[-1, 0, 1].map((k) => (
            <line key={k} x1={k * 84} y1={-140 - Math.abs(k) * 10} x2={k * 124} y2={-196 - Math.abs(k) * 16} />
          ))}
        </g>
        <text x={0} y={180} fontSize={42} fontWeight={800} fill="#22a04a" textAnchor="middle" fontFamily={FONT}>
          3. Tỉnh gấp đôi
        </text>
      </g>

      <text x={W / 2} y={880} fontSize={40} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT} opacity={step(2)}>
        Cà phê mất 20 - 30 phút mới ngấm — vừa kịp lúc bạn mở mắt
      </text>
    </Frame>
  );
};
