# Add String Art Maker to thesameerhussain.com (Vercel)

Goal: the tool lives at https://thesameerhussain.com/string-art-maker

1. Copy the `string-art-maker` folder into the website project in M:\AI:
   - Plain HTML site: put it next to the site's index.html.
   - Next.js / React / Vite site: put it inside the `public` folder.
2. Next.js only: add this to next.config.js so the clean URL works:
   async rewrites() { return [
     { source: '/string-art-maker', destination: '/string-art-maker/index.html' },
     { source: '/string-art-maker/', destination: '/string-art-maker/index.html' },
   ]; }
3. Deploy the way you normally do (git push, or `vercel --prod` in the project folder).
4. Optional: add a link to /string-art-maker in the site's menu.

The folder is self-contained: no build step, no npm packages, works offline.
