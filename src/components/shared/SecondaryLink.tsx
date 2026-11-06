import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Propiedades esperadas para el componente SecondaryLink.
 * Extiende TouchableOpacityProps para heredar atributos nativos de interacción y accesibilidad.
 * 
 * @interface SecondaryLinkProps
 * @property {string} title - El texto descriptivo del enlace de texto.
 * @property {() => void} onPress - Función callback que se ejecuta tras la interacción táctil.
 * @property {string} [className] - (Opcional) Clases de utilidad de Tailwind (NativeWind) inyectadas implícitamente para sobreescribir estilos.
 */
interface SecondaryLinkProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  className?: string;
}

/**
 * Enlace de Acción Secundaria (SecondaryLink).
 * 
 * Componente de interfaz. 
 * Se utiliza para ofrecer acciones secundarias, alternativas de escape (descartar, cancelar) 
 * o navegación suplementaria sin competir visualmente con los botones de acción principal (Call to Action).
 * 
 * Al igual que las acciones principales, incorpora retroalimentación háptica nativa 
 * para garantizar consistencia en la experiencia de usuario (UX) al interactuar 
 * con elementos tocables.
 * 
 * @param {SecondaryLinkProps} props - Propiedades del componente e inyección de atributos nativos (`...props`).
 * @returns {JSX.Element} Texto interactivo estilizado como enlace.
 */
const SecondaryLink = ({ title, onPress, className = '', ...props }: SecondaryLinkProps) => {

  /**
   * Intercepta el evento de pulsación nativo.
   * Genera una vibración táctil de tipo "Heavy" para confirmar la interacción
   * a nivel físico antes de procesar la lógica de negocio delegada.
   */
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      {...props}
    >
      <Text className={`text-primary font-roboto-regular text-xs tracking-wide ${className}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default SecondaryLink;