import React from 'react';

// Seed số ổn định từ 1 chuỗi id, để nét vẽ "lệch tay" giữ nguyên hình dạng
// xuyên suốt mọi frame (Remotion render từng frame độc lập nên không được
// dùng Math.random() thuần — sẽ bị nhấp nháy).
const hashSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
};

// Khung chữ nhật viền đen dày, hơi méo kiểu vẽ tay — dùng làm nền cho card/caption.
export const HandDrawnRect: React.FC<{
  id: string;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  radius?: number;
}> = ({ id, width, height, fill = '#ffffff', stroke = '#111111', strokeWidth = 6, radius = 16 }) => {
  const filterId = `rough-rect-${id}`;
  const seed = hashSeed(id);
  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
    >
      <defs>
        <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency={0.015} numOctaves={2} seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={7} />
        </filter>
      </defs>
      <rect
        x={strokeWidth}
        y={strokeWidth}
        width={Math.max(width - strokeWidth * 2, 0)}
        height={Math.max(height - strokeWidth * 2, 0)}
        rx={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};

// Gạch chân lệch tay dưới heading, dùng làm điểm nhấn accent color.
export const HandDrawnUnderline: React.FC<{ id: string; width: number; color: string }> = ({
  id,
  width,
  color,
}) => {
  const filterId = `rough-line-${id}`;
  const seed = hashSeed(id);
  const height = 22;
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={filterId} x="-20%" y="-200%" width="140%" height="500%">
          <feTurbulence type="fractalNoise" baseFrequency={0.06} numOctaves={2} seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={9} />
        </filter>
      </defs>
      <line
        x1={8}
        y1={height / 2}
        x2={width - 8}
        y2={height / 2}
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};

// Dấu tick vẽ tay dùng cho bullet list.
export const HandDrawnCheck: React.FC<{ id: string; color: string; size?: number }> = ({
  id,
  color,
  size = 36,
}) => {
  const filterId = `rough-check-${id}`;
  const seed = hashSeed(id);
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ flexShrink: 0, overflow: 'visible' }}>
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency={0.08} numOctaves={2} seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} />
        </filter>
      </defs>
      <circle cx={18} cy={18} r={15} fill="none" stroke={color} strokeWidth={4} filter={`url(#${filterId})`} />
      <path
        d="M11 18.5 L16 23.5 L26 12.5"
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};
