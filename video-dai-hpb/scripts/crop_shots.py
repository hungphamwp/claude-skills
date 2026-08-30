#!/usr/bin/env python3
"""
crop_shots.py — Chuẩn hoá ảnh chụp màn hình thật dùng cho layout `shot`

Ảnh chụp màn hình tải về (landing page, GitHub README, app...) thường
lệch tỉ lệ nhau và có nhiều khoảng trống thừa quanh mép — cắt về cùng
16:9 rồi zoom nhẹ vào giữa giúp cả loạt ảnh trong 1 video nhìn ĐỒNG BỘ
và tập trung vào phần đáng xem, thay vì để nguyên khung chụp gốc.

DÙNG:
  python3 crop_shots.py assets/orca-shots/*.jpg
  python3 crop_shots.py --ratio 4:3 --zoom 0.88 assets/shots/*.png

Mặc định: tỉ lệ 16:9, zoom 0.92 (cắt thêm ~8% mỗi cạnh). Ghi đè trực
tiếp lên file gốc — chạy trên bản copy nếu muốn giữ ảnh gốc.
"""

import argparse
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit('❌ Chưa cài Pillow. Chạy: pip3 install --user --break-system-packages Pillow')


def crop_to_ratio_and_zoom(im, ratio, zoom):
    w, h = im.size
    cur = w / h
    if cur > ratio:
        new_w = int(h * ratio)
        x0 = (w - new_w) // 2
        im = im.crop((x0, 0, x0 + new_w, h))
    else:
        new_h = int(w / ratio)
        y0 = (h - new_h) // 2
        im = im.crop((0, y0, w, y0 + new_h))
    w2, h2 = im.size
    zw, zh = int(w2 * zoom), int(h2 * zoom)
    x0, y0 = (w2 - zw) // 2, (h2 - zh) // 2
    return im.crop((x0, y0, x0 + zw, y0 + zh))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('files', nargs='+', help='ảnh cần chuẩn hoá (ghi đè tại chỗ)')
    ap.add_argument('--ratio', default='16:9', help='vd 16:9, 4:3, 16:10 (mặc định 16:9)')
    ap.add_argument('--zoom', type=float, default=0.92, help='1.0 = không zoom, 0.9 = cắt thêm 10%')
    a = ap.parse_args()

    rw, rh = (float(x) for x in a.ratio.split(':'))
    ratio = rw / rh

    for f in a.files:
        im = Image.open(f).convert('RGB')
        before = im.size
        out = crop_to_ratio_and_zoom(im, ratio, a.zoom)
        out.save(f, quality=92)
        print(f'{f}: {before} → {out.size}')


if __name__ == '__main__':
    main()
