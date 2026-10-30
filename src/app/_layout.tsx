import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';

import AppBackground from '@/components/shared/AppBackground';
import { playerInfoService } from '@/services/PlayerInfoService';
import { healthInfoService } from '@/services/HealthInfoService';
import { savingThrowsService } from '@/services/SavingThrowsService';

import '../global.css';

const RootLayout = () => {

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded, error] = useFonts({
    'RobotoSlab-Regular': require('../../assets/fonts/RobotoSlab-Regular.ttf'),
    'RobotoSlab-Bold': require('../../assets/fonts/RobotoSlab-Bold.ttf')
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    console.log("Inicializando servicios de dominio...");
    
    playerInfoService.initialize();
    healthInfoService.initialize();
    savingThrowsService.initialize();    
  }, []);

  if(!fontsLoaded && !error) return null;

  return (
    <AppBackground>
      <Slot />
    </AppBackground>
  )
}

export default RootLayout