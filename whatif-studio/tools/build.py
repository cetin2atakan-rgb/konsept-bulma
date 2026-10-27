"""Script (scenes/*.json) -> Kokoro TTS per scene -> public/audio/<id>.wav + src/data/<id>.json with frame timings.
Usage: python tools/build.py scenes/demoA.json --model PATH/kokoro-v1.0.onnx --voices PATH/voices-v1.0.bin
"""
import argparse, json, re
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

FPS = 30
GAP = 0.35   # seconds of silence between scenes
LEAD = 0.4   # silence before the first line

ap = argparse.ArgumentParser()
ap.add_argument("scene_file"); ap.add_argument("--model", required=True); ap.add_argument("--voices", required=True)
a = ap.parse_args()
spec = json.load(open(a.scene_file, encoding="utf-8"))
k = Kokoro(a.model, a.voices)

chunks, t, sr = [], LEAD, 24000
chunks.append(np.zeros(int(LEAD * sr), dtype=np.float32))
for sc in spec["scenes"]:
    audio, sr = k.create(sc["text"], voice=spec["voice"], speed=spec.get("speed", 1.0), lang="en-us")
    dur = len(audio) / sr
    words = sc["text"].split()
    # word timings: proportional to character length (good enough for caption highlight)
    weights = [len(re.sub(r"[^\w]", "", w)) + 1 for w in words]
    tot, acc, wt = sum(weights), 0.0, []
    for w, wgt in zip(words, weights):
        wt.append({"w": w, "s": round((t + acc / tot * dur) * FPS)}); acc += wgt
    sc["start"] = round(t * FPS)
    sc["dur"] = round((dur + GAP) * FPS)
    sc["words"] = wt
    chunks += [audio.astype(np.float32), np.zeros(int(GAP * sr), dtype=np.float32)]
    t += dur + GAP

out = np.concatenate(chunks)
sf.write(f"public/audio/{spec['id']}.wav", out, sr)
spec["total"] = round(t * FPS) + 30
json.dump(spec, open(f"src/data/{spec['id']}.json", "w", encoding="utf-8"), indent=1)
print(spec["id"], "seconds:", round(t, 1), "frames:", spec["total"], "scenes:", len(spec["scenes"]))
