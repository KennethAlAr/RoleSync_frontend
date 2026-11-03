import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

class PlayerInfoService {
  initialize() {
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
      const { playerInfo, userInfo } = useCharacterStore.getState();

      if (!playerInfo || !userInfo) return;

      if (userInfo.characterId === payload.characterId) {
        useCharacterStore.getState().setPlayerInfo({
          ...playerInfo,
          inCombat: payload.inCombat
        });
      }
    });
  }

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