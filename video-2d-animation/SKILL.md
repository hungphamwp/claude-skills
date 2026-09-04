---
name: video-2d-animation
description: Dựng video 2D animation kể chuyện bằng Remotion — hình minh hoạ vẽ tay (nét đen dày, flat color, nhân vật que) + giọng đọc tiếng Việt Gemini TTS + nhạc nền, thời lượng cảnh tự khớp giọng đọc. Dùng skill này BẤT CỨ KHI NÀO người dùng muốn làm video hoạt hình 2D, video kể chuyện, video giải thích kiến thức, video doodle/whiteboard, video có giọng đọc tiếng Việt tự động, hoặc nhắc tới Remotion — kể cả khi họ chỉ nói "làm video về chủ đề X", "video 2 phút kể về...", "thêm cảnh cho video", "đổi giọng đọc", "video animation". Cũng dùng khi cần sửa/kéo dài/đổi giọng video đã dựng trước đó.
---

# Dựng video 2D animation (Remotion + Gemini TTS)

## Project ở đâu

Skill này làm việc trên một project Remotion. Mọi lệnh bên dưới chạy từ thư mục gốc
của project đó.

**Tìm project trước khi tạo mới.** Hỏi người dùng, hoặc tìm thư mục có `remotion.config.ts`
kèm `src/illustrations/`. Trên máy tác giả, project nằm ở
`~/Project/03. Nội bộ/Tạo video 2D`.

**Chưa có thì dựng từ template bundle sẵn trong skill** (mất ~1 phút):

```bash
mkdir -p "<thư-mục-project>" && cd "<thư-mục-project>"
cp -R "<đường-dẫn-skill>/assets/template/." .
mkdir -p public/assets out
cp "<đường-dẫn-skill>/scripts/"*.mjs scripts/
npm install
```

Template đã gồm đủ 84 hình minh hoạ, 3 composition và schema — cài xong render được ngay.
Chi tiết kiến trúc và các bẫy thường gặp: đọc `references/bootstrap.md`.

## Nguyên tắc tiết kiệm token và thời gian

Skill này đã chứa đủ thông tin để dựng một video hoàn chỉnh mà **không cần đọc file
nguồn nào** trong project. Cụ thể:

- **Đừng đọc** `src/**` trừ khi phải sửa/thêm hình minh hoạ. Schema JSON, danh sách
  hình, quy tắc viết lời đọc đều nằm trong skill này rồi.
- **Đừng mở Remotion Studio** để xem thử. Studio mất ~30s khởi động và tốn nhiều lượt
  screenshot. Render thẳng ra mp4 rồi gửi file cho người dùng xem — nhanh hơn và
  họ xem được cả âm thanh.
- **Dùng lại hình TRONG cùng một video, không dùng lại GIỮA các video.** Trong một
  video, cho một hình xuất hiện ở vài cảnh là bình thường và miễn phí. Nhưng video mới
  thì phải có bộ hình mới — đây là yêu cầu về chất lượng, không phải chỗ để tiết kiệm.
  Series mà dùng đi dùng lại hình cũ thì người xem nhận ra ngay và thấy nghèo nàn.
  Vẽ 9-12 hình mới cho mỗi video, đặt trong một file riêng theo chủ đề.
- **Chạy nền các lệnh chậm.** Sinh giọng (~4s/cảnh, hay bị rate limit) và render
  (~1-3 phút) nên chạy với `run_in_background: true` rồi làm việc khác trong lúc chờ.
- **Gộp thao tác.** Viết cả file JSON một lần bằng Write, đừng Edit từng cảnh.

## Quy trình 4 bước

### Bước 1 — Viết kịch bản JSON

Tạo `data/<ten-video>.json`. Chỉ cần các trường sau, phần còn lại có mặc định:

```json
{
  "title": "Tiêu đề video",
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "voiceName": "Laomedeia",
  "musicVolume": 0.12,
  "music": "assets/music/bg.mp3",
  "scenes": [
    {
      "id": "s1",
      "type": "image",
      "illustration": "campfire-night",
      "voice": "Lời đọc của cảnh này.",
      "durationInSeconds": 5,
      "accentColor": "#e63328"
    }
  ]
}
```

`durationInSeconds` cứ để 5 — bước 2 sẽ tự ghi đè theo độ dài giọng đọc thật.
Bỏ `music` nếu chưa có file nhạc. `id` phải là duy nhất (dùng làm tên file mp3).

Trường tuỳ chọn: `heading` (chữ lớn ở đầu khung), `motion` (`zoom-in` | `zoom-out` |
`pan-left` | `pan-right` — bỏ trống thì tự luân phiên, nên cứ bỏ trống),
`voiceName` riêng cho từng cảnh nếu muốn đổi người kể.

**Không dùng phụ đề.** Trước đây mỗi cảnh có một khung chữ trắng ở đáy khung, nhưng
nó tách rời khỏi hình nên người xem phải liếc xuống đọc thay vì nhìn vào thứ đang được
nói tới. Giờ khung đó đã bỏ hẳn — field `caption` còn trong schema nhưng không render.

Thay vào đó, **mỗi hình tự mang thông tin của nó**: nhãn `PopLabel` đặt ngay cạnh vật
được nói tới, `PointerArrow` chỉ vào đúng chi tiết, `HighlightRing` khoanh vùng quan
trọng. Xem `references/illustrations.md`, mục "Bộ hiệu ứng giải thích".

### Bước 2 — Sinh giọng đọc

```bash
node scripts/generate-voice-gemini.mjs data/<ten-video>.json
```

Script tự sinh mp3 vào `public/assets/voice/<id>.mp3`, đo độ dài rồi ghi ngược
`durationInSeconds` + `voiceFile` vào chính file JSON. Chạy nền vì hay dính rate limit.

Nếu có cảnh lỗi, chạy lại kèm `--skip-existing` để chỉ làm phần còn thiếu.

Cần API key trong `.env`, lấy ở https://aistudio.google.com/apikey:

```
GEMINI_API_KEYS=key1,key2,key3
```

Khai báo nhiều key phân tách bằng dấu phẩy. Script tự chuyển key khi gặp 429/503.

**Hạn mức quan trọng cần biết trước khi lên kế hoạch:** gói miễn phí giới hạn
**10 request mỗi ngày, cho mỗi model, mỗi key**. Một video 25 cảnh cần 25 request —
tức một key không đủ cho nổi một video.

Hạn mức tính RIÊNG cho từng model, nên script còn tự rơi xuống model dự phòng khi
model chính cạn quota:

    gemini-3.1-flash-tts-preview -> gemini-2.5-flash-preview-tts -> gemini-2.5-pro-preview-tts

Ba key × ba model = 90 lượt/ngày. Tốc độ đọc giữa các model chênh nhau không đáng kể
(đo thực tế: 7.50 so với 7.26 giây trên 100 ký tự), nên video trộn model vẫn đều nhịp.

Khi thấy lỗi 429, đừng đoán là nghẽn tạm thời — kiểm tra xem là hạn mức ngày hay
giới hạn tần suất, bằng cách đọc `quotaId` trong phản hồi lỗi:

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent" \
  -H "x-goog-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Đọc: xin chào"}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":"Laomedeia"}}}}}' \
  | python3 -m json.tool | grep -A2 quotaId
```

`GenerateRequestsPerDayPerProjectPerModel-FreeTier` nghĩa là cạn quota ngày — chờ tới
hôm sau, thêm key, hoặc bật thanh toán. Chờ thêm mấy phút cũng vô ích.

Làm video thường xuyên thì nên bật thanh toán cho một key: gói trả phí bỏ hẳn giới
hạn 10/ngày, chi phí mỗi video chỉ vài nghìn đồng.

Không có key thì dùng `node scripts/generate-voice.mjs` (giọng Linh macOS, miễn phí,
offline, chất lượng thấp hơn nhiều).

### Bước 3 — Render

```bash
node scripts/render-from-script.mjs data/<ten-video>.json out/<ten-video>.mp4 StoryVideo
```

Chạy nền. Xong thì gửi file mp4 cho người dùng bằng SendUserFile.

### Bước 4 — Kiểm chứng

Xác nhận video có tiếng và đúng độ dài trước khi báo xong:

```bash
ffprobe -v error -show_entries stream=codec_type -show_entries format=duration -of default=noprint_wrappers=1 out/<ten-video>.mp4
```

Phải thấy cả `codec_type=video` lẫn `codec_type=audio`.

## Viết lời đọc — phần quan trọng nhất

Chất lượng video phụ thuộc vào lời đọc nhiều hơn bất cứ thứ gì khác. Hai điều này
đã được kiểm chứng thực tế với Gemini TTS:

**1. Ngữ điệu nằm ở chính câu chữ, không nằm ở lời mô tả giọng.**

Cùng một giọng, cùng một chỉ dẫn, chỉ đổi cách viết câu là ra kết quả khác hẳn.
Viết theo văn nói tiếng Việt, dùng tiểu từ và dấu câu để tạo nhịp:

| Văn viết → giọng phẳng, buồn | Văn nói → giọng có nhịp, cuốn |
|---|---|
| "Người xưa không ngủ một mạch tới sáng." | "Khoan đã — người xưa không ngủ một mạch tới sáng **đâu**! Cứ nửa đêm là họ bật dậy**…** mà dậy để làm gì **mới được chứ**?" |
| "Đêm kéo dài mười hai tiếng." | "Trời tối là tối hẳn — mà đêm thì dài tới mười hai tiếng **lận**!" |
| "Nghiên cứu cho thấy gần 90%..." | "Và đây mới là **chỗ hay**: gần chín mươi phần trăm..." |

Công cụ tạo nhịp: tiểu từ (`đâu`, `lận`, `nhé`, `đấy`, `cơ`, `mới được chứ`,
`hoá ra`, `khoan đã`, `mà bạn biết không`), dấu gạch ngang `—` để ngắt nhấn,
dấu ba chấm `…` để thả giọng chờ đợi, dấu hỏi để đẩy cao độ, dấu chấm than để giữ năng lượng.

Mỗi cảnh 1-2 câu, đọc ra khoảng 5-8 giây. Câu ngắn dễ nghe hơn câu ghép.

Viết số bằng chữ khi muốn đọc trôi: "chín mươi phần trăm" thay vì "90%".
Phụ đề `caption` thì viết "90%" cho gọn — caption và voice không cần giống nhau.

**2. Gemini TTS bỏ qua từ phủ định trong chỉ dẫn giọng.**

Viết "tuyệt đối không buồn" trong `voiceStyle` lại mồi model ra đúng giọng buồn,
vì model bắt được chữ "buồn" mà bỏ chữ "không". Chỉ mô tả bằng câu khẳng định về
thứ mình MUỐN: "giọng tươi sáng, có nụ cười trong giọng, năng lượng cao".

Tương tự, tránh mô tả "chậm rãi, trầm, thì thầm, ngân dài" nếu không muốn giọng buồn —
đó là chùm đặc trưng model ánh xạ thẳng sang cảm xúc buồn.

## Giọng đọc

Mặc định **Laomedeia** (nữ, tươi, năng lượng cao — hợp kể chuyện cuốn hút).

| Giọng | Chất | Hợp với |
|---|---|---|
| Laomedeia | Nữ, tươi, năng lượng cao | Kể chuyện cuốn hút, TikTok |
| Kore | Nữ, rõ ràng, chắc | Giáo dục, thuyết minh |
| Sulafat | Nữ, ấm, dày tiếng | Nội dung sâu lắng |
| Aoede | Nữ, nhẹ nhàng | Kể chuyện đời thường |
| Charon | Nam, trầm ấm | Tài liệu, lịch sử |
| Puck | Nam, trẻ trung | Nội dung giới trẻ |

Muốn nghe thử trước khi dựng cả video:

```bash
node scripts/voice-sample.mjs "Câu muốn nghe thử" --voices Laomedeia,Kore --tag thu1
```

Ra file ở `out/voice-samples/`. Cờ `--tag` để chạy nhiều đợt không ghi đè.

Đây là cách tốt để giải quyết khi người dùng chê giọng: gửi 4-6 mẫu cho họ chọn,
đừng đoán. Ghép các mẫu thành một file để nghe liền cho dễ so sánh.

## Hình minh hoạ

Danh sách hình có sẵn, mô tả chi tiết và cách vẽ thêm hình mới nằm ở
`references/illustrations.md`. **Đọc file đó khi cần chọn hình cho từng cảnh
hoặc khi phải vẽ hình mới.**

Tóm tắt 84 key có sẵn, chia theo bộ chủ đề:

- **Nền tảng** — `campfire-night`, `everything-starts-here`, `evolution-line`,
  `fire-radius`, `researcher-hut`, `person-sleeping`, `sunrise`, `bar-chart`,
  `city-night`, `lightbulb-idea`
- **Bộ ngủ hai giấc** — `awake-at-3am`, `two-sleeps-split`, `midnight-wake-cottage`,
  `midnight-activities`, `old-documents-stack`, `toothbrush-diary`, `wehr-dark-room`,
  `sleep-compressed`
- **Bộ ngủ trưa** — `nap-desk-tired`, `nap-two-outcomes`, `sleep-cycle-wave`,
  `nap-shallow`, `nap-deep`, `sleep-inertia-zombie`, `nap-golden-window`,
  `nasa-pilot-nap`, `nap-full-cycle`, `nap-too-late`, `coffee-nap`
- **Bộ ký ức tuổi thơ** — `first-memory-question`, `photo-story-implant`,
  `memory-timeline-fade`, `baby-learning-montage`, `freud-notebook-couch`,
  `hippocampus-under-scaffold`, `neuron-overwrite-scribble`, `lab-mouse-hypothesis`,
  `baby-wordless-bubble`, `mirror-red-dot`, `fake-balloon-photo`, `baby-scanner-glow`,
  `locked-box-no-key`
- **Bộ cù và dự đoán của não** — `tickle-self-fail`, `tickle-other-laugh`,
  `brain-prediction-engine`, `signal-cancel`, `brain-scan-compare`, `robot-tickle-lab`,
  `delay-dial`, `two-tickle-types`, `surprise-attack`, `question-still-open`
- **Bộ website / hosting / domain** — `address-vs-house`, `buy-domain-only`,
  `hosting-house`, `dns-directory`, `nameserver-signpost`, `move-house-same-address`,
  `separate-bills`, `rent-calendar`, `domain-wrong-owner`, `full-picture`
- **Bộ tốc độ website** — `slow-site-waiting`, `three-second-rule`, `heavy-image-anvil`,
  `shared-hosting-crowd`, `no-cache-kitchen`, `plugin-pile`, `distance-cdn`,
  `core-web-vitals`, `layout-shift`, `speed-checklist`
- **Bộ công cụ AI** — `ai-tool-jungle`, `pick-by-job`, `chatbot-lineup`,
  `chatbot-strengths`, `image-tools`, `video-tools-price`, `sora-deprecated`,
  `web-builder-lanes`, `ai-agent-new`, `agent-stars`, `agent-security-warning`,
  `decision-table`

**Mỗi video mới nên có bộ hình riêng, vẽ mới.** Dùng lại hình giữa các video làm series
trông nghèo nàn — người xem nhận ra ngay. Chỉ dùng lại các hình mang tính sơ đồ trung
tính (`bar-chart`, `lightbulb-idea`) khi thật sự hợp, và hỏi người dùng trước.

Vài hình trung tính hơn tên gọi: `two-sleeps-split` và `sleep-compressed` dùng được cho
mọi sơ đồ so sánh hai giai đoạn; `nap-two-outcomes` cho mọi cặp đối chiếu đúng/sai;
`old-documents-stack` cho mọi cảnh nói về bằng chứng.

Nhiều hình trong số này trung tính hơn tên gọi: `two-sleeps-split` và `sleep-compressed`
dùng được cho mọi sơ đồ so sánh hai giai đoạn; `old-documents-stack` hợp mọi cảnh nói
về bằng chứng/tài liệu; `toothbrush-diary` hợp mọi ví dụ về "chuyện hiển nhiên".

Cảnh nào không tìm được hình hợp thì dùng tạm hình gần nghĩa nhất rồi báo người dùng,
đừng để trống — cảnh không có `illustration` sẽ ra nền trắng trơn.

## Ba kiểu video (composition)

| Composition | Khung hình | Dùng khi |
|---|---|---|
| `StoryVideo` | 1920×1080 ngang | Video kể chuyện có hình minh hoạ — **mặc định** |
| `DoodleVideo` | 1080×1920 dọc | Chữ + gạch chân vẽ tay, không hình, cho TikTok/Reels |
| `MainVideo` | 1080×1920 dọc | Nền tối, chữ accent màu, kiểu công nghệ/SaaS |

Đổi khung ngang/dọc bằng `width`/`height` trong JSON — composition tự nhận theo props.

## Nhạc nền

Bỏ file mp3 vào `public/assets/music/`, khai báo `"music": "assets/music/ten-file.mp3"`
và `"musicVolume": 0.12` ở cấp script. Nhạc tự lặp cho đủ độ dài video.

Không tự tải nhạc từ mạng về. Nếu người dùng chưa có nhạc, chỉ họ tới YouTube Audio
Library hoặc Pixabay Music (miễn phí bản quyền) và hỏi họ muốn dùng file nào.

## Khi người dùng muốn sửa video đã dựng

- **Đổi lời cảnh nào** → sửa `voice` cảnh đó trong JSON, chạy lại bước 2 kèm
  `--skip-existing` (chỉ sinh lại cảnh có `voiceFile` bị xoá — nên xoá thủ công file
  mp3 của cảnh đó trước), rồi render lại.
- **Đổi giọng cả video** → sửa `voiceName`, xoá `public/assets/voice/*.mp3` của video
  đó, chạy lại bước 2 đầy đủ.
- **Thêm cảnh** → thêm object vào mảng `scenes`, chạy bước 2 kèm `--skip-existing`
  (cảnh cũ giữ nguyên, chỉ sinh cảnh mới), render lại.
- **Đổi màu/hình** → sửa `illustration` hoặc `accentColor`, render lại luôn, không
  cần sinh lại giọng.

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân & cách xử lý |
|---|---|
| `API liên tục bận` | Rate limit Gemini. Chạy lại kèm `--skip-existing`, hoặc đợi vài phút. |
| Video không có tiếng | Cảnh thiếu `voiceFile` — chạy lại bước 2 rồi render lại. |
| Video bị cắt ngắn | Render bằng `remotion render` thẳng thay vì qua `render-from-script.mjs`. Dùng script để metadata tính đúng theo JSON. |
| Cảnh ra nền trắng trơn | Sai key `illustration` (không có trong registry). Kiểm tra chính tả. |
| Studio báo lỗi MetaMask | Extension Chrome chèn vào localhost, không phải lỗi code. Bấm ✕ bỏ qua. |
| Giọng nghe buồn | Lời đọc đang là văn viết. Viết lại theo văn nói, xem lại phần "Viết lời đọc". |
| `PROHIBITED_CONTENT` ở một cảnh | Bộ lọc nội dung của Gemini chặn câu đó. Không phải lỗi kỹ thuật — viết lại câu trung tính hơn rồi chạy `--skip-existing`. Gặp thực tế hai lần, và lần nào cũng ở câu trông rất vô hại: "chọc vào sườn vào nách" (đổi thành "nhằm đúng mấy chỗ buồn nhất" là qua), và "Làn thiên về code: v0, Lovable, Bolt — xuất ra mã thật" (đổi thành câu đầy đủ chủ ngữ vị ngữ là qua). Kinh nghiệm: câu cụt, liệt kê tên riêng ngăn bằng dấu phẩy và gạch ngang dễ bị chặn hơn câu văn hoàn chỉnh. |
| Nhãn `PopLabel` bị cắt mất chữ ở mép khung | Chiều rộng nhãn ≈ `số ký tự × size × 0.62 + 46`. Với `anchor="start"` thì nhãn chạy sang phải từ `x`, rất dễ vượt quá 1920. Dùng anchor giữa (mặc định) và đặt `x` cách mép ít nhất nửa chiều rộng nhãn. |
