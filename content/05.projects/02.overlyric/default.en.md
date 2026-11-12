---
slug: overlyric
name: Overlyric
kind: propio
year: '2026'
summary: >-
  **Lyric overlay for Windows 10/11**: it reads the now-playing track from Windows' own media
  controls and paints the synced lyrics from LRCLIB into a transparent window that stays above
  everything and never takes focus. No per-player integration.
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
work: 67 commits
links:
  - label: Overlyric repository
    href: 'https://github.com/BarbarianTarkus/Overlyric'
    kind: repo
problem: >-
  Lyric overlays ask for a plug-in per player, or make you choose between Spotify and the rest,
  and the clock drifts the moment a track starts mid-song or the player freezes the position. I
  wanted **one overlay that works with any Windows player and stays out of the game's way**:
  legible lyrics over gameplay, no focus stealing and no CPU spent between lines.
decisions:
  - >-
    **Read Windows' media controls (SMTC/GSMTC), not the player**: any player that registers a
    session — TIDAL, Spotify, VLC, foobar2000, the browser — works with nothing installed, and
    one that publishes nothing is named in the tray instead of leaving a silent overlay.
  - >-
    **Pick the record, not LRCLIB's first hit**: release suffixes are stripped before querying,
    duration dominates the ranking and an untimed pick is replaced by the first synced record of
    the same length; a second, album-scoped search covers what the twenty-result cap hides.
  - >-
    **Do not trust the reported position**: the clock ages the published position with a
    monotonic stopwatch, so TIDAL — which freezes its timeline — and starting a song in the
    middle still land on the right line.
  - >-
    **Draw without a UI framework**: a `WS_EX_NOREDIRECTIONBITMAP` window composited with
    DirectComposition and painted with Direct2D/DirectWrite, with cached text layouts and zero
    allocations per frame; there is no WPF, WinUI or WinForms behind it.
  - >-
    **Fix the line, not just watch it**: the sheet is an editor (stamp start and end, nudge
    ±10–250 ms, undo/redo), the correction is saved per track and per output device, a local
    `.lrc` can be imported and a corrected sheet published to LRCLIB behind a confirmation that
    shows the exact payload.
  - >-
    **Measured before claimed**: 65 MB of flat working set, 0.15 % of one core and 11 MB in a
    single NativeAOT .NET 10 executable — and one limit said out loud: exclusive fullscreen
    cannot be covered, so the app says so once and points at Borderless.
gallery:
  - view: web
    label: Web
    images:
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
