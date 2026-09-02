import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { Scene as SceneData } from '../schema';
import { HandDrawnCheck, HandDrawnRect, HandDrawnUnderline } from './RoughShapes';

const FADE_FRAMES = 12;

// Style "doodle / whiteboard explainer" (kiểu kênh Zenn):
// nền trắng, outline đen dày lệch tay, flat color, caption khung trắng bo góc.
export const DoodleScene: React.FC<{ scene: SceneData; durationInFrames: number }> = ({
  scene,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.6, stiffness: 140 } });
  const scale = interpolate(pop, [0, 1], [0.85, 1]);

  const ink = '#111111';
  const bg = scene.backgroundColor === '#0b1220' ? '#ffffff' : scene.backgroundColor;
  const accent = scene.accentColor;

  const headingWidth = Math.min(width - 160, (scene.heading?.length ?? 10) * 34 + 40);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        color: ink,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 90,
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {scene.image ? (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
            <Img
              src={staticFile(scene.image)}
              style={{ maxWidth: 720, maxHeight: 480, display: 'block', borderRadius: 12 }}
            />
          </div>
        ) : null}

        {scene.heading ? (
          <div style={{ marginBottom: scene.body || scene.bullets ? 20 : 0 }}>
            <h1
              style={{
                fontSize: 68,
                fontWeight: 800,
                color: ink,
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              {scene.heading}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
              <HandDrawnUnderline id={`${scene.id}-underline`} width={headingWidth} color={accent} />
            </div>
          </div>
        ) : null}

        {scene.body ? (
          <p
            style={{
              fontSize: 38,
              lineHeight: 1.5,
              color: '#333333',
              maxWidth: 820,
              margin: '0 auto',
            }}
          >
            {scene.body}
          </p>
        ) : null}

        {scene.bullets ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '12px auto 0',
              textAlign: 'left',
              display: 'inline-flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {scene.bullets.map((b, i) => {
              const itemDelay = i * 6;
              const itemSpring = spring({
                frame: frame - itemDelay,
                fps,
                config: { damping: 200, stiffness: 120 },
              });
              const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
              const itemX = interpolate(itemSpring, [0, 1], [-30, 0]);
              return (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    fontSize: 36,
                    color: '#222222',
                    opacity: itemOpacity,
                    transform: `translateX(${itemX}px)`,
                  }}
                >
                  <HandDrawnCheck id={`${scene.id}-check-${i}`} color={accent} />
                  <span>{b}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {scene.caption ? (
        <div
          style={{
            position: 'absolute',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            width: Math.min(width - 140, (scene.caption.length + 4) * 22),
            maxWidth: width - 140,
          }}
        >
          <div style={{ position: 'relative', padding: '18px 28px' }}>
            <HandDrawnRect
              id={`${scene.id}-caption`}
              width={Math.min(width - 140, (scene.caption.length + 4) * 22)}
              height={80}
              fill="#ffffff"
              stroke={ink}
              strokeWidth={5}
              radius={14}
            />
            <span
              style={{
                position: 'relative',
                display: 'block',
                textAlign: 'center',
                fontSize: 32,
                fontWeight: 600,
                color: ink,
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
