// src/hooks/useQRScanner.ts
import { useEffect, useState } from 'react';

import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';

import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

/**
 * Custom Hook: useQRScanner
 * 
 * Separa la lógica de negocio (Business Logic) de la capa de presentación (UI).
 * Encapsula la gestión de permisos de hardware, validación de códigos OTP,
 * comunicación con el servidor y actualización del estado global.
 * 
 * @returns Un objeto con el estado de permisos, el estado del escáner y los manejadores.
 */
export const useQRScanner = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar' as string | undefined,
    onConfirm: () => {},
    onCancel: undefined as (() => void) | undefined,
  });

  // Petición de permisos de cámara nativos
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
        onConfirm: resetScanner,
        onCancel: undefined,
        cancelText: undefined,
      });
      return;
    }

    setAlertConfig({
      visible: true,
      title: 'Código Encontrado',
      message: `¿Deseas vincular tu personaje con el código ${otp}?`,
      confirmText: 'Conectar',
      cancelText: 'Cancelar',
      onCancel: resetScanner,
      onConfirm: async () => {
        setAlertConfig((prev) => ({
          ...prev,
          title: 'Conectando...',
          message: 'Verificando con el servidor...',
          confirmText: 'Esperando...',
          onCancel: undefined,
          onConfirm: () => {},
        }));

        try {
          const response = await socketManager.connectWithOtp(otp);

          if (response.success && response.worldId && response.characterId) {
            useCharacterStore.getState().setUserInfo({
              worldId: response.worldId,
              characterId: response.characterId,
            });
            
            useConnectionStore.getState().setAuthStatus('authenticated');
            setAlertConfig((prev) => ({ ...prev, visible: false }));
            router.replace('/player');
          } else {
            setAlertConfig({
              visible: true,
              title: 'Fallo de conexión',
              message: response.error || 'Código caducado o inválido.',
              confirmText: 'Reintentar',
              onConfirm: resetScanner,
              onCancel: undefined,
              cancelText: undefined,
            });
          }
        } catch (error: any) {
          setAlertConfig({
            visible: true,
            title: 'Excepción detectada',
            message: error?.message || JSON.stringify(error),
            confirmText: 'Reintentar',
            onConfirm: resetScanner,
            onCancel: undefined,
            cancelText: undefined,
          });
        }
      },
    });
  };

  return {
    hasPermission,
    scanned,
    alertConfig,
    handleQRScanned,
  };
};