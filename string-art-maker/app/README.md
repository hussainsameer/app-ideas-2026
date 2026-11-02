# App

The web app that Capacitor wraps for Android.

```
app/
  public/            static files; index.html lives here, plus test-images/
  src/               JavaScript modules: image loading, pin layout, greedy solver, exports
  capacitor.config.json   added when we wire up Capacitor
  package.json            added when we wire up Capacitor
```

## Plan for the first prototype
1. `public/index.html` with a file picker and a canvas.
2. `src/pins.js`: circle and square pin positions.
3. `src/solver.js`: the greedy algorithm from `../docs/algorithm.md`.
4. `src/preview.js`: draws the threads on the canvas.
5. Only after it works in the browser: `npm init`, add Capacitor, build for Android.

## Test images
Put 3–4 photos in `public/test-images/`: one high-contrast portrait, one low-contrast photo, one with a busy background, one simple logo. These show us where the algorithm struggles.
