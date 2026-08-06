# URL Clone Workflow — Live Site → Flatsome

> Dùng khi user gửi **link website mẫu** (không phải ảnh).  
> Mục tiêu: fetch HTML/CSS/assets thật → phân tích chính xác → clone 90-100%.

---

## Thứ tự bắt buộc

```
1. PRE-FLIGHT (xem preflight-checklist.md)
2. Fetch & phân tích source HTML/CSS
3. Extract assets (ảnh, SVG, font)
4. Chạy Section Inventory từ HTML thật
5. Extract design tokens từ CSS thật (không đoán)
6. Map sang Flatsome shortcodes
7. Build + Deploy
8. Autonomous QA loop
```

---

## Bước 1 — Fetch HTML nguồn

```bash
# LocalWP / VPS: fetch full HTML
curl -sL "https://example.com" -o /tmp/source.html \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

# Xem size
wc -l /tmp/source.html

# Extract tất cả external CSS files
grep -oE 'href="[^"]*\.css[^"]*"' /tmp/source.html | sed 's/href="//;s/"//'

# Extract tất cả external JS (để biết có thư viện gì: AOS, GSAP, Swiper, v.v.)
grep -oE 'src="[^"]*\.js[^"]*"' /tmp/source.html | sed 's/src="//;s/"//' | grep -v "jquery\|wp-\|block"
```

---

## Bước 2 — Extract CSS variables & design tokens

```bash
# Download CSS chính
CSS_URL=$(grep -oE 'href="[^"]*style[^"]*\.css[^"]*"' /tmp/source.html | head -1 | sed 's/href="//;s/"//')
curl -sL "$CSS_URL" -o /tmp/source.css

# Tìm :root variables (design tokens)
grep -A 100 ':root' /tmp/source.css | head -80

# Tìm font imports
grep "@import\|@font-face\|fonts.googleapis" /tmp/source.css | head -10

# Tìm màu primary phổ biến nhất
grep -oE '#[0-9a-fA-F]{3,6}' /tmp/source.css | sort | uniq -c | sort -rn | head -20
```

### Mapping CSS vars → Flatsome child theme

```bash
# Tự động tạo :root block từ source
python3 << 'PY'
import re, sys

with open('/tmp/source.css') as f:
    css = f.read()

# Extract :root block
root = re.search(r':root\s*\{([^}]+)\}', css, re.DOTALL)
if root:
    vars_raw = root.group(1).strip()
    print("/* === DESIGN TOKENS (extracted from source) === */")
    print(":root {")
    for line in vars_raw.split('\n'):
        line = line.strip()
        if line.startswith('--') and ':' in line:
            print(f"  {line}")
    print("}")
PY
```

---

## Bước 3 — Extract assets từ source HTML

### Phân loại assets cần download

```bash
# Hero backgrounds / section backgrounds
grep -oE '(background-image|background):\s*url\([^)]+\)' /tmp/source.css | \
  grep -oE 'url\([^)]+\)' | sed "s/url(//;s/)//;s/['\"]//g"

# Images trong HTML
grep -oE 'src="[^"]*\.(png|jpg|jpeg|webp|svg)[^"]*"' /tmp/source.html | \
  sed 's/src="//;s/"//' | sort -u

# SVG inline (icons, decorations)
grep -oE '<svg[^>]*>.*?</svg>' /tmp/source.html | head -5
```

### Download assets về VPS / LocalWP

```bash
WPPATH=/home/admin/domains/example.com/public_html
UPLOAD="$WPPATH/wp-content/uploads/cloned-assets"
mkdir -p $UPLOAD

# Download từng ảnh
curl -sL "https://source.com/path/to/hero.jpg" -o $UPLOAD/hero.jpg
curl -sL "https://source.com/path/to/logo.svg" -o $UPLOAD/logo.svg

# Import vào WP Media Library
LOGO_ID=$(wp --path=$WPPATH media import $UPLOAD/logo.svg --title="Logo" --porcelain --allow-root)
HERO_ID=$(wp --path=$WPPATH media import $UPLOAD/hero.jpg --title="Hero BG" --porcelain --allow-root)
echo "Logo ID: $LOGO_ID | Hero ID: $HERO_ID"
```

---

## Bước 4 — Section Inventory từ HTML thật

### Phân tích cấu trúc HTML thay vì đoán từ ảnh

```bash
# Tìm tất cả section containers
python3 << 'PY'
import re

with open('/tmp/source.html') as f:
    html = f.read()

# Tìm sections theo class pattern
sections = re.findall(r'<(?:section|div)[^>]+class="([^"]*(?:section|block|hero|banner|wrapper|container)[^"]*)"', html)
for i, s in enumerate(sections[:20], 1):
    print(f"[{i}] {s}")
PY
```

### Đọc font-family thực tế

```bash
# Font families được dùng
grep -oE "font-family:\s*[^;]+" /tmp/source.css | sort -u | head -10

# Google Fonts import URL (đầy đủ với weights)
grep "fonts.googleapis.com" /tmp/source.css /tmp/source.html 2>/dev/null | head -5
```

---

## Bước 5 — Responsive: đọc breakpoints từ source

```bash
# Tìm tất cả breakpoints (media queries) trong source CSS
grep -oE '@media[^{]+\{' /tmp/source.css | sort -u

# Giá trị max-width phổ biến nhất
grep -oE 'max-width:\s*[0-9]+px' /tmp/source.css | sort | uniq -c | sort -rn | head -5

# Grid/flex column counts ở mobile
grep -B5 "max-width: 768\|max-width: 576\|max-width: 480" /tmp/source.css | \
  grep -E "grid-template-columns|flex-direction|columns" | head -10
```

**Map breakpoints source → Flatsome:**

| Source breakpoint | Flatsome equivalent |
|---|---|
| `max-width: 992px` | `span__md` (Flatsome ≤849px) |
| `max-width: 768px` | `span__md` hoặc `span__sm` |
| `max-width: 576px` | `span__sm` (Flatsome ≤549px) |

---

## Bước 6 — Header: đọc cấu trúc thật

```bash
# Tìm header HTML
python3 << 'PY'
import re

with open('/tmp/source.html') as f:
    html = f.read()

# Extract header block
m = re.search(r'(<header[^>]*>.*?</header>)', html, re.DOTALL | re.IGNORECASE)
if m:
    header = m.group(1)
    # Strip whitespace-heavy content
    header = re.sub(r'\s+', ' ', header)
    print(header[:2000])
PY
```

**Checklist nhận dạng header pattern:**

```
□ Logo vị trí: trái / giữa / phải
□ Nav style: ngang / hamburger / mega dropdown
□ Topbar: có / không → text gì (SĐT, email, social)
□ Sticky: có / không
□ Transparent trên hero: có / không
□ Search: có / không
□ Cart/Account icon: có / không
□ CTA button: text gì, màu gì, vị trí nào
□ Mobile: hamburger icon, menu slide left/right/full-screen
```

---

## Bước 7 — Footer: đọc cấu trúc thật

```bash
python3 << 'PY'
import re

with open('/tmp/source.html') as f:
    html = f.read()

# Extract footer
m = re.search(r'(<footer[^>]*>.*?</footer>)', html, re.DOTALL | re.IGNORECASE)
if m:
    footer_text = re.sub(r'<[^>]+>', ' ', m.group(1))
    footer_text = re.sub(r'\s+', ' ', footer_text).strip()
    print(footer_text[:1500])
PY
```

---

## Output template sau khi phân tích URL

```markdown
# URL CLONE AUDIT — [Domain]
Source: [URL]
Fetched: [date]
Fidelity target: [90% / 100%]

## DESIGN TOKENS (extracted from CSS)
Primary:        #xxxx (var: --color-primary)
Secondary:      #xxxx
Heading:        #xxxx
Body text:      #xxxx
BG light:       #xxxx
Font family:    [exact Google Font name + weights]
Font fallback:  [system stack]
Radius:         Xpx (var: --border-radius)
Shadow:         [copied exact box-shadow value]
Container:      Xpx max-width

## BREAKPOINTS
Desktop:  [default]
Tablet:   [source breakpoint] → Flatsome span__md (849px)
Mobile:   [source breakpoint] → Flatsome span__sm (549px)

## ASSETS TO DOWNLOAD
- logo.svg → [URL]
- hero-bg.jpg → [URL]
- [icon].svg → [URL]

## SECTION INVENTORY (from HTML)
[1] Header: [pattern]
[2] Hero: [pattern]
...
[n] Footer: [pattern]

## PLUGINS NEEDED
- [ ] Contact Form 7 (nếu có form)
- [ ] ACF (nếu có custom fields/specs)
- [ ] WooCommerce (nếu có shop)
```
