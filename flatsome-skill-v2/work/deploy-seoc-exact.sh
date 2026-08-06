#!/usr/bin/env bash
set -euo pipefail

WEBROOT=/home/admin/domains/hmarketing.vn/public_html
THEME="$WEBROOT/wp-content/themes/flatsome-child"
TS=$(date +%Y%m%d_%H%M%S)
BACKUP="/root/codex-backups/hmarketing-seoc-exact-$TS"

mkdir -p "$BACKUP"
cd "$WEBROOT"

DB_NAME=$(php -r 'include "wp-config.php"; echo DB_NAME;')
DB_USER=$(php -r 'include "wp-config.php"; echo DB_USER;')
DB_PASS=$(php -r 'include "wp-config.php"; echo DB_PASSWORD;')
mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP/db-before-template.sql"

cp -a "$THEME/template-seoc-exact-home.php" "$BACKUP/" 2>/dev/null || true

rm -rf "$THEME/seoc-exact"
mkdir -p "$THEME/seoc-exact"
tar -xzf /tmp/seoc-exact.tar.gz -C "$THEME/seoc-exact"
mv "$THEME/seoc-exact/template-seoc-exact-home.php" "$THEME/template-seoc-exact-home.php"

PAGE_ID=$(wp option get page_on_front --allow-root)
if [ -z "$PAGE_ID" ] || [ "$PAGE_ID" = "0" ]; then
  PAGE_ID=$(wp post list --post_type=page --name=trang-chu --field=ID --allow-root | head -1)
fi

if [ -z "$PAGE_ID" ]; then
  PAGE_ID=$(wp post create --post_type=page --post_status=publish --post_title="Trang chủ" --post_name="trang-chu" --porcelain --allow-root)
fi

wp post meta update "$PAGE_ID" _wp_page_template template-seoc-exact-home.php --allow-root >/dev/null
wp post update "$PAGE_ID" --post_content="" --allow-root >/dev/null
wp option update show_on_front page --allow-root >/dev/null
wp option update page_on_front "$PAGE_ID" --allow-root >/dev/null

chown -R admin:admin "$WEBROOT"

echo "BACKUP=$BACKUP"
echo "PAGE_ID=$PAGE_ID"
echo "TEMPLATE=$(wp post meta get "$PAGE_ID" _wp_page_template --allow-root)"
echo "ASSETS=$(find "$THEME/seoc-exact/assets" -type f | wc -l)"
