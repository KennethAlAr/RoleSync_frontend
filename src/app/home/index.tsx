import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import BasicButton from '@/components/shared/BasicButton';
import BasicTextInput from '@/components/shared/BasicTextInput';
import CustomAlert from '@/components/shared/CustomAlert';
import SecondaryLink from '@/components/shared/SecondaryLink';

import { socketManager } from '@/services/SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

const HomeScreen = () => {
  const router = useRouter();
  
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estado para controlar el CustomAlert
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  const handleSendCode = async () => {
    const otp = code.trim();
    if (!otp) return;

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
        useCharacterStore.getState().setUserInfo({
          worldId: response.worldId,
          characterId: response.characterId,
        });

        setCode('');
        setShowInput(false);
        router.replace('/player');
      } else {
        setAlertConfig({
          visible: true,
          title: 'Fallo de conexión',
          message: response.error || 'Código caducado o incorrecto.',
        });
      }
    } catch (error: any) {
      console.error('Error enviando código manual:', error);
      setAlertConfig({
        visible: true,
        title: 'Excepción detectada',
        message: error?.message || JSON.stringify(error),
      });
    } finally {
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

      {/* Insertamos el CustomAlert al final del componente */}
      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={closeAlert}
      />
    </View>
  );
}

export default HomeScreen;