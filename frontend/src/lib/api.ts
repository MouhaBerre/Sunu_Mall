/**
 * Client API minimal pour appeler le backend Django/DRF.
 * Centralise l'URL de base pour ne pas la dupliquer partout.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status}) sur ${path}`);
  }
  return res.json();
}
