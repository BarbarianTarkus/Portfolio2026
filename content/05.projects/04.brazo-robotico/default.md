---
slug: brazo-robotico
name: Teleoperación de un brazo robótico
kind: tfg
year: '2026'
featured: true
summary: >-
  **Trabajo de Fin de Grado**: brazo robótico de bajo coste teleoperado con las manos desde un
  visor Meta Quest 3, impreso en 3D y montado desde cero.
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
work: 74 h de impresión · 173 € de material
links: []
video:
  label: 'Vídeo: la mano del operador mueve el brazo desde Meta Quest 3'
  embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
problem: >-
  El TFG pedía un sistema completo, no una demo: **mover un brazo robótico de bajo coste con las
  manos**, sin mandos, y que resistiera un uso real sin romperse.
decisions:
  - >-
    **Control con las manos**: el visor detecta la posición y la pinza de las manos, y el brazo
    responde sin necesidad de mandos.
  - >-
    **Un brazo de bajo coste**: diseñado e impreso en 3D desde cero, con electrónica propia y
    materiales por unos 170 €.
  - >-
    **Movimiento seguro**: la velocidad se limita y las órdenes se ordenan para que la mecánica
    impresa aguante los movimientos bruscos.
  - >-
    **Control manual desde el navegador**: una página web permite calibrar y mover el brazo sin el
    visor.
  - >-
    **Documentado y probado**: pruebas funcionales, memoria técnica y guion de defensa.
gallery:
  - view: web
    label: Web
    images:
      - src: /projects/brazo-robotico/flujo-control.webp
        alt: >-
          Esquema del flujo de control: la mano del operador se captura en Meta Quest 3, que envía
          las posiciones por UDP al ESP32; este las traduce a ángulos y las pasa por serie al
          Arduino Mega 2560, que mueve los servos del brazo.
        caption: 'Flujo de control: mano → Quest 3 → ESP32 → Arduino → brazo'
      - src: /projects/brazo-robotico/herramientas.webp
        alt: >-
          Herramientas de trabajo: el ESP32 y el Arduino Mega con el IDE de Arduino a un lado y
          las gafas Meta Quest 3 con Unity al otro, convergiendo en el brazo impreso en 3D.
        caption: 'Herramientas: ESP32 + IDE de Arduino y Quest 3 + Unity'
---
