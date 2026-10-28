// Video 2: "The GTA 6 Preload Trap (And How To Get Out Of It)". Shot list timed (seconds) to public/audio/vo2.wav
// via the forced-aligned captions in ./captions.json. Each scene runs until the next one starts.
import { VideoData } from "../Video";
import { Scene } from "../scenes";
import captions from "./captions.json";
import footage from "./footage.json";

const TERMS = [
  "Pre-order Grand Theft Auto VI to receive the Vintage Vice City Pack.",
  "Includes the '55 Vapid Stanier, a Shore Court garage and vintage outfits.",
  "Available for purchases made before November 20, 2026.",
  "See the store page for full offer details.",
];
const D12 = { d: "NOV 12", l: "Preload", at: 0 };
const D18 = { d: "NOV 18", l: "Reviews?", s: "insiders — unconfirmed", at: 0, hi: true };
const D19 = { d: "NOV 19", l: "Unlocks", at: 0 };

const scenes: Scene[] = [
  // HOOK
  { at: 0, k: "days", title: "NOVEMBER 2026", marks: [{ d: 12, color: "red", at: 0.4 }, { d: 19, color: "red", at: 0.8 }, { d: 20, color: "cyan", l: "?", at: 3.0 }] },
  { at: 5.6, k: "terms", lines: TERMS, hi: 2, circleAt: 6.0, foot: "the Rockstar Store pre-order terms" },
  // THE TURN
  { at: 13.2, k: "big", value: "3 DATES", label: "that is the whole video", color: "pink" },
  { at: 15.2, k: "timeline", title: "THREE DATES", dates: [{ d: "NOV 12", l: "You install it", at: 0 }, { d: "NOV 18", l: "First reviews?", at: 1.65, hi: true }, { d: "NOV 19", l: "It unlocks", at: 4.4 }] },
  { at: 20.6, k: "big", value: "6,450,000", label: "people already paid", sub: "before any review exists", color: "yellow" },
  { at: 27.5, k: "timeline", title: "THE CALENDAR", dates: [D12, D18, D19, { d: "NOV 20", l: "?", at: 4.0, ok: true }] },
  { at: 35.0, k: "big", value: "NO OUTRAGE.", label: "Just the calendar.", color: "cyan" },
  // BEAT 1 · PRELOAD
  { at: 36.9, k: "chapter", n: "NOV 12", title: "PRELOAD OPENS", ch: "12" },
  { at: 40.1, k: "badge", ch: "12", text: "7-DAY PRE-LOAD", sub: "PlayStation's own listing" },
  { at: 45.5, k: "bars", ch: "12", title: "DOWNLOADED. LOCKED.", unit: "%", items: [{ label: "GTA VI · pre-loaded", value: 100, max: 100, color: "cyan" }], warn: "PLAYABLE: NOV 19", warnAt: 2.2 },
  { at: 50.1, k: "big", ch: "12", value: "BUYS YOU NOTHING", label: "except not downloading on launch day", color: "yellow" },
  { at: 52.7, k: "post", ch: "12", handle: "@PlaystationSize", body: "GTA 6 file size: 210 GB", stamp: "LEAK · NOT OFFICIAL", stampAt: 6.8 },
  { at: 62.7, k: "big", ch: "12", value: "NOV 12 · ??:??", label: "what time preload opens — not announced", color: "yellow" },
  { at: 67.2, k: "box", ch: "12", label: "GTA VI · PHYSICAL", price: "NOV 12", items: ["On shelves Nov 12", "No disc in the box", "Just a download code"], red: 1 },
  { at: 77.4, k: "big", ch: "12", value: "NO LENDING. NO TRADE-IN.", label: "the box is a download code", color: "red" },
  // BEAT 2 · STORAGE
  { at: 82.9, k: "chapter", n: "NOV 12", title: "WHERE 210 GB LIVES", ch: "st" },
  { at: 87.3, k: "list", ch: "st", title: "PS5", items: ["External USB: storage only ✗", "Internal SSD ✓", "M.2 drive inside the console ✓"], start: 4.2, every: 3.7, sub: "The USB trick does not work for this one.", subAt: 16.4 },
  { at: 108.0, k: "list", ch: "st", title: "XBOX", items: ["Internal storage ✓", "Official expansion card ✓", "Nothing else ✗"], start: 0.2, every: 2.2 },
  { at: 113.4, k: "bars", ch: "st", title: "FREE SPACE YOU NEED", unit: "GB", items: [{ label: "Base install · 150–200 (VGTimes)", value: 200, max: 250, color: "pink", appear: 3.4 }, { label: "Keep free · day one patch", value: 250, max: 250, color: "yellow", appear: 7.4 }] },
  { at: 124.9, k: "bars", ch: "st", title: "CHECK TODAY, NOT ON THE 12TH", unit: "GB", items: [{ label: "Free on your console", value: 180, max: 250, color: "cyan" }, { label: "GTA VI (leak)", value: 210, max: 250, color: "pink", appear: 1.0 }], warn: "30 GB SHORT", warnAt: 3.2 },
  { at: 129.8, k: "big", ch: "st", value: "MIDNIGHT, NOV 12", label: "uninstalling four games before you can start", color: "red" },
  { at: 135.8, k: "big", ch: "st", value: "OFFICIAL SIZE: ?", label: "fans expected it in late October", sub: "Game Rant: “pure speculation”", color: "yellow" },
  { at: 147.2, k: "big", ch: "st", value: "SIZE IT OFF THE LEAK", label: "and leave yourself room", sub: "not off a number that may never arrive", color: "cyan" },
  // BEAT 3 · REVIEWS
  { at: 156.0, k: "chapter", n: "NOV 18", title: "THE REVIEWS", ch: "18" },
  { at: 159.7, k: "checklist", ch: "18", title: "ROCKSTAR HAS CONFIRMED", items: ["Review embargo date", "Embargo time", "That review copies exist"], at2: [2.4, 3.4, 4.6] },
  { at: 165.4, k: "post", ch: "18", name: "NateTheHate", handle: "insider", body: "Review code is out. Embargo lifts Nov 18.", foot: "insider report · paraphrased", stamp: "INSIDER / UNCONFIRMED", stampAt: 1.6 },
  { at: 171.6, k: "post", ch: "18", name: "Insider Gaming", handle: "insider outlet", body: "Confirmed independently: Nov 18, ~6–7 AM ET", foot: "insider report · paraphrased", stamp: "INSIDER / UNCONFIRMED", stampAt: 0.8 },
  { at: 177.5, k: "big", ch: "18", value: "NEITHER IS ROCKSTAR", label: "decent track records — still insiders", color: "yellow" },
  { at: 182.0, k: "big", ch: "18", value: "BEFORE NOV 19", label: "Insider Gaming, Oct 14 — no day named", sub: "because the day could still move", color: "cyan" },
  { at: 191.1, k: "list", ch: "18", title: "ALSO REPORTED", items: ["Different regional windows", "Some outlets held until launch day"], start: 0.2, every: 3.6 },
  { at: 198.0, k: "timeline", ch: "18", title: "THE CALENDAR", dates: [D12, { ...D18, q: 0.6 }, D19] },
  // BEAT 4 · IS IT SINISTER
  { at: 206.4, k: "chapter", n: "", title: "IS IT SINISTER?", ch: "fair" },
  { at: 209.9, k: "list", ch: "fair", title: "NORMAL FOR BIG GAMES", items: ["Reviews the day before launch", "Review copies about a month early"], start: 0.4, every: 7.0, sub: "The embargo on its own is not the story.", subAt: 12.3 },
  { at: 224.3, k: "big", ch: "fair", value: "THE COMBINATION", label: "is the story", color: "pink" },
  { at: 226.2, k: "days", ch: "fair", title: "THE GAP", from: 10, to: 21, marks: [{ d: 12, l: "PRELOAD", color: "pink", at: 0.2 }, { d: 18, l: "REVIEWS?", color: "yellow", at: 1.2 }, { d: 19, l: "UNLOCK", color: "cyan", at: 2.0, up: true }], range: { a: 12, b: 17, label: "6 DAYS · MONEY IN, NO REVIEWS", color: "red", at: 10.3 }, sub: "210 GB on your console. The money is gone.", subAt: 12.4 },
  { at: 242.6, k: "big", ch: "fair", value: "NOT A CONSPIRACY", label: "a schedule that works for Rockstar, not for you", color: "cyan" },
  { at: 247.8, k: "big", ch: "fair", value: "“THE PRELOAD CATCH”", label: "money first, information second", color: "yellow" },
  { at: 252.7, k: "timeline", ch: "fair", title: "THE FOURTH DATE", dates: [D12, D18, D19, { d: "NOV 20", l: "?", at: 3.1, ok: true }] },
  // BEAT 5 · THE MONEY
  { at: 259.4, k: "chapter", n: "", title: "THE MONEY", ch: "money" },
  { at: 261.8, k: "facts", ch: "money", items: ["6,450,000 digital preorders", "$630,000,000", "74% on PlayStation"], every: 2.45 },
  { at: 270.9, k: "bars", ch: "money", title: "PREORDERS · OUTSIDE ESTIMATES", unit: "million $", items: [{ label: "July · first week (Newzoo)", value: 260, max: 630, color: "cyan", appear: 3.9 }, { label: "By October (tracking)", value: 630, max: 630, color: "pink", appear: 11.5 }] },
  { at: 284.8, k: "big", ch: "money", value: "NO REVIEW NEEDED", label: "to spend any of it", color: "yellow" },
  { at: 286.9, k: "big", ch: "money", value: "OUTSIDE ESTIMATES", label: "Rockstar has never published a preorder number", color: "cyan", stamp: "NOT ROCKSTAR", stampAt: 2.0 },
  { at: 296.9, k: "big", ch: "money", value: "WHY PUBLISH EARLIER?", label: "6.45M will pay before the information exists", color: "yellow" },
  { at: 303.4, k: "donut", ch: "money", pct: 89, label: "ULTIMATE · $100", other: "August preorders · Standard $80: 11%" },
  { at: 309.9, k: "list", ch: "money", title: "JUNE · THE $80 PRICE", items: ["Real backlash.", "People were angry.", "Then they bought the $100 one."], start: 3.1, every: 1.6 },
  { at: 318.3, k: "quote", ch: "money", text: "Unprecedented and astonishing.", who: "Strauss Zelnick, Take-Two CEO · August", src: "asked about preorder numbers — gave none" },
  { at: 325.9, k: "list", ch: "money", items: ["Unprecedented.", "Astonishing.", "Unspecified."], start: 0.3, every: 0.8, size: 110, sub: "for a product nobody outside the building has played", subAt: 2.7 },
  // BEAT 6 · EDITIONS
  { at: 331.0, k: "chapter", n: "", title: "TWO EDITIONS", ch: "ed" },
  { at: 333.8, k: "cards", ch: "ed", title: "THAT IS ALL THERE IS", items: [{ v: "$80", t: "Standard", s: "", at: 2.2 }, { v: "$100", t: "Ultimate", s: "89% of August preorders", at: 3.4 }] },
  { at: 339.4, k: "checklist", ch: "ed", title: "NOT THIS TIME", items: ["Deluxe tier", "Special Edition", "Physical collector's box"], at2: [0.2, 1.4, 2.4] },
  { at: 343.2, k: "list", ch: "ed", items: ["GTA 5 had one.", "Red Dead 2 had one.", "GTA 6 does not."], start: 0.1, every: 1.4, size: 90 },
  { at: 346.9, k: "box", ch: "ed", label: "VICE CITY COLLECTION", price: "$400", items: ["Merchandise", "The game is not in it", "Ships from Nov 19"], red: 1 },
  { at: 355.2, k: "list", ch: "ed", title: "THE EXTRA $20 · PREMIUM VEHICLES", items: ["'95 Grotti Cheetah", "Shitzu Squalo", "'67 Vapid Dominator Buggy"], start: 2.1, every: 1.6 },
  { at: 362.4, k: "big", ch: "ed", value: "PERSONALISED WEAPONS", label: "for Jason and Lucia", color: "cyan" },
  { at: 364.4, k: "list", ch: "ed", title: "4 BUSINESSES · ULTIMATE ONLY", items: ["Rideout Customs", "Sara's Salon", "Stock 305", "Electric Fang Tattoo"], start: 3.3, every: 1.0, sub: "The cars are cars. The businesses are content.", subAt: 9.5 },
  { at: 376.7, k: "big", ch: "ed", value: "ULTIMATE UPGRADE: $20", label: "Rockstar also sells it on its own", color: "pink" },
  { at: 383.5, k: "big", ch: "ed", value: "$80 + $20 = $100", label: "Standard now, upgrade later", sub: "if it is still there", color: "yellow" },
  { at: 388.3, k: "big", ch: "ed", value: "AFTER LAUNCH?", label: "Rockstar hasn't said if the $20 upgrade stays on sale", sub: "Check the store page before you lean on it", color: "yellow", stamp: "UNCONFIRMED", stampAt: 2.0 },
  // BEAT 7 · THE 20TH
  { at: 400.4, k: "chapter", n: "NOV 20", title: "THE FOURTH DATE", ch: "20" },
  { at: 402.6, k: "list", ch: "20", title: "VINTAGE VICE CITY PACK", items: ["'55 Vapid Stanier", "Shore Court garage · weapon locker · fence", "Vintage outfits"], start: 4.6, every: 2.0, sub: "the preorder bonus", subAt: 1.0 },
  { at: 412.4, k: "terms", ch: "20", lines: TERMS, hi: 2, circleAt: 0.4, zoomAt: 1.9, zoom: "November 20, 2026", foot: "check the live terms page yourself" },
  { at: 417.3, k: "big", ch: "20", value: "NOT BEFORE LAUNCH", label: "before the 20th", color: "pink" },
  { at: 419.4, k: "timeline", ch: "20", title: "THE WINDOW", dates: [D12, D18, D19, { d: "NOV 20", l: "Bonus deadline", at: 0.2, ok: true, tick: 2.2 }] },
  { at: 424.5, k: "big", ch: "20", value: "PREORDER BLIND → PRELOAD → HOPE", label: "is not the only order", color: "red" },
  { at: 431.7, k: "timeline", ch: "20", title: "THE OTHER ORDER", dates: [{ d: "NOV 18", l: "Read reviews", at: 0, hi: true }, { d: "NOV 19", l: "Watch streams", at: 1.95 }, { d: "NOV 20", l: "Buy · bonus kept", at: 4.2, ok: true, tick: 6.5 }] },
  { at: 440.2, k: "big", ch: "20", value: "NOBODY IS ADVERTISING THAT", label: "for fairly obvious reasons", color: "cyan" },
  // BEAT 8 · WHAT WAITING COSTS
  { at: 443.2, k: "chapter", n: "", title: "WHAT WAITING COSTS", ch: "cost" },
  { at: 447.1, k: "big", ch: "cost", value: "GTA+ · 1 MONTH FREE", label: "for digital preorders", color: "yellow", stamp: "LOST IF YOU WAIT", stampAt: 3.1 },
  { at: 451.3, k: "bars", ch: "cost", title: "LAUNCH DAY DOWNLOAD", unit: "%", items: [{ label: "GTA VI · 200-odd GB", value: 2, max: 100, color: "red" }], warn: "EVERY PS5 ON EARTH · SAME FILE", warnAt: 4.0 },
  { at: 461.4, k: "list", ch: "cost", title: "CANCELLING A PREORDER", items: ["PlayStation Store: up to launch", "Microsoft Store: up to launch", "Amazon · GameStop · Fnac · Micromania: until it ships"], start: 2.2, every: 2.3, size: 54 },
  { at: 477.0, k: "big", ch: "cost", value: "~14 STORES", label: "not the same rules", sub: "the console stores are the forgiving place", color: "cyan" },
  { at: 487.9, k: "options", ch: "cost", title: "THE HONEST TRADE", items: [{ k: "PRELOAD", t: "Launch night, day one", cost: "The information", at: 1.8 }, { k: "WAIT", t: "Reviews first, buy by Nov 20", cost: "A GTA+ month · a slow launch day", at: 3.3, color: "cyan" }] },
  // PAYOFF + CLOSE (cards stay up to the end)
  { at: 499.4, k: "chapter", n: "", title: "THE WAY OUT" },
  { at: 502.4, k: "options", title: "PICK YOURS", items: [{ k: "LAUNCH NIGHT", t: "Keep the preorder. Preload Nov 12.", cost: "Reading reviews before you play", at: 0.2 }, { k: "REVIEWS + BONUS", t: "Read reviews Nov 18. Buy by Nov 20.", cost: "A GTA+ month · a fast install", at: 6.8, color: "cyan" }, { k: "WANT OUT", t: "Cancel on PlayStation or Xbox until launch", cost: "Nothing", at: 26.0, color: "yellow" }] },
];

export const V2: VideoData = {
  scenes, captions, footage, voEnd: 549.0, vo: "audio/vo2.wav",
  chips: { "12": "NOV 12 · PRELOAD", st: "NOV 12 · STORAGE", "18": "NOV 18 · REVIEWS?", fair: "IS IT SINISTER?", money: "THE MONEY ALREADY IN", ed: "TWO EDITIONS", "20": "NOV 20 · THE BONUS", cost: "WHAT WAITING COSTS" },
};
