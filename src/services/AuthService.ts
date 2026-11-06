// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const WORLD_ID_KEY = 'roleSyncWorldId';
const CHARACTER_ID_KEY = 'roleSyncCharacterId';
const TOKEN_KEY = 'roleSyncToken';

export interface SessionData {
  worldId: string;
  characterId: string;
  token: string;
}

class AuthService {
  async saveSession(worldId: string, characterId: string, token: string): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(WORLD_ID_KEY, worldId),
      AsyncStorage.setItem(CHARACTER_ID_KEY, characterId),
      AsyncStorage.setItem(TOKEN_KEY, token),
    ]);
  }

  async getSession(): Promise<SessionData | null> {
    const [worldId, characterId, token] = await Promise.all([
      AsyncStorage.getItem(WORLD_ID_KEY),
      AsyncStorage.getItem(CHARACTER_ID_KEY),
      AsyncStorage.getItem(TOKEN_KEY),
    ]);

    if (!worldId || !characterId || !token) return null;

    return { worldId, characterId, token };
  }

  async clearSession(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(WORLD_ID_KEY),
      AsyncStorage.removeItem(CHARACTER_ID_KEY),
      AsyncStorage.removeItem(TOKEN_KEY),
    ]);
  }
}

export const authService = new AuthService();