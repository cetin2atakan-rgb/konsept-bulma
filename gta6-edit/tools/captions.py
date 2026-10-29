"""ASR segments (tools/segs.json) -> src/captions.json, with names fixed to match the script."""
import json, re
FIX = [
 (r"\s*[\(\[][^\)\]]*[\)\]]?\s*$", ""), (r"\s*\[\s*$", ""), (r"\s*\(\s*$", ""),
 ("The news were posts", "The Newswire posts"), ("take two", "Take-Two"), ("take-to", "Take-Two"),
 ("Davey Jones", "Davy Jones"), ("Series S512", "Series S. 512"), ("rock star", "Rockstar"),
 ("Garba in Game & Former", "Garbut, in Game Informer,"), ("game in former", "Game Informer"),
 ("sensor,", "Denser,"), ("red dead twos", "Red Dead 2's"), ("red dead", "Red Dead"),
 ("Santinjali", "Santangeli"), ("Manny El Perez", "Manni L. Perez"), ("his two actors", "is two actors"),
 ("Zellnick", "Zelnick"), ("Raw will ajandro", "Rauw Alejandro"), ("Morgan-Wallen", "Morgan Wallen"),
 ("Kakodio Backcountry", "Cocoteo, Back Country"), ("Afrobank", "Afro Bank"),
 ("Booby-Aik", "Boobie Ike"), ("Dreckwin", "Dre'Quan"), ("Bodista", "Bautista"), ("Brian Header", "Brian Heder"),
 ("Versetti", "Vercetti"), ("an amination and", "an Ammu-Nation ad"), ("in a rockstar north", "And a Rockstar North"),
 ("rockstar", "Rockstar"), ("It would not", "They would not"), ("This is the$", "This is the one."),
 ("good on the$", "good on the 18th."), ("that one is$", "that one is fake."), ("no idea no$", "No idea."),
 ("^actually gives you", "Who actually gives you"), ("PlayStation List", "PlayStation lists"), ("Game & Former", "Game Informer"),
 ("In both official", "And both official"), ("in the launch trailer", "and the Launch Trailer"),
 ("That notices", "That notice is"), ("release tracks are number", "released tracks are numbered"),
]
segs = json.load(open("tools/segs.json"))
out = []
for s in segs:
    t = s["t"]
    for a, b in FIX: t = re.sub(a, b, t)
    t = t.strip()
    if not t: continue
    # split long segments on sentence ends, proportional to characters
    parts = [p for p in re.split(r"(?<=[.?!])\s+", t) if p]
    if len(t) > 70 and len(parts) > 1:
        tot = sum(len(p) for p in parts); acc = 0
        for p in parts:
            a = s["s"] + (s["e"] - s["s"]) * acc / tot; acc += len(p)
            b = s["s"] + (s["e"] - s["s"]) * acc / tot
            out.append({"s": round(a, 2), "e": round(b, 2), "t": p})
    else:
        out.append({"s": s["s"], "e": s["e"], "t": t})
json.dump(out, open("src/captions.json", "w"), indent=0)
for c in out: print(c["s"], c["t"])
