import { create } from 'zustand';

export type ConnectionOverlayStatus = 'connected' | 'reconnecting' | 'failed';

interface ConnectionState {
  status: ConnectionOverlayStatus;
  setStatus: (status: ConnectionOverlayStatus) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'connected',
  setStatus: (status) => set({ status }),
}));