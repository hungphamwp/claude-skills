#!/usr/bin/env python3
"""
build_audio.py — Giọng đọc + nhạc nền + SFX cho video 180 giây

Tạo:
  audio/voiceover.wav    — 48 câu đọc (macOS `say -v Linh`)
  audio/music.wav        — nhạc nền tổng hợp, có đường cường độ theo act
  audio/soundtrack.wav   — bản trộn (VO + nhạc ducking + SFX)
  output/<name>-final.mp4

Yêu cầu: macOS (`say`), ffmpeg, numpy.
"""

import argparse, json, os, re, subprocess, wave
import numpy as np

SR = 44100
DUR = 180.0            # ghi đè bằng --duration
N = 0
T = None
HERE = os.path.dirname(os.path.abspath(__file__))
DUR_DEFAULT = 180.0

run = lambda c, **k: subprocess.run(c, check=True, capture_output=True, **k)


# ============================================================
# HELPERS
# ============================================================
def decode_mono(path):
    out = run(['ffmpeg', '-v', 'error', '-i', path, '-ar', str(SR),
               '-ac', '1', '-f', 'f32le', '-']).stdout
    return np.frombuffer(out, dtype=np.float32).astype(np.float64)


def place(track, sig, start, gain=1.0):
    i = int(start * SR)
    if i >= len(track) or i < 0:
        return
    end = min(len(track), i + len(sig))
    track[i:end] += sig[:end - i] * gain


def adsr(n, a, d, s, r):
    env = np.zeros(n)
    ai, di, ri = max(int(a * SR), 1), max(int(d * SR), 1), max(int(r * SR), 1)
    si = max(n - ai - di - ri, 0)
    env[:ai] = np.linspace(0, 1, ai)
    env[ai:ai + di] = np.linspace(1, s, di)
    env[ai + di:ai + di + si] = s
    tail = n - ai - di - si
    if tail > 0:
        env[ai + di + si:] = np.linspace(s, 0, tail)
    return env


def lowpass(x, cutoff):
    """Một cực, làm trong miền tần số — nhanh hơn vòng lặp mẫu rất nhiều."""
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    return np.fft.irfft(X / (1.0 + 1j * f / cutoff), n)


def write_wav(path, mono):
    pcm = (np.clip(np.stack([mono, mono], 1), -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ============================================================
# 1. GIỌNG ĐỌC — 48 câu
#    (at, budget, text) · khớp bảng timing trong 02-VOICEOVER.md
# ============================================================
def load_lines(project):
    """Lời đọc nằm trong <dự-án>/voiceover.json — script không giữ nội dung."""
    f = os.path.join(project, 'voiceover.json')
    if not os.path.exists(f):
        raise SystemExit(f'❌ Thiếu {f}. Chép assets/voiceover-example.json ra rồi sửa.')
    d = json.load(open(f, encoding='utf-8'))
    return [(x['at'], x['budget'], x['text']) for x in d]


LINES = []          # nạp trong main() theo --project

# Giọng `Linh` đọc từ tiếng Anh bị dính chữ — viết lại theo âm tiếng Việt.
# Chỉ áp cho TTS, chữ trên màn hình giữ nguyên bản gốc.
TTS_MAP = {
    'GitHub Copilot': 'Ghít-hấp Cô-pai-lốt',
    'HTML, CSS, JavaScript': 'Ếch-Ti-Em-Eo, Xi-Ét-Ét, Gia-va',
    'Vibe Coding': 'Vai-bờ Cô-đing',
    'landing page': 'len-đing pết',
    'Landing page': 'Len-đing pết',
    'Claude Code': 'Cờ-lốt Cốt',
    'git commit': 'ghít com-mít',
    'Responsive': 'Ri-xpon-síp',
    'responsive': 'ri-xpon-síp',
    'animation': 'a-ni-mây-sần',
    'dark mode': 'đác mốt',
    'terminal': 'tơ-mi-nần',
    'Windsurf': 'Uyn-sớp',
    'ChatGPT': 'Chát-Gi-Pi-Ti',
    'VS Code': 'Vi-ét Cốt',
    'website': 'quép-sai',
    'Website': 'Quép-sai',
    'Cursor': 'Cơ-xơ',
    'deploy': 'đi-plôi',
    'prompt': 'promp',
    'mobile': 'mô-bai',
    'Menu': 'Mê-nu',
    'menu': 'mê-nu',
    'code': 'cốt',
    'file': 'phai',
    'Form': 'Phom',
    'link': 'lin',
    'web': 'quép',
    'SEO': 'Ét-Ê-Ô',
    'AI': 'Ây-Ai',
}


def to_tts(text):
    """Thay theo khoá dài trước để 'Claude Code' không bị 'code' nuốt mất."""
    for k in sorted(TTS_MAP, key=len, reverse=True):
        pat = re.escape(k)
        if k[0].isalnum():
            pat = r'(?<![0-9A-Za-zÀ-ỹ])' + pat
        if k[-1].isalnum():
            pat = pat + r'(?![0-9A-Za-zÀ-ỹ])'
        text = re.sub(pat, TTS_MAP[k].replace('\\', ''), text)
    return text


def build_voiceover(audio_dir, voice='Linh', rate0=185, rate_max=250):
    track = np.zeros(N)
    tmp = os.path.join(audio_dir, '_tmp.aiff')
    print(f'🎙️  Giọng đọc — macOS "{voice}" · {len(LINES)} câu')
    prev_end, warns = 0.0, 0

    for i, (at, budget, text) in enumerate(LINES, 1):
        say = to_tts(text)
        rate = rate0
        run(['say', '-v', voice, '-r', str(rate), '-o', tmp, say])
        sig = decode_mono(tmp)
        while len(sig) / SR > budget and rate < rate_max:
            rate = min(rate_max, int(rate * (len(sig) / SR / budget) * 1.03))
            run(['say', '-v', voice, '-r', str(rate), '-o', tmp, say])
            sig = decode_mono(tmp)

        # cắt khoảng lặng đầu câu để vào đúng nhịp hình
        peak = float(np.max(np.abs(sig))) if len(sig) else 0.0
        if peak > 0:
            onset = int(np.argmax(np.abs(sig) > 0.02 * peak))
            sig = sig[max(0, onset - int(0.02 * SR)):]
            sig = sig * (0.85 / max(float(np.max(np.abs(sig))), 1e-9))

        dur = len(sig) / SR
        flag = ''
        if at < prev_end - 0.02:
            flag = f'  ⚠️ chồng {prev_end - at:.2f}s'
            warns += 1
        prev_end = at + dur
        print(f'   [{at:>6.1f}s] {dur:4.2f}s @{rate:3d}wpm  {text[:44]}…{flag}')
        place(track, sig, at)

    if os.path.exists(tmp):
        os.remove(tmp)
    print(f'   → {warns} câu chồng nhau' if warns else '   → không câu nào chồng nhau ✓')
    return track


# ============================================================
# 2. NHẠC NỀN — future bass / tech, 124 BPM, Am
# ============================================================
CHORDS = [[220.00, 261.63, 329.63, 392.00],   # Am7
          [174.61, 220.00, 261.63, 329.63],   # Fmaj7
          [261.63, 329.63, 392.00, 493.88],   # Cmaj7
          [196.00, 246.94, 293.66, 392.00]]   # G
ROOTS = [110.00, 87.31, 130.81, 98.00]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]

# Đường cường độ theo act — khớp bảng ở 04-VISUAL-MOTION-AUDIO.md
INTENSITY = [(0, .60), (11, .60), (13, .70), (33, .70), (35, .85), (52, .85),
             (54, .75), (76, .75), (78, .90), (120, .90), (122, .70),
             (135, .70), (137, .65), (153.6, .65), (154.3, .20), (155.2, .20),
             (156, .75), (174, .75), (176, .62), (180, .55)]


def intensity_curve():
    xs = np.array([p[0] for p in INTENSITY])
    ys = np.array([p[1] for p in INTENSITY])
    return np.interp(T, xs, ys)


def build_music(bpm=124):
    beat = 60.0 / bpm
    bar = beat * 4
    print(f'🎵  Nhạc nền {bpm} BPM · {int(np.ceil(DUR / bar))} ô nhịp')
    pad = np.zeros(N); bass = np.zeros(N); pluck = np.zeros(N); drums = np.zeros(N)
    rng = np.random.default_rng(11)

    for b in range(int(np.ceil(DUR / bar))):
        t0 = b * bar
        chord, root = CHORDS[b % 4], ROOTS[b % 4]
        nb = int(bar * SR)
        tb = np.arange(nb) / SR

        v = np.zeros(nb)
        for f in chord:
            v += np.sin(2 * np.pi * f * tb)
            v += 0.6 * np.sin(2 * np.pi * f * 1.005 * tb)
            v += 0.3 * np.sin(2 * np.pi * f * 2 * tb)
        place(pad, v / (len(chord) * 1.9) * adsr(nb, .45, .3, .75, .5), t0, 0.45)

        sub = np.sin(2 * np.pi * root * tb) + 0.35 * np.sin(2 * np.pi * root * 2 * tb)
        place(bass, sub * adsr(nb, .05, .2, .8, .35), t0, 0.30)

        for i in range(8):
            ts = t0 + i * beat / 2
            if ts >= DUR or ts < 1.0:
                continue
            f = chord[ARP[i]] * 2
            nl = int(.30 * SR); tl = np.arange(nl) / SR
            p = np.sin(2 * np.pi * f * tl) + 0.25 * np.sin(2 * np.pi * f * 3 * tl)
            place(pluck, p * np.exp(-tl * 13), ts, .16 if i % 2 == 0 else .09)

    for k in range(int(DUR / beat)):
        ts = k * beat
        if ts < 2.0 or ts > DUR - 0.6:
            continue
        nl = int(.18 * SR); tl = np.arange(nl) / SR
        f = 58 * np.exp(-tl * 26) + 38
        place(drums, np.sin(2 * np.pi * f * tl) * np.exp(-tl * 16), ts, .55)
        if ts >= 4.0:
            nh = int(.05 * SR)
            hh = np.diff(rng.standard_normal(nh), prepend=0)
            place(drums, hh * np.exp(-np.arange(nh) / SR * 90), ts + beat / 2, .05)

    music = lowpass(pad, 2600) + bass + pluck + drums
    fade = np.clip(T / 1.6, 0, 1) * np.clip((DUR - T) / 1.2, 0, 1)
    return music * fade * intensity_curve()


# ============================================================
# 3. SFX
# ============================================================
def sfx_whoosh(dur=.55, cut=900):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.random.default_rng(3).standard_normal(n) * np.sin(np.pi * t / t[-1]) ** 2
    return lowpass(x, cut) * 3.0


def sfx_click(seed=0):
    n = int(.035 * SR); t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    c = r.standard_normal(n) * np.exp(-t * 260)
    return c + 0.4 * np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 200)


def sfx_pop():
    n = int(.12 * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 22) + 420
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 26)


def sfx_chime():
    n = int(1.0 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1318 * t) + .5 * np.sin(2 * np.pi * 1976 * t)
            + .25 * np.sin(2 * np.pi * 2637 * t)) * np.exp(-t * 4.8)


def sfx_buzz():
    n = int(.30 * SR); t = np.arange(n) / SR
    return (np.sign(np.sin(2 * np.pi * 148 * t)) * .5) * np.exp(-t * 11)


def sfx_impact():
    n = int(1.4 * SR); t = np.arange(n) / SR
    r = np.random.default_rng(5)
    b = np.sin(2 * np.pi * (70 * np.exp(-t * 5) + 45) * t) * np.exp(-t * 3.2)
    return b + lowpass(r.standard_normal(n) * np.exp(-t * 9), 1800) * .6


def sfx_riser(dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 220 * np.exp(t / dur * 2.2)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / dur) ** 2


def sfx_glitch():
    n = int(.14 * SR)
    r = np.random.default_rng(9)
    x = r.standard_normal(n)
    x[::3] *= 2.4
    return x * np.exp(-np.arange(n) / SR * 26)


def sfx_shimmer():
    n = int(.9 * SR); t = np.arange(n) / SR
    r = np.random.default_rng(13)
    x = r.standard_normal(n) * np.exp(-t * 3.4)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X[f < 4000] *= 0.05
    return np.fft.irfft(X, n) * 2.2


def sfx_snap():
    n = int(.08 * SR); t = np.arange(n) / SR
    r = np.random.default_rng(17)
    return r.standard_normal(n) * np.exp(-t * 120) * 1.4


def load_scenes(project):
    """Mốc cảnh do record.js xuất ra khi render — luôn khớp với scenes.js.

    Trước đây hai bảng này viết cứng trong file; dự án mới nào cũng phải
    nhớ sửa tay, quên là tiếng gõ phím và chuyển cảnh rơi sai chỗ mà
    không có lỗi nào báo. Giờ đọc thẳng từ nguồn.
    """
    f = os.path.join(project, 'output', 'scenes.json')
    if not os.path.exists(f):
        print('⚠️  Chưa có output/scenes.json — chạy record.js trước để SFX '
              'bám đúng mốc cảnh. Tạm bỏ qua SFX chuyển cảnh.')
        return [], []
    d = json.load(open(f, encoding='utf-8'))
    return [x['t'] for x in d], [x.get('out', 'cut') for x in d]


SCENE_T, SCENE_OUT = [], []

# Điểm nhấn riêng: (giây, loại, âm lượng)
ACCENTS = [
    (0.05, 'whoosh', .30), (0.9, 'pop', .22),
    (7.15, 'impact', .30), (7.2, 'chime', .13),
    (22.9, 'buzz', .16), (24.4, 'buzz', .18),
    (26.6, 'riser', .16), (27.6, 'chime', .16),
    (41.8, 'buzz', .17), (43.2, 'chime', .18),
    (46.6, 'impact', .22),
    (72.3, 'chime', .16), (75.6, 'riser', .18),
    (76.1, 'impact', .26),
    (91.6, 'whoosh', .26),
    (96.5, 'chime', .22),                     # wow 1 — code hoá thành web
    (104.9, 'snap', .18), (105.6, 'chime', .20),   # wow 2 — dark mode
    (109.0, 'snap', .16), (110.1, 'snap', .16), (111.2, 'snap', .16),  # wow 3 — breakpoint
    (114.5, 'chime', .18), (115.0, 'pop', .18),
    (116.4, 'riser', .20), (118.0, 'chime', .26), (118.1, 'shimmer', .12),  # wow 4 — deploy
    (119.6, 'impact', .28),
    (122.2, 'pop', .20),
    (135.1, 'buzz', .18),
    (146.3, 'glitch', .18), (148.4, 'glitch', .16),
    (151.9, 'chime', .18),
    (154.9, 'impact', .24),                   # sau khoảng lặng — "Vẫn cần"
    (174.1, 'chime', .20), (174.3, 'shimmer', .10),
]

# Gõ phím: (giây bắt đầu, số ký tự, ký tự/giây, âm lượng)
TYPING = [
    (11.5, 30, 26, .045), (14.9, 34, 12, .030), (41.0, 15, 26, .040),
    (60.5, 22, 14, .038), (68.5, 24, 12, .034),
    (87.5, 66, 22, .050), (92.4, 40, 14, .034),
    (100.6, 34, 26, .042), (150.6, 20, 16, .038),
]


def build_sfx():
    print('✨  SFX — chuyển cảnh, gõ phím, điểm nhấn')
    s = np.zeros(N)
    gen = {'whoosh': sfx_whoosh, 'pop': sfx_pop, 'chime': sfx_chime,
           'buzz': sfx_buzz, 'impact': sfx_impact, 'riser': sfx_riser,
           'glitch': sfx_glitch, 'shimmer': sfx_shimmer, 'snap': sfx_snap}

    # chuyển cảnh
    for i, kind in enumerate(SCENE_OUT):
        t_end = SCENE_T[i + 1] if i + 1 < len(SCENE_T) else DUR
        if kind in ('whip', 'punch', 'glass', 'morph', 'coderain', 'blur'):
            place(s, sfx_whoosh(.45), t_end - .22, .22)
        elif kind == 'sweep':
            place(s, sfx_whoosh(.60, 2400), t_end - .28, .17)
        elif kind in ('glitch', 'flashglitch'):
            place(s, sfx_glitch(), t_end - .16, .16)
        elif kind == 'flash':
            place(s, sfx_impact(), t_end - .14, .20)
        elif kind == 'cut':
            place(s, sfx_snap(), t_end - .02, .07)

    # gõ phím
    for start, count, cps, gain in TYPING:
        for i in range(count):
            place(s, sfx_click(i), start + i / cps, gain)

    # điểm nhấn
    for t, kind, g in ACCENTS:
        place(s, gen[kind](), t, g)

    return s


# ============================================================
# 4. MAIN
# ============================================================
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--project', default=HERE)
    ap.add_argument('--duration', type=float, default=180.0)
    ap.add_argument('--name', default='video')
    ap.add_argument('--voice', default='Linh')
    ap.add_argument('--no-video', action='store_true')
    ap.add_argument('--vo-wav', help='dùng file giọng đọc có sẵn (ElevenLabs / thu người thật) '
                                     'thay cho macOS `say`')
    a = ap.parse_args()

    global LINES, DUR, N, T, SCENE_T, SCENE_OUT
    DUR = a.duration
    N = int(SR * DUR)
    T = np.arange(N) / SR
    LINES = load_lines(a.project)
    SCENE_T, SCENE_OUT = load_scenes(a.project)

    audio_dir = os.path.join(HERE, 'audio'); os.makedirs(audio_dir, exist_ok=True)
    out_dir = os.path.join(HERE, 'output')

    if a.vo_wav:
        path = a.vo_wav if os.path.isabs(a.vo_wav) else os.path.join(HERE, a.vo_wav)
        print(f'🎙️  Dùng giọng đọc có sẵn: {os.path.basename(path)}')
        vo = np.zeros(N)
        sig = decode_mono(path)
        vo[:min(N, len(sig))] = sig[:N]           # file đã canh sẵn theo lưới thời gian
    else:
        vo = build_voiceover(audio_dir, a.voice)
    music = build_music()
    sfx = build_sfx()

    # ducking: hạ nhạc 9dB khi có tiếng nói
    env = np.convolve(np.abs(vo), np.ones(int(.12 * SR)) / int(.12 * SR), mode='same')
    env = np.clip(env / (env.max() + 1e-9), 0, 1)
    duck = 1.0 - 0.64 * np.clip(env * 7, 0, 1)

    mix = vo * 1.0 + music * 0.30 * duck + sfx * 0.60
    peak = float(np.max(np.abs(mix)))
    if peak > 0:
        mix = mix / peak * 0.92
    mix = 0.94 * np.tanh(mix / 0.94)          # limiter mềm

    write_wav(os.path.join(audio_dir, 'voiceover.wav'), vo)
    write_wav(os.path.join(audio_dir, 'music.wav'), music * 0.30)
    write_wav(os.path.join(audio_dir, 'soundtrack.wav'), mix)
    rms = float(np.sqrt(np.mean(mix ** 2)))
    print(f'🎚️   Trộn xong · RMS {20 * np.log10(rms + 1e-9):.1f} dBFS → audio/soundtrack.wav')

    if a.no_video:
        return
    vin = os.path.join(out_dir, f'{a.name}.mp4')
    if not os.path.exists(vin):
        print(f'⚠️  Chưa có {vin} — render video trước rồi chạy lại để ghép tiếng.')
        return
    vout = os.path.join(out_dir, f'{a.name}-final.mp4')
    print('🎬  Ghép tiếng vào video...')
    run(['ffmpeg', '-y', '-v', 'error', '-i', vin,
         '-i', os.path.join(audio_dir, 'soundtrack.wav'),
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
         '-map', '0:v:0', '-map', '1:a:0', '-shortest', vout])
    print(f'📁  {vout} ({os.path.getsize(vout) / 1048576:.2f} MB)')


if __name__ == '__main__':
    main()
