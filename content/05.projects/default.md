---
meta:
  title: Proyectos
  description: "Proyectos de Ricardo Verduguez: trabajo para cliente, proyectos académicos y herramientas propias, con el problema, las decisiones y lo que se rompió."
title: Proyectos
lede: "Proyectos seleccionados, no historial laboral. Aquí está lo que puedo enseñar —trabajo para cliente, proyectos de la carrera, herramientas propias y algún experimento privado—; el trabajo en producción está en [experiencia](/experience)."
kindLabels:
  cliente: Cliente
  académico: Académico
  propio: Propio
indexAriaLabel: Índice de proyectos
fichesEyebrow: Fichas
ficheLabels:
  problem: El problema
  decisions: Decisiones técnicas
  broke: Qué se rompió
  next: Qué haría distinto
projects:
  - slug: phenomorph
    name: Phenomorph
    kind: propio
    year: "2026"
    summary: "Programa no oficial de Phenomena Experience: cartelera, butacas libres, ciclos y enlaces de compra en una sola app SSR con Deno y Fresh. El repositorio sigue privado; la app está publicada."
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
      - label: Preview
        href: https://phenomorph.verduguez.com
    images:
      - src: /projects/phenomorph/home-desktop.webp
        alt: Portada de Phenomorph en escritorio con la cartelera y la próxima sesión.
        caption: Portada de escritorio
      - src: /projects/phenomorph/film-desktop.webp
        alt: Ficha de una película con sinopsis, reparto, sesiones y butacas disponibles.
        caption: Ficha de película
      - src: /projects/phenomorph/filmstrip-desktop.webp
        alt: Tira de película de 35 mm con los ciclos programados por el cine.
        caption: Tira de 35 mm con los ciclos
      - src: /projects/phenomorph/film-sessions.webp
        alt: Sesiones de una película con enlaces para añadirlas al calendario.
        caption: Sesiones y calendario
      - src: /projects/phenomorph/date-filter-desktop.webp
        alt: Calendario de filtros por fechas abierto sobre la cartelera.
        caption: Filtro por fechas
      - src: /projects/phenomorph/date-filter-mobile.webp
        alt: Filtro por fechas en móvil, como hoja inferior.
        caption: Filtro de fechas en móvil
      - src: /projects/phenomorph/taquilla.webp
        alt: Ranking de taquilla por butacas ocupadas.
        caption: Taquilla por ocupación
      - src: /projects/phenomorph/ciclos-desktop.webp
        alt: Página de ciclos con las imágenes de cada ciclo y sus películas.
        caption: Página de ciclos
      - src: /projects/phenomorph/mobile-ciclos.webp
        alt: Vista de ciclos en un teléfono.
        caption: Ciclos en móvil
      - src: /projects/phenomorph/trailer-modal.webp
        alt: Reproductor de tráiler abierto como modal sobre la ficha de la película.
        caption: Tráiler en modal
      - src: /projects/phenomorph/home-mobile.webp
        alt: Portada móvil compacta con la próxima sesión y la cartelera.
        caption: Portada en móvil
      - src: /projects/phenomorph/mobile-cartelera.webp
        alt: Cartelera en móvil con carteles, horarios y butacas.
        caption: Cartelera en móvil
      - src: /projects/phenomorph/mobile-filters.webp
        alt: Filtros de ciclo y disponibilidad en móvil.
        caption: Filtros en móvil
      - src: /projects/phenomorph/mobile-modal.webp
        alt: Tráiler abierto en móvil con controles y cierre.
        caption: Tráiler en móvil
      - src: /projects/phenomorph/taquilla-mobile.webp
        alt: Ranking de taquilla en la pestaña móvil.
        caption: Taquilla en móvil
      - src: /projects/phenomorph/letterboxd-desktop.webp
        alt: Búsqueda de una película con el botón de Letterboxd.
        caption: Búsqueda en Letterboxd
    problem: "La cartelera del cine vive repartida entre la web, la compra de entradas y el calendario: saber qué se puede ver hoy, cuántas butacas quedan y cuándo encaja una sesión obliga a saltar entre pestañas. Quería resolverlo en una sola pantalla, sin depender de una API que el cine no ofrece."
    decisions:
      - "Fresh 2 con SSR e islas pequeñas (unos 25 KB de JS/CSS) en vez de una SPA: la primera pantalla ya trae la cartelera y solo se hidrata la búsqueda y los filtros."
      - "Un scraper en Python de la biblioteca estándar genera el JSON y una SQLite que la app lee con node:sqlite; el dataset se reconstruye en cada máquina y nunca se versiona, así que no envejece en el repositorio."
      - "Los datos de butacas y formatos se normalizan en el scraper (35 mm, 70 mm, 4K, Dolby Atmos...), para que los filtros y las fichas no trabajen con una nota de texto libre."
      - "Diseño propio de la sala: paleta cálida, tipografías autoalojadas y una tira de 35 mm para los ciclos, en lugar de una plantilla de cartelera genérica."
    broke: "En móvil, la página de Taquilla aparecía vacía: la regla que ocultaba el ranking en la portada se aplicaba también a la página completa. Se limitó al teaser de la portada y se añadió un test que impide que vuelva a pasar."
    next: "Movería el scraper a una tarea programada con un contrato de datos versionado y fixtures de la web del cine, para detectar cambios de HTML antes de que rompan la cartelera."
  - slug: mixology
    name: Mixology-Luismi
    kind: cliente
    year: "2026"
    summary: "Landing page para un servicio de coctelería: sitio estático con Astro y un CMS headless para que el cliente edite sin tocar código."
    tags:
      - Astro
      - TinaCMS
      - Cloudflare
      - GitHub Actions
    period: enero — octubre 2026
    work: 69 commits
    links:
      - label: BarbarianTarkus/Mixology-Luismi
        href: https://github.com/BarbarianTarkus/Mixology-Luismi
      - label: Demo
        href: https://mixology-luismi.ricardoverduguez.workers.dev/
    images:
      - src: /projects/mixology/preview.webp
        alt: Portada del sitio de Mixology-Luismi con la identidad visual del servicio.
        caption: Portada publicada
      - src: /projects/mixology/tina-editor.webp
        alt: TinaCMS abierto en el modo de edición visual del sitio.
        caption: "TinaCMS en acción: edición visual"
      - src: /projects/mixology/tina-content.webp
        alt: Panel de TinaCMS editando el contenido de una sección.
        caption: "TinaCMS en acción: contenido"
      - src: /projects/mixology/tina-preview.webp
        alt: Vista previa del sitio dentro de TinaCMS.
        caption: "TinaCMS en acción: vista previa"
    problem: "Un amigo empezaba con un servicio de coctelería y necesitaba presencia web con presupuesto casi nulo: dominio barato, hosting gratuito y capacidad de cambiar textos y fotos sin llamarme."
    decisions:
      - "Astro en modo estático servido desde Cloudflare: coste de hosting cero y ningún servidor que mantener, que era la condición del encargo."
      - Comparé Strapi, Decap y TinaCMS; me quedé con TinaCMS porque ofrece edición visual real y no obliga a autohospedar nada, algo que el cliente no podría mantener.
      - "Generé la primera versión visual con ayuda de IA para iterar rápido y después fijé tipografía, colores y espaciado a mano: dejar el sistema en manos del generador producía inconsistencias."
    broke: "El diseño generado con IA no mantenía un sistema: cada pantalla traía otra escala y otra paleta, y encajarlas costaba más que partir de una guía propia. La lección fue que la IA acelera la primera versión, pero los tokens de diseño se escriben a mano."
    next: Empezaría por un sistema de diseño mínimo —dos tipografías, tres colores, una escala de espaciado— antes de generar pantallas; ahora lo caro es rehacer estilos, no lógica.
  - slug: moodle
    name: moodle_langer-script
    kind: propio
    year: "2023–26"
    summary: "Script propio para traducir ficheros de idioma de Moodle y colaboración en la rama `develop` de `local_plugincompatibility`, que comprueba qué plugins instalados siguen siendo compatibles con cada versión de Moodle."
    tags:
      - Python
      - PHP
      - Moodle
      - PyInstaller
    period: octubre 2023 — marzo 2026
    work: 7 commits + 19 en develop
    links:
      - label: moodle_langer-script
        href: https://github.com/BarbarianTarkus/moodle_langer-script
      - label: local_plugincompatibility (develop)
        href: https://github.com/BarbarianTarkus/moodle-local_plugincompatibility/tree/develop
    images:
      - src: /projects/moodle/plugin-compat.webp
        alt: Tabla de compatibilidad de plugins de Moodle con la versión objetivo seleccionada.
        caption: Tabla de compatibilidad de local_plugincompatibility
    problem: "Moodle no avisa de si los plugins de terceros seguirán funcionando al subir de versión, y traducir a mano los ficheros de idioma de un plugin es lento y repetitivo."
    decisions:
      - "El script lee el fichero `lang/en` original y genera `lang/es` conservando la estructura de carpetas de Moodle, con una caché en JSON para no pagar dos veces la misma traducción."
      - "En la rama `develop` de `local_plugincompatibility` trabajé sobre la tabla que cruza los plugins instalados con el pluglist oficial: cada uno queda como compatible, no compatible o no encontrado para la versión elegida."
      - "La compatibilidad se deriva de la API `download.moodle.org/api/1.3/pluglist.php` con caché de una hora, en vez de raspar HTML; la tabla usa `flexible_table` y se puede exportar a CSV."
    broke: "Al instalar la versión con la tabla nueva, Moodle reventaba con `Call to undefined function normalize_version()`: la función se usaba antes de definirla. Se corrigió y, al probar Moodle 5.1, la tabla no mostraba compatibilidad para 5.1 porque el formato de versión no coincidía; se normalizó antes de comparar."
    next: "Añadiría tests de integración contra el pluglist con fixtures de varias versiones de Moodle, para detectar antes los cambios de formato y de API."
  - slug: rebost-api
    name: rebost-api
    kind: propio
    year: "2025"
    summary: API para una aplicación de la compra, construida con Deno KV y Oak como excusa para probar almacenamiento serverless sin administrar una base de datos.
    tags:
      - Deno
      - TypeScript
      - Deno KV
      - Oak
    period: abril 2025
    work: 8 commits
    links:
      - label: BarbarianTarkus/rebost-api
        href: https://github.com/BarbarianTarkus/rebost-api
    problem: Quería una API para una app de la compra sin montar un servidor de base de datos, y comprobar si Deno KV servía para algo más que un ejemplo de la documentación.
    decisions:
      - "Oak como router: es el framework que ya usaba el ecosistema de Deno y no obliga a arrastrar Express ni un framework pesado."
      - "Deno KV en lugar de PostgreSQL: cero provisión y cero copias de seguridad que mantener, a cambio de atar el proyecto a las APIs del runtime."
      - Despliegue con `deployctl` a Deno Deploy y una tarea de depuración para VS Code, para trabajar en local con el mismo código que corre en producción.
    broke: El arranque en local se rompía cada vez que Deno renombraba sus flags inestables (`--unstable-kv` pasó a `--unstable`). Lo dejé documentado en el README para no volver a perder una tarde en el mismo error.
    next: "No usaría APIs inestables para nada que quiera seguir funcionando: parte del trabajo del repositorio se fue en adaptarse al runtime, no en funcionalidad."
  - slug: password-manager
    name: Password-Manager
    kind: académico
    year: "2022–25"
    summary: "Gestor de contraseñas para la asignatura de administración de bases de datos: PostgreSQL ajustado a mano, PostgREST como API y Svelte en el front."
    tags:
      - PostgreSQL
      - PostgREST
      - Svelte
      - Docker
    period: 2022 — 2025
    work: 23 commits
    links:
      - label: BarbarianTarkus/Password-Manager
        href: https://github.com/BarbarianTarkus/Password-Manager
    problem: "La asignatura pedía administrar una base de datos de verdad: justificar la configuración, los permisos y las consultas sobre datos que crecen, no un CRUD de juguete."
    decisions:
      - "Usé PostgREST en vez de escribir un backend propio: la API sale del esquema y de las políticas de la base de datos, así que los permisos se definen en un solo sitio."
      - Ajusté `postgresql.conf` a mano —memoria compartida, caché efectiva, número de conexiones— en lugar de quedarme con los valores por defecto, pensados para un portátil y no para un servidor.
      - Docker para que PostgreSQL, PostgREST y pgAdmin se levanten igual en cualquier máquina, incluida la del corrector.
    next: "Definiría las políticas de acceso a nivel de fila antes de la interfaz: es más limpio que ocultar en el cliente lo que la API no debería devolver nunca."
  - slug: petsalut
    name: PetSalut
    kind: académico
    year: "2024"
    summary: Aplicación web de gestión para clínicas veterinarias, desarrollada en equipo dentro del proyecto de la UPC.
    tags:
      - C++
      - PostgreSQL
      - GitHub Actions
      - Azure Functions
    period: marzo — junio 2024
    work: 12 PRs mergeados
    links:
      - label: AMEP-UPC/PetSalut
        href: https://github.com/AMEP-UPC/PetSalut
    problem: El equipo tenía que entregar un sistema con tres actores (clínicas, propietarios y mascotas) y hacerlo con un flujo de trabajo real —ramas, pull requests y CI—, no con un ZIP al final del cuatrimestre.
    decisions:
      - "Cada funcionalidad entraba por pull request revisado por otra persona del equipo: 12 PRs mergeados, sin commits directos a la rama principal."
      - La integración continua corría en GitHub Actions y desplegaba en Azure Functions, para que la entrega no dependiera de que alguien compilara en su portátil.
      - Fijamos primero el esquema de base de datos y las historias de usuario; cada cambio de esquema obligaba a reescribir las historias antes de seguir con la interfaz.
    broke: "Empezamos a programar sin una base de datos sólida y la clase de conexión dejó de responder a mitad del proyecto: sin conexión no había forma de probar el CRUD ni de cerrar tareas. Se arregló rediseñando el diagrama de clases de la base de datos y redefiniendo las historias, y de paso unificamos el login de clínicas y propietarios en una sola interfaz."
    next: "Separaría la capa de acceso a datos de la interfaz desde el primer día: en un equipo, una clase de conexión mal aislada bloquea a todo el mundo a la vez."
---