---
slug: red-segmentada
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
---
