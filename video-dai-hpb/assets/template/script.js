/* ==========================================================
   script.js — Dựng DOM 48 cảnh + master timeline GSAP 180s
   Mọi chuyển động đều do GSAP điều khiển để seek() ra đúng
   frame — không dùng CSS animation (CSS không seek được).
   ========================================================== */

const FPS = 30, DUR = 180;
const $ = (s, r = document) => r.querySelector(s);

function E(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ============================================================
   NỀN
   ============================================================ */
function initBg(tl) {
  const p = $('#bg-particles');
  for (let i = 0; i < 34; i++) {
    const b = E('b');
    const sz = 2 + Math.random() * 3;
    b.style.width = b.style.height = sz + 'px';
    b.style.left = (Math.random() * 1080) + 'px';
    b.style.top  = (Math.random() * 1920) + 'px';
    b.style.opacity = (0.15 + Math.random() * 0.30).toFixed(2);
    p.appendChild(b);
    const y0 = Math.random() * 420;          // lệch pha bằng vị trí đầu, không dùng delay âm
    tl.fromTo(b, { y: y0 }, {
      y: y0 - (300 + Math.random() * 500), x: (Math.random() - .5) * 90,
      duration: 14 + Math.random() * 16, repeat: -1, ease: 'none',
    }, 0);
  }
  // mesh trôi chậm
  tl.to('#bg-mesh .m1', { x: 130, y: -90, duration: 21, repeat:-1, yoyo:true, ease:'sine.inOut' }, 0);
  tl.to('#bg-mesh .m2', { x:-110, y: 120, duration: 25, repeat:-1, yoyo:true, ease:'sine.inOut' }, 0);
  tl.to('#bg-mesh .m3', { x:  90, y:-130, duration: 18, repeat:-1, yoyo:true, ease:'sine.inOut' }, 0);
}

/* ============================================================
   TRANG CÀ PHÊ MINI (dùng trong mockup điện thoại)
   ============================================================ */
function coffeeSite(light) {
  const menu = SITE_MENU.map(([n, p]) =>
    `<div class="site-item"><u></u><b>${n}</b><s>${p}</s></div>`).join('');
  return `
  <div class="site${light ? ' light' : ''}">
    <div class="site-hero">
      <div class="ph"></div>
      <div class="site-nav"><div class="site-logo">CỎ MÂY</div>
        <div class="site-burger"><u></u><u></u><u></u></div></div>
      <div class="site-h1">Cà phê pha tay,<br>mỗi sáng</div>
      <div class="site-p">Mở cửa 6:30 — 22:00 · 12 Trần Hưng Đạo</div>
      <div class="site-btn" id="site-cta">Đặt bàn</div>
    </div>
    <div class="site-sec"><div class="site-t">Thực đơn</div>
      <div class="site-grid">${menu}</div></div>
    <div class="site-sec"><div class="site-t">Không gian</div>
      <div class="site-gal"><u></u><u></u><u></u><u></u></div></div>
    <div class="site-sec"><div class="site-t">Đặt bàn</div>
      <div class="site-form"><u></u><u></u><u></u></div>
      <div class="site-btn" style="position:relative;left:0;bottom:0;display:inline-block">Gửi</div></div>
    <div class="site-foot">CỎ MÂY COFFEE<br>12 Trần Hưng Đạo · 0987 654 321</div>
  </div>`;
}

function portfolioSite() {
  return `
  <div class="site" style="background:#0B0D16">
    <div style="padding:70px 30px 40px;text-align:center">
      <div style="width:130px;height:130px;border-radius:50%;margin:0 auto 26px;
        background:linear-gradient(150deg,#8B5CF6,#22D3EE)"></div>
      <div style="font-size:34px;font-weight:800;color:#fff">Minh Anh</div>
      <div style="font-size:20px;color:rgba(255,255,255,.55);margin-top:8px">
        Web Designer · Hà Nội</div>
    </div>
    <div style="padding:0 30px">
      ${['Xem dự án','Liên hệ','Tải CV'].map((t,i)=>`
      <div class="pf-btn" style="height:64px;border-radius:16px;margin-bottom:16px;
        display:flex;align-items:center;justify-content:center;font-size:22px;
        font-weight:600;color:#fff;background:${i===0
          ? 'linear-gradient(120deg,#8B5CF6,#22D3EE)'
          : 'rgba(255,255,255,.07)'};
        border:1px solid rgba(255,255,255,.10)">${t}</div>`).join('')}
    </div>
  </div>`;
}

/* ============================================================
   MẢNH GHÉP DÙNG CHUNG
   ============================================================ */
function kickerEl(sc) {
  if (!sc.kicker) return null;
  return E('div', 'kicker ' + (sc.kickerCls || ''), sc.kicker);
}
function badgeEl(sc) {
  if (!sc.badge) return null;
  return E('div', 'badge-n ' + (sc.badgeCls || ''), sc.badge);
}
function chipsEl(list, cls) {
  const w = E('div', 'chips');
  list.forEach(c => w.appendChild(
    E('div', 'chip ' + (c.cls || cls || ''), `<i class="fa-solid ${c.ic}"></i>${c.t}`)));
  return w;
}

/* Gõ chữ theo GSAP — seek ra đúng ký tự tại mọi thời điểm */
function typeTween(tl, node, text, cps, at, hl) {
  const o = { n: 0 };
  const dur = Math.max(text.length / cps, 0.05);
  tl.to(o, {
    n: text.length, duration: dur, ease: 'none',
    onUpdate() {
      const k = Math.floor(o.n);
      let s = esc(text.slice(0, k));
      if (hl) hl.forEach(w => {
        const e = esc(w);
        if (s.includes(e)) s = s.split(e).join(`<span class="hl">${e}</span>`);
      });
      node.innerHTML = s + '<span class="caret"></span>';
    },
  }, at);
  return dur;
}

/* ============================================================
   LAYOUT
   ============================================================ */
const L = {};

/* ---------- title ---------- */
L.title = (sc) => {
  const s = E('div', 'safe'), parts = [];
  const k = kickerEl(sc); if (k) { s.appendChild(k); parts.push([k, 0]); }
  if (sc.icon) {
    const i = E('div', 'badge-n er', `<i class="fa-solid ${sc.icon}"></i>`);
    s.appendChild(i); parts.push([i, .05]);
  }
  const h = E('div', sc.h1cls || 'h1', sc.h1); s.appendChild(h); parts.push([h, .12]);
  if (sc.sub) { const p = E('div', 'sub', sc.sub); s.appendChild(p); parts.push([p, .3]); }
  let st2 = null;
  if (sc.stage2) {
    st2 = E('div', sc.stage2.cls, sc.stage2.h1);
    st2.style.marginTop = '40px'; s.appendChild(st2);
  }
  return { node: s, anim(tl, t0, d) {
    parts.forEach(([n, dl]) => tl.fromTo(n,
      { y: 62, opacity: 0 }, { y: 0, opacity: 1, duration: .55, ease: 'back.out(1.5)' }, t0 + .1 + dl));
    if (st2) {
      tl.fromTo(st2, { scale: .6, opacity: 0 },
        { scale: 1, opacity: 1, duration: .6, ease: 'back.out(1.9)' }, t0 + sc.stage2.at);
      tl.to(h, { opacity: .45, scale: .92, duration: .5, ease: 'power2.out' }, t0 + sc.stage2.at);
    }
    if (sc.punch) tl.fromTo(s, { scale: 1.14 }, { scale: 1, duration: .5, ease: 'power4.out' }, t0);
  }};
};

/* ---------- bignum ---------- */
L.bignum = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  const num = E('div', 'hero-num ' + (sc.mood === 'gray' ? 'dim' : 'gm ' + (sc.glow ? 'glow-hi' : 'glow-v')), sc.num);
  s.appendChild(num);
  const sub = sc.sub ? E('div', 'sub', sc.sub) : null; if (sub) s.appendChild(sub);
  let bar = null, fill = null;
  if (sc.prog != null) {
    bar = E('div', ''); bar.style.cssText =
      'width:760px;height:22px;border-radius:999px;background:rgba(255,255,255,.09);margin-top:52px;overflow:hidden';
    fill = E('div', ''); fill.style.cssText =
      'height:100%;width:0;border-radius:999px;background:#7A8194';
    bar.appendChild(fill); s.appendChild(bar);
  }
  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .1);
    tl.fromTo(num, { scale: 1.3, opacity: 0 },
      { scale: 1, opacity: 1, duration: .6, ease: 'power4.out' }, t0 + .15);
    if (sub) tl.fromTo(sub, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .45 }, t0 + .45);
    if (fill) {
      tl.to(fill, { width: sc.prog + '%', duration: 1.15, ease: 'power2.out' }, t0 + .5);
      tl.to(fill, { backgroundColor: '#FF4D6D', duration: .35 }, t0 + 1.9);
      tl.to(bar, { x: 4, duration: .06, repeat: 5, yoyo: true }, t0 + 1.9);
    }
    if (sc.glow) tl.to(num, { textShadow: '0 0 60px rgba(139,92,246,1), 0 0 130px rgba(232,56,255,.7)',
      duration: .5, yoyo: true, repeat: 1 }, t0 + .9);
  }};
};

/* ---------- code ---------- */
L.code = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  const win = E('div', 'win');
  win.appendChild(E('div', 'win-bar',
    '<u class="r"></u><u class="y"></u><u class="g2"></u><span>index.html</span>'));
  const body = E('div', 'win-body'); win.appendChild(body);
  const rows = sc.lines.map(ln => {
    const r = E('div', '', ln.map(([c, t]) => `<span class="${c}">${t}</span>`).join(''));
    body.appendChild(r); return r;
  });
  s.appendChild(win);

  let files = null;
  if (sc.files) {
    files = E('div', ''); files.style.cssText = 'margin-top:34px;display:flex;gap:20px';
    sc.files.forEach(f => files.appendChild(E('div', 'chip ok',
      `<i class="fa-solid fa-circle-check"></i>${f.n}`)));
    s.appendChild(files);
  }
  let timer = null;
  if (sc.timer) {
    timer = E('div', 'sub sm'); timer.style.cssText = 'font-family:var(--mono);margin-top:26px';
    s.appendChild(timer);
  }
  if (sc.sub) s.appendChild(E('div', 'sub sm', sc.sub));

  let ov = null;
  if (sc.overlay) {
    ov = E('div', ''); ov.style.cssText =
      'position:absolute;left:0;top:0;width:920px;height:1280px;display:flex;' +
      'flex-direction:column;align-items:center;justify-content:center';
    ov.appendChild(E('div', 'h1 glow-v', sc.overlay.h1));
    ov.appendChild(E('div', 'sub dim', sc.overlay.sub));
    s.appendChild(ov);
  }
  let mag = null;
  if (sc.magnify) {
    mag = E('div', 'chip er', '<i class="fa-solid fa-arrow-turn-up"></i>lỗi ở dòng này');
    mag.style.cssText += 'margin-top:28px;font-size:38px';
    s.appendChild(mag);
  }

  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .05);
    tl.fromTo(win, { y: 60, opacity: 0, scale: .96 },
      { y: 0, opacity: 1, scale: 1, duration: .5, ease: 'power3.out' }, t0 + .1);
    rows.forEach((r, i) => tl.fromTo(r,
      { opacity: 0, x: -22 }, { opacity: 1, x: 0, duration: .22, ease: 'power2.out' },
      t0 + .35 + i * sc.speed));
    if (sc.fast) tl.to(win, { y: -60, duration: d - 1, ease: 'none' }, t0 + .6);
    if (files) sc.files.forEach((f, i) => tl.fromTo(files.children[i],
      { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: 'back.out(2)' }, t0 + f.at));
    if (timer) { const o = { v: sc.timer };
      tl.to(o, { v: 0, duration: d - .6, ease: 'none',
        onUpdate() { timer.textContent = '00:' + String(Math.ceil(o.v)).padStart(2, '0'); } }, t0 + .3);
    }
    if (ov) {
      tl.set(ov, { opacity: 0 }, t0);
      tl.to(win, { filter: 'blur(9px)', opacity: .35, scale: .95, duration: .45 }, t0 + sc.overlay.at);
      tl.fromTo(ov, { opacity: 0, scale: 1.18 },
        { opacity: 1, scale: 1, duration: .5, ease: 'power4.out' }, t0 + sc.overlay.at);
    }
    if (sc.errorLine != null) {
      const er = rows[sc.errorLine - 1];
      tl.to(er, { backgroundColor: 'rgba(255,77,109,.20)', duration: .3 }, t0 + 1.0);
      tl.to(er, { opacity: .6, duration: .3, yoyo: true, repeat: 3 }, t0 + 1.3);
      rows.forEach((r, i) => { if (i !== sc.errorLine - 1)
        tl.to(r, { opacity: .5, duration: .4 }, t0 + 1.0); });
      tl.to(er, { scale: 1.06, x: 10, duration: .4, ease: 'back.out(2)',
                  transformOrigin: 'left center' }, t0 + 1.0);
    }
    if (mag) tl.fromTo(mag, { scale: .7, opacity: 0 },
      { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2.2)' }, t0 + 1.5);
  }};
};

/* ---------- chat ---------- */
L.chat = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  if (sc.h2) s.appendChild(E('div', 'h2', sc.h2));

  const wrap = E('div', ''); wrap.style.cssText =
    'display:flex;flex-direction:column;align-items:center;width:920px;margin-top:34px';
  const [icon, ...lb] = (sc.label || 'fa-comment · chat').split(' · ');
  wrap.appendChild(E('div', 'prompt-label',
    `<i class="fa-solid ${icon}"></i> ${lb.join(' · ')}`));
  const box = E('div', 'prompt-box glass');
  const txt = E('span', '', ''); box.appendChild(txt);
  wrap.appendChild(box); s.appendChild(wrap);

  let ph = null, cta = null;
  if (sc.phone) {
    ph = E('div', 'phone'); ph.style.cssText = 'transform:scale(.52);margin-top:-120px';
    ph.innerHTML = `<div class="phone-screen"><div class="phone-scroll">${coffeeSite(false)}</div></div>`;
    s.appendChild(ph);
    cta = ph.querySelector('#site-cta');
  }
  let ent = null;
  if (sc.enter) {
    ent = E('div', 'chip cy', '<i class="fa-solid fa-turn-down fa-rotate-90"></i>Enter');
    ent.style.marginTop = '30px'; s.appendChild(ent);
  }
  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .05);
    tl.fromTo(wrap, { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: .5, ease: 'back.out(1.4)' }, t0 + .12);
    tl.to(box, { boxShadow: '0 0 70px rgba(139,92,246,.42), inset 0 1px 0 rgba(255,255,255,.12)',
      duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' }, t0);
    if (sc.idle) {
      txt.innerHTML = '<span class="caret"></span>';
      tl.to(txt.firstChild || txt, { opacity: .2, duration: .3, repeat: 8, yoyo: true }, t0 + .5);
    } else if (sc.type) {
      typeTween(tl, txt, sc.type, sc.speed, t0 + .5, sc.hl);
    }
    if (ph) {
      tl.fromTo(ph, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .5 }, t0 + .3);
      if (sc.effect === 'btn' && cta) {
        tl.to(cta, { scale: 1.42, backgroundColor: '#F97316', duration: .45,
          ease: 'back.out(2.2)', transformOrigin: 'left center' }, t0 + 2.7);
      }
    }
    if (ent) {
      tl.fromTo(ent, { scale: .6, opacity: 0 },
        { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2.4)' }, t0 + d - .8);
    }
  }};
};

/* ---------- term ---------- */
L.term = (sc) => {
  const s = E('div', 'safe');
  const b = badgeEl(sc); if (b) s.appendChild(b);
  if (sc.h2) s.appendChild(E('div', 'h2', sc.h2));
  const win = E('div', 'win'); win.style.marginTop = '40px';
  win.appendChild(E('div', 'win-bar',
    '<u class="r"></u><u class="y"></u><u class="g2"></u><span>zsh — dự án</span>'));
  const body = E('div', 'win-body'); win.appendChild(body);
  const cmdRow = E('div', '', '<span class="ok">➜</span> <span class="pl"></span>');
  body.appendChild(cmdRow);
  const cmdTx = cmdRow.querySelector('.pl');
  const outRows = (sc.out || []).map(o => {
    const r = E('div', o.cls, o.tx); r.style.marginTop = '12px'; body.appendChild(r); return r;
  });
  s.appendChild(win);
  return { node: s, anim(tl, t0, d) {
    if (b) tl.fromTo(b, { scale: .6, opacity: 0 },
      { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }, t0 + .05);
    tl.fromTo(win, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .45 }, t0 + .15);
    typeTween(tl, cmdTx, sc.cmd, 26, t0 + .45);
    outRows.forEach((r, i) => tl.fromTo(r,
      { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: .25 }, t0 + sc.out[i].at));
    const okRow = outRows[outRows.length - 1];
    if (okRow) tl.to(win, { borderColor: 'rgba(52,211,153,.6)',
      boxShadow: '0 0 60px rgba(52,211,153,.35)', duration: .4 }, t0 + sc.out[sc.out.length - 1].at);
  }};
};

/* ---------- cards ---------- */
L.cards = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  const wrap = E('div', ''); wrap.style.cssText = 'display:flex;flex-direction:column;gap:22px';
  const nodes = sc.items.map(it => {
    const c = E('div', 'card ' + (it.cls || ''));
    if (sc.sm) { c.style.padding = '24px 30px'; }
    c.innerHTML =
      (it.n ? `<div class="n">${it.n}</div>` : '') +
      `<div class="ic"><i class="fa-solid ${it.ic}"></i></div>` +
      `<div class="t"${sc.sm ? ' style="font-size:40px"' : ''}>${it.t}</div>`;
    if (sc.mood === 'gray') { c.style.filter = 'grayscale(1)'; c.style.borderLeftColor = '#5C6478'; }
    wrap.appendChild(c); return c;
  });
  s.appendChild(wrap);
  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .05);
    nodes.forEach((c, i) => {
      if (sc.drop) {
        tl.fromTo(c, { y: -320, opacity: 0 },
          { y: 0, opacity: 1, duration: .75, ease: 'bounce.out' }, t0 + .25 + i * .2);
      } else {
        tl.fromTo(c, { x: -90, opacity: 0 },
          { x: 0, opacity: 1, duration: .5, ease: 'power3.out' }, t0 + .2 + i * (sc.sm ? .16 : .26));
      }
    });
  }};
};

/* ---------- cmp ---------- */
L.cmp = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  const b = badgeEl(sc); if (b) s.appendChild(b);
  if (sc.h2) s.appendChild(E('div', 'h2', sc.h2));
  const box = E('div', 'cmp');
  if (sc.col) box.style.flexDirection = 'column';
  box.style.marginTop = '44px';
  const mk = (o) => {
    const p = E('div', 'p ' + (o.cls || '').replace('strike-vl', '').replace('big', '').replace('faded', ''));
    p.innerHTML = (o.lb ? `<div class="lb">${o.lb}</div>` : '') +
      `<div class="vl">${o.vl}</div>`;
    if ((o.cls || '').includes('big')) p.querySelector('.vl').style.fontSize = '78px';
    if ((o.cls || '').includes('faded')) { p.style.opacity = '.4'; p.querySelector('.vl').style.fontSize = '46px'; }
    return p;
  };
  const lp = mk(sc.left), rp = mk(sc.right);
  box.appendChild(lp); box.appendChild(rp); s.appendChild(box);
  const strike = (sc.left.cls || '').includes('strike-vl');
  let bar = null;
  if (strike) {
    bar = E('i', ''); bar.style.cssText =
      'position:absolute;left:14%;top:50%;height:7px;width:72%;background:#FF4D6D;' +
      'border-radius:4px;transform-origin:left center;box-shadow:0 0 20px rgba(255,77,109,.8)';
    lp.style.position = 'relative'; lp.appendChild(bar);
  }
  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .05);
    if (b) tl.fromTo(b, { scale: .6, opacity: 0 },
      { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }, t0 + .05);
    const dir = sc.col ? 'y' : 'x';
    tl.fromTo(lp, { [dir]: -110, opacity: 0 },
      { [dir]: 0, opacity: 1, duration: .55, ease: 'power3.out' }, t0 + .25);
    tl.fromTo(rp, { [dir]: 110, opacity: 0 },
      { [dir]: 0, opacity: (sc.right.cls || '').includes('faded') ? .4 : 1,
        duration: .55, ease: 'power3.out' }, t0 + .40);
    tl.to(lp, { x: '+=6', duration: .06, repeat: 5, yoyo: true },
      t0 + (sc.col ? 99 : 1.1));
    if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: .35, ease: 'power2.inOut' }, t0 + 1.0);
    tl.to(rp, { boxShadow: '0 0 60px rgba(52,211,153,.34)', duration: .5 }, t0 + 1.2);
  }};
};

/* ---------- phone ---------- */
L.phone = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  if (sc.h2) s.appendChild(E('div', 'h2', sc.h2));
  if (sc.sub) s.appendChild(E('div', 'sub sm', sc.sub));

  const holder = E('div', ''); holder.style.cssText = 'position:relative;margin-top:26px';
  const ph = E('div', 'phone');
  const inner = sc.portfolio ? portfolioSite() : coffeeSite(!!sc.darkWipe);
  ph.innerHTML = `<div class="phone-screen"><div class="phone-scroll">${inner}</div></div>`;
  holder.appendChild(ph);

  // lớp tối chồng lên để làm hiệu ứng quét dark-mode
  let darkLayer = null;
  if (sc.darkWipe) {
    darkLayer = E('div', '');
    darkLayer.style.cssText =
      'position:absolute;left:0;top:0;width:100%;height:0;overflow:hidden';
    darkLayer.innerHTML = `<div class="phone-scroll">${coffeeSite(false)}</div>`;
    ph.querySelector('.phone-screen').appendChild(darkLayer);
  }
  if (sc.tag) {
    const tg = E('div', 'chip cy', sc.tag);
    tg.style.cssText += 'position:absolute;right:-30px;top:20px;font-size:34px;padding:12px 24px';
    holder.appendChild(tg);
  }
  s.appendChild(holder);

  let scale = 1;
  if (sc.overlayNum) scale = .80;
  else if (sc.tags) scale = .74;
  else if (sc.h2 || sc.kicker) scale = .86;
  ph.style.transform = `scale(${scale})`;
  ph.style.transformOrigin = 'center top';

  let num = null, scrim = null;
  if (sc.overlayNum) {
    scrim = E('div', ''); scrim.style.cssText =
      'position:absolute;left:-80px;right:-80px;bottom:-40px;height:520px;' +
      'background:linear-gradient(to top,rgba(5,6,15,.98) 42%,transparent)';
    holder.appendChild(scrim);
    num = E('div', 'hero-num gm glow-hi', sc.overlayNum);
    num.style.cssText += 'position:absolute;left:-80px;right:-80px;bottom:36px';
    holder.appendChild(num);
  }
  const tagsWrap = sc.tags ? E('div', '') : null;
  if (tagsWrap) {
    tagsWrap.style.cssText = 'position:absolute;left:-80px;right:-80px;top:820px;text-align:center';
    sc.tags.forEach(t => {
      const n = E('div', 'h2 cy', t); n.style.cssText += 'font-size:62px;margin-top:10px';
      tagsWrap.appendChild(n);
    });
    holder.appendChild(tagsWrap);
  }

  const scroller = ph.querySelectorAll('.phone-scroll');
  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .05);
    if (sc.reveal === 'morph') {
      tl.fromTo(ph, { scaleX: scale * .35, scaleY: scale * .12, opacity: 0, filter: 'blur(14px)' },
        { scaleX: scale, scaleY: scale, opacity: 1, filter: 'blur(0px)',
          duration: .65, ease: 'power3.inOut' }, t0 + .1);
    } else {
      tl.fromTo(ph, { y: 70, opacity: 0, scale: scale * .94 },
        { y: 0, opacity: 1, scale: scale, duration: .6, ease: 'power3.out' }, t0 + .1);
    }
    if (sc.scroll) scroller.forEach(el => tl.fromTo(el,
      { y: sc.scroll[0] }, { y: sc.scroll[1], duration: d - .5, ease: 'none' }, t0 + .4));
    if (darkLayer) tl.to(darkLayer,
      { height: '100%', duration: .75, ease: 'power2.inOut' }, t0 + .9);
    if (num) {
      tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: .4 }, t0 + .3);
      tl.fromTo(num, { scale: 1.35, opacity: 0, filter: 'blur(16px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: .6, ease: 'power4.out' }, t0 + .45);
    }
    if (tagsWrap) Array.from(tagsWrap.children).forEach((n, i) =>
      tl.fromTo(n, { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: .4, ease: 'back.out(1.7)' }, t0 + 1.7 + i * .55));
    if (sc.portfolio) {
      const btns = ph.querySelectorAll('.pf-btn');
      btns.forEach((b, i) => tl.fromTo(b, { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: .35, ease: 'back.out(1.6)' }, t0 + .7 + i * .16));
    }
    tl.to(ph, { scale: scale * 1.045, duration: d, ease: 'none' }, t0);
  }};
};

/* ---------- brw (responsive) ---------- */
L.brw = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  const holder = E('div', ''); holder.style.cssText =
    'position:relative;width:920px;height:660px;display:flex;align-items:center;justify-content:center';
  const w = E('div', 'brw'); w.style.width = '860px';
  w.innerHTML = `<div class="brw-bar"><u></u><u></u><u></u></div>
    <div class="brw-body"><div class="brw-hero"></div>
    <div class="brw-grid"><u></u><u></u><u></u><u></u><u></u><u></u></div></div>`;
  const grid = w.querySelector('.brw-grid');
  grid.style.gridTemplateColumns = 'repeat(3,1fr)';
  holder.appendChild(w);
  const lbl = E('div', 'chip cy'); lbl.style.cssText += 'position:absolute;bottom:-14px;font-size:34px';
  holder.appendChild(lbl);
  s.appendChild(holder);
  const names = ['Desktop', 'Tablet', 'Mobile'];
  return { node: s, anim(tl, t0, d) {
    if (k) tl.fromTo(k, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + .05);
    tl.fromTo(w, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .45 }, t0 + .1);
    lbl.textContent = names[0] + ' · 1440px';
    sc.widths.forEach(([px, cols], i) => {
      const at = t0 + .6 + i * 1.05;
      tl.to(w, { width: (px / 1440 * 860) + 'px', duration: .8, ease: 'power2.inOut' }, at);
      tl.set(grid, { gridTemplateColumns: `repeat(${cols},1fr)` }, at + .4);
      tl.set(lbl, { textContent: names[i] + ' · ' + px + 'px' }, at + .4);
      tl.fromTo(lbl, { scale: .8 }, { scale: 1, duration: .25, ease: 'back.out(2)' }, at + .4);
    });
  }};
};

/* ---------- tool ---------- */
const TOOL_WIN = {
  editor: `<div class="win-bar"><u class="r"></u><u class="y"></u><u class="g2"></u><span>Cursor</span></div>
    <div style="display:flex">
      <div class="win-body" style="flex:1.15;font-size:30px;border-right:1px solid rgba(255,255,255,.07)">
        <div><span class="tk">&lt;section</span><span class="at"> class</span>=<span class="st">"hero"</span><span class="tk">&gt;</span></div>
        <div><span class="pl">&nbsp;&nbsp;</span><span class="tk">&lt;h1&gt;</span><span class="pl">Cà phê…</span></div>
        <div><span class="cm">&nbsp;&nbsp;/* AI đang viết */</span></div>
        <div><span class="tk">&lt;/section&gt;</span></div>
      </div>
      <div class="win-body tool-chat" style="flex:1;font-size:28px;font-family:var(--font)">
        <div style="color:var(--tx3);margin-bottom:16px">CHAT</div>
        <div style="background:rgba(139,92,246,.20);border-radius:16px;padding:16px 18px;margin-bottom:14px">Thêm nút đặt bàn</div>
        <div style="background:rgba(255,255,255,.05);border-radius:16px;padding:16px 18px;color:var(--tx2)">Đã thêm vào hero ✓</div>
      </div>
    </div>`,
  terminal: `<div class="win-bar"><u class="r"></u><u class="y"></u><u class="g2"></u><span>zsh</span></div>
    <div class="win-body" style="font-size:32px">
      <div><span class="ok">➜</span> <span class="pl">claude</span></div>
      <div style="margin-top:14px" class="cm">✓ Đọc 42 file trong dự án</div>
      <div class="cm">✓ Sửa components/Header.jsx</div>
      <div class="cm">✓ Chạy test — 18/18 pass</div>
      <div class="ok">✓ Xong</div>
    </div>`,
  chat: `<div class="win-bar"><u class="r"></u><u class="y"></u><u class="g2"></u><span>ChatGPT</span></div>
    <div class="win-body" style="font-family:var(--font);font-size:30px">
      <div style="background:rgba(139,92,246,.20);border-radius:18px;padding:18px 22px;margin-left:180px">Viết 5 tiêu đề cho trang quán cà phê</div>
      <div style="background:rgba(255,255,255,.05);border-radius:18px;padding:18px 22px;margin-top:18px;margin-right:120px;color:var(--tx2);line-height:1.7">
        1. Cà phê pha tay, mỗi sáng<br>2. Nơi buổi sáng bắt đầu<br>3. Rang mộc, pha chậm<br>4. Một góc yên giữa phố<br>5. Ly đầu tiên trong ngày</div>
    </div>`,
  ghost: `<div class="win-bar"><u class="r"></u><u class="y"></u><u class="g2"></u><span>script.js</span></div>
    <div class="win-body" style="font-size:34px">
      <div><span class="kw">function</span><span class="pl"> datBan(</span><span class="pl">) {</span></div>
      <div><span class="pl">&nbsp;&nbsp;</span><span class="ghost" style="color:#4A5265">const form = document.querySelector(</span></div>
      <div><span class="cm">&nbsp;&nbsp;// nhấn Tab để nhận gợi ý</span></div>
      <div><span class="pl">}</span></div>
    </div>`,
};
L.tool = (sc) => {
  const s = E('div', 'safe');
  const nm = E('div', sc.nameSm ? 'h2' : 'h1', sc.name); s.appendChild(nm);
  const c = E('div', 'chip ' + (sc.chipCls || ''),
    (sc.star ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-solid fa-bolt"></i>') + sc.chip);
  c.style.marginTop = '24px'; s.appendChild(c);
  const win = E('div', 'win'); win.style.marginTop = '46px';
  win.innerHTML = TOOL_WIN[sc.win]; s.appendChild(win);
  const ghost = win.querySelector('.ghost');
  return { node: s, anim(tl, t0, d) {
    tl.fromTo(nm, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'back.out(1.4)' }, t0 + .08);
    tl.fromTo(c, { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }, t0 + .28);
    tl.fromTo(win, { y: 70, opacity: 0, scale: .96 },
      { y: 0, opacity: 1, scale: 1, duration: .55, ease: 'power3.out' }, t0 + .4);
    tl.to(win, { scale: 1.05, duration: d - .4, ease: 'none' }, t0 + .4);
    if (ghost) tl.to(ghost, { color: '#C7D0E0', duration: .3 }, t0 + 2.4);
  }};
};

/* ---------- cta ---------- */
L.cta = (sc) => {
  const s = E('div', 'safe');
  const card = E('div', 'cta-card glass lg');
  card.innerHTML = `
    <div class="cta-av"><div class="ring"></div>
      <div class="in"><i class="fa-solid fa-code"></i></div></div>
    <div class="h2">${sc.title || 'THEO DÕI KÊNH'}</div>
    <div class="sub sm">${sc.sub || 'Mình chia từng bước — cơ bản tới nâng cao'}</div>
    <div class="cta-btn"><i class="fa-solid fa-plus"></i> Theo dõi</div>`;
  s.appendChild(card);
  const tags = E('div', 'tags', sc.tags || '#VibeCoding&nbsp; #ThietKeWebsite&nbsp; #AI');
  s.appendChild(tags);
  const ring = card.querySelector('.ring'), btn = card.querySelector('.cta-btn');
  return { node: s, anim(tl, t0, d) {
    if (!sc.tail) {
      tl.fromTo(card, { y: 70, opacity: 0, scale: .92 },
        { y: 0, opacity: 1, scale: 1, duration: .6, ease: 'back.out(1.5)' }, t0 + .1);
      tl.fromTo(tags, { opacity: 0 }, { opacity: 1, duration: .5 }, t0 + .8);
    }
    tl.to(ring, { rotate: 360, duration: 2.2, repeat: -1, ease: 'none' }, t0);
    tl.to(btn, { scale: 1.06, duration: .8, repeat: -1, yoyo: true, ease: 'sine.inOut' }, t0);
  }};
};

/* ============================================================
   VIZ — các minh hoạ nhỏ
   ============================================================ */
const V = {};

V.keys = (s, sc) => {
  const g = E('div', ''); g.style.cssText =
    'display:grid;grid-template-columns:repeat(8,1fr);gap:14px;width:760px;margin-bottom:56px';
  const ks = [];
  for (let i = 0; i < 32; i++) {
    const k = E('div', '');
    k.style.cssText = 'height:76px;border-radius:14px;background:rgba(255,255,255,.07);' +
      'border:1px solid rgba(255,255,255,.10);box-shadow:inset 0 -4px 0 rgba(0,0,0,.35)';
    g.appendChild(k); ks.push(k);
  }
  s.insertBefore(g, s.firstChild);
  return (tl, t0, d) => {
    ks.forEach((k, i) => tl.to(k,
      { y: -70 - Math.random() * 60, opacity: 0, scale: .4, filter: 'blur(6px)',
        duration: .9, ease: 'power2.in' }, t0 + .3 + (i % 8) * .06 + Math.floor(i / 8) * .04));
  };
};

V.chart = (s) => {
  const box = E('div', ''); box.style.cssText = 'width:760px;height:300px;position:relative;margin-bottom:50px';
  box.innerHTML = `<svg viewBox="0 0 760 300" width="760" height="300">
    <defs><linearGradient id="cg" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>
    <path id="cline" d="M20,275 C200,268 380,240 520,160 C620,104 690,50 740,20"
      fill="none" stroke="url(#cg)" stroke-width="9" stroke-linecap="round"/></svg>`;
  const dots = [[20,275],[240,262],[420,215],[560,132],[680,58],[740,20]].map(([x,y]) => {
    const dd = E('i', ''); dd.style.cssText = `position:absolute;left:${x-9}px;top:${y-9}px;width:18px;
      height:18px;border-radius:50%;background:#fff;box-shadow:0 0 22px #22D3EE`;
    box.appendChild(dd); return dd;
  });
  s.insertBefore(box, s.firstChild);
  const path = box.querySelector('#cline');
  const len = 900; path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
  return (tl, t0) => {
    tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power3.out' }, t0 + .2);
    dots.forEach((dd, i) => tl.fromTo(dd, { scale: 0 },
      { scale: 1, duration: .3, ease: 'back.out(2.5)' }, t0 + .35 + i * .2));
  };
};

V.tree = (s) => {
  const box = E('div', ''); box.style.cssText = 'width:760px;margin-bottom:44px;text-align:left';
  const items = [['fa-folder','src/',0],['fa-folder','components/',1],['fa-file-code','Header.jsx',2],
    ['fa-file-code','Menu.jsx',2],['fa-folder','pages/',1],['fa-file-code','index.html',2],
    ['fa-file-lines','style.css',1]];
  const rows = items.map(([ic, t, dep]) => {
    const r = E('div', '');
    r.style.cssText = `display:flex;align-items:center;gap:18px;font-size:38px;font-family:var(--mono);
      color:rgba(255,255,255,.5);padding:9px 0 9px ${dep * 54}px`;
    r.innerHTML = `<i class="fa-solid ${ic}" style="color:#8B5CF6"></i>${t}`;
    box.appendChild(r); return r;
  });
  s.appendChild(box);
  return (tl, t0) => rows.forEach((r, i) => {
    tl.to(r, { color: '#FFFFFF', duration: .22 }, t0 + .5 + i * .17);
    tl.to(r, { color: 'rgba(255,255,255,.55)', duration: .5 }, t0 + .5 + i * .17 + .5);
  });
};

V.merge = (s) => {
  const box = E('div', ''); box.style.cssText =
    'width:760px;height:280px;position:relative;margin-bottom:46px';
  const roles = [['fa-pen-ruler','Design'],['fa-code','Code'],['fa-vial','Test'],['fa-rocket','Deploy']];
  const cells = roles.map(([ic, t], i) => {
    const c = E('div', 'glass sm');
    c.style.cssText += `position:absolute;left:${i * 190}px;top:60px;width:170px;height:170px;
      display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-size:26px;color:var(--tx2)`;
    c.innerHTML = `<i class="fa-solid ${ic}" style="font-size:52px;color:#8B5CF6"></i>${t}`;
    box.appendChild(c); return c;
  });
  const one = E('div', 'glass sm');
  one.style.cssText += `position:absolute;left:295px;top:60px;width:170px;height:170px;opacity:0;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 60px rgba(139,92,246,.6)`;
  one.innerHTML = `<i class="fa-solid fa-user" style="font-size:66px;color:#22D3EE"></i>`;
  box.appendChild(one);
  s.appendChild(box);
  return (tl, t0) => {
    cells.forEach((c, i) => {
      tl.fromTo(c, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'back.out(1.6)' }, t0 + .2 + i * .12);
      tl.to(c, { left: '295px', scale: .5, opacity: 0, duration: .85, ease: 'power3.inOut' }, t0 + 1.5);
    });
    tl.to(one, { opacity: 1, scale: 1.06, duration: .5, ease: 'back.out(2)' }, t0 + 2.1);
  };
};

V.scatter = (s) => {
  const box = E('div', ''); box.style.cssText = 'width:840px;height:330px;position:relative;margin-bottom:40px';
  const tools = [['Cursor','#34D399'],['Claude Code','#F97316'],['ChatGPT','#10B981'],
                 ['Windsurf','#22D3EE'],['Copilot','#8B5CF6']];
  const pos = [[40,30],[420,10],[210,140],[540,170],[60,220]];
  const ns = tools.map(([t, col], i) => {
    const n = E('div', 'glass sm');
    n.style.cssText += `position:absolute;left:${pos[i][0]}px;top:${pos[i][1]}px;padding:20px 32px;
      font-size:36px;font-weight:700;color:${col};white-space:nowrap`;
    n.textContent = t; box.appendChild(n); return n;
  });
  s.insertBefore(box, s.firstChild);
  return (tl, t0) => ns.forEach((n, i) => {
    tl.fromTo(n, { opacity: 0, scale: .7, rotate: (i - 2) * 9 },
      { opacity: .95, scale: 1, duration: .35 }, t0 + .15 + i * .07);
    tl.to(n, { x: (Math.random() - .5) * 90, y: (Math.random() - .5) * 70, rotate: (i - 2) * -7,
      duration: 2.0, ease: 'sine.inOut' }, t0 + .4);
    tl.to(n, { filter: 'blur(3px)', opacity: .55, duration: .3 }, t0 + 2.5);
  });
};

V.wire = (s, sc) => {
  const box = E('div', ''); box.style.cssText =
    'width:520px;height:600px;position:relative;margin-bottom:40px;border:2px dashed rgba(255,255,255,.28);border-radius:22px;padding:22px';
  const blocks = [[0,0,476,180],[0,196,476,86],[0,296,228,120],[248,296,228,120],[0,436,476,90]];
  const bs = blocks.map(([x, y, w, h]) => {
    const b = E('div', '');
    b.style.cssText = `position:absolute;left:${x + 22}px;top:${y + 22}px;width:${w}px;height:${h}px;
      border:2px solid rgba(255,255,255,.42);border-radius:14px;background:rgba(255,255,255,.03)`;
    box.appendChild(b); return b;
  });
  s.appendChild(box);
  const chips = chipsEl(sc.chips, 'cy'); s.appendChild(chips);
  return (tl, t0) => {
    tl.fromTo(box, { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .4 }, t0 + .1);
    bs.forEach((b, i) => tl.fromTo(b, { opacity: 0, scaleY: .2 },
      { opacity: 1, scaleY: 1, duration: .35, ease: 'power2.out' }, t0 + .3 + i * .17));
    Array.from(chips.children).forEach((c, i) => tl.fromTo(c,
      { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .32, ease: 'back.out(2.2)' },
      t0 + 1.3 + i * .38));
  };
};

V.check = (s, sc) => {
  const box = E('div', ''); box.style.cssText = 'width:760px;margin-bottom:34px';
  const rows = sc.items.map(t => {
    const r = E('div', 'card ok'); r.style.width = '760px'; r.style.marginBottom = '20px';
    r.innerHTML = `<div class="ic"><i class="fa-solid fa-circle-check"></i></div><div class="t">${t}</div>`;
    box.appendChild(r); return r;
  });
  const toast = E('div', 'chip ok', '<i class="fa-solid fa-bell"></i>Đặt bàn thành công');
  toast.style.cssText += 'font-size:38px;margin-top:10px';
  box.appendChild(toast);
  s.appendChild(box);
  const cur = E('div', '');
  cur.style.cssText = 'position:absolute;width:44px;height:44px;pointer-events:none;z-index:9';
  cur.innerHTML = '<i class="fa-solid fa-arrow-pointer" style="font-size:44px;color:#fff;filter:drop-shadow(0 3px 8px #000)"></i>';
  s.appendChild(cur);
  return (tl, t0) => {
    rows.forEach((r, i) => {
      tl.fromTo(r, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .3 }, t0 + .25 + i * .16);
      tl.fromTo(r.querySelector('.ic'), { scale: 0 },
        { scale: 1, duration: .3, ease: 'back.out(2.6)' }, t0 + .9 + i * .55);
    });
    tl.fromTo(toast, { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: .4, ease: 'back.out(1.8)' }, t0 + 2.7);
    tl.set(cur, { x: 200, y: 190 }, t0);
    tl.to(cur, { x: 300, y: 320, duration: .5, ease: 'power2.inOut' }, t0 + .9);
    tl.to(cur, { x: 260, y: 450, duration: .5, ease: 'power2.inOut' }, t0 + 1.5);
    tl.to(cur, { scale: .82, duration: .1, yoyo: true, repeat: 1 }, t0 + 2.05);
  };
};

V.deploy = (s, sc) => {
  const box = E('div', ''); box.style.cssText = 'width:760px;margin-bottom:40px;text-align:center';
  box.innerHTML = `<div style="font-size:96px;color:#fff;margin-bottom:30px">▲</div>`;
  const bar = E('div', ''); bar.style.cssText =
    'width:100%;height:20px;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden';
  const fill = E('div', ''); fill.style.cssText =
    'height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#8B5CF6,#22D3EE)';
  bar.appendChild(fill); box.appendChild(bar);
  s.appendChild(box);
  const url = E('div', 'glass');
  url.style.cssText += 'margin-top:12px;padding:30px 40px;display:flex;align-items:center;gap:22px;font-size:44px;font-family:var(--mono);color:#CFF6FD';
  url.innerHTML = `<i class="fa-solid fa-link" style="color:#22D3EE"></i>${sc.url}`;
  s.appendChild(url);
  const big = E('div', 'h2 gm'); big.style.marginTop = '30px'; big.textContent = 'ĐÃ CÓ LINK THẬT';
  s.appendChild(big);
  return (tl, t0) => {
    tl.set([url, big], { opacity: 0 }, t0);
    tl.to(fill, { width: '100%', duration: 1.25, ease: 'power2.out' }, t0 + .3);
    tl.fromTo(url, { scale: .7, opacity: 0 },
      { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2.2)' }, t0 + 1.65);
    tl.fromTo(big, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, t0 + 1.95);
  };
};

V.split = (s) => {
  const box = E('div', ''); box.style.cssText =
    'width:840px;height:300px;position:relative;margin-bottom:40px;display:flex;align-items:center;gap:40px';
  const big = E('div', '');
  big.style.cssText = `flex:1;height:250px;border-radius:24px;background:rgba(255,77,109,.14);
    border:2px solid rgba(255,77,109,.55);display:flex;align-items:center;justify-content:center;
    font-size:44px;font-weight:700;color:#FFD6DE`;
  big.textContent = 'CẢ TRANG';
  const right = E('div', ''); right.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:14px';
  const parts = ['Hero', 'Menu', 'Form', 'Footer'].map(t => {
    const p = E('div', '');
    p.style.cssText = `height:54px;border-radius:14px;background:rgba(52,211,153,.13);
      border:1px solid rgba(52,211,153,.5);display:flex;align-items:center;justify-content:center;
      font-size:30px;color:#CFF6E6;font-weight:600`;
    p.textContent = t; right.appendChild(p); return p;
  });
  box.appendChild(big); box.appendChild(right);
  s.appendChild(box);
  return (tl, t0) => {
    tl.fromTo(big, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .4 }, t0 + .15);
    tl.to(big, { x: -5, duration: .05, repeat: 7, yoyo: true }, t0 + 1.0);
    tl.to(big, { opacity: .25, filter: 'blur(5px)', duration: .5 }, t0 + 1.5);
    parts.forEach((p, i) => tl.fromTo(p, { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: .35, ease: 'back.out(1.7)' }, t0 + 1.5 + i * .2));
  };
};

V.timeline = (s, sc) => {
  const box = E('div', ''); box.style.cssText =
    'width:800px;height:150px;position:relative;margin-bottom:40px;display:flex;align-items:center';
  const line = E('div', '');
  line.style.cssText = 'position:absolute;left:0;top:70px;height:5px;width:100%;background:rgba(255,255,255,.16);transform-origin:left';
  box.appendChild(line);
  const dots = [];
  for (let i = 0; i < 6; i++) {
    const dd = E('div', '');
    dd.style.cssText = `position:absolute;left:${i * 152}px;top:48px;width:50px;height:50px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;font-size:26px;
      background:${sc.broken ? 'rgba(255,77,109,.2)' : 'rgba(52,211,153,.2)'};
      border:2px solid ${sc.broken ? '#FF4D6D' : '#34D399'};
      color:${sc.broken ? '#FFD6DE' : '#CFF6E6'}`;
    dd.innerHTML = sc.broken ? '' : '<i class="fa-solid fa-check"></i>';
    box.appendChild(dd); dots.push(dd);
  }
  s.appendChild(box);
  let code = null;
  if (sc.code) {
    code = E('div', 'glass sm');
    code.style.cssText += 'margin-top:14px;padding:22px 34px;font-family:var(--mono);font-size:42px;color:#CFF6E6';
    code.textContent = sc.code; s.appendChild(code);
  }
  return (tl, t0) => {
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power2.out' }, t0 + .2);
    dots.forEach((dd, i) => tl.fromTo(dd, { scale: 0 },
      { scale: 1, duration: .3, ease: 'back.out(2.4)' }, t0 + .35 + i * .16));
    if (sc.broken) {
      tl.to([line, ...dots], { opacity: 0, y: 40, filter: 'blur(9px)',
        duration: .6, ease: 'power2.in', stagger: .04 }, t0 + 2.1);
    }
    if (code) tl.fromTo(code, { scale: .8, opacity: 0 },
      { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }, t0 + 1.9);
  };
};

V.books = (s) => {
  const box = E('div', ''); box.style.cssText =
    'width:420px;height:340px;position:relative;margin-bottom:50px';
  const bs = [];
  for (let i = 0; i < 6; i++) {
    const b = E('div', '');
    b.style.cssText = `position:absolute;left:${18 + (i % 2) * 14}px;bottom:${i * 50}px;
      width:${340 - i * 12}px;height:44px;border-radius:8px;
      background:rgba(255,255,255,${.07 + i * .012});border:1px solid rgba(255,255,255,.14)`;
    box.appendChild(b); bs.push(b);
  }
  s.insertBefore(box, s.firstChild);
  return (tl, t0) => bs.forEach((b, i) =>
    tl.to(b, { rotate: (i + 1) * 5, x: 60 + i * 22, y: 40, opacity: 0, filter: 'blur(7px)',
      duration: .8, ease: 'power2.in' }, t0 + .7 + i * .07));
};

L.viz = (sc) => {
  const s = E('div', 'safe');
  const k = kickerEl(sc); if (k) s.appendChild(k);
  const b = badgeEl(sc); if (b) s.appendChild(b);
  if (sc.h1) s.appendChild(E('div', sc.h1cls || 'h1', sc.h1));
  if (sc.h2) s.appendChild(E('div', 'h2', sc.h2));
  if (sc.sub) s.appendChild(E('div', 'sub sm', sc.sub));
  const vizAnim = V[sc.viz](s, sc);
  return { node: s, anim(tl, t0, d) {
    Array.from(s.children).forEach((n, i) => {
      if (n.className === 'safe') return;
      if (!n.classList.contains('kicker') && !n.classList.contains('h1') &&
          !n.classList.contains('h2') && !n.classList.contains('sub') &&
          !n.classList.contains('badge-n')) return;
      tl.fromTo(n, { y: 44, opacity: 0 },
        { y: 0, opacity: 1, duration: .45, ease: 'back.out(1.5)' }, t0 + .1 + i * .07);
    });
    vizAnim(tl, t0, d);
  }};
};


/* ---------- platform: cửa sổ trình duyệt mô phỏng một nền tảng ----------
   Tên và URL là thật; giao diện là dựng lại, không phải quay màn hình. */
const PBODY = {
  prompt: (d) => `
    <div class="pb-prompt">
      <div class="pb-lb"><i class="fa-solid fa-wand-magic-sparkles"></i> Describe your idea</div>
      <div class="pb-input"><span class="pb-type"></span><span class="caret"></span></div>
      <div class="pb-gen"><i class="fa-solid fa-circle-notch"></i> AI đang dựng…</div>
    </div>`,
  site: () => `
    <div class="pb-site">
      <div class="pb-nav"><u></u><u></u><u></u><i class="pb-btn"></i></div>
      <div class="pb-hero"><b></b><s></s><i class="pb-btn"></i></div>
      <div class="pb-row"><div class="pb-card"></div><div class="pb-card"></div><div class="pb-card"></div></div>
      <div class="pb-row"><div class="pb-card wide"></div></div>
    </div>`,
  sections: (d) => `
    <div class="pb-sections">${d.sections.map(t =>
      `<div class="pb-sec"><i class="fa-solid fa-circle-check"></i>${t}</div>`).join('')}</div>`,
  app: () => `
    <div class="pb-app">
      <div class="pb-side"><u></u><u></u><u></u><u></u></div>
      <div class="pb-main">
        <div class="pb-stats"><b></b><b></b><b></b></div>
        <div class="pb-chart"><svg viewBox="0 0 300 90" width="100%" height="90">
          <polyline points="6,80 60,64 114,70 168,38 222,44 282,10" fill="none"
            stroke="#22D3EE" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="pb-rows"><u></u><u></u><u></u></div>
      </div>
    </div>`,
  chat: (d) => `
    <div class="pb-chat">${d.msgs.map((m, i) =>
      `<div class="pb-msg ${i % 2 ? 'ai' : 'me'}">${m}</div>`).join('')}</div>`,
  brand: () => `
    <div class="pb-brand">
      <div class="pb-logo"><i class="fa-solid fa-leaf"></i></div>
      <div class="pb-sw"><u style="background:#6366F1"></u><u style="background:#22D3EE"></u>
        <u style="background:#A78BFA"></u><u style="background:#F1F5F9"></u></div>
      <div class="pb-row"><div class="pb-card"></div><div class="pb-card"></div></div>
    </div>`,
};

L.platform = (sc) => {
  const s = E('div', 'safe');
  const nm = E('div', 'h1', sc.name); s.appendChild(nm);
  const c = E('div', 'chip ' + (sc.chipCls || 'cy'),
    `<i class="fa-solid ${sc.icon || 'fa-bolt'}"></i>${sc.chip}`);
  c.style.marginTop = '20px'; s.appendChild(c);

  const win = E('div', 'win'); win.style.marginTop = '40px';
  win.innerHTML =
    `<div class="win-bar"><u class="r"></u><u class="y"></u><u class="g2"></u>
       <span class="pb-url"><i class="fa-solid fa-lock"></i> ${sc.url}</span></div>
     <div class="win-body pb">${PBODY[sc.body](sc)}</div>`;
  s.appendChild(win);

  const typeEl = win.querySelector('.pb-type');
  const genEl  = win.querySelector('.pb-gen');
  const site   = win.querySelector('.pb-site, .pb-app, .pb-brand');
  const secs   = win.querySelectorAll('.pb-sec');
  const msgs   = win.querySelectorAll('.pb-msg');
  const cards  = win.querySelectorAll('.pb-card, .pb-hero, .pb-nav, .pb-stats b, .pb-rows u, .pb-sw u');

  return { node: s, anim(tl, t0, d) {
    tl.fromTo(nm, { y: 46, opacity: 0 },
      { y: 0, opacity: 1, duration: .42, ease: 'back.out(1.5)' }, t0 + .06);
    tl.fromTo(c, { scale: .7, opacity: 0 },
      { scale: 1, opacity: 1, duration: .34, ease: 'back.out(2.2)' }, t0 + .22);
    tl.fromTo(win, { y: 64, opacity: 0, scale: .95 },
      { y: 0, opacity: 1, scale: 1, duration: .5, ease: 'power3.out' }, t0 + .32);
    tl.to(win, { scale: 1.04, duration: d - .3, ease: 'none' }, t0 + .32);

    if (typeEl && sc.type) {
      typeTween(tl, typeEl, sc.type, sc.speed || 26, t0 + .7);
      tl.set(genEl, { opacity: 0 }, t0);
      tl.to(genEl, { opacity: 1, duration: .3 }, t0 + d - 1.1);
    }
    if (site) tl.fromTo(cards, { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: .32, stagger: .07, ease: 'power2.out' }, t0 + .8);
    if (secs.length) secs.forEach((n, i) => tl.fromTo(n,
      { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .3, ease: 'power3.out' },
      t0 + .7 + i * .32));
    if (msgs.length) msgs.forEach((n, i) => tl.fromTo(n,
      { opacity: 0, y: 24, scale: .9 },
      { opacity: 1, y: 0, scale: 1, duration: .34, ease: 'back.out(1.7)' }, t0 + .7 + i * .55));
  }};
};

/* ---------- viz: lưới 7 nền tảng ---------- */
V.grid7 = (s, sc) => {
  const g = E('div', ''); g.style.cssText =
    'display:grid;grid-template-columns:repeat(2,1fr);gap:16px;width:920px;margin-top:30px';
  const cells = sc.items.map((t, i) => {
    const n = E('div', 'glass sm');
    n.style.cssText += `padding:24px 20px;text-align:center;font-size:40px;font-weight:700;
      color:#EDE9FF;${i === sc.items.length - 1 ? 'grid-column:span 2;' : ''}`;
    n.textContent = t; g.appendChild(n); return n;
  });
  s.appendChild(g);
  return (tl, t0) => cells.forEach((n, i) => {
    tl.fromTo(n, { opacity: 0, scale: .8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: .34, ease: 'back.out(1.8)' }, t0 + .35 + i * .11);
    tl.to(n, { borderColor: 'rgba(139,92,246,.55)',
      boxShadow: '0 0 34px rgba(139,92,246,.30)', duration: .3 }, t0 + 1.5 + i * .08);
  });
};

/* ============================================================
   THANH 6 BƯỚC (act E)
   ============================================================ */
function buildSteps() {
  const w = E('div', 'steps');
  const row = E('div', 'steps-row');
  const dots = [];
  for (let i = 0; i < 6; i++) {
    if (i) row.appendChild(E('div', 'step-line'));
    const d = E('div', 'step-dot'); row.appendChild(d); dots.push(d);
  }
  w.appendChild(row);
  const lb = E('div', 'steps-lb');
  const labels = STEP_LABELS.map(t => { const b = E('b', '', t); lb.appendChild(b); return b; });
  w.appendChild(lb);
  return { node: w, dots, labels };
}

/* ============================================================
   DỰNG TOÀN BỘ
   ============================================================ */
function build() {
  const tl = gsap.timeline({ paused: true });
  initBg(tl);
  const root = $('#scenes');
  const steps = buildSteps();
  root.appendChild(steps.node);
  gsap.set(steps.node, { opacity: 0 });

  SCENES.forEach((sc, idx) => {
    const sec = E('section', 'scene');
    const built = L[sc.l](sc);
    sec.appendChild(built.node);
    root.appendChild(sec);

    const t0 = sc.t, d = sc.d, tEnd = t0 + d;

    tl.set(sec, { visibility: 'visible' }, t0);
    tl.set(sec, { visibility: 'hidden' }, tEnd);

    // nền ấm / cảnh báo
    if (sc.warn) {
      tl.to('#warmth', { opacity: 1, duration: .3 }, t0);
      tl.to('#warmth', { opacity: 0, duration: .3 }, tEnd - .1);
    }
    if (sc.mood === 'gray') {
      tl.to('#bg-mesh', { opacity: .25, duration: .4 }, t0);
      tl.to('#bg-mesh', { opacity: 1, duration: .4 }, tEnd - .1);
    }

    built.anim(tl, t0, d, sc);

    // thanh 6 bước
    if (sc.step) {
      tl.to(steps.node, { opacity: 1, duration: .35 }, t0 - .1);
      steps.dots.forEach((dd, i) => {
        const cls = sc.allSteps ? 'step-dot on'
          : i < sc.step - 1 ? 'step-dot done' : i === sc.step - 1 ? 'step-dot on' : 'step-dot';
        tl.set(dd, { className: cls }, t0);
      });
      steps.labels.forEach((b, i) =>
        tl.set(b, { className: (sc.allSteps || i === sc.step - 1) ? 'on' : '' }, t0));
    } else {
      tl.to(steps.node, { opacity: 0, duration: .25 }, t0);
    }

    // ---- chuyển cảnh ra ----
    const o = sc.out;
    if (o === 'whip') {
      tl.to(sec, { x: -420, opacity: 0, filter: 'blur(26px)', duration: .18, ease: 'power2.in' }, tEnd - .18);
    } else if (o === 'punch') {
      tl.to(sec, { scale: 1.26, opacity: 0, filter: 'blur(18px)', duration: .20, ease: 'power2.in' }, tEnd - .20);
    } else if (o === 'blur') {
      tl.to(sec, { filter: 'blur(30px)', scale: 1.07, opacity: 0, duration: .20 }, tEnd - .20);
    } else if (o === 'glitch' || o === 'flashglitch') {
      tl.to(sec, { x: 16, duration: .04, repeat: 3, yoyo: true }, tEnd - .18);
      tl.fromTo('#flash', { opacity: 0 }, { opacity: o === 'flashglitch' ? .85 : .30,
        duration: .05, yoyo: true, repeat: 1 }, tEnd - .10);
    } else if (o === 'sweep') {
      tl.fromTo('#sweep', { x: -300, opacity: 0 },
        { x: 1500, opacity: 1, duration: .40, ease: 'power2.inOut' }, tEnd - .26);
      tl.to('#sweep', { opacity: 0, duration: .10 }, tEnd + .08);
    } else if (o === 'glass') {
      tl.to(sec, { x: -180, opacity: 0, duration: .28, ease: 'power3.in' }, tEnd - .28);
    } else if (o === 'morph') {
      tl.to(sec, { scale: 1.5, opacity: 0, duration: .30, ease: 'power3.in' }, tEnd - .30);
    } else if (o === 'coderain') {
      tl.to(sec, { y: 90, opacity: 0, filter: 'blur(14px)', duration: .32 }, tEnd - .32);
    } else if (o === 'flash') {
      tl.fromTo('#flash', { opacity: 0 }, { opacity: .92, duration: .06, yoyo: true, repeat: 1 }, tEnd - .12);
    } else if (o === 'end') {
      tl.to('#stage', { opacity: 0, duration: .45 }, DUR - .45);
    }

    // vào cảnh: nhích nhẹ để không bao giờ đứng hình
    if (o !== 'end') tl.fromTo(sec, { opacity: 1 }, { opacity: 1, duration: .01 }, t0);
  });

  return tl;
}

/* ---- khởi động ---- */
(async function boot() {
  try { await document.fonts.ready; } catch (e) {}
  await new Promise(r => setTimeout(r, 60));
  window.__TL = build();          // record.js seek thẳng timeline này
  window.__TL.seek(0);
  if (!location.search.includes('render')) window.__TL.play();  // xem thử trên trình duyệt
  window.__READY = true;
})();
