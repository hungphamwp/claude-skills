# WooCommerce + Flatsome Advanced Reference

> Dành cho dự án dạng: nhận ảnh thiết kế AI → làm ra WordPress Flatsome + WooCommerce chuẩn UX Builder
> Phiên bản: Flatsome 3.15+ | WooCommerce 8.0+ | ACF 6.0+

---

## Table of Contents

1. [Workflow: Design Image → WooCommerce Site](#1-workflow-design-image--woocommerce-site)
2. [WooCommerce Setup via WP-CLI](#2-woocommerce-setup-via-wp-cli)
3. [ACF Custom Fields cho Product Specs](#3-acf-custom-fields-cho-product-specs)
4. [Shop Archive Page Custom Layout](#4-shop-archive-page-custom-layout)
5. [Single Product Page Custom Layout](#5-single-product-page-custom-layout)
6. [Custom Tabs trên Product Page](#6-custom-tabs-trên-product-page)
7. [Product Card (Box) Customization](#7-product-card-box-customization)
8. [Catalog Mode (Không có Add-to-Cart)](#8-catalog-mode-không-có-add-to-cart)
9. [Filter Tabs theo Category](#9-filter-tabs-theo-category)
10. [Color & Variant Selector](#10-color--variant-selector)
11. [WooCommerce Hooks trong Flatsome](#11-woocommerce-hooks-trong-flatsome)
12. [Deployment Checklist](#12-deployment-checklist)
13. [Debugging WooCommerce](#13-debugging-woocommerce)

---

## 1. Workflow: Design Image → WooCommerce Site

### Khi nhận input là ảnh thiết kế (AI-generated hoặc screenshot)

**Bước 1 — Phân tích ảnh thiết kế (Claude đọc trực tiếp)**

Khi user gửi ảnh thiết kế, xác định ngay:

| Cần xác định | Câu hỏi cần trả lời |
|---|---|
| Site type | Landing page hay WooCommerce shop? |
| Product type | Simple / Variable / Catalog-only? |
| Layout archive | Grid mấy cột? Có filter không? |
| Layout single | Gallery trái + info phải? Có tabs không? |
| Custom specs | Sản phẩm có thông số kỹ thuật riêng? (km, hp, acceleration...) |
| CTA | "Mua ngay" / "Đặt cọc" / "Xem chi tiết" / "Liên hệ"? |

**Bước 2 — Xác định approach**

```
Nếu client cần tự sửa sản phẩm (thêm/xóa/edit)  → WooCommerce + Flatsome hooks
Nếu layout cố định, không cần WooCommerce         → Approach B (PHP page template)
Nếu sản phẩm có thông số kỹ thuật phức tạp        → WooCommerce + ACF + custom product layout
Nếu không có giỏ hàng (catalog/brochure site)    → WooCommerce Catalog Mode
```

**Bước 3 — Đặt câu hỏi trước khi code (BẮT BUỘC)**

```
1. Số lượng sản phẩm ban đầu? (ảnh hưởng cách nhập liệu)
2. Có bán hàng online (thanh toán) hay chỉ catalog?
3. Sản phẩm có biến thể (màu sắc, phiên bản) không?
4. Cần thông số kỹ thuật riêng gì? (VD: km, giây 0-100, mã lực)
5. Client tự nhập sản phẩm sau hay bạn nhập hộ?
```

**Bước 4 — Thứ tự xây dựng**

```
1. Setup WooCommerce + ACF plugin
2. Tạo product attributes (màu, phiên bản)
3. Tạo ACF field group cho product specs
4. Tạo child theme CSS
5. Build shop archive layout (Flatsome hooks)
6. Build single product layout (Flatsome product block)
7. Tạo sample products để test
8. Deploy và verify
```

---

## 2. WooCommerce Setup via WP-CLI

### Cài đặt và cấu hình cơ bản

```bash
# Cài WooCommerce
wp plugin install woocommerce --activate

# Cài ACF (dùng cho custom fields)
wp plugin install advanced-custom-fields --activate

# Setup WooCommerce pages (Cart, Checkout, My Account, Shop)
wp wc tool run install_pages --user=1

# Xác nhận pages đã tạo
wp post list --post_type=page --fields=ID,post_title,post_status | grep -E "Shop|Cart|Checkout|Account"
```

### Cấu hình WooCommerce settings

```bash
# Tắt rating (nếu site catalog)
wp option update woocommerce_enable_reviews no

# Tắt shipping (catalog mode)
wp option update woocommerce_ship_to_countries disabled

# Số cột sản phẩm (shop page)
wp option update woocommerce_catalog_columns 3

# Số sản phẩm per page
wp option update woocommerce_catalog_per_page 12

# Tắt breadcrumb mặc định WooCommerce (dùng Flatsome breadcrumb)
wp eval "remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20);"
```

### Tạo sản phẩm via WP-CLI

```bash
# Tạo product đơn giản
wp wc product create \
  --name="VinFast VF 8" \
  --type=simple \
  --regular_price="740000000" \
  --description="Mô tả đầy đủ sản phẩm" \
  --short_description="Mô tả ngắn" \
  --status=publish \
  --user=1

# Tạo product với category
wp wc product create \
  --name="VinFast VF 3" \
  --type=simple \
  --regular_price="740000000" \
  --categories='[{"id": CATEGORY_ID}]' \
  --status=publish \
  --user=1

# Lấy ID product vừa tạo
wp wc product list --user=1 --fields=id,name,price | head -10
```

### Tạo product categories

```bash
# Tạo category cha
wp wc product_cat create --name="SUV" --slug="suv" --user=1

# Tạo category con
wp wc product_cat create --name="SUV điện" --slug="suv-dien" --parent=PARENT_ID --user=1

# List categories
wp wc product_cat list --user=1 --fields=id,name,slug
```

### Tạo product attributes (màu sắc, phiên bản)

```bash
# Tạo attribute "Màu sắc"
wp wc product_attribute create --name="Màu sắc" --slug="mau-sac" --type=select --user=1

# Tạo attribute "Phiên bản"
wp wc product_attribute create --name="Phiên bản" --slug="phien-ban" --type=select --user=1

# Lấy attribute ID
wp wc product_attribute list --user=1 --fields=id,name,slug
```

---

## 3. ACF Custom Fields cho Product Specs

### Khi nào dùng ACF

Dùng ACF khi sản phẩm cần **thông số kỹ thuật riêng** không có trong WooCommerce mặc định:
- Xe hơi: km range, acceleration 0-100, mã lực, dung tích pin
- Bất động sản: diện tích, số phòng, tầng, hướng nhà
- Thiết bị: trọng lượng, kích thước, công suất
- Bất kỳ spec nào cần hiển thị nổi bật

### Tạo ACF Field Group via WP-CLI

```bash
# Tạo field group cho product specs
wp eval '
$group = acf_add_local_field_group([
    "key" => "group_product_specs",
    "title" => "Thông số kỹ thuật",
    "fields" => [
        [
            "key" => "field_km_range",
            "label" => "Phạm vi (km)",
            "name" => "km_range",
            "type" => "number",
            "prefix" => "",
            "append" => "km",
        ],
        [
            "key" => "field_acceleration",
            "label" => "Tăng tốc 0-100 (giây)",
            "name" => "acceleration",
            "type" => "number",
            "append" => "s",
        ],
        [
            "key" => "field_horsepower",
            "label" => "Mã lực (hp)",
            "name" => "horsepower",
            "type" => "number",
            "append" => "hp",
        ],
        [
            "key" => "field_color_options",
            "label" => "Màu sắc",
            "name" => "color_options",
            "type" => "repeater",
            "sub_fields" => [
                [
                    "key" => "field_color_name",
                    "label" => "Tên màu",
                    "name" => "color_name",
                    "type" => "text",
                ],
                [
                    "key" => "field_color_hex",
                    "label" => "Mã màu",
                    "name" => "color_hex",
                    "type" => "color_picker",
                ],
            ],
        ],
    ],
    "location" => [
        [
            [
                "param" => "post_type",
                "operator" => "==",
                "value" => "product",
            ],
        ],
    ],
]);
'
```

### Hoặc tạo bằng JSON import (khuyến nghị)

```bash
# Tạo file JSON
cat > /tmp/acf-product-specs.json << 'JSON'
[
  {
    "key": "group_product_specs",
    "title": "Thông số kỹ thuật",
    "fields": [
      {"key":"field_km_range","label":"Phạm vi (km)","name":"km_range","type":"number","append":"km"},
      {"key":"field_acceleration","label":"Tăng tốc 0-100","name":"acceleration","type":"number","append":"s"},
      {"key":"field_horsepower","label":"Mã lực","name":"horsepower","type":"number","append":"hp"},
      {"key":"field_badge","label":"Badge / Nhãn","name":"badge","type":"text"},
      {"key":"field_gallery_extra","label":"Ảnh bổ sung","name":"gallery_extra","type":"gallery"}
    ],
    "location": [[{"param":"post_type","operator":"==","value":"product"}]],
    "active": true
  }
]
JSON

# Import vào WP
wp eval 'acf_import_field_group(json_decode(file_get_contents("/tmp/acf-product-specs.json"), true)[0]);'
```

### Gán spec cho product

```bash
# Cập nhật ACF field cho product ID
wp post meta update PRODUCT_ID km_range 457
wp post meta update PRODUCT_ID acceleration 5.9
wp post meta update PRODUCT_ID horsepower 349
wp post meta update PRODUCT_ID badge "Xe điện"
```

### Hiển thị ACF specs trong shortcode/template

```php
// Trong child theme functions.php — thêm spec bar sau product excerpt
add_action('woocommerce_single_product_summary', function() {
    $km   = get_field('km_range');
    $acc  = get_field('acceleration');
    $hp   = get_field('horsepower');
    if (!$km && !$acc && !$hp) return;
    echo '<div class="vf-spec-bar">';
    if ($km)  echo "<span><strong>{$km}</strong><small>km</small></span>";
    if ($acc) echo "<span><strong>{$acc}s</strong><small>0-100km/h</small></span>";
    if ($hp)  echo "<span><strong>{$hp}</strong><small>hp</small></span>";
    echo '</div>';
}, 25);
```

---

## 4. Shop Archive Page Custom Layout

### Cách Flatsome xử lý shop page

Flatsome dùng **Shop Header Block** (UX Builder) để customize phần trên shop page, và hooks để thay toàn bộ layout.

### Phương án A — Shop Header Block (nhẹ, đủ cho 80% case)

```bash
# Tạo nội dung cho shop header block
wp option update flatsome_shop_header_block '
[section bg_color="#0a1628" dark="true" padding="60px 0" padding__sm="40px 0"]
  [row h_align="center"]
    [col span="8" span__sm="12" align="center"]
      [ux_text]<p class="vf-shop-badge">GIẢI PHÁP DI CHUYỂN XANH</p>[/ux_text]
      [ux_text]<h1 class="vf-shop-title">Ô tô VinFast</h1>[/ux_text]
      [ux_text]<p class="vf-shop-sub">Kiến tạo tương lai xanh với hệ sinh thái xe điện thông minh</p>[/ux_text]
    [/col]
  [/row]
[/section]
'
```

### Phương án B — Override toàn bộ shop template (pixel-perfect)

```bash
# Copy WooCommerce template vào child theme
mkdir -p $(wp eval "echo get_stylesheet_directory();")/woocommerce/archive-product/
```

Tạo file `flatsome-child/woocommerce/archive-product.php`:
```php
<?php
defined('ABSPATH') || exit;
get_header('shop');
?>
<div class="vf-shop-wrap">
  <!-- Category filter tabs -->
  <div class="vf-filter-tabs">
    <button class="vf-tab active" data-filter="*">Tất cả</button>
    <?php foreach (get_terms(['taxonomy' => 'product_cat', 'hide_empty' => true]) as $cat): ?>
    <button class="vf-tab" data-filter=".cat-<?= $cat->slug ?>"><?= $cat->name ?></button>
    <?php endforeach; ?>
    <div class="vf-sort-wrap">
      <?php woocommerce_catalog_ordering(); ?>
    </div>
  </div>

  <!-- Product grid -->
  <div class="vf-product-grid">
    <?php if (woocommerce_product_loop()): ?>
      <?php woocommerce_product_loop_start(); ?>
        <?php while (have_posts()): the_post(); ?>
          <?php wc_get_template_part('content', 'product'); ?>
        <?php endwhile; ?>
      <?php woocommerce_product_loop_end(); ?>
      <?php woocommerce_pagination(); ?>
    <?php else: ?>
      <?php do_action('woocommerce_no_products_found'); ?>
    <?php endif; ?>
  </div>
</div>
<?php get_footer('shop'); ?>
```

### Custom product card (content-product.php)

Tạo `flatsome-child/woocommerce/content-product.php`:
```php
<?php
defined('ABSPATH') || exit;
global $product;
$cats = wp_get_post_terms(get_the_ID(), 'product_cat');
$cat_classes = implode(' ', array_map(fn($c) => 'cat-' . $c->slug, $cats));
?>
<div class="vf-product-card <?= $cat_classes ?>">
  <div class="vf-card-image">
    <a href="<?= get_permalink() ?>">
      <?= woocommerce_get_product_image() ?>
    </a>
    <?php $badge = get_field('badge'); if ($badge): ?>
      <span class="vf-card-badge"><?= $badge ?></span>
    <?php endif; ?>
  </div>
  <div class="vf-card-body">
    <h3 class="vf-card-title"><a href="<?= get_permalink() ?>"><?= get_the_title() ?></a></h3>
    <p class="vf-card-cat"><?= implode(', ', array_column($cats, 'name')) ?></p>
    <div class="vf-card-price"><?= $product->get_price_html() ?></div>
    <?php
    $km  = get_field('km_range');
    $acc = get_field('acceleration');
    $hp  = get_field('horsepower');
    if ($km || $acc || $hp): ?>
    <div class="vf-card-specs">
      <?php if ($km):  ?><span class="vf-spec"><strong><?= $km ?></strong><small>km</small></span><?php endif; ?>
      <?php if ($acc): ?><span class="vf-spec"><strong><?= $acc ?>s</strong><small>0-100</small></span><?php endif; ?>
      <?php if ($hp):  ?><span class="vf-spec"><strong><?= $hp ?></strong><small>hp</small></span><?php endif; ?>
    </div>
    <?php endif; ?>
    <div class="vf-card-actions">
      <a href="<?= get_permalink() ?>" class="vf-btn-outline">Xem chi tiết</a>
      <a href="<?= get_permalink() ?>#dat-coc" class="vf-btn-primary">Đặt cọc ngay</a>
    </div>
  </div>
</div>
```

### CSS cho shop archive

```css
/* vf- prefix = VinFast project — đổi theo project */
.vf-shop-wrap { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

.vf-filter-tabs {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-bottom: 32px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px;
}
.vf-tab {
  padding: 8px 20px; border: 1px solid #d1d5db; border-radius: 50px;
  background: #fff; cursor: pointer; font-size: 14px; font-weight: 500;
  transition: all 0.2s;
}
.vf-tab.active, .vf-tab:hover {
  background: #1d4ed8; color: #fff; border-color: #1d4ed8;
}

.vf-product-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 849px) { .vf-product-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 549px) { .vf-product-grid { grid-template-columns: 1fr; } }

.vf-product-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.vf-product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.14); }

.vf-card-image { position: relative; overflow: hidden; }
.vf-card-image img { width: 100%; height: 220px; object-fit: contain; padding: 16px; }
.vf-card-badge {
  position: absolute; top: 12px; left: 12px;
  background: #1d4ed8; color: #fff; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 50px; text-transform: uppercase;
}

.vf-card-body { padding: 16px 20px 20px; }
.vf-card-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.vf-card-title a { color: #111827; text-decoration: none; }
.vf-card-cat { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
.vf-card-price { font-size: 15px; color: #1d4ed8; font-weight: 600; margin-bottom: 12px; }

.vf-card-specs {
  display: flex; gap: 16px; padding: 12px 0;
  border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
  margin-bottom: 16px;
}
.vf-spec { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.vf-spec strong { font-size: 15px; font-weight: 700; color: #111827; }
.vf-spec small { font-size: 11px; color: #9ca3af; }

.vf-card-actions { display: flex; gap: 8px; }
.vf-btn-outline, .vf-btn-primary {
  flex: 1; padding: 9px 12px; border-radius: 6px; font-size: 13px;
  font-weight: 600; text-align: center; text-decoration: none;
  transition: all 0.2s; display: block;
}
.vf-btn-outline { border: 1.5px solid #d1d5db; color: #374151; background: #fff; }
.vf-btn-outline:hover { border-color: #1d4ed8; color: #1d4ed8; }
.vf-btn-primary { background: #1d4ed8; color: #fff; border: 1.5px solid #1d4ed8; }
.vf-btn-primary:hover { background: #1e40af; }
```

---

## 5. Single Product Page Custom Layout

### Cách hoạt động: Flatsome Product Block

Flatsome cho phép tạo **Product Page Block** — một UX Builder block riêng dành cho trang sản phẩm. Đây là cách chuyên nghiệp nhất (không cần override template).

**Bước 1 — Tạo Product Page Block trong WP Admin:**

```bash
# Tạo block via WP-CLI
wp post create \
  --post_type=ux_block \
  --post_title="Custom Product Layout" \
  --post_status=publish \
  --post_content='SHORTCODE_CONTENT_BELOW'
```

**Shortcode content cho product block:**

```
[section padding="60px 0" padding__sm="30px 0"]
[row]

[col span="6" span__sm="12"]
[ux_product_gallery style="default" thumbnails="bottom" thumbnails_aspect="1:1"]
[/col]

[col span="6" span__sm="12" padding="0 0 0 30px" padding__sm="20px 0 0"]
[ux_product_breadcrumbs]
[ux_product_title]
[ux_product_rating]
[ux_product_price]

[gap height="8px"]

[section bg_color="#f8fafc" padding="16px" class="vf-spec-section"]
[row_inner]
[col_inner span="4" span__sm="4" align="center" class="vf-spec-col"]
[ux_html]
<div class="vf-spec-item">
  <span class="vf-spec-val" data-acf="km_range">--</span>
  <span class="vf-spec-label">km</span>
</div>
[/ux_html]
[/col_inner]
[col_inner span="4" span__sm="4" align="center" class="vf-spec-col"]
[ux_html]
<div class="vf-spec-item">
  <span class="vf-spec-val" data-acf="acceleration">--</span>
  <span class="vf-spec-label">0-100 km/h</span>
</div>
[/ux_html]
[/col_inner]
[col_inner span="4" span__sm="4" align="center" class="vf-spec-col"]
[ux_html]
<div class="vf-spec-item">
  <span class="vf-spec-val" data-acf="horsepower">--</span>
  <span class="vf-spec-label">hp</span>
</div>
[/ux_html]
[/col_inner]
[/row_inner]
[/section]

[gap height="16px"]
[ux_product_excerpt]
[ux_product_add_to_cart]
[ux_product_meta]
[/col]

[/row]
[/section]

[ux_product_tabs]

[section padding="60px 0"]
[ux_products title="Các dòng xe liên quan" type="related" columns="4" columns__sm="2"]
[/section]
```

**Bước 2 — Gán block cho toàn bộ products:**

```bash
# Lấy ID của block vừa tạo
BLOCK_ID=$(wp post list --post_type=ux_block --fields=ID,post_title | grep "Custom Product" | awk '{print $1}')

# Gán làm default product page block
wp option update flatsome_product_block $BLOCK_ID
```

**Bước 3 — Inject ACF data vào spec bar bằng JS:**

```php
// Trong child theme functions.php
add_action('wp_footer', function() {
    if (!is_product()) return;
    $product_id = get_the_ID();
    $specs = [
        'km_range'     => get_field('km_range', $product_id),
        'acceleration' => get_field('acceleration', $product_id),
        'horsepower'   => get_field('horsepower', $product_id),
    ];
    ?>
    <script>
    (function(){
        var specs = <?= json_encode($specs) ?>;
        document.querySelectorAll('[data-acf]').forEach(function(el){
            var key = el.getAttribute('data-acf');
            if (specs[key]) el.textContent = specs[key];
        });
    })();
    </script>
    <?php
});
```

---

## 6. Custom Tabs trên Product Page

### Flatsome native tabs trong Product Block

```
[ux_product_tabs style="tabs"]
```

### Thêm custom tab bằng filter

```php
// Trong child theme functions.php
add_filter('woocommerce_product_tabs', function($tabs) {
    // Thêm tab Thông số kỹ thuật
    $tabs['specs'] = [
        'title'    => 'Thông số',
        'priority' => 25,
        'callback' => 'vf_specs_tab_content',
    ];
    // Thêm tab Bảo hành
    $tabs['warranty'] = [
        'title'    => 'Bảo hành',
        'priority' => 30,
        'callback' => 'vf_warranty_tab_content',
    ];
    // Xóa tab mặc định nếu không cần
    // unset($tabs['reviews']);
    // unset($tabs['description']);
    return $tabs;
});

function vf_specs_tab_content() {
    global $product;
    $km  = get_field('km_range', $product->get_id());
    $acc = get_field('acceleration', $product->get_id());
    $hp  = get_field('horsepower', $product->get_id());
    echo '<table class="vf-specs-table shop_attributes">';
    echo '<tbody>';
    if ($km)  echo "<tr><th>Phạm vi</th><td>{$km} km</td></tr>";
    if ($acc) echo "<tr><th>Tăng tốc 0-100</th><td>{$acc} giây</td></tr>";
    if ($hp)  echo "<tr><th>Mã lực</th><td>{$hp} hp</td></tr>";
    // Lấy attributes WooCommerce
    foreach ($product->get_attributes() as $attr) {
        $name = wc_attribute_label($attr->get_name());
        $vals = $attr->get_terms()
            ? implode(', ', wp_list_pluck($attr->get_terms(), 'name'))
            : $attr->get_options();
        if (is_array($vals)) $vals = implode(', ', $vals);
        echo "<tr><th>{$name}</th><td>{$vals}</td></tr>";
    }
    echo '</tbody></table>';
}

function vf_warranty_tab_content() {
    echo '<div class="vf-warranty-content">';
    echo '<p>Bảo hành pin: <strong>10 năm hoặc 250.000 km</strong></p>';
    echo '<p>Bảo hành xe: <strong>5 năm hoặc 150.000 km</strong></p>';
    echo '</div>';
}
```

### CSS cho tabs

```css
.vf-specs-table { width: 100%; border-collapse: collapse; }
.vf-specs-table th, .vf-specs-table td {
    padding: 12px 16px; text-align: left;
    border-bottom: 1px solid #f3f4f6; font-size: 14px;
}
.vf-specs-table th { font-weight: 600; width: 200px; color: #374151; }
.vf-specs-table tr:nth-child(even) { background: #f9fafb; }
```

---

## 7. Product Card (Box) Customization

### Override product card via hook (không cần override template)

```php
// Hiển thị ACF specs dưới giá trong product card (archive page)
add_action('woocommerce_after_shop_loop_item_title', function() {
    global $product;
    $km  = get_field('km_range', $product->get_id());
    $acc = get_field('acceleration', $product->get_id());
    $hp  = get_field('horsepower', $product->get_id());
    if (!$km && !$acc && !$hp) return;
    echo '<div class="vf-loop-specs">';
    if ($km)  echo "<span>{$km} km</span>";
    if ($acc) echo "<span>{$acc}s</span>";
    if ($hp)  echo "<span>{$hp} hp</span>";
    echo '</div>';
}, 15);

// Thêm badge lên product card
add_action('woocommerce_before_shop_loop_item', function() {
    global $product;
    $badge = get_field('badge', $product->get_id());
    if ($badge) echo "<span class=\"vf-loop-badge\">{$badge}</span>";
}, 5);

// Thay button "Thêm vào giỏ" → "Đặt cọc ngay"
add_filter('woocommerce_loop_add_to_cart_link', function($html, $product) {
    $url = get_permalink($product->get_id());
    return "<a href=\"{$url}#dat-coc\" class=\"button vf-btn-deposit\">Đặt cọc ngay</a>";
}, 10, 2);
```

### Flatsome product box hooks (vị trí inject)

```
flatsome_product_box_tools_top      → Góc trên của ảnh (wishlist, quick view)
flatsome_product_box_tools_bottom   → Góc dưới ảnh
flatsome_product_box_actions        → Thay thế add-to-cart button
flatsome_product_box_after          → Sau toàn bộ product card
woocommerce_before_shop_loop_item   → Trước card (badge overlay)
woocommerce_after_shop_loop_item_title → Dưới tên sản phẩm
woocommerce_after_shop_loop_item    → Sau card (extra info)
```

---

## 8. Catalog Mode (Không có Add-to-Cart)

Dùng khi site là **catalog/brochure** — chỉ hiển thị sản phẩm, không bán online.

### Bật Catalog Mode trong Flatsome

```bash
# Via Flatsome theme options
wp option update flatsome_woo_catalog_mode 1

# Xác nhận
wp option get flatsome_woo_catalog_mode
```

### Tùy chỉnh Catalog Mode (nếu cần nút tùy chỉnh)

```php
// Xóa add-to-cart hoàn toàn + thay bằng nút "Xem chi tiết"
add_filter('woocommerce_is_purchasable', '__return_false');

// Thêm nút Liên hệ vào single product
add_action('woocommerce_single_product_summary', function() {
    $url = get_permalink(get_option('page_on_front')); // link trang liên hệ
    echo '<div class="vf-catalog-actions">';
    echo "<a href=\"{$url}#lien-he\" class=\"button alt vf-btn-contact\">Liên hệ tư vấn</a>";
    echo "<a href=\"tel:18009999\" class=\"button vf-btn-call\">1800 9999</a>";
    echo '</div>';
}, 30);
```

---

## 9. Filter Tabs theo Category

### Phương án A — WordPress native (page reload)

```php
// Shortcode tạo filter tabs
add_shortcode('vf_filter_tabs', function() {
    $categories = get_terms(['taxonomy' => 'product_cat', 'hide_empty' => true, 'parent' => 0]);
    $current_cat = is_product_category() ? get_queried_object() : null;
    $shop_url    = get_permalink(wc_get_page_id('shop'));

    ob_start();
    echo '<div class="vf-filter-nav">';
    $active = (!$current_cat) ? 'active' : '';
    echo "<a href=\"{$shop_url}\" class=\"vf-filter-btn {$active}\">Tất cả</a>";
    foreach ($categories as $cat) {
        $active = ($current_cat && $current_cat->slug === $cat->slug) ? 'active' : '';
        $url    = get_term_link($cat);
        echo "<a href=\"{$url}\" class=\"vf-filter-btn {$active}\">{$cat->name}</a>";
    }
    echo '</div>';
    return ob_get_clean();
});
```

Dùng trong UX Builder:
```
[vf_filter_tabs]
[ux_products columns="3" columns__sm="2" orderby="date" order="DESC"]
```

### Phương án B — AJAX filter (không reload trang)

```php
// Trong functions.php
add_action('wp_enqueue_scripts', function() {
    if (!is_shop() && !is_product_category()) return;
    wp_enqueue_script('vf-filter', get_stylesheet_directory_uri() . '/js/vf-filter.js', ['jquery'], '1.0', true);
    wp_localize_script('vf-filter', 'vfAjax', [
        'url'   => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('vf_filter'),
    ]);
});

add_action('wp_ajax_nopriv_vf_filter_products', 'vf_ajax_filter_products');
add_action('wp_ajax_vf_filter_products', 'vf_ajax_filter_products');

function vf_ajax_filter_products() {
    check_ajax_referer('vf_filter', 'nonce');
    $cat_slug = sanitize_text_field($_POST['category'] ?? '');
    $args = [
        'post_type'      => 'product',
        'posts_per_page' => 12,
        'post_status'    => 'publish',
    ];
    if ($cat_slug && $cat_slug !== 'all') {
        $args['tax_query'] = [['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => $cat_slug]];
    }
    $q = new WP_Query($args);
    ob_start();
    if ($q->have_posts()) {
        while ($q->have_posts()) { $q->the_post(); wc_get_template_part('content', 'product'); }
    }
    wp_reset_postdata();
    echo ob_get_clean();
    wp_die();
}
```

```js
// flatsome-child/js/vf-filter.js
jQuery(function($){
    $('.vf-filter-btn').on('click', function(e){
        e.preventDefault();
        var cat = $(this).data('cat');
        $('.vf-filter-btn').removeClass('active');
        $(this).addClass('active');
        $('.vf-product-grid').addClass('loading');
        $.post(vfAjax.url, {
            action: 'vf_filter_products',
            category: cat,
            nonce: vfAjax.nonce,
        }, function(res){
            $('.vf-product-grid').html(res).removeClass('loading');
        });
    });
});
```

---

## 10. Color & Variant Selector

### Hiển thị color swatches (không phải dropdown)

**Plugin khuyến nghị:** Variation Swatches for WooCommerce (free)

```bash
wp plugin install variation-swatches-for-woocommerce --activate
```

Sau khi cài, đổi attribute type từ "Select" → "Color" trong:
`WP Admin > Products > Attributes > Edit [Màu sắc] > Type: Color`

### Hiển thị color options từ ACF (không dùng WooCommerce variations)

```php
// Hiển thị color dots từ ACF repeater
add_action('woocommerce_single_product_summary', function() {
    if (!function_exists('get_field')) return;
    $colors = get_field('color_options');
    if (!$colors) return;
    echo '<div class="vf-color-selector">';
    echo '<p class="vf-color-label">Màu sắc:</p>';
    echo '<div class="vf-color-dots">';
    foreach ($colors as $i => $c) {
        $active = ($i === 0) ? 'active' : '';
        echo "<span class=\"vf-color-dot {$active}\" 
                   style=\"background:{$c['color_hex']}\" 
                   title=\"{$c['color_name']}\"
                   data-color=\"{$c['color_name']}\"></span>";
    }
    echo '</div>';
    echo '<span class="vf-selected-color"></span>';
    echo '</div>';
}, 20);

add_action('wp_footer', function() {
    if (!is_product()) return;
    ?>
    <script>
    document.querySelectorAll('.vf-color-dot').forEach(function(dot){
        dot.addEventListener('click', function(){
            document.querySelectorAll('.vf-color-dot').forEach(function(d){ d.classList.remove('active'); });
            this.classList.add('active');
            var label = document.querySelector('.vf-selected-color');
            if (label) label.textContent = this.getAttribute('data-color');
        });
    });
    </script>
    <?php
});
```

```css
.vf-color-selector { margin: 16px 0; }
.vf-color-label { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.vf-color-dots { display: flex; gap: 8px; flex-wrap: wrap; }
.vf-color-dot {
    width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
    border: 2px solid transparent; transition: all 0.2s;
}
.vf-color-dot.active { border-color: #1d4ed8; transform: scale(1.15); }
.vf-color-dot:hover { transform: scale(1.1); }
.vf-selected-color { font-size: 13px; color: #6b7280; margin-left: 8px; }
```

---

## 11. WooCommerce Hooks trong Flatsome

### Single Product — Thứ tự hook mặc định

```
woocommerce_before_single_product_summary
  → flatsome_before_product_images (priority 5)
  → product gallery (priority 10)
  → flatsome_after_product_images (priority 20)

woocommerce_single_product_summary
  → woocommerce_template_single_title       (priority 5)
  → woocommerce_template_single_rating      (priority 10)
  → woocommerce_template_single_price       (priority 10)
  → woocommerce_template_single_excerpt     (priority 20)
  → woocommerce_template_single_add_to_cart (priority 30)
  → woocommerce_template_single_meta        (priority 40)
  → woocommerce_template_single_sharing     (priority 50)

woocommerce_after_single_product_summary
  → woocommerce_output_product_data_tabs    (priority 10)
  → woocommerce_upsell_display              (priority 15)
  → woocommerce_output_related_products     (priority 20)
```

### Thứ tự hook mặc định — Product Archive (shop)

```
woocommerce_before_shop_loop
  → woocommerce_result_count (priority 20)
  → woocommerce_catalog_ordering (priority 30)

woocommerce_before_shop_loop_item
woocommerce_before_shop_loop_item_title
  → woocommerce_show_product_loop_sale_flash (priority 10)
  → woocommerce_template_loop_product_thumbnail (priority 10)
woocommerce_shop_loop_item_title
woocommerce_after_shop_loop_item_title
  → woocommerce_template_loop_rating (priority 5)
  → woocommerce_template_loop_price (priority 10)
woocommerce_after_shop_loop_item
  → woocommerce_template_loop_add_to_cart (priority 10)

woocommerce_after_shop_loop
  → woocommerce_pagination (priority 10)
```

### Flatsome-specific product hooks

```php
// Thêm nội dung vào INFO BOX (4 icons dưới hero)
add_action('flatsome_before_product_page', function() { /* above product */ });
add_action('flatsome_after_product_page', function() { /* below product */ });

// Thay đổi product card class
add_filter('flatsome_product_box_classes', function($classes, $product) {
    // Thêm class theo category
    $cats = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'slugs']);
    return $classes . ' cat-' . implode(' cat-', $cats);
}, 10, 2);

// Custom label (sale badge)
add_filter('flatsome_product_labels', function($labels, $product) {
    $badge = get_field('badge', $product->get_id());
    if ($badge) {
        $labels[] = "<span class=\"onsale vf-custom-label\">{$badge}</span>";
    }
    return $labels;
}, 10, 2);
```

---

## 12. Deployment Checklist

### Sau khi build xong — chạy theo thứ tự

```bash
# 1. Verify WooCommerce pages
wp post list --post_type=page --fields=ID,post_title | grep -E "Shop|Cart|Checkout"

# 2. Assign shop page
wp option update woocommerce_shop_page_id SHOP_PAGE_ID

# 3. Flush rewrite rules (BẮT BUỘC sau khi đổi permalink)
wp rewrite flush --hard

# 4. Clear cache
wp cache flush

# 5. Kiểm tra sản phẩm hiển thị
wp wc product list --user=1 --fields=id,name,status | head -10

# 6. Test product URL
wp eval "echo get_permalink(wc_get_page_id('shop'));"

# 7. Regenerate thumbnails (nếu ảnh bị sai kích thước)
wp media regenerate --yes

# 8. Kiểm tra ACF fields đã gán đúng
wp post meta get PRODUCT_ID km_range
wp post meta get PRODUCT_ID acceleration
wp post meta get PRODUCT_ID horsepower

# 9. Xác nhận child theme active
wp theme list --status=active
```

### Enqueue JS file trong child theme

```php
// Trong functions.php — load script chỉ khi cần
add_action('wp_enqueue_scripts', function() {
    if (is_shop() || is_product_category()) {
        wp_enqueue_script(
            'vf-filter',
            get_stylesheet_directory_uri() . '/js/vf-filter.js',
            ['jquery'], filemtime(get_stylesheet_directory() . '/js/vf-filter.js'), true
        );
        wp_localize_script('vf-filter', 'vfAjax', [
            'url'   => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('vf_filter'),
        ]);
    }
    if (is_product()) {
        wp_enqueue_script(
            'vf-product',
            get_stylesheet_directory_uri() . '/js/vf-product.js',
            ['jquery'], filemtime(get_stylesheet_directory() . '/js/vf-product.js'), true
        );
    }
});
```

---

## 13. Debugging WooCommerce

| Triệu chứng | Nguyên nhân | Fix |
|---|---|---|
| Shop page trắng/lỗi | WooCommerce chưa chỉ định shop page | `wp option update woocommerce_shop_page_id ID` |
| Sản phẩm không hiện | `post_status` không phải `publish` | `wp wc product update ID --status=publish --user=1` |
| ACF field trả về null | Field group chưa gán đúng post type | Kiểm tra location rules trong ACF |
| Shortcode `[ux_products]` rỗng | WooCommerce chưa kích hoạt | `wp plugin activate woocommerce` |
| Product template không load | Template không đặt đúng thư mục | Đường dẫn phải là `child-theme/woocommerce/` |
| Giá không hiển thị | `regular_price` chưa set | `wp wc product update ID --regular_price="740000000" --user=1` |
| Tabs bị trùng | Hook priority xung đột | Remove built-in tab trước: `unset($tabs['description'])` |
| AJAX filter không hoạt động | Nonce mismatch | Kiểm tra `vfAjax.nonce` trong browser console |
| Color swatches không hiển thị | Plugin chưa kích hoạt hoặc type chưa đổi | Vào Attributes > Type = Color |

```bash
# Debug: xem toàn bộ meta của 1 product
wp post meta list PRODUCT_ID --format=table

# Debug: xem WooCommerce options
wp option list --search="woocommerce_*" --format=table | head -30

# Debug: force delete cache WooCommerce
wp wc tool run clear_transients --user=1
```
