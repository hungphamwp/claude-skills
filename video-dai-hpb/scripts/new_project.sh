#!/usr/bin/env bash
# new_project.sh — dựng khung dự án video-dai-hpb mới
#
# DÙNG:
#   bash new_project.sh <đường-dẫn-dự-án>
#
# Copy template (paper theme + font Gilroy VH + mascot dock có sẵn),
# copy toàn bộ script, symlink node_modules (puppeteer-core dùng chung
# với skill video-quangcao-hpb để khỏi cài lại), tạo sẵn output/audio.
#
# Sau lệnh này, việc còn lại chỉ là viết scenes.js + voiceover.json
# (và thêm ảnh mascot vào assets/mascot/ nếu muốn linh vật xuyên suốt),
# rồi chạy build_full.py.

set -e
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL="$(dirname "$HERE")"
TEMPLATE="$SKILL/assets/template"
AD_SKILL_SCRIPTS="$HOME/.claude/skills/video-quangcao-hpb/scripts"

PROJECT="$1"
if [ -z "$PROJECT" ]; then
  echo "❌ Dùng: bash new_project.sh <đường-dẫn-dự-án>"
  exit 1
fi

mkdir -p "$PROJECT"
cp -R "$TEMPLATE"/* "$PROJECT"/
cp "$HERE"/*.js "$HERE"/*.py "$PROJECT"/ 2>/dev/null || true
mkdir -p "$PROJECT/output" "$PROJECT/audio" "$PROJECT/assets/mascot"

if [ -d "$AD_SKILL_SCRIPTS/node_modules" ]; then
  ln -sf "$AD_SKILL_SCRIPTS/node_modules" "$PROJECT/node_modules"
else
  echo "⚠️  Chưa thấy node_modules (puppeteer-core) ở $AD_SKILL_SCRIPTS"
  echo "   Chạy: cd \"$PROJECT\" && npm install puppeteer-core"
fi

echo "✅ Dự án sẵn sàng: $PROJECT"
echo "   Tiếp theo: viết scenes.js + voiceover.json, rồi chạy"
echo "   python3 \"$HERE/build_full.py\" --project \"$PROJECT\" --duration <giây>"
