# Deployment: LocalWP vs VPS

> Hướng dẫn đầy đủ cho cả hai môi trường: LocalWP (phát triển) và VPS Ubuntu (production)
> Bao gồm: setup từ đầu, WP-CLI differences, SSH workflow, LocalWP → VPS migration

---

## Table of Contents

1. [So sánh hai môi trường](#1-so-sánh-hai-môi-trường)
2. [LocalWP — WP-CLI Setup đầy đủ](#2-localwp--wp-cli-setup-đầy-đủ)
3. [VPS Setup từ đầu (Ubuntu)](#3-vps-setup-từ-đầu-ubuntu)
4. [WordPress + Flatsome trên VPS](#4-wordpress--flatsome-trên-vps)
5. [WP-CLI trên VPS](#5-wp-cli-trên-vps)
6. [File Management trên VPS](#6-file-management-trên-vps)
7. [SSL Certificate (Let's Encrypt)](#7-ssl-certificate-lets-encrypt)
8. [LocalWP → VPS Migration](#8-localwp--vps-migration)
9. [Backup & Restore](#9-backup--restore)
10. [VPS Debugging](#10-vps-debugging)
11. [Multi-environment Workflow](#11-multi-environment-workflow)
12. [SSH MCP Tools](#12-ssh-mcp-tools)

---

## 1. So sánh hai môi trường

| Khía cạnh | LocalWP | VPS Ubuntu |
|---|---|---|
| WP-CLI PHP path | Cần set `WP_CLI_PHP` đặc biệt | Dùng `wp` trực tiếp (hoặc `--allow-root`) |
| MySQL | UNIX socket (`--socket=$SOCK`) | Standard `mysql -u root -p` |
| File access | Direct (macOS filesystem) | SSH + `scp`/`sftp` hoặc SSH MCP |
| SSL | Không cần (localhost) | Let's Encrypt (`certbot`) |
| Web server | Local.app tự quản lý | Nginx hoặc Apache (cần cấu hình) |
| WP_DEBUG | Bật thoải mái | Tắt trên production |
| Cache | Thường tắt | Bật (WP Rocket, LiteSpeed...) |
| User chạy WP-CLI | macOS user | `www-data` hoặc `root --allow-root` |
| Deploy workflow | Sửa file trực tiếp | SSH → upload file → flush cache |

---

## 2. LocalWP — WP-CLI Setup đầy đủ

### Tìm PHP path tự động

```bash
# macOS Apple Silicon (M1/M2/M3)
export WP_CLI_PHP=$(find "/Applications/Local.app/Contents/Resources/extraResources/lightning-services" -name "php" -path "*/darwin-arm64/*" 2>/dev/null | grep "bin/php$" | head -1)

# macOS Intel
export WP_CLI_PHP=$(find "/Applications/Local.app/Contents/Resources/extraResources/lightning-services" -name "php" -path "*/darwin-x64/*" 2>/dev/null | grep "bin/php$" | head -1)

echo "PHP: $WP_CLI_PHP"
wp core version
```

### Tìm MySQL socket tự động

```bash
SOCK=$(find "$HOME/Library/Application Support/Local/run" -name "mysqld.sock" 2>/dev/null | head -1)
echo "Socket: $SOCK"

# Test kết nối
MYSQL="$HOME/Library/Application Support/Local/lightning-services/mysql-8.0.16+6/bin/darwin-arm64/bin/mysql"
$MYSQL --socket="$SOCK" -u root -proot local -e "SELECT 1"
```

### Tìm site path tự động

```bash
# Tìm tất cả site LocalWP
find "$HOME/Local Sites" -name "wp-config.php" 2>/dev/null | head -10

# Lấy path site cụ thể (thay "ten-site" bằng slug site)
SITE_PATH=$(find "$HOME/Local Sites" -path "*ten-site*" -name "wp-config.php" | head -1 | xargs dirname)
CHILD_THEME="$SITE_PATH/wp-content/themes/flatsome-child"
echo "Site: $SITE_PATH"
echo "Child theme: $CHILD_THEME"
```

### Helper script — thêm vào đầu mỗi session LocalWP

```bash
#!/bin/bash
# localwp-env.sh — Source file này trước khi làm việc
SITE_SLUG="ten-site"  # ← đổi thành slug site của bạn

export WP_CLI_PHP=$(find "/Applications/Local.app/Contents/Resources/extraResources/lightning-services" \
  -name "php" \( -path "*/darwin-arm64/*" -o -path "*/darwin-x64/*" \) 2>/dev/null \
  | grep "bin/php$" | head -1)

export SOCK=$(find "$HOME/Library/Application Support/Local/run" -name "mysqld.sock" 2>/dev/null | head -1)
export SITE_PATH=$(find "$HOME/Local Sites" -path "*${SITE_SLUG}*" -name "wp-config.php" | head -1 | xargs dirname 2>/dev/null)
export WP_PATH="$SITE_PATH"
export CHILD_THEME="$SITE_PATH/wp-content/themes/flatsome-child"

echo "✓ WP-CLI PHP: $WP_CLI_PHP"
echo "✓ MySQL Socket: $SOCK"
echo "✓ Site path: $SITE_PATH"
echo "✓ Child theme: $CHILD_THEME"

alias wp="wp --path='$WP_PATH'"
```

### LocalWP MySQL operations

```bash
MYSQL_BIN=$(find "$HOME/Library/Application Support/Local" -name "mysql" -path "*/bin/*" | grep -v mysqld | head -1)

# Query
$MYSQL_BIN --socket="$SOCK" -u root -proot local -e "SELECT ID, post_title FROM wp_posts WHERE post_type='page' LIMIT 10"

# Update post content từ file
$MYSQL_BIN --socket="$SOCK" -u root -proot local \
  --execute="UPDATE wp_posts SET post_content='$(cat /tmp/content.txt | sed "s/'/\\\\'/g")' WHERE ID=PAGE_ID"

# Backup database
$MYSQL_BIN --socket="$SOCK" -u root -proot local > /tmp/backup-$(date +%Y%m%d).sql
# hoặc dùng WP-CLI:
wp db export /tmp/backup-$(date +%Y%m%d).sql
```

---

## 3. VPS Setup từ đầu (Ubuntu)

### Kết nối SSH (dùng SSH MCP hoặc terminal)

```bash
# Via terminal
ssh root@YOUR_VPS_IP
# hoặc
ssh -i ~/.ssh/id_rsa root@YOUR_VPS_IP
```

> **Dùng SSH MCP**: Xem § 12 để dùng `ssh_connect` / `ssh_exec` tools trực tiếp trong Claude.

### Cài đặt stack LEMP (Linux + Nginx + MySQL + PHP)

```bash
# Update hệ thống
apt update && apt upgrade -y

# Cài Nginx
apt install -y nginx

# Cài PHP 8.2 + extensions cần thiết cho WordPress
apt install -y php8.2-fpm php8.2-mysql php8.2-curl php8.2-gd php8.2-mbstring \
  php8.2-xml php8.2-zip php8.2-intl php8.2-bcmath php8.2-imagick

# Cài MySQL 8.0
apt install -y mysql-server

# Cài các tiện ích
apt install -y certbot python3-certbot-nginx unzip curl wget git

# Kiểm tra các service
systemctl status nginx php8.2-fpm mysql
```

### Cấu hình MySQL

```bash
# Bảo mật MySQL
mysql_secure_installation

# Tạo database và user cho WordPress
mysql -u root -p << 'SQL'
CREATE DATABASE wordpress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wp_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wp_user'@'localhost';
FLUSH PRIVILEGES;
SQL
```

### Cấu hình Nginx cho WordPress

```bash
# Tạo config cho domain
cat > /etc/nginx/sites-available/example.com << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.php index.html;

    # WordPress permalinks
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # PHP processing
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Deny access to sensitive files
    location ~ /\.ht { deny all; }
    location ~ /wp-config.php { deny all; }

    # Static file caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Max upload size
    client_max_body_size 64M;
}
NGINX

# Enable site
ln -sf /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Tạo web root
mkdir -p /var/www/example.com
chown -R www-data:www-data /var/www/example.com
```

### Cấu hình PHP

```bash
# Điều chỉnh PHP limits cho WordPress
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/' /etc/php/8.2/fpm/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 64M/' /etc/php/8.2/fpm/php.ini
sed -i 's/memory_limit = 128M/memory_limit = 256M/' /etc/php/8.2/fpm/php.ini
sed -i 's/max_execution_time = 30/max_execution_time = 300/' /etc/php/8.2/fpm/php.ini

systemctl restart php8.2-fpm
```

### Firewall (UFW)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## 4. WordPress + Flatsome trên VPS

### Cài WordPress via WP-CLI

```bash
# Cài WP-CLI trên VPS (1 lần)
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /usr/local/bin/wp

# Verify
wp --info --allow-root

# Cài WordPress
cd /var/www/example.com
wp core download --locale=vi --allow-root

# Tạo wp-config.php
wp config create \
  --dbname=wordpress_db \
  --dbuser=wp_user \
  --dbpass=STRONG_PASSWORD_HERE \
  --dbhost=localhost \
  --dbprefix=wp_ \
  --locale=vi \
  --allow-root

# Cài WordPress
wp core install \
  --url=https://example.com \
  --title="Tên Website" \
  --admin_user=admin \
  --admin_password=ADMIN_PASSWORD \
  --admin_email=admin@example.com \
  --allow-root

# Set quyền file
chown -R www-data:www-data /var/www/example.com
find /var/www/example.com -type d -exec chmod 755 {} \;
find /var/www/example.com -type f -exec chmod 644 {} \;
chmod 600 /var/www/example.com/wp-config.php
```

### Upload và cài Flatsome theme

```bash
# Cách 1: Upload qua SCP
scp flatsome.zip root@YOUR_VPS_IP:/tmp/

# Cách 2: Upload trực tiếp vào thư mục themes
scp -r /path/to/flatsome root@YOUR_VPS_IP:/var/www/example.com/wp-content/themes/

# Cài từ file ZIP
wp theme install /tmp/flatsome.zip --allow-root

# Kích hoạt
wp theme activate flatsome --allow-root

# Tạo child theme ngay trên VPS
CHILD_DIR="/var/www/example.com/wp-content/themes/flatsome-child"
mkdir -p $CHILD_DIR

cat > $CHILD_DIR/style.css << 'CSS'
/*
Theme Name:   Flatsome Child
Template:     flatsome
Version:      1.0.0
*/
@import url("../flatsome/style.css");
CSS

cat > $CHILD_DIR/functions.php << 'PHP'
<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('flatsome-parent', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), ['flatsome-parent'], filemtime(get_stylesheet_directory() . '/style.css'));
});
PHP

chown -R www-data:www-data $CHILD_DIR
wp theme activate flatsome-child --allow-root
```

### Cài plugins cơ bản

```bash
wp plugin install contact-form-7 wpcode-lite --activate --allow-root
wp plugin install advanced-custom-fields --activate --allow-root  # nếu cần ACF
wp plugin install woocommerce --activate --allow-root              # nếu cần WooCommerce
wp plugin install wordpress-seo --activate --allow-root            # Yoast SEO

# Cài WP Rocket hoặc LiteSpeed Cache (nếu có license)
# wp plugin install wp-rocket --activate --allow-root
```

---

## 5. WP-CLI trên VPS

### Khác biệt so với LocalWP

| | LocalWP | VPS |
|---|---|---|
| Command prefix | `export WP_CLI_PHP=...` rồi mới `wp` | `wp --allow-root` hoặc `sudo -u www-data wp` |
| MySQL | `--socket=$SOCK` | Không cần, dùng wp-config |
| PHP path | Cần set đặc biệt | PHP hệ thống, không cần set |
| User | macOS user | root hoặc www-data |

### WP-CLI trên VPS — Tất cả lệnh dùng `--allow-root`

```bash
# Thông tin site
wp core version --allow-root --path=/var/www/example.com
wp option get siteurl --allow-root --path=/var/www/example.com

# Set alias để không phải gõ path mãi
alias wp="wp --allow-root --path=/var/www/example.com"

# Hoặc cd vào thư mục site trước
cd /var/www/example.com
wp core version --allow-root
```

### Tạo alias vĩnh viễn trên VPS

```bash
cat >> /root/.bashrc << 'BASH'
alias wp="wp --allow-root --path=/var/www/example.com"
BASH
source /root/.bashrc

# Test
wp core version
wp option get siteurl
```

### Tất cả operations WP-CLI trên VPS (không có gì thay đổi ngoài --allow-root)

```bash
# Pages
wp post create --post_type=page --post_title="Trang chủ" --post_status=publish --allow-root

# Menus
wp menu create "Main Menu" --allow-root
wp menu location assign main-menu primary --allow-root

# Options
wp option update siteurl "https://example.com" --allow-root
wp option update home "https://example.com" --allow-root

# Themes
wp theme activate flatsome-child --allow-root

# Cache
wp cache flush --allow-root
wp rewrite flush --hard --allow-root

# WooCommerce
wp wc product create --name="Sản phẩm" --regular_price="100000" --status=publish --user=1 --allow-root

# Database
wp db export /tmp/backup.sql --allow-root
wp db import /tmp/backup.sql --allow-root
```

---

## 6. File Management trên VPS

### Upload file lên VPS

```bash
# Upload 1 file CSS
scp /path/to/style.css root@VPS_IP:/var/www/example.com/wp-content/themes/flatsome-child/

# Upload toàn bộ child theme
scp -r /path/to/flatsome-child root@VPS_IP:/var/www/example.com/wp-content/themes/

# Upload plugin
scp plugin.zip root@VPS_IP:/tmp/
ssh root@VPS_IP "wp plugin install /tmp/plugin.zip --activate --allow-root --path=/var/www/example.com"

# Upload ảnh / media
scp image.jpg root@VPS_IP:/var/www/example.com/wp-content/uploads/$(date +%Y/%m)/
```

### Chỉnh sửa file trực tiếp trên VPS

```bash
# Edit file CSS trực tiếp
ssh root@VPS_IP "cat >> /var/www/example.com/wp-content/themes/flatsome-child/style.css" << 'CSS'
/* Custom styles */
.my-section { background: #f8fafc; }
CSS

# Hoặc dùng heredoc để ghi file hoàn toàn mới
ssh root@VPS_IP "cat > /var/www/example.com/wp-content/themes/flatsome-child/style.css" << 'CSS'
/* Toàn bộ nội dung CSS */
CSS

# Set quyền sau khi upload
ssh root@VPS_IP "chown www-data:www-data /var/www/example.com/wp-content/themes/flatsome-child/style.css"
```

### Download file từ VPS về máy

```bash
# Download database
scp root@VPS_IP:/tmp/backup.sql ./backup-$(date +%Y%m%d).sql

# Download child theme
scp -r root@VPS_IP:/var/www/example.com/wp-content/themes/flatsome-child ./flatsome-child-backup/

# Download uploads folder (nếu cần sync)
scp -r root@VPS_IP:/var/www/example.com/wp-content/uploads ./uploads-backup/
```

### Rsync (sync nhanh, chỉ upload file thay đổi)

```bash
# Sync child theme LocalWP → VPS
rsync -avz --delete \
  "$HOME/Local Sites/ten-site/app/public/wp-content/themes/flatsome-child/" \
  root@VPS_IP:/var/www/example.com/wp-content/themes/flatsome-child/

# Sync uploads (chỉ upload, không xóa trên VPS)
rsync -avz \
  "$HOME/Local Sites/ten-site/app/public/wp-content/uploads/" \
  root@VPS_IP:/var/www/example.com/wp-content/uploads/
```

---

## 7. SSL Certificate (Let's Encrypt)

```bash
# Cài certbot (đã cài ở bước setup)
# Lấy certificate
certbot --nginx -d example.com -d www.example.com --non-interactive --agree-tos -m admin@example.com

# Verify SSL
certbot certificates

# Auto-renew (certbot tự tạo cronjob, nhưng test thử)
certbot renew --dry-run

# Sau khi có SSL, update WordPress URL
wp option update siteurl "https://example.com" --allow-root --path=/var/www/example.com
wp option update home "https://example.com" --allow-root --path=/var/www/example.com

# Search & replace http → https trong database
wp search-replace "http://example.com" "https://example.com" --allow-root --path=/var/www/example.com

wp cache flush --allow-root --path=/var/www/example.com
```

---

## 8. LocalWP → VPS Migration

### Workflow hoàn chỉnh: dev local → deploy production

**Bước 1 — Export database từ LocalWP**

```bash
# Trên máy local
export WP_CLI_PHP="$(find /Applications/Local.app -name php -path '*/bin/php' | head -1)"
cd "$HOME/Local Sites/ten-site/app/public"

wp db export /tmp/local-export.sql
```

**Bước 2 — Search & replace domain trong SQL**

```bash
# Thay domain local → domain production
sed -i '' 's|http://ten-site.local|https://example.com|g' /tmp/local-export.sql
# macOS dùng sed -i '' (có dấu nháy sau -i)
```

**Bước 3 — Upload database và media**

```bash
# Upload SQL
scp /tmp/local-export.sql root@VPS_IP:/tmp/

# Upload media (uploads folder)
rsync -avz \
  "$HOME/Local Sites/ten-site/app/public/wp-content/uploads/" \
  root@VPS_IP:/var/www/example.com/wp-content/uploads/

# Upload child theme
rsync -avz \
  "$HOME/Local Sites/ten-site/app/public/wp-content/themes/flatsome-child/" \
  root@VPS_IP:/var/www/example.com/wp-content/themes/flatsome-child/
```

**Bước 4 — Import trên VPS**

```bash
ssh root@VPS_IP << 'REMOTE'
cd /var/www/example.com

# Import database
wp db import /tmp/local-export.sql --allow-root

# Cập nhật domain (double-check)
wp search-replace "ten-site.local" "example.com" --allow-root
wp search-replace "http://example.com" "https://example.com" --allow-root

# Set quyền
chown -R www-data:www-data wp-content/uploads/
chown -R www-data:www-data wp-content/themes/flatsome-child/

# Flush
wp cache flush --allow-root
wp rewrite flush --hard --allow-root

echo "Done!"
REMOTE
```

**Bước 5 — Verify**

```bash
ssh root@VPS_IP << 'REMOTE'
cd /var/www/example.com
wp option get siteurl --allow-root
wp option get home --allow-root
wp post list --post_type=page --fields=ID,post_title,post_status --allow-root | head -10
wp theme list --status=active --allow-root
REMOTE
```

### Sau migration — Checklist

```bash
# Trên VPS
cd /var/www/example.com

# 1. URL đúng không?
wp option get siteurl --allow-root

# 2. Admin login được không?
wp user list --allow-root

# 3. Tạo admin mới nếu cần
wp user create newadmin admin@example.com --role=administrator --user_pass=PASS --allow-root

# 4. Regenerate thumbnails (nếu ảnh bị vỡ)
wp media regenerate --yes --allow-root

# 5. Update permalinks
wp option update permalink_structure '/%postname%/' --allow-root
wp rewrite flush --hard --allow-root

# 6. Kiểm tra plugins active
wp plugin list --status=active --allow-root

# 7. Kích hoạt cache plugin cho production
# wp plugin activate wp-rocket --allow-root
```

---

## 9. Backup & Restore

### Backup tự động trên VPS (cronjob)

```bash
# Tạo script backup
cat > /usr/local/bin/wp-backup.sh << 'SCRIPT'
#!/bin/bash
SITE_PATH="/var/www/example.com"
BACKUP_DIR="/var/backups/wordpress"
DATE=$(date +%Y%m%d_%H%M%S)
DOMAIN="example.com"

mkdir -p $BACKUP_DIR

# Backup database
wp db export "$BACKUP_DIR/${DOMAIN}_${DATE}.sql" --allow-root --path=$SITE_PATH

# Backup child theme + uploads (zip)
tar -czf "$BACKUP_DIR/${DOMAIN}_files_${DATE}.tar.gz" \
  -C "$SITE_PATH/wp-content" \
  themes/flatsome-child \
  uploads/

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup done: $DATE"
SCRIPT

chmod +x /usr/local/bin/wp-backup.sh

# Thêm vào crontab (chạy lúc 2:00 sáng mỗi ngày)
crontab -l | { cat; echo "0 2 * * * /usr/local/bin/wp-backup.sh >> /var/log/wp-backup.log 2>&1"; } | crontab -
```

### Restore từ backup

```bash
# Restore database
wp db import /var/backups/wordpress/example.com_20260529.sql --allow-root --path=/var/www/example.com

# Restore files
tar -xzf /var/backups/wordpress/example.com_files_20260529.tar.gz -C /var/www/example.com/wp-content/

wp cache flush --allow-root --path=/var/www/example.com
```

### Backup nhanh trước khi deploy

```bash
# Chạy lệnh này TRƯỚC khi apply bất kỳ thay đổi lớn nào
TIMESTAMP=$(date +%Y%m%d_%H%M)
wp db export "/tmp/pre-deploy-${TIMESTAMP}.sql" --allow-root --path=/var/www/example.com
echo "Backup saved: /tmp/pre-deploy-${TIMESTAMP}.sql"
```

---

## 10. VPS Debugging

### Xem logs lỗi

```bash
# Nginx error log
tail -f /var/log/nginx/error.log
tail -n 50 /var/log/nginx/error.log

# PHP error log
tail -f /var/log/php8.2-fpm.log

# WordPress debug log (phải bật trong wp-config.php)
tail -f /var/www/example.com/wp-content/debug.log
```

### Bật WP_DEBUG trên VPS (tạm thời, TẮT ngay sau khi debug xong)

```bash
wp config set WP_DEBUG true --raw --allow-root --path=/var/www/example.com
wp config set WP_DEBUG_LOG true --raw --allow-root --path=/var/www/example.com
wp config set WP_DEBUG_DISPLAY false --raw --allow-root --path=/var/www/example.com

# Xem debug log
tail -f /var/www/example.com/wp-content/debug.log

# TẮT debug sau khi xong
wp config set WP_DEBUG false --raw --allow-root --path=/var/www/example.com
wp config set WP_DEBUG_LOG false --raw --allow-root --path=/var/www/example.com
```

### Kiểm tra performance VPS

```bash
# CPU và RAM
htop   # hoặc
top -b -n 1 | head -20

# Disk
df -h

# Check Nginx status
systemctl status nginx
nginx -t  # kiểm tra config

# Check PHP-FPM
systemctl status php8.2-fpm
php8.2 -v

# Check MySQL
systemctl status mysql
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
```

### Common VPS Issues

| Triệu chứng | Nguyên nhân | Fix |
|---|---|---|
| 502 Bad Gateway | PHP-FPM không chạy | `systemctl restart php8.2-fpm` |
| 403 Forbidden | Sai quyền file | `chown -R www-data:www-data /var/www/example.com` |
| 504 Gateway Timeout | PHP timeout | Tăng `max_execution_time` trong php.ini |
| Ảnh không upload được | `upload_max_filesize` nhỏ | Sửa php.ini + nginx `client_max_body_size` |
| WP-CLI "Permission denied" | Chạy với wrong user | Thêm `--allow-root` hoặc `sudo -u www-data wp` |
| Site trắng sau import | DB collation mismatch | `wp db repair --allow-root` |
| CSS/JS không load | Wrong siteurl trong DB | `wp search-replace "old-url" "new-url" --allow-root` |
| Permalink 404 | Rewrite rules chưa flush | `wp rewrite flush --hard --allow-root` |
| "Sorry, you are not allowed" | Admin URL sai | Kiểm tra `wp option get siteurl --allow-root` |

---

## 11. Multi-environment Workflow

### Quy trình khuyến nghị: Local → Staging → Production

```
LocalWP (dev)
  ↓ rsync child theme + SQL export
VPS Staging (test)
  ↓ rsync sau khi test xong
VPS Production (live)
```

### Deploy script tự động

```bash
#!/bin/bash
# deploy.sh — Chạy từ máy local để deploy lên VPS

VPS_IP="YOUR_VPS_IP"
VPS_PATH="/var/www/example.com"
LOCAL_SITE="$HOME/Local Sites/ten-site/app/public"
TIMESTAMP=$(date +%Y%m%d_%H%M)

echo "=== Deploy started: $TIMESTAMP ==="

# 1. Backup VPS trước khi deploy
echo "→ Backing up VPS..."
ssh root@$VPS_IP "wp db export /tmp/pre-deploy-${TIMESTAMP}.sql --allow-root --path=$VPS_PATH"

# 2. Sync child theme
echo "→ Syncing child theme..."
rsync -avz --delete \
  "$LOCAL_SITE/wp-content/themes/flatsome-child/" \
  root@$VPS_IP:$VPS_PATH/wp-content/themes/flatsome-child/

# 3. Sync uploads (không xóa file trên VPS)
echo "→ Syncing uploads..."
rsync -avz \
  "$LOCAL_SITE/wp-content/uploads/" \
  root@$VPS_IP:$VPS_PATH/wp-content/uploads/

# 4. Set permissions
echo "→ Setting permissions..."
ssh root@$VPS_IP "chown -R www-data:www-data $VPS_PATH/wp-content/themes/flatsome-child/"

# 5. Flush cache
echo "→ Flushing cache..."
ssh root@$VPS_IP "wp cache flush --allow-root --path=$VPS_PATH && wp rewrite flush --allow-root --path=$VPS_PATH"

echo "=== Deploy completed: $(date +%H:%M:%S) ==="
```

```bash
# Dùng script
chmod +x deploy.sh
./deploy.sh
```

### Chỉ deploy CSS/JS thay đổi (nhanh hơn)

```bash
#!/bin/bash
# quick-deploy.sh — Chỉ sync style.css và JS

VPS_IP="YOUR_VPS_IP"
VPS_THEME="/var/www/example.com/wp-content/themes/flatsome-child"
LOCAL_THEME="$HOME/Local Sites/ten-site/app/public/wp-content/themes/flatsome-child"

scp "$LOCAL_THEME/style.css" root@$VPS_IP:$VPS_THEME/
scp "$LOCAL_THEME/functions.php" root@$VPS_IP:$VPS_THEME/

# Flush CSS cache
ssh root@$VPS_IP "wp cache flush --allow-root --path=/var/www/example.com"

echo "✓ CSS/PHP deployed"
```

---

## 12. SSH MCP Tools

Claude Code có thể dùng **SSH MCP server** để kết nối và thao tác trực tiếp trên VPS mà không cần copy-paste lệnh.

### Các tools available

| Tool | Dùng khi |
|---|---|
| `mcp__ssh-server__ssh_connect` | Kết nối SSH lần đầu |
| `mcp__ssh-server__ssh_exec` | Chạy lệnh trên VPS |
| `mcp__ssh-server__ssh_upload_file` | Upload file lên VPS |
| `mcp__ssh-server__ssh_download_file` | Download file từ VPS |
| `mcp__ssh-server__ssh_list_files` | List files trên VPS |
| `mcp__ssh-server__ubuntu_nginx_control` | Start/stop/reload Nginx |
| `mcp__ssh-server__ubuntu_ssl_certificate` | Setup Let's Encrypt SSL |
| `mcp__ssh-server__ubuntu_ufw_firewall` | Cấu hình firewall |
| `mcp__ssh-server__ubuntu_update_packages` | Update apt packages |
| `mcp__ssh-server__ubuntu_website_deployment` | Deploy website |

### Workflow dùng SSH MCP (Claude tự động)

Khi user yêu cầu làm gì đó trên VPS, Claude sẽ:

1. `ssh_connect` với VPS credentials
2. `ssh_exec` để chạy WP-CLI commands
3. `ssh_upload_file` để upload CSS/PHP files
4. `ubuntu_nginx_control` để reload Nginx nếu cần
5. `ubuntu_ssl_certificate` để setup SSL

### Ví dụ — User nói: "Deploy trang này lên VPS của tôi"

Claude sẽ hỏi:
```
1. VPS IP/hostname?
2. Username (root hay user khác)?
3. SSH key hay password?
4. Domain name?
5. WordPress đã cài chưa hay cài mới?
```

Sau đó dùng SSH MCP để thực hiện toàn bộ.

### Lưu ý bảo mật khi dùng SSH MCP

- **Không** lưu password trong SKILL.md hay bất kỳ file nào
- Dùng SSH key thay password khi có thể
- Luôn backup trước khi deploy
- Kiểm tra VPS IP từ user, không tự đoán
