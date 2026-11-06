import { View, Text, ActivityIndicator } from 'react-native';

import { useCharacterStore } from '@/store/characterStore';
import { healthInfoService } from '@/services/HealthInfoService';

import StatCardWrapper from '@/components/player/StatCardWrapper';
import ActionButton from '@/components/player/ActionButton';
import StatInputBar from '@/components/player/StatInputBar';

import { colors } from '@/constants/theme';

/**
 * Sección de Salud del Jugador (HealthSection).
 * 
 * Componente inteligente encargado de renderizar y gestionar 
 * la interfaz de los puntos de golpe (HP) actuales, máximos y temporales del personaje.
 * 
 * Arquitectónicamente, actúa como un puente (Controller/View):
 * 1. Lee reactivamente el estado de salud desde el gestor global (Zustand).
 * 2. Delega cualquier modificación (sumar/restar vida, edición manual) al 
 *    servicio especializado `healthInfoService`, manteniendo este componente
 *    libre de lógica de negocio o cálculos matemáticos.
 * 
 * @returns {JSX.Element} La tarjeta interactiva de gestión de vida, o un indicador de carga.
 */
const HealthSection = () => {
  // Suscripción reactiva parcial al estado global para evitar renderizados innecesarios
  const healthInfo = useCharacterStore((state) => state.healthInfo);

  // Renderizado de salvaguarda mientras llegan los datos del socket
  if (!healthInfo) {
    return (
      <StatCardWrapper backgroundImage={require('@/assets/images/bg-healing-bar.webp')}>
        <View className="p-4 justify-center items-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      </StatCardWrapper>
    );
  }

  // Desestructuración de la carga útil (Payload)
  const { hp, maxHp, tempHp } = healthInfo;

  return (
    <StatCardWrapper backgroundImage={require('@/assets/images/bg-healing-bar.webp')}>
      <View className="p-1 relative z-10">
        
        {/* BLOQUE 1: Gestión de Puntos de Vida Base (HP) */}
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
            
            {/* Barra de estado con capacidad de entrada manual (Input Text) */}
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

        {/* BLOQUE 2: Gestión de Puntos de Vida Temporales (Temp HP) */}
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
            
            {/* 
              La barra de HP temporal no tiene maxValue fijo (depende del hechizo/habilidad),
              y utiliza una paleta de colores distinta (cyan/azul) definida en el tema global.
            */}
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