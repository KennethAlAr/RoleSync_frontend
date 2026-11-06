import { View, Text, ActivityIndicator } from 'react-native';

import { useCharacterStore } from '@/store/characterStore';
import { savingThrowsService } from '@/services/SavingThrowsService';

import StatCardWrapper from '@/components/player/StatCardWrapper';
import SavingThrowItem from './SavingThrowItem';
import { colors } from '@/constants/theme';

/**
 * Sección de Tiradas de Salvación (SavingThrowsSection).
 * 
 * Componente inteligente responsable de recuperar, estructurar 
 * y renderizar el listado de tiradas de salvación del personaje.
 * 
 * Actúa como orquestador (Controller/View):
 * 1. Lee dinámicamente el array de salvaciones desde el estado global (Zustand).
 * 2. Mapea los datos a componentes de presentación puros (`SavingThrowItem`).
 * 3. Delega la lógica de negocio al servicio especializado `savingThrowsService`.
 * 
 * @returns {JSX.Element} Tarjeta interactiva con la cuadrícula de tiradas de salvación, o indicador de carga.
 */
const SavingThrowsSection = () => {
  // Suscripción reactiva al segmento de tiradas de salvación en el estado global
  const savingThrows = useCharacterStore((state) => state.savingThrows);

  // Renderizado de salvaguarda mientras se sincronizan los datos
  if (!savingThrows || savingThrows.length === 0) {
    return (
      <StatCardWrapper backgroundImage={require('@/assets/images/bg-saving-throws.webp')}>
        <View className="p-4 justify-center items-center">
          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
        </View>
      </StatCardWrapper>
    );
  }

  return (
    <StatCardWrapper backgroundImage={require('@/assets/images/bg-saving-throws.webp')}>
      <View className="p-1 relative z-10">
        
        <Text className="text-primary font-roboto-bold text-xs uppercase tracking-wider mb-3 text-center">
          Tiradas de Salvación
        </Text>

        {/* Contenedor flexible con wrap para crear un layout de cuadrícula (Grid-like) */}
        <View className="flex-row flex-wrap justify-between">
          {savingThrows.map((item) => (
            <SavingThrowItem 
              key={item.name}
              name={item.name}
              mod={item.mod}
              proficient={item.proficient}
              // Delegación del evento de tirada al servicio correspondiente
              onPress={() => savingThrowsService.rollSavingThrow(item.name)}
            />
          ))}
        </View>
        
      </View>
    </StatCardWrapper>
  );
};

export default SavingThrowsSection;