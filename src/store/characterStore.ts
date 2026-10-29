import { create } from 'zustand';
import { ImageSourcePropType } from 'react-native';
import { socketService } from '@/services/socketService';

export interface SavingThrow {
  name: string;
  mod: string;
  proficient: boolean;
}

export interface CharacterState {
  name: string;
  className: string;
  level: number;
  avatarImage: ImageSourcePropType | string;
  ac: number;
  initiative: string;
  speed: number;
  proficiency: string;
  hp: number;
  maxHp: number;
  tempHp: number;
  savingThrows: SavingThrow[];
  
  modifyHp: (amount: number) => void;
  modifyTempHp: (amount: number) => void;
  setHp: (val: number) => void;
  setTempHp: (val: number) => void;
  
  setCharacterData: (data: Partial<CharacterState>) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  name: 'Jugador',
  className: '-',
  level: 1,
  avatarImage: require('@/assets/images/web-app-manifest-512x512.png'),
  ac: 0,
  initiative: '-',
  speed: 0,
  proficiency: '-',
  hp: 0,
  maxHp: 0,
  tempHp: 0,
  savingThrows: [
    { name: 'FUE', mod: '-', proficient: false },
    { name: 'DES', mod: '-', proficient: false },
    { name: 'CON', mod: '-', proficient: false },
    { name: 'INT', mod: '-', proficient: false },
    { name: 'SAB', mod: '-', proficient: false },
    { name: 'CAR', mod: '-', proficient: false },
  ],

  modifyHp: (amount) => set((state) => {
    const newHp = Math.min(Math.max(state.hp + amount, 0), state.maxHp);

    socketService.emit('UPDATE_HP', { hp: newHp });

    return { hp: newHp };
  }),
  
  modifyTempHp: (amount) => set((state) => {
    const newTemp = Math.max(state.tempHp + amount, 0);

    socketService.emit('UPDATE_TEMP_HP', { tempHp: newTemp });

    return { tempHp: newTemp };
  }),

  setHp: (val) => set((state) => {
    const newHp = Math.min(Math.max(val, 0), state.maxHp);

    socketService.emit('UPDATE_HP', { hp: newHp });

    return { hp: newHp };
  }),
  
  setTempHp: (val) => set(() => {
    const newTemp = Math.max(val, 0);

    socketService.emit('UPDATE_TEMP_HP', { tempHp: newTemp });

    return { tempHp: newTemp };
  }),

  setCharacterData: (data) => set((state) => ({ ...state, ...data })),
}));