---
slug: mixology
name: Mixology-Luismi
kind: encargo
year: '2026'
summary: >-
  **Landing page para un servicio de coctelería**: un sitio estático fácil de actualizar, para que
  el servicio pueda cambiar textos y fotos sin tocar código.
tags:
  - Astro
  - TinaCMS
  - Cloudflare
  - GitHub Actions
  - OpenCode
period: enero — octubre 2026
links:
  - label: BarbarianTarkus/Mixology-Luismi
    href: 'https://github.com/BarbarianTarkus/Mixology-Luismi'
    kind: repo
  - label: Demo
    href: 'https://mixology-luismi.ricardoverduguez.workers.dev/'
    kind: demo
    icon: /projects/mixology/favicon.png
problem: >-
  Un amigo empezaba con un servicio de coctelería y necesitaba **una web con un presupuesto casi
  nulo**: dominio barato, alojamiento gratuito y la posibilidad de cambiar textos y fotos sin
  depender de mí.
decisions:
  - >-
    **Un sitio estático en Cloudflare**: sin servidor que mantener y con un coste de alojamiento
    prácticamente nulo, que era la condición del encargo.
  - >-
    **Un editor visual para el día a día**: comparé varias opciones y elegí TinaCMS porque permite
    editar textos y fotos sin tocar código y sin montar infraestructura.
  - >-
    **Diseño revisado a mano**: partí de una primera versión generada con IA para avanzar rápido,
    pero fijé tipografía, colores y espaciado manualmente para que todo fuera coherente.
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
