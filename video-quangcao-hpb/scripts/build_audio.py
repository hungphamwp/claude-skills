#!/usr/bin/env python3
"""
============================================================
build_audio.py — Giọng đọc + nhạc nền + SFX cho video dọc
============================================================

Dùng:  python3 build_audio.py --project <thư-mục-dự-án>

Đọc config.json trong thư mục dự án rồi tạo:
  audio/voiceover.wav   — giọng đọc (macOS `say`)
  audio/music.wav       — nhạc nền tự tổng hợp bằng numpy
  audio/soundtrack.wav  — bản trộn (VO + nhạc có ducking + SFX)
  output/<name>-final.mp4 — video đã ghép tiếng

SFX bám đúng config._schedule nên tiếng gõ phím rơi trúng từng
ký tự đang hiện trên màn hình — thứ khiến video trông "thật"
chứ không như slideshow có nhạc.

Yêu cầu: macOS (lệnh `say`), ffmpeg, numpy.
============================================================
"""

import argparse
import json
import os
import subprocess
import wave

import numpy as np

SR = 44100


# ============================================================
# HELPERS
# ============================================================
def run(cmd, **kw):
    return subprocess.run(cmd, check=True, capture_output=True, **kw)


def decode_mono(path):
    """Giải mã audio bất kỳ → numpy float64 mono 44.1kHz."""
    out = run(['ffmpeg', '-v', 'error', '-i', path,
               '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-']).stdout
    return np.frombuffer(out, dtype=np.float32).astype(np.float64)


def place(track, sig, start_sec, gain=1.0):
    i = int(start_sec * SR)
    if i >= len(track) or i < 0:
        return
    end = min(len(track), i + len(sig))
    track[i:end] += sig[:end - i] * gain


def adsr(n, attack, decay, sustain, release):
    env = np.zeros(n)
    a, d, r = max(int(attack * SR), 1), max(int(decay * SR), 1), max(int(release * SR), 1)
    s = max(n - a - d - r, 0)
    env[:a] = np.linspace(0, 1, a)
    env[a:a + d] = np.linspace(1, sustain, d)
    env[a + d:a + d + s] = sustain
    tail = n - a - d - s
    if tail > 0:
        env[a + d + s:] = np.linspace(sustain, 0, tail)
    return env


def lowpass(x, cutoff):
    """Lọc thông thấp 1 cực, vector hoá bằng lfilter thủ công."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def write_wav(path, mono):
    data = np.stack([mono, mono], axis=1)
    pcm = (np.clip(data, -1, 1) * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ============================================================
# 1. GIỌNG ĐỌC
# ============================================================
def _edge_line(text, voice, rate, path):
    """Sinh 1 câu bằng giọng neural của Microsoft (edge-tts) — miễn phí, không cần key."""
    import asyncio, edge_tts
    asyncio.run(edge_tts.Communicate(text, voice, rate=f'{rate:+d}%').save(path))


def build_voiceover_edge(cfg, n, audio_dir):
    """Giọng neural tiếng Việt. Tự nhiên hơn `say` rất nhiều — nên dùng mặc định.

    Không cần bảng phiên âm: giọng neural đọc thẳng "SEO", "Website",
    "Google Ads" bằng phát âm tiếng Anh, đúng như người Việt nói ngoài đời.
    """
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        raise SystemExit('❌ Thiếu edge-tts. Chạy:  pip3 install --user edge-tts')

    vo = cfg.get('voiceover', {})
    lines = vo.get('lines', [])
    voice = vo.get('edge_voice', 'vi-VN-HoaiMyNeural')
    base = int(vo.get('edge_rate', 0))
    duration = cfg['output']['duration']
    track = np.zeros(n)
    tmp = os.path.join(audio_dir, '_tmp.mp3')

    print(f'🎙️  Tạo giọng đọc neural (edge-tts "{voice}")...')
    prev_end = 0.0
    for ln in lines:
        start, budget, text = ln['at'], ln['budget'], ln['text']
        rate = base
        _edge_line(text, voice, rate, tmp)
        sig = decode_mono(tmp)
        # câu tràn khung thì đẩy nhanh, tối đa +10% (quá ngưỡng này tai nghe ra "đọc gấp")
        if len(sig) / SR > budget:
            rate = base + min(int((len(sig) / SR / budget - 1) * 100) + 2, 10)
            _edge_line(text, voice, rate, tmp)
            sig = decode_mono(tmp)

        peak = float(np.max(np.abs(sig))) if len(sig) else 0.0
        if peak > 0:
            loud = np.abs(sig) > 0.02 * peak
            i0 = int(np.argmax(loud))
            i1 = len(sig) - int(np.argmax(loud[::-1]))
            sig = sig[max(0, i0 - int(0.02 * SR)):min(len(sig), i1 + int(0.05 * SR))]
            sig = sig * (0.85 / max(float(np.max(np.abs(sig))), 1e-9))

        dur = len(sig) / SR
        warn = ''
        if dur > budget + 0.05:
            warn += f'  ⚠️ tràn {dur - budget:.2f}s — rút chữ'
        if start < prev_end - 0.05:
            warn += f'  ⚠️ chồng {prev_end - start:.2f}s lên câu trước'
        if start + dur > duration:
            warn += '  ⚠️ tràn quá thời lượng video'
        prev_end = start + dur
        print(f'   [{start:>5.1f}s] {dur:4.2f}s @{rate:+d}% — {text[:44]}…{warn}')
        place(track, sig, start)

    if os.path.exists(tmp):
        os.remove(tmp)
    return track


def build_voiceover(cfg, n, audio_dir):
    vo = cfg.get('voiceover', {})
    lines = vo.get('lines', [])
    track = np.zeros(n)
    if not vo.get('enabled', True) or not lines:
        print('🎙️  Bỏ qua giọng đọc (voiceover.enabled = false)')
        return track

    # mặc định dùng giọng neural; đặt "engine": "say" để quay lại giọng macOS
    if vo.get('engine', 'edge') == 'edge':
        return build_voiceover_edge(cfg, n, audio_dir)

    voice = vo.get('voice', 'Linh')
    rate0 = vo.get('rate', 190)
    rate_max = vo.get('rate_max', 250)
    tmp = os.path.join(audio_dir, '_tmp.aiff')
    duration = cfg['output']['duration']

    print(f'🎙️  Tạo giọng đọc (macOS "{voice}")...')
    prev_end = 0.0

    for ln in lines:
        start, budget, text = ln['at'], ln['budget'], ln['text']
        rate = rate0
        run(['say', '-v', voice, '-r', str(rate), '-o', tmp, text])
        sig = decode_mono(tmp)

        # Câu dài quá khung cho phép → đọc nhanh hơn, tối đa rate_max
        while len(sig) / SR > budget and rate < rate_max:
            rate = min(rate_max, int(rate * (len(sig) / SR / budget) * 1.03))
            run(['say', '-v', voice, '-r', str(rate), '-o', tmp, text])
            sig = decode_mono(tmp)

        dur = len(sig) / SR
        warn = ''
        if start < prev_end:
            warn += f'  ⚠️ chồng {prev_end - start:.2f}s lên câu trước'
        if start + dur > duration:
            warn += '  ⚠️ tràn quá thời lượng video'
        prev_end = start + dur
        print(f'   [{start:>5.1f}s] {dur:4.2f}s @ {rate}wpm — {text[:46]}…{warn}')

        # Cắt khoảng lặng đầu câu để vào đúng nhịp
        peak = float(np.max(np.abs(sig))) if len(sig) else 0.0
        if peak > 0:
            onset = int(np.argmax(np.abs(sig) > 0.02 * peak))
            sig = sig[max(0, onset - int(0.02 * SR)):]
            sig = sig * (0.85 / max(float(np.max(np.abs(sig))), 1e-9))

        place(track, sig, start)

    if os.path.exists(tmp):
        os.remove(tmp)
    return track


# ============================================================
# 2. NHẠC NỀN — tech / corporate minimal
# ============================================================
CHORDS = [
    [220.00, 261.63, 329.63, 392.00],   # Am7
    [174.61, 220.00, 261.63, 329.63],   # Fmaj7
    [261.63, 329.63, 392.00, 493.88],   # Cmaj7
    [196.00, 246.94, 293.66, 392.00],   # G
]
ROOTS = [110.00, 87.31, 130.81, 98.00]
ARP_PATTERN = [0, 2, 1, 3, 2, 1, 3, 2]


def build_music(cfg, n, t_axis):
    m = cfg.get('music', {})
    if not m.get('enabled', True):
        print('🎵  Bỏ qua nhạc nền (music.enabled = false)')
        return np.zeros(n)

    bpm = m.get('bpm', 120)
    beat = 60.0 / bpm
    bar = beat * 4
    duration = cfg['output']['duration']
    print(f'🎵  Tổng hợp nhạc nền {bpm} BPM...')

    pad = np.zeros(n)
    bass = np.zeros(n)
    pluck = np.zeros(n)
    drums = np.zeros(n)

    for b in range(int(np.ceil(duration / bar))):
        t0 = b * bar
        chord = CHORDS[b % len(CHORDS)]
        root = ROOTS[b % len(ROOTS)]
        n_bar = int(bar * SR)
        tb = np.arange(n_bar) / SR

        voice_sig = np.zeros(n_bar)
        for f in chord:
            voice_sig += np.sin(2 * np.pi * f * tb)
            voice_sig += 0.6 * np.sin(2 * np.pi * f * 1.005 * tb)
            voice_sig += 0.3 * np.sin(2 * np.pi * f * 2 * tb)
        voice_sig /= (len(chord) * 1.9)
        place(pad, voice_sig * adsr(n_bar, 0.45, 0.3, 0.75, 0.5), t0, 0.45)

        sub = np.sin(2 * np.pi * root * tb) + 0.35 * np.sin(2 * np.pi * root * 2 * tb)
        place(bass, sub * adsr(n_bar, 0.05, 0.2, 0.8, 0.35), t0, 0.30)

        for i in range(8):
            ts = t0 + i * beat / 2
            if ts >= duration or ts < 1.0:
                continue
            f = chord[ARP_PATTERN[i]] * 2
            nl = int(0.30 * SR)
            tl = np.arange(nl) / SR
            p = np.sin(2 * np.pi * f * tl) + 0.25 * np.sin(2 * np.pi * f * 3 * tl)
            place(pluck, p * np.exp(-tl * 13), ts, 0.16 if i % 2 == 0 else 0.09)

    for k in range(int(duration / beat)):
        ts = k * beat
        if ts < 2.0 or ts > duration - 0.6:
            continue
        nl = int(0.18 * SR)
        tl = np.arange(nl) / SR
        f = 58 * np.exp(-tl * 26) + 38
        place(drums, np.sin(2 * np.pi * f * tl) * np.exp(-tl * 16), ts, 0.55)

        if ts >= 4.0:
            nh = int(0.05 * SR)
            hh = np.random.default_rng(k).standard_normal(nh)
            hh = np.diff(hh, prepend=0)
            place(drums, hh * np.exp(-np.arange(nh) / SR * 90), ts + beat / 2, 0.05)

    music = lowpass(pad, 2600) + bass + pluck + drums
    fade_in = np.clip(t_axis / 1.6, 0, 1)
    fade_out = np.clip((duration - t_axis) / 1.0, 0, 1)
    return music * fade_in * fade_out


# ============================================================
# 3. SFX — bám đúng mốc animation trong _schedule
# ============================================================
def build_sfx(cfg, n):
    s = cfg.get('sfx', {})
    if not s.get('enabled', True):
        print('✨  Bỏ qua hiệu ứng (sfx.enabled = false)')
        return np.zeros(n)

    print('✨  Tạo hiệu ứng chuyển cảnh...')
    sch = cfg['_schedule']
    L = sch['labels']
    sfx = np.zeros(n)
    rng = np.random.default_rng(7)

    # Whoosh khi modal trượt lên
    nl = int(0.7 * SR)
    tl = np.arange(nl) / SR
    wh = rng.standard_normal(nl) * np.sin(np.pi * tl / tl[-1]) ** 2
    place(sfx, lowpass(wh, 900) * 3.0, L['modal'] - 0.15, 0.22)

    # Tiếng gõ phím — mỗi ký tự một tiếng, đúng nhịp gõ trên màn hình
    for t in sch['typing']:
        step = t['ms_per_char'] / 1000.0
        for i in range(len(t['text'])):
            nl = int(0.035 * SR)
            tl = np.arange(nl) / SR
            click = rng.standard_normal(nl) * np.exp(-tl * 260)
            click += 0.4 * np.sin(2 * np.pi * 2600 * tl) * np.exp(-tl * 200)
            place(sfx, click, t['type_start'] + i * step, 0.045)

    # Chuông nhẹ khi bộ đếm giá chạy
    nl = int(1.2 * SR)
    tl = np.arange(nl) / SR
    bell = (np.sin(2 * np.pi * 1318 * tl) + 0.5 * np.sin(2 * np.pi * 1976 * tl)
            + 0.25 * np.sin(2 * np.pi * 2637 * tl)) * np.exp(-tl * 4.5)
    place(sfx, bell, sch['price']['start'], 0.10)

    # Impact khi nút CTA bật ra
    nl = int(1.5 * SR)
    tl = np.arange(nl) / SR
    boom = np.sin(2 * np.pi * (70 * np.exp(-tl * 5) + 45) * tl) * np.exp(-tl * 3.2)
    boom += lowpass(rng.standard_normal(nl) * np.exp(-tl * 9), 1800) * 0.6
    place(sfx, boom, L['price'] + 1.0, 0.30)

    return sfx


# ============================================================
# 4. MAIN
# ============================================================
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--project', default=os.getcwd())
    args = ap.parse_args()

    project = os.path.abspath(args.project)
    cfg = json.load(open(os.path.join(project, 'config.json'), encoding='utf-8'))

    audio_dir = os.path.join(project, 'audio')
    out_dir = os.path.join(project, 'output')
    os.makedirs(audio_dir, exist_ok=True)

    name = cfg['output']['name']
    video_in = os.path.join(out_dir, f'{name}.mp4')
    video_out = os.path.join(out_dir, f'{name}-final.mp4')
    if not os.path.exists(video_in):
        raise SystemExit(f'❌ Chưa có {video_in} — render video trước.')

    duration = cfg['output']['duration']
    n = int(SR * duration)
    t_axis = np.arange(n) / SR

    vo = build_voiceover(cfg, n, audio_dir)
    music = build_music(cfg, n, t_axis)
    sfx = build_sfx(cfg, n)

    # Ducking: hạ nhạc khi có giọng đọc để lời nói luôn nổi lên trên
    env = np.abs(vo)
    win = int(0.12 * SR)
    env = np.convolve(env, np.ones(win) / win, mode='same')
    env = np.clip(env / (np.max(env) + 1e-9), 0, 1)
    duck = 1.0 - 0.55 * np.clip(env * 6, 0, 1)

    music_vol = cfg.get('music', {}).get('volume', 0.30)
    mix = vo * 1.0 + music * music_vol * duck + sfx * 0.55
    peak = float(np.max(np.abs(mix)))
    if peak > 0:
        mix = mix / peak * 0.92
    mix = 0.94 * np.tanh(mix / 0.94)          # limiter mềm, tránh vỡ tiếng

    write_wav(os.path.join(audio_dir, 'voiceover.wav'), vo)
    write_wav(os.path.join(audio_dir, 'music.wav'), music * music_vol)
    write_wav(os.path.join(audio_dir, 'soundtrack.wav'), mix)
    print('🎚️   Đã trộn → audio/soundtrack.wav')

    print('🎬  Ghép tiếng vào video...')
    run(['ffmpeg', '-y', '-v', 'error',
         '-i', video_in,
         '-i', os.path.join(audio_dir, 'soundtrack.wav'),
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
         '-map', '0:v:0', '-map', '1:a:0', '-shortest',
         video_out])

    print(f'📁  {video_out} ({os.path.getsize(video_out) / 1024 / 1024:.2f} MB)')


if __name__ == '__main__':
    main()
