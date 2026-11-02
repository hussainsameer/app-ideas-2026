// Printable, to-scale pin template as a PDF.
// Units inside this file are millimetres unless a name says otherwise.
//
// Layout of the PDF:
//   page 1        cover: settings, instructions, a 100 mm check bar,
//                 and a map of how the tile pages fit together
//   pages 2..n    tiles of the template, each clipped to the printable
//                 area, with a 10 mm overlap and dashed "align here" lines
//
// Requires window.jspdf (vendor/jspdf.umd.min.js, MIT).

const PAPERS = {
  a4:     { w: 210,   h: 297,   label: 'A4' },
  letter: { w: 215.9, h: 279.4, label: 'US Letter' },
};
const PAGE_MARGIN = 10;      // printers can't print to the edge
const OVERLAP = 10;          // glue strip between tiles
const BOARD_MARGIN = 12;     // white space around the board on the template
const PT_PER_MM = 72 / 25.4;

/** Pin positions in mm, pin 1 at the top (circle) or top-left corner (square). */
export function pinsMm(shape, count, boardMm) {
  const pins = [];
  if (shape === 'circle') {
    const r = boardMm / 2;
    for (let i = 0; i < count; i++) {
      const a = (2 * Math.PI * i) / count;              // clockwise from top
      pins.push({ x: r + r * Math.sin(a), y: r - r * Math.cos(a), angle: a });
    }
    return pins;
  }
  const s = boardMm, step = (4 * s) / count;
  for (let i = 0; i < count; i++) {
    const d = i * step;
    if (d < s)          pins.push({ x: d,            y: 0,            edge: 0 });
    else if (d < 2 * s) pins.push({ x: s,            y: d - s,        edge: 1 });
    else if (d < 3 * s) pins.push({ x: s - (d - 2*s), y: s,           edge: 2 });
    else                pins.push({ x: 0,            y: s - (d - 3*s), edge: 3 });
  }
  return pins;
}

/** How many tile pages the template needs. Exposed so the UI can say "4 pages". */
export function tileGrid(boardMm, paper = 'a4') {
  const p = PAPERS[paper];
  const usableW = p.w - 2 * PAGE_MARGIN, usableH = p.h - 2 * PAGE_MARGIN;
  const total = boardMm + 2 * BOARD_MARGIN;
  const cols = Math.max(1, Math.ceil((total - OVERLAP) / (usableW - OVERLAP)));
  const rows = Math.max(1, Math.ceil((total - OVERLAP) / (usableH - OVERLAP)));
  return { cols, rows, usableW, usableH, total, paper: p };
}

/**
 * Build the PDF and return the jsPDF document (caller decides save/share).
 * @param {{shape:'circle'|'square', count:number, boardCm:number, paper?:'a4'|'letter'}} o
 */
export function buildTemplatePdf({ shape, count, boardCm, paper = 'a4' }) {
  const { jsPDF } = window.jspdf;
  const boardMm = boardCm * 10;
  const grid = tileGrid(boardMm, paper);
  const { cols, rows, usableW, usableH, total, paper: P } = grid;
  const pins = pinsMm(shape, count, boardMm);
  const spacing = shape === 'circle' ? (Math.PI * boardMm) / count : (4 * boardMm) / count;
  const fontMm = clamp(spacing * 0.5, 1.5, 3.2);

  const doc = new jsPDF({ unit: 'mm', format: [P.w, P.h] });

  // ---------- cover page ----------
  doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
  doc.text('String Art Maker: pin template', PAGE_MARGIN, 22);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  const lines = [
    `${shape === 'circle' ? 'Circle, diameter' : 'Square, side'} ${boardCm} cm, ${count} pins.`,
    `Spacing between neighbouring pins: ${spacing.toFixed(1)} mm.`,
    shape === 'circle' ? 'Pin 1 is at the top. Numbers go clockwise.' : 'Pin 1 is the top-left corner. Numbers go clockwise.',
    '',
    'How to use',
    '1. Print every page at 100% / "Actual size". Do NOT tick "fit to page".',
    '2. Measure the check bar below. It must be exactly 100 mm. If not, fix the print scaling.',
    `3. The template is ${cols} x ${rows} page${cols * rows > 1 ? 's' : ''}. Trim the right and bottom edges of each page`,
    '   along the dashed lines, then overlap and tape following the map below.',
    '4. Tape the template to your board and push a pin through every numbered dot.',
    '5. Tear the paper away, or leave it. Pin 1 is marked with an arrow.',
  ];
  let y = 34;
  for (const l of lines) { doc.text(l, PAGE_MARGIN, y); y += 6; }

  // 100 mm check bar
  y += 4;
  doc.setLineWidth(0.4);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + 100, y);
  for (let i = 0; i <= 10; i++) doc.line(PAGE_MARGIN + i * 10, y - (i % 5 === 0 ? 3 : 1.5), PAGE_MARGIN + i * 10, y);
  doc.setFontSize(9);
  doc.text('check bar: 100 mm', PAGE_MARGIN, y + 5);
  y += 16;

  // page map
  doc.setFontSize(11); doc.text('Page map', PAGE_MARGIN, y); y += 4;
  const mapScale = Math.min(80 / total, 60 / total);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x0 = PAGE_MARGIN + c * (usableW - OVERLAP) * mapScale;
    const y0 = y + r * (usableH - OVERLAP) * mapScale;
    doc.setDrawColor(120); doc.setLineWidth(0.2);
    doc.rect(x0, y0, usableW * mapScale, usableH * mapScale);
    doc.setFontSize(8); doc.setTextColor(60);
    doc.text(`${r + 1}-${c + 1}`, x0 + 2, y0 + 4);
  }
  doc.setDrawColor(200, 40, 40); doc.setLineWidth(0.4);
  if (shape === 'circle') doc.circle(PAGE_MARGIN + (BOARD_MARGIN + boardMm / 2) * mapScale, y + (BOARD_MARGIN + boardMm / 2) * mapScale, (boardMm / 2) * mapScale);
  else doc.rect(PAGE_MARGIN + BOARD_MARGIN * mapScale, y + BOARD_MARGIN * mapScale, boardMm * mapScale, boardMm * mapScale);
  doc.setTextColor(0); doc.setDrawColor(0);

  // ---------- tile pages ----------
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    doc.addPage([P.w, P.h]);
    // template coordinates covered by this page
    const tx = c * (usableW - OVERLAP), ty = r * (usableH - OVERLAP);
    const toPage = (x, y) => [x - tx + PAGE_MARGIN, y - ty + PAGE_MARGIN];

    // page label and align lines (outside the clip so they are always visible)
    const joins = [];
    if (c < cols - 1) joins.push(`page ${r + 1}-${c + 2} on the right`);
    if (r < rows - 1) joins.push(`page ${r + 2}-${c + 1} below`);
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text(
      `page ${r + 1}-${c + 1} of ${rows}x${cols}   |   ${shape} ${boardCm} cm, ${count} pins   |   print at 100%` +
      (joins.length ? `   |   dashed line: trim here, overlap onto ${joins.join(' and ')}` : ''),
      PAGE_MARGIN, P.h - 4);
    doc.setTextColor(0);
    // dashed trim lines sit in the glue strip; the strip itself is repeated on the neighbouring page
    doc.setDrawColor(150); doc.setLineWidth(0.2); doc.setLineDashPattern([2, 2], 0);
    if (c < cols - 1) { const x = PAGE_MARGIN + usableW - OVERLAP; doc.line(x, PAGE_MARGIN - 4, x, PAGE_MARGIN + usableH + 4); }
    if (r < rows - 1) { const yy = PAGE_MARGIN + usableH - OVERLAP; doc.line(PAGE_MARGIN - 4, yy, PAGE_MARGIN + usableW + 4, yy); }
    doc.setLineDashPattern([], 0); doc.setDrawColor(0);

    // clip everything else to the printable area
    doc.saveGraphicsState();
    doc.rect(PAGE_MARGIN, PAGE_MARGIN, usableW, usableH, null); doc.clip(); doc.discardPath();

    const off = BOARD_MARGIN;          // board origin inside the template
    // board outline + centre cross
    doc.setLineWidth(0.3);
    if (shape === 'circle') doc.circle(...toPage(off + boardMm / 2, off + boardMm / 2), boardMm / 2);
    else doc.rect(...toPage(off, off), boardMm, boardMm);
    const [cx, cy] = toPage(off + boardMm / 2, off + boardMm / 2);
    doc.setLineWidth(0.2); doc.line(cx - 5, cy, cx + 5, cy); doc.line(cx, cy - 5, cx, cy + 5);

    // "pin 1 / top" arrow
    const p1 = toPage(off + pins[0].x, off + pins[0].y);
    doc.setLineWidth(0.4); doc.setDrawColor(200, 40, 40); doc.setTextColor(200, 40, 40);
    doc.line(p1[0], p1[1] - 9, p1[0], p1[1] - 2.5);
    doc.setFontSize(8); doc.text('pin 1', p1[0] + 1.5, p1[1] - 5);
    doc.setDrawColor(0); doc.setTextColor(0);

    // pins and numbers
    doc.setFontSize(fontMm * PT_PER_MM);
    doc.setFillColor(0);
    for (let i = 0; i < pins.length; i++) {
      const p = pins[i];
      const [x, yq] = toPage(off + p.x, off + p.y);
      if (x < PAGE_MARGIN - 5 || x > PAGE_MARGIN + usableW + 5 || yq < PAGE_MARGIN - 5 || yq > PAGE_MARGIN + usableH + 5) continue;
      doc.circle(x, yq, 0.6, 'F');
      const label = String(i + 1);
      const w = doc.getTextWidth(label);
      if (shape === 'circle') {
        // text runs along the radius, inside the ring, reading outward
        const a = p.angle;                           // clockwise from top
        const dir = [Math.sin(a), -Math.cos(a)];     // unit vector centre→pin (page coords)
        let deg = 90 - (a * 180) / Math.PI;          // jsPDF angle: counter-clockwise degrees
        let read = 1;                                // +1 = reads outward, -1 = flipped so it isn't upside down
        if (a > Math.PI) { deg += 180; read = -1; }
        const centreDist = 2.2 + w / 2;              // label centre sits this far inside the pin
        const lx = x - dir[0] * centreDist, ly = yq - dir[1] * centreDist;
        // move to the start of the text, half the width back along the reading direction
        const sx = lx - read * dir[0] * (w / 2), sy = ly - read * dir[1] * (w / 2);
        // nudge perpendicular so the text is centred on the radius line
        const nx = -dir[1] * read, ny = dir[0] * read;
        doc.text(label, sx + nx * (fontMm * 0.35), sy + ny * (fontMm * 0.35), { angle: deg });
      } else {
        // text parallel to the edge, just inside the board; corner pins go diagonally inward
        const inset = 2.2 + fontMm * 0.35;
        const onLeft = p.x === 0, onRight = p.x === boardMm, onTop = p.y === 0, onBottom = p.y === boardMm;
        const corner = (onLeft || onRight) && (onTop || onBottom);
        let pos, align;
        if (corner) {
          // outside the board, diagonally away from the corner, where nothing else is printed
          pos = [onLeft ? x - inset : x + inset, onTop ? yq - inset : yq + inset + fontMm * 0.8];
          align = onLeft ? 'right' : 'left';
        } else {
          pos = [[x, yq + inset + fontMm * 0.5], [x - inset, yq + fontMm * 0.35], [x, yq - inset], [x + inset, yq + fontMm * 0.35]][p.edge];
          align = ['center', 'right', 'center', 'left'][p.edge];
        }
        doc.text(label, pos[0], pos[1], { align });
      }
    }
    doc.restoreGraphicsState();
  }
  return doc;
}

export function templateFilename({ shape, count, boardCm }) {
  return `string-art-template-${shape}-${boardCm}cm-${count}pins.pdf`;
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
