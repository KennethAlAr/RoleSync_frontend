import { View, ScrollView } from 'react-native';

import PlayerInfoSection from '@/components/player/PlayerInfoSection';
import HealthSection from '@/components/player/HealthSection';
import SavingThrowsSection from '@/components/player/SavingThrowsSection';
import PlayerHeader from '@/components/player/PlayerHeader';

const PlayerScreen = () => {
  return (
    <View className="flex-1">
      {/* Botón flotante superior izquierdo */}
      <PlayerHeader />

      {/* Contenido con scroll (añadimos pt-16 para que la X no tape el contenido del principio) */}
      <ScrollView className="flex-1 px-4 pt-12 pb-24" showsVerticalScrollIndicator={false}>
        <PlayerInfoSection />
        <HealthSection />      
        <SavingThrowsSection />
      </ScrollView>
    </View>
  );
};

export default PlayerScreen;