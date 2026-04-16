# Smart Trees

A production-ready web application for a university campus environmental awareness project. Users scan QR codes on tree labels to learn about species and optionally donate to support campus events.

## Features

- **Public**: Browse trees, search/filter, view tree pages (mobile-first), optional donation, QR share
- **Admin**: Secure login, tree CRUD, image URL & QR generation, analytics dashboard, donation list & CSV export

## Tech stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Auth**: NextAuth.js (credentials)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy the example env and set a strong secret for production:

```bash
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL`: SQLite for dev: `file:./dev.db`. For PostgreSQL: `postgresql://user:pass@host:5432/dbname`
- `NEXTAUTH_SECRET`: Use a long random string (e.g. `openssl rand -base64 32`)
- `NEXTAUTH_URL`: `http://localhost:3000` (dev) or your production URL
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Used by the seed to create the first admin (dev only; change in production)

### 3. Database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Admin login (dev)

- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin) (redirects to login if not signed in)
- **Email**: `admin@campus.edu` (or value of `ADMIN_EMAIL` in `.env`)
- **Password**: `admin123` (or value of `ADMIN_PASSWORD` in `.env`)

**Important**: Change these credentials in production and use a strong password.

## Project structure

```
src/
  app/
    api/           # API routes (trees, scans, donations, admin)
    admin/         # Admin panel (login + dashboard, trees, donations)
    tree/[slug]/   # Public tree page (QR destination)
    trees/         # Public tree catalog
    page.tsx       # Home
  components/
  lib/             # prisma, auth, qr, slug
  types/
prisma/
  schema.prisma
  seed.ts
```

## Deployment (Vercel)

### 1. Database

Use a hosted PostgreSQL (e.g. Vercel Postgres, Neon, Supabase). Set `DATABASE_URL` in your project env.

For PostgreSQL, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma generate
npx prisma db push
```

Run the seed once (e.g. from a local script or a one-off job) with production `DATABASE_URL` and your chosen `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### 2. Vercel

- Import the repo in Vercel.
- Set environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET` (strong random value)
  - `NEXTAUTH_URL` = `https://your-domain.vercel.app`
  - `ADMIN_EMAIL` / `ADMIN_PASSWORD` (only if you seed from Vercel; otherwise set when seeding locally with prod DB)
- Deploy. Build command: `npm run build` (default).

### 3. Post-deploy

- Run migrations/seed against the production DB if not done already.
- Change the default admin password.
- Optionally add Stripe (see below).

## QR codes

### How it works

- Each tree has a unique **slug** (e.g. `roble`, `aguacate`). The public URL is: `https://your-domain.com/tree/<slug>`.
- When an admin **creates** a tree, the API generates a PNG QR code and saves it under `public/qr/<slug>.png`.
- **Regenerate**: In admin, edit the tree and click “Regenerate QR code” to overwrite the PNG.

### Generating and printing QR codes

1. **Auto-generated**: Create or edit a tree in the admin panel; the QR is generated and stored in `public/qr/<slug>.png`.
2. **Download**: From the admin trees list, use the “QR” link next to a tree to download its PNG.
3. **Print**: Use the downloaded PNG in any label design (e.g. Word, Canva, or a label printer). Point the QR to: `https://your-domain.com/tree/<slug>`.
4. **Bulk**: For many trees, open each tree’s QR link and download, or add a future “Download all QR codes” script that zips `public/qr/*.png`.

### Optional: QR for existing (seeded) trees

Seeded trees do not get a QR until one is generated. In admin, open each tree → Edit → “Regenerate QR code”. Alternatively, you can run a one-off script that calls the same logic as `POST /api/admin/trees/[id]/qr` for each tree (with an authenticated session or a server-side script using Prisma + `generateQrPng` from `src/lib/qr.ts`).

## Connecting Stripe (optional)

The donation flow is **simulated**: amounts and donor info are stored, but no real payment is taken. To add Stripe:

1. Install Stripe SDK: `npm install stripe`.
2. Create a Stripe Checkout Session in a new API route (e.g. `api/donations/create-checkout`) using amount, optional `tree_id`, and success/cancel URLs.
3. In the donation modal, after the user selects amount and optional name/email, call your API to create a Checkout Session and redirect to `session.url`.
4. Use a Stripe webhook to record the donation (e.g. create/update a Donation row) when payment succeeds.
5. Keep the thank-you screen after redirect from Stripe (e.g. `/tree/[slug]?donation=success`).

The existing `Donation` model and `POST /api/donations` can stay for “pending” or non-Stripe donations, or be replaced by webhook-only creation.

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server           |
| `npm run build`| Build for production       |
| `npm run start`| Start production server    |
| `npm run db:seed` | Seed admin + trees     |
| `npm run db:studio` | Open Prisma Studio   |

## License

MIT.
# smart-trees-ku
