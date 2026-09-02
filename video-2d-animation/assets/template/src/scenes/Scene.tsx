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

const FADE_FRAMES = 15;

export const Scene: React.FC<{ scene: SceneData; durationInFrames: number }> = ({
  scene,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const headingSpring = spring({ frame, fps, config: { damping: 200, stiffness: 120 } });
  const translateY = interpolate(headingSpring, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.backgroundColor,
        color: scene.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        opacity,
      }}
    >
      <div style={{ transform: `translateY(${translateY}px)`, width: '100%', textAlign: 'center' }}>
        {scene.image ? (
          <Img
            src={staticFile(scene.image)}
            style={{ maxWidth: '80%', maxHeight: 500, marginBottom: 40, borderRadius: 24 }}
          />
        ) : null}

        {scene.heading ? (
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: scene.accentColor,
              marginBottom: 24,
              lineHeight: 1.15,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {scene.heading}
          </h1>
        ) : null}

        {scene.body ? (
          <p
            style={{
              fontSize: 40,
              lineHeight: 1.5,
              opacity: 0.92,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {scene.body}
          </p>
        ) : null}

        {scene.bullets ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
            {scene.bullets.map((b, i) => {
              const itemDelay = i * 6;
              const itemSpring = spring({
                frame: frame - itemDelay,
                fps,
                config: { damping: 200, stiffness: 120 },
              });
              const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
              const itemX = interpolate(itemSpring, [0, 1], [-40, 0]);
              return (
                <li
                  key={i}
                  style={{
                    fontSize: 38,
                    marginBottom: 20,
                    opacity: itemOpacity,
                    transform: `translateX(${itemX}px)`,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {b}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
