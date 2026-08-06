#!/usr/bin/env bash
set -euo pipefail

WEBROOT=/home/admin/domains/hmarketing.vn/public_html
THEME="$WEBROOT/wp-content/themes/flatsome-child"
PAGE_ID=45

cd "$WEBROOT"

FORM_ID=$(wp eval '
$post = get_page_by_path( "smart-section-contact", OBJECT, "wpcf7_contact_form" );
if ( $post ) {
    $id = (int) $post->ID;
} else {
    $id = wp_insert_post( array(
        "post_type" => "wpcf7_contact_form",
        "post_status" => "publish",
        "post_title" => "Smart Section Contact",
        "post_name" => "smart-section-contact",
    ) );
}

$form = "<label>Name*\n[text* your-name class:hm-contact-input autocomplete:name]</label>\n\n<label>E-mail*\n[email* your-email class:hm-contact-input autocomplete:email]</label>\n\n<label>Message*\n[textarea* your-message class:hm-contact-message]</label>\n\n[submit class:hm-contact-submit \"Send Message\"]";

$mail = array(
    "subject" => "[_site_title] Smart Section Contact",
    "sender" => "[_site_title] <admin@hmarketing.vn>",
    "body" => "From: [your-name] [your-email]\n\nMessage Body:\n[your-message]\n\n-- \nThis is a notification that a contact form was submitted on your website ([_site_title] [_site_url]).",
    "recipient" => "[_site_admin_email]",
    "additional_headers" => "Reply-To: [your-email]",
    "attachments" => "",
    "use_html" => 0,
    "exclude_blank" => 0,
);

update_post_meta( $id, "_form", $form );
update_post_meta( $id, "_mail", $mail );
update_post_meta( $id, "_mail_2", array( "active" => false ) );
update_post_meta( $id, "_additional_settings", "" );
echo $id;
' --allow-root)

mkdir -p "$THEME/assets/css"
cp /tmp/smart-solutions-section.css "$THEME/assets/css/smart-solutions-section.css"

if [ -d /tmp/next-gen-assets ]; then
    mkdir -p "$THEME/assets/img/next-gen"
    find /tmp/next-gen-assets -maxdepth 1 -type f -exec cp {} "$THEME/assets/img/next-gen/" \;
fi

if [ -d /tmp/case-study-assets ]; then
    mkdir -p "$THEME/assets/img/case-study"
    find /tmp/case-study-assets -maxdepth 1 -type f -exec cp {} "$THEME/assets/img/case-study/" \;
fi

if [ -d /tmp/process-assets ]; then
    mkdir -p "$THEME/assets/img/process"
    find /tmp/process-assets -maxdepth 1 -type f -exec cp {} "$THEME/assets/img/process/" \;
fi

if [ -d /tmp/testimonial-assets ]; then
    mkdir -p "$THEME/assets/img/testimonial"
    find /tmp/testimonial-assets -maxdepth 1 -type f -exec cp {} "$THEME/assets/img/testimonial/" \;
fi

if [ -d /tmp/blog-news-assets ]; then
    mkdir -p "$THEME/assets/img/blog-news"
    find /tmp/blog-news-assets -maxdepth 1 -type f -exec cp {} "$THEME/assets/img/blog-news/" \;
fi

PROCESS_IMAGE_ID=$(wp eval '
$slug = "hm-process-team-image";
$existing = get_page_by_path( $slug, OBJECT, "attachment" );
if ( $existing ) {
    echo (int) $existing->ID;
    return;
}

$source = "/tmp/process-assets/case-img8.png";
if ( ! file_exists( $source ) ) {
    echo 0;
    return;
}

require_once ABSPATH . "wp-admin/includes/file.php";
require_once ABSPATH . "wp-admin/includes/image.php";
require_once ABSPATH . "wp-admin/includes/media.php";

$uploads = wp_upload_dir();
$target = trailingslashit( $uploads["path"] ) . $slug . ".png";
copy( $source, $target );

$filetype = wp_check_filetype( $target, null );
$attachment = array(
    "post_mime_type" => $filetype["type"],
    "post_title"     => "HM Process Team Image",
    "post_name"      => $slug,
    "post_status"    => "inherit",
);

$id = wp_insert_attachment( $attachment, $target );
$metadata = wp_generate_attachment_metadata( $id, $target );
wp_update_attachment_metadata( $id, $metadata );
echo (int) $id;
' --allow-root)

TESTIMONIAL_QUOTE_ID=$(wp eval '
function hm_import_asset_attachment( $slug, $source, $title ) {
    $existing = get_page_by_path( $slug, OBJECT, "attachment" );
    if ( $existing ) {
        return (int) $existing->ID;
    }
    if ( ! file_exists( $source ) ) {
        return 0;
    }

    require_once ABSPATH . "wp-admin/includes/file.php";
    require_once ABSPATH . "wp-admin/includes/image.php";
    require_once ABSPATH . "wp-admin/includes/media.php";

    $uploads = wp_upload_dir();
    $ext = pathinfo( $source, PATHINFO_EXTENSION );
    $target = trailingslashit( $uploads["path"] ) . $slug . "." . $ext;
    copy( $source, $target );

    $filetype = wp_check_filetype( $target, null );
    $attachment = array(
        "post_mime_type" => $filetype["type"] ?: "image/" . $ext,
        "post_title"     => $title,
        "post_name"      => $slug,
        "post_status"    => "inherit",
    );

    $id = wp_insert_attachment( $attachment, $target );
    if ( strtolower( $ext ) !== "svg" ) {
        $metadata = wp_generate_attachment_metadata( $id, $target );
        wp_update_attachment_metadata( $id, $metadata );
    }
    return (int) $id;
}

echo hm_import_asset_attachment( "hm-testimonial-quote-icon", "/tmp/testimonial-assets/quito2.svg", "HM Testimonial Quote Icon" );
' --allow-root)

TESTIMONIAL_GOOGLE_ID=$(wp eval '
function hm_import_asset_attachment( $slug, $source, $title ) {
    $existing = get_page_by_path( $slug, OBJECT, "attachment" );
    if ( $existing ) {
        return (int) $existing->ID;
    }
    if ( ! file_exists( $source ) ) {
        return 0;
    }

    require_once ABSPATH . "wp-admin/includes/file.php";
    require_once ABSPATH . "wp-admin/includes/image.php";
    require_once ABSPATH . "wp-admin/includes/media.php";

    $uploads = wp_upload_dir();
    $ext = pathinfo( $source, PATHINFO_EXTENSION );
    $target = trailingslashit( $uploads["path"] ) . $slug . "." . $ext;
    copy( $source, $target );

    $filetype = wp_check_filetype( $target, null );
    $attachment = array(
        "post_mime_type" => $filetype["type"] ?: "image/" . $ext,
        "post_title"     => $title,
        "post_name"      => $slug,
        "post_status"    => "inherit",
    );

    $id = wp_insert_attachment( $attachment, $target );
    if ( strtolower( $ext ) !== "svg" ) {
        $metadata = wp_generate_attachment_metadata( $id, $target );
        wp_update_attachment_metadata( $id, $metadata );
    }
    return (int) $id;
}

echo hm_import_asset_attachment( "hm-testimonial-google-logo", "/tmp/testimonial-assets/google1.svg", "HM Testimonial Google Logo" );
' --allow-root)

BLOG_NEWS_IMAGE_1_ID=$(wp eval '
function hm_import_asset_attachment( $slug, $source, $title ) {
    $existing = get_page_by_path( $slug, OBJECT, "attachment" );
    if ( $existing ) {
        return (int) $existing->ID;
    }
    if ( ! file_exists( $source ) ) {
        return 0;
    }

    require_once ABSPATH . "wp-admin/includes/file.php";
    require_once ABSPATH . "wp-admin/includes/image.php";
    require_once ABSPATH . "wp-admin/includes/media.php";

    $uploads = wp_upload_dir();
    $ext = pathinfo( $source, PATHINFO_EXTENSION );
    $target = trailingslashit( $uploads["path"] ) . $slug . "." . $ext;
    copy( $source, $target );

    $filetype = wp_check_filetype( $target, null );
    $attachment = array(
        "post_mime_type" => $filetype["type"] ?: "image/" . $ext,
        "post_title"     => $title,
        "post_name"      => $slug,
        "post_status"    => "inherit",
    );

    $id = wp_insert_attachment( $attachment, $target );
    if ( strtolower( $ext ) !== "svg" ) {
        $metadata = wp_generate_attachment_metadata( $id, $target );
        wp_update_attachment_metadata( $id, $metadata );
    }
    return (int) $id;
}

echo hm_import_asset_attachment( "hm-blog-news-social-media-image", "/tmp/blog-news-assets/blog-img6.png", "HM Blog News Social Media Image" );
' --allow-root)

BLOG_NEWS_IMAGE_2_ID=$(wp eval '
function hm_import_asset_attachment( $slug, $source, $title ) {
    $existing = get_page_by_path( $slug, OBJECT, "attachment" );
    if ( $existing ) {
        return (int) $existing->ID;
    }
    if ( ! file_exists( $source ) ) {
        return 0;
    }

    require_once ABSPATH . "wp-admin/includes/file.php";
    require_once ABSPATH . "wp-admin/includes/image.php";
    require_once ABSPATH . "wp-admin/includes/media.php";

    $uploads = wp_upload_dir();
    $ext = pathinfo( $source, PATHINFO_EXTENSION );
    $target = trailingslashit( $uploads["path"] ) . $slug . "." . $ext;
    copy( $source, $target );

    $filetype = wp_check_filetype( $target, null );
    $attachment = array(
        "post_mime_type" => $filetype["type"] ?: "image/" . $ext,
        "post_title"     => $title,
        "post_name"      => $slug,
        "post_status"    => "inherit",
    );

    $id = wp_insert_attachment( $attachment, $target );
    if ( strtolower( $ext ) !== "svg" ) {
        $metadata = wp_generate_attachment_metadata( $id, $target );
        wp_update_attachment_metadata( $id, $metadata );
    }
    return (int) $id;
}

echo hm_import_asset_attachment( "hm-blog-news-content-marketing-image", "/tmp/blog-news-assets/blog-img7.png", "HM Blog News Content Marketing Image" );
' --allow-root)

sed \
  -e "s/__HM_CONTACT_FORM_ID__/$FORM_ID/g" \
  -e "s/__HM_PROCESS_IMAGE_ID__/$PROCESS_IMAGE_ID/g" \
  -e "s/__HM_TESTIMONIAL_QUOTE_ID__/$TESTIMONIAL_QUOTE_ID/g" \
  -e "s/__HM_TESTIMONIAL_GOOGLE_ID__/$TESTIMONIAL_GOOGLE_ID/g" \
  -e "s/__HM_BLOG_NEWS_IMAGE_1_ID__/$BLOG_NEWS_IMAGE_1_ID/g" \
  -e "s/__HM_BLOG_NEWS_IMAGE_2_ID__/$BLOG_NEWS_IMAGE_2_ID/g" \
  /tmp/smart-solutions-section.shortcodes.txt > /tmp/smart-solutions-section.final.txt

wp post update "$PAGE_ID" --post_content="$(cat /tmp/smart-solutions-section.final.txt)" --allow-root >/dev/null
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

wp cache flush --allow-root >/dev/null || true
chown -R admin:admin "$WEBROOT"

echo "FORM_ID=$FORM_ID"
echo "PROCESS_IMAGE_ID=$PROCESS_IMAGE_ID"
echo "TESTIMONIAL_QUOTE_ID=$TESTIMONIAL_QUOTE_ID"
echo "TESTIMONIAL_GOOGLE_ID=$TESTIMONIAL_GOOGLE_ID"
echo "BLOG_NEWS_IMAGE_1_ID=$BLOG_NEWS_IMAGE_1_ID"
echo "BLOG_NEWS_IMAGE_2_ID=$BLOG_NEWS_IMAGE_2_ID"
echo "PAGE_TEMPLATE=$(wp post meta get "$PAGE_ID" _wp_page_template --allow-root)"
echo "PAGE_URL=https://hmarketing.vn/smart-solutions-section/"
echo "CSS_URL=https://hmarketing.vn/wp-content/themes/flatsome-child/assets/css/smart-solutions-section.css"
