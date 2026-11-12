---
slug: rebost-api
name: rebost-api
kind: propio
year: '2025'
summary: >-
  **API per a una aplicació de la compra**, construïda amb Deno KV i Oak com a excusa per provar
  emmagatzematge serverless sense administrar una base de dades.
tags:
  - Deno
  - TypeScript
  - Deno KV
  - Oak
period: abril 2025
work: 8 commits
links:
  - label: BarbarianTarkus/rebost-api
    href: 'https://github.com/BarbarianTarkus/rebost-api'
    kind: repo
problem: >-
  Volia una API per a una app de la compra **sense muntar un servidor de base de dades**, i comprovar
  si Deno KV servia per a alguna cosa més que un exemple de la documentació.
decisions:
  - >-
    **Oak com a router**: és el framework que ja utilitzava l'ecosistema de Deno i no obliga a
    arrossegar Express ni un framework pesat.
  - >-
    **Deno KV en lloc de PostgreSQL**: zero aprovisionament i zero còpies de seguretat a
    mantenir, a canvi de lligar el projecte a les APIs del runtime.
  - >-
    **Desplegament amb `deployctl`** a Deno Deploy i una tasca de depuració per a VS Code, per
    treballar en local amb el mateix codi que corre en producció.
---
