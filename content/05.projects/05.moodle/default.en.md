---
slug: moodle
name: local_plugincompatibility
kind: propio
year: '2026'
summary: >-
  **Moodle plugin** that checks which installed plugins will keep working when you upgrade the
  site, which ones will not, and which ones are not even in the official directory.
tags:
  - PHP
  - Moodle
period: February — March 2026
links:
  - label: moodle-local_plugincompatibility (develop)
    href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    kind: repo
problem: >-
  Moodle does not warn whether third-party plugins will keep working when you upgrade. The
  information is scattered across the plugin pages on moodle.org, so preparing an upgrade means
  checking them one by one. I wanted to see it all **in a single table, inside Moodle itself**.
decisions:
  - >-
    **A single table inside Moodle**: it gathers the installed plugins and shows which ones are
    compatible with the version you want to upgrade to.
  - >-
    **Data from the official directory**: compatibility is checked against public information on
    moodle.org and cached so queries are not repeated.
  - >-
    **A useful report, not just a list**: it lets you sort, filter by text or status and export
    the result to CSV or Excel.
  - >-
    **Built into the admin area**: it respects Moodle permissions, stores no personal data and is
    available in English and Spanish.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Plugin compatibility report with Moodle 5.1 selected.
        caption: local_plugincompatibility report for Moodle 5.1
---
