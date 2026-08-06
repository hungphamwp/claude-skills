/**
 * ============================================================
 * record.js — Render frame-accurate: HTML animation → MP4
 * ============================================================
 *
 * Dùng: node record.js --project <thư-mục-dự-án> --url <url>
 *
 * Không quay real-time (headless Chrome trượt frame liên tục,
 * video ra giật và sai nhịp). Thay vào đó seek GSAP đến đúng
 * t = i/fps rồi chụp từng frame → video luôn mượt bất kể máy
 * nhanh hay chậm.
 *
 * Chữ đang gõ và số tiền không do GSAP điều khiển (chúng là
 * value của <input> và textContent), nên phải tự tính tại mỗi
 * frame. Công thức lấy từ config._schedule — cùng khối dữ liệu
 * mà script.js và build_audio.py dùng, nên hình, tiếng gõ phím
 * và giọng đọc luôn khớp nhau.
 * ============================================================
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs   = require('fs');
const { execSync } = require('child_process');

/* ── Tham số dòng lệnh ────────────────────────────────────── */
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
}

const PROJECT = path.resolve(arg('project', process.cwd()));
const URL     = arg('url', 'http://localhost:9090/index.html?render=1');
const CONFIG  = JSON.parse(fs.readFileSync(path.join(PROJECT, 'config.json'), 'utf8'));

const FPS      = CONFIG.output.fps;
const DURATION = CONFIG.output.duration;
const WIDTH    = CONFIG.output.width  || 1080;
const HEIGHT   = CONFIG.output.height || 1920;
const TOTAL    = Math.round(FPS * DURATION);

const FRAMES_DIR = path.join(PROJECT, 'output', 'frames');
const OUT_FILE   = path.join(PROJECT, 'output', `${CONFIG.output.name}.mp4`);

/* ── Tìm Chrome trên máy ──────────────────────────────────── */
const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!hit) {
    console.error('❌ Không tìm thấy Chrome/Chromium. Cài Google Chrome rồi chạy lại.');
    process.exit(1);
  }
  return hit;
}

/* ── Mô phỏng gõ chữ tại thời điểm t ──────────────────────── */
function typedAt(text, startSec, msPerChar, t) {
  if (t < startSec) return '';
  const chars = Math.floor((t - startSec) * 1000 / msPerChar);
  return text.substring(0, Math.min(chars, text.length));
}

/* Easing power3.out — phải giống hệt GSAP để bộ đếm giá mượt */
function priceAt(startSec, duration, target, t) {
  if (t < startSec) return 0;
  if (t >= startSec + duration) return target;
  const p = (t - startSec) / duration;
  return Math.floor((1 - Math.pow(1 - p, 3)) * target);
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

/* Seek timeline + bơm giá trị chữ đang gõ / số tiền tại thời điểm t */
async function seekAndFill(page, S, t) {
  const values = S.typing.map((x) => ({
    id: x.input,
    value: typedAt(x.text, x.type_start, x.ms_per_char, t),
  }));
  const price = priceAt(S.price.start, S.price.duration, S.price.target, t);

  await page.evaluate(({ seek, values, price }) => {
    gsap.globalTimeline.seek(seek, false);
    values.forEach((v) => {
      const el = document.getElementById(v.id);
      if (el) el.value = v.value;
    });
    const p = document.getElementById('price-amount');
    if (p) p.textContent = (price > 0 ? price.toLocaleString('vi-VN') : '0') + 'đ';
  }, { seek: t, values, price });

  // Chrome headless không phải lúc nào cũng chạy rAF khi trang không được
  // composite; đua với setTimeout để không bao giờ treo ở đây.
  await page.evaluate(() => new Promise((r) => {
    requestAnimationFrame(() => requestAnimationFrame(r));
    setTimeout(r, 40);
  }));
}

/* ── Ghép frames → MP4 ────────────────────────────────────── */
function framesToMp4() {
  console.log('🔧 Ghép frames thành MP4...');
  execSync([
    'ffmpeg', '-y', '-v', 'error',
    '-framerate', String(FPS),
    '-i', `"${path.join(FRAMES_DIR, 'frame-%05d.png')}"`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-crf', '18', '-preset', 'slow', '-movflags', '+faststart',
    `"${OUT_FILE}"`,
  ].join(' '), { stdio: 'inherit' });
  cleanDir(FRAMES_DIR);
  return OUT_FILE;
}

/* ── Main ─────────────────────────────────────────────────── */
async function render() {
  cleanDir(FRAMES_DIR);
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log(`🎬 Render ${WIDTH}×${HEIGHT} | ${FPS}fps | ${DURATION}s | ${TOTAL} frames`);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    protocolTimeout: 60000,
    args: [
      `--window-size=${WIDTH},${HEIGHT}`,
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--disable-extensions', '--force-color-profile=srgb',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--run-all-compositor-stages-before-draw',
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });

  // script.js bật cờ này sau khi nạp config, dựng DOM, chờ font và fit layout
  // polling: 'raf' (mặc định) treo trong headless mới vì rAF không chạy khi
  // trang không được composite — poll theo mốc thời gian thì luôn an toàn.
  await page.waitForFunction(() => window.__AD_READY === true,
                             { polling: 200, timeout: 30000 });
  await page.addStyleTag({ content: '::-webkit-scrollbar{display:none!important}' });
  // Bọc trong block: pause() trả về chính Timeline — để arrow trả thẳng ra thì
  // puppeteer sẽ cố serialize object vòng tròn khổng lồ đó và treo cứng.
  await page.evaluate(() => { gsap.globalTimeline.pause(0); });

  if (pageErrors.length) {
    console.error('❌ Trang bị lỗi JS:\n' + pageErrors.join('\n'));
    await browser.close();
    process.exit(1);
  }

  const S  = CONFIG._schedule;
  const t0 = Date.now();

  /* Chế độ xem thử: chỉ chụp vài mốc thời gian để soi bố cục,
     nhanh hơn render đủ frame rất nhiều khi đang chỉnh nội dung. */
  const previewArg = arg('preview', null);
  if (previewArg) {
    const dir = path.join(PROJECT, 'output', 'preview');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of previewArg.split(',').map(Number)) {
      await seekAndFill(page, S, t);
      const file = path.join(dir, `frame-${String(t).replace('.', '_')}s.png`);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
      console.log('📸', file);
    }
    cleanDir(FRAMES_DIR);
    await browser.close();
    return;
  }

  for (let i = 0; i < TOTAL; i++) {
    const t = i / FPS;

    await seekAndFill(page, S, t);

    await page.screenshot({
      path: path.join(FRAMES_DIR, `frame-${String(i + 1).padStart(5, '0')}.png`),
      type: 'png',
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });

    if ((i + 1) % 90 === 0 || i === TOTAL - 1) {
      console.log(`   📸 ${Math.round(((i + 1) / TOTAL) * 100)}% (${i + 1}/${TOTAL})`);
    }
  }

  console.log(`✅ Chụp xong trong ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await browser.close();

  const out = framesToMp4();
  console.log(`📁 ${out} (${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
}

render().catch((err) => {
  console.error('\n❌ Lỗi render:', err.message);
  process.exit(1);
});
