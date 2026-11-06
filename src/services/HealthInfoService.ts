import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

/**
 * Servicio de Gestión de Salud.
 * 
 * Controlador de dominio responsable de la orquestación bidireccional de los puntos 
 * de salud (HP Base y HP Temporal) entre la interfaz gráfica, el estado local (Zustand) 
 * y el servidor de WebSockets.
 * 
 * Actualiza el estado local de forma síncrona antes del servidor.
 * Debouncing: Agrupa múltiples operaciones consecutivas de E/S en una sola emisión de red (400ms).
 * Bloquea actualizaciones entrantes del servidor temporalmente (1000ms) tras una modificación
 * local para evitar parpadeos y rebotes asíncronos.
 */
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

  /**
   * Motor centralizado de actualizaciones.
   * Unifica la lógica repetitiva de actualización local, bloqueo de ecos y emisión de red
   * para cualquier tipo de alteración de salud.
   * 
   * @private
   * @param {'hp' | 'tempHp'} type - El tipo de estadística de salud a modificar.
   * @param {number} newValue - El valor final ya calculado y restringido.
   */
  private processHealthUpdate(type: 'hp' | 'tempHp', newValue: number) {
    const health = useCharacterStore.getState().healthInfo;
    const userInfo = useCharacterStore.getState().userInfo;
    if (!health || !userInfo) return;

    useCharacterStore.getState().setHealthInfo({ ...health, [type]: newValue });
    
    this.blockIncomingUpdates();

    const payload = { 
      worldId: userInfo.worldId, 
      characterId: userInfo.characterId, 
      [type]: newValue 
    };

    if (type === 'hp') {
      if (this.emitHpTimeout) clearTimeout(this.emitHpTimeout);
      this.emitHpTimeout = setTimeout(() => socketManager.emit('UPDATE_HP', payload), 400);
    } else {
      if (this.emitTempHpTimeout) clearTimeout(this.emitTempHpTimeout);
      this.emitTempHpTimeout = setTimeout(() => socketManager.emit('UPDATE_TEMP_HP', payload), 400);
    }
  }

  modifyHp(amount: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;
    
    const newHp = Math.min(Math.max(health.hp + amount, 0), health.maxHp);
    this.processHealthUpdate('hp', newHp);
  }

  modifyTempHp(amount: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newTemp = Math.max(health.tempHp + amount, 0);
    this.processHealthUpdate('tempHp', newTemp);
  }

  setHp(val: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newHp = Math.min(Math.max(val, 0), health.maxHp);
    this.processHealthUpdate('hp', newHp);
  }

  setTempHp(val: number) {
    const health = useCharacterStore.getState().healthInfo;
    if (!health) return;

    const newTemp = Math.max(val, 0);
    this.processHealthUpdate('tempHp', newTemp);
  }
}

export const healthInfoService = new HealthInfoService();