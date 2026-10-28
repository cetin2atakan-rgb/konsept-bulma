import React from "react";
import { Composition } from "remotion";
import { GtaVideo, totalFrames } from "./Video";
import { GtaShort, SHORT_TOTAL } from "./Short";
import { V1 } from "./v1";
import { V2 } from "./v2";
import { V3 } from "./v3";

const Video1: React.FC = () => <GtaVideo data={V1} />;
const Video2: React.FC = () => <GtaVideo data={V2} />;
const Video3: React.FC = () => <GtaVideo data={V3} />;

export const Root: React.FC = () => (
  <>
    <Composition id="Video1" component={Video1} durationInFrames={totalFrames(V1)} fps={30} width={1920} height={1080} />
    <Composition id="Short1" component={GtaShort} durationInFrames={SHORT_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="Video2" component={Video2} durationInFrames={totalFrames(V2)} fps={30} width={1920} height={1080} />
    <Composition id="Video3" component={Video3} durationInFrames={totalFrames(V3)} fps={30} width={1920} height={1080} />
  </>
);
