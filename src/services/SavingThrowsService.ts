import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

class SavingThrowsService {
  initialize() {
    // Escucha el array de tiradas de salvación
    socketManager.on('SAVING_THROWS_INFO', (payload) => {
      // El payload trae { roomId, characterId, savingThrows: [...] }
      useCharacterStore.getState().setSavingThrows(payload.savingThrows);
    });
  }

  // Método para que la UI solicite una tirada al pulsar sobre una característica
  rollSavingThrow(abilityName: string) {
    const userInfo = useCharacterStore.getState().userInfo;
    console.log("Estado de userInfo:", userInfo);
    if (!userInfo) return;

    // Mapa inverso para enviar a Foundry la clave interna que espera
    const reverseMap: Record<string, string> = {
      'FUE': 'str', 'DES': 'dex', 'CON': 'con',
      'INT': 'int', 'SAB': 'wis', 'CAR': 'cha'
    };
    
    const abilityKey = reverseMap[abilityName] || abilityName.toLowerCase();

    console.log("hola")

    socketManager.emit('ROLL_SAVING_THROW', { 
      roomId: 'sala_de_prueba', // o pasarlo desde tu constante
      characterId: userInfo.characterId,
      ability: abilityKey,
      userId: userInfo.userId,
    });
  }
}

export const savingThrowsService = new SavingThrowsService();