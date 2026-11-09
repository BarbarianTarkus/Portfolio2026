---
meta:
  title: Proyectos
  description: >-
    Proyectos de Ricardo Verduguez: trabajo para cliente, proyectos académicos y herramientas
    propias, con el problema, las decisiones y capturas de cada uno.
title: Proyectos
lede: >-
  Proyectos seleccionados, no historial laboral. Los dos más recientes encabezan la página; cada
  tarjeta resume el proyecto y despliega el problema, las decisiones y las capturas cuando quieras
  ver más.
kindLabels:
  cliente: Cliente
  académico: Académico
  propio: Propio
ficheLabels:
  problem: El problema
  decisions: Decisiones técnicas
projects:
  - slug: phenomorph
    name: Phenomorph
    kind: propio
    year: '2026'
    summary: >-
      Programa no oficial de Phenomena Experience: cartelera, butacas libres, ciclos y enlaces de
      compra en una sola app SSR con Deno y Fresh. El repositorio sigue privado; la app está
      publicada.
    tags:
      - Deno
      - Fresh 2
      - Preact
      - SQLite
      - Tailwind
      - Python
    period: 27 octubre — 1 noviembre 2026
    work: 45 commits
    links:
      - label: Repositorio de Phenomorph
        href: 'https://github.com/BarbarianTarkus/phenomorph'
      - label: Preview
        href: 'https://phenomorph.verduguez.com'
    problem: >-
      La cartelera del cine vive repartida entre la web, la compra de entradas y el calendario:
      saber qué se puede ver hoy, cuántas butacas quedan y cuándo encaja una sesión obliga a saltar
      entre pestañas. Quería resolverlo en una sola pantalla, sin depender de una API que el cine no
      ofrece.
    decisions:
      - >-
        Fresh 2 con SSR e islas pequeñas (unos 25 KB de JS/CSS) en vez de una SPA: la primera
        pantalla ya trae la cartelera y solo se hidrata la búsqueda y los filtros.
      - >-
        Un scraper en Python de la biblioteca estándar genera el JSON y una SQLite que la app lee
        con node:sqlite; el dataset se reconstruye en cada máquina y nunca se versiona, así que no
        envejece en el repositorio.
      - >-
        Los datos de butacas y formatos se normalizan en el scraper (35 mm, 70 mm, 4K, Dolby
        Atmos...), para que los filtros y las fichas no trabajen con una nota de texto libre.
      - >-
        Diseño propio de la sala: paleta cálida, tipografías autoalojadas y una tira de 35 mm para
        los ciclos, en lugar de una plantilla de cartelera genérica.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/phenomorph/home-desktop.webp
            alt: 'Portada de escritorio con la cartelera, la próxima sesión y la taquilla.'
            caption: Portada de escritorio
          - src: /projects/phenomorph/film-desktop.webp
            alt: 'Ficha de película con sinopsis, reparto y sesiones.'
            caption: Ficha de película
          - src: /projects/phenomorph/filmstrip-desktop.webp
            alt: Ciclos renderizados como una tira de 35 mm.
            caption: Tira de 35 mm
          - src: /projects/phenomorph/film-sessions.webp
            alt: Sesiones con medidores de butacas y enlaces al calendario.
            caption: Sesiones y calendario
          - src: /projects/phenomorph/date-filter-desktop.webp
            alt: Calendario mensual con varios días seleccionados.
            caption: Filtro por fechas
          - src: /projects/phenomorph/taquilla.webp
            alt: Ranking de taquilla con medidores de ocupación.
            caption: Taquilla
          - src: /projects/phenomorph/ciclos-desktop.webp
            alt: Página de ciclos con carteles y banners.
            caption: Ciclos
          - src: /projects/phenomorph/trailer-modal.webp
            alt: Reproductor de tráiler abierto en modal.
            caption: Tráiler en modal
          - src: /projects/phenomorph/letterboxd-desktop.webp
            alt: Buscador del programa con el botón de Letterboxd.
            caption: Búsqueda en Letterboxd
      - view: mobile
        label: Móvil
        images:
          - src: /projects/phenomorph/home-mobile.webp
            alt: Portada móvil compacta con la cartelera.
            caption: Portada en móvil
          - src: /projects/phenomorph/mobile-cartelera.webp
            alt: Cartelera en móvil con carteles y horarios.
            caption: Cartelera en móvil
          - src: /projects/phenomorph/mobile-ciclos.webp
            alt: Ciclos en móvil.
            caption: Ciclos en móvil
          - src: /projects/phenomorph/mobile-filters.webp
            alt: Filtros de ciclo y disponibilidad en móvil.
            caption: Filtros en móvil
          - src: /projects/phenomorph/mobile-modal.webp
            alt: Tráiler en móvil con controles y cierre.
            caption: Tráiler en móvil
          - src: /projects/phenomorph/taquilla-mobile.webp
            alt: Ranking de taquilla en móvil.
            caption: Taquilla en móvil
  - slug: mixology
    name: Mixology-Luismi
    kind: cliente
    year: '2026'
    summary: >-
      Landing page para un servicio de coctelería: sitio estático con Astro y un CMS headless para
      que el cliente edite sin tocar código.
    tags:
      - Astro
      - TinaCMS
      - Cloudflare
      - GitHub Actions
    period: enero — octubre 2026
    work: 69 commits
    links:
      - label: BarbarianTarkus/Mixology-Luismi
        href: 'https://github.com/BarbarianTarkus/Mixology-Luismi'
      - label: Demo
        href: 'https://mixology-luismi.ricardoverduguez.workers.dev/'
    problem: >-
      Un amigo empezaba con un servicio de coctelería y necesitaba presencia web con presupuesto
      casi nulo: dominio barato, hosting gratuito y capacidad de cambiar textos y fotos sin
      llamarme.
    decisions:
      - >-
        Astro en modo estático servido desde Cloudflare: coste de hosting cero y ningún servidor que
        mantener, que era la condición del encargo.
      - >-
        Comparé Strapi, Decap y TinaCMS; me quedé con TinaCMS porque ofrece edición visual real y no
        obliga a autohospedar nada, algo que el cliente no podría mantener.
      - >-
        Generé la primera versión visual con ayuda de IA para iterar rápido y después fijé
        tipografía, colores y espaciado a mano: dejar el sistema en manos del generador producía
        inconsistencias.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/mixology/preview.webp
            alt: Portada del sitio de Mixology-Luismi con la identidad visual del servicio.
            caption: Portada publicada
          - src: /projects/mixology/tina-editor.webp
            alt: TinaCMS abierto en el modo de edición visual del sitio.
            caption: 'TinaCMS en acción: edición visual'
          - src: /projects/mixology/tina-content.webp
            alt: Panel de TinaCMS editando el contenido de una sección.
            caption: 'TinaCMS en acción: contenido'
          - src: /projects/mixology/tina-preview.webp
            alt: Vista previa del sitio dentro de TinaCMS.
            caption: 'TinaCMS en acción: vista previa'
  - slug: moodle
    name: local_plugincompatibility
    kind: propio
    year: '2026'
    summary: >-
      Plugin local de Moodle que cruza los plugins instalados con el catálogo oficial y responde,
      para la versión a la que quieres actualizar, cuáles siguen siendo compatibles, cuáles no y
      cuáles ni siquiera están publicados en moodle.org.
    tags:
      - PHP
      - Moodle
    period: febrero — marzo 2026
    work: 19 commits en develop
    links:
      - label: moodle-local_plugincompatibility (develop)
        href: 'https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop'
    problem: >-
      Moodle no avisa de si los plugins de terceros seguirán funcionando al subir de versión: la
      respuesta está repartida por las fichas de moodle.org, así que preparar una actualización
      obliga a comprobar plugin por plugin cuáles tienen una release para la versión de destino.
      Quería esa respuesta en una sola tabla, dentro del propio sitio y para cualquier versión
      futura.
    decisions:
      - >-
        Partí del plugin de 2020 de Raúl Martínez, que lanzaba una petición HTML a moodle.org y una
        regex por cada plugin instalado, y lo reescribí sobre la API oficial del pluglist
        (`download.moodle.org/api/1.3/pluglist.php`): la compatibilidad se deriva de
        `supportedmoodles` y la respuesta se cachea una hora, guardando el JSON en bruto (~15 MB)
        para no serializar el árbol entero.
      - >-
        Reescribí el informe como una clase propia que extiende `flexible_table`, con dependencias,
        versión instalada, compatibilidad y última release, ordenación por columnas, filtros por
        texto y estado, y exportación a CSV/Excel con `core\dataformat`.
      - >-
        Lo integré en la administración de Moodle 4.1+ (registro en `settings.php`, capacidad
        `moodle/site:config`), con cadenas en inglés y español y provider de privacidad: el plugin
        no guarda datos personales, solo consume datos públicos de moodle.org.
      - >-
        Normalicé las versiones a `major.minor` (5.1, no 5.1.0) y corregí el crash de instalación
        por `normalize_version()` sin cargar, que rompía la instalación.
    gallery:
      - view: web
        label: Web
        images:
          - src: /projects/moodle/plugin-compat.webp
            alt: Informe de compatibilidad de plugins con la versión 5.1 de Moodle seleccionada.
            caption: Informe de local_plugincompatibility para Moodle 5.1
  - slug: rebost-api
    name: rebost-api
    kind: propio
    year: '2025'
    summary: >-
      API para una aplicación de la compra, construida con Deno KV y Oak como excusa para probar
      almacenamiento serverless sin administrar una base de datos.
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
    problem: >-
      Quería una API para una app de la compra sin montar un servidor de base de datos, y comprobar
      si Deno KV servía para algo más que un ejemplo de la documentación.
    decisions:
      - >-
        Oak como router: es el framework que ya usaba el ecosistema de Deno y no obliga a arrastrar
        Express ni un framework pesado.
      - >-
        Deno KV en lugar de PostgreSQL: cero provisión y cero copias de seguridad que mantener, a
        cambio de atar el proyecto a las APIs del runtime.
      - >-
        Despliegue con `deployctl` a Deno Deploy y una tarea de depuración para VS Code, para
        trabajar en local con el mismo código que corre en producción.
  - slug: password-manager
    name: Password-Manager
    kind: académico
    year: 2022–25
    summary: >-
      Gestor de contraseñas para la asignatura de administración de bases de datos: PostgreSQL
      ajustado a mano, PostgREST como API y Svelte en el front.
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
    problem: >-
      La asignatura pedía administrar una base de datos de verdad: justificar la configuración, los
      permisos y las consultas sobre datos que crecen, no un CRUD de juguete.
    decisions:
      - >-
        Usé PostgREST en vez de escribir un backend propio: la API sale del esquema y de las
        políticas de la base de datos, así que los permisos se definen en un solo sitio.
      - >-
        Ajusté `postgresql.conf` a mano —memoria compartida, caché efectiva, número de conexiones—
        en lugar de quedarme con los valores por defecto, pensados para un portátil y no para un
        servidor.
      - >-
        Docker para que PostgreSQL, PostgREST y pgAdmin se levanten igual en cualquier máquina,
        incluida la del corrector.
  - slug: petsalut
    name: PetSalut
    kind: académico
    year: '2024'
    summary: >-
      Aplicación web de gestión para clínicas veterinarias, desarrollada en equipo dentro del
      proyecto de la UPC.
    tags:
      - C++
      - PostgreSQL
      - GitHub Actions
      - Azure Functions
    period: marzo — junio 2024
    work: 12 PRs mergeados
    links:
      - label: AMEP-UPC/PetSalut
        href: 'https://github.com/AMEP-UPC/PetSalut'
    problem: >-
      El equipo tenía que entregar un sistema con tres actores (clínicas, propietarios y mascotas) y
      hacerlo con un flujo de trabajo real —ramas, pull requests y CI—, no con un ZIP al final del
      cuatrimestre.
    decisions:
      - >-
        Cada funcionalidad entraba por pull request revisado por otra persona del equipo: 12 PRs
        mergeados, sin commits directos a la rama principal.
      - >-
        La integración continua corría en GitHub Actions y desplegaba en Azure Functions, para que
        la entrega no dependiera de que alguien compilara en su portátil.
      - >-
        Fijamos primero el esquema de base de datos y las historias de usuario; cada cambio de
        esquema obligaba a reescribir las historias antes de seguir con la interfaz.
detailsLabel: Mostrar más detalles
detailsCloseLabel: Ocultar detalles
galleryViewLabel: Vista de las capturas
---
