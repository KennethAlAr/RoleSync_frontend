# RoleSync - Mobile App

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/NativeWind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Aplicación móvil complementaria para el ecosistema **RoleSync**. Actúa como una hoja de personaje interactiva en tiempo real para jugadores de juegos de rol, sincronizada bidireccionalmente con Foundry VTT.

---

## Ecosistema RoleSync y Orden de Ejecución

Este repositorio es una de las tres piezas que componen el Trabajo de Fin de Grado (TFG). Para que el sistema funcione correctamente, los componentes deben iniciarse en el siguiente orden:

1. **[RoleSync Server](https://github.com/KennethAlAr/RoleSync_server):** Servidor Node.js intermediario (Relay Server) que gestiona los WebSockets. *(Se inicia primero)*.
2. **[RoleSync Foundry Module](https://github.com/KennethAlAr/RoleSync_module):** Módulo instalado en el VTT del Dungeon Master. Genera el código QR de vinculación al detectar el servidor.
3. **RoleSync Mobile App (Este repositorio):** Aplicación del jugador. Escanea el QR para establecer el túnel en tiempo real.

---

## Requisitos Previos

Para levantar el entorno de desarrollo o compilar la aplicación en local, necesitas:

* **Node.js:** v22.x o superior.
* **Expo SDK:** ~57.0.31
* **Java Development Kit (JDK):** v17 (Estrictamente necesario para la compilación de Android).
* **Android Studio:** Con un emulador configurado (o un dispositivo físico con Expo Go / Modo Depuración USB).

---

## Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/KennethAlAr/RoleSync_frontend
   cd rolesync-mobile
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   El proyecto utiliza variables de entorno para localizar el servidor de WebSockets. 
   Copia la plantilla de ejemplo y renómbrala:
   ```bash
   cp .env.example .env
   ```
   Abre el nuevo archivo `.env` y define la URL. 
   * *Para desarrollo local:* Usa la IP de tu máquina en la red local (ej. `http://192.168.1.33:3000`).
   * *Para producción:* Usa la URL de tu servidor desplegado (ej. `https://ejemplo-servidor.onrender.com`).

---

## Entorno de Desarrollo

Para levantar la aplicación en modo desarrollo (limpiando la caché para evitar conflictos de empaquetado), ejecuta:

```bash
npx expo start -c
```

Una vez que aparezca el menú interactivo en la terminal:
* Pulsa `a` para abrirla en el **Emulador de Android Studio**.
* Alternativamente, escanea el código QR mostrado en la terminal con la cámara de tu móvil para abrirla en **Expo Go** o en tu *Development Build*.

---

## Compilación para Producción (APK/AAB)

El proyecto está configurado para compilarse localmente mediante Gradle. Si tu entorno dispone de múltiples versiones de Java, es obligatorio forzar el uso de Java 17 durante la compilación.

1. Genera la carpeta nativa de Android:
   ```bash
   npx expo prebuild --platform android
   ```
2. Accede al directorio nativo de Android:
   ```bash
   cd android
   ```
3. Ejecuta el ensamblado de la versión de lanzamiento.
   > **⚠️ Nota sobre Java (JDK):** Es estrictamente necesario compilar con **Java 17**. Si tu sistema tiene otra versión por defecto, deberás indicar la ruta temporalmente usando `JAVA_HOME`.
   *Si tu sistema ya usa Java 17 por defecto, ejecuta simplemente:*
   ```bash
   ./gradlew assembleRelease
   ```
   *Ejemplo de compilación forzando la ruta (Linux):*
   ```bash
   JAVA_HOME=/usr/lib/jvm/java-17-temurin-jdk ./gradlew assembleRelease
   ```
4. El archivo `.apk` resultante se generará en la ruta:
   `android/app/build/outputs/apk/release/app-release.apk`

---

## Arquitectura Técnica Destacada

* **Gestión de Estado (Zustand):** Patrón *Dumb Store* para la interfaz, delegando la lógica compleja a la capa de servicios. Tres niveles de conexión aislados (Autenticación, Transporte WebSocket y Origen Foundry).
* **Servicios (Singleton):** Controladores de dominio (`SocketManagerService`, `HealthInfoService`) que implementan *Optimistic UI Updates* y *Network Debouncing* para evitar saturación de peticiones.
* **Resiliencia de Red:** Integración con el `AppState` nativo de React Native para congelar e hidratar conexiones WebSocket de forma eficiente cuando el sistema operativo manda la app a segundo plano.
* **Diseño Unificado (NativeWind):** Única fuente de verdad (Single Source of Truth) para el sistema de diseño mediante la extracción de tokens de `tailwind.config.js`.