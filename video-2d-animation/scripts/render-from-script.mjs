// Render một video từ một file script.json bất kỳ (không cần sửa code).
// Dùng: node scripts/render-from-script.mjs data/script.example.json out/video.mp4 [CompositionId]
// CompositionId: "MainVideo" (mặc định, style hiện đại) hoặc "DoodleVideo" (style vẽ tay/whiteboard).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const [, , scriptPathArg, outputPathArg, compositionIdArg] = process.argv;
const compositionId = compositionIdArg || 'MainVideo';

if (!scriptPathArg) {
  console.error('Thiếu đường dẫn script.json.');
  console.error('Dùng: node scripts/render-from-script.mjs data/script.json out/video.mp4');
  process.exit(1);
}

const scriptPath = resolve(scriptPathArg);
const outputPath = resolve(outputPathArg || 'out/video.mp4');

if (!existsSync(scriptPath)) {
  console.error(`Không tìm thấy file: ${scriptPath}`);
  process.exit(1);
}

const script = JSON.parse(readFileSync(scriptPath, 'utf-8'));

const propsPath = resolve('.tmp-render-props.json');
writeFileSync(propsPath, JSON.stringify({ script }, null, 2));

mkdirSync(dirname(outputPath), { recursive: true });

console.log(`Đang render "${script.title ?? scriptPath}" (${compositionId}) -> ${outputPath}`);

const result = spawnSync(
  'npx',
  ['remotion', 'render', 'src/index.ts', compositionId, outputPath, `--props=${propsPath}`],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 0);
