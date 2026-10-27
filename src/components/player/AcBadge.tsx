import { ImageBackground, Text } from 'react-native'

interface AcBadgeProps {
  player_ac: number;
}

const AcBadge = ({ player_ac }: AcBadgeProps) => {
  return (
    <ImageBackground
      source={require('@/assets/images/ac-badge.webp')}
      className="absolute -bottom-3 w-14 h-16 items-center justify-center"
      resizeMode="contain"
    >
      <Text className="text-primary font-roboto-bold text-lg pb-1">
      {player_ac}
      </Text>
    </ImageBackground>
  )
}

export default AcBadge