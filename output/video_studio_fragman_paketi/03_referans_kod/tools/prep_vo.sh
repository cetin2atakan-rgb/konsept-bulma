#!/usr/bin/env bash
# Voiceover -> public/audio/vo.wav, loudness-normalised so the final mix lands near YouTube's -14 LUFS.
# Usage: tools/prep_vo.sh path/to/voiceover.mp3
set -e
cd "$(dirname "$0")/.."
mkdir -p public/audio
ffmpeg -y -loglevel error -i "$1" -af "loudnorm=I=-14.5:TP=-1.5:LRA=11" -ar 48000 public/audio/vo.wav
echo "public/audio/vo.wav ready"
