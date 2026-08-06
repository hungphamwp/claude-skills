# Multi-Page Site Architecture — Flatsome

> Workflow khi clone/build toàn bộ website (nhiều trang), không chỉ 1 section.
> Bao gồm: page plan, Global Sections, menu, giữ consistent header/footer.

---

## Bước 1 — Site Architecture Plan

Trước khi code bất cứ trang nào, lập bản đồ toàn site:

```markdown
=== SITE ARCHITECTURE — [Project Name] ===

## Pages
| Slug | Title | Template | Priority |
|---|---|---|---|
| / | Trang chủ | template-home.php hoặc default | 1 |
| /gioi-thieu | Giới thiệu | default | 2 |
| /dich-vu | Dịch vụ | default | 2 |
| /dich-vu/seo | Dịch vụ SEO | default | 3 |
| /du-an | Dự án | default | 2 |
| /blog | Blog | (archive native) | 2 |
| /lien-he | Liên hệ | default | 2 |

## Global Sections (UX Blocks — dùng lại nhiều trang)
| Block | Shortcode | Dùng ở |
|---|---|---|
| Header | [block id="X"] | Tất cả trang (via Customizer) |
| Footer | [block id="Y"] | Tất cả trang (via Customizer) |
| Floating CTA | injected via hook | Tất cả trang |
| Cookie Notice | injected via hook | Tất cả trang |

## Shared Components (sections dùng lại)
| Component | Trang dùng |
|---|---|
| CTA Banner ("Liên hệ ngay") | Cuối trang dịch vụ, giới thiệu |
| Testimonials | Trang chủ, dịch vụ |
| Partner logos | Trang chủ, về chúng tôi |

## Navigation Menu
| Label | URL | Dropdown |
|---|---|---|
| Trang chủ | / | - |
| Giới thiệu | /gioi-thieu | - |
| Dịch vụ | /dich-vu | SEO, Content, Ads |
| Dự án | /du-an | - |
| Blog | /blog | - |
| Liên hệ | /lien-he | - |
```

---

## Bước 2 — Tạo toàn bộ pages trong 1 lệnh

```bash
WPPATH=/path/to/wordpress

# Tạo tất cả pages
declare -A PAGES=(
  ["trang-chu"]="Trang chủ"
  ["gioi-thieu"]="Giới thiệu"
  ["dich-vu"]="Dịch vụ"
  ["dich-vu/seo"]="Dịch vụ SEO"
  ["du-an"]="Dự án"
  ["lien-he"]="Liên hệ"
)

for slug in "${!PAGES[@]}"; do
  title="${PAGES[$slug]}"
  ID=$(wp --path=$WPPATH post create \
    --post_type=page \
    --post_title="$title" \
    --post_name="$slug" \
    --post_status=publish \
    --porcelain \
    --allow-root 2>&1)
  echo "Created: ID=$ID | $title | /$slug/"
done

# Set front page
HOMEPAGE_ID=$(wp --path=$WPPATH post list --post_type=page \
  --post_name=trang-chu --field=ID --allow-root 2>&1)
wp --path=$WPPATH option update show_on_front page --allow-root
wp --path=$WPPATH option update page_on_front $HOMEPAGE_ID --allow-root
echo "Front page set to ID: $HOMEPAGE_ID"

# Flush permalinks
wp --path=$WPPATH rewrite flush --hard --allow-root
```

---

## Bước 3 — Tạo Navigation Menu

```bash
WPPATH=/path/to/wordpress

# Tạo menu
MENU_ID=$(wp --path=$WPPATH menu create "Menu chính" --porcelain --allow-root)
echo "Menu ID: $MENU_ID"

# Thêm items (lấy page IDs từ trước)
wp --path=$WPPATH menu item add-post $MENU_ID \
  $(wp --path=$WPPATH post list --post_name=trang-chu --field=ID --allow-root) \
  --title="Trang chủ" --allow-root

wp --path=$WPPATH menu item add-post $MENU_ID \
  $(wp --path=$WPPATH post list --post_name=gioi-thieu --field=ID --allow-root) \
  --title="Giới thiệu" --allow-root

# Item cha: Dịch vụ
DICH_VU_ITEM=$(wp --path=$WPPATH menu item add-post $MENU_ID \
  $(wp --path=$WPPATH post list --post_name=dich-vu --field=ID --allow-root) \
  --title="Dịch vụ" --porcelain --allow-root)

# Sub item: SEO (con của Dịch vụ)
wp --path=$WPPATH menu item add-post $MENU_ID \
  $(wp --path=$WPPATH post list --post_name=dich-vu-seo --field=ID --allow-root) \
  --title="Dịch vụ SEO" \
  --parent-id=$DICH_VU_ITEM \
  --allow-root

wp --path=$WPPATH menu item add-post $MENU_ID \
  $(wp --path=$WPPATH post list --post_name=du-an --field=ID --allow-root) \
  --title="Dự án" --allow-root

wp --path=$WPPATH menu item add-post $MENU_ID \
  $(wp --path=$WPPATH post list --post_name=lien-he --field=ID --allow-root) \
  --title="Liên hệ" --allow-root

# Gán menu vào primary location
wp --path=$WPPATH menu location assign $MENU_ID primary --allow-root
echo "Menu assigned to primary"
```

---

## Bước 4 — Global Sections (Header + Footer UX Blocks)

Global Sections là UX Blocks được set trong Flatsome Customizer để dùng lại trên toàn site.

### Tạo Footer Global Section

```bash
WPPATH=/path/to/wordpress

# Viết content footer ra file
cat > /tmp/footer-content.txt << 'FOOTER'
[section bg_color="#111827" padding="60px 0 0" class="vf-footer-section"]
  [row style="collapse" h_align="center"]
    [col span="3" span__sm="12" class="vf-footer-brand"]
      [ux_image id="LOGO_ID" width="160" link="/"]
      [gap height="16px"]
      [ux_text]<p class="vf-footer-desc">Mô tả ngắn về công ty...</p>[/ux_text]
    [/col]
    [col span="2" span__sm="6" class="vf-footer-links"]
      [ux_text]<h4 class="vf-footer-heading">Dịch vụ</h4>[/ux_text]
      [ux_text]<ul class="vf-footer-nav"><li><a href="/dich-vu/seo">SEO Website</a></li></ul>[/ux_text]
    [/col]
    [col span="2" span__sm="6" class="vf-footer-links"]
      [ux_text]<h4 class="vf-footer-heading">Công ty</h4>[/ux_text]
      [ux_text]<ul class="vf-footer-nav"><li><a href="/gioi-thieu">Giới thiệu</a></li></ul>[/ux_text]
    [/col]
    [col span="3" span__sm="12" class="vf-footer-contact"]
      [ux_text]<h4 class="vf-footer-heading">Liên hệ</h4>[/ux_text]
      [ux_text]<p><a href="tel:0912345678">0912 345 678</a></p>[/ux_text]
    [/col]
  [/row]
  [divider color="rgba(255,255,255,0.1)" margin="0"]
  [row style="collapse" h_align="center"]
    [col span="6" span__sm="12" class="vf-footer-copyright"]
      [ux_text]<p>© 2026 Company Name. All rights reserved.</p>[/ux_text]
    [/col]
    [col span="6" span__sm="12" align__sm="center" class="vf-footer-policy"]
      [ux_text]<p><a href="/chinh-sach">Chính sách</a> · <a href="/dieu-khoan">Điều khoản</a></p>[/ux_text]
    [/col]
  [/row]
[/section]
FOOTER

FOOTER_CONTENT=$(cat /tmp/footer-content.txt)
FOOTER_ID=$(wp --path=$WPPATH post create \
  --post_type=blocks \
  --post_title="Footer chính" \
  --post_name="footer-chinh" \
  --post_status=publish \
  --post_author=1 \
  --post_content="$FOOTER_CONTENT" \
  --porcelain \
  --allow-root 2>&1)
echo "Footer block ID: $FOOTER_ID"

# Set làm footer toàn site
wp --path=$WPPATH eval "
\$mods = get_option('theme_mods_flatsome-child', []);
\$mods['footer_block'] = $FOOTER_ID;
update_option('theme_mods_flatsome-child', \$mods);
echo 'Footer block set to ID $FOOTER_ID';
" --allow-root
```

### Shared CTA Section (dùng shortcode [block id="X"])

```bash
WPPATH=/path/to/wordpress

CTA_CONTENT='[section bg_color="#1d4ed8" padding="60px 0" dark="true" class="vf-cta-section"]
  [row h_align="center"]
    [col span="8" span__sm="12" align="center"]
      [ux_text text_align="center"]<h2 class="vf-cta-title">Sẵn sàng bắt đầu?</h2>[/ux_text]
      [ux_text text_align="center"]<p class="vf-cta-desc">Liên hệ ngay để được tư vấn miễn phí</p>[/ux_text]
      [gap height="24px"]
      [button text="Tư vấn miễn phí →" link="/lien-he/" style="outline" color="#ffffff" size="large" radius="50"]
    [/col]
  [/row]
[/section]'

CTA_ID=$(wp --path=$WPPATH post create \
  --post_type=blocks \
  --post_title="CTA Section" \
  --post_name="cta-section" \
  --post_status=publish \
  --post_author=1 \
  --post_content="$CTA_CONTENT" \
  --porcelain \
  --allow-root 2>&1)
echo "CTA block ID: $CTA_ID → use [block id=\"$CTA_ID\"] in any page"
```

---

## Bước 5 — Page-specific CSS Enqueue Pattern

Mỗi trang có CSS riêng để tránh style collision:

```php
// functions.php — enqueue CSS cho từng page
add_action('wp_enqueue_scripts', function() {
    $pages = [
        'trang-chu'  => 'home',
        'gioi-thieu' => 'about',
        'dich-vu'    => 'services',
        'lien-he'    => 'contact',
    ];

    foreach ($pages as $slug => $handle) {
        if (!is_page($slug)) continue;

        $file = get_stylesheet_directory() . "/assets/css/page-{$handle}.css";
        if (!file_exists($file)) continue;

        wp_enqueue_style(
            "vf-page-{$handle}",
            get_stylesheet_directory_uri() . "/assets/css/page-{$handle}.css",
            ['flatsome-style'],
            filemtime($file)
        );
    }
}, 30);
```

---

## Bước 6 — Build Order cho Multi-page Site

```
Phase 1 — Foundation (1 lần, toàn site)
  □ Pre-flight check
  □ Child theme setup
  □ Design tokens CSS (:root variables)
  □ Typography base (font import, body/heading defaults)
  □ Create all pages + set front page
  □ Create + assign navigation menu
  □ Build Footer Global Section
  □ Build Header (Customizer + hook)
  □ Set Footer block via theme_mods

Phase 2 — Page Content (từng trang)
  □ Homepage — hero + main sections
  □ Về chúng tôi — story, team, timeline
  □ Dịch vụ — service cards, process, CTA
  □ Sub-pages dịch vụ (nếu có)
  □ Portfolio/Dự án — grid + filter
  □ Liên hệ — form + map + contact info
  □ Blog archive (nếu có)

Phase 3 — Polish
  □ Responsive check tất cả trang
  □ Animations + transitions
  □ 404 page
  □ Favicon + SEO meta
  □ Cache flush
  □ Performance check
```

---

## Bước 7 — Tái sử dụng Components

### Pattern: CTA Section tái sử dụng

Đặt trong trang cuối mỗi page thông qua shortcode:

```wordpress
<!-- Cuối trang Dịch vụ -->
[content_block id="CTA_BLOCK_ID"]

<!-- Cuối trang Giới thiệu -->
[content_block id="CTA_BLOCK_ID"]
```

### Pattern: Testimonials tái sử dụng

```wordpress
[block id="TESTIMONIAL_BLOCK_ID"]
```

Chỉ update 1 lần → toàn site cập nhật.

---

## Bước 8 — Multi-page QA

```bash
WPPATH=/path/to/wordpress

# Kiểm tra tất cả pages đã publish
wp --path=$WPPATH post list \
  --post_type=page \
  --post_status=publish \
  --fields=ID,post_title,post_name \
  --allow-root

echo "=== CHECKING FOOTER ON ALL PAGES ==="
wp --path=$WPPATH post list --post_type=page --post_status=publish \
  --field=post_name --allow-root | while read slug; do
  count=$(curl -s "$(wp --path=$WPPATH option get siteurl --allow-root)/$slug/" \
    | grep -c "vf-footer-section" 2>/dev/null)
  echo "$count footer — /$slug/"
done

echo "=== CHECKING MENU ==="
wp --path=$WPPATH menu list --allow-root
wp --path=$WPPATH menu item list $(wp --path=$WPPATH menu list --field=term_id --allow-root | head -1) \
  --fields=db_id,menu_item_parent,title,url --allow-root
```
