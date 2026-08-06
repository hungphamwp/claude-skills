# Autonomous Visual QA Loop

Use this workflow when the user provides a screenshot/URL sample and expects a 90-100% Flatsome implementation without repeated manual review.

## Operating Principle

The user is not the primary QA loop. Build, deploy, inspect, and refine before reporting completion.

Do not say a section is done after the first pass. A section is done only after it passes the quality gates below or a real blocker is documented.

## Required Loop

1. **Measure first**
   - Record viewport, section x/y/w/h, card/container widths, gaps, radius, font scale, icon/image scale.
   - Convert measurements to ratios before writing CSS.

2. **Build editable-first**
   - Use native Flatsome shortcodes for every client-editable element.
   - Text, names, buttons, ratings, icons/logos/images that a client may replace must be separate UX Builder elements.
   - Use scoped CSS for geometry, crop, radius, responsive behavior, and decorative-only effects.

3. **Deploy**
   - Use WP-CLI/SSH.
   - Use cache-busted CSS (`filemtime()` or equivalent).
   - Import replaceable images into Media Library and reference them by `[ux_image id="..."]`.

4. **Frontend verification**
   - Fetch frontend HTML and CSS.
   - Confirm expected section classes exist.
   - Confirm assets return HTTP 200.
   - Confirm no unresolved placeholders remain.
   - Check for generated `<p>` wrappers that can break grid/flex/absolute positioning.

5. **Visual verification**
   - Use headless screenshot tooling on public frontend pages when available.
   - Compare the screenshot to the source geometry audit.
   - Check at least desktop and mobile/tablet breakpoints when responsive behavior matters.

6. **Refinement**
   - Fix geometry first: container, columns, card size, gaps, y-position.
   - Fix scale second: font size, line-height, icon/logo/image size.
   - Fix details last: underline arcs, shadows, hover, micro-spacing.
   - Repeat deploy + verification until the quality gates pass.

## Quality Gates

Do not report completion unless:

- No obvious overlap, clipped content, off-screen card, or huge blank gap.
- Card count and order match the sample.
- Main section geometry is close to the sample: container width, x/y placement, gaps, card height.
- Text scale is close enough that line breaks resemble the sample.
- Icons/images are not oversized and are anchored where expected.
- UX Builder editability is acceptable:
  - replaceable images/logos/icons are `[ux_image]` blocks;
  - text is not mixed with HTML-heavy spans unless it is decorative-only;
  - forms use real form shortcodes/plugins where appropriate.
- Frontend HTML/CSS checks do not show unresolved placeholders or missing assets.

## Common Auto-Fix Checks

### WordPress/Flatsome wrappers

WordPress can inject `<p>` tags between shortcodes or around spans/images.

For grid/flex rows:

```css
.{section_class}-grid > p,
.{section_class}-row > p {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
```

For `[ux_text]` blocks, avoid broad selectors. Use explicit classes:

```text
[ux_text class="{section_class}-copy-wrap"]
  <p class="{section_class}-copy">...</p>
[/ux_text]
```

### Editable image positioning

Flatsome `[ux_image]` can emit inline width styles. When positioning an editable image inside a card, target the wrapper class and override placement:

```css
.{section_class}-logo-img {
  position: absolute !important;
  right: 32px !important;
  bottom: 32px !important;
  width: 48px !important;
  height: 48px !important;
}

.{section_class}-logo-img .img-inner,
.{section_class}-logo-img img {
  width: 48px !important;
  height: 48px !important;
  object-fit: contain;
}
```

### Text too large

If text line breaks differ strongly from the sample, reduce font-size before changing container width. If names/buttons overlap body copy, reserve bottom padding or use a non-overlapping layout.

## Reporting

Final response should include:

- What was built or fixed.
- Verification performed.
- Whether the skill was updated and the reusable lesson captured.
- Any real limitation, for example if headless screenshot tooling was unavailable.
