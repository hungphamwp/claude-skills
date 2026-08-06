# Global Sections, Header/Footer & Advanced UI Patterns

> Covers: Global Sections (ux_block), Header/Footer customization, Mega Menu,
> Lightbox/Popup, Announcement Bar, Pricing Table, FAQ Accordion, Flatsome Customizer
> Phiên bản: Flatsome 3.15+

---

## Table of Contents

1. [Global Sections (ux_block)](#1-global-sections-ux_block)
2. [Header Customization](#2-header-customization)
3. [Footer Customization](#3-footer-customization)
4. [Mega Menu](#4-mega-menu)
5. [Announcement Bar](#5-announcement-bar)
6. [Lightbox / Popup Patterns](#6-lightbox--popup-patterns)
7. [Pricing Table](#7-pricing-table)
8. [FAQ / Accordion](#8-faq--accordion)
9. [Flatsome Customizer Quick Reference](#9-flatsome-customizer-quick-reference)
10. [Info/Benefits Bar](#10-infobenefits-bar)

---

## 1. Global Sections (ux_block)

### Khái niệm

**Global Section** (Flatsome gọi là `Blocks`) là một `ux_block` CPT — có thể build bằng UX Builder và nhúng vào bất kỳ đâu bằng shortcode `[block id="ID"]`. Dùng để:

- Tạo section dùng chung nhiều trang (CTA, testimonials, partners)
- Custom header content (logo, nav, CTA button)
- Custom mega menu content
- Announcement bar
- Footer nội dung

### Tạo Global Section via WP-CLI

```bash
# Tạo global section (shortcode content bên dưới)
BLOCK_ID=$(wp post create \
  --post_type=ux_block \
  --post_title="CTA Section - Liên hệ tư vấn" \
  --post_status=publish \
  --post_content='[section bg_color="#1e3a5f" dark="true" padding="60px 0"][row h_align="center"][col span="8" span__sm="12" align="center"][ux_text]<h2>Bắt đầu dự án của bạn ngay hôm nay</h2>[/ux_text][ux_text]<p>Liên hệ với chúng tôi để được tư vấn miễn phí</p>[/ux_text][gap height="24px"][button text="Liên hệ ngay" link="/lien-he" color="primary" size="large"][/col][/row][/section]' \
  --porcelain)
echo "Block ID: $BLOCK_ID"
```

### Dùng Global Section trong trang

```
[block id="BLOCK_ID"]
```

### List tất cả blocks hiện có

```bash
wp post list --post_type=ux_block --fields=ID,post_title,post_status
```

### Global Section cho các use case phổ biến

```bash
# 1. CTA section dùng cuối mỗi trang dịch vụ
wp post create --post_type=ux_block --post_title="CTA - Cuối trang" --post_status=publish

# 2. Partners/Logo section
wp post create --post_type=ux_block --post_title="Partners Logo" --post_status=publish

# 3. Testimonials section
wp post create --post_type=ux_block --post_title="Testimonials" --post_status=publish

# 4. Announcement bar
wp post create --post_type=ux_block --post_title="Announcement Bar" --post_status=publish
```

---

## 2. Header Customization

### Flatsome Header Styles

Flatsome có 4 header style (chọn trong Customizer > Header > Style):

| Style | Mô tả | Dùng khi |
|---|---|---|
| Header 1 | Logo trái, nav phải | Site chuẩn, phổ biến nhất |
| Header 2 | Logo giữa, nav 2 bên | Luxury, fashion |
| Header 3 | Logo trái, nav giữa | Agency, portfolio |
| Header 4 | Full-width nav bar | E-commerce lớn |

```bash
# Set header style via WP-CLI
wp option update flatsome_header_style "1"  # 1, 2, 3, hoặc 4
```

### Thêm nút CTA vào header (không qua Global Section)

Cách đơn giản nhất — thêm button qua CSS + hook:

```php
// Trong child theme functions.php
add_action('flatsome_header_top', function() {
    ?>
    <a href="/lien-he" class="co-header-cta button primary small">
        Liên hệ ngay
    </a>
    <?php
}, 20);
```

```css
/* style.css */
.co-header-cta {
    margin-left: 16px;
    white-space: nowrap;
    font-size: 13px !important;
    padding: 8px 18px !important;
}
@media (max-width: 549px) { .co-header-cta { display: none; } }
```

### Header transparent + dark text khi scroll

```php
add_action('wp_head', function() {
    if (!is_front_page()) return;
    ?>
    <style>
    /* Transparent header chỉ trên trang chủ */
    .is-front-page .header-main { background: transparent !important; }
    .is-front-page .header-main .nav-dark .nav > li > a { color: #fff !important; }
    .is-front-page .header-main.stuck { background: #fff !important; }
    .is-front-page .header-main.stuck .nav > li > a { color: #1f2937 !important; }
    </style>
    <?php
});
```

### Custom logo per page

```php
add_filter('get_custom_logo', function($html) {
    // Logo dark cho trang thường, logo light khi transparent
    if (is_front_page()) {
        return str_replace('custom-logo', 'custom-logo logo-light', $html);
    }
    return $html;
});
```

### Header hooks (vị trí inject)

```
flatsome_before_header          → Trước header wrapper
flatsome_header_top             → Trong header top bar (bên phải nav)
flatsome_after_header           → Sau header, trước content
flatsome_after_header_bottom    → Sau bottom header row
```

---

## 3. Footer Customization

### Flatsome Footer Widget Areas

Flatsome có 4 widget areas cho footer + 1 footer bar:

```
Footer 1 — Cột 1 (sidebar-footer-1)
Footer 2 — Cột 2 (sidebar-footer-2)  
Footer 3 — Cột 3 (sidebar-footer-3)
Footer 4 — Cột 4 (sidebar-footer-4)
Footer Bar — Thanh footer dưới cùng (copyright, links)
```

```bash
# Thêm content vào footer via widget
wp widget add text sidebar-footer-1 \
  --title="Về chúng tôi" \
  --text="Mô tả ngắn về công ty, sứ mệnh, giá trị cốt lõi..."

wp widget add nav_menu sidebar-footer-2 \
  --title="Dịch vụ" \
  --nav_menu="$(wp menu list --field=term_id | head -1)"

wp widget add text sidebar-footer-3 \
  --title="Liên hệ" \
  --text="<p>📍 123 Đường ABC, Quận 1</p><p>📞 090 123 4567</p><p>✉️ info@company.com</p>"

wp widget add text sidebar-footer-4 \
  --title="Giờ làm việc" \
  --text="<p>Thứ 2 – Thứ 6: 8:00 – 17:30</p><p>Thứ 7: 8:00 – 12:00</p>"
```

### Custom Footer via Global Section

Flatsome cho phép dùng UX Builder block thay toàn bộ footer:

```bash
FOOTER_ID=$(wp post create \
  --post_type=ux_block \
  --post_title="Custom Footer" \
  --post_status=publish \
  --post_content='FOOTER_SHORTCODE_HERE' \
  --porcelain)

# Gán làm footer block
wp option update flatsome_footer_block $FOOTER_ID
```

### Footer shortcode mẫu

```
[section bg_color="#111827" dark="true" padding="60px 0 40px"]
  [row]
    [col span="4" span__sm="12"]
      [ux_image id="LOGO_ID" width="160"]
      [gap height="16px"]
      [ux_text]<p style="color:#9ca3af;font-size:14px;">Mô tả ngắn về công ty...</p>[/ux_text]
      [follow facebook="https://fb.com/page" youtube="https://youtube.com/c/" zalo="https://zalo.me/"]
    [/col]
    [col span="2" span__sm="6"]
      [ux_text]<h4 style="color:#fff;margin-bottom:16px;">Dịch vụ</h4>[/ux_text]
      [ux_menu id="SERVICES_MENU_ID" style="text" font_size="14px" color="rgba(255,255,255,0.7)"]
    [/col]
    [col span="2" span__sm="6"]
      [ux_text]<h4 style="color:#fff;margin-bottom:16px;">Công ty</h4>[/ux_text]
      [ux_menu id="COMPANY_MENU_ID" style="text" font_size="14px" color="rgba(255,255,255,0.7)"]
    [/col]
    [col span="4" span__sm="12"]
      [ux_text]<h4 style="color:#fff;margin-bottom:16px;">Liên hệ</h4>[/ux_text]
      [ux_text]
        <div style="color:rgba(255,255,255,0.7);font-size:14px;line-height:2;">
          <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
          <p>📞 <a href="tel:0901234567" style="color:inherit;">090 123 4567</a></p>
          <p>✉️ <a href="mailto:info@co.vn" style="color:inherit;">info@co.vn</a></p>
        </div>
      [/ux_text]
    [/col]
  [/row]
  [divider align="center" color="rgba(255,255,255,0.1)" margin="40px 0 20px"]
  [row]
    [col span="6" span__sm="12"]
      [ux_text]<p style="color:#6b7280;font-size:13px;">© 2026 Tên công ty. All rights reserved.</p>[/ux_text]
    [/col]
    [col span="6" span__sm="12" align="right" align__sm="left"]
      [ux_text]<p style="color:#6b7280;font-size:13px;"><a href="/chinh-sach-bao-mat" style="color:inherit;">Chính sách bảo mật</a> · <a href="/dieu-khoan-su-dung" style="color:inherit;">Điều khoản</a></p>[/ux_text]
    [/col]
  [/row]
[/section]
```

---

## 4. Mega Menu

### Tạo Mega Menu trong Flatsome

**Bước 1 — Tạo Global Section làm nội dung mega menu:**

```bash
MEGA_ID=$(wp post create \
  --post_type=ux_block \
  --post_title="Mega Menu - Dịch vụ" \
  --post_status=publish \
  --post_content='[row][col span="3"][ux_text]<h4>Thiết kế</h4>[/ux_text][ux_menu id="DESIGN_MENU_ID"][/col][col span="3"][ux_text]<h4>Marketing</h4>[/ux_text][ux_menu id="MARKETING_MENU_ID"][/col][col span="3"][ux_text]<h4>Phát triển</h4>[/ux_text][ux_menu id="DEV_MENU_ID"][/col][col span="3"][ux_banner bg="PROMO_ID" height="200px" link="/khuyen-mai"][/col][/row]' \
  --porcelain)
echo "Mega Menu Block ID: $MEGA_ID"
```

**Bước 2 — Gán block vào menu item:**

```bash
# Lấy ID của menu item "Dịch vụ"
MENU_ITEM_ID=$(wp menu item list MENU_ID --fields=ID,title | grep "Dịch vụ" | awk '{print $1}')

# Thêm CSS class "flatsome-menu-item-block" để trigger mega menu
wp menu item update $MENU_ITEM_ID --classes="flatsome-menu-item-block"

# Thêm Description chứa block ID
wp post meta update $(wp eval "echo get_post_meta({$MENU_ITEM_ID}, '_menu_item_object_id', true);") \
  _menu_item_description $MEGA_ID
```

**Hoặc làm trong WP Admin:** Menu > Dịch vụ > CSS Classes = `flatsome-menu-item-block` + Description = Block ID.

### CSS cho Mega Menu

```css
/* Mega menu full width */
.flatsome-menu-item-block .sub-menu { 
    width: 100vw !important; 
    left: 50% !important;
    transform: translateX(-50%) !important;
    padding: 30px !important;
}
```

---

## 5. Announcement Bar

### Phương án A — Hook (tĩnh)

```php
// Trong child theme functions.php
add_action('flatsome_after_body_open', function() {
    ?>
    <div class="co-announcement-bar">
        <p>🎉 Khuyến mãi tháng 6: Giảm 20% tất cả dịch vụ. 
        <a href="/khuyen-mai">Xem ngay →</a></p>
        <button class="co-announce-close" onclick="this.parentElement.style.display='none'">✕</button>
    </div>
    <?php
}, 5);
```

```css
/* style.css */
.co-announcement-bar {
    background: #1d4ed8; color: #fff;
    text-align: center; padding: 10px 40px;
    font-size: 14px; position: relative;
    z-index: 9999;
}
.co-announcement-bar a { color: #fde68a; font-weight: 600; text-decoration: none; }
.co-announcement-bar a:hover { text-decoration: underline; }
.co-announce-close {
    position: absolute; right: 16px; top: 50%;
    transform: translateY(-50%); background: none;
    border: none; color: #fff; cursor: pointer;
    font-size: 16px; padding: 4px 8px;
}
```

### Phương án B — Global Section (có thể chỉnh trong UX Builder)

```bash
ANNOUNCE_ID=$(wp post create \
  --post_type=ux_block \
  --post_title="Announcement Bar" \
  --post_status=publish \
  --post_content='[section bg_color="#1d4ed8" dark="true" padding="10px 0"][row h_align="center"][col span="12" align="center"][ux_text]<p style="margin:0;font-size:14px;">🎉 Ưu đãi tháng 6: Giảm 20% dịch vụ thiết kế. <a href="/khuyen-mai" style="color:#fde68a;font-weight:700;">Xem ngay →</a></p>[/ux_text][/col][/row][/section]' \
  --porcelain)
```

```php
add_action('flatsome_after_body_open', function() {
    $block_id = get_option('co_announcement_block_id');
    if ($block_id) echo do_shortcode("[block id=\"{$block_id}\"]");
}, 5);

// Lưu block ID vào options
wp eval "update_option('co_announcement_block_id', BLOCK_ID);"
```

---

## 6. Lightbox / Popup Patterns

### Pattern 1 — Popup form khi click button (phổ biến nhất)

```
[lightbox id="contact-popup" width="600px" padding="30px"]
  [ux_text]<h3 style="margin-bottom:20px;">Liên hệ tư vấn</h3>[/ux_text]
  [contact-form-7 id="CF7_FORM_ID" title="Popup Contact"]
[/lightbox]

[button text="Liên hệ ngay" link="#contact-popup" color="primary" size="large"]
```

**Quy tắc quan trọng:**
- `id` trong `[lightbox]` phải trùng với `link="#id"` trong button
- `id` KHÔNG có dấu `#` trong `[lightbox]`, CÓ dấu `#` trong `[button link]`

### Pattern 2 — Auto-popup khi load trang (exit intent / delay)

```php
// Trong child theme functions.php — popup sau 3 giây
add_action('wp_footer', function() {
    if (!is_front_page()) return; // Chỉ trang chủ
    ?>
    <div id="auto-popup" style="display:none;">
        <?php echo do_shortcode('[contact-form-7 id="FORM_ID" title="Newsletter"]'); ?>
    </div>
    <script>
    setTimeout(function(){
        if (localStorage.getItem('popup_shown')) return;
        // Trigger Flatsome lightbox
        if (typeof $.magnificPopup !== 'undefined') {
            $.magnificPopup.open({
                items: { src: '#auto-popup', type: 'inline' },
                callbacks: {
                    close: function(){ localStorage.setItem('popup_shown', '1'); }
                }
            });
        }
    }, 3000);
    </script>
    <?php
});
```

### Pattern 3 — Popup video YouTube

```
[button text="Xem video giới thiệu" link="https://www.youtube.com/watch?v=VIDEO_ID" class="lightbox-video" color="white" style="outline"]
```

```js
// Trong wp_footer — kích hoạt lightbox cho video
jQuery('[class*="lightbox-video"]').magnificPopup({type:'iframe'});
```

### Pattern 4 — Popup "Đặt cọc / Lái thử" từ nhiều nơi

```php
// Global popup — dùng được từ bất kỳ trang nào
add_action('wp_footer', function() {
    ?>
    <div id="dat-coc-popup" class="white-popup" style="display:none;max-width:550px;padding:30px;">
        <h3>Đăng ký đặt cọc</h3>
        <?php echo do_shortcode('[contact-form-7 id="DAT_COC_FORM_ID" title="Đặt cọc"]'); ?>
    </div>
    <?php
});

add_action('wp_enqueue_scripts', function() {
    // Flatsome đã include Magnific Popup — chỉ cần init
    wp_add_inline_script('flatsome-js', '
        jQuery(function($){
            $("[data-popup=\'dat-coc\']").magnificPopup({
                type: "inline",
                midClick: true
            });
        });
    ');
});
```

```html
<!-- Dùng ở bất kỳ đâu — button, link, hoặc [ux_html] -->
<a href="#dat-coc-popup" data-popup="dat-coc" class="button primary">Đặt cọc ngay</a>
```

### Pattern 5 — Lightbox image gallery

```
[ux_gallery style="lightbox" columns="3" columns__sm="2" ids="ID1,ID2,ID3,ID4,ID5,ID6"]
```

---

## 7. Pricing Table

### `[ux_price_table]` — Đầy đủ attributes

```
[ux_price_table 
  style="1"              // 1 (card) hoặc 2 (flat)
  title="Tên gói"
  price="5.000.000"
  price_freq="/tháng"    // Đơn vị giá
  color="primary"        // primary, secondary, hoặc hex
  featured="true"        // Gói nổi bật (border highlight)
  ribbon="Phổ biến"      // Text nhãn góc trên
]
  [bullet_item]Tính năng 1[/bullet_item]
  [bullet_item]Tính năng 2[/bullet_item]
  [bullet_item icon="times"]Tính năng không có[/bullet_item]
  [bullet_item icon="check" color="#22c55e"]Tính năng đặc biệt[/bullet_item]
  [button text="Chọn gói" link="/lien-he" expand="true"]
[/ux_price_table]
```

### Layout 3 gói tiêu chuẩn

```
[section padding="70px 0"]
  [row h_align="center"]
    [col span="10" align="center"]
      [ux_text]<h2>Bảng giá</h2>[/ux_text]
    [/col]
  [/row]
  [gap height="40px"]
  [row]
    [col span="4" span__md="12" span__sm="12"]
      [ux_price_table style="1" title="Cơ bản" price="3.000.000" price_freq="/dự án" color="#64748b"]
        [bullet_item]Landing page 1 trang[/bullet_item]
        [bullet_item]Responsive mobile[/bullet_item]
        [bullet_item]Bàn giao trong 3 ngày[/bullet_item]
        [bullet_item icon="times"]Chỉnh sửa sau bàn giao[/bullet_item]
        [button text="Chọn gói này" link="/lien-he?goi=co-ban" style="outline" expand="true"]
      [/ux_price_table]
    [/col]
    [col span="4" span__md="12" span__sm="12"]
      [ux_price_table style="1" title="Chuyên nghiệp" price="8.000.000" price_freq="/dự án" color="primary" featured="true" ribbon="Bán chạy nhất"]
        [bullet_item]Đến 10 trang[/bullet_item]
        [bullet_item]Responsive mobile[/bullet_item]
        [bullet_item]Bàn giao trong 7 ngày[/bullet_item]
        [bullet_item]3 lần chỉnh sửa miễn phí[/bullet_item]
        [button text="Chọn gói này" link="/lien-he?goi=chuyen-nghiep" expand="true"]
      [/ux_price_table]
    [/col]
    [col span="4" span__md="12" span__sm="12"]
      [ux_price_table style="1" title="Doanh nghiệp" price="Liên hệ" color="#1e3a5f"]
        [bullet_item]Không giới hạn trang[/bullet_item]
        [bullet_item]Thiết kế theo yêu cầu[/bullet_item]
        [bullet_item]Bàn giao theo lịch đặt[/bullet_item]
        [bullet_item]Chỉnh sửa không giới hạn[/bullet_item]
        [button text="Liên hệ tư vấn" link="/lien-he?goi=doanh-nghiep" style="outline" expand="true"]
      [/ux_price_table]
    [/col]
  [/row]
[/section]
```

---

## 8. FAQ / Accordion

### Flatsome không có shortcode accordion native — 3 cách xử lý

#### Cách 1 — Dùng `[ux_tabs]` làm accordion (đơn giản nhất)

```
[ux_tabs style="tabs" direction="vertical"]
  [ux_tab title="Câu hỏi 1: Thời gian làm website bao lâu?"]
    Trả lời câu hỏi 1...
  [/ux_tab]
  [ux_tab title="Câu hỏi 2: Giá thiết kế website bao nhiêu?"]
    Trả lời câu hỏi 2...
  [/ux_tab]
  [ux_tab title="Câu hỏi 3: Có hỗ trợ sau bàn giao không?"]
    Trả lời câu hỏi 3...
  [/ux_tab]
[/ux_tabs]
```

#### Cách 2 — Custom shortcode accordion (CSS-only, no JS)

```php
// Trong child theme functions.php
add_shortcode('faq', function($atts, $content) {
    $a = shortcode_atts(['title' => ''], $atts);
    $id = 'faq-' . md5($a['title']);
    return "
    <div class='co-faq-item'>
      <label for='{$id}' class='co-faq-question'>
        {$a['title']}
        <span class='co-faq-icon'>+</span>
      </label>
      <input type='checkbox' id='{$id}' class='co-faq-toggle'>
      <div class='co-faq-answer'>" . do_shortcode($content) . "</div>
    </div>";
});

add_shortcode('faq_group', function($atts, $content) {
    return "<div class='co-faq-group'>" . do_shortcode($content) . "</div>";
});
```

```css
/* style.css */
.co-faq-group { max-width: 800px; margin: 0 auto; }
.co-faq-item {
    border: 1px solid #e5e7eb; border-radius: 8px;
    margin-bottom: 8px; overflow: hidden;
}
.co-faq-toggle { display: none; }
.co-faq-question {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 20px; cursor: pointer; font-weight: 600;
    font-size: 15px; color: #111827; background: #fff;
    transition: background 0.2s;
}
.co-faq-question:hover { background: #f9fafb; }
.co-faq-icon { font-size: 20px; color: #1d4ed8; transition: transform 0.3s; }
.co-faq-toggle:checked ~ .co-faq-question .co-faq-icon { transform: rotate(45deg); }
.co-faq-answer {
    max-height: 0; overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 20px; font-size: 14px; color: #4b5563; line-height: 1.7;
}
.co-faq-toggle:checked ~ .co-faq-answer {
    max-height: 500px; padding: 16px 20px;
}
```

Dùng trong UX Builder:
```
[faq_group]
  [faq title="Thời gian làm website bao lâu?"]Thường từ 7-14 ngày tùy độ phức tạp...[/faq]
  [faq title="Giá thiết kế website bao nhiêu?"]Từ 3-20 triệu tùy theo yêu cầu...[/faq]
  [faq title="Có hỗ trợ sau khi bàn giao không?"]Có, chúng tôi hỗ trợ 3 tháng miễn phí...[/faq]
  [faq title="Website có tương thích mobile không?"]100% responsive trên mọi thiết bị...[/faq]
[/faq_group]
```

#### Cách 3 — Plugin Accordion (nếu cần tính năng nâng cao)

```bash
wp plugin install easy-accordion-free --activate
```

---

## 9. Flatsome Customizer Quick Reference

### Cài đặt quan trọng nhất (ảnh hưởng toàn site)

```bash
# Typography
wp option update flatsome_body_font "Roboto"
wp option update flatsome_body_font_size "16"
wp option update flatsome_heading_font "Poppins"

# Colors
wp option update flatsome_primary_color "#1d4ed8"   # Primary brand color
wp option update flatsome_secondary_color "#64748b"  # Secondary color

# Header
wp option update flatsome_header_background "#ffffff"
wp option update flatsome_header_height "80"         # px
wp option update flatsome_header_sticky "1"          # Sticky header on/off
wp option update flatsome_header_style "1"           # 1-4

# Logo
LOGO_ID=$(wp media import /path/logo.png --porcelain)
wp option update site_logo $LOGO_ID

# Breadcrumb
wp option update flatsome_breadcrumb "1"             # Bật breadcrumb

# Buttons (global)
wp option update flatsome_button_radius "4"          # px border-radius
```

### Mục Customizer và tác dụng

| Mục Customizer | Tác dụng |
|---|---|
| General > Colors | Primary + secondary color toàn site |
| General > Typography | Font chữ toàn site |
| Header > Style | Chọn layout header (1-4) |
| Header > Height | Chiều cao header |
| Header > Sticky | Header dính khi scroll |
| Header > Mobile | Breakpoint và style menu mobile |
| Layout > Max Width | Container max-width (thường 1200px) |
| Layout > Page Layout | Sidebar vị trí mặc định |
| Shop > Columns | Số cột sản phẩm |
| Shop > Products | Số sản phẩm per page |
| Blog > Style | Card, grid, list |
| Footer > Widgets | Số cột footer (1-4) |
| Footer > Bottom Bar | Copyright bar on/off |

### Đọc/ghi Customizer settings bằng WP-CLI

```bash
# Đọc setting
wp option get theme_mods_flatsome-child

# Ghi setting (cẩn thận — format JSON)
wp eval '
$mods = get_theme_mods();
$mods["primary_color"] = "#1d4ed8";
$mods["body_font"] = "Inter";
set_theme_mod("primary_color", "#1d4ed8");
set_theme_mod("body_font", "Inter");
echo "Done";
'
```

---

## 10. Info/Benefits Bar

Pattern phổ biến trên mọi loại site (company, shop, product). Hiển thị 4 lợi ích/tính năng nổi bật.

### Phương án A — `[featured_box]` (client-editable)

```
[section bg_color="#f8fafc" padding="30px 0"]
  [row style="collapse"]
    [col span="3" span__sm="6" align="center"]
      [featured_box img="ICON_ID" img_width="40" pos="left" title="Bảo hành 12 tháng"]Chính hãng toàn quốc[/featured_box]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [featured_box img="ICON_ID" img_width="40" pos="left" title="Hỗ trợ 24/7"]Giải đáp mọi thắc mắc[/featured_box]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [featured_box img="ICON_ID" img_width="40" pos="left" title="Giao hàng nhanh"]Trong 24-48 giờ[/featured_box]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [featured_box img="ICON_ID" img_width="40" pos="left" title="Đổi trả dễ dàng"]Trong 30 ngày[/featured_box]
    [/col]
  [/row]
[/section]
```

### Phương án B — CSS icon (dùng FontAwesome hoặc Flatsome built-in icons)

```
[section bg_color="#fff" padding="30px 0" class="co-benefits-bar"]
  [row style="collapse" h_align="center"]
    [col span="3" span__sm="6" align="center" class="co-benefit"]
      [ux_text]
        <div class="co-benefit-item">
          <i class="icon-shield" style="font-size:28px;color:#1d4ed8;"></i>
          <div>
            <strong>Bảo hành 12 tháng</strong>
            <span>Chính hãng toàn quốc</span>
          </div>
        </div>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text]
        <div class="co-benefit-item">
          <i class="icon-phone" style="font-size:28px;color:#1d4ed8;"></i>
          <div>
            <strong>Hỗ trợ 24/7</strong>
            <span>Giải đáp mọi thắc mắc</span>
          </div>
        </div>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text]
        <div class="co-benefit-item">
          <i class="icon-truck" style="font-size:28px;color:#1d4ed8;"></i>
          <div>
            <strong>Giao hàng nhanh</strong>
            <span>24-48 giờ toàn quốc</span>
          </div>
        </div>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text]
        <div class="co-benefit-item">
          <i class="icon-refresh" style="font-size:28px;color:#1d4ed8;"></i>
          <div>
            <strong>Đổi trả 30 ngày</strong>
            <span>Không cần lý do</span>
          </div>
        </div>
      [/ux_text]
    [/col]
  [/row]
[/section]
```

```css
.co-benefits-bar { border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6; }
.co-benefit-item {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 16px;
}
.co-benefit-item div { display: flex; flex-direction: column; text-align: left; }
.co-benefit-item strong { font-size: 14px; font-weight: 700; color: #111827; }
.co-benefit-item span { font-size: 12px; color: #6b7280; }
@media (max-width: 549px) {
    .co-benefit-item { padding: 8px; }
    .co-benefit-item strong { font-size: 13px; }
}
```

### Flatsome built-in icon list (dùng trong `[ux_text]`)

```
icon-shield       → bảo hành, bảo mật
icon-phone        → liên hệ, hỗ trợ
icon-truck        → giao hàng, vận chuyển
icon-refresh      → đổi trả
icon-map-pin      → địa chỉ, vị trí
icon-mail         → email
icon-clock        → giờ làm việc, thời gian
icon-star         → đánh giá, chất lượng
icon-check        → xác nhận, tính năng có
icon-times        → tính năng không có
icon-heart        → yêu thích
icon-user         → tài khoản, người dùng
icon-lock         → bảo mật, đăng nhập
icon-search       → tìm kiếm
icon-cart         → giỏ hàng
icon-info-circle  → thông tin
```
