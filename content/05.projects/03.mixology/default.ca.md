---
slug: mixology
name: Mixology-Luismi
kind: cliente
year: '2026'
summary: >-
  **Pàgina de presentació per a un servei de cocteleria**: lloc estàtic amb Astro i un CMS headless perquè
  el client editi sense tocar codi.
tags:
  - Astro
  - TinaCMS
  - Cloudflare
  - GitHub Actions
  - OpenCode
period: gener — octubre 2026
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
  Un amic començava amb un servei de cocteleria i necessitava **presència web amb un pressupost
  gairebé nul**: domini barat, hosting gratuït i capacitat de canviar textos i fotos sense
  trucar-me.
decisions:
  - >-
    **Astro en mode estàtic** servit des de Cloudflare: cost d'hosting zero i cap servidor a
    mantenir, que era la condició de l'encàrrec.
  - >-
    Vaig comparar Strapi, Decap i TinaCMS; **em vaig quedar amb TinaCMS** perquè ofereix edició
    visual real i no obliga a autoallotjar res, cosa que el client no podria mantenir.
  - >-
    **Vaig generar la primera versió visual amb ajuda d'IA** per iterar ràpid i després vaig fixar
    tipografia, colors i espaiat a mà: deixar el sistema en mans del generador produïa
    inconsistències.
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
