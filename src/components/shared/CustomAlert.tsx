import { Modal, Text, View, ActivityIndicator } from 'react-native';

import BasicButton from './BasicButton';
import SecondaryLink from './SecondaryLink';

import { colors } from '@/constants/theme';

/**
 * Propiedades esperadas para el componente CustomAlert.
 * 
 * @interface CustomAlertProps
 * @property {boolean} visible - Controla la renderización y visibilidad del modal superpuesto.
 * @property {string} title - Título principal de la alerta.
 * @property {string} message - Cuerpo descriptivo del mensaje.
 * @property {string} [confirmText] - (Opcional) Texto para el botón de acción principal.
 * @property {string} [cancelText] - (Opcional) Texto para el botón de acción secundaria o descarte.
 * @property {() => void} [onConfirm] - (Opcional) Callback ejecutado al pulsar la acción principal.
 * @property {() => void} [onCancel] - (Opcional) Callback ejecutado al pulsar la acción secundaria.
 * @property {boolean} [isLoading] - (Opcional) Determina si se renderiza un indicador de carga (spinner).
 */
interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void; 
  onCancel?: () => void;
  isLoading?: boolean;    
}

/**
 * Alerta Modal Personalizada.
 * 
 * Componente de interfaz diseñado para unificar la presentación de avisos, diálogos
 * de confirmación y estados de bloqueo por red en toda la aplicación.
 * 
 * Implementa renderizado condicional de sus elementos interactivos: permite configurar 
 * alertas informativas de un solo botón, diálogos de confirmación binarios, o modales 
 * de carga bloqueantes.
 * 
 * Gestiona de forma nativa la interacción con el botón físico "Atrás" en dispositivos 
 * Android para prevenir inconsistencias en el estado de navegación.
 * 
 * @param {CustomAlertProps} props - Propiedades del componente.
 * @returns {JSX.Element} Pantalla modal superpuesta con transiciones nativas.
 */
const CustomAlert = ({
  visible,
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isLoading = false,
}: CustomAlertProps) => {
  
  /**
   * Manejador de interrupción nativa.
   * Intercepta la pulsación del botón de retroceso del sistema operativo Android.
   * Prioriza la ejecución de la acción de descarte (Cancel) si existe,
   * o en su defecto la acción de confirmación (Confirm) para garantizar que 
   * el flujo de la aplicación no se quede bloqueado.
   */
  const handleRequestClose = () => {
    if (onCancel) onCancel();
    else if (onConfirm) onConfirm();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleRequestClose} 
    >
      <View className="flex-1 items-center justify-center bg-background/80 px-6">
        <View className="w-full max-w-sm items-center rounded-2xl border border-primary bg-background p-6 shadow-lg">
          
          {/* Capa de estado de carga: Renderizado condicional del spinner */}
          {isLoading && (
            <ActivityIndicator 
              size="large" 
              color={colors.primary.DEFAULT} 
              className="mb-4" 
            /> 
          )}
          
          <Text className="text-center font-roboto-bold text-xl text-white">
            {title}
          </Text>
          
          <Text className="mt-3 mb-6 text-center font-roboto-regular text-sm text-secondary">
            {message}
          </Text>

          {/* Capa de interacción: Árbol de botones condicionales */}
          <View className="w-full items-center space-y-3">
            
            {onConfirm && confirmText && (
              <BasicButton 
                title={confirmText} 
                onPress={onConfirm} 
                className="w-full" 
              />
            )}
            
            {onCancel && cancelText && (
              <View className="mt-4">
                <SecondaryLink 
                  title={cancelText} 
                  onPress={onCancel} 
                />
              </View>
            )}
            
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;