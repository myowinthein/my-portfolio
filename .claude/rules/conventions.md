# Development Conventions

These rules describe how code should be written in this project. Follow them for any new component, hook, data entry, or style change.

---

## Language

JavaScript and JSX only. All files use `.js` or `.jsx` extensions. Do not introduce TypeScript, `.ts`, `.tsx`, or `tsconfig.json`.

## File Naming

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `PortfolioModal.jsx` |
| Pages | lowercase kebab-case | `home-dark.jsx` |
| Hooks | PascalCase (project convention) | `AllBlogData.js`, `UseData.js` |
| Data files | camelCase | `portfolioData.js` |
| Utils | camelCase | `theme.js` |

The PascalCase hook naming is not standard React convention, but it is the established pattern in this project. Follow it for any new hooks.

## Component Rules

- Functional components only — no class components
- No prop types, no TypeScript types
- No default comment blocks or JSDoc
- No comments unless the reason is non-obvious to a future reader

## Folder Structure

Place new files in the existing structure:

- New section components → `src/components/<section>/`
- Shared leaf components → `src/components/`
- New hooks → `src/Hooks/`
- Static data → `src/components/<section>/` alongside the component that owns it
- Utilities → `utils/`
- Personal info, URLs, meta, API keys → `src/config.js` only

Do not create `features/`, `actions/`, `server/`, `lib/`, or `types/` directories — these are App Router conventions that do not belong here.

## Styling

SCSS only. Never introduce Tailwind, CSS Modules, or styled-components.

- CSS class names: kebab-case (`portfolio-main`, `post-container`)
- Dark theme is the default. Light theme is applied via the `.light` body class
- Accent colour: `--main-primary-color: #2CB1BC`, defined in `_style.scss`
- Dark background: `#021B1D`. Light background: `#F5F5F4`
- Breakpoint variables are in `public/assets/scss/main/_portfolio-modal.scss`
- New styles go in the appropriate existing partial under `public/assets/scss/main/`

## State Management

Use local `useState` for component-level state. Use the existing React Context pattern (via `ContextProvider.js` + `AllBlogData.js`) only for state that must be shared across the blog section and its modal.

Do not introduce Zustand, Redux, Jotai, MobX, or any other state management library.

## Forms

The contact form in `Contact.jsx` is the only form. It uses HTML5 `required` for validation and `@emailjs/browser` for submission. Do not introduce React Hook Form, Formik, Zod, or Yup.

If a new form is ever needed, follow the same pattern: controlled or uncontrolled HTML form fields with HTML5 validation.

## Icons

Font Awesome. Both syntaxes are in use and must coexist:
- Legacy: `<i className="fa fa-briefcase"></i>`
- Modern: `<i className="fa-solid fa-building"></i>` / `<i className="fa-brands fa-github"></i>`

Do not refactor from one syntax to the other unless explicitly asked.

## Animation

AOS (Animate On Scroll) only. Default: `data-aos="fade-up"` with `data-aos-duration="1200"`. Grid items: `data-aos="fade-right"`. AOS is initialised once in `_app.jsx` — do not re-initialise.

Do not add Framer Motion, GSAP, or any other animation library.

## `next/image`

Use `next/image` for all local images. Always include a `sizes` prop. For external images (blog thumbnails), use a `loader` prop that passes the URL through unchanged — see `Blog.jsx` for the pattern.

## Config

All personal info, URLs, meta titles, and API keys go in `src/config.js`. Never hardcode personal data in components. Import what you need from config.

## Data Entry

Portfolio projects: add entries to `src/components/portfolio/portfolioData.js`. Follow the existing object shape exactly — `company`, `industry`, `product`, `productType`, `role`, `description` (array of strings), `banner` (imported image), `media` (array), `preview` (array).

Experience: edit the inline `experienceContent` array in `src/components/about/Experience.jsx`.

Education: edit the inline `educationContent` array in `src/components/about/Education.jsx`.

Skills: edit the inline `skillSets` array in `src/components/about/index.jsx`. The optional `core: true` flag visually distinguishes primary skills.
