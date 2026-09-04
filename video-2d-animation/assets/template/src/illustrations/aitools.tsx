import React from 'react';
import { INK, drawOn, easeOut, progress, seeded, wobble } from './anim';
import { CheckMark, CrossOut, HighlightRing, PointerArrow, PopLabel, PulseRing } from './fx';

const W = 1920;
const H = 1080;
const FONT = '"Comic Sans MS", Inter, sans-serif';

export type AiProps = { frame: number; accent: string };

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

const AHead: React.FC<{ cx: number; cy: number; r?: number; face?: 'ok' | 'lost' | 'happy' }> = ({
  cx,
  cy,
  r = 76,
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
        <ellipse cx={cx} cy={cy + r * 0.46} rx={r * 0.16} ry={r * 0.2} fill={INK} />
      ) : face === 'happy' ? (
        <path d={`M ${cx - r * 0.28} ${cy + r * 0.34} q ${r * 0.28} ${r * 0.34} ${r * 0.56} 0`} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      ) : (
        <line x1={cx - r * 0.24} y1={cy + r * 0.44} x2={cx + r * 0.24} y2={cy + r * 0.44} stroke={INK} strokeWidth={7} strokeLinecap="round" />
      )}
    </g>
  );
};

// Thẻ tên công cụ — dùng chữ trong khung, không mô phỏng logo thương hiệu
const ToolChip: React.FC<{
  x: number;
  y: number;
  label: string;
  color?: string;
  size?: number;
  textColor?: string;
}> = ({ x, y, label, color = '#ffffff', size = 40, textColor = INK }) => {
  const w = label.length * size * 0.62 + 44;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-size * 0.9} width={w} height={size * 1.8} rx={12} fill={color} stroke={INK} strokeWidth={9} />
      <text x={0} y={size * 0.32} fontSize={size} fontWeight={800} fill={textColor} textAnchor="middle" fontFamily={FONT}>
        {label}
      </text>
    </g>
  );
};

// 1) Rừng công cụ — người choáng ngợp
export const AiToolJungle: React.FC<AiProps> = ({ frame }) => {
  const tools = ['ChatGPT', 'Gemini', 'Claude', 'DeepSeek', 'Grok', 'Canva', 'Kling', 'Veo', 'Lovable', 'Framer', 'Runway', 'Magnific', 'Kimi', 'OpenClaw'];
  return (
    <Frame bg="#f3edfd">
      {tools.map((t, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = 320 + col * 340 + (row % 2) * 60;
        const y = 240 + row * 220 + wobble(frame, 0.08 + i * 0.006, 14, i);
        const p = easeOut(progress(frame, 2 + i * 2, 12));
        if (p <= 0) return null;
        return (
          <g key={t} opacity={p} transform={`rotate(${(seeded(i) - 0.5) * 10} ${x} ${y})`}>
            <ToolChip
              x={x}
              y={y}
              label={t}
              color={['#8ec7e8', '#8fd694', '#ffd23f', '#f0a3c0', '#c9b6f7'][i % 5]}
              size={36}
            />
          </g>
        );
      })}
      {/* người choáng ngợp ở dưới */}
      <g transform="translate(960 880)">
        <AHead cx={0} cy={0} r={82} face="lost" />
        <g stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none">
          <line x1={0} y1={82} x2={0} y2={200} />
          <path d="M 0 120 L -150 40 M 0 120 L 150 40" />
        </g>
      </g>
      <PopLabel frame={frame} at={44} x={960} y={1030} text="Chọn cái nào bây giờ?" bg="#e63328" size={50} />
    </Frame>
  );
};

// 2) Chọn theo việc, không theo tên
export const PickByJob: React.FC<AiProps> = ({ frame }) => {
  const jobs: [string, string][] = [
    ['Hỏi đáp, viết', '#3a8fd6'],
    ['Làm ảnh', '#f0a3c0'],
    ['Làm video', '#22a04a'],
    ['Làm web', '#f5a623'],
    ['Tự động hoá', '#8b5cf6'],
  ];
  return (
    <Frame bg="#eafbef">
      <PopLabel frame={frame} at={2} x={960} y={180} text="Chọn theo VIỆC, không theo tên" bg="#22a04a" size={54} />
      {jobs.map(([label, color], i) => {
        const p = easeOut(progress(frame, 10 + i * 8, 14));
        const x = 280 + i * 340;
        return (
          <g key={label} opacity={p} transform={`translate(${x} 560) scale(${0.8 + p * 0.2})`}>
            <circle cx={0} cy={0} r={120} fill={color} stroke={INK} strokeWidth={13} />
            <text x={0} y={16} fontSize={70} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
              {i + 1}
            </text>
            <text x={0} y={200} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {label}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={56} x={960} y={900} text="5 nhóm việc" bg="#ffffff" color={INK} size={46} />
    </Frame>
  );
};

// 3) Biểu đồ lượt truy cập chatbot
export const ChatbotLineup: React.FC<AiProps> = ({ frame }) => {
  const data: [string, number, string][] = [
    ['ChatGPT', 5.3, '#22a04a'],
    ['Gemini', 1.1, '#3a8fd6'],
    ['Claude', 0.97, '#f5a623'],
    ['DeepSeek', 0.32, '#8b5cf6'],
  ];
  const maxV = 5.3;
  const baseY = 830;
  const maxH = 520;
  return (
    <Frame bg="#eef6fb">
      <PopLabel frame={frame} at={2} x={960} y={140} text="Lượt truy cập mỗi tháng" bg="#3a8fd6" size={50} />
      <line x1={220} y1={baseY} x2={1700} y2={baseY} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      {data.map(([name, v, color], i) => {
        const p = easeOut(progress(frame, 8 + i * 10, 22));
        const h = (v / maxV) * maxH * p;
        const x = 380 + i * 330;
        return (
          <g key={name}>
            <rect x={x - 100} y={baseY - h} width={200} height={h} rx={10} fill={color} stroke={INK} strokeWidth={11} />
            {p > 0.9 ? (
              <text x={x} y={baseY - h - 28} fontSize={46} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
                {v >= 1 ? `${v} tỷ` : `${Math.round(v * 1000)} tr`}
              </text>
            ) : null}
            <text x={x} y={baseY + 62} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {name}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={50} x={1300} y={330} text="Nhiều hơn 14 công cụ sau cộng lại" bg="#e63328" size={40} />
      <PopLabel frame={frame} at={62} x={960} y={990} text="Số liệu tháng 6/2026 — chỉ tính truy cập web" bg="#8a97a8" size={34} />
    </Frame>
  );
};

// 4) Ai giỏi việc gì
export const ChatbotStrengths: React.FC<AiProps> = ({ frame }) => {
  const rows: [string, string, string][] = [
    ['Viết dài, phân tích', 'Claude', '#f5a623'],
    ['Tin mới thời gian thực', 'Grok', '#8b5cf6'],
    ['Ảnh + video, giá mềm', 'Gemini Flash', '#3a8fd6'],
    ['Rẻ nhất', 'DeepSeek / GLM', '#22a04a'],
    ['Chạy trên máy mình', 'Kimi K3 (mã nguồn mở)', '#e63328'],
  ];
  return (
    <Frame bg="#fdf3e0">
      <PopLabel frame={frame} at={2} x={960} y={130} text="Mỗi cái mạnh một kiểu" bg="#f5a623" color={INK} size={50} />
      {rows.map(([job, tool, color], i) => {
        const p = easeOut(progress(frame, 8 + i * 9, 14));
        const y = 300 + i * 150;
        return (
          <g key={job} opacity={p}>
            <rect x={200} y={y - 54} width={620} height={108} rx={14} fill="#ffffff" stroke={INK} strokeWidth={11} />
            <text x={510} y={y + 14} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {job}
            </text>
            <g stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none">
              <line x1={840} y1={y} x2={980} y2={y} />
              <path d={`M 980 ${y} l -40 -24 M 980 ${y} l -40 24`} />
            </g>
            <rect x={1010} y={y - 54} width={700} height={108} rx={14} fill={color} stroke={INK} strokeWidth={11} />
            <text x={1360} y={y + 14} fontSize={40} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
              {tool}
            </text>
          </g>
        );
      })}
    </Frame>
  );
};

// 5) Công cụ ảnh — Canva và nâng nét
export const ImageTools: React.FC<AiProps> = ({ frame }) => {
  const sharp = easeOut(progress(frame, 26, 30));
  return (
    <Frame bg="#fdeef3">
      {/* Canva: nhiều mẫu thiết kế */}
      <g transform="translate(520 520)">
        <ToolChip x={0} y={-330} label="Canva" color="#f0a3c0" size={52} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} opacity={easeOut(progress(frame, 6 + i * 6, 12))}>
            <rect
              x={-230 + (i % 2) * 240}
              y={-190 + Math.floor(i / 2) * 220}
              width={200}
              height={180}
              rx={12}
              fill={['#8ec7e8', '#8fd694', '#ffd23f', '#c9b6f7'][i]}
              stroke={INK}
              strokeWidth={11}
            />
          </g>
        ))}
        <text x={0} y={330} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          760 triệu lượt / tháng
        </text>
      </g>

      {/* Magnific: ảnh mờ thành nét */}
      <g transform="translate(1420 520)">
        <ToolChip x={0} y={-330} label="Nâng nét ảnh" color="#e63328" size={48} textColor="#ffffff" />
        {/* ảnh mờ bên trái */}
        <g transform="translate(-150 0)">
          <rect x={-130} y={-130} width={260} height={260} rx={12} fill="#c9d3e2" stroke={INK} strokeWidth={11} />
          <circle cx={-40} cy={-50} r={34} fill="#b0bccb" />
          <path d="M -110 90 L -20 -10 L 40 60 L 80 20 L 120 90 Z" fill="#a6b3c4" />
        </g>
        {/* ảnh nét bên phải */}
        <g transform="translate(150 0)" opacity={sharp}>
          <rect x={-130} y={-130} width={260} height={260} rx={12} fill="#8ec7e8" stroke={INK} strokeWidth={11} />
          <circle cx={-40} cy={-50} r={34} fill="#ffd23f" stroke={INK} strokeWidth={8} />
          <path d="M -110 90 L -20 -10 L 40 60 L 80 20 L 120 90 Z" fill="#8fd694" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        </g>
        <PointerArrow frame={frame} at={24} from={[-10, 0]} to={[10, 0]} color={INK} width={10} curve={0} />
        <text x={0} y={330} fontSize={40} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          117 triệu lượt / tháng
        </text>
      </g>
      <PopLabel frame={frame} at={56} x={1420} y={950} text="Chỉ làm mỗi một việc!" bg="#e63328" size={44} />
    </Frame>
  );
};

// 6) Bảng giá công cụ video
export const VideoToolsPrice: React.FC<AiProps> = ({ frame }) => {
  const rows: [string, string, string][] = [
    ['Kling 3.0', '~0,10 $/giây', '#22a04a'],
    ['Veo 3.1 (fast)', 'từ 0,15 $/giây', '#3a8fd6'],
    ['Runway Gen-4.5', 'mạnh kiểm soát', '#8b5cf6'],
  ];
  return (
    <Frame bg="#eafbef">
      <PopLabel frame={frame} at={2} x={960} y={150} text="Giá thật cho mỗi giây video" bg="#22a04a" size={52} />
      {rows.map(([name, price, color], i) => {
        const p = easeOut(progress(frame, 10 + i * 11, 16));
        const y = 360 + i * 170;
        return (
          <g key={name} opacity={p} transform={`translate(${(1 - p) * -80} 0)`}>
            <rect x={340} y={y - 62} width={560} height={124} rx={14} fill={color} stroke={INK} strokeWidth={12} />
            <text x={620} y={y + 16} fontSize={46} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
              {name}
            </text>
            <rect x={940} y={y - 62} width={640} height={124} rx={14} fill="#ffffff" stroke={INK} strokeWidth={12} />
            <text x={1260} y={y + 16} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {price}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={52} x={960} y={930} text="Miễn phí không logo chìm: Runway · InVideo · Kling cơ bản" bg="#f5a623" color={INK} size={38} />
    </Frame>
  );
};

// 7) Sora bị khai tử
export const SoraDeprecated: React.FC<AiProps> = ({ frame }) => {
  const fade = 1 - easeOut(progress(frame, 20, 26));
  return (
    <Frame bg="#fdeeea">
      {/* thẻ công cụ bị gạch bỏ */}
      <g transform="translate(700 480)" opacity={0.35 + fade * 0.65}>
        <rect x={-280} y={-160} width={560} height={320} rx={20} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <text x={0} y={-30} fontSize={78} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          Sora 2
        </text>
        <text x={0} y={60} fontSize={40} fontWeight={700} fill="#8a97a8" textAnchor="middle" fontFamily={FONT}>
          tạo video
        </text>
      </g>
      <CrossOut frame={frame} at={16} x={700} y={480} size={420} />
      <PopLabel frame={frame} at={40} x={700} y={800} text="Khai tử tháng 4/2026" bg="#e63328" size={52} />

      {/* bài học bên phải */}
      <g transform="translate(1450 480)">
        <rect x={-330} y={-230} width={660} height={460} rx={18} fill="#ffffff" stroke={INK} strokeWidth={14} />
        <text x={0} y={-140} fontSize={48} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          BÀI HỌC
        </text>
        <text x={0} y={-30} fontSize={40} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
          Đừng dựng cả
        </text>
        <text x={0} y={40} fontSize={40} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
          dây chuyền lên
        </text>
        <text x={0} y={110} fontSize={44} fontWeight={800} fill="#e63328" textAnchor="middle" fontFamily={FONT}>
          một công cụ
        </text>
      </g>
      <PulseRing frame={frame} at={44} cx={1450} cy={480} r={380} color="#e63328" count={2} />
    </Frame>
  );
};

// 8) Ba làn công cụ làm web
export const WebBuilderLanes: React.FC<AiProps> = ({ frame }) => {
  const lanes: [string, string[], string][] = [
    ['Thiên thiết kế', ['Framer', 'Webflow'], '#8b5cf6'],
    ['Trọn gói doanh nghiệp', ['Wix', 'Hostinger', 'Durable', '10Web'], '#f5a623'],
    ['Thiên code', ['v0', 'Lovable', 'Bolt'], '#22a04a'],
  ];
  return (
    <Frame bg="#eef6fb">
      <PopLabel frame={frame} at={2} x={960} y={130} text="Công cụ làm web: 3 làn" bg="#3a8fd6" size={52} />
      {lanes.map(([title, tools, color], i) => {
        const p = easeOut(progress(frame, 8 + i * 12, 16));
        const y = 320 + i * 240;
        return (
          <g key={title} opacity={p}>
            {/* làn đường */}
            <rect x={160} y={y - 90} width={1600} height={180} rx={20} fill="#ffffff" stroke={INK} strokeWidth={12} />
            <rect x={160} y={y - 90} width={430} height={180} rx={20} fill={color} stroke={INK} strokeWidth={12} />
            <text x={375} y={y + 14} fontSize={38} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
              {title}
            </text>
            {tools.map((t, k) => (
              <ToolChip key={t} x={720 + k * 260} y={y} label={t} color="#eef2f6" size={34} />
            ))}
          </g>
        );
      })}
      <PopLabel frame={frame} at={54} x={960} y={1010} text="v0 xuất Next.js render sẵn — tốt cho SEO" bg="#22a04a" size={40} />
    </Frame>
  );
};

// 9) Chatbot khác agent
export const AiAgentNew: React.FC<AiProps> = ({ frame }) => {
  const a = easeOut(progress(frame, 4, 16));
  const b = easeOut(progress(frame, 24, 16));
  return (
    <Frame bg="#f3edfd">
      <line x1={960} y1={140} x2={960} y2={960} stroke={INK} strokeWidth={10} strokeDasharray="26 20" />
      {/* chatbot: chỉ trả lời */}
      <g opacity={a}>
        <PopLabel frame={frame} at={6} x={480} y={220} text="CHATBOT" bg="#8a97a8" size={54} />
        <AHead cx={480} cy={480} r={90} />
        <g transform="translate(480 700)">
          <ellipse cx={0} cy={0} rx={230} ry={110} fill="#ffffff" stroke={INK} strokeWidth={12} />
          <path d="M -60 -96 L -30 -160 L 20 -92 Z" fill="#ffffff" stroke={INK} strokeWidth={12} strokeLinejoin="round" />
          <text x={0} y={16} fontSize={44} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
            trả lời bạn
          </text>
        </g>
      </g>
      {/* agent: tự làm */}
      <g opacity={b}>
        <PopLabel frame={frame} at={26} x={1440} y={220} text="AGENT" bg="#8b5cf6" size={54} />
        <AHead cx={1440} cy={440} r={90} face="happy" />
        {/* các việc agent tự làm */}
        {['mở file', 'chạy lệnh', 'gửi tin', 'nhớ việc cũ'].map((t, i) => {
          const p = easeOut(progress(frame, 30 + i * 7, 12));
          const x = 1180 + (i % 2) * 520;
          const y = 680 + Math.floor(i / 2) * 130;
          return <g key={t} opacity={p}><ToolChip x={x} y={y} label={t} color="#c9b6f7" size={36} /></g>;
        })}
        <g stroke="#8b5cf6" strokeWidth={11} strokeLinecap="round" fill="none" opacity={b}>
          {[-1, 1].map((s) => (
            <path key={s} d={`M ${1440 + s * 60} 540 L ${1440 + s * 220} 630`} />
          ))}
        </g>
      </g>
    </Frame>
  );
};

// 10) Số sao GitHub của agent mã nguồn mở
export const AgentStars: React.FC<AiProps> = ({ frame }) => {
  const grow1 = easeOut(progress(frame, 8, 26));
  const grow2 = easeOut(progress(frame, 26, 26));
  const Star: React.FC<{ x: number; y: number; s?: number; delay: number }> = ({ x, y, s = 1, delay }) => {
    const p = easeOut(progress(frame, delay, 12));
    const pts = new Array(5).fill(0).map((_, i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const a2 = a + Math.PI / 5;
      return `${x + Math.cos(a) * 46 * s} ${y + Math.sin(a) * 46 * s} L ${x + Math.cos(a2) * 20 * s} ${y + Math.sin(a2) * 20 * s}`;
    });
    return <path d={`M ${pts.join(' L ')} Z`} fill="#ffd23f" stroke={INK} strokeWidth={7} strokeLinejoin="round" opacity={p} />;
  };
  return (
    <Frame bg="#eafbef">
      <PopLabel frame={frame} at={2} x={960} y={140} text="Agent mã nguồn mở — miễn phí" bg="#22a04a" size={50} />
      {/* OpenClaw */}
      <g>
        <ToolChip x={560} y={330} label="OpenClaw" color="#8b5cf6" size={50} textColor="#ffffff" />
        <text x={560} y={520} fontSize={92} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          {Math.round(310 * grow1)}K
        </text>
        <text x={560} y={590} fontSize={40} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
          sao GitHub
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} x={400 + i * 80} y={690} delay={12 + i * 4} />
        ))}
      </g>
      {/* Hermes */}
      <g>
        <ToolChip x={1400} y={330} label="Hermes" color="#3a8fd6" size={50} textColor="#ffffff" />
        <text x={1400} y={520} fontSize={92} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          {Math.round(95 * grow2)}K
        </text>
        <text x={1400} y={590} fontSize={40} fontWeight={700} fill={INK} textAnchor="middle" fontFamily={FONT}>
          chỉ sau 7 tuần
        </text>
        {[0, 1, 2, 3].map((i) => (
          <Star key={i} x={1280 + i * 80} y={690} delay={30 + i * 4} />
        ))}
      </g>
      <PopLabel frame={frame} at={56} x={960} y={900} text="Chạy ngay trên máy bạn" bg="#ffffff" color={INK} size={46} />
    </Frame>
  );
};

// 11) Cảnh báo bảo mật khi dùng agent
export const AgentSecurityWarning: React.FC<AiProps> = ({ frame }) => {
  const shake = wobble(frame, 0.7, 6);
  const items = ['đọc file', 'chạy lệnh', 'vào tin nhắn', 'mở trình duyệt'];
  return (
    <Frame bg="#fdeeea">
      {/* tam giác cảnh báo */}
      <g transform={`translate(${560 + shake} 480)`}>
        <path d="M 0 -230 L 230 190 L -230 190 Z" fill="#ffd23f" stroke={INK} strokeWidth={16} strokeLinejoin="round" />
        <rect x={-22} y={-110} width={44} height={190} rx={12} fill={INK} />
        <circle cx={0} cy={130} r={26} fill={INK} />
      </g>
      {/* danh sách quyền truy cập */}
      {items.map((t, i) => {
        const p = easeOut(progress(frame, 10 + i * 9, 14));
        return (
          <g key={t} opacity={p}>
            <ToolChip x={1420} y={300 + i * 130} label={t} color="#ffffff" size={40} />
          </g>
        );
      })}
      <PopLabel frame={frame} at={4} x={560} y={840} text="Agent chạy trên máy bạn" bg="#e63328" size={48} />
      <PopLabel frame={frame} at={52} x={1420} y={880} text="Đừng cài bừa lên máy chứa dữ liệu công việc" bg="#e63328" size={40} />
    </Frame>
  );
};

// 12) Bảng chọn nhanh
export const DecisionTable: React.FC<AiProps> = ({ frame }) => {
  const rows: [string, string, string][] = [
    ['Viết · phân tích', 'Claude', '#f5a623'],
    ['Tin mới', 'Grok', '#8b5cf6'],
    ['Ảnh · video giá mềm', 'Gemini', '#3a8fd6'],
    ['Rẻ nhất', 'DeepSeek', '#22a04a'],
    ['Thiết kế', 'Canva', '#f0a3c0'],
    ['Tạo video', 'Kling · Veo', '#e63328'],
    ['Làm web', 'Framer · Lovable', '#5fc9e8'],
    ['Tự động hoá', 'OpenClaw', '#8b5cf6'],
  ];
  return (
    <Frame bg="#eef6fb">
      <PopLabel frame={frame} at={2} x={960} y={110} text="Bảng chọn nhanh" bg="#3a8fd6" size={52} />
      {rows.map(([job, tool, color], i) => {
        const p = easeOut(progress(frame, 6 + i * 6, 12));
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 200 + col * 850;
        const y = 300 + row * 180;
        return (
          <g key={job} opacity={p}>
            <rect x={x} y={y - 58} width={380} height={116} rx={14} fill="#ffffff" stroke={INK} strokeWidth={11} />
            <text x={x + 190} y={y + 14} fontSize={34} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
              {job}
            </text>
            <rect x={x + 400} y={y - 58} width={360} height={116} rx={14} fill={color} stroke={INK} strokeWidth={11} />
            <text x={x + 580} y={y + 14} fontSize={32} fontWeight={800} fill="#ffffff" textAnchor="middle" fontFamily={FONT}>
              {tool}
            </text>
          </g>
        );
      })}
      <PopLabel frame={frame} at={60} x={960} y={1020} text="Ảnh chụp tháng 9/2026 — xếp hạng đổi liên tục" bg="#8a97a8" size={36} />
    </Frame>
  );
};
