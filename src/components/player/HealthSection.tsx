import { View, Text, ActivityIndicator } from 'react-native';

import { useCharacterStore } from '@/store/characterStore';
import { healthInfoService } from '@/services/HealthInfoService';

import StatCardWrapper from '@/components/player/StatCardWrapper';
import ActionButton from '@/components/player/ActionButton';
import StatInputBar from '@/components/player/StatInputBar';

import { colors } from '@/constants/theme';

const HealthSection = () => {
  const healthInfo = useCharacterStore((state) => state.healthInfo);

  if (!healthInfo) {
    return (
      <StatCardWrapper backgroundImage={require('@/assets/images/bg-healing-bar.webp')}>
        <View className="p-4 justify-center items-center">
          <ActivityIndicator size="small" color="#d4af37" />
        </View>
      </StatCardWrapper>
    );
  }

  const { hp, maxHp, tempHp } = healthInfo;

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
              onPress={() => healthInfoService.modifyHp(-1)}
            />
            <StatInputBar
              value={hp}
              maxValue={maxHp}
              onChangeText={(val) => healthInfoService.setHp(val)}
              innerColor1={colors.healthBar.primary}
              innerColor2={colors.healthBar.secondary}
            />
            <ActionButton
              symbol="+"
              bgColor="bg-primary"
              onPress={() => healthInfoService.modifyHp(1)}
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
              onPress={() => healthInfoService.modifyTempHp(-1)}
            />
            <StatInputBar
              value={tempHp}
              onChangeText={(val) => healthInfoService.setTempHp(val)}
              innerColor1={colors.tempHealthBar.primary}
              innerColor2={colors.tempHealthBar.secondary}
            />
            <ActionButton
              symbol="+"
              bgColor="bg-primary"
              onPress={() => healthInfoService.modifyTempHp(1)}
            />
          </View>
        </View>

      </View>
    </StatCardWrapper>
  );
};

export default HealthSection;