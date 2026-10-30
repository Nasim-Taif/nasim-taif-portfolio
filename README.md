# Md. Nasim Taif — UI/UX Design Portfolio

The personal portfolio of **Md. Nasim Taif**, a Google-certified UI/UX designer and
BSc in Computer Science & Engineering graduate based in Dhaka, Bangladesh.

The site presents Nasim's design work, design process, services, professional
background, and contact information in a responsive editorial-style experience.
It includes selected case studies for Nishchinto, TurfGo, and RENTACA, with links
to the complete project presentations on Behance.

This is a full-stack portfolio site rather than a static landing page. Published
content is stored in Cloudflare D1, uploaded images are stored in Cloudflare R2,
and the owner can update the portfolio through a protected editor without
redeploying the application.

## Features

- Responsive portfolio homepage with animated page transitions and motion
  preferences that respect `prefers-reduced-motion`.
- About page describing Nasim's background, education, and design philosophy.
- Selected work gallery with filtering/navigation and individual project routes.
- Project case-study pages with:
  - project overview, role, platform, tools, and tags;
  - cover/detail imagery;
  - design-focus sections;
  - links to the complete Behance case study;
  - next-project navigation.
- Contact page with configurable contact details, availability, and social links.
- Protected `/admin` editor for:
  - profile and biography content;
  - projects and publication status;
  - project ordering, descriptions, tags, and design-focus sections;
  - services and design-process content;
  - contact information and social profiles;
  - portrait, project-cover, and project-detail uploads.
- Draft and publish workflow with revision checks to prevent overwriting edits
  made in another browser session.
- JSON content export/import support for backups.
- Zod validation for editable content and upload input.
- Cloudflare Worker runtime with D1 database and R2 object storage bindings.
- Local connector preview support for development.

## Tech stack

- [React](https://react.dev/) 19
- [Next.js](https://nextjs.org/) 16 application conventions
- [Vinext](https://github.com/cloudflare/vinext) and [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4 and custom CSS
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/) for portfolio content
- [Cloudflare R2](https://developers.cloudflare.com/r2/) for uploaded images
- [Drizzle ORM](https://orm.drizzle.team/) and Drizzle Kit for database schema/migrations
- [Zod](https://zod.dev/) for runtime validation
- [Lucide](https://lucide.dev/) for interface icons

## Project structure

```text
.
├── app/
│   ├── admin/                 Protected visual editor
│   ├── api/                   Content and image-upload API routes
│   ├── about/                 About page
│   ├── contact/               Contact page
│   ├── work/                  Work gallery and project detail pages
│   ├── content.ts             Content schema and default portfolio content
│   ├── portfolio.tsx          Shared portfolio UI
│   ├── profile-page.tsx       About/contact presentation
│   ├── store.ts               D1 persistence and owner authorization
│   └── *.css                  Global, motion, studio, and process styles
├── components/ui/             Reusable interface components
├── db/
│   ├── schema.ts              D1/Drizzle table definitions
│   └── index.ts               Database binding access
├── drizzle/                   Generated SQL migrations and metadata
├── public/images/              Bundled portraits, project images, and icons
├── scripts/                   Installation, environment, and preview helpers
├── worker/index.ts            Cloudflare Worker entry point
├── tests/                     Local content API checks
├── vite.config.ts             Vinext, Vite, and Cloudflare configuration
└── .openai/hosting.json       D1 and R2 binding declarations
```

## Requirements

- Node.js `>=22.13.0`
- npm
- Git

The project is designed to run on macOS, Linux, and Windows. Cloudflare
deployment also requires access to the relevant Cloudflare account and bindings.

## Getting started

Install dependencies:

```bash
npm ci
```

Start the local development server:

```bash
npm run dev
```

The development server uses the local Vinext/Vite and Cloudflare preview setup.
Open the URL printed in the terminal. When using the local development
authentication flow, add the following value to an ignored `.dev.vars` file:

```dotenv
PORTFOLIO_OWNER_EMAIL=seedy@sites.test
```

Do not commit `.dev.vars` or any other file containing credentials or private
environment values.

To open the editor locally, visit `/admin` and sign in with the configured local
development identity. In a hosted deployment, editor access is restricted to
the ChatGPT account that owns the site.

## Available commands

| Command | Description |
| --- | --- |
| `npm ci` | Install the exact dependency versions from `package-lock.json`. |
| `npm run dev` | Start the local development preview with hot reload. |
| `npm run build` | Build the application and Worker deployment output. |
| `npm start` | Run the built Worker locally through Wrangler. |
| `npm run lint` | Run the ESLint configuration across the source tree. |
| `npm run db:generate` | Generate a Drizzle migration from schema changes. |
| `node node_modules/typescript/bin/tsc --noEmit` | Run the TypeScript compiler without emitting files. |
| `node tests/content-api.mjs` | Exercise local content API authorization, persistence, validation, uploads, and 404 behavior. |

Run the API test only while the local preview is running. It targets the local
server, restores the published content after the test, and does not access a
hosted deployment.

## Content management

The editor at `/admin` is intentionally separate from visitor access:

1. Sign in with the ChatGPT account that owns the portfolio.
2. Edit profile, projects, services, process steps, contact details, or links.
3. Save a draft to persist changes without changing the public portfolio.
4. Publish when the content is ready.
5. Use export/import to create or restore a JSON content backup.

Content is validated against the schemas in [`app/content.ts`](./app/content.ts).
The owner identity is bootstrapped from `PORTFOLIO_OWNER_EMAIL` for the first
authorized save and then stored as a stable site-specific identity in D1.
Uploaded images are kept in R2; content backups contain image references rather
than the binary files.

If another editor session saves first, the revision check returns a conflict
instead of silently overwriting the newer content. Export the local work and
reload the editor before trying again.

## Data and Cloudflare bindings

The hosting configuration declares these bindings in
[`.openai/hosting.json`](./.openai/hosting.json):

- `DB` — Cloudflare D1 database used by `portfolio_content` and `portfolio_owner`.
- `BUCKET` — Cloudflare R2 bucket used for uploaded portfolio images.

The initial database migration is
[`drizzle/0000_gorgeous_khan.sql`](./drizzle/0000_gorgeous_khan.sql). The Worker
entry point is [`worker/index.ts`](./worker/index.ts), which passes requests to
the Vinext fetch handler and preserves the request-scoped connector binding.

For hosted deployments, configure the D1/R2 bindings and the server-side
`PORTFOLIO_OWNER_EMAIL` value through the hosting environment. Never place
owner credentials, production secrets, or private environment values in client
code or tracked files.

## Design content

The default published portfolio includes:

- **Nishchinto** — an e-commerce app and website focused on clearer pricing,
  delivery, warranty, and return information for online shoppers in Bangladesh.
- **TurfGo** — a mobile experience for smart turf booking and management.
- **RENTACA** — a collaborative car-rental website design and UI/UX case study.

The complete presentations remain linked from each project page and point to
Nasim's original Behance work. Portfolio imagery and project descriptions are
maintained as editable content so the site can evolve without changing the
presentation code.

## License and attribution

This repository is a private portfolio project. The portfolio content, personal
information, photographs, project imagery, and linked case-study materials
belong to their respective owner/creators. Do not reuse them without permission.
