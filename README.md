# Othello — A Game in Black & White

A beautiful, artsy single-file Othello (Reversi) game. No build step, no dependencies — just open `index.html`.

Live: connect this repo to Netlify (see below).

## Play locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

Or just double-click `index.html`.

## Tests

```bash
node --test tests/
```

## Features

- Full Othello rules: legal moves, flipping, passes, game-over detection
- AI opponent (minimax + alpha-beta, 3 depths: Muse / Scholar / Oracle)
- Modes: play as Noir (black), as Blanc (white), or 2-player local
- Hint dots (toggle with button or `H` key), on-demand "Hint a move", undo, pass, move chronicle, copy PGN
- Particles, WebAudio sounds, responsive layout

## Deploy to Netlify

- Option A (git): Netlify Dashboard → Add new site → Import from GitHub → pick `Othello` → build command empty, publish directory `.`
- Option B (CLI): `netlify deploy --prod --dir .`
