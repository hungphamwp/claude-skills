/* ==========================================================
   scenes.js — Dữ liệu 48 cảnh · tổng 180.0s
   t = giây bắt đầu · d = thời lượng
   Khớp 1:1 với 01-KICH-BAN.md
   ========================================================== */

const SITE_MENU = [
  ['Cà phê sữa', '29K'], ['Bạc xỉu', '32K'], ['Cold brew', '45K'],
  ['Espresso', '35K'], ['Latte', '42K'], ['Trà đào', '38K'],
];

const SCENES = [

/* ---------- ACT A · HOOK ---------- */
{ t:0.0, d:3.5, l:'phone', kicker:'MỘT WEBSITE HOÀN CHỈNH',
  scroll:[0,-1250], overlayNum:'3 TIẾNG', out:'whip' },

{ t:3.5, d:3.5, l:'viz', viz:'keys',
  h1:'KHÔNG GÕ<br><span class="strike">DÒNG CODE NÀO<i></i></span>',
  h1cls:'h1', firstWordCls:'er', out:'glitch' },

{ t:7.0, d:4.0, l:'title',
  h1:'VIBE<br>CODING', h1cls:'hero-num gm glow-hi',
  sub:'Xem hết — bạn làm được y hệt', out:'sweep' },

/* ---------- ACT B · VIBE CODING LÀ GÌ ---------- */
{ t:11.0, d:3.5, l:'chat', kicker:'BẠN MÔ TẢ BẰNG TIẾNG VIỆT',
  label:'fa-comment · bạn',
  type:'Tạo cho tôi một trang bán cà phê', speed:26, out:'cut' },

{ t:14.5, d:4.0, l:'code', kicker:'AI VIẾT CODE',
  lines:[
    [['tk','&lt;section'],['at',' class'],['pl','='],['st','"hero"'],['tk','&gt;']],
    [['pl','  '],['tk','&lt;h1&gt;'],['pl','Cà phê pha tay'],['tk','&lt;/h1&gt;']],
    [['pl','  '],['tk','&lt;button'],['at',' class'],['pl','='],['st','"btn"'],['tk','&gt;']],
    [['pl','    Đặt bàn']],
    [['pl','  '],['tk','&lt;/button&gt;']],
    [['tk','&lt;/section&gt;']],
  ], speed:0.42,
  overlay:{ at:2.7, h1:'BẠN LÀ ĐẠO DIỄN', sub:'không phải thợ gõ' }, out:'blur' },

{ t:18.5, d:4.0, l:'cards', kicker:'NGÀY XƯA', mood:'gray',
  items:[ {ic:'fa-code',t:'HTML'}, {ic:'fa-palette',t:'CSS'}, {ic:'fa-file-code',t:'JAVASCRIPT'} ],
  drop:true, out:'cut' },

{ t:22.5, d:4.0, l:'bignum', mood:'gray', num:'6 THÁNG',
  sub:'vẫn chưa xong 1 trang', prog:12, out:'flashglitch' },

{ t:26.5, d:3.5, l:'title', kicker:'BÂY GIỜ',
  h1:'1 CÂU  <span class="dim">→</span>  <span class="gm">30 GIÂY</span>',
  sub:'→ web chạy được', punch:true, out:'punch' },

{ t:30.0, d:3.0, l:'cmp', kicker:'KHÔNG PHẢI PHÉP MÀU',
  h2:'MÔ TẢ RÕ <span class="cy">=</span> KẾT QUẢ CHUẨN',
  left:{ lb:'MƠ HỒ', vl:'"làm web đẹp"', cls:'bad' },
  right:{ lb:'CỤ THỂ', vl:'"landing page cà phê,<br>nền tối, có menu"', cls:'good' },
  out:'morph' },

/* ---------- ACT C · VÌ SAO XU HƯỚNG ---------- */
{ t:33.0, d:3.5, l:'viz', viz:'chart', h1:'VÌ SAO<br>BÙNG NỔ?',
  sub:'<span class="cy">3 lý do</span>', out:'whip' },

{ t:36.5, d:4.0, l:'viz', viz:'tree', badge:'01',
  h2:'ĐỌC HIỂU CẢ DỰ ÁN', sub:'không chỉ 1 file', out:'cut' },

{ t:40.5, d:4.0, l:'term', badge:'02', h2:'TỰ CHẠY · TỰ SỬA',
  cmd:'npm run build',
  out:[ {at:1.1,cls:'er',tx:'✕  Error: button is not defined'},
        {at:1.9,cls:'cm',tx:'→  AI đang sửa script.js…'},
        {at:2.7,cls:'ok',tx:'✓  Build successful'} ],
  outT:'sweep' },

{ t:44.5, d:4.0, l:'viz', viz:'merge', badge:'03',
  h2:'1 NGƯỜI <span class="gm">=</span> 1 TEAM', out:'cut' },

{ t:48.5, d:3.5, l:'cmp', col:true,
  left:{ lb:'TRƯỚC', vl:'2 TUẦN', cls:'bad strike-vl' },
  right:{ lb:'BÂY GIỜ', vl:'1 BUỔI CHIỀU', cls:'good' },
  out:'glitch' },

/* ---------- ACT D · CÔNG CỤ ---------- */
{ t:52.0, d:4.0, l:'viz', viz:'scatter',
  h1:'CHỌN SAI<br>CÔNG CỤ', sub:'<span class="er">= mất cả tuần</span>', out:'cut' },

{ t:56.0, d:4.0, l:'tool', name:'CURSOR', chip:'DỄ NHẤT CHO NGƯỜI MỚI', chipCls:'cy',
  star:true, win:'editor', out:'glass' },

{ t:60.0, d:4.0, l:'tool', name:'CLAUDE CODE', chip:'MẠNH KHI DỰ ÁN LỚN', chipCls:'',
  win:'terminal', out:'coderain' },

{ t:64.0, d:4.0, l:'tool', name:'CHATGPT', chip:'Ý TƯỞNG + NỘI DUNG', chipCls:'ok',
  win:'chat', out:'cut' },

{ t:68.0, d:4.0, l:'tool', name:'WINDSURF<br>GITHUB COPILOT', nameSm:true,
  chip:'GỢI Ý KHI ĐANG GÕ', chipCls:'wa', win:'ghost', out:'whip' },

{ t:72.0, d:4.0, l:'title', h1:'NGƯỜI MỚI:<br>BẮT ĐẦU VỚI <span class="gm">CURSOR</span>',
  h1cls:'h2', sub:'1 công cụ thôi — đừng ôm hết', out:'punch' },

/* ---------- ACT E · DEMO (step 1..6) ---------- */
{ t:76.0, d:3.0, l:'title', step:1, h1:'LÀM THẬT', h1cls:'hero-num gm glow-hi',
  sub:'Website quán cà phê', out:'cut' },

{ t:79.0, d:4.0, l:'viz', viz:'wire', step:1, kicker:'BƯỚC 1 — Ý TƯỞNG',
  chips:[ {ic:'fa-list',t:'MENU'}, {ic:'fa-image',t:'ẢNH QUÁN'}, {ic:'fa-calendar-check',t:'NÚT ĐẶT BÀN'} ],
  out:'cut' },

{ t:83.0, d:4.0, l:'chat', step:2, kicker:'BƯỚC 2 — PROMPT',
  h2:'CÀNG CỤ THỂ CÀNG TỐT', label:'fa-wand-magic-sparkles · Cursor · Composer',
  type:'', speed:26, idle:true, out:'cut' },

{ t:87.0, d:5.0, l:'chat', step:2, label:'fa-wand-magic-sparkles · Cursor · Composer',
  type:'Tạo landing page cho quán cà phê, nền tối, có menu và nút đặt bàn.',
  speed:22, hl:['landing page','nền tối','menu','nút đặt bàn'], enter:true, out:'sweep' },

{ t:92.0, d:4.0, l:'code', step:3, kicker:'BƯỚC 3 — AI SINH CODE', fast:true,
  lines:[
    [['cm','/* hero */']],
    [['tk','&lt;section'],['at',' class'],['pl','='],['st','"hero"'],['tk','&gt;']],
    [['pl','  '],['tk','&lt;h1&gt;'],['pl','Cà phê pha tay, mỗi sáng'],['tk','&lt;/h1&gt;']],
    [['pl','  '],['tk','&lt;a'],['at',' href'],['pl','='],['st','"#dat-ban"'],['tk','&gt;'],['pl','Đặt bàn']],
    [['tk','&lt;/section&gt;']],
    [['cm','/* menu */']],
    [['kw','const'],['pl',' menu '],['pl','= ['],['st','"Cà phê sữa"'],['pl',', …]']],
    [['kw','function'],['pl',' render'],['pl','() {']],
    [['pl','  menu.'],['at','map'],['pl','(m => card(m))']],
    [['pl','}']],
  ], speed:0.30,
  files:[ {at:1.0,n:'index.html'}, {at:2.0,n:'style.css'}, {at:3.0,n:'script.js'} ],
  timer:30, out:'blur' },

{ t:96.0, d:4.0, l:'phone', step:4, kicker:'BƯỚC 4 — XEM THỬ', tag:'v1',
  scroll:[0,-520], reveal:'morph', out:'cut' },

{ t:100.0, d:4.0, l:'chat', step:4, phone:true, h2:'CHƯA ƯNG?',
  label:'fa-comment · sửa bằng 1 câu',
  type:'Nút đặt bàn to hơn và đổi sang màu cam.', speed:26,
  effect:'btn', out:'cut' },

{ t:104.0, d:4.0, l:'phone', step:4, darkWipe:true,
  tags:['+ DARK MODE','+ ANIMATION'], scroll:[-120,-560], out:'sweep' },

{ t:108.0, d:4.0, l:'brw', step:4, kicker:'RESPONSIVE',
  widths:[[1440,3],[768,2],[390,1]], out:'glass' },

{ t:112.0, d:4.0, l:'viz', viz:'check', step:5, kicker:'BƯỚC 5 — CHẠY THỬ',
  items:['Menu','Form liên hệ','Nút đặt bàn'], out:'cut' },

{ t:116.0, d:3.5, l:'viz', viz:'deploy', step:6, kicker:'BƯỚC 6 — DEPLOY',
  url:'quan-ca-phe.vercel.app', out:'flash' },

{ t:119.5, d:2.5, l:'bignum', step:6, num:'20 PHÚT', glow:true,
  sub:'từ ý tưởng → link thật', allSteps:true, out:'whip' },

/* ---------- ACT F · 10 PROMPT ---------- */
{ t:122.0, d:3.0, l:'title', h1:'10 PROMPT', h1cls:'hero-num gm glow-hi',
  sub:'<i class="fa-solid fa-bookmark cy"></i>&nbsp; Chụp màn hình lại', out:'cut' },

{ t:125.0, d:3.5, l:'cards', items:[
  {n:'01',ic:'fa-graduation-cap',t:'Tạo landing page bán khóa học'},
  {n:'02',ic:'fa-building',      t:'Tạo website giới thiệu công ty'},
  {n:'03',ic:'fa-spa',           t:'Tạo website spa, có đặt lịch'} ], out:'cut' },

{ t:128.5, d:3.5, l:'cards', items:[
  {n:'04',ic:'fa-utensils',                t:'Tạo website nhà hàng, có đặt bàn'},
  {n:'05',ic:'fa-moon',                    t:'Thêm dark mode, theo hệ thống'},
  {n:'06',ic:'fa-wand-magic-sparkles',     t:'Thêm animation khi cuộn trang'} ], out:'cut' },

{ t:132.0, d:3.0, l:'cards', sm:true, items:[
  {n:'07',ic:'fa-mobile-screen',           t:'Cho responsive trên mobile'},
  {n:'08',ic:'fa-envelope',                t:'Thêm form liên hệ, có kiểm tra'},
  {n:'09',ic:'fa-magnifying-glass-chart',  t:'Tối ưu SEO: title, description'},
  {n:'10',ic:'fa-rocket',                  t:'Deploy lên Vercel'} ], out:'punch' },

/* ---------- ACT G · 3 LỖI ---------- */
{ t:135.0, d:3.0, l:'title', warn:true, h1:'3 LỖI KHIẾN<br>NGƯỜI MỚI <span class="er">BỎ CUỘC</span>',
  h1cls:'h2', icon:'fa-triangle-exclamation', out:'glitch' },

{ t:138.0, d:4.0, l:'cmp', warn:true, badge:'01', badgeCls:'er',
  h2:'PROMPT CHUNG CHUNG', col:true,
  left:{ lb:'SAI', vl:'"làm web đẹp cho tôi"', cls:'bad' },
  right:{ lb:'CÁCH SỬA', vl:'Nêu rõ: ngành · màu · khối', cls:'good' }, out:'cut' },

{ t:142.0, d:4.0, l:'viz', viz:'split', warn:true, badge:'02',
  h2:'LÀM CẢ TRANG 1 LẦN', sub:'Cách sửa: Hero → Menu → Form → Footer', out:'cut' },

{ t:146.0, d:4.0, l:'viz', viz:'timeline', warn:true, badge:'03', broken:true,
  h2:'KHÔNG LƯU BẢN CHẠY ĐƯỢC', sub:'<span class="er">hỏng 1 cái = mất sạch</span>', out:'cut' },

{ t:150.0, d:4.0, l:'viz', viz:'timeline', badge:'', kicker:'CÁCH SỬA', kickerCls:'ok',
  h2:'AI LÀM ĐÚNG <span class="ok">→</span> GIT COMMIT',
  code:'git commit -m "ok"', out:'sweep' },

/* ---------- ACT H · CÒN CẦN HỌC CODE? ---------- */
{ t:154.0, d:4.5, l:'title', h1:'CÒN CẦN HỌC<br>LẬP TRÌNH KHÔNG?', h1cls:'h2',
  stage2:{ at:2.0, h1:'VẪN CẦN', cls:'hero-num gm glow-hi' }, out:'cut' },

{ t:158.5, d:4.5, l:'code', kicker:'AI VẪN SAI', errorLine:3, magnify:true,
  lines:[
    [['kw','function'],['pl',' datBan() {']],
    [['pl','  '],['kw','const'],['pl',' f = '],['at','document'],['pl','.'],['at','forms'],['pl','[0]']],
    [['pl','  btn.'],['at','addEventListener'],['pl','('],['st','"click"'],['pl',', send)']],
    [['pl','  '],['at','console'],['pl','.'],['at','log'],['pl','('],['st','"ok"'],['pl',')']],
    [['pl','}']],
  ], speed:0.001, sub:'bạn phải biết nó sai chỗ nào', out:'cut' },

{ t:163.0, d:4.0, l:'cmp', col:true, h2:'',
  left:{ lb:'QUAN TRỌNG HƠN', vl:'ĐỌC HIỂU CODE', cls:'good big' },
  right:{ lb:'', vl:'tự viết code', cls:'faded' }, out:'sweep' },

/* ---------- ACT I · LỜI KHUYÊN + CTA ---------- */
{ t:167.0, d:3.5, l:'viz', viz:'books', kicker:'LỜI KHUYÊN CUỐI',
  h1:'ĐỪNG HỌC<br>LÝ THUYẾT TRƯỚC', out:'cut' },

{ t:170.5, d:3.5, l:'phone', portfolio:true, h2:'LÀM LUÔN 1 DỰ ÁN NHỎ',
  sub:'Trang giới thiệu bản thân', scroll:[0,0], out:'glass' },

{ t:174.0, d:3.5, l:'cta', out:'cut' },

{ t:177.5, d:2.5, l:'cta', tail:true, out:'end' },
];

/* Nhãn 6 bước dùng chung cho act E */
const STEP_LABELS = ['Ý tưởng','Prompt','Sinh code','Xem thử','Chạy thử','Deploy'];
