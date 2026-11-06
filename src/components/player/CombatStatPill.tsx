import React from 'react';
import { View, Text, Image } from 'react-native'

/**
 * Propiedades esperadas para el componente CombatStatPill.
 * 
 * @interface CombatStatPillProps
 * @property {string | React.ReactNode} statNumber - El valor principal a mostrar (puede ser texto o un componente React, como un icono).
 * @property {string} statName - El nombre descriptivo de la estadística, mostrado debajo del valor principal.
 */
interface CombatStatPillProps {
  statNumber: string | React.ReactNode;
  statName: string;
}

/**
 * Píldora de Estadística de Combate (Combat Stat Pill).
 * 
 * Componente de presentación reutilizable diseñado para unificar la estética de las 
 * estadísticas secundarias del jugador (ej. Iniciativa, Velocidad, Competencia).
 * 
 * Utiliza una imagen de fondo (asset gráfico) para encapsular el valor principal,
 * proporcionando una estética consistente, mientras mantiene 
 * flexibilidad en su contenido gracias a la aceptación de `ReactNode`.
 * 
 * @param {CombatStatPillProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un contenedor estandarizado para estadísticas numéricas o visuales.
 */
const CombatStatPill = ({ statNumber, statName }: CombatStatPillProps) => {
  return (
    <View className="items-center">
      
      {/* Contenedor principal del valor con posicionamiento absoluto para el asset gráfico */}
      <View className="w-24 h-12 items-center justify-center relative">
        <Image 
          source={require('@/assets/images/lozenge.png')} 
          className="absolute w-full h-full"
          resizeMode="contain"
        />
        <Text className="text-white font-roboto-bold text-xl">
          {statNumber}
        </Text>
      </View>
      
      {/* Etiqueta descriptiva inferior tipografiada para máxima legibilidad */}
      <Text className="text-primary font-roboto-bold text-[11px] tracking-wider uppercase mt-1">
          {statName}
      </Text>
      
    </View>
  )
}

export default CombatStatPill;