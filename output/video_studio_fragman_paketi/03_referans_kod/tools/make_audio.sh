#!/usr/bin/env bash
# Synthesized SFX + music bed (no third-party audio).
set -e
cd "$(dirname "$0")/../public/sfx"
ffmpeg -y -loglevel error -f lavfi -i "anoisesrc=d=0.5:c=pink:a=0.5" -af "highpass=f=700,lowpass=f=6000,afade=t=in:d=0.2,afade=t=out:st=0.25:d=0.25,volume=0.35" whoosh.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=60:d=0.7" -af "afade=t=out:st=0.05:d=0.65,volume=0.8" thud.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=1200:d=0.08" -af "afade=t=out:st=0.01:d=0.07,volume=0.25" tick.wav
ffmpeg -y -loglevel error -f lavfi -i "sine=f=140:d=0.35" -f lavfi -i "sine=f=147:d=0.35" -filter_complex "[0][1]amix=inputs=2,afade=t=out:st=0.1:d=0.25,volume=0.5" buzz.wav
# 32 s dark synth bed: Am - F - C - G, 8 s each, with a soft 1/8 pulse
mk() { ffmpeg -y -loglevel error -f lavfi -i "sine=f=$1:d=8" -f lavfi -i "sine=f=$2:d=8" -f lavfi -i "sine=f=$3:d=8" -f lavfi -i "sine=f=$4:d=8" -filter_complex "[0][1][2][3]amix=inputs=4,tremolo=f=4:d=0.35,afade=t=in:d=0.8,afade=t=out:st=7.0:d=1.0,volume=0.6" "$5"; }
mk 110.0 220.0 261.6 329.6 c1.wav; mk 87.3 174.6 220.0 261.6 c2.wav; mk 130.8 196.0 261.6 329.6 c3.wav; mk 98.0 196.0 246.9 293.7 c4.wav
printf "file 'c1.wav'\nfile 'c2.wav'\nfile 'c3.wav'\nfile 'c4.wav'\n" > list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i list.txt -af "lowpass=f=1400,aecho=0.8:0.6:300:0.25,volume=0.7" music_bed.wav
rm -f c1.wav c2.wav c3.wav c4.wav list.txt
ls
