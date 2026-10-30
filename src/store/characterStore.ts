import { create } from 'zustand';

export interface UserInfo {
  roomId: string;
  characterId: string;
  userId: string;
}

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
  userInfo: UserInfo | null;
  playerInfo: PlayerInfo | null;
  healthInfo: HealthInfo | null;
  savingThrows: SavingThrow[];
  
  // Setters puros (solo guardan datos)
  setUserInfo: (info: UserInfo) => void;
  setPlayerInfo: (info: PlayerInfo) => void;
  setHealthInfo: (info: HealthInfo) => void;
  setSavingThrows: (throws: SavingThrow[]) => void;
}

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