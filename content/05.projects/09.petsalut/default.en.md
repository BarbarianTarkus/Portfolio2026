---
slug: petsalut
name: PetSalut
kind: académico
year: '2024'
summary: >-
  **Management web application** for veterinary clinics, built as a team within a UPC project.
tags:
  - C++
  - PostgreSQL
  - GitHub Actions
  - Azure Functions
period: March — June 2024
links:
  - label: AMEP-UPC/PetSalut
    href: 'https://github.com/AMEP-UPC/PetSalut'
    kind: repo
problem: >-
  The team had to deliver a system with three types of user — clinics, owners and pets — and do it
  with **a real workflow**: branches, pull requests and continuous integration, not a ZIP at the
  end of the semester.
decisions:
  - >-
    **Work through pull requests**: every feature was reviewed by someone else on the team before
    reaching the main branch.
  - >-
    **Automatic integration and deployment**: GitHub Actions built and deployed to Azure Functions,
    so delivery did not depend on a laptop.
  - >-
    **Data model first**: we fixed the schema and user stories before building the interface, so
    changes would not break the rest.
---
