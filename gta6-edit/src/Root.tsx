import React from "react";
import { Composition } from "remotion";
import { GtaVideo, TOTAL } from "./Video";
import { GtaShort, SHORT_TOTAL } from "./Short";

export const Root: React.FC = () => (
  <>
    <Composition id="Video1" component={GtaVideo} durationInFrames={TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="Short1" component={GtaShort} durationInFrames={SHORT_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
