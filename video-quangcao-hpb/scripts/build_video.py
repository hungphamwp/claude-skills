#!/usr/bin/env python3
"""
============================================================
build_video.py — Dựng video quảng cáo dọc từ A đến Z
============================================================

    python3 build_video.py --config video.json --out ~/Desktop/video-abc

Một lệnh chạy hết chuỗi:
  1. Trộn config người dùng với mặc định thương hiệu
  2. Tính _schedule (mốc gõ chữ, tốc độ gõ, mốc chạy giá)
  3. Dựng thư mục dự án từ template
  4. Mở web server tạm
  5. Render 450 frame → MP4 (record.js)
  6. Tạo giọng đọc + nhạc nền + SFX, ghép vào video (build_audio.py)

Vì sao có bước 2: chữ đang gõ do 3 nơi cùng dựng lại (hình,
tiếng gõ phím, và bản render). Tính một lần rồi ghi vào config
để cả ba đọc chung — không bao giờ lệch nhau.

Cờ hữu ích:
  --preview 3.5,9,13   chỉ chụp vài khung hình để soi bố cục
  --no-audio           chỉ render hình
  --keep               giữ thư mục dự án (mặc định là giữ)
============================================================
"""

import argparse
import copy
import json
import os
import shutil
import socket
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
TEMPLATE = os.path.join(SKILL, 'assets', 'template')


# ============================================================
# MẶC ĐỊNH — thương hiệu HPB Media
# ============================================================
DEFAULTS = {
    "brand": {
        "name_bold": "HPB",
        "name_light": "MEDIA",
        "status": "Đang nhận dự án",
        "contact_name": "Hưng Phạm",
        "phone": "0913 337 280",
        "logo": True,
    },
    "content": {
        "badge_icon": "fa-bolt",
        "modal_title": "Nhận báo giá",
        "modal_badge": "Phản hồi 24h",
        "price_label": "Báo giá từ",
        "price_icon": "fa-tag",
        "cta_icon": "fa-phone",
        "hero_mark": True,
    },
    "theme": {
        "accent": "#8b5cf6",
        "accent2": "#e838ff",
        "accent3": "#3b82f6",
        "bg": "#05060f",
        "gradient_text": "linear-gradient(135deg, #60a5fa 0%, #a78bfa 45%, #f0a6ff 100%)",
    },
    "voiceover": {"enabled": True, "voice": "Linh", "rate": 190, "rate_max": 250},
    "music": {"enabled": True, "bpm": 120, "volume": 0.30},
    "sfx": {"enabled": True},
    "output": {"name": "quangcao", "fps": 30, "duration": 15, "width": 1080, "height": 1920},
}

# Mốc thời gian chuẩn cho video 15 giây; thời lượng khác thì co giãn theo tỉ lệ
BASE_LABELS = {
    "badge": 0.8, "headline": 1.5, "logo": 2.5, "modal": 3.0, "chips": 3.2,
    "tabs": 4.0, "fields": 5.0, "price": 10.0, "tagline": 12.0, "fadeout": 14.0,
}
BASE_DURATION = 15.0

DIGIT_WORDS = {
    '0': 'không', '1': 'một', '2': 'hai', '3': 'ba', '4': 'bốn',
    '5': 'năm', '6': 'sáu', '7': 'bảy', '8': 'tám', '9': 'chín',
}


def deep_merge(base, override):
    out = copy.deepcopy(base)
    for k, v in (override or {}).items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = deep_merge(out[k], v)
        else:
            out[k] = copy.deepcopy(v)
    return out


def spell_phone(phone):
    """0913 337 280 → 'không chín một ba, ba ba bảy, hai tám không'
    TTS đọc dãy số liền rất dễ sai nhịp, đọc từng chữ số thì luôn rõ."""
    groups = [g for g in phone.split() if g.strip()]
    if len(groups) == 1:
        digits = groups[0]
        groups = [digits[:4], digits[4:7], digits[7:]]
    return ', '.join(' '.join(DIGIT_WORDS.get(d, d) for d in g) for g in groups)


# ============================================================
# TÍNH LỊCH TRÌNH
# ============================================================
def build_schedule(cfg):
    duration = cfg['output']['duration']
    k = duration / BASE_DURATION
    labels = {name: round(t * k, 3) for name, t in BASE_LABELS.items()}

    fields = cfg['content'].get('fields', [])
    typed = [(i, f) for i, f in enumerate(fields) if not f.get('static')]

    # Cả khối gõ chữ nằm gọn giữa lúc form hiện xong và lúc chạy giá
    win_start = labels['fields'] + 1.0 * k
    win_end = labels['price']
    slot = (win_end - win_start) / max(len(typed), 1)

    typing = []
    for n, (idx, f) in enumerate(typed):
        text = str(f.get('value', ''))
        highlight = win_start + n * slot
        budget = slot * 0.78
        ms = 80 if not text else max(35, min(110, budget * 1000 / len(text)))
        typing.append({
            "input": f"input-{idx}",
            "text": text,
            "highlight_at": round(highlight, 3),
            "type_start": round(highlight + 0.1, 3),
            "ms_per_char": round(ms, 1),
            "unhighlight_at": round(highlight + slot * 0.95, 3),
        })

    return {
        "labels": labels,
        "typing": typing,
        "price": {
            "start": round(labels['price'] + 0.2, 3),
            "duration": round(1.8 * k, 3),
            "target": cfg['content'].get('price_value', 0),
        },
    }


def default_voiceover(cfg):
    """Sinh lời đọc mặc định nếu người dùng không đưa. Chỉ là lưới an toàn —
    lời đọc viết tay theo ngành khách hàng bao giờ cũng thuyết phục hơn."""
    c, b = cfg['content'], cfg['brand']
    price = c.get('price_value', 0)
    trieu = price // 1_000_000
    chips = c.get('chips', [])
    dv = ', '.join(ch['text'] for ch in chips[:2]) if chips else c.get('badge', '')

    lines = [
        {"at": 0.9, "budget": 2.8, "text": f"{c.get('headline1','')} {c.get('headline2','')}."},
        {"at": 3.9, "budget": 1.9, "text": c.get('subtagline', '')},
        {"at": 6.1, "budget": 2.9, "text": f"{b['name_bold']}{b['name_light']}: {dv}."},
    ]
    if trieu:
        lines.append({"at": 9.3, "budget": 1.4,
                      "text": f"{c.get('price_label','Báo giá từ')} {trieu} triệu."})
    lines.append({"at": 10.9, "budget": 4.0,
                  "text": f"Gọi ngay {b['contact_name']}: {spell_phone(b['phone'])}."})
    return lines


# ============================================================
# DỰNG DỰ ÁN
# ============================================================
def scaffold(cfg, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    for item in ('index.html', 'style.css', 'script.js'):
        shutil.copy2(os.path.join(TEMPLATE, item), out_dir)
    for d in ('vendor', 'assets'):
        dst = os.path.join(out_dir, d)
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(os.path.join(TEMPLATE, d), dst)
    os.makedirs(os.path.join(out_dir, 'output'), exist_ok=True)

    with open(os.path.join(out_dir, 'config.json'), 'w', encoding='utf-8') as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def wait_for_server(port, timeout=15):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=0.5):
                return True
        except OSError:
            time.sleep(0.2)
    return False


def check_tools(need_audio):
    missing = []
    if shutil.which('ffmpeg') is None:
        missing.append('ffmpeg  → brew install ffmpeg')
    if shutil.which('node') is None:
        missing.append('node    → brew install node')
    if need_audio and shutil.which('say') is None:
        missing.append('say     → chỉ có trên macOS; chạy với --no-audio')
    if need_audio:
        try:
            import numpy  # noqa: F401
        except ImportError:
            missing.append('numpy   → pip3 install numpy')
    if missing:
        raise SystemExit('❌ Thiếu công cụ:\n   ' + '\n   '.join(missing))

    # puppeteer-core không đi kèm khi đóng gói skill (nặng ~35MB) — cài lần đầu
    if not os.path.exists(os.path.join(HERE, 'node_modules', 'puppeteer-core')):
        print('📦 Lần chạy đầu — cài puppeteer-core...')
        r = subprocess.run(['npm', 'install', '--silent'], cwd=HERE)
        if r.returncode != 0:
            raise SystemExit(f'❌ Cài thất bại. Chạy tay: cd "{HERE}" && npm install')


# ============================================================
# MAIN
# ============================================================
def main():
    ap = argparse.ArgumentParser(description='Dựng video quảng cáo dọc 1080×1920')
    ap.add_argument('--config', required=True, help='file JSON nội dung video')
    ap.add_argument('--out', required=True, help='thư mục dự án sẽ tạo ra')
    ap.add_argument('--preview', help='chỉ chụp các mốc giây này, vd: 3.5,9,13')
    ap.add_argument('--no-audio', action='store_true', help='chỉ render hình')
    args = ap.parse_args()

    user_cfg = json.load(open(args.config, encoding='utf-8'))
    cfg = deep_merge(DEFAULTS, user_cfg)

    need_audio = not args.no_audio and not args.preview and cfg['voiceover'].get('enabled', True)
    check_tools(need_audio)

    if not cfg['voiceover'].get('lines'):
        cfg['voiceover']['lines'] = default_voiceover(cfg)
        print('ℹ️  Chưa có lời đọc trong config → dùng bản sinh tự động.')

    cfg['_schedule'] = build_schedule(cfg)

    out_dir = os.path.abspath(os.path.expanduser(args.out))
    scaffold(cfg, out_dir)
    print(f'📂 Dự án: {out_dir}')

    port = free_port()
    server = subprocess.Popen(
        [sys.executable, '-m', 'http.server', str(port), '--directory', out_dir],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    try:
        if not wait_for_server(port):
            raise SystemExit('❌ Không mở được web server tạm.')

        cmd = ['node', os.path.join(HERE, 'record.js'),
               '--project', out_dir,
               '--url', f'http://127.0.0.1:{port}/index.html?render=1']
        if args.preview:
            cmd += ['--preview', args.preview]
        subprocess.run(cmd, check=True)
    finally:
        server.terminate()
        server.wait(timeout=5)

    if args.preview:
        print(f'\n✅ Ảnh xem thử: {os.path.join(out_dir, "output", "preview")}')
        return

    name = cfg['output']['name']
    final = os.path.join(out_dir, 'output', f'{name}.mp4')

    if need_audio:
        subprocess.run([sys.executable, os.path.join(HERE, 'build_audio.py'),
                        '--project', out_dir], check=True)
        final = os.path.join(out_dir, 'output', f'{name}-final.mp4')

    print('\n═══════════════════════════════════════')
    print('🎉  VIDEO HOÀN THÀNH')
    print('═══════════════════════════════════════')
    print(f'📁  {final}')
    print(f'📦  {os.path.getsize(final) / 1024 / 1024:.2f} MB')
    print(f'🎞️   {cfg["output"]["width"]}×{cfg["output"]["height"]} · '
          f'{cfg["output"]["fps"]}fps · {cfg["output"]["duration"]}s')
    print('═══════════════════════════════════════')


if __name__ == '__main__':
    main()
