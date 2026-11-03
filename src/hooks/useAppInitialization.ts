import { useEffect } from 'react';
import { useFonts } from 'expo-font';

import { healthInfoService } from '@/services/HealthInfoService';
import { playerInfoService } from '@/services/PlayerInfoService';
import { savingThrowsService } from '@/services/SavingThrowsService';

export const useAppInitialization = () => {
  const [fontsLoaded, error] = useFonts({
    'RobotoSlab-Regular': require('../../assets/fonts/RobotoSlab-Regular.ttf'),
    'RobotoSlab-Bold': require('../../assets/fonts/RobotoSlab-Bold.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    console.log("Inicializando servicios de dominio...");
    playerInfoService.initialize();
    healthInfoService.initialize();
    savingThrowsService.initialize();
  }, []);

  return {
    isInitialized: fontsLoaded,
    error,
  };
};