---
slug: phenomorph
name: Phenomorph
kind: propio
year: '2026'
summary: >-
  **Guia no oficial de Phenomena Experience**: cartellera, butaques lliures, cicles i enllaços de
  compra en una sola app. L'app està publicada.
tags:
  - Deno
  - Fresh 2
  - Preact
  - SQLite
  - Tailwind
  - Python
  - DeepSeek Harness
period: 27 octubre — 1 novembre 2026
links:
  - label: Repositori de Phenomorph
    href: 'https://github.com/BarbarianTarkus/phenomorph'
    kind: repo
  - label: Vista prèvia
    href: 'https://phenomorph.verduguez.com'
    kind: demo
    icon: /projects/phenomorph/favicon.png
problem: >-
  La cartellera del cinema viu repartida entre la web, la compra d'entrades i el calendari. Per
  saber què es pot veure avui, quantes butaques queden i quan encaixa una sessió cal saltar entre
  pestanyes. Volia **reunir-ho tot en una sola pantalla**, sense dependre d'una API que el cinema
  no ofereix.
decisions:
  - >-
    **Una sola pantalla per a tota la cartellera**: l'app carrega la informació al servidor, així
    que la primera vista ja està a punt i només la cerca i els filtres s'activen al navegador.
  - >-
    **Dades actualitzades sense feina manual**: un petit programa recull la cartellera de la web
    del cinema i la converteix en una base de dades a punt per consultar.
  - >-
    **Filtres que entenen la informació**: les butaques i els formats (35 mm, 70 mm, 4K, Dolby
    Atmos…) s'ordenen en recollir-los, per poder buscar i comparar sense text lliure.
  - >-
    **Un disseny propi de la sala**: colors càlids, tipografies pròpies i una tira de 35 mm per als
    cicles, en lloc d'una plantilla genèrica.
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
