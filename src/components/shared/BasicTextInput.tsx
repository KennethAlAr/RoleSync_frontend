import { TextInput, TextInputProps } from 'react-native';
import { forwardRef } from 'react';

import { colors } from '@/constants/theme';

/**
 * Propiedades esperadas para el componente BasicTextInput.
 * Extiende TextInputProps de React Native para heredar propiedades estándar 
 * como onChangeText, value, keyboardType o secureTextEntry.
 * 
 * @interface BasicTextInputProps
 * @property {string} [className] - (Opcional) Clases de utilidad de Tailwind (NativeWind) para extender o sobrescribir la estilización por defecto.
 */
interface BasicTextInputProps extends TextInputProps {
  className?: string;
}

/**
 * Campo de Entrada de Texto Base (BasicTextInput).
 * 
 * Componente de interfaz reutilizable que estandariza la captura de 
 * texto en la aplicación aplicando el sistema de diseño global (colores, tipografía y bordes).
 * 
 * Implementa el patrón `forwardRef` de React para permitir que los componentes 
 * padre accedan de forma directa al nodo nativo del `TextInput`.
 * 
 * @param {BasicTextInputProps} props - Propiedades del componente e inyección de atributos nativos (`...props`).
 * @param {React.Ref<TextInput>} ref - Referencia retransmitida hacia el componente nativo subyacente.
 * @returns {JSX.Element} Campo de texto estandarizado e interactivo.
 */
const BasicTextInput = forwardRef<TextInput, BasicTextInputProps>(({className = '', ...props}, ref) => {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.primary[200]}
      returnKeyType='done'
      className={`w-full bg-background-100 border border-primary text-primary py-3.5 px-4 rounded-xl font-roboto-regular mb-4 text-center text-base ${className}`}
      {...props}
    />
  );
});

BasicTextInput.displayName = 'BasicTextInput';

export default BasicTextInput;