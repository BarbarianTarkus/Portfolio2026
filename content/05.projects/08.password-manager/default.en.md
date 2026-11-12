---
slug: password-manager
name: Password-Manager
kind: académico
year: 2022–25
summary: >-
  **Password manager** for the database administration course: PostgreSQL tuned by hand,
  PostgREST as the API and Svelte on the front end.
tags:
  - PostgreSQL
  - PostgREST
  - Svelte
  - Docker
period: 2022 — 2025
work: 23 commits
links:
  - label: BarbarianTarkus/Password-Manager
    href: 'https://github.com/BarbarianTarkus/Password-Manager'
    kind: repo
problem: >-
  The course asked for **real database administration**: justifying the configuration, the
  permissions and the queries on data that grows, not a toy CRUD.
decisions:
  - >-
    **I used PostgREST instead of writing my own backend**: the API comes from the schema and
    the database policies, so permissions are defined in one place.
  - >-
    **I tuned `postgresql.conf` by hand** — shared memory, effective cache, connection
    count — instead of keeping the defaults, which are meant for a laptop and not for a server.
  - >-
    **Docker** so that PostgreSQL, PostgREST and pgAdmin come up the same on any machine,
    including the grader's machine.
---
