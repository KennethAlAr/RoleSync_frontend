import { create } from 'zustand';

export type ConnectionOverlayStatus = 'connected' | 'reconnecting' | 'failed';
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface ConnectionState {
  status: ConnectionOverlayStatus;
  setStatus: (status: ConnectionOverlayStatus) => void;
  authStatus: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'connected',
  setStatus: (status) => set({ status }),
  authStatus: 'loading',
  setAuthStatus: (authStatus) => set({ authStatus }),
}));