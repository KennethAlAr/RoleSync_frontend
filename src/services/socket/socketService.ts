import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (url: string): void => {
  if (socket?.connected) {
    console.log('Socket.IO ya está conectado');
    return;
  }

  console.log('Conectando a Socket.IO...');

  socket = io(url);

  socket.on('connect', () => {
    console.log('Socket.IO conectado:', socket?.id);
  });

  socket.on('connect_error', (error) => {
    console.error('Error conectando a Socket.IO:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO desconectado:', reason);
  });
};