# Cynbit Client Experience 2.0

An independent Full Stack Developer Intern assessment prototype for Cynbit Technologies. The demo connects service discovery, relevant case studies, and a contextual project inquiry that saves a receipt to PostgreSQL.

The four case studies are fictional. The inquiry API only accepts the supplied synthetic details. No inquiries are delivered to Cynbit.

## Local setup

Use Node.js 22+, pnpm 12.16.1, and Docker Compose, or an existing dedicated PostgreSQL database.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
docker compose up -d --wait
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Choose **See relevant work** on Cloud, open **Cloud collaboration platform**, and select **Discuss a similar project**. Use **Use sample details**, then **Send demo inquiry**. A successful response shows the persisted receipt ID and its service and project.

The Docker port is loopback only and the data volume survives restarts. `docker compose stop` stops the assessment database without deleting it. If using another PostgreSQL instance, set the server-only `DATABASE_URL` in your ignored `.env.local`.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright starts the production build on 127.0.0.1:3131. It requires a migrated, seeded **loopback PostgreSQL** database, writes synthetic rows, and verifies persistence by querying PostgreSQL. Repeated runs inside one rate-limit window can exhaust the local bucket. Wait for the next window or use a separate local test database. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` only if using an installed Chromium-family browser instead of Playwright’s pinned browser.

## Vercel deployment

1. Push the local commits to a GitHub repository you control. Import it as a Next.js project in your Vercel account, or link this checkout to a new Vercel project with Vercel CLI.
2. Provision a dedicated managed PostgreSQL database. Add `DATABASE_URL` as a server-only secret in the intended Vercel environments. Use an SSL-enabled pooled URL from your provider at runtime. Keep preview and production databases separate where possible. [Vercel Postgres integrations](https://vercel.com/docs/postgres)
3. Set the project Node.js version to **22.x** and `ENABLE_EXPERIMENTAL_COREPACK=1` to use the pinned pnpm version. Leave the framework preset set to Next.js and enable automatic system environment variables so the route can identify Vercel and use its client-address header. [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build) · [Vercel request headers](https://vercel.com/docs/headers/request-headers)
4. In your local shell or CI secret store, set `DATABASE_URL` to the managed database’s direct connection string. Run `pnpm db:migrate` and `pnpm db:seed` against the intended deployment database. Run these separately from Vercel builds. Verify the target before running migrations.
5. Deploy. Visit the generated URL, confirm the catalog contains four cases, and complete the synthetic Cloud walkthrough above. Record the URL and confirm that its visibility is suitable for the assessor.

Keep connection strings out of Git, client-side settings, and the technical report. After deployment, use the synthetic sample only. The prototype has no admin endpoints, staff dashboard, or email delivery.

## Project files

- [Technical report](docs/TECHNICAL_REPORT.md)
- [Final project scope](FINAL_PROJECT_SCOPE.md)
- [User journey audit](FINAL_USER_JOURNEY_AUDIT.md)
