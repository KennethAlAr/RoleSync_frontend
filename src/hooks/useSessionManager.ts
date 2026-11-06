import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { SplashScreen } from 'expo-router';

import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

/**
 * Custom Hook de Gestión de Sesión.
 * 
 * Controla el ciclo de vida de la autenticación de la aplicación y la conexión 
 * de red en tiempo real (WebSocket). Se encarga de:
 * 1. Comprobar la existencia de un token almacenado para reconectar silenciosamente al iniciar.
 * 2. Hidratar el estado global del jugador (worldId, characterId) si la sesión es válida.
 * 3. Ocultar la pantalla de carga nativa (Splash Screen) una vez resuelta la identidad del usuario.
 * 4. Monitorizar transiciones del sistema operativo (Background/Foreground) para 
 *    ejecutar estrategias de reconexión automática si el socket se suspende al minimizar la app.
 * 
 * @param {boolean} isAppReady - Condición de guarda que indica si los recursos fundamentales (fuentes, configuración) han terminado de cargar.
 * @returns {string} El estado de autenticación actual ('checking', 'authenticated', 'unauthenticated').
 */
export const useSessionManager = (isAppReady: boolean) => {
  // Referencia mutable para monitorizar en qué plano se encuentra la aplicación a nivel de OS
  const appState = useRef(AppState.currentState);
  
  // Consumo del estado global para la orquestación del enrutamiento
  const authStatus = useConnectionStore((state) => state.authStatus);
  const setAuthStatus = useConnectionStore((state) => state.setAuthStatus);

  useEffect(() => {
    // Cláusula de guarda: bloquea la inicialización de sesión hasta que la app esté preparada
    if (!isAppReady) return;

    /**
     * Proceso principal de inicialización asíncrona.
     * Intenta autenticar al usuario mediante token persistente antes de levantar la interfaz.
     */
    async function initSession() {
      const isAuthenticated = await socketManager.connectWithToken();

      if (isAuthenticated) {
        const session = socketManager.getSession();
        if (session) {
          // Hidratación del estado global con las credenciales de la sesión activa
          useCharacterStore.getState().setUserInfo({
            worldId: session.worldId,
            characterId: session.characterId,
          });
        }
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('unauthenticated');
      }
      
      // Retira el telón nativo una vez procesada la autenticación
      await SplashScreen.hideAsync();
    }

    initSession();

    /**
     * Suscripción a eventos del sistema operativo (App Lifecycle).
     * Detecta cuando la aplicación pasa de segundo plano (inactive/background) 
     * a primer plano (active) e intenta restablecer la conexión si el OS cerró el socket.
     */
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (!socketManager.isConnected()) {
          const reconnected = await socketManager.connectWithToken();
          if (!reconnected) {
            // Si la reconexión falla (ej. token expirado), se invalida la sesión global
            setAuthStatus('unauthenticated');
          }
        }
      }
      appState.current = nextAppState;
    });

    // Función de limpieza (Teardown): Desvincula el listener nativo al desmontar el hook
    return () => subscription.remove();
  }, [isAppReady]);

  return authStatus;
};