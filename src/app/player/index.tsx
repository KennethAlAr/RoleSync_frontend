import { ScrollView } from 'react-native';

import PlayerInfoSection from '@/components/player/PlayerInfoSection';
import HealthSection from '@/components/player/HealthSection';
import SavingThrowsSection from '@/components/player/SavingThrowsSection';

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

const PlayerScreen = () => {
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

      <SavingThrowsSection savingThrows={MOCK_CHARACTER.savingThrows}/>

    </ScrollView>
  )
}

export default PlayerScreen