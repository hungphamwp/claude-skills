# UX Builder High-Fidelity Sections

Use this reference when the user explicitly requires a section/page to be editable in Flatsome UX Builder while still matching a supplied design as closely as possible.

## Non-Negotiable Tradeoff

UX Builder editability and literal 100% pixel-perfect DOM are often incompatible. If the user says "phải làm bằng UX Builder", keep the implementation in native Flatsome elements and push fidelity through scoped CSS and real assets. Do not silently switch to a PHP/static template.

## Fidelity Tier Gate

Before converting a pixel-perfect PHP/static version to UX Builder, choose and state the fidelity tier:

| Tier | Use When | Architecture | Expected Fidelity |
|---|---|---|---|
| Native editable | Client must edit every element directly | Pure `[section]`, `[row]`, `[col]`, `[ux_text]`, `[ux_image]`, `[button]` with scoped CSS | 80-90% |
| Hybrid editable | Design must look close but still expose text/images/buttons | Native shortcodes for content, CSS grid/flex owns geometry, decorative assets via CSS | 90-95% |
| Pixel-perfect | "100%" / exact screenshot comparison is more important than editability | PHP/static template or composite visual asset | 95-100% |

Do not promise tier 3 while delivering tier 1/2. If the user requests both "100%" and "UX Builder", explain the conflict and ask which constraint wins, or proceed as Hybrid editable with a clear fidelity limit.

## Architecture

- Page content: native shortcodes only for editable content: `[section]`, `[row]`, `[col]`, `[ux_text]`, `[button]`, `[image]`, `[ux_image_box]` where appropriate.
- Decorative design: CSS backgrounds, pseudo-elements, gradients, masks, SVG assets.
- Isolated one-section page: set `_wp_page_template` to `page-blank-landingpage.php`.
- CSS: enqueue a page-specific file, not a global pile in `style.css`.

Example enqueue:

```php
function hm_enqueue_section_css() {
    if ( ! is_page( '{page_slug}' ) ) {
        return;
    }
    $file = get_stylesheet_directory() . '/assets/css/{page_slug}.css';
    if ( file_exists( $file ) ) {
        wp_enqueue_style(
            '{handle}',
            get_stylesheet_directory_uri() . '/assets/css/{page_slug}.css',
            array(),
            filemtime( $file )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'hm_enqueue_section_css', 30 );
```

## Asset Extraction

When cloning from a live sample, inspect source HTML/CSS and download actual assets:

```bash
curl -L "$SOURCE_URL" -o source.html
rg -n "section|decor|svg|font|background|check" source.html
curl -L "$ASSET_URL" -o assets/img/{slug}/asset.svg
```

Prefer real SVG/PNG assets over approximated CSS shapes. Store them under the child theme, for example:

```text
flatsome-child/assets/img/{section_slug}/section-decor.svg
flatsome-child/assets/img/{section_slug}/angle-section-end.svg
flatsome-child/assets/img/{section_slug}/check-icon.svg
```

## Bento / Checklist Section Notes

For bento-style "large statement + benefit copy + checklist" sections, the correct direction is:

- Use a single grey panel with large radius, not separate white boxes.
- Use the source `section-decor.svg` for the giant white background shape.
- Use the source `angle-section-end.svg` for the top-right notch.
- Use the source `check-icon.svg` for checklist bullets.
- Keep heading, paragraph, list labels, and button as UX Builder-editable text/buttons.
- Match source typography and colors through scoped CSS variables, for example dark heading, muted body text, light panel, and blue/purple gradient accents.
- Avoid huge percentage padding that makes the Flatsome column collapse or pushes content outside the builder viewport.

Recommended shortcode skeleton:

```text
[section class="{section_class}" padding="0px"]
  [row class="{section_class}-shell" col_spacing="collapse"]
    [col span="6" span__sm="12" class="{section_class}-left"]
      [ux_text class="{section_class}-heading"]<h2>...</h2>[/ux_text]
    [/col]
    [col span="6" span__sm="12" class="{section_class}-right"]
      [ux_text class="{section_class}-copy"]...[/ux_text]
      [row_inner class="{section_class}-list" col_spacing="collapse"]...[/row_inner]
      [button text="Discover More" class="{section_class}-btn"]
    [/col]
  [/row]
[/section]
```

## CSS Rules That Avoid Builder Breakage

- Scope everything under one page/section class, for example `.{section_class}`.
- Target both Flatsome frontend and builder wrappers when needed.
- Keep `.row` and `.col` widths stable; use `flex-basis`, `max-width`, and breakpoint rules rather than absolute offsets for primary layout.
- Put oversized decorative SVGs behind content with `position:absolute; pointer-events:none; z-index:0;`.
- Put editable content wrappers above decorations with `position:relative; z-index:1;`.
- Use `min-height` carefully; verify it does not create empty scroll space.

## Pixel-Sensitive Header/Hero Rules

Header and first-viewport hero sections fail more often than ordinary content because a small width error causes logo/nav/CTA overlap or cropped buttons.

- Do not rely on Flatsome `span="3/6/3"` alone for a pixel-sensitive header. Treat spans as builder-tree hints only.
- Add a scoped layout contract to the header row:

```css
.{slug}-header {
  display: grid !important;
  grid-template-columns: {logo_track}px minmax(0, 1fr) {cta_track}px;
  column-gap: {gap}px;
  align-items: center;
}

.{slug}-header > .col {
  flex: none !important;
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
  padding: 0 !important;
}

.{slug}-nav .text {
  display: flex;
  gap: {nav_gap}px;
  white-space: nowrap;
}

.{slug}-cta .button {
  display: inline-flex;
  width: {button_w}px;
  height: {button_h}px;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
}
```

- Confirm total header width fits: `side_padding * 2 + logo_track + nav_min_width + cta_track + gaps <= viewport_width`.
- If it does not fit at the user's actual viewport, reduce nav gap/font size or switch to mobile menu earlier. Do not let the CTA clip.
- When cloning a screenshot that includes a browser/admin bar, QA both logged-out and logged-in/admin-bar states.

## Composite Image Trap

Using one cropped screenshot as `[ux_image]` can make the frontend look close, but it is not truly UX Builder-editable and it scales differently from real DOM text/buttons.

Use a composite image only for:

- Decorative/illustration areas that the client will not edit.
- A temporary fidelity bridge while replacing parts with native elements.
- A user-approved pixel-perfect static compromise.

Do not use a composite for nav, CTA, heading, paragraph, or other content the client expects to edit.

## QA Checklist

1. Public page renders without default blog widgets/footer when section-only.
2. UX Builder preview renders the same composition without text overflow or column collapse.
3. CSS file URL includes a fresh `filemtime()` version after deploy.
4. Downloaded SVG/image assets return `200`.
5. User can click/edit heading, body copy, list labels, and button in UX Builder.
6. Mobile/tablet breakpoints stack cleanly without cropped text.
7. Header CTA does not wrap or clip at the user's actual viewport width.
8. Logged-in/admin-bar view does not change the first viewport enough to hide critical content.
9. If a PHP/static version exists, compare UX Builder output against it and note the remaining fidelity loss before final handoff.

## Common Fixes

| Symptom | Fix |
|---------|-----|
| Looks like plain text/no design | Confirm CSS enqueue and `filemtime()` version, then inspect the actual linked CSS URL. |
| Header/footer/widgets appear | Set page template to `page-blank-landingpage.php`. |
| Builder preview is broken but frontend is fine | Add builder-safe scoped rules and remove fragile offsets/padding. |
| Shape is close but not identical | Fetch and use the original SVG asset instead of CSS approximation. |
| User asks "100% từng pixel" and "phải UX Builder" | Explain the tradeoff, then implement the closest UX Builder-native version. |
| Header logo/nav overlap | Replace span-only header with scoped grid/flex contract and reset direct `.col` behavior. |
| CTA text wraps or clips | Fixed button width/height, `inline-flex`, `white-space: nowrap`, and verify total track math. |
| PHP version matches but UX version does not | Re-run Fidelity Tier Gate; UX conversion is a new architecture, not a direct copy. |
