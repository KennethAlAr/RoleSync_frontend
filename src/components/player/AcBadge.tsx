import { ImageBackground, Text } from 'react-native'

/**
 * Propiedades esperadas para el componente AcBadge.
 * 
 * @interface AcBadgeProps
 * @property {number} player_ac - El valor numérico de la Clase de Armadura (Armor Class) del jugador.
 */
interface AcBadgeProps {
  player_ac: number;
}

/**
 * Insignia de Clase de Armadura (AC Badge).
 * 
 * Componente de presentación puro. 
 * Renderiza visualmente la estadística de defensa del jugador utilizando una 
 * imagen de fondo tematizada (escudo) y posicionamiento absoluto.
 * 
 * Está diseñado para colocarse superpuesto en la parte inferior 
 * del retrato/avatar del personaje, imitando la estética de las hojas de 
 * personaje tradicionales de juegos de rol como D&D.
 * 
 * @param {AcBadgeProps} props - Propiedades del componente.
 * @returns {JSX.Element} La insignia visual de la Clase de Armadura.
 */
const AcBadge = ({ player_ac }: AcBadgeProps) => {
  return (
    <ImageBackground
      source={require('@/assets/images/ac-badge.webp')}
      className="absolute -bottom-3 w-14 h-16 items-center justify-center"
      resizeMode="contain"
    >
      <Text className="text-primary font-roboto-bold text-lg pb-1">
        {player_ac}
      </Text>
    </ImageBackground>
  )
}

export default AcBadge;