import { Slot, SplashScreen } from 'expo-router';
import { useEffect } from 'react';

import AppBackground from '@/components/shared/AppBackground';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useSessionManager } from '@/hooks/useSessionManager';

import { playerInfoService } from '@/services/PlayerInfoService';
import { healthInfoService } from '@/services/HealthInfoService';
import { savingThrowsService } from '@/services/SavingThrowsService';

import '../global.css';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // 1. Cargamos fuentes y servicios
  const { isInitialized, error } = useAppInitialization();

  // 2. Comprobamos la red y gestionamos redirecciones
  useSessionManager(isInitialized);

  // 3. Esperamos a que los recursos locales carguen
  if (!isInitialized && !error) return null;

  // useEffect(() => {
  //   // Registra los eventos en el SocketManager de forma global
  //   playerInfoService.initialize();
  //   healthInfoService.initialize();
  //   savingThrowsService.initialize();
  // }, []);

  return (
    <AppBackground>
      <Slot />
    </AppBackground>
  );
};

export default RootLayout;