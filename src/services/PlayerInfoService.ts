import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

class PlayerInfoService {
  initialize() {
    socketManager.on('PLAYER_INFO', (payload) => {
      useCharacterStore.getState().setPlayerInfo({
        characterId: payload.characterId,
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

    socketManager.on('PLAYER_UPDATE', (payload) => {
        console.log("📥 Recibido PLAYER_UPDATE en la app:", payload);
      const currentInfo = useCharacterStore.getState().playerInfo;
      if (currentInfo) {
        useCharacterStore.getState().setPlayerInfo({
          ...currentInfo,
          ...payload
        });
      }
    });

    socketManager.on('COMBAT_STATE_UPDATE', (payload) => {
      const currentInfo = useCharacterStore.getState().playerInfo;
      if (currentInfo && currentInfo.characterId === payload.characterId) {
        useCharacterStore.getState().setPlayerInfo({
          ...currentInfo,
          inCombat: payload.inCombat
        });
      }
    });
  }

  rollInitiative() {
    socketManager.emit('ROLL_INITIATIVE');
  }
}

export const playerInfoService = new PlayerInfoService();