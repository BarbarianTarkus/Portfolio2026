---
slug: password-manager
name: Password-Manager
kind: académico
year: 2022–25
summary: >-
  **Gestor de contrasenyes** per a l'assignatura d'administració de bases de dades: PostgreSQL
  ajustat a mà, PostgREST com a API i Svelte al front.
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
  L'assignatura demanava **administrar una base de dades de debò**: justificar la configuració, els
  permisos i les consultes sobre dades que creixen, no un CRUD de joguina.
decisions:
  - >-
    **Vaig fer servir PostgREST en lloc d'escriure un backend propi**: l'API surt de l'esquema i de les
    polítiques de la base de dades, així que els permisos es defineixen en un sol lloc.
  - >-
    **Vaig ajustar `postgresql.conf` a mà** —memòria compartida, memòria cau efectiva, nombre de
    connexions— en lloc de quedar-me amb els valors per defecte, pensats per a un portàtil i no per a un
    servidor.
  - >-
    **Docker** perquè PostgreSQL, PostgREST i pgAdmin s'aixequin igual a qualsevol màquina,
    inclosa la del corrector.
---
