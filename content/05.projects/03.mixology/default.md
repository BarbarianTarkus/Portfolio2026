---
slug: mixology
name: Mixology-Luismi
kind: cliente
year: '2026'
summary: >-
  **Landing page para un servicio de coctelería**: sitio estático con Astro y un CMS headless para
  que el cliente edite sin tocar código.
tags:
  - Astro
  - TinaCMS
  - Cloudflare
  - GitHub Actions
  - OpenCode
period: enero — octubre 2026
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
  Un amigo empezaba con un servicio de coctelería y necesitaba **presencia web con presupuesto
  casi nulo**: dominio barato, hosting gratuito y capacidad de cambiar textos y fotos sin
  llamarme.
decisions:
  - >-
    **Astro en modo estático** servido desde Cloudflare: coste de hosting cero y ningún servidor que
    mantener, que era la condición del encargo.
  - >-
    Comparé Strapi, Decap y TinaCMS; **me quedé con TinaCMS** porque ofrece edición visual real y no
    obliga a autohospedar nada, algo que el cliente no podría mantener.
  - >-
    **Generé la primera versión visual con ayuda de IA** para iterar rápido y después fijé
    tipografía, colores y espaciado a mano: dejar el sistema en manos del generador producía
    inconsistencias.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/mixology/preview.webp
        alt: Portada del sitio de Mixology-Luismi con la identidad visual del servicio.
        caption: Portada publicada
      - src: /projects/mixology/tina-editor.webp
        alt: TinaCMS abierto en el modo de edición visual del sitio.
        caption: 'TinaCMS en acción: edición visual'
      - src: /projects/mixology/tina-content.webp
        alt: Panel de TinaCMS editando el contenido de una sección.
        caption: 'TinaCMS en acción: contenido'
      - src: /projects/mixology/tina-preview.webp
        alt: Vista previa del sitio dentro de TinaCMS.
        caption: 'TinaCMS en acción: vista previa'
  - view: mobile
    label: Móvil
    images:
      - src: /projects/mixology/mobile-portada.webp
        alt: 'Portada móvil con el reclamo de coctelería a domicilio y el botón de WhatsApp.'
        caption: Portada en móvil
      - src: /projects/mixology/mobile-servicios.webp
        alt: 'Servicios en móvil: alquiler de barras, bodas y consultoría de carta.'
        caption: Servicios en móvil
      - src: /projects/mixology/mobile-cocteles.webp
        alt: Top 3 de cócteles en móvil con Bloody Mary y Citrus Fizz.
        caption: Cócteles en móvil
      - src: /projects/mixology/mobile-contacto.webp
        alt: 'Página de contacto en móvil con teléfono, WhatsApp y horario.'
        caption: Contacto en móvil
---
