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
