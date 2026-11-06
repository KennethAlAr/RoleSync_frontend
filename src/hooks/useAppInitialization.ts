import { useEffect } from 'react';

import { useFonts } from 'expo-font';

import { healthInfoService } from '@/services/HealthInfoService';
import { playerInfoService } from '@/services/PlayerInfoService';
import { savingThrowsService } from '@/services/SavingThrowsService';

/**
 * Custom Hook de Inicialización de la Aplicación.
 * 
 * Gestiona la fase de arranque (Bootstrap) de la aplicación, encargándose de dos tareas críticas:
 * 1. Carga de recursos tipográficos asíncronos mediante el hook `useFonts` de Expo.
 * 2. Inicialización de los servicios de dominio del sistema de juego (jugador, salud y tiradas de salvación) 
 *    al montar el componente raíz.
 * 
 * Centraliza el manejo de errores de carga de fuentes para asegurar que la aplicación 
 * se detenga de forma controlada si falla la compilación de recursos visuales.
 * 
 * @returns {Object} Objeto que contiene el estado booleano de inicialización (`isInitialized`) y posibles errores de fuentes (`error`).
 */
export const useAppInitialization = () => {
  // Carga asíncrona de las fuentes tipográficas personalizadas de la familia Roboto Slab
  const [fontsLoaded, error] = useFonts({
    'RobotoSlab-Regular': require('../../assets/fonts/RobotoSlab-Regular.ttf'),
    'RobotoSlab-Bold': require('../../assets/fonts/RobotoSlab-Bold.ttf'),
  });

  // Efecto de salvaguarda: Propaga el error crítico si la carga tipográfica falla
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Efecto de ciclo de vida único: Inicializa los servicios de negocio y suscripciones de red
  useEffect(() => {
    console.log("Inicializando servicios de dominio...");
    playerInfoService.initialize();
    healthInfoService.initialize();
    savingThrowsService.initialize();
  }, []);

  return {
    isInitialized: fontsLoaded,
    error,
  };
};