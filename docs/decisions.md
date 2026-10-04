# Decision Log

Newest first. Record any choice future-me would ask "why?" about.

---

## 2026-09-26 — Two clients, one API

**Decision:** React Native (Expo) for Android, React (Vite) for web, both
against a single Spring Boot API. Both clients expose the full feature set;
access is gated by the user's role, not by device.
**Why:** People use whatever device is at hand — an MD may check the
dashboard on his phone, an arranger may sit at a desk. Native Android also
keeps the door open for camera, GPS and offline marking later, which are
unreliable on Android web.
**Rejected:** Single responsive PWA — would remove the option of reliable
offline and device-hardware features later.
**Rule:** Authorization is enforced in the API only. Clients hide UI for
convenience, never for security.
**Risk:** Every feature is built twice. Mitigated by keeping types, the
generated API client, and role-to-navigation logic in shared/.

## 2026-09-26 — Monorepo over split repos

**Decision:** One repo, three app folders plus shared.
**Why:** Solo dev. API changes land atomically across backend and both
clients. One CI, one board, no version coordination.
**Constraint:** web/ and mobile/ never import from each other. Common code
goes in shared/.

---

## 2026-09-26 — Stack

**Decision:** Spring Boot 4.1 (Java 21) + PostgreSQL 16 + React (Vite).
**Why:** Building Java/Spring depth deliberately. Postgres over MySQL for
stronger timestamp/timezone handling — night shifts cross midnight and
attendance must attribute to the shift's start date.
**Rejected:** Oracle — licensing caps and almost no affordable managed hosting.

## 2026-09-26 — Role-based access, platform-agnostic

**Decision:** Roles (ARRANGER / MANAGER / MD) are enforced, but access is not
tied to device. Both web and mobile expose the full feature set; each screen
is gated by the logged-in user's role.
**Why:** People use whatever device is at hand. An MD may check the dashboard
on his phone; an arranger may sit at a desk.
**Rule:** Authorization is enforced in the API only. Clients hide UI for
convenience, never for security.
**Cost accepted:** every feature is built twice (web + mobile).

## 2026-09-26 — Testcontainers for integration tests

**Decision:** Tests start their own throwaway PostgreSQL 16 via Testcontainers
(`@ServiceConnection` bean in `TestcontainersConfiguration`), not the
docker-compose database.
**Why:** `mvnw test` no longer depends on remembering `docker compose up`, and
local runs behave the same as CI. The dev `vantex` database is never touched
by tests.
**Rule:** Every `@SpringBootTest` imports `TestcontainersConfiguration` with the
same annotation set so Spring reuses one context and one container per run.
**Cost accepted:** Docker daemon must be running; first run pulls images.

## 2026-09-28 — Hosting: Neon + Render + Vercel, deployed by commit SHA

**Decision:** PostgreSQL 16 on Neon (free tier). Backend runs as a Docker
image on Render (free web service), pulled from GHCR. Web on Vercel (Hobby).
`deploy.yml` runs only after CI succeeds on `main`; every backend image is
tagged with its commit SHA.
**Why:** All three are free with no card. Render's deploy hook accepts an
exact image, so rollback = redeploy an older SHA (manual `workflow_dispatch`).
Images are built on GitHub's amd64 runners — the dev Mac is arm64.
**Web deploys:** Vercel builds from GitHub, triggered only by a deploy hook
that `deploy.yml` calls after CI passes on `main`; Git auto-deploy stays off
(`web/vercel.json`). Web rollback = Vercel Instant Rollback.
**Rejected:** Railway (no free tier), Fly.io (card + pay-as-you-go).
Vercel CLI deploys from Actions — Vercel's scoped tokens failed the CLI's
user lookup ("User not found"); the hook needs no token.
Vercel Git auto-deploy — would deploy commits that failed CI.
A `latest` tag — can't tell what's running and can't roll back.
**Rules:** Secrets live only in the Render/Vercel dashboards and GitHub
Secrets, never in the repo. `VITE_*` variables are public (baked into the JS),
so never put a secret in one. Allowed browser origins come from
`CORS_ALLOWED_ORIGINS`.
**Cost accepted:** Render free tier sleeps after 15 min idle, so the first
request takes ~30–60s. Neon free compute scales to zero (small wake-up delay).
Revisit before real users.
