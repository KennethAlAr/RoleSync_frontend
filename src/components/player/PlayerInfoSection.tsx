import { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import { useCharacterStore } from '@/store/characterStore';
import { playerInfoService } from '@/services/PlayerInfoService';

import AcBadge from '@/components/player/AcBadge';
import CombatStatPill from '@/components/player/CombatStatPill';

import { colors } from '@/constants/theme';

const PlayerInfoSection = () => {
  const playerInfo = useCharacterStore((state) => state.playerInfo);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (playerInfo?.inCombat) {
      // Si está en combate, iniciamos el bucle de latido
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15, // Crece un 8%
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1, // Vuelve al tamaño original
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Si no está en combate, detenemos/reseteamos la animación
      pulseAnim.setValue(1);
    }
  }, [playerInfo?.inCombat]);

  if (!playerInfo) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color="#d4af37" />
        <Text className="text-primary mt-4 font-roboto-regular">Sincronizando jugador...</Text>
      </View>
    );
  }

  const { name, className, level, avatarImage, ac, initiative, proficiency, speed, inCombat } = playerInfo;

  // Si está en combate (activo para tirar), hacemos que la opacidad palpite entre 0.85 y 1.2 (más brillante)
  // Si NO está en combate, se queda estricta y normalmente en 1.
  const animatedOpacity = inCombat
    ? pulseAnim.interpolate({
        inputRange: [1, 1.15],
        outputRange: [0.5, 1], // Al latir, pasa de un tono normal a full brillo
      })
    : 1; // Normal por defecto

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
          <View className="absolute right-6 top-6 z-20 h-10 w-10 rounded-full border-2 border-primary bg-green-500" />
        </View>
        <AcBadge player_ac={ac} />
      </View>

      <View className="items-center mb-4">
        <View className="flex-row justify-center gap-36 w-full">
          {inCombat ? (
            <Animated.View 
              style={{ 
                transform: [{ scale: pulseAnim }],
                opacity: animatedOpacity 
              }}
            >
              <TouchableOpacity 
                onPress={() => {
                  if (inCombat) {
                    playerInfoService.rollInitiative();
                  } else {
                    console.log("Aún no estás en combate para tirar iniciativa");
                  }
                }}
              >
                <CombatStatPill statNumber={<FontAwesome6 name="dice-d20" size={24} color={colors.glow} />} statName="Iniciativa"/> 
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