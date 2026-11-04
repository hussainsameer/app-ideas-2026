import { layoutPins, measurementText } from './pins.js';
import { imageToDarkness, sampleImage } from './image.js';
import { Preview } from './preview.js';
import { buildTemplatePdf, tileGrid, templateFilename } from './template.js';

const SIZE = 400;   // solver works on a 400×400 grayscale; fast and detailed enough for a preview
const $ = (id) => document.getElementById(id);
// localStorage can be blocked (private mode, embedded previews); never let that break the app
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  remove: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

// When shown inside another page (thesameerhussain.com embeds this app in an iframe),
// tell the parent we loaded, so it can fall back to a redirect if embedding is blocked.
try { if (window.parent !== window) window.parent.postMessage({ type: 'string-art-maker-ready' }, '*'); } catch { /* ignore */ }

let img = null;          // the loaded photo
let worker = null;       // running solver
let pins = [];           // current pin positions
let sequence = [];       // result, 0-based pin indexes
let preview = null;

// ---- inputs ----------------------------------------------------------------
$('file').addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  loadImage(url);
});
$('sample').addEventListener('click', () => loadImage(sampleImage().src));
$('weight').addEventListener('input', (e) => ($('weightOut').value = e.target.value));
$('contrast').addEventListener('input', (e) => ($('contrastOut').value = e.target.value));
for (const id of ['shape', 'contrast']) $(id).addEventListener('change', showSource);

function loadImage(src) {
  const i = new Image();
  i.onload = () => { img = i; $('run').disabled = false; showSource(); setStatus('Photo loaded. Press Generate.'); };
  i.src = src;
}

function showSource() {
  if (!img) return;
  const { canvas } = imageToDarkness(img, SIZE, $('shape').value, { contrast: +$('contrast').value });
  const ctx = $('source').getContext('2d');
  ctx.drawImage(canvas, 0, 0, $('source').width, $('source').height);
}

// ---- generate --------------------------------------------------------------
$('run').addEventListener('click', run);
$('stop').addEventListener('click', stopWorker);

function run() {
  if (!img) return;
  stopWorker();
  const shape = $('shape').value;
  const pinCount = +$('pins').value;
  pins = layoutPins(shape, pinCount, SIZE);
  const { darkness } = imageToDarkness(img, SIZE, shape, { contrast: +$('contrast').value });

  preview = new Preview($('preview'), pins, SIZE);
  sequence = [];
  $('outputs').hidden = true;
  $('run').hidden = true; $('stop').hidden = false;
  setStatus('Working…');

  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const m = e.data;
    if (m.type === 'progress') {
      preview.addThreads(m.newPins);
      setStatus(`Thread ${m.done} of ${$('lines').value}`);
    } else if (m.type === 'done') {
      sequence = m.sequence;
      finish(m.ms);
    }
  };
  worker.onerror = (err) => { setStatus('Error: ' + err.message); stopWorker(); };
  worker.postMessage({
    darkness, size: SIZE, pins,
    maxLines: +$('lines').value,
    lineWeight: +$('weight').value,
    minSkip: Math.max(3, Math.round(pinCount / 10)),
  }, [darkness.buffer]);
}

function stopWorker() {
  if (worker) { worker.terminate(); worker = null; }
  $('run').hidden = false; $('stop').hidden = true;
}

function finish(ms) {
  stopWorker();
  setStatus(`Done: ${sequence.length - 1} threads in ${(ms / 1000).toFixed(1)} s.`);
  $('measurements').textContent = measurementText($('shape').value, pins.length, +$('boardCm').value);
  updatePdfInfo();
  $('sequence').textContent = formatSequence(sequence);
  $('outputs').hidden = false;
  store.remove('stepIndex');
}

function formatSequence(seq) {
  // 1-based numbers, 10 per row, matching what people expect on paper
  const nums = seq.map((p) => p + 1);
  const rows = [];
  for (let i = 0; i < nums.length; i += 10) rows.push(nums.slice(i, i + 10).join(' → '));
  return rows.join('\n');
}

function setStatus(t) { $('status').textContent = t; }

// ---- PDF template ----------------------------------------------------------
function templateOpts() {
  return { shape: $('shape').value, count: pins.length, boardCm: +$('boardCm').value, paper: $('paper').value };
}
function updatePdfInfo() {
  const g = tileGrid(+$('boardCm').value * 10, $('paper').value);
  const n = g.cols * g.rows;
  $('pdfPages').textContent = n === 1 ? '1 page + cover' : `${g.cols} x ${g.rows} = ${n} pages + cover`;
}
$('paper').addEventListener('change', updatePdfInfo);
$('downloadPdf').addEventListener('click', () => {
  const o = templateOpts();
  buildTemplatePdf(o).save(templateFilename(o));
});

// ---- exports ---------------------------------------------------------------
$('downloadTxt').addEventListener('click', () => {
  const head = [
    'String Art Maker sequence',
    measurementText($('shape').value, pins.length, +$('boardCm').value),
    `Threads: ${sequence.length - 1}`,
    'Start by tying the thread to pin 1, then go to each pin in order.',
    '',
  ].join('\n');
  const blob = new Blob([head + formatSequence(sequence) + '\n'], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `string-art-${$('shape').value}-${pins.length}pins.txt`;
  a.click();
});
$('copySeq').addEventListener('click', () => navigator.clipboard.writeText(formatSequence(sequence)));

// ---- step-by-step mode -----------------------------------------------------
let stepIndex = 0;  // index into sequence of the pin we are going TO
$('stepMode').addEventListener('click', () => {
  stepIndex = Math.min(+store.get('stepIndex') || 1, sequence.length - 1);
  $('stepper').hidden = false;
  renderStep();
  keepAwake();
});
$('stepClose').addEventListener('click', () => { $('stepper').hidden = true; });
$('stepNextBtn').addEventListener('click', () => { if (stepIndex < sequence.length - 1) { stepIndex++; renderStep(); } });
$('stepPrev').addEventListener('click', () => { if (stepIndex > 1) { stepIndex--; renderStep(); } });
document.addEventListener('keydown', (e) => {
  if ($('stepper').hidden) return;
  if (e.key === 'ArrowRight' || e.key === ' ') $('stepNextBtn').click();
  if (e.key === 'ArrowLeft') $('stepPrev').click();
});

function renderStep() {
  $('stepFrom').textContent = sequence[stepIndex - 1] + 1;
  $('stepTo').textContent = sequence[stepIndex] + 1;
  $('stepNext').textContent = stepIndex + 1 < sequence.length ? sequence[stepIndex + 1] + 1 : 'finished, tie off';
  $('stepCount').textContent = `thread ${stepIndex} / ${sequence.length - 1}`;
  store.set('stepIndex', String(stepIndex));
}

async function keepAwake() {
  try { if ('wakeLock' in navigator) await navigator.wakeLock.request('screen'); } catch { /* not critical */ }
}
