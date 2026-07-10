/**
 * Client API pour l'app mobile : axios + JWT (access en cache mémoire,
 * refresh automatique sur 401) branché sur le backend Django/DRF.
 */
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { tokenStorage } from "./tokenStorage";

export const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:8000/api";
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws").replace(/\/api\/?$/, "");

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessSync();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = await tokenStorage.getRefresh();
  if (!refresh) {
    throw new Error("Aucun refresh token disponible.");
  }
  const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
  await tokenStorage.setAccess(data.access);
  return data.access;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const access = await refreshPromise;
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch {
        await tokenStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);
