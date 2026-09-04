import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from 'remotion';
import { StoryScene } from './scenes/StoryScene';
import type { Script } from './schema';

export const StoryVideoComposition: React.FC<{ script: Script }> = ({ script }) => {
  const { fps } = useVideoConfig();

  // Gom các cảnh LIÊN TIẾP dùng chung một hình minh hoạ thành một "chuỗi".
  // Trong cùng chuỗi, hình không fade lại từ đầu mà chạy tiếp — nhờ vậy video
  // mượt và hình có thể lộ dần từng phần đúng theo lời đọc, thay vì đứng yên
  // suốt mấy cảnh liền.
  let startFrame = 0;
  const items = script.scenes.map((scene, i) => {
    const durationInFrames = Math.round(scene.durationInSeconds * fps);
    const from = startFrame;
    startFrame += durationInFrames;
    return { scene, from, durationInFrames, index: i };
  });

  const enriched = items.map((item, i) => {
    const prev = items[i - 1];
    const next = items[i + 1];
    const samePrev = Boolean(prev && prev.scene.illustration && prev.scene.illustration === item.scene.illustration);
    const sameNext = Boolean(next && next.scene.illustration && next.scene.illustration === item.scene.illustration);

    // frame bù: số frame đã trôi qua kể từ khi chuỗi này bắt đầu
    let chainOffset = 0;
    let stepInChain = 0;
    for (let k = i - 1; k >= 0; k--) {
      if (items[k].scene.illustration !== item.scene.illustration) break;
      chainOffset += items[k].durationInFrames;
      stepInChain++;
    }

    return {
      ...item,
      continuesPrev: samePrev,
      continuesNext: sameNext,
      chainOffset,
      step: item.scene.step ?? stepInChain,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
      {script.music ? (
        <Audio src={staticFile(script.music)} volume={script.musicVolume} loop />
      ) : null}

      {enriched.map((it) => (
        <Sequence key={it.scene.id} from={it.from} durationInFrames={it.durationInFrames}>
          {it.scene.voiceFile ? <Audio src={staticFile(it.scene.voiceFile)} /> : null}
          <StoryScene
            scene={it.scene}
            durationInFrames={it.durationInFrames}
            sceneIndex={it.index}
            step={it.step}
            chainOffset={it.chainOffset}
            continuesPrev={it.continuesPrev}
            continuesNext={it.continuesNext}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
