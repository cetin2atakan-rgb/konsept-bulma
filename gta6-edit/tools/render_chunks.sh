#!/usr/bin/env bash
# Render a composition in muted 2500-frame chunks (resumable after a crash) + separate audio, then mux.
# Usage: tools/render_chunks.sh [Video1] [out/video1.mp4]   (one long render gets its compositor OOM-killed here)
cd "$(dirname "$0")/.."
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell

COMP=${1:-Video1}; OUT=${2:-out/video1.mp4}; D=out/chunks_$COMP   # delete $D before re-rendering changed code
TOTAL=$(npx remotion compositions src/index.ts --browser-executable=$B 2>/dev/null | awk -v c=$COMP '$1==c{print $4}'); STEP=2500; mkdir -p $D
for ((a=0; a<TOTAL; a+=STEP)); do
  b=$((a+STEP-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1))
  f=$D/c_$(printf %05d $a).mp4
  [ -s $f ] && continue
  for try in 1 2 3; do
    npx remotion render src/index.ts $COMP $f --frames=$a-$b --muted --browser-executable=$B > $D/log_$a.txt 2>&1 && break
    rm -f $f
  done
  [ -s $f ] || { echo "CHUNK $a FAILED"; exit 1; }
  echo "chunk $a-$b done"
done
npx remotion render src/index.ts $COMP $D/audio.wav --codec=wav --browser-executable=$B > $D/log_audio.txt 2>&1 || { echo AUDIO FAILED; exit 1; }
ls $D/c_*.mp4 | sed "s|^|file '$PWD/|; s|$|'|" > $D/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $D/list.txt -i $D/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart $OUT && echo MUXED
