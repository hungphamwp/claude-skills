# Quy Trình Chuyển Đổi Landing Page Tĩnh Sang WordPress ACF/SCF Template

Tài liệu này hướng dẫn chi tiết quy trình thực tế để chuyển đổi một trang Landing Page tĩnh (HTML hoặc file PHP tĩnh vừa được deploy) sang một WordPress Page Template chuyên nghiệp tích hợp **Advanced Custom Fields (ACF)** hoặc **Secure Custom Fields (SCF)**.

Giải pháp này tối ưu hóa khả năng tự quản trị nội dung của khách hàng mà vẫn **đảm bảo giữ nguyên 100% độ chính xác của giao diện thiết kế gốc** (không bị lệch CSS/HTML) và duy trì tốc độ tải trang cực nhanh.

---

## 📋 Quy Trình Thực Hiện 5 Bước

### Bước 1: Phân Tích & Lập Sơ Đồ Ánh Xạ ACF
Đọc kỹ file HTML tĩnh để phân loại các trường nội dung cần động hóa:
- **Simple fields (Trường đơn)**: Tiêu đề chính, tiêu đề phụ, các đoạn mô tả ngắn, số điện thoại, email, địa chỉ liên hệ.
- **Image fields (Trường ảnh)**: Logo, ảnh nền hero, các ảnh đại diện phần giới thiệu, ảnh khách hàng. (Nên cấu hình return format là **`url`**).
- **Repeater fields (Trường lặp)**: Danh sách logo đối tác, danh sách card dịch vụ, danh sách lợi ích, phản hồi khách hàng (Testimonials).
- **Form shortcode (Trường mã ngắn)**: Tạo một trường `text` hoặc `textarea` để khách hàng tự dán shortcode của plugin Form (Contact Form 7, WPForms...).

---

### Bước 2: Viết File Đăng Ký Trường ACF Bằng PHP (`acf-fields.php`)
Đăng ký các nhóm trường động bằng code PHP thay vì import file JSON thủ công để tránh rủi ro mất mát dữ liệu hoặc phân mảnh khi chuyển giao diện.

**Quy tắc thiết kế code:**
1. Tránh xung đột bằng cách prefix toàn bộ tên trường (ví dụ: dự án SEOC sử dụng prefix `seoc_`).
2. Chia các trường thành các **Tabs** trực quan tương ứng với các section ngoài trang chủ.
3. **CỰC KỲ QUAN TRỌNG**: Cung cấp giá trị mặc định (`default_value`) cho tất cả các trường khớp 1:1 với dữ liệu mẫu gốc.

**Ví dụ cấu trúc code:**
```php
<?php
if ( ! function_exists( 'acf_add_local_field_group' ) ) {
    return;
}

add_action( 'acf/init', function() {
    acf_add_local_field_group( array(
        'key' => 'group_project_landing',
        'title' => 'Landing Page Settings',
        'fields' => array(
            // Tab 1: Global Settings
            array(
                'key' => 'field_ldp_global_tab',
                'label' => 'Thông tin chung',
                'type' => 'tab',
            ),
            array(
                'key' => 'field_ldp_logo',
                'label' => 'Logo website',
                'name' => 'ldp_logo',
                'type' => 'image',
                'return_format' => 'url',
            ),
            // Tab 2: Hero Section
            array(
                'key' => 'field_ldp_hero_tab',
                'label' => 'Hero Banner',
                'type' => 'tab',
            ),
            array(
                'key' => 'field_ldp_hero_title',
                'label' => 'Tiêu đề Hero',
                'name' => 'ldp_hero_title',
                'type' => 'text',
                'default_value' => 'Tiêu đề mẫu gốc',
            ),
            // Các tab khác...
        ),
        'location' => array(
            array(
                array(
                    'param' => 'page_template',
                    'operator' => '==',
                    'value' => 'template-custom-landing.php',
                ),
            ),
        ),
    ) );
} );
```

---

### Bước 3: Tích Hợp ACF & WordPress Core Vào File Template (`template.php`)
Chuyển đổi file PHP tĩnh sang PHP động theo các quy chuẩn WordPress:

1. **Thêm Khai Báo Template Name**:
   ```php
   <?php
   /*
   Template Name: Custom Landing Page
   Template Post Type: page
   */
   ```
2. **Viết Hàm Helper Lấy Trường ACF An Toàn (Cơ chế Fallback)**:
   Khai báo hàm helper này ở ngay đầu file template để tự động hiển thị giá trị mặc định của bản mẫu gốc nếu khách hàng chưa nhập gì trong trang quản trị:
   ```php
   function ldp_field( $name, $default = '' ) {
       if ( ! function_exists( 'get_field' ) ) {
           return $default;
       }
       $val = get_field( $name );
       return ( $val !== null && $val !== '' && $val !== false ) ? $val : $default;
   }
   ```
3. **Tích Hợp `wp_head()` & `wp_footer()`**:
   - Thêm `<?php wp_head(); ?>` ngay trước thẻ đóng `</head>`.
   - Thêm `<?php wp_footer(); ?>` ngay trước thẻ đóng `</body>`.
   Điều này giúp tích hợp toàn diện SEO, mã theo dõi Analytics, và các script chạy AJAX cho form liên hệ hoạt động mượt mà.
4. **Thay Thế HTML Tĩnh Bằng Code Trường Động**:
   - Dạng văn bản: `<?php echo esc_html( ldp_field( 'ldp_hero_title', 'Mặc định' ) ); ?>`
   - Dạng hình ảnh: `<img src="<?php echo esc_url( ldp_field( 'ldp_logo', $asset_uri . '/img/logo.png' ) ); ?>" alt="Logo">`
   - Dạng lặp (Repeater):
     ```php
     <?php if ( function_exists( 'have_rows' ) && have_rows( 'ldp_partners' ) ) : ?>
         <?php while ( have_rows( 'ldp_partners' ) ) : the_row(); ?>
             <img src="<?php echo esc_url( get_sub_field( 'logo' ) ); ?>" alt="Partner">
         <?php endwhile; ?>
     <?php else : ?>
         <!-- HTML tĩnh của bản mẫu gốc làm Fallback -->
         <img src="path/to/default-logo.png">
     <?php endif; ?>
     ```
5. **Tin Tức Động (WP_Query)**:
   Thay thế khối HTML tin tức tĩnh bằng truy vấn bài viết thực tế trong WordPress để trang chủ tự cập nhật động khi admin viết bài mới:
   ```php
   <?php
   $blog_query = new WP_Query( array(
       'post_type'      => 'post',
       'posts_per_page' => 3,
       'ignore_sticky_posts' => 1
   ) );
   if ( $blog_query->have_posts() ) :
       while ( $blog_query->have_posts() ) : $blog_query->the_post();
           // HTML render bài viết động...
       endwhile;
       wp_reset_postdata();
   endif;
   ?>
   ```
6. **Tích Hợp Form Liên Hệ Động (CF7)**:
   Thay thế thẻ `<form>` tĩnh bằng hàm bọc `do_shortcode` để render Contact Form 7 động:
   ```php
   <?php 
   $cf7_code = ldp_field( 'ldp_cf7_shortcode', '' );
   if ( ! empty( $cf7_code ) ) : 
       echo do_shortcode( $cf7_code );
   else : 
   ?>
     <!-- Khung <form> tĩnh gốc làm Fallback -->
   <?php endif; ?>
   ```

---

### Bước 4: Nhúng Cấu Hình Vào `functions.php`
Để kích hoạt đăng ký trường ACF trong hệ thống, hãy append dòng code sau vào cuối file `functions.php` của child theme:
```php
// Enqueue ACF Field Group registrations for Custom Landing Page
if ( file_exists( get_stylesheet_directory() . '/acf-seoc-exact-fields.php' ) ) {
    require_once get_stylesheet_directory() . '/acf-seoc-exact-fields.php';
}
```

---

### Bước 5: Viết Script Deploy Tự Động & An Toàn (`deploy.sh`)
Tạo một script shell để tối đa hóa tốc độ deploy, đồng thời tự động tạo các bản sao lưu để đảm bảo an toàn tuyệt đối.

```bash
#!/bin/bash
PASS="PASSWORD_VPS"
IP="IP_VPS"
PORT="22"
REMOTE_DIR="/path/to/wordpress/wp-content/themes/flatsome-child"

# 1. Tạo backup trên máy chủ
/opt/homebrew/bin/sshpass -p "$PASS" ssh -p "$PORT" -o StrictHostKeyChecking=no root@"$IP" \
  "cp $REMOTE_DIR/functions.php $REMOTE_DIR/functions.php.bak && \
   cp $REMOTE_DIR/template-custom.php $REMOTE_DIR/template-custom.php.bak"

# 2. Upload các file động mới
/opt/homebrew/bin/sshpass -p "$PASS" scp -P "$PORT" scratch/acf-fields.php root@"$IP":"$REMOTE_DIR/acf-fields.php"
/opt/homebrew/bin/sshpass -p "$PASS" scp -P "$PORT" scratch/template-custom.php.new root@"$IP":"$REMOTE_DIR/template-custom.php"
/opt/homebrew/bin/sshpass -p "$PASS" scp -P "$PORT" scratch/functions.php.new root@"$IP":"$REMOTE_DIR/functions.php"

# 3. Dọn cache đường dẫn
/opt/homebrew/bin/sshpass -p "$PASS" ssh -p "$PORT" root@"$IP" \
  "cd /path/to/wordpress && wp rewrite flush --allow-root"
```

---

## 💡 Bài Học Thực Tế & Khắc Phục Sự Cố (Case Study HMarketing)

1. **Sự Cố Lỗi Ký Tự Đặc Biệt Của Mật Khẩu Trong Shell**:
   - *Tình huống*: Khi dùng lệnh shell qua SSH cập nhật mật khẩu có chứa các ký tự đặc biệt như `!`, `@`, `#`, nếu ta cố tình escape như `\!` thì bash shell sẽ chèn luôn ký tự gạch chéo ngược `\` vào mật khẩu thực tế (`hungpham123\!@#`), khiến người dùng không thể đăng nhập được.
   - *Cách khắc phục*: Bọc mật khẩu trong dấu nháy đơn cực kỳ sạch sẽ `'hungpham123!@#'` mà **không** được chèn thêm dấu gạch chéo ngược để escape ký tự đặc biệt khi chạy lệnh WP-CLI.
2. **Ẩn Nhóm Trường ACF Do Thiếu Plugin**:
   - *Tình huống*: Sau khi viết code tích hợp ACF thành công, truy cập vào trang Admin WordPress chỉnh sửa trang chủ nhưng không thấy xuất hiện bất kỳ khung nhập liệu nào bên dưới.
   - *Nguyên nhân*: Do website WordPress mới chưa được cài đặt và kích hoạt plugin ACF / SCF.
   - *Cách khắc phục*: Chạy lệnh cài đặt và kích hoạt plugin nhanh qua WP-CLI trên VPS:
     ```bash
     wp plugin install advanced-custom-fields --activate --allow-root
     ```
3. **Mẹo Chọn Plugin ACF vs SCF**:
   - Đối với các dự án cần dùng trường lặp (Repeater), nếu sử dụng bản miễn phí của ACF (Advanced Custom Fields) thì sẽ không có trường Repeater.
   - Nên cài đặt plugin **SCF (Secure Custom Fields)** hoặc bản ACF miễn phí trên kho chính thức của WordPress.org vì hiện tại bản này hỗ trợ đầy đủ trường Repeater hoàn toàn miễn phí.
