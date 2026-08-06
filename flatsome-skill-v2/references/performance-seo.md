# Performance & SEO — Tốc độ trang + SEO cơ bản

> Checklist và scripts tối ưu sau khi hoàn thành thiết kế, trước khi bàn giao.
> Mục tiêu: PageSpeed ≥ 80 mobile / ≥ 90 desktop, SEO on-page cơ bản.

---

## 1. Performance Baseline Check

```bash
DOMAIN=https://example.com

# Đo thời gian load
curl -o /dev/null -s -w "
Time DNS:        %{time_namelookup}s
Time Connect:    %{time_connect}s
Time TTFB:       %{time_starttransfer}s
Time Total:      %{time_total}s
Size:            %{size_download} bytes
" "$DOMAIN/"

# PageSpeed score (cần API key hoặc dùng online)
# https://developers.google.com/speed/pagespeed/insights/?url=https://example.com
```

**Target:**
- TTFB (Time to First Byte): < 0.5s
- Total load time: < 3s
- PageSpeed mobile: ≥ 70
- PageSpeed desktop: ≥ 85

---

## 2. Image Optimization

### Trước khi upload ảnh

```bash
# Optimize PNG/JPG trên máy local (macOS)
# Cài: brew install imagemagick jpegoptim optipng

# Resize ảnh hero (không cần > 1920px wide)
convert input.jpg -resize 1920x -quality 82 hero-optimized.jpg

# Batch optimize JPG
find /tmp/images -name "*.jpg" -exec jpegoptim --max=82 {} \;

# Batch optimize PNG
find /tmp/images -name "*.png" -exec optipng -o5 {} \;

# Convert sang WebP (nếu VPS hỗ trợ)
find /tmp/images -name "*.jpg" -exec sh -c 'cwebp -q 82 "$1" -o "${1%.jpg}.webp"' _ {} \;
```

### WP-CLI: Regenerate thumbnails sau khi đổi kích thước

```bash
wp --path=$WPPATH media regenerate --yes --allow-root
```

---

## 3. Cache Plugin Setup

### LiteSpeed Cache (dùng với OLS/LiteSpeed server)

```bash
WPPATH=/path/to/wordpress

wp --path=$WPPATH plugin install litespeed-cache --activate --allow-root

# Cấu hình cơ bản qua WP-CLI
wp --path=$WPPATH eval "
// Bật page cache
\$conf = [
    'cache-enabled'      => true,
    'cache-ttl'          => 86400,
    'cache-login'        => false,
    'css-minify'         => true,
    'js-minify'          => true,
    'html-minify'        => true,
    'img-lazyload'       => true,
    'optm-css-font-async'=> true,
];
foreach (\$conf as \$k => \$v) {
    update_option('litespeed_' . \$k, \$v);
}
echo 'LiteSpeed Cache configured';
" --allow-root
```

### WP Rocket (nếu có license .zip)

```bash
# Upload WP Rocket .zip từ máy local
scp /path/to/wp-rocket.zip root@VPS_IP:/tmp/wp-rocket.zip
wp --path=$WPPATH plugin install /tmp/wp-rocket.zip --activate --allow-root
```

---

## 4. Flatsome Performance Settings

```bash
WPPATH=/path/to/wordpress

wp --path=$WPPATH eval "
\$opts = get_option('flatsome_options', []);

// Bật lazy load
\$opts['lazy_load_backgrounds'] = '1';

// Minify Flatsome CSS/JS
\$opts['minify_js']  = '1';
\$opts['minify_css'] = '1';

// Tắt unused features
\$opts['portfolio']  = '0';  // Nếu không dùng portfolio
\$opts['shop_quick_view'] = '0';  // Nếu không dùng WooCommerce

update_option('flatsome_options', \$opts);
echo 'Flatsome performance settings applied';
" --allow-root
```

---

## 5. WordPress Performance Tweaks

```bash
WPPATH=/path/to/wordpress

# Tắt emoji scripts (không cần thiết)
wp --path=$WPPATH eval "
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
" --allow-root 2>/dev/null

# Giảm revision history (mặc định unlimited)
wp --path=$WPPATH config set WP_POST_REVISIONS 3 --raw --allow-root

# Tắt heartbeat API khi không cần (giảm server load)
wp --path=$WPPATH eval "
wp_deregister_script('heartbeat');
" --allow-root 2>/dev/null
```

### Thêm vào child theme functions.php

```php
// Tối ưu WordPress cơ bản
add_action('init', function() {
    // Tắt emoji
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');

    // Tắt oEmbed (nếu không cần embed bên ngoài)
    // wp_deregister_script('wp-embed');

    // Remove RSD link
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator'); // Ẩn WP version
});

// Lazy load images native (HTML)
add_filter('wp_lazy_loading_enabled', '__return_true');

// Giảm heartbeat interval
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60; // Default 15s → 60s
    return $settings;
});
```

---

## 6. Font Loading Optimization

```css
/* Preconnect Google Fonts (thêm vào <head> qua wp_head hook) */
```

```php
// functions.php
add_action('wp_head', function() { ?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<?php }, 1);
```

```css
/* Font-display: swap — tránh FOIT (Flash of Invisible Text) */
/* Thêm vào URL Google Fonts: */
/* &display=swap */

/* Ví dụ đúng: */
/* https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap */
```

---

## 7. SEO Plugin Setup — Yoast SEO

```bash
WPPATH=/path/to/wordpress

wp --path=$WPPATH plugin install wordpress-seo --activate --allow-root

# Cấu hình cơ bản Yoast
wp --path=$WPPATH eval "
// Bật breadcrumbs
update_option('wpseo_internallinks', ['breadcrumbs-enable' => true]);

// Set separator
update_option('wpseo', array_merge(
    get_option('wpseo', []),
    ['separator' => 'sc-dash']
));

echo 'Yoast SEO configured';
" --allow-root
```

---

## 8. SEO On-Page Basics — Per Page

```bash
WPPATH=/path/to/wordpress
PAGE_ID=21  # ID trang cần set SEO

# Set Yoast meta title + description
wp --path=$WPPATH post meta update $PAGE_ID _yoast_wpseo_title \
  "Công ty ABC - Dịch vụ XYZ tại TP.HCM" --allow-root

wp --path=$WPPATH post meta update $PAGE_ID _yoast_wpseo_metadesc \
  "Công ty ABC chuyên cung cấp dịch vụ XYZ với hơn 10 năm kinh nghiệm. Liên hệ tư vấn miễn phí: 0912 345 678" \
  --allow-root

# Set focus keyword
wp --path=$WPPATH post meta update $PAGE_ID _yoast_wpseo_focuskw \
  "dịch vụ XYZ TP.HCM" --allow-root
```

### Batch set SEO cho tất cả pages

```bash
WPPATH=/path/to/wordpress

declare -A SEO=(
  ["21"]="Trang chủ | Công ty ABC - Dịch vụ XYZ|Mô tả ngắn 150-160 ký tự về trang chủ"
  ["25"]="Giới thiệu | Công ty ABC|Giới thiệu về công ty, lịch sử, sứ mệnh"
  ["28"]="Dịch vụ | Công ty ABC|Danh sách dịch vụ cung cấp"
  ["32"]="Liên hệ | Công ty ABC|Thông tin liên hệ, địa chỉ, số điện thoại"
)

for page_id in "${!SEO[@]}"; do
  IFS='|' read -r title desc <<< "${SEO[$page_id]}"
  wp --path=$WPPATH post meta update $page_id _yoast_wpseo_title "$title" --allow-root
  wp --path=$WPPATH post meta update $page_id _yoast_wpseo_metadesc "$desc" --allow-root
  echo "SEO set for page $page_id"
done
```

---

## 9. Sitemap & Google Search Console

```bash
WPPATH=/path/to/wordpress

# Bật Yoast sitemap
wp --path=$WPPATH eval "
update_option('wpseo', array_merge(
    get_option('wpseo', []),
    ['enable_xml_sitemap' => true]
));
echo 'Sitemap enabled: https://domain.com/sitemap_index.xml';
" --allow-root

# Ping Google về sitemap
curl -s "https://www.google.com/ping?sitemap=https://domain.com/sitemap_index.xml" \
  -o /dev/null -w "Google ping: %{http_code}\n"
```

**Submit lên Google Search Console:**
1. Truy cập https://search.google.com/search-console
2. Add property → Domain → xác minh
3. Sitemaps → Submit → `sitemap_index.xml`

---

## 10. Performance QA Script (chạy trước bàn giao)

```bash
WPPATH=/path/to/wordpress
DOMAIN=$(wp --path=$WPPATH option get siteurl --allow-root)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  PERFORMANCE & SEO QA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cache plugin active?
CACHE=$(wp --path=$WPPATH plugin list --status=active --allow-root | grep -E "litespeed|wp-rocket|w3tc|wp-super-cache")
[ -n "$CACHE" ] && echo "✅ Cache plugin: $CACHE" || echo "❌ No cache plugin"

# Yoast active?
YOAST=$(wp --path=$WPPATH plugin list --status=active --allow-root | grep "wordpress-seo")
[ -n "$YOAST" ] && echo "✅ Yoast SEO active" || echo "⚠️  No SEO plugin"

# Sitemap exists?
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/sitemap_index.xml")
[ "$STATUS" = "200" ] && echo "✅ Sitemap: $DOMAIN/sitemap_index.xml" || echo "❌ Sitemap not found ($STATUS)"

# SSL check
SSL=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN" --max-time 5)
[[ "$DOMAIN" == https* ]] && echo "✅ SSL: HTTPS active" || echo "❌ SSL not configured"

# TTFB
TTFB=$(curl -o /dev/null -s -w "%{time_starttransfer}" "$DOMAIN/")
echo "⏱  TTFB: ${TTFB}s $(awk "BEGIN{print ($TTFB < 0.5) ? \"✅\" : ($TTFB < 1.0) ? \"⚠️\" : \"❌\"}")"

# Robots.txt
BOT=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/robots.txt")
[ "$BOT" = "200" ] && echo "✅ robots.txt exists" || echo "⚠️  robots.txt missing"

# Check meta description on homepage
META=$(curl -s "$DOMAIN" | grep -o '<meta name="description" content="[^"]*"' | head -1)
[ -n "$META" ] && echo "✅ Meta description set" || echo "❌ Meta description missing"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Run PageSpeed: https://pagespeed.web.dev/report?url=$DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

---

## Performance Quick Wins (5 phút)

```
1. Kích hoạt LiteSpeed/cache plugin         → +10-20 điểm PageSpeed
2. Bật lazy load ảnh                        → -1-2s load time
3. Resize ảnh hero không quá 1920px         → -200-500KB
4. Thêm &display=swap vào Google Fonts URL  → loại bỏ render-blocking
5. Preconnect fonts.googleapis.com          → -100-200ms DNS lookup
6. Tắt emoji WordPress                      → -20KB JS
7. Giới hạn post revisions về 3            → giảm database size
```
