#!/usr/bin/env python3
"""
build_vo_gemini.py — Giọng đọc bằng Gemini TTS (Google AI Studio)

Khác edge-tts/ElevenLabs: Gemini TTS nhận chỉ dẫn phong cách bằng ngôn ngữ
tự nhiên ngay trong prompt ("đọc bằng giọng miền Nam, phong cách chuyên
gia kỹ thuật...") thay vì tham số rate/stability rời rạc.

DÙNG:
  export GEMINI_API_KEY='...'                 # bạn tự đặt, script chỉ đọc
  python3 build_vo_gemini.py --voice Charon
  python3 build_vo_gemini.py --voice Kore --style "..."

KẾT QUẢ:
  audio/vo-gemini/NN-<hash>.wav   — từng câu (có cache, chạy lại không tốn quota)
  audio/voiceover-pro.wav          — track đã canh đúng mốc thời gian

RỒI:
  python3 build_audio.py --vo-wav audio/voiceover-pro.wav
"""

import argparse, base64, hashlib, json, os, subprocess, sys, time, urllib.request, urllib.error, wave
import numpy as np

from build_audio import load_lines, place, write_wav, decode_mono  # dùng chung 1 nguồn sự thật

SR = 44100
DUR = 180.0
N = 0
HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = 'gemini-2.5-flash-preview-tts'
API = f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent'

DEFAULT_STYLE = (
    "Đọc bằng giọng miền Nam Việt Nam, phong cách chuyên nghiệp, tự tin, rõ ràng, "
    "như một chuyên gia kỹ thuật AI đang trình bày nội dung cho khán giả, tốc độ vừa phải, "
    "nhấn nhá đúng trọng tâm, không lên giọng quá đà:"
)

run = lambda c, **k: subprocess.run(c, check=True, capture_output=True, **k)


def key():
    k = (os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY') or '').strip()
    if not k:
        env = os.path.join(HERE, '.env')
        if os.path.exists(env):
            for line in open(env, encoding='utf-8'):
                line = line.strip()
                if line.startswith(('GEMINI_API_KEY=', 'GOOGLE_API_KEY=')):
                    k = line.split('=', 1)[1].strip().strip('"\'')
    if not k:
        sys.exit("❌ Chưa có Gemini API key. Đặt bằng:\n"
                 "   export GEMINI_API_KEY='khoá-của-bạn'\n"
                 "   (lấy tại aistudio.google.com/apikey)")
    return k


def synth(text, voice, out_wav):
    # Dùng curl thay vì urllib.request — trong một số môi trường (sandbox/proxy
    # đặc thù) urllib treo vô thời hạn khi gọi endpoint TTS này dù curl chạy
    # bình thường trong vài giây. curl còn có --max-time để không bao giờ treo.
    body = {
        "contents": [{"parts": [{"text": text}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}},
        },
    }
    body_path = out_wav + '.req.json'
    with open(body_path, 'w', encoding='utf-8') as f:
        json.dump(body, f)

    data = None
    for attempt in range(6):
        resp_path = out_wav + '.resp.json'
        r = subprocess.run([
            'curl', '-s', '--max-time', '90', '-w', '\n%{http_code}',
            '-X', 'POST', API,
            '-H', 'Content-Type: application/json',
            '-H', f'x-goog-api-key: {key()}',
            '-d', f'@{body_path}',
            '-o', resp_path,
        ], capture_output=True, text=True)
        status = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else ''
        raw = open(resp_path, encoding='utf-8').read() if os.path.exists(resp_path) else ''
        if status != '200':
            if status == '429' and attempt < 5:
                wait = 20 * (attempt + 1)
                print(f'   ⏳ Rate limit (429) — chờ {wait}s rồi thử lại ({attempt+1}/5)…')
                time.sleep(wait)
                continue
            sys.exit(f'❌ Gemini trả lỗi {status or "(không kết nối được)"}: {raw[:400]}')
        data = json.loads(raw)
        cand = (data.get('candidates') or [{}])[0]
        if 'content' not in cand:
            # finishReason khác STOP (OTHER/SAFETY/...) mà không có audio — thử lại
            if attempt < 5:
                print(f'   ⏳ Gemini không trả audio (finishReason={cand.get("finishReason")}) — thử lại ({attempt+1}/5)…')
                time.sleep(5)
                continue
            sys.exit(f'❌ Gemini không trả audio sau nhiều lần thử: {raw[:400]}')
        break
    os.remove(body_path)
    if os.path.exists(out_wav + '.resp.json'):
        os.remove(out_wav + '.resp.json')
    if data is None:
        sys.exit('❌ Hết số lần thử lại.')

    part = data['candidates'][0]['content']['parts'][0]
    inline = part['inlineData']
    pcm = base64.b64decode(inline['data'])
    rate = 24000
    for tok in inline['mimeType'].split(';'):
        if tok.strip().startswith('rate='):
            rate = int(tok.strip().split('=')[1])
    with wave.open(out_wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        w.writeframes(pcm)


def gen(text, voice, style, cache, idx, force, sleep_s=0):
    h = hashlib.sha1(f'{text}|{voice}|{style}'.encode()).hexdigest()[:10]
    wav = os.path.join(cache, f'{idx:02d}-{h}.wav')
    if force or not os.path.exists(wav):
        prompt = f'{style} {text}' if style else text
        synth(prompt, voice, wav)
        if sleep_s:
            time.sleep(sleep_s)
    return decode_mono(wav)


def trim(sig):
    peak = float(np.max(np.abs(sig))) if len(sig) else 0.0
    if peak <= 0:
        return sig
    loud = np.abs(sig) > 0.02 * peak
    i0 = int(np.argmax(loud))
    i1 = len(sig) - int(np.argmax(loud[::-1]))
    sig = sig[max(0, i0 - int(0.02 * SR)):min(len(sig), i1 + int(0.05 * SR))]
    return sig * (0.85 / max(float(np.max(np.abs(sig))), 1e-9))


def atempo_chain(factor):
    """ffmpeg atempo chỉ nhận 0.5–2.0 mỗi bước — ghép chuỗi nếu cần hệ số khác."""
    if 0.5 <= factor <= 2.0:
        return f'atempo={factor}'
    steps = []
    f = factor
    while f > 2.0:
        steps.append('atempo=2.0'); f /= 2.0
    while f < 0.5:
        steps.append('atempo=0.5'); f /= 0.5
    steps.append(f'atempo={f}')
    return ','.join(steps)


def word_timings(text, at, dur):
    """Chia đều `dur` cho từng từ trong `text`, theo tỉ lệ độ dài chữ (từ dài
    đọc lâu hơn từ ngắn) — không có timestamp thật từ Gemini TTS nên đây là
    ước lượng, đủ dùng để phụ đề "chạy chữ" khớp nhịp bằng mắt thường."""
    words = text.split()
    if not words:
        return []
    weights = [max(len(w), 2) for w in words]
    total_w = sum(weights)
    out, t = [], at
    for w, wt in zip(words, weights):
        d = dur * wt / total_w
        out.append({'w': w, 'at': round(t, 3), 'd': round(d, 3)})
        t += d
    return out


def speed_up(sig, factor):
    """Time-stretch giữ nguyên cao độ bằng ffmpeg atempo — dùng khi câu tràn khung
    (Gemini TTS không có tham số tốc độ trực tiếp như edge-tts/ElevenLabs)."""
    tmp_in = '/tmp/_gvo_in.wav'
    tmp_out = '/tmp/_gvo_out.wav'
    write_wav(tmp_in, sig)
    run(['ffmpeg', '-y', '-v', 'error', '-i', tmp_in,
         '-filter:a', atempo_chain(factor), tmp_out])
    return decode_mono(tmp_out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--voice', default='Charon', help='Kore/Puck/Charon/Zephyr/Leda/Orus/Aoede...')
    ap.add_argument('--style', default=DEFAULT_STYLE)
    ap.add_argument('--no-style', action='store_true', help='không thêm chỉ dẫn phong cách')
    ap.add_argument('--project', default=HERE)
    ap.add_argument('--duration', type=float, default=180.0)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--max-speedup', type=float, default=1.25)
    ap.add_argument('--sleep', type=float, default=8.0, help='giây nghỉ giữa các lần gọi API (free tier dễ 429)')
    a = ap.parse_args()

    global DUR, N
    DUR = a.duration
    N = int(SR * DUR)
    LINES = load_lines(a.project)
    style = '' if a.no_style else a.style

    cache = os.path.join(a.project, 'audio', 'vo-gemini')
    os.makedirs(cache, exist_ok=True)
    print(f'🎙️  Gemini TTS · {MODEL} · voice {a.voice}\n')

    track = np.zeros(N)
    over, sped, prev_end = [], 0, 0.0
    captions = []

    for i, (at, budget, text) in enumerate(LINES):
        sig = trim(gen(text, a.voice, style, cache, i + 1, a.force, a.sleep))
        dur = len(sig) / SR
        flag = ''

        if dur > budget and dur / budget <= a.max_speedup:
            sig = trim(speed_up(sig, dur / budget))
            dur = len(sig) / SR
            sped += 1
            flag += f'  (x{(len(sig)/SR/budget):.2f} chậm hơn gốc → đã tăng tốc)'
        elif dur > budget:
            sig = trim(speed_up(sig, a.max_speedup))
            dur = len(sig) / SR
            sped += 1
            flag += f'  (đã tăng tốc tối đa x{a.max_speedup})'

        if dur > budget + 0.05:
            flag += f'  ⚠️ tràn {dur - budget:.2f}s'
            over.append((i + 1, at, budget, dur, text))
        if at < prev_end - 0.05:
            flag += f'  ⚠️ chồng {prev_end - at:.2f}s'
        prev_end = at + dur
        print(f'   [{at:>6.1f}s] {dur:4.2f}s/{budget:4.2f}s  {text[:40]}…{flag}')
        place(track, sig, at)
        captions.extend(word_timings(text, at, dur))

    out = os.path.join(a.project, 'audio', 'voiceover-pro.wav')
    write_wav(out, track)

    caps_path = os.path.join(a.project, 'captions.js')
    with open(caps_path, 'w', encoding='utf-8') as f:
        f.write('/* Sinh tự động bởi build_vo_gemini.py — phụ đề chạy chữ theo giọng đọc. */\n')
        f.write('const CAPTIONS = ' + json.dumps(captions, ensure_ascii=False) + ';\n')
    print(f'📁 {caps_path}  ({len(captions)} từ)')

    print(f'\n📁 {out}')
    print(f'   {sped}/{len(LINES)} câu phải tăng tốc để vừa khung')
    if over:
        print(f'\n⚠️  {len(over)} câu vẫn tràn dù đã tăng tốc tối đa — nên rút chữ:')
        for n, at, b, d, t in over:
            cut = max(1, int(round((d - b) / d * len(t.split()))))
            print(f'   câu {n:02d} ({at}s): cần ≤{b:.1f}s, đang {d:.2f}s → bỏ ~{cut} từ')
            print(f'      "{t}"')
    else:
        print('   ✓ Không câu nào tràn khung')
    print('\nBước tiếp:  python3 build_audio.py --vo-wav audio/voiceover-pro.wav')


if __name__ == '__main__':
    main()
