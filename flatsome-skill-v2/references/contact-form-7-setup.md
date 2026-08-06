# CONTACT FORM 7 — COMPLETE REFERENCE FOR FLATSOME

> This documentation covers all form-tags, CSS styling, and horizontal/vertical layout patterns for high-end Flatsome development.

---

## SECTION 1 — INSTALLATION & SETUP

### 1.1 Plugin Installation
```bash
wp plugin install contact-form-7 --activate
wp plugin list --status=active | grep contact-form-7
```

### 1.2 Create New Form via WP-CLI
```bash
# Create a new form
wp post create \
  --post_type=wpcf7_contact_form \
  --post_title="Contact Form" \
  --post_status=publish
```

---

## SECTION 2 — FORM-TAGS (SHORTCODES WITHIN THE FORM)

### 2.1 Text Fields

| Tag | Description | Example |
|-----|-------------|---------|
| `[text name]` | Standard text input | `[text your-name placeholder "Full Name"]` |
| `[text* name]` | Required text input | `[text* your-name placeholder "Full Name (*)"]` |
| `[email email]` | Email input | `[email your-email placeholder "Email"]` |
| `[email* email]` | Required email input | `[email* your-email placeholder "Email (*)"]` |
| `[tel phone]` | Phone number input | `[tel your-phone placeholder "Phone Number"]` |
| `[tel* phone]` | Required phone input | `[tel* your-phone placeholder "Phone (*)"]` |
| `[url website]` | URL input | `[url your-url placeholder "Website"]` |
| `[textarea msg]` | Multi-line textarea | `[textarea your-message placeholder "Message"]` |
| `[textarea* msg]` | Required textarea | `[textarea* your-message placeholder "Message (*)"]` |

**Full Syntax:**
```
[type* name id:css-id class:css-class placeholder "text" "default-value"]
```

### 2.2 Options Tags (Checkbox, Radio, Select)

**Checkbox:**
```
[checkbox subjects "Option 1" "Option 2" "Option 3"]
[checkbox* subjects use_label_element "Option 1" "Option 2" "Option 3"]
```

**Radio Buttons:**
```
[radio gender default:1 "Male" "Female" "Other"]
[radio gender use_label_element "Male" "Female" "Other"]
```

**Dropdown Select:**
```
[select service "Service A" "Service B" "Service C"]
[select* service include_blank "Service A" "Service B" "Service C"]
```

**Options attributes:**
- `include_blank` — Adds an initial empty option
- `use_label_element` — Wraps each option in a `<label>`
- `exclusive` — Allows only one selection (checkbox)
- `default:N` — Pre-selects the N-th option (starting from 1)
- `label_first` — Places the label before the input

### 2.3 Special Tags

**Date Picker:**
```
[date your-date min:2024-01-01 max:2025-12-31]
[date* your-date placeholder "Select Date"]
```

**Number:**
```
[number quantity min:1 max:100 step:1 "1"]
[number* quantity min:1 max:10]
```

**File Upload:**
```
[file your-file limit:5mb filetypes:jpg|png|pdf]
[file* your-file limit:10mb filetypes:pdf|doc|docx]
```

**Acceptance (GDPR):**
```
[acceptance accept-privacy] I agree to the <a href="/privacy-policy">Privacy Policy</a> [/acceptance]
```

**Quiz (Anti-spam):**
```
[quiz your-quiz "What is 1+1?|2"]
[quiz your-quiz "Capital of Vietnam?|Hanoi"]
```

**Hidden Field:**
```
[hidden source default:get "Facebook"]
[hidden page-title default:post_title]
```

**Submit Button:**
```
[submit "Send Now"]
[submit class:btn-primary "REGISTER"]
```

---

## SECTION 3 — MAIL TEMPLATE

### 3.1 Mail Tags

In the Mail tab, use `[field-name]` to retrieve values from the form:

```
From: [your-name] <[your-email]>
Subject: New Contact from [your-name]

Content:
Full Name: [your-name]
Email: [your-email]
Phone: [your-phone]
Message: [your-message]
```

### 3.2 Special Mail Tags

| Tag | Value |
|-----|-------|
| `[_date]` | Date sent |
| `[_time]` | Time sent |
| `[_serial_number]` | Submission sequence number |
| `[_site_title]` | Website Title |
| `[_site_url]` | Website URL |
| `[_remote_ip]` | Sender's IP |
| `[_user_agent]` | Browser information |
| `[_referer]` | Referring URL |
| `[_post_title]` | Page title containing the form |
| `[_post_url]` | Page URL containing the form |

---

## SECTION 4 — BASIC CSS STYLING

### 4.1 Primary Selectors

```css
/* Main Container */
.wpcf7 { }
.wpcf7-form { }

/* Input fields */
.wpcf7 input[type="text"] { }
.wpcf7 input[type="email"] { }
.wpcf7 input[type="tel"] { }
.wpcf7 input[type="url"] { }
.wpcf7 input[type="number"] { }
.wpcf7 input[type="date"] { }
.wpcf7 textarea { }
.wpcf7 select { }

/* Submit button */
.wpcf7 input[type="submit"] { }
.wpcf7-submit { }

/* Checkbox & Radio */
.wpcf7 input[type="checkbox"] { }
.wpcf7 input[type="radio"] { }
.wpcf7-checkbox { }
.wpcf7-radio { }

/* Field Wrappers */
.wpcf7-form-control-wrap { }

/* Validation messages */
.wpcf7-not-valid-tip { }
.wpcf7-validation-errors { }
.wpcf7-response-output { }
```

---

## SECTION 5 — HORIZONTAL LAYOUT PATTERNS

### 5.1 HTML Structure inside CF7

**IMPORTANT:** For flex layouts to work, each field SHOULD be wrapped or Autop must be disabled.

```html
<div id="form-row" class="clearfix">
    <div class="col-input">[text* your-name placeholder "Full Name"]</div>
    <div class="col-input">[tel* your-phone placeholder "Phone Number (*)"]</div>
    <div class="col-input">[email your-email placeholder "Email Address"]</div>
    <div class="col-submit">[submit "REGISTER NOW"]</div>
</div>
```

### 5.2 Complete Horizontal CSS

```css
/* Row container - horizontal flex */
div#form-row {
    display: flex;
    flex-wrap: nowrap;
    gap: 15px;
    align-items: center;
}

/* Input columns - equal width */
div#form-row .col-input {
    flex: 1;
}

/* Submit column - shrink to content */
div#form-row .col-submit {
    flex: 0 0 auto;
}

/* Input styling */
div#form-row input[type="text"],
div#form-row input[type="tel"],
div#form-row input[type="email"] {
    width: 100%;
    height: 50px;
    padding: 0 18px;
    border: none;
    font-size: 15px;
    background: #fff;
}

/* Button styling */
div#form-row input[type="submit"] {
    height: 50px;
    padding: 0 40px;
    background: #fff;
    border: none;
    font-weight: 600;
    text-transform: uppercase;
    cursor: pointer;
}

/* Responsive adjustment */
@media (max-width: 768px) {
    div#form-row {
        flex-direction: column;
        gap: 12px;
    }
    
    div#form-row .col-input,
    div#form-row .col-submit {
        width: 100%;
    }
}
```

### 5.3 4-Column Newsletter Registration (Example)

**CF7 Code:**
```html
<div id="form-dangky-row" class="clearfix">
    <div class="col-input col-name">[text* your-name placeholder "Full Name"]</div>
    <div class="col-input col-phone">[tel* your-phone placeholder "Phone (*)"]</div>
    <div class="col-input col-email">[email your-email placeholder "Email Address"]</div>
    <div class="col-submit">[submit "REGISTER NOW"]</div>
</div>
```

---

## SECTION 6 — INTEGRATION WITH FLATSOME UX BUILDER

### 6.1 Embed via UX_HTML
Always wrap CF7 shortcodes in `[ux_html]` for better script rendering stability.

```
[ux_html]
<div class="custom-form-wrapper">
    [contact-form-7 id="123" title="Contact Us"]
</div>
[/ux_html]
```

### 6.2 Disable WPCF7 Autop (Recommended)
Add this to your child theme's `functions.php` to prevent CF7 from adding `<p>` and `<br>` tags that break flex layouts:

```php
add_filter( 'wpcf7_autop_or_not', '__return_false' );
```

---

## SECTION 7 — REDIRECT AFTER SUBMISSION

### 7.1 JavaScript Redirect
Add this to any custom JS file or Footer script:

```javascript
document.addEventListener('wpcf7mailsent', function(event) {
    location = '/thank-you/';
}, false);
```
