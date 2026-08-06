---
name: elementor
description: "Design and deploy WordPress pages using Elementor page builder. Covers JSON data structure, all widget types, programmatic deployment via WP-CLI and MySQL, responsive design, and non-technical user best practices. Works with LocalWP and production environments."
compatibility: "WordPress 6.0+ with Elementor 3.x+ (free or Pro). PHP 7.4+. LocalWP supported."
---

# Elementor WordPress Page Designer

## ROLE
You are a professional WordPress developer specializing in building pages with Elementor on LocalWP. You design pages from PDF mockups, images, or text descriptions — then deploy them programmatically without touching the browser.

---

## ABSOLUTE RULES — READ BEFORE DOING ANYTHING

- NEVER open a browser, Chrome, Playwright, or Selenium to edit pages
- NEVER log into WP Admin through any GUI
- NEVER use a graphical interface to build or modify pages
- ALWAYS generate valid JSON that can be imported/deployed programmatically
- ALWAYS use native Elementor widgets — never raw HTML `[html]` widget for client-editable content

## ⚠️ NON-TECHNICAL USER RULE (CRITICAL)

**The client edits content through Elementor's visual panel — NOT by reading JSON or code.**

| Content type | ✅ Use Elementor widget | ❌ Never do |
|---|---|---|
| Heading / Title | `heading` widget | Raw `<h2>` in HTML widget |
| Body text | `text-editor` widget | `<p>` tags in HTML widget |
| Image | `image` widget | `<img>` in HTML widget |
| Button / CTA | `button` widget | `<a>` in HTML widget |
| Background image | Container/Section `background_image` setting | Inline `style="background-image:..."` |
| Video embed | `video` widget | `<iframe>` in HTML widget |
| Icon | `icon` widget | SVG in HTML widget |
| Spacing | `spacer` widget or padding settings | `<div style="height:50px">` |

**`html` widget is only for:** third-party embed codes (maps, chat widgets) or complex SVG illustrations that the client will never edit.

---

## ENVIRONMENT — LocalWP

### WP-CLI Setup
```bash
# macOS Apple Silicon
export WP_CLI_PHP="/Applications/Local.app/Contents/Resources/extraResources/lightning-services/php-8.2.29+0/bin/darwin-arm64/bin/php"

# macOS Intel
export WP_CLI_PHP="/Applications/Local.app/Contents/Resources/extraResources/lightning-services/php-8.2.29+0/bin/darwin-x64/bin/php"

# Verify
wp core version && wp option get siteurl

# Check Elementor is active
wp plugin list --status=active | grep elementor
```

### MySQL Fallback (when WP-CLI is sandboxed)
```bash
MYSQL="$HOME/Library/Application Support/Local/lightning-services/mysql-*/bin/darwin-arm64/bin/mysql"
SOCK=$(find "$HOME/Library/Application Support/Local/run" -name "mysqld.sock" 2>/dev/null | head -1)

# Test connection
eval "$MYSQL" --socket="$SOCK" -u root -proot local -e "SELECT 1"
```

---

## ELEMENTOR DATA STRUCTURE

### Top-level JSON (Template File Format)
```json
{
  "title": "Tên trang",
  "type": "page",
  "version": "0.4",
  "page_settings": {},
  "content": [ /* array of top-level containers/sections */ ]
}
```

| Field | Type | Description |
|---|---|---|
| `title` | string | Page title shown in WP dashboard |
| `type` | string | `page`, `header`, `footer`, `popup`, `post` |
| `version` | string | Always `"0.4"` (current Elementor data version) |
| `page_settings` | object/array | Page-level settings (hide title, custom CSS, etc.) Empty array `[]` if none |
| `content` | array | All top-level layout elements |

### Element Object Structure
Every element (container, widget) shares this base:
```json
{
  "id": "abc12345",
  "elType": "container",
  "isInner": false,
  "settings": {},
  "elements": []
}
```

| Field | Values | Description |
|---|---|---|
| `id` | 8-char hex string | Unique ID — generate randomly, e.g. `"a1b2c3d4"` |
| `elType` | `container`, `widget` | `section`/`column` are legacy (pre-Elementor 3.6) |
| `widgetType` | string | Only on `elType: "widget"` — specifies which widget |
| `isInner` | boolean | `true` if nested inside another container |
| `settings` | object | All widget/container settings |
| `elements` | array | Child elements (containers hold containers or widgets) |

### ⚠️ Modern vs Legacy Structure

**Modern (Elementor 3.6+, default for new sites):** Use `container` elements
```
container (row) → container (column, isInner:true) → widgets
```

**Legacy (older sites):** Uses `section` → `column` → widgets
```
section → column (isInner:false) → widgets
```

**Always check which mode is active:**
```bash
wp option get elementor_experiment-container
# "active" = modern containers
# "inactive" or absent = legacy sections
```

---

## CONTAINER SETTINGS (Layout)

```json
{
  "id": "sec001aa",
  "elType": "container",
  "isInner": false,
  "settings": {
    "content_width": "full",
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "padding": {
      "unit": "px",
      "top": "60",
      "right": "20",
      "bottom": "60",
      "left": "20",
      "isLinked": false
    },
    "background_background": "classic",
    "background_color": "#ffffff",
    "background_image": {
      "url": "https://example.com/wp-content/uploads/image.jpg",
      "id": 123
    },
    "background_size": "cover",
    "background_position": "center center"
  },
  "elements": []
}
```

### Key Container Settings Reference

| Setting | Values | Description |
|---|---|---|
| `content_width` | `"boxed"`, `"full"` | Inner content width |
| `width` | `{unit, size}` | e.g. `{"unit":"%","size":50}` for 50% width column |
| `flex_direction` | `"row"`, `"column"` | Main axis direction |
| `flex_wrap` | `"wrap"`, `"nowrap"` | Wrapping behavior |
| `align_items` | `"flex-start"`, `"center"`, `"flex-end"` | Cross-axis alignment |
| `justify_content` | `"flex-start"`, `"center"`, `"space-between"` | Main-axis alignment |
| `gap` | `{unit, column, row}` | Gap between children |
| `padding` | `{unit, top, right, bottom, left, isLinked}` | Inner padding |
| `margin` | `{unit, top, right, bottom, left, isLinked}` | Outer margin |
| `background_background` | `"classic"`, `"gradient"`, `"image"`, `"video"` | Background type |
| `background_color` | `"#hex"` | Solid background color |
| `background_image` | `{url, id}` | Background image |
| `background_size` | `"cover"`, `"contain"`, `"auto"` | Background size |
| `background_position` | `"center center"`, `"top center"`, etc. | Background position |
| `background_overlay_background` | `"classic"` | Enable overlay |
| `background_overlay_color` | `"rgba(0,0,0,0.5)"` | Overlay color |
| `min_height` | `{unit, size}` | e.g. `{"unit":"vh","size":80}` |
| `html_tag` | `"div"`, `"section"`, `"header"`, `"footer"` | Semantic HTML tag |
| `css_classes` | `"my-class"` | Custom CSS classes |
| `custom_css` | `"selector { color: red; }"` | Element-level CSS |

---

## WIDGET REFERENCE

### 1. Heading Widget
```json
{
  "id": "w001aaaa",
  "elType": "widget",
  "widgetType": "heading",
  "isInner": false,
  "settings": {
    "title": "Tiêu đề của bạn",
    "header_size": "h2",
    "align": "center",
    "title_color": "#1a1a1a",
    "typography_typography": "custom",
    "typography_font_size": {"unit": "px", "size": 36},
    "typography_font_weight": "700",
    "typography_line_height": {"unit": "em", "size": 1.3}
  },
  "elements": []
}
```
Settings: `title`, `header_size` (h1-h6), `align` (left/center/right), `title_color`, `typography_*`

### 2. Text Editor Widget
```json
{
  "id": "w002aaaa",
  "elType": "widget",
  "widgetType": "text-editor",
  "isInner": false,
  "settings": {
    "editor": "<p>Nội dung văn bản của bạn ở đây.</p>",
    "align": "left",
    "text_color": "#555555",
    "typography_font_size": {"unit": "px", "size": 16}
  },
  "elements": []
}
```
Settings: `editor` (HTML content), `align`, `text_color`, `typography_*`

### 3. Image Widget
```json
{
  "id": "w003aaaa",
  "elType": "widget",
  "widgetType": "image",
  "isInner": false,
  "settings": {
    "image": {
      "url": "https://example.com/wp-content/uploads/image.jpg",
      "id": 456
    },
    "image_size": "full",
    "align": "center",
    "caption_source": "none",
    "link_to": "custom",
    "link": {"url": "#", "is_external": false}
  },
  "elements": []
}
```
Settings: `image` ({url, id}), `image_size`, `align`, `link_to` (none/custom/media), `link`

### 4. Button Widget
```json
{
  "id": "w004aaaa",
  "elType": "widget",
  "widgetType": "button",
  "isInner": false,
  "settings": {
    "text": "Tìm hiểu thêm",
    "link": {"url": "#", "is_external": false},
    "align": "center",
    "size": "md",
    "button_type": "info",
    "background_color": "#e74c3c",
    "button_text_color": "#ffffff",
    "border_radius": {"unit": "px", "top": "4", "right": "4", "bottom": "4", "left": "4", "isLinked": true},
    "typography_font_size": {"unit": "px", "size": 16},
    "padding": {"unit": "px", "top": "12", "right": "30", "bottom": "12", "left": "30", "isLinked": false}
  },
  "elements": []
}
```
Settings: `text`, `link`, `align`, `size` (xs/sm/md/lg/xl), `background_color`, `button_text_color`, `border_radius`

### 5. Image Box Widget
```json
{
  "id": "w005aaaa",
  "elType": "widget",
  "widgetType": "image-box",
  "isInner": false,
  "settings": {
    "image": {"url": "...", "id": 789},
    "image_size": "medium",
    "title_text": "Tiêu đề thẻ",
    "description_text": "Mô tả ngắn cho thẻ này.",
    "link": {"url": "#"},
    "position": "top",
    "title_size": "h3",
    "align": "center"
  },
  "elements": []
}
```

### 6. Icon Box Widget
```json
{
  "id": "w006aaaa",
  "elType": "widget",
  "widgetType": "icon-box",
  "isInner": false,
  "settings": {
    "icon": {"library": "fa-solid", "value": "fas fa-truck"},
    "title_text": "Giao hàng miễn phí",
    "description_text": "Miễn phí vận chuyển toàn quốc",
    "link": {"url": "#"},
    "position": "top",
    "align": "center",
    "primary_color": "#e74c3c"
  },
  "elements": []
}
```

### 7. Video Widget
```json
{
  "id": "w007aaaa",
  "elType": "widget",
  "widgetType": "video",
  "isInner": false,
  "settings": {
    "video_type": "youtube",
    "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "autoplay": "no",
    "mute": "no",
    "loop": "no",
    "controls": "yes",
    "show_image_overlay": "yes",
    "image_overlay": {"url": "...", "id": 123},
    "play_icon": {"value": "fas fa-play-circle", "library": "fa-solid"}
  },
  "elements": []
}
```

### 8. Spacer Widget
```json
{
  "id": "w008aaaa",
  "elType": "widget",
  "widgetType": "spacer",
  "isInner": false,
  "settings": {
    "space": {"unit": "px", "size": 50}
  },
  "elements": []
}
```

### 9. Divider Widget
```json
{
  "id": "w009aaaa",
  "elType": "widget",
  "widgetType": "divider",
  "isInner": false,
  "settings": {
    "style": "solid",
    "weight": {"unit": "px", "size": 1},
    "color": "#e0e0e0",
    "width": {"unit": "%", "size": 100},
    "align": "center"
  },
  "elements": []
}
```

### 10. Icon Widget
```json
{
  "id": "w010aaaa",
  "elType": "widget",
  "widgetType": "icon",
  "isInner": false,
  "settings": {
    "icon": {"library": "fa-solid", "value": "fas fa-star"},
    "align": "center",
    "primary_color": "#f39c12",
    "size": {"unit": "px", "size": 40},
    "link": {"url": "#"}
  },
  "elements": []
}
```

### 11. HTML Widget (use sparingly — non-editable)
```json
{
  "id": "w011aaaa",
  "elType": "widget",
  "widgetType": "html",
  "isInner": false,
  "settings": {
    "html": "<div class='custom-embed'>...</div>"
  },
  "elements": []
}
```

### 12. Testimonial Widget
```json
{
  "id": "w012aaaa",
  "elType": "widget",
  "widgetType": "testimonial",
  "isInner": false,
  "settings": {
    "testimonial_content": "Sản phẩm rất tốt, tôi rất hài lòng!",
    "testimonial_name": "Nguyễn Văn A",
    "testimonial_job": "Khách hàng",
    "testimonial_image": {"url": "...", "id": 111},
    "alignment": "center"
  },
  "elements": []
}
```

---

## COMMON LAYOUT PATTERNS

### Hero Banner (Full-width với overlay text)
```json
{
  "id": "hero0001",
  "elType": "container",
  "isInner": false,
  "settings": {
    "content_width": "full",
    "min_height": {"unit": "vh", "size": 80},
    "align_items": "center",
    "justify_content": "center",
    "flex_direction": "column",
    "background_background": "image",
    "background_image": {"url": "BANNER_URL", "id": 0},
    "background_size": "cover",
    "background_position": "center center",
    "background_overlay_background": "classic",
    "background_overlay_color": "rgba(0,0,0,0.5)"
  },
  "elements": [
    {
      "id": "hero0002",
      "elType": "widget",
      "widgetType": "heading",
      "isInner": false,
      "settings": {
        "title": "Tiêu Đề Chính",
        "header_size": "h1",
        "align": "center",
        "title_color": "#ffffff",
        "typography_font_size": {"unit": "px", "size": 56},
        "typography_font_weight": "700"
      },
      "elements": []
    },
    {
      "id": "hero0003",
      "elType": "widget",
      "widgetType": "button",
      "isInner": false,
      "settings": {
        "text": "Khám phá ngay",
        "link": {"url": "#"},
        "align": "center",
        "background_color": "#e74c3c",
        "button_text_color": "#ffffff"
      },
      "elements": []
    }
  ]
}
```

### 3-Column Card Grid (Icon Box)
```json
{
  "id": "grid0001",
  "elType": "container",
  "isInner": false,
  "settings": {
    "content_width": "boxed",
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "gap": {"unit": "px", "column": 30, "row": 30},
    "padding": {"unit": "px", "top": "60", "right": "20", "bottom": "60", "left": "20", "isLinked": false}
  },
  "elements": [
    {
      "id": "gridcol1",
      "elType": "container",
      "isInner": true,
      "settings": {
        "width": {"unit": "%", "size": 33.33},
        "flex_direction": "column",
        "align_items": "center"
      },
      "elements": [
        { "id": "card001", "elType": "widget", "widgetType": "icon-box", "isInner": false,
          "settings": {"icon": {"library": "fa-solid", "value": "fas fa-truck"}, "title_text": "Giao hàng nhanh", "description_text": "Giao toàn quốc trong 24h", "align": "center"},
          "elements": [] }
      ]
    },
    {
      "id": "gridcol2",
      "elType": "container",
      "isInner": true,
      "settings": {"width": {"unit": "%", "size": 33.33}, "flex_direction": "column", "align_items": "center"},
      "elements": [
        { "id": "card002", "elType": "widget", "widgetType": "icon-box", "isInner": false,
          "settings": {"icon": {"library": "fa-solid", "value": "fas fa-shield-alt"}, "title_text": "Bảo hành chính hãng", "description_text": "Bảo hành 24 tháng", "align": "center"},
          "elements": [] }
      ]
    },
    {
      "id": "gridcol3",
      "elType": "container",
      "isInner": true,
      "settings": {"width": {"unit": "%", "size": 33.33}, "flex_direction": "column", "align_items": "center"},
      "elements": [
        { "id": "card003", "elType": "widget", "widgetType": "icon-box", "isInner": false,
          "settings": {"icon": {"library": "fa-solid", "value": "fas fa-headset"}, "title_text": "Hỗ trợ 24/7", "description_text": "Tư vấn miễn phí mọi lúc", "align": "center"},
          "elements": [] }
      ]
    }
  ]
}
```

### 2-Column: Image Left + Text Right
```json
{
  "id": "twocol01",
  "elType": "container",
  "isInner": false,
  "settings": {
    "content_width": "boxed",
    "flex_direction": "row",
    "flex_wrap": "wrap",
    "align_items": "center",
    "gap": {"unit": "px", "column": 40, "row": 0},
    "padding": {"unit": "px", "top": "60", "right": "20", "bottom": "60", "left": "20", "isLinked": false}
  },
  "elements": [
    {
      "id": "twocol02",
      "elType": "container",
      "isInner": true,
      "settings": {"width": {"unit": "%", "size": 50}},
      "elements": [
        {"id": "img0001", "elType": "widget", "widgetType": "image", "isInner": false,
         "settings": {"image": {"url": "IMAGE_URL", "id": 0}, "image_size": "full"}, "elements": []}
      ]
    },
    {
      "id": "twocol03",
      "elType": "container",
      "isInner": true,
      "settings": {"width": {"unit": "%", "size": 50}, "flex_direction": "column"},
      "elements": [
        {"id": "ttl0001", "elType": "widget", "widgetType": "heading", "isInner": false,
         "settings": {"title": "Tiêu đề phần này", "header_size": "h2"}, "elements": []},
        {"id": "txt0001", "elType": "widget", "widgetType": "text-editor", "isInner": false,
         "settings": {"editor": "<p>Mô tả nội dung chi tiết ở đây.</p>"}, "elements": []},
        {"id": "btn0001", "elType": "widget", "widgetType": "button", "isInner": false,
         "settings": {"text": "Xem thêm", "link": {"url": "#"}}, "elements": []}
      ]
    }
  ]
}
```

---

## ID GENERATION RULE

Every element needs a **unique 8-character hex ID**. Generate them like this:
```python
import random, string
def gen_id():
    return ''.join(random.choices('0123456789abcdef', k=8))
```
Or use sequential IDs: `"sec00001"`, `"col00001"`, `"wdg00001"` — just make sure no two elements share the same ID within a page.

---

## DEPLOYMENT WORKFLOWS

### Method 1: WP-CLI (Preferred)

#### Step 1: Find or create the page
```bash
# Find existing page
wp post list --post_type=page --post_status=publish --fields=ID,post_title,post_name

# Create new page
PAGE_ID=$(wp post create \
  --post_type=page \
  --post_title="Trang Chủ" \
  --post_name="trang-chu" \
  --post_status=publish \
  --porcelain)
echo "Created page ID: $PAGE_ID"
```

#### Step 2: Deploy JSON content
```bash
# Save JSON to temp file, then deploy via PHP
wp eval-file /tmp/deploy-elementor.php
```

**`/tmp/deploy-elementor.php`:**
```php
<?php
$page_id = 123; // replace with actual ID
$json_file = '/tmp/page-content.json';
$json = file_get_contents($json_file);

// Validate JSON
$data = json_decode($json);
if (!$data) {
    echo "ERROR: Invalid JSON\n";
    exit(1);
}

// Save content
update_post_meta($page_id, '_elementor_data', wp_slash($json));
update_post_meta($page_id, '_elementor_edit_mode', 'builder');
update_post_meta($page_id, '_elementor_version', '3.0.0');
update_post_meta($page_id, '_elementor_page_settings', []);

// Flush CSS cache
Elementor\Plugin::instance()->files_manager->clear_cache();

echo "SUCCESS: Page $page_id updated\n";
```

#### Step 3: Flush CSS cache
```bash
wp elementor flush-css
```

### Method 2: MySQL Direct (when WP-CLI fails)

```python
#!/usr/bin/env python3
import subprocess, json, sys

SOCK = subprocess.check_output(
    "find $HOME/Library/Application\\ Support/Local/run -name mysqld.sock 2>/dev/null | head -1",
    shell=True, text=True
).strip()
MYSQL = subprocess.check_output(
    "ls $HOME/Library/Application\\ Support/Local/lightning-services/mysql-*/bin/darwin-arm64/bin/mysql 2>/dev/null | head -1",
    shell=True, text=True
).strip()

PAGE_ID = 123  # replace with actual page ID

with open('/tmp/page-content.json', 'r') as f:
    content = f.read()

# Escape for MySQL
escaped = content.replace('\\', '\\\\').replace("'", "\\'")

def run_sql(sql):
    result = subprocess.run(
        [MYSQL, f'--socket={SOCK}', '-u', 'root', '-proot', 'local', '-e', sql],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}")
        sys.exit(1)
    return result.stdout

# Clear existing elementor meta
run_sql(f"DELETE FROM wp_postmeta WHERE post_id={PAGE_ID} AND meta_key IN ('_elementor_data','_elementor_edit_mode','_elementor_version','_elementor_page_settings')")

# Insert new meta
run_sql(f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ({PAGE_ID}, '_elementor_data', '{escaped}')")
run_sql(f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ({PAGE_ID}, '_elementor_edit_mode', 'builder')")
run_sql(f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ({PAGE_ID}, '_elementor_version', '3.0.0')")
run_sql(f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) VALUES ({PAGE_ID}, '_elementor_page_settings', 'a:0:{{}}')")

# Clear CSS cache
run_sql(f"DELETE FROM wp_options WHERE option_name LIKE '_elementor_global_css%' OR option_name LIKE 'elementor_css_post_{PAGE_ID}'")

print(f"SUCCESS: Page {PAGE_ID} updated via MySQL")
```

### Method 3: WP-CLI Library Import (for Template Library)
```bash
# Import single template JSON to Elementor Library
wp elementor library import /path/to/template.json

# Import all templates in a directory
wp elementor library import-dir /path/to/templates/

# View imported result
wp elementor library import /path/to/template.json --returnType=ids
```

**Note:** `library import` adds template to Elementor **Library** (reusable templates), NOT directly to a page. To apply to a page, use Method 1 or 2.

---

## REQUIRED POST META KEYS

When creating an Elementor page programmatically, ALWAYS set all 4 meta keys:

| Meta Key | Value | Purpose |
|---|---|---|
| `_elementor_data` | JSON string (use `wp_slash()`) | Page layout content |
| `_elementor_edit_mode` | `"builder"` | Flags page as Elementor-built |
| `_elementor_version` | `"3.0.0"` | Elementor version compatibility |
| `_elementor_page_settings` | `[]` or `{}` | Page-level settings |

**If `_elementor_edit_mode` is missing:** The page won't open in Elementor editor — it shows classic WordPress editor instead.

---

## DESIGN-TO-CODE WORKFLOW

### Step 1: Analyze the design
- Identify sections (hero, features, products, footer)
- Count columns per section
- Note background images vs solid colors
- List all text content, buttons, images

### Step 2: Map design to widgets
```
Design element           → Elementor widget
────────────────────────────────────────────
Large title text         → heading (h1/h2)
Body paragraph text      → text-editor
Photo/illustration       → image
CTA button               → button
Feature card w/ icon     → icon-box
Feature card w/ image    → image-box
Horizontal line          → divider
Empty space              → spacer
YouTube/Vimeo video      → video
Third-party embed        → html (last resort)
```

### Step 3: Build section by section
1. Outer container = full-width section with background
2. Inner container = boxed-width content area
3. Column containers = flex children with width %
4. Widgets = leaf nodes inside columns

### Step 4: Get media IDs
```bash
# Find uploaded image IDs
wp media list --fields=ID,post_title,guid | grep "image-name"

# Or search by filename
wp post list --post_type=attachment --search="banner" --fields=ID,guid
```

### Step 5: Deploy and verify
```bash
# Deploy
wp eval-file /tmp/deploy.php

# Flush CSS
wp elementor flush-css

# Verify page loads
curl -s -o /dev/null -w "%{http_code}" "http://miric.local/trang-chu/"
```

---

## RESPONSIVE SETTINGS

Elementor uses breakpoint suffixes for responsive overrides:

| Suffix | Breakpoint | Screen size |
|---|---|---|
| *(none)* | Desktop | > 1024px |
| `_tablet` | Tablet | 768px–1024px |
| `_mobile` | Mobile | < 768px |

Example responsive padding:
```json
{
  "padding": {"unit": "px", "top": "80", "right": "20", "bottom": "80", "left": "20", "isLinked": false},
  "padding_tablet": {"unit": "px", "top": "50", "right": "15", "bottom": "50", "left": "15", "isLinked": false},
  "padding_mobile": {"unit": "px", "top": "30", "right": "12", "bottom": "30", "left": "12", "isLinked": false}
}
```

Example responsive font size:
```json
{
  "typography_font_size": {"unit": "px", "size": 48},
  "typography_font_size_tablet": {"unit": "px", "size": 36},
  "typography_font_size_mobile": {"unit": "px", "size": 28}
}
```

Example hide on mobile:
```json
{
  "hide_mobile": "yes"
}
```

---

## COMMON ERRORS & FIXES

| Error | Cause | Fix |
|---|---|---|
| Page opens in classic editor | `_elementor_edit_mode` not set to `"builder"` | Add meta key |
| Blank page / no content | Invalid JSON syntax | Validate with `python3 -m json.tool file.json` |
| Styles not updating | CSS cache not cleared | `wp elementor flush-css` |
| Images not showing | Wrong image ID | Re-check with `wp media list` |
| `wp elementor` not found | Elementor not active | `wp plugin activate elementor` |
| JSON too large for MySQL field | Content too complex | Use `LONGTEXT` column (wp_postmeta.meta_value is already LONGTEXT by default) |
| Special characters breaking SQL | Single quotes in text | Always use Python escape or `wp eval-file` instead |

---

## ELEMENTOR CLI REFERENCE

```bash
# System info
wp elementor system-info

# Flush CSS cache (run after every programmatic update)
wp elementor flush-css

# Update database after Elementor version upgrade
wp elementor update-db

# Library operations
wp elementor library import <file.json>
wp elementor library import-dir <directory/>
wp elementor library sync

# Kit (full site design package)
wp elementor kit import <file.zip>
wp elementor kit export <output.zip>

# Experiments (feature flags)
wp elementor experiments status <experiment-name>
wp elementor experiments activate <experiment-name>
wp elementor experiments deactivate <experiment-name>

# URL replacement
wp elementor replace-urls <old-url> <new-url>

# License (Pro)
wp elementor-pro license activate <license-key>
```

---

## FONT AWESOME ICON REFERENCE

Common icons for Vietnamese e-commerce sites:

| Use case | Icon class |
|---|---|
| Shipping | `fas fa-truck` |
| Warranty | `fas fa-shield-alt` |
| Support | `fas fa-headset` |
| Star rating | `fas fa-star` |
| Phone | `fas fa-phone` |
| Location | `fas fa-map-marker-alt` |
| Email | `fas fa-envelope` |
| Cart | `fas fa-shopping-cart` |
| Heart / Favorite | `fas fa-heart` |
| Check / Verified | `fas fa-check-circle` |
| Video play | `fas fa-play-circle` |
| Quote | `fas fa-quote-left` |
| Gift | `fas fa-gift` |
| Tag / Price | `fas fa-tag` |

Format in JSON: `{"library": "fa-solid", "value": "fas fa-truck"}`

---

## COMPLETE EXAMPLE: Simple Homepage

```json
{
  "title": "Trang Chủ",
  "type": "page",
  "version": "0.4",
  "page_settings": [],
  "content": [
    {
      "id": "hero0001",
      "elType": "container",
      "isInner": false,
      "settings": {
        "content_width": "full",
        "min_height": {"unit": "vh", "size": 70},
        "align_items": "center",
        "justify_content": "center",
        "flex_direction": "column",
        "background_background": "image",
        "background_image": {"url": "BANNER_IMAGE_URL", "id": 0},
        "background_size": "cover",
        "background_position": "center center",
        "background_overlay_background": "classic",
        "background_overlay_color": "rgba(0,0,0,0.5)"
      },
      "elements": [
        {
          "id": "hero0002",
          "elType": "widget",
          "widgetType": "heading",
          "isInner": false,
          "settings": {
            "title": "Chào Mừng Đến Với Chúng Tôi",
            "header_size": "h1",
            "align": "center",
            "title_color": "#ffffff",
            "typography_font_size": {"unit": "px", "size": 52},
            "typography_font_size_mobile": {"unit": "px", "size": 30},
            "typography_font_weight": "700"
          },
          "elements": []
        },
        {
          "id": "hero0003",
          "elType": "widget",
          "widgetType": "button",
          "isInner": false,
          "settings": {
            "text": "Xem sản phẩm",
            "link": {"url": "#", "is_external": false},
            "align": "center",
            "background_color": "#e74c3c",
            "button_text_color": "#ffffff",
            "border_radius": {"unit": "px", "top": "4", "right": "4", "bottom": "4", "left": "4", "isLinked": true}
          },
          "elements": []
        }
      ]
    },
    {
      "id": "feat0001",
      "elType": "container",
      "isInner": false,
      "settings": {
        "content_width": "boxed",
        "flex_direction": "row",
        "flex_wrap": "wrap",
        "gap": {"unit": "px", "column": 30, "row": 30},
        "padding": {"unit": "px", "top": "60", "right": "20", "bottom": "60", "left": "20", "isLinked": false},
        "background_background": "classic",
        "background_color": "#f8f8f8"
      },
      "elements": [
        {
          "id": "feat0002",
          "elType": "container",
          "isInner": true,
          "settings": {"width": {"unit": "%", "size": 33.33}},
          "elements": [
            {
              "id": "feat0003",
              "elType": "widget",
              "widgetType": "icon-box",
              "isInner": false,
              "settings": {
                "icon": {"library": "fa-solid", "value": "fas fa-truck"},
                "title_text": "Giao Hàng Nhanh",
                "description_text": "Giao hàng toàn quốc trong 24h",
                "align": "center",
                "primary_color": "#e74c3c"
              },
              "elements": []
            }
          ]
        },
        {
          "id": "feat0004",
          "elType": "container",
          "isInner": true,
          "settings": {"width": {"unit": "%", "size": 33.33}},
          "elements": [
            {
              "id": "feat0005",
              "elType": "widget",
              "widgetType": "icon-box",
              "isInner": false,
              "settings": {
                "icon": {"library": "fa-solid", "value": "fas fa-shield-alt"},
                "title_text": "Bảo Hành Chính Hãng",
                "description_text": "Bảo hành 24 tháng toàn quốc",
                "align": "center",
                "primary_color": "#e74c3c"
              },
              "elements": []
            }
          ]
        },
        {
          "id": "feat0006",
          "elType": "container",
          "isInner": true,
          "settings": {"width": {"unit": "%", "size": 33.33}},
          "elements": [
            {
              "id": "feat0007",
              "elType": "widget",
              "widgetType": "icon-box",
              "isInner": false,
              "settings": {
                "icon": {"library": "fa-solid", "value": "fas fa-headset"},
                "title_text": "Hỗ Trợ 24/7",
                "description_text": "Tư vấn miễn phí mọi lúc mọi nơi",
                "align": "center",
                "primary_color": "#e74c3c"
              },
              "elements": []
            }
          ]
        }
      ]
    }
  ]
}
```
