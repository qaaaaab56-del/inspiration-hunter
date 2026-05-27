import sharp from 'sharp';

const SIZES = [192, 512];
const COLOR = '#d97706'; // amber-600

for (const size of SIZES) {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#fafaf9"/>
        <stop offset="100%" style="stop-color:#f5f5f4"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
    <g transform="translate(${size * 0.28}, ${size * 0.22})">
      <!-- Light bulb / spark shape -->
      <circle cx="${size * 0.22}" cy="${size * 0.15}" r="${size * 0.06}" fill="#fbbf24" opacity="0.8"/>
      <circle cx="${size * 0.10}" cy="${size * 0.28}" r="${size * 0.04}" fill="#f59e0b" opacity="0.6"/>
      <circle cx="${size * 0.32}" cy="${size * 0.32}" r="${size * 0.05}" fill="#fbbf24" opacity="0.7"/>
      <!-- Main shape -->
      <path d="M${size * 0.15},${size * 0.20}
               Q${size * 0.05},${size * 0.35} ${size * 0.08},${size * 0.48}
               Q${size * 0.12},${size * 0.55} ${size * 0.22},${size * 0.55}
               Q${size * 0.32},${size * 0.55} ${size * 0.36},${size * 0.48}
               Q${size * 0.39},${size * 0.35} ${size * 0.29},${size * 0.20}
               Z"
            fill="${COLOR}" opacity="0.9"/>
      <!-- Base -->
      <rect x="${size * 0.17}" y="${size * 0.55}" width="${size * 0.10}" height="${size * 0.06}" rx="${size * 0.02}" fill="#92400e" opacity="0.5"/>
    </g>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`client/public/icons/icon-${size}.png`);

  console.log(`Generated icon-${size}.png`);
}

console.log('Done!');
