# Page Template Patterns for Flatsome

> Use these patterns when converting HTML to a PHP page template in the Flatsome child theme (Approach B). This gives full code control while still running within the Flatsome ecosystem.

## Two template strategies

### Strategy 1: Standalone template (bypasses Flatsome header/footer)

Use when the landing page has its own custom nav and footer that differ from the main site:

```php
<?php
/*
Template Name: My Landing Page
*/

// Helpers and variables here...
?>
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="...">
<style>...</style>
<?php wp_head(); ?>
</head>
<body>
  <!-- Custom nav, sections, footer -->
  <?php /* filtered wp_footer() */ ?>
</body>
</html>
```

This is 100% custom — no Flatsome header/footer renders. The page loads Flatsome's core but you control all HTML output.

### Strategy 2: Flatsome-wrapped template (uses Flatsome header/footer)

Use when you want to keep Flatsome's existing header and footer but customize the page body:

```php
<?php
/*
Template Name: My Custom Page
*/

get_header(); ?>

<div id="content" role="main" class="content-area">
  <!-- Custom page content here -->
  <section class="hpb-hero">
    ...
  </section>

  <section class="hpb-services">
    ...
  </section>
</div>

<?php get_footer(); ?>
```

**Pros**: Inherits site nav, footer, mobile menu, cart icon, etc.
**Cons**: Flatsome theme CSS/JS always loads (no stripping possible), header/footer design may not match landing page.

### When to use which

| Factor | Standalone | Flatsome-wrapped |
|--------|-----------|-----------------|
| Custom nav design | ✅ | ❌ (uses Flatsome nav) |
| Speed optimization | ✅ (strip assets) | ❌ (full Flatsome loads) |
| Site-wide nav consistency | ❌ | ✅ |
| WooCommerce cart in header | ❌ (custom) | ✅ (built-in) |
| Mobile menu | Custom | ✅ Flatsome built-in |

---

## Standalone template structure (full example)

```php
<?php
/*
Template Name: HPB Media Landing
*/

// Helper: get ACF field with fallback.
function hpb_field( $name, $default = '' ) {
    if ( ! function_exists( 'get_field' ) ) {
        return $default;
    }
    $val = get_field( $name );
    return ( $val !== null && $val !== '' && $val !== false ) ? $val : $default;
}

// Shared variables.
$logo  = hpb_field( 'hpb_logo', 'HPB' );
$phone = hpb_field( 'hpb_phone', '0123 456 789' );
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- External assets -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

<!-- Inline CSS with minification -->
<style><?php ob_start(); ?>
  /* All CSS here */
<?php
$css = ob_get_clean();
$css = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css);
$css = preg_replace('/\s+/', ' ', $css);
$css = preg_replace('/\s*([{}:;,])\s*/', '$1', $css);
$css = str_replace(';}', '}', $css);
echo trim($css);
?></style>

<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<!-- NAV -->
<nav class="hpb-nav">
  ...
</nav>

<!-- HERO -->
<section class="hpb-hero">
  ...
</section>

<!-- More sections... -->

<!-- FOOTER -->
<footer class="hpb-footer">
  ...
</footer>

<?php
// Filtered wp_footer — keep form plugins, strip everything else.
ob_start();
wp_footer();
$wp_footer_output = ob_get_clean();
$wp_footer_output = preg_replace( '/<link[^>]*rel=[\'"]stylesheet[\'"][^>]*>/i', '', $wp_footer_output );
$keep_js = array( 'rocket', 'lazyload', 'contact-form-7', 'wpcf7', 'swv', 'wp-i18n', 'wp-hooks', 'wp-polyfill', 'wp-includes' );
$wp_footer_output = preg_replace_callback(
    '/<script\b[^>]*>.*?<\/script>/si',
    function( $m ) use ( $keep_js ) {
        foreach ( $keep_js as $k ) {
            if ( stripos( $m[0], $k ) !== false ) {
                return $m[0];
            }
        }
        return '';
    },
    $wp_footer_output
);
echo $wp_footer_output;
?>
</body>
</html>
```

---

## Flatsome-wrapped template structure (full example)

```php
<?php
/*
Template Name: HPB Custom Page
*/

get_header(); ?>

<main id="main" class="hpb-page">

  <!-- Hero Section -->
  <section class="hpb-hero">
    <div class="hpb-container">
      <div class="hpb-hero-tag">Badge text</div>
      <h1>Title <em>highlight</em></h1>
      <p class="hpb-hero-sub">Description</p>
      <div class="hpb-hero-btns">
        <a href="#" class="hpb-btn-primary">CTA</a>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="hpb-services">
    <div class="hpb-container">
      <h2 class="hpb-section-title">Title</h2>
      <div class="hpb-grid hpb-grid--4">
        <?php if ( function_exists('have_rows') && have_rows('services') ) : ?>
          <?php while ( have_rows('services') ) : the_row(); ?>
            <div class="hpb-card">
              <h3><?php echo esc_html( get_sub_field('title') ); ?></h3>
              <p><?php echo esc_html( get_sub_field('desc') ); ?></p>
            </div>
          <?php endwhile; ?>
        <?php endif; ?>
      </div>
    </div>
  </section>

</main>

<?php get_footer(); ?>
```

**CSS in child theme `style.css`:**
```css
/* Container matching Flatsome's max-width */
.hpb-container {
  max-width: var(--container-max-width, 1200px);
  margin: 0 auto;
  padding: 0 15px;
}

/* Grid system */
.hpb-grid { display: grid; gap: 1.25rem; }
.hpb-grid--4 { grid-template-columns: repeat(4, 1fr); }
.hpb-grid--3 { grid-template-columns: repeat(3, 1fr); }
.hpb-grid--2 { grid-template-columns: repeat(2, 1fr); }

@media (max-width: 849px) {
  .hpb-grid--4, .hpb-grid--3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 549px) {
  .hpb-grid--4, .hpb-grid--3, .hpb-grid--2 { grid-template-columns: 1fr; }
}
```

---

## CSS: inline vs child theme style.css

### When to use inline `<style>` (in the template)

- **Standalone template** that strips all theme CSS — must inline everything
- **Page-specific styles** that should only load on this template
- **Dynamic CSS values** from ACF fields (e.g., custom colors)

### When to use child theme `style.css`

- **Flatsome-wrapped template** — child theme CSS loads automatically
- **Shared styles** used across multiple templates/pages
- **Overriding Flatsome defaults** — specificity battles are easier in a dedicated stylesheet

### Hybrid approach (recommended)

Put **design tokens and shared components** in `style.css`, and **page-specific structure** in inline `<style>`:

```php
<!-- In style.css: design tokens, shared card styles, typography -->

<!-- In template inline <style>: hero positioning, section-specific layouts -->
<style><?php ob_start(); ?>
  .hpb-hero { min-height: 90vh; /* page-specific */ }
<?php /* minify and echo */ ?></style>
```

---

## Using Flatsome theme options in templates

Access Flatsome's theme settings:

```php
// Get Flatsome options
$primary_color  = get_theme_mod( 'color_primary', '#446084' );
$header_height  = get_flatsome_opt( 'header_height' );
$container_width = get_flatsome_opt( 'body_layout_width' );

// Use in template
<div style="max-width: <?php echo esc_attr( $container_width ); ?>px;">
```

---

## Asset stripping for standalone templates

In `functions.php`, add the same asset stripping pattern as `devvn-html-to-wp-acf`:

```php
add_action( 'template_redirect', 'hpb_strip_assets_on_landing' );

function hpb_strip_assets_on_landing() : void {
    if ( ! is_page_template( 'page-hpb-media.php' ) ) {
        return;
    }

    add_filter( 'show_admin_bar', '__return_false' );

    add_action( 'wp_enqueue_scripts', function () {
        global $wp_scripts, $wp_styles;

        $keep_roots = array( 'contact-form-7', 'wpcf7-recaptcha', 'swv' );
        // ... recursive dependency resolution (see devvn-html-to-wp-acf skill)

        // Strip all styles
        if ( $wp_styles instanceof WP_Styles ) {
            foreach ( $wp_styles->queue as $handle ) {
                wp_dequeue_style( $handle );
                wp_deregister_style( $handle );
            }
        }
    }, 9999 );

    // Remove Flatsome-specific actions
    remove_action( 'wp_head', 'flatsome_custom_css', 100 );
    remove_action( 'wp_footer', 'flatsome_mobile_menu', 7 );

    // Remove WP core noise
    remove_action( 'wp_head', 'wp_print_styles', 8 );
    remove_action( 'wp_head', 'wp_print_head_scripts', 9 );
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'wp_enqueue_scripts', 'wp_enqueue_global_styles' );
    remove_action( 'wp_body_open', 'wp_global_styles_render_svg_filters' );
    remove_action( 'wp_footer', 'wp_enqueue_global_styles', 1 );
    remove_action( 'wp_head', 'wp_oembed_add_host_js' );
}
```

> **Note**: For Flatsome-wrapped templates using `get_header()` / `get_footer()`, do NOT strip assets — Flatsome's header/footer need them.

---

## Classic Editor for template

Flatsome may use either block editor or classic editor. For ACF compatibility, force Classic Editor:

```php
add_filter( 'use_block_editor_for_post', function ( $use, $post ) {
    $template = get_page_template_slug( $post );
    $classic_templates = array( 'page-hpb-media.php' );
    if ( in_array( $template, $classic_templates, true ) ) {
        return false;
    }
    return $use;
}, 10, 2 );
```

---

## Multiple templates

If you have multiple landing page templates, extend `is_page_template()` with an array:

```php
$landing_templates = array( 'page-hpb-media.php', 'page-campaign.php' );
if ( ! is_page_template( $landing_templates ) ) {
    return;
}
```
