/**
 * Client API minimal pour appeler le backend Django/DRF
 * depuis l'app mobile (côté acheteur).
 */
import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:8000/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}) sur ${path}`);
  }
  return res.json();
}
