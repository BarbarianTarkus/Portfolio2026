---
slug: brazo-robotico
name: Teleoperación de un brazo robótico
kind: tfg
year: '2026'
featured: true
summary: >-
  **Trabajo de Fin de Grado**: brazo de bajo coste teleoperado con las manos desde Meta Quest 3,
  con Unity y OpenXR, una cadena ESP32 → Arduino → diez servos y el brazo impreso en 3D y montado
  desde cero.
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
work: 74 h de impresión · 173 € de material
links: []
video:
  label: 'Vídeo: la mano del operador mueve el brazo desde Meta Quest 3'
  embed: 'https://drive.google.com/file/d/1ZRnbjAjVxOb8xDXBvJa9yVCptx7tpYNR/preview'
problem: >-
  El TFG pedía un sistema completo, no una demo: **teleoperar con las manos** un brazo de bajo
  coste que responde a la pinza del operador, sin mandos ni menús flotantes, y que no se rompe
  cuando alguien mueve el brazo deprisa.
decisions:
  - >-
    **Unity + OpenXR en Meta Quest 3** (compatible con Quest 2), con hand tracking nativo y la
    interfaz anclada a las muñecas: se opera sin mandos.
  - >-
    **Cadena ESP32 → Arduino Mega 2560 → 10 servos**, con protocolo de tramas propio, cola de
    poses y limitación de velocidad: la mecánica impresa aguanta los tirones del operador.
  - >-
    **El ESP32 sirve además una página web de control manual** por WiFi, para calibrar y mover
    el brazo desde el navegador sin el visor.
  - >-
    **Brazo construido desde cero**: 74 h de impresión 3D (~1,5 kg de PLA), electrónica propia y
    fuente dedicada de 5 V/18 A, con ~173 € de material.
  - >-
    **Validación en banco y documentación**: pruebas funcionales, memoria técnica de 79 páginas,
    protocolo y guion de defensa.
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
