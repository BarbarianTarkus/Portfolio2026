---
slug: red-segmentada
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
---
