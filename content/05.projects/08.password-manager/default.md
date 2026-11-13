---
slug: password-manager
name: Password-Manager
kind: académico
year: 2022–25
summary: >-
  **Gestor de contraseñas** para la asignatura de administración de bases de datos: PostgreSQL,
  una API generada desde la propia base de datos y una interfaz web.
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
  La asignatura pedía **administrar una base de datos de verdad**: justificar la configuración,
  los permisos y las consultas sobre datos que crecen, no un CRUD de juguete.
decisions:
  - >-
    **La API sale de la base de datos**: usé PostgREST para no construir una API aparte y definir
    los permisos en un solo sitio.
  - >-
    **Configuración ajustada al servidor**: revisé los parámetros de PostgreSQL en lugar de
    quedarme con los valores por defecto.
  - >-
    **Entorno reproducible**: Docker permite levantar la base de datos, la API y la interfaz igual
    en cualquier máquina.
---
