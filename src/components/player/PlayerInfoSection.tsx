import { View, Text, Image, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';

import { FontAwesome6 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useCharacterStore } from '@/store/characterStore';
import { useConnectionStore } from '@/store/connectionStore';
import { playerInfoService } from '@/services/PlayerInfoService';

import AcBadge from '@/components/player/AcBadge';
import CombatStatPill from '@/components/player/CombatStatPill';
import { useCombatAnimation } from '@/hooks/useCombatAnimation';

import { colors } from '@/constants/theme';

/**
 * Sección de Información Principal del Jugador (PlayerInfoSection).
 * 
 * Renderiza el cuadro de mandos principal (HUD) del personaje. Muestra la identidad 
 * (nombre, clase, nivel, avatar), las estadísticas estáticas (Clase de Armadura, 
 * Competencia, Velocidad) y un indicador visual del estado de red.
 * 
 * Gestiona el estado de combate renderizando la estadística de Iniciativa como un 
 * botón interactivo animado cuando el jugador debe realizar una tirada.
 * 
 * @returns {JSX.Element} La cabecera visual de la ficha del personaje.
 */
const PlayerInfoSection = () => {
  const playerInfo = useCharacterStore((state) => state.playerInfo);
  const { status, isFoundryOnline } = useConnectionStore();

  const { pulseAnim, animatedOpacity } = useCombatAnimation(playerInfo?.inCombat);

  if (!playerInfo) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="text-primary mt-4 font-roboto-regular">Sincronizando jugador...</Text>
      </View>
    );
  }

  const { name, className, level, avatarImage, ac, initiative, proficiency, speed, inCombat } = playerInfo;

  let statusColor = "bg-green-500";
  if (status !== 'connected') {
    statusColor = "bg-red-500";
  } else if (!isFoundryOnline) {
    statusColor = "bg-orange-500";
  }

  return (
    <View>
      <View className="items-center mb-2">
        <Text className="text-white font-roboto-bold text-2xl tracking-wide">
          {name}
        </Text>
        <Text className="text-primary-300 font-roboto-regular text-sm mt-0.5">
          {className} - Nivel {level}
        </Text>
      </View>

      <View className="items-center">
        <View className="relative h-72 w-72">
          <View className="h-full w-full rounded-full overflow-hidden shadow-lg">
            <Image 
              source={
                avatarImage 
                  ? { uri: avatarImage } 
                  : require('@/assets/images/web-app-manifest-512x512.png')
              }
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className={`absolute right-6 top-6 z-20 h-10 w-10 rounded-full border-2 border-primary ${statusColor}`} />
        </View>
        <AcBadge player_ac={ac} />
      </View>

      <View className="items-center mb-4">
        <View className="flex-row justify-center gap-36 w-full">
          
          {inCombat ? (
            <Animated.View 
              style={{ transform: [{ scale: pulseAnim }], opacity: animatedOpacity }}
            >
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  playerInfoService.rollInitiative();
                }}
              >
                <CombatStatPill 
                  statNumber={<FontAwesome6 name="dice-d20" size={24} color={colors.glow} />} 
                  statName="Iniciativa"
                /> 
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <CombatStatPill statNumber={initiative} statName="Iniciativa" />
          )}

          <CombatStatPill statNumber={proficiency} statName="Competencia"/>
        </View>
        
        <View className="-mt-8">
          <CombatStatPill statNumber={speed.toString()} statName="Velocidad"/>
        </View>
      </View>
    </View>
  );
};

export default PlayerInfoSection;