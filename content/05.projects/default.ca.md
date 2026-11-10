---
meta:
  title: Projectes
  description: >-
    Projectes de Ricardo Verduguez: treball per a client, projectes acadèmics i eines
    pròpies, amb el problema, les decisions i captures de cadascun.
title: Projectes
lede: >-
  Projectes seleccionats, **no historial laboral**. Els dos més recents encapçalen la pàgina; cada
  targeta resumeix el projecte i obre la seva fitxa completa, amb el problema, les decisions i les
  captures.
homelab:
  eyebrow: Homelab
  title: Més de dos anys d'infraestructura pròpia
  note: >-
    Un **Synology NAS** i diverses màquines serveixen multimèdia, emmagatzematge, VPN i un Git propi.
    **Jellyfin** separa el còmput (una Orange Pi) de l'emmagatzematge (el NAS), connectats per NFS i
    SMB. Les migracions entre dispositius s'automatitzen amb **Ansible i Rsync**, i la publicació
    a l'exterior va per túnel de Cloudflare, sense obrir ports al router.
  facts:
    - value: '2+'
      label: anys en marxa
    - value: '24/7'
      label: disponibilitat
kindLabels:
  cliente: Client
  académico: Acadèmic
  propio: Propi
  tfg: Treball de Fi de Grau
ficheLabels:
  problem: El problema
  decisions: Decisions tècniques
projects:
  - slug: brazo-robotico
    name: Teleoperació d'un braç robòtic
    kind: tfg
    year: '2026'
    featured: true
    summary: >-
      **Treball de Fi de Grau**: braç de baix cost teleoperat amb les mans des de Meta Quest 3,
      amb Unity i OpenXR, una cadena ESP32 → Arduino → deu servos i el braç imprès en 3D i muntat
      des de zero.
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
    work: 74 h d'impressió · 173 € de material
    links: []
    video:
      label: 'Vídeo: la mà de l''operador mou el braç des de Meta Quest 3'
      embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
    problem: >-
      El TFG demanava un sistema complet, no una demo: **teleoperar amb les mans** un braç de baix
      cost que respon a la pinça de l'operador, sense comandaments ni menús flotants, i que no es
      trenqui quan algú mogui el braç de pressa.
    decisions:
      - >-
        **Unity + OpenXR a Meta Quest 3** (compatible amb Quest 2), amb hand tracking natiu i la
        interfície ancorada als canells: s'opera sense comandaments.
      - >-
        **Cadena ESP32 → Arduino Mega 2560 → 10 servos**, amb protocol de trames propi, cua de
        poses i limitació de velocitat: la mecànica impresa aguanta les estrebades de l'operador.
      - >-
        **L'ESP32 serveix a més una pàgina web de control manual** per WiFi, per calibrar i moure
        el braç des del navegador sense el visor.
      - >-
        **Braç construït des de zero**: 74 h d'impressió 3D (~1,5 kg de PLA), electrònica pròpia i
        font dedicada de 5 V/18 A, amb ~173 € de material.
      - >-
        **Validació en banc i documentació**: proves funcionals, memòria tècnica de 79 pàgines,
        protocol i guió de defensa.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/brazo-robotico/flujo-control.webp
            alt: >-
              Esquema del flux de control: la mà de l'operador es captura a Meta Quest 3, que envia
              les posicions per UDP a l'ESP32; aquest les tradueix a angles i les passa per sèrie a
              l'Arduino Mega 2560, que mou els servos del braç.
            caption: 'Flux de control: mà → Quest 3 → ESP32 → Arduino → braç'
          - src: /projects/brazo-robotico/herramientas.webp
            alt: >-
              Eines de treball: l'ESP32 i l'Arduino Mega amb l'IDE d'Arduino d'una banda i les
              ulleres Meta Quest 3 amb Unity de l'altra, convergint en el braç imprès en 3D.
            caption: 'Eines: ESP32 + IDE d''Arduino i Quest 3 + Unity'
  - slug: phenomorph
    name: Phenomorph
    kind: propio
    year: '2026'
    summary: >-
      **Programa no oficial de Phenomena Experience**: cartellera, butaques lliures, cicles i enllaços de
      compra en una sola app SSR amb Deno i Fresh. El repositori continua privat; l'app està
      publicada.
    tags:
      - Deno
      - Fresh 2
      - Preact
      - SQLite
      - Tailwind
      - Python
      - DeepSeek Harness
    period: 27 octubre — 1 novembre 2026
    work: 45 commits
    links:
      - label: Repositori de Phenomorph
        href: 'https://github.com/BarbarianTarkus/phenomorph'
        kind: repo
      - label: Vista prèvia
        href: 'https://phenomorph.verduguez.com'
        kind: demo
        icon: /projects/phenomorph/favicon.png
    problem: >-
      La cartellera del cinema viu repartida entre la web, la compra d'entrades i el calendari:
      saber què es pot veure avui, quantes butaques queden i quan encaixa una sessió obliga a saltar
      entre pestanyes. Volia **resoldre-ho en una sola pantalla**, sense dependre d'una API que el cinema
      no ofereix.
    decisions:
      - >-
        **Fresh 2 amb SSR** i illes petites (uns 25 KB de JS/CSS) en lloc d'una SPA: la primera
        pantalla ja porta la cartellera i només s'hidrata la cerca i els filtres.
      - >-
        **Un scraper en Python** de la biblioteca estàndard genera el JSON i una SQLite que l'app llegeix
        amb node:sqlite; el dataset es reconstrueix a cada màquina i mai es versiona, així que no
        envelleix al repositori.
      - >-
        **Les dades de butaques i formats** es normalitzen al scraper (35 mm, 70 mm, 4K, Dolby
        Atmos...), perquè els filtres i les fitxes no treballin amb una nota de text lliure.
      - >-
        **Disseny propi de la sala**: paleta càlida, tipografies autoallotjades i una tira de 35 mm per
        als cicles, en lloc d'una plantilla de cartellera genèrica.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/phenomorph/home-desktop.webp
            alt: 'Portada d''escriptori amb la cartellera, la propera sessió i la taquilla.'
            caption: Portada d'escriptori
          - src: /projects/phenomorph/film-desktop.webp
            alt: 'Fitxa de pel·lícula amb sinopsi, repartiment i sessions.'
            caption: Fitxa de pel·lícula
          - src: /projects/phenomorph/filmstrip-desktop.webp
            alt: Cicles renderitzats com una tira de 35 mm.
            caption: Tira de 35 mm
          - src: /projects/phenomorph/film-sessions.webp
            alt: Sessions amb indicadors de butaques i enllaços al calendari.
            caption: Sessions i calendari
          - src: /projects/phenomorph/date-filter-desktop.webp
            alt: Calendari mensual amb diversos dies seleccionats.
            caption: Filtre per dates
          - src: /projects/phenomorph/taquilla.webp
            alt: Rànquing de taquilla amb indicadors d'ocupació.
            caption: Taquilla
          - src: /projects/phenomorph/ciclos-desktop.webp
            alt: Pàgina de cicles amb cartells i bàners.
            caption: Cicles
          - src: /projects/phenomorph/trailer-modal.webp
            alt: Reproductor de tràiler obert en modal.
            caption: Tràiler en modal
          - src: /projects/phenomorph/letterboxd-desktop.webp
            alt: Cercador del programa amb el botó de Letterboxd.
            caption: Cerca a Letterboxd
      - view: mobile
        label: Mòbil
        images:
          - src: /projects/phenomorph/home-mobile.webp
            alt: Portada mòbil compacta amb la cartellera.
            caption: Portada en mòbil
          - src: /projects/phenomorph/mobile-cartelera.webp
            alt: Cartellera en mòbil amb cartells i horaris.
            caption: Cartellera en mòbil
          - src: /projects/phenomorph/mobile-ciclos.webp
            alt: Cicles en mòbil.
            caption: Cicles en mòbil
          - src: /projects/phenomorph/mobile-filters.webp
            alt: Filtres de cicle i disponibilitat en mòbil.
            caption: Filtres en mòbil
          - src: /projects/phenomorph/mobile-modal.webp
            alt: Tràiler en mòbil amb controls i tancament.
            caption: Tràiler en mòbil
          - src: /projects/phenomorph/taquilla-mobile.webp
            alt: Rànquing de taquilla en mòbil.
            caption: Taquilla en mòbil
  - slug: mixology
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
  - slug: moodle
    name: local_plugincompatibility
    kind: propio
    year: '2026'
    summary: >-
      **Plugin local de Moodle** que creua els plugins instal·lats amb el catàleg oficial i respon,
      per a la versió a la qual vols actualitzar, quins continuen sent compatibles, quins no i
      quins ni tan sols estan publicats a moodle.org.
    tags:
      - PHP
      - Moodle
    period: febrer — març 2026
    work: 19 commits a develop
    links:
      - label: moodle-local_plugincompatibility (develop)
        href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
        kind: repo
    problem: >-
      Moodle no avisa si els plugins de tercers continuaran funcionant en pujar de versió: la
      resposta està repartida per les fitxes de moodle.org, així que preparar una actualització
      obliga a comprovar plugin per plugin quins tenen una release per a la versió de destinació.
      Volia aquesta resposta **en una sola taula, dins del mateix lloc** i per a qualsevol versió
      futura.
    decisions:
      - >-
        **Vaig partir del plugin de 2020 de Raúl Martínez**, que llançava una petició HTML a moodle.org i una
        regex per cada plugin instal·lat, i el vaig reescriure sobre l'API oficial del pluglist
        (`download.moodle.org/api/1.3/pluglist.php`): la compatibilitat es deriva de
        `supportedmoodles` i la resposta es cacheja una hora, guardant el JSON en brut (~15 MB)
        per no serialitzar l'arbre sencer.
      - >-
        **Vaig reescriure l'informe com una classe pròpia** que estén `flexible_table`, amb dependències,
        versió instal·lada, compatibilitat i última release, ordenació per columnes, filtres per
        text i estat, i exportació a CSV/Excel amb `core\dataformat`.
      - >-
        **El vaig integrar a l'administració de Moodle 4.1+** (registre a `settings.php`, capacitat
        `moodle/site:config`), amb cadenes en anglès i espanyol i provider de privacitat: el plugin
        no guarda dades personals, només consumeix dades públiques de moodle.org.
      - >-
        **Vaig normalitzar les versions a `major.minor`** (5.1, no 5.1.0) i vaig corregir el crash
        d'instal·lació per `normalize_version()` sense carregar, que trencava la instal·lació.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/moodle/plugin-compat.webp
            alt: Informe de compatibilitat de plugins amb la versió 5.1 de Moodle seleccionada.
            caption: Informe de local_plugincompatibility per a Moodle 5.1
  - slug: rebost-api
    name: rebost-api
    kind: propio
    year: '2025'
    summary: >-
      **API per a una aplicació de la compra**, construïda amb Deno KV i Oak com a excusa per provar
      emmagatzematge serverless sense administrar una base de dades.
    tags:
      - Deno
      - TypeScript
      - Deno KV
      - Oak
    period: abril 2025
    work: 8 commits
    links:
      - label: BarbarianTarkus/rebost-api
        href: 'https://github.com/BarbarianTarkus/rebost-api'
        kind: repo
    problem: >-
      Volia una API per a una app de la compra **sense muntar un servidor de base de dades**, i comprovar
      si Deno KV servia per a alguna cosa més que un exemple de la documentació.
    decisions:
      - >-
        **Oak com a router**: és el framework que ja utilitzava l'ecosistema de Deno i no obliga a
        arrossegar Express ni un framework pesat.
      - >-
        **Deno KV en lloc de PostgreSQL**: zero aprovisionament i zero còpies de seguretat a
        mantenir, a canvi de lligar el projecte a les APIs del runtime.
      - >-
        **Desplegament amb `deployctl`** a Deno Deploy i una tasca de depuració per a VS Code, per
        treballar en local amb el mateix codi que corre en producció.
  - slug: red-segmentada
    name: Xarxa segmentada a Linux
    kind: académico
    year: '2025'
    summary: >-
      **Laboratori de xarxa distribuïda** en quatre zones —troncal, DMZ, clients i servidors— amb dos
      routers Linux com a frontera: encaminament persistent, seguretat amb nftables, DNS i DHCP reals
      i monitoratge d'extrem a extrem.
    tags:
      - Linux
      - nftables
      - BIND9
      - DHCP
      - Nagios
      - SSH
    period: curs 2024–25
    work: 6 pràctiques en un sistema
    links: []
    diagram:
      label: Veure el diagrama complet
      href: /projects/red-segmentada/topologia.html
    problem: >-
      L'assignatura entregava sis pràctiques soltes; l'escenari que vaig muntar havia de ser **un sistema de
      xarxa i no sis maquetes**: rutes que sobreviuen al reinici, cada zona només accessible des d'on la seva
      política ho permet, i un node de monitoratge que veu les tres xarxes internes alhora.
    decisions:
      - >-
        **Quatre zones i dos routers** en lloc d'una xarxa plana: troncal/Internet, DMZ, clients i
        servidors, amb un router Linux a cada frontera fent de filtre.
      - >-
        **Encaminament estàtic persistent** a la configuració del sistema, no amb `ip route` a
        mà: les rutes sobreviuen al reinici i l'escenari es reconstrueix des de zero.
      - >-
        **nftables per a tot el perímetre**: filtratge entre zones, NAT i registre d'activitat en un
        ruleset per router, sense barrejar iptables amb regles soltes.
      - >-
        **DNS i DHCP reals**: BIND9 mestre/esclau amb zones directes i inverses i control de
        recursivitat; DHCP amb reserves d'adreça i DDNS integrat per claus TSIG.
      - >-
        **Nagios Core + NRPE amb plugins propis** (`check_eth`, `check_mem`), verificats des de
        consola abans de publicar-se al tauler, i túnels SSH per arribar a les tres xarxes internes
        sense obrir ports.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/red-segmentada/topologia-cover.webp
            alt: >-
              Mapa de la xarxa: Internet entra pel Router Accés, travessa la DMZ amb dns1, dns2 i
              monitor-dmz, i baixa pel Router Intern cap a les xarxes de servidors i de clients.
            caption: 'Topologia: perímetre, DMZ i xarxes internes'
          - src: /projects/red-segmentada/nagios.webp
            alt: >-
              Tauler de Nagios Core amb l'estat dels serveis de dns1, dns2, localhost, el servidor
              web, routeraccés, routerintern i els dos servidors de correu.
            caption: 'Nagios Core: estat dels serveis'
          - src: /projects/red-segmentada/segmentos.webp
            alt: >-
              Taula de segments amb el rang de cada xarxa, els routers que l'encaminen i els equips
              que hi viuen.
            caption: 'Segments i adreçament'
  - slug: password-manager
    name: Password-Manager
    kind: académico
    year: 2022–25
    summary: >-
      **Gestor de contrasenyes** per a l'assignatura d'administració de bases de dades: PostgreSQL
      ajustat a mà, PostgREST com a API i Svelte al front.
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
      L'assignatura demanava **administrar una base de dades de debò**: justificar la configuració, els
      permisos i les consultes sobre dades que creixen, no un CRUD de joguina.
    decisions:
      - >-
        **Vaig fer servir PostgREST en lloc d'escriure un backend propi**: l'API surt de l'esquema i de les
        polítiques de la base de dades, així que els permisos es defineixen en un sol lloc.
      - >-
        **Vaig ajustar `postgresql.conf` a mà** —memòria compartida, memòria cau efectiva, nombre de
        connexions— en lloc de quedar-me amb els valors per defecte, pensats per a un portàtil i no per a un
        servidor.
      - >-
        **Docker** perquè PostgreSQL, PostgREST i pgAdmin s'aixequin igual a qualsevol màquina,
        inclosa la del corrector.
  - slug: petsalut
    name: PetSalut
    kind: académico
    year: '2024'
    summary: >-
      **Aplicació web de gestió** per a clíniques veterinàries, desenvolupada en equip dins del
      projecte de la UPC.
    tags:
      - C++
      - PostgreSQL
      - GitHub Actions
      - Azure Functions
    period: març — juny 2024
    work: 12 PRs fusionats
    links:
      - label: AMEP-UPC/PetSalut
        href: 'https://github.com/AMEP-UPC/PetSalut'
        kind: repo
    problem: >-
      L'equip havia d'entregar un sistema amb tres actors (clíniques, propietaris i mascotes) i
      fer-ho amb **un flux de treball real** —branques, pull requests i CI—, no amb un ZIP al final del
      quadrimestre.
    decisions:
      - >-
        **Cada funcionalitat entrava per pull request** revisada per una altra persona de l'equip: 12 PRs
        fusionats, sense commits directes a la branca principal.
      - >-
        **La integració contínua corria a GitHub Actions** i desplegava a Azure Functions, perquè
        l'entrega no depengués que algú compilés al seu portàtil.
      - >-
        **Vam fixar primer l'esquema de base de dades** i les històries d'usuari; cada canvi
        d'esquema obligava a reescriure les històries abans de continuar amb la interfície.
detailsLabel: Veure el projecte complet
galleryTitle: Captures
backLabel: Projectes
galleryViewLabel: Vista de les captures
visitLabel: Fes-hi un cop d'ull
---
