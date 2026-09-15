# myowin.dev

Personal portfolio for Myo Win Thein (Martin), Senior Full-Stack Engineer based in Bangkok.

**Live:** [myowin.dev](https://myowin.dev)

## Background

A heavily customised build on the commercial "Tunis" React template. Five sections (Home, Work, Profile, Writing, Contact) live as `react-tabs` panels inside a single Next.js page; no route changes between sections. All content is static except the Writing tab, which pulls from Medium via the rss2json API.

## Install

Requires Node.js 18+ and npm.

```sh
npm install
```

Create `.env.production` in the project root (gitignored):

```
SITE_URL=https://myowin.dev/
```

For Vercel deployment, set both `NEXT_PUBLIC_SITE_URL` and `SITE_URL` in the project's environment settings.

## Usage

```sh
npm run dev         # http://localhost:4000 (not the default 3000)
npm run lint        # next/core-web-vitals
npm test            # vitest run (utils/**/*.test.js only)
npm run test:watch  # vitest watch mode
npm run build       # next build + next-sitemap (postbuild)
npm run start       # serve the production build (requires prior build)
```

Editing content:

- **Personal info, URLs, meta, API keys** → `src/config.js`
- **Portfolio projects** → `src/components/portfolio/portfolioData.js`
- **Work experience** → inline array in `src/components/about/Experience.jsx`
- **Education** → inline array in `src/components/about/Education.jsx`
- **Technical skills** → inline array in `src/components/about/index.jsx`

Nyo, the portfolio companion, is mounted in `home-dark.jsx` and on the 404 page.
On the 404 page he uses a puzzled waiting pose during idle/landing reactions. His browser-native
sprite controller lives in `src/components/nyo/Nyo.jsx`, with no physics or
animation package required. He walks on rendered text lines and component tops,
falls off ledges under gravity, prepares ballistic jumps, and catches/climbs
nearby card sides before pulling himself onto the top. Landings, hesitation,
effort, and idle curiosity use different poses from his existing atlas.

`src/components/nyo/world.js` measures headings, paragraphs, list text, useful
inline text, project images, buttons, and profile cards. Interactive text remains
excluded so Nyo does not interfere with controls. Add `data-nyo-platform` for an additional walkable
top edge, or `data-nyo-solid` for a top edge with climbable sides. These should
mark visible surfaces, not invisible layout wrappers. Text is a one-way landing
surface, and a small paw-width tolerance makes edge contact count; this is playful platformer physics, not a full rigid-body simulation.
Climbing uses a dedicated six-frame, stable-scale side-on grip-and-push loop that mirrors for
either side of a component. Its frames advance only with upward travel and freeze during wall rests,
so the cycle cannot play backward or churn while stationary. Sitting is approximated with a lowered waiting pose. Sleeping uses its own
six-frame closed-eye, curled-up breathing loop under `public/assets/nyo/sleep/`,
plus the existing `Zzz` bubble.

`utils/nyo-behavior.js` adds local energy, curiosity, playfulness, five-surface
memory, failed-route cooldowns, and routes of up to four physical hops. Nyo
prefers new higher surfaces, sometimes undershoots borderline jumps, pauses on
long climbs, sits occasionally, and sleeps for 12–20 seconds when tired before
stretching and resuming exploration. None of this uses an AI API or server.

After text selection finishes, Nyo has a 25% chance to investigate, with a
20-second cooldown between eligible attempts. Only range geometry is used;
selection text is not read, saved, or transmitted. Form and editable selections
are ignored. Nearby cursor motion can trigger a glance or a three-second chase,
with a 12-second chase cooldown. These roaming interactions are disabled on
touch/mobile and with reduced motion; the visible idle dock remains.

Click/tap Nyo's body (or focus **Pet Nyo** with the keyboard and press Enter/Space)
for a short emoji reaction; petting wakes him from sleep. The small hitbox is
click-through over underlying controls, disabled during selection drags/dialogs,
and Nyo stays still while keyboard-focused. Reaction bubbles never capture input.

Physics, routing, foot alignment, and sprite metadata live in `utils/nyo.js`;
styling is in `src/styles/nyo.scss`. Measurements update on layout changes and
scroll, and the pet re-enters the visible section immediately if left behind
offscreen. The bottom of the visible window is a walkable floor at every scroll
position: Nyo stays on that floor while scrolling, while component surfaces move
with the page. A solid, non-walkable ceiling follows the window top: head impacts
cancel upward velocity, preserve sideways momentum, and lead to a natural fall
with a brief surprised reaction. Respawning is a recovery fallback, not the normal response to
falling down. Main section changes preserve his position while gravity finds new surfaces.

The original v2 atlas is preserved in `public/assets/nyo/spritesheet.webp` (8×11,
192×208 source cells). Loading starts immediately and he appears as soon as the
artwork is ready, with no extra section-transition delay. Failed loads retry
automatically with exponential backoff capped at 30 seconds, or when connectivity
returns. Nyo is always enabled:
he roams on desktop, with a gently eased scale correction keeping side-running and front-facing
poses visually consistent; he uses a small idle dock on touch/mobile and becomes
stationary with reduced motion. There is no visibility toggle or saved preference.
Outside his small petting hitbox he is click-through, and stays visible during form entry. Open dialogs
leave him moving or resting normally in the page background at his existing position; his layers move
below the popup overlay and his interactions are disabled until the dialog closes. He pauses in background
tabs. Physics, surface measurement, and visibility behavior have tests.

## Tech Stack

| | |
|---|---|
| Framework | Next.js 13.5 (Pages Router), React 18 |
| Language | JavaScript / JSX |
| Styling | SCSS (Bootstrap 5 grid only, no Tailwind, no CSS Modules) |
| UI | react-tabs, react-modal, react-awesome-slider |
| Animation | AOS (Animate On Scroll) |
| Icons | Font Awesome (static CSS) |
| Contact | EmailJS + invisible reCAPTCHA v2 |
| Blog | Medium RSS via rss2json |
| Analytics | Vercel Analytics |
| Sitemap | next-sitemap (postbuild) |

## Contributing

This is a personal portfolio. Issues and pull requests are not accepted.

For bugs you spot, feel free to reach out via the contact form on the live site.

## License

All rights reserved © Myo Win Thein. The source is published for reference and transparency only; it is not licensed for reuse, redistribution, or derivative works. Brand assets, copy, portfolio screenshots, and embedded third-party logos retain their respective owners' rights.

<!-- last-reviewed: 90f1837 -->
