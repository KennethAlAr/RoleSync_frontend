import { create } from 'zustand';

/**
 * Estados de la capa de transporte (WebSocket).
 * Determina la visualización de indicadores o bloqueos en la interfaz de usuario 
 * frente a caídas o inestabilidades de la red móvil.
 */
export type ConnectionOverlayStatus = 'connected' | 'reconnecting' | 'failed';

/**
 * Estados del ciclo de vida de autenticación.
 * Utilizado para el control de acceso y enrutamiento 
 * entre pantallas públicas (Login) y privadas (Dashboard).
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * Contrato del Estado Global de Conexión.
 * 
 * @interface ConnectionState
 * @property {ConnectionOverlayStatus} status - Estado actual del túnel WebSocket.
 * @property {(status: ConnectionOverlayStatus) => void} setStatus - Mutador del estado de red.
 * @property {AuthStatus} authStatus - Estado actual de la sesión del usuario.
 * @property {(status: AuthStatus) => void} setAuthStatus - Mutador del estado de sesión.
 * @property {boolean} isFoundryOnline - Bandera que indica si la instancia origen de Foundry VTT está activa.
 * @property {(online: boolean) => void} setFoundryOnline - Mutador del estado del servidor origen.
 */
interface ConnectionState {
  status: ConnectionOverlayStatus;
  setStatus: (status: ConnectionOverlayStatus) => void;
  authStatus: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
  isFoundryOnline: boolean;
  setFoundryOnline: (online: boolean) => void;
}

/**
 * Gestor de Estado Global de Conectividad.
 * 
 * Orquesta los diferentes niveles de conexión de la arquitectura distribuida:
 * 1. Autenticación del cliente (Token/OTP).
 * 2. Estabilidad de la capa de red con el servidor intermedio (Node.js/Socket.io).
 * 3. Disponibilidad final del servidor de origen (Foundry VTT).
 * 
 * Implementa lógica de reinicio de estado (State Cleanup) acoplada: 
 * al desvincular una sesión (Logout), restaura la disponibilidad de Foundry a su valor 
 * por defecto para evitar falsos bloqueos y estados huérfanos en futuras conexiones.
 */
export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'connected',
  setStatus: (status) => set({ status }),
  
  authStatus: 'loading',
  
  // Mutador con limpieza de estado derivado
  setAuthStatus: (authStatus) => set((state) => ({ 
    authStatus, 
    // Restauración preventiva: Evita heredar un estado 'offline' de una sesión anterior
    isFoundryOnline: authStatus === 'unauthenticated' ? true : state.isFoundryOnline 
  })),

  isFoundryOnline: true,
  setFoundryOnline: (online) => set({ isFoundryOnline: online }),
}));