---
slug: overlyric
name: Overlyric
kind: propio
year: '2026'
summary: >-
  **Letra sincronizada para cualquier reproductor de Windows**: una ventana transparente que
  muestra la canción que suena y no te roba el foco. Sin conectores por reproductor.
tags:
  - C#
  - .NET 10
  - NativeAOT
  - Win32
  - Direct2D
  - DirectComposition
  - LRCLIB
  - PowerShell
period: 24 octubre — 12 noviembre 2026
links:
  - label: Repositorio de Overlyric
    href: 'https://github.com/BarbarianTarkus/Overlyric'
    kind: repo
problem: >-
  Los overlays de letras suelen pedir un plugin por reproductor o te obligan a elegir entre
  Spotify y el resto. Además, la letra se desincroniza cuando una canción empieza por la mitad o
  el reproductor se queda parado. Quería **una ventana que funcionara con cualquier reproductor
  de Windows sin molestar mientras juego**.
decisions:
  - >-
    **Funciona con cualquier reproductor**: lee lo que Windows está reproduciendo, sin instalar
    nada dentro de Spotify, VLC o el navegador.
  - >-
    **Busca la versión correcta de la letra**: tiene en cuenta la duración y la edición de la
    canción para no mostrar una letra que no corresponde.
  - >-
    **Mantiene el ritmo aunque el reproductor falle**: si la posición se queda parada o la canción
    empieza por la mitad, la letra sigue en la línea correcta.
  - >-
    **Ligera y discreta**: se dibuja sin las librerías habituales de interfaz y consume muy pocos
    recursos, para no afectar al juego.
  - >-
    **También permite corregir la letra**: se pueden ajustar los tiempos, guardar los cambios por
    canción y publicar la versión corregida.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/overlyric/demo.gif
        alt: >-
          Animación de demostración: «No plugin for any player». Overlyric lee lo que Windows está
          reproduciendo y muestra la letra sobre TIDAL, Spotify o el navegador.
        caption: Demostración
      - src: /projects/overlyric/multi-line.webp
        alt: >-
          Overlay multilínea sobre un juego: título de la pista, tres líneas de letra y la barra
          de progreso.
        caption: Multilínea sobre el juego
      - src: /projects/overlyric/lyric-viewer.webp
        alt: >-
          Hoja de letra completa con todas las marcas de tiempo y la línea actual resaltada.
        caption: Hoja de letra completa
      - src: /projects/overlyric/settings-lyrics.webp
        alt: 'Ajustes de Letras: modo, líneas visibles, tamaños de texto y barrido karaoke.'
        caption: Ajustes de letras
      - src: /projects/overlyric/settings-oled.webp
        alt: >-
          Ajustes de Apariencia: preset OLED, opacidad del fondo, desplazamiento de píxeles y
          paletas.
        caption: OLED y apariencia
---
