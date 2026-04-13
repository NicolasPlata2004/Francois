# 🇫🇷 François: Tutor Interactivo de Francés con IA Local

![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg?logo=react)
![TailwindCSS](https://img.shields.io/badge/Estilos-Tailwind%203.4-38B2AC.svg?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg?logo=nodedotjs)
![Ollama](https://img.shields.io/badge/Backend-Ollama%20(Gemma)-white.svg?logo=ollama)

François es una aplicación web 100% privada y offline diseñada para enseñar y practicar el idioma francés mediante conversación inteligente, transcripción nativa y un fuerte enfoque en el feedback gramatical. Diseñada con un entorno limpio, cuenta con opciones de chat de texto clásico, así como un modo conversacional completo de voz, potenciado por Modelos de Lenguaje (LLMs) ejecutados localmente.

---

## 🌟 Características Principales

*   **Identidad y Estilo Único**: Tu tutora se llama *François*, una parisiense paciente y amigable. Todo en la interfaz invoca una atmósfera premium y minimalista.
*   **100% Local y Privado**: Interfaz, Base de datos (SQLite) y procesamiento del lenguaje ejecutado sobre tu propio equipo sin depender del costo de APIs externas. Todo potenciado mediante `Ollama`.
*   **Chat Conversacional Rápido**: Práctica en tiempo real donde François no solo te responde con fluidez, sino que intercepta tus errores gramaticales o de vocabulario en una caja de corrección estricta.
*   **Modo de Voz Completo**: Utiliza la Web Speech API para entender perfectamente todo lo que dices y responder con una entonación natural (Text-To-Speech del navegador integrado).
*   **Reconocimientos e Inspiración**: Este proyecto toma prestadas brillantes filosofías de implementación técnica local inspiradas en dos grandes herramientas comunitarias (mencionadas en los créditos).

---

## 🚀 Requisitos Previos e Instalación de la IA

Antes de ejecutar la aplicación, es necesario preparar el entorno de Inteligencia Artificial que servirá de cerebro para François.

1.  **Descargar Ollama**: Ve a [ollama.com](https://ollama.com/) y descarga la versión correspondiente a tu sistema operativo (Windows, macOS o Linux). Instálalo como cualquier otra aplicación.
2.  **Descargar el Modelo**: Una vez instalado Ollama, abre una terminal (PowerShell o CMD) y ejecuta el siguiente comando para descargar el modelo Gemma 3 de Google (optimizado para tutoría):
    ```bash
    ollama pull gemma3:4b
    ```
3.  **Navegador**: Se recomienda usar **Google Chrome** para garantizar la compatibilidad total con la Web Speech API (reconocimiento de voz nativo).
4.  **Entorno de Desarrollo**: Tener instalado [Node.js](https://nodejs.org/) (v18+).

---

## ⚙️ Guía de Aceleración y Despliegue Local

Sigue los siguientes comandos paso a paso para arrancar a François en tu PC:

### 1. Activar Localmente la IA (Ollama)
En una consola, deja corriendo el servicio del modelo:

```bash
ollama run gemma3:4b
```
*(Espera a que el modelo cargue y quédate con esa ventana minimizada)*

### 2. Levantar el Intermediario Backend (Node.js)
El backend procesa la comunicación local, formatea los prompts críticos, intercepta las métricas e inyecta la base de datos (SQLite).

Abre otra ventana de terminal y sitúate en la raíz del proyecto backend:

```bash
cd backend
npm install
npm run dev
```
*(Debe indicar que corre en el puerto 5000 y que inicializó `french-tutor.db`)*

### 3. Ejecutar el Cliente React (Frontend)
Abre una tercera y última ventana en la carpeta del frontend y móntalo:

```bash
cd frontend
npm install
npm run dev
```

El Frontend desplegará en tu puerto (ej: `http://localhost:5173/`). Copia esa ruta a Google Chrome y presiona Enter. **¡Ya estás charlando con François!**

---

## 📊 Arquitectura del Sistema
- **Frontend**: React.js / Vite. UI limpia con soporte _Dark Mode_ impulsada por Tailwind CSS v3.
- **Microservicios (Backend)**: Express Server que maneja CORS con el cliente y despacha requerimientos.
- **Modelos Integrados offline**: Whisper-tiny vía HuggingFace/Xenova y Vosk (para componentes locales experimentales).
- **Control de Flujo / Lógica de Tutoría**: El LLM realiza un proceso iterativo; a su vez que responde el hilo temporal del chat en formato JSON (Francés base + Traducción Español), analiza el input del usuario extrañendo correcciones que expulsa visualmente.

---

## 🤝 Créditos y Referencias Open-source

Este montaje en su estructura de servicios fue inspirado y construido con componentes lógicos abstraídos de increíbles iniciativas open-source:

*   [**FluentDiary-Desktop**](https://github.com/Thxamillion/fluentdiary-desktop): Base inspiracional de uso de Web Audio APIs.
*   [**Discute**](https://github.com/5uru/Discute): Arquitectura fundamental del servicio de corrección lingüística con desdoblamiento en dos capas lógicas (Chat Conversacional + Intercepción Estricta de Errores Vía Prompt JSON).

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE). Siéntete libre de clonarlo, romperlo, y mejorarlo para tu propio aprendizaje de este hermoso idioma.
