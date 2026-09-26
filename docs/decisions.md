# Decision Log

Newest first. Record any choice future-me would ask "why?" about.

---

## 2026-09-26 — Three clients, one API

**Decision:** React Native (Expo) for arrangers, React web for manager/MD,
Spring Boot API serving both.
**Why:** Arrangers need camera, GPS and offline queueing in the field.
MD needs a wide dashboard. Different devices, different jobs.
**Rejected:** Single responsive PWA — offline photo queueing is unreliable
on Android web, and the arranger flow is the core of the product.
**Risk:** 3x surface area for one developer. Mitigated by strict per-app
scope and a generated API client in shared/.

---

## 2026-09-26 — Monorepo over split repos

**Decision:** One repo, three app folders plus shared.
**Why:** Solo dev. API changes land atomically across backend and both
clients. One CI, one board, no version coordination.
**Constraint:** web/ and mobile/ never import from each other. Common code
goes in shared/.

---

## 2026-09-26 — Stack

**Decision:** Spring Boot 3 (Java 21) + PostgreSQL 16 + React (Vite).
**Why:** Building Java/Spring depth deliberately. Postgres over MySQL for
stronger timestamp/timezone handling — night shifts cross midnight and
attendance must attribute to the shift's start date.
**Rejected:** Oracle — licensing caps and almost no affordable managed hosting.
