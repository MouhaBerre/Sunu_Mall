from django.contrib import admin
from .models import Notification, SponsoredProduct, SubscriptionPlan, Subscription, Invoice


admin.site.register(Notification)
admin.site.register(SponsoredProduct)
admin.site.register(SubscriptionPlan)
admin.site.register(Subscription)
admin.site.register(Invoice)
