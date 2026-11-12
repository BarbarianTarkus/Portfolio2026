---
slug: phenomorph
name: Phenomorph
kind: propio
year: '2026'
summary: >-
  **Programa no oficial de Phenomena Experience**: cartellera, butaques lliures, cicles i enllaços de
  compra en una sola app SSR amb Deno i Fresh. El repositori continua privat; l'app està
  publicada.
tags:
  - Deno
  - Fresh 2
  - Preact
  - SQLite
  - Tailwind
  - Python
  - DeepSeek Harness
period: 27 octubre — 1 novembre 2026
work: 45 commits
links:
  - label: Repositori de Phenomorph
    href: 'https://github.com/BarbarianTarkus/phenomorph'
    kind: repo
  - label: Vista prèvia
    href: 'https://phenomorph.verduguez.com'
    kind: demo
    icon: /projects/phenomorph/favicon.png
problem: >-
  La cartellera del cinema viu repartida entre la web, la compra d'entrades i el calendari:
  saber què es pot veure avui, quantes butaques queden i quan encaixa una sessió obliga a saltar
  entre pestanyes. Volia **resoldre-ho en una sola pantalla**, sense dependre d'una API que el cinema
  no ofereix.
decisions:
  - >-
    **Fresh 2 amb SSR** i illes petites (uns 25 KB de JS/CSS) en lloc d'una SPA: la primera
    pantalla ja porta la cartellera i només s'hidrata la cerca i els filtres.
  - >-
    **Un scraper en Python** de la biblioteca estàndard genera el JSON i una SQLite que l'app llegeix
    amb node:sqlite; el dataset es reconstrueix a cada màquina i mai es versiona, així que no
    envelleix al repositori.
  - >-
    **Les dades de butaques i formats** es normalitzen al scraper (35 mm, 70 mm, 4K, Dolby
    Atmos...), perquè els filtres i les fitxes no treballin amb una nota de text lliure.
  - >-
    **Disseny propi de la sala**: paleta càlida, tipografies autoallotjades i una tira de 35 mm per
    als cicles, en lloc d'una plantilla de cartellera genèrica.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/phenomorph/home-desktop.webp
        alt: 'Portada d''escriptori amb la cartellera, la propera sessió i la taquilla.'
        caption: Portada d'escriptori
      - src: /projects/phenomorph/letterboxd-desktop.webp
        alt: Cercador del programa amb el botó de Letterboxd.
        caption: Cerca a Letterboxd
      - src: /projects/phenomorph/film-desktop.webp
        alt: 'Fitxa de pel·lícula amb sinopsi, repartiment i sessions.'
        caption: Fitxa de pel·lícula
      - src: /projects/phenomorph/filmstrip-desktop.webp
        alt: Cicles renderitzats com una tira de 35 mm.
        caption: Tira de 35 mm
      - src: /projects/phenomorph/film-sessions.webp
        alt: Sessions amb indicadors de butaques i enllaços al calendari.
        caption: Sessions i calendari
      - src: /projects/phenomorph/date-filter-desktop.webp
        alt: Calendari mensual amb diversos dies seleccionats.
        caption: Filtre per dates
      - src: /projects/phenomorph/taquilla.webp
        alt: Rànquing de taquilla amb indicadors d'ocupació.
        caption: Taquilla
      - src: /projects/phenomorph/ciclos-desktop.webp
        alt: Pàgina de cicles amb cartells i bàners.
        caption: Cicles
      - src: /projects/phenomorph/trailer-modal.webp
        alt: Reproductor de tràiler obert en modal.
        caption: Tràiler en modal
  - view: mobile
    label: Mòbil
    images:
      - src: /projects/phenomorph/home-mobile.webp
        alt: Portada mòbil compacta amb la cartellera.
        caption: Portada en mòbil
      - src: /projects/phenomorph/mobile-cartelera.webp
        alt: Cartellera en mòbil amb cartells i horaris.
        caption: Cartellera en mòbil
      - src: /projects/phenomorph/mobile-ciclos.webp
        alt: Cicles en mòbil.
        caption: Cicles en mòbil
      - src: /projects/phenomorph/mobile-filters.webp
        alt: Filtres de cicle i disponibilitat en mòbil.
        caption: Filtres en mòbil
      - src: /projects/phenomorph/mobile-modal.webp
        alt: Tràiler en mòbil amb controls i tancament.
        caption: Tràiler en mòbil
      - src: /projects/phenomorph/taquilla-mobile.webp
        alt: Rànquing de taquilla en mòbil.
        caption: Taquilla en mòbil
---
