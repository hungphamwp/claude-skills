/**
 * record.js — Render frame-accurate: HTML animation → MP4
 *
 * Không quay real-time (headless Chrome trượt frame). Thay vào đó
 * seek GSAP đến đúng t = i/fps rồi chụp từng frame → video luôn
 * mượt và đúng nhịp bất kể máy nhanh hay chậm.
 *
 * Dùng:
 *   node record.js                       → render đủ 5400 frame
 *   node record.js --preview 0,8,30,96   → chỉ chụp vài mốc để soi bố cục
 *   node record.js --from 0 --to 30      → render một đoạn (giây)
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };

const DIR    = __dirname;
const W = 1080, H = 1920, FPS = 30;
const DUR    = parseFloat(arg('duration', 180));
const FROM   = parseFloat(arg('from', 0));
const TO     = parseFloat(arg('to', DUR));
const NAME   = arg('name', 'video');
const FONT   = arg('font', null);   // thử font khác mà không phải sửa CSS
const FRAMES = path.join(DIR, 'output', 'frames');
const OUT    = path.join(DIR, 'output', `${NAME}.mp4`);

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].find(p => fs.existsSync(p));

if (!CHROME) { console.error('❌ Không tìm thấy Chrome.'); process.exit(1); }

const clean = d => fs.existsSync(d) && fs.rmSync(d, { recursive: true, force: true });

async function seek(page, t) {
  await page.evaluate((s) => { window.__TL.seek(s, false); }, t);
  await page.evaluate(() => new Promise(r => {
    requestAnimationFrame(() => requestAnimationFrame(r));
    setTimeout(r, 30);
  }));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    protocolTimeout: 120000,
    args: [
      `--window-size=${W},${H}`, '--no-sandbox', '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', '--disable-extensions', '--force-color-profile=srgb',
      '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding', '--run-all-compositor-stages-before-draw',
      '--font-render-hinting=none',
    ],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

  await page.goto('file://' + path.join(DIR, 'index.html') + '?render=1', { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => window.__READY === true, { polling: 150, timeout: 40000 });

  if (FONT) {
    const fam = FONT.replace(/ /g, '+');
    await page.addStyleTag({ url: `https://fonts.googleapis.com/css2?family=${fam}:wght@400;500;600;700;800;900&display=swap` });
    await page.addStyleTag({ content: `:root{--font:'${FONT}',-apple-system,sans-serif}` });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 400));
  }
  await page.evaluate(() => { window.__TL.pause(0); });

  if (errs.length) {
    console.error('❌ Lỗi JS trên trang:\n' + errs.join('\n'));
    await browser.close(); process.exit(1);
  }

  const preview = arg('preview', null);
  if (preview) {
    const dir = path.join(DIR, 'output', 'preview');
    fs.mkdirSync(dir, { recursive: true });
    for (const t of preview.split(',').map(Number)) {
      await seek(page, t);
      const f = path.join(dir, `t-${String(t).replace('.', '_')}s.png`);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: W, height: H } });
      console.log('📸', f);
    }
    await browser.close();
    if (errs.length) console.error('⚠️  Lỗi JS:\n' + errs.join('\n'));
    return;
  }

  clean(FRAMES); fs.mkdirSync(FRAMES, { recursive: true });
  const i0 = Math.round(FROM * FPS), i1 = Math.round(TO * FPS);
  const total = i1 - i0;
  console.log(`🎬 Render ${W}×${H} · ${FPS}fps · ${FROM}→${TO}s · ${total} frames`);
  const t0 = Date.now();

  for (let i = i0; i < i1; i++) {
    await seek(page, i / FPS);
    await page.screenshot({
      path: path.join(FRAMES, `frame-${String(i - i0 + 1).padStart(5, '0')}.png`),
      type: 'png', clip: { x: 0, y: 0, width: W, height: H },
    });
    if ((i - i0 + 1) % 150 === 0 || i === i1 - 1) {
      const done = i - i0 + 1, el = (Date.now() - t0) / 1000;
      const eta = el / done * (total - done);
      console.log(`   📸 ${Math.round(done / total * 100)}% (${done}/${total}) · còn ~${Math.round(eta / 60)} phút`);
    }
  }

  console.log(`✅ Chụp xong ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  await browser.close();

  console.log('🔧 Ghép frames → MP4...');
  execSync([
    'ffmpeg', '-y', '-v', 'error', '-framerate', String(FPS),
    '-i', `"${path.join(FRAMES, 'frame-%05d.png')}"`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19',
    '-preset', 'medium', '-movflags', '+faststart', `"${OUT}"`,
  ].join(' '), { stdio: 'inherit' });
  clean(FRAMES);
  console.log(`📁 ${OUT} (${(fs.statSync(OUT).size / 1048576).toFixed(2)} MB)`);
  if (errs.length) console.error('⚠️  Có lỗi JS:\n' + errs.join('\n'));
})().catch(e => { console.error('❌', e.message); process.exit(1); });
