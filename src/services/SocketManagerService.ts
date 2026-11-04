import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

import { useConnectionStore } from '@/store/connectionStore';

// URL por defecto en Render si no se define en las variables de entorno
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'https://rolesync-server.onrender.com';

// Claves de almacenamiento persistente independientes
const WORLD_ID_KEY = 'roleSyncWorldId';
const CHARACTER_ID_KEY = 'roleSyncCharacterId';
const TOKEN_KEY = 'roleSyncToken';

export interface SessionData {
  worldId: string;
  characterId: string;
  token: string;
}

class SocketManagerService {
  private socket: Socket | null = null;
  private currentSession: SessionData | null = null;
  private pendingListeners: { eventName: string; callback: (data: any) => void }[] = [];

  public isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  /**
   * Limpia las 3 claves guardadas en AsyncStorage
   */
  private async clearStorageSession(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(WORLD_ID_KEY),
      AsyncStorage.removeItem(CHARACTER_ID_KEY),
      AsyncStorage.removeItem(TOKEN_KEY),
    ]);
  }

  /**
   * 1. Conexión inicial canjeando el código OTP escaneado del QR
   */
  public async connectWithOtp(
    otp: string,
    serverUrl: string = SOCKET_URL
  ): Promise<{ success: boolean; worldId?: string; characterId?: string; error?: string }> {
    if (this.socket) {
      this.disconnect();
    }

    return new Promise((resolve) => {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log(`🔌 Conectado al servidor (${this.socket?.id}). Canjeando OTP: ${otp}...`);

        this.socket?.emit('REDEEM_OTP', { otp }, async (res: any) => {
          if (res && res.success) {
            // Guardamos los 3 datos en AsyncStorage
            await Promise.all([
              AsyncStorage.setItem(WORLD_ID_KEY, res.worldId),
              AsyncStorage.setItem(CHARACTER_ID_KEY, res.characterId),
              AsyncStorage.setItem(TOKEN_KEY, res.token),
            ]);

            console.log('✅ OTP canjeado con éxito. Validando sesión con token...');

            // Delegamos toda la inicialización y validación a connectWithToken
            const authenticated = await this.connectWithToken(serverUrl);

            if (authenticated) {
              resolve({ success: true, worldId: res.worldId, characterId: res.characterId });
            } else {
              resolve({ success: false, error: 'Foundry rechazó la validación del token.' });
            }
          } else {
            console.warn('🔴 Fallo de autenticación por OTP:', res?.error);
            this.disconnect();
            resolve({ success: false, error: res?.error || 'Código OTP inválido o expirado.' });
          }
        });
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔴 Error de conexión WebSocket:', error.message);
        resolve({ success: false, error: 'No se pudo conectar con el servidor.' });
      });
    });
  }

  /**
   * 2. Único punto de inicio de sesión: valida credenciales con Foundry e inicializa listeners
   */
  public async connectWithToken(serverUrl: string = SOCKET_URL): Promise<boolean> {
    const [worldId, characterId, token] = await Promise.all([
      AsyncStorage.getItem(WORLD_ID_KEY),
      AsyncStorage.getItem(CHARACTER_ID_KEY),
      AsyncStorage.getItem(TOKEN_KEY),
    ]);

    if (!worldId || !characterId || !token) {
      await this.clearStorageSession();
      return false;
    }

    if (this.socket?.connected && this.currentSession) return true;

    // Si no hay socket activo, lo creamos
    if (!this.socket || !this.socket.connected) {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });
    }

    return new Promise((resolve) => {
      const authenticate = () => {
        console.log('🔌 Autenticando con credenciales en la sala...');

        this.socket?.emit(
          'AUTHENTICATE_WITH_TOKEN',
          { token, worldId, characterId },
          async (res: any) => {
            if (res && res.success) {
              this.currentSession = { worldId, characterId, token };

              this.attachPendingListeners();
              this.setupDefaultEvents();

              // Pedimos los datos del personaje a Foundry
              this.emit('REQUEST_CHARACTER_DATA', { characterId });

              console.log(`✅ Sesión validada | Mundo: ${worldId} | Personaje: ${characterId}`);
              resolve(true);
            } else {
              console.warn('🔴 Credenciales rechazadas por Foundry. Limpiando almacenamiento...');
              await this.clearStorageSession();
              this.disconnect();
              resolve(false);
            }
          }
        );
      };

      if (this.socket?.connected) {
        authenticate();
      } else {
        this.socket?.once('connect', authenticate);
        this.socket?.once('connect_error', () => resolve(false));
      }
    });
  }

  /**
   * Emite eventos al servidor verificando previamente el estado de la conexión
   */
  public emit(eventName: string, data: any = {}) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(eventName, data);
      console.log(`📤 Evento '${eventName}' enviado`);
    } else {
      console.warn(`⚠️ No se pudo enviar '${eventName}': Socket desconectado`);
    }
  }

  /**
   * Registra un listener de eventos
   */
  public on(eventName: string, callback: (data: any) => void) {
    if (!this.socket) {
      this.pendingListeners.push({ eventName, callback });
      return;
    }
    this.socket.on(eventName, callback);
  }

  /**
   * Remueve un listener registrado
   */
  public off(eventName: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
    this.pendingListeners = this.pendingListeners.filter((l) => l.eventName !== eventName);
  }

  /**
   * Cierra el canal WebSocket y limpia la sesión activa en memoria RAM
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentSession = null;
    }
  }

  /**
   * Cierra sesión completamente: borra los 3 datos del almacenamiento y corta la conexión
   */
  public async logout() {
    if (this.currentSession) {
      this.emit('REVOKE_TOKEN', {
        worldId: this.currentSession.worldId,
        characterId: this.currentSession.characterId,
        token: this.currentSession.token
      });
    }

    await this.clearStorageSession();
    this.disconnect();
    useConnectionStore.getState().setStatus('connected');
  }

  public getSession(): SessionData | null {
    return this.currentSession;
  }

  private attachPendingListeners() {
    if (!this.socket) return;
    this.pendingListeners.forEach((listener) => {
      this.socket?.on(listener.eventName, listener.callback);
    });
  }

  private setupDefaultEvents() {
    if (!this.socket) return;

    this.socket.on('disconnect', (reason) => {
      console.log('⚪ Desconectado:', reason);
      if (reason !== 'io client disconnect') {
        useConnectionStore.getState().setStatus('reconnecting');
      }
    });

    this.socket.on('connect', () => {
      console.log('🟢 WebSocket conectado/restablecido');
      useConnectionStore.getState().setStatus('connected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Error Socket.io:', error.message);
      if (!this.socket?.connected) {
        useConnectionStore.getState().setStatus('failed');
      }
    });
  }
}

export const socketManager = new SocketManagerService();