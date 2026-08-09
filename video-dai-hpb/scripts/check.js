/**
 * check.js — Soi lỗi bố cục và thời gian bằng CHỮ, không cần nhìn ảnh
 *
 * Vì sao có file này: cách cũ là render ảnh preview rồi mở ra nhìn. Mỗi
 * ảnh 1080×1920 tốn khoảng 2.700 token, mỗi dự án phải xem 4–6 lần. File
 * này trả về vài trăm ký tự và bắt được đúng những lỗi hay gặp:
 * chữ tràn vùng an toàn, chữ nhỏ quá, chip xuống dòng, thẻ bị cắt.
 *
 * CHẠY TRƯỚC KHI RENDER. Sửa hết cảnh báo rồi mới render — render lại
 * một video 180 giây mất nửa tiếng.
 *
 * Dùng:
 *   node check.js                 → kiểm tra tất cả cảnh
 *   node check.js --scene 4,12    → chỉ vài cảnh
 *   node check.js --duration 60
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d; };
const DIR = __dirname;
const W = 1080, H = 1920;
const DUR = parseFloat(arg('duration', 180));
const ONLY = arg('scene', null);

/* Vùng an toàn — nới 6px cho sai số làm tròn của trình duyệt */
const SAFE = { l: 72, r: 1008, t: 212, b: 1508 };   // nới 8px cho viền và làm tròn
const MIN_FONT = 40;

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].find(p => fs.existsSync(p));
if (!CHROME) { console.error('❌ Không tìm thấy Chrome.'); process.exit(1); }

/* ---------- kiểm tra thời gian: scenes.js ↔ voiceover.json ---------- */
function checkTiming(scenes, lines) {
  const out = [];
  let end = 0;
  scenes.forEach((s, i) => {
    const n = String(i + 1).padStart(2, '0');
    if (Math.abs(s.t - end) > 0.02) {
      out.push(s.t > end
        ? `cảnh ${n}: hở ${(s.t - end).toFixed(2)}s so với cảnh trước`
        : `cảnh ${n}: chồng ${(end - s.t).toFixed(2)}s lên cảnh trước`);
    }
    if (s.d < 2) out.push(`cảnh ${n}: chỉ ${s.d}s — dưới 2s mắt không kịp đọc`);
    if (s.d > 5) out.push(`cảnh ${n}: ${s.d}s — trên 5s là bắt đầu chán`);
    end = +(s.t + s.d).toFixed(3);
  });
  if (Math.abs(end - DUR) > 0.05)
    out.push(`tổng cảnh ${end}s ≠ thời lượng ${DUR}s`);

  let prev = 0;
  lines.forEach((l, i) => {
    const n = String(i + 1).padStart(2, '0');
    if (l.at < prev - 0.05) out.push(`câu ${n}: bắt đầu trước khi câu trước kết thúc`);
    const sc = scenes.find(s => l.at >= s.t - 0.01 && l.at < s.t + s.d);
    if (!sc) out.push(`câu ${n} (${l.at}s): không rơi vào cảnh nào`);
    if (l.at + l.budget > DUR + 0.05) out.push(`câu ${n}: tràn quá thời lượng video`);
    prev = l.at + l.budget;
  });
  return out;
}

/* ---------- quét bố cục trong trình duyệt ----------
   Chỉ soi thứ người xem thực sự đọc. Ba nguồn báo động giả đã loại:
   - khung chứa rỗng (.safe cao cố định 1240px, nội dung căn giữa bên trong)
   - chữ nhỏ trong mockup trình duyệt/điện thoại — cố tình nhỏ cho giống UI thật
   - đếm dòng bằng scrollHeight, cộng nhầm cả padding                       */
const SCAN = (minFont, safe) => {
  const vis = [...document.querySelectorAll('.scene')]
    .filter(s => getComputedStyle(s).visibility !== 'hidden');
  if (!vis.length) return ['không có cảnh nào hiện'];
  const sec = vis[vis.length - 1];
  const bad = [];
  const seen = new Set();
  const MOCK = '.win, .phone, .brw, .site, .pb-site, .pb-app, .pb-brand, .pb-chat';

  const txt = (e) => (e.textContent || '').trim().replace(/\s+/g, ' ');
  const ownText = (e) => [...e.childNodes]
    .filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();

  for (const e of sec.querySelectorAll('*')) {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.15) continue;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;

    const own = ownText(e);
    const inMock = !!e.closest(MOCK);
    const key = (own || txt(e) || '.' + String(e.className || e.tagName).split(' ')[0]).slice(0, 26);

    /* ra ngoài vùng an toàn — chỉ tính phần tử có chữ của riêng nó,
       hoặc khối lớn nhìn thấy được; khung chứa rỗng thì bỏ qua */
    const isBlock = /\b(win|card|cta-card|phone|brw|chip|badge-n)\b/.test(String(e.className));
    if (own || isBlock) {
      // ngưỡng 2px: animation scale làm mép lệch dưới một pixel, đó là nhiễu
      const over = [];
      if (safe.l - r.left   >= 2) over.push(`trái ${Math.round(safe.l - r.left)}px`);
      if (r.right - safe.r  >= 2) over.push(`phải ${Math.round(r.right - safe.r)}px`);
      if (safe.t - r.top    >= 2) over.push(`trên ${Math.round(safe.t - r.top)}px`);
      if (r.bottom - safe.b >= 2) over.push(`dưới ${Math.round(r.bottom - safe.b)}px`);
      if (over.length && !seen.has('o' + key)) {
        seen.add('o' + key);
        bad.push(`"${key}" ra ngoài vùng an toàn: ${over.join(', ')}`);
      }
    }

    /* chữ nhỏ — bỏ qua chữ bên trong mockup, đó là UI giả lập nên nhỏ là đúng */
    if (own && !inMock) {
      const fs = parseFloat(cs.fontSize);
      if (fs < minFont && !seen.has('f' + key)) {
        seen.add('f' + key);
        bad.push(`"${key}" cỡ chữ ${Math.round(fs)}px < ${minFont}px`);
      }
    }

    /* xuống dòng — trừ padding ra khỏi chiều cao trước khi chia line-height */
    const isChip  = e.classList.contains('chip');
    const isCardT = e.classList.contains('t') && e.closest('.card');
    if ((isChip || isCardT) && own) {
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
      const inner = e.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const lines = Math.max(1, Math.round(inner / lh));
      const max = isChip ? 1 : 2;
      if (lines > max && !seen.has('w' + key)) {
        seen.add('w' + key);
        bad.push(`"${key}" xuống ${lines} dòng (tối đa ${max})`);
      }
    }

    /* bị cắt ngang */
    if (own && e.scrollWidth > e.clientWidth + 4 &&
        cs.overflow !== 'visible' && !seen.has('c' + key)) {
      seen.add('c' + key);
      bad.push(`"${key}" bị cắt ngang ${Math.round(e.scrollWidth - e.clientWidth)}px`);
    }
  }
  return bad;
};

(async () => {
  const lines = JSON.parse(fs.readFileSync(path.join(DIR, 'voiceover.json'), 'utf8'));

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto('file://' + path.join(DIR, 'index.html') + '?render=1', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__READY === true, { polling: 150, timeout: 40000 });
  await page.evaluate(() => { window.__TL.pause(0); });

  // Đọc bảng cảnh thẳng từ trang — không phụ thuộc output/scenes.json,
  // nên chạy được ngay cả khi chưa render lần nào.
  const scenes = await page.evaluate(() => SCENES.map(s =>
    ({ t: s.t, d: s.d, out: typeof s.out === 'string' ? s.out : 'cut' })));

  const pick = ONLY ? ONLY.split(',').map(Number) : null;
  const problems = [];
  let clean = 0;

  for (let i = 0; i < scenes.length; i++) {
    if (pick && !pick.includes(i + 1)) continue;
    const s = scenes[i];
    // soi lúc cảnh đã vào xong nhưng chưa bắt đầu chuyển ra
    const t = s.t + Math.min(1.5, s.d * 0.55);
    await page.evaluate(x => { window.__TL.seek(x, false); }, t);
    await page.evaluate(() => new Promise(r => {
      requestAnimationFrame(() => requestAnimationFrame(r)); setTimeout(r, 0);
    }));
    const bad = await page.evaluate(SCAN, MIN_FONT, SAFE);
    if (bad.length) problems.push([i + 1, bad]); else clean++;
  }
  await browser.close();

  /* ---------- báo cáo ---------- */
  const timing = checkTiming(scenes, lines);
  console.log(`KIỂM TRA ${scenes.length} cảnh · ${DUR}s\n`);

  console.log('Thời gian');
  if (!timing.length) console.log(`  ✓ cảnh liền mạch, lời đọc rơi đúng cảnh, tổng khớp ${DUR}s`);
  else timing.forEach(x => console.log(`  ⚠ ${x}`));

  console.log('\nBố cục');
  if (!problems.length) console.log(`  ✓ ${clean} cảnh sạch`);
  else {
    console.log(`  ✓ ${clean} cảnh sạch · ⚠ ${problems.length} cảnh có vấn đề`);
    problems.forEach(([n, bad]) =>
      bad.forEach(b => console.log(`  ⚠ cảnh ${String(n).padStart(2, '0')}  ${b}`)));
  }

  if (errs.length) { console.log('\nLỗi JS'); errs.forEach(e => console.log(`  ✗ ${e}`)); }

  const fail = timing.length + problems.length + errs.length;
  console.log(fail ? `\n→ ${fail} chỗ cần sửa trước khi render.`
                   : '\n→ Sạch. Render được.');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('❌', e.message); process.exit(2); });
