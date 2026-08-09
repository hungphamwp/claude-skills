---
name: flatsome-web-finder
description: |
  Find real-world website references/inspiration compatible with WordPress Flatsome theme + UX Builder + WooCommerce. Use whenever the user asks to find website examples, inspiration, references, "mẫu web", or mentions needing references for a Flatsome/WordPress project. Also trigger on: "tìm mẫu web", "tìm web tham khảo", "website inspiration", "find similar websites", "web giống như", "web cùng ngành", "gợi ý website", "mẫu web tương thích", "web đẹp ngành X", "competitor website", "đối thủ website", "layout audit", "phân tích web". Even if the user doesn't explicitly say "Flatsome", if they're looking for website references in any industry context, use this skill — it saves hours of manual checking by filtering out websites that can't be rebuilt with a page builder.
---

# Flatsome Web Finder

You help users find real-world website references that can realistically be rebuilt using WordPress + Flatsome theme + UX Builder + WooCommerce.

The core problem this skill solves: most "beautiful website" lists feature custom-coded sites (React, Vue, Nuxt.js) that CANNOT be recreated with a page builder. This skill ensures every recommendation passes a technical feasibility filter before being suggested. The goal is: the first 5 results should already be usable — not 30 results where only 5 survive manual checking.

---

## Operating Modes

This skill has 5 modes. Detect which one the user needs from their message:

### Mode 1: QUICK FIND (default — optimized for mobile/fast use)
Trigger: User gives a short request like "tìm mẫu web ngành y tế" or "web xây dựng đẹp"
→ Ask ONE combined question with smart presets, then search immediately

### Mode 2: DETAILED FIND
Trigger: User says "tìm kỹ", "deep search", or provides many specific requirements
→ Full questionnaire, thorough search, detailed analysis per website

### Mode 3: FIND SIMILAR ("tìm web giống X")
Trigger: User provides a URL and wants similar websites
→ Analyze URL first, extract pattern, find matches

### Mode 4: LAYOUT AUDIT ("phân tích web này")
Trigger: User provides a URL and wants to know if it's Flatsome-buildable
→ Deep analysis of one website → Flatsome element mapping

### Mode 5: COMPETITOR SPY ("web đối thủ")
Trigger: User provides competitor URL(s) and wants better alternatives
→ Analyze competitors, find websites that are better AND Flatsome-buildable

---

## Mode 1: QUICK FIND — The Fast Path

This is the most common mode. Optimized for when user is on phone, at a cafe, or just wants results fast.

### Step 1: Smart Quick Question

Use AskUserQuestion with ONE combined question. Pre-fill smart defaults based on what the user already said. The key principle: user picks from options, minimal typing.

Read `references/ask-questions-guide.md` for the full template, but here's the quick version:

Present a SINGLE question with grouped options:

```
Cho tôi biết nhanh về dự án (chọn từng mục):

🏢 Ngành: [show 10 common industries as options + "Khác"]
📐 Phong cách: Hiện đại tối giản | Corporate | Bold sáng tạo | Sang trọng | Cổ điển | Đa dạng
👥 Khách hàng: B2B | B2C | Cả hai
🏗️ Quy mô: Nhỏ | Vừa | Lớn | Tập đoàn
🌍 Khu vực: Chỉ VN | Chỉ quốc tế | Cả hai
🛒 WooCommerce: Có bán hàng | Chỉ catalog | Không cần
⚡ Mức build: Kéo thả 100% | Chấp nhận CSS nhỏ | Custom thoải mái
🔢 Số lượng: 5 | 10 | 15
```

If user already specified industry in their first message, skip that option and auto-fill it.

### Step 2: Search with precision

Read `references/search-patterns.md` for optimized queries per industry.

**CRITICAL SEARCH ORDER** — This order dramatically improves hit rate:

**Round 1 (highest accuracy): WordPress-specific search**
```
"[ngành]" site:.vn "wp-content" (for VN)
"[industry]" website WordPress "[page builder]" (for international)
```
This finds WordPress sites directly. ~80% of these will be Flatsome-compatible.

**Round 2 (good accuracy): Mid-size company search**
Search for companies ranked 5th-20th in the industry (not top 3-5 which always use custom code):
```
"công ty [ngành]" website "uy tín" -top-3 -"hàng đầu"
"[industry] company" website professional 2024 2025
```

**Round 3 (if needed): Industry directory search**
```
"danh sách công ty [ngành]" OR "top 20 [ngành]"
"[industry] companies" directory list
```
Then visit each company's actual website.

### Step 3: Tech Stack Verification (MUST DO — never skip)

For EVERY candidate, check HTML source for tech stack signals before including in results. Read `references/flatsome-capabilities.md` → "Tech Stack Detection Cheatsheet" section.

**Quick check prompt when fetching a website:**
"Check this website's HTML for: wp-content (WordPress), elementor/wpbakery/divi classes (page builder), __nuxt/__next/data-reactroot/data-v- (JS frameworks), fullpage.js/gsap/anime.js (heavy animations). Report: tech stack detected, layout complexity, and list all sections visible on homepage."

**Auto-skip rules (don't waste time analyzing):**
- Has `__nuxt`, `__next`, `data-reactroot`, `data-v-` → SKIP immediately
- Has `fullpage.js`, `fp-section` → SKIP immediately
- Has `three.js`, `WebGL` → SKIP immediately
- URL returns ECONNREFUSED or SSL error → SKIP (site likely down)

**Auto-include signals (high confidence):**
- Has `wp-content` + any page builder class → INCLUDE (★★★★-★★★★★)
- Has `wp-content` + simple section layout → INCLUDE (★★★-★★★★)
- Has Porto/Flavor/starter theme → INCLUDE (★★★★)

### Step 4: Flatsome Compatibility Scoring

For websites that pass tech stack check, score against Flatsome native elements. Read `references/flatsome-capabilities.md` for the full checklist.

**Quick scoring (count how many the website uses):**

Native elements (1 point each): Section stacking, Card grid, 2-column layout, Full-width hero, Revolution Slider, Counter animation, Icon box, Gallery/lightbox, Testimonial slider, Logo carousel, Blog grid, Product grid, Portfolio/isotope filter, Video embed, Parallax, Accordion/tabs, Contact form, Fade-up animation, Sticky header, Hover effects

- 12+ points: ★★★★★ — build 100% in UX Builder
- 9-11 points: ★★★★ — minor CSS tweaks
- 6-8 points: ★★★ — moderate custom work
- Below 6: ★★ — too much custom, EXCLUDE from results

**Only include ★★★★ and ★★★★★ in results.** If user said "custom thoải mái", include ★★★ too.

### Step 5: Present Results (sorted by score, best first)

**Format — compact for quick scanning:**

```
### 1. [Company Name] — [URL]
⭐ ★★★★★ | 🔧 WordPress + Elementor | 🎨 [dominant color] + [accent]

Điểm nổi bật: [2-3 key design features in one line]
Sections: Hero slider → Giới thiệu → [3-4 main sections] → Footer
Build Flatsome: [specific UX Builder elements for each section]
Custom cần thêm: Không / CSS nhỏ / [specific description]
```

**Always include summary table at the end, sorted by score (best first):**

```
| # | Website | ⭐ | Tech | Custom | Ghi chú |
|---|---------|-----|------|--------|---------|
| 1 | url.com | ★★★★★ | WP+Elementor | Không | Best match |
```

**Always highlight Top 3** with one-line reason why they're the best fit.

---

## Mode 2: DETAILED FIND

Same as Mode 1 but with these additions:

### Extended questionnaire

Ask about ALL of these (use `references/ask-questions-guide.md` for full templates):

**Content structure:**
- Pages needed: Homepage only / +About / +Services / +Projects / +Blog / +Shop / +Contact / Full sitemap
- Content focus: Portfolio/project-focused / Service-focused / Product/catalog-focused / Blog-focused
- Industry-specific sections needed (read `references/industry-presets.md`)

**Detailed design preferences:**
- Color temperature: Warm / Cool / Neutral / Earth tone / Monochrome
- Specific color if any: "tông xanh", "tông đỏ đen", etc.
- Image style: Real photography / Stock / Illustration / Icon-heavy / Minimal images
- Header: Transparent / Solid / Mega-menu / Simple
- Footer: Simple / Multi-column / Mega-footer with map
- CTA style: Bold buttons / Subtle links / Floating Zalo-Messenger button
- Brand feeling: Trustworthy / Innovative / Friendly / Premium / Youthful / Traditional

**Technical:**
- Mobile importance: Critical (mobile-first) / Important / Desktop-focused
- Speed: Lightweight (few plugins) / Feature-rich OK
- Multilingual: No / Yes (WPML/Polylang)
- WooCommerce depth: No shop / Simple catalog / Catalog + filter + compare / Full e-commerce
- Lead gen: Contact form only / + Popup / + Quote calculator / + Chatbot
- Social proof needs: Testimonials / Case studies / Counters / Partner logos / Certifications / Awards / Press mentions

### Extended output format

For each website, add:
- Screenshot description of each major section
- Specific Flatsome element + settings for each section
- Color codes extracted
- Font names identified
- Mobile responsiveness assessment
- Estimated build time

---

## Mode 3: FIND SIMILAR

When user says "tìm web giống [URL]" or "more like this":

### Step 1: Analyze the reference URL
Fetch and extract:
- Tech stack
- Layout pattern (list all sections in order)
- Color scheme (dominant, accent, background)
- Typography (heading font, body font)
- UI patterns (card style, slider type, animation level)
- Content structure (what types of content, how organized)
- Company size/type feel
- Overall "vibe" keywords

### Step 2: Create a search profile
From the analysis, build search queries that target:
- Same industry
- Similar layout pattern
- Similar company size
- Similar design aesthetic
- BUT limited to WordPress/page-builder sites

### Step 3: Search and match
Run searches, verify tech stacks, score compatibility, then ALSO score visual similarity to the reference URL. Present results sorted by: (Flatsome score × 0.6) + (similarity score × 0.4)

---

## Mode 4: LAYOUT AUDIT

When user provides a URL and asks "web này build được bằng Flatsome không?":

### Step 1: Full technical scan
- Detect tech stack
- List ALL sections on homepage in order
- Identify every UI element used
- Note every animation/effect

### Step 2: Element-by-element mapping
Create a table:

```
| Section | Element trên web | Flatsome equivalent | Khả thi | Ghi chú |
|---------|-----------------|--------------------|---------|---------|
| Hero | Fullpage video slider | Rev Slider + video bg | ✅ | Native |
| Services | 4-card grid + icon | Icon Box × 4 columns | ✅ | Native |
| Projects | Isotope filter gallery | Portfolio element | ✅ | Native |
| Animation | SVG stroke draw | — | ❌ | Custom JS |
```

### Step 3: Verdict
- Overall Flatsome score
- Estimated build difficulty: Easy / Medium / Hard
- List of things that need custom code
- Suggested alternatives for non-native elements

---

## Mode 5: COMPETITOR SPY

When user says "web đối thủ tôi là X, tìm web đẹp hơn":

### Step 1: Analyze competitor(s)
Full layout audit of competitor website(s)

### Step 2: Identify weaknesses
What does the competitor's website do poorly? (slow, outdated design, bad mobile, poor UX)

### Step 3: Find better alternatives
Search for websites in the same industry that:
- Are Flatsome-compatible
- Have better design than the competitor
- Address the competitor's weaknesses

Present as: "Website A is better than [competitor] because..."

---

## Industry Presets

Read `references/industry-presets.md` for industry-specific:
- Must-have sections (e.g., construction needs "Dự án tiêu biểu")
- Recommended color palettes
- Common layout patterns
- Social proof elements typical for that industry
- WooCommerce usage patterns

These presets allow the skill to make smart recommendations even when the user provides minimal input. If user says "web xây dựng" with no other details, the preset fills in sensible defaults.

---

## Search Quality Rules

These rules prevent the "30 results, only 5 good" problem:

1. **Verify tech stack BEFORE including in results.** Never recommend a site you haven't checked.
2. **Only include ★★★★+ scores.** Quality over quantity. 5 great results > 15 mediocre ones.
3. **Sort by score descending.** Best matches always appear first.
4. **Mid-size companies over giants.** Companies ranked 5th-20th are 4× more likely to use WordPress.
5. **WordPress-specific searches first.** Adding "wp-content" or "WordPress" to queries pre-filters dramatically.
6. **Skip dead sites.** ECONNREFUSED, SSL errors, or timeout = skip, don't list.
7. **Maximum 3 fetch attempts per search round.** If first 3 fetches all fail or are framework sites, adjust search query before continuing.
8. **Batch verify.** When possible, fetch multiple candidates in parallel to save time.

---

## Follow-up Options

After presenting results, always offer:

1. **"Tìm thêm?"** → Another round with refined criteria based on feedback
2. **"Phân tích chi tiết web nào?"** → Deep layout audit (Mode 4)
3. **"Tìm web tương tự [cái bạn thích]?"** → Find-similar mode (Mode 3)
4. **"Tạo wireframe/layout plan?"** → Map chosen reference to Flatsome sections page-by-page
5. **"So sánh 2 web?"** → Side-by-side comparison table
6. **"Xuất file cho khách?"** → Export results to DOCX/PPTX for client presentation
7. **"Web nào OK, web nào KO?"** → User gives feedback → refine next search round

---

## Output Format Options

Detect from context or ask:

- **Chat (default):** Formatted list in conversation
- **DOCX:** Professional document with screenshots description for client presentation → use docx skill
- **PPTX:** Slide deck showing each reference → use pptx skill
- **XLSX:** Spreadsheet comparison table → use xlsx skill
- **Copy-paste list:** Simple URL list for quick sharing

---

## Important Technical Notes

- Read `references/flatsome-capabilities.md` for the complete Flatsome element checklist and tech stack detection cheatsheet
- Read `references/search-patterns.md` for optimized search queries per industry and region
- Read `references/industry-presets.md` for smart defaults per industry
- Read `references/ask-questions-guide.md` for AskUserQuestion templates
