# Flatsome Fresh Install — Từ đầu đến sẵn sàng thiết kế

> Quy trình chuẩn khi nhận dự án mới: cài WordPress → upload Flatsome .zip →
> nhập license → child theme → plugins → sẵn sàng build.
> Áp dụng cho cả LocalWP (dev) và VPS (production).

---

## Tổng quan quy trình

```
1. WordPress core install
2. Upload Flatsome .zip (file mua từ ThemeForest)
3. Activate Flatsome + nhập license key
4. Tạo flatsome-child theme
5. Cài plugins cần thiết
6. Cấu hình cơ bản (permalink, timezone, logo)
7. Kiểm tra UX Builder hoạt động
→ Sẵn sàng thiết kế
```

---

## Bước 1 — WordPress Core Install

### VPS (có SSH)

```bash
WPPATH=/home/admin/domains/example.com/public_html
DOMAIN=example.com
DB_NAME=site_db
DB_USER=site_user
DB_PASS='StrongPass@2026'
ADMIN_USER=admin
ADMIN_PASS='AdminPass@2026!'
ADMIN_EMAIL=admin@example.com

# Tạo database
mysql -u root << SQL
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SQL

# Download WordPress
cd $WPPATH
wp core download --locale=vi --allow-root

# Config + Install
wp config create \
  --dbname=$DB_NAME \
  --dbuser=$DB_USER \
  --dbpass="$DB_PASS" \
  --dbhost=localhost \
  --dbcharset=utf8mb4 \
  --allow-root

wp core install \
  --url="https://$DOMAIN" \
  --title="$DOMAIN" \
  --admin_user=$ADMIN_USER \
  --admin_password="$ADMIN_PASS" \
  --admin_email=$ADMIN_EMAIL \
  --skip-email \
  --allow-root

echo "✅ WordPress installed at https://$DOMAIN"
```

### LocalWP

Dùng Local app → **+ Create a new site** → điền tên → chọn PHP version → Done.

---

## Bước 2 — Upload Flatsome .zip

### Cách 1: WP-CLI từ file local (VPS qua SSH)

```bash
# Upload file từ máy local lên VPS
scp /path/to/flatsome.zip root@VPS_IP:/tmp/flatsome.zip

# Cài theme từ file
wp theme install /tmp/flatsome.zip --activate --allow-root

# Kiểm tra
wp theme list --status=active --allow-root
```

### Cách 2: SSH MCP upload_file + install

```bash
# Sau khi upload qua ssh_upload_file MCP tool:
wp --path=$WPPATH theme install /tmp/flatsome.zip --activate --allow-root
```

### Cách 3: LocalWP — copy thủ công

```bash
# Copy vào thư mục themes của LocalWP site
cp /path/to/flatsome.zip ~/Library/Application\ Support/Local/run/*/themes/
# Unzip
cd ~/Library/Application\ Support/Local/run/SITE_ID/wp-content/themes/
unzip flatsome.zip
```

---

## Bước 3 — Nhập Flatsome License Key

> ⚠️ **BẮT BUỘC** — Không có license key:
> - UX Builder không lưu được changes
> - Không nhận được updates
> - Một số demo content bị khóa

### Qua WP Admin (cách thường dùng)

```
WP Admin → Flatsome → Registration → nhập Purchase Code từ ThemeForest
```

### Qua WP-CLI (tự động hóa)

```bash
FLATSOME_CODE="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Purchase code từ ThemeForest

wp --path=$WPPATH eval "
flatsome_register_theme('$FLATSOME_CODE');
" --allow-root 2>/dev/null

# Hoặc set trực tiếp vào option
wp --path=$WPPATH eval "
\$reg = get_option('flatsome_registration', []);
\$reg['id'] = '$FLATSOME_CODE';
\$reg['type'] = 'PERSONAL';
update_option('flatsome_registration', \$reg);
echo 'License key saved';
" --allow-root
```

### Kiểm tra license đã active

```bash
wp --path=$WPPATH eval "
\$reg = get_option('flatsome_registration', []);
echo 'License: ' . (\$reg['id'] ?? 'NOT SET') . '\n';
echo 'Type: ' . (\$reg['type'] ?? 'unknown') . '\n';
" --allow-root
```

---

## Bước 4 — Tạo Child Theme

```bash
WPPATH=/path/to/wordpress
CHILD=$WPPATH/wp-content/themes/flatsome-child

mkdir -p $CHILD/assets/css
mkdir -p $CHILD/assets/js
mkdir -p $CHILD/assets/img

# style.css
cat > $CHILD/style.css << 'CSS'
/*
Theme Name:   Flatsome Child
Template:     flatsome
Version:      1.0.0
Text Domain:  flatsome-child
*/
CSS

# functions.php chuẩn
cat > $CHILD/functions.php << 'PHP'
<?php
/**
 * Flatsome Child Theme Functions
 */

// Enqueue parent + child CSS với cache bust
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'flatsome-parent',
        get_template_directory_uri() . '/style.css'
    );
    wp_enqueue_style(
        'flatsome-child',
        get_stylesheet_uri(),
        ['flatsome-parent'],
        filemtime(get_stylesheet_directory() . '/style.css')
    );
}, 20);

// Enqueue per-page CSS (tự động load css/page-{slug}.css nếu tồn tại)
add_action('wp_enqueue_scripts', function() {
    if (!is_singular('page')) return;
    $slug   = get_post_field('post_name', get_the_ID());
    $file   = get_stylesheet_directory() . "/assets/css/page-{$slug}.css";
    if (!file_exists($file)) return;
    wp_enqueue_style(
        "vf-page-{$slug}",
        get_stylesheet_directory_uri() . "/assets/css/page-{$slug}.css",
        ['flatsome-child'],
        filemtime($file)
    );
}, 30);
PHP

# Activate child theme
chown -R admin:admin $CHILD 2>/dev/null || true
wp --path=$WPPATH theme activate flatsome-child --allow-root
echo "✅ Child theme created and activated"
```

---

## Bước 5 — Cài Plugins cần thiết

```bash
WPPATH=/path/to/wordpress

# Plugins cơ bản cho mọi dự án
wp --path=$WPPATH plugin install contact-form-7 --activate --allow-root
wp --path=$WPPATH plugin install classic-editor --activate --allow-root
wp --path=$WPPATH plugin install wpcode-lite --activate --allow-root

# SEO (chọn 1)
wp --path=$WPPATH plugin install wordpress-seo --activate --allow-root        # Yoast SEO
# wp --path=$WPPATH plugin install seo-by-rank-math --activate --allow-root  # RankMath

# Performance (chọn theo server)
wp --path=$WPPATH plugin install litespeed-cache --activate --allow-root      # LiteSpeed (khuyên dùng nếu VPS LiteSpeed/OLS)
# wp --path=$WPPATH plugin install wp-rocket --allow-root                     # WP Rocket (cần .zip license)

# Media optimization
wp --path=$WPPATH plugin install ewww-image-optimizer --activate --allow-root
# hoặc
# wp --path=$WPPATH plugin install smush --activate --allow-root

# Bảo mật
wp --path=$WPPATH plugin install wordfence --activate --allow-root

# WooCommerce (chỉ khi site bán hàng)
# wp --path=$WPPATH plugin install woocommerce --activate --allow-root
# wp --path=$WPPATH plugin install advanced-custom-fields --activate --allow-root

echo "✅ Core plugins installed"
wp --path=$WPPATH plugin list --status=active --allow-root
```

---

## Bước 6 — Cấu hình cơ bản

```bash
WPPATH=/path/to/wordpress

# Permalink
wp --path=$WPPATH rewrite structure '/%postname%/' --allow-root
wp --path=$WPPATH rewrite flush --hard --allow-root

# Timezone (Việt Nam)
wp --path=$WPPATH option update timezone_string 'Asia/Ho_Chi_Minh' --allow-root

# Ngôn ngữ
wp --path=$WPPATH site switch-language vi --allow-root 2>/dev/null || true

# Tắt comments (hầu hết site công ty không cần)
wp --path=$WPPATH option update default_comment_status 'closed' --allow-root
wp --path=$WPPATH option update comment_registration '1' --allow-root

# Xóa content mẫu mặc định
wp --path=$WPPATH post delete 1 --force --allow-root 2>/dev/null  # Hello World post
wp --path=$WPPATH post delete 2 --force --allow-root 2>/dev/null  # Sample page

# Tắt Flatsome topbar mặc định (thường gây "Add anything here")
wp --path=$WPPATH eval "
\$opts = get_option('flatsome_options', []);
\$opts['topbar_show'] = '0';
\$opts['header_cart'] = '0';
\$opts['header_account'] = '0';
\$opts['header_search'] = '0';
update_option('flatsome_options', \$opts);
echo 'Flatsome defaults cleaned';
" --allow-root

echo "✅ Basic config done"
```

---

## Bước 7 — Upload Logo + Set Flatsome

```bash
WPPATH=/path/to/wordpress

# Upload logo (gửi file lên VPS trước)
# scp /local/logo.png root@VPS_IP:/tmp/logo.png
LOGO_ID=$(wp --path=$WPPATH media import /tmp/logo.png \
  --title="Logo" --porcelain --allow-root 2>&1)

# Set cả WordPress standard + Flatsome specific
wp --path=$WPPATH option update site_logo $LOGO_ID --allow-root
wp --path=$WPPATH eval "
\$opts = get_option('flatsome_options', []);
\$opts['logo'] = '$LOGO_ID';
\$opts['logo_width'] = '180';
\$opts['logo_height'] = '60';
\$opts['header_height'] = '80';
update_option('flatsome_options', \$opts);
echo 'Logo set: ID $LOGO_ID';
" --allow-root
```

---

## Bước 8 — Verify UX Builder hoạt động

```bash
WPPATH=/path/to/wordpress

wp --path=$WPPATH eval "
// Tạo test page
\$id = wp_insert_post([
    'post_title'   => 'UX Builder Test',
    'post_name'    => 'ux-test',
    'post_status'  => 'draft',
    'post_type'    => 'page',
    'post_content' => '[section bg_color=\"#f0f0f0\" padding=\"40px 0\"][row][col span=\"12\" align=\"center\"][ux_text]<h2>UX Builder OK</h2>[/ux_text][/col][/row][/section]',
]);
echo 'Test page: /wp-admin/post.php?post=' . \$id . '&action=edit' . '\n';
echo 'Preview: ' . get_permalink(\$id) . '\n';

// Check UX Builder post types
\$builder_types = get_ux_builder_post_types();
echo 'Builder supports: ' . implode(', ', \$builder_types) . '\n';
" --allow-root
```

---

## Checklist hoàn tất Fresh Install

```
□ WordPress X.X installed, accessible at https://domain.com
□ Flatsome X.X.X installed và active
□ License key entered và verified
□ flatsome-child activated
□ Permalink = /%postname%/
□ Timezone = Asia/Ho_Chi_Minh
□ Topbar, cart, account icons tắt (nếu không cần)
□ Logo uploaded + set trong Flatsome options
□ Contact Form 7, Classic Editor, WPCode Lite active
□ SEO plugin active
□ Cache plugin active + configured
□ UX Builder mở được và lưu được
□ "Hello World" post + "Sample Page" đã xóa
□ Child theme CSS đang load (kiểm tra trong browser DevTools)
```

---

## Thời gian ước tính

| Bước | LocalWP | VPS |
|---|---|---|
| WordPress install | 2 phút | 5 phút |
| Flatsome upload + activate | 3 phút | 5 phút (upload .zip) |
| License key | 1 phút | 1 phút |
| Child theme + plugins | 5 phút | 10 phút |
| Basic config | 2 phút | 2 phút |
| **Tổng** | **~13 phút** | **~23 phút** |
