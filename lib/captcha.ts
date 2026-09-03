const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function generateCaptcha(length: number = 6) {
  let answer = "";
  for (let i = 0; i < length; i++) {
    answer += CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  const w = 240;
  const h = 72;

  // Noise lines
  let lines = "";
  for (let i = 0; i < 5; i++) {
    lines += `<line x1="${rand(0, w)}" y1="${rand(0, h)}" x2="${rand(0, w)}" y2="${rand(0, h)}" stroke="#c0c4cc" stroke-width="${rand(0.8, 1.5)}"/>`;
  }

  // Noise dots
  let dots = "";
  for (let i = 0; i < 30; i++) {
    dots += `<circle cx="${rand(0, w)}" cy="${rand(0, h)}" r="${rand(0.8, 2)}" fill="#d0d3da"/>`;
  }

  // Curves
  let curves = "";
  for (let i = 0; i < 2; i++) {
    const y0 = rand(10, h - 10);
    curves += `<path d="M0,${y0} C${rand(w * 0.2, w * 0.4)},${rand(0, h)} ${rand(w * 0.6, w * 0.8)},${rand(0, h)} ${w},${rand(10, h - 10)}" fill="none" stroke="#b8bcc5" stroke-width="${rand(1, 2)}"/>`;
  }

  // Characters
  let chars = "";
  const startX = 16;
  const spacing = (w - 32) / length;
  const colors = ["#1a73e8", "#34495e", "#2c3e50", "#1565c0", "#37474f", "#455a64"];

  for (let i = 0; i < answer.length; i++) {
    const x = startX + i * spacing + rand(-3, 3);
    const y = h / 2 + rand(-5, 5);
    const rot = rand(-20, 20);
    const color = colors[Math.floor(rand(0, colors.length))];
    const size = rand(26, 32);

    chars += `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="700" fill="${color}" transform="rotate(${rot} ${x} ${y})" dominant-baseline="middle">${answer[i]}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="#f8f9fa" rx="4"/>
${lines}${dots}${curves}${chars}
</svg>`;

  return { answer, svg };
}
