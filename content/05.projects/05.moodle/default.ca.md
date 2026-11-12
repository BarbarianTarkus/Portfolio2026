---
slug: moodle
name: local_plugincompatibility
kind: propio
year: '2026'
summary: >-
  **Plugin local de Moodle** que creua els plugins instal·lats amb el catàleg oficial i respon,
  per a la versió a la qual vols actualitzar, quins continuen sent compatibles, quins no i
  quins ni tan sols estan publicats a moodle.org.
tags:
  - PHP
  - Moodle
period: febrer — març 2026
work: 19 commits a develop
links:
  - label: moodle-local_plugincompatibility (develop)
    href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    kind: repo
problem: >-
  Moodle no avisa si els plugins de tercers continuaran funcionant en pujar de versió: la
  resposta està repartida per les fitxes de moodle.org, així que preparar una actualització
  obliga a comprovar plugin per plugin quins tenen una release per a la versió de destinació.
  Volia aquesta resposta **en una sola taula, dins del mateix lloc** i per a qualsevol versió
  futura.
decisions:
  - >-
    **Vaig partir del plugin de 2020 de Raúl Martínez**, que llançava una petició HTML a moodle.org i una
    regex per cada plugin instal·lat, i el vaig reescriure sobre l'API oficial del pluglist
    (`download.moodle.org/api/1.3/pluglist.php`): la compatibilitat es deriva de
    `supportedmoodles` i la resposta es cacheja una hora, guardant el JSON en brut (~15 MB)
    per no serialitzar l'arbre sencer.
  - >-
    **Vaig reescriure l'informe com una classe pròpia** que estén `flexible_table`, amb dependències,
    versió instal·lada, compatibilitat i última release, ordenació per columnes, filtres per
    text i estat, i exportació a CSV/Excel amb `core\dataformat`.
  - >-
    **El vaig integrar a l'administració de Moodle 4.1+** (registre a `settings.php`, capacitat
    `moodle/site:config`), amb cadenes en anglès i espanyol i provider de privacitat: el plugin
    no guarda dades personals, només consumeix dades públiques de moodle.org.
  - >-
    **Vaig normalitzar les versions a `major.minor`** (5.1, no 5.1.0) i vaig corregir el crash
    d'instal·lació per `normalize_version()` sense carregar, que trencava la instal·lació.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Informe de compatibilitat de plugins amb la versió 5.1 de Moodle seleccionada.
        caption: Informe de local_plugincompatibility per a Moodle 5.1
---
