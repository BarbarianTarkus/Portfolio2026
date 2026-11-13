---
slug: phenomorph
name: Phenomorph
kind: propio
year: '2026'
summary: >-
  **Guía no oficial de Phenomena Experience**: cartelera, butacas libres, ciclos y enlaces de
  compra en una sola app. La app está publicada.
tags:
  - Deno
  - Fresh 2
  - Preact
  - SQLite
  - Tailwind
  - Python
  - DeepSeek Harness
period: 27 octubre — 1 noviembre 2026
links:
  - label: Repositorio de Phenomorph
    href: 'https://github.com/BarbarianTarkus/phenomorph'
    kind: repo
  - label: Preview
    href: 'https://phenomorph.verduguez.com'
    kind: demo
    icon: /projects/phenomorph/favicon.png
problem: >-
  La cartelera del cine vive repartida entre la web, la compra de entradas y el calendario. Para
  saber qué se puede ver hoy, cuántas butacas quedan y cuándo encaja una sesión hay que saltar
  entre pestañas. Quería **reunirlo todo en una sola pantalla**, sin depender de una API que el
  cine no ofrece.
decisions:
  - >-
    **Una sola pantalla para toda la cartelera**: la app carga la información en el servidor, así
    que la primera vista ya está lista y solo la búsqueda y los filtros se activan en el navegador.
  - >-
    **Datos actualizados sin trabajo manual**: un pequeño programa recoge la cartelera de la web
    del cine y la convierte en una base de datos lista para consultar.
  - >-
    **Filtros que entienden la información**: las butacas y los formatos (35 mm, 70 mm, 4K, Dolby
    Atmos…) se ordenan al recogerlos, para poder buscar y comparar sin texto libre.
  - >-
    **Un diseño propio de la sala**: colores cálidos, tipografías propias y una tira de 35 mm para
    los ciclos, en lugar de una plantilla genérica.
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
