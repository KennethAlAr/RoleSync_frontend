import { Modal, Text, View, ActivityIndicator } from 'react-native';

import BasicButton from './BasicButton';
import SecondaryLink from './SecondaryLink';

import { colors } from '@/constants/theme';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void; // 👇 Ahora es opcional (para cuando solo queremos botón de cancelar)
  onCancel?: () => void;
  isLoading?: boolean;    // 👇 Nueva prop para el estado de carga
}

const CustomAlert = ({
  visible,
  title,
  message,
  confirmText, // Quitamos el valor por defecto para poder ocultarlo si no pasas el prop
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isLoading = false,
}: CustomAlertProps) => {
  
  // Manejador seguro para el botón físico de "Atrás" en Android
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
          
          {/* 👇 SPINNER DE CARGA */}
          {isLoading && (
            // Cambia el color por el de tu variable 'primary' si tienes el código HEX a mano
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} className="mb-4" /> 
          )}
          
          <Text className="text-center font-roboto-bold text-xl text-white">
            {title}
          </Text>
          
          <Text className="mt-3 mb-6 text-center font-roboto-regular text-sm text-secondary">
            {message}
          </Text>

          <View className="w-full items-center space-y-3">
            
            {/* 👇 Solo mostramos el BasicButton si le hemos pasado una función onConfirm y un texto */}
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