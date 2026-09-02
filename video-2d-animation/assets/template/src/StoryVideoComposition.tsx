import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { StoryScene } from './scenes/StoryScene';
import type { Script } from './schema';

export const StoryVideoComposition: React.FC<{ script: Script }> = ({ script }) => {
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
      {/* nhạc nền chạy suốt video, lặp lại nếu ngắn hơn */}
      {script.music ? (
        <Audio src={staticFile(script.music)} volume={script.musicVolume} loop />
      ) : null}

      {items.map(({ scene, from, durationInFrames }, index) => (
        <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
          {scene.voiceFile ? <Audio src={staticFile(scene.voiceFile)} /> : null}
          <StoryScene scene={scene} durationInFrames={durationInFrames} sceneIndex={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
