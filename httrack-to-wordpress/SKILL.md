---
name: httrack-to-wordpress
description: "End-to-end pipeline for cloning a live website with HTTrack and converting the static mirror into a pixel-perfect, fully-functional WordPress site (custom theme + SCF/ACF + custom post types + working forms). Covers the clone, site analysis, local WordPress environment setup (SQLite quick-start or Local by Flywheel), theme/template conversion, bulk content import via wp-cli, and the browser-screenshot QA loop that catches the bugs curl/HTTP-status checks miss."
compatibility: "macOS/Linux. HTTrack (brew install httrack). PHP 8+, wp-cli. WordPress 6.0+ with Secure Custom Fields (free ACF fork) or ACF Pro. Optional: Local by Flywheel for a persistent GUI-managed local site. Playwright (via npx) for visual QA."
---

# HTTrack → WordPress Conversion Pipeline

Converts a live site into a 1:1 WordPress clone by first mirroring it statically (HTTrack), then rebuilding it as a real WordPress theme that reuses the original markup/CSS/JS almost verbatim, with WordPress (CPTs, taxonomies, SCF, native posts/pages) driving what used to be a dead backend CMS.

The two phases are independent — if the user already has a static mirror (e.g. handed you a folder), skip straight to "Phase 2: Analyze the mirror".

## When to use

- User says "chuyển website này sang WordPress", "clone site X rồi làm bản WordPress", or gives you a live URL / an existing HTTrack mirror folder and wants a WordPress version that looks and behaves identically.
- The source is a small-to-medium marketing/catalog site (not a single-page app — HTTrack only captures what plain `<a href>`/`<img src>` crawling reaches, it does not execute JS).

## Ground rules

- **Fidelity first.** Reuse the original HTML structure, class names, and CSS/JS files verbatim wherever possible. Don't "improve" the design unless the user asks — most visual bugs during conversion turn out to be transcription mistakes (see Phase 6), not opportunities for redesign.
- **Never edit a live/production site directly.** Always build and verify locally first.
- **Read entire template sections before transcribing them.** Partial reads lead to dropped closing tags — the single most damaging bug class in this workflow (see Phase 6.1).
- **Verify with real browser screenshots, not just HTTP status codes.** `curl` returning 200 and "no PHP fatal error in output" proves the page didn't crash; it proves nothing about whether the layout or JS actually works. Budget time for the Playwright QA pass — do not skip it.

---

## Phase 1: Clone the site with HTTrack

```bash
brew install httrack   # if not already installed
cd ~/Desktop   # or wherever the mirror should land
httrack "https://example.com" -O "./example-mirror" \
  "+*.example.com/*" -v \
  --user-agent "Mozilla/5.0 (compatible; HTTrack)" \
  --max-rate=500000 --sockets=8
```

Notes:
- `-O` sets the output directory. HTTrack creates `hts-cache/` alongside it — leave that, it's resume state.
- Restrict the scope (`+*.example.com/*`) so it doesn't wander off-domain.
- If the site blocks the default HTTrack user-agent, override it as shown.
- For a big catalog site this can take a while — run it in the background and poll, don't block the conversation on it.
- HTTrack cannot capture anything that only appears after JS execution (infinite scroll, client-side rendered product grids, lazy-loaded data fetched via XHR after load). If the resulting mirror is missing obvious content, tell the user this limitation exists rather than silently working around it — see Phase 6.5 for a real example (5 images that were never captured because they were lazy-loaded and HTTrack doesn't run JS).

---

## Phase 2: Analyze the mirror before writing any code

Spend real time here — the architecture decisions in Phase 3 depend on what you find. Use `grep`/`find`, not a full manual read of every file; delegate wide file-enumeration to an Explore/general-purpose agent if the site has 100+ pages.

Answer these questions:

1. **How many distinct page *templates* are there, really?** A 200-page site is often only 5-8 unique layouts (home, category listing, item detail, blog list, blog post, 4-6 static pages). Group files by shared markup pattern, not by raw file count.
2. **Is CSS/JS centralized or per-page?** Check `<link>`/`<script src>` tags across a few pages of each type. A single global stylesheet (common) massively simplifies the theme build — you enqueue it once instead of per-template.
3. **Is there critical inline CSS in `<head>` that ISN'T in the external stylesheet?** Some sites (especially ones built with a "critical CSS" optimization step) inline a chunk of `<style>` in the homepage's `<head>` that never appears in the linked `.css` file. If you drop this when writing `header.php`, entire layout systems (fixed header, CSS Grid rules, absolute-positioned captions) silently stop working and only the homepage looks broken. **Diff the homepage's inline `<style>` block against the external stylesheet; if content exists only inline, keep it inline in your `header.php`.**
4. **What's boilerplate vs. per-item content on detail pages?** On a product/article detail page, diff the same section across two different items. Tabs, FAQ accordions, "related items" carousels, and shipping/policy blocks are very often *identical HTML repeated on every page* — global boilerplate, not per-item data. Finding this early turns "import 150 pages of content" into "import 150 titles/images + hardcode one shared block."
5. **What forms exist, and where do they post?** Old sites built on a dead CMS (ThinkPHP, a defunct SaaS builder, etc.) post forms to `index.php/api/...` endpoints that no longer exist in a static mirror. List every `<form action="...">` across the site now — you'll need a WordPress-native replacement for each one in Phase 5.
6. **Is there a combined "all items" listing page separate from per-category listings?** (e.g. a `/hats/` page unioning every category.) Don't double-import from it — it's redundant with the per-category pages.

Use a background `Agent` (general-purpose) to do the bulk mechanical extraction once you know the pattern — e.g. "read every product page in these 8 category folders, pull out {title, main image, gallery images, the one per-item content block}, skip the boilerplate tabs, write it to a single JSON manifest." This scales to hundreds of pages without you reading each one by hand. Keep architecturally significant templates (home, header/footer, product detail, category archive) for yourself; delegate repetitive/mechanical ports (near-identical static pages, JSON extraction) to agents.

---

## Phase 3: Stand up a local WordPress environment

Two paths — pick based on what the user needs:

### 3a. Quick-start: standalone WP + SQLite (no MySQL, no GUI app)

Good for: fast iteration during the build, no dependency on anything already installed.

```bash
mkdir wordpress && cd wordpress
php -d memory_limit=512M "$(which wp)" core download --locale=en_US
# wp-cli often needs more memory than default cli php.ini allows — always pass -d memory_limit=512M

php -d memory_limit=512M "$(which wp)" config create --dbname=x --dbuser=root --dbpass=root --dbhost=localhost --skip-check

mkdir -p wp-content/plugins
curl -sL -o /tmp/sqlite-db.zip "https://downloads.wordpress.org/plugin/sqlite-database-integration.zip"
unzip -q /tmp/sqlite-db.zip -d wp-content/plugins/
cp wp-content/plugins/sqlite-database-integration/db.copy wp-content/db.php

php -d memory_limit=512M "$(which wp)" core install --url="http://localhost:8890" \
  --title="Site" --admin_user=admin --admin_password=admin123 \
  --admin_email=<user's email> --skip-email

php -d memory_limit=512M "$(which wp)" plugin install secure-custom-fields --activate

php -S localhost:8890 &   # or run persistently via a wpcli wrapper script + nohup
```

Make a `bin/wpcli` wrapper (`php -d memory_limit=512M -d error_reporting="E_ALL & ~E_DEPRECATED" -d display_errors=stderr "$(which wp)" "$@"`) — saves re-typing the flags and silences noisy wp-cli-internal deprecation warnings that otherwise pollute every command's output and can corrupt captured shell variables (a real failure mode: a `$(wp post create --porcelain)` capture that includes interleaved "Deprecated:" text is not a valid post ID).

Never try to fix a broken system MySQL install (permission errors on `/usr/local/mysql/data`, etc.) just to satisfy `wp core install` — that's a system-level change with its own risk; the SQLite path sidesteps it entirely for local dev.

### 3b. Local by Flywheel (persistent, GUI-managed, real MySQL)

Good for: the user already uses Local for their other sites, or wants something that survives reboots without you managing a background process.

**You cannot safely create a new Local site from the terminal if the Local app is currently running** — its site registry (`~/Library/Application Support/Local/sites.json`) is live-managed by the running app; hand-editing it risks corrupting the config for the user's *other* sites. Ask the user to click **"+ Add Site"** in the Local GUI themselves (30 seconds), get the site name back, then take over:

```bash
# Find the new site's MySQL socket + PHP-FPM port from Local's registry:
python3 -c "
import json
d = json.load(open('/Users/hungpham/Library/Application Support/Local/sites.json'))
for k,v in d.items():
    if v.get('name') == '<site-name>':
        print(v['id'], v['services']['mysql']['ports'])
"
# Socket lives at:
# ~/Library/Application Support/Local/run/<site-id>/mysql/mysqld.sock

SOCK="/Users/hungpham/Library/Application Support/Local/run/<site-id>/mysql/mysqld.sock"
SITE="/Users/hungpham/Local Sites/<site-name>/app/public"

# Don't edit wp-config.php's DB_HOST — Local's own PHP has this socket wired in
# via its own php.ini. For YOUR wp-cli calls (using your own PHP binary, not
# Local's bundled one), override the socket via ini flags instead:
php -d memory_limit=512M -d "mysqli.default_socket=$SOCK" -d "pdo_mysql.default_socket=$SOCK" \
  "$(which wp)" --path="$SITE" core version
```

Wrap that into a `bin/wpcli-<site-name>` script (see Phase 3a's wrapper pattern) so every subsequent command is one line.

**Before touching anything in `~/Local Sites/`, check whether a site with a similar/matching name already exists and is NOT something you created this session.** Real prior work (a different theme, WooCommerce data, uploads going back years) can be sitting right next to what you're about to build. Inspect (`ls wp-content/themes`, `ls wp-content/plugins`, file mtimes) and ask the user what it is before assuming it's disposable or relevant — don't guess, and don't touch it either way until they've told you.

---

## Phase 4: Build the theme

Structure (standard, nothing exotic):

```
wp-content/themes/<theme>/
  style.css              # just the required WP theme header comment
  functions.php          # requires everything in inc/
  inc/
    cpt-<name>.php        # register_post_type / register_taxonomy
    rewrites.php          # custom pretty-URL rewrite rules + permalink filters
    enqueue.php           # wp_register_script/style + conditional wp_enqueue per template
    forms.php             # wp_mail-backed replacements for the dead CMS's forms
    acf-fields.php         # acf_add_local_field_group() — SCF/ACF field registration in PHP
    helpers.php            # kx_field() ACF-with-fallback helper, shared partials
  header.php / footer.php  # ported from the original site's shared chrome
  front-page.php            # homepage
  single-<cpt>.php           # item detail
  taxonomy-<tax>.php          # category archive
  page-<slug>.php               # one per static page that needs custom markup
  home.php / single.php          # if using native `post` for a blog section
  assets/                          # the ORIGINAL site's css/js/fonts/images, copied verbatim
```

### 4.1 — Copy original assets verbatim

```bash
cp -R <mirror>/themes/<theme-dir> <wp-theme>/assets/
cp <mirror>/data <wp-theme>/assets/data -R   # all decorative/marketing images referenced site-wide
```
Reference these via a `KX_ASSETS` constant (`get_template_directory_uri() . '/assets'`) rather than re-uploading every decorative image into the WP media library — only images that need to be *real WP attachments* (product featured images / ACF galleries, because the CPT needs an attachment ID) get sideloaded during import (Phase 5). Everything else (homepage marketing photos, icon sprites, backgrounds) is fine as a static file reference.

### 4.2 — CPT + taxonomy + custom pretty URLs

If the original site nests item URLs under a category (`/category-slug/item-slug/`), WordPress's default CPT/taxonomy rewrite machinery can't produce that on its own. Register both with `'rewrite' => false` and do it by hand:

```php
add_rewrite_rule('^(cat1|cat2|cat3)/([^/]+)/?$', 'index.php?my_cpt=$matches[2]', 'top');
add_rewrite_rule('^(cat1|cat2|cat3)/?$', 'index.php?my_tax=$matches[1]', 'top');

add_filter('post_type_link', function($link, $post) {
    if ($post->post_type !== 'my_cpt') return $link;
    $terms = get_the_terms($post, 'my_tax');
    $slug = $terms ? $terms[0]->slug : 'default';
    return home_url("/$slug/{$post->post_name}/");
}, 10, 2);

add_filter('term_link', function($url, $term, $tax) {
    return $tax === 'my_tax' ? home_url("/{$term->slug}/") : $url;
}, 10, 3);
```
Flush rewrite rules once after registering (guard with an option flag so it doesn't run on every request).

### 4.3 — Enqueue scripts in the RIGHT position (head vs. footer)

**This is the single most common functional bug in this pipeline.** Check where each `<script>` tag actually sits in the original page (view several page types, not just one) — most non-library scripts (anything that does `$(".foo").click(...)` or similar at top level, not wrapped in a ready handler) were loaded at the *bottom* of `<body>`, after the DOM they operate on already exists. If you `wp_enqueue_script()` those with the default (`$in_footer = false`, i.e. `<head>`), the script runs before its target elements exist, `$(".foo")` matches zero elements, and the click handler silently binds to nothing — no console error, the feature just doesn't work. (Symptom seen in practice: a multi-step form's "choose an option" tabs did nothing on click; root cause was exactly this.)

```php
wp_register_script($handle, $src, array('jquery'), null, true);  // true = footer, matches original
```

Any inline `<script>` block you write yourself in a template that calls a library function (`new Swiper(...)`, `baguetteBox.run(...)`, etc.) must be wrapped so it runs *after* that library has loaded, regardless of where in the template it physically sits relative to the enqueued script:
```php
<script>jQuery(function($){ var s = new Swiper(...); }); </script>
```
Also watch inter-script dependencies: if script B calls a function defined by script A (e.g. a slider plugin's init call living in a separate `script.js` that's loaded after the plugin file `pluginname.js`), declare that dependency explicitly (`wp_register_script('script-b', ..., array('jquery','plugin-a'), ...)`) — enqueue call order alone does not guarantee output order once both are footer-scoped.

### 4.4 — Forms: replace the dead backend, keep the markup

For each form found in Phase 2, keep the exact field names/markup, change only:
- `<form action="...">` → `admin_url('admin-post.php')`
- add a hidden `action` field + `wp_nonce_field()`
- write a handler on `admin_post_{action}` / `admin_post_nopriv_{action}` that validates, sanitizes, and `wp_mail()`s the admin

If the original used a server-generated image CAPTCHA (common on old CMSs, backed by an endpoint that no longer exists in the static mirror), it cannot be ported — replace with an equivalent simple challenge (e.g. a random arithmetic question via `wp_rand()` + a short-lived `set_transient()`), keeping the same label/layout so the visual design is preserved. Tell the user this one piece is a functional-equivalent replacement, not a literal port, since the original mechanism is fundamentally unportable.

For a file-upload form, use `wp_handle_upload()` per file and either attach the resulting URLs in the notification email or `wp_insert_attachment()` them — don't try to replicate obscure per-field JS naming schemes exactly; only the parts a human reads (name, email, message, links to uploaded files) need to survive.

### 4.5 — ACF/SCF field registration + admin usability

Register fields with `acf_add_local_field_group()` in `acf-fields.php`, guarded by `acf/init`. For the item CPT this usually means: a WYSIWYG "key details" field (with a plain fallback via `the_content()`), and a `gallery` field (SCF/ACF-Pro-only field type; SCF's free tier includes it, ACF's free tier does not — check which is installed).

**If the CPT ends up using the block editor, ACF fields get relegated to a collapsed "Meta Boxes" panel at the very bottom of the edit screen** — technically present, but easy to miss and annoying to reach. Force Classic Editor for that one post type so the ACF box renders immediately below the title, which is what a content editor actually expects:
```php
add_filter('use_block_editor_for_post_type', function($use, $post_type) {
    return $post_type === 'my_cpt' ? false : $use;
}, 10, 2);
```
This is a real usability requirement, not a cosmetic nicety — confirm the admin edit screen actually looks usable (screenshot it) before calling the build done.

---

## Phase 5: Bulk-import content via wp-cli

Write one `importer.php` designed to run via `wp eval-file` (gives you the full WP + `WP_CLI::log/success/warning` API):

1. Create static Pages (`wp_insert_post`, `post_type => page`), assigning `_wp_page_template` meta to point at the right `page-<slug>.php`.
2. Set `show_on_front = page`. **Also explicitly create a placeholder "Home" page and set `page_on_front` to its ID.** Leaving `page_on_front` at `0` while `show_on_front = page` makes WordPress fall back to rendering the *posts index* at `/` instead of `front-page.php` — a real bug hit in practice that silently swapped the homepage for the blog listing. Set `page_for_posts` to a separate "Blog" page if the site has one; `home.php`/`index.php` will render that automatically.
3. For each item in the JSON manifest built in Phase 2: `wp_insert_post` the CPT entry, `wp_set_object_terms` the category, sideload the main image (`wp_upload_bits` + `wp_insert_attachment` + `wp_generate_attachment_metadata`, cache by source path in-memory so a duplicate reference doesn't re-upload), `set_post_thumbnail`, `update_field()` the gallery (array of attachment IDs) and the WYSIWYG field.
4. Handle case-mismatched file extensions defensively (`.JPG` referenced in HTML vs `.jpg` on disk is common from lazy-load attribute inconsistencies) — resolve with a case-insensitive `scandir()` fallback rather than failing the whole import on one file.
5. Run it: `wp eval-file importer.php --path=<site>` (bump `-d memory_limit` if importing 50+ images — this genuinely needs more than PHP's CLI default).

After import: delete the default "Hello world" post, flush rewrite rules once more.

---

## Phase 6: QA — verify with a real browser, not just curl

`curl -s | grep "fatal error"` only proves PHP didn't crash. It will not catch broken layouts, dead JS interactivity, or malformed HTML that only a browser's parser reveals. Install a real headless browser and actually look:

```bash
mkdir -p <scratch>/pw && cd <scratch>/pw && npm init -y >/dev/null 2>&1
npm install playwright && npx playwright install chromium
```

Then script full-page and section screenshots, and — critically — **interaction tests**, not just static renders:
```js
await page.locator('#some-tab').click();
await page.waitForTimeout(200);
console.log(await page.locator('#some-tab').getAttribute('class'));  // did the "active" class actually apply?
```
And a page-error sweep across every template type:
```js
page.on('pageerror', err => errors.push(err.message));
await page.goto(url, { waitUntil: 'networkidle' });
```

### 6.1 — The #1 bug source: a single dropped closing tag

When hand-transcribing original markup into a PHP template (especially banner/slider sections with several similar `<div class="item">...</div>` blocks), it is very easy to drop one `</a>` while copying. Because of the HTML5 parser's "adoption agency algorithm," an unclosed inline element (`<a>`, `<span>`, etc.) doesn't just break its own containing block — the browser keeps it in the "active formatting elements" list and re-inserts/clones it into *every subsequent nested element for the rest of the document*, corrupting grid layouts, breaking `:first-child` CSS selectors, and producing symptoms that look nothing like "one missing tag" (text overlapping unrelated elements, a listing further down the page rendering with only one item instead of several, spacing collapsing). If a page looks broken in a way that doesn't map cleanly to any single CSS rule, **diff the raw server HTML for stray/duplicated anchor tags before debugging CSS**:
```bash
curl -s <url> | grep -A3 'class="the-broken-section"'
```
Clean output there but a broken *rendered* DOM (test with `javaScriptEnabled: false` in Playwright to rule out JS-driven corruption) means an unclosed tag earlier in the same document. Fix that one tag; do not "fix" the symptom by deleting content the user actually wants kept — restore the original content once the real cause is found.

### 6.2 — Don't fix real bugs by cutting content

If a design element looks broken (e.g. two text layers overlapping), the fast wrong move is to delete one of them. Find the actual root cause first (see 6.1) — cutting content changes the design without the user's sign-off and will get flagged the moment they compare against the source they gave you.

### 6.3 — Missing plugin dependency in the footer

If you moved scripts to the footer per 4.3, and one script calls a jQuery plugin method defined by *another* script (`jQuery(...).someWidget()`), verify their relative order survived the move — a console error like `jQuery(...).someWidget is not a function` means the caller loaded before its plugin. Fix with an explicit `wp_register_script` dependency array, not by reordering enqueue calls (unreliable once both are footer-scoped).

### 6.4 — Re-verify after every fix

Each fix in this phase can affect other pages (a global CSS/enqueue change touches every template). After any fix, re-run the full page + interaction sweep, not just the one page that was reported broken.

### 6.5 — Some "bugs" are inherited from the source mirror, not conversion bugs

If a broken image traces back to a file that genuinely doesn't exist anywhere in the HTTrack mirror (check `find <mirror> -iname "<filename>"`), it was never captured by the crawl (usually a lazy-loaded image HTTrack's static crawler couldn't trigger) — not something introduced by the conversion. Say so plainly and move on; don't spend time trying to conjure a file that was never there.

---

## Phase 7: Deploy the built theme to a second/target environment

Same theme + importer works unchanged against a different WordPress install (e.g. moving from the SQLite quick-start to a Local by Flywheel site, or to production hosting) — just re-run Phase 4's asset copy and Phase 5's importer against the new `--path`/DB. Point `bin/wpcli-<target>` at the new site's DB connection (socket or TCP) per Phase 3b, re-activate the theme, re-fix `page_on_front` (Phase 5 step 2 — this bites again on a fresh install), re-flush rewrites, then repeat the Phase 6 QA sweep against the new URL before declaring it done. Never assume "it worked on the first environment" is sufficient proof for the second one.
