# CLAUDE.md — Portfolio Project Reference

Read this before making any changes.

---

## What This Is

Personal portfolio for **Myo Win Thein (Martin)** — Senior Software Engineer, Bangkok. Live at `myowin.dev`. Built on the commercial "Tunis" React template (ib-themes), heavily customised.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 13.0.2, Pages Router |
| Language | JavaScript / JSX (no TypeScript) |
| Styling | SCSS (custom partials in `public/assets/scss/`; no Tailwind, no CSS Modules) |
| UI | Bootstrap 5 grid only, react-tabs, react-modal, react-awesome-slider |
| Animation | AOS (Animate On Scroll) |
| Icons | Font Awesome — static CSS file in `public/assets/fonts/font-awesome/` |
| Fonts | Poppins, Open Sans (Google Fonts, loaded in SCSS) |
| Contact | EmailJS + invisible reCAPTCHA v2 |
| Blog | Medium RSS via rss2json API |
| Analytics | Vercel Analytics |
| Cursor | react-animated-cursor (amber `255, 160, 1`), SSR-disabled via `dynamic` |
| Sitemap | next-sitemap (runs post-build via `"postbuild"` npm script) |
| Dev port | **4000** (`next dev -p 4000`) — not the Next.js default 3000 |

---

## Architecture

### Single-page tab application

All five sections (Home, Work, Profile, Writing, Contact) are `<TabPanel>` components inside `home-dark.jsx`, driven by `react-tabs`. **Never add new Next.js pages for new sections** — add them as `<TabPanel>` entries and extend the `menuItem` array in `home-dark.jsx`.

The only real routes are `/` (redirects to home-dark) and `/404`.

### Content is static by design

| Data | Location |
|---|---|
| Personal info, URLs, meta, keys | `src/config.js` — single source of truth |
| Portfolio projects | `src/components/portfolio/portfolioData.js` — static JS array |
| Work experience | Inline array in `Experience.jsx` |
| Education | Inline array in `Education.jsx` |
| Skills | Inline array in `about/index.jsx`, passed as props to `Skills.jsx` |

**Blog is the only runtime data** — fetched from Medium RSS via rss2json, managed in `AllBlogData.js` (custom hook), shared globally via React Context (`ContextProvider.js`). This is the only piece of global state in the project.

### Key files

```
src/
  pages/
    _app.jsx        # AOS init, AnimatedCursor, ContextProvider, Analytics
    home-dark.jsx   # Full single-page layout — all five TabPanels live here
  config.js         # All personal info, URLs, meta, API keys
  components/
    portfolio/
      portfolioData.js    # Project data: grouped by category
      PortfolioModal.jsx  # Media carousel — uses createPortal to document.body
    about/
      index.jsx           # Skills data defined here, also imports icon SVGs
      Experience.jsx      # Shows 3 companies by default; expand toggle reveals rest
  layout/
    wrapper.jsx     # Loads reCAPTCHA script, wraps ToastContainer
utils/
  theme.js          # Applies/removes .light body class, persists to localStorage
public/assets/
  portfolio/        # Per-project screenshots and demo videos (mp4)
  scss/             # All SCSS: main.scss imports partials from main/
```

### Styling

- **SCSS only.** Entry: `src/styles/index.scss` → imports Bootstrap CSS + Google Fonts, then `public/assets/scss/main.scss` → all partials.
- Dark background: `#021B1D`. Light background: `#F5F5F4` (`.light` body class overrides).
- Accent: `--main-primary-color: #2CB1BC` (teal), defined in `_style.scss`.
- SCSS breakpoint variables are in `_portfolio-modal.scss` (e.g. `$tab-land: 62em`).
- The wrapper class in `home-dark.jsx` is `.yellow` — this is a legacy template classname, not a colour.

---

## Known Traps & Warnings

### Don't touch routing — tabs only
Adding a new Next.js page or link will break the single-page design. New content goes inside an existing `<TabPanel>` or a new one in `home-dark.jsx`.

### PortfolioModal renders via createPortal
`PortfolioModal.jsx` mounts to `document.body`, not inline. Body scroll is locked (`overflow: hidden`) on open and restored on unmount. Any z-index or stacking context issues must account for this.

### iOS Safari video autoplay workaround
The first video in PortfolioModal retries `play()` after 600ms because AwesomeSlider's entrance animation blocks iOS Safari from starting video during the transition. This is intentional — do not remove the timer.

### reCAPTCHA rendered programmatically via polling
`Contact.jsx` loads the reCAPTCHA script dynamically in `wrapper.jsx` then polls `window.grecaptcha` every 150ms until ready. The widget is invisible v2, rendered once and reset after each submission. Do not attempt to declaratively render `<div class="g-recaptcha">` — it will conflict.

### Font Awesome is a static file, not an npm package
FA CSS lives at `public/assets/fonts/font-awesome/css/font-awesome.min.css`. Both legacy `fa fa-*` and modern `fa-solid`/`fa-brands fa-*` syntax coexist — do not refactor to one style unless explicitly asked.

### `totalExperiences` is computed at build time
`src/config.js` calculates years of experience as `currentYear - 2013`. The displayed number changes automatically each year on redeploy.

### Skills `core: true` flag
Skill entries in `about/index.jsx` have an optional `core: true` flag. Check `Skills.jsx` for how this is rendered before adding/removing it.

### Environment variable for sitemap
`next-sitemap.config.js` reads `process.env.SITE_URL`. `src/config.js` checks `NEXT_PUBLIC_SITE_URL` first, then `SITE_URL`. Both need to be set in Vercel project settings. A local `.env.production` exists on disk but is intentionally gitignored.

### Bootstrap JS is not loaded
Only Bootstrap's CSS grid is imported (in `main.scss` via `bootstrap/dist/css/bootstrap.css`). No Bootstrap JS or component behaviour is available.

---

## Portfolio Data Shape

Each project in `portfolioData.js`:

```js
{
  company, industry, product, productType, role,
  description: ['paragraph 1', 'paragraph 2'],
  banner: importedImage,
  media: [
    { type: 'image', url: importedImage },
    { type: 'video', url: '/assets/portfolio/slug/v1.mp4' },
  ],
  preview: [
    { platform: 'Web', url: 'https://...' },
  ],
}
```

- `media` items appear in the AwesomeSlider in order. Videos auto-play on the active slide.
- `preview` is optional — renders "N/A" in the modal if empty array or missing.
- Video files are served statically from `public/assets/portfolio/<slug>/`.
- Projects are grouped by category. The category `title` is passed to the modal as `modalCategory`.

---

## Next.js Conventions

### Routing — Pages Router only

Pages Router throughout. No App Router, no migration in progress.

Actual routes: `src/pages/index.jsx` (re-exports `HomeDark`) and `src/pages/404.jsx`. No dynamic routes, no route groups, no middleware, no protected routes. The entire application lives inside one tab layout in `home-dark.jsx`.

### Rendering — SSG with CSR content

Next.js Pages Router defaults every page to SSG (no `getServerSideProps`, `getStaticProps`, or `getStaticPaths` exist anywhere). In practice, all visible content is rendered client-side:

- Static content (portfolio, experience, skills) renders in the browser on first load
- Blog is fetched at runtime via `useEffect` → `fetch()` in `AllBlogData.js`
- No ISR, no SSR, no server-side data fetching of any kind

### No `"use client"` / `"use server"` directives

These are App Router constructs — none exist in this codebase. Every component runs on the client. The only SSR exception is AnimatedCursor, which is explicitly opted out: `dynamic(() => import('react-animated-cursor'), { ssr: false })`.

### Client-only code — no guards needed at the component level

Because all components render in the browser, `localStorage`, `document`, and `window` can be used inside `useEffect` without SSR guards. Evidence: `utils/theme.js` directly calls `localStorage.setItem` and `document.querySelector` — it works because it's only ever called from inside `useEffect` in `SwitchDark.jsx`.

### Data fetching — one runtime fetch, everything else static

| Source | Mechanism |
|---|---|
| Blog posts | `fetch()` inside `useEffect` in `AllBlogData.js` |
| Everything else | Static JS imports / inline arrays |

No SWR, no TanStack Query, no axios, no Route Handlers, no API routes (`pages/api/` does not exist). The rss2json call is the only outbound HTTP request the app makes. No caching strategy — data is fetched once on mount with no revalidation.

Error handling: `fetch` failure in `AllBlogData.js` shows a toast and sets `isLoading: false`. No retry logic.

### Server Actions — not used

Server Actions require Next.js 14+. This project is 13.0.2. They do not exist here and should not be added.

### API layer — none

There are no API routes. No `pages/api/` directory. External services are called directly from the client:

- **Blog**: `fetch()` to `api.rss2json.com` from `AllBlogData.js`
- **Contact**: `@emailjs/browser` called from `Contact.jsx`

No authentication, no server-side request handling of any kind.

### State management

| Scope | Mechanism | Location |
|---|---|---|
| Blog feed + modal | React Context | `ContextProvider.js` wraps `AllBlogData()` hook |
| Portfolio modal | `useState` | `Portfolio.jsx` (local) |
| Contact loading | `useState` | `Contact.jsx` (local) |
| Experience expand | `useState` | `Experience.jsx` (local) |
| Theme | `localStorage` + body class | `utils/theme.js` + `SwitchDark.jsx` |

The Context pattern is the project's only global state. The custom hook `AllBlogData.js` owns blog state; `ContextProvider.js` wraps it in a context; `UseData.js` is a one-liner `useContext` shorthand used by consumers. **Do not add Zustand, Redux, or any state library** — local `useState` or this Context pattern is the correct choice for any new state.

### Component architecture

All components are functional with hooks. No class components anywhere. Organized by section under `src/components/`: `hero/`, `about/`, `portfolio/`, `blog/`, `switch/`. Shared leaf components (`Seo.jsx`, `Address.jsx`, `Social.jsx`) live directly in `src/components/`.

No atomic design, no feature modules beyond the section grouping that already exists.

### Forms

One contact form (`Contact.jsx`). No form library. Validation is HTML5 `required` only. Submission flow: reCAPTCHA execute → token callback → `emailjs.sendForm()`. Do not introduce React Hook Form or Zod unless explicitly asked.

### Metadata

`Seo.jsx` uses `next/head` — the Pages Router approach. **Not** the App Router `Metadata` API. All meta values come from `src/config.js`. Includes OG tags, Twitter card, JSON-LD Person schema, and favicon links.

### `next/image` usage

Used for all local images with `sizes` prop for responsive hints. External images (blog thumbnails) require a custom `loader` prop that passes the URL through unchanged — this bypasses Next.js image optimisation for remote sources and is the established pattern in `Blog.jsx`.

### No TypeScript

All files are `.js` / `.jsx`. No `tsconfig.json`. Do not introduce TypeScript files.

### Build tooling

ESLint only (`next/core-web-vitals`). No Prettier, no Husky, no lint-staged, no Turbopack. Standard webpack. The only post-processing step is `next-sitemap` via the `postbuild` npm script.

### Naming conventions

| Item | Convention | Example |
|---|---|---|
| Pages | lowercase kebab-case | `home-dark.jsx` |
| Components | PascalCase | `PortfolioModal.jsx` |
| Hooks | PascalCase (unusual) | `AllBlogData.js`, `UseData.js` |
| Data files | camelCase | `portfolioData.js` |
| Utils | camelCase | `theme.js` |
| CSS classes | kebab-case | `.portfolio-main`, `.post-container` |

The PascalCase hook naming is a pre-existing pattern — follow it for any new hooks.

---

## Operational Context

```sh
npm run dev     # http://localhost:4000
npm run build   # Next.js build + sitemap generation (postbuild hook)
```

Deployed on Vercel. Site URL: `https://myowin.dev`.

---

## Intentional Constraints

- **No TypeScript** — migration cost outweighs benefit at this scope.
- **No new Next.js routes** — all sections are tabs inside `home-dark.jsx`.
- **No new state management libraries** — blog state via Context is the only global state needed.
- **No Bootstrap JS** — grid/utilities only.
- **No new animation libraries** — AOS only; no Framer Motion, GSAP, etc.
- **Pages Router is intentional** — no plans to migrate to App Router.

---

## Git Workflow

- Commit after each logically complete change.
- Keep commits small and focused — do not bundle unrelated changes.
- Use conventional commit messages: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`.
- Never leave completed work uncommitted.

---

## Operational Safety

### Environments

| Environment | URL | How deployed | Safe to test? |
|---|---|---|---|
| Local | `localhost:4000` | `npm run dev` | Yes |
| Production | `myowin.dev` | Auto on push to `main` | No |

There is no staging environment. There are no preview branches. The only branch is `main`, and it is directly connected to Vercel production. There is no CI gate, no test requirement, and no approval step before deployment goes live.

### Development commands

```sh
npm run dev     # dev server at localhost:4000
npm run build   # production build + runs next-sitemap (postbuild)
npm run lint    # ESLint (next/core-web-vitals)
npm run start   # serve production build locally (requires prior build)
```

`npm run start` requires a completed `npm run build` first. Running it without a build will fail.

### Minimum checks before committing

There are no pre-commit hooks, no test suite, and no CI pipeline. The only automated checks are:

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Feature verified manually in the browser at `localhost:4000`

Manual browser verification is the only way to confirm UI changes work correctly.

---

### Deployment risks

**Risk**: Pushing to `main` triggers automatic production deployment.

Vercel is connected to `git@github.com:myowinthein/my-portfolio.git` on the `main` branch. Every push to `main` deploys immediately to `https://myowin.dev` with no CI gate, no test run, and no approval step.

**Instruction**: Never push to `main` without explicit confirmation from the user. Always confirm the intent before running `git push` or `git push origin main`.

---

**Risk**: Force-push to `main` would rewrite public git history and potentially break the Vercel deployment state.

**Instruction**: Never force-push to `main` under any circumstances.

---

### Build side effects

**Risk**: `npm run build` overwrites generated SEO files.

The `postbuild` script runs `next-sitemap` automatically after every build. This regenerates and overwrites `public/robots.txt`, `public/sitemap.xml`, and `public/sitemap-0.xml`. These files are gitignored and should never be manually edited — they are always overwritten on the next build.

**Instruction**: Never manually edit `public/robots.txt`, `public/sitemap.xml`, or `public/sitemap-0.xml`. They are build artefacts.

---

### Secret and credential risks

**Risk**: `.env.production` exists on disk but is gitignored.

The file at `.env.production` contains `SITE_URL=https://myowin.dev/`. It is gitignored (listed in `.gitignore` as `.env.production`). It must never be committed.

**Instruction**: Never stage or commit `.env.production`. If git status shows it as untracked, do not add it.

---

**Risk**: Client-side credentials in source code are intentional — do not treat them as leaked secrets.

`src/config.js` contains the rss2json API key. `src/components/Contact.jsx` contains EmailJS service ID, template ID, and public key, plus the reCAPTCHA site key. These are public-facing by design (client-side only, rate-limited or read-only services). They are not secrets that need rotation or removal.

**Instruction**: Do not move these values to environment variables, remove them, or flag them as security issues. They are intentionally public.

---

**Risk**: Printing credential values into chat output.

**Instruction**: Never reproduce the values of any key, token, or credential found in source files into the conversation, even if they are intentionally public.

---

### Git risks

**Risk**: Single branch (`main`) with no protected branch rules enforced locally.

There are no active pre-commit hooks and no branch protection rules visible in the local git config. Nothing prevents a destructive operation locally.

**Instruction**: Treat `main` as production-protected even though no local hook enforces it. Always confirm before any push, reset, or rebase that affects `main`.

---

**Risk**: `git reset --hard` or `git checkout .` would discard uncommitted work with no recovery path.

**Instruction**: Never run destructive git operations (`reset --hard`, `checkout .`, `restore .`, `clean -f`) without explicit user confirmation and verification that no unsaved work exists.

---

### Project-specific risks

**Risk**: `public/assets/portfolio/` contains large binary files (mp4 videos, webp/jpeg images) tracked in git.

Accidentally staging large binaries or running `git add .` could bloat the repository. There is no `.gitattributes` LFS configuration.

**Instruction**: When staging files, add specific files by name. Never use `git add .` or `git add -A` without reviewing what will be staged, particularly after adding new media assets to `public/assets/portfolio/`.

---

**Risk**: The sitemap config excludes `/home-dark` from the sitemap but the page exists.

`next-sitemap.config.js` explicitly excludes `/home-dark`. This is intentional — the canonical URL is `/`, not `/home-dark`. Do not remove this exclusion.

**Instruction**: Do not modify `next-sitemap.config.js` without understanding that `/home-dark` exclusion is deliberate.

---

## Development Rules

Project-specific rules for writing code that fits this codebase:

- **`.claude/rules/nextjs.md`** — which Next.js features to use and which to reject (Pages Router only, no App Router constructs, no Server Actions, no Route Handlers, metadata via `next/head`)
- **`.claude/rules/conventions.md`** — naming, file organization, component patterns, styling, state management, data entry

The architecture guide at `.claude/docs/nextjs.md` targets App Router on Next.js 15 and **does not apply to this project**. Treat it as reference material only. The rules files above describe the correct patterns for this codebase.

---

## CLAUDE.md Maintenance

Update only when long-term project understanding changes: new section, architectural decision, new dependency, intentional constraint. Do not update for UI copy tweaks, colour adjustments, or one-off fixes.
