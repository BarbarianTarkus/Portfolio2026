---
slug: rebost-api
name: rebost-api
kind: propio
year: '2025'
summary: >-
  **API para una aplicación de la compra** hecha con Deno, como excusa para probar el
  almacenamiento serverless sin administrar una base de datos.
tags:
  - Deno
  - TypeScript
  - Deno KV
  - Oak
period: abril 2025
links:
  - label: BarbarianTarkus/rebost-api
    href: 'https://github.com/BarbarianTarkus/rebost-api'
    kind: repo
problem: >-
  Quería una API sencilla para una app de la compra **sin administrar un servidor de base de
  datos**, y comprobar si el almacenamiento serverless de Deno servía para un proyecto real.
decisions:
  - >-
    **Sin base de datos que administrar**: usé el almacenamiento integrado de Deno para evitar
    servidores, copias de seguridad y mantenimiento.
  - >-
    **Una API pequeña y directa**: la herramienta elegida ya formaba parte del ecosistema de Deno
    y evitaba añadir capas innecesarias.
  - >-
    **Despliegue sencillo**: la API se publica con las herramientas de Deno y se puede probar en
    local con el mismo código que corre en producción.
---
