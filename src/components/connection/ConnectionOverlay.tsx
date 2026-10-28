import { ActivityIndicator, Text, View } from 'react-native';

import BasicButton from '@/components/shared/BasicButton';
import SecondaryLink from '@/components/shared/SecondaryLink';

type ConnectionOverlayStatus = 'reconnecting' | 'failed';

interface ConnectionOverlayProps {
  connectionStatus: ConnectionOverlayStatus;
  onCancel: () => void;
  onRetry: () => void;
}

const ConnectionOverlay = ({ connectionStatus, onCancel, onRetry }: ConnectionOverlayProps) => {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center bg-background/70 px-6">
      <View className="w-full max-w-sm items-center rounded-2xl border border-primary bg-background p-6">
        {connectionStatus === 'reconnecting' ? (
            <>
                <ActivityIndicator size="large" color="#90856b" />

                <Text className="mt-4 text-center font-roboto-bold text-xl text-white">
                Se ha perdido la conexión
                </Text>

                <Text className="mt-2 text-center font-roboto-regular text-sm text-secondary">
                Intentando reconectar...
                </Text>

                <BasicButton
                title="Cancelar"
                onPress={onCancel}
                className="mt-4 w-full"
                />
            </>
            ) : (
            <>
                <Text className="text-center font-roboto-bold text-xl text-white">
                No se pudo recuperar la conexión
                </Text>

                <Text className="mt-2 text-center font-roboto-regular text-sm text-secondary">
                Comprueba tu conexión y vuelve a intentarlo
                </Text>

                <BasicButton
                title="Reintentar"
                onPress={onRetry}
                className="my-4 w-full"
                />
                
                <SecondaryLink 
                title="Cancelar" 
                onPress={onCancel} 
                />
            </>
            )}
      </View>
    </View>
  );
};

export default ConnectionOverlay;