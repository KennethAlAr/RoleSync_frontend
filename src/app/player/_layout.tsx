import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { router, Slot } from 'expo-router';

// Ya no importamos ConnectionOverlay, todo pasa por CustomAlert
import CustomAlert from '@/components/shared/CustomAlert';
import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

const PlayerLayout = () => {
  const { status, setStatus, setAuthStatus, isFoundryOnline } = useConnectionStore();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Interceptamos el botón físico de "atrás" en Android para pedir confirmación
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

  // Función 1: Salir queriendo (Desvincular)
  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);

    useCharacterStore.getState().setUserInfo({
      worldId: '',
      characterId: '',
    });

    await socketManager.logout();
    setAuthStatus('unauthenticated');
    router.replace('/home');
  };

  // Función 2: Rendirse al perder la conexión
  const handleCancelOverlay = () => {
    setStatus('connected');
    socketManager.disconnect();
    setAuthStatus('unauthenticated');
    router.replace('/home');
  };

  // Función 3: Reintentar conexión del móvil
  const handleRetryOverlay = async () => {
    setStatus('reconnecting');
    const reconnected = await socketManager.connectWithToken();

    if (reconnected) {
      setStatus('connected');
    } else {
      setStatus('failed');
    }
  };

  // ==========================================
  // JERARQUÍA DE ALERTAS (Para evitar superposiciones)
  // ==========================================
  
  // 1. Prioridad Máxima: El móvil ha perdido la conexión con el servidor (tu internet).
  const isNetworkError = status !== 'connected';
  
  // 2. Prioridad Media: El móvil tiene internet, pero Foundry se ha caído o está en F5.
  const isFoundryError = !isFoundryOnline && !isNetworkError;
  
  // 3. Prioridad Baja: El usuario intenta salir manualmente.
  const isLogoutIntent = showLogoutAlert && !isNetworkError && !isFoundryError;

  return (
    <View className="flex-1">
      <Slot />

      {/* CASO 1: PÉRDIDA DE RED DEL MÓVIL (Sustituye al antiguo ConnectionOverlay) */}
      <CustomAlert
        visible={isNetworkError}
        title={status === 'reconnecting' ? "Reconectando..." : "Error de Conexión"}
        message={status === 'reconnecting' 
          ? "Intentando recuperar la conexión con el servidor..." 
          : "Se ha perdido la conexión de tu móvil con el servidor principal."}
        isLoading={status === 'reconnecting'}
        confirmText={status === 'failed' ? 'Reintentar' : undefined} 
        cancelText="Salir al menú"
        onConfirm={handleRetryOverlay}
        onCancel={handleCancelOverlay}
      />

      {/* CASO 2: FOUNDRY SE DESCONECTA (F5 o cierre del máster) */}
      <CustomAlert
        visible={isFoundryError}
        title="Esperando a Foundry..."
        message="El servidor de Foundry se ha desconectado o el máster está recargando la página. La conexión se restablecerá automáticamente."
        isLoading={true}
        // Fíjate que NO le pasamos confirmText, por lo que el BasicButton no se renderiza.
        // Solo saldrá el enlace secundario abajo para salir.
        cancelText="Salir de la partida"
        onCancel={handleCancelOverlay}
      />

      {/* CASO 3: DESVINCULAR PERSONAJE (Botón atrás) */}
      <CustomAlert
        visible={isLogoutIntent}
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