import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { CrossOut, HighlightRing, PointerArrow, PopLabel, PulseRing } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type DomainProps = { frame: number; accent: string };

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

const DHead: React.FC<{ cx: number; cy: number; r?: number; face?: 'ok' | 'lost' | 'happy' }> = ({
  cx,
  cy,
  r = 78,
  face = 'ok',
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
      {face === 'lost' ? (
        <>
          <ellipse cx={cx} cy={cy + r * 0.46} rx={r * 0.16} ry={r * 0.2} fill={INK} />
          <g stroke={INK} strokeWidth={7} strokeLinecap="round">
            <line x1={cx - dx - r * 0.22} y1={ey - r * 0.42} x2={cx - dx + r * 0.18} y2={ey - r * 0.3} />
            <line x1={cx + dx - r * 0.18} y1={ey - r * 0.3} x2={cx + dx + r * 0.22} y2={ey - r * 0.42} />
          </g>
        </>
      ) : face === 'happy' ? (
        <path d={`M ${cx - r * 0.28} ${cy + r * 0.34} q ${r * 0.28} ${r * 0.34} ${r * 0.56} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      ) : (
        <line x1={cx - r * 0.24} y1={cy + r * 0.44} x2={cx + r * 0.24} y2={cy + r * 0.44} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      )}
    </g>
  );
};

// Biển số nhà — hình ẩn dụ cho tên miền
const AddressPlate: React.FC<{ x: number; y: number; scale?: number; text?: string }> = ({
  x,
  y,
  scale = 1,
  text = 'shop.vn',
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x={-190} y={-70} width={380} height={140} rx={16} fill="#3a8fd6" stroke={INK} strokeWidth={12} />
    <text x={0} y={22} fontSize={62} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
      {text}
    </text>
  </g>
);

// Ngôi nhà — hình ẩn dụ cho hosting
const House: React.FC<{ x: number; y: number; scale?: number; withStuff?: boolean; dim?: boolean }> = ({
  x,
  y,
  scale = 1,
  withStuff = false,
  dim = false,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={dim ? 0.45 : 1}>
    <rect x={-230} y={-240} width={460} height={240} fill="#ffe1b0" stroke={INK} strokeWidth={12} />
    <path d="M -290 -240 L 0 -430 L 290 -240 Z" fill="#e07a4a" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
    <rect x={-60} y={-130} width={120} height={130} fill="#a8763f" stroke={INK} strokeWidth={10} />
    <circle cx={34} cy={-64} r={9} fill={INK} />
    {withStuff ? (
      <>
        <rect x={-190} y={-200} width={100} height={76} rx={8} fill="#8ec7e8" stroke={INK} strokeWidth={8} />
        <rect x={100} y={-200} width={100} height={76} rx={8} fill="#8fd694" stroke={INK} strokeWidth={8} />
        <g stroke={INK} strokeWidth={6} opacity={0.7}>
          <line x1={-170} y1={-176} x2={-110} y2={-176} />
          <line x1={-170} y1={-152} x2={-130} y2={-152} />
          <line x1={120} y1={-176} x2={180} y2={-176} />
          <line x1={120} y1={-152} x2={160} y2={-152} />
        </g>
      </>
    ) : (
      <rect x={-190} y={-200} width={100} height={76} rx={8} fill="#cfe3f0" stroke={INK} strokeWidth={8} />
    )}
  </g>
);

// 1) Biển số nhà vs ngôi nhà — hai thứ tách biệt
export const AddressVsHouse: React.FC<DomainProps> = ({ frame }) => {
  const a = easeOut(progress(frame, 4, 18));
  const b = easeOut(progress(frame, 22, 18));
  return (
    <Frame bg="#eef6fb">
      <line x1={960} y1={140} x2={960} y2={950} stroke={INK} strokeWidth={10} strokeDasharray="26 20" />
      <g opacity={a}>
        <AddressPlate x={470} y={480} scale={1.1} />
        <PopLabel frame={frame} at={10} x={470} y={230} text="TÊN MIỀN" bg="#3a8fd6" size={56} />
        <PopLabel frame={frame} at={16} x={470} y={720} text="= địa chỉ nhà" bg="#ffffff" color={INK} size={50} />
      </g>
      <g opacity={b}>
        <House x={1420} y={720} scale={0.9} withStuff />
        <PopLabel frame={frame} at={28} x={1420} y={230} text="HOSTING" bg="#22a04a" size={56} />
        <PopLabel frame={frame} at={34} x={1420} y={880} text="= mảnh đất và ngôi nhà" bg="#ffffff" color={INK} size={46} />
      </g>
    </Frame>
  );
};

// 2) Chỉ có biển số, chưa có nhà
export const BuyDomainOnly: React.FC<DomainProps> = ({ frame }) => {
  const sway = wobble(frame, 0.08, 8);
  return (
    <Frame bg="#fdf3e0">
      {/* bãi đất trống */}
      <path d={`M 0 780 Q ${W / 2} 740 ${W} 790 L ${W} ${H} L 0 ${H} Z`} fill="#d9b98a" stroke={INK} strokeWidth={12} />
      {/* vài bụi cỏ dại */}
      <g stroke="#8a9a4a" strokeWidth={9} strokeLinecap="round">
        {[420, 700, 1250, 1560].map((gx, i) => (
          <g key={gx} transform={`translate(${gx} ${810 + (i % 2) * 20})`}>
            <path d={`M 0 0 q ${-14 + wobble(frame, 0.1, 4, i)} -40 -22 -60`} fill="none" />
            <path d={`M 0 0 q ${8 + wobble(frame, 0.12, 4, i)} -44 24 -56`} fill="none" />
          </g>
        ))}
      </g>
      {/* cọc cắm biển số giữa bãi đất */}
      <g transform={`translate(960 ${470 + sway})`}>
        <AddressPlate x={0} y={0} scale={0.95} />
      </g>
      <line x1={960} y1={540} x2={960} y2={800} stroke={INK} strokeWidth={16} strokeLinecap="round" />

      {/* người tới nơi, ngơ ngác */}
      <g transform="translate(430 560)">
        <DHead cx={0} cy={0} r={80} face="lost" />
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={0} y1={80} x2={0} y2={300} />
          <path d="M 0 140 L -140 80 M 0 140 L 140 90" />
          <path d="M 0 300 L -80 460 M 0 300 L 80 460" />
        </g>
      </g>
      <PopLabel frame={frame} at={20} x={470} y={330} text="Nhà đâu?" bg="#e63328" size={54} />
      <PopLabel frame={frame} at={40} x={1430} y={330} text="Chỉ có địa chỉ, chưa có nhà" bg="#f5a623" color={INK} size={46} />
    </Frame>
  );
};

// 3) Ngôi nhà chứa đầy đồ — hosting
export const HostingHouse: React.FC<DomainProps> = ({ frame }) => {
  const items: [string, string][] = [
    ['ảnh', '#8ec7e8'],
    ['bài viết', '#8fd694'],
    ['sản phẩm', '#ffd23f'],
    ['giao diện', '#f0a3c0'],
  ];
  return (
    <Frame bg="#eafbef">
      {/* nhà cắt ngang cho thấy bên trong */}
      <g transform="translate(760 760)">
        <rect x={-380} y={-420} width={760} height={420} fill="#ffe1b0" stroke={INK} strokeWidth={13} />
        <path d="M -450 -420 L 0 -650 L 450 -420 Z" fill="#e07a4a" stroke={INK} strokeWidth={13} strokeLinejoin="round" />
        {items.map(([label, color], i) => {
          const p = easeOut(progress(frame, 8 + i * 10, 16));
          const cx = -230 + (i % 2) * 300;
          const cy = -320 + Math.floor(i / 2) * 180;
          return (
            <g key={label} opacity={p} transform={`translate(${cx} ${cy}) scale(${0.7 + p * 0.3})`}>
              <rect x={-120} y={-62} width={240} height={124} rx={12} fill={color} stroke={INK} strokeWidth={9} />
              <text x={0} y={16} fontSize={42} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
                {label}
              </text>
            </g>
          );
        })}
      </g>

      {/* máy chủ chạy 24/24 bên phải */}
      <g transform="translate(1560 620)">
        <rect x={-140} y={-260} width={280} height={520} rx={16} fill="#4b5563" stroke={INK} strokeWidth={13} />
        {new Array(5).fill(0).map((_, i) => (
          <g key={i}>
            <rect x={-108} y={-210 + i * 96} width={216} height={62} rx={8} fill="#2f3945" stroke={INK} strokeWidth={7} />
            <circle
              cx={72}
              cy={-179 + i * 96}
              r={13}
              fill={seeded(i) > 0.4 ? '#22a04a' : '#ffd23f'}
              opacity={0.45 + 0.55 * Math.abs(Math.sin(frame * 0.13 + i))}
            />
          </g>
        ))}
      </g>
      <PopLabel frame={frame} at={48} x={1560} y={950} text="chạy 24/24" bg="#22a04a" size={46} />
      <PopLabel frame={frame} at={4} x={560} y={140} text="Hosting = chỗ chứa đồ thật" bg="#22a04a" size={52} />
    </Frame>
  );
};

// 4) DNS là cuốn danh bạ
export const DnsDirectory: React.FC<DomainProps> = ({ frame }) => {
  const look = easeOut(progress(frame, 14, 24));
  const found = easeOut(progress(frame, 40, 16));
  return (
    <Frame bg="#f3edfd">
      {/* cuốn danh bạ mở */}
      <g transform="translate(900 560)">
        <rect x={-460} y={-300} width={920} height={600} rx={18} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <line x1={0} y1={-300} x2={0} y2={300} stroke={INK} strokeWidth={11} />
        {/* các dòng tra cứu */}
        {[
          ['shop.vn', '203.0.11.7'],
          ['tin.vn', '198.51.4.2'],
          ['abc.vn', '192.0.2.31'],
        ].map(([name, ip], i) => {
          const hit = i === 0 && found > 0;
          return (
            <g key={name} opacity={i === 0 ? 1 : 0.5}>
              <text x={-400} y={-160 + i * 130} fontSize={46} fontWeight={800} fill="#3a8fd6" fontFamily={FONT}>
                {name}
              </text>
              <line x1={-160} y1={-176 + i * 130} x2={40} y2={-176 + i * 130} stroke={INK} strokeWidth={7} strokeDasharray="14 12" />
              <text x={80} y={-160 + i * 130} fontSize={46} fontWeight={800} fill={hit ? '#22a04a' : INK} fontFamily="monospace">
                {ip}
              </text>
            </g>
          );
        })}
        <text x={0} y={250} fontSize={52} fontWeight={800} fill="#8b5cf6" textAnchor="middle" fontFamily={FONT}>
          DANH BẠ DNS
        </text>
      </g>
      {/* kính lúp rê tìm */}
      <g transform={`translate(${520 + look * 120} ${400 + look * 20})`}>
        <circle cx={0} cy={0} r={92} fill="#ffffff" fillOpacity={0.3} stroke={INK} strokeWidth={13} />
        <line x1={64} y1={64} x2={150} y2={150} stroke={INK} strokeWidth={20} strokeLinecap="round" />
      </g>
      {found > 0.9 ? <HighlightRing frame={frame} at={44} cx={1030} cy={400} r={160} color="#22a04a" /> : null}
      <PopLabel frame={frame} at={6} x={430} y={170} text="Gõ tên miền" bg="#3a8fd6" size={48} />
      <PopLabel frame={frame} at={46} x={1520} y={170} text="Ra địa chỉ máy chủ" bg="#22a04a" size={48} />
    </Frame>
  );
};

// 5) Nameserver là cột biển chỉ đường
export const NameserverSignpost: React.FC<DomainProps> = ({ frame }) => {
  const swing = wobble(frame, 0.09, 4);
  return (
    <Frame bg="#fff6e0">
      {/* cột biển */}
      <g transform={`translate(760 430) rotate(${swing} 0 460)`}>
        <line x1={0} y1={0} x2={0} y2={520} stroke={INK} strokeWidth={20} strokeLinecap="round" />
        {/* biển trên: trỏ sang phải */}
        <g transform="translate(0 -30)">
          <path d="M -30 -60 L 330 -60 L 400 0 L 330 60 L -30 60 Z" fill="#f5a623" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
          <text x={160} y={18} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            hosting
          </text>
        </g>
        {/* biển dưới: tên miền */}
        <g transform="translate(0 110)">
          <path d="M 30 -60 L -330 -60 L -400 0 L -330 60 L 30 60 Z" fill="#3a8fd6" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
          <text x={-160} y={18} fontSize={46} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
            tên miền
          </text>
        </g>
      </g>
      <House x={1520} y={880} scale={0.72} withStuff />
      <AddressPlate x={330} y={760} scale={0.66} />
      <PopLabel frame={frame} at={8} x={760} y={200} text="NAMESERVER" bg="#f5a623" color={INK} size={54} />
      <PointerArrow frame={frame} at={30} from={[1180, 420]} to={[1420, 620]} color="#22a04a" curve={0.2} />
      <PopLabel frame={frame} at={44} x={1180} y={210} text="trỏ đúng chỗ thì web mới hiện" bg="#ffffff" color={INK} size={42} />
    </Frame>
  );
};

// 6) Chuyển nhà nhưng giữ nguyên địa chỉ
export const MoveHouseSameAddress: React.FC<DomainProps> = ({ frame }) => {
  const move = easeOut(progress(frame, 16, 34));
  return (
    <Frame bg="#eafbef">
      {/* nhà cũ mờ dần */}
      <g opacity={1 - move * 0.75}>
        <House x={430} y={800} scale={0.66} withStuff />
        <PopLabel frame={frame} at={4} x={430} y={330} text="hosting cũ — chậm" bg="#8a97a8" size={44} />
      </g>
      {/* nhà mới hiện dần */}
      <g opacity={0.25 + move * 0.75}>
        <House x={1480} y={800} scale={0.66} withStuff />
        <PopLabel frame={frame} at={30} x={1480} y={330} text="hosting mới — nhanh" bg="#22a04a" size={44} />
      </g>
      {/* biển số bay theo */}
      <g transform={`translate(${430 + move * 1050} ${560 - Math.sin(move * Math.PI) * 170})`}>
        <AddressPlate x={0} y={0} scale={0.72} />
      </g>
      <PointerArrow frame={frame} at={20} from={[620, 640]} to={[1250, 640]} color="#3a8fd6" curve={-0.28} />
      <PopLabel frame={frame} at={52} x={960} y={990} text="Địa chỉ giữ nguyên — khách vẫn tìm thấy" bg="#3a8fd6" size={48} />
    </Frame>
  );
};

// 7) Hai hoá đơn riêng
export const SeparateBills: React.FC<DomainProps> = ({ frame }) => {
  const a = easeOut(progress(frame, 6, 18));
  const b = easeOut(progress(frame, 24, 18));
  const Bill: React.FC<{ x: number; title: string; cycle: string; color: string; op: number }> = ({
    x,
    title,
    cycle,
    color,
    op,
  }) => (
    <g transform={`translate(${x} 540)`} opacity={op}>
      <path d="M -230 -300 L 230 -300 L 230 280 L 160 240 L 80 280 L 0 240 L -80 280 L -160 240 L -230 280 Z" fill="#ffffff" stroke={INK} strokeWidth={13} strokeLinejoin="round" />
      <rect x={-230} y={-300} width={460} height={110} fill={color} stroke={INK} strokeWidth={13} />
      <text x={0} y={-228} fontSize={52} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
        {title}
      </text>
      <g stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={0.55}>
        <line x1={-160} y1={-110} x2={160} y2={-110} />
        <line x1={-160} y1={-40} x2={100} y2={-40} />
      </g>
      <text x={0} y={90} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
        {cycle}
      </text>
    </g>
  );
  return (
    <Frame bg="#eef6fb">
      <Bill x={560} title="TÊN MIỀN" cycle="theo năm" color="#3a8fd6" op={a} />
      <Bill x={1360} title="HOSTING" cycle="tháng / năm" color="#22a04a" op={b} />
      <PopLabel frame={frame} at={44} x={960} y={960} text="Hai nhà cung cấp khác nhau cũng được" bg="#ffffff" color={INK} size={46} />
    </Frame>
  );
};

// 8) Lịch gia hạn — cả hai đều là thuê
export const RentCalendar: React.FC<DomainProps> = ({ frame }) => {
  const ring = wobble(frame, 0.9, 12);
  const warn = easeOut(progress(frame, 26, 18));
  return (
    <Frame bg="#fdeeea">
      {/* tờ lịch */}
      <g transform="translate(740 540)">
        <rect x={-300} y={-320} width={600} height={640} rx={18} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <rect x={-300} y={-320} width={600} height={130} rx={18} fill="#e63328" stroke={INK} strokeWidth={14} />
        <text x={0} y={-240} fontSize={56} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
          HẾT HẠN
        </text>
        {/* ô ngày */}
        {new Array(12).fill(0).map((_, i) => {
          const cx = -210 + (i % 4) * 140;
          const cy = -100 + Math.floor(i / 4) * 140;
          const isDay = i === 9;
          return (
            <g key={i}>
              <rect x={cx - 52} y={cy - 46} width={104} height={92} rx={10} fill={isDay ? '#e63328' : '#f2f2f2'} stroke={INK} strokeWidth={8} />
              {isDay ? (
                <text x={cx} y={cy + 18} fontSize={48} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
                  !
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
      {/* chuông báo rung */}
      <g transform={`translate(1400 420) rotate(${ring})`}>
        <path d="M 0 -150 q 130 0 130 130 l 22 70 l -304 0 l 22 -70 q 0 -130 130 -130 Z" fill="#ffd23f" stroke={INK} strokeWidth={13} strokeLinejoin="round" />
        <circle cx={0} cy={-160} r={22} fill={INK} />
        <path d="M -44 66 q 44 56 88 0" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
      </g>
      <PopLabel frame={frame} at={6} x={1420} y={200} text="Thuê, không phải mua đứt" bg="#e63328" size={50} />
      <g opacity={warn}>
        <PopLabel frame={frame} at={26} x={1420} y={720} text="Quên gia hạn = web tắt" bg="#e63328" size={48} />
        <PopLabel frame={frame} at={42} x={1420} y={840} text="Để lâu là mất tên miền thật" bg="#8a97a8" size={44} />
      </g>
    </Frame>
  );
};

// 9) Tên miền đứng tên ai
export const DomainWrongOwner: React.FC<DomainProps> = ({ frame }) => {
  const grab = easeOut(progress(frame, 18, 24));
  return (
    <Frame bg="#fdf3e0">
      {/* chủ doanh nghiệp bên trái, tay không */}
      <g transform="translate(430 500)">
        <DHead cx={0} cy={0} r={86} face="lost" />
        <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
          <line x1={0} y1={86} x2={0} y2={330} />
          <path d="M 0 150 L 190 100 M 0 150 L -160 110" />
          <path d="M 0 330 L -90 500 M 0 330 L 90 500" />
        </g>
        <PopLabel frame={frame} at={6} x={0} y={-180} text="Bạn" bg="#3a8fd6" size={50} />
      </g>

      {/* hợp đồng tên miền ở giữa, trượt sang bên kia */}
      <g transform={`translate(${960 + grab * 320} 500) rotate(${grab * 8})`}>
        <rect x={-190} y={-240} width={380} height={480} rx={14} fill="#ffffff" stroke={INK} strokeWidth={13} />
        <text x={0} y={-160} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          TÊN MIỀN
        </text>
        <g stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={0.55}>
          <line x1={-130} y1={-80} x2={130} y2={-80} />
          <line x1={-130} y1={-20} x2={80} y2={-20} />
        </g>
        <text x={0} y={90} fontSize={38} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          Chủ sở hữu:
        </text>
        <text x={0} y={150} fontSize={40} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          bên làm web
        </text>
      </g>

      {/* bên thứ ba giữ chìa khoá */}
      <g transform="translate(1620 500)">
        <DHead cx={0} cy={0} r={86} />
        <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
          <line x1={0} y1={86} x2={0} y2={330} />
          <path d="M 0 150 L -200 120" />
          <path d="M 0 330 L -90 500 M 0 330 L 90 500" />
        </g>
        {/* chìa khoá trong tay */}
        <g transform="translate(-140 210) rotate(-20)" opacity={grab}>
          <circle cx={0} cy={0} r={30} fill="none" stroke="#f0c040" strokeWidth={16} />
          <line x1={26} y1={0} x2={120} y2={0} stroke="#f0c040" strokeWidth={16} strokeLinecap="round" />
          <line x1={92} y1={0} x2={92} y2={34} stroke="#f0c040" strokeWidth={14} strokeLinecap="round" />
        </g>
      </g>
      <PopLabel frame={frame} at={44} x={960} y={940} text="Tên miền phải đứng tên BẠN" bg="#e63328" size={54} />
    </Frame>
  );
};

// 10) Sơ đồ tổng
export const FullPicture: React.FC<DomainProps> = ({ frame }) => {
  const step = (i: number) => easeOut(progress(frame, 6 + i * 12, 16));
  return (
    <Frame bg="#f3edfd">
      {/* người dùng */}
      <g opacity={step(0)} transform="translate(260 520)">
        <DHead cx={0} cy={0} r={70} face="happy" />
        <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
          <line x1={0} y1={70} x2={0} y2={250} />
          <path d="M 0 120 L -110 180 M 0 120 L 110 180" />
          <path d="M 0 250 L -70 390 M 0 250 L 70 390" />
        </g>
        <text x={0} y={470} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          khách
        </text>
      </g>

      {/* tên miền */}
      <g opacity={step(1)}>
        <AddressPlate x={700} y={500} scale={0.66} />
        <text x={700} y={640} fontSize={40} fontWeight={800} fill="#3a8fd6" textAnchor="middle" fontFamily={FONT}>
          địa chỉ
        </text>
      </g>

      {/* DNS */}
      <g opacity={step(2)} transform="translate(1150 500)">
        <rect x={-130} y={-110} width={260} height={220} rx={14} fill="#ffffff" stroke={INK} strokeWidth={13} />
        <text x={0} y={16} fontSize={52} fontWeight={800} fill="#8b5cf6" textAnchor="middle" fontFamily={FONT}>
          DNS
        </text>
        <text x={0} y={200} fontSize={40} fontWeight={800} fill="#8b5cf6" textAnchor="middle" fontFamily={FONT}>
          chỉ đường
        </text>
      </g>

      {/* hosting */}
      <g opacity={step(3)}>
        <House x={1620} y={640} scale={0.52} withStuff />
        <text x={1620} y={720} fontSize={40} fontWeight={800} fill="#22a04a" textAnchor="middle" fontFamily={FONT}>
          ngôi nhà
        </text>
      </g>

      <PointerArrow frame={frame} at={16} from={[420, 480]} to={[490, 480]} color={INK} width={10} curve={0} />
      <PointerArrow frame={frame} at={28} from={[920, 480]} to={[1000, 480]} color={INK} width={10} curve={0} />
      <PointerArrow frame={frame} at={40} from={[1300, 480]} to={[1420, 480]} color={INK} width={10} curve={0} />
      <PopLabel frame={frame} at={52} x={960} y={200} text="Thiếu một cái là khách không tới được" bg="#8b5cf6" size={50} />
      <PulseRing frame={frame} at={56} cx={960} cy={520} r={420} color="#8b5cf6" count={2} />
    </Frame>
  );
};
