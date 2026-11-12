---
slug: petsalut
name: PetSalut
kind: académico
year: '2024'
summary: >-
  **Aplicación web de gestión** para clínicas veterinarias, desarrollada en equipo dentro del
  proyecto de la UPC.
tags:
  - C++
  - PostgreSQL
  - GitHub Actions
  - Azure Functions
period: marzo — junio 2024
work: 12 PRs mergeados
links:
  - label: AMEP-UPC/PetSalut
    href: 'https://github.com/AMEP-UPC/PetSalut'
    kind: repo
problem: >-
  El equipo tenía que entregar un sistema con tres actores (clínicas, propietarios y mascotas) y
  hacerlo con **un flujo de trabajo real** —ramas, pull requests y CI—, no con un ZIP al final del
  cuatrimestre.
decisions:
  - >-
    **Cada funcionalidad entraba por pull request** revisado por otra persona del equipo: 12 PRs
    mergeados, sin commits directos a la rama principal.
  - >-
    **La integración continua corría en GitHub Actions** y desplegaba en Azure Functions, para que
    la entrega no dependiera de que alguien compilara en su portátil.
  - >-
    **Fijamos primero el esquema de base de datos** y las historias de usuario; cada cambio de
    esquema obligaba a reescribir las historias antes de seguir con la interfaz.
---
