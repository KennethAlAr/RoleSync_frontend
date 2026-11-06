import { View, Image, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/theme';

/**
 * Propiedades esperadas para el componente contenedor StatCardWrapper.
 * 
 * @interface StatCardWrapperProps
 * @property {any} backgroundImage - Referencia al asset de imagen local (obtenido mediante `require()`) para el fondo.
 * @property {React.ReactNode} children - Nodos React anidados que se renderizarán dentro de la tarjeta.
 */
interface StatCardWrapperProps {
  backgroundImage: any;
  children: React.ReactNode;
}

/**
 * Contenedor de Tarjeta de Estadísticas (StatCardWrapper).
 * 
 * Componente de diseño basado en el patrón de composición. 
 * Proporciona un marco visual estandarizado para las distintas secciones de la ficha 
 * de personaje (Salud, Tiradas de Salvación).
 * 
 * Arquitectura visual por capas (Z-Stacking):
 * 1. Fondo base de color sólido (clases de Tailwind).
 * 2. Capa de imagen temática con opacidad reducida anclada a la derecha.
 * 3. Capa de enmascaramiento: Gradiente lineal que funde la imagen con el fondo para garantizar la legibilidad.
 * 4. Capa de contenido: Elementos interactivos en el nivel superior (z-index 10).
 * 
 * @param {StatCardWrapperProps} props - Propiedades del componente.
 * @returns {JSX.Element} Tarjeta estilizada que envuelve el contenido proporcionado.
 */
const StatCardWrapper = ({ backgroundImage, children }: StatCardWrapperProps) => {
  return (
    <View className="bg-background-200 border border-tertiary rounded-2xl mb-3 shadow-sm overflow-hidden relative">
      
      {/* CAPA 1: Imagen de fondo temática con opacidad reducida */}
      <Image 
        source={backgroundImage} 
        className="absolute right-0 top-0 bottom-0 w-3/4 h-full opacity-25"
        resizeMode="cover"
      />

      {/* CAPA 2: Máscara de gradiente (Gradient Masking) para suavizar la transición 
          entre la imagen y el color de fondo base, mejorando el contraste del texto */}
      <LinearGradient
        colors={[
          colors.background.secondary,
          'transparent'
        ]}
        locations={[0.3, 0.95]}   
        start={{ x: 0, y: 0 }}      
        end={{ x: 1, y: 0 }}        
        style={StyleSheet.absoluteFill}
      />

      {/* CAPA 3: Contenedor principal para el contenido inyectado,
          elevado en el eje Z para asegurar que reciba las interacciones táctiles */}
      <View className="p-4 relative z-10">
        {children}
      </View>

    </View>
  );
};

export default StatCardWrapper;