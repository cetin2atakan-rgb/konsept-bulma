# Trailer shot catalog

`catalog_extended_look.json` — every shot of the GTA VI Extended Look (26:45), one entry per shot:
`id, src, start, end, dur` (seconds, ±1 s; frames were sampled at 1 fps), `desc`, `tags`, `energy`
(calm / tense / action), `use` (`no` = logo, black, title card or gore), `note`.

`work/EXT_sheet_*.jpg` are the labelled contact sheets the catalog was written from.

## How a video uses it

1. `tools/prep_vo.sh voiceover.mp3` → `public/audio/vo.wav` (loudness-normalised).
2. Captions in `src/captions.json` (from ASR segments, `tools/captions.py`).
3. `python tools/match_trailer.py` → `src/footage.json`: a new background shot every ~3.5 s, picked by
   matching the spoken words against shot tags (see `KEYWORDS` in the script), no shot reused.
4. Put the real trailer files in `public/trailers/` named after `src` (`extended_look.mp4`,
   `launch_trailer.mp4`). Same length as the originals — never trimmed, so the timestamps match.
   These files are never committed.
5. Render: `npx remotion render src/index.ts Video1 out/video1.mp4`.

Trailer audio is always muted (licensed songs trigger Content ID).

## Adding a trailer

Sample it at 1 fps into 6×5 sheets (`ffmpeg -i in.mp4 -vf "fps=1,scale=384:-2,tile=6x5" X_%02d.jpg`),
run `python tools/segment_sheets.py <dir> <PREFIX> trailers/work`, describe each shot, save as `catalog_<name>.json`.
