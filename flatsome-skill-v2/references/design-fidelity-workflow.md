# Design Fidelity Workflow: Screenshot / Ảnh Thiết Kế → Flatsome

> Dùng khi user nói: "làm giống mẫu", "clone", "chuyển mẫu", "pixel-perfect",
> hoặc gửi ảnh chụp màn hình, mockup AI, ảnh thiết kế bất kỳ.

---

## Table of Contents

1. [Fidelity Levels — Chọn mức độ bám mẫu](#1-fidelity-levels)
2. [Quy trình khi chỉ có ảnh (Screenshot-Only)](#2-quy-trình-khi-chỉ-có-ảnh)
3. [Bước 1 — Section Inventory (Liệt kê sections)](#3-bước-1--section-inventory)
4. [Bước 2 — Trích xuất màu sắc từ ảnh](#4-bước-2--trích-xuất-màu-sắc-từ-ảnh)
5. [Bước 3 — Nhận dạng font chữ từ ảnh](#5-bước-3--nhận-dạng-font-chữ-từ-ảnh)
6. [Bước 4 — Ước tính spacing & sizing](#6-bước-4--ước-tính-spacing--sizing)
7. [Bước 5 — Component Pattern Recognition](#7-bước-5--component-pattern-recognition)
8. [Bước 6 — Mapping sang Flatsome Shortcodes](#8-bước-6--mapping-sang-flatsome-shortcodes)
9. [Bước 7 — CSS Token File](#9-bước-7--css-token-file)
10. [Bước 8 — Code từng section](#10-bước-8--code-từng-section)
11. [Header & Footer Fidelity](#11-header--footer-fidelity)
12. [Visual QA Checklist](#12-visual-qa-checklist)
13. [Common Failure Patterns](#13-common-failure-patterns)
14. [Template — Design Audit Output](#14-template--design-audit-output)

---

## 1. Fidelity Levels

| User nói | Target | Architecture |
|---|---|---|
| "theo phong cách", "lấy cảm hứng", "tương tự" | 70–80% | Approach A — UX Builder defaults + project CSS |
| "giống mẫu", "bám mẫu", "làm như này" | 85–95% | Approach A + strict CSS + custom header/footer block |
| "giống 95-100%", "pixel-perfect", so sánh ảnh | 95–100% | Hybrid (UX Builder content + PHP wrapper) hoặc Approach B |

**Quy tắc tradeoff quan trọng:**
- UX Builder editability và pixel-perfect fidelity cạnh tranh nhau.
- Khi ≥95% là bắt buộc: dùng Hybrid — content editable trong shortcodes, layout precision trong PHP template + CSS.
- Khi client không cần tự sửa: dùng Approach B (PHP template) — không giới hạn DOM.

---

## 2. Quy trình khi chỉ có ảnh (Screenshot-Only)

> Đây là trường hợp phổ biến nhất. User gửi 1-3 ảnh, không có URL, không có HTML, không có file thiết kế.

### Thứ tự bắt buộc — KHÔNG code trước khi audit xong

```
1. Nhận ảnh → chạy Section Inventory (§3)
2. Trích xuất màu sắc (§4)
3. Nhận dạng font (§5)
4. Ước tính spacing (§6)
5. Nhận dạng component patterns (§7)
6. Map sang Flatsome shortcodes (§8)
7. Viết CSS token file (§9)
8. Code từng section (§10)
9. QA checklist (§12)
```

### Câu hỏi hỏi user TRƯỚC KHI BẮT ĐẦU

```
1. Fidelity cần đạt bao nhiêu %? (75%, 90%, 100%)
2. Client cần tự chỉnh sửa nội dung trong WP Admin không?
3. Có file font/logo gốc không? (ảnh hưởng fidelity lớn)
4. Site có bao nhiêu trang? (để plan approach)
5. Màu brand chính là gì? (nếu không thấy rõ trong ảnh)
```

### Khi nhận được nhiều ảnh

| Trường hợp | Cách xử lý |
|---|---|
| Desktop + Mobile | Desktop trước, sau đó audit responsive breakpoints từ ảnh mobile |
| Nhiều trang | Tạo section inventory cho từng trang, tìm components chung |
| Chỉ 1 section / partial | Xác nhận còn những sections nào khác chưa có ảnh |
| Ảnh mờ / thấp res | State rõ: giá trị nào là inferred, nào là exact |

---

## 3. Bước 1 — Section Inventory (Liệt kê sections)

Nhìn toàn bộ ảnh từ trên xuống dưới, liệt kê **từng section** theo format:

```
[N] TÊN SECTION
    Layout: [mô tả cấu trúc cột/grid]
    Background: [màu/ảnh/gradient]
    Nội dung chính: [list các elements]
    Điểm đặc biệt: [animation, overlay, shadow, v.v.]
```

**Ví dụ output Section Inventory:**

```
[1] HEADER
    Layout: Logo trái | Nav giữa | Button CTA phải
    Background: Trắng #ffffff, shadow nhẹ
    Nội dung: Logo, 4 nav items, button "Liên hệ ngay"
    Đặc biệt: Sticky khi scroll, height ~80px

[2] HERO BANNER
    Layout: Full-width bg image, text overlay căn giữa
    Background: Ảnh xe hơi, dark overlay rgba(0,0,0,0.5)
    Nội dung: Badge nhỏ, H1 trắng, H2 phụ, 2 buttons (primary + outline)
    Đặc biệt: Height ~600px, buttons side-by-side

[3] INFO BAR
    Layout: 4 cột đều nhau
    Background: Xanh đậm #1a3a5c
    Nội dung: 4 icon + title + subtitle (Bảo hành, Cứu hộ, Sạc pin, Lái thử)
    Đặc biệt: Dark section, icon outline trắng, padding 30px

[4] PRODUCT GRID
    Layout: 3 cột sản phẩm
    Background: Trắng
    Nội dung: Filter tabs trên, mỗi card = ảnh + tên + giá + specs + 2 buttons
    Đặc biệt: Card có shadow, specs bar dưới giá (km/s/hp)

[5] FOOTER
    Layout: 4 cột + bottom bar
    Background: Tối #111827
    Nội dung: Logo + mô tả | Links | Links | Liên hệ | Copyright
    Đặc biệt: Text màu xám nhạt
```

---

## 4. Bước 2 — Trích xuất màu sắc từ ảnh

Claude có thể đọc màu trực tiếp từ ảnh. Với mỗi ảnh nhận được, trích xuất **bảng màu** theo template:

### Template trích xuất màu

```css
/* === DESIGN TOKENS — [Project Name] === */
/* Trích xuất từ screenshot — [ngày] */

:root {
  /* Primary brand color */
  --c-primary:        #????;   /* Màu nút chính, link active, highlight */
  --c-primary-dark:   #????;   /* Hover state của primary */
  --c-primary-light:  #????;   /* Background nhạt của primary (badge, tag) */

  /* Secondary */
  --c-secondary:      #????;   /* Màu phụ (icon, border accent) */

  /* Text colors */
  --c-text-heading:   #????;   /* H1, H2, H3 color */
  --c-text-body:      #????;   /* Paragraph color */
  --c-text-muted:     #????;   /* Caption, meta, placeholder */
  --c-text-inverse:   #ffffff; /* Text trên dark bg */

  /* Backgrounds */
  --c-bg-white:       #ffffff;
  --c-bg-light:       #????;   /* Section bg nhạt (thường #f8fafc hoặc #f3f4f6) */
  --c-bg-dark:        #????;   /* Dark section bg */
  --c-bg-footer:      #????;   /* Footer bg */

  /* Borders & Dividers */
  --c-border:         #????;   /* Card border, divider */

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-hover: 0 8px 24px rgba(0,0,0,0.14);

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-pill: 50px;
}
```

### Kỹ thuật đọc màu từ ảnh

1. **Màu background section**: Nhìn vùng trống không có content → ước tính shade của white/grey/dark
2. **Màu primary**: Button CTA rõ nhất trong ảnh → màu fill
3. **Màu heading**: Text lớn nhất → thường là #111827, #1f2937, #0f172a hoặc đen thuần
4. **Màu body text**: Paragraph nhỏ → thường #374151, #4b5563, #6b7280
5. **Màu muted**: Metadata, caption → thường #9ca3af, #d1d5db

**Công thức ước tính phổ biến:**
```
Nếu theme có vẻ "xanh dương doanh nghiệp"  → primary: #1d4ed8, #2563eb, hoặc #1e40af
Nếu theme có vẻ "xanh lá tự nhiên"          → primary: #16a34a, #15803d
Nếu theme có vẻ "đỏ/cam năng động"          → primary: #dc2626, #ea580c
Nếu theme có vẻ "tím luxury"                → primary: #7c3aed, #6d28d9
Nếu theme có vẻ "đen minimal/premium"       → primary: #111827, accent: #f59e0b
```

---

## 5. Bước 3 — Nhận dạng font chữ từ ảnh

### Cách nhận dạng font từ screenshot

Quan sát **heading lớn nhất** (H1) và **body text** trong ảnh:

| Đặc điểm visual | Font có thể | Google Font import |
|---|---|---|
| Chữ đậm, bo tròn, thân thiện | Poppins, Nunito | `@import url('...Poppins:300,400,600,700')` |
| Chữ mảnh, hiện đại, sắc nét | Inter, Roboto | `@import url('...Inter:300,400,500,600,700')` |
| Có serif, truyền thống | Playfair Display, Merriweather | `@import url('...Playfair+Display:400,700')` |
| Chữ rất đậm, góc cạnh, tech | Montserrat, Barlow | `@import url('...Montserrat:400,600,700,800')` |
| Cân bằng, neutral, clean | Source Sans Pro, Lato | `@import url('...Lato:300,400,700')` |
| Vietnamese, có dấu rõ đẹp | Be Vietnam Pro, Lexend | `@import url('...Be+Vietnam+Pro:400,500,600,700')` |

### Ước tính font sizes từ ảnh

Dùng heading lớn nhất làm baseline, ước tính tương đối:

```
H1 (lớn nhất, hero): thường 40–72px desktop, 28–40px mobile
H2 (section title): thường 28–40px
H3 (card title): thường 18–24px
Body: thường 14–16px
Caption/meta: thường 12–13px
```

### CSS Typography từ ảnh

```css
/* Áp dụng font vào child theme */
@import url('https://fonts.googleapis.com/css2?family=FONT_NAME:wght@300;400;600;700&display=swap');

body { font-family: 'FONT_NAME', -apple-system, sans-serif; font-size: 16px; }
h1, h2, h3, h4 { font-family: 'FONT_NAME', sans-serif; font-weight: 700; }

/* Project-scoped headings */
.PROJECT-hero-title   { font-size: clamp(36px, 5vw, 64px); font-weight: 800; line-height: 1.1; }
.PROJECT-section-title { font-size: clamp(24px, 3vw, 40px); font-weight: 700; line-height: 1.2; }
.PROJECT-card-title   { font-size: 18px; font-weight: 600; }
.PROJECT-body         { font-size: 16px; line-height: 1.7; color: var(--c-text-body); }
```

---

## 6. Bước 4 — Ước tính spacing & sizing

### Spacing scale phổ biến (Tailwind-like)

Khi không biết chính xác, dùng scale chuẩn:

```
4px   → khoảng cách icon-text
8px   → padding nhỏ (badge, tag)
12px  → gap giữa elements nhỏ
16px  → padding card nhỏ, gap grid nhỏ
20px  → padding card thường
24px  → gap giữa cards, button padding ngang
30px  → padding section nội bộ
40px  → section padding nhỏ
60px  → section padding thường
80px  → section padding lớn
100px → section padding hero
```

### Đọc spacing từ ảnh

1. **Section padding**: Khoảng trống từ mép section đến content → ước tính 40–100px
2. **Card padding**: Khoảng trong card → ước tính 20–30px
3. **Gap giữa cards**: Khoảng trắng giữa các card → ước tính 16–30px
4. **Container max-width**: Nếu content không chiếm full width → thường 1200px
5. **Column ratio**: Ước tính theo tỷ lệ nhìn thấy (50/50, 60/40, 40/60, 30/70)

### Template Measurement Ledger

```
=== MEASUREMENT LEDGER — [Project] ===

Container max-width:      ____px  (ước tính / exact)
Header height:            ____px
Hero height:              ____px
Section padding (desktop):____px top/bottom
Section padding (mobile): ____px top/bottom
Column gap (grid):        ____px
Card padding:             ____px
Card border-radius:       ____px
Card shadow:              [có / không / mô tả]

H1 font size:             ____px / weight ____
H2 font size:             ____px / weight ____
H3 font size:             ____px / weight ____
Body font size:           ____px / line-height ____
Button height:            ____px / radius ____px / padding ____ ____
Image aspect ratio:       ____:____ (hero), ____:____ (card thumbnail)
```

---

## 7. Bước 5 — Component Pattern Recognition

Nhìn vào từng section và nhận dạng pattern. Đây là bản đồ từ **visual** → **Flatsome code**.

### HERO PATTERNS

**Pattern: Full-width ảnh nền + text overlay**
```
Visual: Ảnh lớn toàn width, text đè lên trên, overlay tối
→ [ux_banner bg="ID" height="600px" bg_overlay="rgba(0,0,0,0.5)"]
     [text_box position_x="50" position_y="50" text_align="center"]
```

**Pattern: Split hero (text trái + ảnh phải)**
```
Visual: Nửa trái = text + button, nửa phải = ảnh hoặc illustration
→ [section][row v_align="middle"]
     [col span="6"] text content [/col]
     [col span="6"] [ux_image id="ID"] [/col]
   [/row][/section]
```

**Pattern: Video background hero**
```
Visual: Video đang chạy làm background, text đè lên
→ [section youtube="YOUTUBE_ID" height="600px" dark="true" bg_overlay="rgba(0,0,0,0.6)"]
     [row h_align="center"][col span="8" align="center"] text [/col][/row]
   [/section]
```

**Pattern: Hero nhỏ (page banner) — cho trang con**
```
Visual: Banner height ~200-300px, title căn giữa, breadcrumb bên dưới
→ [ux_banner bg="ID" height="280px" bg_overlay="rgba(0,0,0,0.5)"]
     [text_box position_x="50" position_y="50" text_align="center"]
       [ux_text]<h1>Tiêu đề trang</h1>[/ux_text]
     [/text_box]
   [/ux_banner]
```

---

### NAVIGATION PATTERNS

**Pattern: Logo trái + nav giữa + CTA phải**
```
Visual: Logo bên trái, menu links ở giữa, 1 button xanh bên phải
→ Flatsome Header Style 1 + custom CTA button via flatsome_header_top hook
```

**Pattern: Logo trái + nav phải (không có CTA)**
```
Visual: Logo trái, tất cả nav items bên phải
→ Flatsome Header Style 1 (default)
```

**Pattern: Logo giữa + nav 2 bên**
```
Visual: Logo ở trung tâm, nav links chia 2 bên
→ Flatsome Header Style 2
```

**Pattern: Top bar + header chính**
```
Visual: Bar mỏng trên cùng (số điện thoại, email, mạng xã hội) + header dưới
→ Flatsome Topbar (bật trong Customizer > Header > Topbar)
```

---

### CONTENT SECTION PATTERNS

**Pattern: 3-4 icon boxes (features/services)**
```
Visual: Grid đều, mỗi cell = icon trên + title + mô tả
→ [row][col span="3/4"][featured_box img="ID" pos="top" title="..."]...[/featured_box][/col][/row]
```

**Pattern: 2-column text + image (alternating)**
```
Visual: Hàng 1: text trái + ảnh phải; Hàng 2: ảnh trái + text phải (hoặc ngược lại)
→ [row v_align="middle"][col span="6"]text[/col][col span="6"][ux_image][/col][/row]
   [row v_align="middle"][col span="6"][ux_image][/col][col span="6"]text[/col][/row]
```

**Pattern: Stats/Counter bar**
```
Visual: 4 số lớn với label bên dưới (500+ projects, 10 years, v.v.)
→ [section bg_color="..."][row style="collapse"]
     [col span="3" align="center"][ux_text]<div class="stat">...</div>[/ux_text][/col]
   [/row][/section]
```

**Pattern: Card grid (services, blog posts, products)**
```
Visual: Grid 2-3-4 cards, mỗi card = ảnh trên + text dưới + button
→ [row][col span="4" bg_color="#fff" depth="1" bg_radius="8" padding="20px"]...[/col][/row]
   Hoặc WooCommerce product grid nếu là sản phẩm
```

**Pattern: Testimonial slider**
```
Visual: 1-3 quote cards với avatar, tên, chức vụ, star rating
→ [row slider="true"]
     [col][testimonial name="..." company="..." stars="5" image="ID"]text[/testimonial][/col]
   [/row]
```

**Pattern: Logo/Partner carousel**
```
Visual: Hàng ngang các logo công ty/đối tác, grayscale hoặc màu
→ [row slider="true" v_align="middle" style="collapse"]
     [col span="2"][ux_image id="LOGO_ID"][/col] (×N)
   [/row]
```

**Pattern: Timeline / Process steps**
```
Visual: Numbered steps 1→2→3→4 với connector line
→ [row][col span="3" align="center"]
     [ux_text]<div class="step-number">01</div><h3>Title</h3><p>Desc</p>[/ux_text]
   [/col][/row]
   + CSS for connector line via ::before/::after
```

**Pattern: Pricing table**
```
Visual: 2-3 cards giá, mỗi card = tier name + price + feature list + button
→ [ux_price_table title="..." price="..." price_freq="..."]
     [bullet_item]Feature[/bullet_item]
     [button text="..."]
   [/ux_price_table]
```

**Pattern: FAQ Accordion**
```
Visual: Danh sách câu hỏi, click expand để xem trả lời
→ Custom [faq] shortcode (xem global-sections-and-ui-patterns.md §8)
   Hoặc [ux_tabs direction="vertical"]
```

**Pattern: Contact form + map**
```
Visual: Form bên trái, Google Maps bên phải
→ [row][col span="7"][contact-form-7 ...][/col]
       [col span="5"][map address="..."][/col][/row]
```

---

### FOOTER PATTERNS

**Pattern: 4-column dark footer**
```
Visual: Background tối, 4 cột (về chúng tôi, links, links, contact), copyright bar
→ Custom footer via Global Section (xem global-sections-and-ui-patterns.md §3)
```

**Pattern: Simple footer**
```
Visual: Logo giữa + nav links ngang + social icons + copyright
→ Flatsome native footer với minimal widget areas
```

---

## 8. Bước 6 — Mapping sang Flatsome Shortcodes

Sau khi có Section Inventory và Component Pattern, tạo **bản đồ code** trước khi viết shortcode thật:

```
=== CODE MAP — [Project] ===

[1] HEADER
    Approach: Flatsome Header Style 1
    Custom: flatsome_header_top hook → CTA button
    CSS: .co-header-cta { ... }

[2] HERO
    Shortcode: [ux_banner bg="HERO_ID" height="600px" bg_overlay="rgba(0,0,0,0.5)"]
    Content: [text_box] với H1 + subtitle + 2 buttons
    CSS: .co-hero-title { font-size: clamp(40px, 5vw, 72px); }

[3] INFO BAR
    Shortcode: [section bg_color="#1a3a5c" dark="true"] + [row] + 4×[col]
    Content: [ux_text] với icon + title + subtitle
    CSS: .co-info-icon { font-size: 32px; }

[4] PRODUCT GRID
    Approach: WooCommerce archive custom (xem woocommerce-flatsome-advanced.md)
    CSS: Product card + specs bar

[5] FOOTER
    Approach: Global Section (ux_block)
    Shortcode: Footer shortcode template
```

---

## 9. Bước 7 — CSS Token File

**TRƯỚC KHI viết shortcode**, tạo toàn bộ CSS variables vào `style.css`. Đây là bước quan trọng nhất để clone giống mẫu.

```css
/* ===================================================
   [PROJECT_NAME] — Design Tokens
   Trích xuất từ screenshot [date]
   =================================================== */

/* PREFIX: [project-prefix]- để tránh conflict với Flatsome */

:root {
  /* === COLORS === */
  --vf-primary:        #1d4ed8;
  --vf-primary-dark:   #1e40af;
  --vf-primary-light:  #eff6ff;
  --vf-secondary:      #64748b;
  --vf-accent:         #f59e0b;

  --vf-text-heading:   #0f172a;
  --vf-text-body:      #374151;
  --vf-text-muted:     #6b7280;
  --vf-text-inverse:   #ffffff;

  --vf-bg-white:       #ffffff;
  --vf-bg-light:       #f8fafc;
  --vf-bg-medium:      #f1f5f9;
  --vf-bg-dark:        #1e3a5f;
  --vf-bg-footer:      #111827;

  --vf-border:         #e5e7eb;
  --vf-border-light:   #f3f4f6;

  /* === TYPOGRAPHY === */
  --vf-font-primary:   'Inter', -apple-system, sans-serif;
  --vf-font-size-xs:   12px;
  --vf-font-size-sm:   14px;
  --vf-font-size-base: 16px;
  --vf-font-size-lg:   18px;
  --vf-font-size-xl:   24px;
  --vf-font-size-2xl:  32px;
  --vf-font-size-3xl:  40px;
  --vf-font-size-4xl:  56px;

  /* === SPACING === */
  --vf-space-xs:    8px;
  --vf-space-sm:    16px;
  --vf-space-md:    24px;
  --vf-space-lg:    40px;
  --vf-space-xl:    60px;
  --vf-space-2xl:   80px;

  /* === SHAPE === */
  --vf-radius-sm:   4px;
  --vf-radius-md:   8px;
  --vf-radius-lg:   12px;
  --vf-radius-xl:   16px;
  --vf-radius-pill: 50px;

  /* === SHADOWS === */
  --vf-shadow-sm:   0 1px 3px rgba(0,0,0,0.08);
  --vf-shadow-md:   0 4px 12px rgba(0,0,0,0.10);
  --vf-shadow-lg:   0 8px 24px rgba(0,0,0,0.14);
  --vf-shadow-xl:   0 16px 40px rgba(0,0,0,0.18);

  /* === TRANSITIONS === */
  --vf-transition: all 0.2s ease;
  --vf-transition-slow: all 0.35s ease;
}

/* === OVERRIDE FLATSOME DEFAULTS (Page-scoped) === */
body.page-id-PAGE_ID .page-wrapper { padding-top: 0; }
body.page-id-PAGE_ID .row-main     { max-width: none; }
body.page-id-PAGE_ID .row-main > .col { padding-left: 0; padding-right: 0; }
```

---

## 10. Bước 8 — Code từng section

### Thứ tự coding (top-to-bottom)

```
1. Header (Global Section + CSS hook)
2. Hero / Banner section
3. Section tiếp theo...
4. Footer (Global Section)
5. Responsive overrides (849px, 549px)
```

### Template section chuẩn

```
[section bg_color="var(--PROJECT-bg-light)" padding="var(--PROJECT-space-xl) 0" padding__sm="var(--PROJECT-space-lg) 0" class="PROJECT-section-NAME"]
  [row h_align="center"]
    [col span="10" span__sm="12" align="center"]
      [ux_text]<p class="PROJECT-section-label">LABEL TRÊN</p>[/ux_text]
      [ux_text]<h2 class="PROJECT-section-title">Tiêu đề section</h2>[/ux_text]
      [ux_text]<p class="PROJECT-section-desc">Mô tả ngắn...</p>[/ux_text]
    [/col]
  [/row]
  [gap height="40px"]
  [row]
    <!-- Nội dung chính -->
  [/row]
[/section]
```

### Quy tắc khi không thể clone 100% bằng shortcode

| Vấn đề | Giải pháp |
|---|---|
| Layered images (nhiều ảnh chồng nhau) | CSS `position: absolute` trên wrapper class + pseudo-elements |
| Curved section dividers | CSS `clip-path` hoặc SVG `::after` |
| Complex gradient background | `background: linear-gradient(...)` qua CSS class |
| Asymmetric layout (không phải 50/50) | Custom grid với CSS hoặc `[col span="7"]`+`[col span="5"]` |
| Sticky sidebar | JS + CSS class toggling |
| Parallax background | `[section parallax="1"]` nếu nhẹ, hoặc CSS `background-attachment: fixed` |
| Text animation (typewriter, fade-in) | CSS animation class + `animate` attribute trên `[col]` |
| Counter animation (số đếm lên) | Custom JS snippet qua WPCode |

---

## 11. Header & Footer Fidelity

### Flatsome header defaults cần xử lý

```bash
# Tắt top bar nếu mẫu không có
wp option update flatsome_topbar_show 0 --allow-root

# Tắt WooCommerce elements nếu site brochure
wp option update flatsome_header_cart 0 --allow-root
wp option update flatsome_header_account 0 --allow-root
wp option update flatsome_header_search 0 --allow-root

# Set logo width
wp option update flatsome_logo_width 180 --allow-root

# Set header height
wp option update flatsome_header_height 80 --allow-root

# Sticky header
wp option update flatsome_header_sticky 1 --allow-root
```

### Logo: bắt buộc set đúng theo Flatsome (không chỉ WordPress site_logo)

```bash
# Upload logo
LOGO_ID=$(wp media import /path/to/logo.png --title="Logo" --porcelain --allow-root)

# Set CẢ HAI — WordPress standard + Flatsome specific
wp option update site_logo $LOGO_ID --allow-root
wp option update flatsome_logo $LOGO_ID --allow-root

# Logo trắng cho dark bg (nếu có)
LOGO_WHITE_ID=$(wp media import /path/to/logo-white.png --title="Logo White" --porcelain --allow-root)
wp option update flatsome_logo_dark $LOGO_WHITE_ID --allow-root
```

### Custom header CTA button (rất phổ biến)

```php
// child theme functions.php
add_action('flatsome_header_top', function() {
    ?>
    <a href="/lien-he" class="vf-header-cta button primary small">
        Đăng ký ngay
    </a>
    <?php
}, 20);
```

```css
.vf-header-cta {
    margin-left: 16px !important;
    font-size: 13px !important;
    padding: 9px 20px !important;
    border-radius: var(--vf-radius-sm) !important;
    white-space: nowrap;
}
@media (max-width: 549px) { .vf-header-cta { display: none; } }
```

---

## 12. Visual QA Checklist

Sau khi build xong, so sánh từng điểm với ảnh gốc:

### Desktop (1200px+)

```
□ Header: logo đúng vị trí, menu items đúng, CTA button hiện
□ Header: màu background, height, sticky behavior đúng
□ Hero: height xấp xỉ ảnh gốc, overlay đúng mức độ tối
□ Hero: H1 font size/weight gần với ảnh
□ Hero: buttons đúng style (filled vs outline), đúng màu
□ Section 1: background color/image đúng
□ Section 1: layout columns đúng tỷ lệ
□ Cards: radius, shadow, border gần với ảnh gốc
□ Cards: spacing bên trong card đúng
□ Colors: primary color đúng, không dùng Flatsome default blue
□ Footer: layout đúng số cột, màu background đúng
□ Footer: text màu đúng (thường xám nhạt trên dark bg)
```

### Mobile (375px)

```
□ Header: hamburger menu hiện, logo không quá lớn
□ Hero: text không bị tràn, button stack dọc
□ Cards: stack thành 1 cột (hoặc 2 cột nếu mẫu mobile vậy)
□ Images: không bị crop sai
□ Section padding: vừa đủ, không quá rộng hoặc hẹp
□ Footer: columns stack dọc
```

---

## 13. Common Failure Patterns

| Kết quả sai | Nguyên nhân | Fix |
|---|---|---|
| Trông như Flatsome demo generic | Không override CSS defaults | Set page-scoped CSS trước khi code content |
| Header có "Add anything here" | Top bar default active | `wp option update flatsome_topbar_show 0` |
| Logo là Flatsome logo | Set `site_logo` nhưng quên `flatsome_logo` | Set cả hai (xem §11) |
| Hero bị boxed (không full-width) | `.row-main` max-width active | Override `.row-main` cho page đó |
| Colors "gần giống" nhưng không đúng | Dùng màu tương tự thay vì extract chính xác | Lấy màu theo kỹ thuật §4 |
| Fonts khác với mẫu | Quên import Google Font | Thêm `@import` vào style.css |
| Spacing quá hẹp/rộng | Dùng Flatsome default padding | Override padding trong `[section]` attribute |
| Mobile bị vỡ layout | Không set `span__sm` | Thêm `span__sm="12"` cho tất cả columns |
| Card shadow/radius khác | Dùng Flatsome `depth="1"` default | Custom CSS `box-shadow` + `border-radius` |
| Image crop sai | Object-fit không match mẫu | CSS `object-fit: cover/contain` + aspect ratio |
| Buttons khác (size, shape) | Flatsome button defaults | Custom CSS + `class="vf-btn"` |

---

## 14. Template — Design Audit Output

Chạy template này TRƯỚC KHI code bất cứ thứ gì:

```markdown
# DESIGN AUDIT — [Project Name]
Ngày: [date] | Source: [screenshot / URL / Figma]
Fidelity target: [75% / 90% / 95-100%]
Approach: [A / B / Hybrid]

## SECTION INVENTORY
[1] HEADER: ...
[2] HERO: ...
[3] SECTION A: ...
[n] FOOTER: ...

## DESIGN TOKENS
Primary:     #xxxx
Secondary:   #xxxx
Text:        #xxxx
BG Light:    #xxxx
BG Dark:     #xxxx
Font:        [Google Font name]
Radius:      Xpx
Shadow:      [mô tả]

## MEASUREMENT LEDGER
Container:   1200px
H1:          56px / weight 800
H2:          40px / weight 700
Body:        16px / line-height 1.7
Section pad: 80px 0
Card pad:    24px
Card radius: 12px
Gap:         24px

## CODE MAP
[1] Header: Style 1 + CTA hook
[2] Hero: [ux_banner] + [text_box]
[3] ...: [section][row][col×N]
[n] Footer: Global Section

## QUESTIONS FOR USER (nếu ảnh không đủ rõ)
- Màu primary chính xác?
- Font chữ là gì?
- Có ảnh/logo gốc không?
- ...
```
