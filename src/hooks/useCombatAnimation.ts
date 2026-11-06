import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Custom Hook que gestiona el ciclo de vida y la matemática de una animación de latido (pulse).
 * 
 * Utiliza la API `Animated` de React Native para escalar y alterar la opacidad 
 * de un elemento visual de forma cíclica y continua mientras la condición activa se cumpla.
 * 
 * @param {boolean | undefined} isActive - Condición booleana que arranca o detiene la animación.
 * @returns {Object} Valores animados (`pulseAnim` y `animatedOpacity`) listos para ser inyectados en un `<Animated.View>`.
 */
export const useCombatAnimation = (isActive: boolean | undefined) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, pulseAnim]);

  const animatedOpacity = isActive
    ? pulseAnim.interpolate({
        inputRange: [1, 1.15],
        outputRange: [0.5, 1], 
      })
    : 1;

  return { pulseAnim, animatedOpacity };
};