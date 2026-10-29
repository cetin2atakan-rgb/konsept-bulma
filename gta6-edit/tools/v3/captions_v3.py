"""Forced-alignment words (tools/v3/words.json, from tools/align_script.py) -> src/v3/captions.json.
Script text is written as spoken; DISPLAY turns it back into numerals for the screen."""
import json, re
DISPLAY = [
 ("GTA six", "GTA 6"), ("PS five", "PS5"), ("twenty-two days", "22 days"), ("Twenty-two days", "22 days"),
 ("eighty dollars", "$80"), ("a nine hundred dollar", "a $900"), ("nine hundred dollars", "$900"),
 ("six point four five million", "6.45 million"), ("fourteen forty p", "1440p"), ("fourteen forty", "1440p"),
 ("twenty-seven minute", "27-minute"), ("thirty-three milliseconds", "33 milliseconds"), ("twenty-five", "25"),
 ("one hundred and twenty hertz", "120 Hz"), ("a hundred and twenty hertz", "a 120 Hz"), ("sixty hertz", "60 Hz"),
 ("RAGE nine", "RAGE 9"), ("Red Dead Redemption two", "Red Dead Redemption 2"), ("twenty twenty-seven", "2027"),
 ("twenty twenty-six", "2026"), ("sixty-plus", "60-plus"), ("November nineteenth", "November 19th"), ("nineteenth", "19th"),
 ("frames per second", "fps"), ("thirty frames", "30 fps"), ("sixty frames", "60 fps"), ("forty frames", "40 fps"),
]
GLUE = {"a", "nine", "hundred", "dollar", "dollars", "ps", "five", "and", "twenty", "thirty", "forty", "sixty", "the"}
NUM = [(r"\b[Tt]hirty\b", "30"), (r"\b[Ff]orty\b", "40"), (r"\b[Ss]ixty\b", "60")]
d = json.load(open("tools/v3/words.json")); toks = d["tokens"]
tim = {}
for i, s, e in d["words"]:
    tim.setdefault(i, [s, e]); tim[i][1] = e
chunks = []
for para in open("tools/v3/vo_script.txt").read().split("\n"):
    for sent in re.split(r"(?<=[.?!])\s+", para):
        if len(sent.split()) <= 13: chunks.append(sent); continue
        cur = ""
        for p in re.split(r"(?<=[,—;:])\s+", sent):
            if cur and len((cur + " " + p).split()) > 13: chunks.append(cur); cur = p
            else: cur = (cur + " " + p).strip()
        if cur: chunks.append(cur)
out = []
for c in chunks:
    w = c.split()
    while len(w) > 17:  # split near the middle, never inside a spoken number or a product name
        h = min((k for k in range(4, len(w) - 3) if w[k - 1].lower() not in GLUE and w[k].lower() not in GLUE | {"pro"}), key=lambda k: abs(k - len(w) / 2))
        out.append(" ".join(w[:h])); w = w[h:]
    out.append(" ".join(w))
ntok = lambda s: len(re.sub(r"[^a-z' ]", " ", s.lower().replace("-", " ")).split())
caps, k = [], 0
for c in out:
    n = ntok(c); idx = [i for i in range(k, k + n) if i in tim]; k += n
    if not idx: continue
    for a, b in DISPLAY: c = c.replace(a, b)
    for a, b in NUM: c = re.sub(a, b, c)
    caps.append({"s": round(tim[idx[0]][0], 2), "e": round(tim[idx[-1]][1], 2), "t": c.rstrip(",")})
assert k == len(toks), (k, len(toks))
json.dump(caps, open("src/v3/captions.json", "w"), indent=0)
for c in caps: print(c["s"], c["e"], c["t"])
