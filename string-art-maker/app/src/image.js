// Turn a photo into the solver's darkness map.

/**
 * Center-crop the image to a square, scale to `size`, convert to grayscale,
 * and (for circle boards) blank out everything outside the circle.
 * Returns { darkness: Float32Array, canvas } where canvas is the cropped
 * grayscale image for showing next to the preview.
 */
export function imageToDarkness(img, size, shape, { contrast = 1 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  // center crop
  const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  const sx = ((img.naturalWidth || img.width) - side) / 2;
  const sy = ((img.naturalHeight || img.height) - side) / 2;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);

  const { data } = ctx.getImageData(0, 0, size, size);
  const darkness = new Float32Array(size * size);
  const cx = size / 2, cy = size / 2, r2 = (size / 2) * (size / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      if (shape === 'circle' && (x - cx) ** 2 + (y - cy) ** 2 > r2) {
        darkness[i] = 0;
        data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 255;
        continue;
      }
      // perceived brightness (same weights your eye uses)
      const gray = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
      let d = 255 - gray;
      d = clamp(128 + (d - 128) * contrast, 0, 255);   // optional contrast boost
      darkness[i] = d;
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 255 - d;
    }
  }
  ctx.putImageData(new ImageData(data, size, size), 0, 0);
  return { darkness, canvas };
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

/** A built-in test picture so the app can be tried with no photo at hand. */
export function sampleImage(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
  // soft dark blob (a "head")
  const g = ctx.createRadialGradient(size * 0.5, size * 0.45, size * 0.05, size * 0.5, size * 0.45, size * 0.38);
  g.addColorStop(0, '#222'); g.addColorStop(0.7, '#555'); g.addColorStop(1, '#fff');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(size * 0.5, size * 0.45, size * 0.38, 0, Math.PI * 2); ctx.fill();
  // two light "eyes" and a dark "mouth"
  ctx.fillStyle = '#eee';
  ctx.beginPath(); ctx.arc(size * 0.38, size * 0.38, size * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(size * 0.62, size * 0.38, size * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = size * 0.03;
  ctx.beginPath(); ctx.arc(size * 0.5, size * 0.5, size * 0.18, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
  const img = new Image();
  img.src = c.toDataURL();
  return img;
}
