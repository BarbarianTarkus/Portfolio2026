---
slug: petsalut
name: PetSalut
kind: académico
year: '2024'
summary: >-
  **Management web application** for veterinary clinics, developed as a team for the UPC
  project.
tags:
  - C++
  - PostgreSQL
  - GitHub Actions
  - Azure Functions
period: March — June 2024
work: 12 merged PRs
links:
  - label: AMEP-UPC/PetSalut
    href: 'https://github.com/AMEP-UPC/PetSalut'
    kind: repo
problem: >-
  The team had to deliver a system with three actors (clinics, owners and pets) and do it with
  **a real workflow** — branches, pull requests and CI —, not with a ZIP at the end of the
  semester.
decisions:
  - >-
    **Every feature came in through a pull request** reviewed by someone else on the team:
    12 merged PRs, with no direct commits to the main branch.
  - >-
    **Continuous integration ran on GitHub Actions** and deployed to Azure Functions, so that
    delivery did not depend on someone compiling on their laptop.
  - >-
    **We fixed the database schema first**, then the user stories; every schema change forced
    us to rewrite the stories before continuing with the interface.
---
