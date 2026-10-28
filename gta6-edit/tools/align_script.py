"""Forced-align a script to a voiceover with pocketsphinx. Words missing from the dictionary are skipped
(their times are filled in from neighbours later). Output: [[script_word_index, start, end], ...]"""
import sys, re, wave, json, os, pocketsphinx
from pocketsphinx import Decoder
wav, txt, out = sys.argv[1:4]
SPLIT = {"natethehate": "nate the hate", "vgtimes": "v g times", "newzoo": "new zoo", "ps": "p s", "usb": "u s b", "ssd": "s s d", "gta": "g t a", "ceo": "c e o"}
dic = set()
for l in open(os.path.join(os.path.dirname(pocketsphinx.__file__), "model/en-us/cmudict-en-us.dict")):
    dic.add(l.split()[0].split("(")[0])
toks = re.sub(r"[^a-z' ]", " ", open(txt).read().lower().replace("-", " ")).split()
seq = []  # (dict word, script index)
for i, t in enumerate(toks):
    for p in SPLIT.get(t, t).split():
        if p in dic: seq.append((p, i))
print(len(toks), "script tokens,", len(seq), "in dictionary; skipped:", sorted({t for t in toks if not all(p in dic for p in SPLIT.get(t, t).split())}))
d = Decoder(lm=None, fsg=None, beam=1e-60, wbeam=1e-40, pbeam=1e-60)
d.set_align_text(" ".join(w for w, _ in seq))
w = wave.open(wav, "rb"); d.start_utt()
while True:
    buf = w.readframes(8192)
    if not buf: break
    d.process_raw(buf, False, False)
d.end_utt()
segs = [s for s in d.seg() if s.word not in ("<s>", "</s>", "<sil>", "(NULL)")]
print(len(segs), "aligned of", len(seq))
res = []
for k, s in enumerate(segs):
    res.append([seq[k][1], s.start_frame / 100, (s.end_frame + 1) / 100])
json.dump({"tokens": toks, "words": res}, open(out, "w"))
print("last", res[-1] if res else None)
