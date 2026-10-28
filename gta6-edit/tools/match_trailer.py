"""Pick trailer shots for the background, timed to the voiceover.

Reads the shot catalogs in trailers/catalog_*.json and the VO captions (src/captions.json:
[{s, e, t}] in seconds), cuts a new background shot every ~3.5 s, and scores each catalog shot
by how well its tags match the words being spoken. A shot is never used twice while unused
ones remain. Writes src/footage.json: [{at, dur, src, from}] (seconds).

    python tools/match_trailer.py [--every 3.5] [--seed 1] [--only launch_trailer]
"""
import argparse, glob, json, random, re

# spoken word -> catalog tags it should pull in (weight 3); generic fallbacks score lower
KEYWORDS = {
    r"\bmap|leonida|world|square miles|bigger|size of|everglades|keys\b": ["aerial", "skyline", "city", "vice-city", "swamp", "everglades", "keys", "map"],
    r"\bfile size|install|gb\b|gigs?|storage|download|console|ps5|xbox|pro\b|enhanced": ["gameplay", "driving", "hud", "traffic", "city"],
    r"frame|fps|30|60|performance|smooth": ["driving", "chase", "racing", "traffic", "gameplay"],
    r"lucia": ["lucia"], r"jason": ["jason"],
    r"voice|cast|actor|actress|cameo|celebrit|plays|role": ["character", "closeup", "dialogue", "characters"],
    r"radio|music|station|album|song|track|artist": ["car", "driving", "nightclub", "party", "neon", "convertible"],
    r"online|multiplayer|players|friends": ["party", "crowd", "racing", "activities", "friends"],
    r"budget|money|billion|million|cost|price|\$|dollars|paid": ["money", "luxury", "heist", "duffel-bag", "jewelry-store"],
    r"release|november|launch|date|delay|pre-?order|days? left|days? from": ["skyline", "sunset", "iconic", "night"],
    r"\bpc\b|computer": ["skyline", "aerial", "night"],
    r"police|cops|wanted|crime|robber|heist|steal": ["robbery", "police", "heist", "chase", "shootout"],
    r"social media|phone|influencer|stream|viral|post": ["phone", "social-media", "livestream"],
    r"beach|vice city|miami|ocean|boat": ["beach", "vice-city", "ocean", "boat", "jetski"],
    r"mission|story|campaign|gives|boss": ["dialogue", "characters", "heist", "deal"],
    r"night|club|party": ["nightclub", "party", "night", "neon"],
    r"car|drive|driving|vehicle": ["car", "driving"],
    r"gun|weapon|shoot": ["gun", "shootout"],
    r"trailer|rockstar|official|confirm": ["iconic", "skyline", "city"],
}
GENERIC = ["city", "street", "driving", "skyline", "daytime", "vice-city"]

ap = argparse.ArgumentParser()
ap.add_argument("--every", type=float, default=3.5)
ap.add_argument("--seed", type=int, default=1)
ap.add_argument("--only", help="use only this trailer src, e.g. launch_trailer")
a = ap.parse_args()
random.seed(a.seed)

shots = []
for f in sorted(glob.glob("trailers/catalog_*.json")):
    shots += [s for s in json.load(open(f)) if s["use"] == "yes" and s["dur"] >= 1.4 and (not a.only or s["src"] == a.only)]
caps = json.load(open("src/captions.json"))
end = max(c["e"] for c in caps) + 1.5

def words(t0, t1):
    return " ".join(c["t"] for c in caps if c["e"] > t0 and c["s"] < t1).lower()

def score(shot, text):
    tags = set(shot["tags"])
    sc = 0.0
    for pat, want in KEYWORDS.items():
        if re.search(pat, text):
            sc += 3 * len(tags & set(want))
    sc += 0.5 * len(tags & set(GENERIC))
    if "gameplay-ui" in tags or "dark" in tags:
        sc -= 1.5          # HUD overlays and near-black shots read badly under cards
    if shot["src"] == "launch_trailer":
        sc += 1.0          # cinematic trailer shots look best; prefer them on equal matches
    return sc + random.random() * 0.8

used, out, t = set(), [], 0.0
while t < end:
    win = min(a.every, end - t)
    text = words(t, t + win)
    pool = [s for s in shots if s["id"] not in used] or shots
    best = max(pool, key=lambda s: score(s, text))
    used.add(best["id"])
    usable = best["dur"] - 0.6
    dur = min(win, usable)
    out.append({"at": round(t, 2), "dur": round(dur, 2), "src": best["src"], "from": round(best["start"] + 0.3, 2), "id": best["id"], "desc": best["desc"]})
    t += dur
json.dump(out, open("src/footage.json", "w"), indent=1)
print(len(out), "background shots,", len(used), "distinct")
