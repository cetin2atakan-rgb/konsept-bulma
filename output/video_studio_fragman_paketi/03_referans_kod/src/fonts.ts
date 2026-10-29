import { staticFile, continueRender, delayRender } from "remotion";

const faces: [string, string, string][] = [
  ["Oswald", "fonts/oswald-latin-500-normal.woff2", "500"],
  ["Oswald", "fonts/oswald-latin-700-normal.woff2", "700"],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("fonts");
  Promise.all(
    faces.map(([family, file, weight]) => {
      const f = new FontFace(family, `url(${staticFile(file)})`, { weight });
      document.fonts.add(f);
      return f.load();
    })
  ).then(() => continueRender(handle));
};
