## Práctica 03: Consumo de APIs para Geolocalización

---
<p align = "justify">
En esta práctica se creará una aplicación web que compare dos APIs de mapas (Google Maps y Leaflet) para visualización de Geolocalización, usando Node.js, Express y Tailwind CSS, demostrando los conceptos teóricos y requerimientos tecnológicos para el consumo de APIs de Geolocalización.
</p>

---
#### Consideraciones:

<p align = "justify">
Esta práctica será desarrollada con estructura de ramales por cada fase, para que el estudiante continue practicando la manipulación correcta de ramas en el contexto de control de versiones y desarrollo colaborativo utilizando Git y GitHub.

---
#### Tablas de Fases
|No.|Descripción|Potenciador|Estatus|
| --- | --- | --- | --- |
|1.| Configuración del Proyecto| 3 | ✅ Completado |
|2.| Configuración del Servidor | 1 | ✅ Completado |
|3.| Configuración de la Libreria de Estilos (Tailwind CSS) | 3 | ✅ Completado |
|4.| Creación de Vistas | 1 | ✅ Completado |
|5.| Implementación de Backend para Consumo (JS) | 1 | ✅ Completado |
|6.| Configuración del Entorno | 1 | ✅ Completado |

|7.| Pruebas de Ejecución | 3 | ✅ Completado |
|8.| Documentación | X | ❌ Sin Iniciar |

---

---

### 🚀 Fase 7: Ejecución y Estructura del Proyecto

---

Esta fase detalla el flujo de trabajo técnico necesario para el despliegue de la aplicación, proporcionando una comprensión clara de los comandos de Node.js y la organización modular del código fuente.

#### 🛠️ Guía de Instalación y Uso Detallada

---

Siga estas instrucciones paso a paso para replicar el entorno de desarrollo de forma exitosa:

1. **Obtención del Código Fuente**
   Se utiliza el sistema de control de versiones Git para descargar una copia local del repositorio y acceder a la estructura de archivos.
   ```bash
   git clone [https://github.com/yazmin0608/AWOS_Practica03_240235.git](https://github.com/yazmin0608/AWOS_Practica03_240235.git)

2. **Instalación de Dependencias Técnicas**
    Este comando consulta el archivo package.json e instala automáticamente todas las librerías necesarias para el funcionamiento del backend (Express, EJS, Axios, Dotenv).
    ```bash
    npm install

3. **Configuración del Entorno de Seguridad (.env)**
    Para proteger datos sensibles y cumplir con las mejores prácticas de seguridad, la aplicación utiliza variables de entorno. Esto asegura que las llaves privadas (API Keys) no se filtren en el historial público de Git.
    - **Paso A:** Crear el archivo local de configuración basado en la plantilla: <u>cp .env.example .env.</u>
    - **Paso B:** Editar el archivo .env recién creado e ingresar una credencial válida: <u>Maps_API_KEY=tu_llave_aqui.</u>

4. **Scripts de Ejecución del Servidor**
    La aplicación cuenta con dos modos de arranque optimizados para diferentes escenarios:
    - **Modo Desarrollo:** Ejecuta la aplicación utilizando <u>nodemon</u>. Esta herramienta monitorea los archivos y reinicia el servidor automáticamente ante cualquier cambio guardado, optimizando el tiempo de codificación.
    - **Modo Producción:** Inicia el servidor de forma estable y directa mediante Node.js para un entorno de uso final.
    ```bash
    npm run dev
    npm start

#### 📂 Arquitectura Final del Software

---

El proyecto se organizó bajo un esquema de separación de responsabilidades para garantizar la escalabilidad y el orden del código:
- **server.js:** El núcleo del backend. Gestiona la configuración del servidor Express, procesa las peticiones de geocodificación y asegura la correcta carga de las variables de entorno.

- **public/js/app.js:** Controlador lógico del lado del cliente. Administra la sincronización en tiempo real de los motores de Google Maps y Leaflet, así como la interacción con los marcadores.

- **views/index.ejs:** El esqueleto visual del proyecto. Utiliza el motor de plantillas EJS para renderizar la interfaz de usuario diseñada con Tailwind CSS.

- **.env.example:** Archivo de referencia indispensable. Sirve como plantilla técnica para que otros desarrolladores identifiquen qué variables requiere el proyecto sin exponer los datos sensibles reales.
>>>>>>> fase7
