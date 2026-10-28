import React from "react";
import { Composition } from "remotion";
import { GtaVideo, TOTAL } from "./Video";

export const Root: React.FC = () => (
  <Composition id="Video1" component={GtaVideo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
);
