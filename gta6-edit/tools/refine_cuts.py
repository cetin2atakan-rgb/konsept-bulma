"""Snap a trailer catalog's shot boundaries to the real cuts, frame-accurately.

    python tools/refine_cuts.py trailers/catalog_extended_look.json public/trailers/extended_look.mp4

The 1 fps contact sheets only give boundaries to +-1 s. This runs ffmpeg scene detection (hard cuts,
score >= 0.2) and blackdetect (fade edges) on the full-frame-rate video, then moves each boundary to the
nearest cut within +-1.5 s, each cut used once. A boundary with no cut nearby is a split inside one long
take and stays where it is. Every entry gets `cut_in` ("hard" / "black" / "none") and
`frame_accurate: true`; ids, descriptions and tags are untouched.
"""
import json, re, subprocess, sys

cat_path, video = sys.argv[1], sys.argv[2]
WINDOW, THRESH = 1.5, 0.2

probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=r_frame_rate:format=duration", "-of", "json", video], capture_output=True, text=True)
info = json.loads(probe.stdout)
num, den = map(int, info["streams"][0]["r_frame_rate"].split("/"))
fps, total = num / den, float(info["format"]["duration"])

log = subprocess.run(["ffmpeg", "-v", "info", "-i", video, "-an", "-vf",
                      f"scale=320:-2,blackdetect=d=0.05:pix_th=0.08,select='gt(scene,{THRESH})',showinfo",
                      "-f", "null", "-"], capture_output=True, text=True).stderr
cands = [(float(t), "hard") for t in re.findall(r"pts_time:([0-9.]+)", log)]
for a, b in re.findall(r"black_start:([0-9.]+) black_end:([0-9.]+)", log):
    cands += [(float(a), "black"), (float(b), "black")]

shots = json.load(open(cat_path))
bounds = [s["start"] for s in shots[1:]]
# closest pairs first, so two boundaries never claim the same cut
pairs = sorted((abs(c - b), i, c, k) for i, b in enumerate(bounds) for c, k in cands if abs(c - b) <= WINDOW)
new, kind, used = list(map(float, bounds)), ["none"] * len(bounds), set()
for _, i, c, k in pairs:
    if kind[i] == "none" and c not in used:
        new[i], kind[i] = c, k
        used.add(c)

snap = lambda t: round(round(t * fps) / fps, 3)
edges = [0.0] + [snap(t) for t in new] + [snap(total)]
assert all(b > a for a, b in zip(edges, edges[1:])), "boundaries out of order"
for i, s in enumerate(shots):
    s["start"], s["end"] = edges[i], edges[i + 1]
    s["dur"] = round(s["end"] - s["start"], 3)
    s["cut_in"] = "hard" if i == 0 else kind[i - 1]
    s["frame_accurate"] = True
json.dump(shots, open(cat_path, "w"), indent=1, ensure_ascii=False)
moved = [abs(n - b) for n, b, k in zip(new, bounds, kind) if k != "none"]
print(f"{len(shots)} shots, {fps:g} fps, {total:.2f} s; snapped {len(moved)} boundaries "
      f"(mean shift {sum(moved) / max(len(moved), 1):.2f} s), {kind.count('none')} left as in-take splits")
