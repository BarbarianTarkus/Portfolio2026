---
slug: red-segmentada
name: Red segmentada en Linux
kind: académico
year: '2025'
summary: >-
  **Laboratorio de red distribuida** en cuatro zonas —troncal, DMZ, clientes y servidores— con dos
  routers Linux como frontera: encaminamiento persistente, seguridad con nftables, DNS y DHCP reales
  y monitorización de extremo a extremo.
tags:
  - Linux
  - nftables
  - BIND9
  - DHCP
  - Nagios
  - SSH
period: curso 2024–25
work: 6 prácticas en un sistema
links: []
diagram:
  label: Ver el diagrama completo
  href: /projects/red-segmentada/topologia.html
problem: >-
  La asignatura entregaba seis prácticas sueltas; el escenario que monté debía ser **un sistema de
  red y no seis maquetas**: rutas que sobreviven al reinicio, cada zona accesible solo desde donde su
  política lo permite, y un nodo de monitorización que ve las tres redes internas a la vez.
decisions:
  - >-
    **Cuatro zonas y dos routers** en lugar de una red plana: troncal/Internet, DMZ, clientes y
    servidores, con un router Linux en cada frontera haciendo de filtro.
  - >-
    **Encaminamiento estático persistente** en la configuración del sistema, no con `ip route` a
    mano: las rutas sobreviven al reinicio y el escenario se reconstruye desde cero.
  - >-
    **nftables para todo el perímetro**: filtrado entre zonas, NAT y registro de actividad en un
    ruleset por router, sin mezclar iptables con reglas sueltas.
  - >-
    **DNS y DHCP reales**: BIND9 maestro/esclavo con zonas directas e inversas y control de
    recursividad; DHCP con reservas de dirección y DDNS integrado por claves TSIG.
  - >-
    **Nagios Core + NRPE con plugins propios** (`check_eth`, `check_mem`), verificados desde
    consola antes de publicarse en el panel, y túneles SSH para llegar a las tres redes internas sin
    abrir puertos.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/red-segmentada/topologia-cover.webp
        alt: >-
          Mapa de la red: Internet entra por el Router Accés, cruza la DMZ con dns1, dns2 y
          monitor-dmz, y baja por el Router Intern hacia las redes de servidores y de clientes.
        caption: 'Topología: perímetro, DMZ y redes internas'
      - src: /projects/red-segmentada/nagios.webp
        alt: >-
          Panel de Nagios Core con el estado de los servicios de dns1, dns2, localhost, el web
          server, routeraccés, routerintern y los dos servidores de correo.
        caption: 'Nagios Core: estado de los servicios'
      - src: /projects/red-segmentada/segmentos.webp
        alt: >-
          Tabla de segmentos con el rango de cada red, los routers que la encaminan y los equipos
          que viven en ella.
        caption: 'Segmentos y direccionamiento'
---
