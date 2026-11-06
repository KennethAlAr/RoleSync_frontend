import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { useRouter } from 'expo-router';

import BasicButton from '@/components/shared/BasicButton';
import BasicTextInput from '@/components/shared/BasicTextInput';
import CustomAlert from '@/components/shared/CustomAlert';
import SecondaryLink from '@/components/shared/SecondaryLink';

import { socketManager } from '@/services/SocketManagerService';

import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';

/**
 * Pantalla principal de inicio de sesión de RoleSync.
 * 
 * Permite al jugador conectarse a su partida en Foundry VTT mediante dos métodos:
 * 1. Escaneando un código QR (redirige a la pantalla de escáner).
 * 2. Introduciendo manualmente un código OTP de 6 dígitos.
 * 
 * Gestiona la validación de entrada, la llamada al servicio de conexión por WebSocket,
 * y la actualización del estado global (Zustand) tras una autenticación exitosa.
 *
 * @returns {JSX.Element} La interfaz de usuario renderizada para la pantalla de inicio.
 */
const HomeScreen = () => {
  const router = useRouter();
  
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /** 
   * @type {Object} alertConfig
   * @property {boolean} visible - Controla si la alerta se muestra en pantalla.
   * @property {string} title - El título principal del error o aviso.
   * @property {string} message - La descripción detallada del error.
   */
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const inputRef = useRef<TextInput>(null);

  /**
   * Efecto que mejora la Experiencia de Usuario (UX).
   * Cuando el usuario decide insertar el código manualmente (`showInput` = true),
   * despliega y pone el foco automáticamente en el teclado numérico.
   */
  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  /**
   * Cierra la alerta configurando `visible` a false.
   * Mantiene el título y mensaje actuales intactos para evitar un parpadeo de texto
   * vacío mientras dura la animación de desvanecimiento (fade-out).
   */
  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  /**
   * Valida y envía el código OTP introducido por el usuario al servidor de Render.
   * 
   * Flujo de ejecución:
   * 1. Valida mediante Expresión Regular que el código sea de exactamente 6 números.
   * 2. Bloquea la UI (`isProcessing`) para evitar múltiples envíos.
   * 3. Llama a `socketManager.connectWithOtp(otp)` para canjear el código.
   * 4. En caso de ÉXITO: Guarda las credenciales en Zustand y redirige a `/player`.
   * 5. En caso de ERROR: Levanta un `CustomAlert` mostrando el motivo del rechazo.
   * 
   * @async
   * @returns {Promise<void>} No retorna nada directamente, maneja las redirecciones y estados internamente.
   */
  const handleSendCode = async () => {
    const otp = code.trim();
    if (!otp) return;

    // Validación por Regex: exige que el string contenga del principio al fin (^) 6 dígitos (\d{6}) ($).
    if (!/^\d{6}$/.test(otp)) {
      setAlertConfig({
        visible: true,
        title: 'Código no válido',
        message: 'El código debe estar compuesto por exactamente 6 números.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await socketManager.connectWithOtp(otp);

      if (response.success && response.worldId && response.characterId) {
        
        // 1. Guardamos la información del jugador en memoria
        useCharacterStore.getState().setUserInfo({
          worldId: response.worldId,
          characterId: response.characterId,
        });

        // 2. Avisamos al layout de que estamos autenticados
        useConnectionStore.getState().setAuthStatus('authenticated');

        // 3. Limpiamos campos y viajamos a la vista principal
        setCode('');
        setShowInput(false);
        router.replace('/player');
      } else {
        // Fallo de token caducado o servidor rechazando el código
        setAlertConfig({
          visible: true,
          title: 'Fallo de conexión',
          message: response.error || 'Código caducado o incorrecto.',
        });
      }
    } catch (error: any) {
      // Fallo de conexión si el servidor de Render está caído o no hay internet
      console.error('Error enviando código manual:', error);
      setAlertConfig({
        visible: true,
        title: 'Excepción detectada',
        message: error?.message || JSON.stringify(error),
      });
    } finally {
      // Pase lo que pase, liberamos el botón para que el usuario pueda volver a intentarlo
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6">      
      <View className="w-full max-w-xs items-center">        

        {!showInput ? (
          <View className="w-full items-center">
            <BasicButton 
              title="Escanear código QR" 
              onPress={() => router.push('/scanner')} 
              className="w-full mb-4"
            />

            <SecondaryLink 
              title="Insertar código manualmente" 
              onPress={() => setShowInput(true)} 
            />
          </View>
        ) : (
          <View className="w-full">
            <BasicTextInput
              ref={inputRef}
              value={code}
              onChangeText={setCode}
              placeholder="Introduce el código de 6 dígitos"
              onSubmitEditing={handleSendCode}
              keyboardType="number-pad"
              editable={!isProcessing}
            />

            <BasicButton 
              title={isProcessing ? "Conectando..." : "Enviar código"} 
              onPress={handleSendCode} 
              disabled={isProcessing}
              className="w-full mb-3"
            />

            <SecondaryLink 
              title="Cancelar" 
              onPress={() => {
                if (isProcessing) return;
                setShowInput(false);
                setCode('');
              }} 
              className="text-center"
            />
          </View>
        )}

      </View>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="Reintentar"
        onConfirm={closeAlert}
      />
    </View>
  );
}

export default HomeScreen;