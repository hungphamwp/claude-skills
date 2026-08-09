# Flatsome UX Builder — Full Capability Reference

This file is the authoritative checklist for determining whether a website design can be recreated using Flatsome. When evaluating a website, compare each visual element against this list.

## Table of Contents
1. [Layout System](#layout-system)
2. [Header & Navigation](#header--navigation)
3. [Slider & Banner](#slider--banner)
4. [Content Elements](#content-elements)
5. [Media Elements](#media-elements)
6. [WooCommerce Elements](#woocommerce-elements)
7. [Blog Elements](#blog-elements)
8. [Interactive Elements](#interactive-elements)
9. [Animation & Effects](#animation--effects)
10. [Typography & Colors](#typography--colors)
11. [NOT Supported Natively](#not-supported-natively)
12. [Tech Stack Detection Cheatsheet](#tech-stack-detection-cheatsheet)

---

## Layout System

Flatsome uses a 12-column grid with UX Builder's drag-and-drop sections.

| Element | Supported | Notes |
|---------|-----------|-------|
| Full-width sections | YES | Default layout mode |
| Boxed/contained sections | YES | Set max-width in section settings |
| 2-column layout | YES | Column element, any ratio (1/2, 1/3+2/3, etc.) |
| 3-column layout | YES | Very common, works perfectly |
| 4-column layout | YES | Great for service cards |
| 6-column layout | YES | Good for icon grids |
| Nested columns | YES | Columns inside columns |
| Sidebar layout | YES | Left or right sidebar |
| Section backgrounds | YES | Color, image, video, parallax |
| Section padding/margin | YES | Full control per section |
| Row gap / column gap | YES | Adjustable spacing |
| Sticky sections | LIMITED | Sticky header yes, sticky content sections need custom CSS |
| CSS Grid (complex) | NO | Uses flexbox, not CSS Grid |
| Masonry layout | LIMITED | Only via portfolio element or plugin |
| Asymmetric/broken grid | NO | Needs heavy custom CSS |

**Key rule:** If a website has a simple vertical stacking of sections with internal column grids, it's Flatsome-friendly. If it uses complex overlapping layers or CSS Grid layouts, it's not.

---

## Header & Navigation

| Element | Supported | Notes |
|---------|-----------|-------|
| Logo + horizontal menu | YES | Default header |
| Sticky/fixed header | YES | Built-in option |
| Transparent header | YES | Built-in option |
| Top bar (phone, email, social) | YES | Header top bar element |
| Dropdown menus | YES | Standard WordPress menu |
| Mega menu (text only) | YES | Built-in mega menu |
| Mega menu with images | PARTIAL | Possible but needs custom CSS |
| Mobile hamburger menu | YES | Automatic responsive |
| Search in header | YES | Built-in search icon |
| Language switcher | YES | Via WPML/Polylang plugin |
| Header CTA button | YES | Button in header |
| Side navigation (vertical) | NO | Needs custom development |
| Off-canvas menu | YES | Built-in for mobile |
| Breadcrumb | YES | Built-in, WooCommerce compatible |

---

## Slider & Banner

| Element | Supported | Notes |
|---------|-----------|-------|
| Revolution Slider | YES | **BUNDLED FREE** with Flatsome |
| Simple image slider | YES | UX Builder slider element |
| Banner with text overlay | YES | Banner element — very powerful |
| Banner with button | YES | Built-in CTA options |
| Full-screen hero | YES | 100vh section + background |
| Video background | YES | YouTube, Vimeo, or self-hosted |
| Parallax background | YES | Built-in parallax effect |
| Carousel/swiper | YES | Multiple carousel elements |
| Auto-rotating slides | YES | Slider settings |
| Slide with animation | YES | Revolution Slider handles this |
| Fullpage scroll (section-by-section) | NO | Needs fullpage.js plugin — NOT native |
| 3D/WebGL backgrounds | NO | Not possible |
| Lottie animations | NO | Needs plugin |

---

## Content Elements

| Element | Supported | Notes |
|---------|-----------|-------|
| Heading/title | YES | Multiple styles, sizes |
| Text block / paragraph | YES | Rich text editor |
| Button | YES | Multiple styles (flat, outline, rounded, etc.) |
| Icon box | YES | Icon + title + text — great for services |
| Feature box | YES | Image + title + text |
| Counter/number | YES | Animated counting number |
| Progress bar | YES | Animated bar with percentage |
| Countdown timer | YES | Date-based countdown |
| Divider/separator | YES | Line, dots, custom |
| Blockquote | YES | Styled quote block |
| Team member | YES | Photo + name + role + social |
| Testimonial | YES | Single or slider |
| Pricing table | YES | Built-in element |
| Client/partner logos | YES | Logo carousel/grid |
| FAQ/Accordion | YES | Collapsible sections |
| Tabs | YES | Horizontal tabs |
| Table | YES | HTML table with styling |
| Timeline | LIMITED | Needs custom CSS or plugin |
| Infographic | NO | Needs custom design |
| Animated SVG | NO | Not native |

---

## Media Elements

| Element | Supported | Notes |
|---------|-----------|-------|
| Image | YES | Full control, lazy loading |
| Image gallery | YES | Grid or masonry, lightbox |
| Image with lightbox | YES | Click to enlarge |
| Before/After slider | NO | Needs plugin |
| Video embed (YouTube) | YES | Responsive embed |
| Video embed (Vimeo) | YES | Responsive embed |
| Self-hosted video | YES | HTML5 video |
| Video popup/lightbox | YES | Click to play in overlay |
| Audio player | LIMITED | Basic HTML5 audio |
| Google Maps | YES | Built-in element |
| 360° view | NO | Needs plugin |
| Image hotspot | NO | Needs plugin |

---

## WooCommerce Elements

| Element | Supported | Notes |
|---------|-----------|-------|
| Product grid | YES | Highly customizable |
| Product carousel/slider | YES | Horizontal scroll products |
| Product categories grid | YES | Category cards |
| Product quick view | YES | Built-in popup |
| Product wishlist | YES | Via YITH plugin |
| Product compare | YES | Via plugin |
| Sale badge | YES | Auto or custom |
| Product filter | YES | Sidebar or ajax filter |
| Mini cart in header | YES | Built-in |
| Product tabs | YES | Description, reviews, etc. |
| Related products | YES | Automatic |
| Product zoom | YES | Hover zoom on images |
| Product video | LIMITED | Needs plugin for gallery video |
| Variable product | YES | Color/size swatches |
| Catalog mode (no cart) | YES | Show products without buying |

---

## Blog Elements

| Element | Supported | Notes |
|---------|-----------|-------|
| Blog post grid | YES | Multiple layouts |
| Blog post carousel | YES | Horizontal scroll posts |
| Blog post list | YES | Standard list layout |
| Featured post (large) | YES | Custom styling available |
| Post categories filter | YES | Category tabs |
| Post with thumbnail | YES | Multiple image sizes |
| Post sidebar | YES | Left or right |
| Post navigation | YES | Previous/next links |
| Author box | YES | After post content |
| Related posts | YES | Automatic by category |
| Social share buttons | LIMITED | Needs plugin (Flatsome has basic) |

---

## Interactive Elements

| Element | Supported | Notes |
|---------|-----------|-------|
| Contact form | YES | Via Contact Form 7 or WPForms |
| Newsletter signup | YES | Via Mailchimp plugin |
| Popup/modal | YES | Built-in promotional popup |
| Scroll-to-top button | YES | Built-in |
| Social media links | YES | Icon set included |
| Click-to-call | YES | Link with tel: |
| Zalo/Messenger button | YES | Via plugin (common in VN) |
| Cookie consent | YES | Via plugin |
| Live chat | YES | Via Tidio/Crisp plugin |
| Search overlay | YES | Built-in |
| Isotope/filter portfolio | YES | **Portfolio element built-in** |
| Infinite scroll | LIMITED | Needs plugin |
| AJAX load more | LIMITED | Needs plugin or custom |

---

## Animation & Effects

| Element | Supported | Notes |
|---------|-----------|-------|
| Fade-up on scroll | YES | Built-in animation option |
| Fade-in on scroll | YES | Built-in |
| Slide-left/right on scroll | YES | Built-in |
| Zoom-in on scroll | YES | Built-in |
| Hover: color change | YES | Button/card hover states |
| Hover: image zoom | YES | Product image default |
| Hover: overlay appear | YES | Banner element feature |
| Parallax scroll | YES | Section background parallax |
| Counter animation | YES | Numbers count up on scroll |
| Typing animation | NO | Needs plugin/custom JS |
| GSAP/Anime.js complex | NO | Needs custom code |
| SVG line drawing | NO | Needs custom code |
| Marquee/ticker text | NO | Needs plugin |
| Scroll-triggered video | NO | Needs custom JS |
| Page transition effects | NO | Not supported |
| Mouse-follow effects | NO | Needs custom JS |
| Particle effects | NO | Needs custom JS |

---

## Typography & Colors

| Element | Supported | Notes |
|---------|-----------|-------|
| Google Fonts | YES | Full library in Theme Options |
| Custom font upload | YES | Via plugin (Custom Fonts) |
| Font size control | YES | Per-element sizing |
| Font weight control | YES | Multiple weights |
| Line height control | YES | Adjustable |
| Letter spacing | YES | Adjustable |
| Global color scheme | YES | Primary, secondary, accent in Theme Options |
| Per-section colors | YES | Override per section |
| Gradient backgrounds | LIMITED | Basic gradient, complex needs CSS |
| Dark mode toggle | NO | Needs custom development |
| CSS custom properties | LIMITED | Theme uses some, custom vars need code |

---

## NOT Supported Natively — Red Flags

If a website uses any of these heavily, it's NOT a good Flatsome reference:

### Instant Disqualifiers
- **Fullpage.js scroll** (each section = one screen, snaps between)
- **React/Vue/Angular/Svelte frontend** (single-page app)
- **Next.js / Nuxt.js** (SSR frameworks)
- **WebGL / Three.js** (3D graphics)
- **Complex SVG animations** (stroke drawing, morphing)
- **Horizontal scroll sections**
- **Cursor-following effects**
- **Page transition animations** (fade between pages)

### Moderate Difficulty (possible but significant work)
- **Mega-menu with media** → custom CSS + HTML in menu
- **Sticky sidebar that follows scroll** → custom JS
- **Animated timeline** → plugin or custom
- **Tabbed content with AJAX** → custom development
- **Multi-step form wizard** → plugin needed
- **Custom post type archive with filters** → custom development

---

## Tech Stack Detection Cheatsheet

### How to identify WordPress
```
Look for in page source:
- /wp-content/
- /wp-includes/
- <meta name="generator" content="WordPress X.X">
- /wp-json/ in any API calls
- wp-emoji, wp-embed scripts
```

### How to identify page builders
```
Elementor:    .elementor-section, .elementor-widget, .e-container
WPBakery:     .vc_row, .vc_column, .wpb_wrapper
Divi:         .et_pb_section, .et_pb_row, .et_pb_module
Porto:        .porto-container, data-plugin-porto
Avada:        .fusion-builder-row, .fusion-layout-column
Flatsome:     .ux-builder, data-ux-builder (if it's already Flatsome!)
Oxygen:       .ct-section, .oxy-
Beaver:       .fl-builder, .fl-row
```

### How to identify JS frameworks (RED FLAG)
```
React:        data-reactroot, __REACT, _reactRoot, react-app
Vue:          data-v-, __VUE__, [data-v-xxxxx]
Nuxt:         __nuxt, __NUXT__, _nuxt/
Next.js:      __NEXT_DATA__, _next/
Angular:      ng-version, _nghost, _ngcontent
Svelte:       __svelte, svelte-xxxxx
```

### How to identify animation libraries
```
GSAP:         gsap, TweenMax, TweenLite, ScrollTrigger
Anime.js:     anime.min.js, anime({
Fullpage.js:  fullpage.js, fp-section, fp-slide
AOS:          data-aos (this one is OK — similar to Flatsome's built-in)
ScrollMagic:  ScrollMagic, scroll-magic
Lottie:       lottie-player, lottie-web
Three.js:     THREE., three.min.js
```

---

## Quick Decision Flowchart

```
Website found → Check HTML source
  ├── Has wp-content/? → WordPress → Check builder
  │   ├── Elementor/WPBakery/Porto/Divi? → GOOD (★★★★-★★★★★)
  │   ├── Custom theme, simple layout? → OK (★★★-★★★★)
  │   └── Custom theme, complex animations? → RISKY (★★-★★★)
  ├── Has React/Vue/Nuxt/Next? → SKIP ✗
  ├── Has fullpage.js? → SKIP ✗
  ├── Has heavy GSAP/Three.js? → SKIP ✗
  └── Static HTML, simple sections? → MAYBE (★★★-★★★★)
      └── Maps to UX Builder sections? → GOOD
```
