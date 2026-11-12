---
slug: mixology
name: Mixology-Luismi
kind: cliente
year: '2026'
summary: >-
  **Landing page for a cocktail service**: a static site built with Astro and a headless CMS so
  the client can edit without touching code.
tags:
  - Astro
  - TinaCMS
  - Cloudflare
  - GitHub Actions
  - OpenCode
period: January — October 2026
work: 69 commits
links:
  - label: BarbarianTarkus/Mixology-Luismi
    href: 'https://github.com/BarbarianTarkus/Mixology-Luismi'
    kind: repo
  - label: Demo
    href: 'https://mixology-luismi.ricardoverduguez.workers.dev/'
    kind: demo
    icon: /projects/mixology/favicon.png
problem: >-
  A friend was starting a cocktail service and needed **a web presence on an almost zero
  budget**: a cheap domain, free hosting and the ability to change texts and photos without
  calling me.
decisions:
  - >-
    **Astro in static mode** served from Cloudflare: zero hosting cost and no server to
    maintain, which was the condition of the job.
  - >-
    I compared Strapi, Decap and TinaCMS; **I went with TinaCMS** because it offers real visual
    editing and does not force self-hosting anything, which the client could not maintain.
  - >-
    **I generated the first visual version with AI help** to iterate quickly and then set
    typography, colors and spacing by hand: leaving the system to the generator produced
    inconsistencies.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/mixology/preview.webp
        alt: Mixology-Luismi site home page with the visual identity of the service.
        caption: Published home page
      - src: /projects/mixology/tina-editor.webp
        alt: TinaCMS open in the visual editing mode of the site.
        caption: 'TinaCMS in action: visual editing'
      - src: /projects/mixology/tina-content.webp
        alt: TinaCMS panel editing the content of a section.
        caption: 'TinaCMS in action: content'
      - src: /projects/mixology/tina-preview.webp
        alt: Preview of the site inside TinaCMS.
        caption: 'TinaCMS in action: preview'
  - view: mobile
    label: Mobile
    images:
      - src: /projects/mixology/mobile-portada.webp
        alt: 'Mobile home page with the home cocktail service tagline and the WhatsApp button.'
        caption: Mobile home page
      - src: /projects/mixology/mobile-servicios.webp
        alt: 'Services on mobile: bar rental, weddings and menu consulting.'
        caption: Services on mobile
      - src: /projects/mixology/mobile-cocteles.webp
        alt: Top 3 cocktails on mobile with Bloody Mary and Citrus Fizz.
        caption: Cocktails on mobile
      - src: /projects/mixology/mobile-contacto.webp
        alt: 'Contact page on mobile with phone, WhatsApp and opening hours.'
        caption: Contact on mobile
---
