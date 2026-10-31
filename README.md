# Md. Nasim Taif — UX Engineer & Product Strategist

The personal portfolio of **Md. Nasim Taif**, a UX Engineer and Product Strategist
and BSc in Computer Science & Engineering graduate based in Dhaka, Bangladesh.
The website presents Nasim's design work, design process, services, professional
background, and contact information in a responsive editorial-style experience.

The existing visual design and portfolio features are preserved, while the
runtime is now standard Next.js so the same project can be deployed to either
Vercel or Render.

## Features

- Responsive portfolio homepage with animated page transitions.
- About, contact, selected-work, and project detail pages.
- Nishchinto, Pachok, TurfGo, and RENTACA project case studies with Behance links.
- Protected `/admin` visual editor for profile, projects, services, process,
  contact details, and social links.
- Project ordering, publication toggles, cover/detail image fields, tags, and
  design-focus sections.
- Draft and publish workflow with revision conflict protection.
- JSON content export/import backups.
- Image uploads with JPG, PNG, WebP, and GIF validation.
- Google OAuth authentication through Auth.js.
- PostgreSQL content persistence through Drizzle-compatible tables.
- S3-compatible image storage, usable with Cloudinary S3, AWS S3, DigitalOcean
  Spaces, Supabase Storage, or another compatible provider.
- No Cloudflare Worker, D1, R2, or Vinext runtime dependency.

## Stack

- Next.js 16 and React 19
- TypeScript
- Existing CSS and UI components
- Auth.js with Google OAuth
- PostgreSQL and `postgres`
- Drizzle ORM/Kit schema and migration tooling
- AWS SDK S3 client for portable object storage
- Vercel or Render deployment

## Project structure

```text
.
├── app/
│   ├── admin/                 Protected visual editor
│   ├── api/auth/              Auth.js route handlers
│   ├── api/content/           Draft/publish content API
│   ├── api/media/             S3-backed image delivery
│   ├── api/upload/            Authenticated image uploads
│   ├── about/                 About page
│   ├── contact/               Contact page
│   ├── work/                  Work gallery and project pages
│   ├── content.ts             Zod content schema and default content
│   ├── portfolio.tsx          Shared portfolio UI
│   └── store.ts               PostgreSQL persistence and owner checks
├── db/
│   ├── index.ts               PostgreSQL client
│   ├── migrate.ts             Migration runner
│   └── schema.ts              PostgreSQL/Drizzle table definitions
├── drizzle/                   PostgreSQL migration SQL
├── lib/storage.ts             S3-compatible storage adapter
├── public/images/             Bundled portraits, project images, and icons
├── auth.ts                    Auth.js Google configuration
├── next.config.ts             Next.js configuration
└── package.json               Portable development and deployment scripts
```

## Requirements

- Node.js `>=22.13.0`
- npm
- A PostgreSQL database
- A Google OAuth application
- An S3-compatible bucket for uploaded images

## Local development

Install dependencies:

```bash
npm ci
```

Create an ignored `.env.local` file:

```dotenv
DATABASE_URL=postgres://user:password@host:5432/database
AUTH_SECRET=replace-with-a-long-random-secret
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORTFOLIO_OWNER_EMAIL=your-google-account@example.com

S3_ENDPOINT=https://your-object-storage-endpoint
S3_REGION=auto
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

Apply the database schema:

```bash
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`, then visit `/admin` and sign in with the Google
account matching `PORTFOLIO_OWNER_EMAIL`.

## Commands

| Command | Description |
| --- | --- |
| `npm ci` | Install the exact locked dependencies. |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create the production Next.js build. |
| `npm start` | Run the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run db:generate` | Generate a Drizzle PostgreSQL migration. |
| `npm run db:migrate` | Apply the checked-in PostgreSQL migration. |
| `npx tsc --noEmit` | Check TypeScript without emitting files. |

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Use Node.js `22.x`.
4. Use the default Next.js framework settings:
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: leave blank
5. Add all variables from `.env.local` to Vercel Project Settings.
6. Add the production domain to the Google OAuth redirect URIs:
   `https://your-domain.com/api/auth/callback/google`.
7. Deploy.
8. Run `npm run db:migrate` against the production `DATABASE_URL` before using
   the editor.

## Deploying to Render

1. Create a **Web Service** in Render and connect the GitHub repository.
2. Select Node.js and use Node.js `22`.
3. Configure:
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
4. Add the same environment variables used locally.
5. Add the Render domain to the Google OAuth redirect URIs:
   `https://your-service.onrender.com/api/auth/callback/google`.
6. Deploy.
7. Run `npm run db:migrate` against the production database before using the
   editor.

The application code and environment variables are the same on Vercel and
Render. Only the hosting dashboard and public URL differ.

## Content management

The `/admin` editor is restricted to the Google account whose email matches
`PORTFOLIO_OWNER_EMAIL`. The editor supports:

1. Editing profile, projects, services, process, contact, and social content.
2. Saving a draft without changing the public website.
3. Publishing the current draft.
4. Exporting and importing JSON backups.
5. Uploading images to S3-compatible storage.

The PostgreSQL tables are `portfolio_content` and `portfolio_owner`. The
revision check rejects stale saves so one editor session cannot silently
overwrite a newer session.

## Storage configuration

The image adapter accepts any S3-compatible provider. Set:

- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

The application stores image objects under generated UUID filenames and serves
them through `/api/media/[key]`. Uploaded files remain private to the storage
provider and are delivered through the application route.

## Security notes

- Keep `.env.local` and production secrets out of Git.
- Use a long random `AUTH_SECRET`.
- Restrict the Google OAuth application to the intended owner account.
- Keep `PORTFOLIO_OWNER_EMAIL` server-side.
- Use separate PostgreSQL databases/buckets for development and production.

## License and attribution

This is a private portfolio project. Personal information, photographs, project
imagery, and linked case-study materials belong to their respective
owner/creators. Do not reuse them without permission.
