#!/usr/bin/env python3
"""
build_full.py — Chạy trọn quy trình video-dai-hpb bằng 1 lệnh

Gộp lại đúng thứ tự các bước đã làm tay nhiều lần:
  1. check.js       — soát bố cục/thời gian, dừng ngay nếu có lỗi
  2. build_vo_gemini.py — giọng đọc Gemini TTS (mặc định voice Charon,
                          phong cách chuyên gia kỹ thuật AI, giọng miền Nam)
  3. record.js       — render toàn bộ khung hình → video.mp4
  4. build_audio.py  — trộn giọng đọc + nhạc nền + SFX → video-final.mp4
  5. ffmpeg loudnorm — chuẩn hoá âm lượng -14 LUFS (bắt buộc cho TikTok/Reels)
  6. copy ra Desktop với tên rõ ràng

ĐIỀU KIỆN TRƯỚC KHI CHẠY:
  - scenes.js và voiceover.json đã viết xong trong thư mục dự án
    (dùng new_project.sh để dựng khung dự án trước)
  - GEMINI_API_KEY đã export (lấy tại aistudio.google.com/apikey)
    → không có key thì bỏ qua bước giọng đọc, chỉ ra video câm

DÙNG:
  export GEMINI_API_KEY='...'
  python3 build_full.py --project ~/Desktop/ten-du-an --duration 90
  python3 build_full.py --project ~/Desktop/ten-du-an --duration 90 \\
      --voice Kore --no-voice  # bỏ qua giọng đọc, chỉ render hình
"""

import argparse, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def run(cmd, cwd, allow_fail=False):
    print(f"\n$ {' '.join(cmd)}")
    r = subprocess.run(cmd, cwd=cwd)
    if r.returncode != 0 and not allow_fail:
        sys.exit(f"❌ Lệnh thất bại (mã {r.returncode}): {' '.join(cmd)}")
    return r.returncode == 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--project', required=True)
    ap.add_argument('--duration', type=float, required=True)
    ap.add_argument('--voice', default='Charon',
                    help='Giọng Gemini TTS: Kore/Puck/Charon/Zephyr/Leda/Orus/Aoede...')
    ap.add_argument('--style', default=None,
                    help='Ghi đè chỉ dẫn phong cách đọc (mặc định: chuyên gia kỹ thuật AI, giọng miền Nam)')
    ap.add_argument('--no-voice', action='store_true', help='bỏ qua giọng đọc, chỉ render hình')
    ap.add_argument('--no-loudnorm', action='store_true')
    ap.add_argument('--skip-check', action='store_true')
    ap.add_argument('--out-name', default=None, help='tên file cuối trên Desktop (không cần .mp4)')
    a = ap.parse_args()

    project = os.path.abspath(os.path.expanduser(a.project))
    if not os.path.isdir(project):
        sys.exit(f'❌ Không thấy thư mục dự án: {project}')
    for f in ('scenes.js', 'voiceover.json', 'index.html', 'check.js', 'record.js', 'build_audio.py'):
        if not os.path.exists(os.path.join(project, f)):
            sys.exit(f'❌ Thiếu {f} trong {project} — chạy new_project.sh trước, '
                      f'và viết scenes.js + voiceover.json.')

    node = shutil.which('node')
    if not node:
        sys.exit('❌ Chưa có node. Cài: brew install node')

    # 1. Soát bố cục/thời gian
    if not a.skip_check:
        print('═══ 1/5 · check.js ═══')
        run([node, 'check.js', '--duration', str(a.duration)], cwd=project)
    else:
        print('⚠️  Bỏ qua check.js (--skip-check)')

    # 2. Giọng đọc Gemini TTS
    has_voice = False
    if not a.no_voice:
        print('\n═══ 2/5 · Giọng đọc Gemini TTS ═══')
        if not (os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')):
            print('⚠️  Chưa có GEMINI_API_KEY trong môi trường — bỏ qua giọng đọc.')
            print('   export GEMINI_API_KEY=\'...\'  (lấy tại aistudio.google.com/apikey)')
        else:
            cmd = ['python3', 'build_vo_gemini.py', '--voice', a.voice, '--duration', str(a.duration)]
            if a.style:
                cmd += ['--style', a.style]
            has_voice = run(cmd, cwd=project, allow_fail=True)
            if not has_voice:
                print('⚠️  Giọng đọc lỗi — tiếp tục render hình, ghép tiếng sau bằng tay.')
    else:
        print('\n⚠️  Bỏ qua giọng đọc (--no-voice)')

    # 3. Render hình
    print('\n═══ 3/5 · record.js (render toàn bộ khung hình) ═══')
    run([node, 'record.js', '--duration', str(a.duration)], cwd=project)

    # 4. Trộn tiếng
    final = os.path.join(project, 'output', 'video.mp4')
    if has_voice:
        print('\n═══ 4/5 · build_audio.py (giọng đọc + nhạc nền + SFX) ═══')
        vo_wav = os.path.join(project, 'audio', 'voiceover-pro.wav')
        run(['python3', 'build_audio.py', '--vo-wav', vo_wav], cwd=project)
        final = os.path.join(project, 'output', 'video-final.mp4')
    else:
        print('\n⚠️  Bỏ qua bước 4/5 (không có giọng đọc) — video ra sẽ câm.')

    # 5. Chuẩn hoá âm lượng
    if has_voice and not a.no_loudnorm:
        print('\n═══ 5/5 · Chuẩn hoá âm lượng -14 LUFS ═══')
        tmp = final + '.norm.mp4'
        run(['ffmpeg', '-y', '-i', final, '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11',
             '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', tmp], cwd=project)
        os.replace(tmp, final)

    # Giao file
    name = a.out_name or os.path.basename(project.rstrip('/'))
    desktop = os.path.expanduser('~/Desktop')
    dest = os.path.join(desktop, f'{name}.mp4')
    shutil.copy2(final, dest)

    print('\n═══════════════════════════════════════')
    print('🎉  VIDEO HOÀN THÀNH')
    print('═══════════════════════════════════════')
    print(f'📁  {dest}')
    print(f'📦  {os.path.getsize(dest) / 1024 / 1024:.2f} MB')
    print(f'🎞️   1080×1920 · 30fps · {a.duration:.0f}s' + ('' if has_voice else ' · KHÔNG có tiếng'))
    print('═══════════════════════════════════════')


if __name__ == '__main__':
    main()
