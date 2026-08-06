#!/usr/bin/env bash
set -euo pipefail

WEBROOT=/home/admin/domains/hmarketing.vn/public_html
THEME="$WEBROOT/wp-content/themes/flatsome-child"
TITLE="Smart Solutions UX Section"
SLUG="smart-solutions-section"
SHORTCODES="/tmp/smart-solutions-section.shortcodes.txt"
CSS="/tmp/smart-solutions-section.css"

cd "$WEBROOT"

PAGE_ID=$(wp post list --post_type=page --name="$SLUG" --field=ID --allow-root | head -1)
if [ -z "$PAGE_ID" ]; then
  PAGE_ID=$(wp post create \
    --post_type=page \
    --post_status=publish \
    --post_title="$TITLE" \
    --post_name="$SLUG" \
    --porcelain \
    --allow-root)
fi

wp post update "$PAGE_ID" "$SHORTCODES" --allow-root >/dev/null
wp post meta update "$PAGE_ID" _wp_page_template default --allow-root >/dev/null

STYLE="$THEME/style.css"
if ! grep -q "HMarketing Smart Solutions UX section" "$STYLE"; then
  printf "\n\n" >> "$STYLE"
  cat "$CSS" >> "$STYLE"
fi

chown -R admin:admin "$WEBROOT"

echo "PAGE_ID=$PAGE_ID"
echo "URL=$(wp post get "$PAGE_ID" --field=guid --allow-root)"
echo "SLUG=$SLUG"
