---
slug: brazo-robotico
name: Robotic arm teleoperation
kind: tfg
year: '2026'
featured: true
summary: >-
  **Bachelor's thesis**: a low-cost robotic arm teleoperated with the hands from a Meta Quest 3
  headset, 3D-printed and assembled from scratch.
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
work: 74 h of printing · €173 in materials
links: []
video:
  label: 'Video: hand tracking moves the arm from Meta Quest 3'
  embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
problem: >-
  The thesis called for a complete system, not a demo: **moving a low-cost robotic arm with your
  hands**, without controllers, and withstanding real use without breaking.
decisions:
  - >-
    **Hand control**: the headset tracks hand position and pinch, and the arm responds without
    controllers.
  - >-
    **A low-cost arm**: designed and 3D-printed from scratch, with custom electronics and about
    €170 in materials.
  - >-
    **Safe movement**: speed is limited and commands are queued so the printed mechanics withstand
    sudden movements.
  - >-
    **Manual control from the browser**: a web page lets you calibrate and move the arm without
    the headset.
  - >-
    **Tested and documented**: functional tests, a technical report and a defence script.
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
