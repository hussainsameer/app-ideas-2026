// Draws pins and threads on the preview canvas.

export class Preview {
  constructor(canvas, pins, workingSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pins = pins;
    this.scale = canvas.width / workingSize;
    this.last = null;
    this.clear();
  }

  clear() {
    const { ctx, canvas } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    // pins
    ctx.fillStyle = '#c33';
    for (const p of this.pins) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.2 / this.scale, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 0.6 / this.scale;
    this.last = null;
  }

  /** Append threads: pinIndexes is a list of pin indexes to visit in order. */
  addThreads(pinIndexes) {
    const { ctx, pins } = this;
    ctx.beginPath();
    let from = this.last === null ? pins[pinIndexes[0]] : pins[this.last];
    const start = this.last === null ? 1 : 0;
    ctx.moveTo(from.x, from.y);
    for (let i = start; i < pinIndexes.length; i++) {
      const p = pins[pinIndexes[i]];
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    this.last = pinIndexes[pinIndexes.length - 1];
  }

  /** Highlight one thread (for the step-by-step mode). */
  highlight(fromIdx, toIdx) {
    const { ctx, pins } = this;
    ctx.save();
    ctx.strokeStyle = '#e33'; ctx.lineWidth = 2 / this.scale;
    ctx.beginPath(); ctx.moveTo(pins[fromIdx].x, pins[fromIdx].y); ctx.lineTo(pins[toIdx].x, pins[toIdx].y); ctx.stroke();
    ctx.fillStyle = '#e33';
    ctx.beginPath(); ctx.arc(pins[toIdx].x, pins[toIdx].y, 4 / this.scale, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}
