---
slug: moodle
name: local_plugincompatibility
kind: propio
year: '2026'
summary: >-
  **Plugin local de Moodle** que cruza los plugins instalados con el catálogo oficial y responde,
  para la versión a la que quieres actualizar, cuáles siguen siendo compatibles, cuáles no y
  cuáles ni siquiera están publicados en moodle.org.
tags:
  - PHP
  - Moodle
period: febrero — marzo 2026
work: 19 commits en develop
links:
  - label: moodle-local_plugincompatibility (develop)
    href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    kind: repo
problem: >-
  Moodle no avisa de si los plugins de terceros seguirán funcionando al subir de versión: la
  respuesta está repartida por las fichas de moodle.org, así que preparar una actualización
  obliga a comprobar plugin por plugin cuáles tienen una release para la versión de destino.
  Quería esa respuesta **en una sola tabla, dentro del propio sitio** y para cualquier versión
  futura.
decisions:
  - >-
    **Partí del plugin de 2020 de Raúl Martínez**, que lanzaba una petición HTML a moodle.org y una
    regex por cada plugin instalado, y lo reescribí sobre la API oficial del pluglist
    (`download.moodle.org/api/1.3/pluglist.php`): la compatibilidad se deriva de
    `supportedmoodles` y la respuesta se cachea una hora, guardando el JSON en bruto (~15 MB)
    para no serializar el árbol entero.
  - >-
    **Reescribí el informe como una clase propia** que extiende `flexible_table`, con dependencias,
    versión instalada, compatibilidad y última release, ordenación por columnas, filtros por
    texto y estado, y exportación a CSV/Excel con `core\dataformat`.
  - >-
    **Lo integré en la administración de Moodle 4.1+** (registro en `settings.php`, capacidad
    `moodle/site:config`), con cadenas en inglés y español y provider de privacidad: el plugin
    no guarda datos personales, solo consume datos públicos de moodle.org.
  - >-
    **Normalicé las versiones a `major.minor`** (5.1, no 5.1.0) y corregí el crash de instalación
    por `normalize_version()` sin cargar, que rompía la instalación.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Informe de compatibilidad de plugins con la versión 5.1 de Moodle seleccionada.
        caption: Informe de local_plugincompatibility para Moodle 5.1
---
