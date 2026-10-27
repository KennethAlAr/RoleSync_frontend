import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import BasicButton from '@/components/shared/BasicButton';
import BasicTextInput from '@/components/shared/BasicTextInput';
import SecondaryLink from '@/components/shared/SecondaryLink';

const HomeScreen = () => {
  const router = useRouter();
  
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  const handleSendCode = () => {
    if (!code.trim()) return;
    console.log("Enviando código manual:", code);
    setCode('');
    setShowInput(false);
  };

  return (
    <View className="flex-1 justify-center items-center p-6">      
      <View className="w-full max-w-xs items-center">        

        {!showInput ? (
          <View className="w-full items-center">
            <BasicButton 
              title="Escanear código QR" 
              onPress={() => {
                router.push('/scanner');
                console.log("Escanear código QR");
              }} 
              className="w-full mb-4"
            />

            <SecondaryLink 
              title="Insertar código manualmente" 
              onPress={() => {
                setShowInput(true);
              }} 
            />
          </View>
        ) : (
          <View className="w-full">
            <BasicTextInput
              ref={inputRef}
              value={code}
              onChangeText={setCode}
              placeholder="Introduce el código..."
              onSubmitEditing={handleSendCode}
            />

            <BasicButton 
              title="Enviar código" 
              onPress={handleSendCode} 
              className="w-full mb-3"
            />

            <SecondaryLink 
              title="Cancelar" 
              onPress={() => {
                setShowInput(false);
                setCode('');
              }} 
              className="text-center"
            />
          </View>
        )}

      </View>
    </View>
  );
}

export default HomeScreen;