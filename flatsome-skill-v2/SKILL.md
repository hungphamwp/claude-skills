---
name: flatsome
description: "Convert static HTML landing pages into WordPress pages using Flatsome theme's UX Builder shortcodes and child theme CSS. Covers two approaches: (A) UX Builder shortcode-based for visual editing, and (B) PHP page template for full code control. Includes comprehensive shortcode reference (verified from source code), 67 action + 67 filter hooks, CSS migration, responsive handling, deployment via MySQL, and full official documentation reference from docs.uxthemes.com (130+ articles)."
compatibility: "WordPress 6.0+ with Flatsome theme 3.15+. Flatsome child theme required. PHP 7.4+. Optional: ACF/SCF for dynamic fields in page template approach."
---

# HTML to WordPress + Flatsome Conversion

## ROLE
You are a professional WordPress developer specializing in building websites with the Flatsome theme on LocalWP.

## ABSOLUTE RULES — READ BEFORE DOING ANYTHING

- NEVER open a browser, Chrome, Playwright, or Selenium
- NEVER log into WP Admin through any GUI
- NEVER use a graphical interface to operate WordPress
- NEVER edit files inside `/wp-content/themes/flatsome/` — always use flatsome-child

## TOOL PRIORITY ORDER (immutable)
1. **WP-CLI** → all WordPress operations (pages, menus, options, plugins)
2. **Bash / filesystem** → read/write `.php`, `.css`, `.js` files
3. **MySQL CLI** → direct DB queries only when WP-CLI is unavailable

---

## ENVIRONMENT — LocalWP

### WP-CLI Setup
On LocalWP, you need to configure the specific PHP binary (or use UNIX sockets if unavailable).
```bash
# macOS Apple Silicon
export WP_CLI_PHP="/Applications/Local.app/Contents/Resources/extraResources/lightning-services/php-8.2.29+0/bin/darwin-arm64/bin/php"

# macOS Intel
export WP_CLI_PHP="/Applications/Local.app/Contents/Resources/extraResources/lightning-services/php-8.2.29+0/bin/darwin-x64/bin/php"

# Verify functionality
wp core version && wp option get siteurl
```

### Pre-flight checks
```bash
wp theme list --status=active
wp plugin list --status=active --fields=name,version
wp theme list | grep flatsome-child
```

### Fallback — MySQL when WP-CLI is sandboxed by LocalWP
```bash
MYSQL="$HOME/Library/Application Support/Local/lightning-services/mysql-*/bin/darwin-arm64/bin/mysql"
SOCK=$(find "$HOME/Library/Application Support/Local/run" -name "mysqld.sock" 2>/dev/null | head -1)

# Find page ID by slug
$MYSQL --socket="$SOCK" -u root -proot local -e   "SELECT ID, post_title FROM wp_posts WHERE post_name='page-slug' AND post_type='page'"

# Update page content safely
python3 -c "
with open('shortcodes.html','r') as f: c=f.read()
c=c.replace('\\\\','\\\\\\\\').replace(\"'\",'\\\\\\'' )
sql=\"UPDATE wp_posts SET post_content='\"+c+\"' WHERE ID=PAGE_ID;\"
open('_update.sql','w').write(sql)
"
$MYSQL --socket="$SOCK" -u root -proot local < _update.sql && rm -f _update.sql
```

---

## When to use this Skill
Use this skill when converting a static HTML page into a WordPress page running on the Flatsome theme:

- Converting a standalone `.html` file into Flatsome UX Builder shortcodes (Approach A)
- Converting a standalone `.html` file into a child theme `.php` page template (Approach B)
- Migrating CSS from inline `<style>` to Flatsome child theme's `style.css`
- Mapping HTML elements to Flatsome shortcode equivalents
- Optimizing the converted page for responsive display across devices
- Setting up proper CSS design tokens in the child theme

> **Flexible approaches**:
> - **Approach A: UX Builder Shortcodes** — Flexible page structure using Shortcode Priority Levels. Best for pages the client will edit frequently.
> - **Approach B: PHP Page Template** — Pure code, 100% layout control. Best for pixel-perfect complex landing pages.

## Inputs required

- The source HTML file
- The Flatsome child theme directory
- Which approach to use (A: UX Builder shortcodes, B: PHP page template, or both)
- Any existing `style.css` and `functions.php` in the child theme

---

## PROJECT SETUP WORKFLOW

If starting a new project, always run this WP-CLI prep before converting HTML:

### MANDATORY: Sync First Protocol
Before making any changes to an existing page or form, you MUST first fetch the current content from the database using WP-CLI to ensure you are working with the latest version (as the USER may have made manual updates).
```bash
# Example for Page ID 12
wp post get 12 --field=post_content > current_content.txt
```

### Step 1 — Create child theme
```bash
THEMES_DIR=$(wp eval "echo get_theme_root();")
mkdir -p "$THEMES_DIR/flatsome-child"

cat > "$THEMES_DIR/flatsome-child/style.css" << 'CSS'
/*
Theme Name:   Flatsome Child
Template:     flatsome
Version:      1.0.0
*/
@import url("../flatsome/style.css");
CSS

cat > "$THEMES_DIR/flatsome-child/functions.php" << 'PHP'
<?php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('flatsome-parent', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), ['flatsome-parent']);
});
PHP

wp theme activate flatsome-child
```

### Step 2 — Install default plugins
```bash
wp plugin install contact-form-7 --activate
wp plugin install wpcode-lite --activate
wp plugin install classic-editor --activate
```

### Step 3 — Create pages and menu
```bash
wp post create --post_type=page --post_title='Page Title' --post_status=publish --post_content='[SHORTCODE]'
wp option update show_on_front page
wp option update page_on_front PAGE_ID
wp menu create "Main Menu"
wp menu item add-post main-menu PAGE_ID
wp menu location assign main-menu primary
wp rewrite flush && wp cache flush
```

---

## UXBUILDER SHORTCODE SYSTEM

When converting layouts, **STRICTLY ADHERE** to this priority order:

### Priority order (immutable)
- **Level 1** → Native UXBuilder shortcodes: `[section]`, `[row]`, `[col]`, `[text_box]`
- **Level 2** → UXBuilder shortcodes + custom CSS class
- **Level 3** → `[ux_html]` with minimal raw HTML (When Flatsome tags don't support the required DOM)
- **Level 4** → WPCode PHP snippet (To attach logic/loops outside the editor)
- **Level 5** → PHP page template in child theme (Last resort only)

### Element Modularity Rule (critical)
NEVER combine multiple elements into one `[ux_text]` block:
- **WRONG**: `[ux_text] <h2>Title</h2> <p>Desc</p> <a>Button</a> [/ux_text]`
- **RIGHT**:
  `[ux_text] <h2>Title</h2> [/ux_text]`
  `[ux_text] <p>Desc</p> [/ux_text]`
  `[button text="Button"]`

Each distinct visual element must be its own shortcode block so the UX Builder layer tree remains fully draggable and editable.

### NEVER do these
- HTML comments containing `[...]` inside shortcode content (WP parses them as shortcodes)
- Nest `[row]`/`[col]` inside another `[col]`
- Use raw `<div class="card">` for layout — use `[col bg_color="#fff" depth="1"]` instead
- Use `[featured_box]` without a valid Media Library image ID

### Basic layout structure
```
[section bg_color="#fff" padding="80px 0"]
  [row]
    [col span="6" span__sm="12"]LEFT CONTENT[/col]
    [col span="6" span__sm="12"]RIGHT CONTENT[/col]
  [/row]
[/section]
```

### HTML → Shortcode mapping
| HTML Pattern | Proper Flatsome Structure | Use raw HTML? |
|---|---|---|
| Card with shadow | `[col bg_color="#fff" depth="1" bg_radius="10" padding="30px"]` | ❌ NEVER |
| Hero / Banner | `[ux_banner bg="ID" height="600px" bg_overlay="rgba(0,0,0,0.45)"]` | ❌ NEVER |
| Slider | `[ux_slider]` + `[ux_banner]` | ❌ NEVER |
| Testimonial | `[testimonial name="..."]` | ❌ NEVER |
| Button / CTA | `[button text="..." color="primary" size="large"]` | ❌ NEVER |
| FontAwesome icon box | `[col] [ux_text] <i class="fa fa-..."></i> [/ux_text] [/col]` | ❌ NEVER (Only for the `<i>` tag) |
| Logo grid | `[row slider="true"] [col span="2"] [ux_image id="ID"] [/col] [/row]` | ❌ NEVER |
| Stats counter | `[col] [ux_text] <h2>200+</h2> <p>Projects</p> [/ux_text] [/col]` | ❌ NEVER |

### Full hero example
```
[ux_banner bg="IMAGE_ID" height="600px" height__sm="400px" bg_overlay="rgba(0,0,0,0.45)"]
  [text_box width="60" width__sm="90" position_x="50" position_y="50" text_align="center"]
    [ux_text_box_title font_size="h1"]Main Headline[/ux_text_box_title]
    [ux_text]Short supporting description[/ux_text]
    [button text="Get Started" color="primary" size="large"]
  [/text_box]
[/ux_banner]
```

### Responsive attributes
- `span__sm="12"` → Full width on mobile
- `span__md="6"` → 2 columns on tablet
- `hide-for-medium` → Hide on tablet and below
- `show-for-small` → Show on mobile only
- `@media (max-width: 849px)` → Tablet breakpoint
- `@media (max-width: 549px)` → Mobile breakpoint

---

## Procedure

### 1) Analyze the HTML structure
1. Read the full HTML file and identify every content section
2. Map each section to a Flatsome component category (use the HTML → Shortcode mapping above)
3. Extract CSS custom properties (`:root` variables) for migration to child theme
4. Note responsive breakpoints and mobile-specific styles
5. Identify animations and transitions to replicate
6. **New Rule: Standardize Section Decorations.** High-end sites often use a decorative element (e.g., a red triangle or line) under section titles. Map these to CSS `::after` on `.mvl-section-title`.
7. **New Rule: Professional Branding.** Force header backgrounds and navigation colors via child theme CSS if UX Builder controls are insufficient for 100% clone accuracy.

### 2) Migrate CSS to child theme
1. Extract `:root` CSS custom properties from the HTML `<style>` block
2. Map them to Flatsome-compatible custom properties or new ones in `style.css`
3. Migrate component styles with proper class prefixes to avoid conflicts
4. Add responsive overrides using Flatsome's breakpoint system
5. Add animation keyframes if the HTML uses custom animations
6. Import external fonts if needed (Google Fonts via `@import` or `functions.php` enqueue)

**CSS RULES:**
- **Prefix all custom classes** with a project slug (e.g. `ldp-`, `spa-`, `hpb-`) to avoid conflicts with Flatsome's built-in classes.
- **Never edit Flatsome parent theme CSS** — all CSS goes in child theme's `style.css`.
- **Prefer system fonts:** `-apple-system`, `BlinkMacSystemFont`, `sans-serif` as the default for a native premium feel.
- **Avoid `!important`** except when overriding Flatsome defaults that block your design.
- **Header Branding:** Always check if the header needs deep custom colors that override the default Flatsome theme options.

### 3A) Convert to UX Builder shortcodes (Approach A)
For each HTML section, convert to the equivalent Flatsome shortcode structure:
1. **Wrap each section** in `[section]` with appropriate attributes (bg_color, padding, etc.)
2. **Create grid layout** with `[row]` and `[col]` matching the HTML grid
3. **Replace HTML elements** with Flatsome shortcode equivalents
4. **Add custom classes** to shortcodes for CSS targeting (using `class=""` attribute)
5. **Handle responsive** with Flatsome's visibility attributes and column spanning
6. **Override Flatsome shortcode styles** in `style.css` when the default look doesn't match the design

The shortcodes go into the WordPress page content (via Text editor or UX Builder).

### 3B) Convert to PHP page template (Approach B)
1. Create `page-{name}.php` in the child theme directory
2. Add `Template Name:` comment at the top
3. Keep the HTML structure mostly intact
4. Replace hardcoded content with ACF fields (if using ACF) or keep static
5. Add `wp_head()` and filtered `wp_footer()`
6. Apply CSS minification via output buffering
7. Add asset stripping in `functions.php`

### 4) Set up functions.php
Add to the child theme's `functions.php`:
1. **Enqueue external assets** (fonts, icon libraries) if needed
2. **Register custom shortcodes** for complex components not covered by Flatsome built-in shortcodes (Approach A only).
3. **Asset stripping** for page template approach (Approach B) — same as `devvn-html-to-wp-acf` skill

### 5) Verify and test
1. Check page renders correctly on desktop, tablet (849px), and mobile (549px)
2. Verify no Flatsome parent CSS conflicts with custom styles
3. Test UX Builder editing works (Approach A) — shortcodes render in builder preview
4. Verify page speed — no unnecessary CSS/JS loading
5. Check SEO — proper heading hierarchy, meta tags via SEO plugin

---

## DEBUGGING / FAILURE MODES

### Debugging with WP-CLI
```bash
# Check page content if layout is broken
wp post get PAGE_ID --field=post_content | head -100

# Search for missing/broken page by name
wp post list --post_type=page --search="Title" --fields=ID,post_title,post_status

# Toggle WP_DEBUG and Flush Cache
wp eval "echo WP_DEBUG ? 'ON' : 'OFF';"
wp rewrite flush
```

| Symptom | Cause | Fix |
|---------|-------|-----|
| White screen | Unclosed shortcode tag | Check `[/section]`, `[/row]`, `[/col]` tags |
| Shortcode shown as text / White page | Plugin not active | Run `wp plugin activate flatsome` (if applicable) or check missing shortcode tags |
| CSS not applying | Child theme not active or low specificity | Run `wp theme activate flatsome-child` or increase CSS specificity |
| WP-CLI path error (command not found) | Missing LocalWP PHP PATH | Set `export WP_CLI_PHP=...` according to the LocalWP setup guide |
| Broken shortcodes | HTML comment contains `[...]` | **Never use HTML comments inside shortcode content — WP parses them as shortcodes** |
| Nested layout broken | `[row]`/`[col]` nested inside `[col]` | **Never nest row/col inside another col — put elements directly** |
| UX Builder preview broken | Invalid shortcode nesting | Flatten nesting, avoid custom shortcodes inside UX Builder |
| Mobile layout broken | Missing responsive CSS | Add `@media (max-width: 849px)` and `549px` rules |
| Flatsome header/footer showing on template | Template doesn't bypass theme | Use `get_header()` / `get_footer()` or fully custom HTML |
| Icons not showing / Fonts broken | Font Awesome not loaded | Enqueue resources in `functions.php` or use built-in icons |
| Animations not working | CSS keyframes missing | Ensure `@keyframes` are in `style.css`, not stripped |
| Page template not in dropdown | Missing `Template Name` comment | Add `/* Template Name: Name */` at top of `.php` file |
| `[title]` shows "Lorem ipsum" | Content format mismatch | Use `[ux_text]<h2>Text</h2>[/ux_text]` instead of `[title]` |
| `[col]` inside `[col_inner]` shows raw shortcode | Invalid nesting | Only `[ux_text]` or `[ux_html]` inside `[col_inner]`, never `[col]` |
| Section `id` attribute ignored | Flatsome overrides with random ID | Inject anchor divs via JS — see reference §16 |
| CSS not applying on specific page | Wrong body class selector | Use `body.page-id-{ID}` not `body.page-slug-{slug}` |
| CSS cached after update | Static `?ver=3.0` query string | Add `filemtime()` cache bust — see reference §17 |
| Nav links invisible on transparent header | White text on white bg | Force `color: #334155 !important; opacity: 1 !important;` — see reference §20 |
| Tab click scrolls page | Flatsome default scroll behavior | Override click handler via `wp_footer` JS — see reference §18 |
| Tab inactive panels create gaps | `min-height` overrides hidden state | `.panel:not(.active) { height: 0 !important; }` — see reference §18 |
| Menu swap not working in Flatsome | `theme_location` not unset | Must `unset($args['theme_location'])` — see reference §19 |

---

## REFERENCES & ESCALATION

This skill includes the following reference documents:

| Document | Description |
|----------|-------------|
| `references/flatsome-official-docs.md` | **Complete official docs reference** — all 16 categories, 130+ articles from docs.uxthemes.com covering theme hooks (67 actions + 67 filters), navigation, shortcodes, WooCommerce, troubleshooting, snippets, performance, plugin compatibility |
| `references/flatsome-complete-reference.md` | Shortcode attribute reference verified from Flatsome source code |
| `references/shortcode-mapping.md` | HTML → Flatsome shortcode mapping table |
| `references/ux-builder-patterns.md` | Common UX Builder layout patterns |
| `references/page-template-patterns.md` | PHP page template patterns and examples |
| `references/css-migration.md` | CSS migration patterns and design tokens |
| `references/flatsome-hooks-development.md` | Development hooks and filters quick reference |
| `references/contact-form-7-setup.md` | **Contact Form 7 Complete Setup** — Tags, CSS styling, horizontal/vertical layouts, and Flatsome integration |

### Key Documentation Links
- Official docs: https://docs.uxthemes.com/
- Theme Hooks: https://docs.uxthemes.com/article/385-hooks

### Escalation
- If the HTML uses JavaScript frameworks (React, Vue) — this skill covers static HTML only
- If WooCommerce product page customization is needed — coordinate with Flatsome WooCommerce hooks (see `references/flatsome-official-docs.md` § WooCommerce)
- If Flatsome's UX Builder has bugs with specific shortcode nesting — use page template approach instead
- For advanced troubleshooting — see `references/flatsome-official-docs.md` § Troubleshooting
