---
slug: phenomorph
name: Phenomorph
kind: propio
year: '2026'
summary: >-
  **Unofficial Phenomena Experience program**: showtimes, available seats, cycles and purchase
  links in a single SSR app built with Deno and Fresh. The repository is still private; the app
  is live.
tags:
  - Deno
  - Fresh 2
  - Preact
  - SQLite
  - Tailwind
  - Python
  - DeepSeek Harness
period: 27 October — 1 November 2026
work: 45 commits
links:
  - label: Phenomorph repository
    href: 'https://github.com/BarbarianTarkus/phenomorph'
    kind: repo
  - label: Preview
    href: 'https://phenomorph.verduguez.com'
    kind: demo
    icon: /projects/phenomorph/favicon.png
problem: >-
  The cinema showtimes live scattered across the website, ticket sales and the calendar:
  knowing what you can see today, how many seats are left and when a screening fits means
  jumping between tabs. I wanted to **solve it on a single screen**, without relying on an API
  the cinema does not offer.
decisions:
  - >-
    **Fresh 2 with SSR** and small islands (about 25 KB of JS/CSS) instead of a SPA: the first
    screen already ships the showtimes and only the search and the filters hydrate.
  - >-
    **A Python scraper** using only the standard library generates the JSON and a SQLite
    database that the app reads with node:sqlite; the dataset is rebuilt on every machine and
    never versioned, so it does not go stale in the repository.
  - >-
    **Seat and format data** is normalized in the scraper (35 mm, 70 mm, 4K, Dolby Atmos...),
    so the filters and the detail pages do not work from a free-text note.
  - >-
    **A design of my own for the venue**: warm palette, self-hosted typefaces and a 35 mm film
    strip for the cycles, instead of a generic showtimes template.
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
