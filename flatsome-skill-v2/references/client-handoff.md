# Client Handoff — Bàn giao website cho khách hàng

> Quy trình sau khi hoàn thành thiết kế: tạo tài khoản client, phân quyền,
> hướng dẫn tự sửa nội dung, checklist bàn giao, tài liệu hướng dẫn.

---

## Tổng quan quy trình bàn giao

```
1. Final QA trước bàn giao
2. Đổi mật khẩu admin (nếu dùng pass tạm)
3. Tạo tài khoản cho client (Editor hoặc Admin)
4. Xóa / ẩn các trang test
5. Hướng dẫn client tự sửa nội dung
6. Bàn giao thông tin đăng nhập
7. Checklist bàn giao ký tên
```

---

## Bước 1 — Final QA trước bàn giao

```bash
WPPATH=/path/to/wordpress
DOMAIN=https://example.com

echo "=== FINAL QA CHECKLIST ==="

# 1. Tất cả pages publish
wp --path=$WPPATH post list --post_type=page --post_status=publish \
  --fields=ID,post_title,post_name --allow-root

# 2. Check HTTP status tất cả trang
wp --path=$WPPATH post list --post_type=page --post_status=publish \
  --field=post_name --allow-root | while read slug; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/$slug/")
  echo "$status — $DOMAIN/$slug/"
done

# 3. Check forms hoạt động (CF7)
wp --path=$WPPATH post list --post_type=wpcf7_contact_form \
  --fields=ID,post_title --allow-root

# 4. Check images không bị broken
echo "Checking for broken images..."
curl -s "$DOMAIN" | grep -oE 'src="[^"]*\.(png|jpg|jpeg|webp|svg)[^"]*"' | \
  sed 's/src="//;s/"//' | while read url; do
  [[ "$url" == http* ]] || url="$DOMAIN$url"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  [ "$status" != "200" ] && echo "BROKEN: $status — $url"
done

# 5. Permalink
wp --path=$WPPATH option get permalink_structure --allow-root

# 6. Site URL đúng domain thật
wp --path=$WPPATH option get siteurl --allow-root
wp --path=$WPPATH option get home --allow-root
```

---

## Bước 2 — Đổi mật khẩu Admin + Bảo mật

```bash
WPPATH=/path/to/wordpress

# Đổi pass admin (dùng pass mạnh)
NEW_PASS=$(openssl rand -base64 16 | tr -d '=/+' | head -c 20)
wp --path=$WPPATH user update 1 --user_pass="$NEW_PASS" --allow-root
echo "New admin password: $NEW_PASS"  # Lưu lại để bàn giao

# Đổi admin email sang email thật của client
wp --path=$WPPATH option update admin_email "client@company.com" --allow-root

# Xóa user mặc định nếu không cần
# wp --path=$WPPATH user delete OLD_USER_ID --allow-root

# Disable XML-RPC (bảo mật)
wp --path=$WPPATH eval "
add_filter('xmlrpc_enabled', '__return_false');
" --allow-root 2>/dev/null || true
```

---

## Bước 3 — Tạo tài khoản cho Client

### Phân quyền: Editor vs Administrator

| Role | Quyền | Khi nào dùng |
|---|---|---|
| **Editor** | Sửa nội dung, pages, posts, media | Client chỉ cần cập nhật nội dung |
| **Administrator** | Toàn quyền (cài plugin, theme...) | Client kỹ thuật hoặc tin tưởng cao |
| **Author** | Chỉ viết blog của mình | Client chỉ viết bài |

> **Khuyến nghị:** Dùng **Editor** cho hầu hết client. Không cần thiết phải cho Admin.

```bash
WPPATH=/path/to/wordpress
CLIENT_USER="khachhang"
CLIENT_EMAIL="contact@company.com"
CLIENT_PASS="Client@2026!"  # Bảo client đổi sau khi đăng nhập
CLIENT_ROLE="editor"        # hoặc "administrator"

wp --path=$WPPATH user create "$CLIENT_USER" "$CLIENT_EMAIL" \
  --role="$CLIENT_ROLE" \
  --user_pass="$CLIENT_PASS" \
  --first_name="Tên" \
  --last_name="Khách hàng" \
  --allow-root

echo "✅ Client account created:"
echo "   URL: https://domain.com/wp-admin"
echo "   Username: $CLIENT_USER"
echo "   Password: $CLIENT_PASS"
echo "   Role: $CLIENT_ROLE"
```

### Enable UX Builder cho Editor role

```php
// functions.php — Cho phép Editor dùng UX Builder
add_filter('flatsome_ux_builder_capability', function($cap) {
    return 'edit_pages'; // Editor có quyền này
});
```

---

## Bước 4 — Dọn dẹp trước bàn giao

```bash
WPPATH=/path/to/wordpress

# Xóa các trang test
wp --path=$WPPATH post list --post_type=page --post_status=any \
  --fields=ID,post_title,post_name --allow-root
# Xóa trang test cụ thể:
# wp --path=$WPPATH post delete PAGE_ID --force --allow-root

# Xóa revisions cũ (giảm database)
wp --path=$WPPATH post delete \
  $(wp --path=$WPPATH post list --post_type=revision --field=ID --allow-root 2>/dev/null) \
  --force --allow-root 2>/dev/null || echo "No revisions"

# Xóa transients cũ
wp --path=$WPPATH transient delete --expired --allow-root

# Flush cache lần cuối
wp --path=$WPPATH cache flush --allow-root
wp --path=$WPPATH rewrite flush --hard --allow-root

# Tắt WP_DEBUG nếu đang bật
sed -i "s/define('WP_DEBUG', true)/define('WP_DEBUG', false)/" \
  $WPPATH/wp-config.php 2>/dev/null

echo "✅ Cleanup done"
```

---

## Bước 5 — Hướng dẫn client tự sửa nội dung

### Những gì client CÓ THỂ tự sửa trong UX Builder

```
✅ Text / tiêu đề / mô tả
✅ Ảnh (click vào ảnh → Replace → Upload ảnh mới)
✅ Button text và link
✅ Email, số điện thoại, địa chỉ
✅ Thêm/xóa bài viết blog
✅ Thêm/xóa sản phẩm (nếu WooCommerce)
```

### Những gì KHÔNG nên tự sửa (cần liên hệ dev)

```
❌ Cấu trúc layout (thêm/xóa cột)
❌ CSS / code
❌ Cài thêm plugin
❌ Thay đổi theme
❌ Chỉnh sửa header/footer (nếu là Global Section)
```

### Hướng dẫn sửa text cơ bản

```
1. Đăng nhập vào https://domain.com/wp-admin
2. Vào Pages → tìm trang cần sửa → Edit
3. Click "Open in UX Builder" (hoặc "Edit Page" trên thanh toolbar)
4. Click vào đoạn text cần sửa → sửa trực tiếp
5. Click "Save" (nút xanh góc trên phải)
6. Click "View Page" để xem kết quả
```

### Hướng dẫn thay ảnh

```
1. Trong UX Builder, hover vào ảnh → click icon bút chì
2. Click "Replace" → Upload ảnh mới hoặc chọn từ Media Library
3. Save
```

---

## Bước 6 — Template Bàn giao thông tin

```markdown
# THÔNG TIN BÀN GIAO WEBSITE
Dự án: [Tên dự án]
Ngày bàn giao: [DD/MM/YYYY]
Designer: [Tên bạn]

## Thông tin đăng nhập

### Hosting / VPS
- Provider: [Tên nhà cung cấp]
- IP: [IP VPS]
- cPanel/DirectAdmin: https://[ip]:2222
- Username: [user]
- Password: [pass]

### WordPress Admin
- URL: https://[domain]/wp-admin
- Username: [username]
- Password: [password]
- ⚠️ Vui lòng đổi mật khẩu ngay sau khi đăng nhập lần đầu

### Database
- DB Name: [db_name]
- DB User: [db_user]
- DB Password: [db_pass]
- DB Host: localhost

### Domain
- Đăng ký tại: [Nhà cung cấp domain]
- Hết hạn: [Date]

### Flatsome License
- Purchase Code: [xxxx-xxxx-xxxx-xxxx]
- Email đăng ký ThemeForest: [email]

## Những gì đã làm
- ✅ Thiết kế [N] trang
- ✅ Header + Footer custom
- ✅ [Plugin A, B, C] đã cài và cấu hình
- ✅ Form liên hệ / đặt lịch
- ✅ Responsive mobile

## Hướng dẫn sử dụng
- Video hướng dẫn: [Link Google Drive / YouTube]
- Tài liệu: [Link]

## Hỗ trợ sau bàn giao
- Bảo hành lỗi kỹ thuật: [N] tháng
- Liên hệ hỗ trợ: [Email/Zalo/Phone]
- Ngoài phạm vi bảo hành: [Mô tả rõ]
```

---

## Bước 7 — Checklist ký tên

```
□ Tất cả trang hiển thị đúng trên Chrome/Safari/Firefox
□ Responsive trên mobile đẹp
□ Form liên hệ gửi email thành công
□ Tốc độ tải < 3 giây (PageSpeed ≥ 70)
□ SSL (https) hoạt động
□ Logo, màu sắc, font đúng yêu cầu
□ Nội dung đã điền đầy đủ (không còn Lorem Ipsum)
□ Tài khoản client đã tạo và đăng nhập được
□ Thông tin đăng nhập đã bàn giao
□ Khách hàng đã test thử và xác nhận

Khách hàng ký xác nhận: _______________ Ngày: ___/___/______
Designer ký: _______________ Ngày: ___/___/______
```

---

## Sau bàn giao — Tác vụ tự động (Optional)

```bash
# Tạo cron backup hàng ngày (VPS)
WPPATH=/path/to/wordpress
BACKUP_DIR=/home/admin/backups

mkdir -p $BACKUP_DIR

# Backup DB
crontab -l | { cat; echo "0 2 * * * wp --path=$WPPATH db export $BACKUP_DIR/db-\$(date +\%Y\%m\%d).sql --allow-root && find $BACKUP_DIR -name 'db-*.sql' -mtime +7 -delete"; } | crontab -

echo "Daily backup scheduled at 2 AM"
```
