---
slug: rebost-api
name: rebost-api
kind: propio
year: '2025'
summary: >-
  **API para una aplicación de la compra**, construida con Deno KV y Oak como excusa para probar
  almacenamiento serverless sin administrar una base de datos.
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
  Quería una API para una app de la compra **sin montar un servidor de base de datos**, y comprobar
  si Deno KV servía para algo más que un ejemplo de la documentación.
decisions:
  - >-
    **Oak como router**: es el framework que ya usaba el ecosistema de Deno y no obliga a arrastrar
    Express ni un framework pesado.
  - >-
    **Deno KV en lugar de PostgreSQL**: cero provisión y cero copias de seguridad que mantener, a
    cambio de atar el proyecto a las APIs del runtime.
  - >-
    **Despliegue con `deployctl`** a Deno Deploy y una tarea de depuración para VS Code, para
    trabajar en local con el mismo código que corre en producción.
---
