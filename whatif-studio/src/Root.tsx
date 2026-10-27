import React from "react";
import { Composition } from "remotion";
import { WhatIfVideo } from "./Video";
import { Sheet } from "./Sheet";
import demoA from "./data/demoA.json";
import demoB from "./data/demoB.json";
import demoB2 from "./data/demoB2.json";

export const Root: React.FC = () => (
  <>
    <Composition id="DemoA" component={WhatIfVideo} durationInFrames={demoA.total} fps={30} width={1920} height={1080} defaultProps={{ data: demoA }} />
    <Composition id="DemoB" component={WhatIfVideo} durationInFrames={demoB.total} fps={30} width={1920} height={1080} defaultProps={{ data: demoB }} />
    <Composition id="DemoB2" component={WhatIfVideo} durationInFrames={demoB2.total} fps={30} width={1920} height={1080} defaultProps={{ data: demoB2 }} />
    <Composition id="Sheet" component={Sheet} durationInFrames={2} fps={30} width={1920} height={1080} />
  </>
);
