// Shot list for Video 1, timed (seconds) to the voiceover in public/audio/vo.wav.
// Each scene runs until the next one starts. `ch` = which of the 13 the viewer is on.
export type Scene = { at: number; k: string; ch?: string; [key: string]: any };

export const VO_END = 485.1;

export const scenes: Scene[] = [
  // HOOK
  { at: 0, k: "title", kicker: "GTA VI", text: "Why will nobody tell you\nhow big GTA 6 is?" },
  { at: 2.9, k: "big", value: "22", label: "DAYS LEFT", color: "pink" },
  { at: 5.2, k: "store", note: "" },
  { at: 10.2, k: "post", handle: "@PlaystationSize", body: "GTA 6 file size: 210 GB", stampAt: 3.2, stamp: "NOT ROCKSTAR" },
  // THE TURN
  { at: 15.4, k: "bars", title: "YOUR CONSOLE", items: [{ label: "Used", value: 780, max: 825, color: "red" }], unit: "GB", warn: "Clear 200 GB for a size nobody confirmed?" },
  { at: 20.4, k: "big", value: "#1", label: "OF 13", color: "cyan" },
  { at: 22.9, k: "flash", items: ["Rockstar Newswire", "Trailer 1 + 2", "Take-Two investor calls", "Extended Look"], every: 0.9 },
  { at: 32.3, k: "list13", blur: true, hi: 10 },
  // 1 FILE SIZE
  { at: 38.2, k: "chapter", n: "1", title: "THE FILE SIZE", ch: "1" },
  { at: 41.2, k: "bars", ch: "1", title: "INSTALL SIZE", unit: "GB", items: [{ label: "GTA V · PS5", value: 87, max: 220, color: "cyan" }, { label: "GTA VI", value: 0, max: 220, color: "pink", q: true, appear: 3.6 }] },
  { at: 47.0, k: "big", ch: "1", value: "210 GB", label: "PlayStation Game Size account", sub: "Usually right. Still not Rockstar.", color: "yellow", stamp: "LEAK", stampAt: 4.3 },
  { at: 53.9, k: "big", ch: "1", value: "676.7 GB", label: "“install on your home Xbox One”", sub: "GTA 6 is not coming to Xbox One.", color: "red", stamp: "FAKE", stampAt: 3.9 },
  { at: 65.6, k: "bars", ch: "1", title: "XBOX SERIES S", unit: "GB", items: [{ label: "On the box", value: 512, max: 512, color: "cyan" }, { label: "Actually usable", value: 364, max: 512, color: "yellow", appear: 5.4 }] },
  { at: 73.8, k: "bars", ch: "1", title: "SERIES S · 364 GB USABLE", unit: "GB", items: [{ label: "GTA VI (leak)", value: 210, max: 364, color: "pink" }, { label: "+ day one patch", value: 364, max: 364, color: "red", q: true, appear: 1.8 }], warn: "NOT ENOUGH SPACE", warnAt: 5.5 },
  { at: 83.3, k: "big", ch: "1", value: "250 GB", label: "leave this much free, to be safe", sub: "One estimate.", color: "cyan" },
  { at: 87.0, k: "store", ch: "1", note: "22 days. Still no number." },
  // 2 FRAME RATE
  { at: 90.6, k: "chapter", n: "2", title: "THE FRAME RATE", ch: "2" },
  { at: 92.7, k: "big", ch: "2", value: "30", label: "FPS — the only number on record", color: "cyan" },
  { at: 95.2, k: "quote", ch: "2", text: "The tech team would have to confirm that.", who: "Rob Nelson, co-head of Rockstar North", src: "to YouTuber Davy Jones, on 60 fps" },
  { at: 106.5, k: "big", ch: "2", value: "SAME ANSWER", label: "asked about a 60 fps option after launch", color: "yellow" },
  { at: 110.4, k: "big", ch: "2", value: "1", label: "conversation with a YouTuber", sub: "= the entire official record on performance", color: "pink" },
  { at: 115.5, k: "big", ch: "2", value: "1440p / 30", label: "Digital Foundry, from official footage", color: "cyan", stamp: "ESTIMATE", stampAt: 4.6 },
  { at: 122.6, k: "strip", ch: "2", title: "ONE LEAK CLAIMS", items: [{ v: "30", label: "Quality" }, { v: "60", label: "Performance" }], stamp: "NOTHING SUPPORTS IT", stampAt: 3.5 },
  { at: 127.4, k: "strip", ch: "2", title: "WHERE THE COMMUNITY LANDED", items: [{ v: "30", label: "Confirmed in dev" }, { v: "40", label: "120 Hz mode?", hi: true }, { v: "60", label: "?", q: true }] },
  { at: 132.4, k: "quote", ch: "2", text: "Feels like a bridge too far.", who: "One analyst, on 60 fps", src: "" },
  { at: 136.9, k: "checklist", ch: "2", title: "PUBLISHED PERFORMANCE SPEC", items: ["Resolution", "Frame rate", "Modes"], at2: [3.5, 4.6, 5.5] },
  // 3 PS5 PRO
  { at: 143.2, k: "chapter", n: "3", title: "“PS5 PRO ENHANCED”", ch: "3" },
  { at: 145.2, k: "badge", ch: "3", text: "PS5 PRO ENHANCED", sub: "listed on the product page" },
  { at: 149.0, k: "checklist", ch: "3", title: "WHAT IS THE ENHANCEMENT?", items: ["Resolution?", "Ray tracing?", "Frame rate?"], at2: [4.0, 5.2, 6.0], mode: "q" },
  { at: 155.7, k: "badge", ch: "3", text: "PS5 PRO ENHANCED", sub: "behind the badge: nothing", empty: true },
  { at: 159.6, k: "big", ch: "3", value: "CAPTURED ON PS5", label: "Extended Look + Launch Trailer — base PS5, not Pro", color: "cyan" },
  { at: 166.9, k: "big", ch: "3", value: "$899.99", label: "PS5 Pro · hard to find · resale is worse", color: "yellow" },
  { at: 172.4, k: "badge", ch: "3", text: "PS5 PRO ENHANCED", sub: "a badge with no description", empty: true },
  // 4 VOICE CAST
  { at: 174.6, k: "chapter", n: "4", title: "THE VOICE CAST", ch: "4" },
  { at: 177.5, k: "big", ch: "4", value: "0", label: "cast members announced", sub: "22 days out", color: "red" },
  { at: 182.0, k: "flash", ch: "4", items: ["2 trailers", "27-min Extended Look", "A full album", "6 radio stations"], every: 1.15, end: "…and no lead voices." },
  { at: 187.3, k: "people", ch: "4", items: [{ name: "JASON", role: "VOICE: ?" }, { name: "LUCIA", role: "VOICE: ?" }] },
  { at: 190.6, k: "people", ch: "4", title: "OUTED THEMSELVES", items: [{ name: "Stephen Root", role: "told the AP: he's in it", tag: "Brian Heder? — role unconfirmed", tagAt: 6.8 }, { name: "Jim Santangeli", role: "TikTok live: “a small part”", tag: "which one? unknown", appear: 11.8 }] },
  { at: 208.1, k: "people", ch: "4", title: "NOT JASON", items: [{ name: "Troy Baker", role: "said publicly", tag: "DENIED", strike: true }, { name: "Roger Craig Smith", role: "said publicly", tag: "DENIED", strike: true }] },
  { at: 213.0, k: "people", ch: "4", items: [{ name: "LUCIA", role: "Manni L. Perez?", tag: "UNCONFIRMED — a dodge and a theory", tagAt: 3.4 }] },
  // 5 MAP
  { at: 220.6, k: "chapter", n: "5", title: "THE MAP", ch: "5" },
  { at: 225.3, k: "cards", ch: "5", title: "ALL FROM ROCKSTAR. ALL DIFFERENT.", items: [{ v: "3×", t: "Red Dead 2", s: "New York Times · Aug", at: 0 }, { v: "2×", t: "GTA V", s: "Aaron Garbut · Game Informer · Sep", at: 6.3 }, { v: "5×", t: "GTA V", s: "Game Informer cover story", at: 14.2 }] },
  { at: 252.2, k: "big", ch: "5", value: "MEASURED HOW?", label: "nobody said", color: "yellow" },
  { at: 254.2, k: "big", ch: "5", value: "NO OFFICIAL MAP", label: "never published. not once.", color: "red" },
  { at: 257.3, k: "box", ch: "5", price: "$400", items: ["The only full official view of Leonida", "is a poster in a merch box", "game not included", "ships on launch day"] },
  { at: 265.1, k: "regions", ch: "5", items: ["Vice City", "Leonida Keys", "Grassrivers", "Port Gellhorn", "Ambrosia", "Mount Kalaga"], stamp: "EVERY FULL MAP ONLINE = UNOFFICIAL", stampAt: 2.2 },
  // 6 + 7 PC, ONLINE
  { at: 271.6, k: "chapter", n: "6 + 7", title: "PC AND ONLINE", ch: "6" },
  { at: 275.9, k: "big", ch: "6", value: "PC: 2027?", label: "GamesBeat · Oct · four sources", sub: "Not confirmed by Rockstar", color: "cyan", stamp: "INSIDER REPORT", stampAt: 3.0 },
  { at: 284.2, k: "quote", ch: "6", text: "PC is not Rockstar's core audience.", who: "A Take-Two executive, May", src: "paraphrased" },
  { at: 289.3, k: "big", ch: "7", value: "ONLINE: NONE", label: "no online mode at launch — settled", color: "pink" },
  { at: 296.8, k: "rating", ch: "7", items: ["Blood and Gore", "Intense Violence", "Nudity", "Strong Language", "Strong Sexual Content", "Use of Drugs and Alcohol"], missing: "Users Interact", missAt: 3.2 },
  { at: 304.4, k: "quote", ch: "7", text: "Single player only.", who: "Strauss Zelnick, Take-Two", src: "September shareholder meeting" },
  { at: 310.9, k: "checklist", ch: "7", title: "GTA ONLINE SUCCESSOR", items: ["Name", "Date", "Price", "Player count", "Crossplay"], at2: [0.2, 1.5, 2.1, 2.9, 3.8] },
  { at: 316.4, k: "big", ch: "7", value: "MULTIPLAYER 2027?", label: "a Twitch CEO comment", sub: "Not Rockstar", color: "yellow", stamp: "UNCONFIRMED", stampAt: 4.2 },
  // 8 + 9 MUSIC, RADIO
  { at: 322.7, k: "chapter", n: "8", title: "THE MUSIC", ch: "8" },
  { at: 324.1, k: "grid", ch: "8", title: "GTA VI: THE ALBUM — 34 TRACKS", filled: [2, 4, 5, 6, 8, 10, 11, 19, 32], fillAt: 4.0, names: ["Travis Scott", "Cardi B", "Morgan Wallen", "Rauw Alejandro", "Justice", "Keith Richards"], namesAt: 4.0, sub: "25 still unknown", subAt: 11.4 },
  { at: 343.6, k: "chapter", n: "9", title: "THE RADIO", ch: "9" },
  { at: 346.9, k: "stations", ch: "9", items: ["Cocoteo", "Back Country", "Afro Bank FM", "The Chamber", "Flash FM", "Dirty South Classics"], extra: ["Classic Rock?", "Talk Radio?"], extraAt: 9.0 },
  // 10 BUDGET
  { at: 363.8, k: "chapter", n: "10", title: "THE BUDGET", ch: "10" },
  { at: 365.7, k: "counter", ch: "10", to: 2000000000, prefix: "$", label: "the rumour: $1.5–2 billion", xAt: 6.3, xLabel: "Oct 14: Rockstar denied $1.5B — gave no real number" },
  { at: 379.2, k: "bars", ch: "10", title: "ROCKSTAR STAFF", items: [{ label: "When Red Dead 2 shipped", value: 2500, max: 4711, color: "cyan" }, { label: "Worked on GTA VI · 12 offices", value: 4711, max: 4711, color: "pink" }], unit: "" },
  { at: 387.4, k: "quote", ch: "10", text: "At rock bottom.", who: "A Rockstar North developer, on morale", src: "after 34 people were let go, last October" },
  { at: 395.3, k: "big", ch: "10", value: "NO BUDGET NUMBER", label: "22 days out", color: "red" },
  // 11 12 13
  { at: 397.3, k: "chapter", n: "11 · 12 · 13", title: "RAPID FIRE", ch: "11" },
  { at: 400.3, k: "big", ch: "11", value: "DAY ONE PATCH: ?", label: "on top of the 210 GB nobody confirmed", color: "yellow" },
  { at: 405.6, k: "people", ch: "12", title: "WHO GIVES YOU MISSIONS?", items: [{ name: "Boobie Ike" }, { name: "Dre'Quan Priest" }, { name: "Raul Bautista" }, { name: "Brian Heder" }, { name: "Cal Hampton" }] },
  { at: 412.5, k: "big", ch: "13", value: "0", label: "returning characters confirmed", color: "red" },
  { at: 418.5, k: "cards", ch: "13", title: "EASTER EGGS — UNTIL ROCKSTAR SAYS OTHERWISE", items: [{ v: "⌖", t: "Vercetti Estate", s: "a gun sourced from it", at: 0 }, { v: "?", t: "Young Phil Cassidy?", s: "a guy in an Ammu-Nation ad", at: 2.5 }] },
  // PAYOFF
  { at: 429.3, k: "chapter", n: "", title: "THE CALENDAR" },
  { at: 431.6, k: "timeline", dates: [{ d: "NOV 12", l: "Preload opens", s: "7-day preload", at: 0 }, { d: "NOV 18", l: "Reviews?", s: "two insiders — unconfirmed", at: 6.7, hi: true }, { d: "NOV 19", l: "Unlocks", s: "", at: 16.9 }] },
  { at: 450.5, k: "timeline", recap: true, dates: [{ d: "NOV 12", l: "You install it", at: 0 }, { d: "NOV 18", l: "You find out if it's good", at: 2.6, hi: true }, { d: "JUNE", l: "Your money already left", at: 4.6, red: true }] },
  { at: 457.5, k: "facts", items: ["6.45M digital preorders", "$630,000,000 already paid", "89% ULTIMATE · $100"], every: 2.8 },
  { at: 466.4, k: "store", note: "You already bought it." },
  // CLOSE
  { at: 473.2, k: "list13", blur: false },
];

export const LIST13 = [
  "File size", "Frame rate", "PS5 Pro “enhanced”", "Voice cast", "Map size", "PC version", "Online",
  "The album", "The radio", "The budget", "Day one patch", "Who gives missions", "Cameos",
];
