# INPUT BÁO GIÁ — HPB Media
# Copy file này, điền thông tin, gửi cho Claude để tạo báo giá.
# Dòng nào không có thông tin → để trống hoặc ghi "không có"

---

## THÔNG TIN BÁO GIÁ
SO_BAO_GIA: BG-WEB-001
NGAY_BAO_GIA: (để trống = tự lấy ngày hôm nay)
LOAI_DICH_VU: THIẾT KẾ WEBSITE
TEN_DU_AN: Website Giới Thiệu Công Ty ABC

---

## THÔNG TIN KHÁCH HÀNG
TEN_KHACH_HANG: CÔNG TY TNHH ABC
NGUOI_DAI_DIEN: Nguyễn Văn A
SDT_KHACH: 0901 234 567
EMAIL_KHACH: a@abc.com.vn
DIA_CHI_KHACH: 123 Lê Lợi, P. Bến Nghé, Q.1, TP.HCM
MST_KHACH: 0312345678
LOAI_WEBSITE: Website giới thiệu doanh nghiệp
SO_TRANG: 7
THOI_GIAN: 15 ngày làm việc

---

## HẠNG MỤC
# Mỗi hạng mục gồm: tên, mô tả chi tiết, giá
# Bạn có thể thêm/bớt thoải mái, Claude sẽ xử lý

HANG_MUC_1:
  Ten: Thiết kế Website
  Chi tiet: |
    Thiết kế theo phong cách hiện đại, màu sắc brand ABC
    7 trang: Trang chủ / Giới thiệu / Dịch vụ / Dự án / Tin tức / Tuyển dụng / Liên hệ
    Form liên hệ tích hợp email thông báo
    Google Maps trang liên hệ
    Responsive Mobile – Tablet – Desktop
    SEO cơ bản, Google Analytics, Search Console
  Don gia: 8000000

HANG_MUC_2:
  Ten: Domain
  Chi tiet: Tên miền .com — abc.com
  Don gia: 246240

HANG_MUC_3:
  Ten: Hosting
  Chi tiet: Gói 5GB băng thông không giới hạn
  Don gia: 859248

HANG_MUC_4:
  Ten: Email tên miền
  Chi tiet: 5 tài khoản email doanh nghiệp, 5GB/tài khoản — bao gồm trong gói thiết kế
  Don gia: 0

HANG_MUC_5:
  Ten: SSL
  Chi tiet: Let's Encrypt SSL trọn đời — bao gồm trong gói thiết kế
  Don gia: 0

# Ví dụ thêm hạng mục đa ngôn ngữ:
# HANG_MUC_6:
#   Ten: Đa ngôn ngữ (EN + VI)
#   Chi tiet: Cài đặt hệ thống đa ngôn ngữ, 2 ngôn ngữ. Khách cung cấp bản dịch sẵn.
#   Don gia: 2000000

---

## GHI CHÚ THÊM (không bắt buộc)
# Yêu cầu đặc thù, tham khảo website mẫu, màu sắc brand, deadline...
GHI_CHU: |
  Khách muốn tham khảo style của [link website tham khảo]
  Ưu tiên màu xanh navy + trắng