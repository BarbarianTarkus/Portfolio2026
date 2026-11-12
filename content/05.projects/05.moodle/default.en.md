---
slug: moodle
name: local_plugincompatibility
kind: propio
year: '2026'
summary: >-
  **Moodle local plugin** that cross-checks the installed plugins against the official
  directory and answers, for the version you want to upgrade to, which ones are still
  compatible, which are not and which are not even published on moodle.org.
tags:
  - PHP
  - Moodle
period: February — March 2026
work: 19 commits on develop
links:
  - label: moodle-local_plugincompatibility (develop)
    href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    kind: repo
problem: >-
  Moodle does not warn whether third-party plugins will keep working when you upgrade: the
  answer is scattered across the plugin pages on moodle.org, so preparing an upgrade means
  checking plugin by plugin which ones have a release for the target version. I wanted that
  answer **in a single table, inside the site itself** and for any future version.
decisions:
  - >-
    **I started from Raúl Martínez's 2020 plugin**, which made an HTML request to moodle.org
    and a regex per installed plugin, and rewrote it on the official pluglist API
    (`download.moodle.org/api/1.3/pluglist.php`): compatibility is derived from
    `supportedmoodles` and the response is cached for an hour, storing the raw JSON
    (~15 MB) so the whole tree is not serialized.
  - >-
    **I rewrote the report as its own class** extending `flexible_table`, with
    dependencies, installed version, compatibility and latest release, column sorting, text
    and status filters, and CSV/Excel export through `core\dataformat`.
  - >-
    **I integrated it into the Moodle 4.1+ administration** (registration in
    `settings.php`, `moodle/site:config` capability), with English and Spanish
    strings and a privacy provider: the plugin stores no personal data, it only consumes
    public data from moodle.org.
  - >-
    **I normalized versions to `major.minor`** (5.1, not 5.1.0) and fixed the
    installation crash caused by `normalize_version()` not being loaded, which broke the
    install.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Plugin compatibility report with Moodle 5.1 selected.
        caption: local_plugincompatibility report for Moodle 5.1
---
