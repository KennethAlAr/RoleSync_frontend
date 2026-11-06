import { create } from 'zustand';

/**
 * Entidad de Identidad de Sesión.
 * Contiene las credenciales necesarias para vincular el cliente con la entidad del backend.
 */
export interface UserInfo {
  worldId: string;
  characterId: string;
}

/**
 * Entidad de Información Estática del Personaje.
 * Representa los atributos descriptivos, de combate y de progresión del jugador.
 */
export interface PlayerInfo {
  name: string;
  className: string;
  level: number;
  avatarImage: string | null;
  ac: number;
  initiative: string;
  speed: number;
  proficiency: string;
  inCombat: boolean;
}

/**
 * Entidad de Estado Vital.
 * Estructura de datos para la salud base y temporal del personaje.
 */
export interface HealthInfo {
  hp: number;
  maxHp: number;
  tempHp: number;
}

/**
 * Entidad de Tirada de Salvación (Saving Throw).
 * Define la competencia y el bonificador matemático de una característica específica.
 */
export interface SavingThrow {
  name: string;
  mod: string;
  proficient: boolean;
}

/**
 * Contrato del Estado Global del Personaje.
 * 
 * Define la estructura del árbol de estado para el dominio del jugador.
 * Aplica el patrón de "Dumb Store": expone el estado y mutadores puros (setters), 
 * delegando toda la lógica de negocio y efectos secundarios a la capa de Servicios.
 */
interface CharacterState {
  userInfo: UserInfo | null;
  playerInfo: PlayerInfo | null;
  healthInfo: HealthInfo | null;
  savingThrows: SavingThrow[];
  
  // Mutadores de estado
  setUserInfo: (info: UserInfo) => void;
  setPlayerInfo: (info: PlayerInfo) => void;
  setHealthInfo: (info: HealthInfo) => void;
  setSavingThrows: (throws: SavingThrow[]) => void;
}

/**
 * Gestor de Estado Global del Personaje (Character Store).
 * 
 * Implementación de Zustand para centralizar el flujo de datos del jugador.
 * Almacena la "Fuente de la Verdad" (Single Source of Truth) en el frontend 
 * tras hidratarse con los datos del servidor (Foundry VTT).
 * 
 * Sus actualizaciones disparan la re-renderización reactiva únicamente 
 * en los componentes de la interfaz que consumen las propiedades modificadas.
 */
export const useCharacterStore = create<CharacterState>((set) => ({
  userInfo: null,
  playerInfo: null,
  healthInfo: null,
  savingThrows: [],

  setUserInfo: (info) => set({ userInfo: info }),
  setPlayerInfo: (info) => set({ playerInfo: info }),
  setHealthInfo: (info) => set({ healthInfo: info }),
  setSavingThrows: (throws) => set({ savingThrows: throws }),
}));