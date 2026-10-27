import React from "react";
import { Composition } from "remotion";
import { WhatIfVideo } from "./Video";
import demoA from "./data/demoA.json";
import demoB from "./data/demoB.json";

export const Root: React.FC = () => (
  <>
    <Composition id="DemoA" component={WhatIfVideo} durationInFrames={demoA.total} fps={30} width={1920} height={1080} defaultProps={{ data: demoA }} />
    <Composition id="DemoB" component={WhatIfVideo} durationInFrames={demoB.total} fps={30} width={1920} height={1080} defaultProps={{ data: demoB }} />
  </>
);
