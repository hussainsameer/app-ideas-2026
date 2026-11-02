// Runs the solver off the main thread so the page stays responsive
// and the preview can draw in while it works.
import { solve } from './solver.js';

self.onmessage = (e) => {
  const { darkness, size, pins, maxLines, lineWeight, minSkip } = e.data;
  const t0 = performance.now();
  const sequence = solve({
    darkness, size, pins, maxLines, lineWeight, minSkip,
    onProgress: (newPins, done) => self.postMessage({ type: 'progress', newPins, done }),
  });
  self.postMessage({ type: 'done', sequence, ms: Math.round(performance.now() - t0) });
};
