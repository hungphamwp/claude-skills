---
name: video-dai-hpb
description: "Dựng video dọc 1080×1920 DÀI (60–240 giây, nhiều cảnh) có giọng đọc tiếng Việt, nhạc nền và hiệu ứng — dùng cho video hướng dẫn, giải thích, chia sẻ kiến thức, review, kể chuyện thương hiệu. Dùng skill này khi người dùng muốn: video 1 phút / 2 phút / 3 phút, video hướng dẫn nhiều bước, video giáo dục, video giải thích một chủ đề, video có kịch bản nhiều cảnh, hoặc nói rõ số cảnh (20 cảnh, 50 cảnh). Video quảng cáo 15 giây một màn hình thì dùng skill video-quangcao-hpb, không dùng skill này."
compatibility: "Google Chrome, ffmpeg, Node.js + puppeteer-core, Python 3 + numpy. Giọng đọc: Gemini TTS (khuyến nghị, cần GEMINI_API_KEY) hoặc edge-tts (free, không cần key: `pip3 install --user edge-tts`). Thư mục skill: ~/.claude/skills/video-dai-hpb/"
---

# Video Dọc Dài — Nhiều Cảnh

Dựng video 1080×1920, 30fps, dài tuỳ ý, từ **hai file dữ liệu**:
`scenes.js` (hình) và `voiceover.json` (tiếng).

Khác skill `video-quangcao-hpb`: skill kia render một layout cố định 15
giây. Skill này chạy timeline nhiều cảnh — mỗi cảnh chọn một trong 13
layout, ghép lại thành bài dài.

Template mặc định đã là **giao diện "paper"**: nền giấy ấm, tiêu đề vàng
viền đen font Gilroy VH, logo HPB Media góc trên, và có thể gắn **mascot
cố định ở đáy màn** xuyên suốt video (xem mục MASCOT bên dưới).

---

## QUY TRÌNH NHANH — 1 lệnh ra video hoàn chỉnh

Khi đã có `scenes.js` + `voiceover.json` (tự viết theo hướng dẫn ở
"QUY TRÌNH" bên dưới), toàn bộ phần còn lại — soát lỗi, giọng đọc, render,
trộn nhạc, chuẩn hoá âm lượng, giao file — chạy gọn bằng:

```bash
# 1. Dựng khung dự án (1 lần)
bash ~/.claude/skills/video-dai-hpb/scripts/new_project.sh ~/Desktop/ten-du-an
# → viết scenes.js + voiceover.json vào thư mục vừa tạo
# → (tuỳ chọn) thêm ảnh mascot vào assets/mascot/, đặt tên 01-...png, 02-...png...

# 2. Chạy trọn quy trình
export GEMINI_API_KEY='...'     # lấy tại aistudio.google.com/apikey, có gói free
python3 ~/.claude/skills/video-dai-hpb/scripts/build_full.py \
  --project ~/Desktop/ten-du-an --duration 90
```

`build_full.py` tự chạy `check.js` → `build_vo_gemini.py` → `record.js` →
`build_audio.py` → `ffmpeg loudnorm` → copy ra Desktop. Dừng ngay và in lỗi
rõ ràng nếu `check.js` phát hiện vấn đề, không âm thầm render video hỏng.
Không có `GEMINI_API_KEY` thì tự bỏ qua bước giọng đọc và báo cho biết
(video ra sẽ câm, ghép tiếng tay sau bằng `build_vo_edge.py` hoặc
`build_vo_gemini.py` riêng).

Cờ hữu ích: `--voice Kore` (đổi giọng Gemini) · `--style "..."` (ghi đè
chỉ dẫn phong cách đọc) · `--no-voice` (chỉ render hình, xem thử bố cục)
· `--skip-check` (bỏ qua check.js, chỉ dùng khi đã chắc scenes sạch).

**Vẫn phải tự viết `scenes.js`/`voiceover.json` theo nội dung yêu cầu** —
phần đó cần hiểu ngữ cảnh nên không gói được vào script. Quy trình nhanh
chỉ gộp các bước máy móc lặp lại giống nhau ở mọi video.

---

## GIỚI HẠN PHẢI BIẾT TRƯỚC

**Đo thật, tính cả bước ffmpeg ghép frame:**

| Thời lượng | Frame | 1080p | 4K (`--scale 2`) |
|---|---|---|---|
| 30 giây | 900 | ~1.5 phút | ~2.5 phút |
| 60 giây | 1800 | ~3 phút | **~4.5 phút** |
| 180 giây | 5400 | ~8 phút | ~14 phút |

Số 4K đo trên một video 60 giây thật: chụp 1800 frame hết 193 giây,
ffmpeg ghép hết 84 giây, tổng 277 giây. Trước khi đổi sang JPEG là
1398 giây — **nhanh 5 lần**.

Đánh đổi duy nhất: file lớn hơn ~30% ở cùng CRF (40 MB thay vì 30 MB cho
60 giây 4K), vì JPEG để lại chút nhiễu tần số cao mà H.264 phải mã hoá.
Muốn nhỏ lại thì nâng CRF lên 21.

Frame trung gian là **JPEG q95**, không phải PNG. Đo thật: 90 frame mất
6.6s thay vì 29.1s — nhanh 4.4×; video cuối chênh nhau PSNR 50.1 dB /
SSIM 0.994, tức mắt không phân biệt được. Frame trung gian dù sao cũng bị
H.264 nén lại nên giữ PNG chỉ tốn thời gian. Cần PNG thật thì thêm
`--lossless`.

Dù đã nhanh, **vẫn phải chạy `check.js` trước khi render** — sửa nội dung
rồi render lại vẫn tốn vài phút, và lỗi bố cục thì mắt hay bỏ sót.

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
bash ~/.claude/skills/video-dai-hpb/scripts/new_project.sh ~/Desktop/<tên-dự-án>
cd ~/Desktop/<tên-dự-án>
cp ~/.claude/skills/video-dai-hpb/assets/scenes-example.js scenes.js
cp ~/.claude/skills/video-dai-hpb/assets/voiceover-example.json voiceover.json
```

`new_project.sh` tự copy template (paper theme + font Gilroy VH sẵn
trong đó), copy toàn bộ script, symlink `node_modules` (dùng chung
puppeteer-core với skill `video-quangcao-hpb` để khỏi cài lại), tạo sẵn
`output/`, `audio/`, `assets/mascot/`.

Rồi sửa `scenes.js` và `voiceover.json` theo nội dung mới. **`t` và `d`
trong scenes.js phải khớp với `at` và `budget` trong voiceover.json** —
lệch là hình một đằng tiếng một nẻo.

### Bước 3 — Soi lỗi bằng `check.js` (bắt buộc)

```bash
node check.js --duration 60
```

Quét **tất cả** các cảnh và trả về **chữ**, không phải ảnh:

```
Thời gian
  ✓ cảnh liền mạch, lời đọc rơi đúng cảnh, tổng khớp 60s
Bố cục
  ✓ 16 cảnh sạch · ⚠ 2 cảnh có vấn đề
  ⚠ cảnh 09  "Desktop · 1440px" cỡ chữ 34px < 40px
  ⚠ cảnh 18  "#VibeCoding  #AI" cỡ chữ 36px < 40px
→ 2 chỗ cần sửa trước khi render.
```

Nó bắt: chữ ra ngoài vùng an toàn, cỡ chữ dưới 40px, chip xuống dòng,
chữ bị cắt, cảnh hở/chồng thời gian, lời đọc rơi lệch cảnh, lỗi JS.

**Sửa cho hết cảnh báo rồi mới sang bước sau.** Chạy đến khi ra
`→ Sạch. Render được.`

Chỉ khi cần xem thẩm mỹ (màu, khoảng cách, cảm giác tổng thể) mới dùng ảnh —
và gộp nhiều mốc vào **một** ảnh cho đỡ tốn:

```bash
node record.js --preview 8,40,96,150 && cd output/preview && ffmpeg -i t-8s.png -i t-40s.png -i t-96s.png -i t-150s.png -filter_complex "[0]scale=300:-1[a];[1]scale=300:-1[b];[2]scale=300:-1[c];[3]scale=300:-1[d];[a][b][c][d]hstack=4" -y sheet.png
```

Thử font khác mà không phải sửa CSS: `node record.js --preview 8,40 --font "Montserrat"`

### Bước 4 — Làm giọng đọc TRƯỚC khi render hình

**Gemini TTS (khuyến nghị)** — tự nhiên hơn, nhận chỉ dẫn phong cách
bằng ngôn ngữ tự nhiên ngay trong prompt:

```bash
export GEMINI_API_KEY='...'   # aistudio.google.com/apikey, có gói free
python3 build_vo_gemini.py --voice Charon --duration 90
```

Mặc định `build_vo_gemini.py` chỉ dẫn model đọc "giọng miền Nam Việt Nam,
phong cách chuyên gia kỹ thuật AI, tự tin, rõ ràng" — đổi bằng `--style
"..."`. Danh sách giọng: `Kore` `Puck` `Charon` `Zephyr` `Leda` `Orus`
`Aoede` (không có giọng tên "Adam" — đó là tên riêng của ElevenLabs).
Gói free giới hạn khoảng 10 request/phút — script tự chờ và thử lại khi
bị chặn (429), không cần can thiệp tay.

Script cũng tự tăng tốc (time-stretch, giữ nguyên cao độ) những câu đọc
tràn `budget`, tối đa 1.25× — vẫn tràn thì in cảnh báo kèm số từ cần bỏ,
y hệt `build_vo_edge.py`.

**edge-tts (free, không cần tài khoản)** — dự phòng khi không có API key:

```bash
python3 build_vo_edge.py
```

Script đo từng câu, câu nào dài quá `budget` thì đẩy nhanh **tối đa 10%**;
quá ngưỡng đó nó in cảnh báo kèm số từ cần bỏ. **Rút chữ cho hết cảnh
báo rồi mới render hình** — sửa lời sau khi render xong là phải render lại.

### Bước 5 — Render + ghép tiếng

```bash
node check.js && node record.js && python3 build_audio.py --vo-wav audio/voiceover-pro.wav
ffmpeg -y -i output/video-final.mp4 -af loudnorm=I=-14:TP=-1.0:LRA=11 \
  -c:v copy -c:a aac -b:a 192k -ar 48000 output/_n.mp4 && \
  mv output/_n.mp4 output/video-final.mp4
```

Bước `loudnorm` không bỏ được — TikTok/Reels cần **-14 LUFS**, không
chuẩn hoá thì video nghe nhỏ hơn hẳn video người khác.

(Cả bước 4 và 5 gộp sẵn trong `build_full.py` — xem "QUY TRÌNH NHANH"
ở đầu file.)

### Bước 6 — Giao file

Copy MP4 ra Desktop, gửi bằng công cụ gửi file, nói rõ đường dẫn.
Nhắc họ: **phụ đề chưa burn vào video** — để họ import SRT vào
CapCut/Premiere rồi còn tô được từ khoá.

---

## 14 LAYOUT CÓ SẴN

Mỗi cảnh trong `scenes.js` khai `l` (layout) + dữ liệu:

| `l` | Dùng cho | Trường chính |
|---|---|---|
| `title` | Câu tuyên bố, tiêu đề act | `kicker` `h1` `sub` `stage2` `punch` |
| `mascot` | Câu tuyên bố kèm 1 ảnh nhân vật minh hoạ ngay giữa cảnh | `kicker` `img` `h1` `sub` |
| `bignum` | Con số gây ấn tượng | `num` `sub` `prog` `glow` |
| `code` | Cửa sổ code gõ ra từng dòng | `lines` `speed` `files` `timer` `errorLine` `overlay` |
| `chat` | Ô prompt gõ từng ký tự | `label` `type` `speed` `hl` `phone` `enter` |
| `term` | Terminal chạy lệnh, hiện lỗi rồi tick xanh | `cmd` `out[]` |
| `cards` | Danh sách 3–4 thẻ có icon (thêm `sub` cho mỗi mục nếu cần mô tả rõ hơn) | `items[]` `drop` `sm` `mood` |
| `cmp` | So sánh 2 ô sai/đúng, trước/sau — tự có badge "VS" ở giữa | `left` `right` `col` `note` `vs` |
| `phone` | Mockup điện thoại có web cuộn thật | `scroll` `darkWipe` `overlayNum` `tags` `reveal` |
| `brw` | Trình duyệt co giãn theo breakpoint | `widths[[px,cols]]` |
| `tool` | Giới thiệu một công cụ + cửa sổ mô phỏng | `name` `chip` `win` |
| `viz` | 10 minh hoạ nhỏ (xem bảng dưới) | `viz` + trường riêng |
| `platform` | Mockup web/app trong cửa sổ trình duyệt có URL bar | `name` `chip` `url` `body` (xem `PBODY` trong script.js) |
| `cta` | Khối kêu gọi cuối bài | `title` `sub` `brand` `tags` `btnText` `btnIcon` `tail` |

`cmp.left`/`cmp.right` nhận thêm `ic` (icon FontAwesome tròn phía trên
nhãn) — dùng khi so sánh 2 khái niệm trừu tượng, tránh cảnh trông trống.

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

## MASCOT CỐ ĐỊNH Ở ĐÁY (linh vật xuyên suốt video)

Ngoài layout `mascot` (1 ảnh cho riêng 1 cảnh), template còn có khối
`#mascot-dock` — một nhân vật đứng cố định ở đáy màn **suốt cả video**,
đổi ảnh đều đặn theo nhịp (không phải chọn tay từng cảnh). Khai trong
`scenes.js`:

```js
const MASCOT_IMAGES = [
  'assets/mascot/01-hello.png',
  'assets/mascot/02-explain.png',
  'assets/mascot/03-cta.png',
];
```

Không khai biến này thì `#mascot-dock` tự ẩn — không cần xoá gì trong
HTML/CSS. Số ảnh bao nhiêu cũng được; script tự chia đều `DUR / số ảnh`
làm mốc đổi cảnh, có hiệu ứng bật nảy nhẹ mỗi lần đổi.

**Không dùng ảnh nhân vật có bản quyền** (Bubu & Dudu, Doraemon, mascot
thương hiệu khác...) dù tìm thấy dễ dàng trên mạng — kể cả khi người
dùng khẳng định "không vi phạm". Ảnh AI tự tạo (Gemini, Midjourney...)
theo phong cách gợi nhớ thì dùng được, ảnh tải về từ nguồn có sẵn thì
không. Xin xác nhận nguồn gốc nếu không chắc.

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
- **Số điện thoại và số tiền viết bằng chữ**: `0987 654 321` →
  `không chín tám bảy, sáu năm bốn, ba hai một`; `6.000.000đ` → `sáu triệu`.

Đổi giọng Gemini: `python3 build_vo_gemini.py --voice Kore`
Đổi giọng edge-tts: `python3 build_vo_edge.py --voice vi-VN-NamMinhNeural --rate -6`

---

## CHỮ VÀ BỐ CỤC

Font tiêu đề/nhấn mạnh mặc định **Gilroy VH** (`--font-display`, đã có
sẵn file .otf trong `vendor/fonts/gilroy/`) — đậm, bo tròn, đúng dấu
tiếng Việt, giống phong cách chữ vàng-viền-đen hay thấy trên TikTok.
Chữ thường dùng **Be Vietnam Pro** (`--font`) — dấu được vẽ riêng, đặt
đúng chỗ. Tránh Inter ở cỡ 100px+ vì dấu chật và sát chữ.

**Giao diện mặc định là "paper"** (`#stage.paper` trong `index.html`):
nền giấy ấm `#f3e9d8`, tiêu đề `.h1`/`.hero-num`/`.g` vàng `#ffe000`
viền đen, thẻ trắng bo góc có dải màu trên đầu. Muốn quay lại nền tối
gốc thì bỏ class `paper` khỏi `#stage` — mọi override nằm gọn trong
khối `#stage.paper { ... }` ở cuối `style.css`, không đụng CSS gốc.

**Vùng an toàn:** chừa **220px trên** (UI TikTok), **420px dưới**
(caption + nút Follow), **80px hai bên**.

**Cỡ chữ tối thiểu 40px.** Video 1080px xem trên điện thoại rộng ~400px là
thu nhỏ 2.7 lần — chữ 32px chỉ còn ~12px thật. Dòng đứng một mình nên
≥44px. `check.js` tự bắt lỗi này — đừng đoán bằng mắt trên màn hình lớn.

**Khoảng cách giữa các phần tử:** đừng để card/icon/chữ sát nhau — nhìn
cảm giác "ngột ngạt". Kicker cách tiêu đề ≥44px, 2 thẻ so sánh cách nhau
≥40px, bên trong thẻ ≥12px giữa các dòng chữ.

Đổi màu chủ đạo (theme tối gốc): sửa `--a1` `--a2` `--a3` trong
`style.css`. Đổi màu theme paper: sửa các giá trị trong khối
`#stage.paper { --a1: ...; --tx: ...; }` — cấu trúc token giống nhau,
đổi ở khối nào áp theme đó.

---

## LỖI THƯỜNG GẶP

| Hiện tượng | Nguyên nhân · cách xử lý |
|---|---|
| Frame nào cũng là trạng thái đầu cảnh | Timeline tạo sau khi font load xong nên `startTime` lệch khỏi 0. Phải seek `window.__TL`, **không** seek `gsap.globalTimeline` |
| Hiệu ứng không seek được | Dùng CSS animation. Mọi chuyển động phải do GSAP điều khiển |
| `clip-path` không chạy | GSAP không nội suy `inset()`. Đổi sang animate `height` + `overflow:hidden` |
| Chữ tràn / thẻ xuống dòng | Đổi font làm chữ rộng thêm. Hạ cỡ chữ thẻ, xem thử lại |
| Icon hiện ô vuông trống | Sai tên Font Awesome, hoặc dùng icon brand (bộ Free Solid không có `fa-js`, `fa-github`) |
| Giọng đọc chồng nhau | Xem cảnh báo `⚠️` của `build_vo_gemini.py`/`build_vo_edge.py`, rút chữ |
| Video nghe nhỏ hơn video người khác | Quên bước `loudnorm` |
| Render chậm bất thường | `filter: blur()` hoặc `backdrop-filter` trên vùng lớn. Thay bằng `radial-gradient` |
| `check.js` báo lỗi mà nhìn không thấy | Nới `SAFE`/`MIN_FONT` đầu file `check.js` nếu thiết kế cố ý khác chuẩn |
| `build_vo_gemini.py` báo lỗi 429 | Gói free Gemini giới hạn ~10 request/phút — script tự chờ & thử lại, cứ để nó chạy tiếp. Vẫn kẹt thì đổi API key khác (project Google Cloud khác) |
| `build_vo_gemini.py` báo lỗi 402 "paid_plan_required" | Giọng đó là voice thư viện chia sẻ (cloned/shared), gói Free không gọi được qua API. Dùng voice dựng sẵn (Kore/Puck/Charon/Zephyr/Leda/Orus/Aoede...) |
| `#mascot-dock` hiện icon ảnh vỡ | Chưa khai `MASCOT_IMAGES` trong `scenes.js` nhưng lại gọi nhầm layout mascot ở đâu đó — kiểm tra lại, hoặc bỏ trống là tự ẩn |
| DUR/thời lượng video sai (fade cuối bài lệch, mascot dock đổi ảnh sai nhịp) | `script.js` tự tính `DUR` từ mốc cảnh cuối trong `SCENES` — đừng hardcode lại `const DUR = ...` trong bản sao dự án |

---

## FILE THAM KHẢO

- `assets/scenes-example.js` — 48 cảnh thật của một video 180 giây, chép
  ra rồi sửa. **Đọc file này trước khi viết cảnh mới** — nó là ví dụ đầy
  đủ nhất về cách dùng các layout. Viết từ trước khi có theme "paper" nên
  nội dung/màu minh hoạ vẫn hợp theme tối gốc — cấu trúc `l`/trường dữ
  liệu thì dùng y hệt cho theme paper, chỉ đổi mắt nhìn thôi.
- `assets/voiceover-example.json` — 48 câu khớp với scenes-example.
- `references/kich-ban.md` — cách chia act, đặt điểm giữ chân, viết hook.
- `scripts/new_project.sh` — dựng khung dự án mới bằng 1 lệnh.
- `scripts/build_full.py` — chạy trọn quy trình (check → giọng đọc →
  render → trộn nhạc → loudnorm → giao file) bằng 1 lệnh. Xem "QUY TRÌNH
  NHANH" ở đầu file này.
- `scripts/build_vo_gemini.py` — giọng đọc Gemini TTS, khuyến nghị dùng
  trước tiên.
