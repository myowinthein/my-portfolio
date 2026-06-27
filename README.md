# myowin.dev

Personal portfolio for Myo Win Thein (Martin) — Senior Software Engineer based in Bangkok.

**Live:** [myowin.dev](https://myowin.dev)

## Background

A heavily customised build on the commercial "Tunis" React template. Five sections (Home, Work, Profile, Writing, Contact) live as `react-tabs` panels inside a single Next.js page — no route changes between sections. All content is static except the Writing tab, which pulls from Medium via the rss2json API.

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
npm run dev      # http://localhost:4000 (not the default 3000)
npm run lint     # next/core-web-vitals
npm run build    # next build + next-sitemap (postbuild)
npm run start    # serve the production build (requires prior build)
```

Editing content:

- **Personal info, URLs, meta, API keys** → `src/config.js`
- **Portfolio projects** → `src/components/portfolio/portfolioData.js`
- **Work experience** → inline array in `src/components/about/Experience.jsx`
- **Education** → inline array in `src/components/about/Education.jsx`
- **Technical skills** → inline array in `src/components/about/index.jsx`

## Tech Stack

| | |
|---|---|
| Framework | Next.js 13.0.2 (Pages Router), React 18 |
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

<!-- last-reviewed: 34788a7 -->
