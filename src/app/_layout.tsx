import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import AppBackground from '@/components/shared/AppBackground';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useSessionManager } from '@/hooks/useSessionManager';

import '../global.css';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // 1. Cargamos fuentes y servicios
  const { isInitialized, error } = useAppInitialization();
  const sessionStatus = useSessionManager(isInitialized);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Esperamos a que la inicialización y la sesión estén listas
    if (!isInitialized || sessionStatus === 'loading') return;

    // Comprobamos si el usuario intenta acceder a la ficha del personaje
    const inProtectedRoute = segments[0] === 'player';

    if (sessionStatus === 'authenticated' && !inProtectedRoute) {
       router.replace('/player');
    } else if (sessionStatus === 'unauthenticated' && inProtectedRoute) {
       // Si no está autenticado, lo enviamos al index principal (Home)
       router.replace('/'); 
    }
  }, [isInitialized, sessionStatus, segments]);

  // Bloqueamos el renderizado hasta que el estado de la sesión esté resuelto
  if (!isInitialized || sessionStatus === 'loading') return null;

  return (
    <AppBackground>
      <Slot />
    </AppBackground>
  );
};

export default RootLayout;