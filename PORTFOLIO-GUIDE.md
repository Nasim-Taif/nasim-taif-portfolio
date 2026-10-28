# Nasim Taif — Portfolio guide

## Update your portfolio

Open `/admin` on your deployed portfolio. Sign in with the **ChatGPT account that created the site**. The professional contact email displayed to visitors is independent of the owner sign-in account.

- **Profile & story:** edit your name, title, hero introduction, photo, biography, degree, and certification.
- **Projects:** add or edit projects, upload covers and hero images, edit project descriptions and case-study links, and add design-focus sections. Use the arrows to reorder projects. The first visible project is featured. New projects start hidden; enable **Show on portfolio** when ready. Changing a slug changes its URL.
- **Expertise / Approach:** edit the descriptions of your services and design process.
- **Contact & links:** edit your email, phone, availability, contact copy, and social profiles.
- **Preview:** view the page with your current edits.
- **Save draft:** store work online without changing the portfolio visitors see.
- **Publish changes:** make the content visible immediately, without a code deployment. This does not change who may access the site.
- **Export content / Import backup:** download and restore JSON content backups. Uploaded images remain in the site's file storage; the JSON contains their references.

Content is stored in Cloudflare D1, images in R2. Saved changes work across browsers and devices. If another editor session has saved newer changes, the site rejects an outdated save; export your work and reload before continuing.

## Access

The initial Sites deployment is private to the owner. Public visitor access can be enabled through Sites access settings when you choose. Editor authorization is separate and remains owner-only even if the portfolio is public.

Hosted identity is managed by Sites / ChatGPT. `PORTFOLIO_OWNER_EMAIL` is a server-side bootstrap allowlist set through Sites environment settings. The first authorized content save records the owner's stable site-specific identity in D1. Do not expose owner credentials in client code.

## Local development

1. Install dependencies using the Sites plugin's `install-dependencies.mjs` helper, or `npm run install:ci` outside the plugin.
2. Set `PORTFOLIO_OWNER_EMAIL=seedy@sites.test` in an ignored `.dev.vars` for the built-in localhost-only development identity. Do not deploy this file.
3. Build with the Sites `build-site.mjs` helper, then apply pending D1 migrations following the starter README. The initial migration is `drizzle/0000_gorgeous_khan.sql`.
4. Run `npm run dev -- --hostname 127.0.0.1`.
5. Visit `/admin` and choose sign in. Portable development uses a simulated local identity; production uses real ChatGPT authentication.

Validation: `node node_modules/typescript/bin/tsc --noEmit`. With the local preview running, `node tests/content-api.mjs` checks authorization, draft/publish persistence, concurrent edits, validation, uploads, and 404s. It restores published content after the test and never targets a hosted URL. Local and production databases are separate.

## Source files

- `app/content.ts`: validated content model and initial portfolio content.
- `app/portfolio.tsx`, `app/globals.css`: portfolio components and responsive styling.
- `app/work/[slug]/page.tsx`: project detail pages.
- `app/admin/`: protected visual editor.
- `app/api/`: authorized content writes and image handling.
- `db/schema.ts`, `drizzle/`: database schema and migrations.

## Original project assets

Images and project titles were taken from the owner's public Behance portfolio. The original case studies remain linked on each project page:

- https://www.behance.net/gallery/257455743/Nishchinto-E-commerce-App-Website-UIUX-Case-Study
- https://www.behance.net/gallery/256361555/TurfGo-Smart-Turf-Booking-Management-Mobile-App
- https://www.behance.net/gallery/244438513/RENTACA-Car-Rental-Web-Design-UIUX-Case-Study
- Profile photo: https://www.behance.net/mdnasimtaifuiux

Nishchinto's summary was grounded in its published project description. TurfGo and RENTACA use brief project introductions and link to the full original work. RENTACA is labeled as a collaborative project. No client testimonials, project outcomes, employment dates, or experience totals have been invented.
