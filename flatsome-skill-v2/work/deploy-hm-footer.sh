#!/usr/bin/env bash
set -euo pipefail

WEBROOT=/home/admin/domains/hmarketing.vn/public_html
THEME="$WEBROOT/wp-content/themes/flatsome-child"

cd "$WEBROOT"

mkdir -p "$THEME/assets/css" "$THEME/assets/img/footer"
cp /tmp/hm-footer.css "$THEME/assets/css/hm-footer.css"

if [ -d /tmp/footer-assets ]; then
    find /tmp/footer-assets -maxdepth 1 -type f -exec cp {} "$THEME/assets/img/footer/" \;
fi

NEWSLETTER_FORM_ID=$(wp eval '
$post = get_page_by_path( "hm-footer-newsletter", OBJECT, "wpcf7_contact_form" );
if ( $post ) {
    $id = (int) $post->ID;
} else {
    $id = wp_insert_post( array(
        "post_type" => "wpcf7_contact_form",
        "post_status" => "publish",
        "post_title" => "HM Footer Newsletter",
        "post_name" => "hm-footer-newsletter",
    ) );
}

$form = "[email* your-email class:hm-footer-newsletter-email placeholder \"Enter Your email\"]\n[submit class:hm-footer-newsletter-submit \"Subscribe ↗\"]";

$mail = array(
    "subject" => "[_site_title] Newsletter subscription",
    "sender" => "[_site_title] <admin@hmarketing.vn>",
    "body" => "Newsletter email: [your-email]\n\n-- \nThis is a notification from [_site_url].",
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

MEDIA_IDS=$(wp eval '
function hm_import_footer_asset( $slug, $source, $title ) {
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

$ids = array(
    "logo"      => hm_import_footer_asset( "hm-footer-seoc-logo", "/tmp/footer-assets/logo5.png", "HM Footer SEOC Logo" ),
    "facebook"  => hm_import_footer_asset( "hm-footer-facebook-icon", "/tmp/footer-assets/facebook4.svg", "HM Footer Facebook Icon" ),
    "instagram" => hm_import_footer_asset( "hm-footer-instagram-icon", "/tmp/footer-assets/instagram4.svg", "HM Footer Instagram Icon" ),
    "linkedin"  => hm_import_footer_asset( "hm-footer-linkedin-icon", "/tmp/footer-assets/linkedin4.svg", "HM Footer LinkedIn Icon" ),
    "youtube"   => hm_import_footer_asset( "hm-footer-youtube-icon-v2", "/tmp/footer-assets/youtube.svg", "HM Footer YouTube Icon" ),
);

echo wp_json_encode( $ids );
' --allow-root)

FOOTER_LOGO_ID=$(php -r '$ids=json_decode($argv[1], true); echo $ids["logo"];' "$MEDIA_IDS")
FOOTER_FACEBOOK_ID=$(php -r '$ids=json_decode($argv[1], true); echo $ids["facebook"];' "$MEDIA_IDS")
FOOTER_INSTAGRAM_ID=$(php -r '$ids=json_decode($argv[1], true); echo $ids["instagram"];' "$MEDIA_IDS")
FOOTER_LINKEDIN_ID=$(php -r '$ids=json_decode($argv[1], true); echo $ids["linkedin"];' "$MEDIA_IDS")
FOOTER_YOUTUBE_ID=$(php -r '$ids=json_decode($argv[1], true); echo $ids["youtube"];' "$MEDIA_IDS")

sed \
  -e "s/__HM_FOOTER_NEWSLETTER_FORM_ID__/$NEWSLETTER_FORM_ID/g" \
  -e "s/__HM_FOOTER_LOGO_ID__/$FOOTER_LOGO_ID/g" \
  -e "s/__HM_FOOTER_FACEBOOK_ID__/$FOOTER_FACEBOOK_ID/g" \
  -e "s/__HM_FOOTER_INSTAGRAM_ID__/$FOOTER_INSTAGRAM_ID/g" \
  -e "s/__HM_FOOTER_LINKEDIN_ID__/$FOOTER_LINKEDIN_ID/g" \
  -e "s/__HM_FOOTER_YOUTUBE_ID__/$FOOTER_YOUTUBE_ID/g" \
  /tmp/hm-footer.shortcodes.txt > /tmp/hm-footer.final.txt

FOOTER_BLOCK_ID=$(wp eval '
$title = "HM SEOC Footer";
$existing = get_page_by_title( $title, OBJECT, "ux_block" );
$content = file_get_contents( "/tmp/hm-footer.final.txt" );

if ( $existing ) {
    wp_update_post( array(
        "ID" => (int) $existing->ID,
        "post_content" => $content,
        "post_status" => "publish",
    ) );
    echo (int) $existing->ID;
    return;
}

$id = wp_insert_post( array(
    "post_type" => "ux_block",
    "post_status" => "publish",
    "post_title" => $title,
    "post_content" => $content,
) );
echo (int) $id;
' --allow-root)

wp option update flatsome_footer_block "$FOOTER_BLOCK_ID" --allow-root >/dev/null

FUNCTIONS="$THEME/functions.php"
if ! grep -q "hm_enqueue_footer_block_css" "$FUNCTIONS"; then
  cat >> "$FUNCTIONS" <<'PHP'

/* Enqueue CSS for HM SEOC global footer block */
function hm_enqueue_footer_block_css() {
    $file = get_stylesheet_directory() . '/assets/css/hm-footer.css';
    if ( file_exists( $file ) ) {
        wp_enqueue_style(
            'hm-footer-block',
            get_stylesheet_directory_uri() . '/assets/css/hm-footer.css',
            array(),
            filemtime( $file )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'hm_enqueue_footer_block_css', 35 );
PHP
fi

wp cache flush --allow-root >/dev/null || true
chown -R admin:admin "$WEBROOT"

echo "FOOTER_BLOCK_ID=$FOOTER_BLOCK_ID"
echo "NEWSLETTER_FORM_ID=$NEWSLETTER_FORM_ID"
echo "FOOTER_LOGO_ID=$FOOTER_LOGO_ID"
echo "FOOTER_FACEBOOK_ID=$FOOTER_FACEBOOK_ID"
echo "FOOTER_INSTAGRAM_ID=$FOOTER_INSTAGRAM_ID"
echo "FOOTER_LINKEDIN_ID=$FOOTER_LINKEDIN_ID"
echo "FOOTER_YOUTUBE_ID=$FOOTER_YOUTUBE_ID"
echo "FLATSOME_FOOTER_BLOCK=$(wp option get flatsome_footer_block --allow-root)"
echo "FOOTER_CSS_URL=https://hmarketing.vn/wp-content/themes/flatsome-child/assets/css/hm-footer.css"
