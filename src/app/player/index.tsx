import { View, ScrollView } from 'react-native';

import PlayerInfoSection from '@/components/player/PlayerInfoSection';
import HealthSection from '@/components/player/HealthSection';
import SavingThrowsSection from '@/components/player/SavingThrowsSection';
import PlayerHeader from '@/components/player/PlayerHeader';

/**
 * Pantalla del Dashboard Principal del Jugador (PlayerScreen).
 * 
 * Este es un componente de composición (Composition Component) que actúa como el 
 * lienzo principal una vez que el usuario se ha autenticado y conectado a la partida.
 * 
 * Delega toda la lógica de negocio (vida, tiradas, atributos) a sub-componentes 
 * especializados, manteniendo este archivo limpio y enfocado puramente en la 
 * maquetación (Layout) y la experiencia de desplazamiento (Scroll UX).
 *
 * @returns {JSX.Element} La vista principal del personaje con scroll vertical.
 */
const PlayerScreen = () => {
  return (
    <View className="flex-1">
      {/* 
        El PlayerHeader se renderiza FUERA del ScrollView intencionalmente.
        Esto lo convierte en un elemento fijo (Sticky/Floating) en la capa superior (z-index),
        garantizando que el botón de desvincular esté siempre accesible aunque el 
        usuario haga scroll hacia abajo.
      */}
      <PlayerHeader />

      {/* 
        Contenedor principal con scroll fluido.
        Se aplica un padding-top (pt-12) para actuar como "Safe Area" manual,
        evitando que el contenido colisione o se solape con la barra de estado del 
        sistema operativo (reloj, batería, cobertura, notch) en la parte superior.
      */}
      <ScrollView className="flex-1 px-4 pt-4 pb-4" showsVerticalScrollIndicator={false}>
        
        {/* Sección de identidad, avatar, armadura (AC), tirada de iniciativa, velocidad y competencia */}
        <PlayerInfoSection />
        
        {/* Sección de control de puntos de golpe (HP) actuales, máximos y temporales*/}
        <HealthSection />      
        
        {/* Grid de tiradas de salvación con indicadores de competencia */}
        <SavingThrowsSection />
        
      </ScrollView>
    </View>
  );
};

export default PlayerScreen;