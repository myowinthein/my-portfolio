# CLAUDE.md

## 1. Project Identity

Personal portfolio for **Myo Win Thein (Martin)** — Senior Software Engineer, Bangkok. Built on the commercial "Tunis" React template (ib-themes), heavily customised. Live at `https://myowin.dev`.

**Stack:** Next.js 13.0.2 (Pages Router) · React 18 · JavaScript/JSX only (no TypeScript) · SCSS (Bootstrap 5 grid, no Tailwind, no CSS Modules) · AOS · EmailJS + invisible reCAPTCHA v2 · Medium RSS via rss2json · next-sitemap · Vercel Analytics

**Blast radius:** Every push to `main` deploys immediately to production on Vercel. There is no CI gate, no test suite, no preview branch, no approval step.

**Workflow:** Solo mode. Commits go direct to `main`; no feature branches, no PRs required. Full git conventions in `.claude/rules/git.md`.

---

## 2. Project Config

- `git-solo: true` — commit directly to `main`, no feature branches, no PRs. See `.claude/rules/git.md`.

---

## 3. Dev Commands

```sh
npm run dev         # localhost:4000  (NOT default 3000)
npm run build       # next build + next-sitemap (postbuild)
npm run lint        # next/core-web-vitals
npm run start       # serve production build (requires prior build)
npm test            # vitest run (utils/**/*.test.js only)
npm run test:watch  # vitest watch mode
```

Test scope is intentionally limited to `utils/` — pure helpers like `sentenceCase` and `handleSwitchValue`. There is no Testing Library, no JSDOM, no component tests. No type-check (no TypeScript). No Prettier, Husky, lint-staged, or pre-commit hooks. Lint + build + tests + manual browser check at `localhost:4000` are the only verification options.

---

## 4. Architecture Pointers

- `src/pages/home-dark.jsx` — entire single-page tab app; every section is a `<TabPanel>` here. New content goes INSIDE this file, not as new routes.
- `src/pages/index.jsx` — re-exports `HomeDark`. `/404.jsx` is the only other page.
- `src/config.js` — single source of truth for personal info, URLs, meta, API keys, and `summary[]` (first paragraph reused as SEO meta description).
- `utils/text.js` — `sentenceCase` helper used by `config.js` to format `${position}` inside the summary.
- `src/components/portfolio/portfolioData.js` — static projects grouped by category. Each entry: `{ company, industry, product, productType, role, description[], banner, media[], preview[] }`.
- `src/components/portfolio/PortfolioModal.jsx` — uses `createPortal` to mount on `document.body`; locks/restores body scroll on open/close.
- `src/components/about/index.jsx` — skill categories defined inline; passed to `Skills.jsx`. Skills with `core: true` render a crown badge.
- `src/components/about/Skills.jsx` — `CORE_COUNT = 4` defaults to showing first 4 categories; "Show more" reveals the rest.
- `src/components/hero/Hero.jsx` — imports `summary` and `roleTags` from config; do not duplicate strings here.
- `src/Hooks/AllBlogData.js` — the only runtime HTTP call in the app (Medium RSS → rss2json). State shared via `ContextProvider.js`.
- `src/components/Contact.jsx` — contact form; reCAPTCHA v2 invisible + EmailJS, polled init via `window.grecaptcha`.

SCSS entry: `src/styles/index.scss` → `public/assets/scss/main.scss` → partials. Accent colour `--main-primary-color: #2CB1BC`. Dark bg `#021B1D`, light bg `#F5F5F4` (`.light` body class).

---

## 5. Behavior Rules

- **No new Next.js pages.** All sections live as `<TabPanel>` entries inside `home-dark.jsx`. Adding routes breaks the single-page design.
- **No new state libraries.** Local `useState` for component state; the Context pattern in `ContextProvider.js` is the only global state (blog feed). Never add Zustand, Redux, SWR, TanStack Query, axios, etc.
- **No new animation libraries.** AOS only. No Framer Motion, GSAP.
- **No TypeScript.** Files stay `.js` / `.jsx`. Do not introduce a `tsconfig.json`.
- **No App Router constructs.** No `"use client"` / `"use server"`, no `app/` directory, no Server Actions (Next 13.0.2 doesn't support them), no Route Handlers, no `pages/api/`. Metadata via `next/head` in `Seo.jsx`.
- **No SSR data fetching.** No `getServerSideProps`, `getStaticProps`, `getStaticPaths`. All content is static imports or `fetch()` in `useEffect`.
- **Always run `npm run lint`, `npm test`, and `npm run build` before commit.** No CI catches errors otherwise.
- **Use conventional commit messages and keep commits small.** Full type list and branch/squash conventions: `.claude/rules/git.md`.
- **Stage files explicitly** by name; never `git add .` or `git add -A` (risk of pulling in large media binaries or `.env.production`).

---

## 6. Hard Safety Rules

- **Never push to `main` without explicit user confirmation.** Push = production deploy.
- **Never force-push to `main`** under any circumstances.
- **Never commit `.env.production`** (gitignored; contains `SITE_URL`).
- **Never reproduce credential values in chat output** even when intentionally public (rss2json key, EmailJS IDs, reCAPTCHA site key live in `src/config.js` / `Contact.jsx`).
- **Never manually edit `public/robots.txt`, `public/sitemap.xml`, `public/sitemap-0.xml`** — build artefacts; `next-sitemap` overwrites on every build.
- **Never run destructive git** (`reset --hard`, `checkout .`, `clean -f`) without explicit confirmation.

Full operational risk scan and instructions: `.claude/rules/safety.md`.

---

## 7. Known Traps

- **`PortfolioModal` mounts via `createPortal` to `document.body`** — z-index and stacking-context issues need to account for this.
- **iOS Safari video autoplay quirk:** the first video in `PortfolioModal` retries `play()` after 600ms because AwesomeSlider's entrance animation blocks autoplay during the transition. The timer is intentional.
- **reCAPTCHA is loaded dynamically** in `wrapper.jsx` and Contact polls `window.grecaptcha` every 150ms until ready. Do not switch to declarative `<div class="g-recaptcha">` — it conflicts.
- **Font Awesome is a static CSS file** at `public/assets/fonts/font-awesome/css/font-awesome.min.css`, not an npm package. Both `fa fa-*` and `fa-solid` / `fa-brands fa-*` syntaxes coexist intentionally.
- **`totalExperiences` is build-time computed** in `config.js` as `currentYear - 2013`. Displayed value bumps on every yearly redeploy.
- **`next/image` cannot render raw SVGs.** `next.config.js` is intentionally minimal (`reactStrictMode` only) — do NOT add `dangerouslyAllowSVG`. For brand SVGs that need to feed `<Image>`, rasterize to WebP first (see `public/assets/portfolio/job_buddy/banner.webp`).
- **Bootstrap JS is not loaded.** Only the CSS grid is imported. No dropdowns, modals, tooltips from Bootstrap.
- **Sitemap excludes `/home-dark`** in `next-sitemap.config.js` deliberately — canonical URL is `/`, not `/home-dark`.
- **External blog images** require a custom Next `<Image>` `loader` prop that returns the URL unchanged (see `Blog.jsx`). Do not configure `remotePatterns` instead.
- **`SITE_URL` needs both `NEXT_PUBLIC_SITE_URL` and `SITE_URL`** in Vercel project settings (used by `config.js` and `next-sitemap.config.js` respectively).

<!-- last-reviewed: 6804549 -->
