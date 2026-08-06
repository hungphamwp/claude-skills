/**
 * ============================================================
 * VIDEO QUẢNG CÁO DỌC 1080×1920 — script.js
 * ============================================================
 *
 * Toàn bộ nội dung, màu sắc và thời điểm hiệu ứng đến từ
 * config.json. File này KHÔNG chứa nội dung cứng — muốn đổi
 * video thì đổi config, không sửa code.
 *
 * config._schedule đã được build_video.py tính sẵn (thời điểm
 * gõ từng ô, tốc độ gõ, mốc chạy giá). record.js và
 * build_audio.py đọc đúng khối đó → hình, tiếng và SFX luôn
 * khớp nhau mà không phải đồng bộ công thức ở 3 nơi.
 *
 * RENDER MODE (?render=1): GSAP bị pause ngay sau khi dựng
 * xong timeline; record.js seek từng frame rồi chụp màn hình.
 * ============================================================
 */

const IS_RENDER_MODE = new URLSearchParams(location.search).get('render') === '1';

/* ============================================================
   1. SCALE STAGE — thu 1080×1920 vừa khung trình duyệt
   ============================================================ */
function scaleStage() {
  const stage = document.getElementById('stage');
  const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
  stage.style.transform = `scale(${scale})`;
  document.getElementById('scale-root').style.height = `${window.innerHeight}px`;
}
window.addEventListener('resize', scaleStage);

/* ============================================================
   2. ÁP CONFIG VÀO DOM
   ============================================================ */
function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  const hex2rgb = (h) => {
    const v = h.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(v.substr(i, 2), 16)).join(', ');
  };

  if (theme.accent) {
    root.setProperty('--color-accent', theme.accent);
    root.setProperty('--color-accent-rgb', hex2rgb(theme.accent));
  }
  if (theme.accent2) {
    root.setProperty('--color-accent-pink', theme.accent2);
    root.setProperty('--color-accent-pink-rgb', hex2rgb(theme.accent2));
  }
  if (theme.accent3) {
    root.setProperty('--color-accent-blue', theme.accent3);
    root.setProperty('--color-accent-blue-rgb', hex2rgb(theme.accent3));
  }
  if (theme.bg) root.setProperty('--color-bg', theme.bg);

  // Màu chữ nhấn (tiêu đề dòng 2, số tiền, tab đang chọn, SĐT ở chân trang).
  // Không khai báo thì pha sáng từ accent — đổi theme là cả bộ chữ đi theo,
  // không còn chỗ nào kẹt lại màu tím của thương hiệu mặc định.
  const lighten = (hex, amt) => {
    const v = hex.replace('#', '');
    const c = [0, 2, 4].map((i) => parseInt(v.substr(i, 2), 16));
    return '#' + c.map((x) => Math.round(x + (255 - x) * amt).toString(16).padStart(2, '0')).join('');
  };
  if (theme.text_accent) {
    root.setProperty('--color-text-accent', theme.text_accent);
  } else if (theme.accent) {
    root.setProperty('--color-text-accent', lighten(theme.accent, 0.55));
  }

  if (theme.accent && theme.accent2 && theme.accent3) {
    root.setProperty('--gradient-brand',
      `linear-gradient(135deg, ${theme.accent3} 0%, ${theme.accent} 52%, ${theme.accent2} 100%)`);
  }
  if (theme.gradient_text) root.setProperty('--gradient-text', theme.gradient_text);
}

function applyContent(cfg) {
  const set  = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };
  const icon = (id, cls) => { const e = document.getElementById(id); if (e && cls) e.className = e.className.replace(/fa-solid[^ ]*|fa-[a-z0-9-]+/g, '').trim() + ` fa-solid ${cls}`; };

  const b = cfg.brand, c = cfg.content;

  /* Thanh trên */
  const nameEl = document.getElementById('brand-name');
  nameEl.innerHTML = '';
  nameEl.append(document.createTextNode(b.name_bold || ''));
  const light = document.createElement('span');
  light.textContent = b.name_light || '';
  nameEl.appendChild(light);
  set('brand-status', b.status || '');
  if (b.logo === false) document.getElementById('top-mark').style.display = 'none';

  /* Badge */
  set('badge-text', c.badge);
  icon('badge-icon', c.badge_icon);

  /* Tiêu đề */
  set('headline-line1', c.headline1);
  set('headline-line2', c.headline2);
  set('sub-tagline',    c.subtagline);

  /* Logo giữa màn */
  if (c.hero_mark === false) document.getElementById('hero-mark').style.display = 'none';

  /* Chips dịch vụ */
  const chips = document.getElementById('chips');
  chips.innerHTML = '';
  (c.chips || []).forEach((ch) => {
    const li = document.createElement('li');
    li.className = 'chip';
    li.innerHTML = `<i class="fa-solid ${ch.icon}" aria-hidden="true"></i>`;
    li.append(document.createTextNode(ch.text));
    chips.appendChild(li);
  });

  /* Modal */
  set('modal-title', c.modal_title);
  set('modal-badge', c.modal_badge);

  /* Tabs */
  const tabs = document.getElementById('tabs');
  tabs.innerHTML = '';
  (c.tabs || []).forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab' + (t.active ? ' tab--active' : '');
    btn.id = `tab-${i}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(!!t.active));
    btn.innerHTML = `<i class="fa-solid ${t.icon} tab__icon" aria-hidden="true"></i>`;
    btn.append(document.createTextNode(t.text));
    tabs.appendChild(btn);
  });

  /* Các ô form — chèn TRƯỚC hàng giá */
  const form     = document.getElementById('form-fields');
  const priceRow = document.getElementById('price-row');
  (c.fields || []).forEach((f, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    wrap.id = `field-${i}`;
    wrap.innerHTML = `
      <label class="field__label" for="input-${i}">${f.label}</label>
      <div class="field__input-wrap">
        <i class="fa-solid ${f.icon} field__icon" aria-hidden="true"></i>
        <input class="field__input" id="input-${i}" type="text"
               placeholder="${f.placeholder || ''}"
               value="${f.static ? (f.value || '') : ''}"
               autocomplete="off" readonly />
      </div>`;
    form.insertBefore(wrap, priceRow);
  });

  /* Giá + CTA */
  set('price-label', c.price_label);
  icon('price-icon', c.price_icon || 'fa-tag');
  set('cta-text', c.cta);
  icon('cta-icon', c.cta_icon || 'fa-phone');

  /* Chân trang: text · dot · text · dot · text-phát-sáng */
  const foot = document.getElementById('bottom-tagline');
  foot.innerHTML = '';
  (c.footer || []).forEach((txt, i, arr) => {
    const span = document.createElement('span');
    span.className = (i === arr.length - 1) ? 'bottom-tagline__glow' : 'bottom-tagline__text';
    span.textContent = txt;
    foot.appendChild(span);
    if (i < arr.length - 1) {
      const dot = document.createElement('span');
      dot.className = 'bottom-tagline__dot';
      foot.appendChild(dot);
    }
  });
}

/* ============================================================
   3. FIT LAYOUT
   Modal cao bao nhiêu là do số ô form + cỡ chữ quyết định, nên
   không thể đặt cứng chiều cao logo giữa màn. Thu nhỏ dần logo
   đến khi chips không còn đè lên modal; hết cỡ thì ẩn hẳn.
   ============================================================ */
function fitLayout() {
  const modal = document.getElementById('quote-modal');
  const chips = document.getElementById('chips');
  const hero  = document.getElementById('hero-mark');
  if (!modal || !chips || !hero || hero.style.display === 'none') return;

  const modalTop = modal.offsetTop;
  let guard = 0;

  while (chips.offsetTop + chips.offsetHeight > modalTop - 24 && guard++ < 60) {
    const next = hero.offsetWidth - 10;
    if (next < 90) { hero.style.display = 'none'; break; }
    hero.style.width  = `${next}px`;
    hero.style.height = `${next}px`;
  }
}

/* ============================================================
   4. SPLIT TYPE + GRADIENT CHỮ
   background-clip:text của thẻ cha không áp được cho .char
   (inline-block), nên phải vẽ gradient lên từng ký tự và lệch
   background-position theo vị trí để nhìn như một dải liền.
   ============================================================ */
function setupSplitText() {
  return {
    split1: new SplitType('#headline-line1', { types: 'chars' }),
    split2: new SplitType('#headline-line2', { types: 'chars' }),
  };
}

function paintGradientChars(gradient) {
  const line  = document.getElementById('headline-line2');
  const chars = line ? line.querySelectorAll('.char') : [];
  if (!chars.length) return;

  const lineWidth = line.offsetWidth;
  const baseLeft  = chars[0].offsetLeft;

  chars.forEach((c) => {
    c.style.backgroundImage      = gradient;
    c.style.backgroundSize       = `${lineWidth}px 100%`;
    c.style.backgroundPosition   = `${-(c.offsetLeft - baseLeft)}px 0`;
    c.style.webkitBackgroundClip = 'text';
    c.style.backgroundClip       = 'text';
    c.style.webkitTextFillColor  = 'transparent';
  });
}

/* ============================================================
   5. TYPING + PRICE (bỏ qua trong render mode — record.js lo)
   ============================================================ */
function typeIntoInput(input, text, baseMs) {
  if (IS_RENDER_MODE) return;
  input.value = '';
  let i = 0;
  (function next() {
    if (i >= text.length) return;
    input.value += text[i++];
    setTimeout(next, Math.max(30, baseMs + Math.random() * 60 - 30));
  })();
}

function animatePriceCounter(el, target, duration) {
  if (IS_RENDER_MODE) return;
  const counter = { value: 0 };
  gsap.to(counter, {
    value: target, duration, ease: 'power3.out',
    onUpdate()   { el.textContent = `${Math.floor(counter.value).toLocaleString('vi-VN')}đ`; },
    onComplete() { el.textContent = `${target.toLocaleString('vi-VN')}đ`; },
  });
}

/* ============================================================
   6. AMBIENT MOTION
   ============================================================ */
function startAmbientMotion() {
  const tracker = document.getElementById('glow-tracker');
  gsap.to(tracker, { x: 80, y: 120, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to(tracker, { x: -60, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1 });
  gsap.to('.hero-mark__img', { y: -16, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
}

/* ============================================================
   7. TIMELINE
   ============================================================ */
function buildTimeline(cfg, { split1, split2 }) {
  const L  = cfg._schedule.labels;
  const S  = cfg._schedule;
  const A  = cfg.theme.accent_rgb || '139, 92, 246';
  const tl = gsap.timeline({
    repeat: IS_RENDER_MODE ? 0 : -1,
    repeatDelay: 0.5,
    defaults: { ease: 'power3.out' },
  });

  /* Nền */
  tl.addLabel('bg', 0)
    .to('#bg-layer', { opacity: 1, duration: 1.2, ease: 'power2.out' }, 'bg')
    .to('#bg-grid',  { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 'bg+=0.2')
    .to('.bg-glow',  { opacity: 1, duration: 2, stagger: 0.3, ease: 'power2.out' }, 'bg+=0.1')
    .to('.deco-line',{ opacity: 1, duration: 1, stagger: 0.4, ease: 'power2.out' }, 'bg+=0.5')
    .to('#top-bar',  { opacity: 1, y: 0, duration: 0.8 }, 'bg+=0.3');

  /* Badge */
  tl.addLabel('badge', L.badge)
    .to('#badge', { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' }, 'badge');

  /* Tiêu đề */
  tl.addLabel('headline', L.headline)
    .to(split1.chars, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out' }, 'headline')
    .to('#sub-tagline', { opacity: 1, y: 0, duration: 0.6 }, 'headline+=0.6')
    .to(split2.chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'back.out(1.4)' }, 'headline+=0.9');

  /* Logo giữa màn */
  tl.addLabel('logo', L.logo)
    .to('#hero-mark', { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, 'logo');

  /* Modal */
  tl.addLabel('modal', L.modal)
    .to('#quote-modal', { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out' }, 'modal');

  /* Chips */
  tl.addLabel('chips', L.chips)
    .to('.chip', { opacity: 1, y: 0, duration: 0.55, stagger: 0.13, ease: 'back.out(1.7)' }, 'chips');

  /* Tabs */
  tl.addLabel('tabs', L.tabs)
    .to('.tab', { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)' }, 'tabs');

  /* Các ô form hiện lần lượt */
  tl.addLabel('fields', L.fields);
  (cfg.content.fields || []).forEach((f, i) => {
    tl.to(`#field-${i}`, { opacity: 1, y: 0, duration: 0.5 }, `fields+=${(i * 0.18).toFixed(2)}`);
  });

  /* Gõ chữ — viền sáng lên rồi tắt, chữ do record.js hoặc typeIntoInput điền */
  S.typing.forEach((t) => {
    tl.to(`#${t.input}`, {
        borderColor: `rgba(${A}, 0.6)`,
        boxShadow:   `0 0 0 4px rgba(${A}, 0.18)`,
        duration: 0.3, ease: 'power2.out',
      }, t.highlight_at)
      .call(() => {
        typeIntoInput(document.getElementById(t.input), t.text, t.ms_per_char);
      }, null, t.type_start)
      .to(`#${t.input}`, {
        borderColor: 'rgba(255, 255, 255, 0.10)',
        boxShadow:   'none',
        duration: 0.3, ease: 'power2.out',
      }, t.unhighlight_at);
  });

  /* Giá + CTA */
  tl.addLabel('price', L.price)
    .to('#price-row', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, 'price')
    .call(() => {
      animatePriceCounter(document.getElementById('price-amount'), S.price.target, S.price.duration);
    }, null, S.price.start)
    .to('#cta-btn', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }, 'price+=1.0')
    .to('#cta-btn', {
      boxShadow: `0 4px 56px rgba(${A}, 0.85), 0 1px 4px rgba(0,0,0,0.4)`,
      duration: 0.8, ease: 'power2.out',
    }, 'price+=1.6');

  /* Chân trang */
  tl.addLabel('tagline', L.tagline)
    .to('#bottom-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 'tagline')
    .to('.bottom-tagline__glow', {
      textShadow: `0 0 30px rgba(${A}, 0.95)`, duration: 0.6, ease: 'power2.out',
    }, 'tagline+=0.4');

  /* Kết */
  tl.addLabel('out', L.fadeout)
    .to(['#quote-modal', '#badge', '#sub-tagline', '#bottom-tagline', '#hero-mark'], {
      opacity: 0, duration: 0.6, ease: 'power2.inOut', stagger: 0.05,
    }, 'out')
    .to('.chip', { opacity: 0, y: 10, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, 'out')
    .to('.char', { opacity: 0, y: -20, duration: 0.4, stagger: 0.02, ease: 'power2.in' }, 'out+=0.1')
    .to(['#bg-layer', '#bg-grid', '.bg-glow', '.deco-line', '#top-bar'], {
      opacity: 0, duration: 0.8, ease: 'power2.inOut',
    }, 'out+=0.3')
    .call(() => { if (!IS_RENDER_MODE) resetForLoop(cfg); }, null, 'out+=0.8');

  tl.totalDuration(cfg.output.duration);
  return tl;
}

/* ============================================================
   8. RESET (chỉ dùng khi loop trong trình duyệt)
   ============================================================ */
function resetForLoop(cfg) {
  (cfg._schedule.typing || []).forEach((t) => {
    const el = document.getElementById(t.input);
    if (el) el.value = '';
  });
  gsap.set(['#bg-layer', '#bg-grid', '.bg-glow', '.deco-line'], { opacity: 0 });
  gsap.set('#top-bar',        { opacity: 0, y: -10 });
  gsap.set('#badge',          { opacity: 0, y: 20 });
  gsap.set('.char',           { opacity: 0, y: 60 });
  gsap.set('#sub-tagline',    { opacity: 0, y: 16 });
  gsap.set('#hero-mark',      { opacity: 0, scale: 0.86 });
  gsap.set('.chip',           { opacity: 0, y: 14 });
  gsap.set('#quote-modal',    { opacity: 0, y: 60, scale: 0.96 });
  gsap.set('.tab',            { opacity: 0, y: 12 });
  gsap.set('.field',          { opacity: 0, y: 20 });
  gsap.set('#price-row',      { opacity: 0, y: 16 });
  gsap.set('#cta-btn',        { opacity: 0, y: 16 });
  gsap.set('#bottom-tagline', { opacity: 0, y: 30 });
  document.getElementById('price-amount').textContent = '0đ';
}

function setupInitialStates() {
  gsap.set('#top-bar',        { opacity: 0, y: -10 });
  gsap.set('.char',           { opacity: 0, y: 60 });
  gsap.set('#badge',          { opacity: 0, y: 20 });
  gsap.set('#sub-tagline',    { opacity: 0, y: 16 });
  gsap.set('#hero-mark',      { opacity: 0, scale: 0.86 });
  gsap.set('.chip',           { opacity: 0, y: 14 });
  gsap.set('#quote-modal',    { opacity: 0, y: 60, scale: 0.96 });
  gsap.set('.tab',            { opacity: 0, y: 12 });
  gsap.set('.field',          { opacity: 0, y: 20 });
  gsap.set('#price-row',      { opacity: 0, y: 16 });
  gsap.set('#cta-btn',        { opacity: 0, y: 16 });
  gsap.set('#bottom-tagline', { opacity: 0, y: 30 });
}

/* ============================================================
   9. INIT
   ============================================================ */
async function init() {
  const cfg = await fetch('config.json?v=' + Date.now()).then((r) => r.json());
  window.__AD = cfg;   // record.js / preview.js đọc lịch trình từ đây

  scaleStage();
  applyTheme(cfg.theme);
  applyContent(cfg);

  // Chờ font Inter + Font Awesome để đo chiều cao chuẩn rồi mới fit
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  fitLayout();

  const splits = setupSplitText();
  paintGradientChars(cfg.theme.gradient_text ||
    'linear-gradient(135deg, #60a5fa 0%, #a78bfa 45%, #f0a6ff 100%)');

  setupInitialStates();
  startAmbientMotion();

  const tl = buildTimeline(cfg, splits);
  window.__AD_TIMELINE = tl;

  if (IS_RENDER_MODE) {
    gsap.globalTimeline.pause(0);
    console.log('[RENDER MODE] GSAP paused.');
  } else {
    tl.play();
  }

  window.__AD_READY = true;   // record.js đợi cờ này
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
