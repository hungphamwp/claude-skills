# Hướng Dẫn Sử Dụng — Flatsome Web Finder

## Mục lục
1. [Tổng quan](#tổng-quan)
2. [5 Chế độ sử dụng](#5-chế-độ-sử-dụng)
3. [Ví dụ thực tế](#ví-dụ-thực-tế)
4. [Mẹo dùng nhanh trên điện thoại](#mẹo-dùng-nhanh-trên-điện-thoại)
5. [Cách cho feedback để kết quả tốt hơn](#cách-cho-feedback)
6. [Xuất kết quả cho khách hàng](#xuất-kết-quả)
7. [Lưu ý quan trọng](#lưu-ý)
8. [FAQ](#faq)

---

## Tổng quan

Skill này giúp bạn tìm website tham khảo cho bất kỳ ngành nào, đảm bảo:
- Mọi gợi ý đều build được bằng Flatsome UX Builder
- Kết quả đã được lọc tech stack (loại React, Vue, custom code)
- Được chấm điểm tương thích (★1-5)
- Sắp xếp từ phù hợp nhất → ít phù hợp
- 5 kết quả đầu tiên đã đủ tốt để dùng

---

## 5 Chế Độ Sử Dụng

### Chế độ 1: TÌM NHANH (Quick Find) ⚡
**Dùng khi:** Cần kết quả nhanh, đang dùng điện thoại, không muốn gõ nhiều

**Cách dùng:** Gõ ngắn gọn, Claude sẽ hỏi 1 câu chọn option:
```
tìm mẫu web ngành y tế
```
```
web xây dựng đẹp, 10 mẫu
```
```
mẫu web công ty logistics B2B
```

**Claude sẽ:** Hỏi 1 câu chọn nhanh → Tìm → Trả 5-10 kết quả đã lọc

---

### Chế độ 2: TÌM KỸ (Detailed Find) 🔍
**Dùng khi:** Có thời gian, muốn kết quả chính xác nhất, dự án quan trọng

**Cách dùng:**
```
tìm kỹ mẫu web cho công ty sản xuất thiết bị y tế, B2B,
công ty vừa, web tiếng Việt, phong cách hiện đại tối giản,
cần WooCommerce catalog sản phẩm, không cần custom nhiều
```

Hoặc ngắn hơn:
```
tìm kỹ web thiết bị y tế
```
Claude sẽ hỏi bạn từng bước chi tiết hơn.

---

### Chế độ 3: TÌM TƯƠNG TỰ (Find Similar) 🔄
**Dùng khi:** Đã có 1 web thích rồi, muốn tìm thêm giống vậy

**Cách dùng:**
```
tìm web giống ecobavietnam.com.vn
```
```
tôi thích web phucbinh.com.vn, tìm 5 web tương tự
```
```
web giống sonhaigroup.vn nhưng ngành y tế
```

**Claude sẽ:** Phân tích web mẫu → Tìm web có layout/style tương tự → Lọc Flatsome

---

### Chế độ 4: KIỂM TRA WEB (Layout Audit) 🔎
**Dùng khi:** Tự tìm được 1 web đẹp, muốn biết build Flatsome được không

**Cách dùng:**
```
phân tích web abc.com có build được bằng Flatsome không
```
```
check web xyz.vn tương thích Flatsome không
```

**Claude sẽ:** Scan tech stack → Map từng section → Chấm điểm → Gợi ý cách build

---

### Chế độ 5: PHÂN TÍCH ĐỐI THỦ (Competitor Spy) 🕵️
**Dùng khi:** Muốn web đẹp hơn đối thủ

**Cách dùng:**
```
web đối thủ tôi là competitor.com, tìm web đẹp hơn cùng ngành
```
```
phân tích competitor.com và tìm mẫu web tốt hơn, build được Flatsome
```

---

## Ví Dụ Thực Tế

### Ví dụ 1: Tìm nhanh trên điện thoại
```
Bạn: web xây dựng VN 5 mẫu
Claude: [hỏi 1 câu chọn option]
Bạn: [chọn: Corporate, B2B, Vừa, kéo thả 100%]
Claude: [trả 5 kết quả ★★★★-★★★★★, sorted by score]
```

### Ví dụ 2: Tìm chi tiết
```
Bạn: tìm kỹ mẫu web cho công ty thiết bị y tế, B2B,
     phong cách sạch sẽ chuyên nghiệp, cần catalog sản phẩm,
     web tiếng Việt, 10 mẫu
Claude: [skip câu hỏi vì đủ thông tin, tìm ngay]
Claude: [trả 10 kết quả với phân tích chi tiết từng web]
```

### Ví dụ 3: Tìm tương tự
```
Bạn: tôi thích web vinaenc.com.vn và phucbinh.com.vn, tìm thêm 5 web giống vậy
Claude: [phân tích 2 web → extract pattern → tìm matching]
```

### Ví dụ 4: Feedback loop
```
Bạn: [nhận 10 kết quả]
Bạn: web 2 và 7 OK, còn lại phong cách chưa đúng, hơi quá corporate
Claude: [hỏi ngắn về "thích gì ở web 2,7"]
Claude: [tìm thêm 5 web điều chỉnh theo feedback]
```

### Ví dụ 5: Kiểm tra 1 web cụ thể
```
Bạn: check web newtecons.vn build được Flatsome không
Claude: [scan] Tech: Custom fullpage.js + SVG animation
        Verdict: ★★ — Không phù hợp. Fullpage scroll và SVG animation
        không có native trong Flatsome. Cần custom JS nhiều.
        Gợi ý: Tham khảo layout tổng thể nhưng bỏ fullpage scroll,
        thay bằng section scroll thường.
```

### Ví dụ 6: Xuất cho khách
```
Bạn: xuất kết quả ra file Word cho khách
Claude: [tạo file .docx chuyên nghiệp với bảng so sánh,
        mô tả từng web, điểm tương thích]
```

---

## Mẹo Dùng Nhanh Trên Điện Thoại

1. **Gõ ngắn nhất có thể:**
   - "web y tế 5 mẫu" ← đủ
   - "web xây dựng B2B VN" ← đủ
   - "giống phucbinh.com.vn 5 cái" ← đủ

2. **Dùng từ khóa nhanh:**
   - "nhanh" hoặc "quick" → Quick Find mode
   - "kỹ" hoặc "deep" → Detailed mode
   - "giống" hoặc "similar" → Find Similar mode
   - "check" hoặc "audit" → Layout Audit mode
   - "đối thủ" hoặc "competitor" → Competitor Spy mode

3. **Chọn option thay vì gõ:** Claude sẽ đưa ra các option để bạn chọn số thay vì phải gõ câu dài

4. **Feedback bằng số:** Sau khi nhận kết quả, chỉ cần nói "web 2, 5 OK" — không cần giải thích dài

---

## Cách Cho Feedback

Sau mỗi đợt kết quả, bạn có thể:

**Cách 1 — Nhanh nhất:** "web 2, 5 OK" hoặc "web 1, 3, 4 không phù hợp"

**Cách 2 — Có lý do:** "web 2 OK vì layout sạch, web 5 OK vì màu đẹp. Còn lại quá phức tạp"

**Cách 3 — Điều chỉnh:** "tìm thêm nhưng ưu tiên web có parallax và counter"

Claude sẽ tự điều chỉnh tiêu chí cho đợt tìm tiếp theo.

---

## Xuất Kết Quả Cho Khách Hàng

Sau khi chọn được các mẫu web ưng ý, bạn có thể yêu cầu:

- **"xuất ra Word"** → File .docx chuyên nghiệp với bảng, mô tả, điểm số
- **"xuất ra PowerPoint"** → Slide deck trình bày cho khách
- **"xuất ra Excel"** → Bảng so sánh chi tiết
- **"cho danh sách copy"** → Text thuần để paste vào chat/email

---

## Lưu Ý Quan Trọng

1. **Kết quả đã được lọc tech stack.** Mọi website gợi ý đều đã kiểm tra HTML source, không phải gợi ý mù.

2. **★★★★-★★★★★ = an toàn.** Bạn có thể build bằng Flatsome UX Builder với ít hoặc không cần custom code.

3. **★★★ = cần custom.** Vẫn build được nhưng cần thêm CSS hoặc plugin. Chỉ xuất hiện nếu bạn chọn "custom thoải mái".

4. **Không phải web nào đẹp cũng build được.** Đó là lý do skill này tồn tại — nó lọc giúp bạn.

5. **Feedback giúp cải thiện.** Mỗi lần bạn nói "web nào OK, web nào KO", đợt sau sẽ chính xác hơn.

6. **10 ngành có preset sẵn:** Xây dựng, Y tế, BĐS, Nội thất, Sản xuất, IT, Giáo dục, F&B, Logistics, Năng lượng. Các ngành khác cũng hỗ trợ nhưng không có preset.

---

## FAQ

**Q: Skill có tìm được web nước ngoài không?**
A: Có. Chọn "Quốc tế" hoặc "Cả hai" trong phần khu vực.

**Q: Tôi muốn tìm web không phải Flatsome, ví dụ Elementor?**
A: Skill được thiết kế cho Flatsome, nhưng logic tương tự áp dụng được. Bạn có thể nói "tương thích Elementor thay vì Flatsome" — phần lọc tech stack vẫn hoạt động.

**Q: Mỗi lần tìm mất bao lâu?**
A: Quick Find ~2-3 phút cho 5 kết quả. Detailed Find ~5-8 phút cho 10 kết quả.

**Q: Có thể tìm cho ngành không có trong preset không?**
A: Có. Gõ tên ngành, Claude sẽ tìm bình thường chỉ là không có smart defaults.

**Q: Kết quả có bao gồm screenshot không?**
A: Không có ảnh chụp thực tế (Claude không browse được). Nhưng có mô tả chi tiết layout, màu sắc, font chữ, và từng section. Bạn cần tự mở URL để xem.
