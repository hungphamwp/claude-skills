# Elementor Deployment Scripts

## Script 1: Deploy JSON to existing page (WP-CLI method)

Save as `/tmp/elementor-deploy.php`, then run: `wp eval-file /tmp/elementor-deploy.php`

```php
<?php
/**
 * Deploy Elementor JSON content to a WordPress page.
 * Usage: wp eval-file /tmp/elementor-deploy.php
 */

// ===== CONFIGURE THESE =====
$page_id   = 123;            // WP post ID of target page
$json_file = '/tmp/page-content.json';  // Path to your JSON file
// ===========================

if (!file_exists($json_file)) {
    WP_CLI::error("JSON file not found: $json_file");
    exit(1);
}

$json = file_get_contents($json_file);

// Validate JSON
$data = json_decode($json);
if (json_last_error() !== JSON_ERROR_NONE) {
    WP_CLI::error("Invalid JSON: " . json_last_error_msg());
    exit(1);
}

// Check page exists
if (!get_post($page_id)) {
    WP_CLI::error("Page $page_id not found");
    exit(1);
}

// Save Elementor data
update_post_meta($page_id, '_elementor_data', wp_slash($json));
update_post_meta($page_id, '_elementor_edit_mode', 'builder');
update_post_meta($page_id, '_elementor_version', '3.0.0');
update_post_meta($page_id, '_elementor_page_settings', []);

// Clear CSS cache
if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::instance()->files_manager->clear_cache();
    WP_CLI::success("CSS cache cleared");
}

WP_CLI::success("Page $page_id updated with Elementor content");
```

---

## Script 2: Create new page + deploy JSON (WP-CLI method)

```php
<?php
/**
 * Create new WordPress page and deploy Elementor JSON content.
 * Usage: wp eval-file /tmp/elementor-create.php
 */

// ===== CONFIGURE THESE =====
$page_title  = 'Trang Chủ';
$page_slug   = 'trang-chu';
$json_file   = '/tmp/page-content.json';
// ===========================

if (!file_exists($json_file)) {
    WP_CLI::error("JSON file not found: $json_file");
    exit(1);
}

$json = file_get_contents($json_file);
$data = json_decode($json);
if (json_last_error() !== JSON_ERROR_NONE) {
    WP_CLI::error("Invalid JSON: " . json_last_error_msg());
    exit(1);
}

// Create the page
$page_id = wp_insert_post([
    'post_title'   => $page_title,
    'post_name'    => $page_slug,
    'post_type'    => 'page',
    'post_status'  => 'publish',
    'post_content' => '',
]);

if (is_wp_error($page_id)) {
    WP_CLI::error("Failed to create page: " . $page_id->get_error_message());
    exit(1);
}

WP_CLI::log("Created page ID: $page_id");

// Save Elementor data
update_post_meta($page_id, '_elementor_data', wp_slash($json));
update_post_meta($page_id, '_elementor_edit_mode', 'builder');
update_post_meta($page_id, '_elementor_version', '3.0.0');
update_post_meta($page_id, '_elementor_page_settings', []);

// Clear CSS cache
if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::instance()->files_manager->clear_cache();
}

WP_CLI::success("Page created and deployed: ID $page_id | Slug: $page_slug");
echo "Edit URL: " . admin_url("post.php?post=$page_id&action=elementor") . "\n";
```

---

## Script 3: Deploy via MySQL (when WP-CLI fails)

```python
#!/usr/bin/env python3
"""
Deploy Elementor JSON to WordPress page via direct MySQL.
Works when WP-CLI cannot connect to the LocalWP MySQL socket.
"""

import subprocess, sys, os

# ===== CONFIGURE THESE =====
PAGE_ID   = 123                      # WP post ID
JSON_FILE = '/tmp/page-content.json' # JSON file path
DB_NAME   = 'local'                  # LocalWP DB name (almost always 'local')
DB_USER   = 'root'
DB_PASS   = 'root'
# ===========================

def find_mysql():
    sock_result = subprocess.run(
        "find $HOME/Library/Application\\ Support/Local/run -name mysqld.sock 2>/dev/null | head -1",
        shell=True, capture_output=True, text=True
    )
    bin_result = subprocess.run(
        "ls $HOME/Library/Application\\ Support/Local/lightning-services/mysql-*/bin/darwin-arm64/bin/mysql 2>/dev/null | head -1",
        shell=True, capture_output=True, text=True
    )
    sock = sock_result.stdout.strip()
    mysql = bin_result.stdout.strip()
    if not sock or not mysql:
        print("ERROR: Could not find LocalWP MySQL. Is Local running?")
        sys.exit(1)
    return mysql, sock

def run_sql(mysql, sock, sql):
    result = subprocess.run(
        [mysql, f'--socket={sock}', f'-u{DB_USER}', f'-p{DB_PASS}', DB_NAME, '-e', sql],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"SQL ERROR: {result.stderr}")
        sys.exit(1)
    return result.stdout

def main():
    if not os.path.exists(JSON_FILE):
        print(f"ERROR: JSON file not found: {JSON_FILE}")
        sys.exit(1)

    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    import json
    try:
        json.loads(content)
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON: {e}")
        sys.exit(1)

    # Escape for MySQL string literals
    escaped = content.replace('\\', '\\\\').replace("'", "\\'")

    mysql, sock = find_mysql()
    print(f"Using MySQL: {mysql}")
    print(f"Socket: {sock}")

    # Verify page exists
    result = run_sql(mysql, sock, f"SELECT ID, post_title FROM wp_posts WHERE ID={PAGE_ID} AND post_type='page'")
    if str(PAGE_ID) not in result:
        print(f"ERROR: Page ID {PAGE_ID} not found in database")
        sys.exit(1)

    # Remove existing Elementor meta
    run_sql(mysql, sock,
        f"DELETE FROM wp_postmeta WHERE post_id={PAGE_ID} "
        f"AND meta_key IN ('_elementor_data','_elementor_edit_mode','_elementor_version','_elementor_page_settings')"
    )

    # Insert new meta
    run_sql(mysql, sock,
        f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) "
        f"VALUES ({PAGE_ID}, '_elementor_data', '{escaped}')"
    )
    run_sql(mysql, sock,
        f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) "
        f"VALUES ({PAGE_ID}, '_elementor_edit_mode', 'builder')"
    )
    run_sql(mysql, sock,
        f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) "
        f"VALUES ({PAGE_ID}, '_elementor_version', '3.0.0')"
    )
    run_sql(mysql, sock,
        f"INSERT INTO wp_postmeta (post_id, meta_key, meta_value) "
        f"VALUES ({PAGE_ID}, '_elementor_page_settings', 'a:0:{{}}')"
    )

    # Clear Elementor CSS cache
    run_sql(mysql, sock,
        f"DELETE FROM wp_options WHERE option_name LIKE 'elementor_css_post_{PAGE_ID}'"
    )
    run_sql(mysql, sock,
        "DELETE FROM wp_options WHERE option_name = 'elementor_global_css'"
    )

    print(f"SUCCESS: Page {PAGE_ID} updated via MySQL")

if __name__ == '__main__':
    main()
```

---

## Script 4: Backup existing Elementor page data

```bash
#!/bin/bash
# Backup Elementor data for a specific page before modifying

PAGE_ID=123
BACKUP_FILE="/tmp/elementor-backup-page-${PAGE_ID}-$(date +%Y%m%d%H%M%S).json"

wp post meta get $PAGE_ID _elementor_data > "$BACKUP_FILE"
echo "Backed up to: $BACKUP_FILE"
```

---

## Script 5: Validate JSON before deploying

```python
#!/usr/bin/env python3
"""Validate an Elementor JSON file before deploying"""

import json, sys

def validate_element(el, path="content"):
    errors = []
    
    required_keys = ['id', 'elType', 'settings', 'elements']
    for key in required_keys:
        if key not in el:
            errors.append(f"{path}: missing required key '{key}'")
    
    el_type = el.get('elType', '')
    if el_type == 'widget' and 'widgetType' not in el:
        errors.append(f"{path}: widget element missing 'widgetType'")
    
    if 'id' in el and len(el['id']) != 8:
        errors.append(f"{path}: id '{el['id']}' should be 8 chars")
    
    for i, child in enumerate(el.get('elements', [])):
        errors.extend(validate_element(child, f"{path}.elements[{i}]"))
    
    return errors

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 validate.py page-content.json")
        sys.exit(1)
    
    with open(sys.argv[1], 'r') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"INVALID JSON: {e}")
            sys.exit(1)
    
    print("✓ JSON syntax is valid")
    
    # Check top-level fields
    for field in ['title', 'type', 'version', 'content']:
        if field not in data:
            print(f"WARNING: missing top-level field '{field}'")
    
    # Validate elements
    errors = []
    for i, el in enumerate(data.get('content', [])):
        errors.extend(validate_element(el, f"content[{i}]"))
    
    if errors:
        print(f"\nFound {len(errors)} issues:")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    else:
        elements_count = sum(1 for _ in data.get('content', []))
        print(f"✓ Structure valid ({elements_count} top-level elements)")
        print("Ready to deploy!")

if __name__ == '__main__':
    main()
```

---

## Quick Deploy Checklist

```bash
# 1. Validate JSON
python3 /tmp/validate.py /tmp/page-content.json

# 2. Backup existing content
wp post meta get PAGE_ID _elementor_data > /tmp/backup.json

# 3. Deploy
wp eval-file /tmp/elementor-deploy.php

# 4. Flush CSS
wp elementor flush-css

# 5. Verify page loads
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://miric.local/page-slug/"
```
