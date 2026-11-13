---
slug: moodle
name: local_plugincompatibility
kind: propio
year: '2026'
summary: >-
  **Plugin para Moodle** que comprueba qué conectores instalados seguirán funcionando cuando
  actualizas el campus, cuáles no y cuáles ni siquiera están publicados en el catálogo oficial.
tags:
  - PHP
  - Moodle
period: febrero — marzo 2026
links:
  - label: moodle-local_plugincompatibility (develop)
    href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    kind: repo
problem: >-
  Moodle no avisa de si los conectores de terceros seguirán funcionando al actualizar. La
  información está repartida por las fichas de moodle.org, así que preparar una actualización
  obliga a revisarlos uno por uno. Quería verlo todo **en una sola tabla, dentro del propio Moodle**.
decisions:
  - >-
    **Una única tabla dentro de Moodle**: reúne los plugins instalados y muestra cuáles son
    compatibles con la versión a la que se quiere actualizar.
  - >-
    **Datos del catálogo oficial**: la compatibilidad se consulta en la información pública de
    moodle.org y se guarda temporalmente para no repetir consultas.
  - >-
    **Un informe útil, no solo una lista**: permite ordenar, filtrar por texto o estado y exportar
    el resultado a CSV o Excel.
  - >-
    **Integrado en la administración**: respeta los permisos de Moodle, no guarda datos personales
    y está traducido al inglés y al español.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Informe de compatibilidad de plugins con la versión 5.1 de Moodle seleccionada.
        caption: Informe de local_plugincompatibility para Moodle 5.1
---
