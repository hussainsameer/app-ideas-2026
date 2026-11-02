# String Art Maker

Turn a photo into a physical string-art build guide.

**The user does:** picks a photo, chooses board shape (circle or square), board size and pin count.
**The app gives back:**
1. A to-scale **pin layout** (printable template, or measurements to mark by hand).
2. A **thread sequence**: a numbered list like `1 → 57 → 112 → 3 → …`. Each step is one straight thread between two pins.
3. A **preview** of what the finished board will look like.

The user puts pins into cardboard at the marked spots, then follows the sequence with one continuous thread. Where many threads overlap, the board gets dark. Where few cross, it stays light. That's how the image appears.

## Folder map

| Folder | What goes here |
|--------|----------------|
| `docs/spec.md` | What the app must do, screen by screen |
| `docs/algorithm.md` | How the image becomes a thread sequence (plain-language explainer) |
| `docs/research/` | Links to existing apps and papers we learn from |
| `design/storyboards/` | Your storyboards of the user flow |
| `design/ui-mockups/` | Screen designs |
| `design/icon/` | App icon source files |
| `app/` | The web app. `src/` is code, `public/` is static files and test images |
| `hardware-guide/` | Instructions for the physical build: board, pins, thread, printing the template |
| `store-listing/` | Play Store title, description, screenshots, privacy policy |

## Status

- [x] Idea written down
- [ ] Spec agreed
- [ ] Algorithm prototype in browser (grayscale, circle board only)
- [ ] Pin layout export (PDF / measurements)
- [ ] Thread sequence export (numbered list, step-by-step mode)
- [ ] Square board support
- [ ] UI design
- [ ] Capacitor Android build
- [ ] Play Store listing (needs Google Developer account)
