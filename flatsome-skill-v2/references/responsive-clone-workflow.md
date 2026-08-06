# Responsive Clone Workflow — Đa breakpoint

> Dùng khi user gửi cả ảnh desktop + mobile, hoặc yêu cầu "phải đẹp trên mobile".  
> Workflow có hệ thống: audit từng breakpoint riêng → tạo diff → map rules.

---

## Flatsome Breakpoints (fixed, không thay đổi)

| Tên | Width | Attribute suffix | CSS media query |
|---|---|---|---|
| Desktop | > 849px | *(không có suffix)* | default |
| Tablet (md) | ≤ 849px | `__md` | `@media (max-width: 849px)` |
| Mobile (sm) | ≤ 549px | `__sm` | `@media (max-width: 549px)` |

---

## Bước 1 — Responsive Section Inventory

Nếu có ảnh mobile: chạy Section Inventory riêng cho mobile, so sánh với desktop.

```
=== RESPONSIVE DIFF — [Project] ===

Section [HERO]
  Desktop: 2 cột (text trái 6, ảnh phải 6)
  Tablet:  2 cột (text trái 7, ảnh phải 5) — ảnh nhỏ hơn
  Mobile:  1 cột stack (text trên, ảnh dưới)
  → span="6" span__md="7" span__sm="12" / span="6" span__md="5" span__sm="12"
  → text_align thay đổi: desktop left → mobile center

Section [SERVICES GRID]
  Desktop: 4 cột
  Tablet:  2 cột
  Mobile:  1 cột
  → span="3" span__md="6" span__sm="12"

Section [STATS BAR]
  Desktop: 4 số ngang hàng
  Tablet:  2×2 grid
  Mobile:  2×2 (giữ nguyên tablet)
  → span="3" span__md="6" span__sm="6"

Section [TESTIMONIALS]
  Desktop: 3 cards slider
  Tablet:  2 cards
  Mobile:  1 card full-width + swipe
  → [row slider="true" columns="3" columns__md="2" columns__sm="1"]

Section [FOOTER]
  Desktop: 4 cột ngang
  Mobile:  1 cột stack dọc
  → CSS Grid: grid-template-columns → column; gap giữ nguyên
```

---

## Bước 2 — Responsive Attribute Reference

### Layout columns

```
[col span="6" span__md="6" span__sm="12"]
         ↑desktop  ↑tablet    ↑mobile
```

### Padding / Gap

```
[section padding="80px 0" padding__md="50px 0" padding__sm="36px 0"]
[gap height="40px" height__md="24px" height__sm="16px"]
```

### Visibility (ẩn/hiện theo breakpoint)

```
[col visibility="hide-for-small"]     → ẩn trên mobile
[col visibility="show-for-small"]     → chỉ hiện trên mobile
[col visibility="hide-for-medium"]    → ẩn tablet + mobile
```

### Alignment mobile

```
[col span__sm="12" align__sm="center"]  → căn giữa trên mobile
[ux_text text_align__sm="center"]       → text căn giữa mobile
```

---

## Bước 3 — CSS Responsive Rules

### Template scoped CSS (thêm vào cuối style.css hoặc page-specific CSS)

```css
/* ===== [PROJECT] RESPONSIVE ===== */

/* Tablet ≤849px */
@media (max-width: 849px) {

  /* Hero */
  .PROJECT-hero-title {
    font-size: clamp(28px, 5vw, 40px) !important;
  }
  .PROJECT-hero-subtitle {
    font-size: 16px !important;
  }

  /* Section titles */
  .PROJECT-section-title {
    font-size: clamp(24px, 4vw, 32px) !important;
  }

  /* Cards */
  .PROJECT-card {
    padding: 20px !important;
  }

  /* Footer grid: 2 cột */
  .PROJECT-footer-main {
    grid-template-columns: 1fr 1fr !important;
    gap: 32px !important;
  }
}

/* Mobile ≤549px */
@media (max-width: 549px) {

  /* Hero */
  .PROJECT-hero-title {
    font-size: 26px !important;
    line-height: 1.2 !important;
  }

  /* Buttons stack */
  .PROJECT-hero-btns {
    flex-direction: column !important;
    gap: 12px !important;
  }
  .PROJECT-hero-btns .button {
    width: 100% !important;
    text-align: center !important;
  }

  /* Cards full width */
  .PROJECT-card {
    margin: 0 !important;
  }

  /* Footer: 1 cột */
  .PROJECT-footer-main {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
  }

  /* Hide decorative elements */
  .PROJECT-decor,
  .PROJECT-bg-shape {
    display: none !important;
  }

  /* Section padding giảm */
  .PROJECT-section {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }
}
```

---

## Bước 4 — Image Responsive

### Aspect ratio theo breakpoint

```css
/* Desktop: landscape */
.PROJECT-card-img {
  aspect-ratio: 16/9;
  object-fit: cover;
  width: 100%;
}

/* Mobile: square hoặc taller */
@media (max-width: 549px) {
  .PROJECT-card-img {
    aspect-ratio: 4/3;
  }
}
```

### Ảnh hero khác nhau trên mobile

```wordpress
[ux_banner bg="DESKTOP_BG_ID" height="600px" height__sm="350px" bg_pos="center center"]
```

CSS nếu cần ảnh hoàn toàn khác:
```css
@media (max-width: 549px) {
  #section_HERO_ID .bg {
    background-image: url('MOBILE_IMAGE_URL') !important;
    background-position: top center !important;
  }
}
```

---

## Bước 5 — Slider / Carousel responsive

```wordpress
[row slider="true" 
  columns="3" columns__md="2" columns__sm="1"
  arrows="true" arrows__sm="false"
  bullets="true" bullets__sm="true"
  auto_slide="5000"]
```

---

## Bước 6 — Typography responsive (clamp)

Thay vì set 2 giá trị, dùng `clamp()` — tự scale theo viewport:

```css
/* Desktop 40px, Mobile 24px, scale tuyến tính */
.PROJECT-h1 { font-size: clamp(24px, 4vw, 40px); }
.PROJECT-h2 { font-size: clamp(20px, 3vw, 32px); }
.PROJECT-h3 { font-size: clamp(16px, 2vw, 22px); }

/* Thêm fallback cho IE nếu cần */
.PROJECT-h1 { font-size: 32px; font-size: clamp(24px, 4vw, 40px); }
```

---

## Responsive QA Checklist

Sau khi build xong, check từng breakpoint:

### Desktop (1200px+)
```
□ Container đúng max-width
□ Grid columns đúng số cột
□ Images đúng aspect ratio
□ Typography đúng size
□ Header layout đúng
□ Footer layout đúng
```

### Tablet 768-849px
```
□ Không có horizontal scroll
□ Grid đã adjust (thường 2 cột)
□ Nav menu đã chuyển hamburger hoặc compact
□ Images không bị crop lạ
□ Padding section đủ nhỏ
```

### Mobile 375px
```
□ Single column layout
□ Text không bị tràn container
□ Buttons đủ to để tap (min 44px height)
□ Images không bị vỡ
□ Footer stack dọc gọn
□ Hero height không quá cao
□ Không có text overflow hay hidden content
□ Form fields đủ rộng để nhập
```

---

## Common Responsive Bugs & Fixes

| Bug | Nguyên nhân | Fix |
|---|---|---|
| Horizontal scroll trên mobile | Element vượt 100vw | `overflow-x: hidden` trên `.page-wrapper` hoặc section |
| Image quá to trên mobile | Không set width 100% | `.PROJECT-img { max-width: 100%; height: auto; }` |
| Text tràn ra ngoài card | Font size quá lớn | Dùng `clamp()` hoặc `font-size` breakpoint override |
| Columns không stack | Quên `span__sm="12"` | Thêm `span__sm="12"` cho tất cả `[col]` |
| Hero quá cao trên mobile | Height cố định | `height__sm="300px"` hoặc `height__sm="auto"` |
| Button quá nhỏ để tap | Padding không đủ | `min-height: 44px; padding: 12px 20px` |
| Grid gap quá rộng trên mobile | Không override gap | CSS gap trong `@media (max-width: 549px)` |
| Footer logo quá to | Width không responsive | `.logo img { max-width: 140px; width: 100%; }` |
