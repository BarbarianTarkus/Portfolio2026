---
slug: overlyric
name: Overlyric
kind: propio
year: '2026'
summary: >-
  **Synced lyrics for any Windows player**: a transparent window that shows the song that is
  playing and never takes focus. No per-player connectors.
tags:
  - C#
  - .NET 10
  - NativeAOT
  - Win32
  - Direct2D
  - DirectComposition
  - LRCLIB
  - PowerShell
period: 24 October — 12 November 2026
links:
  - label: Overlyric repository
    href: 'https://github.com/BarbarianTarkus/Overlyric'
    kind: repo
problem: >-
  Lyric overlays usually ask for a plug-in per player, or make you choose between Spotify and the
  rest. On top of that, the lyrics drift when a song starts halfway through or the player stalls.
  I wanted **a window that worked with any Windows player without getting in the way while you
  play**.
decisions:
  - >-
    **Works with any player**: it reads what Windows is playing, with nothing installed inside
    Spotify, VLC or the browser.
  - >-
    **Finds the right version of the lyrics**: it takes the song's length and edition into account
    so it does not show lyrics that do not match.
  - >-
    **Keeps time even if the player fails**: if the position stalls or the song starts halfway
    through, the lyrics stay on the right line.
  - >-
    **Light and discreet**: it draws without the usual UI libraries and uses very few resources,
    so it does not affect the game.
  - >-
    **You can also fix the lyrics**: adjust the timings, save changes per song and publish the
    corrected version.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/overlyric/demo.gif
        alt: >-
          Demo animation: “No plugin for any player”. Overlyric reads what Windows is playing and
          shows the lyrics over TIDAL, Spotify or a browser.
        caption: Demo
      - src: /projects/overlyric/multi-line.webp
        alt: >-
          Multi-line overlay over a game: track title, three lyric lines and the progress bar.
        caption: Multi-line over a game
      - src: /projects/overlyric/lyric-viewer.webp
        alt: >-
          Full lyric sheet with every timestamp and the line being sung highlighted.
        caption: Full lyric sheet
      - src: /projects/overlyric/settings-lyrics.webp
        alt: 'Lyrics settings: mode, lines shown, text sizes and the karaoke sweep.'
        caption: Lyrics settings
      - src: /projects/overlyric/settings-oled.webp
        alt: >-
          Appearance settings: OLED preset, backdrop opacity, pixel shift and palettes.
        caption: OLED and appearance
---
