---
slug: rebost-api
name: rebost-api
kind: propio
year: '2025'
summary: >-
  **API per a una aplicació de la compra** feta amb Deno, com a excusa per provar l'emmagatzematge
  serverless sense administrar una base de dades.
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
  Volia una API senzilla per a una app de la compra **sense administrar un servidor de base de
  dades**, i comprovar si l'emmagatzematge serverless de Deno servia per a un projecte real.
decisions:
  - >-
    **Sense base de dades a administrar**: vaig fer servir l'emmagatzematge integrat de Deno per
    evitar servidors, còpies de seguretat i manteniment.
  - >-
    **Una API petita i directa**: l'eina triada ja formava part de l'ecosistema de Deno i
    evitava afegir capes innecessàries.
  - >-
    **Desplegament senzill**: l'API es publica amb les eines de Deno i es pot provar en local amb
    el mateix codi que corre en producció.
---
