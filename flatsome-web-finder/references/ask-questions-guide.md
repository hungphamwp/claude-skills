# Question Templates — Optimized for Speed

The #1 principle: minimize user typing. Use AskUserQuestion with pre-built options. User should be able to PICK, not TYPE.

---

## QUICK MODE — One Combined Question

When user gives a short request, ask everything in ONE question. Pre-fill industry if already mentioned.

```
Cho tôi biết nhanh về dự án (chọn mỗi mục 1 option):

🏢 Ngành:
  ○ Xây dựng / Nhà thầu
  ○ Thiết bị y tế / Dược
  ○ Bất động sản
  ○ Nội thất / Trang trí
  ○ Sản xuất / Công nghiệp
  ○ Công nghệ / IT
  ○ Giáo dục / Đào tạo
  ○ Thực phẩm / F&B
  ○ Vận tải / Logistics
  ○ Năng lượng / Solar
  ○ Khác: ___

📐 Phong cách:
  ○ Hiện đại tối giản (nhiều khoảng trắng, ít chi tiết)
  ○ Corporate chuyên nghiệp (doanh nghiệp, uy tín)
  ○ Bold / Sáng tạo (màu mạnh, layout ấn tượng)
  ○ Sang trọng / Premium (tông tối, tinh tế)
  ○ Cổ điển / Truyền thống (an toàn, quen thuộc)
  ○ Cho tôi xem đa dạng

👥 Khách hàng:
  ○ B2B (bán cho doanh nghiệp)
  ○ B2C (bán cho người tiêu dùng)
  ○ Cả hai

🏗️ Quy mô công ty:
  ○ Nhỏ (startup, <20 người)
  ○ Vừa (20-200 người)
  ○ Lớn (200+ người)
  ○ Tập đoàn (đa ngành)

🌍 Web tham khảo từ:
  ○ Chỉ công ty Việt Nam
  ○ Chỉ quốc tế
  ○ Cả hai, ưu tiên VN
  ○ Cả hai, ưu tiên quốc tế

🛒 WooCommerce:
  ○ Bán hàng online (giỏ hàng, thanh toán)
  ○ Chỉ show catalog sản phẩm
  ○ Không cần — chỉ giới thiệu dịch vụ

⚡ Mức build:
  ○ Kéo thả 100% UX Builder (không custom)
  ○ Chấp nhận thêm CSS nhỏ
  ○ Custom thoải mái, miễn đẹp

🔢 Cần bao nhiêu mẫu: 5 / 10 / 15
```

### Shortcut rules:
- If user already said the industry → skip 🏢, auto-fill
- If user said "B2B" or "B2C" → skip 👥
- If user said "web VN" or "web tiếng Việt" → skip 🌍, set to VN
- If user said "hiện đại" or "tối giản" → skip 📐, auto-fill
- If this is a follow-up search (user gave feedback on previous round) → skip all, use previous settings + user feedback

---

## DETAILED MODE — Multi-step Questions

Only use when user asks for "tìm kỹ" or "deep search". Split into steps:

### Step 1: Basic info (same as Quick Mode above)

### Step 2: Content & Structure
```
Về cấu trúc nội dung website:

📄 Cần tham khảo những trang nào:
  ☐ Homepage (trang chủ)
  ☐ About (giới thiệu)
  ☐ Services (dịch vụ)
  ☐ Projects/Portfolio (dự án)
  ☐ Products/Shop (sản phẩm)
  ☐ Blog/News (tin tức)
  ☐ Contact (liên hệ)
  ☐ Careers (tuyển dụng)
  ☐ Toàn bộ sitemap

🎯 Nội dung chính của web:
  ○ Dự án/Portfolio là trọng tâm
  ○ Dịch vụ là trọng tâm
  ○ Sản phẩm/Catalog là trọng tâm
  ○ Tin tức/Blog là trọng tâm
  ○ Kết hợp đều

🏆 Social proof cần có:
  ☐ Testimonial (đánh giá khách hàng)
  ☐ Counter số liệu (năm, dự án, khách hàng...)
  ☐ Logo đối tác/khách hàng
  ☐ Chứng chỉ/Giải thưởng (ISO, CE...)
  ☐ Case study chi tiết
  ☐ Báo chí đưa tin
```

### Step 3: Design Details
```
Chi tiết thiết kế:

🎨 Tông màu:
  ○ Ấm (đỏ, cam, vàng)
  ○ Lạnh (xanh dương, xanh lá, tím)
  ○ Trung tính (xám, đen, trắng)
  ○ Earth tone (nâu, be, olive)
  ○ Có màu cụ thể: ___

📸 Kiểu hình ảnh:
  ○ Ảnh thực tế chất lượng cao
  ○ Stock photo
  ○ Illustration/đồ họa
  ○ Icon-heavy, ít ảnh
  ○ Mix

🔝 Kiểu Header:
  ○ Transparent (trong suốt, nổi trên hero)
  ○ Solid color (có nền)
  ○ Mega-menu (menu lớn nhiều cột)
  ○ Đơn giản (logo + menu)

📱 Mobile:
  ○ Rất quan trọng (mobile-first)
  ○ Quan trọng bình thường
  ○ Ưu tiên desktop

💬 CTA / Lead gen:
  ○ Form liên hệ cơ bản
  ○ + Popup bắt lead
  ○ + Nút Zalo/Messenger floating
  ○ + Calculator/báo giá online
  ○ + Chatbot

🌐 Đa ngôn ngữ:
  ○ Chỉ tiếng Việt
  ○ Song ngữ Việt-Anh
  ○ Đa ngôn ngữ (3+)
  ○ Chỉ tiếng Anh

🎭 Cảm xúc thương hiệu:
  ○ Đáng tin cậy / Vững vàng
  ○ Sáng tạo / Đổi mới
  ○ Thân thiện / Gần gũi
  ○ Cao cấp / Sang trọng
  ○ Trẻ trung / Năng động
  ○ Truyền thống / Uy tín lâu năm
```

---

## FIND SIMILAR MODE — Minimal Questions

When user provides a URL, only ask:
```
Bạn thích gì ở website [URL] này:
  ☐ Layout / bố cục tổng thể
  ☐ Màu sắc
  ☐ Kiểu chữ / typography
  ☐ Cách trình bày dự án/sản phẩm
  ☐ Animation / hiệu ứng
  ☐ Tất cả — tìm web gần giống nhất

Cần bao nhiêu mẫu tương tự: 5 / 10
```

---

## FEEDBACK LOOP — After First Round

When user gives feedback on results (e.g., "web 2 và 5 OK, còn lại chưa phù hợp"):

DO NOT ask full questionnaire again. Instead ask:
```
Cảm ơn feedback! Để tôi tìm chính xác hơn:

Web [2] và [5] bạn thích điểm gì:
  ○ Layout
  ○ Màu sắc
  ○ Cách show dự án/sản phẩm
  ○ Tổng thể đều thích

Các web còn lại chưa phù hợp vì:
  ○ Quá phức tạp để build
  ○ Phong cách không đúng
  ○ Màu sắc không phù hợp
  ○ Thiếu section quan trọng
  ○ Lý do khác: ___

Tìm thêm bao nhiêu: 5 / 10
```

Then refine search criteria based on feedback WITHOUT re-asking everything.

---

## Smart Detection — Skip Questions Automatically

If the conversation already contains enough context, skip questions entirely and go straight to searching:

**Auto-detect from user message:**
- "web xây dựng" → Industry: Construction
- "B2B" or "bán cho doanh nghiệp" → Audience: B2B
- "hiện đại", "modern" → Style: Modern
- "tối giản", "minimalist" → Style: Minimalist
- "sang trọng", "premium", "luxury" → Style: Luxury
- "công ty nhỏ", "startup" → Scale: Small
- "tập đoàn", "corporation" → Scale: Enterprise
- "web VN", "tiếng Việt" → Region: Vietnam
- "có bán hàng", "WooCommerce", "sản phẩm" → WooCommerce: Yes
- "không custom", "kéo thả" → Build level: No custom
- "5 mẫu", "10 mẫu" → Quantity: as specified
- "nhanh", "quick" → Mode: Quick Find

**If 4+ parameters detected:** Skip questions, go straight to search
**If 2-3 parameters detected:** Ask ONE short question for remaining essentials
**If 0-1 parameters detected:** Ask the Quick Mode combined question
