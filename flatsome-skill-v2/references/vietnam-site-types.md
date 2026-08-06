# Vietnam Site Types — Nhà hàng, Bất động sản, Phòng khám, Du lịch, Giáo dục

> Workflow + shortcode patterns cho các loại website phổ biến ở thị trường Việt Nam.
> Mỗi loại có đặc thù riêng về layout, CPT, form, tích hợp bên thứ ba.

---

## Nhận dạng nhanh

| Khách hàng nói | Loại site | Section §  |
|---|---|---|
| Quán ăn, nhà hàng, cafe, bar | Nhà hàng / F&B | §1 |
| Bán nhà, cho thuê, dự án BĐS | Bất động sản | §2 |
| Phòng khám, nha khoa, spa | Y tế / Làm đẹp | §3 |
| Tour du lịch, khách sạn, homestay | Du lịch | §4 |
| Trường học, trung tâm, khóa học | Giáo dục | §5 |
| Xưởng sx, nhà máy, B2B | Doanh nghiệp sản xuất | §6 |

---

## §1 — Nhà hàng / Cafe / F&B

### Đặc trưng
- Menu thực đơn (có thể dùng WooCommerce Catalog hoặc custom CPT)
- Gallery ảnh món ăn / không gian
- Giờ mở cửa, địa chỉ nổi bật
- Form đặt bàn (Contact Form 7)
- Google Maps embed
- Zalo/Messenger CTA nổi

### Page Architecture
```
Trang chủ: Hero ảnh món → About ngắn → Menu nổi bật → Gallery → Đặt bàn CTA → Địa chỉ + Maps
Menu: Thực đơn theo danh mục (tab hoặc scroll)
Về chúng tôi: Câu chuyện thương hiệu + đội ngũ
Liên hệ: Form đặt bàn + Maps + giờ mở cửa
```

### Menu Thực đơn bằng Tab (không cần WooCommerce)

```wordpress
[section bg_color="#ffffff" padding="60px 0" class="vf-menu-section"]
  [row h_align="center"][col span="10" span__sm="12"]
    [ux_text text_align="center"]<h2 class="vf-menu-title">Thực đơn</h2>[/ux_text]
    [gap height="32px"]
    [tabgroup style="pills" align="center"]
      [tab title="Món chính"]
        [row][col span="4" span__sm="12" class="vf-menu-card"]
          [ux_image id="IMG_ID" height="220px" image_size="medium"]
          [ux_text]<h4 class="vf-dish-name">Phở bò tái</h4>
          <p class="vf-dish-desc">Nước dùng ninh xương 12 tiếng</p>
          <span class="vf-dish-price">85.000đ</span>[/ux_text]
        [/col][/row]
      [/tab]
      [tab title="Đồ uống"]
        ...
      [/tab]
      [tab title="Tráng miệng"]
        ...
      [/tab]
    [/tabgroup]
  [/col][/row]
[/section]
```

### Form Đặt bàn (Contact Form 7)

```
Contact Form 7 template:
<p>Họ tên: [text* your-name placeholder "Họ tên của bạn"]</p>
<p>Số điện thoại: [tel* phone placeholder "0912 345 678"]</p>
<p>Ngày đặt: [date* booking-date min:today]</p>
<p>Giờ đến: [select* booking-time "11:00" "12:00" "13:00" "18:00" "19:00" "20:00"]</p>
<p>Số người: [number* guests min:1 max:20 placeholder "Số người"]</p>
<p>Ghi chú: [textarea your-message placeholder "Yêu cầu đặc biệt..."]</p>
[submit "Đặt bàn ngay"]
```

### Giờ mở cửa Widget

```wordpress
[row style="collapse" class="vf-hours-row"]
  [col span="6" span__sm="12" bg_color="#f8f5f0" padding="30px"]
    [ux_text]
      <h4 class="vf-hours-title">🕐 Giờ mở cửa</h4>
      <table class="vf-hours-table">
        <tr><td>Thứ 2 – Thứ 6</td><td>10:00 – 22:00</td></tr>
        <tr><td>Thứ 7 – Chủ nhật</td><td>09:00 – 23:00</td></tr>
      </table>
    [/ux_text]
  [/col]
  [col span="6" span__sm="12" bg_color="#f0ede8" padding="30px"]
    [ux_text]
      <h4 class="vf-hours-title">📍 Địa chỉ</h4>
      <p>123 Đường ABC, Quận 1, TP.HCM</p>
      <a href="https://maps.google.com/?q=..." class="vf-map-link">Xem bản đồ →</a>
    [/ux_text]
  [/col]
[/row]
```

### CSS F&B

```css
.vf-menu-title { font-family: 'Playfair Display', serif; }
.vf-dish-name  { font-size: 16px; font-weight: 600; margin: 8px 0 4px; }
.vf-dish-desc  { font-size: 13px; color: #888; margin: 0 0 8px; }
.vf-dish-price { color: #c0392b; font-size: 15px; font-weight: 700; }
.vf-hours-table { width: 100%; border-collapse: collapse; }
.vf-hours-table td { padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
```

---

## §2 — Bất động sản

### Đặc trưng
- Danh sách dự án / bất động sản (CPT hoặc WooCommerce Catalog)
- Filter theo loại, giá, quận/huyện
- Trang chi tiết: gallery, thông số, vị trí, form liên hệ
- Map tích hợp
- Hotline nổi

### Page Architecture
```
Trang chủ: Hero + Tìm kiếm BĐS → Dự án nổi bật → Loại hình → Về chúng tôi → CTA
Dự án: Grid listing có filter (loại hình / giá / vị trí)
Chi tiết dự án: Gallery slider → Thông số → Map → Form liên hệ
Về chúng tôi: Kinh nghiệm, thành tích, đội ngũ
Liên hệ: Form + địa chỉ
```

### WP-CLI: Tạo BĐS CPT

```bash
# Tạo custom post type "du_an" (Dự án BĐS)
wp --path=$WPPATH eval '
$args = [
    "label"               => "Dự án BĐS",
    "public"              => true,
    "has_archive"         => true,
    "supports"            => ["title","editor","thumbnail","excerpt","custom-fields"],
    "rewrite"             => ["slug" => "du-an"],
    "menu_icon"           => "dashicons-building",
    "show_in_rest"        => true,
];
// Lưu vào option để CPT persist
$cpts = get_option("vf_custom_post_types", []);
$cpts["du_an"] = $args;
update_option("vf_custom_post_types", $cpts);
echo "Saved. Add to functions.php to register.";
' --allow-root
```

```php
// functions.php — Register BĐS CPT
add_action('init', function() {
    register_post_type('du_an', [
        'label'          => 'Dự án BĐS',
        'public'         => true,
        'has_archive'    => true,
        'supports'       => ['title','editor','thumbnail','excerpt','custom-fields'],
        'rewrite'        => ['slug' => 'du-an'],
        'menu_icon'      => 'dashicons-building',
        'show_in_rest'   => true,
    ]);

    // Taxonomy: Loại hình
    register_taxonomy('loai_bds', 'du_an', [
        'label'        => 'Loại hình',
        'rewrite'      => ['slug' => 'loai-bds'],
        'hierarchical' => true,
    ]);
});
```

### ACF Fields cho BĐS

```bash
# Tạo ACF field group cho thông số BĐS
wp --path=$WPPATH eval '
$group = [
    "key"      => "group_bds",
    "title"    => "Thông số BĐS",
    "fields"   => [
        ["key"=>"field_dien_tich",  "label"=>"Diện tích", "name"=>"dien_tich",  "type"=>"text",   "append"=>"m²"],
        ["key"=>"field_so_phong",   "label"=>"Số phòng ngủ","name"=>"so_phong", "type"=>"number"],
        ["key"=>"field_gia",        "label"=>"Giá",        "name"=>"gia",        "type"=>"text"],
        ["key"=>"field_dia_chi",    "label"=>"Địa chỉ",    "name"=>"dia_chi",   "type"=>"text"],
        ["key"=>"field_trang_thai", "label"=>"Trạng thái", "name"=>"trang_thai","type"=>"select",
         "choices"=>["dang_ban"=>"Đang bán","da_ban"=>"Đã bán","cho_thue"=>"Cho thuê"]],
        ["key"=>"field_google_maps","label"=>"Google Maps Link","name"=>"google_maps","type"=>"url"],
    ],
    "location" => [[["param"=>"post_type","operator"=>"==","value"=>"du_an"]]],
];
acf_add_local_field_group($group);
echo "ACF fields registered";
' --allow-root 2>/dev/null || echo "ACF not available — add fields via admin"
```

---

## §3 — Y tế / Phòng khám / Spa / Làm đẹp

### Đặc trưng
- Danh sách dịch vụ điều trị
- Đội ngũ bác sĩ / chuyên gia
- Form đặt lịch hẹn
- Chứng nhận, bằng khen (trust signals)
- Trước/Sau (before-after slider)

### Page Architecture
```
Trang chủ: Hero + Dịch vụ nổi bật → Đội ngũ → Kết quả → Feedback → Đặt lịch
Dịch vụ: Grid danh mục → Chi tiết từng dịch vụ
Bác sĩ: Grid profile → Click vào xem chi tiết
Đặt lịch: Form + giờ hoạt động
```

### Form đặt lịch (CF7)

```
Contact Form 7:
<p>Họ tên: [text* your-name placeholder "Họ và tên"]</p>
<p>Số điện thoại: [tel* phone placeholder "Số điện thoại"]</p>
<p>Dịch vụ quan tâm:
[select service
  "Khám tổng quát"
  "Điều trị răng"
  "Da liễu"
  "Tư vấn dinh dưỡng"
]</p>
<p>Ngày mong muốn: [date* booking-date]</p>
<p>Buổi: [radio session "Sáng (8h-12h)" "Chiều (13h-17h)" "Tối (18h-20h)"]</p>
[submit "Đặt lịch ngay"]
```

### Before/After Slider

```wordpress
[section padding="60px 0" class="vf-before-after"]
  [row h_align="center"][col span="8" span__sm="12"]
    [ux_text text_align="center"]<h2>Kết quả thực tế</h2>[/ux_text]
    [gap height="24px"]
    [row slider="true" columns="1" auto_slide="false" arrows="true"]
      [col class="vf-case-item"]
        [row style="collapse"]
          [col span="6"][ux_image id="BEFORE_ID"][ux_text]<p class="vf-ba-label">Trước</p>[/ux_text][/col]
          [col span="6"][ux_image id="AFTER_ID"][ux_text]<p class="vf-ba-label">Sau</p>[/ux_text][/col]
        [/row]
      [/col]
    [/row]
  [/col][/row]
[/section]
```

---

## §4 — Du lịch / Khách sạn / Homestay / Tour

### Đặc trưng
- Tour listing với giá, thời gian, itinerary
- Phòng / villa listing (WooCommerce hoặc CPT)
- Gallery ảnh điểm đến đẹp
- Form booking
- Testimonials du khách
- FAQ về chính sách

### Page Architecture
```
Trang chủ: Hero full-screen video/ảnh → Tour nổi bật → Điểm đến → Tại sao chọn → Đánh giá → CTA đặt tour
Tour/Phòng: Grid listing → Filter (loại, giá, ngày) → Chi tiết
Chi tiết Tour: Gallery → Lịch trình → Giá → Form đặt
Về chúng tôi: Câu chuyện + Điểm mạnh
Liên hệ: Form + bản đồ
```

### Tour CPT + Shortcode listing

```bash
# functions.php — Tour CPT
add_action('init', function() {
    register_post_type('tour', [
        'label'       => 'Tour du lịch',
        'public'      => true,
        'has_archive' => true,
        'supports'    => ['title','editor','thumbnail','excerpt'],
        'rewrite'     => ['slug' => 'tour'],
        'menu_icon'   => 'dashicons-location-alt',
    ]);
    register_taxonomy('diem_den', 'tour', [
        'label'   => 'Điểm đến',
        'rewrite' => ['slug' => 'diem-den'],
    ]);
});
```

### Tour Card Pattern

```wordpress
[section padding="60px 0" class="vf-tour-section"]
  [row]
    [col span="4" span__sm="12" class="vf-tour-card"]
      [ux_banner bg="IMG_ID" height="260px" bg_overlay="rgba(0,0,0,0.15)" link="/tour/da-lat-3n2d/"]
        [text_box position_x="5" position_y="90" width="90"]
          [ux_text]<span class="vf-tour-badge">3N2Đ</span>[/ux_text]
        [/text_box]
      [/ux_banner]
      [ux_text]
        <h3 class="vf-tour-name">Đà Lạt 3 Ngày 2 Đêm</h3>
        <p class="vf-tour-meta">📅 Khởi hành: Thứ 6 hàng tuần</p>
        <div class="vf-tour-footer">
          <span class="vf-tour-price">Từ <strong>1.990.000đ</strong>/người</span>
          [button text="Đặt ngay" link="/tour/da-lat-3n2d/" size="small" radius="4"]
        </div>
      [/ux_text]
    [/col]
  [/row]
[/section]
```

---

## §5 — Giáo dục / Trung tâm / Khóa học

### Đặc trưng
- Danh sách khóa học (CPT hoặc WooCommerce)
- Thông tin giáo viên / giảng viên
- Lịch học / thời khóa biểu
- Form đăng ký học
- Chứng chỉ, kết quả học viên

### Page Architecture
```
Trang chủ: Hero + Khóa học nổi bật → Lợi ích → Giáo viên → Đánh giá → CTA đăng ký
Khóa học: Grid listing → Filter theo cấp độ / chủ đề
Chi tiết khóa: Nội dung chương trình → Giáo viên → Lịch học → Học phí → Form đăng ký
Giáo viên: Grid profiles
Về chúng tôi: Thành tích, cơ sở vật chất
```

### Khóa học CPT + Accordion lịch học

```wordpress
[section padding="60px 0"]
  [row][col span="8" offset="2" span__sm="12"]
    [ux_text]<h2>Chương trình học</h2>[/ux_text]
    [gap height="24px"]
    [accordion]
      [accordion-item title="Module 1: Nhập môn (4 buổi)"]
        <ul>
          <li>Buổi 1: Tổng quan về [môn học]</li>
          <li>Buổi 2: Nền tảng lý thuyết</li>
          <li>Buổi 3: Thực hành cơ bản</li>
          <li>Buổi 4: Kiểm tra Module 1</li>
        </ul>
      [/accordion-item]
      [accordion-item title="Module 2: Nâng cao (6 buổi)"]
        ...
      [/accordion-item]
    [/accordion]
  [/col][/row]
[/section]
```

---

## §6 — Doanh nghiệp sản xuất / B2B

### Đặc trưng
- Catalog sản phẩm không bán online
- Chứng chỉ ISO, tiêu chuẩn
- Năng lực sản xuất
- Form yêu cầu báo giá

### Pattern: Catalog sản phẩm (không có giá / không thể mua)

```bash
# WooCommerce với Catalog mode (ẩn giá + ẩn Add to cart)
wp --path=$WPPATH eval "
// Ẩn giá
add_filter('woocommerce_is_purchasable', '__return_false');
// Tắt add to cart
remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart');
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart');
echo 'Catalog mode instructions generated';
" --allow-root
```

```php
// functions.php — WooCommerce catalog mode
add_action('init', function() {
    remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_price', 10);
});
```

---

## Tích hợp phổ biến thị trường VN

### Zalo Chat Widget

```php
// functions.php
add_action('wp_footer', function() {
    $zalo_id = '0912345678'; // SĐT Zalo OA hoặc cá nhân
    echo '<div class="vf-zalo-btn">
        <a href="https://zalo.me/' . $zalo_id . '" target="_blank" title="Chat Zalo">
            <img src="https://page.widget.zalo.me/static/images/2.0/Logo.svg" alt="Zalo" width="48">
        </a>
    </div>';
});
```

```css
.vf-zalo-btn {
  position: fixed; bottom: 90px; right: 20px; z-index: 9999;
  animation: vf-pulse 2s infinite;
}
.vf-zalo-btn img { border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
```

### Google Maps Embed (VN địa chỉ)

```wordpress
[ux_html]
<div class="vf-map-embed">
  <iframe
    src="https://maps.google.com/maps?q=123+Nguyễn+Huệ,+Quận+1,+TP.HCM&output=embed"
    width="100%" height="400" style="border:0; border-radius:8px;"
    allowfullscreen loading="lazy">
  </iframe>
</div>
[/ux_html]
```

### Hotline nổi (Floating Phone)

```php
add_action('wp_footer', function() {
    $phone = '0912345678';
    echo '<a href="tel:' . $phone . '" class="vf-hotline-btn" title="Gọi ngay">
        <span class="vf-hotline-icon">📞</span>
        <span class="vf-hotline-text">' . $phone . '</span>
    </a>';
});
```

```css
.vf-hotline-btn {
  position: fixed; bottom: 20px; right: 20px; z-index: 9999;
  display: flex; align-items: center; gap: 8px;
  background: #25d366; color: #fff;
  padding: 10px 16px; border-radius: 50px;
  font-weight: 600; font-size: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  text-decoration: none;
  animation: vf-pulse 2s infinite;
}
@media (max-width: 549px) { .vf-hotline-text { display: none; } }
```
