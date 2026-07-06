from django.contrib import admin
from .models import (
    DeliveryZone, Driver, Delivery, DeliveryTracking,
    Address, Order, OrderItem, OrderHistory
)


admin.site.register(DeliveryZone)
admin.site.register(Driver)
admin.site.register(Delivery)
admin.site.register(DeliveryTracking)
admin.site.register(Address)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(OrderHistory)
