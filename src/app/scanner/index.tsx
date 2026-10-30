import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';

import SecondaryLink from '@/components/shared/SecondaryLink';
import { socketManager } from '@/services/SocketManagerService';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const handleQRScanned = ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const parsedData = JSON.parse(data);
      const { roomId, characterId } = parsedData;

      if (!roomId || !characterId) {
        throw new Error('QR incompleto');
      }

      Alert.alert(
        'Ficha Encontrada',
        `¿Deseas conectarte a la sesión?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => setScanned(false),
          },
          {
            text: 'Conectar',
            onPress: () => {
              socketManager.connect({ roomId, characterId });
              router.replace('/player');
            },
          },
        ]
      );
    } catch (error) {
      console.log('Error al procesar el QR:', error);

      Alert.alert(
        'Código QR no válido',
        'El código escaneado no pertenece a una sesión válida de Foundry VTT.',
        [
          {
            text: 'Reintentar',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
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

    </View>
  );
};

export default ScannerScreen;