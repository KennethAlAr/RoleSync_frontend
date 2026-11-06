import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

/**
 * Servicio de Información del Jugador.
 * 
 * Controlador de dominio encargado de gestionar la sincronización de las estadísticas 
 * generales del personaje (identidad, atributos estáticos y estado de combate) 
 * entre el servidor de Foundry VTT y el estado local de la aplicación móvil.
 * 
 * Actúa principalmente procesando flujos de datos unidireccionales (Server-to-Client) 
 * para garantizar que la interfaz gráfica siempre refleje la verdad del servidor.
 */
class PlayerInfoService {
  /**
   * Inicializa las suscripciones a los eventos del WebSocket (Listeners).
   * Se invoca una única vez durante la fase de arranque de la aplicación (Bootstrap).
   */
  initialize() {
    
    // 1. Hidratación inicial completa de la entidad del jugador
    socketManager.on('PLAYER_INFO', (payload) => {
      useCharacterStore.getState().setPlayerInfo({
        name: payload.name,
        className: payload.className,
        level: payload.level,
        avatarImage: payload.avatarImage,
        ac: payload.ac,
        initiative: payload.initiative,
        speed: payload.speed,
        proficiency: payload.proficiency,
        inCombat: payload.inCombat ?? false,
      });
    });

    // 2. Parcheo de actualizaciones parciales (Partial State Updates)
    socketManager.on('PLAYER_UPDATE', (payload) => {
      console.log("📥 Recibido PLAYER_UPDATE en la app:", payload);
      const currentInfo = useCharacterStore.getState().playerInfo;
      
      if (currentInfo) {
        // Fusión de datos manteniendo los valores previos y sobreescribiendo
        // únicamente las propiedades incluidas en la carga útil (Payload) entrante.
        useCharacterStore.getState().setPlayerInfo({
          ...currentInfo,
          ...payload
        });
      }
    });

    // 3. Monitorización del estado de encuentro (Iniciativa/Combate)
    socketManager.on('COMBAT_STATE_UPDATE', (payload) => {
      const { playerInfo, userInfo } = useCharacterStore.getState();

      if (!playerInfo || !userInfo) return;

      // Validación de identidad: asegura que el evento de combate va dirigido
      // estrictamente al personaje vinculado actualmente en la aplicación.
      if (userInfo.characterId === payload.characterId) {
        useCharacterStore.getState().setPlayerInfo({
          ...playerInfo,
          inCombat: payload.inCombat
        });
      }
    });
  }

  /**
   * Delega la resolución mecánica de la tirada de iniciativa al servidor.
   * Recupera las credenciales de sesión activas (worldId, characterId) desde 
   * el estado global para autenticar la petición vía WebSocket.
   */
  rollInitiative() {
    const userInfo = useCharacterStore.getState().userInfo;
    if (!userInfo) return;

    socketManager.emit('ROLL_INITIATIVE', {
      worldId: userInfo.worldId,
      characterId: userInfo.characterId,
    });
  }
}

export const playerInfoService = new PlayerInfoService();