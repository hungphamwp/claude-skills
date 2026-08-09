# UX Builder Patterns: Common Conversions

> These patterns show how to convert common HTML page sections into Flatsome UX Builder shortcode structures. All custom classes should be styled in the child theme's `style.css`.

## Full page structure

A typical landing page converted to UX Builder shortcodes:

```
[section class="hpb-hero" bg_color="#f0f7ff" padding="100px 0" padding__md="60px 0" padding__sm="40px 0"]
  <!-- Hero content -->
[/section]

[section class="hpb-stats" padding="0"]
  <!-- Stats bar -->
[/section]

[section class="hpb-services" padding="80px 0" padding__md="50px 0"]
  <!-- Services grid -->
[/section]

[section class="hpb-process" bg_color="#f7f8fc" padding="80px 0"]
  <!-- Process steps -->
[/section]

[section class="hpb-portfolio" padding="80px 0"]
  <!-- Portfolio grid -->
[/section]

[section class="hpb-testimonials" bg_color="#f7f8fc" padding="80px 0"]
  <!-- Testimonials -->
[/section]

[section class="hpb-cta" bg_color="#2563eb" dark="true" padding="80px 0"]
  <!-- Call to action -->
[/section]
```

---

## Pattern: Hero with badge, title, subtitle, and buttons

**HTML source:**
```html
<section class="hero">
  <div class="hero-tag">✓ Badge text</div>
  <h1>Title with <em>highlight</em></h1>
  <p class="hero-sub">Subtitle description</p>
  <div class="hero-btns">
    <button class="btn-primary">Primary CTA</button>
    <button class="btn-ghost">Secondary CTA</button>
  </div>
</section>
```

**UX Builder shortcode:**
```
[section class="hpb-hero" padding="100px 5%" padding__sm="60px 5%"]
  [row h_align="center"]
    [col span="8" span__md="10" span__sm="12" align="center"]

      <div class="hpb-hero-tag"><i class="fa-solid fa-circle-check"></i> Badge text</div>

      [ux_text text_align="center"]
        <h1 class="hpb-hero-title">Title with <em>highlight</em></h1>
      [/ux_text]

      [gap height="10px"]

      <p class="hpb-hero-sub">Subtitle description goes here with more detail.</p>

      [gap height="25px"]

      <div class="hpb-hero-btns">
        <a href="#portfolio" class="hpb-btn-primary"><i class="fa-solid fa-rocket"></i> Primary CTA</a>
        <a href="#contact" class="hpb-btn-ghost"><i class="fa-regular fa-comment-dots"></i> Secondary CTA</a>
      </div>

    [/col]
  [/row]
[/section]
```

> **Why raw HTML buttons?** Flatsome's `[button]` shortcode works for simple buttons, but when you need custom styling (icons, specific border-radius, specific color transitions), raw HTML `<a>` tags with custom CSS classes give more control.

---

## Pattern: Stats bar (horizontal counters)

**HTML source:**
```html
<div class="stats">
  <div class="stat-item">
    <div class="stat-icon"><i class="fa-solid fa-briefcase"></i></div>
    <div class="stat-num">200+</div>
    <div class="stat-label">Projects</div>
  </div>
  <!-- more stat items -->
</div>
```

**UX Builder shortcode:**
```
[section class="hpb-stats-section" padding="0"]
  [row style="collapse" v_align="equal"]
    [col span="3" span__md="6" span__sm="6" class="hpb-stat-col"]
      <div class="hpb-stat-item">
        <div class="hpb-stat-icon"><i class="fa-solid fa-briefcase"></i></div>
        <div class="hpb-stat-num">200+</div>
        <div class="hpb-stat-label">Dự án hoàn thành</div>
      </div>
    [/col]
    [col span="3" span__md="6" span__sm="6" class="hpb-stat-col"]
      <div class="hpb-stat-item">
        <div class="hpb-stat-icon"><i class="fa-solid fa-heart"></i></div>
        <div class="hpb-stat-num">98%</div>
        <div class="hpb-stat-label">Khách hàng hài lòng</div>
      </div>
    [/col]
    [col span="3" span__md="6" span__sm="6" class="hpb-stat-col"]
      <div class="hpb-stat-item">
        <div class="hpb-stat-icon"><i class="fa-solid fa-star"></i></div>
        <div class="hpb-stat-num">5+</div>
        <div class="hpb-stat-label">Năm kinh nghiệm</div>
      </div>
    [/col]
    [col span="3" span__md="6" span__sm="6" class="hpb-stat-col"]
      <div class="hpb-stat-item">
        <div class="hpb-stat-icon"><i class="fa-solid fa-chart-line"></i></div>
        <div class="hpb-stat-num">3x</div>
        <div class="hpb-stat-label">Tăng tỷ lệ chuyển đổi</div>
      </div>
    [/col]
  [/row]
[/section]
```

**CSS (in `style.css`):**
```css
.hpb-stat-col .col-inner {
  padding: 0;
}
.hpb-stat-item {
  text-align: center;
  padding: 2rem 3rem;
  border-right: 1px solid var(--hpb-border);
}
.hpb-stat-col:last-child .hpb-stat-item {
  border-right: none;
}
```

---

## Pattern: Cards grid (services, features)

**Bad Practice (Abusing HTML):**
```html
[col]
  <div class="my-card" style="background:#fff; padding:20px; border-radius:10px; box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <h3>Title</h3>
    <p>Text</p>
  </div>
[/col]
```

**Good Practice (Native Flatsome UX Builder):**
```
[section class="my-services" padding="80px 5%"]
  [row]
    [col span="12" align="center"]
      [title text="Giải pháp toàn diện" sub_text="Chúng tôi cung cấp giải pháp tối ưu" style="center"]
    [/col]
  [/row]

  [gap height="30px"]

  [row style="small" col_bg="#fff" v_align="equal"]
    [col span="3" span__md="6" span__sm="12" padding="30px 30px 30px 30px" bg_radius="12" depth="1" depth_hover="3" animate="fadeInUp"]
      [ux_text text_align="left"]
        <h3 style="color:#2563eb"><i class="fa-solid fa-globe"></i></h3>
        <h4 class="uppercase">Thiết kế Website</h4>
        <p>Description text here with native editing.</p>
      [/ux_text]
    [/col]
    [col span="3" span__md="6" span__sm="12" padding="30px 30px 30px 30px" bg_radius="12" depth="1" depth_hover="3" animate="fadeInUp"]
      [ux_text text_align="left"]
        <h3 style="color:#16a34a"><i class="fa-solid fa-bullseye"></i></h3>
        <h4 class="uppercase">Landing Page</h4>
        <p>Description text here with native editing.</p>
      [/ux_text]
    [/col]
  [/row]
[/section]
```

> **Why this is better:** By using `col_bg`, `padding`, `bg_radius` and `depth` on the `[col]` itself, the client can visually adjust colors, shadows, and spacing using sliders inside UX Builder without touching CSS.

---

## Pattern: Process steps

**UX Builder shortcode:**
```
[section class="my-process" bg_color="#f7f8fc" padding="80px 5%"]
  [row]
    [col span="12" align="center"]
      [title text="Quy trình thực hiện" style="center"]
    [/col]
  [/row]
  [gap height="30px"]
  [row style="small" col_bg="#fff" v_align="equal"]
    [col span="3" span__md="6" span__sm="12" padding="30px 30px 30px 30px" bg_radius="10" depth="0" depth_hover="1" class="step-card"]
      [ux_text]
        <h2 style="color:#e2e8f0; margin-bottom:5px">01</h2>
        <h4>Tư vấn & Phân tích</h4>
        <p>Lắng nghe nhu cầu khách hàng.</p>
      [/ux_text]
    [/col]
    [col span="3" span__md="6" span__sm="12" padding="30px 30px 30px 30px" bg_radius="10" depth="0" depth_hover="1" class="step-card"]
      [ux_text]
        <h2 style="color:#e2e8f0; margin-bottom:5px">02</h2>
        <h4>Thiết kế Prototype</h4>
        <p>Xây dựng bản mockup.</p>
      [/ux_text]
    [/col]
  [/row]
[/section]
```

---

## Pattern: Portfolio / Project cards

**Bad Practice (Abusing HTML):**
Using raw HTML `div` blocks for image cards.

**Good Practice (Native Flatsome `[ux_image_box]`):**
```
[row style="small"]
  [col span="4" span__md="6" span__sm="12"]
    [ux_image_box style="vertical" img="123" image_height="50%" depth="1" depth_hover="3" text_align="left"]
      <h4>Project Name</h4>
      <p>Description of the project</p>
      <a href="#" class="button is-link is-small">View Project</a>
    [/ux_image_box]
  [/col]
[/row]
```

---

## Pattern: Testimonials

**Bad Practice (Abusing HTML):**
Writing `<div class="testi-card">` with raw HTML stars.

**Good Practice (Native Flatsome `[testimonial]` inside Column):**
```
[section class="hpb-testimonials" bg_color="#f7f8fc" padding="80px 5%"]
  [row]
    [col span="12" align="center"]
      [title text="Được tin tưởng bởi khách hàng" style="center"]
    [/col]
  [/row]
  [gap height="30px"]
  [row style="small"]
    [col span="4" span__md="6" span__sm="12" padding="30px 30px 30px 30px" bg_color="#fff" bg_radius="10" depth="1" depth_hover="3"]
      [testimonial image="456" image_width="50" pos="left" name="Nguyễn Văn A" company="CEO"]
        "Đây là nhận xét của khách hàng. Tôi rất hài lòng."
      [/testimonial]
    [/col]
  [/row]
[/section]
```

---

## Using Flatsome's built-in shortcodes vs raw HTML

**CRITICAL RULE:** Never use raw generic `div` tags inside `[col]` for layout. Use Flatsome's Native Layout attributes!

| Situation | Proper Native Flatsome Way |
|-----------|----------------------|
| **Card / Box layout with background** | `[col bg_color="#fff" padding="..."]` |
| **Card Shadow & Hover** | `[col depth="1" depth_hover="3"]` |
| **Rounded Corners** | `[col bg_radius="10"]` |
| **Section Title** | `[title text="..." sub_text="..."]` |
| **Simple Icon Box** | `[featured_box img="123"]` (If using image icon) |
| **FontAwesome Icon Box** | `[col bg_color="..."]` + `[ux_text]` with `<i class="...">` |
| **Image Card / Blog Card** | `[ux_image_box]` |
| **Testimonials** | `[testimonial]` |
| **Custom Buttons** | `[button]` or `<a>` with Flatsome `.button` classes |

**When to use raw HTML (`[ux_html]` or inside `[ux_text]`):**
- ONLY for inline custom SVG icons.
- ONLY for `<i>` FontAwesome icon tags.
- ONLY for a very custom element that Flatsome truly does not support (e.g. extremely complex JavaScript-driven pricing toggles).

---

## Tips for editing in UX Builder

1. **Leverage Column Attributes First:** Before writing CSS to make a box, check if `[col bg_color="#fff" depth="1" padding="20px"]` solves it.
2. **Text alignment:** Use `[ux_text text_align="center"]` instead of writing HTML `<div style="text-align:center">`.
3. **Always test in UX Builder preview** after pasting shortcodes.
4. **Avoid double nesting sections** — `[section]` inside `[section]` will break the layout.
5. **Column nesting limit** — use `[row_inner]` and `[col_inner]` when nesting columns inside columns.

---

## Pattern: National Project Grid (Masonry-like)

Used for showing projects by city with asymmetrical column spanning (1 tall, 4 small, 1 tall).

**UX Builder shortcode:**
```
[row v_align="equal" class="mvl-national-row"]
  [col span="3" span__md="12" animate="fadeInUp"]
    <div class="mvl-city-banner mvl-city-tall">
      <img src="..." alt="...">
      <div class="mvl-city-overlay">
        <h3 class="mvl-city-title">Hà Nội - 80 Dự án</h3>
        <a href="#" class="mvl-city-link">Xem ngay &rsaquo;</a>
      </div>
    </div>
  [/col]
  [col span="6" span__md="12"]
    [row_inner v_align="equal"]
      [col_inner span="6" span__sm="12"]
        <div class="mvl-city-banner">...</div>
      [/col_inner]
      [col_inner span="6" span__sm="12"]
        <div class="mvl-city-banner">...</div>
      [/col_inner]
      <!-- 2 more inner cols -->
    [/row_inner]
  [/col]
  [col span="3" span__md="12"]
    <div class="mvl-city-banner mvl-city-tall">...</div>
  [/col]
[/row]
```

---

## Pattern: Asymmetrical News Grid

1 large featured article on the left, 2 smaller list items on the right.

**UX Builder shortcode:**
```
[row]
  [col span="7" span__md="12"]
    <div class="mvl-news-featured">
      <img src="..." alt="...">
      <div class="mvl-news-featured-content">
        <h3>Article Title</h3>
        <p>Short excerpt text...</p>
      </div>
    </div>
  [/col]
  [col span="5" span__md="12"]
    <div class="mvl-news-item">
      <div class="mvl-news-item-img"><img src="..."></div>
      <div class="mvl-news-item-info">
        <h4>Small Title</h4>
        <div class="date">01/01/2026</div>
      </div>
    </div>
    <!-- more news items -->
  [/col]
[/row]
```

---

## Pattern: Circular Process Steps

Icons inside circles with hover effects and descriptions.

**UX Builder shortcode:**
```
[row]
  [col span="3" span__md="6" span__sm="12"]
    <div class="mvl-process-item">
      <div class="mvl-process-icon"><i class="fa-solid fa-icon"></i></div>
      <h4>STEP TITLE</h4>
      <p>Description text here.</p>
    </div>
  [/col]
[/row]
```

---

## Pattern: Stats Counters (Large Numbers)

Simple, high-impact stats using large typography.

**UX Builder shortcode:**
```
[row]
  [col span="3" span__md="6" span__sm="12"]
    <div class="mvl-stats-box">
      <div class="mvl-stats-num">500+</div>
      <div class="mvl-stats-text">Label Text</div>
    </div>
  [/col]
[/row]

---

## Pattern: Dynamic Filter Bar + Location Dropdown (Clean Logic)

Commonly used for real-estate or portfolio grids to allow filtering by multiple taxonomies simultaneously.

**UX Builder shortcode:**
```
[ux_html]
<div class="mvl-filters" id="mvl-project-filters">
    <!-- Category Pill Buttons -->
    <a href="?du-an-cat=all#mvl-project-filters" class="mvl-filter-btn" data-cat="all">Tất cả</a>
    <a href="?du-an-cat=chung-cu#mvl-project-filters" class="mvl-filter-btn" data-cat="chung-cu">Chung cư</a>
    
    <!-- Location Dropdown (No inline JS) -->
    <select id="mvl-location-select" class="mvl-filter-select">
        <option value="all">Khu vực</option>
        <option value="ha-noi">Hà Nội</option>
        <option value="van-giang">Văn Giang</option>
    </select>
</div>
[/ux_html]

[hpb_portfolio_grid posts="6" columns="3"]
```

**External JS (Add via WPCode Lite or child theme JS):**
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const locSelect = document.getElementById('mvl-location-select');
    if (locSelect) {
        locSelect.addEventListener('change', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('du-an-cat') || 'all';
            const loc = this.value;
            window.location.href = `?du-an-cat=${cat}&du-an-loc=${loc}#mvl-project-filters`;
        });

        // Sync select value with URL on load
        const currentLoc = new URLSearchParams(window.location.search).get('du-an-loc') || 'all';
        locSelect.value = currentLoc;
    }
});
```

---

## Pattern: Partner Logo Grid (Individual Elements)

The preferred structure for "Khách hàng & Đối tác" sections to ensure client ease-of-use and professional rendering.

**UX Builder shortcode:**
```
[section bg_color="#fff" padding="60px 0" class="mvl-partners-section"]
  [row slider="true" slider_nav_style="simple" slider_nav_color="light" col_style="solid"]
    [col span="2" span__sm="6"]
      [ux_image id="IMAGE_ID" image_size="original"]
    [/col]
    [col span="2" span__sm="6"]
      [ux_image id="IMAGE_ID" image_size="original"]
    [/col]
    [col span="2" span__sm="6"]
      [ux_image id="IMAGE_ID" image_size="original"]
    [/col]
  [/row]
[/section]
```

**Why this is best:** Each logo is a distinct element in the UX Builder tree, allowing non-technical users to swap images or reorder them via drag-and-drop. Avoid using `[logo_slider]` or text blocks for this.


