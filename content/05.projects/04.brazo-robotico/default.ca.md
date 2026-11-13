---
slug: brazo-robotico
name: Teleoperació d'un braç robòtic
kind: tfg
year: '2026'
featured: true
summary: >-
  **Treball de Fi de Grau**: braç robòtic de baix cost teleoperat amb les mans des d'un visor
  Meta Quest 3, imprès en 3D i muntat des de zero.
tags:
  - Unity
  - C#
  - OpenXR
  - Meta Quest
  - Arduino
  - ESP32
  - WiFi
  - 3D printing
period: '2026'
work: 74 h d'impressió · 173 € de material
links: []
video:
  label: 'Vídeo: la mà de l''operador mou el braç des de Meta Quest 3'
  embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
problem: >-
  El TFG demanava un sistema complet, no una demo: **moure un braç robòtic de baix cost amb les
  mans**, sense comandaments, i que resistís un ús real sense trencar-se.
decisions:
  - >-
    **Control amb les mans**: el visor detecta la posició i la pinça de les mans, i el braç respon
    sense necessitat de comandaments.
  - >-
    **Un braç de baix cost**: dissenyat i imprès en 3D des de zero, amb electrònica pròpia i
    materials per uns 170 €.
  - >-
    **Moviment segur**: la velocitat es limita i les ordres s'ordenen perquè la mecànica impresa
    aguanti els moviments bruscos.
  - >-
    **Control manual des del navegador**: una pàgina web permet calibrar i moure el braç sense el
    visor.
  - >-
    **Documentat i provat**: proves funcionals, memòria tècnica i guió de defensa.
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
---
