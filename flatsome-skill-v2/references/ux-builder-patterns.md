# UX Builder Patterns: Native Flatsome Conversions

This document lists 16 common web design layout patterns. For each pattern, we compare the **BAD (HTML-abusing)** approach with the **GOOD (100% Native Flatsome)** approach. Always refer to this guide to ensure that non-technical clients can visually edit every piece of text, image, and link directly inside UX Builder.

---

## 1. Hero Banner with CTA

### ❌ BAD (Abusing HTML)
```wordpress
[section bg_color="#0f172a" dark="true" padding="100px 0"]
  [row h_align="center"]
    [col span="8" align="center"]
      [ux_html]
        <div class="hero-badge">🚀 Digital Marketing Agency</div>
        <h1 class="hero-title">Tăng Trưởng Doanh Thu Với Chiến Lược Đột Phá</h1>
        <p class="hero-sub">Chúng tôi đồng hành cùng doanh nghiệp số hóa toàn diện quy trình tiếp cận khách hàng.</p>
        <div class="hero-buttons">
          <a href="/lien-he/" class="btn btn-primary">Tư vấn miễn phí</a>
          <a href="/dich-vu/" class="btn btn-outline">Xem dịch vụ</a>
        </div>
      [/ux_html]
    [/col]
  [/row]
[/section]
```
*   **Why it's BAD:** The client cannot edit any of the text or change the buttons' target links without touching code. The entire section appears as a black HTML box in the UX Builder tree.

### ✅ GOOD (100% Native Flatsome)
```wordpress
[section bg_color="#0f172a" dark="true" padding="100px 0" padding__sm="60px 0" class="hm-hero-section"]
  [row h_align="center"]
    [col span="8" span__md="10" span__sm="12" align="center"]
      [ux_text text_align="center"]
        <p class="hm-hero-badge">🚀 DIGITAL MARKETING AGENCY #1 VIỆT NAM</p>
        <h1 class="hm-hero-title">Tăng Trưởng Doanh Thu Với Chiến Lược Đột Phá</h1>
        <p class="hm-hero-subtitle">Chúng tôi đồng hành cùng doanh nghiệp số hóa toàn diện quy trình tiếp cận khách hàng.</p>
      [/ux_text]
      [gap height="25px"]
      [button text="Tư Vấn Miễn Phí" color="primary" size="large" radius="99" class="hm-btn-premium" link="/lien-he/"]
      [button text="Xem Dịch Vụ" style="outline" color="white" size="large" radius="99" class="hm-btn-outline" link="/dich-vu/"]
    [/col]
  [/row]
[/section]
```
*   **Why it's GOOD:** Every line of text is a standard visual paragraph/heading inside `[ux_text]`, editable in one click. Buttons are native `[button]` components with drag-and-drop link config.
*   **CSS Supplement (in child theme `style.css`):**
```css
.hm-hero-badge {
    font-size: 14px;
    font-weight: 700;
    color: #3b82f6;
    letter-spacing: 0.1em;
    margin-bottom: 15px;
}
.hm-hero-title {
    font-size: clamp(32px, 5vw, 56px) !important;
    line-height: 1.2 !important;
    font-weight: 800 !important;
    margin-bottom: 20px;
}
.hm-hero-subtitle {
    font-size: clamp(16px, 2vw, 18px);
    color: #94a3b8;
    line-height: 1.6;
}
```

---

## 2. Stats & Counter Bar

### ❌ BAD (Abusing HTML)
```wordpress
[section bg_color="#0f172a" dark="true" padding="40px 0"]
  [row]
    [col span="3"]
      [ux_html]
        <div class="stat-box">
          <div class="stat-number">500+</div>
          <div class="stat-desc">Dự Án Hoàn Thành</div>
        </div>
      [/ux_html]
    [/col]
  [/row]
[/section]
```
*   **Why it's BAD:** The text is buried inside a static `[ux_html]` block, requiring code alterations to change simple numbers.

### ✅ GOOD (100% Native Flatsome)
```wordpress
[section bg_color="#0f172a" dark="true" padding="60px 0" padding__sm="30px 0"]
  [row v_align="equal" h_align="center"]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <h2 class="hm-stat-number">500+</h2>
        <p class="hm-stat-label">Dự Án Hoàn Thành</p>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <h2 class="hm-stat-number">200+</h2>
        <p class="hm-stat-label">Khách Hàng Tin Tưởng</p>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <h2 class="hm-stat-number">10+</h2>
        <p class="hm-stat-label">Năm Kinh Nghiệm</p>
      [/ux_text]
    [/col]
    [col span="3" span__sm="6" align="center"]
      [ux_text text_align="center"]
        <h2 class="hm-stat-number">50+</h2>
        <p class="hm-stat-label">Chuyên Gia Nhân Sự</p>
      [/ux_text]
    [/col]
  [/row]
[/section]
```
*   **Why it's GOOD:** Fully visual inside UX Builder. The client can edit numbers directly.
*   **CSS Supplement:**
```css
.hm-stat-number {
    font-size: clamp(36px, 4vw, 48px) !important;
    font-weight: 800 !important;
    color: #3b82f6 !important;
    margin-bottom: 5px;
}
.hm-stat-label {
    font-size: 14px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

---

## 3. Service & Feature Cards

### ❌ BAD (Abusing HTML)
```wordpress
[col span="4"]
  [ux_html]
    <div class="service-card">
      <div class="service-icon"><i class="fas fa-search"></i></div>
      <h3>SEO Website</h3>
      <p>Tối ưu thứ hạng website bền vững trên công cụ tìm kiếm Google.</p>
    </div>
  [/ux_html]
[/col]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[col span="4" span__md="6" span__sm="12" bg_color="#ffffff" bg_radius="12" depth="1" depth_hover="3" padding="40px 30px 40px 30px" class="hm-service-card" animate="fadeInUp"]
  [ux_text text_align="left"]
    <div class="hm-service-icon"><i class="fas fa-search"></i></div>
    <h3 class="hm-service-title">SEO Website</h3>
    <p class="hm-service-desc">Tối ưu thứ hạng website bền vững trên công cụ tìm kiếm Google.</p>
  [/ux_text]
[/col]
```
*   **Why it's GOOD:** Visual styling (background, border-radius, shadow, hover-shadow, padding, entrance animation) is managed purely in the native properties of the `[col]` block. Text block contains basic HTML structures and FontAwesome classes that can be visually edited in a second.
*   **CSS Supplement:**
```css
.hm-service-icon {
    width: 60px;
    height: 60px;
    background: #eff6ff;
    color: #2563eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 25px;
    transition: all 0.3s ease;
}
.hm-service-card:hover .hm-service-icon {
    background: #2563eb;
    color: #ffffff;
}
.hm-service-title {
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #0f172a !important;
    margin-bottom: 12px;
}
.hm-service-desc {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
}
```

---

## 4. Process Steps (Numbered Rows)

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="process-wrapper">
    <div class="process-step">
      <span class="number">01</span>
      <h3>Tư Vấn Chiến Lược</h3>
      <p>Lắng nghe và định hình hướng đi cụ thể cho chiến dịch số.</p>
    </div>
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[row style="normal" v_align="equal"]
  [col span="3" span__md="6" span__sm="12" bg_color="#ffffff" bg_radius="12" depth="1" padding="40px 30px" class="hm-step-card"]
    [ux_text text_align="left"]
      <span class="hm-step-num">01</span>
      <h4 class="hm-step-title">Tư Vấn Chiến Lược</h4>
      <p class="hm-step-desc">Lắng nghe và định hình hướng đi cụ thể cho chiến dịch số.</p>
    [/ux_text]
  [/col]
  [col span="3" span__md="6" span__sm="12" bg_color="#ffffff" bg_radius="12" depth="1" padding="40px 30px" class="hm-step-card"]
    [ux_text text_align="left"]
      <span class="hm-step-num">02</span>
      <h4 class="hm-step-title">Thiết Kế Phương Án</h4>
      <p class="hm-step-desc">Xác định cấu trúc layout, thông điệp truyền tải cốt lõi.</p>
    [/ux_text]
  [/col]
[/row]
```
*   **Why it's GOOD:** Pure layout modularity. Re-ordering steps takes a simple drag-and-drop in the UX Builder tree.
*   **CSS Supplement:**
```css
.hm-step-num {
    font-size: 40px;
    font-weight: 800;
    color: #e2e8f0;
    line-height: 1;
    display: block;
    margin-bottom: 15px;
    transition: color 0.3s ease;
}
.hm-step-card:hover .hm-step-num {
    color: #2563eb;
}
.hm-step-title {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #0f172a !important;
    margin-bottom: 10px;
}
.hm-step-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
}
```

---

## 5. Testimonials with Avatar & Rating

### ❌ BAD (Abusing HTML)
```wordpress
[col span="4"]
  [ux_html]
    <div class="testi-box">
      <div class="stars">★★★★★</div>
      <p>"Đội ngũ rất chuyên nghiệp!"</p>
      <div class="author">
        <img src="avatar.jpg" alt="">
        <div>
          <h4>Anh Minh</h4>
          <span>CEO ABC Corp</span>
        </div>
      </div>
    </div>
  [/ux_html]
[/col]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[col span="4" span__md="6" span__sm="12" bg_color="#ffffff" bg_radius="12" depth="1" depth_hover="3" padding="30px 30px 30px 30px"]
  [testimonial image="15" image_width="60" pos="left" name="Nguyễn Văn Minh" company="CEO, ABC Corp" stars="5" class="hm-testimonial"]
    "Dịch vụ của HMarketing rất tuyệt vời, giúp doanh thu của chúng tôi tăng trưởng đột phá chỉ sau thời gian ngắn!"
  [/testimonial]
[/col]
```
*   **Why it's GOOD:** 100% native attributes. The client can upload avatars, adjust star count, and write reviews via the standard editor form. Zero custom HTML wrapper required.
*   **CSS Supplement:**
```css
.hm-testimonial {
    padding: 0 !important;
    margin: 0 !important;
}
.hm-testimonial .testimonial-text {
    font-size: 15px;
    line-height: 1.6;
    color: #475569;
    font-style: italic;
    margin-bottom: 15px;
}
.hm-testimonial .testimonial-meta {
    font-weight: 700;
    color: #0f172a;
}
```

---

## 6. Team Members Card

### ❌ BAD (Abusing HTML)
```wordpress
[col span="3"]
  [ux_html]
    <div class="team-card">
      <img src="member.jpg" alt="">
      <h4>Trần Minh Anh</h4>
      <span>Creative Director</span>
    </div>
  [/ux_html]
[/col]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[col span="3" span__sm="6" align="center"]
  [team_member image="20" name="Trần Minh Anh" title="Creative Director" email="anhtm@agency.vn" facebook="#" twitter="#" pinterest="#" youtube="#" image_height="100%" image_radius="12" image_hover="zoom" depth="1" depth_hover="3"]
[/col]
```
*   **Why it's GOOD:** Utilizes Flatsome's native `[team_member]` shortcode. This yields drag-and-drop imagery, built-in social icon links, hover zoom, and native titles.

---

## 7. Pricing Tables (Featured vs Standard)

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="pricing-table-wrap">
    <!-- pricing divs -->
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[row v_align="equal"]
  [col span="4" span__sm="12"]
    [ux_price_table title="Gói Cơ Bản" price="5.000.000đ" description="/ tháng" featured="false" bg_color="#ffffff" depth="1" radius="12"]
      [bullet_item text="SEO website cơ bản" enabled="true"]
      [bullet_item text="Quản lý 1 kênh Social" enabled="true"]
      [bullet_item text="Báo cáo hàng tháng" enabled="true"]
      [bullet_item text="Dedicated Manager" enabled="false"]
      [button text="Đăng Ký Ngay" style="outline" radius="99" expand="true" link="#reg"]
    [/ux_price_table]
  [/col]
  [col span="4" span__sm="12"]
    [ux_price_table title="Gói Chuyên Nghiệp" price="12.000.000đ" description="/ tháng" featured="true" bg_color="#ffffff" depth="3" radius="12" class="hm-pricing-featured"]
      [bullet_item text="SEO website nâng cao" enabled="true"]
      [bullet_item text="Quản lý 3 kênh Social" enabled="true"]
      [bullet_item text="Báo cáo hàng tuần" enabled="true"]
      [bullet_item text="Dedicated Manager" enabled="true"]
      [button text="Chọn Gói Này" style="primary" color="secondary" radius="99" expand="true" link="#reg"]
    [/ux_price_table]
  [/col]
[/row]
```
*   **Why it's GOOD:** Built purely out of standard pricing components. The `featured="true"` flag natively highlights the box without manual styling. Bullet checkmarks are natively configured.

---

## 8. Partner Logo Slider

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="slick-carousel">
    <div><img src="logo1.png"></div>
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[section bg_color="#ffffff" padding="40px 0" padding__sm="20px 0"]
  [row slider="true" slider_nav_style="simple" slider_nav_color="light" col_style="default" v_align="middle"]
    [col span="2" span__sm="4" span__md="3" align="center"]
      [ux_image id="51" width="80"]
    [/col]
    [col span="2" span__sm="4" span__md="3" align="center"]
      [ux_image id="52" width="80"]
    [/col]
    [col span="2" span__sm="4" span__md="3" align="center"]
      [ux_image id="53" width="80"]
    [/col]
    [col span="2" span__sm="4" span__md="3" align="center"]
      [ux_image id="54" width="80"]
    [/col]
    [col span="2" span__sm="4" span__md="3" align="center"]
      [ux_image id="55" width="80"]
    [/col]
    [col span="2" span__sm="4" span__md="3" align="center"]
      [ux_image id="56" width="80"]
    [/col]
  [/row]
[/section]
```
*   **Why it's GOOD:** Standard columns inside a `[row slider="true"]` automatically activate a swipeable Flickity carousel. Each logo is a distinct, drag-and-drop image block in the UX Builder tree.

---

## 9. Portfolio / Case Study Grid

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="portfolio-grid">
    <!-- custom post cards -->
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[portfolio style="shade" columns="3" columns__sm="1" columns__md="2" image_radius="12" depth="1" depth_hover="3" posts="6" orderby="date" show_category="true"]
```
*   **Why it's GOOD:** Directly hooks into WordPress Portfolio CPT. Standard layout, post query filters, hover overlay configurations, and responsive columns are natively integrated.

---

## 10. FAQ Accordion

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="faq-accordion">
    <div class="faq-item">
      <div class="faq-title">Câu hỏi?</div>
      <div class="faq-content">Câu trả lời.</div>
    </div>
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[accordion auto_open="1" class="hm-faq-accordion"]
  [accordion-item title="SEO mất bao lâu để lên top?"]
    [ux_text]
      <p>Thông thường các chiến dịch SEO cần từ 3 đến 6 tháng để tối ưu hóa thứ hạng từ khóa bền vững trên công cụ tìm kiếm.</p>
    [/ux_text]
  [/accordion-item]
  [accordion-item title="Tại sao nên chọn dịch vụ HMarketing?"]
    [ux_text]
      <p>Chúng tôi tập trung vào ROI thực tế của khách hàng, cam kết minh bạch số liệu và tiến độ hàng tuần.</p>
    [/ux_text]
  [/accordion-item]
[/accordion]
```
*   **Why it's GOOD:** Standard, beautiful collapsible panels. The client can edit titles and paragraphs visually inside the tree panel.

---

## 11. Dark Call-to-Action Section

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <section class="cta-dark" style="background:#0f172a; padding:60px">
    <!-- content -->
  </section>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[section bg_color="#0f172a" dark="true" padding="80px 0" padding__sm="40px 0"]
  [row h_align="center"]
    [col span="8" align="center"]
      [ux_text text_align="center"]
        <h2>Sẵn Sàng Bứt Phá Doanh Thu Cùng HMarketing?</h2>
        <p>Liên hệ ngay hôm nay để nhận được bản phân tích chiến lược marketing miễn phí dành riêng cho doanh nghiệp bạn.</p>
      [/ux_text]
      [gap height="15px"]
      [button text="Liên Hệ Tư Vấn" color="secondary" size="large" radius="99" link="/lien-he/"]
    [/col]
  [/row]
[/section]
```

---

## 12. Tabbed Content Showcase

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="tabs-wrap">
    <!-- custom tabs -->
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[tabgroup style="pills" align="center"]
  [tab title="Chiến Lược SEO"]
    [row v_align="middle"]
      [col span="6"]
        [ux_text]
          <h3>Chinh Phục Thứ Hạng Google</h3>
          <p>Tối ưu tổng thể nội dung, cấu trúc và backlink chất lượng.</p>
        [/ux_text]
      [/col]
      [col span="6"]
        [ux_image id="22" bg_radius="12"]
      [/col]
    [/row]
  [/tab]
  [tab title="Quảng Cáo Số"]
    [row v_align="middle"]
      [col span="6"]
        [ux_text]
          <h3>Tối Ưu Ngân Sách Google & Facebook Ads</h3>
          <p>Tăng cường tỷ lệ chuyển đổi, nhắm đúng đối tượng mục tiêu.</p>
        [/ux_text]
      [/col]
      [col span="6"]
        [ux_image id="23" bg_radius="12"]
      [/col]
    [/row]
  [/tab]
[/tabgroup]
```
*   **Why it's GOOD:** Entirely nested. Standard Flatsome grid structures work flawlessly inside native tab panels.

---

## 13. Image Gallery Grid

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="gallery">
    <img src="img1.jpg">
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[ux_gallery ids="101,102,103,104" style="overlay" type="masonry" width="100%" columns="4" columns__sm="2" image_radius="12" image_hover="zoom" lightbox="true"]
```
*   **Why it's GOOD:** Built-in masonry grid sorting, responsive columns, image radius cropping, hover effects, and full-screen lightboxes are natively supported.

---

## 14. Blog Post Grid

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="news-list">
    <!-- WP loops -->
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[blog_posts style="normal" columns="3" columns__sm="1" columns__md="2" image_radius="12" depth="1" depth_hover="3" posts="3" read_more="true" show_date="true" excerpt="true"]
```
*   **Why it's GOOD:** Connects directly to core WordPress posts. Fully configurable excerpt lengths, thumbnail sizes, date displays, and columns.

---

## 15. Contact Section (Map + Form + Info)

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <section class="contact-sec">
    <!-- map iframe + CF7 iframe -->
  </section>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[section bg_color="#ffffff" padding="80px 0" padding__sm="40px 0"]
  [row v_align="middle"]
    [col span="5" span__sm="12"]
      [ux_text]
        <h2>Thông Tin Liên Hệ</h2>
        <p>Kết nối với chúng tôi để khởi đầu dự án mới.</p>
        <p><i class="fas fa-map-marker-alt" style="color:#3b82f6; margin-right:10px"></i> {address}</p>
        <p><i class="fas fa-phone-alt" style="color:#3b82f6; margin-right:10px"></i> {phone}</p>
        <p><i class="fas fa-envelope" style="color:#3b82f6; margin-right:10px"></i> {email}</p>
      [/ux_text]
    [/col]
    [col span="7" span__sm="12" bg_color="#f8fafc" bg_radius="16" padding="40px 30px" depth="1"]
      [ux_text]
        <h3>Gửi Yêu Cầu Tư Vấn</h3>
      [/ux_text]
      [contact-form-7 id="12" title="Form Liên Hệ Mẫu"]
    [/col]
  [/row]
[/section]
```

---

## 16. Feature Showcase Section (Alternating Side-by-Side)

### ❌ BAD (Abusing HTML)
```wordpress
[ux_html]
  <div class="feature-alternating">
    <!-- raw html rows -->
  </div>
[/ux_html]
```

### ✅ GOOD (100% Native Flatsome)
```wordpress
[section bg_color="#ffffff" padding="80px 0" padding__sm="40px 0"]
  <!-- Row 1: Image Left, Text Right -->
  [row v_align="middle"]
    [col span="6" span__sm="12" animate="fadeInLeft"]
      [ux_image id="301" bg_radius="16" depth="2"]
    [/col]
    [col span="6" span__sm="12" padding="0 0 0 40px" padding__sm="20px 0 0 0"]
      [ux_text]
        <span style="color:#3b82f6; font-weight:700; text-transform:uppercase">Tối Ưu On-Page</span>
        <h2>Chiến Lược Tối Ưu Hóa Kỹ Thuật SEO Toàn Diện</h2>
        <p>Chúng tôi tập trung chuẩn hóa cấu trúc trang, cải thiện tốc độ tải trang, và phân bổ từ khóa tự nhiên nhằm nâng thứ hạng nhanh chóng và bền vững.</p>
      [/ux_text]
      [gap height="10px"]
      [button text="Khám Phá Thêm" style="link" size="medium" icon="icon-angle-right" link="/seo/"]
    [/col]
  [/row]

  [gap height="60px"]

  <!-- Row 2: Text Left, Image Right -->
  [row v_align="middle"]
    [col span="6" span__sm="12" order__sm="2" padding="0 40px 0 0" padding__sm="20px 0 0 0"]
      [ux_text]
        <span style="color:#ef4444; font-weight:700; text-transform:uppercase">Liên Kết Chất Lượng</span>
        <h2>Mạng Lưới Backlink Vững Chắc Từ Nguồn Uy Tín</h2>
        <p>Tăng cường sức mạnh tên miền thông qua hệ thống backlink báo chí, guest post cùng chuyên mục đạt chất lượng kiểm định nghiêm ngặt.</p>
      [/ux_text]
      [gap height="10px"]
      [button text="Khám Phá Thêm" style="link" size="medium" icon="icon-angle-right" link="/seo/"]
    [/col]
    [col span="6" span__sm="12" order__sm="1" animate="fadeInRight"]
      [ux_image id="302" bg_radius="16" depth="2"]
    [/col]
  [/row]
[/section]
```
*   **Why it's GOOD:** Alternates perfectly. The `order__sm="2"` and `order__sm="1"` properties ensure that on mobile, the text column seamlessly wraps *underneath* the image column rather than stacking counter-intuitively.
