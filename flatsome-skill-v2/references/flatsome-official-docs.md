# Flatsome Official Documentation Reference

> Source: [docs.uxthemes.com](https://docs.uxthemes.com/) — Compiled April 2026
> Categories: 16 | Articles: 130+ | Hooks: 67 actions + 67 filters

---

## Table of Contents

1. [General](#1-general)
2. [Theme Installation](#2-theme-installation)
3. [Navigation](#3-navigation)
4. [Shortcodes](#4-shortcodes)
5. [Widgets](#5-widgets)
6. [Custom Post Types](#6-custom-post-types)
7. [Theme Hooks (Actions & Filters)](#7-theme-hooks)
8. [Custom Code Placement (CSS/PHP/JS)](#8-custom-code-placement)
9. [How-tos / Guides](#9-how-tos--guides)
10. [WooCommerce Integration](#10-woocommerce)
11. [Plugin Compatibility](#11-plugin-compatibility)
12. [Troubleshooting](#12-troubleshooting)
13. [Performance & Caching](#13-performance--caching)
14. [Snippets](#14-snippets)
15. [Development](#15-development)
16. [FAQ](#16-faq)

---

## 1. General

### System Status
- **Location**: Flatsome > System Status (admin dashboard)
- Shows PHP version, memory limit, max upload size, WP version
- Checks for required PHP extensions
- Verifies theme file permissions
- Reports active plugins that may conflict

### Google Fonts
- Flatsome loads Google Fonts natively from Theme Options
- **Location**: Customizer > Typography
- All Google Fonts are available by default
- Supports font weights: 100–900
- Custom fonts can be added via child theme (see Custom Fonts section)
- **Performance tip**: Limit to 2-3 font families to avoid CLS

---

## 2. Theme Installation

### Requirements
- WordPress 6.0+
- PHP 7.4+ (8.0+ recommended)
- MySQL 5.7+ or MariaDB 10.3+
- Memory limit: 256MB minimum
- Max upload size: 32MB+ for theme ZIP

### Installation Methods
1. **WordPress Dashboard**: Appearance > Themes > Add New > Upload Theme
2. **FTP**: Upload extracted `flatsome/` to `wp-content/themes/`
3. **WP-CLI**: `wp theme install flatsome.zip --activate`

### Child Theme Setup
```
wp-content/themes/flatsome-child/
├── style.css          (required - with parent theme header)
├── functions.php      (required - enqueues parent styles)
├── screenshot.png     (optional)
└── ...custom files
```

**style.css header**:
```css
/*
 Theme Name:   Flatsome Child
 Template:     flatsome
 Version:      1.0.0
*/
```

**functions.php**:
```php
<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), array('flatsome-main'), wp_get_theme()->get('Version'));
});
```

### Theme License/Registration
- Register at Flatsome > Registration
- One license per site
- Required for automatic updates and Flatsome Studio
- Purchase code from ThemeForest

---

## 3. Navigation

### Menu Locations (4 locations)
| Location | Description |
|----------|-------------|
| `primary` | Main navigation (header) |
| `primary_mobile` | Mobile sidebar menu |
| `footer` | Footer navigation links |
| `top_bar_nav` | Top bar navigation |

### Menu Dropdown Styles
- **Default**: Standard hover dropdown
- **Mega Menu**: Full-width dropdown with UX Builder content
- **Vertical**: Left sidebar vertical menu

### Creating a Mega Menu
1. Create a **Flatsome Block** (Blocks post type)
2. Design the dropdown content using UX Builder
3. In Appearance > Menus, add the menu item
4. Set CSS class to `flatsome-menu-item-block` (via Screen Options > CSS Classes)
5. Add the block shortcode as a child menu item label

### Vertical Menu
- Enable via **Customizer > Header > Header Bottom > Left Element > Vertical Menu**
- Works with WooCommerce product categories
- Supports nested levels
- Combine with category images

### Mobile Sidebar Menu
- **Customizer > Header > Mobile Menu**
- Elements can be added: search, account, cart, custom HTML
- Hooks: `flatsome_before_sidebar_menu`, `flatsome_after_sidebar_menu`
- Custom elements via `flatsome_before_sidebar_menu_elements` / `flatsome_after_sidebar_menu_elements`

### Separate Mobile Menu
- Can configure a different menu for mobile sidebar
- **Customizer > Header > Mobile Menu > Mobile Menu Source**

### Flatsome Pjax (SPA-like Navigation)
- Enables page transitions without full reload
- Activate: **Customizer > Advanced > Pjax**
- Uses pushState for URL updates
- Excludes certain URLs automatically (wp-admin, checkout)
- Custom script to exclude: `jQuery.flatsome_pjax.defined_containers`

---

## 4. Shortcodes

### How to Generate a Shortcode
1. Open UX Builder on any page
2. Add and configure any element
3. Click the **"Copy Shortcode"** button at the top
4. Paste the generated shortcode into any text editor

### Lightbox Shortcode
```
[lightbox id="unique-id" width="600px" padding="20px"]
  Content here...
[/lightbox]
```

**Trigger** with `link="#unique-id"` on any button/link.

**Options**:
- `auto_open="true"` — auto-open on page load
- `auto_timer="3000"` — delay in ms before auto-open
- `auto_show="always"` — show every visit
- `auto_show="once"` — show once per visitor (cookie-based)

**Newsletter Lightbox example**:
```
[button text="Open" link="#signup"]
[lightbox id="signup" width="600px" padding="20px"]
  [ux_banner bg="http://..." height="400px"]
    <h3>Sign up</h3>
    [contact-form-7 id="123"]
  [/ux_banner]
[/lightbox]
```

### Custom Product Page Shortcodes
Available shortcodes for custom product layouts:
- `[ux_product_gallery]` — Product image gallery
- `[ux_product_breadcrumbs]` — Breadcrumbs
- `[ux_product_title]` — Product title
- `[ux_product_rating]` — Star rating
- `[ux_product_price]` — Price display
- `[ux_product_excerpt]` — Short description
- `[ux_product_add_to_cart]` — Add to cart button
- `[ux_product_meta]` — SKU, categories, tags
- `[ux_product_tabs]` — Product tabs
- `[ux_product_upsell]` — Upsell products
- `[ux_product_related]` — Related products
- `[ux_sidebar id="product-sidebar"]` — Product sidebar
- `[share]` — Social sharing

**Standard product layout shortcode**:
```
[row]
  [col span="6" span__sm="12"][ux_product_gallery][/col]
  [col span="6" span__sm="12"]
    [ux_product_breadcrumbs]
    [ux_product_title]
    [ux_product_rating]
    [ux_product_price]
    [ux_product_excerpt]
    [ux_product_add_to_cart]
    [ux_product_meta]
    [share]
  [/col]
[/row]
[ux_product_tabs]
[ux_product_upsell style="grid"]
[ux_product_related]
```

### Scroll-To Links
1. Add a `[scroll_to]` element above target section in UX Builder
2. Give it a title → generates `#tag`
3. Set any button's link to `#tag`
4. Does not preview in UX Builder — must view on frontend

---

## 5. Widgets

### Flatsome Widgets
- **UX Sidebar**: Dynamic sidebars manageable in UX Builder
- **Custom widgets**: Shortcode, social icons, newsletter

### Widget Areas
| Location | ID |
|----------|-----|
| Shop Sidebar | `shop-sidebar` |
| Product Sidebar | `product-sidebar` |
| Blog Sidebar | `sidebar-main` |
| Footer 1 | `sidebar-footer-1` |
| Footer 2 | `sidebar-footer-2` |

---

## 6. Custom Post Types

### Flatsome Blocks
- CPT: `blocks`
- Editable via UX Builder
- Used for: mega menus, custom headers, footer blocks, reusable content
- Shortcode: `[block id="block-slug-or-id"]`

### Portfolio
- CPT: `featured_item`
- Built-in portfolio support
- Custom archive/single templates
- Grid/masonry layouts

### Enable UX Builder for CPT
```php
// In child theme functions.php
add_filter('flatsome_ux_builder_post_types', function($types) {
    $types[] = 'my_custom_post_type';
    return $types;
});
```

---

## 7. Theme Hooks

### 67 Action Hooks

#### Page/Layout Hooks
| Hook | Location | Description |
|------|----------|-------------|
| `flatsome_after_body_open` | header.php | Right after `<body>` tag |
| `flatsome_before_header` | header.php | Before header wrapper |
| `flatsome_after_header` | header.php | After header, before content |
| `flatsome_after_header_bottom` | header-bottom.php | After bottom header row |
| `flatsome_before_page` | page.php | Before page content wrapper |
| `flatsome_before_page_content` | page.php | Before the_content() |
| `flatsome_after_page_content` | page.php | After the_content() |
| `flatsome_after_page` | page.php | After page content wrapper |
| `flatsome_before_footer` | footer.php | Before footer |
| `flatsome_footer` | footer.php | Footer content |
| `flatsome_after_footer` | footer.php | After footer |
| `flatsome_absolute_footer_primary` | footer-absolute.php | Primary absolute footer |
| `flatsome_absolute_footer_secondary` | footer-absolute.php | Secondary absolute footer |

#### Blog Hooks
| Hook | Location |
|------|----------|
| `flatsome_before_blog` | Blog archive, before posts |
| `flatsome_after_blog` | Blog archive, after posts |
| `flatsome_blog_post_before` | Before each blog post card |
| `flatsome_blog_post_after` | After each blog post card |
| `flatsome_before_comments` | Before comments section |

#### WooCommerce/Product Hooks
| Hook | Location |
|------|----------|
| `flatsome_before_product_page` | Before single product |
| `flatsome_after_product_page` | After single product |
| `flatsome_before_product_images` | Before product gallery |
| `flatsome_after_product_images` | After product gallery |
| `flatsome_before_product_sidebar` | Before product sidebar |
| `flatsome_product_box_actions` | Product grid card actions |
| `flatsome_product_box_after` | After product grid card |
| `flatsome_product_box_tools_top` | Top tools on product card |
| `flatsome_product_box_tools_bottom` | Bottom tools on product card |
| `flatsome_product_image_tools_top` | Top of product image |
| `flatsome_product_image_tools_bottom` | Bottom of product image |
| `flatsome_sale_flash` | Sale badge location |
| `flatsome_product_title` | Product title area |
| `flatsome_products_before` | Before products grid |
| `flatsome_products_after` | After products grid |
| `flatsome_cart_sidebar` | Cart sidebar |
| `flatsome_category_title` | Category header title |
| `flatsome_before_single_product_custom` | Before custom product layout |
| `flatsome_before_single_product_lightbox` | Before product lightbox |
| `flatsome_after_single_product_lightbox` | After product lightbox |

#### Mini Cart Hooks (since 3.18.0)
| Hook | Description |
|------|-------------|
| `flatsome_after_mini_cart_contents` | After mini cart items |
| `flatsome_before_mini_cart_total` | Before total line |
| `flatsome_before_mini_cart_cross_sells` | Before cross-sells |
| `flatsome_after_mini_cart_cross_sells` | After cross-sells |
| `flatsome_before_mini_cart_empty_message` | Before empty message |
| `flatsome_after_mini_cart_empty_message` | After empty message |

#### Sidebar Menu Hooks (since 3.15.0)
| Hook | Description |
|------|-------------|
| `flatsome_before_sidebar_menu` | Before mobile sidebar |
| `flatsome_after_sidebar_menu` | After mobile sidebar |
| `flatsome_before_sidebar_menu_elements` | Before sidebar elements |
| `flatsome_after_sidebar_menu_elements` | After sidebar elements |

#### Other Hooks
| Hook | Description |
|------|-------------|
| `flatsome_breadcrumb` | Breadcrumb display |
| `flatsome_before_breadcrumb` | Before breadcrumb |
| `flatsome_after_breadcrumb` | After breadcrumb |
| `flatsome_before_404` | Before 404 content |
| `flatsome_after_404` | After 404 content |
| `flatsome_header_background` | Header background |
| `flatsome_header_elements` | Header elements |
| `flatsome_header_wrapper` | Header wrapper |
| `flatsome_account_links` | Account links |
| `flatsome_after_account_user` | After account user info |
| `flatsome_portfolio_title_after` | After portfolio title |

### 67 Filter Hooks (Key Selection)

| Filter | Type | Description |
|--------|------|-------------|
| `flatsome_header_class` | string | Modify header CSS classes |
| `flatsome_main_class` | string | Modify main content classes |
| `flatsome_sidebar_class` | string | Modify sidebar classes |
| `flatsome_header_element` | mixed | Modify header element output |
| `flatsome_icon` | string | Modify icon output |
| `flatsome_text_formats` | array | Custom text format options |
| `flatsome_product_block` | mixed | Modify product block output |
| `flatsome_product_labels` | array | Modify product labels |
| `flatsome_product_box_classes` | string | Product box CSS classes |
| `flatsome_product_box_image_classes` | string | Product image classes |
| `flatsome_product_box_text_classes` | string | Product text classes |
| `flatsome_product_box_actions_classes` | string | Product actions classes |
| `flatsome_sale_bubble_percentage_cache_enabled` | bool | Enable % sale cache |
| `flatsome_follow_links` | array | Modify social follow links |
| `flatsome_share_links` | array | Modify share links |
| `flatsome_payment_icons` | array | Modify payment icons |
| `flatsome_ajax_search_post_type` | string | AJAX search post type |
| `flatsome_ajax_search_query` | array | AJAX search query args |
| `flatsome_attachment_size` | string | Image attachment size |
| `flatsome_maintenance_mode` | bool | Enable maintenance mode |
| `flatsome_disable_mini_cart` | bool | Disable mini cart |
| `flatsome_show_buy_now_button` | bool | Show buy now button |
| `flatsome_sticky_add_to_cart_enabled` | bool | Sticky add to cart |
| `flatsome_infinite_scroll_params` | array | Infinite scroll params |
| `flatsome_lightbox_close_button` | string | Lightbox close button |
| `flatsome_new_flash_html` | string | "New" badge HTML |
| `flatsome_viewport_meta` | string | Viewport meta tag |
| `flatsome_html_atts` | string | HTML tag attributes |
| `flatsome_cache_clear_items` | array | Items to clear on cache |
| `flatsome_swatch_html` | string | Swatch HTML output |
| `flatsome_swatch_image_size` | string | Swatch image size |
| `flatsome_shipping_free_shipping_threshold` | float | Free shipping threshold |
| `flatsome_mini_cart_cross_sells_total` | int | Cross-sells limit |
| `flatsome_relay_classes` | string | Relay element classes |
| `flatsome_relay_pagination_args` | array | Relay pagination args |
| `flatsome_admin_menu_items_enabled` | array | Admin menu items |

---

## 8. Custom Code Placement

### Where to Add Custom CSS
1. **Child theme `style.css`** (recommended for persistent, version-controlled CSS)
2. **Customizer > Custom CSS** (quick small tweaks)
3. **Flatsome > Advanced > Custom CSS** (same as #2 but in theme options)

> ⚠️ Never edit parent theme files — changes lost on update

### Where to Add Custom PHP
1. **Child theme `functions.php`** (recommended)
2. **Code Snippets plugin** (alternative for non-developers)

> ⚠️ Never edit parent `functions.php` or core files

### Where to Add Custom JavaScript
1. **Customizer > Custom > Custom JS** (for small scripts)
2. **Child theme**: enqueue properly via `wp_enqueue_script()`

```php
// In child theme functions.php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('custom-js', get_stylesheet_directory_uri() . '/custom.js', array('jquery'), '1.0', true);
});
```

### Add Custom Fonts
1. Upload font files to child theme `/fonts/` directory
2. Add `@font-face` in child theme `style.css`
3. Register in Flatsome:

```php
// In child theme functions.php
add_filter('flatsome_custom_fonts', function($fonts) {
    $fonts['My Custom Font'] = array(
        'url' => get_stylesheet_directory_uri() . '/fonts/custom-font.woff2'
    );
    return $fonts;
});
```

---

## 9. How-tos / Guides

### Page Management
| Guide | Key Info |
|-------|---------|
| **Change Homepage** | Settings > Reading > Static Page > Homepage |
| **Custom 404 Page** | Create Block > Assign via `flatsome_before_404` hook |
| **Flatsome Studio** | Pre-built page sections, drag & drop import |
| **Blog Page Setup** | Settings > Reading > Posts Page, Customizer > Blog |

### UX Banner & Sliders
| Guide | Key Info |
|-------|---------|
| **Responsive Sliders/Banners** | Use `[text_box]` inside `[ux_banner]` for responsive text |
| **Banner Video** | Use `.mp4` + `.webm` formats for cross-browser |
| **Video Attributes** | `video_mp4=""`, `video_webm=""` on `[ux_banner]` |
| **Video Autoplay** | Videos autoplay muted by default (browser requirement) |

### Navigation & UX
| Guide | Key Info |
|-------|---------|
| **Mega Menu** | Create Block → CSS class `flatsome-menu-item-block` |
| **Scroll-To Link** | Use `[scroll_to]` element + `#tag` link |
| **Lightbox Popup** | `[lightbox id="x"]` + `link="#x"` trigger |
| **Open Images in Lightbox** | Add `class="lightbox-gallery"` to gallery wrapper |

### WooCommerce Specific
| Guide | Key Info |
|-------|---------|
| **Custom Product Page** | WooCommerce > Settings > Product Page Block |
| **Featured Products** | Edit product > Star icon, or bulk edit |
| **Catalog Mode** | Flatsome > WooCommerce > Catalog Mode |
| **Variation Swatches** | Built-in since 3.14 (no plugin needed) |
| **Additional Variation Images** | Built-in gallery per variation |
| **Shop Header with UX Builder** | WooCommerce > Customizer > Shop Header Block |
| **Payment Icons in Footer** | Uses `flatsome_payment_icons` filter |
| **Wishlist Setup** | YITH Wishlist plugin supported natively |
| **Reorder Product Tabs** | Use `woocommerce_product_tabs` filter |
| **Multiple Product Tabs** | Custom tabs via theme options |

### Content & Layout
| Guide | Key Info |
|-------|---------|
| **Content on Top of Pages** | Set page header block in Customizer |
| **Banner on Category Page** | Category > Description field with UX Builder |
| **Newsletter Signup** | Use form plugin shortcode inside `[lightbox]` |

---

## 10. WooCommerce

### Full Integration Coverage
| Article | Topic |
|---------|-------|
| WooCommerce Installing | Setup wizard, dependencies |
| General Settings | Currency, base location, selling options |
| Product Settings | Inventory, downloadable, measurements |
| Tax Settings | Tax calculations, rates |
| Shipping Settings | Zones, methods, classes |
| Checkout Settings | Payment gateways, account creation |
| Account Settings | My Account page configuration |
| Product Categories/Tags/Attributes | Taxonomy management |
| Simple Product | Basic product creation |
| Variable Product | Variations, attributes, pricing |
| Grouped Product | Product bundles |
| External/Affiliate | Outbound product links |
| Downloadable Products | Digital product delivery |
| Coupons | Discount codes management |

### Key WooCommerce Features in Flatsome
- **Product Quick View**: Lightbox-based product preview
- **AJAX Add to Cart**: No page reload
- **Live Search**: Instant product search with images
- **Cart Sidebar**: Slide-in mini cart
- **Wishlist**: YITH plugin integration
- **Infinite Scroll**: Auto-load products on scroll
- **Product Labels**: Sale %, New, Out of Stock badges
- **Sticky Add to Cart**: Fixed bar on scroll
- **Buy Now Button**: Direct checkout skip cart

---

## 11. Plugin Compatibility

| Plugin | Status | Notes |
|--------|--------|-------|
| **WPML** | ✅ Full support | Multilingual, currency switching |
| **Polylang** | ✅ Full support | Alternative to WPML |
| **Yoast SEO** | ✅ Full support | Breadcrumbs integration |
| **Rank Math** | ✅ Full support | Breadcrumbs, schema |
| **SeoPress** | ✅ Full support | Breadcrumbs integration |
| **UberMenu** | ⚠️ Partial | Conflicts with Flatsome menu |
| **Google Maps API** | ✅ Full support | API key required since 2016 |

### SEO Plugin Breadcrumbs
```php
// Use Yoast breadcrumbs instead of Flatsome default
add_action('flatsome_breadcrumb', function() {
    if (function_exists('yoast_breadcrumb')) {
        yoast_breadcrumb('<p id="breadcrumbs">', '</p>');
    }
});
```

---

## 12. Troubleshooting

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **Shortcode doesn't display** | Check for `<p>` tag wrapping — use Text editor mode, not Visual |
| **Stylesheet Missing** | Ensure child theme `style.css` has correct `Template:` header |
| **Missing Customizer/UX Builder** | Deactivate plugins to find conflict, check PHP memory |
| **Blurred thumbnails** | Regenerate thumbnails: WooCommerce > Status > Tools |
| **Demo content not showing** | Install required plugins listed in Flatsome setup wizard |
| **Shop page looks weird** | Set Shop page in WooCommerce > Settings > Products > Shop Page |
| **SSL problems** | Use "Really Simple SSL" plugin, or check mixed content |
| **Upload size limit** | Increase in php.ini: `upload_max_filesize` and `post_max_size` |
| **Theme registration issue** | One purchase code per site — deregister old site first |
| **WooCommerce template outdated** | Expected — Flatsome overrides are intentional |

### Basic Troubleshooting Steps
1. **Deactivate all plugins** — check if issue persists
2. **Switch to parent theme** — check if child theme causes issue
3. **Enable WP Debug**: Add to `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```
4. **Clear cache** — all cache plugins + browser cache
5. **Check web console** (F12) for JS errors
6. **Update theme** — many bugs fixed in newer versions

---

## 13. Performance & Caching

### Page Speed Optimization
1. **Lazy Loading**: Built-in for images (Flatsome native)
2. **CSS/JS optimization**: Flatsome > Advanced > Performance
3. **Image optimization**: Use WebP format, compress with plugins
4. **Reduce HTTP requests**: Combine CSS/JS
5. **CDN**: Use Cloudflare or similar
6. **Database optimization**: Clean revisions, transients

### Caching Plugin Configuration
| Plugin | Key Settings |
|--------|-------------|
| **WP Rocket** | Exclude `/checkout/`, `/cart/`, `/my-account/` from cache |
| **W3 Total Cache** | Minify CSS/JS, Page cache, Browser cache |
| **LiteSpeed Cache** | Enable ESI for cart/account fragments |
| **WP Super Cache** | Simple mode, exclude dynamic pages |

> **Critical**: ALL cache plugins must exclude WooCommerce cart, checkout, and my-account pages from caching.

### Flatsome Lazy Load
- Built-in lazy loading for images
- Can be disabled per element: `loading="eager"` 
- UX Builder images are lazy-loaded by default
- Background images use intersection observer

---

## 14. Snippets

### Payment Icons
```php
// Add custom payment icons
add_filter('flatsome_payment_icons', function($icons) {
    $icons[] = '<img src="path/to/icon.svg" alt="Payment">';
    return $icons;
});
```

### Custom Product Page Block Filter
```php
// Override product page block per category
add_filter('flatsome_product_block', function($block, $product) {
    $categories = wp_get_post_terms($product->get_id(), 'product_cat');
    foreach ($categories as $cat) {
        if ($cat->slug === 'special') {
            return 'special-product-layout'; // block slug
        }
    }
    return $block;
}, 10, 2);
```

### Lightbox Close Button
```php
// Customize lightbox close button
add_filter('flatsome_lightbox_close_button', function() {
    return '<button title="Close" class="mfp-close">✕</button>';
});
```

### Infinite Scroll: Disable History
```js
// Prevent URL change on infinite scroll
jQuery(function($) {
    if (typeof $.flatsome_infinite_scroll !== 'undefined') {
        $.flatsome_infinite_scroll.options.history = false;
    }
});
```

### Follow Links
```php
// Add custom social follow links
add_filter('flatsome_follow_links', function($links) {
    $links['tiktok'] = array(
        'url' => 'https://tiktok.com/@username',
        'icon' => 'icon-tiktok',
        'label' => 'TikTok'
    );
    return $links;
});
```

### Share Links
```php
// Add custom share links
add_filter('flatsome_share_links', function($links) {
    $links['telegram'] = array(
        'url' => 'https://t.me/share/url?url={url}&text={title}',
        'icon' => 'icon-telegram',
        'label' => 'Telegram'
    );
    return $links;
});
```

### WooCommerce Shop Page Controls
```php
// Add result count and ordering dropdown back
add_action('flatsome_category_title_alt', 'woocommerce_result_count', 20);
add_action('flatsome_category_title_alt', 'woocommerce_catalog_ordering', 30);
```

---

## 15. Development

### Magnific Popup (Built-in Lightbox)
- Flatsome uses Magnific Popup for all lightbox functionality
- Available types: image, gallery, inline, iframe, AJAX
- Access via: `jQuery.magnificPopup()`

```js
// Open lightbox programmatically
jQuery.magnificPopup.open({
    items: { src: '#my-inline-content', type: 'inline' },
    closeBtnInside: true
});
```

### Enable WP Debug
```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Release Channels
- **Stable**: Default, recommended for production
- **Beta**: Early access to new features
- Set in Flatsome > Advanced > Release Channel

### Page Templates Available
| Template File | Description |
|---------------|-------------|
| `page.php` | Default page template |
| `page-blank.php` | No header/footer |
| `page-blank-landingpage.php` | Blank with header |
| `page-transparent-header.php` | Transparent dark header |
| `page-transparent-header-light.php` | Transparent light header |
| `page-single-page-nav.php` | Single page navigation |
| `page-left-sidebar.php` | Page with left sidebar |
| `page-right-sidebar.php` | Page with right sidebar |
| `page-header-on-scroll.php` | Header appears on scroll |
| `page-blank-title-center.php` | Blank with centered title |


---

## 16. FAQ

### Server Recommendations
- **PHP**: 8.0+ for best performance
- **Memory**: 256MB minimum (512MB recommended)
- **Max Input Vars**: 5000+ (for Customizer)
- **Max Execution Time**: 300 seconds
- **Upload Size**: 32MB+

### Theme Update Methods
1. **Auto-update**: Registered themes update via WP Dashboard
2. **Manual**: Download from ThemeForest → Upload ZIP
3. **FTP**: Replace theme files (backup first!)
4. **Envato Market plugin**: One-click updates

### Common FAQ
| Question | Answer |
|----------|--------|
| Where to add custom CSS? | Child theme `style.css` or Customizer > Custom CSS |
| Where to add custom PHP? | Child theme `functions.php` |
| Where to add custom JS? | Customizer > Custom JS or child theme enqueue |
| How to update safely? | Always use child theme, backup before update |
| Multiple sites with 1 license? | No — each site needs its own license |

---

## Quick Reference: Complete Article Index

### General (2 articles)
- [System Status](https://docs.uxthemes.com/article/414-system-status)
- [Google Fonts](https://docs.uxthemes.com/article/415-google-fonts)

### Theme Installation (3 articles)
- Theme Installation, Child Theme, Demo Content Import

### Navigation (8 articles)
- [Menu Locations](https://docs.uxthemes.com/article/50-menu-locations)
- [Menu Dropdown](https://docs.uxthemes.com/article/51-menu-dropdown)
- [Vertical Menu](https://docs.uxthemes.com/article/409-vertical-menu)
- [Mega Menu](https://docs.uxthemes.com/article/391-how-to-create-a-mega-menu-dropdown)
- [Mobile Sidebar Menu](https://docs.uxthemes.com/article/300-mobile-sidebar-menu-elements)
- [Separate Mobile Menu](https://docs.uxthemes.com/article/403-configure-a-separate-sidebar-menu)
- [Personal Menu Label](https://docs.uxthemes.com/article/239-how-to-add-my-own-personal-menu-label)
- [Flatsome Pjax](https://docs.uxthemes.com/article/430-pjax)

### Shortcodes (3 articles)
- [Product Page Shortcodes](https://docs.uxthemes.com/article/247-custom-product-page-layout-shortcodes)
- [Lightbox Shortcode](https://docs.uxthemes.com/article/229-lightbox-shortcode)
- [How to Generate a Shortcode](https://docs.uxthemes.com/article/223-how-to-generate-a-shortcode)

### Development (10 articles)
- [Theme Hooks](https://docs.uxthemes.com/article/385-hooks)
- [Custom CSS](https://docs.uxthemes.com/article/235-how-to-add-and-edit-custom-css)
- [Custom Fonts](https://docs.uxthemes.com/article/224-add-custom-fonts-to-flatsome)
- [UX Builder for CPT](https://docs.uxthemes.com/article/221-how-to-enable-ux-builder-for-custom-post-types)
- [Caching Plugins](https://docs.uxthemes.com/article/234-configuring-caching-plugins)
- [Magnific Popup](https://docs.uxthemes.com/article/420-magnific-popup)
- [Flatsome Pjax](https://docs.uxthemes.com/article/430-pjax)
- [Enable WP Debug](https://docs.uxthemes.com/article/228-enable-wp-debug)
- [Release Channel](https://docs.uxthemes.com/article/411-release-channel)
- [Web Console](https://docs.uxthemes.com/article/194-how-to-access-web-console)

### How-tos / Guides (43 articles)
- [Custom Product Page](https://docs.uxthemes.com/article/245-how-to-create-a-custom-product-page)
- [Flatsome Studio](https://docs.uxthemes.com/article/246-how-to-use-flatsome-studio)
- [Change Homepage](https://docs.uxthemes.com/article/231-how-to-change-homepage)
- [Responsive Sliders](https://docs.uxthemes.com/article/89-responsive-sliders-and-banners)
- [Scroll-To Link](https://docs.uxthemes.com/article/236-how-to-create-a-scroll-to-link)
- [Page Speed](https://docs.uxthemes.com/article/232-how-to-increase-page-speed)
- [Banner Video](https://docs.uxthemes.com/article/88-getting-ux-banner-video-to-work-in-all-browsers)
- [Lightbox Images](https://docs.uxthemes.com/article/230-how-to-open-images-and-galleries-in-a-lightbox)
- [Custom 404 Page](https://docs.uxthemes.com/article/307-how-to-create-custom-404-page-content)
- [Blog Page Setup](https://docs.uxthemes.com/article/243-how-to-setup-your-blog-page)
- [Size Guide Popup](https://docs.uxthemes.com/article/295-how-to-create-a-simple-size-guide-pop-up-lightbox)
- [Newsletter Signup](https://docs.uxthemes.com/article/67-how-to-add-newsletter-signup-manually)
- [Payment Icons Footer](https://docs.uxthemes.com/article/60-how-to-add-payment-icons-to-footer)
- [Translate Theme](https://docs.uxthemes.com/article/63-how-to-translate-the-theme)
- [Variation Swatches](https://docs.uxthemes.com/article/406-variation-swatches)
- [Additional Variation Images](https://docs.uxthemes.com/article/421-additional-variation-images)
- [Content on Top of Pages](https://docs.uxthemes.com/article/64-how-to-add-and-edit-content-on-top-of-pages)
- [Category Banner/Slider](https://docs.uxthemes.com/article/66-how-to-add-top-banner-to-a-category-page)
- [Catalog Mode](https://docs.uxthemes.com/article/61-how-to-enable-catalog-mode)
- [Wishlist Setup](https://docs.uxthemes.com/article/65-how-to-setup-wishlist-correctly)
- [Featured Products](https://docs.uxthemes.com/article/95-how-to-set-featured-products)
- [Shop Header UX Builder](https://docs.uxthemes.com/article/233-how-to-edit-shop-header-with-ux-builder)
- [Reorder Product Tabs](https://docs.uxthemes.com/article/314-how-to-reorder-tabs-on-the-single-product-page)
- [Product Variations](https://docs.uxthemes.com/article/79-product-variations)
- [Multiple Product Tabs](https://docs.uxthemes.com/article/93-how-to-add-multiple-product-tabs)
- [Favicon](https://docs.uxthemes.com/article/298-how-to-add-set-a-favicon)
- [Facebook Login](https://docs.uxthemes.com/article/62-how-to-enable-facebook-login-register)
- [Registration on My Account](https://docs.uxthemes.com/article/92-how-to-enable-registration)
- [Memory Limit](https://docs.uxthemes.com/article/81-increasing-the-wordpress-memory-limit)
- [Related Products](https://docs.uxthemes.com/article/91-how-related-products-works)
- [Remove Downloads](https://docs.uxthemes.com/article/203-how-to-remove-downloads-from-my-account)
- [Instagram Cache](https://docs.uxthemes.com/article/330-how-to-clear-instagram-element-cache)
- [Instagram API](https://docs.uxthemes.com/article/433-instagram-api-token)
- [Theme License](https://docs.uxthemes.com/article/407-theme-license-registration)
- [Admin Login for Support](https://docs.uxthemes.com/article/248-how-to-create-an-admin-login-for-the-support-team)
- [Disable Reviews](https://docs.uxthemes.com/article/84-how-to-disable-reviews)
- [Disable Admin Bar](https://docs.uxthemes.com/article/85-how-to-disable-admin-bar-for-customers)
- [Remove Comment Box](https://docs.uxthemes.com/article/78-remove-comment-box-from-page)

### Troubleshooting (19 articles)
- [Basic Troubleshooting](https://docs.uxthemes.com/article/349-basic-troubleshooting)
- [Shortcode Display Issues](https://docs.uxthemes.com/article/80-shortcode-doesnt-display-correctly)
- [Troubleshoot Flatsome](https://docs.uxthemes.com/article/170-troubleshoot-flatsome)
- [Missing Customizer/UX Builder](https://docs.uxthemes.com/article/202-missing-customizer-or-ux-builder)
- [Stylesheet Missing](https://docs.uxthemes.com/article/82-stylesheet-missing-error)
- [SSL Problems](https://docs.uxthemes.com/article/225-problems-with-ssl)
- [SVG Security](https://docs.uxthemes.com/article/196-svg-and-security)
- [Blurred Thumbnails](https://docs.uxthemes.com/article/87-fixing-blurred-featured-item-thumbnails)
- [WooCommerce Outdated Templates](https://docs.uxthemes.com/article/347-your-theme-flatsome-contains-outdated-copies-of-some-woocommerce-template-files)
- [Purchase Code Registered](https://docs.uxthemes.com/article/417-the-purchase-code-is-already-registered-on-another-site)

### Snippets (8 articles)
- [Payment Icons](https://docs.uxthemes.com/article/351-paymenticons)
- [Custom Product Page Filter](https://docs.uxthemes.com/article/389-custom-product-page)
- [Lightbox Close Button](https://docs.uxthemes.com/article/378-lightbox-close-button)
- [Infinite Scroll History](https://docs.uxthemes.com/article/316-infinite-scroll-disable-history)
- [Shop Page Controls](https://docs.uxthemes.com/article/350-woocommerce-shop-page-result-count-and-ordering-dropdown)
- [Follow Links](https://docs.uxthemes.com/article/429-follow-links)
- [Share Links](https://docs.uxthemes.com/article/428-share-links)
- [Flatsome Pjax](https://docs.uxthemes.com/article/430-pjax)

### WooCommerce (15 articles)
- Installing, General Settings, Product Settings, Tax Settings/Examples
- Shipping, Checkout, Account Settings
- Categories/Tags/Attributes, Simple/Variable/Grouped/External Products
- Downloadable Products, Coupons

### Plugin Compatibility (7 articles)
- WPML & Polylang, Yoast, Rank Math, SeoPress, UberMenu, Google Maps API
