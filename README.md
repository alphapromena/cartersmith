# The Lawnsmith — Website

A fast, modern, single-page marketing site for **The Lawnsmith** (Milan, MI lawn care & landscaping). Built with plain HTML, CSS and a touch of vanilla JavaScript — **no build step, no dependencies**. It works opened directly in a browser and deploys to Vercel, Netlify or GitHub Pages in minutes.

## Files
- `index.html` — all page content & structure
- `styles.css` — design system, layout, animations, responsive rules
- `script.js` — sticky nav, mobile menu, scroll reveals, animated stats, form validation
- `assets/` — drop your photos and hero video here

## Preview locally
Just open `index.html`, or run a tiny server:
```bash
npx serve .        # then open the printed URL
# or
python3 -m http.server 8000
```

## Make it truly yours — quick checklist

1. **Hero video** — record/export a short clip (a mow, edging, a clean lawn) ~8–15s, muted, 1080p, H.264 `.mp4`, ideally < 6 MB. Save it as `assets/hero.mp4` and a still frame as `assets/hero-poster.jpg`. Until you do, an animated green gradient shows automatically.
2. **Your photos** — replace the placeholder Unsplash images in `styles.css` (search `unsplash.com`) under `.about__photo--*` and `.gallery__item[data-shot=...]` with your own before/after shots. Best results: your real jobs.
3. **Phone & email** — search `(000) 000-0000`, `+10000000000`, and `hello@thelawnsmithmi.com` in `index.html` and swap in real contact info.
4. **Service area** — adjust the town tags in the “Service Area” section to match where you actually work.
5. **Reviews** — the six reviews shown are the real customer reviews you provided. Add/edit in the `#reviews` section.

## Wire up the quote form
Right now the form validates and shows a friendly confirmation, but doesn’t send anywhere. Two easy options:

- **Formspree** (no backend): set `<form action="https://formspree.io/f/yourID" method="POST">` and remove the `e.preventDefault()` in `script.js`, or keep JS and POST via `fetch`.
- **Netlify Forms**: add `netlify` to the `<form>` tag and deploy on Netlify.

## Deploy
- **Vercel:** `npx vercel` (or import the repo at vercel.com) — it's a static site, no config needed.
- **Netlify:** drag the folder onto app.netlify.com, or connect the repo.
- **GitHub Pages:** repo Settings → Pages → deploy from branch root.

## Notes
- Fully responsive (mobile floating "Free Quote" button included).
- Respects `prefers-reduced-motion`.
- Placeholder images are loaded from Unsplash for the demo; replace them with your own and the site works fully offline.
