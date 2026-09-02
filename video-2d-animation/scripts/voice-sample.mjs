// Nghe thử nhiều giọng Gemini TTS cùng một câu, để chọn giọng trước khi dựng video.
//
// Dùng: node scripts/voice-sample.mjs "Câu cần đọc" --voices Sulafat,Aoede,Leda [--style "..."]
// File mp3 xuất ra: out/voice-samples/<tên-giọng>.mp3
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const textArg = args.find((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};

const envPath = resolve('.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// Nhiều key: GEMINI_API_KEYS=key1,key2,key3 — tự chuyển key khi bị giới hạn
const API_KEYS = (process.env.GEMINI_API_KEYS ?? process.env.GEMINI_API_KEY ?? '')
  .split(',')
  .map((k) => k.trim())
  .filter(Boolean);
if (!API_KEYS.length) {
  console.error('Chưa có API key (đặt GEMINI_API_KEYS trong .env).');
  process.exit(1);
}
let keyIdx = 0;
if (!textArg) {
  console.error('Dùng: node scripts/voice-sample.mjs "Câu cần đọc" --voices Sulafat,Aoede');
  process.exit(1);
}

const MODEL = flag('model', 'gemini-3.1-flash-tts-preview');
const STYLE = flag('style', 'Đọc bằng tiếng Việt, giọng nữ kể chuyện truyền cảm, cuốn hút:');
const VOICES = flag('voices', 'Sulafat,Aoede,Achernar,Vindemiatrix,Leda,Kore').split(',');
// Hậu tố tên file, để chạy nhiều đợt với cùng một giọng mà không ghi đè
const TAG = flag('tag', '');

const run = (cmd, cmdArgs) => {
  const r = spawnSync(cmd, cmdArgs, { encoding: 'utf-8' });
  if (r.status !== 0) throw new Error(`${cmd} lỗi: ${r.stderr || r.stdout}`);
  return r.stdout;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const synthesize = async (text, voiceName) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const body = {
    contents: [{ parts: [{ text: `${STYLE}\n\n${text}` }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
  };
  for (let round = 1; round <= 5; round++) {
    for (let k = 0; k < API_KEYS.length; k++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': API_KEYS[keyIdx % API_KEYS.length],
        },
        body: JSON.stringify(body),
      });
      if (res.status === 429 || res.status === 503) {
        keyIdx++; // chuyển key kế tiếp
        continue;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(`API ${res.status}: ${json?.error?.message ?? ''}`);
      const data = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) throw new Error('Không nhận được audio.');
      return Buffer.from(data, 'base64');
    }
    await sleep(Math.min(round * 5000, 25000));
  }
  throw new Error('API bận, thử lại sau.');
};

const outDir = resolve('out/voice-samples');
mkdirSync(outDir, { recursive: true });

console.log(`Câu đọc: "${textArg}"\nModel: ${MODEL}\n`);

for (const voice of VOICES) {
  const name = TAG ? `${voice}-${TAG}` : voice;
  const pcm = resolve(outDir, `${name}.pcm`);
  const mp3 = resolve(outDir, `${name}.mp3`);
  try {
    writeFileSync(pcm, await synthesize(textArg, voice.trim()));
    run('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', pcm,
      '-codec:a', 'libmp3lame', '-q:a', '3', mp3,
    ]);
    rmSync(pcm, { force: true });
    const dur = Number(
      run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', mp3]).trim()
    );
    console.log(`  ${name.padEnd(22)} ${dur.toFixed(2)}s  ->  out/voice-samples/${name}.mp3`);
  } catch (e) {
    console.log(`  ${name.padEnd(22)} LỖI: ${e.message}`);
  }
  await sleep(1200);
}
