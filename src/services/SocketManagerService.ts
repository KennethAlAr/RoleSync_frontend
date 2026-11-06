// src/services/SocketManagerService.ts
import { io, Socket } from 'socket.io-client';
import { AppState } from 'react-native';

import { useConnectionStore } from '@/store/connectionStore';
import { authService, SessionData } from './AuthService';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'https://rolesync-server.onrender.com';

class SocketManagerService {
  private socket: Socket | null = null;
  private currentSession: SessionData | null = null;
  private pendingListeners: { eventName: string; callback: (data: any) => void }[] = [];

  constructor() {
    this.setupAppStateListener();
  }

  // ==========================================
  // 1. GESTIÓN DEL CICLO DE VIDA (APP STATE)
  // ==========================================
  private setupAppStateListener() {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('📱 App vuelve a primer plano. Aplicando borrón y cuenta nueva...');
        this.resetConnection();
        this.connectWithToken();
      }
    });
  }

  private resetConnection() {
    this.currentSession = null;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // ==========================================
  // 2. MÉTODOS DE AUTENTICACIÓN Y CONEXIÓN
  // ==========================================
  
  /** Conexión inicial escaneando el QR */
  public async connectWithOtp(otp: string, serverUrl: string = SOCKET_URL): Promise<{ success: boolean; worldId?: string; characterId?: string; error?: string }> {
    this.resetConnection();

    return new Promise((resolve) => {
      this.socket = io(serverUrl, { transports: ['websocket'], autoConnect: true });

      this.socket.on('connect', () => {
        console.log(`🔌 Conectado al servidor. Canjeando OTP...`);

        this.socket?.emit('REDEEM_OTP', { otp }, async (res: any) => {
          if (res?.success) {
            await authService.saveSession(res.worldId, res.characterId, res.token);
            const authenticated = await this.connectWithToken(serverUrl);
            resolve({ 
              success: authenticated, 
              worldId: res.worldId, 
              characterId: res.characterId,
              error: authenticated ? undefined : 'Foundry rechazó la validación del token.'
            });
          } else {
            this.disconnect();
            resolve({ success: false, error: res?.error || 'Código OTP inválido o expirado.' });
          }
        });
      });

      this.socket.on('connect_error', () => resolve({ success: false, error: 'No se pudo conectar con el servidor.' }));
    });
  }

  /** Conexión de re-ingreso (Lee sesión y valida con Render) */
  public async connectWithToken(serverUrl: string = SOCKET_URL): Promise<boolean> {
    const session = await authService.getSession();
    if (!session) {
      await authService.clearSession();
      return false;
    }

    if (this.isConnected() && this.currentSession) return true;

    if (!this.socket) {
      this.socket = io(serverUrl, { transports: ['websocket'], autoConnect: true });
    }

    return new Promise((resolve) => {
      const authenticate = () => {
        this.socket?.emit('AUTHENTICATE_WITH_TOKEN', { ...session, clientType: 'mobile' }, async (res: any) => {
          if (res?.success) {
            this.currentSession = session;
            this.setupDefaultEvents();
            this.attachPendingListeners();
            this.emit('REQUEST_CHARACTER_DATA', { characterId: session.characterId });
            
            useConnectionStore.getState().setStatus('connected');
            resolve(true);
          } else {
            await authService.clearSession();
            this.disconnect();
            useConnectionStore.getState().setStatus('failed');
            resolve(false);
          }
        });
      };

      if (this.socket?.connected) authenticate();
      else {
        this.socket?.once('connect', authenticate);
        this.socket?.once('connect_error', () => resolve(false));
      }
    });
  }

  // ==========================================
  // 3. LISTENERS Y EVENTOS INTERNOS
  // ==========================================
  private setupDefaultEvents() {
    if (!this.socket) return;
    
    // Limpiamos los eventos previos para evitar duplicados
    this.socket.removeAllListeners('disconnect');
    this.socket.removeAllListeners('connect');
    this.socket.removeAllListeners('connect_error');
    this.socket.removeAllListeners('FOUNDRY_STATUS');

    this.socket.on('disconnect', (reason) => {
      console.log('⚪ Desconectado:', reason);
      if (reason !== 'io client disconnect') useConnectionStore.getState().setStatus('reconnecting');
    });

    this.socket.on('connect', () => {
      console.log('🟢 Red detectada (reconectando socket). Borrón y cuenta nueva...');
      this.currentSession = null;
      this.connectWithToken();
    });

    this.socket.on('connect_error', () => {
      if (!this.socket?.connected) useConnectionStore.getState().setStatus('failed');
    });

    this.socket.on('FOUNDRY_STATUS', (payload: { online: boolean }) => {
      useConnectionStore.getState().setFoundryOnline(payload.online);
      if (payload.online && this.currentSession) {
        setTimeout(() => {
          if (this.currentSession) {
            this.emit('REQUEST_CHARACTER_DATA', { characterId: this.currentSession.characterId });
          }
        }, 1000);
      }
    });
  }

  // ==========================================
  // 4. API PÚBLICA DE SOCKETS (Emit / On / Off)
  // ==========================================
  public isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  public getSession(): SessionData | null {
    return this.currentSession;
  }

  public emit(eventName: string, data: any = {}) {
    if (this.isConnected()) this.socket?.emit(eventName, data);
  }

  public on(eventName: string, callback: (data: any) => void) {
    if (!this.socket) this.pendingListeners.push({ eventName, callback });
    else this.socket.on(eventName, callback);
  }

  public off(eventName: string, callback?: (data: any) => void) {
    this.socket?.off(eventName, callback);
    this.pendingListeners = this.pendingListeners.filter((l) => l.eventName !== eventName);
  }

  private attachPendingListeners() {
    if (!this.socket) return;
    this.pendingListeners.forEach((l) => this.socket?.on(l.eventName, l.callback));
  }

  // ==========================================
  // 5. CERRAR SESIÓN Y LIMPIEZA
  // ==========================================
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentSession = null;
    }
  }

  public async logout() {
    if (this.currentSession) {
      this.emit('REVOKE_TOKEN', this.currentSession);
    }
    await authService.clearSession();
    this.disconnect();
    useConnectionStore.getState().setStatus('connected');
  }
}

export const socketManager = new SocketManagerService();