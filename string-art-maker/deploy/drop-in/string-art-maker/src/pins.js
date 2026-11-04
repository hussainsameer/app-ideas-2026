// Pin layout: where each numbered pin sits on the board.
// All positions are in "image pixels" (the solver's working canvas),
// pin 1 is at the top (12 o'clock) and numbers go clockwise.

/**
 * @param {'circle'|'square'} shape
 * @param {number} count   number of pins
 * @param {number} size    width/height of the square working canvas in px
 * @returns {{x:number,y:number}[]}  index 0 is pin #1
 */
export function layoutPins(shape, count, size) {
  return shape === 'circle' ? circlePins(count, size) : squarePins(count, size);
}

function circlePins(count, size) {
  const r = size / 2 - 1;          // keep the pins just inside the canvas
  const cx = size / 2, cy = size / 2;
  const pins = [];
  for (let i = 0; i < count; i++) {
    // start at the top (-90°) and go clockwise
    const a = -Math.PI / 2 + (2 * Math.PI * i) / count;
    pins.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pins;
}

function squarePins(count, size) {
  // Walk the perimeter clockwise starting from the top-left corner,
  // dropping a pin every (perimeter / count) px. Corners get a pin when
  // count is divisible by 4, which is what we recommend in the UI.
  const s = size - 2;              // 1px margin
  const step = (4 * s) / count;
  const pins = [];
  for (let i = 0; i < count; i++) {
    let d = i * step;
    let x, y;
    if (d < s)            { x = 1 + d;          y = 1; }            // top edge, left→right
    else if (d < 2 * s)   { x = 1 + s;          y = 1 + (d - s); }  // right edge, top→bottom
    else if (d < 3 * s)   { x = 1 + s - (d - 2 * s); y = 1 + s; }   // bottom edge, right→left
    else                  { x = 1;              y = 1 + s - (d - 3 * s); } // left edge, bottom→top
    pins.push({ x, y });
  }
  return pins;
}

/**
 * Human-readable measurements so a user without a printer can mark pins
 * with a ruler. boardCm is diameter (circle) or side length (square).
 */
export function measurementText(shape, count, boardCm) {
  if (shape === 'circle') {
    const circumference = Math.PI * boardCm;
    return [
      `Circle, diameter ${boardCm} cm, ${count} pins.`,
      `Distance between neighbouring pins along the edge: ${(circumference / count).toFixed(2)} cm.`,
      `Angle between pins: ${(360 / count).toFixed(2)}°.`,
      `Tip: draw the circle, mark pin 1 at the top, then walk around clockwise with a flexible tape measure.`,
    ].join('\n');
  }
  const perSide = count / 4;
  const spacing = (4 * boardCm) / count;
  return [
    `Square, side ${boardCm} cm, ${count} pins (${perSide} per side${Number.isInteger(perSide) ? '' : ', not a whole number: pick a count divisible by 4'}).`,
    `Distance between neighbouring pins: ${spacing.toFixed(2)} cm.`,
    `Pin 1 is the top-left corner. Numbers go clockwise: top edge, right edge, bottom edge, left edge.`,
  ].join('\n');
}
