# Screenshot to UX Flatsome Hard Rules

Use this reference whenever the source is a screenshot/image and the output must remain editable in Flatsome UX Builder.

## Core Failure To Avoid

Do not infer grid/card proportions by eye and start coding. The most common failure is a layout that uses the right images and text but has huge blank gaps, wrong card widths, wrong vertical placement, or off-screen columns.

Before coding, produce a compact Visual Geometry Audit.

For production work, do not rely on the user to catch first-pass defects. Pair this reference with `autonomous-visual-qa.md`: build, deploy, inspect frontend output, run visual checks when possible, and iterate until the QA gates pass.

## Visual Geometry Audit

For each section, record:

```text
Viewport: {w} x {h}
Section: x={x}, y={y}, w={w}, h={h}
Container: margin-left={px}, margin-right={px}, max-width={px|none}
Columns/cards:
- card 1: x={x}, y={y}, w={w}, h={h}, radius={r}
- card 2: x={x}, y={y}, w={w}, h={h}, radius={r}
- gap horizontal={px}, gap vertical={px}
Typography:
- heading size/line-height/weight
- body size/line-height/weight
Assets:
- image/background candidates and crop position
```

Approximate manually when exact tooling is unavailable, but still write down the ratios. Do not code from vague descriptions like "large left card and three small cards".

## Grid Math Gate

For any bento, accordion, portfolio, or card strip:

1. Compute available width: `container_width - total_gaps`.
2. Compute column ratios from screenshot card widths.
3. Convert ratios to `fr` values or fixed `minmax()` tracks.
4. Confirm: `sum(track widths) + gaps <= container width`.
5. Only then write CSS.

Example:

```text
container = 1920px - 64px margins = 1856px
gaps = 3 * 24px = 72px
tracks = 1856 - 72 = 1784px
sample widths = 900, 300, 300, 300
ratio = 3fr 1fr 1fr 1fr
```

## Flatsome Row/Col Reset For CSS Grid

If converting a native `[row]` into CSS Grid, reset Flatsome's flex/column behavior under a scoped class:

```css
.{section_class}-grid {
  display: grid !important;
  width: calc(100% - {outer_margin_total}px) !important;
  max-width: none !important;
  margin: {top}px {side}px {bottom}px !important;
  padding: 0 !important;
  gap: {gap}px;
}

.{section_class}-grid:before,
.{section_class}-grid:after {
  display: none !important;
}

.{section_class}-grid > p {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.{section_class}-grid > .col {
  display: block !important;
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
  flex: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.{section_class}-card > .col-inner {
  height: 100%;
  overflow: hidden;
}
```

Do not rely on `span="6"` or `span="2"` once CSS Grid controls the layout. Those values help UX Builder's tree, but the scoped CSS must own the geometry.

WordPress `wpautop` or shortcode spacing can inject empty `<p>` tags between Flatsome columns. In a CSS Grid row those paragraphs become real grid items and create huge blank columns. Always hide/remove direct `> p` children in scoped grid rows or compress the shortcode markup before debugging ratios.

## Section Build Order

1. Header/title geometry.
2. Container width and outer margins.
3. Card geometry and grid ratios.
4. Background image placement/crop.
5. Text placement inside cards.
6. Decorative effects.
7. Responsive rules.

If card geometry is wrong, stop and fix geometry before polishing typography or icons.

## Screenshot QA Gates

After deploy, compare against the source screenshot:

- No unexpected blank vertical or horizontal band between cards.
- First and last card x positions match the screenshot within a small tolerance.
- Card height and radius match before adjusting text.
- Card image crop matches source intent.
- Vertical text labels are anchored at the same visual baseline.
- The layout also opens in UX Builder without columns jumping or collapsing.

If any gate fails, do not mark the section complete and do not move to the next section.

## UX Builder Editability Gate

Before finalizing, inspect whether a non-technical client can edit the section without touching code:

- Replaceable image/logo/icon/badge assets must be separate `[ux_image]` elements in Media Library.
- Review text, names, ratings, labels, links, and button text should be separate `[ux_text]` or `[button]` elements when clients may edit them independently.
- Avoid putting many unrelated editable parts in one `[ux_text]`.
- CSS backgrounds are acceptable for purely decorative, non-client-editable visuals.
- If a visual is positioned by CSS but should be replaceable, use `[ux_image]` plus scoped wrapper overrides.

## Pattern-Specific Notes

### Case Study Accordion Strip

- Active card width must be measured from screenshot; do not default to 50%.
- Slim cards often have fixed visual width. Use `grid-template-columns: {active_ratio} repeat(3, 1fr)` only after measuring.
- Vertical titles should be placed with a known anchor (`bottom`, `left:50%`) and only then rotated.
- On mobile, remove rotation and stack cards.

### Bento Grid

- Bento layouts usually need unequal `fr` tracks, not `repeat(4, 1fr)`.
- Two-row cards must set both `grid-column` and `grid-row`.
- Check row height: `min-height` should match screenshot card height, not asset natural height.

### Contact/Form Split

- If `[row v_align="middle"]` adds `align-middle`, override or remove it before tuning y-position.
- Form card geometry should be correct before styling fields.
