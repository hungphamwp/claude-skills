# Cài Đặt Skill: Flatsome Web Finder v2.0

---

## Skill này làm gì?

Tìm website tham khảo (mẫu web) cho bất kỳ ngành nào, đảm bảo mọi gợi ý đều build được bằng **WordPress + Flatsome + UX Builder + WooCommerce**.

### 5 chế độ:
1. **Tìm Nhanh** ⚡ — gõ vài từ, chọn option, nhận kết quả
2. **Tìm Kỹ** 🔍 — phân tích sâu, nhiều tiêu chí
3. **Tìm Tương Tự** 🔄 — "tìm web giống web này"
4. **Kiểm Tra Web** 🔎 — "web này build Flatsome được không?"
5. **Phân Tích Đối Thủ** 🕵️ — "tìm web đẹp hơn đối thủ"

### Tính năng:
- Tự kiểm tra tech stack (loại React/Vue/custom code)
- Chấm điểm tương thích Flatsome ★1-5
- 10 ngành có preset thông minh (xây dựng, y tế, BĐS, nội thất...)
- Lọc theo: phong cách, B2B/B2C, quy mô, VN/quốc tế, WooCommerce, mức custom
- Feedback loop — nói "web 2,5 OK" để đợt sau chính xác hơn
- Xuất kết quả ra Word/PowerPoint/Excel cho khách hàng

---

## Yêu Cầu

- Tài khoản Claude có **Cowork mode** hoặc **Claude Code**
- Cần có quyền **WebSearch** và **WebFetch** (để tìm và kiểm tra website)

---

## Cách Cài Đặt

### Bước 1: Giải nén file `flatsome-web-finder.zip`

### Bước 2: Copy vào đúng vị trí

#### Trên Cowork (Claude Desktop):
1. Mở Cowork, chọn một folder làm việc
2. Trong folder đó, tạo đường dẫn `.claude/skills/` (nếu chưa có)
3. Copy toàn bộ folder `flatsome-web-finder/` vào:

```
your-folder/
└── .claude/
    └── skills/
        └── flatsome-web-finder/
            ├── SKILL.md
            ├── INSTALL.md
            ├── USAGE-GUIDE.md
            └── references/
                ├── flatsome-capabilities.md
                ├── search-patterns.md
                ├── ask-questions-guide.md
                └── industry-presets.md
```

#### Trên Claude Code (Terminal):
```bash
mkdir -p .claude/skills
cp -r flatsome-web-finder .claude/skills/
```

#### Cài global (dùng cho mọi project):
```bash
mkdir -p ~/.claude/skills
cp -r flatsome-web-finder ~/.claude/skills/
```

### Bước 3: Khởi động lại Cowork hoặc mở cuộc hội thoại mới

### Bước 4: Test thử
Gõ một trong các câu sau:
```
tìm mẫu web ngành xây dựng 5 mẫu
```
```
web thiết bị y tế B2B tương thích Flatsome
```
```
tìm web giống phucbinh.com.vn
```

Nếu skill hoạt động, Claude sẽ hỏi bạn chọn option (Quick mode) hoặc bắt đầu tìm ngay (nếu đủ thông tin).

---

## Cấu Trúc File

```
flatsome-web-finder/
├── SKILL.md                    # Bộ não chính — 5 modes, quy trình tìm
├── INSTALL.md                  # Hướng dẫn cài đặt (file này)
├── USAGE-GUIDE.md              # Hướng dẫn sử dụng + ví dụ + mẹo + FAQ
└── references/
    ├── flatsome-capabilities.md  # 150+ element Flatsome (YES/NO/LIMITED)
    │                              + Tech stack detection cheatsheet
    │                              + Quick decision flowchart
    ├── search-patterns.md        # Search queries tối ưu cho 10+ ngành
    │                              + VN & international queries
    │                              + Style-specific & find-similar queries
    ├── ask-questions-guide.md    # Template câu hỏi Quick/Detailed/Similar
    │                              + Smart detection rules (auto-skip)
    │                              + Feedback loop templates
    └── industry-presets.md       # Smart defaults cho 10 ngành:
                                   + Must-have sections per industry
                                   + Recommended colors & fonts
                                   + Typical social proof elements
                                   + Optimized search queries
```

---

## Troubleshooting

**Skill không được gọi?**
- Kiểm tra folder `flatsome-web-finder` nằm đúng trong `.claude/skills/`
- Đảm bảo có file `SKILL.md` (không phải `skill.md` — case sensitive)
- Thử gõ rõ: "dùng skill flatsome-web-finder tìm web ngành y tế"
- Khởi động lại cuộc hội thoại

**Kết quả ít hoặc không có?**
- Ngành quá niche → thử mở rộng từ khóa
- Quá nhiều filter → bớt filter, tìm rộng hơn
- Khu vực "chỉ VN" → nhiều web VN không có WordPress, thử "cả hai"

**Muốn thêm ngành mới vào preset?**
- Mở file `references/industry-presets.md`
- Copy 1 ngành có sẵn, sửa thành ngành mới
- Lưu file, dùng luôn — không cần restart

**Muốn điều chỉnh tiêu chí Flatsome?**
- Mở file `references/flatsome-capabilities.md`
- Thêm/sửa element trong bảng YES/NO/LIMITED
- Ví dụ: nếu bạn cài thêm plugin mới cho Flatsome, thêm nó vào danh sách YES
