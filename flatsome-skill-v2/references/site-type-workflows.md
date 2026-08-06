# Site Type Workflows — Flatsome

> Dùng khi nhận yêu cầu từ client: xác định loại site → chọn workflow đúng → build hoàn chỉnh
> Phiên bản: Flatsome 3.15+ | WordPress 6.0+

---

## Table of Contents

1. [Site Type Identification](#1-site-type-identification)
2. [Company / Brochure Site](#2-company--brochure-site)
3. [Blog / News Site](#3-blog--news-site)
4. [Portfolio / Agency Site](#4-portfolio--agency-site)
5. [Landing Page (Single Page)](#5-landing-page-single-page)
6. [Common Page Patterns](#6-common-page-patterns)
7. [Multi-page Site Architecture](#7-multi-page-site-architecture)

---

## 1. Site Type Identification

### Bước đầu tiên khi nhận yêu cầu — Hỏi hoặc phân tích

Khi nhận ảnh thiết kế, brief, hoặc yêu cầu từ client, xác định ngay loại site:

| Dấu hiệu nhận dạng | Loại site | Workflow |
|---|---|---|
| Menu: Giới thiệu, Dịch vụ, Liên hệ | Company/Brochure | § 2 |
| Có danh mục sản phẩm, giỏ hàng | WooCommerce | `woocommerce-flatsome-advanced.md` |
| Menu: Blog, Tin tức, Bài viết | Blog/News | § 3 |
| Grid dự án, portfolio, case study | Portfolio | § 4 |
| 1 trang dài, 1 CTA chính | Landing Page | SKILL.md Approach A/B |
| Kết hợp: giới thiệu + blog + liên hệ | Company + Blog | § 2 + § 3 |

### 5 câu hỏi bắt buộc hỏi client

```
1. Site có bán hàng online không? (quyết định dùng WooCommerce hay không)
2. Client cần tự cập nhật nội dung không? (quyết định Approach A vs B)
3. Site có bao nhiêu trang chính?
4. Có logo/brand colors/font cụ thể không?
5. Deploy lên hosting hay chỉ trên LocalWP?
```

### Quyết định approach

```
Blog thường xuyên cập nhật          → Approach A (UX Builder)
Landing page cố định, pixel-perfect  → Approach B (PHP template)
Shop bán hàng                        → Approach C (WooCommerce)
Company + Blog                       → Approach A cho trang chính, WordPress native cho blog
Portfolio tự update dự án            → Approach A + Portfolio CPT
```

---

## 2. Company / Brochure Site

### Kiến trúc trang tiêu chuẩn

```
Trang chủ (Home)
├── Hero banner
├── Dịch vụ nổi bật (3-4 cols)
├── Về chúng tôi (2 col: text + image)
├── Số liệu thống kê (stats bar)
├── Dự án nổi bật / Portfolio preview
├── Testimonials
├── Đối tác / Logo partners
└── CTA cuối trang

Giới thiệu (About)
├── Hero nhỏ
├── Câu chuyện thương hiệu
├── Mission / Vision / Values
├── Team members
└── Timeline / Lịch sử

Dịch vụ (Services)
├── Hero nhỏ
├── Danh sách dịch vụ (icon grid)
├── Pricing table (nếu có)
└── CTA liên hệ

Liên hệ (Contact)
├── Hero nhỏ
├── Form liên hệ (CF7) + thông tin
└── Google Maps

Blog (nếu có) → xem § 3
```

### WP-CLI setup cho Company site

```bash
# Tạo các trang chính
wp post create --post_type=page --post_title="Trang chủ" --post_status=publish --post_name="home"
wp post create --post_type=page --post_title="Giới thiệu" --post_status=publish --post_name="gioi-thieu"
wp post create --post_type=page --post_title="Dịch vụ" --post_status=publish --post_name="dich-vu"
wp post create --post_type=page --post_title="Liên hệ" --post_status=publish --post_name="lien-he"

# Set trang chủ
HOME_ID=$(wp post list --post_type=page --post_name="home" --field=ID)
wp option update show_on_front page
wp option update page_on_front $HOME_ID

# Tạo menu
wp menu create "Main Menu"
wp menu location assign main-menu primary

# Thêm pages vào menu
for SLUG in gioi-thieu dich-vu lien-he; do
  PAGE_ID=$(wp post list --post_type=page --post_name="$SLUG" --field=ID)
  wp menu item add-post main-menu $PAGE_ID
done

wp rewrite flush --hard
```

### Shortcode mẫu — Trang chủ Company Site

```
[ux_banner bg="HERO_IMG_ID" height="600px" height__sm="380px" bg_overlay="rgba(10,10,40,0.55)"]
  [text_box width="70" width__sm="90" position_x="50" position_y="55" text_align="center"]
    [ux_text]<p class="co-tagline">CHUYÊN NGHIỆP · UY TÍN · TẬN TÂM</p>[/ux_text]
    [ux_text]<h1 class="co-hero-title">Giải pháp [tên công ty]<br>cho doanh nghiệp của bạn</h1>[/ux_text]
    [gap height="20px"]
    [button text="Xem dịch vụ" link="/dich-vu" color="primary" size="large"]
    [button text="Liên hệ ngay" link="/lien-he" style="outline" color="white" size="large"]
  [/text_box]
[/ux_banner]

[section bg_color="#fff" padding="70px 0"]
  [row h_align="center"]
    [col span="10" span__sm="12" align="center"]
      [ux_text]<h2 class="co-section-title">Dịch vụ của chúng tôi</h2>[/ux_text]
      [ux_text]<p class="co-section-sub">Mô tả ngắn về dịch vụ tổng thể</p>[/ux_text]
    [/col]
  [/row]
  [gap height="40px"]
  [row]
    [col span="3" span__md="6" span__sm="12"]
      [featured_box img="ICON_ID" img_width="60" pos="top" title="Dịch vụ 1"]Mô tả dịch vụ 1[/featured_box]
    [/col]
    [col span="3" span__md="6" span__sm="12"]
      [featured_box img="ICON_ID" img_width="60" pos="top" title="Dịch vụ 2"]Mô tả dịch vụ 2[/featured_box]
    [/col]
    [col span="3" span__md="6" span__sm="12"]
      [featured_box img="ICON_ID" img_width="60" pos="top" title="Dịch vụ 3"]Mô tả dịch vụ 3[/featured_box]
    [/col]
    [col span="3" span__md="6" span__sm="12"]
      [featured_box img="ICON_ID" img_width="60" pos="top" title="Dịch vụ 4"]Mô tả dịch vụ 4[/featured_box]
    [/col]
  [/row]
[/section]

[section bg_color="#f8fafc" padding="70px 0"]
  [row v_align="middle"]
    [col span="6" span__sm="12"]
      [ux_image id="ABOUT_IMG_ID" image_size="large"]
    [/col]
    [col span="6" span__sm="12" padding="0 0 0 40px" padding__sm="30px 0 0"]
      [ux_text]<p class="co-tagline">VỀ CHÚNG TÔI</p>[/ux_text]
      [ux_text]<h2>Hơn 10 năm kinh nghiệm<br>trong ngành</h2>[/ux_text]
      [gap height="16px"]
      [ux_text]<p>Mô tả về công ty, câu chuyện thương hiệu...</p>[/ux_text]
      [gap height="24px"]
      [button text="Tìm hiểu thêm" link="/gioi-thieu" style="outline" color="primary"]
    [/col]
  [/row]
[/section]

[section bg_color="#1e3a5f" dark="true" padding="60px 0"]
  [row h_align="center" style="collapse"]
    [col span="3" span__sm="6" align="center"]
      [ux_text]<div class="co-stat"><span class="co-stat-num">500+</span><span class="co-stat-label">Dự án hoàn thành</span></div>[/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text]<div class="co-stat"><span class="co-stat-num">10+</span><span class="co-stat-label">Năm kinh nghiệm</span></div>[/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text]<div class="co-stat"><span class="co-stat-num">200+</span><span class="co-stat-label">Khách hàng hài lòng</span></div>[/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text]<div class="co-stat"><span class="co-stat-num">15</span><span class="co-stat-label">Tỉnh thành</span></div>[/ux_text]
    [/col]
  [/row]
[/section]
```

---

## 3. Blog / News Site

### Flatsome Blog Architecture

Flatsome sử dụng WordPress native blog + `[blog_posts]` shortcode cho UX Builder. Không có custom CPT riêng cho blog.

### Setup Blog

```bash
# Tạo trang blog
wp post create --post_type=page --post_title="Blog" --post_status=publish --post_name="blog"

# Set trang blog (WordPress posts page)
BLOG_PAGE_ID=$(wp post list --post_type=page --post_name="blog" --field=ID)
wp option update page_for_posts $BLOG_PAGE_ID

# Tạo một số categories
wp term create category "Tin tức" --slug="tin-tuc"
wp term create category "Hướng dẫn" --slug="huong-dan"
wp term create category "Case Study" --slug="case-study"

# Cài Yoast SEO (nếu cần)
wp plugin install wordpress-seo --activate
```

### Tạo blog post với featured image

```bash
# Upload ảnh làm featured image
IMAGE_ID=$(wp media import /path/to/image.jpg --title="Blog Post Title" --porcelain)

# Tạo bài viết
POST_ID=$(wp post create \
  --post_type=post \
  --post_title="Tiêu đề bài viết" \
  --post_content="Nội dung bài viết..." \
  --post_status=publish \
  --post_date="2026-05-29 09:00:00" \
  --post_category=$(wp term get category tin-tuc --field=term_id) \
  --porcelain)

# Gán featured image
wp post meta update $POST_ID _thumbnail_id $IMAGE_ID
```

### Hiển thị Blog Posts trong UX Builder

```
[blog_posts style="normal" columns="3" columns__sm="1" image_size="landscape" show_date="true" show_author="false" show_comments="false" excerpt="true" excerpt_length="20" text_align="left" ids="" cat="" tags="" order="date" order_type="DESC" number="6"]
```

**Tất cả attributes của `[blog_posts]`:**

| Attribute | Options | Default |
|---|---|---|
| `style` | normal, card, overlay, large | normal |
| `columns` | 1–6 | 3 |
| `columns__md` | 1–6 | — |
| `columns__sm` | 1–6 | 1 |
| `image_size` | portrait, landscape, square, original | landscape |
| `show_date` | true/false | true |
| `show_author` | true/false | true |
| `show_comments` | true/false | true |
| `excerpt` | true/false | true |
| `excerpt_length` | số từ | 20 |
| `text_align` | left, center, right | left |
| `cat` | slug hoặc ID | (tất cả) |
| `tags` | slug | (tất cả) |
| `number` | số bài | 6 |
| `order` | date, title, rand | date |
| `order_type` | DESC, ASC | DESC |

### Custom Blog Archive Page

Flatsome tự xử lý blog archive (`/blog`). Để custom thêm, dùng hook:

```php
// Thêm filter tabs category trên blog archive
add_action('flatsome_before_blog', function() {
    if (!is_home() && !is_archive()) return;
    $cats = get_terms(['taxonomy' => 'category', 'hide_empty' => true]);
    $current = get_queried_object();
    echo '<div class="blog-filter-tabs">';
    $active = (!is_category()) ? 'active' : '';
    echo "<a href=\"" . get_permalink(get_option('page_for_posts')) . "\" class=\"blog-filter-btn {$active}\">Tất cả</a>";
    foreach ($cats as $cat) {
        $active = (is_category($cat->term_id)) ? 'active' : '';
        echo "<a href=\"" . get_category_link($cat->term_id) . "\" class=\"blog-filter-btn {$active}\">{$cat->name}</a>";
    }
    echo '</div>';
});
```

### Custom Blog Header (ảnh background + tiêu đề)

Flatsome cho phép set **Page Header** cho blog bằng cách tạo một UX Builder block và gán làm Blog Header Block:

```bash
# Tạo blog header block
BLOCK_ID=$(wp post create \
  --post_type=ux_block \
  --post_title="Blog Header" \
  --post_status=publish \
  --post_content='[section bg="HEADER_IMG_ID" bg_overlay="rgba(0,0,0,0.5)" dark="true" padding="80px 0"][row h_align="center"][col span="8" span__sm="12" align="center"][ux_text]<h1>Blog & Tin tức</h1>[/ux_text][/col][/row][/section]' \
  --porcelain)

# Gán làm blog header (Flatsome theme option)
wp option update flatsome_blog_header_block $BLOCK_ID
```

### Sidebar cho Blog

```bash
# Thêm widgets vào blog sidebar
wp widget add search sidebar-1 --title="Tìm kiếm"
wp widget add categories sidebar-1 --title="Danh mục" --count=1 --hierarchical=1
wp widget add recent-posts sidebar-1 --title="Bài viết mới" --number=5
wp widget add tag_cloud sidebar-1 --title="Tags"
```

### CSS cho Blog

```css
/* Blog filter tabs */
.blog-filter-tabs {
  display: flex; gap: 8px; flex-wrap: wrap;
  margin-bottom: 32px; padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}
.blog-filter-btn {
  padding: 7px 18px; border-radius: 50px; font-size: 14px;
  text-decoration: none; background: #f3f4f6; color: #374151;
  border: 1px solid transparent; transition: all 0.2s;
}
.blog-filter-btn.active, .blog-filter-btn:hover {
  background: #1d4ed8; color: #fff;
}

/* Post card enhancements */
.blog-post-card .post-image { overflow: hidden; border-radius: 8px; }
.blog-post-card .post-image img { transition: transform 0.3s ease; }
.blog-post-card:hover .post-image img { transform: scale(1.05); }
```

### Flatsome Blog Hooks

```
flatsome_before_blog       → Trước grid bài viết (filter tabs, result count)
flatsome_after_blog        → Sau grid + pagination
flatsome_before_blog_post  → Trước mỗi post card
flatsome_after_blog_post   → Sau mỗi post card
flatsome_before_post_content → Trước nội dung bài viết
flatsome_after_post_content  → Sau nội dung (share, related posts)
```

---

## 4. Portfolio / Agency Site

### Portfolio CPT đã có trong Flatsome

Flatsome có built-in Portfolio CPT. Kích hoạt bằng:

```bash
wp option update flatsome_portfolio_active 1
wp rewrite flush --hard
```

### Tạo portfolio items

```bash
# Tạo portfolio categories (taxonomy: portfolio-type)
wp term create portfolio-type "Web Design" --slug="web-design"
wp term create portfolio-type "Branding" --slug="branding"
wp term create portfolio-type "Mobile App" --slug="mobile-app"

# Tạo portfolio item
THUMB_ID=$(wp media import /path/to/project.jpg --porcelain)
PORT_ID=$(wp post create \
  --post_type=portfolio \
  --post_title="Tên dự án" \
  --post_content="Mô tả dự án..." \
  --post_status=publish \
  --porcelain)
wp post meta update $PORT_ID _thumbnail_id $THUMB_ID
wp post term set $PORT_ID portfolio-type web-design
```

### Shortcode hiển thị Portfolio

```
[portfolio style="col" columns="3" columns__sm="1" cat="web-design" number="9" image_size="landscape" show_cat="true" show_title="true" show_title_on_hover="false" orderby="date" order="DESC" filter="true" load_more="true"]
```

**Attributes của `[portfolio]`:**

| Attribute | Options | Mô tả |
|---|---|---|
| `style` | col, hover, overlay | Layout style |
| `columns` | 2–4 | Số cột |
| `cat` | slug | Lọc theo category |
| `filter` | true/false | Hiện filter tabs |
| `load_more` | true/false | Nút load thêm |
| `image_size` | landscape, portrait, square | Tỷ lệ ảnh |
| `show_cat` | true/false | Hiện category label |
| `lightbox` | true/false | Mở ảnh trong lightbox |

### Page layout cho Portfolio

```
[section padding="60px 0"]
  [row h_align="center"]
    [col span="10" align="center"]
      [ux_text]<h1>Dự án của chúng tôi</h1>[/ux_text]
      [ux_text]<p>Khám phá những gì chúng tôi đã thực hiện</p>[/ux_text]
    [/col]
  [/row]
[/section]

[portfolio style="col" columns="3" columns__sm="1" filter="true" load_more="true" image_size="landscape"]
```

### Enable UX Builder cho Portfolio CPT

```php
// Trong child theme functions.php
add_filter('flatsome_ux_builder_post_types', function($post_types) {
    $post_types[] = 'portfolio';
    return $post_types;
});
```

---

## 5. Landing Page (Single Page)

### Khi nào dùng Landing Page approach

- 1 trang dài, không có nav menu phức tạp
- Mục tiêu: thu leads / chuyển đổi
- Không cần client tự chỉnh sửa nhiều

### Setup Landing Page

```bash
# Tạo trang landing với template riêng
wp post create \
  --post_type=page \
  --post_title="Landing Page Title" \
  --post_status=publish \
  --post_name="landing" \
  --meta_input='{"_wp_page_template":"default"}'

# Nếu muốn ẩn header/footer → dùng PHP template (Approach B)
# Xem references/page-template-patterns.md
```

### Scroll-to navigation (anchor links)

```
[button text="Xem dịch vụ" link="#dich-vu" style="outline"]
[button text="Liên hệ ngay" link="#lien-he"]

[section id="dich-vu" padding="80px 0"]
  ...
[/section]

[section id="lien-he" padding="80px 0"]
  ...
[/section]
```

**Lưu ý**: Flatsome override `id` attribute bằng random ID. Inject anchor bằng JS:
```php
add_action('wp_footer', function() {
    if (!is_page('landing')) return;
    ?>
    <script>
    // Fix anchor IDs after Flatsome renders
    document.querySelectorAll('[data-anchor]').forEach(function(el){
        el.id = el.getAttribute('data-anchor');
    });
    </script>
    <?php
});
```

Dùng `data-anchor` thay `id`:
```
[section class="ldp-services" data-anchor="dich-vu" padding="80px 0"]
```

---

## 6. Common Page Patterns

### Trang Giới thiệu (About Page)

```
[section bg="BANNER_ID" height="300px" bg_overlay="rgba(0,0,0,0.5)" dark="true" padding="0"]
  [text_box position_x="50" position_y="50" text_align="center"]
    [ux_text]<h1>Về chúng tôi</h1>[/ux_text]
    [ux_text]<p>Trang chủ / Giới thiệu</p>[/ux_text]
  [/text_box]
[/section]

[section padding="70px 0"]
  [row v_align="middle"]
    [col span="6" span__sm="12"]
      [ux_image id="ABOUT_IMG_ID"]
    [/col]
    [col span="6" span__sm="12" padding="0 0 0 40px" padding__sm="30px 0 0"]
      [ux_text]<span class="co-label">CÂU CHUYỆN CỦA CHÚNG TÔI</span>[/ux_text]
      [ux_text]<h2>Được thành lập năm 2010<br>với niềm đam mê sáng tạo</h2>[/ux_text]
      [gap height="16px"]
      [ux_text]<p>Mô tả về lịch sử, câu chuyện thương hiệu...</p>[/ux_text]
    [/col]
  [/row]
[/section]

[section bg_color="#f8fafc" padding="70px 0"]
  [row h_align="center"]
    [col span="10" align="center"]
      [ux_text]<h2>Đội ngũ của chúng tôi</h2>[/ux_text]
    [/col]
  [/row]
  [gap height="40px"]
  [row]
    [col span="3" span__md="6" span__sm="12"]
      [team_member name="Nguyễn Văn A" role="Giám đốc" img="MEMBER_IMG_ID" linkedin="" facebook=""]
    [/col]
    [col span="3" span__md="6" span__sm="12"]
      [team_member name="Trần Thị B" role="Thiết kế trưởng" img="MEMBER_IMG_ID"]
    [/col]
    [col span="3" span__md="6" span__sm="12"]
      [team_member name="Lê Văn C" role="Dev Lead" img="MEMBER_IMG_ID"]
    [/col]
    [col span="3" span__md="6" span__sm="12"]
      [team_member name="Phạm Thị D" role="Marketing" img="MEMBER_IMG_ID"]
    [/col]
  [/row]
[/section]
```

### Trang Dịch vụ (Services Page)

```
[section padding="70px 0"]
  [row]
    [col span="4" span__md="6" span__sm="12" bg_color="#fff" depth="1" bg_radius="8" padding="30px"]
      [featured_box img="ICON_ID" img_width="50" pos="top" title="Thiết kế Website"]
        Mô tả dịch vụ thiết kế website, từ concept đến hoàn thiện...
      [/featured_box]
      [gap height="20px"]
      [button text="Xem chi tiết" link="/dich-vu/thiet-ke" style="outline" size="small"]
    [/col]
    [col span="4" span__md="6" span__sm="12" bg_color="#fff" depth="1" bg_radius="8" padding="30px"]
      [featured_box img="ICON_ID" img_width="50" pos="top" title="SEO & Marketing"]
        Mô tả dịch vụ SEO và digital marketing...
      [/featured_box]
      [gap height="20px"]
      [button text="Xem chi tiết" link="/dich-vu/seo" style="outline" size="small"]
    [/col]
    [col span="4" span__md="6" span__sm="12" bg_color="#fff" depth="1" bg_radius="8" padding="30px"]
      [featured_box img="ICON_ID" img_width="50" pos="top" title="Bảo trì Website"]
        Mô tả dịch vụ bảo trì và hỗ trợ kỹ thuật...
      [/featured_box]
      [gap height="20px"]
      [button text="Xem chi tiết" link="/dich-vu/bao-tri" style="outline" size="small"]
    [/col]
  [/row]
[/section]

[section bg_color="#1e3a5f" dark="true" padding="70px 0"]
  [row h_align="center"]
    [col span="10" align="center"]
      [ux_text]<h2>Bảng giá dịch vụ</h2>[/ux_text]
    [/col]
  [/row]
  [gap height="40px"]
  [row]
    [col span="4" span__md="12"]
      [ux_price_table style="1" title="Cơ bản" price="5.000.000" price_freq="/tháng" color="secondary"]
        [bullet_item]5 trang thiết kế[/bullet_item]
        [bullet_item]Responsive mobile[/bullet_item]
        [bullet_item]SEO cơ bản[/bullet_item]
        [bullet_item icon="times"]Tích hợp thanh toán[/bullet_item]
        [button text="Chọn gói này" link="/lien-he" color="white" style="outline" expand="true"]
      [/ux_price_table]
    [/col]
    [col span="4" span__md="12"]
      [ux_price_table style="1" title="Chuyên nghiệp" price="15.000.000" price_freq="/tháng" color="primary" featured="true"]
        [bullet_item]15 trang thiết kế[/bullet_item]
        [bullet_item]Responsive mobile[/bullet_item]
        [bullet_item]SEO nâng cao[/bullet_item]
        [bullet_item]Tích hợp thanh toán[/bullet_item]
        [button text="Chọn gói này" link="/lien-he" color="primary" expand="true"]
      [/ux_price_table]
    [/col]
    [col span="4" span__md="12"]
      [ux_price_table style="1" title="Doanh nghiệp" price="Liên hệ" color="secondary"]
        [bullet_item]Không giới hạn trang[/bullet_item]
        [bullet_item]Thiết kế theo yêu cầu[/bullet_item]
        [bullet_item]SEO toàn diện[/bullet_item]
        [bullet_item]Hỗ trợ 24/7[/bullet_item]
        [button text="Liên hệ tư vấn" link="/lien-he" color="white" style="outline" expand="true"]
      [/ux_price_table]
    [/col]
  [/row]
[/section]
```

### Trang Liên hệ (Contact Page)

```bash
# Tạo CF7 form trước
# Sau khi có FORM_ID, dùng shortcode:
```

```
[section padding="70px 0"]
  [row]
    [col span="7" span__sm="12"]
      [ux_text]<h2>Gửi tin nhắn cho chúng tôi</h2>[/ux_text]
      [gap height="20px"]
      [contact-form-7 id="FORM_ID" title="Liên hệ"]
    [/col]
    [col span="5" span__sm="12" padding="0 0 0 40px" padding__sm="40px 0 0"]
      [ux_text]<h3>Thông tin liên hệ</h3>[/ux_text]
      [ux_text]
        <div class="co-contact-info">
          <p><i class="icon-map-pin"></i> 123 Đường ABC, Quận 1, TP.HCM</p>
          <p><i class="icon-phone"></i> <a href="tel:0901234567">090 123 4567</a></p>
          <p><i class="icon-mail"></i> <a href="mailto:info@company.com">info@company.com</a></p>
          <p><i class="icon-clock"></i> Thứ 2 – Thứ 6: 8:00 – 17:30</p>
        </div>
      [/ux_text]
      [gap height="30px"]
      [map address="123 Đường ABC Quận 1 TP HCM" height="300px" zoom="15"]
    [/col]
  [/row]
[/section]
```

### Trang 404 tùy chỉnh

```bash
# Tạo file 404.php trong child theme
cat > $(wp eval "echo get_stylesheet_directory();")/404.php << 'PHP'
<?php get_header(); ?>
<div class="container" style="text-align:center; padding:100px 20px;">
  <h1 style="font-size:120px; line-height:1; color:#e5e7eb;">404</h1>
  <h2>Trang không tìm thấy</h2>
  <p>Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
  <a href="<?= home_url('/') ?>" class="button primary large" style="margin-top:20px;">Về trang chủ</a>
</div>
<?php get_footer(); ?>
PHP
```

---

## 7. Multi-page Site Architecture

### Checklist trước khi build

```bash
# Kiểm tra tất cả trang đã tạo
wp post list --post_type=page --fields=ID,post_title,post_name,post_status

# Kiểm tra menu
wp menu list --fields=term_id,name,slug
wp menu item list MENU_ID --fields=ID,type,title,url,menu_order

# Kiểm tra permalink structure
wp option get permalink_structure
# Nên là: /%postname%/
wp option update permalink_structure '/%postname%/'
wp rewrite flush --hard

# Kiểm tra homepage
wp option get page_on_front
wp option get show_on_front  # phải là "page"

# Kiểm tra blog page (nếu có)
wp option get page_for_posts
```

### SEO cơ bản

```bash
wp plugin install wordpress-seo --activate

# Set site title và description
wp option update blogname "Tên công ty"
wp option update blogdescription "Mô tả ngắn về công ty"

# Set ngôn ngữ tiếng Việt
wp option update WPLANG "vi"
```

### Internal link hierarchy

```
Trang chủ (/)
├── /gioi-thieu/
│   └── /gioi-thieu/doi-ngu/  (nếu cần trang riêng)
├── /dich-vu/
│   ├── /dich-vu/thiet-ke-website/
│   ├── /dich-vu/seo/
│   └── /dich-vu/bao-tri/
├── /du-an/  (portfolio)
├── /blog/
│   └── /blog/category/tin-tuc/
└── /lien-he/
```

### Menu với submenu

```bash
# Tạo submenu dịch vụ
wp menu item add-post main-menu DV_PAGE_ID --title="Dịch vụ"
PARENT_ITEM_ID=$(wp menu item list main-menu --fields=ID,title | grep "Dịch vụ" | awk '{print $1}')

wp menu item add-post main-menu DV_THIETKE_ID --title="Thiết kế website" --parent-id=$PARENT_ITEM_ID
wp menu item add-post main-menu DV_SEO_ID --title="SEO" --parent-id=$PARENT_ITEM_ID
wp menu item add-post main-menu DV_BAOTRI_ID --title="Bảo trì" --parent-id=$PARENT_ITEM_ID
```
