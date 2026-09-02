// Helper animation dùng chung cho các hình minh họa.
// Lưu ý: Remotion render từng frame độc lập -> mọi "ngẫu nhiên" phải tất định
// (suy ra từ frame hoặc từ seed cố định), tuyệt đối không dùng Math.random().

// Tiến độ 0 -> 1 trong khoảng frame [start, start + duration]
export const progress = (frame: number, start: number, duration: number): number => {
  if (duration <= 0) return 1;
  const p = (frame - start) / duration;
  return Math.max(0, Math.min(1, p));
};

// Easing mượt cho nét vẽ
export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

// Dao động tuần hoàn (lửa bập bùng, chữ nhún nhảy)
export const wobble = (frame: number, speed = 0.2, amount = 1, phase = 0): number =>
  Math.sin(frame * speed + phase) * amount;

// Số giả ngẫu nhiên tất định từ index (dùng cho vị trí/nhịp nhấp nháy của sao)
export const seeded = (i: number): number => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Thuộc tính vẽ dần một path (dùng kèm pathLength={1} trên phần tử SVG)
export const drawOn = (p: number) => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - easeOut(p),
});

export const INK = '#111111';
