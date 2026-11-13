---
slug: overlyric
name: Overlyric
kind: propio
year: '2026'
summary: >-
  **Lletra sincronitzada per a qualsevol reproductor de Windows**: una finestra transparent que
  mostra la cançó que sona i no et roba el focus. Sense connectors per reproductor.
tags:
  - C#
  - .NET 10
  - NativeAOT
  - Win32
  - Direct2D
  - DirectComposition
  - LRCLIB
  - PowerShell
period: 24 octubre — 12 novembre 2026
links:
  - label: Repositori d'Overlyric
    href: 'https://github.com/BarbarianTarkus/Overlyric'
    kind: repo
problem: >-
  Els overlays de lletres solen demanar un connector per reproductor o t'obliguen a triar entre
  Spotify i la resta. A més, la lletra es desincronitza quan una cançó comença per la meitat o el
  reproductor es queda aturat. Volia **una finestra que funcionés amb qualsevol reproductor de
  Windows sense molestar mentre jugues**.
decisions:
  - >-
    **Funciona amb qualsevol reproductor**: llegeix el que Windows està reproduint, sense
    instal·lar res dins de Spotify, VLC o el navegador.
  - >-
    **Busca la versió correcta de la lletra**: té en compte la durada i l'edició de la cançó per
    no mostrar una lletra que no hi correspon.
  - >-
    **Manté el ritme encara que el reproductor falli**: si la posició es queda aturada o la cançó
    comença per la meitat, la lletra segueix la línia correcta.
  - >-
    **Lleugera i discreta**: es dibuixa sense les llibreries habituals d'interfície i consumeix
    molt pocs recursos, per no afectar el joc.
  - >-
    **També permet corregir la lletra**: es poden ajustar els temps, guardar els canvis per cançó
    i publicar la versió corregida.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/overlyric/demo.gif
        alt: >-
          Animació de demostració: «No plugin for any player». Overlyric llegeix què està
          reproduint Windows i mostra la lletra sobre TIDAL, Spotify o el navegador.
        caption: Demostració
      - src: /projects/overlyric/multi-line.webp
        alt: >-
          Overlay multilínia sobre un joc: títol de la pista, tres línies de lletra i la barra
          de progrés.
        caption: Multilínia sobre el joc
      - src: /projects/overlyric/lyric-viewer.webp
        alt: >-
          Full de lletra complet amb totes les marques de temps i la línia actual ressaltada.
        caption: Full de lletra complet
      - src: /projects/overlyric/settings-lyrics.webp
        alt: "Paràmetres de Lletres: mode, línies visibles, mides de text i escombratge karaoke."
        caption: Paràmetres de lletres
      - src: /projects/overlyric/settings-oled.webp
        alt: >-
          Paràmetres d'Aparença: preset OLED, opacitat del fons, desplaçament de píxels i
          paletes.
        caption: OLED i aparença
---
