# Flatsome Theme Complete Reference

> Source: Flatsome theme source code + [Official Docs](https://docs.uxthemes.com/)
> Verified against: Flatsome 3.18+

## 1. Complete Shortcode Registry

All shortcodes registered via `add_shortcode()` in `flatsome/inc/shortcodes/`:

### Layout Shortcodes

| Shortcode | File | Description |
|-----------|------|-------------|
| `[section]` | sections.php | Page section wrapper with bg, padding, parallax |
| `[row]` | row.php | Grid row container |
| `[row_inner]` | row.php | Inner row (for nesting inside `[col]`) |
| `[row_inner_1]` | row.php | Deep nested row level 1 |
| `[col]` | row.php | Grid column |
| `[col_inner]` | row.php | Inner column (for use inside `[row_inner]`) |
| `[col_inner_1]` | row.php | Deep nested column level 1 |
| `[gap]` | gap.php | Vertical spacing |
| `[divider]` | titles_dividers.php | Horizontal divider line |
| `[title]` | titles_dividers.php | Section title with divider |

### Content Shortcodes

| Shortcode | File | Description |
|-----------|------|-------------|
| `[ux_text]` | ux_text.php | Text block with font size/color controls |
| `[ux_html]` | ux_html.php | Raw HTML container |
| `[ux_image]` | ux_image.php | Image with lightbox, hover, parallax |
| `[ux_video]` | ux_video.php | Video embed |
| `[ux_banner]` | ux_banner.php | Full-width banner with text overlay |
| `[text_box]` | text_box.php | Positioned text layer inside banner |
| `[featured_box]` | featured_box.php | Icon box (⚠️ requires image ID, NOT icon class) |
| `[testimonial]` | testimonials.php | Testimonial with stars, name, company |
| `[lightbox]` | lightbox.php | Lightbox popup container |
| `[message_box]` | messages.php | Alert/message box |

### Interactive Shortcodes

| Shortcode | File | Description |
|-----------|------|-------------|
| `[button]` | buttons.php | CTA button with icon support |
| `[phone]` | buttons.php | Phone number button |
| `[header_button]` | buttons.php | Header outline button |
| `[video_button]` | buttons.php | Play video button (circle) |
| `[facebook_login_button]` | buttons.php | Facebook login |
| `[tabgroup]` | tabs.php | Tab container |
| `[tabgroup_vertical]` | tabs.php | Vertical tab container |
| `[tab]` | tabs.php | Single tab item |
| `[accordion]` | accordion.php | Accordion container |
| `[accordion-item]` | accordion.php | Single accordion item |
| `[scroll_to]` | scroll_to.php | Smooth scroll link |

### Slider & Gallery

| Shortcode | File | Description |
|-----------|------|-------------|
| `[ux_slider]` | ux_slider.php | Flickity-based slider/carousel |
| `[ux_gallery]` | ux_gallery.php | Image gallery grid |
| `[ux_banner_grid]` | ux_banner_grid.php | Banner grid layout |
| `[col_grid]` | ux_banner_grid.php | Banner grid column |

### Commerce & Product

| Shortcode | File | Description |
|-----------|------|-------------|
| `[ux_products]` | ux_products.php | Product grid |
| `[ux_bestseller_products]` | ux_products.php | Bestsellers |
| `[ux_featured_products]` | ux_products.php | Featured products |
| `[ux_sale_products]` | ux_products.php | Sale products |
| `[ux_latest_products]` | ux_products.php | Latest products |
| `[ux_custom_products]` | ux_products.php | Custom product query |
| `[product_lookbook]` | ux_products.php | Lookbook style products |
| `[ux_products_list]` | ux_products_list.php | Product list layout |
| `[ux_price_table]` | price_table.php | Pricing table |
| `[bullet_item]` | price_table.php | Pricing table feature item |
| `[product_flip]` | product_flip.php | Product flip animation |
| `[ux_hotspot]` | ux_hotspot.php | Image hotspot |

### Utility Shortcodes

| Shortcode | File | Description |
|-----------|------|-------------|
| `[ux_stack]` | ux_stack.php | Stack layout container |
| `[ux_menu]` | ux_menu.php | WordPress menu |
| `[ux_menu_title]` | ux_menu_title.php | Menu section title |
| `[ux_menu_link]` | ux_menu_link.php | Single menu link |
| `[ux_sidebar]` | ux_sidebar.php | WordPress sidebar widget area |
| `[ux_pages]` | ux_pages.php | Page grid |
| `[ux_payment_icons]` | ux_payment_icons.php | Payment method icons |
| `[ux_instagram_feed]` | ux_instagram_feed.php | Instagram feed |
| `[blog_posts]` | blog_posts.php | Blog post grid |
| `[team_member]` | team_members.php | Team member card |
| `[portfolio]` | portfolio.php | Portfolio grid |
| `[share]` | share_follow.php | Social share buttons |
| `[follow]` | share_follow.php | Social follow links |
| `[map]` | google_maps.php | Google Maps embed |
| `[page_header]` | page_header.php | Page header |
| `[ux_logo]` | ux_logo.php | Logo image |
| `[search]` | search.php | Search form |
| `[ux_nav]` | ux_nav.php | Navigation element |
| `[uxtrans]` | ux_translation.php | Translation conditional |
| `[uxlang]` | ux_translation.php | Language conditional |

---

## 2. Key Shortcode Attributes (from source code)

### `[section]`
```
bg, bg_size, bg_color, bg_overlay, bg_overlay__sm, bg_overlay__md, bg_pos
parallax, effect, dark, mask
padding, padding__sm, padding__md
height, height__sm, height__md, margin
class, visibility, sticky, label, id
video_mp4, video_ogg, video_webm, video_sound, video_loop, youtube, video_visibility
divider_top, divider_top_height, divider_top_fill, divider_top_flip
divider, divider_height, divider_fill, divider_flip
border, border_color, border_margin, border_radius, border_style, border_hover
scroll_for_more, loading
```

### `[row]`
```
style (collapse|small|normal|large), v_align (top|middle|bottom|equal)
h_align (left|center|right), col_style (default|solid|dashed|shade)
col_bg, depth, depth_hover, class, visibility, id
```

### `[col]`
```
span (1-12), span__md, span__sm
align (left|center|right), align__md, align__sm
class, visibility, padding, margin
bg_color, bg_radius, depth, depth_hover
animate, animate_delay
```

### `[button]`
```
text, style (primary|outline|link|shade|bevel)
color (primary|secondary|white|success|alert|custom hex)
size (xsmall|small|medium|large|xlarge)
radius, border, padding, letter_case
icon, icon_pos (left|right), icon_reveal
link, target (_self|_blank), rel
animate, depth, depth_hover
expand (true = full width), block
tooltip, class, visibility, id
```

### `[featured_box]` (UX Builder name: "Icon Box")
```
img (MEDIA LIBRARY ID — integer, NOT icon class!)
img_width (px, default 60)
inline_svg (true|false)
pos (top|center|left|right)
title, title_small
icon_color (colorpicker)
icon_border (0-10px)
font_size (small|medium|large|xlarge)
margin, tooltip
link, target, rel
class, visibility
```
> ⚠️ `[featured_box]` does NOT support Font Awesome icons or icon class names.

### `[testimonial]`
```
name, company
stars (0-5, default 5)
image (MEDIA LIBRARY ID)
image_width (px, default 80)
pos (left|center|right|top)
font_size (small|medium|large|xlarge)
text_align
link, class, visibility
```

### `[ux_banner]`
```
height, height__sm, height__md
bg (image ID), bg_size (large|original|cover|contain)
bg_color, bg_overlay, bg_overlay__sm, bg_overlay__md, bg_pos
parallax (0-10), parallax_style
video_mp4, video_ogg, video_webm, video_sound, youtube, video_visibility
hover, hover_alt, effect, slide_effect
dark, sticky, container_width (full-width|default)
link, target, rel
animate, animation_duration
divider_top, divider, divider_height, divider_fill
border, border_color, border_radius, border_style
class, visibility, alt
```

### `[text_box]` (inside `[ux_banner]`)
```
position_x (0-100), position_x__sm, position_x__md
position_y (0-100), position_y__sm, position_y__md
width (%), width__sm, width__md
text_align (left|center|right)
text_color (light|dark)
padding, bg, depth
animate, animate_delay
class, visibility
```

### `[ux_text]`
```
font_size, font_size__md, font_size__sm
text_align (left|center|right)
text_color
class, visibility
```

### `[ux_image]`
```
id (MEDIA LIBRARY ID)
image_size (thumbnail|medium|large|full)
width (%), margin
height (enables image-cover mode)
animate, animate_delay
lightbox (true|false), lightbox_image_size, lightbox_caption
image_overlay (rgba color), image_hover, image_hover_alt
depth, depth_hover, parallax
position_x, position_y (0-100)
link, target, rel
caption (true|false), image_title
class, visibility
```

### `[ux_slider]`
```
type (slide|fade), timer (ms, default 6000)
auto_slide (true|false), auto_height (true|false)
columns (number), slide_width, slide_align (center|left)
arrows (true|false), bullets (true|false)
bullet_style, nav_style (circle|...), nav_color (light|dark), nav_size, nav_pos
infinitive (true|false), freescroll (true|false)
pause_hover (true|false), draggable (true|false)
parallax (0-10), rtl (true|false)
bg_color, margin, margin__md, margin__sm
style (normal|...), hide_nav
class, visibility
```

### `[tabgroup]`
```
style (line|tabs|pills), align (left|center|right)
type (horizontal|vertical)
nav_style (uppercase|...), nav_size (normal|small|large)
history (true|false), event (click|hover)
title, class, visibility
```

### `[tab]`
```
title, title_small
```

### `[accordion]`
```
auto_open, open (item number to open), title, class
```

### `[accordion-item]`
```
title, id, class
```

### `[ux_price_table]`
```
title, price, description
featured (true|false)
radius, color (light|dark), bg_color
depth, depth_hover
class, visibility
```

### `[bullet_item]`
```
text, tooltip, enabled (true|false)
```

### `[lightbox]`
```
id (trigger ID, matched by #id in links)
width, padding
auto_open (true|false), auto_timer (ms)
auto_show (always|once)
class
```

### `[map]`
```
address, height, width, zoom
style, scrollwheel, controls
```

---

## 3. Page Templates Available

Flatsome includes these page templates (from `page-*.php`):

| Template | File | Use Case |
|----------|------|----------|
| Default | `page.php` | Standard page with title + sidebar options |
| Blank – No Header/Footer | `page-blank.php` | Truly blank page |
| Blank – Landing Page | `page-blank-landingpage.php` | Landing page (keeps scripts) |
| Blank – Title Center | `page-blank-title-center.php` | Centered page title |
| Blank – Sub Nav Vertical | `page-blank-sub-nav-vertical.php` | Vertical sub-navigation |
| Left Sidebar | `page-left-sidebar.php` | Content + left sidebar |
| Right Sidebar | `page-right-sidebar.php` | Content + right sidebar |
| Transparent Header | `page-transparent-header.php` | Transparent dark header |
| Transparent Header Light | `page-transparent-header-light.php` | Transparent light header |
| Single Page Nav | `page-single-page-nav.php` | One-page navigation |
| My Account | `page-my-account.php` | WooCommerce account page |

---

## 4. Theme Hooks (Actions)

Key action hooks for developers:

### Page Structure
```php
flatsome_before_header    // Before header output
flatsome_after_header     // After header (after hero, before content)
flatsome_before_page      // Before page content wrapper
flatsome_after_page       // After page content wrapper
flatsome_before_page_content  // Before the_content()
flatsome_after_page_content   // After the_content()
flatsome_before_footer    // Before footer
flatsome_after_footer     // After footer
flatsome_after_body_open  // Right after <body> tag
```

### Blog
```php
flatsome_before_blog      // Before blog archive loop
flatsome_after_blog       // After blog archive loop
flatsome_blog_post_before // Before individual blog post in loop
flatsome_blog_post_after  // After individual blog post in loop
flatsome_before_comments  // Before comments section
```

### WooCommerce Product
```php
flatsome_before_product_page    // Before single product
flatsome_after_product_page     // After single product
flatsome_before_product_images  // Before product gallery
flatsome_after_product_images   // After product gallery
flatsome_before_product_sidebar // Before product sidebar
flatsome_product_title          // Product title area
flatsome_product_box_tools_top  // Top of product box overlay
flatsome_product_box_tools_bottom  // Bottom of product box overlay
flatsome_product_box_actions    // Product box action buttons
flatsome_products_before        // Before product grid
flatsome_products_after         // After product grid
flatsome_sale_flash             // Sale badge
```

### Cart & Checkout
```php
flatsome_cart_sidebar               // Cart sidebar content
flatsome_before_mini_cart_total     // Before mini cart total (3.18+)
flatsome_after_mini_cart_contents   // After mini cart contents (3.18+)
```

### Header
```php
flatsome_header_elements    // Header element rendering
flatsome_header_wrapper     // Header wrapper
flatsome_header_background  // Header background
```

---

## 5. Theme Filters

Key filters for customization:

```php
flatsome_header_class          // Modify header CSS classes
flatsome_main_class            // Modify main content classes
flatsome_sidebar_class          // Modify sidebar classes
flatsome_product_box_classes    // Product box CSS classes
flatsome_product_labels         // Product labels (sale, new, etc.)
flatsome_follow_links           // Social follow link URLs
flatsome_share_links            // Social share link URLs
flatsome_payment_icons          // Payment icons array
flatsome_text_formats           // Text format options
flatsome_viewport_meta          // Viewport meta tag
flatsome_maintenance_mode       // Enable maintenance mode
flatsome_disable_mini_cart      // Disable mini cart
flatsome_show_buy_now_button    // Show/hide buy now button
flatsome_ajax_search_post_type  // Search post types
flatsome_ajax_search_query      // Modify search query
flatsome_icon                   // Custom icon rendering
```

---

## 6. CSS Architecture

### Custom CSS Locations (Priority Order)
1. **Child Theme `style.css`** — Best for persistent, version-controlled CSS
2. **Customizer → Advanced → Custom CSS** — Quick overrides, stored in DB
3. **UX Builder page-level CSS** — Per-page inline styles
4. **`<style>` inside `[ux_html]`** — Shortcode-scoped styles

### Key CSS Selectors
```css
/* Section */
.section { }
.section-content { }
.section-bg { }

/* Row & Column */
.row { }
.col { }
.col-inner { }

/* Banner */
.banner { }
.banner-inner { }
.banner-layers { }

/* Featured Box (Icon Box) */
.icon-box { }
.icon-box-img { }
.icon-box-text { }
.featured-box { }

/* Testimonial */
.testimonial-box { }
.testimonial-text { }
.testimonial-meta { }
.testimonial-name { }
.testimonial-company { }

/* Button */
.button { }
.button.primary { }
.button.is-outline { }
.button.is-large { }

/* Tabs */
.tabbed-content { }
.nav-line { }
.tab-panels { }

/* Accordion */
.accordion { }
.accordion-item { }
.accordion-title { }
.accordion-inner { }

/* Slider */
.slider-wrapper { }
.slider { }
.flickity-slider { }

/* Price Table */
.pricing-table { }
.pricing-table-header { }
.pricing-table-items { }

/* Product Box */
.product-small { }
.product-small .box-image { }
.product-small .box-text { }
```

### Responsive Breakpoints
```css
/* Flatsome breakpoints */
@media (max-width: 849px) { }  /* Tablet */
@media (max-width: 549px) { }  /* Mobile */
```

### Custom Fonts
```css
/* Base font */
body { font-family: "Custom Font", sans-serif; }

/* Heading font */
h1,h2,h3,h4,h5,h6, .heading-font { font-family: "Custom Font", sans-serif; }

/* Navigation font */
.nav > li > a { font-family: "Custom Font", sans-serif; }

/* Alt font */
.alt-font { font-family: "Custom Font", sans-serif; }
```
> Disable Google Fonts loading: Theme Options → Style → Typography

---

## 7. UX Builder for Custom Post Types

Enable UX Builder for any CPT by adding to `functions.php`:
```php
// The CPT template must use the_content()
add_post_type_support( 'your_cpt', 'editor' );
```

---

## 8. Flatsome Studio

Pre-built page layouts accessible via:
**Pages → Add New → Edit with UX Builder → Studio tab**

Provides ready-made sections: headers, about, services, portfolios, testimonials, pricing, contact, footers.

---

## 9. Lightbox System

```
[button text="Open" link="#my-lightbox"]
[lightbox id="my-lightbox" width="600px" padding="20px"]
  Content here...
[/lightbox]
```

Auto-open lightbox:
```
[lightbox auto_open="true" auto_timer="3000" auto_show="once" id="popup" width="600px"]
  Popup content...
[/lightbox]
```
- `auto_show="always"` — shows every visit
- `auto_show="once"` — shows only once per visitor

---

## 10. Troubleshooting

### Common Issues
1. **Shortcode renders as text** → Check if shortcode name is correct (e.g., `[featured_box]` not `[icon_box]`)
2. **HTML comments break shortcodes** → WordPress parses `[shortcode]` inside `<!-- -->` comments
3. **Nested rows crash UX Builder** → Use `[row_inner]` + `[col_inner]` for nesting, not `[row]` + `[col]`
4. **Smart/fancy quotes break attributes** → Ensure straight quotes `"` in all shortcode attributes
5. **Background images not loading** → Check if lazy loading is enabled; use `bg_size="large"` or upload correct size
6. **Cache issues** → Clear cache via Flatsome → Advanced → Clear Cache, also check caching plugins

### Caching Plugins Configuration
- Exclude UX Builder pages from caching
- Exclude dynamic parts (mini cart, account links) from page cache
- Use fragment caching for WooCommerce elements

---

## 13. Page Templates Reference (Verified from Source Code)

| Template File | Template Name | Header | Footer | Use Case |
|--------------|---------------|--------|--------|----------|
| `page.php` | Default | ✅ | ✅ | Standard page |
| `page-blank.php` | Page - Full Width | ✅ | ✅ | Full width, NO sidebar (misleading name!) |
| `page-blank-landingpage.php` | Page - No Header / No Footer | ❌ | ❌ | True blank landing pages |
| `page-transparent-header-light.php` | Transparent Header Light | ✅ transparent light | ✅ | Landing with nav overlay, light text |
| `page-transparent-header.php` | Transparent Header | ✅ transparent dark | ✅ | Landing with nav overlay, dark text |

> ⚠️ WARNING: `page-blank.php` is NOT blank — it still includes `get_header()` and `get_footer()`!
> For true no-header/no-footer, use `page-blank-landingpage.php`.

---

## 14. Critical Nesting Rules

```
✅ VALID NESTING:
[row] > [col] > content
[col] > [row_inner] > [col_inner] > content
[col_inner] > [ux_text] / [ux_html] / [gap] / [button]

❌ INVALID NESTING (shortcode tags render as visible text!):
[col_inner] > [col] → BROKEN
[col_inner] > [row] → BROKEN
[col] > [col] → BROKEN

Max depth: row > col > row_inner > col_inner (2 levels only)
If you need card styling inside col_inner, use [ux_text] + CSS class, NOT [col]
```

---

## 15. [title] Shortcode Gotcha

- Flatsome `[title]` generates "Lorem ipsum dolor sit amet..." placeholder when content doesn't match expected format
- **ALWAYS use `[ux_text]<h2>Your heading</h2>[/ux_text]` for custom headings**
- `[title]` is only reliable for simple centered headings with built-in divider styles
- Never pass complex HTML or inline styles via `[title]` attributes

---

## 16. Section ID Override

Flatsome `[section id="my-custom-id"]` gets **overridden** to `id="section_XXXXXXXXX"` (random number).

**Workaround — inject anchor divs via JavaScript:**
```php
add_action('wp_footer', function() {
    if (!is_page(PAGE_ID)) return;
    ?>
    <script>
    (function(){
        var map = { 'anchor-id': 'Heading text to match' };
        document.querySelectorAll('section.section').forEach(function(sec){
            var h = sec.querySelector('h2');
            if (!h) return;
            Object.keys(map).forEach(function(id){
                if (h.textContent.trim().indexOf(map[id]) === 0) {
                    var anchor = document.createElement('div');
                    anchor.id = id;
                    anchor.style.cssText = 'position:relative;top:-80px';
                    sec.prepend(anchor);
                }
            });
        });
    })();
    </script>
    <?php
});
```

---

## 17. CSS Scoping for Page-Specific Styles

```
❌ body.page-slug-{slug} → DOES NOT EXIST by default in WordPress
✅ body.page-id-{ID} → Always reliable
✅ body.page-template-{template}-php → Works but verbose

Always verify actual body class via JS: document.body.className
```

**CSS Cache Busting (add to child functions.php):**
```php
add_action('wp_enqueue_scripts', function() {
    $f = get_stylesheet_directory() . '/style.css';
    $v = file_exists($f) ? filemtime($f) : time();
    wp_deregister_style('flatsome-child');
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), array(), $v);
}, 999);
```

---

## 18. Flatsome Tabs — Known Issues & Fixes

**Issue 1: Inactive panels occupy space**
```css
.panel:not(.active) {
    height: 0 !important; min-height: 0 !important;
    overflow: hidden !important; padding: 0 !important;
    margin: 0 !important; opacity: 0;
}
.panel.active { height: auto !important; opacity: 1; }
```

**Issue 2: Tab click scrolls page**
- Flatsome JS auto-scrolls to tab panel on click
- Fix: override click handler with `e.preventDefault()` + manual class toggle via `wp_footer`

**Issue 3: Tab icons**
- CSS `::before` on `.nav li:nth-child(N) a::before` with `font-family: "Font Awesome 5 Free"`

---

## 19. Menu Swap per Page (Flatsome-specific)

```php
add_filter('wp_nav_menu_args', function($args) {
    if (is_page(PAGE_ID)) {
        if (isset($args['theme_location']) &&
            in_array($args['theme_location'], array('primary', 'primary_mobile'))) {
            $args['menu'] = 'Custom Menu Name';
            unset($args['theme_location']); // CRITICAL!
        }
    }
    return $args;
});
```
> ⚠️ You MUST `unset($args['theme_location'])` — without this, Flatsome ignores the menu override.

---

## 20. Transparent Header Color Fix

```css
body.page-id-{ID} .header-wrapper .header-nav-main li > a,
body.page-id-{ID} .header .nav > li > a,
body.page-id-{ID} .logo a {
    color: #334155 !important; opacity: 1 !important;
}
body.page-id-{ID} .header-wrapper {
    background: #fff !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
```

---

## 21. Icons Strategy

| Priority | Method | When to Use |
|----------|--------|-------------|
| 1 | Font Awesome `<i class="fas fa-icon">` | If FA plugin installed |
| 2 | Flatsome built-in `icon="icon-check"` | For [button], [featured_box] |
| 3 | SVG inline in [ux_html] | Complex custom icons |
| 4 | Unicode emoji | ❌ NEVER for production |

---

## 22. Remote Deployment Priority Order

```
1. SSH + WP-CLI → fastest, most reliable (seconds)
2. PHP script via HTTP → backup if no SSH
3. WP REST API → if available and not disabled
4. Browser automation → LAST RESORT, extremely slow for large content
5. NEVER paste 20KB+ content via browser JS — use SSH upload + wp post update
```

**SSH Quick Commands:**
```bash
# Upload CSS
cat /tmp/new-css.css >> /path/to/child-theme/style.css

# Update page content
wp post update {ID} /tmp/content.txt --allow-root

# Set template
wp post meta update {ID} _wp_page_template template-file.php --allow-root

# Create menu + items
wp menu create "Menu Name" --allow-root
wp menu item add-custom "Menu Name" "Label" "#anchor" --allow-root

# Flush cache
wp cache flush --allow-root
```
