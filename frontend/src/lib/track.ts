/**
 * Beacon de tracking des vues de page (PB-046 — fréquentation).
 * Génère un session_id persistant côté client, envoyé avec chaque vue
 * pour permettre au backend de compter les visiteurs uniques/sessions.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const SESSION_KEY = "sunu_mall_session_id";

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function trackPageView(path: string, storeId?: string) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({ path, session_key: getSessionId(), store: storeId ?? null });
  const url = `${API_BASE_URL}/analytics/track/`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    return;
  }
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
}
