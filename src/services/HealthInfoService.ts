import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

class HealthInfoService {
  private ignoreUpdatesTimeout: ReturnType<typeof setTimeout> | null = null;
  private emitHpTimeout: ReturnType<typeof setTimeout> | null = null;
  private emitTempHpTimeout: ReturnType<typeof setTimeout> | null = null;

  initialize() {
    socketManager.on('HEALTH_INFO', (payload) => {
      useCharacterStore.getState().setHealthInfo(payload);
    });

    socketManager.on('HEALTH_UPDATE', (payload) => {
      if (this.ignoreUpdatesTimeout) return;
      useCharacterStore.getState().setHealthInfo(payload);
    });
  }

  private blockIncomingUpdates() {
    if (this.ignoreUpdatesTimeout) clearTimeout(this.ignoreUpdatesTimeout);
    this.ignoreUpdatesTimeout = setTimeout(() => {
      this.ignoreUpdatesTimeout = null;
    }, 1000); 
  }

  modifyHp(amount: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newHp = Math.min(Math.max(health.hp + amount, 0), health.maxHp);
    useCharacterStore.getState().setHealthInfo({ ...health, hp: newHp });
    this.blockIncomingUpdates();

    if (this.emitHpTimeout) clearTimeout(this.emitHpTimeout);
    this.emitHpTimeout = setTimeout(() => {
      socketManager.emit('UPDATE_HP', { hp: newHp });
    }, 400);
  }

  modifyTempHp(amount: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newTemp = Math.max(health.tempHp + amount, 0);
    useCharacterStore.getState().setHealthInfo({ ...health, tempHp: newTemp });
    this.blockIncomingUpdates();

    if (this.emitTempHpTimeout) clearTimeout(this.emitTempHpTimeout);
    this.emitTempHpTimeout = setTimeout(() => {
      socketManager.emit('UPDATE_TEMP_HP', { tempHp: newTemp });
    }, 400);
  }

  setHp(val: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newHp = Math.min(Math.max(val, 0), health.maxHp);
    useCharacterStore.getState().setHealthInfo({ ...health, hp: newHp });
    this.blockIncomingUpdates();

    if (this.emitHpTimeout) clearTimeout(this.emitHpTimeout);
    this.emitHpTimeout = setTimeout(() => {
      socketManager.emit('UPDATE_HP', { hp: newHp });
    }, 400);
  }

  setTempHp(val: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newTemp = Math.max(val, 0);
    useCharacterStore.getState().setHealthInfo({ ...health, tempHp: newTemp });
    this.blockIncomingUpdates();

    if (this.emitTempHpTimeout) clearTimeout(this.emitTempHpTimeout);
    this.emitTempHpTimeout = setTimeout(() => {
      socketManager.emit('UPDATE_TEMP_HP', { tempHp: newTemp });
    }, 400);
  }
}

export const healthInfoService = new HealthInfoService();