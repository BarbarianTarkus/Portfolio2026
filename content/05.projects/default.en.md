---
meta:
  title: Projects
  description: >-
    Projects by Ricardo Verduguez: client work, academic projects and tools of
    my own, with the problem, the decisions and screenshots for each one.
title: Projects
lede: >-
    Personal and academic projects.
homelab:
  eyebrow: Homelab
  title: More than two years of infrastructure of my own
  note: >-
    A **Synology NAS** and several machines serve media, storage, VPN and my own dev tools. trying to avoid relying in cloud services.
  facts:
    - value: '2+'
      label: years running
    - value: '24/7'
      label: availability
kindLabels:
  cliente: Client
  académico: Academic
  propio: Personal
  tfg: Bachelor's thesis
ficheLabels:
  problem: The problem
  decisions: Technical decisions
projects:
  - slug: phenomorph
    name: Phenomorph
    kind: propio
    year: '2026'
    summary: >-
      **Unofficial Phenomena Experience program**: showtimes, available seats, cycles and purchase
      links in a single SSR app built with Deno and Fresh. The repository is still private; the app
      is live.
    tags:
      - Deno
      - Fresh 2
      - Preact
      - SQLite
      - Tailwind
      - Python
      - DeepSeek Harness
    period: 27 October — 1 November 2026
    work: 45 commits
    links:
      - label: Phenomorph repository
        href: 'https://github.com/BarbarianTarkus/phenomorph'
        kind: repo
      - label: Preview
        href: 'https://phenomorph.verduguez.com'
        kind: demo
        icon: /projects/phenomorph/favicon.png
    problem: >-
      The cinema showtimes live scattered across the website, ticket sales and the calendar:
      knowing what you can see today, how many seats are left and when a screening fits means
      jumping between tabs. I wanted to **solve it on a single screen**, without relying on an API
      the cinema does not offer.
    decisions:
      - >-
        **Fresh 2 with SSR** and small islands (about 25 KB of JS/CSS) instead of a SPA: the first
        screen already ships the showtimes and only the search and the filters hydrate.
      - >-
        **A Python scraper** using only the standard library generates the JSON and a SQLite
        database that the app reads with node:sqlite; the dataset is rebuilt on every machine and
        never versioned, so it does not go stale in the repository.
      - >-
        **Seat and format data** is normalized in the scraper (35 mm, 70 mm, 4K, Dolby Atmos...),
        so the filters and the detail pages do not work from a free-text note.
      - >-
        **A design of my own for the venue**: warm palette, self-hosted typefaces and a 35 mm film
        strip for the cycles, instead of a generic showtimes template.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/phenomorph/home-desktop.webp
            alt: 'Desktop home page with the showtimes, the next screening and the box office.'
            caption: Desktop home page
          - src: /projects/phenomorph/film-desktop.webp
            alt: 'Film detail page with synopsis, cast and screenings.'
            caption: Film detail page
          - src: /projects/phenomorph/filmstrip-desktop.webp
            alt: Cycles rendered as a 35 mm film strip.
            caption: 35 mm film strip
          - src: /projects/phenomorph/film-sessions.webp
            alt: Screenings with seat meters and calendar links.
            caption: Screenings and calendar
          - src: /projects/phenomorph/date-filter-desktop.webp
            alt: Monthly calendar with several days selected.
            caption: Date filter
          - src: /projects/phenomorph/taquilla.webp
            alt: Box office ranking with occupancy meters.
            caption: Box office
          - src: /projects/phenomorph/ciclos-desktop.webp
            alt: Cycles page with posters and banners.
            caption: Cycles
          - src: /projects/phenomorph/trailer-modal.webp
            alt: Trailer player open in a modal.
            caption: Trailer in a modal
          - src: /projects/phenomorph/letterboxd-desktop.webp
            alt: Program search with the Letterboxd button.
            caption: Letterboxd search
      - view: mobile
        label: Mobile
        images:
          - src: /projects/phenomorph/home-mobile.webp
            alt: Compact mobile home page with the showtimes.
            caption: Mobile home page
          - src: /projects/phenomorph/mobile-cartelera.webp
            alt: Showtimes on mobile with posters and times.
            caption: Showtimes on mobile
          - src: /projects/phenomorph/mobile-ciclos.webp
            alt: Cycles on mobile.
            caption: Cycles on mobile
          - src: /projects/phenomorph/mobile-filters.webp
            alt: Cycle and availability filters on mobile.
            caption: Filters on mobile
          - src: /projects/phenomorph/mobile-modal.webp
            alt: Trailer on mobile with controls and close button.
            caption: Trailer on mobile
          - src: /projects/phenomorph/taquilla-mobile.webp
            alt: Box office ranking on mobile.
            caption: Box office on mobile
  - slug: overlyric
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
  - slug: mixology
    name: Mixology-Luismi
    kind: cliente
    year: '2026'
    summary: >-
      **Landing page for a cocktail service**: a static site built with Astro and a headless CMS so
      the client can edit without touching code.
    tags:
      - Astro
      - TinaCMS
      - Cloudflare
      - GitHub Actions
      - OpenCode
    period: January — October 2026
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
      A friend was starting a cocktail service and needed **a web presence on an almost zero
      budget**: a cheap domain, free hosting and the ability to change texts and photos without
      calling me.
    decisions:
      - >-
        **Astro in static mode** served from Cloudflare: zero hosting cost and no server to
        maintain, which was the condition of the job.
      - >-
        I compared Strapi, Decap and TinaCMS; **I went with TinaCMS** because it offers real visual
        editing and does not force self-hosting anything, which the client could not maintain.
      - >-
        **I generated the first visual version with AI help** to iterate quickly and then set
        typography, colors and spacing by hand: leaving the system to the generator produced
        inconsistencies.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/mixology/preview.webp
            alt: Mixology-Luismi site home page with the visual identity of the service.
            caption: Published home page
          - src: /projects/mixology/tina-editor.webp
            alt: TinaCMS open in the visual editing mode of the site.
            caption: 'TinaCMS in action: visual editing'
          - src: /projects/mixology/tina-content.webp
            alt: TinaCMS panel editing the content of a section.
            caption: 'TinaCMS in action: content'
          - src: /projects/mixology/tina-preview.webp
            alt: Preview of the site inside TinaCMS.
            caption: 'TinaCMS in action: preview'
      - view: mobile
        label: Mobile
        images:
          - src: /projects/mixology/mobile-portada.webp
            alt: 'Mobile home page with the home cocktail service tagline and the WhatsApp button.'
            caption: Mobile home page
          - src: /projects/mixology/mobile-servicios.webp
            alt: 'Services on mobile: bar rental, weddings and menu consulting.'
            caption: Services on mobile
          - src: /projects/mixology/mobile-cocteles.webp
            alt: Top 3 cocktails on mobile with Bloody Mary and Citrus Fizz.
            caption: Cocktails on mobile
          - src: /projects/mixology/mobile-contacto.webp
            alt: 'Contact page on mobile with phone, WhatsApp and opening hours.'
            caption: Contact on mobile
  - slug: brazo-robotico
    name: Robotic arm teleoperation
    kind: tfg
    year: '2026'
    featured: true
    summary: >-
      **Bachelor's thesis**: a low-cost arm teleoperated with the hands from Meta Quest 3,
      with Unity and OpenXR, an ESP32 → Arduino → ten servos chain and the arm 3D-printed and
      assembled from scratch.
    tags:
      - Unity
      - C#
      - OpenXR
      - Meta Quest
      - Arduino
      - ESP32
      - WiFi
      - Impresión 3D
    period: '2026'
    work: 74 h of printing · €173 in materials
    links: []
    video:
      label: 'Video: hand tracking moves the arm from Meta Quest 3'
      embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
    problem: >-
      The thesis called for a complete system, not a demo: **teleoperating a low-cost arm with
      your hands**, one that responds to the operator pinch, with no controllers or floating menus,
      and that does not break when someone moves the arm quickly.
    decisions:
      - >-
        **Unity + OpenXR on Meta Quest 3** (Quest 2 compatible), with native hand tracking and the
        interface anchored to the wrists: you operate it without controllers.
      - >-
        **ESP32 → Arduino Mega 2560 → 10 servos chain**, with a custom frame protocol, a pose
        queue and speed limiting: the printed mechanics hold up to the operator's yanks.
      - >-
        **The ESP32 also serves a manual control web page** over WiFi, to calibrate and move the
        arm from a browser without the headset.
      - >-
        **Arm built from scratch**: 74 h of 3D printing (~1.5 kg of PLA), custom electronics and a
        dedicated 5 V/18 A power supply, with ~€173 of material.
      - >-
        **Bench validation and documentation**: functional tests, a 79-page technical report, the
        protocol and the defense script.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/brazo-robotico/flujo-control.webp
            alt: >-
              Control flow diagram: the operator's hand is captured on Meta Quest 3, which sends the
              positions over UDP to the ESP32; the ESP32 turns them into angles and passes them over
              serial to the Arduino Mega 2560, which moves the arm servos.
            caption: 'Control flow: hand → Quest 3 → ESP32 → Arduino → arm'
          - src: /projects/brazo-robotico/herramientas.webp
            alt: >-
              Tools: the ESP32 and the Arduino Mega with the Arduino IDE on one side and the
              Meta Quest 3 headset with Unity on the other, converging on the 3D-printed arm.
            caption: 'Tools: ESP32 + Arduino IDE and Quest 3 + Unity'
  - slug: moodle
    name: local_plugincompatibility
    kind: propio
    year: '2026'
    summary: >-
      **Moodle local plugin** that cross-checks the installed plugins against the official
      directory and answers, for the version you want to upgrade to, which ones are still
      compatible, which are not and which are not even published on moodle.org.
    tags:
      - PHP
      - Moodle
    period: February — March 2026
    work: 19 commits on develop
    links:
      - label: moodle-local_plugincompatibility (develop)
        href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
        kind: repo
    problem: >-
      Moodle does not warn whether third-party plugins will keep working when you upgrade: the
      answer is scattered across the plugin pages on moodle.org, so preparing an upgrade means
      checking plugin by plugin which ones have a release for the target version. I wanted that
      answer **in a single table, inside the site itself** and for any future version.
    decisions:
      - >-
        **I started from Raúl Martínez's 2020 plugin**, which made an HTML request to moodle.org
        and a regex per installed plugin, and rewrote it on the official pluglist API
        (`download.moodle.org/api/1.3/pluglist.php`): compatibility is derived from
        `supportedmoodles` and the response is cached for an hour, storing the raw JSON
        (~15 MB) so the whole tree is not serialized.
      - >-
        **I rewrote the report as its own class** extending `flexible_table`, with
        dependencies, installed version, compatibility and latest release, column sorting, text
        and status filters, and CSV/Excel export through `core\dataformat`.
      - >-
        **I integrated it into the Moodle 4.1+ administration** (registration in
        `settings.php`, `moodle/site:config` capability), with English and Spanish
        strings and a privacy provider: the plugin stores no personal data, it only consumes
        public data from moodle.org.
      - >-
        **I normalized versions to `major.minor`** (5.1, not 5.1.0) and fixed the
        installation crash caused by `normalize_version()` not being loaded, which broke the
        install.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/moodle/plugin-compat.webp
            alt: Plugin compatibility report with Moodle 5.1 selected.
            caption: local_plugincompatibility report for Moodle 5.1
  - slug: rebost-api
    name: rebost-api
    kind: propio
    year: '2025'
    summary: >-
      **API for a grocery shopping app**, built with Deno KV and Oak as an excuse to try
      serverless storage without administering a database.
    tags:
      - Deno
      - TypeScript
      - Deno KV
      - Oak
    period: April 2025
    work: 8 commits
    links:
      - label: BarbarianTarkus/rebost-api
        href: 'https://github.com/BarbarianTarkus/rebost-api'
        kind: repo
    problem: >-
      I wanted an API for a grocery app **without standing up a database server**, and to check
      whether Deno KV was good for anything beyond a documentation example.
    decisions:
      - >-
        **Oak as the router**: it is the framework the Deno ecosystem already used and it does not
        force Express or a heavy framework into the stack.
      - >-
        **Deno KV instead of PostgreSQL**: zero provisioning and zero backups to maintain, in
        exchange for tying the project to the runtime APIs.
      - >-
        **Deployment with `deployctl`** to Deno Deploy and a debug task for VS Code, to work
        locally with the same code that runs in production.
  - slug: red-segmentada
    name: Segmented network on Linux
    kind: académico
    year: '2025'
    summary: >-
      **Distributed network lab** across four zones — backbone, DMZ, clients and servers — with two
      Linux routers as the boundary: persistent routing, nftables security, real DNS and DHCP, and
      end-to-end monitoring.
    tags:
      - Linux
      - nftables
      - BIND9
      - DHCP
      - Nagios
      - SSH
    period: academic year 2024–25
    work: 6 lab assignments in one system
    links: []
    diagram:
      label: View the full diagram
      href: /projects/red-segmentada/topologia.html
    problem: >-
      The course delivered six separate assignments; the scenario I built had to be **one network
      system and not six mock-ups**: routes that survive a reboot, each zone reachable only from
      where its policy allows, and a monitoring node that sees the three internal networks at once.
    decisions:
      - >-
        **Four zones and two routers** instead of a flat network: backbone/Internet, DMZ, clients
        and servers, with a Linux router at each boundary acting as a filter.
      - >-
        **Persistent static routing** in the system configuration, not with `ip route` by
        hand: the routes survive a reboot and the scenario is rebuilt from scratch.
      - >-
        **nftables for the whole perimeter**: filtering between zones, NAT and activity logging in
        one ruleset per router, without mixing iptables with loose rules.
      - >-
        **Real DNS and DHCP**: master/slave BIND9 with forward and reverse zones and recursion
        control; DHCP with address reservations and DDNS integrated through TSIG keys.
      - >-
        **Nagios Core + NRPE with custom plugins** (`check_eth`, `check_mem`), verified
        from the console before being published on the dashboard, and SSH tunnels to reach the
        three internal networks without opening ports.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/red-segmentada/topologia-cover.webp
            alt: >-
              Network map: Internet enters through the Access Router, crosses the DMZ with dns1,
              dns2 and monitor-dmz, and goes down through the Internal Router to the server and
              client networks.
            caption: 'Topology: perimeter, DMZ and internal networks'
          - src: /projects/red-segmentada/nagios.webp
            alt: >-
              Nagios Core dashboard with the service status of dns1, dns2, localhost, the web
              server, routeraccés, routerintern and the two mail servers.
            caption: 'Nagios Core: service status'
          - src: /projects/red-segmentada/segmentos.webp
            alt: >-
              Segment table with the range of each network, the routers that route it and the
              machines that live in it.
            caption: 'Segments and addressing'
  - slug: password-manager
    name: Password-Manager
    kind: académico
    year: 2022–25
    summary: >-
      **Password manager** for the database administration course: PostgreSQL tuned by hand,
      PostgREST as the API and Svelte on the front end.
    tags:
      - PostgreSQL
      - PostgREST
      - Svelte
      - Docker
    period: 2022 — 2025
    work: 23 commits
    links:
      - label: BarbarianTarkus/Password-Manager
        href: 'https://github.com/BarbarianTarkus/Password-Manager'
        kind: repo
    problem: >-
      The course asked for **real database administration**: justifying the configuration, the
      permissions and the queries on data that grows, not a toy CRUD.
    decisions:
      - >-
        **I used PostgREST instead of writing my own backend**: the API comes from the schema and
        the database policies, so permissions are defined in one place.
      - >-
        **I tuned `postgresql.conf` by hand** — shared memory, effective cache, connection
        count — instead of keeping the defaults, which are meant for a laptop and not for a server.
      - >-
        **Docker** so that PostgreSQL, PostgREST and pgAdmin come up the same on any machine,
        including the grader's machine.
  - slug: petsalut
    name: PetSalut
    kind: académico
    year: '2024'
    summary: >-
      **Management web application** for veterinary clinics, developed as a team for the UPC
      project.
    tags:
      - C++
      - PostgreSQL
      - GitHub Actions
      - Azure Functions
    period: March — June 2024
    work: 12 merged PRs
    links:
      - label: AMEP-UPC/PetSalut
        href: 'https://github.com/AMEP-UPC/PetSalut'
        kind: repo
    problem: >-
      The team had to deliver a system with three actors (clinics, owners and pets) and do it with
      **a real workflow** — branches, pull requests and CI —, not with a ZIP at the end of the
      semester.
    decisions:
      - >-
        **Every feature came in through a pull request** reviewed by someone else on the team:
        12 merged PRs, with no direct commits to the main branch.
      - >-
        **Continuous integration ran on GitHub Actions** and deployed to Azure Functions, so that
        delivery did not depend on someone compiling on their laptop.
      - >-
        **We fixed the database schema first**, then the user stories; every schema change forced
        us to rewrite the stories before continuing with the interface.
detailsLabel: View the full project
galleryTitle: Screenshots
backLabel: Projects
galleryViewLabel: View screenshots
visitLabel: Take a look
---
