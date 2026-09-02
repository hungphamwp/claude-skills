import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { DoodleScene } from './scenes/DoodleScene';
import type { Script } from './schema';

export const DoodleVideoComposition: React.FC<{ script: Script }> = ({ script }) => {
  const { fps } = useVideoConfig();

  let startFrame = 0;
  const items = script.scenes.map((scene) => {
    const durationInFrames = Math.round(scene.durationInSeconds * fps);
    const from = startFrame;
    startFrame += durationInFrames;
    return { scene, from, durationInFrames };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      {script.music ? (
        <Audio src={staticFile(script.music)} volume={script.musicVolume} loop />
      ) : null}
      {items.map(({ scene, from, durationInFrames }) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
          {scene.voiceFile ? <Audio src={staticFile(scene.voiceFile)} /> : null}
          <DoodleScene scene={scene} durationInFrames={durationInFrames} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
