---
slug: red-segmentada
name: Xarxa segmentada a Linux
kind: académico
year: '2025'
summary: >-
  **Laboratori de xarxa** en quatre zones amb routers Linux: encaminament, filtratge, DNS, DHCP i
  monitoratge funcionant com un sol sistema.
tags:
  - Linux
  - nftables
  - BIND9
  - DHCP
  - Nagios
  - SSH
period: curs 2024–25
links: []
diagram:
  label: Veure el diagrama complet
  href: /projects/red-segmentada/topologia.html
problem: >-
  L'assignatura entregava sis pràctiques soltes, però jo volia construir **un únic sistema de
  xarxa**: rutes que sobreviuen al reinici, cada zona accessible només quan la seva política ho
  permet i un node de monitoratge que veu totes les xarxes internes.
decisions:
  - >-
    **Quatre zones i dos routers**: vaig separar troncal, DMZ, clients i servidors, amb un router
    Linux a cada frontera.
  - >-
    **Configuració persistent**: les rutes i les regles es guarden al sistema, així que sobreviuen
    al reinici i l'escenari es pot reconstruir.
  - >-
    **Filtratge entre zones**: el trànsit entre xarxes es controla amb regles clares, sense barrejar
    configuracions antigues.
  - >-
    **Serveis de xarxa reals**: DNS amb servidor principal i de reserva, DHCP amb reserves i
    monitoratge per comprovar l'estat des d'un sol punt.
  - >-
    **Accés sense obrir ports**: un accés remot xifrat permet arribar a les xarxes internes de
    manera controlada.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/red-segmentada/topologia-cover.webp
        alt: >-
          Mapa de la xarxa: Internet entra pel router d'accés, travessa la DMZ amb dns1, dns2 i
          monitor-dmz, i baixa pel router intern cap a les xarxes de servidors i de clients.
        caption: 'Topologia: perímetre, DMZ i xarxes internes'
      - src: /projects/red-segmentada/nagios.webp
        alt: >-
          Tauler de Nagios Core amb l'estat dels serveis de dns1, dns2, localhost, el servidor
          web, el router d'accés, el router intern i els dos servidors de correu.
        caption: 'Nagios Core: estat dels serveis'
      - src: /projects/red-segmentada/segmentos.webp
        alt: >-
          Taula de segments amb el rang de cada xarxa, els routers que l'encaminen i els equips
          que hi viuen.
        caption: 'Segments i adreçament'
---
