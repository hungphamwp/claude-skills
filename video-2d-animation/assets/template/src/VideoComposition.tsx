import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { Scene } from './scenes/Scene';
import type { Script } from './schema';

export const VideoComposition: React.FC<{ script: Script }> = ({ script }) => {
  const { fps } = useVideoConfig();

  let startFrame = 0;
  const items = script.scenes.map((scene) => {
    const durationInFrames = Math.round(scene.durationInSeconds * fps);
    const from = startFrame;
    startFrame += durationInFrames;
    return { scene, from, durationInFrames };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {items.map(({ scene, from, durationInFrames }) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
          <Scene scene={scene} durationInFrames={durationInFrames} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const getTotalDurationInFrames = (script: Script) =>
  script.scenes.reduce((sum, s) => sum + Math.round(s.durationInSeconds * script.fps), 0);
