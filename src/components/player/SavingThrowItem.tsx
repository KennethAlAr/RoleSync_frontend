import { View, Text, TouchableOpacity } from 'react-native'

import * as Haptics from 'expo-haptics';

/**
 * Propiedades esperadas para el componente SavingThrowItem.
 * 
 * @interface SavingThrowItemProps
 * @property {string} name - Nombre de la característica (ej. "Fuerza", "Destreza").
 * @property {string} mod - Modificador numérico formateado de la tirada (ej. "+3", "-1").
 * @property {boolean} proficient - Indica si el personaje tiene competencia en esta tirada.
 * @property {() => void} [onPress] - Función callback opcional que se ejecuta al pulsar el elemento.
 */
interface SavingThrowItemProps {
    name: string;
    mod: string;
    proficient: boolean;
    onPress?: () => void;
}

/**
 * Elemento de Tirada de Salvación (SavingThrowItem).
 * 
 * Componente de interfaz interactivo que renderiza una estadística individual de 
 * tirada de salvación. Muestra visualmente la competencia mediante un indicador 
 * circular dinámico, el nombre de la característica y su modificador asociado.
 * 
 * Incorpora retroalimentación háptica nativa para confirmar la interacción táctil 
 * antes de delegar la ejecución lógica (como solicitar una tirada de dados) 
 * a la función proporcionada por el componente padre.
 * 
 * @param {SavingThrowItemProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un bloque interactivo estilizado para la tirada de salvación.
 */
const SavingThrowItem = ({ name, mod, proficient, onPress }: SavingThrowItemProps) => {

  /**
   * Intercepta la interacción táctil para proporcionar respuesta física
   * antes de invocar la lógica de negocio delegada.
   */
  const handlePress = () => {
    // Genera una vibración física tipo "Heavy" para confirmar la acción táctil
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (onPress) {
      onPress();
    }
  };

  return (
   <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.7} 
      className="w-[48%] flex-row items-center justify-between bg-background p-3 rounded-xl mb-2.5 border border-background-100"
    >                        
        <View className="flex-row items-center gap-2">
            {/* Indicador visual de competencia (Proficiency Dot) */}
            <View 
              className={`w-3 h-3 rounded-full border border-primary ${
                  proficient ? 'bg-primary' : ''
              }`} 
            />
            <Text className="text-white font-roboto-bold text-sm">
              {name}
            </Text>
        </View>

        {/* Modificador numérico */}
        <Text className="text-primary font-roboto-bold text-sm">
            {mod}
        </Text>
    </TouchableOpacity>
  )
}

export default SavingThrowItem;