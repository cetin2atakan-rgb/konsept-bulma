#!/usr/bin/env bash
# Synthesized SFX and music (no third-party audio, so no licensing questions).
set -e
cd "$(dirname "$0")/../public/sfx"
ffmpeg -y -loglevel error -f lavfi -i "sine=f=660:d=0.18" -af "afade=t=out:st=0.03:d=0.15,volume=0.6" pop.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=1320:d=0.9" -af "afade=t=out:st=0.02:d=0.88,volume=0.45" ding.wav
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=d=0.6:c=pink:a=0.5" -af "highpass=f=600,lowpass=f=5000,afade=t=in:d=0.25,afade=t=out:st=0.3:d=0.3,volume=0.5" whoosh.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=55:d=0.9" -af "afade=t=out:st=0.05:d=0.85,volume=0.9" boom.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=1760:d=1.0" -f lavfi -i "sine=f=2349:d=1.0" -filter_complex "[0][1]amix=inputs=2,tremolo=f=12:d=0.6,afade=t=in:d=0.2,afade=t=out:st=0.4:d=0.6,volume=0.25" shimmer.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=2000:d=1.2" -af "tremolo=f=22:d=1,afade=t=out:st=0.8:d=0.4,volume=0.35" ring.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=300:d=0.35" -af "vibrato=f=14:d=0.9,afade=t=out:st=0.1:d=0.25,volume=0.5" boing.wav
# 64-second soft pad: C - Am - F - G, 4 s each, looped x4
mk() { ffmpeg -y -loglevel error -f lavfi -i "sine=f=$1:d=4" -f lavfi -i "sine=f=$2:d=4" -f lavfi -i "sine=f=$3:d=4" -filter_complex "[0][1][2]amix=inputs=3,afade=t=in:d=0.6,afade=t=out:st=3.2:d=0.8,volume=0.5" "$4"; }
mk 261.6 329.6 392.0 c1.wav; mk 220.0 261.6 329.6 c2.wav; mk 174.6 220.0 261.6 c3.wav; mk 196.0 246.9 293.7 c4.wav
printf "file 'c1.wav'\nfile 'c2.wav'\nfile 'c3.wav'\nfile 'c4.wav'\n%.0s" 1 2 3 4 > list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i list.txt -af "lowpass=f=1800,tremolo=f=0.25:d=0.3,volume=0.6" music_pad.wav
rm -f c1.wav c2.wav c3.wav c4.wav list.txt
ls
