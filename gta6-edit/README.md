# gta6-edit — Video 1: "13 Things Rockstar STILL Hasn't Told Us About GTA 6"

Motion-graphics edit built in Remotion, timed to the voiceover (`public/audio/vo.wav`, not committed).
No third-party footage: backdrop, cards and SFX/music are all generated.

- `src/scenes.ts` — shot list, one entry per on-screen beat, `at` = seconds into the VO
- `src/kit.tsx` — scene kinds (big number, bars, quote, timeline, store page, ...)
- `src/captions.json` — burned-in captions (`tools/captions.py` from ASR segments in `tools/segs.json`)
- `tools/make_audio.sh` — synthesized whoosh/thud + music bed

Render:
    npm install && tools/make_audio.sh
    npx remotion render src/index.ts Video1 out/video1.mp4 --browser-executable=<chrome-headless-shell>
