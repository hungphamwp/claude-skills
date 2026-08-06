# Native Shortcode Catalog: Complete Reference for Flatsome

This catalog serves as the absolute source of truth for creating pixel-perfect, 100% native WordPress Flatsome layouts that clients can seamlessly edit inside UX Builder without touching code.

---

## 1. Grid & Layout System

### `[section]`
The fundamental building block. Represents a full-width background section of a page.
*   **Key Attributes:**
    *   `bg_color`: Background color (hex or theme color names).
    *   `bg`: Media Library Image ID for the background.
    *   `bg_overlay`: RGBA overlay color (e.g., `rgba(0,0,0,0.55)`). Supports mobile and tablet overrides with `bg_overlay__sm` and `bg_overlay__md`.
    *   `padding`: Top and bottom padding (e.g., `80px 0`). Essential to set `padding__sm` (mobile) and `padding__md` (tablet) for responsive spacing.
    *   `margin`: Outer spacing.
    *   `height`: Min-height (e.g., `600px`).
    *   `dark`: Set to `true` to automatically change child text elements to white/light.
    *   `class`: Custom CSS class for scoped styling.
*   **Gotchas & Pro Tips:**
    *   *Section ID Bug:* Using `id="my-id"` inside `[section]` is overridden by Flatsome. To link anchor links, inject an anchor div via JS, or place a `[scroll_to title="id-name"]` shortcode at the top of the section.

```wordpress
[section bg_color="#f8fafc" padding="80px 0" padding__sm="40px 0" class="hm-section-services"]
  [row]
    [col span="12"] ... [/col]
  [/row]
[/section]
```

---

### `[row]`
The horizontal grid container. Rows must contain columns.
*   **Key Attributes:**
    *   `style`: Spacing between columns. Options: `collapse` (0px gap), `small` (10px gap), `normal` (30px gap), `large` (40px gap).
    *   `v_align`: Vertical alignment. Options: `top`, `middle`, `bottom`, `equal` (makes all column backgrounds equal height - crucial for card layouts).
    *   `h_align`: Horizontal alignment. Options: `left`, `center`, `right`.
    *   `col_style`: Styles columns collectively. Options: `default`, `solid` (adds white bg, shadow, padding), `dashed`, `shade`.
    *   `col_bg`: Background color applied to all child columns.
    *   `depth`: Global shadow depth (1-5) for columns.
    *   `depth_hover`: Global shadow depth on hover (1-5).
*   **Gotchas & Pro Tips:**
    *   Always use `v_align="equal"` for grid card layouts (like services or team grids) so columns stretch to match the tallest item automatically.

```wordpress
[row style="normal" v_align="equal" h_align="center"]
  [col span="4"] ... [/col]
[/row]
```

---

### `[col]`
The grid column. Standard layout is based on a 12-column grid.
*   **Key Attributes:**
    *   `span`: Width of column on desktop (1 to 12).
    *   `span__md`: Width on tablet (849px and down). Defaults to desktop span.
    *   `span__sm`: Width on mobile (549px and down). Defaults to `12` (full width).
    *   `align`: Alignment of child elements. Options: `left`, `center`, `right`. Supports responsive overrides: `align__md`, `align__sm`.
    *   `bg_color`: Custom background color of this specific column.
    *   `bg_radius`: Border radius in pixels (e.g., `12` for elegant rounded corners).
    *   `depth`: Box shadow depth (1 to 5).
    *   `depth_hover`: Box shadow depth on hover (1 to 5).
    *   `padding`: Inner padding (e.g., `30px 30px 30px 30px`).
    *   `margin`: Outer margin.
    *   `animate`: Animations. Options: `fadeInUp`, `fadeInDown`, `bounceIn`, etc.
    *   `animate_delay`: Delay in milliseconds.
*   **Nesting Rule:**
    *   Never nest `[row]` inside `[col]` directly. Instead, nest `[row_inner]` and `[col_inner]`.

```wordpress
[col span="4" span__md="6" span__sm="12" bg_color="#ffffff" bg_radius="12" depth="1" depth_hover="3" padding="40px 30px 40px 30px" animate="fadeInUp"]
  [ux_text] ... [/ux_text]
[/col]
```

---

### `[gap]`
Provides clean, visual vertical spacing.
*   **Key Attributes:**
    *   `height`: Vertical height in pixels (e.g., `20px`). Supports responsive overrides: `height__md`, `height__sm`.
*   **Gotchas & Pro Tips:**
    *   Avoid using raw HTML `<br>` or `<div style="height:...">` blocks. `[gap]` is natively editable via drag-to-resize inside UX Builder.

```wordpress
[gap height="30px" height__sm="15px"]
```

---

## 2. Text & Typography

### `[ux_text]`
The primary text block. Replaces raw paragraph and heading tags.
*   **Key Attributes:**
    *   `font_size`: Text font size (e.g., `1.25` or custom viewport sizes). Supports responsive overrides: `font_size__md`, `font_size__sm`.
    *   `text_align`: Text alignment. Options: `left`, `center`, `right`. Supports responsive overrides: `text_align__md`, `text_align__sm`.
    *   `text_color`: Text color (hex or theme color names).
    *   `class`: Class for custom styling.
*   **Pro Tip for Titles:**
    *   Avoid using the default `[title]` shortcode for custom layouts as it can be restrictive. Instead, wrap semantic HTML tags directly inside a single `[ux_text]` block.

```wordpress
[ux_text text_align="center" font_size="1.2"]
  <h2 class="hm-section-title">Dịch Vụ Chuyên Nghiệp</h2>
  <p class="hm-section-desc">Giải pháp marketing toàn diện của chúng tôi giúp doanh nghiệp đột phá doanh thu số.</p>
[/ux_text]
```

---

### `[title]`
Used for standard section headers with built-in dividing lines.
*   **Key Attributes:**
    *   `text`: Main title text.
    *   `sub_text`: Smaller subtitle text.
    *   `style`: Divider style. Options: `normal`, `center`, `bold`, `bold-center`, `arrow`.
    *   `size`: Font size scale (e.g., `85`, `100`, `120`).

```wordpress
[title text="Về Chúng Tôi" sub_text="Đội ngũ chuyên nghiệp cam kết đồng hành" style="bold-center"]
```

---

## 3. Banner & Rich Imagery

### `[ux_banner]`
A premium background element supporting text layers, overlays, and video backgrounds.
*   **Key Attributes:**
    *   `bg`: Background image ID.
    *   `height`: Banner height (e.g., `650px`). Supports responsive overrides: `height__md`, `height__sm`.
    *   `bg_color`: Background color when image is loading.
    *   `bg_overlay`: RGBA overlay color (e.g., `rgba(15,23,42,0.65)` for dark overlays).
    *   `bg_pos`: Background alignment (e.g., `50% 50%`).
    *   `parallax`: Parallax depth (0 to 10).
    *   `dark`: Set to `true` to change child text colors to white/light.
    *   `border_radius`: Banner border radius (e.g., `16px`).
    *   `video_mp4`/`video_webm`/`youtube`: Path to background video files or YouTube URL.
*   **Gotchas & Pro Tips:**
    *   Banners render in CSS with class `.banner` (not `.ux-banner`). Make sure child theme selectors target `.banner`.

```wordpress
[ux_banner bg="102" height="600px" height__sm="450px" bg_overlay="rgba(15,23,42,0.55)" dark="true" class="hm-hero-banner"]
  [text_box width="60" width__sm="90" position_x="50" position_y="50" text_align="center"]
    ...
  [/text_box]
[/ux_banner]
```

---

### `[text_box]`
Positioned layer container that lives strictly inside `[ux_banner]`.
*   **Key Attributes:**
    *   `position_x`: Horizontal position (0 to 100). `50` is centered. Supports `position_x__sm` (mobile).
    *   `position_y`: Vertical position (0 to 100). `50` is centered. Supports `position_y__sm` (mobile).
    *   `width`: Box width in percentage (e.g., `65`). Supports `width__sm` (mobile).
    *   `text_align`: Content text alignment. Options: `left`, `center`, `right`.
    *   `padding`: Inner padding of the box.
    *   `bg`: Optional background color for a glass/card effect.
    *   `depth`: Box shadow depth (1 to 5).
    *   `animate`: Animations (e.g., `fadeInUp`).

```wordpress
[text_box width="70" width__sm="95" position_x="50" position_y="50" text_align="center" animate="fadeInUp"]
  [ux_text]
    <h1 class="hm-hero-title">Đột Phá Doanh Thu Cùng HMarketing</h1>
  [/ux_text]
  [button text="Liên Hệ Ngay" size="large" radius="99"]
[/text_box]
```

---

### `[ux_image]`
High-performance image handler supporting hover effects, lightbox, and animations.
*   **Key Attributes:**
    *   `id`: Media Library Image ID.
    *   `width`: Image width in percentage (e.g., `80%`).
    *   `height`: Aspect ratio crop height (e.g., `56.25%` for 16:9).
    *   `bg_radius`: Border radius.
    *   `lightbox`: Set to `true` to enable click-to-zoom in a lightbox overlay.
    *   `image_overlay`: Colored overlay on the image.
    *   `image_hover`: Hover effect. Options: `zoom`, `glow`, `blur`, `fade-in`.
    *   `depth`: Box shadow depth (1 to 5).
    *   `depth_hover`: Box shadow depth on hover.

```wordpress
[ux_image id="204" width="100%" bg_radius="16" depth="2" depth_hover="4" image_hover="zoom"]
```

---

## 4. Interactive Components

### `[button]`
Interactive CTA.
*   **Key Attributes:**
    *   `text`: Button text.
    *   `style`: Button design. Options: `primary` (solid), `outline` (transparent with border), `link` (underline link), `shade` (soft gradient shadow), `bevel` (3D effect).
    *   `color`: Accent color. Options: `primary` (theme primary), `secondary`, `white`, `success` (green), `alert` (red), or custom hex codes.
    *   `size`: Button size. Options: `xsmall`, `small`, `medium`, `large`, `xlarge`.
    *   `radius`: Border radius in pixels (e.g., `99` for fully rounded pill button).
    *   `expand`: Set to `true` to make the button take up full available width.
    *   `icon`: FontAwesome class or built-in icon (e.g., `icon-phone`, `icon-envelope`).
    *   `icon_pos`: Icon positioning. Options: `left`, `right`.
    *   `link`: Target URL.
    *   `target`: Set to `_blank` to open in a new tab.

```wordpress
[button text="Nhận Tư Vấn Miễn Phí" style="primary" color="secondary" size="large" radius="99" icon="icon-phone" icon_pos="left" link="/lien-he/"]
```

---

### `[testimonial]`
Clean testimonial component with built-in rating stars.
*   **Key Attributes:**
    *   `name`: Client name.
    *   `company`: Client company/designation.
    *   `stars`: Star rating scale (0 to 5, defaults to 5).
    *   `image`: Media Library ID for the avatar.
    *   `image_width`: Avatar width in pixels (e.g., `60`).
    *   `pos`: Placement of the avatar. Options: `left`, `center`, `right`, `top`.
    *   `font_size`: Font size scale (e.g., `medium`, `large`).

```wordpress
[testimonial image="255" image_width="60" pos="left" name="Nguyễn Văn A" company="CEO, ABC Tech" stars="5"]
  Dịch vụ của HMarketing rất tuyệt vời, giúp doanh thu của chúng tôi tăng gấp đôi chỉ sau 6 tháng hợp tác!
[/testimonial]
```

---

### `[accordion]` & `[accordion-item]`
Standard collapsible panels. Essential for FAQs.
*   **Key Attributes:**
    *   `auto_open`: Set to `true` or a specific item index to expand automatically on load.
    *   `title`: (Inside `[accordion-item]`) Panel heading text.
    *   `id`: Specific element ID for linking.

```wordpress
[accordion auto_open="1" class="hm-faq-accordion"]
  [accordion-item title="Quy trình SEO mất bao lâu để thấy kết quả?"]
    [ux_text]
      <p>Thời gian tối ưu hóa SEO thường mất từ 3 đến 6 tháng để các từ khóa cạnh tranh đạt được thứ hạng bền vững trên Google.</p>
    [/ux_text]
  [/accordion-item]
  [accordion-item title="Chi phí dịch vụ được tính thế nào?"]
    [ux_text]
      <p>Chi phí được thiết kế linh hoạt dựa trên ngân sách và mục tiêu tăng trưởng cụ thể của từng doanh nghiệp.</p>
    [/ux_text]
  [/accordion-item]
[/accordion]
```

---

### `[tabgroup]` & `[tab]`
Horizontal and vertical tab content switchers.
*   **Key Attributes:**
    *   `style`: Nav style. Options: `line` (clean underlines), `tabs` (bordered boxes), `pills` (rounded capsules).
    *   `align`: Alignment of tab headers. Options: `left`, `center`, `right`.
    *   `type`: Layout format. Options: `horizontal`, `vertical`.
    *   `title`: (Inside `[tab]`) Label of the tab.
*   **Gotchas & Pro Tips:**
    *   *HiddenPanel Bug:* By default, inactive tab panels in Flatsome may still reserve physical layout height in some browsers. To fix, always apply the following CSS to the child theme `style.css`:
    ```css
    .panel:not(.active) {
        height: 0 !important; min-height: 0 !important;
        overflow: hidden !important; padding: 0 !important;
        margin: 0 !important; opacity: 0;
    }
    ```

```wordpress
[tabgroup style="pills" align="center"]
  [tab title="Chiến Lược SEO"]
    [ux_text] ... [/ux_text]
  [/tab]
  [tab title="Quảng Cáo Google"]
    [ux_text] ... [/ux_text]
  [/tab]
[/tabgroup]
```

---

### `[ux_price_table]` & `[bullet_item]`
Traditional styled columns for comparisons and plans.
*   **Key Attributes:**
    *   `title`: Plan title (e.g., `Gói Cơ Bản`).
    *   `price`: Pricing display text (e.g., `5.000.000đ`).
    *   `description`: Frequency or short subtitle (e.g., `/ tháng`).
    *   `featured`: Set to `true` to highlight the package (scales slightly larger, adds color accents).
    *   `bg_color`: Column background color.
    *   `depth`/`depth_hover`: Box shadow states.
    *   `enabled`: (Inside `[bullet_item]`) Set to `true`/`false` to toggle active checkmark/cross.

```wordpress
[ux_price_table title="Gói Tăng Tốc" price="12.000.000đ" description="/ tháng" featured="true" bg_color="#ffffff" depth="2" depth_hover="4" class="hm-pricing-featured"]
  [bullet_item text="SEO website nâng cao" enabled="true"]
  [bullet_item text="Quản lý 3 kênh Social Media" enabled="true"]
  [bullet_item text="Tối ưu quảng cáo Google" enabled="true"]
  [bullet_item text="Báo cáo hàng tuần" enabled="true"]
  [bullet_item text="Dedicated Account Manager" enabled="false"]
  [button text="Đăng Ký Ngay" style="primary" size="medium" radius="99" expand="true"]
[/ux_price_table]
```

---

### `[ux_slider]`
Flickity-powered carousel supporting arrows, pagination bullets, and dragging.
*   **Key Attributes:**
    *   `type`: Transition effect. Options: `slide`, `fade`.
    *   `timer`: Interval in milliseconds (default `6000`).
    *   `arrows`: Set to `false` to hide previous/next buttons.
    *   `bullets`: Set to `false` to hide bottom pagination indicators.
    *   `nav_color`: Navigation element styling. Options: `light` (white icons), `dark` (dark gray icons).
    *   `columns`: Columns shown at once. Supports tablet/mobile options: `columns__md`, `columns__sm`.

```wordpress
[ux_slider type="slide" timer="5000" arrows="true" bullets="true" nav_color="dark"]
  [ux_banner bg="301" height="500px"] ... [/ux_banner]
  [ux_banner bg="302" height="500px"] ... [/ux_banner]
[/ux_slider]
```

---

### `[lightbox]`
A modal popup window that remains hidden until triggered by an anchor link.
*   **Key Attributes:**
    *   `id`: Anchor link match string. A button with `link="#my-popup"` will open a lightbox with `id="my-popup"`.
    *   `width`: Maximum width in pixels (e.g., `650px`).
    *   `padding`: Inner padding.
    *   `auto_open`: Set to `true` to display immediately on page load.
    *   `auto_timer`: Opening delay on page load in milliseconds.
    *   `auto_show`: Controls recurrence. Options: `always`, `once` (saves a cookie for returning visitors).

```wordpress
[button text="Đăng Ký Tư Vấn" link="#reg-popup" size="large" radius="99"]

[lightbox id="reg-popup" width="600px" padding="30px"]
  [ux_text text_align="center"]
    <h3>Gửi thông tin liên hệ</h3>
  [/ux_text]
  [contact-form-7 id="12" title="Form Liên Hệ Popup"]
[/lightbox]
```

---

### `[map]`
Google maps embedding tool.
*   **Key Attributes:**
    *   `address`: Exact textual address to locate (e.g., `123 Nguyễn Huệ, Quận 1, TP.HCM`).
    *   `height`: Map height in pixels or percentage.
    *   `zoom`: Map focus scale (1 to 20, default is 15).

```wordpress
[map address="123 Nguyễn Huệ, Quận 1, TP. HCM" height="400px" zoom="16"]
```
