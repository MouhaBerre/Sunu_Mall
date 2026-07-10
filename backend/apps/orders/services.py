"""
Services de suivi de livraison : distance/ETA (PB-051), trajet (PB-052)
et génération du code de confirmation OTP (PB-053).
"""
import logging
import secrets
from datetime import timedelta

import requests
from django.conf import settings
from django.utils import timezone
from haversine import haversine

logger = logging.getLogger(__name__)

OTP_VALIDITY_MINUTES = 60
OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving"


def haversine_km(point_a, point_b):
    return haversine(point_a, point_b)


def estimate_eta_minutes(distance_km):
    if distance_km is None:
        return None
    speed = settings.DELIVERY_AVERAGE_SPEED_KMH
    return round((distance_km / speed) * 60, 1)


def _delivery_destination(delivery):
    address = delivery.order.address
    if not address or not address.latitude or not address.longitude:
        return None
    return (float(address.latitude), float(address.longitude))


def estimate_eta_for_delivery(delivery):
    driver = delivery.driver
    if not driver:
        return None
    position = driver.current_position()
    destination = _delivery_destination(delivery)
    if not position or not destination:
        return None
    distance = haversine_km((float(position.latitude), float(position.longitude)), destination)
    return estimate_eta_minutes(distance)


def _osrm_route(waypoints):
    """waypoints: liste de (lat, lng). Retourne (distance_km, geometry GeoJSON) ou None si échec."""
    coords = ";".join(f"{lng},{lat}" for lat, lng in waypoints)
    url = f"{OSRM_BASE_URL}/{coords}"
    try:
        response = requests.get(url, params={"overview": "full", "geometries": "geojson"}, timeout=5)
        response.raise_for_status()
        route = response.json()["routes"][0]
        return route["distance"] / 1000, route["geometry"]
    except Exception:
        logger.warning("OSRM indisponible, repli sur trajet en ligne droite.", exc_info=True)
        return None


def build_route(delivery):
    """Points (boutique/livreur/client) + distance totale + géométrie du trajet (PB-052)."""
    store = delivery.order.store
    driver = delivery.driver
    position = driver.current_position() if driver else None
    destination = _delivery_destination(delivery)

    points = {}
    if store.latitude and store.longitude:
        points["store"] = (float(store.latitude), float(store.longitude))
    if position:
        points["driver"] = (float(position.latitude), float(position.longitude))
    if destination:
        points["customer"] = destination

    waypoints = [p for p in (points.get("store"), points.get("driver"), points.get("customer")) if p]
    if len(waypoints) < 2:
        return {"points": points, "distance_km": None, "geometry": None}

    osrm_result = _osrm_route(waypoints)
    if osrm_result:
        distance_km, geometry = osrm_result
        return {"points": points, "distance_km": round(distance_km, 2), "geometry": geometry}

    total_km = sum(haversine_km(waypoints[i], waypoints[i + 1]) for i in range(len(waypoints) - 1))
    return {"points": points, "distance_km": round(total_km, 2), "geometry": None}


def generate_delivery_otp(delivery):
    from .models import DeliveryConfirmation

    code = f"{secrets.randbelow(1_000_000):06d}"
    confirmation, _ = DeliveryConfirmation.objects.update_or_create(
        delivery=delivery,
        defaults={
            "code": code,
            "expires_at": timezone.now() + timedelta(minutes=OTP_VALIDITY_MINUTES),
            "used_at": None,
        },
    )

    from apps.monetization.models import Notification
    from apps.monetization.notifications import notify

    notify(
        delivery.order.customer,
        "delivery_otp",
        "Code de confirmation de livraison",
        f"Votre code de confirmation de livraison est : {code}. "
        "Communiquez-le au livreur à la réception de votre colis.",
        channels=[Notification.Channel.EMAIL, Notification.Channel.SMS],
        metadata={"delivery_id": str(delivery.id)},
    )
    return confirmation
