import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { HighlightRing, PointerArrow, PopLabel, PulseRing } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

// Theme "vở nháp kỹ sư" — nền giấy kem có ô lưới mờ, nét mảnh xanh cổ vịt cho
// đường truyền dữ liệu và chú thích kỹ thuật, giữ nhân vật que nét đen dày cho
// quen mắt với các video trước. Bảng màu trầm hơn hẳn các bộ hình khác — phù hợp
// nội dung nguyên lý/kỹ thuật thay vì giải trí.
const PAPER = '#f6f1e4';
const TEAL = '#2f7f8f';
const RUST = '#b5533f';
const GOLD = '#c98a3c';
const GREEN = '#6b8a4a';
const GRID = '#dcd3ba';

export type TechProps = { frame: number; accent: string; step?: number };

// Nền giấy kỹ sư: màu kem + lưới ô vuông mờ, dùng chung cho mọi hình trong bộ này
const PaperFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ position: 'absolute', inset: 0 }}
  >
    <rect x={0} y={0} width={W} height={H} fill={PAPER} />
    <g stroke={GRID} strokeWidth={2}>
      {new Array(Math.ceil(W / 64) + 1).fill(0).map((_, i) => (
        <line key={`v${i}`} x1={i * 64} y1={0} x2={i * 64} y2={H} />
      ))}
      {new Array(Math.ceil(H / 64) + 1).fill(0).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 64} x2={W} y2={i * 64} />
      ))}
    </g>
    {children}
  </svg>
);

// Đầu nhân vật que — nét đen dày mảnh hơn bộ hình chính một chút cho hợp giấy nháp
const TechHead: React.FC<{ cx: number; cy: number; r?: number; face?: 'ok' | 'happy' | 'wonder' }> = ({
  cx,
  cy,
  r = 70,
  face = 'ok',
}) => {
  const ey = cy - r * 0.12;
  const dx = r * 0.34;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={PAPER} stroke={INK} strokeWidth={7} />
      <circle cx={cx - dx} cy={ey} r={r * 0.09} fill={INK} />
      <circle cx={cx + dx} cy={ey} r={r * 0.09} fill={INK} />
      {face === 'happy' ? (
        <path d={`M ${cx - r * 0.26} ${cy + r * 0.34} q ${r * 0.26} ${r * 0.3} ${r * 0.52} 0`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      ) : face === 'wonder' ? (
        <ellipse cx={cx} cy={cy + r * 0.44} rx={r * 0.12} ry={r * 0.15} fill={INK} />
      ) : (
        <line x1={cx - r * 0.22} y1={cy + r * 0.42} x2={cx + r * 0.22} y2={cy + r * 0.42} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      )}
    </g>
  );
};

const TechFigure: React.FC<{ x: number; y: number; scale?: number; face?: 'ok' | 'happy' | 'wonder' }> = ({
  x,
  y,
  scale = 1,
  face = 'ok',
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <TechHead cx={0} cy={0} face={face} />
    <g stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none">
      <line x1={0} y1={70} x2={0} y2={260} />
      <path d="M 0 130 L -110 180 M 0 130 L 110 180" />
      <path d="M 0 260 L -75 400 M 0 260 L 75 400" />
    </g>
  </g>
);

// Khối server — hình chữ nhật gạch chéo mảnh kiểu bản vẽ kỹ thuật
const ServerBlock: React.FC<{ x: number; y: number; w?: number; h?: number; label?: string; color?: string }> = ({
  x,
  y,
  w = 220,
  h = 280,
  label = 'SERVER',
  color = TEAL,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={PAPER} stroke={INK} strokeWidth={7} />
    <g stroke={color} strokeWidth={2.5} opacity={0.55}>
      {new Array(7).fill(0).map((_, i) => {
        const off = -h / 2 + (i * (w + h)) / 7;
        return <line key={i} x1={-w / 2} y1={-h / 2 + off} x2={-w / 2 + off} y2={-h / 2} />;
      })}
    </g>
    <text x={0} y={h / 2 + 44} fontSize={34} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT} letterSpacing={2}>
      {label}
    </text>
  </g>
);

// 1) Câu hỏi mồi: play tức thì dù máy chủ ở tận Mỹ
export const CdnQuestion: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const beam = easeOut(progress(frame, 8, 30));
  return (
    <PaperFrame>
      <TechFigure x={430} y={560} scale={1.35} face="happy" />
      {/* nút play trong khung nhỏ */}
      <g transform="translate(430 300)">
        <rect x={-90} y={-60} width={180} height={120} rx={12} fill="#ffffff" stroke={INK} strokeWidth={6} />
        <path d="M -18 -30 L 34 0 L -18 30 Z" fill={TEAL} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      </g>
      <ServerBlock x={1550} y={520} label="US SERVER" color={RUST} />
      <path
        d="M 620 480 Q 1050 380 1420 480"
        fill="none"
        stroke={TEAL}
        strokeWidth={4}
        {...drawOn(beam)}
      />
      {step === 0 ? (
        <PopLabel frame={frame} at={6} x={960} y={870} text="Máy chủ ở Mỹ — xem vẫn mượt?" bg={TEAL} size={48} />
      ) : (
        <PopLabel frame={frame} at={4} x={960} y={870} text="13.000 cây số mà nhanh vậy?" bg={RUST} size={48} />
      )}
    </PaperFrame>
  );
};

// 2) Tốc độ ánh sáng trong cáp quang
export const LightSpeed: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const travel = ((frame * 2.2) % 100) / 100;
  return (
    <PaperFrame>
      <line x1={220} y1={560} x2={1700} y2={560} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {/* hạt sáng chạy dọc sợi cáp */}
      <circle cx={220 + travel * 1480} cy={560} r={16} fill={GOLD} stroke={INK} strokeWidth={4} />
      {step === 0 ? (
        <>
          <PopLabel frame={frame} at={4} x={960} y={340} text="Dữ liệu không đi nhanh vô hạn đâu" bg={TEAL} size={44} />
          {/* đồng hồ đo độ trễ, lấp khoảng trống nửa dưới khung khi chưa vào chi tiết */}
          <g transform="translate(960 760)">
            <circle cx={0} cy={0} r={90} fill="#ffffff" stroke={INK} strokeWidth={6} />
            <line x1={0} y1={0} x2={0} y2={-62} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${(travel * 360).toFixed(1)})`} />
            <line x1={0} y1={0} x2={44} y2={0} stroke={GOLD} strokeWidth={6} strokeLinecap="round" transform={`rotate(${(travel * 100).toFixed(1)})`} />
            <circle cx={0} cy={0} r={8} fill={INK} />
          </g>
        </>
      ) : (
        <PopLabel frame={frame} at={4} x={960} y={340} text="Ánh sáng trong cáp quang" bg={TEAL} size={50} />
      )}
      {step >= 1 ? (
        <g>
          <PopLabel frame={frame} at={4} x={960} y={460} text="~200.000 km/giây" bg={GOLD} color={INK} size={62} />
        </g>
      ) : null}
      {step >= 2 ? (
        <g transform="translate(960 700)">
          <rect x={-320} y={-70} width={640} height={140} rx={16} fill="#ffffff" stroke={INK} strokeWidth={6} />
          <text x={0} y={-8} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            1.000 km ≈ 5 mili giây
          </text>
          <text x={0} y={44} fontSize={30} fontWeight={700} fill={TEAL} textAnchor="middle" fontFamily={FONT}>
            nghe nhanh — mà cộng dồn lại thì không
          </text>
        </g>
      ) : null}
    </PaperFrame>
  );
};

// 3) Bản đồ khoảng cách VN - Mỹ, đường cáp vòng qua trạm trung chuyển
export const DistanceMap: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const draw = easeOut(progress(frame, 6, 40));
  const stops = [
    [420, 620, 'Việt Nam'],
    [760, 460, 'Hồng Kông'],
    [1080, 380, 'Nhật Bản'],
    [1420, 500, 'Guam'],
    [1700, 640, 'Mỹ'],
  ] as const;
  const path = stops.map(([x, y]) => `${x} ${y}`).join(' L ');
  return (
    <PaperFrame>
      <path d={`M ${path}`} fill="none" stroke={TEAL} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" {...drawOn(draw)} />
      {stops.map(([x, y, label], i) => {
        const p = easeOut(progress(frame, 6 + i * 8, 12));
        return (
          <g key={label} opacity={p}>
            <circle cx={x} cy={y} r={16} fill={i === 0 || i === 4 ? RUST : '#ffffff'} stroke={INK} strokeWidth={5} />
            <text x={x} y={y - 34} fontSize={30} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {label}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={4} x={960} y={220} text="13.000+ km — mà không đi thẳng" bg={RUST} size={46} />
      {step >= 1 ? (
        <PopLabel frame={frame} at={4} x={960} y={900} text="Mỗi trạm trung chuyển lại cộng thêm độ trễ" bg="#ffffff" color={INK} size={40} />
      ) : null}
    </PaperFrame>
  );
};

// 4) Nỗi đau buffering — vòng xoay loading
export const BufferingPain: React.FC<TechProps> = ({ frame }) => {
  const spin = frame * 6;
  return (
    <PaperFrame>
      <TechFigure x={620} y={380} scale={1.05} face="wonder" />
      <g transform="translate(1300 460)">
        <circle cx={0} cy={0} r={80} fill="none" stroke={GRID} strokeWidth={14} />
        <path d={`M 0 -80 A 80 80 0 0 1 69 40`} fill="none" stroke={RUST} strokeWidth={14} strokeLinecap="round" transform={`rotate(${spin} 0 0)`} />
      </g>
      <PopLabel frame={frame} at={4} x={960} y={860} text="Cứ mỗi lần bấm play lại sang tận Mỹ?" bg={RUST} size={44} />
    </PaperFrame>
  );
};

// 5) Ý tưởng CDN — chép bản gần người xem
export const CacheIdea: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const move = easeOut(progress(frame, 10, 30));
  return (
    <PaperFrame>
      <ServerBlock x={1600} y={340} w={180} h={200} label="GỐC" color={RUST} />
      <g transform={`translate(${1600 - move * 900} ${340 + move * 260}) scale(${1 - move * 0.15})`}>
        <ServerBlock x={0} y={0} w={180} h={200} label="BẢN SAO" color={GREEN} />
      </g>
      <TechFigure x={420} y={760} scale={1.1} face="happy" />
      <PopLabel frame={frame} at={2} x={960} y={200} text="Đừng bắt dữ liệu đi xa nữa" bg={TEAL} size={48} />
      {step >= 1 ? (
        <PopLabel frame={frame} at={4} x={960} y={950} text="CDN — mạng phân phối nội dung" bg={GREEN} size={50} />
      ) : null}
    </PaperFrame>
  );
};

// 6) Các điểm biên CDN rải khắp thành phố
export const EdgeNodes: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const cities = [
    [420, 320, 'Hà Nội'],
    [1500, 320, 'Tokyo'],
    [420, 780, 'Sài Gòn'],
    [1500, 780, 'Singapore'],
    [960, 220, 'Seoul'],
    [960, 880, 'Jakarta'],
  ] as const;
  return (
    <PaperFrame>
      <circle cx={960} cy={550} r={26} fill={RUST} stroke={INK} strokeWidth={5} />
      <text x={960} y={620} fontSize={28} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
        máy chủ gốc
      </text>
      {cities.map(([x, y, label], i) => {
        const p = easeOut(progress(frame, 6 + i * 7, 14));
        // dừng đường nét đứt trước khi chạm khung tên thành phố, không xuyên qua chữ
        const dx = x - 960;
        const dy = y - 550;
        const dist = Math.hypot(dx, dy) || 1;
        const stopAt = Math.max(0, dist - 60);
        const ex = 960 + (dx / dist) * stopAt;
        const ey = 550 + (dy / dist) * stopAt;
        return (
          <g key={label} opacity={p}>
            <line x1={960} y1={550} x2={ex} y2={ey} stroke={TEAL} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.5} />
            <rect x={x - 46} y={y - 30} width={92} height={60} rx={8} fill="#ffffff" stroke={INK} strokeWidth={5} />
            <text x={x} y={y + 50} fontSize={26} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {label}
            </text>
          </g>
        );
      })}
      {step >= 1 ? (
        <PopLabel frame={frame} at={4} x={960} y={140} text="Mỗi điểm gọi là một điểm biên (edge)" bg={TEAL} size={44} />
      ) : (
        <PopLabel frame={frame} at={4} x={960} y={140} text="Hàng trăm máy chủ khắp thế giới" bg={TEAL} size={44} />
      )}
    </PaperFrame>
  );
};

// 7) Google Global Cache nằm ngay trong ISP
export const GgcInsideIsp: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const isps = ['Viettel', 'VNPT', 'FPT'];
  return (
    <PaperFrame>
      <g transform="translate(960 260)">
        <rect x={-420} y={-70} width={840} height={140} rx={16} fill="#ffffff" stroke={INK} strokeWidth={7} />
        <text x={0} y={12} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          Google Global Cache
        </text>
      </g>
      {isps.map((name, i) => {
        const p = easeOut(progress(frame, 8 + i * 10, 16));
        const x = 420 + i * 540;
        return (
          <g key={name} opacity={p}>
            <line x1={960} y1={330} x2={x} y2={560} stroke={TEAL} strokeWidth={3} />
            {p > 0.85 ? <PulseRing frame={frame} at={8 + i * 10 + 14} cx={x} cy={670} r={90} color={GOLD} count={1} /> : null}
            <rect x={x - 160} y={560} width={320} height={220} rx={14} fill={PAPER} stroke={INK} strokeWidth={7} />
            <text x={x} y={640} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {name}
            </text>
            <text x={x} y={690} fontSize={26} fontWeight={700} fill={TEAL} textAnchor="middle" fontFamily={FONT}>
              mạng nội bộ
            </text>
          </g>
        );
      })}
      {step >= 1 ? (
        <PopLabel frame={frame} at={4} x={960} y={960} text="Video chưa từng rời khỏi Việt Nam" bg={GREEN} size={48} />
      ) : null}
    </PaperFrame>
  );
};

// 8) Đứt cáp quang biển — VN vẫn xem được YouTube
export const CableCut: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const flash = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.2));
  const cables = [
    [500, 620],
    [700, 560],
    [900, 600],
    [1100, 560],
    [1300, 620],
  ] as const;
  return (
    <PaperFrame>
      {/* bờ biển trái phải */}
      <rect x={0} y={520} width={300} height={400} fill="#e8dfc4" stroke={INK} strokeWidth={6} />
      <text x={190} y={960} fontSize={30} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
        Việt Nam
      </text>
      <rect x={1620} y={520} width={300} height={400} fill="#e8dfc4" stroke={INK} strokeWidth={6} />
      <text x={1730} y={960} fontSize={30} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
        Thế giới
      </text>
      {cables.map(([x, y], i) => {
        const cut = i < 4; // 4/5 tuyến đứt
        const p = easeOut(progress(frame, 4 + i * 6, 10));
        return (
          <g key={i} opacity={p}>
            <path d={`M 300 ${520 + i * 22} Q 960 ${400 + i * 30} 1620 ${520 + i * 22}`} fill="none" stroke={cut ? RUST : GREEN} strokeWidth={5} strokeDasharray={cut ? '2 2' : 'none'} />
            {cut ? (
              <g transform={`translate(960 ${400 + i * 30 + 6})`} opacity={i === 1 ? flash : 0.85}>
                <line x1={-22} y1={-22} x2={22} y2={22} stroke={RUST} strokeWidth={9} strokeLinecap="round" />
                <line x1={-22} y1={22} x2={22} y2={-22} stroke={RUST} strokeWidth={9} strokeLinecap="round" />
              </g>
            ) : null}
          </g>
        );
      })}
      {step === 0 ? (
        <PopLabel frame={frame} at={30} x={960} y={220} text="5 tuyến cáp biển nối Việt Nam ra thế giới" bg={TEAL} size={42} />
      ) : step === 1 ? (
        <PopLabel frame={frame} at={4} x={960} y={220} text="Có lúc 4/5 tuyến cùng gặp sự cố" bg={RUST} size={46} />
      ) : (
        <PopLabel frame={frame} at={4} x={960} y={220} text="YouTube vẫn xem ngon lành!" bg={GREEN} size={48} />
      )}
    </PaperFrame>
  );
};

// 9) Trúng cache / trượt cache
export const CacheHitMiss: React.FC<TechProps> = ({ frame, step = 0 }) => {
  // step 0 (chưa có nội dung) và step 1 (đang đi lấy, lời đọc nói "chậm") đều là
  // trạng thái trượt cache. Chỉ step 2 mới chuyển sang trúng cache — nhanh.
  const miss = step < 2;
  const travel = easeOut(progress(frame, 6, 30));
  return (
    <PaperFrame>
      <TechFigure x={420} y={620} scale={1.1} face={miss ? 'wonder' : 'happy'} />
      <ServerBlock x={960} y={460} w={170} h={190} label="BIÊN" color={TEAL} />
      <ServerBlock x={1650} y={620} w={170} h={190} label="GỐC" color={RUST} />
      {miss ? (
        <g opacity={travel}>
          <path d="M 1130 460 Q 1400 500 1560 600" fill="none" stroke={RUST} strokeWidth={4} strokeDasharray="10 8" />
          {step === 0 ? (
            <PopLabel frame={frame} at={20} x={960} y={220} text="Máy gần bạn chưa có nội dung này" bg={RUST} size={42} />
          ) : (
            <PopLabel frame={frame} at={4} x={960} y={220} text="Lần đầu — phải đi lấy tận máy gốc, chậm" bg={RUST} size={40} />
          )}
        </g>
      ) : (
        <g>
          <path d="M 620 600 Q 780 520 870 480" fill="none" stroke={GREEN} strokeWidth={4} />
          <PopLabel frame={frame} at={4} x={960} y={220} text="Lần sau — trúng cache, nhanh liền" bg={GREEN} size={44} />
        </g>
      )}
    </PaperFrame>
  );
};

// 10) Bài toán xoá cache khi nội dung đổi
export const CacheInvalidation: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const swap = easeOut(progress(frame, 20, 20));
  return (
    <PaperFrame>
      <ServerBlock x={480} y={500} w={200} h={220} label="MÁY GỐC" color={GREEN} />
      <ServerBlock x={1440} y={500} w={200} h={220} label="MÁY BIÊN" color={TEAL} />
      {/* ảnh mới trên máy gốc */}
      <g transform="translate(480 500)">
        <rect x={-70} y={-40} width={140} height={100} rx={8} fill={GREEN} opacity={0.85} />
        <text x={0} y={90} fontSize={26} fontWeight={700} fill={GREEN} textAnchor="middle" fontFamily={FONT}>
          bản mới
        </text>
      </g>
      {/* ảnh cũ trên máy biên, không đổi */}
      <g transform="translate(1440 500)" opacity={1 - swap * 0.15}>
        <rect x={-70} y={-40} width={140} height={100} rx={8} fill={swap > 0.5 ? GOLD : RUST} opacity={0.85} />
        <text x={0} y={90} fontSize={26} fontWeight={700} fill={swap > 0.5 ? GOLD : RUST} textAnchor="middle" fontFamily={FONT}>
          {swap > 0.5 ? 'đang xoá…' : 'vẫn là bản cũ'}
        </text>
      </g>
      <TechFigure x={1440} y={840} scale={0.9} face="wonder" />
      {step === 0 ? (
        <PopLabel frame={frame} at={4} x={960} y={220} text="Nội dung đổi rồi — chuyện gì xảy ra?" bg={GOLD} color={INK} size={42} />
      ) : step === 1 ? (
        <PopLabel frame={frame} at={2} x={960} y={220} text="Người dùng vẫn thấy bản cũ ở máy biên" bg={RUST} size={40} />
      ) : (
        <PopLabel frame={frame} at={2} x={960} y={220} text="Cần: thời gian sống + lệnh xoá cache khẩn" bg={TEAL} size={40} />
      )}
    </PaperFrame>
  );
};

// 11) Tổng kết: CDN rút ngắn khoảng cách, không bẻ cong vật lý
export const SummaryCdn: React.FC<TechProps> = ({ frame, step = 0 }) => {
  const p = easeOut(progress(frame, 8, 30));
  return (
    <PaperFrame>
      <line x1={260} y1={500} x2={1660} y2={500} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <text x={260} y={460} fontSize={30} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
        xa
      </text>
      <text x={1660} y={460} fontSize={30} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
        gần
      </text>
      <circle cx={260 + p * 1000} cy={500} r={18} fill={GOLD} stroke={INK} strokeWidth={5} />
      {step === 0 ? (
        <>
          <PopLabel frame={frame} at={2} x={960} y={280} text="CDN không làm dữ liệu đi nhanh hơn" bg={RUST} size={46} />
          <PopLabel frame={frame} at={26} x={960} y={720} text="Nó làm dữ liệu phải đi ÍT HƠN" bg={GREEN} size={56} />
        </>
      ) : (
        <PopLabel frame={frame} at={2} x={960} y={500} text="Khoảng cách thì RÚT NGẮN được" bg={TEAL} size={54} />
      )}
      <TechFigure x={960} y={880} scale={1} face="happy" />
    </PaperFrame>
  );
};
