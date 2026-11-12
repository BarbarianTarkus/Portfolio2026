---
slug: rebost-api
name: rebost-api
kind: propio
year: '2025'
summary: >-
  **API for a grocery shopping app**, built with Deno KV and Oak as an excuse to try
  serverless storage without administering a database.
tags:
  - Deno
  - TypeScript
  - Deno KV
  - Oak
period: April 2025
work: 8 commits
links:
  - label: BarbarianTarkus/rebost-api
    href: 'https://github.com/BarbarianTarkus/rebost-api'
    kind: repo
problem: >-
  I wanted an API for a grocery app **without standing up a database server**, and to check
  whether Deno KV was good for anything beyond a documentation example.
decisions:
  - >-
    **Oak as the router**: it is the framework the Deno ecosystem already used and it does not
    force Express or a heavy framework into the stack.
  - >-
    **Deno KV instead of PostgreSQL**: zero provisioning and zero backups to maintain, in
    exchange for tying the project to the runtime APIs.
  - >-
    **Deployment with `deployctl`** to Deno Deploy and a debug task for VS Code, to work
    locally with the same code that runs in production.
---
