import { AppState } from 'react-native';

import { io, Socket } from 'socket.io-client';

import { useConnectionStore } from '@/store/connectionStore';
import { authService, SessionData } from './AuthService';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL as string;

if (!SOCKET_URL) {
  throw new Error(
    "EXPO_PUBLIC_SOCKET_URL no está definida en las variables de entorno (.env)"
  );
}

/**
 * Gestor Central de WebSockets.
 * 
 * Controlador principal encargado de la capa de transporte bidireccional 
 * en tiempo real entre la aplicación móvil y el servidor/Foundry VTT.
 * 
 * Implementa patrones de resiliencia móvil:
 * - Ciclo de Vida: Reconexión automática basada en las transiciones de estado del sistema operativo.
 * - Cola de Eventos (Lazy Binding): Almacena suscripciones en memoria si el socket aún no está listo.
 * - Gestión de Estado: Sincroniza la salud de la red directamente con el gestor global (Zustand).
 */
class SocketManagerService {
  private socket: Socket | null = null;
  private currentSession: SessionData | null = null;
  
  /** 
   * Cola de escuchas pendientes. Permite a los componentes suscribirse a eventos 
   * antes de que la conexión física del socket se haya resuelto exitosamente.
   */
  private pendingListeners: { eventName: string; callback: (data: any) => void }[] = [];

  constructor() {
    this.setupAppStateListener();
  }
  
  /**
   * Monitoriza las transiciones de la aplicación entre primer y segundo plano.
   * Los sistemas operativos móviles (Android/iOS) cortan las conexiones TCP/WebSocket 
   * para ahorrar batería cuando la app pasa a segundo plano. Este listener fuerza 
   * un reinicio limpio ("borrón y cuenta nueva") al volver a primer plano (active).
   * 
   * @private
   */
  private setupAppStateListener() {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App vuelve a primer plano. Aplicando borrón y cuenta nueva...');
        this.resetConnection();
        this.connectWithToken();
      }
    });
  }

  /**
   * Destruye la instancia actual del socket y limpia la sesión en memoria
   * para evitar fugas de memoria (Memory Leaks) y conexiones huérfanas.
   * 
   * @private
   */
  private resetConnection() {
    this.currentSession = null;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  /**
   * Fase 1 del Handshake de seguridad: Canjeo de OTP (One Time Password).
   * Inicializa un socket efímero para validar el código QR escaneado. Si tiene éxito, 
   * persiste el token resultante e invoca la conexión definitiva.
   * 
   * @param {string} otp - Código efímero obtenido del QR.
   * @param {string} serverUrl - URL del servidor puente.
   * @returns {Promise<Object>} Resultado de la validación y datos de sesión si es exitosa.
   */
  public async connectWithOtp(otp: string, serverUrl: string = SOCKET_URL): Promise<{ success: boolean; worldId?: string; characterId?: string; error?: string }> {
    this.resetConnection();

    return new Promise((resolve) => {
      this.socket = io(serverUrl, { transports: ['websocket'], autoConnect: true });

      this.socket.on('connect', () => {
        console.log(`Conectado al servidor. Canjeando OTP...`);

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

  /**
   * Fase 2 del Handshake: Conexión mediante Token JWT persistente.
   * Autentica la sesión actual contra el servidor. Es el método principal utilizado 
   * en arranques y reconexiones automáticas.
   * 
   * @param {string} serverUrl - URL del servidor puente.
   * @returns {Promise<boolean>} Promesa que resuelve a `true` si la conexión y autenticación son válidas.
   */
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
  
  /**
   * Configura los oyentes base de la arquitectura.
   * Monitoriza la estabilidad del túnel TCP y actualiza el store global para reflejar 
   * estados de error, reconexión o caída del servidor de Foundry VTT.
   * 
   * @private
   */
  private setupDefaultEvents() {
    if (!this.socket) return;
    
    // Limpiamos los eventos previos para evitar duplicados en reconexiones
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
      // Estrategia de recuperación: Si Foundry vuelve a estar en línea, forzamos 
      // una recarga de los datos tras 1 segundo de gracia para evitar condiciones de carrera.
      if (payload.online && this.currentSession) {
        setTimeout(() => {
          if (this.currentSession) {
            this.emit('REQUEST_CHARACTER_DATA', { characterId: this.currentSession.characterId });
          }
        }, 1000);
      }
    });
  }
  
  public isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }

  public getSession(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Envoltorio seguro para la emisión de eventos. 
   * Previene errores de nulidad si se intenta emitir sin conexión activa.
   */
  public emit(eventName: string, data: any = {}) {
    if (this.isConnected()) this.socket?.emit(eventName, data);
  }

  /**
   * Suscribe un callback a un evento del servidor.
   * Implementa un patrón de cola: si el socket no está instanciado, 
   * guarda la suscripción en memoria para adjuntarla automáticamente al conectar.
   */
  public on(eventName: string, callback: (data: any) => void) {
    if (!this.socket) this.pendingListeners.push({ eventName, callback });
    else this.socket.on(eventName, callback);
  }

  public off(eventName: string, callback?: (data: any) => void) {
    this.socket?.off(eventName, callback);
    this.pendingListeners = this.pendingListeners.filter((l) => l.eventName !== eventName);
  }

  /**
   * Vuelca todas las suscripciones en cola al socket nativo 
   * una vez que la conexión se ha establecido de forma segura.
   * 
   * @private
   */
  private attachPendingListeners() {
    if (!this.socket) return;
    this.pendingListeners.forEach((l) => this.socket?.on(l.eventName, l.callback));
  }
  
  /**
   * Finaliza la conexión de red actual localmente.
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentSession = null;
    }
  }

  /**
   * Ejecuta el flujo completo de cierre de sesión (Logout).
   * 1. Notifica al servidor para invalidar el token (Revoke).
   * 2. Limpia el almacenamiento seguro local.
   * 3. Desconecta y limpia recursos de red.
   */
  public async logout() {
    if (this.currentSession) {
      this.emit('REVOKE_TOKEN', this.currentSession);
    }
    await authService.clearSession();
    this.disconnect();
    useConnectionStore.getState().setStatus('connected'); // Fuerza reinicio visual del store
  }
}

export const socketManager = new SocketManagerService();