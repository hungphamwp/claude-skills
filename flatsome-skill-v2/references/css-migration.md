# CSS Migration: HTML → Flatsome Child Theme

> All custom CSS must go in the Flatsome child theme's `style.css`. Never modify the parent Flatsome theme. Use project-specific class prefixes to avoid conflicts.

## Step 1: Extract CSS custom properties

Take the `:root` variables from the HTML `<style>` block and add them to the child theme's `style.css`:

**From HTML:**
```css
:root {
  --bg: #ffffff;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --text: #0f172a;
  --text2: #475569;
  --border: #e2e8f0;
  --shadow: 0 1px 3px rgba(0,0,0,.08);
}
```

**In child theme `style.css`:**
```css
/* ═══ HPB Media Design Tokens ═══ */
:root {
  --hpb-bg: #ffffff;
  --hpb-primary: #A61D21; /* Red Branding */
  --hpb-primary-dark: #8b181b;
  --hpb-text: #333333;
  --hpb-text-light: #777777;
  --hpb-border: #e2e8f0;
  --hpb-radius: 8px;
  --hpb-shadow: 0 3px 15px rgba(0,0,0,0.06);
}
```

**Key rules:**
- **Always prefix** variables with the project identifier (e.g., `--hpb-`)
- **Never override** Flatsome's own CSS variables (`--primary-color`, `--secondary-color`, etc.) unless intentionally changing the global theme
- These tokens can be used by Flatsome if you set Flatsome theme options via `get_flatsome_opt()`, but it's better to keep them separate

## Step 2: Organize CSS structure

Structure the child theme `style.css` in this order:

```css
/*
Theme Name: Flatsome Child
Template: flatsome
*/

/* ═══════════════════════════════════
   1. DESIGN TOKENS (CSS Custom Properties)
   ═══════════════════════════════════ */
:root {
  /* Project-specific tokens */
}

/* ═══════════════════════════════════
   2. TYPOGRAPHY
   ═══════════════════════════════════ */
/* Custom fonts, heading styles */

/* ═══════════════════════════════════
   3. SHARED COMPONENTS
   ═══════════════════════════════════ */
/* Section headers, tags, buttons — reused across sections */

/* ═══════════════════════════════════
   4. SECTION-SPECIFIC STYLES
   ═══════════════════════════════════ */
/* 4.1 Hero */
/* 4.2 Stats */
/* 4.3 Services */
/* ... */

/* ═══════════════════════════════════
   5. ANIMATIONS
   ═══════════════════════════════════ */
@keyframes fadeUp { ... }

/* ═══════════════════════════════════
   6. RESPONSIVE — TABLET (≤849px)
   ═══════════════════════════════════ */
@media (max-width: 849px) {
  /* Tablet overrides */
}

/* ═══════════════════════════════════
   7. RESPONSIVE — MOBILE (≤549px)
   ═══════════════════════════════════ */
@media (max-width: 549px) {
  /* Mobile overrides */
}
```

## Step 3: Convert component styles

### Cards

**From HTML inline:**
```css
.service-card {
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 1.75rem;
  transition: border-color .25s, transform .25s, box-shadow .25s;
}
.service-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

**In child theme (prefixed):**
```css
.hpb-card {
  background: #fff;
  border: 1.5px solid var(--hpb-border);
  border-radius: var(--hpb-radius);
  padding: 1.75rem;
  transition: border-color .25s, transform .25s, box-shadow .25s;
}
.hpb-card:hover {
  border-color: var(--hpb-primary);
  transform: translateY(-4px);
  box-shadow: var(--hpb-shadow-lg);
}
```

### Buttons

If using Flatsome's `[button]` shortcode, override its styles:

```css
/* Override Flatsome button for HPB pages */
.hpb-section .button.primary {
  background: var(--hpb-primary);
  border-radius: 8px;
  font-weight: 600;
  transition: background .2s, transform .2s, box-shadow .2s;
}
.hpb-section .button.primary:hover {
  background: var(--hpb-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--hpb-shadow-lg);
}
```

If using custom buttons (raw HTML), keep the original CSS with prefixed class names.

### Sections with Flatsome shortcodes

When sections use `[section class="hpb-hero"]`, target them in CSS:

```css
/* Hero section created with [section class="hpb-hero"] */
.hpb-hero {
  min-height: 90vh;
  position: relative;
  overflow: hidden;
}
.hpb-hero::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37,99,235,.07) 0%, transparent 70%);
  top: -150px;
  right: -100px;
  pointer-events: none;
}
```

## Step 4: Flatsome-specific CSS considerations

### Column padding in UX Builder

Flatsome's `[col]` shortcode adds default padding. To match the HTML design, you may need:

```css
/* Remove Flatsome column inner padding for custom cards */
.hpb-card-col .col-inner {
  padding: 0;
}
/* Or keep padding but adjust card layout */
.hpb-card-col .col-inner {
  padding: 7px; /* Flatsome default for style="small" */
}
```

### Flatsome section padding

Flatsome's `[section]` adds its own padding. Override if needed:

```css
.hpb-stats-section > .section-content {
  padding: 0;
}
```

### Flatsome row gaps

The `[row style="small"]` attribute controls gap:
- `collapse` = 0 gap
- `small` = 14px gap (7px per side)
- `large` = 30px gap
- default = 30px gap

### Overriding Flatsome's default focus/hover states

```css
/* Remove Flatsome's default blue outline on custom cards */
.hpb-card:focus-within {
  outline: none;
}

/* ═══════════════════════════════════
   FILTER BAR: RESPONSIVE NON-WRAPPING
   ═══════════════════════════════════ */
/* Pattern for horizontal scrollable pill buttons with a dropdown */
.mvl-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap; /* CRITICAL: Prevent wrapping to second line */
  gap: 15px;
  margin-bottom: 15px;
  overflow-x: auto; /* Enable horizontal scroll on mobile */
  padding-bottom: 5px; /* Space for scrollbar if needed */
  -webkit-overflow-scrolling: touch;
}
.mvl-filters::-webkit-scrollbar { display: none; } /* Hide scrollbar for clean look */

.mvl-filter-btn {
  flex-shrink: 0; /* Prevent buttons from squishing */
  padding: 8px 20px;
  border-radius: 20px;
  background: #f1f1f1;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.mvl-filter-btn.active {
  background: var(--hpb-primary);
  color: #fff;
}

.mvl-filter-select {
  flex-shrink: 0;
  width: 250px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--hpb-primary);
  color: var(--hpb-primary);
  padding: 0 15px;
  font-weight: 600;
}

/* ═══════════════════════════════════
   SPACING POLISH: TIGHT LAYOUT
   ═══════════════════════════════════ */
/* Negative margin to counteract Flatsome row spacing */
.mvl-portfolio-row {
  margin-top: -15px !important;
}
/* Ensure columns don't have bottom margin gaps */
.mvl-portfolio-row .col {
  margin-bottom: 30px;
}
```

## Step 5: Responsive pattern

### Desktop-first approach (matches Flatsome)

```css
/* Desktop (default) */
.hpb-hero h1 {
  font-size: clamp(2.4rem, 5.5vw, 4.5rem);
}
.hpb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

/* Tablet */
@media (max-width: 849px) {
  .hpb-hero h1 {
    font-size: 2.2rem;
  }
  .hpb-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 549px) {
  .hpb-hero h1 {
    font-size: 1.8rem;
  }
  .hpb-grid {
    grid-template-columns: 1fr;
  }
}
```

### Combining Flatsome responsive utility classes with custom CSS

For elements inside UX Builder shortcodes, you can combine:
- Flatsome utility: `class="hide-for-small"` on the shortcode
- Custom CSS: `@media` queries for styling adjustments

## Step 6: Enqueue Google Fonts (if needed)

If the HTML uses custom fonts not available in Flatsome:

**In `functions.php`:**
```php
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'google-fonts-inter',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        array(),
        null
    );
}, 20 );
```

**In `style.css`:**
```css
:root {
  --hpb-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.hpb-section,
.hpb-section * {
  font-family: var(--hpb-font);
}
```

## Common pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Custom CSS not loading | Child theme `style.css` missing header | Ensure `Theme Name` and `Template: flatsome` in header |
| Flatsome styles overriding custom | Lower specificity | Use more specific selectors or add parent class |
| Colors inconsistent | Mixing hardcoded values and variables | Use CSS variables consistently |
| Hover effects janky | Flatsome adds its own transitions | Override transition property on custom elements |
| Font not applying | Enqueue order wrong | Set priority to 20+ in `wp_enqueue_scripts` |
| Mobile layout unexpected | Flatsome breakpoints ≠ HTML breakpoints | Use 849px and 549px instead of 768px and 480px |
