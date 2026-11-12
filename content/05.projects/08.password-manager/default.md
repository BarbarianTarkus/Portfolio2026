---
slug: password-manager
name: Password-Manager
kind: académico
year: 2022–25
summary: >-
  **Gestor de contraseñas** para la asignatura de administración de bases de datos: PostgreSQL
  ajustado a mano, PostgREST como API y Svelte en el front.
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
  La asignatura pedía **administrar una base de datos de verdad**: justificar la configuración, los
  permisos y las consultas sobre datos que crecen, no un CRUD de juguete.
decisions:
  - >-
    **Usé PostgREST en vez de escribir un backend propio**: la API sale del esquema y de las
    políticas de la base de datos, así que los permisos se definen en un solo sitio.
  - >-
    **Ajusté `postgresql.conf` a mano** —memoria compartida, caché efectiva, número de conexiones—
    en lugar de quedarme con los valores por defecto, pensados para un portátil y no para un
    servidor.
  - >-
    **Docker** para que PostgreSQL, PostgREST y pgAdmin se levanten igual en cualquier máquina,
    incluida la del corrector.
---
