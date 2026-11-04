import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SplashScreen } from 'expo-router';

import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

export const useSessionManager = (isAppReady: boolean) => {
  const appState = useRef(AppState.currentState);
  
  // Usamos el estado global en lugar de un useState local
  const authStatus = useConnectionStore((state) => state.authStatus);
  const setAuthStatus = useConnectionStore((state) => state.setAuthStatus);

  useEffect(() => {
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
        setAuthStatus('authenticated');
      } else {
        setAuthStatus('unauthenticated');
      }
      await SplashScreen.hideAsync();
    }

    initSession();

    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (!socketManager.isConnected()) {
          const reconnected = await socketManager.connectWithToken();
          if (!reconnected) {
            setAuthStatus('unauthenticated');
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isAppReady]);

  return authStatus;
};