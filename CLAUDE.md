# CLAUDE.md — Portfolio Project Reference

Read this before making any changes. This is persistent project memory for Claude sessions.

---

## Project Overview

Personal portfolio for **Myo Win Thein (Martin)** — Senior Backend Engineer based in Bangkok. Live at `myowin.dev`. Built on a commercial "Tunis" React template, heavily customised over time.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 13.0.2, Pages Router |
| Language | JavaScript / JSX (no TypeScript) |
| Styling | SCSS (custom, no Tailwind, no CSS Modules) |
| UI | Bootstrap 5 (grid/utilities only), react-tabs, react-modal, react-awesome-slider |
| Animation | AOS (Animate On Scroll) |
| Icons | Font Awesome (legacy `fa fa-*` and modern `fa-solid`/`fa-brands fa-*` both used) |
| Fonts | Poppins, Open Sans (Google Fonts) |
| Contact | EmailJS + invisible reCAPTCHA v2 |
| Blog | Medium RSS via rss2json API |
| Analytics | Vercel Analytics |
| Cursor | react-animated-cursor (amber `255, 160, 1`) |
| Sitemap | next-sitemap |
| Dev port | 4000 (`next dev -p 4000`) |

---

## Architecture & Folder Structure

```
src/
  pages/
    _app.jsx              # AOS init, AnimatedCursor, ContextProvider, Analytics
    index.jsx             # Re-exports HomeDark (entry point)
    home-dark.jsx         # Full single-page layout; all sections live here
    404.jsx
  layout/
    wrapper.jsx           # Injects reCAPTCHA script + ToastContainer
  components/
    Seo.jsx               # <Head> meta/OG tags
    Address.jsx           # Contact address block
    Social.jsx            # Social icon links
    Contact.jsx           # EmailJS contact form
    about/
      index.jsx           # About section layout orchestrator
      PersonalInfo.jsx    # Personal info key-value list
      Achievements.jsx    # Stat boxes (years, projects, etc.)
      Skills.jsx          # Tabbed skill icon grid
      Experience.jsx      # Work timeline
      Education.jsx       # Education timeline
    blog/
      Blog.jsx            # Medium RSS cards + post modal
    hero/
      Hero.jsx            # Hero section + About modal
    portfolio/
      Portfolio.jsx       # Tabbed project card grid
      PortfolioModal.jsx  # Full-screen media modal with AwesomeSlider
      portfolioData.js    # Static project data (categories → projects)
    switch/
      SwitchDark.jsx      # Dark/light theme toggle
  Context/
    ContextProvider.js    # React Context wrapping AllBlogData
  Hooks/
    AllBlogData.js        # Medium RSS fetch + modal state
    UseData.js            # useContext shorthand hook
  styles/
    index.scss            # Entry: imports AOS, Font Awesome, main.scss, plugins
  config.js               # Single source of truth: personal info, URLs, meta, toast options
utils/
  theme.js                # Toggles .light/.dark on <body>, persists to localStorage
public/assets/scss/
  main.scss               # Imports all partials + skin
  main/
    _style.scss           # Global base styles, typography, light/dark body rules
    _portfolio.scss       # Portfolio grid, tab styles
    _portfolio-modal.scss # Full-screen portfolio modal; defines breakpoint variables
    _modal.scss           # react-modal (blog, hero About)
    _switcher.scss        # Theme toggle switch
    _slick.scss           # Carousel overrides
    _circle.scss          # Circle skill bars (legacy, unused)
    _404.scss
    _preview.scss
    skins/
      _yellow.scss        # Accent colour rules using --main-primary-color
```

---

## Routing & Page Structure

This is a **single-page tab application**, not a multi-route site.

All sections are `<TabPanel>` components inside `home-dark.jsx`, driven by `react-tabs`. Do not add new Next.js routes for new sections — add them as `<TabPanel>` entries and update the `menuItem` array.

Tab order: Home → Work → Profile → Writing → Contact

Navigation labels come from `config.js` → `menuLabels`.

---

## Styling & Design System

- **SCSS only.** Never introduce Tailwind, CSS Modules, or styled-components.
- Accent colour: `--main-primary-color: #2CB1BC` (teal), defined in `_style.scss`.
- Theme: body class `.light` vs default dark. Toggle via `utils/theme.js`.
- Dark background: `#021B1D`. Light background: `#F5F5F4`.
- SCSS breakpoint variables are defined in `_portfolio-modal.scss` (e.g. `$tab-land: 62em`, `$mbl-land: 35.9375em`).
- Bootstrap used for grid/spacing utilities only — avoid adding Bootstrap component JS.

### Key CSS Patterns

**Section title block:**
```jsx
<div className="title-section text-start text-sm-center">
  <h1>word <span>highlighted</span></h1>
  <span className="title-bg">BACKGROUND LABEL</span>
</div>
```

**CTA button:**
```jsx
<a className="button" href="..." target="_blank" rel="noreferrer">
  <span className="button-text">Label</span>
  <span className="button-icon fa fa-icon-name"></span>
</a>
```

**Skill icon:**
```jsx
<div className="pLogo p25 position-relative">
  <Image src={icon} alt={name} />
</div>
<small className="open-sans-font d-block text-center mt-2">{name}</small>
```
`.pLogo` = 8em × 8em circle, `#252525` bg, SVG icons at 54×54px.

**Timeline list item (Experience/Education):**
```jsx
<li>
  <div className="icon"><i className="fa fa-briefcase"></i></div>
  <small className="d-block text-uppercase">{year}</small>
  <h5 className="poppins-font text-uppercase">{title}</h5>
  <p className="place open-sans-font">{company}</p>
  <p className="open-sans-font text-gray mb-3">• detail text</p>
</li>
```

---

## Animation Philosophy

- AOS drives entrance animations universally. Default: `data-aos="fade-up"` with `data-aos-duration="1200"`.
- Use `data-aos="fade-right"` for grid items.
- AOS is initialised once in `_app.jsx` — do not re-initialise elsewhere.
- Modals use `closeTimeoutMS={500}` for exit animation.
- Keep transitions subtle; avoid adding JavaScript-driven animation libraries (Framer Motion, GSAP, etc.).

---

## Data & Configuration

- **All personal info** (name, location, URLs, meta) → `src/config.js`. This is the single source of truth.
- **Portfolio projects** → `src/components/portfolio/portfolioData.js` — static JS array, grouped by category. Each category has `title`, `description`, and `projects[]`.
- **Blog data** → fetched at runtime from Medium RSS; state managed in `AllBlogData.js` and shared via Context.
- **Experience/Education** → hardcoded arrays inside `Experience.jsx` and `Education.jsx`.
- **Skills** → hardcoded array inside `about/index.jsx`, passed as props to `Skills.jsx`.

---

## Coding Conventions

- **Files:** PascalCase for components (`Hero.jsx`), camelCase for hooks and data (`portfolioData.js`, `UseData.js`).
- **CSS classes:** kebab-case, BEM-ish (`.portfolio-main`, `.tab-content`, `.post-container`).
- **Components:** functional only, no class components.
- **Images:** use Next.js `<Image>` for local assets; custom `loader` prop for external URLs (blog thumbnails).
- **No comments** unless the reason is non-obvious. No docblocks.
- **No TypeScript.** Keep all files `.js` / `.jsx`.
- **No error handling** for internal code paths — only at system boundaries (API calls, form submission).

---

## UI/UX Philosophy

- Dark-first design. Light mode is a secondary toggle, not a primary concern.
- Dense but clean: show credentials and work without decorative filler.
- Tabs keep everything in one scroll-free context — avoid deep nesting or multiple pages.
- Modals are used for detail expansion (portfolio project, blog post, About) — not for navigation.
- Animated cursor (`react-animated-cursor`) is a deliberate personality choice — do not remove it.

---

## Portfolio Data Shape

Each project entry in `portfolioData.js`:
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
Video files are served from `public/assets/portfolio/<slug>/`. Videos auto-play when their slide is active (controlled in `PortfolioModal.jsx`).

---

## Deployment

- Hosted on Vercel. Site URL: `https://myowin.dev`.
- `SITE_URL` env var must be set in Vercel project settings. A local `.env.production` file exists on disk for local builds but is intentionally not tracked in git — do not commit it.
- Sitemap auto-generated post-build via `next-sitemap` → `next-sitemap.config.js`.
- `meta name="robots"` is `index, follow` in `Seo.jsx`.

---

## Intentional Constraints

- **No TypeScript** — project predates that decision; adding it now would create churn without benefit.
- **No additional routing** — all new sections go inside the existing tab structure in `home-dark.jsx`.
- **No new state management libraries** — blog state via Context is the only global state needed.
- **Bootstrap grid only** — Bootstrap's JS and component system are not used; avoid importing them.
- **Font Awesome mixed syntax** — legacy `fa` and modern `fa-solid`/`fa-brands` coexist; do not refactor unless explicitly asked.
- **rss2json API key** in `config.js` is public-facing by design (rate-limited, read-only RSS proxy).
- **EmailJS credentials** in `Contact.jsx` are public-facing by design (client-side email sending).

---

## Git Workflow Rules

- Commit after each logically complete change.
- Keep commits small and focused — do not bundle unrelated changes.
- Use conventional commit messages: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`.
- Never leave completed work uncommitted.
- Git history is the source of truth for detailed changes — do not log changes in this file.

---

## CLAUDE.md Maintenance Rules

- Update this file only when **long-term project understanding changes** (new section, architectural decision, new dependency, intentional constraint).
- Do not update for UI copy tweaks, colour adjustments, or one-off fixes.
- Keep entries concise — favour stable facts over verbose explanation.
