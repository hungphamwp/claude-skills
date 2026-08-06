---
name: video-dai-hpb
description: "Dựng video dọc 1080×1920 DÀI (60–240 giây, nhiều cảnh) có giọng đọc tiếng Việt, nhạc nền và hiệu ứng — dùng cho video hướng dẫn, giải thích, chia sẻ kiến thức, review, kể chuyện thương hiệu. Dùng skill này khi người dùng muốn: video 1 phút / 2 phút / 3 phút, video hướng dẫn nhiều bước, video giáo dục, video giải thích một chủ đề, video có kịch bản nhiều cảnh, hoặc nói rõ số cảnh (20 cảnh, 50 cảnh). Video quảng cáo 15 giây một màn hình thì dùng skill video-quangcao-hpb, không dùng skill này."
compatibility: "Google Chrome, ffmpeg, Node.js + puppeteer-core, Python 3 + numpy, edge-tts (`pip3 install --user edge-tts`). Thư mục skill: ~/.claude/skills/video-dai-hpb/"
---

# Video Dọc Dài — Nhiều Cảnh

Dựng video 1080×1920, 30fps, dài tuỳ ý, từ **hai file dữ liệu**:
`scenes.js` (hình) và `voiceover.json` (tiếng).

Khác skill `video-quangcao-hpb`: skill kia render một layout cố định 15
giây. Skill này chạy timeline nhiều cảnh — mỗi cảnh chọn một trong 12
layout, ghép lại thành bài dài.

---

## GIỚI HẠN PHẢI BIẾT TRƯỚC

**Render rất lâu: ~0.33 giây thực cho mỗi frame.**

| Thời lượng | Số frame | Thời gian render |
|---|---|---|
| 30 giây | 900 | ~5 phút |
| 60 giây | 1800 | ~10 phút |
| 180 giây | 5400 | **~30 phút** |

Vì vậy **luôn xem thử vài mốc trước khi render đủ bài**. Sửa nội dung rồi
render lại cả bài là mất thêm 30 phút — không có cách nào rút ngắn.

---

## QUY TRÌNH

### Bước 1 — Chốt cấu trúc trước khi viết cảnh

Video dài sống chết ở nhịp. Chia thành **act**, mỗi act 3–6 cảnh,
**mỗi cảnh 3–5 giây**. Video 180s ≈ 45–50 cảnh.

Mỗi act phải có một câu mở đầu đánh vào nỗi sợ hoặc tò mò — đó là điểm
giữ chân. Đặt điểm giữ chân ở khoảng giây 25, 50, 75, 120, 150.

Ba giây đầu **phải ra kết quả**, không chào, không giới thiệu.

### Bước 2 — Dựng thư mục dự án

```bash
mkdir -p ~/Desktop/<tên-dự-án> && cd ~/Desktop/<tên-dự-án>
cp -R ~/.claude/skills/video-dai-hpb/assets/template/* .
cp ~/.claude/skills/video-dai-hpb/scripts/* .
cp ~/.claude/skills/video-dai-hpb/assets/scenes-example.js scenes.js
cp ~/.claude/skills/video-dai-hpb/assets/voiceover-example.json voiceover.json
ln -s <thư-mục-có-puppeteer-core>/node_modules node_modules
mkdir -p output audio
```

Rồi sửa `scenes.js` và `voiceover.json` theo nội dung mới. **`t` và `d`
trong scenes.js phải khớp với `at` và `budget` trong voiceover.json** —
lệch là hình một đằng tiếng một nẻo.

### Bước 3 — Xem thử bố cục (bắt buộc)

```bash
node record.js --preview 8,40,96,150
```

Vài giây ra ảnh PNG trong `output/preview/`. **Mở ra xem bằng công cụ
Read.** Chữ tràn, thẻ xuống dòng, chồng chữ — lộ hết ở đây.

Thử font khác mà không phải sửa CSS:

```bash
node record.js --preview 8,40,96 --font "Montserrat"
```

### Bước 4 — Làm giọng đọc TRƯỚC khi render hình

```bash
python3 build_vo_edge.py
```

Script đo từng câu, câu nào dài quá `budget` thì đẩy nhanh **tối đa 10%**;
quá ngưỡng đó nó in cảnh báo kèm số từ cần bỏ. **Rút chữ cho hết cảnh
báo rồi mới render hình** — sửa lời sau khi render xong là phải render lại.

### Bước 5 — Render + ghép tiếng

```bash
node record.js && python3 build_audio.py --vo-wav audio/voiceover-pro.wav
ffmpeg -y -i output/video-final.mp4 -af loudnorm=I=-14:TP=-1.0:LRA=11 \
  -c:v copy -c:a aac -b:a 192k -ar 48000 output/_n.mp4 && \
  mv output/_n.mp4 output/video-final.mp4
```

Bước `loudnorm` không bỏ được — TikTok/Reels cần **-14 LUFS**, không
chuẩn hoá thì video nghe nhỏ hơn hẳn video người khác.

### Bước 6 — Giao file

Copy MP4 ra Desktop, gửi bằng công cụ gửi file, nói rõ đường dẫn.
Nhắc họ: **phụ đề chưa burn vào video** — để họ import SRT vào
CapCut/Premiere rồi còn tô được từ khoá.

---

## 12 LAYOUT CÓ SẴN

Mỗi cảnh trong `scenes.js` khai `l` (layout) + dữ liệu:

| `l` | Dùng cho | Trường chính |
|---|---|---|
| `title` | Câu tuyên bố, tiêu đề act | `kicker` `h1` `sub` `stage2` `punch` |
| `bignum` | Con số gây ấn tượng | `num` `sub` `prog` `glow` |
| `code` | Cửa sổ code gõ ra từng dòng | `lines` `speed` `files` `timer` `errorLine` `overlay` |
| `chat` | Ô prompt gõ từng ký tự | `label` `type` `speed` `hl` `phone` `enter` |
| `term` | Terminal chạy lệnh, hiện lỗi rồi tick xanh | `cmd` `out[]` |
| `cards` | Danh sách 3–4 thẻ có icon | `items[]` `drop` `sm` `mood` |
| `cmp` | So sánh 2 ô sai/đúng, trước/sau | `left` `right` `col` |
| `phone` | Mockup điện thoại có web cuộn thật | `scroll` `darkWipe` `overlayNum` `tags` `reveal` |
| `brw` | Trình duyệt co giãn theo breakpoint | `widths[[px,cols]]` |
| `tool` | Giới thiệu một công cụ + cửa sổ mô phỏng | `name` `chip` `win` |
| `viz` | 10 minh hoạ nhỏ (xem bảng dưới) | `viz` + trường riêng |
| `cta` | Khối kêu gọi theo dõi cuối bài | `tail` |

**`viz` có sẵn:** `keys` (bàn phím tan) · `chart` (đồ thị dựng) ·
`tree` (cây thư mục quét sáng) · `merge` (nhiều ô gộp thành một) ·
`scatter` (logo trôi hỗn loạn) · `wire` (wireframe tự vẽ) ·
`check` (checklist tick + con trỏ bấm) · `deploy` (thanh chạy + thẻ URL) ·
`split` (khối lớn vỡ thành nhiều khối nhỏ) · `timeline` (mốc thời gian,
`broken:true` thì vỡ tan) · `books` (chồng sách đổ).

Thêm `step: 1..6` vào cảnh để hiện **thanh tiến trình 6 bước** ở đáy —
thứ giữ chân tốt nhất ở đoạn giữa video. `allSteps: true` cho sáng cả 6.

---

## 11 KIỂU CHUYỂN CẢNH

Khai bằng `out` trong mỗi cảnh:

`cut` (mặc định, cắt đúng beat) · `whip` (lia ngang, đổi chủ đề) ·
`punch` (phóng to, dẫn vào act mới) · `blur` · `sweep` (vệt sáng quét) ·
`glitch` / `flashglitch` (điểm bẻ lái, cảnh báo) · `morph` ·
`glass` (panel kính trượt) · `coderain` · `flash` (chỉ dùng 1 lần, ở đỉnh
cảm xúc) · `end` (fade cuối bài).

**Không dùng cùng một kiểu 2 lần liên tiếp.**

---

## VIẾT LỜI ĐỌC

`voiceover.json`: mảng `{at, budget, text}`.

- `at` = giây bắt đầu · `budget` = số giây tối đa
- Đặt `at` **sau** `t` của cảnh khoảng 0.2s để lời rơi vào sau khi hình vào
- Nhịp tự nhiên: **3.2–3.5 âm tiết/giây**, không vượt 4.6
- Giọng neural **ngắt nghỉ thật ~0.4s ở mỗi dấu chấm** — câu 3 mệnh đề
  tốn nhiều thời gian hơn bạn tưởng. Muốn rút ngắn thì **gộp mệnh đề**,
  hiệu quả hơn bỏ từ.
- **Từ tiếng Anh cứ viết bình thường** (`Cursor`, `ChatGPT`, `deploy`) —
  giọng neural đọc đúng, không cần phiên âm.
- **Số điện thoại và số tiền viết bằng chữ**: `0913 337 280` →
  `không chín một ba, ba ba bảy, hai tám không`; `6.000.000đ` → `sáu triệu`.

Đổi giọng: `python3 build_vo_edge.py --voice vi-VN-NamMinhNeural --rate -6`

---

## CHỮ VÀ BỐ CỤC

Font mặc định **Be Vietnam Pro** — chọn nó vì dấu tiếng Việt được vẽ
riêng, đặt đúng chỗ. Inter ở cỡ 100px+ dấu chật và sát chữ, lộ rõ ở những
dòng nhiều dấu.

**Vùng an toàn:** chừa **220px trên** (UI TikTok), **420px dưới**
(caption + nút Follow), **80px hai bên**.

**Cỡ chữ tối thiểu 40px.** Video 1080px xem trên điện thoại rộng ~400px là
thu nhỏ 2.7 lần — chữ 32px chỉ còn ~12px thật. Dòng đứng một mình nên
≥44px.

Đổi màu chủ đạo: sửa `--a1` `--a2` `--a3` trong `style.css`. Nền `--bg`
phải thật tối, chữ trắng và glow chỉ đẹp trên nền tối.

---

## LỖI THƯỜNG GẶP

| Hiện tượng | Nguyên nhân · cách xử lý |
|---|---|
| Frame nào cũng là trạng thái đầu cảnh | Timeline tạo sau khi font load xong nên `startTime` lệch khỏi 0. Phải seek `window.__TL`, **không** seek `gsap.globalTimeline` |
| Hiệu ứng không seek được | Dùng CSS animation. Mọi chuyển động phải do GSAP điều khiển |
| `clip-path` không chạy | GSAP không nội suy `inset()`. Đổi sang animate `height` + `overflow:hidden` |
| Chữ tràn / thẻ xuống dòng | Đổi font làm chữ rộng thêm. Hạ cỡ chữ thẻ, xem thử lại |
| Icon hiện ô vuông trống | Sai tên Font Awesome, hoặc dùng icon brand (bộ Free Solid không có `fa-js`, `fa-github`) |
| Giọng đọc chồng nhau | Xem cảnh báo `⚠️` của `build_vo_edge.py`, rút chữ |
| Video nghe nhỏ hơn video người khác | Quên bước `loudnorm` |
| Render chậm bất thường | `filter: blur()` hoặc `backdrop-filter` trên vùng lớn. Thay bằng `radial-gradient` |

---

## FILE THAM KHẢO

- `assets/scenes-example.js` — 48 cảnh thật của một video 180 giây, chép
  ra rồi sửa. **Đọc file này trước khi viết cảnh mới** — nó là ví dụ đầy
  đủ nhất về cách dùng 12 layout.
- `assets/voiceover-example.json` — 48 câu khớp với scenes-example.
- `references/kich-ban.md` — cách chia act, đặt điểm giữ chân, viết hook.
