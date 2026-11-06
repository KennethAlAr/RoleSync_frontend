import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';

import AppBackground from '@/components/shared/AppBackground';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { useSessionManager } from '@/hooks/useSessionManager';

import '../global.css';

// Mantiene la pantalla de carga nativa visible hasta que la app esté lista internamente
SplashScreen.preventAutoHideAsync();

/**
 * Layout Raíz de la Aplicación (RootLayout).
 * 
 * Punto de entrada principal y componente de orden superior.
 * Sus responsabilidades arquitectónicas son:
 * 1. Inicialización: Carga de fuentes, servicios y estado base.
 * 2. Gestión de Sesión: Coordinación del estado de autenticación (Token/OTP).
 * 3. Enrutamiento Protegido (Route Guards): Redirección automática de usuarios no autenticados.
 * 4. Maquetación Global: Proveer el diseño "Edge-to-Edge" respetando las áreas seguras del hardware.
 *
 * @returns {JSX.Element | null} La estructura base de la app, o null si está en inicialización.
 */
const RootLayout = () => {
  // 1. Cargamos fuentes y servicios
  const { isInitialized, error } = useAppInitialization();
  const sessionStatus = useSessionManager(isInitialized);
  const router = useRouter();
  const segments = useSegments();

  /**
   * Efecto de control de acceso a rutas (Guards).
   * Evalúa los segmentos de navegación de expo-router para impedir accesos no autorizados.
   */
  useEffect(() => {
    // Esperamos a que la inicialización y la sesión estén listas para tomar decisiones
    if (!isInitialized || sessionStatus === 'loading') return;

    // Comprobamos si el usuario intenta acceder a la ficha del personaje (ruta protegida)
    const inProtectedRoute = segments[0] === 'player';

    if (sessionStatus === 'authenticated' && !inProtectedRoute) {
       // Usuario validado intentando acceder al login -> Redirigir a la app
       router.replace('/player');
    } else if (sessionStatus === 'unauthenticated' && inProtectedRoute) {
       // Usuario sin validar intentando acceder al juego -> Expulsar al login principal
       router.replace('/'); 
    }
  }, [isInitialized, sessionStatus, segments]);

  // Bloqueamos el renderizado (pantalla en blanco/splash) hasta resolver el estado de la sesión
  if (!isInitialized || sessionStatus === 'loading') return null;

  return (
    /* CAPA 1 (Fondo): Ocupa el 100% de la pantalla ignorando restricciones para mayor inmersión */
    <AppBackground>
      
      {/* CAPA 2 (Área Segura): Interfaz transparente que calcula dinámicamente el Notch/Barra nativa */}
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        
        {/* CAPA 3 (Contenido): Las pantallas de la aplicación (Home, PlayerScreen, etc.) */}
        <Slot />
        
      </SafeAreaView>
      
    </AppBackground>
  );
};

export default RootLayout;