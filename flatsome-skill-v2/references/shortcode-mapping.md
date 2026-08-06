# Shortcode Mapping: HTML → Flatsome

> This reference maps common HTML patterns to their Flatsome UX Builder shortcode equivalents. Use this when converting static HTML to Approach A (UX Builder shortcodes).

## Layout shortcodes

### Section wrapper

**HTML:**
```html
<section class="my-section" style="background:#f7f8fc; padding:5rem 5%;">
  ...
</section>
```

**Flatsome shortcode:**
```
[section bg_color="#f7f8fc" padding="80px 5%" class="my-section"]
  ...
[/section]
```

**Key attributes:**
| Attribute | Description | Example |
|-----------|-------------|---------|
| `bg_color` | Background color | `"#f7f8fc"` |
| `bg` | Background image ID | `"1234"` |
| `bg_overlay` | Overlay color with opacity | `"rgba(0,0,0,0.5)"` |
| `padding` | Section padding | `"80px 0px"` |
| `padding__md` | Tablet padding | `"40px 0px"` |
| `padding__sm` | Mobile padding | `"30px 0px"` |
| `class` | Custom CSS class | `"my-custom-section"` |
| `dark` | Dark mode (light text) | `"true"` |
| `visibility` | Responsive visibility | `"hide-for-small"` |

### Row (grid container)

**HTML:**
```html
<div class="grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem;">
  ...
</div>
```

**Flatsome shortcode:**
```
[row style="small" col_style="solid" col_bg="#fff" depth="1" depth_hover="3"]
  [col span="3" span__md="6" span__sm="12"] ... [/col]
  [col span="3" span__md="6" span__sm="12"] ... [/col]
  [col span="3" span__md="6" span__sm="12"] ... [/col]
  [col span="3" span__md="6" span__sm="12"] ... [/col]
[/row]
```

**Row attributes:**
| Attribute | Description | Example |
|-----------|-------------|---------|
| `style` | Gap size: `collapse`, `small`, `large` | `"small"` |
| `col_style` | Column style: `default`, `solid`, `dashed`, `shade` | `"solid"` |
| `col_bg` | Column background color | `"#fff"` |
| `depth` | Box shadow depth (0-5) | `"1"` |
| `depth_hover` | Shadow on hover (0-5) | `"3"` |
| `h_align` | Horizontal align: `left`, `center`, `right` | `"center"` |
| `v_align` | Vertical align: `top`, `middle`, `bottom`, `equal` | `"equal"` |

**Column span system** (12-grid):
| `span` | Width | Common use |
|--------|-------|------------|
| `12` | 100% | Full width |
| `9` | 75% | Content area |
| `8` | 66.6% | Two-thirds |
| `6` | 50% | Half |
| `4` | 33.3% | One-third |
| `3` | 25% | One-quarter |

Responsive variants: `span__md` (tablet ≤849px), `span__sm` (mobile ≤549px)

### Gap / Spacer

**HTML:**
```html
<div style="height:2rem;"></div>
```

**Flatsome:**
```
[gap height="30px" height__md="20px" height__sm="15px"]
```

### Divider

**HTML:**
```html
<hr style="border-color:#e2e8f0;">
```

**Flatsome:**
```
[divider color="#e2e8f0" width="100%" margin="1rem"]
```

### Section Title with Decoration (Red Triangle)

**HTML:**
```html
<div class="mvl-section-header">
  <h2 class="mvl-section-title">DỰ ÁN Tâm Điểm</h2>
</div>
```

**Flatsome:**
```
[ux_text text_align="center"]
<div class="mvl-section-header">
  <h2 class="mvl-section-title">DỰ ÁN Tâm Điểm</h2>
</div>
[/ux_text]
```
*(Style `.mvl-section-title::after` in `style.css` to create the decorative triangle)*

---

## Content shortcodes

### Banner / Hero section

**HTML:**
```html
<section class="hero" style="min-height:90vh; background:linear-gradient(...);">
  <h1>Title</h1>
  <p>Subtitle</p>
  <button>CTA</button>
</section>
```

**Flatsome shortcode:**
```
[ux_banner height="90vh" bg_color="#f0f7ff" class="hero-section"]
  [text_box position_x="50" position_y="50" text_align="center"]
    <p class="hero-tag">Badge text</p>
    [ux_text font_size="3" font_size__md="2.2" font_size__sm="1.8" text_align="center"]
      <h1>Title with <em>highlight</em></h1>
    [/ux_text]
    <p class="hero-sub">Subtitle text</p>
    [button text="CTA" style="primary" size="large" link="#"]
  [/text_box]
[/ux_banner]
```

**Banner attributes:**
| Attribute | Description | Example |
|-----------|-------------|---------|
| `height` | Height (px, vh, %) | `"90vh"` |
| `height__md` | Tablet height | `"60vh"` |
| `bg` | Background image ID | `"1234"` |
| `bg_size` | `cover`, `contain`, `original` | `"cover"` |
| `bg_color` | Background color | `"#1a1a2e"` |
| `bg_overlay` | Color overlay | `"rgba(0,0,0,0.4)"` |
| `bg_pos` | Background position | `"50% 50%"` |
| `parallax` | Parallax depth (0-10) | `"3"` |
| `video_mp4` | Background video URL | `"video.mp4"` |

**Text box attributes:**
| Attribute | Description | Example |
|-----------|-------------|---------|
| `position_x` | Horizontal position (0-100) | `"50"` |
| `position_y` | Vertical position (0-100) | `"50"` |
| `text_align` | `left`, `center`, `right` | `"center"` |
| `width` | Max width (%) | `"60"` |
| `width__md` | Tablet width | `"80"` |
| `animate` | Animation type | `"fadeInUp"` |

### Buttons

**HTML:**
```html
<button class="btn-primary">Click me</button>
<a href="#" class="btn-outline">Learn more</a>
```

**Flatsome:**
```
[button text="Click me" style="primary" size="large" radius="8" link="#" icon="icon-angle-right"]
[button text="Learn more" style="outline" size="large" radius="8" link="#"]
```

**Button attributes:**
| Attribute | Description | Values |
|-----------|-------------|--------|
| `text` | Button label | Any text |
| `style` | Style variant | `primary`, `secondary`, `outline`, `link`, `shade`, `bevel` |
| `size` | Size | `xsmall`, `small`, `medium`, `large`, `xlarge` |
| `color` | Custom color | `"#2563eb"` |
| `radius` | Border radius | `"8"` (px), `"99"` (pill) |
| `icon` | Flatsome icon class | `"icon-angle-right"` |
| `icon_pos` | Icon position | `"left"`, `"right"` |
| `link` | URL | `"#contact"` |
| `target` | Link target | `"_blank"` |

### Icon Box (⚠️ Flatsome uses `[featured_box]`, NOT `[icon_box]`)

**HTML:**
```html
<div class="service-card">
  <img src="icon.svg" alt="Service">
  <h3>Title</h3>
  <p>Description</p>
</div>
```

**Flatsome shortcode** (requires image from Media Library):
```
[featured_box img="MEDIA_ID" img_width="60" title="Title" pos="top" icon_color="#2563eb"]
  Description text
[/featured_box]
```

> ⚠️ **WARNING**: `[featured_box]` uses `img` attribute which requires a **WordPress Media Library image ID** (integer). It does NOT accept icon font classes like `fa-globe` or `icon-globe`.
>
> **If your design uses Font Awesome icons**, use custom HTML cards inside `[col]` instead:
> ```
> [col span="3" span__md="6" span__sm="12"]
>   <div class="hpb-card">
>     <div class="hpb-card-icon hpb-card-icon--blue"><i class="fa-solid fa-globe"></i></div>
>     <h3>Title</h3>
>     <p>Description</p>
>   </div>
> [/col]
> ```
> Then style `.hpb-card` in `style.css`.

### Testimonial

**HTML:**
```html
<div class="testimonial-card">
  <div class="stars">★★★★★</div>
  <p>"Great service!"</p>
  <div class="author">John Doe, CEO</div>
</div>
```

**Flatsome:**
```
[testimonial image="1234" image_width="60" name="John Doe" company="CEO" stars="5"]
  Great service!
[/testimonial]
```

---

## Complex patterns

### Cards grid (services, features)

When Flatsome's built-in shortcodes can't replicate the exact card design, use **raw HTML inside columns** with custom CSS:

```
[section class="svc-section" padding="80px 5%"]
  [ux_text text_align="left"]
    <div class="section-tag"><i class="fa-solid fa-grip"></i> Services</div>
    <h2 class="section-title">Our <span>Services</span></h2>
    <p class="section-sub">Description text</p>
  [/ux_text]
  [gap height="30px"]
  [row style="small"]
    [col span="3" span__md="6" span__sm="12" class="svc-col"]
      <div class="svc-card">
        <div class="svc-icon blue"><i class="fa-solid fa-globe"></i></div>
        <h3>Service 1</h3>
        <p>Description</p>
      </div>
    [/col]
    [col span="3" span__md="6" span__sm="12" class="svc-col"]
      <div class="svc-card">
        <div class="svc-icon teal"><i class="fa-solid fa-bullseye"></i></div>
        <h3>Service 2</h3>
        <p>Description</p>
      </div>
    [/col]
  [/row]
[/section]
```

The card styling (`.svc-card`) goes in the child theme's `style.css`.

### Stats bar

```
[section bg_color="#fff" padding="0" class="stats-section"]
  [row style="collapse" v_align="equal"]
    [col span="3" span__md="6" span__sm="6" class="stat-col"]
      <div class="stat-item">
        <div class="stat-icon"><i class="fa-solid fa-briefcase"></i></div>
        <div class="stat-num">200+</div>
        <div class="stat-label">Projects</div>
      </div>
    [/col]
    <!-- repeat for each stat -->
  [/row]
[/section]
```

### Tabbed content / Process steps

Flatsome has `[tabgroup]` and `[tab]` shortcodes, but for custom-styled process steps, raw HTML with custom CSS in columns works better:

```
[section class="process-section" bg_color="#f7f8fc" padding="80px 5%"]
  [row style="small"]
    [col span="3" span__md="6" span__sm="12"]
      <div class="step active">
        <div class="step-num">01</div>
        <h4>Step Title</h4>
        <p>Description</p>
      </div>
    [/col]
  [/row]
[/section]
```

---

## Dynamic Filtering Patterns (Advanced)

### Portfolio Grid with Dual Filters (Category + Location)

**HTML Overview:**
A row of buttons (Category) + a Dropdown (Location) that filter a 3-column project grid.

**PHP Shortcode Definition (`functions.php` / `inc/hpb-portfolio.php`):**
Register taxonomies `du-an-cat` and `du-an-loc`. The shortcode must read these parameters from the URL and apply them to a `tax_query`.

**UX Builder Layout (Optimized):**
```
[section class="mvl-latest-projects"]
  [row]
    [col span="12"]
      [ux_text text_align="center"] <h2>DỰ ÁN MỚI NHẤT</h2> [/ux_text]
      [ux_html]
        <div class="mvl-filters" id="mvl-project-filters">
           <a href="?du-an-cat=all#mvl-project-filters" class="mvl-filter-btn" data-cat="all">Tất cả</a>
           ...
           <select id="mvl-location-select" class="mvl-filter-select">
             <option value="all">Khu vực</option>
             <option value="ha-noi">Hà Nội</option>
           </select>
        </div>
      [/ux_html]
    [/col]
  [/row]
  [hpb_portfolio_grid posts="6" columns="3"]
[/section]
```

**Key Learnings for Spacing & Logic:**
1. **WPCode Lite Integration:** Moving JavaScript for filter logic (URL management, select syncing) to WPCode Lite (footer) ensures the UX Builder remains clean and performant.
2. **Negative Margin:** If Flatsome's row logic adds unwanted top margin between the filter bar and grid, use `style="margin-top: -15px !important;"` on the shortcode's root element.

---

## Pattern: Modular Partner Logo Grid

Preferred structure for "Khách hàng & Đối tác" sections to ensure professional layout and client usability.

**UX Builder Structure:**
```
[section bg_color="#fff" padding="60px 0" class="mvl-partners-section"]
  [row slider="true" col_style="solid" v_align="middle" h_align="center"]
    [col span="2" span__sm="6"]
       [ux_image id="ID" image_size="original"]
    [/col]
    [col span="2" span__sm="6"]
       [ux_image id="ID" image_size="original"]
    [/col]
    ...
  [/row]
[/section]
```

**Rule:** Always use individual `[col]` elements for each logo. Avoid monolithic text blocks or `[logo_slider]` if precise control and drag-and-drop capability are required.


---

## Flatsome built-in icon reference

Common Flatsome icons to map from Font Awesome:

| Font Awesome | Flatsome Icon |
|-------------|---------------|
| `fa-globe` | `icon-globe` |
| `fa-heart` | `icon-heart` |
| `fa-star` | `icon-star` |
| `fa-phone` | `icon-phone` |
| `fa-envelope` | `icon-envelop` |
| `fa-shopping-cart` | `icon-shopping-cart` |
| `fa-check` | `icon-check` |
| `fa-arrow-right` | `icon-angle-right` |
| `fa-map-marker` | `icon-map-pin` |
| `fa-user` | `icon-user` |
| `fa-cog` | `icon-cog` |
| `fa-search` | `icon-search` |

> If the HTML uses Font Awesome icons extensively and exact icons matter, it's better to enqueue Font Awesome and use raw HTML inside columns rather than mapping to Flatsome icons.
