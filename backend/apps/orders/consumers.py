from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer


class DeliveryConsumer(AsyncJsonWebsocketConsumer):
    """Diffuse la position GPS d'une livraison en temps réel (PB-034/049/050)."""

    async def connect(self):
        user = self.scope["user"]
        delivery_id = self.scope["url_route"]["kwargs"]["delivery_id"]

        if not user.is_authenticated or not await self._can_access_delivery(user, delivery_id):
            await self.close()
            return

        self.group_name = f"delivery_{delivery_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def delivery_update(self, event):
        await self.send_json(event)

    @database_sync_to_async
    def _can_access_delivery(self, user, delivery_id):
        from apps.users.models import Role
        from .models import Delivery

        try:
            delivery = Delivery.objects.select_related("order", "order__store", "driver").get(pk=delivery_id)
        except Delivery.DoesNotExist:
            return False

        if user.has_role(Role.RoleName.ADMIN):
            return True
        if delivery.order.customer_id == user.id:
            return True
        if delivery.driver and delivery.driver.user_id == user.id:
            return True
        if delivery.order.store.owner_id == user.id:
            return True
        return False
