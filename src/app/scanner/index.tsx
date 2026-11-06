// src/app/scanner/index.tsx (o tu ruta correspondiente)
import { StyleSheet, Text, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';

import CustomAlert from '@/components/shared/CustomAlert';
import SecondaryLink from '@/components/shared/SecondaryLink';
import { useQRScanner } from '@/hooks/useQRScanner';

/**
 * Pantalla de Escáner QR (Capa de Presentación).
 * 
 * Implementa el patrón de diseño de componentes de presentación.
 * Consume los estados y manejadores proporcionados por el Custom Hook `useQRScanner` 
 * para renderizar dinámicamente la interfaz gráfica de hardware.
 * 
 * Gestiona de forma reactiva tres estados visuales principales:
 * 1. Pantalla de carga mientras el sistema operativo evalúa los permisos.
 * 2. Vista alternativa si los permisos de hardware son denegados.
 * 3. Visor óptico de la cámara y sistema de modales interactivos para el proceso de vinculación.
 * 
 * @returns {JSX.Element} Interfaz gráfica del escáner y alertas asociadas.
 */
const ScannerScreen = () => {
  const router = useRouter();
  
  // Consumo del Custom Hook que expone la lógica de negocio
  const { hasPermission, scanned, alertConfig, handleQRScanned } = useQRScanner();

  // 1. Estado visual de carga: Negociando permisos
  if (hasPermission === null) {
    return <View className="flex-1" />;
  }

  // 2. Estado visual de error: Permisos denegados
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

  // 3. Estado visual principal: Renderizado de la cámara
  return (
    <View className="flex-1 justify-center items-center p-6 py-10">
      
      <View className="w-96 h-96 rounded-2xl overflow-hidden border-2 border-primary shadow-2xl bg-black">
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
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