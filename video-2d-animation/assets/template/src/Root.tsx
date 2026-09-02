import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition, getTotalDurationInFrames } from './VideoComposition';
import { DoodleVideoComposition } from './DoodleVideoComposition';
import { StoryVideoComposition } from './StoryVideoComposition';
import { scriptSchema, type Script } from './schema';
import scriptJson from '../data/script.example.json';
import doodleScriptJson from '../data/script.doodle.example.json';
import storyScriptJson from '../data/script.story.example.json';

const script: Script = scriptSchema.parse(scriptJson);
const doodleScript: Script = scriptSchema.parse(doodleScriptJson);
const storyScript: Script = scriptSchema.parse(storyScriptJson);

// Tự suy ra thời lượng / kích thước từ chính script được truyền vào,
// nhờ vậy render script khác qua --props vẫn đúng độ dài.
const metadataFromProps = ({ props }: { props: { script: Script } }) => ({
  durationInFrames: getTotalDurationInFrames(props.script),
  fps: props.script.fps,
  width: props.script.width,
  height: props.script.height,
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StoryVideo"
        component={StoryVideoComposition}
        durationInFrames={getTotalDurationInFrames(storyScript)}
        fps={storyScript.fps}
        width={storyScript.width}
        height={storyScript.height}
        defaultProps={{ script: storyScript }}
        calculateMetadata={metadataFromProps}
      />
      <Composition
        id="DoodleVideo"
        component={DoodleVideoComposition}
        durationInFrames={getTotalDurationInFrames(doodleScript)}
        fps={doodleScript.fps}
        width={doodleScript.width}
        height={doodleScript.height}
        defaultProps={{ script: doodleScript }}
        calculateMetadata={metadataFromProps}
      />
      <Composition
        id="MainVideo"
        component={VideoComposition}
        durationInFrames={getTotalDurationInFrames(script)}
        fps={script.fps}
        width={script.width}
        height={script.height}
        defaultProps={{ script }}
        calculateMetadata={metadataFromProps}
      />
    </>
  );
};
