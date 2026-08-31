#!/usr/bin/env python3
"""
make_thumbnail.py — Thumbnail kiểu "sticker" (nền cyan, viền hồng lệch,
chữ đen đậm hơi nghiêng) — phong cách hay thấy trên các kênh kiến thức
kỹ thuật (Reels/TikTok/Instagram).

DÙNG:
  # Tự lấy đúng câu chính của video (khuyến nghị — không lệch nội dung):
  python3 make_thumbnail.py --bg output/preview/t-8s.png \
      --scenes scenes.js --scene 0 --out output/thumbnail.png

  # Hoặc tự gõ chữ riêng nếu muốn khác với mọi cảnh có sẵn:
  python3 make_thumbnail.py --bg output/preview/t-8s.png \
      --text "Kho Tài Nguyên Khổng Lồ:\nNâng Cấp Toàn Diện Cho Claude Code" \
      --out output/thumbnail.png

Nền lấy từ bất kỳ ảnh nào — dễ nhất là 1 khung hình đã render sẵn trong
output/preview/ (chạy `node record.js --preview <giây>` trước để có ảnh
chọn), hoặc 1 ảnh trong assets/*-shots/.

Màu mặc định là màu thương hiệu TikTok thật (cyan #25F4EE / đỏ hồng
#FE2C55) — đổi bằng `--cyan`/`--pink` nếu không đăng lên TikTok.

KẾT QUẢ: PNG 1080×1920 — tự tải lên làm ảnh bìa (cover) khi đăng video.
"""

import argparse
import os
import re

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, '..', 'assets', 'template', 'vendor', 'fonts', 'gilroy')
W, H = 1080, 1920

# Màu thương hiệu TikTok thật — Cyan #25F4EE / Đỏ hồng #FE2C55 (không phải
# cyan/magenta chung chung) để thumbnail nhìn "quen mắt" như trên TikTok.
CYAN = (37, 244, 238)
PINK = (254, 44, 85)
INK = (16, 16, 16)


def extract_from_scenes(scenes_path, index):
    """Lấy đúng câu chính (h1, rồi tới kicker) của 1 cảnh trong scenes.js
    thật — để thumbnail luôn khớp nội dung video, không phải gõ tay lại
    và dễ lệch với những gì video thực sự nói. Tách bằng regex thay vì
    chạy JS thật — scenes.js không phải JSON nên không parse chuẩn được,
    nhưng mỗi cảnh luôn bắt đầu bằng `{ t:` nên tách khối theo đó là đủ."""
    src = open(scenes_path, encoding='utf-8').read()
    blocks = re.split(r'\{\s*t\s*:', src)[1:]  # bỏ phần trước cảnh đầu tiên
    if index >= len(blocks):
        raise SystemExit(f'❌ scenes.js chỉ có {len(blocks)} cảnh, không có cảnh số {index}.')
    block = blocks[index]

    def field(name):
        m = re.search(name + r"\s*:\s*'((?:[^'\\]|\\.)*)'", block)
        return m.group(1) if m else None

    text = field('h1') or field('kicker') or ''
    text = text.replace("\\'", "'")
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.I)
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()


def find_font():
    for name in ('SVN-Gilroy Black.otf', 'SVN-Gilroy Heavy.otf', 'SVN-Gilroy Bold.otf'):
        p = os.path.join(FONT_DIR, name)
        if os.path.exists(p):
            return p
    return None  # PIL sẽ dùng font mặc định — vẫn chạy được, chỉ xấu hơn


def cover_crop(im, w, h):
    """Resize + center-crop để lấp đầy khung w×h, không méo ảnh."""
    iw, ih = im.size
    scale = max(w / iw, h / ih)
    im = im.resize((int(iw * scale) + 1, int(ih * scale) + 1), Image.LANCZOS)
    iw, ih = im.size
    x0, y0 = (iw - w) // 2, (ih - h) // 2
    return im.crop((x0, y0, x0 + w, y0 + h))


def rounded_rect_layer(w, h, radius, fill):
    """Vẽ 1 rounded-rect trên layer RGBA trong suốt (có lề để xoay không bị cắt góc)."""
    pad = int(max(w, h) * 0.25)
    layer = Image.new('RGBA', (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle([pad, pad, pad + w, pad + h], radius=radius, fill=fill)
    return layer, pad


def wrap_text(draw, text, font, max_width):
    lines = []
    for para in text.split('\n'):
        words = para.split(' ')
        cur = ''
        for w in words:
            trial = (cur + ' ' + w).strip()
            if draw.textlength(trial, font=font) <= max_width or not cur:
                cur = trial
            else:
                lines.append(cur)
                cur = w
        lines.append(cur)
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bg', required=True, help='ảnh nền (screenshot/khung hình bất kỳ)')
    ap.add_argument('--text', help=r'chữ trên sticker, \n để xuống dòng thủ công')
    ap.add_argument('--scenes', help='đường dẫn scenes.js — tự lấy h1/kicker của 1 cảnh làm chữ, thay cho --text')
    ap.add_argument('--scene', type=int, default=0, help='chỉ số cảnh trong scenes.js muốn lấy (0 = cảnh đầu = hook)')
    ap.add_argument('--out', default='output/thumbnail.png')
    ap.add_argument('--cyan', default=None, help='hex, mặc định #29E0E0')
    ap.add_argument('--pink', default=None, help='hex, mặc định #FF2F92')
    ap.add_argument('--angle', type=float, default=-2.0)
    ap.add_argument('--font-size', type=int, default=64)
    ap.add_argument('--width-ratio', type=float, default=0.82, help='sticker rộng bao nhiêu %% khung hình')
    ap.add_argument('--y', type=float, default=0.5, help='vị trí tâm sticker theo chiều dọc, 0..1')
    a = ap.parse_args()

    cyan = tuple(int(a.cyan.lstrip('#')[i:i+2], 16) for i in (0, 2, 4)) if a.cyan else CYAN
    pink = tuple(int(a.pink.lstrip('#')[i:i+2], 16) for i in (0, 2, 4)) if a.pink else PINK

    canvas = cover_crop(Image.open(a.bg).convert('RGB'), W, H).convert('RGBA')

    if a.text:
        text = a.text.replace('\\n', '\n')
    elif a.scenes:
        text = extract_from_scenes(a.scenes, a.scene)
        if not text:
            raise SystemExit(f'❌ Cảnh {a.scene} trong {a.scenes} không có h1/kicker.')
    else:
        raise SystemExit('❌ Cần --text hoặc --scenes (lấy tự động từ nội dung video).')
    font_path = find_font()
    font = ImageFont.truetype(font_path, a.font_size) if font_path else ImageFont.load_default()

    tmp_draw = ImageDraw.Draw(canvas)
    box_w = int(W * a.width_ratio)
    pad_x, pad_y, line_gap = 44, 34, 10
    lines = wrap_text(tmp_draw, text, font, box_w - pad_x * 2)
    line_h = font.getbbox('Ag')[3] - font.getbbox('Ag')[1]
    box_h = pad_y * 2 + len(lines) * line_h + (len(lines) - 1) * line_gap

    radius = 22
    pink_layer, pink_pad = rounded_rect_layer(box_w + 16, box_h + 16, radius + 4, pink + (255,))
    cyan_layer, cyan_pad = rounded_rect_layer(box_w, box_h, radius, cyan + (255,))

    d = ImageDraw.Draw(cyan_layer)
    y = cyan_pad + pad_y
    for ln in lines:
        lw = d.textlength(ln, font=font)
        d.text((cyan_pad + (box_w - lw) / 2, y), ln, font=font, fill=INK)
        y += line_h + line_gap

    pink_r = pink_layer.rotate(a.angle, resample=Image.BICUBIC, expand=True)
    cyan_r = cyan_layer.rotate(a.angle, resample=Image.BICUBIC, expand=True)

    cx, cy = W // 2, int(H * a.y)
    px = cx - pink_r.width // 2 + 10
    py = cy - pink_r.height // 2 + 12
    canvas.alpha_composite(pink_r, (px, py))
    cx2 = cx - cyan_r.width // 2
    cy2 = cy - cyan_r.height // 2
    canvas.alpha_composite(cyan_r, (cx2, cy2))

    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
    canvas.convert('RGB').save(a.out, quality=95)
    print(f'📁 {a.out}  ({W}×{H})')


if __name__ == '__main__':
    main()
