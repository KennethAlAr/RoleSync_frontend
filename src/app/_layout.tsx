import { useEffect } from 'react';

import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';

import AppBackground from '@/components/shared/AppBackground';
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

  if(!fontsLoaded && !error) return null;

  return (
    <AppBackground>
      <Slot />
    </AppBackground>
  )
}

export default RootLayout