 # Rick and Morty - Fan Wiki

Una aplicación web interactiva para explorar el universo de Rick and Morty. Permite a los usuarios registrarse, iniciar sesión y navegar por una base de datos completa de personajes y episodios, con datos obtenidos en tiempo real de la [API de Rick and Morty](https://rickandmortyapi.com/).

enlace para la pagina: https://ozymandias187-bit.github.io/RICKandMorty/
---

## 🚀 Características Principales

- **Autenticación de Usuarios**: Sistema completo de registro, inicio de sesión y recuperación de contraseña con preguntas de seguridad.
- **Explorador de Personajes**:
    - Visualización en formato de cuadrícula estilo "Netflix".
    - Búsqueda en tiempo real por nombre.
    - Ordenamiento de la tabla por columnas (ID, Nombre, Especie, etc.).
    - Modal para ver detalles y editar la información de cada personaje.
- **Explorador de Episodios**:
    - Visualización en formato de lista.
    - Búsqueda en tiempo real por nombre.
    - Ordenamiento de la tabla por columnas.
    - Modal para ver detalles y editar la información de cada episodio.
- **Diseño Adaptativo y Moderno**:
    - Interfaz con una estética de cómic.
    - **Tema Dual**: Soporte para modo claro y oscuro, con persistencia en las preferencias del usuario.
- **Experiencia Offline**:
    - Detección de pérdida de conexión a internet.
    - Muestra un aviso al usuario indicando que está navegando en modo offline con los últimos datos cacheados.

---

## 💻 Tecnologías Utilizadas

Este proyecto fue construido desde cero utilizando tecnologías web fundamentales, demostrando un enfoque en JavaScript puro y modular.

- **Frontend**:
    - **HTML5**: Estructura semántica del contenido.
    - **CSS3**: Estilos personalizados, variables CSS para temas, diseño responsivo y animaciones.
    - **JavaScript (ES6+ Modules)**: Lógica de la aplicación, manipulación del DOM, y modularización del código.

- **Almacenamiento**:
    - **Local Storage**: Para persistir la sesión del usuario, las cuentas y las preferencias de tema.

- **No se utilizaron frameworks** (como React, Angular o Vue) para centrarse en el dominio de JavaScript Vanilla.

---

## 🧠 Contribución de la IA en el Desarrollo

Este proyecto es un excelente ejemplo de cómo la colaboración humano-IA puede acelerar y mejorar el desarrollo de software. A continuación, se desglosa qué partes fueron probablemente impulsadas por la creatividad humana y cuáles pudieron haber sido asistidas por una IA como Gemini Code Assist.

### 🧑‍💻 Aportes Humanos (Estrategia y Creatividad)

- **Visión y Arquitectura del Proyecto**: La idea original, la decisión de estructurar el código en módulos (`auth`, `api`, `ui`, `characters`, `episodes`) y la definición de cómo interactúan entre sí es un trabajo de diseño y arquitectura puramente humano.
- **Diseño de UI/UX**: La elección de la paleta de colores, las tipografías (`Bangers`, `Space Grotesk`) y la estética general de "cómic" son decisiones creativas que definen la identidad del proyecto.
- **Lógica de Negocio Específica**: Definir las reglas exactas para la recuperación de contraseña, los campos requeridos en los formularios y la experiencia de usuario deseada.
- **Depuración e Integración**: El proceso iterativo de encontrar y solucionar errores que surgen al conectar diferentes partes del sistema (DOM, CSS, JS) requiere intuición y experiencia humana.

### 🤖 Áreas con Asistencia de IA (Eficiencia y Optimización)

- **Generación de Código Repetitivo (Boilerplate)**: La IA es ideal para generar rápidamente la estructura inicial de los archivos HTML, las funciones para manipular el DOM (`document.getElementById`) o los esqueletos de los módulos de servicio.
- **Lógica Compleja y Algoritmos**:
    - **Funciones de Búsqueda y Ordenamiento**: La IA puede escribir eficientemente las funciones para filtrar y ordenar los arrays de personajes/episodios, incluyendo la lógica para manejar el orden ascendente/descendente.
    - **Integración de API**: Generar el código `async/await` para realizar las llamadas `fetch` a la API de Rick and Morty, manejar las respuestas y gestionar los posibles errores.
- **Estilos CSS Avanzados**:
    - **Variables de Tema**: Crear la estructura de variables CSS para los temas claro y oscuro.
    - **Selectores Complejos**: Escribir selectores CSS avanzados como `body:has(#characters-view:not(.oculto))` para aplicar estilos basados en el estado de la aplicación.
    - **Código de Animación**: Sugerir transiciones suaves (`cubic-bezier`) y transformaciones para mejorar la interactividad.
- **Refactorización y Calidad de Código**:
    - **Optimización**: Sugerir mejoras, como cambiar bucles `for` tradicionales por métodos de array más modernos (`.forEach`, `.map`, `.find`).
    - **Extracción de Funciones**: Identificar código duplicado (como el llenado de modales para "Ver" y "Editar") y sugerir refactorizarlo en funciones reutilizables para mantener el código limpio (principio DRY - Don't Repeat Yourself).
- **Documentación**: Ayudar a escribir comentarios en el código y generar documentación como este mismo archivo `README.md`.

---

## 🔧 Cómo Ejecutar Localmente

1. Clona este repositorio en tu máquina local.
2. Abre el archivo `index.html` en tu navegador web.
   > **Nota**: Debido al uso de Módulos de JavaScript (ESM), algunos navegadores requieren que los archivos se sirvan a través de un servidor web local para funcionar correctamente. Puedes usar la extensión "Live Server" de Visual Studio Code para esto.
