# Pre-Flight Checklist — Trước khi code bất cứ thứ gì

> Chạy checklist này TRƯỚC KHI viết shortcode đầu tiên.  
> Mục đích: đảm bảo môi trường WP/Flatsome sẵn sàng để không phải debug môi trường trong lúc build.

---

## Chạy toàn bộ pre-flight trong 1 lệnh

```bash
WPPATH=/path/to/wordpress   # LocalWP hoặc /home/admin/domains/example.com/public_html

wp --path=$WPPATH eval '
echo "=== PRE-FLIGHT CHECKLIST ===\n";

// 1. WordPress version
echo "WP version:     " . get_bloginfo("version") . "\n";

// 2. Active theme
$theme = wp_get_theme();
echo "Active theme:   " . $theme->get("Name") . " v" . $theme->get("Version") . "\n";
$parent = $theme->parent();
echo "Parent theme:   " . ($parent ? $parent->get("Name") . " v" . $parent->get("Version") : "none") . "\n";

// 3. Child theme check
$is_child = is_child_theme();
echo "Child theme:    " . ($is_child ? "YES ✓" : "NO — WARNING: create child theme first") . "\n";

// 4. Flatsome version
$flatsome_opts = get_option("flatsome_options", []);
$fver = isset($flatsome_opts["flatsome_version"]) ? $flatsome_opts["flatsome_version"] : "unknown";
echo "Flatsome ver:   " . $fver . "\n";

// 5. Permalink structure
$perma = get_option("permalink_structure");
echo "Permalinks:     " . ($perma ? $perma . " ✓" : "Plain — NEEDS FIX") . "\n";

// 6. Plugins
$plugins = get_option("active_plugins", []);
$needed = ["contact-form-7", "advanced-custom-fields", "classic-editor", "wpcode-lite", "woocommerce"];
echo "\nPlugins status:\n";
foreach ($needed as $p) {
    $active = array_filter($plugins, fn($pl) => strpos($pl, $p) !== false);
    echo "  " . $p . ": " . (count($active) ? "active ✓" : "not installed") . "\n";
}

// 7. Upload dir writable
$upload = wp_upload_dir();
echo "\nUploads dir:    " . ($upload["basedir"]) . "\n";
echo "Writable:       " . (is_writable($upload["basedir"]) ? "YES ✓" : "NO — check permissions") . "\n";

// 8. UX Blocks
$blocks = get_posts(["post_type" => "blocks", "numberposts" => -1, "post_status" => "publish"]);
echo "\nUX Blocks:      " . count($blocks) . " blocks\n";
foreach ($blocks as $b) echo "  [" . $b->ID . "] " . $b->post_title . "\n";

// 9. Front page
$show = get_option("show_on_front");
$front = get_option("page_on_front");
echo "\nFront page:     " . $show;
if ($show === "page" && $front) {
    $p = get_post($front);
    echo " → [" . $front . "] " . ($p ? $p->post_title : "not found");
}
echo "\n";

// 10. Site URL
echo "Site URL:       " . get_option("siteurl") . "\n";
echo "Home URL:       " . get_option("home") . "\n";
' --allow-root 2>&1
```

---

## Fix nhanh các vấn đề phổ biến

### Permalinks không đúng
```bash
wp --path=$WPPATH rewrite structure '/%postname%/' --allow-root
wp --path=$WPPATH rewrite flush --hard --allow-root
```

### Child theme chưa có
```bash
THEMES=$WPPATH/wp-content/themes
mkdir -p $THEMES/flatsome-child
cat > $THEMES/flatsome-child/style.css << 'CSS'
/*
Theme Name:   Flatsome Child
Template:     flatsome
Version:      1.0.0
*/
CSS
cat > $THEMES/flatsome-child/functions.php << 'PHP'
<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('flatsome-parent', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), ['flatsome-parent'],
        filemtime(get_stylesheet_directory() . '/style.css'));
});
PHP
wp --path=$WPPATH theme activate flatsome-child --allow-root
```

### Plugins thiếu
```bash
wp --path=$WPPATH plugin install contact-form-7 --activate --allow-root
wp --path=$WPPATH plugin install advanced-custom-fields --activate --allow-root
wp --path=$WPPATH plugin install classic-editor --activate --allow-root
wp --path=$WPPATH plugin install wpcode-lite --activate --allow-root
```

### Upload dir không writable
```bash
# VPS (DirectAdmin)
chown -R admin:admin $WPPATH/wp-content/uploads
chmod -R 755 $WPPATH/wp-content/uploads

# LocalWP
chmod -R 755 /path/to/localwp/site/app/public/wp-content/uploads
```

### UX Blocks không hiện trong admin (post_type sai)
```bash
# Kiểm tra
wp --path=$WPPATH post list --post_type=ux_block --post_status=any --allow-root

# Fix: đổi ux_block → blocks
wp --path=$WPPATH eval '
global $wpdb;
$n = $wpdb->query("UPDATE {$wpdb->posts} SET post_type=\"blocks\" WHERE post_type=\"ux_block\"");
echo "Fixed: $n blocks\n";
wp_cache_flush();
' --allow-root
```

---

## Checklist dạng bảng

```
□ WP version ≥ 6.0
□ Flatsome version ≥ 3.15
□ flatsome-child theme active (KHÔNG phải flatsome trực tiếp)
□ Permalink = /%postname%/
□ Upload directory writable
□ Contact Form 7 installed (nếu site có form)
□ ACF installed (nếu cần custom fields/product specs)
□ Flatsome logo đã set (không phải chỉ WordPress site_logo)
□ Front page đã set đúng (Settings > Reading)
□ Không có plugin conflict (W3TC/WP Rocket cache đã purge)
□ SSL (https) hoạt động nếu deploy lên VPS
```

---

## Pre-flight sau khi deploy (post-deploy verification)

Sau mỗi lần deploy page/section, chạy:

```bash
WPPATH=/path/to/wordpress
PAGE_SLUG="slug-of-page"

# Flush cache
wp --path=$WPPATH cache flush --allow-root

# Check HTTP
curl -s -o /dev/null -w "%{http_code}" "https://domain.com/$PAGE_SLUG/"

# Check page exists và có content
wp --path=$WPPATH post list --post_status=publish --post_type=page \
  --fields=ID,post_title,post_name --allow-root | grep "$PAGE_SLUG"

# Check CSS enqueued
curl -s "https://domain.com/$PAGE_SLUG/" | grep -o "child.*\.css[^'\"]*"

# Check no raw shortcodes in HTML
SHORTS=$(curl -s "https://domain.com/$PAGE_SLUG/" | grep -c '\[section\]\|\[row\]\|\[col ')
[ "$SHORTS" = "0" ] && echo "✓ No raw shortcodes" || echo "✗ $SHORTS unrendered shortcodes"
```
