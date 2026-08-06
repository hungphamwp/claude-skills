# elementor-skill

WordPress Elementor page designer skill for Claude Code.

## What this skill does
- Designs WordPress pages from PDF/image mockups using Elementor page builder
- Generates valid Elementor JSON programmatically (no browser needed)
- Deploys pages via WP-CLI or direct MySQL (works with LocalWP)
- Follows non-technical user best practices (all content editable via Elementor panel)

## Files
- `SKILL.md` — Main skill file with all rules, JSON structure, widget reference, deployment workflows
- `references/widget-settings-reference.md` — Complete settings for every widget type
- `references/deployment-scripts.md` — Ready-to-use PHP and Python deployment scripts

## Key concepts
- Elementor stores page layout as JSON in `wp_postmeta._elementor_data`
- Required meta keys: `_elementor_data`, `_elementor_edit_mode=builder`, `_elementor_version`
- Modern structure: `container → container (inner) → widgets`
- After any programmatic update: run `wp elementor flush-css`

## Sources
- [Elementor Developers Documentation](https://developers.elementor.com/docs/)
- [Elementor Data Structure](https://developers.elementor.com/docs/data-structure/)
- [Elementor CLI Reference](https://developers.elementor.com/docs/cli/)
