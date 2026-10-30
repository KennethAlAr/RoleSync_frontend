import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

export interface ConnectionParams {
  roomId: string;
  characterId: string;
}

class SocketManagerService {
  private socket: Socket | null = null;
  private currentSession: ConnectionParams | null = null;
  
  // 🛡️ NUEVO: Lista para guardar los "on" que se llamen antes de escanear el QR
  private pendingListeners: { eventName: string, callback: (data: any) => void }[] = [];

  connect({ roomId, characterId }: ConnectionParams, url: string = SOCKET_URL || '') {
    if (this.socket?.connected && this.currentSession?.characterId === characterId) return;

    if (this.socket) {
      this.disconnect();
    }

    this.currentSession = { roomId, characterId };

    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      auth: { roomId, characterId },
    });

    // 🛡️ NUEVO: Enchufamos al socket todos los eventos que estaban en la sala de espera
    this.pendingListeners.forEach(listener => {
      this.socket?.on(listener.eventName, listener.callback);
    });

    // Eventos puramente de infraestructura de red
    this.socket.on('connect', () => {
      console.log(`🟢 Conectado a la sala: ${roomId} | Personaje: ${characterId}`);
      
      this.emit('JOIN_ROOM', { roomId, characterId });
      this.emit('REQUEST_CHARACTER_DATA', { roomId, characterId });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('⚪ Desconectado:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔴 Error Socket.io:', error.message);
    });
  }

  emit(eventName: string, data: any = {}) {
    if (this.socket && this.socket.connected) {
      const payload = { 
        ...data, 
        roomId: this.currentSession?.roomId,
        characterId: this.currentSession?.characterId 
      };
      this.socket.emit(eventName, payload);
      console.log(`📤 Evento '${eventName}' enviado`);
    } else {
      console.warn(`⚠️ No se pudo enviar el evento ${eventName}: Socket desconectado`);
    }
  }

  on(eventName: string, callback: (data: any) => void) {
    if (!this.socket) {
      // 🛡️ En vez de ignorar la escucha, la guardamos en la lista para cuando haya socket
      console.log(`⏳ Guardando listener para '${eventName}' (esperando QR...)`);
      this.pendingListeners.push({ eventName, callback });
      return;
    }
    // Si ya había socket, lo enchufamos directo
    this.socket.on(eventName, callback);
  }

  off(eventName: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
    // También lo quitamos de pendientes por si acaso
    this.pendingListeners = this.pendingListeners.filter(l => l.eventName !== eventName);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentSession = null;
    }
  }

  getSession() {
    return this.currentSession;
  }
}

export const socketManager = new SocketManagerService();