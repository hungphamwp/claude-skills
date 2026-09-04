import React from 'react';
import { INK, drawOn, easeOut, progress } from './anim';

const FONT = '"Comic Sans MS", Inter, sans-serif';

// Bộ hiệu ứng giải thích, dùng bên trong các hình minh hoạ.
// Video không còn khung phụ đề ở đáy khung, nên chính hình phải nói hộ:
// nhãn bật ra đúng chỗ, mũi tên chỉ vào đúng vật, vòng nhấn hút mắt,
// số đếm tăng dần cho người xem kịp đọc.

// Nhãn chữ bật ra tại chỗ — thay cho phụ đề, đặt ngay cạnh thứ nó nói tới
export const PopLabel: React.FC<{
  frame: number;
  at: number; // frame bắt đầu hiện
  x: number;
  y: number;
  text: string;
  color?: string;
  bg?: string;
  size?: number;
  anchor?: 'middle' | 'start' | 'end';
}> = ({ frame, at, x, y, text, color = '#ffffff', bg = INK, size = 46, anchor = 'middle' }) => {
  const p = easeOut(progress(frame, at, 12));
  if (p <= 0) return null;
  const w = text.length * size * 0.62 + 46;
  const h = size * 1.75;
  const ox = anchor === 'middle' ? -w / 2 : anchor === 'end' ? -w : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.7 + p * 0.3})`} opacity={p}>
      <rect x={ox} y={-h / 2} width={w} height={h} rx={14} fill={bg} stroke={INK} strokeWidth={7} />
      <text
        x={anchor === 'middle' ? 0 : anchor === 'end' ? -w / 2 : w / 2}
        y={size * 0.36}
        fontSize={size}
        fontWeight={800}
        fill={color}
        textAnchor="middle"
        fontFamily={FONT}
      >
        {text}
      </text>
    </g>
  );
};

// Mũi tên vẽ dần chỉ vào một điểm — dẫn mắt người xem tới đúng chỗ cần nhìn
export const PointerArrow: React.FC<{
  frame: number;
  at: number;
  from: [number, number];
  to: [number, number];
  color?: string;
  width?: number;
  curve?: number; // độ cong, 0 là thẳng
}> = ({ frame, at, from, to, color = '#e63328', width = 13, curve = 0.25 }) => {
  const p = easeOut(progress(frame, at, 16));
  if (p <= 0) return null;
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * curve;
  const my = (y1 + y2) / 2 + (x2 - x1) * curve;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const head = 42;
  return (
    <g stroke={color} strokeWidth={width} fill="none" strokeLinecap="round">
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} {...drawOn(p)} />
      {p > 0.88 ? (
        <path
          d={`M ${x2} ${y2} L ${x2 - Math.cos(ang - 0.45) * head} ${y2 - Math.sin(ang - 0.45) * head}
              M ${x2} ${y2} L ${x2 - Math.cos(ang + 0.45) * head} ${y2 - Math.sin(ang + 0.45) * head}`}
        />
      ) : null}
    </g>
  );
};

// Vòng tròn nét đứt xoay khoanh vùng — hút mắt vào chi tiết quan trọng
export const HighlightRing: React.FC<{
  frame: number;
  at: number;
  cx: number;
  cy: number;
  r: number;
  color?: string;
}> = ({ frame, at, cx, cy, r, color = '#e63328' }) => {
  const p = easeOut(progress(frame, at, 18));
  if (p <= 0) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r * (0.75 + p * 0.25)}
      fill="none"
      stroke={color}
      strokeWidth={12}
      strokeDasharray="34 26"
      strokeLinecap="round"
      opacity={p}
      transform={`rotate(${frame * 0.6} ${cx} ${cy})`}
    />
  );
};

// Vòng sáng lan toả rồi tan — nhấn khoảnh khắc "chính là chỗ này"
export const PulseRing: React.FC<{
  frame: number;
  at: number;
  cx: number;
  cy: number;
  r?: number;
  color?: string;
  count?: number;
}> = ({ frame, at, cx, cy, r = 200, color = '#e63328', count = 3 }) => (
  <g>
    {new Array(count).fill(0).map((_, i) => {
      const t = progress(frame, at + i * 14, 40);
      if (t <= 0 || t >= 1) return null;
      return (
        <circle key={i} cx={cx} cy={cy} r={r * t} fill="none" stroke={color} strokeWidth={10} opacity={1 - t} />
      );
    })}
  </g>
);

// Số đếm tăng dần — người xem thấy con số "chạy" thì nhớ lâu hơn số đứng yên
export const CountUp: React.FC<{
  frame: number;
  at: number;
  x: number;
  y: number;
  to: number;
  suffix?: string;
  color?: string;
  size?: number;
  duration?: number;
}> = ({ frame, at, x, y, to, suffix = '', color = INK, size = 90, duration = 30 }) => {
  const p = easeOut(progress(frame, at, duration));
  if (p <= 0) return null;
  return (
    <text x={x} y={y} fontSize={size} fontWeight={800} fill={color} textAnchor="middle" fontFamily={FONT}>
      {Math.round(to * p)}
      {suffix}
    </text>
  );
};

// Dấu X đỏ gạch chéo — báo "cái này sai / đừng làm"
export const CrossOut: React.FC<{
  frame: number;
  at: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
}> = ({ frame, at, x, y, size = 300, color = '#e63328' }) => {
  const p1 = easeOut(progress(frame, at, 12));
  const p2 = easeOut(progress(frame, at + 8, 12));
  const h = size / 2;
  return (
    <g stroke={color} strokeWidth={22} strokeLinecap="round" fill="none">
      <line x1={x - h} y1={y - h} x2={x + h} y2={y + h} {...drawOn(p1)} />
      <line x1={x + h} y1={y - h} x2={x - h} y2={y + h} {...drawOn(p2)} />
    </g>
  );
};

// Dấu tích xanh — báo "cái này đúng / nên làm"
export const CheckMark: React.FC<{
  frame: number;
  at: number;
  x: number;
  y: number;
  size?: number;
  color?: string;
}> = ({ frame, at, x, y, size = 200, color = '#22a04a' }) => {
  const p = easeOut(progress(frame, at, 16));
  const s = size / 200;
  return (
    <path
      d={`M ${x - 80 * s} ${y} L ${x - 20 * s} ${y + 60 * s} L ${x + 90 * s} ${y - 70 * s}`}
      fill="none"
      stroke={color}
      strokeWidth={24 * s}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...drawOn(p)}
    />
  );
};

// Rung lắc một nhóm — diễn tả hoảng hốt, va chạm, cảnh báo
export const shakeTransform = (frame: number, at: number, duration = 20, amount = 10): string => {
  const p = progress(frame, at, duration);
  if (p <= 0 || p >= 1) return '';
  const decay = 1 - p;
  return `translate(${Math.sin(frame * 1.6) * amount * decay} ${Math.cos(frame * 1.9) * amount * decay})`;
};

// Thanh tiến trình chạy — diễn tả thời gian trôi, quá trình diễn ra
export const ProgressBar: React.FC<{
  frame: number;
  at: number;
  x: number;
  y: number;
  w: number;
  h?: number;
  color?: string;
  duration?: number;
  label?: string;
}> = ({ frame, at, x, y, w, h = 46, color = '#22a04a', duration = 40, label }) => {
  const p = easeOut(progress(frame, at, duration));
  if (p <= 0) return null;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#ffffff" stroke={INK} strokeWidth={9} />
      <rect x={x + 6} y={y + 6} width={Math.max(0, (w - 12) * p)} height={h - 12} rx={(h - 12) / 2} fill={color} />
      {label ? (
        <text x={x + w / 2} y={y - 22} fontSize={38} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          {label}
        </text>
      ) : null}
    </g>
  );
};
