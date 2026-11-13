---
slug: red-segmentada
name: Segmented network on Linux
kind: académico
year: '2025'
summary: >-
  **Network lab** across four zones with Linux routers: routing, security, DNS, DHCP and monitoring
  working as a single system.
tags:
  - Linux
  - nftables
  - BIND9
  - DHCP
  - Nagios
  - SSH
period: academic year 2024–25
links: []
diagram:
  label: View the full diagram
  href: /projects/red-segmentada/topologia.html
problem: >-
  The course delivered six separate assignments, but I wanted to build **one network system**:
  routes that survive a reboot, each zone reachable only when its policy allows it, and a
  monitoring node that sees all the internal networks.
decisions:
  - >-
    **Four zones and two routers**: I separated backbone, DMZ, clients and servers, with a Linux
    router at each boundary.
  - >-
    **Persistent configuration**: routes and rules are stored in the system, so they survive a
    reboot and the scenario can be rebuilt.
  - >-
    **Security by zone**: traffic between networks is filtered with clear rules, without mixing
    old configurations.
  - >-
    **Real network services**: DNS with a primary and a backup server, DHCP with reservations and
    monitoring to check status from a single point.
  - >-
    **Access without opening ports**: encrypted remote access reaches the internal networks in a
    controlled way.
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
          server, the access router, the internal router and the two mail servers.
        caption: 'Nagios Core: service status'
      - src: /projects/red-segmentada/segmentos.webp
        alt: >-
          Segment table with the range of each network, the routers that route it and the
          machines that live in it.
        caption: 'Segments and addressing'
---
