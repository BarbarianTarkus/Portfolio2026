---
slug: password-manager
name: Password-Manager
kind: académico
year: 2022–25
summary: >-
  **Gestor de contrasenyes** per a l'assignatura d'administració de bases de dades: PostgreSQL,
  una API generada des de la mateixa base de dades i una interfície web.
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
  L'assignatura demanava **administrar una base de dades de veritat**: justificar la configuració,
  els permisos i les consultes sobre dades que creixen, no un CRUD de joguina.
decisions:
  - >-
    **L'API surt de la base de dades**: vaig fer servir PostgREST per no construir una API a part
    i definir els permisos en un sol lloc.
  - >-
    **Configuració ajustada al servidor**: vaig revisar els paràmetres de PostgreSQL en lloc de
    quedar-me amb els valors per defecte.
  - >-
    **Entorn reproduïble**: Docker permet aixecar la base de dades, l'API i la interfície igual a
    qualsevol màquina.
---
