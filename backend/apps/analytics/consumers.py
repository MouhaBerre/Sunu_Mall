from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from apps.users.models import Role


class SalesConsumer(AsyncJsonWebsocketConsumer):
    """
    Diffuse les ventes en temps réel (PB-047).
    Rejoint soit le groupe "sales_admin" (route admin/), soit
    "sales_store_{store_id}" (route avec un store_id dans l'URL).
    """

    async def connect(self):
        user = self.scope["user"]
        store_id = self.scope["url_route"]["kwargs"].get("store_id")

        if not user.is_authenticated:
            await self.close()
            return

        if store_id is None:
            if not await self._has_role(user, Role.RoleName.ADMIN):
                await self.close()
                return
            self.group_name = "sales_admin"
        else:
            if not await self._can_access_store(user, store_id):
                await self.close()
                return
            self.group_name = f"sales_store_{store_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def sales_update(self, event):
        await self.send_json(event)

    @database_sync_to_async
    def _has_role(self, user, role_name):
        return user.has_role(role_name)

    @database_sync_to_async
    def _can_access_store(self, user, store_id):
        from apps.catalog.models import Store

        if user.has_role(Role.RoleName.ADMIN):
            return True
        return Store.objects.filter(pk=store_id, owner=user).exists()
