# Dựng project mới từ đầu

Chỉ cần khi người dùng muốn một project Remotion mới ở thư mục khác. Nếu họ chỉ muốn
làm video, dùng project sẵn có ở `/Users/hungpham/Project/03. Nội bộ/Tạo video 2D`
— nhanh hơn nhiều vì đã có sẵn 18 hình minh hoạ và toàn bộ script.

## Cách nhanh nhất: sao chép project cũ

```bash
cp -R "/Users/hungpham/Project/03. Nội bộ/Tạo video 2D" "<đường-dẫn-mới>"
cd "<đường-dẫn-mới>"
rm -rf node_modules out public/assets/voice data/script.*.json
npm install
```

Giữ lại `src/`, `scripts/`, `.env` (nếu muốn dùng chung API key). Cách này giữ được
toàn bộ thư viện hình minh hoạ — thứ tốn nhiều công nhất.

## Dựng từ số 0

Chỉ làm khi người dùng thực sự muốn project sạch, không kèm hình có sẵn.

### package.json

```json
{
  "name": "video-2d",
  "private": true,
  "scripts": {
    "start": "remotion studio",
    "render": "remotion render src/index.ts StoryVideo out/video.mp4"
  },
  "dependencies": {
    "@remotion/cli": "4.0.290",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "remotion": "4.0.290",
    "zod": "3.23.8"
  },
  "devDependencies": {
    "@types/react": "18.3.3",
    "typescript": "5.5.4"
  }
}
```

Đừng thêm `@remotion/zod-types` — nó ghim `zod@3.22.3` và gây xung đột peer dependency
khi cài. Nếu vẫn cần, cài `zod@3.22.3` cho khớp.

### Cấu trúc tối thiểu

```
src/
  index.ts                    registerRoot(RemotionRoot)
  Root.tsx                    khai báo <Composition> + calculateMetadata
  schema.ts                   zod schema cho script JSON
  StoryVideoComposition.tsx   ghép Sequence + Audio giọng đọc + nhạc nền
  scenes/StoryScene.tsx       một cảnh: hình + heading + caption + Ken Burns
  scenes/RoughShapes.tsx      khung/gạch chân/dấu tick nét vẽ tay
  illustrations/
    anim.ts                   progress, easeOut, wobble, seeded, drawOn, INK
    parts.tsx                 Head, StandingFigure, Campfire, Stars...
    index.tsx                 registry ILLUSTRATIONS
scripts/
  generate-voice-gemini.mjs
  render-from-script.mjs
data/
public/assets/
remotion.config.ts
tsconfig.json
```

### Điểm dễ sai nhất: calculateMetadata

Không có nó, render script khác qua `--props` sẽ bị cắt theo độ dài của script mặc định:

```tsx
const metadataFromProps = ({ props }: { props: { script: Script } }) => ({
  durationInFrames: getTotalDurationInFrames(props.script),
  fps: props.script.fps,
  width: props.script.width,
  height: props.script.height,
});

<Composition
  id="StoryVideo"
  component={StoryVideoComposition}
  durationInFrames={getTotalDurationInFrames(defaultScript)}
  fps={30} width={1920} height={1080}
  defaultProps={{ script: defaultScript }}
  calculateMetadata={metadataFromProps}
/>
```

`getTotalDurationInFrames` = tổng `Math.round(durationInSeconds * fps)` của các cảnh.

### remotion.config.ts

```ts
import { Config } from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
```

### Âm thanh trong composition

```tsx
{script.music ? <Audio src={staticFile(script.music)} volume={script.musicVolume} loop /> : null}
{items.map(({ scene, from, durationInFrames }, index) => (
  <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
    {scene.voiceFile ? <Audio src={staticFile(scene.voiceFile)} /> : null}
    <StoryScene scene={scene} durationInFrames={durationInFrames} sceneIndex={index} />
  </Sequence>
))}
```

### Gemini TTS — phần gọi API

Endpoint và định dạng trả về:

```js
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent
Header: x-goog-api-key: <key>
Body: {
  contents: [{ parts: [{ text: `${styleDirection}\n\n${text}` }] }],
  generationConfig: {
    responseModalities: ['AUDIO'],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Laomedeia' } } },
  },
}
```

Trả về `candidates[0].content.parts[0].inlineData.data` — base64 của **PCM thô**
16-bit little-endian, 24kHz, mono. Không phải mp3, phải chuyển:

```bash
ffmpeg -y -f s16le -ar 24000 -ac 1 -i raw.pcm -codec:a libmp3lame -q:a 3 out.mp3
```

API hay trả 429/503. Cần retry với backoff tăng dần (tới ~30s), bắt lỗi từng cảnh
và ghi tiến độ ngay sau mỗi cảnh thành công để không mất công khi lỗi giữa chừng.

Model khác: `gemini-2.5-flash-preview-tts`, `gemini-2.5-pro-preview-tts`.
Kiểm tra model nào dùng được với key hiện tại:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200" \
  -H "x-goog-api-key: $GEMINI_API_KEY" | grep -o '"name": "models/[^"]*tts[^"]*"'
```
