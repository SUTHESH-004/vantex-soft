# Vantex Soft

Attendance management for wage workers across 3 shifts.
Arrangers mark attendance on mobile; managers and the MD view dashboards on web.

## Structure

- `backend/` — Spring Boot API (Java 21)
- `web/` — React + Vite,
- `mobile/` — React Native (Expo),
- `shared/` — TypeScript types and generated API client
- `docs/` — decision log and notes

## Run locally

```bash
docker compose up -d                        # database
cd backend && ./mvnw spring-boot:run        # API on :8080
cd web && npm run dev                       # web on :5173
```

## LICENSE

Proprietary software. Viewing only. See LICENSE.

## Status

Phase 0 — scaffold. Walking skeleton in progress.
