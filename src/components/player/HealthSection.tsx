import { useState } from 'react';
import { View, Text } from 'react-native';
import StatCardWrapper from '@/components/player/StatCardWrapper';
import ActionButton from '@/components/player/ActionButton';
import StatInputBar from '@/components/player/StatInputBar';

interface HealthSectionProps {
  maxHp: number;
}

const HealthSection = ({ maxHp }: HealthSectionProps) => {
  const [hp, setHp] = useState<number>(maxHp);
  const [tempHp, setTempHp] = useState<number>(0);

  const modifyHp = (amount: number) => {
    setHp((prev) => {
      const newHp = prev + amount;
      return Math.min(Math.max(newHp, 0), maxHp);
    });
  };

  const modifyTempHp = (amount: number) => {
    setTempHp((prev) => {
      const newTemp = prev + amount;
      return Math.max(newTemp, 0);
    });
  };

  return (
    <StatCardWrapper backgroundImage={require('@/assets/images/bg-healing-bar.webp')}>
      <View className="p-1 relative z-10">
        
        <View className="mb-4">
          <View className="flex-row justify-between mb-1.5 items-center">
            <Text className="text-primary font-roboto-bold text-xs uppercase">
              Puntos de Vida
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <ActionButton
              symbol="-"
              bgColor="bg-primary"
              onPress={() => modifyHp(-1)}
            />

            <StatInputBar
              value={hp}
              maxValue={maxHp}
              onChangeText={(val) => setHp(Math.min(Math.max(val, 0), maxHp))}
              innerColor2="#3aa35c"
              innerColor1="#1c4d2a"
            />

            <ActionButton
              symbol="+"
              bgColor="bg-primary"
              onPress={() => modifyHp(1)}
            />
          </View>
        </View>

        <View>
          <Text className="text-primary font-roboto-bold text-xs uppercase mb-1.5">
            Puntos de Vida Temporales
          </Text>

          <View className="flex-row items-center gap-3">
            <ActionButton
              symbol="-"
              bgColor="bg-primary"
              onPress={() => modifyTempHp(-1)}
            />

            <StatInputBar
              value={tempHp}
              onChangeText={(val) => setTempHp(Math.max(val, 0))}
              innerColor2="#6292e8"
              innerColor1="#283c5f"
            />

            <ActionButton
              symbol="+"
              bgColor="bg-primary"
              onPress={() => modifyTempHp(1)}
            />
          </View>
        </View>

      </View>
    </StatCardWrapper>
  );
};

export default HealthSection;