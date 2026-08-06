#!/usr/bin/env bash
set -euo pipefail

WEBROOT=/home/admin/domains/hmarketing.vn/public_html
THEME="$WEBROOT/wp-content/themes/flatsome-child"
PAGE_ID=45

cd "$WEBROOT"

mkdir -p "$THEME/assets/css"
cp /tmp/smart-solutions-section.css "$THEME/assets/css/smart-solutions-section.css"

wp post meta update "$PAGE_ID" _wp_page_template page-blank-landingpage.php --allow-root >/dev/null

FUNCTIONS="$THEME/functions.php"
if ! grep -q "hm_enqueue_smart_solutions_section_css" "$FUNCTIONS"; then
  cat >> "$FUNCTIONS" <<'PHP'

/* Enqueue CSS for Smart Solutions UX Builder page */
function hm_enqueue_smart_solutions_section_css() {
    if ( ! is_page( 'smart-solutions-section' ) ) {
        return;
    }

    $file = get_stylesheet_directory() . '/assets/css/smart-solutions-section.css';
    if ( file_exists( $file ) ) {
        wp_enqueue_style(
            'hm-smart-solutions-section',
            get_stylesheet_directory_uri() . '/assets/css/smart-solutions-section.css',
            array(),
            filemtime( $file )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'hm_enqueue_smart_solutions_section_css', 30 );
PHP
fi

chown -R admin:admin "$WEBROOT"

echo "PAGE_TEMPLATE=$(wp post meta get "$PAGE_ID" _wp_page_template --allow-root)"
echo "CSS_URL=https://hmarketing.vn/wp-content/themes/flatsome-child/assets/css/smart-solutions-section.css"
