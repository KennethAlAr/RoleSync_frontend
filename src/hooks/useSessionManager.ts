import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SplashScreen, useRouter } from 'expo-router';

import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

export const useSessionManager = (isAppReady: boolean) => {
  const router = useRouter();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Solo intentamos conectar cuando las fuentes y servicios locales están listos
    if (!isAppReady) return;

    async function initSession() {
      const isAuthenticated = await socketManager.connectWithToken();

      if (isAuthenticated) {
        const session = socketManager.getSession();
        if (session) {
          useCharacterStore.getState().setUserInfo({
            worldId: session.worldId,
            characterId: session.characterId,
          });
        }
        router.replace('/player');
      } else {
        router.replace('/scanner');
      }

      // Ocultamos la SplashScreen cuando el flujo de auth ha terminado
      await SplashScreen.hideAsync();
    }

    initSession();

    // Control de segundo plano (Background -> Active)
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('📱 App volvió al primer plano. Comprobando socket...');

        if (!socketManager.isConnected()) {
          console.log('🔄 Socket desconectado. Reintentando con token...');
          const reconnected = await socketManager.connectWithToken();

          if (!reconnected) {
            router.replace('/scanner');
          }
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAppReady]);
};