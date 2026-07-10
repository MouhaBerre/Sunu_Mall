import { useEffect, useRef, useState } from "react";
import { WS_BASE_URL, tokenStorage } from "../lib/api";

export interface SalesUpdate {
  type: "sales.update";
  store_id: string;
  order_id: string;
  amount: string;
  today: {
    revenue: number;
    order_count: number;
    avg_order_value: number;
    conversion_rate: number;
  };
}

/** Se connecte au flux de ventes en direct (PB-047). storeId=null -> flux admin global. */
export function useSalesSocket(storeId: string | null) {
  const [lastUpdate, setLastUpdate] = useState<SalesUpdate | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = tokenStorage.getAccess();
    if (!token) return;

    const path = storeId ? `/ws/analytics/sales/${storeId}/` : "/ws/analytics/sales/admin/";
    const socket = new WebSocket(`${WS_BASE_URL}${path}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onmessage = (event) => {
      setLastUpdate(JSON.parse(event.data) as SalesUpdate);
    };

    return () => socket.close();
  }, [storeId]);

  return { lastUpdate, connected };
}
