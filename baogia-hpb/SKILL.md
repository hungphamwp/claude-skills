---
name: baogia-hpb
description: Tạo file báo giá (.xlsx) theo đúng mẫu thiết kế của HPB Media — logo, banner xanh, khối thông tin khách hàng, bảng hạng mục/đơn giá, QR chuyển khoản Vietcombank, điều khoản thanh toán/bảo hành. Dùng skill này bất cứ khi nào người dùng yêu cầu "làm báo giá", "tạo báo giá", "báo giá website/dịch vụ này giá X", gửi kèm một đường link website cần báo giá, hoặc nhắc đến "báo giá HPB Media" — kể cả khi họ không nói rõ tên skill. Áp dụng cho mọi loại dịch vụ HPB Media từng báo giá: thiết kế website, xử lý mã độc, SEO, chạy quảng cáo, v.v. — không chỉ website.
---

# Báo giá HPB Media

Skill này tạo ra file `.xlsx` báo giá hoàn chỉnh, đúng bố cục của mẫu gốc
(`assets/template.xlsx`): logo HPB Media, banner xanh `#0068B8`, khối "THÔNG TIN
KHÁCH HÀNG", bảng 1 hạng mục lớn chia nhỏ theo mục (dùng nhiều dòng trong 1 ô
CHI TIẾT), tổng cộng, khối điều khoản + QR chuyển khoản Vietcombank.

## Quy trình

1. **Thu thập thông tin.** Từ yêu cầu của người dùng, xác định:
   - Khách hàng (tên công ty/cá nhân nhận báo giá)
   - Website/tên miền liên quan (nếu có) — nếu người dùng chỉ gửi link tham
     khảo phong cách chứ không phải khách hàng thật, **hỏi rõ** ai là khách
     hàng thật và tên miền thật trước khi tạo file (đừng đoán khách hàng từ
     một link tham khảo).
   - Loại dịch vụ (thiết kế website, xử lý mã độc, SEO, ads, ...) và nền tảng
     (WordPress, v.v.)
   - Mức giá (do người dùng cung cấp)
   - Nếu là website, nên xem nhanh trang tham khảo (nếu có link) hoặc hỏi lĩnh
     vực kinh doanh để soạn hạng mục công việc phù hợp.

2. **Soạn nháp hạng mục (CHI TIẾT) và trình bày cho người dùng duyệt trước
   khi xuất file** — trừ khi người dùng đã liệt kê rõ hạng mục cụ thể trong
   yêu cầu. Đây là bước bắt buộc: đừng tạo file ngay khi hạng mục còn là tự
   suy đoán, vì đây là tài liệu gửi cho khách hàng thật.
   - Chia hạng mục thành các nhóm nhỏ viết HOA làm tiêu đề, mỗi nhóm 1-2 dòng
     mô tả, cách nhau bằng dòng trống — xem 2 ví dụ thật đã gửi khách trong
     `references/example_specs.json` (một báo giá xử lý mã độc, một báo giá
     thiết kế website) để bắt đúng giọng văn và độ chi tiết.
   - Tổng giá trị của các hạng mục phải khớp với mức giá người dùng đưa ra.

3. **Tạo file** bằng script có sẵn — không tự viết lại logic openpyxl từ đầu:

   ```bash
   python3 scripts/generate_quote.py spec.json output.xlsx
   ```

   Viết `spec.json` theo đúng các trường mô tả bên dưới, rồi gọi script.
   Script tự nạp `assets/template.xlsx` (giữ nguyên logo, QR, màu sắc, định
   dạng), điền nội dung, tính lại chiều cao dòng cho khối CHI TIẾT, và lưu
   file mới — file gốc trong `assets/` không bao giờ bị ghi đè.

   ### Các trường của spec.json

   | Trường | Bắt buộc | Ghi chú |
   |---|---|---|
   | `tieu_de` | có | Tiêu đề banner xanh lớn, VIẾT HOA. VD: `"BÁO GIÁ THIẾT KẾ WEBSITE"` |
   | `phu_de` | có | Dòng phụ đề dưới banner. VD: `"Thiết Kế Website Doanh Nghiệp — TENMIEN.COM"` |
   | `khach_hang` | có | Tên khách hàng, VIẾT HOA |
   | `loai_dich_vu` | có | VD: `"Website ... — tenmien.com   |   Nền tảng: WordPress"` |
   | `tien_do` | có | VD: `"Thời gian dự kiến: 7-10 ngày làm việc"` |
   | `hang_muc_items` | xem ghi chú | Danh sách các dòng hạng mục — dùng khi báo giá có **từ 2 hạng mục tách giá trở lên**. Mỗi phần tử: `{"ten_hang_muc", "chi_tiet", "gia", "ghi_chu"}` (xem bảng con bên dưới) |
   | `hang_muc`, `chi_tiet`, `gia`, `ghi_chu` | xem ghi chú | Cách viết tắt khi báo giá chỉ có **1 dòng hạng mục** — tương đương `hang_muc_items` với 1 phần tử. Dùng cách này hoặc `hang_muc_items`, không dùng cả hai. |
   | `thoi_gian_thuc_hien` | có | Dòng đầu khối điều khoản, VD: `"Thời gian thực hiện: 7-10 ngày làm việc kể từ khi chốt nội dung..."` |
   | `so_bg` | không | Mặc định tự sinh `BG-WEB-DDMM` theo ngày hiện tại |
   | `ngay` | không | Mặc định là ngày hiện tại, định dạng `DD/MM/YYYY` |
   | `thanh_toan` | không | Mặc định: tạm ứng 50% khi triển khai — 50% khi bàn giao |
   | `bao_hanh` | không | Mặc định: bảo hành 30 ngày |
   | `hieu_luc` | không | Mặc định: báo giá hiệu lực 15 ngày |
   | `phat_sinh` | không | Mặc định: yêu cầu phát sinh báo giá riêng |

   Mỗi phần tử trong `hang_muc_items` là 1 dòng riêng trong bảng, tự đánh số
   STT tăng dần, và có ĐƠN GIÁ/THÀNH TIỀN riêng:

   | Trường con | Bắt buộc | Ghi chú |
   |---|---|---|
   | `ten_hang_muc` | có | Tên hạng mục, hiện ở cột "HẠNG MỤC" |
   | `chi_tiet` | có | Chuỗi nhiều dòng (`\n`), các nhóm cách nhau dòng trống (`\n\n`) — xem quy tắc soạn ở bước 2 |
   | `gia` | có | Số nguyên, đơn vị VNĐ |
   | `ghi_chu` | không | Cột "GHI CHÚ", mặc định `"Tạm ứng 50% — 50% khi bàn giao"` |

   TỔNG CỘNG luôn là công thức `=SUM(...)` cộng toàn bộ các dòng — không bao
   giờ nhập tay tổng tiền.

   Các điều khoản thanh toán/bảo hành/hiệu lực **mặc định áp dụng cho mọi mức
   giá** (không phân biệt gói nhỏ/lớn) trừ khi người dùng yêu cầu khác đi cho
   báo giá cụ thể đó.

4. **Lưu và gửi file.** Lưu vào `~/Downloads/BaoGia-<TenKhachHang>-<LoaiDichVu>.xlsx`
   (không dấu, không khoảng trắng, VD: `BaoGia-MyThuan-Website.xlsx`), rồi gửi
   cho người dùng qua công cụ gửi file. Nếu có LibreOffice (`soffice`) trên
   máy, chạy lại công thức để đảm bảo không lỗi (dùng cách tương tự skill
   `xlsx`'s `recalc.py` nếu có sẵn); nếu không có, nói rõ với người dùng rằng
   công thức chưa được recalculation cục bộ nhưng đều là công thức đơn giản
   (`=D11`, `=SUM(E11)`) nên Excel sẽ tự tính khi mở file.

## Khi nào tách nhiều dòng hạng mục, khi nào gộp 1 dòng

- **Nhiều dòng (`hang_muc_items` >1 phần tử):** khi các phần việc có mức giá
  tách bạch, khách cần thấy rõ từng khoản trong bảng — ví dụ "Thiết kế web
  3tr + Hosting/domain năm đầu 800k + SEO khởi điểm 500k".
- **1 dòng (`hang_muc`/`chi_tiet`/`gia`):** khi toàn bộ là một gói trọn gói,
  báo giá 1 mức giá duy nhất — các đầu việc con chỉ liệt kê mô tả trong CHI
  TIẾT chứ không tách giá (như 2 ví dụ trong `references/example_specs.json`).

Script tự chèn thêm dòng bảng khi cần (dịch chuyển đúng merge cell, ảnh QR
chuyển khoản, và công thức TỔNG CỘNG xuống theo) — không cần chỉnh tay.
