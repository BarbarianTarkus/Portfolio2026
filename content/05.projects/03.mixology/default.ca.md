---
slug: mixology
name: Mixology-Luismi
kind: encargo
year: '2026'
summary: >-
  **Pàgina de presentació per a un servei de cocteleria**: un lloc estàtic fàcil d'actualitzar,
  perquè el servei pugui canviar textos i fotos sense tocar codi.
tags:
  - Astro
  - TinaCMS
  - Cloudflare
  - GitHub Actions
  - OpenCode
period: gener — octubre 2026
links:
  - label: BarbarianTarkus/Mixology-Luismi
    href: 'https://github.com/BarbarianTarkus/Mixology-Luismi'
    kind: repo
  - label: Demo
    href: 'https://mixology-luismi.ricardoverduguez.workers.dev/'
    kind: demo
    icon: /projects/mixology/favicon.png
problem: >-
  Un amic començava amb un servei de cocteleria i necessitava **una web amb un pressupost gairebé
  nul**: domini barat, allotjament gratuït i la possibilitat de canviar textos i fotos sense
  dependre de mi.
decisions:
  - >-
    **Un lloc estàtic a Cloudflare**: sense servidor a mantenir i amb un cost d'allotjament
    pràcticament nul, que era la condició de l'encàrrec.
  - >-
    **Un editor visual per al dia a dia**: vaig comparar diverses opcions i vaig triar TinaCMS
    perquè permet editar textos i fotos sense tocar codi i sense muntar infraestructura.
  - >-
    **Disseny revisat a mà**: vaig partir d'una primera versió generada amb IA per avançar ràpid,
    però vaig fixar tipografia, colors i espaiat manualment perquè tot fos coherent.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/mixology/preview.webp
        alt: Portada del lloc de Mixology-Luismi amb la identitat visual del servei.
        caption: Portada publicada
      - src: /projects/mixology/tina-editor.webp
        alt: TinaCMS obert en el mode d'edició visual del lloc.
        caption: 'TinaCMS en acció: edició visual'
      - src: /projects/mixology/tina-content.webp
        alt: Panell de TinaCMS editant el contingut d'una secció.
        caption: 'TinaCMS en acció: contingut'
      - src: /projects/mixology/tina-preview.webp
        alt: Vista prèvia del lloc dins de TinaCMS.
        caption: 'TinaCMS en acció: vista prèvia'
  - view: mobile
    label: Mòbil
    images:
      - src: /projects/mixology/mobile-portada.webp
        alt: 'Portada mòbil amb el reclam de cocteleria a domicili i el botó de WhatsApp.'
        caption: Portada en mòbil
      - src: /projects/mixology/mobile-servicios.webp
        alt: 'Serveis en mòbil: lloguer de barres, bodes i consultoria de carta.'
        caption: Serveis en mòbil
      - src: /projects/mixology/mobile-cocteles.webp
        alt: Top 3 de còctels en mòbil amb Bloody Mary i Citrus Fizz.
        caption: Còctels en mòbil
      - src: /projects/mixology/mobile-contacto.webp
        alt: 'Pàgina de contacte en mòbil amb telèfon, WhatsApp i horari.'
        caption: Contacte en mòbil
---
