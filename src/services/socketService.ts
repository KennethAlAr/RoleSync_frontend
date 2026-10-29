import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

interface ConnectionParams {
  roomId: string;
  characterId: string;
}

class SocketService {
  private socket: Socket | null = null;
  private currentSession: ConnectionParams | null = null;

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

    this.socket.on('connect', () => {
      console.log(`🟢 Conectado a la sala: ${roomId} | Personaje: ${characterId}`);
      
      this.emit('JOIN_ROOM', { roomId, characterId });
      this.emit('REQUEST_CHARACTER_DATA', { roomId, characterId });
    });

    this.socket.on('CHARACTER_DATA', async (payload) => {
      console.log('⚡ PAYLOAD RECIBIDO DE FOUNDRY:', payload.savingThrows);
      const { useCharacterStore } = await import('@/store/characterStore');
      useCharacterStore.getState().setCharacterData(payload);
    });

    this.socket.on('CHARACTER_UPDATE', async (payload) => {
      console.log('🔄 Actualización recibida:', payload);
      const { useCharacterStore } = await import('@/store/characterStore');
      useCharacterStore.getState().setCharacterData(payload);
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
      console.log(`📤 Evento '${eventName}' enviado:`, payload);
    } else {
      console.warn('⚠️ No se pudo enviar el evento: Socket desconectado');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentSession = null;
    }
  }
}

export const socketService = new SocketService();