import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StyleSheet
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

import PlayerInfoSection from '@/components/player/PlayerInfoSection';
import StatCardWrapper from '@/components/player/StatCardWrapper';
import ActionButton from '@/components/player/ActionButton';
import StatInputBar from '@/components/player/StatInputBar';
import HealthSection from '@/components/player/HealthSection';

const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme?.colors as any;

// Datos de prueba (Mock Data)
const MOCK_CHARACTER = {
  name: 'Pibbin Sinsuerte',
  className: 'Artificiero',
  level: 3,
  avatarImage: require('@/assets/images/pibbin_sinsuerte.Token.webp'),
  ac: 17,
  initiative: '+6',
  speed: 30,
  proficiency: '+2',
  maxHp: 25,
  initialHp: 25,
  initialTempHp: 0,
  savingThrows: [
    { name: 'FUE', mod: '-1', proficient: false },
    { name: 'DES', mod: '+1', proficient: false },
    { name: 'CON', mod: '+4', proficient: true },
    { name: 'INT', mod: '+5', proficient: true },
    { name: 'SAB', mod: '+0', proficient: false },
    { name: 'CAR', mod: '+2', proficient: false },
  ],
};

export default function PlayerScreen() {
  const [hp, setHp] = useState<number>(MOCK_CHARACTER.initialHp);
  const [tempHp, setTempHp] = useState<number>(MOCK_CHARACTER.initialTempHp);

  // Handlers para modificar vida
  const modifyHp = (amount: number) => {
    setHp((prev) => Math.max(0, Math.min(MOCK_CHARACTER.maxHp, prev + amount)));
  };

  const modifyTempHp = (amount: number) => {
    setTempHp((prev) => Math.max(0, prev + amount));
  };

  return (
    <ScrollView className="flex-1 px-4 mt-11 py-6">
      
      <PlayerInfoSection
        name={MOCK_CHARACTER.name}
        className= {MOCK_CHARACTER.name}
        level= {MOCK_CHARACTER.level}
        avatarImage= {MOCK_CHARACTER.avatarImage}
        ac= {MOCK_CHARACTER.ac}
        initiative= {MOCK_CHARACTER.initiative}
        proficiency= {MOCK_CHARACTER.proficiency}
        speed= {MOCK_CHARACTER.speed}
      />

      <HealthSection maxHp={MOCK_CHARACTER.maxHp}/>
      

      {/* 5. SECCIÓN DE TIRADAS DE SALVACIÓN (GRUPO 2X3) */}
    <StatCardWrapper backgroundImage={require('@/assets/images/bg-saving-throws.webp')}>

        {/* 3. Contenido interactivo (Tiradas de salvación) */}
        <View className="p-1 relative z-10">
            
            <Text className="text-gray-400 font-roboto-bold text-xs uppercase tracking-wider mb-3 text-center">
            Tiradas de Salvación
            </Text>

            <View className="flex-row flex-wrap justify-between">
            {MOCK_CHARACTER.savingThrows.map((item, index) => (
                <View 
                key={index} 
                className="w-[48%] flex-row items-center justify-between bg-[#1f1f1f] p-3 rounded-xl mb-2.5 border border-gray-800"
                >
                <View className="flex-row items-center gap-2">
                    {/* Indicador de Competencia (Punto lleno / vacío) */}
                    <View 
                    className={`w-3 h-3 rounded-full ${
                        item.proficient 
                        ? 'bg-primary border border-primary' 
                        : 'border border-gray-500'
                    }`} 
                    />
                    <Text className="text-white font-roboto-bold text-sm">
                    {item.name}
                    </Text>
                </View>

                <Text className="text-primary font-roboto-bold text-sm">
                    {item.mod}
                </Text>
                </View>
            ))}
            </View>

        </View>

      </StatCardWrapper>

    </ScrollView>
  );
}