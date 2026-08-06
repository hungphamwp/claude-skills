# Elementor Widget Settings — Complete Quick Reference

## Universal Settings (available on all widgets)

```json
{
  "_margin": {"unit": "px", "top": "0", "right": "0", "bottom": "20", "left": "0", "isLinked": false},
  "_padding": {"unit": "px", "top": "0", "right": "0", "bottom": "0", "left": "0", "isLinked": false},
  "_background_background": "classic",
  "_background_color": "#ffffff",
  "css_classes": "my-custom-class",
  "motion_fx_motion_fx_scrolling": "yes",
  "hide_desktop": "",
  "hide_tablet": "",
  "hide_mobile": ""
}
```

## Typography Settings (used inside any text widget)

```json
{
  "typography_typography": "custom",
  "typography_font_family": "Roboto",
  "typography_font_size": {"unit": "px", "size": 16},
  "typography_font_weight": "400",
  "typography_font_style": "normal",
  "typography_text_decoration": "none",
  "typography_text_transform": "none",
  "typography_line_height": {"unit": "em", "size": 1.6},
  "typography_letter_spacing": {"unit": "px", "size": 0}
}
```

## Heading Widget — All Settings
```json
{
  "title": "Your Title",
  "link": {"url": "#"},
  "header_size": "h2",
  "align": "left",
  "align_tablet": "center",
  "align_mobile": "center",
  "title_color": "#1a1a1a",
  "blend_mode": "normal",
  "typography_typography": "custom",
  "typography_font_size": {"unit": "px", "size": 36},
  "typography_font_weight": "700"
}
```

## Text Editor Widget — All Settings
```json
{
  "editor": "<p>Your content here.</p>",
  "align": "left",
  "text_color": "#555555",
  "typography_font_size": {"unit": "px", "size": 16},
  "typography_line_height": {"unit": "em", "size": 1.8},
  "drop_cap": ""
}
```

## Image Widget — All Settings
```json
{
  "image": {"url": "IMAGE_URL", "id": 0},
  "image_size": "full",
  "image_custom_dimension": {"width": 800, "height": 600},
  "align": "center",
  "align_tablet": "center",
  "align_mobile": "center",
  "caption_source": "none",
  "caption": "",
  "link_to": "custom",
  "link": {"url": "#", "is_external": false, "nofollow": "", "custom_attributes": ""},
  "open_lightbox": "default",
  "hover_animation": "",
  "image_border_border": "solid",
  "image_border_width": {"unit": "px", "top": "2", "right": "2", "bottom": "2", "left": "2", "isLinked": true},
  "image_border_color": "#e0e0e0",
  "image_border_radius": {"unit": "px", "top": "0", "right": "0", "bottom": "0", "left": "0", "isLinked": true},
  "image_box_shadow_box_shadow_type": "yes",
  "image_box_shadow_box_shadow": {"horizontal": 0, "vertical": 4, "blur": 16, "spread": 0, "color": "rgba(0,0,0,0.1)"}
}
```

## Button Widget — All Settings
```json
{
  "button_type": "default",
  "text": "Click Me",
  "link": {"url": "#", "is_external": false},
  "size": "md",
  "align": "center",
  "selected_icon": {"library": "fa-solid", "value": "fas fa-arrow-right"},
  "icon_align": "right",
  "icon_indent": {"unit": "px", "size": 8},
  "background_color": "#61ce70",
  "button_text_color": "#ffffff",
  "hover_color": "#ffffff",
  "button_background_hover_color": "#4ab85e",
  "hover_border_color": "#4ab85e",
  "border_radius": {"unit": "px", "top": "4", "right": "4", "bottom": "4", "left": "4", "isLinked": true},
  "text_padding": {"unit": "px", "top": "12", "right": "30", "bottom": "12", "left": "30", "isLinked": false},
  "typography_font_size": {"unit": "px", "size": 15},
  "typography_font_weight": "600"
}
```

## Icon Box Widget — All Settings
```json
{
  "icon": {"library": "fa-solid", "value": "fas fa-star"},
  "view": "default",
  "shape": "circle",
  "title_text": "Icon Box Title",
  "description_text": "Description text here.",
  "link": {"url": "#"},
  "position": "top",
  "title_size": "h3",
  "align": "center",
  "primary_color": "#6ec1e4",
  "secondary_color": "#ffffff",
  "hover_primary_color": "",
  "hover_secondary_color": "",
  "icon_size": {"unit": "px", "size": 50},
  "icon_padding": {"unit": "em", "size": 0.5},
  "rotate": {"unit": "deg", "size": 0},
  "border_width": {"unit": "px", "size": 2},
  "border_radius": {"unit": "%", "size": 50},
  "icon_space": {"unit": "px", "size": 15}
}
```

## Image Box Widget — All Settings
```json
{
  "image": {"url": "IMAGE_URL", "id": 0},
  "image_size": "medium",
  "title_text": "Image Box Title",
  "description_text": "Description text here.",
  "link": {"url": "#"},
  "position": "top",
  "title_size": "h3",
  "align": "center",
  "image_space": {"unit": "px", "size": 20},
  "image_border_radius": {"unit": "px", "top": "4", "right": "4", "bottom": "4", "left": "4", "isLinked": true},
  "hover_animation": "grow"
}
```

## Video Widget — All Settings
```json
{
  "video_type": "youtube",
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "vimeo_url": "",
  "start": 0,
  "end": 0,
  "autoplay": "",
  "play_on_mobile": "",
  "mute": "",
  "loop": "",
  "controls": "yes",
  "showinfo": "yes",
  "rel": "",
  "modestbranding": "",
  "privacy_mode": "",
  "show_image_overlay": "yes",
  "image_overlay": {"url": "THUMBNAIL_URL", "id": 0},
  "lazy_load": "",
  "play_icon": {"library": "fa-solid", "value": "fas fa-play"},
  "play_icon__color": "#ffffff",
  "play_icon__size": {"unit": "px", "size": 48},
  "aspect_ratio": "169",
  "lightbox": ""
}
```

## Testimonial Widget — All Settings
```json
{
  "testimonial_content": "This is an amazing product!",
  "testimonial_image": {"url": "AVATAR_URL", "id": 0},
  "testimonial_name": "Customer Name",
  "testimonial_job": "Job Title",
  "testimonial_link": {"url": "#"},
  "alignment": "center"
}
```

## Counter Widget (for stats sections)
```json
{
  "id": "wXXXXXXX",
  "elType": "widget",
  "widgetType": "counter",
  "isInner": false,
  "settings": {
    "starting_number": 0,
    "ending_number": 1500,
    "prefix": "",
    "suffix": "+",
    "duration": 2000,
    "title": "Khách hàng hài lòng",
    "number_color": "#e74c3c",
    "title_color": "#1a1a1a",
    "typography_font_size": {"unit": "px", "size": 48},
    "typography_font_weight": "700"
  },
  "elements": []
}
```

## Google Maps Widget
```json
{
  "id": "wXXXXXXX",
  "elType": "widget",
  "widgetType": "google_maps",
  "isInner": false,
  "settings": {
    "address": "Hà Nội, Việt Nam",
    "zoom": {"unit": "px", "size": 14},
    "height": {"unit": "px", "size": 400}
  },
  "elements": []
}
```

## Tabs Widget
```json
{
  "id": "wXXXXXXX",
  "elType": "widget",
  "widgetType": "tabs",
  "isInner": false,
  "settings": {
    "tabs": [
      {"tab_title": "Tab 1", "tab_content": "<p>Content for tab 1</p>"},
      {"tab_title": "Tab 2", "tab_content": "<p>Content for tab 2</p>"},
      {"tab_title": "Tab 3", "tab_content": "<p>Content for tab 3</p>"}
    ],
    "type": "horizontal",
    "tab_active_color": "#e74c3c",
    "tab_background_color": "#f5f5f5",
    "tab_active_background_color": "#ffffff"
  },
  "elements": []
}
```

## Accordion Widget
```json
{
  "id": "wXXXXXXX",
  "elType": "widget",
  "widgetType": "accordion",
  "isInner": false,
  "settings": {
    "tabs": [
      {"tab_title": "Câu hỏi 1", "tab_content": "<p>Trả lời câu hỏi 1</p>"},
      {"tab_title": "Câu hỏi 2", "tab_content": "<p>Trả lời câu hỏi 2</p>"}
    ],
    "active_color": "#e74c3c",
    "icon": {"library": "fa-solid", "value": "fas fa-plus"},
    "icon_active": {"library": "fa-solid", "value": "fas fa-minus"}
  },
  "elements": []
}
```
