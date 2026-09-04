import React from 'react';
import { Img, staticFile } from 'remotion';
import { INK } from './anim';

const FONT = '"Comic Sans MS", Inter, sans-serif';

// Logo thương hiệu thật, tải từ Wikimedia Commons về public/assets/logos.
// Công cụ nào chưa có logo thì tự động rơi về thẻ chữ — không bịa logo giả.
const FILES: Record<string, string> = {
  chatgpt: 'chatgpt.svg',
  gemini: 'gemini.svg',
  claude: 'claude.svg',
  deepseek: 'deepseek.svg',
  grok: 'grok.svg',
  canva: 'canva.jpg',
  runway: 'runway.png',
  webflow: 'webflow.svg',
  wix: 'wix.svg',
  perplexity: 'perplexity.svg',
  github: 'github.svg',
  wordpress: 'wordpress.svg',
  google: 'google.svg',
  cloudflare: 'cloudflare.svg',
};

export const hasLogo = (key: string) => Boolean(FILES[key.toLowerCase()]);

// Ô logo: nền trắng bo góc viền đen dày cho khớp phong cách vẽ tay,
// bên trong là logo thật. Không có logo thì hiện tên bằng chữ.
export const LogoBox: React.FC<{
  x: number;
  y: number;
  name: string;
  label?: string;
  size?: number;
  showLabel?: boolean;
}> = ({ x, y, name, label, size = 150, showLabel = true }) => {
  const file = FILES[name.toLowerCase()];
  // đệm mỏng để logo chiếm gần hết ô — logo dạng chữ mới đọc được
  const pad = size * 0.11;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        rx={size * 0.18}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={9}
      />
      {file ? (
        <foreignObject x={-size / 2 + pad} y={-size / 2 + pad} width={size - pad * 2} height={size - pad * 2}>
          <Img
            src={staticFile(`assets/logos/${file}`)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </foreignObject>
      ) : (
        <text x={0} y={size * 0.1} fontSize={size * 0.2} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          {(label ?? name).slice(0, 8)}
        </text>
      )}
      {showLabel ? (
        <text x={0} y={size / 2 + 52} fontSize={size * 0.24} fontWeight={800} fill={INK} textAnchor="middle" fontFamily={FONT}>
          {label ?? name}
        </text>
      ) : null}
    </g>
  );
};
