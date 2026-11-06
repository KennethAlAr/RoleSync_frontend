import { View, Text, TextInput } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useNumericInput } from '@/hooks/useNumericInput';

import { colors } from '@/constants/theme';

/**
 * Propiedades esperadas para el componente StatInputBar.
 * 
 * @interface StatInputBarProps
 * @property {number} value - El valor numérico actual de la estadística (ej. HP actual).
 * @property {number} [maxValue] - (Opcional) El límite máximo de la estadística.
 * @property {(val: number) => void} onChangeText - Callback que emite el valor numérico tras ser validado.
 * @property {string} innerColor1 - Color inicial para el gradiente de la barra de llenado.
 * @property {string} innerColor2 - Color final para el gradiente de la barra de llenado.
 */
interface StatInputBarProps {
  value: number;
  maxValue?: number;
  onChangeText: (val: number) => void;
  innerColor1: string;
  innerColor2: string;
}

/**
 * Barra Interactiva de Estadísticas (StatInputBar).
 * 
 * Componente visual de interfaz que combina la representación 
 * gráfica de barras de progreso dinámicas con un campo numérico editable.
 * 
 * Delega la validación de entrada, sanitización de caracteres y gestión del estado del texto 
 * al hook genérico `useNumericInput`. Su responsabilidad principal es el renderizado 
 * condicional de la geometría de las barras y la representación de gradientes en función 
 * del estado y del valor máximo proporcionado.
 * 
 * @param {StatInputBarProps} props - Propiedades del componente.
 * @returns {JSX.Element} Barra de estado visual con campo de entrada numérico centrado.
 */
const StatInputBar = ({ 
  value, 
  maxValue, 
  onChangeText, 
  innerColor1,
  innerColor2
}: StatInputBarProps) => {
  
  const { textValue, handleTextChange, handleBlur } = useNumericInput(value, maxValue, onChangeText);

  const percentage = maxValue ? Math.min(Math.max((value / maxValue) * 100, 0), 100) : 0;
  const isTempHpActive = maxValue === undefined && value > 0;

  return (
    <View className="flex-1 bg-black/50 border border-primary h-10 rounded-xl overflow-hidden relative justify-center">
      
      {maxValue !== undefined && (
        <View 
          style={{ width: `${percentage}%` }}
          className="absolute left-0 top-0 bottom-0 overflow-hidden"
        >
          <LinearGradient
            colors={[innerColor1, innerColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
          >
            <View 
              style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }} 
              className="absolute inset-0 border-t-[3px] border-l-[3px] border-white/25 pointer-events-none" 
            />
          </LinearGradient>
        </View>
      )}

      {isTempHpActive && (
        <View className="absolute inset-0 flex-row gap-1 p-1 overflow-hidden">
          {value > 20 ? (
            <View className="flex-1 h-full rounded-md overflow-hidden relative">
              <LinearGradient
                colors={[innerColor1, innerColor2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
              <View className="absolute inset-0 border-t-[2px] border-l-[2px] border-white/35 rounded-md pointer-events-none" />
            </View>
          ) : (
            Array.from({ length: value }).map((_, index) => (
              <View 
                key={index} 
                className="flex-1 h-full rounded-md overflow-hidden relative"
              >
                <LinearGradient
                  colors={[innerColor1, innerColor2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
                <View className="absolute inset-0 border-t-[2px] border-l-[2px] border-white/35 rounded-md pointer-events-none" />
              </View>
            ))
          )}
        </View>
      )}

      <View className="flex-row items-center justify-center relative z-10 px-3 w-full">
        <TextInput 
          keyboardType="numeric"
          value={textValue}
          placeholder="0"
          placeholderTextColor={colors.white}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          selectTextOnFocus={true}
          className="text-white font-roboto-bold text-lg text-center p-0"
        />
        
        {maxValue !== undefined && (
          <Text className="text-primary font-roboto-regular text-sm ml-1">
            / {maxValue}
          </Text>
        )}
      </View>

    </View>
  );
};

export default StatInputBar;