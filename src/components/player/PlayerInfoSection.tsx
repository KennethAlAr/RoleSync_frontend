import { View, Text, Image } from 'react-native'

import AcBadge from '@/components/player/AcBadge';
import CombatStatPill from '@/components/player/CombatStatPill';

interface PlayerInfoSectionProps{
	name: string;
	className: string;
	level: number;
	avatarImage: any;
	ac: number;
	initiative: string;
	proficiency: string;
	speed: number;
}

const PlayerInfoSection = ({name, className, level, avatarImage, ac, initiative, proficiency, speed}: PlayerInfoSectionProps) => {
  return (
		<View>
			<View className="items-center mb-2">
				<Text className="text-white font-roboto-bold text-2xl tracking-wide">
					{name}
				</Text>
				<Text className="text-primary-300 font-roboto-regular text-sm mt-0.5">
					{className} • Nivel {level}
				</Text>
			</View>

      <View className="items-center relative">
        <View className="w-72 h-72 rounded-full border-0 overflow-hidden shadow-lg">
          <Image 
            source={avatarImage}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <AcBadge player_ac={ac} />
      </View>

      <View className="items-center mb-4">
        
        <View className="flex-row justify-center gap-36 w-full">
          <CombatStatPill statNumber={initiative} statName="Iniciativa"/>
          <CombatStatPill statNumber={proficiency} statName="Competencia"/>
        </View>

        <View className="-mt-8">
          <CombatStatPill statNumber={speed.toString()} statName="Velocidad"/>
        </View>
        
      </View>
		</View>
  )
}

export default PlayerInfoSection