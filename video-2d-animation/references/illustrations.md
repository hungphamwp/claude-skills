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
| `tickle-self-fail` | Người tự cù nách mình, mặt tỉnh bơ mí mắt trĩu | Ngón tay ngo ngoe, nhãn "chẳng buồn gì cả" | Không có phản ứng, thất bại, đối chứng |
| `tickle-other-laugh` | Người bị cù cười nhắm tít giãy nảy, người kia thò tay tới, chữ HA HA bay lên | Người rung lắc, tia cười bật ra, chữ bay lên | Phản ứng mạnh, tương phản với cảnh trước |
| `brain-prediction-engine` | Đầu cắt nghiêng, tiểu não tím phát sáng, tờ "DỰ BÁO" bay ra | Tiểu não nhấp nháy, tờ dự báo trượt ra kèm mũi tên | Cơ chế dự đoán, tín hiệu gửi đi |
| `signal-cancel` | Hai sóng ngược pha cộng lại thành đường thẳng xanh lá | Hai sóng vẽ dần rồi kết quả phẳng hiện ra, vòng sáng | Triệt tiêu, cân bằng, hai lực đối nhau |
| `brain-scan-compare` | Hai ảnh quét não cạnh nhau, một mờ một sáng rực | Vùng sáng phập phồng, vòng nhấn vàng | So sánh hai kết quả đo, bằng chứng ảnh chụp |
| `robot-tickle-lab` | Người giữa, cần gạt trái, cánh tay robot phải, dây nối đứt quãng | Cần gạt lắc, cánh tay robot theo nhịp | Thí nghiệm có thiết bị, điều khiển từ xa |
| `delay-dial` | Núm vặn lớn bên trái, thanh đo và mặt cười bên phải | Kim vặn dần, thanh đo đầy lên, mặt đổi từ chán sang cười | Điều chỉnh tham số, quan hệ nhân quả tăng dần |
| `two-tickle-types` | Chia đôi: lông vũ nhẹ bên trái, người cười ngặt nghẽo bên phải | Lông vũ đung đưa, người rung lắc | Phân loại hai kiểu, nhẹ vs nặng |
| `surprise-attack` | Người đứng, bốn vòng đỏ khoanh các vùng hiểm kèm nhãn và mũi tên | Vòng khoanh hiện lần lượt kèm mũi tên chỉ vào | Chỉ ra nhiều vị trí trên một đối tượng |
| `question-still-open` | Dấu hỏi tím khổng lồ giữa khung, hai người nhún vai hai bên | Dấu hỏi nhún lên xuống | Khoa học chưa có lời giải, kết mở |
| `address-vs-house` | Chia đôi: biển số nhà xanh bên trái, ngôi nhà bên phải | Hai bên hiện lần lượt kèm nhãn giải thích | Phân biệt hai khái niệm hay bị nhầm |
| `buy-domain-only` | Biển số cắm giữa bãi đất trống, người tới nơi ngơ ngác | Biển đung đưa, cỏ dại lay | Thiếu một nửa, kỳ vọng sai |
| `hosting-house` | Nhà cắt ngang lộ đồ bên trong (ảnh, bài viết, sản phẩm), tủ máy chủ bên phải | Từng món đồ hiện dần, đèn máy chủ nhấp nháy | Nơi chứa dữ liệu, bên trong có gì |
| `dns-directory` | Cuốn danh bạ mở, cột tên miền và cột IP, kính lúp rê tìm | Kính lúp di chuyển, dòng khớp được khoanh xanh | Tra cứu, ánh xạ, danh bạ |
| `nameserver-signpost` | Cột biển chỉ đường hai chiều: tên miền và hosting | Biển đung đưa, mũi tên nối sang nhà | Kết nối hai đầu, trỏ đúng chỗ |
| `move-house-same-address` | Nhà cũ mờ dần bên trái, nhà mới rõ dần bên phải, biển số bay theo | Biển số bay theo đường vòng cung sang nhà mới | Chuyển đổi nhà cung cấp, giữ nguyên phần còn lại |
| `separate-bills` | Hai tờ hoá đơn răng cưa cạnh nhau, tiêu đề màu khác nhau | Hai hoá đơn hiện lần lượt | Hai khoản chi riêng, hai chu kỳ khác nhau |
| `rent-calendar` | Tờ lịch có ô đỏ đánh dấu ngày hết hạn, chuông báo rung bên cạnh | Chuông rung liên tục, nhãn cảnh báo hiện dần | Hạn chót, gia hạn, nhắc nhở |
| `domain-wrong-owner` | Chủ doanh nghiệp tay không bên trái, hợp đồng trượt sang bên thứ ba cầm chìa khoá | Hợp đồng trượt và nghiêng dần, chìa khoá hiện ra | Mất quyền kiểm soát, bẫy hợp đồng |
| `full-picture` | Sơ đồ ngang: khách → tên miền → DNS → ngôi nhà, nối bằng mũi tên | Từng mắt xích hiện lần lượt, vòng sáng bao trọn | Tóm tắt quy trình, sơ đồ tổng kết |
| `slow-site-waiting` | Người sốt ruột gõ tay, trình duyệt quay vòng loading | Vòng xoay quay, ngón tay gõ | Chờ đợi, sốt ruột, hiệu năng kém |
| `three-second-rule` | Đồng hồ bấm giờ đếm tới 3, đám người bỏ đi bên phải | Số đếm tăng, kim quay, người trượt ra khỏi khung | Ngưỡng chịu đựng, mất khách |
| `heavy-image-anvil` | Ảnh 5MB đè lên trang web bẹp dí, bên phải bản nén 300KB | Ảnh đè xuống, bản nén thu nhỏ kèm dấu tích | Gánh nặng, tối ưu, trước và sau |
| `shared-hosting-crowd` | Tủ máy chủ trái, hàng chục website chen chúc quanh, một cái phình to | Website phình lên chiếm chỗ, đèn máy chủ nhấp nháy | Chia sẻ tài nguyên, tranh giành |
| `no-cache-kitchen` | Chia đôi: bếp nấu lại từ đầu / khay dọn sẵn, hai thanh tiến trình | Hơi bốc, thanh tiến trình chạy nhanh chậm khác nhau | Có chuẩn bị trước vs làm lại từ đầu |
| `plugin-pile` | Bảy thẻ plugin màu rơi chồng lên website ở đáy | Từng thẻ rơi xuống nghiêng ngả | Chồng chất, quá tải, tích tụ |
| `distance-cdn` | Quả địa cầu, máy chủ góc xa, khách góc gần, gói dữ liệu bay vòng | Gói dữ liệu bay theo cung, CDN hiện gần khách | Khoảng cách địa lý, độ trễ |
| `core-web-vitals` | Ba vòng tròn chỉ số kèm ngưỡng và mô tả | Vòng tròn vẽ dần theo màu riêng | Bộ tiêu chí đo lường, ba chỉ số |
| `layout-shift` | Trình duyệt: quảng cáo chèn vào đẩy nút xuống, con trỏ đứng yên bấm nhầm | Quảng cáo bật ra, nút nhảy xuống, vòng nhấn đỏ | Bố cục nhảy, bấm nhầm, trải nghiệm tệ |
| `speed-checklist` | Năm ô tick kèm việc cần làm | Tick xanh vẽ dần từng dòng | Danh sách hành động, tổng kết |
| `ai-tool-jungle` | Mười bốn thẻ tên công cụ AI trôi lơ lửng, người choáng ngợp ở dưới | Thẻ hiện dần và bồng bềnh | Quá nhiều lựa chọn, choáng ngợp |
| `pick-by-job` | Năm vòng tròn đánh số kèm tên nhóm việc | Từng vòng bung ra theo thứ tự | Phân nhóm, khung tư duy |
| `chatbot-lineup` | Biểu đồ cột lượt truy cập bốn chatbot kèm chú thích nguồn | Cột mọc dần, số hiện ra | So sánh quy mô, số liệu thị phần |
| `chatbot-strengths` | Năm dòng: việc bên trái, công cụ bên phải, mũi tên nối | Từng dòng hiện dần | Bảng đối chiếu việc - công cụ |
| `image-tools` | Trái: lưới mẫu thiết kế. Phải: ảnh mờ thành ảnh nét | Mẫu hiện dần, ảnh nét sáng lên | Công cụ ảnh, cải thiện chất lượng |
| `video-tools-price` | Ba dòng tên công cụ kèm giá mỗi giây | Từng dòng trượt vào từ trái | Bảng giá, so sánh chi phí |
| `sora-deprecated` | Thẻ công cụ bị gạch chéo đỏ, khung bài học bên phải | Dấu X vẽ dần, thẻ mờ đi, vòng sáng lan | Ngừng hoạt động, rủi ro phụ thuộc |
| `web-builder-lanes` | Ba làn ngang, mỗi làn một nhóm công cụ | Từng làn hiện dần | Phân loại ba nhóm song song |
| `ai-agent-new` | Chia đôi: chatbot chỉ trả lời / agent tự làm nhiều việc | Các thẻ việc bung ra quanh agent | Phân biệt hai thế hệ công cụ |
| `agent-stars` | Hai công cụ kèm số sao GitHub đếm tăng và dãy sao vàng | Số đếm tăng dần, sao hiện lần lượt | Độ phổ biến, tăng trưởng nhanh |
| `agent-security-warning` | Tam giác cảnh báo rung, danh sách quyền truy cập bên phải | Tam giác rung, từng quyền hiện ra | Rủi ro bảo mật, quyền truy cập |
| `decision-table` | Bảng hai cột tám dòng: việc và công cụ tương ứng | Từng dòng hiện dần | Bảng tra nhanh, tổng kết |

Chọn hình theo **ý nghĩa** chứ không theo chữ nghĩa. Ví dụ cảnh nói "và đây là điều
bất ngờ" thì `lightbulb-idea` hợp hơn là cố tìm hình đúng nội dung.

| `cdn-question` | Nhân vật cười cầm nút play, mũi tên cong nối tới ô "US SERVER" gạch chéo mảnh | Đường nối vẽ dần | Câu hỏi mồi, nghịch lý khoảng cách |
| `light-speed` | Đường ngang có hạt sáng chạy dọc, đồng hồ đo độ trễ ở khung giới thiệu | Hạt sáng chạy liên tục, kim đồng hồ quay | Tốc độ vật lý, giới hạn kỹ thuật |
| `distance-map` | 5 điểm nối bằng đường cong: Việt Nam - Hồng Kông - Nhật Bản - Guam - Mỹ | Đường vẽ dần, từng điểm hiện ra | Khoảng cách địa lý, trạm trung chuyển |
| `buffering-pain` | Nhân vật ngạc nhiên bên trái, vòng xoay loading tách riêng bên phải | Vòng xoay quay liên tục | Chờ đợi, trải nghiệm tệ, vấn đề cần giải quyết |
| `cache-idea` | Ô "GỐC" trên cao, bản sao "BẢN SAO" bay xuống gần nhân vật | Bản sao trượt xuống và thu nhỏ | Ý tưởng giải pháp, nhân bản gần người dùng |
| `edge-nodes` | Máy chủ gốc giữa, 6 thành phố toả quanh nối bằng nét đứt (đã dừng trước tên) | Từng thành phố hiện lần lượt | Phân phối theo địa lý, mạng lưới điểm biên |
| `ggc-inside-isp` | Hộp "Google Global Cache" trên cao nối xuống 3 khung Viettel/VNPT/FPT | Vòng sáng loé phía sau khung (không đè chữ) | Hạ tầng bên trong, tích hợp sâu |
| `cable-cut` | Bờ biển hai bên, nhiều đường cong nối giữa — đa số gạch X đỏ, một đường xanh còn nguyên | Đường vẽ dần, dấu X nhấp nháy | Sự cố hạ tầng, một điểm vẫn hoạt động |
| `cache-hit-miss` | Người - ô "BIÊN" - ô "GỐC", đường nối đổi từ đỏ đứt nét (trượt) sang xanh liền (trúng) | Đường vẽ dần theo từng bước | Hai kết quả đối lập, tiến trình cải thiện |
| `cache-invalidation` | Hai ô "MÁY GỐC"/"MÁY BIÊN" với khối màu đổi trạng thái theo bước | Khối màu chuyển từ cũ sang "đang xoá" | Vấn đề đồng bộ, ba giai đoạn hỏi-vấn đề-giải pháp |
| `summary-cdn` | Trục ngang "xa"→"gần" với chấm di chuyển, nhãn đổi theo bước | Chấm trượt ngang, nhãn thay đổi | Tổng kết, rút gọn khoảng cách |

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

## Logo thương hiệu thật (`logo.tsx`)

Khi video nói về sản phẩm có thật, người xem nhận ra logo nhanh hơn nhiều so với đọc
tên. Dùng component `LogoBox`:

```tsx
<LogoBox x={400} y={270} name="chatgpt" size={218} showLabel={false} />
```

Nó vẽ một ô trắng viền đen dày (khớp phong cách vẽ tay) rồi đặt logo thật vào trong.
Tên nào chưa có file logo thì **tự động rơi về thẻ chữ** — không có logo giả.

### Ba nguyên tắc bắt buộc

**1. Tuyệt đối không sinh logo bằng AI.** Model tạo ảnh sẽ ra thứ *trông giống* logo
mà không phải logo thật — vừa là hàng nhái, vừa làm người xem mất tin tưởng khi nhận
ra sai lệch. Không có logo thì dùng thẻ chữ, không bịa.

**2. Tải từ nguồn rõ giấy phép, không lấy bừa từ Google Images.** Wikimedia Commons
có API tra đúng tên file:

```bash
# tìm đúng tên file
curl -s -G "https://commons.wikimedia.org/w/api.php" \
  --data-urlencode "action=query" --data-urlencode "format=json" \
  --data-urlencode "list=search" --data-urlencode "srsearch=Canva logo" \
  --data-urlencode "srnamespace=6" --data-urlencode "srlimit=4"

# lấy URL thật rồi tải
curl -s -G "https://commons.wikimedia.org/w/api.php" \
  --data-urlencode "action=query" --data-urlencode "format=json" \
  --data-urlencode "prop=imageinfo" --data-urlencode "iiprop=url" \
  --data-urlencode "titles=File:Wix logo svg.svg"
```

Đoán tên file kiểu `File:Canva_logo.svg` hay trả 404 — cứ tra bằng `list=search` trước.

**3. Kiểm tra biến thể ngôn ngữ.** Đã dính một lần: tải nhầm `Grok logo 2025 ja.svg`
là bản tiếng Nhật, trên video hiện chữ グロック. Xem trước file bằng cách render một
khung hình rồi nhìn, đừng tin mỗi tên file.

### Kích thước logo

Logo dạng chữ (Anthropic, DeepSeek, Perplexity, Webflow) cần ô **ít nhất 200px** trên
khung 1920 mới đọc được trên điện thoại. Ô 112px cho chữ cao ~14px — thành vệt mờ.

Xếp 4 cột thay vì 5 để mỗi ô đủ to. Trong bảng thì thu hẹp ô chữ để lấy chỗ cho logo.


## Theme riêng cho một chủ đề (đổi hẳn bảng màu và nét vẽ)

Mặc định mọi hình dùng một bộ màu tươi thống nhất (xem "Bảng màu chuẩn" dưới đây).
Nhưng khi nội dung khác hẳn về tinh thần — ví dụ mảng kỹ thuật/nguyên lý so với mảng
giải trí/kể chuyện — nên đổi hẳn theme cho khớp, không cố nhồi vào bảng màu cũ.

`tech.tsx` là ví dụ: nền giấy kem có ô lưới mờ (`PaperFrame`), nét mảnh hơn
(`strokeWidth` 5-7 thay vì 9-13), bảng màu trầm (xanh cổ vịt, đỏ gạch, vàng đất, xanh
rêu) thay cho màu tươi. Vẫn giữ nguyên nhân vật que nét đen dày để không lạ mắt so
với các video khác trong series.

Khi cần một theme mới:
1. Tạo file riêng (không nhét vào file cũ), định nghĩa hằng màu ở đầu file.
2. Viết một `Frame` riêng cho theme đó (đổi nền, có thể thêm lưới/vân giấy/texture).
3. Có thể copy các hàm phụ trợ (đầu nhân vật, khối server...) sang bản riêng của theme
   nếu chúng cần khác biệt rõ (nét mảnh hơn, tỉ lệ khác) — đừng cố dùng chung với bản
   nét dày nếu hai theme sẽ đứng cạnh nhau trong series.

## Cách vẽ hình mới

Hình nằm ở 3 file: `parts.tsx` (bộ phận dùng lại), `index.tsx` (5 hình đầu + registry),
`more.tsx` (5 hình tiếp), `story3am.tsx` (8 hình ngủ hai giấc), `nap.tsx` (11 hình ngủ trưa),
`memory.tsx` (13 hình ký ức tuổi thơ), `tickle.tsx` (10 hình về cù và dự đoán của não),
`domain.tsx` (10 hình tên miền/hosting/DNS), `speed.tsx` (10 hình tốc độ website),
`aitools.tsx` (12 hình công cụ AI), `tech.tsx` (11 hình chủ đề CDN/mạng, theme
riêng "vở nháp kỹ sư" — xem mục theme bên dưới), `fx.tsx` (bộ hiệu ứng giải thích dùng chung), `logo.tsx` (logo thương hiệu thật).

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

### Vùng an toàn: giữ nội dung trong x 70–1850

`StoryScene` áp hiệu ứng Ken Burns phóng to 1,05–1,07 lần, nên **mép khung bị cắt
khoảng 63px mỗi bên**. Toạ độ nhìn thì nằm gọn trong 1920 mà lên video vẫn mất chữ.

Quy tắc: mọi thứ quan trọng đặt trong khoảng **x từ 70 tới 1850**, **y từ 60 tới 1020**.
Nền và mảng màu lớn thì cứ tràn ra ngoài thoải mái — chỉ chữ và chi tiết cần đọc mới
phải nằm trong vùng an toàn.

Với bảng hai cột, tính ngược từ mép phải: cột phải kết thúc ở đâu, cộng lại xem có
vượt 1850 không, rồi mới chọn toạ độ cột trái.

### Hình nhiều bước: dựng sân khấu trước, điền dữ liệu sau

Nhiều cảnh liên tiếp thường dùng chung một hình. `StoryVideoComposition` tự gom
chúng thành một **chuỗi**: hình nhận `frame` cộng dồn nên animation chạy tiếp thay
vì giật lại, chỉ fade ở đầu và cuối chuỗi, và nhận `step` tăng dần (0, 1, 2...).

Component nhận `step` qua props: `({ frame, accent, step = 0 })`.

**Sai lầm dễ mắc:** ẩn hết mọi thứ ở `step === 0`. Cảnh đầu chuỗi thường là cảnh
giới thiệu nhóm, ẩn hết thì khung trống trơn suốt 5 giây.

Đúng: **bước 0 dựng sẵn khung xương** — trục toạ độ, khung bảng, các làn, logo —
ở dạng mờ (opacity 0.35-0.5), rồi các bước sau mới điền dữ liệu và làm rõ dần.

```tsx
const filled = step >= i + 1;
const p = filled ? easeOut(progress(frame, 4, 16)) : 0;
// khung luôn hiện, chỉ nội dung mới gate theo step
<g opacity={filled ? 1 : 0.45}>
  <rect ... />           {/* khung: hiện từ bước 0 */}
  {filled ? <ToolChip ... /> : null}   {/* nội dung: theo bước */}
</g>
```

Cảnh cuối video hay dùng lại hình của cảnh mở đầu. Khi đó chuỗi bị đứt nên `step`
đếm lại từ 0 và caption của cảnh mở đầu hiện lại — sai hẳn ý. Khắc phục bằng cách
đặt `"step"` thủ công trong JSON cho các cảnh đó.

### Lỗi lệch nhịp trong hình nhiều bước — dạng lỗi nguy hiểm nhất

Khi một hình có 3 cảnh (step 0/1/2) mà mỗi bước đại diện một Ý trong lời đọc, rất dễ
gán sai bước nào ứng với ý nào — nhất là khi 2 trạng thái đối lập nhau (chậm/nhanh,
vấn đề/giải pháp, câu hỏi/đáp án). Đã gặp thực tế 3 lần trong cùng một video:

- Cảnh nói "trượt cache, chậm" nhưng hình đã chuyển sang "trúng cache, nhanh" —
  vì code chỉ có 2 trạng thái (`step === 0`) trong khi cảnh có 3 bước, bước giữa
  bị đẩy nhầm sang trạng thái của bước cuối.
- Cảnh mới đặt câu hỏi mở nhưng hình đã hiện luôn câu trả lời của bước sau.
- Cảnh có 2 ý trong cùng một câu, hình chỉ vẽ ý đầu, ý thứ hai bị đẩy sang cảnh kế —
  cảnh kế đó lại lặp nguyên hình cũ vì không có nội dung mới để hiện.

**Cách phòng tránh:** khi hình có N bước, liệt kê rõ N cảnh tương ứng nói gì, rồi map
1-1 rành mạch — đừng suy luận ngầm `step === 0 ? A : B` cho hình có từ 3 bước trở lên.
Test bằng cách đọc lại từng cặp (lời đọc cảnh i, nhãn hiện ra ở bước i) và tự hỏi:
"câu này mà nghe cùng lúc với hình này thì có mâu thuẫn không?"

### Kiểm tra khung hình trước khi render bản cuối

Render một file kiểm tra mô phỏng ĐÚNG chuỗi cảnh của kịch bản thật (cùng thứ tự
`illustration`, có cả trường `step`), trích từng khung hình rồi soi. Nếu file kiểm
tra thiếu `step` thì các hình nhiều bước sẽ hiện sai trạng thái và bạn kiểm nhầm.

```bash
node scripts/render-from-script.mjs data/check-qa.json out/check-qa.mp4 StoryVideo
ffmpeg -y -ss <giây> -i out/check-qa.mp4 -frames:v 1 -vf scale=880:-1 out/qa/01.png
```

Bốn lỗi hay gặp nhất, đã đo thực tế:
1. **Nhãn tràn mép** — tính bề rộng `PopLabel` bằng `số ký tự × size × 0,62 + 46`,
   cộng vào toạ độ tâm rồi so với vùng an toàn.
2. **Nhãn xén đáy** — bất cứ nhãn nào đặt dưới y=970 đều có nguy cơ, vì zoom 1,07
   đẩy đáy hộp xuống thêm ~40px.
3. **Số trên hình lệch số trong lời đọc** — đọc "chín trăm sáu mươi tám triệu" mà
   hình ghi "970 tr" thì người xem nghĩ là bịa số.
4. **Chữ trắng trên nền sáng** — hồng `#f0a3c0`, xanh lơ `#5fc9e8`, cam `#f5a623`
   chỉ đạt ~1,9:1 với chữ trắng. Nền sáng thì dùng chữ đen.

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
