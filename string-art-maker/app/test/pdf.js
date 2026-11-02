// Downloads a 15 cm circle template (fits one A4 page) and a 30 cm square
// (tiles 2x2), then checks page counts and measures the printed circle.
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ acceptDownloads: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:8765/public/');
  await page.click('#sample');
  await page.waitForFunction(() => !document.getElementById('run').disabled);

  async function makePdf(shape, boardCm, pins, name) {
    await page.selectOption('#shape', shape);
    await page.fill('#boardCm', String(boardCm));
    await page.fill('#pins', String(pins));
    await page.fill('#lines', '200');
    await page.click('#run');
    await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Done'));
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#downloadPdf')]);
    const file = path.join(out, name);
    await dl.saveAs(file);
    const info = execSync(`pdfinfo "${file}"`).toString();
    const pages = +info.match(/Pages:\s+(\d+)/)[1];
    const size = info.match(/Page size:\s+(.*)/)[1];
    console.log(`${name}: pages=${pages} pageSize=${size} pdfPagesLabel="${await page.textContent('#pdfPages')}"`);
    return { file, pages };
  }

  // 1) 15 cm circle, 100 pins -> cover + 1 tile
  const a = await makePdf('circle', 15, 100, 'circle-15cm.pdf');
  // render page 2 at 100 dpi (1 mm = 3.937 px), measure dark-pixel extent of the board
  execSync(`pdftoppm -r 100 -f 2 -l 2 -gray "${a.file}" "${out}/circle"`);
  const pgm = fs.readFileSync(fs.readdirSync(out).filter(f => /^circle.*\.pgm$/.test(f)).map(f => path.join(out, f))[0]);
  // parse P5 header
  const header = pgm.toString('latin1', 0, 50).split(/\s+/);
  const w = +header[1], h = +header[2];
  const dataStart = pgm.length - w * h;
  // the board sits below the top margin; skip the first 25 mm (check for label / arrow) by scanning rows
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < Math.round(h * 0.9); y++) for (let x = 0; x < w; x++) {
    if (pgm[dataStart + y * w + x] < 128) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  const pxPerMm = 100 / 25.4;
  // horizontal extent = pins at ±75 mm plus dot radius 0.6 mm each side = 151.2 mm
  const widthMm = (maxX - minX) / pxPerMm;
  console.log(`circle extent: ${widthMm.toFixed(1)} mm wide (expected ~151.2), bbox x ${minX}-${maxX}, y ${minY}-${maxY}`);
  execSync(`pdftoppm -r 60 -png "${a.file}" "${out}/circle-preview"`);

  // 2) 30 cm square, 200 pins -> cover + 2x2 tiles on A4
  const b = await makePdf('square', 30, 200, 'square-30cm.pdf');
  execSync(`pdftoppm -r 60 -png "${b.file}" "${out}/square-preview"`);

  console.log('page errors:', errors.length ? errors : 'none');
  console.log('expect: circle pages=2, square pages=5');
  await browser.close();
})();
