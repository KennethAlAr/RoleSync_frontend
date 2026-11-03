import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import CustomAlert from '@/components/shared/CustomAlert';
import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

const PlayerHeader = () => {
  const router = useRouter();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleConfirmLogout = async () => {
    setShowLogoutAlert(false);

    // Limpiamos los datos del usuario en Zustand
    useCharacterStore.getState().setUserInfo({
      worldId: '',
      characterId: '',
    });

    // Borramos el token y cerramos socket
    await socketManager.logout();
    router.replace('/scanner');
  };

  return (
    <View className="absolute top-4 left-4 z-50">
      <Pressable
        onPress={() => setShowLogoutAlert(true)}
        className="p-2 rounded-xl bg-background/80 border border-primary/30 active:opacity-70 shadow-md"
        accessibilityLabel="Desvincular personaje"
      >
        <Ionicons name="close" size={24} color="#C2B280" /> 
        {/* Cambia el color por el tono exacto de tu primary si difiere */}
      </Pressable>

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