import { useEffect, useRef, useState } from "react";
import { WS_BASE_URL, tokenStorage } from "../lib/api";

export interface DeliveryUpdate {
  type: "delivery.update";
  delivery_id: string;
  latitude: string;
  longitude: string;
  recorded_at: string;
  eta_minutes: number | null;
}

/** Se connecte au flux de position d'une livraison (PB-034/049/050). */
export function useDeliverySocket(deliveryId: string | null) {
  const [lastUpdate, setLastUpdate] = useState<DeliveryUpdate | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!deliveryId) return;
    const token = tokenStorage.getAccess();
    if (!token) return;

    const socket = new WebSocket(`${WS_BASE_URL}/ws/orders/delivery/${deliveryId}/?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onmessage = (event) => {
      setLastUpdate(JSON.parse(event.data) as DeliveryUpdate);
    };

    return () => socket.close();
  }, [deliveryId]);

  return { lastUpdate, connected };
}
