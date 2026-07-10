"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { useDeliverySocket } from "../../../../hooks/useDeliverySocket";
import type { RoutePoints } from "../../../../components/DeliveryMap";

const DeliveryMap = dynamic(() => import("../../../../components/DeliveryMap").then((m) => m.DeliveryMap), {
  ssr: false,
});

interface RouteResponse {
  points: Partial<Record<"store" | "driver" | "customer", [number, number]>>;
  distance_km: number | null;
  geometry: { coordinates: [number, number][] } | null;
}

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const { isReady, isAuthenticated } = useAuth();
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteResponse | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get(`/orders/${params.orderId}/`)
      .then((res) => {
        if (!res.data.delivery_id) {
          setError("Aucune livraison n'est encore associée à cette commande.");
          return;
        }
        setDeliveryId(res.data.delivery_id);
      })
      .catch(() => setError("Impossible de charger la commande."));
  }, [isAuthenticated, params.orderId]);

  useEffect(() => {
    if (!deliveryId) return;
    api.get(`/orders/deliveries/${deliveryId}/route/`).then((res) => setRoute(res.data));
    api.get(`/orders/deliveries/${deliveryId}/eta/`).then((res) => setEta(res.data.eta_minutes));
  }, [deliveryId]);

  const { lastUpdate } = useDeliverySocket(deliveryId);

  if (!isReady) {
    return null;
  }
  if (!isAuthenticated) {
    return <p className="p-8">Connectez-vous pour suivre votre commande.</p>;
  }
  if (error) {
    return <p className="p-8 text-slate-600">{error}</p>;
  }

  const driverPosition: [number, number] | undefined = lastUpdate
    ? [parseFloat(lastUpdate.latitude), parseFloat(lastUpdate.longitude)]
    : route?.points.driver;

  const points: RoutePoints = {
    store: route?.points.store,
    customer: route?.points.customer,
    driver: driverPosition,
  };

  const etaMinutes = lastUpdate?.eta_minutes ?? eta;

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b border-slate-200 bg-white p-4">
        <h1 className="text-lg font-bold text-slate-900">Suivi de livraison</h1>
        {etaMinutes != null && <p className="text-sm text-slate-600">Arrivée estimée dans {etaMinutes} min</p>}
        {route?.distance_km != null && <p className="text-sm text-slate-600">Distance restante : {route.distance_km} km</p>}
      </div>
      <div className="flex-1">
        <DeliveryMap points={points} geometry={route?.geometry ?? null} />
      </div>
    </div>
  );
}
