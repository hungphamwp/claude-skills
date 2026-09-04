import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { CheckMark, CrossOut, HighlightRing, PointerArrow, PopLabel, ProgressBar } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type SpeedProps = { frame: number; accent: string };

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

const SHead: React.FC<{ cx: number; cy: number; r?: number; face?: 'wait' | 'annoyed' | 'happy' }> = ({
  cx,
  cy,
  r = 78,
  face = 'wait',
}) => {
  const ey = cy - r * 0.12;
  const dx = r * 0.34;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke={INK} strokeWidth={9} />
      <ellipse cx={cx - dx} cy={ey} rx={r * 0.17} ry={r * 0.21} fill="#ffffff" stroke={INK} strokeWidth={6} />
      <ellipse cx={cx + dx} cy={ey} rx={r * 0.17} ry={r * 0.21} fill="#ffffff" stroke={INK} strokeWidth={6} />
      <circle cx={cx - dx} cy={ey} r={r * 0.1} fill={INK} />
      <circle cx={cx + dx} cy={ey} r={r * 0.1} fill={INK} />
      {face === 'annoyed' ? (
        <>
          <g stroke={INK} strokeWidth={7} strokeLinecap="round">
            <line x1={cx - dx - r * 0.22} y1={ey - r * 0.44} x2={cx - dx + r * 0.2} y2={ey - r * 0.28} />
            <line x1={cx + dx - r * 0.2} y1={ey - r * 0.28} x2={cx + dx + r * 0.22} y2={ey - r * 0.44} />
          </g>
          <path d={`M ${cx - r * 0.26} ${cy + r * 0.52} q ${r * 0.26} ${-r * 0.26} ${r * 0.52} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        </>
      ) : face === 'happy' ? (
        <path d={`M ${cx - r * 0.28} ${cy + r * 0.34} q ${r * 0.28} ${r * 0.34} ${r * 0.56} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      ) : (
        <line x1={cx - r * 0.24} y1={cy + r * 0.44} x2={cx + r * 0.24} y2={cy + r * 0.44} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      )}
    </g>
  );
};

// Khung trình duyệt dùng lại nhiều nơi
const Browser: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  children?: React.ReactNode;
}> = ({ x, y, w = 620, h = 420, children }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#ffffff" stroke={INK} strokeWidth={13} />
    <rect x={-w / 2} y={-h / 2} width={w} height={74} rx={16} fill="#dfe6ee" stroke={INK} strokeWidth={13} />
    <g fill={INK}>
      <circle cx={-w / 2 + 50} cy={-h / 2 + 37} r={13} />
      <circle cx={-w / 2 + 92} cy={-h / 2 + 37} r={13} />
      <circle cx={-w / 2 + 134} cy={-h / 2 + 37} r={13} />
    </g>
    {children}
  </g>
);

// 1) Ngồi chờ vòng xoay
export const SlowSiteWaiting: React.FC<SpeedProps> = ({ frame }) => {
  const spin = frame * 5;
  const tap = wobble(frame, 0.35, 8);
  return (
    <Frame bg="#eef2f6">
      <Browser x={1180} y={480}>
        {/* vòng xoay loading */}
        <g transform={`translate(0 40) rotate(${spin})`}>
          <circle cx={0} cy={0} r={78} fill="none" stroke="#cfd8e3" strokeWidth={18} />
          <path d="M 0 -78 a 78 78 0 0 1 68 39" fill="none" stroke="#3a8fd6" strokeWidth={18} strokeLinecap="round" />
        </g>
      </Browser>
      {/* người ngồi chờ, ngón tay gõ sốt ruột */}
      <g transform={`translate(430 520)`}>
        <SHead cx={0} cy={0} r={88} face="annoyed" />
        <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
          <line x1={0} y1={88} x2={0} y2={310} />
          <path d={`M 0 150 L ${150 + tap} 210`} />
          <path d="M 0 150 L -150 220" />
          <path d="M 0 310 L -90 470 M 0 310 L 90 470" />
        </g>
      </g>
      <PopLabel frame={frame} at={10} x={430} y={240} text="Nhanh lên đi…" bg="#8a97a8" size={50} />
      <PopLabel frame={frame} at={40} x={1180} y={900} text="Mỗi giây chờ là một khách sắp mất" bg="#e63328" size={46} />
    </Frame>
  );
};

// 2) Quy tắc 3 giây
export const ThreeSecondRule: React.FC<SpeedProps> = ({ frame }) => {
  const count = Math.min(3, Math.floor(progress(frame, 6, 40) * 3.2));
  const leave = easeOut(progress(frame, 44, 24));
  return (
    <Frame bg="#fdeeea">
      {/* đồng hồ bấm giờ */}
      <g transform="translate(620 500)">
        <circle cx={0} cy={0} r={220} fill="#ffffff" stroke={INK} strokeWidth={16} />
        <rect x={-40} y={-260} width={80} height={50} rx={12} fill="#6b7280" stroke={INK} strokeWidth={13} />
        <text x={0} y={50} fontSize={160} fontWeight={800} fill={count >= 3 ? '#e63328' : INK} textAnchor="middle" fontFamily={FONT}>
          {count}
        </text>
        <g transform={`rotate(${progress(frame, 6, 40) * 340})`}>
          <line x1={0} y1={0} x2={0} y2={-170} stroke="#e63328" strokeWidth={12} strokeLinecap="round" />
        </g>
      </g>
      {/* đám người bỏ đi */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${1180 + i * 190 + leave * 260} ${480 + (i % 2) * 90})`} opacity={i < 2 ? 1 : 1 - leave * 0.6}>
          <SHead cx={0} cy={0} r={54} face={i < 2 ? 'annoyed' : 'wait'} />
          <g stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none">
            <line x1={0} y1={54} x2={0} y2={190} />
            <path d="M 0 100 L -80 150 M 0 100 L 80 140" />
            <path d="M 0 190 L -60 300 M 0 190 L 60 300" />
          </g>
        </g>
      ))}
      <PopLabel frame={frame} at={4} x={620} y={180} text="3 giây" bg="#e63328" size={62} />
      <PopLabel frame={frame} at={48} x={1420} y={230} text="Hơn một nửa bỏ đi" bg="#e63328" size={50} />
      <PopLabel frame={frame} at={58} x={1420} y={920} text="Khảo sát của Google, 2016" bg="#8a97a8" size={38} />
    </Frame>
  );
};

// 3) Ảnh nặng như quả tạ
export const HeavyImageAnvil: React.FC<SpeedProps> = ({ frame }) => {
  const press = easeOut(progress(frame, 8, 24));
  const shrink = easeOut(progress(frame, 40, 26));
  return (
    <Frame bg="#fff6e0">
      {/* quả tạ ảnh nặng đè xuống */}
      <g transform={`translate(700 ${240 + press * 90})`}>
        <rect x={-220} y={-150} width={440} height={300} rx={16} fill="#8ec7e8" stroke={INK} strokeWidth={14} />
        {/* biểu tượng ảnh */}
        <circle cx={-120} cy={-70} r={34} fill="#ffd23f" stroke={INK} strokeWidth={9} />
        <path d="M -200 90 L -70 -30 L 20 60 L 90 0 L 200 90 Z" fill="#8fd694" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <g transform="translate(0 200)">
          <rect x={-140} y={-46} width={280} height={92} rx={14} fill="#e63328" stroke={INK} strokeWidth={12} />
          <text x={0} y={16} fontSize={52} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
            5 MB
          </text>
        </g>
      </g>
      {/* trang web è cổ chịu đè */}
      <g transform={`translate(700 ${820 + press * 30}) scale(1 ${1 - press * 0.25})`}>
        <rect x={-300} y={-120} width={600} height={240} rx={16} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <g stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={0.5}>
          <line x1={-230} y1={-50} x2={230} y2={-50} />
          <line x1={-230} y1={10} x2={130} y2={10} />
          <line x1={-230} y1={70} x2={180} y2={70} />
        </g>
      </g>

      {/* sau khi nén */}
      <g opacity={shrink}>
        <g transform={`translate(1520 480) scale(${1 - shrink * 0.35})`}>
          <rect x={-220} y={-150} width={440} height={300} rx={16} fill="#8ec7e8" stroke={INK} strokeWidth={14} />
          <circle cx={-120} cy={-70} r={34} fill="#ffd23f" stroke={INK} strokeWidth={9} />
          <path d="M -200 90 L -70 -30 L 20 60 L 90 0 L 200 90 Z" fill="#8fd694" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        </g>
        <g transform="translate(1520 700)">
          <rect x={-140} y={-46} width={280} height={92} rx={14} fill="#22a04a" stroke={INK} strokeWidth={12} />
          <text x={0} y={16} fontSize={48} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
            300 KB
          </text>
        </g>
        <CheckMark frame={frame} at={52} x={1520} y={880} size={150} />
      </g>
      <PopLabel frame={frame} at={4} x={700} y={80} text="Ảnh chưa nén" bg="#e63328" size={48} />
      <PopLabel frame={frame} at={44} x={1520} y={230} text="Nén + đổi WebP" bg="#22a04a" size={48} />
    </Frame>
  );
};

// 4) Hosting chia sẻ chen chúc
export const SharedHostingCrowd: React.FC<SpeedProps> = ({ frame }) => {
  const hog = easeOut(progress(frame, 26, 24));
  return (
    <Frame bg="#f6efe0">
      {/* tủ máy chủ */}
      <g transform="translate(560 540)">
        <rect x={-260} y={-360} width={520} height={720} rx={18} fill="#4b5563" stroke={INK} strokeWidth={14} />
        {new Array(6).fill(0).map((_, i) => (
          <g key={i}>
            <rect x={-210} y={-300 + i * 112} width={420} height={82} rx={10} fill="#2f3945" stroke={INK} strokeWidth={8} />
            <circle
              cx={160}
              cy={-259 + i * 112}
              r={15}
              fill={i === 2 ? '#e63328' : '#22a04a'}
              opacity={0.5 + 0.5 * Math.abs(Math.sin(frame * 0.15 + i))}
            />
          </g>
        ))}
      </g>
      {/* các website chen chúc */}
      {new Array(7).fill(0).map((_, i) => {
        const angle = (i / 7) * Math.PI * 2;
        const big = i === 3;
        const r = 260 + (big ? hog * 90 : 0);
        return (
          <g key={i} transform={`translate(${1380 + Math.cos(angle) * r * 0.9} ${540 + Math.sin(angle) * r * 0.62}) scale(${big ? 1 + hog * 0.6 : 1 - hog * 0.18})`}>
            <rect x={-78} y={-58} width={156} height={116} rx={12} fill={big ? '#e63328' : '#ffffff'} stroke={INK} strokeWidth={11} />
            <rect x={-78} y={-58} width={156} height={30} rx={12} fill={big ? '#b81f16' : '#dfe6ee'} stroke={INK} strokeWidth={11} />
          </g>
        );
      })}
      <PopLabel frame={frame} at={6} x={560} y={140} text="Một máy chủ" bg="#8a97a8" size={48} />
      <PopLabel frame={frame} at={16} x={1380} y={140} text="Hàng trăm website" bg="#f5a623" color={INK} size={48} />
      <PopLabel frame={frame} at={40} x={1380} y={960} text="Hàng xóm ngốn hết — bạn lãnh đủ" bg="#e63328" size={46} />
      <HighlightRing frame={frame} at={34} cx={1380} cy={200} r={0} color="#e63328" />
    </Frame>
  );
};

// 5) Cache — nấu lại từ đầu vs dọn sẵn
export const NoCacheKitchen: React.FC<SpeedProps> = ({ frame }) => {
  const cookA = ((frame * 1.6) % 100) / 100;
  const b = easeOut(progress(frame, 26, 20));
  return (
    <Frame bg="#f3edfd">
      <line x1={960} y1={140} x2={960} y2={960} stroke={INK} strokeWidth={10} strokeDasharray="26 20" />
      {/* trái: nấu lại từ đầu */}
      <g>
        <PopLabel frame={frame} at={4} x={480} y={210} text="Không cache" bg="#e63328" size={50} />
        {/* bếp + nồi */}
        <g transform="translate(480 560)">
          <rect x={-170} y={60} width={340} height={70} rx={14} fill="#6b7280" stroke={INK} strokeWidth={13} />
          <path d="M -130 60 L -100 -80 L 100 -80 L 130 60 Z" fill="#c9d3e2" stroke={INK} strokeWidth={13} strokeLinejoin="round" />
          <ellipse cx={0} cy={-80} rx={130} ry={26} fill="#dfe6ee" stroke={INK} strokeWidth={11} />
          {/* hơi bốc lên */}
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${-60 + i * 60} ${-110 - cookA * 90} q 22 -30 0 -56`}
              fill="none"
              stroke="#b0b8c4"
              strokeWidth={9}
              strokeLinecap="round"
              opacity={1 - cookA}
            />
          ))}
        </g>
        <ProgressBar frame={frame} at={6} x={250} y={790} w={460} h={50} color="#e63328" duration={70} label="khách phải chờ" />
      </g>
      {/* phải: dọn sẵn */}
      <g opacity={0.3 + b * 0.7}>
        <PopLabel frame={frame} at={26} x={1440} y={210} text="Có cache" bg="#22a04a" size={50} />
        <g transform="translate(1440 560)">
          {/* khay dọn sẵn */}
          <rect x={-220} y={40} width={440} height={40} rx={12} fill="#b98a4e" stroke={INK} strokeWidth={13} />
          {[-140, 0, 140].map((dx, i) => (
            <g key={dx} transform={`translate(${dx} -30)`}>
              <ellipse cx={0} cy={40} rx={92} ry={22} fill="#ffffff" stroke={INK} strokeWidth={11} />
              <path d="M -70 40 q 70 -80 140 0 Z" fill="#ffd23f" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
            </g>
          ))}
        </g>
        <ProgressBar frame={frame} at={30} x={1210} y={790} w={460} h={50} color="#22a04a" duration={12} label="có ngay" />
      </g>
    </Frame>
  );
};

// 6) Chồng plugin đè lên website
export const PluginPile: React.FC<SpeedProps> = ({ frame }) => {
  const names = ['SEO', 'Slider', 'Form', 'Chat', 'Backup', 'Popup', 'Analytics'];
  return (
    <Frame bg="#fdf3e0">
      {/* website ở dưới cùng bị đè */}
      <g transform="translate(760 880)">
        <rect x={-300} y={-70} width={600} height={140} rx={14} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <text x={0} y={16} fontSize={50} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          website
        </text>
      </g>
      {/* chồng plugin rơi xuống lần lượt */}
      {names.map((n, i) => {
        const p = easeOut(progress(frame, 4 + i * 7, 14));
        if (p <= 0) return null;
        const y = 780 - i * 96;
        const tilt = (seeded(i) - 0.5) * 8;
        return (
          <g key={n} transform={`translate(${760 + (seeded(i + 9) - 0.5) * 60} ${y - (1 - p) * 300}) rotate(${tilt})`} opacity={p}>
            <rect x={-230} y={-42} width={460} height={84} rx={12} fill={['#8ec7e8', '#8fd694', '#ffd23f', '#f0a3c0', '#c9b6f7', '#ffb08a', '#a8d8d8'][i]} stroke={INK} strokeWidth={11} />
            <text x={0} y={14} fontSize={42} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {n}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={4} x={1520} y={280} text="Mỗi plugin = thêm một mớ mã" bg="#f5a623" color={INK} size={44} />
      <PopLabel frame={frame} at={50} x={1520} y={620} text="Không dùng thì GỠ HẲN" bg="#e63328" size={48} />
      <PopLabel frame={frame} at={58} x={1520} y={730} text="đừng chỉ tắt đi" bg="#8a97a8" size={40} />
    </Frame>
  );
};

// 7) Máy chủ ở xa vs CDN gần
export const DistanceCdn: React.FC<SpeedProps> = ({ frame }) => {
  const trip = ((frame * 1.1) % 100) / 100;
  const cdn = easeOut(progress(frame, 34, 24));
  return (
    <Frame bg="#eaf3fb">
      {/* quả địa cầu đơn giản */}
      <g transform="translate(960 560)">
        <circle cx={0} cy={0} r={330} fill="#8ec7e8" stroke={INK} strokeWidth={14} />
        <path d="M -240 -110 q 120 -70 230 -10 q 90 50 40 130 q -60 90 -180 50 q -120 -40 -90 -170 Z" fill="#8fd694" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <g stroke={INK} strokeWidth={6} fill="none" opacity={0.4}>
          <ellipse cx={0} cy={0} rx={330} ry={130} />
          <ellipse cx={0} cy={0} rx={150} ry={330} />
        </g>
      </g>
      {/* khách VN bên phải, máy chủ Mỹ bên trái */}
      <g transform="translate(1600 780)">
        <SHead cx={0} cy={0} r={60} face="wait" />
        <text x={0} y={130} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          khách VN
        </text>
      </g>
      <g transform="translate(320 320)">
        <rect x={-70} y={-90} width={140} height={180} rx={12} fill="#4b5563" stroke={INK} strokeWidth={12} />
        <text x={0} y={150} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          máy chủ Mỹ
        </text>
      </g>
      {/* gói dữ liệu đi vòng xa */}
      <circle
        cx={320 + trip * 1280}
        cy={320 + Math.sin(trip * Math.PI) * 420}
        r={20}
        fill="#e63328"
        stroke={INK}
        strokeWidth={8}
      />
      {/* CDN gần khách */}
      <g opacity={cdn}>
        <g transform="translate(1370 480)">
          <rect x={-58} y={-72} width={116} height={144} rx={10} fill="#22a04a" stroke={INK} strokeWidth={11} />
        </g>
        <PointerArrow frame={frame} at={40} from={[1420, 560]} to={[1560, 700]} color="#22a04a" width={10} curve={0.2} />
        <PopLabel frame={frame} at={46} x={1300} y={300} text="CDN đặt bản sao gần khách" bg="#22a04a" size={44} />
      </g>
      <PopLabel frame={frame} at={6} x={640} y={140} text="Nửa vòng trái đất mỗi lần tải" bg="#e63328" size={46} />
    </Frame>
  );
};

// 8) Ba chỉ số Core Web Vitals
export const CoreWebVitals: React.FC<SpeedProps> = ({ frame }) => {
  const metrics: [string, string, string, string][] = [
    ['LCP', '≤ 2,5 giây', 'tốc độ hiện nội dung', '#3a8fd6'],
    ['INP', '≤ 200 ms', 'độ nhạy khi bấm', '#8b5cf6'],
    ['CLS', '≤ 0,1', 'độ ổn định bố cục', '#22a04a'],
  ];
  return (
    <Frame bg="#f3edfd">
      <PopLabel frame={frame} at={2} x={960} y={160} text="Core Web Vitals" bg="#8b5cf6" size={58} />
      {metrics.map(([name, val, desc, color], i) => {
        const p = easeOut(progress(frame, 8 + i * 12, 18));
        const cx = 400 + i * 560;
        return (
          <g key={name} opacity={p} transform={`translate(${cx} 560) scale(${0.8 + p * 0.2})`}>
            <circle cx={0} cy={-40} r={150} fill="#ffffff" stroke={INK} strokeWidth={14} />
            <circle cx={0} cy={-40} r={150} fill="none" stroke={color} strokeWidth={20} strokeDasharray={`${p * 700} 999`} strokeLinecap="round" transform="rotate(-90)" />
            <text x={0} y={-20} fontSize={62} fontWeight={800} fill={color} textAnchor="middle" fontFamily={FONT}>
              {name}
            </text>
            <g transform="translate(0 190)">
              <rect x={-170} y={-44} width={340} height={88} rx={14} fill={color} stroke={INK} strokeWidth={12} />
              <text x={0} y={14} fontSize={44} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
                {val}
              </text>
            </g>
            <text x={0} y={310} fontSize={36} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {desc}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={50} x={960} y={980} text="75% lượt truy cập thật phải đạt" bg="#ffffff" color={INK} size={44} />
    </Frame>
  );
};

// 9) Bố cục nhảy — CLS
export const LayoutShift: React.FC<SpeedProps> = ({ frame }) => {
  const jump = progress(frame, 30, 6);
  const shift = jump > 0 ? 150 : 0;
  // con trỏ đứng yên tại vị trí nút TRƯỚC khi trang nhảy
  const cursorY = 545;
  return (
    <Frame bg="#fdeeea">
      <Browser x={860} y={540} w={900} h={640}>
        {/* nội dung */}
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" opacity={0.4}>
          <line x1={-360} y1={-200} x2={360} y2={-200} />
          <line x1={-360} y1={-140} x2={200} y2={-140} />
        </g>
        {/* quảng cáo chèn vào làm nhảy */}
        {jump > 0 ? (
          <g>
            <rect x={-360} y={-100} width={720} height={140} rx={12} fill="#ffd23f" stroke={INK} strokeWidth={12} />
            <text x={0} y={-12} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              QUẢNG CÁO
            </text>
          </g>
        ) : null}
        {/* nút bị đẩy xuống */}
        <g transform={`translate(0 ${20 + shift})`}>
          <rect x={-180} y={-52} width={360} height={104} rx={16} fill="#22a04a" stroke={INK} strokeWidth={12} />
          <text x={0} y={16} fontSize={44} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
            MUA NGAY
          </text>
        </g>
      </Browser>
      {/* con trỏ chuột đứng yên -> bấm trúng quảng cáo */}
      <g transform={`translate(860 ${cursorY})`}>
        <path d="M 0 0 L 0 62 L 16 48 L 28 74 L 44 66 L 32 40 L 52 38 Z" fill="#ffffff" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
      </g>
      <PopLabel frame={frame} at={6} x={1560} y={300} text="Định bấm nút…" bg="#8a97a8" size={44} />
      <PopLabel frame={frame} at={34} x={1560} y={640} text="Trang nhảy!" bg="#e63328" size={48} />
      {jump > 0 ? <HighlightRing frame={frame} at={32} cx={860} cy={545} r={150} color="#e63328" /> : null}
    </Frame>
  );
};

// 10) Danh sách năm việc cần làm
export const SpeedChecklist: React.FC<SpeedProps> = ({ frame }) => {
  const items = ['Nén ảnh', 'Đổi hosting khá hơn', 'Bật cache', 'Gỡ plugin thừa', 'Dùng CDN'];
  return (
    <Frame bg="#eafbef">
      <PopLabel frame={frame} at={2} x={960} y={160} text="5 việc cần làm" bg="#22a04a" size={58} />
      <g transform="translate(560 300)">
        {items.map((it, i) => {
          const p = easeOut(progress(frame, 8 + i * 10, 14));
          return (
            <g key={it} opacity={0.25 + p * 0.75} transform={`translate(0 ${i * 130})`}>
              <rect x={-60} y={-46} width={92} height={92} rx={14} fill="#ffffff" stroke={INK} strokeWidth={12} />
              {p > 0.7 ? <CheckMark frame={frame} at={8 + i * 10 + 8} x={-14} y={0} size={100} /> : null}
              <text x={90} y={18} fontSize={52} fontWeight={800} fill={INK} fontFamily={FONT}>
                {it}
              </text>
            </g>
          );
        })}
      </g>
      <PopLabel frame={frame} at={60} x={960} y={1000} text="Làm xong là nhanh lên thấy rõ" bg="#22a04a" size={46} />
    </Frame>
  );
};
