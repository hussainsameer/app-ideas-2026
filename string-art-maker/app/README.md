# App

The web app that Capacitor will wrap for Android. Plain HTML, CSS and ES modules, no build step.

```
app/
  public/index.html   the page
  public/style.css
  src/main.js         wires the page together
  src/image.js        photo → grayscale darkness map, built-in sample image
  src/pins.js         pin positions for circle / square boards, ruler measurements
  src/solver.js       the greedy algorithm (pure, no DOM)
  src/worker.js       runs the solver in a Web Worker so the page never freezes
  src/preview.js      draws pins and threads on the canvas
  src/template.js     printable to-scale PDF pin template (tiled across pages)
  vendor/jspdf.*      jsPDF 2.5.2 (MIT), the only third-party code
  test/               Playwright smoke test
```

## Run it

ES modules need a web server (opening the file directly won't work). From this `app/` folder:

```bash
npx serve .
```

or

```bash
python -m http.server 8080
```

then open `http://localhost:8080/public/`.

## What works (v0.1)
- Photo or built-in sample, circle or square board, pin count, thread count, thread darkness, contrast.
- Live preview while solving.
- Ruler measurements for marking pins without a printer.
- Sequence list (1-based, 10 per row), copy, download as .txt.
- Step-by-step mode with big numbers, keyboard arrows, saved position, screen wake lock.
- Printable PDF pin template, to scale in mm, A4 or US Letter, tiled with a 10 mm overlap when the board is bigger than one sheet. Cover page has a 100 mm check bar and a page map.

## Not yet
- Save/load projects.
- Colour threads.
- Capacitor wrapper.

## Test

Start the server on port 8765 in one terminal, run the smoke test in another:

```bash
python -m http.server 8765
```

```bash
npm install
npm test
```

It clicks through sample → generate (circle and square) → step-by-step mode, checks for console errors, and saves screenshots to `test/out/`.

```bash
node test/pdf.js
```

Downloads two templates, checks page counts with `pdfinfo`, renders with `pdftoppm` and measures the printed circle to confirm the scale (needs poppler-utils).
