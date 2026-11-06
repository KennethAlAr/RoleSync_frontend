import { TouchableOpacity, Text } from 'react-native';

import * as Haptics from 'expo-haptics';

/**
 * Propiedades esperadas para el componente ActionButton.
 * 
 * @interface ActionButtonProps
 * @property {string} symbol - El símbolo o texto corto a mostrar en el botón (ej: "+", "-", "x").
 * @property {string} bgColor - Clase de Tailwind (NativeWind) para definir el color de fondo.
 * @property {() => void} onPress - Función callback a ejecutar cuando el botón es pulsado.
 */
interface ActionButtonProps {
  symbol: string;
  bgColor: string;
  onPress: () => void;
}

/**
 * Botón de Acción Genérico con Retroalimentación Háptica.
 * 
 * Componente de interfaz reutilizable diseñado para interacciones rápidas y repetitivas,
 * como los botones de suma/resta en los contadores de salud (HP).
 * 
 * Incorpora la API nativa de vibración del dispositivo (`expo-haptics`) para ofrecer
 * una respuesta física (Haptic Feedback) al usuario, mejorando significativamente 
 * la Experiencia de Usuario (UX) al confirmar que el toque ha sido registrado.
 * 
 * @param {ActionButtonProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un botón interactivo redondeado con soporte háptico.
 */
const ActionButton = ({ symbol, bgColor, onPress }: ActionButtonProps) => {
  
  /**
   * Intercepta el evento de pulsación para inyectar la vibración antes
   * de ejecutar la lógica de negocio proporcionada por el padre.
   */
  const handlePress = () => {
    // Genera una pequeña vibración física de estilo "Heavy" (ideal para botones pequeños)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); 
    
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      // Se utiliza active:opacity-70 para proporcionar feedback visual inmediato al tocar
      className={`w-10 h-10 ${bgColor} rounded-xl items-center justify-center active:opacity-70`}
    >
      <Text className="text-white font-roboto-bold text-xl">
        {symbol}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;