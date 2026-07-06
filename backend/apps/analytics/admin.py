from django.contrib import admin
from .models import Report, TrafficStatistic, SalesStatistic


admin.site.register(Report)
admin.site.register(TrafficStatistic)
admin.site.register(SalesStatistic)
