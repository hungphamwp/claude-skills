import { z } from 'zod';

export const sceneSchema = z.object({
  id: z.string(),
  type: z.enum(['title', 'text', 'image', 'bullet']),
  // Nội dung chính (tiêu đề / đoạn văn / caption cho ảnh)
  heading: z.string().optional(),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  // Ảnh: đường dẫn trong public/assets (vd: "assets/scene1.png")
  image: z.string().optional(),
  // Phụ đề dạng khung trắng bo góc phía dưới (chỉ dùng cho style "doodle")
  caption: z.string().optional(),
  // Hình minh họa động dựng sẵn bằng SVG. Xem key hợp lệ trong src/illustrations/index.tsx:
  // campfire-night | everything-starts-here | evolution-line | fire-radius | researcher-hut
  illustration: z.string().optional(),
  // Lời đọc của cảnh. Chạy `npm run voice` để sinh file mp3 + tự set durationInSeconds.
  voice: z.string().optional(),
  // File giọng đọc đã sinh (script tự điền, không cần viết tay)
  voiceFile: z.string().optional(),
  // Chuyển động máy quay của cảnh. Bỏ trống thì tự luân phiên theo thứ tự cảnh.
  motion: z.enum(['zoom-in', 'zoom-out', 'pan-left', 'pan-right']).optional(),
  // Thời lượng cảnh tính bằng giây
  durationInSeconds: z.number().min(0.5).default(3),
  // Màu nền cảnh
  backgroundColor: z.string().default('#0b1220'),
  textColor: z.string().default('#ffffff'),
  accentColor: z.string().default('#38bdf8'),
});

export const scriptSchema = z.object({
  title: z.string().default('Video 2D'),
  fps: z.number().default(30),
  width: z.number().default(1080),
  height: z.number().default(1920),
  // Nhạc nền: đường dẫn trong public/ (vd "assets/music/bg.mp3")
  music: z.string().optional(),
  musicVolume: z.number().min(0).max(1).default(0.12),
  scenes: z.array(sceneSchema).min(1),
});

export type Scene = z.infer<typeof sceneSchema>;
export type Script = z.infer<typeof scriptSchema>;
