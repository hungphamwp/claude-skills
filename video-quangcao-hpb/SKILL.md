---
name: video-quangcao-hpb
description: "Dựng video quảng cáo dọc 1080×1920 (TikTok/Reels/Shorts) hoàn chỉnh có giọng đọc tiếng Việt, nhạc nền và hiệu ứng — từ vài dòng thông tin cơ bản của HPB Media hoặc khách hàng. Dùng skill này BẤT CỨ KHI NÀO người dùng nhắc tới: làm video quảng cáo, video giới thiệu dịch vụ, clip TikTok/Reels/Shorts, video bán hàng, video 15 giây, animation quảng cáo, hay muốn 'làm video cho khách ngành X' — kể cả khi họ không nói rõ chữ 'skill' hay 'animation'. Cũng dùng khi cần sửa lại, đổi nội dung, đổi màu, đổi giọng đọc của video đã dựng trước đó."
compatibility: "macOS (lệnh `say`), Google Chrome, ffmpeg, Node.js, Python 3 + numpy. Thư mục skill: ~/.claude/skills/video-quangcao-hpb/"
---

# Video Quảng Cáo Dọc — HPB Media

Dựng video 1080×1920, 30fps, 15 giây, có tiếng, từ **một file JSON**.

Người dùng thường chỉ đưa vài dòng kiểu *"làm video quảng cáo thiết kế
website cho khách ngành nhà hàng, giá từ 9 triệu"*. Việc của bạn là biến
mấy dòng đó thành config đầy đủ rồi chạy một lệnh — họ không cần biết
JSON hay ffmpeg là gì.

---

## THÔNG TIN CÔNG TY (mặc định, không tự bịa)

- **Tên:** HPB MEDIA — Thiết kế Website & Digital Marketing
- **Đại diện:** Hưng Phạm · **SĐT:** 0913 337 280
- **Email:** hungphamcqb@gmail.com

Mặc định trong `scripts/build_video.py` đã có sẵn. Config chỉ cần khai
những gì khác mặc định.

---

## QUY TRÌNH

### Bước 1 — Đọc yêu cầu, hỏi cái còn thiếu

Chỉ hỏi những gì thực sự đổi kết quả. Thường chỉ cần:

| Bắt buộc | Suy ra được, không cần hỏi |
|---|---|
| Dịch vụ/ngành quảng cáo | Tiêu đề, chips, tabs, icon |
| Mức giá muốn hiện | Lời đọc, màu sắc, tên khách demo |

Nếu người dùng đưa đủ để đoán được (ví dụ "quảng cáo thiết kế web cho
spa"), **đừng hỏi lại** — soạn config rồi cho họ xem kết quả. Sửa một
dòng JSON rồi chạy lại nhanh hơn nhiều so với hỏi qua lại 5 lượt.

### Bước 2 — Viết config

Chép `assets/config-example.json` rồi sửa. Đọc `references/noi-dung.md`
trước khi viết lời quảng cáo — trong đó có bảng giá chuẩn, quy tắc ngôn
từ bắt buộc của HPB Media, công thức viết tiêu đề và danh sách icon.

### Bước 3 — Xem thử bố cục (nên làm)

```bash
python3 ~/.claude/skills/video-quangcao-hpb/scripts/build_video.py \
  --config /tmp/video.json --out ~/Desktop/video-abc --preview 4.6,9.5,13.5
```

Mất ~6 giây, ra 3 ảnh PNG trong `output/preview/`. **Hãy mở ảnh ra xem
bằng công cụ Read** trước khi render đủ 450 frame — tiêu đề dài quá,
chip tràn hàng hay chữ bị cắt sẽ lộ ngay ở đây, mà render lại thì tốn
gần 2 phút.

### Bước 4 — Dựng video hoàn chỉnh

```bash
python3 ~/.claude/skills/video-quangcao-hpb/scripts/build_video.py \
  --config /tmp/video.json --out ~/Desktop/video-abc
```

Khoảng 90 giây. Kết quả: `~/Desktop/video-abc/output/<name>-final.mp4`.

### Bước 5 — Giao file

Copy MP4 ra Desktop rồi gửi cho người dùng bằng công cụ gửi file. Nói rõ
đường dẫn — thư mục dự án nằm sâu thì họ không tự tìm được.

Báo lại ngắn gọn: đã dùng giá nào, tên khách demo nào, và **nhắc họ nghe
thử giọng đọc** — giọng `say` của macOS đọc sai một số từ viết tắt
(SEO, HPB) là chuyện thường, sửa cách viết trong `voiceover.lines` là xong.

---

## CẤU TRÚC CONFIG

Chỉ khai phần muốn đổi; phần còn lại lấy mặc định.

```json
{
  "content": {
    "badge": "Thiết kế Website & Digital Marketing",
    "headline1": "Website đẹp",
    "headline2": "Chốt đơn nhanh",
    "subtagline": "Chuẩn SEO · Tối ưu tốc độ · Bàn giao đúng hẹn",
    "chips": [
      { "icon": "fa-laptop-code", "text": "Thiết kế Website" }
    ],
    "tabs": [
      { "icon": "fa-building", "text": "Web Công ty", "active": true }
    ],
    "fields": [
      { "label": "Khu vực", "icon": "fa-location-dot",
        "static": true, "value": "TP. Hồ Chí Minh" },
      { "label": "Tên doanh nghiệp", "icon": "fa-briefcase",
        "placeholder": "Tên công ty...", "value": "Nội Thất An Phát" }
    ],
    "price_value": 6000000,
    "cta": "Gọi ngay 0913 337 280",
    "footer": ["HPB Media", "Hưng Phạm", "0913 337 280"]
  },
  "theme": { "accent": "#8b5cf6", "accent2": "#e838ff", "accent3": "#3b82f6" },
  "voiceover": { "lines": [{ "at": 0.9, "budget": 2.8, "text": "..." }] },
  "output": { "name": "ten-file" }
}
```

**Những chỗ dễ sai:**

- `fields`: ô có `"static": true` hiện sẵn chữ; ô không có thì **được gõ
  ra từng ký tự** trên video. Tối đa nên 3 ô gõ. Số ô càng nhiều modal
  càng cao, logo giữa màn tự thu nhỏ rồi tự ẩn — không cần chỉnh tay.
- `tabs`: đúng một tab có `"active": true`.
- `footer`: phần tử cuối cùng được tô sáng — để số điện thoại ở đó.
- `price_value`: số nguyên, không dấu chấm. Đặt `0` nếu không muốn hiện giá.
- `output.name`: không dấu, không khoảng trắng (thành tên file).

---

## VIẾT LỜI ĐỌC

Không khai `voiceover.lines` thì script tự sinh — chạy được nhưng nhạt.
Video ra tốt hay không nằm ở đây, nên viết tay:

```json
"voiceover": {
  "lines": [
    { "at": 0.9,  "budget": 2.8, "text": "Doanh nghiệp của bạn xứng đáng có một website đẹp." },
    { "at": 3.9,  "budget": 1.9, "text": "Đẹp thôi chưa đủ — phải ra đơn." },
    { "at": 6.1,  "budget": 2.9, "text": "HPB Media: web chuẩn SEO, đúng hẹn." },
    { "at": 9.3,  "budget": 1.4, "text": "Báo giá từ sáu triệu." },
    { "at": 10.9, "budget": 4.0, "text": "Gọi ngay Hưng Phạm: không chín một ba, ba ba bảy, hai tám không." }
  ]
}
```

- `at` = giây bắt đầu, `budget` = số giây tối đa cho câu đó. Câu dài quá
  budget sẽ được đọc nhanh hơn (tối đa 250 wpm) và script in cảnh báo —
  **để ý dòng cảnh báo `⚠️` trong output**, nếu có thì rút ngắn câu lại.
- Giữ 5 khung giờ trên; chúng đã khớp với nhịp hình (modal lên ở 3s,
  giá chạy ở 10s, CTA bật ở 11s).
- **Số điện thoại luôn viết bằng chữ** ("không chín một ba…"). TTS đọc
  dãy số liền thường sai nhịp hoặc gộp số nghe không ra.
- Tổng lời đọc nên ≤ 13 giây để còn chỗ thở.

---

## ĐỔI MÀU THEO KHÁCH HÀNG

Mặc định là màu HPB Media (xanh dương → tím → hồng). Làm video cho khách
thuộc ngành khác thì đổi `theme` — mọi thứ (icon, viền, ánh sáng nền,
gradient tiêu đề, nút CTA, màu chữ nhấn) tự đi theo:

```json
"theme": {
  "accent": "#f43f8e", "accent2": "#ffb020", "accent3": "#a855f7",
  "bg": "#100510",
  "gradient_text": "linear-gradient(135deg, #ff8ac4 0%, #ffb0d8 45%, #ffd79a 100%)"
}
```

`accent` là màu chính, `accent2` màu điểm nhấn (chấm trạng thái, icon
badge), `accent3` màu thứ ba trong gradient nút CTA. Nền `bg` phải thật
tối — chữ trắng và hiệu ứng phát sáng chỉ đẹp trên nền tối.

---

## KHI CẦN SỬA SÂU HƠN

Config không đủ (muốn đổi bố cục, thêm khối mới, đổi thời lượng) thì sửa
trực tiếp trong `assets/template/`:

| Muốn gì | Sửa ở đâu |
|---|---|
| Thêm/bớt khối trên màn hình | `index.html` + `applyContent()` trong `script.js` |
| Cỡ chữ, khoảng cách, bo góc | `style.css` |
| Thời điểm hiệu ứng | `BASE_LABELS` trong `scripts/build_video.py` |
| Nhạc nền, hợp âm, SFX | `scripts/build_audio.py` |

**Cỡ chữ trông to quá đừng vội giảm.** Video 1080px xem trên điện thoại
rộng ~400px là thu nhỏ 2.7 lần — chữ 32px trong CSS chỉ còn ~12px thật.
Đây là lỗi kinh điển khi ngắm bố cục trên màn hình máy tính.

---

## FILE THAM KHẢO

- `references/noi-dung.md` — bảng giá chuẩn, quy tắc ngôn từ bắt buộc,
  công thức viết tiêu đề, danh sách icon Font Awesome hay dùng. **Đọc
  file này trước khi viết nội dung quảng cáo.**
- `assets/config-example.json` — config đầy đủ, chép ra rồi sửa.

---

## LỖI THƯỜNG GẶP

| Hiện tượng | Cách xử lý |
|---|---|
| `Thiếu công cụ` khi chạy | Làm theo đúng lệnh script in ra (brew/pip/npm) |
| `❌ Trang bị lỗi JS` | Sai JSON — thường là thiếu dấu phẩy hoặc sai tên icon |
| Tiêu đề tràn ra ngoài | Rút dòng 2 còn ≤ 14 ký tự |
| Logo giữa màn biến mất | Đúng như thiết kế: 4 ô form thì không đủ chỗ |
| Giọng đọc chồng nhau | Xem cảnh báo `⚠️`, rút câu hoặc giãn `at` |
| Muốn giọng tự nhiên hơn | Thu bằng FPT.AI/ElevenLabs, xem cuối `references/noi-dung.md` |
