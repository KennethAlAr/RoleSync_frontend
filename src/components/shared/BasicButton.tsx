import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import * as Haptics from 'expo-haptics';

/**
 * Propiedades esperadas para el componente BasicButton.
 * Extiende TouchableOpacityProps para heredar las propiedades nativas (ej. disabled, activeOpacity).
 * 
 * @interface ButtonProps
 * @property {string} title - El texto principal que se mostrará en el botón.
 * @property {() => void} onPress - Función callback que se ejecuta tras la interacción táctil.
 * @property {string} [className] - (Opcional) Clases de utilidad de Tailwind (NativeWind) para extender o sobrescribir estilos.
 */
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  className?: string;
}

/**
 * Botón de Acción Principal (BasicButton).
 * 
 * Componente de interfaz reutilizable que estandariza la estética de 
 * las acciones principales en la aplicación utilizando los colores y tipografías del tema global.
 * 
 * Incorpora retroalimentación háptica (Haptic Feedback) de forma nativa para mejorar 
 * la experiencia de usuario (UX), confirmando físicamente las interacciones antes 
 * de delegar la ejecución a la lógica de negocio.
 * 
 * Soporta la inyección de propiedades nativas de React Native mediante la desestructuración 
 * de atributos (`...props`), permitiendo el control externo de estados como la deshabilitación.
 * 
 * @param {ButtonProps} props - Propiedades del componente y atributos nativos heredados.
 * @returns {JSX.Element} Botón estilizado e interactivo.
 */
const BasicButton = ({ title, onPress, className = '', ...props }: ButtonProps) => {

  /**
   * Intercepta el evento de pulsación nativo.
   * Genera una vibración táctil de tipo "Heavy" como confirmación física inmediata 
   * y posteriormente invoca la función de callback proporcionada.
   */
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      className={`bg-primary py-4 rounded-xl items-center shadow-lg ${className}`}
      onPress={handlePress}
      {...props}
    >
      <Text className="text-black font-roboto-bold text-lg tracking-wider">
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default BasicButton;