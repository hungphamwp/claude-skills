#!/usr/bin/env python3
"""
build_vo_eleven.py — Sinh giọng đọc bằng ElevenLabs, canh đúng lưới thời gian

KHÁC VỚI `say` CỦA macOS:
  - Đọc thẳng "Cursor", "ChatGPT", "Vibe Coding" bằng phát âm tiếng Anh,
    không dùng bản phiên âm chữa cháy ("Cơ-xơ", "Chát-Gi-Pi-Ti").
  - Nối ngữ điệu giữa các câu bằng previous_text / next_text, nên nghe
    liền mạch như một người đang kể chứ không phải 48 câu rời ghép lại.

DÙNG:
  export ELEVENLABS_API_KEY='...'            # bạn tự đặt, script chỉ đọc
  python3 build_vo_eleven.py --list-voices   # xem giọng trong tài khoản
  python3 build_vo_eleven.py --voice-name "Sarah"
  python3 build_vo_eleven.py --voice-id abc123 --stability 0.35

KẾT QUẢ:
  audio/vo-eleven/NN.mp3   — từng câu (có cache, chạy lại không tốn quota)
  audio/voiceover-pro.wav  — track 180s đã canh đúng mốc

RỒI:
  python3 build_audio.py --vo-wav audio/voiceover-pro.wav
"""

import argparse, hashlib, json, os, subprocess, sys, urllib.request, urllib.error, wave
import numpy as np

SR = 44100
DUR = 180.0            # ghi đè bằng --duration
N = 0                  # tính trong main()
HERE = os.path.dirname(os.path.abspath(__file__))
API = 'https://api.elevenlabs.io/v1'

from build_audio import load_lines, place, write_wav, decode_mono  # dùng chung 1 nguồn sự thật


def key():
    # ưu tiên biến môi trường; không có thì đọc file .env cạnh script
    k = (os.environ.get('ELEVENLABS_API_KEY') or os.environ.get('ELEVEN_API_KEY')
         or os.environ.get('XI_API_KEY') or '').strip()
    if not k:
        env = os.path.join(HERE, '.env')
        if os.path.exists(env):
            for line in open(env, encoding='utf-8'):
                line = line.strip()
                if line.startswith('#') or '=' not in line:
                    continue
                name, _, val = line.partition('=')
                if name.strip() in ('ELEVENLABS_API_KEY', 'ELEVEN_API_KEY', 'XI_API_KEY'):
                    k = val.strip().strip('\'"')
                    break
    if not k:
        sys.exit('❌ Chưa có API key.\n'
                 '   Cách 1 — tạo file build/.env với đúng một dòng:\n'
                 "       ELEVENLABS_API_KEY=khoá-của-bạn\n"
                 "   Cách 2 — export ELEVENLABS_API_KEY='khoá-của-bạn'\n"
                 '   Lấy khoá tại: https://elevenlabs.io/app/settings/api-keys')
    return k


def api_get(path):
    req = urllib.request.Request(API + path, headers={'xi-api-key': key()})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def list_voices():
    vs = api_get('/voices')['voices']
    print(f'{len(vs)} giọng trong tài khoản:\n')
    for v in vs:
        lb = v.get('labels') or {}
        tag = ' · '.join(x for x in [lb.get('gender'), lb.get('age'),
                                     lb.get('accent'), lb.get('description')] if x)
        print(f"  {v['name']:<22} {v['voice_id']}   {tag}")
    print('\nGợi ý: chọn giọng nữ, trẻ, tông ấm. Nghe thử trên web trước khi chốt.')
    print('Dùng:  python3 build_vo_eleven.py --voice-name "<tên>"')


# Giọng dựng sẵn của ElevenLabs — ai cũng dùng được, nhưng /v1/voices
# không phải lúc nào cũng trả về nếu tài khoản chưa "thêm vào thư viện".
PREMADE = {
    'adam':    'pNInz6obpgDQGcFmaJgB',   # nam, trầm — hay gặp trong video kể chuyện
    'antoni':  'ErXwobaYiN019PkySvjV',   # nam, ấm
    'josh':    'TxGEqnHWrfWFTfGW9XjX',   # nam, trẻ
    'arnold':  'VR6AewLTigWG4xSOukaG',   # nam, chắc
    'rachel':  '21m00Tcm4TlvDq8ikWAM',   # nữ, êm
    'bella':   'EXAVITQu4vr4xnSDxMaL',   # nữ, trẻ
    'domi':    'AZnzlk1XvdvUeBnXmlld',   # nữ, mạnh
}


def resolve_voice(args):
    if args.voice_id:
        return args.voice_id
    vs = api_get('/voices')['voices']
    if args.voice_name:
        for v in vs:
            if v['name'].lower() == args.voice_name.lower():
                return v['voice_id']
        pre = PREMADE.get(args.voice_name.strip().lower())
        if pre:
            print(f'   (dùng giọng dựng sẵn "{args.voice_name}" — {pre})')
            return pre
        sys.exit(f'❌ Không thấy giọng tên "{args.voice_name}". '
                 f'Chạy --list-voices để xem danh sách.')
    sys.exit('❌ Cần --voice-name hoặc --voice-id. Chạy --list-voices trước.')


def tts(text, voice_id, model, settings, prev_t, next_t, out_path):
    body = {
        'text': text,
        'model_id': model,
        'voice_settings': settings,
        'previous_text': prev_t or None,   # nối ngữ điệu — đây là chỗ tạo ra sự "liền hơi"
        'next_text': next_t or None,
    }
    req = urllib.request.Request(
        f'{API}/text-to-speech/{voice_id}?output_format=mp3_44100_128',
        data=json.dumps({k: v for k, v in body.items() if v is not None}).encode(),
        headers={'xi-api-key': key(), 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            open(out_path, 'wb').write(r.read())
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf8', 'ignore')[:400]
        sys.exit(f'❌ ElevenLabs trả lỗi {e.code}: {detail}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--list-voices', action='store_true')
    ap.add_argument('--voice-id')
    ap.add_argument('--voice-name')
    ap.add_argument('--model', default='eleven_multilingual_v2')
    ap.add_argument('--stability', type=float, default=0.40,
                    help='thấp = biểu cảm hơn, cao = đều hơn (0..1)')
    ap.add_argument('--style', type=float, default=0.35,
                    help='độ nhấn nhá; cao quá thì cường điệu (0..1)')
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--force', action='store_true', help='bỏ cache, sinh lại hết')
    a = ap.parse_args()

    global DUR, N
    DUR = a.duration
    N = int(SR * DUR)
    LINES = load_lines(a.project)

    if a.list_voices:
        list_voices(); return

    voice_id = resolve_voice(a)
    cache = os.path.join(a.project, 'audio', 'vo-eleven')
    os.makedirs(cache, exist_ok=True)

    settings = {'stability': a.stability, 'similarity_boost': 0.75,
                'style': a.style, 'use_speaker_boost': True, 'speed': a.speed}

    print(f'🎙️  ElevenLabs · {a.model} · voice {voice_id}')
    print(f'    stability={a.stability} style={a.style} speed={a.speed}\n')

    track = np.zeros(N)
    over = []
    prev_end = 0.0

    for i, (at, budget, text) in enumerate(LINES):
        prev_t = LINES[i - 1][2] if i > 0 else ''
        next_t = LINES[i + 1][2] if i + 1 < len(LINES) else ''
        sig = None

        # thử tốc độ chuẩn trước; câu nào tràn khung thì đẩy nhanh tối đa 1.12
        for speed in (a.speed, None):
            if speed is None:
                need = len(sig) / SR / budget
                if need <= 1.0:
                    break
                speed = min(1.12, round(a.speed * need * 1.02, 3))
                if speed <= a.speed:
                    break
            st = dict(settings, speed=speed)
            h = hashlib.sha1(json.dumps([text, voice_id, a.model, st, prev_t, next_t],
                                        sort_keys=True).encode()).hexdigest()[:10]
            mp3 = os.path.join(cache, f'{i + 1:02d}-{h}.mp3')
            if a.force or not os.path.exists(mp3):
                tts(text, voice_id, a.model, st, prev_t, next_t, mp3)
            sig = decode_mono(mp3)

        # cắt lặng đầu/cuối rồi chuẩn hoá đỉnh
        peak = float(np.max(np.abs(sig))) if len(sig) else 0.0
        if peak > 0:
            loud = np.abs(sig) > 0.02 * peak
            i0, i1 = int(np.argmax(loud)), len(sig) - int(np.argmax(loud[::-1]))
            sig = sig[max(0, i0 - int(0.02 * SR)):i1 + int(0.06 * SR)]
            sig = sig * (0.85 / max(float(np.max(np.abs(sig))), 1e-9))

        dur = len(sig) / SR
        flag = ''
        if dur > budget + 0.05:
            flag = f'  ⚠️ tràn {dur - budget:.2f}s — nên rút chữ'
            over.append((i + 1, at, budget, dur, text))
        if at < prev_end - 0.05:
            flag += f'  ⚠️ chồng {prev_end - at:.2f}s'
        prev_end = at + dur
        print(f'   [{at:>6.1f}s] {dur:4.2f}s/{budget:4.2f}s  {text[:42]}…{flag}')
        place(track, sig, at)

    out = os.path.join(a.project, 'audio', 'voiceover-pro.wav')
    write_wav(out, track)
    print(f'\n📁 {out}')

    if over:
        print(f'\n⚠️  {len(over)} câu tràn khung — rút chữ trong LINES của build_audio.py:')
        for n, at, b, d, t in over:
            print(f'   câu {n:02d} ({at}s): cần ≤{b:.1f}s, đang {d:.2f}s → bỏ ~'
                  f'{int((d - b) / d * len(t.split()))} từ\n      "{t}"')
    else:
        print('\n✓ Không câu nào tràn khung.')

    print('\nBước tiếp:  python3 build_audio.py --vo-wav audio/voiceover-pro.wav')


if __name__ == '__main__':
    main()
