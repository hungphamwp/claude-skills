# Deploy SEOC-style Flatsome Home Page on VPS

## 1. Pre-flight

```bash
cd /var/www/example.com
wp core version --allow-root
wp theme list --status=active --allow-root
wp db export /tmp/backup-$(date +%Y%m%d_%H%M).sql --allow-root
```

## 2. Upload assets

Upload logo, hero image, about image, and client logos to Media Library, then replace these placeholders in `seoc-home.shortcodes.txt`:

```text
__HERO_IMAGE_ID__
__ABOUT_IMAGE_ID__
__LOGO_CLIENT_1__
__LOGO_CLIENT_2__
__LOGO_CLIENT_3__
__LOGO_CLIENT_4__
__LOGO_CLIENT_5__
__CONTACT_FORM_ID__
```

CLI example:

```bash
wp media import /tmp/hero.png --porcelain --allow-root
```

## 3. Create or update the home page

```bash
PAGE_ID=$(wp post list --post_type=page --name=trang-chu --field=ID --allow-root)

if [ -z "$PAGE_ID" ]; then
  PAGE_ID=$(wp post create \
    --post_type=page \
    --post_status=publish \
    --post_title="Trang chủ" \
    --post_name="trang-chu" \
    --porcelain \
    --allow-root)
fi

wp post update "$PAGE_ID" /tmp/seoc-home.shortcodes.txt --allow-root
wp option update show_on_front page --allow-root
wp option update page_on_front "$PAGE_ID" --allow-root
```

## 4. Add CSS to child theme

Append `seoc-home.css` to:

```text
wp-content/themes/flatsome-child/style.css
```

Then clear cache if the site uses a cache plugin:

```bash
wp cache flush --allow-root
```
