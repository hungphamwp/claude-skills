# Animation & Scroll Effects — Flatsome

> Catalog đầy đủ các hiệu ứng: Flatsome native, CSS pure, AOS, GSAP, counter.
> Mục tiêu: không dùng JS nặng khi có thể làm bằng CSS native.

---

## 1. Flatsome Native Animations

Flatsome tích hợp sẵn animate.css. Dùng qua attribute `animate` trên `[col]`, `[ux_image]`, `[featured_box]`.

### Attribute `animate`

```wordpress
[col span="4" animate="fadeInUp"]
[ux_image id="123" animate="zoomIn"]
[featured_box img="123" animate="fadeInLeft"]
```

**Available animations:**
```
fade          fadeIn        fadeInUp      fadeInDown
fadeInLeft    fadeInRight   fadeInUpBig   fadeInDownBig
zoom          zoomIn        zoomInUp      zoomInDown
slide         slideInUp     slideInDown   slideInLeft     slideInRight
bounce        bounceIn      bounceInUp    bounceInDown
flip          flipInX       flipInY
rotate        rotateIn      rotateInDownLeft rotateInDownRight
```

### Delay + Offset (stagger effect)

```wordpress
[col span="4" animate="fadeInUp" animation_delay="0"]
[col span="4" animate="fadeInUp" animation_delay="150"]
[col span="4" animate="fadeInUp" animation_delay="300"]
```

---

## 2. CSS-only Animations (không cần JS)

### Fade In Up (section reveal)

```css
/* Áp dụng cho bất kỳ element nào khi visible */
@keyframes vf-fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vf-fade-in-up {
  animation: vf-fadeInUp 0.6s ease forwards;
}

/* Stagger cho grid items */
.vf-grid-item:nth-child(1) { animation-delay: 0.0s; }
.vf-grid-item:nth-child(2) { animation-delay: 0.1s; }
.vf-grid-item:nth-child(3) { animation-delay: 0.2s; }
.vf-grid-item:nth-child(4) { animation-delay: 0.3s; }
```

### Hover lift card

```css
.vf-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
}

.vf-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.14) !important;
}
```

### Hover scale image

```css
.vf-img-zoom {
  overflow: hidden;
  border-radius: var(--radius-md);
}

.vf-img-zoom img {
  transition: transform 0.4s ease;
  will-change: transform;
}

.vf-img-zoom:hover img {
  transform: scale(1.06);
}
```

### Shimmer loading effect

```css
@keyframes vf-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.vf-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: vf-shimmer 1.5s infinite;
  border-radius: 4px;
}
```

### Gradient border animated

```css
@keyframes vf-gradient-rotate {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.vf-gradient-border {
  position: relative;
  background: white;
  border-radius: 12px;
}

.vf-gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2, #f59e0b, #ef4444);
  background-size: 300% 300%;
  animation: vf-gradient-rotate 4s ease infinite;
  z-index: -1;
}
```

---

## 3. Scroll-triggered Animations (AOS — nếu có plugin)

AOS (Animate On Scroll) thường có sẵn trên nhiều theme. Flatsome không include AOS mặc định nhưng có thể add.

### Enqueue AOS qua functions.php

```php
// functions.php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('aos-css',
        'https://unpkg.com/aos@2.3.1/dist/aos.css', [], '2.3.1');
    wp_enqueue_script('aos-js',
        'https://unpkg.com/aos@2.3.1/dist/aos.js', [], '2.3.1', true);
    wp_add_inline_script('aos-js', '
        document.addEventListener("DOMContentLoaded", function() {
            AOS.init({
                duration: 700,
                easing: "ease-out-cubic",
                once: true,
                offset: 80
            });
        });
    ');
}, 30);
```

### Dùng AOS trong UX Builder

AOS attributes phải đặt qua `[ux_html]` wrapper hoặc custom class + JS init:

```wordpress
[ux_html]
<div data-aos="fade-up" data-aos-delay="0">
  [ux_text]<h2 class="section-title">Tiêu đề</h2>[/ux_text]
</div>
[/ux_html]
```

**Hoặc** dùng CSS-only approach (không cần AOS JS):

```css
/* Scroll reveal via Intersection Observer — inject qua WPCode */
```

```js
// WPCode snippet (Header JS)
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('vf-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.vf-reveal').forEach(el => observer.observe(el));
});
```

```css
/* CSS cho vf-reveal */
.vf-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.vf-reveal.vf-visible {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger delay qua nth-child */
.vf-reveal:nth-child(2) { transition-delay: 0.1s; }
.vf-reveal:nth-child(3) { transition-delay: 0.2s; }
.vf-reveal:nth-child(4) { transition-delay: 0.3s; }
```

---

## 4. Counter Animation (số đếm lên)

### WPCode snippet (Footer JS)

```js
// Inject qua WPCode > Snippets > Add New > JavaScript (Footer)
(function() {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const start = Date.now();

    function update() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
})();
```

### Dùng trong UX Builder shortcode

```wordpress
[section bg_color="#f8fafc" padding="80px 0" class="vf-stats-section"]
  [row h_align="center"]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <span class="vf-stat-num" data-target="500" data-suffix="+">0+</span>
        <p class="vf-stat-label">Dự án hoàn thành</p>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <span class="vf-stat-num" data-target="98" data-suffix="%">0%</span>
        <p class="vf-stat-label">Khách hàng hài lòng</p>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <span class="vf-stat-num" data-target="10" data-suffix=" năm">0</span>
        <p class="vf-stat-label">Kinh nghiệm</p>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <span class="vf-stat-num" data-target="50" data-suffix="+">0+</span>
        <p class="vf-stat-label">Đội ngũ chuyên gia</p>
      [/ux_text]
    [/col]
  [/row]
[/section]
```

```css
.vf-stat-num {
  display: block;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  color: var(--c-primary);
  line-height: 1;
  margin-bottom: 8px;
}
.vf-stat-label {
  font-size: 15px;
  color: var(--c-text-muted);
  margin: 0 !important;
}
```

---

## 5. Parallax Effects

### Flatsome native parallax

```wordpress
[section parallax="1" parallax_text="0.3" bg="IMAGE_ID" height="600px" dark="true"]
  [row h_align="center"][col span="8" align="center"]
    [ux_text]<h1 class="vf-hero-title">Tiêu đề hero</h1>[/ux_text]
  [/col][/row]
[/section]
```

Giá trị `parallax_text`: 0.1 (chậm) → 0.5 (nhanh)

### CSS-only parallax (nhẹ hơn)

```css
.vf-parallax-bg {
  background-attachment: fixed !important;
  background-position: center center !important;
  background-size: cover !important;
}

/* Tắt trên mobile (performance) */
@media (max-width: 849px) {
  .vf-parallax-bg {
    background-attachment: scroll !important;
  }
}
```

---

## 6. Progress Bars / Skill Bars

```wordpress
[section padding="60px 0"]
  [row][col span="8" span__sm="12"]

    [ux_text]<p class="vf-skill-label">SEO <span>92%</span></p>[/ux_text]
    [ux_html]
    <div class="vf-progress-bar">
      <div class="vf-progress-fill" data-width="92"></div>
    </div>
    [/ux_html]

    [ux_text]<p class="vf-skill-label">Content Marketing <span>87%</span></p>[/ux_text]
    [ux_html]
    <div class="vf-progress-bar">
      <div class="vf-progress-fill" data-width="87"></div>
    </div>
    [/ux_html]

  [/col][/row]
[/section]
```

```css
.vf-skill-label {
  display: flex !important;
  justify-content: space-between !important;
  font-weight: 500 !important;
  margin-bottom: 6px !important;
}
.vf-progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 50px;
  margin-bottom: 20px;
  overflow: hidden;
}
.vf-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-primary), var(--c-secondary));
  border-radius: 50px;
  width: 0;
  transition: width 1.2s ease;
}
```

```js
// WPCode snippet
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.vf-progress-fill').forEach(el => obs.observe(el));
```

---

## 7. Floating / Pulse CTA

```css
/* Floating CTA button */
.vf-floating-cta {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* Pulse animation */
@keyframes vf-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
  50%       { box-shadow: 0 0 0 14px rgba(37, 99, 235, 0); }
}

.vf-floating-cta a {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-primary);
  color: #fff;
  font-size: 20px;
  animation: vf-pulse 2s infinite;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;
}

.vf-floating-cta a:hover {
  transform: scale(1.1);
}
```

```php
// functions.php
add_action('wp_footer', function() { ?>
<div class="vf-floating-cta">
  <a href="tel:0912345678" title="Gọi ngay">
    <i class="icon-phone"></i>
  </a>
  <a href="https://zalo.me/ZALO_ID" title="Zalo" target="_blank">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
  </a>
</div>
<?php }, 100);
```

---

## 8. Animation Performance Rules

```
✅ DÙNG:
- CSS transform (translate, scale, rotate)
- CSS opacity
- CSS transition + animation
- will-change: transform (chỉ khi cần)
- Intersection Observer (thay setInterval)

❌ TRÁNH:
- Animate width, height, margin, padding (trigger reflow)
- JS animation loop với setInterval
- jQuery animate()
- GSAP cho hiệu ứng đơn giản có thể làm bằng CSS
- Nhiều animation cùng lúc trên mobile
```

---

## 9. Animation QA Checklist

```
□ Animations có smooth trên Chrome/Safari không?
□ Trên mobile không giật lag?
□ prefers-reduced-motion được respect?
□ Counters đếm đúng số?
□ Parallax không vỡ trên mobile?
□ Floating CTA không che content quan trọng?
□ Hover effects hoạt động trên touch devices?
```

### Respect reduced motion (accessibility)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
