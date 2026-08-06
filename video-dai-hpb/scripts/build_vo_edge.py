#!/usr/bin/env python3
"""
build_vo_edge.py — Giọng đọc neural, MIỄN PHÍ, không cần tài khoản

Dùng giọng neural tiếng Việt của Microsoft qua edge-tts:
  vi-VN-HoaiMyNeural   — nữ, thân thiện
  vi-VN-NamMinhNeural  — nam, thân thiện

Khác `say` của macOS:
  - Giọng neural, có ngữ điệu lên xuống thật, không đều đều như giọng máy.
  - Đọc thẳng "Cursor", "ChatGPT", "Vibe Coding" — không cần bản phiên âm
    chữa cháy ("Cơ-xơ", "Chát-Gi-Pi-Ti").

DÙNG:
  pip3 install --user edge-tts
  python3 build_vo_edge.py                       # giọng nữ, tốc độ chuẩn
  python3 build_vo_edge.py --voice vi-VN-NamMinhNeural
  python3 build_vo_edge.py --rate -6 --pitch -2  # chậm hơn, trầm hơn

KẾT QUẢ:
  audio/vo-edge/NN.mp3     — từng câu (có cache, chạy lại không tốn thời gian)
  audio/voiceover-pro.wav  — track 180s đã canh đúng mốc thời gian

RỒI:
  python3 build_audio.py --vo-wav audio/voiceover-pro.wav
"""

import argparse, asyncio, hashlib, os, sys
import numpy as np

try:
    import edge_tts
except ImportError:
    sys.exit('❌ Chưa cài edge-tts. Chạy:  pip3 install --user edge-tts')

from build_audio import load_lines, place, write_wav, decode_mono  # dùng chung 1 nguồn sự thật

SR = 44100
DUR = 180.0            # ghi đè bằng --duration
N = 0                  # tính trong main()
HERE = os.path.dirname(os.path.abspath(__file__))
RATE_MAX = 10          # quá 10% là tai bắt đầu nghe ra "đọc gấp"


async def synth(text, voice, rate, pitch, path):
    c = edge_tts.Communicate(text, voice,
                             rate=f'{rate:+d}%', pitch=f'{pitch:+d}Hz')
    await c.save(path)


def gen(text, voice, rate, pitch, cache, idx, force):
    h = hashlib.sha1(f'{text}|{voice}|{rate}|{pitch}'.encode()).hexdigest()[:10]
    mp3 = os.path.join(cache, f'{idx:02d}-{h}.mp3')
    if force or not os.path.exists(mp3):
        asyncio.run(synth(text, voice, rate, pitch, mp3))
    return decode_mono(mp3)


def trim(sig):
    """Cắt lặng đầu/cuối, chuẩn hoá đỉnh."""
    peak = float(np.max(np.abs(sig))) if len(sig) else 0.0
    if peak <= 0:
        return sig
    loud = np.abs(sig) > 0.02 * peak
    i0 = int(np.argmax(loud))
    i1 = len(sig) - int(np.argmax(loud[::-1]))
    sig = sig[max(0, i0 - int(0.02 * SR)):min(len(sig), i1 + int(0.05 * SR))]
    return sig * (0.85 / max(float(np.max(np.abs(sig))), 1e-9))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='vi-VN-HoaiMyNeural')
    ap.add_argument('--rate', type=int, default=0, help='%% nhanh/chậm cơ bản')
    ap.add_argument('--pitch', type=int, default=0, help='Hz cao/thấp')
    ap.add_argument('--project', default=HERE)
    ap.add_argument('--duration', type=float, default=180.0)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--no-fit', action='store_true',
                    help='không đẩy nhanh để vừa khung — chỉ đo tốc độ tự nhiên')
    a = ap.parse_args()

    global DUR, N
    DUR = a.duration
    N = int(SR * DUR)
    LINES = load_lines(a.project)

    cache = os.path.join(a.project, 'audio', 'vo-edge')
    os.makedirs(cache, exist_ok=True)
    print(f'🎙️  edge-tts · {a.voice} · rate {a.rate:+d}% · pitch {a.pitch:+d}Hz\n')

    track = np.zeros(N)
    over, sped, prev_end = [], 0, 0.0

    for i, (at, budget, text) in enumerate(LINES):
        rate = a.rate
        sig = trim(gen(text, a.voice, rate, a.pitch, cache, i + 1, a.force))

        # câu nào tràn khung thì đẩy nhanh, tối đa +18%
        if len(sig) / SR > budget and not a.no_fit:
            need = int(round((len(sig) / SR / budget - 1) * 100)) + 2
            rate = min(a.rate + max(need, 1), a.rate + RATE_MAX)
            if rate != a.rate:
                sig = trim(gen(text, a.voice, rate, a.pitch, cache, i + 1, a.force))
                sped += 1

        dur = len(sig) / SR
        flag = ''
        if rate > a.rate:
            flag += f'  ({rate:+d}%)'
        if dur > budget + 0.05:
            flag += f'  ⚠️ tràn {dur - budget:.2f}s'
            over.append((i + 1, at, budget, dur, text))
        if at < prev_end - 0.05:
            flag += f'  ⚠️ chồng {prev_end - at:.2f}s'
        prev_end = at + dur
        print(f'   [{at:>6.1f}s] {dur:4.2f}s/{budget:4.2f}s  {text[:40]}…{flag}')
        place(track, sig, at)

    out = os.path.join(a.project, 'audio', 'voiceover-pro.wav')
    write_wav(out, track)

    print(f'\n📁 {out}')
    print(f'   {sped}/{len(LINES)} câu phải đẩy nhanh để vừa khung')
    if over:
        print(f'\n⚠️  {len(over)} câu vẫn tràn — nên rút chữ trong LINES của build_audio.py:')
        for n, at, b, d, t in over:
            cut = max(1, int(round((d - b) / d * len(t.split()))))
            print(f'   câu {n:02d} ({at}s): cần ≤{b:.1f}s, đang {d:.2f}s → bỏ ~{cut} từ')
            print(f'      "{t}"')
    else:
        print('   ✓ Không câu nào tràn khung')
    print('\nBước tiếp:  python3 build_audio.py --vo-wav audio/voiceover-pro.wav')


if __name__ == '__main__':
    main()
