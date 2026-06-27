# myowin.dev

Personal portfolio for **Myo Win Thein (Martin)** — Senior Software Engineer.

**Live:** [myowin.dev](https://myowin.dev)

---

## Stack

| | |
|---|---|
| Framework | Next.js 13 (Pages Router), React 18 |
| Language | JavaScript / JSX |
| Styling | SCSS — custom partials, no Tailwind or CSS Modules |
| UI | Bootstrap 5 (grid/utilities only), react-tabs, react-modal, react-awesome-slider |
| Animation | AOS (Animate On Scroll) |
| Icons | Font Awesome |
| Contact | EmailJS + invisible reCAPTCHA v2 |
| Blog | Medium RSS feed via rss2json API |
| Analytics | Vercel Analytics |
| Sitemap | next-sitemap (generated post-build) |

---

## Highlights

- Single-page tab navigation — no route changes, all sections within one layout
- Portfolio grouped by category with per-project image/video media carousel
- Writing section pulls from Medium RSS feed, displayed in a modal reader
- Dark/light theme toggle with `localStorage` persistence
- Contact form with invisible reCAPTCHA v2 and EmailJS delivery
- Custom animated cursor
- Sitemap and robots.txt auto-generated at build time

---

## Architecture

All five sections (Home, Work, Profile, Writing, Contact) are `react-tabs` TabPanels inside a single page. No additional routes exist beyond the 404.

**Content is static by design.** Personal info lives in `src/config.js`, portfolio projects in `portfolioData.js`, and experience/education are inline arrays in their respective components. No CMS, no database, no API layer.

**Blog is the only dynamic data.** Fetched from Medium's RSS feed at runtime, managed in a custom hook (`AllBlogData`), and shared globally via React Context — the only piece of global state in the project.

**Styling is dark-first.** Base SCSS defines the dark theme; the `.light` body class overrides it. A single CSS variable (`--main-primary-color`) drives the accent colour throughout. Theme choice persists via `localStorage`.

---

## Project Structure

```
src/
  pages/           # index, home-dark (full tab layout), 404
  components/      # Grouped by section: hero, about, portfolio, blog, switch
  layout/          # Wrapper — reCAPTCHA script injection, ToastContainer
  Context/ Hooks/  # Blog feed state (the only global state)
  styles/          # SCSS entry point
  config.js        # Single source of truth: personal info, URLs, meta, keys
utils/
  theme.js         # Applies/removes .light body class, persists to localStorage
public/
  assets/
    portfolio/     # Per-project screenshots and demo videos
    img/           # Hero images, UI assets
    scss/          # SCSS partials and skin
```

---

## Local Development

```sh
npm install
npm run dev        # starts on http://localhost:4000
```

Create a `.env.production` file in the project root (not tracked in git):

```
SITE_URL=https://myowin.dev/
```

---

## Deployment

```sh
npm run build      # Next.js build + sitemap generation
```

Deployed on Vercel. `SITE_URL` must be configured in Vercel project environment settings.

---

## Notes

- Pages Router is intentional — no plans to migrate to App Router.
- No TypeScript — migration cost outweighs benefit at this scope.
- Bootstrap's JS and component layer are not loaded; only the grid is used.
- To update personal info, social links, or page metadata: edit `src/config.js` only.
