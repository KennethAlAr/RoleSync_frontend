import { Modal, Text, View } from 'react-native';

import BasicButton from './BasicButton';
import SecondaryLink from './SecondaryLink';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void; // Si no se pasa, solo muestra el botón principal
}

const CustomAlert = ({
  visible,
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: CustomAlertProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel || onConfirm} // Maneja el botón físico de "Atrás" en Android
    >
      <View className="flex-1 items-center justify-center bg-background/80 px-6">
        <View className="w-full max-w-sm items-center rounded-2xl border border-primary bg-background p-6 shadow-lg">
          
          <Text className="text-center font-roboto-bold text-xl text-white">
            {title}
          </Text>
          
          <Text className="mt-3 mb-6 text-center font-roboto-regular text-sm text-secondary">
            {message}
          </Text>

          <View className="w-full items-center space-y-3">
            <BasicButton 
              title={confirmText} 
              onPress={onConfirm} 
              className="w-full" 
            />
            
            {onCancel && (
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