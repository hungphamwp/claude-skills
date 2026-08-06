# Reusable Design Lessons

Use this reference after a design/build task is accepted, especially when the user asks to update the skill. The goal is to improve future work across all Flatsome websites, not to archive details from one client project.

## Promotion Criteria

Promote a lesson into the skill only when it is reusable in at least one of these ways:

- It prevents a recurring failure mode.
- It improves design fidelity for multiple sections/sites.
- It clarifies when to use UX Builder, PHP templates, ACF/SCF, Contact Form 7, or scoped CSS.
- It gives a repeatable shortcode/CSS architecture.
- It improves deployment, cache busting, QA, or debugging.

Do not promote:

- Credentials, domains, IPs, page IDs, client names, private copy, or one-off visual tweaks.
- A large code dump from one project.
- Exact CSS values unless they express a reusable pattern or token strategy.

## Post-Design Learning Checklist

After each completed design, ask:

1. Did UX Builder editability force a specific architecture?
2. Did any shortcode nesting, row/col behavior, or builder preview issue appear?
3. Did a CSS cache/versioning problem appear?
4. Did a real asset perform better than a CSS approximation?
5. Did a plugin integration become part of a reusable UI pattern?
6. Did responsive behavior require a general rule?
7. Did the user clarify a preference that should become a skill-level rule?

If yes, update the smallest relevant place:

- Decision rule → `SKILL.md`
- Detailed pattern → `references/*.md`
- Reusable script → `scripts/` only if the exact workflow will repeat often

## Autonomous Delivery Rule

For screenshot/URL-to-Flatsome work, do not treat the user as the QA loop. The default delivery standard is:

- Build the section/page.
- Deploy it.
- Verify frontend HTML/CSS/assets.
- Run headless visual checks when available.
- Fix geometry, scale, overlap, and UX Builder editability issues before reporting completion.

Only ask the user to review after the implementation has passed the checklist or when a true blocker prevents verification.

## Generalized Pattern: Editable Contact Section

When building a high-fidelity contact section in Flatsome:

- Use `[section]`, `[row]`, `[col]`, `[row_inner]`, `[ux_text]` for editable text and layout.
- Use Contact Form 7 for a real form when the plugin is available.
- Style CF7 fields through a scoped section class instead of raw form HTML.
- Keep labels and submit text in the CF7 form definition so they remain manageable.
- Use a page-specific CSS file with `filemtime()` enqueue when the design needs custom shape, gradient, or card styling.
- For visual effects such as clipped/notched cards, use CSS (`clip-path`, `border-radius`, pseudo-elements) under the section scope.

Shortcode shape:

```text
[section class="{section_class}" padding="0px"]
  [row class="{section_class}-shell"]
    [col span="6" span__sm="12"]
      [ux_text]<h2>...</h2>[/ux_text]
      [row_inner]...contact info...[/row_inner]
    [/col]
    [col span="6" span__sm="12" class="{section_class}-form-card"]
      [ux_text]<h3>...</h3>[/ux_text]
      [ux_text][contact-form-7 id="{form_id}" title="{form_title}"][/ux_text]
    [/col]
  [/row]
[/section]
```

CF7 form shape:

```text
<label>Name*
[text* your-name autocomplete:name]</label>

<label>E-mail*
[email* your-email autocomplete:email]</label>

<label>Message*
[textarea* your-message]</label>

[submit "Send Message"]
```

## Generalized Pattern: Split Gradient + Light Form Card

Use this for contact/help/CTA sections with a strong left content panel and right form panel:

- Outer shell: full-width row, gradient background, large radius, hidden overflow.
- Left column: large white heading, contact details as editable text blocks, social links as editable anchors.
- Right column: light translucent card, large radius, optional clipped top-right corner, scoped CF7 form styles.
- Mobile: stack columns, reduce heading size, remove excessive min-height, keep form card padding generous but not fixed.

## Generalized Pattern: Editable Image Asset Import

When a screenshot-matched section needs a real image and the user wants UX Builder editability, import the image into the WordPress Media Library and reference it through native Flatsome image shortcodes instead of hard-coding a theme URL.

Shortcode placeholder:

```text
[ux_image id="__IMAGE_ID__" image_size="original" class="{section_class}-image"]
```

Deploy flow:

- Copy the source image to the server.
- Find an existing attachment by a stable generic slug, or create one with WP-CLI/PHP media functions.
- Replace `__IMAGE_ID__` during deployment.
- Use scoped CSS only for crop, radius, height, and positioning.

This keeps the visual close to the sample while allowing the image block to remain visible and editable in UX Builder.

## Flatsome Alignment Gotcha

When `[row v_align="middle"]` renders, Flatsome adds an `align-middle` class. This can vertically center columns and make a high-fidelity section look too low even when custom column padding is correct.

If the section needs top-aligned or stretched columns, use a stronger scoped override:

```css
.{section_class}-shell.align-middle {
  align-items: stretch !important;
}

.{section_class}-left,
.{section_class}-right {
  align-self: stretch !important;
}
```

For sections where vertical alignment must be pixel-tuned, prefer removing `v_align="middle"` from the shortcode or overriding it explicitly under the section scope.

## Generalized Pattern: Bento CSS Grid With Native Columns

For high-fidelity bento sections with asymmetric card sizes, keep UX Builder editability by using native `[row]` and `[col]` elements, then convert only the scoped row into CSS Grid. Measure card widths/heights from the screenshot before choosing `fr` tracks.

Shortcode shape:

```text
[section class="{section_class}" padding="0px"]
  [row class="{section_class}-grid" style="collapse"]
    [col class="{section_class}-card {section_class}-main"]...[/col]
    [col class="{section_class}-card {section_class}-stat-top"]...[/col]
    [col class="{section_class}-card {section_class}-proof"]...[/col]
    [col class="{section_class}-card {section_class}-stat-bottom"]...[/col]
  [/row]
[/section]
```

Scoped CSS pattern:

```css
.{section_class}-grid {
  display: grid !important;
  grid-template-columns: {measured_tracks};
  grid-template-rows: repeat(2, 1fr);
  gap: 32px;
}

.{section_class}-grid > p {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.{section_class}-grid > .col {
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
  flex: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.{section_class}-main {
  grid-column: span 2;
  grid-row: span 2;
}
```

Use this when the visual sample is a true bento grid and Flatsome's 12-column flex row cannot express exact two-row card placement. Keep text/buttons editable in the columns; use CSS backgrounds only for decorative or non-editable imagery. Never default to `repeat(4, 1fr)` unless the screenshot actually has four equal tracks.

## Generalized Pattern: Case Study Accordion Strip

For case-study/portfolio strips where one card is wide and the remaining cards are narrow vertical labels, use native Flatsome columns with scoped CSS Grid. Keep each card title/category in `[ux_text]`; use CSS backgrounds for the card images. Measure the active card and slim-card widths from the screenshot before setting grid tracks.

Shortcode shape:

```text
[section class="{section_class}" padding="0px"]
  [row class="{section_class}-header-row" style="collapse"]
    [col span="12" class="{section_class}-header"]
      [ux_text]<h2>Title <span>Accent</span></h2>[/ux_text]
    [/col]
  [/row]
  [row class="{section_class}-grid" style="collapse"]
    [col class="{section_class}-card {section_class}-active"]...[/col]
    [col class="{section_class}-card {section_class}-slim"]...[/col]
    [col class="{section_class}-card {section_class}-slim"]...[/col]
    [col class="{section_class}-card {section_class}-slim"]...[/col]
  [/row]
[/section]
```

Scoped CSS pattern:

```css
.{section_class}-grid {
  display: grid !important;
  grid-template-columns: {active_card_ratio} repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.{section_class}-grid > .col {
  width: auto !important;
  max-width: none !important;
  min-width: 0 !important;
  flex: none !important;
  padding: 0 !important;
}

.{section_class}-vertical-title {
  transform: translateX(-50%) rotate(-90deg);
}
```

WordPress/Flatsome may output empty `<p>` tags between column shortcodes. When the row is converted to CSS Grid, those paragraphs become grid items and can create a large blank gap between cards. Add a scoped guard before debugging ratios:

```css
.{section_class}-grid > p {
  display: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
```

The same issue can happen inside `[ux_text]`: a broad selector like `.{section_class}-badge p` may style an auto-inserted empty paragraph as a second badge/pill. Prefer targeting the intended element narrowly, for example `.{section_class}-badge p:first-child`, or hide sibling paragraphs with `p:not(:first-child)` under that scoped text block.

Do not hide every direct paragraph inside a card just because WordPress inserted empty wrappers. Flatsome may wrap `[button]` output in a direct `<p>`; a rule such as `.{section_class}-card > .col-inner > p { display:none; }` will hide client-editable buttons. Use a narrower guard such as `> p:not(:has(a.button))` for modern browsers, or restructure the shortcode/CSS so button wrappers remain visible.

For rich card content inside `[ux_text]`, add explicit classes to the intended text paragraphs (`.{section_class}-copy`, `.{section_class}-stars`, etc.) and style those classes instead of broad selectors like `.card-content p:not(...)`. WordPress may wrap standalone spans/images in extra paragraphs, and broad paragraph selectors can accidentally style decorative wrappers.

If a card contains replaceable decorative media such as quote icons, partner logos, rating badges, or app/store logos, do not put them inside one `[ux_text]` as spans or background CSS. Import the asset into the Media Library and use a separate `[ux_image]` block for each replaceable visual. Text content, names, ratings, and logos should appear as separate UX Builder elements so a non-technical client can edit or swap one part without touching code.

Flatsome `[ux_image]` emits wrapper markup and inline width styles such as `#image_x { width: 100%; }`. When an editable image must be anchored inside a card, scope the wrapper with a class and override both geometry and placement with `!important`, including `position`, `width`, `height`, `left/right`, and `top/bottom`; otherwise the image can fall back into normal document flow and overlap text.

On mobile, remove the rotation and stack all cards in one column. This preserves UX Builder editability while matching accordion-like portfolio samples.

If a deployed strip shows a large blank gap between active and slim cards, treat it as a geometry failure: re-measure widths/gaps and reset `.row > .col` before touching text or images.

## Skill Update Wording

Good generalized wording:

- "When the user requires UX Builder, keep content in native shortcodes and move only decoration to CSS/assets."
- "For section-only pages, set `page-blank-landingpage.php` to avoid inherited widgets/header/footer."
- "Use `filemtime()` on page-specific CSS to avoid stale visual QA."

## Generalized Pattern: Flatsome UX Block Footer

When the user asks for a Flatsome footer that can be selected in Customizer, create a `ux_block` and set the Flatsome theme mod `footer_block` with `set_theme_mod( 'footer_block', $block_id )`. A plain WordPress option such as `flatsome_footer_block` is not sufficient for Flatsome's real footer renderer.

If a custom page template hardcodes its own footer and only calls `wp_footer()`, the Customizer footer block will not appear. Replace the hardcoded footer area with `do_action( 'flatsome_footer' );` so the template delegates footer rendering back to Flatsome.

For footer blocks built with CSS Grid, reset direct Flatsome `.col` items fully:

```css
.{section_class}-main > .col {
  width: auto !important;
  max-width: none !important;
  flex: none !important;
  padding: 0 !important;
}
```

Flatsome renders `template-parts/footer/footer-absolute` after a custom footer block. If the UX Block already contains copyright/policy links, hide the duplicate absolute footer with a scoped selector such as `.footer-wrapper:has(.{section_class}) .absolute-footer { display: none !important; }`.

Bad project-specific wording:

- "On {client_domain} page {page_id}, use form {form_id}."
- "Use this exact email/address/logo for future pages."
- "Always use the same class prefix from one project."

## Generalized Pattern: Full-Width Section (Edge-to-Edge Cards/Banners)

When a section must stretch cards or banners edge-to-edge (no container margin), override the Flatsome section-content container and the inner row. **Always add `overflow-x: hidden` on the section element** — without it, `max-width: none` causes a horizontal scrollbar on most browsers.

Shortcode shape — use two separate sections: one for the contained title, one for the full-width cards:

```text
[section class="{section_class}-title" padding="72px 0 0"]
  [row h_align="center"]
    [col span="8" span__sm="12" align="center"]
      [ux_text]<h2 class="{section_class}-title">...</h2>[/ux_text]
    [/col]
  [/row]
[/section]

[section class="{section_class}-cards" padding="24px 0 72px"]
  [row style="collapse"]
    [col span="4" span__sm="12" class="{section_class}-card"]
      [ux_banner bg="ID" height="500px"]
        [text_box position_x="5" position_y="5" width="88" padding="24px"]
          [ux_text]<h3 class="{section_class}-name">...</h3><p class="{section_class}-desc">...</p>[/ux_text]
        [/text_box]
      [/ux_banner]
    [/col]
  [/row]
[/section]
```

Required CSS:

```css
/* 1. Kill gap between the two sections */
.{section_class}-title,
.{section_class}-title .section-content {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.{section_class}-cards {
  margin-top: 0 !important;
  overflow-x: hidden !important;   /* ← MUST HAVE — prevents horizontal scroll */
}

/* 2. Remove container max-width */
.{section_class}-cards .section-content {
  max-width: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 100% !important;
  overflow: hidden !important;
}

/* 3. Make row truly full-width with flex */
.{section_class}-cards .row {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  flex-wrap: nowrap !important;
}
.{section_class}-cards .row::before,
.{section_class}-cards .row::after { display: none !important; }

/* 4. Equal columns, no padding */
.{section_class}-cards .row > .col {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  max-width: none !important;
  width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* 5. Hairline separator between cards */
.{section_class}-cards .row > .col + .col {
  border-left: 2px solid #fff !important;
}
```

**Description show/hide pattern** — hide description by default, reveal on hover, always-show via class on 3rd card:

```css
.{section_class}-desc {
  opacity: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
  transition: opacity 0.3s ease, max-height 0.35s ease !important;
}
.{section_class}-card:hover .{section_class}-desc {
  opacity: 1 !important;
  max-height: 140px !important;
}
.{section_class}-card.{section_class}--active .{section_class}-desc {
  opacity: 1 !important;
  max-height: 140px !important;
}
```

**Mobile**: revert to stacked layout with `flex-wrap: wrap` and `flex: 0 0 100%` on columns.

---

## Generalized Pattern: Adjacent Flatsome Section Gap

Flatsome sections rendered back-to-back can have implicit spacing between them — even when `padding-bottom=0` is set on the first section. This happens because Flatsome's `.section-content` or the browser default margin on `<section>` adds extra space.

**Fix**: assign classes to both sections and zero out all spacing explicitly:

```css
.{section_class}-top {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.{section_class}-top .section-content {
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
.{section_class}-bottom {
  margin-top: 0 !important;
  padding-top: 0 !important;   /* override via shortcode padding param too */
}
```

Also set the shortcode attributes: first section uses `padding="Xpx 0 0"` (no bottom pad) and second section uses `padding="0 0 Xpx"` (no top pad).

---

## Flatsome UX Block Post Type: `blocks` not `ux_block`

Flatsome registers UX Blocks with post type `blocks` — **not** `ux_block`. Creating a block with post_type `ux_block` via WP-CLI causes it to:
- Not appear in WP Admin → UX Blocks list
- Not be selectable in Customizer → Custom Footer/Header Block dropdown
- Show "The ux_block post type is not available for UX Builder" error

**Fix** — always use `post_type=blocks` when creating UX Blocks:
```bash
wp post create --post_type=blocks --post_title="My Block" --post_status=publish --post_author=1
```

If a block was already created with `ux_block`, migrate it:
```bash
wp eval 'global $wpdb; $wpdb->update($wpdb->posts, ["post_type"=>"blocks"], ["ID"=>BLOCK_ID]); wp_cache_flush();'
```

Also set `post_author` to a valid user ID — blocks with `post_author=0` are hidden from the admin list.

---

## CSS @import Font Must Be Enqueued via wp_enqueue_style

CSS `@import` rules are only processed by browsers when they appear **before all other CSS rules** in the stylesheet. In a child theme's `style.css`, any `@import` added after the first rule (e.g. appended to the bottom) will be silently ignored by all modern browsers.

**Wrong** — appending Google Fonts import to style.css:
```css
/* ...hundreds of lines of CSS... */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro&display=swap');
```

**Correct** — enqueue via `functions.php`:
```php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('google-fonts-name',
        'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap',
        [], null);
    // Also add preconnect hints:
}, 25);

add_action('wp_head', function() { ?>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<?php }, 1);
```

## Final Response Habit

When a design task adds reusable knowledge and the user has requested ongoing skill updates, final responses should mention whether the skill was updated and which general lesson was captured. If no reusable lesson was found, say no skill update was needed.
