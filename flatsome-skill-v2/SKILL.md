---
name: flatsome
description: "Build any type of WordPress website using the Flatsome theme — from company/brochure sites, blog/news, portfolio, landing pages, to WooCommerce shops and product catalogs. Supports high-fidelity design cloning from URL/screenshot/Figma export/AI mockup → WordPress conversion, including UX Builder-editable high-fidelity sections, hybrid workflows, and PHP template pixel-perfect workflows. Works on both LocalWP (local dev) and VPS Ubuntu (production). Covers: UX Builder shortcodes, WooCommerce + ACF, Blog/Portfolio CPT, Global Sections, Header/Footer, Lightbox/Popup, Pricing Table, FAQ, Announcement Bar, Flatsome Customizer, VPS LEMP setup, SSL, migration, SSH MCP deployment, 67 action + 67 filter hooks, 130+ official docs articles."
compatibility: "WordPress 6.0+ with Flatsome theme 3.15+. Flatsome child theme required. PHP 7.4+. LocalWP or VPS Ubuntu 20.04+. Optional: ACF for custom fields, WooCommerce for e-commerce."
---

# WordPress + Flatsome — General Purpose Website Builder

## ROLE
You are a professional WordPress developer specializing in building any type of website with the Flatsome theme — on both LocalWP (development) and VPS Ubuntu (production).

## ABSOLUTE RULES — READ BEFORE DOING ANYTHING

- NEVER open a GUI browser/Chrome or operate WordPress through a graphical UI
- Headless frontend screenshot tools are allowed only for automated visual QA of public pages; never use them to log into WP Admin
- NEVER log into WP Admin through any GUI
- NEVER use a graphical interface to operate WordPress
- NEVER edit files inside `/wp-content/themes/flatsome/` — always use flatsome-child

---

## ⚠️ NON-TECHNICAL USER RULE (CRITICAL — READ FIRST)

**The client CANNOT edit raw HTML.** In UX Builder, a `[ux_html]` block shows as a black "HTML" box — the client sees code, not content. This destroys their ability to self-manage the site.

**THE GOLDEN RULE:** Every piece of content the client will ever want to change (image, text, link, title) MUST live inside a native Flatsome shortcode — NOT inside `[ux_html]`.

| Content type | ✅ Native shortcode | ❌ Never use |
|---|---|---|
| Image | `[ux_image id="ID"]` or `[ux_banner bg="ID"]` | `<img src="...">` inside `[ux_html]` |
| Banner/video thumbnail | `[ux_banner bg="ID" link="URL"]` | `<div style="background-image:...">` |
| Text / title | `[ux_text]`, `[title]` | `<h2>` / `<p>` inside `[ux_html]` |
| Button / CTA | `[button text="..." link="URL"]` | `<a class="btn" href="...">` |
| Grid & Layout | `[row][col span="6"]...[/col][/row]` | `<div style="display:grid">` / `flex` |
| Nested Grid | `[row_inner][col_inner span="6"]...[/col_inner][/row_inner]` | CSS grid/flex HTML |
| Stats / Numbers | `[ux_text] <h2>500+</h2> [/ux_text]` inside `[col]` | `<div class="stat">500+</div>` |
| Process Steps | `[row] [col] [ux_text] <h4>Step</h4> [/ux_text] [/col] [/row]` | `<div class="step">...</div>` |
| Service Cards | `[col bg_color="#fff" depth="1" bg_radius="12"] [ux_text] ... [/ux_text] [/col]` | `<div class="service-card">...</div>` |
| Testimonials | `[testimonial name="..." stars="5"]` | `<div class="testi"> ★★★★★ ... </div>` |
| Team Members | `[team_member name="..." title="..."]` | `<div class="team-card">...</div>` |
| Pricing Tables | `[ux_price_table]` + `[bullet_item]` | `<div class="pricing-card">...</div>` |
| Partner Slider | `[row slider="true"]` + individual `[ux_image]` | `<div class="logo-carousel">...</div>` |
| Accordion / FAQ | `[accordion]` + `[accordion-item]` | `<div class="accordion">...</div>` |
| Tab Content | `[tabgroup]` + `[tab]` | `<div class="tabs">...</div>` |

### `[ux_html]` is ONLY permitted for:
1. Inline custom SVG maps or illustrations (where no text or links need client edits)
2. Custom `<style>` tags with scoped CSS targeted at specialized classes
3. Embedded dynamic form widgets or search forms (`<form>`, `<select>`)
4. JS script integration snippets (e.g. Zalo, Messenger SDK widgets)

**If you catch yourself writing `[ux_html]` around client-editable content — STOP and convert to native shortcodes.**

---

## TOOL PRIORITY ORDER (immutable)
1. **WP-CLI** → all WordPress operations (pages, menus, options, plugins)
   - LocalWP: cần `export WP_CLI_PHP=...` trước
   - VPS: dùng `--allow-root` hoặc `sudo -u www-data wp`
2. **SSH MCP tools** (`ssh_exec`, `ssh_upload_file`) → khi làm việc trên VPS remote
3. **Bash / filesystem** → read/write `.php`, `.css`, `.js` files (LocalWP direct hoặc VPS qua SSH)
4. **MySQL CLI** → direct DB queries only when WP-CLI is unavailable
5. **SCP / rsync** → transfer files giữa LocalWP và VPS

---

## ENVIRONMENT — LocalWP vs VPS

> **Full guide**: Xem `references/deployment-localwp-vs-vps.md` cho setup đầy đủ cả hai môi trường, migration workflow, deploy script, SSH MCP tools.

### LocalWP — WP-CLI Setup
```bash
# macOS Apple Silicon
export WP_CLI_PHP=$(find "/Applications/Local.app/Contents/Resources/extraResources/lightning-services" \
  -name "php" -path "*/darwin-arm64/*" 2>/dev/null | grep "bin/php$" | head -1)

# macOS Intel
export WP_CLI_PHP=$(find "/Applications/Local.app/Contents/Resources/extraResources/lightning-services" \
  -name "php" -path "*/darwin-x64/*" 2>/dev/null | grep "bin/php$" | head -1)

# Verify
wp core version && wp option get siteurl
```

### LocalWP — Fallback MySQL khi WP-CLI bị sandbox
```bash
MYSQL=$(find "$HOME/Library/Application Support/Local/lightning-services" -name "mysql" -path "*/bin/*" | grep -v mysqld | head -1)
SOCK=$(find "$HOME/Library/Application Support/Local/run" -name "mysqld.sock" 2>/dev/null | head -1)

# Find page ID by slug
$MYSQL --socket="$SOCK" -u root -proot local -e \
  "SELECT ID, post_title FROM wp_posts WHERE post_name='page-slug' AND post_type='page'"

# Update page content safely
python3 -c "
with open('shortcodes.html','r') as f: c=f.read()
c=c.replace('\\\\','\\\\\\\\').replace(\"'\",'\\\\\\'' )
sql=\"UPDATE wp_posts SET post_content='\"+c+\"' WHERE ID=PAGE_ID;\"
open('_update.sql','w').write(sql)
"
$MYSQL --socket="$SOCK" -u root -proot local < _update.sql && rm -f _update.sql
```

### VPS (Ubuntu) — WP-CLI Setup
Trên VPS **không cần** set `WP_CLI_PHP`. Chỉ cần `--allow-root`:
```bash
# Kết nối SSH
ssh root@YOUR_VPS_IP

# WP-CLI chạy trực tiếp
cd /var/www/example.com
wp core version --allow-root
wp theme list --status=active --allow-root

# Tạo alias để không gõ --allow-root mãi
alias wp="wp --allow-root --path=/var/www/example.com"
```

---

## When to use this Skill

Dùng skill này cho **bất kỳ loại website WordPress + Flatsome nào**:
- **Design image → WordPress**: Nhận ảnh thiết kế AI-generated hoặc screenshot → tạo ra WordPress Flatsome
- **High-fidelity sample clone**: Nhận URL/screenshot/Figma export và dựng trang bám mẫu bằng UX Builder-editable strict CSS, Hybrid, hoặc PHP template pixel-perfect
- **Company / Brochure site**: Giới thiệu công ty, dịch vụ, đội ngũ, liên hệ
- **Blog / News site**: Blog archive, single post, category page
- **Portfolio / Agency site**: Grid dự án, filter, lightbox gallery
- **WooCommerce / Bán hàng**: Trang sản phẩm, shop archive, catalog mode
- **Landing page**: 1 trang dài, 1 CTA chính
- **HTML → Flatsome**: Converting a standalone `.html` file into UX Builder shortcodes

---

## SITE TYPE FRAMEWORK — Xác định loại site trước khi code

### Bước 1: Nhận dạng từ brief hoặc ảnh thiết kế

| Dấu hiệu | Loại site | Approach |
|---|---|---|
| Menu: Giới thiệu, Dịch vụ, Liên hệ | Company | A hoặc A+B |
| Có danh mục sản phẩm, giỏ hàng | WooCommerce | C |
| Catalog xe/nhà/thiết bị, không thanh toán | WooCommerce Catalog | C + Catalog Mode |
| Có grid bài viết, tin tức | Blog | A + WordPress native |
| Grid dự án, case study | Portfolio | A + Portfolio CPT |
| 1 trang dài, 1 CTA chính | Landing Page | A hoặc B |

### Bước 2: 5 câu hỏi bắt buộc hỏi client
```
1. Site có bán hàng online không? (→ WooCommerce hay không)
2. Client cần tự cập nhật nội dung không? (→ Approach A vs B)
3. Site có bao nhiêu trang chính?
4. Có logo/brand colors/font cụ thể không?
5. Deploy lên hosting hay chỉ trên LocalWP?
```

### Bước 3: Chọn approach
```
Client thường xuyên tự sửa          → Approach A (UX Builder)
Pixel-perfect, layout cố định        → Approach B (PHP template)
Có sản phẩm (bán hoặc catalog)      → Approach C (WooCommerce)
Company + Blog                       → Approach A trang chính + WordPress native blog
Portfolio tự update                  → Approach A + Portfolio CPT
```

### Bước 0: Cài đặt môi trường (dự án mới)

Khi nhận dự án mới từ đầu — chưa có WordPress:

```
→ references/flatsome-fresh-install.md
1. WordPress core install (VPS hoặc LocalWP)
2. Upload Flatsome .zip từ ThemeForest + nhập license key
3. Tạo flatsome-child theme
4. Cài plugins (CF7, SEO, Cache, Image optimizer)
5. Config cơ bản (permalink, timezone VN, tắt topbar/cart mặc định)
6. Verify UX Builder hoạt động
```

> **Loại site VN**: Nhà hàng, BĐS, Phòng khám, Du lịch, Giáo dục → `references/vietnam-site-types.md`

---

### Bước 4: Xác định nguồn input → chọn workflow

| Input từ user | Workflow bắt buộc |
|---|---|
| Ảnh / screenshot / mockup | Design Fidelity Workflow (§ dưới) |
| URL website mẫu | `references/url-clone-workflow.md` — fetch HTML/CSS/assets trước |
| Toàn site (nhiều trang) | `references/multipage-site-architecture.md` — lập page plan trước |

**Trước bất kỳ input nào — chạy Pre-flight:**
> `references/preflight-checklist.md` — kiểm tra WP version, child theme, permalink, plugins, upload dir. **Không code khi môi trường chưa sẵn sàng.**

---

### Bước 4b: Nếu user đưa ảnh / screenshot / mẫu thiết kế

**⚠️ BẮT BUỘC — KHÔNG code trước khi hoàn thành Design Audit:**

```
1. Chạy Section Inventory (liệt kê toàn bộ sections từ trên xuống)
2. Chạy Visual Geometry Audit: đo container, card x/y/w/h, gap, radius, tỉ lệ cột/hàng
3. Trích xuất màu sắc → tạo CSS :root variables
4. Nhận dạng font → import Google Font
5. Nhận dạng từng component pattern → map sang Flatsome shortcode
6. Tạo Code Map (blueprint trước khi viết)
7. Viết CSS token file vào style.css
8. Code từng section theo thứ tự
9. QA checklist so với ảnh gốc: geometry trước, màu/font sau
```

> **Full workflow**: `references/design-fidelity-workflow.md` — bao gồm Component Pattern Recognition, CSS Token Template, Measurement Ledger, Visual QA Checklist, và Design Audit Output Template.
> **Screenshot conversion hard rules**: `references/screenshot-to-ux-flatsome.md` — quy trình bắt buộc khi chuyển ảnh sang UX Flatsome: đo hình học, tính tỉ lệ grid, reset Flatsome row/col, và kiểm tra lỗi khoảng trắng/card lệch trước khi nhận là xong.
> **Autonomous QA loop**: `references/autonomous-visual-qa.md` — quy trình tự động từ brief/screenshot → build → deploy → screenshot/DOM/CSS QA → tự tinh chỉnh đến khi đạt ngưỡng trước khi báo user.
> **Responsive multi-breakpoint**: `references/responsive-clone-workflow.md` — audit desktop + mobile riêng, diff responsive, map span__md/span__sm rules.

Không được dựng trang "na ná" bằng Flatsome defaults. Không code khi chưa extract màu, font, spacing từ ảnh.

### Bước 5: Autonomous Build-Verify Loop

Khi user yêu cầu clone section/trang theo mẫu, không được trả kết quả ngay sau lần build đầu tiên. Phải tự chạy vòng lặp:

```
1. Build UX Builder-native shortcode + scoped CSS
2. Deploy bằng WP-CLI/SSH
3. Fetch frontend HTML/CSS/assets để kiểm tra shortcode render đúng
4. Chụp/kiểm tra frontend public bằng công cụ headless nếu khả dụng
5. So sánh với Visual Geometry Audit: card width/height, gap, font scale, image/icon scale, overlap, editability
6. Tự chỉnh và deploy lại cho đến khi đạt tối thiểu 90% hoặc gặp blocker thật
7. Chỉ gửi user khi đã qua QA gates; nếu không thể chụp screenshot, phải nói rõ đã dùng fallback DOM/CSS checks
```

Không dùng user làm vòng QA chính. User chỉ nên nhận bản đã qua kiểm tra hoặc nhận blocker cụ thể.

### Bước 6: Performance + SEO + Bàn giao

Sau khi design xong, trước khi giao khách hàng:

```
→ references/performance-seo.md
1. Optimize ảnh (resize hero, lazy load)
2. Kích hoạt cache plugin (LiteSpeed/WP Rocket)
3. Flatsome performance settings
4. Yoast SEO: meta title/description từng trang + sitemap
5. Chạy Performance QA script

→ references/client-handoff.md
6. Final QA (HTTP 200 tất cả trang, forms hoạt động)
7. Tạo tài khoản Editor cho client
8. Dọn dẹp trang test, revisions
9. Bàn giao thông tin đăng nhập + hướng dẫn sử dụng
10. Checklist ký xác nhận
```

---

## FLEXIBLE APPROACHES
- **Approach A: UX Builder Shortcodes** — Client chỉnh sửa được trong UX Builder. Best cho pages thường xuyên update.
- **Approach A+: UX Builder High-Fidelity Section** — Khi user nói "phải làm bằng UX Builder", giữ nội dung trong shortcode native (`[section]`, `[row]`, `[col]`, `[ux_text]`, `[button]`) và dùng scoped CSS + asset thật để bám mẫu cao nhất. Không chuyển sang static/PHP nếu user ưu tiên tự sửa.
- **Approach B: PHP Page Template** — Toàn quyền code. Best cho landing page pixel-perfect.
- **Approach C: WooCommerce + Hooks** — WooCommerce + Flatsome hooks + ACF. Best cho site bán hàng hoặc catalog.
- **Approach D: Hybrid / PHP Page Template with ACF/SCF** — Chuyển đổi Landing Page tĩnh (HTML/PHP) thành Page Template động tích hợp Advanced/Secure Custom Fields (ACF/SCF).

---

## WOOCOMMERCE APPROACH (Approach C)

### Khi nào dùng Approach C
Dùng khi thiết kế có **danh sách sản phẩm, trang sản phẩm chi tiết, hoặc catalog xe/nhà/thiết bị**:
- Site bán hàng online (có giỏ hàng, checkout)
- Site catalog (chỉ hiển thị sản phẩm, không thanh toán online)
- Sản phẩm có thông số kỹ thuật riêng (km, mã lực, diện tích, v.v.)

### Quy trình xây dựng
```
1. wp plugin install woocommerce --activate
2. wp plugin install advanced-custom-fields --activate (nếu cần specs)
3. wp wc tool run install_pages --user=1
4. Tạo product categories + attributes
5. Tạo ACF field group cho product specs
6. Build shop archive layout (hooks hoặc override template)
7. Build single product layout (Flatsome Product Block)
8. Tạo sample products để test
9. wp rewrite flush --hard && wp cache flush
```

---

## PROJECT SETUP WORKFLOW

### MANDATORY: Sync First Protocol
Before making any changes to an existing page or form, you MUST first fetch the current content from the database using WP-CLI to ensure you are working with the latest version.
```bash
wp post get PAGE_ID --field=post_content > current_content.txt
```

### Step 1 — Create child theme
```bash
THEMES_DIR=$(wp eval "echo get_theme_root();")
mkdir -p "$THEMES_DIR/flatsome-child"

cat > "$THEMES_DIR/flatsome-child/style.css" << 'CSS'
/*
Theme Name:   Flatsome Child
Template:     flatsome
Version:      1.0.0
*/
@import url("../flatsome/style.css");
CSS

cat > "$THEMES_DIR/flatsome-child/functions.php" << 'PHP'
<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('flatsome-parent', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), ['flatsome-parent']);
});
PHP

wp theme activate flatsome-child
```

### Step 2 — Install default plugins
```bash
wp plugin install contact-form-7 --activate
wp plugin install wpcode-lite --activate
wp plugin install classic-editor --activate
```

---

## NATIVE SHORTCODE MASTERY

Flatsome's drag-and-drop system maps precisely to its built-in shortcode elements. To ensure maximum compatibility and perfect visual rendering, master the parameters of these core elements:

### 1. Grid Elements
- **`[section]`**: Container for full width blocks.
  *Attributes:* `bg_color`, `bg` (image ID), `bg_overlay` (RGBA), `padding` (e.g. `80px 0`), `padding__sm` (mobile padding), `dark` (true/false), `class`.
- **`[row]`**: The layout row.
  *Attributes:* `style` (collapse/small/normal/large), `v_align` (top/middle/bottom/equal), `h_align` (left/center/right), `col_bg`, `depth` (shadows).
- **`[col]`**: The column spans.
  *Attributes:* `span` (1-12), `span__md`, `span__sm`, `bg_color`, `bg_radius` (border-radius), `depth` (shadow), `depth_hover`, `padding`, `margin`, `animate`.
- **`[gap]`**: Clean vertical spacing.
  *Attributes:* `height` (pixels), `height__sm`.

### 2. Content & Media Elements
- **`[ux_banner]`**: Background overlay cards, video background wrappers.
  *Attributes:* `bg`, `height`, `height__sm`, `bg_overlay`, `dark` (true/false), `video_mp4`, `video_webm`, `youtube`.
- **`[text_box]`**: Absolute-positionable layer strictly inside `[ux_banner]`.
  *Attributes:* `position_x` (0-100), `position_y` (0-100), `width` (%), `text_align`, `padding`, `bg`, `depth`, `animate`.
- **`[ux_text]`**: Visual text wrapper. Essential for paragraphs and custom headings.
  *Attributes:* `font_size`, `font_size__sm`, `text_align`, `text_color`.
- **`[ux_image]`**: High-fidelity images.
  *Attributes:* `id`, `width`, `height` (aspect crop), `bg_radius`, `lightbox` (true/false), `image_hover` (zoom/glow).
- **`[button]`**: Standard interactive links.
  *Attributes:* `text`, `style` (primary/outline/link), `color` (primary/secondary/hex), `size`, `radius` (pixels), `icon` (icon-phone/fa-class), `link`, `target`.
- **`[testimonial]`**: Elegant customer quotes.
  *Attributes:* `name`, `company`, `stars` (0-5), `image` (avatar ID), `image_width`.
- **`[accordion]` & `[accordion-item]`**: Perfect FAQS.
  *Attributes:* `auto_open`, `title`.
- **`[tabgroup]` & `[tab]`**: In-page structural navigation selectors.
  *Attributes:* `style` (line/pills), `align`, `type` (horizontal/vertical).
- **`[ux_price_table]` & `[bullet_item]`**: Native packages comparator grids.

> 💡 **For a comprehensive registry, attributes list, and styling guides, refer to:** [references/native-shortcode-catalog.md](file:///Users/hungpham/.claude/skills/flatsome-skill-v2/references/native-shortcode-catalog.md)

---

## 🎯 DESIGN PATTERN → NATIVE SOLUTION

Use this table to translate typical static designs into responsive, native Flatsome structures:

| Design Requirement | Native Shortcode Structure | Child CSS classes / Helpers |
|---|---|---|
| **Glassmorphism Header** | `[section]` with dark/light overlay | `.hm-header-glass` using backdrop-filter blur |
| **Pill Badges** | `[ux_text]` wrapping `<span class="badge">` | `.hm-badge` with rounded, padding, bg |
| **Featured Cards** | `[col bg_color="#fff" depth="1" bg_radius="12" padding="30px"]` | `.hm-feature-card:hover` with translateY lift |
| **Alternating Rows** | alternating `[row]` layouts | `order__sm="2"` and `order__sm="1"` on mobile |
| **Partners Carousel** | `[row slider="true" v_align="middle"]` + `[col]` + `[ux_image]` | `.hm-partner-col` |
| **FAQ Accordions** | `[accordion]` + `[accordion-item]` | `.hm-faq-accordion` |
| **Modal Forms** | `[button link="#popup"]` + `[lightbox id="popup"]` | `.hm-lightbox-wrap` |
| **Stats Numbers** | `[col align="center"]` + `[ux_text]` | `.hm-stat-num { font-size: 48px; font-weight:800; }` |
| **Numbered Steps** | `[col]` + `[ux_text]` with big number span | `.hm-step-number { font-size: 40px; color:#e2e8f0; }` |

---

## ⚠️ `ux_html` ABSOLUTE PROHIBITION LIST

To protect the client's editing experience, you must **NEVER** use `[ux_html]` for:
1. Standard layouts (columns, paddings, rows, margins)
2. Normal texts, paragraphs, list items, headings (`<h1>`-`<h6>`)
3. Native links, anchor buttons, CTA buttons
4. Simple image cards, galleries, logo listings
5. Client testimonials, quotes, reviews
6. Custom HTML form wrappers when Contact Form 7 can handle the inputs natively

---

## ⚠️ Flatsome DOM Facts (verified from real output)
- `[ux_banner]` renders as `<div class="banner has-hover">` — **NOT** `.ux-banner`
- `[col class="foo"]` adds `foo` to the column `<div>` → use `.foo .banner` to style banners inside
- `[icon name="..."]` inside `[text_box]` **does NOT render** — it outputs raw shortcode text
- `[ux_video url="..."]` requires a **valid, public** YouTube URL — invalid IDs show as plain text link

### Video Thumbnail Card Pattern (client-editable, no raw HTML)
```wordpress
[col span="6" span__sm="12" class="mc-vt-thumb"]
  [ux_banner bg="IMAGE_ID" height="200px" link="https://youtu.be/VIDEO_ID" bg_overlay="rgba(0,0,0,0.2)"]
  [/ux_banner]
  [ux_text text_align="left"]
    <span>Tiêu đề video</span>
  [/ux_text]
[/col]
```
CSS in child theme `style.css`:
```css
.mc-vt-thumb .banner::after,
.mc-vt-main .banner::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 62px; height: 62px;
  background: rgba(0,0,0,0.52)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpolygon points='9,6 20,12 9,18' fill='white'/%3E%3C/svg%3E")
    center/30px no-repeat;
  border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.88);
  pointer-events: none;
  z-index: 5;
}
.mc-vt-thumb .banner:hover::after { background-color: rgba(21,101,192,0.75); }
```

### Responsive attributes
- `span__sm="12"` → Full width on mobile
- `span__md="6"` → 2 columns on tablet
- `hide-for-medium` → Hide on tablet and below
- `show-for-small` → Show on mobile only
- `@media (max-width: 849px)` → Tablet breakpoint
- `@media (max-width: 549px)` → Mobile breakpoint

---

## 🎯 UX-FIDELITY PROTOCOL (QUY TRÌNH BÁM MẪU CAO TRONG UX FLATSOME)

Để chuyển đổi giao diện tĩnh hoặc thiết kế Figma/Screenshot sang UX Flatsome **bám mẫu cao nhất có thể trong giới hạn UX Builder** mà vẫn đảm bảo client tự sửa được, bắt buộc phải tuân thủ 5 trụ cột kỹ thuật sau. Nếu user yêu cầu "100% từng pixel", phải nói rõ tradeoff: PHP/static template dễ đạt pixel-perfect hơn, còn UX Builder ưu tiên editability; khi user nói "phải làm bằng UX Builder" thì tiếp tục làm bằng UX Builder.

### Hard Rule: User bắt buộc UX Builder
- Không chuyển sang PHP/static template khi user đã nói "phải làm bằng UX Builder".
- Giữ content có thể sửa trong UX Builder bằng shortcode native; tránh `[ux_html]` cho nội dung chính.
- Decorative shapes, notches, gradients, icons, background patterns được phép nằm trong CSS/pseudo-elements hoặc asset SVG.
- Với trang chỉ có một section, đặt template `page-blank-landingpage.php` để bỏ header/footer/widgets.
- CSS section riêng phải enqueue qua `functions.php` bằng `filemtime()` và scope theo page slug, ví dụ `assets/css/{slug}.css`.
- Luôn QA cả public frontend và màn hình UX Builder preview; layout có thể đúng frontend nhưng vỡ trong builder.
- Không dùng padding phần trăm quá lớn để giả lập Elementor nếu nó làm cột bị nhảy; inspect DOM thực tế của `.section`, `.row`, `.col`, `.col-inner` rồi sửa theo flow của Flatsome.

### Fidelity Decision Gate: PHP giống mẫu nhưng UX Builder kém hơn
- Không hứa "100%" khi output bắt buộc là UX Builder-native. Ghi rõ ngay từ đầu: PHP/template có thể pixel-perfect hơn; UX Builder ưu tiên editability và thường cần tradeoff.
- Nếu đã có bản PHP/static đạt mẫu, không "convert thẳng" bằng cách bê bố cục pixel-perfect sang `[row]/[col]`. Phải audit lại layout dưới ràng buộc DOM của Flatsome.
- Với hero/header phức tạp, chọn một trong ba mức:
  1. **Native editable**: logo/text/button riêng, ảnh/phần decor có thể sai lệch 5-15%.
  2. **Hybrid editable**: content shortcode native, geometry chính do CSS grid/flex scoped kiểm soát.
  3. **Pixel-perfect**: PHP/static hoặc một ảnh composite; ít/không editable.
- Nếu user vừa nói "giống 100%" vừa nói "UX Builder", phải hỏi/chốt tradeoff hoặc mặc định ưu tiên UX Builder và báo không thể cam kết từng pixel.

### Header/Hero Layout Contract Trong UX Builder
- Header dùng trong page content không giống Flatsome real Header Builder. Nếu clone header mẫu trong page, phải khóa layout bằng CSS contract rõ ràng: `display:grid|flex`, fixed/minmax tracks, `min-width:0`, `white-space:nowrap`, fixed CTA width/height, reset `.row > .col`.
- Không dựa vào `span="3/6/3"` cho header pixel-sensitive. `span` chỉ giúp UX Builder tree; CSS scoped phải sở hữu geometry thực tế.
- Luôn test trạng thái có admin bar/logged-in nếu user đang xem bằng tài khoản admin, vì chiều cao viewport và thanh WP admin có thể làm lỗi hiển thị khác headless logged-out.
- Sau mỗi sửa CSS, bust cache bằng `filemtime()` hoặc bump child-theme version và verify URL CSS thực tế trong HTML.

### Trụ cột 1: Đồng bộ hóa Typography & Fonts Face
- **Quy tắc**: Bắt buộc tìm và import chính xác Google Fonts của mẫu gốc vào child theme thông qua `style.css` (dùng `@import`) hoặc `functions.php`.
- Tạo class tùy biến cho từng loại tiêu đề và văn bản (ví dụ: `.hm-hero-title`, `.hm-section-desc`) thay vì dùng thuộc tính mặc định của Flatsome. Bọc text trong `[ux_text]` và gán class này.

### Trụ cột 2: Phá vỡ giới hạn Grid & Container mặc định
- **Container linh hoạt**: Khi mẫu gốc có độ rộng khác nhau (ví dụ: Hero cần 1320px, Services cần 1200px), hãy dùng class tùy biến để ghi đè max-width của `[row]`:
  ```css
  .hm-container-1320 > .row { max-width: 1320px !important; }
  .hm-container-1200 > .row { max-width: 1200px !important; }
  ```
- **Custom Gutters (Khoảng cách cột)**: Không dùng khoảng cách mặc định nếu mẫu gốc yêu cầu khoảng cách chính xác. Hãy đặt `col-spacing="collapse"` trên `[row]` và tùy biến trong CSS.

### Trụ cột 3: Chồng lớp bố cục & Định vị tuyệt đối (Layered & Absolute Elements)
- Đặt class `class="hm-relative-sec"` trên `[section]`. Sau đó dùng pseudo-elements (`::before`, `::after`) trong CSS để chèn hình ảnh trang trí nền tuyệt đối mà không chèn HTML rác làm vỡ giao diện.

### Trụ cột 4: Nâng cấp linh hồn Giao diện (Buttons & Premium Cards)
- **Custom Buttons**: Thêm `class="hm-btn-premium"` vào `[button]` và thiết kế shadow, gradient border, hover lift mượt mà.
- **Premium Glassmorphism Cards**: Tạo hiệu ứng thẻ sang trọng bằng cách chèn class `.hm-card-glass` cho `[col]`.

### Trụ cột 5: Trích xuất Tài nguyên Thực tế (Không sử dụng Placeholder)
- Mọi hình ảnh logo đối tác, background pattern, icon SVG nhỏ đều phải được trích xuất trực tiếp từ file mẫu gốc và import vào WordPress Media Library.
- Nếu mẫu dùng SVG trang trí thật, tải đúng SVG đó thay vì dựng CSS shape gần giống. Ví dụ: section decor, angle/notch SVG, checklist icon SVG.

> **UX Builder case guide**: `references/ux-builder-high-fidelity-sections.md` — quy trình dựng section bám mẫu bằng shortcode native, scoped CSS, asset thật, cache bust, và QA trong UX Builder.

---

## Step-by-Step Execution Workflow

### Step 1 — Analyze the HTML/Design Structure
- Identify every content section and map it to standard Flatsome structures.
- Extract typography, border radius, colors, and spatial measurements.

### Step 2 — CSS Child Theme Integration
- Migrate variables and key tokens into the child theme's `style.css`.
- Add responsive overrides using Flatsome breakpoints.

### Step 3 — UX Builder Shortcodes Assembly
- Assemble the shortcode page tree recursively. Avoid any code tags around editable values.
- Verify elements support drag-and-drop.

### Step 4 — functions.php Enhancements
- Enqueue fonts, FontAwesome icons, and scripts with cache-busting time hooks.

### Step 5 — Verification & Visual QA
- Audit against tablet (849px) and mobile (549px) views.
- Test block visual tree drag-and-drop support inside UX Builder.
- If geometry is visibly wrong (large blank gap, card off-screen, wrong width ratio), stop and fix the current section before adding any new section.

---

## CONTINUOUS SKILL UPDATE PROTOCOL

When a user says a design result is acceptable or asks to "update skill", update the skill only with reusable knowledge that improves future Flatsome work across many websites.

### What to capture
- General UX Builder patterns: shortcode structure, editable content boundaries, section architecture.
- General CSS strategies: scoped CSS, cache busting, responsive rules, asset handling, builder-safe selectors.
- General component patterns: hero, bento section, contact section, CTA, card grid, checklist, form card, header/footer treatment.
- General debugging lessons: cache, template choice, shortcode nesting, CSS specificity, frontend-vs-builder differences.
- General deployment workflow: WP-CLI commands, page template meta, Contact Form 7 setup, enqueue patterns.

### What not to capture
- Site-specific names, domains, IPs, credentials, client copy, private assets, page IDs, or one-off content.
- Exact project URLs unless they are public sample references used as design sources.
- Temporary filenames or throwaway scripts unless they represent a reusable pattern.

### How to update
1. Add the smallest useful rule to `SKILL.md` when it affects decision-making every time.
2. Add detailed reusable patterns to a `references/*.md` file.
3. Prefer generic names like `{slug}`, `{page_id}`, `{section_class}` instead of real project names.
4. If a specific project taught the lesson, summarize it as a pattern, not a case tied to one website.
5. Keep examples concise and editable-first: native Flatsome shortcodes for content, CSS/assets for decoration.

> **Reusable lessons guide**: `references/reusable-design-lessons.md` — checklist for deciding what should be promoted into the skill after each completed design.

---

## DEBUGGING / FAILURE MODES

### Debugging with WP-CLI
```bash
# Check page content if layout is broken
wp post get PAGE_ID --field=post_content | head -100

# Toggle WP_DEBUG and Flush Cache
wp eval "echo WP_DEBUG ? 'ON' : 'OFF';"
wp rewrite flush
```

| Symptom | Cause | Fix |
|---------|-------|-----|
| White screen | Unclosed shortcode tag | Check `[/section]`, `[/row]`, `[/col]` tags |
| Shortcode shown as text / White page | Plugin not active | Run `wp plugin activate flatsome` |
| CSS not applying | Child theme not active or low specificity | Run `wp theme activate flatsome-child` or increase CSS specificity |
| Nested layout broken | `[row]`/`[col]` nested inside `[col]` | **Never nest row/col inside another col — use row_inner/col_inner** |
| Section `id` attribute ignored | Flatsome overrides with random ID | Place a `[scroll_to title="id-name"]` at top of section |
| CSS cached after update | Static `?ver=3.0` query string | Add `filemtime()` cache bust inside `functions.php` |
| Frontend đúng nhưng UX Builder vỡ | CSS chỉ tính cho public DOM hoặc dùng offset/padding quá tay | QA trong `app=uxbuilder`, sửa theo DOM builder, giữ col flow ổn định |
| Footer/widgets xuất hiện trên trang chỉ test section | Page template mặc định | Set `_wp_page_template` = `page-blank-landingpage.php` |
| User yêu cầu 100% pixel nhưng phải chỉnh bằng UX Builder | Pixel-perfect static và UX editability xung đột | Giải thích tradeoff, vẫn làm Approach A+ nếu user bắt buộc UX Builder |
| Card/grid lệch xa, xuất hiện khoảng trắng lớn | Đoán tỉ lệ cột hoặc chưa reset Flatsome `.row/.col` | Làm lại Visual Geometry Audit, dùng tỉ lệ đo từ ảnh, reset `width/max-width/min-width/flex/margin/padding` scoped |
| Header UX Builder chồng logo/nav hoặc CTA bị cắt | Dựa vào `span` mặc định, CTA thiếu fixed width, chưa test viewport có admin bar | Dùng CSS grid/flex contract scoped cho header, reset direct `.col`, khóa CTA `white-space:nowrap`, QA logged-in và logged-out |
| Bản PHP giống nhưng bản UX Builder lệch nhiều | Convert máy móc từ template pixel-perfect sang shortcode mà chưa chọn fidelity tier | Quay lại Fidelity Decision Gate, chọn Native/Hybrid/Pixel-perfect trước khi code |
| Tab inactive panels create gaps | `min-height` overrides hidden state | `.panel:not(.active) { height: 0 !important; }` |

---

## REFERENCES & ESCALATION

This skill includes the following reference documents:

| Document | Description |
|----------|-------------|
| `references/native-shortcode-catalog.md` | **Native Shortcode Catalog** — Comprehensive list of all Flatsome elements, visual attributes, responsive behaviors, examples, and gotchas. |
| `references/ux-builder-patterns.md` | **UX Builder Patterns** — Common web design layout patterns comparing BAD raw HTML vs GOOD 100% native shortcode structures. |
| `references/flatsome-official-docs.md` | **Complete official docs reference** — 67 actions + 67 filters, hooks, Customizer, and performance guidelines. |
| `references/design-fidelity-workflow.md` | **Design Fidelity Workflow** ★ CORE — Quy trình bắt buộc khi chuyển mẫu/screenshot sang Flatsome: Section Inventory, Color Extraction, Font Recognition, Spacing Estimation, Component Pattern Recognition (15+ patterns), Flatsome Shortcode Mapping, CSS Token Template, Header/Footer Fidelity, Visual QA Checklist, Design Audit Output Template |
| `references/screenshot-to-ux-flatsome.md` | **Screenshot to UX Flatsome Hard Rules** — Quy trình đo layout từ ảnh trước khi code, tính tỉ lệ grid/card, reset Flatsome row/col, và gates kiểm tra lỗi visual. |
| `references/ux-builder-high-fidelity-sections.md` | **UX Builder High-Fidelity Sections** — Khi user bắt buộc dùng UX Builder: shortcode architecture, page-specific CSS enqueue, asset extraction, bento/checklist section patterns, frontend + builder QA. |
| `references/reusable-design-lessons.md` | **Reusable Design Lessons** — Quy tắc lọc và tổng quát hóa kiến thức mới sau mỗi task thiết kế để dùng chung cho các website khác. |
| `references/static-html-to-acf-template.md` | **Static HTML to ACF/SCF Template** — PHP-based workflows to map custom static landing pages into ACF/SCF blocks. |
| `references/url-clone-workflow.md` | **URL Clone Workflow** ★ — Khi user gửi link website mẫu: fetch HTML/CSS, extract design tokens từ source CSS thật, download assets, phân tích breakpoints, header/footer từ DOM thật. |
| `references/preflight-checklist.md` | **Pre-Flight Checklist** ★ — Kiểm tra môi trường WP trước khi code: version, child theme, permalink, plugins, upload dir, UX Blocks post type. Fix script cho mọi vấn đề thường gặp. |
| `references/responsive-clone-workflow.md` | **Responsive Clone Workflow** — Audit đa breakpoint: diff desktop vs mobile ảnh, map sang span__md/span__sm, CSS responsive template, image aspect ratio, slider columns, clamp() typography, QA checklist 3 breakpoints. |
| `references/header-advanced-patterns.md` | **Header Advanced Patterns** — Transparent sticky header, 2 logo (color/white), CTA button hook, topbar setup, mega menu CSS, mobile menu custom, search overlay, common header failures. |
| `references/animation-scroll-effects.md` | **Animation & Scroll Effects** — Flatsome native animate attr, CSS-only animations, AOS setup, Intersection Observer reveal, counter animation (WPCode), parallax, progress bars, floating CTA, performance rules. |
| `references/multipage-site-architecture.md` | **Multi-Page Site Architecture** — Site plan template, tạo toàn bộ pages + menu qua WP-CLI, Global Sections (header/footer/shared CTA), page-specific CSS enqueue, build order, multi-page QA script. |
| `references/flatsome-fresh-install.md` | **Flatsome Fresh Install** ★ — Quy trình từ đầu: WordPress install, upload Flatsome .zip từ ThemeForest, nhập license key, tạo child theme chuẩn, cài plugins, config cơ bản (timezone, logo, permalink), verify UX Builder. |
| `references/vietnam-site-types.md` | **Vietnam Site Types** ★ — Workflow cho 6 loại site phổ biến VN: Nhà hàng/F&B (menu tab, form đặt bàn, giờ mở cửa), Bất động sản (CPT, ACF specs, filter), Y tế/Spa (form đặt lịch, before-after), Du lịch/Tour (tour card, booking), Giáo dục (khóa học CPT, accordion lịch học), Sản xuất/B2B (WooCommerce catalog mode). Tích hợp Zalo, Google Maps VN, hotline nổi. |
| `references/client-handoff.md` | **Client Handoff** ★ — Final QA script, đổi mật khẩu admin, tạo tài khoản client (Editor vs Admin), enable UX Builder cho Editor, dọn dẹp trước bàn giao, hướng dẫn client tự sửa nội dung, template bàn giao thông tin, checklist ký tên, cron backup sau bàn giao. |
| `references/performance-seo.md` | **Performance & SEO** ★ — Image optimization (resize, WebP), LiteSpeed Cache setup, WP Rocket, Flatsome performance settings, tắt emoji/heartbeat, font loading (preconnect + display=swap), Yoast SEO setup, meta title/description batch set, sitemap + Google Search Console, performance QA script trước bàn giao. |
| `references/deployment-localwp-vs-vps.md` | LocalWP vs VPS setup, staging synchronization, and deployment shell automation. |
