import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { CrossOut, HighlightRing, PointerArrow, PopLabel, PulseRing } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type MemProps = { frame: number; accent: string };

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

// Đầu nhân vật dùng chung cho bộ hình này
const Head: React.FC<{
  cx: number;
  cy: number;
  r?: number;
  eyes?: 'open' | 'closed' | 'wide';
  mouth?: 'flat' | 'smile' | 'o';
  tuft?: boolean;
}> = ({ cx, cy, r = 78, eyes = 'open', mouth = 'flat', tuft = false }) => {
  const ey = cy - r * 0.1;
  const dx = r * 0.34;
  return (
    <g>
      {tuft ? (
        <path d={`M ${cx - 10} ${cy - r} q 16 -40 40 -18`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={INK} strokeWidth={9} />
      {eyes === 'closed' ? (
        <path
          d={`M ${cx - dx - r * 0.2} ${ey} q ${r * 0.2} ${r * 0.22} ${r * 0.4} 0
              M ${cx + dx - r * 0.2} ${ey} q ${r * 0.2} ${r * 0.22} ${r * 0.4} 0`}
          fill="none"
          stroke={INK}
          strokeWidth={7}
          strokeLinecap="round"
        />
      ) : (
        <>
          <ellipse cx={cx - dx} cy={ey} rx={r * 0.17} ry={r * (eyes === 'wide' ? 0.26 : 0.2)} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <ellipse cx={cx + dx} cy={ey} rx={r * 0.17} ry={r * (eyes === 'wide' ? 0.26 : 0.2)} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <circle cx={cx - dx} cy={ey} r={r * 0.1} fill={INK} />
          <circle cx={cx + dx} cy={ey} r={r * 0.1} fill={INK} />
        </>
      )}
      {mouth === 'smile' ? (
        <path d={`M ${cx - r * 0.26} ${cy + r * 0.36} q ${r * 0.26} ${r * 0.3} ${r * 0.52} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      ) : mouth === 'o' ? (
        <ellipse cx={cx} cy={cy + r * 0.45} rx={r * 0.14} ry={r * 0.17} fill={INK} />
      ) : (
        <line x1={cx - r * 0.24} y1={cy + r * 0.45} x2={cx + r * 0.24} y2={cy + r * 0.45} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      )}
    </g>
  );
};

// Khung ảnh ký ức nhỏ, dùng nhiều nơi
const MemoryCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  opacity?: number;
  icon?: 'face' | 'ball' | 'house' | 'none';
}> = ({ x, y, w = 110, h = 92, fill = '#8ec7e8', opacity = 1, icon = 'none' }) => (
  <g opacity={opacity}>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={INK} strokeWidth={7} />
    {icon === 'face' ? (
      <g stroke={INK} strokeWidth={5} fill="none">
        <circle cx={x + w / 2} cy={y + h / 2 - 6} r={20} />
        <circle cx={x + w / 2 - 7} cy={y + h / 2 - 11} r={2.5} fill={INK} />
        <circle cx={x + w / 2 + 7} cy={y + h / 2 - 11} r={2.5} fill={INK} />
        <path d={`M ${x + w / 2 - 9} ${y + h / 2 + 1} q 9 8 18 0`} />
      </g>
    ) : null}
    {icon === 'ball' ? <circle cx={x + w / 2} cy={y + h / 2} r={24} fill="#e63328" stroke={INK} strokeWidth={5} /> : null}
    {icon === 'house' ? (
      <g stroke={INK} strokeWidth={5} fill="#ffd88a">
        <rect x={x + w / 2 - 22} y={y + h / 2 - 4} width={44} height={34} />
        <path d={`M ${x + w / 2 - 32} ${y + h / 2 - 4} L ${x + w / 2} ${y + h / 2 - 30} L ${x + w / 2 + 32} ${y + h / 2 - 4} Z`} />
      </g>
    ) : null}
  </g>
);

// 1) Mời người xem tự lục ký ức sớm nhất
export const FirstMemoryQuestion: React.FC<MemProps> = ({ frame }) => {
  const bob = wobble(frame, 0.11, 12);
  const grow = easeOut(progress(frame, 4, 20));
  return (
    <Frame bg="#fdf3e0">
      <g transform={`translate(680 620)`}>
        <Head cx={0} cy={0} r={92} eyes="closed" />
        <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
          <line x1={0} y1={92} x2={0} y2={250} />
          <path d="M 0 140 L 110 190 L 70 100" />
          <path d="M 0 250 L -110 350 M 0 250 L 110 350" />
        </g>
      </g>
      {/* bong bóng suy nghĩ rỗng */}
      <g transform={`translate(1180 ${330 + bob}) scale(${0.6 + grow * 0.4})`} opacity={grow}>
        <ellipse cx={0} cy={0} rx={280} ry={200} fill="#ffffff" stroke={INK} strokeWidth={12} />
        <circle cx={-230} cy={175} r={38} fill="#ffffff" stroke={INK} strokeWidth={10} />
        <circle cx={-292} cy={240} r={22} fill="#ffffff" stroke={INK} strokeWidth={9} />
        <text x={0} y={62} fontSize={200} fontWeight={800} fill="#f5a623" textAnchor="middle" fontFamily={FONT}>
          ?
        </text>
      </g>
      <PopLabel frame={frame} at={30} x={620} y={200} text="Ký ức sớm nhất của bạn?" bg="#f5a623" color={INK} size={54} />
    </Frame>
  );
};

// 2) Ảnh cũ và lời kể được cấy vào đầu đứa trẻ
export const PhotoStoryImplant: React.FC<MemProps> = ({ frame }) => {
  const fly = easeOut(progress(frame, 14, 34));
  const flash = progress(frame, 46, 10);
  const px = -560 + fly * 560;
  const py = 60 + fly * 240;
  const qx = 520 - fly * 520;
  const qy = -40 + fly * 340;
  return (
    <Frame bg="#eef6fb">
      {/* album ảnh bên trái */}
      <g transform="translate(330 420)">
        <rect x={-230} y={-170} width={460} height={340} rx={12} fill="#ffffff" stroke={INK} strokeWidth={11} />
        <line x1={0} y1={-170} x2={0} y2={170} stroke={INK} strokeWidth={9} />
        <MemoryCard x={-190} y={-130} w={160} h={120} fill="#8ec7e8" icon="face" />
        <MemoryCard x={30} y={-130} w={160} h={120} fill="#b8d9ee" icon="house" />
        <MemoryCard x={-190} y={20} w={160} h={120} fill="#b8d9ee" icon="ball" />
        <MemoryCard x={30} y={20} w={160} h={120} fill="#8ec7e8" />
      </g>

      {/* người lớn kể chuyện bên phải */}
      <g transform="translate(1620 400)">
        <Head cx={0} cy={0} r={80} mouth="o" />
        <path d="M -12 -80 q 40 -46 78 -6" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
          <line x1={0} y1={80} x2={0} y2={230} />
          <path d="M 0 130 L -100 190" />
        </g>
        <g transform="translate(-230 -60)">
          <ellipse cx={0} cy={0} rx={130} ry={84} fill="#ffffff" stroke={INK} strokeWidth={10} />
          <path d="M 100 44 L 158 74 L 96 78 Z" fill="#ffffff" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <g stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.6}>
            <line x1={-70} y1={-22} x2={70} y2={-22} />
            <line x1={-70} y1={8} x2={40} y2={8} />
          </g>
        </g>
      </g>

      {/* đứa trẻ ở giữa dưới, trong đầu có khung ảnh trống */}
      <g transform="translate(950 700)">
        <circle cx={0} cy={0} r={120} fill="#ffffff" stroke={INK} strokeWidth={11} />
        <rect x={-70} y={-58} width={140} height={112} rx={8} fill="#f2f2f2" stroke={INK} strokeWidth={8} strokeDasharray="14 10" />
        {flash > 0 ? <rect x={-70} y={-58} width={140} height={112} rx={8} fill="#ffd23f" opacity={1 - flash} /> : null}
        <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
          <line x1={0} y1={120} x2={0} y2={250} />
          <path d="M 0 170 L -90 220 M 0 170 L 90 220" />
        </g>
      </g>

      {/* hai tấm ảnh bay vào đầu bé */}
      <g transform={`translate(${950 + px} ${560 + py}) rotate(${-18 + fly * 18})`} opacity={fly > 0 ? 1 : 0}>
        <MemoryCard x={-55} y={-46} fill="#8ec7e8" icon="face" />
      </g>
      <g transform={`translate(${950 + qx} ${480 + qy}) rotate(${22 - fly * 22})`} opacity={fly > 0 ? 1 : 0}>
        <MemoryCard x={-55} y={-46} fill="#b8d9ee" icon="ball" />
      </g>

      <PopLabel frame={frame} at={52} x={420} y={880} text="Ký ức được cấy vào" bg="#e63328" size={52} />
      <PulseRing frame={frame} at={46} cx={950} cy={700} r={220} color="#e63328" />
    </Frame>
  );
};

// 3) Dòng thời gian ký ức bị sương phủ
export const MemoryTimelineFade: React.FC<MemProps> = ({ frame }) => {
  const creep = easeOut(progress(frame, 20, 50));
  const axisY = 620;
  const x0 = 200;
  const x1 = 1760;
  const marks = [
    ['0', 0],
    ['3', 0.24],
    ['7', 0.52],
    ['lớn', 1],
  ] as const;
  // sương chỉ trườn nhẹ quá mốc 3 tuổi, không được nuốt cả khung
  const fogRight = x0 + (x1 - x0) * (0.24 + creep * 0.05);
  return (
    <Frame bg="#eef2f6">
      {/* dải sương vẽ trước, nằm dưới trục */}
      <rect x={x0 - 40} y={axisY - 300} width={fogRight - x0 + 40} height={420} rx={12} fill="#dbe3ec" />
      <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      {marks.map(([lab, t], i) => (
        <g key={i}>
          <line x1={x0 + (x1 - x0) * t} y1={axisY - 20} x2={x0 + (x1 - x0) * t} y2={axisY + 20} stroke={INK} strokeWidth={9} />
          <text x={x0 + (x1 - x0) * t} y={axisY + 82} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            {lab}
          </text>
        </g>
      ))}
      {/* khung ký ức: càng về sau càng rõ */}
      {new Array(11).fill(0).map((_, i) => {
        const t = 0.06 + i * 0.09;
        const cx = x0 + (x1 - x0) * t;
        const clear = t < 0.24 ? 0 : t < 0.52 ? 0.45 : 1;
        const covered = cx < fogRight;
        const fall = covered ? easeOut(progress(frame, 20 + i * 3, 24)) : 0;
        if (clear === 0) return null;
        return (
          <g key={i} transform={`translate(0 ${fall * 220})`} opacity={(1 - fall) * clear}>
            <MemoryCard
              x={cx - 55}
              y={axisY - 190}
              fill={clear === 1 ? '#8ec7e8' : '#cfe3f0'}
              icon={(['face', 'ball', 'house', 'none'] as const)[i % 4]}
            />
          </g>
        );
      })}
      <PopLabel frame={frame} at={6} x={480} y={300} text="0 - 3 tuổi: trắng xoá" bg="#8a97a8" size={48} />
      <PopLabel frame={frame} at={26} x={1120} y={300} text="3 - 7 tuổi: lỗ chỗ" bg="#5f7d99" size={48} />
      <PopLabel frame={frame} at={46} x={1620} y={300} text="về sau: rõ nét" bg="#22a04a" size={48} />
    </Frame>
  );
};

// 4) Em bé học đủ thứ, kết nối thần kinh bùng nổ
export const BabyLearningMontage: React.FC<MemProps> = ({ frame }) => {
  const step = (i: number) => easeOut(progress(frame, 6 + i * 14, 16));
  return (
    <Frame bg="#eafbef">
      {/* 3 ô: tập đi, tập nói, nhận mặt mẹ */}
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={0.25 + step(i) * 0.75}>
          <rect x={110 + i * 570} y={230} width={520} height={430} rx={18} fill="#ffffff" stroke={INK} strokeWidth={11} />
        </g>
      ))}
      {/* ô 1: tập đi */}
      <g opacity={step(0)}>
        <Head cx={370} cy={380} r={62} mouth="smile" tuft />
        <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none">
          <line x1={370} y1={442} x2={370} y2={540} />
          <path d="M 370 470 L 300 520 M 370 470 L 440 520" />
          <path d="M 370 540 L 320 620 M 370 540 L 425 620" />
        </g>
        <text x={370} y={700} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          học đi
        </text>
      </g>
      {/* ô 2: tập nói */}
      <g opacity={step(1)}>
        <Head cx={940} cy={390} r={62} mouth="o" tuft />
        <g transform="translate(1090 330)">
          <ellipse cx={0} cy={0} rx={92} ry={62} fill="#ffd88a" stroke={INK} strokeWidth={9} />
          <path d="M -70 44 L -100 84 L -44 62 Z" fill="#ffd88a" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <text x={0} y={18} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            mẹ
          </text>
        </g>
        <text x={940} y={700} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          học nói
        </text>
      </g>
      {/* ô 3: nhận mặt mẹ */}
      <g opacity={step(2)}>
        <Head cx={1440} cy={410} r={58} mouth="smile" tuft />
        <Head cx={1640} cy={390} r={72} mouth="smile" />
        <PointerArrow frame={frame} at={44} from={[1500, 350]} to={[1585, 350]} color="#22a04a" width={10} curve={-0.5} />
        <text x={1540} y={700} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          nhận ra mặt mẹ
        </text>
      </g>

      {/* kết nối thần kinh bật ra liên tục */}
      {new Array(14).fill(0).map((_, i) => {
        const t = ((frame * 1.4 + i * 40) % 100) / 100;
        const bx = 200 + seeded(i) * 1520;
        return (
          <circle key={i} cx={bx} cy={880 - t * 90} r={6 + seeded(i + 7) * 8} fill="#22a04a" opacity={(1 - t) * 0.8} />
        );
      })}
      <PopLabel frame={frame} at={52} x={960} y={900} text="1 triệu kết nối mới / giây" bg="#22a04a" size={56} />
    </Frame>
  );
};

// 5) Freud và cái tên ông đặt
export const FreudNotebookCouch: React.FC<MemProps> = ({ frame }) => {
  const nod = wobble(frame, 0.12, 6);
  const wrong = easeOut(progress(frame, 50, 18));
  return (
    <Frame bg="#f6efe0">
      {/* Freud */}
      <g transform={`translate(0 ${nod})`}>
        <Head cx={400} cy={380} r={92} />
        {/* râu quai nón */}
        <path d="M 312 400 q 88 150 176 0 q -20 78 -88 84 q -68 -6 -88 -84 Z" fill={INK} />
        {/* kính tròn */}
        <g fill="none" stroke={INK} strokeWidth={8}>
          <circle cx={368} cy={370} r={30} />
          <circle cx={432} cy={370} r={30} />
          <line x1={398} y1={370} x2={402} y2={370} />
        </g>
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={400} y1={500} x2={400} y2={760} />
          <path d="M 400 560 L 270 640 M 400 560 L 530 630" />
          <path d="M 400 760 L 320 930 M 400 760 L 480 930" />
        </g>
        {/* sổ tay */}
        <g transform="translate(250 690)">
          <rect x={-70} y={-56} width={140} height={170} rx={8} fill="#f0e4c4" stroke={INK} strokeWidth={9} />
          <g stroke={INK} strokeWidth={5} opacity={0.6}>
            {new Array(5).fill(0).map((_, i) => (
              <line key={i} x1={-46} y1={-24 + i * 32} x2={46} y2={-24 + i * 32} />
            ))}
          </g>
        </g>
      </g>

      {/* đi văng */}
      <g transform="translate(1380 720)">
        <rect x={-330} y={-40} width={660} height={110} rx={20} fill="#a04a3c" stroke={INK} strokeWidth={11} />
        <path d="M -330 -40 q -40 -110 -60 -6 L -390 70 L -330 70 Z" fill="#a04a3c" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
        <Head cx={-250} cy={-100} r={62} eyes="closed" />
        <path d="M -188 -60 L 240 -46" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      </g>

      {/* tên gọi */}
      <g transform="translate(960 190)">
        <rect x={-390} y={-62} width={780} height={124} rx={16} fill="#ffffff" stroke={INK} strokeWidth={11} />
        <text x={0} y={20} fontSize={58} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          chứng quên thời thơ ấu
        </text>
      </g>
      {wrong > 0 ? <CrossOut frame={frame} at={50} x={960} y={190} size={300} /> : null}
      <PopLabel frame={frame} at={62} x={960} y={370} text="Freud đoán sai lý do" bg="#e63328" size={48} />
    </Frame>
  );
};

// 6) Não còn là công trường
export const HippocampusUnderScaffold: React.FC<MemProps> = ({ frame }) => {
  const build = easeOut(progress(frame, 6, 40));
  const blink = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.14));
  return (
    <Frame bg="#fdf0e2">
      {/* đầu nhìn nghiêng */}
      <g transform="translate(880 540)">
        <path
          d="M -300 60 C -300 -230 -60 -330 130 -280 C 330 -230 380 -20 320 130 C 280 240 60 300 -60 280 L -70 360 L -230 340 C -290 300 -300 180 -300 60 Z"
          fill="#ffd9c9"
          stroke={INK}
          strokeWidth={12}
          strokeLinejoin="round"
        />
        {/* nếp não */}
        <g stroke={INK} strokeWidth={7} fill="none" opacity={0.5}>
          <path d="M -200 -80 q 70 -60 140 0 q 70 60 140 0" />
          <path d="M -190 30 q 70 -60 140 0 q 70 60 140 0" />
        </g>
        {/* hồi hải mã hình cá ngựa */}
        <path
          d="M 40 120 q -70 -30 -60 -110 q 8 -60 70 -50 q 46 8 40 60 q -6 40 -40 34"
          fill="#a78bfa"
          stroke={INK}
          strokeWidth={10}
          strokeLinejoin="round"
        />
        {/* vỏ não trước trán */}
        <ellipse cx={-190} cy={-120} rx={80} ry={62} fill="#8fd694" stroke={INK} strokeWidth={10} />
        {/* dây nối chập chờn */}
        <line x1={-120} y1={-100} x2={10} y2={20} stroke="#22a04a" strokeWidth={10} strokeDasharray="20 18" opacity={blink} strokeLinecap="round" />
      </g>

      {/* giàn giáo lắp dần */}
      <g stroke="#f5a623" strokeWidth={11} strokeLinecap="round" fill="none">
        {new Array(6).fill(0).map((_, i) => {
          const p = easeOut(progress(frame, 8 + i * 6, 14));
          if (p <= 0) return null;
          return (
            <g key={i} opacity={p}>
              <line x1={820 + i * 46} y1={480} x2={820 + i * 46} y2={760} />
            </g>
          );
        })}
        <line x1={800} y1={500} x2={1060} y2={500} opacity={build} />
        <line x1={800} y1={620} x2={1060} y2={620} opacity={build} />
        <line x1={800} y1={740} x2={1060} y2={740} opacity={build} />
      </g>

      {/* biển đang thi công */}
      <g transform="translate(1420 300)" opacity={easeOut(progress(frame, 26, 16))}>
        <rect x={-180} y={-58} width={360} height={116} rx={12} fill="#ffd23f" stroke={INK} strokeWidth={11} />
        <text x={0} y={18} fontSize={48} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          đang thi công
        </text>
      </g>
      <PointerArrow frame={frame} at={40} from={[1300, 380]} to={[980, 620]} color="#e63328" curve={0.2} />
      <PopLabel frame={frame} at={52} x={520} y={880} text="Hồi hải mã: xong lúc 4-5 tuổi" bg="#8b5cf6" size={46} />
    </Frame>
  );
};

// 7) Neuron mới ghi đè lên ký ức cũ
export const NeuronOverwriteScribble: React.FC<MemProps> = ({ frame }) => (
  <Frame bg="#243027">
    <rect x={90} y={110} width={1740} height={860} rx={16} fill="#2f3d33" stroke="#8a6b4a" strokeWidth={22} />
    {/* hình phấn cũ */}
    {[
      [400, 380],
      [900, 330],
      [1400, 400],
      [700, 700],
      [1250, 720],
    ].map(([cx, cy], i) => {
      const fade = 1 - easeOut(progress(frame, 20 + i * 8, 34));
      return (
        <g key={i} opacity={0.35 + fade * 0.65} stroke="#ffffff" strokeWidth={8} fill="none">
          {i % 3 === 0 ? (
            <>
              <circle cx={cx} cy={cy} r={62} />
              <circle cx={cx - 22} cy={cy - 14} r={5} fill="#ffffff" />
              <circle cx={cx + 22} cy={cy - 14} r={5} fill="#ffffff" />
              <path d={`M ${cx - 26} ${cy + 20} q 26 26 52 0`} />
            </>
          ) : i % 3 === 1 ? (
            <circle cx={cx} cy={cy} r={56} />
          ) : (
            <>
              <rect x={cx - 50} y={cy - 20} width={100} height={76} />
              <path d={`M ${cx - 68} ${cy - 20} L ${cx} ${cy - 78} L ${cx + 68} ${cy - 20}`} />
            </>
          )}
        </g>
      );
    })}
    {/* neuron mới nảy lên, kéo vệt vàng đè lên */}
    {new Array(9).fill(0).map((_, i) => {
      const t = ((frame * 1.5 + i * 30) % 100) / 100;
      const nx = 220 + seeded(i) * 1480;
      const ny = 980 - t * 720;
      return (
        <g key={i} opacity={Math.sin(t * Math.PI)}>
          <g stroke="#ffd23f" strokeWidth={7} strokeLinecap="round">
            {new Array(6).fill(0).map((_, k) => {
              const a = (k / 6) * Math.PI * 2;
              return <line key={k} x1={nx} y1={ny} x2={nx + Math.cos(a) * 34} y2={ny + Math.sin(a) * 34} />;
            })}
          </g>
          <circle cx={nx} cy={ny} r={15} fill="#ffd23f" />
          <path
            d={`M ${nx - 90} ${ny + 60} q 60 -30 120 10 q 60 40 120 -10`}
            fill="none"
            stroke="#ffd23f"
            strokeWidth={9}
            opacity={0.75}
            strokeLinecap="round"
          />
        </g>
      );
    })}
    <PopLabel frame={frame} at={10} x={520} y={210} text="Neuron mới chen vào" bg="#ffd23f" color={INK} size={50} />
    <PopLabel frame={frame} at={40} x={1420} y={900} text="Ký ức cũ bị ghi đè" bg="#e63328" size={50} />
  </Frame>
);

// 8) Thí nghiệm trên chuột — kèm cảnh báo chưa phải người
export const LabMouseHypothesis: React.FC<MemProps> = ({ frame }) => {
  const run = wobble(frame, 0.5, 8);
  const warn = easeOut(progress(frame, 46, 18));
  return (
    <Frame bg="#fbf7ee">
      {/* chuột trong hộp */}
      <g transform="translate(430 560)">
        <rect x={-260} y={-190} width={520} height={400} rx={14} fill="#e8e8e8" stroke={INK} strokeWidth={12} />
        <g transform={`translate(${run} 0)`}>
          <ellipse cx={0} cy={70} rx={110} ry={72} fill="#ffffff" stroke={INK} strokeWidth={10} />
          <circle cx={95} cy={30} r={54} fill="#ffffff" stroke={INK} strokeWidth={10} />
          <circle cx={72} cy={-14} r={26} fill="#ffd9e0" stroke={INK} strokeWidth={8} />
          <circle cx={118} cy={18} r={7} fill={INK} />
          <path d="M -105 55 q -80 -20 -70 -80" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <g stroke={INK} strokeWidth={6} strokeLinecap="round">
            <line x1={140} y1={38} x2={200} y2={26} />
            <line x1={140} y1={46} x2={198} y2={58} />
          </g>
        </g>
      </g>

      {/* hai kết cục */}
      <g transform="translate(1290 350)">
        <rect x={-360} y={-90} width={720} height={180} rx={16} fill="#ddf3e2" stroke={INK} strokeWidth={11} />
        <text x={-190} y={16} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          ít neuron mới
        </text>
        <MemoryCard x={110} y={-52} w={140} h={104} fill="#8ec7e8" icon="face" />
        <text x={300} y={16} fontSize={40} fontWeight={800} fill="#22a04a" textAnchor="middle" fontFamily={FONT}>
          nhớ dai
        </text>
      </g>
      <g transform="translate(1290 640)">
        <rect x={-360} y={-90} width={720} height={180} rx={16} fill="#fbe0dd" stroke={INK} strokeWidth={11} />
        <text x={-190} y={16} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          nhiều neuron mới
        </text>
        {new Array(7).fill(0).map((_, i) => {
          const t = ((frame * 1.6 + i * 14) % 100) / 100;
          return <circle key={i} cx={150 + i * 22 + t * 40} cy={-10 + seeded(i) * 40} r={9} fill="#8ec7e8" opacity={1 - t} />;
        })}
        <text x={300} y={16} fontSize={40} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          quên nhanh
        </text>
      </g>

      {/* cảnh báo: mới trên chuột */}
      <g opacity={warn}>
        <PopLabel frame={frame} at={46} x={960} y={950} text="Mới thử trên chuột, chưa phải người" bg="#e63328" size={50} />
        <HighlightRing frame={frame} at={52} cx={430} cy={560} r={300} color="#e63328" />
      </g>
    </Frame>
  );
};

// 9) Ký ức không lời thì kẹt lại
export const BabyWordlessBubble: React.FC<MemProps> = ({ frame }) => {
  const crank = frame * 3;
  const drop = ((frame * 1.4) % 100) / 100;
  return (
    <Frame bg="#fdf6e4">
      {/* cỗ máy thu nhỏ */}
      <g transform="translate(430 520)">
        <rect x={-190} y={-180} width={380} height={360} rx={16} fill="#3aa8a0" stroke={INK} strokeWidth={12} />
        <rect x={-90} y={-230} width={180} height={54} rx={10} fill="#2e8a83" stroke={INK} strokeWidth={10} />
        <rect x={-70} y={180} width={140} height={46} rx={10} fill="#2e8a83" stroke={INK} strokeWidth={10} />
        <g transform={`translate(200 -20) rotate(${crank})`}>
          <circle cx={0} cy={0} r={16} fill={INK} />
          <line x1={0} y1={0} x2={64} y2={0} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <circle cx={64} cy={0} r={20} fill="#ffd23f" stroke={INK} strokeWidth={9} />
        </g>
        {/* đồ chơi to đi vào */}
        <circle cx={0} cy={-270 + drop * 60} r={44} fill="#e63328" stroke={INK} strokeWidth={9} />
        {/* bản tí hon rơi ra */}
        <circle cx={0} cy={240 + drop * 90} r={16} fill="#e63328" stroke={INK} strokeWidth={7} opacity={1 - drop} />
      </g>
      <Head cx={860} cy={620} r={72} mouth="smile" tuft />

      {/* bong bóng thoại rỗng, chữ bật ra ngoài */}
      <g transform="translate(1420 480)">
        <ellipse cx={0} cy={0} rx={280} ry={190} fill="#ffffff" stroke={INK} strokeWidth={12} />
        <path d="M -190 140 L -290 250 L -140 200 Z" fill="#ffffff" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
      </g>
      {['A', 'B', 'C', 'D', 'E'].map((ch, i) => {
        const t = ((frame * 1.7 + i * 20) % 100) / 100;
        const bx = 1180 + i * 120;
        const by = 120 + t * 200;
        const bounced = by > 300;
        return (
          <text
            key={ch}
            x={bx + (bounced ? (i - 2) * 40 * (t - 0.6) * 4 : 0)}
            y={bounced ? 300 + (t - 0.6) * 500 : by}
            fontSize={62}
            fontWeight={800}
            fill="#f5a623"
            textAnchor="middle"
            fontFamily={FONT}
            opacity={1 - Math.max(0, t - 0.75) * 4}
          >
            {ch}
          </text>
        );
      })}
      <PopLabel frame={frame} at={30} x={1420} y={790} text="Chữ không lọt vào được" bg="#3a8fd6" size={50} />
      <PopLabel frame={frame} at={8} x={430} y={840} text="Trải nghiệm lúc 2-3 tuổi" bg="#3aa8a0" size={46} />
    </Frame>
  );
};

// 10) Bài kiểm tra gương với chấm đỏ
export const MirrorRedDot: React.FC<MemProps> = ({ frame }) => {
  const reach = easeOut(progress(frame, 16, 26));
  const dotBlink = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.16));
  return (
    <Frame bg="#fdeef3">
      {/* gương */}
      <g transform="translate(1330 520)">
        <rect x={-280} y={-360} width={560} height={760} rx={24} fill="#8a5a2b" stroke={INK} strokeWidth={14} />
        <rect x={-230} y={-310} width={460} height={660} rx={14} fill="#e8f4fb" stroke={INK} strokeWidth={10} />
        {/* ảnh phản chiếu */}
        <Head cx={0} cy={-90} r={92} mouth="smile" tuft />
        <circle cx={0} cy={-52} r={17} fill="#e63328" opacity={dotBlink} />
        <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
          <line x1={0} y1={2} x2={0} y2={190} />
          <path d="M 0 60 L -90 130 M 0 60 L 90 130" />
          <path d="M 0 190 L -70 320 M 0 190 L 70 320" />
        </g>
      </g>

      {/* em bé thật, tay đưa lên chạm mũi mình */}
      <g transform="translate(560 560)">
        <Head cx={0} cy={-60} r={96} mouth="o" tuft />
        <circle cx={0} cy={-20} r={18} fill="#e63328" opacity={dotBlink} />
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={0} y1={36} x2={0} y2={230} />
          <path d={`M 0 100 L ${130 - reach * 130} ${170 - reach * 190} L ${60 - reach * 60} ${40 - reach * 60}`} />
          <path d="M 0 100 L -110 180" />
          <path d="M 0 230 L -80 370 M 0 230 L 80 370" />
        </g>
      </g>

      <g opacity={easeOut(progress(frame, 44, 16))}>
        <PulseRing frame={frame} at={44} cx={560} cy={540} r={200} color="#f5a623" />
      </g>
      <PopLabel frame={frame} at={48} x={560} y={200} text="&quot;Đó là TÔI!&quot;" bg="#f5a623" color={INK} size={62} />
      <PopLabel frame={frame} at={8} x={560} y={950} text="18 - 24 tháng tuổi" bg="#e63328" size={48} />
    </Frame>
  );
};

// 11) Ảnh ghép khinh khí cầu
export const FakeBalloonPhoto: React.FC<MemProps> = ({ frame }) => {
  const rise = wobble(frame, 0.07, 18);
  const cutBlink = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.18));
  return (
    <Frame bg="#e9f4fb">
      {/* tấm ảnh cũ */}
      <g transform="translate(760 520) rotate(-4)">
        <rect x={-380} y={-330} width={760} height={720} rx={10} fill="#fdf8ea" stroke={INK} strokeWidth={14} />
        <rect x={-330} y={-280} width={660} height={520} fill="#bfe3f7" stroke={INK} strokeWidth={9} />
        {/* mây */}
        {[[-200, -180], [140, -220], [30, -90]].map(([mx, my], i) => (
          <g key={i}>
            <ellipse cx={mx} cy={my} rx={70} ry={30} fill="#ffffff" />
            <ellipse cx={mx + 42} cy={my + 8} rx={52} ry={24} fill="#ffffff" />
          </g>
        ))}
        {/* khinh khí cầu */}
        <g transform={`translate(0 ${rise})`}>
          <path d="M 0 -180 C 130 -180 140 -30 60 40 L -60 40 C -140 -30 -130 -180 0 -180 Z" fill="#e63328" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
          <path d="M -34 -176 C -60 -90 -60 -20 -30 40" fill="none" stroke="#ffffff" strokeWidth={16} />
          <path d="M 34 -176 C 60 -90 60 -20 30 40" fill="none" stroke="#ffffff" strokeWidth={16} />
          <line x1={-52} y1={44} x2={-34} y2={100} stroke={INK} strokeWidth={8} />
          <line x1={52} y1={44} x2={34} y2={100} stroke={INK} strokeWidth={8} />
          <rect x={-46} y={100} width={92} height={70} rx={8} fill="#b98a4e" stroke={INK} strokeWidth={9} />
          <circle cx={0} cy={92} r={30} fill="#ffffff" stroke={INK} strokeWidth={8} />
        </g>
        {/* đường cắt dán lởm chởm */}
        <path
          d="M -330 150 l 44 -22 l 44 22 l 44 -22 l 44 22 l 44 -22 l 44 22 l 44 -22 l 44 22 l 44 -22 l 44 22 l 44 -22 l 44 22 l 44 -22 l 44 22"
          fill="none"
          stroke="#e63328"
          strokeWidth={9}
          opacity={cutBlink}
        />
      </g>
      {/* kéo */}
      <g transform="translate(1310 830) rotate(-24)">
        <g stroke={INK} strokeWidth={11} fill="none" strokeLinecap="round">
          <line x1={-60} y1={-70} x2={40} y2={60} />
          <line x1={60} y1={-70} x2={-40} y2={60} />
          <circle cx={-50} cy={80} r={26} />
          <circle cx={50} cy={80} r={26} />
        </g>
      </g>
      <PopLabel frame={frame} at={10} x={1520} y={280} text="Ảnh ghép giả" bg="#e63328" size={54} />
      <PointerArrow frame={frame} at={26} from={[1430, 340]} to={[1000, 620]} color="#e63328" curve={0.25} />
      <PopLabel frame={frame} at={46} x={1520} y={520} text="Một nửa &quot;nhớ&quot; ra chuyến đi" bg="#8b5cf6" size={44} />
    </Frame>
  );
};

// 12) Quét não em bé, hồi hải mã sáng lên
export const BabyScannerGlow: React.FC<MemProps> = ({ frame }) => {
  const slide = easeOut(progress(frame, 4, 30));
  const glow = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.16));
  return (
    <Frame bg="#101c3a">
      {/* máy quét */}
      <g transform="translate(760 540)">
        <circle cx={0} cy={0} r={300} fill="#3d4d6b" stroke={INK} strokeWidth={14} />
        <circle cx={0} cy={0} r={190} fill="#101c3a" stroke={INK} strokeWidth={12} />
      </g>
      {/* khay trượt + em bé */}
      <g transform={`translate(${-260 + slide * 700} 0)`}>
        <rect x={200} y={620} width={860} height={34} rx={12} fill="#c9d3e2" stroke={INK} strokeWidth={11} />
        <g transform="translate(520 560)">
          <Head cx={0} cy={0} r={84} eyes="closed" tuft />
          <circle cx={16} cy={-14} r={40} fill="#a78bfa" opacity={glow} />
          <path
            d="M 40 20 q -66 -28 -56 -104 q 8 -56 66 -46 q 44 8 38 56 q -6 38 -38 32"
            fill="#a78bfa"
            stroke={INK}
            strokeWidth={8}
            strokeLinejoin="round"
            opacity={glow}
          />
          <g stroke="#a78bfa" strokeWidth={7} strokeLinecap="round" opacity={glow}>
            {new Array(8).fill(0).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={Math.cos(a) * 100} y1={Math.sin(a) * 100} x2={Math.cos(a) * 132} y2={Math.sin(a) * 132} />;
            })}
          </g>
          <line x1={84} y1={30} x2={330} y2={40} stroke={INK} strokeWidth={11} strokeLinecap="round" />
        </g>
      </g>
      {/* màn hình */}
      <g transform="translate(1560 460)">
        <rect x={-230} y={-180} width={460} height={360} rx={14} fill="#0a1330" stroke={INK} strokeWidth={12} />
        <path
          d="M 30 40 q -50 -22 -42 -80 q 6 -42 50 -34 q 34 6 28 42 q -4 28 -28 24"
          fill="none"
          stroke="#a78bfa"
          strokeWidth={9}
          opacity={glow}
          transform="translate(-30 -20)"
        />
        <path
          d={`M -190 110 ${new Array(7)
            .fill(0)
            .map((_, i) => `q 28 ${i % 2 === 0 ? -42 : 42} 56 0`)
            .join(' ')}`}
          fill="none"
          stroke="#5fc9e8"
          strokeWidth={8}
          strokeLinecap="round"
          {...drawOn(easeOut(progress(frame, 30, 30)))}
        />
      </g>
      <PopLabel frame={frame} at={40} x={760} y={200} text="Hồi hải mã ĐANG ghi!" bg="#a78bfa" size={56} />
      <PopLabel frame={frame} at={56} x={1560} y={760} text="Từ quãng 1 tuổi" bg="#5fc9e8" color={INK} size={48} />
    </Frame>
  );
};

// 13) Rương khoá — ký ức còn đó nhưng mất chìa
export const LockedBoxNoKey: React.FC<MemProps> = ({ frame }) => {
  const breathe = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.07));
  const shake = wobble(frame, 0.9, 3);
  return (
    <Frame bg="#f3ead9">
      <g transform={`translate(${1080 + shake} 560)`}>
        {/* ánh sáng rò qua khe */}
        <ellipse cx={0} cy={-30} rx={330} ry={150} fill="#ffd23f" opacity={0.35 * breathe} />
        {/* rương */}
        <rect x={-270} y={-90} width={540} height={280} rx={14} fill="#a8763f" stroke={INK} strokeWidth={14} />
        <path d="M -270 -90 q 270 -180 540 0 Z" fill="#b98a4e" stroke={INK} strokeWidth={14} strokeLinejoin="round" />
        <line x1={-270} y1={-84} x2={270} y2={-84} stroke={INK} strokeWidth={10} />
        {/* ký ức bên trong lộ qua nét đứt */}
        <g opacity={0.9}>
          <rect x={-200} y={-40} width={400} height={180} rx={10} fill="none" stroke={INK} strokeWidth={7} strokeDasharray="18 14" />
          <MemoryCard x={-180} y={-20} w={110} h={86} fill="#8ec7e8" icon="face" />
          <MemoryCard x={-45} y={-20} w={110} h={86} fill="#f5a623" icon="ball" />
          <MemoryCard x={90} y={-20} w={110} h={86} fill="#8fd694" icon="house" />
        </g>
        {/* ổ khoá */}
        <g transform="translate(0 150)">
          <rect x={-46} y={-10} width={92} height={80} rx={10} fill="#f0c040" stroke={INK} strokeWidth={11} />
          <path d="M -26 -10 v -30 a 26 26 0 0 1 52 0 v 30" fill="none" stroke={INK} strokeWidth={11} />
          <circle cx={0} cy={30} r={11} fill={INK} />
        </g>
      </g>

      {/* người xoè hai bàn tay trống */}
      <g transform="translate(430 600)">
        <Head cx={0} cy={-60} r={88} />
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={0} y1={28} x2={0} y2={250} />
          <path d="M 0 90 L 140 40 M 0 90 L -130 60" />
          <path d="M 0 250 L -90 400 M 0 250 L 90 400" />
        </g>
        {/* bàn tay trống */}
        <g stroke={INK} strokeWidth={8} fill="none">
          {[-1, 1].map((s) => (
            <g key={s} transform={`translate(${s === 1 ? 140 : -130} ${s === 1 ? 40 : 60})`}>
              <path d="M -26 0 q 26 -30 52 0 q -26 34 -52 0 Z" fill="#ffffff" />
            </g>
          ))}
        </g>
      </g>

      <PopLabel frame={frame} at={12} x={430} y={250} text="Không có chìa" bg="#8a97a8" size={50} />
      <PopLabel frame={frame} at={34} x={1080} y={960} text="Ký ức vẫn còn nguyên bên trong" bg="#f5a623" color={INK} size={50} />
      <HighlightRing frame={frame} at={46} cx={1080} cy={540} r={340} color="#f5a623" />
    </Frame>
  );
};
