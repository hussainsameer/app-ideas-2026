# App Ideas 2026

One folder per idea. Each idea is self-contained: its docs, design files, app code and Play Store listing all live inside its own folder.

| Idea | Status | Folder |
|------|--------|--------|
| String Art Maker | Planning | `string-art-maker/` |

Games and other ideas get added here as their own folders when we discuss them.

## Standard layout for every idea

```
<idea-name>/
  README.md          what it is, in one screen
  docs/              spec, algorithm notes, decisions, research links
  design/            storyboards, UI mockups, icon
  app/               the web app (HTML/JS) that Capacitor wraps for Android
  store-listing/     Play Store text, screenshots, privacy policy
```

## Build approach

Web app (HTML/CSS/JS) wrapped with [Capacitor](https://capacitorjs.com) to produce an Android APK/AAB for the Play Store. The same code also runs as a normal website, so testing happens in a browser first.
