# One Little Lamb

A Counting Lullaby by Vince Lepcha, as a ten-page bedtime picture book for the web.

Live at **https://vincelepcha.github.io/one-little-lamb/**

## How it works

- Plain HTML, CSS and JavaScript. No framework, no build step.
- `index.html` holds the words and the drawings (inline SVG), `style.css` the colours and fades, `script.js` the page turns.
- `sw.js` keeps a copy on the phone so the book opens offline after the first visit. `manifest.webmanifest` and `icons/` let it be added to the home screen.
- Fonts (Fraunces and Nunito, both SIL Open Font License) are stored in `fonts/`, so nothing loads from anywhere else.
- No analytics, cookies, ads or outside links.

## Making a change

Edit the files and push to `main`; GitHub Pages republishes in a minute or two.
Then raise the version in `sw.js` (`one-little-lamb-v1` → `v2`) so phones that saved the book pick up the new copy.

© 2026 Vince Lepcha. All rights reserved.
