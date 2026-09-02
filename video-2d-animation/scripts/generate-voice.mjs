// Sinh giọng đọc tiếng Việt cho từng cảnh và tự đồng bộ thời lượng cảnh theo audio.
//
// Dùng: node scripts/generate-voice.mjs data/script.story.example.json [--rate 175] [--pad 0.6]
//
// Với mỗi cảnh có field "voice", script sẽ:
//   1. Gọi `say -v Linh` (giọng Việt có sẵn của macOS) tạo file AIFF
//   2. Chuyển sang mp3 bằng ffmpeg -> public/assets/voice/<sceneId>.mp3
//   3. Đo độ dài audio bằng ffprobe
//   4. Ghi lại durationInSeconds = độ dài audio + pad, và voiceFile vào chính file JSON
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const scriptPathArg = args.find((a) => !a.startsWith('--'));
const getFlag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : fallback;
};

const VOICE = 'Linh'; // giọng vi_VN có sẵn trên macOS
const RATE = getFlag('rate', 175); // từ/phút, giảm xuống nếu muốn đọc chậm hơn
const PAD = getFlag('pad', 0.6); // giây đệm thêm sau mỗi câu

if (!scriptPathArg) {
  console.error('Thiếu đường dẫn script.json.');
  console.error('Dùng: node scripts/generate-voice.mjs data/script.story.example.json');
  process.exit(1);
}

const scriptPath = resolve(scriptPathArg);
if (!existsSync(scriptPath)) {
  console.error(`Không tìm thấy file: ${scriptPath}`);
  process.exit(1);
}

const run = (cmd, cmdArgs) => {
  const r = spawnSync(cmd, cmdArgs, { encoding: 'utf-8' });
  if (r.status !== 0) {
    throw new Error(`${cmd} lỗi: ${r.stderr || r.stdout}`);
  }
  return r.stdout;
};

const voiceDir = resolve('public/assets/voice');
mkdirSync(voiceDir, { recursive: true });

const script = JSON.parse(readFileSync(scriptPath, 'utf-8'));
let changed = 0;

for (const scene of script.scenes) {
  if (!scene.voice) continue;

  const aiff = resolve(voiceDir, `${scene.id}.aiff`);
  const mp3 = resolve(voiceDir, `${scene.id}.mp3`);

  run('say', ['-v', VOICE, '-r', String(RATE), '-o', aiff, scene.voice]);
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, '-codec:a', 'libmp3lame', '-q:a', '4', mp3]);
  rmSync(aiff, { force: true });

  const durationRaw = run('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    mp3,
  ]);
  const duration = Number(durationRaw.trim());

  scene.voiceFile = `assets/voice/${scene.id}.mp3`;
  scene.durationInSeconds = Math.round((duration + PAD) * 100) / 100;
  changed++;

  console.log(`  ${scene.id}: ${scene.durationInSeconds}s  "${scene.voice.slice(0, 52)}${scene.voice.length > 52 ? '…' : ''}"`);
}

if (changed === 0) {
  console.log('Không có cảnh nào chứa field "voice" — không sinh giọng đọc.');
  process.exit(0);
}

writeFileSync(scriptPath, JSON.stringify(script, null, 2) + '\n');
const total = script.scenes.reduce((s, sc) => s + sc.durationInSeconds, 0);
console.log(`\nĐã sinh ${changed} file giọng đọc. Tổng thời lượng video: ${total.toFixed(2)}s`);
console.log(`Đã cập nhật thời lượng cảnh trong ${scriptPathArg}`);
