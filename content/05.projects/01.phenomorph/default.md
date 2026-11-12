---
slug: phenomorph
name: Phenomorph
kind: propio
year: '2026'
summary: >-
  **Programa no oficial de Phenomena Experience**: cartelera, butacas libres, ciclos y enlaces de
  compra en una sola app SSR con Deno y Fresh. El repositorio sigue privado; la app está
  publicada.
tags:
  - Deno
  - Fresh 2
  - Preact
  - SQLite
  - Tailwind
  - Python
  - DeepSeek Harness
period: 27 octubre — 1 noviembre 2026
work: 45 commits
links:
  - label: Repositorio de Phenomorph
    href: 'https://github.com/BarbarianTarkus/phenomorph'
    kind: repo
  - label: Preview
    href: 'https://phenomorph.verduguez.com'
    kind: demo
    icon: /projects/phenomorph/favicon.png
problem: >-
  La cartelera del cine vive repartida entre la web, la compra de entradas y el calendario:
  saber qué se puede ver hoy, cuántas butacas quedan y cuándo encaja una sesión obliga a saltar
  entre pestañas. Quería **resolverlo en una sola pantalla**, sin depender de una API que el cine
  no ofrece.
decisions:
  - >-
    **Fresh 2 con SSR** e islas pequeñas (unos 25 KB de JS/CSS) en vez de una SPA: la primera
    pantalla ya trae la cartelera y solo se hidrata la búsqueda y los filtros.
  - >-
    **Un scraper en Python** de la biblioteca estándar genera el JSON y una SQLite que la app lee
    con node:sqlite; el dataset se reconstruye en cada máquina y nunca se versiona, así que no
    envejece en el repositorio.
  - >-
    **Los datos de butacas y formatos** se normalizan en el scraper (35 mm, 70 mm, 4K, Dolby
    Atmos...), para que los filtros y las fichas no trabajen con una nota de texto libre.
  - >-
    **Diseño propio de la sala**: paleta cálida, tipografías autoalojadas y una tira de 35 mm para
    los ciclos, en lugar de una plantilla de cartelera genérica.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/phenomorph/home-desktop.webp
        alt: 'Portada de escritorio con la cartelera, la próxima sesión y la taquilla.'
        caption: Portada de escritorio
      - src: /projects/phenomorph/letterboxd-desktop.webp
        alt: Buscador del programa con el botón de Letterboxd.
        caption: Búsqueda en Letterboxd
      - src: /projects/phenomorph/film-desktop.webp
        alt: 'Ficha de película con sinopsis, reparto y sesiones.'
        caption: Ficha de película
      - src: /projects/phenomorph/filmstrip-desktop.webp
        alt: Ciclos renderizados como una tira de 35 mm.
        caption: Tira de 35 mm
      - src: /projects/phenomorph/film-sessions.webp
        alt: Sesiones con medidores de butacas y enlaces al calendario.
        caption: Sesiones y calendario
      - src: /projects/phenomorph/date-filter-desktop.webp
        alt: Calendario mensual con varios días seleccionados.
        caption: Filtro por fechas
      - src: /projects/phenomorph/taquilla.webp
        alt: Ranking de taquilla con medidores de ocupación.
        caption: Taquilla
      - src: /projects/phenomorph/ciclos-desktop.webp
        alt: Página de ciclos con carteles y banners.
        caption: Ciclos
      - src: /projects/phenomorph/trailer-modal.webp
        alt: Reproductor de tráiler abierto en modal.
        caption: Tráiler en modal
  - view: mobile
    label: Móvil
    images:
      - src: /projects/phenomorph/home-mobile.webp
        alt: Portada móvil compacta con la cartelera.
        caption: Portada en móvil
      - src: /projects/phenomorph/mobile-cartelera.webp
        alt: Cartelera en móvil con carteles y horarios.
        caption: Cartelera en móvil
      - src: /projects/phenomorph/mobile-ciclos.webp
        alt: Ciclos en móvil.
        caption: Ciclos en móvil
      - src: /projects/phenomorph/mobile-filters.webp
        alt: Filtros de ciclo y disponibilidad en móvil.
        caption: Filtros en móvil
      - src: /projects/phenomorph/mobile-modal.webp
        alt: Tráiler en móvil con controles y cierre.
        caption: Tráiler en móvil
      - src: /projects/phenomorph/taquilla-mobile.webp
        alt: Ranking de taquilla en móvil.
        caption: Taquilla en móvil
---
