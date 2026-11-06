import { socketManager } from './SocketManagerService';
import { useCharacterStore } from '@/store/characterStore';

/**
 * Servicio de Tiradas de Salvación.
 * 
 * Controlador de dominio responsable de gestionar las estadísticas y peticiones 
 * de red relacionadas con las tiradas de salvación (Saving Throws) del personaje.
 * 
 * Actúa como intermediario entre la vista, el estado global (Zustand) y el servidor, 
 * implementando funciones de adaptación de datos para estandarizar la comunicación 
 * con el backend de Foundry VTT.
 */
class SavingThrowsService {
  
  /**
   * Inicializa las suscripciones a eventos de red (Listeners).
   * Se encarga de hidratar el estado global con los bonificadores y competencias 
   * de las tiradas de salvación una vez el servidor envía la carga útil inicial.
   */
  initialize() {
    socketManager.on('SAVING_THROWS_INFO', (payload) => {
      useCharacterStore.getState().setSavingThrows(payload.savingThrows);
    });
  }

  /**
   * Solicita al servidor remoto la ejecución mecánica de una tirada de salvación.
   * 
   * Implementa una capa de traducción de datos (Data Mapping / Adapter) mediante un 
   * diccionario interno. Esto permite que la interfaz gráfica utilice abreviaturas 
   * localizadas (ej. 'FUE', 'DES' en español) mientras se respeta el contrato de 
   * datos del backend que requiere claves estándar del sistema D&D5e ('str', 'dex').
   * 
   * @param {string} abilityName - Nombre o abreviatura del atributo tal y como lo emite la UI.
   */
  rollSavingThrow(abilityName: string) {
    const userInfo = useCharacterStore.getState().userInfo;
    if (!userInfo) return;

    // Capa de adaptación: Mapeo bidireccional UI -> Backend
    const reverseMap: Record<string, string> = {
      'FUE': 'str', 'DES': 'dex', 'CON': 'con',
      'INT': 'int', 'SAB': 'wis', 'CAR': 'cha'
    };
    
    // Resolución segura de la clave del atributo, aplicando un fallback preventivo
    const abilityKey = reverseMap[abilityName] || abilityName.toLowerCase();

    socketManager.emit('ROLL_SAVING_THROW', { 
      worldId: userInfo.worldId,
      characterId: userInfo.characterId,
      ability: abilityKey,
    });
  }
}

export const savingThrowsService = new SavingThrowsService();