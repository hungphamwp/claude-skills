// Sinh giọng đọc tiếng Việt bằng Gemini TTS (Google AI Studio) và đồng bộ thời lượng cảnh.
//
// Chuẩn bị: lấy API key ở https://aistudio.google.com/apikey rồi đặt vào biến môi trường
//   export GEMINI_API_KEY="..."
// hoặc tạo file .env ở thư mục gốc với dòng:  GEMINI_API_KEY=...
//
// Dùng: node scripts/generate-voice-gemini.mjs data/script.voice.demo.json [--voice Kore] [--pad 0.5]
//
// Với mỗi cảnh có field "voice":
//   1. Gọi Gemini TTS -> nhận audio PCM 24kHz
//   2. Chuyển sang mp3 -> public/assets/voice/<sceneId>.mp3
//   3. Đo độ dài và ghi lại durationInSeconds + voiceFile vào chính file JSON
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const scriptPathArg = args.find((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};

// Nạp .env nếu có (không cần cài thêm thư viện)
const envPath = resolve('.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// Nhiều key: khai báo GEMINI_API_KEYS=key1,key2,key3 trong .env.
// Gặp giới hạn tần suất thì script chuyển sang key kế tiếp thay vì ngồi chờ.
const API_KEYS = (process.env.GEMINI_API_KEYS ?? process.env.GEMINI_API_KEY ?? '')
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);

if (!API_KEYS.length) {
  console.error('Chưa có API key.');
  console.error('Lấy key tại https://aistudio.google.com/apikey rồi tạo file .env:');
  console.error('  GEMINI_API_KEYS=key1,key2,key3');
  process.exit(1);
}

// Chỉ số key hiện dùng, giữ nguyên giữa các cảnh để rải đều tải
let keyIdx = 0;

if (!scriptPathArg) {
  console.error('Dùng: node scripts/generate-voice-gemini.mjs data/script.json [--voice Kore]');
  process.exit(1);
}

// Gói miễn phí giới hạn 10 request/ngày/model/key. Hạn mức tính RIÊNG cho từng
// model, nên khi model chính cạn quota thì đổi model là có thêm lượt.
// Thứ tự ưu tiên: chất lượng cao trước, dự phòng sau.
const MODEL_CHAIN = flag('model', 'gemini-3.1-flash-tts-preview,gemini-2.5-flash-preview-tts,gemini-2.5-pro-preview-tts')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
let modelIdx = 0;
const DEFAULT_VOICE = flag('voice', 'Laomedeia');
const PAD = Number(flag('pad', 0.5));
// Chỉ dẫn ngữ điệu. LƯU Ý: Gemini TTS bỏ qua câu phủ định — viết "không buồn"
// lại mồi ra đúng giọng buồn. Chỉ mô tả bằng câu khẳng định về thứ mình MUỐN.
// Ngữ điệu còn phụ thuộc rất nhiều vào chính câu chữ: dùng tiểu từ tiếng Việt
// ("đâu", "mới được chứ", "lận"), dấu ba chấm và dấu hỏi để tạo nhịp ngắt.
const DEFAULT_STYLE = flag(
  'style',
  'Giọng nữ Việt 25 tuổi, tươi sáng, có nụ cười trong giọng. Nói nhanh, năng lượng cao, cao độ trung–cao và giữ sáng đều từ đầu đến cuối câu. Kể như đang hào hứng khoe một chuyện lạ vừa đọc được cho bạn thân. Ngắt một nhịp ngắn ở dấu gạch ngang, thả giọng lơ lửng chờ đợi ở dấu ba chấm, rồi lên giọng rõ ở cuối câu hỏi và cắt gọn.'
);

const scriptPath = resolve(scriptPathArg);
if (!existsSync(scriptPath)) {
  console.error(`Không tìm thấy file: ${scriptPath}`);
  process.exit(1);
}

const run = (cmd, cmdArgs) => {
  const r = spawnSync(cmd, cmdArgs, { encoding: 'utf-8' });
  if (r.status !== 0) throw new Error(`${cmd} lỗi: ${r.stderr || r.stdout}`);
  return r.stdout;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Gọi Gemini TTS, trả về Buffer PCM 16-bit 24kHz mono
const urlFor = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const synthesize = async (text, voiceName, style) => {
  const body = {
    contents: [{ parts: [{ text: `${style}\n\n${text}` }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
    },
  };

  // Mỗi vòng: thử lần lượt tất cả các key trên model hiện tại. Cả bộ key cạn thì
  // chuyển sang model kế tiếp (quota riêng). Hết model mới chịu chờ.
  for (let round = 1; round <= 6; round++) {
    for (let k = 0; k < API_KEYS.length; k++) {
      const current = keyIdx % API_KEYS.length;
      const res = await fetch(urlFor(MODEL_CHAIN[modelIdx]), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEYS[current] },
        body: JSON.stringify(body),
      });

      if (res.status === 429 || res.status === 503) {
        keyIdx++; // chuyển sang key kế tiếp
        if (API_KEYS.length > 1) {
          console.log(`    (key #${current + 1} bị giới hạn → chuyển key #${(keyIdx % API_KEYS.length) + 1})`);
        }
        continue;
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(`Gemini API lỗi ${res.status}: ${json?.error?.message ?? JSON.stringify(json)}`);
      }

      const data = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) {
        throw new Error(`Không nhận được audio. Phản hồi: ${JSON.stringify(json).slice(0, 400)}`);
      }
      return Buffer.from(data, 'base64');
    }

    // cả bộ key cạn trên model này -> thử model kế tiếp (quota riêng theo model)
    if (modelIdx < MODEL_CHAIN.length - 1) {
      modelIdx++;
      console.log(`    (hết quota trên mọi key -> chuyển model: ${MODEL_CHAIN[modelIdx]})`);
      continue;
    }
    const wait = Math.min(round * 6000, 30000);
    console.log(`    (mọi key và mọi model đều cạn, chờ ${wait / 1000}s — vòng ${round}/6)`);
    await sleep(wait);
  }
  throw new Error(
    `Đã cạn quota trên cả ${API_KEYS.length} key x ${MODEL_CHAIN.length} model. ` +
    `Gói miễn phí giới hạn 10 request/ngày/model/key — đợi sang ngày mới hoặc thêm key.`
  );
};

const voiceDir = resolve('public/assets/voice');
mkdirSync(voiceDir, { recursive: true });

const script = JSON.parse(readFileSync(scriptPath, 'utf-8'));
const scriptVoice = script.voiceName ?? DEFAULT_VOICE;
const scriptStyle = script.voiceStyle ?? DEFAULT_STYLE;
const SKIP_EXISTING = args.includes('--skip-existing');
let changed = 0;
const failed = [];

// Ghi tiến độ ngay sau mỗi cảnh, để lỗi giữa chừng không mất phần đã làm
const saveProgress = () => writeFileSync(scriptPath, JSON.stringify(script, null, 2) + '\n');

console.log(`Model: ${MODEL_CHAIN.join(' -> ')} | Giọng: ${scriptVoice}\n`);

for (const scene of script.scenes) {
  if (!scene.voice) continue;

  const pcmPath = resolve(voiceDir, `${scene.id}.pcm`);
  const mp3 = resolve(voiceDir, `${scene.id}.mp3`);

  if (SKIP_EXISTING && scene.voiceFile && existsSync(mp3)) {
    console.log(`  ${scene.id}: bỏ qua (đã có file)`);
    continue;
  }

  try {
    const pcm = await synthesize(scene.voice, scene.voiceName ?? scriptVoice, scriptStyle);
    writeFileSync(pcmPath, pcm);

    // PCM thô của Gemini: 16-bit little-endian, 24kHz, mono
    run('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', pcmPath,
      '-codec:a', 'libmp3lame', '-q:a', '3', mp3,
    ]);
    rmSync(pcmPath, { force: true });

    const duration = Number(
      run('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        mp3,
      ]).trim()
    );

    scene.voiceFile = `assets/voice/${scene.id}.mp3`;
    scene.durationInSeconds = Math.round((duration + PAD) * 100) / 100;
    changed++;
    saveProgress();

    console.log(`  ${scene.id}: ${scene.durationInSeconds}s [${MODEL_CHAIN[modelIdx]}]  "${scene.voice.slice(0, 50)}${scene.voice.length > 50 ? '…' : ''}"`);
  } catch (e) {
    failed.push(scene.id);
    console.log(`  ${scene.id}: LỖI — ${e.message}`);
  }
  await sleep(1500); // tránh chạm rate limit
}

if (changed === 0 && failed.length === 0) {
  console.log('Không có cảnh nào chứa field "voice".');
  process.exit(0);
}

saveProgress();

if (failed.length) {
  console.log(`\nChưa sinh được: ${failed.join(', ')}`);
  console.log('Chạy lại lệnh kèm cờ --skip-existing để chỉ làm phần còn thiếu.');
}
const total = script.scenes.reduce((s, sc) => s + sc.durationInSeconds, 0);
console.log(`\nĐã sinh ${changed} file giọng đọc. Tổng thời lượng: ${total.toFixed(2)}s`);
console.log(`Đã cập nhật ${scriptPathArg}`);
