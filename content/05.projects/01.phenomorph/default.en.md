---
slug: phenomorph
name: Phenomorph
kind: propio
year: '2026'
summary: >-
  **Unofficial Phenomena Experience guide**: showtimes, available seats, cycles and purchase
  links in a single app. The app is live.
tags:
  - Deno
  - Fresh 2
  - Preact
  - SQLite
  - Tailwind
  - Python
  - DeepSeek Harness
period: 27 October — 1 November 2026
links:
  - label: Phenomorph repository
    href: 'https://github.com/BarbarianTarkus/phenomorph'
    kind: repo
  - label: Preview
    href: 'https://phenomorph.verduguez.com'
    kind: demo
    icon: /projects/phenomorph/favicon.png
problem: >-
  Cinema showtimes live scattered across the website, ticket sales and the calendar. To know what
  you can see today, how many seats are left and when a screening fits, you have to jump between
  tabs. I wanted to **bring it all onto one screen**, without relying on an API the cinema does
  not offer.
decisions:
  - >-
    **One screen for the whole programme**: the app loads the data on the server, so the first
    view is ready and only search and filters run in the browser.
  - >-
    **Up-to-date data without manual work**: a small script collects the cinema's showtimes and
    turns them into a database ready to query.
  - >-
    **Filters that understand the data**: seats and formats (35 mm, 70 mm, 4K, Dolby Atmos…) are
    organised when collected, so you can search and compare without free text.
  - >-
    **A design of its own for the venue**: warm colours, custom typefaces and a 35 mm film strip
    for the cycles, instead of a generic template.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/phenomorph/home-desktop.webp
        alt: 'Desktop home page with the showtimes, the next screening and the box office.'
        caption: Desktop home page
      - src: /projects/phenomorph/letterboxd-desktop.webp
        alt: Program search with the Letterboxd button.
        caption: Letterboxd search
      - src: /projects/phenomorph/film-desktop.webp
        alt: 'Film detail page with synopsis, cast and screenings.'
        caption: Film detail page
      - src: /projects/phenomorph/filmstrip-desktop.webp
        alt: Cycles rendered as a 35 mm film strip.
        caption: 35 mm film strip
      - src: /projects/phenomorph/film-sessions.webp
        alt: Screenings with seat meters and calendar links.
        caption: Screenings and calendar
      - src: /projects/phenomorph/date-filter-desktop.webp
        alt: Monthly calendar with several days selected.
        caption: Date filter
      - src: /projects/phenomorph/taquilla.webp
        alt: Box office ranking with occupancy meters.
        caption: Box office
      - src: /projects/phenomorph/ciclos-desktop.webp
        alt: Cycles page with posters and banners.
        caption: Cycles
      - src: /projects/phenomorph/trailer-modal.webp
        alt: Trailer player open in a modal.
        caption: Trailer in a modal
  - view: mobile
    label: Mobile
    images:
      - src: /projects/phenomorph/home-mobile.webp
        alt: Compact mobile home page with the showtimes.
        caption: Mobile home page
      - src: /projects/phenomorph/mobile-cartelera.webp
        alt: Showtimes on mobile with posters and times.
        caption: Showtimes on mobile
      - src: /projects/phenomorph/mobile-ciclos.webp
        alt: Cycles on mobile.
        caption: Cycles on mobile
      - src: /projects/phenomorph/mobile-filters.webp
        alt: Cycle and availability filters on mobile.
        caption: Filters on mobile
      - src: /projects/phenomorph/mobile-modal.webp
        alt: Trailer on mobile with controls and close button.
        caption: Trailer on mobile
      - src: /projects/phenomorph/taquilla-mobile.webp
        alt: Box office ranking on mobile.
        caption: Box office on mobile
---
