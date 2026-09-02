import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Scene as SceneData } from '../schema';
import { ILLUSTRATIONS } from '../illustrations';
import { HandDrawnRect } from './RoughShapes';

const FADE = 10;

// Các kiểu chuyển động máy quay, luân phiên theo cảnh để video dài không bị đơn điệu
const MOTIONS = ['zoom-in', 'pan-left', 'zoom-out', 'pan-right'] as const;
type Motion = (typeof MOTIONS)[number];

// Cảnh kể chuyện: minh họa SVG động chiếm toàn khung + heading trên + caption dưới.
export const StoryScene: React.FC<{
  scene: SceneData;
  durationInFrames: number;
  sceneIndex?: number;
}> = ({ scene, durationInFrames, sceneIndex = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Chuyển động máy quay: lấy theo scene.motion nếu có, không thì luân phiên theo thứ tự cảnh
  const motion: Motion =
    (MOTIONS as readonly string[]).indexOf(scene.motion ?? '') >= 0
      ? (scene.motion as Motion)
      : MOTIONS[sceneIndex % MOTIONS.length];

  const t = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: 'clamp' });
  const zoom =
    motion === 'zoom-in' ? 1 + t * 0.07 : motion === 'zoom-out' ? 1.07 - t * 0.07 : 1.05;
  const panX = motion === 'pan-left' ? -t * 34 : motion === 'pan-right' ? t * 34 : 0;

  const Illustration = scene.illustration ? ILLUSTRATIONS[scene.illustration] : undefined;
  const accent = scene.accentColor;

  const headingSpring = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 130 } });
  const headingScale = interpolate(headingSpring, [0, 1], [0.7, 1]);

  // Khung phụ đề co giãn theo độ dài chữ, tự xuống dòng khi câu dài
  const maxCaptionWidth = width - 200;
  const rawCaptionWidth = scene.caption ? scene.caption.length * 26 + 90 : 0;
  const captionWidth = Math.min(maxCaptionWidth, rawCaptionWidth);
  const captionLines = Math.max(1, Math.ceil(rawCaptionWidth / maxCaptionWidth));
  const captionHeight = 92 + (captionLines - 1) * 52;

  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff', opacity }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${panX}px)` }}>
        {Illustration ? <Illustration frame={frame} accent={accent} /> : null}
      </AbsoluteFill>

      {scene.heading ? (
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            textAlign: 'center',
            transform: `scale(${headingScale})`,
            fontFamily: '"Comic Sans MS", Inter, sans-serif',
            fontSize: 86,
            fontWeight: 800,
            letterSpacing: 2,
            color: scene.textColor === '#ffffff' ? '#111111' : scene.textColor,
            textTransform: 'uppercase',
            WebkitTextStroke: '3px #111111',
            paddingInline: 60,
          }}
        >
          {scene.heading}
        </div>
      ) : null}

      {scene.caption ? (
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            width: captionWidth,
          }}
        >
          <div style={{ position: 'relative', padding: '22px 34px' }}>
            <HandDrawnRect
              id={`${scene.id}-story-caption`}
              width={captionWidth}
              height={captionHeight}
              fill="#ffffff"
              stroke="#111111"
              strokeWidth={5}
              radius={14}
            />
            <span
              style={{
                position: 'relative',
                display: 'block',
                textAlign: 'center',
                fontSize: 40,
                fontWeight: 600,
                color: '#111111',
                fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {scene.caption}
            </span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
