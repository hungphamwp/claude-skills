# Flatsome Theme Hooks & Development Guide

> Source: [Official Docs — Theme Hooks](https://docs.uxthemes.com/article/385-hooks)
> Verified against: Flatsome 3.18+

## Quick Reference: Most Used Hooks

### Inject content at page positions

```php
// Add content right after header
add_action('flatsome_after_header', function() {
    echo '<div class="announcement-bar">Special offer!</div>';
});

// Add content before footer
add_action('flatsome_before_footer', function() {
    echo do_shortcode('[ux_banner bg_color="#2563eb" dark="true" height="200px"]
        [text_box text_align="center"]<h2>CTA Section</h2>[/text_box]
    [/ux_banner]');
});

// Add custom body open content (tracking scripts, etc.)
add_action('flatsome_after_body_open', function() {
    echo '<!-- GTM noscript -->';
}, 5);
```

### Modify product display

```php
// Add custom badge to product boxes
add_action('flatsome_product_box_tools_top', function() {
    global $product;
    if ($product->get_meta('_custom_badge')) {
        echo '<div class="custom-badge">' . $product->get_meta('_custom_badge') . '</div>';
    }
});

// Add extra info after product box
add_action('flatsome_product_box_after', function() {
    global $product;
    echo '<div class="delivery-info">Free shipping</div>';
});
```

### Filter modifications

```php
// Add custom follow links
add_filter('flatsome_follow_links', function($links) {
    $links['zalo'] = array(
        'url'   => 'https://zalo.me/your-id',
        'icon'  => 'icon-phone',
        'label' => 'Zalo',
    );
    return $links;
});

// Disable mini cart
add_filter('flatsome_disable_mini_cart', '__return_true');

// Modify header classes
add_filter('flatsome_header_class', function($classes) {
    $classes[] = 'custom-header';
    return $classes;
});

// Enable maintenance mode
add_filter('flatsome_maintenance_mode', function() {
    return !current_user_can('manage_options');
});
```

## Child Theme Setup

### Recommended `functions.php` structure

```php
<?php
// Enqueue parent + child styles
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('flatsome-child', get_stylesheet_uri(), array('flatsome-main'), wp_get_theme()->get('Version'));
}, 200);

// Enqueue custom scripts
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script('custom-js', get_stylesheet_directory_uri() . '/custom.js', array('jquery'), '1.0', true);
}, 200);

// Enqueue Font Awesome (if using FA icons in shortcodes)
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('font-awesome-6', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css', array(), '6.5.0');
});

// Add custom image sizes
add_action('after_setup_theme', function() {
    add_image_size('hero-bg', 1920, 1080, true);
    add_image_size('card-thumb', 600, 400, true);
});
```

### Custom Page Template

```php
<?php
/*
 * Template Name: Custom Landing Page
 * Description: Full-width landing page without header/footer chrome
 */

get_header();
// Remove default page title
remove_action('flatsome_before_page', 'flatsome_page_header');
?>

<div id="content" role="main">
    <?php while (have_posts()) : the_post(); ?>
        <?php the_content(); ?>
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>
```

## Enable UX Builder for Custom Post Types

```php
// In functions.php
function enable_ux_builder_for_cpt() {
    // Method 1: Register CPT with 'editor' support
    register_post_type('service', array(
        'label'    => 'Services',
        'public'   => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        // 'editor' support enables UX Builder
    ));

    // Method 2: Add editor support to existing CPT
    add_post_type_support('portfolio', 'editor');
}
add_action('init', 'enable_ux_builder_for_cpt');
```

> **Important**: The CPT template MUST call `the_content()` for shortcode rendering.

## AJAX Search Customization

```php
// Add custom post types to AJAX search
add_filter('flatsome_ajax_search_post_type', function($post_types) {
    $post_types[] = 'portfolio';
    $post_types[] = 'service';
    return $post_types;
});
```

## Custom CSS Best Practices

### Priority Order
1. **Child theme `style.css`** — Version controlled, survives theme updates
2. **Customizer → Advanced → Custom CSS** — Quick DB-stored overrides
3. **UX Builder per-page CSS** — Page-specific styles
4. **`<style>` inside `[ux_html]`** — Inline in shortcode content

### Override Flatsome Defaults
```css
/* Use child theme selector specificity */
.flatsome-child .section { /* ... */ }

/* Or increase specificity with class */
body .section.my-custom-section { /* ... */ }

/* For shortcode elements, target the rendered HTML */
.icon-box.featured-box { /* [featured_box] */ }
.testimonial-box { /* [testimonial] */ }
.button.primary { /* [button style="primary"] */ }
```

## Common Development Patterns

### Shortcode Generation Workflow
1. Create a blank page
2. Open in UX Builder
3. Build your layout visually
4. Save → Switch to Text editor
5. Copy the generated shortcodes
6. Use anywhere (header, footer, widgets, etc.)

### WooCommerce Product Page Customization
```php
// Reorder product tabs
add_filter('woocommerce_product_tabs', function($tabs) {
    $tabs['reviews']['priority'] = 5; // Move reviews first
    $tabs['description']['priority'] = 10;
    return $tabs;
});

// Custom product page block
add_filter('flatsome_custom_product_single_product_hooks', function($hooks) {
    $hooks[] = 'woocommerce_before_add_to_cart_form';
    return $hooks;
});
```

## Pjax (Page Transitions)

Flatsome supports PJAX for smooth page transitions:

```php
// Enable in Theme Options → Advanced → Pjax
// Or programmatically:
add_filter('flatsome_pjax', '__return_true');
```

> **Note**: PJAX can interfere with third-party scripts. Test thoroughly.

## Performance Tips

1. **Lazy loading**: Enabled by default for backgrounds (`lazy_load_backgrounds`)
2. **Image sizes**: Use appropriate `bg_size` and `image_size` attributes
3. **Video**: Set `video_visibility="hide-for-medium"` to avoid loading on mobile
4. **Slider**: Use `timer="0"` and `auto_slide="false"` for manual-only sliders
5. **Cache**: Configure caching plugins to exclude dynamic WooCommerce pages
