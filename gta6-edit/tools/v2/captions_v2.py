"""Forced-alignment words (tools/v2/words.json, from tools/align_script.py) -> src/v2/captions.json.
Script text is written as spoken; DISPLAY turns it back into numerals for the screen."""
import json, re
DISPLAY = [
 ("GTA six", "GTA 6"), ("GTA five", "GTA 5"), ("GTA Plus", "GTA+"), ("PS five", "PS5"), ("Red Dead two", "Red Dead 2"),
 ("M dot two", "M.2"), ("Stock three oh five", "Stock 305"), ("six point four five million", "6.45 million"),
 ("Six point four five million", "6.45 million"),
 ("two hundred and ten gigabytes", "210 GB"), ("a hundred and fifty to two hundred gigabytes", "150 to 200 GB"),
 ("two hundred to two hundred and fifty", "200 to 250 GB"), ("Two hundred-odd gigabytes", "200-odd GB"),
 ("Six hundred and thirty million dollars", "$630 million"), ("Six hundred and thirty million", "$630 million"),
 ("six hundred and thirty million", "$630 million"), ("two hundred and sixty million dollars", "$260 million"),
 ("Two hundred and sixty million", "$260 million"), ("Seventy-four percent", "74%"), ("Eighty-nine percent", "89%"),
 ("eighty-nine percent", "89%"), ("four hundred dollar", "$400"), ("hundred dollar", "$100"), ("eighty dollars", "$80"),
 ("eighty dollar", "$80"), ("twenty dollars", "$20"), ("twenty dollar", "$20"), ("Ultimate at a hundred", "Ultimate at $100"),
 ("The hundred.", "The $100 one."), ("Eighty today, twenty whenever", "$80 today, $20 whenever"),
 ("a ninety-five Grotti", "a '95 Grotti"), ("a sixty-seven Vapid", "a '67 Vapid"), ("fifty-five Vapid", "'55 Vapid"),
 ("seven day preload", "7-day preload"), ("six day gap", "6-day gap"), ("six days", "6 days"),
 ("six or seven in the morning, eastern", "6 or 7 AM Eastern"), ("fourteen different stores", "14 different stores"),
 ("October fourteenth", "October 14th"), ("twelfth", "12th"), ("eighteenth", "18th"), ("nineteenth", "19th"), ("twentieth", "20th"),
 ("twelve or eighteen", "12 or 18"),
]
d = json.load(open("tools/v2/words.json")); toks = d["tokens"]
tim = {}
for i, s, e in d["words"]:
    tim.setdefault(i, [s, e]); tim[i][1] = e
chunks = []
for para in open("tools/v2/vo_script.txt").read().split("\n"):
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
    while len(w) > 17: out.append(" ".join(w[:12])); w = w[12:]
    out.append(" ".join(w))
ntok = lambda s: len(re.sub(r"[^a-z' ]", " ", s.lower().replace("-", " ")).split())
caps, k = [], 0
for c in out:
    n = ntok(c); idx = [i for i in range(k, k + n) if i in tim]; k += n
    if not idx: continue
    for a, b in DISPLAY: c = c.replace(a, b)
    caps.append({"s": round(tim[idx[0]][0], 2), "e": round(tim[idx[-1]][1], 2), "t": c.rstrip(",")})
assert k == len(toks), (k, len(toks))
json.dump(caps, open("src/v2/captions.json", "w"), indent=0)
for c in caps: print(c["s"], c["e"], c["t"])
