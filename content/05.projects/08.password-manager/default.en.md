---
slug: password-manager
name: Password-Manager
kind: académico
year: 2022–25
summary: >-
  **Password manager** for the database administration course: PostgreSQL, an API generated from
  the database itself and a web interface.
tags:
  - PostgreSQL
  - PostgREST
  - Svelte
  - Docker
period: 2022 — 2025
links:
  - label: BarbarianTarkus/Password-Manager
    href: 'https://github.com/BarbarianTarkus/Password-Manager'
    kind: repo
problem: >-
  The course asked for **real database administration**: justifying the configuration, the
  permissions and the queries on data that grows, not a toy CRUD.
decisions:
  - >-
    **The API comes from the database**: I used PostgREST instead of building a separate API, so
    permissions are defined in one place.
  - >-
    **Configuration tuned for a server**: I reviewed PostgreSQL's settings instead of keeping the
    defaults.
  - >-
    **A reproducible environment**: Docker brings up the database, the API and the interface the
    same way on any machine.
---
