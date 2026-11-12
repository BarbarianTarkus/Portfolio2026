---
slug: overlyric
name: Overlyric
kind: propio
year: '2026'
summary: >-
  **Overlay de letras para Windows 10/11**: lee la pista en reproducción de los controles
  multimedia del sistema y pinta la letra sincronizada de LRCLIB en una ventana transparente que
  queda por encima de todo y no roba el foco. Sin integración por reproductor.
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
work: 67 commits
links:
  - label: Repositorio de Overlyric
    href: 'https://github.com/BarbarianTarkus/Overlyric'
    kind: repo
problem: >-
  Los overlays de letras piden un plugin por reproductor, o te obligan a elegir entre Spotify y
  el resto, y el reloj se desvía en cuanto una pista empieza a medias o el reproductor congela la
  posición. Quería **un solo overlay que funcione con cualquier reproductor de Windows y no
  estorbe en la partida**: letra legible encima del juego, sin robar el foco y sin gastar CPU
  entre línea y línea.
decisions:
  - >-
    **Leer los controles multimedia de Windows (SMTC/GSMTC), no al reproductor**: cualquier
    reproductor que registre una sesión —TIDAL, Spotify, VLC, foobar2000, el navegador—
    funciona sin instalar nada, y el que no publica sale nombrado en la bandeja en vez de dejar
    un overlay mudo.
  - >-
    **Elegir la grabación, no el primer resultado de LRCLIB**: los sufijos de edición se quitan
    antes de consultar, la duración manda en el ranking y una versión sin tiempos se sustituye
    por la primera sincronizada de la misma duración; una segunda búsqueda con el álbum cubre lo
    que esconde el límite de veinte resultados.
  - >-
    **No fiarse de la posición que publica el reproductor**: el reloj envejece esa posición con
    un cronómetro monotónico, así que TIDAL —que congela su línea de tiempo— y empezar una
    canción por la mitad siguen cayendo en la línea correcta.
  - >-
    **Dibujar sin framework de UI**: una ventana `WS_EX_NOREDIRECTIONBITMAP` compuesta con
    DirectComposition y pintada con Direct2D/DirectWrite, con los textos cacheados y cero
    asignaciones por fotograma; detrás no hay WPF, WinUI ni WinForms.
  - >-
    **Arreglar la línea, no solo mirarla**: la hoja es un editor (marcar inicio y fin, ±10–250
    ms, deshacer y rehacer), la corrección se guarda por pista y por dispositivo de salida, se
    puede importar un `.lrc` local y publicar la hoja corregida en LRCLIB tras una confirmación
    que muestra el envío exacto.
  - >-
    **Medido antes de afirmarlo**: 65 MB de memoria estable, un 0,15 % de un núcleo y 11 MB en un
    único ejecutable NativeAOT de .NET 10; y un límite dicho a la cara: sobre pantalla completa
    exclusiva no se puede dibujar, así que lo avisa una vez y señala Borderless.
gallery:
  - view: web
    label: Web
    images:
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
