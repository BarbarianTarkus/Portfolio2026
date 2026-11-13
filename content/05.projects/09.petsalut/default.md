---
slug: petsalut
name: PetSalut
kind: académico
year: '2024'
summary: >-
  **Aplicación web de gestión** para clínicas veterinarias, hecha en equipo dentro de un proyecto
  de la UPC.
tags:
  - C++
  - PostgreSQL
  - GitHub Actions
  - Azure Functions
period: marzo — junio 2024
links:
  - label: AMEP-UPC/PetSalut
    href: 'https://github.com/AMEP-UPC/PetSalut'
    kind: repo
problem: >-
  El equipo tenía que entregar un sistema con tres tipos de usuario —clínicas, propietarios y
  mascotas— y hacerlo con **un flujo de trabajo real**: ramas, pull requests e integración
  continua, no un ZIP al final del cuatrimestre.
decisions:
  - >-
    **Trabajo por pull requests**: cada funcionalidad la revisaba otra persona del equipo antes de
    entrar en la rama principal.
  - >-
    **Integración y despliegue automáticos**: GitHub Actions compilaba y desplegaba en Azure
    Functions, así la entrega no dependía de un portátil.
  - >-
    **Primero el modelo de datos**: fijamos el esquema y las historias de usuario antes de
    construir la interfaz, para que los cambios no rompieran el resto.
---
