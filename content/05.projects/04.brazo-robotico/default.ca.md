---
slug: brazo-robotico
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
---
