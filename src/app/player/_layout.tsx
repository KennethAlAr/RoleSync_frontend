import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';

import { router, Slot } from 'expo-router';

import CustomAlert from '@/components/shared/CustomAlert';
import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

/**
 * Layout principal de la interfaz del Jugador (Player).
 * 
 * Actúa como un contenedor (Wrapper) para todas las rutas secundarias del jugador,
 * inyectando mediante `<Slot />` la vista correspondiente. 
 * 
 * Su responsabilidad principal es la ORQUESTACIÓN DEL ESTADO GLOBAL DE CONEXIÓN,
 * interceptando cualquier fallo de red o caída del servidor de Foundry VTT para 
 * mostrar alertas de alta prioridad que bloqueen la UI (Evitando interacciones fantasma).
 *
 * @returns {JSX.Element} El contenedor principal con el sistema de alertas superpuesto.
 */
const PlayerLayout = () => {
  const { status, setStatus, setAuthStatus, isFoundryOnline } = useConnectionStore();
  
  /** 
   * @type {boolean} showLogoutAlert - Controla si el usuario ha solicitado salir de la partida manualmente.
   */
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  /**
   * Efecto de ciclo de vida para interceptar el botón físico "Atrás" nativo de Android.
   * Mejora la UX previniendo que un toque accidental expulse al jugador de la partida
   * y le obligue a volver a escanear el QR.
   */
  useEffect(() => {
    const onBackPress = () => {
      setShowLogoutAlert(true);
      return true; // Previene la navegación de retroceso por defecto del sistema operativo
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  /**
   * Ejecuta la desvinculación intencional del jugador.
   * 1. Limpia los datos del personaje del estado global (Zustand).
   * 2. Revoca la sesión en el servidor y cierra el socket.
   * 3. Redirige al menú principal.
   * 
   * @async
   * @returns {Promise<void>}
   */
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

  /**
   * Manejador de rendición ante fallos de red.
   * Se dispara cuando el usuario cancela un intento de reconexión y decide volver al menú.
   * Limpia el estado de autenticación y destruye el socket activo.
   */
  const handleCancelOverlay = () => {
    setStatus('connected'); // Resetea el estado visual para futuras conexiones
    socketManager.disconnect();
    setAuthStatus('unauthenticated');
    router.replace('/home');
  };

  /**
   * Intenta forzar una reconexión manual hacia el servidor.
   * Actualiza el estado visual a 'reconnecting' para mostrar el spinner,
   * y dependiendo del resultado de `connectWithToken`, restaura la UI o declara fallo.
   * 
   * @async
   * @returns {Promise<void>}
   */
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
  // JERARQUÍA DE ALERTAS (Control de flujo UI)
  // ==========================================
  // Estas constantes booleanas garantizan que las alertas sean mutuamente excluyentes,
  // evitando que múltiples ventanas modales se superpongan en pantalla.
  
  /** @type {boolean} Prioridad Máxima: Fallo del socket del móvil (Sin internet o servidor caído). */
  const isNetworkError = status !== 'connected';
  
  /** @type {boolean} Prioridad Media: El móvil está conectado al servidor, pero Foundry se ha cerrado o recargado. */
  const isFoundryError = !isFoundryOnline && !isNetworkError;
  
  /** @type {boolean} Prioridad Baja: El usuario desea salir (solo se muestra si todo lo demás va bien). */
  const isLogoutIntent = showLogoutAlert && !isNetworkError && !isFoundryError;

  return (
    <View className="flex-1">
      {/* `<Slot />` renderiza el contenido de las pantallas hijas (ej. index.tsx del player) */}
      <Slot />

      {/* CASO 1: PÉRDIDA DE RED DEL MÓVIL */}
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

      {/* CASO 2: FOUNDRY SE DESCONECTA */}
      <CustomAlert
        visible={isFoundryError}
        title="Esperando a Foundry..."
        message="El servidor de Foundry se ha desconectado o el máster está recargando la página. La conexión se restablecerá automáticamente."
        isLoading={true}
        // Al omitir confirmText, CustomAlert oculta automáticamente el botón principal, dejando solo la opción secundaria.
        cancelText="Salir de la partida"
        onCancel={handleCancelOverlay}
      />

      {/* CASO 3: DESVINCULAR PERSONAJE */}
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