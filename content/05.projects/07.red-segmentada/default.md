---
slug: red-segmentada
name: Red segmentada en Linux
kind: académico
year: '2025'
summary: >-
  **Laboratorio de red** en cuatro zonas con routers Linux: enrutamiento, filtrado, DNS, DHCP y
  monitorización funcionando como un solo sistema.
tags:
  - Linux
  - nftables
  - BIND9
  - DHCP
  - Nagios
  - SSH
period: curso 2024–25
links: []
diagram:
  label: Ver el diagrama completo
  href: /projects/red-segmentada/topologia.html
problem: >-
  La asignatura entregaba seis prácticas sueltas, pero yo quería construir **un único sistema de
  red**: rutas que sobreviven al reinicio, cada zona accesible solo cuando su política lo permite
  y un nodo de monitorización que ve todas las redes internas.
decisions:
  - >-
    **Cuatro zonas y dos routers**: separé troncal, DMZ, clientes y servidores, con un router Linux
    en cada frontera.
  - >-
    **Configuración persistente**: las rutas y las reglas se guardan en el sistema, así que
    sobreviven al reinicio y el escenario se puede reconstruir.
  - >-
    **Filtrado entre zonas**: el tráfico entre redes se controla con reglas claras, sin mezclar
    configuraciones antiguas.
  - >-
    **Servicios de red reales**: DNS con servidor principal y de reserva, DHCP con reservas y
    monitorización para comprobar el estado desde un solo punto.
  - >-
    **Acceso sin abrir puertos**: un acceso remoto cifrado permite llegar a las redes internas de
    forma controlada.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/red-segmentada/topologia-cover.webp
        alt: >-
          Mapa de la red: Internet entra por el router de acceso, cruza la DMZ con dns1, dns2 y
          monitor-dmz, y baja por el router interno hacia las redes de servidores y de clientes.
        caption: 'Topología: perímetro, DMZ y redes internas'
      - src: /projects/red-segmentada/nagios.webp
        alt: >-
          Panel de Nagios Core con el estado de los servicios de dns1, dns2, localhost, el servidor
          web, el router de acceso, el router interno y los dos servidores de correo.
        caption: 'Nagios Core: estado de los servicios'
      - src: /projects/red-segmentada/segmentos.webp
        alt: >-
          Tabla de segmentos con el rango de cada red, los routers que la encaminan y los equipos
          que viven en ella.
        caption: 'Segmentos y direccionamiento'
---
