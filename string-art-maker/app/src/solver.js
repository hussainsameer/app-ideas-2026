// The greedy string-art solver. Pure math, no DOM, so it can run in a
// Web Worker (see worker.js) or in Node for tests.
//
// Idea in one paragraph: keep a "darkness map" of the photo. From the
// current pin, try a straight line to every other pin and measure how
// much darkness the line would cover. Take the darkest line, lighten
// the pixels under it (the thread now covers some of that darkness),
// move to the new pin, repeat. The list of pins visited is the sequence
// the user follows with the thread.

/**
 * @param {Object} opts
 * @param {Float32Array} opts.darkness  size*size values, 0 (white) .. 255 (black)
 * @param {number} opts.size            working canvas side in px
 * @param {{x:number,y:number}[]} opts.pins
 * @param {number} opts.maxLines
 * @param {number} opts.lineWeight      darkness removed per thread pass (e.g. 25)
 * @param {number} opts.minSkip         ignore destinations closer than this many pins
 * @param {(seq:number[], done:number)=>void} [opts.onProgress]  called every batch
 * @param {number} [opts.batch=50]
 * @returns {number[]} sequence of pin indexes (0-based), starting with 0
 */
export function solve({ darkness, size, pins, maxLines, lineWeight, minSkip, onProgress, batch = 50 }) {
  const n = pins.length;
  const lineCache = new Map();          // "i,j" (i<j) -> Int32Array of pixel indexes
  const used = new Set();               // pairs already threaded
  const sequence = [0];
  let current = 0;
  let pending = [];

  for (let step = 0; step < maxLines; step++) {
    let bestPin = -1, bestScore = 0, bestLine = null;

    for (let j = 0; j < n; j++) {
      // skip the current pin and its near neighbours (those lines hug the edge)
      const dist = Math.min(Math.abs(j - current), n - Math.abs(j - current));
      if (dist < minSkip) continue;
      const key = pairKey(current, j);
      if (used.has(key)) continue;

      const line = getLine(key, current, j);
      if (line.length === 0) continue;

      // average darkness along the line (average, not sum, so long and
      // short lines compete fairly)
      let sum = 0;
      for (let k = 0; k < line.length; k++) sum += darkness[line[k]];
      const score = sum / line.length;

      if (score > bestScore) { bestScore = score; bestPin = j; bestLine = line; }
    }

    // nothing dark left to cover: stop early
    if (bestPin === -1 || bestScore <= 0) break;

    // the thread now covers this line: remove some darkness under it
    for (let k = 0; k < bestLine.length; k++) {
      const idx = bestLine[k];
      darkness[idx] = Math.max(0, darkness[idx] - lineWeight);
    }
    used.add(pairKey(current, bestPin));
    current = bestPin;
    sequence.push(current);
    pending.push(current);

    if (onProgress && pending.length >= batch) {
      onProgress(pending, sequence.length - 1);
      pending = [];
    }
  }
  if (onProgress && pending.length) onProgress(pending, sequence.length - 1);
  return sequence;

  function getLine(key, a, b) {
    let line = lineCache.get(key);
    if (!line) {
      line = rasterLine(pins[a], pins[b], size);
      lineCache.set(key, line);
    }
    return line;
  }
}

function pairKey(a, b) {
  return a < b ? a * 100000 + b : b * 100000 + a;
}

/** Pixel indexes under a straight line from p to q (simple DDA sampling). */
export function rasterLine(p, q, size) {
  const dx = q.x - p.x, dy = q.y - p.y;
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
  const out = new Int32Array(steps + 1);
  let count = 0, last = -1;
  for (let s = 0; s <= steps; s++) {
    const x = Math.round(p.x + (dx * s) / steps);
    const y = Math.round(p.y + (dy * s) / steps);
    if (x < 0 || y < 0 || x >= size || y >= size) continue;
    const idx = y * size + x;
    if (idx !== last) { out[count++] = idx; last = idx; }
  }
  return out.subarray(0, count);
}
