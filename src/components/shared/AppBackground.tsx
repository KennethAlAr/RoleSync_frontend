import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme?.colors as any;

const AppBackground = ({ children }: { children: ReactNode }) => {
  return (
    <View className="flex-1 bg-background">        
      <ImageBackground
        source={require('@/assets/images/banner-dark.webp')}
        className="absolute top-0 left-0 w-full h-96 z-0"
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            colors.gradient['100'] ,
            colors.gradient['200'] ,
            colors.background.DEFAULT
          ]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      
      <View className="flex-1 z-10">
        {children}
      </View>
    </View>
  );
};

export default AppBackground;