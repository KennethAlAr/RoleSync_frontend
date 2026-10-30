import { View, Text, ActivityIndicator } from 'react-native';
import { useCharacterStore } from '@/store/characterStore';
import { savingThrowsService } from '@/services/SavingThrowsService';
import StatCardWrapper from '@/components/player/StatCardWrapper';
import SavingThrowItem from './SavingThrowItem';

const SavingThrowsSection = () => {
  const savingThrows = useCharacterStore((state) => state.savingThrows);

  if (!savingThrows || savingThrows.length === 0) {
    return (
      <StatCardWrapper backgroundImage={require('@/assets/images/bg-saving-throws.webp')}>
        <View className="p-4 justify-center items-center">
          <ActivityIndicator size="small" color="#d4af37" />
        </View>
      </StatCardWrapper>
    );
  }

  return (
    <StatCardWrapper backgroundImage={require('@/assets/images/bg-saving-throws.webp')}>
      <View className="p-1 relative z-10">
        <Text className="text-primary font-roboto-bold text-xs uppercase tracking-wider mb-3 text-center">
          Tiradas de Salvación
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {savingThrows.map((item) => (
            <SavingThrowItem 
              key={item.name}
              name={item.name}
              mod={item.mod}
              proficient={item.proficient}
              onPress={() => savingThrowsService.rollSavingThrow(item.name)}
            />
          ))}
        </View>
      </View>
    </StatCardWrapper>
  );
};

export default SavingThrowsSection;