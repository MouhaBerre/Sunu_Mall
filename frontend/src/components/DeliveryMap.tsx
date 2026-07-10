"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correctif classique Next.js/webpack : les icônes par défaut de Leaflet
// référencent des chemins d'assets qui ne se résolvent pas automatiquement
// dans un bundle Next.js — on les pointe vers un CDN.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface RoutePoints {
  store?: [number, number];
  driver?: [number, number];
  customer?: [number, number];
}

interface RouteGeometry {
  coordinates: [number, number][]; // [lng, lat] au format GeoJSON
}

function RecenterOnDriver({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position);
  }, [position, map]);
  return null;
}

export function DeliveryMap({ points, geometry }: { points: RoutePoints; geometry: RouteGeometry | null }) {
  const driverPosition = points.driver ?? null;
  const center = driverPosition ?? points.customer ?? points.store ?? [14.7167, -17.4677];

  const straightLine = [points.store, points.driver, points.customer].filter(Boolean) as [number, number][];
  const routeLine: [number, number][] = geometry
    ? geometry.coordinates.map(([lng, lat]) => [lat, lng])
    : straightLine;

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.store && (
        <Marker position={points.store}>
          <Popup>Boutique</Popup>
        </Marker>
      )}
      {points.customer && (
        <Marker position={points.customer}>
          <Popup>Vous</Popup>
        </Marker>
      )}
      {points.driver && (
        <Marker position={points.driver}>
          <Popup>Livreur</Popup>
        </Marker>
      )}
      {routeLine.length > 1 && <Polyline positions={routeLine} />}
      <RecenterOnDriver position={driverPosition} />
    </MapContainer>
  );
}
