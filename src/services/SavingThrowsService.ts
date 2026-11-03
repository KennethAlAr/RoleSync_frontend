import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

class SavingThrowsService {
  initialize() {
    socketManager.on('SAVING_THROWS_INFO', (payload) => {
      useCharacterStore.getState().setSavingThrows(payload.savingThrows);
    });
  }

  rollSavingThrow(abilityName: string) {
    const userInfo = useCharacterStore.getState().userInfo;
    if (!userInfo) return;

    const reverseMap: Record<string, string> = {
      'FUE': 'str', 'DES': 'dex', 'CON': 'con',
      'INT': 'int', 'SAB': 'wis', 'CAR': 'cha'
    };
    
    const abilityKey = reverseMap[abilityName] || abilityName.toLowerCase();

    socketManager.emit('ROLL_SAVING_THROW', { 
      worldId: userInfo.worldId,
      characterId: userInfo.characterId,
      ability: abilityKey,
    });
  }
}

export const savingThrowsService = new SavingThrowsService();