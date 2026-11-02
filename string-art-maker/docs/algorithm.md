# How a photo becomes a thread sequence

This is the core of the app. It's simpler than it sounds.

## 1. Flatten the photo
Convert to grayscale and crop to the board shape. Dark pixels = places where we want many threads to cross. Light pixels = places we want to leave empty.

## 2. Place the pins
- **Circle**: N pins evenly spaced around the circumference. Pin i sits at angle `360° × i / N`.
- **Square**: N pins spread evenly along the four edges, corners included.

Each pin gets a number and an (x, y) position. This is also what gets printed as the template.

## 3. Greedy line picking
Start at pin 1 with a copy of the image as the "remaining darkness".

Repeat for each thread (e.g. 2500 times):
1. From the current pin, look at every other pin as a possible destination.
2. For each candidate line, sum up the darkness of the pixels that line would pass over.
3. Pick the line with the highest total. That's the next thread.
4. Subtract some darkness along that line from the image (because that area is now partly covered by thread).
5. Move the current pin to the destination. Record the destination number.

The recorded list of pin numbers **is** the sequence the user follows.

"Greedy" means we always take the best-looking step right now, without planning ahead. It's not perfect but it produces good results and runs fast enough in a browser.

## 4. Small details that matter
- **Skip near neighbours**: lines between pins that are very close together run along the edge and add nothing. Ignore destinations within ~20 pins of the current one.
- **Don't repeat a line**: keep a set of used pin pairs.
- **Line darkness value**: how much to subtract per thread. Too high and the result is faint; too low and it's a black blob. Make it a tunable setting.
- **Thread thickness**: the preview should draw threads at the real thickness relative to the board size, or the preview will look darker or lighter than the real thing.

## 5. Why a browser is fine for this
2500 threads × 200 candidate pins × ~300 pixels per line ≈ 150 million pixel reads. JavaScript does that in a few seconds on a phone. We can precompute the pixel list for every pin pair once (200 × 200 / 2 = 20,000 lines) and reuse it.

## References
See `research/references.md`.
