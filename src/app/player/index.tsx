import { ScrollView } from 'react-native';

import PlayerInfoSection from '@/components/player/PlayerInfoSection';
import HealthSection from '@/components/player/HealthSection';
import SavingThrowsSection from '@/components/player/SavingThrowsSection';

const PlayerScreen = () => {
  return (
    <ScrollView className="flex-1 px-4 mt-11 py-6">
      
      <PlayerInfoSection />

      <HealthSection />      

      <SavingThrowsSection />

    </ScrollView>
  )
}

export default PlayerScreen