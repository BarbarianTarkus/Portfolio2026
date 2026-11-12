---
slug: brazo-robotico
name: Robotic arm teleoperation
kind: tfg
year: '2026'
featured: true
summary: >-
  **Bachelor's thesis**: a low-cost arm teleoperated with the hands from Meta Quest 3,
  with Unity and OpenXR, an ESP32 → Arduino → ten servos chain and the arm 3D-printed and
  assembled from scratch.
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
work: 74 h of printing · €173 in materials
links: []
video:
  label: 'Video: hand tracking moves the arm from Meta Quest 3'
  embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
problem: >-
  The thesis called for a complete system, not a demo: **teleoperating a low-cost arm with
  your hands**, one that responds to the operator pinch, with no controllers or floating menus,
  and that does not break when someone moves the arm quickly.
decisions:
  - >-
    **Unity + OpenXR on Meta Quest 3** (Quest 2 compatible), with native hand tracking and the
    interface anchored to the wrists: you operate it without controllers.
  - >-
    **ESP32 → Arduino Mega 2560 → 10 servos chain**, with a custom frame protocol, a pose
    queue and speed limiting: the printed mechanics hold up to the operator's yanks.
  - >-
    **The ESP32 also serves a manual control web page** over WiFi, to calibrate and move the
    arm from a browser without the headset.
  - >-
    **Arm built from scratch**: 74 h of 3D printing (~1.5 kg of PLA), custom electronics and a
    dedicated 5 V/18 A power supply, with ~€173 of material.
  - >-
    **Bench validation and documentation**: functional tests, a 79-page technical report, the
    protocol and the defense script.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/brazo-robotico/flujo-control.webp
        alt: >-
          Control flow diagram: the operator's hand is captured on Meta Quest 3, which sends the
          positions over UDP to the ESP32; the ESP32 turns them into angles and passes them over
          serial to the Arduino Mega 2560, which moves the arm servos.
        caption: 'Control flow: hand → Quest 3 → ESP32 → Arduino → arm'
      - src: /projects/brazo-robotico/herramientas.webp
        alt: >-
          Tools: the ESP32 and the Arduino Mega with the Arduino IDE on one side and the
          Meta Quest 3 headset with Unity on the other, converging on the 3D-printed arm.
        caption: 'Tools: ESP32 + Arduino IDE and Quest 3 + Unity'
---
