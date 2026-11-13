---
slug: rebost-api
name: rebost-api
kind: propio
year: '2025'
summary: >-
  **API for a grocery shopping app**, built with Deno as an excuse to try serverless storage
  without administering a database.
tags:
  - Deno
  - TypeScript
  - Deno KV
  - Oak
period: April 2025
links:
  - label: BarbarianTarkus/rebost-api
    href: 'https://github.com/BarbarianTarkus/rebost-api'
    kind: repo
problem: >-
  I wanted a simple API for a grocery app **without administering a database server**, and to
  check whether Deno's serverless storage was good for a real project.
decisions:
  - >-
    **No database to administer**: I used Deno's built-in storage to avoid servers, backups and
    maintenance.
  - >-
    **A small, direct API**: the tool I chose was already part of the Deno ecosystem and avoided
    unnecessary layers.
  - >-
    **Simple deployment**: the API is published with Deno's tools and can be tested locally with
    the same code that runs in production.
---
