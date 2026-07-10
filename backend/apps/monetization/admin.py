from django.contrib import admin
from .models import Notification, PushDevice, SponsoredProduct, SubscriptionPlan, Subscription, Invoice


admin.site.register(Notification)
admin.site.register(PushDevice)
admin.site.register(SponsoredProduct)
admin.site.register(SubscriptionPlan)
admin.site.register(Subscription)
admin.site.register(Invoice)
