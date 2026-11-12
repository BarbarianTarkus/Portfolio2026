---
slug: overlyric
name: Overlyric
kind: propio
year: '2026'
summary: >-
  **Overlay de lletres per a Windows 10/11**: llegeix la pista en reproducció dels controls
  multimèdia del sistema i pinta la lletra sincronitzada de LRCLIB en una finestra transparent
  que queda per sobre de tot i no roba el focus. Sense integració per reproductor.
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
work: 67 commits
links:
  - label: Repositori d'Overlyric
    href: 'https://github.com/BarbarianTarkus/Overlyric'
    kind: repo
problem: >-
  Els overlays de lletres demanen un connector per reproductor, o t'obliguen a triar entre
  Spotify i la resta, i el rellotge es desvia tan bon punt una pista comença a mitges o el
  reproductor congela la posició. Volia **un sol overlay que funcioni amb qualsevol reproductor
  de Windows i no destorbi a la partida**: lletra llegible sobre el joc, sense robar el focus i
  sense gastar CPU entre línia i línia.
decisions:
  - >-
    **Llegir els controls multimèdia de Windows (SMTC/GSMTC), no el reproductor**: qualsevol
    reproductor que registri una sessió —TIDAL, Spotify, VLC, foobar2000, el navegador—
    funciona sense instal·lar res, i el que no publica surt anomenat a la safata en lloc de
    deixar un overlay mut.
  - >-
    **Triar l'enregistrament, no el primer resultat de LRCLIB**: els sufixos d'edició es treuen
    abans de consultar, la durada mana al rànquing i una versió sense temps es substitueix per
    la primera sincronitzada de la mateixa durada; una segona cerca amb l'àlbum cobreix el que
    amaga el límit de vint resultats.
  - >-
    **No fiar-se de la posició que publica el reproductor**: el rellotge envellix aquesta
    posició amb un cronòmetre monotònic, així que TIDAL —que congela la seva línia de temps— i
    començar una cançó a mitges continuen caient a la línia correcta.
  - >-
    **Dibuixar sense framework d'UI**: una finestra `WS_EX_NOREDIRECTIONBITMAP` composta amb
    DirectComposition i pintada amb Direct2D/DirectWrite, amb els textos a la memòria cau i zero
    assignacions per fotograma; darrere no hi ha WPF, WinUI ni WinForms.
  - >-
    **Arreglar la línia, no només mirar-la**: el full és un editor (marcar inici i fi, ±10–250
    ms, desfer i refer), la correcció es guarda per pista i per dispositiu de sortida, es pot
    importar un `.lrc` local i publicar el full corregit a LRCLIB després d'una confirmació que
    mostra l'enviament exacte.
  - >-
    **Mesurat abans d'afirmar-ho**: 65 MB de memòria estable, un 0,15 % d'un nucli i 11 MB en un
    únic executable NativeAOT de .NET 10; i un límit dit a la cara: sobre pantalla completa
    exclusiva no es pot dibuixar, així que ho avisa un cop i assenyala Borderless.
gallery:
  - view: web
    label: Web
    images:
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
