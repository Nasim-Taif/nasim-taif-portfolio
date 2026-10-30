# Portfolio guide

## Updating the portfolio

Open `/admin` on the deployed website and sign in with the Google account whose
email is configured as `PORTFOLIO_OWNER_EMAIL`.

- Edit profile, biography, education, certification, and availability.
- Add, edit, reorder, hide, or publish projects.
- Upload project covers, detail images, and a profile portrait.
- Edit services, design-process steps, contact details, and social links.
- Save a draft without changing the public site.
- Publish when the changes are ready.
- Export and import JSON content backups.

Content is stored in PostgreSQL and images are stored in the configured
S3-compatible bucket. If another editor session saves first, the current save is
rejected instead of overwriting newer content; export the work and reload the
editor before continuing.

## Required production configuration

Set these server-side environment variables in Vercel or Render:

```dotenv
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
PORTFOLIO_OWNER_EMAIL=
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

Apply the database migration with `npm run db:migrate` before using `/admin`.
Add the deployment URL plus `/api/auth/callback/google` to the Google OAuth
application's authorized redirect URIs.
