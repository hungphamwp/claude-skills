# Header Advanced Patterns — Flatsome

> Patterns nâng cao cho header: transparent sticky, mega menu, custom mobile menu,
> search overlay, language switcher, topbar CTA.

---

## 1. Header Styles Overview

Flatsome có 5 header styles. Nhận dạng từ ảnh mẫu:

| Style | Visual | Khi nào dùng |
|---|---|---|
| **Style 1** | Logo trái, Nav phải | Phổ biến nhất, agency/corporate |
| **Style 2** | Logo giữa, Nav 2 bên | Luxury, restaurant, fashion |
| **Style 3** | Logo trái, Nav center | SaaS, tech startup |
| **Style 4** | Logo trái, full-width nav bar bên dưới | E-commerce nhiều category |
| **Style 5** | Logo trái, Nav + search/cart phải | WooCommerce shop |

```bash
# Set header style
wp --path=$WPPATH option update flatsome_header_layout '1' --allow-root
# Options: 1, 2, 3, 4, 5
```

---

## 2. Transparent Sticky Header (Hero overlap)

Pattern phổ biến: header trong suốt đè lên hero → scroll xuống → đổi nền trắng/solid.

### Setup qua Flatsome Customizer options

```bash
# Header transparent trên trang chủ
wp --path=$WPPATH eval '
$opts = get_option("flatsome_options", []);
$opts["header_transparent"] = "1";           // Bật transparent
$opts["header_transparent_color"] = "light"; // light (text trắng) hoặc dark (text đen)
$opts["header_sticky"] = "1";                // Bật sticky
$opts["header_sticky_style"] = "fixed";      // fixed hoặc reveal
update_option("flatsome_options", $opts);
echo "Header updated";
' --allow-root
```

### Custom CSS transparent → solid transition

```css
/* === TRANSPARENT STICKY HEADER === */

/* Trạng thái ban đầu: trong suốt */
.header-wrapper:not(.scrolled) .header-main {
  background: transparent !important;
  box-shadow: none !important;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* Text trắng khi transparent (dark hero bg) */
.header-wrapper:not(.scrolled) .header-main .nav > li > a,
.header-wrapper:not(.scrolled) .header-main .logo a {
  color: #ffffff !important;
}

/* Logo trắng thay logo màu */
.header-wrapper:not(.scrolled) .header-main .logo-img {
  content: url('/wp-content/uploads/logo-white.svg') !important;
}

/* Khi đã scroll: solid + shadow */
.header-wrapper.scrolled .header-main {
  background: #ffffff !important;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08) !important;
}

/* Logo màu khi đã scroll */
.header-wrapper.scrolled .header-main .logo-img {
  content: url('/wp-content/uploads/logo-color.svg') !important;
}
```

### Logo 2 phiên bản (color/white) via Flatsome settings

```bash
COLOR_LOGO_ID=$(wp --path=$WPPATH media import /tmp/logo-color.svg --title="Logo Color" --porcelain --allow-root)
WHITE_LOGO_ID=$(wp --path=$WPPATH media import /tmp/logo-white.svg --title="Logo White" --porcelain --allow-root)

wp --path=$WPPATH option update flatsome_logo $COLOR_LOGO_ID --allow-root
wp --path=$WPPATH option update flatsome_logo_dark $WHITE_LOGO_ID --allow-root
wp --path=$WPPATH option update flatsome_logo_width '180' --allow-root
```

---

## 3. CTA Button trong Header

Pattern: button "Đăng ký ngay" / "Free Trial" bên phải nav.

### Via child theme functions.php hook

```php
// functions.php
add_action('flatsome_header_top', function() {
    $url  = get_option('siteurl') . '/lien-he/';
    $text = 'Tư vấn miễn phí';
    ?>
    <a href="<?php echo esc_url($url); ?>" class="vf-header-cta button small primary">
        <?php echo esc_html($text); ?>
        <i class="icon-angle-right" style="margin-left:4px;"></i>
    </a>
    <?php
}, 20);
```

```css
/* CSS cho CTA button */
.vf-header-cta {
  margin-left: 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 9px 22px !important;
  border-radius: 6px !important;
  white-space: nowrap !important;
  letter-spacing: 0.3px !important;
}

/* Ẩn trên mobile nhỏ */
@media (max-width: 549px) {
  .vf-header-cta { display: none !important; }
}
```

---

## 4. Topbar (thông tin liên hệ / announcement)

```bash
# Bật topbar
wp --path=$WPPATH eval '
$opts = get_option("flatsome_options", []);
$opts["topbar_show"] = "1";
$opts["topbar_bg"] = "#1e3a5f";
$opts["topbar_color"] = "dark";  // dark = text trắng
$opts["topbar_text_left"]  = '\'<i class="icon-phone"></i> <a href="tel:0912345678">0912.345.678</a>\';
$opts["topbar_text_right"] = '\'<a href="mailto:info@company.vn">info@company.vn</a>\';
update_option("flatsome_options", $opts);
echo "Topbar updated";
' --allow-root
```

```css
/* Topbar custom style */
.top-bar {
  font-size: 13px !important;
  padding: 6px 0 !important;
}
.top-bar a {
  color: rgba(255,255,255,0.85) !important;
  text-decoration: none !important;
}
.top-bar a:hover {
  color: #ffffff !important;
}
.top-bar .icon-phone,
.top-bar .icon-mail {
  margin-right: 5px;
  font-size: 12px;
}
```

---

## 5. Mega Menu (dropdown với columns)

Flatsome native mega menu qua WP Admin > Menus.

### Setup mega menu programmatically

```bash
# Tạo menu với mega dropdown
wp --path=$WPPATH eval '
// Tạo nav menu
$menu_id = wp_create_nav_menu("Main Menu");

// Item cha: Dịch vụ (mega trigger)
$parent = wp_update_nav_menu_item($menu_id, 0, [
    "menu-item-title"  => "Dịch vụ",
    "menu-item-url"    => "/dich-vu/",
    "menu-item-status" => "publish",
]);

// Item con: SEO
wp_update_nav_menu_item($menu_id, 0, [
    "menu-item-title"     => "SEO Website",
    "menu-item-url"       => "/dich-vu/seo/",
    "menu-item-status"    => "publish",
    "menu-item-parent-id" => $parent,
]);

echo "Menu created: ID $menu_id";
' --allow-root

# Assign to primary location
wp --path=$WPPATH menu location assign "main-menu" primary --allow-root
```

### CSS mega menu grid

```css
/* Mega menu: 4 cột */
.header-nav .mega-menu {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 0 !important;
  padding: 24px !important;
  min-width: 800px !important;
  background: #ffffff !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
  border-top: 3px solid var(--c-primary) !important;
}

.header-nav .mega-menu .sub-menu {
  position: static !important;
  background: transparent !important;
  box-shadow: none !important;
  display: block !important;
  min-width: 0 !important;
  padding: 0 !important;
}

.header-nav .mega-menu > li {
  padding: 0 20px !important;
  border-right: 1px solid #f3f4f6;
}

.header-nav .mega-menu > li:last-child {
  border-right: none;
}

/* Mega menu title */
.header-nav .mega-menu > li > a {
  font-weight: 700 !important;
  font-size: 13px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  color: var(--c-text-heading) !important;
  padding: 0 0 12px !important;
  border-bottom: 1px solid #f3f4f6 !important;
  margin-bottom: 8px !important;
  display: block !important;
}
```

---

## 6. Mobile Menu Customization

### CSS mobile menu styling

```css
/* === MOBILE MENU === */

/* Hamburger button */
.nav-toggle {
  width: 40px !important;
  height: 40px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Menu slide panel */
.mobile-sidebar {
  background: #ffffff !important;
  width: 280px !important;
  padding: 0 !important;
}

/* Mobile menu logo */
.mobile-sidebar-header {
  padding: 20px 24px !important;
  border-bottom: 1px solid #f3f4f6 !important;
}

/* Mobile nav items */
.mobile-sidebar .nav > li > a {
  padding: 14px 24px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
  border-bottom: 1px solid #f9fafb !important;
}

/* Mobile CTA button */
.mobile-sidebar .vf-mobile-cta {
  display: block !important;
  margin: 16px 24px !important;
  text-align: center !important;
  padding: 14px !important;
  border-radius: 8px !important;
  background: var(--c-primary) !important;
  color: #fff !important;
  font-weight: 600 !important;
}

@media (min-width: 850px) {
  .vf-mobile-cta { display: none !important; }
}
```

### Thêm CTA vào mobile menu via functions.php

```php
add_action('flatsome_mobile_nav', function() {
    echo '<a href="/lien-he/" class="vf-mobile-cta button primary">
        Tư vấn miễn phí →
    </a>';
}, 20);
```

---

## 7. Search Overlay

```css
/* === SEARCH OVERLAY === */
.search-overlay {
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(4px) !important;
}

.search-overlay .search-field {
  background: transparent !important;
  border: none !important;
  border-bottom: 2px solid rgba(255,255,255,0.3) !important;
  color: #ffffff !important;
  font-size: 24px !important;
  padding: 12px 0 !important;
  width: 100% !important;
  max-width: 600px !important;
}

.search-overlay .search-field::placeholder {
  color: rgba(255,255,255,0.5) !important;
}

.search-overlay .search-submit {
  background: var(--c-primary) !important;
  border-radius: 8px !important;
  color: #fff !important;
}
```

---

## 8. Header QA Checklist

```
□ Logo hiện đúng (không phải Flatsome demo logo)
□ Logo width đúng (không quá lớn/nhỏ)
□ Nav items đúng thứ tự, đúng link
□ Dropdown hoạt động trên hover
□ CTA button hiện, màu đúng
□ Sticky hoạt động khi scroll
□ Transparent effect đúng trên hero (nếu có)
□ Mobile: hamburger hiện ở ≤849px
□ Mobile: menu mở/đóng đúng
□ Mobile: CTA button trong mobile menu
□ Topbar: text, link, màu đúng
□ Header height phù hợp (không quá cao/thấp)
```

---

## 9. Common Header Failures

| Vấn đề | Nguyên nhân | Fix |
|---|---|---|
| Logo quá nhỏ | `flatsome_logo_width` chưa set | `wp option update flatsome_logo_width 180` |
| Cart/Search icon xuất hiện không cần | Flatsome WooCommerce header defaults | `wp option update flatsome_header_cart 0` |
| "Add anything" text trên topbar | Topbar default active | `wp option update flatsome_topbar_show 0` |
| CTA button không wrap | `white-space` thiếu | `white-space: nowrap !important` |
| Sticky header nhảy layout | `padding-top` body | CSS: `html.header-sticky .page-wrapper { padding-top: HEADER_HEIGHTpx }` |
| Logo disappears khi sticky | CSS override sai | Target `.fixed .header-inner .logo-img` |
| Mega menu xuất hiện muộn | CSS transition | Giảm `transition-delay` trong `.sub-menu` |
