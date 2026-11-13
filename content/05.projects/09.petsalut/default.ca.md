---
slug: petsalut
name: PetSalut
kind: académico
year: '2024'
summary: >-
  **Aplicació web de gestió** per a clíniques veterinàries, feta en equip dins d'un projecte de
  la UPC.
tags:
  - C++
  - PostgreSQL
  - GitHub Actions
  - Azure Functions
period: març — juny 2024
links:
  - label: AMEP-UPC/PetSalut
    href: 'https://github.com/AMEP-UPC/PetSalut'
    kind: repo
problem: >-
  L'equip havia d'entregar un sistema amb tres tipus d'usuari —clíniques, propietaris i mascotes— i
  fer-ho amb **un flux de treball real**: branques, pull requests i integració contínua, no un ZIP
  al final del quadrimestre.
decisions:
  - >-
    **Treball per pull requests**: cada funcionalitat la revisava una altra persona de l'equip
    abans d'entrar a la branca principal.
  - >-
    **Integració i desplegament automàtics**: GitHub Actions compilava i desplegava a Azure
    Functions, així l'entrega no depenia d'un portàtil.
  - >-
    **Primer el model de dades**: vam fixar l'esquema i les històries d'usuari abans de construir
    la interfície, perquè els canvis no trenquessin la resta.
---
