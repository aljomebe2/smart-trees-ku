# Smart Trees — Deployment checklist

## Vercel

1. **Database**: Create a PostgreSQL database (Neon, Supabase, or Vercel Postgres). Copy the connection string.
2. **Schema**: In `prisma/schema.prisma`, set `provider = "postgresql"` and use `env("DATABASE_URL")`.
3. **Env vars** in Vercel:
   - `DATABASE_URL` — PostgreSQL connection string
   - `NEXTAUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `https://your-app.vercel.app`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — only if you run seed against this DB
4. **Build**: Deploy. Run migrations once: `npx prisma db push` (or migrate) with `DATABASE_URL` pointing to production.
5. **Seed**: Run `npm run db:seed` once (e.g. locally with production `DATABASE_URL`) to create admin and trees.
6. **Security**: Change the default admin password after first login.

## QR codes after deploy

- Base URL for QR links: `https://your-app.vercel.app/tree/<slug>`.
- New trees get a QR PNG generated at build/request time (stored in `public/qr/`). On serverless, ensure the app can write to a writable volume or generate QR on-the-fly and serve via API if needed.
- For Vercel (serverless), writing to `public/qr` may not persist between invocations. Options: (1) Generate QR on each admin “Regenerate” and store the file in a cloud storage (e.g. S3/Vercel Blob) and save that URL in `tree.qrCodeUrl`; or (2) Keep generating to `public/qr` and accept that QR files are ephemeral unless you use a persistent file store. For a simple setup, generating at request time and caching in DB or CDN is a good approach.

## Stripe (optional)

See README section “Connecting Stripe” for adding real payments to the donation flow.
