import { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';

/**
 * Propiedades esperadas para el componente AppBackground.
 * 
 * @interface AppBackgroundProps
 * @property {ReactNode} children - Nodos React anidados que se renderizarán sobre el fondo.
 */
interface AppBackgroundProps {
  children: ReactNode;
}

/**
 * Fondo Global de la Aplicación (AppBackground).
 * 
 * Componente contenedor (Wrapper/Layout Component) que provee la base visual unificada 
 * para todas las pantallas de la aplicación. 
 * 
 * Implementa una arquitectura de apilamiento visual por capas (Z-Stacking):
 * 1. Base sólida utilizando el color de fondo principal.
 * 2. Imagen de cabecera (Banner) posicionada de forma absoluta en el tercio superior (z-index: 0).
 * 3. Gradiente lineal superpuesto a la imagen que actúa como máscara de transición,
 *    fundiendo progresivamente la imagen con el color base mediante los tonos centralizados 
 *    en el tema global de la aplicación.
 * 4. Capa de contenido interactivo elevada al frente (z-index: 10).
 * 
 * @param {AppBackgroundProps} props - Propiedades del componente.
 * @returns {JSX.Element} Estructura base con fondo compuesto e inyección de contenido.
 */
const AppBackground = ({ children }: AppBackgroundProps) => {
  return (
    <View className="flex-1 bg-background">        
      
      {/* Capa de fondo: Imagen temática superior */}
      <ImageBackground
        source={require('@/assets/images/banner-dark.webp')}
        className="absolute top-0 left-0 w-full h-96 z-0"
        resizeMode="cover"
      >
        {/* Máscara de transición consumiendo los colores del tema global */}
        <LinearGradient
          colors={[
            colors.gradient['100'],
            colors.gradient['200'],
            colors.background.DEFAULT
          ]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      
      {/* Capa frontal: Contenedor principal interactivo */}
      <View className="flex-1 z-10">
        {children}
      </View>
      
    </View>
  );
};

export default AppBackground;