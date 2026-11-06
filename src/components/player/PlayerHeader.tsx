import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import CustomAlert from '@/components/shared/CustomAlert';
import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore'; 

import { colors } from '@/constants/theme';

/**
 * Cabecera Flotante del Jugador (PlayerHeader).
 * 
 * Componente de interfaz superpuesto (HUD) que proporciona el punto de salida 
 * de la playerScreen. Se renderiza mediante posicionamiento absoluto en la capa 
 * superior (z-index: 50) para estar siempre accesible independientemente del scroll.
 * 
 * Gestiona el flujo crítico de desvinculación (Logout) de forma segura, 
 * requiriendo confirmación del usuario y limpiando todos los estados globales.
 * 
 * @returns {JSX.Element} Botón flotante superior izquierdo y su modal de confirmación.
 */
const PlayerHeader = () => {
  const router = useRouter();
  
  /** 
   * @type {boolean} Controla la visibilidad del modal de confirmación de salida. 
   */
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  /**
   * Ejecuta la rutina de destrucción de sesión (Teardown).
   * 
   * Flujo de seguridad:
   * 1. Limpia los datos sensibles (IDs) del estado de Zustand.
   * 2. Revoca el token en el almacenamiento local y cierra la conexión WebSocket.
   * 3. Notifica al gestor de rutas cambiando el estado a 'unauthenticated'.
   * 4. Redirige forzosamente a la pantalla raíz.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);

    // 1. Limpiamos los datos del usuario en Zustand
    useCharacterStore.getState().setUserInfo({
      worldId: '',
      characterId: '',
    });

    // 2. Borramos el token persistente y cerramos la conexión de red
    await socketManager.logout();

    // 3. FUNDAMENTAL: Avisamos al estado global para activar el Route Guard
    useConnectionStore.getState().setAuthStatus('unauthenticated');

    // 4. Redirigimos a la raíz (o '/home' dependiendo de la configuración del enrutador)
    router.replace('/');
  };

  return (
    /* Posicionamiento absoluto anclado arriba a la izquierda, por encima del resto de la app (z-50) */
    <View className="absolute top-4 left-4 z-50 mt-4">
      
      {/* 
        Pressable en lugar de TouchableOpacity para un control más fino.
        Incluye etiqueta de accesibilidad para lectores de pantalla.
      */}
      <Pressable
        onPress={() => {
          // Feedback háptico al tratarse de una acción destructiva (salir de la partida)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setShowLogoutAlert(true);
        }}
        className="p-2 rounded-xl bg-background/80 border border-primary/30 active:opacity-70 shadow-md"
        accessibilityLabel="Desvincular personaje"
      >
        <Ionicons name="close" size={24} color={colors.primary.DEFAULT} />
      </Pressable>

      {/* Modal de barrera para evitar salidas accidentales */}
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

export default PlayerHeader;