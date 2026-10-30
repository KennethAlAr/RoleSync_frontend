import { create } from 'zustand';

export interface PlayerInfo {
  characterId: string;
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

export interface HealthInfo {
  hp: number;
  maxHp: number;
  tempHp: number;
}

export interface SavingThrow {
  name: string;
  mod: string;
  proficient: boolean;
}

interface CharacterState {
  playerInfo: PlayerInfo | null;
  healthInfo: HealthInfo | null;
  savingThrows: SavingThrow[];
  
  // Setters puros (solo guardan datos)
  setPlayerInfo: (info: PlayerInfo) => void;
  setHealthInfo: (info: HealthInfo) => void;
  setSavingThrows: (throws: SavingThrow[]) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  playerInfo: null,
  healthInfo: null,
  savingThrows: [],

  setPlayerInfo: (info) => set({ playerInfo: info }),
  setHealthInfo: (info) => set({ healthInfo: info }),
  setSavingThrows: (throws) => set({ savingThrows: throws }),
}));