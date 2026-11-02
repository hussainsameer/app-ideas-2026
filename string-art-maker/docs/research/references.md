# Research: existing string-art apps and write-ups

Collected 2026-11-02. Use these to see what users expect and what each one gets wrong.

## Apps (direct competitors)
- **Genie Strings** (iPad): nail sequence + to-scale numbered nail layout PDF. https://apps.apple.com/app/id6747290176
- **String Art Maker: Penelope** (iPad): photo + thread colors + nail count → step-by-step guide. Advises high-contrast simple images. https://apps.apple.com/us/app/-/id6749775842
- **Stringar**: grayscale → circle pins → greedy line picking → numbered sequence export. https://www.indiehackers.com/product/stringar
- **String Art Studio** (paid): printable nail template on A4/Letter. https://ekithub-plr.beehiiv.com/p/string-art

Note: the two iPad apps have no obvious Android equivalent. That's the gap.

## Free web tools (good for trying the output quality)
- **Stringshot**: printable nail template + TXT pin sequence. https://arcade.pirillo.com/stringshot.html
- Peerlist "string art generator" listings: https://peerlist.io/boredtools/project/string-art-generator and https://peerlist.io/duanhjlt/project/string-art-generator

## Code and explanations
- DEV Community write-up of the greedy algorithm: https://dev.to/lili_zheng_3b046c3bf8ed58/how-i-built-string-art-generator-turning-photos-into-creative-patterns-2apk
- Hugging Face Space with open Python code, circle AND square boards: https://huggingface.co/spaces/citoreh/string/blob/main/app.py
- An Upwork job brief describing what a buyer wanted: nails grouped into four sectors numbered per sector, 200 or 240 nails, 2500–4000 lines. Useful as a real-world requirement list. https://www.upwork.com/freelance-jobs/apply/String-Art-Generator-Web-App_~022097635727310834077/

## What to check next
- Try Stringshot with one of our test images and photograph the real result. Tells us if 2500 lines is enough.
- Read the Hugging Face code for the square-board pin placement.

## GitHub: open-source projects (checked 2026-11-02)

Short version: the "photo → pin sequence" part has been built many times. Nobody has shipped it as an Android app on the Play Store. The GitHub topic `string-art` lists 26 repos; the most-starred one has 119 stars, most have under 20. The three closest to our spec are all browser tools with 0 stars, written in 2025–2026:

| Repo | Shapes | Outputs | Step-by-step | License | Notes |
|------|--------|---------|--------------|---------|-------|
| [far9100/img2string](https://github.com/far9100/img2string) | circle, rectangle | PDF template, SVG/DXF, CSV/TXT sequence, project file | yes, saves position | **GPL-3.0** | TypeScript + Vite. Closest to our idea. GPL means if we copy code our app must be GPL too. Learn from it, don't paste. |
| [TrevorPeters0n/string-art-studio](https://github.com/TrevorPeters0n/string-art-studio) | circle only | SVG template in mm, TXT/CSV/JSON | yes, full-screen stepper | **MIT** | Plain HTML/JS + Web Worker, no build step. Safe to borrow from with attribution. |
| [addisonkopplin/string-art](https://github.com/addisonkopplin/string-art) | circle, square, rectangle, oval | nail order, thread shopping list, printable template | not mentioned | **MIT** | Up to 3 thread colours, "focus on subject" with a small ML model. Has a short Python teaching version of the algorithm. |

Other useful ones:
- [99ecarvalho/StringArt2](https://github.com/99ecarvalho/StringArt2): greedy and Radon-transform modes, core solver isolated from the DOM so it runs in a Web Worker. Good architecture reference.
- [baditaflorin/string-portrait](https://github.com/baditaflorin/string-portrait): TypeScript, solver runs in chunks via requestAnimationFrame so the UI never freezes while the preview draws in. We want this behaviour.
- [DanAla/String_Art](https://github.com/DanAla/String_Art): C++, grayscale and CMYK colour modes, MIT.
- [piellardj/image-stylization-threading](https://github.com/piellardj/image-stylization-threading): most-starred (119), live demo, good for seeing what quality is achievable.
- [RohitV277/StringArtStudio](https://github.com/RohitV277/StringArtStudio): the only phone-first one, MIT, but it's a drawing/planning tool and does NOT convert photos.
- Paper: "A Greedy Algorithm for Generative String Art", Bridges 2022 (Demoussel, Larboulette, Dattatreya).

### What this means for us
1. **The algorithm is solved.** We should not spend the month on it. Port the greedy loop (MIT sources above) in a day, then spend the time on the parts nobody has done well.
2. **The gap is the phone experience:** installable Android app, step-by-step mode that works with wet hands and a board in your lap, measurement mode for people without a printer, and a "practice board" preset for beginners.
3. **License rule:** take ideas from anything, take code only from MIT repos, keep a `THIRD_PARTY.md` with credits.
