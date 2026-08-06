# Claude Skills — Hưng Phạm / HPB Media

Bộ skill dùng với [Claude Code](https://claude.com/claude-code). Mỗi thư mục
là một skill: Claude đọc `SKILL.md` và tự làm theo khi gặp đúng loại việc.

## Danh sách skill

| Skill | Việc nó làm |
|---|---|
| [`video-quangcao-hpb`](video-quangcao-hpb/) | Dựng video quảng cáo dọc 1080×1920 có giọng đọc tiếng Việt, nhạc nền và hiệu ứng — từ một file JSON |
| [`baogia-halomedia`](baogia-halomedia/) | Xuất báo giá thiết kế website ra file .xlsx, tự đánh số liên tục |
| [`baocao-quantri`](baocao-quantri/) | Báo cáo quản trị website hàng tháng cho khách, xuất .xlsx |
| [`flatsome-skill-v2`](flatsome-skill-v2/) | Dựng website WordPress bằng theme Flatsome, clone giao diện từ URL/ảnh/Figma |
| [`elementor-skill`](elementor-skill/) | Dựng và deploy trang WordPress bằng Elementor |
| [`devvn-html-to-wp-acf`](devvn-html-to-wp-acf/) | Chuyển landing page HTML tĩnh sang WordPress template + ACF |
| [`devvn-wp-security-audit`](devvn-wp-security-audit/) | Rà soát bảo mật plugin/theme WordPress theo chuẩn WPCS |

> Hai skill `devvn-*` do tác giả **devvn** viết, không phải của HPB Media.

## Cài trên máy mới

```bash
git clone https://github.com/hungphamwp/claude-skills.git ~/.claude/skills
```

Có sẵn `~/.claude/skills` rồi thì clone ra chỗ khác rồi copy từng thư mục vào.

Sau khi clone, dựng lại các file dữ liệu riêng (xem mục dưới):

```bash
cd ~/.claude/skills
cp baogia-halomedia/V1.2/bang-gia-chuan.example.md baogia-halomedia/V1.2/bang-gia-chuan.md
cp baogia-halomedia/V1.2/so-lien-tuc.example.json  baogia-halomedia/V1.2/so-lien-tuc.json
cp baocao-quantri/V1.0/so-lien-tuc.example.json    baocao-quantri/V1.0/so-lien-tuc.json
```

Rồi mở `bang-gia-chuan.md` điền giá thật vào.

## File KHÔNG có trong repo

Repo này public nên vài file được cố ý giữ ngoài (xem `.gitignore`):

| File | Lý do |
|---|---|
| `bang-gia-chuan.md` | Chứa giá vốn domain/hosting — công khai là lộ biên lợi nhuận. Có bản `.example` để dựng lại. |
| `so-lien-tuc.json` | Bộ đếm số báo giá/hợp đồng. Vừa là trạng thái chạy của từng máy, vừa để lộ sản lượng kinh doanh. |
| `node_modules/`, `__pycache__/` | Thư viện, chạy `npm install` là có lại. |
| `output/`, `audio/` | File do skill sinh ra khi chạy. |

## Thêm skill mới

Bỏ thư mục skill vào đây rồi:

```bash
cd ~/.claude/skills
git add -A && git commit -m "Thêm skill <tên>" && git push
```

## Yêu cầu hệ thống

Phần lớn skill chỉ cần Claude Code. Riêng `video-quangcao-hpb` cần thêm:
macOS (lệnh `say`), Google Chrome, `ffmpeg`, Node.js, Python 3 + numpy.
