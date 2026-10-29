// Video 3: "The GTA 6 Frame Rate Nobody Will Confirm". Shot list timed (seconds) to public/audio/vo3.wav
// via the forced-aligned captions in ./captions.json. Each scene runs until the next one starts.
import { VideoData } from "../Video";
import { Scene } from "../scenes";
import captions from "./captions.json";
import footage from "./footage.json";

const scenes: Scene[] = [
  // HOOK
  { at: 0, k: "title", kicker: "GTA VI", text: "Why can nobody tell you\nGTA 6's frame rate?" },
  { at: 2.75, k: "big", value: "22 DAYS", label: "before you lose $80 on it", color: "pink" },
  { at: 5.3, k: "big", value: "30", label: "the only number on record", color: "cyan" },
  { at: 7.7, k: "store", field: "Frame rate", note: "One conversation with a YouTuber." },
  // THE TURN
  { at: 13.8, k: "checklist", title: "OFFICIAL SPEC", items: ["Resolution", "Frame rate", "Graphics modes"], at2: [2.4, 3.6, 4.9] },
  { at: 21.2, k: "list", title: "THIS VIDEO", items: ["1 · What was said, and by who", "2 · What the analysts measured", "3 · Why a $900 PS5 Pro won't rescue you"], start: 3.1, every: 3.2 },
  { at: 35.4, k: "big", value: "$899.99", label: "PS5 Pro — not the fix you think", color: "yellow" },
  { at: 38.0, k: "big", value: "NOV 19", label: "what you are actually getting — and how sure anyone can be", color: "pink" },
  // 1 · THE ONE NUMBER
  { at: 43.3, k: "chapter", n: "1", title: "THE ONE NUMBER", ch: "1" },
  { at: 46.9, k: "people", ch: "1", title: "THE SOURCE", items: [{ name: "Rob Nelson", role: "co-head, Rockstar North" }] },
  { at: 53.0, k: "quote", ch: "1", text: "During development, GTA 6 ran at 30 fps on console.", who: "Rob Nelson, to YouTuber Davy Jones", src: "paraphrased · the only performance number on record" },
  { at: 59.3, k: "big", ch: "1", value: "1 SENTENCE", label: "1 interview · 1 creator", sub: "= the entire official record on performance", color: "cyan" },
  { at: 65.2, k: "big", ch: "1", value: "CREDIBLE", label: "not an insider — he is the guy", sub: "the number is almost certainly right", color: "green" },
  { at: 75.6, k: "checklist", ch: "1", title: "PUBLISHED PERFORMANCE SPEC", items: ["PlayStation Store", "Xbox Store", "Rockstar's own site", "4 official videos"], at2: [3.7, 5.8, 7.5, 9.2] },
  { at: 86.8, k: "big", ch: "1", value: "6,450,000", label: "preorders already paid", sub: "no published performance spec of any kind", color: "yellow" },
  // 2 · WHAT HE SAID ABOUT 60
  { at: 92.9, k: "chapter", n: "2", title: "WHAT HE SAID ABOUT 60", ch: "2" },
  { at: 96.4, k: "options", ch: "2", title: "ROB NELSON, ASKED ABOUT 60 FPS", items: [{ k: "AT LAUNCH", t: "“The tech team would have to confirm that.”", costLabel: "", cost: "", at: 0.3 }, { k: "AFTER LAUNCH", t: "“The tech team would have to confirm.”", costLabel: "", cost: "", at: 7.2, color: "cyan" }] },
  { at: 120.3, k: "list", ch: "2", items: ["Shipping a 60 mode? Say it. Loudly.", "Definitely none? Say that too."], start: 0.2, every: 4.7, size: 72, sub: "He said neither. Twice.", subAt: 8.3 },
  { at: 130.0, k: "big", ch: "2", value: "60 FPS?", label: "the least committal answer available — both times", color: "yellow" },
  // 3 · WHAT THE ANALYSTS MEASURED
  { at: 136.4, k: "chapter", n: "3", title: "WHAT THE ANALYSTS MEASURED", ch: "3" },
  { at: 140.8, k: "big", ch: "3", value: "1440p / 30", label: "Digital Foundry, from the official footage", sub: "compressed YouTube video — and they said so", color: "cyan", stamp: "ESTIMATE", stampAt: 2.8 },
  { at: 152.3, k: "big", ch: "3", value: "MATCHES NELSON", label: "the strongest reason to believe both", color: "green" },
  { at: 157.5, k: "badge", ch: "3", text: "CAPTURED ON PS5", sub: "Extended Look + Launch Trailer · base PS5, not Pro" },
  { at: 168.6, k: "big", ch: "3", value: "BASE PS5 · ~1440p · 30", label: "what you've been watching for two months", color: "cyan", stamp: "ESTIMATE", stampAt: 1.2 },
  { at: 175.3, k: "clear", ch: "3" },
  // 4 · WHY THE PRO CAN'T SAVE YOU (one diagram for the whole argument)
  { at: 178.7, k: "chapter", n: "4", title: "WHY THE PRO CAN'T SAVE YOU", ch: "4" },
  {
    at: 184.0, k: "cpugpu", ch: "4", gpuAt: 0.3, cpuAt: 10.7,
    load: [{ t: "Pedestrians", at: 11.8 }, { t: "Traffic", at: 13.8 }, { t: "Physics", at: 15.6 }, { t: "Audio", at: 16.3 }, { t: "Scripts", at: 17.5 }, { t: "AI", at: 18.2 }, { t: "Streaming", at: 18.7 }],
    barsAt: 25.1, gpuBarAt: 26.7, cpuBarAt: 29.0, fractionalAt: 30.9, bottleneckAt: 36.0, verdictAt: 43.6,
  },
  { at: 230.7, k: "quote", ch: "4", text: "Feels like a bridge too far.", who: "One analyst, on 60 fps", src: "" },
  { at: 234.6, k: "big", ch: "4", value: "$899.99", label: "spent on the half of the machine that isn't the bottleneck", color: "yellow", strikeAt: 1.6 },
  // 5 · THE BADGE
  { at: 243.1, k: "chapter", n: "5", title: "THE BADGE", ch: "5" },
  { at: 245.7, k: "badge", ch: "5", text: "PS5 PRO ENHANCED", sub: "listed on the PlayStation Store" },
  { at: 249.3, k: "checklist", ch: "5", title: "WHAT IS THE ENHANCEMENT?", items: ["Resolution?", "Ray tracing?", "Frame rate?"], at2: [2.8, 3.6, 4.3], mode: "q" },
  { at: 256.8, k: "list", ch: "5", title: "MY GUESS · NOT ROCKSTAR'S", items: ["Sharper image", "Cleaner reflections", "Maybe better shadows", "At 30."], start: 4.9, every: 1.0 },
  { at: 265.5, k: "big", ch: "5", value: "A GUESS", label: "mine, not Rockstar's — but the hardware supports it", color: "yellow" },
  // 6 · FORTY
  { at: 270.6, k: "chapter", n: "6", title: "FORTY", ch: "6" },
  { at: 272.7, k: "strip", ch: "6", title: "WHERE THE COMMUNITY LANDED", items: [{ v: "30", label: "Confirmed in dev" }, { v: "40", label: "The realistic hope", hi: true }, { v: "60", label: "?", q: true }] },
  { at: 279.1, k: "bars", ch: "6", title: "TIME EACH FRAME IS ON SCREEN", unit: "ms", items: [{ label: "30 fps", value: 33, max: 33, color: "cyan", appear: 2.0 }, { label: "40 fps", value: 25, max: 33, color: "pink", appear: 6.7 }] },
  { at: 288.5, k: "list", ch: "6", title: "GATE 1 · THE PANEL", items: ["40 fps needs a 120 Hz display", "60 Hz TV → the mode does nothing"], start: 2.5, every: 5.9 },
  { at: 299.0, k: "list", ch: "6", title: "GATE 2 · VRR", items: ["120 Hz + variable refresh rate", "Two separate things", "VRR can be off without you noticing"], start: 3.0, every: 4.8 },
  { at: 316.1, k: "list", ch: "6", title: "TWO CHECKS, NOT ONE", items: ["☐ Does your TV do 120 Hz?", "☐ Is VRR actually on?"], start: 1.9, every: 2.0, sub: "Check your TV, not your console.", subAt: 13.9 },
  { at: 334.0, k: "big", ch: "6", value: "40 FPS MODE", label: "not announced by Rockstar", sub: "what the hardware people hope for — not news", color: "pink", stamp: "UNCONFIRMED", stampAt: 1.0 },
  // 7 · THE TWO-MODES LEAK
  { at: 344.0, k: "chapter", n: "7", title: "THE TWO-MODES LEAK", ch: "7" },
  { at: 347.1, k: "strip", ch: "7", title: "A LEAK CLAIMS", items: [{ v: "30", label: "Quality" }, { v: "60", label: "Performance" }], stamp: "LEAK / UNVERIFIED", stampAt: 4.5 },
  { at: 360.6, k: "options", ch: "7", title: "WHICH WOULD YOU BET ON?", items: [{ k: "NAMED · ON THE RECORD", t: "Co-head of Rockstar North: would not confirm 60 — twice", costLabel: "", cost: "", at: 1.9 }, { k: "ANONYMOUS", t: "A leak: 60 is already in there", costLabel: "", cost: "", at: 6.6, color: "yellow" }] },
  // 8 · THE ENGINE
  { at: 374.6, k: "chapter", n: "8", title: "THE ENGINE", ch: "8" },
  { at: 378.1, k: "big", ch: "8", value: "RAGE 9", label: "the name you've heard", color: "cyan", stamp: "UNCONFIRMED", stampAt: 4.1 },
  { at: 383.9, k: "list", ch: "8", title: "“THE SPEC SHEET”", items: ["Real-time ray tracing", "Global illumination", "Volumetric lighting", "Advanced water rendering"], start: 0.4, every: 1.9, size: 58, tag: "NOT FROM ROCKSTAR", tagDelay: 0.5, sub: "community description that hardened into fact", subAt: 9.3 },
  { at: 397.4, k: "big", ch: "8", value: "WRITTEN BY NOBODY", label: "that is how a spec sheet happens", color: "yellow" },
  { at: 400.8, k: "big", ch: "8", value: "IT MIGHT DO ALL OF IT", label: "nobody at Rockstar has told you it does", color: "cyan" },
  { at: 408.7, k: "quote", ch: "8", text: "GTA 6's technology will cut the development time of Rockstar's next games.", who: "Aaron Garbut & Phil Hooker, Rockstar", src: "named, on the record · paraphrased" },
  // 9 · THE CASE FOR 30
  { at: 426.6, k: "chapter", n: "9", title: "THE CASE FOR 30", ch: "9" },
  { at: 431.2, k: "big", ch: "9", value: "RED DEAD 2: 30 FPS", label: "still one of the best-looking games ever made", sub: "nobody remembers it as “the 30 fps game”", color: "pink" },
  { at: 440.7, k: "quote", ch: "9", text: "Starting with constraints and then expanding is always better.", who: "A former Rockstar producer", src: "on building for consoles first · paraphrased" },
  { at: 449.1, k: "big", ch: "9", value: "NOT A COPE", label: "it's why their console games hold up", color: "green" },
  { at: 452.5, k: "timeline", ch: "9", title: "THE REAL SHAPE", dates: [{ d: "CONSOLE 2026", l: "30 fps", at: 0 }, { d: "PC 2027?", l: "60 fps+", s: "GamesBeat · 4 sources · insider report", at: 1.0, hi: true }] },
  // PAYOFF + CLOSE (table stays up to the end)
  {
    at: 475.4, k: "confidence", title: "HOW SURE ANYONE CAN BE",
    rows: [
      { t: "30 fps on console at launch", c: "VERY LIKELY", color: "green", at: 4.6 },
      { t: "~1440p on a base PS5", c: "LIKELY", color: "cyan", at: 12.3 },
      { t: "A 60 fps mode at launch", c: "VERY UNLIKELY", color: "red", at: 18.1 },
      { t: "A 40 fps mode", c: "POSSIBLE · needs 120 Hz + VRR", color: "yellow", at: 23.1 },
      { t: "The engine (even its name)", c: "UNCONFIRMED", color: "dim", at: 30.8 },
      { t: "Pro Enhanced = sharper, same 30", c: "MY READ", color: "pink", at: 35.2 },
      { t: "An official spec before launch", c: "DON'T HOLD YOUR BREATH", color: "red", at: 41.0 },
    ],
    endCard: "NOV 19 — GAMEPLAY, THIS CHANNEL", endAt: 62.0,
  },
];

export const V3: VideoData = {
  scenes, captions, footage, voEnd: 546.1, vo: "audio/vo3.wav",
  chips: { "1": "1 · THE ONE NUMBER", "2": "2 · WHAT HE SAID ABOUT 60", "3": "3 · WHAT THE ANALYSTS MEASURED", "4": "4 · WHY THE PRO CAN'T SAVE YOU", "5": "5 · THE BADGE", "6": "6 · FORTY", "7": "7 · THE TWO-MODES LEAK", "8": "8 · THE ENGINE", "9": "9 · THE CASE FOR 30" },
};
