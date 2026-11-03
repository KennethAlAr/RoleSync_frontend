import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { router, Slot } from 'expo-router';

import ConnectionOverlay from '@/components/connection/ConnectionOverlay';
import CustomAlert from '@/components/shared/CustomAlert';
import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

const PlayerLayout = () => {
  const { status, setStatus } = useConnectionStore();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Interceptamos el botón físico de "atrás" en Android/gesto para pedir confirmación
  useEffect(() => {
    const onBackPress = () => {
      setShowLogoutAlert(true);
      return true; // Previene la navegación por defecto
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);

    useCharacterStore.getState().setUserInfo({
      worldId: '',
      characterId: '',
    });

    await socketManager.logout();
    router.replace('/home');
  };

  const handleCancelOverlay = () => {
    setStatus('connected');
    socketManager.disconnect();
    router.replace('/home');
  };

  const handleRetryOverlay = async () => {
    setStatus('reconnecting');
    const reconnected = await socketManager.connectWithToken();

    if (reconnected) {
      setStatus('connected');
    } else {
      setStatus('failed');
    }
  };

  return (
    <View className="flex-1">
      <Slot />

      {/* Overlay de reconexión por pérdida de red */}
      {status !== 'connected' && (
        <ConnectionOverlay
          connectionStatus={status}
          onCancel={handleCancelOverlay}
          onRetry={handleRetryOverlay}
        />
      )}

      {/* Alerta de confirmación al intentar salir */}
      <CustomAlert
        visible={showLogoutAlert}
        title="Desvincular personaje"
        message="¿Estás seguro de que quieres salir? Tendrás que volver a escanear el código QR para entrar."
        confirmText="Desvincular"
        cancelText="Cancelar"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutAlert(false)}
      />
    </View>
  );
};

export default PlayerLayout;