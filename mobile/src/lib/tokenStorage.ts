/**
 * Stockage sécurisé des tokens JWT (expo-secure-store, Keychain/Keystore).
 * Un cache en mémoire permet un accès synchrone depuis l'intercepteur axios
 * (SecureStore est asynchrone) — hydraté une fois au démarrage de l'app.
 */
import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "sunu_mall_access_token";
const REFRESH_KEY = "sunu_mall_refresh_token";
const USER_KEY = "sunu_mall_user";

let cachedAccess: string | null = null;

export const tokenStorage = {
  getAccessSync: () => cachedAccess,

  loadInitial: async () => {
    cachedAccess = await SecureStore.getItemAsync(ACCESS_KEY);
    return cachedAccess;
  },

  getRefresh: () => SecureStore.getItemAsync(REFRESH_KEY),

  set: async (access: string, refresh: string) => {
    cachedAccess = access;
    await SecureStore.setItemAsync(ACCESS_KEY, access);
    await SecureStore.setItemAsync(REFRESH_KEY, refresh);
  },

  setAccess: async (access: string) => {
    cachedAccess = access;
    await SecureStore.setItemAsync(ACCESS_KEY, access);
  },

  clear: async () => {
    cachedAccess = null;
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  getUser: () => SecureStore.getItemAsync(USER_KEY),
  setUser: (json: string) => SecureStore.setItemAsync(USER_KEY, json),
};
