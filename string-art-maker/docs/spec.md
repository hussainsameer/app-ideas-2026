# String Art Maker: Spec (draft v0.1)

## Goal
A user with a photo, cardboard, pins and thread can build a string-art portrait by following numbers the app gives them. No measuring skill needed beyond a ruler.

## Screens

### 1. Import
- Pick a photo from gallery or camera.
- Crop to a circle or square (matches the board shape).
- Tip shown: high-contrast photos with a plain background work best.

### 2. Board setup
| Setting | Options | Default |
|---------|---------|---------|
| Shape | Circle, Square | Circle |
| Board size | Diameter / side in cm | 30 cm |
| Pin count | 100–300 | 200 |
| Thread count | 1000–4000 lines | 2500 |
| Thread color | Black on white, White on black | Black on white |

Live preview updates as settings change.

### 3. Pin layout output
- **Printable template** (PDF): to-scale dots with numbers. Tiled across A4 pages if the board is bigger than one sheet.
- **Measurement mode** for users without a printer:
  - Circle: "Mark a point every X cm along the edge" plus the angle table.
  - Square: pins per side and spacing between them.
- Pins are numbered clockwise starting from the top (12 o'clock).

### 4. Thread sequence output
- Full list: `1 → 57 → 112 → …`
- **Step-by-step mode**: big number on screen, "Next" button, progress bar. Keeps the screen awake. Saves progress so the user can stop and come back.
- Export as TXT / PDF.

### 5. Save / share
- Save project locally (image, settings, sequence).
- Share the preview image.

## Non-goals for v1
- Color string art (multiple thread colors). Later.
- Cloud accounts. Everything stays on the device.

## Open questions
- Pin numbering in sectors (1–50 per quarter) vs one run of 1–200? Sectors are easier to find on a big board.
- Should the app offer a "practice" preset (small board, 60 pins, 500 lines) for a first attempt?
