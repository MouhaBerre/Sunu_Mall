from django.contrib import admin
from .models import CommissionRule, Payment, Transaction, Refund


admin.site.register(CommissionRule)
admin.site.register(Payment)
admin.site.register(Transaction)
admin.site.register(Refund)
