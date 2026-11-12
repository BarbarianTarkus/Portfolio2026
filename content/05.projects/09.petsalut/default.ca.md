---
slug: petsalut
name: PetSalut
kind: académico
year: '2024'
summary: >-
  **Aplicació web de gestió** per a clíniques veterinàries, desenvolupada en equip dins del
  projecte de la UPC.
tags:
  - C++
  - PostgreSQL
  - GitHub Actions
  - Azure Functions
period: març — juny 2024
work: 12 PRs fusionats
links:
  - label: AMEP-UPC/PetSalut
    href: 'https://github.com/AMEP-UPC/PetSalut'
    kind: repo
problem: >-
  L'equip havia d'entregar un sistema amb tres actors (clíniques, propietaris i mascotes) i
  fer-ho amb **un flux de treball real** —branques, pull requests i CI—, no amb un ZIP al final del
  quadrimestre.
decisions:
  - >-
    **Cada funcionalitat entrava per pull request** revisada per una altra persona de l'equip: 12 PRs
    fusionats, sense commits directes a la branca principal.
  - >-
    **La integració contínua corria a GitHub Actions** i desplegava a Azure Functions, perquè
    l'entrega no depengués que algú compilés al seu portàtil.
  - >-
    **Vam fixar primer l'esquema de base de dades** i les històries d'usuari; cada canvi
    d'esquema obligava a reescriure les històries abans de continuar amb la interfície.
---
