---
slug: moodle
name: local_plugincompatibility
kind: propio
year: '2026'
summary: >-
  **Plugin per a Moodle** que comprova quins connectors instal·lats continuaran funcionant quan
  actualitzes el campus, quins no i quins ni tan sols estan publicats al catàleg oficial.
tags:
  - PHP
  - Moodle
period: febrer — març 2026
links:
  - label: moodle-local_plugincompatibility (develop)
    href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    kind: repo
problem: >-
  Moodle no avisa si els connectors de tercers continuaran funcionant quan actualitzes. La
  informació està repartida per les fitxes de moodle.org, així que preparar una actualització
  obliga a revisar-los un per un. Volia veure-ho tot **en una sola taula, dins del mateix Moodle**.
decisions:
  - >-
    **Una única taula dins de Moodle**: reuneix els plugins instal·lats i mostra quins són
    compatibles amb la versió a la qual es vol actualitzar.
  - >-
    **Dades del catàleg oficial**: la compatibilitat es consulta a la informació pública de
    moodle.org i es desa temporalment per no repetir consultes.
  - >-
    **Un informe útil, no només una llista**: permet ordenar, filtrar per text o estat i exportar
    el resultat a CSV o Excel.
  - >-
    **Integrat a l'administració**: respecta els permisos de Moodle, no guarda dades personals i
    està traduït a l'anglès i a l'espanyol.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Informe de compatibilitat de plugins amb la versió 5.1 de Moodle seleccionada.
        caption: Informe de local_plugincompatibility per a Moodle 5.1
---
