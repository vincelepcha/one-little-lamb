# One Little Lamb
A Counting Lullaby by Vince Lepcha

Read it at **https://vincelepcha.github.io/one-little-lamb/**

## How it works

- Plain HTML, CSS and JavaScript. No framework, no build step.
- `index.html` holds the words, `scenes.js` the drawings (inline SVG), `style.css` the colours and gentle movement, `script.js` the page turns.
- `sw.js` keeps a copy on the phone so the book opens offline after the first visit. `manifest.webmanifest` and `icons/` let it be added to the home screen.
- `og-cover.jpg` is the picture shown when the link is shared on WhatsApp and other apps.
- Fonts (Fraunces and Nunito, both SIL Open Font License) are stored in `fonts/`, so nothing loads from anywhere else.
- No analytics, cookies, ads or outside links.

## Making a change

1. Edit the files and push to `main`. GitHub Pages republishes in a minute or two.
2. Then raise the version in `sw.js` (`one-little-lamb-v2` → `one-little-lamb-v3`, and so on), so phones that saved the book pick up the new copy.

© 2026 Vince Lepcha. All rights reserved.
