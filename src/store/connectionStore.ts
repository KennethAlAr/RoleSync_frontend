import { create } from 'zustand';

export type ConnectionOverlayStatus = 'connected' | 'reconnecting' | 'failed';
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface ConnectionState {
  status: ConnectionOverlayStatus;
  setStatus: (status: ConnectionOverlayStatus) => void;
  authStatus: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
  // 👇 NUEVO
  isFoundryOnline: boolean;
  setFoundryOnline: (online: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'connected',
  setStatus: (status) => set({ status }),
  
  authStatus: 'loading',
  // Al desvincular (unauthenticated), reseteamos isFoundryOnline a true para la próxima vez
  setAuthStatus: (authStatus) => set((state) => ({ 
    authStatus, 
    isFoundryOnline: authStatus === 'unauthenticated' ? true : state.isFoundryOnline 
  })),

  // 👇 NUEVO
  isFoundryOnline: true,
  setFoundryOnline: (online) => set({ isFoundryOnline: online }),
}));