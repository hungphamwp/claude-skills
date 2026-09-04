# Hình minh hoạ — danh sách có sẵn và cách vẽ thêm

## Danh sách có sẵn

Khai báo bằng field `illustration` trong mỗi cảnh. Một hình dùng được nhiều lần.

| Key | Nội dung | Chuyển động | Hợp cảnh nói về |
|---|---|---|---|
| `campfire-night` | Người ngồi bó gối bên lửa trại, trời đêm đầy sao, đất nâu, dấu hỏi trên đầu | Sao nhấp nháy, lửa bập bùng, dấu hỏi nhún lên xuống | Mở đầu, đặt câu hỏi, đêm tối, thời tiền sử |
| `everything-starts-here` | Lửa trại giữa khung trên nền trắng, 12 mũi tên đỏ toả ra mọi hướng, đá quanh lửa | Mũi tên vẽ dần từng cái | Nguồn gốc, điểm khởi đầu, lan toả, nguyên nhân gốc |
| `evolution-line` | Người que đứng bên trái, 3 con khỉ nâu bên phải, nền cỏ xanh | Từng nhân vật hiện dần, khỉ nhún nhẹ | So sánh người với động vật, tiến hoá, sinh học |
| `fire-radius` | Nền đen, vòng sáng cam, vòng nét đứt xoay, mũi tên đo ngang, lửa nhỏ giữa | Vòng nét đứt xoay, mũi tên vẽ dần, ánh sáng phập phồng | Phạm vi, khoảng cách, giới hạn, vùng ảnh hưởng |
| `researcher-hut` | Người đeo kính cầm bảng ghi chép và bút chì, nhà tranh bên phải, nền đất nâu | Nhân vật hiện dần và nhún nhẹ | Nhà nghiên cứu, khảo sát, bằng chứng, điền dã |
| `person-sleeping` | Người nằm ngủ đắp chăn xanh, trăng lưỡi liềm, sao, chữ Z bay lên | Z bay lên mờ dần, hơi thở phập phồng | Giấc ngủ, nghỉ ngơi, ban đêm, mơ |
| `sunrise` | Mặt trời nhô lên giữa khung, tia sáng toả, hai lớp đồi xanh | Mặt trời nhô dần, 16 tia sáng xoay | Bình minh, khởi đầu mới, kết thúc tích cực, hy vọng |
| `bar-chart` | Biểu đồ 5 cột, cột cuối màu accent, số % trên đầu, mũi tên xu hướng | Cột mọc dần, số hiện ra, mũi tên vẽ dần | Số liệu, thống kê, tăng trưởng, so sánh định lượng |
| `city-night` | 8 toà nhà silhouette, cửa sổ vàng, trăng tròn, sao | Cửa sổ sáng nhấp nháy lệch pha | Đô thị hiện đại, đối lập xưa-nay, đời sống ngày nay |
| `lightbulb-idea` | Bóng đèn lớn giữa khung, quầng sáng, 10 tia toả ra | Đèn sáng dần từ xám sang vàng, tia vẽ dần | Ý tưởng, phát hiện, kết luận, lời khuyên |
| `awake-at-3am` | Người nằm trên giường mắt mở trừng, đồng hồ số "3:00" phát ánh xanh, phòng ngủ đêm | Dấu hai chấm nhấp nháy, mắt chớp, ánh xanh phập phồng | Mất ngủ, tỉnh giấc giữa đêm, lo lắng, mở đầu đồng cảm |
| `two-sleeps-split` | Sơ đồ thanh ngang: hai khối xanh "Giấc thứ nhất"/"Giấc thứ hai", khoảng cam "Tỉnh" ở giữa, nến, mặt trời lặn/mọc hai đầu | Hai khối trượt vào từ hai bên, khoảng giữa sáng bừng | Giải thích cơ chế, chia giai đoạn, sơ đồ thời gian |
| `midnight-wake-cottage` | Trong nhà tranh cắt ngang: hai người ngồi dậy trên giường rơm, nến vừa thắp toả quầng cam, bếp than đỏ, cửa sổ trăng lưỡi liềm | Quầng nến lan rộng dần, người nhổm lên, sao nhấp nháy | Sinh hoạt ban đêm thời xưa, thức giấc, không gian ấm cúng |
| `midnight-activities` | Ba ô vuông nằm ngang: cầu nguyện bên nến / hai người trò chuyện có bong bóng thoại / cời bếp lửa tàn bay | Ba ô sáng lần lượt trái sang phải, tàn lửa bay, bong bóng phình | Liệt kê nhiều việc, kể chi tiết sinh hoạt, "họ làm gì" |
| `old-documents-stack` | Chồng sách cũ + cuộn giấy da, trang giấy bay lơ lửng có gạch chân đỏ, kính lúp rê ngang, số "500+" khoanh đỏ | Kính lúp rê qua lại, gạch chân đỏ sáng dần, số nảy lên | Bằng chứng, tài liệu, nghiên cứu, số lượng lớn |
| `toothbrush-diary` | Trang nhật ký mở với dòng chữ viết tay hiện dần, bàn chải cam có bọt bay, dấu hỏi đỏ to | Chữ hiện dần như đang viết, dấu hỏi nảy, bàn chải lắc | Ví dụ so sánh, điều hiển nhiên, chuyện thường ngày |
| `wehr-dark-room` | Nhà khoa học áo blouse cầm bảng ghi chép, phòng kín tối đen có người nằm ngủ, biển "14 giờ tối" | Phòng tối dần từ xám sang đen, biển hiện ra, nhà khoa học gật đầu | Thí nghiệm, kiểm chứng khoa học, môi trường kiểm soát |
| `sleep-compressed` | Hai tầng so sánh: "Ngày xưa" thanh chia hai có khoảng cam / "Bây giờ" thanh liền ngắn hơn bị hai mũi tên ép vào, bóng đèn chiếu xuống | Đèn bật sáng, hai mũi tên trượt ép thanh co lại, khoảng cam mờ dần | Đối chiếu xưa - nay, cái gì đã mất đi, tác động của công nghệ |
| `nap-desk-tired` | Gục xuống bàn làm việc, nắng chiều qua cửa sổ, laptop, cốc cà phê cạn | Đầu gật gù, chữ Z bay lên | Buồn ngủ, uể oải, mở đầu đồng cảm dân văn phòng |
| `nap-two-outcomes` | Chia đôi màn hình: bên xanh lá tỉnh táo có tia năng lượng, bên đỏ vật vờ mắt xoáy tóc bù | Hai bên hiện lần lượt, bên trái nhún nảy, bên phải lảo đảo | So sánh hai kết cục, đúng vs sai, trước vs sau |
| `sleep-cycle-wave` | Đồ thị đường cong chu kỳ ngủ với trục Nông - Sâu, mốc 0/20p/45p/90p | Đường cong vẽ dần, con trỏ đỏ chỉ mốc | Chu kỳ, quá trình lên xuống, sơ đồ theo thời gian |
| `nap-shallow` | Người nổi gần mặt nước xanh nhạt, bọt khí nổi lên | Người bồng bềnh, bọt nổi lên liên tục | Trạng thái nhẹ, dễ thoát ra, tầng nông |
| `nap-deep` | Người chìm sâu dưới nước tối, sóng não chậm vẽ dần | Người chìm dần xuống, sóng vẽ ra | Trạng thái sâu, khó thoát, chìm đắm |
| `sleep-inertia-zombie` | Người đứng lảo đảo mắt xoáy, sao quay quanh đầu, đồng hồ chạy loạn | Người lắc lư, mắt xoáy, sao quay, kim đồng hồ quay nhanh | Choáng váng, hậu quả, trạng thái tệ |
| `nap-golden-window` | Trục giờ trong ngày với vùng vàng được tô, đồng hồ hẹn giờ, mặt trời chếch | Vùng vàng lan rộng ra, tia nắng xoay | Khung giờ tốt nhất, thời điểm vàng, lời khuyên |
| `nasa-pilot-nap` | Buồng lái máy bay có mây trôi ngoài cửa sổ, phi công ngủ trên ghế, biểu đồ cột kết quả | Mây trôi ngang, đèn bảng điều khiển nhấp nháy, cột mọc lên | Thí nghiệm thực tế, bằng chứng có số liệu |
| `nap-full-cycle` | Chu kỳ trọn vẹn được tô xanh lá, biển đỏ cảnh báo vùng cần tránh | Đường cong vẽ dần, biển cảnh báo hiện ra | Làm trọn vẹn, phương án thay thế, cảnh báo |
| `nap-too-late` | Chia đôi ngày/đêm: bên ngày bị gạch X đỏ, bên đêm người nằm mắt mở thao láo | Dấu X vẽ dần, sao nhấp nháy | Việc không nên làm, hậu quả về sau, nhân quả |
| `coffee-nap` | Ba bước ngang có mũi tên nối: cốc cà phê bốc khói, người ngủ, người tỉnh táo | Ba bước hiện lần lượt, khói bay lên, tia năng lượng | Quy trình từng bước, mẹo áp dụng, hướng dẫn |
| `first-memory-question` | Người ngồi nhắm mắt, bong bóng suy nghĩ to rỗng chỉ có dấu hỏi cam | Bong bóng phồng dần, dấu hỏi nhún | Mời người xem tự nghĩ, đặt câu hỏi mở đầu |
| `photo-story-implant` | Album ảnh trái, người kể chuyện phải, ảnh bay vào khung trống trong đầu đứa trẻ giữa | Hai tấm ảnh bay theo đường cong rồi loé sáng khi dán vào | Cấy ghép, ảnh hưởng từ bên ngoài, thông tin sai |
| `memory-timeline-fade` | Trục tuổi 0-3-7-lớn, hàng khung ký ức từ nhạt tới rõ, dải sương phủ vùng 0-3 | Khung ký ức rơi rụng khi sương trườn qua | Mốc thời gian, cái gì mất cái gì còn |
| `baby-learning-montage` | Ba ô: tập đi / tập nói / nhận mặt mẹ, hạt xanh bay lên | Ba ô hiện lần lượt, hạt kết nối bay liên tục | Học hỏi, phát triển, giai đoạn đầu đời |
| `freud-notebook-couch` | Freud râu quai nón cầm sổ bên trái, đi văng có người nằm bên phải, biển tên bệnh ở giữa | Bút gạch trên sổ, dấu X đỏ vẽ đè lên biển tên | Nhân vật lịch sử, giả thuyết cũ bị bác bỏ |
| `hippocampus-under-scaffold` | Đầu cắt nghiêng, não hồng, hồi hải mã tím sau giàn giáo cam, biển "đang thi công" | Giàn giáo lắp thêm dần, dây nối chớp tắt | Bộ phận chưa hoàn thiện, đang phát triển |
| `neuron-overwrite-scribble` | Bảng đen với hình vẽ phấn, neuron vàng nảy lên kéo vệt đè lên | Neuron nảy liên tục, hình phấn cũ mờ dần | Ghi đè, xoá dấu vết, cái mới lấn cái cũ |
| `lab-mouse-hypothesis` | Chuột trong mê cung trái, hai kết cục đối lập phải, nhãn cảnh báo | Chuột chạy tại chỗ, ký ức tan thành hạt, vòng nhấn đỏ | Thí nghiệm động vật, kết quả hai chiều, cảnh báo suy diễn |
| `baby-wordless-bubble` | Máy thu nhỏ đồ vật trái, bé giữa, bong bóng thoại rỗng phải, chữ cái bật ra ngoài | Tay quay xoay, đồ chơi thu nhỏ rơi, chữ nảy khỏi bong bóng | Rào cản ngôn ngữ, không diễn đạt được |
| `mirror-red-dot` | Bé đứng trước gương, chấm đỏ trên mũi, tay đưa lên chạm mũi mình | Tay di chuyển từ gương về mũi, chấm đỏ nháy, vòng sáng loé | Nhận thức bản thân, khoảnh khắc "à ra thế" |
| `fake-balloon-photo` | Ảnh cũ ghép cảnh khinh khí cầu, đường cắt dán lởm chởm, cây kéo | Khinh khí cầu nhích lên xuống, đường cắt nhấp nháy | Bằng chứng giả, ký ức sai, thao túng |
| `baby-scanner-glow` | Bé nằm trên khay trượt vào máy quét, hồi hải mã tím sáng, màn hình sóng | Khay trượt vào, cá ngựa loé sáng, sóng chạy | Nghiên cứu hiện đại, đo đạc, phát hiện mới |
| `locked-box-no-key` | Rương gỗ khoá kín, ký ức còn nguyên bên trong lộ qua nét đứt, người xoè tay trống | Rương rung nhẹ, ánh sáng rò qua khe, vòng nhấn | Còn đó nhưng không lấy được, kết mở ấm áp |

Chọn hình theo **ý nghĩa** chứ không theo chữ nghĩa. Ví dụ cảnh nói "và đây là điều
bất ngờ" thì `lightbulb-idea` hợp hơn là cố tìm hình đúng nội dung.

## Bộ hiệu ứng giải thích (`fx.tsx`)

Video **không có khung phụ đề** ở đáy khung — mọi thông tin phải do chính hình truyền
tải. Đây là lý do bộ hiệu ứng này tồn tại: đặt nhãn ngay cạnh thứ nó nói tới, chỉ mũi
tên vào đúng chỗ cần nhìn, thay vì bắt người xem đọc một dòng chữ tách rời ở dưới.

| Component | Dùng để |
|---|---|
| `PopLabel` | Nhãn chữ bật ra tại chỗ — thay hẳn vai trò của phụ đề |
| `PointerArrow` | Mũi tên cong vẽ dần, dẫn mắt tới chi tiết |
| `HighlightRing` | Vòng nét đứt xoay khoanh vùng quan trọng |
| `PulseRing` | Vòng sáng lan toả rồi tan, nhấn khoảnh khắc |
| `CountUp` | Số đếm tăng dần, dễ nhớ hơn số đứng yên |
| `CrossOut` / `CheckMark` | Dấu X đỏ / tích xanh cho đúng-sai |
| `ProgressBar` | Thanh chạy diễn tả thời gian trôi |
| `shakeTransform` | Rung lắc diễn tả hoảng hốt, cảnh báo |

Mọi component đều nhận `frame` và `at` (frame bắt đầu hiện), nên xếp thứ tự xuất hiện
bằng cách đặt `at` cách nhau — cho người xem kịp đọc từng thứ một.

```tsx
<PopLabel frame={frame} at={6} x={300} y={520} text="3 giờ chiều" bg="#f5a623" color={INK} size={52} />
<PointerArrow frame={frame} at={30} from={[760, 470]} to={[600, 620]} color="#e63328" curve={-0.3} />
<HighlightRing frame={frame} at={44} cx={860} cy={480} r={230} color="#22a04a" />
```

Mỗi hình nên có 2-3 nhãn, xuất hiện giãn ra trong khoảng 5-8 giây của cảnh. Nhồi
nhiều hơn thì người xem đọc không kịp.

## Cách vẽ hình mới

Hình nằm ở 3 file: `parts.tsx` (bộ phận dùng lại), `index.tsx` (5 hình đầu + registry),
`more.tsx` (5 hình tiếp), `story3am.tsx` (8 hình ngủ hai giấc), `nap.tsx` (11 hình ngủ trưa),
`memory.tsx` (13 hình ký ức tuổi thơ), `fx.tsx` (bộ hiệu ứng giải thích dùng chung).

Mỗi video mới nên có FILE RIÊNG cho bộ hình của nó — đừng nhét chung vào file cũ.
Hình dùng lại giữa các video làm series trông nghèo nàn, người xem nhận ra ngay.

Thêm hình mới vào `more.tsx` hoặc tạo file mới nếu là một bộ chủ đề riêng, rồi đăng ký
vào registry ở `src/illustrations/index.tsx`:

```tsx
export const ILLUSTRATIONS = {
  // ...các hình cũ
  'key-moi': TenComponent,
};
```

Nếu component đặt ở `more.tsx` thì nhớ thêm vào dòng import ở đầu `index.tsx`.

### Khung sườn một hình mới

```tsx
export const TenComponent: React.FC<MoreProps> = ({ frame, accent }) => {
  const p = easeOut(progress(frame, 10, 25)); // 0→1 từ frame 10, kéo dài 25 frame
  return (
    <Frame bg="#ffffff">
      {/* nội dung SVG, toạ độ trong khung 1920×1080 */}
    </Frame>
  );
};
```

`MoreProps` là `{ frame: number; accent: string }`. `Frame` đã có sẵn trong file,
nó bọc `<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">` và vẽ nền.

### Quy tắc bắt buộc: không dùng Math.random()

Remotion render **từng frame độc lập**. Dùng `Math.random()` sẽ ra giá trị khác nhau
mỗi frame → hình nhấp nháy loạn xạ. Mọi thứ "ngẫu nhiên" phải suy ra từ `frame`
hoặc từ seed cố định.

Dùng helper có sẵn trong `src/illustrations/anim.ts`:

| Helper | Công dụng |
|---|---|
| `progress(frame, start, duration)` | Trả 0→1 trong khoảng frame chỉ định, đã clamp |
| `easeOut(t)` | Làm mượt, dùng bọc ngoài `progress` |
| `wobble(frame, speed, amount, phase)` | Dao động tuần hoàn — lửa bập bùng, vật nhún |
| `seeded(i)` | Số giả ngẫu nhiên 0→1 tất định theo index — vị trí sao, cửa sổ nhà |
| `drawOn(p)` | Spread vào path/line để vẽ dần: `<line {...drawOn(p)} />` |
| `INK` | Màu nét đen chuẩn `#111111` |

### Bảng màu chuẩn (giữ nhất quán giữa các hình)

```
Nét vẽ:     #111111        Nền trắng:   #ffffff
Đỏ nhấn:    #e63328        Cam lửa:     #f47b20 / #ffd23f (lõi)
Xanh trời:  #3a8fd6        Xanh đêm:    #2f4d9c / #1b2a5e / #101c44
Xanh lá:    #5da130 / #22a04a     Đất nâu:  #9c5a21 / #8a5a2b
Vàng ấm:    #ffd25e / #ffe9a8     Xám:      #b0b0b0 / #c4c4c4
```

Độ dày nét: `strokeWidth={9}` cho vật thể chính, `9 * 0.45` cho nét phụ bên trong.

### Bộ phận dùng lại được

`src/illustrations/parts.tsx` đã có sẵn, import thẳng đừng vẽ lại:

`Head` (đầu có mắt/lông mày/miệng, tuỳ chọn `glasses`), `StandingFigure`,
`SittingFigure`, `Campfire`, `Stars`, `Hut`, `Monkey`, `QuestionMark`.

Ví dụ: `<StandingFigure x={640} y={210} scale={1.05} glasses />`
— `y` là toạ độ **đỉnh đầu**, nhân vật cao khoảng 660 đơn vị ở scale 1.

Muốn nhân vật đứng trên mặt đất ở `y = G` thì đặt `y = G - 660 * scale`.

### Vẽ nét "lệch tay"

`src/scenes/RoughShapes.tsx` có `HandDrawnRect`, `HandDrawnUnderline`, `HandDrawnCheck`.
Chúng dùng SVG filter `feTurbulence` + `feDisplacementMap` với `seed` cố định suy ra
từ chuỗi `id` — nên nét méo giữ nguyên hình dạng qua mọi frame, không rung.

Truyền `id` khác nhau cho mỗi phần tử, nếu trùng id thì filter dùng chung sẽ méo giống hệt nhau.

### Sau khi thêm hình

```bash
npx tsc --noEmit
```

Nếu muốn xem hình trước khi dựng cả video, render một khung hình tĩnh nhanh hơn nhiều
so với mở Studio:

```bash
npx remotion still src/index.ts StoryVideo out/thu.png --frame=60
```
