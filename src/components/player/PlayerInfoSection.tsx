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

      <View className="items-center">

        <View className="relative h-72 w-72">
          <View className="h-full w-full rounded-full overflow-hidden shadow-lg">
            <Image 
              source={avatarImage}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View
            className={'absolute right-6 top-6 z-20 h-10 w-10 rounded-full border-2 border-primary bg-green-500'}
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