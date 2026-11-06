import AsyncStorage from '@react-native-async-storage/async-storage';

// Constantes de clave para el almacenamiento local, evitando errores tipográficos
const WORLD_ID_KEY = 'roleSyncWorldId';
const CHARACTER_ID_KEY = 'roleSyncCharacterId';
const TOKEN_KEY = 'roleSyncToken';

/**
 * Estructura de la carga útil (Payload) de una sesión válida.
 * 
 * @interface SessionData
 * @property {string} worldId - Identificador único de la partida/mundo de Foundry VTT.
 * @property {string} characterId - Identificador único del personaje seleccionado.
 * @property {string} token - Token de acceso JWT o cadena de autorización para la conexión WebSocket.
 */
export interface SessionData {
  worldId: string;
  characterId: string;
  token: string;
}

/**
 * Servicio de Autenticación y Persistencia.
 * 
 * Actúa como una capa de abstracción sobre el almacenamiento local (`AsyncStorage`).
 * Proporciona métodos asíncronos para guardar, recuperar y destruir los datos de sesión 
 * del jugador en el almacenamiento persistente del dispositivo móvil.
 * 
 * Optimiza las operaciones de Entrada/Salida (I/O) ejecutando promesas en paralelo 
 * mediante `Promise.all` para evitar cuellos de botella en la lectura/escritura en disco.
 */
class AuthService {
  
  /**
   * Persiste de forma asíncrona y en paralelo los datos de la sesión activa en el dispositivo.
   * 
   * @param {string} worldId - ID del mundo al que se conecta.
   * @param {string} characterId - ID del personaje vinculado.
   * @param {string} token - Token de autenticación.
   * @returns {Promise<void>} Promesa que se resuelve cuando todos los datos han sido guardados.
   */
  async saveSession(worldId: string, characterId: string, token: string): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(WORLD_ID_KEY, worldId),
      AsyncStorage.setItem(CHARACTER_ID_KEY, characterId),
      AsyncStorage.setItem(TOKEN_KEY, token),
    ]);
  }

  /**
   * Recupera los datos de la sesión actual desde el almacenamiento local.
   * Actúa bajo una política de "Todo o Nada": si falta algún fragmento 
   * de la sesión, se considera inválida.
   * 
   * @returns {Promise<SessionData | null>} Objeto con los datos de sesión, o `null` si no hay sesión válida o está incompleta.
   */
  async getSession(): Promise<SessionData | null> {
    const [worldId, characterId, token] = await Promise.all([
      AsyncStorage.getItem(WORLD_ID_KEY),
      AsyncStorage.getItem(CHARACTER_ID_KEY),
      AsyncStorage.getItem(TOKEN_KEY),
    ]);

    if (!worldId || !characterId || !token) return null;

    return { worldId, characterId, token };
  }

  /**
   * Destruye la sesión actual eliminando todas las claves asociadas del almacenamiento local.
   * Utilizado en el flujo de desvinculación (Logout / Teardown).
   * 
   * @returns {Promise<void>} Promesa que se resuelve cuando el almacenamiento ha sido limpiado.
   */
  async clearSession(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(WORLD_ID_KEY),
      AsyncStorage.removeItem(CHARACTER_ID_KEY),
      AsyncStorage.removeItem(TOKEN_KEY),
    ]);
  }
}

export const authService = new AuthService();