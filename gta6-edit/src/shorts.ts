// The Shorts cut from each long video (composition ids Short1..Short3).
import { ShortSpec } from "./Short";
import { V1 } from "./v1";
import { V2 } from "./v2";
import { V3 } from "./v3";

export const SHORTS: Record<string, ShortSpec> = {
  Short1: {
    data: V1, kicker: "GTA 6 · STILL UNCONFIRMED", title: "THE FILE SIZE",
    clips: [
      [0, 2.85],      // "Why will nobody tell you how big GTA 6 is?"
      [41.15, 90.5],  // 87 GB -> 210 GB leak -> fake 676.7 GB -> Series S can't fit it -> Rockstar still silent
      [20.38, 22.1],  // "and that is number one of 13."
    ],
    end: { big: "12", line: ["MORE THINGS ROCKSTAR", "STILL HASN'T TOLD US"] },
  },
  Short2: {
    data: V2, kicker: "GTA 6 · PRE-ORDER BONUS", title: "THE 4TH DATE",
    clips: [
      [0, 13.15],       // "Stop. Before you preload ... still get the bonus."
      [402.6, 443.15],  // the Vintage Vice City Pack, "before November 20th", the other order, "nobody is advertising that"
    ],
    end: { big: "12 · 18 · 19", line: ["WHAT EACH DATE DOES", "AND WHAT WAITING COSTS"] },
    cardScale: 0.78,
  },
  Short3: {
    data: V3, kicker: "GTA 6 · FRAME RATE", title: "PS5 PRO ≠ 60 FPS",
    clips: [
      [179.9, 230.7],   // "Why a $900 PS5 Pro does not fix this." -> GPU vs CPU -> "a better looking 30. Not a 60."
      [234.65, 242.4],  // "That is why I would not buy a Pro ... not the bottleneck."
    ],
    end: { big: "30", line: ["THE ONLY FRAME RATE", "ON RECORD — AND WHO SAID IT"] },
    cta: 3.0, cardScale: 0.72,
  },
};
