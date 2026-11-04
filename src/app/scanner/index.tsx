import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';

import { useConnectionStore } from '@/store/connectionStore';
import CustomAlert from '@/components/shared/CustomAlert';
import SecondaryLink from '@/components/shared/SecondaryLink';
import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  // Estado para controlar nuestro CustomAlert
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar' as string | undefined,
    onConfirm: () => {},
    onCancel: undefined as (() => void) | undefined,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const resetScanner = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
    setScanned(false);
  };

  const handleQRScanned = ({ data }: { data: string }) => {
    setScanned(true);
    const otp = data.trim();

    if (!/^\d{6}$/.test(otp)) {
      setAlertConfig({
        visible: true,
        title: 'Código QR no válido',
        message: 'El código escaneado no pertenece a Role-Sync (debe ser un OTP de 6 dígitos).',
        confirmText: 'Reintentar',
        cancelText: undefined,
        onConfirm: resetScanner,
        onCancel: undefined,
      });
      return;
    }

    // Modal de confirmación
    setAlertConfig({
      visible: true,
      title: 'Código Encontrado',
      message: `¿Deseas vincular tu personaje con el código ${otp}?`,
      confirmText: 'Conectar',
      cancelText: 'Cancelar',
      onCancel: resetScanner,
      onConfirm: async () => {
        // Actualizamos el modal visualmente para mostrar que está conectando
        setAlertConfig((prev) => ({
          ...prev,
          title: 'Conectando...',
          message: 'Verificando con el servidor...',
          confirmText: 'Esperando...',
          onCancel: undefined, // Quitamos el botón cancelar mientras procesa
          onConfirm: () => {},
        }));

        try {
          const response = await socketManager.connectWithOtp(otp);

          if (response.success && response.worldId && response.characterId) {
            useCharacterStore.getState().setUserInfo({
              worldId: response.worldId,
              characterId: response.characterId,
            });
            
            // LA CLAVE: Avisamos al estado global antes de hacer la redirección
            useConnectionStore.getState().setAuthStatus('authenticated');
            
            setAlertConfig((prev) => ({ ...prev, visible: false }));
            router.replace('/player');
          } else {
            setAlertConfig({
              visible: true,
              title: 'Fallo de conexión',
              message: response.error || 'Código caducado o inválido.',
              confirmText: 'Reintentar',
              cancelText: undefined,
              onConfirm: resetScanner,
              onCancel: undefined,
            });
          }
        } catch (error: any) {
          console.error('Error de red detallado:', error);
          setAlertConfig({
            visible: true,
            title: 'Excepción detectada',
            message: error?.message || JSON.stringify(error),
            confirmText: 'Reintentar',
            cancelText: undefined,
            onConfirm: resetScanner,
            onCancel: undefined,
          });
        }
      },
    });
  };

  if (hasPermission === null) {
    return <View className="flex-1" />;
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-white text-center font-roboto-regular mb-4">
          No tenemos acceso a la cámara.{'\n'} Por favor, actívalo en los ajustes.
        </Text>
        <SecondaryLink
          title="Volver"
          onPress={() => router.back()}
          className="text-center"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6 py-10">
      <View className="w-96 h-96 rounded-2xl overflow-hidden border-2 border-primary shadow-2xl bg-black">
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleQRScanned}
        />
      </View>

      <View className="items-center mt-4">
        <Text className="text-primary font-roboto-bold text-lg text-center tracking-wide">
          Escanear Código QR
        </Text>
        <Text className="text-white font-roboto-regular text-xs text-center mt-1">
          Alinea el código de tu personaje en Foundry VTT
        </Text>
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </View>
  );
};

export default ScannerScreen;