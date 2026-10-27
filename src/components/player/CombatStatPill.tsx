import { View, Text, Image } from 'react-native'

interface CombatStatPillProps {
  statNumber: string;
  statName: string;
}

const CombatStatPill = ({ statNumber, statName }: CombatStatPillProps) => {
  return (
    <View className="items-center">
      <View className="w-24 h-12 items-center justify-center relative">
        <Image 
        source={require('@/assets/images/lozenge.png')} 
        className="absolute w-full h-full"
        resizeMode="contain"
        />
        <Text className="text-white font-roboto-bold text-xl">
        {statNumber}
        </Text>
      </View>
      <Text className="text-primary font-roboto-bold text-[11px] tracking-wider uppercase mt-1">
          {statName}
      </Text>
    </View>
  )
}

export default CombatStatPill