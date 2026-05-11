# Alias — Official Website

Premium AI concierge systems for modern hospitality.

The official marketing site for **Alias**, a luxury-tech SaaS that automates reservations, guest communication, and hospitality operations 24/7. Designed to feel like Linear × Apple × Aman Resorts: dark, editorial, futuristic, restrained.

---

## Stack

- **React 18** + **TypeScript**
- **Vite 5** (dev server + bundler)
- **Tailwind CSS 3** (utility-first styling)
- **Framer Motion 11** (scroll-triggered reveals, layout transitions, page motion)

No state library, no router, no backend dependencies — this is a self-contained marketing surface ready to be deployed to Vercel, Netlify, Cloudflare Pages, or any static host.

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

### Build & preview

```bash
npm run build      # type-check + production bundle into ./dist
npm run preview    # preview the production build locally
```

### Type-check only

```bash
npm run lint
```

---

## Project structure

```
alias-website/
├── index.html                 # Entry HTML, font preloads, meta tags
├── public/
│   └── favicon.svg            # Alias mark favicon
├── src/
│   ├── main.tsx               # React root
│   ├── App.tsx                # Section composition
│   ├── index.css              # Tailwind + global tokens, fonts, scrollbar
│   ├── vite-env.d.ts
│   │
│   ├── lib/
│   │   ├── tokens.ts          # CYAN, CYAN_DEEP, ink colors, surfaces
│   │   └── motion.ts          # Shared Framer Motion variants + easing
│   │
│   ├── components/            # Reusable atoms
│   │   ├── AliasMark.tsx      # Brand mark (the cyan "A" + ALIAS wordmark)
│   │   ├── SectionLabel.tsx   # Cyan eyebrow label with leading rule
│   │   ├── Reveal.tsx         # In-view fade-up wrapper
│   │   ├── CheckIcon.tsx      # Cyan check circle
│   │   ├── ChatBubble.tsx     # Concierge message bubble
│   │   ├── TypingDots.tsx     # Animated typing indicator
│   │   ├── Stat.tsx           # Stat + BigStat
│   │   ├── Charts.tsx         # MiniChart (SVG area) + BigChart (bars)
│   │   ├── Form.tsx           # Field + ContactRow
│   │   ├── UseCaseCard.tsx    # Vertical card
│   │   └── HeroMockup.tsx     # The floating concierge UI in the hero
│   │
│   └── sections/              # Page sections (top-to-bottom order)
│       ├── Nav.tsx
│       ├── Hero.tsx
│       ├── Problem.tsx
│       ├── Solution.tsx
│       ├── ProductPreview.tsx
│       ├── UseCases.tsx
│       ├── Trial.tsx
│       ├── Contact.tsx
│       └── Footer.tsx
│
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

`@/*` resolves to `src/*` in both Vite and TypeScript.

---

## Design system

| Token         | Value       | Notes                              |
| ------------- | ----------- | ---------------------------------- |
| `--ink`       | `#06080a`   | Page background                    |
| `--ink-50`    | `#0a0d0e`   | Button text on cyan                |
| `--cyan`      | `#7FE3E6`   | Primary brand accent (logo "A")    |
| `--cyan-deep` | `#5BC8CC`   | Gradient bottom stop, deeper accents |
| Display font  | `Fraunces`  | Editorial serif, used for headlines |
| Body font     | `Inter Tight` | UI, labels, small text            |

The cyan is used like gold in luxury hospitality branding: **sparingly**, on CTAs, single accent characters (the period at end of a headline), active states, dots, dividers. Never as a fill or background.

---

## Deployment

Any static host works. For Vercel:

```bash
npm run build
# Output: ./dist
```

The site is a single-page application but uses anchor scrolling rather than routing, so no rewrites or framework adapters are needed.

---

## Future architecture

This marketing site is the entry point for the broader Alias platform:

- `alias.systems` — this site (public marketing)
- `app.alias.systems` — SaaS dashboard (multi-restaurant management)
- `api.alias.systems` — backend (OpenAI integration, PostgreSQL)
- `concierge.alias.systems` — guest-facing concierge UI

---

© 2026 Alias Systems. Crafted for hospitality.
